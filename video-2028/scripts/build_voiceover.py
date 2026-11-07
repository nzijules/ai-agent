#!/usr/bin/env python3
"""Génère la voix-off (Piper TTS, local) + les timings de sous-titres.

Entrée  : scripts/script.json
Sorties : public/audio/voiceover.wav   (piste voix seule, 48 kHz, durée totale de la vidéo)
          src/data/captions.json       (phrases + mots minutés, utilisés par Remotion)

Usage   : python3 scripts/build_voiceover.py
"""
import io
import json
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np
from piper import PiperVoice, SynthesisConfig

ROOT = Path(__file__).resolve().parent.parent
SR = 48000
TOTAL_SECONDS = json.loads((ROOT / "src/data/timeline.json").read_text())["totalSeconds"]

cfg = json.loads((ROOT / "scripts/script.json").read_text(encoding="utf-8"))
vcfg = cfg["voice"]
model_path = ROOT / vcfg["model"]
if not model_path.exists():
    sys.exit(f"Modèle TTS absent : {model_path}\nVoir README.md (section Voix-off) pour le télécharger.")

voice = PiperVoice.load(str(model_path))
syn = SynthesisConfig(
    speaker_id=vcfg.get("speaker"),
    length_scale=vcfg.get("length_scale", 1.0),
    noise_scale=vcfg.get("noise_scale", 0.667),
    noise_w_scale=vcfg.get("noise_w", 0.8),
)

# Chaîne de traitement « voix de studio » : pitch légèrement plus grave, chaleur,
# présence, de-essing doux, compression, très légère ambiance.
ratio = 2 ** (vcfg.get("pitch_semitones", 0.0) / 12)
FILTER = ",".join([
    f"asetrate={int(22050 * ratio)}",
    f"aresample={SR}",
    f"atempo={1 / ratio:.5f}",
    "highpass=f=75",
    "equalizer=f=160:t=q:w=1.0:g=2.5",
    "equalizer=f=420:t=q:w=1.2:g=-2",
    "equalizer=f=3200:t=q:w=1.4:g=2.5",
    "equalizer=f=7500:t=q:w=2:g=-3",
    "acompressor=threshold=0.08:ratio=3.5:attack=8:release=120:makeup=2.2",
    "aecho=0.8:0.6:38|71:0.10|0.06",
    "alimiter=limit=0.89",
])


def synth(text: str) -> np.ndarray:
    buf = io.BytesIO()
    with wave.open(buf, "wb") as wf:
        voice.synthesize_wav(text, wf, syn_config=syn)
    raw = buf.getvalue()
    proc = subprocess.run(
        ["ffmpeg", "-hide_banner", "-loglevel", "error", "-f", "wav", "-i", "pipe:0",
         "-af", FILTER, "-ac", "1", "-f", "f32le", "pipe:1"],
        input=raw, capture_output=True, check=True,
    )
    return np.frombuffer(proc.stdout, dtype=np.float32).copy()


def trim_bounds(x: np.ndarray, thr=0.012):
    """Indices du début/fin de parole réelle (hors silences de bord)."""
    env = np.convolve(np.abs(x), np.ones(480) / 480, mode="same")
    idx = np.where(env > thr)[0]
    if len(idx) == 0:
        return 0, len(x)
    return idx[0], idx[-1]


track = np.zeros(int(TOTAL_SECONDS * SR), dtype=np.float32)
captions = []
prev_end = 0.0
for line in cfg["lines"]:
    audio = synth(line.get("tts", line["text"]))
    a, b = trim_bounds(audio)
    audio = audio[max(0, a - 960): b + 2400]  # garde 20 ms avant / 50 ms après
    start = float(line["start"])
    dur = len(audio) / SR
    end = start + dur
    if start < prev_end - 0.02:
        print(f"  ⚠ chevauchement : {line['id']} commence à {start:.2f}s, la ligne précédente finit à {prev_end:.2f}s")
    s = int(start * SR)
    track[s:s + len(audio)] += audio[: len(track) - s]
    prev_end = end

    # Mots : répartition proportionnelle au nombre de caractères (+ poids aux pauses de ponctuation)
    words = line["text"].split()
    speech_start = start + 0.02
    speech_end = end - 0.05
    weights = []
    for w in words:
        wt = len(w.strip("…,.:;?!")) + 1.5
        if w.endswith((",", ":", ";")):
            wt += 3
        if w.endswith(("…", ".", "?", "!")):
            wt += 2
        weights.append(wt)
    total_w = sum(weights)
    t = speech_start
    wlist = []
    for w, wt in zip(words, weights):
        d = (speech_end - speech_start) * wt / total_w
        wlist.append({"text": w, "startMs": round(t * 1000), "endMs": round((t + d) * 1000)})
        t += d
    captions.append({
        "id": line["id"], "scene": line["scene"], "text": line["text"],
        "startMs": round(start * 1000), "endMs": round(end * 1000), "words": wlist,
    })
    print(f"{line['id']:>4}  {start:6.2f}s → {end:6.2f}s  ({dur:4.2f}s)  {line['text']}")

peak = np.max(np.abs(track))
track = track / peak * 0.89  # normalisation crête -1 dBFS
pcm = (np.clip(track, -1, 1) * 32767).astype(np.int16)
out = ROOT / "public/audio/voiceover.wav"
with wave.open(str(out), "wb") as wf:
    wf.setnchannels(1)
    wf.setsampwidth(2)
    wf.setframerate(SR)
    wf.writeframes(pcm.tobytes())
(ROOT / "src/data/captions.json").write_text(json.dumps(captions, ensure_ascii=False, indent=1), encoding="utf-8")
print(f"\n✓ {out.relative_to(ROOT)}  ✓ src/data/captions.json  (dernière réplique finit à {prev_end:.2f}s)")

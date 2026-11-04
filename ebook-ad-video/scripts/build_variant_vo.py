#!/usr/bin/env python3
"""Build the voice-over line list of a variant (e.g. "economie").

For each line of voiceover/script-<variant>.json:
  - if public/audio/vo/<id>.wav exists (your recording), it is reused;
  - otherwise a provisional clip is synthesised with Piper (local, free) so the video can be previewed.
Writes src/generated/voiceover-<variant>.json, then run: python3 scripts/retime.py --variant <variant>

Usage: python3 scripts/build_variant_vo.py economie --model /path/fr-siwis-medium.onnx
       (add --force-tts to re-synthesise the provisional eXX clips)
"""
import argparse, json, os, subprocess, sys, wave
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument("variant"); ap.add_argument("--model", default=os.environ.get("PIPER_MODEL", ""))
ap.add_argument("--force-tts", action="store_true")
a = ap.parse_args()
cfg = json.load(open(os.path.join(ROOT, "src/ad.config.json"), encoding="utf-8"))
script = json.load(open(os.path.join(ROOT, f"voiceover/script-{a.variant}.json"), encoding="utf-8"))
base = {l["id"]: l for l in json.load(open(os.path.join(ROOT, "src/generated/voiceover.json"), encoding="utf-8"))["lines"]}
out = []
for ln in script["lines"]:
    i = ln["id"]; wav = os.path.join(ROOT, "public/audio/vo", i + ".wav")
    text = ln.get("text") or base[i]["text"]
    text = text.replace("{PRICE}", cfg["price"])
    if not os.path.exists(wav) or (a.force_tts and i.startswith("e")):
        if not a.model:
            sys.exit(f"{i}.wav missing: record it, or pass --model for a provisional Piper voice")
        spoken = ln["spoken"].replace("{PRICE_SPOKEN}", cfg["priceSpoken"])
        tmp = wav + ".tmp.wav"
        subprocess.run([sys.executable, "-m", "piper", "-m", a.model, "-f", tmp, "--length-scale", "1.0", "--sentence-silence", "0.05"],
                       input=spoken.encode(), check=True, capture_output=True)
        subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", tmp, "-af",
                        "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,loudnorm=I=-16:TP=-1.5",
                        "-ar", "48000", "-ac", "1", wav], check=True)
        os.remove(tmp); print("provisional TTS:", i)
    with wave.open(wav) as w:
        dur = w.getnframes() / w.getframerate()
    out.append({"id": i, "start": 0, "duration": round(dur, 3), "text": text})
json.dump({"lines": out}, open(os.path.join(ROOT, f"src/generated/voiceover-{a.variant}.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("lines:", len(out))

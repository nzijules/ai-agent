#!/usr/bin/env python3
"""Musique originale + sound design + mixage final, 100 % synthétisés (aucun sample tiers :
droits de diffusion intégralement détenus par le producteur de la vidéo).

Entrées : src/data/timeline.json, src/data/captions.json, public/audio/voiceover.wav
Sorties : public/audio/music.wav   (stem musique, déjà « ducké » sous la voix)
          public/audio/sfx.wav     (stem effets sonores)
          public/audio/mix.wav     (mix final voix + musique + SFX, -14 LUFS, utilisé par Remotion)

Usage   : python3 scripts/build_audio.py
"""
import json
import subprocess
import wave
from pathlib import Path

import numpy as np
from scipy import signal

ROOT = Path(__file__).resolve().parent.parent
SR = 48000
TL = json.loads((ROOT / "src/data/timeline.json").read_text())
CAPS = json.loads((ROOT / "src/data/captions.json").read_text())
T = TL["totalSeconds"]
N = int(T * SR)
CUES = TL["cues"]
SCENES = {s["id"]: s for s in TL["scenes"]}
rng = np.random.default_rng(2028)

BPM = 100
BEAT = 60 / BPM


# ───────────────────────── utilitaires ─────────────────────────
def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def note(n):
    """Numéro MIDI → Hz."""
    return 440.0 * 2 ** ((n - 69) / 12)


def saw(f, dur, harmonics=24, detune=0.0):
    t = t_axis(dur)
    out = np.zeros_like(t)
    for k in range(1, harmonics + 1):
        if f * k > SR / 2.2:
            break
        out += np.sin(2 * np.pi * f * k * t * (1 + detune)) / k
    return out * 0.55


def lowpass(x, fc, order=2):
    sos = signal.butter(order, min(fc, SR / 2.1), "low", fs=SR, output="sos")
    return signal.sosfilt(sos, x, axis=0)


def highpass(x, fc, order=2):
    sos = signal.butter(order, fc, "high", fs=SR, output="sos")
    return signal.sosfilt(sos, x, axis=0)


def bandpass(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, min(hi, SR / 2.1)], "band", fs=SR, output="sos")
    return signal.sosfilt(sos, x, axis=0)


def sweep_filter(x, f0, f1, kind="low", blocks=64):
    """Filtre à fréquence de coupure variable (traitement par blocs, crossfadé)."""
    n = len(x)
    out = np.zeros_like(x)
    edges = np.linspace(0, n, blocks + 1).astype(int)
    for i in range(blocks):
        a, b = edges[i], edges[i + 1]
        pad = min(2048, a)
        fc = f0 * (f1 / f0) ** (i / max(1, blocks - 1))
        seg = x[a - pad:b]
        y = lowpass(seg, fc) if kind == "low" else highpass(seg, fc)
        out[a:b] = y[pad:]
    return out


def adsr(n, a=0.01, d=0.1, s=0.7, r=0.2):
    env = np.ones(n) * s
    na, nd, nr = int(a * SR), int(d * SR), int(r * SR)
    na = min(na, n)
    env[:na] = np.linspace(0, 1, na)
    nd = min(nd, n - na)
    env[na:na + nd] = np.linspace(1, s, nd)
    nr = min(nr, n)
    env[n - nr:] *= np.linspace(1, 0, nr)
    return env


def stereo(x, pan=0.0, width=0.0):
    """Mono → stéréo, pan -1..1, width = léger décalage Haas en ms."""
    l = x * np.sqrt((1 - pan) / 2) * np.sqrt(2)
    r = x * np.sqrt((1 + pan) / 2) * np.sqrt(2)
    if width:
        d = int(width / 1000 * SR)
        r = np.concatenate([np.zeros(d), r[:-d]]) if d else r
    return np.stack([l, r], axis=1)


def place(bus, x, at):
    s = int(at * SR)
    if s >= len(bus):
        return
    if x.ndim == 1:
        x = stereo(x)
    e = min(len(bus), s + len(x))
    bus[s:e] += x[: e - s]


def make_ir(dur=2.6, decay=3.2, seed=1):
    r = np.random.default_rng(seed)
    t = t_axis(dur)
    env = np.exp(-decay * t)
    ir = np.stack([r.standard_normal(len(t)) * env, r.standard_normal(len(t)) * env], axis=1)
    ir = lowpass(ir, 6500)
    ir[: int(0.012 * SR)] = 0  # pré-délai
    return ir / np.sqrt(np.sum(ir ** 2, axis=0))


IR_HALL = make_ir(3.2, 2.4, 1)
IR_ROOM = make_ir(1.2, 5.0, 2)


def reverb(x, ir, wet=0.3):
    if x.ndim == 1:
        x = stereo(x)
    y = np.stack([signal.fftconvolve(x[:, c], ir[:, c])[: len(x)] for c in range(2)], axis=1)
    return x * (1 - wet) + y * wet


def section_env(start, end, fade_in=1.0, fade_out=1.0):
    env = np.zeros(N)
    a, b = int(start * SR), int(end * SR)
    env[a:b] = 1
    fi, fo = int(fade_in * SR), int(fade_out * SR)
    env[a:a + fi] = np.linspace(0, 1, fi)
    env[b - fo:b] = np.linspace(1, 0, fo)
    return env


# ───────────────────────── instruments ─────────────────────────
def kick(level=1.0):
    t = t_axis(0.5)
    f = 45 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-t * 7.5)
    x += 0.25 * lowpass(rng.standard_normal(len(t)), 3000) * np.exp(-t * 180)
    return np.tanh(x * 1.6) * level


def hat(level=0.2, dur=0.06):
    t = t_axis(dur)
    return highpass(rng.standard_normal(len(t)), 8000) * np.exp(-t * 70) * level


def snare(level=0.4):
    t = t_axis(0.35)
    x = bandpass(rng.standard_normal(len(t)), 1200, 7000) * np.exp(-t * 18)
    x += 0.4 * np.sin(2 * np.pi * 190 * t) * np.exp(-t * 25)
    return x * level


def pluck(f, dur=0.6, bright=4500, level=0.3):
    t = t_axis(dur)
    x = saw(f, dur, 12) * np.exp(-t * 6.5)
    x = lowpass(x, bright)
    return x * level


def pad(freqs, dur, cutoff=1400, level=0.15, attack=1.5, release=2.0):
    x = np.zeros(int(dur * SR))
    for f in freqs:
        for dt in (-0.004, 0.0, 0.0045):
            x += saw(f, dur, 16, dt)
    x = lowpass(x / (len(freqs) * 3), cutoff)
    x *= adsr(len(x), attack, 0.5, 0.85, release)
    return x * level


def sub(f, dur, level=0.35):
    t = t_axis(dur)
    x = np.sin(2 * np.pi * f * t) + 0.15 * np.sin(4 * np.pi * f * t)
    return x * adsr(len(t), 0.8, 0.2, 1.0, 1.0) * level


def bell(f, dur=2.5, level=0.12):
    t = t_axis(dur)
    x = (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 3)
         + 0.2 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 6))
    return x * np.exp(-t * 1.6) * level


# ───────────────────────── SFX ─────────────────────────
def whoosh(dur=1.1, level=0.35, rising=True):
    n = int(dur * SR)
    x = rng.standard_normal(n)
    x = sweep_filter(x, 300, 7000, "low") if rising else sweep_filter(x, 7000, 300, "low")
    env = np.sin(np.linspace(0, np.pi, n)) ** 2
    pan = np.linspace(-0.7, 0.7, n)
    l = x * env * np.sqrt((1 - pan) / 2)
    r = x * env * np.sqrt((1 + pan) / 2)
    return np.stack([l, r], axis=1) * level


def riser(dur=2.0, level=0.25):
    n = int(dur * SR)
    t = t_axis(dur)
    x = sweep_filter(rng.standard_normal(n), 200, 9000, "low") * (t / dur) ** 2
    f = 200 * (8 ** (t / dur))
    x += 0.25 * np.sin(2 * np.pi * np.cumsum(f) / SR) * (t / dur) ** 2
    return x * level


def impact(level=0.7):
    t = t_axis(3.0)
    boom = np.sin(2 * np.pi * (38 + 40 * np.exp(-t * 6)) * t) * np.exp(-t * 1.6)
    crack = lowpass(rng.standard_normal(len(t)), 5000) * np.exp(-t * 14) * 0.5
    return reverb(np.tanh((boom + crack) * 1.4), IR_HALL, 0.35) * level


def tick(level=0.25, f=2400):
    t = t_axis(0.04)
    return (np.sin(2 * np.pi * f * t) * np.exp(-t * 160) + 0.3 * hat(1, 0.04)) * level


def blip(f=1800, level=0.12):
    t = t_axis(0.09)
    return np.sin(2 * np.pi * (f + 600 * t / 0.09) * t) * np.exp(-t * 45) * level


def type_hit(level=0.3):
    """Apparition typographique : sub-thump + click."""
    t = t_axis(0.4)
    x = np.sin(2 * np.pi * (60 + 80 * np.exp(-t * 40)) * t) * np.exp(-t * 12)
    x += 0.4 * highpass(rng.standard_normal(len(t)), 4000) * np.exp(-t * 120)
    return x * level


def glitch(dur=0.35, level=0.22):
    n = int(dur * SR)
    x = np.zeros(n)
    pos = 0
    while pos < n:
        ln = int(rng.uniform(0.008, 0.04) * SR)
        f = rng.choice([180, 440, 900, 1800, 3500])
        seg = np.sign(np.sin(2 * np.pi * f * np.arange(ln) / SR)) * rng.uniform(0.3, 1)
        x[pos:pos + ln] = seg[: n - pos] if rng.random() > 0.3 else 0
        pos += ln
    x = np.round(x * 6) / 6
    return lowpass(x, 6000) * np.linspace(1, 0.2, n) * level


# ───────────────────────── composition musicale ─────────────────────────
music = np.zeros((N, 2))
S = SCENES

# 1) Ouverture : drone sombre + battements d'horloge (0 → scène 2)
A1, E2, A2, C3, E3 = note(33), note(40), note(45), note(48), note(52)
drone_end = S[2]["start"] + 1.5
d = sub(A1, drone_end, 0.30) + pad([A2, E3], drone_end, 600, 0.10, 2.5, 1.5)
place(music, reverb(stereo(d, 0, 8), IR_HALL, 0.4), 0)
place(music, riser(2.0, 0.22), S[2]["start"] - 2.0)

# 2) Accélération technologique : arpège 16e + kick (scènes 2-3)
prog_minor = [  # (racine MIDI, accord)
    (45, [57, 60, 64, 69]),  # Am
    (41, [57, 60, 65, 69]),  # F
    (38, [57, 62, 65, 69]),  # Dm
    (40, [56, 59, 64, 68]),  # E
]
tech_start, tech_end = S[2]["start"], S[4]["start"]
bar = BEAT * 4
t0 = tech_start
i = 0
while t0 < tech_end - 0.01:
    root, chord = prog_minor[i % 4]
    bdur = min(bar, tech_end - t0)
    intensity = 0.55 if t0 < S[3]["start"] else 0.8
    for step in range(16):
        st = t0 + step * BEAT / 4
        if st >= tech_end:
            break
        n_ = chord[(step * 3) % 4] + (12 if step % 8 == 7 else 0)
        place(music, stereo(pluck(note(n_), 0.35, 2600 + 1800 * intensity, 0.09 * intensity),
                            0.35 * np.sin(step), 4), st)
    place(music, stereo(sub(note(root - 12), bdur, 0.22)), t0)
    place(music, reverb(stereo(pad([note(c) for c in chord[:3]], bdur + 0.6, 1100, 0.07, 0.4, 0.6), 0, 10),
                        IR_HALL, 0.35), t0)
    for b in range(4):
        bt = t0 + b * BEAT
        if bt < tech_end - 0.05 and t0 >= tech_start + bar:
            place(music, stereo(kick(0.45 * intensity)), bt)
        for h in (0.5,):
            if bt + h * BEAT < tech_end:
                place(music, stereo(hat(0.08 * intensity), 0.3), bt + h * BEAT)
    t0 += bar
    i += 1

# 3) Tension : pulsation cardiaque + pad grave (scènes 4-5)
ten_start, ten_end = S[4]["start"], S[6]["start"]
place(music, reverb(stereo(pad([note(45), note(52), note(57)], ten_end - ten_start, 700, 0.11, 2.0, 2.0), 0, 12),
                    IR_HALL, 0.5), ten_start)
place(music, stereo(sub(note(33), S[5]["start"] - ten_start + 1, 0.22)), ten_start)
hb = ten_start + 0.4
silence_a = CUES["reflection"] - 0.3  # pause dramatique : silence quasi total
silence_b = next(c for c in CAPS if c["id"] == "s5b")["startMs"] / 1000
while hb < ten_end - 0.5:
    if not (silence_a < hb < silence_b):
        place(music, stereo(kick(0.28)), hb)
        place(music, stereo(kick(0.18)), hb + 0.28)
    hb += 1.1
# drone aigu suspendu pendant la question
place(music, reverb(stereo(bell(note(76), 6, 0.05), 0.2), IR_HALL, 0.6), S[5]["start"] + 0.5)

# 4) Risque : dissonance + glitchs (scène 6)
r_start, r_end = S[6]["start"], S[7]["start"]
place(music, reverb(stereo(pad([note(45), note(46), note(52)], r_end - r_start + 0.5, 900, 0.10, 1.0, 0.8), 0, 12),
                    IR_HALL, 0.45), r_start)
t0 = r_start
while t0 < r_end - 0.3:
    place(music, stereo(kick(0.38)), t0)
    place(music, stereo(hat(0.06), -0.3), t0 + BEAT / 2)
    t0 += BEAT
place(music, riser(2.2, 0.24), r_end - 2.2)

# 5) Renversement : passage en majeur lumineux, montée progressive (scènes 7 → 10)
prog_major = [
    (41, [65, 69, 72, 76]),  # Fmaj7
    (36, [64, 67, 72, 76]),  # C
    (43, [62, 67, 71, 74]),  # G
    (45, [64, 69, 72, 76]),  # Am
]
up_start = S[7]["start"]
up_end = S[11]["start"]  # la progression continue, allégée, sous la scène 10
t0 = up_start
i = 0
while t0 < up_end - 0.01:
    root, chord = prog_major[i % 4]
    bdur = min(bar, up_end - t0)
    in_s8 = S[8]["start"] <= t0 < S[9]["start"]
    in_s9 = S[9]["start"] <= t0 < S[10]["start"]
    in_s10 = t0 >= S[10]["start"]  # écran final + voix : pas de batterie, plus intime
    place(music, reverb(stereo(pad([note(c) for c in chord], bdur + 0.8, 2200 if not in_s8 else 3200,
                                   0.085, 0.6, 0.8), 0, 12), IR_HALL, 0.4), t0)
    place(music, stereo(sub(note(root - 12), bdur, 0.24)), t0)
    for step in range(8):
        st = t0 + step * BEAT / 2
        if st >= up_end:
            break
        place(music, reverb(stereo(pluck(note(chord[(step * 2 + i) % 4] + 12), 0.5, 5000, 0.07),
                                   0.4 * np.cos(step), 5), IR_ROOM, 0.3), st)
    for b in range(4):
        bt = t0 + b * BEAT
        if bt >= up_end:
            break
        if in_s10:
            continue
        if t0 >= up_start + bar:  # kick à partir de la 2e mesure
            place(music, stereo(kick(0.5 if (in_s8 or in_s9) else 0.38)), bt)
        if in_s8 or in_s9:
            place(music, stereo(hat(0.07), 0.25), bt + BEAT / 2)
            if b % 2 == 1:
                place(music, reverb(stereo(snare(0.22)), IR_ROOM, 0.3), bt)
    t0 += bar
    i += 1
place(music, riser(2.4, 0.2), S[8]["start"] - 2.4)
place(music, riser(2.4, 0.22), S[10]["start"] - 2.4)
place(music, riser(1.8, 0.16), S[11]["start"] - 1.8)

# 6) Appel à l'action : accord final ample (C add9) + cloche
fin = S[11]["start"]
place(music, reverb(stereo(pad([note(48), note(55), note(62), note(64), note(67)], T - fin, 2600, 0.14, 0.05, 3.0),
                           0, 14), IR_HALL, 0.5), fin)
place(music, stereo(sub(note(36), T - fin, 0.3)), fin)
place(music, reverb(stereo(bell(note(84), 4, 0.08)), IR_HALL, 0.5), fin + 0.05)

# ───────────────────────── SFX ─────────────────────────
sfx = np.zeros((N, 2))
for s in TL["scenes"][1:]:
    place(sfx, whoosh(1.0, 0.22), s["start"] - 0.55)
for k, ct in enumerate(CUES["clockTicks"]):
    place(sfx, stereo(tick(0.22, 2200 + 60 * k)), ct)
place(sfx, type_hit(0.5), CUES["clockLock"])
place(sfx, type_hit(0.32), 1.2)  # titre
for vt in CUES["verbs"]:
    place(sfx, type_hit(0.32), vt)
    for j in range(4):
        place(sfx, stereo(blip(1500 + 300 * j, 0.05), rng.uniform(-0.6, 0.6)), vt + 0.12 + j * 0.07)
# génération de rapports / data (scène 3)
for j in range(22):
    place(sfx, stereo(blip(1200 + 90 * (j % 9), 0.045), rng.uniform(-0.7, 0.7)), S[3]["start"] + 1.0 + j * 0.16)
place(sfx, whoosh(0.9, 0.2), CUES["timeMorph"] - 0.4)
place(sfx, type_hit(0.42), CUES["timeMorph"] + 0.45)
for j in range(20):  # silhouettes
    place(sfx, stereo(tick(0.07, 3000), (j % 5 - 2) / 3), CUES["silhouettes"] + j * 0.05)
for ht in CUES["highlights"]:
    place(sfx, stereo(blip(900, 0.08)), ht)
place(sfx, reverb(stereo(bell(note(81), 3, 0.06)), IR_HALL, 0.6), CUES["reflection"])
for at in CUES["absorb"]:
    place(sfx, stereo(glitch(0.3, 0.16), rng.uniform(-0.5, 0.5)), at)
place(sfx, impact(0.35), CUES["uplift"])
for wt in CUES["words"]:
    place(sfx, type_hit(0.45), wt)
for yt in CUES["years"]:
    place(sfx, stereo(tick(0.25, 2600)), yt)
    place(sfx, type_hit(0.25), yt)
place(sfx, impact(0.65), CUES["endImpact"])
place(sfx, impact(0.4), CUES["ctaImpact"])
place(sfx, type_hit(0.4), CUES["ctaContact"])

# ───────────────────────── mixage ─────────────────────────
def read_wav(p):
    with wave.open(str(p)) as wf:
        x = np.frombuffer(wf.readframes(wf.getnframes()), dtype=np.int16).astype(np.float32) / 32768
        if wf.getnchannels() == 2:
            x = x.reshape(-1, 2)
    return x


vo = read_wav(ROOT / "public/audio/voiceover.wav")
vo = np.pad(vo, (0, max(0, N - len(vo))))[:N]

# Ducking : -7 dB sur la musique quand la voix parle (attaque 60 ms, relâche 400 ms)
env = np.abs(vo)
env = signal.lfilter([1 - np.exp(-1 / (0.03 * SR))], [1, -np.exp(-1 / (0.03 * SR))], env)
active = (env > 0.02).astype(float)
att, rel = np.exp(-1 / (0.06 * SR)), np.exp(-1 / (0.4 * SR))
g = np.zeros(N)
cur = 0.0
for k in range(0, N, 48):  # résolution 1 ms
    tgt = active[k]
    coef = att if tgt > cur else rel
    cur = tgt + (cur - tgt) * coef ** 48
    g[k:k + 48] = cur
duck = 1 - g * (1 - 10 ** (-7 / 20))


def norm(x, peak):
    return x / (np.max(np.abs(x)) + 1e-9) * peak


music = norm(music, 0.5) * duck[:, None]
music = lowpass(music, 15000)
sfx = norm(sfx, 0.55)
voice = stereo(vo, 0)

mix = voice * 1.0 + music * 0.5 + sfx * 0.55
mix = np.tanh(mix * 1.1) / np.tanh(1.1)  # saturation douce de bus


def write(p, x):
    x = np.clip(x, -1, 1)
    pcm = (x * 32767).astype(np.int16)
    with wave.open(str(p), "wb") as wf:
        wf.setnchannels(2 if x.ndim == 2 else 1)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(pcm.tobytes())


out = ROOT / "public/audio"
write(out / "music.wav", music)
write(out / "sfx.wav", sfx)
write(out / "mix_raw.wav", mix)
# Normalisation loudness réseaux sociaux : -14 LUFS intégré, true peak -1 dBTP
subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", str(out / "mix_raw.wav"),
                "-af", "loudnorm=I=-14:TP=-1.0:LRA=11", "-ar", str(SR), str(out / "mix.wav")], check=True)
(out / "mix_raw.wav").unlink()
print("✓ public/audio/music.wav  ✓ public/audio/sfx.wav  ✓ public/audio/mix.wav")

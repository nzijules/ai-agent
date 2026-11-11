"""Musique de fond originale (afro-house douce, ~104 BPM) calée sur les scènes de la vidéo.
Usage : python3 scripts/music.py public/musique.wav
"""
import sys
import wave
import numpy as np

SR = 44100
DUR = 88.0
BPM = 104
BEAT = 60 / BPM
BAR = 4 * BEAT
N = int(SR * DUR)
rng = np.random.default_rng(7)

# Débuts de scènes (s) : accroche, Awa, métier, architecte, plan, chantier, visites, clés, révélation, secret, CTA
SCENES = [0, 6.6, 14.0, 21.35, 27.0, 36.2, 47.05, 53.25, 55.8, 67.05, 71.25]

L = np.zeros(N)
R = np.zeros(N)


def add(sig, t0, gain=1.0, pan=0.0):
    i = int(t0 * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    L[i : i + len(sig)] += sig * gain * np.sqrt(0.5 * (1 - pan))
    R[i : i + len(sig)] += sig * gain * np.sqrt(0.5 * (1 + pan))


def env(n, a=0.005, d=0.3):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / d)


def note(f, dur, kind='keys'):
    n = int(dur * SR)
    t = np.arange(n) / SR
    if kind == 'keys':  # piano électrique doux
        s = np.sin(2 * np.pi * f * t + 0.8 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 3))
        s += 0.25 * np.sin(2 * np.pi * f * 3 * t) * np.exp(-t * 4)
        return s * env(n, 0.004, 0.9) * (1 + 0.08 * np.sin(2 * np.pi * 4.5 * t))
    if kind == 'pad':
        s = sum(np.sin(2 * np.pi * f * (1 + d) * t + p) for d, p in [(-0.004, 0), (0, 1), (0.004, 2)]) / 3
        a = np.minimum(1, t / 0.6) * np.minimum(1, (dur - t) / 0.6)
        return s * np.clip(a, 0, 1)
    if kind == 'marimba':
        s = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 30)
        return s * env(n, 0.002, 0.25)
    if kind == 'bass':
        s = np.sin(2 * np.pi * f * t) + 0.2 * np.sin(2 * np.pi * f * 2 * t)
        return s * env(n, 0.01, 0.5)


def kick():
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = 50 + 90 * np.exp(-t * 35)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)


def lowpass(x, a=0.35):
    y = np.zeros_like(x)
    for i in range(1, len(x)):
        y[i] = y[i - 1] + a * (x[i] - y[i - 1])
    return y


def shaker():
    n = int(0.06 * SR)
    s = rng.standard_normal(n)
    s = lowpass(np.diff(s, prepend=0), 0.45)  # bande médium-aiguë, sans souffle
    return s * env(n, 0.003, 0.018)


def rim():
    n = int(0.08 * SR)
    t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 1700 * t) + 0.5 * rng.standard_normal(n)) * env(n, 0.001, 0.015)


def clap():
    n = int(0.2 * SR)
    s = rng.standard_normal(n)
    s = np.diff(s, prepend=0)
    e = sum(env(n, 0.001, 0.01) * (np.arange(n) > k * SR * 0.008) for k in range(3)) + env(n, 0.002, 0.08)
    return s * e


def whoosh(d=0.5):
    n = int(d * SR)
    t = np.arange(n) / SR
    s = rng.standard_normal(n)
    # balayage par moyenne glissante de longueur variable
    out = np.zeros(n)
    acc = np.cumsum(s)
    for i in range(n):
        w = int(2 + 40 * (1 - t[i] / d) ** 2)
        out[i] = (acc[i] - acc[max(0, i - w)]) / w
    a = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 2
    return out * a


def clink():
    n = int(1.2 * SR)
    t = np.arange(n) / SR
    return sum(np.sin(2 * np.pi * f * t) * np.exp(-t * k) for f, k in [(2093, 5), (3136, 7), (4186, 9)]) / 3


# Progression : Am9 – Fmaj7 – C(add9) – G6
CHORDS = [
    (110.0, [220.0, 261.63, 329.63, 392.0, 493.88]),
    (87.31, [174.61, 220.0, 261.63, 329.63, 392.0]),
    (65.41, [196.0, 261.63, 293.66, 329.63, 392.0]),
    (98.0, [196.0, 246.94, 293.66, 329.63, 392.0]),
]
MELODY = [659.25, 587.33, 523.25, 587.33, 659.25, 783.99, 659.25, 587.33]

reveal, cta, keys_t = SCENES[8], SCENES[10], SCENES[7]
bar_i = 0
t = 0.0
while t < DUR:
    root, ch = CHORDS[bar_i % 4]
    full = t >= SCENES[1]
    big = t >= reveal
    breakdown = keys_t - 1.5 <= t < reveal  # moment « les clés » : on retire la batterie
    # nappe
    for f in ch[:4]:
        add(note(f / 2, BAR + 0.3, 'pad'), t, 0.05)
    # accords en contretemps
    for b in range(4):
        if full and not breakdown:
            for f in ch:
                add(note(f, 0.5, 'keys'), t + b * BEAT + BEAT / 2, 0.045, pan=-0.2)
        elif b in (0, 2):
            for f in ch:
                add(note(f, 1.2, 'keys'), t + b * BEAT, 0.04, pan=-0.2)
    if full and not breakdown:
        for b in range(4):
            bt = t + b * BEAT
            add(kick(), bt, 0.55)
            add(note(root, BEAT * 0.9, 'bass'), bt, 0.32)
            for s in range(4):
                add(shaker(), bt + s * BEAT / 4, 0.035 if s % 2 else 0.018, pan=0.35)
            if b in (1, 3):
                add(rim(), bt + BEAT * 0.75, 0.10, pan=-0.3)
                if big:
                    add(clap(), bt, 0.08)
    # marimba : motif léger, plus présent après la révélation
    if t >= SCENES[2] and not breakdown:
        for k, f in enumerate(MELODY):
            if big or k % 2 == 0:
                add(note(f if not big or t < cta else f * 1.0, 0.4, 'marimba'), t + k * BEAT / 2, 0.07 if big else 0.05, pan=0.25)
    t += BAR
    bar_i += 1

# effets
for s in SCENES[1:]:
    add(lowpass(whoosh(0.45), 0.25), s - 0.3, 0.6)
add(clink(), keys_t + 0.6, 0.25)

mix = np.stack([L, R], axis=1)
# fondus d'entrée et de sortie
fade = np.ones(N)
fi, fo = int(0.8 * SR), int(2.5 * SR)
fade[:fi] = np.linspace(0, 1, fi)
fade[-fo:] = np.linspace(1, 0, fo)
mix *= fade[:, None]
# compression douce + normalisation à -1 dBFS
mix = np.tanh(mix * 1.6) / 1.6
mix /= np.abs(mix).max() / 0.89
data = (mix * 32767).astype('<i2')
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(data.tobytes())
print('ok', sys.argv[1], DUR, 's')

"""Musique de fond originale, synchronisée sur le motion design (34 s).
Nappe en la mineur, basse pulsée, tic-tac d'urgence, glitchs aux changements de scène, accord final."""
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile

import json
TL = json.load(open('timeline.json'))
SR = 44100
DUR = TL['end']
N = int(SR * DUR)
t = np.arange(N) / SR
rng = np.random.default_rng(7)
BPM = 112
BEAT = 60 / BPM

SCENES = TL['scenes']
CUTS = TL['cuts']  # pics de glitch visuels


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, 'low', fs=SR, output='sos'), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, 'high', fs=SR, output='sos'), x)


def bp(x, lo, hi):
    return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)


def saw(f, tt, detune=0.0):
    ph = (f * (1 + detune)) * tt
    return 2 * (ph - np.floor(ph + 0.5))


def window(a, b, fade=0.6):
    w = np.clip((t - a) / fade, 0, 1) * np.clip((b - t) / fade, 0, 1)
    return w


def add(buf, sig, start):
    i = int(start * SR)
    if i >= N:
        return
    j = min(N, i + len(sig))
    buf[i:j] += sig[: j - i]


L = np.zeros(N)
R = np.zeros(N)

# ---------- nappe : un accord par scène ----------
CHORDS = [
    [45, 57, 60, 64],       # la mineur — ouverture
    [41, 57, 60, 65],       # fa — voix clonée
    [38, 57, 62, 65],       # ré mineur — deepfake
    [40, 56, 59, 64],       # mi (sensible sol#) — hameçonnage, tension
    [36, 55, 60, 64],       # do — réflexes, éclaircie
    [45, 57, 61, 64, 69],   # la majeur — intégrité, résolution
]
for k, ch in enumerate(CHORDS):
    a, b = SCENES[k] - 0.3, SCENES[k + 1] + 0.3
    w = window(max(0, a), min(DUR, b), 0.7)
    for m in ch:
        f = hz(m)
        for d, pan in ((-0.004, 0.3), (0.004, 0.7)):
            s = saw(f, t, d) * w * (0.05 if m > 50 else 0.08)
            L += s * (1 - pan)
            R += s * pan
# filtre qui s'ouvre au fil du film
pad_l, pad_r = L.copy(), R.copy()
L[:] = 0
R[:] = 0
cut = 500 + 1600 * np.clip(t / (DUR - 4), 0, 1)
for seg_start in np.arange(0, DUR, 0.5):  # filtrage par blocs pour un cutoff variable
    i, j = int(seg_start * SR), int(min(DUR, seg_start + 0.5) * SR)
    fc = float(cut[i])
    L[i:j] = lp(pad_l, fc)[i:j]
    R[i:j] = lp(pad_r, fc)[i:j]

# ---------- basse pulsée (croches) ----------
ROOTS = [33, 29, 26, 28, 24, 33]
bass = np.zeros(N)
n8 = int(DUR / (BEAT / 2))
for i in range(n8):
    st = i * BEAT / 2
    if st < 1.2 or st > DUR - 0.8:
        continue
    k = max(j for j in range(6) if SCENES[j] <= st)
    f = hz(ROOTS[k])
    ln = int(BEAT / 2 * SR)
    tt = np.arange(ln) / SR
    env = np.exp(-tt * 9) * (1 - np.exp(-tt * 300))
    vel = 1.0 if i % 2 == 0 else 0.6
    note = (saw(f, tt) * 0.6 + np.sin(2 * np.pi * f * tt)) * env * vel
    add(bass, note, st)
bass = lp(bass, 420) * 0.32
L += bass
R += bass

# ---------- kick (temps 1 et 3) de la scène 1 à la scène 5 ----------
kick = np.zeros(N)
for i in range(int(DUR / BEAT)):
    st = i * BEAT
    if not (SCENES[1] <= st < SCENES[5] - 0.2) or i % 2:
        continue
    ln = int(0.35 * SR)
    tt = np.arange(ln) / SR
    f = 48 + 90 * np.exp(-tt * 30)
    ph = 2 * np.pi * np.cumsum(f) / SR
    add(kick, np.sin(ph) * np.exp(-tt * 9), st)
L += kick * 0.45
R += kick * 0.45

# ---------- tic-tac d'urgence (doubles croches, hi-hat) ----------
hat = np.zeros(N)
for i in range(int(DUR / (BEAT / 4))):
    st = i * BEAT / 4
    if not (SCENES[1] <= st < SCENES[5] - 0.4):
        continue
    ln = int(0.05 * SR)
    tt = np.arange(ln) / SR
    acc = 1.0 if i % 4 == 2 else 0.45
    add(hat, rng.standard_normal(ln) * np.exp(-tt * 90) * acc, st)
hat = hp(hat, 7000) * 0.06
L += hat * 0.8
R += hat * 1.2

# ---------- montées de bruit avant chaque coupe + impact glitch ----------
fx_l = np.zeros(N)
fx_r = np.zeros(N)
for c in CUTS:
    ln = int(0.7 * SR)
    tt = np.arange(ln) / SR
    riser = hp(rng.standard_normal(ln), 2000) * (tt / 0.7) ** 3 * 0.09
    add(fx_l, riser, c - 0.7)
    add(fx_r, riser, c - 0.7)
    # impact : sinus qui plonge + bruit « bitcrushé »
    ln = int(0.45 * SR)
    tt = np.arange(ln) / SR
    f = 900 * np.exp(-tt * 9) + 60
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 7) * 0.35
    crush = np.round(rng.standard_normal(ln) * 3) / 3 * np.exp(-tt * 18) * 0.12
    crush = np.repeat(crush[::12], 12)[:ln]
    add(fx_l, boom + crush, c)
    add(fx_r, boom - crush * 0.6, c)

# ---------- bégaiements numériques sur le « IA » de l'ouverture ----------
for g in TL['stutters']:
    ln = int(0.18 * SR)
    tt = np.arange(ln) / SR
    buzz = np.sign(np.sin(2 * np.pi * 180 * tt)) * (np.floor(tt * 60) % 2) * np.exp(-tt * 10) * 0.07
    add(fx_l, buzz, g - 0.06)
    add(fx_r, buzz, g - 0.04)
L += lp(fx_l, 9000)
R += lp(fx_r, 9000)

# ---------- carillon final : Doutez · Vérifiez · Signalez ----------
bell = np.zeros(N)
for st, m in zip(TL['bells'], (69, 72, 76, 81)):
    ln = int(2.5 * SR)
    tt = np.arange(ln) / SR
    f = hz(m)
    tone = (np.sin(2 * np.pi * f * tt) + 0.4 * np.sin(2 * np.pi * f * 2.76 * tt) * np.exp(-tt * 4)
            + 0.2 * np.sin(2 * np.pi * f * 5.4 * tt) * np.exp(-tt * 8))
    add(bell, tone * np.exp(-tt * 1.6) * 0.09, st)
L += bell * 0.9
R += bell * 1.1

# ---------- petit écho stéréo et mastering ----------
d = int(0.21 * SR)
L2 = L.copy(); R2 = R.copy()
L2[d:] += R[:-d] * 0.18
R2[d:] += L[:-d] * 0.18
mix = np.stack([L2, R2], 1)
fade = np.clip(t / 0.3, 0, 1) * np.clip((DUR - t) / 1.2, 0, 1)
mix *= fade[:, None]
mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix /= np.max(np.abs(mix)) / 0.89
wavfile.write('musique-fond.wav', SR, (mix * 32767).astype(np.int16))
print('ok', mix.shape)

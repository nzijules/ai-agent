"""Synthèse procédurale des effets sonores (100 % originaux, libres de droits).
Usage : python3 scripts/make_sfx.py  -> public/sfx/*.wav
"""
import os, numpy as np, wave
SR = 48000
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sfx")
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)

def save(name, x, gain=0.9):
    x = np.asarray(x, float)
    x = x / (np.max(np.abs(x)) + 1e-9) * gain
    st = np.stack([x, x], -1)
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())

def t(d): return np.arange(int(SR * d)) / SR
def env(n, a, r, shape=3.0):
    a = int(a * SR); e = np.ones(n)
    e[:a] = np.linspace(0, 1, a) if a else 1
    rest = n - a
    e[a:] = np.exp(-np.linspace(0, shape, rest))
    return e
def lp(x, alpha):  # passe-bas 1 pôle, alpha variable
    y = np.zeros_like(x); s = 0.0
    al = np.broadcast_to(alpha, x.shape)
    for i in range(len(x)):
        s += al[i] * (x[i] - s); y[i] = s
    return y
def bp(x, lo_alpha, hi_alpha):
    return lp(x, hi_alpha) - lp(x, lo_alpha)

# whoosh : bruit filtré balayé
d = 0.7; n = int(SR * d); tt = t(d)
sweep = np.sin(np.pi * tt / d) ** 2
noise = rng.standard_normal(n)
x = bp(noise, 0.01 + 0.03 * sweep, 0.05 + 0.35 * sweep) * sweep
save("whoosh", x, 0.8)

# soft impact : coup feutré grave + transitoire
d = 0.9; tt = t(d)
f = 90 * np.exp(-tt * 6) + 45
body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 7)
click = lp(rng.standard_normal(len(tt)), 0.25) * np.exp(-tt * 60)
save("soft_impact", body + 0.4 * click, 0.85)

# bass impact (révélation du prix) : sub qui chute + souffle
d = 1.8; tt = t(d)
f = 120 * np.exp(-tt * 9) + 38
sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 2.6)
air = lp(rng.standard_normal(len(tt)), 0.08) * np.exp(-tt * 5)
save("bass_impact", np.tanh(1.6 * sub) + 0.35 * air, 0.9)

# key click unique + rafale de frappe clavier
def key(seed):
    r = np.random.default_rng(seed); d = 0.05; tt = t(d)
    tone = np.sin(2 * np.pi * r.uniform(1800, 2600) * tt) * np.exp(-tt * 180)
    nz = bp(r.standard_normal(len(tt)), 0.15, 0.7) * np.exp(-tt * 120)
    return 0.4 * tone + nz
d = 2.4; x = np.zeros(int(SR * d)); pos = 0.0; i = 0
while pos < d - 0.06:
    k = key(i) * rng.uniform(0.6, 1.0); s = int(pos * SR)
    x[s:s + len(k)] += k; pos += rng.uniform(0.055, 0.13); i += 1
save("typing", x, 0.6)

# digital click
d = 0.12; tt = t(d)
save("click", np.sin(2 * np.pi * 3200 * tt) * np.exp(-tt * 90) + 0.5 * np.sin(2 * np.pi * 1600 * tt) * np.exp(-tt * 60), 0.6)

# UI pop : bulle montante
d = 0.25; tt = t(d)
f = 400 + 900 * (1 - np.exp(-tt * 40))
save("pop", np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 22), 0.7)

# riser : bruit + dent de scie montante
d = 2.2; tt = t(d); prog = tt / d
f = 150 * 2 ** (prog * 3)
saw = 2 * ((np.cumsum(f) / SR) % 1) - 1
nz = bp(rng.standard_normal(len(tt)), 0.01 + 0.05 * prog, 0.08 + 0.5 * prog)
x = (0.25 * lp(saw, 0.05 + 0.3 * prog) + nz) * prog ** 2
x[-int(0.03 * SR):] *= np.linspace(1, 0, int(0.03 * SR))
save("riser", x, 0.7)

# shimmer : partiels aigus scintillants
d = 1.6; tt = t(d); x = np.zeros(len(tt))
for k, fr in enumerate([1318.5, 1760, 2093, 2637, 3136, 3520]):
    x += np.sin(2 * np.pi * fr * tt + k) * (0.5 + 0.5 * np.sin(2 * np.pi * (6 + k) * tt)) * np.exp(-np.maximum(tt - 0.05 * k, 0) * 2.5) * (tt > 0.05 * k)
x *= np.minimum(tt / 0.08, 1)
save("shimmer", x, 0.5)

# success chime : arpège de cloches
d = 2.2; tt = t(d); x = np.zeros(len(tt))
for k, fr in enumerate([784, 988, 1175, 1568]):
    s = int(k * 0.09 * SR); tk = tt[: len(tt) - s]
    bell = sum(np.sin(2 * np.pi * fr * m * tk) * a for m, a in [(1, 1), (2.76, 0.35), (5.4, 0.15)])
    x[s:] += bell * np.exp(-tk * 2.2)
save("chime", x, 0.6)
print("sfx ok", sorted(os.listdir(OUT)))

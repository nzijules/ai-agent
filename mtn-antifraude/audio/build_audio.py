"""Musique originale + effets sonores synthétisés (aucun échantillon externe).
Génère audio/music.wav et audio/sfx.wav (44,1 kHz stéréo, 99 s), calés sur src/timing.ts."""
import numpy as np, wave
SR = 44100; DUR = 99.0; N = int(SR * DUR)
rng = np.random.default_rng(7)
V = lambda x: x + 1.5  # temps VO -> temps vidéo

def buf(): return np.zeros((N, 2))
def put(b, t, x, gain=1.0, pan=0.0):
    i = int(t * SR); x = x[: max(0, N - i)]
    if i < 0 or len(x) == 0: return
    l, r = np.sqrt(0.5 * (1 - pan)), np.sqrt(0.5 * (1 + pan))
    b[i:i + len(x), 0] += x * gain * l * 1.41; b[i:i + len(x), 1] += x * gain * r * 1.41
def tt(d): return np.arange(int(d * SR)) / SR
def env(d, a=0.01, r=None, curve=4.0):
    t = tt(d); e = np.minimum(1, t / max(a, 1e-4))
    return e * np.exp(-curve * t / d) if r is None else e * np.clip((d - t) / r, 0, 1)
def lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); s = 0.0
    for i in range(len(x)): s = (1 - a) * x[i] + a * s; y[i] = s
    return y
def lp_fast(x, k):  # moyenne glissante (passe-bas grossier, rapide)
    k = max(1, int(k)); return np.convolve(x, np.ones(k) / k, mode='same')
def noise(d): return rng.standard_normal(int(d * SR))
def softsaw(f, d, n=8):
    t = tt(d); return sum(np.sin(2 * np.pi * f * k * t) / k for k in range(1, n + 1)) * 0.5
def midi(m): return 440 * 2 ** ((m - 69) / 12)

# ---------------- MUSIQUE ----------------
mus = buf()
# 1) Tension (0–48.5) : drone La mineur + pulsation cardiaque
for (f, g) in [(55, 0.35), (82.4, 0.18), (110, 0.10)]:
    d = 48.8; t = tt(d)
    x = softsaw(f, d, 6) * g * (0.75 + 0.25 * np.sin(2 * np.pi * 0.11 * t))
    x *= np.clip(t / 3, 0, 1) * np.clip((d - t) / 1.2, 0, 1)
    put(mus, 0.3, x, 0.55)
pad_notes = [57, 60, 64]  # A3 C4 E4
for m in pad_notes:
    d = 32; t = tt(d); x = softsaw(midi(m), d, 5) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.2 * t + m)) * np.clip(t / 4, 0, 1) * np.clip((d - t) / 2, 0, 1)
    put(mus, 2.0, lp_fast(x, 6) * 0.08, pan=(m - 60) / 10)
# dissonance (scène 3)
for m in [46, 58, 59]:  # Bb, Bb, B
    d = 15; t = tt(d); x = softsaw(midi(m), d, 6) * np.clip(t / 2, 0, 1) * np.clip((d - t) / 1.5, 0, 1)
    put(mus, 33.6, lp_fast(x, 10) * 0.07, pan=(m - 52) / 12)
def kick(f0=60, f1=38, d=0.5, g=1.0):
    t = tt(d); f = f1 + (f0 - f1) * np.exp(-t * 18); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 7) * g
def heartbeat(t0, t1, period, g):
    t = t0
    while t < t1:
        put(mus, t, kick(g=g)); put(mus, t + 0.22, kick(g=g * 0.6)); t += period
heartbeat(4.0, 13.6, 1.0, 0.45)
heartbeat(15.0, 26.0, 1.0, 0.35)
heartbeat(28.2, 33.4, 0.6, 0.55)
heartbeat(34.0, 47.6, 0.9, 0.4)
# tic-tac montant (scène 2)
t = 28.2; per = 0.3
while t < 33.3:
    put(mus, t, np.sin(2 * np.pi * 2400 * tt(0.03)) * env(0.03, 0.001) * 0.12, pan=0.3); t += per; per = max(0.12, per * 0.96)
# risers
def riser(d, g=0.5):
    x = noise(d); t = tt(d); y = np.zeros_like(x); seg = int(0.05 * SR)
    for i in range(0, len(x), seg):
        k = int(60 - 55 * (i / len(x))); y[i:i + seg] = lp_fast(x[max(0, i - 200):i + seg + 200], k)[200 if i else 0:][:len(y[i:i + seg])]
    return y * (t / d) ** 2.2 * g
for t_end, d in [(14.2, 2.5), (33.7, 1.8), (48.5, 1.3), (82.7, 1.5)]:
    put(mus, t_end - d, riser(d, 0.35))

# 2) Positif (48.5–99) : Do – Sol – lam – Fa, 96 BPM
BPM = 96; beat = 60 / BPM; bar = 4 * beat
prog = [[48, 55, 60, 64, 67], [43, 55, 59, 62, 67], [45, 57, 60, 64, 69], [41, 53, 57, 60, 65]]
start = 48.5; nbars = int((94.6 - start) / bar) + 1
for b in range(nbars):
    t0 = start + b * bar; ch = prog[b % 4]
    lvl = 0.7 if t0 < 73 else 1.0
    for j, m in enumerate(ch):
        d = bar + 0.4; x = softsaw(midi(m), d, 6 if j else 4) * env(d, 0.25, r=0.5)
        put(mus, t0, lp_fast(x, 5) * (0.11 if j else 0.16) * lvl, pan=(j - 2) * 0.25)
    # arpège pincé (croches) à partir de 52 s
    if t0 >= 51.0:
        arp = [ch[2] + 12, ch[3] + 12, ch[4] + 12, ch[3] + 12]
        for k in range(8):
            m = arp[k % 4]; d = 0.45; tk = tt(d)
            x = (np.sin(2 * np.pi * midi(m) * tk) + 0.3 * np.sin(4 * np.pi * midi(m) * tk)) * np.exp(-tk * 9)
            put(mus, t0 + k * beat / 2, x * 0.07 * lvl, pan=0.4 * np.sin(k))
    # batterie douce à partir de 73 s
    if t0 >= 73.0:
        for k in range(4):
            put(mus, t0 + k * beat, kick(70, 45, 0.35, 0.45 if k % 2 == 0 else 0.25))
            if k % 2 == 1:
                put(mus, t0 + k * beat, lp_fast(noise(0.15), 3) * env(0.15, 0.002) * 0.12)
            put(mus, t0 + k * beat + beat / 2, noise(0.04) * env(0.04, 0.001) * 0.03, pan=0.3)
# accord final (Do majeur) – résolution
for j, m in enumerate([36, 48, 55, 60, 64, 67, 72]):
    d = 4.6; x = softsaw(midi(m), d, 5) * env(d, 0.05, r=3.5)
    put(mus, 94.6, lp_fast(x, 4) * 0.12, pan=(j - 3) * 0.15)
fade = np.ones(N); fs = int(97.6 * SR); fade[fs:] = np.linspace(1, 0, N - fs); mus *= fade[:, None]

# ---------------- EFFETS ----------------
sfx = buf()
def ping():
    a = np.sin(2 * np.pi * 1318.5 * tt(0.5)) * env(0.5, 0.003, curve=6); b = np.sin(2 * np.pi * 1760 * tt(0.7)) * env(0.7, 0.003, curve=5)
    x = np.zeros(int(0.85 * SR)); x[:len(a)] += a; x[int(0.12 * SR):int(0.12 * SR) + len(b)] += b; return x * 0.5
def whoosh(d=0.8, g=0.5):
    t = tt(d); x = noise(d); y = lp_fast(x, 8) - lp_fast(x, 60); return y * np.sin(np.pi * t / d) ** 2 * g * 3
def boom(d=1.6, g=1.0):
    return (kick(80, 32, d, 1.0) + lp_fast(noise(d), 20) * env(d, 0.002, curve=8) * 2) * g
def hit(g=0.7):
    d = 1.0; t = tt(d); x = kick(110, 45, d) + np.sin(2 * np.pi * 220 * t) * env(d, 0.002, curve=5) * 0.4 + lp_fast(noise(d), 4) * env(d, 0.001, curve=25) * 0.6
    return x * g
def glitch(d=0.6, g=0.35):
    x = np.zeros(int(d * SR)); i = 0
    while i < len(x):
        L = int(rng.uniform(0.01, 0.06) * SR); kind = rng.integers(3); seg = min(L, len(x) - i)
        if kind == 0: x[i:i + seg] = np.sign(np.sin(2 * np.pi * rng.uniform(80, 1200) * np.arange(seg) / SR))
        elif kind == 1: x[i:i + seg] = np.round(rng.standard_normal(seg) * 2) / 2
        i += L
    return x * g
def click(g=0.5):
    x = np.sin(2 * np.pi * 2000 * tt(0.02)) * env(0.02, 0.0005, curve=12) * 0.6
    n = noise(0.006) * env(0.006, 0.0005); x[:len(n)] += n
    return x * g
def pop(g=0.35):
    t = tt(0.12); f = 400 + 900 * np.exp(-t * 40); return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(0.12, 0.002, curve=10) * g
def clack(g=0.6):
    return (lp_fast(noise(0.08), 2) * env(0.08, 0.0005, curve=20) + np.sin(2 * np.pi * 820 * tt(0.08)) * env(0.08, 0.0005, curve=15) * 0.5) * g
def alarm(g=0.25, n=3):
    x = np.zeros(int(n * 0.5 * SR))
    for k in range(n):
        for j, f in enumerate([880, 660]):
            s = np.sign(np.sin(2 * np.pi * f * tt(0.22))) * env(0.22, 0.005, r=0.05); s = lp_fast(s, 6)
            i = int((k * 0.5 + j * 0.25) * SR); x[i:i + len(s)] += s[: len(x) - i]
    return x * g
def crack(g=0.7):
    d = 0.7; x = noise(d) * env(d, 0.0005, curve=14)
    for _ in range(12):
        i = rng.integers(0, int(0.4 * SR)); x[i:i + 300] += rng.standard_normal(300) * 2
    return x * g * 0.6
def gavel(g=0.9):
    d = 0.8; t = tt(d); return (np.sin(2 * np.pi * 180 * t) * env(d, 0.001, curve=14) + lp_fast(noise(d), 3) * env(d, 0.0005, curve=40) + kick(90, 40, d) * 0.8) * g
def ding(g=0.35):
    d = 1.2; t = tt(d); return (np.sin(2 * np.pi * 1046.5 * t) + 0.6 * np.sin(2 * np.pi * 1568 * t) + 0.25 * np.sin(2 * np.pi * 2093 * t)) * env(d, 0.002, curve=5) * g
def warn(g=0.3):
    x = np.zeros(int(0.8 * SR))
    for j, f in enumerate([784, 587]):
        s = np.sin(2 * np.pi * f * tt(0.3)) * env(0.3, 0.005, curve=3); i = int(j * 0.28 * SR); x[i:i + len(s)] += s
    return x * g
def shimmer(d=1.5, g=0.2):
    x = np.zeros(int(d * SR))
    for k in range(14):
        f = rng.uniform(2000, 6000); s0 = rng.uniform(0, d * 0.6); dd = d - s0; s = np.sin(2 * np.pi * f * tt(dd)) * env(dd, 0.01, curve=6)
        i = int(s0 * SR); x[i:i + len(s)] += s
    return x * g / 4
def swish(g=0.4): return whoosh(0.35, g)

E = []
E += [(0.45, ping(), 0.9, 0), (1.45, whoosh(0.7), 0.7, 0), (1.95, boom(1.6, 0.4), 0.8, 0)]
E += [(V(3.87) + 0.3 + i * 1.1, pop(), 0.6, 0.4) for i in range(3)]
E += [(9.6, whoosh(1.2, 0.4), 0.8, 0), (12.4, hit(0.6), 1, 0), (13.2, boom(1.8, 1.0), 1, 0), (13.75, glitch(0.7), 0.9, 0)]
# scène 2
E += [(14.3, whoosh(0.6), 0.6, 0)] + [(c, pop(0.45), 0.8, p) for c, p in [(V(12.98), -0.4), (V(14.76), 0), (V(18.06), 0.4)]]
E += [(V(20.44), shimmer(1.4), 1, 0), (V(22.62), boom(1.6, 0.8), 1, -0.3), (V(25.2) - 0.1, glitch(0.4), 0.9, 0), (V(25.2), hit(0.5), 1, 0)]
E += [(V(26.7) - 0.2, glitch(0.45), 0.9, 0)] + [(V(26.7) + o, pop(0.4), 0.7, -0.3) for o in (0.0, 1.0, 2.1)]
E += [(V(x), hit(0.7), 1, 0) for x in (27.05, 27.85, 28.6)] + [(V(31.15), boom(1.6, 1.0), 1, 0), (V(31.15), hit(0.8), 1, 0)]
E += [(33.35, click(0.9), 1, 0.3), (33.68, glitch(0.5), 1, 0), (33.7, boom(2.0, 1.0), 1, 0)]
# scène 3
E += [(33.7 + 0.7 + i * 0.6 + 0.33, clack(0.8), 1, -0.6 + i * 0.4) for i in range(4)]
E += [(V(34.2) + 0.9, hit(0.7), 1, 0), (V(35.9), alarm(0.22), 1, 0.3)] + [(a, pop(0.4), 0.8, 0.4) for a in (V(35.9) + 0.1, V(36.4), V(38.2))]
E += [(V(40.48) - 0.6, whoosh(1.0, 0.5), 0.7, 0), (V(42.6), crack(0.8), 1, -0.3), (V(42.6), boom(1.2, 0.5), 1, 0)]
E += [(V(45.3), gavel(1.0), 1, 0), (V(46.1), hit(0.5), 1, 0)]
# scène 4
E += [(48.3, shimmer(2.0, 0.35), 1, 0), (48.4, whoosh(1.0, 0.4), 0.7, 0), (V(49.9) + 0.1, hit(0.45), 1, 0)]
E += [(r + 0.55, ding(), 1, -0.4 + i * 0.3) for i, r in enumerate([V(51.4), V(54.07), V(57.0)])] + [(V(51.4) + o, pop(0.3), 0.7, 0) for o in (0, 2.67, 5.6)]
E += [(V(60.65), pop(0.3), 0.7, 0.4), (V(60.65) + 0.55, warn(), 1, 0.4), (V(63.2), pop(0.45), 0.8, -0.2), (V(64.5), warn(0.3), 1, 0.2)]
E += [(V(x), whoosh(0.4, 0.4), 0.8, 0) for x in (65.7, 66.94, 68.02)] + [(V(x) + 0.55, swish(0.6), 1, 0.2) for x in (65.7, 66.94, 68.02)]
E += [(V(69.6) + 0.1, boom(1.4, 0.6), 1, 0), (V(69.6) + 0.1, hit(0.5), 1, 0)]
# scène 5
E += [(73.1 + 0.15 + i * 0.35, whoosh(0.5, 0.45), 0.8, -0.5 + i * 0.5) for i in range(3)] + [(V(x), hit(0.35), 1, 0) for x in (72.2, 73.6, 75.0)]
E += [(V(76.36) - 0.3, shimmer(1.6, 0.4), 1, 0), (V(76.36) - 0.2, whoosh(0.9, 0.5), 0.8, 0), (V(76.36) + 0.15, hit(0.6), 1, 0)]
E += [(V(x), hit(0.45), 1, 0) for x in (77.92, 79.05, 80.16)] + [(82.25, whoosh(0.8, 0.6), 1, 0)]
# scène 6
E += [(V(82.0), hit(0.7), 1, 0), (V(83.6), hit(0.7), 1, 0), (V(84.78) + 0.3, shimmer(2.0, 0.45), 1, 0)] + [(V(84.78) + 0.3 + i * 0.12, pop(0.2), 0.6, -0.5 + i * 0.2) for i in range(6)]
E += [(V(89.64) + 0.7, boom(1.6, 0.6), 1, 0), (V(89.64) + 0.7, hit(0.55), 1, 0), (V(93.4), shimmer(2.5, 0.4), 1, 0), (V(93.4), boom(2.0, 0.45), 1, 0)]
for t0, x, g, p in E: put(sfx, t0, x, g, p)

def save(name, b, peak):
    b = b / (np.abs(b).max() + 1e-9) * peak
    w = wave.open(name, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(b, -1, 1) * 32767).astype('<i2').tobytes()); w.close()
save('audio/music.wav', mus, 0.8); save('audio/sfx.wav', sfx, 0.9)
print('ok', len(E), 'effets')

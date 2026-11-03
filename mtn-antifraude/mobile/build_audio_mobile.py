"""« La fraude à l'ère de l'IA » : musique originale + effets synthétisés, calés sur src/mobile/vo_timing.json.
Génère ia/music.wav et ia/sfx.wav."""
import numpy as np, wave
import json
SR = 44100
SEGS = {x["id"]: x for x in json.load(open("src/mobile/vo_timing.json", encoding="utf-8"))}
OFF = 0.5
END_VO = max(x["e"] for x in SEGS.values()) + OFF
DUR = (int((END_VO + 4.2) * 30) + 1) / 30; N = int(SR * DUR)
rng = np.random.default_rng(7)
def at(i, w=None):
    g = SEGS[i]
    if w is None: return g["s"] + OFF
    return g["s"] + OFF + (g["e"] - g["s"]) * max(0, g["text"].find(w)) / len(g["text"])

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
def kick(f0=60, f1=38, d=0.5, g=1.0):
    t = tt(d); f = f1 + (f0 - f1) * np.exp(-t * 18); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 7) * g
def riser(d, g=0.5):
    x = noise(d); t = tt(d); y = np.zeros_like(x); seg = int(0.05 * SR)
    for i in range(0, len(x), seg):
        k = int(60 - 55 * (i / len(x))); y[i:i + seg] = lp_fast(x[max(0, i - 200):i + seg + 200], k)[200 if i else 0:][:len(y[i:i + seg])]
    return y * (t / d) ** 2.2 * g

BPM = 104; beat = 60 / BPM
TURN = at('protege')
# 1) Tension (0 → TURN) : drone ré mineur, arpège synthétique, pulsation
for (f, g) in [(36.7, 0.32), (55, 0.15), (73.4, 0.07)]:
    d = TURN + 0.3; t = tt(d); x = softsaw(f, d, 6) * g * (0.75 + 0.25 * np.sin(2 * np.pi * 0.11 * t)) * np.clip(t / 2.5, 0, 1) * np.clip((d - t) / 0.4, 0, 1)
    put(mus, 0.0, x, 0.6)
arp_seq = [62, 65, 69, 72, 69, 65, 62, 60]
t0 = at('ere'); k = 0
while t0 < TURN - 0.1:
    calm = at('imaginez') - 0.2 < t0 < at('appel')
    m = arp_seq[k % 8] + (12 if (k // 16) % 2 else 0); d = 0.2; tk = tt(d)
    x = lp_fast(np.sign(np.sin(2 * np.pi * midi(m) * tk)) * np.exp(-tk * 14), 5)
    if not calm: put(mus, t0, x * (0.05 if t0 < at('derriere') else 0.065), pan=0.35 * np.sin(k * 0.7))
    t0 += beat / 2; k += 1
t0 = at('voix') - 0.3
while t0 < TURN - 0.3:
    if not (at('imaginez') - 0.2 < t0 < at('appel')): put(mus, t0, kick(60, 38, 0.45, 0.4))
    t0 += beat * 2
# sonnerie du téléphone (accroche)
for k in range(3):
    for j in range(2):
        put(mus, 0.3 + k * 1.0 + j * 0.12, np.sin(2 * np.pi * 1300 * tt(0.08)) * env(0.08, 0.002, r=0.02) * 0.10, pan=0.1)
for m in [51, 63, 64]:
    d = at('voir') - at('derriere'); t = tt(d); x = softsaw(midi(m), d, 6) * np.clip(t / 2, 0, 1) * np.clip((d - t) / 1.0, 0, 1)
    put(mus, at('derriere'), lp_fast(x, 10) * 0.055, pan=(m - 58) / 12)
for t_end, d in [(at('voix') - 0.3, 1.2), (at('derriere') + 0.6, 1.4), (TURN - 0.1, 1.4), (at('avance') - 0.2, 1.4), (at('controles') - 0.1, 1.2)]:
    put(mus, t_end - d, riser(d, 0.33))
# 2) Positif (TURN → fin) : Ré – La – Si m – Sol
prog = [[50, 57, 62, 66, 69], [45, 57, 61, 64, 69], [47, 59, 62, 66, 71], [43, 55, 59, 62, 67]]
bar = 4 * beat; nb = int((END_VO - TURN) / bar) + 1
for b in range(nb):
    t0 = TURN + b * bar; ch = prog[b % 4]
    dark = at('seule') - 0.3 < t0 < at('evolue') - 0.5
    lvl = 0.55 if dark else (0.75 if t0 < at('evolue') else 1.0)
    for j, m in enumerate(ch):
        d = bar + 0.4; x = softsaw(midi(m) * (0.94 if dark else 1), d, 6 if j else 4) * env(d, 0.2, r=0.5)
        put(mus, t0, lp_fast(x, 5) * (0.1 if j else 0.15) * lvl, pan=(j - 2) * 0.25)
    if dark: continue
    for k in range(8):
        m = [ch[2] + 12, ch[3] + 12, ch[4] + 12, ch[3] + 12][k % 4]; d = 0.4; tk = tt(d)
        x = (np.sin(2 * np.pi * midi(m) * tk) + 0.3 * np.sin(4 * np.pi * midi(m) * tk)) * np.exp(-tk * 9)
        put(mus, t0 + k * beat / 2, x * 0.06 * lvl, pan=0.4 * np.sin(k))
    for k in range(4):
        put(mus, t0 + k * beat, kick(70, 45, 0.35, 0.4 if k % 2 == 0 else 0.22) * lvl)
        put(mus, t0 + k * beat + beat / 2, noise(0.04) * env(0.04, 0.001) * 0.03, pan=0.3)
for j, m in enumerate([38, 50, 57, 62, 66, 69, 74]):
    d = DUR - END_VO + 0.2; x = softsaw(midi(m), d, 5) * env(d, 0.05, r=d * 0.8)
    put(mus, END_VO - 0.2, lp_fast(x, 4) * 0.12, pan=(j - 3) * 0.15)
fade = np.ones(N); fs = int((DUR - 1.2) * SR); fade[fs:] = np.linspace(1, 0, N - fs); mus *= fade[:, None]

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


def data(g=0.25):  # gazouillis numériques
    x = np.zeros(int(0.5 * SR))
    for k in range(10):
        f = rng.uniform(1500, 4000); s = np.sign(np.sin(2 * np.pi * f * tt(0.03))) * env(0.03, 0.001); i = int(k * 0.045 * SR); x[i:i + len(s)] += s
    return lp_fast(x, 3) * g
E = []
nep = at('q1', "n'était") - 0.1
E += [(0.1, pop(0.3), 0.6, 0), (nep, glitch(0.4), 1, 0), (nep, boom(1.6, 0.8), 1, 0)]
E += [(at('ere') - 0.25, shimmer(1.6, 0.35), 1, 0), (at('ere', 'fraude') - 0.1, glitch(0.35), 1, 0), (at('ere', 'fraude'), hit(0.6), 1, 0), (at('ere', 'nouvelle') - 0.2, whoosh(0.5, 0.4), 0.8, 0)]
for i, c in enumerate([at('voix'), at('visage'), at('piece'), at('message')]):
    E += [(c - 0.2, whoosh(0.45, 0.45), 0.8, 0.3), (c, data(0.22), 0.9, -0.3 + i * 0.2), (c + 0.05, pop(0.35), 0.8, 0)]
E += [(at('message') + 0.3 + k * 0.1, click(0.16), 0.6, 0.3) for k in range(22)]
E += [(at('imaginez') - 0.2, shimmer(1.2, 0.3), 1, 0)]
for k in range(4):
    for j in range(2): E += [(at('appel') + k * 0.9 + j * 0.12, np.sin(2 * np.pi * 1300 * tt(0.08)) * env(0.08, 0.002, r=0.02) * 0.35, 0.8, -0.2)]
E += [(at('fil', 'demande') - 0.1, pop(0.4), 0.8, 0.2)]
E += [(a - 0.1, ding(0.22), 0.8, 0.2) for a in (at('normal', 'voix'), at('ton'), at('urgence'))]
E += [(at('derriere') + 0.5, glitch(0.45), 1, 0), (at('derriere') + 0.6, boom(1.8, 0.9), 1, 0), (at('derriere', 'fraudeur') - 0.1, hit(0.7), 1, 0)]
E += [(at('objectif') - 0.35, glitch(0.3), 0.9, 0), (at('objectif'), hit(0.55), 1, 0)]
E += [(at(w) - 0.1, whoosh(0.4, 0.45), 0.8, p) for w, p in (('sim', 0.4), ('pin', -0.4), ('modif', 0.4))]
E += [(at(w) + 0.25, alarm(0.12, 1), 0.8, p) for w, p in (('sim', 0.4), ('pin', -0.4), ('modif', 0.4))]
E += [(at('voir', 'voir') - 0.1, pop(0.4), 0.8, 0), (at('voir', 'voir') + 0.65, swish(0.6), 1, 0), (at('entendre') - 0.1, pop(0.4), 0.8, 0), (at('entendre') + 0.65, swish(0.6), 1, 0), (at('voir', 'voir') + 0.6, glitch(2.5, 0.18), 0.7, 0)]
E += [(TURN - 0.15, shimmer(2.0, 0.4), 1, 0), (TURN, hit(0.7), 1, 0), (at('protege', 'rigueur') - 0.1, boom(1.4, 0.5), 1, 0)]
for i, r in enumerate(['r1', 'r2', 'r3']):
    E += [(at(r) - 0.1, pop(0.3), 0.7, 0), (at(r) + 0.6, ding(), 1, 0.2)]
E += [(at('r2', w) - 0.1, pop(0.3), 0.7, 0) for w in ('urgence', 'pression', 'autorité')] + [(at('r2', w) + 0.2, swish(0.5), 1, 0.2) for w in ('urgence', 'pression', 'autorité')]
E += [(at('r4') - 0.1, pop(0.3), 0.7, 0), (at('r4') + 0.6, warn(), 1, 0.3)]
E += [(at('seule') - 0.35, glitch(0.3), 0.9, 0), (at('seule'), boom(1.4, 0.6), 1, 0), (at('seule', 'peut') - 0.2, alarm(0.14, 2), 0.8, 0), (at('seule', 'compromettre') - 0.1, crack(0.8), 1, 0), (at('seule', 'compte') - 0.1, hit(0.7), 1, 0)]
E += [(at('evolue') - 0.3, whoosh(0.7, 0.4), 0.8, 0), (at('innovent') - 0.05, glitch(0.25), 0.9, 0), (at('innovent'), hit(0.5), 1, 0)]
E += [(at('avance') - 0.25, whoosh(0.6, 0.6), 1, 0), (at('avance'), hit(0.55), 1, 0), (at('avance', 'longueur') - 0.1, hit(0.6), 1, 0)]
E += [(at('dc') - 0.1, shimmer(2.0, 0.4), 1, 0)] + [(at('dc') + i * 0.1, pop(0.2), 0.6, -0.5 + i * 0.2) for i in range(6)] + [(at('dc', 'première') - 0.15, boom(1.6, 0.6), 1, 0), (at('dc', 'première') - 0.15, hit(0.55), 1, 0)]
E += [(at('face') - 0.25, glitch(0.35), 0.9, 0), (at('apparences') + 0.35, glitch(0.4), 1, 0), (at('apparences') + 0.35, hit(0.5), 1, 0)]
E += [(at('controles') - 0.15, shimmer(1.8, 0.4), 1, 0), (at('controles'), ding(0.4), 1, 0), (at('controles', 'contrôles') - 0.1, boom(1.6, 0.7), 1, 0), (END_VO + 0.4, shimmer(2.5, 0.35), 1, 0)]
for t0, x, g, p in E: put(sfx, t0, x, g, p)

def save(name, b, peak):
    b = b / (np.abs(b).max() + 1e-9) * peak
    w = wave.open(name, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(b, -1, 1) * 32767).astype('<i2').tobytes()); w.close()
save('mobile/music.wav', mus, 0.8); save('mobile/sfx.wav', sfx, 0.9)
print('ok', len(E), 'effets')

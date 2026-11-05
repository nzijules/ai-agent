"""Génère une musique de fond électro/afro-house originale (libre de droits) en WAV."""
import numpy as np, wave, sys
SR = 44100
BPM = 116
DUR = float(sys.argv[2]) if len(sys.argv) > 2 else 63.5
# Riser de R0 à R1 (début du CTA) ; transitions de scènes (s)
R0, R1 = 49.1, 53.1
CUTS = [4.5, 11.33, 18.6, 24.73, 31.1, 37.43, 44.8]
OUT = sys.argv[1] if len(sys.argv) > 1 else "music.wav"
beat = 60 / BPM
N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)

def add(sig, t0, gain=1.0, pan=0.0):
    i = int(t0 * SR)
    if i >= N: return
    sig = sig[: N - i]
    L[i:i+len(sig)] += sig * gain * (1 - max(pan, 0))
    R[i:i+len(sig)] += sig * gain * (1 + min(pan, 0))

def env(n, a=0.005, d=0.2):
    t = np.arange(n) / SR
    return np.minimum(t / a, 1) * np.exp(-t / d)

def kick():
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = 45 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 7) * 1.0 + np.tanh(np.sin(ph) * 3) * np.exp(-t * 30) * 0.3

def hat(open_=False):
    n = int((0.25 if open_ else 0.06) * SR)
    s = rng.standard_normal(n)
    s = np.diff(s, prepend=0); s = np.diff(s, prepend=0)
    return s * env(n, 0.001, 0.08 if open_ else 0.018) * 0.12

def clap():
    n = int(0.3 * SR); s = rng.standard_normal(n); s = np.diff(s, prepend=0)
    e = np.zeros(n)
    for k in range(3):
        o = int(k * 0.011 * SR); e[o:] += env(n - o, 0.001, 0.012 if k < 2 else 0.12)
    return s * e * 0.25

def shaker():
    n = int(0.09 * SR); s = rng.standard_normal(n); s = np.diff(s, prepend=0)
    return s * env(n, 0.02, 0.03) * 0.05

def note(freq, length, kind="saw", d=0.3, a=0.005):
    n = int(length * SR); t = np.arange(n) / SR
    if kind == "saw":
        s = sum(np.sin(2*np.pi*freq*k*t)/k for k in range(1, 12)) * 0.5
        s += sum(np.sin(2*np.pi*freq*1.007*k*t)/k for k in range(1, 12)) * 0.5
    elif kind == "sine":
        s = np.sin(2*np.pi*freq*t)
    elif kind == "pluck":
        s = np.sin(2*np.pi*freq*t + 2*np.sin(2*np.pi*freq*2*t)*np.exp(-t*12))
    elif kind == "marimba":
        s = np.sin(2*np.pi*freq*t) + 0.3*np.sin(2*np.pi*freq*4*t)*np.exp(-t*30)
    return s * env(n, a, d)

def lp(x, a):  # filtre passe-bas simple (one-pole)
    y = np.zeros_like(x); acc = 0.0
    for i in range(0, len(x)):
        acc += a * (x[i] - acc); y[i] = acc
    return y

def midi(m): return 440 * 2 ** ((m - 69) / 12)

# Progression : Am - F - C - G  (2 mesures chacune ? -> 1 mesure chacune)
chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
bass_roots = [45, 41, 48, 43]
bar = beat * 4
nbars = int(DUR / bar) + 1

# Sections (en secondes) : intro calme, build, drop, break, finale
def section(t):
    if t < 4.5: return "intro"
    if t < R0 + 2: return "main"
    if t < R1: return "riser"
    return "final"

# Pads (accords) – filtrés
pad = np.zeros(N)
for b in range(nbars):
    t0 = b * bar
    ch = chords[b % 4]
    n = int(bar * SR)
    for m in ch + [ch[0] + 12]:
        s = note(midi(m), bar + 0.3, "saw", d=6, a=0.3)
        i = int(t0 * SR); s = s[: max(0, N - i)]
        pad[i:i+len(s)] += s * 0.05
pad = lp(pad, 0.06)
add(pad, 0, 1.0)

# Sidechain enveloppe
sc = np.ones(N)
for b in range(int(DUR / beat) + 1):
    t0 = b * beat
    if section(t0) == "intro" or section(t0) == "riser": continue
    i = int(t0 * SR); n = int(beat * SR); tt = np.arange(n) / SR
    seg = 1 - 0.75 * np.exp(-tt * 9)
    sc[i:i+n] = seg[: max(0, N - i)]

drums_L = np.zeros(N); drums_R = np.zeros(N)
melo = np.zeros(N)

arp_pattern = [0, 1, 2, 3, 2, 1, 2, 0]
marimba_line = [69, 72, 76, 74, 72, 69, 67, 69]
for b in range(int(DUR / beat) + 1):
    t0 = b * beat
    sec = section(t0)
    bi = b % 4
    ch = chords[(b // 4) % 4]
    if sec in ("main", "final"):
        add(kick(), t0, 0.9)
        add(hat(), t0 + beat / 2, 1.0, 0.3)
        add(shaker(), t0 + beat / 4, 1.0, -0.4)
        add(shaker(), t0 + 3 * beat / 4, 1.0, -0.4)
        if bi in (1, 3): add(clap(), t0, 1.0)
        if bi == 3: add(hat(True), t0 + beat / 2, 0.8, 0.3)
        # basse syncopée
        root = bass_roots[(b // 4) % 4]
        for off, ln in ((0.5, 0.22), (0.75, 0.2)):
            add(note(midi(root), beat * ln * 2, "sine", d=0.25) * 0.5
                + np.tanh(note(midi(root), beat * ln * 2, "sine", d=0.25) * 2) * 0.15, t0 + beat * off, 1.0)
    if sec == "intro" and t0 > 1:
        add(hat(), t0 + beat / 2, 0.6, 0.3)
    # arpège pluck en double-croches
    if sec != "riser":
        for k in range(4):
            idx = arp_pattern[(b * 4 + k) % 8]
            m = (ch + [ch[0] + 12])[idx] + 12
            g = 0.06 if sec != "intro" else 0.05
            s = note(midi(m), beat / 2, "pluck", d=0.12)
            i = int((t0 + k * beat / 4) * SR); s = s[: max(0, N - i)]
            melo[i:i+len(s)] += s * g
    # marimba (motif afro) en croches pointées
    if sec in ("main", "final") and (b // 8) % 2 == 1:
        for k, off in enumerate((0, 0.75, 1.5)):
            if off < 1:
                m = marimba_line[(b * 2 + k) % 8]
                s = note(midi(m), 0.5, "marimba", d=0.18)
                i = int((t0 + off * beat) * SR); s = s[: max(0, N - i)]
                melo[i:i+len(s)] += s * 0.07

add(melo, 0, 1.0, 0.15)

# Riser avant le CTA (bruit filtré montant) + impact
r0, r1 = R0, R1
n = int((r1 - r0) * SR); t = np.arange(n) / SR
noise = rng.standard_normal(n); noise = np.diff(noise, prepend=0)
riser = noise * (t / (r1 - r0)) ** 2 * 0.12
sweep = np.sin(2*np.pi*np.cumsum(200 + 1800 * (t/(r1-r0))**2)/SR) * (t/(r1-r0))**2 * 0.08
add(riser + sweep, r0)
n = int(2.5 * SR); t = np.arange(n) / SR
boom = np.sin(2*np.pi*np.cumsum(30 + 80*np.exp(-t*6))/SR) * np.exp(-t*1.6) * 0.9
boom += rng.standard_normal(n) * np.exp(-t*4) * 0.1
add(boom, r1)
# petit "whoosh" à chaque changement de scène
for ts in CUTS:
    n = int(0.5 * SR); t = np.arange(n) / SR
    w = np.diff(rng.standard_normal(n), prepend=0) * np.sin(np.pi * t / 0.5) ** 2 * 0.06
    add(w, ts - 0.35, 1.0, 0.0)

# appliquer sidechain aux pads/mélodie (approximé sur tout sauf kick : approche simple)
L *= (0.55 + 0.45 * sc); R *= (0.55 + 0.45 * sc)

# fade in/out
fi = int(0.8 * SR); fo = int(3 * SR)
fade = np.ones(N); fade[:fi] = np.linspace(0, 1, fi); fade[-fo:] = np.linspace(1, 0, fo)
L *= fade; R *= fade
mx = max(np.abs(L).max(), np.abs(R).max())
L = np.tanh(L / mx * 1.2) * 0.85; R = np.tanh(R / mx * 1.2) * 0.85
data = (np.stack([L, R], 1) * 32767).astype(np.int16)
with wave.open(OUT, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(data.tobytes())
print("ok", OUT, DUR)

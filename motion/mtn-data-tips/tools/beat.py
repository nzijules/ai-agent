"""Synthesise a 120 BPM afro-pop groove + whooshes synced to the video cuts.
Mixed for phone speakers: most of the energy sits between 300 Hz and 5 kHz."""
import numpy as np, wave, sys
SR = 44100; DUR = 25.0; BEAT = 0.5
N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(3)
t_ = lambda d: np.arange(int(SR * d)) / SR

def add(sig, at, g=1.0, pan=0.0):
    i = int(at * SR); j = min(N, i + len(sig))
    if j <= i: return
    s = sig[:j - i] * g
    L[i:j] += s * (1 - pan) ** .5 if pan > 0 else s
    R[i:j] += s * (1 + pan) ** .5 if pan < 0 else s

def hp(x, a=.97):  # simple one-pole high-pass
    y = np.zeros_like(x); prev = 0.0; py = 0.0
    for n in range(len(x)):
        py = a * (py + x[n] - prev); prev = x[n]; y[n] = py
    return y

def kick():
    t = t_(.3); f = 55 + 160 * np.exp(-t * 30)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 10)
    click = rng.standard_normal(len(t)) * np.exp(-t * 400) * .6           # audible attack on phones
    knock = np.sin(2 * np.pi * 180 * t) * np.exp(-t * 35) * .5           # upper "knock"
    return np.tanh(2 * (body + click + knock)) * .8

NOISE = rng.standard_normal(SR)
def clap():
    t = t_(.25); n = hp(NOISE[:len(t)].copy(), .9)
    env = sum(np.exp(-np.maximum(0, t - d) * 60) * (t >= d) for d in (0, .011, .022)) * .4 + np.exp(-t * 14) * (t >= .022)
    tone = np.sin(2 * np.pi * 1200 * t) * np.exp(-t * 40) * .15
    return (n * env + tone) * .55

def shaker(g=1.0):
    t = t_(.07); n = hp(NOISE[2000:2000 + len(t)].copy(), .75)
    return n * np.sin(np.pi * t / .07) ** 2 * .22 * g

def hat():
    t = t_(.05); n = hp(NOISE[5000:5000 + len(t)].copy(), .6)
    return n * np.exp(-t * 80) * .25

def logdrum(freq, d=.32):
    """Amapiano-style log drum: pitched, with harmonics so it reads on small speakers."""
    t = t_(d); f = freq * (1 + .6 * np.exp(-t * 40))
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) + .7 * np.sin(2 * ph) + .45 * np.sin(3 * ph) + .25 * np.sin(4 * ph)
    return np.tanh(1.8 * s) * np.exp(-t * 7) * .38

def marimba(freq, d=.45):
    t = t_(d)
    s = np.sin(2 * np.pi * freq * t) + .5 * np.sin(2 * np.pi * freq * 4 * t) * np.exp(-t * 30) + .25 * np.sin(2 * np.pi * freq * 10 * t) * np.exp(-t * 80)
    return s * np.exp(-t * 9) * np.minimum(1, t * 800) * .32

def pad(freqs, d):
    t = t_(d); s = sum(np.sin(2 * np.pi * f * t + np.sin(2 * np.pi * 5 * t) * .3) + .3 * np.sin(4 * np.pi * f * t) for f in freqs)
    env = np.minimum(1, t / .15) * np.minimum(1, (d - t) / .2)
    return s * env * .045

def whoosh(d=.45):
    t = t_(d); n = rng.standard_normal(len(t))
    env = (t / d) ** 2 * np.exp(-((t / d) - 1) * 0)
    env = np.sin(np.pi * np.clip(t / d, 0, 1) ** 1.6) ** 2
    return hp(n, .8) * env * .35

def riser(d):
    t = t_(d); x = t / d
    s = np.sin(2 * np.pi * np.cumsum(300 + 1500 * x ** 2) / SR) * x ** 2 * .18
    return s + whoosh(d) * .8

def impact():
    t = t_(1.4)
    boom = np.sin(2 * np.pi * np.cumsum(60 + 200 * np.exp(-t * 12)) / SR) * np.exp(-t * 3.5)
    crash = hp(rng.standard_normal(len(t)), .7) * np.exp(-t * 3) * .35
    return np.tanh(1.5 * (boom + crash)) * .9

FIRST, SLIDE, NS = 1.0, 3.0, 7
end = FIRST + NS * SLIDE - 0.25
# A minor - F - C - G  (one chord per bar of 4 beats)
prog = [(220.0, [440, 523.3, 659.3]), (174.6, [349.2, 440, 523.3]), (261.6, [523.3, 659.3, 784]), (196.0, [392, 493.9, 587.3])]
melody = [0, 2, 1, 2, 0, 1, 2, 1]   # index into chord tones on 8th notes 2,4..

add(riser(1.0), 0.0, .9)
b = 0; t = FIRST
while t < DUR - 0.5:
    bib = b % 4; bar = (b // 4) % 4
    root, ch = prog[bar]
    playing = t < end
    add(kick(), t, .85)
    if bib in (1, 3): add(clap(), t, 1.0)
    for s16 in range(4):
        add(shaker(1.0 if s16 % 2 else .6), t + s16 * .125, 1.0, pan=.3)
    add(hat(), t + .25, 1.0, pan=-.3)
    if playing:
        # log-drum bass pattern (syncopated)
        if bib == 0: add(logdrum(root / 2), t, 1.0)
        if bib == 1: add(logdrum(root / 2), t + .25, .8)
        if bib == 2: add(logdrum(root / 2 * 1.5), t + .25, .8)
        if bib == 3: add(logdrum(root), t + .125, .7)
        # marimba hook
        mi = (b * 2) % 8
        add(marimba(ch[melody[mi]]), t + .25, 1.0, pan=-.2)
        if bib in (1, 3): add(marimba(ch[melody[(mi + 1) % 8]] * 2), t + .375, .55, pan=.25)
        if bib == 0: add(pad(ch, BEAT * 4), t, 1.0)
    b += 1; t += BEAT

for k in range(1, NS):
    add(whoosh(.45), FIRST + k * SLIDE - .42, 1.0)
add(whoosh(.6), end - .35, 1.2)
add(impact(), end + .25, .9)
# outro chord swell
add(pad([440, 523.3, 659.3, 880], 2.4), end + .25, 1.6)

mix = np.stack([L, R], 1)
fade = np.ones(N); fl = int(SR * 1.0); fade[-fl:] = np.linspace(1, 0, fl)
mix *= fade[:, None]
mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix /= np.abs(mix).max() / .95
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())

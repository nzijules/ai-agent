"""Synthesise a 120 BPM afro-pop style groove + whooshes synced to the video cuts."""
import numpy as np, wave, sys
SR = 44100; DUR = 25.0; BEAT = 0.5
N = int(SR * DUR); out = np.zeros(N)
rng = np.random.default_rng(3)
t_ = lambda d: np.arange(int(SR * d)) / SR
def add(sig, at, g=1.0):
    i = int(at * SR); j = min(N, i + len(sig)); out[i:j] += sig[:j - i] * g
def kick():
    t = t_(.35); f = 45 + 110 * np.exp(-t * 28)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)
def clap():
    t = t_(.22); n = rng.standard_normal(len(t))
    env = np.exp(-t * 22) + .6 * np.exp(-((t - .012) * 300) ** 2) + .5 * np.exp(-((t - .024) * 300) ** 2)
    n = np.diff(n, prepend=0)  # crude high-pass
    return n * env * .5
def hat(d=.05, dec=70):
    t = t_(d); n = np.diff(rng.standard_normal(len(t)), prepend=0); n = np.diff(n, prepend=0)
    return n * np.exp(-t * dec) * .12
def bass(freq, d=.42):
    t = t_(d); s = np.sin(2 * np.pi * freq * t) + .3 * np.sin(4 * np.pi * freq * t)
    return np.tanh(1.5 * s) * np.minimum(1, t * 200) * np.exp(-t * 4) * .35
def pluck(freq, d=.3):
    t = t_(d); s = sum(np.sin(2 * np.pi * freq * h * t) / h for h in (1, 2, 3))
    return s * np.exp(-t * 12) * .12
def whoosh(d=.5):
    t = t_(d); n = rng.standard_normal(len(t))
    # sweep via moving-average of varying width
    env = np.sin(np.pi * t / d) ** 2
    k = np.convolve(n, np.ones(6) / 6, 'same')
    return (n - k) * env * .22
def riser(d):
    t = t_(d); return np.sin(2 * np.pi * np.cumsum(200 + 900 * (t / d) ** 2) / SR) * (t / d) ** 2 * .08 + whoosh(d) * .6
def impact():
    t = t_(1.2); s = np.sin(2 * np.pi * np.cumsum(40 + 80 * np.exp(-t * 10)) / SR) * np.exp(-t * 3) * .9
    c = clap(); s[:len(c)] += c * .8; return s

FIRST, SLIDE, NS = 1.0, 3.0, 7
end = FIRST + NS * SLIDE - 0.25
roots = [55.0, 55.0, 65.41, 49.0]          # A, A, C, G (per bar)
chord = [[220, 261.6, 329.6], [220, 261.6, 329.6], [261.6, 329.6, 392], [196, 246.9, 293.7]]
add(riser(1.0), 0.0)
b = 0
t = FIRST
while t < DUR - 0.6:
    beat_in_bar = b % 4; bar = (b // 4) % 4
    add(kick(), t, .9)
    if beat_in_bar in (1, 3): add(clap(), t, .9)
    add(hat(), t + .25); add(hat(.03, 120), t + .125, .6); add(hat(.03, 120), t + .375, .6)
    if t < end:
        add(bass(roots[bar]), t + (0 if beat_in_bar % 2 == 0 else .25))
        if beat_in_bar in (0, 2): add(pluck(chord[bar][beat_in_bar // 2 + (b % 2)]), t + .25)
        if beat_in_bar == 3: add(pluck(chord[bar][2]), t + .375)
    b += 1; t += BEAT
for k in range(1, NS):
    add(whoosh(.45), FIRST + k * SLIDE - .4, 1.0)
add(whoosh(.6), end - .3, 1.2)
add(impact(), end + .25, .8)
# master: gentle fade out + limiter
fade = np.ones(N); fl = int(SR * 1.2); fade[-fl:] = np.linspace(1, 0, fl)
out = np.tanh(out * fade * 1.2) * .85
st = np.stack([out, out], 1)
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype(np.int16).tobytes())

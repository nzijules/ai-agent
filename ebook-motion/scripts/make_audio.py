"""Generate an original, royalty-free background track + SFX with numpy only.

Usage: python3 scripts/make_audio.py
Outputs: public/music.wav, public/sfx-*.wav
"""
import numpy as np
import wave
import os

SR = 44100
BPM = 120
BEAT = 60 / BPM
BAR = BEAT * 4
DURATION = 64.0  # seconds (32 bars)
OUT = os.path.join(os.path.dirname(__file__), "..", "public")
rng = np.random.default_rng(7)


def write_wav(path, data):
    data = np.asarray(data)
    if data.ndim == 1:
        data = np.stack([data, data], axis=1)
    peak = np.max(np.abs(data)) or 1
    data = data / peak * 0.89
    pcm = (data * 32767).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def note_hz(n):  # MIDI -> Hz
    return 440.0 * 2 ** ((n - 69) / 12)


def t_arr(sec):
    return np.arange(int(sec * SR)) / SR


def add(buf, sig, start_sec, gain=1.0):
    s = int(start_sec * SR)
    if s >= len(buf):
        return
    e = min(len(buf), s + len(sig))
    buf[s:e] += sig[: e - s] * gain


def saw(freq, t, harmonics=14):
    out = np.zeros_like(t)
    for k in range(1, harmonics + 1):
        if freq * k > 12000:
            break
        out += np.sin(2 * np.pi * freq * k * t) / k * (0.85 ** (k - 1))
    return out


def square(freq, t, harmonics=9):
    out = np.zeros_like(t)
    for k in range(1, harmonics * 2, 2):
        if freq * k > 12000:
            break
        out += np.sin(2 * np.pi * freq * k * t) / k
    return out


def hp(x):
    return np.diff(np.diff(x, prepend=0), prepend=0)


def adsr(n, a=0.01, d=0.1, s=0.7, r=0.2):
    env = np.ones(n) * s
    A, D, R = int(a * SR), int(d * SR), int(r * SR)
    A = min(A, n)
    env[:A] = np.linspace(0, 1, A)
    D2 = min(D, n - A)
    env[A:A + D2] = np.linspace(1, s, D2)
    R2 = min(R, n)
    env[n - R2:] *= np.linspace(1, 0, R2)
    return env


# ---------- instruments ----------
def kick():
    t = t_arr(0.45)
    f = 45 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 7.5) + 0.3 * np.sin(ph * 2) * np.exp(-t * 30)


def hat(open_=False):
    t = t_arr(0.25 if open_ else 0.06)
    return hp(rng.standard_normal(len(t))) * np.exp(-t * (14 if open_ else 70)) * 0.25


def clap():
    t = t_arr(0.3)
    n = hp(rng.standard_normal(len(t)))
    env = np.exp(-t * 18)
    for off in (0.0, 0.012, 0.024):  # flam
        env += np.exp(-np.clip(t - off, 0, None) * 120) * (t >= off) * 0.6
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * 0.6
    return (n * 0.5 + tone) * env * 0.5


def pad(notes, dur):
    t = t_arr(dur)
    out = np.zeros_like(t)
    for n in notes:
        for det in (-0.12, 0.0, 0.12):
            out += saw(note_hz(n + det), t, 10)
    return out * adsr(len(t), 0.4, 0.3, 0.8, 0.5) / (len(notes) * 3)


def pluck(n, dur=0.22):
    t = t_arr(dur)
    return square(note_hz(n), t, 6) * np.exp(-t * 16) * 0.35


def bass(n, dur):
    t = t_arr(dur)
    f = note_hz(n)
    sig = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) + 0.15 * saw(f, t, 6)
    return sig * adsr(len(t), 0.005, 0.08, 0.7, 0.05)


def riser(dur):
    t = t_arr(dur)
    p = t / dur
    noise = hp(rng.standard_normal(len(t))) * (p ** 2) * 0.35
    f = 200 + 1800 * p ** 2
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * (p ** 3) * 0.25
    return noise + tone


def impact():
    t = t_arr(2.5)
    f = 30 + 70 * np.exp(-t * 6)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2)
    crash = hp(rng.standard_normal(len(t))) * np.exp(-t * 3) * 0.25
    return boom + crash


def whoosh(dur=0.7):
    t = t_arr(dur)
    p = t / dur
    env = np.sin(np.pi * p) ** 2
    n = rng.standard_normal(len(t))
    # moving "filter": crossfade lowpassed (cumsum-smoothed) and highpassed noise
    lp = np.convolve(n, np.ones(40) / 40, mode="same")
    sig = lp * (1 - p) * 2.5 + hp(n) * p * 0.6
    return sig * env


def pop():
    t = t_arr(0.15)
    f = 900 * np.exp(-t * 25) + 300
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 30)


def cash():
    t = t_arr(0.9)
    out = np.zeros_like(t)
    for i, n in enumerate((88, 93, 100)):
        tt = np.clip(t - i * 0.07, 0, None)
        out += np.sin(2 * np.pi * note_hz(n) * tt) * np.exp(-tt * 6) * (t >= i * 0.07)
    return out * 0.6


# ---------- arrangement ----------
N = int(DURATION * SR)
drums = np.zeros(N)
music = np.zeros(N)  # gets side-chained
leads = np.zeros(N)
fx = np.zeros(N)

# Am - F - C - G  (A minor, uplifting loop)
prog = [
    ([57, 60, 64, 69], 45, [69, 72, 76, 81]),
    ([53, 57, 60, 65], 41, [65, 69, 72, 77]),
    ([48, 52, 55, 60], 36, [72, 76, 79, 84]),
    ([55, 59, 62, 67], 43, [67, 71, 74, 79]),
]

TOTAL_BARS = int(DURATION / BAR)
BREAK = (24, 25)  # bars 24-25: breakdown + riser before CTA drop (bar 26 = 52s)
for bar in range(TOTAL_BARS):
    t0 = bar * BAR
    chord, root, arp = prog[bar % 4]
    intro = bar < 2
    breakdown = BREAK[0] <= bar <= BREAK[1]
    outro = bar >= TOTAL_BARS - 1

    music_gain = 0.55 if (intro or breakdown) else 0.45
    add(music, pad(chord, BAR + 0.4), t0, music_gain)

    # arp 16ths
    if not outro:
        for i in range(16):
            add(leads, pluck(arp[i % 4] + (12 if (i % 8) == 7 else 0)), t0 + i * BEAT / 4,
                0.28 if (intro or breakdown) else 0.22)

    if intro or breakdown or outro:
        continue

    for b in range(4):
        add(drums, kick(), t0 + b * BEAT, 1.0)
        add(drums, hat(), t0 + b * BEAT + BEAT / 2, 0.9)
        add(drums, hat(), t0 + b * BEAT + BEAT / 4 * 3, 0.4)
        if b in (1, 3):
            add(drums, clap(), t0 + b * BEAT, 0.8)
        # offbeat bass
        add(music, bass(root, BEAT / 2 * 0.9), t0 + b * BEAT + BEAT / 2, 0.55)
        add(music, bass(root, BEAT / 4 * 0.9), t0 + b * BEAT + BEAT / 4 * 3, 0.3)
    if bar % 4 == 3:
        add(drums, hat(True), t0 + 3.5 * BEAT, 0.8)

# Risers & impacts at key moments
add(fx, riser(BAR * 2), 0.0, 0.5)                       # intro build to first drop (4s)
add(fx, impact(), 2 * BAR, 0.7)
add(fx, riser(BAR * 2), BREAK[0] * BAR, 0.9)            # build into CTA
add(fx, impact(), (BREAK[1] + 1) * BAR, 1.0)
add(fx, impact(), (TOTAL_BARS - 1) * BAR, 0.6)          # ending hit

# Side-chain pump on music driven by kicks
pump = np.ones(N)
pt = t_arr(BEAT)
shape = 1 - 0.6 * np.exp(-pt * 9)
for bar in range(TOTAL_BARS):
    if bar < 2 or BREAK[0] <= bar <= BREAK[1] or bar >= TOTAL_BARS - 1:
        continue
    for b in range(4):
        s = int((bar * BAR + b * BEAT) * SR)
        e = min(N, s + len(shape))
        pump[s:e] = shape[: e - s]

mix = drums * 0.55 + music * pump * 0.8 + leads * pump * 0.5 + fx * 0.6
# fades
fade_in = int(0.3 * SR)
mix[:fade_in] *= np.linspace(0, 1, fade_in)
fade_out = int(2.5 * SR)
mix[-fade_out:] *= np.linspace(1, 0, fade_out)
# soft clip
mix = np.tanh(mix * 1.4)

# simple stereo widening: leads slightly delayed on right
left = mix
right = mix.copy()
d = int(0.012 * SR)
right[d:] = mix[:-d] * 0.6 + mix[d:] * 0.4
write_wav(os.path.join(OUT, "music.wav"), np.stack([left, right], axis=1))

write_wav(os.path.join(OUT, "sfx-whoosh.wav"), whoosh())
write_wav(os.path.join(OUT, "sfx-pop.wav"), pop())
write_wav(os.path.join(OUT, "sfx-cash.wav"), cash())
write_wav(os.path.join(OUT, "sfx-impact.wav"), impact())
print("done")

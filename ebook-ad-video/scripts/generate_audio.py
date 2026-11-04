#!/usr/bin/env python3
"""Synthesise an ORIGINAL music bed and sound effects with numpy (no samples, no licences needed).

Outputs (44.1 kHz stereo WAV):
  public/audio/music.mp3            90 s music bed synced to the scene timeline
  public/audio/sfx/*.wav            whoosh, pop, impact, riser, ding, click, cash
Usage: python3 scripts/generate_audio.py
"""
import json, os, wave
import numpy as np

SR = 44100
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rng = np.random.default_rng(7)
import sys
VARIANT = sys.argv[1] if len(sys.argv) > 1 else ""   # e.g. "economie" -> timeline-economie.json, music-economie.mp3
_SUF = f"-{VARIANT}" if VARIANT else ""
_TL = json.load(open(os.path.join(ROOT, f"src/generated/timeline{_SUF}.json")))
_SC = {x["id"]: x for x in _TL["scenes"]}
DUR = float(_TL["total"])
BPM = 100.0
BEAT = 60.0 / BPM          # 0.6 s
BAR = 4 * BEAT             # 2.4 s
PIVOT = _SC["S3-Tuteur"]["from"] if "S3-Tuteur" in _SC else _SC["S4-Revelation"]["from"]       # "Et si l'IA devenait un vrai tuteur ?"
REVEAL = _SC["S4-Revelation"]["from"]  # book reveal


def write(path, x):
    x = np.asarray(x, dtype=np.float64)
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    peak = np.max(np.abs(x)) or 1.0
    x = x / peak * 0.89
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())


def t_axis(d):
    return np.arange(int(d * SR)) / SR


def lowpass(x, cutoff):
    """One-pole low-pass; cutoff may be scalar or array."""
    cutoff = np.broadcast_to(np.asarray(cutoff, dtype=np.float64), x.shape)
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)):
        acc = (1 - a[i]) * x[i] + a[i] * acc
        y[i] = acc
    return y


def lp_fast(x, cutoff):
    # Scalar cutoff, vectorised via scipy-free IIR using lfilter-like cumulative trick (2 passes for 12 dB/oct)
    a = np.exp(-2 * np.pi * cutoff / SR)
    for _ in range(2):
        y = np.empty_like(x); acc = 0.0
        b = 1 - a
        for i in range(0, len(x)):
            acc = b * x[i] + a * acc
            y[i] = acc
        x = y
    return x


def reverb(x, seconds=2.2, mix=0.25):
    n = int(seconds * SR)
    ir = rng.standard_normal(n) * np.exp(-np.linspace(0, 7, n))
    ir[:int(0.012 * SR)] = 0
    ir /= np.sqrt(np.sum(ir ** 2))
    L = len(x) + n
    nfft = 1 << (L - 1).bit_length()
    wet = np.fft.irfft(np.fft.rfft(x, nfft) * np.fft.rfft(ir, nfft), nfft)[:len(x)]
    return x * (1 - mix) + wet * mix * 0.6


def note(n):  # MIDI -> Hz
    return 440.0 * 2 ** ((n - 69) / 12)


def env_adsr(n, a, d, s, r, total):
    e = np.ones(n) * s
    ai, di, ri = int(a * SR), int(d * SR), int(r * SR)
    ai = max(1, min(ai, n)); ri = min(ri, n)  # very short notes (end of a section)
    e[:ai] = np.linspace(0, 1, ai)
    e[ai:ai + di] = np.linspace(1, s, len(e[ai:ai + di]))
    if ri > 0:
        e[-ri:] *= np.linspace(1, 0, ri)
    return e


def pad_chord(midis, d, bright=1800):
    t = t_axis(d)
    x = np.zeros_like(t)
    for m in midis:
        f = note(m)
        for det in (-0.12, 0.0, 0.11):
            ph = rng.uniform(0, 2 * np.pi)
            ff = f * 2 ** (det / 12)
            # band-limited-ish saw: few harmonics
            for k in range(1, 9):
                x += np.sin(2 * np.pi * ff * k * t + ph * k) / k * (0.9 ** k)
    x /= len(midis) * 3 * 2.5
    x = lp_fast(x, bright)
    return x * env_adsr(len(t), 0.5, 0.4, 0.85, 0.7, d)


def pluck(m, d=0.5, bright=1.0):
    t = t_axis(d)
    f = note(m)
    x = (np.sin(2 * np.pi * f * t) + 0.45 * bright * np.sin(2 * np.pi * 2 * f * t) + 0.18 * bright * np.sin(2 * np.pi * 3 * f * t))
    return x * np.exp(-t * 7.5) * np.minimum(1, t * 400)


def bass(m, d):
    t = t_axis(d)
    f = note(m)
    x = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t)
    return x * env_adsr(len(t), 0.01, 0.15, 0.7, 0.08, d)


def kick():
    t = t_axis(0.45)
    f = 45 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 7) * 1.1


def hat(open_=False):
    d = 0.25 if open_ else 0.06
    t = t_axis(d)
    n = rng.standard_normal(len(t))
    n = n - lp_fast(n, 6000)
    return n * np.exp(-t * (14 if open_ else 60)) * 0.35


def clap():
    t = t_axis(0.25)
    n = rng.standard_normal(len(t))
    n = n - lp_fast(n, 900)
    e = np.exp(-t * 22) + 0.6 * np.exp(-np.maximum(t - 0.012, 0) * 30) * (t > 0.012)
    return n * e * 0.55


def place(buf, x, at, gain=1.0):
    i = int(at * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(x))
    buf[i:j] += x[:j - i] * gain


def music():
    n = int(DUR * SR)
    padL = np.zeros(n); arp = np.zeros(n); bs = np.zeros(n); drums = np.zeros(n)
    # --- Part A (tension, minor): Am  F  Dm  E   (each 1 bar), until PIVOT
    A = [([57, 60, 64], 45), ([53, 57, 60], 41), ([50, 53, 57], 38), ([52, 56, 59], 40)]
    # --- Part B (uplifting, major): C  G  Am  F
    B = [([60, 64, 67, 71], 48), ([55, 59, 62, 66], 43), ([57, 60, 64, 67], 45), ([53, 57, 60, 64], 41)]
    t0 = 0.0; i = 0
    while t0 < PIVOT - 0.01:
        ch, root = A[i % 4]
        d = min(BAR, PIVOT - t0)
        place(padL, pad_chord(ch, d + 0.6, 1200), t0, 0.55)
        # ticking pulse 8ths (muted plucks) — the "homework clock"
        for k in range(int(d / (BEAT / 2))):
            place(arp, pluck(ch[k % len(ch)] + 12, 0.25, 0.4), t0 + k * BEAT / 2, 0.16 if k % 2 else 0.22)
        if t0 >= 8.0:
            place(bs, bass(root - 12 + 12, BEAT * 2), t0, 0.28)
            place(bs, bass(root - 12 + 12, BEAT * 2), t0 + BEAT * 2, 0.22)
            for k in range(8):
                place(drums, hat(), t0 + k * BEAT / 2, 0.12 if k % 2 else 0.2)
        t0 += BAR; i += 1
    # Pivot -> reveal: soft lift, major pads, no drums, growing arpeggio
    t0 = PIVOT; i = 0
    while t0 < REVEAL - 0.01:
        ch, root = B[i % 4]
        d = min(BAR, REVEAL - t0)
        place(padL, pad_chord(ch, d + 0.8, 1600), t0, 0.6)
        for k in range(int(d / (BEAT / 2))):
            place(arp, pluck(ch[k % len(ch)] + 12, 0.45, 0.8), t0 + k * BEAT / 2, 0.14 + 0.1 * (t0 - PIVOT) / (REVEAL - PIVOT))
        t0 += BAR; i += 1
    # Part B full groove from REVEAL to end
    t0 = REVEAL; i = 0
    END = DUR - 1.6
    while t0 < END - 0.01:
        ch, root = B[i % 4]
        d = min(BAR, END - t0)
        place(padL, pad_chord(ch, d + 0.8, 2200), t0, 0.62)
        pattern = [0, 2, 1, 3, 2, 1, 3, 2]
        for k in range(int(round(d / (BEAT / 2)))):
            m = ch[pattern[k % 8] % len(ch)] + 12
            place(arp, pluck(m, 0.5, 1.0), t0 + k * BEAT / 2, 0.24 if k % 2 == 0 else 0.17)
        for b in range(int(round(d / BEAT))):
            tb = t0 + b * BEAT
            place(bs, bass(root - 12, BEAT * 0.9), tb, 0.36)
            if b % 2 == 0:
                place(drums, kick(), tb, 0.55)
            else:
                place(drums, clap(), tb, 0.32)
            place(drums, hat(), tb + BEAT / 2, 0.2)
            place(drums, hat(), tb, 0.1)
        t0 += BAR; i += 1
    # final resolving chord
    place(padL, pad_chord([48, 60, 64, 67, 72], 2.4, 2000), END, 0.75)
    place(arp, pluck(72, 1.6, 0.8), END, 0.3)
    place(drums, kick(), END, 0.5)
    mixL = reverb(padL, 2.6, 0.35) + reverb(arp, 1.6, 0.3) * 0.9 + bs + drums
    # gentle stereo: arp slightly right, pads wide via small delay
    d = int(0.011 * SR)
    padR = np.concatenate([np.zeros(d), padL[:-d]])
    L = mixL
    R = reverb(padR, 2.6, 0.35) + reverb(np.concatenate([np.zeros(d // 2), arp[:-(d // 2)]]), 1.6, 0.3) * 0.95 + bs + drums
    x = np.stack([L, R], 1)
    # fades
    fi = int(0.4 * SR); x[:fi] *= np.linspace(0, 1, fi)[:, None]
    fo = int(1.2 * SR); x[-fo:] *= np.linspace(1, 0, fo)[:, None]
    # soft clip / glue
    x = np.tanh(x / (np.max(np.abs(x)) * 0.7))
    return x


def sfx():
    out = {}
    # whoosh: band-passed noise with rising/falling cutoff
    t = t_axis(0.7)
    nz = rng.standard_normal(len(t))
    cut = 300 + 5000 * np.sin(np.pi * t / t[-1]) ** 2
    w = lowpass(nz, cut) - lowpass(nz, cut * 0.25)
    out["whoosh"] = w * np.sin(np.pi * t / t[-1]) ** 1.5
    # pop
    t = t_axis(0.18)
    f = 900 * np.exp(-t * 18) + 380
    out["pop"] = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 26)
    # soft "wrong" buzz (two detuned low tones)
    t = t_axis(0.45)
    out["buzz"] = (np.sign(np.sin(2 * np.pi * 150 * t)) * 0.3 + np.sin(2 * np.pi * 153 * t)) * np.exp(-t * 6)
    out["buzz"] = lp_fast(out["buzz"], 1400)
    # riser 2 s
    t = t_axis(2.0)
    nz = rng.standard_normal(len(t))
    cut = 200 + 7000 * (t / t[-1]) ** 2
    r = lowpass(nz, cut) * (t / t[-1]) ** 2
    tone = np.sin(2 * np.pi * np.cumsum(200 + 600 * (t / t[-1]) ** 2) / SR) * (t / t[-1]) ** 2 * 0.4
    out["riser"] = r + tone
    # impact
    t = t_axis(2.2)
    f = 38 + 90 * np.exp(-t * 16)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.6)
    nz = lp_fast(rng.standard_normal(len(t)), 2500) * np.exp(-t * 9) * 0.6
    out["impact"] = reverb(boom + nz, 2.0, 0.3)
    # ding (bell)
    t = t_axis(1.3)
    out["ding"] = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t * dcy) for f, a, dcy in
                      [(1318.5, 1, 3.2), (2637, 0.35, 5), (3951, 0.15, 7), (1975.5, 0.25, 4)])
    # click (UI)
    t = t_axis(0.08)
    out["click"] = (np.sin(2 * np.pi * 2200 * t) * 0.6 + rng.standard_normal(len(t)) * 0.3) * np.exp(-t * 90)
    # cash / success (two-note arpeggio bell)
    t = t_axis(1.4)
    a = np.sin(2 * np.pi * 1046.5 * t) * np.exp(-t * 4)
    b = np.zeros_like(t); s = int(0.11 * SR)
    b[s:] = np.sin(2 * np.pi * 1568 * t[: len(t) - s]) * np.exp(-t[: len(t) - s] * 3.5)
    out["success"] = reverb(a + b * 0.9, 1.2, 0.25)
    return out


if __name__ == "__main__":
    print("Synthesising SFX…")
    for k, v in sfx().items():
        write(os.path.join(ROOT, "public/audio/sfx", k + ".wav"), v)
    print("Synthesising music bed (this takes ~1-2 min)…")
    wav = os.path.join(ROOT, f"public/audio/music{_SUF}.wav")
    write(wav, music())
    # compress to MP3 (requires ffmpeg on PATH)
    os.system(f'ffmpeg -hide_banner -loglevel error -y -i "{wav}" -c:a libmp3lame -b:a 224k "{wav[:-4]}.mp3" && rm "{wav}"')
    print("Done.")

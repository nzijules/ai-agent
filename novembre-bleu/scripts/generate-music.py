"""
MUSIQUE PROVISOIRE — piano + nappe ambient, composée et synthétisée procéduralement.
Piste TEMPORAIRE explicitement identifiée : à remplacer par la musique originale
du compositeur avant diffusion. Elle suit la dramaturgie de la timeline :
  S01-S03 : tendre (la mineur, motif de piano)
  S04-S07 : prise de conscience (plus sombre, pulsation grave discrète)
  S08-S11 : information (arpèges neutres, sans tension)
  S12-S15 : retour de la lumière (do majeur, montée au climax S14, résolution S15)

Génère aussi une piste de transitions sonores (souffles filtrés, scintillements).
Usage : python3 -I scripts/generate-music.py scripts/timeline.json public/assets/audio
"""
import json
import sys
import os
import subprocess
import wave

import numpy as np

SR = 48000
rng = np.random.default_rng(2026)
tl = json.load(open(sys.argv[1]))
OUT = sys.argv[2]
DUR = tl["totalFrames"] / tl["fps"]
N = int(DUR * SR)
scene = {s["id"]: s["start"] for s in tl["scenes"]}

def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)

NOTE = {"C": 0, "C#": 1, "D": 2, "Eb": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "Ab": 8, "A": 9, "Bb": 10, "B": 11}

def n(name, octave):
    return 12 * (octave + 1) + NOTE[name]

# ---------------------------------------------------------------- piano
def piano_note(freq, dur, vel):
    length = int((dur + 2.5) * SR)
    t = np.arange(length) / SR
    out = np.zeros(length)
    B = 0.00035
    for k in range(1, 9):
        fk = freq * k * np.sqrt(1 + B * k * k)
        if fk > SR / 2.2:
            break
        t60 = max(0.35, 3.8 / (1 + 0.55 * (k - 1)) * (220 / max(freq, 110)) ** 0.35)
        amp = (1.0 / k ** 1.25) * (0.6 + 0.4 * vel)
        out += amp * np.sin(2 * np.pi * fk * t + rng.uniform(0, 0.3)) * np.exp(-6.9 * t / t60)
    attack = np.clip(t / 0.004, 0, 1)
    release = np.clip(1 - (t - dur) / 0.6, 0, 1)
    env = attack * np.where(t < dur, 1.0, release)
    return out * env * vel

# ---------------------------------------------------------------- pad
def pad_chord(freqs, start, end, gain, bright=0.25):
    a = int(start * SR)
    b = min(N, int((end + 2.0) * SR))
    t = np.arange(b - a) / SR
    seg = np.zeros(b - a)
    for f in freqs:
        for det in (-0.0018, 0.0, 0.0021):
            ff = f * (1 + det)
            ph = rng.uniform(0, 2 * np.pi)
            seg += np.sin(2 * np.pi * ff * t + ph)
            seg += bright * 0.5 * np.sin(2 * np.pi * 2 * ff * t + ph)
            seg += bright * 0.18 * np.sin(2 * np.pi * 3 * ff * t + ph)
    seg /= max(1, len(freqs) * 3)
    d = end - start
    env = np.clip(t / 1.4, 0, 1) * np.clip(1 - (t - d) / 2.0, 0, 1)
    # lente respiration
    env *= 0.85 + 0.15 * np.sin(2 * np.pi * 0.11 * t + start)
    music[a:b] += seg * env * gain

music = np.zeros(N)
piano = np.zeros(N)

def add_piano(time, note_num, dur, vel):
    s = piano_note(midi(note_num), dur, vel)
    a = int(time * SR)
    b = min(N, a + len(s))
    if a < N:
        piano[a:b] += s[: b - a]

BPM = 72
beat = 60 / BPM
bar = 4 * beat

# Progressions (accord = liste de notes MIDI pour la nappe, basse, notes de mélodie)
def chord(root, quality, octave=3):
    r = n(root, octave)
    iv = {"m": [0, 3, 7, 14], "M": [0, 4, 7, 14], "M7": [0, 4, 7, 11], "sus": [0, 5, 7, 14], "m7": [0, 3, 7, 10]}[quality]
    return [r + i for i in iv]

sections = [
    # (début, fin, progression, intensité nappe, style piano)
    (0.0, scene["S04"], [("A", "m"), ("F", "M7"), ("C", "M"), ("G", "sus")], 0.16, "motif"),
    (scene["S04"], scene["S08"], [("A", "m"), ("F", "M"), ("D", "m7"), ("E", "sus")], 0.20, "sparse"),
    (scene["S08"], scene["S12"], [("A", "m"), ("F", "M7"), ("C", "M"), ("G", "M")], 0.17, "arp"),
    (scene["S12"], scene["S14"], [("F", "M7"), ("G", "sus"), ("C", "M"), ("A", "m")], 0.19, "arp_bright"),
    (scene["S14"], scene["S15"], [("F", "M"), ("G", "M"), ("A", "m"), ("C", "M")], 0.25, "climax"),
    (scene["S15"], DUR, [("F", "M7"), ("G", "sus"), ("C", "M"), ("C", "M")], 0.19, "resolve"),
]

motif = [0, 2, 3, 7, 3, 2]  # degrés relatifs (la mineur)
for (s0, s1, prog, g, style) in sections:
    t = s0
    i = 0
    while t < s1 - 0.05:
        root, q = prog[i % len(prog)]
        cdur = min(bar, s1 - t)
        notes = chord(root, q, 3)
        pad_chord([midi(x) for x in notes], t, t + cdur, g, bright=0.35 if style in ("climax", "resolve", "arp_bright") else 0.2)
        # basse
        add_piano(t, notes[0] - 12, cdur * 0.9, 0.42)
        top = [x + 12 for x in notes]
        if style == "motif":
            for k in range(4):
                add_piano(t + k * beat, top[[0, 2, 1, 3][k] % len(top)], beat * 1.4, 0.32 + 0.06 * (k == 0))
        elif style == "sparse":
            add_piano(t + beat * 0.0, top[2], beat * 2.5, 0.26)
            add_piano(t + beat * 2.5, top[1] + 12, beat * 1.6, 0.18)
        elif style in ("arp", "arp_bright"):
            seq = [0, 1, 2, 3, 2, 1, 2, 3]
            for k in range(8):
                vv = 0.2 if style == "arp" else 0.24
                add_piano(t + k * beat / 2, top[seq[k]] + (12 if style == "arp_bright" and k % 4 == 3 else 0), beat * 0.9, vv)
        elif style == "climax":
            seq = [0, 2, 3, 2, 1, 3, 2, 3]
            for k in range(8):
                add_piano(t + k * beat / 2, top[seq[k]] + 12 * (k % 2), beat * 0.9, 0.3)
            add_piano(t, top[3] + 12, cdur, 0.34)
        elif style == "resolve":
            add_piano(t, top[0] + 12, cdur * 0.9, 0.28)
            add_piano(t + beat, top[2] + 12, cdur * 0.7, 0.22)
            add_piano(t + 2 * beat, top[3] + 12, cdur * 0.6, 0.2)
        t += cdur
        i += 1

# pulsation grave très discrète (S06-S07) — ~72 bpm, « présence » et non dramatisation
for t in np.arange(scene["S06"], scene["S08"], 60 / 72):
    a = int(t * SR)
    L = int(0.5 * SR)
    tt = np.arange(L) / SR
    thump = np.sin(2 * np.pi * 52 * tt) * np.exp(-tt / 0.09) * 0.22
    b = min(N, a + L)
    music[a:b] += thump[: b - a]

mix = music + piano * 0.55

# ---------------------------------------------------------------- réverbération (convolution FFT)
def reverb(x, seconds=3.2, wet=0.32):
    L = int(seconds * SR)
    t = np.arange(L) / SR
    ir = rng.standard_normal(L) * np.exp(-6.9 * t / seconds)
    # assombrir l'IR
    spec = np.fft.rfft(ir)
    fr = np.fft.rfftfreq(L, 1 / SR)
    spec *= 1 / (1 + (fr / 4500) ** 2)
    ir = np.fft.irfft(spec, L)
    ir /= np.sqrt(np.sum(ir ** 2))
    size = 1 << int(np.ceil(np.log2(len(x) + L)))
    y = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    return x * (1 - wet) + y * wet

def lowpass(x, fc):
    size = 1 << int(np.ceil(np.log2(len(x))))
    X = np.fft.rfft(x, size)
    fr = np.fft.rfftfreq(size, 1 / SR)
    X *= 1 / np.sqrt(1 + (fr / fc) ** 4)
    return np.fft.irfft(X, size)[: len(x)]

mix = lowpass(mix, 7000)
left = reverb(mix, 3.4, 0.34)
right = reverb(np.roll(mix, int(0.011 * SR)), 3.1, 0.34)

# enveloppe globale : fondu d'entrée, fondu de sortie
t = np.arange(N) / SR
master = np.clip(t / 1.2, 0, 1) * np.clip((DUR - t) / 2.2, 0, 1)
st = np.stack([left, right], axis=1) * master[:, None]
st /= np.max(np.abs(st)) / 0.7  # crête -3 dB, mixage final dans Remotion

def write_wav(path, data):
    data = np.clip(data, -1, 1)
    pcm = (data * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    # encodage MP3 (poids du dépôt) puis suppression du WAV intermédiaire
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", path,
                    "-c:a", "libmp3lame", "-b:a", "224k", path[:-4] + ".mp3"], check=True)
    os.remove(path)

write_wav(f"{OUT}/musique-provisoire-piano-ambient.wav", st)

# ---------------------------------------------------------------- transitions sonores
sfx = np.zeros((N, 2))

def whoosh(center, length=1.1, gain=0.22, fc0=300, fc1=2600):
    L = int(length * SR)
    a = int((center - length * 0.7) * SR)
    if a < 0:
        return
    noise = rng.standard_normal(L)
    # balayage spectral approché par segments filtrés
    out = np.zeros(L)
    segs = 12
    for k in range(segs):
        fc = fc0 + (fc1 - fc0) * np.sin(np.pi * k / (segs - 1)) ** 2
        part = lowpass(noise, fc)
        w = np.zeros(L)
        s0, s1 = int(L * k / segs), int(L * (k + 1) / segs)
        w[s0:s1] = 1
        out += part * w
    tt = np.arange(L) / L
    env = np.where(tt < 0.7, (tt / 0.7) ** 2, np.exp(-(tt - 0.7) * 9))
    out *= env * gain
    pan = rng.uniform(-0.4, 0.4)
    b = min(N, a + L)
    sfx[a:b, 0] += out[: b - a] * (1 - pan)
    sfx[a:b, 1] += out[: b - a] * (1 + pan)

def shimmer(start, gain=0.12):
    for k, note in enumerate([n("C", 6), n("E", 6), n("G", 6), n("D", 7), n("G", 7)]):
        s = piano_note(midi(note), 0.4, 0.5) * gain
        a = int((start + k * 0.07) * SR)
        b = min(N, a + len(s))
        sfx[a:b, k % 2] += s[: b - a]
        sfx[a:b, (k + 1) % 2] += s[: b - a] * 0.6

for sc in tl["scenes"][1:]:
    whoosh(sc["start"], gain=0.16 if sc["id"] not in ("S05", "S13", "S15") else 0.2)
shimmer(scene["S05"] + 0.9)
shimmer(scene["S13"] + 0.6, 0.09)
shimmer(scene["S15"] + 0.5)

sfx[:, 0] = reverb(sfx[:, 0], 2.0, 0.3)
sfx[:, 1] = reverb(sfx[:, 1], 2.0, 0.3)
write_wav(f"{OUT}/transitions-provisoires.wav", sfx)
print("musique + transitions générées", DUR, "s")

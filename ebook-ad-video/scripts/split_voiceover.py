#!/usr/bin/env python3
"""Import a continuous voice-over recording and cut it into the timed lines of a cut.

Aligns the recording (MFCC + DTW) against the current reference clips of the cut, snaps every cut point
to the nearest pause, then writes one WAV per line and updates the durations.

  python3 scripts/split_voiceover.py voiceover/original/voix-off.mp3                       # « Contrôle » cut
  python3 scripts/split_voiceover.py voiceover/original/voix-off-economie.mp3 --variant economie
Then: python3 scripts/retime.py [--variant economie] && python3 scripts/generate_audio.py [economie]
Requires: pip install librosa
"""
import argparse, json, os, re, subprocess, wave
import numpy as np, librosa

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument("recording"); ap.add_argument("--variant", default="")
a = ap.parse_args()
suf = f"-{a.variant}" if a.variant else ""
SR, HOP, PAD = 16000, 160, 0.06
jp = os.path.join(ROOT, f"src/generated/voiceover{suf}.json")
data = json.load(open(jp, encoding="utf-8")); lines = data["lines"]
src_dir = os.path.join(ROOT, f"public/audio/vo{suf}")
ref_dir = src_dir if os.path.isdir(src_dir) and all(os.path.exists(f"{src_dir}/{l['id']}.wav") for l in lines) else os.path.join(ROOT, "public/audio/vo")

# reference = current clips chained with 0.4 s gaps
ref, bounds, t = [], [], 0.0
gap = np.zeros(int(0.4 * SR))
for l in lines:
    y, _ = librosa.load(f"{ref_dir}/{l['id']}.wav", sr=SR); y, _ = librosa.effects.trim(y, top_db=35)
    bounds.append((t, t + len(y) / SR)); ref += [y, gap]; t += len(y) / SR + 0.4
ref = np.concatenate(ref)
u, _ = librosa.load(a.recording, sr=SR)

def feat(y):
    m = librosa.feature.mfcc(y=y, sr=SR, n_mfcc=20, hop_length=HOP, n_fft=512)[1:]
    return (m - m.mean(1, keepdims=True)) / (m.std(1, keepdims=True) + 1e-6)

_, wp = librosa.sequence.dtw(X=feat(ref), Y=feat(u), metric="cosine"); wp = wp[::-1]
def map_t(tr):
    idx = min(np.searchsorted(wp[:, 0], int(tr * SR / HOP)), len(wp) - 1)
    return wp[idx, 1] * HOP / SR
res = [(map_t(x), map_t(y)) for x, y in bounds]

err = subprocess.run(["ffmpeg", "-hide_banner", "-i", a.recording, "-af", "silencedetect=noise=-40dB:d=0.12", "-f", "null", "-"], capture_output=True, text=True).stderr
ss = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", err)]; se = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", err)]
sil = list(zip(ss, se)) if ss and (not se or ss[0] < se[0]) else list(zip([0.0] + ss, se))
mids = [(x + y) / 2 for x, y in sil]
cuts = []
for i in range(len(res) - 1):
    target = (res[i][1] + res[i + 1][0]) / 2
    cuts.append(sil[int(np.argmin([abs(m - target) for m in mids]))])
starts = [0.0] + [y for x, y in cuts]
ends = [x for x, y in cuts] + [sil[-1][0] if sil and sil[-1][0] > res[-1][0] else len(u) / SR]

os.makedirs(src_dir, exist_ok=True)
for k, l in enumerate(lines):
    s, e = max(0, starts[k] - PAD), ends[k] + PAD
    dst = f"{src_dir}/{l['id']}.wav"
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", a.recording, "-ss", f"{s:.3f}", "-to", f"{e:.3f}",
                    "-af", "afade=t=in:d=0.02,areverse,afade=t=in:d=0.04,areverse,loudnorm=I=-16:TP=-1.5", "-ar", "48000", "-ac", "1", dst], check=True)
    with wave.open(dst) as w:
        l["duration"] = round(w.getnframes() / w.getframerate(), 3)
    print(f"{l['id']} src {starts[k]:6.2f}-{ends[k]:6.2f}  {l['duration']:.2f}s  {l['text'][:60]}")
json.dump(data, open(jp, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

#!/usr/bin/env python3
"""Import a continuous voice-over recording: aligns it (MFCC + DTW) against the Piper reference clips of
voiceover/script.json, snaps each cut to the nearest pause, then writes public/audio/vo/lXX.wav and updates
src/generated/voiceover.json. Run generate_voiceover.py first (reference clips), then:
  python3 scripts/split_voiceover.py  (edit U below to point at your recording)"""
import json, numpy as np, librosa, subprocess, re
SR=16000; HOP=160
U='voiceover/original/voix-off.mp3'
lines=json.load(open('src/generated/voiceover.json'))['lines']
# reference: piper lines concatenated with 0.4 s gaps
ref=[];bounds=[];t=0
gap=np.zeros(int(0.4*SR))
for l in lines:
    y,_=librosa.load(f'public/audio/vo/{l["id"]}.wav',sr=SR)
    y,_=librosa.effects.trim(y,top_db=35)
    bounds.append((t,t+len(y)/SR)); ref+= [y,gap]; t+=len(y)/SR+0.4
ref=np.concatenate(ref)
u,_=librosa.load(U,sr=SR)
def feat(y):
    m=librosa.feature.mfcc(y=y,sr=SR,n_mfcc=20,hop_length=HOP,n_fft=512)[1:]
    m=(m-m.mean(1,keepdims=True))/(m.std(1,keepdims=True)+1e-6)
    return m
A=feat(ref);B=feat(u)
D,wp=librosa.sequence.dtw(X=A,Y=B,metric='cosine',subseq=False)
wp=wp[::-1]
def map_t(tr):
    i=int(tr*SR/HOP); idx=np.searchsorted(wp[:,0],i); idx=min(idx,len(wp)-1)
    return wp[idx,1]*HOP/SR
# silences in user audio
out=subprocess.run(['ffmpeg','-hide_banner','-i',U,'-af','silencedetect=noise=-40dB:d=0.12','-f','null','-'],capture_output=True,text=True).stderr
ss=[float(x) for x in re.findall(r'silence_start: ([\d.]+)',out)]; se=[float(x) for x in re.findall(r'silence_end: ([\d.]+)',out)]
sil=list(zip(ss,se)) if ss and ss[0]<se[0] else list(zip([0.0]+ss,se))
res=[]
for i,(a,b) in enumerate(bounds):
    res.append((map_t(a),map_t(b)))
print("approx mapped:")
for l,(a,b) in zip(lines,res): print(l['id'],round(a,2),round(b,2))
print("silences:",[(round(a,2),round(b,2)) for a,b in sil])
json.dump({'mapped':res,'sil':sil},open('/tmp/claude-0/-home-user-ai-agent/02e3e371-8118-5f9d-9ac3-d6220336876d/scratchpad/align.json','w'))

# ---- snap boundaries to pauses, cut clips, update timings ----
import os, wave
PAD = 0.06
mids = [(a + b) / 2 for a, b in sil]
cuts = []  # end of line i / start of line i+1
for i in range(len(res) - 1):
    target = (res[i][1] + res[i + 1][0]) / 2
    j = int(np.argmin([abs(m - target) for m in mids]))
    cuts.append(sil[j])
starts = [0.0] + [b for a, b in cuts]
ends = [a for a, b in cuts] + [sil[-1][0] if sil[-1][0] > res[-1][0] else len(u) / SR]
data = json.load(open('src/generated/voiceover.json'))
os.makedirs('voiceover/original', exist_ok=True)
for k, l in enumerate(data['lines']):
    s = max(0, starts[k] - PAD); e = ends[k] + PAD
    dst = f'public/audio/vo/{l["id"]}.wav'
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', U, '-ss', f'{s:.3f}', '-to', f'{e:.3f}',
                    '-af', 'afade=t=in:d=0.02,areverse,afade=t=in:d=0.04,areverse,loudnorm=I=-16:TP=-1.5', '-ar', '48000', '-ac', '1', dst], check=True)
    with wave.open(dst) as w:
        l['duration'] = round(w.getnframes() / w.getframerate(), 3)
for i, l in enumerate(data['lines']):
    nxt = data['lines'][i + 1]['start'] if i + 1 < len(data['lines']) else 90
    flag = '  <-- OVERLAP' if l['start'] + l['duration'] > nxt - 0.1 else ''
    print(f"{l['id']} src {starts[i]:6.2f}-{ends[i]:6.2f}  placed {l['start']:5.1f}s +{l['duration']:.2f}{flag}")
json.dump(data, open('src/generated/voiceover.json', 'w'), ensure_ascii=False, indent=1)

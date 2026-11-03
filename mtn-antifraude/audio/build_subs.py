"""Sous-titres (SRT + ASS) depuis src/timing.ts : découpage en cartons de 2 lignes max, calés sur la voix-off."""
import re, json
src = open('src/timing.ts', encoding='utf-8').read()
OFF = float(re.search(r'VO_OFFSET = ([\d.]+)', src).group(1))
lines = [(float(a), float(b), t.replace("\\'", "'")) for a, b, t in re.findall(r"\{s: ([\d.]+), e: ([\d.]+), text: [\"'](.+?)[\"']\}", src)]
MAXC = 84
def split(text):
    if len(text) <= MAXC: return [text]
    parts = re.split(r'(?<=[,…:])\s+', text); out = ['']
    for p in parts:
        if out[-1] and len(out[-1]) + len(p) + 1 > MAXC: out.append(p)
        else: out[-1] = (out[-1] + ' ' + p).strip()
    return out
def wrap(s, w=44):
    if len(s) <= w: return s
    words = s.split(); best = None
    for i in range(1, len(words)):
        a, b = ' '.join(words[:i]), ' '.join(words[i:]); d = abs(len(a) - len(b))
        if best is None or d < best[0]: best = (d, a + '\n' + b)
    return best[1]
cues = []
for s, e, text in lines:
    chunks = split(text); tot = sum(len(c) for c in chunks); t = s
    for c in chunks:
        d = (e - s) * len(c) / tot; cues.append((t + OFF, t + d + OFF, wrap(c))); t += d
# prolonger légèrement chaque carton (lisibilité) sans chevaucher le suivant
cues = [(a, min(b + 0.35, cues[i + 1][0] - 0.04) if i + 1 < len(cues) else b + 0.6, x) for i, (a, b, x) in enumerate(cues)]
def ts(x, sep=','):
    h, m = int(x // 3600), int(x % 3600 // 60); s = x % 60
    return f"{h:02d}:{m:02d}:{int(s):02d}{sep}{int(round((s % 1) * 1000)):03d}"
with open('out/sous-titres.srt', 'w', encoding='utf-8') as f:
    for i, (a, b, x) in enumerate(cues, 1): f.write(f"{i}\n{ts(a)} --> {ts(b)}\n{x}\n\n")
def ats(x): return f"{int(x // 3600)}:{int(x % 3600 // 60):02d}:{x % 60:05.2f}"
head = """[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Inter,46,&H00FFFFFF,&H00FFFFFF,&H00000000,&H9A000000,-1,0,0,0,100,100,0,0,3,14,0,2,200,200,46,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
with open('out/sous-titres.ass', 'w', encoding='utf-8') as f:
    f.write(head)
    for a, b, x in cues: f.write(f"Dialogue: 0,{ats(a)},{ats(b)},Default,,0,0,0,,{{\\fad(120,120)}}{x.replace(chr(10), chr(92) + 'N')}\n")
print(len(cues), 'cartons')

#!/usr/bin/env python3
"""Tight re-timing: chains the voice-over lines back to back (no dead air) and derives scene boundaries.

Reads  src/generated/voiceover.json (durations)
Writes src/generated/voiceover.json (new starts), src/generated/timeline.json (scenes, total), exports/sous-titres.srt
Run after any voice-over change, then `npm run audio` (music follows the new timeline) and `npm run render:all`.
"""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GAP = 0.22          # pause between two lines of the same scene
SCENE_BREAK = 0.30  # pause after the last line of a scene, before the transition
SCENES = [  # id, lines, lead-in before first line
    ("S1-Accroche", ["l01", "l02"], 0.35),
    ("S2-Probleme", ["l03", "l04", "l05", "l06", "l07"], 0.45),
    ("S3-Tuteur", ["l08", "l09"], 0.45),
    ("S4-Revelation", ["l10", "l11"], 0.7),
    ("S5-Benefices", ["l12", "l13", "l14", "l15"], 0.45),
    ("S6-Methode", ["l16", "l17", "l18"], 0.45),
    ("S7-Offre", ["l19", "l20"], 0.45),
    ("S8-Appel", ["l21", "l22"], 0.4),
]
TAIL = 1.6  # end card hold after the last word

def fmt(t):
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"

p = os.path.join(ROOT, "src/generated/voiceover.json")
vo = json.load(open(p, encoding="utf-8"))
byid = {l["id"]: l for l in vo["lines"]}
t = 0.0; scenes = []
for sid, ids, lead in SCENES:
    frm = t
    t = frm + lead
    for k, i in enumerate(ids):
        byid[i]["start"] = round(t, 3)
        t += byid[i]["duration"] + (GAP if k < len(ids) - 1 else SCENE_BREAK)
    scenes.append({"id": sid, "from": round(frm, 3), "lines": ids})
total = round(t - SCENE_BREAK + TAIL, 2)
for k, s in enumerate(scenes):
    s["to"] = scenes[k + 1]["from"] if k + 1 < len(scenes) else total
json.dump(vo, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
json.dump({"total": total, "scenes": scenes}, open(os.path.join(ROOT, "src/generated/timeline.json"), "w"), indent=1)
with open(os.path.join(ROOT, "exports/sous-titres.srt"), "w", encoding="utf-8") as f:
    for i, r in enumerate(vo["lines"], 1):
        f.write(f"{i}\n{fmt(r['start'])} --> {fmt(r['start'] + r['duration'])}\n{r['text']}\n\n")
for s in scenes:
    print(f"{s['id']:14} {s['from']:6.2f} -> {s['to']:6.2f}  ({s['to'] - s['from']:.2f}s)")
print("total", total)

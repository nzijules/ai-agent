#!/usr/bin/env python3
"""Tight re-timing: chains the voice-over lines back to back (no dead air) and derives scene boundaries.

Reads  src/generated/voiceover[-<variant>].json (durations)   (--variant economie for the « Économie » cut)
Writes src/generated/voiceover.json (new starts), src/generated/timeline.json (scenes, total), exports/sous-titres.srt
Run after any voice-over change, then `npm run audio` (music follows the new timeline) and `npm run render:all`.
"""
import argparse, json, os
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
    ("S7-Resultat", [], 0.45),  # « Contrôle » only: the transformation the parent can picture
    ("S7-Offre", ["l19", "l20"], 0.45),
    ("S8-Appel", ["l21", "l22"], 0.4),
]
TAIL = 1.6  # end card hold after the last word

def fmt(t):
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"

ap = argparse.ArgumentParser(); ap.add_argument("--variant", default="")
V = ap.parse_args().variant
suf = f"-{V}" if V else ""
p = os.path.join(ROOT, f"src/generated/voiceover{suf}.json")
vo = json.load(open(p, encoding="utf-8")) if os.path.exists(p) else {"lines": []}
byid = {l["id"]: l for l in vo["lines"]}
SHORT = {  # 30 s TikTok cuts: subsets of the full cut's recorded lines (no new recording)
    "controle-court": ("controle", [("S1-Accroche", ["c01", "c02"], 0.3), ("S2-Probleme", ["c05", "c06"], 0.35),
                                    ("S4-Revelation", ["c09"], 0.6), ("S5-Benefices", ["c11"], 0.35),
                                    ("S7-Offre", ["c17", "c18"], 0.35), ("S8-Appel", ["c20"], 0.35)]),
    "economie-court": ("economie", [("S1-Accroche", ["e01", "e02"], 0.3), ("S2-Probleme", ["e03", "e06", "e07"], 0.35),
                                    ("S4-Revelation", ["l10"], 0.6), ("S7-Offre", ["e19", "l20"], 0.35), ("S8-Appel", ["l22"], 0.35)]),
}
if V in SHORT:
    parent, SCENES = SHORT[V]
    full = {l["id"]: l for l in json.load(open(os.path.join(ROOT, f"src/generated/voiceover-{parent}.json"), encoding="utf-8"))["lines"]}
    vo = {"parent": parent, "lines": [dict(full[i]) for _, ids, _ in SCENES for i in ids]}
    byid = {l["id"]: l for l in vo["lines"]}
elif V == "controle":
    # optimised script: scenes listed with their own cXX lines, in order
    C = {"S1-Accroche": 2, "S2-Probleme": 4, "S3-Tuteur": 2, "S4-Revelation": 1, "S5-Benefices": 4, "S6-Methode": 2, "S7-Resultat": 1, "S7-Offre": 2, "S8-Appel": 2}
    ids_all = [l["id"] for l in vo["lines"]]; k = 0; new = []
    for sid, _, lead in SCENES:
        n = C[sid]; new.append((sid, ids_all[k:k + n], lead)); k += n
    assert k == len(ids_all), (k, len(ids_all))
    SCENES = new
else:
    # a variant replaces some lXX lines by its own eXX lines (same scene, same position)
    SCENES = [(sid, [i if i in byid else "e" + i[1:] for i in ids], lead) for sid, ids, lead in SCENES if ids]
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
json.dump({"total": total, "scenes": scenes}, open(os.path.join(ROOT, f"src/generated/timeline{suf}.json"), "w"), indent=1)
with open(os.path.join(ROOT, f"exports/sous-titres{suf}.srt"), "w", encoding="utf-8") as f:
    for i, r in enumerate(vo["lines"], 1):
        f.write(f"{i}\n{fmt(r['start'])} --> {fmt(r['start'] + r['duration'])}\n{r['text']}\n\n")
for s in scenes:
    print(f"{s['id']:14} {s['from']:6.2f} -> {s['to']:6.2f}  ({s['to'] - s['from']:.2f}s)")
print("total", total)

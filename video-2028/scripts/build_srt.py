#!/usr/bin/env python3
"""Exporte les sous-titres au format SRT (pour la version sans sous-titres incrustés,
ou pour l'import natif TikTok / YouTube / Instagram).

Entrée : src/data/captions.json   Sortie : out/et-si-cetait-dans-deux-ans.srt
"""
import json
import textwrap
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
caps = json.loads((ROOT / "src/data/captions.json").read_text(encoding="utf-8"))


def ts(ms: int) -> str:
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


out = []
for i, c in enumerate(caps, 1):
    text = "\n".join(textwrap.wrap(c["text"], 42))
    end = c["endMs"] + 250
    if i < len(caps):
        end = min(end, caps[i]["startMs"] - 40)  # pas de chevauchement avec le suivant
    out.append(f"{i}\n{ts(c['startMs'])} --> {ts(end)}\n{text}\n")
(ROOT / "out").mkdir(exist_ok=True)
p = ROOT / "out/et-si-cetait-dans-deux-ans.srt"
p.write_text("\n".join(out), encoding="utf-8")
print("✓", p.relative_to(ROOT))

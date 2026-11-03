#!/usr/bin/env python3
"""Generate the French voice-over with Piper (local, free, offline TTS).

Voice: "siwis" (French, female) — dataset licence CC-BY 4.0
(https://datashare.is.ed.ac.uk/handle/10283/2353). Credit it if required by your platform.

Usage:  python3 scripts/generate_voiceover.py --model /path/to/fr-siwis-medium.onnx
Outputs:
  public/audio/vo/<id>.wav            one clip per line
  src/generated/voiceover.json        timings used by the video + subtitles
  exports/sous-titres.srt             subtitle file for the platforms
"""
import argparse, json, os, subprocess, sys, wave

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def fmt(t):
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", default=os.environ.get("PIPER_MODEL", ""))
    ap.add_argument("--length-scale", type=float, default=1.04)
    a = ap.parse_args()
    if not a.model or not os.path.exists(a.model):
        sys.exit("Piper model not found. Pass --model or set PIPER_MODEL.")
    cfg = json.load(open(os.path.join(ROOT, "src/ad.config.json"), encoding="utf-8"))
    script = json.load(open(os.path.join(ROOT, "voiceover/script.json"), encoding="utf-8"))
    out_dir = os.path.join(ROOT, "public/audio/vo"); os.makedirs(out_dir, exist_ok=True)
    os.makedirs(os.path.join(ROOT, "src/generated"), exist_ok=True)
    os.makedirs(os.path.join(ROOT, "exports"), exist_ok=True)
    res = []
    for ln in script["lines"]:
        spoken = ln["spoken"].replace("{PRICE_SPOKEN}", cfg["priceSpoken"]).replace("{PRICE}", cfg["price"])
        text = ln["text"].replace("{PRICE}", cfg["price"])
        wav = os.path.join(out_dir, ln["id"] + ".wav")
        subprocess.run([sys.executable, "-m", "piper", "-m", a.model, "-f", wav,
                        "--length-scale", str(a.length_scale), "--noise-scale", "0.6", "--noise-w", "0.75",
                        "--sentence-silence", "0.1"],
                       input=spoken.encode("utf-8"), check=True, capture_output=True)
        with wave.open(wav) as w:
            dur = w.getnframes() / w.getframerate()
        res.append({"id": ln["id"], "start": ln["start"], "duration": round(dur, 3), "text": text})
    for i, r in enumerate(res):
        end = r["start"] + r["duration"]
        nxt = res[i + 1]["start"] if i + 1 < len(res) else 90.0
        flag = "  <-- OVERLAP" if end > nxt - 0.15 else ""
        print(f"{r['id']} {r['start']:5.1f}s + {r['duration']:4.2f}s -> {end:5.2f}s (next {nxt:5.1f}){flag}")
    json.dump({"lines": res}, open(os.path.join(ROOT, "src/generated/voiceover.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    with open(os.path.join(ROOT, "exports/sous-titres.srt"), "w", encoding="utf-8") as f:
        for i, r in enumerate(res, 1):
            f.write(f"{i}\n{fmt(r['start'])} --> {fmt(r['start'] + r['duration'])}\n{r['text']}\n\n")

if __name__ == "__main__":
    main()

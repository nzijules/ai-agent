#!/bin/bash
# Normalise loudness of rendered MP4s for social platforms (-14 LUFS, true peak -1.5 dBTP). Video stream is copied.
set -e
cd "$(dirname "$0")/../exports"
for f in pub-*.mp4; do
  ffmpeg -hide_banner -loglevel error -y -i "$f" -c:v copy -af loudnorm=I=-14:TP=-2:LRA=11,alimiter=limit=0.85:level=false -ar 48000 -c:a aac -b:a 192k "tmp_$f"
  mv "tmp_$f" "$f"
  echo "normalised $f"
done

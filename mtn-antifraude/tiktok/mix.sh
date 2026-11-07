#!/usr/bin/env bash
# Version TikTok 9:16 (Arosoft) : voix témoin (décalée de 0,3 s) + musique (ducking) + effets, -16 LUFS.
# Aucune légende / sous-titre. Grain léger ajouté à l'encodage.
set -euo pipefail
cd "$(dirname "$0")/.."
# Usage : tiktok/mix.sh [vidéo_muette] [sortie]
IN="${1:-out/tiktok/_video_muet.mp4}"
OUT="${2:-out/tiktok/Arosoft_La-fraude-a-l-ere-de-l-IA_TikTok.mp4}"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
ffmpeg -y -loglevel error -i public/vo_tiktok.wav -i tiktok/music.wav -i tiktok/sfx.wav -filter_complex "
[0:a]aresample=48000,aformat=channel_layouts=mono,pan=stereo|c0=c0|c1=c0,adelay=300|300,apad=whole_dur=$DUR,asplit=2[vo][key];
[1:a]aresample=48000,volume=0.30[mu];
[mu][key]sidechaincompress=threshold=0.025:ratio=5:attack=30:release=450[duck];
[2:a]aresample=48000,volume=0.40[fx];
[vo][duck][fx]amix=inputs=3:normalize=0:duration=first,atrim=0:$DUR,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[a]" \
  -map "[a]" -c:a pcm_s16le out/tiktok/_mix.wav
ffmpeg -y -loglevel error -i "$IN" -i out/tiktok/_mix.wav -map 0:v -map 1:a -vf "noise=alls=3:allf=t" \
  -c:v libx264 -preset medium -crf 20 -maxrate 8M -bufsize 16M -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -movflags +faststart -shortest \
  "$OUT"
echo "Mixage terminé."

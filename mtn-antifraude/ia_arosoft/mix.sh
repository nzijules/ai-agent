#!/usr/bin/env bash
# « La fraude à l'ère de l'IA » – version Arosoft : mixage voix (décalée de 1,2 s) + musique (ducking) + effets, -16 LUFS,
# puis versions sans / avec sous-titres (grain léger ajouté à l'encodage).
# Usage : ia/mix_ia.sh [fichier_voix]   (par défaut : public/vo_ia.wav = voix témoin)
set -euo pipefail
cd "$(dirname "$0")/.."
VO="${1:-public/vo_ia_arosoft.wav}"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 out/ia_arosoft/_video_muet.mp4)
NAME="out/ia_arosoft/Arosoft_La-fraude-a-l-ere-de-l-IA_1080p"
ffmpeg -y -loglevel error -i "$VO" -i ia_arosoft/music.wav -i ia_arosoft/sfx.wav -filter_complex "
[0:a]aresample=48000,aformat=channel_layouts=mono,pan=stereo|c0=c0|c1=c0,adelay=1200|1200,apad=whole_dur=$DUR,asplit=2[vo][key];
[1:a]aresample=48000,volume=0.30[mu];
[mu][key]sidechaincompress=threshold=0.025:ratio=5:attack=30:release=450[duck];
[2:a]aresample=48000,volume=0.42[fx];
[vo][duck][fx]amix=inputs=3:normalize=0:duration=first,atrim=0:$DUR,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[a]" \
  -map "[a]" -c:a pcm_s16le out/ia_arosoft/_mix.wav
ENC="-c:v libx264 -preset medium -crf 20 -maxrate 7M -bufsize 14M -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -movflags +faststart -shortest"
ffmpeg -y -loglevel error -i out/ia_arosoft/_video_muet.mp4 -i out/ia_arosoft/_mix.wav -map 0:v -map 1:a -vf "noise=alls=3:allf=t" $ENC "${NAME}_sans-sous-titres.mp4"
ffmpeg -y -loglevel error -i out/ia_arosoft/_video_muet.mp4 -i out/ia_arosoft/_mix.wav -map 0:v -map 1:a -vf "noise=alls=3:allf=t,ass=out/ia_arosoft/sous-titres.ass" $ENC "${NAME}_sous-titres.mp4"
echo "Mixage terminé."

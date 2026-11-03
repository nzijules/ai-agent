#!/usr/bin/env bash
# Mixage final : voix-off (décalée de 1,5 s) + musique (ducking sous la voix) + effets, normalisé à -16 LUFS.
# Grain film ajouté ici (filtre ffmpeg, bien plus rapide que dans le navigateur).
# Puis multiplexage : version sans sous-titres et version avec sous-titres incrustés.
set -euo pipefail
cd "$(dirname "$0")/.."
ffmpeg -y -loglevel error -i public/voiceover.mp3 -i audio/music.wav -i audio/sfx.wav -filter_complex "
[0:a]aresample=48000,aformat=channel_layouts=mono,pan=stereo|c0=c0|c1=c0,adelay=1500|1500,apad=whole_dur=99,asplit=2[vo][key];
[1:a]aresample=48000,volume=0.30[mu];
[mu][key]sidechaincompress=threshold=0.025:ratio=5:attack=30:release=450:makeup=1[duck];
[2:a]aresample=48000,volume=0.42[fx];
[vo][duck][fx]amix=inputs=3:normalize=0:duration=first,atrim=0:99,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[a]" \
  -map "[a]" -c:a pcm_s16le out/_mix.wav
ffmpeg -y -loglevel error -i out/_video_muet.mp4 -i out/_mix.wav -map 0:v -map 1:a -vf "noise=alls=3:allf=t" -c:v libx264 -preset medium -crf 20 -maxrate 7M -bufsize 14M -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -movflags +faststart -shortest "out/MTN-CI_Antifraude_Une-seule-action_1080p_sans-sous-titres.mp4"
ffmpeg -y -loglevel error -i out/_video_muet.mp4 -i out/_mix.wav -map 0:v -map 1:a -vf "noise=alls=3:allf=t,ass=out/sous-titres.ass" -c:v libx264 -preset medium -crf 20 -maxrate 7M -bufsize 14M -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -movflags +faststart -shortest "out/MTN-CI_Antifraude_Une-seule-action_1080p_sous-titres.mp4"
echo "Mixage terminé."

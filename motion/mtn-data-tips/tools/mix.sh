#!/usr/bin/env bash
# Final mixes for the MTN motion film.
#   tools/mix.sh film_video.mp4 audio/ out_dir/
# Produces:
#   mtn-data-tips.mp4            voice-over + music (ducked under the voice) + SFX
#   mtn-data-tips-sans-voix.mp4  music + SFX only (for a future narration)
set -e
V="$1"; A="$2"; O="$3"
mkdir -p "$O"
EQ="highpass=f=70,equalizer=f=1500:t=q:w=1:g=3,treble=g=2:f=4000"

# without voice-over
ffmpeg -v error -y -i "$V" -i "$A/music.wav" -i "$A/sfx_track.wav" -filter_complex "\
[1:a]$EQ,volume=0.55[m];[2:a]volume=0.9[s];\
[m][s]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-1:LRA=11[a]" \
-map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 44100 -movflags +faststart -shortest "$O/mtn-data-tips-sans-voix.mp4"

# with voice-over: music and SFX duck under the voice
ffmpeg -v error -y -i "$V" -i "$A/music.wav" -i "$A/sfx_track.wav" -i "$A/voix-off-calee.wav" -filter_complex "\
[3:a]highpass=f=80,equalizer=f=3000:t=q:w=1:g=2,acompressor=threshold=0.1:ratio=3:attack=5:release=120:makeup=2,asplit=3[vo][sc1][sc2];\
[1:a]$EQ,volume=0.5[m];[m][sc1]sidechaincompress=threshold=0.03:ratio=5:attack=20:release=600[md];\
[2:a]volume=0.8[s];[s][sc2]sidechaincompress=threshold=0.05:ratio=2.5:attack=10:release=300[sd];\
[vo][md][sd]amix=inputs=3:normalize=0:duration=first,loudnorm=I=-14:TP=-1:LRA=11[a]" \
-map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 44100 -movflags +faststart -shortest "$O/mtn-data-tips.mp4"
echo "mixes written to $O"

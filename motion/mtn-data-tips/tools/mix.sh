#!/usr/bin/env bash
# Mix voice-over (delayed 0.8 s to land on the cuts) over the music, ducking the music under the voice.
# usage: tools/mix.sh video_sans_son.mp4 beat.wav assets/voix-off.mp3 sortie.mp4
set -e
ffmpeg -v error -y -i "$1" -i "$2" -i "$3" -filter_complex "\
[2:a]aresample=44100,aformat=channel_layouts=stereo,adelay=800|800,highpass=f=80,equalizer=f=3000:t=q:w=1:g=2,acompressor=threshold=0.1:ratio=3:attack=5:release=120:makeup=2,apad=whole_dur=26,asplit=2[vo][sc];\
[1:a]highpass=f=80,bass=g=-4:f=120,equalizer=f=1500:t=q:w=1:g=4,treble=g=3:f=4000,volume=0.5[mus];\
[mus][sc]sidechaincompress=threshold=0.03:ratio=5:attack=20:release=700:makeup=1[duck];\
[vo][duck]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-1:LRA=11[a]" \
-map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 44100 -movflags +faststart -t 26 "$4"

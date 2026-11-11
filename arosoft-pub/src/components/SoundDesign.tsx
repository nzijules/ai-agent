import React from "react";
import { Audio } from "@remotion/media";
import { Sequence, interpolate, staticFile } from "remotion";
import words from "../data/words.json";
import { DURATION_FRAMES, FPS, sceneStart, vo, VO_OFFSET } from "../config";
import { at } from "./Kinetic";
import { typeDur } from "./Kinetic";
import { TEXTS } from "../config";

type Sfx = { at: number; file: string; vol: number; dur?: number };

const s = (id: Parameters<typeof sceneStart>[0], local: number) => sceneStart(id) + local;

/** Liste des effets sonores, calés sur les mêmes repères que les animations. */
export const SFX: Sfx[] = [
  // Scène 1
  { at: 0, file: "soft_impact", vol: 0.55 },
  { at: 2, file: "whoosh", vol: 0.3 },
  { at: vo(1.68) - 4, file: "whoosh", vol: 0.25 },
  { at: vo(5.15), file: "soft_impact", vol: 0.6 },
  // Scène 2
  { at: sceneStart("s2") - 8, file: "whoosh", vol: 0.45 },
  { at: s("s2", 14), file: "typing", vol: 0.3, dur: typeDur(TEXTS.s2Prompt, 34) },
  { at: s("s2", 14 + typeDur(TEXTS.s2Prompt, 34) + 2), file: "click", vol: 0.4 },
  { at: s("s2", 14 + typeDur(TEXTS.s2Prompt, 34) + 10), file: "shimmer", vol: 0.25 },
  { at: vo(9.1), file: "pop", vol: 0.35 },
  { at: vo(13.28), file: "soft_impact", vol: 0.35 },
  // Scène 3
  { at: sceneStart("s3") - 8, file: "whoosh", vol: 0.45 },
  { at: vo(16.8), file: "pop", vol: 0.3 },
  { at: vo(19.99) - 50, file: "riser", vol: 0.22 },
  { at: vo(19.99), file: "bass_impact", vol: 0.45 },
  { at: vo(19.99) + 4, file: "whoosh", vol: 0.3 },
  { at: vo(23.55), file: "shimmer", vol: 0.3 },
  // Scène 4
  { at: sceneStart("s4") - 8, file: "whoosh", vol: 0.4 },
  { at: vo(25.9), file: "pop", vol: 0.35 },
  { at: vo(27.45), file: "click", vol: 0.4 },
  { at: vo(27.45) + 8, file: "typing", vol: 0.25, dur: typeDur(TEXTS.s4Prompt, 30) },
  { at: vo(28.7) - 6, file: "shimmer", vol: 0.35 },
  { at: vo(28.7) + 14, file: "pop", vol: 0.25 },
  // Scène 5
  { at: sceneStart("s5") - 8, file: "whoosh", vol: 0.35 },
  { at: vo(34.6), file: "pop", vol: 0.25 },
  { at: vo(34.85), file: "typing", vol: 0.22, dur: typeDur(TEXTS.s5Prompt, 34) },
  { at: vo(34.85) + typeDur(TEXTS.s5Prompt, 34) + 4, file: "click", vol: 0.45 },
  { at: vo(34.85) + typeDur(TEXTS.s5Prompt, 34) + 6, file: "shimmer", vol: 0.3 },
  { at: vo(36.0), file: "soft_impact", vol: 0.3 },
  // Scène 6
  { at: sceneStart("s6") - 8, file: "whoosh", vol: 0.4 },
  { at: vo(39.47) - 30, file: "riser", vol: 0.2 },
  { at: vo(40.0), file: "bass_impact", vol: 0.35 },
  { at: vo(40.0) + 2, file: "whoosh", vol: 0.35 },
  { at: vo(40.75), file: "whoosh", vol: 0.2 },
  { at: vo(41.68), file: "pop", vol: 0.35 },
  { at: vo(42.56), file: "pop", vol: 0.35 },
  { at: vo(43.44), file: "pop", vol: 0.35 },
  // Scène 7
  { at: sceneStart("s7") - 8, file: "whoosh", vol: 0.45 },
  { at: vo(46.95) - 60, file: "riser", vol: 0.25 },
  { at: vo(46.95), file: "bass_impact", vol: 0.6 },
  { at: vo(46.95) + 2, file: "shimmer", vol: 0.3 },
  { at: vo(48.35), file: "pop", vol: 0.3 },
  // Scène 8
  { at: sceneStart("s8") - 8, file: "whoosh", vol: 0.4 },
  { at: s("s8", 34), file: "pop", vol: 0.35 },
  { at: s("s8", 46), file: "click", vol: 0.45 },
  { at: vo(54.64) + 4, file: "chime", vol: 0.4 },
];

/** Activité vocale par frame (pour le ducking de la musique). */
const speech = (() => {
  const arr = new Float32Array(DURATION_FRAMES + 1);
  for (const w of (words as { words: { text: string; start: number; end: number }[] }).words) {
    if (w.text.startsWith("[")) continue;
    const a = Math.floor((w.start + VO_OFFSET - 0.12) * FPS);
    const b = Math.ceil((w.end + VO_OFFSET + 0.25) * FPS);
    for (let i = Math.max(0, a); i <= Math.min(DURATION_FRAMES, b); i++) arr[i] = 1;
  }
  // lissage (attaque/relâchement doux)
  const out = new Float32Array(arr.length);
  const R = 6;
  for (let i = 0; i < arr.length; i++) {
    let sum = 0, n = 0;
    for (let k = -R; k <= R; k++) {
      const j = i + k;
      if (j >= 0 && j < arr.length) { sum += arr[j]; n++; }
    }
    out[i] = sum / n;
  }
  return out;
})();

export const MUSIC_BASE = 0.42;
export const MUSIC_DUCKED = 0.13;

export const musicVolume = (f: number) => {
  const duck = speech[Math.min(f, speech.length - 1)] ?? 0;
  const v = MUSIC_BASE + (MUSIC_DUCKED - MUSIC_BASE) * duck;
  const fadeIn = interpolate(f, [0, 20], [0.3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(f, [DURATION_FRAMES - 45, DURATION_FRAMES], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return v * fadeIn * fadeOut;
};

export const SoundDesign: React.FC<{ voice?: boolean; music?: boolean; sfx?: boolean }> = ({ voice = true, music = true, sfx = true }) => (
  <>
    {voice && (
      <Sequence from={Math.round(VO_OFFSET * FPS)} layout="none" name="Voix-off">
        <Audio src={staticFile("audio/voiceover.mp3")} volume={1} />
      </Sequence>
    )}
    {music && <Audio src={staticFile("audio/music.mp3")} volume={musicVolume} name="Musique" />}
    {sfx &&
      SFX.map((e, i) => (
        <Sequence key={i} from={Math.max(0, e.at)} durationInFrames={e.dur ?? 3 * FPS} layout="none" name={`SFX ${e.file}`}>
          <Audio src={staticFile(`sfx/${e.file}.wav`)} volume={e.vol} />
        </Sequence>
      ))}
  </>
);
void at;

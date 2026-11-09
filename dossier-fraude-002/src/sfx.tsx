import React from "react";
import { Audio, Loop, Sequence, staticFile } from "remotion";
import { SCENE_STARTS, TOTAL_FRAMES } from "./timeline";

type Cue = [scene: number, frame: number, sound: string, vol?: number];

/** Habillage sonore synchronisé (frames relatives à chaque scène). Fichiers : npm run sfx */
const CUES: Cue[] = [
  [0, 0, "whoosh", 0.5], [0, 40, "buzz"], [0, 70, "buzz"], [0, 100, "buzz"], [0, 150, "whoosh"], [0, 283, "hit"],
  [1, 78, "tick"], [1, 109, "tick"], [1, 148, "tick"], [1, 190, "alert", 0.3], [1, 235, "whoosh"], [1, 300, "hit", 0.8],
  [2, 0, "whoosh"], [2, 102, "tick"], [2, 120, "tick"], [2, 138, "tick"], [2, 156, "tick"], [2, 315, "stamp"],
  [3, 0, "whoosh"], [3, 82, "tick"], ...Array.from({ length: 8 }, (_, i): Cue => [3, 150 + i * 10, "pulse", 0.9]), [3, 231, "whoosh"], [3, 343, "stamp", 0.4],
  [4, 0, "whoosh"], [4, 93, "notif"], ...Array.from({ length: 6 }, (_, i): Cue => [4, 111 + i * 7, "tick"]), [4, 205, "whoosh", 0.6], [4, 322, "alert"], [4, 372, "hit", 0.6],
  [5, 0, "whoosh"], [5, 41, "tick"], [5, 152, "tick"], [5, 276, "tick"], [5, 330, "pulse"],
  [6, 0, "whoosh", 0.4], [6, 46, "hit"], [6, 46, "stamp"],
  [7, 0, "whoosh"], [7, 37, "whoosh"], [7, 107, "tick"], [7, 195, "whoosh"], [7, 267, "tick"], [7, 285, "notif", 0.6], [7, 373, "whoosh"], [7, 460, "tick"], [7, 463, "notif"],
  [8, 0, "whoosh"], [8, 95, "notif"], [8, 165, "whoosh"], [8, 237, "hit", 0.6],
];

export const SFX: React.FC<{ volume: number }> = ({ volume }) => (
  <>
    <Loop durationInFrames={600} times={Math.ceil(TOTAL_FRAMES / 600)}>
      <Audio src={staticFile("sfx/drone.wav")} volume={0.18 * volume} />
    </Loop>
    {CUES.map(([s, fr, snd, v = 1], i) => (
      <Sequence key={i} from={SCENE_STARTS[s] + fr} durationInFrames={60} layout="none">
        <Audio src={staticFile(`sfx/${snd}.wav`)} volume={v * volume} />
      </Sequence>
    ))}
  </>
);

import React from "react";
import { Audio, Loop, Sequence, staticFile } from "remotion";
import { SCENE_STARTS, TOTAL_FRAMES } from "./timeline";

type Cue = [scene: number, frame: number, sound: string, vol?: number];

/** Habillage sonore synchronisé (frames relatives à chaque scène). Fichiers : npm run sfx */
const CUES: Cue[] = [
  [0, 0, "whoosh", 0.5], [0, 40, "buzz"], [0, 70, "buzz"], [0, 100, "buzz"], [0, 150, "whoosh"], [0, 290, "hit"],
  [1, 83, "tick"], [1, 115, "tick"], [1, 157, "tick"], [1, 200, "alert", 0.3], [1, 243, "whoosh"], [1, 305, "hit", 0.8],
  [2, 0, "whoosh"], [2, 119, "tick"], [2, 137, "tick"], [2, 155, "tick"], [2, 173, "tick"], [2, 330, "stamp"],
  [3, 0, "whoosh"], [3, 81, "tick"], ...Array.from({ length: 8 }, (_, i): Cue => [3, 150 + i * 10, "pulse", 0.9]), [3, 231, "whoosh"], [3, 343, "stamp", 0.4],
  [4, 0, "whoosh"], [4, 95, "notif"], ...Array.from({ length: 6 }, (_, i): Cue => [4, 113 + i * 7, "tick"]), [4, 200, "whoosh", 0.6], [4, 314, "alert"], [4, 356, "hit", 0.6],
  [5, 0, "whoosh"], [5, 38, "tick"], [5, 140, "tick"], [5, 251, "tick"], [5, 310, "pulse"],
  [6, 0, "whoosh", 0.4], [6, 44, "hit"], [6, 44, "stamp"],
  [7, 0, "whoosh"], [7, 38, "whoosh"], [7, 108, "tick"], [7, 219, "whoosh"], [7, 291, "tick"], [7, 309, "notif", 0.6], [7, 394, "whoosh"], [7, 481, "tick"], [7, 484, "notif"],
  [8, 0, "whoosh"], [8, 95, "notif"], [8, 150, "whoosh"], [8, 219, "hit", 0.6],
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

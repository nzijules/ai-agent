import React from "react";
import { Audio, Loop, Sequence, staticFile } from "remotion";
import { SCENE_STARTS, TOTAL_FRAMES } from "./timeline";

type Cue = [scene: number, frame: number, sound: string, vol?: number];

/** Habillage sonore synchronisé (frames relatives à chaque scène). Fichiers : npm run sfx */
const CUES: Cue[] = [
  [0, 0, "whoosh", 0.5], [0, 40, "buzz"], [0, 70, "buzz"], [0, 100, "buzz"], [0, 150, "whoosh"], [0, 287, "hit"],
  [1, 86, "tick"], [1, 117, "tick"], [1, 158, "tick"], [1, 190, "alert", 0.3], [1, 246, "whoosh"], [1, 300, "hit", 0.8],
  [2, 0, "whoosh"], [2, 111, "tick"], [2, 129, "tick"], [2, 147, "tick"], [2, 165, "tick"], [2, 311, "stamp"],
  [3, 0, "whoosh"], [3, 88, "tick"], ...Array.from({ length: 8 }, (_, i): Cue => [3, 150 + i * 10, "pulse", 0.9]), [3, 231, "whoosh"], [3, 337, "stamp", 0.4],
  [4, 0, "whoosh"], [4, 104, "notif"], ...Array.from({ length: 6 }, (_, i): Cue => [4, 122 + i * 7, "tick"]), [4, 215, "whoosh", 0.6], [4, 330, "alert"], [4, 368, "hit", 0.6],
  [5, 0, "whoosh"], [5, 41, "tick"], [5, 152, "tick"], [5, 274, "tick"], [5, 330, "pulse"],
  [6, 0, "whoosh", 0.4], [6, 46, "hit"], [6, 46, "stamp"],
  [7, 0, "whoosh"], [7, 42, "whoosh"], [7, 112, "tick"], [7, 209, "whoosh"], [7, 232, "tick"], [7, 330, "whoosh"], [7, 417, "tick"], [7, 420, "notif"],
  [8, 0, "whoosh"], [8, 95, "notif"], [8, 153, "whoosh"], [8, 235, "hit", 0.6],
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

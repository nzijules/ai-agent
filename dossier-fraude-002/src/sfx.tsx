import React from "react";
import { Audio, Loop, Sequence, staticFile } from "remotion";
import { SCENE_STARTS, TOTAL_FRAMES } from "./timeline";

type Cue = [scene: number, frame: number, sound: string, vol?: number];

/** Habillage sonore synchronisé (frames relatives à chaque scène). Fichiers : npm run sfx */
const CUES: Cue[] = [
  [0, 0, "whoosh", 0.5], [0, 40, "buzz"], [0, 70, "buzz"], [0, 100, "buzz"], [0, 150, "whoosh"], [0, 252, "hit"],
  [1, 34, "tick"], [1, 62, "tick"], [1, 88, "tick"], [1, 100, "alert", 0.3], [1, 215, "whoosh"], [1, 240, "hit", 0.8],
  [2, 0, "whoosh"], [2, 80, "tick"], [2, 102, "tick"], [2, 124, "tick"], [2, 146, "tick"], [2, 270, "stamp"],
  [3, 0, "whoosh"], [3, 40, "tick"], ...Array.from({ length: 8 }, (_, i): Cue => [3, 90 + i * 15, "pulse", 0.9]), [3, 215, "whoosh"], [3, 305, "stamp", 0.4],
  [4, 0, "whoosh"], [4, 60, "notif"], ...Array.from({ length: 6 }, (_, i): Cue => [4, 78 + i * 7, "tick"]), [4, 185, "whoosh", 0.6], [4, 262, "alert"], [4, 280, "hit", 0.6],
  [5, 0, "whoosh"], [5, 50, "tick"], [5, 150, "tick"], [5, 250, "tick"], [5, 320, "pulse"],
  [6, 0, "whoosh", 0.4], [6, 52, "hit"], [6, 52, "stamp"],
  [7, 0, "whoosh"], [7, 56, "whoosh"], [7, 126, "tick"], [7, 247, "whoosh"], [7, 270, "tick"], [7, 372, "whoosh"], [7, 459, "tick"], [7, 462, "notif"],
  [8, 0, "whoosh"], [8, 95, "notif"], [8, 157, "whoosh"], [8, 300, "hit", 0.6],
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

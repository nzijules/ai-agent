import React from "react";
import { Audio, Loop, Sequence, staticFile } from "remotion";
import { SCENE_STARTS, TOTAL_FRAMES } from "./timeline";

type Cue = [scene: number, frame: number, sound: string, vol?: number];

/** Habillage sonore synchronisé (frames relatives à chaque scène). Fichiers : npm run sfx */
const CUES: Cue[] = [
  [0, 0, "whoosh", 0.5], [0, 40, "buzz"], [0, 70, "buzz"], [0, 100, "buzz"], [0, 150, "whoosh"], [0, 289, "hit"],
  [1, 87, "tick"], [1, 119, "tick"], [1, 165, "tick"], [1, 204, "alert", 0.3], [1, 248, "whoosh"], [1, 305, "hit", 0.8],
  [2, 0, "whoosh"], [2, 114, "tick"], [2, 132, "tick"], [2, 150, "tick"], [2, 168, "tick"], [2, 314, "stamp"],
  [3, 0, "whoosh"], [3, 99, "tick"], ...Array.from({ length: 8 }, (_, i): Cue => [3, 160 + i * 10, "pulse", 0.9]), [3, 248, "whoosh"], [3, 353, "stamp", 0.4],
  [4, 0, "whoosh"], [4, 110, "notif"], ...Array.from({ length: 6 }, (_, i): Cue => [4, 128 + i * 7, "tick"]), [4, 240, "whoosh", 0.6], [4, 350, "alert"], [4, 396, "hit", 0.6],
  [5, 0, "whoosh"], [5, 47, "tick"], [5, 159, "tick"], [5, 285, "tick"], [5, 345, "pulse"],
  [6, 0, "whoosh", 0.4], [6, 50, "hit"], [6, 50, "stamp"],
  [7, 0, "whoosh"], [7, 45, "whoosh"], [7, 115, "tick"], [7, 227, "whoosh"], [7, 299, "tick"], [7, 317, "notif", 0.6], [7, 402, "whoosh"], [7, 489, "tick"], [7, 492, "notif"],
  [8, 0, "whoosh"], [8, 95, "notif"], [8, 152, "whoosh"], [8, 224, "hit", 0.6],
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

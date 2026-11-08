import React from "react";
import { SCENE_FRAMES } from "../theme/timing";
import { Scene1Problem } from "./Scene1Problem";
import { Scene2AutoUpdates } from "./Scene2AutoUpdates";
import { Scene3Background } from "./Scene3Background";
import { Scene4VideoQuality } from "./Scene4VideoQuality";
import { Scene5Backups } from "./Scene5Backups";
import { Scene6Usage } from "./Scene6Usage";
import { Scene7Share } from "./Scene7Share";

export type SceneDef = { id: string; frames: number; Component: React.FC<{ withAudio?: boolean; dur?: number }> };

/** Ordre et durée des scènes (durées en frames : theme/timing.ts → SCENE_FRAMES). */
export const SCENES: SceneDef[] = [
  { id: "S1-Probleme", frames: SCENE_FRAMES.s1, Component: Scene1Problem },
  { id: "S2-MisesAJour", frames: SCENE_FRAMES.s2, Component: Scene2AutoUpdates },
  { id: "S3-ArrierePlan", frames: SCENE_FRAMES.s3, Component: Scene3Background },
  { id: "S4-QualiteVideo", frames: SCENE_FRAMES.s4, Component: Scene4VideoQuality },
  { id: "S5-Sauvegardes", frames: SCENE_FRAMES.s5, Component: Scene5Backups },
  { id: "S6-Consommation", frames: SCENE_FRAMES.s6, Component: Scene6Usage },
  { id: "S7-Partage", frames: SCENE_FRAMES.s7, Component: Scene7Share },
];

import React from "react";
import { SCENE_SECONDS } from "../theme/timing";
import { Scene1Problem } from "./Scene1Problem";
import { Scene2AutoUpdates } from "./Scene2AutoUpdates";
import { Scene3Background } from "./Scene3Background";
import { Scene4VideoQuality } from "./Scene4VideoQuality";
import { Scene5Backups } from "./Scene5Backups";
import { Scene6Usage } from "./Scene6Usage";
import { Scene7Share } from "./Scene7Share";

export type SceneDef = { id: string; seconds: number; Component: React.FC<{ withAudio?: boolean }> };

/** Ordre et durée des scènes (les durées se règlent dans theme/timing.ts). */
export const SCENES: SceneDef[] = [
  { id: "S1-Probleme", seconds: SCENE_SECONDS.s1, Component: Scene1Problem },
  { id: "S2-MisesAJour", seconds: SCENE_SECONDS.s2, Component: Scene2AutoUpdates },
  { id: "S3-ArrierePlan", seconds: SCENE_SECONDS.s3, Component: Scene3Background },
  { id: "S4-QualiteVideo", seconds: SCENE_SECONDS.s4, Component: Scene4VideoQuality },
  { id: "S5-Sauvegardes", seconds: SCENE_SECONDS.s5, Component: Scene5Backups },
  { id: "S6-Consommation", seconds: SCENE_SECONDS.s6, Component: Scene6Usage },
  { id: "S7-Partage", seconds: SCENE_SECONDS.s7, Component: Scene7Share },
];

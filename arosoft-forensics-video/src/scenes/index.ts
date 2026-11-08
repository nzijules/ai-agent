import React from "react";
import { SceneId } from "../data/script";
import { Scene1Deletion } from "./Scene1Deletion";
import { Scene2DataUniverse } from "./Scene2DataUniverse";
import { Scene3Investigator } from "./Scene3Investigator";
import { Scene4Encryption } from "./Scene4Encryption";
import { Scene5Protection } from "./Scene5Protection";

export const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  s1: Scene1Deletion,
  s2: Scene2DataUniverse,
  s3: Scene3Investigator,
  s4: Scene4Encryption,
  s5: Scene5Protection,
};

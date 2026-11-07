import React from "react";
import { Composition } from "remotion";
import { Pub, DUREE_TOTALE } from "./Pub";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="PubAroSoft"
    component={Pub}
    durationInFrames={DUREE_TOTALE}
    fps={30}
    width={1080}
    height={1920}
  />
);

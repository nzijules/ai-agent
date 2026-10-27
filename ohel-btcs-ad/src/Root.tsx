import React from "react";
import { CalculateMetadataFunction, Composition, Folder } from "remotion";
import { AdProps, OhelBtcsAd, SCENE_COMPONENTS, adSchema, elementsManquants } from "./OhelBtcsAd";
import { FPS, SCENES, TOTAL_FRAMES, sceneFrames } from "./config/script";

/** En mode final, le rendu échoue tant qu'un élément obligatoire manque. */
const verifier: CalculateMetadataFunction<AdProps> = ({ props }) => {
  if (props.mode === "final") {
    const manque = elementsManquants();
    if (manque.length > 0) {
      throw new Error(`Rendu final impossible, éléments manquants :\n- ${manque.join("\n- ")}`);
    }
  }
  return { durationInFrames: TOTAL_FRAMES };
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Publicite">
        <Composition
          id="OHEL-BTCS-9x16"
          component={OhelBtcsAd}
          schema={adSchema}
          calculateMetadata={verifier}
          durationInFrames={TOTAL_FRAMES}
          fps={FPS}
          width={1080}
          height={1920}
          defaultProps={{ sousTitres: false, mode: "maquette", zonesSecurite: false }}
        />
        <Composition
          id="OHEL-BTCS-9x16-ST"
          component={OhelBtcsAd}
          schema={adSchema}
          calculateMetadata={verifier}
          durationInFrames={TOTAL_FRAMES}
          fps={FPS}
          width={1080}
          height={1920}
          defaultProps={{ sousTitres: true, mode: "maquette", zonesSecurite: false }}
        />
        <Composition
          id="OHEL-BTCS-16x9"
          component={OhelBtcsAd}
          schema={adSchema}
          calculateMetadata={verifier}
          durationInFrames={TOTAL_FRAMES}
          fps={FPS}
          width={1920}
          height={1080}
          defaultProps={{ sousTitres: false, mode: "maquette", zonesSecurite: false }}
        />
        <Composition
          id="OHEL-BTCS-16x9-ST"
          component={OhelBtcsAd}
          schema={adSchema}
          calculateMetadata={verifier}
          durationInFrames={TOTAL_FRAMES}
          fps={FPS}
          width={1920}
          height={1080}
          defaultProps={{ sousTitres: true, mode: "maquette", zonesSecurite: false }}
        />
      </Folder>
      <Folder name="Scenes-9x16">
        {SCENES.map((s) => (
          <Composition
            key={s.id}
            id={`Scene-${s.id}`}
            component={SCENE_COMPONENTS[s.id]}
            durationInFrames={sceneFrames(s)}
            fps={FPS}
            width={1080}
            height={1920}
          />
        ))}
      </Folder>
    </>
  );
};

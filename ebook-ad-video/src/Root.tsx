import "./index.css";
import React from "react";
import { Composition, Folder } from "remotion";
import { Ad, AdProps, SCENE_COMPONENTS } from "./Ad";
import { SceneWrap } from "./scenes/Stage";
import { makeTimeline, SceneId, TimelineProvider, Variant } from "./timeline";
import { FPS } from "./theme";

const SceneOnly: React.FC<{ id: SceneId; variant: Variant }> = ({ id, variant }) => {
  const C = SCENE_COMPONENTS[variant][id];
  return (
    <TimelineProvider variant={variant}>
      <SceneWrap inFrames={0} outFrames={0}>
        <C />
      </SceneWrap>
    </TimelineProvider>
  );
};

const formats = [
  { key: "Verticale", w: 1080, h: 1920 },
  { key: "Carree", w: 1080, h: 1080 },
];
// Composition ids: Pub-Verticale-VoixOff (angle Contrôle, historical id) and Pub-Verticale-Economie-VoixOff, etc.
const cuts: { variant: Variant; tag: string }[] = [
  { variant: "controle", tag: "" },
  { variant: "economie", tag: "-Economie" },
];

export const RemotionRoot: React.FC = () => (
  <>
    {cuts.map((cut) => {
      const tl = makeTimeline(cut.variant);
      return (
        <Folder key={cut.variant} name={`Angle-${cut.variant}`}>
          {formats.map((fm) =>
            [true, false].map((vo) => (
              <Composition
                key={`${fm.key}-${vo}`}
                id={`Pub-${fm.key}${cut.tag}-${vo ? "VoixOff" : "SansVoix"}`}
                component={Ad as React.FC<AdProps>}
                width={fm.w}
                height={fm.h}
                fps={FPS}
                durationInFrames={tl.TOTAL_FRAMES}
                defaultProps={{ voiceover: vo, captions: vo, variant: cut.variant }}
              />
            )),
          )}
          {tl.SCENES.map((s) => (
            <Composition
              key={s.id}
              id={`${s.id}${cut.tag}`}
              component={() => <SceneOnly id={s.id} variant={cut.variant} />}
              width={1080}
              height={1920}
              fps={FPS}
              durationInFrames={Math.round((s.to - s.from) * FPS)}
            />
          ))}
        </Folder>
      );
    })}
  </>
);

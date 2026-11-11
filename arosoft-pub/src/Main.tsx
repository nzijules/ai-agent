import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { OVERLAP, SCENE_ORDER, SceneId, sceneEnd, sceneStart } from "./config";
import { tw } from "./anim";
import { S1Einstein } from "./scenes/S1Einstein";
import { S2Promise } from "./scenes/S2Promise";
import { S3Belief } from "./scenes/S3Belief";
import { S4Click } from "./scenes/S4Click";
import { S5Ask } from "./scenes/S5Ask";
import { S6Guide } from "./scenes/S6Guide";
import { S7Price } from "./scenes/S7Price";
import { S8CTA } from "./scenes/S8CTA";
import { Logo } from "./components/Logo";
import { Subtitles } from "./components/Subtitles";
import { SoundDesign } from "./components/SoundDesign";

const SCENES: Record<SceneId, React.FC> = { s1: S1Einstein, s2: S2Promise, s3: S3Belief, s4: S4Click, s5: S5Ask, s6: S6Guide, s7: S7Price, s8: S8CTA };

/** Transition d'entrée : zoom + flou + balayage lumineux (caméra virtuelle). */
const SceneIn: React.FC<{ children: React.ReactNode; first: boolean }> = ({ children, first }) => {
  const f = useCurrentFrame();
  if (first) return <AbsoluteFill>{children}</AbsoluteFill>;
  return (
    <AbsoluteFill
      style={{
        opacity: tw(f, [0, OVERLAP * 0.7], [0, 1]),
        scale: String(tw(f, [0, OVERLAP + 6], [1.12, 1])),
        filter: `blur(${tw(f, [0, OVERLAP], [14, 0])}px)`,
      }}
    >
      {children}
      <AbsoluteFill
        style={{
          background: "linear-gradient(100deg, transparent 35%, rgba(56,207,255,0.35) 50%, transparent 65%)",
          translate: `${tw(f, [0, OVERLAP + 8], [-1100, 1100])}px 0px`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

export const Main: React.FC<{ audio?: { voice?: boolean; music?: boolean; sfx?: boolean } }> = ({ audio }) => (
  <AbsoluteFill style={{ backgroundColor: "#060B1C" }}>
    {SCENE_ORDER.map((id, i) => {
      const C = SCENES[id];
      const from = sceneStart(id) - (i === 0 ? 0 : OVERLAP);
      const dur = sceneEnd(id) - from + (i === SCENE_ORDER.length - 1 ? 0 : OVERLAP);
      return (
        <Sequence key={id} from={from} durationInFrames={dur} name={`Scène ${i + 1}`}>
          <SceneIn first={i === 0}>
            <Shifted by={i === 0 ? 0 : OVERLAP}>
              <C />
            </Shifted>
          </SceneIn>
        </Sequence>
      );
    })}
    <Subtitles />
    <Logo />
    <SoundDesign {...(audio ?? {})} />
  </AbsoluteFill>
);

/** Décale l'horloge des enfants pour que frame 0 = début officiel de la scène. */
const Shifted: React.FC<{ by: number; children: React.ReactNode }> = ({ by, children }) => (
  <Sequence from={-by} layout="absolute-fill">
    {children}
  </Sequence>
);

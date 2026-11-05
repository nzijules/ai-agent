import React from "react";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { Captions } from "./components/Captions";
import { Logo } from "./components/Logo";
import { SceneWrap } from "./scenes/Stage";
import { S1Hook } from "./scenes/S1Hook";
import { S1HookEconomie } from "./scenes/S1HookEconomie";
import { S2Problem } from "./scenes/S2Problem";
import { S2ProblemEconomie } from "./scenes/S2ProblemEconomie";
import { S1HookComposition } from "./scenes/S1HookComposition";
import { S2ProblemComposition } from "./scenes/S2ProblemComposition";
import { S3Pivot } from "./scenes/S3Pivot";
import { S4Reveal } from "./scenes/S4Reveal";
import { S5Benefits } from "./scenes/S5Benefits";
import { S6Method } from "./scenes/S6Method";
import { S7Offer } from "./scenes/S7Offer";
import { S7Result } from "./scenes/S7Result";
import { S8Cta } from "./scenes/S8Cta";
import { Angle, OVERLAP, SceneId, TimelineProvider, useTL, Variant } from "./timeline";
import { loadFonts } from "./theme";

loadFonts();

const SHARED: Record<SceneId, React.FC> = {
  "S1-Accroche": S1Hook,
  "S2-Probleme": S2Problem,
  "S3-Tuteur": S3Pivot,
  "S4-Revelation": S4Reveal,
  "S5-Benefices": S5Benefits,
  "S6-Methode": S6Method,
  "S7-Resultat": S7Result,
  "S7-Offre": S7Offer,
  "S8-Appel": S8Cta,
};
/** Scene components per cut: the "economie" cut swaps the hook and the problem scenes. */
export const SCENE_COMPONENTS: Record<Angle, Record<SceneId, React.FC>> = {
  controle: SHARED,
  economie: { ...SHARED, "S1-Accroche": S1HookEconomie, "S2-Probleme": S2ProblemEconomie },
  composition: { ...SHARED, "S1-Accroche": S1HookComposition, "S2-Probleme": S2ProblemComposition },
};

export type AdProps = { voiceover: boolean; captions: boolean; variant: Variant };

const AdInner: React.FC<Omit<AdProps, "variant">> = ({ voiceover, captions }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const tl = useTL();
  const comps = SCENE_COMPONENTS[tl.variant];
  const musicVolume = (f: number) => {
    const t = f / fps;
    const fadeOut = Math.min(1, Math.max(0, (durationInFrames / fps - t) / 1.0));
    if (!voiceover) return 0.55 * fadeOut;
    // duck under the voice (smooth 0.25 s ramps)
    let duck = 0;
    for (const l of tl.LINES) {
      const a = l.start - 0.25;
      const b = l.start + l.duration + 0.25;
      if (t > a && t < b) duck = Math.max(duck, Math.min(1, (t - a) / 0.25, (b - t) / 0.25));
    }
    return (0.34 - 0.2 * duck) * fadeOut;
  };
  return (
    <AbsoluteFill style={{ background: "#0B1B3A" }}>
      {tl.SCENES.map((s, i) => {
        const Comp = comps[s.id];
        const from = Math.round(s.from * fps);
        const isLast = i === tl.SCENES.length - 1;
        const dur = Math.round((s.to - s.from) * fps) + (isLast ? 0 : OVERLAP);
        return (
          <Sequence key={s.id} name={s.id} from={from} durationInFrames={dur}>
            <SceneWrap inFrames={i === 0 ? 0 : OVERLAP} outFrames={isLast ? 0 : OVERLAP}>
              <Comp />
            </SceneWrap>
          </Sequence>
        );
      })}
      <Logo />
      {captions && voiceover && <Captions />}
      <Audio src={staticFile(tl.music)} volume={musicVolume} />
      {voiceover &&
        tl.LINES.map((l) => (
          <Sequence key={l.id} name={`VO ${l.id}`} from={Math.round(l.start * fps)} durationInFrames={Math.ceil((l.duration + 0.1) * fps)} layout="none">
            <Audio src={staticFile(`${tl.voDir}/${l.id}.wav`)} volume={1} />
          </Sequence>
        ))}
      {tl.SFX.map(([name, t, v], i) => (
        <Sequence key={i} name={`SFX ${name}`} from={Math.round(t * fps)} layout="none">
          <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={v * (voiceover ? 0.85 : 1)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const Ad: React.FC<AdProps> = ({ variant, ...rest }) => (
  <TimelineProvider variant={variant}>
    <AdInner {...rest} />
  </TimelineProvider>
);

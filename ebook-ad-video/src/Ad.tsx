import React from "react";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import vo from "./generated/voiceover.json";
import { Captions } from "./components/Captions";
import { SceneWrap } from "./scenes/Stage";
import { S1Hook } from "./scenes/S1Hook";
import { S2Problem } from "./scenes/S2Problem";
import { S3Pivot } from "./scenes/S3Pivot";
import { S4Reveal } from "./scenes/S4Reveal";
import { S5Benefits } from "./scenes/S5Benefits";
import { S6Method } from "./scenes/S6Method";
import { S7Offer } from "./scenes/S7Offer";
import { S8Cta } from "./scenes/S8Cta";
import { OVERLAP, SCENES, SFX, SceneId } from "./timeline";
import { loadFonts } from "./theme";

loadFonts();

export const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  "S1-Accroche": S1Hook,
  "S2-Probleme": S2Problem,
  "S3-Tuteur": S3Pivot,
  "S4-Revelation": S4Reveal,
  "S5-Benefices": S5Benefits,
  "S6-Methode": S6Method,
  "S7-Offre": S7Offer,
  "S8-Appel": S8Cta,
};

export type AdProps = { voiceover: boolean; captions: boolean };

type VoLine = { id: string; start: number; duration: number };
const lines = (vo as { lines: VoLine[] }).lines;

export const Ad: React.FC<AdProps> = ({ voiceover, captions }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const musicVolume = (f: number) => {
    const t = f / fps;
    const fadeOut = Math.min(1, Math.max(0, (durationInFrames / fps - t) / 1.0));
    if (!voiceover) return 0.55 * fadeOut;
    // duck under the voice (smooth 0.25 s ramps)
    let duck = 0;
    for (const l of lines) {
      const a = l.start - 0.25;
      const b = l.start + l.duration + 0.25;
      if (t > a && t < b) duck = Math.max(duck, Math.min(1, (t - a) / 0.25, (b - t) / 0.25));
    }
    return (0.34 - 0.2 * duck) * fadeOut;
  };
  return (
    <AbsoluteFill style={{ background: "#0B1B3A" }}>
      {SCENES.map((s, i) => {
        const Comp = SCENE_COMPONENTS[s.id];
        const from = Math.round(s.from * fps);
        const isLast = i === SCENES.length - 1;
        const dur = Math.round((s.to - s.from) * fps) + (isLast ? 0 : OVERLAP);
        return (
          <Sequence key={s.id} name={s.id} from={from} durationInFrames={dur}>
            <SceneWrap inFrames={i === 0 ? 0 : OVERLAP} outFrames={isLast ? 0 : OVERLAP}>
              <Comp />
            </SceneWrap>
          </Sequence>
        );
      })}
      {captions && voiceover && <Captions />}
      <Audio src={staticFile("audio/music.mp3")} volume={musicVolume} />
      {voiceover &&
        lines.map((l) => (
          <Sequence key={l.id} name={`VO ${l.id}`} from={Math.round(l.start * fps)} durationInFrames={Math.ceil((l.duration + 0.1) * fps)} layout="none">
            <Audio src={staticFile(`audio/vo/${l.id}.wav`)} volume={1} />
          </Sequence>
        ))}
      {SFX.map(([name, t, v], i) => (
        <Sequence key={i} name={`SFX ${name}`} from={Math.round(t * fps)} layout="none">
          <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={v * (voiceover ? 0.85 : 1)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_IN, EASE_OUT, SceneOffsetContext, tw } from "../lib/anim";

/**
 * Enveloppe de scène : gère la transition « plongée caméra »
 * (la scène sortante grossit et se dissout, l'entrante arrive du fond)
 * et expose l'horloge relative via SceneOffsetContext.
 */
export const SceneShell: React.FC<{
  inFrames: number;
  outFrames: number;
  children: React.ReactNode;
}> = ({ inFrames, outFrames, children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const pIn = inFrames > 0 ? tw(frame, [0, inFrames], [0, 1], EASE_OUT) : 1;
  const pOut = outFrames > 0 ? tw(frame, [durationInFrames - outFrames, durationInFrames], [0, 1], EASE_IN) : 0;
  const scale = (0.86 + 0.14 * pIn) * (1 + 0.28 * pOut);
  const blur = (1 - pIn) * 14 + pOut * 16;
  return (
    <SceneOffsetContext.Provider value={inFrames}>
      <AbsoluteFill
        style={{
          opacity: pIn * (1 - pOut),
          scale: String(scale),
          filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
        }}
      >
        {children}
      </AbsoluteFill>
    </SceneOffsetContext.Provider>
  );
};

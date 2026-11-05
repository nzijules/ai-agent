import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useLayout } from "../layout";
import { OVERLAP, SceneId, useTL } from "../timeline";

/**
 * AroSoft logo, top-right, small. Colour version on light scenes, light version (navy parts in white)
 * on dark navy scenes, cross-faded with the scene transitions.
 * Placed below the TikTok / Reels top bar and clear of the right action rail.
 */
const DARK: SceneId[] = ["S1-Accroche", "S4-Revelation", "S7-Offre"];

export const Logo: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { SCENES } = useTL();
  const L = useLayout();
  let dark = 0;
  SCENES.forEach((s, i) => {
    if (!DARK.includes(s.id)) return;
    const a = Math.round(s.from * fps);
    const b = Math.round(s.to * fps);
    const inR: [number, number] = i === 0 ? [a - 1, a] : [a, a + OVERLAP];
    dark = Math.max(dark, interpolate(f, [inR[0], inR[1], b, b + OVERLAP], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  });
  const w = L.square ? 104 : 132;
  const style: React.CSSProperties = { position: "absolute", top: 0, left: 0, width: w, height: "auto" };
  return (
    <div style={{ position: "absolute", top: L.square ? 18 : 150, right: L.square ? 22 : 44, width: w, height: (w * 724) / 1046, pointerEvents: "none", filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.18))" }}>
      <Img src={staticFile("images/logo-arosoft.png")} style={{ ...style, opacity: 1 - dark }} />
      <Img src={staticFile("images/logo-arosoft-clair.png")} style={{ ...style, opacity: dark }} />
    </div>
  );
};

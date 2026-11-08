import React from "react";
import { interpolateColors } from "remotion";
import { COLORS } from "../theme/colors";
import { FONT } from "../theme/fonts";

type Props = {
  /** 0 = ON (vert), 1 = OFF (rouge). Valeur continue : le curseur glisse. */
  off: number;
  /** 0..1 : enfoncement tactile (le curseur s'écrase et s'étire). */
  press?: number;
  width?: number;
  onColor?: string;
  offColor?: string;
  /** Intensité du halo lumineux autour du bouton. */
  glow?: number;
};

/**
 * Interrupteur ON/OFF 3D. Le curseur s'étire pendant le glissement (squash &
 * stretch), la piste change de teinte, les libellés ON/OFF se croisent.
 */
export const Toggle3D: React.FC<Props> = ({
  off,
  press = 0,
  width = 176,
  onColor = COLORS.green,
  offColor = COLORS.red,
  glow = 0,
}) => {
  const h = width * 0.56;
  const pad = h * 0.09;
  const knob = h - pad * 2;
  const travel = width - knob - pad * 2;
  // étirement maximal à mi-course + écrasement à l'appui
  const stretch = Math.sin(Math.PI * Math.min(1, Math.max(0, off))) * 0.35 + press * 0.12;
  const track = interpolateColors(off, [0, 1], [onColor, offColor]);

  return (
    <div
      style={{
        width,
        height: h,
        borderRadius: h / 2,
        position: "relative",
        background: `linear-gradient(180deg, ${track} 0%, ${track} 100%)`,
        boxShadow: `inset 0 ${h * 0.08}px ${h * 0.14}px rgba(0,0,0,0.28), inset 0 -${h * 0.04}px ${h * 0.06}px rgba(255,255,255,0.25), 0 ${h * 0.06}px ${h * 0.16}px rgba(0,0,0,0.18), 0 0 ${glow * 40}px ${glow * 12}px ${track}`,
        scale: `${1 - press * 0.04}`,
      }}
    >
      {/* reflet supérieur */}
      <div
        style={{
          position: "absolute",
          left: h * 0.25,
          right: h * 0.25,
          top: h * 0.08,
          height: h * 0.22,
          borderRadius: h,
          background: "linear-gradient(180deg, rgba(255,255,255,0.45), rgba(255,255,255,0))",
        }}
      />
      {/* libellés */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `0 ${h * 0.3}px`,
          fontFamily: FONT,
          fontStyle: "italic",
          fontWeight: 900,
          fontSize: h * 0.3,
          color: COLORS.white,
        }}
      >
        <span style={{ opacity: 1 - off, translate: `${-off * 10}px 0px` }}>ON</span>
        <span style={{ opacity: off, translate: `${(1 - off) * 10}px 0px` }}>OFF</span>
      </div>
      {/* curseur */}
      <div
        style={{
          position: "absolute",
          top: pad,
          left: Math.max(pad, pad + travel * (1 - off) - (stretch * knob) / 2),
          width: knob * (1 + stretch),
          height: knob * (1 - press * 0.08),
          marginTop: (knob * press * 0.08) / 2,
          borderRadius: knob,
          background: "radial-gradient(circle at 35% 30%, #FFFFFF 0%, #F4F5F7 45%, #D5D8DE 100%)",
          boxShadow: `0 ${knob * 0.08}px ${knob * 0.16}px rgba(0,0,0,0.3), inset 0 -${knob * 0.05}px ${knob * 0.08}px rgba(0,0,0,0.1)`,
        }}
      />
    </div>
  );
};

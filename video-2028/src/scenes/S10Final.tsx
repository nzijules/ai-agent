import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop } from "../components/Common";
import { C, CUES, F, ease, ip, useT } from "../lib/theme";

const Line: React.FC<{ at: number; children: React.ReactNode; size: number; color?: string }> = ({
  at,
  children,
  size,
  color = C.white,
}) => {
  const t = useT();
  const p = ip(t, [at, at + 0.6], [0, 1], ease.out);
  return (
    <div style={{ overflow: "hidden", paddingBottom: 6 }}>
      <div
        style={{
          fontFamily: F.display,
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1.04,
          letterSpacing: -1.5,
          color,
          translate: `0px ${(1 - p) * 110}%`,
          opacity: p,
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const S10Final: React.FC = () => {
  const t = useT();
  const s = CUES.endImpact;
  const sweep = ip(t, [s + 1.6, s + 2.8], [-30, 130], ease.inOut);

  return (
    <AbsoluteFill>
      <Backdrop grid={0.3} particles={36} hue={C.blue} intensity={1.1} speed={0.6} />
      <div
        style={{
          position: "absolute",
          top: 560,
          left: 70,
          right: 70,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          WebkitMaskImage: `linear-gradient(100deg, #000 ${sweep - 12}%, rgba(0,0,0,0.75) ${sweep}%, #000 ${sweep + 12}%)`,
        }}
      >
        <Line at={s + 0.05} size={92}>
          N'ATTENDEZ PAS <span style={{ color: C.orange }}>2028</span>
        </Line>
        <Line at={s + 0.3} size={92}>
          POUR DEVENIR
        </Line>
        <Line at={s + 0.55} size={112} color={C.cyan}>
          INDISPENSABLE
        </Line>
        <Line at={s + 0.8} size={92}>
          EN <span style={{ color: C.orange }}>2028.</span>
        </Line>
        <div
          style={{
            height: 4,
            width: 520,
            marginTop: 40,
            background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)`,
            scale: `${ip(t, [s + 1.1, s + 1.8], [0, 1])} 1`,
          }}
        />
        <div
          style={{
            marginTop: 36,
            fontFamily: F.body,
            fontWeight: 600,
            fontSize: 48,
            color: C.white,
            opacity: ip(t, [s + 1.3, s + 2.0], [0, 1]),
            translate: `0px ${ip(t, [s + 1.3, s + 2.0], [24, 0])}px`,
          }}
        >
          Votre transformation commence <span style={{ color: C.cyan }}>aujourd'hui.</span>
        </div>
      </div>
      {/* reflet lumineux qui balaie le titre */}
      <div
        style={{
          position: "absolute",
          top: 520,
          height: 640,
          left: `${sweep - 20}%`,
          width: "18%",
          background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.18), transparent)",
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

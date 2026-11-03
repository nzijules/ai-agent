import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import cfg from "../ad.config.json";
import { clamp, pop, prog } from "../anim";
import { Background } from "../components/Background";
import { Book3D } from "../components/Book3D";
import { Icon, IconName } from "../components/Icons";
import { KineticText } from "../components/Text";
import { useLayout } from "../layout";
import { C, F, sec } from "../theme";
import { Stage } from "./Stage";

/** 74.8–82.6 s — Offer: book centred, "Le guide pratique des parents", price. */
export const S7Offer: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const priceAt = sec(3.6);
  const pp = pop(f, priceAt, 9, 0.8);
  const feats: [IconName, string][] = [
    ["file", "Livre numérique"],
    ["download", "Accès immédiat"],
    ["devices", "Tous appareils"],
  ];
  const bookW = L.square ? 200 : 340;
  return (
    <Stage bg={<Background variant="navy" />} gap={L.s(28)}>
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        <div style={{ width: 1100, height: 1100, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(247,183,24,0.25), rgba(247,183,24,0))", scale: String(0.9 + 0.1 * Math.sin(f / 20)) }} />
      </AbsoluteFill>
      <KineticText text="Le guide pratique *des parents*" size={L.s(72)} color="#fff" hlText={C.navy} delay={2} stagger={3} />
      <div style={{ scale: String(0.8 + 0.2 * pop(f, 4, 14, 1)), opacity: prog(f, 4, 12) }}>
        <Book3D width={bookW} rotY={-18 + 18 * Math.sin(f / 60)} rotX={5} shine={prog(f, 20, 70)} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: interpolate(f, [priceAt - 4, priceAt + 2], [0, 1], clamp) }}>
        <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: L.s(36), color: "#fff", letterSpacing: 2, textTransform: "uppercase" }}>Seulement</div>
        <div
          style={{
            fontFamily: F.display,
            fontWeight: 900,
            fontSize: L.s(104),
            lineHeight: 1,
            color: C.navy,
            background: C.yellow,
            padding: `${L.s(10)}px ${L.s(40)}px`,
            borderRadius: L.s(26),
            marginTop: L.s(8),
            scale: String(pp),
            rotate: `${(1 - pp) * -10 - 2}deg`,
            boxShadow: "0 20px 60px rgba(247,183,24,0.35)",
            whiteSpace: "nowrap",
          }}
        >
          {cfg.price}
        </div>
      </div>
      <div style={{ display: "flex", gap: L.s(12), justifyContent: "center" }}>
        {feats.map(([ic, t], i) => {
          const d = 24 + i * 6;
          return (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: L.s(10), background: "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.18)", borderRadius: L.s(40), padding: `${L.s(10)}px ${L.s(18)}px`, fontFamily: F.body, fontWeight: 600, fontSize: L.s(26), color: "#fff", whiteSpace: "nowrap", opacity: prog(f, d, d + 10), translate: `0px ${(1 - prog(f, d, d + 14)) * 24}px` }}>
              <Icon name={ic} size={L.s(34)} color={C.yellow} delay={d + 2} /> {t}
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

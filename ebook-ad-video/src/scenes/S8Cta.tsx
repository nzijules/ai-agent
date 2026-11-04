import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import cfg from "../ad.config.json";
import { clamp, easeOut, pop, prog } from "../anim";
import { Background } from "../components/Background";
import { Book3D } from "../components/Book3D";
import { Icon } from "../components/Icons";
import { KineticText } from "../components/Text";
import { CtaButton, PhotoCard } from "../components/Ui";
import { useLayout } from "../layout";
import { C, F } from "../theme";
import { useTL } from "../timeline";
import { Stage } from "./Stage";

/** 82.6–90 s — Call to action with animated button + configurable contact. */
export const S8Cta: React.FC = () => {
  const f = useCurrentFrame();
  const { at } = useTL();
  const L = useLayout();
  const btnAt = at("l22", -1.2);
  const press = at("l22", 0.6);
  const bp = pop(f, btnAt, 11, 0.8);
  const pressV = interpolate(f, [press - 3, press, press + 6], [0, 1, 0], clamp);
  const pulse = f > btnAt + 20 ? 1 + 0.03 * Math.sin((f - btnAt) / 6) : 1;
  // hand cursor
  const cur = interpolate(f, [press - 22, press - 2], [0, 1], { ...clamp, easing: easeOut });
  const imgW = L.square ? 300 : 520;
  const imgH = L.square ? 210 : 360;
  return (
    <Stage bg={<Background variant="light" />} gap={L.s(34)}>
      <div style={{ position: "relative", opacity: prog(f, 0, 12), scale: String(0.9 + 0.1 * pop(f, 0, 14)) }}>
        <PhotoCard src={cfg.photo} width={imgW} height={imgH} drift={prog(f, 0, 220)} position="50% 30%" border={`${L.s(6)}px solid #fff`} />
        <div style={{ position: "absolute", right: -L.s(90), bottom: -L.s(40) }}>
          <Book3D width={L.s(L.square ? 130 : 190)} rotY={-22} rotX={4} />
        </div>
      </div>
      <KineticText text="Donnez à votre enfant une *meilleure méthode* pour apprendre." size={L.s(76)} delay={6} stagger={3} />
      <div style={{ position: "relative", opacity: interpolate(f, [btnAt, btnAt + 6], [0, 1], clamp), scale: String(bp * pulse * (1 - pressV * 0.04)) }}>
        <CtaButton label={cfg.ctaLabel} icon="download" size={L.s(44)} shine={prog(f, btnAt + 14, btnAt + 44)} press={pressV} />
        {/* tap ripple */}
        <div style={{ position: "absolute", right: L.s(40), top: "50%", width: L.s(40), height: L.s(40), marginTop: -L.s(20), borderRadius: "50%", border: `4px solid ${C.navy}`, opacity: interpolate(f, [press, press + 14], [0.6, 0], clamp), scale: String(interpolate(f, [press, press + 14], [0.5, 3], clamp)) }} />
        {/* cursor */}
        <div style={{ position: "absolute", right: -L.s(10), top: "55%", opacity: cur, translate: `${(1 - cur) * 140}px ${(1 - cur) * 160}px`, scale: String(1 - pressV * 0.12) }}>
          <svg width={L.s(70)} height={L.s(70)} viewBox="0 0 24 24">
            <path d="M5 3l14 7-6 1.6L10 18z" fill="#fff" stroke={C.navy} strokeWidth={1.6} strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: L.s(18), flexWrap: "wrap", justifyContent: "center", opacity: prog(f, btnAt + 16, btnAt + 28) }}>
        <div style={{ display: "flex", alignItems: "center", gap: L.s(10), fontFamily: F.body, fontWeight: 700, fontSize: L.s(32), color: C.navy, background: "#fff", borderRadius: L.s(30), padding: `${L.s(12)}px ${L.s(22)}px`, boxShadow: "0 8px 24px rgba(11,27,58,0.10)" }}>
          <Icon name="phone" size={L.s(34)} color={C.green} delay={btnAt + 16} /> {cfg.contactLabel} : {cfg.contactValue}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: L.s(10), fontFamily: F.body, fontWeight: 700, fontSize: L.s(32), color: C.navy, background: C.yellowSoft, borderRadius: L.s(30), padding: `${L.s(12)}px ${L.s(22)}px` }}>
          <Icon name="link" size={L.s(34)} color={C.navy} delay={btnAt + 20} /> {cfg.linkLabel}
        </div>
      </div>
    </Stage>
  );
};

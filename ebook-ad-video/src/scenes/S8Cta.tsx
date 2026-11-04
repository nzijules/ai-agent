import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import cfg from "../ad.config.json";
import { clamp, pop, prog } from "../anim";
import { Background } from "../components/Background";
import { Book3D } from "../components/Book3D";
import { Icon } from "../components/Icons";
import { KineticText } from "../components/Text";
import { PhotoCard } from "../components/Ui";
import { useLayout } from "../layout";
import { C, F } from "../theme";
import { useTL } from "../timeline";
import { Stage } from "./Stage";

/** Call to action: instruction + arrows pointing to the real Meta/TikTok button under the video (no fake button). */
export const S8Cta: React.FC = () => {
  const f = useCurrentFrame();
  const { at } = useTL();
  const L = useLayout();
  const btnAt = at("l22", -1.2);
  const bp = pop(f, btnAt, 11, 0.8);
  const pulse = f > btnAt + 20 ? 1 + 0.03 * Math.sin((f - btnAt) / 6) : 1;
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
      <div style={{ display: "flex", alignItems: "center", gap: L.s(10), fontFamily: F.body, fontWeight: 700, fontSize: L.s(32), color: C.navy, background: "#fff", borderRadius: L.s(30), padding: `${L.s(12)}px ${L.s(22)}px`, boxShadow: "0 8px 24px rgba(11,27,58,0.10)", opacity: prog(f, btnAt - 10, btnAt + 2) }}>
        <Icon name="phone" size={L.s(34)} color={C.green} delay={btnAt - 8} /> {cfg.contactLabel} : {cfg.contactValue}
      </div>
      {/* Instruction pointing to the platform's real CTA button (no fake clickable button) */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: L.s(14), opacity: interpolate(f, [btnAt, btnAt + 6], [0, 1], clamp), scale: String(bp * pulse) }}>
        <div style={{ display: "flex", alignItems: "center", gap: L.s(16), background: C.navy, color: "#fff", borderRadius: L.s(26), padding: `${L.s(18)}px ${L.s(34)}px`, boxShadow: "0 18px 40px rgba(11,27,58,0.25)" }}>
          <Icon name="download" size={L.s(48)} color={C.yellow} stroke={2.4} delay={btnAt + 4} drawFrames={14} />
          <div>
            <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: L.s(44), lineHeight: 1.05, whiteSpace: "nowrap" }}>{cfg.ctaLabel}</div>
            <div style={{ fontFamily: F.body, fontWeight: 600, fontSize: L.s(28), color: C.yellow, marginTop: L.s(4), whiteSpace: "nowrap" }}>{cfg.price} · accès immédiat</div>
          </div>
        </div>
        {/* bouncing arrows towards the real button under the video */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", translate: `0px ${Math.abs(Math.sin((f - btnAt) / 7)) * L.s(14)}px` }}>
          {[0, 1].map((k) => (
            <svg key={k} width={L.s(64)} height={L.s(34)} viewBox="0 0 24 12" style={{ marginTop: -L.s(6), opacity: interpolate(f, [btnAt + 10 + k * 5, btnAt + 16 + k * 5], [0, k ? 0.55 : 1], clamp) }}>
              <path d="M3 2l9 8 9-8" stroke={C.yellow} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ))}
        </div>
      </div>
    </Stage>
  );
};

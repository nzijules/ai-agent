import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import cfg from "../ad.config.json";
import { clamp, pop, prog } from "../anim";
import { Background } from "../components/Background";
import { Icon } from "../components/Icons";
import { HandNote, KineticText } from "../components/Text";
import { PhotoCard } from "../components/Ui";
import { useLayout } from "../layout";
import { C, F } from "../theme";
import { at } from "../timeline";
import { Stage } from "./Stage";

/** 24.6–33 s — Pivot: "Et si l'IA devenait un vrai tuteur ?" (relative times) */
export const S3Pivot: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const cmp = at("l09");
  const photoW = L.square ? 420 : 760;
  const photoH = L.square ? 470 : 760;
  const pp = pop(f, 6, 16, 1);
  const rows = [
    { ok: false, t: "Penser à sa place" },
    { ok: true, t: "Guider sa réflexion" },
  ];
  const content = (
    <div style={{ position: "relative", width: photoW, height: photoH, scale: String(0.85 + 0.15 * pp), opacity: interpolate(f, [6, 14], [0, 1], clamp), rotate: `${(1 - pp) * 6}deg` }}>
      <PhotoCard src={cfg.photo} width={photoW} height={photoH} drift={prog(f, 0, 250)} border={`${L.s(8)}px solid #fff`} position="50% 35%" />
      <div style={{ position: "absolute", left: -L.s(30), bottom: L.s(30), display: "flex", flexDirection: "column", gap: L.s(16) }}>
        {rows.map((r, i) => {
          const d = cmp + i * 22;
          const p = pop(f, d, 12, 0.7);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: L.s(14),
                background: r.ok ? C.green : "#fff",
                color: r.ok ? "#fff" : C.muted,
                borderRadius: L.s(40),
                padding: `${L.s(16)}px ${L.s(28)}px ${L.s(16)}px ${L.s(16)}px`,
                fontFamily: F.display,
                fontWeight: 800,
                fontSize: L.s(36),
                boxShadow: "0 14px 34px rgba(0,0,0,0.22)",
                opacity: interpolate(f, [d, d + 6], [0, 1], clamp),
                translate: `${(1 - p) * -120}px 0px`,
                textDecoration: r.ok ? "none" : "line-through",
                textDecorationThickness: 4,
                alignSelf: "flex-start",
              }}
            >
              <div style={{ width: L.s(50), height: L.s(50), borderRadius: "50%", background: r.ok ? "#fff" : C.red, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={r.ok ? "check" : "x"} size={L.s(32)} color={r.ok ? C.green : "#fff"} stroke={3} delay={d + 4} drawFrames={10} />
              </div>
              {r.t}
            </div>
          );
        })}
      </div>
    </div>
  );
  return (
    <Stage bg={<Background variant="light" />} gap={L.s(40)}>
      <KineticText text="Et si l'IA devenait un *vrai tuteur* ?" size={L.s(88)} delay={8} stagger={3} />
      {content}
      {!L.square && <HandNote text="Un parent informé, un enfant plus confiant !" size={54} delay={at("l09", 1.0)} rotate={-3} />}
    </Stage>
  );
};

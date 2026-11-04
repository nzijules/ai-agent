import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp, easeOut, pop, prog } from "../anim";
import { Background } from "../components/Background";
import { Book3D } from "../components/Book3D";
import { Icon } from "../components/Icons";
import { Eyebrow, KineticText } from "../components/Text";
import { useLayout } from "../layout";
import { C, F } from "../theme";
import { useTL } from "../timeline";
import { Stage } from "./Stage";

/** 33–42.8 s — Solution reveal: the book lands with an impact, light rays and sparkles. */
export const S4Reveal: React.FC = () => {
  const f = useCurrentFrame();
  const { at, linesOf, lineFrames } = useTL();
  const ln = linesOf("S4-Revelation");
  const L = useLayout();
  const land = 10;
  const b = pop(f, land - 8, 12, 1.1);
  const bookW = L.square ? 270 : 420;
  // subtitle on the 2nd line, or at the comma of a single long line
  const sub = ln.length > 1 ? at(ln[1]) : at(ln[0]) + Math.round(lineFrames(ln[0]) * 0.45);
  const rays = interpolate(f, [land, land + 20], [0, 1], { ...clamp, easing: easeOut });
  return (
    <Stage bg={<Background variant="navy" />} gap={L.s(26)}>
      {/* light rays behind the book */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", opacity: rays * 0.9, pointerEvents: "none" }}>
        <div
          style={{
            width: 1800,
            height: 1800,
            borderRadius: "50%",
            background: `repeating-conic-gradient(from ${f * 0.35}deg, rgba(247,183,24,0.16) 0deg 7deg, rgba(247,183,24,0) 7deg 20deg)`,
            maskImage: "radial-gradient(closest-side, black 15%, transparent 75%)",
            translate: `0px ${L.square ? 60 : 110}px`,
          }}
        />
      </AbsoluteFill>
      {/* flash */}
      <AbsoluteFill style={{ background: "#fff", opacity: interpolate(f, [land, land + 2, land + 14], [0, 0.55, 0], clamp), pointerEvents: "none" }} />
      <div style={{ opacity: prog(f, 0, 10), scale: String(pop(f, 0, 10, 0.6)) }}>
        <Eyebrow size={L.s(34)}>
          <Icon name="sparkle" size={L.s(38)} color={C.navy} stroke={2.4} delay={2} /> Découvrez
        </Eyebrow>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        <KineticText text="Apprendre à apprendre" size={L.s(78)} color="#fff" delay={4} stagger={3} />
        <KineticText text="avec *ChatGPT*" size={L.s(78)} color="#fff" hlColor={C.green} delay={13} stagger={3} />
      </div>
      <div style={{ position: "relative", translate: `0px ${(1 - b) * 900}px`, scale: String(0.7 + 0.3 * b), rotate: `${(1 - b) * 12}deg` }}>
        <Book3D width={bookW} rotY={-28 + 12 * Math.sin(f / 50)} rotX={6} shine={prog(f, land + 6, land + 46)} />
        {/* sparkles */}
        {Array.from({ length: 14 }).map((_, i) => {
          const a = (i / 14) * Math.PI * 2 + 0.3;
          const p = interpolate(f, [land, land + 40], [0, 1], { ...clamp, easing: easeOut });
          const r = (bookW * 0.65 + (i % 3) * 40) * p;
          return (
            <div key={i} style={{ position: "absolute", left: "50%", top: "50%", translate: `${Math.cos(a) * r}px ${Math.sin(a) * r * 1.3}px`, opacity: interpolate(f, [land + 2, land + 12, land + 40, land + 60], [0, 1, 1, 0], clamp), scale: String(0.5 + (i % 3) * 0.3) }}>
              <Icon name="spark4" size={L.s(40)} color={i % 2 ? C.yellow : "#fff"} stroke={2.4} drawFrames={1} />
            </div>
          );
        })}
      </div>
      <div style={{ opacity: interpolate(f, [sub, sub + 10], [0, 1], clamp), translate: `0px ${(1 - prog(f, sub, sub + 16)) * 30}px`, fontFamily: F.body, fontWeight: 600, fontSize: L.s(40), color: "#fff", textAlign: "center", lineHeight: 1.3 }}>
        Le guide pratique des parents <span style={{ color: C.yellow }}>à l'ère de l'IA</span>
      </div>
    </Stage>
  );
};

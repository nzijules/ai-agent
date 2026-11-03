import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { clamp, easeIn, easeOut, pop, prog } from "../anim";
import { Background } from "../components/Background";
import { Icon } from "../components/Icons";
import { Eyebrow, KineticText } from "../components/Text";
import { Bubble, Typewriter } from "../components/Ui";
import { useLayout } from "../layout";
import { C, F, sec } from "../theme";
import { Stage } from "./Stage";

/** 62.6–74.8 s — How it works (illustrative prompt), audience 6e→Terminale, responsible-use note. */
export const S6Method: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const lvl = sec(4.2);
  const note = sec(6.6);
  const out = prog(f, note - 8, note + 6, easeIn);
  const w = L.square ? 720 : 880;
  const levels = ["6e", "5e", "4e", "3e", "2nde", "1re", "Tle"];
  const lp = interpolate(f, [lvl + 6, lvl + 40], [0, 1], { ...clamp, easing: easeOut });
  return (
    <Stage bg={<Background variant="cream" />} gap={L.s(30)}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: L.s(30), opacity: 1 - out, translate: `0px ${-out * 60}px` }}>
        <div style={{ opacity: prog(f, 0, 10) }}>
          <Eyebrow size={L.s(28)} bg={C.navy} color={C.yellow}>
            <Icon name="book" size={L.s(34)} color={C.yellow} delay={2} /> Une méthode simple
          </Eyebrow>
        </div>
        <KineticText text="Des exemples *prêts à l'emploi*" size={L.s(72)} delay={4} stagger={3} />
        <div style={{ width: w, background: "#EEF2FA", borderRadius: L.s(40), padding: L.s(L.square ? 24 : 32), display: "flex", flexDirection: "column", gap: L.s(20), boxShadow: "inset 0 0 0 2px rgba(11,27,58,0.06)", opacity: prog(f, 10, 22), translate: `0px ${(1 - prog(f, 10, 30)) * 80}px` }}>
          <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: L.s(24), color: C.muted, letterSpacing: 1, textTransform: "uppercase" }}>Exemple de consigne « tuteur »</div>
          <Bubble from="user" size={L.s(31)} delay={18} maxWidth={w * 0.82}>
            <Typewriter text="Explique-moi les fractions comme à un élève de 6e. Ne me donne pas la réponse : pose-moi des questions." delay={20} cps={2.6} />
          </Bubble>
          <Bubble from="ai" size={L.s(31)} delay={68} typing={12} maxWidth={w * 0.76}>
            D'accord ! Imagine une pizza coupée en 4 parts. Si tu en manges 1, quelle fraction as-tu mangée ? 🍕
          </Bubble>
        </div>
        {/* level slider */}
        <div style={{ width: w, opacity: interpolate(f, [lvl, lvl + 8], [0, 1], clamp), translate: `0px ${(1 - prog(f, lvl, lvl + 16)) * 30}px` }}>
          <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: L.s(36), color: C.navy, textAlign: "center", marginBottom: L.s(16) }}>
            Pour les parents d'élèves <span style={{ color: C.blue }}>de la 6e à la Terminale</span>
          </div>
          <div style={{ position: "relative", height: L.s(70) }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: L.s(16), height: L.s(10), borderRadius: 10, background: "rgba(11,27,58,0.1)" }} />
            <div style={{ position: "absolute", left: 0, width: `${lp * 100}%`, top: L.s(16), height: L.s(10), borderRadius: 10, background: `linear-gradient(90deg, ${C.blue}, ${C.green})` }} />
            {levels.map((l, i) => {
              const x = i / (levels.length - 1);
              const on = lp >= x - 0.001;
              return (
                <div key={l} style={{ position: "absolute", left: `${x * 100}%`, top: 0, translate: "-50% 0px", display: "flex", flexDirection: "column", alignItems: "center", gap: L.s(4) }}>
                  <div style={{ width: L.s(42), height: L.s(42), borderRadius: "50%", background: on ? (i === levels.length - 1 ? C.green : C.blue) : "#fff", border: `3px solid ${on ? "transparent" : "rgba(11,27,58,0.15)"}` }} />
                  <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: L.s(24), color: on ? C.navy : C.muted }}>{l}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Responsible-use note */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: interpolate(f, [note, note + 8], [0, 1], clamp) }}>
        <div style={{ width: w, background: C.navy, borderRadius: L.s(44), padding: L.s(L.square ? 40 : 56), display: "flex", flexDirection: "column", alignItems: "center", gap: L.s(26), scale: String(0.9 + 0.1 * pop(f, note, 14, 0.8)), boxShadow: "0 30px 80px rgba(11,27,58,0.35)" }}>
          <div style={{ width: L.s(150), height: L.s(150), borderRadius: "50%", background: "rgba(247,183,24,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="shield" size={L.s(90)} color={C.yellow} stroke={1.8} delay={note + 6} drawFrames={26} />
          </div>
          <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: L.s(54), color: "#fff", textAlign: "center", lineHeight: 1.18 }}>
            L'IA ne remplace ni l'enseignant, ni les efforts de l'élève.
          </div>
          <div style={{ fontFamily: F.hand, fontWeight: 700, fontSize: L.s(72), color: C.yellow, opacity: prog(f, note + sec(2.6), note + sec(3.1)), rotate: "-3deg" }}>Elle les accompagne.</div>
        </div>
      </div>
    </Stage>
  );
};

import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp, usePop, useSpring } from "../components/anim";
import { Check } from "../components/Icons";
import { StepBadge } from "../components/StepBadge";
import { C, body, display, gradText, mono } from "../theme";

// 18s – 27s : "Étape 1 : tu demandes à Claude Code d'écrire ton ebook… et de créer tes vidéos animées. Tu décris, il crée."
type Line = { kind: "cmd" | "ok"; text: string; at: number };
const LINES: Line[] = [
  { kind: "cmd", text: "Écris un ebook de 40 pages sur « Gagner de l'argent avec WhatsApp »", at: 30 },
  { kind: "ok", text: "8 chapitres rédigés · couverture créée", at: 92 },
  { kind: "cmd", text: "Crée 3 vidéos motion design pour ma pub", at: 110 },
  { kind: "ok", text: "3 vidéos prêtes à publier", at: 160 },
];
const CPS = 1.6; // chars per frame

const TermLine: React.FC<{ line: Line }> = ({ line }) => {
  const f = useCurrentFrame();
  if (f < line.at) return null;
  if (line.kind === "ok") {
    const p = interpolate(f, [line.at, line.at + 8], [0, 1], clamp);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: p, transform: `translateX(${(1 - p) * -30}px)`, color: C.green, marginBottom: 22 }}>
        <Check size={38} /> {line.text}
      </div>
    );
  }
  const n = Math.floor((f - line.at) * CPS);
  const done = n >= line.text.length;
  return (
    <div style={{ marginBottom: 22, color: C.white }}>
      <span style={{ color: C.cyan }}>{"> "}</span>
      {line.text.slice(0, n)}
      {!done && <span style={{ background: C.cyan, color: C.cyan, opacity: f % 16 < 8 ? 1 : 0 }}>_</span>}
    </div>
  );
};

export const Step1: React.FC = () => {
  const title = usePop(8);
  const term = useSpring(16, { damping: 16 });
  const book = useSpring(182, { damping: 11 });
  const tag = usePop(205);

  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ marginTop: 300 }}>
        <StepBadge n="01" />
      </div>
      <div style={{ ...title, marginTop: 30, textAlign: "center", fontFamily: display, fontWeight: 900, fontSize: 86, lineHeight: 1.05, color: C.white }}>
        <span style={gradText()}>Claude Code</span>
        <br />
        écrit & anime
        <br />
        pour toi
      </div>

      <div
        style={{
          marginTop: 56,
          width: 920,
          minHeight: 470,
          borderRadius: 30,
          background: "rgba(6,12,32,0.92)",
          border: "2px solid rgba(62,230,255,0.35)",
          boxShadow: "0 30px 90px rgba(0,0,0,0.6), 0 0 50px rgba(10,132,255,0.35)",
          overflow: "hidden",
          opacity: term,
          transform: `perspective(1400px) rotateX(${(1 - term) * 40}deg) translateY(${(1 - term) * 200}px) scale(${interpolate(book, [0, 1], [1, 0.94])})`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 26px", background: "rgba(255,255,255,0.06)" }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <div key={c} style={{ width: 22, height: 22, borderRadius: "50%", background: c }} />
          ))}
          <div style={{ marginLeft: 20, fontFamily: mono, fontWeight: 700, fontSize: 30, color: C.soft }}>claude code</div>
        </div>
        <div style={{ padding: "30px 36px", fontFamily: mono, fontWeight: 500, fontSize: 36, lineHeight: 1.4 }}>
          {LINES.map((l, i) => (
            <TermLine key={i} line={l} />
          ))}
        </div>
      </div>

      {/* ebook + videos flying out */}
      <div style={{ position: "absolute", top: 1330, left: 0, right: 0, height: 0 }}>
        {[-1, 1].map((d) => (
          <div
            key={d}
            style={{
              position: "absolute",
              left: 540 - 95 + d * 270 * book,
              top: 40,
              width: 190,
              height: 300,
              borderRadius: 20,
              background: `linear-gradient(160deg, ${d < 0 ? C.blue : "#6B7CFF"}, ${C.deep})`,
              border: "3px solid rgba(255,255,255,0.4)",
              opacity: book,
              transform: `rotate(${d * 14 * book}deg) scale(${book})`,
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: display,
              fontWeight: 900,
              fontSize: 34,
              color: C.white,
            }}
          >
            VIDÉO
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            left: 540 - 140,
            top: 0,
            width: 280,
            height: 390,
            borderRadius: "10px 26px 26px 10px",
            background: `linear-gradient(150deg, ${C.gold}, #FF8A3C)`,
            boxShadow: "-14px 0 0 #b25a10 inset, 0 30px 70px rgba(0,0,0,0.6)",
            opacity: book,
            transform: `perspective(900px) rotateY(${interpolate(book, [0, 1], [-90, -16])}deg) translateY(${(1 - book) * 120}px) scale(${0.4 + book * 0.6})`,
            padding: "40px 26px 26px 40px",
            fontFamily: display,
            fontWeight: 900,
            color: C.bg,
          }}
        >
          <div style={{ fontSize: 26, letterSpacing: 3 }}>EBOOK</div>
          <div style={{ fontSize: 34, lineHeight: 1.08, marginTop: 16 }}>Gagner de l&apos;argent avec WhatsApp</div>
          <div style={{ position: "absolute", bottom: 26, fontSize: 22, fontFamily: body, fontWeight: 700 }}>40 pages</div>
        </div>
      </div>

      <div
        style={{
          ...tag,
          position: "absolute",
          top: 1770,
          fontFamily: display,
          fontWeight: 900,
          fontSize: 66,
          color: C.white,
        }}
      >
        Tu décris. <span style={gradText()}>Il crée.</span>
      </div>
    </AbsoluteFill>
  );
};

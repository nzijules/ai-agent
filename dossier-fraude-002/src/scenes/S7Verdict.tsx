import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT, MONO } from "../theme";
import { ip, shake } from "../anim";
import { Backdrop } from "../components/Backdrop";
import { Stamp } from "../components/Stamp";
import { KineticText } from "../components/Text";

/** SÉQUENCE 7 — LE VERDICT */
export const S7Verdict: React.FC = () => {
  const f = useCurrentFrame();
  const close = ip(f, [4, 30], [0, 1]);
  const stampAt = 46;
  const sk = shake(f, stampAt + 3, 34, 18);
  const dark = ip(f, [0, 20], [0, 0.9]);
  return (
    <AbsoluteFill style={{ transform: `translate(${sk.x}px, ${sk.y}px)` }}>
      <Backdrop tint="red" intensity={f > stampAt ? 0.9 : 0.3} grid={false} />
      <AbsoluteFill style={{ background: `rgba(0,0,0,${dark})` }} />
      {/* dossier qui se referme */}
      <div style={{ position: "absolute", left: 140, right: 140, top: 560, height: 700, perspective: 1600 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: "#1a1a1a", border: "2px solid #333", padding: 40, boxSizing: "border-box" }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ height: 18, width: `${90 - i * 9}%`, background: "#333", borderRadius: 9, marginBottom: 30 }} />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 22,
            background: "linear-gradient(135deg, #2b2b2b, #0f0f0f)",
            border: `3px solid ${C.yellow}`,
            transformOrigin: "50% 0%",
            transform: `rotateX(${(1 - close) * 100}deg)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, opacity: 1 - ip(f, [stampAt - 8, stampAt], [0, 1]) }}>
          <div style={{ fontFamily: MONO, fontSize: 30, color: C.dim, letterSpacing: 6 }}>DOSSIER CLASSÉ</div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 96, color: C.yellow }}>N°002</div>
          </div>
        </div>
      </div>
      <Stamp text="VERDICT :" sub="ESCROQUERIE" at={stampAt} size={110} subScale={0.62} rotate={-8} style={{ top: 900 }} />
      {f > stampAt + 30 && (
        <div style={{ position: "absolute", top: 1330, left: 60, right: 60 }}>
          <KineticText text="USURPATION D'IDENTITÉ ET INGÉNIERIE SOCIALE" start={stampAt + 32} size={58} stagger={3} color={C.white} highlight={["USURPATION", "INGÉNIERIE", "SOCIALE"]} />
        </div>
      )}
      {/* onde de choc */}
      {f >= stampAt && f < stampAt + 25 && (
        <div style={{ position: "absolute", left: 540 - (f - stampAt) * 40, top: 900 - (f - stampAt) * 40, width: (f - stampAt) * 80, height: (f - stampAt) * 80, borderRadius: "50%", border: `6px solid ${C.red}`, opacity: 1 - (f - stampAt) / 25 }} />
      )}
    </AbsoluteFill>
  );
};

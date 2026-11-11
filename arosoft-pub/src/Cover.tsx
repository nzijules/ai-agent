import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { COLORS, FONT_TITLE, PRICE } from "./config";
import { Background } from "./components/Background";
import { Book3D } from "./components/Book3D";

/** Image de couverture TikTok (1080×1920). */
export const Cover: React.FC = () => (
  <AbsoluteFill>
    <Background brightness={1.4} />
    <Img src={staticFile("img/as_symbol.png")} style={{ position: "absolute", top: 45, right: 45, width: 74 }} />
    <div style={{ position: "absolute", top: 230, width: "100%", textAlign: "center", fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 104, lineHeight: 1.02, color: COLORS.white, textShadow: "0 8px 30px rgba(0,0,0,0.6)" }}>
      TA PREMIÈRE
      <br />
      <span style={{ color: COLORS.yellow }}>VIDÉO IA</span>
      <div style={{ fontSize: 50, fontWeight: 800, marginTop: 18, letterSpacing: 1 }}>avec Claude Code</div>
    </div>
    <div style={{ position: "absolute", top: 640, left: (1080 - 400) / 2 }}>
      <div style={{ position: "absolute", left: -200, top: -60, width: 800, height: 800, borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.electric}aa, transparent 65%)`, filter: "blur(30px)" }} />
      <Book3D width={400} rotY={-18} rotX={5} />
    </div>
    <div style={{ position: "absolute", top: 1330, width: "100%", display: "flex", justifyContent: "center" }}>
      <div style={{ padding: "14px 46px", borderRadius: 30, background: COLORS.yellow, fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 96, color: COLORS.night, rotate: "-2deg", boxShadow: `0 0 50px ${COLORS.yellow}88` }}>{PRICE}</div>
    </div>
  </AbsoluteFill>
);

import React from "react";
import { Img, staticFile } from "remotion";
import cfg from "../ad.config.json";
import { C, F } from "../theme";

/**
 * Book cover, designed at 600 x 900 and scaled with `width`.
 * - coverMode "vector"  : provisional cover rebuilt in code (no third-party logo).
 * - coverMode "official": uses the image at cfg.officialCover (public/ folder).
 *   To swap: replace public/images/couverture-officielle.jpg (2:3 ratio) and set coverMode to "official".
 */
export const COVER_W = 600;
export const COVER_H = 900;

export const Cover: React.FC<{ width: number }> = ({ width }) => {
  const k = width / COVER_W;
  if (cfg.coverMode === "official") {
    return (
      <Img
        src={staticFile(cfg.officialCover)}
        style={{ width, height: COVER_H * k, objectFit: "cover", display: "block" }}
      />
    );
  }
  return (
    <div style={{ width, height: COVER_H * k, overflow: "hidden", position: "relative" }}>
      <div
        style={{
          width: COVER_W,
          height: COVER_H,
          scale: String(k),
          transformOrigin: "0 0",
          background: "#FFFFFF",
          position: "absolute",
          left: 0,
          top: 0,
          fontFamily: F.display,
          color: C.navy,
        }}
      >
        {/* top band */}
        <div style={{ height: 46, background: C.yellow, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 17, letterSpacing: 0.5 }}>
          LE GUIDE PRATIQUE DES PARENTS À L'ÈRE DE L'IA
        </div>
        <div style={{ textAlign: "center", paddingTop: 26 }}>
          <div style={{ fontWeight: 900, fontSize: 52, lineHeight: 1 }}>APPRENDRE À</div>
          <div style={{ fontWeight: 900, fontSize: 84, lineHeight: 1.02, color: C.blue, letterSpacing: -1 }}>APPRENDRE</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, margin: "2px 0" }}>
            <div style={{ height: 3, width: 130, background: C.navy }} />
            <div style={{ fontWeight: 800, fontSize: 28 }}>AVEC</div>
            <div style={{ height: 3, width: 130, background: C.navy }} />
          </div>
          <div style={{ fontWeight: 900, fontSize: 86, lineHeight: 1, color: C.green, letterSpacing: -1 }}>CHATGPT</div>
          <div style={{ fontFamily: F.body, fontWeight: 600, fontSize: 21, lineHeight: 1.3, marginTop: 14, padding: "0 40px" }}>
            Transformez l'IA en professeur particulier et préparez votre enfant <span style={{ color: C.blue }}>au monde de demain.</span>
          </div>
        </div>
        {/* photo */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 420, height: 340, overflow: "hidden" }}>
          <Img src={staticFile(cfg.photo)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 22%, rgba(255,255,255,0) 80%, rgba(11,27,58,0.35) 100%)" }} />
          <div style={{ position: "absolute", left: 22, top: 70, display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              ["MIEUX APPRENDRE", C.blueSoft],
              ["ESPRIT CRITIQUE", C.yellowSoft],
              ["AUTONOMIE", C.greenSoft],
            ].map(([t, bg]) => (
              <div key={t} style={{ background: bg, borderRadius: 30, padding: "8px 16px", fontWeight: 800, fontSize: 15, boxShadow: "0 4px 10px rgba(0,0,0,0.12)" }}>
                {t}
              </div>
            ))}
          </div>
        </div>
        {/* bottom band */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 140, background: C.navy, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 34px" }}>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 32 }}>{cfg.author}</div>
            <div style={{ color: C.yellow, fontWeight: 700, fontSize: 15, letterSpacing: 0.6, marginTop: 4 }}>{cfg.authorRole.toUpperCase()}</div>
          </div>
          <div style={{ width: 116, height: 116, borderRadius: "50%", background: C.yellow, border: "5px solid #fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontWeight: 900, lineHeight: 1.05, fontSize: 16, textAlign: "center" }}>
            <div>ÉDITION</div>
            <div style={{ fontSize: 30 }}>2026</div>
          </div>
        </div>
      </div>
    </div>
  );
};

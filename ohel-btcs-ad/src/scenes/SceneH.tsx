import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, CONTACT, FONT, SIGNATURE } from "../config/brand";
import { LOGO, MEDIA } from "../config/assets";
import { ECRAN } from "../config/script";
import { EASE_IN, EASE_IN_OUT, prog, useLayout } from "../components/anim";
import { BlockFace } from "../components/Block";
import { MediaFill, Mention, Reveal, Trame } from "../components/ui";

/** Début du carton final (s, relatif à la scène). */
export const CARTON_H = 10.4;

/** H — Conversion : blocs prêts, appel à l'action, carton final. */
export const SceneH: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { vertical, safe, W, H } = useLayout();
  const t = ECRAN.H;

  const cols = 5;
  const rows = 5;
  const bw = vertical ? 172 : 170;
  const bh = bw / 2.1;
  const g = 6;
  const pileW = cols * bw + (cols - 1) * g;
  const pileX = vertical ? (W - pileW) / 2 : W - safe.right - pileW;
  const paletteY = vertical ? safe.top + 1000 : H - safe.bottom - 40;
  const cta = prog(frame, fps, 8.6, 0.5, EASE_IN_OUT);
  const carton = prog(frame, fps, CARTON_H, 0.7, EASE_IN_OUT);

  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: COLORS.blancCasse }}>
      <Trame lumiere={[50, 60]} />

      {/* Blocs prêts à être approvisionnés */}
      {MEDIA.stock.src ? (
        <AbsoluteFill>
          <MediaFill slot={MEDIA.stock} />
          <AbsoluteFill style={{ background: "rgba(20,20,22,0.45)" }} />
        </AbsoluteFill>
      ) : (
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${cta * -80}px)` }}>
          {/* Palette */}
          <div style={{ position: "absolute", left: pileX - 20, top: paletteY, width: pileW + 40, height: 26, background: "#8A6B4A" }} />
          <div style={{ position: "absolute", left: pileX - 20, top: paletteY + 26, width: pileW + 40, height: 14, background: "repeating-linear-gradient(90deg, #6E5236 0 60px, transparent 60px 120px)" }} />
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((__, c) => {
              const de = 0.3 + r * 0.42 + c * 0.06;
              const p = prog(frame, fps, de, 0.32, EASE_IN);
              const y = paletteY - (r + 1) * (bh + g);
              return (
                <BlockFace
                  key={`${r}-${c}`}
                  w={bw}
                  h={bh}
                  seed={70 + r * cols + c}
                  style={{
                    position: "absolute",
                    left: pileX + c * (bw + g),
                    top: y - (1 - p) * 500,
                    opacity: p > 0 ? 1 : 0,
                  }}
                />
              );
            }),
          )}
        </div>
      )}

      {/* Accroche */}
      <div
        style={{
          position: "absolute",
          left: safe.left,
          top: vertical ? safe.top + 10 : safe.top + 150,
          fontSize: vertical ? 84 : 84,
          fontWeight: 800,
          letterSpacing: -1.5,
          lineHeight: 1.04,
          maxWidth: vertical ? W - safe.left - safe.right : 760,
        }}
      >
        <Reveal de={0.5} jusqua={8.3}>{t.l1}</Reveal>
        <Reveal de={0.75} jusqua={8.3}>{t.l2}</Reveal>
        <Reveal de={1.0} jusqua={8.3}>
          <span style={{ color: COLORS.lateriteClair }}>{t.l3}</span>
        </Reveal>
        <Reveal de={3.9} jusqua={8.3} style={{ marginTop: 30 }}>
          <div style={{ fontSize: vertical ? 40 : 38, fontWeight: 600, letterSpacing: 0, display: "flex", gap: 14, alignItems: "center" }}>
            <span style={{ width: 26, height: 12, background: COLORS.vertClair, display: "inline-block" }} />
            {t.appro}
          </div>
        </Reveal>
      </div>

      {/* Appel à l'action */}
      <div
        style={{
          position: "absolute",
          left: safe.left,
          top: vertical ? safe.top + 60 : safe.top + 170,
          opacity: cta,
        }}
      >
        <Reveal de={8.7}>
          <div style={{ fontSize: vertical ? 88 : 84, fontWeight: 800, letterSpacing: -1.5, lineHeight: 1 }}>{t.cta1}</div>
        </Reveal>
        <Reveal de={8.9}>
          <div
            style={{
              display: "inline-block",
              marginTop: 18,
              fontSize: vertical ? 104 : 96,
              fontWeight: 800,
              letterSpacing: -2,
              lineHeight: 1,
              background: COLORS.laterite,
              padding: "14px 26px 18px",
            }}
          >
            {t.cta2}
          </div>
        </Reveal>
      </div>

      {/* Carton final */}
      <AbsoluteFill
        style={{
          background: COLORS.blancCasse,
          clipPath: `inset(${(1 - carton) * 100}% 0 0 0)`,
          color: COLORS.anthracite,
          paddingLeft: safe.left,
          paddingRight: vertical ? safe.right : safe.left,
          paddingTop: vertical ? safe.top + 40 : safe.top + 20,
          display: "flex",
          flexDirection: "column",
          alignItems: vertical ? "flex-start" : "center",
          textAlign: vertical ? "left" : "center",
        }}
      >
        {/* multiply : le fond blanc du logo JPEG se fond dans le blanc cassé */}
        <Reveal de={CARTON_H + 0.4} style={{ mixBlendMode: "multiply" }}>
          <Img src={staticFile(LOGO)} style={{ width: vertical ? 420 : 360, display: "block" }} />
        </Reveal>
        <div style={{ marginTop: vertical ? 50 : 30, fontSize: vertical ? 92 : 84, fontWeight: 800, letterSpacing: -2, lineHeight: 1.02 }}>
          <Reveal de={CARTON_H + 0.8}>{SIGNATURE.ligne1}</Reveal>
          <Reveal de={CARTON_H + 1.05}>
            <span style={{ color: COLORS.vert }}>{SIGNATURE.ligne2}</span>
          </Reveal>
        </div>
        <div style={{ width: 120, height: 10, background: COLORS.laterite, margin: vertical ? "44px 0" : "30px 0", scale: `${prog(frame, fps, CARTON_H + 1.3, 0.5)} 1`, transformOrigin: "0 50%" }} />
        <Reveal de={CARTON_H + 1.5}>
          <div style={{ fontSize: vertical ? 40 : 36, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, color: COLORS.laterite }}>
            Devis BTCS sur WhatsApp
          </div>
        </Reveal>
        <Reveal de={CARTON_H + 1.7}>
          <div style={{ fontSize: vertical ? 72 : 64, fontWeight: 800, letterSpacing: -1, marginTop: 6 }}>
            {CONTACT.whatsapp || "[ WhatsApp à confirmer ]"}
          </div>
        </Reveal>
        <Reveal de={CARTON_H + 2.0}>
          <div style={{ fontSize: vertical ? 38 : 34, fontWeight: 500, marginTop: 26, lineHeight: 1.45, opacity: 0.85 }}>
            {CONTACT.site ? <div>{CONTACT.site}</div> : null}
            {CONTACT.email ? <div>{CONTACT.email}</div> : null}
          </div>
        </Reveal>
        {/* Soubassement : trois rangs de blocs posés de bas en haut */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: vertical ? 300 : 170, overflow: "hidden" }}>
          {Array.from({ length: 3 }).map((_, r) => {
            const bh = vertical ? 92 : 52;
            const bw = bh * 2.1;
            const n = Math.ceil(W / bw) + 2;
            return Array.from({ length: n }).map((__, c) => {
              const p = prog(frame, fps, CARTON_H + 0.2 + (2 - r) * 0.18 + c * 0.03, 0.35, EASE_IN_OUT);
              return (
                <BlockFace
                  key={`${r}-${c}`}
                  w={bw - 6}
                  h={bh - 6}
                  seed={120 + r * n + c}
                  style={{
                    position: "absolute",
                    left: c * bw - (r % 2 ? bw / 2 : 0),
                    top: r * bh + (1 - p) * 80,
                    opacity: p,
                  }}
                />
              );
            });
          })}
        </div>
      </AbsoluteFill>
      {!MEDIA.stock.src && frame < CARTON_H * fps ? <Mention texte="Illustration schématique" /> : null}
    </AbsoluteFill>
  );
};

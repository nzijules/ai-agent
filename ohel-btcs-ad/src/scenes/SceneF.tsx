import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT } from "../config/brand";
import { MEDIA } from "../config/assets";
import { ECRAN } from "../config/script";
import { EASE_IN_OUT, prog, rand, useLayout } from "../components/anim";
import { BlockFace } from "../components/Block";
import { Chapitre, MediaFill, Mention, Reveal, Trame } from "../components/ui";

/** F — Cure humide : blocs rangés, humidification fine et régulière. */
export const SceneF: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { vertical, safe, W } = useLayout();
  const t = ECRAN.F;

  const cols = 4;
  const rows = vertical ? 6 : 5;
  const bw = vertical ? 190 : 200;
  const bh = bw / 2.1;
  const gx = 16;
  const gy = 14;
  const gridW = cols * bw + (cols - 1) * gx;
  const gridX = vertical ? (W - gridW) / 2 : W - safe.right - gridW;
  const gridY = vertical ? safe.top + 400 : safe.top + 230;
  const rampeY = gridY - 70;
  const arrosage = prog(frame, fps, 1.2, 0.6);
  const buses = 9;

  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: COLORS.blancCasse }}>
      <Trame />
      {MEDIA.cure.src ? (
        <AbsoluteFill style={{ opacity: 0.85 }}>
          <MediaFill slot={MEDIA.cure} />
        </AbsoluteFill>
      ) : (
        <>
          {/* Rampe d'arrosage */}
          <div
            style={{
              position: "absolute",
              left: gridX - 30,
              top: rampeY,
              width: gridW + 60,
              height: 14,
              background: "#6A717A",
              opacity: prog(frame, fps, 0.6, 0.5),
            }}
          />
          {/* Gouttelettes : lignes fines et régulières */}
          {Array.from({ length: buses }).map((_, b) => {
            const x = gridX + (gridW * (b + 0.5)) / buses;
            return Array.from({ length: 7 }).map((__, k) => {
              const periode = 22;
              const local = (frame + k * (periode / 7) * 3 + b * 5) % periode;
              const y = rampeY + 18 + (local / periode) * 64;
              return (
                <div
                  key={`${b}-${k}`}
                  style={{
                    position: "absolute",
                    left: x + (rand(b * 7 + k) - 0.5) * 30,
                    top: y,
                    width: 3,
                    height: 12,
                    borderRadius: 2,
                    background: "rgba(190,220,235,0.8)",
                    opacity: arrosage * (1 - local / periode),
                  }}
                />
              );
            });
          })}
          {/* Blocs rangés : s'humidifient rang par rang */}
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((__, c) => {
              const humide = prog(frame, fps, 1.8 + r * 0.45 + c * 0.05, 1.6, EASE_IN_OUT);
              return (
                <BlockFace
                  key={`${r}-${c}`}
                  w={bw}
                  h={bh}
                  seed={40 + r * cols + c}
                  humide={humide}
                  style={{ position: "absolute", left: gridX + c * (bw + gx), top: gridY + r * (bh + gy) }}
                />
              );
            }),
          )}
          <Mention texte="Illustration schématique" />
        </>
      )}
      <Chapitre numero={4} titre={t.chapitre} />

      <div
        style={{
          position: "absolute",
          left: safe.left,
          top: vertical ? safe.top + 20 : safe.top + 220,
          maxWidth: vertical ? W - safe.left - safe.right : 720,
        }}
      >
        <Reveal de={0.5}>
          <div style={{ fontSize: vertical ? 100 : 96, fontWeight: 800, letterSpacing: -2, lineHeight: 1 }}>
            Cure <span style={{ color: "#9CC9DA" }}>humide</span>
          </div>
        </Reveal>
        <Reveal de={3.1}>
          <div style={{ fontSize: vertical ? 40 : 40, fontWeight: 600, marginTop: 24, display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ width: 26, height: 12, background: COLORS.lateriteClair, display: "inline-block" }} />
            {t.l1}
          </div>
        </Reveal>
        <Reveal de={5.7}>
          <div style={{ fontSize: vertical ? 40 : 40, fontWeight: 600, marginTop: 10, display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ width: 26, height: 12, background: COLORS.vertClair, display: "inline-block" }} />
            {t.l2}
          </div>
        </Reveal>
      </div>
    </AbsoluteFill>
  );
};

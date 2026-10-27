import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT } from "../config/brand";
import { ECRAN } from "../config/script";
import { EASE_IN_OUT, prog, useLayout } from "../components/anim";
import { texture } from "../components/textures";
import { Chapitre, Reveal, Trame } from "../components/ui";

/**
 * C — Formulation : colonne segmentée, hauteurs strictement proportionnelles
 * aux valeurs communiquées (65 / 25 / 10).
 */
const APPORTS = [
  { de: 3.0, duree: 2.2 }, // latérite
  { de: 8.2, duree: 1.4 }, // sable
  { de: 11.8, duree: 0.9 }, // ciment
];

const COULEUR_TEXTE = [COLORS.lateriteClair, COLORS.sable, "#C9CBCD"];

export const SceneC: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { vertical, safe } = useLayout();
  const t = ECRAN.C;

  const colX = safe.left;
  const colW = vertical ? 300 : 300;
  const colTop = vertical ? safe.top + 210 : safe.top + 110;
  const colH = vertical ? 900 : 640;
  const fusion = prog(frame, fps, 14.6, 1.3, EASE_IN_OUT);

  // Segments empilés de bas en haut : latérite, sable, ciment.
  let cumul = 0;
  const segments = t.composants.map((c, i) => {
    const h = (colH * c.pct) / 100;
    const bas = colTop + colH - cumul;
    cumul += h;
    const remplissage = prog(frame, fps, APPORTS[i].de, APPORTS[i].duree, EASE_IN_OUT);
    return { ...c, i, h, bas, haut: bas - h, remplissage };
  });

  // Étiquettes à positions fixes, reliées au segment par un filet.
  const labelY = vertical ? [colTop + 520, colTop + 230, colTop - 40] : [colTop + 360, colTop + 130, colTop - 60];
  const labelX = colX + colW + 110;

  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: COLORS.blancCasse }}>
      <Trame lumiere={[22, 55]} numero={1} />
      <Chapitre numero={1} titre={t.chapitre} />

      {/* Titre d'ouverture */}
      <div
        style={{
          position: "absolute",
          left: safe.left,
          top: vertical ? safe.top + 10 : safe.top + 10,
          fontSize: vertical ? 64 : 56,
          fontWeight: 800,
          letterSpacing: -1,
          opacity: 1 - prog(frame, fps, 2.8, 0.4),
        }}
      >
        <Reveal de={0.4}>Une formulation</Reveal>
        <Reveal de={0.65}>
          <span style={{ color: COLORS.lateriteClair }}>précise.</span>
        </Reveal>
      </div>

      {/* Colonne : contour */}
      <div
        style={{
          position: "absolute",
          left: colX - 6,
          top: colTop - 6,
          width: colW + 12,
          height: colH + 12,
          border: "3px solid rgba(243,238,230,0.35)",
          opacity: prog(frame, fps, 2.4, 0.5),
        }}
      />

      {segments.map((s) => (
        <React.Fragment key={s.nom}>
          {/* Coulée de matière pendant l'apport */}
          {s.remplissage > 0 && s.remplissage < 1 ? (
            <div
              style={{
                position: "absolute",
                left: colX + colW / 2 - 26,
                top: colTop - 220,
                width: 52,
                height: s.bas - s.h * s.remplissage - (colTop - 220),
                maskImage: "linear-gradient(transparent, black 140px)",
                backgroundImage: texture(s.texture, 2 + s.i, 200),
                backgroundPositionY: `${frame * 22}px`,
                opacity: 0.95,
              }}
            />
          ) : null}
          {/* Segment */}
          <div
            style={{
              position: "absolute",
              left: colX,
              top: s.bas - s.h * s.remplissage,
              width: colW,
              height: s.h * s.remplissage,
              backgroundImage: texture(s.texture, 2 + s.i, 300),
              boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.35)",
            }}
          />
          {/* Filet + étiquette */}
          <svg
            style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
            width={1}
            height={1}
          >
            <polyline
              points={`${colX + colW + 14},${s.bas - s.h / 2} ${colX + colW + 60},${s.bas - s.h / 2} ${labelX - 20},${labelY[s.i] + 70}`}
              fill="none"
              stroke={COULEUR_TEXTE[s.i]}
              strokeWidth={3}
              strokeDasharray={600}
              strokeDashoffset={600 * (1 - prog(frame, fps, APPORTS[s.i].de + 0.3, 0.6))}
            />
          </svg>
          <div style={{ position: "absolute", left: labelX, top: labelY[s.i] }}>
            <Reveal de={APPORTS[s.i].de + 0.2}>
              <div style={{ fontSize: vertical ? 130 : 110, fontWeight: 800, lineHeight: 0.95, color: COULEUR_TEXTE[s.i], letterSpacing: -3 }}>
                {Math.round(interpolate(s.remplissage, [0, 1], [0, s.pct]))}
                <span style={{ fontSize: "0.55em", marginLeft: 8 }}>%</span>
              </div>
            </Reveal>
            <Reveal de={APPORTS[s.i].de + 0.45}>
              <div style={{ fontSize: vertical ? 48 : 42, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase" }}>{s.nom}</div>
            </Reveal>
            <Reveal de={APPORTS[s.i].de + 0.65}>
              <div style={{ fontSize: vertical ? 36 : 32, fontWeight: 500, opacity: 0.8 }}>{s.role}</div>
            </Reveal>
          </div>
        </React.Fragment>
      ))}

      {/* Réunion des trois matières */}
      <div
        style={{
          position: "absolute",
          left: colX,
          top: colTop,
          width: colW,
          height: colH,
          backgroundImage: texture("melange", 6, 300),
          opacity: fusion,
        }}
      />

      {/* Source de la formulation */}
      <div
        style={{
          position: "absolute",
          left: colX,
          top: colTop + colH + 34,
          fontSize: vertical ? 28 : 26,
          fontWeight: 500,
          opacity: 0.75 * prog(frame, fps, 13.0, 0.6),
        }}
      >
        {t.source}
      </div>
    </AbsoluteFill>
  );
};

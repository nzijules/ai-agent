import React from "react";
import { COLORS } from "../config/brand";
import { texture } from "./textures";

/**
 * Presse hydraulique — schéma animé (illustration, pas une machine OHEL).
 * Tous les états sont pilotés par des progressions 0→1 fournies par la scène.
 * Système de coordonnées : 600 × 900.
 */
export type PresseEtat = {
  /** Tiroir d'alimentation : 0 rentré à droite, 1 au-dessus du moule. */
  tiroir: number;
  /** Remplissage du moule (0 vide, 1 plein). */
  remplissage: number;
  /** Descente du plateau : 0 haut, 1 contact matière, 2 compression finale. */
  plateau: number;
  /** Éjection du bloc par le piston inférieur (0 → 1). */
  ejection: number;
  /** Évacuation latérale du bloc (0 → 1). */
  evacuation: number;
  /** Secousse d'impact en px. */
  secousse?: number;
};

const MOULE = { x: 200, l: 200, haut: 560, bas: 760 };
const HAUTEUR_COMPACTE = 120;

export const Presse: React.FC<{ etat: PresseEtat; largeur: number; style?: React.CSSProperties }> = ({
  etat,
  largeur,
  style,
}) => {
  const { tiroir, remplissage, plateau, ejection, evacuation, secousse = 0 } = etat;
  const tex = texture("melange", 5, 200).slice(5, -2);
  const texBloc = texture("bloc", 9, 200).slice(5, -2);

  // Matière dans le moule : hauteur libre puis compactée.
  const hLibre = (MOULE.bas - MOULE.haut) * remplissage;
  const compaction = Math.max(0, plateau - 1);
  const hMatiere = hLibre - (hLibre - HAUTEUR_COMPACTE) * compaction;
  // Position du plateau supérieur.
  const yContact = MOULE.bas - hLibre;
  const yPlateauBas =
    plateau <= 1 ? 330 + (yContact - 330) * plateau : yContact + (MOULE.bas - HAUTEUR_COMPACTE - yContact) * compaction;
  const yPlateau = ejection > 0 ? yPlateauBas - (yPlateauBas - 330) * Math.min(1, ejection * 1.6) : yPlateauBas;
  // Bloc éjecté puis évacué.
  const levee = ejection * (MOULE.bas - MOULE.haut);
  const yBloc = MOULE.bas - hMatiere - levee;
  const xBloc = MOULE.x + evacuation * 330;
  const compacte = plateau >= 2 || ejection > 0;

  return (
    <svg
      viewBox="0 0 600 900"
      width={largeur}
      height={(largeur * 900) / 600}
      style={{ overflow: "visible", transform: `translate(${secousse}px, ${secousse * 0.6}px)`, ...style }}
    >
      <defs>
        <pattern id="pm" patternUnits="userSpaceOnUse" width="200" height="200">
          <image href={tex} width="200" height="200" />
        </pattern>
        <pattern id="pb" patternUnits="userSpaceOnUse" width="200" height="200">
          <image href={texBloc} width="200" height="200" />
        </pattern>
        <linearGradient id="acier" x1="0" x2="1">
          <stop offset="0" stopColor="#3B4047" />
          <stop offset="0.45" stopColor="#5C636C" />
          <stop offset="1" stopColor="#31353B" />
        </linearGradient>
        <linearGradient id="chrome" x1="0" x2="1">
          <stop offset="0" stopColor="#8D949C" />
          <stop offset="0.4" stopColor="#E3E6E9" />
          <stop offset="1" stopColor="#7A8189" />
        </linearGradient>
        <radialGradient id="ombreSol">
          <stop offset="0" stopColor="#000" stopOpacity="0.6" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ombre au sol */}
      <ellipse cx="300" cy="872" rx="340" ry="34" fill="url(#ombreSol)" />

      {/* Bâti */}
      <rect x="50" y="70" width="60" height="790" fill="url(#acier)" />
      <rect x="490" y="70" width="60" height="790" fill="url(#acier)" />
      <rect x="30" y="60" width="540" height="90" fill="url(#acier)" />
      <rect x="30" y="800" width="540" height="70" fill="url(#acier)" />
      <rect x="30" y="140" width="540" height="6" fill={COLORS.laterite} opacity="0.9" />

      {/* Vérin hydraulique */}
      <rect x="235" y="150" width="130" height="150" rx="6" fill="url(#acier)" stroke="#23262B" strokeWidth="3" />
      <rect x="235" y="190" width="130" height="8" fill="#23262B" opacity="0.6" />
      <rect x="235" y="250" width="130" height="8" fill="#23262B" opacity="0.6" />
      <rect x="284" y="300" width="32" height={Math.max(0, yPlateau - 300)} fill="url(#chrome)" />
      {/* Plateau supérieur */}
      <rect x={MOULE.x - 6} y={yPlateau} width={MOULE.l + 12} height="34" fill="url(#chrome)" stroke="#5A6068" strokeWidth="2" />
      <rect x={MOULE.x - 6} y={yPlateau + 30} width={MOULE.l + 12} height="4" fill="#2B2E33" />

      {/* Bloc / matière (sous le moule pour être masqué par ses parois) */}
      {hMatiere > 0 && evacuation < 1 ? (
        <rect
          x={xBloc}
          y={yBloc}
          width={MOULE.l}
          height={hMatiere}
          fill={compacte ? "url(#pb)" : "url(#pm)"}
          stroke={compacte ? "#6B3418" : "none"}
          strokeWidth="2"
        />
      ) : null}

      {/* Moule */}
      <rect x={MOULE.x - 22} y={MOULE.haut} width="22" height={MOULE.bas - MOULE.haut + 10} fill="url(#acier)" />
      <rect x={MOULE.x + MOULE.l} y={MOULE.haut} width="22" height={MOULE.bas - MOULE.haut + 10} fill="url(#acier)" />
      <rect x={MOULE.x - 40} y={MOULE.haut - 8} width="62" height="10" fill="#6A717A" />
      <rect x={MOULE.x + MOULE.l - 22} y={MOULE.haut - 8} width="62" height="10" fill="#6A717A" />
      {/* Piston inférieur */}
      <rect x={MOULE.x} y={MOULE.bas - levee} width={MOULE.l} height="14" fill="url(#chrome)" />
      <rect x="284" y={MOULE.bas + 14 - levee} width="32" height={Math.max(0, 800 - MOULE.bas - 14 + levee)} fill="url(#chrome)" />

      {/* Tiroir d'alimentation */}
      <g transform={`translate(${(1 - tiroir) * 300}, 0)`}>
        <rect x={MOULE.x - 4} y={MOULE.haut - 150} width={MOULE.l + 8} height="140" fill="none" stroke="#7A8189" strokeWidth="8" />
        <rect
          x={MOULE.x}
          y={MOULE.haut - 146 + 136 * Math.min(1, remplissage)}
          width={MOULE.l}
          height={136 * (1 - Math.min(1, remplissage)) + 0.01}
          fill="url(#pm)"
        />
        <rect x={MOULE.x + MOULE.l} y={MOULE.haut - 100} width="300" height="12" fill="#7A8189" />
      </g>

      {/* Table d'évacuation */}
      <rect x={MOULE.x + MOULE.l + 22} y={MOULE.haut} width="270" height="10" fill="#6A717A" opacity={evacuation > 0 ? 1 : 0.6} />
    </svg>
  );
};

import React from "react";
import { COLORS } from "../theme/colors";
import { FONT } from "../theme/fonts";

// Composants d'interface animée réutilisables (panneaux 3D, lignes de réglage,
// barres de progression). Ils ne contiennent aucune logique temporelle :
// les scènes leur passent des valeurs déjà interpolées.

/** Carte d'interface flottante avec épaisseur 3D, reflet et ombre portée. */
export const Panel3D: React.FC<{
  width: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  /** Position du reflet balayant (0..1, hors plage = invisible). */
  sheen?: number;
  radius?: number;
}> = ({ width, children, style, sheen = -1, radius = 48 }) => (
  <div style={{ position: "relative", width, ...style }}>
    {/* tranche (épaisseur) */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: radius,
        background: "linear-gradient(180deg, #2E323B, #0B0C0F)",
        translate: "0px 18px",
        boxShadow: "0 60px 90px rgba(90,60,0,0.35), 0 20px 40px rgba(0,0,0,0.25)",
      }}
    />
    {/* face avant */}
    <div
      style={{
        position: "relative",
        borderRadius: radius,
        background: "linear-gradient(180deg, #FFFFFF 0%, #F7F8FA 100%)",
        boxShadow: "inset 0 2px 0 rgba(255,255,255,1), inset 0 -3px 0 rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ position: "absolute", inset: 0, borderRadius: radius, overflow: "hidden" }}>
      {sheen > -0.5 && sheen < 1.5 ? (
        <div
          style={{
            position: "absolute",
            top: -200,
            bottom: -200,
            width: 220,
            left: `${-30 + sheen * 140}%`,
            rotate: "20deg",
            background: "linear-gradient(90deg, rgba(255,229,0,0) 0%, rgba(255,241,118,0.55) 50%, rgba(255,229,0,0) 100%)",
            mixBlendMode: "multiply",
          }}
        />
      ) : null}
      </div>
      {children}
    </div>
  </div>
);

export const Label: React.FC<{
  children: React.ReactNode;
  size?: number;
  weight?: number;
  color?: string;
  italic?: boolean;
  style?: React.CSSProperties;
}> = ({ children, size = 40, weight = 700, color = COLORS.ui, italic = false, style }) => (
  <div
    style={{
      fontFamily: FONT,
      fontStyle: italic ? "italic" : "normal",
      fontWeight: weight,
      fontSize: size,
      color,
      lineHeight: 1.12,
      letterSpacing: -0.5,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Ligne de réglage : icône ronde + libellé + état + contrôle à droite. */
export const SettingRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  status: React.ReactNode;
  control: React.ReactNode;
  highlight?: number;
  style?: React.CSSProperties;
}> = ({ icon, label, status, control, highlight = 0, style }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 26,
      padding: "26px 40px",
      background: `rgba(255,203,5,${0.16 * highlight})`,
      ...style,
    }}
  >
    <div
      style={{
        width: 92,
        height: 92,
        borderRadius: 46,
        background: "linear-gradient(145deg, #F4F5F7, #E2E5EA)",
        boxShadow: "inset 0 2px 0 #fff, 0 6px 14px rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
      <Label size={40} weight={700} color={COLORS.ui}>
        {label}
      </Label>
      {status}
    </div>
    <div style={{ flexShrink: 0 }}>{control}</div>
  </div>
);

/** Barre de progression avec dégradé et reflet. */
export const ProgressBar: React.FC<{ value: number; color?: string; height?: number }> = ({
  value,
  color = COLORS.yellow,
  height = 18,
}) => (
  <div
    style={{
      height,
      borderRadius: height,
      background: "#E4E7EC",
      boxShadow: "inset 0 2px 4px rgba(0,0,0,0.12)",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        width: `${Math.max(0, Math.min(1, value)) * 100}%`,
        height: "100%",
        borderRadius: height,
        background: `linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 50%), ${color}`,
      }}
    />
  </div>
);

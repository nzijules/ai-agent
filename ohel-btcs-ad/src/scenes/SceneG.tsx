import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT } from "../config/brand";
import { MEDIA, MediaSlot } from "../config/assets";
import { ECRAN } from "../config/script";
import { EASE_IN_OUT, prog, useLayout } from "../components/anim";
import { MediaFill, MentionMedia, Reveal, VisuelManquant } from "../components/ui";

/** G — Applications : triptyque Maison / École / Bâtiments, puis réel en usage. */
const Panneau: React.FC<{ slot: MediaSlot; titre: string; mention?: boolean }> = ({ slot, titre, mention = true }) =>
  slot.src ? (
    <AbsoluteFill>
      <MediaFill slot={slot} />
      {mention ? <MentionMedia slot={slot} style={{ top: 20, right: 20 }} /> : null}
    </AbsoluteFill>
  ) : (
    <VisuelManquant titre={titre} prompt={slot.prompt} />
  );

export const SceneG: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { vertical, safe, W, H } = useLayout();
  const t = ECRAN.G;

  const panneaux = [
    { slot: MEDIA.maison, titre: t.maison, de: 0.5 },
    { slot: MEDIA.ecole, titre: t.ecole, de: 1.4 },
    { slot: MEDIA.batiment, titre: t.batiment, de: 2.3 },
  ];
  const gap = 12;
  const n = panneaux.length;
  const pw = vertical ? W : (W - gap * (n - 1)) / n;
  const ph = vertical ? (H - gap * (n - 1)) / n : H;
  // Plans pleins : intérieur (4,0 s) puis salle (8,3 s), révélés par fenêtre-bloc.
  const plein1 = prog(frame, fps, 4.0, 0.6, EASE_IN_OUT);
  const plein2 = prog(frame, fps, 8.3, 0.6, EASE_IN_OUT);
  const fenetre = (p: number) => `inset(${(1 - p) * 50}% 0 ${(1 - p) * 50}% 0)`;

  const grand = (l1: string, l2: string, de: number) => (
    <div
      style={{
        position: "absolute",
        left: safe.left,
        bottom: vertical ? safe.bottom + 210 : safe.bottom + 20,
        fontSize: vertical ? 100 : 96,
        fontWeight: 800,
        letterSpacing: -2,
        lineHeight: 1,
        textShadow: "0 4px 30px rgba(0,0,0,0.5)",
      }}
    >
      <Reveal de={de}>{l1}</Reveal>
      <Reveal de={de + 0.25}>
        <span style={{ color: COLORS.lateriteClair }}>{l2}</span>
      </Reveal>
    </div>
  );

  return (
    <AbsoluteFill style={{ background: COLORS.anthracite, fontFamily: FONT, color: COLORS.blancCasse }}>
      {/* Triptyque */}
      {panneaux.map((p, i) => {
        // Ouverture anticipée : la première bande est déjà là quand la transition se termine.
        const r = prog(frame, fps, Math.max(0, p.de - 0.5), 0.55, EASE_IN_OUT);
        return (
          <div
            key={p.titre}
            style={{
              position: "absolute",
              left: vertical ? 0 : i * (pw + gap),
              top: vertical ? i * (ph + gap) : 0,
              width: pw,
              height: ph,
              overflow: "hidden",
              clipPath: vertical ? `inset(0 ${(1 - r) * 100}% 0 0)` : `inset(${(1 - r) * 100}% 0 0 0)`,
            }}
          >
            <Panneau slot={p.slot} titre={p.titre} />
            <div
              style={{
                position: "absolute",
                left: vertical ? safe.left : 50,
                bottom: vertical ? 36 : safe.bottom + 20,
                fontSize: vertical ? 84 : 80,
                fontWeight: 800,
                letterSpacing: -1,
                textShadow: "0 3px 24px rgba(0,0,0,0.6)",
              }}
            >
              <Reveal de={p.de}>{p.titre}</Reveal>
            </div>
          </div>
        );
      })}

      {/* Plein cadre 1 : intérieur réel en BTCS */}
      <AbsoluteFill style={{ clipPath: fenetre(plein1), opacity: plein1 > 0 ? 1 : 0 }}>
        <Panneau slot={MEDIA.interieur} titre="Intérieur" mention={false} />
        <AbsoluteFill style={{ background: "linear-gradient(transparent 35%, rgba(20,20,22,0.88) 75%)" }} />
        <MentionMedia slot={MEDIA.interieur} />
        {grand(t.projets1, t.projets2, 4.4)}
      </AbsoluteFill>

      {/* Plein cadre 2 */}
      <AbsoluteFill style={{ clipPath: fenetre(plein2), opacity: plein2 > 0 ? 1 : 0 }}>
        <Panneau slot={MEDIA.salle} titre="Intérieur" mention={false} />
        <AbsoluteFill style={{ background: "linear-gradient(transparent 35%, rgba(20,20,22,0.88) 75%)" }} />
        <MentionMedia slot={MEDIA.salle} />
        {grand(t.choix1, t.choix2, 8.7)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

import React from "react";
import {
  AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile,
  useCurrentFrame, useVideoConfig,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { scenes, TRANSITION, couleurs as c } from "./script";

const police = "Inter, Arial, sans-serif";

// ---------- Petits éléments réutilisables ----------
const Fond: React.FC<{ haut: string; bas: string }> = ({ haut, bas }) => (
  <AbsoluteFill style={{ background: `linear-gradient(170deg, ${haut}, ${bas})` }} />
);

const Ressort: React.FC<{ delai?: number; children: React.ReactNode }> = ({ delai = 0, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delai, fps, config: { damping: 12 } });
  return (
    <div style={{ transform: `scale(${s})`, opacity: Math.min(1, s * 1.5) }}>{children}</div>
  );
};

const Monte: React.FC<{ delai?: number; children: React.ReactNode }> = ({ delai = 0, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delai, [0, 18], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const e = 1 - Math.pow(1 - p, 3); // ease-out
  return <div style={{ transform: `translateY(${(1 - e) * 80}px)`, opacity: e }}>{children}</div>;
};

const Titre: React.FC<{ children: React.ReactNode; couleur?: string; taille?: number }> = ({
  children, couleur = c.blanc, taille = 96,
}) => (
  <div style={{ fontFamily: police, fontWeight: 800, fontSize: taille, lineHeight: 1.1,
    color: couleur, textAlign: "center", letterSpacing: -2 }}>{children}</div>
);

const Bulle: React.FC<{ texte: string; delai: number; droite?: boolean }> = ({ texte, delai, droite }) => (
  <div style={{ display: "flex", justifyContent: droite ? "flex-end" : "flex-start" }}>
    <Ressort delai={delai}>
      <div style={{ fontFamily: police, fontSize: 50, background: droite ? "#d9fdd3" : c.blanc,
        color: "#111", padding: "24px 34px", borderRadius: 34, whiteSpace: "nowrap",
        boxShadow: "0 10px 30px rgba(0,0,0,.25)" }}>{texte}</div>
    </Ressort>
  </div>
);

// ---------- Les 5 scènes ----------
const Accroche: React.FC = () => (
  <AbsoluteFill>
    <Fond haut={c.bleuClair} bas={c.nuit} />
    <AbsoluteFill style={{ padding: "330px 90px", gap: 34, display: "flex", flexDirection: "column" }}>
      <Bulle texte="Bonjour, vous êtes ouverts ?" delai={5} />
      <Bulle texte="C'est combien la livraison ?" delai={25} />
      <Bulle texte="Je peux réserver pour demain ?" delai={45} />
      <Bulle texte="Allô ? 😕" delai={70} />
    </AbsoluteFill>
    {[5, 25, 45, 70].map((d) => (
      <Sequence key={d} from={d}><Audio src={staticFile("pop.wav")} volume={0.35} /></Sequence>
    ))}
  </AbsoluteFill>
);

const Probleme: React.FC = () => {
  const frame = useCurrentFrame();
  const nonLus = Math.round(interpolate(frame, [10, 110], [3, 47], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const tremble = frame > 110 ? Math.sin(frame * 1.2) * 6 : 0;
  return (
    <AbsoluteFill>
      <Fond haut="#2a0c10" bas={c.nuit} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 60, display: "flex", flexDirection: "column" }}>
        <div style={{ position: "relative", transform: `translateX(${tremble}px)` }}>
          <div style={{ width: 300, height: 300, borderRadius: 80, background: c.vert,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 170 }}>💬</div>
          <div style={{ position: "absolute", top: -40, right: -60, minWidth: 150, height: 150,
            borderRadius: 75, background: c.rouge, color: c.blanc, fontFamily: police,
            fontWeight: 800, fontSize: 76, display: "flex", alignItems: "center",
            justifyContent: "center", padding: "0 24px" }}>{nonLus}</div>
        </div>
        <Monte delai={20}><Titre>Messages<br />sans réponse…</Titre></Monte>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const largeur = interpolate(frame, [30, 55], [0, 620], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Fond haut={c.blanc} bas="#dfe8ff" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column", gap: 40 }}>
        <Ressort delai={5}>
          <div style={{ fontFamily: police, fontWeight: 900, fontSize: 170, color: c.bleu, letterSpacing: -4 }}>
            ARO<span style={{ color: c.bleuClair }}>SOFT</span>
          </div>
        </Ressort>
        <div style={{ height: 14, width: largeur, background: c.jaune, borderRadius: 7 }} />
        <Monte delai={50}><Titre couleur={c.bleu} taille={84}>Vos réponses WhatsApp,<br />24&nbsp;h/24.</Titre></Monte>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Benefices: React.FC = () => {
  const items = [
    { icone: "⚡", texte: "Réponses instantanées" },
    { icone: "🛒", texte: "Commandes et rendez-vous" },
    { icone: "✅", texte: "Zéro message oublié" },
  ];
  return (
    <AbsoluteFill>
      <Fond haut={c.bleu} bas={c.nuit} />
      <AbsoluteFill style={{ justifyContent: "center", padding: "0 80px", display: "flex", flexDirection: "column", gap: 56 }}>
        {items.map((it, i) => (
          <Monte key={it.texte} delai={5 + i * 35}>
            <div style={{ display: "flex", alignItems: "center", gap: 36, background: "rgba(255,255,255,.1)",
              border: "2px solid rgba(255,255,255,.2)", borderRadius: 36, padding: "36px 40px" }}>
              <div style={{ width: 130, height: 130, borderRadius: 34, background: c.jaune,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 76 }}>{it.icone}</div>
              <div style={{ fontFamily: police, fontWeight: 700, fontSize: 58, color: c.blanc }}>{it.texte}</div>
            </div>
          </Monte>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Appel: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + 0.05 * Math.sin((frame / 30) * Math.PI * 2);
  const fondu = interpolate(frame, [150, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: fondu }}>
      <Fond haut={c.jaune} bas="#ffb000" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column", gap: 70 }}>
        <Monte delai={5}><Titre couleur={c.bleu} taille={120}>Essayez<br />AroSoft</Titre></Monte>
        <Ressort delai={30}>
          <div style={{ transform: `scale(${pulse})`, background: c.vert, color: c.blanc, fontFamily: police,
            fontWeight: 800, fontSize: 46, padding: "30px 48px", borderRadius: 999,
            boxShadow: "0 16px 40px rgba(0,0,0,.25)" }}>💬 Écrivez-nous sur WhatsApp</div>
        </Ressort>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const composants = { accroche: Accroche, probleme: Probleme, solution: Solution, benefices: Benefices, appel: Appel };

// ---------- Sous-titres (issus du script) ----------
const SousTitre: React.FC<{ texte: string }> = ({ texte }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [8, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 300 }}>
      <div style={{ opacity: o, maxWidth: 900, fontFamily: police, fontWeight: 700, fontSize: 46,
        lineHeight: 1.3, color: c.blanc, background: "rgba(0,0,0,.65)", padding: "18px 30px",
        borderRadius: 18, textAlign: "center" }}>{texte}</div>
    </AbsoluteFill>
  );
};

// ---------- Montage final ----------
export const Pub: React.FC = () => {
  const transitions = [slide({ direction: "from-right" }), fade(), slide({ direction: "from-bottom" }), fade()];
  return (
    <AbsoluteFill style={{ background: c.nuit }}>
      <Audio src={staticFile("musique.wav")} volume={0.25} />
      <TransitionSeries>
        {scenes.flatMap((s, i) => {
          const Scene = composants[s.id];
          const bloc = [
            <TransitionSeries.Sequence key={s.id} durationInFrames={s.duree}>
              <Scene />
              <Sequence from={10}><Audio src={staticFile(s.voix)} /></Sequence>
              <SousTitre texte={s.texte} />
            </TransitionSeries.Sequence>,
          ];
          if (i < scenes.length - 1) {
            bloc.push(
              <TransitionSeries.Transition key={s.id + "-t"} presentation={transitions[i]}
                timing={linearTiming({ durationInFrames: TRANSITION })} />,
            );
          }
          return bloc;
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};

// Durée totale = somme des scènes - chevauchement des transitions
export const DUREE_TOTALE =
  scenes.reduce((t, s) => t + s.duree, 0) - TRANSITION * (scenes.length - 1);

import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Pill, Pop, Scene, clamp } from "./components";
import { Book3D } from "./book3d";
import { C, SCENES, TIMING } from "./theme";

export const TITLE: React.CSSProperties = {
  fontSize: 84,
  fontWeight: 900,
  lineHeight: 1.08,
  letterSpacing: -1.5,
};

const Check: React.FC<{ size?: number; color?: string }> = ({ size = 56, color = C.yellow }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
    <circle cx="24" cy="24" r="22" fill={color} />
    <path
      d="M14 25l7 7 13-15"
      fill="none"
      stroke={C.navy}
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* Generic slide-in row */
export const Row: React.FC<{
  i: number;
  delay: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ i, delay, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 140 } });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 28,
        width: 920,
        padding: "24px 34px",
        marginTop: 22,
        borderRadius: 28,
        textAlign: "left",
        background: "linear-gradient(120deg, rgba(30,75,255,0.30), rgba(255,255,255,0.05))",
        border: "2px solid rgba(60,200,255,0.30)",
        boxShadow: "0 16px 50px rgba(0,0,0,0.30)",
        opacity: s,
        transform: `translateX(${(1 - s) * (i % 2 ? 260 : -260)}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ---------- Ce que tu vas apprendre (2 parts) ---------- */
export const LEARN = [
  "Comprendre les principes du Vibe Motion Design",
  "Utiliser Claude Code pour concevoir tes animations",
  "Transformer une idée en storyboard structuré",
  "Créer des scènes animées : textes, images, formes, effets",
  "Animer chaque élément, pas juste faire défiler des images",
  "Concevoir des transitions fluides et cinématographiques",
  "Intégrer voix-off, musique et effets sonores",
  "Synchroniser les animations avec la narration",
  "Exporter au bon format pour les réseaux sociaux",
];

/* ---------- Ce que tu reçois ---------- */
const RECEIVE = [
  "Un ebook numérique en français",
  "Une méthode pratique et progressive",
  "Les instructions pour travailler avec Claude Code",
  "Des exemples et techniques de production",
  "Lisible sur smartphone, tablette et ordinateur",
];

export const Receive: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = spring({ frame: frame - 2, fps, config: { damping: 13 } });
  return (
    <Scene dur={SCENES.receive.dur}>
      <Book3D
        width={220}
        rotY={22 + Math.sin(frame / 18) * 18}
        rotX={5}
        style={{
          transform: `scale(${b})`,
          filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.6))",
          marginBottom: 40,
        }}
      />
      <Pop delay={6} style={{ ...TITLE, marginBottom: 20 }}>
        Ce que tu <span style={{ color: C.yellow }}>reçois</span>
      </Pop>
      {RECEIVE.map((r, i) => (
        <Row key={r} i={i} delay={16 + i * 12} style={{ padding: "18px 30px", marginTop: 16 }}>
          <Check size={52} />
          <div style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.2 }}>{r}</div>
        </Row>
      ))}
    </Scene>
  );
};

/* ---------- Prix : guide pratique à 10 000 FCFA ---------- */
export const Price: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TIMING.price;
  const amount = spring({ frame: frame - T.amount, fps, config: { damping: 8, stiffness: 180 } });
  const glow = 0.5 + 0.5 * Math.sin(frame / 8);
  return (
    <Scene dur={SCENES.price.dur}>
      <Pop delay={4} from="scale" style={{ fontSize: 74, fontWeight: 900 }}>
        <Pill color={C.yellow}>La bonne nouvelle !</Pill>
      </Pop>
      <Pop delay={T.guide} style={{ fontSize: 46, fontWeight: 700, color: C.muted, marginTop: 60 }}>
        J’ai préparé pour toi
      </Pop>
      <Pop delay={T.guide + 8} style={{ ...TITLE, fontSize: 92, marginTop: 6 }}>
        un guide pratique
      </Pop>
      <Pop delay={T.amount - 12} style={{ fontSize: 46, fontWeight: 700, color: C.muted, marginTop: 50 }}>
        à seulement
      </Pop>
      <div
        style={{
          fontSize: 170,
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: -5,
          color: C.yellow,
          marginTop: 10,
          opacity: Math.min(1, amount * 1.5),
          transform: `scale(${0.5 + 0.5 * amount})`,
          textShadow: `0 0 ${40 + glow * 40}px ${C.yellow}77`,
          whiteSpace: "nowrap",
        }}
      >
        10 000 <span style={{ fontSize: 80 }}>FCFA</span>
      </div>
      <Pop delay={T.promise} style={{ fontSize: 50, fontWeight: 800, marginTop: 60 }}>
        Ta 1<sup style={{ fontSize: 28 }}>re</sup> vidéo motion design
      </Pop>
      <Pop delay={T.pill} from="scale" style={{ fontSize: 50, fontWeight: 900, marginTop: 16 }}>
        <Pill color={C.red} textColor={C.white} rotate={-1.5}>
          pas à pas, dès aujourd’hui
        </Pill>
      </Pop>
    </Scene>
  );
};

/* ---------- CTA ---------- */
export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TIMING.cta;
  const b = spring({ frame: frame - 6, fps, config: { damping: 12 } });
  const btn = spring({ frame: frame - T.click, fps, config: { damping: 10 } });
  const pulse = frame > T.click + 14 ? 1 + Math.max(0, Math.sin((frame - T.click) / 6)) * 0.05 : 1;
  const ring = ((((frame - T.click) % 40) + 40) % 40) / 40;
  const bounce = Math.abs(Math.sin(frame / 7)) * 22;
  return (
    <Scene dur={SCENES.cta.dur + 10}>
      <Pop delay={2} style={{ ...TITLE, fontSize: 100, color: C.yellow }}>
        N’hésite plus !
      </Pop>
      <Book3D
        width={290}
        rotY={interpolate(frame, [0, 50], [-160, 22], { ...clamp, easing: Easing.out(Easing.cubic) }) + Math.sin(frame / 20) * 15}
        rotX={5}
        style={{ marginTop: 50, transform: `scale(${b}) translateY(${Math.sin(frame / 18) * 10}px)` }}
      />
      <div style={{ position: "relative", marginTop: 70 }}>
        {frame > T.click + 14 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 60,
              border: `4px solid ${C.yellow}`,
              transform: `scale(${1 + ring * 0.25})`,
              opacity: 1 - ring,
            }}
          />
        )}
        <div
          style={{
            background: C.yellow,
            color: C.navy,
            fontSize: 52,
            fontWeight: 900,
            padding: "30px 64px",
            borderRadius: 60,
            boxShadow: `0 20px 60px ${C.yellow}77`,
            transform: `scale(${btn * pulse})`,
            whiteSpace: "nowrap",
          }}
        >
          Je télécharge mon ebook
        </div>
      </div>
      <Pop delay={T.click + 6} style={{ fontSize: 44, fontWeight: 800, marginTop: 40 }}>
        Clique sur le lien ci-dessous
      </Pop>
      <svg
        width={90}
        height={90}
        viewBox="0 0 48 48"
        style={{ marginTop: 10, transform: `translateY(${bounce}px)`, opacity: interpolate(frame, [T.click + 10, T.click + 18], [0, 1], clamp) }}
      >
        <path d="M24 6v32M10 26l14 14 14-14" fill="none" stroke={C.yellow} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <Pop delay={T.click + 20} style={{ fontSize: 34, fontWeight: 700, color: C.muted, marginTop: 10 }}>
        arosoft.mychariow.com
      </Pop>
    </Scene>
  );
};

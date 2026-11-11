import React from "react";
import {
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Pill, Pop, Scene, clamp } from "./components";
import { C, SCENES } from "./theme";

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
      <Img
        src={staticFile("book.png")}
        style={{
          width: 300,
          transform: `scale(${b}) rotate(${-5 + Math.sin(frame / 20) * 2}deg)`,
          filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.6))",
          marginBottom: 30,
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

/* ---------- Prix ---------- */
const fmt = (n: number) => n.toLocaleString("fr-FR").replace(/ | /g, " ");

export const Price: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const strike = interpolate(frame, [176, 188], [0, 108], { ...clamp, easing: Easing.out(Easing.quad) });
  const count = Math.round(
    interpolate(frame, [266, 292], [25000, 10000], { ...clamp, easing: Easing.out(Easing.cubic) }) / 100,
  ) * 100;
  const pop = spring({ frame: frame - 290, fps, config: { damping: 8, stiffness: 200 } });
  const badge = spring({ frame: frame - 296, fps, config: { damping: 9 } });
  return (
    <Scene dur={SCENES.price.dur}>
      <Pop delay={4} from="scale" style={{ fontSize: 76, fontWeight: 900 }}>
        <Pill color={C.yellow}>La bonne nouvelle !</Pill>
      </Pop>
      <Pop delay={60} style={{ fontSize: 44, fontWeight: 700, color: C.muted, marginTop: 60 }}>
        Normalement vendue
      </Pop>
      <Pop delay={120} style={{ position: "relative", marginTop: 16 }}>
        <span style={{ fontSize: 88, fontWeight: 800, color: "rgba(255,255,255,0.6)" }}>
          25 000 FCFA
        </span>
        <span
          style={{
            position: "absolute",
            left: "-4%",
            top: "50%",
            height: 12,
            width: `${strike}%`,
            background: C.red,
            borderRadius: 6,
            transform: "rotate(-6deg)",
            boxShadow: `0 0 20px ${C.red}`,
          }}
        />
      </Pop>
      <div style={{ position: "relative", marginTop: 40 }}>
        <div
          style={{
            fontSize: 190,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: -6,
            color: C.yellow,
            opacity: interpolate(frame, [262, 270], [0, 1], clamp),
            transform: `scale(${1 + pop * 0.08 - (frame > 290 ? 0.08 : 0)})`,
            textShadow: `0 20px 60px ${C.yellow}66`,
          }}
        >
          {fmt(count)}
        </div>
        <div
          style={{
            fontSize: 70,
            fontWeight: 900,
            color: C.yellow,
            opacity: interpolate(frame, [262, 270], [0, 1], clamp),
          }}
        >
          FCFA
        </div>
        <div
          style={{
            position: "absolute",
            right: -190,
            top: -150,
            width: 170,
            height: 170,
            borderRadius: 85,
            background: C.red,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 56,
            fontWeight: 900,
            transform: `scale(${badge}) rotate(${12 - badge * 4}deg)`,
            boxShadow: `0 16px 50px ${C.red}88`,
          }}
        >
          -60%
        </div>
      </div>
      <Pop delay={300} style={{ fontSize: 46, fontWeight: 700, marginTop: 60 }}>
        Offre valable jusqu’au <span style={{ color: C.yellow }}>31 décembre</span>
      </Pop>
      <Pop delay={306} style={{ fontSize: 40, fontWeight: 500, color: C.muted, marginTop: 20 }}>
        Accès immédiat après paiement
      </Pop>
    </Scene>
  );
};

/* ---------- CTA ---------- */
export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = spring({ frame: frame - 10, fps, config: { damping: 12 } });
  const btn = spring({ frame: frame - 36, fps, config: { damping: 10 } });
  const pulse = frame > 50 ? 1 + Math.max(0, Math.sin((frame - 50) / 6)) * 0.05 : 1;
  const ring = (((frame - 50) % 40) + 40) % 40 / 40;
  return (
    <Scene dur={SCENES.cta.dur + 10}>
      <Pop delay={0} style={{ ...TITLE, fontSize: 92 }}>
        Clique sur le lien
      </Pop>
      <Pop delay={8} style={{ ...TITLE, fontSize: 92, color: C.yellow }}>
        et lance-toi !
      </Pop>
      <Img
        src={staticFile("book.png")}
        style={{
          width: 400,
          marginTop: 50,
          transform: `scale(${b}) rotate(${-4 + Math.sin(frame / 25) * 2}deg) translateY(${Math.sin(frame / 18) * 10}px)`,
          filter: "drop-shadow(0 40px 50px rgba(0,0,0,0.6))",
        }}
      />
      <div style={{ position: "relative", marginTop: 60 }}>
        {frame > 50 && (
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
            fontSize: 54,
            fontWeight: 900,
            padding: "30px 70px",
            borderRadius: 60,
            boxShadow: `0 20px 60px ${C.yellow}77`,
            transform: `scale(${btn * pulse})`,
          }}
        >
          J’accède à la formation →
        </div>
      </div>
      <Pop delay={56} style={{ fontSize: 46, fontWeight: 800, marginTop: 50 }}>
        arosoft.mychariow.com
      </Pop>
      <Pop delay={64} style={{ fontSize: 38, fontWeight: 500, color: C.muted, marginTop: 12 }}>
        Lien en description
      </Pop>
      <Pop
        delay={74}
        style={{ fontSize: 30, fontWeight: 700, letterSpacing: 6, color: C.muted, marginTop: 40 }}
      >
        AROSOFT · APPRENDRE · CRÉER · RÉUSSIR
      </Pop>
    </Scene>
  );
};

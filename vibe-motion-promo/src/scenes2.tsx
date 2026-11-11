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

const TITLE: React.CSSProperties = {
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
const Row: React.FC<{
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
const LEARN = [
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

const LearnList: React.FC<{ items: string[]; offset: number; dur: number; part: string }> = ({
  items,
  offset,
  dur,
  part,
}) => (
  <Scene dur={dur}>
    <Pop delay={0}>
      <Pill color={C.blue} textColor={C.white} rotate={0} style={{ fontSize: 36, fontWeight: 800 }}>
        {part}
      </Pill>
    </Pop>
    <Pop delay={4} style={{ ...TITLE, marginTop: 30, marginBottom: 30 }}>
      Ce que tu vas <span style={{ color: C.yellow }}>apprendre</span>
    </Pop>
    {items.map((t, i) => (
      <Row key={t} i={i} delay={14 + i * 14}>
        <div
          style={{
            flexShrink: 0,
            width: 70,
            height: 70,
            borderRadius: 20,
            background: C.yellow,
            color: C.navy,
            fontSize: 40,
            fontWeight: 900,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {offset + i + 1}
        </div>
        <div style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.2 }}>{t}</div>
      </Row>
    ))}
  </Scene>
);

export const Learn1: React.FC = () => (
  <LearnList items={LEARN.slice(0, 5)} offset={0} dur={SCENES.learn1.dur} part="LE PROGRAMME · 1/2" />
);
export const Learn2: React.FC = () => (
  <LearnList items={LEARN.slice(5)} offset={5} dur={SCENES.learn2.dur} part="LE PROGRAMME · 2/2" />
);

/* ---------- Réalisations concrètes ---------- */
type P = { label: string; sub: string; icon: React.ReactNode };
const ic = {
  fill: "none",
  stroke: C.cyan,
  strokeWidth: 3.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
const PROJECTS: P[] = [
  {
    label: "Publicités animées",
    sub: "TikTok · Facebook · Instagram",
    icon: (
      <>
        <rect x="14" y="4" width="20" height="40" rx="4" {...ic} />
        <path d="M21 38h6M21 18v10l8-5z" {...ic} />
      </>
    ),
  },
  {
    label: "Vidéos corporate",
    sub: "Présentations professionnelles",
    icon: (
      <>
        <rect x="8" y="10" width="22" height="34" {...ic} />
        <path d="M30 22h10v22H30M14 18h4M22 18h2M14 26h4M22 26h2M14 34h4M22 34h2" {...ic} />
      </>
    ),
  },
  {
    label: "Campagnes de sensibilisation",
    sub: "Messages qui marquent",
    icon: <path d="M6 20v8h6l16 10V10L12 20zM34 16c3 3 3 13 0 16M39 11c6 6 6 20 0 26" {...ic} />,
  },
  {
    label: "Vidéos éducatives",
    sub: "Explicatives et pédagogiques",
    icon: <path d="M4 18l20-10 20 10-20 10zM12 22v10c6 6 18 6 24 0V22M44 18v12" {...ic} />,
  },
  {
    label: "Présentations produits",
    sub: "Produits et services animés",
    icon: <path d="M10 16h28l-3 28H13zM18 16c0-10 12-10 12 0" {...ic} />,
  },
];

export const Projects: React.FC = () => (
  <Scene dur={SCENES.projects.dur}>
    <Pop delay={0} style={{ ...TITLE, marginBottom: 10 }}>
      Des réalisations
    </Pop>
    <Pop delay={6} style={{ ...TITLE, marginBottom: 30 }}>
      <Pill color={C.yellow}>concrètes</Pill>
    </Pop>
    {PROJECTS.map((p, i) => (
      <Row key={p.label} i={i} delay={16 + i * 13}>
        <div
          style={{
            flexShrink: 0,
            width: 100,
            height: 100,
            borderRadius: 26,
            background: "rgba(4,10,44,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width={64} height={64} viewBox="0 0 48 48">
            {p.icon}
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.15 }}>{p.label}</div>
          <div style={{ fontSize: 32, fontWeight: 500, color: C.muted, marginTop: 4 }}>{p.sub}</div>
        </div>
      </Row>
    ))}
  </Scene>
);

/* ---------- À qui s'adresse ce guide ---------- */
const AUDIENCE = [
  "Entrepreneurs & commerçants",
  "Créateurs de contenus",
  "Community managers",
  "Marketing & communication",
  "Formateurs & enseignants",
  "Débutants curieux d’IA",
];

export const Audience: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Scene dur={SCENES.audience.dur}>
      <Pop delay={0} style={{ ...TITLE, marginBottom: 50 }}>
        Ce guide est <span style={{ color: C.yellow }}>pour toi</span> si tu es…
      </Pop>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 26,
          width: 940,
        }}
      >
        {AUDIENCE.map((a, i) => {
          const s = spring({ frame: frame - 14 - i * 9, fps, config: { damping: 11 } });
          return (
            <div
              key={a}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                padding: "30px 24px",
                borderRadius: 28,
                textAlign: "left",
                background: "rgba(255,255,255,0.07)",
                border: "2px solid rgba(60,200,255,0.30)",
                transform: `scale(${s})`,
                opacity: s,
                fontSize: 36,
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              <Check size={50} color={C.cyan} />
              {a}
            </div>
          );
        })}
      </div>
      <Pop delay={80} from="scale" style={{ marginTop: 60, fontSize: 46, fontWeight: 800 }}>
        <Pill color={C.yellow} rotate={-1.5}>
          Aucune expérience requise !
        </Pill>
      </Pop>
    </Scene>
  );
};

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
  const strike = interpolate(frame, [30, 42], [0, 108], { ...clamp, easing: Easing.out(Easing.quad) });
  const count = Math.round(
    interpolate(frame, [44, 80], [25000, 10000], { ...clamp, easing: Easing.out(Easing.cubic) }) / 100,
  ) * 100;
  const pop = spring({ frame: frame - 78, fps, config: { damping: 8, stiffness: 200 } });
  const badge = spring({ frame: frame - 88, fps, config: { damping: 9 } });
  return (
    <Scene dur={SCENES.price.dur}>
      <Pop delay={0}>
        <Pill color={C.red} textColor={C.white} rotate={0} style={{ fontSize: 40, fontWeight: 800 }}>
          PRIX DE LANCEMENT
        </Pill>
      </Pop>
      <Pop delay={10} style={{ position: "relative", marginTop: 70 }}>
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
            opacity: interpolate(frame, [40, 48], [0, 1], clamp),
            transform: `scale(${1 + pop * 0.08 - (frame > 78 ? 0.08 : 0)})`,
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
            opacity: interpolate(frame, [40, 48], [0, 1], clamp),
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
      <Pop delay={96} style={{ fontSize: 46, fontWeight: 700, marginTop: 70 }}>
        Offre valable jusqu’au <span style={{ color: C.yellow }}>31 décembre</span>
      </Pop>
      <Pop delay={108} style={{ fontSize: 40, fontWeight: 500, color: C.muted, marginTop: 20 }}>
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
        Passe de l’idée
      </Pop>
      <Pop delay={8} style={{ ...TITLE, fontSize: 92, color: C.yellow }}>
        à l’animation !
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
          J’achète mon guide →
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

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

const H1: React.CSSProperties = {
  fontSize: 104,
  fontWeight: 900,
  lineHeight: 1.08,
  letterSpacing: -2,
};
const H2: React.CSSProperties = { fontSize: 64, fontWeight: 800, lineHeight: 1.15 };
const SUB: React.CSSProperties = {
  fontSize: 48,
  fontWeight: 500,
  lineHeight: 1.3,
  color: C.muted,
};

/* 1. HOOK */
export const Hook: React.FC = () => (
  <Scene dur={SCENES.hook.dur}>
    <Pop delay={4} style={{ ...H2, color: C.muted }}>
      Et si ta prochaine
    </Pop>
    <Pop delay={12} style={{ ...H1, marginTop: 10 }}>
      vidéo animée
    </Pop>
    <Pop delay={22} style={{ ...H2, marginTop: 24 }}>
      se créait avec
    </Pop>
    <Pop delay={34} from="scale" style={{ ...H1, fontSize: 92, marginTop: 30, whiteSpace: "nowrap" }}>
      <Pill color={C.yellow}>un simple prompt ?</Pill>
    </Pop>
  </Scene>
);

/* 2. PROBLEM — strike-through list */
const Struck: React.FC<{ delay: number; text: string }> = ({ delay, text }) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [delay + 14, delay + 24], [0, 104], {
    ...clamp,
    easing: Easing.out(Easing.quad),
  });
  return (
    <Pop delay={delay} style={{ marginTop: 34 }}>
      <span
        style={{
          position: "relative",
          display: "inline-block",
          fontSize: 66,
          fontWeight: 700,
          color: frame > delay + 20 ? "rgba(255,255,255,0.55)" : C.white,
        }}
      >
        {text}
        <span
          style={{
            position: "absolute",
            left: "-2%",
            top: "52%",
            height: 10,
            width: `${w}%`,
            background: C.red,
            borderRadius: 6,
            transform: "rotate(-3deg)",
            boxShadow: `0 0 18px ${C.red}`,
          }}
        />
      </span>
    </Pop>
  );
};

export const Problem: React.FC = () => (
  <Scene dur={SCENES.problem.dur}>
    <Pop delay={2} style={{ ...H1, marginBottom: 30 }}>
      Plus besoin de
    </Pop>
    <Struck delay={10} text="After Effects" />
    <Struck delay={30} text="Premiere Pro" />
    <Struck delay={50} text="logiciels complexes" />
    <Pop delay={78} from="scale" style={{ ...H2, marginTop: 70, color: C.yellow }}>
      Place à l’IA.
    </Pop>
  </Scene>
);

/* 3. REVEAL — big "VIBE MOTION DESIGN" */
const BounceWord: React.FC<{ word: string; delay: number; color: string }> = ({
  word,
  delay,
  color,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {word.split("").map((ch, i) => {
        const s = spring({
          frame: frame - delay - i * 2,
          fps,
          config: { damping: 9, stiffness: 180 },
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontSize: 168,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -4,
              color,
              opacity: Math.min(1, s * 2),
              transform: `translateY(${(1 - s) * 140}px) rotate(${(1 - s) * 18}deg)`,
              textShadow: `0 10px 40px ${color}55`,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

export const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const shine = interpolate(frame, [30, 70], [-120, 220], clamp);
  return (
    <Scene dur={SCENES.reveal.dur}>
      <Pop delay={0} style={{ ...SUB, color: C.white, fontWeight: 700 }}>
        Bienvenue dans le
      </Pop>
      <div
        style={{
          marginTop: 30,
          WebkitMaskImage: "none",
          position: "relative",
        }}
      >
        <BounceWord word="VIBE" delay={6} color={C.white} />
        <BounceWord word="MOTION" delay={14} color={C.yellow} />
        <BounceWord word="DESIGN" delay={24} color={C.white} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(105deg, transparent ${shine - 20}%, rgba(255,255,255,0.35) ${shine}%, transparent ${shine + 20}%)`,
            mixBlendMode: "overlay",
          }}
        />
      </div>
      <Pop delay={48} style={{ ...H2, marginTop: 70 }}>
        Tu décris.
      </Pop>
      <Pop delay={58} style={{ ...H2, marginTop: 8 }}>
        <span style={{ color: "#FF8A3D" }}>✳ Claude Code</span> anime.
      </Pop>
    </Scene>
  );
};

/* 4. DEMO — fake terminal */
const PROMPT =
  "Crée un vibe motion design de 15 s pour présenter mon produit, avec textes animés et transitions.";
const STEPS = [
  "Script & storyboard générés",
  "6 scènes animées créées",
  "Transitions & effets ajoutés",
  "Vidéo exportée : promo.mp4",
];

export const Demo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const win = spring({ frame: frame - 2, fps, config: { damping: 14 } });
  const typed = Math.floor(interpolate(frame, [16, 76], [0, PROMPT.length], clamp));
  const cursorOn = Math.floor(frame / 8) % 2 === 0;
  const stepStart = 86;
  const progress = interpolate(frame, [stepStart, stepStart + 72], [0, 100], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  return (
    <Scene dur={SCENES.demo.dur}>
      <Pop delay={0} style={{ ...H2, marginBottom: 14 }}>
        Tu pilotes. <span style={{ color: "#FF8A3D" }}>Claude Code</span> produit.
      </Pop>
      <Pop delay={6} style={{ ...SUB, fontSize: 40, marginBottom: 46 }}>
        De vraies animations, pas des diaporamas.
      </Pop>
      <div
        style={{
          width: 940,
          borderRadius: 30,
          background: "rgba(8,14,48,0.92)",
          border: "2px solid rgba(60,200,255,0.35)",
          boxShadow: "0 40px 120px rgba(0,0,0,0.6), 0 0 60px rgba(30,75,255,0.35)",
          transform: `translateY(${(1 - win) * 200}px) scale(${0.85 + 0.15 * win})`,
          opacity: win,
          textAlign: "left",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "22px 30px",
            background: "rgba(255,255,255,0.05)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <div key={c} style={{ width: 22, height: 22, borderRadius: 11, background: c }} />
          ))}
          <div style={{ marginLeft: 20, fontSize: 34, fontWeight: 700 }}>
            <span style={{ color: "#FF8A3D" }}>✳</span> Claude Code
          </div>
        </div>
        <div style={{ padding: "34px 40px 44px", fontSize: 42, lineHeight: 1.45 }}>
          <div style={{ color: "#FF5FD2", fontWeight: 700 }}>&gt; Prompt</div>
          <div style={{ minHeight: 250, fontWeight: 500 }}>
            {PROMPT.slice(0, typed)}
            <span style={{ opacity: cursorOn ? 1 : 0, color: C.cyan }}>▌</span>
          </div>
          <div style={{ marginTop: 16 }}>
            {STEPS.map((s, i) => {
              const d = stepStart + i * 18;
              const o = interpolate(frame, [d, d + 8], [0, 1], clamp);
              return (
                <div
                  key={s}
                  style={{
                    opacity: o,
                    transform: `translateX(${(1 - o) * -30}px)`,
                    fontSize: 40,
                    fontWeight: 700,
                    marginTop: 8,
                  }}
                >
                  <span style={{ color: "#28C840" }}>✓</span> {s}
                </div>
              );
            })}
          </div>
          <div
            style={{
              marginTop: 34,
              height: 18,
              borderRadius: 9,
              background: "rgba(255,255,255,0.1)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${C.blue}, ${C.cyan}, #FF5FD2)`,
                boxShadow: `0 0 20px ${C.cyan}`,
              }}
            />
          </div>
        </div>
      </div>
    </Scene>
  );
};

/* 5. BOOK REVEAL */
export const Book: React.FC<{ dur?: number; small?: boolean }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 8, fps, config: { damping: 13, mass: 1.2 } });
  const float = Math.sin(frame / 20) * 14;
  const rot = interpolate(s, [0, 1], [-70, -12]) + Math.sin(frame / 35) * 4;
  return (
    <Scene dur={SCENES.book.dur}>
      <Pop delay={0} style={{ marginBottom: 30 }}>
        <Pill color={C.blue} textColor={C.white} rotate={0} style={{ fontSize: 42, fontWeight: 800 }}>
          NOUVEL EBOOK
        </Pill>
      </Pop>
      <div style={{ perspective: 1600, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "55%",
            width: 700,
            height: 700,
            transform: "translate(-50%,-50%)",
            background: `radial-gradient(circle, rgba(60,200,255,${0.45 * s}) 0%, transparent 65%)`,
          }}
        />
        <Img
          src={staticFile("book.png")}
          style={{
            width: 600,
            transform: `translateY(${(1 - s) * 500 + float}px) rotateY(${rot}deg) scale(${0.6 + 0.4 * s})`,
            opacity: Math.min(1, s * 2),
            WebkitMaskImage:
              "radial-gradient(ellipse 58% 56% at 50% 50%, #000 82%, transparent 100%)",
            filter: "drop-shadow(0 50px 60px rgba(0,0,0,0.6))",
          }}
        />
      </div>
      <Pop delay={38} style={{ fontSize: 62, fontWeight: 800, marginTop: 50 }}>
        Réaliser un
      </Pop>
      <Pop delay={44} from="scale" style={{ fontSize: 70, fontWeight: 900, marginTop: 10, whiteSpace: "nowrap" }}>
        <Pill color={C.yellow}>vibe motion design</Pill>
      </Pop>
      <Pop delay={52} style={{ fontSize: 56, fontWeight: 800, marginTop: 22, whiteSpace: "nowrap" }}>
        <Pill color={C.red} textColor={C.white} rotate={1} style={{ padding: "2px 24px 8px" }}>pas à pas</Pill>{" "}
        avec <span style={{ color: "#FF8A3D" }}>✳</span> Claude Code
      </Pop>
    </Scene>
  );
};


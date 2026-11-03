import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { clamp, easeOut, pop } from "../anim";
import { C, F } from "../theme";
import { Icon, IconName } from "./Icons";

/** Round icon badge (pastel disc + line icon) */
export const IconBadge: React.FC<{ name: IconName; size: number; bg: string; color?: string; delay?: number }> = ({ name, size, bg, color = C.navy, delay = 0 }) => {
  const frame = useCurrentFrame();
  const p = pop(frame, delay, 11, 0.6);
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", scale: String(p), flexShrink: 0 }}>
      <Icon name={name} size={size * 0.52} color={color} stroke={2.2} delay={delay + 4} />
    </div>
  );
};

/** Chat bubble used in UI mock-ups. No third-party logos: the assistant is a neutral "sparkle" avatar. */
export const Bubble: React.FC<{
  from: "user" | "ai";
  size: number;
  delay: number;
  children: React.ReactNode;
  typing?: number; // frames of "typing dots" before text
  maxWidth: number;
}> = ({ from, size, delay, children, typing = 0, maxWidth }) => {
  const frame = useCurrentFrame();
  const p = pop(frame, delay, 14, 0.7);
  const showText = frame >= delay + typing;
  const user = from === "user";
  return (
    <div style={{ display: "flex", justifyContent: user ? "flex-end" : "flex-start", gap: size * 0.5, alignItems: "flex-end", opacity: interpolate(frame, [delay, delay + 5], [0, 1], clamp), translate: `0px ${(1 - p) * 30}px`, scale: String(0.92 + 0.08 * p), transformOrigin: user ? "100% 100%" : "0% 100%" }}>
      {!user && (
        <div style={{ width: size * 1.9, height: size * 1.9, borderRadius: "50%", background: `linear-gradient(135deg, ${C.blue}, #4F7BFF)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="sparkle" size={size * 1.1} color="#fff" stroke={2} drawFrames={1} />
        </div>
      )}
      <div
        style={{
          maxWidth,
          background: user ? C.blue : "#FFFFFF",
          color: user ? "#fff" : C.navy,
          fontFamily: F.body,
          fontWeight: 500,
          fontSize: size,
          lineHeight: 1.35,
          padding: `${size * 0.6}px ${size * 0.8}px`,
          borderRadius: size * 0.9,
          borderBottomRightRadius: user ? size * 0.2 : size * 0.9,
          borderBottomLeftRadius: user ? size * 0.9 : size * 0.2,
          boxShadow: "0 8px 24px rgba(11,27,58,0.12)",
        }}
      >
        {showText ? (
          children
        ) : (
          <div style={{ display: "flex", gap: size * 0.3, padding: `${size * 0.25}px 0` }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: size * 0.4, height: size * 0.4, borderRadius: "50%", background: user ? "#fff" : C.muted, opacity: 0.35 + 0.65 * Math.abs(Math.sin((frame - delay) / 5 - i * 0.8)) }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/** Text that types out character by character */
export const Typewriter: React.FC<{ text: string; delay: number; cps?: number; caret?: boolean }> = ({ text, delay, cps = 1.4, caret = true }) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.floor((frame - delay) * cps));
  const done = n >= text.length;
  return (
    <span>
      {text.slice(0, n)}
      {caret && !done && <span style={{ opacity: Math.floor(frame / 8) % 2 ? 1 : 0.2 }}>|</span>}
    </span>
  );
};

/** Rounded photo card with parallax inside the frame */
export const PhotoCard: React.FC<{ src: string; width: number; height: number; drift?: number; radius?: number; border?: string; position?: string }> = ({ src, width, height, drift = 0, radius = 36, border, position = "50% 30%" }) => (
  <div style={{ width, height, borderRadius: radius, overflow: "hidden", position: "relative", boxShadow: "0 30px 70px rgba(11,27,58,0.28)", border }}>
    <Img src={staticFile(src)} style={{ position: "absolute", left: -20, top: -20, width: width + 40, height: height + 40, objectFit: "cover", objectPosition: position, scale: String(1.04 + drift * 0.04), translate: `0px ${drift * -16}px` }} />
  </div>
);

/** Primary CTA button with shine sweep and optional press state */
export const CtaButton: React.FC<{ label: string; size: number; shine: number; press: number; icon?: IconName }> = ({ label, size, shine, press, icon = "cart" }) => (
  <div
    style={{
      position: "relative",
      overflow: "hidden",
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.5,
      background: C.yellow,
      color: C.navy,
      fontFamily: F.display,
      fontWeight: 900,
      fontSize: size,
      padding: `${size * 0.62}px ${size * 1.1}px ${size * 0.62}px ${size * 0.62}px`,
      borderRadius: size * 2,
      boxShadow: `0 ${14 - press * 10}px 0 #C98F00, 0 ${30 - press * 16}px 50px rgba(247,183,24,0.45)`,
      translate: `0px ${press * 10}px`,
      whiteSpace: "nowrap",
    }}
  >
    <div style={{ width: size * 1.7, height: size * 1.7, borderRadius: "50%", background: C.navy, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon name={icon} size={size * 0.95} color={C.yellow} stroke={2.4} drawFrames={1} />
    </div>
    {label}
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(100deg, rgba(255,255,255,0) ${shine * 160 - 50}%, rgba(255,255,255,0.65) ${shine * 160 - 35}%, rgba(255,255,255,0) ${shine * 160 - 20}%)` }} />
  </div>
);

export const progress = (frame: number, a: number, b: number) => interpolate(frame, [a, b], [0, 1], { ...clamp, easing: easeOut });

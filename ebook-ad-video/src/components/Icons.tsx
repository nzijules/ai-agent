import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

/**
 * Line icons drawn with an animated stroke (stroke-dashoffset), 24x24 viewBox.
 * `delay` = frame (relative to the parent Sequence) at which the drawing starts.
 */
export type IconName =
  | "bulb" | "brain" | "cards" | "compass" | "growth" | "clock" | "question" | "book"
  | "copy" | "check" | "x" | "shield" | "download" | "devices" | "lock" | "chat" | "cart"
  | "sparkle" | "target" | "users" | "file" | "arrow" | "spark4" | "phone" | "link"
  | "coins" | "calendar" | "home" | "moon";

const PATHS: Record<IconName, string[]> = {
  bulb: ["M9 18h6", "M10 21h4", "M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"],
  brain: ["M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1z", "M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1", "M12 9h-2", "M12 14h-3", "M14 11h2"],
  cards: ["M4 7h12v13H4z", "M8 4h12v13", "M7 11h6", "M7 15h4"],
  compass: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M15.5 8.5l-2 5-5 2 2-5z"],
  growth: ["M4 20h16", "M6 16v-3", "M10 16v-6", "M14 16V8", "M18 16V5", "M5 10l5-4 4 2 5-4"],
  clock: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M12 7v5l3 2"],
  question: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6", "M12 17h.01"],
  book: ["M3 5.5C5.5 4 8.5 4 12 6c3.5-2 6.5-2 9-.5V19c-2.5-1.5-5.5-1.5-9 .5-3.5-2-6.5-2-9-.5z", "M12 6v13.5"],
  copy: ["M9 9h11v11H9z", "M5 15H4V4h11v1"],
  check: ["M5 12.5l4.5 4.5L19 7.5"],
  x: ["M6 6l12 12", "M18 6L6 18"],
  shield: ["M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z", "M8.5 12l2.5 2.5 4.5-5"],
  download: ["M12 4v11", "M7 10l5 5 5-5", "M5 20h14"],
  devices: ["M3 5h13v9H3z", "M1 17h17", "M18 9h4v11h-4z"],
  lock: ["M6 11h12v9H6z", "M8.5 11V8a3.5 3.5 0 0 1 7 0v3", "M12 15v2"],
  chat: ["M4 5h16v11H9l-5 4z", "M8 9.5h8", "M8 12.5h5"],
  cart: ["M3 4h2l2.4 11h10.2L20 7H6.2", "M9 20h.01", "M17 20h.01"],
  sparkle: ["M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z", "M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z"],
  target: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z", "M12 12l7-7", "M16 5h3v3"],
  users: ["M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z", "M2.5 20c.5-3.5 3.2-6 6.5-6s6 2.5 6.5 6", "M16 4.3a3.5 3.5 0 0 1 0 6.4", "M18 14.4c2 .8 3.3 2.9 3.5 5.6"],
  file: ["M6 3h8l4 4v14H6z", "M14 3v4h4", "M9 12h6", "M9 16h6"],
  arrow: ["M5 12h14", "M13 6l6 6-6 6"],
  spark4: ["M12 2v6", "M12 16v6", "M2 12h6", "M16 12h6"],
  phone: ["M7 2h10v20H7z", "M11 18h2"],
  coins: ["M5 7a7 3 0 1 0 14 0a7 3 0 1 0 -14 0", "M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7", "M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"],
  calendar: ["M4 6h16v14H4z", "M4 10h16", "M8 3v5", "M16 3v5"],
  home: ["M3 11l9-7 9 7", "M5 10v10h14V10", "M10 20v-6h4v6"],
  moon: ["M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"],
  link: ["M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1", "M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"],
};

export const Icon: React.FC<{
  name: IconName;
  size: number;
  color: string;
  stroke?: number;
  delay?: number;
  drawFrames?: number;
  style?: React.CSSProperties;
}> = ({ name, size, color, stroke = 2, delay = 0, drawFrames = 22, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + drawFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      {PATHS[name].map((d, i) => (
        <path
          key={i}
          d={d}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - Math.min(1, Math.max(0, p * PATHS[name].length - i * 0.6))}
        />
      ))}
    </svg>
  );
};

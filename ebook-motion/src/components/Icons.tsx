import React from "react";
import { C } from "../theme";

type P = { size?: number; color?: string };

export const CameraIcon: React.FC<P> = ({ size = 120, color = C.white }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 10l5-3v10l-5-3" />
    <rect x="2" y="6" width="13" height="12" rx="2" />
  </svg>
);
export const PaletteIcon: React.FC<P> = ({ size = 120, color = C.white }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a9 9 0 100 18c1.1 0 1.6-.8 1.6-1.6 0-.5-.2-.8-.5-1.2-.3-.3-.5-.7-.5-1.2 0-.9.7-1.6 1.6-1.6H16a5 5 0 005-5c0-4-4-7.4-9-7.4z" />
    <circle cx="7.5" cy="11" r="1.2" fill={color} />
    <circle cx="10" cy="7" r="1.2" fill={color} />
    <circle cx="15" cy="7.5" r="1.2" fill={color} />
  </svg>
);
export const CodeIcon: React.FC<P> = ({ size = 120, color = C.white }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 6l-6 6 6 6M16 6l6 6-6 6M14 4l-4 16" />
  </svg>
);
export const FaceIcon: React.FC<P> = ({ size = 200, color = C.white }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.4} strokeLinecap="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
  </svg>
);
export const Check: React.FC<P> = ({ size = 40, color = C.green }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12.5l5 5L20 6.5" />
  </svg>
);
export const BellIcon: React.FC<P> = ({ size = 40, color = C.white }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 1112 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 004 0" />
  </svg>
);
export const PlayIcon: React.FC<P> = ({ size = 60, color = C.white }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M7 4.5v15l13-7.5z" />
  </svg>
);
export const ArrowDown: React.FC<P> = ({ size = 60, color = C.white }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4v15M5 12l7 7 7-7" />
  </svg>
);

/** Red cross that draws itself (progress 0..1). */
export const StrikeX: React.FC<{ progress: number; size: number }> = ({ progress, size }) => {
  const len = 34;
  const a = Math.min(1, progress * 2);
  const b = Math.max(0, progress * 2 - 1);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: "absolute", inset: 0 }}>
      <path d="M2 2L22 22" stroke={C.red} strokeWidth={2.6} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - a)} />
      <path d="M22 2L2 22" stroke={C.red} strokeWidth={2.6} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - b)} />
    </svg>
  );
};

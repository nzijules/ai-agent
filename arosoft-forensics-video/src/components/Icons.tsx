import React from "react";
import { C } from "../theme";

type P = { size?: number; color?: string; stroke?: number; style?: React.CSSProperties };

const Svg: React.FC<P & { children: React.ReactNode }> = ({ size = 64, color = C.cyan, stroke = 2.4, style, children }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {children}
  </svg>
);

export const IconPhone: React.FC<P> = (p) => (
  <Svg {...p}><rect x="14" y="4" width="20" height="40" rx="4" /><path d="M21 9h6" /><circle cx="24" cy="38" r="1.2" /></Svg>
);
export const IconBackup: React.FC<P> = (p) => (
  <Svg {...p}><rect x="6" y="8" width="36" height="24" rx="3" /><path d="M2 38h44" /><path d="M24 14v12M19 21l5 5 5-5" /></Svg>
);
export const IconCloud: React.FC<P> = (p) => (
  <Svg {...p}><path d="M14 36h20a9 9 0 0 0 1-17.9A12 12 0 0 0 12 20a8 8 0 0 0 2 16z" /><path d="M20 28l4-4 4 4M24 24v8" /></Svg>
);
export const IconMeta: React.FC<P> = (p) => (
  <Svg {...p}><path d="M10 6h20l8 8v28H10z" /><path d="M30 6v8h8" /><path d="M16 22h16M16 28h16M16 34h10" /></Svg>
);
export const IconArtifact: React.FC<P> = (p) => (
  <Svg {...p}><ellipse cx="24" cy="10" rx="14" ry="5" /><path d="M10 10v28c0 2.8 6.3 5 14 5s14-2.2 14-5V10" /><path d="M10 24c0 2.8 6.3 5 14 5s14-2.2 14-5" /></Svg>
);
export const IconLock: React.FC<P> = (p) => (
  <Svg {...p}><rect x="10" y="21" width="28" height="21" rx="4" /><path d="M16 21v-6a8 8 0 0 1 16 0v6" /><circle cx="24" cy="31" r="2.5" /></Svg>
);
export const IconShield: React.FC<P> = (p) => (
  <Svg {...p}><path d="M24 4l16 6v12c0 10-7 18-16 22C15 40 8 32 8 22V10z" /><path d="M17 24l5 5 9-10" /></Svg>
);
export const IconShare: React.FC<P> = (p) => (
  <Svg {...p}><circle cx="36" cy="10" r="5" /><circle cx="12" cy="24" r="5" /><circle cx="36" cy="38" r="5" /><path d="M16.5 21.5l15-9M16.5 26.5l15 9" /></Svg>
);
export const IconKey: React.FC<P> = (p) => (
  <Svg {...p}><circle cx="15" cy="24" r="8" /><path d="M23 24h20M37 24v7M31 24v5" /></Svg>
);
export const IconScale: React.FC<P> = (p) => (
  <Svg {...p}><path d="M24 6v36M14 42h20M8 12h32" /><path d="M8 12l-5 12a6 6 0 0 0 10 0zM40 12l-5 12a6 6 0 0 0 10 0z" /></Svg>
);
export const IconHash: React.FC<P> = (p) => (
  <Svg {...p}><path d="M18 6l-4 36M34 6l-4 36M8 17h34M6 31h34" /></Svg>
);
export const IconSearch: React.FC<P> = (p) => (
  <Svg {...p}><circle cx="21" cy="21" r="13" /><path d="M31 31l11 11" /></Svg>
);
export const IconUpdate: React.FC<P> = (p) => (
  <Svg {...p}><path d="M40 24a16 16 0 1 1-4.7-11.3" /><path d="M40 6v8h-8" /></Svg>
);
export const IconCheck: React.FC<P> = (p) => (
  <Svg {...p}><path d="M10 25l9 9 19-20" /></Svg>
);
export const IconWarn: React.FC<P> = (p) => (
  <Svg {...p}><path d="M24 5l21 37H3z" /><path d="M24 19v11M24 36v.5" /></Svg>
);
export const IconTrash: React.FC<P> = (p) => (
  <Svg {...p}><path d="M8 12h32M18 12V7h12v5M12 12l2 30h20l2-30" /></Svg>
);

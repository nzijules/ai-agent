import React from "react";
import { C } from "../theme";

/**
 * Cadenas vectoriel « métal + liseré lumineux ».
 * `closed` 0→1 : l'anse descend et se verrouille. `alert` 0→1 : bascule orange.
 */
export const Padlock: React.FC<{ width?: number; closed: number; alert?: number; glow?: number }> = ({ width = 360, closed, alert = 0, glow = 1 }) => {
  const lift = (1 - closed) * 70;
  const edge = alert > 0.5 ? C.orange : C.cyan;
  return (
    <svg viewBox="0 0 200 240" width={width} style={{ overflow: "visible", filter: `drop-shadow(0 0 ${24 * glow}px ${edge}88)` }}>
      <defs>
        <linearGradient id="lock-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2C3B52" />
          <stop offset="50%" stopColor="#121B2A" />
          <stop offset="100%" stopColor="#1F2C40" />
        </linearGradient>
        <linearGradient id="lock-shackle" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7C8BA3" />
          <stop offset="50%" stopColor="#DDE6F2" />
          <stop offset="100%" stopColor="#5D6B82" />
        </linearGradient>
      </defs>
      <g transform={`translate(0 ${-lift}) rotate(${(1 - closed) * -8} 150 110)`}>
        <path d="M50 110 V70 a50 50 0 0 1 100 0 V110" fill="none" stroke="url(#lock-shackle)" strokeWidth={20} strokeLinecap="round" />
      </g>
      <rect x="20" y="100" width="160" height="130" rx="22" fill="url(#lock-body)" stroke={edge} strokeWidth={3} />
      <rect x="30" y="110" width="140" height="110" rx="16" fill="none" stroke={`${edge}44`} strokeWidth={1.5} />
      <circle cx="100" cy="155" r="14" fill="#05080E" stroke={edge} strokeWidth={3} />
      <rect x="95" y="160" width="10" height="34" rx="4" fill="#05080E" stroke={edge} strokeWidth={3} />
    </svg>
  );
};

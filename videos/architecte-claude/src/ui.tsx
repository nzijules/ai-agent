import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {body, C, display, FPS, t01} from './theme';

/* ---------- Fond : plan d'architecte discret ---------- */
const Grid: React.FC<{dark: boolean}> = ({dark}) => {
  const frame = useCurrentFrame();
  const line = dark ? 'rgba(127,178,255,0.07)' : 'rgba(10,91,255,0.07)';
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${line} 2px, transparent 2px), linear-gradient(90deg, ${line} 2px, transparent 2px)`,
        backgroundSize: '90px 90px',
        backgroundPosition: `0px ${-frame * 0.4}px`,
      }}
    />
  );
};

/* ---------- Sous-titres karaoké ---------- */
const chunkText = (text: string, max = 24) => {
  const words = text.replace(/ »/g, '\u00A0»').replace(/« /g, '«\u00A0').replace(/ ([?!:])/g, '\u00A0$1').split(' ');
  const chunks: string[][] = [];
  let cur: string[] = [];
  for (const w of words) {
    const len = [...cur, w].join(' ').length;
    if (cur.length && (len > max || /[.?!:…»]$/.test(cur[cur.length - 1]))) {
      chunks.push(cur);
      cur = [];
    }
    cur.push(w);
  }
  if (cur.length) chunks.push(cur);
  return chunks;
};

export const Captions: React.FC<{text: string; startSec?: number; endSec: number; dark: boolean}> = ({
  text,
  startSec = 0.25,
  endSec,
  dark,
}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const chunks = chunkText(text);
  const total = text.replace(/\s/g, '').length;
  const span = endSec - startSec;
  let acc = 0;
  const timed = chunks.map((words) => {
    const ws = words.map((w) => {
      const s = startSec + (acc / total) * span;
      acc += w.length;
      return {w, s, e: startSec + (acc / total) * span};
    });
    return {ws, s: ws[0].s, e: ws[ws.length - 1].e};
  });
  const idx = timed.findIndex((c, i) => t >= c.s && (i === timed.length - 1 || t < timed[i + 1].s));
  if (idx < 0) return null;
  const c = timed[idx];
  const appear = interpolate(t, [c.s, c.s + 0.12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 80, right: 80, top: 1585, display: 'flex', justifyContent: 'center'}}>
      <div
        style={{
          background: dark ? C.white : C.navy,
          color: dark ? C.navy : C.white,
          fontFamily: display,
          fontWeight: 800,
          fontSize: 54,
          padding: '14px 26px',
          borderRadius: 14,
          textAlign: 'center',
          lineHeight: 1.15,
          opacity: appear,
          translate: `0px ${(1 - appear) * 14}px`,
          boxShadow: '0 10px 30px rgba(19,28,58,0.25)',
        }}
      >
        {c.ws.map(({w, s}, i) => (
          <span key={i} style={{color: t >= s ? (dark ? C.blue : C.yellow) : undefined}}>
            {w}
            {i < c.ws.length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ---------- Mise en page commune d'une scène ---------- */
export const SceneFrame: React.FC<{
  dark?: boolean;
  eyebrow: string;
  line1: string;
  line2: string;
  footer: string;
  vo: string;
  voEnd?: number;
  children: React.ReactNode;
}> = ({dark = false, eyebrow, line1, line2, footer, vo, voEnd, children}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const durSec = durationInFrames / FPS;
  const a1 = t01(frame, 0.1, 0.7);
  const a2 = t01(frame, 0.3, 0.7);
  const ink = dark ? C.white : C.navy;
  const titleSize = Math.min(100, Math.floor(920 / (0.56 * Math.max(line1.length, line2.length))));
  const accent = dark ? C.yellow : C.blue;
  return (
    <AbsoluteFill
      style={{
        background: dark
          ? `radial-gradient(circle at 70% 35%, ${C.navy2} 0%, ${C.navy} 60%)`
          : `radial-gradient(circle at 30% 30%, #FFFFFF 0%, ${C.pale} 65%)`,
        fontFamily: body,
        color: ink,
      }}
    >
      <Grid dark={dark} />
      {/* barre du haut */}
      <div style={{position: 'absolute', top: 100, left: 80, right: 80, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{fontSize: 26, fontWeight: 700, letterSpacing: 6, opacity: 0.7}}>
          CLAUDE CODE <span style={{color: accent}}>·</span> SANS JARGON
        </div>
        <Img src={staticFile(dark ? 'logo-mark-light.png' : 'logo-mark.png')} style={{width: 118, height: 'auto', display: 'block'}} />
      </div>
      {/* titre */}
      <div style={{position: 'absolute', top: 270, left: 80, right: 80}}>
        <div style={{fontSize: 30, fontWeight: 700, letterSpacing: 5, textTransform: 'uppercase', color: accent, opacity: a1}}>
          {eyebrow}
        </div>
        <div style={{fontFamily: display, fontWeight: 800, fontSize: titleSize, lineHeight: 1.05, letterSpacing: -2, marginTop: 18, whiteSpace: 'nowrap'}}>
          <div style={{opacity: a1, translate: `0px ${(1 - a1) * 40}px`}}>{line1}</div>
          <div style={{opacity: a2, translate: `0px ${(1 - a2) * 40}px`, color: accent}}>{line2}</div>
        </div>
      </div>
      {/* illustration */}
      <div style={{position: 'absolute', top: 640, left: 60, right: 60, height: 800}}>{children}</div>
      {/* pied */}
      <div style={{position: 'absolute', top: 1470, left: 80, right: 80}}>
        <div style={{fontSize: 34, opacity: 0.7 * t01(frame, 0.6)}}>{footer}</div>
        <div style={{height: 3, background: dark ? 'rgba(255,255,255,0.18)' : 'rgba(19,28,58,0.14)', marginTop: 18, position: 'relative'}}>
          <div style={{position: 'absolute', left: 0, top: -1, height: 5, background: accent, width: `${(frame / durationInFrames) * 100}%`}} />
        </div>
      </div>
      <Captions text={vo} endSec={voEnd ?? durSec - 0.7} dark={dark} />
    </AbsoluteFill>
  );
};

/* ---------- Personnages ---------- */
export const Awa: React.FC<{blink?: boolean; smile?: number}> = ({blink, smile = 1}) => (
  <g>
    {/* tresses */}
    <path d="M-62 -110 q-22 80 -6 160 M62 -110 q22 80 6 160" stroke={C.hair} strokeWidth={22} fill="none" strokeLinecap="round" />
    {/* corps : veste jaune */}
    <path d="M-120 260 q0 -190 120 -190 q120 0 120 190 z" fill={C.yellow} />
    <path d="M-34 74 l34 70 l34 -70 z" fill={C.white} />
    <path d="M0 144 v116" stroke="#E0A800" strokeWidth={6} />
    {/* tête */}
    <rect x={-22} y={20} width={44} height={50} fill={C.skin} />
    <circle cx={0} cy={-40} r={78} fill={C.skin} />
    <path d="M-80 -50 q80 -110 160 0 q-10 -50 -50 -70 q-70 -25 -110 70 z" fill={C.hair} />
    <circle cx={0} cy={-128} r={34} fill={C.hair} />
    {/* visage */}
    {blink ? (
      <path d="M-36 -34 h18 M18 -34 h18" stroke={C.hair} strokeWidth={6} strokeLinecap="round" />
    ) : (
      <>
        <circle cx={-27} cy={-34} r={8} fill={C.hair} />
        <circle cx={27} cy={-34} r={8} fill={C.hair} />
      </>
    )}
    <path d={`M-22 ${0} q22 ${18 * smile} 44 0`} stroke={C.hair} strokeWidth={6} fill="none" strokeLinecap="round" />
    <circle cx={-80} cy={-20} r={9} fill={C.yellow} />
    <circle cx={80} cy={-20} r={9} fill={C.yellow} />
  </g>
);

export const Architect: React.FC = () => (
  <g>
    <path d="M-110 230 q0 -170 110 -170 q110 0 110 170 z" fill={C.blue} />
    <path d="M-30 64 l30 50 l30 -50 z" fill={C.white} />
    <circle cx={0} cy={-30} r={70} fill={C.skin2} />
    <path d="M-82 -40 q0 -80 82 -80 q82 0 82 80 z" fill={C.yellow} />
    <rect x={-96} y={-46} width={192} height={18} rx={9} fill="#E0A800" />
    <circle cx={-24} cy={-4} r={7} fill={C.hair} />
    <circle cx={24} cy={-4} r={7} fill={C.hair} />
    <path d="M-20 26 q20 14 40 0" stroke={C.hair} strokeWidth={6} fill="none" strokeLinecap="round" />
  </g>
);

/* ---------- Bulle de dialogue ---------- */
export const Bubble: React.FC<{
  text: React.ReactNode;
  progress: number;
  style?: React.CSSProperties;
  dark?: boolean;
  tail?: 'left' | 'right';
}> = ({text, progress, style, dark, tail = 'left'}) => (
  <div
    style={{
      position: 'absolute',
      background: dark ? C.navy : C.white,
      color: dark ? C.white : C.navy,
      fontFamily: display,
      fontWeight: 700,
      fontSize: 46,
      lineHeight: 1.25,
      padding: '26px 34px',
      borderRadius: 30,
      boxShadow: '0 14px 40px rgba(19,28,58,0.18)',
      scale: String(progress),
      opacity: Math.min(1, progress * 2),
      transformOrigin: tail === 'left' ? '10% 100%' : '90% 100%',
      ...style,
    }}
  >
    {text}
    <div
      style={{
        position: 'absolute',
        bottom: -22,
        [tail]: 46,
        width: 0,
        height: 0,
        borderLeft: '22px solid transparent',
        borderRight: '22px solid transparent',
        borderTop: `24px solid ${dark ? C.navy : C.white}`,
      }}
    />
  </div>
);

export const Pill: React.FC<{children: React.ReactNode; p: number; bg?: string; color?: string; style?: React.CSSProperties}> = ({
  children,
  p,
  bg = C.blue,
  color = C.white,
  style,
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 14,
      background: bg,
      color,
      fontFamily: display,
      fontWeight: 700,
      fontSize: 40,
      padding: '16px 30px',
      borderRadius: 999,
      scale: String(p),
      opacity: Math.min(1, p * 2),
      ...style,
    }}
  >
    {children}
  </div>
);

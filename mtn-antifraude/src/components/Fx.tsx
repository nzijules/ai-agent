import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, clamp, easeOut, prog, rnd, sp} from '../lib';

/** Mot/ligne en typographie cinétique : lettres qui arrivent avec flou + ressort. */
export const Kinetic: React.FC<{
  text: string; t: number; at: number; out?: number; size?: number; color?: string; weight?: number;
  mode?: 'slam' | 'rise' | 'track'; stagger?: number; style?: React.CSSProperties; letterSpacing?: number;
}> = ({text, t, at, out, size = 140, color = '#fff', weight = 900, mode = 'rise', stagger = 0.025, style, letterSpacing = 2}) => {
  const outP = out !== undefined ? prog(t, out, 0.3) : 0;
  if (t < at - 0.05) return null;
  const letters = [...text];
  return (
    <div style={{fontFamily: F.display, fontWeight: weight, fontSize: size, color, letterSpacing, lineHeight: 1, whiteSpace: 'pre', display: 'flex', justifyContent: 'center', opacity: 1 - outP, transform: `translateY(${-outP * 30}px)`, ...style}}>
      {letters.map((ch, i) => {
        const s = sp(t, at + i * stagger, mode === 'slam' ? {damping: 11, stiffness: 220} : {damping: 16, stiffness: 150});
        const y = mode === 'rise' ? (1 - s) * size * 0.6 : 0;
        const sc = mode === 'slam' ? 1 + (1 - s) * 1.6 : 1;
        const blur = (1 - clamp(s)) * (mode === 'slam' ? 14 : 8);
        const ls = mode === 'track' ? (1 - s) * 40 : 0;
        return (
          <span key={i} style={{display: 'inline-block', transform: `translateY(${y}px) scale(${sc})`, filter: `blur(${blur}px)`, opacity: clamp(s * 1.5), marginRight: ls}}>
            {ch}
          </span>
        );
      })}
    </div>
  );
};

/** Bandes de glitch numérique (RVB + décalages). */
export const Glitch: React.FC<{i: number; seedT: number; color2?: string}> = ({i, seedT, color2 = '#00E5FF'}) => {
  if (i <= 0.01) return null;
  const fr = Math.floor(seedT * 30);
  const bars = [...Array(10)].map((_, k) => {
    const r = rnd(fr * 13 + k * 7);
    return {y: rnd(fr * 3 + k) * 1080, h: 6 + r * 70, x: (rnd(fr + k * 31) - 0.5) * 260 * i, c: k % 3 === 0 ? C.red : k % 3 === 1 ? color2 : '#fff', o: (0.3 + r * 0.5) * i};
  });
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>
      {bars.map((b, k) => (
        <div key={k} style={{position: 'absolute', left: b.x, top: b.y, width: 1920, height: b.h, background: b.c, opacity: b.o}} />
      ))}
      <div style={{position: 'absolute', inset: 0, background: `repeating-linear-gradient(0deg, rgba(255,255,255,${0.06 * i}) 0 2px, transparent 2px 5px)`}} />
    </AbsoluteFill>
  );
};

/** Décalage chromatique d'un bloc de texte. */
export const RGBSplit: React.FC<{amt: number; children: React.ReactNode; style?: React.CSSProperties}> = ({amt, children, style}) => (
  <div style={{position: 'relative', ...style}}>
    {amt > 0.5 && (
      <>
        <div style={{position: 'absolute', inset: 0, transform: `translate(${-amt}px,0)`, opacity: 0.7, mixBlendMode: 'screen', filter: 'drop-shadow(0 0 0 #f00)'}}>
          <div style={{filter: 'sepia(1) saturate(20) hue-rotate(-50deg)'}}>{children}</div>
        </div>
        <div style={{position: 'absolute', inset: 0, transform: `translate(${amt}px,0)`, opacity: 0.7, mixBlendMode: 'screen'}}>
          <div style={{filter: 'sepia(1) saturate(20) hue-rotate(140deg)'}}>{children}</div>
        </div>
      </>
    )}
    <div style={{position: 'relative'}}>{children}</div>
  </div>
);

export const Vignette: React.FC<{o?: number}> = ({o = 0.55}) => (
  <AbsoluteFill style={{pointerEvents: 'none', background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,${o}) 100%)`}} />
);

/** Halo lumineux qui balaye (light leak). */
export const LightLeak: React.FC<{t: number; at: number; dur?: number; color?: string}> = ({t, at, dur = 1.6, color = '255,214,90'}) => {
  const p = (t - at) / dur;
  if (p < 0 || p > 1) return null;
  const o = Math.sin(p * Math.PI);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen', opacity: o}}>
      <div style={{position: 'absolute', left: -600 + p * 2600, top: -300, width: 900, height: 1700, transform: 'rotate(18deg)', background: `radial-gradient(ellipse at center, rgba(${color},.85), rgba(${color},0) 70%)`, filter: 'blur(40px)'}} />
    </AbsoluteFill>
  );
};

/** Particules flottantes (poussière lumineuse / bokeh). */
export const Bokeh: React.FC<{t: number; n?: number; color?: string; o?: number}> = ({t, n = 18, color = '255,203,5', o = 0.35}) => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    {[...Array(n)].map((_, i) => {
      const x = (rnd(i) * 1920 + t * (10 + rnd(i + 5) * 25)) % 1980 - 30;
      const y = rnd(i + 9) * 1080 + Math.sin(t * 0.6 + i) * 30;
      const r = 8 + rnd(i + 3) * 40;
      return <div key={i} style={{position: 'absolute', left: x, top: y, width: r * 2, height: r * 2, borderRadius: '50%', background: `radial-gradient(circle, rgba(${color},${o}), rgba(${color},0) 70%)`}} />;
    })}
  </AbsoluteFill>
);

/** Petit libellé "chapitre" en bas à gauche. */
export const Tag: React.FC<{t: number; at: number; out: number; text: string; dark?: boolean}> = ({t, at, out, text, dark}) => {
  const p = prog(t, at, 0.5, easeOut) * (1 - prog(t, out, 0.3));
  return (
    <div style={{position: 'absolute', left: 90, top: 80, display: 'flex', alignItems: 'center', gap: 18, opacity: p, transform: `translateX(${(1 - p) * -30}px)`}}>
      <div style={{width: 10, height: 44, background: C.yellow}} />
      <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 26, letterSpacing: 6, color: dark ? C.black : '#fff', textTransform: 'uppercase'}}>{text}</div>
    </div>
  );
};

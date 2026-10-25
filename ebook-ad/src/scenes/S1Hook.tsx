import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, easeInOut, easeOut, sp, SPRING_POP, SPRING_SOFT} from '../anim';
import {KineticText} from '../components/KineticText';
import {SceneWrap} from '../components/SceneWrap';
import {glass} from '../components/ui';
import {adConfig} from '../config';
import {useFormat} from '../format';
import {colors, fonts} from '../theme';

const c = adConfig.hook;
const ROW_START = -6; // la 1re ligne est déjà là à l'image 0 (miniature)
const ROW_STEP = 10;
const PHASE2 = 92; // bascule vers le graphique de progrès
const BANNER = 82; // question finale (voix : « Mais votre enfant progresse-t-il vraiment ? »)

/** Billet de banque stylisé (sans valeur faciale). */
const Bill: React.FC<{w: number; tilt?: number}> = ({w, tilt = 0}) => (
  <div
    style={{
      width: w,
      height: w * 0.45,
      borderRadius: w * 0.04,
      background: 'linear-gradient(135deg, #E9D9B8, #CDB88F)',
      border: '2px solid #A8946A',
      transform: `rotate(${tilt}deg)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 10px rgba(0,0,0,0.35)',
    }}
  >
    <div style={{width: '84%', height: '68%', borderRadius: w * 0.03, border: '2px solid rgba(110,90,50,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.display, fontWeight: 800, fontSize: w * 0.13, color: 'rgba(90,70,30,0.6)', letterSpacing: '0.08em'}}>
      FCFA
    </div>
  </div>
);

/** Registre des mois : chaque mois, une ligne « répétiteur » de plus (aucun montant). */
const Ledger: React.FC<{frame: number; w: number}> = ({frame, w}) => {
  const enter = sp(frame, -14, SPRING_SOFT);
  return (
    <div style={{width: w, borderRadius: 26, overflow: 'hidden', background: 'linear-gradient(180deg, #FBF7EE, #EFE6D2)', boxShadow: '0 30px 60px rgba(0,0,0,0.45)', opacity: enter, transform: `translateY(${(1 - enter) * 50}px) rotate(-2deg)`}}>
      <div style={{background: `linear-gradient(180deg, ${colors.amber}, #F29A2E)`, padding: '14px 22px', fontFamily: fonts.display, fontWeight: 800, fontSize: 28, color: colors.ink}}>Cours de répétition</div>
      <div style={{padding: '8px 22px 14px'}}>
        {c.months.map((m, i) => {
          const p = sp(frame, ROW_START + i * ROW_STEP, SPRING_POP);
          return (
            <div key={m} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 54, borderBottom: i < c.months.length - 1 ? '1.5px solid rgba(0,0,0,0.08)' : 'none', opacity: p, transform: `translateX(${(1 - p) * -40}px)`}}>
              <span style={{fontFamily: fonts.display, fontWeight: 700, fontSize: 25, color: '#2A2A3A', letterSpacing: '0.04em', textTransform: 'uppercase', width: 150}}>{m}</span>
              <Bill w={74} tilt={-6} />
              <span style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 25, color: '#C2410C'}}>FCFA</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Pile de billets qui grandit à chaque mois. */
const BillPile: React.FC<{frame: number}> = ({frame}) => (
  <div style={{position: 'relative', width: 230, height: 300}}>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: -18, height: 40, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,0,0,0.5), transparent 70%)'}} />
    {c.months.map((_, i) => {
      const start = ROW_START + i * ROW_STEP + 4;
      if (frame < start) return null;
      const p = sp(frame, start, {damping: 12, stiffness: 170, mass: 0.7});
      const y = 230 - i * 26;
      return (
        <div key={i} style={{position: 'absolute', left: 10 + (i % 2 ? 8 : -6), top: interpolate(p, [0, 1], [y - 140, y]), opacity: Math.min(1, p * 3)}}>
          <Bill w={210} tilt={i % 2 ? 4 : -3} />
        </div>
      );
    })}
  </div>
);

/** Parent préoccupé (illustration vectorielle). */
export const WorriedParent: React.FC<{frame: number; size: number; variant?: 'mother' | 'father'; start?: number}> = ({frame, size, variant = 'mother', start = -6}) => {
  const enter = sp(frame, start, SPRING_SOFT);
  const brow = 6 + Math.sin(frame / 5) * 2;
  const sweat = interpolate(frame, [start + 40, start + 70], [0, 1], clamp);
  const bubble = sp(frame, start + 50, SPRING_POP);
  const mother = variant === 'mother';
  return (
    <div style={{position: 'relative', width: size, height: size * 1.2, opacity: enter, transform: `translateY(${(1 - enter) * 40}px)`}}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{position: 'absolute', top: size * 0.2}}>
        <circle cx="50" cy="50" r="49" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
        <path d="M14 98 Q18 72 50 70 Q82 72 86 98 Z" fill={mother ? '#E0A030' : colors.indigo} />
        <path d="M42 70 L50 80 L58 70" fill={mother ? '#F5E6C8' : '#F5F7FF'} />
        {mother ? <circle cx="50" cy="20" r="10" fill="#1B140F" /> : null}
        <circle cx="50" cy="44" r="20" fill="#7A4A2E" />
        <path d={mother ? 'M29 46 Q28 22 50 22 Q72 22 71 46 Q66 32 50 31 Q34 32 29 46 Z' : 'M30 40 Q32 22 50 22 Q68 22 70 40 Q62 31 50 31 Q38 31 30 40 Z'} fill="#1B140F" />
        {mother ? (
          <>
            <circle cx="29.5" cy="50" r="2.4" fill={colors.amber} />
            <circle cx="70.5" cy="50" r="2.4" fill={colors.amber} />
          </>
        ) : null}
        <circle cx="42.5" cy="46" r="2.4" fill="#1B140F" />
        <circle cx="57.5" cy="46" r="2.4" fill="#1B140F" />
        <path d={`M37 ${40 - brow * 0.2} L46 ${38 + brow * 0.25}`} stroke="#1B140F" strokeWidth="2.4" strokeLinecap="round" />
        <path d={`M63 ${40 - brow * 0.2} L54 ${38 + brow * 0.25}`} stroke="#1B140F" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M43 57 Q50 52 57 57" fill="none" stroke="#1B140F" strokeWidth="2.4" strokeLinecap="round" />
        <path d={`M69 ${36 + sweat * 10} q3 5 0 7 q-3 -2 0 -7z`} fill="#8FD8FF" opacity={sweat > 0 ? 1 - sweat * 0.3 : 0} />
        {/* main sur la tempe */}
        <path d="M78 40 Q86 52 80 66 L74 64 Q78 52 72 44 Z" fill="#7A4A2E" stroke="#5E3720" strokeWidth="1" />
      </svg>
      <div style={{position: 'absolute', left: -size * 0.1, top: 0, width: size * 0.36, height: size * 0.36, borderRadius: '50%', background: colors.white, color: colors.coral, fontFamily: fonts.display, fontWeight: 800, fontSize: size * 0.26, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${bubble}) rotate(${Math.sin(frame / 6) * 8}deg)`, boxShadow: '0 8px 20px rgba(0,0,0,0.3)'}}>
        ?
      </div>
    </div>
  );
};

/** Graphique « Progrès de votre enfant » : courbe hésitante qui se termine par un point d'interrogation. */
const ProgressChart: React.FC<{frame: number; w: number; h: number}> = ({frame, w, h}) => {
  const enter = sp(frame, PHASE2, SPRING_SOFT);
  const drawP = interpolate(frame, [PHASE2 + 6, PHASE2 + 40], [0, 1], {...clamp, easing: easeInOut});
  const q = sp(frame, PHASE2 + 34, SPRING_POP);
  const u = w / 100;
  const cw = w - 10 * u;
  const ch = h - 26 * u;
  const pts = [0.45, 0.58, 0.36, 0.55, 0.4, 0.52, 0.42];
  const px = (i: number) => cw * 0.04 + (i / (pts.length - 1)) * cw * 0.78;
  const py = (v: number) => ch * 0.95 - v * ch * 0.85;
  const d = pts.map((v, i) => `${i === 0 ? 'M' : 'L'}${px(i)} ${py(v)}`).join(' ');
  return (
    <div style={{...glass, position: 'absolute', left: 0, top: 0, width: w, height: h, borderRadius: 5 * u, padding: 5 * u, boxSizing: 'border-box', opacity: enter, transform: `translateY(${(1 - enter) * 120}px) scale(${0.9 + 0.1 * enter})`}}>
      <div style={{fontFamily: fonts.display, fontWeight: 700, fontSize: 4.6 * u, color: colors.white}}>{c.chartLabel}</div>
      <svg width={cw} height={ch} style={{marginTop: 3 * u, overflow: 'visible'}}>
        {[0.2, 0.4, 0.6, 0.8].map((y) => (
          <line key={y} x1={0} x2={cw} y1={ch * y} y2={ch * y} stroke="rgba(255,255,255,0.08)" strokeWidth={2} />
        ))}
        <line x1={0} y1={ch} x2={cw} y2={ch} stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
        <path d={d} fill="none" stroke={colors.sky} strokeWidth={1.1 * u} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - drawP} />
        {pts.map((v, i) => (
          <circle key={i} cx={px(i)} cy={py(v)} r={1.6 * u} fill={colors.white} opacity={drawP * (pts.length - 1) >= i - 0.01 ? 1 : 0} />
        ))}
      </svg>
      <div style={{position: 'absolute', left: 5 * u, right: 5 * u, bottom: 3.4 * u, display: 'flex', justifyContent: 'space-between', paddingLeft: 2 * u, paddingRight: 16 * u, fontFamily: fonts.body, fontSize: 3 * u, color: colors.muted}}>
        {c.months.map((m) => (
          <span key={m}>{m.slice(0, 4)}.</span>
        ))}
      </div>
      <div style={{position: 'absolute', right: 4 * u, top: h * 0.3, width: 15 * u, height: 15 * u, borderRadius: '50%', background: colors.amber, color: colors.ink, fontFamily: fonts.display, fontWeight: 800, fontSize: 11 * u, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${q * (1 + 0.06 * Math.sin(frame / 5))})`, boxShadow: `0 0 ${6 * u}px ${colors.amber}88`}}>
        ?
      </div>
    </div>
  );
};

/** Plateau 900×560 : dépenses (phase 1) puis graphique de progrès (phase 2). */
const Stage: React.FC<{frame: number}> = ({frame}) => {
  const out = interpolate(frame, [PHASE2 - 4, PHASE2 + 14], [0, 1], {...clamp, easing: easeInOut});
  const arrow = interpolate(frame, [52, 72], [0, 1], {...clamp, easing: easeOut});
  return (
    <div style={{position: 'relative', width: 900, height: 560}}>
      <div style={{position: 'absolute', inset: 0, opacity: 1 - out, transform: `translateY(${-out * 80}px) scale(${1 - 0.15 * out})`, filter: out > 0.01 ? `blur(${out * 8}px)` : undefined}}>
        <div style={{position: 'absolute', left: 0, top: 0}}>
          <Ledger frame={frame} w={470} />
        </div>
        <div style={{position: 'absolute', left: 520, top: 0}}>
          <WorriedParent frame={frame} size={210} />
        </div>
        <svg width={200} height={160} style={{position: 'absolute', left: 430, top: 250, overflow: 'visible'}}>
          <path d="M10 20 Q90 10 120 110" fill="none" stroke={colors.coral} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - arrow} />
          <path d="M98 96 L122 124 L138 92" fill="none" stroke={colors.coral} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" opacity={arrow > 0.9 ? 1 : 0} />
        </svg>
        <div style={{position: 'absolute', left: 600, top: 270}}>
          <BillPile frame={frame} />
        </div>
      </div>
      {frame >= PHASE2 - 2 ? <ProgressChart frame={frame} w={900} h={540} /> : null}
    </div>
  );
};

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const fmt = useFormat();
  const push = interpolate(frame, [0, 180], [1, 1.04]);
  const banner = sp(frame, BANNER, {damping: 13, stiffness: 160});
  const pulse = 1 + 0.015 * Math.sin(Math.max(0, frame - BANNER - 20) / 5);

  return (
    <SceneWrap noEnter>
      <AbsoluteFill style={{transform: `scale(${push})`}}>
        <div style={{position: 'absolute', top: fmt.safeTop, left: fmt.padX, right: fmt.padX, display: 'flex', justifyContent: 'center'}}>
          <KineticText text={c.lineA} size={74} delay={-14} stagger={2} highlight={['répétiteur']} maxWidth={900} />
        </div>
        <div style={{position: 'absolute', top: 450, left: 90}}>
          <Stage frame={frame} />
        </div>
        <div style={{position: 'absolute', top: 1060, left: fmt.padX, right: fmt.padX, display: 'flex', justifyContent: 'center'}}>
          <div
            style={{
              padding: '26px 40px 30px',
              borderRadius: 34,
              background: 'linear-gradient(180deg, #E5383B, #B5172A)',
              border: '3px solid rgba(255,255,255,0.25)',
              boxShadow: '0 24px 60px rgba(181,23,42,0.45)',
              opacity: banner,
              transform: `scale(${(0.6 + 0.4 * banner) * pulse}) rotate(${(1 - banner) * -4}deg)`,
            }}
          >
            <KineticText text={c.lineB} size={64} delay={BANNER + 4} stagger={3} effect="slam" highlight={c.highlight} highlightColor={colors.amber} maxWidth={820} lineHeight={1.12} />
          </div>
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

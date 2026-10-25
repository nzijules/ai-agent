import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {clamp, easeInOut, easeOut, sp, SPRING_POP, SPRING_SOFT} from '../anim';
import {Check} from '../components/Icons';
import {KineticText} from '../components/KineticText';
import {SceneWrap} from '../components/SceneWrap';
import {glass} from '../components/ui';
import {adConfig} from '../config';
import {useFormat} from '../format';
import {colors, fonts} from '../theme';

const c = adConfig.hook;
const MONTH_START = 6;
const MONTH_STEP = 12;
const PHASE2 = 88; // bascule vers le graphique de progrès

/** Calendrier dont les mois défilent ; chaque mois, des séances de répétition sont cochées. */
const Calendar: React.FC<{frame: number; w: number}> = ({frame, w}) => {
  const u = w / 100;
  const idx = Math.max(0, Math.min(c.months.length - 1, Math.floor((frame - MONTH_START) / MONTH_STEP)));
  const local = (frame - MONTH_START) - idx * MONTH_STEP;
  const flip = frame < MONTH_START ? 0 : interpolate(local, [0, 6], [-90, 0], {...clamp, easing: easeOut});
  const enter = sp(frame, -12, SPRING_SOFT);
  const sessions = [0, 1, 2, 3].map((k) => Math.floor(random(`d${idx}-${k}`) * 4) + k * 7 + 1);
  return (
    <div style={{...glass, width: w, borderRadius: 7 * u, overflow: 'hidden', opacity: enter, transform: `translateY(${(1 - enter) * 60}px)`}}>
      <div style={{background: `linear-gradient(180deg, ${colors.amber}, #F29A2E)`, height: 22 * u, display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: 400}}>
        <div style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 12 * u, color: colors.ink, transform: `rotateX(${flip}deg)`, transformOrigin: 'center top'}}>
          {c.months[idx]}
        </div>
      </div>
      <div style={{padding: `${4 * u}px ${5 * u}px ${3 * u}px`, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2.2 * u}}>
        {new Array(28).fill(0).map((_, d) => {
          const on = sessions.includes(d);
          const k = sessions.indexOf(d);
          const pop = on ? sp(frame, MONTH_START + idx * MONTH_STEP + 2 + k * 2, SPRING_POP) : 0;
          return (
            <div
              key={d}
              style={{
                height: 8.5 * u,
                borderRadius: 2 * u,
                background: on ? interpolateColor(pop) : 'rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {on ? <Check size={6 * u} p={pop} color={colors.ink} /> : null}
            </div>
          );
        })}
      </div>
      <div style={{margin: `0 ${5 * u}px ${5 * u}px`, padding: `${2.4 * u}px ${3 * u}px`, borderRadius: 3 * u, background: 'rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: fonts.body, fontSize: 5.2 * u, color: colors.white, fontWeight: 600}}>
        <span>{c.ledgerLabel}</span>
        <span style={{color: colors.amber, fontWeight: 800}}>×{idx + 1}</span>
      </div>
    </div>
  );
};

const interpolateColor = (p: number) => (p > 0.5 ? colors.mint : 'rgba(47,214,181,0.4)');

/** Pile de pièces stylisées (sans montant) qui grandit à chaque mois. */
const CoinStack: React.FC<{frame: number; w: number; baseY: number}> = ({frame, w, baseY}) => {
  const coinH = w * 0.2;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: w, height: baseY + coinH}}>
      {/* ombre */}
      <div style={{position: 'absolute', left: w * 0.05, width: w * 0.9, top: baseY + coinH * 0.55, height: coinH * 0.6, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,0,0,0.5), transparent 70%)'}} />
      {c.months.map((_, i) => {
        const start = MONTH_START + i * MONTH_STEP + 3;
        const p = sp(frame, start, {damping: 11, stiffness: 160, mass: 0.7});
        if (frame < start) return null;
        const y = baseY - i * coinH * 0.42;
        return (
          <div key={i} style={{position: 'absolute', left: (i % 2 ? 0.03 : -0.02) * w, top: interpolate(p, [0, 1], [y - 160, y]), width: w, height: coinH, opacity: interpolate(frame - start, [0, 4], [0, 1], clamp)}}>
            <div style={{position: 'absolute', inset: 0, top: coinH * 0.22, borderRadius: '50%', background: 'linear-gradient(90deg, #B8741E, #E9A63E 50%, #B8741E)'}} />
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: coinH * 0.78,
                borderRadius: '50%',
                background: 'radial-gradient(ellipse at 40% 35%, #FFE3A3, #FFC14F 60%, #E9A63E)',
                border: '2px solid #C98424',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: fonts.display,
                fontWeight: 800,
                fontSize: coinH * 0.38,
                color: '#8A5410',
                letterSpacing: '0.04em',
              }}
            >
              FCFA
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Parent préoccupé (illustration vectorielle simple). */
const WorriedParent: React.FC<{frame: number; size: number}> = ({frame, size}) => {
  const enter = sp(frame, -4, SPRING_SOFT);
  const brow = 6 + Math.sin(frame / 5) * 2;
  const sweat = interpolate(frame, [40, 70], [0, 1], clamp);
  const bubble = sp(frame, 52, SPRING_POP);
  return (
    <div style={{position: 'relative', width: size, height: size * 1.25, opacity: enter, transform: `translateY(${(1 - enter) * 40}px)`}}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{position: 'absolute', top: size * 0.25}}>
        <circle cx="50" cy="50" r="49" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
        <path d="M14 98 Q18 72 50 70 Q82 72 86 98 Z" fill={colors.indigo} />
        <path d="M42 70 L50 80 L58 70" fill="#F5F7FF" />
        <circle cx="50" cy="44" r="20" fill="#7A4A2E" />
        <path d="M30 40 Q32 22 50 22 Q68 22 70 40 Q62 31 50 31 Q38 31 30 40 Z" fill="#1B140F" />
        <circle cx="42.5" cy="46" r="2.4" fill="#1B140F" />
        <circle cx="57.5" cy="46" r="2.4" fill="#1B140F" />
        <path d={`M37 ${40 - brow * 0.2} L46 ${38 + brow * 0.25}`} stroke="#1B140F" strokeWidth="2.4" strokeLinecap="round" />
        <path d={`M63 ${40 - brow * 0.2} L54 ${38 + brow * 0.25}`} stroke="#1B140F" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M43 57 Q50 52 57 57" fill="none" stroke="#1B140F" strokeWidth="2.4" strokeLinecap="round" />
        <path d={`M69 ${36 + sweat * 10} q3 5 0 7 q-3 -2 0 -7z`} fill="#8FD8FF" opacity={sweat > 0 ? 1 - sweat * 0.3 : 0} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: -size * 0.12,
          top: 0,
          width: size * 0.38,
          height: size * 0.38,
          borderRadius: '50%',
          background: colors.white,
          color: colors.coral,
          fontFamily: fonts.display,
          fontWeight: 800,
          fontSize: size * 0.28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${bubble}) rotate(${Math.sin(frame / 6) * 8}deg)`,
          boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
        }}
      >
        ?
      </div>
    </div>
  );
};

/** Graphique « Progrès de votre enfant » : courbe hésitante qui se termine par un point d'interrogation. */
const ProgressChart: React.FC<{frame: number; w: number; h: number}> = ({frame, w, h}) => {
  const enter = sp(frame, PHASE2, SPRING_SOFT);
  const drawP = interpolate(frame, [PHASE2 + 8, PHASE2 + 44], [0, 1], {...clamp, easing: easeInOut});
  const q = sp(frame, PHASE2 + 40, SPRING_POP);
  const u = w / 100;
  const cw = w - 10 * u; // zone du graphique
  const ch = h - 26 * u;
  const pts = [0.45, 0.58, 0.36, 0.55, 0.4, 0.5];
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
      <div style={{position: 'absolute', left: 5 * u, right: 5 * u, bottom: 3.4 * u, display: 'flex', justifyContent: 'space-between', paddingLeft: 3 * u, paddingRight: 17 * u, fontFamily: fonts.body, fontSize: 3.3 * u, color: colors.muted}}>
        {c.months.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          right: 4 * u,
          top: h * 0.3,
          width: 15 * u,
          height: 15 * u,
          borderRadius: '50%',
          background: colors.amber,
          color: colors.ink,
          fontFamily: fonts.display,
          fontWeight: 800,
          fontSize: 11 * u,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${q * (1 + 0.06 * Math.sin(frame / 5))})`,
          boxShadow: `0 0 ${6 * u}px ${colors.amber}88`,
        }}
      >
        ?
      </div>
    </div>
  );
};

/** Plateau 860×560 : dépenses (phase 1) puis graphique de progrès (phase 2). */
const Stage: React.FC<{frame: number}> = ({frame}) => {
  const out = interpolate(frame, [PHASE2 - 4, PHASE2 + 14], [0, 1], {...clamp, easing: easeInOut});
  return (
    <div style={{position: 'relative', width: 860, height: 560}}>
      <div style={{position: 'absolute', inset: 0, opacity: 1 - out, transform: `translateY(${-out * 80}px) scale(${1 - 0.15 * out})`, filter: out > 0.01 ? `blur(${out * 8}px)` : undefined}}>
        <div style={{position: 'absolute', left: 0, top: 20}}>
          <Calendar frame={frame} w={380} />
        </div>
        <div style={{position: 'absolute', left: 430, top: 40}}>
          <CoinStack frame={frame} w={200} baseY={330} />
        </div>
        <div style={{position: 'absolute', left: 676, top: 90}}>
          <WorriedParent frame={frame} size={180} />
        </div>
      </div>
      {frame >= PHASE2 - 2 ? <ProgressChart frame={frame} w={860} h={540} /> : null}
    </div>
  );
};

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const fmt = useFormat();
  const push = interpolate(frame, [0, 180], [1, 1.04]);
  const lineAOut = interpolate(frame, [PHASE2, PHASE2 + 14], [1, 0.55], clamp);

  if (fmt.vertical) {
    return (
      <SceneWrap noEnter>
        <AbsoluteFill style={{transform: `scale(${push})`}}>
          <div style={{position: 'absolute', top: fmt.safeTop, left: fmt.padX, right: fmt.padX, display: 'flex', justifyContent: 'center', opacity: lineAOut}}>
            <KineticText text={c.lineA} size={70} delay={-14} stagger={2} highlight={['répétiteur']} maxWidth={900} />
          </div>
          <div style={{position: 'absolute', top: 520, left: 110}}>
            <Stage frame={frame} />
          </div>
          <div style={{position: 'absolute', top: 1112, left: fmt.padX, right: fmt.padX, display: 'flex', justifyContent: 'center'}}>
            <KineticText text={c.lineB} size={72} delay={96} stagger={3} effect="slam" highlight={c.highlight} marker markerDelay={124} maxWidth={900} lineHeight={1.1} />
          </div>
        </AbsoluteFill>
      </SceneWrap>
    );
  }

  return (
    <SceneWrap noEnter>
      <AbsoluteFill style={{transform: `scale(${push})`}}>
        <div style={{position: 'absolute', top: 56, left: 70, right: 70, display: 'flex', justifyContent: 'center', opacity: lineAOut}}>
          <KineticText text={c.lineA} size={58} delay={-14} stagger={2} highlight={['répétiteur']} maxWidth={940} />
        </div>
        <div style={{position: 'absolute', top: 205, left: 540 - 430 * 0.74, transform: 'scale(0.74)', transformOrigin: 'top left'}}>
          <Stage frame={frame} />
        </div>
        <div style={{position: 'absolute', top: 640, left: 70, right: 70, display: 'flex', justifyContent: 'center'}}>
          <KineticText text={c.lineB} size={58} delay={96} stagger={3} effect="slam" highlight={c.highlight} marker markerDelay={124} maxWidth={940} lineHeight={1.1} />
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

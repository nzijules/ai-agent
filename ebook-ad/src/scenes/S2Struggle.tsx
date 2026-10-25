import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, sp, SPRING_POP, SPRING_SOFT} from '../anim';
import {KineticText} from '../components/KineticText';
import {MiniIcon} from '../components/MiniIcons';
import {SceneWrap} from '../components/SceneWrap';
import {glass} from '../components/ui';
import {adConfig} from '../config';
import {useFormat} from '../format';
import {colors, fonts} from '../theme';
import {localAt} from '../timeline';
import {WorriedParent} from './S1Hook';

const c = adConfig.struggle;
const SUBJECTS_START = 52;
const STICKER = localAt('struggle', 10.0); // « difficile de tout suivre »
const subjectColors = [colors.mint, colors.sky, colors.violet, colors.coral, '#4CC36B'];

/** Horloge dont les aiguilles s'emballent (le temps file). */
const Clock: React.FC<{frame: number; size: number}> = ({frame, size}) => {
  const p = sp(frame, 4, SPRING_SOFT);
  const speed = interpolate(frame, [0, 120], [6, 30], clamp);
  const minute = frame * speed;
  const hour = minute / 12;
  return (
    <div style={{width: size, height: size, opacity: p, transform: `scale(${0.7 + 0.3 * p})`}}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" fill="#F5F7FF" stroke="#1B2340" strokeWidth="4" />
        {new Array(12).fill(0).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <line key={i} x1={50 + Math.sin(a) * 37} y1={50 - Math.cos(a) * 37} x2={50 + Math.sin(a) * 42} y2={50 - Math.cos(a) * 42} stroke="#1B2340" strokeWidth={i % 3 === 0 ? 3.2 : 1.6} strokeLinecap="round" />;
        })}
        <line x1="50" y1="50" x2="50" y2="28" stroke="#1B2340" strokeWidth="5" strokeLinecap="round" transform={`rotate(${hour} 50 50)`} />
        <line x1="50" y1="50" x2="50" y2="16" stroke={colors.coral} strokeWidth="3" strokeLinecap="round" transform={`rotate(${minute} 50 50)`} />
        <circle cx="50" cy="50" r="4.5" fill={colors.coral} />
      </svg>
    </div>
  );
};

export const S2Struggle: React.FC = () => {
  const frame = useCurrentFrame();
  const fmt = useFormat();
  const sticker = sp(frame, STICKER, {damping: 11, stiffness: 190, mass: 0.8});
  const dim = interpolate(frame, [STICKER - 4, STICKER + 10], [1, 0.6], clamp);
  const shake = frame > STICKER && frame < STICKER + 10 ? Math.sin(frame * 2.6) * 6 : 0;

  return (
    <SceneWrap>
      <AbsoluteFill style={{transform: `translateX(${shake}px)`}}>
        <div style={{position: 'absolute', top: fmt.safeTop, left: fmt.padX, right: fmt.padX}}>
          <KineticText text={c.heading} size={66} delay={6} stagger={3} highlight={c.highlight} align="left" maxWidth={900} lineHeight={1.1} />
        </div>
        <div style={{position: 'absolute', top: 540, left: 90, opacity: dim}}>
          <Clock frame={frame} size={190} />
        </div>
        <div style={{position: 'absolute', top: 690, left: 70, opacity: dim}}>
          <WorriedParent frame={frame} size={330} variant="father" start={14} />
        </div>
        <div style={{position: 'absolute', top: 540, right: fmt.padX, width: 470, display: 'flex', flexDirection: 'column', gap: 18, opacity: dim}}>
          {c.subjects.map((s, i) => {
            const p = sp(frame, SUBJECTS_START + i * 7, SPRING_POP);
            const col = subjectColors[i % subjectColors.length];
            return (
              <div key={s.label} style={{...glass, height: 86, borderRadius: 24, display: 'flex', alignItems: 'center', gap: 20, padding: '0 22px', opacity: p, transform: `translateX(${(1 - p) * 160}px) rotate(${(1 - p) * 6}deg)`}}>
                <div style={{width: 56, height: 56, borderRadius: 16, background: `${col}2A`, border: `2px solid ${col}88`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <MiniIcon name={s.icon} size={36} color={col} />
                </div>
                <div style={{fontFamily: fonts.display, fontWeight: 700, fontSize: 34, color: colors.white, whiteSpace: 'nowrap'}}>{s.label}</div>
              </div>
            );
          })}
        </div>
        <div style={{position: 'absolute', top: 1110, left: fmt.padX, right: fmt.padX, display: 'flex', justifyContent: 'center'}}>
          <div
            style={{
              padding: '26px 44px 30px',
              borderRadius: 28,
              background: 'linear-gradient(180deg, #FFD15C, #FFB547)',
              boxShadow: '0 24px 50px rgba(255,181,71,0.35)',
              fontFamily: fonts.display,
              fontWeight: 800,
              fontSize: 76,
              lineHeight: 1.05,
              color: colors.ink,
              textAlign: 'center',
              letterSpacing: '-0.02em',
              maxWidth: 820,
              opacity: sticker,
              transform: `scale(${0.4 + 0.6 * sticker}) rotate(${-4 + (1 - sticker) * -10}deg)`,
            }}
          >
            {c.sticker}
          </div>
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

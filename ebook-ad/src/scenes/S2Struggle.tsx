import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, sp, SPRING_POP, SPRING_SOFT} from '../anim';
import {KineticText} from '../components/KineticText';
import {ProblemCard} from '../components/ProblemCard';
import {SceneWrap} from '../components/SceneWrap';
import {glass} from '../components/ui';
import {adConfig} from '../config';
import {useFormat} from '../format';
import {colors, fonts} from '../theme';

const c = adConfig.struggle;
// Apparitions calées sur la voix : « travail », « responsabilités », « devoirs », puis la conclusion.
const ITEM_STARTS = [16, 40, 66];
const SUBJECTS_START = 78;
const STATEMENT = 112;

/** Horloge dont les aiguilles s'emballent (le temps file). */
const Clock: React.FC<{frame: number; size: number}> = ({frame, size}) => {
  const p = sp(frame, 4, SPRING_SOFT);
  const speed = interpolate(frame, [0, 100], [6, 30], clamp);
  const minute = frame * speed;
  const hour = minute / 12;
  const shake = frame > 90 && frame < 112 ? Math.sin(frame * 2.4) * 2.5 : 0;
  return (
    <div style={{width: size, height: size, opacity: p, transform: `scale(${0.7 + 0.3 * p}) rotate(${shake}deg)`}}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" fill="rgba(255,255,255,0.06)" stroke={colors.white} strokeWidth="4" />
        {new Array(12).fill(0).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <line key={i} x1={50 + Math.sin(a) * 38} y1={50 - Math.cos(a) * 38} x2={50 + Math.sin(a) * 42} y2={50 - Math.cos(a) * 42} stroke="rgba(255,255,255,0.6)" strokeWidth={i % 3 === 0 ? 3 : 1.5} strokeLinecap="round" />;
        })}
        <line x1="50" y1="50" x2="50" y2="28" stroke={colors.white} strokeWidth="5" strokeLinecap="round" transform={`rotate(${hour} 50 50)`} />
        <line x1="50" y1="50" x2="50" y2="16" stroke={colors.coral} strokeWidth="3.5" strokeLinecap="round" transform={`rotate(${minute} 50 50)`} />
        <circle cx="50" cy="50" r="4.5" fill={colors.coral} />
      </svg>
    </div>
  );
};

const SubjectChips: React.FC<{frame: number; fontSize: number; maxWidth: number}> = ({frame, fontSize, maxWidth}) => (
  <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: fontSize * 0.45, maxWidth}}>
    {c.subjects.map((s, i) => {
      const p = sp(frame, SUBJECTS_START + i * 4, SPRING_POP);
      return (
        <div
          key={s}
          style={{
            ...glass,
            padding: `${fontSize * 0.35}px ${fontSize * 0.75}px`,
            borderRadius: 999,
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize,
            color: colors.white,
            opacity: p,
            transform: `translateY(${(1 - p) * -60}px) rotate(${(1 - p) * (i % 2 ? 12 : -12)}deg)`,
            whiteSpace: 'nowrap',
          }}
        >
          {s}
        </div>
      );
    })}
  </div>
);

export const S2Struggle: React.FC = () => {
  const frame = useCurrentFrame();
  const fmt = useFormat();
  const kick = sp(frame, 2, SPRING_SOFT);
  const dim = interpolate(frame, [STATEMENT - 6, STATEMENT + 10], [1, 0.45], clamp);

  const kicker = (size: number) => (
    <div style={{fontFamily: fonts.display, fontWeight: 700, fontSize: size, letterSpacing: '0.14em', textTransform: 'uppercase', color: colors.coral, opacity: kick, textAlign: 'center'}}>{c.kicker}</div>
  );

  if (fmt.vertical) {
    return (
      <SceneWrap>
        <AbsoluteFill>
          <div style={{position: 'absolute', top: fmt.safeTop, left: 0, right: 0}}>{kicker(38)}</div>
          <div style={{position: 'absolute', top: fmt.safeTop + 70, left: fmt.padX, right: fmt.padX, display: 'flex', justifyContent: 'space-between', opacity: dim}}>
            {c.items.map((it, i) => (
              <ProblemCard key={i} start={ITEM_STARTS[i]} w={284} h={250} frame={frame} icon={it.icon} label={it.label} fontSize={32} tilt={i % 2 ? 6 : -6} />
            ))}
          </div>
          <div style={{position: 'absolute', top: 610, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: dim}}>
            <Clock frame={frame} size={230} />
          </div>
          <div style={{position: 'absolute', top: 880, left: fmt.padX, right: fmt.padX, display: 'flex', justifyContent: 'center', opacity: dim}}>
            <SubjectChips frame={frame} fontSize={30} maxWidth={900} />
          </div>
          <div style={{position: 'absolute', top: 1110, left: fmt.padX, right: fmt.padX, display: 'flex', justifyContent: 'center'}}>
            <KineticText text={c.statement} size={96} delay={STATEMENT} stagger={4} effect="slam" highlight={c.highlight} highlightColor={colors.coral} marker markerDelay={STATEMENT + 18} maxWidth={900} />
          </div>
        </AbsoluteFill>
      </SceneWrap>
    );
  }

  return (
    <SceneWrap>
      <AbsoluteFill>
        <div style={{position: 'absolute', top: 60, left: 0, right: 0}}>{kicker(28)}</div>
        <div style={{position: 'absolute', top: 120, left: 70, right: 70, display: 'flex', justifyContent: 'space-between', opacity: dim}}>
          {c.items.map((it, i) => (
            <ProblemCard key={i} start={ITEM_STARTS[i]} w={290} h={200} frame={frame} icon={it.icon} label={it.label} fontSize={26} tilt={i % 2 ? 6 : -6} />
          ))}
        </div>
        <div style={{position: 'absolute', top: 360, left: 70, display: 'flex', alignItems: 'center', gap: 36, opacity: dim}}>
          <Clock frame={frame} size={190} />
          <SubjectChips frame={frame} fontSize={24} maxWidth={700} />
        </div>
        <div style={{position: 'absolute', top: 640, left: 70, right: 70, display: 'flex', justifyContent: 'center'}}>
          <KineticText text={c.statement} size={74} delay={STATEMENT} stagger={4} effect="slam" highlight={c.highlight} highlightColor={colors.coral} marker markerDelay={STATEMENT + 18} maxWidth={940} />
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

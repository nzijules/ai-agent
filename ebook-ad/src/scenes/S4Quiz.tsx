import React from 'react';
import {AbsoluteFill, interpolate, interpolateColors, useCurrentFrame} from 'remotion';
import {clamp, easeInOut, easeOut, sp, SPRING_POP, SPRING_SOFT} from '../anim';
import {DemoTag} from '../components/Commerce';
import {Check, Cursor} from '../components/Icons';
import {KineticText} from '../components/KineticText';
import {SceneWrap} from '../components/SceneWrap';
import {glass} from '../components/ui';
import {adConfig} from '../config';
import {useFormat} from '../format';
import {colors, fonts} from '../theme';

const c = adConfig.quiz;
// Minutage (frames locales)
const CARD_IN = 12;
const TIMER_START = 24;
const TAP = 112; // sélection de la réponse
const REVEAL = 124; // correction
const SCORE = 192; // écran de score

const letters = ['A', 'B', 'C', 'D'];

/** Compte à rebours circulaire. */
const Timer: React.FC<{frame: number; size: number}> = ({frame, size}) => {
  const elapsed = Math.max(0, Math.min(frame, TAP) - TIMER_START) / 30;
  const left = Math.max(0, c.timerSeconds - elapsed);
  const ratio = left / c.timerSeconds;
  const urgent = left < c.timerSeconds * 0.4;
  const col = urgent ? colors.coral : colors.mint;
  const r = 42;
  const circ = 2 * Math.PI * r;
  const tick = frame < TAP ? 1 + 0.06 * Math.max(0, Math.sin(((frame - TIMER_START) / 30) * Math.PI * 2)) : 1;
  return (
    <div style={{position: 'relative', width: size, height: size, transform: `scale(${tick})`}}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{transform: 'rotate(-90deg)'}}>
        <circle cx="50" cy="50" r={r} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={col} strokeWidth="8" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - ratio)} />
      </svg>
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.display, fontWeight: 800, fontSize: size * 0.34, color: colors.white}}>
        {Math.ceil(left)}
      </div>
    </div>
  );
};

const Option: React.FC<{i: number; frame: number; u: number}> = ({i, frame, u}) => {
  const p = sp(frame, 30 + i * 5, SPRING_SOFT);
  const selected = i === c.correctIndex && frame >= TAP;
  const reveal = interpolate(frame, [REVEAL, REVEAL + 8], [0, 1], clamp);
  const isCorrect = i === c.correctIndex;
  const bg = isCorrect
    ? interpolateColors(reveal, [0, 1], [selected ? 'rgba(91,75,219,0.55)' : 'rgba(255,255,255,0.06)', 'rgba(47,214,181,0.22)'])
    : 'rgba(255,255,255,0.06)';
  const border = isCorrect ? interpolateColors(reveal, [0, 1], [selected ? colors.violet : 'rgba(255,255,255,0.12)', colors.mint]) : 'rgba(255,255,255,0.12)';
  const press = isCorrect ? interpolate(frame, [TAP - 2, TAP, TAP + 6], [1, 0.96, 1], clamp) : 1;
  const pop = isCorrect ? 1 + 0.04 * Math.sin(Math.PI * reveal) : 1;
  return (
    <div
      style={{
        height: 9 * u,
        borderRadius: 3 * u,
        background: bg,
        border: `2px solid ${border}`,
        display: 'flex',
        alignItems: 'center',
        gap: 3 * u,
        padding: `0 ${3 * u}px`,
        opacity: p * (isCorrect ? 1 : 1 - 0.45 * reveal),
        transform: `translateX(${(1 - p) * 60}px) scale(${press * pop})`,
      }}
    >
      <div
        style={{
          width: 6 * u,
          height: 6 * u,
          borderRadius: '50%',
          flexShrink: 0,
          background: isCorrect && reveal > 0.5 ? colors.mint : 'rgba(255,255,255,0.12)',
          color: isCorrect && reveal > 0.5 ? colors.ink : colors.white,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: fonts.display,
          fontWeight: 800,
          fontSize: 3.2 * u,
        }}
      >
        {isCorrect && reveal > 0.5 ? <Check size={4.4 * u} p={reveal} /> : letters[i]}
      </div>
      <div style={{fontFamily: fonts.display, fontWeight: 700, fontSize: 4.4 * u, color: colors.white}}>{c.options[i]}</div>
    </div>
  );
};

const Score: React.FC<{frame: number; u: number}> = ({frame, u}) => {
  const p = interpolate(frame, [SCORE + 4, SCORE + 40], [0, 1], {...clamp, easing: easeOut});
  const r = 40;
  const circ = 2 * Math.PI * r;
  const pct = Math.round(c.scorePercent * 100 * p);
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 * u, paddingTop: 2 * u}}>
      <div style={{fontFamily: fonts.display, fontWeight: 700, fontSize: 4.4 * u, color: colors.muted}}>{c.scoreLabel}</div>
      <div style={{position: 'relative', width: 34 * u, height: 34 * u}}>
        <svg width={34 * u} height={34 * u} viewBox="0 0 100 100" style={{transform: 'rotate(-90deg)'}}>
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="9" />
          <circle cx="50" cy="50" r={r} fill="none" stroke={colors.mint} strokeWidth="9" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - c.scorePercent * p)} />
        </svg>
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 9 * u, color: colors.white, lineHeight: 1}}>{c.score}</div>
          <div style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 3.4 * u, color: colors.mint}}>{pct}&nbsp;%</div>
        </div>
      </div>
      <div
        style={{
          padding: `${2.2 * u}px ${4 * u}px`,
          borderRadius: 3 * u,
          background: `${colors.amber}1F`,
          border: `2px solid ${colors.amber}66`,
          fontFamily: fonts.body,
          fontWeight: 600,
          fontSize: 3.8 * u,
          color: colors.white,
          textAlign: 'center',
          opacity: interpolate(frame, [SCORE + 30, SCORE + 42], [0, 1], clamp),
        }}
      >
        {c.scoreAdvice}
      </div>
    </div>
  );
};

/** Carte de quiz (largeur w). */
const QuizCard: React.FC<{frame: number; w: number}> = ({frame, w}) => {
  const u = w / 100;
  const enter = sp(frame, CARD_IN, SPRING_SOFT);
  const toScore = interpolate(frame, [SCORE - 6, SCORE + 6], [0, 1], {...clamp, easing: easeInOut});
  const fb = sp(frame, REVEAL + 6, SPRING_SOFT);
  const cursorP = interpolate(frame, [88, TAP], [0, 1], {...clamp, easing: easeOut});
  const cursorOpacity = interpolate(frame, [86, 92, TAP + 14, TAP + 22], [0, 1, 1, 0], clamp);
  return (
    <div style={{...glass, position: 'relative', width: w, height: 103 * u, borderRadius: 6 * u, padding: 5 * u, boxSizing: 'border-box', opacity: enter, transform: `translateY(${(1 - enter) * 120}px) rotateX(${(1 - enter) * 14}deg)`}}>
      {/* en-tête */}
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 14 * u}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 1.2 * u}}>
          <div style={{alignSelf: 'flex-start', padding: `${1 * u}px ${2.6 * u}px`, borderRadius: 999, background: `${colors.sky}22`, border: `1.5px solid ${colors.sky}77`, color: colors.sky, fontFamily: fonts.display, fontWeight: 700, fontSize: 3.3 * u}}>{c.subject}</div>
          <div style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 3.4 * u, color: colors.muted}}>{c.counter}</div>
        </div>
        <Timer frame={frame} size={14 * u} />
      </div>
      {/* barre de progression des questions */}
      <div style={{height: 1.2 * u, borderRadius: u, background: 'rgba(255,255,255,0.1)', marginTop: 1.5 * u, overflow: 'hidden'}}>
        <div style={{height: '100%', width: `${(toScore > 0.5 ? 100 : 60) * interpolate(enter, [0, 1], [0.4, 1])}%`, background: colors.violet, borderRadius: u}} />
      </div>

      {/* question + options */}
      <div style={{position: 'absolute', left: 5 * u, right: 5 * u, top: 23 * u, opacity: 1 - toScore, transform: `translateX(${-toScore * 40}px)`}}>
        <div style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 5.2 * u, color: colors.white, lineHeight: 1.18, minHeight: 10 * u, opacity: interpolate(frame, [CARD_IN + 8, CARD_IN + 18], [0, 1], clamp)}}>{c.question}</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 1.8 * u, marginTop: 3 * u}}>
          {c.options.map((_, i) => (
            <Option key={i} i={i} frame={frame} u={u} />
          ))}
        </div>
        {/* correction pédagogique */}
        <div style={{marginTop: 2.6 * u, padding: `${2.4 * u}px ${3.4 * u}px`, borderRadius: 3 * u, background: `${colors.mint}14`, borderLeft: `${1.2 * u}px solid ${colors.mint}`, opacity: fb, transform: `translateY(${(1 - fb) * 30}px)`}}>
          <div style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 4.2 * u, color: colors.mint}}>{c.feedbackTitle}</div>
          <div style={{fontFamily: fonts.body, fontWeight: 500, fontSize: 3.7 * u, color: colors.white, marginTop: 0.6 * u}}>{c.feedbackText}</div>
        </div>
      </div>

      {/* score final */}
      {toScore > 0 ? (
        <div style={{position: 'absolute', left: 5 * u, right: 5 * u, top: 23 * u, opacity: toScore, transform: `translateX(${(1 - toScore) * 40}px)`}}>
          <Score frame={frame} u={u} />
        </div>
      ) : null}

      {/* curseur qui choisit la réponse */}
      <div
        style={{
          position: 'absolute',
          left: interpolate(cursorP, [0, 1], [w * 0.95, w * 0.42]),
          top: interpolate(cursorP, [0, 1], [w * 1.0, 54 * u]),
          opacity: cursorOpacity,
          transform: `scale(${interpolate(frame, [TAP - 2, TAP, TAP + 6], [1, 0.85, 1], clamp)})`,
        }}
      >
        <Cursor size={9 * u} />
      </div>
    </div>
  );
};

export const S4Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const fmt = useFormat();

  if (fmt.vertical) {
    return (
      <SceneWrap>
        <AbsoluteFill>
          <div style={{position: 'absolute', top: fmt.safeTop, left: fmt.padX, right: fmt.padX, display: 'flex', justifyContent: 'center'}}>
            <KineticText text={c.heading} size={60} delay={2} stagger={3} highlight={['interactifs', 'chronométrés']} highlightColor={colors.mint} maxWidth={900} lineHeight={1.12} />
          </div>
          <div style={{position: 'absolute', top: 408, left: fmt.padX, right: fmt.padX, display: 'flex', justifyContent: 'center'}}>
            <DemoTag frame={frame} start={18} fontSize={25} text={c.demoTag} />
          </div>
          <div style={{position: 'absolute', top: 470, left: 110, perspective: 1600}}>
            <QuizCard frame={frame} w={860} />
          </div>
        </AbsoluteFill>
      </SceneWrap>
    );
  }

  return (
    <SceneWrap>
      <AbsoluteFill>
        <div style={{position: 'absolute', top: 50, left: 70, right: 70, display: 'flex', justifyContent: 'center'}}>
          <KineticText text={c.heading} size={44} delay={2} stagger={3} highlight={['interactifs', 'chronométrés']} highlightColor={colors.mint} maxWidth={940} />
        </div>
        <div style={{position: 'absolute', top: 118, left: 70, right: 70, display: 'flex', justifyContent: 'center'}}>
          <DemoTag frame={frame} start={18} fontSize={19} text={c.demoTag} />
        </div>
        <div style={{position: 'absolute', top: 172, left: 540 - 330, perspective: 1600}}>
          <QuizCard frame={frame} w={660} />
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

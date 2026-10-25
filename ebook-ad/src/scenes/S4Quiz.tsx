import React from 'react';
import {AbsoluteFill, Img, interpolate, interpolateColors, staticFile, useCurrentFrame} from 'remotion';
import {clamp, easeOut, sp, SPRING_POP, SPRING_SOFT} from '../anim';
import {DemoTag} from '../components/Commerce';
import {Check, Cursor} from '../components/Icons';
import {KineticText} from '../components/KineticText';
import {MiniIcon} from '../components/MiniIcons';
import {SceneWrap} from '../components/SceneWrap';
import {adConfig} from '../config';
import {useFormat} from '../format';
import {colors, fonts} from '../theme';

const c = adConfig.quiz;
// Minutage (frames locales) — la voix couvre ~23 → 176.
const PHONE_IN = 10;
const TIMER_START = 20;
const TAP = 108;
const REVEAL = 118;
const FEEDBACK = 126;
const SCORE = 158;
const WEAK = 184;
const letters = ['A', 'B', 'C', 'D'];

const Timer: React.FC<{frame: number}> = ({frame}) => {
  const elapsed = Math.max(0, Math.min(frame, TAP) - TIMER_START) / 30;
  const left = Math.max(0, Math.ceil(c.timerSeconds - elapsed));
  const blink = frame < TAP && Math.floor(frame / 15) % 2 === 0;
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '8px 18px', borderRadius: 999, border: `3px solid ${colors.coral}`, background: 'rgba(255,107,107,0.12)', fontFamily: fonts.display, fontWeight: 800, fontSize: 34, color: colors.coral, fontVariantNumeric: 'tabular-nums'}}>
      <span style={{width: 12, height: 12, borderRadius: 6, background: colors.coral, opacity: blink ? 1 : 0.3}} />
      00:{String(left).padStart(2, '0')}
    </div>
  );
};

const Option: React.FC<{i: number; frame: number}> = ({i, frame}) => {
  const p = sp(frame, 26 + i * 5, SPRING_SOFT);
  const isCorrect = i === c.correctIndex;
  const selected = isCorrect && frame >= TAP;
  const reveal = interpolate(frame, [REVEAL, REVEAL + 8], [0, 1], clamp);
  const bg = isCorrect ? interpolateColors(reveal, [0, 1], [selected ? 'rgba(91,75,219,0.55)' : 'rgba(255,255,255,0.06)', '#1F9D57']) : 'rgba(255,255,255,0.06)';
  const press = isCorrect ? interpolate(frame, [TAP - 2, TAP, TAP + 6], [1, 0.96, 1], clamp) : 1;
  return (
    <div style={{height: 70, borderRadius: 18, background: bg, border: `2px solid ${isCorrect && reveal > 0.5 ? '#46D483' : 'rgba(255,255,255,0.14)'}`, display: 'flex', alignItems: 'center', gap: 18, padding: '0 18px', opacity: p * (isCorrect ? 1 : 1 - 0.45 * reveal), transform: `translateX(${(1 - p) * 60}px) scale(${press})`}}>
      <div style={{width: 44, height: 44, borderRadius: 22, background: 'rgba(255,255,255,0.92)', color: colors.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.display, fontWeight: 800, fontSize: 24}}>{letters[i]}</div>
      <div style={{flex: 1, fontFamily: fonts.display, fontWeight: 700, fontSize: 34, color: colors.white}}>{c.options[i]}</div>
      {isCorrect && reveal > 0.3 ? <Check size={40} p={reveal} color={colors.white} /> : null}
    </div>
  );
};

/** Téléphone avec le quiz (600 × 850). */
const Phone: React.FC<{frame: number}> = ({frame}) => {
  const enter = sp(frame, PHONE_IN, SPRING_SOFT);
  const fb = sp(frame, FEEDBACK, SPRING_POP);
  const sc = sp(frame, SCORE, SPRING_SOFT);
  const bar = interpolate(frame, [SCORE + 6, SCORE + 36], [0, c.scorePercent], {...clamp, easing: easeOut});
  const wk = sp(frame, WEAK, SPRING_SOFT);
  return (
    <div style={{width: 600, height: 850, borderRadius: 64, padding: 16, boxSizing: 'border-box', background: 'linear-gradient(160deg, #3A4256, #12162A)', boxShadow: '0 40px 90px rgba(0,0,0,0.55), inset 0 2px 0 rgba(255,255,255,0.25)', opacity: enter, transform: `translateY(${(1 - enter) * 140}px) rotate(${(1 - enter) * -6 - 2}deg)`}}>
      <div style={{width: '100%', height: '100%', borderRadius: 50, background: 'linear-gradient(180deg, #0E1734, #0A1028)', padding: '30px 30px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 26, color: colors.muted}}>{c.counter}</div>
          <Timer frame={frame} />
        </div>
        <div style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 42, color: colors.white, opacity: interpolate(frame, [PHONE_IN + 8, PHONE_IN + 18], [0, 1], clamp)}}>{c.question}</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
          {c.options.map((_, i) => (
            <Option key={i} i={i} frame={frame} />
          ))}
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '16px 20px', borderRadius: 20, background: 'linear-gradient(180deg, #23B566, #179250)', opacity: fb, transform: `scale(${0.7 + 0.3 * fb})`}}>
          <div style={{width: 56, height: 56, borderRadius: 28, background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
            <Check size={40} p={fb} color="#179250" />
          </div>
          <div>
            <div style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 30, color: colors.white}}>{c.feedbackTitle}</div>
            <div style={{fontFamily: fonts.display, fontWeight: 600, fontSize: 28, color: colors.white}}>{c.feedbackText}</div>
          </div>
        </div>
        <div style={{padding: '12px 20px', borderRadius: 18, background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.12)', opacity: sc}}>
          <div style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 30, color: colors.white}}>
            {c.scoreLabel}&nbsp;: {c.score}
          </div>
          <div style={{height: 14, borderRadius: 7, background: 'rgba(255,255,255,0.12)', marginTop: 8, overflow: 'hidden'}}>
            <div style={{height: '100%', width: `${bar * 100}%`, borderRadius: 7, background: `linear-gradient(90deg, #FFD15C, ${colors.amber})`}} />
          </div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '10px 20px', borderRadius: 18, background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.12)', opacity: wk, transform: `translateY(${(1 - wk) * 20}px)`}}>
          <MiniIcon name="score" size={34} color={colors.amber} />
          <div style={{fontFamily: fonts.display, fontWeight: 700, fontSize: 28, color: colors.white}}>
            {c.weakLabel} <span style={{color: colors.amber}}>{c.weak}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const S4Quiz: React.FC = () => {
  const frame = useCurrentFrame();
  const fmt = useFormat();
  const photo = sp(frame, 30, SPRING_SOFT);
  const cursorP = interpolate(frame, [86, TAP], [0, 1], {...clamp, easing: easeOut});
  const cursorOpacity = interpolate(frame, [84, 90, TAP + 14, TAP + 22], [0, 1, 1, 0], clamp);
  const press = interpolate(frame, [TAP - 2, TAP, TAP + 6], [1, 0.85, 1], clamp);
  return (
    <SceneWrap>
      <AbsoluteFill>
        <div style={{position: 'absolute', top: fmt.safeTop, left: fmt.padX, right: fmt.padX}}>
          <KineticText text={c.heading} size={56} delay={4} stagger={2} highlight={c.highlight} highlightColor={colors.amber} align="left" maxWidth={900} lineHeight={1.12} />
        </div>
        <div style={{position: 'absolute', top: 452, left: fmt.padX}}>
          <DemoTag frame={frame} start={18} fontSize={23} text={c.demoTag} />
        </div>
        {/* photo : enfant à la tablette */}
        <div style={{position: 'absolute', left: 560, top: 860, width: 430, height: 420, borderRadius: 40, overflow: 'hidden', border: `3px solid ${colors.amber}88`, boxShadow: `0 30px 70px rgba(0,0,0,0.5), 0 0 40px ${colors.amber}33`, opacity: photo, transform: `translateX(${(1 - photo) * 120}px) rotate(${3 - (1 - photo) * 6}deg)`}}>
          <Img src={staticFile('photos/enfant-tablette.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.08 - 0.06 * interpolate(frame, [30, 300], [0, 1], clamp)})`}} />
        </div>
        <div style={{position: 'absolute', top: 510, left: 70}}>
          <Phone frame={frame} />
        </div>
        <div style={{position: 'absolute', left: interpolate(cursorP, [0, 1], [700, 70 + 16 + 30 + 300]), top: interpolate(cursorP, [0, 1], [1300, 510 + 16 + 30 + 52 + 16 + 50 + 16 + 82 + 35]), opacity: cursorOpacity, transform: `scale(${press})`}}>
          <Cursor size={70} />
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

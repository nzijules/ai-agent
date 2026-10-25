import React from 'react';
import {AbsoluteFill, interpolate, interpolateColors, useCurrentFrame} from 'remotion';
import {clamp, easeIn, easeOut, sp, SPRING_POP, SPRING_SOFT} from '../anim';
import {AnimatedIcon, Check} from '../components/Icons';
import {KineticText} from '../components/KineticText';
import {SceneWrap} from '../components/SceneWrap';
import {glass} from '../components/ui';
import {adConfig} from '../config';
import {useFormat} from '../format';
import {colors, fonts} from '../theme';
import {BENEFIT_START, BENEFIT_STEP} from '../timeline';

const c = adConfig.scene4;
const accents = [colors.amber, colors.mint, colors.sky, colors.coral];

const BenefitCard: React.FC<{i: number; frame: number; w: number; h: number; vertical: boolean}> = ({i, frame, w, h, vertical}) => {
  const start = BENEFIT_START + i * BENEFIT_STEP;
  const lf = frame - start;
  const last = i === c.benefits.length - 1;
  const inP = sp(frame, start, SPRING_SOFT);
  const outP = last ? 0 : interpolate(lf, [BENEFIT_STEP - 8, BENEFIT_STEP + 4], [0, 1], {...clamp, easing: easeIn});
  if (lf < -2 || outP >= 1) return null;
  const drawP = interpolate(lf, [4, 34], [0, 1], {...clamp, easing: easeOut});
  const iconPop = sp(frame, start + 2, SPRING_POP);
  const accent = accents[i % accents.length];
  const item = c.benefits[i];
  const iconBox = vertical ? 170 : 140;
  return (
    <div
      style={{
        ...glass,
        position: 'absolute',
        width: w,
        height: h,
        borderRadius: 44,
        padding: vertical ? 48 : 38,
        boxSizing: 'border-box',
        opacity: inP * (1 - outP),
        transform: `translateX(${(1 - inP) * 260 - outP * 260}px) rotateY(${(1 - inP) * -25 + outP * 25}deg) scale(${0.92 + 0.08 * inP})`,
        display: 'flex',
        flexDirection: 'column',
        gap: vertical ? 22 : 16,
        overflow: 'hidden',
      }}
    >
      <div style={{position: 'absolute', right: -80, top: -80, width: 320, height: 320, borderRadius: '50%', background: `radial-gradient(circle, ${accent}40 0%, transparent 70%)`}} />
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div
          style={{
            width: iconBox,
            height: iconBox,
            borderRadius: iconBox * 0.3,
            background: `${accent}1E`,
            border: `2px solid ${accent}70`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${0.6 + 0.4 * iconPop})`,
          }}
        >
          <AnimatedIcon name={item.icon} size={iconBox * 0.72} p={drawP} f={lf} accent={accent} />
        </div>
        <div style={{fontFamily: fonts.display, fontWeight: 800, fontSize: vertical ? 120 : 84, color: 'rgba(255,255,255,0.09)', letterSpacing: '-0.04em'}}>
          {String(i + 1).padStart(2, '0')}
        </div>
      </div>
      <KineticText text={item.title} size={vertical ? 64 : 46} delay={start + 6} stagger={3} align="left" maxWidth={w - (vertical ? 96 : 76)} lineHeight={1.08} />
      <div
        style={{
          fontFamily: fonts.body,
          fontWeight: 500,
          fontSize: vertical ? 36 : 27,
          lineHeight: 1.35,
          color: colors.muted,
          opacity: interpolate(lf, [14, 26], [0, 1], clamp),
          transform: `translateY(${interpolate(lf, [14, 26], [20, 0], {...clamp, easing: easeOut})}px)`,
        }}
      >
        {item.text}
      </div>
    </div>
  );
};

const Checklist: React.FC<{frame: number; rowH: number; fontSize: number; w: number}> = ({frame, rowH, fontSize, w}) => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 10, width: w}}>
    {c.benefits.map((item, i) => {
      const start = BENEFIT_START + i * BENEFIT_STEP;
      const appear = sp(frame, 6 + i * 4, SPRING_SOFT);
      const active = interpolate(frame, [start, start + 10], [0, 1], clamp);
      const done = interpolate(frame, [start + 24, start + 36], [0, 1], clamp);
      const accent = accents[i % accents.length];
      return (
        <div
          key={i}
          style={{
            height: rowH,
            display: 'flex',
            alignItems: 'center',
            gap: rowH * 0.28,
            padding: `0 ${rowH * 0.28}px`,
            borderRadius: rowH * 0.3,
            background: interpolateColors(active, [0, 1], ['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.09)']),
            border: `2px solid ${interpolateColors(active, [0, 1], ['rgba(255,255,255,0.06)', `${accent}66`])}`,
            opacity: appear * (0.45 + 0.55 * active),
            transform: `translateY(${(1 - appear) * 30}px)`,
          }}
        >
          <div
            style={{
              width: rowH * 0.56,
              height: rowH * 0.56,
              flexShrink: 0,
              borderRadius: '50%',
              background: interpolateColors(done, [0, 1], ['rgba(255,255,255,0.08)', accent]),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${1 + 0.18 * Math.sin(Math.PI * done)})`,
            }}
          >
            <Check size={rowH * 0.4} p={done} />
          </div>
          <div style={{fontFamily: fonts.display, fontWeight: 700, fontSize, color: colors.white, lineHeight: 1.12}}>{item.title}</div>
        </div>
      );
    })}
  </div>
);

export const S4Benefits: React.FC = () => {
  const frame = useCurrentFrame();
  const fmt = useFormat();
  const note = interpolate(frame, [270, 290], [0, 1], clamp);

  if (fmt.vertical) {
    return (
      <SceneWrap>
        <AbsoluteFill>
          <div style={{position: 'absolute', top: fmt.safeTop, left: fmt.padX, right: fmt.padX, display: 'flex', justifyContent: 'center'}}>
            <KineticText text={c.heading} size={50} weight={700} delay={2} stagger={2} maxWidth={900} lineHeight={1.18} />
          </div>
          <div style={{position: 'absolute', top: 405, left: fmt.padX, perspective: 1600}}>
            {c.benefits.map((_, i) => (
              <BenefitCard key={i} i={i} frame={frame} w={900} h={540} vertical />
            ))}
          </div>
          <div style={{position: 'absolute', top: 975, left: fmt.padX}}>
            <Checklist frame={frame} rowH={70} fontSize={32} w={900} />
          </div>
          <div
            style={{
              position: 'absolute',
              top: 1306,
              left: fmt.padX,
              right: fmt.padX,
              textAlign: 'center',
              fontFamily: fonts.body,
              fontSize: 26,
              fontWeight: 500,
              color: colors.muted,
              opacity: note,
            }}
          >
            {c.note}
          </div>
        </AbsoluteFill>
      </SceneWrap>
    );
  }

  return (
    <SceneWrap>
      <AbsoluteFill>
        <div style={{position: 'absolute', top: 66, left: 70, right: 70}}>
          <KineticText text={c.heading} size={38} weight={700} delay={2} stagger={2} maxWidth={940} align="left" lineHeight={1.15} />
        </div>
        <div style={{position: 'absolute', top: 200, left: 70, perspective: 1400}}>
          {c.benefits.map((_, i) => (
            <BenefitCard key={i} i={i} frame={frame} w={540} h={540} vertical={false} />
          ))}
        </div>
        <div style={{position: 'absolute', top: 200, left: 640}}>
          <Checklist frame={frame} rowH={126} fontSize={26} w={370} />
        </div>
        <div style={{position: 'absolute', top: 790, left: 70, right: 70, fontFamily: fonts.body, fontSize: 22, fontWeight: 500, color: colors.muted, opacity: note}}>{c.note}</div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

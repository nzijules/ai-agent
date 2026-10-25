import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {clamp, easeOut, sp, SPRING_POP, SPRING_SOFT} from '../anim';
import {FinePrint} from '../components/Commerce';
import {AnimatedIcon, Check} from '../components/Icons';
import {KineticText} from '../components/KineticText';
import {SceneWrap} from '../components/SceneWrap';
import {glass} from '../components/ui';
import {adConfig} from '../config';
import {useFormat} from '../format';
import {colors, fonts} from '../theme';
import {localAt} from '../timeline';

const c = adConfig.benefits;
const accents = [colors.amber, colors.sky, colors.mint, colors.coral];
// Apparitions calées sur « Moins de dépenses inutiles », « plus de visibilité », « un enfant… autonome »,
// puis « Gagnez du temps » (sans voix).
const STARTS = [localAt('benefits', 41.3), localAt('benefits', 42.8), localAt('benefits', 44.1), localAt('benefits', 45.3)];

const BenefitRow: React.FC<{i: number; frame: number; h: number; title: number; text: number}> = ({i, frame, h, title, text}) => {
  const item = c.items[i];
  const start = STARTS[i];
  const p = sp(frame, start, SPRING_SOFT);
  const drawP = interpolate(frame, [start + 2, start + 30], [0, 1], {...clamp, easing: easeOut});
  const check = sp(frame, start + 18, SPRING_POP);
  const accent = accents[i % accents.length];
  const active = interpolate(frame, [start, start + 8, (STARTS[i + 1] ?? 999) - 4, (STARTS[i + 1] ?? 999) + 6], [0, 1, 1, 0.35], clamp);
  return (
    <div
      style={{
        ...glass,
        height: h,
        borderRadius: h * 0.2,
        display: 'flex',
        alignItems: 'center',
        gap: h * 0.12,
        padding: `0 ${h * 0.14}px`,
        boxSizing: 'border-box',
        border: `2px solid ${accent}${active > 0.6 ? '99' : '33'}`,
        boxShadow: active > 0.6 ? `0 0 ${h * 0.25}px ${accent}33, 0 30px 80px rgba(0,0,0,0.35)` : glass.boxShadow,
        opacity: p,
        transform: `translateX(${(1 - p) * 200}px) scale(${0.96 + 0.04 * active})`,
      }}
    >
      <div style={{width: h * 0.66, height: h * 0.66, flexShrink: 0, borderRadius: h * 0.18, background: `${accent}1F`, border: `2px solid ${accent}77`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <AnimatedIcon name={item.icon} size={h * 0.48} p={drawP} f={frame - start} accent={accent} />
      </div>
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{fontFamily: fonts.display, fontWeight: 800, fontSize: title, color: accent, lineHeight: 1.08, letterSpacing: '-0.015em'}}>{item.title}</div>
        <div style={{fontFamily: fonts.body, fontWeight: 500, fontSize: text, color: colors.muted, marginTop: text * 0.3, opacity: interpolate(frame, [start + 10, start + 22], [0, 1], clamp)}}>{item.text}</div>
      </div>
      <div style={{width: h * 0.3, height: h * 0.3, flexShrink: 0, borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${check})`}}>
        <Check size={h * 0.2} p={check} />
      </div>
    </div>
  );
};

export const S6Benefits: React.FC = () => {
  const frame = useCurrentFrame();
  const fmt = useFormat();
  const photo = sp(frame, 20, SPRING_SOFT);
  return (
    <SceneWrap>
      <AbsoluteFill>
        <div style={{position: 'absolute', top: fmt.safeTop, left: fmt.padX, right: fmt.padX, display: 'flex', flexDirection: 'column', gap: 16}}>
          {c.items.map((_, i) => (
            <BenefitRow key={i} i={i} frame={frame} h={150} title={42} text={26} />
          ))}
        </div>
        <div style={{position: 'absolute', top: 930, left: fmt.padX, width: 900, height: 420, borderRadius: 40, overflow: 'hidden', border: `3px solid ${colors.amber}66`, boxShadow: '0 30px 70px rgba(0,0,0,0.5)', opacity: photo, transform: `translateY(${(1 - photo) * 80}px)`}}>
          <Img src={staticFile('photos/parent-enfant.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%', transform: `scale(${1.1 - 0.08 * interpolate(frame, [0, 188], [0, 1], clamp)})`}} />
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 150, background: 'linear-gradient(180deg, transparent, rgba(4,8,24,0.92))'}} />
          <FinePrint frame={frame} start={STARTS[3]} fontSize={21} text={c.note} style={{position: 'absolute', left: 40, right: 40, bottom: 18, color: 'rgba(235,240,255,0.85)'}} />
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

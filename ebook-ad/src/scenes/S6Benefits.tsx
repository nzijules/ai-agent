import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, easeOut, sp, SPRING_POP, SPRING_SOFT} from '../anim';
import {FinePrint} from '../components/Commerce';
import {AnimatedIcon, Check} from '../components/Icons';
import {KineticText} from '../components/KineticText';
import {SceneWrap} from '../components/SceneWrap';
import {glass} from '../components/ui';
import {adConfig} from '../config';
import {useFormat} from '../format';
import {colors, fonts} from '../theme';

const c = adConfig.benefits;
const accents = [colors.amber, colors.sky, colors.mint];
// Apparitions calées sur « Moins de dépenses inutiles », « plus de visibilité », « un enfant… autonome ».
const STARTS = [16, 62, 98];

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
        <div style={{fontFamily: fonts.display, fontWeight: 800, fontSize: title, color: colors.white, lineHeight: 1.08, letterSpacing: '-0.015em'}}>{item.title}</div>
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

  if (fmt.vertical) {
    return (
      <SceneWrap>
        <AbsoluteFill>
          <div style={{position: 'absolute', top: fmt.safeTop, left: fmt.padX, right: fmt.padX, display: 'flex', justifyContent: 'center'}}>
            <KineticText text={c.heading} size={66} delay={0} stagger={3} highlight={['parent']} maxWidth={900} />
          </div>
          <div style={{position: 'absolute', top: 400, left: fmt.padX, right: fmt.padX, display: 'flex', flexDirection: 'column', gap: 34}}>
            {c.items.map((_, i) => (
              <BenefitRow key={i} i={i} frame={frame} h={228} title={50} text={30} />
            ))}
          </div>
          <FinePrint frame={frame} start={110} fontSize={25} text={c.note} style={{position: 'absolute', top: 1210, left: 120, right: 120}} />
        </AbsoluteFill>
      </SceneWrap>
    );
  }

  return (
    <SceneWrap>
      <AbsoluteFill>
        <div style={{position: 'absolute', top: 58, left: 70, right: 70, display: 'flex', justifyContent: 'center'}}>
          <KineticText text={c.heading} size={52} delay={0} stagger={3} highlight={['parent']} maxWidth={940} />
        </div>
        <div style={{position: 'absolute', top: 160, left: 130, right: 130, display: 'flex', flexDirection: 'column', gap: 24}}>
          {c.items.map((_, i) => (
            <BenefitRow key={i} i={i} frame={frame} h={180} title={40} text={24} />
          ))}
        </div>
        <FinePrint frame={frame} start={110} fontSize={19} text={c.note} style={{position: 'absolute', top: 790, left: 120, right: 120}} />
      </AbsoluteFill>
    </SceneWrap>
  );
};

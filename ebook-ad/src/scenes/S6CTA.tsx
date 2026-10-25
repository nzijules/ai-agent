import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, easeOut, sp, SPRING_POP, SPRING_SOFT} from '../anim';
import {Book3D} from '../components/Book3D';
import {ChatPhone, Cursor, LinkIcon} from '../components/Icons';
import {KineticText} from '../components/KineticText';
import {SceneWrap} from '../components/SceneWrap';
import {adConfig} from '../config';
import {useFormat} from '../format';
import {colors, fonts} from '../theme';

const c = adConfig.scene6;
const CLICK = 78;

const CtaButton: React.FC<{frame: number; w: number; fontSize: number}> = ({frame, w, fontSize}) => {
  const p = sp(frame, 34, SPRING_POP);
  const pulse = 1 + 0.025 * Math.sin(Math.max(0, frame - 50) / 5);
  const press = interpolate(frame, [CLICK - 2, CLICK, CLICK + 6], [1, 0.94, 1], clamp);
  const shine = ((frame - 50) % 45) / 45;
  const ripple = interpolate(frame, [CLICK, CLICK + 22], [0, 1], {...clamp, easing: easeOut});
  const h = fontSize * 2.7;
  return (
    <div style={{position: 'relative', width: w, height: h, opacity: p, transform: `scale(${(0.7 + 0.3 * p) * pulse * press})`}}>
      {/* halo */}
      <div style={{position: 'absolute', inset: -18, borderRadius: 999, background: `${colors.amber}`, filter: 'blur(30px)', opacity: 0.35 + 0.15 * Math.sin(frame / 6)}} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 999,
          overflow: 'hidden',
          background: `linear-gradient(180deg, #FFC86B 0%, ${colors.amber} 55%, #F29A2E 100%)`,
          boxShadow: `0 18px 40px rgba(242,154,46,0.45), inset 0 2px 0 rgba(255,255,255,0.6)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: fontSize * 0.45,
          fontFamily: fonts.display,
          fontWeight: 800,
          fontSize,
          color: colors.ink,
          letterSpacing: '-0.01em',
          whiteSpace: 'nowrap',
        }}
      >
        {c.button}
        <svg width={fontSize * 0.9} height={fontSize * 0.9} viewBox="0 0 24 24" style={{transform: `translateX(${Math.sin(frame / 5) * 4}px)`}}>
          <path d="M5 12 H19 M13 6 L19 12 L13 18" fill="none" stroke={colors.ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {frame > 50 ? (
          <div
            style={{
              position: 'absolute',
              top: -20,
              bottom: -20,
              width: w * 0.16,
              left: `${-20 + shine * 140}%`,
              transform: 'rotate(20deg)',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)',
            }}
          />
        ) : null}
      </div>
      {ripple > 0 && ripple < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: w * 0.72 - 150 * ripple,
            top: h * 0.6 - 150 * ripple,
            width: 300 * ripple,
            height: 300 * ripple,
            borderRadius: '50%',
            border: `4px solid ${colors.white}`,
            opacity: 1 - ripple,
          }}
        />
      ) : null}
    </div>
  );
};

const Contact: React.FC<{frame: number; fontSize: number}> = ({frame, fontSize}) => {
  if (c.contact.type === 'none') return null;
  const p = sp(frame, 52, SPRING_SOFT);
  const Icon = c.contact.type === 'whatsapp' ? ChatPhone : LinkIcon;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: fontSize * 0.5,
        padding: `${fontSize * 0.45}px ${fontSize * 0.9}px`,
        borderRadius: 999,
        background: 'rgba(255,255,255,0.08)',
        border: '2px solid rgba(255,255,255,0.16)',
        opacity: p,
        transform: `translateY(${(1 - p) * 30}px)`,
        fontFamily: fonts.display,
        fontSize,
        color: colors.white,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon size={fontSize * 1.25} color={colors.mint} />
      {c.contact.label ? <span style={{fontWeight: 600, color: colors.mint}}>{c.contact.label}&nbsp;:</span> : null}
      <span style={{fontWeight: 700}}>{c.contact.value}</span>
    </div>
  );
};

const Legal: React.FC<{frame: number; fontSize: number; style?: React.CSSProperties}> = ({frame, fontSize, style}) => (
  <div style={{fontFamily: fonts.body, fontSize, fontWeight: 500, color: 'rgba(225,232,255,0.55)', lineHeight: 1.35, textAlign: 'center', opacity: interpolate(frame, [60, 75], [0, 1], clamp), ...style}}>
    {adConfig.legal.trademark}
  </div>
);

export const S6CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const fmt = useFormat();
  const bookP = sp(frame, 14, {damping: 16, stiffness: 90});
  const cursorP = interpolate(frame, [58, CLICK], [0, 1], {...clamp, easing: easeOut});
  const cursorOpacity = interpolate(frame, [56, 62, 100, 110], [0, 1, 1, 0], clamp);
  const press = interpolate(frame, [CLICK - 2, CLICK, CLICK + 6], [1, 0.85, 1], clamp);

  if (fmt.vertical) {
    const btnW = 880;
    return (
      <SceneWrap noExit>
        <AbsoluteFill>
          <div style={{position: 'absolute', top: fmt.safeTop, left: fmt.padX, right: fmt.padX, display: 'flex', justifyContent: 'center'}}>
            <KineticText text={c.headline} size={80} delay={4} stagger={3} highlight={['meilleure', 'méthode']} highlightColor={colors.mint} maxWidth={900} />
          </div>
          <div style={{position: 'absolute', left: 540 - 115, top: 655, transform: `translateY(${(1 - bookP) * 120 + Math.sin(frame / 18) * 8}px) scale(${0.6 + 0.4 * bookP})`, opacity: bookP}}>
            <Book3D width={230} rotateY={20 + Math.sin(frame / 25) * 5} rotateX={6} glow={0.7} />
          </div>
          <div style={{position: 'absolute', top: 1048, left: 100, width: btnW}}>
            <CtaButton frame={frame} w={btnW} fontSize={46} />
          </div>
          <div style={{position: 'absolute', top: 1196, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            <Contact frame={frame} fontSize={36} />
          </div>
          <Legal frame={frame} fontSize={20} style={{position: 'absolute', top: 1300, left: 130, right: 130}} />
          <div
            style={{
              position: 'absolute',
              left: interpolate(cursorP, [0, 1], [1000, 100 + btnW * 0.72 - 10]),
              top: interpolate(cursorP, [0, 1], [1420, 1048 + 124 * 0.6 - 6]),
              opacity: cursorOpacity,
              transform: `scale(${press})`,
            }}
          >
            <Cursor size={78} />
          </div>
        </AbsoluteFill>
      </SceneWrap>
    );
  }

  const btnW = 640;
  return (
    <SceneWrap noExit>
      <AbsoluteFill>
        <div style={{position: 'absolute', top: 70, left: 70, right: 70, display: 'flex', justifyContent: 'center'}}>
          <KineticText text={c.headline} size={62} delay={4} stagger={3} highlight={['meilleure', 'méthode']} highlightColor={colors.mint} maxWidth={940} />
        </div>
        <div style={{position: 'absolute', left: 110, top: 395, transform: `translateY(${(1 - bookP) * 100 + Math.sin(frame / 18) * 6}px) scale(${0.6 + 0.4 * bookP})`, opacity: bookP}}>
          <Book3D width={200} rotateY={20 + Math.sin(frame / 25) * 5} rotateX={6} glow={0.7} />
        </div>
        <div style={{position: 'absolute', top: 470, left: 370, width: btnW}}>
          <CtaButton frame={frame} w={btnW} fontSize={34} />
        </div>
        <div style={{position: 'absolute', top: 600, left: 370, width: btnW, display: 'flex', justifyContent: 'center'}}>
          <Contact frame={frame} fontSize={28} />
        </div>
        <Legal frame={frame} fontSize={17} style={{position: 'absolute', top: 805, left: 90, right: 90}} />
        <div
          style={{
            position: 'absolute',
            left: interpolate(cursorP, [0, 1], [1000, 370 + btnW * 0.72 - 8]),
            top: interpolate(cursorP, [0, 1], [900, 470 + 92 * 0.6 - 5]),
            opacity: cursorOpacity,
            transform: `scale(${press})`,
          }}
        >
          <Cursor size={60} />
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

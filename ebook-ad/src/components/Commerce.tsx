import React from 'react';
import {interpolate} from 'remotion';
import {clamp, easeOut, sp, SPRING_POP, SPRING_SOFT} from '../anim';
import {adConfig} from '../config';
import {colors, fonts} from '../theme';
import {ChatPhone, LinkIcon} from './Icons';
import {glass} from './ui';

const c = adConfig.offer;

/** Étiquette de prix (rebond + reflet). `start` = frame d'apparition. */
export const PriceTag: React.FC<{frame: number; start: number; scale: number}> = ({frame, start, scale}) => {
  const p = sp(frame, start, SPRING_POP);
  const shine = interpolate(frame, [start + 24, start + 54], [-0.3, 1.3], clamp);
  const breathe = 1 + Math.sin(Math.max(0, frame - start - 28) / 9) * 0.012;
  return (
    <div
      style={{
        ...glass,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 40 * scale,
        padding: `${22 * scale}px ${54 * scale}px ${26 * scale}px`,
        border: `3px solid ${colors.amber}AA`,
        background: `linear-gradient(150deg, ${colors.amber}30 0%, rgba(255,255,255,0.05) 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: p,
        transform: `scale(${(0.6 + 0.4 * p) * breathe}) rotate(${(1 - p) * -6}deg)`,
      }}
    >
      <div style={{fontFamily: fonts.display, fontWeight: 600, fontSize: 40 * scale, color: colors.white, opacity: 0.9}}>{c.priceLabel}</div>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 18 * scale, whiteSpace: 'nowrap'}}>
        <span style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 124 * scale, color: colors.amber, letterSpacing: '-0.03em', lineHeight: 1.05}}>{c.price}</span>
        <span style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 56 * scale, color: colors.amber}}>{c.currency}</span>
      </div>
      <div
        style={{
          position: 'absolute',
          top: -40,
          bottom: -40,
          width: 140 * scale,
          left: `${shine * 100}%`,
          transform: 'rotate(20deg)',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
        }}
      />
    </div>
  );
};

/** Bouton d'appel à l'action : pulsation, reflet, clic à `click`. */
export const CtaButton: React.FC<{frame: number; start: number; click: number; w: number; fontSize: number; green?: boolean}> = ({frame, start, click, w, fontSize, green}) => {
  const glow = green ? '#22C55E' : colors.amber;
  const fg = green ? colors.white : colors.ink;
  const p = sp(frame, start, SPRING_POP);
  const pulse = 1 + 0.025 * Math.sin(Math.max(0, frame - start - 16) / 5);
  const press = interpolate(frame, [click - 2, click, click + 6], [1, 0.94, 1], clamp);
  const shine = (((frame - start - 16) % 45) + 45) % 45 / 45;
  const ripple = interpolate(frame, [click, click + 22], [0, 1], {...clamp, easing: easeOut});
  const h = fontSize * 2.7;
  return (
    <div style={{position: 'relative', width: w, height: h, opacity: p, transform: `scale(${(0.7 + 0.3 * p) * pulse * press})`}}>
      <div style={{position: 'absolute', inset: -18, borderRadius: 999, background: glow, filter: 'blur(30px)', opacity: 0.35 + 0.15 * Math.sin(frame / 6)}} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 999,
          overflow: 'hidden',
          background: green ? 'linear-gradient(180deg, #4ADE80 0%, #22C55E 50%, #15803D 100%)' : `linear-gradient(180deg, #FFC86B 0%, ${colors.amber} 55%, #F29A2E 100%)`,
          boxShadow: green ? '0 18px 40px rgba(34,197,94,0.45), inset 0 2px 0 rgba(255,255,255,0.5)' : '0 18px 40px rgba(242,154,46,0.45), inset 0 2px 0 rgba(255,255,255,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: fontSize * 0.45,
          fontFamily: fonts.display,
          fontWeight: 800,
          fontSize,
          color: fg,
          letterSpacing: '0.02em',
          whiteSpace: 'nowrap',
        }}
      >
        {green ? <ChatPhone size={fontSize * 1.2} color={colors.white} /> : null}
        {c.button}
        {green ? null : (
          <svg width={fontSize * 0.9} height={fontSize * 0.9} viewBox="0 0 24 24" style={{transform: `translateX(${Math.sin(frame / 5) * 4}px)`}}>
            <path d="M5 12 H19 M13 6 L19 12 L13 18" fill="none" stroke={fg} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {frame > start + 16 ? (
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

/** Contact de commande (WhatsApp ou lien), configurable dans config.ts. */
export const Contact: React.FC<{frame: number; start: number; fontSize: number}> = ({frame, start, fontSize}) => {
  if (c.contact.type === 'none') return null;
  const p = sp(frame, start, SPRING_SOFT);
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

/** Petite mention (marque, rappel éthique…), en fondu à partir de `start`. */
export const FinePrint: React.FC<{frame: number; start: number; fontSize: number; text: string; style?: React.CSSProperties}> = ({frame, start, fontSize, text, style}) => (
  <div
    style={{
      fontFamily: fonts.body,
      fontSize,
      fontWeight: 500,
      color: 'rgba(225,232,255,0.6)',
      lineHeight: 1.35,
      textAlign: 'center',
      opacity: interpolate(frame, [start, start + 15], [0, 1], clamp),
      ...style,
    }}
  >
    {text}
  </div>
);

/** Étiquette « Démonstration » pour les maquettes (quiz, rapport). */
export const DemoTag: React.FC<{frame: number; start: number; fontSize: number; text: string}> = ({frame, start, fontSize, text}) => {
  const p = sp(frame, start, SPRING_SOFT);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: fontSize * 0.5,
        padding: `${fontSize * 0.35}px ${fontSize * 0.8}px`,
        borderRadius: 999,
        background: 'rgba(255,181,71,0.12)',
        border: `1.5px dashed ${colors.amber}99`,
        color: colors.amber,
        fontFamily: fonts.body,
        fontWeight: 600,
        fontSize,
        lineHeight: 1.3,
        textAlign: 'center',
        opacity: p,
        transform: `translateY(${(1 - p) * 14}px)`,
      }}
    >
      {text}
    </div>
  );
};

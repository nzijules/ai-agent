import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts} from '../styles/theme';

type Props = {
  text: string;
  /** frame (relative à la séquence) d'apparition */
  at: number;
  /** frame de sortie (optionnelle) */
  exitAt?: number;
  size: number;
  color?: string;
  accent?: string;
  /** mots (en majuscules exactes) affichés en couleur d'accent */
  accentWords?: string[];
  align?: 'left' | 'center' | 'right';
  stagger?: number;
  maxWidth?: number;
  lineHeight?: number;
  letterSpacing?: number;
  weight?: 800 | 700;
  style?: React.CSSProperties;
  /** 'rise' : masque + montée ; 'track' : resserrement de l'interlettrage ; 'blur' : mise au point */
  mode?: 'rise' | 'track' | 'blur';
  shadow?: boolean;
};

/**
 * Typographie cinétique : révélation mot à mot par masque animé, avec flou de bougé
 * proportionnel à la vitesse (motion blur simulé) et sortie élégante.
 */
export const KineticHeadline: React.FC<Props> = ({
  text,
  at,
  exitAt,
  size,
  color = colors.white,
  accent = colors.gold,
  accentWords = [],
  align = 'center',
  stagger = 3,
  maxWidth,
  lineHeight = 1.04,
  letterSpacing = -0.01,
  weight = 800,
  style,
  mode = 'rise',
  shadow = true,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(' ');
  const exitP = exitAt === undefined ? 0 : interpolate(frame, [exitAt, exitAt + 10], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic),
  });
  if (frame < at - 1) return null;
  return (
    <div
      style={{
        fontFamily: fonts.display,
        fontWeight: weight,
        fontSize: size,
        lineHeight,
        letterSpacing: `${letterSpacing}em`,
        color,
        textAlign: align,
        maxWidth,
        textTransform: 'none',
        opacity: 1 - exitP,
        transform: `translateY(${-exitP * size * 0.25}px)`,
        filter: exitP > 0 ? `blur(${exitP * 8}px)` : undefined,
        textShadow: shadow ? '0 6px 40px rgba(3,11,25,0.55)' : undefined,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const local = frame - at - i * stagger;
        const s = spring({frame: local, fps, config: {damping: 200, stiffness: 120, mass: 0.9}});
        const v = spring({frame: local - 1, fps, config: {damping: 200, stiffness: 120, mass: 0.9}});
        const vel = Math.abs(s - v);
        const isAccent = accentWords.includes(w.replace(/[.,?!]/g, ''));
        const inner: React.CSSProperties =
          mode === 'rise'
            ? {transform: `translateY(${(1 - s) * 105}%)`, filter: vel > 0.004 ? `blur(${Math.min(6, vel * 90)}px)` : undefined}
            : mode === 'track'
              ? {letterSpacing: `${(1 - s) * 0.5}em`, opacity: s, filter: `blur(${(1 - s) * 10}px)`}
              : {opacity: s, filter: `blur(${(1 - s) * 18}px)`, transform: `scale(${1.08 - 0.08 * s})`};
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              overflow: mode === 'rise' ? 'hidden' : 'visible',
              verticalAlign: 'top',
              paddingBottom: '0.06em',
              marginBottom: '-0.06em',
            }}
          >
            <span style={{display: 'inline-block', color: isAccent ? accent : undefined, ...inner}}>
              {w}
            </span>
            {i < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </div>
  );
};

/** Petit sur-titre / légende en Inter */
export const Caption: React.FC<{
  text: string;
  at: number;
  exitAt?: number;
  size: number;
  color?: string;
  align?: 'left' | 'center' | 'right';
  style?: React.CSSProperties;
  upper?: boolean;
  weight?: number;
}> = ({text, at, exitAt, size, color = colors.white, align = 'center', style, upper = false, weight = 500}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const e = exitAt === undefined ? 0 : interpolate(frame, [exitAt, exitAt + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        fontFamily: fonts.body,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.35,
        color,
        textAlign: align,
        letterSpacing: upper ? '0.18em' : '0',
        textTransform: upper ? 'uppercase' : 'none',
        opacity: p * (1 - e),
        transform: `translateY(${(1 - p) * 18}px)`,
        textShadow: '0 4px 24px rgba(3,11,25,0.6)',
        ...style,
      }}
    >
      {text}
    </div>
  );
};

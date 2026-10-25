import React from 'react';
import {interpolate, interpolateColors, useCurrentFrame} from 'remotion';
import {clamp, easeOut, sp, SPRING_SNAPPY} from '../anim';
import {colors, fonts} from '../theme';

type Props = {
  text: string;
  delay?: number;
  stagger?: number;
  size: number;
  weight?: number;
  color?: string;
  highlight?: string[];
  highlightColor?: string;
  /** Surlignage « marqueur » sous les mots mis en avant. */
  marker?: boolean;
  markerDelay?: number;
  align?: 'center' | 'left';
  lineHeight?: number;
  maxWidth?: number;
  font?: string;
  letterSpacing?: number;
};

const norm = (w: string) => w.toLowerCase().replace(/[.,…!?:;«» ]/g, '');

/** Texte animé mot par mot (spring + flou + montée). */
export const KineticText: React.FC<Props> = ({
  text,
  delay = 0,
  stagger = 3,
  size,
  weight = 800,
  color = colors.white,
  highlight = [],
  highlightColor = colors.amber,
  marker = false,
  markerDelay,
  align = 'center',
  lineHeight = 1.12,
  maxWidth,
  font = fonts.display,
  letterSpacing = -0.02,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');
  const hl = highlight.map(norm);
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        maxWidth,
        fontFamily: font,
        fontWeight: weight,
        fontSize: size,
        lineHeight,
        letterSpacing: `${letterSpacing}em`,
        color,
        columnGap: size * 0.26,
        rowGap: size * 0.04,
      }}
    >
      {words.map((w, i) => {
        const d = delay + i * stagger;
        const p = sp(frame, d, SPRING_SNAPPY);
        const blur = interpolate(frame - d, [0, 8], [10, 0], clamp);
        const isHl = hl.includes(norm(w));
        const mDelay = (markerDelay ?? d + 6) + 0;
        const mP = interpolate(frame, [mDelay, mDelay + 12], [0, 1], {...clamp, easing: easeOut});
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              position: 'relative',
              opacity: p,
              transform: `translateY(${(1 - p) * size * 0.55}px) rotate(${(1 - p) * 4}deg)`,
              filter: blur > 0.1 ? `blur(${blur}px)` : undefined,
              color: isHl && !marker ? highlightColor : undefined,
              whiteSpace: 'nowrap',
            }}
          >
            {isHl && marker ? (
              <span
                style={{
                  position: 'absolute',
                  left: -size * 0.12,
                  right: -size * 0.12,
                  top: size * 0.02,
                  bottom: -size * 0.02,
                  background: highlightColor,
                  borderRadius: size * 0.16,
                  transform: `scaleX(${mP}) skewX(-8deg)`,
                  transformOrigin: 'left center',
                  zIndex: 0,
                  opacity: 0.95,
                }}
              />
            ) : null}
            <span style={{position: 'relative', zIndex: 1, color: isHl && marker ? interpolateColors(mP, [0.2, 0.7], [color, colors.ink]) : undefined}}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

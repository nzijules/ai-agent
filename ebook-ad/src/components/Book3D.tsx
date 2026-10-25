import React from 'react';
import {colors} from '../theme';
import {Cover} from './Cover';

type Props = {
  width: number;
  rotateY?: number;
  rotateX?: number;
  rotateZ?: number;
  /** Position du reflet lumineux 0 → 1 (balayage de gauche à droite). */
  sheen?: number;
  glow?: number;
  shadow?: boolean;
};

/** Mockup pseudo-3D du livre (CSS 3D : couverture, tranche, pages, dessus). */
export const Book3D: React.FC<Props> = ({width, rotateY = 24, rotateX = 6, rotateZ = 0, sheen = -1, glow = 0, shadow = true}) => {
  const h = width * 1.5;
  const t = width * 0.075; // épaisseur
  const face: React.CSSProperties = {position: 'absolute', backfaceVisibility: 'hidden'};
  return (
    <div style={{position: 'relative', width, height: h, perspective: width * 4.2}}>
      {shadow ? (
        <div
          style={{
            position: 'absolute',
            left: width * 0.05,
            right: -width * 0.05,
            bottom: -h * 0.07,
            height: h * 0.1,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, transparent 70%)',
            filter: `blur(${width * 0.03}px)`,
          }}
        />
      ) : null}
      {glow > 0 ? (
        <div
          style={{
            position: 'absolute',
            inset: -width * 0.45,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.sky}66 0%, ${colors.violet}33 35%, transparent 65%)`,
            opacity: glow,
          }}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
        }}
      >
        {/* Pages (côté droit) */}
        <div
          style={{
            ...face,
            width: t,
            height: h * 0.985,
            left: (width - t) / 2,
            top: h * 0.0075,
            transform: `rotateY(90deg) translateZ(${width / 2 - width * 0.01}px)`,
            background: 'repeating-linear-gradient(90deg, #F4F1E8 0px, #F4F1E8 2px, #DCD6C6 3px)',
          }}
        />
        {/* Dessus */}
        <div
          style={{
            ...face,
            width: width * 0.98,
            height: t,
            left: 0,
            top: (h - t) / 2,
            transform: `rotateX(90deg) translateZ(${h / 2 - h * 0.006}px)`,
            background: 'repeating-linear-gradient(0deg, #F4F1E8 0px, #F4F1E8 2px, #DCD6C6 3px)',
          }}
        />
        {/* Tranche (dos) */}
        <div
          style={{
            ...face,
            width: t,
            height: h,
            left: (width - t) / 2,
            top: 0,
            transform: `rotateY(-90deg) translateZ(${width / 2}px)`,
            background: 'linear-gradient(90deg, #07112E 0%, #102A73 45%, #0A1A4A 100%)',
          }}
        />
        {/* Quatrième de couverture */}
        <div style={{...face, width, height: h, transform: `rotateY(180deg) translateZ(${t / 2}px)`, background: '#0A1A4A'}} />
        {/* Couverture */}
        <div
          style={{
            ...face,
            width,
            height: h,
            transform: `translateZ(${t / 2}px)`,
            borderRadius: `0 ${width * 0.015}px ${width * 0.015}px 0`,
            overflow: 'hidden',
            boxShadow: 'inset 4px 0 10px rgba(0,0,0,0.35)',
          }}
        >
          <Cover width={width} />
          {/* charnière */}
          <div
            style={{
              position: 'absolute',
              left: width * 0.035,
              top: 0,
              bottom: 0,
              width: width * 0.012,
              background: 'linear-gradient(90deg, rgba(0,0,0,0.25), rgba(255,255,255,0.12), rgba(0,0,0,0.15))',
            }}
          />
          {/* reflet */}
          {sheen > -0.5 && sheen < 1.5 ? (
            <div
              style={{
                position: 'absolute',
                top: -h * 0.2,
                bottom: -h * 0.2,
                width: width * 0.45,
                left: -width * 0.6 + sheen * width * 1.8,
                transform: 'rotate(18deg)',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.32), transparent)',
              }}
            />
          ) : null}
          {/* éclairage global */}
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,255,255,0.10) 0%, transparent 40%, rgba(0,0,0,0.18) 100%)'}} />
        </div>
      </div>
    </div>
  );
};

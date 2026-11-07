import React from 'react';
import {AbsoluteFill, Img, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors} from '../styles/theme';

/** Grain photographique subtil (texture 256 px déplacée aléatoirement à chaque frame). */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.07}) => {
  const frame = useCurrentFrame();
  const x = Math.floor(random(`gx${frame}`) * 256);
  const y = Math.floor(random(`gy${frame}`) * 256);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url(${staticFile('assets/textures/grain-256.png')})`,
        backgroundPosition: `${x}px ${y}px`,
        backgroundSize: '256px 256px',
        mixBlendMode: 'overlay',
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
};

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.65}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 75% 70% at 50% 48%, rgba(0,0,0,0) 45%, rgba(3,11,25,${strength}) 100%)`,
      pointerEvents: 'none',
    }}
  />
);

/** Bokeh / particules de lumière en profondeur de champ. */
export const Bokeh: React.FC<{
  count?: number;
  seed?: string;
  color?: string;
  maxSize?: number;
  opacity?: number;
  drift?: number;
}> = ({count = 18, seed = 'b', color = colors.electric, maxSize = 120, opacity = 0.35, drift = 0.4}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {new Array(count).fill(0).map((_, i) => {
        const s = 20 + random(`${seed}s${i}`) * maxSize;
        const x = random(`${seed}x${i}`) * width;
        const y0 = random(`${seed}y${i}`) * height;
        const speed = 0.2 + random(`${seed}v${i}`) * drift;
        const y = (((y0 - frame * speed) % height) + height) % height;
        const tw = 0.55 + 0.45 * Math.sin(frame / (14 + i) + i);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - s / 2,
              top: y - s / 2,
              width: s,
              height: s,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${color} 0%, ${color}55 40%, transparent 70%)`,
              opacity: opacity * tw * (0.4 + random(`${seed}o${i}`) * 0.6),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Rayons de lumière volumétriques (god rays) — dégradés coniques, sans flou coûteux. */
export const LightRays: React.FC<{
  x?: string;
  y?: string;
  color?: string;
  opacity?: number;
  angle?: number;
}> = ({x = '80%', y = '10%', color = colors.gold, opacity = 0.35, angle = 200}) => {
  const frame = useCurrentFrame();
  const rot = Math.sin(frame / 90) * 3;
  return (
    <AbsoluteFill
      style={{
        background: `conic-gradient(from ${angle + rot}deg at ${x} ${y}, transparent 0deg, ${color}33 8deg, transparent 16deg, ${color}22 26deg, transparent 34deg, ${color}2a 46deg, transparent 58deg, transparent 360deg)`,
        mixBlendMode: 'screen',
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
};

/** Halo lumineux doux */
export const Glow: React.FC<{x: number; y: number; size: number; color: string; opacity?: number}> = ({
  x, y, size, color, opacity = 0.6,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${color} 0%, ${color}66 30%, transparent 70%)`,
      opacity,
      mixBlendMode: 'screen',
      pointerEvents: 'none',
    }}
  />
);

export const ImgCover: React.FC<{src: string}> = ({src}) => (
  <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
);

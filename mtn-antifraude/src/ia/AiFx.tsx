import React from 'react';
import {AbsoluteFill} from 'remotion';
import {rnd} from '../lib';

/** Réseau neuronal animé : nœuds, connexions, impulsions qui circulent. */
export const NeuralNet: React.FC<{t: number; color?: string; o?: number; n?: number; grow?: number}> = ({t, color = '0,229,255', o = 0.6, n = 46, grow = 1}) => {
  const nodes = [...Array(n)].map((_, i) => ({
    x: rnd(i * 3.1) * 1920 + Math.sin(t * 0.3 + i) * 20,
    y: rnd(i * 7.7 + 1) * 1080 + Math.cos(t * 0.25 + i) * 16,
    r: 3 + rnd(i + 11) * 5,
  }));
  const edges: [number, number][] = [];
  nodes.forEach((a, i) => nodes.forEach((b, j) => {
    if (j > i && Math.hypot(a.x - b.x, a.y - b.y) < 300) edges.push([i, j]);
  }));
  return (
    <AbsoluteFill style={{opacity: o}}>
      <svg width={1920} height={1080}>
        {edges.map(([i, j], k) => {
          const vis = rnd(k + 0.5) < grow;
          if (!vis) return null;
          const a = nodes[i], b = nodes[j];
          const ph = (t * 0.6 + rnd(k)) % 1;
          return (
            <g key={k}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={`rgba(${color},.25)`} strokeWidth={1.5} />
              {k % 3 === 0 && <circle cx={a.x + (b.x - a.x) * ph} cy={a.y + (b.y - a.y) * ph} r={3} fill={`rgba(${color},.95)`} />}
            </g>
          );
        })}
        {nodes.map((a, i) => (
          <circle key={i} cx={a.x} cy={a.y} r={a.r * (0.8 + 0.3 * Math.sin(t * 3 + i))} fill={`rgba(${color},${0.5 + 0.4 * rnd(i)})`} opacity={rnd(i + 0.3) < grow ? 1 : 0} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

/** Forme d'onde (voix) ; clone = copie rouge légèrement décalée. */
export const Waveform: React.FC<{t: number; w?: number; h?: number; color: string; bars?: number; seed?: number; reveal?: number}> = ({t, w = 700, h = 200, color, bars = 56, seed = 0, reveal = 1}) => (
  <svg width={w} height={h}>
    {[...Array(bars)].map((_, i) => {
      const env = Math.sin((i / bars) * Math.PI);
      const v = (0.25 + 0.75 * Math.abs(Math.sin(i * 0.9 + seed) * Math.sin(t * 6 + i * 0.4 + seed))) * env;
      const bh = Math.max(6, v * h);
      return <rect key={i} x={(i * w) / bars} y={(h - bh) / 2} width={(w / bars) * 0.6} height={bh} rx={4} fill={color} opacity={i / bars <= reveal ? 1 : 0.12} />;
    })}
  </svg>
);

/** Balayage de reconnaissance faciale (maillage + ligne de scan). */
export const FaceScan: React.FC<{t: number; p: number; color?: string; w?: number; h?: number}> = ({t, p, color = '0,229,255', w = 420, h = 520}) => {
  const y = ((t * 0.7) % 1) * h;
  const pts = [[0.3, 0.38], [0.7, 0.38], [0.5, 0.52], [0.36, 0.66], [0.64, 0.66], [0.5, 0.78], [0.2, 0.5], [0.8, 0.5], [0.5, 0.22], [0.28, 0.24], [0.72, 0.24]];
  const lines = [[0, 2], [1, 2], [2, 3], [2, 4], [3, 5], [4, 5], [0, 6], [1, 7], [6, 3], [7, 4], [0, 8], [1, 8], [8, 9], [8, 10], [9, 6], [10, 7], [0, 1], [3, 4]];
  return (
    <svg width={w} height={h} style={{position: 'absolute', inset: 0, opacity: p}}>
      {lines.map(([a, b], i) => (
        <line key={i} x1={pts[a][0] * w} y1={pts[a][1] * h} x2={pts[b][0] * w} y2={pts[b][1] * h} stroke={`rgba(${color},.8)`} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, p * 1.5)} />
      ))}
      {pts.map(([x, yy], i) => <circle key={i} cx={x * w} cy={yy * h} r={5} fill={`rgb(${color})`} />)}
      <rect x={0} y={y} width={w} height={4} fill={`rgba(${color},.9)`} />
      <rect x={0} y={y - 60} width={w} height={60} fill={`rgba(${color},.12)`} />
      {[[0, 0], [w, 0], [0, h], [w, h]].map(([x, yy], i) => (
        <path key={i} d={`M${x + (x ? -40 : 40)} ${yy} H${x} V${yy + (yy ? -40 : 40)}`} stroke={`rgb(${color})`} strokeWidth={6} fill="none" />
      ))}
    </svg>
  );
};

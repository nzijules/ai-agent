import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, easeInOut, easeOut, sp, SPRING_POP, SPRING_SOFT} from '../anim';
import {KineticText} from '../components/KineticText';
import {MiniIcon} from '../components/MiniIcons';
import {SceneWrap} from '../components/SceneWrap';
import {adConfig} from '../config';
import {useFormat} from '../format';
import {colors, fonts} from '../theme';
import {localAt} from '../timeline';

const c = adConfig.report;
// Minutage calé sur « suivez son travail, ses difficultés et ses progrès ».
const CARD_IN = 12;
const STUDENT = 24;
const TILES = localAt('report', 33.0) - 12;
const STRENGTHS = TILES + 30;
const WEAK = localAt('report', 34.2);
const CHART = localAt('report', 35.0) - 8;
const ink = '#14183A';
const gray = '#6B7090';
const tileColors = ['#2F7BF6', '#22B573', '#F59E0B', '#8B5CF6'];

const fmtValue = (v: number, suffix: string) => {
  if (suffix === 'min') {
    const h = Math.floor(v / 60);
    const m = Math.round(v % 60);
    return `${h}${' '}h${' '}${String(m).padStart(2, '0')}`;
  }
  return `${Math.round(v)}${suffix}`;
};

const Tile: React.FC<{i: number; frame: number}> = ({i, frame}) => {
  const s = c.stats[i];
  const start = TILES + i * 5;
  const p = sp(frame, start, SPRING_POP);
  const count = interpolate(frame, [start + 4, start + 30], [0, 1], {...clamp, easing: easeOut});
  const col = tileColors[i % tileColors.length];
  return (
    <div style={{height: 92, borderRadius: 18, border: '2px solid #E6E8F2', background: '#FAFBFF', display: 'flex', alignItems: 'center', gap: 16, padding: '0 18px', opacity: p, transform: `scale(${0.85 + 0.15 * p})`}}>
      <div style={{width: 56, height: 56, borderRadius: 14, background: col, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
        <MiniIcon name={s.icon} size={34} color={colors.white} />
      </div>
      <div>
        <div style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 34, color: ink, lineHeight: 1}}>{fmtValue(s.value * count, s.suffix)}</div>
        <div style={{fontFamily: fonts.body, fontWeight: 500, fontSize: 20, color: gray, marginTop: 4}}>{s.label}</div>
      </div>
    </div>
  );
};

const LineChart: React.FC<{frame: number; w: number; h: number}> = ({frame, w, h}) => {
  const draw = interpolate(frame, [CHART, CHART + 40], [0, 1], {...clamp, easing: easeInOut});
  const badge = sp(frame, CHART + 38, SPRING_POP);
  const left = 64;
  const cw = w - left - 10;
  const ch = h - 34;
  const pts = c.chart.map((v, i) => ({x: left + (i / (c.chart.length - 1)) * cw, y: ch - v * ch}));
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join(' ');
  const area = `${d} L${pts[pts.length - 1].x} ${ch} L${pts[0].x} ${ch} Z`;
  return (
    <div style={{position: 'relative', width: w, height: h}}>
      <svg width={w} height={h} style={{overflow: 'visible'}}>
        <defs>
          <linearGradient id="repArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2F7BF6" stopOpacity="0.28" />
            <stop offset="1" stopColor="#2F7BF6" stopOpacity="0" />
          </linearGradient>
          <clipPath id="repClip">
            <rect x="0" y="-20" width={left + cw * draw + 6} height={h + 40} />
          </clipPath>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((v) => (
          <g key={v}>
            <line x1={left} x2={left + cw} y1={ch - v * ch} y2={ch - v * ch} stroke="#E6E8F2" strokeWidth={2} />
            <text x={left - 12} y={ch - v * ch + 7} textAnchor="end" fontSize={18} fill={gray} fontFamily="Inter, sans-serif">
              {v * 100}%
            </text>
          </g>
        ))}
        <g clipPath="url(#repClip)">
          <path d={area} fill="url(#repArea)" />
          <path d={d} fill="none" stroke="#2F7BF6" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          {pts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={7} fill={colors.white} stroke="#2F7BF6" strokeWidth={4} />
          ))}
        </g>
        {pts.map((p, i) => (
          <text key={i} x={p.x} y={h - 4} textAnchor="middle" fontSize={20} fill={gray} fontFamily="Inter, sans-serif">
            S{i + 1}
          </text>
        ))}
      </svg>
      <div style={{position: 'absolute', right: 0, top: -8, padding: '6px 16px', borderRadius: 12, background: '#22B573', color: colors.white, fontFamily: fonts.display, fontWeight: 800, fontSize: 28, transform: `scale(${badge})`}}>{c.chartBadge}</div>
    </div>
  );
};

const List: React.FC<{frame: number; start: number; label: string; items: string[]; good: boolean}> = ({frame, start, label, items, good}) => (
  <div style={{flex: 1, borderRadius: 16, padding: '12px 16px', background: good ? '#EEFAF3' : '#FFF1F1'}}>
    <div style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 24, color: good ? '#178A4E' : '#D33A3A', opacity: interpolate(frame, [start - 6, start + 4], [0, 1], clamp)}}>{label}</div>
    {items.map((it, i) => {
      const p = sp(frame, start + i * 6, SPRING_SOFT);
      return (
        <div key={it} style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, opacity: p, transform: `translateX(${(1 - p) * 20}px)`}}>
          <MiniIcon name={good ? 'checkCircle' : 'alert'} size={24} color={good ? '#22B573' : '#E5484D'} />
          <span style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 21, color: ink}}>{it}</span>
        </div>
      );
    })}
  </div>
);

/** Rapport d'activité (carte blanche 860 px). */
const Report: React.FC<{frame: number}> = ({frame}) => {
  const enter = sp(frame, CARD_IN, SPRING_SOFT);
  const st = sp(frame, STUDENT, SPRING_SOFT);
  return (
    <div style={{width: 860, borderRadius: 40, background: colors.white, padding: 34, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '0 40px 90px rgba(0,0,0,0.5)', opacity: enter, transform: `translateY(${(1 - enter) * 140}px) rotateX(${(1 - enter) * 12}deg)`}}>
      <div>
        <div style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 38, color: ink}}>{c.title}</div>
        <div style={{fontFamily: fonts.body, fontWeight: 500, fontSize: 24, color: gray}}>{c.period}</div>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', borderRadius: 18, background: '#F2F4FB', opacity: st, transform: `translateY(${(1 - st) * 20}px)`}}>
        <div style={{width: 58, height: 58, borderRadius: 29, background: 'linear-gradient(135deg, #2F7BF6, #8B5CF6)', color: colors.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.display, fontWeight: 800, fontSize: 24}}>
          {c.student
            .split(' ')
            .map((w) => w[0])
            .join('')}
        </div>
        <div>
          <div style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 30, color: ink}}>{c.student}</div>
          <div style={{fontFamily: fonts.body, fontWeight: 500, fontSize: 21, color: gray}}>{c.grade}</div>
        </div>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
        {c.stats.map((_, i) => (
          <Tile key={i} i={i} frame={frame} />
        ))}
      </div>
      <div style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 26, color: ink, marginTop: 4, opacity: interpolate(frame, [CHART - 8, CHART + 2], [0, 1], clamp)}}>{c.chartLabel}</div>
      <LineChart frame={frame} w={792} h={170} />
      <div style={{display: 'flex', gap: 14}}>
        <List frame={frame} start={STRENGTHS} label={c.strengthsLabel} items={c.strengths} good />
        <List frame={frame} start={WEAK} label={c.weakLabel} items={c.weak} good={false} />
      </div>
      <div style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 18, color: gray, textAlign: 'center'}}>{c.footer}</div>
    </div>
  );
};

export const S5Report: React.FC = () => {
  const frame = useCurrentFrame();
  const fmt = useFormat();
  return (
    <SceneWrap>
      <AbsoluteFill>
        <div style={{position: 'absolute', top: fmt.safeTop, left: fmt.padX, right: fmt.padX}}>
          <KineticText text={c.heading} size={54} delay={4} stagger={2} highlight={c.highlight} highlightColor={colors.mint} align="left" maxWidth={900} lineHeight={1.12} />
        </div>
        <div style={{position: 'absolute', top: 455, left: 110, perspective: 1600}}>
          <Report frame={frame} />
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

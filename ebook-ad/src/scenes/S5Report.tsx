import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, easeOut, sp, SPRING_POP, SPRING_SOFT} from '../anim';
import {DemoTag} from '../components/Commerce';
import {KineticText} from '../components/KineticText';
import {SceneWrap} from '../components/SceneWrap';
import {glass} from '../components/ui';
import {adConfig} from '../config';
import {useFormat} from '../format';
import {colors, fonts} from '../theme';

const c = adConfig.report;
// Minutage (frames locales) calé sur « suivez son travail, ses difficultés et ses progrès ».
const CARD_IN = 14;
const STATS_IN = 40;
const WEAK_IN = 98;
const CHART_IN = 112;
const tileAccents = [colors.sky, colors.violet, colors.mint, colors.coral];

const fmtValue = (v: number, suffix: string) => {
  if (suffix.trim() === 'h') {
    const h = Math.floor(v);
    const m = Math.round((v - h) * 60);
    return `${h}${' '}h${m ? `${' '}${String(m).padStart(2, '0')}` : ''}`;
  }
  return `${Math.round(v)}${suffix}`;
};

const StatTile: React.FC<{i: number; frame: number; u: number}> = ({i, frame, u}) => {
  const s = c.stats[i];
  const start = STATS_IN + i * 6;
  const p = sp(frame, start, SPRING_POP);
  const count = interpolate(frame, [start + 4, start + 34], [0, 1], {...clamp, easing: easeOut});
  const accent = tileAccents[i % tileAccents.length];
  return (
    <div
      style={{
        height: 16 * u,
        borderRadius: 3.4 * u,
        background: `linear-gradient(150deg, ${accent}24, rgba(255,255,255,0.03))`,
        border: `2px solid ${accent}55`,
        padding: `${2.4 * u}px ${3.2 * u}px`,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        opacity: p,
        transform: `scale(${0.85 + 0.15 * p}) translateY(${(1 - p) * 30}px)`,
      }}
    >
      <div style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 3.3 * u, color: colors.muted}}>{s.label}</div>
      <div style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 7.4 * u, color: colors.white, lineHeight: 1}}>{fmtValue(s.value * count, s.suffix)}</div>
    </div>
  );
};

const Chart: React.FC<{frame: number; u: number; w: number}> = ({frame, u, w}) => {
  const h = 24 * u;
  const n = c.chart.length;
  const barW = (w / n) * 0.46;
  const line = interpolate(frame, [CHART_IN + 24, CHART_IN + 54], [0, 1], {...clamp, easing: easeOut});
  const pts = c.chart.map((d, i) => ({x: (w / n) * (i + 0.5), y: h - d.value * h * 0.92}));
  const path = pts.map((pt, i) => `${i ? 'L' : 'M'}${pt.x} ${pt.y}`).join(' ');
  return (
    <div style={{position: 'relative', width: w, height: h + 6 * u, opacity: sp(frame, CHART_IN - 4, SPRING_SOFT)}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: h, height: 2, background: 'rgba(255,255,255,0.25)'}} />
      {c.chart.map((d, i) => {
        const g = sp(frame, CHART_IN + i * 6, {damping: 18, stiffness: 120});
        const bh = d.value * h * 0.92 * g;
        const last = i === n - 1;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: 'absolute',
                left: (w / n) * (i + 0.5) - barW / 2,
                top: h - bh,
                width: barW,
                height: bh,
                borderRadius: `${1.6 * u}px ${1.6 * u}px 0 0`,
                background: last ? `linear-gradient(180deg, ${colors.amber}, #F29A2E)` : `linear-gradient(180deg, ${colors.sky}CC, ${colors.indigo})`,
              }}
            />
            <div style={{position: 'absolute', left: (w / n) * i, width: w / n, top: h - bh - 4.6 * u, textAlign: 'center', fontFamily: fonts.display, fontWeight: 800, fontSize: 3.2 * u, color: last ? colors.amber : colors.white, opacity: g}}>
              {Math.round(d.value * 100)}&nbsp;%
            </div>
            <div style={{position: 'absolute', left: (w / n) * i, width: w / n, top: h + 1.4 * u, textAlign: 'center', fontFamily: fonts.body, fontWeight: 500, fontSize: 3 * u, color: colors.muted}}>{d.label}</div>
          </React.Fragment>
        );
      })}
      <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <path d={path} fill="none" stroke={colors.mint} strokeWidth={0.6 * u} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - line} />
        {pts.map((pt, i) => (
          <circle key={i} cx={pt.x} cy={pt.y} r={1.1 * u} fill={colors.mint} opacity={line * n > i ? 1 : 0} />
        ))}
      </svg>
    </div>
  );
};

/** Carte de rapport d'activité (largeur w). */
const ReportCard: React.FC<{frame: number; w: number}> = ({frame, w}) => {
  const u = w / 100;
  const enter = sp(frame, CARD_IN, SPRING_SOFT);
  const inner = w - 10 * u;
  const section = (label: string, start: number, color: string = colors.muted) => (
    <div style={{fontFamily: fonts.display, fontWeight: 700, fontSize: 3.6 * u, color, letterSpacing: '0.04em', textTransform: 'uppercase', opacity: interpolate(frame, [start - 6, start + 4], [0, 1], clamp)}}>{label}</div>
  );
  return (
    <div style={{...glass, width: w, borderRadius: 6 * u, padding: 5 * u, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 3 * u, opacity: enter, transform: `translateY(${(1 - enter) * 120}px) rotateX(${(1 - enter) * 12}deg)`}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div>
          <div style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 5.4 * u, color: colors.white}}>{c.title}</div>
          <div style={{fontFamily: fonts.body, fontWeight: 500, fontSize: 3.4 * u, color: colors.muted}}>{c.student}</div>
        </div>
        <svg width={10 * u} height={10 * u} viewBox="0 0 24 24">
          <rect x="4" y="2.5" width="16" height="19" rx="2.5" fill="none" stroke={colors.mint} strokeWidth="1.8" />
          <path d="M8 8 H16 M8 12 H16 M8 16 H12.5" stroke={colors.mint} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.4 * u}}>
        {c.stats.map((_, i) => (
          <StatTile key={i} i={i} frame={frame} u={u} />
        ))}
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 2 * u, flexWrap: 'wrap'}}>
        {section(c.weakLabel, WEAK_IN, colors.coral)}
        {c.weak.map((wk, i) => {
          const p = sp(frame, WEAK_IN + 4 + i * 6, SPRING_POP);
          return (
            <div key={wk} style={{padding: `${1.2 * u}px ${2.8 * u}px`, borderRadius: 999, background: `${colors.coral}22`, border: `2px solid ${colors.coral}88`, fontFamily: fonts.display, fontWeight: 700, fontSize: 3.4 * u, color: colors.white, opacity: p, transform: `scale(${0.7 + 0.3 * p})`, whiteSpace: 'nowrap'}}>
              {wk}
            </div>
          );
        })}
      </div>
      {section(c.chartLabel, CHART_IN)}
      <Chart frame={frame} u={u} w={inner} />
    </div>
  );
};

export const S5Report: React.FC = () => {
  const frame = useCurrentFrame();
  const fmt = useFormat();

  if (fmt.vertical) {
    return (
      <SceneWrap>
        <AbsoluteFill>
          <div style={{position: 'absolute', top: fmt.safeTop, left: fmt.padX, right: fmt.padX, display: 'flex', justifyContent: 'center'}}>
            <KineticText text={c.heading} size={56} delay={2} stagger={3} highlight={['rapports', 'd’activité']} highlightColor={colors.mint} maxWidth={900} />
          </div>
          <div style={{position: 'absolute', top: 332, left: fmt.padX, right: fmt.padX, display: 'flex', justifyContent: 'center'}}>
            <DemoTag frame={frame} start={16} fontSize={23} text={c.demoTag} />
          </div>
          <div style={{position: 'absolute', top: 430, left: 130, perspective: 1600}}>
            <ReportCard frame={frame} w={820} />
          </div>
        </AbsoluteFill>
      </SceneWrap>
    );
  }

  return (
    <SceneWrap>
      <AbsoluteFill>
        <div style={{position: 'absolute', top: 48, left: 70, right: 70, display: 'flex', justifyContent: 'center'}}>
          <KineticText text={c.heading} size={42} delay={2} stagger={3} highlight={['rapports', 'd’activité']} highlightColor={colors.mint} maxWidth={940} />
        </div>
        <div style={{position: 'absolute', top: 108, left: 90, right: 90, display: 'flex', justifyContent: 'center'}}>
          <DemoTag frame={frame} start={16} fontSize={17} text={c.demoTag} />
        </div>
        <div style={{position: 'absolute', top: 186, left: 540 - 310, perspective: 1600}}>
          <ReportCard frame={frame} w={620} />
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

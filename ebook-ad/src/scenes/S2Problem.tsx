import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, easeOut, sp, SPRING_POP, SPRING_SOFT} from '../anim';
import {AnimatedIcon} from '../components/Icons';
import {KineticText} from '../components/KineticText';
import {SceneWrap} from '../components/SceneWrap';
import {glass} from '../components/ui';
import {adConfig} from '../config';
import {useFormat} from '../format';
import {colors, fonts} from '../theme';

const c = adConfig.scene2;

const ProblemCard: React.FC<{i: number; w: number; h: number; frame: number; icon: string; label: string; fontSize: number}> = ({
  i,
  w,
  h,
  frame,
  icon,
  label,
  fontSize,
}) => {
  const d = 8 + i * 9;
  const p = sp(frame, d, SPRING_POP);
  const drawP = interpolate(frame, [d, d + 26], [0, 1], {...clamp, easing: easeOut});
  // Parallaxe : chaque carte dérive légèrement à sa propre vitesse
  const drift = Math.sin((frame + i * 20) / 30) * 6;
  const dim = interpolate(frame, [80, 100], [1, 0.82], clamp);
  return (
    <div
      style={{
        ...glass,
        width: w,
        height: h,
        borderRadius: 34,
        padding: w * 0.08,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        opacity: p * dim,
        transform: `translateY(${(1 - p) * 80 + drift}px) scale(${0.85 + 0.15 * p}) rotate(${(1 - p) * (i % 2 ? 6 : -6)}deg)`,
      }}
    >
      <div
        style={{
          width: h * 0.4,
          height: h * 0.4,
          borderRadius: h * 0.12,
          background: `${colors.coral}22`,
          border: `2px solid ${colors.coral}66`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AnimatedIcon name={icon} size={h * 0.3} p={drawP} f={frame} />
      </div>
      <div style={{fontFamily: fonts.display, fontWeight: 700, color: colors.white, fontSize, lineHeight: 1.18, letterSpacing: '-0.01em'}}>{label}</div>
    </div>
  );
};

const Statement: React.FC<{frame: number; size: number; align?: 'center' | 'left'; maxWidth: number}> = ({frame, size, align = 'center', maxWidth}) => {
  const lineP = interpolate(frame, [128, 148], [0, 1], {...clamp, easing: easeOut});
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-start', gap: size * 0.08}}>
      <KineticText text={c.statementA} size={size} delay={88} stagger={4} align={align} maxWidth={maxWidth} />
      <KineticText text={c.statementB} size={size} delay={100} stagger={4} color={colors.muted} weight={600} align={align} maxWidth={maxWidth} />
      <div style={{position: 'relative'}}>
        <KineticText text={c.statementC} size={size * 1.25} delay={114} color={colors.mint} align={align} maxWidth={maxWidth} />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: -size * 0.12,
            height: size * 0.1,
            borderRadius: size,
            background: colors.mint,
            transform: `scaleX(${lineP})`,
            transformOrigin: align === 'center' ? 'center' : 'left',
          }}
        />
      </div>
    </div>
  );
};

export const S2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const fmt = useFormat();
  const cards = c.problems;
  const shake = frame > 60 && frame < 72 ? Math.sin(frame * 2.2) * 3 : 0;
  const sub = sp(frame, 2, SPRING_SOFT);

  if (fmt.vertical) {
    return (
      <SceneWrap>
        <AbsoluteFill>
          <div
            style={{
              position: 'absolute',
              top: fmt.safeTop,
              left: 0,
              right: 0,
              textAlign: 'center',
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 40,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: colors.coral,
              opacity: sub,
            }}
          >
            Le quotidien des parents
          </div>
          <div
            style={{
              position: 'absolute',
              top: fmt.safeTop + 85,
              left: fmt.padX,
              right: fmt.padX,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 30,
              transform: `translateX(${shake}px)`,
            }}
          >
            {cards.map((card, i) => (
              <ProblemCard key={i} i={i} w={435} h={300} frame={frame} icon={card.icon} label={card.label} fontSize={38} />
            ))}
          </div>
          <div style={{position: 'absolute', top: 1010, left: fmt.padX, right: fmt.padX}}>
            <Statement frame={frame} size={84} maxWidth={900} />
          </div>
        </AbsoluteFill>
      </SceneWrap>
    );
  }

  return (
    <SceneWrap>
      <AbsoluteFill>
        <div
          style={{
            position: 'absolute',
            top: 150,
            left: 70,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 20,
            transform: `translateX(${shake}px)`,
          }}
        >
          {cards.map((card, i) => (
            <ProblemCard key={i} i={i} w={240} h={290} frame={frame} icon={card.icon} label={card.label} fontSize={27} />
          ))}
        </div>
        <div style={{position: 'absolute', top: 150, left: 600, right: 50, height: 600, display: 'flex', alignItems: 'center'}}>
          <Statement frame={frame} size={56} align="left" maxWidth={430} />
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

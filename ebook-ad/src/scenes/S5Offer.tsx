import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, easeOut, sp, SPRING_POP, SPRING_SOFT} from '../anim';
import {Book3D} from '../components/Book3D';
import {KineticText} from '../components/KineticText';
import {SceneWrap} from '../components/SceneWrap';
import {glass, Pill} from '../components/ui';
import {adConfig} from '../config';
import {useFormat} from '../format';
import {colors, fonts} from '../theme';
import {Burst, LightRays} from './S3Solution';

const c = adConfig.scene5;

const PriceTag: React.FC<{frame: number; scale: number}> = ({frame, scale}) => {
  const p = sp(frame, 62, SPRING_POP);
  const shine = interpolate(frame, [86, 116], [-0.3, 1.3], clamp);
  const breathe = 1 + Math.sin(Math.max(0, frame - 90) / 9) * 0.012;
  return (
    <div
      style={{
        ...glass,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 40 * scale,
        padding: `${26 * scale}px ${54 * scale}px ${30 * scale}px`,
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

export const S5Offer: React.FC = () => {
  const frame = useCurrentFrame();
  const fmt = useFormat();
  const bookIn = sp(frame, 0, {damping: 16, stiffness: 80});
  const rotY = interpolate(frame, [0, 180], [-14, 18]);
  const floatY = Math.sin(frame / 20) * 10;
  const chipsIn = (i: number) => sp(frame, 40 + i * 8, SPRING_POP);

  const bookW = fmt.vertical ? 380 : 300;
  const bookH = bookW * 1.5;
  const center = fmt.vertical ? {x: 540, y: 500 + bookH / 2} : {x: 255, y: 175 + bookH / 2};

  const chips = c.chips.map((label, i) => {
    const p = chipsIn(i);
    // Étiquettes flottantes autour du livre (parallaxe différente du livre)
    const pos = fmt.vertical
      ? [
          {x: center.x - 430, y: center.y - 250},
          {x: center.x - 60, y: center.y + 200},
        ][i]
      : [
          {x: center.x - 200, y: center.y - 280},
          {x: center.x - 120, y: center.y + 230},
        ][i];
    if (!pos) return null;
    const drift = Math.sin((frame + i * 30) / 18) * 8;
    return (
      <div key={i} style={{position: 'absolute', left: pos.x, top: pos.y + drift, opacity: p, transform: `scale(${0.6 + 0.4 * p}) rotate(${i === 0 ? -4 : 3}deg)`}}>
        <Pill size={fmt.vertical ? 32 : 24} color={i === 0 ? colors.mint : colors.sky} style={{background: 'rgba(8,16,48,0.85)'}}>
          {label}
        </Pill>
      </div>
    );
  });

  const book = (
    <>
      <div style={{position: 'absolute', left: center.x, top: center.y}}>
        <LightRays size={fmt.vertical ? 1200 : 800} frame={frame} opacity={0.7 * bookIn} color={colors.amber} />
        <Burst frame={frame} start={64} radius={fmt.vertical ? 380 : 260} count={10} />
      </div>
      <div style={{position: 'absolute', left: center.x - bookW / 2, top: center.y - bookH / 2 + floatY, transform: `scale(${0.7 + 0.3 * bookIn})`, opacity: bookIn}}>
        <Book3D width={bookW} rotateY={rotY} rotateX={5} glow={0.8} sheen={interpolate(frame, [20, 56], [-0.2, 1.2], clamp)} />
      </div>
      {chips}
    </>
  );

  if (fmt.vertical) {
    return (
      <SceneWrap>
        <AbsoluteFill>
          {book}
          <div style={{position: 'absolute', top: fmt.safeTop, left: fmt.padX, right: fmt.padX, display: 'flex', justifyContent: 'center'}}>
            <KineticText text={c.badge} size={76} delay={6} stagger={4} highlight={['parents']} maxWidth={760} />
          </div>
          <div style={{position: 'absolute', top: 1105, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            <PriceTag frame={frame} scale={1} />
          </div>
        </AbsoluteFill>
      </SceneWrap>
    );
  }

  return (
    <SceneWrap>
      <AbsoluteFill>
        {book}
        <div style={{position: 'absolute', top: 120, bottom: 200, left: 530, right: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 40}}>
          <KineticText text={c.badge} size={58} delay={6} stagger={4} highlight={['parents']} align="left" maxWidth={490} />
          <div style={{alignSelf: 'flex-start', transformOrigin: 'left center'}}>
            <PriceTag frame={frame} scale={0.72} />
          </div>
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, easeOut, sp, SPRING_POP, SPRING_SOFT} from '../anim';
import {Book3D} from '../components/Book3D';
import {Contact, CtaButton, FinePrint} from '../components/Commerce';
import {Cursor} from '../components/Icons';
import {KineticText} from '../components/KineticText';
import {MiniIcon} from '../components/MiniIcons';
import {SceneWrap} from '../components/SceneWrap';
import {adConfig} from '../config';
import {coverRatio} from '../coverRatio';
import {useFormat} from '../format';
import {colors, fonts} from '../theme';
import {localAt} from '../timeline';
import {Burst, LightRays} from './S3Solution';

const c = adConfig.offer;
// Minutage (frames locales) calé sur la voix : titre → prix → « Commandez maintenant ».
const BADGES = 46;
const PRICE = localAt('offer', 50.0);
const BUTTON = PRICE + 30;
const CLICK = localAt('offer', 52.6);
const CONTACT = BUTTON + 12;
const FINE = BUTTON + 24;
const fine = `${adConfig.legal.ethics} ${adConfig.legal.trademark}`;
const badgeColors = ['#14B8A6', '#E5484D', colors.sky];

/** Panneau de prix rouge et or. */
const PricePanel: React.FC<{frame: number}> = ({frame}) => {
  const p = sp(frame, PRICE, SPRING_POP);
  const shine = interpolate(frame, [PRICE + 20, PRICE + 50], [-0.3, 1.3], clamp);
  const breathe = 1 + Math.sin(Math.max(0, frame - PRICE - 24) / 9) * 0.012;
  return (
    <div style={{position: 'relative', width: 580, borderRadius: 34, overflow: 'hidden', background: 'linear-gradient(180deg, #E5383B, #9B1022)', border: '4px solid #FFC14F', boxShadow: '0 26px 60px rgba(155,16,34,0.5)', opacity: p, transform: `scale(${(0.6 + 0.4 * p) * breathe}) rotate(${(1 - p) * -6}deg)`}}>
      <div style={{textAlign: 'center', padding: '16px 0 8px', fontFamily: fonts.display, fontWeight: 800, fontSize: 34, letterSpacing: '0.06em', color: colors.white}}>{c.priceLabel}</div>
      <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 16, paddingBottom: 18, whiteSpace: 'nowrap'}}>
        <span style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 112, lineHeight: 1, color: '#FFD15C', letterSpacing: '-0.03em', textShadow: '0 4px 0 #A8640E'}}>{c.price}</span>
        <span style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 52, color: '#FFD15C', textShadow: '0 3px 0 #A8640E'}}>{c.currency}</span>
      </div>
      <div style={{position: 'absolute', top: -40, bottom: -40, width: 120, left: `${shine * 100}%`, transform: 'rotate(20deg)', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'}} />
    </div>
  );
};

export const S7Offer: React.FC = () => {
  const frame = useCurrentFrame();
  const fmt = useFormat();
  const bookIn = sp(frame, 4, {damping: 16, stiffness: 80});
  const sub = sp(frame, 28, SPRING_SOFT);
  const rotY = interpolate(frame, [0, 240], [-18, 16]);
  const floatY = Math.sin(frame / 20) * 8;
  const cursorP = interpolate(frame, [CLICK - 22, CLICK], [0, 1], {...clamp, easing: easeOut});
  const cursorOpacity = interpolate(frame, [CLICK - 24, CLICK - 18, CLICK + 24, CLICK + 32], [0, 1, 1, 0], clamp);
  const press = interpolate(frame, [CLICK - 2, CLICK, CLICK + 6], [1, 0.85, 1], clamp);
  const devices = sp(frame, CONTACT + 6, SPRING_SOFT);

  const bookW = 228;
  const bookH = bookW * coverRatio();
  const center = {x: 90 + bookW / 2, y: 588 + bookH / 2};
  const btnW = 900;
  const btnTop = 1088;

  return (
    <SceneWrap noExit>
      <AbsoluteFill>
        <div style={{position: 'absolute', left: center.x, top: center.y}}>
          <LightRays size={900} frame={frame} opacity={0.8 * bookIn} color={colors.amber} />
          <Burst frame={frame} start={PRICE + 2} radius={300} count={10} />
        </div>
        <div style={{position: 'absolute', top: fmt.safeTop, left: fmt.padX, right: fmt.padX, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{filter: 'drop-shadow(0 0 16px rgba(255,181,71,0.45))'}}>
            <KineticText text={c.titleTop} size={80} delay={4} stagger={4} effect="slam" color={colors.amber} maxWidth={900} lineHeight={1.0} letterSpacing={-0.01} />
          </div>
          <KineticText text={c.titleBottom} size={66} delay={14} stagger={4} effect="slam" maxWidth={900} lineHeight={1.0} letterSpacing={-0.01} />
          <div style={{marginTop: 14, maxWidth: 820, textAlign: 'center', fontFamily: fonts.display, fontWeight: 700, fontSize: 32, lineHeight: 1.2, color: colors.white, opacity: sub, transform: `translateY(${(1 - sub) * 16}px)`}}>{c.subtitle}</div>
        </div>
        <div style={{position: 'absolute', left: center.x - bookW / 2, top: center.y - bookH / 2 + floatY, transform: `scale(${0.7 + 0.3 * bookIn})`, opacity: bookIn}}>
          <Book3D width={bookW} rotateY={rotY} rotateX={5} glow={0.8} sheen={interpolate(frame, [16, 52], [-0.2, 1.2], clamp)} />
        </div>
        <div style={{position: 'absolute', top: 630, left: 395}}>
          <PricePanel frame={frame} />
        </div>
        <div style={{position: 'absolute', top: 936, left: fmt.padX, right: fmt.padX, display: 'flex', gap: 14}}>
          {c.badges.map((b, i) => {
            const p = sp(frame, BADGES + i * 7, SPRING_POP);
            const col = badgeColors[i % badgeColors.length];
            return (
              <div key={i} style={{flex: 1, height: 132, borderRadius: 24, border: `2px solid ${colors.amber}77`, background: 'rgba(10,14,34,0.75)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '0 10px', opacity: p, transform: `translateY(${(1 - p) * 40}px)`}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                  <div style={{width: 42, height: 42, borderRadius: 21, background: col, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <MiniIcon name={b.icon} size={26} color={colors.white} />
                  </div>
                  <span style={{fontFamily: fonts.display, fontWeight: 800, fontSize: b.value.length > 6 ? 21 : 36, color: colors.amber, whiteSpace: 'nowrap'}}>{b.value}</span>
                </div>
                <div style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 19, lineHeight: 1.2, color: colors.white, textAlign: 'center'}}>{b.label}</div>
              </div>
            );
          })}
        </div>
        <div style={{position: 'absolute', top: btnTop, left: fmt.padX, width: btnW}}>
          <CtaButton frame={frame} start={BUTTON} click={CLICK} w={btnW} fontSize={42} green />
        </div>
        <div style={{position: 'absolute', top: 1222, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22}}>
          <Contact frame={frame} start={CONTACT} fontSize={28} />
          <div style={{display: 'flex', alignItems: 'center', gap: 6, opacity: devices}}>
            <MiniIcon name="phone" size={30} color={colors.muted} />
            <MiniIcon name="tablet" size={30} color={colors.muted} />
            <MiniIcon name="laptop" size={34} color={colors.muted} />
          </div>
        </div>
        <div style={{position: 'absolute', top: 1282, left: 0, right: 0, textAlign: 'center', fontFamily: fonts.body, fontWeight: 600, fontSize: 22, color: colors.muted, opacity: devices}}>{c.devices}</div>
        <FinePrint frame={frame} start={FINE} fontSize={15} text={fine} style={{position: 'absolute', top: 1318, left: 120, right: 120}} />
        <div style={{position: 'absolute', left: interpolate(cursorP, [0, 1], [1000, fmt.padX + btnW * 0.72 - 10]), top: interpolate(cursorP, [0, 1], [1420, btnTop + 113 * 0.6 - 6]), opacity: cursorOpacity, transform: `scale(${press})`}}>
          <Cursor size={74} />
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

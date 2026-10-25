import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, easeOut, sp, SPRING_SOFT} from '../anim';
import {Book3D} from '../components/Book3D';
import {Contact, CtaButton, FinePrint, PriceTag} from '../components/Commerce';
import {Cursor} from '../components/Icons';
import {SceneWrap} from '../components/SceneWrap';
import {Pill} from '../components/ui';
import {adConfig} from '../config';
import {coverRatio} from '../coverRatio';
import {useFormat} from '../format';
import {colors} from '../theme';
import {Burst, LightRays} from './S3Solution';

const c = adConfig.offer;
// Minutage (frames locales) calé sur la voix : titre → prix → « Commandez maintenant ».
const PRICE = 104;
const BUTTON = 146;
const CLICK = 192;
const CONTACT = 160;
const FINE = 170;
const fine = `${adConfig.legal.ethics} ${adConfig.legal.trademark}`;

export const S7Offer: React.FC = () => {
  const frame = useCurrentFrame();
  const fmt = useFormat();
  const bookIn = sp(frame, 0, {damping: 16, stiffness: 80});
  const kick = sp(frame, 10, SPRING_SOFT);
  const rotY = interpolate(frame, [0, 240], [-16, 18]);
  const floatY = Math.sin(frame / 20) * 8;
  const cursorP = interpolate(frame, [CLICK - 22, CLICK], [0, 1], {...clamp, easing: easeOut});
  const cursorOpacity = interpolate(frame, [CLICK - 24, CLICK - 18, CLICK + 24, CLICK + 32], [0, 1, 1, 0], clamp);
  const press = interpolate(frame, [CLICK - 2, CLICK, CLICK + 6], [1, 0.85, 1], clamp);

  const bookW = fmt.vertical ? 330 : 270;
  const bookH = bookW * coverRatio();
  const center = fmt.vertical ? {x: 540, y: 336 + bookH / 2} : {x: 255, y: 160 + bookH / 2};

  const book = (
    <>
      <div style={{position: 'absolute', left: center.x, top: center.y}}>
        <LightRays size={fmt.vertical ? 1200 : 820} frame={frame} opacity={0.75 * bookIn} color={colors.amber} />
        <Burst frame={frame} start={PRICE + 2} radius={fmt.vertical ? 360 : 260} count={10} />
      </div>
      <div style={{position: 'absolute', left: center.x - bookW / 2, top: center.y - bookH / 2 + floatY, transform: `scale(${0.7 + 0.3 * bookIn})`, opacity: bookIn}}>
        <Book3D width={bookW} rotateY={rotY} rotateX={5} glow={0.8} sheen={interpolate(frame, [16, 52], [-0.2, 1.2], clamp)} />
      </div>
    </>
  );

  if (fmt.vertical) {
    const btnW = 880;
    const btnTop = 1072;
    return (
      <SceneWrap noExit>
        <AbsoluteFill>
          {book}
          <div style={{position: 'absolute', top: fmt.safeTop, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: kick, transform: `translateY(${(1 - kick) * -24}px)`}}>
            <Pill size={36} color={colors.mint} style={{background: 'rgba(8,16,48,0.8)'}}>
              {c.kicker}
            </Pill>
          </div>
          <div style={{position: 'absolute', top: 838, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            <PriceTag frame={frame} start={PRICE} scale={0.9} />
          </div>
          <div style={{position: 'absolute', top: btnTop, left: 100, width: btnW}}>
            <CtaButton frame={frame} start={BUTTON} click={CLICK} w={btnW} fontSize={46} />
          </div>
          <div style={{position: 'absolute', top: 1218, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            <Contact frame={frame} start={CONTACT} fontSize={34} />
          </div>
          <FinePrint frame={frame} start={FINE} fontSize={18} text={fine} style={{position: 'absolute', top: 1296, left: 110, right: 110}} />
          <div style={{position: 'absolute', left: interpolate(cursorP, [0, 1], [1000, 100 + btnW * 0.72 - 10]), top: interpolate(cursorP, [0, 1], [1420, btnTop + 124 * 0.6 - 6]), opacity: cursorOpacity, transform: `scale(${press})`}}>
            <Cursor size={78} />
          </div>
        </AbsoluteFill>
      </SceneWrap>
    );
  }

  const btnW = 560;
  const left = 470;
  return (
    <SceneWrap noExit>
      <AbsoluteFill>
        {book}
        <div style={{position: 'absolute', top: 150, left, width: btnW, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
          <div style={{opacity: kick, transform: `translateY(${(1 - kick) * -20}px)`}}>
            <Pill size={28} color={colors.mint}>
              {c.kicker}
            </Pill>
          </div>
          <PriceTag frame={frame} start={PRICE} scale={0.74} />
          <div style={{width: btnW}}>
            <CtaButton frame={frame} start={BUTTON} click={CLICK} w={btnW} fontSize={32} />
          </div>
          <Contact frame={frame} start={CONTACT} fontSize={25} />
        </div>
        <FinePrint frame={frame} start={FINE} fontSize={16} text={fine} style={{position: 'absolute', top: 800, left: 90, right: 90}} />
        <div style={{position: 'absolute', left: interpolate(cursorP, [0, 1], [1000, left + btnW * 0.72 - 8]), top: interpolate(cursorP, [0, 1], [900, 462]), opacity: cursorOpacity, transform: `scale(${press})`}}>
          <Cursor size={60} />
        </div>
      </AbsoluteFill>
    </SceneWrap>
  );
};

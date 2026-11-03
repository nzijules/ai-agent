import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Kinetic} from '../components/Fx';
import {Person, PersonProps, SKINS} from '../components/Person';
import {Office} from '../components/Office';
import {C, F, easeInOut, inOut, lerp, prog, rnd, sp} from '../lib';
import {CUE} from '../timing';

const PANELS: {label: string; bg: string; p: Partial<PersonProps>}[] = [
  {label: "CENTRE D'APPELS", bg: 'office', p: {skin: SKINS[1], hair: 'bun', outfit: C.yellow, accent: '#111', headset: true, earrings: true, mood: 'focused', seed: 2}},
  {label: 'AGENCE', bg: 'linear-gradient(160deg,#FFCB05,#f0a800)', p: {skin: SKINS[0], hair: 'short', outfit: '#111', accent: C.yellow, mood: 'smile', seed: 4}},
  {label: 'BACK-OFFICE', bg: 'linear-gradient(160deg,#1c2433,#0d1018)', p: {skin: SKINS[2], hair: 'wrap', wrapColor: '#0F766E', outfit: '#f5f5f5', accent: '#0F766E', glasses: true, mood: 'focused', seed: 7, look: -0.4, lookY: 0.4}},
];

const MOSAIC: Partial<PersonProps>[] = [...Array(15)].map((_, i) => ({
  skin: SKINS[i % SKINS.length],
  hair: (['short', 'bun', 'wrap', 'braids', 'fade', 'locs', 'bald'] as const)[(i * 3) % 7],
  outfit: [C.yellow, '#111', '#fff', C.yellow, '#2C5DAA'][i % 5],
  accent: ['#111', C.yellow, C.yellow, '#111', '#fff'][i % 5],
  wrapColor: ['#C2410C', '#7C3AED', '#0F766E'][i % 3],
  headset: i % 3 === 0,
  glasses: i % 4 === 2,
  beard: i % 5 === 3,
  earrings: i % 2 === 1,
  mood: i % 3 === 1 ? 'smile' : 'neutral',
  seed: i,
}));

export const S5: React.FC<{t: number}> = ({t}) => {
  const montO = 1 - prog(t, CUE.chacun - 0.2, 0.4);
  const mosO = prog(t, CUE.chacun - 0.3, 0.4);
  const values: [number, string][] = [[CUE.vigilance, 'VIGILANCE'], [CUE.integrite, 'INTÉGRITÉ'], [CUE.responsabilite, 'RESPONSABILITÉ']];
  const each: [number, string][] = [[CUE.interaction, 'À CHAQUE INTERACTION.'], [CUE.verification, 'À CHAQUE VÉRIFICATION.'], [CUE.decision, 'À CHAQUE DÉCISION.']];
  const cv = [...values].reverse().find(([a]) => t >= a);
  const ce = [...each].reverse().find(([a]) => t >= a);
  const wipe = prog(t, CUE.s6 - 0.45, 0.5, easeInOut);
  return (
    <AbsoluteFill style={{background: C.black, overflow: 'hidden'}}>
      {montO > 0 && (
        <AbsoluteFill style={{opacity: montO}}>
          {PANELS.map((pn, i) => {
            const p = sp(t, CUE.s5 + 0.15 + i * 0.35, {damping: 18});
            return (
              <div key={i} style={{position: 'absolute', left: i * 640, top: 0, width: 640, height: 1080, overflow: 'hidden', transform: `translateY(${(1 - p) * (i % 2 ? -1100 : 1100)}px)`, borderRight: '6px solid #000'}}>
                {pn.bg === 'office' ? (
                  <div style={{position: 'absolute', left: -640, top: 0, width: 1920, height: 1080}}><Office t={t} mood="day" blurBg={6} /></div>
                ) : (
                  <div style={{position: 'absolute', inset: 0, background: pn.bg}} />
                )}
                <div style={{position: 'absolute', left: 20, top: 260, transform: `scale(${lerp(1.0, 1.08, prog(t, CUE.s5, 4.5))})`}}>
                  <Person t={t} width={600} {...pn.p} />
                </div>
                <div style={{position: 'absolute', left: 40, top: 60, background: '#000', color: C.yellow, fontFamily: F.display, fontWeight: 800, fontSize: 28, letterSpacing: 5, padding: '10px 20px'}}>{pn.label}</div>
              </div>
            );
          })}
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,.75))'}} />
          {cv && (
            <div key={cv[1]} style={{position: 'absolute', left: 0, right: 0, bottom: 110, display: 'flex', justifyContent: 'center'}}>
              <Kinetic t={t} at={cv[0]} text={cv[1]} size={130} color="#fff" mode="track" stagger={0.02} />
            </div>
          )}
        </AbsoluteFill>
      )}
      {mosO > 0 && (
        <AbsoluteFill style={{opacity: mosO, transform: `scale(${lerp(1.15, 1.0, prog(t, CUE.chacun, 5, easeInOut))})`}}>
          {MOSAIC.map((pp, i) => {
            const col = i % 5, row = Math.floor(i / 5);
            const p = sp(t, CUE.chacun - 0.2 + rnd(i) * 0.6, {damping: 16});
            const fx = (rnd(i + 20) - 0.5) * 3000, fy = (rnd(i + 40) - 0.5) * 2000;
            const bg = [C.yellow, '#1b1d22', '#f3efe4'][(col + row) % 3];
            return (
              <div key={i} style={{position: 'absolute', left: 10 + col * 382, top: 10 + row * 356, width: 372, height: 346, background: bg, overflow: 'hidden', borderRadius: 18, transform: `translate(${(1 - p) * fx}px, ${(1 - p) * fy}px) rotate(${(1 - p) * 40}deg)`}}>
                <div style={{position: 'absolute', left: 36, top: 40}}><Person t={t} width={300} {...pp} /></div>
              </div>
            );
          })}
          <AbsoluteFill style={{background: `rgba(0,0,0,${0.35 + prog(t, CUE.interaction - 0.3, 0.4) * 0.25})`}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 440, display: 'flex', justifyContent: 'center'}}>
            {!ce ? (
              <div style={{background: '#000', padding: '24px 60px', transform: `scaleX(${sp(t, CUE.chacun + 0.1)})`}}>
                <Kinetic t={t} at={CUE.chacun + 0.15} text="CHACUN DE NOUS" size={130} color={C.yellow} mode="slam" stagger={0.02} />
              </div>
            ) : (
              <div key={ce[1]} style={{background: C.yellow, padding: '24px 60px', transform: `scale(${sp(t, ce[0], {damping: 12, stiffness: 240})})`}}>
                <Kinetic t={t} at={ce[0]} text={ce[1]} size={96} color={C.black} mode="rise" stagger={0.01} />
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}
      {/* volet jaune vers la scène finale */}
      {wipe > 0 && <div style={{position: 'absolute', left: 960 - 1200 * wipe, top: 540 - 1200 * wipe, width: 2400 * wipe, height: 2400 * wipe, borderRadius: '50%', background: C.yellow}} />}
    </AbsoluteFill>
  );
};

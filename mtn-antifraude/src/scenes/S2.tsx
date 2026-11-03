import React from 'react';
import {AbsoluteFill} from 'remotion';
import {AgentDesk} from '../components/AgentDesk';
import {Bokeh, Glitch, Kinetic, RGBSplit} from '../components/Fx';
import {PinIcon, ProfileIcon, SimIcon} from '../components/Icons';
import {Office} from '../components/Office';
import {Hooded} from '../components/Person';
import {Bubble, Cursor} from '../components/UI';
import {C, F, drift, easeInOut, inOut, lerp, prog, sp} from '../lib';
import {CUE} from '../timing';

const Grid: React.FC<{t: number; color?: string}> = ({t, color = 'rgba(255,203,5,.10)'}) => (
  <AbsoluteFill style={{perspective: 900}}>
    <div style={{position: 'absolute', left: -800, right: -800, top: 560, height: 1400, transform: 'rotateX(72deg)', transformOrigin: '50% 0', backgroundImage: `linear-gradient(${color} 2px, transparent 2px), linear-gradient(90deg, ${color} 2px, transparent 2px)`, backgroundSize: '120px 120px', backgroundPosition: `0 ${(t * 60) % 120}px`}} />
  </AbsoluteFill>
);

const CARDS = [
  {cue: CUE.sim, label: 'Remplacement de carte SIM'},
  {cue: CUE.pin, label: 'Réinitialisation PIN Mobile Money'},
  {cue: CUE.modif, label: 'Modification des données client'},
];

export const S2: React.FC<{t: number}> = ({t}) => {
  const dr = drift(t, 5, 2);
  const evil = prog(t, CUE.fraudeur, 0.8, easeInOut); // bascule vers le point de vue du fraudeur
  const splitIn = prog(t, CUE.split - 0.1, 0.5, easeInOut);
  const gl = Math.max(inOut(t, CUE.split - 0.25, CUE.split + 0.25, 0.08, 0.2), inOut(t, CUE.opportunite - 0.1, CUE.opportunite + 0.3, 0.05, 0.2) * 0.7, inOut(t, CUE.click, CUE.click + 0.5, 0.05, 0.2));
  const shiftX = lerp(0, 330, evil);
  const words: [number, string][] = [[CUE.urgence, 'URGENCE'], [CUE.confiance, 'CONFIANCE'], [CUE.negligence, 'NÉGLIGENCE'], [CUE.complicite, 'COMPLICITÉ']];
  const curW = [...words].reverse().find(([a]) => t >= a);
  const curIdx = curW ? words.indexOf(curW) : -1;
  const wordOut = curIdx === 2 ? CUE.complicite - 0.6 : 999;
  const shake = curW ? Math.max(0, 1 - (t - curW[0]) * 4) * 10 : 0;
  // hésitation du curseur puis clic
  const hes = prog(t, CUE.split + 0.5, 3.5);
  const cx = lerp(620, 300, hes) + Math.sin(t * 7) * 18 * (1 - prog(t, CUE.click - 0.6, 0.5));
  const cy = lerp(520, 395, hes) + Math.cos(t * 5) * 10 * (1 - prog(t, CUE.click - 0.6, 0.5));
  const press = inOut(t, CUE.click, CUE.click + 0.25, 0.05, 0.1);

  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, ${evil > 0.5 ? '#2a0b10' : '#16203a'}, #070910)`, overflow: 'hidden'}}>
      {/* Partie A–C : les opérations sensibles */}
      {splitIn < 1 && (
        <AbsoluteFill style={{opacity: 1 - splitIn, transform: `translate(${dr.x}px,${dr.y}px)`}}>
          <Grid t={t} color={evil > 0.5 ? 'rgba(229,51,42,.14)' : 'rgba(255,203,5,.10)'} />
          <Bokeh t={t} n={14} color={evil > 0.5 ? '229,51,42' : '255,203,5'} o={0.18} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 110, display: 'flex', justifyContent: 'center', transform: `translateX(${shiftX * 0.5}px)`}}>
            {t < CUE.opportunite ? (
              <Kinetic t={t} at={CUE.courantes} text="OPÉRATIONS COURANTES" size={80} color={C.yellow} mode="track" stagger={0.015} style={{opacity: 1 - evil * 0.6}} />
            ) : (
              <RGBSplit amt={Math.max(0, 1 - (t - CUE.opportunite) * 2) * 14}>
                <Kinetic t={t} at={CUE.opportunite} text="OPPORTUNITÉ ?" size={110} color={C.red} mode="slam" stagger={0.02} />
              </RGBSplit>
            )}
          </div>
          {CARDS.map((c, i) => {
            const p = sp(t, c.cue, {damping: 15});
            const next = CARDS[i + 1];
            const focus = t >= c.cue && (!next || t < next.cue) && t < CUE.courantes ? 1 : 0;
            const x = 960 + (i - 1) * 470 * lerp(1, 0.78, evil) + shiftX;
            const sc = lerp(1, 0.82, evil) * (1 + focus * 0.06);
            const col = evil > 0.5 ? C.red : C.black;
            const dots = Math.floor(((t - CUE.pin) * 4) % 6);
            return (
              <div key={i} style={{position: 'absolute', left: x - 200, top: 300, width: 400, height: 500, borderRadius: 34, background: '#fff', transform: `perspective(1200px) translateY(${(1 - p) * 500}px) rotateX(${(1 - p) * 50}deg) rotateY(${(i - 1) * -6}deg) scale(${sc})`, opacity: Math.min(1, p * 2), boxShadow: `0 40px 90px rgba(0,0,0,.5), 0 0 0 ${evil > 0.5 ? 6 : focus * 6}px ${evil > 0.5 ? C.red : C.yellow}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30}}>
                <div style={{width: 230, height: 230, borderRadius: 115, background: evil > 0.5 ? '#ffe5e3' : '#FFF3C4', display: 'grid', placeItems: 'center'}}>
                  {i === 0 && <SimIcon p={prog(t, c.cue + 0.1, 1)} size={150} color={col} sw={5} />}
                  {i === 1 && <PinIcon p={prog(t, c.cue + 0.1, 0.6)} size={150} color={col} dots={dots} />}
                  {i === 2 && <ProfileIcon p={prog(t, c.cue + 0.1, 1)} size={150} color={col} sw={5} />}
                </div>
                <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 34, textAlign: 'center', color: C.black, padding: '0 34px', lineHeight: 1.2}}>{c.label}</div>
              </div>
            );
          })}
          {/* le fraudeur */}
          <div style={{position: 'absolute', left: lerp(-700, 20, evil), top: 250, opacity: evil}}>
            <Hooded t={t} width={680} />
          </div>
        </AbsoluteFill>
      )}

      {/* Partie D : écran partagé */}
      {splitIn > 0 && (
        <AbsoluteFill style={{opacity: splitIn, transform: `translate(${shake * Math.sin(t * 90)}px, 0)`}}>
          <div style={{position: 'absolute', left: 0, top: 0, width: 960, height: 1080, overflow: 'hidden', background: 'radial-gradient(ellipse at 40% 60%, #4a0d10, #0a0304 75%)'}}>
            <div style={{position: 'absolute', left: 110, top: 300}}>
              <Hooded t={t} width={700} />
            </div>
            <div style={{position: 'absolute', left: 40, top: 40, fontFamily: F.display, fontWeight: 800, letterSpacing: 6, fontSize: 24, color: 'rgba(255,255,255,.6)'}}>LE DEMANDEUR</div>
          </div>
          <div style={{position: 'absolute', left: 960, top: 0, width: 960, height: 1080, overflow: 'hidden'}}>
            <div style={{position: 'absolute', left: -480, top: 0, width: 1920, height: 1080, transform: 'scale(1.0)', transformOrigin: '50% 50%'}}>
              <Office t={t} mood="dim" />
              <div style={{position: 'absolute', inset: 0, transform: 'translateX(130px)'}}>
                <AgentDesk t={t} dark person={{mood: 'worried', look: 0.6 + Math.sin(t * 2) * 0.3, lookY: 0.3}} console={{t, mode: 'risk', btnHot: hes, validated: prog(t, CUE.click + 0.05, 0.05)}} screenOverlay={<Cursor x={cx} y={cy} press={press} scale={0.8} />} />
              </div>
            </div>
            <div style={{position: 'absolute', right: 40, top: 40, fontFamily: F.display, fontWeight: 800, letterSpacing: 6, fontSize: 24, color: 'rgba(255,255,255,.75)'}}>L'AGENT</div>
          </div>
          <div style={{position: 'absolute', left: 955, top: 0, width: 10, height: 1080, background: C.yellow, boxShadow: '0 0 30px rgba(255,203,5,.7)'}} />
          {/* pression */}
          <Bubble text="C'est urgent !" p={sp(t, CUE.split + 0.0)} style={{left: 520, top: 170}} />
          <Bubble text="Mon téléphone ne fonctionne plus !" p={sp(t, CUE.split + 1.0)} style={{left: 560, top: 300}} />
          <Bubble text="Faites vite !" p={sp(t, CUE.split + 2.1)} style={{left: 760, top: 430}} />
          {/* mots-clés */}
          {curW && (
            <div style={{position: 'absolute', left: 0, right: 0, top: 730, display: 'flex', justifyContent: 'center'}}>
              <div style={{background: curIdx === 3 ? C.red : C.black, padding: '22px 60px', borderRadius: 8, transform: `rotate(-2deg) scale(${sp(t, curW[0], {damping: 10, stiffness: 260})})`, opacity: t > wordOut ? 1 - prog(t, wordOut, 0.3) : 1, boxShadow: '0 30px 60px rgba(0,0,0,.6)'}}>
                <RGBSplit amt={Math.max(0, 1 - (t - curW[0]) * 3) * 12}>
                  <div style={{fontFamily: F.display, fontWeight: 900, fontSize: 130, color: curIdx === 3 ? '#fff' : C.yellow, letterSpacing: 4, lineHeight: 1}}>{curW[1]}</div>
                </RGBSplit>
              </div>
            </div>
          )}
          <AbsoluteFill style={{background: C.red, opacity: inOut(t, CUE.click + 0.05, CUE.click + 0.4, 0.03, 0.3) * 0.6}} />
        </AbsoluteFill>
      )}
      <Glitch i={gl} seedT={t} />
    </AbsoluteFill>
  );
};

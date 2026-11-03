import React from 'react';
import {AbsoluteFill} from 'remotion';
import {AgentDesk, MONITOR_CENTER} from '../components/AgentDesk';
import {Bokeh, Glitch, Kinetic, Tag} from '../components/Fx';
import {Office} from '../components/Office';
import {ConsoleScreen, Cursor, Phone} from '../components/UI';
import {C, F, drift, easeInOut, easeOut, inOut, lerp, prog, sp} from '../lib';
import {CUE} from '../timing';

const BTN = {x: 474, y: 615};

export const S1: React.FC<{t: number}> = ({t}) => {
  // A — écran noir, notification
  const phoneOn = prog(t, 0.25, 0.35);
  const notif = sp(t, CUE.notif);
  const dive = prog(t, 1.45, 0.6, easeInOut);
  const flash = inOut(t, 1.8, 2.3, 0.12, 0.35);
  // B — plateau
  const officeIn = prog(t, 1.9, 0.4);
  const camS = lerp(1.22, 1.04, prog(t, 1.9, 7.5, easeOut));
  const push = prog(t, CUE.push, 1.4, easeInOut);
  const dr = drift(t, 7);
  // C — écran console plein cadre
  const consoleIn = prog(t, CUE.push + 1.2, 0.18);
  const zoom = lerp(1, 1.75, prog(t, CUE.push + 1.3, 4.2, easeInOut));
  const cur = prog(t, CUE.push + 1.6, 2.4, easeInOut);
  const curX = lerp(1250, BTN.x + 30, cur), curY = lerp(940, BTN.y + 8, cur);
  const hot = prog(t, CUE.push + 3.6, 0.6);
  const darken = prog(t, CUE.uneDemande - 0.4, 1.0);
  const redPulse = Math.max(0, Math.sin((t - CUE.unRisque) * 6)) * prog(t, CUE.unRisque, 0.2);
  const gl = inOut(t, 13.75, 14.5, 0.1, 0.2);

  const chips = ['Demande traitée', 'Difficulté résolue', 'Client accompagné'];
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      {/* B : plateau Customer Services */}
      {t > 1.8 && consoleIn < 1 && (
        <AbsoluteFill style={{opacity: officeIn, transform: `translate(${dr.x}px,${dr.y}px) scale(${camS * lerp(1, 2.5, push)})`, transformOrigin: `${lerp(960, MONITOR_CENTER.x, push)}px ${lerp(540, MONITOR_CENTER.y, push)}px`}}>
          <Office t={t} mood="day" />
          <AgentDesk t={t} person={{mood: 'smile', look: 0.85, talking: t > CUE.serve && t < CUE.push ? 0.7 : 0}} console={{t, mode: 'risk', urgentBlink: true}} />
          <Bokeh t={t} n={10} color="255,240,200" o={0.25} />
        </AbsoluteFill>
      )}
      {t > 1.8 && t < CUE.push + 0.6 && (
        <>
          <Tag t={t} at={2.6} out={CUE.push - 0.3} text="Customer Services · Abidjan" />
          {chips.map((c, i) => {
            const a = CUE.serve + 0.3 + i * 1.1;
            const p = sp(t, a);
            const o = inOut(t, a, CUE.push + 0.2, 0.3, 0.4);
            return (
              <div key={c} style={{position: 'absolute', right: 120, top: 140 + i * 96, opacity: o, transform: `translateX(${(1 - p) * 80}px)`, background: 'rgba(255,255,255,.92)', borderRadius: 40, padding: '16px 30px 16px 18px', display: 'flex', alignItems: 'center', gap: 16, fontFamily: F.ui, fontWeight: 700, fontSize: 32, color: C.black, boxShadow: '0 12px 30px rgba(0,0,0,.18)'}}>
                <span style={{width: 40, height: 40, borderRadius: 20, background: C.green, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 26}}>✓</span>
                {c}
              </div>
            );
          })}
        </>
      )}
      {/* C : console plein cadre, zoom sur le bouton */}
      {consoleIn > 0 && (
        <AbsoluteFill style={{opacity: consoleIn}}>
          <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: `${BTN.x}px ${BTN.y}px`}}>
            <ConsoleScreen t={t} mode="risk" btnHot={hot} />
            <Cursor x={curX} y={curY} scale={1.1} />
          </AbsoluteFill>
          <AbsoluteFill style={{background: `linear-gradient(90deg, rgba(0,0,0,0) 15%, rgba(5,5,8,${0.95 * darken}) 50%)`}} />
          <AbsoluteFill style={{boxShadow: `inset 0 0 ${260 * redPulse}px rgba(229,51,42,${0.8 * redPulse})`}} />
          <div style={{position: 'absolute', right: 110, top: 330, textAlign: 'right'}}>
            <Kinetic t={t} at={CUE.uneDemande} text="UNE DEMANDE." size={120} mode="rise" style={{justifyContent: 'flex-end'}} />
            <div style={{height: 30}} />
            <Kinetic t={t} at={CUE.unRisque} text="UN RISQUE." size={150} mode="slam" color={C.red} style={{justifyContent: 'flex-end'}} />
          </div>
        </AbsoluteFill>
      )}
      {/* A : smartphone dans le noir */}
      {dive < 1 && (
        <AbsoluteFill style={{display: 'grid', placeItems: 'center', background: `rgba(0,0,0,${1 - officeIn})`}}>
          <div style={{transform: `scale(${lerp(1, 7, dive)}) translateY(${Math.sin(t * 1.3) * 6}px)`, opacity: 1 - prog(t, 1.85, 0.2)}}>
            <Phone w={330} glow={phoneOn * 0.6}>
              <div style={{position: 'absolute', inset: 0, background: `linear-gradient(160deg,#1d2433,#0a0c12)`, opacity: phoneOn}} />
              <div style={{position: 'absolute', top: 110, width: '100%', textAlign: 'center', color: '#fff', fontFamily: F.ui, opacity: phoneOn}}>
                <div style={{fontSize: 64, fontWeight: 300}}>08:47</div>
              </div>
              <div style={{position: 'absolute', left: 14, right: 14, top: 250, transform: `translateY(${(1 - notif) * -60}px)`, opacity: notif, background: 'rgba(255,255,255,.95)', borderRadius: 22, padding: '16px 18px', fontFamily: F.ui}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, color: '#666'}}>
                  <span style={{width: 22, height: 22, borderRadius: 6, background: C.yellow}} /> SERVICE CLIENT · maintenant
                </div>
                <div style={{fontSize: 20, fontWeight: 700, marginTop: 8, color: '#111'}}>Nouvelle demande</div>
                <div style={{fontSize: 18, color: '#333', marginTop: 4}}>Remplacement de carte SIM</div>
              </div>
            </Phone>
          </div>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{background: '#fff8e0', opacity: flash * 0.9, pointerEvents: 'none'}} />
      <Glitch i={gl} seedT={t} />
    </AbsoluteFill>
  );
};

import React from 'react';
import {AbsoluteFill} from 'remotion';
import {AgentDesk} from '../components/AgentDesk';
import {Bokeh, Kinetic, LightLeak} from '../components/Fx';
import {AlertIcon, CheckBadge, DocCheckIcon, IdIcon, ListIcon, LockIcon, WarnBadge} from '../components/Icons';
import {Office} from '../components/Office';
import {C, F, drift, easeInOut, inOut, lerp, prog, sp} from '../lib';
import {CUE} from '../timing';

const R = [
  {cue: CUE.r1, I: IdIcon, title: 'IDENTITÉ\nVÉRIFIÉE', sub: 'Vérifier le demandeur'},
  {cue: CUE.r2, I: DocCheckIcon, title: 'DEMANDE\nAUTHENTIFIÉE', sub: 'Confirmer la légitimité'},
  {cue: CUE.r3, I: ListIcon, title: 'PROCÉDURE\nRESPECTÉE', sub: 'Validations requises'},
  {cue: CUE.r4, I: AlertIcon, title: 'ANOMALIE\nSIGNALÉE', sub: 'Suspendre & alerter'},
];

export const S4: React.FC<{t: number}> = ({t}) => {
  const dr = drift(t, 5, 6);
  const deskO = 1 - prog(t, CUE.r1 - 0.35, 0.35);
  const gridO = prog(t, CUE.r1 - 0.35, 0.35) * (1 - prog(t, CUE.aucuneUrgence - 0.35, 0.35));
  const finalO = prog(t, CUE.aucuneUrgence - 0.35, 0.35);
  const words: [number, string][] = [[CUE.aucuneUrgence, 'URGENCE'], [CUE.aucunePression, 'PRESSION'], [CUE.aucunAvantage, 'AVANTAGE PERSONNEL']];
  const wordsUp = prog(t, CUE.contourner, 0.6, easeInOut);
  return (
    <AbsoluteFill style={{background: C.paper, overflow: 'hidden'}}>
      {/* A — l'agent suspend l'opération et applique les contrôles */}
      {deskO > 0 && (
        <AbsoluteFill style={{opacity: deskO, transform: `translate(${dr.x}px,${dr.y}px) scale(${lerp(1.12, 1.0, prog(t, CUE.s4, 4, easeInOut))})`}}>
          <Office t={t} mood="bright" />
          <AgentDesk t={t} person={{mood: 'focused', look: 0.9, talking: 0}} console={{t, mode: 'safe', paused: prog(t, CUE.s4 + 0.6, 0.4), checks: Math.floor(prog(t, CUE.s4 + 1.2, 2.4, (x) => x) * 3.2)}} />
          <Bokeh t={t} n={12} color="255,230,150" o={0.3} />
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,.55))'}} />
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 90, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
            <Kinetic t={t} at={CUE.s4 + 0.5} text="AVANT CHAQUE OPÉRATION SENSIBLE" size={44} color="#fff" mode="rise" stagger={0.01} />
            <div style={{background: C.yellow, padding: '10px 40px', transform: `scaleX(${sp(t, CUE.reflexes)})`}}>
              <Kinetic t={t} at={CUE.reflexes + 0.1} text="LES BONS RÉFLEXES" size={100} color={C.black} mode="slam" stagger={0.02} />
            </div>
          </div>
        </AbsoluteFill>
      )}
      <LightLeak t={t} at={CUE.s4 - 0.4} dur={1.8} />
      {/* B — quatre réflexes */}
      {gridO > 0 && (
        <AbsoluteFill style={{opacity: gridO, background: `radial-gradient(ellipse at 50% 30%, #fffdf4, ${C.paper})`}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 90, display: 'flex', justifyContent: 'center'}}>
            <Kinetic t={t} at={CUE.r1 - 0.2} text="4 RÉFLEXES ESSENTIELS" size={56} color={C.black} mode="track" stagger={0.01} />
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 230, display: 'flex', justifyContent: 'center', gap: 44}}>
            {R.map((r, i) => {
              const p = sp(t, r.cue, {damping: 15});
              const next = R[i + 1];
              const active = t >= r.cue && (!next || t < next.cue);
              const badge = prog(t, r.cue + 0.5, 0.6);
              const isWarn = i === 3;
              return (
                <div key={i} style={{width: 390, height: 600, borderRadius: 36, background: active ? '#fff' : '#fbfaf6', border: `5px solid ${active ? (isWarn ? C.red : C.yellow) : '#ebe7dc'}`, boxShadow: active ? '0 40px 80px rgba(0,0,0,.16)' : '0 12px 30px rgba(0,0,0,.06)', transform: `translateY(${(1 - p) * 300 - (active ? 16 : 0)}px) scale(${active ? 1.04 : 1})`, opacity: Math.min(1, p * 2), position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60}}>
                  <div style={{position: 'absolute', left: 30, top: 24, fontFamily: F.display, fontWeight: 900, fontSize: 40, color: '#d9d3c3'}}>0{i + 1}</div>
                  <div style={{width: 210, height: 210, borderRadius: 105, background: isWarn ? '#ffe9e7' : '#FFF3C4', display: 'grid', placeItems: 'center'}}>
                    <r.I size={140} p={prog(t, r.cue + 0.1, 0.8)} color={isWarn ? C.red : C.black} sw={5} />
                  </div>
                  <div style={{fontFamily: F.display, fontWeight: 900, fontSize: 40, lineHeight: 1.1, textAlign: 'center', color: C.black, marginTop: 40, whiteSpace: 'pre'}}>{r.title}</div>
                  <div style={{fontFamily: F.ui, fontWeight: 500, fontSize: 28, color: '#6b6f76', marginTop: 16}}>{r.sub}</div>
                  <div style={{position: 'absolute', bottom: -45}}>{isWarn ? <WarnBadge p={badge} t={t} /> : <CheckBadge p={badge} />}</div>
                </div>
              );
            })}
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 60, display: 'flex', justifyContent: 'center', gap: 30}}>
            {([[CUE.suspendre, 'SUSPENDRE L\'OPÉRATION', C.black], [CUE.alerte, 'DONNER L\'ALERTE', C.red]] as [number, string, string][]).map(([a, s, col], i) => {
              const p = sp(t, a);
              return (
                <div key={i} style={{background: col, color: '#fff', fontFamily: F.display, fontWeight: 800, fontSize: 34, letterSpacing: 2, padding: '16px 34px', borderRadius: 50, transform: `scale(${p})`, opacity: Math.min(1, p * 2)}}>
                  {s}
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}
      {/* C — aucune urgence ne justifie de contourner un contrôle */}
      {finalO > 0 && (
        <AbsoluteFill style={{opacity: finalO, background: C.ink}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: lerp(250, 70, wordsUp), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: lerp(30, 6, wordsUp), transform: `scale(${lerp(1, 0.55, wordsUp)})`, opacity: lerp(1, 0.5, wordsUp)}}>
            {words.map(([a, w], i) => {
              const strike = prog(t, a + 0.55, 0.3);
              return (
                <div key={i} style={{position: 'relative'}}>
                  <Kinetic t={t} at={a} text={w} size={130} color="#fff" mode="rise" stagger={0.015} />
                  <div style={{position: 'absolute', left: -20, right: -20, top: '52%', height: 16, background: C.red, transform: `scaleX(${strike}) rotate(-2deg)`, transformOrigin: '0 50%'}} />
                </div>
              );
            })}
          </div>
          {t > CUE.contourner && (
            <div style={{position: 'absolute', left: 0, right: 0, top: 470, display: 'flex', justifyContent: 'center'}}>
              <div style={{background: C.yellow, padding: '50px 80px', display: 'flex', alignItems: 'center', gap: 50, transform: `scaleY(${sp(t, CUE.contourner + 0.1)})`, boxShadow: '0 40px 100px rgba(0,0,0,.5)'}}>
                <LockIcon size={170} p={prog(t, CUE.contourner + 0.4, 0.8)} color={C.black} sw={7} />
                <div>
                  <Kinetic t={t} at={CUE.contourner + 0.25} text="AUCUNE URGENCE NE JUSTIFIE" size={66} color={C.black} mode="rise" stagger={0.008} style={{justifyContent: 'flex-start'}} />
                  <div style={{height: 14}} />
                  <Kinetic t={t} at={CUE.contourner + 0.6} text="DE CONTOURNER UN CONTRÔLE." size={66} color={C.black} mode="rise" stagger={0.008} style={{justifyContent: 'flex-start'}} />
                </div>
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{background: '#fff', opacity: inOut(t, CUE.s4, CUE.s4 + 0.6, 0.05, 0.5) * 0.7, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};

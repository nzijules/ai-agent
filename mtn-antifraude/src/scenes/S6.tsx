import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Kinetic} from '../components/Fx';
import {AccountIcon} from '../components/Icons';
import {C, F, easeInOut, inOut, lerp, prog, sp} from '../lib';
import {CUE, DURATION_S} from '../timing';

const Shield: React.FC<{t: number; at: number; size: number}> = ({t, at, size}) => {
  // bouclier numérique : segments hexagonaux qui s'assemblent
  const segs = 6;
  return (
    <svg viewBox="-150 -150 300 300" width={size} height={size} style={{overflow: 'visible'}}>
      {[...Array(segs)].map((_, i) => {
        const p = sp(t, at + i * 0.12, {damping: 14});
        const a0 = (i / segs) * Math.PI * 2 - Math.PI / 2, a1 = ((i + 1) / segs) * Math.PI * 2 - Math.PI / 2;
        const R = 130, r = 108, g = 0.04;
        const pt = (a: number, rr: number) => `${Math.cos(a) * rr},${Math.sin(a) * rr}`;
        const off = (1 - p) * 200;
        const am = (a0 + a1) / 2;
        return (
          <polygon key={i} points={`${pt(a0 + g, R)} ${pt(a1 - g, R)} ${pt(a1 - g, r)} ${pt(a0 + g, r)}`} fill={C.black} opacity={Math.min(1, p * 1.5)} transform={`translate(${Math.cos(am) * off} ${Math.sin(am) * off})`} />
        );
      })}
      <circle r={140 + Math.sin(t * 3) * 4} fill="none" stroke={C.black} strokeWidth={2} opacity={0.35 * prog(t, at + 0.8, 0.5)} />
      <circle r={160 + ((t * 40) % 40)} fill="none" stroke={C.black} strokeWidth={2} opacity={0.25 * prog(t, at + 0.8, 0.5) * (1 - ((t * 40) % 40) / 40)} />
    </svg>
  );
};

export const S6: React.FC<{t: number}> = ({t}) => {
  const blockUp = prog(t, CUE.ensemble - 0.3, 0.6, easeInOut);
  const shieldO = prog(t, CUE.ensemble, 0.4) * (1 - prog(t, CUE.endcard - 0.3, 0.4) * 1);
  const endO = prog(t, CUE.endcard - 0.1, 0.5);
  const fadeBlack = prog(t, DURATION_S - 1.0, 0.9);
  const defO = prog(t, CUE.defense - 0.1, 0.3) * (1 - prog(t, CUE.endcard - 0.3, 0.3));
  const msgO = 1 - prog(t, CUE.defense - 0.4, 0.3);
  return (
    <AbsoluteFill style={{background: C.yellow, overflow: 'hidden'}}>
      {/* A — Avant de valider, vérifiez. En cas de doute, signalez. */}
      {endO < 1 && (
        <AbsoluteFill style={{opacity: 1 - blockUp}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 170, transform: `translateY(${-blockUp * 120}px)`}}>
            <Kinetic t={t} at={CUE.s6 + 0.2} text="AVANT DE VALIDER," size={90} color={C.black} weight={800} mode="rise" stagger={0.012} />
            <Kinetic t={t} at={CUE.verifiez} text="VÉRIFIEZ." size={200} color={C.black} mode="slam" stagger={0.03} style={{marginTop: 10}} />
          </div>
          <div style={{position: 'absolute', left: 660, right: 660, top: 540, height: 8, background: C.black, transform: `scaleX(${prog(t, CUE.signalez - 0.7, 0.4)})`}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 600, transform: `translateY(${-blockUp * 120}px)`}}>
            <Kinetic t={t} at={CUE.signalez - 0.6} text="EN CAS DE DOUTE," size={90} color={C.black} weight={800} mode="rise" stagger={0.012} />
            <Kinetic t={t} at={CUE.signalez} text="SIGNALEZ." size={200} color={C.black} mode="slam" stagger={0.03} style={{marginTop: 10}} />
          </div>
        </AbsoluteFill>
      )}
      {/* B/C — bouclier autour du client */}
      {shieldO > 0 && (
        <AbsoluteFill style={{opacity: shieldO}}>
          <div style={{position: 'absolute', left: 960 - 260, top: lerp(180, 120, prog(t, CUE.defense, 0.8, easeInOut)), width: 520, height: 520, display: 'grid', placeItems: 'center', transform: `scale(${lerp(1, 0.8, prog(t, CUE.defense, 0.8, easeInOut))})`}}>
            <div style={{position: 'absolute'}}><Shield t={t} at={CUE.ensemble + 0.3} size={520} /></div>
            <div style={{width: 230, height: 230, borderRadius: 115, background: '#fff', display: 'grid', placeItems: 'center', transform: `scale(${sp(t, CUE.ensemble + 0.1)})`, boxShadow: '0 20px 50px rgba(0,0,0,.15)'}}>
              <AccountIcon size={150} color={C.black} sw={6} p={prog(t, CUE.ensemble + 0.2, 0.8)} />
            </div>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 760, opacity: msgO}}>
            <Kinetic t={t} at={CUE.ensemble + 0.2} text="ENSEMBLE, PROTÉGEONS NOS CLIENTS" size={66} color={C.black} mode="rise" stagger={0.01} />
            <Kinetic t={t} at={CUE.ensemble + 2.1} text="LEUR CONFIANCE · L'INTÉGRITÉ DE MTN CÔTE D'IVOIRE" size={40} color={C.black} weight={800} mode="rise" stagger={0.006} style={{marginTop: 26}} />
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 640, opacity: defO}}>
            <Kinetic t={t} at={CUE.defense} text="CUSTOMER SERVICES" size={44} color={C.black} weight={800} mode="track" stagger={0.01} letterSpacing={10} />
            <div style={{display: 'flex', justifyContent: 'center', marginTop: 24}}>
              <div style={{background: C.black, padding: '22px 50px'}}>
                <Kinetic t={t} at={CUE.defense + 0.7} text="PREMIÈRE LIGNE DE DÉFENSE" size={96} color={C.yellow} mode="slam" stagger={0.015} />
              </div>
            </div>
            <Kinetic t={t} at={CUE.defense + 1.9} text="CONTRE LA FRAUDE" size={60} color={C.black} mode="rise" stagger={0.012} style={{marginTop: 24}} />
          </div>
        </AbsoluteFill>
      )}
      {/* D — écran de clôture */}
      {endO > 0 && (
        <AbsoluteFill style={{opacity: endO, background: C.yellow, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <Img src={staticFile('mtn-logo-black.png')} style={{width: 340, transform: `scale(${lerp(0.9, 1, sp(t, CUE.endcard))})`}} />
          <div style={{height: 70}} />
          <Kinetic t={t} at={CUE.endcard + 0.4} text="AVANT DE VALIDER, VÉRIFIEZ." size={64} color={C.black} mode="rise" stagger={0.008} />
          <div style={{height: 18}} />
          <Kinetic t={t} at={CUE.endcard + 0.8} text="EN CAS DE DOUTE, SIGNALEZ." size={64} color={C.black} mode="rise" stagger={0.008} />
          <div style={{width: 120, height: 6, background: C.black, margin: '56px 0 34px', transform: `scaleX(${prog(t, CUE.endcard + 1.2, 0.5)})`}} />
          <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 34, color: C.black, letterSpacing: 4, opacity: prog(t, CUE.endcard + 1.4, 0.5)}}>MTN CÔTE D'IVOIRE</div>
          <div style={{fontFamily: F.display, fontWeight: 600, fontSize: 28, color: C.black, letterSpacing: 8, marginTop: 10, opacity: prog(t, CUE.endcard + 1.7, 0.5)}}>FORENSIC SERVICES</div>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{background: '#000', opacity: fadeBlack}} />
    </AbsoluteFill>
  );
};

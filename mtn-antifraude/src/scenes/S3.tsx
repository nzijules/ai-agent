import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Glitch, Kinetic, RGBSplit} from '../components/Fx';
import {AccountIcon, GavelIcon, PhoneIcon, SimIcon, WalletIcon, AlertIcon} from '../components/Icons';
import {Person, SKINS} from '../components/Person';
import {Phone} from '../components/UI';
import {C, F, drift, easeIn, easeInOut, inOut, lerp, prog, sp} from '../lib';
import {CUE} from '../timing';

const NODES = [
  {I: SimIcon, l: 'Carte SIM'},
  {I: PhoneIcon, l: 'Ligne du client'},
  {I: WalletIcon, l: 'Mobile Money'},
  {I: AccountIcon, l: 'Compte client'},
];

export const S3: React.FC<{t: number}> = ({t}) => {
  const dr = drift(t, 5, 4);
  const stamp = sp(t, CUE.s3, {damping: 9, stiffness: 260});
  const stampO = 1 - prog(t, CUE.s3 + 0.8, 0.3);
  const chainO = prog(t, CUE.s3 + 0.5, 0.3) * (1 - prog(t, CUE.client - 0.3, 0.4));
  const clientO = prog(t, CUE.client - 0.2, 0.5) * (1 - prog(t, CUE.collab - 0.4, 0.4));
  const badgeO = prog(t, CUE.collab - 0.2, 0.6);
  const crackP = prog(t, CUE.crack, 0.5);
  const crackShake = inOut(t, CUE.crack, CUE.crack + 0.4, 0.02, 0.3) * 14;
  const gl = Math.max(inOut(t, CUE.s3, CUE.s3 + 0.45, 0.02, 0.3), inOut(t, CUE.crack, CUE.crack + 0.3, 0.02, 0.2) * 0.6);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #4a0a0c, #120203 70%)', overflow: 'hidden'}}>
      {/* effet domino */}
      {chainO > 0 && (
        <AbsoluteFill style={{opacity: chainO, transform: `translate(${dr.x}px,${dr.y}px) scale(${lerp(1.08, 1, prog(t, CUE.s3, 3))})`}}>
          <div style={{position: 'absolute', left: 260, right: 260, top: 548, height: 8, background: 'rgba(255,255,255,.15)'}} />
          <div style={{position: 'absolute', left: 260, top: 548, height: 8, width: lerp(0, 1400, prog(t, CUE.s3 + 0.6, 2.2, easeInOut)), background: C.red, boxShadow: '0 0 30px #E5332A'}} />
          {NODES.map(({I, l}, i) => {
            const fall = prog(t, CUE.s3 + 0.7 + i * 0.6, 0.35, easeIn);
            const hit = fall > 0.99;
            const x = 260 + i * 466;
            return (
              <div key={i} style={{position: 'absolute', left: x - 120, top: 380, width: 240, height: 340, transformOrigin: '100% 100%', transform: `rotate(${fall * (i === 3 ? 0 : 16)}deg) scale(${i === 3 && hit ? 1.08 : 1})`, background: hit ? '#2a0607' : '#f5f5f5', borderRadius: 24, border: `5px solid ${hit ? C.red : '#fff'}`, boxShadow: hit ? '0 0 50px rgba(229,51,42,.6)' : '0 30px 60px rgba(0,0,0,.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22}}>
                <I size={130} color={hit ? C.red : C.black} sw={5} />
                <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 28, color: hit ? '#fff' : C.black, textAlign: 'center'}}>{l}</div>
              </div>
            );
          })}
          <div style={{position: 'absolute', left: 0, right: 0, top: 800, display: 'flex', justifyContent: 'center'}}>
            <Kinetic t={t} at={CUE.compromettre + 0.9} text="COMPTE CLIENT COMPROMIS" size={76} color="#fff" mode="track" stagger={0.012} />
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', justifyContent: 'center'}}>
            <Kinetic t={t} at={CUE.compromettre - 0.6} text="UNE SEULE OPÉRATION NON AUTORISÉE" size={58} color={C.yellow} mode="rise" stagger={0.01} />
          </div>
        </AbsoluteFill>
      )}
      {/* validation non conforme (représentation fictive) */}
      {stampO > 0 && (
        <AbsoluteFill style={{display: 'grid', placeItems: 'center', opacity: stampO}}>
          <div style={{transform: `rotate(-8deg) scale(${lerp(3, 1, stamp)})`, border: `12px solid ${C.red}`, color: C.red, padding: '20px 70px', fontFamily: F.display, fontWeight: 900, fontSize: 170, letterSpacing: 10, borderRadius: 20, background: 'rgba(0,0,0,.4)'}}>VALIDÉ</div>
        </AbsoluteFill>
      )}
      {/* le client légitime perd le contrôle de sa ligne */}
      {clientO > 0 && (
        <AbsoluteFill style={{opacity: clientO, transform: `translate(${dr.x}px,${dr.y}px)`}}>
          <div style={{position: 'absolute', left: 60, top: 160, transform: `scale(${lerp(1.05, 1, prog(t, CUE.client, 4))})`}}>
            <Person t={t} width={700} skin={SKINS[4]} hair="short" beard outfit="#2C5DAA" accent="#1d3f78" mood="worried" look={0.7} lookY={0.8} seed={5} />
          </div>
          <div style={{position: 'absolute', left: 600, top: 430, transform: `rotate(8deg) translateY(${(1 - sp(t, CUE.client)) * 400}px)`}}>
            <Phone w={260}>
              <div style={{position: 'absolute', inset: 0, background: '#14161c', fontFamily: F.ui, color: '#fff', textAlign: 'center'}}>
                <div style={{marginTop: 90, fontSize: 20, color: '#9aa0a8'}}>Aucun service</div>
                <div style={{margin: '40px auto 0', width: 90}}><AlertIcon size={90} color={C.red} p={prog(t, CUE.client + 0.4, 0.6)} /></div>
                <div style={{marginTop: 24, fontSize: 24, fontWeight: 700, padding: '0 16px'}}>Alerte de sécurité</div>
                <div style={{marginTop: 10, fontSize: 18, color: '#c9ccd2', padding: '0 20px'}}>Carte SIM désactivée</div>
              </div>
            </Phone>
          </div>
          <div style={{position: 'absolute', left: 1000, top: 250, display: 'flex', flexDirection: 'column', gap: 40}}>
            {([[CUE.client + 0.1, 'Client exposé'], [CUE.pertes, 'Pertes financières potentielles'], [CUE.reputation, 'Confiance compromise']] as [number, string][]).map(([a, s], i) => {
              const p = sp(t, a);
              return (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 30, opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * 120}px)`}}>
                  <div style={{width: 80, height: 80, borderRadius: 40, background: C.red, color: '#fff', display: 'grid', placeItems: 'center', fontFamily: F.display, fontWeight: 900, fontSize: 40}}>!</div>
                  <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 56, color: '#fff'}}>{s}</div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}
      {/* le collaborateur complice */}
      {badgeO > 0 && (
        <AbsoluteFill style={{opacity: badgeO, background: `rgba(0,0,0,${0.55 * badgeO})`}}>
          <div style={{position: 'absolute', left: 230, top: 170, width: 480, height: 720, transform: `translate(${Math.sin(t * 80) * crackShake}px,0) rotate(${-4 + crackP * 6}deg) scale(${lerp(0.94, 1, prog(t, CUE.collab, 4))})`, filter: `grayscale(${crackP * 0.8})`}}>
            <div style={{position: 'absolute', left: 190, top: -60, width: 100, height: 90, border: '10px solid #555', borderBottom: 'none', borderRadius: '20px 20px 0 0'}} />
            <div style={{width: '100%', height: '100%', background: '#fafafa', borderRadius: 34, overflow: 'hidden', boxShadow: '0 50px 100px rgba(0,0,0,.6)'}}>
              <div style={{height: 150, background: C.yellow}} />
              <div style={{margin: '-90px auto 0', width: 220, height: 220, borderRadius: 110, background: '#ddd', border: '10px solid #fff', overflow: 'hidden', display: 'grid', placeItems: 'end center'}}>
                <svg width={180} height={180} viewBox="0 0 100 100"><circle cx={50} cy={38} r={20} fill="#999" /><path d="M10 100 C14 70 30 62 50 62 C70 62 86 70 90 100 Z" fill="#999" /></svg>
              </div>
              <div style={{textAlign: 'center', marginTop: 40, fontFamily: F.display, fontWeight: 800, fontSize: 40, color: C.black, letterSpacing: 4}}>COLLABORATEUR</div>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{margin: '26px auto 0', width: 300 - i * 60, height: 18, borderRadius: 9, background: '#e2e2e2'}} />
              ))}
            </div>
            <svg viewBox="0 0 480 720" width={480} height={720} style={{position: 'absolute', inset: 0}}>
              <path d="M250 0 L220 160 L290 260 L200 400 L260 520 L210 720 M220 160 L120 210 M290 260 L420 300 M200 400 L60 450 M260 520 L400 600" stroke="#111" strokeWidth={6} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - crackP} />
            </svg>
          </div>
          <div style={{position: 'absolute', left: 820, top: 260, width: 1020}}>
            <Kinetic t={t} at={CUE.collab + 0.6} text="PARTICIPER À UNE FRAUDE," size={54} color="rgba(255,255,255,.8)" mode="rise" stagger={0.01} style={{justifyContent: 'flex-start'}} />
            <div style={{height: 70}} />
            <div style={{display: 'flex', alignItems: 'center', gap: 40}}>
              <div style={{transform: `rotate(${lerp(-40, 0, sp(t, CUE.disciplinaires, {damping: 8, stiffness: 300}))}deg)`, opacity: prog(t, CUE.disciplinaires, 0.1), transformOrigin: '80% 80%'}}>
                <GavelIcon size={170} color={C.yellow} sw={6} />
              </div>
              <div>
                <RGBSplit amt={Math.max(0, 1 - (t - CUE.disciplinaires) * 3) * 10}>
                  <Kinetic t={t} at={CUE.disciplinaires} text="SANCTIONS" size={110} color="#fff" mode="slam" stagger={0.02} style={{justifyContent: 'flex-start'}} />
                </RGBSplit>
                <Kinetic t={t} at={CUE.disciplinaires + 0.2} text="DISCIPLINAIRES" size={70} color={C.yellow} mode="rise" stagger={0.015} style={{justifyContent: 'flex-start', marginTop: 10}} />
                <Kinetic t={t} at={CUE.judiciaires} text="& JUDICIAIRES" size={70} color={C.red} mode="rise" stagger={0.015} style={{justifyContent: 'flex-start', marginTop: 10}} />
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}
      <Glitch i={gl} seedT={t} />
    </AbsoluteFill>
  );
};

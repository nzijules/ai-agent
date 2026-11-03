import React from 'react';
import {C, F} from '../lib';

export const Phone: React.FC<{w?: number; children?: React.ReactNode; glow?: number; style?: React.CSSProperties}> = ({w = 380, children, glow = 0, style}) => {
  const h = w * 2.05;
  return (
    <div style={{width: w, height: h, borderRadius: w * 0.14, background: '#0c0c0e', padding: w * 0.035, boxShadow: `0 40px 120px rgba(0,0,0,.6), 0 0 ${180 * glow}px rgba(255,203,5,${0.45 * glow})`, border: '2px solid #2a2a2e', position: 'relative', ...style}}>
      <div style={{width: '100%', height: '100%', borderRadius: w * 0.11, overflow: 'hidden', position: 'relative', background: '#111'}}>
        {children}
        <div style={{position: 'absolute', top: w * 0.03, left: '50%', transform: 'translateX(-50%)', width: w * 0.28, height: w * 0.07, borderRadius: 99, background: '#000'}} />
      </div>
    </div>
  );
};

export const Cursor: React.FC<{x: number; y: number; press?: number; scale?: number}> = ({x, y, press = 0, scale = 1}) => (
  <svg width={44 * scale} height={52 * scale} viewBox="0 0 44 52" style={{position: 'absolute', left: x, top: y, transform: `scale(${1 - press * 0.15})`, transformOrigin: '0 0', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.35))'}}>
    <path d="M4 3 L4 42 L14 32 L21 48 L28 45 L21 29 L36 29 Z" fill="#fff" stroke="#111" strokeWidth={3} strokeLinejoin="round" />
  </svg>
);

/** Écran de console générique (interface simulée – ne représente aucun outil interne réel). */
export const ConsoleScreen: React.FC<{
  t: number;
  mode: 'risk' | 'safe';
  urgentBlink?: boolean;
  btnHot?: number; // 0..1 survol du bouton valider
  validated?: number; // 0..1
  paused?: number; // 0..1 (mode safe : opération suspendue)
  checks?: number; // nombre de contrôles cochés (mode safe)
}> = ({t, mode, urgentBlink = true, btnHot = 0, validated = 0, paused = 0, checks = 0}) => {
  const blink = urgentBlink ? 0.55 + 0.45 * Math.abs(Math.sin(t * 5)) : 1;
  const row = (k: string, v: string) => (
    <div style={{display: 'flex', justifyContent: 'space-between', padding: '18px 0', borderBottom: '1px solid #e7e7ea', fontSize: 30}}>
      <span style={{color: '#6b7078'}}>{k}</span>
      <span style={{color: '#16181d', fontWeight: 700, letterSpacing: k === 'Ligne' ? 3 : 0}}>{v}</span>
    </div>
  );
  return (
    <div style={{width: 1920, height: 1080, background: '#eef0f3', fontFamily: F.ui, position: 'relative', overflow: 'hidden'}}>
      <div style={{height: 96, background: C.black, display: 'flex', alignItems: 'center', padding: '0 48px', gap: 24}}>
        <div style={{width: 46, height: 46, borderRadius: 12, background: C.yellow}} />
        <div style={{color: '#fff', fontSize: 30, fontWeight: 700}}>Console Service Client</div>
        <div style={{marginLeft: 'auto', color: '#9aa0a8', fontSize: 22}}>Agent connecté</div>
      </div>
      <div style={{position: 'absolute', left: 0, top: 96, bottom: 0, width: 120, background: '#fff', borderRight: '1px solid #e2e3e6'}}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{width: 56, height: 56, borderRadius: 14, background: i === 1 ? C.yellow : '#eceef1', margin: '34px auto'}} />
        ))}
      </div>
      <div style={{position: 'absolute', left: 260, top: 180, width: 1400, background: '#fff', borderRadius: 28, boxShadow: '0 30px 80px rgba(20,22,27,.12)', padding: '48px 64px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
          <div style={{fontSize: 44, fontWeight: 700, color: '#16181d'}}>Demande : remplacement de carte SIM</div>
          {mode === 'risk' ? (
            <div style={{marginLeft: 'auto', background: C.red, color: '#fff', fontWeight: 700, fontSize: 26, padding: '10px 22px', borderRadius: 10, opacity: blink, letterSpacing: 2}}>URGENT</div>
          ) : (
            <div style={{marginLeft: 'auto', background: '#fff4cc', color: '#7a5a00', fontWeight: 700, fontSize: 26, padding: '10px 22px', borderRadius: 10, opacity: paused, letterSpacing: 1}}>⏸ EN ATTENTE DE VÉRIFICATION</div>
          )}
        </div>
        <div style={{marginTop: 26}}>
          {row('Ligne', '07 •• •• •• ••')}
          {row('Motif déclaré', 'Téléphone perdu')}
          {row('Canal', 'Appel entrant')}
        </div>
        {mode === 'safe' && (
          <div style={{display: 'flex', gap: 22, marginTop: 30}}>
            {['Identité', 'Légitimité', 'Validations'].map((l, i) => (
              <div key={l} style={{flex: 1, padding: '18px 22px', borderRadius: 14, background: checks > i ? '#e6f6ec' : '#f2f3f5', color: checks > i ? C.green : '#80858d', fontWeight: 700, fontSize: 26}}>
                {checks > i ? '✓ ' : '○ '}
                {l}
              </div>
            ))}
          </div>
        )}
        <div style={{display: 'flex', gap: 28, marginTop: 44}}>
          <div
            style={{
              padding: '26px 64px', borderRadius: 16, fontSize: 34, fontWeight: 800, letterSpacing: 2,
              background: validated > 0.5 ? C.red : C.yellow, color: validated > 0.5 ? '#fff' : C.black,
              transform: `scale(${1 + btnHot * 0.06})`, boxShadow: `0 0 0 ${btnHot * 10}px rgba(229,51,42,${0.25 * btnHot})`,
              opacity: mode === 'safe' ? 0.35 : 1,
            }}
          >
            {validated > 0.5 ? 'VALIDÉ' : 'VALIDER'}
          </div>
          <div style={{padding: '26px 48px', borderRadius: 16, fontSize: 30, fontWeight: 700, border: '3px solid #c9ccd2', color: '#3b3f46', background: mode === 'safe' ? '#fff' : 'transparent', boxShadow: mode === 'safe' ? `0 0 0 ${paused * 8}px rgba(255,203,5,.5)` : 'none'}}>
            Suspendre & signaler
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', right: 40, bottom: 26, fontSize: 20, color: '#9aa0a8'}}>Interface simulée – à des fins de sensibilisation</div>
    </div>
  );
};

/** Bulle de pression (discours du demandeur). */
export const Bubble: React.FC<{text: string; p: number; side?: 'left' | 'right'; color?: string; style?: React.CSSProperties}> = ({text, p, side = 'left', color = C.red, style}) => (
  <div
    style={{
      position: 'absolute', padding: '22px 34px', borderRadius: 28, background: '#fff', color: C.black, fontFamily: F.ui, fontWeight: 700, fontSize: 40,
      border: `4px solid ${color}`, boxShadow: '0 20px 50px rgba(0,0,0,.35)', whiteSpace: 'nowrap',
      transform: `scale(${p}) rotate(${side === 'left' ? -3 : 3}deg)`, opacity: Math.min(1, p * 1.4), transformOrigin: side === 'left' ? '0% 100%' : '100% 100%',
      ...style,
    }}
  >
    {text}
  </div>
);

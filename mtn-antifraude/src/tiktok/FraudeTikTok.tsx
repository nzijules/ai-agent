/**
 * « La fraude à l'ère de l'IA » – version TikTok Arosoft (1080 × 1920, ~43 s).
 * Visuel central : le hacker encapuchonné, présent en continu pendant toute la séquence de menace.
 * Zones sûres TikTok : rien d'important sous y ≈ 1500 (légende / description), ni dans la colonne droite basse (boutons).
 */
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Glitch, Kinetic, RGBSplit, Vignette} from '../components/Fx';
import {CheckBadge} from '../components/Icons';
import {Hooded, Person, PersonProps, SKINS} from '../components/Person';
import {F, clamp, drift, easeInOut, inOut, lerp, prog, rnd, sp} from '../lib';
import {NeuralNet, Waveform} from '../ia/AiFx';
import {DURATION_TT, END_VO, SC, at} from './timing';

const W = 1080, H = 1920;
const AB = {blue: '#0141C5', bright: '#0487F3', deep: '#002888', navy: '#15203E', pale: '#EAF2FF', red: '#E5332A'};
const NET = '4,135,243';
const bgDark = 'radial-gradient(ellipse at 50% 55%, #0d1a3d, #02040a 72%)';

const Lines: React.FC<{t: number; at: number; lines: string[]; size: number; color?: string; mode?: 'rise' | 'slam' | 'track'; gap?: number; step?: number; weight?: number; style?: React.CSSProperties}> = ({t, at: a, lines, size, color = '#fff', mode = 'rise', gap = 10, step = 0.15, weight = 900, style}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap, ...style}}>
    {lines.map((l, i) => <Kinetic key={i} t={t} at={a + i * step} text={l} size={size} color={color} mode={mode} stagger={0.012} weight={weight} letterSpacing={1} />)}
  </div>
);

/* ---------- le hacker (image centrale) ---------- */
const HW = 720, HL = (W - HW) / 2, HT = 600; // largeur, gauche, haut
const FACE = {x: HL + 0.505 * HW, y: HT + 0.4375 * HW * 1.2}; // centre du visage dans le cadre
const FACES: Partial<PersonProps>[] = [
  {skin: SKINS[2], hair: 'short', glasses: true, outfit: '#15171c', accent: '#f2f2f2', seed: 4}, // visage imité
  {skin: SKINS[4], hair: 'short', beard: true, outfit: '#2C5DAA', accent: '#1d3f78', seed: 5}, // formateur
  {skin: SKINS[0], hair: 'fade', outfit: AB.blue, accent: '#fff', headset: true, brand: AB.bright, seed: 6}, // conseiller
  {skin: SKINS[1], hair: 'bun', outfit: AB.blue, accent: '#fff', earrings: true, brand: AB.bright, seed: 2}, // « Arosoft »
];
const Mask: React.FC<{t: number; who: Partial<PersonProps>; o: number; jitter?: number}> = ({t, who, o, jitter = 0}) => {
  const w = 605; // le visage du personnage (rx 76) recouvre celui du hacker
  return (
    <div style={{position: 'absolute', left: FACE.x - 302 + jitter, top: FACE.y - 252, width: w, height: w * 1.2, opacity: o, clipPath: 'ellipse(118px 165px at 302px 252px)', filter: `drop-shadow(0 0 24px ${AB.bright})`}}>
      <Person t={t} width={w} {...who} mood="smile" />
      <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(4,135,243,.28) 0 3px, transparent 3px 8px)'}} />
    </div>
  );
};

/** Carte d'information en haut de l'écran (zone 250–560). */
const TopCard: React.FC<{o: number; children: React.ReactNode; p: number}> = ({o, children, p}) => (
  <div style={{position: 'absolute', left: 70, right: 70, top: 250, height: 300, borderRadius: 34, background: 'rgba(10,18,40,.82)', border: `3px solid ${AB.bright}`, boxShadow: '0 0 60px rgba(4,135,243,.35)', opacity: o, transform: `translateY(${(1 - p) * -60}px) scale(${lerp(0.94, 1, p)})`, overflow: 'hidden'}}>
    {children}
  </div>
);

/* ======================= 1 — menace (hacker en continu) ======================= */
const Menace: React.FC<{t: number}> = ({t}) => {
  const dr = drift(t, 5, 2);
  const enter = prog(t, 0.15, 0.6);
  const push = lerp(1, 1.1, prog(t, 0, SC.menace[1], (x) => x));
  const v = at('voix'), vi = at('visage'), me = at('message'), im = at('imposteur'), bu = at('but');
  // masque : visage imité, puis identités usurpées
  const ids = [at('imposteur', 'formateur') - 0.15, at('imposteur', 'conseiller') - 0.15, at('imposteur', 'Arosoft') - 0.15];
  let mi = -1;
  if (t >= vi - 0.1 && t < me - 0.1) mi = 0;
  if (t >= ids[0]) mi = 1;
  if (t >= ids[1]) mi = 2;
  if (t >= ids[2]) mi = 3;
  const maskO = mi < 0 ? 0 : mi === 0 ? inOut(t, vi - 0.1, me - 0.05, 0.25, 0.25) : inOut(t, ids[0], bu - 0.2, 0.2, 0.3);
  const swap = Math.max(...ids.map((a) => inOut(t, a, a + 0.25, 0.03, 0.2)), inOut(t, vi - 0.1, vi + 0.2, 0.03, 0.2));
  const labels = ['UN FORMATEUR', 'UN CONSEILLER', '« AROSOFT »'];
  const msg = 'Bonjour, ici le support Arosoft. Merci de régler votre formation via ce lien avant ce soir.';
  const typed = Math.floor(clamp((t - me - 0.1) / 2.2) * msg.length);
  const targets: [string, string, number, number][] = [['TON ARGENT', 'argent', 60, 720], ['TON CODE MOBILE MONEY', 'code', 60, 900], ['TES COMPTES', 'comptes', 60, 1080]];
  return (
    <AbsoluteFill style={{background: bgDark}}>
      <NeuralNet t={t} w={W} h={H} n={34} o={0.35} color={NET} />
      {/* le hacker */}
      <AbsoluteFill style={{transform: `translate(${dr.x}px,${dr.y}px) scale(${push})`, transformOrigin: `${FACE.x}px ${FACE.y}px`, opacity: enter}}>
        <div style={{position: 'absolute', left: HL + swap * 14 * Math.sin(t * 90), top: HT, filter: `drop-shadow(0 0 40px rgba(4,135,243,.35))`}}>
          <Hooded t={t} width={HW} rim={AB.bright} phone={mi < 0} />
        </div>
        {mi >= 0 && <Mask t={t} who={FACES[mi]} o={maskO} jitter={swap * 10 * Math.sin(t * 70)} />}
      </AbsoluteFill>
      {/* accroche */}
      <AbsoluteFill style={{opacity: 1 - prog(t, v - 0.25, 0.25)}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 230}}>
          <RGBSplit amt={Math.max(0, 1 - (t - 0.3) * 2) * 16}>
            <Lines t={t} at={0.3} lines={['STOP.']} size={200} color={AB.red} mode="slam" />
          </RGBSplit>
          <Lines t={t} at={at('hook', 'Cet') - 0.05} lines={['CET APPEL NE VIENT', 'PEUT-ÊTRE PAS', 'DE QUI TU CROIS']} size={66} gap={4} step={0.22} style={{marginTop: 20}} />
        </div>
      </AbsoluteFill>
      {/* voix clonée */}
      {t > v - 0.1 && t < vi + 0.2 && (
        <TopCard o={inOut(t, v - 0.1, vi + 0.2, 0.25, 0.25)} p={sp(t, v - 0.1)}>
          <div style={{position: 'absolute', left: 34, top: 24, fontFamily: F.display, fontWeight: 900, fontSize: 52, color: '#fff'}}>VOIX CLONÉE</div>
          <div style={{position: 'absolute', right: 34, top: 30, fontFamily: F.ui, fontWeight: 700, fontSize: 44, color: AB.bright}}>00:0{Math.min(3, Math.max(0, Math.floor((t - v) * 1.2)))}</div>
          <div style={{position: 'absolute', left: 34, top: 110}}><Waveform t={t} w={870} h={70} color="#fff" bars={44} /></div>
          <div style={{position: 'absolute', left: 34, top: 195}}><Waveform t={t + 0.05} w={870} h={70} color={AB.bright} bars={44} seed={0.3} reveal={prog(t, v + 0.3, 2.5, (x) => x)} /></div>
        </TopCard>
      )}
      {t > vi - 0.15 && t < me && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 330, opacity: inOut(t, vi - 0.15, me, 0.2, 0.2)}}>
          <Lines t={t} at={vi - 0.1} lines={['VISAGE IMITÉ']} size={100} mode="slam" />
        </div>
      )}
      {/* message parfait */}
      {t > me - 0.1 && t < im && (
        <TopCard o={inOut(t, me - 0.1, im, 0.25, 0.25)} p={sp(t, me - 0.1)}>
          <div style={{position: 'absolute', left: 34, top: 28, right: 34, background: '#fff', borderRadius: '26px 26px 26px 6px', padding: '20px 26px', fontFamily: F.ui, fontWeight: 500, fontSize: 34, color: AB.navy, lineHeight: 1.35, minHeight: 150}}>
            {msg.slice(0, typed)}<span style={{opacity: Math.floor(t * 3) % 2 ? 1 : 0}}>|</span>
          </div>
          <div style={{position: 'absolute', right: 34, bottom: 24, background: AB.bright, color: '#fff', fontFamily: F.display, fontWeight: 900, fontSize: 30, padding: '8px 20px', borderRadius: 30, opacity: prog(t, me + 1.6, 0.3)}}>✦ 0 FAUTE</div>
        </TopCard>
      )}
      {/* identités usurpées */}
      {mi >= 1 && t < bu - 0.1 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 260, opacity: 1 - prog(t, bu - 0.4, 0.3)}}>
          <div style={{fontFamily: F.ui, fontWeight: 700, fontSize: 34, color: '#9fb0c8', letterSpacing: 4, textAlign: 'center'}}>IL SE FAIT PASSER POUR…</div>
          <RGBSplit amt={swap * 14}>
            <div key={mi} style={{fontFamily: F.display, fontWeight: 900, fontSize: mi === 3 ? 120 : 104, color: mi === 3 ? AB.bright : '#fff', textAlign: 'center', marginTop: 16, transform: `scale(${sp(t, ids[mi - 1], {damping: 11, stiffness: 240})})`}}>{labels[mi - 1]}</div>
          </RGBSplit>
        </div>
      )}
      {/* son but : cibles */}
      {t > bu - 0.2 && (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: 290}}>
            <Lines t={t} at={bu - 0.1} lines={['SON BUT :']} size={110} mode="slam" />
          </div>
          {targets.map(([l, w, x, y], i) => {
            const a = at('but', w) - 0.15;
            const p = sp(t, a, {damping: 12, stiffness: 220});
            return (
              <div key={l} style={{position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center', gap: 18, transform: `scale(${p})`, opacity: clamp(p * 2)}}>
                <svg width={90} height={90} viewBox="-50 -50 100 100" style={{transform: `rotate(${t * 60 + i * 40}deg)`}}>
                  <circle r={38} fill="none" stroke={AB.red} strokeWidth={6} strokeDasharray="16 10" />
                  <path d="M0 -50 V-30 M0 50 V30 M-50 0 H-30 M50 0 H30" stroke={AB.red} strokeWidth={6} />
                  <circle r={8} fill={AB.red} />
                </svg>
                <div style={{background: AB.red, color: '#fff', fontFamily: F.display, fontWeight: 900, fontSize: 46, padding: '10px 24px', borderRadius: 12}}>{l}</div>
              </div>
            );
          })}
        </>
      )}
      <Glitch i={Math.max(inOut(t, 0.2, 0.7, 0.03, 0.3), swap * 0.6)} seedT={t} color2={AB.bright} />
    </AbsoluteFill>
  );
};

/* ======================= 2 — 3 réflexes (fond blanc) ======================= */
const RX: [string, string, string][] = [
  ['r1', 'VÉRIFIE', 'Toujours par nos canaux officiels'],
  ['r2', 'NE PARTAGE JAMAIS', 'Tes codes ni tes mots de passe'],
  ['r3', 'UN DOUTE ? STOP.', 'Arrête tout et signale'],
];
const Reflexes: React.FC<{t: number}> = ({t}) => {
  const wipe = prog(t, SC.reflexes[0], 0.5, easeInOut);
  return (
    <AbsoluteFill style={{background: '#fff', clipPath: `circle(${wipe * 1500}px at 540px 960px)`}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 260}}>
        <Lines t={t} at={at('trois') + 0.1} lines={['3 RÉFLEXES']} size={140} color={AB.blue} mode="slam" />
        <Lines t={t} at={at('trois') + 0.5} lines={['À RETENIR']} size={52} color={AB.navy} weight={800} mode="track" style={{marginTop: 6}} />
      </div>
      {RX.map(([id, title, sub], i) => {
        const a = at(id) - 0.1;
        const p = sp(t, a, {damping: 15});
        const next = RX[i + 1] ? at(RX[i + 1][0]) : 1e9;
        const active = t >= a && t < next;
        return (
          <div key={id} style={{position: 'absolute', left: 60, right: 60, top: 580 + i * 300, height: 260, borderRadius: 34, background: active ? '#fff' : '#f7f9fd', border: `${active ? 6 : 3}px solid ${active ? AB.bright : '#dde6f5'}`, boxShadow: active ? '0 30px 70px rgba(1,65,197,.18)' : 'none', display: 'flex', alignItems: 'center', gap: 34, padding: '0 34px', opacity: clamp(p * 2), transform: `translateX(${(1 - p) * 500}px) scale(${active ? 1.02 : 1})`}}>
            <div style={{width: 160, height: 160, borderRadius: 80, background: `linear-gradient(135deg, ${AB.bright}, ${AB.deep})`, color: '#fff', display: 'grid', placeItems: 'center', fontFamily: F.display, fontWeight: 900, fontSize: 96, flexShrink: 0}}>{i + 1}</div>
            <div style={{flex: 1}}>
              <div style={{fontFamily: F.display, fontWeight: 900, fontSize: 56, color: AB.navy, lineHeight: 1.05}}>{title}</div>
              <div style={{fontFamily: F.ui, fontWeight: 500, fontSize: 36, color: '#55607a', marginTop: 10}}>{sub}</div>
            </div>
            <CheckBadge p={prog(t, a + 0.6, 0.5)} size={84} color={i === 2 ? AB.red : AB.blue} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ======================= 3 — l'IA imite tout, sauf ta vigilance ======================= */
const Imite: React.FC<{t: number}> = ({t}) => {
  const sauf = at('imite', 'Sauf');
  const dis = prog(t, sauf + 0.2, 1.1, (x) => x);
  return (
    <AbsoluteFill style={{background: bgDark}}>
      <NeuralNet t={t} w={W} h={H} n={34} o={0.3} color={NET} />
      {/* le hacker se désintègre en tranches */}
      {[...Array(14)].map((_, k) => {
        const h = 1100 / 14, y0 = HT - 40 + k * h;
        const off = dis * (rnd(k) - 0.5) * 900 * (0.4 + dis);
        return (
          <div key={k} style={{position: 'absolute', left: 0, top: y0, width: W, height: h + 1, overflow: 'hidden', opacity: 1 - dis * (0.6 + rnd(k + 3) * 0.4)}}>
            <div style={{position: 'absolute', left: HL + off, top: HT - y0}}><Hooded t={t} width={HW} rim={AB.bright} phone={false} /></div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 280}}>
        <Lines t={t} at={at('imite') - 0.05} lines={["L'IA IMITE", 'TOUT.']} size={130} mode="slam" gap={0} step={0.2} />
      </div>
      {t > sauf - 0.2 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1150, display: 'flex', justifyContent: 'center'}}>
          <div style={{background: `linear-gradient(110deg, ${AB.bright}, ${AB.blue} 55%, ${AB.deep})`, padding: '26px 44px', transform: `rotate(-2deg) scaleX(${sp(t, sauf - 0.15)})`}}>
            <Lines t={t} at={sauf - 0.05} lines={['SAUF TA', 'VIGILANCE.']} size={104} mode="slam" gap={0} step={0.2} />
          </div>
        </div>
      )}
      <Glitch i={inOut(t, sauf + 0.1, sauf + 1.0, 0.05, 0.4) * 0.7} seedT={t} color2={AB.bright} />
    </AbsoluteFill>
  );
};

/* ======================= 4 — signature Arosoft + appel au partage ======================= */
const Outro: React.FC<{t: number}> = ({t}) => {
  const a = at('outro');
  const sh = at('outro', 'Partage');
  const wipe = prog(t, SC.outro[0], 0.45, easeInOut);
  return (
    <AbsoluteFill style={{background: '#fff', clipPath: `circle(${wipe * 1500}px at 540px 960px)`}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center'}}>
        <Img src={staticFile('arosoft-logo-full.png')} style={{width: 600, transform: `scale(${lerp(0.85, 1, sp(t, a))})`, opacity: prog(t, a, 0.4)}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 800, display: 'flex', justifyContent: 'center'}}>
        <div style={{background: AB.pale, color: AB.blue, fontFamily: F.display, fontWeight: 800, fontSize: 46, letterSpacing: 3, padding: '16px 40px', borderRadius: 50, transform: `scale(${sp(t, at('outro', 'sécurité') - 0.15)})`}}>… EN TOUTE SÉCURITÉ</div>
      </div>
      {t > sh - 0.2 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 26, background: `linear-gradient(110deg, ${AB.bright}, ${AB.blue} 55%, ${AB.deep})`, padding: '24px 46px', borderRadius: 24, transform: `scale(${sp(t, sh - 0.15, {damping: 10, stiffness: 220})})`}}>
            <svg width={84} height={84} viewBox="0 0 100 100" style={{transform: `translateX(${Math.sin(t * 6) * 6}px)`}}>
              <path d="M58 18 L92 50 L58 82 V64 C34 64 18 72 8 88 C12 58 28 38 58 36 Z" fill="#fff" />
            </svg>
            <Kinetic t={t} at={sh - 0.05} text="PARTAGE" size={100} color="#fff" mode="slam" stagger={0.02} />
          </div>
          <Lines t={t} at={sh + 0.5} lines={['POUR PROTÉGER', 'TES PROCHES']} size={66} color={AB.navy} gap={2} step={0.2} style={{marginTop: 30}} />
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------- logo Arosoft (haut gauche, sous les onglets TikTok) ---------- */
const Logo: React.FC<{t: number}> = ({t}) => {
  const light = prog(t, SC.reflexes[0] + 0.2, 0.3) * (1 - prog(t, SC.imite[0], 0.2));
  const o = prog(t, 0.5, 0.4) * (1 - prog(t, SC.outro[0], 0.3));
  const st: React.CSSProperties = {position: 'absolute', left: 60, top: 140, width: 150};
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: o}}>
      <Img src={staticFile('arosoft-logo-mark-white.png')} style={{...st, opacity: 1 - light}} />
      <Img src={staticFile('arosoft-logo-mark.png')} style={{...st, opacity: light}} />
    </AbsoluteFill>
  );
};

const LIST: [readonly [number, number], React.FC<{t: number}>][] = [[SC.menace, Menace], [SC.reflexes, Reflexes], [SC.imite, Imite], [SC.outro, Outro]];

export const FraudeTikTok: React.FC = () => {
  const t = useCurrentFrame() / 30;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      {LIST.map(([[a, b], Comp], i) => (t >= a && t < b + 0.5 ? <AbsoluteFill key={i}><Comp t={t} /></AbsoluteFill> : null))}
      <AbsoluteFill style={{opacity: 1 - Math.max(inOut(t, SC.reflexes[0] + 0.3, SC.reflexes[1], 0.3, 0.1), prog(t, SC.outro[0] + 0.3, 0.3))}}><Vignette o={0.3} /></AbsoluteFill>
      <Logo t={t} />
    </AbsoluteFill>
  );
};

export {DURATION_TT, END_VO};

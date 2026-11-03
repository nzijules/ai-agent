import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {AgentDesk} from '../components/AgentDesk';
import {Glitch, Kinetic, LightLeak, RGBSplit, Vignette} from '../components/Fx';
import {
  AlertIcon, CheckBadge, ChatIcon, ChipIcon, ClockIcon, EarIcon, EyeIcon, GlobeIcon, IdIcon, ListIcon,
  PhoneIcon, PinIcon, ProfileIcon, SimIcon, StoreIcon, WarnBadge,
} from '../components/Icons';
import {Office} from '../components/Office';
import {Hooded, Person, PersonProps, SKINS} from '../components/Person';
import {C, F, clamp, drift, easeInOut, inOut, lerp, prog, rnd, sp} from '../lib';
import {FaceScan, NeuralNet, Waveform} from './AiFx';
import {DURATION_IA, END_VO, SC, at, seg} from './timing';

const CYAN = '#00E5FF';
const FPS = 30;

/* ---------------- A — accroche ---------------- */
const SceneA: React.FC<{t: number}> = ({t}) => {
  const t2 = at('intro2');
  const red = prog(t, t2 - 0.1, 0.4);
  const chip = sp(t, 0.4);
  const chipOut = prog(t, t2 - 0.3, 0.3);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, ${red > 0.5 ? '#2a0a10' : '#0c1630'}, #03050a 75%)`}}>
      <NeuralNet t={t} grow={prog(t, 0.1, 3, (x) => x)} color={red > 0.5 ? '229,51,42' : '0,229,255'} o={0.55} />
      <AbsoluteFill style={{display: 'grid', placeItems: 'center'}}>
        <div style={{transform: `scale(${chip * (1 - chipOut) * (1 + 0.04 * Math.sin(t * 4))})`, filter: `drop-shadow(0 0 40px ${CYAN})`, marginTop: -160}}>
          <ChipIcon size={220} color={CYAN} p={prog(t, 0.4, 1.4)} sw={3} />
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: 690, opacity: 1 - chipOut}}>
        <Kinetic t={t} at={at('intro1') + 0.1} text="L'IA TRANSFORME NOTRE QUOTIDIEN" size={54} color="#fff" mode="track" stagger={0.012} />
      </div>
      {t >= t2 - 0.05 && (
        <AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20}}>
          <RGBSplit amt={Math.max(0, 1 - (t - t2) * 2.5) * 16}>
            <Kinetic t={t} at={t2} text="LA FRAUDE" size={190} color="#fff" mode="slam" stagger={0.03} />
          </RGBSplit>
          <div style={{background: C.yellow, padding: '14px 46px', transform: `scaleX(${sp(t, t2 + 0.35)})`}}>
            <Kinetic t={t} at={t2 + 0.45} text="À L'ÈRE DE L'IA" size={110} color={C.black} mode="rise" stagger={0.02} />
          </div>
        </AbsoluteFill>
      )}
      <Glitch i={inOut(t, t2 - 0.1, t2 + 0.35, 0.03, 0.2)} seedT={t} />
    </AbsoluteFill>
  );
};

/* ---------------- B — l'arsenal de l'IA ---------------- */
const Tile: React.FC<{t: number; cue: number; next?: number; i: number; label: string; sub: string; children: React.ReactNode}> = ({t, cue, next, i, label, sub, children}) => {
  const p = sp(t, cue - 0.1, {damping: 16});
  const active = t >= cue && (next === undefined || t < next);
  const x = 80 + (i % 2) * 900, y = 160 + Math.floor(i / 2) * 450;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 860, height: 420, borderRadius: 28, background: '#0d1424', overflow: 'hidden', border: `3px solid ${active ? CYAN : 'rgba(255,255,255,.08)'}`, boxShadow: active ? `0 0 60px rgba(0,229,255,.25)` : 'none', transform: `scale(${(active ? 1.02 : 0.98) * lerp(0.85, 1, p)})`, opacity: clamp(p * 1.6) * (active || next === undefined || t < cue ? 1 : 0.55)}}>
      {children}
      <div style={{position: 'absolute', left: 34, bottom: 28}}>
        <div style={{fontFamily: F.display, fontWeight: 900, fontSize: 46, color: '#fff', letterSpacing: 1}}>{label}</div>
        <div style={{fontFamily: F.ui, fontWeight: 500, fontSize: 26, color: CYAN, marginTop: 4}}>{sub}</div>
      </div>
    </div>
  );
};

const SceneB: React.FC<{t: number}> = ({t}) => {
  const cv = at('voix', 'voix'), cf = at('visage'), cp = at('piece'), cm = at('message');
  const msg = "Bonjour, je suis le titulaire de la ligne. Merci de remplacer ma carte SIM rapidement.";
  const typed = Math.floor(clamp((t - cm - 0.1) / 1.9) * msg.length);
  const blocks = 10 * 6;
  const idP = prog(t, cp, 1.6, (x) => x);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #0c1630, #03050a 75%)'}}>
      <NeuralNet t={t} o={0.25} />
      <Tile t={t} cue={cv} next={cf} i={0} label="VOIX CLONÉE" sub="en quelques secondes">
        <div style={{position: 'absolute', left: 40, top: 40, display: 'flex', flexDirection: 'column', gap: 18}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
            <div style={{width: 120, fontFamily: F.ui, fontWeight: 700, fontSize: 22, color: '#9fb0c8'}}>ORIGINALE</div>
            <Waveform t={t} w={620} h={110} color={C.yellow} seed={1} />
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
            <div style={{width: 120, fontFamily: F.ui, fontWeight: 700, fontSize: 22, color: C.red}}>CLONE</div>
            <Waveform t={t + 0.05} w={620} h={110} color={C.red} seed={1.1} reveal={prog(t, cv + 0.2, 1.4, (x) => x)} />
          </div>
        </div>
        <div style={{position: 'absolute', right: 34, bottom: 34, fontFamily: F.ui, fontWeight: 700, fontSize: 40, color: '#fff', opacity: prog(t, cv, 0.3)}}>
          00:0{Math.min(3, Math.max(0, Math.floor((t - cv) * 1.5)))}
        </div>
      </Tile>
      <Tile t={t} cue={cf} next={cp} i={1} label="VISAGE IMITÉ" sub="vidéo truquée (deepfake)">
        <div style={{position: 'absolute', left: 430, top: -20, width: 420, height: 520, transform: 'scale(.82)', transformOrigin: '50% 0'}}>
          <Person t={t} width={420} skin={SKINS[3]} hair="short" outfit="#2C5DAA" accent="#1d3f78" seed={9} />
          <FaceScan t={t} p={prog(t, cf + 0.1, 1.0)} />
          {t > cf + 0.9 &&
            [0, 1, 2, 3].map((k) => {
              const r = rnd(Math.floor(t * 12) + k);
              return r > 0.45 ? <div key={k} style={{position: 'absolute', left: (r - 0.5) * 40, top: 120 + r * 220, width: 420, height: 10 + r * 26, background: k % 2 ? 'rgba(229,51,42,.55)' : 'rgba(0,229,255,.55)', mixBlendMode: 'screen'}} /> : null;
            })}
        </div>
      </Tile>
      <Tile t={t} cue={cp} next={cm} i={2} label="FAUX DOCUMENT" sub="généré en un clic">
        <div style={{position: 'absolute', left: 420, top: 50, width: 400, height: 250, borderRadius: 18, background: '#f4f1e8', overflow: 'hidden', transform: 'rotate(-4deg)', boxShadow: '0 20px 50px rgba(0,0,0,.5)'}}>
          <div style={{height: 46, background: '#d6c38a'}} />
          <div style={{position: 'absolute', left: 26, top: 70, width: 110, height: 140, borderRadius: 10, background: '#cfcabe'}} />
          {[0, 1, 2, 3].map((k) => (
            <div key={k} style={{position: 'absolute', left: 160, top: 80 + k * 34, width: 200 - k * 30, height: 14, borderRadius: 7, background: '#c9c3b4'}} />
          ))}
          {[...Array(blocks)].map((_, k) => {
            const on = rnd(k * 1.7) < idP;
            return on ? null : <div key={k} style={{position: 'absolute', left: (k % 10) * 40, top: Math.floor(k / 10) * 42, width: 40, height: 42, background: '#0d1424', borderRight: '1px solid rgba(0,229,255,.25)', borderBottom: '1px solid rgba(0,229,255,.25)'}} />;
          })}
        </div>
        <div style={{position: 'absolute', left: 40, top: 70}}>
          <IdIcon size={130} color={CYAN} p={prog(t, cp, 0.8)} sw={4} />
        </div>
      </Tile>
      <Tile t={t} cue={cm} i={3} label="MESSAGE SANS FAUTE" sub="rédigé par l'IA">
        <div style={{position: 'absolute', left: 40, top: 40, width: 780, display: 'flex', gap: 22, alignItems: 'flex-start'}}>
          <ChatIcon size={90} color={CYAN} p={prog(t, cm, 0.7)} sw={5} />
          <div style={{flex: 1, background: '#fff', borderRadius: '24px 24px 24px 6px', padding: '22px 28px', fontFamily: F.ui, fontSize: 30, fontWeight: 500, color: C.black, lineHeight: 1.35, minHeight: 130}}>
            {msg.slice(0, typed)}
            <span style={{opacity: Math.floor(t * 3) % 2 ? 1 : 0}}>|</span>
          </div>
        </div>
        <div style={{position: 'absolute', right: 34, bottom: 34, fontFamily: F.ui, fontWeight: 700, fontSize: 26, color: C.black, background: CYAN, padding: '8px 16px', borderRadius: 30, opacity: prog(t, cm + 1.5, 0.3)}}>✦ 0 faute</div>
      </Tile>
    </AbsoluteFill>
  );
};

/* ---------------- C — l'usurpation ---------------- */
const IDS: {w: string; label: string; p: Partial<PersonProps>}[] = [
  {w: 'client', label: 'UN CLIENT', p: {skin: SKINS[4], hair: 'short', beard: true, outfit: '#2C5DAA', accent: '#1d3f78'}},
  {w: 'collègue', label: 'UN COLLÈGUE', p: {skin: SKINS[0], hair: 'fade', outfit: C.yellow, accent: '#111', headset: true}},
  {w: 'responsable', label: 'UN RESPONSABLE', p: {skin: SKINS[2], hair: 'wrap', wrapColor: '#7C3AED', outfit: '#111', accent: '#fff', glasses: true}},
];

const SceneC: React.FC<{t: number}> = ({t}) => {
  const c0 = at('canaux');
  const imp = at('imposteur');
  const chanO = 1 - prog(t, imp - 0.2, 0.4);
  const splitO = prog(t, imp - 0.2, 0.4);
  const cues = IDS.map((d) => at('imposteur', d.w) - 0.15);
  const cur = [...IDS.keys()].reverse().find((k) => t >= cues[k]);
  const mask = cur === undefined ? 0 : 1;
  const swap = cur === undefined ? 0 : inOut(t, cues[cur], cues[cur] + 0.25, 0.03, 0.2);
  const dr = drift(t, 4, 8);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #0c1630, #03050a 75%)'}}>
      {chanO > 0 && (
        <AbsoluteFill style={{opacity: chanO}}>
          <NeuralNet t={t} o={0.2} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center', gap: 120}}>
            {([[PhoneIcon, 'AU TÉLÉPHONE', 'téléphone'], [StoreIcon, 'EN AGENCE', 'agence'], [GlobeIcon, 'CANAUX DIGITAUX', 'canaux']] as const).map(([I, l, w], k) => {
              const a = at('canaux', w) - 0.1;
              const p = sp(t, a);
              return (
                <div key={k} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30, opacity: clamp(p * 1.5), transform: `translateY(${(1 - p) * 120}px)`}}>
                  <div style={{width: 260, height: 260, borderRadius: 130, border: `4px solid ${C.yellow}`, display: 'grid', placeItems: 'center', background: 'rgba(255,203,5,.06)'}}>
                    <I size={150} color={C.yellow} p={prog(t, a, 0.7)} sw={4} />
                  </div>
                  <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 38, color: '#fff', letterSpacing: 2}}>{l}</div>
                </div>
              );
            })}
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 120, opacity: prog(t, c0, 0.4)}}>
            <Kinetic t={t} at={c0} text="PARTOUT OÙ NOUS SERVONS NOS CLIENTS" size={44} color={CYAN} mode="track" stagger={0.01} />
          </div>
        </AbsoluteFill>
      )}
      {splitO > 0 && (
        <AbsoluteFill style={{opacity: splitO}}>
          <div style={{position: 'absolute', left: 0, top: 0, width: 960, height: 1080, overflow: 'hidden', background: 'radial-gradient(ellipse at 45% 55%, #3a0c12, #07030a 75%)'}}>
            <NeuralNet t={t} color="229,51,42" o={0.25} n={22} />
            <div style={{position: 'absolute', left: 130 + dr.x, top: 250 + dr.y}}>
              <Hooded t={t} width={700} phone={false} />
              {/* masque généré par IA */}
              {cur !== undefined && (
                <div style={{position: 'absolute', left: 175, top: 70, width: 350, height: 420, opacity: 0.92 * mask, filter: `drop-shadow(0 0 20px ${CYAN})`, transform: `translateX(${swap * 30 * Math.sin(t * 90)}px)`}}>
                  <div style={{position: 'absolute', inset: 0, clipPath: 'ellipse(36% 44% at 50% 44%)'}}>
                    <Person t={t} width={350} seed={cur * 3} mood="smile" {...IDS[cur].p} />
                  </div>
                  <div style={{position: 'absolute', inset: 0, clipPath: 'ellipse(36% 44% at 50% 44%)', background: `repeating-linear-gradient(0deg, rgba(0,229,255,.22) 0 3px, transparent 3px 7px)`}} />
                </div>
              )}
            </div>
            {cur !== undefined && (
              <div style={{position: 'absolute', left: 60, top: 70, display: 'flex', flexDirection: 'column', gap: 10}}>
                <div style={{fontFamily: F.ui, fontWeight: 700, fontSize: 24, color: '#ff9a94', letterSpacing: 3}}>SE FAIT PASSER POUR…</div>
                <RGBSplit amt={swap * 12}>
                  <div key={cur} style={{fontFamily: F.display, fontWeight: 900, fontSize: 84, color: '#fff', transform: `scale(${sp(t, cues[cur], {damping: 11, stiffness: 240})})`, transformOrigin: '0 50%'}}>{IDS[cur].label}</div>
                </RGBSplit>
              </div>
            )}
          </div>
          <div style={{position: 'absolute', left: 960, top: 0, width: 960, height: 1080, overflow: 'hidden'}}>
            <div style={{position: 'absolute', left: -480, top: 0, width: 1920, height: 1080}}>
              <Office t={t} mood="dim" />
              <div style={{position: 'absolute', inset: 0, transform: 'translateX(130px)'}}>
                <AgentDesk t={t} dark person={{mood: 'neutral', look: 0.4 + Math.sin(t * 1.5) * 0.3, talking: 0}} console={{t, mode: 'risk'}} />
              </div>
            </div>
            <div style={{position: 'absolute', right: 40, bottom: 50, fontFamily: F.display, fontWeight: 800, letterSpacing: 6, fontSize: 24, color: 'rgba(255,255,255,.8)'}}>L'AGENT</div>
          </div>
          <div style={{position: 'absolute', left: 955, top: 0, width: 10, height: 1080, background: C.yellow, boxShadow: '0 0 30px rgba(255,203,5,.7)'}} />
          <Glitch i={swap * 0.6} seedT={t} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* ---------------- D — l'objectif ne change pas ---------------- */
const SceneD: React.FC<{t: number}> = ({t}) => {
  const o0 = at('objectif');
  const cards = [
    {cue: at('objectif', 'remplacement') - 0.1, I: SimIcon, l: 'Remplacement\nde carte SIM'},
    {cue: at('objectif', 'réinitialisation') - 0.1, I: PinIcon, l: 'Réinitialisation\nPIN Mobile Money'},
    {cue: at('objectif', 'modification') - 0.1, I: ProfileIcon, l: 'Modification des\ndonnées client'},
  ];
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #3a0a0e, #0a0204 75%)'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 130}}>
        <Kinetic t={t} at={o0} text="SON OBJECTIF NE CHANGE PAS" size={76} color="#fff" mode="rise" stagger={0.012} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center', gap: 60}}>
        {cards.map(({cue, I, l}, k) => {
          const p = sp(t, cue);
          const ret = prog(t, cue + 0.3, 0.5);
          return (
            <div key={k} style={{position: 'relative', width: 420, height: 500, borderRadius: 32, background: '#fff', border: `6px solid ${C.red}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 34, opacity: clamp(p * 2), transform: `translateY(${(1 - p) * 300}px)`, boxShadow: '0 40px 80px rgba(0,0,0,.5)'}}>
              <div style={{width: 220, height: 220, borderRadius: 110, background: '#ffe5e3', display: 'grid', placeItems: 'center'}}>
                <I size={150} color={C.red} p={prog(t, cue, 0.8)} sw={5} />
              </div>
              <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 36, color: C.black, textAlign: 'center', whiteSpace: 'pre', lineHeight: 1.2}}>{l}</div>
              {/* réticule de ciblage */}
              <svg width={300} height={300} viewBox="-150 -150 300 300" style={{position: 'absolute', top: 30, left: 60, opacity: ret, transform: `rotate(${t * 40}deg) scale(${lerp(1.6, 1, ret)})`}}>
                <circle r={120} fill="none" stroke={C.red} strokeWidth={5} strokeDasharray="30 18" />
                <path d="M0 -150 V-95 M0 150 V95 M-150 0 H-95 M150 0 H95" stroke={C.red} strokeWidth={6} />
              </svg>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- E — nos sens trompés / nos procédures ---------------- */
const SceneE: React.FC<{t: number}> = ({t}) => {
  const s0 = at('sens'), pr = at('procedures');
  const yellow = prog(t, pr - 0.15, 0.25);
  const noise = prog(t, s0 + 0.6, 1.2) * (1 - yellow);
  const jit = noise * 10 * Math.sin(t * 70);
  return (
    <AbsoluteFill style={{background: '#06080e'}}>
      <AbsoluteFill style={{opacity: 1 - yellow}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 220, display: 'flex', justifyContent: 'center', gap: 160, transform: `translateX(${jit}px)`}}>
          <RGBSplit amt={noise * 18}>
            <EyeIcon size={260} color="#fff" p={prog(t, s0, 0.8)} />
          </RGBSplit>
          <RGBSplit amt={noise * 18}>
            <EarIcon size={260} color="#fff" p={prog(t, s0 + 0.25, 0.8)} />
          </RGBSplit>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 620}}>
          <Kinetic t={t} at={s0 + 0.3} text="NOS YEUX ET NOS OREILLES" size={70} color="#fff" mode="rise" stagger={0.01} />
          <Kinetic t={t} at={s0 + 0.9} text="PEUVENT ÊTRE TROMPÉS" size={70} color={C.red} mode="rise" stagger={0.012} style={{marginTop: 16}} />
        </div>
        <Glitch i={noise * 0.5} seedT={t} />
      </AbsoluteFill>
      {yellow > 0 && (
        <AbsoluteFill style={{background: C.yellow, opacity: yellow, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{transform: `scale(${sp(t, pr, {damping: 10, stiffness: 200})})`, position: 'relative', width: 280, height: 280}}>
            <svg viewBox="0 0 100 100" width={280} height={280}>
              <path d="M50 6 L88 20 V48 C88 72 72 88 50 96 C28 88 12 72 12 48 V20 Z" fill={C.black} />
            </svg>
            <div style={{position: 'absolute', left: 70, top: 64}}>
              <ListIcon size={140} color={C.yellow} p={prog(t, pr + 0.2, 0.7)} sw={6} />
            </div>
          </div>
          <div style={{height: 40}} />
          <Kinetic t={t} at={pr + 0.1} text="NOS PROCÉDURES, ELLES," size={70} color={C.black} mode="rise" stagger={0.01} />
          <Kinetic t={t} at={pr + 0.7} text="NE LE SONT PAS." size={120} color={C.black} mode="slam" stagger={0.025} style={{marginTop: 14}} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{background: '#fff', opacity: inOut(t, pr - 0.15, pr + 0.3, 0.05, 0.25) * 0.8}} />
    </AbsoluteFill>
  );
};

/* ---------------- F — les bons réflexes ---------------- */
const R = [
  {id: 'r1', I: IdIcon, title: 'IDENTITÉ\nVÉRIFIÉE', sub: 'Procédures officielles'},
  {id: 'r2', I: ClockIcon, title: 'URGENCE ?\nVIGILANCE.', sub: 'Même d’une voix familière'},
  {id: 'r3', I: ListIcon, title: 'CHAQUE\nVALIDATION', sub: 'Sans exception'},
  {id: 'r4', I: AlertIcon, title: 'UN DOUTE ?\nSIGNALEZ.', sub: 'Suspendre l’opération'},
];
const SceneF: React.FC<{t: number}> = ({t}) => {
  const jam = at('r1', 'jamais');
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 30%, #fffdf4, ${C.paper})`}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 70}}>
        <Kinetic t={t} at={at('r1') - 0.2} text="LES BONS RÉFLEXES FACE À L'IA" size={56} color={C.black} mode="track" stagger={0.01} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 285, display: 'flex', justifyContent: 'center', gap: 44}}>
        {R.map((r, i) => {
          const cue = at(r.id) + (i === 0 ? 0.3 : 0);
          const p = sp(t, cue, {damping: 15});
          const next = R[i + 1] ? at(R[i + 1].id) : 1e9;
          const active = t >= cue && t < next;
          const badge = prog(t, cue + 0.6, 0.6);
          const warn = i === 3;
          return (
            <div key={i} style={{width: 390, height: 560, borderRadius: 36, background: active ? '#fff' : '#fbfaf6', border: `5px solid ${active ? (warn ? C.red : C.yellow) : '#ebe7dc'}`, boxShadow: active ? '0 40px 80px rgba(0,0,0,.16)' : '0 12px 30px rgba(0,0,0,.06)', transform: `translateY(${(1 - p) * 300 - (active ? 16 : 0)}px) scale(${active ? 1.04 : 1})`, opacity: clamp(p * 2), position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 56}}>
              <div style={{position: 'absolute', left: 30, top: 22, fontFamily: F.display, fontWeight: 900, fontSize: 40, color: '#d9d3c3'}}>0{i + 1}</div>
              <div style={{width: 200, height: 200, borderRadius: 100, background: warn ? '#ffe9e7' : '#FFF3C4', display: 'grid', placeItems: 'center'}}>
                <r.I size={130} p={prog(t, cue + 0.1, 0.8)} color={warn ? C.red : C.black} sw={5} />
              </div>
              <div style={{fontFamily: F.display, fontWeight: 900, fontSize: 40, lineHeight: 1.1, textAlign: 'center', color: C.black, marginTop: 36, whiteSpace: 'pre'}}>{r.title}</div>
              <div style={{fontFamily: F.ui, fontWeight: 500, fontSize: 27, color: '#6b6f76', marginTop: 16, textAlign: 'center', padding: '0 20px'}}>{r.sub}</div>
              <div style={{position: 'absolute', bottom: -45}}>{warn ? <WarnBadge p={badge} t={t} /> : <CheckBadge p={badge} />}</div>
            </div>
          );
        })}
      </div>
      {/* « jamais sur la seule base d'une voix, d'une image ou d'un document » */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 168, display: 'flex', justifyContent: 'center', gap: 24, opacity: inOut(t, jam - 0.1, at('r2') - 0.1, 0.3, 0.3)}}>
        <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 32, color: C.black, alignSelf: 'center'}}>JAMAIS SUR LA SEULE BASE D'</div>
        {[['UNE VOIX', 'voix'], ['UNE IMAGE', 'image'], ['UN DOCUMENT', 'document']].map(([l, w], k) => {
          const p = sp(t, at('r1', w) - 0.1);
          return (
            <div key={k} style={{background: C.black, color: C.yellow, fontFamily: F.display, fontWeight: 800, fontSize: 30, padding: '12px 26px', borderRadius: 40, transform: `scale(${p})`, position: 'relative'}}>
              {l}
              <div style={{position: 'absolute', left: 14, right: 14, top: '50%', height: 5, background: C.red, transform: `scaleX(${prog(t, at('r1', w) + 0.25, 0.25)})`, transformOrigin: '0 50%'}} />
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 168, display: 'flex', justifyContent: 'center', gap: 30}}>
        {([[at('r4', 'suspendons'), "SUSPENDRE L'OPÉRATION", C.black], [at('r4', 'signalons'), 'SIGNALER', C.red]] as [number, string, string][]).map(([a, s, col], i) => {
          const p = sp(t, a - 0.1);
          return (
            <div key={i} style={{background: col, color: '#fff', fontFamily: F.display, fontWeight: 800, fontSize: 34, letterSpacing: 2, padding: '16px 34px', borderRadius: 50, transform: `scale(${p})`, opacity: clamp(p * 2)}}>
              {s}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- G — clôture ---------------- */
const Shield: React.FC<{t: number; a: number; size: number}> = ({t, a, size}) => (
  <svg viewBox="-150 -150 300 300" width={size} height={size} style={{overflow: 'visible'}}>
    {[...Array(6)].map((_, i) => {
      const p = sp(t, a + i * 0.1, {damping: 14});
      const a0 = (i / 6) * Math.PI * 2 - Math.PI / 2, a1 = ((i + 1) / 6) * Math.PI * 2 - Math.PI / 2, g = 0.04;
      const pt = (an: number, rr: number) => `${Math.cos(an) * rr},${Math.sin(an) * rr}`;
      const am = (a0 + a1) / 2, off = (1 - p) * 200;
      return <polygon key={i} points={`${pt(a0 + g, 130)} ${pt(a1 - g, 130)} ${pt(a1 - g, 108)} ${pt(a0 + g, 108)}`} fill={C.black} opacity={clamp(p * 1.5)} transform={`translate(${Math.cos(am) * off} ${Math.sin(am) * off})`} />;
    })}
    <circle r={160 + ((t * 40) % 40)} fill="none" stroke={C.black} strokeWidth={2} opacity={0.25 * (1 - ((t * 40) % 40) / 40)} />
  </svg>
);

const SceneG: React.FC<{t: number}> = ({t}) => {
  const ev = at('evolue'), notre = at('evolue', 'Notre'), fin = at('final');
  const wipe = prog(t, notre - 0.25, 0.45, easeInOut);
  const finO = prog(t, fin - 0.2, 0.4);
  const endO = prog(t, END_VO + 0.25, 0.5);
  const fade = prog(t, DURATION_IA - 0.8, 0.75);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #0c1630, #03050a 75%)'}}>
      <NeuralNet t={t} o={0.5} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 380, opacity: 1 - wipe}}>
        <Kinetic t={t} at={ev} text="LA TECHNOLOGIE ÉVOLUE." size={110} color="#fff" mode="rise" stagger={0.015} />
      </div>
      {wipe > 0 && <div style={{position: 'absolute', left: 960 - 1200 * wipe, top: 540 - 1200 * wipe, width: 2400 * wipe, height: 2400 * wipe, borderRadius: '50%', background: C.yellow}} />}
      {wipe > 0.5 && finO < 1 && (
        <AbsoluteFill style={{display: 'grid', placeItems: 'center', opacity: 1 - finO}}>
          <div>
            <Kinetic t={t} at={notre} text="NOTRE VIGILANCE" size={130} color={C.black} mode="slam" stagger={0.02} />
            <Kinetic t={t} at={notre + 0.45} text="AUSSI." size={180} color={C.black} mode="slam" stagger={0.04} style={{marginTop: 10}} />
          </div>
        </AbsoluteFill>
      )}
      {finO > 0 && endO < 1 && (
        <AbsoluteFill style={{background: C.yellow, opacity: finO * (1 - endO)}}>
          <div style={{position: 'absolute', left: 960 - 200, top: 90, transform: `scale(${lerp(1, 0.8, prog(t, at('final', 'soyons'), 0.6, easeInOut))})`}}>
            <div style={{position: 'absolute', left: 0, top: 0}}><Shield t={t} a={fin + 0.2} size={400} /></div>
            <div style={{position: 'absolute', left: 120, top: 120, width: 160, height: 160, borderRadius: 80, background: '#fff', display: 'grid', placeItems: 'center', transform: `scale(${sp(t, fin)})`}}>
              <svg viewBox="0 0 100 100" width={100} height={100}><circle cx={50} cy={36} r={16} fill="none" stroke={C.black} strokeWidth={7} /><path d="M18 88 C20 64 34 56 50 56 C66 56 80 64 82 88" fill="none" stroke={C.black} strokeWidth={7} strokeLinecap="round" /></svg>
            </div>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 560}}>
            <Kinetic t={t} at={fin} text="DIRECTION CLIENTÈLE" size={56} color={C.black} weight={800} mode="track" stagger={0.012} letterSpacing={8} />
            <div style={{display: 'flex', justifyContent: 'center', marginTop: 30}}>
              <div style={{background: C.black, padding: '22px 54px', transform: `scaleX(${sp(t, at('final', 'première') - 0.2)})`}}>
                <Kinetic t={t} at={at('final', 'première') - 0.1} text="PREMIÈRE LIGNE DE DÉFENSE" size={92} color={C.yellow} mode="slam" stagger={0.015} />
              </div>
            </div>
            <Kinetic t={t} at={at('final', 'face') - 0.1} text="CONTRE LA FRAUDE, MÊME AUGMENTÉE PAR L'IA" size={42} color={C.black} weight={800} mode="rise" stagger={0.008} style={{marginTop: 30}} />
          </div>
        </AbsoluteFill>
      )}
      {endO > 0 && (
        <AbsoluteFill style={{background: C.yellow, opacity: endO, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <Kinetic t={t} at={END_VO + 0.3} text="LA FRAUDE À L'ÈRE DE L'IA" size={92} color={C.black} mode="rise" stagger={0.012} />
          <div style={{display: 'flex', gap: 22, marginTop: 50}}>
            {['VÉRIFIER', "RÉSISTER À L'URGENCE", 'SIGNALER'].map((w, k) => {
              const p = sp(t, END_VO + 0.7 + k * 0.2);
              return <div key={k} style={{background: C.black, color: C.yellow, fontFamily: F.display, fontWeight: 800, fontSize: 36, padding: '14px 32px', borderRadius: 50, transform: `scale(${p})`}}>{w}</div>;
            })}
          </div>
          <div style={{width: 120, height: 6, background: C.black, margin: '60px 0 30px', transform: `scaleX(${prog(t, END_VO + 1.3, 0.5)})`}} />
          <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 30, color: C.black, letterSpacing: 4, opacity: prog(t, END_VO + 1.5, 0.5)}}>MTN CÔTE D'IVOIRE · DIRECTION CLIENTÈLE</div>
          <div style={{fontFamily: F.display, fontWeight: 600, fontSize: 24, color: C.black, letterSpacing: 8, marginTop: 10, opacity: prog(t, END_VO + 1.7, 0.5)}}>AVEC FORENSIC SERVICES</div>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{background: '#000', opacity: fade}} />
    </AbsoluteFill>
  );
};

/* ---------------- Logo permanent en haut à droite ---------------- */
const Logo: React.FC<{t: number}> = ({t}) => {
  // fonds clairs : fin de la scène E (jaune), scène F (papier), scène G après le volet jaune
  const lightE = prog(t, at('procedures') - 0.15, 0.25) * (1 - prog(t, SC.f[0], 0.01));
  const lightF = t >= SC.f[0] && t < SC.g[0] ? 1 - prog(t, SC.g[0], 0.3) : 0;
  const lightG = prog(t, at('evolue', 'Notre') - 0.05, 0.3);
  const light = Math.max(lightE, lightF, lightG);
  const o = prog(t, 0.6, 0.6) * (1 - prog(t, DURATION_IA - 0.8, 0.75));
  const st: React.CSSProperties = {position: 'absolute', right: 56, top: 44, width: 176};
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: o}}>
      <Img src={staticFile('mtn-logo-white.png')} style={{...st, opacity: 1 - light}} />
      <Img src={staticFile('mtn-logo-black.png')} style={{...st, opacity: light}} />
    </AbsoluteFill>
  );
};

const LIST: [readonly [number, number], React.FC<{t: number}>][] = [
  [SC.a, SceneA], [SC.b, SceneB], [SC.c, SceneC], [SC.d, SceneD], [SC.e, SceneE], [SC.f, SceneF], [SC.g, SceneG],
];

export const FraudeIA: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {LIST.map(([[a, b], Comp], i) =>
        t >= a && t < b + 0.4 ? (
          <AbsoluteFill key={i} style={{opacity: i ? prog(t, a, 0.3) : 1}}>
            <Comp t={t} />
          </AbsoluteFill>
        ) : null,
      )}
      <LightLeak t={t} at={SC.f[0] - 0.3} dur={1.4} />
      <Glitch i={Math.max(inOut(t, SC.b[0] - 0.1, SC.b[0] + 0.3, 0.03, 0.2) * 0.7, inOut(t, SC.d[0] - 0.1, SC.d[0] + 0.3, 0.03, 0.2) * 0.7)} seedT={t} />
      <Vignette o={0.4} />
      <Logo t={t} />
    </AbsoluteFill>
  );
};

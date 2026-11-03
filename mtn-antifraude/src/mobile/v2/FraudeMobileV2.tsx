/**
 * V2 « MTN Corporate & Cyber » – même scénario, même voix-off, mêmes personnages que la V1 (src/mobile/FraudeMobile.tsx).
 * Règles couleur : jaune MTN = marque & contrôles ; anthracite = profondeur ; blanc = lisibilité ;
 * bleu nuit = UNIQUEMENT menace cyber ; rouge = UNIQUEMENT alertes / anomalies.
 */
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Glitch, Kinetic, RGBSplit, Vignette} from '../../components/Fx';
import {
  AccountIcon, AlertIcon, CheckBadge, ChatIcon, ChipIcon, ClockIcon, EarIcon, EyeIcon, IdIcon, ListIcon, PhoneIcon,
  PinIcon, ProfileIcon, SimIcon, WarnBadge,
} from '../../components/Icons';
import {Office} from '../../components/Office';
import {Hooded, Person, PersonProps, SKINS} from '../../components/Person';
import {Phone} from '../../components/UI';
import {F, clamp, drift, easeInOut, inOut, lerp, prog, rnd, sp} from '../../lib';
import {FaceScan, NeuralNet, Waveform} from '../../ia/AiFx';
import {DURATION_M, END_VO, SC, at, end} from '../timing';

/* ---------- palette V2 ---------- */
export const V = {
  yellow: '#FFCB05', // jaune MTN (valeur usuelle – à confirmer avec la charte officielle)
  anth: '#1E1F22', // noir anthracite
  anth2: '#2A2C31',
  line: '#E4E4E0',
  white: '#FFFFFF',
  paper: '#F7F7F5',
  night: '#0B1B3F', // bleu nuit – menace cyber uniquement
  nightDeep: '#040A1A',
  nightLight: '#5B82F0', // reflets / tracés « IA » dans les séquences de menace
  red: '#E5332A', // alertes & anomalies uniquement
  grey: '#9AA0AA',
};
const NET = '120,150,235';
const W = 1080, H = 1920;
const bgNight = `radial-gradient(ellipse at 50% 40%, #13285a, ${V.nightDeep} 78%)`;
const bgAnth = `radial-gradient(ellipse at 50% 40%, #2c2e33, #121315 78%)`;

/* ---------- personnages (identiques V1) ---------- */
const BOSS: Partial<PersonProps> = {skin: SKINS[2], hair: 'short', glasses: true, outfit: '#15171c', accent: '#f2f2f2', mood: 'neutral', seed: 4};
const AGENT: Partial<PersonProps> = {skin: SKINS[0], hair: 'fade', outfit: V.yellow, accent: '#111', headset: true, seed: 6};
const COLLEAGUE_A: Partial<PersonProps> = {skin: SKINS[1], hair: 'bun', outfit: V.yellow, accent: '#111', headset: true, earrings: true, seed: 2};
const COLLEAGUE_B: Partial<PersonProps> = {skin: SKINS[3], hair: 'wrap', wrapColor: '#1E1F22', outfit: '#111', accent: V.yellow, seed: 8};

const Lines: React.FC<{t: number; at: number; lines: string[]; size: number; color?: string; mode?: 'rise' | 'slam' | 'track'; gap?: number; step?: number; weight?: number; style?: React.CSSProperties}> = ({t, at: a, lines, size, color = '#fff', mode = 'rise', gap = 14, step = 0.18, weight = 900, style}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap, ...style}}>
    {lines.map((l, i) => (
      <Kinetic key={i} t={t} at={a + i * step} text={l} size={size} color={color} mode={mode} stagger={0.012} weight={weight} letterSpacing={1} />
    ))}
  </div>
);

/** Fenêtre d'application crédible (démonstration IA). */
const AppWindow: React.FC<{title: string; status: string; p: number; children: React.ReactNode; style?: React.CSSProperties}> = ({title, status, p, children, style}) => (
  <div style={{position: 'absolute', width: 940, height: 900, borderRadius: 30, background: V.anth, border: `2px solid ${V.anth2}`, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,.6)', ...style}}>
    <div style={{height: 76, background: V.anth2, display: 'flex', alignItems: 'center', gap: 14, padding: '0 28px'}}>
      {[0, 1, 2].map((i) => <div key={i} style={{width: 18, height: 18, borderRadius: 9, background: '#4a4d55'}} />)}
      <div style={{marginLeft: 16, fontFamily: F.ui, fontWeight: 700, fontSize: 28, color: V.white}}>{title}</div>
      <div style={{marginLeft: 'auto', fontFamily: F.ui, fontSize: 22, color: V.grey}}>Démonstration</div>
    </div>
    <div style={{position: 'absolute', top: 76, left: 0, right: 0, bottom: 110}}>{children}</div>
    <div style={{position: 'absolute', left: 28, right: 28, bottom: 34}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: F.ui, fontSize: 24, color: V.grey, marginBottom: 10}}>
        <span>{p >= 1 ? 'Terminé' : status}</span>
        <span style={{color: V.white, fontWeight: 700}}>{Math.round(p * 100)} %</span>
      </div>
      <div style={{height: 10, borderRadius: 5, background: '#33363d'}}>
        <div style={{height: 10, borderRadius: 5, width: `${p * 100}%`, background: V.nightLight}} />
      </div>
    </div>
  </div>
);

/** Écran d'appel entrant (interface simulée). */
const CallScreen: React.FC<{t: number; reveal: number}> = ({t, reveal}) => (
  <div style={{position: 'absolute', inset: 0, background: `linear-gradient(170deg, ${V.anth2}, #0b0c0e)`, fontFamily: F.ui, color: '#fff', textAlign: 'center'}}>
    <div style={{marginTop: 120, fontSize: 30, color: V.grey}}>Appel entrant…</div>
    <div style={{margin: '18px auto 0', width: 150, background: V.red, borderRadius: 30, fontWeight: 700, fontSize: 24, padding: '6px 0', opacity: 0.6 + 0.4 * Math.abs(Math.sin(t * 5))}}>URGENT</div>
    <div style={{margin: '50px auto 0', width: 300, height: 300, borderRadius: 150, overflow: 'hidden', background: '#3a3d45', position: 'relative', boxShadow: reveal > 0.5 ? `0 0 0 6px ${V.red}, 0 0 60px ${V.red}` : '0 0 0 6px rgba(255,255,255,.12)'}}>
      <div style={{position: 'absolute', left: -28, top: 0, opacity: 1 - reveal}}><Person t={t} width={356} {...BOSS} mood="smile" /></div>
      <div style={{position: 'absolute', left: -32, top: 10, opacity: reveal}}><Hooded t={t} width={364} phone={false} rim={V.nightLight} /></div>
    </div>
    <div style={{marginTop: 40, fontSize: 52, fontWeight: 700, fontFamily: F.display}}>Mon responsable</div>
    <div style={{marginTop: 8, fontSize: 28, color: reveal > 0.5 ? V.red : V.grey, fontWeight: reveal > 0.5 ? 700 : 400}}>{reveal > 0.5 ? '⚠ Identité non vérifiée' : 'Mobile'}</div>
    <div style={{display: 'flex', justifyContent: 'center', marginTop: 40}}>
      <Waveform t={t} w={360} h={90} color={V.white} bars={30} />
    </div>
    <div style={{position: 'absolute', bottom: 90, left: 0, right: 0, display: 'flex', justifyContent: 'space-around'}}>
      <div style={{width: 110, height: 110, borderRadius: 55, background: '#4a4d55'}} />
      <div style={{width: 110, height: 110, borderRadius: 55, background: V.yellow, transform: `scale(${1 + 0.08 * Math.sin(t * 8)})`}} />
    </div>
  </div>
);

/** Masque holographique (visage cloné du responsable) posé sur le fraudeur ; se brise si shatter > 0. */
const HoloMask: React.FC<{t: number; who?: Partial<PersonProps>; shatter?: number; w?: number}> = ({t, who = BOSS, shatter = 0, w = 350}) => {
  const pieces = [
    'polygon(0 0, 55% 0, 40% 45%, 0 60%)', 'polygon(55% 0, 100% 0, 100% 50%, 40% 45%)',
    'polygon(0 60%, 40% 45%, 55% 100%, 0 100%)', 'polygon(40% 45%, 100% 50%, 100% 100%, 55% 100%)',
  ];
  return (
    <div style={{position: 'relative', width: w, height: w * 1.2, filter: `drop-shadow(0 0 18px ${V.nightLight})`}}>
      {pieces.map((cp, i) => (
        <div key={i} style={{position: 'absolute', inset: 0, clipPath: cp, transform: `translate(${(i % 2 ? 1 : -1) * shatter * 120}px, ${shatter * (260 + i * 60)}px) rotate(${(i % 2 ? 1 : -1) * shatter * 35}deg)`, opacity: 1 - shatter}}>
          <div style={{position: 'absolute', inset: 0, clipPath: 'ellipse(36% 44% at 50% 44%)'}}>
            <Person t={t} width={w} {...who} mood="smile" />
          </div>
          <div style={{position: 'absolute', inset: 0, clipPath: 'ellipse(36% 44% at 50% 44%)', background: `repeating-linear-gradient(0deg, rgba(91,130,240,.25) 0 3px, transparent 3px 7px)`}} />
        </div>
      ))}
    </div>
  );
};

/* ======================= 1 — accroche (menace) ======================= */
const Hook: React.FC<{t: number}> = ({t}) => {
  const nep = at('q1', "n'était") - 0.1;
  const reveal = prog(t, nep, 0.25);
  const ring = inOut(t, 0.2, nep, 0.1, 0.1);
  const shake = ring * Math.sin(t * 60) * 6 * (Math.floor(t * 2) % 2);
  const e0 = at('ere') - 0.35;
  const shrink = prog(t, e0, 0.7, easeInOut);
  const net = prog(t, e0 + 0.1, 1.2, easeInOut);
  return (
    <AbsoluteFill style={{background: bgNight}}>
      {/* réseau qui jaillit du téléphone */}
      <AbsoluteFill style={{clipPath: `circle(${net * 1500}px at 540px 930px)`}}>
        <NeuralNet t={t} w={W} h={H} n={40} color={NET} o={0.6} />
      </AbsoluteFill>
      {shrink < 1 && (
        <AbsoluteFill style={{opacity: 1 - prog(t, e0 + 0.4, 0.3)}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 230, opacity: 1 - shrink}}>
            <Lines t={t} at={0.5} lines={['ET SI CETTE VOIX…']} size={76} />
          </div>
          <div style={{position: 'absolute', left: (W - 520) / 2, top: 400, transform: `translateX(${shake}px) rotate(${shake * 0.15}deg) scale(${lerp(0.9, 1, sp(t, 0.1)) * lerp(1, 0.15, shrink)})`, transformOrigin: '50% 50%'}}>
            <Phone w={520} glow={0.35}>
              <CallScreen t={t} reveal={reveal} />
            </Phone>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 1530, opacity: 1 - shrink}}>
            <Lines t={t} at={nep} lines={["N'ÉTAIT PAS", 'LA SIENNE ?']} size={92} mode="slam" gap={6} step={0.25} />
          </div>
          <Glitch i={inOut(t, nep, nep + 0.4, 0.03, 0.25)} seedT={t} color2={V.nightLight} />
        </AbsoluteFill>
      )}
      {t > at('ere') - 0.1 && (
        <AbsoluteFill>
          <div style={{position: 'absolute', left: 0, right: 0, top: 560}}>
            <Lines t={t} at={at('ere') + 0.1} lines={["AVEC L'INTELLIGENCE", 'ARTIFICIELLE,']} size={56} color={V.white} weight={800} mode="track" gap={8} step={0.25} />
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 800}}>
            <RGBSplit amt={Math.max(0, 1 - (t - at('ere', 'fraude')) * 2.5) * 14}>
              <Lines t={t} at={at('ere', 'fraude') - 0.05} lines={['LA FRAUDE']} size={170} mode="slam" />
            </RGBSplit>
            <div style={{display: 'flex', justifyContent: 'center', marginTop: 34}}>
              <div style={{background: V.yellow, padding: '18px 40px', transform: `scaleX(${sp(t, at('ere', 'nouvelle') - 0.2)})`}}>
                <Lines t={t} at={at('ere', 'nouvelle') - 0.1} lines={['ENTRE DANS UNE', 'NOUVELLE ÈRE']} size={80} color={V.anth} gap={6} step={0.2} />
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* ======================= 2 — démonstration : ce que l'IA permet ======================= */
const ITEMS = [
  {id: 'voix', I: EarIcon, app: 'Clonage vocal', status: 'Clonage de la voix…', label: 'VOIX CLONÉE', sub: 'à partir de quelques secondes'},
  {id: 'visage', I: EyeIcon, app: 'Synthèse faciale', status: 'Génération du visage…', label: 'VISAGE REPRODUIT', sub: 'dans une vidéo'},
  {id: 'piece', I: IdIcon, app: 'Générateur de documents', status: 'Falsification…', label: 'PIÈCE FALSIFIÉE', sub: 'un réalisme troublant'},
  {id: 'message', I: ChatIcon, app: 'Rédaction automatique', status: 'Rédaction…', label: 'MESSAGE « PRO »', sub: 'parfaitement rédigé'},
];
const Arsenal: React.FC<{t: number}> = ({t}) => {
  const cues = ITEMS.map((x) => at(x.id) - 0.1);
  const k = Math.max(0, [...cues.keys()].reverse().find((i) => t >= cues[i]) ?? 0);
  const msg = 'Bonjour, merci de traiter en priorité le remplacement de SIM du client mentionné. Je compte sur vous. Cordialement.';
  const p = (i: number) => prog(t, cues[i] + 0.2, (i < 3 ? cues[i + 1] : SC.arsenal[1]) - cues[i] - 0.6, (x) => x);
  const typed = Math.floor(clamp(p(3) * 1.1) * msg.length);
  const panel = (i: number) => {
    if (i === 0)
      return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, paddingTop: 70}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <div style={{width: 90, height: 90, borderRadius: 45, overflow: 'hidden', background: '#3a3d45', position: 'relative'}}>
              <div style={{position: 'absolute', left: -9, top: 0}}><Person t={t} width={108} {...BOSS} /></div>
            </div>
            <div style={{fontFamily: F.ui, fontWeight: 700, fontSize: 30, color: V.white}}>Source : « Mon responsable »</div>
          </div>
          <Waveform t={t} w={820} h={170} color={V.white} seed={1} bars={40} />
          <div style={{fontFamily: F.ui, fontWeight: 700, fontSize: 28, color: V.nightLight, letterSpacing: 3}}>COPIE SYNTHÉTIQUE</div>
          <Waveform t={t + 0.05} w={820} h={170} color={V.nightLight} seed={1.1} bars={40} reveal={p(0)} />
        </div>
      );
    if (i === 1)
      return (
        <div style={{position: 'absolute', inset: 0}}>
          <div style={{position: 'absolute', left: 40, top: 40, width: 200, height: 250, borderRadius: 16, overflow: 'hidden', background: '#3a3d45', border: '2px solid #4a4d55'}}>
            <div style={{position: 'absolute', left: -20, top: 0}}><Person t={t} width={240} {...BOSS} /></div>
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,.6)', fontFamily: F.ui, fontSize: 20, color: V.white, textAlign: 'center', padding: 4}}>Photo source</div>
          </div>
          <div style={{position: 'absolute', left: 290, top: 30, width: 560, height: 680}}>
            <div style={{opacity: p(1) * 0.9 + 0.1}}><Person t={t} width={560} {...BOSS} talking={0.6} /></div>
            <FaceScan t={t} p={prog(t, cues[1] + 0.1, 1.0)} w={560} h={680} color="91,130,240" />
            {t > cues[1] + 1.0 &&
              [0, 1, 2].map((q) => {
                const r = rnd(Math.floor(t * 12) + q);
                return r > 0.5 ? <div key={q} style={{position: 'absolute', left: (r - 0.5) * 50, top: 160 + r * 300, width: 560, height: 12 + r * 30, background: 'rgba(91,130,240,.45)', mixBlendMode: 'screen'}} /> : null;
              })}
          </div>
        </div>
      );
    if (i === 2)
      return (
        <div style={{position: 'absolute', left: 90, top: 150, width: 760, height: 480, borderRadius: 30, background: '#f4f1e8', overflow: 'hidden', transform: 'rotate(-3deg)', boxShadow: '0 30px 60px rgba(0,0,0,.5)'}}>
          <div style={{height: 80, background: '#d9d4c6'}} />
          <div style={{position: 'absolute', left: 50, top: 130, width: 210, height: 270, borderRadius: 16, background: '#cfcabe'}} />
          {[0, 1, 2, 3].map((q) => <div key={q} style={{position: 'absolute', left: 310, top: 150 + q * 62, width: 380 - q * 60, height: 26, borderRadius: 13, background: '#c9c3b4'}} />)}
          {[...Array(12 * 8)].map((_, q) => (rnd(q * 1.7) < p(2) ? null : <div key={q} style={{position: 'absolute', left: (q % 12) * 64, top: Math.floor(q / 12) * 60, width: 64, height: 60, background: V.night, borderRight: '1px solid rgba(91,130,240,.35)', borderBottom: '1px solid rgba(91,130,240,.35)'}} />))}
        </div>
      );
    return (
      <div style={{position: 'absolute', left: 40, top: 40, right: 40, fontFamily: F.ui}}>
        {[['De', 'Direction régionale  <•••••@•••••>'], ['Objet', 'URGENT – remplacement SIM']].map(([a, b]) => (
          <div key={a} style={{display: 'flex', gap: 18, fontSize: 28, padding: '12px 0', borderBottom: '1px solid #33363d'}}>
            <span style={{color: V.grey, width: 90}}>{a}</span><span style={{color: V.white, fontWeight: 700}}>{b}</span>
          </div>
        ))}
        <div style={{marginTop: 26, fontSize: 38, color: V.white, lineHeight: 1.45, minHeight: 300}}>
          {msg.slice(0, typed)}
          <span style={{opacity: Math.floor(t * 3) % 2 ? 1 : 0}}>|</span>
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{background: bgNight}}>
      <NeuralNet t={t} w={W} h={H} n={30} o={0.22} color={NET} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 220}}>
        <Lines t={t} at={SC.arsenal[0] + 0.2} lines={["CE QUE L'IA PERMET"]} size={58} weight={800} mode="track" />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 320, display: 'flex', justifyContent: 'center', gap: 40}}>
        {ITEMS.map(({I}, i) => {
          const on = t >= cues[i];
          const cur = i === k && on;
          return (
            <div key={i} style={{width: 130, height: 130, borderRadius: 65, border: `4px solid ${cur ? V.white : on ? 'rgba(255,255,255,.45)' : 'rgba(255,255,255,.12)'}`, display: 'grid', placeItems: 'center', background: cur ? 'rgba(91,130,240,.25)' : 'transparent', transform: `scale(${cur ? 1.1 : 1})`}}>
              <I size={78} color={on ? V.white : '#3a4560'} p={1} sw={5} />
            </div>
          );
        })}
      </div>
      {ITEMS.map((it, i) => {
        const pin = sp(t, cues[i], {damping: 18});
        const pout = i < 3 ? prog(t, cues[i + 1], 0.4, easeInOut) : 0;
        if (t < cues[i] - 0.05 || pout >= 1) return null;
        // transition « interface » : la fenêtre glisse en profondeur
        return (
          <AppWindow key={i} title={it.app} status={it.status} p={p(i)} style={{left: 70, top: 520, transform: `perspective(1600px) translateX(${(1 - pin) * 700}px) rotateY(${(1 - pin) * -25 + pout * 25}deg) translateX(${-pout * 900}px) scale(${1 - pout * 0.15})`, opacity: 1 - pout * 0.6}}>
            {panel(i)}
          </AppWindow>
        );
      })}
      {ITEMS.map((it, i) => {
        const o = inOut(t, cues[i] + 0.1, i < 3 ? cues[i + 1] : SC.arsenal[1] + 0.3, 0.3, 0.2);
        return o > 0 ? (
          <div key={i} style={{position: 'absolute', left: 0, right: 0, top: 1470, opacity: o, textAlign: 'center'}}>
            <div style={{fontFamily: F.display, fontWeight: 900, fontSize: 80, color: V.white}}>{it.label}</div>
            <div style={{fontFamily: F.ui, fontWeight: 500, fontSize: 38, color: V.grey, marginTop: 8}}>{it.sub}</div>
          </div>
        ) : null;
      })}
    </AbsoluteFill>
  );
};

/* ======================= 3 — le scénario ======================= */
const Scenario: React.FC<{t: number}> = ({t}) => {
  const im = at('imaginez');
  const splitO = prog(t, at('appel') - 0.3, 0.4);
  const der = at('derriere'), fr = at('derriere', 'fraudeur');
  const reveal = prog(t, der + 0.6, 0.3);
  const checks: [number, string][] = [[at('normal', 'voix') - 0.1, 'Voix reconnaissable'], [at('ton') - 0.1, 'Ton convaincant'], [at('urgence') - 0.1, 'Urgence réelle']];
  const dr = drift(t, 4, 3);
  const push = prog(t, SC.scenario[0], 1.6, easeInOut);
  return (
    <AbsoluteFill style={{background: V.anth}}>
      {/* « Imaginez… » : plan d'installation, travelling avant vers le conseiller */}
      {splitO < 1 && (
        <AbsoluteFill style={{opacity: 1 - splitO}}>
          <AbsoluteFill style={{transform: `scale(${lerp(1.05, 1.35, push)})`, transformOrigin: '50% 70%'}}>
            <div style={{position: 'absolute', left: -420, top: 0, width: 1920, height: 1080, transform: 'scale(1.78)', transformOrigin: '50% 0'}}>
              <Office t={t} mood="day" />
            </div>
            <div style={{position: 'absolute', left: 120, top: 900}}><Person t={t} width={840} {...AGENT} mood="focused" look={0.4} /></div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 1660, height: 300, background: 'linear-gradient(#8a6a4a,#5f4630)'}} />
          </AbsoluteFill>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,21,24,.85) 0%, rgba(20,21,24,0) 40%)'}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 300}}>
            <Lines t={t} at={im - 0.05} lines={['IMAGINEZ…']} size={120} mode="track" />
          </div>
        </AbsoluteFill>
      )}
      {splitO > 0 && (
        <AbsoluteFill style={{opacity: splitO}}>
          {/* haut : l'appelant (menace) */}
          <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 960, overflow: 'hidden', background: bgNight}}>
            <NeuralNet t={t} w={W} h={960} n={20} o={0.25} color={NET} />
            <div style={{position: 'absolute', left: 60, top: 190, display: 'flex', alignItems: 'center', gap: 20}}>
              <div style={{background: V.red, color: '#fff', fontFamily: F.ui, fontWeight: 700, fontSize: 28, padding: '8px 22px', borderRadius: 30, opacity: 0.6 + 0.4 * Math.abs(Math.sin(t * 5))}}>APPEL URGENT</div>
              <div style={{fontFamily: F.ui, fontWeight: 700, fontSize: 28, color: V.grey}}>Au bout du fil…</div>
            </div>
            <div style={{position: 'absolute', left: 60, top: 290, width: 360, height: 360, borderRadius: 180, overflow: 'hidden', background: '#3a3d45', boxShadow: reveal > 0.5 ? `0 0 0 6px ${V.red}, 0 0 60px ${V.red}` : '0 0 0 6px rgba(255,255,255,.6)', transform: `translate(${dr.x}px,${dr.y}px)`}}>
              <div style={{position: 'absolute', left: -40, top: 0, opacity: 1 - reveal}}><Person t={t} width={440} {...BOSS} talking={t > at('fil') && t < end('fil') ? 0.8 : 0} /></div>
              <div style={{position: 'absolute', left: -40, top: 10, opacity: reveal}}><Hooded t={t} width={440} phone={false} rim={V.nightLight} /></div>
            </div>
            <div style={{position: 'absolute', left: 460, top: 330, fontFamily: F.display, fontWeight: 800, fontSize: 46, color: '#fff'}}>Mon responsable</div>
            <div style={{position: 'absolute', left: 460, top: 390, fontFamily: F.ui, fontWeight: 700, fontSize: 26, color: reveal > 0.5 ? V.red : V.grey}}>{reveal > 0.5 ? '⚠ Voix synthétique ?' : 'Appel vocal'}</div>
            <div style={{position: 'absolute', left: 460, top: 440}}>
              <Waveform t={t} w={520} h={110} color={reveal > 0.5 ? V.nightLight : V.white} bars={32} />
            </div>
            <div style={{position: 'absolute', left: 460, top: 575, width: 560, background: '#fff', borderRadius: '28px 28px 28px 6px', padding: '22px 28px', fontFamily: F.ui, fontWeight: 700, fontSize: 34, color: V.anth, transform: `scale(${sp(t, at('fil', 'demande') - 0.1)})`, transformOrigin: '0 0'}}>
              « Une opération exceptionnelle, tout de suite ! »
            </div>
            <div style={{position: 'absolute', left: 60, top: 750, display: 'flex', gap: 16, flexWrap: 'wrap', width: 960}}>
              {checks.map(([a, l], i) => {
                const pp = sp(t, a);
                const bad = reveal > 0.5;
                return (
                  <div key={i} style={{display: 'flex', alignItems: 'center', gap: 12, background: bad ? 'rgba(229,51,42,.12)' : '#fff', border: `3px solid ${bad ? V.red : V.white}`, borderRadius: 40, padding: '10px 22px', fontFamily: F.ui, fontWeight: 700, fontSize: 30, color: bad ? '#fff' : V.anth, transform: `scale(${pp})`, opacity: clamp(pp * 2)}}>
                    <span style={{width: 34, height: 34, borderRadius: 17, display: 'grid', placeItems: 'center', background: bad ? V.red : V.yellow, color: bad ? '#fff' : V.anth, fontSize: 22}}>{bad ? '?' : '✓'}</span> {l}
                  </div>
                );
              })}
            </div>
            <Glitch i={inOut(t, der + 0.5, der + 0.95, 0.03, 0.2)} seedT={t} color2={V.nightLight} />
          </div>
          {/* bas : le conseiller */}
          <div style={{position: 'absolute', left: 0, top: 960, width: W, height: 960, overflow: 'hidden'}}>
            <div style={{position: 'absolute', left: -420, top: -60, width: 1920, height: 1080}}><Office t={t} mood={reveal > 0.5 ? 'dim' : 'day'} /></div>
            <div style={{position: 'absolute', left: 150, top: 120}}>
              <Person t={t} width={780} {...AGENT} mood={reveal > 0.5 ? 'worried' : t > at('normal') ? 'neutral' : 'focused'} look={-0.3} lookY={-0.6} />
            </div>
            <div style={{position: 'absolute', left: 60, top: 50, background: V.anth, color: V.yellow, fontFamily: F.display, fontWeight: 800, fontSize: 30, letterSpacing: 4, padding: '10px 22px'}}>LE CONSEILLER</div>
            {t > at('normal') - 0.2 && reveal < 1 && (
              <div style={{position: 'absolute', left: 0, right: 0, bottom: 300, opacity: 1 - reveal}}>
                <Lines t={t} at={at('normal')} lines={['TOUT SEMBLE NORMAL']} size={70} style={{filter: 'drop-shadow(0 4px 20px rgba(0,0,0,.8))'}} />
              </div>
            )}
          </div>
          <div style={{position: 'absolute', left: 0, top: 955, width: W, height: 10, background: V.yellow}} />
          {t > fr - 0.15 && (
            <div style={{position: 'absolute', left: 0, right: 0, top: 1480}}>
              <RGBSplit amt={Math.max(0, 1 - (t - fr) * 3) * 14}>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                  <div style={{background: V.red, padding: '20px 44px', transform: `rotate(-2deg) scale(${sp(t, fr - 0.1, {damping: 10, stiffness: 260})})`}}>
                    <Kinetic t={t} at={fr - 0.1} text="UN FRAUDEUR" size={110} color="#fff" mode="slam" stagger={0.02} />
                  </div>
                </div>
              </RGBSplit>
            </div>
          )}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* ======================= 4 — son objectif (menace) ======================= */
const Objectif: React.FC<{t: number}> = ({t}) => {
  const cards = [
    {cue: at('sim') - 0.1, I: SimIcon, l: ['Remplacement', 'de carte SIM']},
    {cue: at('pin') - 0.1, I: PinIcon, l: ['Réinitialisation', 'PIN Mobile Money']},
    {cue: at('modif') - 0.1, I: ProfileIcon, l: ['Modification des', 'données client']},
  ];
  return (
    <AbsoluteFill style={{background: bgNight}}>
      <NeuralNet t={t} w={W} h={H} n={24} o={0.18} color={NET} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 260}}>
        <Lines t={t} at={at('objectif') - 0.05} lines={['SON OBJECTIF ?']} size={110} mode="slam" />
      </div>
      {cards.map(({cue, I, l}, i) => {
        const pp = sp(t, cue);
        const ret = prog(t, cue + 0.3, 0.5);
        return (
          <div key={i} style={{position: 'absolute', left: 70, top: 470 + i * 380, width: 940, height: 330, borderRadius: 30, background: '#fff', display: 'flex', alignItems: 'center', gap: 40, padding: '0 50px', opacity: clamp(pp * 2), transform: `perspective(1400px) translateY(${(1 - pp) * 200}px) rotateX(${(1 - pp) * 40}deg)`, boxShadow: '0 30px 70px rgba(0,0,0,.5)'}}>
            <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 14, background: V.anth, borderRadius: '30px 0 0 30px'}} />
            <div style={{position: 'relative', width: 230, height: 230, borderRadius: 115, background: '#eef0f4', display: 'grid', placeItems: 'center', flexShrink: 0}}>
              <I size={150} color={V.anth} p={prog(t, cue, 0.8)} sw={5} />
              <svg width={300} height={300} viewBox="-150 -150 300 300" style={{position: 'absolute', left: -35, top: -35, opacity: ret, transform: `rotate(${t * 40}deg) scale(${lerp(1.6, 1, ret)})`}}>
                <circle r={130} fill="none" stroke={V.red} strokeWidth={6} strokeDasharray="30 18" />
                <path d="M0 -150 V-110 M0 150 V110 M-150 0 H-110 M150 0 H110" stroke={V.red} strokeWidth={7} />
              </svg>
            </div>
            <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 52, color: V.anth, lineHeight: 1.15}}>
              {l.map((x) => <div key={x}>{x}</div>)}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ======================= 5 — voir / entendre → contrôles (bascule vers le jaune) ======================= */
const Sens: React.FC<{t: number}> = ({t}) => {
  const pr = at('protege');
  const wipe = prog(t, pr - 0.3, 0.7, easeInOut);
  const noise = prog(t, at('voir', 'voir') + 0.4, 2.5) * (1 - wipe);
  const rows: [number, React.FC<{size?: number; color?: string; p?: number}>, string][] = [[at('voir', 'voir') - 0.1, EyeIcon, 'VOIR'], [at('entendre') - 0.1, EarIcon, 'ENTENDRE']];
  return (
    <AbsoluteFill style={{background: bgNight}}>
      <NeuralNet t={t} w={W} h={H} n={24} o={0.18} color={NET} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 240}}>
        <Lines t={t} at={at('voir') + 0.1} lines={["AVEC L'IA…"]} size={60} weight={800} mode="track" />
      </div>
      {rows.map(([a, I, w], i) => {
        const pp = sp(t, a);
        const strike = prog(t, a + 0.7, 0.3);
        return (
          <div key={i} style={{position: 'absolute', left: 0, right: 0, top: 420 + i * 560, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: clamp(pp * 2), transform: `translateX(${noise * 8 * Math.sin(t * 70 + i)}px)`}}>
            <RGBSplit amt={noise * 16}><I size={240} color="#fff" p={prog(t, a, 0.7)} /></RGBSplit>
            <div style={{position: 'relative', marginTop: 10}}>
              <div style={{fontFamily: F.display, fontWeight: 900, fontSize: 120, color: '#fff'}}>{w}</div>
              <div style={{position: 'absolute', left: -20, right: -20, top: '52%', height: 16, background: V.red, transform: `scaleX(${strike}) rotate(-3deg)`, transformOrigin: '0 50%'}} />
            </div>
            <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 56, color: V.white, opacity: strike}}>NE SUFFIT PLUS</div>
          </div>
        );
      })}
      <Glitch i={noise * 0.4} seedT={t} color2={V.nightLight} />
      {/* le bouclier jaune s'ouvre et recouvre la menace */}
      {wipe > 0 && (
        <AbsoluteFill style={{background: V.yellow, clipPath: `circle(${wipe * 1750}px at 540px 570px)`}}>
          <div style={{position: 'absolute', left: (W - 380) / 2, top: 380, width: 380, height: 380, transform: `scale(${lerp(0.4, 1, sp(t, pr - 0.2, {damping: 12, stiffness: 160}))})`}}>
            <svg viewBox="0 0 100 100" width={380} height={380}><path d="M50 6 L88 20 V48 C88 72 72 88 50 96 C28 88 12 72 12 48 V20 Z" fill={V.anth} /></svg>
            <div style={{position: 'absolute', left: 95, top: 88}}><ListIcon size={190} color={V.yellow} p={prog(t, pr + 0.1, 0.7)} sw={6} /></div>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 880}}>
            <Lines t={t} at={pr + 0.1} lines={['CE QUI NOUS PROTÈGE']} size={66} color={V.anth} weight={800} />
            <Lines t={t} at={at('protege', 'rigueur') - 0.1} lines={['LA RIGUEUR', 'DE NOS', 'CONTRÔLES']} size={128} color={V.anth} mode="slam" gap={4} step={0.2} style={{marginTop: 40}} />
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* ======================= 6 — prévention : les bons réflexes ======================= */
const RX = [
  {id: 'r1', I: IdIcon, title: 'IDENTITÉ VÉRIFIÉE', sub: 'Selon les procédures officielles'},
  {id: 'r2', I: ClockIcon, title: 'NE PAS CÉDER', sub: ''},
  {id: 'r3', I: ListIcon, title: 'TOUTES LES VALIDATIONS', sub: 'Sans exception'},
  {id: 'r4', I: AlertIcon, title: 'UN DOUTE ? SIGNALEZ', sub: 'Suspendre & alerter par les canaux prévus'},
];
const Reflexes: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{background: V.paper}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 330, background: V.yellow}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 205}}>
      <Lines t={t} at={SC.reflexes[0] + 0.2} lines={['LES BONS RÉFLEXES']} size={78} color={V.anth} mode="track" />
    </div>
    {/* fil conducteur vertical */}
    <div style={{position: 'absolute', left: 145, top: 420, width: 6, height: 1000 * prog(t, at('r1') - 0.1, at('r4') - at('r1') + 0.5, (x) => x), background: V.yellow}} />
    {RX.map((r, i) => {
      const cue = at(r.id) - 0.1;
      const pp = sp(t, cue, {damping: 16});
      const next = RX[i + 1] ? at(RX[i + 1].id) : 1e9;
      const active = t >= cue && t < next;
      const warn = i === 3;
      const badge = prog(t, cue + 0.7, 0.6);
      return (
        <div key={i} style={{position: 'absolute', left: 50, top: 400 + i * 320, width: 980, height: 280, borderRadius: 30, background: '#fff', border: `${active ? 6 : 3}px solid ${active ? V.yellow : V.line}`, boxShadow: active ? '0 30px 70px rgba(0,0,0,.14)' : '0 10px 24px rgba(0,0,0,.05)', display: 'flex', alignItems: 'center', gap: 34, padding: '0 34px', opacity: clamp(pp * 2), transform: `translateX(${(1 - pp) * 300}px) scale(${active ? 1.02 : 1})`}}>
          <div style={{width: 190, height: 190, borderRadius: 95, background: V.yellow, display: 'grid', placeItems: 'center', flexShrink: 0}}>
            <r.I size={120} p={prog(t, cue + 0.1, 0.8)} color={V.anth} sw={5} />
          </div>
          <div style={{flex: 1}}>
            <div style={{fontFamily: F.display, fontWeight: 900, fontSize: 48, color: V.anth, lineHeight: 1.1}}>{r.title}</div>
            {r.sub && <div style={{fontFamily: F.ui, fontWeight: 500, fontSize: 32, color: '#6b6f76', marginTop: 10}}>{r.sub}</div>}
            {i === 1 && (
              <div style={{display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap'}}>
                {[['URGENCE', 'urgence'], ['PRESSION', 'pression'], ['AUTORITÉ', 'autorité']].map(([l, w]) => {
                  const a = at('r2', w) - 0.1;
                  return (
                    <div key={l} style={{position: 'relative', background: V.anth, color: V.white, fontFamily: F.display, fontWeight: 800, fontSize: 28, padding: '8px 18px', borderRadius: 30, transform: `scale(${sp(t, a)})`}}>
                      {l}
                      <div style={{position: 'absolute', left: 10, right: 10, top: '50%', height: 5, background: V.red, transform: `scaleX(${prog(t, a + 0.3, 0.25)})`, transformOrigin: '0 50%'}} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div style={{flexShrink: 0}}>{warn ? <WarnBadge p={badge} t={t} size={86} /> : <CheckBadge p={badge} size={86} color={V.anth} ink={V.yellow} />}</div>
        </div>
      );
    })}
  </AbsoluteFill>
);

/* ======================= 7 — une seule vérification négligée ======================= */
const Seule: React.FC<{t: number}> = ({t}) => {
  const a = at('seule');
  const crack = prog(t, at('seule', 'compromettre') - 0.1, 0.5);
  const line = prog(t, at('seule', 'peut') - 0.2, 0.8);
  return (
    <AbsoluteFill style={{background: bgAnth}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 230}}>
        <Lines t={t} at={a} lines={['UNE SEULE', 'VÉRIFICATION', 'NÉGLIGÉE']} size={90} gap={4} step={0.2} />
      </div>
      <div style={{position: 'absolute', left: 190, top: 640, width: 700, background: '#fff', borderRadius: 30, padding: '30px 40px', boxShadow: '0 30px 70px rgba(0,0,0,.5)', transform: `scale(${sp(t, a + 0.3)})`}}>
        {['Identité', 'Légitimité', 'Validation', 'Signalement'].map((l, i) => {
          const miss = i === 2;
          return (
            <div key={l} style={{display: 'flex', alignItems: 'center', gap: 22, padding: '12px 0', fontFamily: F.ui, fontWeight: 700, fontSize: 40, color: miss ? V.red : V.anth}}>
              <div style={{width: 48, height: 48, borderRadius: 12, border: `4px solid ${miss ? V.red : V.anth}`, background: miss ? (Math.floor(t * 4) % 2 ? 'rgba(229,51,42,.15)' : '#fff') : V.yellow, color: V.anth, display: 'grid', placeItems: 'center', fontSize: 32, fontWeight: 900}}>{miss ? '' : '✓'}</div>
              {l}
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: W / 2 - 4, top: 1060, width: 8, height: 170 * line, background: V.red}} />
      <div style={{position: 'absolute', left: (W - 300) / 2, top: 1220, width: 300, height: 300, borderRadius: 150, background: '#fff', border: `8px solid ${crack > 0.3 ? V.red : V.white}`, display: 'grid', placeItems: 'center', transform: `scale(${sp(t, at('seule', 'peut'))}) translateX(${inOut(t, at('seule', 'compromettre'), at('seule', 'compromettre') + 0.4, 0.02, 0.3) * 12 * Math.sin(t * 80)}px)`}}>
        <AccountIcon size={180} color={V.anth} sw={6} />
        <svg viewBox="0 0 300 300" width={300} height={300} style={{position: 'absolute', inset: 0}}>
          <path d="M150 0 L130 90 L175 150 L120 220 L150 300 M130 90 L60 120 M175 150 L260 170 M120 220 L40 250" stroke={V.red} strokeWidth={6} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - crack} />
        </svg>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1580}}>
        <Lines t={t} at={at('seule', 'compte') - 0.1} lines={['COMPTE CLIENT', 'COMPROMIS']} size={84} mode="slam" gap={4} step={0.2} />
      </div>
    </AbsoluteFill>
  );
};

/* ======================= 8 — conclusion ======================= */
const Shield: React.FC<{t: number; a: number; size: number; color?: string}> = ({t, a, size, color = V.anth}) => (
  <svg viewBox="-150 -150 300 300" width={size} height={size} style={{overflow: 'visible'}}>
    {[...Array(6)].map((_, i) => {
      const pp = sp(t, a + i * 0.1, {damping: 14});
      const a0 = (i / 6) * Math.PI * 2 - Math.PI / 2, a1 = ((i + 1) / 6) * Math.PI * 2 - Math.PI / 2, g = 0.04;
      const pt = (an: number, rr: number) => `${Math.cos(an) * rr},${Math.sin(an) * rr}`;
      const am = (a0 + a1) / 2, off = (1 - pp) * 200;
      return <polygon key={i} points={`${pt(a0 + g, 140)} ${pt(a1 - g, 140)} ${pt(a1 - g, 118)} ${pt(a0 + g, 118)}`} fill={color} opacity={clamp(pp * 1.5)} transform={`translate(${Math.cos(am) * off} ${Math.sin(am) * off})`} />;
    })}
  </svg>
);

const Final: React.FC<{t: number}> = ({t}) => {
  const ev = at('evolue'), inn = at('innovent'), av = at('avance'), dc = at('dc'), fa = at('face'), ap = at('apparences'), co = at('controles');
  const wipe = prog(t, av - 0.3, 0.55, easeInOut);
  const dcO = prog(t, dc - 0.2, 0.35) * (1 - prog(t, fa - 0.25, 0.3));
  const darkO = prog(t, fa - 0.25, 0.3);
  const yel2 = prog(t, co - 0.3, 0.6, easeInOut);
  const endO = prog(t, END_VO + 0.3, 0.5);
  const fade = prog(t, DURATION_M - 0.8, 0.75);
  const morph = prog(t, ev + 0.2, 0.6, easeInOut);
  const innO = prog(t, inn - 0.15, 0.3);
  const faces = [BOSS, AGENT, COLLEAGUE_A];
  const fi = Math.floor(Math.max(0, t - inn) * 2.2) % 3;
  const race = prog(t, av, 2.6, easeInOut);
  return (
    <AbsoluteFill style={{background: bgNight}}>
      <NeuralNet t={t} w={W} h={H} n={36} o={0.45} color={NET} />
      {/* la technologie évolue (objet qui se transforme) / les fraudeurs innovent (masque qui change de visage) */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 330, height: 560, display: 'grid', placeItems: 'center', opacity: 1 - wipe}}>
        <div style={{position: 'absolute', opacity: (1 - innO), transform: `scale(${sp(t, ev - 0.1)})`}}>
          <div style={{position: 'absolute', left: 0, top: 0, opacity: 1 - morph, transform: `scale(${1 - morph * 0.4}) rotate(${morph * -20}deg)`}}><PhoneIcon size={300} color={V.white} sw={3} /></div>
          <div style={{opacity: morph, transform: `scale(${0.6 + morph * 0.4}) rotate(${(1 - morph) * 20}deg)`}}><ChipIcon size={300} color={V.white} sw={3} p={morph} /></div>
        </div>
        <div style={{position: 'absolute', opacity: innO, transform: `scale(${lerp(0.8, 1, innO)})`}}>
          <div style={{position: 'relative', width: 480, height: 560}}>
            <Hooded t={t} width={480} phone={false} rim={V.nightLight} />
            <div style={{position: 'absolute', left: 120, top: 40}}><HoloMask t={t} who={faces[fi]} w={240} /></div>
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1000, opacity: 1 - wipe}}>
        {t < inn - 0.15 ? (
          <Lines t={t} at={ev} lines={['LA TECHNOLOGIE', 'ÉVOLUE.']} size={94} gap={4} step={0.2} />
        ) : (
          <Lines t={t} at={inn - 0.1} lines={['LES FRAUDEURS', 'INNOVENT.']} size={94} gap={4} step={0.2} />
        )}
      </div>
      {wipe > 0 && <div style={{position: 'absolute', left: W / 2 - 1400 * wipe, top: H / 2 - 1400 * wipe, width: 2800 * wipe, height: 2800 * wipe, borderRadius: '50%', background: V.yellow}} />}
      {/* une longueur d'avance : course vigilance vs fraude */}
      {wipe > 0.5 && dcO <= 0 && darkO <= 0 && (
        <AbsoluteFill>
          <div style={{position: 'absolute', left: 0, right: 0, top: 360}}>
            <Lines t={t} at={av + 0.1} lines={['NOTRE VIGILANCE']} size={90} color={V.anth} mode="slam" />
          </div>
          {[['VIGILANCE', V.anth, V.yellow, 0.92], ['FRAUDE', '#3b3d42', V.white, 0.68]].map(([l, bg, fg, max], i) => (
            <div key={l as string} style={{position: 'absolute', left: 80, top: 640 + i * 170, width: 920, height: 120, borderRadius: 60, background: 'rgba(30,31,34,.12)'}}>
              <div style={{height: 120, borderRadius: 60, width: `${lerp(14, (max as number) * 100, race * (i ? 0.95 : 1))}%`, background: bg as string, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 30}}>
                <span style={{fontFamily: F.display, fontWeight: 900, fontSize: 40, color: fg as string, whiteSpace: 'nowrap'}}>{l as string}</span>
              </div>
            </div>
          ))}
          <div style={{position: 'absolute', left: 0, right: 0, top: 1060}}>
            <Lines t={t} at={at('avance', 'longueur') - 0.1} lines={['UNE LONGUEUR', "D'AVANCE"]} size={116} color={V.anth} mode="slam" gap={4} step={0.2} />
          </div>
        </AbsoluteFill>
      )}
      {/* la Direction Clientèle, première ligne de défense */}
      {dcO > 0 && (
        <AbsoluteFill style={{background: V.yellow, opacity: dcO}}>
          <div style={{position: 'absolute', left: (W - 640) / 2, top: 230, width: 640, height: 640}}>
            <div style={{position: 'absolute', inset: 0}}><Shield t={t} a={dc} size={640} /></div>
            <div style={{position: 'absolute', left: 95, top: 95, width: 450, height: 450, borderRadius: 225, overflow: 'hidden', background: '#fff', transform: `scale(${sp(t, dc - 0.1)})`}}>
              <div style={{position: 'absolute', left: -60, top: 120}}><Person t={t} width={300} {...COLLEAGUE_A} mood="smile" /></div>
              <div style={{position: 'absolute', left: 210, top: 120}}><Person t={t} width={300} {...COLLEAGUE_B} mood="smile" /></div>
              <div style={{position: 'absolute', left: 60, top: 70}}><Person t={t} width={330} {...AGENT} mood="smile" /></div>
            </div>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 940}}>
            <Lines t={t} at={dc} lines={['DIRECTION CLIENTÈLE']} size={72} color={V.anth} weight={800} mode="track" />
            <Lines t={t} at={dc + 0.6} lines={["MTN CÔTE D'IVOIRE"]} size={46} color={V.anth} weight={800} style={{marginTop: 14}} />
            <div style={{display: 'flex', justifyContent: 'center', marginTop: 60}}>
              <div style={{background: V.anth, padding: '26px 40px', transform: `scaleX(${sp(t, at('dc', 'première') - 0.25)})`}}>
                <Lines t={t} at={at('dc', 'première') - 0.15} lines={['LA PREMIÈRE LIGNE', 'DE DÉFENSE']} size={84} color={V.yellow} mode="slam" gap={6} step={0.2} />
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}
      {/* apparences (masque qui se brise) → contrôles */}
      {darkO > 0 && endO < 1 && (
        <AbsoluteFill style={{background: bgNight, opacity: darkO * (1 - endO)}}>
          <NeuralNet t={t} w={W} h={H} n={30} o={0.3} color={NET} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 230}}>
            <Lines t={t} at={fa} lines={['FACE À LA FRAUDE', "AUGMENTÉE PAR L'IA"]} size={64} weight={800} mode="track" gap={10} step={0.25} />
          </div>
          <div style={{position: 'absolute', left: (W - 520) / 2, top: 500}}>
            <div style={{position: 'relative', width: 520, height: 620}}>
              <Hooded t={t} width={520} phone={false} rim={V.nightLight} />
              <div style={{position: 'absolute', left: 130, top: 44}}><HoloMask t={t} who={BOSS} w={260} shatter={prog(t, ap + 0.5, 0.9, (x) => x * x)} /></div>
            </div>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 1240}}>
            <Lines t={t} at={ap} lines={['NE FAISONS PAS CONFIANCE', 'AUX APPARENCES']} size={56} gap={8} step={0.3} />
          </div>
          {yel2 > 0 && (
            <AbsoluteFill style={{background: V.yellow, clipPath: `circle(${yel2 * 1500}px at 540px 820px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{width: 640, background: V.anth, borderRadius: 30, padding: '30px 44px', transform: `scale(${sp(t, co - 0.1, {damping: 13})})`}}>
                {['Identité', 'Légitimité', 'Validation', 'Signalement'].map((l, i) => (
                  <div key={l} style={{display: 'flex', alignItems: 'center', gap: 24, padding: '10px 0', fontFamily: F.ui, fontWeight: 700, fontSize: 40, color: V.white}}>
                    <CheckBadge p={prog(t, co + i * 0.18, 0.4)} size={52} color={V.yellow} ink={V.anth} />
                    {l}
                  </div>
                ))}
              </div>
              <div style={{height: 70}} />
              <Lines t={t} at={co} lines={['FAISONS CONFIANCE']} size={88} color={V.anth} />
              <div style={{background: V.anth, padding: '22px 46px', marginTop: 30, transform: `scaleX(${sp(t, at('controles', 'contrôles') - 0.2)})`}}>
                <Lines t={t} at={at('controles', 'contrôles') - 0.1} lines={['AUX CONTRÔLES.']} size={92} color={V.yellow} mode="slam" />
              </div>
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      )}
      {/* signature institutionnelle */}
      {endO > 0 && (
        <AbsoluteFill style={{background: V.yellow, opacity: endO, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <Img src={staticFile('mtn-logo-black.png')} style={{width: 380, transform: `scale(${lerp(0.9, 1, sp(t, END_VO + 0.3))})`}} />
          <div style={{height: 70}} />
          <Lines t={t} at={END_VO + 0.6} lines={['LA FRAUDE', "À L'ÈRE DE L'IA"]} size={96} color={V.anth} gap={6} step={0.2} />
          <div style={{display: 'flex', flexDirection: 'column', gap: 18, marginTop: 60, alignItems: 'center'}}>
            {['VÉRIFIER', "RÉSISTER À L'URGENCE", 'SIGNALER'].map((w, i) => (
              <div key={w} style={{background: V.anth, color: V.yellow, fontFamily: F.display, fontWeight: 800, fontSize: 44, padding: '14px 40px', borderRadius: 60, transform: `scale(${sp(t, END_VO + 1.0 + i * 0.2)})`}}>{w}</div>
            ))}
          </div>
          <div style={{width: 140, height: 6, background: V.anth, margin: '70px 0 30px', transform: `scaleX(${prog(t, END_VO + 1.7, 0.5)})`}} />
          <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 36, color: V.anth, letterSpacing: 4, opacity: prog(t, END_VO + 1.9, 0.5)}}>DIRECTION CLIENTÈLE</div>
          <div style={{fontFamily: F.display, fontWeight: 600, fontSize: 30, color: V.anth, letterSpacing: 6, marginTop: 10, opacity: prog(t, END_VO + 2.1, 0.5)}}>MTN CÔTE D'IVOIRE</div>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{background: '#000', opacity: fade}} />
    </AbsoluteFill>
  );
};

/* ---------- logo officiel, en haut à droite (masqué pendant la signature finale) ---------- */
const LIGHT: [number, number][] = [
  [at('protege') - 0.2, SC.reflexes[1]],
  [at('avance') - 0.1, at('face') - 0.25],
  [at('controles') - 0.2, DURATION_M + 1],
];
const Logo: React.FC<{t: number}> = ({t}) => {
  const light = Math.max(...LIGHT.map(([a, b]) => prog(t, a, 0.3) * (1 - prog(t, b, 0.25))));
  const o = prog(t, 0.4, 0.5) * (1 - prog(t, END_VO + 0.2, 0.4));
  const st: React.CSSProperties = {position: 'absolute', right: 50, top: 70, width: 190};
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: o}}>
      <Img src={staticFile('mtn-logo-white.png')} style={{...st, opacity: 1 - light}} />
      <Img src={staticFile('mtn-logo-black.png')} style={{...st, opacity: light}} />
    </AbsoluteFill>
  );
};

const LIST: [readonly [number, number], React.FC<{t: number}>][] = [
  [SC.hook, Hook], [SC.arsenal, Arsenal], [SC.scenario, Scenario], [SC.objectif, Objectif], [SC.sens, Sens], [SC.reflexes, Reflexes], [SC.seule, Seule], [SC.final, Final],
];

export const FraudeMobileV2: React.FC = () => {
  const t = useCurrentFrame() / 30;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      {LIST.map(([[a, b], Comp], i) =>
        t >= a && t < b + 0.4 ? (
          <AbsoluteFill key={i} style={{opacity: i ? prog(t, a, 0.3) : 1}}>
            <Comp t={t} />
          </AbsoluteFill>
        ) : null,
      )}
      {/* transitions cinématiques : glitch bleu nuit aux entrées de menace, voile jaune vers la prévention */}
      <Glitch i={Math.max(inOut(t, SC.arsenal[0] - 0.1, SC.arsenal[0] + 0.3, 0.03, 0.2), inOut(t, SC.objectif[0] - 0.1, SC.objectif[0] + 0.3, 0.03, 0.2)) * 0.6} seedT={t} color2={V.nightLight} />
      <AbsoluteFill style={{background: V.yellow, opacity: inOut(t, SC.reflexes[0] - 0.15, SC.reflexes[0] + 0.35, 0.15, 0.3) * 0.9, pointerEvents: 'none'}} />
      <Vignette o={0.35} />
      <Logo t={t} />
    </AbsoluteFill>
  );
};

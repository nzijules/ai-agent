import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Glitch, Kinetic, LightLeak, RGBSplit, Vignette} from '../components/Fx';
import {
  AccountIcon, AlertIcon, CheckBadge, ChatIcon, ClockIcon, EarIcon, EyeIcon, IdIcon, ListIcon, PinIcon, ProfileIcon,
  SimIcon, WarnBadge,
} from '../components/Icons';
import {Office} from '../components/Office';
import {Hooded, Person, PersonProps, SKINS} from '../components/Person';
import {Phone} from '../components/UI';
import {C, F, clamp, drift, easeInOut, inOut, lerp, prog, rnd, sp} from '../lib';
import {FaceScan, NeuralNet, Waveform} from '../ia/AiFx';
import {DURATION_M, END_VO, SC, at, end} from './timing';

const W = 1080, H = 1920;
const CYAN = '#00E5FF';
const BOSS: Partial<PersonProps> = {skin: SKINS[2], hair: 'short', glasses: true, outfit: '#15171c', accent: '#f2f2f2', mood: 'neutral', seed: 4};
const AGENT: Partial<PersonProps> = {skin: SKINS[0], hair: 'fade', outfit: C.yellow, accent: '#111', headset: true, seed: 6};

const bgNight = 'radial-gradient(ellipse at 50% 40%, #0c1630, #03050a 75%)';
const bgRed = 'radial-gradient(ellipse at 50% 45%, #3a0a0e, #0a0204 75%)';

/** Ligne de texte centrée, découpée en lignes successives. */
const Lines: React.FC<{t: number; at: number; lines: string[]; size: number; color?: string; mode?: 'rise' | 'slam' | 'track'; gap?: number; step?: number; weight?: number; style?: React.CSSProperties}> = ({t, at: a, lines, size, color = '#fff', mode = 'rise', gap = 14, step = 0.18, weight = 900, style}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap, ...style}}>
    {lines.map((l, i) => (
      <Kinetic key={i} t={t} at={a + i * step} text={l} size={size} color={color} mode={mode} stagger={0.012} weight={weight} letterSpacing={1} />
    ))}
  </div>
);

/** Écran d'appel entrant (interface simulée). */
const CallScreen: React.FC<{t: number; reveal: number; urgent?: boolean}> = ({t, reveal, urgent = true}) => (
  <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(170deg,#1b2436,#07090f)', fontFamily: F.ui, color: '#fff', textAlign: 'center'}}>
    <div style={{marginTop: 120, fontSize: 30, color: '#9fb0c8'}}>Appel entrant…</div>
    {urgent && <div style={{margin: '18px auto 0', width: 150, background: C.red, borderRadius: 30, fontWeight: 700, fontSize: 24, padding: '6px 0', opacity: 0.6 + 0.4 * Math.abs(Math.sin(t * 5))}}>URGENT</div>}
    <div style={{margin: '50px auto 0', width: 300, height: 300, borderRadius: 150, overflow: 'hidden', background: '#2a3550', position: 'relative', boxShadow: reveal > 0.5 ? `0 0 60px ${C.red}` : '0 0 0 6px rgba(255,255,255,.08)'}}>
      <div style={{position: 'absolute', left: -28, top: 0, opacity: 1 - reveal}}>
        <Person t={t} width={356} {...BOSS} mood="smile" />
      </div>
      <div style={{position: 'absolute', left: -32, top: 10, opacity: reveal}}>
        <Hooded t={t} width={364} phone={false} />
      </div>
    </div>
    <div style={{marginTop: 40, fontSize: 52, fontWeight: 700, fontFamily: F.display}}>{reveal > 0.5 ? '???' : 'Mon responsable'}</div>
    <div style={{marginTop: 8, fontSize: 28, color: '#9fb0c8'}}>Mobile</div>
    <div style={{display: 'flex', justifyContent: 'center', marginTop: 40}}>
      <Waveform t={t} w={360} h={90} color={reveal > 0.5 ? C.red : C.yellow} bars={30} />
    </div>
    <div style={{position: 'absolute', bottom: 90, left: 0, right: 0, display: 'flex', justifyContent: 'space-around'}}>
      <div style={{width: 110, height: 110, borderRadius: 55, background: C.red}} />
      <div style={{width: 110, height: 110, borderRadius: 55, background: C.green, transform: `scale(${1 + 0.08 * Math.sin(t * 8)})`}} />
    </div>
  </div>
);

/* ---------------- 1 — accroche ---------------- */
const Hook: React.FC<{t: number}> = ({t}) => {
  const nep = at('q1', "n'était") - 0.1;
  const reveal = prog(t, nep, 0.25);
  const ring = inOut(t, 0.2, nep, 0.1, 0.1);
  const shake = ring * Math.sin(t * 60) * 6 * (Math.floor(t * 2) % 2);
  const titleO = prog(t, at('ere') - 0.25, 0.35);
  const red = prog(t, at('ere', 'fraude') - 0.1, 0.3);
  return (
    <AbsoluteFill style={{background: bgNight}}>
      {titleO < 1 && (
        <AbsoluteFill style={{opacity: 1 - titleO}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 230}}>
            <Lines t={t} at={0.5} lines={['ET SI CETTE VOIX…']} size={76} />
          </div>
          <div style={{position: 'absolute', left: (W - 520) / 2, top: 400, transform: `translateX(${shake}px) rotate(${shake * 0.15}deg) scale(${lerp(0.9, 1, sp(t, 0.1))})`}}>
            <Phone w={520} glow={0.5}>
              <CallScreen t={t} reveal={reveal} />
            </Phone>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 1530}}>
            <Lines t={t} at={nep} lines={["N'ÉTAIT PAS", 'LA SIENNE ?']} size={92} color={C.red} mode="slam" gap={6} step={0.25} />
          </div>
          <Glitch i={inOut(t, nep, nep + 0.4, 0.03, 0.25)} seedT={t} />
        </AbsoluteFill>
      )}
      {titleO > 0 && (
        <AbsoluteFill style={{opacity: titleO}}>
          <NeuralNet t={t} w={W} h={H} n={40} color={red > 0.5 ? '229,51,42' : '0,229,255'} o={0.6} grow={prog(t, at('ere') - 0.2, 1.5, (x) => x)} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 560}}>
            <Lines t={t} at={at('ere') + 0.1} lines={["AVEC L'INTELLIGENCE", 'ARTIFICIELLE,']} size={56} color={CYAN} mode="track" gap={8} step={0.25} />
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 800}}>
            <RGBSplit amt={Math.max(0, 1 - (t - at('ere', 'fraude')) * 2.5) * 16}>
              <Lines t={t} at={at('ere', 'fraude') - 0.05} lines={['LA FRAUDE']} size={170} mode="slam" />
            </RGBSplit>
            <div style={{display: 'flex', justifyContent: 'center', marginTop: 34}}>
              <div style={{background: C.yellow, padding: '18px 40px', transform: `scaleX(${sp(t, at('ere', 'nouvelle') - 0.2)})`}}>
                <Lines t={t} at={at('ere', 'nouvelle') - 0.1} lines={['ENTRE DANS UNE', 'NOUVELLE ÈRE']} size={80} color={C.black} gap={6} step={0.2} />
              </div>
            </div>
          </div>
          <Glitch i={inOut(t, at('ere', 'fraude') - 0.1, at('ere', 'fraude') + 0.3, 0.03, 0.2)} seedT={t} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* ---------------- 2 — ce que l'IA permet ---------------- */
const ITEMS = [
  {id: 'voix', I: EarIcon, label: 'VOIX CLONÉE', sub: 'en quelques secondes'},
  {id: 'visage', I: EyeIcon, label: 'VISAGE REPRODUIT', sub: 'dans une vidéo'},
  {id: 'piece', I: IdIcon, label: 'PIÈCE FALSIFIÉE', sub: 'un réalisme troublant'},
  {id: 'message', I: ChatIcon, label: 'MESSAGE « PRO »', sub: 'parfaitement rédigé'},
];
const Arsenal: React.FC<{t: number}> = ({t}) => {
  const cues = ITEMS.map((x) => at(x.id) - 0.1);
  const k = Math.max(0, [...cues.keys()].reverse().find((i) => t >= cues[i]) ?? 0);
  const msg = 'Bonjour, Direction régionale. Merci de traiter en priorité le remplacement de SIM du client. Cordialement.';
  const typed = Math.floor(clamp((t - cues[3] - 0.2) / 2.2) * msg.length);
  const idP = prog(t, cues[2] + 0.1, 2.0, (x) => x);
  const panel = (i: number) => {
    if (i === 0)
      return (
        <div style={{display: 'flex', flexDirection: 'column', gap: 50, alignItems: 'center', paddingTop: 140}}>
          <div style={{fontFamily: F.ui, fontWeight: 700, fontSize: 30, color: '#9fb0c8', letterSpacing: 4}}>VOIX ORIGINALE</div>
          <Waveform t={t} w={820} h={200} color={C.yellow} seed={1} bars={40} />
          <div style={{fontFamily: F.ui, fontWeight: 700, fontSize: 30, color: C.red, letterSpacing: 4}}>CLONE IA</div>
          <Waveform t={t + 0.05} w={820} h={200} color={C.red} seed={1.1} bars={40} reveal={prog(t, cues[0] + 0.2, 1.4, (x) => x)} />
        </div>
      );
    if (i === 1)
      return (
        <div style={{position: 'absolute', left: 160, top: 70, width: 620, height: 760}}>
          <Person t={t} width={620} skin={SKINS[3]} hair="braids" outfit="#2C5DAA" accent="#1d3f78" earrings seed={9} />
          <FaceScan t={t} p={prog(t, cues[1] + 0.1, 1.0)} w={620} h={760} />
          {t > cues[1] + 1.0 &&
            [0, 1, 2, 3].map((q) => {
              const r = rnd(Math.floor(t * 12) + q);
              return r > 0.45 ? <div key={q} style={{position: 'absolute', left: (r - 0.5) * 60, top: 180 + r * 320, width: 620, height: 14 + r * 36, background: q % 2 ? 'rgba(229,51,42,.55)' : 'rgba(0,229,255,.55)', mixBlendMode: 'screen'}} /> : null;
            })}
        </div>
      );
    if (i === 2)
      return (
        <div style={{position: 'absolute', left: 90, top: 200, width: 760, height: 480, borderRadius: 30, background: '#f4f1e8', overflow: 'hidden', transform: 'rotate(-4deg)', boxShadow: '0 30px 60px rgba(0,0,0,.5)'}}>
          <div style={{height: 80, background: '#d6c38a'}} />
          <div style={{position: 'absolute', left: 50, top: 130, width: 210, height: 270, borderRadius: 16, background: '#cfcabe'}} />
          {[0, 1, 2, 3].map((q) => <div key={q} style={{position: 'absolute', left: 310, top: 150 + q * 62, width: 380 - q * 60, height: 26, borderRadius: 13, background: '#c9c3b4'}} />)}
          {[...Array(12 * 8)].map((_, q) => (rnd(q * 1.7) < idP ? null : <div key={q} style={{position: 'absolute', left: (q % 12) * 64, top: Math.floor(q / 12) * 60, width: 64, height: 60, background: '#0d1424', borderRight: '1px solid rgba(0,229,255,.25)', borderBottom: '1px solid rgba(0,229,255,.25)'}} />))}
        </div>
      );
    return (
      <div style={{position: 'absolute', left: 60, top: 120, width: 820}}>
        <div style={{background: '#fff', borderRadius: '34px 34px 34px 8px', padding: '36px 40px', fontFamily: F.ui, fontSize: 42, fontWeight: 500, color: C.black, lineHeight: 1.4, minHeight: 330}}>
          {msg.slice(0, typed)}
          <span style={{opacity: Math.floor(t * 3) % 2 ? 1 : 0}}>|</span>
        </div>
        <div style={{marginTop: 40, display: 'inline-block', fontFamily: F.ui, fontWeight: 700, fontSize: 34, color: C.black, background: CYAN, padding: '10px 24px', borderRadius: 40, opacity: prog(t, cues[3] + 2.0, 0.3)}}>✦ 0 faute · ton professionnel</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{background: bgNight}}>
      <NeuralNet t={t} w={W} h={H} n={30} o={0.25} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 220}}>
        <Lines t={t} at={SC.arsenal[0] + 0.2} lines={["CE QUE L'IA PERMET"]} size={58} color={CYAN} mode="track" />
      </div>
      {/* progression */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 320, display: 'flex', justifyContent: 'center', gap: 40}}>
        {ITEMS.map(({I}, i) => {
          const on = t >= cues[i];
          return (
            <div key={i} style={{width: 130, height: 130, borderRadius: 65, border: `4px solid ${i === k && on ? CYAN : on ? 'rgba(0,229,255,.4)' : 'rgba(255,255,255,.12)'}`, display: 'grid', placeItems: 'center', background: i === k && on ? 'rgba(0,229,255,.12)' : 'transparent', transform: `scale(${i === k && on ? 1.1 : 1})`}}>
              <I size={78} color={on ? CYAN : '#3a4560'} p={on ? 1 : 0.999} sw={5} />
            </div>
          );
        })}
      </div>
      {/* panneau central */}
      {ITEMS.map((_, i) => {
        const pin = sp(t, cues[i], {damping: 18});
        const pout = i < 3 ? prog(t, cues[i + 1], 0.35, easeInOut) : 0;
        if (t < cues[i] - 0.05 || pout >= 1) return null;
        return (
          <div key={i} style={{position: 'absolute', left: 70, top: 520, width: 940, height: 900, borderRadius: 40, background: '#0d1424', border: `3px solid ${CYAN}`, boxShadow: '0 0 80px rgba(0,229,255,.2)', overflow: 'hidden', transform: `translateX(${(1 - pin) * 900 - pout * 1100}px)`}}>
            {panel(i)}
          </div>
        );
      })}
      {ITEMS.map((it, i) => {
        const o = inOut(t, cues[i] + 0.1, i < 3 ? cues[i + 1] : SC.arsenal[1] + 0.3, 0.3, 0.2);
        return o > 0 ? (
          <div key={i} style={{position: 'absolute', left: 0, right: 0, top: 1470, opacity: o, textAlign: 'center'}}>
            <div style={{fontFamily: F.display, fontWeight: 900, fontSize: 84, color: '#fff'}}>{it.label}</div>
            <div style={{fontFamily: F.ui, fontWeight: 500, fontSize: 40, color: CYAN, marginTop: 8}}>{it.sub}</div>
          </div>
        ) : null;
      })}
    </AbsoluteFill>
  );
};

/* ---------------- 3 — le scénario ---------------- */
const Scenario: React.FC<{t: number}> = ({t}) => {
  const im = at('imaginez');
  const splitO = prog(t, at('appel') - 0.3, 0.4);
  const der = at('derriere'), fr = at('derriere', 'fraudeur');
  const reveal = prog(t, der + 0.6, 0.3);
  const checks: [number, string][] = [[at('normal', 'voix') - 0.1, 'Voix reconnaissable'], [at('ton') - 0.1, 'Ton convaincant'], [at('urgence') - 0.1, 'Urgence réelle']];
  const dr = drift(t, 4, 3);
  return (
    <AbsoluteFill style={{background: '#03050a'}}>
      <AbsoluteFill style={{display: 'grid', placeItems: 'center', opacity: 1 - splitO}}>
        <Lines t={t} at={im - 0.05} lines={['IMAGINEZ…']} size={140} mode="track" />
      </AbsoluteFill>
      {splitO > 0 && (
        <AbsoluteFill style={{opacity: splitO}}>
          {/* haut : l'appelant */}
          <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 960, overflow: 'hidden', background: reveal > 0.5 ? bgRed : bgNight}}>
            <NeuralNet t={t} w={W} h={960} n={20} o={0.25} color={reveal > 0.5 ? '229,51,42' : '0,229,255'} />
            <div style={{position: 'absolute', left: 60, top: 190, display: 'flex', alignItems: 'center', gap: 20}}>
              <div style={{background: C.red, color: '#fff', fontFamily: F.ui, fontWeight: 700, fontSize: 28, padding: '8px 22px', borderRadius: 30, opacity: 0.6 + 0.4 * Math.abs(Math.sin(t * 5))}}>APPEL URGENT</div>
              <div style={{fontFamily: F.ui, fontWeight: 700, fontSize: 28, color: '#9fb0c8'}}>Au bout du fil…</div>
            </div>
            <div style={{position: 'absolute', left: 60, top: 290, width: 360, height: 360, borderRadius: 180, overflow: 'hidden', background: '#2a3550', boxShadow: reveal > 0.5 ? `0 0 60px ${C.red}` : `0 0 0 6px ${CYAN}`, transform: `translate(${dr.x}px,${dr.y}px)`}}>
              <div style={{position: 'absolute', left: -40, top: 0, opacity: 1 - reveal}}><Person t={t} width={440} {...BOSS} talking={t > at('fil') && t < end('fil') ? 0.8 : 0} /></div>
              <div style={{position: 'absolute', left: -40, top: 10, opacity: reveal}}><Hooded t={t} width={440} phone={false} /></div>
            </div>
            <div style={{position: 'absolute', left: 460, top: 330, fontFamily: F.display, fontWeight: 800, fontSize: 46, color: '#fff'}}>{reveal > 0.5 ? 'UN FRAUDEUR ?' : 'Mon responsable'}</div>
            <div style={{position: 'absolute', left: 460, top: 410}}>
              <Waveform t={t} w={520} h={120} color={reveal > 0.5 ? C.red : C.yellow} bars={32} />
            </div>
            {/* bulle */}
            <div style={{position: 'absolute', left: 460, top: 560, width: 560, background: '#fff', borderRadius: '28px 28px 28px 6px', padding: '22px 28px', fontFamily: F.ui, fontWeight: 700, fontSize: 34, color: C.black, transform: `scale(${sp(t, at('fil', 'demande') - 0.1)})`, transformOrigin: '0 0'}}>
              « Une opération exceptionnelle, tout de suite ! »
            </div>
            {/* cases cochées */}
            <div style={{position: 'absolute', left: 60, top: 720, display: 'flex', gap: 16, flexWrap: 'wrap', width: 960}}>
              {checks.map(([a, l], i) => {
                const p = sp(t, a);
                const bad = reveal > 0.5;
                return (
                  <div key={i} style={{display: 'flex', alignItems: 'center', gap: 12, background: bad ? '#2a0607' : '#e9f8ef', border: `3px solid ${bad ? C.red : C.green}`, borderRadius: 40, padding: '10px 22px', fontFamily: F.ui, fontWeight: 700, fontSize: 30, color: bad ? '#fff' : '#0f5132', transform: `scale(${p})`, opacity: clamp(p * 2)}}>
                    <span style={{color: bad ? C.red : C.green}}>{bad ? '?' : '✓'}</span> {l}
                  </div>
                );
              })}
            </div>
            <Glitch i={inOut(t, der + 0.5, der + 0.95, 0.03, 0.2)} seedT={t} />
          </div>
          {/* bas : le conseiller */}
          <div style={{position: 'absolute', left: 0, top: 960, width: W, height: 960, overflow: 'hidden'}}>
            <div style={{position: 'absolute', left: -420, top: -60, width: 1920, height: 1080}}>
              <Office t={t} mood={reveal > 0.5 ? 'dim' : 'day'} />
            </div>
            <div style={{position: 'absolute', left: 150, top: 120}}>
              <Person t={t} width={780} {...AGENT} mood={reveal > 0.5 ? 'worried' : t > at('normal') ? 'neutral' : 'focused'} look={-0.3} lookY={-0.6} />
            </div>
            <div style={{position: 'absolute', left: 60, top: 50, background: C.black, color: C.yellow, fontFamily: F.display, fontWeight: 800, fontSize: 30, letterSpacing: 4, padding: '10px 22px'}}>LE CONSEILLER</div>
            {t > at('normal') - 0.2 && reveal < 1 && (
              <div style={{position: 'absolute', left: 0, right: 0, bottom: 300, opacity: 1 - reveal}}>
                <Lines t={t} at={at('normal')} lines={['TOUT SEMBLE NORMAL']} size={70} color="#fff" style={{filter: 'drop-shadow(0 4px 20px rgba(0,0,0,.8))'}} />
              </div>
            )}
          </div>
          <div style={{position: 'absolute', left: 0, top: 955, width: W, height: 10, background: C.yellow, boxShadow: '0 0 30px rgba(255,203,5,.7)'}} />
          {t > fr - 0.15 && (
            <div style={{position: 'absolute', left: 0, right: 0, top: 1480}}>
              <RGBSplit amt={Math.max(0, 1 - (t - fr) * 3) * 14}>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                  <div style={{background: C.red, padding: '20px 44px', transform: `rotate(-2deg) scale(${sp(t, fr - 0.1, {damping: 10, stiffness: 260})})`}}>
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

/* ---------------- 4 — son objectif ---------------- */
const Objectif: React.FC<{t: number}> = ({t}) => {
  const cards = [
    {cue: at('sim') - 0.1, I: SimIcon, l: ['Remplacement', 'de carte SIM']},
    {cue: at('pin') - 0.1, I: PinIcon, l: ['Réinitialisation', 'PIN Mobile Money']},
    {cue: at('modif') - 0.1, I: ProfileIcon, l: ['Modification des', 'données client']},
  ];
  return (
    <AbsoluteFill style={{background: bgRed}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 260}}>
        <Lines t={t} at={at('objectif') - 0.05} lines={['SON OBJECTIF ?']} size={110} mode="slam" />
      </div>
      {cards.map(({cue, I, l}, i) => {
        const p = sp(t, cue);
        const ret = prog(t, cue + 0.3, 0.5);
        return (
          <div key={i} style={{position: 'absolute', left: 70, top: 470 + i * 380, width: 940, height: 330, borderRadius: 36, background: '#fff', border: `6px solid ${C.red}`, display: 'flex', alignItems: 'center', gap: 40, padding: '0 50px', opacity: clamp(p * 2), transform: `translateX(${(1 - p) * (i % 2 ? -900 : 900)}px)`, boxShadow: '0 30px 70px rgba(0,0,0,.5)'}}>
            <div style={{position: 'relative', width: 230, height: 230, borderRadius: 115, background: '#ffe5e3', display: 'grid', placeItems: 'center', flexShrink: 0}}>
              <I size={150} color={C.red} p={prog(t, cue, 0.8)} sw={5} />
              <svg width={300} height={300} viewBox="-150 -150 300 300" style={{position: 'absolute', left: -35, top: -35, opacity: ret, transform: `rotate(${t * 40}deg) scale(${lerp(1.6, 1, ret)})`}}>
                <circle r={130} fill="none" stroke={C.red} strokeWidth={6} strokeDasharray="30 18" />
                <path d="M0 -150 V-110 M0 150 V110 M-150 0 H-110 M150 0 H110" stroke={C.red} strokeWidth={7} />
              </svg>
            </div>
            <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 52, color: C.black, lineHeight: 1.15}}>
              {l.map((x) => <div key={x}>{x}</div>)}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------------- 5 — voir / entendre ne suffit plus ---------------- */
const Sens: React.FC<{t: number}> = ({t}) => {
  const pr = at('protege');
  const yellow = prog(t, pr - 0.15, 0.25);
  const noise = prog(t, at('voir', 'voir') + 0.4, 2.5) * (1 - yellow);
  const rows: [number, React.FC<{size?: number; color?: string; p?: number}>, string][] = [[at('voir', 'voir') - 0.1, EyeIcon, 'VOIR'], [at('entendre') - 0.1, EarIcon, 'ENTENDRE']];
  return (
    <AbsoluteFill style={{background: '#06080e'}}>
      <AbsoluteFill style={{opacity: 1 - yellow}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 240}}>
          <Lines t={t} at={at('voir') + 0.1} lines={["AVEC L'IA…"]} size={60} color={CYAN} mode="track" />
        </div>
        {rows.map(([a, I, w], i) => {
          const p = sp(t, a);
          const strike = prog(t, a + 0.7, 0.3);
          return (
            <div key={i} style={{position: 'absolute', left: 0, right: 0, top: 420 + i * 560, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: clamp(p * 2), transform: `translateX(${noise * 8 * Math.sin(t * 70 + i)}px)`}}>
              <RGBSplit amt={noise * 18}>
                <I size={240} color="#fff" p={prog(t, a, 0.7)} />
              </RGBSplit>
              <div style={{position: 'relative', marginTop: 10}}>
                <div style={{fontFamily: F.display, fontWeight: 900, fontSize: 120, color: '#fff'}}>{w}</div>
                <div style={{position: 'absolute', left: -20, right: -20, top: '52%', height: 16, background: C.red, transform: `scaleX(${strike}) rotate(-3deg)`, transformOrigin: '0 50%'}} />
              </div>
              <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 56, color: C.red, opacity: strike}}>NE SUFFIT PLUS</div>
            </div>
          );
        })}
        <Glitch i={noise * 0.45} seedT={t} />
      </AbsoluteFill>
      {yellow > 0 && (
        <AbsoluteFill style={{background: C.yellow, opacity: yellow}}>
          <div style={{position: 'absolute', left: (W - 380) / 2, top: 380, width: 380, height: 380, transform: `scale(${sp(t, pr, {damping: 10, stiffness: 200})})`}}>
            <svg viewBox="0 0 100 100" width={380} height={380}><path d="M50 6 L88 20 V48 C88 72 72 88 50 96 C28 88 12 72 12 48 V20 Z" fill={C.black} /></svg>
            <div style={{position: 'absolute', left: 95, top: 88}}><ListIcon size={190} color={C.yellow} p={prog(t, pr + 0.2, 0.7)} sw={6} /></div>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 880}}>
            <Lines t={t} at={pr + 0.1} lines={['CE QUI NOUS PROTÈGE']} size={66} color={C.black} weight={800} />
            <Lines t={t} at={at('protege', 'rigueur') - 0.1} lines={['LA RIGUEUR', 'DE NOS', 'CONTRÔLES']} size={128} color={C.black} mode="slam" gap={4} step={0.2} style={{marginTop: 40}} />
          </div>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{background: '#fff', opacity: inOut(t, pr - 0.15, pr + 0.3, 0.05, 0.25) * 0.8}} />
    </AbsoluteFill>
  );
};

/* ---------------- 6 — les bons réflexes ---------------- */
const RX = [
  {id: 'r1', I: IdIcon, title: 'IDENTITÉ VÉRIFIÉE', sub: 'Selon les procédures officielles'},
  {id: 'r2', I: ClockIcon, title: 'NE PAS CÉDER', sub: ''},
  {id: 'r3', I: ListIcon, title: 'TOUTES LES VALIDATIONS', sub: 'Sans exception'},
  {id: 'r4', I: AlertIcon, title: 'UN DOUTE ? SIGNALEZ', sub: 'Suspendre & alerter par les canaux prévus'},
];
const Reflexes: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 30%, #fffdf4, ${C.paper})`}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 240}}>
      <Lines t={t} at={SC.reflexes[0] + 0.2} lines={['LES BONS RÉFLEXES']} size={78} color={C.black} mode="track" />
    </div>
    {RX.map((r, i) => {
      const cue = at(r.id) - 0.1;
      const p = sp(t, cue, {damping: 16});
      const next = RX[i + 1] ? at(RX[i + 1].id) : 1e9;
      const active = t >= cue && t < next;
      const warn = i === 3;
      const badge = prog(t, cue + 0.7, 0.6);
      return (
        <div key={i} style={{position: 'absolute', left: 50, top: 380 + i * 320, width: 980, height: 280, borderRadius: 34, background: '#fff', border: `5px solid ${active ? (warn ? C.red : C.yellow) : '#ebe7dc'}`, boxShadow: active ? '0 30px 70px rgba(0,0,0,.15)' : '0 10px 24px rgba(0,0,0,.05)', display: 'flex', alignItems: 'center', gap: 34, padding: '0 34px', opacity: clamp(p * 2), transform: `translateY(${(1 - p) * 200}px) scale(${active ? 1.02 : 1})`}}>
          <div style={{width: 190, height: 190, borderRadius: 95, background: warn ? '#ffe9e7' : '#FFF3C4', display: 'grid', placeItems: 'center', flexShrink: 0}}>
            <r.I size={120} p={prog(t, cue + 0.1, 0.8)} color={warn ? C.red : C.black} sw={5} />
          </div>
          <div style={{flex: 1}}>
            <div style={{fontFamily: F.display, fontWeight: 900, fontSize: 48, color: C.black, lineHeight: 1.1}}>{r.title}</div>
            {r.sub && <div style={{fontFamily: F.ui, fontWeight: 500, fontSize: 32, color: '#6b6f76', marginTop: 10}}>{r.sub}</div>}
            {i === 1 && (
              <div style={{display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap'}}>
                {[['URGENCE', 'urgence'], ['PRESSION', 'pression'], ['AUTORITÉ', 'autorité']].map(([l, w]) => {
                  const a = at('r2', w) - 0.1;
                  return (
                    <div key={l} style={{position: 'relative', background: C.black, color: C.yellow, fontFamily: F.display, fontWeight: 800, fontSize: 28, padding: '8px 18px', borderRadius: 30, transform: `scale(${sp(t, a)})`}}>
                      {l}
                      <div style={{position: 'absolute', left: 10, right: 10, top: '50%', height: 5, background: C.red, transform: `scaleX(${prog(t, a + 0.3, 0.25)})`, transformOrigin: '0 50%'}} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div style={{flexShrink: 0}}>{warn ? <WarnBadge p={badge} t={t} size={86} /> : <CheckBadge p={badge} size={86} />}</div>
        </div>
      );
    })}
  </AbsoluteFill>
);

/* ---------------- 7 — une seule vérification négligée ---------------- */
const Seule: React.FC<{t: number}> = ({t}) => {
  const a = at('seule');
  const crack = prog(t, at('seule', 'compromettre') - 0.1, 0.5);
  const line = prog(t, at('seule', 'peut') - 0.2, 0.8);
  return (
    <AbsoluteFill style={{background: bgRed}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 230}}>
        <Lines t={t} at={a} lines={['UNE SEULE', 'VÉRIFICATION', 'NÉGLIGÉE']} size={90} mode="rise" gap={4} step={0.2} />
      </div>
      <div style={{position: 'absolute', left: 190, top: 640, width: 700, background: '#fff', borderRadius: 30, padding: '30px 40px', boxShadow: '0 30px 70px rgba(0,0,0,.5)', transform: `scale(${sp(t, a + 0.3)})`}}>
        {['Identité', 'Légitimité', 'Validation', 'Signalement'].map((l, i) => {
          const miss = i === 2;
          return (
            <div key={l} style={{display: 'flex', alignItems: 'center', gap: 22, padding: '12px 0', fontFamily: F.ui, fontWeight: 700, fontSize: 40, color: miss ? C.red : C.black}}>
              <div style={{width: 48, height: 48, borderRadius: 12, border: `4px solid ${miss ? C.red : C.green}`, background: miss ? (Math.floor(t * 4) % 2 ? '#ffe5e3' : '#fff') : C.green, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 32}}>{miss ? '' : '✓'}</div>
              {l}
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: W / 2 - 4, top: 1060, width: 8, height: 170 * line, background: C.red, boxShadow: '0 0 20px #E5332A'}} />
      <div style={{position: 'absolute', left: (W - 300) / 2, top: 1220, width: 300, height: 300, borderRadius: 150, background: crack > 0.5 ? '#2a0607' : '#fff', border: `8px solid ${C.red}`, display: 'grid', placeItems: 'center', transform: `scale(${sp(t, at('seule', 'peut'))}) translateX(${inOut(t, at('seule', 'compromettre'), at('seule', 'compromettre') + 0.4, 0.02, 0.3) * 12 * Math.sin(t * 80)}px)`}}>
        <AccountIcon size={180} color={C.red} sw={6} />
        <svg viewBox="0 0 300 300" width={300} height={300} style={{position: 'absolute', inset: 0}}>
          <path d="M150 0 L130 90 L175 150 L120 220 L150 300 M130 90 L60 120 M175 150 L260 170 M120 220 L40 250" stroke="#fff" strokeWidth={6} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - crack} />
        </svg>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1580}}>
        <Lines t={t} at={at('seule', 'compte') - 0.1} lines={['COMPTE CLIENT', 'COMPROMIS']} size={84} color="#fff" mode="slam" gap={4} step={0.2} />
      </div>
      <Glitch i={inOut(t, at('seule', 'compromettre') - 0.05, at('seule', 'compromettre') + 0.35, 0.03, 0.2) * 0.7} seedT={t} />
    </AbsoluteFill>
  );
};

/* ---------------- 8 — clôture ---------------- */
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

const Final: React.FC<{t: number}> = ({t}) => {
  const av = at('avance'), dc = at('dc'), fa = at('face'), ap = at('apparences'), co = at('controles');
  const wipe = prog(t, av - 0.25, 0.45, easeInOut);
  const dcO = prog(t, dc - 0.2, 0.35) * (1 - prog(t, fa - 0.25, 0.3));
  const darkO = prog(t, fa - 0.25, 0.3);
  const yel2 = prog(t, co - 0.15, 0.3);
  const endO = prog(t, END_VO + 0.3, 0.5);
  const fade = prog(t, DURATION_M - 0.8, 0.75);
  return (
    <AbsoluteFill style={{background: bgNight}}>
      <NeuralNet t={t} w={W} h={H} n={36} o={0.5} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 640, opacity: 1 - wipe}}>
        <Lines t={t} at={at('evolue')} lines={['LA TECHNOLOGIE', 'ÉVOLUE.']} size={94} gap={4} step={0.2} />
        <Lines t={t} at={at('innovent')} lines={['LES FRAUDEURS', 'INNOVENT.']} size={100} color={C.red} gap={4} step={0.2} style={{marginTop: 70}} />
      </div>
      {wipe > 0 && <div style={{position: 'absolute', left: W / 2 - 1400 * wipe, top: H / 2 - 1400 * wipe, width: 2800 * wipe, height: 2800 * wipe, borderRadius: '50%', background: C.yellow}} />}
      {wipe > 0.5 && dcO <= 0 && darkO <= 0 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 640}}>
          <Lines t={t} at={av + 0.1} lines={['NOTRE VIGILANCE']} size={90} color={C.black} mode="slam" />
          <Lines t={t} at={at('avance', 'longueur') - 0.1} lines={['UNE LONGUEUR', "D'AVANCE"]} size={120} color={C.black} mode="slam" gap={4} step={0.2} style={{marginTop: 40}} />
        </div>
      )}
      {dcO > 0 && (
        <AbsoluteFill style={{background: C.yellow, opacity: dcO}}>
          <div style={{position: 'absolute', left: (W - 460) / 2, top: 300}}>
            <Shield t={t} a={dc} size={460} />
            <div style={{position: 'absolute', left: 140, top: 140, width: 180, height: 180, borderRadius: 90, background: '#fff', display: 'grid', placeItems: 'center', transform: `scale(${sp(t, dc - 0.1)})`}}>
              <AccountIcon size={120} color={C.black} sw={7} />
            </div>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 880}}>
            <Lines t={t} at={dc} lines={['DIRECTION CLIENTÈLE']} size={72} color={C.black} weight={800} mode="track" />
            <Lines t={t} at={dc + 0.6} lines={["MTN CÔTE D'IVOIRE"]} size={46} color={C.black} weight={800} style={{marginTop: 14}} />
            <div style={{display: 'flex', justifyContent: 'center', marginTop: 60}}>
              <div style={{background: C.black, padding: '26px 40px', transform: `scaleX(${sp(t, at('dc', 'première') - 0.25)})`}}>
                <Lines t={t} at={at('dc', 'première') - 0.15} lines={['LA PREMIÈRE LIGNE', 'DE DÉFENSE']} size={84} color={C.yellow} mode="slam" gap={6} step={0.2} />
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}
      {darkO > 0 && endO < 1 && (
        <AbsoluteFill style={{background: '#06080e', opacity: darkO * (1 - endO)}}>
          <NeuralNet t={t} w={W} h={H} n={36} o={0.35} color="229,51,42" />
          <div style={{position: 'absolute', left: 0, right: 0, top: 300, opacity: 1 - yel2}}>
            <Lines t={t} at={fa} lines={['FACE À LA FRAUDE', "AUGMENTÉE PAR L'IA"]} size={70} color={CYAN} mode="track" gap={10} step={0.25} />
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 720, opacity: 1 - yel2}}>
            <Lines t={t} at={ap} lines={['NE FAISONS PAS', 'CONFIANCE']} size={96} color="#fff" gap={4} step={0.15} />
            <div style={{position: 'relative', margin: '30px auto 0', width: 'fit-content'}}>
              <RGBSplit amt={(1 - prog(t, ap + 0.6, 0.4)) * 10 + 4}>
                <Kinetic t={t} at={ap + 0.35} text="AUX APPARENCES" size={86} color={C.red} mode="slam" stagger={0.02} />
              </RGBSplit>
            </div>
          </div>
          {yel2 > 0 && (
            <AbsoluteFill style={{background: C.yellow, opacity: yel2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{transform: `scale(${sp(t, co, {damping: 10, stiffness: 220})})`}}><CheckBadge p={prog(t, co, 0.6)} size={220} color={C.black} /></div>
              <div style={{height: 60}} />
              <Lines t={t} at={co} lines={['FAISONS CONFIANCE']} size={88} color={C.black} />
              <div style={{background: C.black, padding: '22px 46px', marginTop: 30, transform: `scaleX(${sp(t, at('controles', 'contrôles') - 0.2)})`}}>
                <Lines t={t} at={at('controles', 'contrôles') - 0.1} lines={['AUX CONTRÔLES.']} size={92} color={C.yellow} mode="slam" />
              </div>
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      )}
      {endO > 0 && (
        <AbsoluteFill style={{background: C.yellow, opacity: endO, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <Lines t={t} at={END_VO + 0.4} lines={['LA FRAUDE', "À L'ÈRE DE L'IA"]} size={110} color={C.black} gap={6} step={0.2} />
          <div style={{display: 'flex', flexDirection: 'column', gap: 22, marginTop: 70, alignItems: 'center'}}>
            {['VÉRIFIER', "RÉSISTER À L'URGENCE", 'SIGNALER'].map((w, i) => (
              <div key={w} style={{background: C.black, color: C.yellow, fontFamily: F.display, fontWeight: 800, fontSize: 48, padding: '16px 44px', borderRadius: 60, transform: `scale(${sp(t, END_VO + 0.9 + i * 0.2)})`}}>{w}</div>
            ))}
          </div>
          <div style={{width: 140, height: 6, background: C.black, margin: '80px 0 34px', transform: `scaleX(${prog(t, END_VO + 1.6, 0.5)})`}} />
          <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 38, color: C.black, letterSpacing: 4, opacity: prog(t, END_VO + 1.8, 0.5)}}>MTN CÔTE D'IVOIRE</div>
          <div style={{fontFamily: F.display, fontWeight: 600, fontSize: 32, color: C.black, letterSpacing: 6, marginTop: 10, opacity: prog(t, END_VO + 2.0, 0.5)}}>DIRECTION CLIENTÈLE</div>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{background: '#000', opacity: fade}} />
    </AbsoluteFill>
  );
};

/* ---------------- logo permanent en haut à droite ---------------- */
const LIGHT: [number, number][] = [
  [at('protege') - 0.15, SC.reflexes[1]],
  [at('avance') - 0.05, at('face') - 0.25],
  [at('controles') - 0.15, DURATION_M + 1],
];
const Logo: React.FC<{t: number}> = ({t}) => {
  const light = Math.max(...LIGHT.map(([a, b]) => prog(t, a, 0.25) * (1 - prog(t, b, 0.25))));
  const o = prog(t, 0.4, 0.5) * (1 - prog(t, DURATION_M - 0.8, 0.75));
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

export const FraudeMobile: React.FC = () => {
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
      <LightLeak t={t} at={SC.reflexes[0] - 0.3} dur={1.4} />
      <Glitch i={Math.max(inOut(t, SC.arsenal[0] - 0.1, SC.arsenal[0] + 0.3, 0.03, 0.2), inOut(t, SC.objectif[0] - 0.1, SC.objectif[0] + 0.3, 0.03, 0.2), inOut(t, SC.seule[0] - 0.1, SC.seule[0] + 0.3, 0.03, 0.2)) * 0.7} seedT={t} />
      <Vignette o={0.4} />
      <Logo t={t} />
    </AbsoluteFill>
  );
};

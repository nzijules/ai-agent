import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Architect, Awa, Bubble, Pill, SceneFrame} from './ui';
import {body, C, display, FPS, pop, t01} from './theme';

const W = 960;
const H = 800;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/* 1 ─ Accroche : les briques */
export const S1Hook: React.FC = () => {
  const f = useCurrentFrame();
  const bricks: [number, number][] = [];
  const rows = [5, 4, 3, 2];
  rows.forEach((n, r) => {
    for (let i = 0; i < n; i++) bricks.push([480 - (n * 150) / 2 + i * 150, 690 - r * 78]);
  });
  const drop = t01(f, 4.4, 0.9, (x) => 1 - Math.pow(1 - x, 3));
  const bounce = Math.sin(t01(f, 5.3, 0.4) * Math.PI) * 20;
  return (
    <SceneFrame
      dark
      eyebrow="Pour avoir une maison…"
      line1="tu ne poses pas"
      line2="les briques."
      footer="Alors pourquoi coder pour créer ?"
      vo="Pour avoir une maison, tu ne poses pas les briques toi-même. Alors pourquoi croire qu'il faut savoir coder pour créer ?"
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
        {bricks.map(([x, y], i) => {
          const p = pop(f, 0.3 + i * 0.12, 0.45);
          return (
            <rect key={i} x={x + 4} y={y - (1 - p) * 80} width={142} height={70} rx={8} fill={i % 3 === 0 ? '#2D4A9E' : '#24397A'} stroke="#3A5BC0" strokeWidth={3} opacity={p} />
          );
        })}
        <g style={{translate: `${interpolate(drop, [0, 1], [0, 160])}px ${interpolate(drop, [0, 1], [-120, 520]) - bounce}px`, rotate: `${interpolate(drop, [0, 1], [-30, 8])}deg`}} transform-origin="580 40">
          <rect x={500} y={0} width={170} height={80} rx={10} fill={C.blue} />
          <text x={585} y={56} fill={C.white} fontFamily="monospace" fontWeight={700} fontSize={44} textAnchor="middle">&lt;/&gt;</text>
        </g>
        <text x={480} y={200} fill={C.yellow} fontFamily={display} fontWeight={800} fontSize={120} textAnchor="middle" opacity={t01(f, 5.7, 0.3)} style={{scale: String(0.6 + 0.4 * pop(f, 5.7))}} transform-origin="480 170">?</text>
      </svg>
    </SceneFrame>
  );
};

/* 2 ─ Awa et son rêve */
export const S2Awa: React.FC = () => {
  const f = useCurrentFrame();
  const enter = t01(f, 0.2, 0.8);
  const blink = f % 90 > 84;
  const b1 = pop(f, 2.2), b2 = pop(f, 2.4), cloud = pop(f, 2.6, 0.6);
  const house = t01(f, 3.0, 0.8);
  return (
    <SceneFrame
      eyebrow="Voici Awa"
      line1="Elle a un terrain."
      line2="Et un rêve."
      footer="L'envie vient d'elle."
      vo="Voici Awa. Elle a un terrain, et une idée très claire : trois chambres, une grande terrasse, et beaucoup de lumière."
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
        <rect x={0} y={740} width={W} height={10} rx={5} fill={C.navy} />
        <rect x={40} y={750} width={880} height={30} fill="#CFE0FF" />
        <g transform="translate(250 470)" style={{translate: `${(1 - enter) * -400}px 0px`}}>
          <Awa blink={blink} />
        </g>
        <circle cx={420} cy={300} r={18 * b1} fill={C.white} stroke={C.sky} strokeWidth={4} />
        <circle cx={470} cy={240} r={28 * b2} fill={C.white} stroke={C.sky} strokeWidth={4} />
        <g style={{scale: String(cloud)}} transform-origin="700 170">
          <rect x={480} y={20} width={440} height={300} rx={80} fill={C.white} stroke={C.sky} strokeWidth={5} />
          <g opacity={house} style={{translate: `0px ${(1 - house) * 30}px`}}>
            <path d="M590 170 L700 90 L810 170 V270 H590 Z" fill={C.blue} />
            <path d="M570 172 L700 78 L830 172" stroke={C.navy} strokeWidth={14} fill="none" strokeLinecap="round" />
            <rect x={680} y={200} width={42} height={70} fill={C.yellow} />
            <rect x={610} y={190} width={44} height={36} fill="#BFD4FF" />
            <rect x={746} y={190} width={44} height={36} fill="#BFD4FF" />
            <rect x={810} y={248} width={90} height={14} fill={C.navy} />
            <circle cx={870} cy={80} r={26} fill={C.yellow} />
          </g>
        </g>
      </svg>
      <div style={{position: 'absolute', left: 470, top: 400, display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'flex-start'}}>
        <Pill p={pop(f, 4.1)}>3 chambres</Pill>
        <Pill p={pop(f, 5.1)} bg={C.navy}>Grande terrasse</Pill>
        <Pill p={pop(f, 6.3)} bg={C.yellow} color={C.navy}>Beaucoup de lumière</Pill>
      </div>
    </SceneFrame>
  );
};

/* 3 ─ Pas son métier */
export const S3NotJob: React.FC = () => {
  const f = useCurrentFrame();
  const appear = t01(f, 0.2, 0.7);
  const draw = t01(f, 0.6, 3.3);
  const stamp = pop(f, 5.0, 0.4);
  return (
    <SceneFrame
      eyebrow="Plans, béton, électricité ?"
      line1="Ce n'est pas"
      line2="son métier."
      footer="Et ce n'est pas un problème."
      vo="Mais calculer une fondation, tirer l'électricité, dessiner les plans… ce n'est pas son métier. Et ce n'est pas un problème."
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
        <g opacity={appear} style={{rotate: `${-5 + (1 - appear) * -8}deg`, scale: String(0.9 + 0.1 * appear)}} transform-origin="460 380">
          <rect x={110} y={90} width={700} height={560} rx={16} fill="#1F4FBF" />
          {[...Array(8)].map((_, i) => (
            <path key={'h' + i} d={`M110 ${150 + i * 64}H810`} stroke={C.sky} strokeWidth={2} opacity={0.35} />
          ))}
          {[...Array(10)].map((_, i) => (
            <path key={'v' + i} d={`M${170 + i * 64} 90V650`} stroke={C.sky} strokeWidth={2} opacity={0.35} />
          ))}
          <path
            d="M180 160 H560 V380 H400 V580 H180 Z M400 380 V580 M560 260 H740 V580 H560 M640 260 V420 M180 380 H400"
            stroke={C.white}
            strokeWidth={8}
            fill="none"
            strokeDasharray={4200}
            strokeDashoffset={4200 * (1 - draw)}
          />
          <text x={190} y={630} fill={C.white} fontSize={30} fontFamily="monospace" opacity={draw}>Ø12 · e=20 cm · 230 V · 3,40 m</text>
          <text x={580} y={230} fill={C.yellow} fontSize={30} fontFamily="monospace" opacity={draw}>IPN 140 ?</text>
        </g>
        <g style={{scale: String(1.6 - 0.6 * stamp)}} transform-origin="760 600" opacity={Math.min(1, stamp * 3)}>
          <circle cx={760} cy={600} r={110} fill={C.red} />
          <path d="M710 550 L810 650 M810 550 L710 650" stroke={C.white} strokeWidth={26} strokeLinecap="round" />
        </g>
      </svg>
    </SceneFrame>
  );
};

/* 4 ─ L'architecte */
export const S4Architect: React.FC = () => {
  const f = useCurrentFrame();
  const quote = '« Trois chambres, une grande terrasse, beaucoup de lumière. »';
  const typed = Math.round(interpolate(f, [4.2 * FPS, 5.5 * FPS], [0, quote.length], clamp));
  const arch = t01(f, 1.1, 0.7);
  return (
    <SceneFrame
      dark
      eyebrow="Elle exprime son envie"
      line1="Elle appelle"
      line2="un architecte."
      footer="Elle décrit. Elle ne dessine pas."
      vo="Alors elle fait appel à un architecte. Elle ne lui donne pas de plans. Elle lui dit simplement ce qu'elle veut."
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
        <g transform="translate(770 560) scale(0.95)" style={{translate: `${(1 - arch) * 300}px 0px`}}>
          <Architect />
        </g>
        <g transform="translate(170 590) scale(0.85)" opacity={t01(f, 0.2)}>
          <Awa />
        </g>
        <g opacity={t01(f, 2.9, 0.3)}>
          <rect x={420} y={640} width={140} height={90} rx={12} fill="none" stroke={C.sky} strokeWidth={5} strokeDasharray="14 10" />
          <path d="M440 650 L540 720 M540 650 L440 720" stroke={C.red} strokeWidth={10} strokeLinecap="round" opacity={t01(f, 3.4, 0.3)} />
          <text x={490} y={770} fill={C.sky} fontSize={28} textAnchor="middle" fontFamily={body}>pas de plans</text>
        </g>
      </svg>
      <Bubble
        dark={false}
        progress={pop(f, 4.0)}
        style={{left: 40, top: 40, width: 640}}
        text={
          <>
            {quote.slice(0, typed)}
            <span style={{opacity: f % 20 < 10 && typed < quote.length ? 1 : 0, color: C.blue}}>|</span>
          </>
        }
      />
    </SceneFrame>
  );
};

/* 5 ─ Le plan */
export const S5Plan: React.FC = () => {
  const f = useCurrentFrame();
  const draw = t01(f, 1.4, 2.0);
  const labels = t01(f, 3.2, 0.6);
  const move = t01(f, 8.2, 0.6);
  const ox = 140, oy = 40, s = 600;
  const kx = interpolate(move, [0, 1], [ox + 310, ox + 310]);
  const ky = interpolate(move, [0, 1], [oy + 10, oy + 300]);
  return (
    <SceneFrame
      eyebrow="Avant la première brique"
      line1="D'abord,"
      line2="un plan."
      footer="Awa valide… ou corrige."
      vo="L'architecte pose quelques questions, puis lui montre un plan, avant de poser la moindre brique. Awa valide… ou corrige : « Mets la cuisine côté jardin. »"
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
        <rect x={ox} y={oy + s + 20} width={s} height={90} rx={14} fill="#BFE3C6" opacity={labels} />
        <text x={ox + s / 2} y={oy + s + 78} fill={C.green} fontFamily={display} fontWeight={700} fontSize={40} textAnchor="middle" opacity={labels}>JARDIN</text>
        <rect x={ox} y={oy} width={s} height={s} fill={C.white} />
        <path
          d={`M${ox} ${oy} H${ox + s} V${oy + s} H${ox} Z M${ox} ${oy + 290} H${ox + 300} M${ox + 300} ${oy} V${oy + s} M${ox + 150} ${oy} V${oy + 290} M${ox + 300} ${oy + 290} H${ox + s}`}
          stroke={C.navy}
          strokeWidth={12}
          fill="none"
          strokeDasharray={5200}
          strokeDashoffset={5200 * (1 - draw)}
        />
        <g fontFamily={display} fontWeight={700} fontSize={40} fill={C.navy} textAnchor="middle" opacity={labels}>
          <text x={ox + 75} y={oy + 160}>Ch. 1</text>
          <text x={ox + 225} y={oy + 160}>Ch. 2</text>
          <text x={ox + 150} y={oy + 460}>Ch. 3</text>
          <text x={ox + 450} y={oy + 460} opacity={1 - move}>Salon</text>
          <text x={ox + 450} y={oy + 160} opacity={move}>Salon</text>
        </g>
        {move > 0 && move < 1 && (
          <path d={`M${ox + 450} ${oy + 200} V${oy + 380}`} stroke={C.blue} strokeWidth={8} strokeDasharray="16 12" />
        )}
        <g opacity={labels}>
          <rect x={kx} y={ky} width={280} height={270} rx={14} fill={C.yellow} />
          <text x={kx + 140} y={ky + 150} fill={C.navy} fontFamily={display} fontWeight={800} fontSize={44} textAnchor="middle">Cuisine</text>
        </g>
        <g opacity={t01(f, 8.7, 0.2)} style={{scale: String(pop(f, 8.7, 0.35))}} transform-origin={`${ox + 560} ${oy + 340}`}>
          <circle cx={ox + 560} cy={oy + 340} r={34} fill={C.green} />
          <path d={`M${ox + 544} ${oy + 340} l12 12 l20 -24`} stroke={C.white} strokeWidth={8} fill="none" strokeLinecap="round" />
        </g>
      </svg>
      <Bubble progress={pop(f, 7.6)} dark style={{left: 220, top: -70, width: 640}} text="« Mets la cuisine côté jardin. »" tail="right" />
    </SceneFrame>
  );
};

/* 6 ─ Le chantier */
const Trade: React.FC<{label: string; icon: 'hammer' | 'bolt' | 'wrench'; p: number; active: boolean}> = ({label, icon, p, active}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      background: active ? C.blue : C.white,
      color: active ? C.white : C.navy,
      borderRadius: 999,
      padding: '12px 26px 12px 14px',
      fontFamily: display,
      fontWeight: 700,
      fontSize: 34,
      boxShadow: '0 8px 22px rgba(19,28,58,0.14)',
      scale: String(p),
      opacity: Math.min(1, p * 2),
    }}
  >
    <svg width={52} height={52} viewBox="0 0 52 52">
      <circle cx={26} cy={26} r={26} fill={C.yellow} />
      {icon === 'hammer' && <path d="M16 36 L30 22 M24 16 h14 v8 h-14z" stroke={C.navy} strokeWidth={5} fill={C.navy} strokeLinecap="round" />}
      {icon === 'bolt' && <path d="M29 10 L17 29 H26 L22 42 L35 22 H26 Z" fill={C.navy} />}
      {icon === 'wrench' && <path d="M16 38 L30 24 M30 24 a8 8 0 1 0 6 -12 l-4 6 l-5 -1 l-1 -5 l6 -4" stroke={C.navy} strokeWidth={5} fill="none" strokeLinecap="round" />}
    </svg>
    {label}
  </div>
);

export const S6Site: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const swing = Math.sin(t * 2.2) * 6;
  const tapped = t > 9.9;
  const roof = t01(f, 10.1, 0.6, (x) => 1 - Math.pow(1 - x, 3));
  const rows = 6;
  return (
    <SceneFrame
      eyebrow="Le chantier commence"
      line1="Il dirige"
      line2="le chantier."
      footer="Il demande avant chaque étape importante."
      vo="Ensuite, il dirige le chantier : maçon, électricien, plombier. Il sait quel outil utiliser, et à quel moment. Et avant chaque étape importante, il demande l'accord d'Awa."
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
        {/* grue */}
        <path d="M800 760 V120 M800 140 H420 M800 140 H900" stroke={C.yellow} strokeWidth={16} fill="none" />
        <path d="M800 140 L740 80 L800 80 Z" fill={C.yellow} />
        <g style={{rotate: `${swing}deg`}} transform-origin="560 140">
          <path d="M560 140 V260" stroke={C.navy} strokeWidth={4} />
          <rect x={530} y={260} width={60} height={34} rx={4} fill={C.navy} />
        </g>
        <rect x={40} y={760} width={880} height={14} rx={7} fill={C.navy} />
        <rect x={120} y={730} width={560} height={30} fill="#8892AE" />
        {[...Array(rows)].map((_, r) => {
          const p = t01(f, 0.6 + r * 0.55, 0.4);
          return [...Array(r % 2 ? 4 : 5)].map((__, i) => (
            <rect
              key={`${r}-${i}`}
              x={130 + (r % 2 ? 68 : 0) + i * 112}
              y={688 - r * 46 - (1 - p) * 40}
              width={(r % 2 ? 4 : 5) === 5 && i === 4 ? 92 : 106}
              height={40}
              rx={4}
              fill={(r + i) % 3 ? C.blue : '#3E74E8'}
              opacity={p}
            />
          ));
        })}
        <g style={{translate: `0px ${(1 - roof) * -260}px`}} opacity={roof}>
          <path d="M100 420 L400 240 L700 420 Z" fill={C.navy} />
        </g>
      </svg>
      <div style={{position: 'absolute', left: 0, top: -10, display: 'flex', flexDirection: 'column', gap: 14}}>
        <Trade label="Maçon" icon="hammer" p={pop(f, 2.4)} active={t > 2.4 && t < 3.1} />
        <Trade label="Électricien" icon="bolt" p={pop(f, 3.1)} active={t > 3.1 && t < 4.0} />
        <Trade label="Plombier" icon="wrench" p={pop(f, 4.0)} active={t > 4.0 && t < 5.2} />
      </div>
      <div
        style={{
          position: 'absolute',
          right: 40,
          top: 330,
          width: 540,
          background: C.white,
          borderRadius: 26,
          padding: '26px 28px',
          boxShadow: '0 16px 44px rgba(19,28,58,0.22)',
          fontFamily: display,
          color: C.navy,
          scale: String(pop(f, 7.8) * (t > 10.5 ? interpolate(t, [10.5, 10.8], [1, 0], clamp) : 1)),
          transformOrigin: '50% 100%',
        }}
      >
        <div style={{fontSize: 26, fontWeight: 600, color: C.blue, letterSpacing: 3}}>L'ARCHITECTE</div>
        <div style={{fontSize: 42, fontWeight: 800, marginTop: 6, whiteSpace: 'nowrap'}}>« On pose le toit ? »</div>
        <div style={{display: 'flex', gap: 14, marginTop: 20}}>
          <div style={{background: C.blue, color: C.white, fontSize: 34, fontWeight: 700, padding: '10px 30px', borderRadius: 12, scale: tapped ? String(interpolate(t, [9.9, 10.0, 10.15], [1, 0.88, 1], clamp)) : '1', outline: tapped ? `6px solid ${C.yellow}` : 'none'}}>Oui</div>
          <div style={{background: '#E3E8F5', fontSize: 34, fontWeight: 700, padding: '10px 26px', borderRadius: 12}}>Pas encore</div>
        </div>
      </div>
    </SceneFrame>
  );
};

/* 7 ─ Les visites */
export const S7Visit: React.FC = () => {
  const f = useCurrentFrame();
  const grow = t01(f, 3.6, 0.5);
  const color = t01(f, 5.0, 0.7);
  const wall = interpolate(color, [0, 1], [0, 1]);
  const mix = (a: number[], b: number[]) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * wall)).join(',')})`;
  const ww = 150 + 70 * grow;
  return (
    <SceneFrame
      eyebrow="Les visites de chantier"
      line1="Elle visite."
      line2="Elle ajuste."
      footer="Elle voit le résultat pendant la construction."
      vo="À chaque visite, elle voit l'avancée, et ajuste : « Agrandis cette fenêtre. » « Plutôt du bleu, ici. »"
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
        <rect x={40} y={760} width={880} height={14} rx={7} fill={C.navy} />
        <path d="M140 400 L480 190 L820 400 Z" fill={C.navy} />
        <rect x={180} y={400} width={600} height={360} fill={mix([233, 220, 198], [127, 178, 255])} />
        <rect x={430} y={560} width={100} height={200} rx={6} fill={C.yellow} />
        <rect x={230} y={470} width={150} height={130} rx={6} fill={C.white} stroke={C.navy} strokeWidth={8} />
        <rect x={620 - (ww - 150) / 2} y={460 - (ww - 150) / 2} width={ww} height={130 + (ww - 150)} rx={6} fill={C.white} stroke={grow > 0 ? C.blue : C.navy} strokeWidth={grow > 0 ? 12 : 8} />
        <path d={`M${695} 460 V${590 + (ww - 150) / 2}`} stroke={C.navy} strokeWidth={6} opacity={0.4} />
      </svg>
      <Bubble progress={pop(f, 3.3)} dark style={{left: 0, top: 10}} text="« Agrandis cette fenêtre. »" />
      <Bubble progress={pop(f, 4.7)} style={{right: 0, top: 150}} text="« Plutôt du bleu, ici. »" tail="right" />
    </SceneFrame>
  );
};

/* 8 ─ Les clés */
export const S8Keys: React.FC = () => {
  const f = useCurrentFrame();
  const k = pop(f, 0.3, 0.6);
  const burst = t01(f, 1.7, 0.6);
  return (
    <SceneFrame eyebrow="Le grand jour" line1="Et un jour…" line2="les clés." footer="Le projet est livré." vo="Et un jour… on lui remet les clés." voEnd={3.2}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
        {[...Array(12)].map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const r1 = 220 + burst * 40, r2 = 260 + burst * 110;
          return (
            <path key={i} d={`M${480 + Math.cos(a) * r1} ${370 + Math.sin(a) * r1} L${480 + Math.cos(a) * r2} ${370 + Math.sin(a) * r2}`} stroke={i % 2 ? C.yellow : C.blue} strokeWidth={14} strokeLinecap="round" opacity={burst * (1 - t01(f, 2.6, 0.8)) + 0.15} />
          );
        })}
        <g style={{scale: String(k), rotate: `${(1 - k) * -90}deg`}} transform-origin="480 370">
          <circle cx={360} cy={370} r={100} fill="none" stroke={C.blue} strokeWidth={44} />
          <path d="M460 370 H700 V440 M640 370 V420" stroke={C.blue} strokeWidth={44} strokeLinecap="square" fill="none" />
        </g>
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center'}}>
        <Pill p={pop(f, 1.9)} bg={C.navy}>Bienvenue chez toi, Awa !</Pill>
      </div>
    </SceneFrame>
  );
};

/* 9 ─ La révélation : le tableau de correspondance */
const MAP: [string, string, number][] = [
  ['Ton envie', 'Ta demande', 2.6],
  ["Le plan de l'architecte", 'Le mode Plan', 6.9],
  ['Maçon, électricien…', 'Les outils', 8.6],
  ['« On pose le toit ? »', 'Ta permission', 9.4],
  ['Les visites', 'Tes retours', 10.0],
  ['Les clés', 'Ton projet fini', 10.6],
];
export const S9Reveal: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <SceneFrame
      dark
      eyebrow="De la maison au numérique"
      line1="Claude Code,"
      line2="ton architecte."
      footer="Un site, une appli, une vidéo."
      vo="Claude Code, c'est exactement ça. Tu décris ce que tu veux : un site, une appli, une vidéo. Claude fait un plan, écrit le code, utilise les bons outils… et te montre le résultat."
    >
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 26, letterSpacing: 4, fontWeight: 700, opacity: 0.55 * t01(f, 1.2), padding: '0 10px 18px'}}>
        <span>LA MAISON</span>
        <span>CLAUDE CODE</span>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
        {MAP.map(([a, b, s]) => {
          const p = t01(f, s, 0.5);
          return (
            <div
              key={a}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 20,
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 18,
                padding: '22px 26px',
                opacity: p,
                translate: `${(1 - p) * -60}px 0px`,
              }}
            >
              <span style={{fontSize: 38, fontWeight: 500, flex: 1}}>{a}</span>
              <span style={{color: C.blueLight, fontSize: 44, fontWeight: 800, width: 60, textAlign: 'center'}}>→</span>
              <span style={{fontFamily: display, fontSize: 40, fontWeight: 800, color: C.yellow, textAlign: 'right', flex: 1}}>{b}</span>
            </div>
          );
        })}
      </div>
    </SceneFrame>
  );
};

/* 10 ─ Le secret : cette vidéo */
export const S10Secret: React.FC = () => {
  const f = useCurrentFrame();
  const prompt = "Crée une vidéo TikTok qui explique Claude Code avec l'histoire d'un architecte. 11 scènes, aux couleurs d'AroSoft.";
  const typed = Math.round(interpolate(f, [0.3 * FPS, 2.6 * FPS], [0, prompt.length], clamp));
  const player = pop(f, 2.8, 0.5);
  const prog = t01(f, 3.0, 1.6, (x) => x);
  return (
    <SceneFrame dark eyebrow="Un petit secret" line1="Cette vidéo ?" line2="Décrite à Claude." footer="Le même principe, appliqué à la vidéo." vo="D'ailleurs, cette vidéo ? Je ne l'ai pas montée. Je l'ai décrite à Claude.">
      <div style={{background: '#0A0F22', borderRadius: 26, border: '2px solid #26304F', overflow: 'hidden', opacity: t01(f, 0.1)}}>
        <div style={{display: 'flex', gap: 12, padding: '18px 22px', background: '#141B35'}}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
            <div key={c} style={{width: 20, height: 20, borderRadius: 10, background: c}} />
          ))}
        </div>
        <div style={{padding: '26px 30px 34px', fontFamily: 'monospace', fontSize: 36, lineHeight: 1.5, color: '#C9D6FF', minHeight: 330}}>
          <div style={{color: C.claude, fontWeight: 700}}>✳ Claude Code</div>
          <span style={{color: C.claude, fontWeight: 700}}>&gt; </span>
          {prompt.slice(0, typed)}
          <span style={{opacity: f % 20 < 10 ? 1 : 0}}>▌</span>
        </div>
      </div>
      <div style={{marginTop: 34, background: C.white, borderRadius: 26, padding: 22, scale: String(player), opacity: Math.min(1, player * 2), color: C.navy, display: 'flex', gap: 24, alignItems: 'center'}}>
        <div style={{width: 110, height: 110, borderRadius: 55, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width={50} height={50} viewBox="0 0 50 50"><path d="M14 8 L42 25 L14 42 Z" fill={C.white} /></svg>
        </div>
        <div style={{flex: 1}}>
          <div style={{fontFamily: display, fontWeight: 800, fontSize: 38}}>L'architecte Claude.mp4</div>
          <div style={{height: 14, background: '#E3E8F5', borderRadius: 7, marginTop: 16, overflow: 'hidden'}}>
            <div style={{height: '100%', width: `${prog * 100}%`, background: `linear-gradient(90deg, ${C.blue}, ${C.blueLight})`}} />
          </div>
        </div>
      </div>
    </SceneFrame>
  );
};

/* 11 ─ Appel à l'action + carte de fin */
export const S11CTA: React.FC = () => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const t = f / FPS;
  const end = durationInFrames / FPS;
  const cover = pop(f, 7.2, 0.8);
  const float = Math.sin(t * 2) * 10;
  const price = pop(f, 10.0, 0.45);
  const btn = pop(f, 11.0, 0.5);
  const pulse = t > 11.6 ? 1 + Math.sin((t - 11.6) * 6) * 0.03 : 1;
  const outro = t01(f, end - 2.0, 0.5);
  return (
    <AbsoluteFill>
      <SceneFrame
        dark
        eyebrow="À toi de jouer"
        line1="Tu décris."
        line2="Claude réalise."
        footer="Guide pratique · vibe motion design"
        vo="Tu vois, tu n'as pas besoin de savoir faire. Juste de savoir ce que tu veux : Claude se charge de la réalisation. J'ai préparé un guide pratique, pas à pas, pour toi, à seulement 10 000 F. Télécharge-le, et réalise ta première vidéo dès aujourd'hui !"
        voEnd={end - 2.2}
      >
        <div style={{position: 'absolute', left: 0, right: 0, top: 60, display: 'flex', flexDirection: 'column', gap: 34, alignItems: 'center', opacity: 1 - t01(f, 6.7, 0.4)}}>
          <Pill p={pop(f, 1.7)} bg="rgba(255,255,255,0.08)" style={{fontSize: 50, padding: '22px 38px'}}>
            <span style={{color: C.red, fontWeight: 800}}>✕</span> <span style={{textDecoration: t > 2.2 ? 'line-through' : 'none', textDecorationThickness: 5}}>Savoir faire</span>
          </Pill>
          <Pill p={pop(f, 3.0)} bg={C.white} color={C.navy} style={{fontSize: 50, padding: '22px 38px'}}>
            <span style={{color: C.green, fontWeight: 800}}>✓</span> Savoir ce que tu veux
          </Pill>
          <Pill p={pop(f, 4.5)} bg={C.blue} style={{fontSize: 50, padding: '22px 38px'}}>
            <span style={{color: C.yellow, fontWeight: 800}}>✳</span> Claude réalise
          </Pill>
        </div>
        <div style={{position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'flex-start'}}>
          <Img
            src={staticFile('cover.png')}
            style={{
              width: 470,
              borderRadius: 10,
              boxShadow: '0 30px 70px rgba(0,0,0,0.5)',
              scale: String(cover),
              rotate: `${-4 + (1 - cover) * -20}deg`,
              translate: `0px ${float}px`,
              marginTop: -20,
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            right: 60,
            top: 330,
            background: C.red,
            color: C.white,
            fontFamily: display,
            fontWeight: 800,
            fontSize: 62,
            lineHeight: 1,
            padding: '20px 26px',
            borderRadius: 22,
            textAlign: 'center',
            rotate: `${8 - (1 - price) * 30}deg`,
            scale: String(price),
            boxShadow: '0 14px 30px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{fontSize: 24, letterSpacing: 4, fontWeight: 700, marginBottom: 8}}>SEULEMENT</div>
          10 000 F
        </div>
        <div style={{position: 'absolute', left: 40, right: 40, top: 650, display: 'flex', justifyContent: 'center'}}>
          <div
            style={{
              background: C.yellow,
              color: C.navy,
              fontFamily: display,
              fontWeight: 800,
              fontSize: 46,
              padding: '26px 40px',
              borderRadius: 24,
              scale: String(btn * pulse),
              opacity: Math.min(1, btn * 2),
              boxShadow: '0 14px 34px rgba(255,194,26,0.35)',
            }}
          >
            Télécharge le guide · lien en bio
          </div>
        </div>
      </SceneFrame>
      {/* carte de fin AroSoft */}
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, ${C.navy2} 0%, ${C.navy} 65%)`, opacity: outro, alignItems: 'center', justifyContent: 'center'}}>
        <Img src={staticFile('logo-full-light.png')} style={{width: 820, scale: String(0.9 + 0.1 * outro)}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

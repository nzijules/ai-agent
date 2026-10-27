/**
 * Animation codée du BTCS : terre latérite + stabilisant → presse (moule + compression
 * verticale) → bloc éjecté → mur en rangs décalés à joints fins.
 *
 * Réalisme (cf. brief) : bloc au format brique (L ≈ 2 × l), arêtes nettes, surface mate
 * granuleuse ; presse hydraulique à piston vertical, jamais une foreuse ; mur à joints fins
 * et rangs décalés, jamais de dalles. Proportions tirées de brand.btcs.dimensions.
 * Si OHEL fournit des photos de ses blocs et de sa presse, les reprendre ici comme référence.
 */
import {useId} from 'react';
import {AbsoluteFill, Easing, interpolate, interpolateColors, useCurrentFrame} from 'remotion';
import {brand} from '../config/brand';
import {useFormat} from '../lib/format';
import {rnd} from '../lib/random';
import {Sfx} from './Sfx';

const C = brand.colors;
const {length: LEN, width: WID, height: HGT} = brand.btcs.dimensions;

type Phases = {
  pour: [number, number];
  compress: [number, number];
  retract: [number, number];
  eject: [number, number];
  slide: [number, number];
  wall: [number, number];
};

const phasesFor = (variant: 'full' | 'short', frames: number): Phases =>
  variant === 'full'
    ? {pour: [0, 72], compress: [80, 118], retract: [126, 140], eject: [140, 160], slide: [160, 190], wall: [178, frames - 8]}
    : {pour: [0, 24], compress: [26, 46], retract: [48, 56], eject: [56, 66], slide: [66, 86], wall: [78, frames - 10]};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);
const prog = (f: number, [a, b]: [number, number], easing = io) => interpolate(f, [a, b], [0, 1], {...clamp, easing});

// Échelle : la longueur du bloc vaut 300 px dans le repère de la presse.
const MORTAR = '#8A6A52';
const S = 300 / LEN;
const BL = LEN * S; // longueur du bloc (px)
const BH = HGT * S; // hauteur du bloc compressé
const BD = WID * S; // profondeur (largeur réelle du bloc)
const LOOSE = BH * 1.65; // hauteur de terre foisonnée avant compression
const FLOOR = -14; // fond du moule (dessus de la plaque d'éjection)
const MOULD_TOP = FLOOR - LOOSE - 12;
const EJECT_TOP = MOULD_TOP - 8; // dessus des parois du moule
const PISTON_REST = MOULD_TOP - 230;

const Defs: React.FC = () => (
  <defs>
    <linearGradient id="steel" x1="0" x2="1">
      <stop offset="0" stopColor="#3A3F45" />
      <stop offset="0.45" stopColor="#8A929B" />
      <stop offset="1" stopColor="#40454B" />
    </linearGradient>
    <linearGradient id="steelV" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#7D848C" />
      <stop offset="1" stopColor="#3F444A" />
    </linearGradient>
    <radialGradient id="bg" cx="0.5" cy="0.42" r="0.75">
      <stop offset="0" stopColor="#3A2A20" />
      <stop offset="0.6" stopColor="#1C1410" />
      <stop offset="1" stopColor="#0E0A08" />
    </radialGradient>
    {/* Grain mat de la terre : bruit multiplié sur la couleur */}
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves={3} seed={11} result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.9 0.62" result="dark" />
      <feComposite in="dark" in2="SourceGraphic" operator="in" result="darkIn" />
      <feMerge>
        <feMergeNode in="SourceGraphic" />
        <feMergeNode in="darkIn" />
      </feMerge>
    </filter>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="14" />
    </filter>
  </defs>
);

/** Bloc vu de 3/4 : face avant + dessus + côté. `turn` ∈ [0,1] ouvre la perspective. */
const IsoBlock: React.FC<{x: number; y: number; turn: number; tone?: string}> = ({x, y, turn, tone = C.laterite}) => {
  const dx = BD * 0.55 * turn;
  const dy = -BD * 0.38 * turn;
  const top = interpolateColors(0.5, [0, 1], [tone, '#E7B98A']);
  const side = interpolateColors(0.45, [0, 1], [tone, '#3B1A0C']);
  return (
    <g transform={`translate(${x} ${y})`} filter="url(#grain)">
      {/* côté droit */}
      <polygon points={`${BL / 2},${-BH} ${BL / 2 + dx},${-BH + dy} ${BL / 2 + dx},${dy} ${BL / 2},0`} fill={side} />
      {/* dessus */}
      <polygon points={`${-BL / 2},${-BH} ${-BL / 2 + dx},${-BH + dy} ${BL / 2 + dx},${-BH + dy} ${BL / 2},${-BH}`} fill={top} />
      {/* face avant */}
      <rect x={-BL / 2} y={-BH} width={BL} height={BH} fill={tone} />
      {/* arêtes nettes */}
      <line x1={-BL / 2} y1={-BH} x2={BL / 2} y2={-BH} stroke="#F0C79C" strokeWidth={2} opacity={0.7} />
    </g>
  );
};

/** Presse BTCS hydraulique en coupe : bâti, vérin, piston, moule, plaque d'éjection. */
const Press: React.FC<{frame: number; ph: Phases}> = ({frame, ph}) => {
  const fill = prog(frame, ph.pour, Easing.out(Easing.quad));
  const comp = prog(frame, ph.compress, Easing.in(Easing.quad));
  const retract = prog(frame, ph.retract);
  const eject = prog(frame, ph.eject);
  const slide = prog(frame, ph.slide);

  // Hauteur de terre dans le moule : remplissage puis compression.
  const height = fill * LOOSE - comp * (LOOSE - BH);
  const ejectLift = eject * (FLOOR - EJECT_TOP);
  const floorY = FLOOR - ejectLift;
  const earthTop = floorY - height;
  const pistonBottom =
    frame < ph.compress[0]
      ? PISTON_REST
      : frame <= ph.compress[1]
        ? interpolate(comp, [0, 1], [PISTON_REST, FLOOR - BH], clamp) // descend jusqu'au bloc
        : interpolate(retract, [0, 1], [FLOOR - BH, PISTON_REST], clamp);
  // Le piston n'appuie qu'une fois en contact avec la terre.
  const pistonY = Math.min(pistonBottom, earthTop);
  const density = comp; // couleur foisonnée → compacte
  const earthColor = interpolateColors(density, [0, 1], [C.earthLight, C.laterite]);

  const blockOut = frame >= ph.slide[0];
  const slideX = interpolate(slide, [0, 1], [0, 520], clamp);
  const slideY = interpolate(slide, [0, 1], [0, 40], clamp);

  return (
    <g>
      {/* sol */}
      <ellipse cx={0} cy={320} rx={430} ry={34} fill="#000" opacity={0.45} filter="url(#soft)" />
      {/* pieds */}
      <rect x={-300} y={44} width={34} height={270} fill="url(#steelV)" />
      <rect x={266} y={44} width={34} height={270} fill="url(#steelV)" />
      {/* colonnes + traverse */}
      <rect x={-262} y={PISTON_REST - 300} width={38} height={-(PISTON_REST - 300)} fill="url(#steel)" />
      <rect x={224} y={PISTON_REST - 300} width={38} height={-(PISTON_REST - 300)} fill="url(#steel)" />
      <rect x={-310} y={PISTON_REST - 340} width={620} height={60} rx={6} fill="url(#steelV)" />
      {/* vérin hydraulique */}
      <rect x={-64} y={PISTON_REST - 280} width={128} height={150} rx={10} fill="url(#steel)" />
      <rect x={-70} y={PISTON_REST - 150} width={140} height={14} fill="#2E3237" />
      <rect x={-16} y={PISTON_REST - 136} width={32} height={pistonY - 30 - (PISTON_REST - 136)} fill="#C9CED3" />
      {/* plateau du piston */}
      <rect x={-BL / 2 + 2} y={pistonY - 30} width={BL - 4} height={30} fill="url(#steelV)" />
      {/* goulottes : terre (gauche) et stabilisant (droite) */}
      <g opacity={1 - prog(frame, [ph.pour[1], ph.pour[1] + 8])}>
        <polygon points={`-470,${MOULD_TOP - 210} -380,${MOULD_TOP - 230} -110,${MOULD_TOP - 60} -150,${MOULD_TOP - 40}`} fill="#5B6168" />
        <polygon points={`420,${MOULD_TOP - 190} 470,${MOULD_TOP - 170} 130,${MOULD_TOP - 50} 110,${MOULD_TOP - 66}`} fill="#5B6168" />
      </g>
      <Grains frame={frame} ph={ph} surface={earthTop} />
      {/* moule (coupe) : intérieur sombre, parois acier */}
      <rect x={-BL / 2} y={MOULD_TOP} width={BL} height={FLOOR - MOULD_TOP} fill="#16110E" />
      {!blockOut ? <rect x={-BL / 2} y={earthTop} width={BL} height={Math.max(0, height)} fill={earthColor} filter="url(#grain)" /> : null}
      <rect x={-BL / 2} y={floorY} width={BL} height={14 + ejectLift} fill="url(#steelV)" />
      <rect x={-BL / 2 - 52} y={MOULD_TOP - 8} width={52} height={-MOULD_TOP + 8} fill="url(#steel)" />
      <rect x={BL / 2} y={MOULD_TOP - 8} width={52} height={-MOULD_TOP + 8} fill="url(#steel)" />
      {/* table */}
      <rect x={-330} y={0} width={660} height={44} rx={4} fill="url(#steelV)" />
      {/* bloc éjecté qui glisse vers le mur en pivotant légèrement */}
      {blockOut ? <IsoBlock x={slideX} y={EJECT_TOP + slideY} turn={slide} /> : null}
    </g>
  );
};

/** Grains de terre (latérite) et de stabilisant (gris) qui tombent dans le moule. */
const Grains: React.FC<{frame: number; ph: Phases; surface: number}> = ({frame, ph, surface}) => {
  const [a, b] = ph.pour;
  const n = 260;
  const span = b - a;
  return (
    <g>
      {Array.from({length: n}, (_, i) => {
        const stab = i % 10 === 0; // ≈ 10 % de stabilisant
        const t0 = a + rnd(`t${i}`) * span * 0.85;
        const life = 10 + rnd(`l${i}`) * 6;
        const t = (frame - t0) / life;
        if (t < 0 || t > 1) return null;
        const sx = stab ? 120 + rnd(`x${i}`) * 20 : -130 - rnd(`x${i}`) * 25;
        const sy = stab ? MOULD_TOP - 60 : MOULD_TOP - 50;
        const ex = (rnd(`e${i}`) - 0.5) * (BL - 30);
        const x = interpolate(t, [0, 1], [sx, ex]);
        const y = interpolate(t * t, [0, 1], [sy, surface]);
        const r = 2 + rnd(`r${i}`) * 2.5;
        const tones = [C.laterite, C.ochre, C.laterite, C.earthLight];
        return <circle key={i} cx={x} cy={y} r={r} fill={stab ? C.stabiliser : tones[i % tones.length]} />;
      })}
    </g>
  );
};

/** Mur BTCS en élévation : rangs décalés d'un demi-bloc, joints fins, posé sur soubassement. */
export const BtcsWall: React.FC<{
  frame: number;
  start: number;
  end: number;
  width: number;
  rows: number;
  blockW: number;
  /** true : mur déjà monté (fonds). */
  built?: boolean;
}> = ({frame, start, end, width, rows, blockW, built}) => {
  // Identifiant unique : plusieurs murs coexistent pendant les transitions.
  const clipId = `wall-${useId().replace(/:/g, '')}`;
  const bh = blockW * (HGT / LEN);
  const joint = Math.max(4, blockW * 0.035);
  const cols = Math.ceil(width / (blockW + joint)) + 2;
  const total = rows * cols;
  const per = (end - start) / total;
  const height = rows * (bh + joint);
  const blocks: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    const offset = r % 2 === 0 ? 0 : -(blockW + joint) / 2;
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const t0 = start + i * per;
      const p = built ? 1 : interpolate(frame, [t0, t0 + Math.max(6, per * 5)], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
      if (p <= 0) continue;
      const x = offset + c * (blockW + joint);
      const y = height - (r + 1) * (bh + joint);
      const shade = 0.92 + rnd(`w${i}`) * 0.12;
      const tone = interpolateColors(rnd(`c${i}`), [0, 1], [C.laterite, C.ochre]);
      blocks.push(
        <g key={i} transform={`translate(${x} ${y - (1 - p) * bh * 1.6})`} opacity={p}>
          {/* lit de mortier sous le bloc */}
          <rect x={-joint / 2} y={-joint / 2} width={blockW + joint} height={bh + joint} fill={MORTAR} />
          <rect width={blockW} height={bh} fill={tone} style={{filter: `brightness(${shade})`}} />
          <rect width={blockW} height={2} fill="#F2C9A0" opacity={0.45} />
          <rect y={bh - 3} width={blockW} height={3} fill="#3B1A0C" opacity={0.35} />
        </g>,
      );
    }
  }
  return (
    <g>
      <clipPath id={clipId}>
        <rect x={0} y={-bh * 3} width={width} height={height + bh * 3} />
      </clipPath>
      <g clipPath={`url(#${clipId})`} filter="url(#grain)">
        {blocks}
      </g>
      {/* soubassement protégé */}
      <rect x={-20} y={height} width={width + 40} height={bh * 1.4} fill="#9C9C98" />
      <rect x={-20} y={height} width={width + 40} height={4} fill="#C8C8C4" />
    </g>
  );
};

export const BtcsBlockAnimation: React.FC<{variant: 'full' | 'short'; frames: number}> = ({variant, frames}) => {
  const frame = useCurrentFrame();
  const {width, height, vertical} = useFormat();
  const ph = phasesFor(variant, frames);

  // Caméra : la presse remonte et s'efface pendant que le mur monte.
  const cam = prog(frame, [ph.slide[0] + 6, ph.wall[0] + 16]);
  const pressScale = vertical ? 1.15 : 0.95;
  const px = vertical ? width / 2 - 40 : width * 0.42;
  const py = vertical ? 1180 : 760;
  const wallW = vertical ? width + 80 : width * 0.8;
  const wallRows = vertical ? 12 : 8;
  const blockW = vertical ? 210 : 220;
  const wallH = wallRows * blockW * (HGT / LEN) * 1.035;
  const wallX = vertical ? -40 : width * 0.1;
  const wallY = vertical ? 1300 - wallH : height * 0.82 - wallH;
  const wallIn = interpolate(frame, [ph.wall[0] - 6, ph.wall[0] + 10], [0, 1], clamp);
  const push = interpolate(frame, [ph.wall[0], frames], [1.04, 1], clamp);

  return (
    <AbsoluteFill>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs />
        <rect width={width} height={height} fill="url(#bg)" />
        <g transform={`translate(${px} ${py - cam * 260}) scale(${pressScale * (1 - cam * 0.25)})`} opacity={1 - cam}>
          <Press frame={frame} ph={ph} />
        </g>
        <g
          opacity={wallIn}
          transform={`translate(${width / 2} ${wallY + wallH / 2}) scale(${push}) translate(${-width / 2 + wallX} ${-wallH / 2})`}
        >
          <BtcsWall frame={frame} start={ph.wall[0]} end={ph.wall[1] - 14} width={wallW} rows={wallRows} blockW={blockW} />
        </g>
      </svg>
      <Sfx id="sfxCompression" at={ph.compress[0] + Math.round((ph.compress[1] - ph.compress[0]) * 0.4)} />
      <Sfx id="sfxPose" at={ph.wall[0]} volume={0.35} />
    </AbsoluteFill>
  );
};

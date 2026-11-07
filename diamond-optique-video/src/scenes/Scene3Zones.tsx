import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {CONFIG} from '../config';
import {Grain, Vignette} from '../components/FX';
import {LogoBadge} from '../components/LogoBadge';
import {clamp, easeInOut, spr, tween} from '../components/anim';
import {C, F} from '../theme';

/**
 * SCÈNE 3 — LES ZONES (9–15 s)
 * Carte stylisée (non cartographique) du Grand Abidjan : lagune Ébrié, littoral, 3 zones.
 * Coordonnées dans un repère 1000 x 1000.
 */
const ZONES = [
  {x: 840, y: 640, r: 120, label: 'BASSAM'}, // Zone 1 (est, littoral)
  {x: 470, y: 600, r: 130, label: 'MARCORY'}, // Zone 2 (sud lagune)
  {x: 430, y: 300, r: 130, label: 'COCODY'}, // Zone 3 (nord)
];

// caméra : [frame, cx, cy, zoom]
const CAM: [number, number, number, number][] = [
  [0, 500, 500, 0.9],
  [14, 500, 500, 1.0],
  [30, 800, 620, 1.7],
  [62, 800, 620, 1.7],
  [78, 470, 590, 1.7],
  [110, 470, 590, 1.7],
  [126, 430, 330, 1.7],
  [150, 430, 330, 1.7],
  [168, 560, 480, 1.0],
  [180, 560, 480, 1.0],
];
const cam = (f: number, k: 1 | 2 | 3) =>
  interpolate(
    f,
    CAM.map((c) => c[0]),
    CAM.map((c) => c[k]),
    {...clamp, easing: easeInOut}
  );

const ZONE_START = [24, 72, 120];

export const Scene3Zones: React.FC = () => {
  const f = useCurrentFrame();
  const cx = cam(f, 1);
  const cy = cam(f, 2);
  const z = cam(f, 3);
  const mapIn = spr(f, 0, 18);
  // carte affichée dans une zone 1000x1000 px centrée en (540, 760)
  const active = f < ZONE_START[1] ? 0 : f < ZONE_START[2] ? 1 : 2;
  const overview = f >= 158;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 35%, #1D3A7E 0%, ${C.navy} 45%, ${C.navyDeep} 100%)`,
        overflow: 'hidden',
      }}
    >
      {/* Titre */}
      <div
        style={{
          position: 'absolute',
          top: 270,
          left: 60,
          fontFamily: F.display,
          fontSize: 92,
          color: C.white,
          opacity: tween(f, 0, 12),
          transform: `translateX(${(1 - tween(f, 0, 14)) * -60}px)`,
          zIndex: 5,
        }}
      >
        <span style={{color: C.gold}}>3</span> ZONES À COUVRIR
      </div>

      {/* Carte avec caméra */}
      <div
        style={{
          position: 'absolute',
          left: 40,
          top: 380,
          width: 1000,
          height: 1000,
          overflow: 'hidden',
          borderRadius: 40,
          opacity: mapIn,
          transform: `scale(${0.9 + 0.1 * mapIn})`,
          boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
        }}
      >
        <div
          style={{
            width: 1000,
            height: 1000,
            transform: `scale(${z}) translate(${500 - cx}px, ${500 - cy}px)`,
            transformOrigin: '500px 500px',
          }}
        >
          <svg viewBox="0 0 1000 1000" width={1000} height={1000}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0H0V40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              </pattern>
              <radialGradient id="zg">
                <stop offset="0" stopColor={C.gold} stopOpacity="0.55" />
                <stop offset="1" stopColor={C.gold} stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* terre */}
            <rect width="1000" height="1000" fill="#0F2150" />
            <rect width="1000" height="1000" fill="url(#grid)" />
            {/* océan */}
            <path d="M0 800 C 200 770, 400 790, 600 770 S 900 760, 1000 750 L1000 1000 L0 1000Z" fill="#0A3A78" />
            <path d="M0 800 C 200 770, 400 790, 600 770 S 900 760, 1000 750" fill="none" stroke="#5FA8FF" strokeWidth="3" opacity="0.6" />
            {/* lagune Ébrié (stylisée) */}
            <path
              d="M0 520 C 120 500, 220 540, 300 500 C 360 470, 330 420, 380 400 C 430 380, 470 430, 520 450 C 580 470, 620 520, 700 540 C 800 565, 900 590, 1000 600 L1000 650 C 900 640, 800 625, 700 600 C 620 580, 560 540, 510 520 C 460 500, 430 470, 400 480 C 370 490, 390 540, 320 570 C 230 600, 120 560, 0 580Z"
              fill="#1B5FB8"
              opacity="0.9"
            />
            {/* routes */}
            <path d="M120 200 C 300 260, 380 330, 430 300 S 650 260, 900 220" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="4" />
            <path d="M380 700 C 520 690, 700 680, 980 690" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="4" />
            <path d="M330 150 L 360 420" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="3" />
            <text x="160" y="470" fill="rgba(255,255,255,0.35)" fontSize="22" fontFamily="Montserrat" fontWeight="600" letterSpacing="4">LAGUNE ÉBRIÉ</text>
            <text x="380" y="900" fill="rgba(255,255,255,0.3)" fontSize="22" fontFamily="Montserrat" fontWeight="600" letterSpacing="6">OCÉAN ATLANTIQUE</text>
            <text x="80" y="120" fill="rgba(255,255,255,0.45)" fontSize="30" fontFamily="Anton" letterSpacing="6">ABIDJAN</text>

            {ZONES.map((zn, i) => {
              const s = spr(f, ZONE_START[i], 12);
              const pulse = ((f - ZONE_START[i]) % 30) / 30;
              const on = f >= ZONE_START[i];
              const isActive = i === active || overview;
              return (
                <g key={i} opacity={on ? 1 : 0}>
                  <circle cx={zn.x} cy={zn.y} r={zn.r * 1.6 * s} fill="url(#zg)" opacity={isActive ? 1 : 0.5} />
                  <circle
                    cx={zn.x}
                    cy={zn.y}
                    r={zn.r * s}
                    fill="rgba(255,201,40,0.12)"
                    stroke={C.gold}
                    strokeWidth={3}
                    strokeDasharray="10 8"
                    strokeDashoffset={-f * 1.5}
                  />
                  <circle cx={zn.x} cy={zn.y} r={20 + pulse * 60} fill="none" stroke={C.gold} strokeWidth={3} opacity={1 - pulse} />
                  {/* épingle */}
                  <g transform={`translate(${zn.x} ${zn.y - (1 - s) * 120}) scale(${0.6 + 0.4 * s})`}>
                    <path d="M0 0 C -22 -30, -30 -45, -30 -62 A30 30 0 1 1 30 -62 C 30 -45, 22 -30, 0 0Z" fill={C.bordeaux} stroke="#fff" strokeWidth="4" />
                    <text x="0" y="-50" textAnchor="middle" fill="#fff" fontFamily="Anton" fontSize="34">{i + 1}</text>
                  </g>
                  <text
                    x={zn.x}
                    y={zn.y + 50}
                    textAnchor="middle"
                    fill="#fff"
                    fontFamily="Anton"
                    fontSize={overview ? 34 : 28}
                    letterSpacing="2"
                    opacity={s}
                  >
                    {zn.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Carte d'information de zone */}
      {CONFIG.zones.map((zone, i) => {
        const start = ZONE_START[i] + 4;
        const end = i < 2 ? ZONE_START[i + 1] : 999;
        const inn = spr(f, start, 14);
        const out = i < 2 ? spr(f, end, 16) : 0;
        if (f < start - 1 || out >= 0.999) return null;
        return (
          <div
            key={zone.id}
            style={{
              position: 'absolute',
              left: 60,
              right: 60,
              top: 1180,
              background: C.white,
              borderRadius: 30,
              padding: '26px 34px',
              display: 'flex',
              alignItems: 'center',
              gap: 26,
              boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
              transform: `translateX(${(1 - inn) * 900 - out * 900}px) rotate(${(1 - inn) * 4}deg)`,
              zIndex: 6,
            }}
          >
            <div
              style={{
                width: 110,
                height: 110,
                borderRadius: 26,
                background: C.bordeaux,
                color: C.white,
                fontFamily: F.display,
                fontSize: 70,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {zone.id}
            </div>
            <div>
              <div style={{fontFamily: F.display, fontSize: 46, color: C.bordeaux, letterSpacing: 1}}>
                {zone.titre.toUpperCase()}
              </div>
              <div style={{fontFamily: F.body, fontWeight: 700, fontSize: 40, color: C.ink}}>
                {zone.secteurs.join(' / ')}
              </div>
            </div>
          </div>
        );
      })}
      <Vignette strength={0.35} />
      <LogoBadge delay={0} />
      <Grain />
    </AbsoluteFill>
  );
};

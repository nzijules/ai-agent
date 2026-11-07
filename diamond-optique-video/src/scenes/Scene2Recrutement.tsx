import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {CONFIG} from '../config';
import {FloatingShapes, Grain, LightSweep, Vignette} from '../components/FX';
import {MaskLine} from '../components/Kinetic';
import {LogoBadge} from '../components/LogoBadge';
import {clamp, ease, spr} from '../components/anim';
import {C, F} from '../theme';

/** SCÈNE 2 — RECRUTEMENT (4–9 s) */
export const Scene2Recrutement: React.FC = () => {
  const f = useCurrentFrame();

  // compteur 01 → 02 → 03
  const counterIn = spr(f, 22, 12);
  const n = f < 34 ? 1 : f < 44 ? 2 : 3;
  const tick = f < 34 ? f - 22 : f < 44 ? f - 34 : f - 44;
  const bump = 1 + 0.18 * Math.exp(-Math.max(0, tick) / 4);
  // le compteur se transforme en titre
  const morph = interpolate(f, [60, 76], [0, 1], {...clamp, easing: ease});

  const duo = spr(f, 30, 15, 0.9, 90);
  const hex = spr(f, 18, 14);
  const parallax = interpolate(f, [0, 150], [0, -40], clamp);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 40%, ${C.bordeaux} 0%, ${C.bordeauxDeep} 60%, ${C.bordeauxDark} 100%)`,
        overflow: 'hidden',
      }}
    >
      <FloatingShapes seed={2} />

      {/* Hexagone jaune 3D (rappel de l'affiche) */}
      <div
        style={{
          position: 'absolute',
          left: 540,
          top: 1300 + parallax * 0.5,
          width: 980,
          height: 980,
          transform: `translate(-50%,-50%) perspective(1400px) rotateY(${(1 - hex) * 70}deg) rotateZ(${f * 0.08}deg) scale(${hex})`,
        }}
      >
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <defs>
            <linearGradient id="hx" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#FFD84D" />
              <stop offset="1" stopColor={C.goldDeep} />
            </linearGradient>
          </defs>
          <polygon points="50,2 92,26 92,74 50,98 8,74 8,26" fill="url(#hx)" />
          <polygon points="50,9 86,30 86,70 50,91 14,70 14,30" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={0.6} />
        </svg>
      </div>

      {/* Duo de promoteurs */}
      <Img
        src={staticFile('img/duo.png')}
        style={{
          position: 'absolute',
          width: 1000,
          left: 40,
          top: 760 + (1 - duo) * 700 + parallax,
          opacity: duo,
          filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.35))',
        }}
      />
      <AbsoluteFill
        style={{background: `linear-gradient(180deg, rgba(0,0,0,0) 78%, ${C.bordeauxDark} 100%)`}}
      />

      {/* Tag */}
      <div style={{position: 'absolute', top: 290, left: 60}}>
        <MaskLine delay={2}>
          <div
            style={{
              background: C.gold,
              color: C.ink,
              fontFamily: F.display,
              fontSize: 64,
              padding: '10px 30px',
              borderRadius: 18,
              boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
            }}
          >
            DIAMOND OPTIQUE RECRUTE !
          </div>
        </MaskLine>
      </div>

      {/* Compteur */}
      {morph < 1 && (
        <div
          style={{
            position: 'absolute',
            top: 380,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: F.display,
            fontSize: 380,
            lineHeight: 1,
            color: C.white,
            opacity: counterIn * (1 - morph),
            transform: `scale(${counterIn * bump * (1 - morph * 0.6)}) translateX(${-morph * 300}px)`,
            textShadow: `0 0 60px rgba(255,201,40,0.55)`,
          }}
        >
          0{n}
        </div>
      )}

      {/* Titre */}
      <div
        style={{
          position: 'absolute',
          top: 400,
          left: 60,
          right: 60,
          fontFamily: F.display,
          color: C.white,
          lineHeight: 0.95,
          textShadow: '0 10px 30px rgba(0,0,0,0.35)',
        }}
      >
        <MaskLine delay={64}>
          <div style={{fontSize: 158}}>
            <span style={{color: C.gold}}>{CONFIG.nbPromoteurs}</span> PROMOTEURS
          </div>
        </MaskLine>
        <MaskLine delay={70}>
          <div style={{fontSize: 158}}>TERRAIN (H/F)</div>
        </MaskLine>
        <MaskLine delay={84}>
          <div
            style={{
              display: 'inline-block',
              marginTop: 14,
              background: C.navy,
              color: C.white,
              fontSize: 40,
              padding: '10px 24px',
              borderRadius: 14,
              border: '2px solid rgba(255,255,255,0.25)',
            }}
          >
            {CONFIG.mission}
          </div>
        </MaskLine>
      </div>
      <LightSweep at={70} />
      <Vignette strength={0.4} />
      <LogoBadge delay={4} />
      <Grain />
    </AbsoluteFill>
  );
};

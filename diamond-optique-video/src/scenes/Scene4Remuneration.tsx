import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {CONFIG} from '../config';
import {FloatingShapes, GoldParticles, Grain, LightSweep, Vignette} from '../components/FX';
import {MaskLine} from '../components/Kinetic';
import {LogoBadge} from '../components/LogoBadge';
import {Phone} from '../components/Phone';
import {clamp, ease, spr} from '../components/anim';
import {C, F} from '../theme';

const fmt = (n: number) => Math.round(n).toLocaleString('fr-FR').replace(/ | |,/g, ' ');

/** SCÈNE 4 — RÉMUNÉRATION (15–21 s) */
export const Scene4Remuneration: React.FC = () => {
  const f = useCurrentFrame();
  const phoneIn = spr(f, 0, 16, 0.9, 100);
  const count = interpolate(f, [14, 62], [0, CONFIG.gainMax], {...clamp, easing: ease});
  const done = f >= 62;
  const rotY = interpolate(f, [0, 180], [-22, 14]);
  const bigIn = spr(f, 60, 11);
  const bars = [0.35, 0.5, 0.42, 0.68, 0.8, 1];

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 50%, ${C.bordeaux} 0%, ${C.bordeauxDeep} 55%, ${C.bordeauxDark} 100%)`,
        overflow: 'hidden',
      }}
    >
      <FloatingShapes seed={4} palette={[C.gold, 'rgba(255,255,255,0.2)']} />
      <GoldParticles count={50} start={0} />
      <GoldParticles count={50} burst={62} />

      {/* Titre haut */}
      <div style={{position: 'absolute', top: 270, left: 0, right: 0, textAlign: 'center', zIndex: 5}}>
        <MaskLine delay={2}>
          <div style={{fontFamily: F.display, fontSize: 84, color: C.white, letterSpacing: 2}}>GAIN JUSQU’À</div>
        </MaskLine>
        <div
          style={{
            fontFamily: F.display,
            fontSize: 150,
            lineHeight: 1,
            color: C.gold,
            transform: `scale(${done ? bigIn : 0.001})`,
            textShadow: '0 0 50px rgba(255,201,40,0.6), 0 10px 0 rgba(0,0,0,0.25)',
          }}
        >
          {fmt(CONFIG.gainMax)} {CONFIG.devise}
        </div>
        <div
          style={{
            fontFamily: F.display,
            fontSize: 70,
            color: C.white,
            opacity: done ? bigIn : 0,
          }}
        >
          / JOUR
        </div>
      </div>

      {/* Téléphone 3D avec interface de gains */}
      <div
        style={{
          position: 'absolute',
          left: 540,
          top: 665,
          transform: `translate(-50%, ${(1 - phoneIn) * 900}px) scale(${0.85 + 0.15 * phoneIn})`,
          transformOrigin: 'top center',
        }}
      >
        <Phone width={340} rotY={rotY} rotX={6} glow={done ? 1 : 0.2}>
          <div style={{padding: '70px 28px 20px', fontFamily: F.body, color: C.ink, height: '100%', background: '#F6F3EE'}}>
            <div style={{fontWeight: 700, fontSize: 20, color: '#777'}}>Mes gains du jour</div>
            <div style={{fontWeight: 900, fontSize: 52, color: C.bordeaux, marginTop: 6}}>
              {fmt(count)} <span style={{fontSize: 24}}>F</span>
            </div>
            <div style={{fontSize: 15, fontWeight: 600, color: '#999'}}>Plafond : {fmt(CONFIG.gainMax)} F / jour</div>
            {/* graphique */}
            <div style={{display: 'flex', alignItems: 'flex-end', gap: 12, height: 170, marginTop: 24}}>
              {bars.map((b, i) => {
                const h = interpolate(f, [14 + i * 6, 34 + i * 6], [0, b], {...clamp, easing: ease});
                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${h * 100}%`,
                      borderRadius: 10,
                      background: i === bars.length - 1 ? C.gold : C.bordeaux,
                      opacity: 0.9,
                    }}
                  />
                );
              })}
            </div>
            {[
              ['Fixe', '1 000 F'],
              ['Pass transport', '✓'],
              ['Scan validé', '+100 F'],
            ].map(([k, v], i) => {
              const o = interpolate(f, [30 + i * 8, 40 + i * 8], [0, 1], clamp);
              return (
                <div
                  key={k}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    background: C.white,
                    borderRadius: 16,
                    padding: '14px 18px',
                    marginTop: i === 0 ? 24 : 10,
                    fontWeight: 700,
                    fontSize: 20,
                    opacity: o,
                    transform: `translateX(${(1 - o) * 40}px)`,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  }}
                >
                  <span>{k}</span>
                  <span style={{color: i === 2 ? '#1E9E5A' : C.navy}}>{v}</span>
                </div>
              );
            })}
          </div>
        </Phone>
      </div>

      {/* Détail */}
      <div
        style={{
          position: 'absolute',
          left: 60,
          right: 60,
          top: 1378,
          textAlign: 'center',
          opacity: interpolate(f, [70, 82], [0, 1], clamp),
          transform: `translateY(${interpolate(f, [70, 84], [40, 0], {...clamp, easing: ease})}px)`,
          zIndex: 5,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            background: C.gold,
            color: C.ink,
            fontFamily: F.body,
            fontWeight: 800,
            fontSize: 34,
            padding: '16px 26px',
            borderRadius: 20,
            boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
          }}
        >
          {CONFIG.detailGain}
        </div>
        <div style={{fontFamily: F.body, fontWeight: 600, fontSize: 26, color: 'rgba(255,255,255,0.85)', marginTop: 12}}>
          * {CONFIG.mentionGain}
        </div>
      </div>
      <LightSweep at={64} />
      <Vignette strength={0.4} />
      <LogoBadge delay={0} />
      <Grain />
    </AbsoluteFill>
  );
};

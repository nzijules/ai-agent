import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, Sequence, useCurrentFrame} from 'remotion';
import {Bokeh, Glow, LightRays} from '../components/Atmosphere';
import {Backdrop} from '../components/Backdrop';
import {CinematicCamera} from '../components/CinematicCamera';
import {Person, ProfileBust, Skyline} from '../components/Figures';
import {Caption, KineticHeadline} from '../components/KineticHeadline';
import {useLayout} from '../components/layout';
import {MediaSlot} from '../components/MediaSlot';
import {ParallaxScene} from '../components/ParallaxScene';
import {colors, fonts} from '../styles/theme';
import {useCues} from './shared';

const ease = Easing.bezier(0.33, 0, 0.2, 1);

/* ------------------------------------------------------------------ S01 */
/** S01 — Réveil à l'aube : travelling lent, lumière dorée qui se lève sur Abidjan. */
export const S01Dawn: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, vertical, u} = useLayout();
  const sunY = interpolate(frame, [0, 130], [height * 0.62, height * 0.5], {extrapolateRight: 'clamp', easing: ease});
  const rise = interpolate(frame, [20, 90], [height * 0.12, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const fallback = (
    <ParallaxScene
      travel={{x: vertical ? -90 : -160, y: 0}}
      zoomTravel={0.05}
      layers={[
        {depth: 0, content: <Backdrop from={['#0A1D45', '#1B3F7A', '#C98B52', '#E5B875']} to={['#123068', '#2A5CA0', '#E0A060', '#F3D29A']} />},
        {depth: 0.1, content: <Glow x={width * 0.62} y={sunY} size={width * 0.9} color={colors.gold} opacity={0.75} />},
        {
          depth: 0.25,
          content: (
            <div style={{position: 'absolute', left: -60, bottom: height * 0.3, width: width + 200}}>
              <Skyline width={width + 200} height={height * 0.32} color="#0B1C3C" windowsOn={0.25} seed="dawn" />
            </div>
          ),
        },
        // lagune Ébrié : reflets du soleil
        {
          depth: 0.28,
          content: (
            <div style={{position: 'absolute', left: -100, right: -100, bottom: 0, height: height * 0.3 + 2, background: 'linear-gradient(180deg, #2A4F86 0%, #16325E 60%, #0B1C3C 100%)'}}>
              {new Array(14).fill(0).map((_, i) => (
                <div key={i} style={{position: 'absolute', left: width * 0.62 - (60 + i * 18) * u + Math.sin(frame / 9 + i) * 10, top: 10 + i * 22 * u, width: (120 + i * 36) * u, height: 4, borderRadius: 2, background: colors.gold, opacity: 0.5 - i * 0.03}} />
              ))}
            </div>
          ),
        },
        {depth: 0.3, content: <LightRays x="62%" y={`${(sunY / height) * 100}%`} opacity={0.5} angle={170} />},
        // cadre de fenêtre (chambre)
        {
          depth: 0.9,
          content: (
            <AbsoluteFill>
              <div style={{position: 'absolute', inset: 0, border: `${90 * u}px solid #060E1E`, borderTopWidth: 140 * u}} />
              <div style={{position: 'absolute', left: '50%', top: 0, bottom: 0, width: 26 * u, background: '#060E1E', transform: 'translateX(-50%)'}} />
              <div style={{position: 'absolute', left: 0, right: 0, top: '42%', height: 20 * u, background: '#060E1E'}} />
              {/* rideau */}
              <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: width * 0.16, background: 'linear-gradient(90deg, #050B18, #0E1D38 70%, transparent)'}} />
            </AbsoluteFill>
          ),
        },
        // homme qui se lève (profil, premier plan)
        {
          depth: 1.35,
          content: (
            <div style={{position: 'absolute', left: vertical ? -width * 0.18 : width * 0.04, bottom: -height * 0.02, transform: `translateY(${rise}px)`}}>
              <ProfileBust size={vertical ? width * 0.95 : width * 0.42} rim={{color: colors.gold, side: 'right'}} />
            </div>
          ),
        },
        // table de chevet + réveil
        {
          depth: 1.6,
          content: (
            <div style={{position: 'absolute', right: vertical ? 40 * u : 120 * u, bottom: vertical ? 470 : 150 * u, fontFamily: fonts.display, fontWeight: 800, fontSize: 64 * u, color: colors.gold, opacity: interpolate(frame, [6, 24], [0, 0.85], {extrapolateRight: 'clamp'}), textShadow: `0 0 24px ${colors.gold}`, letterSpacing: '0.04em'}}>
              05:45
            </div>
          ),
        },
      ]}
    />
  );
  return (
    <MediaSlot
      id="S01"
      description="aube à Abidjan, homme 50-55 ans se levant, chambre, lumière dorée rasante (travelling lent)"
      camera={{zoom: [1.05, 1.14], x: [40, -40]}}
      fallback={fallback}
    />
  );
};

/* ------------------------------------------------------------------ S02 */
/**
 * S02 — Petit déjeuner : trois plans liés par un MATCH CUT circulaire
 * (tasse vue de dessus → cadran de montre → halo du soleil derrière la famille).
 */
export const S02Breakfast: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, vertical, u} = useLayout();
  const {at} = useCues('S02');
  const c1 = at(1) - 4;
  const c2 = at(2) - 4;
  const cx = width / 2;
  const cy = vertical ? height * 0.42 : height * 0.46;
  const R = (vertical ? 260 : 230) * u;
  // le cercle "morphe" d'un plan à l'autre
  const morph1 = interpolate(frame, [c1 - 4, c1 + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const morph2 = interpolate(frame, [c2 - 4, c2 + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const shot = frame < c1 ? 0 : frame < c2 ? 1 : 2;
  const handAngle = interpolate(frame, [c1, c2], [0, 300]);

  const cup = (
    <AbsoluteFill>
      <Backdrop from={['#3A2414', '#1E120A']} angle={160} radial={{x: '50%', y: '42%', color: '#8A5A33'}} />
      {/* table en bois, vue de dessus */}
      {new Array(9).fill(0).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: 0, right: 0, top: (i / 9) * height, height: 2, background: 'rgba(255,220,180,0.06)'}} />
      ))}
      <CinematicCamera zoom={[1.0, 1.12]} rotate={[-4, 2]}>
        <div style={{position: 'absolute', left: cx - R * 1.45, top: cy - R * 1.45, width: R * 2.9, height: R * 2.9, borderRadius: '50%', background: 'radial-gradient(circle, #F2EEE8 58%, #CFC6BA 62%, rgba(0,0,0,0.35) 70%, transparent 72%)'}} />
        <div style={{position: 'absolute', left: cx - R, top: cy - R, width: R * 2, height: R * 2, borderRadius: '50%', background: 'radial-gradient(circle at 45% 40%, #F7F3EE 0%, #E3DCD2 70%, #B9AE9F 100%)', boxShadow: '0 30px 60px rgba(0,0,0,0.45)'}} />
        <div style={{position: 'absolute', left: cx - R * 0.78, top: cy - R * 0.78, width: R * 1.56, height: R * 1.56, borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #8A5530 0%, #4A2714 60%, #2B160B 100%)'}} />
        {/* reflet du café */}
        <div style={{position: 'absolute', left: cx - R * 0.42, top: cy - R * 0.5, width: R * 0.5, height: R * 0.22, borderRadius: '50%', background: 'rgba(255,230,200,0.35)', transform: 'rotate(-20deg)'}} />
        {/* anse */}
        <div style={{position: 'absolute', left: cx + R * 0.92, top: cy - R * 0.22, width: R * 0.6, height: R * 0.44, borderRadius: R * 0.22, border: `${R * 0.12}px solid #E3DCD2`}} />
      </CinematicCamera>
      {/* vapeur */}
      {new Array(4).fill(0).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: cx - R * 0.4 + i * R * 0.25, top: cy - R * 1.2 - ((frame * 2 + i * 30) % 160) * u, width: R * 0.18, height: R * 0.8, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,255,255,0.18), transparent 70%)', opacity: 0.8 - ((frame * 2 + i * 30) % 160) / 200}} />
      ))}
    </AbsoluteFill>
  );

  const watch = (
    <AbsoluteFill>
      <Backdrop from={['#0E1B33', '#07162E']} angle={200} radial={{x: '50%', y: '45%', color: '#1D3E73'}} />
      {/* bracelet */}
      <div style={{position: 'absolute', left: cx - R * 0.55, top: 0, bottom: 0, width: R * 1.1, background: 'linear-gradient(90deg, #1A1410, #3A2A1E 50%, #1A1410)'}} />
      {/* poignet / manchette de chemise */}
      <div style={{position: 'absolute', left: 0, right: 0, top: cy + R * 1.25, bottom: 0, background: 'linear-gradient(180deg, #E8EDF4, #B7C3D3)', opacity: 0.9}} />
      <div style={{position: 'absolute', left: cx - R * (1 + 0.1 * (1 - morph1)), top: cy - R, width: R * 2, height: R * 2, borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #F5F7FA, #D8DEE8 70%, #9AA6B8)', border: `${14 * u}px solid #C9A86A`, boxShadow: '0 30px 60px rgba(0,0,0,0.6)'}}>
        {new Array(12).fill(0).map((_, i) => (
          <div key={i} style={{position: 'absolute', left: '50%', top: '50%', width: 6 * u, height: (i % 3 === 0 ? 34 : 18) * u, background: colors.navy, transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(${-R * 0.78}px)`}} />
        ))}
        <div style={{position: 'absolute', left: '50%', top: '50%', width: 10 * u, height: R * 0.5, background: colors.navy, transformOrigin: '50% 100%', transform: `translate(-50%, -100%) rotate(${handAngle / 12 + 40}deg)`, borderRadius: 6}} />
        <div style={{position: 'absolute', left: '50%', top: '50%', width: 6 * u, height: R * 0.72, background: colors.electric, transformOrigin: '50% 100%', transform: `translate(-50%, -100%) rotate(${handAngle}deg)`, borderRadius: 4}} />
        <div style={{position: 'absolute', left: '50%', top: '50%', width: 22 * u, height: 22 * u, borderRadius: '50%', background: colors.gold, transform: 'translate(-50%, -50%)'}} />
      </div>
    </AbsoluteFill>
  );

  const family = (
    <AbsoluteFill>
      <Backdrop from={['#F3D29A', '#C98B52', '#3A2414']} angle={180} />
      <Glow x={cx} y={cy} size={R * 2 * (1 + morph2 * 2.5)} color="#FFF1D6" opacity={0.9} />
      <CinematicCamera zoom={[1.08, 1.0]}>
        {/* famille assise : la table au premier plan masque le bas des corps */}
        <div style={{position: 'absolute', left: 0, right: 0, bottom: height * (vertical ? 0.36 : 0.3) - (vertical ? height * 0.12 : height * 0.2), display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: (vertical ? 4 : 40) * u}}>
          <Person kind="woman" height={height * (vertical ? 0.36 : 0.62)} rim={{color: '#FFE2B0', side: 'left'}} seed="w" />
          <Person kind="child" height={height * (vertical ? 0.24 : 0.42)} rim={{color: '#FFE2B0', side: 'left'}} seed="c1" />
          <Person kind="man" height={height * (vertical ? 0.4 : 0.68)} rim={{color: '#FFE2B0', side: 'right'}} seed="m" />
          <Person kind="teen" height={height * (vertical ? 0.3 : 0.52)} rim={{color: '#FFE2B0', side: 'right'}} seed="c2" />
        </div>
        {/* table */}
        <div style={{position: 'absolute', left: -50, right: -50, bottom: 0, height: height * (vertical ? 0.36 : 0.3), background: 'linear-gradient(180deg, #4A2C16, #120904)'}} />
        <div style={{position: 'absolute', left: -50, right: -50, bottom: height * (vertical ? 0.36 : 0.3) - 8, height: 16, background: '#7A5232'}} />
        {/* tasses et pain sur la table */}
        {[0.3, 0.46, 0.6, 0.74].map((x, i) => (
          <div key={i} style={{position: 'absolute', left: width * x - 34 * u, bottom: height * (vertical ? 0.36 : 0.3) + 4, width: 68 * u, height: 54 * u, borderRadius: `0 0 ${24 * u}px ${24 * u}px`, background: 'linear-gradient(90deg, #E8E1D6, #B9AE9F)'}} />
        ))}
      </CinematicCamera>
      <Bokeh count={14} seed="fam" color="#FFE7BF" opacity={0.4} />
    </AbsoluteFill>
  );

  const fallback = (
    <AbsoluteFill>
      {shot === 0 && cup}
      {shot >= 1 && <AbsoluteFill style={{opacity: shot === 1 ? 1 : 1 - morph2}}>{watch}</AbsoluteFill>}
      {shot === 2 && (
        <AbsoluteFill style={{WebkitMaskImage: `radial-gradient(circle at 50% ${(cy / height) * 100}%, #000 ${morph2 * 120}%, transparent ${morph2 * 120 + 8}%)`}}>
          {family}
        </AbsoluteFill>
      )}
      {/* flash du match cut */}
      <AbsoluteFill style={{background: '#FFF6E6', opacity: Math.max(0, 0.35 - Math.abs(frame - c1) * 0.08) + Math.max(0, 0.35 - Math.abs(frame - c2) * 0.06), mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
  return (
    <MediaSlot
      id="S02"
      description="petit déjeuner en famille à Abidjan : tasse (plongée), montre au poignet, famille à table — 3 plans en match cut"
      fallback={fallback}
    />
  );
};

/* ------------------------------------------------------------------ S03 */
const TASKS = ['Réunion client', 'École des enfants', 'Rapport', 'Maman', 'Équipe', 'Courses', 'Banque', 'Anniversaire', 'Voisins', 'Rendez-vous', 'Famille', 'Projet'];

/** S03 — Au travail : l'agenda se remplit pour tout le monde… sauf pour lui. */
export const S03Work: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, vertical, u, safe} = useLayout();
  const cols = vertical ? 3 : 4;
  const rows = vertical ? 5 : 3;
  const gridW = vertical ? width - safe.left * 2 : width * 0.52;
  const cellW = gridW / cols;
  const cellH = (vertical ? 128 : 120) * u;
  const gx = vertical ? safe.left : width * 0.42;
  const gy = vertical ? height * 0.27 : height * 0.22;
  const days = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];
  const n = cols * rows;
  const healthIndex = n - 1;
  const fallback = (
    <AbsoluteFill>
      <ParallaxScene
        travel={{x: -60, y: 0}}
        layers={[
          {depth: 0, content: <Backdrop from={['#0C2A5C', '#07162E']} angle={180} />},
          {
            depth: 0.2,
            blur: 6,
            content: (
              <div style={{position: 'absolute', left: 0, right: 0, top: height * 0.1}}>
                <Skyline width={width + 200} height={height * 0.4} color="#123368" windows="#7FB6F0" seed="office" reflection={false} windowsOn={0.5} />
              </div>
            ),
          },
          {
            depth: 0.6,
            blur: 3,
            content: (
              <div style={{position: 'absolute', left: vertical ? -width * 0.1 : width * 0.04, bottom: vertical ? height * 0.05 : -height * 0.05}}>
                <Person kind="man" height={vertical ? height * 0.6 : height * 1.0} rim={{color: colors.electric, side: 'right'}} seed="work" />
              </div>
            ),
          },
        ]}
      />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(7,22,46,0.2), rgba(7,22,46,0.65))'}} />
      {/* agenda en motion graphics */}
      <div style={{position: 'absolute', left: gx, top: gy, width: gridW}}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 14 * u}}>
          <span style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 40 * u, color: colors.white, letterSpacing: '0.04em'}}>AGENDA</span>
          <span style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 26 * u, color: colors.gold}}>Novembre</span>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 10 * u}}>
          {new Array(n).fill(0).map((_, i) => {
            const appear = 4 + i * (vertical ? 4 : 5);
            const s = interpolate(frame, [appear, appear + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)});
            const isHealth = i === healthIndex;
            const fade = isHealth ? interpolate(frame, [appear + 18, appear + 34], [1, 0.35], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
            return (
              <div key={i} style={{height: cellH, borderRadius: 14 * u, background: 'rgba(245,247,250,0.06)', border: '1px solid rgba(245,247,250,0.12)', padding: 10 * u, position: 'relative', overflow: 'hidden'}}>
                <div style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 18 * u, color: 'rgba(245,247,250,0.55)'}}>{days[i % 7]} {i + 3}</div>
                <div
                  style={{
                    marginTop: 8 * u,
                    padding: `${8 * u}px ${10 * u}px`,
                    borderRadius: 10 * u,
                    background: isHealth ? 'transparent' : i % 3 === 0 ? colors.electric : i % 3 === 1 ? colors.blue : '#C9A15F',
                    border: isHealth ? `2px dashed ${colors.gold}` : 'none',
                    color: isHealth ? colors.gold : colors.white,
                    fontFamily: fonts.body,
                    fontWeight: 600,
                    fontSize: 21 * u,
                    lineHeight: 1.15,
                    transform: `translateX(${(1 - s) * 40}px)`,
                    opacity: s * fade,
                  }}
                >
                  {isHealth ? 'Ma santé ?' : TASKS[i % TASKS.length]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
  return (
    <MediaSlot
      id="S03"
      description="homme au bureau (Plateau, Abidjan), téléphone, dossiers, collègues — lumière bleutée"
      fallback={fallback}
    />
  );
};

/* ------------------------------------------------------------------ S04 */
/** S04 — Seul, pensif, ambiance bleue : « ET VOTRE SANTÉ ? » */
export const S04Pensive: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, vertical, u, safe} = useLayout();
  const {at} = useCues('S04');
  const fallback = (
    <CinematicCamera zoom={[1.0, 1.1]} x={[0, vertical ? -30 : -60]}>
      <Backdrop from={['#0A2A63', '#07162E', '#030B19']} angle={160} radial={{x: '75%', y: '30%', color: '#1E5DB4'}} />
      {/* pluie sur la vitre */}
      {new Array(60).fill(0).map((_, i) => {
        const x = random(`r${i}`) * width;
        const len = 40 + random(`rl${i}`) * 90;
        const sp = 10 + random(`rs${i}`) * 12;
        const y = ((random(`ry${i}`) * height + frame * sp) % (height + 200)) - 100;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 2, height: len * u, background: 'linear-gradient(180deg, transparent, rgba(160,200,255,0.35))'}} />;
      })}
      <Bokeh count={16} seed="rain" color="#3E86E0" opacity={0.3} maxSize={160} />
      <div style={{position: 'absolute', left: vertical ? -width * 0.35 : width * 0.0, bottom: vertical ? height * 0.0 : -height * 0.08}}>
        <ProfileBust size={vertical ? width * 1.15 : width * 0.5} rim={{color: colors.electric, side: 'right', body: '#081226'}} />
      </div>
      <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(3,11,25,0.8), transparent 45%)'}} />
    </CinematicCamera>
  );
  return (
    <AbsoluteFill>
      <MediaSlot id="S04" description="homme seul, pensif, près d'une fenêtre, heure bleue — gros plan de profil" fallback={fallback} />
      <AbsoluteFill style={{justifyContent: vertical ? 'flex-start' : 'center', alignItems: vertical ? 'center' : 'flex-end', paddingTop: vertical ? safe.top + 60 : 0, paddingRight: vertical ? 0 : safe.right}}>
        <KineticHeadline
          text="ET VOTRE SANTÉ ?"
          at={at(0) + 8}
          size={(vertical ? 128 : 120) * u}
          accentWords={['SANTÉ']}
          accent={colors.electric}
          align={vertical ? 'center' : 'right'}
          maxWidth={vertical ? width - 2 * safe.left : width * 0.5}
          stagger={5}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export {Caption};

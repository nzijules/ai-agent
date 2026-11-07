import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {Bokeh, Glow, LightRays} from '../components/Atmosphere';
import {Backdrop, NavyBackdrop} from '../components/Backdrop';
import {BlueRibbon} from '../components/BlueRibbon';
import {CinematicCamera} from '../components/CinematicCamera';
import {EndCard} from '../components/EndCard';
import {Person, ProfileBust, Skyline} from '../components/Figures';
import {Caption, KineticHeadline} from '../components/KineticHeadline';
import {useLayout} from '../components/layout';
import {MediaSlot} from '../components/MediaSlot';
import {MedicalExplainer} from '../components/MedicalExplainer';
import {ParallaxScene} from '../components/ParallaxScene';
import {colors, fonts} from '../styles/theme';
import {useCues} from './shared';

const ease = Easing.bezier(0.33, 0, 0.2, 1);
const outEase = Easing.bezier(0.16, 1, 0.3, 1);
const clampI = (f: number, a: number[], b: number[], e = ease) =>
  interpolate(f, a, b, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

/** Zone de titre adaptative : haut de l'écran en vertical, colonne gauche en horizontal. */
const TitleZone: React.FC<React.PropsWithChildren<{align?: 'top' | 'center' | 'bottom'; side?: 'left' | 'right' | 'center'}>> = ({
  children, align = 'top', side = 'left',
}) => {
  const {vertical, safe, width} = useLayout();
  if (vertical) {
    return (
      <AbsoluteFill
        style={{
          padding: `${safe.top + 40}px ${safe.left}px ${safe.bottom + 120}px`,
          justifyContent: align === 'top' ? 'flex-start' : align === 'center' ? 'center' : 'flex-end',
          alignItems: 'center',
          gap: 24,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill
      style={{
        padding: `${safe.top}px ${safe.right}px ${safe.bottom}px ${safe.left}px`,
        justifyContent: 'center',
        alignItems: side === 'left' ? 'flex-start' : side === 'right' ? 'flex-end' : 'center',
        gap: 22,
      }}
    >
      <div style={{width: side === 'center' ? width * 0.8 : width * 0.44, display: 'flex', flexDirection: 'column', gap: 22, alignItems: side === 'right' ? 'flex-end' : side === 'center' ? 'center' : 'flex-start'}}>
        {children}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S05 */
/** S05 — Ruban bleu animé, révélation « CANCER DE LA PROSTATE ». */
export const S05Ribbon: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, vertical, u, safe} = useLayout();
  const {at} = useCues('S05');
  const ribbonSize = (vertical ? 330 : 300) * u;
  return (
    <AbsoluteFill>
      <CinematicCamera zoom={[1.0, 1.06]}>
        <NavyBackdrop />
        <Glow x={vertical ? width / 2 : width * 0.3} y={vertical ? height * 0.36 : height * 0.5} size={width * (vertical ? 1.2 : 0.7)} color={colors.blue} opacity={0.8} />
        <Bokeh count={22} seed="rib" color={colors.electric} opacity={0.3} />
      </CinematicCamera>
      {vertical ? (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: safe.top + 10}}>
          <BlueRibbon at={2} size={ribbonSize} drawFrames={38} />
          <div style={{height: 40 * u}} />
          <Caption text="Novembre Bleu · Côte d'Ivoire" at={at(0)} size={30 * u} upper color={colors.gold} weight={600} />
          <div style={{height: 26 * u}} />
          <KineticHeadline text="CANCER DE LA PROSTATE" at={at(1)} size={104 * u} maxWidth={width - 2 * safe.left} stagger={4} accentWords={['PROSTATE']} accent={colors.electric} />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{flexDirection: 'row', alignItems: 'center', padding: `0 ${safe.left}px`, gap: 90 * u}}>
          <BlueRibbon at={2} size={ribbonSize} drawFrames={38} />
          <div style={{display: 'flex', flexDirection: 'column', gap: 24 * u, width: width * 0.5}}>
            <Caption text="Novembre Bleu · Côte d'Ivoire" at={at(0)} size={28 * u} upper color={colors.gold} align="left" weight={600} />
            <KineticHeadline text="CANCER DE LA PROSTATE" at={at(1)} size={104 * u} align="left" maxWidth={width * 0.52} stagger={4} accentWords={['PROSTATE']} accent={colors.electric} />
          </div>
        </AbsoluteFill>
      )}
      {/* éclat à la fin du tracé du ruban */}
      <AbsoluteFill style={{background: colors.white, opacity: clampI(frame, [36, 40, 52], [0, 0.18, 0]), mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S06 */
/** S06 — Visualisation anatomique (schéma sagittal simplifié). */
export const S06Anatomy: React.FC = () => {
  const {width, height, vertical, u, safe} = useLayout();
  const {at} = useCues('S06');
  const size = vertical ? width - 2 * safe.left - 60 : height * 0.74;
  return (
    <AbsoluteFill>
      <CinematicCamera zoom={[1.0, 1.05]}>
        <Backdrop from={['#06132A', '#0A2048', '#06132A']} angle={180} radial={{x: '50%', y: '50%', color: '#123A78'}} />
        {/* grille technique discrète */}
        <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(39,140,224,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(39,140,224,0.07) 1px, transparent 1px)', backgroundSize: `${60 * u}px ${60 * u}px`}} />
      </CinematicCamera>
      <AbsoluteFill
        style={{
          flexDirection: vertical ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: vertical ? 'flex-start' : 'center',
          paddingTop: vertical ? safe.top + 30 : 0,
          gap: vertical ? 20 * u : 80 * u,
        }}
      >
        {!vertical && (
          <div style={{width: width * 0.3, display: 'flex', flexDirection: 'column', gap: 18 * u}}>
            <Caption text="Anatomie" at={4} size={28 * u} upper color={colors.gold} align="left" weight={600} />
            <KineticHeadline text="LA PROSTATE" at={8} size={92 * u} align="left" maxWidth={width * 0.3} />
            <Caption text="Une glande de l'appareil reproducteur masculin, située sous la vessie, autour de l'urètre." at={20} size={30 * u} align="left" color="rgba(245,247,250,0.85)" />
            <Caption text="Vue en coupe · schéma simplifié" at={40} size={22 * u} align="left" color="rgba(245,247,250,0.55)" />
          </div>
        )}
        {vertical && (
          <>
            <Caption text="Anatomie · vue en coupe" at={4} size={28 * u} upper color={colors.gold} weight={600} />
            <KineticHeadline text="LA PROSTATE" at={8} size={92 * u} />
          </>
        )}
        <div style={{marginRight: vertical ? 0 : 60 * u}}>
          <MedicalExplainer at={6} size={size} highlightAt={at(1)} labelScale={vertical ? 1.15 : 1} />
        </div>
        {vertical && <Caption text="Schéma simplifié" at={40} size={24 * u} color="rgba(245,247,250,0.55)" />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S07 */
/** S07 — Apparemment en bonne santé : « PARFOIS, AUCUN SYMPTÔME ». */
export const S07Healthy: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, vertical, u} = useLayout();
  const {at} = useCues('S07');
  // tracé cardiaque calme et régulier
  const ecg = React.useMemo(() => {
    const pts: string[] = [];
    const W = 1200;
    for (let x = 0; x <= W; x += 6) {
      const m = x % 300;
      let y = 0;
      if (m > 120 && m < 132) y = -(m - 120) * 2;
      else if (m >= 132 && m < 140) y = -24 + (m - 132) * 10;
      else if (m >= 140 && m < 150) y = 56 - (m - 140) * 7;
      else if (m > 190 && m < 230) y = -Math.sin(((m - 190) / 40) * Math.PI) * 12;
      pts.push(`${x},${100 + y}`);
    }
    return 'M ' + pts.join(' L ');
  }, []);
  const prog = clampI(frame, [0, 100], [0, 1], Easing.linear);
  const fallback = (
    <ParallaxScene
      travel={{x: vertical ? -50 : -120, y: 0}}
      layers={[
        {depth: 0, content: <Backdrop from={['#6FA8DC', '#2C6FBF', '#0B2A5C']} angle={180} radial={{x: '70%', y: '20%', color: '#F3D29A'}} />},
        {depth: 0.25, blur: 2, content: <div style={{position: 'absolute', left: -60, bottom: height * 0.22}}><Skyline width={width + 200} height={height * 0.34} color="#123A70" windowsOn={0.05} seed="day" /></div>},
        {depth: 0.4, content: <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: height * 0.24, background: 'linear-gradient(180deg, #0A2349, #050F22)'}} />},
        {
          depth: 1,
          content: (
            <div style={{position: 'absolute', left: vertical ? width * 0.5 - height * 0.12 : width * 0.62, bottom: height * 0.12}}>
              <Person kind="man" height={vertical ? height * 0.62 : height * 0.82} rim={{color: colors.gold, side: 'right'}} seed="healthy" />
            </div>
          ),
        },
      ]}
    />
  );
  return (
    <AbsoluteFill>
      <MediaSlot id="S07" description="homme 50-55 ans souriant, en forme, marche dans Abidjan (lumière de jour)" fallback={fallback} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(7,22,46,0.75), rgba(7,22,46,0.1) 45%, rgba(7,22,46,0.5))'}} />
      {/* ECG calme */}
      <svg viewBox="0 0 1200 200" width={width} height={width / 6} style={{position: 'absolute', left: 0, top: vertical ? height * 0.43 : height * 0.68, opacity: 0.85}}>
        <path d={ecg} fill="none" stroke={colors.electric} strokeWidth={4} strokeDasharray={4000} strokeDashoffset={4000 * (1 - prog)} />
      </svg>
      <TitleZone side="left">
        <KineticHeadline text="PARFOIS," at={6} size={(vertical ? 96 : 92) * u} align={vertical ? 'center' : 'left'} />
        <KineticHeadline text="AUCUN SYMPTÔME" at={14} size={(vertical ? 104 : 100) * u} align={vertical ? 'center' : 'left'} accentWords={['AUCUN', 'SYMPTÔME']} accent={colors.gold} />
        <Caption text="Pas de douleur · Pas de signe évident" at={at(0)} size={30 * u} align={vertical ? 'center' : 'left'} weight={600} />
      </TitleZone>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S08 */
/** S08 — Père et fils : âge et antécédents familiaux. */
export const S08Generations: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, vertical, u, safe} = useLayout();
  const {at, chunks} = useCues('S08');
  const second = chunks[1].startRel - 6;
  const ageP = clampI(frame, [at(0), at(0) + 50], [0, 1], outEase);
  const famP = clampI(frame, [second, second + 14], [0, 1]);
  const ages = [40, 45, 50, 55, 60, 65, 70];
  const gW = vertical ? width - 2 * safe.left : width * 0.42;
  const gH = (vertical ? 260 : 240) * u;
  const figH = vertical ? height * 0.4 : height * 0.62;
  const figures = (
    <div style={{display: 'flex', alignItems: 'flex-end', gap: (vertical ? 30 : 60) * u}}>
      <Person kind="elder" height={figH * 0.95} rim={{color: colors.gold, side: 'left'}} seed="elder" />
      <Person kind="man" height={figH} rim={{color: colors.gold, side: 'right'}} seed="man8" />
      <Person kind="teen" height={figH * 0.82} rim={{color: colors.gold, side: 'right'}} seed="teen" />
    </div>
  );
  const fallback = (
    <AbsoluteFill>
      <CinematicCamera zoom={[1.02, 1.1]} x={[0, -30]}>
        <Backdrop from={['#0A2350', '#07162E']} angle={180} radial={{x: '50%', y: vertical ? '62%' : '55%', color: '#6A4A22'}} />
        <Bokeh count={14} seed="gen" color={colors.gold} opacity={0.22} />
      </CinematicCamera>
      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: vertical ? 'center' : 'flex-end', paddingRight: vertical ? 0 : safe.right, paddingBottom: vertical ? safe.bottom - 80 : 0}}>
        <div style={{position: 'relative', opacity: 0.35 + 0.65 * famP}}>
          {figures}
          {/* liens de filiation */}
          <svg width="100%" height={60 * u} style={{position: 'absolute', left: 0, top: -70 * u, overflow: 'visible'}} viewBox="0 0 300 60" preserveAspectRatio="none">
            <path d="M 40 60 L 40 20 L 260 20 L 260 60 M 150 20 L 150 60" fill="none" stroke={colors.gold} strokeWidth={3} strokeDasharray={600} strokeDashoffset={600 * (1 - famP)} vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill>
      <MediaSlot id="S08" description="père (75 ans) et son fils (50-55 ans), avec le petit-fils — complicité, Abidjan" fallback={fallback} />
      <AbsoluteFill style={{background: vertical ? 'linear-gradient(180deg, rgba(7,22,46,0.85), rgba(7,22,46,0.0) 55%)' : 'linear-gradient(90deg, rgba(7,22,46,0.9), rgba(7,22,46,0) 60%)'}} />
      <TitleZone side="left">
        <div style={{position: 'relative', width: gW}}>
          {frame < second + 4 ? (
            <KineticHeadline text="LE RISQUE AUGMENTE AVEC L'ÂGE" at={at(0)} exitAt={second - 6} size={(vertical ? 82 : 74) * u} align={vertical ? 'center' : 'left'} maxWidth={gW} accentWords={["L'ÂGE"]} />
          ) : (
            <KineticHeadline text="ANTÉCÉDENTS FAMILIAUX" at={second} size={(vertical ? 86 : 78) * u} align={vertical ? 'center' : 'left'} maxWidth={gW} accentWords={['FAMILIAUX']} />
          )}
        </div>
        {/* courbe d'âge (qualitative, sans valeur chiffrée) */}
        <div style={{width: gW, height: gH, position: 'relative', opacity: 1 - famP}}>
          <svg viewBox="0 0 600 240" width={gW} height={gH} style={{overflow: 'visible'}}>
            <line x1={0} y1={210} x2={600} y2={210} stroke="rgba(245,247,250,0.35)" strokeWidth={2} />
            <path d="M 0 200 C 200 196 330 170 420 120 C 480 86 540 50 600 20" fill="none" stroke={colors.gold} strokeWidth={6} strokeLinecap="round" strokeDasharray={760} strokeDashoffset={760 * (1 - ageP)} />
            {ages.map((a, i) => (
              <text key={a} x={i * 100} y={236} fill="rgba(245,247,250,0.7)" fontSize={22} fontFamily={fonts.body} textAnchor="middle" opacity={clampI(frame, [at(0) + i * 5, at(0) + i * 5 + 8], [0, 1])}>
                {a}
              </text>
            ))}
            <text x={600} y={0} fill={colors.gold} fontSize={24} fontFamily={fonts.body} fontWeight={600} textAnchor="end" opacity={ageP}>risque</text>
          </svg>
          <div style={{fontFamily: fonts.body, fontSize: 20 * u, color: 'rgba(245,247,250,0.55)', marginTop: 4 * u, textAlign: vertical ? 'center' : 'left', opacity: ageP}}>Âge (ans) · représentation qualitative</div>
        </div>
      </TitleZone>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S09 */
/** S09 — Consultation médicale : « DÈS 45 ANS, PARLONS-EN ». */
export const S09Consultation: React.FC = () => {
  const {width, height, vertical, u} = useLayout();
  const {at} = useCues('S09');
  const figH = vertical ? height * 0.46 : height * 0.74;
  const fallback = (
    <ParallaxScene
      travel={{x: vertical ? -40 : -90, y: 0}}
      layers={[
        {depth: 0, content: <Backdrop from={['#DCE8F5', '#9DB8D8', '#47648C']} angle={180} radial={{x: '30%', y: '25%', color: '#FFF4DD'}} />},
        // fenêtre du cabinet
        {depth: 0.2, blur: 4, content: <div style={{position: 'absolute', left: width * 0.08, top: height * 0.08, width: width * 0.38, height: height * 0.4, background: 'linear-gradient(180deg, #F7FBFF, #C9DCF0)', borderRadius: 8, boxShadow: 'inset 0 0 0 14px #E6EEF7'}} />},
        {
          depth: 0.8,
          content: (
            <div style={{position: 'absolute', left: 0, right: vertical ? 0 : width * 0.06, bottom: vertical ? height * 0.2 : height * 0.06, display: 'flex', justifyContent: vertical ? 'center' : 'flex-end', alignItems: 'flex-end', gap: (vertical ? 60 : 160) * u}}>
              <Person kind="doctor" height={figH} rim={{color: '#FFFFFF', side: 'left', body: '#2A3B55'}} seed="doc" armRaise={0.35} />
              <Person kind="man" height={figH * 0.98} rim={{color: colors.gold, side: 'left'}} seed="patient" />
            </div>
          ),
        },
        // bureau au premier plan
        {depth: 1.3, content: <div style={{position: 'absolute', left: -100, right: -100, bottom: 0, height: vertical ? height * 0.22 : height * 0.16, background: 'linear-gradient(180deg, #6B4A2E, #3A2414)', borderTop: '6px solid #8A6440'}} />},
      ]}
    />
  );
  return (
    <AbsoluteFill>
      <MediaSlot id="S09" description="consultation : médecin ivoirien(ne) et patient de 50 ans en dialogue, cabinet à Abidjan, lumière douce" fallback={fallback} />
      <AbsoluteFill style={{background: vertical ? 'linear-gradient(180deg, rgba(7,22,46,0.9), rgba(7,22,46,0.0) 52%)' : 'linear-gradient(90deg, rgba(7,22,46,0.92), rgba(7,22,46,0.0) 58%)'}} />
      <TitleZone side="left">
        <KineticHeadline text="DÈS 45 ANS," at={at(0)} size={(vertical ? 118 : 110) * u} align={vertical ? 'center' : 'left'} accentWords={['45', 'ANS']} />
        <KineticHeadline text="PARLONS-EN" at={at(0) + 10} size={(vertical ? 118 : 110) * u} align={vertical ? 'center' : 'left'} color={colors.gold} />
        <Caption text="Parlez de votre risque avec un professionnel de santé" at={at(1)} size={(vertical ? 36 : 32) * u} align={vertical ? 'center' : 'left'} weight={600} style={{maxWidth: vertical ? 880 : width * 0.4}} />
      </TitleZone>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S10 */
/** S10 — Prélèvement sanguin : animation « PSA ». */
export const S10BloodTest: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, vertical, u, safe} = useLayout();
  const {at} = useCues('S10');
  const fill = clampI(frame, [at(2) - 10, at(2) + 40], [0, 1]);
  const psaP = clampI(frame, [at(2) + 30, at(2) + 50], [0, 1], outEase);
  const tubeH = (vertical ? 520 : 480) * u;
  const tubeW = tubeH * 0.24;
  const tube = (
    <div style={{position: 'relative', width: tubeW, height: tubeH, transform: `rotate(${vertical ? 0 : 12}deg)`}}>
      <div style={{position: 'absolute', left: -8 * u, right: -8 * u, top: 0, height: tubeH * 0.16, borderRadius: 10 * u, background: `linear-gradient(90deg, #0E3C86, ${colors.electric}, #0E3C86)`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: tubeH * 0.14, bottom: 0, borderRadius: `0 0 ${tubeW / 2}px ${tubeW / 2}px`, background: 'linear-gradient(90deg, rgba(255,255,255,0.18), rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.22))', border: '2px solid rgba(255,255,255,0.45)', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${fill * 78}%`, background: 'linear-gradient(90deg, #6E0E16, #A3192A 45%, #6E0E16)'}} />
        <div style={{position: 'absolute', left: '18%', top: '8%', width: '12%', height: '80%', borderRadius: 20, background: 'rgba(255,255,255,0.35)'}} />
      </div>
      {/* étiquette neutre (pas de nom de laboratoire) */}
      <div style={{position: 'absolute', left: 0, right: 0, top: tubeH * 0.42, height: tubeH * 0.18, background: 'rgba(245,247,250,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.display, fontWeight: 800, color: colors.navy, fontSize: 26 * u}}>
        PSA
      </div>
    </div>
  );
  // particules qui convergent pour former « PSA »
  const particles = new Array(40).fill(0).map((_, i) => {
    const sx = (random(`px${i}`) - 0.5) * width;
    const sy = (random(`py${i}`) - 0.5) * height * 0.6;
    const k = clampI(frame, [at(2) + 10 + i * 0.5, at(2) + 36 + i * 0.5], [0, 1], outEase);
    return {x: sx * (1 - k), y: sy * (1 - k), o: (1 - k) * 0.9 * clampI(frame, [at(2), at(2) + 8], [0, 1])};
  });
  return (
    <AbsoluteFill>
      <CinematicCamera zoom={[1.02, 1.12]}>
        <Backdrop from={['#0B2A5C', '#07162E']} angle={180} radial={{x: '50%', y: '45%', color: '#1E4E96'}} />
        <Bokeh count={18} seed="lab" color="#8FC3F5" opacity={0.25} />
      </CinematicCamera>
      <TitleZone side="left">
        <Caption text="Selon votre situation" at={at(0)} exitAt={at(2) - 8} size={(vertical ? 40 : 36) * u} align={vertical ? 'center' : 'left'} upper color={colors.gold} weight={600} />
        <KineticHeadline text="UN DÉPISTAGE ADAPTÉ" at={at(1)} exitAt={at(2) - 8} size={(vertical ? 96 : 88) * u} align={vertical ? 'center' : 'left'} accentWords={['ADAPTÉ']} accent={colors.electric} />
        <Caption text="Proposé, si besoin, par un professionnel de santé" at={at(1) + 16} exitAt={at(2) - 8} size={(vertical ? 32 : 30) * u} align={vertical ? 'center' : 'left'} />
      </TitleZone>
      <AbsoluteFill style={{flexDirection: vertical ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: (vertical ? 50 : 120) * u, paddingTop: vertical ? safe.top : 0, paddingBottom: vertical ? safe.bottom - 40 : 0, opacity: clampI(frame, [at(2) - 12, at(2)], [0, 1])}}>
        <div style={{transform: `translateY(${(1 - clampI(frame, [at(2) - 12, at(2) + 8], [0, 1], outEase)) * 80}px)`}}>{tube}</div>
        <div style={{position: 'relative', display: 'flex', flexDirection: 'column', alignItems: vertical ? 'center' : 'flex-start'}}>
          {particles.map((p, i) => (
            <div key={i} style={{position: 'absolute', left: '50%', top: '40%', width: 10 * u, height: 10 * u, borderRadius: '50%', background: i % 3 ? colors.electric : colors.gold, transform: `translate(${p.x}px, ${p.y}px)`, opacity: p.o}} />
          ))}
          <div style={{fontFamily: fonts.display, fontWeight: 800, fontSize: (vertical ? 260 : 240) * u, lineHeight: 0.9, color: colors.white, letterSpacing: `${(1 - psaP) * 0.4 - 0.02}em`, opacity: psaP, filter: `blur(${(1 - psaP) * 14}px)`, textShadow: `0 0 60px ${colors.electric}`}}>
            PSA
          </div>
          <Caption text="Antigène prostatique spécifique" at={at(2) + 44} size={(vertical ? 36 : 34) * u} align={vertical ? 'center' : 'left'} weight={600} color={colors.gold} />
          <Caption text="Dosage par une prise de sang" at={at(2) + 52} size={(vertical ? 30 : 28) * u} align={vertical ? 'center' : 'left'} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Signe « différent de » dessiné en SVG (indépendant des polices). */
const NotEqual: React.FC<{size: number; at: number}> = ({size, at}) => {
  const frame = useCurrentFrame();
  const p1 = clampI(frame, [at, at + 10], [0, 1]);
  const p2 = clampI(frame, [at + 8, at + 18], [0, 1]);
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <line x1={14} y1={38} x2={86} y2={38} stroke={colors.white} strokeWidth={11} strokeLinecap="round" strokeDasharray={72} strokeDashoffset={72 * (1 - p1)} />
      <line x1={14} y1={64} x2={86} y2={64} stroke={colors.white} strokeWidth={11} strokeLinecap="round" strokeDasharray={72} strokeDashoffset={72 * (1 - p1)} />
      <line x1={66} y1={8} x2={34} y2={94} stroke={colors.gold} strokeWidth={11} strokeLinecap="round" strokeDasharray={92} strokeDashoffset={92 * (1 - p2)} />
    </svg>
  );
};

/* ------------------------------------------------------------------ S11 */
/** S11 — Explication du médecin : « PSA ≠ DIAGNOSTIC ». */
export const S11NotDiagnosis: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, vertical, u, safe} = useLayout();
  const {at, chunks} = useCues('S11');
  const l13 = chunks[3].startRel;
  const big = (vertical ? 150 : 140) * u;
  const fallback = (
    <AbsoluteFill>
      <CinematicCamera zoom={[1.06, 1.0]} x={[20, -20]}>
        <Backdrop from={['#0F3470', '#07162E']} angle={180} radial={{x: vertical ? '50%' : '78%', y: '60%', color: '#2A5FA8'}} />
        <div style={{position: 'absolute', left: vertical ? width * 0.5 - height * 0.08 : width * 0.66, bottom: vertical ? -height * 0.02 : -height * 0.1, filter: 'blur(5px)', opacity: 0.8}}>
          <Person kind="doctor" height={vertical ? height * 0.5 : height * 1.0} rim={{color: '#FFFFFF', side: 'left', body: '#2A3B55'}} seed="doc11" armRaise={0.5} />
        </div>
      </CinematicCamera>
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill>
      <MediaSlot id="S11" description="médecin expliquant un résultat à son patient (tablette / feuille), plan rapproché, flou d'arrière-plan" fallback={fallback} />
      <AbsoluteFill style={{background: vertical ? 'linear-gradient(180deg, rgba(7,22,46,0.92), rgba(7,22,46,0.25) 70%)' : 'linear-gradient(90deg, rgba(7,22,46,0.94), rgba(7,22,46,0.1) 70%)'}} />
      <TitleZone side="left">
        <div style={{display: 'flex', alignItems: 'center', gap: 20 * u, flexWrap: 'wrap', justifyContent: vertical ? 'center' : 'flex-start'}}>
          <KineticHeadline text="PSA" at={at(0)} size={big} shadow />
          <NotEqual size={big * 0.85} at={at(0) + 8} />
        </div>
        <KineticHeadline text="DIAGNOSTIC" at={at(1)} size={(vertical ? 118 : 112) * u} align={vertical ? 'center' : 'left'} color={colors.gold} />
        <Caption text="Ce test seul ne permet pas de poser un diagnostic. Un résultat s'interprète avec un professionnel de santé ; d'autres examens peuvent être nécessaires." at={at(2) + 4} size={(vertical ? 32 : 28) * u} align={vertical ? 'center' : 'left'} style={{maxWidth: vertical ? 900 : width * 0.42}} />
        <div style={{display: 'flex', alignItems: 'center', gap: 14 * u, marginTop: 10 * u, opacity: clampI(frame, [l13, l13 + 12], [0, 1]), transform: `translateY(${(1 - clampI(frame, [l13, l13 + 14], [0, 1], outEase)) * 20}px)`}}>
          <div style={{width: 18 * u, height: 18 * u, borderRadius: '50%', background: colors.electric, boxShadow: `0 0 20px ${colors.electric}`}} />
          <div style={{fontFamily: fonts.body, fontWeight: 700, fontSize: (vertical ? 34 : 30) * u, color: colors.white}}>Un outil pour la détection précoce</div>
        </div>
      </TitleZone>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: safe.bottom}} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S12 */
/** S12 — Détection précoce, éclairage rassurant ; puis appel à en parler. */
export const S12EarlyDetection: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, vertical, u, safe} = useLayout();
  const {at, chunks} = useCues('S12');
  const beatB = chunks[2].startRel - 10; // « Alors, … »
  const light = clampI(frame, [0, beatB], [0, 1]);
  const bP = clampI(frame, [beatB, beatB + 16], [0, 1]);
  const lineW = vertical ? width - 2 * safe.left : width * 0.42;
  return (
    <AbsoluteFill>
      <CinematicCamera zoom={[1.0, 1.08]}>
        <Backdrop from={['#0B2A5C', '#1C4F96', '#C98B52']} to={['#1E4E96', '#4F86C6', '#F3D29A']} angle={180} />
        <Glow x={width * 0.5} y={height * (vertical ? 0.78 : 0.85)} size={width * (1.2 + light)} color={colors.gold} opacity={0.4 + 0.4 * light} />
        <LightRays x="50%" y={vertical ? '80%' : '90%'} opacity={0.3 + 0.3 * light} angle={-30} />
        <Bokeh count={20} seed="hope" color="#FFE2B0" opacity={0.25} />
      </CinematicCamera>
      <AbsoluteFill style={{background: vertical ? 'linear-gradient(180deg, rgba(7,22,46,0.82), rgba(7,22,46,0.0) 55%)' : 'linear-gradient(90deg, rgba(7,22,46,0.85), rgba(7,22,46,0.0) 55%)'}} />
      {/* BEAT A — détection précoce */}
      <AbsoluteFill style={{opacity: 1 - bP}}>
        <TitleZone side="left">
          <KineticHeadline text="DÉTECTION PRÉCOCE" at={at(0)} size={(vertical ? 104 : 96) * u} align={vertical ? 'center' : 'left'} maxWidth={lineW} accentWords={['PRÉCOCE']} accent={colors.gold} />
          {/* frise : plus tôt → plus de possibilités */}
          <div style={{width: lineW, marginTop: 20 * u}}>
            <svg viewBox="0 0 600 120" width={lineW} height={lineW * 0.2} style={{overflow: 'visible'}}>
              <defs>
                <linearGradient id="s12-line" x1="0" x2="1">
                  <stop offset="0" stopColor={colors.gold} />
                  <stop offset="1" stopColor="rgba(245,247,250,0.25)" />
                </linearGradient>
              </defs>
              <line x1={20} y1={60} x2={580} y2={60} stroke="url(#s12-line)" strokeWidth={6} strokeLinecap="round" strokeDasharray={560} strokeDashoffset={560 * (1 - clampI(frame, [at(0) + 6, at(0) + 40], [0, 1]))} />
              <circle cx={60} cy={60} r={18 + Math.sin(frame / 6) * 3} fill={colors.gold} opacity={clampI(frame, [at(0) + 10, at(0) + 20], [0, 1])} />
              <circle cx={60} cy={60} r={36} fill="none" stroke={colors.gold} strokeOpacity={0.4} strokeWidth={3} opacity={clampI(frame, [at(0) + 10, at(0) + 20], [0, 1])} />
              <text x={60} y={120} textAnchor="middle" fill={colors.white} fontFamily={fonts.body} fontWeight={600} fontSize={26} opacity={clampI(frame, [at(0) + 16, at(0) + 26], [0, 1])}>Stade précoce</text>
            </svg>
          </div>
          <Caption text="Des possibilités de traitement souvent meilleures" at={at(1)} size={(vertical ? 36 : 32) * u} align={vertical ? 'center' : 'left'} weight={600} style={{maxWidth: lineW}} />
        </TitleZone>
      </AbsoluteFill>
      {/* BEAT B — en parler */}
      <AbsoluteFill style={{opacity: bP}}>
        <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: vertical ? 'center' : 'flex-end', paddingRight: vertical ? 0 : safe.right + 40, paddingBottom: vertical ? safe.bottom - 60 : 0}}>
          <div style={{display: 'flex', alignItems: 'flex-end', gap: 70 * u, transform: `translateX(${(1 - bP) * 60}px)`}}>
            <Person kind="man" height={vertical ? height * 0.4 : height * 0.72} rim={{color: colors.gold, side: 'right'}} seed="talk1" armRaise={0.3} />
            <Person kind="doctor" height={vertical ? height * 0.41 : height * 0.74} rim={{color: '#FFFFFF', side: 'left', body: '#2A3B55'}} seed="talk2" />
          </div>
        </AbsoluteFill>
        <TitleZone side="left">
          {frame >= beatB && (
            <>
              <KineticHeadline text="PARLEZ-EN" at={beatB + 6} size={(vertical ? 130 : 120) * u} align={vertical ? 'center' : 'left'} color={colors.white} />
              <Caption text="sans attendre forcément les premiers symptômes" at={beatB + 18} size={(vertical ? 36 : 32) * u} align={vertical ? 'center' : 'left'} weight={600} color={colors.gold} style={{maxWidth: lineW}} />
            </>
          )}
        </TitleZone>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S13 */
/** S13 — Couple : retour de la lumière. */
export const S13Couple: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, vertical, u} = useLayout();
  const {at, chunks} = useCues('S13');
  const l17 = chunks[1].startRel;
  const light = clampI(frame, [0, 120], [0, 1]);
  const figH = vertical ? height * 0.5 : height * 0.82;
  const fallback = (
    <ParallaxScene
      travel={{x: vertical ? -40 : -100, y: 0}}
      zoomTravel={0.05}
      layers={[
        {depth: 0, content: <Backdrop from={['#123068', '#C98B52', '#F3D29A']} to={['#2A5CA0', '#E0A060', '#FFF1D6']} angle={0} />},
        {depth: 0.1, content: <Glow x={vertical ? width * 0.5 : width * 0.3} y={height * 0.42} size={width * (0.8 + light * 0.8)} color="#FFF1D6" opacity={0.6 + 0.3 * light} />},
        {depth: 0.2, content: <LightRays x={vertical ? '50%' : '30%'} y="42%" opacity={0.25 + 0.35 * light} angle={150} />},
        {depth: 0.3, blur: 2, content: <div style={{position: 'absolute', left: -60, bottom: height * 0.2}}><Skyline width={width + 200} height={height * 0.25} color="#5A3A22" windowsOn={0} seed="couple" /></div>},
        {
          depth: 1,
          content: (
            <div style={{position: 'absolute', left: vertical ? width * 0.5 - figH * 0.36 : width * 0.62, bottom: vertical ? height * 0.12 : -height * 0.04, display: 'flex', alignItems: 'flex-end', gap: 0}}>
              <Person kind="man" height={figH} rim={{color: '#FFE2B0', side: 'left'}} seed="hus" />
              <div style={{marginLeft: -figH * 0.08}}>
                <Person kind="woman" height={figH * 0.93} rim={{color: '#FFE2B0', side: 'left'}} seed="wife" />
              </div>
            </div>
          ),
        },
      ]}
    />
  );
  return (
    <AbsoluteFill>
      <MediaSlot id="S13" description="couple ivoirien (50 ans) sur une terrasse au lever du soleil, sourires, complicité" fallback={fallback} />
      <AbsoluteFill style={{background: vertical ? 'linear-gradient(180deg, rgba(7,22,46,0.7), rgba(7,22,46,0) 45%)' : 'linear-gradient(90deg, rgba(7,22,46,0.75), rgba(7,22,46,0) 55%)'}} />
      <TitleZone side="left">
        {frame < l17 + 4 ? (
          <KineticHeadline text="CE N'EST PAS UNE FAIBLESSE." at={at(0) + 30} exitAt={l17 - 6} size={(vertical ? 88 : 80) * u} align={vertical ? 'center' : 'left'} maxWidth={vertical ? 920 : width * 0.44} />
        ) : (
          <KineticHeadline text="C'EST UNE RESPONSABILITÉ." at={l17} size={(vertical ? 88 : 80) * u} align={vertical ? 'center' : 'left'} accentWords={['RESPONSABILITÉ']} accent={colors.gold} maxWidth={vertical ? 920 : width * 0.44} />
        )}
      </TitleZone>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S14 */
/** S14 — Famille intergénérationnelle : climax émotionnel. */
export const S14Family: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, vertical, u} = useLayout();
  const {at} = useCues('S14');
  const figH = vertical ? height * 0.38 : height * 0.62;
  const fallback = (
    <AbsoluteFill>
      <CinematicCamera zoom={[1.12, 1.0]}>
        <Backdrop from={['#FFF1D6', '#F3D29A', '#C98B52', '#3A2414']} angle={180} />
        <Glow x={width / 2} y={height * 0.45} size={width * 1.6} color="#FFFFFF" opacity={0.7} />
        <LightRays x="50%" y="40%" opacity={0.5} angle={160} />
        <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: vertical ? height * 0.14 : 0}}>
          <div style={{display: 'flex', alignItems: 'flex-end', gap: (vertical ? 0 : 16) * u}}>
            <Person kind="elder" height={figH * 0.95} rim={{color: '#FFFFFF', side: 'right'}} seed="f1" />
            <Person kind="woman" height={figH * 0.93} rim={{color: '#FFFFFF', side: 'right'}} seed="f2" />
            <Person kind="child" height={figH * 0.5} rim={{color: '#FFFFFF', side: 'right'}} seed="f3" />
            <Person kind="man" height={figH} rim={{color: '#FFFFFF', side: 'left'}} seed="f4" />
            <Person kind="teen" height={figH * 0.78} rim={{color: '#FFFFFF', side: 'left'}} seed="f5" />
          </div>
        </AbsoluteFill>
      </CinematicCamera>
      <Bokeh count={26} seed="climax" color="#FFF1D6" opacity={0.5} drift={0.8} />
    </AbsoluteFill>
  );
  const lines = ['POUR VOUS.', 'POUR CEUX QUI VOUS AIMENT.', 'POUR DEMAIN.'];
  return (
    <AbsoluteFill>
      <MediaSlot id="S14" description="famille intergénérationnelle (grands-parents, couple, enfants) réunie, lumière dorée, joie" fallback={fallback} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(7,22,46,0.72), rgba(7,22,46,0.05) 50%)'}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', paddingTop: vertical ? 300 : 110 * u, gap: 6 * u}}>
        {lines.map((l, i) => (
          <KineticHeadline
            key={l}
            text={l}
            at={at(i)}
            size={(vertical ? (i === 1 ? 74 : 92) : i === 1 ? 72 : 88) * u}
            color={i === 2 ? colors.gold : colors.white}
            maxWidth={vertical ? 940 : width * 0.8}
            stagger={3}
          />
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{background: '#FFF6E6', opacity: clampI(frame, [at(2), at(2) + 4, at(2) + 20], [0, 0.12, 0]), mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S15 */
/** S15 — Ruban bleu, signature Novembre Bleu, emplacement du logo institutionnel. */
export const S15Signature: React.FC = () => {
  const {durationInFrames} = useVideoConfig();
  const {at} = useCues('S15');
  return <EndCard titleAt={at(0)} taglineAt={at(1)} brandAt={at(2)} duration={durationInFrames} />;
};

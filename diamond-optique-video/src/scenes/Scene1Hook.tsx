import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Bokeh, Grain, Vignette} from '../components/FX';
import {PunchWord} from '../components/Kinetic';
import {LogoBadge} from '../components/LogoBadge';
import {clamp, easeIn, easeInOut} from '../components/anim';
import {C, F} from '../theme';

/** SCÈNE 1 — HOOK (0–4 s) : travelling rapide vers le jeune homme, texte mot par mot, zoom à travers l'écran */
export const Scene1Hook: React.FC = () => {
  const f = useCurrentFrame();
  // Image source 2048x1152 — affichée en hauteur pleine (1920) => 3413 px de large
  const push = interpolate(f, [0, 96], [1.0, 1.32], {...clamp, easing: easeInOut});
  const dive = interpolate(f, [92, 120], [1, 5.5], {...clamp, easing: easeIn});
  const scale = push * dive;
  // point focal : le téléphone (≈ 51 % / 66 % de l'image)
  const panX = interpolate(f, [0, 96], [-80, 0], {...clamp, easing: easeInOut});
  const blur = interpolate(f, [96, 118], [0, 10], clamp);
  // écran du téléphone qui devient bordeaux et envahit le cadre
  const screen = interpolate(f, [100, 118], [0, 1], {...clamp, easing: easeIn});
  const textOut = interpolate(f, [88, 100], [1, 0], clamp);

  return (
    <AbsoluteFill style={{background: C.navyDeep, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          transform: `translateX(${panX}px) scale(${scale})`,
          transformOrigin: '540px 1260px',
          filter: `blur(${blur}px)`,
        }}
      >
        <Img
          src={staticFile('img/ai-hook.jpg')}
          style={{position: 'absolute', height: 1920, width: 3413, left: 540 - 3413 * 0.51, top: 0}}
        />
      </AbsoluteFill>
      <Bokeh drift={5} />
      {/* dégradé pour la lisibilité du titre */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(10,22,54,0.85) 0%, rgba(10,22,54,0.35) 38%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)',
        }}
      />
      <Vignette strength={0.5} />

      <div
        style={{
          position: 'absolute',
          top: 300,
          left: 60,
          right: 60,
          textAlign: 'center',
          fontFamily: F.display,
          color: C.white,
          lineHeight: 0.98,
          textTransform: 'uppercase',
          opacity: textOut,
          textShadow: '0 8px 30px rgba(0,0,0,0.45)',
        }}
      >
        <div style={{fontSize: 128}}>
          <PunchWord delay={8}>TU</PunchWord> <PunchWord delay={18}>CHERCHES</PunchWord>
        </div>
        <div style={{fontSize: 128}}>
          <PunchWord delay={28}>UNE</PunchWord>
        </div>
        <div style={{fontSize: 150, color: C.gold}}>
          <PunchWord delay={40}>OPPORTUNITÉ&nbsp;?</PunchWord>
        </div>
      </div>

      {/* plongée dans l'écran du smartphone */}
      <div
        style={{
          position: 'absolute',
          left: 540,
          top: 1260,
          width: 1080 * 2.6 * screen + 20,
          height: 1920 * 2.6 * screen + 40,
          transform: 'translate(-50%,-50%)',
          borderRadius: 60 * (1 - screen) + 10,
          background: `radial-gradient(circle, ${C.bordeaux}, ${C.bordeauxDeep})`,
          opacity: screen > 0 ? 1 : 0,
        }}
      />
      <LogoBadge hide={96} />
      <Grain />
    </AbsoluteFill>
  );
};

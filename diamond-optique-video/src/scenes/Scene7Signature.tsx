import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {CONFIG} from '../config';
import {GoldParticles} from '../components/FX';
import {clamp, ease, easeInOut, spr} from '../components/anim';
import {C, F} from '../theme';

/** SCÈNE 7 — SIGNATURE (32–35 s) : fond blanc, losange doré, halo traversant le logo */
export const Scene7Signature: React.FC = () => {
  const f = useCurrentFrame();
  const white = interpolate(f, [0, 14], [0, 1], {...clamp, easing: easeInOut});
  const logo = spr(f, 8, 13);
  const draw = interpolate(f, [2, 30], [0, 1], {...clamp, easing: ease});
  const halo = interpolate(f, [26, 54], [-0.3, 1.3], clamp);
  const footer = interpolate(f, [34, 46], [0, 1], clamp);
  const rr = white * 1400;
  const logoUrl = staticFile('img/logo-diamond-optique.png');

  return (
    <AbsoluteFill style={{background: C.navyDeep, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: '#fff', clipPath: `circle(${rr}px at 540px 900px)`}}>
        <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 47%, #FFF8E1 0%, #FFFFFF 55%)'}} />
        {/* losange doré qui se dessine */}
        <svg width={1080} height={1920} style={{position: 'absolute'}}>
          <polygon
            points="540,520 860,900 540,1280 220,900"
            fill="none"
            stroke={C.gold}
            strokeWidth={5}
            strokeDasharray={2000}
            strokeDashoffset={2000 * (1 - draw)}
            opacity={0.8}
          />
          <polygon
            points="540,560 820,900 540,1240 260,900"
            fill="none"
            stroke={C.bordeaux}
            strokeWidth={2}
            strokeDasharray={1800}
            strokeDashoffset={1800 * (1 - draw)}
            opacity={0.4}
          />
        </svg>
        {/* logo officiel + halo doré masqué par la forme du logo */}
        <div
          style={{
            position: 'absolute',
            left: 540,
            top: 900,
            width: 860,
            transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * logo})`,
            opacity: logo,
          }}
        >
          <Img src={logoUrl} style={{width: '100%', display: 'block'}} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              WebkitMaskImage: `url(${logoUrl})`,
              WebkitMaskSize: '100% 100%',
              maskImage: `url(${logoUrl})`,
              maskSize: '100% 100%',
              background: `linear-gradient(100deg, rgba(255,215,90,0) ${halo * 100 - 14}%, rgba(255,220,110,0.95) ${halo * 100}%, rgba(255,215,90,0) ${halo * 100 + 14}%)`,
            }}
          />
        </div>
        <GoldParticles count={40} burst={24} />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 1330,
            textAlign: 'center',
            opacity: footer,
            transform: `translateY(${(1 - footer) * 20}px)`,
          }}
        >
          <div style={{fontFamily: F.body, fontWeight: 700, fontSize: 32, color: C.navy}}>Candidature par WhatsApp</div>
          <div style={{fontFamily: F.display, fontSize: 60, color: C.bordeaux, marginTop: 4}}>{CONFIG.whatsapp}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Bokeh, Grain, LightSweep, Vignette} from '../components/FX';
import {MaskLine} from '../components/Kinetic';
import {LogoBadge} from '../components/LogoBadge';
import {clamp, easeInOut} from '../components/anim';
import {C, F} from '../theme';

const IMG_W = 3413; // 2048x1152 affiché à 1920 de haut

const Plate: React.FC<{src: string; fromX: number; toX: number; zoomFrom: number; zoomTo: number; start: number; end: number}> = ({
  src,
  fromX,
  toX,
  zoomFrom,
  zoomTo,
  start,
  end,
}) => {
  const f = useCurrentFrame();
  // fromX/toX : position horizontale (0–1) du centre du cadre dans l'image
  const cx = interpolate(f, [start, end], [fromX, toX], {...clamp, easing: easeInOut});
  const z = interpolate(f, [start, end], [zoomFrom, zoomTo], clamp);
  return (
    <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '540px 960px'}}>
      <Img src={staticFile(src)} style={{position: 'absolute', height: 1920, width: IMG_W, top: 0, left: 540 - IMG_W * cx}} />
    </AbsoluteFill>
  );
};

/** SCÈNE 5 — OPPORTUNITÉ PROFESSIONNELLE (21–26 s) */
export const Scene5Opportunite: React.FC = () => {
  const f = useCurrentFrame();
  // transition par masque circulaire (morphing) entre les deux plans
  const reveal = interpolate(f, [68, 88], [0, 1], {...clamp, easing: easeInOut});
  const r = reveal * 1300;

  return (
    <AbsoluteFill style={{background: C.navyDeep, overflow: 'hidden'}}>
      {/* Plan A : promotrice + client */}
      <Plate src="img/ai-promotrice.jpg" fromX={0.36} toX={0.6} zoomFrom={1.08} zoomTo={1.18} start={0} end={88} />
      {/* Plan B : équipe commerciale, révélé par cercle */}
      <AbsoluteFill style={{clipPath: `circle(${r}px at 540px 1000px)`}}>
        <Plate src="img/ai-equipe.jpg" fromX={0.3} toX={0.66} zoomFrom={1.15} zoomTo={1.04} start={68} end={150} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,22,54,0) 50%, rgba(10,22,54,0.9) 100%)'}} />
      </AbsoluteFill>
      {/* anneau doré qui accompagne la révélation */}
      {reveal > 0 && reveal < 1 && (
        <div
          style={{
            position: 'absolute',
            left: 540 - r,
            top: 1000 - r,
            width: r * 2,
            height: r * 2,
            borderRadius: '50%',
            border: `14px solid ${C.gold}`,
            boxShadow: `0 0 60px ${C.gold}`,
          }}
        />
      )}
      <Bokeh drift={2} count={8} />
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(10,22,54,0.55) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 55%, rgba(10,22,54,0.85) 100%)',
        }}
      />

      {/* Texte A */}
      <div style={{position: 'absolute', left: 60, right: 60, top: 1130}}>
        <MaskLine delay={8} out={64}>
          <div style={{fontFamily: F.body, fontWeight: 800, fontSize: 36, color: C.gold, letterSpacing: 4}}>SUR LE TERRAIN</div>
        </MaskLine>
        <MaskLine delay={12} out={62}>
          <div style={{fontFamily: F.display, fontSize: 124, color: C.white, lineHeight: 0.95}}>UNE EXPÉRIENCE</div>
        </MaskLine>
        <MaskLine delay={16} out={60}>
          <div style={{fontFamily: F.display, fontSize: 124, color: C.white, lineHeight: 0.95}}>
            <span style={{background: C.bordeaux, padding: '0 18px', borderRadius: 12}}>TERRAIN</span>
          </div>
        </MaskLine>
      </div>

      {/* Texte B */}
      <div style={{position: 'absolute', left: 60, right: 60, top: 1100}}>
        <MaskLine delay={84}>
          <div style={{fontFamily: F.body, fontWeight: 800, fontSize: 36, color: C.gold, letterSpacing: 4}}>À LA CLÉ</div>
        </MaskLine>
        <MaskLine delay={88}>
          <div style={{fontFamily: F.display, fontSize: 112, color: C.white, lineHeight: 0.95}}>EMBAUCHE</div>
        </MaskLine>
        <MaskLine delay={92}>
          <div style={{fontFamily: F.display, fontSize: 112, color: C.gold, lineHeight: 0.95}}>COMMERCIALE</div>
        </MaskLine>
        <MaskLine delay={96}>
          <div style={{fontFamily: F.display, fontSize: 112, color: C.white, lineHeight: 0.95}}>POSSIBLE</div>
        </MaskLine>
      </div>
      <LightSweep at={96} />
      <Vignette strength={0.45} />
      <LogoBadge delay={0} />
      <Grain />
    </AbsoluteFill>
  );
};

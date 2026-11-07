import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {CONFIG} from '../config';
import {FloatingShapes, Grain, LightSweep, Vignette} from '../components/FX';
import {MaskLine} from '../components/Kinetic';
import {LogoBadge} from '../components/LogoBadge';
import {Phone} from '../components/Phone';
import {clamp, ease, spr} from '../components/anim';
import {C, F} from '../theme';

const TYPE_START = 30;
const TYPE_CPS = 1.6; // images par caractère
const SEND_AT = TYPE_START + Math.ceil(CONFIG.messageExemple.length * TYPE_CPS) + 6;
const NUMBER_AT = SEND_AT + 22;

const ChatIcon: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 3C7 3 3 6.6 3 11c0 2 .8 3.8 2.2 5.2L4.5 20.5l4.6-1.6c.9.3 1.9.4 2.9.4 5 0 9-3.6 9-8s-4-8.3-9-8.3Z" fill="#fff" />
  </svg>
);

/** SCÈNE 6 — APPEL À L'ACTION (26–32 s) */
export const Scene6CTA: React.FC = () => {
  const f = useCurrentFrame();
  const phoneIn = spr(f, 0, 15, 0.9, 110);
  const typed = CONFIG.messageExemple.slice(0, Math.max(0, Math.floor((f - TYPE_START) / TYPE_CPS)));
  const sent = f >= SEND_AT;
  const bubble = spr(f, SEND_AT, 12);
  const rotY = interpolate(f, [0, 180], [16, -10]);
  const numIn = spr(f, NUMBER_AT, 13);
  const numScale = interpolate(f, [NUMBER_AT, NUMBER_AT + 140], [1, 1.04], clamp);
  const pulse = 0.5 + 0.5 * Math.sin((f - NUMBER_AT) / 5);
  const digits = CONFIG.whatsapp.split('');

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 30%, #1E3C86 0%, ${C.navy} 45%, ${C.navyDeep} 100%)`,
        overflow: 'hidden',
      }}
    >
      <FloatingShapes seed={6} palette={[C.gold, 'rgba(255,255,255,0.2)', C.bordeaux]} />
      <div
        style={{
          position: 'absolute',
          left: 540,
          top: 820,
          width: 900,
          height: 900,
          transform: 'translate(-50%,-50%)',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(176,21,47,0.55), rgba(176,21,47,0) 70%)`,
        }}
      />

      {/* Titre */}
      <div style={{position: 'absolute', top: 268, left: 60, right: 60}}>
        <MaskLine delay={2}>
          <div style={{fontFamily: F.display, fontSize: 70, color: C.white, lineHeight: 1}}>CANDIDATURE IMMÉDIATE</div>
        </MaskLine>
        <MaskLine delay={8}>
          <div style={{fontFamily: F.display, fontSize: 70, color: C.gold, lineHeight: 1}}>PAR WHATSAPP</div>
        </MaskLine>
      </div>

      {/* Téléphone + conversation stylisée */}
      <div
        style={{
          position: 'absolute',
          left: 540,
          top: 445,
          transform: `translate(-50%, ${(1 - phoneIn) * 1000}px) rotate(${(1 - phoneIn) * -8}deg)`,
        }}
      >
        <Phone width={360} rotY={rotY} rotX={4} glow={sent ? 0.6 : 0}>
          <div style={{height: '100%', display: 'flex', flexDirection: 'column', fontFamily: F.body, background: '#EFE8DE'}}>
            {/* en-tête */}
            <div style={{background: C.navy, padding: '58px 16px 14px', display: 'flex', alignItems: 'center', gap: 10}}>
              <div style={{width: 46, height: 46, borderRadius: '50%', background: '#fff', overflow: 'hidden', display: 'flex', alignItems: 'center'}}>
                <Img src={staticFile('img/logo-diamond-optique.png')} style={{width: 46}} />
              </div>
              <div>
                <div style={{color: '#fff', fontWeight: 800, fontSize: 17}}>Diamond Optique</div>
                <div style={{color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: 12}}>Recrutement</div>
              </div>
            </div>
            {/* messages */}
            <div style={{flex: 1, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 10}}>
              <div style={{alignSelf: 'center', background: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 700, color: '#666', padding: '4px 12px', borderRadius: 8}}>
                AUJOURD’HUI
              </div>
              {sent && (
                <div
                  style={{
                    alignSelf: 'flex-end',
                    background: '#D6F5C9',
                    padding: '10px 14px',
                    borderRadius: '16px 4px 16px 16px',
                    fontWeight: 800,
                    fontSize: 20,
                    color: C.ink,
                    transform: `scale(${bubble})`,
                    transformOrigin: 'bottom right',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  }}
                >
                  {CONFIG.messageExemple}
                  <span style={{fontSize: 11, color: '#4FA3E0', marginLeft: 8, fontWeight: 700}}>✓✓</span>
                </div>
              )}
            </div>
            {/* saisie */}
            <div style={{display: 'flex', gap: 8, padding: '10px 12px 22px', alignItems: 'center'}}>
              <div style={{flex: 1, background: '#fff', borderRadius: 24, padding: '12px 16px', fontSize: 18, fontWeight: 700, color: C.ink, minHeight: 24}}>
                {!sent && typed}
                {!sent && <span style={{opacity: Math.floor(f / 8) % 2 ? 1 : 0, color: C.bordeaux}}>|</span>}
              </div>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: '50%',
                  background: C.bordeaux,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `scale(${f >= SEND_AT - 3 && f < SEND_AT + 3 ? 0.85 : 1})`,
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24"><path d="M3 20l18-8L3 4v6l12 2-12 2z" fill="#fff" /></svg>
              </div>
            </div>
          </div>
        </Phone>
      </div>

      {/* Consigne */}
      <div
        style={{
          position: 'absolute',
          top: 1215,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: F.body,
          fontWeight: 700,
          fontSize: 38,
          color: C.white,
          opacity: interpolate(f, [SEND_AT, SEND_AT + 10], [0, 1], clamp),
        }}
      >
        Envoie <span style={{color: C.gold, fontWeight: 900}}>PRÊT + TA ZONE</span> au
      </div>

      {/* Numéro */}
      <div
        style={{
          position: 'absolute',
          top: 1280,
          left: 50,
          right: 50,
          display: 'flex',
          justifyContent: 'center',
          opacity: numIn,
          transform: `scale(${(0.7 + 0.3 * numIn) * numScale})`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            background: C.gold,
            borderRadius: 28,
            padding: '16px 30px',
            boxShadow: `0 0 ${40 + pulse * 50}px rgba(255,201,40,${0.45 + pulse * 0.3}), 0 20px 40px rgba(0,0,0,0.35)`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{width: 62, height: 62, borderRadius: '50%', background: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <ChatIcon size={36} />
          </div>
          <div style={{fontFamily: F.display, fontSize: 74, color: C.navyDeep, whiteSpace: 'nowrap', letterSpacing: 1}}>
            {digits.map((d, i) => {
              const s = interpolate(f, [NUMBER_AT + i * 1.2, NUMBER_AT + i * 1.2 + 8], [0, 1], {...clamp, easing: ease});
              return (
                <span key={i} style={{display: 'inline-block', opacity: s, transform: `translateY(${(1 - s) * 40}px)`}}>
                  {d === ' ' ? ' ' : d}
                </span>
              );
            })}
          </div>
        </div>
      </div>
      <LightSweep at={NUMBER_AT + 20} dur={26} />
      <Vignette strength={0.4} />
      <LogoBadge delay={0} hide={170} />
      <Grain />
    </AbsoluteFill>
  );
};
export const CTA_TIMING = {SEND_AT, NUMBER_AT};

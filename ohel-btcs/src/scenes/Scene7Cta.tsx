import {AbsoluteFill, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {AssetMedia} from '../components/AssetMedia';
import {BtcsWall} from '../components/BtcsBlockAnimation';
import {KineticTitle} from '../components/KineticTitle';
import {PhotoPlate} from '../components/PhotoPlate';
import {Placeholder} from '../components/Placeholder';
import {QrCode} from '../components/QrCode';
import {Sfx} from '../components/Sfx';
import {brand, whatsappLink} from '../config/brand';
import {resolveAsset} from '../lib/assets';
import {useAdProps} from '../lib/context';
import {FONT, FONT_SIGNATURE} from '../lib/fonts';
import {useFormat} from '../lib/format';
import type {SceneProps} from './types';

const C = brand.colors;
/** Frame d'apparition du bouton et du numéro (le numéro reste ≥ 4 s à l'écran). */
export const CTA_NUMBER_AT = 26;

/** Fond de repli du 15 s : mur BTCS sur fond terre (prévu par le brief). */
const EarthWallBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useFormat();
  const blockW = 240;
  const rows = Math.ceil(height / (blockW * 0.33)) + 2;
  return (
    <AbsoluteFill style={{background: C.earthDark}}>
      <svg width={width} height={height}>
        <defs>
          <filter id="grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves={3} seed={11} result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.9 0.62" result="dark" />
            <feComposite in="dark" in2="SourceGraphic" operator="in" result="darkIn" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="darkIn" />
            </feMerge>
          </filter>
        </defs>
        <g transform={`translate(${-120 - frame * 0.6} ${-80 - frame * 0.25}) scale(1.05)`}>
          <BtcsWall frame={frame} start={0} end={1} width={width + 400} rows={rows} blockW={blockW} built />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const WhatsAppGlyph: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
    <path
      d="M16 3C8.8 3 3 8.6 3 15.6c0 2.5.7 4.8 2 6.8L3.6 29l6.8-1.8c1.8 1 3.8 1.5 5.6 1.5 7.2 0 13-5.6 13-12.6S23.2 3 16 3z"
      fill="none"
      stroke="#fff"
      strokeWidth={2.4}
    />
    <path
      d="M11.6 9.6c-.4 0-1 .1-1.4.7-.5.6-1.5 1.5-1.5 3.7s1.6 4.3 1.8 4.6c.2.3 3.1 4.9 7.6 6.6 3.7 1.4 4.5 1.1 5.3 1 .8-.1 2.6-1 3-2.1.4-1 .4-1.9.3-2.1-.1-.2-.4-.3-.9-.6l-3-1.4c-.4-.2-.7-.2-1 .2l-1.4 1.7c-.2.3-.5.3-.9.1-.4-.2-1.8-.7-3.4-2.1-1.2-1.1-2.1-2.4-2.3-2.8-.2-.4 0-.6.2-.8l.7-.8c.2-.3.3-.5.4-.8.1-.3 0-.6 0-.8l-1.3-3.2c-.3-.8-.7-.8-1-.8z"
      fill="#fff"
    />
  </svg>
);

export const Scene7Cta: React.FC<SceneProps> = ({segment}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {u, safe, width, height, vertical} = useFormat();
  const {draft} = useAdProps();
  const overMedia = segment.variant === 'overMedia';
  // Retour à la villa terminée, de nuit : le texte se pose directement sur l'image.
  const overVilla = segment.variant === 'overVilla';

  const card = spring({frame: frame - 2, fps, config: {damping: 200}});
  const logoIn = interpolate(frame, [6, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const sig = interpolate(frame, [16, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const btn = spring({frame: frame - CTA_NUMBER_AT, fps, config: {damping: 14, mass: 0.6}});
  const extras = interpolate(frame, [CTA_NUMBER_AT + 10, CTA_NUMBER_AT + 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const logo = resolveAsset('logo', draft);
  const fondCta = resolveAsset('fondCta15', false);
  const number = brand.whatsapp || (draft ? 'N° WHATSAPP À FOURNIR' : '');

  const innerW = width - safe.left - safe.right;
  const contentW = vertical ? innerW - 80 * u : innerW * 0.52;
  const logoW = (vertical ? 460 : 420) * u;

  const logoBlock = (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div
        style={{
          opacity: logoIn,
          transform: `scale(${0.96 + 0.04 * logoIn})`,
          width: logoW,
          ...(overVilla
            ? {background: '#fff', borderRadius: 20 * u, padding: `${14 * u}px ${22 * u}px`, boxShadow: '0 20px 50px rgba(0,0,0,0.4)'}
            : {}),
        }}
      >
        {logo.src ? (
          // Logo officiel : jamais redessiné, recoloré ni animé brique par brique.
          <Img src={logo.src} style={{width: '100%', display: 'block'}} />
        ) : (
          <div style={{position: 'relative', width: logoW, height: logoW * 0.55}}>
            <Placeholder expected={logo.expected} label="Logo officiel" compact />
          </div>
        )}
      </div>
      <div
        style={{
          whiteSpace: 'nowrap',
          fontFamily: FONT_SIGNATURE,
          fontWeight: 600,
          fontSize: 70 * u,
          color: overVilla ? '#FFFFFF' : C.red,
          textShadow: overVilla ? '0 2px 14px rgba(0,0,0,0.6)' : 'none',
          textAlign: 'center',
          marginTop: 6 * u,
          opacity: sig,
        }}
      >
        {brand.signature}
      </div>
    </div>
  );

  const action = (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26 * u}}>
      <div style={{minHeight: 190 * u, display: 'flex', alignItems: 'center'}}>
        {/* Un titre par plan : le CTA peut enchaîner appel à l'action puis signature. */}
        {segment.shots.map((sh, i) =>
          sh.title ? (
            <KineticTitle
              key={i}
              lines={sh.title}
              from={sh.from + (i === 0 ? 12 : 0)}
              frames={i === segment.shots.length - 1 ? segment.frames + 30 - sh.from : sh.frames - (i === 0 ? 12 : 0)}
              tone={overVilla ? 'onImage' : 'onLight'}
              align="center"
              maxWidth={contentW}
              baseSize={76 * u}
            />
          ) : null,
        )}
      </div>
      {number ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20 * u,
            background: C.red,
            color: '#fff',
            borderRadius: 999,
            padding: `${22 * u}px ${44 * u}px`,
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: Math.max(56, 58 * u),
            letterSpacing: 1 * u,
            boxShadow: '0 18px 40px rgba(219,25,29,0.35)',
            transform: `scale(${btn})`,
            whiteSpace: 'nowrap',
            maxWidth: contentW,
          }}
        >
          <WhatsAppGlyph size={64 * u} />
          <span style={{fontSize: brand.whatsapp ? undefined : 40 * u}}>{number}</span>
        </div>
      ) : null}
      {!vertical && whatsappLink() ? (
        // 16:9 uniquement : le spectateur a son téléphone libre pour scanner.
        <div style={{display: 'flex', alignItems: 'center', gap: 22 * u, opacity: extras}}>
          <div style={{border: `${5 * u}px solid ${C.red}`, borderRadius: 12 * u, padding: 8 * u, background: '#fff'}}>
            <QrCode value={whatsappLink()} size={170 * u} />
          </div>
          <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 34 * u, color: overVilla ? '#fff' : C.steel, lineHeight: 1.25}}>
            Scannez pour
            <br />
            nous écrire
          </div>
        </div>
      ) : null}
      {brand.offer ? (
        <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 44 * u, color: overVilla ? '#fff' : C.black, opacity: extras}}>
          {brand.offer}
        </div>
      ) : null}
      {brand.services.length ? (
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 * u, opacity: extras, maxWidth: contentW}}>
          {brand.services.map((s) => (
            <div
              key={s}
              style={{
                fontFamily: FONT,
                fontWeight: 600,
                fontSize: 30 * u,
                color: C.steel,
                border: `2px solid ${C.greyLight}`,
                borderRadius: 999,
                padding: `${8 * u}px ${20 * u}px`,
              }}
            >
              {s}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );

  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: (vertical ? 40 : 90) * u,
      }}
    >
      {logoBlock}
      {action}
    </div>
  );

  return (
    <AbsoluteFill style={{backgroundColor: C.offWhite}}>
      {overVilla ? (
        <>
          <PhotoPlate id="villaNuit" frames={segment.frames} move={{x: [45, 55], scale: [1.1, 1.02]}} shade={0} />
          <AbsoluteFill
            style={{
              background: vertical
                ? 'linear-gradient(180deg, rgba(5,8,20,0.15) 0%, rgba(5,8,20,0.35) 35%, rgba(5,8,20,0.88) 70%)'
                : 'linear-gradient(90deg, rgba(5,8,20,0.2) 0%, rgba(5,8,20,0.85) 60%)',
            }}
          />
        </>
      ) : overMedia ? (
        <>
          {fondCta.src ? <AssetMedia id="fondCta15" /> : <EarthWallBackground />}
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.55))'}} />
        </>
      ) : (
        <BlueprintGrid />
      )}
      {/* Contenu centré dans la zone de sécurité */}
      <div
        style={{
          position: 'absolute',
          left: safe.left,
          top: safe.top,
          width: innerW,
          height: height - safe.top - safe.bottom,
          display: 'flex',
          alignItems: overVilla && !vertical ? 'flex-end' : 'center',
          justifyContent: overVilla && vertical ? 'flex-end' : 'center',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            background: overMedia ? 'rgba(255,255,255,0.97)' : 'transparent',
            borderRadius: 28 * u,
            padding: overMedia ? `${50 * u}px ${36 * u}px` : 0,
            width: overMedia ? innerW - 20 * u : undefined,
            boxShadow: overMedia ? '0 30px 80px rgba(0,0,0,0.35)' : 'none',
            opacity: card,
            transform: `translateY(${(1 - card) * 60 * u}px)`,
          }}
        >
          {content}
        </div>
      </div>
      <Sfx id="sfxCta" at={CTA_NUMBER_AT} />
    </AbsoluteFill>
  );
};

/** Fond blanc architectural : trame fine de plan. */
const BlueprintGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useFormat();
  const step = 60;
  const drift = (frame * 0.4) % step;
  return (
    <AbsoluteFill style={{background: C.offWhite}}>
      <svg width={width} height={height} style={{opacity: 0.6}}>
        {Array.from({length: Math.ceil(width / step) + 2}, (_, i) => (
          <line
            key={`v${i}`}
            x1={i * step - drift}
            x2={i * step - drift}
            y1={0}
            y2={height}
            stroke={C.greyLight}
            strokeWidth={i % 5 === 0 ? 2 : 1}
          />
        ))}
        {Array.from({length: Math.ceil(height / step) + 2}, (_, i) => (
          <line key={`h${i}`} y1={i * step} y2={i * step} x1={0} x2={width} stroke={C.greyLight} strokeWidth={i % 5 === 0 ? 2 : 1} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

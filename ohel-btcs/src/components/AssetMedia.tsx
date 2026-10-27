import {AbsoluteFill, Img, OffthreadVideo} from 'remotion';
import type {AssetId} from '../config/assets';
import {FONT} from '../lib/fonts';
import {useFormat} from '../lib/format';
import {isVideoFile, resolveAsset} from '../lib/assets';
import {useAdProps} from '../lib/context';
import {Placeholder} from './Placeholder';

/** Mention obligatoire sur tout visuel IA (scènes projectives 1, 4, 6). */
export const IllustrationMention: React.FC = () => {
  const {u, safe} = useFormat();
  return (
    <div
      style={{
        position: 'absolute',
        left: safe.left,
        top: safe.top,
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: 26 * u,
        color: 'rgba(255,255,255,0.92)',
        textShadow: '0 1px 6px rgba(0,0,0,0.75)',
        letterSpacing: 0.5 * u,
      }}
    >
      Illustration non contractuelle
    </div>
  );
};

/**
 * Affiche un média du manifeste (image ou vidéo, plein cadre, « cover »),
 * ou un placeholder s'il manque. Ajoute la mention sur les visuels IA.
 */
export const AssetMedia: React.FC<{
  id: AssetId;
  style?: React.CSSProperties;
  /** Masquer la mention (ex. calque de premier plan déjà couvert par le fond). */
  hideMention?: boolean;
  /** Ne rien afficher si absent (calques optionnels). */
  optional?: boolean;
}> = ({id, style, hideMention, optional}) => {
  const {draft} = useAdProps();
  const a = resolveAsset(id, draft);
  if (!a.src) {
    if (optional) return null;
    return <Placeholder expected={a.expected} label={a.def.label} authentique={a.def.authentique} />;
  }
  const media: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', ...style};
  return (
    <AbsoluteFill>
      {isVideoFile(a.src) ? <OffthreadVideo src={a.src} muted style={media} /> : <Img src={a.src} style={media} />}
      {a.def.ia && !hideMention ? <IllustrationMention /> : null}
    </AbsoluteFill>
  );
};

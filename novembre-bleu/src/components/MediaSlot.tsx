import React from 'react';
import {AbsoluteFill, OffthreadVideo, staticFile} from 'remotion';
import manifest from '../data/media-manifest.json';
import {colors, fonts} from '../styles/theme';
import {CameraMove, CinematicCamera} from './CinematicCamera';
import {ImgCover} from './Atmosphere';
import {useLayout} from './layout';

type Manifest = Record<string, {kind: 'image' | 'video'; src: string}>;
const media = manifest as Manifest;

export const PlaceholderContext = React.createContext<{showTags: boolean}>({showTags: true});

/** Étiquette visible indiquant qu'un plan est un PLACEHOLDER (jamais un média définitif). */
export const PlaceholderTag: React.FC<{id: string; description: string}> = ({id, description}) => {
  const {showTags} = React.useContext(PlaceholderContext);
  const {u, vertical} = useLayout();
  if (!showTags) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 28 * u,
        top: vertical ? 40 : 24 * u,
        maxWidth: vertical ? 660 : 820 * u,
        padding: `${8 * u}px ${14 * u}px`,
        border: `2px dashed ${colors.gold}`,
        borderRadius: 8 * u,
        background: 'rgba(3,11,25,0.72)',
        color: colors.gold,
        fontFamily: fonts.body,
        fontWeight: 600,
        fontSize: 19 * u,
        lineHeight: 1.3,
        letterSpacing: '0.02em',
        zIndex: 50,
      }}
    >
      PLACEHOLDER {id} · illustration provisoire — média à fournir : {description}
    </div>
  );
};

/**
 * Emplacement média d'un plan. Si un fichier sXX.(jpg|png|mp4) existe dans
 * public/assets/{images,videos}, il est utilisé (avec caméra cinématographique et étalonnage).
 * Sinon, l'illustration de remplacement est affichée AVEC son étiquette PLACEHOLDER.
 */
export const MediaSlot: React.FC<{
  id: string;
  description: string;
  camera?: CameraMove;
  grade?: string;
  fallback: React.ReactNode;
}> = ({id, description, camera, grade, fallback}) => {
  const m = media[id];
  if (!m) {
    return (
      <AbsoluteFill>
        {fallback}
        <PlaceholderTag id={id} description={description} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <CinematicCamera {...camera}>
        {m.kind === 'video' ? (
          <OffthreadVideo src={staticFile(m.src)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        ) : (
          <ImgCover src={m.src} />
        )}
      </CinematicCamera>
      {/* étalonnage : teinte navy dans les ombres */}
      <AbsoluteFill style={{background: grade ?? `linear-gradient(180deg, ${colors.navy}55, transparent 40%, ${colors.navy}aa)`, mixBlendMode: 'multiply'}} />
    </AbsoluteFill>
  );
};

import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {colors, fonts} from '../styles/theme';
import {Bokeh, Glow} from './Atmosphere';
import {Backdrop} from './Backdrop';
import {BlueRibbon} from './BlueRibbon';
import {Caption, KineticHeadline} from './KineticHeadline';
import {useLayout} from './layout';
import {PlaceholderContext} from './MediaSlot';

/**
 * End card : ruban bleu, « NOVEMBRE BLEU », signature, et EMPLACEMENT réservé
 * au logo institutionnel (non inventé : cadre identifié à remplacer par le fichier officiel).
 */
export const EndCard: React.FC<{titleAt: number; taglineAt: number; brandAt: number; duration: number}> = ({
  titleAt, taglineAt, brandAt, duration,
}) => {
  const frame = useCurrentFrame();
  const {width, height, vertical, u, safe} = useLayout();
  const {showTags} = React.useContext(PlaceholderContext);
  const slotP = interpolate(frame, [taglineAt + 30, taglineAt + 46], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const fadeOut = interpolate(frame, [duration - 16, duration], [1, 0.0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ribbon = (vertical ? 260 : 230) * u;
  return (
    <AbsoluteFill style={{opacity: 0.15 + 0.85 * fadeOut}}>
      <Backdrop from={[colors.navyDeep, colors.navy, '#0C2C62']} angle={180} />
      <Glow x={width / 2} y={vertical ? height * 0.36 : height * 0.42} size={width * (vertical ? 1.3 : 0.8)} color={colors.blue} opacity={0.9} />
      <Bokeh count={20} seed="end" color={colors.electric} opacity={0.22} />
      <AbsoluteFill
        style={{
          flexDirection: vertical ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: vertical ? 'flex-start' : 'center',
          paddingTop: vertical ? safe.top + 20 : 0,
          gap: (vertical ? 30 : 90) * u,
        }}
      >
        <BlueRibbon at={0} size={ribbon} drawFrames={36} />
        <div style={{display: 'flex', flexDirection: 'column', alignItems: vertical ? 'center' : 'flex-start', gap: 18 * u, maxWidth: vertical ? width - 2 * safe.left : width * 0.5}}>
          <KineticHeadline text="NOVEMBRE BLEU" at={titleAt} size={(vertical ? 118 : 116) * u} mode="track" align={vertical ? 'center' : 'left'} accentWords={['BLEU']} accent={colors.electric} />
          <div style={{width: interpolate(frame, [titleAt + 8, titleAt + 28], [0, 160 * u], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), height: 4 * u, background: colors.gold, borderRadius: 2}} />
          <Caption text="Le courage, c'est aussi de prendre soin de sa santé." at={taglineAt} size={(vertical ? 44 : 40) * u} align={vertical ? 'center' : 'left'} weight={600} />
          <Caption text="Parlez-en à un professionnel de santé." at={taglineAt + 26} size={(vertical ? 30 : 28) * u} align={vertical ? 'center' : 'left'} color={colors.gold} />
          {/* Emplacement logo institutionnel : cadre visible uniquement avec showPlaceholderTags=true */}
          {showTags && (
          <div
            style={{
              marginTop: 24 * u,
              width: (vertical ? 420 : 380) * u,
              height: (vertical ? 120 : 108) * u,
              borderRadius: 12 * u,
              border: showTags ? `2px dashed ${colors.gold}` : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: slotP,
              fontFamily: fonts.body,
              fontWeight: 600,
              fontSize: 20 * u,
              lineHeight: 1.3,
              textAlign: 'center',
              color: colors.gold,
              padding: 10 * u,
            }}
          >
            {showTags ? 'EMPLACEMENT LOGO INSTITUTIONNEL — fichier officiel à fournir' : ''}
          </div>
          )}
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', display: 'none'}}>{brandAt}</div>
    </AbsoluteFill>
  );
};

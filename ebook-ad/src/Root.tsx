import React from 'react';
import {Composition} from 'remotion';
import {Ad, AdProps} from './Ad';
import {FPS} from './theme';
import {TOTAL_FRAMES} from './timeline';

const noVo: AdProps = {voiceOver: false, captions: false, music: true};
const withVo: AdProps = {voiceOver: true, captions: true, music: true};

export const RemotionRoot: React.FC = () => (
  <>
    {/* Version principale sans voix off — 1080×1920 (Reels, TikTok, Shorts, Statuts WhatsApp) */}
    <Composition id="AdVertical" component={Ad} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} defaultProps={noVo} />
    {/* Version voix off + sous-titres (nécessite public/audio/voiceover.mp3) */}
    <Composition id="AdVerticalVO" component={Ad} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} defaultProps={withVo} />
    {/* Version sans voix off avec sous-titres incrustés (lecture sans son) */}
    <Composition id="AdVerticalCaptions" component={Ad} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} defaultProps={{...noVo, captions: true}} />
    {/* Format carré 1080×1080 (fil Facebook / Instagram) */}
    <Composition id="AdSquare" component={Ad} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1080} defaultProps={noVo} />
    <Composition id="AdSquareVO" component={Ad} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1080} defaultProps={withVo} />
  </>
);

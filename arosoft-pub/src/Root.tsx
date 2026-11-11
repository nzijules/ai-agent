import "./fonts";
import React from "react";
import { Composition, Still } from "remotion";
import { DURATION_FRAMES, FPS, HEIGHT, WIDTH } from "./config";
import { Main } from "./Main";
import { Cover } from "./Cover";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="AroSoftPub" component={Main} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ audio: { voice: true, music: true, sfx: true } }} />
    {/* Stem effets sonores seuls (export séparé) */}
    <Composition id="SfxStem" component={Main} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ audio: { voice: false, music: false, sfx: true } }} />
    <Composition id="MusicStem" component={Main} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ audio: { voice: false, music: true, sfx: false } }} />
    <Composition id="VoiceStem" component={Main} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ audio: { voice: true, music: false, sfx: false } }} />
    <Still id="CouvertureTikTok" component={Cover} width={WIDTH} height={HEIGHT} />
  </>
);

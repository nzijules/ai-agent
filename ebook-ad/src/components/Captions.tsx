import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, easeOut} from '../anim';
import {voiceOverCues} from '../captions';
import {useFormat} from '../format';
import {colors, fonts} from '../theme';

/** Coupe une réplique trop longue (> 60 caractères) en deux, au plus près du milieu. */
const MAX = 60;
const splitCues = voiceOverCues.flatMap((c) => {
  if (c.text.length <= MAX) return [c];
  const words = c.text.split(' ');
  let best = 1;
  let bestScore = Infinity;
  for (let i = 1; i < words.length; i++) {
    const left = words.slice(0, i).join(' ').length;
    const score = Math.abs(left - c.text.length / 2) - (/[,;:]$/.test(words[i - 1]) ? 8 : 0);
    if (score < bestScore) {
      bestScore = score;
      best = i;
    }
  }
  const a = words.slice(0, best).join(' ');
  const b = words.slice(best).join(' ');
  const mid = c.start + ((c.end - 0.3 - c.start) * a.length) / c.text.length;
  return [
    {start: c.start, end: mid - 0.12, text: a},
    {start: mid, end: c.end, text: b},
  ];
});

/** Sous-titres animés (mot actif surligné, style « karaoké »), placés dans la zone sûre. */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fmt = useFormat();
  const t = frame / fps;
  const cue = splitCues.find((c) => t >= c.start && t < c.end + 0.15);
  if (!cue) return null;
  const local = (t - cue.start) * fps;
  const inP = interpolate(local, [0, 6], [0, 1], {...clamp, easing: easeOut});
  const outP = interpolate(t, [cue.end, cue.end + 0.15], [0, 1], clamp);
  const words = cue.text.split(' ');
  const dur = cue.end - cue.start;
  const fontSize = fmt.vertical ? 40 : 32;
  return (
    <div
      style={{
        position: 'absolute',
        top: fmt.captionTop,
        left: fmt.padX,
        right: fmt.padX,
        height: fmt.captionHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: inP * (1 - outP),
        transform: `translateY(${(1 - inP) * 16}px)`,
      }}
    >
      <div
        style={{
          maxWidth: '100%',
          padding: `${fontSize * 0.35}px ${fontSize * 0.7}px`,
          borderRadius: fontSize * 0.5,
          background: 'rgba(4, 9, 28, 0.72)',
          border: '1.5px solid rgba(255,255,255,0.12)',
          textAlign: 'center',
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize,
          lineHeight: 1.25,
          color: colors.white,
        }}
      >
        {words.map((w, i) => {
          const wt = cue.start + (dur * i) / words.length;
          const active = t >= wt;
          return (
            <span key={i} style={{color: active ? colors.white : 'rgba(255,255,255,0.45)'}}>
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </div>
    </div>
  );
};

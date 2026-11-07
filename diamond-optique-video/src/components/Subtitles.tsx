import {interpolate, useCurrentFrame} from 'remotion';
import {FPS, VOICE_OVER} from '../config';
import {F} from '../theme';
import {clamp} from './anim';

/** Sous-titres synchronisés sur la voix-off (découpage proportionnel au nombre de caractères) */
const CUES = VOICE_OVER.flatMap((vo) => {
  const total = vo.text.reduce((a, t) => a + t.length, 0);
  let t0 = vo.at;
  return vo.text.map((t) => {
    const d = (t.length / total) * vo.dur;
    const cue = {start: t0, end: t0 + d + 0.12, text: t};
    t0 += d;
    return cue;
  });
});

export const Subtitles: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const cue = CUES.find((c) => t >= c.start && t < c.end);
  if (!cue) return null;
  const local = (t - cue.start) * FPS;
  const o = interpolate(local, [0, 4], [0, 1], clamp);
  const y = interpolate(local, [0, 6], [14, 0], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: 70,
        right: 150, // évite la colonne d'icônes TikTok / Reels
        bottom: 300,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 60,
        opacity: o,
        transform: `translateY(${y}px)`,
      }}
    >
      <span
        style={{
          fontFamily: F.body,
          fontWeight: 800,
          fontSize: 44,
          lineHeight: 1.25,
          color: '#fff',
          textAlign: 'center',
          background: 'rgba(10,22,54,0.82)',
          padding: '12px 26px',
          borderRadius: 18,
          boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
        }}
      >
        {cue.text}
      </span>
    </div>
  );
};

import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand} from '../config/brand';
import type {TitleLine} from '../config/scripts';
import {FONT} from '../lib/fonts';
import {useFormat} from '../lib/format';

/** Tailles minimales imposées par le brief. */
export const MIN_TITLE_PX = 56;

/** Largeur moyenne d'une capitale Montserrat ExtraBold, en em (estimation prudente). */
const CAP_EM = 0.74;

/** Taille de police qui fait tenir la ligne la plus longue dans `maxWidth`. */
export const fitTitleSize = (lines: TitleLine[], maxWidth: number, base: number, padEm = 0.5) => {
  const longest = Math.max(...lines.map((l) => l.text.length * CAP_EM + (l.highlight ? padEm : 0)));
  return Math.max(MIN_TITLE_PX, Math.min(base, Math.floor(maxWidth / longest)));
};

/**
 * Titre cinétique : chaque ligne monte depuis un masque, la ligne mise en avant
 * se pose sur un aplat rouge OHEL qui se déploie de gauche à droite.
 * `from` / `frames` : fenêtre du plan (sortie pendant les dernières frames).
 */
export const KineticTitle: React.FC<{
  lines: TitleLine[];
  from: number;
  frames: number;
  tone?: 'onImage' | 'onLight';
  align?: 'left' | 'center';
  maxWidth: number;
  baseSize?: number;
}> = ({lines, from, frames, tone = 'onImage', align = 'left', maxWidth, baseSize}) => {
  const frame = useCurrentFrame() - from;
  const {fps} = useVideoConfig();
  const {u, vertical} = useFormat();
  if (frame < 0 || frame >= frames) return null;

  const size = fitTitleSize(lines, maxWidth, baseSize ?? (vertical ? 92 : 84) * u);
  const exit = interpolate(frame, [frames - 8, frames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'left' ? 'flex-start' : 'center',
        gap: size * 0.12,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.08,
        opacity: 1 - exit,
        transform: `translateY(${-exit * 24 * u}px)`,
      }}
    >
      {lines.map((line, i) => {
        const delay = i * 4;
        const p = spring({frame: frame - delay, fps, config: {damping: 200, mass: 0.6}});
        const bar = spring({frame: frame - delay + 2, fps, config: {damping: 200, mass: 0.5}});
        const color = line.highlight ? '#FFFFFF' : tone === 'onImage' ? '#FFFFFF' : brand.colors.black;
        return (
          <div key={i} style={{position: 'relative', overflow: 'hidden', padding: line.highlight ? '0.06em 0' : 0}}>
            {line.highlight ? (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: brand.colors.red,
                  transformOrigin: 'left center',
                  transform: `scaleX(${bar})`,
                }}
              />
            ) : null}
            <div
              style={{
                position: 'relative',
                color,
                padding: line.highlight ? `0 ${0.25}em` : 0,
                transform: `translateY(${(1 - p) * 105}%)`,
                textShadow: tone === 'onImage' && !line.highlight ? '0 2px 18px rgba(0,0,0,0.55)' : 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {line.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Trois transitions maison (jamais la même deux fois de suite, vérifié par `npm run check`) :
 *  - volet   : volet architectural, bord blanc tracé comme un trait de plan ;
 *  - rangs   : la scène suivante apparaît par rangs de blocs décalés, comme un mur qui monte ;
 *  - matiere : fondu à travers un voile de terre latérite granuleuse.
 */
import type {TransitionPresentation, TransitionPresentationComponentProps} from '@remotion/transitions';
import {AbsoluteFill, Easing, interpolate, useVideoConfig} from 'remotion';
import {brand} from '../config/brand';
import type {TransitionKind} from '../config/scripts';

type P = Record<string, never>;
const ease = Easing.inOut(Easing.cubic);

// --- Volet architectural ----------------------------------------------------
const Volet: React.FC<TransitionPresentationComponentProps<P>> = ({children, presentationDirection, presentationProgress}) => {
  const {width, height} = useVideoConfig();
  const p = ease(presentationProgress);
  if (presentationDirection === 'exiting') {
    return <AbsoluteFill style={{transform: `translateX(${-p * width * 0.18}px)`}}>{children}</AbsoluteFill>;
  }
  const edge = width * (1 - p);
  const band = Math.max(18, width * 0.022);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{clipPath: `inset(0 0 0 ${edge}px)`}}>{children}</AbsoluteFill>
      {p < 1 ? (
        <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
          <rect x={edge - band} y={0} width={band} height={height} fill={brand.colors.offWhite} />
          <line x1={edge - band * 0.5} y1={0} x2={edge - band * 0.5} y2={height} stroke={brand.colors.red} strokeWidth={2} />
          {Array.from({length: 24}, (_, i) => (
            <line
              key={i}
              x1={edge - band}
              x2={edge - band * (i % 4 === 0 ? 0.15 : 0.6)}
              y1={(i + 0.5) * (height / 24)}
              y2={(i + 0.5) * (height / 24)}
              stroke={brand.colors.steel}
              strokeWidth={1.5}
            />
          ))}
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};

// --- Rangs de blocs ----------------------------------------------------------
const Rangs: React.FC<TransitionPresentationComponentProps<P>> = ({children, presentationDirection, presentationProgress}) => {
  const {width, height} = useVideoConfig();
  if (presentationDirection === 'exiting') return <AbsoluteFill>{children}</AbsoluteFill>;
  const rows = 8;
  const rh = height / rows;
  // Rangs révélés de bas en haut, en alternant le sens, avec un décalage d'un demi-bloc.
  let d = '';
  for (let r = 0; r < rows; r++) {
    const order = rows - 1 - r;
    const local = interpolate(presentationProgress, [order * 0.07, order * 0.07 + 0.5], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    });
    if (local <= 0) continue;
    const w = local * width;
    const x = r % 2 === 0 ? 0 : width - w;
    const y = r * rh;
    d += `M${x} ${y}H${x + w}V${y + rh + 1}H${x}Z`;
  }
  return <AbsoluteFill style={{clipPath: d ? `path('${d}')` : 'inset(100%)'}}>{children}</AbsoluteFill>;
};

// --- Fondu matière -------------------------------------------------------------
const Matiere: React.FC<TransitionPresentationComponentProps<P>> = ({children, presentationDirection, presentationProgress}) => {
  const p = presentationProgress;
  if (presentationDirection === 'exiting') {
    return <AbsoluteFill style={{transform: `scale(${1 + p * 0.06})`}}>{children}</AbsoluteFill>;
  }
  const veil = Math.sin(Math.PI * p);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{opacity: interpolate(p, [0.35, 0.75], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        {children}
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: veil, pointerEvents: 'none'}}>
        <svg width="100%" height="100%">
          <filter id="matiere-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={7} />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope={0.35} />
            </feComponentTransfer>
          </filter>
          <rect width="100%" height="100%" fill={brand.colors.laterite} />
          <rect width="100%" height="100%" filter="url(#matiere-grain)" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const make = (component: React.FC<TransitionPresentationComponentProps<P>>) => (): TransitionPresentation<P> => ({
  component,
  props: {},
});

export const transitions: Record<TransitionKind, () => TransitionPresentation<P>> = {
  volet: make(Volet),
  rangs: make(Rangs),
  matiere: make(Matiere),
};

import React, { useMemo } from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import { EASE_OUT } from "./anim";
import { BLOCK_RATIO } from "./Block";

type Props = { rangees: number };

/**
 * Transition signature : la scène suivante est révélée par un appareillage de
 * blocs posés rang par rang, de bas en haut (comme un mur qui se monte).
 */
const BlockWipeComponent: React.FC<TransitionPresentationComponentProps<Props>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const { width, height } = useVideoConfig();
  const bh = height / passedProps.rangees;
  const bw = bh * BLOCK_RATIO;

  const briques = useMemo(() => {
    const out: { x: number; y: number; delai: number }[] = [];
    for (let r = 0; r < passedProps.rangees; r++) {
      const decal = r % 2 === 0 ? 0 : -bw / 2;
      const cols = Math.ceil((width - decal) / bw) + 1;
      for (let c = 0; c < cols; c++) {
        const ordre = passedProps.rangees - 1 - r; // du bas vers le haut
        out.push({
          x: decal + c * bw,
          y: r * bh,
          delai: (ordre / passedProps.rangees) * 0.42 + (((c * 7 + r * 3) % cols) / cols) * 0.16,
        });
      }
    }
    return out;
  }, [bh, bw, passedProps.rangees, width]);

  if (presentationDirection === "exiting") {
    return (
      <AbsoluteFill style={{ filter: `brightness(${1 - presentationProgress * 0.45})` }}>{children}</AbsoluteFill>
    );
  }

  const d = briques
    .map(({ x, y, delai }) => {
      const p = EASE_OUT(Math.min(1, Math.max(0, (presentationProgress - delai) / 0.42)));
      if (p <= 0) return "";
      // Chaque bloc grandit depuis son centre : l'appareillage reste lisible.
      const ww = (bw + 1) * (0.35 + 0.65 * p);
      const hh = (bh + 1) * p;
      const xx = x + (bw - ww) / 2;
      const yy = y + (bh - hh) / 2;
      return `M${xx},${yy} h${ww} v${hh} h${-ww} Z`;
    })
    .join(" ");

  return <AbsoluteFill style={{ clipPath: d ? `path('${d}')` : "inset(100% 0 0 0)" }}>{children}</AbsoluteFill>;
};

export const blockWipe = (props: Props = { rangees: 9 }): TransitionPresentation<Props> => ({
  component: BlockWipeComponent,
  props,
});

import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Spring progress 0→1 starting at `delay` frames. */
export const useSpring = (delay = 0, config: { damping?: number; stiffness?: number; mass?: number } = {}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 140, ...config } });
};

/** Pop-in style: returns opacity + transform for an element entering at `delay`. */
export const usePop = (delay = 0, from = 40) => {
  const p = useSpring(delay);
  return {
    opacity: interpolate(p, [0, 0.4], [0, 1], clamp),
    transform: `translateY(${(1 - p) * from}px) scale(${0.6 + 0.4 * p})`,
  };
};

export const useLinear = (start: number, end: number, from = 0, to = 1) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, end], [from, to], clamp);
};

import { useVideoConfig } from "remotion";

/**
 * Layout helper: the same scenes render in 1080x1920 (vertical) and 1080x1080 (square).
 * Safe zones follow TikTok / Reels / Shorts UI overlays (top bar, bottom caption, right action rail).
 */
export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const square = height / width < 1.3;
  const k = square ? 0.74 : 1; // global scale for type & objects
  return {
    square,
    width,
    height,
    k,
    s: (n: number) => Math.round(n * k),
    // content box (where scene content lives)
    top: square ? 56 : 230,
    bottom: square ? 175 : 520, // distance from bottom edge kept free (captions live just above platform UI)
    side: square ? 70 : 100,
    // captions band (only used in voice-over version)
    captionY: square ? height - 115 : height - 430, // vertical centre of the subtitle pill
  };
};

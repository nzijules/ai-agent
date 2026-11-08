import { AbsoluteFill } from "remotion";

/** Plain white background. */
export const Background: React.FC<{ tint?: string }> = () => (
  <AbsoluteFill style={{ backgroundColor: "#FFFFFF" }} />
);

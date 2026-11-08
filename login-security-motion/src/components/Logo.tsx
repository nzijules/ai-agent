import { Img, staticFile, useCurrentFrame } from "remotion";
import { prog } from "../theme";

/** Arosoft logo (mark + wordmark, no background, no slogan), mini, top-right. */
export const Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const p = prog(frame, 4, 20);
  return (
    <Img
      src={staticFile("arosoft-logo.png")}
      style={{
        position: "absolute",
        top: 64,
        right: 64,
        height: 92,
        opacity: p,
        translate: `0 ${(1 - p) * -16}px`,
      }}
    />
  );
};

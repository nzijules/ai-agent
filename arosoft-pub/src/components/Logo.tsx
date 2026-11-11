import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { tw } from "../anim";

/** Symbole AS miniature — coin supérieur droit, marge 45 px, toujours visible. */
export const Logo: React.FC = () => {
  const f = useCurrentFrame();
  const W = 74; // 65–80 px demandé
  return (
    <Img
      src={staticFile("img/as_symbol.png")}
      style={{
        position: "absolute",
        top: 45,
        right: 45,
        width: W,
        height: "auto",
        opacity: tw(f, [0, 12], [0, 1]),
        filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.55))",
        zIndex: 100,
      }}
    />
  );
};

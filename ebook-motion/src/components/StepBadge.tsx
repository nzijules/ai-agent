import React from "react";
import { C, display } from "../theme";
import { usePop } from "./anim";

export const StepBadge: React.FC<{ n: string; delay?: number }> = ({ n, delay = 2 }) => {
  const s = usePop(delay);
  return (
    <div
      style={{
        ...s,
        display: "inline-flex",
        alignItems: "center",
        gap: 18,
        padding: "14px 30px 14px 14px",
        borderRadius: 999,
        background: "rgba(255,204,0,0.15)",
        border: `2px solid ${C.blue}`,
        fontFamily: display,
        fontWeight: 800,
        fontSize: 40,
        color: C.white,
        letterSpacing: 4,
      }}
    >
      <span
        style={{
          width: 70,
          height: 70,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${C.cyan}, ${C.royal})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 900,
          fontSize: 34,
          color: C.navy,
          letterSpacing: 0,
        }}
      >
        {n}
      </span>
      ÉTAPE
    </div>
  );
};

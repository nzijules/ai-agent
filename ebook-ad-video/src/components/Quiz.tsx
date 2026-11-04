import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { clamp, pop } from "../anim";
import { C, F } from "../theme";
import { Icon } from "./Icons";

/**
 * Animated timed-quiz mock-up: countdown ring, one question, three answers,
 * the right answer turns green and a "+1" pops. `delay` = frame at which it starts.
 */
export const QuizMock: React.FC<{ width: number; delay: number; k: number }> = ({ width, delay, k }) => {
  const f = useCurrentFrame();
  const s = (n: number) => Math.round(n * k);
  const t = interpolate(f, [delay + 6, delay + 96], [0, 1], clamp); // timer runs ~3 s
  const pick = delay + 56;
  const picked = f >= pick;
  const ring = 2 * Math.PI * 22;
  const opts = ["1/8", "1/2", "2/8"];
  return (
    <div style={{ width, background: "#F3F6FD", borderRadius: s(28), padding: s(22), display: "flex", flexDirection: "column", gap: s(14), boxShadow: "inset 0 0 0 2px rgba(11,27,58,0.06)", scale: String(0.9 + 0.1 * pop(f, delay, 12, 0.7)), opacity: interpolate(f, [delay, delay + 6], [0, 1], clamp) }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: s(12) }}>
          <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: s(24), color: C.muted, letterSpacing: 1 }}>QUIZ · QUESTION 3/10</div>
          <div style={{ background: C.green, color: "#fff", borderRadius: s(20), padding: `${s(4)}px ${s(12)}px`, fontFamily: F.display, fontWeight: 900, fontSize: s(22), opacity: interpolate(f, [pick + 4, pick + 8], [0, 1], clamp), scale: String(0.6 + 0.4 * pop(f, pick + 4, 9, 0.6)) }}>+1 point</div>
        </div>
        <div style={{ position: "relative", width: s(64), height: s(64) }}>
          <svg width={s(64)} height={s(64)} viewBox="0 0 50 50">
            <circle cx={25} cy={25} r={22} stroke="rgba(11,27,58,0.12)" strokeWidth={5} fill="none" />
            <circle cx={25} cy={25} r={22} stroke={t > 0.7 ? C.red : C.blue} strokeWidth={5} fill="none" strokeLinecap="round" strokeDasharray={ring} strokeDashoffset={ring * t} transform="rotate(-90 25 25)" />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.display, fontWeight: 900, fontSize: s(22), color: C.navy }}>{Math.ceil(30 * (1 - t))}s</div>
        </div>
      </div>
      <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: s(38), color: C.navy, textAlign: "center" }}>1/4 + 1/4 = ?</div>
      <div style={{ display: "flex", gap: s(12) }}>
        {opts.map((o, i) => {
          const ok = i === 1 && picked;
          const p = pop(f, delay + 10 + i * 5, 12, 0.6);
          return (
            <div key={o} style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", gap: s(8), height: s(66), borderRadius: s(18), background: ok ? C.green : "#fff", color: ok ? "#fff" : C.navy, border: `2px solid ${ok ? C.green : "rgba(11,27,58,0.1)"}`, fontFamily: F.display, fontWeight: 800, fontSize: s(32), scale: String((0.8 + 0.2 * p) * (ok ? 1 + 0.06 * interpolate(f, [pick, pick + 4, pick + 10], [0, 1, 0], clamp) : 1)), opacity: picked && !ok ? 0.55 : 1 }}>
              {ok && <Icon name="check" size={s(30)} color="#fff" stroke={3} delay={pick} drawFrames={8} />}
              {o}
            </div>
          );
        })}
      </div>
    </div>
  );
};

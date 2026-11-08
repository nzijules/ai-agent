import React from "react";
import { AbsoluteFill } from "remotion";
import { HoloPanel, MonoRow } from "../components/HoloPanel";
import { IconCheck, IconHash, IconLock, IconPhone, IconScale, IconSearch } from "../components/Icons";
import { Person } from "../components/Person";
import { cue } from "../data/script";
import { EASE_IN_OUT, EASE_OUT, tw, useSceneClock } from "../lib/anim";
import { FONT } from "../fonts";
import { C } from "../theme";

const S = "s3" as const;
const HASH = "9f2c41ab77e0c3d95b18e6a2f04d7c3e1a88b2c9d06f5e47ab31c2d8e9f07b64";

const STEPS = ["ACQUÉRIR", "PRÉSERVER", "ANALYSER"];

const Stepper: React.FC<{ t: number; at: number[] }> = ({ t, at }) => {
  const fill = (i: number) => tw(t, [at[i], at[i] + 0.6], [0, 1]);
  return (
    <div style={{ position: "relative", width: 900, height: 120 }}>
      <div style={{ position: "absolute", left: 90, right: 90, top: 34, height: 3, background: C.line }} />
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 34,
          height: 3,
          width: 720 * (fill(1) * 0.5 + fill(2) * 0.5),
          background: `linear-gradient(90deg, ${C.blue}, ${C.cyan})`,
          boxShadow: `0 0 12px ${C.cyan}`,
        }}
      />
      {STEPS.map((s, i) => {
        const p = fill(i);
        const active = (i === 2 || t < at[i + 1]) && t >= at[i];
        return (
          <div key={s} style={{ position: "absolute", left: 90 + i * 360 - 90, width: 180, top: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                border: `3px solid ${p > 0 ? C.cyan : "#2A4560"}`,
                background: p > 0 ? `radial-gradient(circle, ${C.blue}AA, ${C.bg} 75%)` : C.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT.display,
                fontWeight: 800,
                fontSize: 30,
                color: C.white,
                scale: String(1 + (active ? 0.12 : 0) * p),
                boxShadow: active ? `0 0 30px ${C.cyan}AA` : undefined,
              }}
            >
              {i + 1}
            </div>
            <div style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 28, letterSpacing: 2, color: p > 0 ? C.white : C.faint }}>{s}</div>
          </div>
        );
      })}
    </div>
  );
};

/** Bascule 3D entre les panneaux d'étape. */
const Flip: React.FC<{ t: number; from: number; to: number; children: React.ReactNode }> = ({ t, from, to, children }) => {
  const pin = tw(t, [from, from + 0.6], [0, 1], EASE_OUT);
  const pout = to < 0 ? 0 : tw(t, [to - 0.35, to + 0.1], [0, 1], EASE_IN_OUT);
  if (pin <= 0 || pout >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        transform: `perspective(1400px) rotateY(${(1 - pin) * -55 + pout * 55}deg) translateZ(${(1 - pin) * -200 + pout * -200}px)`,
        opacity: pin * (1 - pout),
      }}
    >
      {children}
    </div>
  );
};

export const Scene3Investigator: React.FC = () => {
  const { t } = useSceneClock();
  const cA = cue("s3.a", S);
  const cB = cue("s3.b", S);
  const cC = cue("s3.c", S);
  const cD = cue("s3.d", S);

  const push = tw(t, [-0.6, 21], [1, 1.07], EASE_IN_OUT);
  const parallax = tw(t, [0, 21], [0, 1], EASE_IN_OUT);
  const look = Math.sin(t * 0.7) * 0.5;

  const acq = tw(t, [cB + 0.8, cB + 3.6], [0, 100], EASE_IN_OUT);
  const hashChars = Math.floor(tw(t, [cC + 0.4, cC + 2.2], [0, HASH.length], (x) => x));
  const custody: Array<[string, string]> = [
    ["09:14", "Saisie — agent habilité"],
    ["09:52", "Scellé n° 0427 apposé"],
    ["11:30", "Transfert au laboratoire"],
    ["14:05", "Acquisition — expert désigné"],
  ];

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* Station d'analyse : enquêteur éclairé par les écrans */}
      <AbsoluteFill style={{ scale: String(push) }}>
        <div style={{ position: "absolute", left: 540 - 400, top: 760 - parallax * 30, width: 800 }}>
          <Person variant="investigator" width={800} lookX={look} lookY={-0.6} tilt={Math.sin(t * 0.4) * 1.5} screenLight={0.95} />
        </div>
        {/* bord du poste de travail */}
        <div
          style={{
            position: "absolute",
            left: -40,
            right: -40,
            top: 1560,
            height: 420,
            background: "linear-gradient(180deg, #0B1626 0%, #060A12 100%)",
            borderTop: `2px solid ${C.blue}66`,
            boxShadow: `0 -10px 60px ${C.blue}33`,
          }}
        />
        {/* écrans latéraux flous */}
        {[-1, 1].map((d) => (
          <div
            key={d}
            style={{
              position: "absolute",
              top: 980,
              left: d < 0 ? -140 : 860,
              width: 360,
              height: 240,
              borderRadius: 16,
              background: `linear-gradient(160deg, ${C.blue}55, #0A1830)`,
              border: `2px solid ${C.cyan}44`,
              transform: `perspective(900px) rotateY(${d * -35}deg)`,
              filter: "blur(3px)",
              opacity: 0.7,
            }}
          >
            {[0, 1, 2, 3, 4].map((k) => (
              <div key={k} style={{ margin: "22px 24px 0", height: 10, borderRadius: 5, width: `${40 + ((k * 37 + Math.floor(t * 3)) % 50)}%`, background: `${C.cyan}66` }} />
            ))}
          </div>
        ))}
      </AbsoluteFill>

      {/* Interface holographique au premier plan (parallaxe inverse) */}
      <AbsoluteFill style={{ translate: `0px ${parallax * 20}px` }}>
        {/* Cadre légal */}
        <div style={{ position: "absolute", top: 120, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              padding: "20px 30px",
              borderRadius: 22,
              background: "rgba(10,20,36,0.85)",
              border: `1px solid ${C.cyan}55`,
              boxShadow: `0 0 40px ${C.blue}33`,
              opacity: tw(t, [cA, cA + 0.6], [0, 1]),
              translate: `0px ${tw(t, [cA, cA + 0.6], [-30, 0])}px`,
            }}
          >
            <IconScale size={64} color={C.cyan} />
            <div>
              <div style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 36, color: C.white, letterSpacing: 1 }}>CADRE LÉGAL</div>
              <div style={{ fontFamily: FONT.ui, fontSize: 25, color: C.dim, marginTop: 4 }}>Décision de justice · autorisation · consentement</div>
            </div>
          </div>
        </div>

        {/* Étapes */}
        <div style={{ position: "absolute", top: 330, left: 90, opacity: tw(t, [cA + 1.4, cA + 2.0], [0, 1]) }}>
          <Stepper t={t} at={[cB, cC, cD]} />
        </div>

        {/* Panneau de l'étape active */}
        <div style={{ position: "absolute", top: 490, left: 0, right: 0, height: 420 }}>
          <Flip t={t} from={cB} to={cC}>
            <HoloPanel width={860} title="Acquisition" tag="PIÈCE 0427" icon={<IconPhone size={54} color={C.cyan} />}>
              <MonoRow k="isolement réseau" v="✓ activé" color={C.green} />
              <MonoRow k="image" v="piece_0427.img" />
              <MonoRow k="méthode" v="selon modèle et autorisation" color={C.dim} />
              <div style={{ marginTop: 20, height: 18, borderRadius: 9, background: "#0A1628", border: `1px solid ${C.line}`, overflow: "hidden" }}>
                <div style={{ width: `${acq}%`, height: "100%", background: `linear-gradient(90deg, ${C.blue}, ${C.cyan})`, boxShadow: `0 0 16px ${C.cyan}` }} />
              </div>
              <div style={{ fontFamily: FONT.mono, fontSize: 22, color: C.cyan, marginTop: 10, textAlign: "right" }}>{acq.toFixed(0)} %</div>
            </HoloPanel>
          </Flip>
          <Flip t={t} from={cC} to={cD}>
            <HoloPanel width={860} title="Préservation" tag="SHA-256" icon={<IconHash size={54} color={C.cyan} />}>
              <div style={{ fontFamily: FONT.mono, fontSize: 24, color: C.cyan, lineHeight: 1.45, wordBreak: "break-all", minHeight: 72 }}>
                {HASH.slice(0, hashChars)}
                <span style={{ opacity: Math.floor(t * 3) % 2 }}>▌</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6, fontFamily: FONT.ui, fontWeight: 600, fontSize: 24, color: C.green, opacity: tw(t, [cC + 2.3, cC + 2.7], [0, 1]) }}>
                <IconCheck size={30} color={C.green} /> Empreinte vérifiée — intégrité garantie
              </div>
              <div style={{ marginTop: 14, fontFamily: FONT.display, fontWeight: 700, fontSize: 24, color: C.dim, letterSpacing: 2 }}>CHAÎNE DE CONSERVATION</div>
              {custody.map(([h, l], k) => (
                <MonoRow key={k} k={h} v={l} color={C.white} p={tw(t, [cC + 2.6 + k * 0.3, cC + 3.0 + k * 0.3], [0, 1])} />
              ))}
            </HoloPanel>
          </Flip>
          <Flip t={t} from={cD} to={-1}>
            <HoloPanel width={860} title="Analyse" tag="COPIE" icon={<IconSearch size={54} color={C.cyan} />}>
              <div style={{ display: "flex", gap: 18, alignItems: "stretch" }}>
                <div style={{ flex: 1, padding: 18, borderRadius: 14, border: `1px solid ${C.orange}66`, background: C.orangeSoft }}>
                  <IconLock size={40} color={C.orange} />
                  <div style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 26, color: C.white, marginTop: 8 }}>Original</div>
                  <div style={{ fontFamily: FONT.mono, fontSize: 20, color: "#FFD2A8" }}>scellé · lecture seule</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", fontSize: 40, color: C.cyan }}>→</div>
                <div style={{ flex: 1, padding: 18, borderRadius: 14, border: `1px solid ${C.cyan}66`, background: `${C.blue}18` }}>
                  <IconSearch size={40} color={C.cyan} />
                  <div style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 26, color: C.white, marginTop: 8 }}>Copie de travail</div>
                  <div style={{ fontFamily: FONT.mono, fontSize: 20, color: C.cyan }}>empreinte identique</div>
                </div>
              </div>
              {/* frise chronologique reconstituée */}
              <div style={{ position: "relative", height: 70, marginTop: 22 }}>
                <div style={{ position: "absolute", left: 0, right: 0, top: 34, height: 2, background: C.line }} />
                {[0.08, 0.22, 0.41, 0.58, 0.77, 0.9].map((x, k) => {
                  const p = tw(t, [cD + 1.2 + k * 0.25, cD + 1.6 + k * 0.25], [0, 1]);
                  return (
                    <div key={k} style={{ position: "absolute", left: `${x * 100}%`, top: 34 - 22 * p, width: 12, height: 44 * p, borderRadius: 4, background: k === 3 ? C.orange : C.cyan, translate: "-50% 0", boxShadow: `0 0 10px ${k === 3 ? C.orange : C.cyan}` }} />
                  );
                })}
              </div>
              <div style={{ fontFamily: FONT.ui, fontSize: 24, color: C.dim, opacity: tw(t, [cD + 3, cD + 3.5], [0, 1]) }}>
                Constatations documentées → rapport d'expertise
              </div>
            </HoloPanel>
          </Flip>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

import React from "react";
import { ProblemItem, ProblemScene } from "./S2Problem";

/** Problem (angle Compositions) — one card per voice-over line, then the statement. */
const ITEMS: ProblemItem[] = [
  { id: "k03", icon: "moon", title: "Il révise la veille", sub: "tout au dernier moment" },
  { id: "k04", icon: "clock", title: "Il panique le jour J", sub: "le stress lui fait perdre ses moyens" },
  { id: "k05", icon: "question", title: "Il oublie tout devant sa copie", sub: "rien n'a vraiment été retenu" },
];

export const S2ProblemComposition: React.FC = () => (
  <ProblemScene
    eyebrow="Le constat des parents"
    items={ITEMS}
    statement={{ top: "Le problème n'est pas l'effort…", middle: "c'est", bottom: "*la méthode.*", middleLast: false }}
  />
);

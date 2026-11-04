import React from "react";
import { ProblemItem, ProblemScene } from "./S2Problem";

/** Problem (angle Économie) — anchored to voice-over lines e03–e07. */
const ITEMS: ProblemItem[] = [
  { icon: "coins", title: "Cours particuliers coûteux", sub: "un budget à prévoir chaque mois", line: "e03" },
  { icon: "clock", title: "Heures de répétition limitées", sub: "quelques séances par semaine", line: "e04" },
  { icon: "moon", title: "Seul le soir, devant ses devoirs", sub: "quand personne ne peut l'aider", line: "e05" },
  { icon: "phone", title: "ChatGPT déjà dans sa poche", sub: "disponible à toute heure", line: "e06", positive: true },
];

export const S2ProblemEconomie: React.FC = () => (
  <ProblemScene
    eyebrow="Le constat des parents"
    items={ITEMS}
    statementLine="e07"
    statement={{ top: "Encore faut-il s'en servir pour", middle: "et pas pour copier", bottom: "*apprendre*", middleLast: true }}
  />
);

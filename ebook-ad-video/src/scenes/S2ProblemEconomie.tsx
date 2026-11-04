import React from "react";
import { ProblemItem, ProblemScene } from "./S2Problem";

/** Problem (angle Économie) — one card per voice-over line, then the statement. */
const ITEMS: ProblemItem[] = [
  { id: "e03", icon: "coins", title: "Cours particuliers coûteux", sub: "un budget à prévoir chaque mois" },
  { id: "e04", icon: "clock", title: "Heures de répétition limitées", sub: "quelques séances par semaine" },
  { id: "e05", icon: "moon", title: "Seul le soir, devant ses devoirs", sub: "quand personne ne peut l'aider" },
  { id: "e06", icon: "phone", title: "ChatGPT déjà dans sa poche", sub: "disponible à toute heure", positive: true },
];

export const S2ProblemEconomie: React.FC = () => (
  <ProblemScene
    eyebrow="Le constat des parents"
    items={ITEMS}
    statement={{ top: "Encore faut-il s'en servir pour", middle: "et pas pour copier", bottom: "*apprendre*", middleLast: true }}
  />
);

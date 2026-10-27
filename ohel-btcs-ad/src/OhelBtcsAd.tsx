import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { z } from "zod";
import { COLORS, CONTACT } from "./config/brand";
import { AUDIO, MEDIA, MediaSlot } from "./config/assets";
import { FPS, SCENES, SceneId, TRANSITION_FRAMES, sceneFrames } from "./config/script";
import { blockWipe } from "./components/BlockWipe";
import { BandeauMaquette, SousTitres, ZonesSecurite } from "./components/overlays";
import { SceneA } from "./scenes/SceneA";
import { SceneB } from "./scenes/SceneB";
import { SceneC } from "./scenes/SceneC";
import { SceneD } from "./scenes/SceneD";
import { SceneE } from "./scenes/SceneE";
import { SceneF } from "./scenes/SceneF";
import { SceneG } from "./scenes/SceneG";
import { SceneH } from "./scenes/SceneH";

export const adSchema = z.object({
  /** Incruste les sous-titres (version sous-titrée). */
  sousTitres: z.boolean(),
  /** "maquette" tolère les éléments manquants ; "final" bloque le rendu s'il en manque. */
  mode: z.enum(["maquette", "final"]),
  /** Affiche les zones masquées par les interfaces (contrôle uniquement). */
  zonesSecurite: z.boolean(),
});

export type AdProps = z.infer<typeof adSchema>;

export const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  A: SceneA,
  B: SceneB,
  C: SceneC,
  D: SceneD,
  E: SceneE,
  F: SceneF,
  G: SceneG,
  H: SceneH,
};

/** Liste ce qui manque pour un rendu final (aucun faux contenu exporté). */
export const elementsManquants = (): string[] => {
  const manque: string[] = [];
  (Object.entries(MEDIA) as [string, MediaSlot][]).forEach(([cle, slot]) => {
    if (slot.obligatoire && !slot.src) manque.push(`visuel « ${cle} » (prompt ${slot.prompt ?? "—"})`);
  });
  if (!CONTACT.whatsapp) manque.push("numéro WhatsApp");
  if (!AUDIO.voixOff) manque.push("voix off enregistrée");
  else if (AUDIO.voixOffProvisoire) manque.push("voix off définitive (la voix actuelle est une synthèse provisoire)");
  if (!AUDIO.musique) manque.push("musique sous licence");
  return manque;
};

export const OhelBtcsAd: React.FC<AdProps> = ({ sousTitres, mode, zonesSecurite }) => {
  return (
    <AbsoluteFill style={{ background: COLORS.anthracite }}>
      <TransitionSeries>
        {SCENES.flatMap((s, i) => {
          const Scene = SCENE_COMPONENTS[s.id];
          const items = [
            <TransitionSeries.Sequence key={s.id} name={`${s.id} — ${s.nom}`} durationInFrames={sceneFrames(s)}>
              <Scene />
            </TransitionSeries.Sequence>,
          ];
          const timing = linearTiming({ durationInFrames: TRANSITION_FRAMES[s.enchainement] });
          if (i < SCENES.length - 1 && s.enchainement === "blocs") {
            items.push(
              <TransitionSeries.Transition key={`${s.id}-t`} presentation={blockWipe({ rangees: 9 })} timing={timing} />,
            );
          } else if (i < SCENES.length - 1 && s.enchainement === "fondu") {
            items.push(<TransitionSeries.Transition key={`${s.id}-t`} presentation={fade()} timing={timing} />);
          }
          return items;
        })}
      </TransitionSeries>

      {AUDIO.musique ? <Audio src={staticFile(AUDIO.musique)} volume={AUDIO.volumeMusique} /> : null}
      {AUDIO.voixOff ? <Audio src={staticFile(AUDIO.voixOff)} /> : null}
      {AUDIO.effets.map((e) => (
        <Sequence key={`${e.src}-${e.t}`} from={Math.round(e.t * FPS)} layout="none">
          <Audio src={staticFile(e.src)} volume={e.volume ?? 0.6} />
        </Sequence>
      ))}

      {sousTitres ? <SousTitres /> : null}
      {zonesSecurite ? <ZonesSecurite /> : null}
      {mode === "maquette" ? <BandeauMaquette /> : null}
    </AbsoluteFill>
  );
};

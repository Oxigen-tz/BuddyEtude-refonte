import React from "react";
import { Composition, Still } from "remotion";
import { SceneTest } from "./scenes/SceneTest";
import { MascotteFiche } from "./scenes/MascotteFiche";
import { OrbiDetoure } from "./scenes/OrbiDetoure";
import { Episode } from "./engine/Episode";
import { EPISODES } from "./episodes";

// Les scripts contiennent des éléments React : on ne passe que l'identifiant (les props sont sérialisées en JSON).
const EpisodeParId: React.FC<{ id: string }> = ({ id }) => <Episode script={EPISODES.find((e) => e.id === id)!} />;

export const Root: React.FC = () => (
  <>
    {EPISODES.map((s) => (
      <Composition key={s.id} id={s.id} component={EpisodeParId} width={1080} height={1920} fps={30} durationInFrames={Math.round(s.duree * 30)} defaultProps={{ id: s.id }} />
    ))}
    <Composition id="SceneTest" component={SceneTest} width={1080} height={1920} fps={30} durationInFrames={150} defaultProps={{ mascotte: "orbi" as const }} />
    <Still id="Mascotte-orbi" component={MascotteFiche} width={1080} height={1350} defaultProps={{ variante: "orbi" as const, numero: 1 }} />
    <Still id="Mascotte-surli" component={MascotteFiche} width={1080} height={1350} defaultProps={{ variante: "surli" as const, numero: 2 }} />
    <Still id="Orbi-site-content" component={OrbiDetoure} width={800} height={800} defaultProps={{ humeur: "content" as const, rotationY: 0.35 }} />
    <Still id="Orbi-site-surpris" component={OrbiDetoure} width={800} height={800} defaultProps={{ humeur: "surpris" as const, rotationY: -0.3 }} />
    <Still id="Orbi-site-inquiet" component={OrbiDetoure} width={800} height={800} defaultProps={{ humeur: "inquiet" as const, rotationY: 0.2 }} />
    <Still id="Mascotte-bulle" component={MascotteFiche} width={1080} height={1350} defaultProps={{ variante: "bulle" as const, numero: 3 }} />
  </>
);

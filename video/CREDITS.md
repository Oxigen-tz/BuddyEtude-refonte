# Crédits et licences des éléments utilisés

Dernière vérification : 24/11/2026.

## Éléments visuels

| Élément | Origine | Licence |
|---|---|---|
| Personnages (étudiant, binôme, mentor) | Construits dans le code à partir de primitives Three.js ([src/engine/Personnage.tsx](src/engine/Personnage.tsx)) | Création originale pour BuddyEtude |
| Mascottes (Orbi, Surli, Bulle) | Construites dans le code ([src/engine/Mascotte.tsx](src/engine/Mascotte.tsx)) | Création originale. Ce n'est pas un personnage existant, et en particulier pas la mascotte de Claude Code |
| Décors (chambre, façade, amphi, bibliothèque, ville, rayons, particules) et accessoires | Construits dans le code ([src/engine/](src/engine/)), textures dessinées sur canvas (papier Seyès compris) | Création originale |
| Emojis des pictos et des cartes | Police emoji du système (Segoe UI Emoji de Microsoft) au moment du rendu | Images produites avec une police système : usage courant. Pour éliminer tout doute, on peut les remplacer par des pictos dessinés dans le code |
| Logo et couleurs BuddyEtude | Le site BuddyEtude | Propriété du projet |

**Aucun modèle 3D externe** (GLB/GLTF), aucune image et aucun son tiers ne sont utilisés pour l'instant. Si on en ajoute un (par exemple un modèle CC0 de Quaternius ou de Kenney), il sera listé ici avec son lien et sa licence avant d'être utilisé.

## Polices (chargées depuis Google Fonts via `@remotion/google-fonts`)

| Police | Licence |
|---|---|
| Bricolage Grotesque | SIL Open Font License 1.1 |
| Plus Jakarta Sans | SIL Open Font License 1.1 |
| Caveat (écriture manuscrite du tableau blanc) | SIL Open Font License 1.1 |

## Logiciels

| Paquet | Licence |
|---|---|
| Remotion (`remotion`, `@remotion/cli`, `@remotion/three`, `@remotion/google-fonts`) 4.0.547 | Licence Remotion : gratuite pour un particulier ou une entreprise de 3 personnes maximum ; au-delà, une licence entreprise est nécessaire (https://www.remotion.dev/license) |
| three 0.187.0 | MIT |
| @react-three/fiber 9.8.2 | MIT |
| React 19.2.0 | MIT |

## Son

Les vidéos sont rendues avec une **piste audio vide**. Aucune musique protégée n'est utilisée.

**Fond musical** (`--musique`) : musiques originales synthétisées note par note dans le code ([scripts/musique-douce.mjs](scripts/musique-douce.mjs) par défaut, [scripts/musique.mjs](scripts/musique.mjs) pour la version énergique), sans aucun échantillon externe : libre de droits.

**Voix ElevenLabs** : voix de la bibliothèque ElevenLabs (actuellement « Corentin »), utilisées avec l'offre Starter, qui inclut la licence commerciale.

**Voix off de synthèse** (`npm run voix`) : voix neuronales françaises de Microsoft (Henri, Denise, Rémy, Vivienne, Éloïse), générées avec l'outil libre `edge-tts` (licence LGPL-3.0). Cet outil passe par le service de lecture à voix haute du navigateur Edge : c'est un usage **non officiel**, sans garantie ni licence commerciale explicite de Microsoft. Pour un usage commercial sans ambiguïté, utiliser les mêmes voix via le service officiel Azure AI Speech, ou une voix enregistrée.

# Vidéos BuddyEtude — mini-série 3D

10 épisodes verticaux (1080×1920, 30 images/s, 30 à 42 s) pour TikTok, Reels et Shorts. Ce dossier est indépendant de l'application : il a ses propres dépendances et n'est ni déployé ni testé avec le site.

## Commandes (depuis ce dossier)

```bash
npm install                          # une seule fois
npm run episodes                     # rend les 10 épisodes → out/BuddyEtude-ep01.mp4 … ep10.mp4
npm run episodes -- ep03 ep07        # rend seulement certains épisodes
npm run narration                    # écrit out/narration/epXX.txt et .srt (texte + timings de la voix)
npm run voix -- ep03                 # ajoute une voix off naturelle → out/BuddyEtude-ep03-voix-henri.mp4
npm run voix -- ep03 fr-FR-DeniseNeural   # même chose avec une autre voix
npm run voix -- ep03 elevenlabs:<voice_id>   # voix ElevenLabs (clé dans ELEVENLABS_API_KEY) → out/BuddyEtude-ep03-voix-elevenlabs.mp4
npm run voix -- ep03 elevenlabs:<voice_id> --musique --caler   # version finale : montage recalé sur la voix (sans blancs)
npm run voix -- ep03 elevenlabs:<voice_id> --musique   # + fond musical doux, très bas sous la voix (--musique=energique : la musique rythmée des reels)
npm run voix -- echantillons         # un extrait de chaque voix Microsoft dans out/voix/echantillons/
npm run studio                       # aperçu interactif dans le navigateur (modifier, revoir)
```

La voix off demande Python et `pip install --user edge-tts==7.3.1` (voir CREDITS.md pour la réserve sur la licence). Les vidéos de base ont une **piste audio vide**. Enregistre la voix en suivant `out/narration/epXX.txt`, ou importe le `.srt` dans un logiciel de montage (CapCut, Premiere…).

## Organisation

- `src/engine/` : le moteur, qu'on ne retouche pas pour une nouvelle vidéo.
  - `Personnage` : poses, expressions, regard, respiration, clignement.
  - `Mascotte` : Orbi.
  - `Decor` et `Lieux` : chambre, amphi, bibliothèque.
  - `Facade` : la signature « fenêtres + fil citron ».
  - `Accessoires` : pictos, feuille surlignée, copie, téléphone, réveil, fumée.
  - `CarteUI` : cartes d'interface reprenant les libellés du site.
  - `Signature` : bulles et fin logo.
  - `Episode` : assemble les plans.
- `src/episodes/` :
  - `textes.ts` : bulles et narration de chaque épisode ;
  - `epXX.tsx` : les plans de chaque épisode ;
  - `distribution.ts` : les personnages.
- **Pour ajouter un épisode** : ajouter ses textes dans `textes.ts`, créer `ep11.tsx`, puis l'ajouter à `episodes/index.ts`.

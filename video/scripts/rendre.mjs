// Rend les épisodes en MP4 1080×1920 (piste audio vide) dans out/.
// Usage : npm run episodes            → les 10 épisodes
//         npm run episodes -- ep03 ep07 → seulement ceux-là
import { execFileSync } from "node:child_process";

const tous = ["ep01", "ep02", "ep03", "ep04", "ep05", "ep06", "ep07", "ep08", "ep09", "ep10"];
const choix = process.argv.slice(2).length ? process.argv.slice(2) : tous;
for (const id of choix) {
  const debut = Date.now();
  execFileSync(
    "npx",
    ["remotion", "render", "src/index.ts", id, `out/BuddyEtude-${id}.mp4`, "--gl=angle", "--codec=h264", "--crf=18", "--pixel-format=yuv420p", "--color-space=bt709", "--enforce-audio-track", "--log=error"],
    { stdio: "inherit", shell: true },
  );
  console.log(`${id} rendu en ${Math.round((Date.now() - debut) / 1000)} s`);
}

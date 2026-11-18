// Lance les tests des règles Firestore et Storage. À exécuter via `npm run test:rules`
// (qui démarre les émulateurs autour de ce script).
import { initializeTestEnvironment } from "@firebase/rules-unit-testing";
import { readFileSync } from "node:fs";
import { firestoreTests } from "./firestore.test.mjs";
import { storageTests } from "./storage.test.mjs";

const env = await initializeTestEnvironment({
  projectId: "demo-buddyetude",
  firestore: { rules: readFileSync("firestore.rules", "utf8"), host: "127.0.0.1", port: 8080 },
  storage: { rules: readFileSync("storage.rules", "utf8"), host: "127.0.0.1", port: 9199 },
});

let pass = 0;
const failures = [];
const t = async (name, promise) => {
  try {
    await promise;
    pass++;
  } catch (e) {
    failures.push(`${name} — ${String(e.message).split("\n")[0]}`);
  }
};

// Les refus attendus déclenchent des journaux d'erreur du SDK : on les masque pour garder
// une sortie lisible (seul le bilan compte).
const originalError = console.error;
const originalWarn = console.warn;
console.error = () => {};
console.warn = () => {};

try {
  await firestoreTests(env, t);
  await storageTests(env, t);
} finally {
  console.error = originalError;
  console.warn = originalWarn;
  await env.cleanup();
}

for (const f of failures) console.log("  ÉCHEC", f);
console.log(`\nRègles : ${pass} test(s) réussi(s), ${failures.length} échec(s)`);
process.exit(failures.length ? 1 : 0);

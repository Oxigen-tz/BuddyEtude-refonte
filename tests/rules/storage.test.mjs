// Tests des règles Storage (storage.rules) sur l'émulateur local.
import { assertSucceeds, assertFails } from "@firebase/rules-unit-testing";
import { ref, uploadBytes, getBytes, deleteObject } from "firebase/storage";

export async function storageTests(env, t) {
  const a = env.authenticatedContext("uidA").storage();
  const c = env.authenticatedContext("uidC").storage();
  const anon = env.unauthenticatedContext().storage();
  const small = new Uint8Array([1, 2, 3]);
  const big = new Uint8Array(10 * 1024 * 1024 + 1);
  const meta = { contentType: "application/pdf" };

  await t("fichier : envoi dans son dossier", assertSucceeds(uploadBytes(ref(a, "chat_files/uidA/1_cours.pdf"), small, meta)));
  await t("fichier : lecture par un utilisateur connecté", assertSucceeds(getBytes(ref(c, "chat_files/uidA/1_cours.pdf"))));
  await t("fichier : lecture par un visiteur refusée", assertFails(getBytes(ref(anon, "chat_files/uidA/1_cours.pdf"))));
  await t("fichier : envoi dans le dossier d'un autre refusé", assertFails(uploadBytes(ref(c, "chat_files/uidA/2_pirate.pdf"), small, meta)));
  await t("fichier : écraser un fichier refusé", assertFails(uploadBytes(ref(a, "chat_files/uidA/1_cours.pdf"), small, meta)));
  await t("fichier : plus de 10 Mo refusé", assertFails(uploadBytes(ref(a, "chat_files/uidA/3_gros.pdf"), big, meta)));
  await t("fichier : exécutable refusé", assertFails(uploadBytes(ref(a, "chat_files/uidA/4_virus.EXE"), small, meta)));
  await t("fichier : script .js refusé", assertFails(uploadBytes(ref(a, "chat_files/uidA/5_x.js"), small, meta)));
  await t("fichier : supprimer celui d'un autre refusé", assertFails(deleteObject(ref(c, "chat_files/uidA/1_cours.pdf"))));
  await t("fichier : supprimer le sien", assertSucceeds(deleteObject(ref(a, "chat_files/uidA/1_cours.pdf"))));
  await t("fichier : autre dossier refusé", assertFails(uploadBytes(ref(a, "autre/x.pdf"), small, meta)));
}

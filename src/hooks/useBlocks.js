import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db } from "@/firebase/config";
import { pairId } from "@/lib/pairs";

/** uids que l'utilisateur a bloqués (documents blocks/<moi>_<bloqué>), en temps réel. */
export function useBlocks(uid) {
  const [blocked, setBlocked] = useState(() => new Set());

  useEffect(() => {
    if (!uid) { setBlocked(new Set()); return; }
    const unsub = onSnapshot(
      query(collection(db, "blocks"), where("blocker", "==", uid)),
      (snap) => setBlocked(new Set(snap.docs.map((d) => d.data().blocked))),
      (error) => console.error("Erreur de chargement des blocages:", error)
    );
    return () => unsub();
  }, [uid]);

  return blocked;
}

/**
 * Bloquer : supprime la demande / le lien de binôme entre nous, puis enregistre le blocage.
 * La personne bloquée ne peut plus nous envoyer de demande (règles Firestore) et n'apparaît
 * plus dans notre recherche.
 */
export async function blockUser(myUid, otherUid, otherName = "") {
  await deleteDoc(doc(db, "requests", pairId(myUid, otherUid))).catch(() => {});
  await setDoc(doc(db, "blocks", `${myUid}_${otherUid}`), {
    blocker: myUid,
    blocked: otherUid,
    blocked_name: otherName,
    createdAt: serverTimestamp(),
  });
}

export const unblockUser = (myUid, otherUid) => deleteDoc(doc(db, "blocks", `${myUid}_${otherUid}`));

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";

/**
 * Demandes de binôme qui concernent l'utilisateur, en temps réel.
 *  - incoming : reçues (to_uid == moi)
 *  - outgoing : envoyées (from_uid == moi)
 * Chaque demande a pour id la paire de uids (une seule demande possible par paire).
 */
export function useRequests(uid) {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  // Compte pour lequel les demandes sont chargées : « loading » est vrai tant que ce n'est pas le
  // compte actuel (sinon, à la connexion, l'état « chargé » du rendu sans compte restait affiché
  // un instant avec des listes vides)
  const [readyUid, setReadyUid] = useState(undefined);

  useEffect(() => {
    if (!uid) {
      setIncoming([]);
      setOutgoing([]);
      setReadyUid(uid ?? null);
      return;
    }

    // « Chargé » seulement une fois la réponse du serveur reçue : le premier résultat peut venir du
    // cache local (alimenté par d'autres écoutes) et être incomplet ; s'y fier faisait ignorer
    // les liens /Messages?chat= et /Search?contact=
    let inReady = false;
    let outReady = false;
    const markReady = () => { if (inReady && outReady) setReadyUid(uid); };
    const toList = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const unsubIn = onSnapshot(
      query(collection(db, "requests"), where("to_uid", "==", uid)),
      { includeMetadataChanges: true },
      (snap) => { setIncoming(toList(snap)); if (!snap.metadata.fromCache) { inReady = true; markReady(); } },
      (error) => { console.error("Erreur de chargement des demandes reçues:", error); inReady = true; markReady(); }
    );
    const unsubOut = onSnapshot(
      query(collection(db, "requests"), where("from_uid", "==", uid)),
      { includeMetadataChanges: true },
      (snap) => { setOutgoing(toList(snap)); if (!snap.metadata.fromCache) { outReady = true; markReady(); } },
      (error) => { console.error("Erreur de chargement des demandes envoyées:", error); outReady = true; markReady(); }
    );

    return () => { unsubIn(); unsubOut(); };
  }, [uid]);

  return { incoming, outgoing, loading: readyUid !== (uid ?? null) };
}

/**
 * Relation avec chaque autre étudiant, déduite des demandes :
 *  "buddy"    → demande acceptée
 *  "received" → il/elle m'a envoyé une demande en attente
 *  "sent"     → je lui ai envoyé une demande en attente
 * Renvoie une Map uid → { status, requestId, name }.
 */
export function buildRelations({ incoming, outgoing }) {
  const relations = new Map();
  incoming.forEach((r) => {
    if (r.status === "accepted" || r.status === "pending") {
      relations.set(r.from_uid, {
        status: r.status === "accepted" ? "buddy" : "received",
        requestId: r.id,
        name: r.from_name || "?",
        kind: r.kind || "buddy",
        subject: r.subject || "",
        message: r.message || "",
      });
    }
  });
  outgoing.forEach((r) => {
    if (r.status === "accepted" || r.status === "pending") {
      relations.set(r.to_uid, {
        status: r.status === "accepted" ? "buddy" : "sent",
        requestId: r.id,
        name: r.to_name || "?",
      });
    }
  });
  return relations;
}

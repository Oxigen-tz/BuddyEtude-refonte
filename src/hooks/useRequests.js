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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setIncoming([]);
      setOutgoing([]);
      setLoading(false);
      return;
    }

    let inReady = false;
    let outReady = false;
    const markReady = () => { if (inReady && outReady) setLoading(false); };
    const toList = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const unsubIn = onSnapshot(
      query(collection(db, "requests"), where("to_uid", "==", uid)),
      (snap) => { setIncoming(toList(snap)); inReady = true; markReady(); },
      (error) => { console.error("Erreur de chargement des demandes reçues:", error); inReady = true; markReady(); }
    );
    const unsubOut = onSnapshot(
      query(collection(db, "requests"), where("from_uid", "==", uid)),
      (snap) => { setOutgoing(toList(snap)); outReady = true; markReady(); },
      (error) => { console.error("Erreur de chargement des demandes envoyées:", error); outReady = true; markReady(); }
    );

    return () => { unsubIn(); unsubOut(); };
  }, [uid]);

  return { incoming, outgoing, loading };
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

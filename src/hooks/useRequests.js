import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";

/**
 * Demandes de binôme qui concernent l'utilisateur, en temps réel.
 *  - incoming : reçues (to_email == moi)
 *  - outgoing : envoyées (from_email == moi)
 * Chaque élément contient { id, ...données du document }.
 */
export function useRequests(email) {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) {
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
      query(collection(db, "requests"), where("to_email", "==", email)),
      (snap) => { setIncoming(toList(snap)); inReady = true; markReady(); },
      (error) => { console.error("Erreur de chargement des demandes reçues:", error); inReady = true; markReady(); }
    );
    const unsubOut = onSnapshot(
      query(collection(db, "requests"), where("from_email", "==", email)),
      (snap) => { setOutgoing(toList(snap)); outReady = true; markReady(); },
      (error) => { console.error("Erreur de chargement des demandes envoyées:", error); outReady = true; markReady(); }
    );

    return () => { unsubIn(); unsubOut(); };
  }, [email]);

  return { incoming, outgoing, loading };
}

/**
 * Relation avec chaque autre étudiant, déduite des demandes :
 *  "buddy"    → une demande acceptée existe (dans un sens ou dans l'autre)
 *  "received" → il/elle m'a envoyé une demande en attente
 *  "sent"     → je lui ai envoyé une demande en attente
 * Renvoie une Map email → { status, requestIds, name }.
 */
export function buildRelations({ incoming, outgoing }, myEmail) {
  const relations = new Map();
  const rank = { buddy: 3, received: 2, sent: 1 };

  const add = (email, status, requestId, name) => {
    if (!email || email === myEmail) return;
    const current = relations.get(email);
    if (!current) {
      relations.set(email, { status, requestIds: [requestId], name: name || email });
      return;
    }
    current.requestIds.push(requestId);
    if (rank[status] > rank[current.status]) current.status = status;
    if (!current.name || current.name === email) current.name = name || current.name;
  };

  incoming.forEach((r) => {
    if (r.status === "accepted") add(r.from_email, "buddy", r.id, r.from_name);
    else if (r.status === "pending") add(r.from_email, "received", r.id, r.from_name);
  });
  outgoing.forEach((r) => {
    if (r.status === "accepted") add(r.to_email, "buddy", r.id, r.to_name);
    else if (r.status === "pending") add(r.to_email, "sent", r.id, r.to_name);
  });

  return relations;
}

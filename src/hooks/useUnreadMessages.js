import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";

/**
 * Messages non lus de l'utilisateur, en temps réel.
 * Chaque message envoyé porte unreadBy = [uid du destinataire] ; le destinataire s'en retire
 * en ouvrant la conversation (Messages.jsx).
 *
 * Renvoie { total, byUid } où byUid[uid de l'expéditeur] = nombre de messages non lus.
 */
export function useUnreadMessages(uid) {
  const [state, setState] = useState({ total: 0, byUid: {} });

  useEffect(() => {
    if (!uid) {
      setState({ total: 0, byUid: {} });
      return;
    }

    const unsub = onSnapshot(
      query(collection(db, "messages"), where("unreadBy", "array-contains", uid)),
      (snap) => {
        const byUid = {};
        snap.docs.forEach((d) => {
          const sender = d.data().senderUid;
          if (sender && sender !== uid) byUid[sender] = (byUid[sender] || 0) + 1;
        });
        setState({ total: Object.values(byUid).reduce((a, b) => a + b, 0), byUid });
      },
      (error) => console.error("Erreur de chargement des messages non lus:", error)
    );

    return () => unsub();
  }, [uid]);

  return state;
}

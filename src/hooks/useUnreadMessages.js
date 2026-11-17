import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";

/**
 * Messages non lus de l'utilisateur, en temps réel.
 * Chaque message envoyé porte unreadBy = [destinataire] ; le destinataire s'en retire en ouvrant
 * la conversation (Messages.jsx). Les messages antérieurs à ce champ sont considérés comme lus.
 *
 * Renvoie { total, byEmail } où byEmail[emailDeLExpéditeur] = nombre de messages non lus.
 */
export function useUnreadMessages(email) {
  const [state, setState] = useState({ total: 0, byEmail: {} });

  useEffect(() => {
    if (!email) {
      setState({ total: 0, byEmail: {} });
      return;
    }

    const unsub = onSnapshot(
      query(collection(db, "messages"), where("unreadBy", "array-contains", email)),
      (snap) => {
        const byEmail = {};
        snap.docs.forEach((d) => {
          const sender = d.data().senderEmail;
          if (sender && sender !== email) byEmail[sender] = (byEmail[sender] || 0) + 1;
        });
        setState({ total: Object.values(byEmail).reduce((a, b) => a + b, 0), byEmail });
      },
      (error) => console.error("Erreur de chargement des messages non lus:", error)
    );

    return () => unsub();
  }, [email]);

  return state;
}

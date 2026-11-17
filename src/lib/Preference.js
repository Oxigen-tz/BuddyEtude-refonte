// Préférences propres à l'appareil (stockées dans le navigateur, pas dans Firestore).
// Le réglage "Alertes de demandes" de la page Paramètres écrit ici ; Layout.jsx le lit
// avant d'afficher une notification.

const REQUEST_ALERTS_KEY = "buddyetude_request_alerts";

export const getRequestAlertsEnabled = () => {
  try {
    return localStorage.getItem(REQUEST_ALERTS_KEY) !== "off";
  } catch {
    // Stockage indisponible (navigation privée stricte, etc.) : alertes activées par défaut
    return true;
  }
};

export const setRequestAlertsEnabled = (enabled) => {
  try {
    localStorage.setItem(REQUEST_ALERTS_KEY, enabled ? "on" : "off");
  } catch {
    // Rien à faire : le réglage ne sera simplement pas conservé
  }
};
// Notifications push sur cet appareil (Firebase Cloud Messaging).
// Disponible si : clé VAPID fournie (VITE_FCM_VAPID_KEY), site installé en production (service
// worker), navigateur compatible. Le jeton de l'appareil est rangé dans users/<uid>/private/push,
// lu par les Cloud Functions (sendPush).
import { arrayRemove, arrayUnion, doc, getDoc, setDoc } from "firebase/firestore";
import app, { db } from "../firebase/config";

const VAPID_KEY = import.meta.env.VITE_FCM_VAPID_KEY;
const LOCAL_KEY = "buddyetude_push_token";
const pushRef = (uid) => doc(db, "users", uid, "private", "push");

export async function pushSupported() {
  if (!VAPID_KEY || !import.meta.env.PROD) return false;
  if (!("serviceWorker" in navigator) || !("Notification" in window) || !("PushManager" in window)) return false;
  try {
    const { isSupported } = await import("firebase/messaging");
    return await isSupported();
  } catch {
    return false;
  }
}

const readLocalToken = () => { try { return localStorage.getItem(LOCAL_KEY); } catch { return null; } };
const writeLocalToken = (token) => { try { token ? localStorage.setItem(LOCAL_KEY, token) : localStorage.removeItem(LOCAL_KEY); } catch { /* stockage indisponible */ } };

// Activées sur CET appareil ? (jeton local encore présent côté serveur et permission accordée)
export async function pushEnabledHere(uid) {
  const token = readLocalToken();
  if (!token || Notification.permission !== "granted") return false;
  const snap = await getDoc(pushRef(uid)).catch(() => null);
  return Boolean(snap?.exists() && (snap.data().tokens || []).includes(token));
}

// Renvoie "granted", "denied" (refusé dans le navigateur) ou lève une erreur
export async function enablePush(uid) {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return permission;
  const { getMessaging, getToken } = await import("firebase/messaging");
  const registration = await navigator.serviceWorker.ready;
  const token = await getToken(getMessaging(app), { vapidKey: VAPID_KEY, serviceWorkerRegistration: registration });
  await setDoc(pushRef(uid), { tokens: arrayUnion(token) }, { merge: true });
  writeLocalToken(token);
  return "granted";
}

export async function disablePush(uid) {
  const token = readLocalToken();
  if (token) await setDoc(pushRef(uid), { tokens: arrayRemove(token) }, { merge: true });
  try {
    const { getMessaging, deleteToken } = await import("firebase/messaging");
    await deleteToken(getMessaging(app));
  } catch { /* déjà supprimé */ }
  writeLocalToken(null);
}

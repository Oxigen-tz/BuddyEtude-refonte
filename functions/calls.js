// Appels vidéo intégrés (Daily.co) : salle privée par binôme, groupe ou session, et jeton
// d'accès nominatif délivré uniquement aux participants (vérifiés par createCallToken).
// Sans jeton, personne ne peut entrer dans une salle privée : le lien seul ne suffit pas.
const crypto = require("node:crypto");

const DAILY_API = process.env.DAILY_API_BASE || "https://api.daily.co/v1";
const CALL_DURATION_S = 4 * 3600;   // une salle et un jeton restent valables 4 h
const MAX_PARTICIPANTS = { pair: 4, session: 4, group: 8 };

// Nom de salle stable et non devinable pour un contexte donné (lettres, chiffres, tirets)
const roomNameFor = (type, id) => "be-" + crypto.createHash("sha256").update(`${type}:${id}`).digest("hex").slice(0, 24);

async function daily(apiKey, path, { method = "GET", body } = {}, fetchImpl = fetch) {
  const res = await fetchImpl(`${DAILY_API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

// Renvoie l'adresse de la salle, en la créant si besoin ou en prolongeant sa validité
async function ensureRoom(apiKey, { type, id }, { now = Date.now(), fetchImpl = fetch } = {}) {
  const name = roomNameFor(type, id);
  const exp = Math.floor(now / 1000) + CALL_DURATION_S;
  const properties = { exp, max_participants: MAX_PARTICIPANTS[type] || 4, enable_prejoin_ui: true, eject_at_room_exp: true };

  const existing = await daily(apiKey, `/rooms/${name}`, {}, fetchImpl);
  if (existing.status === 200 && existing.data?.url) {
    // Salle déjà créée : on repousse son expiration si elle approche
    const current = existing.data.config?.exp || 0;
    if (current < exp - 3600) await daily(apiKey, `/rooms/${name}`, { method: "POST", body: { properties: { exp } } }, fetchImpl);
    return { name, url: existing.data.url };
  }
  const created = await daily(apiKey, "/rooms", { method: "POST", body: { name, privacy: "private", properties } }, fetchImpl);
  if (created.status === 200 && created.data?.url) return { name, url: created.data.url };
  // Créée entre-temps par l'autre participant
  const retry = await daily(apiKey, `/rooms/${name}`, {}, fetchImpl);
  if (retry.status === 200 && retry.data?.url) return { name, url: retry.data.url };
  throw new Error(`Daily rooms ${created.status}: ${JSON.stringify(created.data).slice(0, 200)}`);
}

async function createToken(apiKey, { roomName, userName, now = Date.now() }, fetchImpl = fetch) {
  const { status, data } = await daily(apiKey, "/meeting-tokens", {
    method: "POST",
    body: { properties: { room_name: roomName, user_name: (userName || "Étudiant").slice(0, 60), exp: Math.floor(now / 1000) + CALL_DURATION_S } },
  }, fetchImpl);
  if (status !== 200 || !data?.token) throw new Error(`Daily token ${status}: ${JSON.stringify(data).slice(0, 200)}`);
  return data.token;
}

module.exports = { roomNameFor, ensureRoom, createToken, CALL_DURATION_S };

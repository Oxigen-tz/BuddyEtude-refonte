// Identifiant d'une paire d'étudiants : "<uid1>_<uid2>" (uids triés).
// Sert d'id à la demande de binôme (requests), à la conversation (chatId des messages)
// et au tableau blanc partagé. Les uids Firebase ne contiennent jamais "_".
export const pairId = (uidA, uidB) => [uidA, uidB].sort().join("_");

// Les deux uids d'une paire, ou null si l'id est invalide
export const pairMembers = (id) => {
  const parts = (id || "").split("_");
  return parts.length === 2 && parts[0] && parts[1] ? parts : null;
};

// L'autre membre de la paire
export const otherMember = (id, myUid) => {
  const members = pairMembers(id);
  if (!members || !members.includes(myUid)) return null;
  return members[0] === myUid ? members[1] : members[0];
};

// Adresses de l'appel vidéo intégré (page Call)
export const callUrl = (type, id) => `/Call?type=${type}&id=${encodeURIComponent(id)}`;
export const pairCallUrl = (uidA, uidB) => callUrl("pair", pairId(uidA, uidB));
// Profil complet d'un étudiant (page Student)
export const studentUrl = (uid) => `/Student?id=${encodeURIComponent(uid)}`;

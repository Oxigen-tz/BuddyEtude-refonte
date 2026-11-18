// Compatibilité entre deux profils : même calcul que src/lib/matching.js (le site), recopié ici
// car les Cloud Functions ne peuvent pas importer le code du site. Modifier les deux ensemble.

const subjectName = (s) => (typeof s === "string" ? s : s?.name || "");
const norm = (s) => String(s || "").trim().toLowerCase();

function computeMatch(me, other) {
  const empty = { score: 0, sharedSubjects: [], sameLevel: false, sameCity: false, sameSchool: false, sharedSlots: [] };
  if (!me || !other) return empty;

  const mine = new Set((me.subjects || []).map((s) => norm(subjectName(s))));
  const sharedSubjects = (other.subjects || [])
    .map(subjectName)
    .filter((name) => name && mine.has(norm(name)));

  const sameLevel = Boolean(me.level && me.level === other.level);
  const sameSchool = Boolean(norm(me.school) && norm(me.school) === norm(other.school));
  const sameCity = Boolean(norm(me.city) && norm(me.city) === norm(other.city));
  const sharedSlots = (other.availability || []).filter((slot) => (me.availability || []).includes(slot));
  const compatibleMode = Boolean((me.is_online && other.is_online) || (me.is_in_person && other.is_in_person && sameCity));

  const score = sharedSubjects.length * 3
    + (sameSchool ? 3 : 0)
    + (sameLevel ? 2 : 0)
    + (sameCity ? 2 : 0)
    + sharedSlots.length
    + (compatibleMode ? 1 : 0);

  return { score, sharedSubjects, sameLevel, sameCity, sameSchool, sharedSlots };
}

module.exports = { computeMatch };

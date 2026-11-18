// Compatibilité entre deux profils, pour trier la recherche (les plus pertinents d'abord).
// Pondération : une matière en commun compte le plus, puis le niveau et la ville.

const subjectName = (s) => (typeof s === "string" ? s : s?.name || "");
const norm = (s) => s.trim().toLowerCase();

export function computeMatch(me, other) {
  const empty = { score: 0, sharedSubjects: [], sameLevel: false, sameCity: false, sharedSlots: [] };
  if (!me || !other) return empty;

  const mine = new Set((me.subjects || []).map((s) => norm(subjectName(s))));
  const sharedSubjects = (other.subjects || [])
    .map(subjectName)
    .filter((name) => name && mine.has(norm(name)));

  const sameLevel = Boolean(me.level && me.level === other.level);
  const sameCity = Boolean(me.city && other.city && norm(me.city) === norm(other.city));
  const sharedSlots = (other.availability || []).filter((slot) => (me.availability || []).includes(slot));
  const compatibleMode = Boolean((me.is_online && other.is_online) || (me.is_in_person && other.is_in_person && sameCity));

  const score = sharedSubjects.length * 3
    + (sameLevel ? 2 : 0)
    + (sameCity ? 2 : 0)
    + sharedSlots.length
    + (compatibleMode ? 1 : 0);

  return { score, sharedSubjects, sameLevel, sameCity, sharedSlots };
}

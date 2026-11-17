// Outils de date partagés par Sessions.jsx et Dashboard.jsx.

// "2026-09-16" + "23:21" → Date locale, sans décalage de fuseau horaire
export const parseSessionStart = (session) => {
  if (!session?.date) return null;
  const [y, m, d] = session.date.split("-").map(Number);
  const [hh, mm] = (session.time || "00:00").split(":").map(Number);
  const start = new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0);
  return Number.isNaN(start.getTime()) ? null : start;
};

export const parseSessionEnd = (session) => {
  const start = parseSessionStart(session);
  if (!start) return null;
  return new Date(start.getTime() + (Number(session.duration_minutes) || 60) * 60000);
};

export const sessionStartTime = (session) => parseSessionStart(session)?.getTime() ?? 0;

// Session prévue dont l'heure de fin est dépassée : elle attend d'être clôturée
export const isSessionOver = (session, now = new Date()) => {
  const end = parseSessionEnd(session);
  return end !== null && end < now;
};

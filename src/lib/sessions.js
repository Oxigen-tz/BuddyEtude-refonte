// Outils partagés par Sessions.jsx et Dashboard.jsx.

// "2026-09-16" + "23:21" → Date locale, sans décalage de fuseau horaire.
// Les sessions récentes ont aussi start_at (Timestamp absolu), utilisé en priorité.
export const parseSessionStart = (session) => {
  if (typeof session?.start_at?.toDate === "function") return session.start_at.toDate();
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

// Lien d'appel accepté : https uniquement (pas de javascript:, data:…)
export const isSafeMeetingUrl = (url) => {
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
};

// Fichier .ics (calendrier du téléphone, Google Agenda, Outlook…)
const icsDate = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const icsText = (s) => String(s || "").replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/[,;]/g, (c) => `\\${c}`);

export const buildIcs = (session, { withName, onlineLabel }) => {
  const start = parseSessionStart(session);
  const end = parseSessionEnd(session);
  if (!start || !end) return null;
  // Appel intégré pour les sessions en ligne, sauf lien externe choisi (Zoom, Teams…)
  const external = session.meeting_url && !/^https:\/\/meet\.jit\.si\//.test(session.meeting_url) ? session.meeting_url : null;
  const call = session.mode === "en_ligne" && typeof window !== "undefined" ? `${window.location.origin}/Call?type=session&id=${session.id}` : null;
  const link = external || call;
  const location = session.mode === "presentiel" ? session.location : (link || onlineLabel);
  const description = [withName, link].filter(Boolean).join("\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BuddyEtude//Sessions//FR",
    "BEGIN:VEVENT",
    `UID:${session.id}@buddyetude`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${icsText(session.title)}`,
    `DESCRIPTION:${icsText(description)}`,
    `LOCATION:${icsText(location)}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT1H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsText(session.title)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
};

export const downloadIcs = (session, labels) => {
  const content = buildIcs(session, labels);
  if (!content) return;
  const url = URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${(session.title || "session").replace(/[^\w-]+/g, "_")}.ics`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

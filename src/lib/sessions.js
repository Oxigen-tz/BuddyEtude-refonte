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

// ------------------------------------------------------------------ Série de semaines
// Nombre de semaines d'affilée (du lundi au dimanche) avec au moins une session qui a eu lieu :
// terminée, ou prévue dont l'heure est passée (les sessions annulées ne comptent pas).
// La semaine en cours n'interrompt pas la série tant qu'elle n'est pas finie : une série de
// 3 semaines reste à 3 lundi matin. Renvoie aussi si la semaine en cours compte déjà.
const mondayOf = (date) => {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d.getTime();
};
const WEEK = 7 * 86400000;
export const weeklyStreak = (sessions, now = new Date()) => {
  const weeks = new Set();
  for (const s of sessions || []) {
    const start = parseSessionStart(s);
    if (!start || start > now) continue;
    if (s.status === "completed" || (s.status === "planned" && isSessionOver(s, now))) weeks.add(mondayOf(start));
  }
  const current = mondayOf(now);
  const thisWeek = weeks.has(current);
  let count = 0;
  // Semaines où le passage à l'heure d'été/hiver décale d'une heure : on arrondit au lundi
  for (let w = thisWeek ? current : current - WEEK; weeks.has(mondayOf(new Date(w + 12 * 3600000))); w -= WEEK) count++;
  return { count, thisWeek };
};

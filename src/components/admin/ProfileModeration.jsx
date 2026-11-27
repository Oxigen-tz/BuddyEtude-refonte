import React, { useEffect, useMemo, useState } from "react";
import { arrayUnion, collection, doc, getDocs, limit, query, writeBatch } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Search, ImageOff, FileX, EyeOff, Eye, Lock, Unlock, Ban, Loader2, RotateCcw } from "lucide-react";
import { db } from "@/firebase/config";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Modération des profils : retirer une photo ou une présentation hors sujet, masquer, restreindre
// ou bannir un compte, avec un motif. Les mesures durables sont dans moderation/<uid> (règles
// Firestore : l'étudiant ne peut ni les lire chez les autres, ni les modifier, ni s'en défaire en
// recréant son profil). L'étudiant voit un bandeau qui explique la mesure (ModerationNotice).
export const MODERATION_REASONS = ["offtopic", "inappropriate", "photo", "impersonation", "spam", "other"];

export default function ProfileModeration({ focusUid }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [profiles, setProfiles] = useState(null);
  const [mods, setMods] = useState({});
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(null);
  const [reasons, setReasons] = useState({});

  const load = async () => {
    const [u, m] = await Promise.all([
      getDocs(query(collection(db, "users"), limit(1000))),
      getDocs(collection(db, "moderation")),
    ]);
    setProfiles(u.docs.map((d) => ({ id: d.id, ...d.data() })));
    setMods(Object.fromEntries(m.docs.map((d) => [d.id, d.data()])));
  };
  useEffect(() => { load().catch((e) => { console.error(e); setProfiles([]); }); }, []);
  useEffect(() => { if (focusUid) setSearch(focusUid); }, [focusUid]);

  const results = useMemo(() => {
    if (!profiles) return [];
    const q = search.trim().toLowerCase();
    const list = q
      ? profiles.filter((p) => p.id === search.trim() || [p.display_name, p.full_name, p.school, p.city].some((v) => String(v || "").toLowerCase().includes(q)))
      : profiles.filter((p) => p.profile_complete);
    return list.slice(0, 30);
  }, [profiles, search]);

  // Une mesure = mise à jour du profil + mesure durable + historique, en une seule écriture
  const act = async (p, action) => {
    const reason = reasons[p.id] || "offtopic";
    const m = mods[p.id] || {};
    const userPatch = {};
    const modPatch = {};
    let notice = { action, reason, at: Date.now() };
    switch (action) {
      case "photo": userPatch.photo_url = ""; modPatch.photo_locked = true; break;
      case "bio": userPatch.bio = ""; modPatch.bio_locked = true; break;
      case "unlockPhoto": modPatch.photo_locked = false; notice = null; break;
      case "unlockBio": modPatch.bio_locked = false; notice = null; break;
      case "hide": userPatch.profile_visible = false; break;
      case "show": userPatch.profile_visible = true; notice = null; break;
      case "restrict": userPatch.profile_visible = false; modPatch.restricted = true; break;
      case "unrestrict": modPatch.restricted = false; notice = null; break;
      case "ban": userPatch.banned = true; userPatch.profile_visible = false; break;
      case "unban": userPatch.banned = false; notice = null; break;
      default: return;
    }
    if (action === "show" && m.restricted) { toast.error(t("admin.profiles.showRestricted")); return; }
    setBusy(`${p.id}-${action}`);
    try {
      const batch = writeBatch(db);
      if (Object.keys(userPatch).length) batch.update(doc(db, "users", p.id), userPatch);
      batch.set(doc(db, "moderation", p.id), {
        ...modPatch,
        notice,
        history: arrayUnion({ action, reason, at: Date.now(), by: user.uid }),
      }, { merge: true });
      await batch.commit();
      setProfiles((list) => list.map((x) => (x.id === p.id ? { ...x, ...userPatch } : x)));
      setMods((all) => ({ ...all, [p.id]: { ...m, ...modPatch, notice } }));
      toast.success(t(`admin.profiles.done.${action}`, { name: p.display_name || p.id }));
    } catch (error) {
      console.error(error);
      toast.error(t("admin.toast.error"));
    } finally {
      setBusy(null);
    }
  };

  const btn = (p, action, Icon, variant = "outline", extra = "") => (
    <Button size="sm" variant={variant} disabled={busy === `${p.id}-${action}`} onClick={() => act(p, action)} className={`rounded-xl ${extra}`}>
      {busy === `${p.id}-${action}` ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Icon className="w-4 h-4 mr-1.5" />}
      {t(`admin.profiles.actions.${action}`)}
    </Button>
  );

  return (
    <section id="profile-moderation" className="mb-12 scroll-mt-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{t("admin.profiles.title")}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t("admin.profiles.subtitle")}</p>
      <div className="relative mb-4">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("admin.profiles.searchPlaceholder")}
          className="w-full h-11 pl-9 pr-3 rounded-xl border border-gray-200 dark:border-ink-700 bg-white dark:bg-ink-900 text-sm text-gray-900 dark:text-white" />
      </div>

      {profiles === null ? (
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      ) : results.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center bg-white dark:bg-ink-900 rounded-2xl border border-dashed border-gray-200 dark:border-ink-700">{t("admin.profiles.none")}</p>
      ) : (
        <ul className="space-y-3">
          {results.map((p) => {
            const m = mods[p.id] || {};
            return (
              <li key={p.id} className="p-5 bg-white dark:bg-ink-900 border border-gray-100 dark:border-ink-700 rounded-2xl">
                <div className="flex gap-4">
                  {p.photo_url ? (
                    <img src={p.photo_url} alt="" referrerPolicy="no-referrer" className="w-16 h-16 rounded-xl object-cover shrink-0 bg-gray-100" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-ink-800 shrink-0 flex items-center justify-center text-gray-400 text-xs">{t("admin.profiles.noPhoto")}</div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-white">{p.display_name || t("admin.profiles.noName")}</span>
                      {p.banned && <Badge className="border-0 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400">{t("admin.profiles.flags.banned")}</Badge>}
                      {m.restricted && <Badge className="border-0 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">{t("admin.profiles.flags.restricted")}</Badge>}
                      {p.profile_visible === false && <Badge className="border-0 bg-gray-100 text-gray-600 dark:bg-ink-800 dark:text-gray-300">{t("admin.profiles.flags.hidden")}</Badge>}
                      {m.bio_locked && <Badge className="border-0 bg-gray-100 text-gray-600 dark:bg-ink-800 dark:text-gray-300">{t("admin.profiles.flags.bioLocked")}</Badge>}
                      {m.photo_locked && <Badge className="border-0 bg-gray-100 text-gray-600 dark:bg-ink-800 dark:text-gray-300">{t("admin.profiles.flags.photoLocked")}</Badge>}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 break-all">
                      {[p.school, p.city].filter(Boolean).join(" · ")} {p.school || p.city ? "·" : ""} uid : {p.id}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 whitespace-pre-wrap break-words">
                      {p.bio || <span className="italic text-gray-400">{t("admin.profiles.noBio")}</span>}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400" htmlFor={`reason-${p.id}`}>{t("admin.profiles.reason")}</label>
                  <select id={`reason-${p.id}`} value={reasons[p.id] || "offtopic"} onChange={(e) => setReasons((r) => ({ ...r, [p.id]: e.target.value }))}
                    className="h-9 px-2 rounded-lg border border-gray-200 dark:border-ink-700 bg-white dark:bg-ink-900 text-sm text-gray-900 dark:text-white">
                    {MODERATION_REASONS.map((r) => <option key={r} value={r}>{t(`moderationNotice.reasons.${r}`)}</option>)}
                  </select>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {m.photo_locked ? btn(p, "unlockPhoto", Unlock) : (p.photo_url ? btn(p, "photo", ImageOff) : null)}
                  {m.bio_locked ? btn(p, "unlockBio", Unlock) : (p.bio ? btn(p, "bio", FileX) : null)}
                  {p.profile_visible === false ? (!m.restricted && !p.banned ? btn(p, "show", Eye) : null) : btn(p, "hide", EyeOff)}
                  {m.restricted ? btn(p, "unrestrict", RotateCcw) : btn(p, "restrict", Lock, "outline", "border-amber-300 text-amber-700 dark:text-amber-300")}
                  {p.banned ? btn(p, "unban", RotateCcw) : btn(p, "ban", Ban, "default", "bg-red-600 hover:bg-red-700 text-white")}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft, BadgeCheck, BookOpen, GraduationCap, MapPin, MessageSquare, Send, Sparkles, User, Video,
  Clock, CalendarDays, UserX, Hourglass, Inbox,
} from "lucide-react";
import { db } from "../firebase/config";
import { useAuth } from "@/lib/AuthContext";
import { useRequests, buildRelations } from "@/hooks/useRequests";
import { pairCallUrl } from "@/lib/pairs";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Reveal from "@/components/ui/reveal";
import { ProfileBanner, Panel, SubjectsPanel, GoalsPanel, AvailabilityPanel, normalizeSubjects } from "@/components/profile/ProfileParts";

// Profil complet d'un autre étudiant : /Student?id=<uid>
// Lecture autorisée par les règles si le profil est visible (ou si c'est le sien).
export default function Student() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const id = params.get("id");
  const [state, setState] = useState({ status: "loading" });
  const [mySubjects, setMySubjects] = useState([]);
  const [photoFailed, setPhotoFailed] = useState(false);
  const relations = buildRelations(useRequests(user?.uid));
  const relation = id ? relations.get(id) : null;

  useEffect(() => {
    if (!id || !user?.uid || id === user.uid) return;
    let cancelled = false;
    setState({ status: "loading" });
    Promise.all([getDoc(doc(db, "users", id)), getDoc(doc(db, "users", user.uid))])
      .then(([other, me]) => {
        if (cancelled) return;
        setMySubjects(normalizeSubjects(me.data()?.subjects).map((s) => s.name.toLowerCase()));
        if (!other.exists() || other.data().banned) setState({ status: "missing" });
        else setState({ status: "ready", profile: { id, ...other.data() } });
      })
      // Profil masqué (règles) ou erreur réseau
      .catch(() => { if (!cancelled) setState({ status: "missing" }); });
    return () => { cancelled = true; };
  }, [id, user?.uid]);

  const profile = state.profile;
  const subjects = useMemo(() => normalizeSubjects(profile?.subjects), [profile]);
  const common = useMemo(() => new Set(subjects.map((s) => s.name.toLowerCase()).filter((n) => mySubjects.includes(n))), [subjects, mySubjects]);

  if (!id) return <Navigate to={createPageUrl("Search")} replace />;
  if (id === user?.uid) return <Navigate to={createPageUrl("Profile")} replace />;

  const back = (
    <Button variant="ghost" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate(createPageUrl("Search")))} className="rounded-xl -ml-2 mb-3">
      <ArrowLeft className="w-4 h-4 mr-1.5" /> {t("call.back")}
    </Button>
  );

  if (state.status === "loading") {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {back}
        <Skeleton className="h-72 rounded-3xl dark:bg-ink-900" />
        <div className="grid lg:grid-cols-3 gap-6"><Skeleton className="h-64 rounded-2xl lg:col-span-2 dark:bg-ink-900" /><Skeleton className="h-64 rounded-2xl dark:bg-ink-900" /></div>
      </div>
    );
  }
  if (state.status === "missing") {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <span className="mx-auto w-14 h-14 rounded-2xl bg-gray-100 dark:bg-ink-800 text-gray-400 flex items-center justify-center"><UserX className="w-6 h-6" /></span>
        <h1 className="mt-4 font-display text-2xl font-bold text-gray-900 dark:text-white">{t("student.missingTitle")}</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">{t("student.missingDesc")}</p>
        <Button asChild className="mt-6 rounded-xl"><Link to={createPageUrl("Search")}>{t("student.backToSearch")}</Link></Button>
      </div>
    );
  }

  const name = profile.display_name || t("profile.defaultStudent");
  const advanced = subjects.filter((s) => s.level === "avance").map((s) => s.name);
  const isMentor = profile.mentor_available !== false && advanced.length > 0;
  const since = profile.createdAt ? new Date(profile.createdAt) : null;
  const sinceLabel = since && !Number.isNaN(since.getTime()) ? since.toLocaleDateString(i18n.language, { month: "long", year: "numeric" }) : "–";

  // Actions selon la relation
  let actions;
  if (relation?.status === "buddy") {
    actions = (
      <>
        <Button asChild className="rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 text-white shadow-glow">
          <Link to={`${createPageUrl("Messages")}?chat=${encodeURIComponent(id)}`}><MessageSquare className="w-4 h-4 mr-2" /> {t("student.message")}</Link>
        </Button>
        <Button asChild className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white">
          <Link to={pairCallUrl(user.uid, id)}><Video className="w-4 h-4 mr-2" /> {t("call.start")}</Link>
        </Button>
      </>
    );
  } else if (relation?.status === "received") {
    actions = (
      <Button asChild className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white">
        <Link to={`${createPageUrl("Messages")}?chat=${encodeURIComponent(id)}`}><Inbox className="w-4 h-4 mr-2" /> {t("student.answer")}</Link>
      </Button>
    );
  } else if (relation?.status === "sent") {
    actions = (
      <Button disabled variant="outline" className="rounded-xl"><Hourglass className="w-4 h-4 mr-2" /> {t("student.pending")}</Button>
    );
  } else {
    actions = (
      <Button asChild className="rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 text-white shadow-glow">
        <Link to={`${createPageUrl("Search")}?contact=${encodeURIComponent(id)}`}><Send className="w-4 h-4 mr-2" /> {t("student.contact")}</Link>
      </Button>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-6">
      {back}
      <section className="rounded-3xl overflow-hidden bg-white dark:bg-ink-900 border border-gray-200/70 dark:border-ink-700 shadow-soft">
        <ProfileBanner>
          {relation?.status === "buddy" && (
            <span className="absolute top-4 left-4 sm:left-6 inline-flex items-center gap-1.5 rounded-full bg-lime-300 text-gray-900 px-3 py-1 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> {t("student.yourBuddy")}
            </span>
          )}
        </ProfileBanner>
        <div className="px-5 sm:px-8 pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
            <div className="-mt-12 relative shrink-0 w-fit">
              {profile.photo_url && !photoFailed ? (
                <img src={profile.photo_url} alt={name} referrerPolicy="no-referrer" onError={() => setPhotoFailed(true)}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-[1.75rem] object-cover ring-[6px] ring-white dark:ring-ink-900 shadow-lift" />
              ) : (
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-[1.75rem] bg-gradient-to-br from-brand-400 to-purple-600 text-white flex items-center justify-center font-display text-5xl font-extrabold ring-[6px] ring-white dark:ring-ink-900 shadow-lift">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
              {profile.verified_domain && (
                <span className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-white dark:bg-ink-900 flex items-center justify-center shadow-soft">
                  <BadgeCheck className="w-6 h-6 text-sky-500" aria-label={t("buddyCard.verified", { domain: profile.verified_domain })} />
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0 md:pb-1">
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white flex flex-wrap items-center gap-x-3 gap-y-1">
                {name}
                {isMentor && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-lime-300/40 dark:bg-lime-300/15 text-lime-800 dark:text-lime-300 text-xs font-bold px-2.5 py-1">
                    <Sparkles className="w-3.5 h-3.5" /> {t("profileUi.mentor")}
                  </span>
                )}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-sm text-gray-600 dark:text-gray-300">
                {profile.school && <span className="flex items-center gap-1.5 font-semibold text-brand-700 dark:text-brand-300"><GraduationCap className="w-4 h-4" /> {profile.school}</span>}
                {profile.level && <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-gray-400" /> {t(`buddyCard.levels.${profile.level}`, profile.level)}</span>}
                {profile.city && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" /> {profile.city}</span>}
                {profile.verified_domain && <span className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400"><BadgeCheck className="w-4 h-4" /> @{profile.verified_domain}</span>}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:pb-1">{actions}</div>
          </div>

          <dl className="mt-6 grid grid-cols-2 sm:grid-cols-4 rounded-2xl bg-gray-50 dark:bg-ink-950/60 border border-gray-100 dark:border-ink-800 divide-x divide-y sm:divide-y-0 divide-gray-100 dark:divide-ink-800 overflow-hidden">
            {[
              [t("profileUi.stats.subjects"), subjects.length, BookOpen, "text-brand-600 dark:text-brand-300"],
              [t("student.inCommon"), common.size, Sparkles, "text-coral-500 dark:text-coral-300"],
              [t("profileUi.availability"), (profile.availability || []).length, Clock, "text-sky-600 dark:text-sky-300"],
              [t("student.memberSince"), sinceLabel, CalendarDays, "text-purple-600 dark:text-purple-300"],
            ].map(([label, value, Icon, color]) => (
              <div key={label} className="px-4 py-3.5 sm:px-5 min-w-0">
                <dt className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400"><Icon className={`w-3.5 h-3.5 ${color}`} /> {label}</dt>
                <dd className="font-display text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mt-0.5 truncate first-letter:uppercase">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="mt-6 grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Reveal>
            <Panel icon={User} tone="brand" title={t("profileUi.about")}>
              {profile.bio
                ? <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-[15px] whitespace-pre-line">{profile.bio}</p>
                : <p className="text-sm text-gray-500 dark:text-gray-400">{t("student.noBio", { name })}</p>}
            </Panel>
          </Reveal>
          <Reveal index={1}><SubjectsPanel subjects={subjects} isMentor={isMentor} advanced={advanced} common={common} /></Reveal>
          {profile.goals?.length > 0 && <Reveal index={2}><GoalsPanel goals={profile.goals} /></Reveal>}
        </div>
        <div className="space-y-6">
          <Reveal><AvailabilityPanel profile={profile} /></Reveal>
        </div>
      </div>
    </div>
  );
}

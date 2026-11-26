import React, { useState, useEffect, useMemo } from "react";
import InviteCard from "@/components/InviteCard";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, UserRound, Calendar, Sparkles, Check, X, ArrowRight, MessageCircle } from "lucide-react";
import { db } from "../firebase/config";
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { parseSessionStart, sessionStartTime, isSessionOver } from "@/lib/sessions";
import { useRequests, buildRelations } from "@/hooks/useRequests";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [hasBuddy, setHasBuddy] = useState(false);
  const [upcomingSessions, setUpcomingSessions] = useState([]);

  const [hasLaunchedSession, setHasLaunchedSession] = useState(localStorage.getItem("tuto_step3") === "true");
  const [showTutorial, setShowTutorial] = useState(localStorage.getItem("tuto_hidden") !== "true");

  // « À faire maintenant » : demandes reçues et messages non lus, en temps réel
  const requests = useRequests(user?.uid);
  const unread = useUnreadMessages(user?.uid);
  const todo = useMemo(() => {
    const relations = buildRelations(requests);
    const items = [];
    relations.forEach((r, uid) => {
      if (r.status !== "received") return;
      items.push({
        key: `req-${uid}`, icon: UserPlus, tone: "request",
        text: t(r.kind === "help" ? "dashboard.todo.requestHelp" : "dashboard.todo.request", { name: r.name }),
        action: t("dashboard.todo.requestAction"),
        to: `${createPageUrl("Messages")}?chat=${uid}`,
      });
    });
    Object.entries(unread.byUid).forEach(([uid, count]) => {
      const r = relations.get(uid);
      if (!r || r.status !== "buddy") return;
      items.push({
        key: `msg-${uid}`, icon: MessageCircle, tone: "message",
        text: t("dashboard.todo.unread", { count, name: r.name }),
        action: t("dashboard.todo.unreadAction"),
        to: `${createPageUrl("Messages")}?chat=${uid}`,
      });
    });
    return items;
  }, [requests, unread, t]);

  const firstName = user?.displayName?.split(" ")[0] || user?.full_name?.split(" ")[0] || t("settings.account.defaultStudent");

  useEffect(() => {
    if (!user?.uid) return;

    const checkUserProgress = async () => {
      try {
        // Lecture directe de son propre profil : une requête sur "users" sur la collection serait
        // refusée par les règles (elles ne laissent lister que les profils visibles)
        const userSnap = await getDoc(doc(db, "users", user.uid));
        if (userSnap.exists()) {
          setIsProfileComplete(!!userSnap.data().profile_complete);
        }

        const reqQueryTo = query(collection(db, "requests"), where("to_uid", "==", user.uid), where("status", "==", "accepted"));
        // Une demande envoyée mais pas encore acceptée ne fait pas de vous un binôme
        const reqQueryFrom = query(collection(db, "requests"), where("from_uid", "==", user.uid), where("status", "==", "accepted"));
        
        const sessionsQuery = query(collection(db, "sessions"), where("participants", "array-contains", user.uid));

        const [toSnap, fromSnap, sessionsSnap] = await Promise.all([
          getDocs(reqQueryTo), getDocs(reqQueryFrom), getDocs(sessionsQuery)
        ]);
        if (!toSnap.empty || !fromSnap.empty) {
          setHasBuddy(true);
        }

        const allSessions = sessionsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        // Étape 3 du tutoriel validée dès qu'une session existe (pas seulement après un clic)
        if (allSessions.length > 0) {
          localStorage.setItem("tuto_step3", "true");
          setHasLaunchedSession(true);
        }
        const now = new Date();
        setUpcomingSessions(
          allSessions
            .filter((s) => s.status === "planned" && !isSessionOver(s, now))
            .sort((a, b) => sessionStartTime(a) - sessionStartTime(b))
            .slice(0, 3)
        );
      } catch (error) {
        console.error("Erreur progression :", error);
      }
    };

    checkUserProgress();
  }, [user]);

  const hideTutorialBanner = () => {
    localStorage.setItem("tuto_hidden", "true");
    setShowTutorial(false);
  };

  const steps = [
    {
      key: "step1", done: isProfileComplete, ready: true, icon: UserRound,
      text: isProfileComplete ? t("dashboard.tutorial.step1_done") : t("dashboard.tutorial.step1_todo"),
      onClick: () => !isProfileComplete && navigate(createPageUrl("Profile")),
    },
    {
      key: "step2", done: hasBuddy, ready: true, icon: Search,
      text: hasBuddy ? t("dashboard.tutorial.step2_done") : t("dashboard.tutorial.step2_todo"),
      onClick: () => !hasBuddy && navigate(createPageUrl("Search")),
    },
    {
      key: "step3", done: hasLaunchedSession, ready: isProfileComplete && hasBuddy, icon: Calendar,
      text: hasLaunchedSession
        ? t("dashboard.tutorial.step3_done")
        : isProfileComplete && hasBuddy ? t("dashboard.tutorial.step3_ready") : t("dashboard.tutorial.step3_todo"),
      onClick: () => {
        if (isProfileComplete && hasBuddy && !hasLaunchedSession) {
          localStorage.setItem("tuto_step3", "true"); setHasLaunchedSession(true); navigate(createPageUrl("Sessions"));
        } else if (hasLaunchedSession) navigate(createPageUrl("Sessions"));
      },
    },
  ];
  const doneCount = steps.filter((s) => s.done).length;
  const allDone = doneCount === steps.length;
  // Dès 2 étapes sur 3, la liste se réduit à une ligne : l'accueil laisse la place à ce qui attend l'étudiant
  const compactTutorial = doneCount >= 2;
  const nextStep = steps.find((s) => !s.done && s.ready);
  const nextSession = upcomingSessions[0];
  const nextSessionStart = nextSession ? parseSessionStart(nextSession) : null;
  const todoItems = nextSession
    ? [...todo, {
        key: `session-${nextSession.id}`, icon: Calendar, tone: "session",
        text: t("dashboard.todo.session", { title: nextSession.title }),
        detail: nextSessionStart ? nextSessionStart.toLocaleString(i18n.language, { weekday: "long", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : nextSession.date,
        action: t("dashboard.todo.sessionAction"),
        to: createPageUrl("Sessions"),
      }]
    : todo;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* --- BANDEAU D'ACCUEIL --- */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-purple-700 text-white p-6 sm:p-8 shadow-glow">
        <div className="absolute inset-0 opacity-[0.14] [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute -top-16 -right-10 w-64 h-64 rounded-full bg-coral-400/40 blur-3xl animate-aurora" />
        <div className="absolute -bottom-20 left-1/3 w-64 h-64 rounded-full bg-lime-300/25 blur-3xl animate-aurora-slow" />
        <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-3">
              {t("dashboard.greeting", { name: firstName })} <span className="inline-block animate-wave origin-[70%_70%]">👋</span>
            </h1>
            <p className="text-white/80 mt-2 text-base sm:text-lg">{t("dashboard.subtitle")}</p>
          </div>
          <Button
            onClick={() => navigate(createPageUrl("Search"))}
            className="self-start sm:self-auto h-12 px-6 rounded-2xl bg-white text-brand-700 hover:bg-brand-50 shadow-lift"
          >
            <Search className="w-4 h-4" />
            {t("dashboard.findBuddy")}
          </Button>
        </div>
      </section>

      {/* --- À FAIRE MAINTENANT --- */}
      {todoItems.length > 0 && (
        <section aria-labelledby="todo-title" className="rounded-3xl bg-card border border-border p-5 sm:p-6 shadow-soft">
          <h2 id="todo-title" className="font-display text-xl font-bold text-foreground mb-4">{t("dashboard.todo.title")}</h2>
          <ul className="space-y-2">
            {todoItems.map(({ key, icon: Icon, tone, text, detail, action, to }) => (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => navigate(to)}
                  className="group w-full flex items-center gap-3 rounded-2xl border border-border bg-muted/40 hover:bg-muted px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <span className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${
                    tone === "request" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                      : tone === "message" ? "bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
                        : "bg-lime-100 text-lime-800 dark:bg-lime-400/10 dark:text-lime-300"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-sm text-foreground">{text}</span>
                    {detail && <span className="block text-xs text-muted-foreground mt-0.5 first-letter:uppercase">{detail}</span>}
                  </span>
                  <span className="shrink-0 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-300">
                    {action} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* --- PREMIERS PAS (version réduite dès 2 étapes sur 3) --- */}
      {showTutorial && compactTutorial && (
        <section className="rounded-2xl bg-card border border-border px-4 py-3 shadow-soft flex items-center gap-3">
          <span className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center ${allDone ? "bg-lime-300 text-gray-900" : "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300"}`}>
            {allDone ? <Check className="w-4 h-4" strokeWidth={3} /> : <Sparkles className="w-4 h-4" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">{allDone ? t("dashboard.tutorial.title_ready") : t("dashboard.progress", { done: doneCount, total: steps.length })}</p>
          </div>
          {nextStep && (
            <Button size="sm" onClick={nextStep.onClick} className="shrink-0 rounded-xl">
              {t(`dashboard.tutorial.${nextStep.key}`)}
            </Button>
          )}
          <button onClick={hideTutorialBanner} aria-label={t("dashboard.tutorial.close")} title={t("dashboard.tutorial.close")} className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </section>
      )}

      {/* --- PREMIERS PAS --- */}
      {showTutorial && !compactTutorial && (
        <section className="rounded-3xl bg-card border border-border p-5 sm:p-6 shadow-soft">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-xl font-bold flex items-center gap-2 text-foreground">
                <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-300" />
                {allDone ? t("dashboard.tutorial.title_ready") : t("dashboard.tutorial.title_welcome")}
              </h2>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 max-w-xs h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-coral-400 transition-all duration-700" style={{ width: `${(doneCount / steps.length) * 100}%` }} />
                </div>
                <span className="text-xs font-bold text-muted-foreground">{t("dashboard.progress", { done: doneCount, total: steps.length })}</span>
              </div>
            </div>
            <button onClick={hideTutorialBanner} aria-label={t("dashboard.tutorial.close")} title={t("dashboard.tutorial.close")} className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            {steps.map(({ key, done, ready, icon: Icon, text, onClick }, i) => {
              const clickable = !done && ready;
              return (
                <div
                  key={key}
                  onClick={onClick}
                  className={`group relative rounded-2xl p-4 border transition-all ${
                    done
                      ? "bg-lime-100/60 dark:bg-lime-400/5 border-lime-200 dark:border-lime-400/20"
                      : clickable
                        ? "bg-card border-border hover:border-brand-300 dark:hover:border-brand-500/50 hover:shadow-soft hover:-translate-y-0.5 cursor-pointer"
                        : "bg-muted/40 border-transparent opacity-60 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
                      done ? "bg-lime-300 text-gray-900" : clickable ? "bg-brand-600 text-white shadow-glow" : "bg-muted-foreground/15 text-muted-foreground"
                    }`}>
                      {done ? <Check className="w-4 h-4" strokeWidth={3} /> : <Icon className="w-4 h-4" />}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground">0{i + 1}</span>
                    {clickable && <ArrowRight className="ml-auto w-4 h-4 text-muted-foreground group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />}
                  </div>
                  <h3 className="font-semibold text-sm mb-1 text-foreground">{t(`dashboard.tutorial.${key}`)}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* --- ACCÈS RAPIDES --- */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="group relative overflow-hidden bg-card border border-border rounded-3xl p-6 shadow-soft flex flex-col justify-between hover:shadow-lift transition-all">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-brand-500/10 blur-2xl" />
          <div className="relative flex items-start gap-4">
            <div className="w-12 h-12 bg-brand-50 dark:bg-brand-500/15 rounded-2xl flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5 text-brand-600 dark:text-brand-300" />
            </div>
            <div>
              <h3 className="font-display font-bold text-foreground text-lg">{t("dashboard.contacts.title")}</h3>
              <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{t("dashboard.contacts.desc")}</p>
            </div>
          </div>
          <div className="relative mt-5 flex justify-end">
            <Button variant="ghost" onClick={() => navigate(createPageUrl("Search"))} className="text-brand-600 dark:text-brand-300 hover:text-brand-700 hover:bg-brand-50 dark:hover:bg-brand-500/10">
              {t("dashboard.contacts.button")} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-card border border-border rounded-3xl p-6 shadow-soft flex flex-col justify-between hover:shadow-lift transition-all">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl" />
          <div className="relative flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/15 rounded-2xl flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display font-bold text-foreground text-lg">{t("dashboard.sessions.title")}</h3>
              {upcomingSessions.length === 0 ? (
                <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{t("dashboard.sessions.desc")}</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {upcomingSessions.map((s) => {
                    const start = parseSessionStart(s);
                    const withName = s.organizer_uid === user?.uid ? s.buddy_name : s.organizer_name;
                    return (
                      <li key={s.id} className="flex items-center gap-3 rounded-xl bg-muted/60 px-3 py-2 text-sm">
                        {start && (
                          <span className="w-10 shrink-0 text-center leading-tight">
                            <span className="block text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">{start.toLocaleDateString(i18n.language, { month: "short" })}</span>
                            <span className="block font-display text-lg font-extrabold text-foreground">{start.getDate()}</span>
                          </span>
                        )}
                        <span className="min-w-0">
                          <span className="block font-semibold text-foreground truncate">{s.title}</span>
                          <span className="block text-xs text-muted-foreground truncate">
                            {start
                              ? start.toLocaleString(i18n.language, { weekday: "short", hour: "2-digit", minute: "2-digit" })
                              : s.date}
                            {withName ? ` · ${withName}` : ""}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
          <div className="relative mt-5 flex justify-end">
            <Button variant="ghost" onClick={() => navigate(createPageUrl("Sessions"))} className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400">
              {t("dashboard.sessions.button")} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>
      </div>

      <InviteCard />
    </div>
  );
}

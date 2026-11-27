import React, { useState, useEffect } from "react";
import StudentVerification from "@/components/profile/StudentVerification";
import AvatarEditor from "@/components/profile/AvatarEditor";
import { db } from "../firebase/config";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { privateSettingsRef } from "../firebase/services";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import {
  User, CheckCircle, Edit, MapPin, Users, BookOpen, Target, ArrowLeft, BadgeCheck,
  Eye, Sparkles, GraduationCap, CalendarCheck, Plus
} from "lucide-react";
import Reveal from "@/components/ui/reveal";
import ProfileForm from "../components/profile/ProfileForm";
import { ProfileBanner, Panel, SubjectsPanel, GoalsPanel, AvailabilityPanel, normalizeSubjects } from "@/components/profile/ProfileParts";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useTranslation } from "react-i18next";
import { useModeration } from "@/components/ModerationNotice";


export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 
  const [photoFailed, setPhotoFailed] = useState(false);
  // Chiffres de l'en-tête : binômes (demandes acceptées) et sessions terminées
  const [stats, setStats] = useState({ buddies: null, sessions: null });

  useEffect(() => {
    if (!user?.uid) return;
    const accepted = (field) => getDocs(query(collection(db, "requests"), where(field, "==", user.uid), where("status", "==", "accepted")));
    Promise.all([accepted("to_uid"), accepted("from_uid"), getDocs(query(collection(db, "sessions"), where("participants", "array-contains", user.uid)))])
      .then(([to, from, sessions]) => setStats({
        buddies: to.size + from.size,
        sessions: sessions.docs.filter((d) => d.data().status === "completed").length,
      }))
      .catch(() => {});
  }, [user?.uid]);

  // Les libellés de niveau partagent la même source que buddyCard.levels
  // (mêmes valeurs "college"/"lycee"/etc.) : une seule liste à maintenir.
  const levelLabel = (value) => t(`buddyCard.levels.${value}`, value);

  // Nom proposé à la création du profil : displayName n'existait pas dans AuthContext,
  // d'où un champ "Nom affiché" vide pour les nouveaux comptes.
  const defaultName = user?.displayName || user?.full_name || "";
  // Mesures de modération sur ce profil (photo / présentation bloquées, restriction)
  const moderation = useModeration();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uid) return;
      try {
        const docRef = doc(db, "users", user.uid);
        const [docSnap, privateSnap] = await Promise.all([getDoc(docRef), getDoc(privateSettingsRef(user.uid))]);
        // Tranche d'âge et accord parental : stockés à part (document privé), pas dans le profil public
        const privateData = privateSnap.exists() ? privateSnap.data() : {};
        const ageFields = { age_bracket: privateData.age_bracket || "", parental_consent: privateData.parental_consent === true };
        if (docSnap.exists()) {
          const data = { ...docSnap.data(), ...ageFields };
          // S'il n'y a pas encore de photo dans Firestore mais qu'on a une photo Google, on l'associe
          if (!data.photo_url && user.photoURL) {
            data.photo_url = user.photoURL;
          }
          if (!data.display_name && defaultName) {
            data.display_name = defaultName;
          }
          setProfile(data);
          if (!data.profile_complete) setIsEditing(true);
        } else {
          setProfile({
            display_name: defaultName,
            photo_url: user.photoURL || "",
            subjects: [], goals: [], availability: [], profile_complete: false,
            ...ageFields,
          });
          setIsEditing(true); 
        }
      } catch (error) {
        console.error("Erreur Firestore:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async (formData) => {
    if (!user?.uid) return;
    setIsSaving(true);
    try {
      const docRef = doc(db, "users", user.uid);
      // Champs qui ne vont PAS dans le profil public : l'âge (document privé), l'email (n'est plus
      // stocké, voir firestore.rules) et le bannissement (réservé à la modération)
      const { age_bracket, parental_consent, email: _email, banned: _banned, verified_domain: _vd, verified_at: _va, ...publicData } = formData;
      await setDoc(privateSettingsRef(user.uid), {
        age_bracket,
        parental_consent: age_bracket === "under15" ? parental_consent === true : false,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      const dataToSave = { 
        ...publicData, 
        photo_url: formData.photo_url || profile?.photo_url || user.photoURL || "",
        // Mesures de modération (moderation/<uid>) : les règles refusent sinon l'enregistrement
        ...(moderation?.photo_locked ? { photo_url: "" } : {}),
        ...(moderation?.bio_locked ? { bio: "" } : {}),
        ...(moderation?.restricted ? { profile_visible: false } : {}),
        profile_complete: true,
        // Toujours présent : la recherche (et les règles Firestore) filtrent sur ce champ
        profile_visible: profile?.profile_visible !== false,
        updatedAt: new Date().toISOString() 
      };
      // Le compteur d'étudiants de l'accueil est tenu à jour par la Cloud Function onProfileWrite
      await setDoc(docRef, dataToSave, { merge: true });
      // merge: true côté Firestore → même chose côté état local (sinon des champs comme
      // profile_visible disparaissaient de l'état jusqu'au rechargement)
      setProfile(prev => ({ ...prev, ...dataToSave, age_bracket, parental_consent }));
      setPhotoFailed(false);
      
      toast.success(t('profile.toast.saved'), {
        description: t('profile.toast.savedDesc')
      });
      
      setTimeout(() => {
        navigate(createPageUrl("Dashboard"));
      }, 1500);

    } catch (error) {
      console.error(error);
      toast.error(t('profile.toast.error'));
      setIsSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-72 rounded-3xl dark:bg-ink-900" />
        <div className="grid lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 rounded-2xl lg:col-span-2 dark:bg-ink-900" />
          <Skeleton className="h-80 rounded-2xl dark:bg-ink-900" />
        </div>
      </div>
    );
  }

  // --- Mode édition ---
  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto pb-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-purple-700 text-white p-6 mb-6 shadow-lift">
          <div className="absolute -top-16 -right-10 w-64 h-64 rounded-full bg-purple-400/40 blur-3xl animate-aurora" />
          <div className="absolute inset-0 bg-grid opacity-[0.12] mask-radial" />
          <div className="relative flex items-center gap-4">
            <span className="hidden sm:flex shrink-0 w-12 h-12 rounded-2xl bg-white/15 items-center justify-center"><Edit className="w-5 h-5" /></span>
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-xl sm:text-2xl font-extrabold leading-tight">{profile?.profile_complete ? t('profile.editTitle') : t('profileUi.welcome.title')}</h1>
              <p className={`${profile?.profile_complete ? "hidden sm:block" : ""} text-white/80 text-sm`}>{profile?.profile_complete ? t('profile.subtitle') : t('profileUi.welcome.desc')}</p>
            </div>
            {profile?.profile_complete && (
              <Button variant="ghost" onClick={() => setIsEditing(false)} className="shrink-0 text-white hover:bg-white/10 hover:text-white rounded-xl px-3">
                <ArrowLeft className="w-4 h-4 mr-2" /> {t('profile.cancel')}
              </Button>
            )}
          </div>
        </div>
        <ProfileForm profile={profile} onSave={handleSave} saving={isSaving} bioLocked={moderation?.bio_locked === true} />
      </div>
    );
  }

  // --- Profil (vue publique) ---
  const subjects = normalizeSubjects(profile.subjects);
  const advanced = subjects.filter((s) => s.level === "avance").map((s) => s.name);
  const isMentor = profile.mentor_available !== false && advanced.length > 0;
  const checklist = [
    ["bio", Boolean(profile.bio?.trim())],
    ["school", Boolean(profile.school?.trim())],
    ["city", Boolean(profile.city?.trim())],
    ["subjects", subjects.length >= 2],
    ["availability", (profile.availability || []).length > 0],
    ["goals", (profile.goals || []).length > 0],
    ["verified", Boolean(profile.verified_domain)],
  ];
  const doneCount = checklist.filter(([, ok]) => ok).length;
  const completion = Math.round((doneCount / checklist.length) * 100);
  const initial = profile.display_name ? profile.display_name.charAt(0).toUpperCase() : "E";

  return (
    <div className="max-w-6xl mx-auto pb-6">

      {/* --- EN-TÊTE : bannière, avatar, identité, chiffres --- */}
      <section className="rounded-3xl overflow-hidden bg-white dark:bg-ink-900 border border-gray-200/70 dark:border-ink-700 shadow-soft">
        <ProfileBanner>
          <span className="absolute top-4 left-4 sm:left-6 inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur border border-white/20 px-3 py-1 text-xs font-semibold text-white">
            <Eye className="w-3.5 h-3.5" /> {t('profileUi.publicNote')}
          </span>
        </ProfileBanner>

        <div className="px-5 sm:px-8 pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
            <div className="-mt-12 sm:-mt-12 relative shrink-0 w-fit">
              <AvatarEditor uid={user.uid} currentUrl={profile.photo_url} fallbackUrl={user.photoURL || ""} disabled={moderation?.photo_locked === true}
                onChange={(url) => { setPhotoFailed(false); setProfile((prev) => ({ ...prev, photo_url: url })); }}>
              {profile.photo_url && !photoFailed && !moderation?.photo_locked ? (
                // Les photos Google refusent souvent de se charger avec un Referer
                <img src={profile.photo_url} alt={profile.display_name} referrerPolicy="no-referrer" onError={() => setPhotoFailed(true)}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-[1.75rem] object-cover ring-[6px] ring-white dark:ring-ink-900 shadow-lift" />
              ) : (
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-[1.75rem] bg-gradient-to-br from-brand-400 to-purple-600 text-white flex items-center justify-center font-display text-5xl font-extrabold ring-[6px] ring-white dark:ring-ink-900 shadow-lift">
                  {initial}
                </div>
              )}
              </AvatarEditor>
              {profile.verified_domain && (
                <span className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-white dark:bg-ink-900 flex items-center justify-center shadow-soft">
                  <BadgeCheck className="w-6 h-6 text-sky-500" aria-label={t('buddyCard.verified', { domain: profile.verified_domain })} />
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0 md:pb-1">
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white flex flex-wrap items-center gap-x-3 gap-y-1">
                {profile.display_name || t('profile.defaultStudent')}
                {isMentor && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-lime-300/40 dark:bg-lime-300/15 text-lime-800 dark:text-lime-300 text-xs font-bold px-2.5 py-1">
                    <Sparkles className="w-3.5 h-3.5" /> {t('profileUi.mentor')}
                  </span>
                )}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-sm text-gray-600 dark:text-gray-300">
                {profile.school && <span className="flex items-center gap-1.5 font-semibold text-brand-700 dark:text-brand-300"><GraduationCap className="w-4 h-4" /> {profile.school}</span>}
                {profile.level && <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-gray-400" /> {levelLabel(profile.level)}</span>}
                {profile.city && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" /> {profile.city}</span>}
                {profile.verified_domain && <span className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400"><BadgeCheck className="w-4 h-4" /> @{profile.verified_domain}</span>}
              </div>
            </div>

            <div className="flex items-center gap-2 md:pb-1">
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-lime-300/30 dark:bg-lime-300/10 text-lime-800 dark:text-lime-300 px-3 py-1.5 text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse" /> {t('profile.public')}
              </span>
              <Button onClick={() => setIsEditing(true)} className="rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 text-white shadow-glow">
                <Edit className="w-4 h-4 mr-2" /> {t('profileUi.editProfile')}
              </Button>
            </div>
          </div>

          {/* Chiffres clés */}
          <dl className="mt-6 grid grid-cols-2 sm:grid-cols-4 rounded-2xl bg-gray-50 dark:bg-ink-950/60 border border-gray-100 dark:border-ink-800 divide-x divide-y sm:divide-y-0 divide-gray-100 dark:divide-ink-800 overflow-hidden">
            {[
              [t('profileUi.stats.subjects'), subjects.length, BookOpen, "text-brand-600 dark:text-brand-300"],
              [t('profileUi.stats.buddies'), stats.buddies ?? "–", Users, "text-coral-500 dark:text-coral-300"],
              [t('profileUi.stats.sessions'), stats.sessions ?? "–", CalendarCheck, "text-purple-600 dark:text-purple-300"],
              [t('profileUi.stats.completion'), `${completion} %`, Target, "text-lime-600 dark:text-lime-300"],
            ].map(([label, value, Icon, color]) => (
              <div key={label} className="px-4 py-3.5 sm:px-5">
                <dt className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400"><Icon className={`w-3.5 h-3.5 ${color}`} /> {label}</dt>
                <dd className="font-display text-2xl font-extrabold text-gray-900 dark:text-white mt-0.5">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="mt-6 grid lg:grid-cols-3 gap-6 items-start">
        {/* --- COLONNE PRINCIPALE --- */}
        <div className="lg:col-span-2 space-y-6">
          <Reveal>
            <Panel icon={User} tone="brand" title={t('profileUi.about')}>
              {profile.bio ? (
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-[15px] whitespace-pre-line">{profile.bio}</p>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-dashed border-gray-200 dark:border-ink-700 p-4">
                  <p className="flex-1 text-sm text-gray-500 dark:text-gray-400">{t('profileUi.noBio')}</p>
                  <Button size="sm" variant="outline" className="rounded-xl" onClick={() => setIsEditing(true)}><Plus className="w-4 h-4 mr-1" /> {t('profileUi.addBio')}</Button>
                </div>
              )}
            </Panel>
          </Reveal>

          <Reveal index={1}>
            <SubjectsPanel subjects={subjects} isMentor={isMentor} advanced={advanced} />
          </Reveal>

          {profile.goals?.length > 0 && (
            <Reveal index={2}>
              <GoalsPanel goals={profile.goals} />
            </Reveal>
          )}
        </div>

        {/* --- COLONNE LATÉRALE --- */}
        <div className="space-y-6">
          <Reveal>
            <section className="rounded-2xl bg-white dark:bg-ink-900 border border-gray-200/70 dark:border-ink-700 shadow-soft p-5">
              <div className="flex items-center gap-4">
                <CompletionRing value={completion} />
                <div className="min-w-0">
                  <h2 className="font-display font-bold text-gray-900 dark:text-white">{t('profileUi.strength.title')}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{completion === 100 ? t('profileUi.strength.done') : t('profileUi.strength.hint')}</p>
                </div>
              </div>
              {completion < 100 && (
                <ul className="mt-4 space-y-1">
                  {checklist.map(([key, ok]) => (
                    <li key={key}>
                      <button type="button" disabled={ok} onClick={() => key === "verified"
                        ? document.getElementById("verification")?.scrollIntoView({ behavior: "smooth", block: "center" })
                        : setIsEditing(true)}
                        className={`w-full flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-left transition-colors ${ok ? "text-gray-400 dark:text-gray-500" : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-ink-800"} disabled:cursor-default`}>
                        {ok
                          ? <CheckCircle className="w-4 h-4 text-lime-500 shrink-0" />
                          : <span className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-ink-600 shrink-0" />}
                        <span className={ok ? "line-through" : ""}>{t(`profileUi.strength.items.${key}`)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </Reveal>

          <Reveal index={1}>
            <AvailabilityPanel profile={profile} />
          </Reveal>

          <Reveal index={2} className="scroll-mt-24" >
            <div id="verification" />
            <StudentVerification
              verifiedDomain={profile.verified_domain || null}
              onChange={(domain) => setProfile((prev) => ({ ...prev, verified_domain: domain || undefined }))}
            />
          </Reveal>
        </div>
      </div>
    </div>
  );
}

// Anneau de progression (force du profil)
function CompletionRing({ value }) {
  const r = 26, c = 2 * Math.PI * r;
  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90" aria-hidden="true">
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="7" className="stroke-gray-100 dark:stroke-ink-800" />
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="7" strokeLinecap="round" stroke="url(#ring-g)"
          strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} style={{ transition: "stroke-dashoffset .8s cubic-bezier(.22,1,.36,1)" }} />
        <defs><linearGradient id="ring-g" x1="0" x2="1"><stop offset="0" stopColor="#7A55FF" /><stop offset="1" stopColor="#C4E44A" /></linearGradient></defs>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-display text-sm font-extrabold text-gray-900 dark:text-white">{value}%</span>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { db, auth, storage, functions } from "../firebase/config";
import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs, writeBatch, onSnapshot } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { reauthenticateWithPopup, reauthenticateWithCredential, EmailAuthProvider, GoogleAuthProvider, OAuthProvider, deleteUser } from "firebase/auth";
import { privateSettingsRef } from "../firebase/services";
import { httpsCallable } from "firebase/functions";
import { pushSupported, pushEnabledHere, enablePush, disablePush } from "@/lib/push";
import { unblockUser } from "@/hooks/useBlocks";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { getRequestAlertsEnabled, setRequestAlertsEnabled } from "@/lib/preferences";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  User, Palette, Bell, Shield, Trash2, Loader2, Mail, Lock, KeyRound, BadgeCheck, ChevronRight,
  BellRing, Smartphone, CalendarDays, Eye, UserX, FileText, Scale, Info, Globe, ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SettingsSection, SettingRow, ThemeCard, IconTile } from "@/components/settings/SettingsUI";
import { getThemePreference, setThemePreference } from "@/lib/theme";

// Supprime des documents par lots (une écriture groupée Firestore est limitée à 500 opérations)
const deleteInBatches = async (refs) => {
  for (let i = 0; i < refs.length; i += 450) {
    const batch = writeBatch(db);
    refs.slice(i, i + 450).forEach((r) => batch.delete(r));
    await batch.commit();
  }
};
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Settings() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState(() => {
    const tab = new URLSearchParams(window.location.search).get("tab");
    return ["account", "appearance", "notifications", "privacy"].includes(tab) ? tab : "account";
  });

  // Thème : clair, sombre ou système (lib/theme.js)
  const [themePref, setThemePref] = useState(() => getThemePreference());
  // Profil public (statut étudiant, photo) affiché dans l'en-tête et l'onglet Compte
  const [publicProfile, setPublicProfile] = useState(null);
  const [photoFailed, setPhotoFailed] = useState(false);

  // Visibilité du profil : stockée dans users/{uid}.profile_visible (true par défaut)
  const [profileVisible, setProfileVisible] = useState(true);
  const [visibilityLoaded, setVisibilityLoaded] = useState(false);

  // Alertes de demandes : réglage propre à l'appareil (voir lib/preferences.js)
  const [requestAlerts, setRequestAlerts] = useState(() => getRequestAlertsEnabled());

  useEffect(() => {
    if (!user?.uid) return;
    let cancelled = false;

    getDoc(doc(db, "users", user.uid))
      .then((snap) => {
        if (cancelled) return;
        if (snap.exists()) setPublicProfile(snap.data());
        if (snap.exists() && snap.data().profile_visible === false) setProfileVisible(false);
      })
      .catch((error) => console.error("Erreur de lecture des préférences:", error))
      .finally(() => { if (!cancelled) setVisibilityLoaded(true); });

    return () => { cancelled = true; };
  }, [user]);

  const setTheme = (theme) => {
    if (theme === themePref) return;
    setThemePreference(theme);
    setThemePref(theme);
    toast.success(theme === "dark" ? t('settings.appearance.darkToast') : theme === "light" ? t('settings.appearance.lightToast') : t('settingsUi.appearance.systemToast'));
  };

  const isFr = i18n.language?.startsWith("fr");
  const setLanguage = (lng) => {
    if ((lng === "fr") === isFr) return;
    i18n.changeLanguage(lng).then(() => toast.success(i18n.t('settingsUi.appearance.languageToast')));
  };

  // 🛠️ CORRIGÉ : ce réglage n'était relié à rien (Switch defaultChecked, aucune écriture).
  // Il est maintenant enregistré, et Search.jsx masque les profils dont profile_visible vaut false.
  const handleVisibilityChange = async (value) => {
    if (!user?.uid) return;
    setProfileVisible(value); // mise à jour immédiate de l'interface
    try {
      await setDoc(doc(db, "users", user.uid), { profile_visible: value }, { merge: true });
      toast.success(t('settings.toast.saved'));
    } catch (error) {
      console.error("Erreur d'enregistrement de la visibilité:", error);
      setProfileVisible(!value);
      toast.error(t('settings.toast.error'));
    }
  };

  const handleRequestAlertsChange = (value) => {
    setRequestAlerts(value);
    setRequestAlertsEnabled(value);
    toast.success(t('settings.toast.saved'));
  };

  // --- SUPPRESSION DU COMPTE (droit à l'effacement, promis par la page Confidentialité) ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const isPasswordAccount = auth.currentUser?.providerData[0]?.providerId === "password";

  // Préférences privées (users/<uid>/private/settings), lues par les Cloud Functions ;
  // toutes activées par défaut : e-mails de notification, résumé hebdomadaire.
  const [prefs, setPrefs] = useState({ email_notifications: true, weekly_digest: true });
  useEffect(() => {
    if (!user?.uid) return;
    getDoc(privateSettingsRef(user.uid))
      .then((snap) => {
        if (!snap.exists()) return;
        const d = snap.data();
        setPrefs({ email_notifications: d.email_notifications !== false, weekly_digest: d.weekly_digest !== false });
      })
      .catch(() => {});
  }, [user?.uid]);
  const setPref = async (key, value) => {
    setPrefs((p) => ({ ...p, [key]: value }));
    try {
      await setDoc(privateSettingsRef(user.uid), { [key]: value }, { merge: true });
      toast.success(t('settings.toast.saved'));
    } catch (error) {
      console.error(error);
      setPrefs((p) => ({ ...p, [key]: !value }));
      toast.error(t('settings.toast.error'));
    }
  };

  // Notifications push sur cet appareil (affiché seulement si le navigateur le permet)
  const [pushAvailable, setPushAvailable] = useState(false);
  const [pushOn, setPushOn] = useState(false);
  const [pushBusy, setPushBusy] = useState(false);
  useEffect(() => {
    if (!user?.uid) return;
    let cancelled = false;
    pushSupported().then(async (ok) => {
      if (cancelled || !ok) return;
      setPushAvailable(true);
      setPushOn(await pushEnabledHere(user.uid));
    });
    return () => { cancelled = true; };
  }, [user?.uid]);
  const handlePushChange = async (value) => {
    setPushBusy(true);
    try {
      if (value) {
        const result = await enablePush(user.uid);
        if (result === "denied") { toast.error(t('settings.preferences.pushDenied')); return; }
        if (result !== "granted") return;
        setPushOn(true);
      } else {
        await disablePush(user.uid);
        setPushOn(false);
      }
      toast.success(t('settings.toast.saved'));
    } catch (error) {
      console.error(error);
      toast.error(t('settings.toast.error'));
    } finally {
      setPushBusy(false);
    }
  };

  // Personnes bloquées (débloquer depuis les paramètres)
  const [blockedList, setBlockedList] = useState([]);
  useEffect(() => {
    if (!user?.uid) return;
    return onSnapshot(query(collection(db, "blocks"), where("blocker", "==", user.uid)),
      (snap) => setBlockedList(snap.docs.map((d) => d.data())),
      (error) => console.error(error));
  }, [user?.uid]);
  const confirmWord = t('settings.danger.confirmWord');

  const handleDeleteAccount = async () => {
    const current = auth.currentUser;
    if (!current || !user?.uid) return;
    setIsDeleting(true);
    try {
      // Firebase exige une connexion récente pour supprimer un compte : on la redemande d'abord,
      // AVANT d'effacer quoi que ce soit (sinon on risquerait une suppression à moitié faite).
      // La méthode dépend de la façon dont le compte se connecte.
      const providerId = current.providerData[0]?.providerId;
      if (providerId === "password") {
        await reauthenticateWithCredential(current, EmailAuthProvider.credential(current.email, deletePassword));
      } else if (providerId === "microsoft.com") {
        await reauthenticateWithPopup(current, new OAuthProvider("microsoft.com"));
      } else {
        await reauthenticateWithPopup(current, new GoogleAuthProvider());
      }

      const uid = user.uid;

      // 1. Mes messages, et leurs pièces jointes dans Storage
      const messagesSnap = await getDocs(query(collection(db, "messages"), where("participants", "array-contains", uid)));
      const myMessages = messagesSnap.docs.filter((d) => d.data().senderUid === uid);
      await Promise.all(myMessages.map((d) => {
        const url = d.data().fileUrl;
        return url ? deleteObject(ref(storage, url)).catch(() => {}) : null;
      }));
      await deleteInBatches(myMessages.map((d) => d.ref));

      // 2. Mes demandes de binôme (envoyées et reçues) et mes blocages
      const [incoming, outgoing, blocks] = await Promise.all([
        getDocs(query(collection(db, "requests"), where("to_uid", "==", uid))),
        getDocs(query(collection(db, "requests"), where("from_uid", "==", uid))),
        getDocs(query(collection(db, "blocks"), where("blocker", "==", uid))),
      ]);
      await deleteInBatches([...incoming.docs, ...outgoing.docs, ...blocks.docs].map((d) => d.ref));

      // 3. Mes sessions prévues : annulées, pour que mon binôme ne m'attende pas
      const sessionsSnap = await getDocs(query(collection(db, "sessions"), where("participants", "array-contains", uid)));
      const plannedRefs = sessionsSnap.docs.filter((d) => d.data().status === "planned").map((d) => d.ref);
      for (let i = 0; i < plannedRefs.length; i += 450) {
        const batch = writeBatch(db);
        plannedRefs.slice(i, i + 450).forEach((r) => batch.update(r, { status: "cancelled" }));
        await batch.commit();
      }

      // 4. Mes données privées puis mon profil
      // Côté serveur : données privées, fichiers, groupes, avis (fonction deleteMyData)
      await httpsCallable(functions, "deleteMyData")();
      await deleteDoc(privateSettingsRef(uid)).catch(() => {});
      await deleteDoc(doc(db, "users", uid));

      // 5. Le compte de connexion lui-même
      await deleteUser(current);
      window.location.href = "/";
    } catch (error) {
      console.error("Erreur de suppression du compte:", error);
      if (error?.code === "auth/popup-closed-by-user" || error?.code === "auth/cancelled-popup-request") {
        toast.error(t('settings.danger.reauthCancelled'));
      } else if (error?.code === "auth/wrong-password" || error?.code === "auth/invalid-credential") {
        toast.error(t('auth.errors.invalidCredential'));
      } else {
        toast.error(t('settings.danger.error'));
      }
      setIsDeleting(false);
    }
  };

  const TABS = [
    { id: "account", icon: User, tone: "brand" },
    { id: "appearance", icon: Palette, tone: "purple" },
    { id: "notifications", icon: Bell, tone: "coral" },
    { id: "privacy", icon: Shield, tone: "lime" },
  ];
  const selectTab = (id) => {
    setActiveTab(id);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", id);
    window.history.replaceState(null, "", url);
  };

  const providerId = auth.currentUser?.providerData[0]?.providerId;
  const providerKey = providerId === "password" ? "password" : providerId === "microsoft.com" ? "microsoft" : "google";
  const displayName = publicProfile?.display_name || user?.displayName || user?.full_name || t('settings.account.defaultStudent');
  const photo = publicProfile?.photo_url || user?.photoURL;
  const verifiedDomain = publicProfile?.verified_domain;
  const switchClass = "data-[state=checked]:bg-brand-600";

  return (
    <div className="w-full max-w-6xl mx-auto">

      <div className="mb-6 md:mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">{t('settings.title')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1.5">{t('settings.subtitle')}</p>
      </div>

      {/* --- CARTE D'IDENTITÉ --- */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-purple-700 text-white p-5 sm:p-6 mb-6 md:mb-8 shadow-lift">
        <div className="absolute -top-20 -right-10 w-72 h-72 rounded-full bg-purple-400/40 blur-3xl animate-aurora" />
        <div className="absolute -bottom-24 left-1/3 w-72 h-72 rounded-full bg-coral-400/25 blur-3xl animate-aurora-slow" />
        <div className="absolute inset-0 bg-grid opacity-[0.12] mask-radial" />
        <div className="relative flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-5">
          {photo && !photoFailed ? (
            <img src={photo} alt="" referrerPolicy="no-referrer" onError={() => setPhotoFailed(true)} className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-4 ring-white/20" />
          ) : (
            <span className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 ring-4 ring-white/15 flex items-center justify-center font-display text-2xl font-extrabold">{displayName.charAt(0).toUpperCase()}</span>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-display text-xl sm:text-2xl font-bold flex items-center gap-2 truncate">
              {displayName}
              {verifiedDomain && <BadgeCheck className="w-5 h-5 shrink-0 text-sky-300" aria-label={t('buddyCard.verified', { domain: verifiedDomain })} />}
            </p>
            <p className="text-white/70 text-sm truncate">{user?.email}</p>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-2.5 py-1 text-xs font-semibold">
              <KeyRound className="w-3.5 h-3.5" /> {t('settingsUi.header.connectedWith', { provider: t(`settingsUi.header.providers.${providerKey}`) })}
            </span>
          </div>
          <Link to={createPageUrl("Profile")} className="w-full sm:w-auto justify-center inline-flex items-center gap-2 rounded-xl bg-white text-gray-900 px-4 h-10 text-sm font-bold hover:bg-white/90 transition-colors shadow-soft">
            {t('settingsUi.header.viewProfile')} <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

        {/* --- MENU : liste à gauche (ordinateur), onglets défilants (mobile) --- */}
        <aside className="lg:w-72 shrink-0">
          <nav aria-label={t('settings.title')} className="lg:sticky lg:top-8">
            <div className="flex lg:flex-col gap-2 overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0 pb-1 lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {TABS.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => selectTab(tab.id)}
                    aria-current={active ? "page" : undefined}
                    className={`group shrink-0 flex items-center gap-3 rounded-2xl text-left transition-all px-3 py-2 lg:p-3 ${
                      active
                        ? "bg-white dark:bg-ink-900 shadow-soft ring-1 ring-gray-200/80 dark:ring-ink-700"
                        : "hover:bg-white/70 dark:hover:bg-ink-900/60"
                    }`}
                  >
                    <IconTile icon={tab.icon} tone={tab.tone} className={`w-8 h-8 lg:w-10 lg:h-10 ${active ? "" : "opacity-80"}`} />
                    <span className="min-w-0">
                      <span className={`block text-sm lg:text-[15px] font-semibold whitespace-nowrap ${active ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-300"}`}>{t(`settingsUi.nav.${tab.id}.label`)}</span>
                      <span className="hidden lg:block text-xs text-gray-500 dark:text-gray-400 truncate">{t(`settingsUi.nav.${tab.id}.desc`)}</span>
                    </span>
                    <ChevronRight className={`hidden lg:block ml-auto w-4 h-4 transition-all ${active ? "text-brand-500 translate-x-0" : "text-gray-300 dark:text-ink-600 -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"}`} />
                  </button>
                );
              })}
            </div>

            {/* Liens d'information (ordinateur) */}
            <div className="hidden lg:block mt-6 px-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400 dark:text-gray-500 mb-2">{t('settingsUi.infoTitle')}</p>
              <ul className="space-y-1.5 text-sm">
                <li><Link to={createPageUrl("About")} className="text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors">{t('footer.about')}</Link></li>
                <li><Link to={createPageUrl("Legal")} className="text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors">{t('footer.legal')}</Link></li>
                <li><Link to={createPageUrl("Privacy")} className="text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors">{t('footer.privacy')}</Link></li>
                <li><a href="mailto:contact@buddyetude.com" className="text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors">contact@buddyetude.com</a></li>
              </ul>
              <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">© {new Date().getFullYear()} BuddyEtude</p>
            </div>
          </nav>
        </aside>

        {/* --- CONTENU --- */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              {/* 👤 COMPTE */}
              {activeTab === "account" && (
                <>
                  <SettingsSection title={t('settingsUi.account.identityTitle')} desc={t('settingsUi.account.identityDesc')}>
                    <SettingRow icon={User} tone="brand" title={t('settingsUi.account.name')} desc={displayName} />
                    <SettingRow icon={Mail} tone="sky" title={t('settingsUi.account.email')}
                      desc={<><span className="text-gray-700 dark:text-gray-300 break-all">{user?.email}</span><span className="flex items-center gap-1 text-xs mt-1"><Lock className="w-3 h-3" /> {t('settingsUi.account.emailPrivate')}</span></>} />
                    <SettingRow icon={KeyRound} tone="purple" title={t('settingsUi.account.method')} desc={t(`settingsUi.header.providers.${providerKey}`)}>
                      <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-2.5 py-1 bg-lime-300/30 text-lime-800 dark:bg-lime-300/10 dark:text-lime-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-lime-500" /> {t('settingsUi.header.connectedWith', { provider: t(`settingsUi.header.providers.${providerKey}`) })}
                      </span>
                    </SettingRow>
                    <SettingRow icon={BadgeCheck} tone={verifiedDomain ? "sky" : "gray"} title={t('settingsUi.account.student')}
                      desc={verifiedDomain ? t('settingsUi.account.verified', { domain: verifiedDomain }) : t('settingsUi.account.notVerified')}>
                      {!verifiedDomain && (
                        <Button asChild size="sm" variant="outline" className="rounded-xl">
                          <Link to={createPageUrl("Profile")}>{t('settingsUi.account.verify')}</Link>
                        </Button>
                      )}
                    </SettingRow>
                  </SettingsSection>
                  <p className="-mt-5 px-1 text-xs text-gray-400 dark:text-gray-500">{t('settings.account.syncNotice')}</p>

                  <SettingsSection danger title={t('settingsUi.account.dangerTitle')} desc={t('settingsUi.account.dangerDesc')}>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-4 sm:px-5 py-5">
                      <IconTile icon={Trash2} tone="red" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[15px] text-gray-900 dark:text-gray-100">{t('settings.danger.title')}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{t('settings.danger.desc')}</p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => { setDeleteConfirmText(""); setShowDeleteModal(true); }}
                        className="shrink-0 rounded-xl border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-700 bg-transparent"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> {t('settings.danger.button')}
                      </Button>
                    </div>
                  </SettingsSection>
                </>
              )}

              {/* 🎨 APPARENCE */}
              {activeTab === "appearance" && (
                <>
                  <section>
                    <header className="mb-3 px-1">
                      <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white">{t('settingsUi.appearance.themeTitle')}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t('settingsUi.appearance.themeDesc')}</p>
                    </header>
                    <div role="radiogroup" aria-label={t('settingsUi.appearance.themeTitle')} className="grid grid-cols-1 min-[480px]:grid-cols-3 gap-3 sm:gap-4">
                      <ThemeCard value="light" label={t('settingsUi.appearance.light')} selected={themePref === "light"} onSelect={setTheme} />
                      <ThemeCard value="dark" label={t('settingsUi.appearance.dark')} selected={themePref === "dark"} onSelect={setTheme} />
                      <ThemeCard value="system" label={t('settingsUi.appearance.system')} desc={t('settingsUi.appearance.systemDesc')} selected={themePref === "system"} onSelect={setTheme} />
                    </div>
                  </section>

                  <SettingsSection title={t('settingsUi.appearance.languageTitle')} desc={t('settingsUi.appearance.languageDesc')}>
                    <div role="radiogroup" aria-label={t('settingsUi.appearance.languageTitle')} className="grid sm:grid-cols-2 gap-2 p-2">
                      {[["fr", "FR", "Français"], ["en", "EN", "English"]].map(([lng, code, name]) => {
                        const selected = (lng === "fr") === isFr;
                        return (
                          <button key={lng} type="button" role="radio" aria-checked={selected} onClick={() => setLanguage(lng)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${selected ? "bg-brand-50 dark:bg-brand-500/10 ring-2 ring-brand-500" : "hover:bg-gray-50 dark:hover:bg-ink-800"}`}>
                            <span aria-hidden="true" className={`w-9 h-9 rounded-lg flex items-center justify-center font-display text-xs font-extrabold ${selected ? "bg-brand-600 text-white" : "bg-gray-100 dark:bg-ink-800 text-gray-500 dark:text-gray-400"}`}>{code}</span>
                            <span className="flex-1 font-semibold text-gray-900 dark:text-gray-100">{name}</span>
                            <span className={`w-4 h-4 rounded-full border-2 ${selected ? "border-brand-500 bg-brand-500 ring-2 ring-inset ring-white dark:ring-ink-900" : "border-gray-300 dark:border-ink-600"}`} />
                          </button>
                        );
                      })}
                    </div>
                  </SettingsSection>
                </>
              )}

              {/* 🔔 NOTIFICATIONS */}
              {activeTab === "notifications" && (
                <>
                  <SettingsSection title={t('settingsUi.notifications.appTitle')} desc={t('settingsUi.notifications.appDesc')}>
                    <SettingRow icon={BellRing} tone="coral" title={t('settings.preferences.requestAlerts')} desc={t('settings.preferences.requestAlertsDesc')} htmlFor="pref-alerts">
                      <Switch id="pref-alerts" aria-label={t('settings.preferences.requestAlerts')} checked={requestAlerts} onCheckedChange={handleRequestAlertsChange} className={switchClass} />
                    </SettingRow>
                  </SettingsSection>

                  {/* E-mails : nouvelle demande, nouveau message (au plus un par conversation et par
                      demi-heure), rappels de session. Envoyés par les Cloud Functions. */}
                  <SettingsSection title={t('settingsUi.notifications.emailTitle')} desc={t('settingsUi.notifications.emailDesc')}>
                    <SettingRow icon={Mail} tone="sky" title={t('settings.preferences.emailNotifs')} desc={t('settings.preferences.emailNotifsDesc')} htmlFor="pref-email">
                      <Switch id="pref-email" aria-label={t('settings.preferences.emailNotifs')} checked={prefs.email_notifications} onCheckedChange={(v) => setPref("email_notifications", v)} className={switchClass} />
                    </SettingRow>
                    {/* Résumé du lundi : nouveaux inscrits compatibles (fonction weeklyDigest) */}
                    <SettingRow icon={CalendarDays} tone="lime" title={t('settings.preferences.weeklyDigest')} desc={t('settings.preferences.weeklyDigestDesc')} htmlFor="pref-digest" muted={!prefs.email_notifications}>
                      <Switch id="pref-digest" aria-label={t('settings.preferences.weeklyDigest')} checked={prefs.email_notifications && prefs.weekly_digest} disabled={!prefs.email_notifications} onCheckedChange={(v) => setPref("weekly_digest", v)} className={switchClass} />
                    </SettingRow>
                  </SettingsSection>

                  <SettingsSection title={t('settingsUi.notifications.deviceTitle')} desc={t('settingsUi.notifications.deviceDesc')}>
                    {pushAvailable ? (
                      <SettingRow icon={Smartphone} tone="purple" title={t('settings.preferences.push')} desc={t('settings.preferences.pushDesc')} htmlFor="pref-push">
                        <Switch id="pref-push" aria-label={t('settings.preferences.push')} checked={pushOn} disabled={pushBusy} onCheckedChange={handlePushChange} className={switchClass} />
                      </SettingRow>
                    ) : (
                      <SettingRow icon={Smartphone} tone="gray" title={t('settings.preferences.push')} desc={t('settingsUi.notifications.deviceUnavailable')} muted />
                    )}
                  </SettingsSection>
                </>
              )}

              {/* 🛡️ CONFIDENTIALITÉ */}
              {activeTab === "privacy" && (
                <>
                  <SettingsSection title={t('settingsUi.privacy.visibilityTitle')} desc={t('settingsUi.privacy.visibilityDesc')}>
                    <SettingRow icon={Eye} tone="lime" title={t('settings.preferences.profileVisibility')} desc={t('settings.preferences.profileVisibilityDesc')} htmlFor="pref-visible">
                      <Switch id="pref-visible" aria-label={t('settings.preferences.profileVisibility')} checked={profileVisible} onCheckedChange={handleVisibilityChange} disabled={!visibilityLoaded} className={switchClass} />
                    </SettingRow>
                  </SettingsSection>

                  <SettingsSection title={t('settingsUi.privacy.blockedTitle')} desc={t('settingsUi.privacy.blockedDesc')}>
                    {blockedList.length === 0 ? (
                      <SettingRow icon={UserX} tone="gray" title={t('settings.preferences.blocked')} desc={t('settings.preferences.noBlocked')} />
                    ) : blockedList.map((b) => {
                      const name = b.blocked_name || t('settings.preferences.unknownUser');
                      return (
                        <div key={b.blocked} className="flex items-center gap-4 px-4 sm:px-5 py-3.5">
                          <span className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-ink-800 text-gray-500 dark:text-gray-400 font-bold flex items-center justify-center">{name.charAt(0).toUpperCase()}</span>
                          <span className="flex-1 min-w-0 font-semibold text-gray-900 dark:text-gray-100 truncate">{name}</span>
                          <Button variant="outline" size="sm" className="rounded-xl"
                            onClick={() => unblockUser(user.uid, b.blocked).then(() => toast.success(t('settings.toast.saved')))}>
                            {t('settings.preferences.unblock')}
                          </Button>
                        </div>
                      );
                    })}
                  </SettingsSection>

                  <SettingsSection title={t('settingsUi.privacy.dataTitle')} desc={t('settingsUi.privacy.dataDesc')}>
                    {[
                      ["Privacy", FileText, "sky", "policy"],
                      ["Legal", Scale, "purple", "legal"],
                      ["About", Info, "brand", "about"],
                    ].map(([page, Icon, tone, key]) => (
                      <Link key={page} to={createPageUrl(page)} className="group block hover:bg-gray-50/80 dark:hover:bg-ink-800/60 transition-colors">
                        <SettingRow icon={Icon} tone={tone} title={t(`settingsUi.privacy.${key}`)} desc={t(`settingsUi.privacy.${key}Desc`)}>
                          <ChevronRight className="w-4 h-4 text-gray-300 dark:text-ink-600 transition-transform group-hover:translate-x-0.5" />
                        </SettingRow>
                      </Link>
                    ))}
                    <a href="mailto:contact@buddyetude.com" className="group block hover:bg-gray-50/80 dark:hover:bg-ink-800/60 transition-colors">
                      <SettingRow icon={Globe} tone="coral" title={t('settingsUi.privacy.contact')} desc="contact@buddyetude.com">
                        <ArrowUpRight className="w-4 h-4 text-gray-300 dark:text-ink-600" />
                      </SettingRow>
                    </a>
                  </SettingsSection>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Liens d'information (mobile) */}
          <nav className="lg:hidden mt-10 pt-5 border-t border-gray-200/70 dark:border-ink-700 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
            <Link to={createPageUrl("About")} className="hover:text-brand-600">{t('footer.about')}</Link>
            <Link to={createPageUrl("Legal")} className="hover:text-brand-600">{t('footer.legal')}</Link>
            <Link to={createPageUrl("Privacy")} className="hover:text-brand-600">{t('footer.privacy')}</Link>
            <span>© {new Date().getFullYear()} BuddyEtude</span>
          </nav>
        </main>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950/60 backdrop-blur-sm animate-in fade-in p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="delete-title" className="bg-white dark:bg-ink-900 rounded-3xl p-6 shadow-lift w-full max-w-md border border-gray-100 dark:border-ink-700 animate-in zoom-in-95">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 id="delete-title" className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">{t('settings.danger.modalTitle')}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">{t('settings.danger.modalDesc')}</p>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="delete-confirm">
              {t('settings.danger.typeToConfirm', { word: confirmWord })}
            </label>
            <Input id="delete-confirm" value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} autoComplete="off" className="mt-2 mb-5" />
            {/* Compte e-mail : la confirmation se fait par mot de passe (pas de fenêtre Google) */}
            {isPasswordAccount && (
              <>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="delete-password">{t('auth.password')}</label>
                <Input id="delete-password" type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} autoComplete="current-password" className="mt-2 mb-5" />
              </>
            )}
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" disabled={isDeleting} onClick={() => setShowDeleteModal(false)} className="rounded-xl">
                {t('settings.danger.cancel')}
              </Button>
              <Button
                onClick={handleDeleteAccount}
                disabled={isDeleting || deleteConfirmText.trim().toUpperCase() !== confirmWord.toUpperCase() || (isPasswordAccount && !deletePassword)}
                className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
              >
                {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {t('settings.danger.confirm')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

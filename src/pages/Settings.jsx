import React, { useState, useEffect } from "react";
import { db, auth, storage } from "../firebase/config";
import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs, writeBatch, onSnapshot } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { reauthenticateWithPopup, reauthenticateWithCredential, EmailAuthProvider, GoogleAuthProvider, OAuthProvider, deleteUser } from "firebase/auth";
import { privateSettingsRef } from "../firebase/services";
import { unblockUser } from "@/hooks/useBlocks";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { getRequestAlertsEnabled, setRequestAlertsEnabled } from "@/lib/preferences";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  User, Palette, Settings2, Moon, Sun, 
  Mail, CheckCircle2, ChevronRight, Bell, Shield, Trash2, AlertTriangle, Loader2
} from "lucide-react";

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
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("account");
  
  // Gestion du thème
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains("dark"));

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
        if (snap.exists() && snap.data().profile_visible === false) setProfileVisible(false);
      })
      .catch((error) => console.error("Erreur de lecture des préférences:", error))
      .finally(() => { if (!cancelled) setVisibilityLoaded(true); });

    return () => { cancelled = true; };
  }, [user]);

  const setTheme = (theme) => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      // On utilise "theme" pour correspondre à App.jsx
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
      toast.success(t('settings.appearance.darkToast'));
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
      toast.success(t('settings.appearance.lightToast'));
    }
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

  // Notifications par e-mail (envoyées par les Cloud Functions) : réglage privé, activé par défaut
  const [emailNotifs, setEmailNotifs] = useState(true);
  useEffect(() => {
    if (!user?.uid) return;
    getDoc(privateSettingsRef(user.uid))
      .then((snap) => { if (snap.exists() && snap.data().email_notifications === false) setEmailNotifs(false); })
      .catch(() => {});
  }, [user?.uid]);
  const handleEmailNotifsChange = async (value) => {
    setEmailNotifs(value);
    try {
      await setDoc(privateSettingsRef(user.uid), { email_notifications: value }, { merge: true });
      toast.success(t('settings.toast.saved'));
    } catch (error) {
      console.error(error);
      setEmailNotifs(!value);
      toast.error(t('settings.toast.error'));
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
    { id: "account", label: t('settings.tabs.account'), icon: User },
    { id: "appearance", label: t('settings.tabs.appearance'), icon: Palette },
    { id: "preferences", label: t('settings.tabs.preferences'), icon: Settings2 },
  ];

  return (
    <div className="w-full animate-in fade-in duration-500">
      
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">{t('settings.title')}</h1>
        <p className="text-base text-gray-500 dark:text-gray-400 mt-2">{t('settings.subtitle')}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        
        {/* --- MENU LATÉRAL --- */}
        <aside className="w-full md:w-[280px] shrink-0">
          <nav className="flex flex-col gap-2">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-between px-5 py-4 rounded-2xl text-base font-medium transition-all ${
                    isActive 
                      ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 shadow-sm" 
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#282a2c] hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <tab.icon className={`w-5 h-5 ${isActive ? "text-indigo-600 dark:text-indigo-400" : ""}`} />
                    {tab.label}
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* --- CONTENU DE L'ONGLET --- */}
        <main className="flex-1">
          
          {/* 👤 ONGLET : MON COMPTE */}
          {activeTab === "account" && (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <div className="bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] rounded-3xl p-8 md:p-12 shadow-sm transition-colors duration-300">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{t('settings.account.title')}</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1">{t('settings.account.email')}</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input 
                        disabled 
                        value={user?.email || ""} 
                        className="pl-12 py-7 bg-gray-50 dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-600 dark:text-gray-300 rounded-2xl cursor-not-allowed text-base border-dashed" 
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1">{t('settings.account.fullName')}</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input 
                        disabled 
                        value={user?.displayName || user?.full_name || t('settings.account.defaultStudent')} 
                        className="pl-12 py-7 bg-gray-50 dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-600 dark:text-gray-300 rounded-2xl cursor-not-allowed text-base border-dashed" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 p-5 rounded-2xl bg-indigo-50/30 dark:bg-indigo-500/5 border border-indigo-100/50 dark:border-indigo-500/10">
                  <p className="text-sm text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> 
                    {t('settings.account.syncNotice')}
                  </p>
                </div>
              </div>

              {/* Zone de danger : suppression du compte */}
              <div className="mt-8 bg-white dark:bg-[#1e1f20] border border-red-100 dark:border-red-500/20 rounded-3xl p-8 md:p-12 shadow-sm">
                <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> {t('settings.danger.title')}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">{t('settings.danger.desc')}</p>
                <Button
                  variant="outline"
                  onClick={() => { setDeleteConfirmText(""); setShowDeleteModal(true); }}
                  className="rounded-xl border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 bg-transparent"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> {t('settings.danger.button')}
                </Button>
              </div>
            </div>
          )}

          {showDeleteModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in p-4">
              <div role="dialog" aria-modal="true" className="bg-white dark:bg-[#1e1f20] rounded-3xl p-6 shadow-2xl w-full max-w-md border border-gray-100 dark:border-[#333537] animate-in zoom-in-95">
                <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                  <Trash2 className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('settings.danger.modalTitle')}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">{t('settings.danger.modalDesc')}</p>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="delete-confirm">
                  {t('settings.danger.typeToConfirm', { word: confirmWord })}
                </label>
                <Input
                  id="delete-confirm"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  autoComplete="off"
                  className="mt-2 mb-6 rounded-xl bg-gray-50 dark:bg-[#131314] border-gray-200 dark:border-[#333537]"
                />
                {/* Compte e-mail : la confirmation se fait par mot de passe (pas de fenêtre Google) */}
                {isPasswordAccount && (
                  <>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="delete-password">{t('auth.password')}</label>
                    <Input id="delete-password" type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)}
                      autoComplete="current-password" className="mt-2 mb-6 rounded-xl bg-gray-50 dark:bg-[#131314] border-gray-200 dark:border-[#333537]" />
                  </>
                )}
                <div className="flex gap-3 justify-end">
                  <Button variant="ghost" disabled={isDeleting} onClick={() => setShowDeleteModal(false)} className="rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#282a2c]">
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

          {/* 🎨 ONGLET : APPARENCE */}
          {activeTab === "appearance" && (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <div className="bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] rounded-3xl p-8 md:p-12 shadow-sm transition-colors duration-300">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('settings.appearance.title')}</h2>
                <p className="text-base text-gray-500 dark:text-gray-400 mb-10">{t('settings.appearance.subtitle')}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {/* Mode Clair */}
                  <button 
                    onClick={() => setTheme("light")}
                    className={`relative p-6 rounded-3xl border-2 text-left transition-all group ${!isDarkMode ? "border-indigo-600 bg-indigo-50/50" : "border-gray-100 dark:border-[#333537] hover:border-gray-300 dark:hover:border-gray-600"}`}
                  >
                    <div className="w-full h-40 bg-gray-50 rounded-2xl border border-gray-200 mb-6 flex items-center justify-center transition-transform group-hover:scale-[1.02]">
                       <Sun className="w-12 h-12 text-amber-500" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">{t('settings.appearance.light')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t('settings.appearance.lightDesc')}</p>
                    {!isDarkMode && <div className="absolute top-6 right-6 bg-indigo-600 rounded-full p-1"><CheckCircle2 className="w-5 h-5 text-white" /></div>}
                  </button>

                  {/* Mode Sombre */}
                  <button 
                    onClick={() => setTheme("dark")}
                    className={`relative p-6 rounded-3xl border-2 text-left transition-all group ${isDarkMode ? "border-indigo-500 bg-indigo-500/10" : "border-gray-100 dark:border-[#333537] hover:border-gray-300 dark:hover:border-gray-600"}`}
                  >
                    <div className="w-full h-40 bg-[#131314] rounded-2xl border border-[#333537] mb-6 flex items-center justify-center transition-transform group-hover:scale-[1.02]">
                       <Moon className="w-12 h-12 text-indigo-400" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">{t('settings.appearance.dark')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t('settings.appearance.darkDesc')}</p>
                    {isDarkMode && <div className="absolute top-6 right-6 bg-indigo-500 rounded-full p-1"><CheckCircle2 className="w-5 h-5 text-white" /></div>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ⚙️ ONGLET : PRÉFÉRENCES (Notifications + Confidentialité) */}
          {activeTab === "preferences" && (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <div className="bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] rounded-3xl p-8 md:p-12 shadow-sm transition-colors duration-300">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-10">{t('settings.preferences.title')}</h2>
                
                <div className="space-y-12">
                  
                  {/* Section Notifications */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                      <Bell className="w-5 h-5 text-indigo-500" /> {t('settings.preferences.notifications')}
                    </h3>
                    <div className="space-y-8">
                      <div className="flex items-center justify-between gap-8">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">{t('settings.preferences.requestAlerts')}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('settings.preferences.requestAlertsDesc')}</p>
                        </div>
                        <Switch
                          aria-label={t('settings.preferences.requestAlerts')}
                          checked={requestAlerts}
                          onCheckedChange={handleRequestAlertsChange}
                          className="data-[state=checked]:bg-indigo-600"
                        />
                      </div>
                      {/* E-mails : nouvelle demande, nouveau message (au plus un par conversation et
                          par demi-heure), rappels de session. Envoyés par les Cloud Functions. */}
                      <div className="flex items-center justify-between gap-8">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">{t('settings.preferences.emailNotifs')}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('settings.preferences.emailNotifsDesc')}</p>
                        </div>
                        <Switch
                          aria-label={t('settings.preferences.emailNotifs')}
                          checked={emailNotifs}
                          onCheckedChange={handleEmailNotifsChange}
                          className="data-[state=checked]:bg-indigo-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="h-px w-full bg-gray-100 dark:bg-[#333537]"></div>

                  {/* Section Confidentialité */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                      <Shield className="w-5 h-5 text-emerald-500" /> {t('settings.preferences.privacy')}
                    </h3>
                    <div className="space-y-8">
                      <div className="flex items-center justify-between gap-8">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">{t('settings.preferences.profileVisibility')}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('settings.preferences.profileVisibilityDesc')}</p>
                        </div>
                        <Switch
                          aria-label={t('settings.preferences.profileVisibility')}
                          checked={profileVisible}
                          onCheckedChange={handleVisibilityChange}
                          disabled={!visibilityLoaded}
                          className="data-[state=checked]:bg-indigo-600"
                        />
                      </div>

                      {/* Personnes bloquées */}
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{t('settings.preferences.blocked')}</p>
                        {blockedList.length === 0 ? (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('settings.preferences.noBlocked')}</p>
                        ) : (
                          <ul className="mt-3 space-y-2">
                            {blockedList.map((b) => (
                              <li key={b.blocked} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-gray-50 dark:bg-[#131314]">
                                <span className="text-sm text-gray-800 dark:text-gray-200 truncate">{b.blocked_name || t('settings.preferences.unknownUser')}</span>
                                <Button variant="ghost" size="sm" className="rounded-xl text-indigo-600 dark:text-indigo-400"
                                  onClick={() => unblockUser(user.uid, b.blocked).then(() => toast.success(t('settings.toast.saved')))}>
                                  {t('settings.preferences.unblock')}
                                </Button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Liens légaux : le footer n'est plus affiché sous les pages de l'application */}
      <nav className="mt-12 pt-6 border-t border-gray-100 dark:border-[#333537] flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
        <Link to={createPageUrl("About")} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t('footer.about')}</Link>
        <Link to={createPageUrl("Legal")} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t('footer.legal')}</Link>
        <Link to={createPageUrl("Privacy")} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t('footer.privacy')}</Link>
        <span>contact@buddyetude.fr</span>
        <span className="sm:ml-auto">© {new Date().getFullYear()} BuddyEtude</span>
      </nav>
    </div>
  );
}
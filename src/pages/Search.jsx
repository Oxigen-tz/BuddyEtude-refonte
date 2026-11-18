import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, query, where, onSnapshot, setDoc, doc, getDoc, limit, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/lib/AuthContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search as SearchIcon, Filter, Users, Loader2, MapPin, Monitor, BookOpen, Lock, HandHelping, BadgeCheck, AlertTriangle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import BuddyCard from "@/components/search/BuddyCard";
import Autocomplete from "@/components/ui/Autocomplete";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { createPageUrl } from "@/utils";
import { useRequests, buildRelations } from "@/hooks/useRequests";
import { useBlocks } from "@/hooks/useBlocks";
import { pairId } from "@/lib/pairs";
import { computeMatch, computeHelp } from "@/lib/matching";
import { LEVEL_VALUES as PROFILE_LEVELS, suggestSubjects, suggestCities } from "@/lib/catalog";
import { REQUESTS_PER_DAY, detectContactInfo } from "@/lib/safety";
import InviteCard from "@/components/InviteCard";

// Nombre maximum de profils chargés : suffisant pour quelques centaines d'inscrits ; au-delà,
// il faudra filtrer côté serveur (par niveau ou par ville) plutôt que tout charger.
const MAX_PROFILES = 300;

// On ne garde ici que les valeurs techniques ; le libellé affiché vient de
// search.levels.<value> / search.types.<value> via t(), résolu au rendu.
const LEVEL_VALUES = ["all", ...PROFILE_LEVELS.filter((v) => v !== "autre")];
const TYPE_VALUES = ["all", "online", "inperson"];

// Un profil n'apparaît dans la recherche que s'il est exploitable :
// - au moins une matière,
// - un niveau ou un établissement.
// Le flag profile_complete seul ne suffit pas : il peut être à true avec un profil quasi vide.
const hasUsableProfile = (p) => {
  const hasSubjects = Array.isArray(p.subjects) && p.subjects.length > 0;
  const hasContext = Boolean(p.level || p.school);
  return hasSubjects && hasContext && p.banned !== true;
};

export default function Search() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  // "buddy" : trouver un binôme ; "help" : trouver quelqu'un d'« Avancé » pour m'aider (mentorat)
  const [mode, setMode] = useState("buddy");
  const [verifiedOnly, setVerifiedOnly] = useState(false); 

  const [requestDialog, setRequestDialog] = useState(null);   // { profile, kind, helpSubjects }
  const [requestMessage, setRequestMessage] = useState("");
  const [requestSubject, setRequestSubject] = useState("");
  const [contactWarning, setContactWarning] = useState(false);
  
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Demandes dans les deux sens : permet d'afficher "Déjà binôme" / "Vous a envoyé une demande"
  // au lieu de proposer une nouvelle demande (avant, on pouvait créer deux demandes croisées)
  const requests = useRequests(user?.uid);
  const relations = buildRelations(requests);
  const blocked = useBlocks(user?.uid);

  // Mon propre profil : sert à calculer la compatibilité avec les autres
  const [myProfile, setMyProfile] = useState(null);
  useEffect(() => {
    if (!user?.uid) return;
    getDoc(doc(db, "users", user.uid)).then((snap) => setMyProfile(snap.exists() ? snap.data() : null)).catch(() => {});
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;

    // profile_visible == true est exigé par les règles Firestore (réglage de visibilité)
    const qProfiles = query(
      collection(db, "users"),
      where("profile_complete", "==", true),
      where("profile_visible", "==", true),
      limit(MAX_PROFILES)
    );
    const unsubProfiles = onSnapshot(
      qProfiles,
      (snapshot) => {
        const pList = snapshot.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(p => p.id !== user.uid)
          // On masque les profils vides ou inexploitables
          .filter(hasUsableProfile);
        setProfiles(pList);
        setIsLoading(false);
      },
      (error) => {
        // Sans ce callback, une erreur de règles Firestore laisserait les squelettes affichés indéfiniment
        console.error("Erreur de chargement des profils:", error);
        toast.error(t('search.toast.loadError'));
        setIsLoading(false);
      }
    );

    return () => unsubProfiles();
  }, [user]);

  // Si l'utilisateur n'est pas connecté, on bloque l'accès avec un écran propre
  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-24 px-6 bg-white dark:bg-ink-900 rounded-3xl border border-gray-100 dark:border-ink-700 shadow-sm my-12 animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t('search.loginRequired.title')}</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
          {t('search.loginRequired.desc')}
        </p>
        <Button 
          onClick={() => navigate("/")} 
          className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white py-6 rounded-xl font-medium shadow-sm transition-all"
        >
          {t('search.loginRequired.button')}
        </Button>
      </div>
    );
  }

  const openConversation = (uid) => navigate(`${createPageUrl("Messages")}?chat=${encodeURIComponent(uid)}`);

  const openRequest = (profile, kind = "buddy", helpSubjects = []) => {
    setRequestDialog({ profile, kind, helpSubjects });
    setRequestSubject(helpSubjects[0] || "");
    setRequestMessage("");
    setContactWarning(false);
  };
  const closeRequest = () => {
    setRequestDialog(null);
    setRequestMessage("");
    setContactWarning(false);
  };

  const handleSendRequest = async () => {
    if (!requestDialog || !user) return;
    const target = requestDialog.profile;

    // Garde-fous : jamais de demande à soi-même, ni de doublon (dans un sens ou dans l'autre)
    if (target.id === user.uid || relations.has(target.id)) {
      closeRequest();
      return;
    }

    // Anti-abus : nombre de demandes par jour (la limite réelle est vérifiée côté serveur)
    const dayAgo = Date.now() - 24 * 3600 * 1000;
    const sentToday = requests.outgoing.filter((r) => (r.createdAt?.toMillis?.() || Date.now()) > dayAgo).length;
    if (sentToday >= REQUESTS_PER_DAY) {
      toast.error(t('search.toast.dailyLimit', { count: REQUESTS_PER_DAY }));
      return;
    }

    // Coordonnées ou lien envoyés à un inconnu : on prévient une fois avant l'envoi
    if (!contactWarning && detectContactInfo(requestMessage)) {
      setContactWarning(true);
      return;
    }

    setIsSending(true);
    try {
      const isHelp = requestDialog.kind === "help";
      let subject = isHelp ? requestSubject : t('search.defaultSubject');
      if (!isHelp && Array.isArray(target.subjects) && target.subjects.length > 0) {
        subject = typeof target.subjects[0] === "string" ? target.subjects[0] : target.subjects[0].name;
      }

      // Une seule demande par paire : son id est la paire de uids (voir firestore.rules)
      await setDoc(doc(db, "requests", pairId(user.uid, target.id)), {
        from_uid: user.uid,
        from_name: myProfile?.display_name || user.displayName || user.full_name || t('search.defaultStudent'),
        to_uid: target.id,
        to_name: target.display_name || target.full_name,
        participants: [user.uid, target.id].sort(),
        message: requestMessage,
        status: "pending",
        kind: isHelp ? "help" : "buddy",
        subject,
        createdAt: serverTimestamp(),
      });

      toast.success(t(isHelp ? 'search.toast.helpSuccess' : 'search.toast.success'));
      closeRequest();
    } catch (error) {
      console.error(error);
      toast.error(t('search.toast.error'));
    } finally {
      setIsSending(false);
    }
  };

  const filteredProfiles = profiles.filter(p => {
    if (blocked.has(p.id)) return false;
    if (verifiedOnly && !p.verified_domain) return false;
    if (levelFilter !== "all" && p.level !== levelFilter) return false;
    if (typeFilter === "online" && !p.is_online) return false;
    if (typeFilter === "inperson" && !p.is_in_person) return false;
    if (cityFilter && !p.city?.toLowerCase().includes(cityFilter.toLowerCase())) return false;
    if (subjectFilter && mode === "buddy") {
      const hasSubject = p.subjects?.some(s => {
        const subjectName = typeof s === "string" ? s : s.name;
        return subjectName?.toLowerCase().includes(subjectFilter.toLowerCase());
      });
      if (!hasSubject) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      const matchName = (p.display_name || p.full_name || "").toLowerCase().includes(q);
      const matchSchool = (p.school || "").toLowerCase().includes(q);
      return matchName || matchSchool;
    }
    return true;
  })
    // Les profils les plus compatibles en premier (matières en commun, niveau, ville…)
    .map((p) => ({ profile: p, match: computeMatch(myProfile, p), help: computeHelp(myProfile, p, subjectFilter) }))
    // Mode « aide » : seulement ceux qui sont « Avancé » là où j'ai besoin d'aide
    .filter((r) => mode === "buddy" || r.help.length > 0)
    .sort((a, b) => (mode === "help" ? b.help.length - a.help.length : 0) || b.match.score - a.match.score);

  const resetFilters = () => {
    setSearch("");
    setSubjectFilter("");
    setCityFilter("");
    setLevelFilter("all");
    setTypeFilter("all");
    setVerifiedOnly(false);
  };

  const needsHelpSomewhere = (myProfile?.subjects || []).some((s) => s.level === "debutant" || s.level === "intermediaire");

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      
      {/* --- EN-TÊTE --- */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center shadow-sm border border-indigo-100 dark:border-indigo-500/20">
          <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{t('search.title')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('search.subtitle')}</p>
        </div>
      </div>

      {/* --- MODE : binôme ou aide (mentorat) --- */}
      <div role="tablist" aria-label={t('search.mode.label')} className="inline-flex p-1 mb-4 rounded-xl bg-gray-100 dark:bg-ink-900 border border-gray-200 dark:border-ink-700">
        {[["buddy", Users], ["help", HandHelping]].map(([value, Icon]) => (
          <button key={value} role="tab" aria-selected={mode === value} onClick={() => setMode(value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === value ? "bg-white dark:bg-ink-800 text-indigo-700 dark:text-indigo-300 shadow-sm" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"}`}>
            <Icon className="w-4 h-4" /> {t(`search.mode.${value}`)}
          </button>
        ))}
      </div>
      {mode === "help" && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-3xl">
          {needsHelpSomewhere || subjectFilter ? t('search.mode.helpDesc') : t('search.mode.helpNoNeed')}
        </p>
      )}

      {/* --- PANNEAU DE FILTRES MULTIPLES --- */}
      <div className="bg-white dark:bg-ink-900 p-5 rounded-2xl border border-gray-100 dark:border-ink-700 shadow-sm mb-8 space-y-4 transition-colors duration-300">
        
        {/* Ligne 1 : Recherche générale & Matière avec Autocomplétion dynamique */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('search.searchPlaceholder')}
              className="pl-11 h-[50px] rounded-xl border-gray-200 dark:border-ink-700 bg-gray-50 dark:bg-ink-950 text-gray-900 dark:text-gray-100 focus-visible:ring-indigo-500/50"
            />
          </div>
          
          <div className="flex-1">
            <Autocomplete
              ariaLabel={t('search.subjectPlaceholder')}
              minChars={1}
              fetchOptions={(q) => suggestSubjects(q)}
              value={subjectFilter}
              onChange={setSubjectFilter}
              placeholder={t('search.subjectPlaceholder')}
              icon={BookOpen}
            />
          </div>
        </div>

        {/* Ligne 2 : Ville (API infinie) & Menus déroulants */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Autocomplete
              ariaLabel={t('search.cityPlaceholder')}
              fetchOptions={suggestCities}
              value={cityFilter}
              onChange={setCityFilter}
              placeholder={t('search.cityPlaceholder')}
              icon={MapPin}
            />
          </div>
          
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-full md:w-[220px] h-[50px] rounded-xl border-gray-200 dark:border-ink-700 bg-white dark:bg-ink-900 text-gray-700 dark:text-gray-300">
              <Filter className="w-4 h-4 mr-2 text-indigo-500" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark:bg-ink-900 dark:border-ink-700 dark:text-gray-100 rounded-xl">
              {LEVEL_VALUES.map(value => (
                <SelectItem key={value} value={value} className="focus:bg-indigo-50 dark:focus:bg-indigo-500/10 cursor-pointer rounded-lg">
                  {t(`search.levels.${value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[240px] h-[50px] rounded-xl border-gray-200 dark:border-ink-700 bg-white dark:bg-ink-900 text-gray-700 dark:text-gray-300">
              {typeFilter === "online" ? <Monitor className="w-4 h-4 mr-2 text-emerald-500" /> : <MapPin className="w-4 h-4 mr-2 text-blue-500" />}
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark:bg-ink-900 dark:border-ink-700 dark:text-gray-100 rounded-xl">
              {TYPE_VALUES.map(value => (
                <SelectItem key={value} value={value} className="focus:bg-indigo-50 dark:focus:bg-indigo-500/10 cursor-pointer rounded-lg">
                  {t(`search.types.${value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ligne 3 : étudiants vérifiés uniquement */}
        <label className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer w-fit">
          <Switch checked={verifiedOnly} onCheckedChange={setVerifiedOnly} aria-label={t('search.verifiedOnly')} />
          <BadgeCheck className="w-4 h-4 text-sky-500" /> {t('search.verifiedOnly')}
        </label>
      </div>

      {/* --- RÉSULTATS --- */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl dark:bg-ink-900" />
          ))}
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-ink-900 rounded-2xl border border-dashed border-gray-200 dark:border-ink-700 transition-colors duration-300">
          <div className="w-16 h-16 bg-gray-50 dark:bg-ink-950 rounded-full flex items-center justify-center mx-auto mb-4">
            <SearchIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-gray-900 dark:text-white text-lg font-bold">{t('search.noResults.title')}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 max-w-sm mx-auto">
            {t('search.noResults.desc')}
          </p>
          <Button 
            variant="outline" 
            onClick={resetFilters}
            className="mt-6 rounded-xl border-gray-200 dark:border-ink-700 hover:bg-gray-50 dark:hover:bg-ink-800"
          >
            {t('search.noResults.reset')}
          </Button>
          <div className="max-w-xl mx-auto mt-10 px-4 text-left"><InviteCard compact /></div>
        </div>
      ) : (
        <>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map(({ profile: p, match, help }) => (
            <BuddyCard
              key={p.id}
              profile={p}
              match={match}
              help={help}
              mode={mode}
              onRequest={(profile) => openRequest(profile, mode, help)}
              onOpenConversation={() => openConversation(p.id)}
              relation={relations.get(p.id)?.status || null}
              isOwnProfile={p.id === user.uid}
            />
          ))}
        </div>
        {/* Peu de résultats : proposer d'inviter des camarades */}
        {filteredProfiles.length < 6 && <div className="mt-6"><InviteCard compact /></div>}
        </>
      )}

      {/* --- POPUP DEMANDE DE BINÔME --- */}
      <Dialog open={!!requestDialog} onOpenChange={closeRequest}>
        <DialogContent className="rounded-3xl sm:rounded-3xl dark:bg-ink-900 dark:border-ink-700 dark:text-gray-100 p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{t(requestDialog?.kind === "help" ? 'search.helpDialog.title' : 'search.requestDialog.title')}</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            <Trans
              i18nKey={requestDialog?.kind === "help" ? "search.helpDialog.desc" : "search.requestDialog.desc"}
              values={{ name: requestDialog?.profile.display_name || requestDialog?.profile.full_name }}
              components={{ bold: <strong className="text-indigo-600 dark:text-indigo-400 font-semibold" /> }}
            />
          </DialogDescription>
          {requestDialog?.kind === "help" && requestDialog.helpSubjects.length > 0 && (
            <div className="mt-6 space-y-2">
              <label htmlFor="help-subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('search.helpDialog.subject')}</label>
              <Select value={requestSubject} onValueChange={setRequestSubject}>
                <SelectTrigger id="help-subject" className="rounded-xl bg-gray-50 dark:bg-ink-950 border-gray-200 dark:border-ink-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-ink-900 dark:border-ink-700 dark:text-gray-100 rounded-xl">
                  {requestDialog.helpSubjects.map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          <Textarea
            value={requestMessage}
            onChange={(e) => { setRequestMessage(e.target.value); setContactWarning(false); }}
            maxLength={1000}
            aria-label={t('search.requestDialog.placeholder')}
            placeholder={t(requestDialog?.kind === "help" ? 'search.helpDialog.placeholder' : 'search.requestDialog.placeholder')}
            className="h-32 mt-6 resize-none bg-gray-50 dark:bg-ink-950 border-gray-200 dark:border-ink-700 text-gray-900 dark:text-gray-100 focus-visible:ring-indigo-500/50 rounded-2xl p-4"
          />
          {contactWarning && (
            <div role="alert" className="mt-4 flex gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-sm text-amber-900 dark:text-amber-200">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{t('search.contactWarning')}</span>
            </div>
          )}
          <DialogFooter className="mt-8 flex gap-3 sm:gap-4">
            <Button 
              variant="outline" 
              onClick={closeRequest} 
              className="rounded-xl border-gray-200 dark:border-ink-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-ink-800 flex-1 sm:flex-none py-6 font-medium"
            >
              {t('search.requestDialog.cancel')}
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl flex-1 sm:flex-none py-6 font-medium"
              disabled={isSending || !requestMessage.trim()}
              onClick={handleSendRequest}
            >
              {isSending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {contactWarning ? t('search.sendAnyway') : t('search.requestDialog.send')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
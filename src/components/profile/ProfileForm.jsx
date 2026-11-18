import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X, Plus, Save, Loader2, MapPin, School, UserRound, BookOpen, Target, Clock, ShieldCheck, Sparkles, Monitor, Users, Sunrise, Sun, Moon, CalendarHeart } from "lucide-react";
import { IconTile } from "@/components/settings/SettingsUI";
import Autocomplete from "@/components/ui/Autocomplete";
import { LEVEL_VALUES, POPULAR_SUBJECTS, suggestSubjects, suggestCities, suggestSchools } from "@/lib/catalog";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

// Niveaux d'études, matières, villes et établissements : voir src/lib/catalog.js
const STYLE_VALUES = ["visuel", "auditif", "pratique", "lecture", "mixte"];
const SUBJECT_LEVEL_VALUES = ["debutant", "intermediaire", "avance"];

// ⚠️ Ces valeurs sont écrites telles quelles en base (form.availability).
// On les garde en français pour ne pas casser les profils déjà enregistrés ;
// seul l'affichage passe par profileForm.availabilityLabels.<valeur>.
const AVAILABILITIES = [["Matin", Sunrise], ["Après-midi", Sun], ["Soir", Moon], ["Week-end", CalendarHeart]];
// Couleur du niveau sélectionné (1 = débutant, 2 = intermédiaire, 3 = avancé)
const LEVEL_PILL = { debutant: "bg-amber-400 text-white", intermediaire: "bg-brand-500 text-white", avance: "bg-lime-400 text-gray-900" };

export default function ProfileForm({ profile, onSave, saving }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    display_name: "", bio: "", school: "", level: "",
    subjects: [], goals: [], availability: [], study_style: "",
    city: "", is_online: true, is_in_person: false, mentor_available: true,
    age_bracket: "", parental_consent: false,
  });

  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectLevel, setNewSubjectLevel] = useState("intermediaire");
  const [newGoal, setNewGoal] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (profile) {
      const normalizedSubjects = Array.isArray(profile.subjects) 
        ? profile.subjects.map(s => typeof s === "string" ? { name: s, level: "intermediaire" } : s)
        : [];

      setForm({
        ...form, ...profile,
        subjects: normalizedSubjects,
        goals: Array.isArray(profile.goals) ? profile.goals : [],
        availability: Array.isArray(profile.availability) ? profile.availability : [],
      });
    }
  }, [profile]);

  const addSubject = (name, level) => {
    if (!name.trim()) return;
    const current = Array.isArray(form.subjects) ? form.subjects : [];
    if (!current.some(s => s.name.toLowerCase() === name.trim().toLowerCase())) {
      setForm({ ...form, subjects: [...current, { name: name.trim(), level }] });
    }
    setNewSubjectName("");
    setNewSubjectLevel("intermediaire");
    setShowSuggestions(false);
  };

  const removeSubject = (name) => {
    const current = Array.isArray(form.subjects) ? form.subjects : [];
    setForm({ ...form, subjects: current.filter(s => s.name !== name) });
  };

  const addGoal = () => {
    const goals = Array.isArray(form.goals) ? form.goals : [];
    const goal = newGoal.trim(); // évite les objectifs vides ("   ") ou en double à un espace près
    if (goal && !goals.includes(goal)) {
      setForm({ ...form, goals: [...goals, goal] });
    }
    setNewGoal("");
  };

  const removeGoal = (goal) => {
    const goals = Array.isArray(form.goals) ? form.goals : [];
    setForm({ ...form, goals: goals.filter(g => g !== goal) });
  };

  const toggleAvailability = (slot) => {
    const avail = Array.isArray(form.availability) ? form.availability : [];
    const updated = avail.includes(slot) ? avail.filter(a => a !== slot) : [...avail, slot];
    setForm({ ...form, availability: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🛠️ CORRIGÉ : le formulaire marquait le profil "complet" même vide, d'où les profils sans
    // matière ni établissement visibles dans la recherche. Mêmes critères que Search.jsx.
    const hasName = Boolean(form.display_name?.trim());
    const hasSubjects = Array.isArray(form.subjects) && form.subjects.length > 0;
    const hasContext = Boolean(form.level || form.school?.trim());
    if (!hasName || !hasSubjects || !hasContext) {
      toast.error(t('profileForm.validation.incomplete'));
      return;
    }
    // Âge : en France, avant 15 ans, l'utilisation d'un service en ligne demande l'accord
    // d'un parent (RGPD / loi Informatique et Libertés). À valider juridiquement.
    if (!form.age_bracket) {
      toast.error(t('profileForm.age.required'));
      return;
    }
    if (form.age_bracket === "under15" && !form.parental_consent) {
      toast.error(t('profileForm.age.consentRequired'));
      return;
    }

    onSave({ ...form, display_name: form.display_name.trim(), profile_complete: true });
  };

  const getLevelLabel = (val) => t(`profileForm.subjectLevels.${val}`, val);

  const filteredSuggestions = suggestSubjects(newSubjectName, (form.subjects || []).map((x) => x.name));
  const hasAdvancedSubject = (form.subjects || []).some((x) => x.level === "avance");
  const fieldClass = "h-11 bg-gray-50/80 dark:bg-ink-950 border-gray-200 dark:border-ink-700 text-gray-900 dark:text-gray-100 rounded-xl focus-visible:bg-white dark:focus-visible:bg-ink-950";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in duration-300">

      {/* 1. Informations générales */}
      <Step n={1} icon={UserRound} tone="brand" title={t('profileForm.sections.general')} desc={t('profileUi.form.general')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="profile-name">{t('profileForm.displayName')}</Label>
            <Input id="profile-name" value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })}
              placeholder={t('profileForm.displayNamePlaceholder')} maxLength={40} className={fieldClass} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-city">{t('profileForm.city')}</Label>
            <Autocomplete id="profile-city" ariaLabel={t('profileForm.city')} value={form.city}
              onChange={(v) => setForm((f) => ({ ...f, city: v }))} fetchOptions={suggestCities}
              placeholder={t('profileForm.cityPlaceholder')} maxLength={60} icon={MapPin} inputClassName={`${fieldClass} pl-11`} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-school">{t('profileForm.school')}</Label>
            <Autocomplete id="profile-school" ariaLabel={t('profileForm.school')} value={form.school}
              onChange={(v) => setForm((f) => ({ ...f, school: v }))} fetchOptions={suggestSchools}
              placeholder={t('profileForm.schoolPlaceholder')} maxLength={120} icon={School} inputClassName={`${fieldClass} pl-11`} />
          </div>
          <div className="space-y-2">
            <Label>{t('profileForm.level')}</Label>
            <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
              <SelectTrigger aria-label={t('profileForm.level')} className={fieldClass}>
                <SelectValue placeholder={t('profileForm.levelPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {LEVEL_VALUES.map(value => (
                  <SelectItem key={value} value={value} className="cursor-pointer">{t(`buddyCard.levels.${value}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2 mt-5">
          <div className="flex items-end justify-between">
            <Label htmlFor="profile-bio">{t('profileForm.bio')}</Label>
            <span className="text-xs text-gray-400 tabular-nums">{(form.bio || "").length}/400</span>
          </div>
          <Textarea id="profile-bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} maxLength={400}
            className={`${fieldClass} h-28 py-3`} placeholder={t('profileForm.bioPlaceholder')} />
        </div>
      </Step>

      {/* 2. Matières & Niveaux */}
      <Step n={2} icon={BookOpen} tone="purple" title={t('profileForm.sections.subjectsLevels')} desc={t('profileUi.form.subjects')}>
        {form.subjects.length > 0 && (
          <ul className="grid sm:grid-cols-2 gap-2 mb-4">
            {form.subjects.map(s => (
              <li key={s.name} className="flex items-center gap-3 rounded-xl border border-gray-200/80 dark:border-ink-700 bg-gray-50/70 dark:bg-ink-950/50 pl-3.5 pr-2 py-2">
                <span className="flex-1 min-w-0 font-semibold text-gray-900 dark:text-gray-100 truncate">{s.name}</span>
                {/* Changer le niveau sans retirer la matière */}
                <div role="radiogroup" aria-label={s.name} className="flex rounded-lg bg-white dark:bg-ink-900 border border-gray-200 dark:border-ink-700 p-0.5">
                  {SUBJECT_LEVEL_VALUES.map((lv, i) => (
                    <button key={lv} type="button" role="radio" aria-checked={s.level === lv} title={getLevelLabel(lv)}
                      onClick={() => setForm({ ...form, subjects: form.subjects.map((x) => x.name === s.name ? { ...x, level: lv } : x) })}
                      className={`w-7 h-6 rounded-md text-[11px] font-bold transition-colors ${s.level === lv ? LEVEL_PILL[lv] : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"}`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => removeSubject(s.name)} aria-label={t('profileForm.removeItem', { name: s.name })}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"><X className="w-4 h-4" /></button>
              </li>
            ))}
          </ul>
        )}
        {form.subjects.length > 0 && (
          <p className="-mt-2 mb-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
            {SUBJECT_LEVEL_VALUES.map((lv, i) => (
              <span key={lv} className="flex items-center gap-1.5"><span className={`w-4 h-4 rounded text-[10px] font-bold flex items-center justify-center ${LEVEL_PILL[lv]}`}>{i + 1}</span>{getLevelLabel(lv)}</span>
            ))}
          </p>
        )}

        <div className="flex flex-col md:flex-row gap-2 relative">
          <div className="relative flex-1">
            <Input className={`${fieldClass} w-full`} value={newSubjectName} maxLength={60}
              onChange={(e) => { setNewSubjectName(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSubject(newSubjectName, newSubjectLevel))}
              placeholder={t('profileForm.subjectPlaceholder')} />
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-ink-900 border border-gray-100 dark:border-ink-700 rounded-xl shadow-lift max-h-48 overflow-y-auto">
                {filteredSuggestions.map(suggestion => (
                  <div key={suggestion}
                    className="px-4 py-2.5 cursor-pointer hover:bg-brand-50 dark:hover:bg-ink-800 text-sm text-gray-700 dark:text-gray-300 font-medium transition-colors border-b border-gray-50 dark:border-ink-700 last:border-0"
                    onClick={() => { setNewSubjectName(suggestion); setShowSuggestions(false); }}>
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Select value={newSubjectLevel} onValueChange={setNewSubjectLevel}>
            <SelectTrigger className={`${fieldClass} w-full md:w-[200px]`}><SelectValue /></SelectTrigger>
            <SelectContent>
              {SUBJECT_LEVEL_VALUES.map(value => (
                <SelectItem key={value} value={value} className="cursor-pointer">{t(`profileForm.subjectLevels.${value}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" className="h-11 rounded-xl" onClick={() => addSubject(newSubjectName, newSubjectLevel)}>
            <Plus className="w-4 h-4 mr-1" /> {t('profileForm.add')}
          </Button>
        </div>

        <div className="pt-4">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">{t('profileForm.quickSuggestions')}</p>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_SUBJECTS.map(s => (
              <button key={s} type="button" onClick={() => addSubject(s, "intermediaire")}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-ink-950 border border-gray-200 dark:border-ink-700 text-gray-600 dark:text-gray-300 hover:border-brand-300 hover:bg-brand-50 dark:hover:bg-brand-500/10 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
                + {s}
              </button>
            ))}
          </div>
        </div>

        {/* Mentorat : aider les débutants dans ses matières « Avancé » */}
        <div className="mt-5 flex items-start gap-4 rounded-xl p-4 bg-lime-300/15 dark:bg-lime-300/5 border border-lime-300/40 dark:border-lime-300/15">
          <span className="shrink-0 w-9 h-9 rounded-xl bg-lime-300/40 dark:bg-lime-300/15 text-lime-800 dark:text-lime-300 flex items-center justify-center"><Sparkles className="w-4 h-4" /></span>
          <div className="flex-1">
            <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{t('profileForm.mentor')}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{hasAdvancedSubject ? t('profileForm.mentorDesc') : t('profileForm.mentorNeedsAdvanced')}</p>
          </div>
          <Switch aria-label={t('profileForm.mentor')} checked={form.mentor_available !== false} onCheckedChange={(v) => setForm({ ...form, mentor_available: v })} />
        </div>
      </Step>

      {/* 3. Objectifs */}
      <Step n={3} icon={Target} tone="coral" title={t('profileForm.sections.goals')} desc={t('profileUi.form.goals')}>
        {(form.goals || []).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {form.goals.map(g => (
              <span key={g} className="inline-flex items-center gap-1.5 rounded-xl bg-coral-50 dark:bg-coral-500/10 text-coral-700 dark:text-coral-300 pl-3 pr-1.5 py-1.5 text-sm font-semibold">
                {g}
                <button type="button" onClick={() => removeGoal(g)} aria-label={t('profileForm.removeItem', { name: g })} className="w-5 h-5 rounded-md flex items-center justify-center hover:bg-coral-100 dark:hover:bg-coral-500/20"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Input value={newGoal} onChange={(e) => setNewGoal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addGoal())}
            placeholder={t('profileForm.goalPlaceholder')} maxLength={60} className={fieldClass} />
          <Button type="button" variant="outline" onClick={addGoal} aria-label={t('profileForm.addGoal')} className="h-11 rounded-xl"><Plus className="w-4 h-4" /></Button>
        </div>
      </Step>

      {/* 4. Préférences */}
      <Step n={4} icon={Clock} tone="sky" title={t('profileForm.sections.preferences')} desc={t('profileUi.form.preferences')}>
        <div className="space-y-2">
          <Label>{t('profileForm.availability')}</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {AVAILABILITIES.map(([slot, Icon]) => {
              const isSelected = Array.isArray(form.availability) && form.availability.includes(slot);
              return (
                <button key={slot} type="button" onClick={() => toggleAvailability(slot)} aria-pressed={isSelected}
                  className={`flex flex-col items-center gap-1.5 rounded-xl py-3 text-sm font-semibold border-2 transition-all ${
                    isSelected
                      ? "border-sky-400 bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300"
                      : "border-gray-200 dark:border-ink-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-ink-600"
                  }`}>
                  <Icon className="w-5 h-5" />
                  {t(`profileForm.availabilityLabels.${slot}`, slot)}
                </button>
              );
            })}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mt-5">
          <label className="flex items-center gap-3 rounded-xl border border-gray-200/80 dark:border-ink-700 p-3.5 cursor-pointer">
            <Monitor className="w-5 h-5 text-brand-500" />
            <span className="flex-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{t('profileForm.sessionsOnline')}</span>
            <Switch aria-label={t('profileForm.sessionsOnline')} checked={form.is_online} onCheckedChange={(v) => setForm({ ...form, is_online: v })} />
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-gray-200/80 dark:border-ink-700 p-3.5 cursor-pointer">
            <Users className="w-5 h-5 text-purple-500" />
            <span className="flex-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{t('profileForm.sessionsInPerson')}</span>
            <Switch aria-label={t('profileForm.sessionsInPerson')} checked={form.is_in_person} onCheckedChange={(v) => setForm({ ...form, is_in_person: v })} />
          </label>
        </div>
        <div className="space-y-2 mt-5">
          <Label>{t('profileForm.studyStyle')}</Label>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t('profileForm.studyStyle')}>
            {STYLE_VALUES.map(value => (
              <button key={value} type="button" role="radio" aria-checked={form.study_style === value}
                onClick={() => setForm({ ...form, study_style: value })}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  form.study_style === value
                    ? "bg-amber-50 dark:bg-amber-400/10 border-amber-300 dark:border-amber-400/40 text-amber-800 dark:text-amber-300"
                    : "border-gray-200 dark:border-ink-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                }`}>
                {t(`profileForm.styles.${value}`)}
              </button>
            ))}
          </div>
        </div>
      </Step>

      {/* 5. Âge (privé : jamais affiché aux autres étudiants) */}
      <Step n={5} icon={ShieldCheck} tone="lime" title={t('profileForm.age.title')} desc={t('profileForm.age.privateNote')}>
        <div className="flex flex-col sm:flex-row gap-2" role="radiogroup">
          {["15plus", "under15"].map((value) => (
            <label key={value} className={`flex-1 flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 cursor-pointer text-sm font-semibold transition-colors ${form.age_bracket === value ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10 text-brand-800 dark:text-brand-300" : "border-gray-200 dark:border-ink-700 text-gray-700 dark:text-gray-300"}`}>
              <input type="radio" name="age_bracket" value={value} checked={form.age_bracket === value}
                onChange={() => setForm({ ...form, age_bracket: value })} className="accent-brand-600 w-4 h-4" />
              {t(`profileForm.age.${value}`)}
            </label>
          ))}
        </div>
        {form.age_bracket === "under15" && (
          <label className="mt-3 flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-sm text-amber-900 dark:text-amber-200 cursor-pointer">
            <input type="checkbox" checked={!!form.parental_consent} onChange={(e) => setForm({ ...form, parental_consent: e.target.checked })} className="mt-0.5 accent-brand-600" />
            {t('profileForm.age.consent')}
          </label>
        )}
      </Step>

      {/* Barre d'enregistrement, toujours visible (au-dessus de la barre d'onglets sur mobile) */}
      <div className="sticky bottom-[calc(80px+env(safe-area-inset-bottom,0px))] lg:bottom-4 z-20">
        <div className="flex items-center gap-3 rounded-2xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-xl border border-gray-200/80 dark:border-ink-700 shadow-lift p-2.5 pl-4">
          <p className="hidden sm:block flex-1 text-sm text-gray-500 dark:text-gray-400">{t('profileUi.form.saveHint')}</p>
          <Button type="submit" className="w-full sm:w-auto h-11 px-6 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 text-white font-semibold shadow-glow" disabled={saving}>
            {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
            {t('profileForm.save')}
          </Button>
        </div>
      </div>
    </form>
  );
}

// Carte numérotée d'une étape du formulaire
function Step({ n, icon: Icon, tone, title, desc, children }) {
  return (
    <section className="rounded-2xl bg-white dark:bg-ink-900 border border-gray-200/70 dark:border-ink-700 shadow-soft p-5 sm:p-6">
      <header className="flex items-start gap-3.5 mb-5">
        <span className="relative">
          <IconTile icon={Icon} tone={tone} />
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-extrabold flex items-center justify-center ring-2 ring-white dark:ring-ink-900">{n}</span>
        </span>
        <div>
          <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
          {desc && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>}
        </div>
      </header>
      {children}
    </section>
  );
}

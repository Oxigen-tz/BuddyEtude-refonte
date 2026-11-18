import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { X, Plus, Save, Loader2, MapPin, School } from "lucide-react";
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
const AVAILABILITIES = ["Matin", "Après-midi", "Soir", "Week-end"];

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
  const fieldClass = "h-10 bg-gray-50 dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-900 dark:text-gray-100 rounded-xl";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-300">
      
      {/* Informations générales */}
      <div className="space-y-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('profileForm.sections.general')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="dark:text-gray-300">{t('profileForm.displayName')}</Label>
            <Input 
              value={form.display_name} 
              onChange={(e) => setForm({ ...form, display_name: e.target.value })} 
              placeholder={t('profileForm.displayNamePlaceholder')} 
              maxLength={40}
              className="bg-gray-50 dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-900 dark:text-gray-100 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label className="dark:text-gray-300">{t('profileForm.city')}</Label>
            <Autocomplete
              id="profile-city"
              ariaLabel={t('profileForm.city')}
              value={form.city}
              onChange={(v) => setForm((f) => ({ ...f, city: v }))}
              fetchOptions={suggestCities}
              placeholder={t('profileForm.cityPlaceholder')}
              maxLength={60}
              icon={MapPin}
              inputClassName={`${fieldClass} pl-11`}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="dark:text-gray-300">{t('profileForm.bio')}</Label>
          <Textarea 
            value={form.bio} 
            onChange={(e) => setForm({ ...form, bio: e.target.value })} 
            maxLength={400}
            className="h-24 bg-gray-50 dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-900 dark:text-gray-100 rounded-xl" 
            placeholder={t('profileForm.bioPlaceholder')} 
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="dark:text-gray-300">{t('profileForm.school')}</Label>
            <Autocomplete
              id="profile-school"
              ariaLabel={t('profileForm.school')}
              value={form.school}
              onChange={(v) => setForm((f) => ({ ...f, school: v }))}
              fetchOptions={suggestSchools}
              placeholder={t('profileForm.schoolPlaceholder')}
              maxLength={120}
              icon={School}
              inputClassName={`${fieldClass} pl-11`}
            />
          </div>
          <div className="space-y-2">
            <Label className="dark:text-gray-300">{t('profileForm.level')}</Label>
            <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
              <SelectTrigger aria-label={t('profileForm.level')} className="bg-gray-50 dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-900 dark:text-gray-100 rounded-xl">
                <SelectValue placeholder={t('profileForm.levelPlaceholder')} />
              </SelectTrigger>
              <SelectContent className="dark:bg-[#1e1f20] dark:border-[#333537] dark:text-gray-100">
                {LEVEL_VALUES.map(value => (
                  <SelectItem key={value} value={value} className="focus:bg-gray-100 dark:focus:bg-[#282a2c] cursor-pointer">
                    {t(`buddyCard.levels.${value}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Matières & Niveaux */}
      <div className="space-y-4 bg-indigo-50/50 dark:bg-[#131314] p-5 rounded-2xl border border-indigo-50 dark:border-[#333537] transition-colors duration-300">
        <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-400">{t('profileForm.sections.subjectsLevels')}</h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {form.subjects.map(s => (
            <Badge key={s.name} variant="secondary" className="bg-white dark:bg-[#1e1f20] border border-indigo-100 dark:border-indigo-500/20 text-indigo-800 dark:text-indigo-300 px-3 py-1.5 gap-1.5 shadow-sm">
              <span className="font-bold">{s.name}</span> 
              <span className="text-xs opacity-70 border-l border-indigo-200 dark:border-indigo-500/30 pl-1.5">{getLevelLabel(s.level)}</span>
              <button type="button" onClick={() => removeSubject(s.name)} aria-label={t('profileForm.removeItem', { name: s.name })} className="ml-1 hover:text-red-500 dark:hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
            </Badge>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-2 relative">
          <div className="relative flex-1">
            <Input 
              className="w-full bg-white dark:bg-[#1e1f20] border-gray-200 dark:border-[#333537] text-gray-900 dark:text-gray-100 rounded-xl" 
              value={newSubjectName} 
              maxLength={60}
              onChange={(e) => {
                setNewSubjectName(e.target.value);
                setShowSuggestions(true);
              }} 
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder={t('profileForm.subjectPlaceholder')} 
            />
            
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {filteredSuggestions.map(suggestion => (
                  <div 
                    key={suggestion}
                    className="px-4 py-2.5 cursor-pointer hover:bg-indigo-50 dark:hover:bg-[#282a2c] text-sm text-gray-700 dark:text-gray-300 font-medium transition-colors border-b border-gray-50 dark:border-[#333537] last:border-0"
                    onClick={() => {
                      setNewSubjectName(suggestion);
                      setShowSuggestions(false);
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Select value={newSubjectLevel} onValueChange={setNewSubjectLevel}>
            <SelectTrigger className="w-full md:w-[220px] bg-white dark:bg-[#1e1f20] border-gray-200 dark:border-[#333537] text-gray-900 dark:text-gray-100 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark:bg-[#1e1f20] dark:border-[#333537] dark:text-gray-100">
              {SUBJECT_LEVEL_VALUES.map(value => (
                <SelectItem key={value} value={value} className="focus:bg-gray-100 dark:focus:bg-[#282a2c] cursor-pointer">
                  {t(`profileForm.subjectLevels.${value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button type="button" className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl" onClick={() => addSubject(newSubjectName, newSubjectLevel)}>
            <Plus className="w-4 h-4 mr-1" /> {t('profileForm.add')}
          </Button>
        </div>
        
        <div className="pt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t('profileForm.quickSuggestions')}</p>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_SUBJECTS.map(s => (
              <button key={s} type="button" onClick={() => addSubject(s, "intermediaire")}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-white dark:bg-[#1e1f20] border border-gray-200 dark:border-[#333537] text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-[#282a2c] hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors">
                + {s}
              </button>
            ))}
          </div>
        </div>

        {/* Mentorat : aider les débutants dans ses matières « Avancé » */}
        <div className="flex items-start justify-between gap-6 pt-3 border-t border-indigo-100 dark:border-[#333537]">
          <div>
            <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{t('profileForm.mentor')}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {hasAdvancedSubject ? t('profileForm.mentorDesc') : t('profileForm.mentorNeedsAdvanced')}
            </p>
          </div>
          <Switch aria-label={t('profileForm.mentor')} checked={form.mentor_available !== false} onCheckedChange={(v) => setForm({ ...form, mentor_available: v })} />
        </div>
      </div>

      {/* Objectifs */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('profileForm.sections.goals')}</h3>
        <div className="flex flex-wrap gap-2">
          {(Array.isArray(form.goals) ? form.goals : []).map(g => (
            <Badge key={g} variant="secondary" className="bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-transparent dark:border-purple-500/20 px-3 py-1.5 gap-1.5">
              {g} <button type="button" onClick={() => removeGoal(g)} aria-label={t('profileForm.removeItem', { name: g })} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input 
            value={newGoal} 
            onChange={(e) => setNewGoal(e.target.value)} 
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addGoal())} 
            placeholder={t('profileForm.goalPlaceholder')} 
            maxLength={60}
            className="bg-gray-50 dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-900 dark:text-gray-100 rounded-xl"
          />
          <Button type="button" variant="outline" onClick={addGoal} aria-label={t('profileForm.addGoal')} className="rounded-xl border-gray-200 dark:border-[#333537] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#282a2c]">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Préférences */}
      <div className="space-y-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('profileForm.sections.preferences')}</h3>
        <div className="space-y-2">
          <Label className="dark:text-gray-300">{t('profileForm.studyStyle')}</Label>
          <Select value={form.study_style} onValueChange={(v) => setForm({ ...form, study_style: v })}>
            <SelectTrigger className="bg-gray-50 dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-900 dark:text-gray-100 rounded-xl">
              <SelectValue placeholder={t('profileForm.levelPlaceholder')} />
            </SelectTrigger>
            <SelectContent className="dark:bg-[#1e1f20] dark:border-[#333537] dark:text-gray-100">
              {STYLE_VALUES.map(value => (
                <SelectItem key={value} value={value} className="focus:bg-gray-100 dark:focus:bg-[#282a2c] cursor-pointer">
                  {t(`profileForm.styles.${value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3">
          <Label className="dark:text-gray-300">{t('profileForm.availability')}</Label>
          <div className="flex flex-wrap gap-2">
            {AVAILABILITIES.map(slot => {
              const isSelected = Array.isArray(form.availability) && form.availability.includes(slot);
              return (
                <button 
                  key={slot} 
                  type="button" 
                  onClick={() => toggleAvailability(slot)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isSelected 
                      ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-200 dark:ring-indigo-500/50" 
                      : "bg-gray-100 dark:bg-[#131314] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#282a2c] border border-transparent dark:border-[#333537]"
                  }`}
                >
                  {t(`profileForm.availabilityLabels.${slot}`, slot)}
                </button>
              )
            })}
          </div>
        </div>
        
        {/* Switchers avec fonds sombres */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#131314] border border-transparent dark:border-[#333537] rounded-xl transition-colors duration-300">
          <div><p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('profileForm.sessionsOnline')}</p></div>
          <Switch aria-label={t('profileForm.sessionsOnline')} checked={form.is_online} onCheckedChange={(v) => setForm({ ...form, is_online: v })} />
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#131314] border border-transparent dark:border-[#333537] rounded-xl transition-colors duration-300">
          <div><p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('profileForm.sessionsInPerson')}</p></div>
          <Switch aria-label={t('profileForm.sessionsInPerson')} checked={form.is_in_person} onCheckedChange={(v) => setForm({ ...form, is_in_person: v })} />
        </div>
      </div>

      {/* Âge (privé : jamais affiché aux autres étudiants) */}
      <fieldset className="space-y-3 p-5 rounded-2xl border border-gray-100 dark:border-[#333537]">
        <legend className="px-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{t('profileForm.age.title')}</legend>
        <p className="text-xs text-gray-500 dark:text-gray-400">{t('profileForm.age.privateNote')}</p>
        <div className="flex flex-col sm:flex-row gap-2" role="radiogroup">
          {["15plus", "under15"].map((value) => (
            <label key={value} className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer text-sm ${form.age_bracket === value ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-800 dark:text-indigo-300" : "border-gray-200 dark:border-[#333537] text-gray-700 dark:text-gray-300"}`}>
              <input type="radio" name="age_bracket" value={value} checked={form.age_bracket === value}
                onChange={() => setForm({ ...form, age_bracket: value })} className="accent-indigo-600" />
              {t(`profileForm.age.${value}`)}
            </label>
          ))}
        </div>
        {form.age_bracket === "under15" && (
          <label className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-sm text-amber-900 dark:text-amber-200 cursor-pointer">
            <input type="checkbox" checked={!!form.parental_consent} onChange={(e) => setForm({ ...form, parental_consent: e.target.checked })}
              className="mt-0.5 accent-indigo-600" />
            {t('profileForm.age.consent')}
          </label>
        )}
      </fieldset>

      <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 py-6 rounded-xl text-base font-semibold text-white shadow-sm" disabled={saving}>
        {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
        {t('profileForm.save')}
      </Button>
    </form>
  );
}
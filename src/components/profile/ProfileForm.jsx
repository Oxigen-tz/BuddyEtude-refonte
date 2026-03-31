import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { X, Plus, Save, Loader2 } from "lucide-react";

const LEVELS = [
  { value: "college", label: "Collège" }, { value: "lycee", label: "Lycée" },
  { value: "prepa", label: "Prépa" }, { value: "bts_iut", label: "BTS / IUT" },
  { value: "licence", label: "Licence" }, { value: "master", label: "Master" },
  { value: "doctorat", label: "Doctorat" }, { value: "autre", label: "Autre" },
];

const STYLES = [
  { value: "visuel", label: "Visuel" }, { value: "auditif", label: "Auditif" },
  { value: "pratique", label: "Pratique" }, { value: "lecture", label: "Lecture" },
  { value: "mixte", label: "Mixte" },
];

const SUBJECT_LEVELS = [
  { value: "debutant", label: "💡 Débutant (Besoin d'aide)" },
  { value: "intermediaire", label: "🤝 Intermédiaire (Je gère)" },
  { value: "avance", label: "🚀 Avancé (Je peux aider)" },
];

const AVAILABILITIES = ["Matin", "Après-midi", "Soir", "Week-end"];

const POPULAR_SUBJECTS = ["Mathématiques", "Physique", "Chimie", "SVT", "Anglais", "Informatique", "Économie"];

const ALL_SUBJECTS = [
  "Algorithmique", "Allemand", "Anatomie", "Anglais", "Architecture", "Arts Plastiques", 
  "Biologie", "Chimie", "Commerce", "Comptabilité", "Design", "Droit", "Droit Administratif", 
  "Droit Civil", "Droit Pénal", "Économie", "Espagnol", "Finance", "Français", "Géographie", 
  "Génie Civil", "Génie Électrique", "Gestion", "Histoire", "Informatique", "Italien", 
  "Littérature", "Management", "Marketing", "Mathématiques", "Mécanique", "Médecine", 
  "Philosophie", "Physique", "Physique Quantique", "Programmation", "Psychologie", 
  "Réseaux", "Sciences de l'Ingénieur", "Sociologie", "Statistiques", "STAPS", "SVT"
];

export default function ProfileForm({ profile, onSave, saving }) {
  const [form, setForm] = useState({
    display_name: "", bio: "", school: "", level: "",
    subjects: [], goals: [], availability: [], study_style: "",
    city: "", is_online: true, is_in_person: false,
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
    if (newGoal && !goals.includes(newGoal)) {
      setForm({ ...form, goals: [...goals, newGoal] });
      setNewGoal("");
    }
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
    onSave({ ...form, profile_complete: true });
  };

  const getLevelLabel = (val) => SUBJECT_LEVELS.find(l => l.value === val)?.label || val;

  const filteredSuggestions = newSubjectName.trim() === "" 
    ? [] 
    : ALL_SUBJECTS.filter(s => 
        s.toLowerCase().startsWith(newSubjectName.toLowerCase()) && 
        !(Array.isArray(form.subjects) && form.subjects.some(existing => existing.name.toLowerCase() === s.toLowerCase()))
      );

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-300">
      
      {/* Informations générales */}
      <div className="space-y-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Informations générales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="dark:text-gray-300">Nom affiché</Label>
            <Input 
              value={form.display_name} 
              onChange={(e) => setForm({ ...form, display_name: e.target.value })} 
              placeholder="Ex: Thomas D." 
              className="bg-gray-50 dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-900 dark:text-gray-100 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label className="dark:text-gray-300">Ville</Label>
            <Input 
              value={form.city} 
              onChange={(e) => setForm({ ...form, city: e.target.value })} 
              placeholder="Ex: Nantes, Paris..." 
              className="bg-gray-50 dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-900 dark:text-gray-100 rounded-xl"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="dark:text-gray-300">Bio</Label>
          <Textarea 
            value={form.bio} 
            onChange={(e) => setForm({ ...form, bio: e.target.value })} 
            className="h-24 bg-gray-50 dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-900 dark:text-gray-100 rounded-xl" 
            placeholder="Présentez-vous en quelques mots..." 
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="dark:text-gray-300">Établissement</Label>
            <Input 
              value={form.school} 
              onChange={(e) => setForm({ ...form, school: e.target.value })} 
              placeholder="Ex: CESI, Université..." 
              className="bg-gray-50 dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-900 dark:text-gray-100 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label className="dark:text-gray-300">Niveau d'études</Label>
            <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
              <SelectTrigger className="bg-gray-50 dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-900 dark:text-gray-100 rounded-xl">
                <SelectValue placeholder="Sélectionnez" />
              </SelectTrigger>
              <SelectContent className="dark:bg-[#1e1f20] dark:border-[#333537] dark:text-gray-100">
                {LEVELS.map(l => <SelectItem key={l.value} value={l.value} className="focus:bg-gray-100 dark:focus:bg-[#282a2c] cursor-pointer">{l.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Matières & Niveaux */}
      {/* On remplace bg-indigo-50/50 par une couleur sombre adaptée */}
      <div className="space-y-4 bg-indigo-50/50 dark:bg-[#131314] p-5 rounded-2xl border border-indigo-50 dark:border-[#333537] transition-colors duration-300">
        <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-400">Matières & Niveaux</h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {form.subjects.map(s => (
            <Badge key={s.name} variant="secondary" className="bg-white dark:bg-[#1e1f20] border border-indigo-100 dark:border-indigo-500/20 text-indigo-800 dark:text-indigo-300 px-3 py-1.5 gap-1.5 shadow-sm">
              <span className="font-bold">{s.name}</span> 
              <span className="text-xs opacity-70 border-l border-indigo-200 dark:border-indigo-500/30 pl-1.5">{getLevelLabel(s.level)}</span>
              <button type="button" onClick={() => removeSubject(s.name)} className="ml-1 hover:text-red-500 dark:hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
            </Badge>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-2 relative">
          <div className="relative flex-1">
            <Input 
              className="w-full bg-white dark:bg-[#1e1f20] border-gray-200 dark:border-[#333537] text-gray-900 dark:text-gray-100 rounded-xl" 
              value={newSubjectName} 
              onChange={(e) => {
                setNewSubjectName(e.target.value);
                setShowSuggestions(true);
              }} 
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Ex: Mathématiques, Management..." 
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
              {SUBJECT_LEVELS.map(l => <SelectItem key={l.value} value={l.value} className="focus:bg-gray-100 dark:focus:bg-[#282a2c] cursor-pointer">{l.label}</SelectItem>)}
            </SelectContent>
          </Select>

          <Button type="button" className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl" onClick={() => addSubject(newSubjectName, newSubjectLevel)}>
            <Plus className="w-4 h-4 mr-1" /> Ajouter
          </Button>
        </div>
        
        <div className="pt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Suggestions rapides (ajoutées en "Intermédiaire") :</p>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_SUBJECTS.map(s => (
              <button key={s} type="button" onClick={() => addSubject(s, "intermediaire")}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-white dark:bg-[#1e1f20] border border-gray-200 dark:border-[#333537] text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-[#282a2c] hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors">
                + {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Objectifs */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Objectifs</h3>
        <div className="flex flex-wrap gap-2">
          {(Array.isArray(form.goals) ? form.goals : []).map(g => (
            <Badge key={g} variant="secondary" className="bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-transparent dark:border-purple-500/20 px-3 py-1.5 gap-1.5">
              {g} <button type="button" onClick={() => removeGoal(g)} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input 
            value={newGoal} 
            onChange={(e) => setNewGoal(e.target.value)} 
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addGoal())} 
            placeholder="Ex: Préparer un concours..." 
            className="bg-gray-50 dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-900 dark:text-gray-100 rounded-xl"
          />
          <Button type="button" variant="outline" onClick={addGoal} className="rounded-xl border-gray-200 dark:border-[#333537] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#282a2c]">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Préférences */}
      <div className="space-y-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Préférences</h3>
        <div className="space-y-2">
          <Label className="dark:text-gray-300">Style d'apprentissage</Label>
          <Select value={form.study_style} onValueChange={(v) => setForm({ ...form, study_style: v })}>
            <SelectTrigger className="bg-gray-50 dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-gray-900 dark:text-gray-100 rounded-xl">
              <SelectValue placeholder="Sélectionnez" />
            </SelectTrigger>
            <SelectContent className="dark:bg-[#1e1f20] dark:border-[#333537] dark:text-gray-100">
              {STYLES.map(s => <SelectItem key={s.value} value={s.value} className="focus:bg-gray-100 dark:focus:bg-[#282a2c] cursor-pointer">{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3">
          <Label className="dark:text-gray-300">Disponibilités</Label>
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
                  {slot}
                </button>
              )
            })}
          </div>
        </div>
        
        {/* Switchers avec fonds sombres */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#131314] border border-transparent dark:border-[#333537] rounded-xl transition-colors duration-300">
          <div><p className="text-sm font-medium text-gray-900 dark:text-gray-100">Sessions en ligne</p></div>
          <Switch checked={form.is_online} onCheckedChange={(v) => setForm({ ...form, is_online: v })} />
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#131314] border border-transparent dark:border-[#333537] rounded-xl transition-colors duration-300">
          <div><p className="text-sm font-medium text-gray-900 dark:text-gray-100">Sessions en présentiel</p></div>
          <Switch checked={form.is_in_person} onCheckedChange={(v) => setForm({ ...form, is_in_person: v })} />
        </div>
      </div>

      <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 py-6 rounded-xl text-base font-semibold text-white shadow-sm" disabled={saving}>
        {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
        Enregistrer mon profil
      </Button>
    </form>
  );
}
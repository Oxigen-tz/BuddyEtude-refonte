import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, GraduationCap, Monitor, Users, Send, Check, AlertTriangle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { db } from "@/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/lib/AuthContext";

const LEVEL_LABELS = {
  college: "Collège", lycee: "Lycée", prepa: "Prépa", bts_iut: "BTS/IUT",
  licence: "Licence", master: "Master", doctorat: "Doctorat", autre: "Autre"
};

const SUBJECT_LEVELS = {
  debutant: "💡 Débutant", intermediaire: "🤝 Intermédiaire", avance: "🚀 Avancé"
};

export default function BuddyCard({ profile, onRequest, alreadyRequested, isOwnProfile }) {
  const { user } = useAuth();
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [isReporting, setIsReporting] = useState(false);

  const name = profile.display_name || profile.full_name || "Étudiant";
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const colors = [
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300",
    "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  ];
  const colorIndex = name.length % colors.length;

  const handleSendReport = async () => {
    if (!reportReason) return toast.error("Veuillez choisir un motif");
    setIsReporting(true);
    try {
      await addDoc(collection(db, "reports"), {
        reporter_email: user.email,
        reported_user_email: profile.email,
        reported_user_name: name,
        reason: reportReason,
        details: reportDetails,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      toast.success("Signalement envoyé. Nous allons étudier le profil.");
      setReportDialogOpen(false);
      setReportReason("");
      setReportDetails("");
    } catch (error) {
      toast.error("Erreur lors du signalement");
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <div className="border border-gray-100 dark:border-[#333537] shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group bg-white dark:bg-[#1e1f20]">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14 rounded-xl">
              <AvatarFallback className={`${colors[colorIndex]} rounded-xl text-lg font-bold`}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg truncate">{name}</h3>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                {profile.level && <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" />{LEVEL_LABELS[profile.level]}</span>}
                {profile.city && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{profile.city}</span>}
              </div>
            </div>
          </div>

          {!isOwnProfile && (
            <button 
              onClick={() => setReportDialogOpen(true)}
              className="text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors p-2"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
          )}
        </div>

        {profile.bio && <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 line-clamp-2 h-10">{profile.bio}</p>}

        <div className="mt-4 flex flex-wrap gap-1.5">
          {profile.subjects?.slice(0, 4).map((s, idx) => (
            <Badge key={idx} variant="secondary" className="bg-gray-100 dark:bg-[#282a2c] text-gray-700 dark:text-gray-200 text-[10px] py-1">
              {typeof s === "string" ? s : s.name}
            </Badge>
          ))}
        </div>

        {!isOwnProfile && (
          <div className="mt-5">
            <Button
              className={`w-full rounded-xl font-medium transition-all ${alreadyRequested ? "bg-emerald-50 text-emerald-600 cursor-not-allowed" : "bg-indigo-600 text-white"}`}
              disabled={alreadyRequested}
              onClick={() => onRequest(profile)}
            >
              {alreadyRequested ? <><Check className="w-4 h-4 mr-2" /> Demandé</> : <><Send className="w-4 h-4 mr-2" /> Demander</>}
            </Button>
          </div>
        )}
      </div>

      {/* --- MODALE DE SIGNALEMENT --- */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="dark:bg-[#1e1f20] dark:border-[#333537] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <AlertTriangle className="text-red-500 w-5 h-5" /> Signaler un profil
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Motif du signalement</label>
              <Select value={reportReason} onValueChange={setReportReason}>
                <SelectTrigger className="rounded-xl dark:bg-[#131314]">
                  <SelectValue placeholder="Choisir un motif..." />
                </SelectTrigger>
                <SelectContent className="dark:bg-[#1e1f20]">
                  <SelectItem value="harassment">Harcèlement ou insulte</SelectItem>
                  <SelectItem value="spam">Contenu publicitaire / Spam</SelectItem>
                  <SelectItem value="fake">Faux profil / Usurpation</SelectItem>
                  <SelectItem value="inappropriate">Contenu inapproprié</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Détails (Optionnel)</label>
              <Textarea 
                placeholder="Expliquez-nous brièvement le problème..." 
                className="rounded-xl h-24 dark:bg-[#131314]"
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setReportDialogOpen(false)}>Annuler</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl" onClick={handleSendReport} disabled={isReporting}>
              {isReporting && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Confirmer le signalement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
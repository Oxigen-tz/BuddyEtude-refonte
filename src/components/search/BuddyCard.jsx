import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, GraduationCap, Send, Check, AlertTriangle, Loader2 } from "lucide-react";
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

export default function BuddyCard({ profile, onRequest, alreadyRequested, isOwnProfile }) {
  const { user } = useAuth();
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [isReporting, setIsReporting] = useState(false);

  const name = profile.display_name || profile.full_name || "Étudiant";
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

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
    <div className="group bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#282a2c] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col">

      {/* --- LISERÉ D'ACCENT : rompt l'effet bloc rigide --- */}
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-purple-500" />

      <div className="p-5 flex-1 flex flex-col">

        {/* --- EN-TÊTE --- */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <Avatar className="h-12 w-12 rounded-xl shrink-0 border border-gray-100 dark:border-[#333537]">
              <AvatarFallback className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-bold font-sans">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 dark:text-white text-base truncate font-serif">{name}</h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-500 dark:text-gray-400 font-sans font-medium">
                {profile.level && (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                    {LEVEL_LABELS[profile.level]}
                  </span>
                )}
                {profile.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {profile.city}
                  </span>
                )}
              </div>
            </div>
          </div>

          {!isOwnProfile && (
            <button
              onClick={() => setReportDialogOpen(true)}
              className="text-gray-300 dark:text-gray-600 hover:text-red-500 transition-colors p-1 shrink-0"
              title="Signaler"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* --- BIO : bloc distinct, avec repli si vide --- */}
        <div className="mt-3.5 bg-gray-50 dark:bg-[#131314] rounded-xl p-3.5 border border-transparent dark:border-[#282a2c]">
          {profile.bio ? (
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed font-sans">
              {profile.bio}
            </p>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-600 italic font-sans">
              Cet étudiant n'a pas encore rédigé de présentation.
            </p>
          )}
        </div>

        {/* --- MATIÈRES --- */}
        {profile.subjects?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {profile.subjects.slice(0, 4).map((s, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-transparent dark:border-indigo-500/20 font-medium text-[11px] px-2.5 py-1 rounded-lg"
              >
                {typeof s === "string" ? s : s.name}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* --- ACTION --- */}
      {!isOwnProfile && (
        <div className="px-5 pb-5 pt-1">
          <Button
            size="sm"
            className={`w-full rounded-xl font-medium text-sm py-5 transition-all ${
              alreadyRequested
                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-not-allowed hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white shadow-sm"
            }`}
            disabled={alreadyRequested}
            onClick={() => onRequest(profile)}
          >
            {alreadyRequested ? (
              <><Check className="w-4 h-4 mr-1.5" /> Demande envoyée</>
            ) : (
              <><Send className="w-4 h-4 mr-1.5" /> Contacter</>
            )}
          </Button>
        </div>
      )}

      {/* --- MODALE DE SIGNALEMENT --- */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="rounded-2xl bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] text-gray-900 dark:text-gray-100 p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2 font-serif">
              <AlertTriangle className="text-red-500 w-5 h-5" /> Signaler un profil
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 font-sans">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Motif du signalement</label>
              <Select value={reportReason} onValueChange={setReportReason}>
                <SelectTrigger className="rounded-xl bg-gray-50 dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-xs">
                  <SelectValue placeholder="Choisir un motif..." />
                </SelectTrigger>
                <SelectContent className="dark:bg-[#1e1f20] dark:border-[#333537] dark:text-gray-100 rounded-xl">
                  <SelectItem value="harassment">Harcèlement ou insulte</SelectItem>
                  <SelectItem value="spam">Contenu publicitaire / Spam</SelectItem>
                  <SelectItem value="fake">Faux profil / Usurpation</SelectItem>
                  <SelectItem value="inappropriate">Contenu inapproprié</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Détails (Optionnel)</label>
              <Textarea
                placeholder="Expliquez-nous brièvement le problème..."
                className="rounded-xl h-20 bg-gray-50 dark:bg-[#131314] border-gray-200 dark:border-[#333537] text-xs resize-none p-3"
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setReportDialogOpen(false)} className="rounded-xl text-xs">Annuler</Button>
            <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs" onClick={handleSendReport} disabled={isReporting}>
              {isReporting && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />} Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
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
    <div className="border border-border bg-card shadow-sm hover:border-primary/40 transition-all duration-200 rounded-lg overflow-hidden flex flex-col justify-between">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-11 w-11 rounded-md shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary rounded-md text-sm font-bold font-sans">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h3 className="font-bold text-foreground text-base truncate font-serif">{name}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground font-sans">
                {profile.level && <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" />{LEVEL_LABELS[profile.level]}</span>}
                {profile.city && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{profile.city}</span>}
              </div>
            </div>
          </div>

          {!isOwnProfile && (
            <button 
              onClick={() => setReportDialogOpen(true)}
              className="text-muted-foreground hover:text-destructive transition-colors p-1"
              title="Signaler"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
          )}
        </div>

        {profile.bio && <p className="text-xs text-muted-foreground mt-3 line-clamp-2 leading-relaxed font-sans">{profile.bio}</p>}

        <div className="mt-4 flex flex-wrap gap-1">
          {profile.subjects?.slice(0, 4).map((s, idx) => (
            <Badge key={idx} variant="secondary" className="bg-muted text-muted-foreground font-normal text-[11px] px-2 py-0.5 rounded">
              {typeof s === "string" ? s : s.name}
            </Badge>
          ))}
        </div>
      </div>

      {!isOwnProfile && (
        <div className="px-5 pb-5 pt-0">
          <Button
            size="sm"
            className={`w-full rounded-md font-medium text-xs transition-all ${
              alreadyRequested 
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-not-allowed hover:bg-emerald-500/10" 
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
            disabled={alreadyRequested}
            onClick={() => onRequest(profile)}
          >
            {alreadyRequested ? <><Check className="w-3.5 h-3.5 mr-1.5" /> Demande envoyée</> : <><Send className="w-3.5 h-3.5 mr-1.5" /> Contacter</>}
          </Button>
        </div>
      )}

      {/* --- MODALE DE SIGNALEMENT --- */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="rounded-lg bg-card border border-border text-foreground p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2 font-serif">
              <AlertTriangle className="text-destructive w-5 h-5" /> Signaler un profil
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 font-sans">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Motif du signalement</label>
              <Select value={reportReason} onValueChange={setReportReason}>
                <SelectTrigger className="rounded-md bg-background border-border text-xs">
                  <SelectValue placeholder="Choisir un motif..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-foreground">
                  <SelectItem value="harassment">Harcèlement ou insulte</SelectItem>
                  <SelectItem value="spam">Contenu publicitaire / Spam</SelectItem>
                  <SelectItem value="fake">Faux profil / Usurpation</SelectItem>
                  <SelectItem value="inappropriate">Contenu inapproprié</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Détails (Optionnel)</label>
              <Textarea 
                placeholder="Expliquez-nous brièvement le problème..." 
                className="rounded-md h-20 bg-background border-border text-xs resize-none p-3" 
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setReportDialogOpen(false)} className="rounded-md text-xs">Annuler</Button>
            <Button size="sm" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-md text-xs" onClick={handleSendReport} disabled={isReporting}>
              {isReporting && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />} Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
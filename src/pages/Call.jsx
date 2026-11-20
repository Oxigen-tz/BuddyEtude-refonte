import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ArrowLeft, Link2, Loader2, PenTool, VideoOff, ExternalLink } from "lucide-react";
import { functions } from "../firebase/config";
import { Button } from "@/components/ui/button";

// Appel vidéo intégré (Daily.co). Adresse : /Call?type=pair|group|session&id=…
// La fonction createCallToken vérifie que l'utilisateur fait partie du binôme, du groupe ou de
// la session, puis renvoie l'adresse de la salle privée et un jeton d'accès à son nom.
export default function Call() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const type = params.get("type");
  const id = params.get("id");
  const [state, setState] = useState({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    httpsCallable(functions, "createCallToken")({ type, id })
      .then(({ data }) => { if (!cancelled) setState({ status: "ready", ...data }); })
      .catch((error) => {
        // Refus prévus (accès, service non configuré…) : affichés à l'écran, pas d'erreur en console
        const known = ["not-allowed", "calls-not-configured", "calls-unavailable", "bad-request"].includes(error?.message);
        if (!known) console.error(error);
        if (cancelled) return;
        setState({ status: "error", reason: known ? error.message : "calls-unavailable" });
      });
    return () => { cancelled = true; };
  }, [type, id]);

  // Lien à partager avec le binôme ou le groupe (il ne fonctionne que pour eux : jeton nominatif)
  const inviteUrl = `${window.location.origin}/Call?type=${encodeURIComponent(type || "")}&id=${encodeURIComponent(id || "")}`;
  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      toast.success(t("call.copied"));
    } catch {
      window.prompt(t("call.copyPrompt"), inviteUrl);
    }
  };

  // Tableau blanc du même contexte, ouvert dans un nouvel onglet (l'appel continue ici)
  const boardId = type === "group" ? `grp-${id}` : type === "pair" ? id : null;
  const openBoard = () => {
    if (boardId) window.open(`/Whiteboard?sessionId=${encodeURIComponent(boardId)}`, "_blank", "noopener");
  };

  const roomUrl = state.status === "ready" ? `${state.url}?t=${encodeURIComponent(state.token)}` : null;

  return (
    <div className="flex flex-col h-[calc(100dvh-164px-env(safe-area-inset-bottom,0px))] md:h-[calc(100dvh-196px-env(safe-area-inset-bottom,0px))] lg:h-[calc(100vh-64px)]">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Button variant="ghost" onClick={() => navigate(-1)} className="rounded-xl -ml-2">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> {t("call.back")}
        </Button>
        <h1 className="font-display text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate min-w-0 flex-1">
          {state.title ? t("call.titleWith", { name: state.title }) : t("call.title")}
        </h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={copyInvite} className="rounded-xl">
            <Link2 className="w-4 h-4 mr-1.5" /> {t("call.copyLink")}
          </Button>
          {boardId && (
            <Button variant="outline" size="sm" onClick={openBoard} className="rounded-xl">
              <PenTool className="w-4 h-4 mr-1.5" /> {t("call.openBoard")}
            </Button>
          )}
          {roomUrl && (
            <Button asChild variant="ghost" size="sm" className="rounded-xl">
              <a href={roomUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4 mr-1.5" /> {t("call.newTab")}</a>
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 rounded-2xl overflow-hidden bg-ink-950 border border-gray-200/70 dark:border-ink-700 shadow-soft">
        {state.status === "loading" && (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-white/70">
            <Loader2 className="w-8 h-8 animate-spin text-brand-300" />
            <p className="text-sm">{t("call.loading")}</p>
          </div>
        )}
        {state.status === "error" && (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-center px-6">
            <span className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center"><VideoOff className="w-6 h-6" /></span>
            <p className="font-display text-lg font-bold text-white">{t("call.errorTitle")}</p>
            <p className="text-sm text-white/60 max-w-sm">{t(`call.errors.${state.reason}`)}</p>
          </div>
        )}
        {roomUrl && (
          <iframe
            title={t("call.title")}
            src={roomUrl}
            allow="camera; microphone; fullscreen; speaker; display-capture; autoplay; clipboard-write"
            className="w-full h-full border-0"
          />
        )}
      </div>
      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">{t("call.privacy")}</p>
    </div>
  );
}

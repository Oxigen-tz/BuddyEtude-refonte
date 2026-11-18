import React, { useEffect, useRef, useState } from "react";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Camera, Loader2, ImagePlus, Trash2, ZoomIn, ZoomOut } from "lucide-react";
import { db, storage } from "../../firebase/config";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Photo de profil : choix d'une image, recadrage carré (glisser + zoom), réduction à 512 px
// dans le navigateur, puis envoi dans Storage (avatars/<uid>/) et enregistrement de l'adresse
// dans users/<uid>.photo_url. L'ancienne photo envoyée est supprimée.
const PREVIEW = 256;   // taille de l'aperçu (px)
const OUTPUT = 512;    // taille de l'image enregistrée (px)
const MAX_INPUT = 20 * 1024 * 1024;

// Une photo déjà envoyée par l'utilisateur (et non sa photo Google) ?
export const isUploadedAvatar = (url) => typeof url === "string" && url.includes("avatars%2F");

export default function AvatarEditor({ uid, currentUrl, fallbackUrl, onChange, children }) {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [img, setImg] = useState(null);           // HTMLImageElement
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [busy, setBusy] = useState(false);
  const drag = useRef(null);

  // Taille de l'image dans l'aperçu : elle couvre toujours le carré, puis le zoom s'applique
  const base = img ? PREVIEW / Math.min(img.naturalWidth, img.naturalHeight) : 1;
  const dispW = img ? img.naturalWidth * base * zoom : PREVIEW;
  const dispH = img ? img.naturalHeight * base * zoom : PREVIEW;
  const clamp = (o, w = dispW, h = dispH) => ({
    x: Math.min((w - PREVIEW) / 2, Math.max(-(w - PREVIEW) / 2, o.x)),
    y: Math.min((h - PREVIEW) / 2, Math.max(-(h - PREVIEW) / 2, o.y)),
  });
  useEffect(() => { setOffset((o) => clamp(o)); }, [zoom]); // eslint-disable-line react-hooks/exhaustive-deps

  const pickFile = () => inputRef.current?.click();

  const onFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error(t("profileUi.photo.invalid"));
    if (file.size > MAX_INPUT) return toast.error(t("profileUi.photo.tooBig"));
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => { setImg(image); setZoom(1); setOffset({ x: 0, y: 0 }); setOpen(true); };
    image.onerror = () => { URL.revokeObjectURL(url); toast.error(t("profileUi.photo.invalid")); };
    image.src = url;
  };

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, start: offset };
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    const { x, y, start } = drag.current;
    setOffset(clamp({ x: start.x + e.clientX - x, y: start.y + e.clientY - y }));
  };
  const onPointerUp = () => { drag.current = null; };

  const removeOld = async () => {
    if (isUploadedAvatar(currentUrl)) await deleteObject(ref(storage, currentUrl)).catch(() => {});
  };

  const save = async () => {
    if (!img || !uid) return;
    setBusy(true);
    try {
      // Recadrage : même calcul que l'aperçu, agrandi à OUTPUT
      const k = OUTPUT / PREVIEW;
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = OUTPUT;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, OUTPUT, OUTPUT);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, (PREVIEW / 2 + offset.x - dispW / 2) * k, (PREVIEW / 2 + offset.y - dispH / 2) * k, dispW * k, dispH * k);
      const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.88));
      const fileRef = ref(storage, `avatars/${uid}/${Date.now()}.jpg`);
      await uploadBytes(fileRef, blob, { contentType: "image/jpeg" });
      const url = await getDownloadURL(fileRef);
      await setDoc(doc(db, "users", uid), { photo_url: url, updatedAt: new Date().toISOString() }, { merge: true });
      await removeOld();
      onChange?.(url);
      toast.success(t("profileUi.photo.saved"));
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(t("profileUi.photo.error"));
    } finally {
      setBusy(false);
    }
  };

  // Retirer la photo envoyée : on revient à la photo Google (s'il y en a une) ou à l'initiale
  const remove = async () => {
    setBusy(true);
    try {
      await setDoc(doc(db, "users", uid), { photo_url: fallbackUrl || "", updatedAt: new Date().toISOString() }, { merge: true });
      await removeOld();
      onChange?.(fallbackUrl || "");
      toast.success(t("profileUi.photo.removed"));
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(t("profileUi.photo.error"));
    } finally {
      setBusy(false);
    }
  };

  const openEditor = () => { setImg(null); setOpen(true); };

  return (
    <>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={onFile} />
      <div className="relative group w-fit">
        {children}
        <button type="button" onClick={openEditor} aria-label={t("profileUi.photo.change")} title={t("profileUi.photo.change")}
          className="absolute inset-0 rounded-[1.75rem] flex items-center justify-center bg-ink-950/0 text-white opacity-0 group-hover:opacity-100 group-hover:bg-ink-950/45 focus-visible:opacity-100 focus-visible:bg-ink-950/45 transition-all">
          <Camera className="w-7 h-7" />
        </button>
        {/* Toujours visible (écrans tactiles, pas de survol) */}
        <button type="button" onClick={openEditor} aria-hidden="true" tabIndex={-1}
          className="absolute -bottom-1 -left-1 w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center ring-4 ring-white dark:ring-ink-900 shadow-soft hover:bg-brand-700 transition-colors">
          <Camera className="w-4 h-4" />
        </button>
      </div>

      <Dialog open={open} onOpenChange={(v) => !busy && setOpen(v)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("profileUi.photo.title")}</DialogTitle>
            <DialogDescription>{img ? t("profileUi.photo.cropHint") : t("profileUi.photo.desc")}</DialogDescription>
          </DialogHeader>

          {img ? (
            <div className="flex flex-col items-center gap-5 py-2">
              <div
                className="relative overflow-hidden rounded-[2rem] bg-gray-100 dark:bg-ink-800 cursor-grab active:cursor-grabbing touch-none select-none ring-4 ring-brand-500/20"
                style={{ width: PREVIEW, height: PREVIEW }}
                onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
              >
                <img src={img.src} alt="" draggable={false} className="absolute max-w-none pointer-events-none"
                  style={{ width: dispW, height: dispH, left: PREVIEW / 2 + offset.x - dispW / 2, top: PREVIEW / 2 + offset.y - dispH / 2 }} />
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.25)_1px,transparent_1px)] [background-size:33.33%_33.33%]" />
              </div>
              <div className="flex items-center gap-3 w-full max-w-[280px]">
                <ZoomOut className="w-4 h-4 text-gray-400 shrink-0" />
                <Slider aria-label={t("profileUi.photo.zoom")} min={1} max={3} step={0.01} value={[zoom]} onValueChange={([v]) => setZoom(v)} />
                <ZoomIn className="w-4 h-4 text-gray-400 shrink-0" />
              </div>
            </div>
          ) : (
            <button type="button" onClick={pickFile}
              className="w-full flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-gray-200 dark:border-ink-700 py-10 text-gray-500 dark:text-gray-400 hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-300 hover:bg-brand-50/50 dark:hover:bg-brand-500/5 transition-colors">
              <span className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-300 flex items-center justify-center"><ImagePlus className="w-6 h-6" /></span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{t("profileUi.photo.choose")}</span>
              <span className="text-xs">{t("profileUi.photo.formats")}</span>
            </button>
          )}

          <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-2 pt-2">
            {isUploadedAvatar(currentUrl) && !img && (
              <Button type="button" variant="ghost" disabled={busy} onClick={remove} className="rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 sm:mr-auto">
                <Trash2 className="w-4 h-4 mr-2" /> {fallbackUrl ? t("profileUi.photo.revertGoogle") : t("profileUi.photo.remove")}
              </Button>
            )}
            {img && (
              <>
                <Button type="button" variant="outline" disabled={busy} onClick={pickFile} className="rounded-xl sm:mr-auto">
                  <ImagePlus className="w-4 h-4 mr-2" /> {t("profileUi.photo.other")}
                </Button>
                <Button type="button" disabled={busy} onClick={save} className="rounded-xl">
                  {busy && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} {t("profileUi.photo.save")}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

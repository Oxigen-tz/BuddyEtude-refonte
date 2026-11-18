import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { db, storage } from "../firebase/config";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  doc, getDoc, setDoc, onSnapshot, collection, query, orderBy, addDoc, deleteDoc,
  serverTimestamp, writeBatch, updateDoc,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { HexColorPicker } from "react-colorful";
import { toast } from "sonner";
import { X, Eraser, Pen, Trash2, Download, Circle, Palette, Plus, Undo2, Type, ChevronLeft, ChevronRight, FileUp, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/AuthContext";
import { pairMembers } from "@/lib/pairs";

// Tableau blanc partagé par un binôme (whiteboards/<paire de uids>) ou par un groupe
// (whiteboards/grp-<id du groupe>). Plusieurs pages (champ "page" des traits, pageCount du
// tableau) ; un PDF importé devient une page par page du PDF, en fond (backgrounds).
// Chaque trait est un document de la sous-collection "strokes" (et non plus une image entière
// réécrite à chaque trait) : pas de limite d'1 Mo, pas de conflit quand les deux dessinent en
// même temps, et "Défaire" n'annule que ses propres traits.

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;
const BRUSH_SIZES = [2, 6, 12, 24];
const FONT_SIZES = { 2: 16, 6: 24, 12: 36, 24: 64 };
const MAX_POINTS = 6000;     // coordonnées par trait (x, y à la suite) : voir firestore.rules
const MIN_DISTANCE = 2;      // en dessous, un point n'apporte rien et alourdit le trait
const MAX_PAGES = 200;       // voir firestore.rules
const MAX_PDF_PAGES = 20;    // pages importées par PDF
const MAX_PDF_SIZE = 30 * 1024 * 1024;
const PDF_RENDER_SCALE = 1.5; // fonds rendus en 1800 × 1200 pour rester nets

// "ink" = l'encre par défaut : noire en thème clair, blanche en thème sombre (l'ancien tableau
// enregistrait du noir pur, invisible sur fond sombre)
const INK = "ink";
const PRESET_COLORS = [INK, "#ef4444", "#3b82f6", "#22c55e", "#a855f7"];

export default function Whiteboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();

  const boardId = new URLSearchParams(location.search).get("sessionId");
  const isGroupBoard = /^grp-[A-Za-z0-9]+$/.test(boardId || "");
  const groupId = isGroupBoard ? boardId.slice(4) : null;
  const members = isGroupBoard ? null : pairMembers(boardId);
  // Tableau de groupe : undefined = en chargement, null = pas membre / groupe introuvable
  const [group, setGroup] = useState(undefined);
  useEffect(() => {
    if (!groupId || !user?.uid) return;
    return onSnapshot(doc(db, "groups", groupId),
      (snap) => setGroup(snap.exists() && (snap.data().members || []).includes(user.uid) ? { id: snap.id, ...snap.data() } : null),
      () => setGroup(null));
  }, [groupId, user?.uid]);
  const isValidBoard = isGroupBoard ? Boolean(group) : Boolean(members && user?.uid && members.includes(user.uid));
  const closeTo = isGroupBoard ? `/Groups?id=${groupId}` : "/Messages";

  const canvasRef = useRef(null);
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState(INK);
  const [lineWidth, setLineWidth] = useState(BRUSH_SIZES[1]);
  const [isCustomColorOpen, setIsCustomColorOpen] = useState(false);
  const [textInput, setTextInput] = useState({ visible: false, x: 0, y: 0, text: "" });
  const textInputRef = useRef(null);
  const isFinalizingRef = useRef(false);

  const [strokes, setStrokes] = useState([]);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [backgrounds, setBackgrounds] = useState({});      // { numéro de page: URL de l'image }
  const [importing, setImporting] = useState(null);        // { done, total } pendant un import PDF
  const pdfInputRef = useRef(null);
  const [legacyImage, setLegacyImage] = useState(null);   // ancien format (image entière)
  const drawingRef = useRef(null);                         // trait en cours : { tool, color, width, points }

  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains("dark"));
  useEffect(() => {
    const observer = new MutationObserver(() => setIsDarkMode(document.documentElement.classList.contains("dark")));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const [savedColors, setSavedColors] = useState(() => {
    try { return JSON.parse(localStorage.getItem("buddyetude_saved_colors") || "[]"); } catch { return []; }
  });

  const background = backgrounds[page] || null;
  // Encre blanche en thème sombre, sauf sur un fond (page de PDF, toujours claire)
  const lightInk = isDarkMode && !background;
  const resolveColor = useCallback((c) => (c === INK ? (lightInk ? "#ffffff" : "#09090b") : c), [lightInk]);

  // Pas un de nos binômes / pas membre du groupe : retour
  useEffect(() => {
    if (!user) return;
    if (isGroupBoard ? group === null : !isValidBoard) navigate(isGroupBoard ? "/Groups" : "/Messages", { replace: true });
  }, [user, isGroupBoard, group, isValidBoard, navigate]);

  // --- Lecture : document du tableau (création au premier passage) + traits en temps réel
  useEffect(() => {
    if (!isValidBoard) return;
    const boardRef = doc(db, "whiteboards", boardId);

    getDoc(boardRef).then((snap) => {
      if (!snap.exists()) {
        return setDoc(boardRef, isGroupBoard
          ? { group_id: groupId, pageCount: 1, createdAt: serverTimestamp() }
          : { participants: [...members].sort(), pageCount: 1, createdAt: serverTimestamp() });
      }
    }).catch((error) => {
      console.error("Tableau inaccessible:", error);
      toast.error(t('whiteboard.saveError'));
    });

    const unsubBoard = onSnapshot(boardRef, (snap) => {
      const data = snap.exists() ? snap.data() : {};
      setPageCount(Math.max(1, data.pageCount || 1));
      setBackgrounds(data.backgrounds || {});
      const image = data.image || null;
      if (!image) { setLegacyImage(null); return; }
      const img = new Image();
      img.onload = () => setLegacyImage(img);
      img.src = image;
    }, () => {});

    const unsubStrokes = onSnapshot(
      query(collection(db, "whiteboards", boardId, "strokes"), orderBy("createdAt")),
      (snap) => setStrokes(snap.docs.map((d) => ({ id: d.id, ...d.data({ serverTimestamps: "estimate" }) }))),
      (error) => {
        console.error("Erreur de lecture du tableau:", error);
        toast.error(t('whiteboard.saveError'));
      }
    );
    return () => { unsubBoard(); unsubStrokes(); };
  }, [boardId, isValidBoard, t]);

  // --- Dessin
  const drawStroke = useCallback((ctx, s) => {
    if (s.tool === "text") {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = resolveColor(s.color);
      ctx.font = `600 ${s.fontSize || 24}px Inter, sans-serif`;
      ctx.textBaseline = "top";
      ctx.fillText(s.text || "", s.x, s.y);
      return;
    }
    const pts = s.points || [];
    if (pts.length < 2) return;
    ctx.globalCompositeOperation = s.tool === "eraser" ? "destination-out" : "source-over";
    ctx.strokeStyle = s.tool === "eraser" ? "rgba(0,0,0,1)" : resolveColor(s.color);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.lineWidth = s.tool === "eraser" ? s.width * 4 : s.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (pts.length === 2) {
      // Simple clic : un point
      ctx.beginPath();
      ctx.arc(pts[0], pts[1], ctx.lineWidth / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(pts[0], pts[1]);
      for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
      ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
  }, [resolveColor]);

  const pageStrokes = useMemo(() => strokes.filter((s) => (s.page || 0) === page), [strokes, page]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (legacyImage && page === 0) ctx.drawImage(legacyImage, 0, 0);
    pageStrokes.forEach((s) => drawStroke(ctx, s));
    // Le trait en cours est redessiné par-dessus : un trait du binôme reçu pendant qu'on dessine
    // ne l'efface plus
    if (drawingRef.current) drawStroke(ctx, drawingRef.current);
  }, [pageStrokes, legacyImage, page, drawStroke]);

  useEffect(() => { redraw(); }, [redraw]);

  const getPoint = (e) => {
    const canvas = canvasRef.current;
    const p = e.touches?.[0] || e.changedTouches?.[0] || e;
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.round((p.clientX - rect.left) * (canvas.width / rect.width)),
      y: Math.round((p.clientY - rect.top) * (canvas.height / rect.height)),
    };
  };

  const commitStroke = async (stroke) => {
    try {
      await addDoc(collection(db, "whiteboards", boardId, "strokes"), {
        ...stroke, page, uid: user.uid, createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Erreur de synchronisation du tableau:", error);
      toast.error(t('whiteboard.saveError'));
    }
  };

  const startDrawing = (e) => {
    if (tool === "text") {
      if (textInput.visible) { finalizeText(); return; }
      const { x, y } = getPoint(e);
      setTextInput({ visible: true, x, y, text: "" });
      setTimeout(() => textInputRef.current?.focus(), 50);
      return;
    }
    const { x, y } = getPoint(e);
    drawingRef.current = { tool, color, width: lineWidth, points: [x, y] };
    redraw();
  };

  const draw = (e) => {
    const current = drawingRef.current;
    if (!current) return;
    const { x, y } = getPoint(e);
    const pts = current.points;
    const lx = pts[pts.length - 2], ly = pts[pts.length - 1];
    if (Math.hypot(x - lx, y - ly) < MIN_DISTANCE) return;
    pts.push(x, y);
    // Dessin incrémental (le dernier segment) pour rester fluide
    const ctx = canvasRef.current.getContext("2d");
    drawStroke(ctx, { ...current, points: [lx, ly, x, y] });
    // Trait très long : on l'enregistre et on en commence un nouveau (taille max d'un document)
    if (pts.length >= MAX_POINTS) {
      commitStroke({ ...current, points: [...pts] });
      drawingRef.current = { ...current, points: [x, y] };
    }
  };

  const stopDrawing = () => {
    const current = drawingRef.current;
    if (!current) return;
    drawingRef.current = null;
    commitStroke({ ...current, points: [...current.points] });
  };

  const finalizeText = async () => {
    if (!textInput.visible || isFinalizingRef.current) return;
    isFinalizingRef.current = true;
    try {
      const text = textInput.text.trim();
      if (text) {
        await commitStroke({ tool: "text", color, text: text.slice(0, 300), x: textInput.x, y: textInput.y, fontSize: FONT_SIZES[lineWidth] || 24 });
      }
    } finally {
      setTextInput({ visible: false, x: 0, y: 0, text: "" });
      isFinalizingRef.current = false;
    }
  };

  // Défaire : supprime MON dernier trait (celui du binôme n'est pas concerné)
  const canUndo = pageStrokes.some((s) => s.uid === user?.uid);
  const undoLastStroke = useCallback(async () => {
    const last = [...pageStrokes].reverse().find((s) => s.uid === user?.uid);
    if (!last) return;
    try {
      await deleteDoc(doc(db, "whiteboards", boardId, "strokes", last.id));
    } catch (error) {
      console.error(error);
      toast.error(t('whiteboard.saveError'));
    }
  }, [pageStrokes, user?.uid, boardId, t]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        const tag = e.target?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        undoLastStroke();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undoLastStroke]);

  const clearBoard = async () => {
    if (!window.confirm(t(pageCount > 1 ? 'whiteboard.clearPageConfirm' : 'whiteboard.clearConfirm'))) return;
    try {
      for (let i = 0; i < pageStrokes.length; i += 450) {
        const batch = writeBatch(db);
        pageStrokes.slice(i, i + 450).forEach((s) => batch.delete(doc(db, "whiteboards", boardId, "strokes", s.id)));
        await batch.commit();
      }
      if (legacyImage && page === 0) await setDoc(doc(db, "whiteboards", boardId), { image: null }, { merge: true });
    } catch (error) {
      console.error("Erreur lors de l'effacement du tableau:", error);
      toast.error(t('whiteboard.saveError'));
    }
  };

  const downloadBoard = async () => {
    const canvas = canvasRef.current;
    const temp = document.createElement("canvas");
    temp.width = canvas.width;
    temp.height = canvas.height;
    const ctx = temp.getContext("2d");
    ctx.fillStyle = lightInk ? "#1e1f20" : "#ffffff";
    ctx.fillRect(0, 0, temp.width, temp.height);
    if (background) {
      // Le fond n'est exportable que si le stockage autorise la lecture depuis le site (CORS)
      const img = await new Promise((resolve) => {
        const i = new Image();
        i.crossOrigin = "anonymous";
        i.onload = () => resolve(i);
        i.onerror = () => resolve(null);
        i.src = background;
      });
      if (img) ctx.drawImage(img, 0, 0, temp.width, temp.height);
      else toast.info(t('whiteboard.exportNoBackground'));
    }
    ctx.drawImage(canvas, 0, 0);
    const link = document.createElement("a");
    link.download = `BuddyEtude_Tableau_p${page + 1}_${new Date().toLocaleDateString().replace(/\//g, "-")}.png`;
    try {
      link.href = temp.toDataURL("image/png");
    } catch {
      toast.error(t('whiteboard.saveError'));
      return;
    }
    link.click();
  };

  // --- Pages
  const goToPage = (n) => {
    if (n < 0 || n >= pageCount) return;
    drawingRef.current = null;
    setTextInput({ visible: false, x: 0, y: 0, text: "" });
    setPage(n);
  };
  const addPage = async () => {
    if (pageCount >= MAX_PAGES) return;
    try {
      await updateDoc(doc(db, "whiteboards", boardId), { pageCount: pageCount + 1 });
      setPage(pageCount);
    } catch (error) {
      console.error(error);
      toast.error(t('whiteboard.saveError'));
    }
  };

  // --- Import d'un PDF : chaque page devient une page du tableau, avec le PDF en fond
  const importPdf = async (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") { toast.error(t('whiteboard.pdf.notPdf')); return; }
    if (file.size > MAX_PDF_SIZE) { toast.error(t('whiteboard.pdf.tooBig')); return; }
    try {
      setImporting({ done: 0, total: 0 });
      const [pdfjs, worker] = await Promise.all([
        import("pdfjs-dist"),
        import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
      ]);
      pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
      const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
      // Tableau encore vierge : le PDF commence à la page 1, sinon il s'ajoute à la fin
      const isBlank = pageCount === 1 && strokes.length === 0 && !backgrounds[0] && !legacyImage;
      const start = isBlank ? 0 : pageCount;
      const total = Math.min(pdf.numPages, MAX_PDF_PAGES, MAX_PAGES - start);
      setImporting({ done: 0, total });

      const width = CANVAS_WIDTH * PDF_RENDER_SCALE;
      const height = CANVAS_HEIGHT * PDF_RENDER_SCALE;
      const urls = {};
      for (let i = 1; i <= total; i++) {
        const pdfPage = await pdf.getPage(i);
        const base = pdfPage.getViewport({ scale: 1 });
        const scale = Math.min(width / base.width, height / base.height);
        const viewport = pdfPage.getViewport({ scale });
        const out = document.createElement("canvas");
        out.width = width;
        out.height = height;
        const ctx = out.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.translate((width - viewport.width) / 2, (height - viewport.height) / 2);
        await pdfPage.render({ canvasContext: ctx, viewport }).promise;
        const blob = await new Promise((resolve) => out.toBlob(resolve, "image/jpeg", 0.85));
        const fileRef = storageRef(storage, `chat_files/${user.uid}/wb_${Date.now()}_${i}.jpg`);
        await uploadBytes(fileRef, blob, { contentType: "image/jpeg" });
        urls[start + i - 1] = await getDownloadURL(fileRef);
        setImporting({ done: i, total });
      }
      await setDoc(doc(db, "whiteboards", boardId), {
        pageCount: Math.max(pageCount, start + total),
        backgrounds: urls,
      }, { merge: true });
      setPage(start);
      toast.success(t(pdf.numPages > total ? 'whiteboard.pdf.truncated' : 'whiteboard.pdf.done', { count: total }));
    } catch (error) {
      console.error("Import PDF :", error);
      toast.error(t('whiteboard.pdf.error'));
    } finally {
      setImporting(null);
      if (pdfInputRef.current) pdfInputRef.current.value = "";
    }
  };

  const handleSaveColor = () => {
    if (color === INK || savedColors.includes(color) || PRESET_COLORS.includes(color)) return;
    const next = [color, ...savedColors].slice(0, 8);
    setSavedColors(next);
    try { localStorage.setItem("buddyetude_saved_colors", JSON.stringify(next)); } catch { /* stockage indisponible */ }
  };

  if (!isValidBoard) return null;

  // Portail vers <body> : rendu dans le <main> de Layout (qui crée son propre contexte
  // d'empilement), le tableau passait sous l'en-tête mobile malgré son z-index.
  return createPortal(
    <div className="fixed inset-0 bg-slate-50 dark:bg-[#131314] z-[9999] flex flex-col transition-colors duration-300"
         style={{ backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)", backgroundSize: "24px 24px" }}>

      {/* EN-TÊTE */}
      <div className="bg-white/80 dark:bg-[#1e1f20]/90 backdrop-blur-md border-b border-gray-200 dark:border-[#333537] px-3 sm:px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(closeTo)} aria-label={t('whiteboard.closeBoard')} className="hover:bg-gray-100 dark:hover:bg-[#282a2c] text-gray-700 dark:text-gray-300 rounded-xl">
            <X className="w-5 h-5 sm:mr-2" /> <span className="hidden sm:inline">{t('whiteboard.closeBoard')}</span>
          </Button>
          <div className="h-6 w-px bg-gray-300 dark:bg-[#333537] hidden md:block"></div>
          <h2 className="font-bold text-gray-800 dark:text-gray-100 hidden md:block truncate max-w-[16rem]">{group?.name || t('whiteboard.title')}</h2>
        </div>

        {/* Pages */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => goToPage(page - 1)} disabled={page === 0} aria-label={t('whiteboard.prevPage')} className="rounded-xl h-9 w-9">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium tabular-nums text-gray-700 dark:text-gray-300 min-w-[3.5rem] text-center" aria-live="polite">
            {t('whiteboard.pageOf', { page: page + 1, count: pageCount })}
          </span>
          <Button variant="ghost" size="icon" onClick={() => goToPage(page + 1)} disabled={page >= pageCount - 1} aria-label={t('whiteboard.nextPage')} className="rounded-xl h-9 w-9">
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={addPage} disabled={pageCount >= MAX_PAGES} aria-label={t('whiteboard.addPage')} title={t('whiteboard.addPage')} className="rounded-xl h-9 w-9">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <input ref={pdfInputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => importPdf(e.target.files?.[0])} />
          <Button onClick={() => pdfInputRef.current?.click()} disabled={Boolean(importing)} variant="outline" aria-label={t('whiteboard.pdf.import')} title={t('whiteboard.pdf.import')}
            className="border-gray-200 dark:border-[#333537] text-gray-700 dark:text-gray-300 rounded-xl">
            {importing ? <Loader2 className="w-4 h-4 sm:mr-2 animate-spin" /> : <FileUp className="w-4 h-4 sm:mr-2" />}
            <span className="hidden sm:inline">{importing ? t('whiteboard.pdf.progress', { done: importing.done, total: importing.total || "…" }) : t('whiteboard.pdf.import')}</span>
          </Button>
          <Button onClick={undoLastStroke} disabled={!canUndo} variant="outline" aria-label={t('whiteboard.undo')} title={t('whiteboard.undoTitle')}
            className="border-gray-200 dark:border-[#333537] text-gray-700 dark:text-gray-300 rounded-xl disabled:opacity-40">
            <Undo2 className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">{t('whiteboard.undo')}</span>
          </Button>
          <Button onClick={downloadBoard} variant="outline" aria-label={t('whiteboard.export')}
            className="border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-xl">
            <Download className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">{t('whiteboard.export')}</span>
          </Button>
        </div>
      </div>

      {/* ZONE DE DESSIN */}
      <div className="flex-1 overflow-auto flex justify-center items-center p-4 md:p-8 relative">
        <div className={`relative shadow-2xl rounded-xl ring-1 ring-gray-200 dark:ring-[#333537] overflow-hidden ${background ? "bg-white" : "bg-white dark:bg-[#1e1f20]"}`}>
          {/* Fond de la page (PDF importé), sous le dessin : la gomme ne l'efface pas */}
          {background && <img src={background} alt="" draggable={false} className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none" />}
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={(e) => { e.preventDefault(); startDrawing(e); }}
            onTouchMove={(e) => { e.preventDefault(); draw(e); }}
            onTouchEnd={(e) => { e.preventDefault(); stopDrawing(); }}
            onTouchCancel={(e) => { e.preventDefault(); stopDrawing(); }}
            style={{ width: "100%", maxWidth: `${CANVAS_WIDTH}px`, aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`, touchAction: "none" }}
            className={`relative ${tool === "text" ? "cursor-text" : "cursor-crosshair"}`}
          />

          {textInput.visible && (
            <input
              ref={textInputRef}
              type="text"
              value={textInput.text}
              maxLength={300}
              onChange={(e) => setTextInput({ ...textInput, text: e.target.value })}
              onBlur={finalizeText}
              onKeyDown={(e) => { if (e.key === "Enter") finalizeText(); }}
              placeholder={t('whiteboard.textPlaceholder')}
              aria-label={t('whiteboard.tools.text')}
              style={{
                position: "absolute",
                left: `${(textInput.x / CANVAS_WIDTH) * 100}%`,
                top: `${(textInput.y / CANVAS_HEIGHT) * 100}%`,
                color: resolveColor(color),
                fontSize: "1.2rem",
                fontWeight: "600",
                background: "transparent",
                border: "1px dashed #6366f1",
                borderRadius: "4px",
                outline: "none",
                minWidth: "150px",
                padding: "2px 4px",
                zIndex: 50,
              }}
            />
          )}
        </div>

        {isCustomColorOpen && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-[#1e1f20]/95 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-gray-100 dark:border-[#333537] z-50 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 min-w-[250px]">
            <div className="flex items-center justify-between gap-2 px-1">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t('whiteboard.customColor')}</span>
              <button onClick={() => setIsCustomColorOpen(false)} aria-label={t('whiteboard.closePicker')} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="custom-picker">
              <HexColorPicker color={resolveColor(color)} onChange={(c) => { setColor(c); if (tool === "eraser") setTool("pen"); }} />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 flex items-center gap-2 bg-gray-50 dark:bg-[#131314] border border-gray-200 dark:border-[#333537] p-1.5 rounded-xl">
                <div className="w-6 h-6 rounded-md shadow-inner border border-gray-200 dark:border-[#333537]" style={{ backgroundColor: resolveColor(color) }} />
                <input type="text" value={resolveColor(color)} onChange={(e) => setColor(e.target.value)} aria-label={t('whiteboard.customColor')}
                  className="w-full bg-transparent text-sm font-mono uppercase text-gray-800 dark:text-gray-200 focus:outline-none" />
              </div>
              <Button onClick={handleSaveColor} variant="outline" aria-label={t('whiteboard.saveColor')} title={t('whiteboard.saveColor')}
                className="rounded-xl px-3 border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {savedColors.length > 0 && (
              <div className="flex flex-wrap gap-1.5 px-1">
                {savedColors.map((c) => (
                  <button key={c} type="button" onClick={() => { setColor(c); if (tool === "eraser") setTool("pen"); }} aria-label={c}
                    className="w-6 h-6 rounded-full border border-gray-200 dark:border-[#333537] hover:scale-110 transition-transform" style={{ backgroundColor: c }} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* BARRE D'OUTILS FLOTTANTE */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-[#1e1f20]/95 backdrop-blur-xl shadow-2xl border border-gray-200 dark:border-[#333537] p-2 md:p-3 rounded-2xl flex items-center gap-2 sm:gap-3 md:gap-5 max-w-[calc(100vw-1.5rem)] overflow-x-auto">
        <div className="flex items-center gap-1 bg-gray-100/50 dark:bg-[#131314]/50 p-1 rounded-xl shrink-0">
          {[["pen", Pen], ["text", Type], ["eraser", Eraser]].map(([name, Icon]) => (
            <button key={name} onClick={() => { setTool(name); setIsCustomColorOpen(false); }} aria-label={t(`whiteboard.tools.${name}`)} title={t(`whiteboard.tools.${name}`)} aria-pressed={tool === name}
              className={`p-2.5 md:p-3 rounded-lg transition-all ${tool === name ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-md" : "text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-[#282a2c]"}`}>
              <Icon className="w-5 h-5" />
            </button>
          ))}
        </div>

        <div className="w-px h-8 bg-gray-200 dark:bg-[#333537] shrink-0"></div>

        <div className={`flex items-center gap-1.5 shrink-0 transition-opacity ${tool === "eraser" ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
          {PRESET_COLORS.map((c) => (
            <button key={c} aria-label={t('whiteboard.colorLabel', { color: c === INK ? t('whiteboard.ink') : c })} title={c === INK ? t('whiteboard.ink') : c}
              onClick={() => { setColor(c); if (tool === "eraser") setTool("pen"); setIsCustomColorOpen(false); }}
              className={`w-7 h-7 md:w-8 md:h-8 rounded-full border-2 transition-all ${color === c && !isCustomColorOpen ? "border-indigo-500 scale-110 shadow-lg" : "border-transparent hover:scale-110 shadow-sm"}`}
              style={{ backgroundColor: resolveColor(c), boxShadow: c === INK ? "inset 0 0 0 1px rgba(127,127,127,.5)" : undefined }} />
          ))}
          <button onClick={() => setIsCustomColorOpen(!isCustomColorOpen)} aria-label={t('whiteboard.customColor')} title={t('whiteboard.customColor')}
            className={`w-7 h-7 md:w-8 md:h-8 rounded-full border-2 transition-all flex items-center justify-center bg-gradient-to-tr from-pink-400 via-purple-400 to-indigo-400 ${isCustomColorOpen ? "border-gray-900 dark:border-white scale-110 shadow-lg" : "border-transparent hover:scale-110 shadow-sm"}`}>
            <Palette className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="w-px h-8 bg-gray-200 dark:bg-[#333537] shrink-0 hidden md:block"></div>

        <div className="flex items-center gap-1 shrink-0">
          {BRUSH_SIZES.map((size, index) => (
            <button key={size} aria-label={t('whiteboard.brushSize', { size })} title={t('whiteboard.brushSize', { size })} aria-pressed={lineWidth === size} onClick={() => setLineWidth(size)}
              className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-xl transition-all ${lineWidth === size ? "bg-gray-100 dark:bg-[#282a2c] shadow-inner" : "hover:bg-gray-50 dark:hover:bg-[#131314]"}`}>
              <Circle className="fill-gray-700 dark:fill-gray-300 text-gray-700 dark:text-gray-300" style={{ width: 4 + index * 4, height: 4 + index * 4 }} />
            </button>
          ))}
        </div>

        <div className="w-px h-8 bg-gray-200 dark:bg-[#333537] shrink-0"></div>

        <button onClick={clearBoard} aria-label={t('whiteboard.tools.clearAll')} title={t('whiteboard.tools.clearAll')} className="p-2.5 md:p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl shrink-0">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <style>{`
        .custom-picker .react-colorful { width: 100%; height: 160px; border-radius: 12px; }
        .custom-picker .react-colorful__saturation { border-radius: 12px 12px 0 0; border-bottom: none; }
        .custom-picker .react-colorful__hue { height: 16px; border-radius: 0 0 12px 12px; margin-top: -1px; }
        .custom-picker .react-colorful__handle { width: 20px; height: 20px; border: 3px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.2); }
      `}</style>
    </div>,
    document.body
  );
}

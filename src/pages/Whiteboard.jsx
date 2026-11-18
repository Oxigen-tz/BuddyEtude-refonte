import React, { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { HexColorPicker } from "react-colorful";
import { toast } from "sonner";
import { 
  X, Eraser, Pen, Trash2, Download, Circle, Palette, Plus, Undo2, Type
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/AuthContext";

// Le tableau d'un binôme a pour id "<email1>_<email2>" (emails triés, comme le chatId de Messages).
// On retrouve les deux participants à partir de notre propre email, sans découper sur "_" :
// une adresse comme "jean_dupont@…" aurait été coupée en deux.
// Renvoie null si l'id ne correspond pas à un binôme dont on fait partie.
const getBoardParticipants = (boardId, myEmail) => {
  if (!boardId || !myEmail) return null;
  let other = null;
  if (boardId.startsWith(`${myEmail}_`)) other = boardId.slice(myEmail.length + 1);
  else if (boardId.endsWith(`_${myEmail}`)) other = boardId.slice(0, -(myEmail.length + 1));
  if (!other) return null;
  const pair = [myEmail, other].sort();
  return pair.join("_") === boardId ? pair : null;
};

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;
const BRUSH_SIZES = [2, 6, 12, 24];
const FONT_SIZES = { 2: "16px", 6: "24px", 12: "36px", 24: "64px" };
const MAX_HISTORY = 25;

// Un document Firestore ne peut pas dépasser 1 Mio. Le tableau est stocké comme une image
// encodée en base64 : au-delà de cette taille, l'écriture échouait sans aucun message.
const MAX_IMAGE_LENGTH = 950000;

// WebP sans perte (qualité 1) : 1,6 à 2,2 fois plus léger que le PNG pour un même tableau
// (mesuré sous Chrome), donc environ deux fois plus de dessin avant la limite d'1 Mio.
// Pas de WebP avec perte : le tableau étant ré-encodé à chaque trait, la qualité se dégraderait.
// Les navigateurs qui ne savent pas encoder en WebP renvoient du PNG : on le détecte.
const encodeCanvas = (canvas) => {
  const webp = canvas.toDataURL("image/webp", 1);
  return webp.startsWith("data:image/webp") ? webp : canvas.toDataURL("image/png");
};

export default function Whiteboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryParams = new URLSearchParams(location.search);
  // 🛠️ CORRIGÉ : plus de repli sur "demo-board". Sans sessionId, tous les utilisateurs se
  // retrouvaient à dessiner sur le même tableau public.
  const sessionId = queryParams.get("sessionId");
  const { user } = useAuth();
  // Écrit dans chaque sauvegarde : les règles Firestore s'en servent pour n'autoriser que le binôme
  const participants = getBoardParticipants(sessionId, user?.email);
  const isValidBoard = participants !== null;

  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const [lineWidth, setLineWidth] = useState(BRUSH_SIZES[1]);
  const [tool, setTool] = useState("pen");
  const [isCustomColorOpen, setIsCustomColorOpen] = useState(false);

  const [textInput, setTextInput] = useState({ visible: false, x: 0, y: 0, text: "" });
  const textInputRef = useRef(null);

  const historyRef = useRef([]);
  const [canUndo, setCanUndo] = useState(false);
  const isRestoringRef = useRef(false);

  // Identifiant propre à cet onglet : permet de reconnaître l'écho de nos propres sauvegardes
  const clientIdRef = useRef(`${Date.now()}-${Math.random().toString(36).slice(2)}`);
  // Dernière image reçue du binôme pendant qu'on dessinait (à fusionner à la fin du trait)
  const pendingRemoteRef = useRef(null);

  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains("dark"));

  // Pas d'id, ou un id qui n'est pas celui d'un de nos binômes : retour à la messagerie
  useEffect(() => {
    if (!isValidBoard) navigate("/Messages", { replace: true });
  }, [isValidBoard, navigate]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const PRESET_COLORS = [
    isDarkMode ? "#ffffff" : "#09090b",
    "#ef4444", "#3b82f6", "#22c55e", "#a855f7"
  ];

  const [color, setColor] = useState(PRESET_COLORS[0]);

  useEffect(() => {
    if (color === "#ffffff" && !isDarkMode) setColor("#09090b");
    else if (color === "#09090b" && isDarkMode) setColor("#ffffff");
  }, [isDarkMode]);

  const [savedColors, setSavedColors] = useState(() => {
    try {
      const saved = localStorage.getItem("buddyetude_saved_colors");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // --- ÉCRITURE ---
  // Une seule écriture à la fois : Firestore n'accepte qu'environ 1 écriture/seconde sur un même
  // document. Les traits terminés pendant une sauvegarde sont regroupés dans la suivante.
  const saveInFlightRef = useRef(false);
  const saveAgainRef = useRef(false);

  const writeBoard = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !isValidBoard) return false;

    const imageBase64 = encodeCanvas(canvas);
    if (imageBase64.length > MAX_IMAGE_LENGTH) {
      toast.error(t('whiteboard.tooLarge'));
      return false;
    }

    try {
      await setDoc(
        doc(db, "whiteboards", sessionId),
        { image: imageBase64, participants, updatedAt: new Date().toISOString(), clientId: clientIdRef.current },
        { merge: true }
      );
      return true;
    } catch (error) {
      console.error("Erreur de synchronisation du tableau:", error);
      toast.error(t('whiteboard.saveError'));
      return false;
    }
    // participants est dérivé de sessionId et de l'email : il change en même temps qu'eux
  }, [sessionId, isValidBoard, user?.email, t]);

  const saveToFirestore = useCallback(async () => {
    if (saveInFlightRef.current) {
      saveAgainRef.current = true;
      return true;
    }
    saveInFlightRef.current = true;
    try {
      let ok;
      do {
        saveAgainRef.current = false;
        ok = await writeBoard();
      } while (ok && saveAgainRef.current);
      return ok;
    } finally {
      saveInFlightRef.current = false;
    }
  }, [writeBoard]);

  // --- LECTURE ---
  const applyRemoteImage = useCallback((image) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Les points d'annulation locaux ne correspondent plus au tableau : les garder permettrait
    // à un "Défaire" d'effacer le travail du binôme.
    historyRef.current = [];
    setCanUndo(false);

    if (!image) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const img = new Image();
    img.onload = () => {
      // Un trait a commencé pendant le chargement de l'image : on la garde pour la fusion
      if (isDrawingRef.current) {
        pendingRemoteRef.current = { image };
        return;
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = image;
  }, []);

  // Le listener ne dépend que de sessionId : on ne se réabonne pas à chaque trait.
  useEffect(() => {
    if (!isValidBoard) return;
    const docRef = doc(db, "whiteboards", sessionId);
    const unsub = onSnapshot(
      docRef,
      (docSnap) => {
        if (!docSnap.exists() || !canvasRef.current) return;
        // Écriture locale pas encore confirmée par le serveur : ce n'est pas le binôme
        if (docSnap.metadata.hasPendingWrites) return;

        const data = docSnap.data();
        // Écho de notre propre sauvegarde : on ne redessine pas
        if (data.clientId === clientIdRef.current) return;

        if (isDrawingRef.current) {
          // On dessine : on garde l'image du binôme pour la fusionner à la fin du trait
          pendingRemoteRef.current = { image: data.image || null };
          return;
        }
        if (isRestoringRef.current) return;

        applyRemoteImage(data.image || null);
      },
      (error) => {
        console.error("Erreur de lecture du tableau:", error);
        toast.error(t('whiteboard.saveError'));
      }
    );
    return () => unsub();
  }, [sessionId, isValidBoard, applyRemoteImage, t]);

  // Fusionne l'image reçue du binôme PAR-DESSOUS notre tableau, pour que nos nouveaux traits ne
  // l'écrasent pas à la sauvegarde. Limite : une gomme appliquée pendant ce temps par l'autre
  // personne peut être annulée.
  const mergePendingRemote = () => new Promise((resolve) => {
    const pending = pendingRemoteRef.current;
    pendingRemoteRef.current = null;
    if (!pending?.image) return resolve();

    const img = new Image();
    img.onload = () => {
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        ctx.globalCompositeOperation = "destination-over";
        ctx.drawImage(img, 0, 0);
        ctx.globalCompositeOperation = "source-over";
      }
      resolve();
    };
    img.onerror = () => resolve();
    img.src = pending.image;
  });

  // Extrait le point (x,y) qu'il vienne d'un événement souris OU tactile
  const getEventPoint = (e) => {
    if (e.touches && e.touches.length > 0) return e.touches[0];
    if (e.changedTouches && e.changedTouches.length > 0) return e.changedTouches[0];
    return e;
  };

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const point = getEventPoint(e);
    const rect = canvas.getBoundingClientRect(); 
    const x = point.clientX - rect.left;
    const y = point.clientY - rect.top;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: x * scaleX, y: y * scaleY };
  };

  const pushHistory = () => {
    if (isRestoringRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const snapshot = canvas.toDataURL("image/png");
    historyRef.current.push(snapshot);
    if (historyRef.current.length > MAX_HISTORY) {
      historyRef.current.shift();
    }
    setCanUndo(historyRef.current.length > 0);
  };

  // Un clic sur le canvas pendant la saisie déclenche finalizeText deux fois (mousedown puis
  // blur du champ), et "Entrée" est suivi d'un blur : sans ce verrou le texte était dessiné
  // et sauvegardé deux fois.
  const isFinalizingRef = useRef(false);

  const finalizeText = async () => {
    if (!textInput.visible || isFinalizingRef.current) return;
    isFinalizingRef.current = true;
    try {
      await commitText();
    } finally {
      setTextInput({ visible: false, x: 0, y: 0, text: "" });
      isFinalizingRef.current = false;
    }
  };

  const commitText = async () => {
    if (textInput.text.trim()) {
      pushHistory();
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      ctx.globalCompositeOperation = "source-over";
      ctx.font = `600 ${FONT_SIZES[lineWidth] || "24px"} Inter, sans-serif`;
      ctx.fillStyle = color;
      ctx.textBaseline = "top";
      ctx.fillText(textInput.text, textInput.x, textInput.y);
      
      await saveToFirestore();
    }
  };

  const startDrawing = (e) => {
    if (tool === "text") {
      if (textInput.visible) {
        finalizeText();
      } else {
        const { x, y } = getCanvasCoordinates(e);
        setTextInput({ visible: true, x, y, text: "" });
        setTimeout(() => textInputRef.current?.focus(), 50);
      }
      return;
    }

    pushHistory();
    const { x, y } = getCanvasCoordinates(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);
    isDrawingRef.current = true;
  };

  const draw = (e) => {
    if (!isDrawingRef.current || tool === "text") return;
    const { x, y } = getCanvasCoordinates(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(x, y);
    
    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = lineWidth * 4;
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }
    
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const stopDrawing = async () => {
    // Le ref évite le double appel mouseup + mouseout qui sauvegardait deux fois
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    
    const ctx = canvasRef.current.getContext("2d");
    ctx.globalCompositeOperation = "source-over";

    await mergePendingRemote();
    await saveToFirestore();
  };

  const undoLastStroke = useCallback(async () => {
    if (historyRef.current.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const lastSnapshot = historyRef.current.pop();
    setCanUndo(historyRef.current.length > 0);

    isRestoringRef.current = true;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (lastSnapshot) {
      const img = new Image();
      img.onload = async () => {
        ctx.drawImage(img, 0, 0);
        isRestoringRef.current = false;
        await saveToFirestore();
      };
      img.src = lastSnapshot;
    } else {
      isRestoringRef.current = false;
      await saveToFirestore();
    }
  }, [saveToFirestore]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        // Dans le champ de texte du tableau, on laisse l'annulation native du navigateur
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
    if(!window.confirm(t('whiteboard.clearConfirm'))) return;
    pushHistory(); 
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    try {
      await setDoc(
        doc(db, "whiteboards", sessionId),
        { image: null, participants, updatedAt: new Date().toISOString(), clientId: clientIdRef.current },
        { merge: true }
      );
    } catch (error) {
      console.error("Erreur lors de l'effacement du tableau:", error);
      toast.error(t('whiteboard.saveError'));
    }
  };

  const downloadBoard = () => {
    const canvas = canvasRef.current;
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const ctx = tempCanvas.getContext("2d");

    ctx.fillStyle = isDarkMode ? "#1e1f20" : "#ffffff";
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    ctx.drawImage(canvas, 0, 0);

    const link = document.createElement("a");
    link.download = `BuddyEtude_Session_${new Date().toLocaleDateString().replace(/\//g, '-')}.png`;
    link.href = tempCanvas.toDataURL("image/png");
    link.click();
  };

  const handleSaveColor = () => {
    if (!savedColors.includes(color) && !PRESET_COLORS.includes(color)) {
      const newColors = [color, ...savedColors].slice(0, 8);
      setSavedColors(newColors);
      try {
        localStorage.setItem("buddyetude_saved_colors", JSON.stringify(newColors));
      } catch {
        // Stockage indisponible : la couleur reste disponible jusqu'à la fermeture de la page
      }
    }
  };

  const handleBack = () => {
    navigate("/Messages");
  };

  if (!isValidBoard) return null;

  // Portail vers <body> : rendu dans le <main> de Layout (qui crée son propre contexte
  // d'empilement), le tableau passait SOUS l'en-tête mobile malgré son z-index, ce qui cachait
  // les boutons Fermer / Défaire / Exporter sur téléphone.
  return createPortal(
    <div className="fixed inset-0 bg-slate-50 dark:bg-[#131314] z-[9999] flex flex-col transition-colors duration-300"
         style={{ backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
      
      {/* EN TÊTE */}
      <div className="bg-white/80 dark:bg-[#1e1f20]/90 backdrop-blur-md border-b border-gray-200 dark:border-[#333537] px-3 sm:px-6 py-3 flex items-center justify-between shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack} aria-label={t('whiteboard.closeBoard')} className="hover:bg-gray-100 dark:hover:bg-[#282a2c] text-gray-700 dark:text-gray-300 rounded-xl">
            <X className="w-5 h-5 sm:mr-2" /> <span className="hidden sm:inline">{t('whiteboard.closeBoard')}</span>
          </Button>
          <div className="h-6 w-px bg-gray-300 dark:bg-[#333537] hidden md:block"></div>
          {/* Un seul nom, que le thème soit clair ou sombre */}
          <h2 className="font-bold text-gray-800 dark:text-gray-100 hidden md:block">
            {t('whiteboard.title')}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={undoLastStroke} 
            disabled={!canUndo}
            variant="outline" 
            className="border-gray-200 dark:border-[#333537] text-gray-700 dark:text-gray-300 rounded-xl disabled:opacity-40"
            title={t('whiteboard.undoTitle')}
          >
            <Undo2 className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">{t('whiteboard.undo')}</span>
          </Button>
          <Button onClick={downloadBoard} variant="outline" aria-label={t('whiteboard.export')} className="border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-xl transition-colors">
            <Download className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">{t('whiteboard.export')}</span>
          </Button>
        </div>
      </div>

      {/* ZONE DE DESSIN */}
      <div className="flex-1 overflow-auto flex justify-center items-center p-4 md:p-8 relative">
        <div className="relative shadow-2xl rounded-xl ring-1 ring-gray-200 dark:ring-[#333537] overflow-hidden bg-white dark:bg-[#1e1f20] transition-colors duration-300">
          
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onTouchStart={(e) => { e.preventDefault(); startDrawing(e); }}
            onTouchMove={(e) => { e.preventDefault(); draw(e); }}
            onTouchEnd={(e) => { e.preventDefault(); stopDrawing(); }}
            onTouchCancel={(e) => { e.preventDefault(); stopDrawing(); }}
            style={{ width: "100%", maxWidth: `${CANVAS_WIDTH}px`, aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`, touchAction: "none" }}
            className={tool === "text" ? "cursor-text" : "cursor-crosshair"} 
          />

          {textInput.visible && (
            <input
              ref={textInputRef}
              type="text"
              value={textInput.text}
              onChange={(e) => setTextInput({ ...textInput, text: e.target.value })}
              onBlur={finalizeText}
              onKeyDown={(e) => { if (e.key === "Enter") finalizeText(); }}
              placeholder={t('whiteboard.textPlaceholder')}
              style={{
                position: "absolute",
                left: `${(textInput.x / CANVAS_WIDTH) * 100}%`,
                top: `${(textInput.y / CANVAS_HEIGHT) * 100}%`,
                color: color,
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
              <button onClick={() => setIsCustomColorOpen(false)} aria-label={t('whiteboard.closePicker')} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="custom-picker">
              <HexColorPicker color={color} onChange={(newColor) => { setColor(newColor); setTool(tool === "eraser" ? "pen" : tool); }} />
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 flex items-center gap-2 bg-gray-50 dark:bg-[#131314] border border-gray-200 dark:border-[#333537] p-1.5 rounded-xl transition-colors duration-300">
                <div className="w-6 h-6 rounded-md shadow-inner border border-gray-200 dark:border-[#333537]" style={{ backgroundColor: color }} />
                <input 
                  type="text" 
                  value={color} 
                  onChange={(e) => setColor(e.target.value)} 
                  className="w-full bg-transparent text-sm font-mono uppercase text-gray-800 dark:text-gray-200 focus:outline-none"
                />
              </div>
              <Button onClick={handleSaveColor} variant="outline" aria-label={t('whiteboard.saveColor')} title={t('whiteboard.saveColor')} className="rounded-xl px-3 border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Les couleurs enregistrées avec "+" n'étaient affichées nulle part */}
            {savedColors.length > 0 && (
              <div className="flex flex-wrap gap-1.5 px-1">
                {savedColors.map((savedColor) => (
                  <button
                    key={savedColor}
                    type="button"
                    onClick={() => { setColor(savedColor); if (tool === "eraser") setTool("pen"); }}
                    aria-label={savedColor}
                    className="w-6 h-6 rounded-full border border-gray-200 dark:border-[#333537] hover:scale-110 transition-transform"
                    style={{ backgroundColor: savedColor }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* BARRE D'OUTILS FLOTTANTE */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-[#1e1f20]/95 backdrop-blur-xl shadow-2xl border border-gray-200 dark:border-[#333537] p-2 md:p-3 rounded-2xl flex items-center gap-2 sm:gap-3 md:gap-5 max-w-[calc(100vw-1.5rem)] overflow-x-auto transition-colors duration-300">
        
        <div className="flex items-center gap-1 bg-gray-100/50 dark:bg-[#131314]/50 p-1 rounded-xl shrink-0 transition-colors duration-300">
          <button onClick={() => { setTool("pen"); setIsCustomColorOpen(false); }} className={`p-2.5 md:p-3 rounded-lg transition-all ${tool === "pen" && !isCustomColorOpen ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-md" : "text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-[#282a2c]"}`} title={t('whiteboard.tools.pen')}>
            <Pen className="w-5 h-5" />
          </button>
          <button onClick={() => { setTool("text"); setIsCustomColorOpen(false); }} className={`p-2.5 md:p-3 rounded-lg transition-all ${tool === "text" && !isCustomColorOpen ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-md" : "text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-[#282a2c]"}`} title={t('whiteboard.tools.text')}>
            <Type className="w-5 h-5" />
          </button>
          <button onClick={() => { setTool("eraser"); setIsCustomColorOpen(false); }} className={`p-2.5 md:p-3 rounded-lg transition-all ${tool === "eraser" ? "bg-white dark:bg-[#282a2c] text-gray-900 dark:text-white shadow-md ring-1 ring-gray-200 dark:ring-[#333537]" : "text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-[#282a2c]"}`} title={t('whiteboard.tools.eraser')}>
            <Eraser className="w-5 h-5" />
          </button>
        </div>

        <div className="w-px h-8 bg-gray-200 dark:bg-[#333537] shrink-0 transition-colors duration-300"></div>

        <div className={`flex items-center gap-1.5 shrink-0 transition-opacity ${tool === "eraser" ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
          {PRESET_COLORS.map((c) => (
            <button key={c} aria-label={t('whiteboard.colorLabel', { color: c })} title={c} onClick={() => { setColor(c); if(tool === "eraser") setTool("pen"); setIsCustomColorOpen(false); }} className={`w-7 h-7 md:w-8 md:h-8 rounded-full border-2 transition-all ${color === c && !isCustomColorOpen ? "border-gray-900 dark:border-white scale-110 shadow-lg" : "border-transparent hover:scale-110 shadow-sm"}`} style={{ backgroundColor: c }} />
          ))}
          
          <button 
            onClick={() => setIsCustomColorOpen(!isCustomColorOpen)}
            aria-label={t('whiteboard.customColor')}
            title={t('whiteboard.customColor')} 
            className={`w-7 h-7 md:w-8 md:h-8 rounded-full border-2 transition-all flex items-center justify-center bg-gradient-to-tr from-pink-400 via-purple-400 to-indigo-400 ${isCustomColorOpen ? "border-gray-900 dark:border-white scale-110 shadow-lg" : "border-transparent hover:scale-110 shadow-sm"}`}
          >
            <Palette className={`w-4 h-4 ${isCustomColorOpen ? "text-white" : "text-white/80"}`} />
          </button>
        </div>

        <div className="w-px h-8 bg-gray-200 dark:bg-[#333537] shrink-0 hidden md:block transition-colors duration-300"></div>

        <div className="flex items-center gap-1 shrink-0">
          {BRUSH_SIZES.map((size, index) => (
            <button key={size} aria-label={t('whiteboard.brushSize', { size })} title={t('whiteboard.brushSize', { size })} onClick={() => setLineWidth(size)} className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-xl transition-all ${lineWidth === size ? "bg-gray-100 dark:bg-[#282a2c] shadow-inner" : "hover:bg-gray-50 dark:hover:bg-[#131314]"}`}>
              <Circle className="fill-gray-700 dark:fill-gray-300 text-gray-700 dark:text-gray-300" style={{ width: 4 + index * 4, height: 4 + index * 4 }} />
            </button>
          ))}
        </div>

        <div className="w-px h-8 bg-gray-200 dark:bg-[#333537] shrink-0 transition-colors duration-300"></div>

        <button onClick={clearBoard} className="p-2.5 md:p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors shrink-0" title={t('whiteboard.tools.clearAll')}>
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
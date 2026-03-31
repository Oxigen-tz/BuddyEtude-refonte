import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { HexColorPicker } from "react-colorful";
import { 
  ArrowLeft, Eraser, Pen, Trash2, Download, Circle, Palette, X, Plus
} from "lucide-react";

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;
const BRUSH_SIZES = [2, 6, 12, 24];

export default function Whiteboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("sessionId") || "demo-board";

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(BRUSH_SIZES[1]);
  const [tool, setTool] = useState("pen");
  const [isCustomColorOpen, setIsCustomColorOpen] = useState(false);

  // 🌙 NOUVEAU : Détecter en direct si on est en mode clair ou sombre
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // 🎨 PALETTE DYNAMIQUE (Le 1er stylo change avec le thème !)
  const PRESET_COLORS = [
    isDarkMode ? "#ffffff" : "#09090b", // Blanc si sombre, Noir si clair
    "#ef4444", "#3b82f6", "#22c55e", "#a855f7"
  ];

  const [color, setColor] = useState(PRESET_COLORS[0]);

  // Si l'utilisateur change de mode, on adapte la couleur de son stylo s'il utilisait la couleur par défaut
  useEffect(() => {
    if (color === "#ffffff" && !isDarkMode) setColor("#09090b");
    else if (color === "#09090b" && isDarkMode) setColor("#ffffff");
  }, [isDarkMode]);

  const [savedColors, setSavedColors] = useState(() => {
    const saved = localStorage.getItem("buddyetude_saved_colors");
    return saved ? JSON.parse(saved) : [];
  });

  // Synchronisation Firebase (Avec fond TRANSPARENT)
  useEffect(() => {
    const docRef = doc(db, "whiteboards", sessionId);
    const unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists() && canvasRef.current) {
        const data = docSnap.data();
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        
        ctx.clearRect(0, 0, canvas.width, canvas.height); // On nettoie le tableau
        
        if (data.image) {
          const img = new Image();
          img.onload = () => ctx.drawImage(img, 0, 0);
          img.src = data.image;
        }
      }
    });
    return () => unsub();
  }, [sessionId]);

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect(); 
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: x * scaleX, y: y * scaleY };
  };

  const startDrawing = (e) => {
    const { x, y } = getCanvasCoordinates(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { x, y } = getCanvasCoordinates(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(x, y);
    
    // 🪄 MAGIE PRO : On utilise destination-out pour EFFACER de vrais pixels, au lieu de colorier par-dessus !
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
    if (!isDrawing) return;
    setIsDrawing(false);
    
    // On repasse en mode dessin normal avant de sauvegarder
    const ctx = canvasRef.current.getContext("2d");
    ctx.globalCompositeOperation = "source-over";

    const canvas = canvasRef.current;
    const imageBase64 = canvas.toDataURL("image/png"); // Sauvegarde avec fond transparent
    await setDoc(doc(db, "whiteboards", sessionId), { image: imageBase64, updatedAt: new Date().toISOString() }, { merge: true });
  };

  const clearBoard = async () => {
    if(!window.confirm("Voulez-vous vraiment tout effacer ?")) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Nettoyage total
    await setDoc(doc(db, "whiteboards", sessionId), { image: null }, { merge: true });
  };

  // 📥 MAGIE DE TÉLÉCHARGEMENT : On fusionne l'image avec un fond avant d'enregistrer
  const downloadBoard = () => {
    const canvas = canvasRef.current;
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const ctx = tempCanvas.getContext("2d");

    // On crée un fond de la couleur actuelle (Clair ou Sombre)
    ctx.fillStyle = isDarkMode ? "#1e1f20" : "#ffffff";
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // On dessine le trait transparent par-dessus
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
      localStorage.setItem("buddyetude_saved_colors", JSON.stringify(newColors));
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-50 dark:bg-[#131314] z-50 flex flex-col transition-colors duration-300" 
         style={{ backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)", backgroundSize: "24px 24px", color: "var(--tw-prose-body, rgba(148, 163, 184, 0.2))" }}>
      
      {/* EN TÊTE */}
      <div className="bg-white/80 dark:bg-[#1e1f20]/90 backdrop-blur-md border-b border-gray-200 dark:border-[#333537] px-6 py-3 flex items-center justify-between shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="hover:bg-gray-100 dark:hover:bg-[#282a2c] text-gray-700 dark:text-gray-300 rounded-xl">
            <ArrowLeft className="w-5 h-5 mr-2" /> Retour au Chat
          </Button>
          <div className="h-6 w-px bg-gray-300 dark:bg-[#333537] hidden md:block"></div>
          <h2 className="font-bold text-gray-800 dark:text-gray-100 hidden md:block">
            {isDarkMode ? "Tableau Noir Interactif" : "Tableau Blanc Interactif"}
          </h2>
        </div>
        <Button onClick={downloadBoard} variant="outline" className="border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-xl transition-colors">
          <Download className="w-4 h-4 mr-2" /> Exporter (PNG)
        </Button>
      </div>

      {/* ZONE DE DESSIN */}
      <div className="flex-1 overflow-auto flex justify-center items-center p-4 md:p-8 relative">
        
        {/* LE CANVAS : C'est le CSS qui gère la couleur de fond ! */}
        <div className="relative shadow-2xl rounded-xl ring-1 ring-gray-200 dark:ring-[#333537] overflow-hidden bg-white dark:bg-[#1e1f20] transition-colors duration-300">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            style={{ width: "100%", maxWidth: `${CANVAS_WIDTH}px`, aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`, touchAction: "none" }}
            className="cursor-crosshair" 
          />
        </div>

        {/* PANNEAU DE COULEUR PERSONNALISÉ */}
        {isCustomColorOpen && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-[#1e1f20]/95 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-gray-100 dark:border-[#333537] z-50 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 min-w-[250px]">
            <div className="flex items-center justify-between gap-2 px-1">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Couleur personnalisée</span>
              <button onClick={() => setIsCustomColorOpen(false)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="custom-picker">
              <HexColorPicker color={color} onChange={(newColor) => { setColor(newColor); setTool("pen"); }} />
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
              <Button onClick={handleSaveColor} variant="outline" className="rounded-xl px-3 border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {savedColors.length > 0 && (
              <div className="pt-3 mt-1 border-t border-gray-100 dark:border-[#333537]">
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-2 block px-1">Vos favoris</span>
                <div className="flex flex-wrap gap-2 px-1">
                  {savedColors.map(c => (
                    <button
                      key={c}
                      onClick={() => { setColor(c); setTool("pen"); }}
                      className={`w-6 h-6 rounded-md shadow-sm border transition-all hover:scale-110 ${color === c ? 'border-gray-900 dark:border-white ring-2 ring-gray-900/20 dark:ring-white/20' : 'border-gray-200 dark:border-[#333537]'}`}
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* BARRE D'OUTILS FLOTTANTE */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-[#1e1f20]/95 backdrop-blur-xl shadow-2xl border border-gray-200 dark:border-[#333537] p-2 md:p-3 rounded-2xl flex items-center gap-3 md:gap-5 max-w-[95vw] transition-colors duration-300">
        
        <div className="flex items-center gap-1 bg-gray-100/50 dark:bg-[#131314]/50 p-1 rounded-xl shrink-0 transition-colors duration-300">
          <button onClick={() => { setTool("pen"); setIsCustomColorOpen(false); }} className={`p-2.5 md:p-3 rounded-lg transition-all ${tool === "pen" && !isCustomColorOpen ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-md" : "text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-[#282a2c]"}`}>
            <Pen className="w-5 h-5" />
          </button>
          <button onClick={() => { setTool("eraser"); setIsCustomColorOpen(false); }} className={`p-2.5 md:p-3 rounded-lg transition-all ${tool === "eraser" ? "bg-white dark:bg-[#282a2c] text-gray-900 dark:text-white shadow-md ring-1 ring-gray-200 dark:ring-[#333537]" : "text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-[#282a2c]"}`}>
            <Eraser className="w-5 h-5" />
          </button>
        </div>

        <div className="w-px h-8 bg-gray-200 dark:bg-[#333537] shrink-0 transition-colors duration-300"></div>

        <div className={`flex items-center gap-1.5 shrink-0 transition-opacity ${tool === "eraser" ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
          {PRESET_COLORS.map((c) => (
            <button key={c} onClick={() => { setColor(c); setTool("pen"); setIsCustomColorOpen(false); }} className={`w-7 h-7 md:w-8 md:h-8 rounded-full border-2 transition-all ${color === c && !isCustomColorOpen ? "border-gray-900 dark:border-white scale-110 shadow-lg" : "border-transparent hover:scale-110 shadow-sm"}`} style={{ backgroundColor: c }} />
          ))}
          
          <button 
            onClick={() => setIsCustomColorOpen(!isCustomColorOpen)} 
            className={`w-7 h-7 md:w-8 md:h-8 rounded-full border-2 transition-all flex items-center justify-center bg-gradient-to-tr from-pink-400 via-purple-400 to-indigo-400 ${isCustomColorOpen ? "border-gray-900 dark:border-white scale-110 shadow-lg" : "border-transparent hover:scale-110 shadow-sm"}`}
          >
            <Palette className={`w-4 h-4 ${isCustomColorOpen ? "text-white" : "text-white/80"}`} />
          </button>
        </div>

        <div className="w-px h-8 bg-gray-200 dark:bg-[#333537] shrink-0 hidden md:block transition-colors duration-300"></div>

        <div className="flex items-center gap-1 shrink-0">
          {BRUSH_SIZES.map((size, index) => (
            <button key={size} onClick={() => setLineWidth(size)} className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-xl transition-all ${lineWidth === size ? "bg-gray-100 dark:bg-[#282a2c] shadow-inner" : "hover:bg-gray-50 dark:hover:bg-[#131314]"}`}>
              <Circle className="fill-gray-700 dark:fill-gray-300 text-gray-700 dark:text-gray-300" style={{ width: 4 + index * 4, height: 4 + index * 4 }} />
            </button>
          ))}
        </div>

        <div className="w-px h-8 bg-gray-200 dark:bg-[#333537] shrink-0 transition-colors duration-300"></div>

        <button onClick={clearBoard} className="p-2.5 md:p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors shrink-0" title="Effacer le tableau">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <style>{`
        .custom-picker .react-colorful { width: 100%; height: 160px; border-radius: 12px; }
        .custom-picker .react-colorful__saturation { border-radius: 12px 12px 0 0; border-bottom: none; }
        .custom-picker .react-colorful__hue { height: 16px; border-radius: 0 0 12px 12px; margin-top: -1px; }
        .custom-picker .react-colorful__handle { width: 20px; height: 20px; border: 3px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.2); }
      `}</style>
    </div>
  );
}
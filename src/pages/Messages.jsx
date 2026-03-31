import React, { useState, useEffect, useRef } from "react";
import { db, storage } from "../firebase/config";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, MessageSquare, Loader2, Paperclip, FileText, Image as ImageIcon, PenTool, X } from "lucide-react";
import { toast } from "sonner"; // Import pour les alertes
const BANNED_EXTENSIONS = [
  ".exe", ".msi", ".bat", ".cmd", ".sh", ".vbs", ".js", ".com", ".scr", ".dll", ".sys"
];

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [buddies, setBuddies] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user?.email) return;
    const q = query(collection(db, "requests"), where("status", "==", "accepted"));
    const unsub = onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.from_email === user.email) list.push({ email: data.to_email, name: data.to_name });
        else if (data.to_email === user.email) list.push({ email: data.from_email, name: data.from_name });
      });
      setBuddies(list.filter((v, i, a) => a.findIndex(t => t.email === v.email) === i));
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!user?.email || !activeChat) return;
    const chatId = [user.email, activeChat.email].sort().join("_");
    const q = query(collection(db, "messages"), where("chatId", "==", chatId));
    const unsub = onSnapshot(q, (snapshot) => {
      const rawMessages = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      const sortedMessages = rawMessages.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
      setMessages(sortedMessages);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    return () => unsub();
  }, [activeChat, user]);

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || !activeChat) return;

    // 🛡️ SÉCURITÉ ANTI-CRASH : On vérifie si storage existe avant de l'utiliser
    if (selectedFile && !storage) {
      toast.error("Le service de stockage n'est pas activé dans firebase/config.js");
      console.error("Erreur: 'storage' est undefined. Vérifiez votre fichier firebase/config.js");
      return;
    }

    setIsSending(true);
    try {
      const chatId = [user.email, activeChat.email].sort().join("_");
      let fileUrl = null, fileType = null, fileName = null;

      if (selectedFile) {
        const fileRef = ref(storage, `chat_files/${Date.now()}_${selectedFile.name}`);
        await uploadBytes(fileRef, selectedFile);
        fileUrl = await getDownloadURL(fileRef);
        fileType = selectedFile.type; 
        fileName = selectedFile.name;
      }

      await addDoc(collection(db, "messages"), {
        chatId, text: newMessage.trim(), senderEmail: user.email,
        createdAt: serverTimestamp(), fileUrl, fileType, fileName
      });

      setNewMessage(""); 
      setSelectedFile(null);
    } catch (error) { 
      console.error("Erreur d'envoi:", error);
      toast.error("Erreur lors de l'envoi du fichier.");
    } finally { 
      setIsSending(false); 
    }
  };

  return (
    <div className="w-full h-[calc(100vh-100px)] flex flex-col md:flex-row gap-6 animate-in fade-in duration-500">
      
      {/* --- LISTE DES BINÔMES --- */}
      <div className="w-full md:w-[320px] shrink-0 rounded-2xl flex flex-col bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] shadow-sm overflow-hidden transition-colors duration-300">
        <div className="p-5 border-b border-gray-50 dark:border-[#333537] bg-gray-50/50 dark:bg-[#131314]/30">
          <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Mes Binômes
          </h2>
        </div>
        <div className="overflow-y-auto flex-1 p-3 space-y-1.5">
          {buddies.length === 0 ? <p className="text-center text-sm text-gray-400 p-4">Aucune conversation</p> : 
            buddies.map(buddy => (
              <button key={buddy.email} onClick={() => setActiveChat(buddy)} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${activeChat?.email === buddy.email ? "bg-indigo-50 dark:bg-indigo-500/10 shadow-sm" : "hover:bg-gray-50 dark:hover:bg-[#282a2c]"}`}>
                <Avatar className="h-12 w-12"><AvatarFallback className="bg-indigo-100 dark:bg-[#282a2c] text-indigo-700 dark:text-indigo-400 font-bold">{buddy.name[0]}</AvatarFallback></Avatar>
                <span className={`font-semibold text-left truncate ${activeChat?.email === buddy.email ? "text-indigo-900 dark:text-indigo-300" : "text-gray-700 dark:text-gray-300"}`}>{buddy.name}</span>
              </button>
            ))
          }
        </div>
      </div>

      {/* --- ZONE DE CHAT --- */}
      <div className="flex-1 rounded-2xl flex flex-col bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] shadow-sm overflow-hidden transition-colors duration-300">
        {activeChat ? (
          <>
            <div className="p-5 border-b border-gray-50 dark:border-[#333537] bg-gray-50/50 dark:bg-[#131314]/30 flex items-center gap-4">
               <Avatar className="h-12 w-12"><AvatarFallback className="bg-indigo-100 dark:bg-[#282a2c] text-indigo-700 dark:text-indigo-400 font-bold text-lg">{activeChat.name[0]}</AvatarFallback></Avatar>
               <div className="flex-1">
                 <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 leading-tight">{activeChat.name}</h3>
                 <p className="text-sm text-green-600 dark:text-green-400 font-medium">En ligne</p>
               </div>
               {/* 🎨 BOUTON TABLEAU BLANC CORRIGÉ */}
               <Button 
                variant="outline" 
                onClick={() => navigate(`/whiteboard?sessionId=${[user.email, activeChat.email].sort().join("_")}`)}
                className="border-indigo-200 dark:border-[#333537] text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-[#282a2c] dark:bg-[#1e1f20] rounded-xl py-5 px-5"
               >
                 <PenTool className="w-5 h-5 mr-2" /> Ouvrir le Tableau Blanc
               </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-[#131314]">
              {messages.map((msg) => {
                const isMe = msg.senderEmail === user.email;
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] md:max-w-[60%] rounded-2xl px-5 py-3 text-base flex flex-col gap-2 ${isMe ? "bg-indigo-600 dark:bg-indigo-500 text-white rounded-tr-sm shadow-sm" : "bg-white dark:bg-[#282a2c] border border-gray-100 dark:border-[#333537] text-gray-800 dark:text-gray-100 rounded-tl-sm shadow-sm"}`}>
                      {msg.fileUrl && (
                        msg.fileType?.includes("image") ? (
                          <img src={msg.fileUrl} alt="Fichier" className="rounded-xl max-h-60 object-cover cursor-pointer" onClick={() => window.open(msg.fileUrl)} />
                        ) : (
                          <a href={msg.fileUrl} target="_blank" rel="noreferrer" className={`flex items-center gap-3 p-3 rounded-xl ${isMe ? "bg-indigo-700/50 text-white" : "bg-gray-100 dark:bg-[#1e1f20] text-gray-700 dark:text-gray-300"}`}>
                            <FileText className="w-5 h-5" />
                            <span className="truncate max-w-[200px] font-medium">{msg.fileName || "Document"}</span>
                          </a>
                        )
                      )}
                      {msg.text && <span className="leading-relaxed">{msg.text}</span>}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {selectedFile && (
              <div className="px-5 py-3 bg-indigo-50 dark:bg-[#282a2c] border-t border-indigo-100 dark:border-[#333537] flex items-center justify-between text-sm text-indigo-700 dark:text-indigo-400 font-medium">
                <span className="flex items-center gap-2 truncate"><Paperclip className="w-4 h-4" /> {selectedFile.name}</span>
                <button onClick={() => setSelectedFile(null)} className="p-1 hover:bg-indigo-100 dark:hover:bg-[#1e1f20] rounded-md transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <form onSubmit={handleSend} className="p-4 bg-white dark:bg-[#1e1f20] border-t border-gray-50 dark:border-[#333537] flex gap-3 items-center">
              <input type="file" ref={fileInputRef} onChange={(e) => setSelectedFile(e.target.files[0])} className="hidden" />
              <Button type="button" variant="ghost" onClick={() => fileInputRef.current.click()} className="text-gray-400 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#282a2c] hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full h-12 w-12 p-0 shrink-0 transition-colors">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Input 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)} 
                placeholder={`Écrire un message à ${activeChat.name}...`} 
                className="h-12 rounded-xl bg-gray-50 dark:bg-[#282a2c] dark:text-gray-100 dark:placeholder-gray-500 border-transparent flex-1 text-base px-5 focus-visible:ring-indigo-500/50" 
              />
              <Button type="submit" disabled={(!newMessage.trim() && !selectedFile) || isSending} className="h-12 w-12 p-0 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl shrink-0 transition-colors">
                {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
            <div className="w-20 h-20 bg-gray-50 dark:bg-[#131314] rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="w-10 h-10 opacity-50" />
            </div>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">Vos messages</p>
            <p className="text-sm mt-1">Sélectionnez un binôme à gauche pour commencer à discuter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
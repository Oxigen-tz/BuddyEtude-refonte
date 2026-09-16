import React, { useState, useEffect, useRef } from "react";
import { db, storage } from "../firebase/config";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, MessageSquare, Loader2, Paperclip, FileText, PenTool, X, Edit2, Trash2, Check, UserPlus, AlertTriangle } from "lucide-react";
import { toast } from "sonner"; 

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
  
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editMessageText, setEditMessageText] = useState("");

  // États pour contrôler l'affichage de nos pop-ups sur mesure
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user?.email) return;

    let toList = [];
    let fromList = [];

    const updateBuddies = () => {
      const combined = [...toList, ...fromList];
      setBuddies(combined.filter((v, i, a) => a.findIndex(t => t.email === v.email) === i));
    };

    const unsubTo = onSnapshot(query(collection(db, "requests"), where("to_email", "==", user.email)), (snap) => {
      toList = snap.docs.map(d => {
        const data = d.data();
        if (data.status === "accepted" || data.status === "pending") {
          return { email: data.from_email, name: data.from_name, requestId: d.id, isPending: data.status === "pending" };
        }
        return null;
      }).filter(Boolean);
      updateBuddies();
    });

    const unsubFrom = onSnapshot(query(collection(db, "requests"), where("from_email", "==", user.email)), (snap) => {
      fromList = snap.docs.map(d => {
        const data = d.data();
        if (data.status === "accepted") {
          return { email: data.to_email, name: data.to_name, requestId: d.id, isPending: false };
        }
        return null;
      }).filter(Boolean);
      updateBuddies();
    });

    return () => { unsubTo(); unsubFrom(); };
  }, [user]);

  // Écoute des messages avec le correctif anti-saut de page (block: "nearest")
  useEffect(() => {
    if (!user?.email || !activeChat || activeChat.isPending) return;
    
    const chatId = [user.email, activeChat.email].sort().join("_");
    const q = query(collection(db, "messages"), where("chatId", "==", chatId));
    const unsub = onSnapshot(q, (snapshot) => {
      const rawMessages = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      const sortedMessages = rawMessages.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
      setMessages(sortedMessages);
      
      // 🛠️ CORRECTIF : Évite que toute la page web ne saute vers le bas au chargement du chat
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 50);
    });
    return () => unsub();
  }, [activeChat, user]);

  // --- ACTIONS DES DEMANDES ---
  const handleAcceptRequest = async (requestId) => {
    try {
      await updateDoc(doc(db, "requests", requestId), { status: "accepted" });
      toast.success("Demande acceptée ! Vous pouvez maintenant discuter.");
      setActiveChat(prev => ({ ...prev, isPending: false }));
    } catch (error) {
      toast.error("Erreur lors de l'acceptation.");
    }
  };

  const confirmRejectRequest = async () => {
    if (!activeChat?.requestId) return;
    try {
      await deleteDoc(doc(db, "requests", activeChat.requestId));
      toast.success("Demande refusée.");
      setActiveChat(null);
    } catch (error) {
      toast.error("Erreur lors du refus.");
    } finally {
      setShowRejectModal(false);
    }
  };

  // --- ACTIONS DES MESSAGES ---
  const handleSend = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || !activeChat) return;

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
      toast.error("Erreur lors de l'envoi.");
    } finally { 
      setIsSending(false); 
    }
  };

  const confirmDeleteMessage = async () => {
    if (!messageToDelete) return;
    try {
      await deleteDoc(doc(db, "messages", messageToDelete));
      toast.success("Message supprimé");
    } catch (error) {
      toast.error("Impossible de supprimer le message");
    } finally {
      setMessageToDelete(null); 
    }
  };

  const startEditing = (msg) => {
    setEditingMessageId(msg.id);
    setEditMessageText(msg.text || "");
  };

  const handleSaveEdit = async (msgId) => {
    if (!editMessageText.trim()) return;
    try {
      await updateDoc(doc(db, "messages", msgId), {
        text: editMessageText.trim(),
        isEdited: true 
      });
      setEditingMessageId(null);
      setEditMessageText("");
      toast.success("Message modifié");
    } catch (error) {
      toast.error("Impossible de modifier le message");
    }
  };

  return (
    <>
      <div className="w-full h-[calc(100vh-100px)] flex flex-col md:flex-row gap-6 animate-in fade-in duration-500">
        
        {/* --- LISTE DES BINÔMES --- */}
        <div className="w-full md:w-[320px] shrink-0 rounded-2xl flex flex-col bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] shadow-sm overflow-hidden transition-colors duration-300">
          <div className="p-5 border-b border-gray-50 dark:border-[#333537] bg-gray-50/50 dark:bg-[#131314]/30">
            <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Mes Contacts
            </h2>
          </div>
          <div className="overflow-y-auto flex-1 p-3 space-y-1.5">
            {buddies.length === 0 ? <p className="text-center text-sm text-gray-400 p-4">Aucune conversation</p> : 
              buddies.map(buddy => (
                <button key={buddy.email} onClick={() => setActiveChat(buddy)} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${activeChat?.email === buddy.email ? "bg-indigo-50 dark:bg-indigo-500/10 shadow-sm" : "hover:bg-gray-50 dark:hover:bg-[#282a2c]"}`}>
                  <Avatar className="h-12 w-12"><AvatarFallback className="bg-indigo-100 dark:bg-[#282a2c] text-indigo-700 dark:text-indigo-400 font-bold">{buddy.name[0]}</AvatarFallback></Avatar>
                  <span className={`font-semibold text-left truncate ${activeChat?.email === buddy.email ? "text-indigo-900 dark:text-indigo-300" : "text-gray-700 dark:text-gray-300"}`}>{buddy.name}</span>
                  
                  {buddy.isPending && (
                    <span className="ml-auto text-[10px] uppercase tracking-wider font-bold bg-indigo-600 text-white px-2 py-1 rounded-full">
                      Nouveau
                    </span>
                  )}
                </button>
              ))
            }
          </div>
        </div>

        {/* --- ZONE DE CHAT OU D'ACCEPTATION --- */}
        <div className="flex-1 rounded-2xl flex flex-col bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] shadow-sm overflow-hidden transition-colors duration-300">
          {activeChat ? (
            activeChat.isPending ? (
              
              /* UI : DEMANDE EN ATTENTE */
              <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-[#131314] p-6 animate-in fade-in zoom-in-95">
                <div className="bg-white dark:bg-[#1e1f20] p-8 rounded-3xl border border-gray-100 dark:border-[#333537] shadow-sm max-w-md w-full text-center">
                  <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <UserPlus className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Nouvelle demande</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-8">
                    <strong className="text-gray-900 dark:text-gray-100">{activeChat.name}</strong> souhaite réviser avec vous. Acceptez pour lancer la messagerie.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={() => handleAcceptRequest(activeChat.requestId)} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-6 h-12">
                      <Check className="w-5 h-5 mr-2" /> Accepter
                    </Button>
                    <Button onClick={() => setShowRejectModal(true)} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20 rounded-xl px-6 h-12">
                      <X className="w-5 h-5 mr-2" /> Refuser
                    </Button>
                  </div>
                </div>
              </div>

            ) : (

              /* UI : CHAT NORMAL */
              <>
                <div className="p-5 border-b border-gray-50 dark:border-[#333537] bg-gray-50/50 dark:bg-[#131314]/30 flex items-center gap-4">
                   <Avatar className="h-12 w-12"><AvatarFallback className="bg-indigo-100 dark:bg-[#282a2c] text-indigo-700 dark:text-indigo-400 font-bold text-lg">{activeChat.name[0]}</AvatarFallback></Avatar>
                   <div className="flex-1">
                     <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 leading-tight">{activeChat.name}</h3>
                     <p className="text-sm text-gray-500 dark:text-gray-400">Binôme d'étude</p>
                   </div>
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
                      <div key={msg.id} className={`flex items-center gap-3 group ${isMe ? "justify-end" : "justify-start"}`}>
                        
                        {isMe && editingMessageId !== msg.id && (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                            <button onClick={() => startEditing(msg)} className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hover:bg-gray-100 dark:hover:bg-[#282a2c] transition-colors" title="Modifier"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => setMessageToDelete(msg.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" title="Supprimer">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}

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
                          
                          {editingMessageId === msg.id ? (
                            <div className="flex items-center gap-2">
                              <input 
                                value={editMessageText} 
                                onChange={(e) => setEditMessageText(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(msg.id)}
                                autoFocus
                                className="bg-white/20 text-white outline-none rounded-lg px-3 py-1 w-full text-sm placeholder-white/50"
                              />
                              <button onClick={() => handleSaveEdit(msg.id)} className="p-1.5 hover:bg-white/20 rounded-full transition-colors"><Check className="w-4 h-4" /></button>
                              <button onClick={() => setEditingMessageId(null)} className="p-1.5 hover:bg-white/20 rounded-full transition-colors"><X className="w-4 h-4" /></button>
                            </div>
                          ) : (
                            msg.text && (
                              <span className="leading-relaxed relative">
                                {msg.text}
                                {msg.isEdited && <span className="text-[10px] opacity-60 ml-2 italic">(modifié)</span>}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {selectedFile && (
                  <div className="px-5 py-3 bg-indigo-50 dark:bg-[#282a2c] border-t border-indigo-100 dark:border-[#333537] flex items-center justify-between text-sm text-indigo-700 dark:text-indigo-400 font-medium">
                    <span className="flex items-center gap-2 truncate"><Paperclip className="w-4 h-4" /> {selectedFile.name}</span>
                    <button onClick={() => setSelectedFile(null)} className="p-1 hover:bg-indigo-100 dark:hover:bg-[#1e1f20] rounded-md transition-colors"><X className="w-4 h-4" /></button>
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
            )
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
              <div className="w-20 h-20 bg-gray-50 dark:bg-[#131314] rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="w-10 h-10 opacity-50" />
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">Vos messages</p>
              <p className="text-sm mt-1">Sélectionnez un contact à gauche pour afficher la discussion.</p>
            </div>
          )}
        </div>
      </div>

      {/* ==================================================== */}
      {/* MODALE : REFUSER UNE DEMANDE DE BINÔME             */}
      {/* ==================================================== */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1e1f20] rounded-3xl p-6 shadow-2xl w-full max-w-sm border border-gray-100 dark:border-[#333537] animate-in zoom-in-95">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Refuser la demande ?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              Cette action est définitive. Vous ne pourrez plus discuter avec cette personne à moins qu'une nouvelle demande ne soit envoyée.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowRejectModal(false)} className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#282a2c] rounded-xl font-medium">
                Annuler
              </Button>
              <Button onClick={confirmRejectRequest} className="bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium">
                Oui, refuser
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODALE : SUPPRIMER UN MESSAGE                      */}
      {/* ==================================================== */}
      {messageToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1e1f20] rounded-3xl p-6 shadow-2xl w-full max-w-sm border border-gray-100 dark:border-[#333537] animate-in zoom-in-95">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Supprimer ce message ?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              Êtes-vous sûr de vouloir supprimer ce message ? Il sera effacé pour vous et pour votre interlocuteur de manière irréversible.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setMessageToDelete(null)} className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#282a2c] rounded-xl font-medium">
                Annuler
              </Button>
              <Button onClick={confirmDeleteMessage} className="bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium">
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
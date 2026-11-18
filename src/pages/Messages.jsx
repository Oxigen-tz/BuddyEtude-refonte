import React, { useState, useEffect, useRef, useMemo } from "react";
import { db, storage } from "../firebase/config";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, arrayRemove, orderBy, limit } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRequests, buildRelations } from "@/hooks/useRequests";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { detectContactInfo } from "@/lib/safety";
import { pairId } from "@/lib/pairs";
import { createPageUrl } from "@/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, MessageSquare, Loader2, Paperclip, FileText, PenTool, X, Edit2, Trash2, Check, UserPlus, UserMinus, AlertTriangle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useTranslation, Trans } from "react-i18next";

// ⚠️ Même liste et même limite que storage.rules : les règles refusent aussi ces fichiers,
// la vérification ici sert à afficher un message clair avant l'envoi.
const BANNED_EXTENSIONS = [
  ".exe", ".msi", ".bat", ".cmd", ".sh", ".vbs", ".js", ".com", ".scr", ".dll", ".sys"
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo

// Nom de fichier sûr pour un chemin Storage : pas de "/" (qui créerait des sous-dossiers),
// ni de caractères de contrôle. Le nom d'origine reste affiché dans le message (fileName).
const FORBIDDEN_NAME_CHARS = "/\\#?[]*";
const toStorageName = (name) =>
  Array.from(name, (ch) => (ch.charCodeAt(0) < 32 || FORBIDDEN_NAME_CHARS.includes(ch) ? "_" : ch))
    .join("")
    .slice(-120) || "fichier";

// Heure d'envoi : "14:32" aujourd'hui, "12 nov., 14:32" sinon
const formatMessageTime = (createdAt, lang) => {
  const date = typeof createdAt?.toDate === "function" ? createdAt.toDate() : null;
  if (!date) return "";
  const sameDay = date.toDateString() === new Date().toDateString();
  return sameDay
    ? date.toLocaleTimeString(lang, { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleString(lang, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
};

// Messages chargés par conversation ; "Messages précédents" en charge autant de plus
const PAGE_SIZE = 50;

// Initiale sûre : ne plante pas si le nom est vide ou absent
const getInitial = (name) => (name?.trim()?.[0] || "?").toUpperCase();

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Contacts = binômes (demande acceptée) + demandes reçues en attente.
  // Une seule demande par paire (id = paire de uids) : plus de doublons possibles.
  const requests = useRequests(user?.uid);
  const buddies = useMemo(() => {
    const relations = buildRelations(requests);
    return [...relations.entries()]
      .filter(([, r]) => r.status === "buddy" || r.status === "received")
      .map(([uid, r]) => ({ uid, name: r.name, requestId: r.requestId, isPending: r.status === "received", kind: r.kind, subject: r.subject, message: r.message }))
      // Demandes en attente en haut, puis ordre alphabétique
      .sort((a, b) => Number(b.isPending) - Number(a.isPending) || a.name.localeCompare(b.name));
  }, [requests]);

  const unread = useUnreadMessages(user?.uid);

  // On mémorise le uid du contact ouvert (et non l'objet) : la fiche se met à jour d'elle-même
  // quand la demande est acceptée, et se ferme si le binôme est retiré
  const [activeUid, setActiveUid] = useState(null);
  const activeChat = buddies.find((b) => b.uid === activeUid) || null;
  const [messages, setMessages] = useState([]);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [hasOlder, setHasOlder] = useState(false);
  const loadingOlderRef = useRef(false);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editMessageText, setEditMessageText] = useState("");

  // États pour contrôler l'affichage de nos pop-ups sur mesure
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // ?chat=<uid> (depuis la recherche ou une notification) : ouvre directement la conversation
  const chatParam = searchParams.get("chat");
  useEffect(() => {
    if (!chatParam || requests.loading) return;
    if (buddies.some((b) => b.uid === chatParam)) setActiveUid(chatParam);
    // On retire le paramètre pour qu'un retour arrière ne rouvre pas la conversation
    setSearchParams((params) => { params.delete("chat"); return params; }, { replace: true });
  }, [chatParam, requests.loading, buddies, setSearchParams]);

  const activeIsPending = activeChat?.isPending;

  // Nouvelle conversation : on repart des derniers messages
  useEffect(() => { setPageSize(PAGE_SIZE); }, [activeUid]);

  // Écoute des messages (les plus récents, paginés)
  useEffect(() => {
    // On vide la conversation précédente : sinon ses messages restaient affichés
    // le temps que ceux du nouveau contact arrivent
    if (!loadingOlderRef.current) setMessages([]);
    if (!user?.uid || !activeUid || activeIsPending !== false) return;

    const chatId = pairId(user.uid, activeUid);
    // Le filtre "participants" est exigé par les règles Firestore : une requête n'est autorisée
    // que si Firestore peut prouver que chaque résultat nous concerne. L'index composite
    // correspondant est déclaré dans firestore.indexes.json.
    const q = query(
      collection(db, "messages"),
      where("chatId", "==", chatId),
      where("participants", "array-contains", user.uid),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      // serverTimestamps "estimate" : un message qui vient d'être envoyé a un createdAt null
      // tant que le serveur n'a pas répondu, ce qui le faisait apparaître tout en haut du fil
      const rawMessages = snapshot.docs.map(d => ({ id: d.id, ...d.data({ serverTimestamps: "estimate" }) }));
      setMessages(rawMessages.reverse());
      setHasOlder(snapshot.size >= pageSize);

      // Conversation ouverte = messages lus : on se retire de unreadBy
      // (pastilles de la liste de contacts et du menu latéral)
      snapshot.docs
        .filter((d) => (d.data().unreadBy || []).includes(user.uid))
        .forEach((d) => {
          updateDoc(d.ref, { unreadBy: arrayRemove(user.uid) })
            .catch((error) => console.warn("Message non marqué comme lu :", error));
        });

      // Défilement vers le bas, sauf quand on vient de charger des messages plus anciens
      if (loadingOlderRef.current) {
        loadingOlderRef.current = false;
      } else {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 50);
      }
    }, (error) => {
      console.error("Erreur de chargement des messages:", error);
    });
    return () => unsub();
  }, [activeUid, activeIsPending, user, pageSize]);

  const loadOlder = () => {
    loadingOlderRef.current = true;
    setPageSize((n) => n + PAGE_SIZE);
  };

  // --- ACTIONS DES DEMANDES ---
  const handleAcceptRequest = async () => {
    if (!activeChat?.requestId) return;
    try {
      await updateDoc(doc(db, "requests", activeChat.requestId), { status: "accepted" });
      toast.success(t('messages.toast.accepted'));
    } catch (error) {
      console.error(error);
      toast.error(t('messages.toast.acceptError'));
    }
  };

  const confirmRejectRequest = async () => {
    if (!activeChat?.requestId) return;
    try {
      await deleteDoc(doc(db, "requests", activeChat.requestId));
      toast.success(t('messages.toast.rejected'));
      setActiveUid(null);
    } catch (error) {
      console.error(error);
      toast.error(t('messages.toast.rejectError'));
    } finally {
      setShowRejectModal(false);
    }
  };

  // Retirer un binôme : on supprime la demande acceptée. Les messages restent en base mais la
  // conversation disparaît de la liste, et les règles n'autorisent plus de nouveaux messages.
  const confirmRemoveBuddy = async () => {
    if (!activeChat) return;
    try {
      await deleteDoc(doc(db, "requests", activeChat.requestId));
      toast.success(t('messages.toast.buddyRemoved', { name: activeChat.name }));
      setActiveUid(null);
    } catch (error) {
      console.error(error);
      toast.error(t('messages.toast.buddyRemoveError'));
    } finally {
      setShowRemoveModal(false);
    }
  };

  // --- SÉLECTION D'UN FICHIER ---
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    // Réinitialise l'input pour pouvoir re-sélectionner le même fichier après l'avoir retiré
    e.target.value = "";
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    if (BANNED_EXTENSIONS.some(ext => lowerName.endsWith(ext))) {
      toast.error(t('messages.toast.fileNotAllowed'));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error(t('messages.toast.fileTooLarge'));
      return;
    }
    setSelectedFile(file);
  };

  // --- ACTIONS DES MESSAGES ---
  // Envoi : le champ est vidé tout de suite (on peut enchaîner les messages sans attendre la
  // réponse du serveur) et le texte est remis en cas d'échec. Avant, le bouton d'envoi restait
  // désactivé pendant l'envoi : la touche Entrée ne faisait alors rien et le texte tapé entre-temps
  // était effacé à la fin du premier envoi, sans avertissement.
  const handleSend = async (e) => {
    e.preventDefault();
    const text = newMessage.trim();
    const file = selectedFile;
    if ((!text && !file) || !activeChat || isSending) return;

    setNewMessage("");
    setSelectedFile(null);
    if (file) setIsSending(true); // seul le téléversement d'un fichier bloque l'envoi suivant
    try {
      const chatId = pairId(user.uid, activeChat.uid);
      let fileUrl = null, fileType = null, fileName = null;

      if (file) {
        // Un dossier par utilisateur : storage.rules n'autorise l'écriture que dans le sien,
        // personne ne peut donc écraser ou supprimer les fichiers des autres.
        const fileRef = ref(storage, `chat_files/${user.uid}/${Date.now()}_${toStorageName(file.name)}`);
        await uploadBytes(fileRef, file, { contentType: file.type || "application/octet-stream" });
        fileUrl = await getDownloadURL(fileRef);
        fileType = file.type;
        fileName = file.name;
      }

      await addDoc(collection(db, "messages"), {
        chatId, text, senderUid: user.uid,
        participants: [user.uid, activeChat.uid].sort(),
        // Non lu par le destinataire jusqu'à ce qu'il ouvre la conversation
        unreadBy: [activeChat.uid],
        createdAt: serverTimestamp(), fileUrl, fileType, fileName
      });
    } catch (error) {
      console.error(error);
      toast.error(t('messages.toast.sendError'));
      // On rend le texte et le fichier pour que rien ne soit perdu
      setNewMessage((current) => current || text);
      setSelectedFile((current) => current || file);
    } finally {
      if (file) setIsSending(false);
    }
  };

  const confirmDeleteMessage = async () => {
    if (!messageToDelete) return;
    try {
      const message = messages.find((m) => m.id === messageToDelete);
      await deleteDoc(doc(db, "messages", messageToDelete));
      // La pièce jointe restait dans Storage après la suppression du message
      if (message?.fileUrl) {
        deleteObject(ref(storage, message.fileUrl))
          .catch((error) => console.warn("Pièce jointe non supprimée :", error));
      }
      toast.success(t('messages.toast.deleted'));
    } catch (error) {
      console.error(error);
      toast.error(t('messages.toast.deleteError'));
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
      toast.success(t('messages.toast.edited'));
    } catch (error) {
      console.error(error);
      toast.error(t('messages.toast.editError'));
    }
  };

  return (
    <>
      {/* Mobile et tablette : la liste OU la conversation (avant, empilées, la conversation était écrasée).
          Hauteur = écran moins l'en-tête mobile et les marges ; à partir de 1024 px, côte à côte. */}
      <div className="w-full h-[calc(100dvh-105px)] md:h-[calc(100dvh-137px)] lg:h-[calc(100vh-64px)] flex flex-col lg:flex-row gap-6 animate-in fade-in duration-500">
        
        {/* --- LISTE DES BINÔMES --- */}
        <div className={`${activeChat ? "hidden lg:flex" : "flex"} flex-1 lg:flex-none w-full lg:w-[320px] shrink-0 min-h-0 rounded-2xl flex-col bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] shadow-sm overflow-hidden transition-colors duration-300`}>
          <div className="p-5 border-b border-gray-50 dark:border-[#333537] bg-gray-50/50 dark:bg-[#131314]/30">
            <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> {t('messages.contacts')}
            </h2>
          </div>
          <div className="overflow-y-auto flex-1 p-3 space-y-1.5">
            {buddies.length === 0 ? <p className="text-center text-sm text-gray-400 p-4">{t('messages.noConversation')}</p> : 
              buddies.map(buddy => {
                const unreadCount = unread.byUid[buddy.uid] || 0;
                const isActive = activeChat?.uid === buddy.uid;
                return (
                  <button key={buddy.uid} onClick={() => setActiveUid(buddy.uid)} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${isActive ? "bg-indigo-50 dark:bg-indigo-500/10 shadow-sm" : "hover:bg-gray-50 dark:hover:bg-[#282a2c]"}`}>
                    <Avatar className="h-12 w-12"><AvatarFallback className="bg-indigo-100 dark:bg-[#282a2c] text-indigo-700 dark:text-indigo-400 font-bold">{getInitial(buddy.name)}</AvatarFallback></Avatar>
                    <span className={`text-left truncate ${unreadCount > 0 ? "font-bold" : "font-semibold"} ${isActive ? "text-indigo-900 dark:text-indigo-300" : "text-gray-700 dark:text-gray-300"}`}>{buddy.name}</span>

                    {buddy.isPending ? (
                      <span className="ml-auto text-[10px] uppercase tracking-wider font-bold bg-indigo-600 text-white px-2 py-1 rounded-full">
                        {t('messages.new')}
                      </span>
                    ) : unreadCount > 0 && (
                      <span
                        className="ml-auto min-w-[1.5rem] h-6 px-1.5 text-xs font-bold bg-red-500 text-white rounded-full flex items-center justify-center"
                        aria-label={t('messages.unreadCount', { count: unreadCount })}
                      >
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            }
          </div>
        </div>

        {/* --- ZONE DE CHAT OU D'ACCEPTATION --- */}
        <div className={`${activeChat ? "flex" : "hidden lg:flex"} flex-1 min-w-0 min-h-0 rounded-2xl flex-col bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] shadow-sm overflow-hidden transition-colors duration-300`}>
          {activeChat ? (
            activeChat.isPending ? (
              
              /* UI : DEMANDE EN ATTENTE */
              <div className="relative flex-1 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-[#131314] p-6 overflow-y-auto animate-in fade-in zoom-in-95">
                <Button
                  variant="ghost"
                  onClick={() => setActiveUid(null)}
                  aria-label={t('messages.backToContacts')}
                  className="lg:hidden absolute top-3 left-3 h-10 w-10 p-0 rounded-xl text-gray-600 dark:text-gray-300"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="bg-white dark:bg-[#1e1f20] p-8 rounded-3xl border border-gray-100 dark:border-[#333537] shadow-sm max-w-md w-full text-center">
                  <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <UserPlus className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {activeChat.kind === "help" ? t('messages.pendingRequest.helpTitle', { subject: activeChat.subject }) : t('messages.pendingRequest.title')}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    <Trans
                      i18nKey={activeChat.kind === "help" ? "messages.pendingRequest.helpDesc" : "messages.pendingRequest.desc"}
                      values={{ name: activeChat.name, subject: activeChat.subject }}
                      components={{ bold: <strong className="text-gray-900 dark:text-gray-100" /> }}
                    />
                  </p>
                  {activeChat.message && (
                    <blockquote className="text-left text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#131314] border border-gray-100 dark:border-[#333537] rounded-2xl p-4 mb-4 whitespace-pre-wrap break-words">
                      {activeChat.message}
                    </blockquote>
                  )}
                  {detectContactInfo(activeChat.message) && (
                    <p role="note" className="flex gap-2 text-left text-xs text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 rounded-xl p-3 mb-4">
                      <AlertTriangle className="w-4 h-4 shrink-0" /> {t('messages.pendingRequest.contactWarning')}
                    </p>
                  )}
                  <div className="mb-4" />
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={handleAcceptRequest} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-6 h-12">
                      <Check className="w-5 h-5 mr-2" /> {t('messages.pendingRequest.accept')}
                    </Button>
                    <Button onClick={() => setShowRejectModal(true)} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20 rounded-xl px-6 h-12">
                      <X className="w-5 h-5 mr-2" /> {t('messages.pendingRequest.reject')}
                    </Button>
                  </div>
                </div>
              </div>

            ) : (

              /* UI : CHAT NORMAL */
              <>
                <div className="p-3 sm:p-5 border-b border-gray-50 dark:border-[#333537] bg-gray-50/50 dark:bg-[#131314]/30 flex items-center gap-2 sm:gap-4">
                   {/* Retour à la liste (mobile et tablette : liste et conversation ne s'affichent plus ensemble) */}
                   <Button
                    variant="ghost"
                    onClick={() => setActiveUid(null)}
                    aria-label={t('messages.backToContacts')}
                    className="lg:hidden h-10 w-10 p-0 shrink-0 rounded-xl text-gray-600 dark:text-gray-300"
                   >
                     <ArrowLeft className="w-5 h-5" />
                   </Button>
                   <Avatar className="h-10 w-10 sm:h-12 sm:w-12 shrink-0"><AvatarFallback className="bg-indigo-100 dark:bg-[#282a2c] text-indigo-700 dark:text-indigo-400 font-bold text-lg">{getInitial(activeChat.name)}</AvatarFallback></Avatar>
                   <div className="flex-1 min-w-0">
                     <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 leading-tight truncate">{activeChat.name}</h3>
                     <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{t('messages.studyBuddy')}</p>
                   </div>
                   <Button
                    variant="outline"
                    onClick={() => navigate(`${createPageUrl("Whiteboard")}?sessionId=${encodeURIComponent(pairId(user.uid, activeChat.uid))}`)}
                    aria-label={t('messages.openWhiteboard')}
                    className="shrink-0 border-indigo-200 dark:border-[#333537] text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-[#282a2c] dark:bg-[#1e1f20] rounded-xl h-11 px-3 xl:px-5"
                   >
                     <PenTool className="w-5 h-5 xl:mr-2" /> <span className="hidden xl:inline">{t('messages.openWhiteboard')}</span>
                   </Button>
                   <Button
                    variant="ghost"
                    onClick={() => setShowRemoveModal(true)}
                    aria-label={t('messages.removeBuddy')}
                    title={t('messages.removeBuddy')}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl h-11 w-11 p-0 shrink-0"
                   >
                     <UserMinus className="w-5 h-5" />
                   </Button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/50 dark:bg-[#131314]">
                  {/* Pagination : seuls les derniers messages sont chargés au départ */}
                  {hasOlder && (
                    <div className="flex justify-center">
                      <Button variant="ghost" size="sm" onClick={loadOlder} className="rounded-xl text-xs text-gray-500 dark:text-gray-400">
                        {t('messages.loadOlder')}
                      </Button>
                    </div>
                  )}
                  {messages.map((msg) => {
                    const isMe = msg.senderUid === user.uid;
                    const sentAt = formatMessageTime(msg.createdAt, i18n.language);
                    return (
                      <div key={msg.id} className={`flex items-center gap-2 sm:gap-3 group ${isMe ? "justify-end" : "justify-start"}`}>

                        {/* Actions : visibles au survol sur ordinateur, toujours visibles sur écran tactile
                            (avant, le survol n'existant pas sur mobile, on ne pouvait ni modifier ni supprimer) */}
                        {isMe && editingMessageId !== msg.id && (
                          <div className="flex items-center gap-1 sm:gap-2 opacity-70 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                            <button onClick={() => startEditing(msg)} aria-label={t('messages.edit')} className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hover:bg-gray-100 dark:hover:bg-[#282a2c] transition-colors" title={t('messages.edit')}><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => setMessageToDelete(msg.id)} aria-label={t('messages.delete')} className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" title={t('messages.delete')}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        <div className={`flex flex-col max-w-[80%] md:max-w-[65%] ${isMe ? "items-end" : "items-start"}`}>
                        <div className={`max-w-full rounded-2xl px-4 sm:px-5 py-3 text-base flex flex-col gap-2 break-words ${isMe ? "bg-indigo-600 dark:bg-indigo-500 text-white rounded-tr-sm shadow-sm" : "bg-white dark:bg-[#282a2c] border border-gray-100 dark:border-[#333537] text-gray-800 dark:text-gray-100 rounded-tl-sm shadow-sm"}`}>
                          {msg.fileUrl && (
                            msg.fileType?.includes("image") ? (
                              <img src={msg.fileUrl} alt="Fichier" className="rounded-xl max-h-60 object-cover cursor-pointer" onClick={() => window.open(msg.fileUrl)} />
                            ) : (
                              <a href={msg.fileUrl} target="_blank" rel="noreferrer" className={`flex items-center gap-3 p-3 rounded-xl ${isMe ? "bg-indigo-700/50 text-white" : "bg-gray-100 dark:bg-[#1e1f20] text-gray-700 dark:text-gray-300"}`}>
                                <FileText className="w-5 h-5" />
                                <span className="truncate max-w-[200px] font-medium">{msg.fileName || t('messages.fileDefaultName')}</span>
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
                              <button onClick={() => handleSaveEdit(msg.id)} aria-label={t('messages.saveEdit')} className="p-1.5 hover:bg-white/20 rounded-full transition-colors"><Check className="w-4 h-4" /></button>
                              <button onClick={() => setEditingMessageId(null)} aria-label={t('messages.cancelEdit')} className="p-1.5 hover:bg-white/20 rounded-full transition-colors"><X className="w-4 h-4" /></button>
                            </div>
                          ) : (
                            msg.text && (
                              <span className="leading-relaxed relative">
                                {msg.text}
                                {msg.isEdited && <span className="text-[10px] opacity-60 ml-2 italic">{t('messages.edited')}</span>}
                              </span>
                            )
                          )}
                        </div>
                        {/* Heure d'envoi (aucune n'était affichée) */}
                        {sentAt && <span className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 px-1">{sentAt}</span>}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {selectedFile && (
                  <div className="px-5 py-3 bg-indigo-50 dark:bg-[#282a2c] border-t border-indigo-100 dark:border-[#333537] flex items-center justify-between text-sm text-indigo-700 dark:text-indigo-400 font-medium">
                    <span className="flex items-center gap-2 truncate"><Paperclip className="w-4 h-4" /> {selectedFile.name}</span>
                    <button onClick={() => setSelectedFile(null)} aria-label={t('messages.removeFile')} className="p-1 hover:bg-indigo-100 dark:hover:bg-[#1e1f20] rounded-md transition-colors"><X className="w-4 h-4" /></button>
                  </div>
                )}

                <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white dark:bg-[#1e1f20] border-t border-gray-50 dark:border-[#333537] flex gap-2 sm:gap-3 items-center">
                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                  <Button type="button" variant="ghost" onClick={() => fileInputRef.current.click()} aria-label={t('messages.attachFile')} title={t('messages.attachFile')} className="text-gray-400 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#282a2c] hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full h-12 w-12 p-0 shrink-0 transition-colors">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Input 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    placeholder={t('messages.inputPlaceholder', { name: activeChat.name })} 
                    className="h-12 rounded-xl bg-gray-50 dark:bg-[#282a2c] dark:text-gray-100 dark:placeholder-gray-500 border-transparent flex-1 text-base px-5 focus-visible:ring-indigo-500/50" 
                  />
                  <Button type="submit" aria-label={t('messages.send')} disabled={(!newMessage.trim() && !selectedFile) || isSending} className="h-12 w-12 p-0 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl shrink-0 transition-colors">
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
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('messages.emptyState.title')}</p>
              <p className="text-sm mt-1 px-6 text-center">{t('messages.emptyState.desc')}</p>
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
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('messages.rejectModal.title')}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              {t('messages.rejectModal.desc')}
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowRejectModal(false)} className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#282a2c] rounded-xl font-medium">
                {t('messages.rejectModal.cancel')}
              </Button>
              <Button onClick={confirmRejectRequest} className="bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium">
                {t('messages.rejectModal.confirm')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODALE : RETIRER UN BINÔME                         */}
      {/* ==================================================== */}
      {showRemoveModal && activeChat && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in p-4">
          <div role="dialog" aria-modal="true" className="bg-white dark:bg-[#1e1f20] rounded-3xl p-6 shadow-2xl w-full max-w-sm border border-gray-100 dark:border-[#333537] animate-in zoom-in-95">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <UserMinus className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('messages.removeModal.title', { name: activeChat.name })}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              {t('messages.removeModal.desc')}
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowRemoveModal(false)} className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#282a2c] rounded-xl font-medium">
                {t('messages.removeModal.cancel')}
              </Button>
              <Button onClick={confirmRemoveBuddy} className="bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium">
                {t('messages.removeModal.confirm')}
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
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('messages.deleteModal.title')}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              {t('messages.deleteModal.desc')}
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setMessageToDelete(null)} className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#282a2c] rounded-xl font-medium">
                {t('messages.deleteModal.cancel')}
              </Button>
              <Button onClick={confirmDeleteMessage} className="bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium">
                {t('messages.deleteModal.confirm')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
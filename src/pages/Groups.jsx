import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  addDoc, arrayRemove, arrayUnion, collection, deleteDoc, deleteField, doc, limit, onSnapshot,
  orderBy, query, serverTimestamp, setDoc, updateDoc, where,
} from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ArrowLeft, Crown, LogOut, PenTool, Plus, Send, Trash2, UsersRound, X, Loader2, Video } from "lucide-react";
import { callUrl, studentUrl } from "@/lib/pairs";
import { db } from "../firebase/config";
import { useAuth } from "@/lib/AuthContext";
import { useRequests, buildRelations } from "@/hooks/useRequests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Groupes de révision (3 à 6 étudiants) : le créateur ajoute ses binômes, le groupe a sa
// discussion (groups/<id>/messages) et son tableau blanc (whiteboards/grp-<id>).
export const MAX_GROUP_MEMBERS = 6;
const MESSAGES_SHOWN = 100;

export default function Groups() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const activeId = new URLSearchParams(location.search).get("id");
  const setActiveId = (id) => navigate(id ? `/Groups?id=${id}` : "/Groups");

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ name: "", subject: "" });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    return onSnapshot(
      query(collection(db, "groups"), where("members", "array-contains", user.uid)),
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        list.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
        setGroups(list);
        setLoading(false);
      },
      (error) => { console.error(error); setLoading(false); }
    );
  }, [user?.uid]);

  const active = groups.find((g) => g.id === activeId) || null;

  const createGroup = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return;
    setCreating(true);
    try {
      const ref = doc(collection(db, "groups"));
      await setDoc(ref, {
        name: name.slice(0, 60),
        subject: form.subject.trim().slice(0, 60),
        owner_uid: user.uid,
        members: [user.uid],
        member_names: { [user.uid]: user.full_name || user.displayName || "Moi" },
        createdAt: serverTimestamp(),
      });
      setCreateOpen(false);
      setForm({ name: "", subject: "" });
      setActiveId(ref.id);
      toast.success(t("groups.toast.created"));
    } catch (error) {
      console.error(error);
      toast.error(t("groups.toast.error"));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100dvh-164px-env(safe-area-inset-bottom,0px))] md:h-[calc(100dvh-196px-env(safe-area-inset-bottom,0px))] lg:h-[calc(100vh-64px)] flex flex-col animate-in fade-in duration-500">
      <div className={`${active ? "hidden lg:flex" : "flex"} items-center justify-between gap-3 mb-4`}>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{t("groups.title")}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("groups.subtitle")}</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shrink-0">
          <Plus className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">{t("groups.create")}</span>
        </Button>
      </div>

      <div className="flex-1 min-h-0 flex gap-4">
        {/* Liste des groupes */}
        <div className={`${active ? "hidden lg:flex" : "flex"} w-full lg:w-[300px] shrink-0 flex-col rounded-2xl bg-white dark:bg-ink-900 border border-gray-100 dark:border-ink-700 overflow-hidden`}>
          {loading ? (
            <div className="p-6"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>
          ) : groups.length === 0 ? (
            <div className="p-6 text-center my-auto">
              <UsersRound className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="font-semibold text-gray-900 dark:text-white">{t("groups.emptyTitle")}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("groups.emptyDesc")}</p>
              <Button onClick={() => setCreateOpen(true)} variant="outline" className="rounded-xl mt-4">
                <Plus className="w-4 h-4 mr-2" /> {t("groups.create")}
              </Button>
            </div>
          ) : (
            <ul className="overflow-y-auto p-2 space-y-1">
              {groups.map((g) => (
                <li key={g.id}>
                  <button
                    onClick={() => setActiveId(g.id)}
                    className={`w-full text-left p-3 rounded-xl transition-colors ${g.id === activeId ? "bg-indigo-50 dark:bg-indigo-500/10" : "hover:bg-gray-50 dark:hover:bg-ink-800"}`}
                  >
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{g.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {[g.subject, t("groups.memberCount", { count: g.members?.length || 1 })].filter(Boolean).join(" · ")}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Groupe ouvert */}
        <div className={`${active ? "flex" : "hidden lg:flex"} flex-1 min-w-0 flex-col rounded-2xl bg-white dark:bg-ink-900 border border-gray-100 dark:border-ink-700 overflow-hidden`}>
          {active ? (
            <GroupView key={active.id} group={active} user={user} onBack={() => setActiveId(null)} t={t} lang={i18n.language} />
          ) : (
            <div className="m-auto text-center p-8 text-gray-500 dark:text-gray-400">
              <UsersRound className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">{t("groups.pick")}</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="rounded-3xl dark:bg-ink-900 dark:border-ink-700">
          <DialogHeader>
            <DialogTitle>{t("groups.createTitle")}</DialogTitle>
            <DialogDescription>{t("groups.createDesc")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={createGroup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="group-name">{t("groups.name")}</Label>
              <Input id="group-name" required maxLength={60} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t("groups.namePlaceholder")} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="group-subject">{t("groups.subject")}</Label>
              <Input id="group-subject" maxLength={60} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder={t("groups.subjectPlaceholder")} className="rounded-xl" />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={creating || !form.name.trim()} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white">
                {creating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} {t("groups.createButton")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function GroupView({ group, user, onBack, t, lang }) {
  const navigate = useNavigate();
  const isOwner = group.owner_uid === user.uid;
  const names = group.member_names || {};
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [toAdd, setToAdd] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);

  const requests = useRequests(isOwner ? user.uid : null);
  const addable = useMemo(() => [...buildRelations(requests).entries()]
    .filter(([uid, r]) => r.status === "buddy" && !group.members.includes(uid))
    .map(([uid, r]) => ({ uid, name: r.name })), [requests, group.members]);

  useEffect(() => onSnapshot(
    query(collection(db, "groups", group.id, "messages"), orderBy("createdAt", "desc"), limit(MESSAGES_SHOWN)),
    (snap) => setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data({ serverTimestamps: "estimate" }) })).reverse()),
    (error) => console.error(error)
  ), [group.id]);

  useEffect(() => { endRef.current?.scrollIntoView({ block: "end" }); }, [messages.length]);

  const send = async (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setText("");
    try {
      await addDoc(collection(db, "groups", group.id, "messages"), {
        senderUid: user.uid,
        senderName: names[user.uid] || user.full_name || "",
        text: value.slice(0, 4000),
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(error);
      setText(value);
      toast.error(t("groups.toast.error"));
    }
  };

  const run = async (action, success) => {
    setBusy(true);
    try {
      await action();
      if (success) toast.success(success);
    } catch (error) {
      console.error(error);
      toast.error(t("groups.toast.error"));
    } finally {
      setBusy(false);
    }
  };

  const addMember = () => {
    const buddy = addable.find((b) => b.uid === toAdd);
    if (!buddy) return;
    run(() => updateDoc(doc(db, "groups", group.id), {
      members: arrayUnion(buddy.uid),
      [`member_names.${buddy.uid}`]: buddy.name || "",
    }).then(() => setToAdd("")), t("groups.toast.added", { name: buddy.name }));
  };
  const removeMember = (uid) => run(() => updateDoc(doc(db, "groups", group.id), {
    members: arrayRemove(uid), [`member_names.${uid}`]: deleteField(),
  }), t("groups.toast.removed", { name: names[uid] || "" }));
  const leave = () => {
    if (!window.confirm(t("groups.leaveConfirm", { name: group.name }))) return;
    run(() => updateDoc(doc(db, "groups", group.id), {
      members: arrayRemove(user.uid), [`member_names.${user.uid}`]: deleteField(),
    }).then(onBack), t("groups.toast.left"));
  };
  const remove = () => {
    if (!window.confirm(t("groups.deleteConfirm", { name: group.name }))) return;
    run(() => deleteDoc(doc(db, "groups", group.id)).then(onBack), t("groups.toast.deleted"));
  };

  const formatTime = (ts) => (ts?.toDate ? ts.toDate().toLocaleString(lang, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "");

  return (
    <>
      {/* En-tête */}
      <div className="p-4 border-b border-gray-100 dark:border-ink-700 space-y-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="lg:hidden rounded-xl shrink-0" aria-label={t("groups.back")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-lg text-gray-900 dark:text-white truncate">{group.name}</h2>
            {group.subject && <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{group.subject}</p>}
          </div>
          <Button onClick={() => navigate(callUrl("group", group.id))} className="rounded-xl shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white" aria-label={t("call.start")} title={t("call.start")}>
            <Video className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">{t("call.start")}</span>
          </Button>
          <Button onClick={() => navigate(`/Whiteboard?sessionId=grp-${group.id}`)} variant="outline" className="rounded-xl shrink-0">
            <PenTool className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">{t("groups.whiteboard")}</span>
          </Button>
          {isOwner ? (
            <Button variant="ghost" size="icon" disabled={busy} onClick={remove} className="rounded-xl text-red-500 shrink-0" aria-label={t("groups.delete")} title={t("groups.delete")}>
              <Trash2 className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" disabled={busy} onClick={leave} className="rounded-xl text-red-500 shrink-0" aria-label={t("groups.leave")} title={t("groups.leave")}>
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {group.members.map((uid) => (
            <span key={uid} className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-ink-800 text-gray-700 dark:text-gray-300">
              {uid === group.owner_uid && <Crown className="w-3 h-3 text-amber-500" aria-label={t("groups.owner")} />}
              {uid === user.uid ? t("groups.you") : (
                <Link to={studentUrl(uid)} className="hover:text-brand-600 dark:hover:text-brand-300 hover:underline underline-offset-2" title={t("student.viewProfile")}>{names[uid] || "…"}</Link>
              )}
              {isOwner && uid !== user.uid && (
                <button onClick={() => removeMember(uid)} disabled={busy} aria-label={t("groups.remove", { name: names[uid] || "" })} className="ml-0.5 text-gray-400 hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>

        {isOwner && group.members.length < MAX_GROUP_MEMBERS && (
          addable.length > 0 ? (
            <div className="flex gap-2">
              <Select value={toAdd} onValueChange={setToAdd}>
                <SelectTrigger className="rounded-xl h-9 text-sm" aria-label={t("groups.addPlaceholder")}>
                  <SelectValue placeholder={t("groups.addPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {addable.map((b) => <SelectItem key={b.uid} value={b.uid}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button size="sm" onClick={addMember} disabled={!toAdd || busy} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white h-9">
                {t("groups.add")}
              </Button>
            </div>
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400">{t("groups.noBuddyToAdd")}</p>
          )
        )}
      </div>

      {/* Discussion */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-8">{t("groups.noMessages")}</p>}
        {messages.map((m) => {
          const mine = m.senderUid === user.uid;
          return (
            <div key={m.id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
              {!mine && <span className="text-[11px] text-gray-500 dark:text-gray-400 mb-0.5 px-1">{names[m.senderUid] || m.senderName}</span>}
              <div className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words ${mine ? "bg-indigo-600 text-white rounded-br-md" : "bg-gray-100 dark:bg-ink-800 text-gray-900 dark:text-gray-100 rounded-bl-md"}`}>
                {m.text}
              </div>
              <span className="text-[10px] text-gray-400 mt-0.5 px-1">{formatTime(m.createdAt)}</span>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <form onSubmit={send} className="p-3 border-t border-gray-100 dark:border-ink-700 flex gap-2">
        <Input value={text} onChange={(e) => setText(e.target.value)} maxLength={4000} placeholder={t("groups.inputPlaceholder")} aria-label={t("groups.inputPlaceholder")} className="rounded-xl" />
        <Button type="submit" disabled={!text.trim()} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white" aria-label={t("groups.send")}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </>
  );
}

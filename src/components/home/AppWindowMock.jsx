import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard, Search, MessageSquare, Calendar, UsersRound, User, PenLine, Eraser, Undo2,
  Paperclip, BadgeCheck, Send, Video,
} from "lucide-react";
import { LogoMark } from "@/components/Logo";

// Maquette illustrative de l'application (pas une capture) : barre latérale, tableau blanc
// partagé en train d'être dessiné, et conversation avec le binôme.
const NAV = [
  ["Dashboard", LayoutDashboard], ["Search", Search], ["Messages", MessageSquare],
  ["Sessions", Calendar], ["Groups", UsersRound], ["Profile", User],
];

export default function AppWindowMock() {
  const { t } = useTranslation();
  return (
    <div className="relative rounded-[1.25rem] sm:rounded-[1.75rem] p-1.5 sm:p-2 bg-gradient-to-b from-white/20 to-white/[0.03] shadow-[0_40px_120px_-20px_rgba(100,56,245,0.55)]" aria-hidden="true">
      <div className="rounded-[1rem] sm:rounded-[1.4rem] overflow-hidden bg-ink-925 border border-white/10">
        {/* Barre de fenêtre */}
        <div className="h-10 sm:h-11 flex items-center gap-3 px-3 sm:px-4 border-b border-white/[0.07] bg-ink-900">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-coral-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-lime-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-brand-400" />
          </div>
          <div className="mx-auto h-6 px-3 rounded-lg bg-white/[0.06] text-[11px] text-white/50 flex items-center font-medium">buddyetude.com/Whiteboard</div>
          <div className="hidden sm:flex -space-x-2">
            <span className="w-6 h-6 rounded-full bg-gradient-to-br from-coral-400 to-purple-500 ring-2 ring-ink-900 text-[9px] font-bold text-white flex items-center justify-center">LM</span>
            <span className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 ring-2 ring-ink-900 text-[9px] font-bold text-white flex items-center justify-center">CA</span>
          </div>
        </div>

        <div className="flex h-[280px] sm:h-[440px] lg:h-[520px]">
          {/* Barre latérale */}
          <div className="hidden md:flex w-48 shrink-0 flex-col gap-1 p-3 border-r border-white/[0.07] bg-ink-900/60">
            <div className="flex items-center gap-2 px-2 pb-4 pt-1">
              <LogoMark className="w-7 h-7" />
              <span className="font-display font-extrabold text-white text-sm">Buddy<span className="text-brand-300">Etude</span></span>
            </div>
            {NAV.map(([key, Icon]) => (
              <div key={key} className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12px] font-semibold ${
                key === "Sessions" ? "bg-gradient-to-r from-brand-600 to-purple-600 text-white" : "text-white/50"
              }`}>
                <Icon className="w-3.5 h-3.5" /> {t(`layout.nav.${key}`)}
              </div>
            ))}
          </div>

          {/* Tableau blanc */}
          <div className="relative flex-1 min-w-0 bg-[radial-gradient(circle,rgba(152,125,255,0.16)_1px,transparent_1px)] [background-size:20px_20px]">
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 rounded-xl bg-ink-800/90 border border-white/10 p-1 shadow-lift">
              <span className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center"><PenLine className="w-3.5 h-3.5" /></span>
              <span className="w-7 h-7 rounded-lg text-white/50 flex items-center justify-center"><Eraser className="w-3.5 h-3.5" /></span>
              <span className="w-7 h-7 rounded-lg text-white/50 flex items-center justify-center"><Undo2 className="w-3.5 h-3.5" /></span>
              <span className="mx-1 w-px h-5 bg-white/10" />
              {["bg-white", "bg-brand-400", "bg-coral-400", "bg-lime-300"].map((c) => (
                <span key={c} className={`w-4 h-4 rounded-full ${c} mx-0.5 ${c === "bg-brand-400" ? "ring-2 ring-white/70 ring-offset-1 ring-offset-ink-800" : ""}`} />
              ))}
            </div>

            <svg viewBox="0 0 600 440" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full">
              <path d="M70 360 H540 M100 390 V80" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <motion.path d="M120 110 Q 230 560 340 120" fill="none" stroke="#987DFF" strokeWidth="5" strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.2, delay: 1, ease: "easeInOut" }} />
              <motion.text x="370" y="130" fill="white" style={{ font: "italic 600 34px 'Bricolage Grotesque', serif" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }}>∫ x² dx</motion.text>
              <motion.text x="390" y="180" fill="#BBACFF" style={{ font: "italic 700 34px 'Bricolage Grotesque', serif" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.9 }}>= x³/3 + C</motion.text>
              <motion.path d="M370 196 C 420 208, 480 190, 560 200" fill="none" stroke="#FF8A66" strokeWidth="4" strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 3.4, duration: 0.7 }} />
              <motion.circle cx="230" cy="330" r="30" fill="none" stroke="#FF8A66" strokeWidth="3" strokeDasharray="6 6"
                initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 4, duration: 0.5 }} style={{ transformOrigin: "230px 330px" }} />
            </svg>

            <motion.div className="absolute left-0 top-0" animate={{ x: [260, 200, 330, 260], y: [200, 150, 230, 200] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" className="-rotate-12 drop-shadow"><path d="M4 2l16 9-7 2-3 7z" fill="#FF6B42" stroke="white" strokeWidth="1.5" strokeLinejoin="round" /></svg>
              <span className="ml-4 inline-block text-[10px] font-bold text-white bg-coral-500 px-1.5 py-0.5 rounded-md">Léa</span>
            </motion.div>
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-white/50 bg-ink-800/80 border border-white/10 rounded-lg px-2.5 py-1">{t("landing.story.page")}</span>
          </div>

          {/* Conversation */}
          <div className="hidden lg:flex w-72 shrink-0 flex-col border-l border-white/[0.07] bg-ink-900/60">
            <div className="flex items-center gap-2.5 p-3.5 border-b border-white/[0.07]">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-coral-400 to-purple-500 text-white text-xs font-bold flex items-center justify-center">LM</span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white flex items-center gap-1">{t("landing.mock.name")} <BadgeCheck className="w-3.5 h-3.5 text-sky-400" /></p>
                <p className="text-[11px] text-lime-300 font-medium">● {t("landing.story.online")}</p>
              </div>
              <span className="ml-auto w-8 h-8 rounded-lg bg-white/[0.06] text-white/70 flex items-center justify-center"><Video className="w-4 h-4" /></span>
            </div>
            <div className="flex-1 p-3.5 space-y-2.5 text-[12px] font-medium">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="w-fit max-w-[85%] rounded-2xl rounded-bl-md bg-white/[0.07] text-white/90 px-3 py-2">{t("landing.mock.chat1")}</motion.div>
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8 }} className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-brand-600 text-white px-3 py-2">{t("landing.mock.chat2")}</motion.div>
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.4 }} className="w-fit rounded-2xl rounded-bl-md bg-white/[0.07] text-white/80 px-3 py-2 flex items-center gap-1.5"><Paperclip className="w-3.5 h-3.5" /> {t("landing.story.file")}</motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }} className="flex items-center gap-2 text-white/40 text-[11px]">
                <span className="flex gap-0.5">{[0, 1, 2].map((i) => <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-white/40" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }} />)}</span>
                {t("landing.story.typing")}
              </motion.div>
            </div>
            <div className="m-3 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-end px-1.5">
              <span className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center"><Send className="w-3.5 h-3.5" /></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

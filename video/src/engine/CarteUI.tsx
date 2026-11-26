// Cartes d'interface (2D) : verre violet foncé, libellés repris du site (src/i18n.js), données fictives.
// Les temps (t, de, tEnvoi…) sont en secondes, relatifs au début du plan.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as chargerMain } from "@remotion/google-fonts/Caveat";
import { C } from "./palette";
import { POLICE_TEXTE, POLICE_TITRE } from "./SousTitre";

const { fontFamily: POLICE_MAIN } = chargerMain("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] });

/* ------------------------------------------------------------------ types */

export type ProfilUI = { nom: string; niveau: string; badges?: string[]; couleur?: string; avance?: string; verifie?: boolean };
export type MessageUI = { t: number; moi?: boolean; auteur?: string; texte: string };
export type TraceUI =
  | { type: "texte"; x: number; y: number; contenu: React.ReactNode; couleur?: string; t: number; duree?: number; taille?: number; auteur?: string }
  | { type: "trait"; d: string; couleur?: string; t: number; duree?: number; largeur?: number; auteur?: string; x?: number; y?: number }
  | { type: "entoure"; cx: number; cy: number; rx: number; ry: number; couleur?: string; t: number; duree?: number; auteur?: string };

export type CarteDef =
  | { type: "recherche"; requete?: string; mode?: "buddy" | "help"; profils: ProfilUI[]; choisi?: number; tChoisi?: number }
  | { type: "demande"; nom: string; message: string; tEnvoi: number; aide?: string }
  | { type: "notif"; titre: string; texte: string; de?: number; icone?: string }
  | { type: "messages"; avec: string; sous?: string; couleur?: string; messages: MessageUI[]; notif?: { t: number; titre: string; texte: string } }
  | { type: "session"; titre: string; avec: string; quand: string; lieu?: string }
  | { type: "tableau"; titre?: string; traces: TraceUI[]; pdf?: { tImport: number }; page?: { t: number }; exporter?: number; mini?: boolean }
  | { type: "groupe"; nom: string; matiere: string; membres: { nom: string; couleur: string; t: number }[] }
  | { type: "calendrier"; blocs: { label: string; t: number }[]; partiel: string }
  | { type: "bilan"; lignes: { titre: string; valeur: string; citron?: boolean; t: number }[] }
  | { type: "chatGenerique"; groupe: string; messages: { auteur: string; texte: string }[]; compteur: number }
  | { type: "decompte"; chiffres?: string[] }
  | { type: "appel"; avec: string; moi: string };

/* ------------------------------------------------------------------ bases */

const useT = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { f, fps, t: f / fps };
};
const entree = (f: number, fps: number, de = 0, damping = 14) => spring({ frame: f - de * fps, fps, config: { damping, stiffness: 160, mass: 0.7 } });
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
/** Texte tapé lettre par lettre (vitesse en caractères par seconde). */
const tape = (texte: string, t: number, de: number, cps = 26) => texte.slice(0, Math.max(0, Math.floor((t - de) * cps)));

export const Verre: React.FC<{ children: React.ReactNode; largeur?: number; style?: React.CSSProperties; lien?: number }> = ({ children, largeur = 820, style, lien = 0 }) => {
  const { f, fps } = useT();
  const s = entree(f, fps);
  return (
    <div
      style={{
        width: largeur,
        borderRadius: 40,
        padding: 34,
        background: "linear-gradient(160deg, rgba(58,40,150,.78), rgba(24,16,64,.86))",
        border: `2px solid ${lien > 0 ? `rgba(220,244,107,${0.35 + lien * 0.65})` : "rgba(255,255,255,.14)"}`,
        boxShadow: `0 40px 90px rgba(5,3,20,.6), inset 0 1px 0 rgba(255,255,255,.2)${lien > 0 ? `, 0 0 60px rgba(220,244,107,${lien * 0.35})` : ""}`,
        backdropFilter: "blur(18px)",
        color: "#fff",
        fontFamily: POLICE_TEXTE,
        transform: `perspective(1600px) rotateX(${(1 - s) * 18 + 2 * Math.sin(f * 0.03)}deg) rotateY(${1.5 * Math.sin(f * 0.025)}deg) translateY(${(1 - s) * 80}px) scale(${0.9 + 0.1 * s})`,
        opacity: Math.min(1, s * 1.5),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Avatar: React.FC<{ nom: string; couleur?: string; taille?: number }> = ({ nom, couleur = C.violet, taille = 76 }) => (
  <div
    style={{
      width: taille,
      height: taille,
      borderRadius: taille / 2,
      background: couleur,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: POLICE_TITRE,
      fontWeight: 800,
      fontSize: taille * 0.45,
      color: "#fff",
      flexShrink: 0,
      boxShadow: "inset 0 -4px 0 rgba(0,0,0,.18)",
    }}
  >
    {nom[0]}
  </div>
);

const Puce: React.FC<{ children: React.ReactNode; citron?: boolean; style?: React.CSSProperties }> = ({ children, citron, style }) => (
  <span
    style={{
      display: "inline-block",
      padding: "6px 16px",
      borderRadius: 999,
      fontSize: 24,
      fontWeight: 700,
      background: citron ? C.citron : "rgba(255,255,255,.12)",
      color: citron ? "#14102e" : "rgba(255,255,255,.9)",
      marginRight: 10,
      marginTop: 10,
      ...style,
    }}
  >
    {children}
  </span>
);

const Bouton: React.FC<{ children: React.ReactNode; appuye?: number; citron?: boolean; style?: React.CSSProperties }> = ({ children, appuye = 0, citron, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "18px 30px",
      borderRadius: 22,
      fontWeight: 800,
      fontSize: 30,
      background: citron ? C.citron : C.violet,
      color: citron ? "#14102e" : "#fff",
      transform: `scale(${1 - 0.08 * Math.sin(clamp01(appuye) * Math.PI)})`,
      boxShadow: "0 10px 24px rgba(10,6,40,.35)",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Petit doigt qui « tape » sur un bouton (apparaît autour de t). */
const Doigt: React.FC<{ t: number; x: number | string; y: number | string }> = ({ t, x, y }) => {
  const { t: maintenant } = useT();
  const d = maintenant - t;
  if (d < -0.35 || d > 0.45) return null;
  const s = d < 0 ? 1 + d * 0.6 : 1 - Math.min(0.15, d * 0.6);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-30%, -10%) scale(${s})`, fontSize: 70, filter: "drop-shadow(0 8px 10px rgba(0,0,0,.4))", zIndex: 5 }}>
      👆
      {d >= 0 && d < 0.3 && <div style={{ position: "absolute", left: -10, top: -14, width: 60, height: 60, borderRadius: 30, border: `4px solid ${C.citron}`, opacity: 1 - d / 0.3, transform: `scale(${1 + d * 3})` }} />}
    </div>
  );
};

/* ------------------------------------------------------------------ cartes */

const Recherche: React.FC<Extract<CarteDef, { type: "recherche" }>> = ({ requete, mode = "buddy", profils, choisi, tChoisi = 999 }) => {
  const { f, fps, t } = useT();
  const saisie = requete ? tape(requete, t, 0.4) : "";
  const finSaisie = requete ? 0.4 + requete.length / 26 + 0.2 : 0.2;
  return (
    <Verre>
      <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
        {(["buddy", "help"] as const).map((m) => (
          <div key={m} style={{ flex: 1, textAlign: "center", padding: "14px 0", borderRadius: 18, fontWeight: 800, fontSize: 26, background: m === mode ? "#fff" : "rgba(255,255,255,.08)", color: m === mode ? C.violet : "rgba(255,255,255,.7)" }}>
            {m === "buddy" ? "Trouver un binôme" : "Trouver de l'aide"}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 24px", borderRadius: 22, background: "rgba(10,6,40,.45)", border: "2px solid rgba(255,255,255,.14)", fontSize: 32, marginBottom: 10 }}>
        <span style={{ opacity: 0.7 }}>🔍</span>
        <span style={{ color: saisie ? "#fff" : "rgba(255,255,255,.45)", fontWeight: 600 }}>
          {saisie || "Filtrer par matière (ex: Droit, Cinéma...)"}
          {requete && t < finSaisie && <span style={{ opacity: f % 16 < 8 ? 1 : 0 }}>|</span>}
        </span>
      </div>
      {profils.map((p, i) => {
        const s = entree(f, fps, finSaisie + i * 0.18);
        const actif = choisi === i && t >= tChoisi;
        return (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 20,
              alignItems: "flex-start",
              marginTop: 18,
              padding: 22,
              borderRadius: 28,
              background: actif ? "rgba(220,244,107,.12)" : "rgba(255,255,255,.06)",
              border: `2px solid ${actif ? C.citron : "transparent"}`,
              opacity: s,
              transform: `translateY(${(1 - s) * 30}px) scale(${actif ? 1.02 : 1})`,
            }}
          >
            <Avatar nom={p.nom} couleur={p.couleur} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: POLICE_TITRE, fontSize: 38, fontWeight: 800 }}>
                {p.nom} {p.verifie && <span style={{ color: C.citron, fontSize: 30 }}>✓</span>}
              </div>
              <div style={{ fontSize: 26, opacity: 0.75, marginTop: 2 }}>{p.niveau}</div>
              <div>
                {p.avance && <Puce citron>Avancé</Puce>}
                {p.avance && <Puce>Peut t'aider en {p.avance}</Puce>}
                {(p.badges ?? []).map((b) => (
                  <Puce key={b}>{b}</Puce>
                ))}
              </div>
            </div>
            {i === 0 && (
              <Bouton appuye={(t - tChoisi) * 3} style={{ fontSize: 24, padding: "14px 20px", alignSelf: "center" }}>
                {mode === "help" ? "Demander de l'aide" : "Contacter"}
              </Bouton>
            )}
          </div>
        );
      })}
    </Verre>
  );
};

const Demande: React.FC<Extract<CarteDef, { type: "demande" }>> = ({ nom, message, tEnvoi, aide }) => {
  const { t } = useT();
  const envoye = t >= tEnvoi + 0.25;
  return (
    <div style={{ position: "relative" }}>
      <Verre>
        <div style={{ fontFamily: POLICE_TITRE, fontWeight: 800, fontSize: 44 }}>{aide ? "Demander de l'aide" : "Proposer une session"}</div>
        <div style={{ fontSize: 27, opacity: 0.78, marginTop: 8 }}>
          {aide ? <>Explique à <b>{nom}</b> sur quoi tu bloques : un chapitre, un exercice, une notion…</> : <>Envoyez un petit mot à <b>{nom}</b> pour vous présenter et proposer d'étudier ensemble.</>}
        </div>
        {aide && <Puce citron style={{ marginTop: 18 }}>Matière : {aide}</Puce>}
        <div style={{ marginTop: 22, minHeight: 170, padding: 24, borderRadius: 22, background: "rgba(10,6,40,.45)", border: "2px solid rgba(255,255,255,.14)", fontSize: 32, lineHeight: 1.35 }}>
          {tape(message, t, 0.5, 30)}
          {t < tEnvoi && <span style={{ opacity: Math.floor(t * 4) % 2 ? 1 : 0 }}>|</span>}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 14, marginTop: 24 }}>
          <Bouton style={{ background: "rgba(255,255,255,.1)" }}>Annuler</Bouton>
          <Bouton appuye={(t - tEnvoi) * 3} citron={envoye}>
            {envoye ? "✓ Envoyée" : "Envoyer ma demande"}
          </Bouton>
        </div>
      </Verre>
      <Doigt t={tEnvoi} x={640} y={420} />
      {envoye && <Toast titre={aide ? "Demande d'aide envoyée !" : "Demande envoyée avec succès !"} de={tEnvoi + 0.3} style={{ position: "absolute", left: 40, right: 40, top: -150 }} />}
    </div>
  );
};

export const Toast: React.FC<{ titre: string; texte?: string; de?: number; icone?: string; style?: React.CSSProperties }> = ({ titre, texte, de = 0, icone = "🎉", style }) => {
  const { f, fps } = useT();
  const s = entree(f, fps, de, 11);
  if (f < de * fps) return null;
  return (
    <div
      style={{
        display: "flex",
        gap: 18,
        alignItems: "center",
        padding: "22px 28px",
        borderRadius: 30,
        background: "#ffffff",
        color: "#14102e",
        fontFamily: POLICE_TEXTE,
        boxShadow: `0 30px 60px rgba(5,3,20,.5), 0 0 0 4px ${C.citron}`,
        transform: `translateY(${(1 - s) * -60}px) scale(${0.85 + 0.15 * s})`,
        opacity: Math.min(1, s * 1.4),
        ...style,
      }}
    >
      <div style={{ fontSize: 50 }}>{icone}</div>
      <div>
        <div style={{ fontWeight: 800, fontSize: 32 }}>{titre}</div>
        {texte && <div style={{ fontSize: 26, opacity: 0.75, marginTop: 2 }}>{texte}</div>}
      </div>
    </div>
  );
};

const Messages: React.FC<Extract<CarteDef, { type: "messages" }>> = ({ avec, sous = "Binôme d'étude", couleur = "#b0457a", messages, notif }) => {
  const { f, fps, t } = useT();
  return (
    <div style={{ position: "relative" }}>
      <Verre style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 18, alignItems: "center", padding: "26px 30px", background: "rgba(10,6,40,.35)", borderBottom: "2px solid rgba(255,255,255,.08)" }}>
          <Avatar nom={avec} couleur={couleur} taille={70} />
          <div>
            <div style={{ fontFamily: POLICE_TITRE, fontWeight: 800, fontSize: 36 }}>{avec}</div>
            <div style={{ fontSize: 24, color: C.citron, fontWeight: 700 }}>{sous}</div>
          </div>
          <div style={{ marginLeft: "auto", fontSize: 24, padding: "10px 18px", borderRadius: 16, background: "rgba(255,255,255,.1)", fontWeight: 700 }}>Ouvrir le Tableau Blanc</div>
        </div>
        <div style={{ padding: "24px 30px 30px", display: "flex", flexDirection: "column", gap: 16, minHeight: 360 }}>
          {messages.map((m, i) => {
            const attente = !m.moi && t >= m.t - 0.7 && t < m.t;
            if (t < m.t && !attente) return null;
            const s = entree(f, fps, m.t, 12);
            return (
              <div key={i} style={{ alignSelf: m.moi ? "flex-end" : "flex-start", maxWidth: "80%" }}>
                {m.auteur && !m.moi && <div style={{ fontSize: 22, opacity: 0.65, marginLeft: 12, marginBottom: 4 }}>{m.auteur}</div>}
                <div
                  style={{
                    padding: "18px 24px",
                    borderRadius: 30,
                    borderBottomRightRadius: m.moi ? 8 : 30,
                    borderBottomLeftRadius: m.moi ? 30 : 8,
                    background: m.moi ? C.violet : "rgba(255,255,255,.14)",
                    fontSize: 32,
                    lineHeight: 1.3,
                    transform: attente ? undefined : `scale(${0.8 + 0.2 * s})`,
                    transformOrigin: m.moi ? "100% 100%" : "0% 100%",
                    opacity: attente ? 1 : s,
                  }}
                >
                  {attente ? <span style={{ letterSpacing: 6, opacity: 0.7 }}>{"•••".slice(0, 1 + (Math.floor(t * 6) % 3))}</span> : m.texte}
                </div>
              </div>
            );
          })}
        </div>
      </Verre>
      {notif && <Toast titre={notif.titre} texte={notif.texte} de={notif.t} style={{ position: "absolute", left: 30, right: 30, top: -170 }} />}
    </div>
  );
};

const Session: React.FC<Extract<CarteDef, { type: "session" }>> = ({ titre, avec, quand, lieu }) => {
  const { f, fps } = useT();
  const lignes = [
    ["📅", quand],
    ["💻", lieu ?? "En ligne (Tableau blanc)"],
    ["🎥", "Appel vidéo inclus"],
    ["✉️", "Rappel par e-mail la veille et 1 h avant"],
  ];
  return (
    <Verre lien={entree(f, fps, 1.2)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Puce citron style={{ marginTop: 0 }}>À venir</Puce>
        <span style={{ fontSize: 24, opacity: 0.7 }}>Sessions d'étude</span>
      </div>
      <div style={{ fontFamily: POLICE_TITRE, fontWeight: 800, fontSize: 52, marginTop: 18 }}>{titre}</div>
      <div style={{ fontSize: 28, opacity: 0.8, marginTop: 4 }}>Avec {avec}</div>
      <div style={{ marginTop: 22 }}>
        {lignes.map(([i, l], k) => {
          const s = entree(f, fps, 0.3 + k * 0.2);
          return (
            <div key={k} style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 30, padding: "10px 0", opacity: s, transform: `translateX(${(1 - s) * 40}px)` }}>
              <span>{i}</span>
              <span>{l}</span>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 14, marginTop: 22 }}>
        <Bouton>Rejoindre l'appel vidéo</Bouton>
        <Bouton style={{ background: "rgba(255,255,255,.1)", fontSize: 26 }}>Ajouter à mon agenda</Bouton>
      </div>
    </Verre>
  );
};

const COULEURS_AUTEURS: Record<string, string> = { Camille: "#7a55ff", Léa: "#e8558f", Hugo: "#2f9d7e", Sarah: "#e0a33a", Yanis: "#3d4fa8", Inès: "#a98bff" };

const Tableau: React.FC<Extract<CarteDef, { type: "tableau" }>> = ({ titre = "Tableau blanc", traces, pdf, page, exporter, mini }) => {
  const { t } = useT();
  const pdfVisible = pdf && t >= pdf.tImport + 1.4;
  const numPage = page && t >= page.t ? 2 : 1;
  const largeur = mini ? 700 : 820;
  return (
    <div style={{ position: "relative" }}>
      <Verre largeur={largeur} style={{ padding: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, fontSize: 24, fontWeight: 700 }}>
          <span style={{ fontFamily: POLICE_TITRE, fontSize: 32, fontWeight: 800, marginRight: 8 }}>{titre}</span>
          {["✏️", "T", "🧽"].map((i) => (
            <span key={i} style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {i}
            </span>
          ))}
          {["#14102e", "#7a55ff", "#e8558f", "#2f9d7e"].map((c) => (
            <span key={c} style={{ width: 26, height: 26, borderRadius: 13, background: c, border: "2px solid rgba(255,255,255,.6)" }} />
          ))}
          <span style={{ marginLeft: "auto", opacity: 0.85 }}>{pdf ? `${numPage} / 3` : "1 / 1"}</span>
        </div>
        <div style={{ position: "relative", width: "100%", aspectRatio: "100 / 70", borderRadius: 22, background: "#fbfaff", overflow: "hidden" }}>
          {pdfVisible && <PagePdf numero={numPage} />}
          <svg viewBox="0 0 100 70" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            {traces.map((tr, i) => {
              if (numPage === 2 && page && tr.t < page.t) return null;
              const p = clamp01((t - tr.t) / (tr.duree ?? 1));
              if (p <= 0 || tr.type === "texte") return null;
              if (tr.type === "trait")
                return (
                  <path key={i} d={tr.d} fill="none" stroke={tr.couleur ?? "#14102e"} strokeWidth={tr.largeur ?? 0.7} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
                );
              return <ellipse key={i} cx={tr.cx} cy={tr.cy} rx={tr.rx} ry={tr.ry} fill="none" stroke={tr.couleur ?? C.citron} strokeWidth={0.8} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />;
            })}
          </svg>
          {traces.map((tr, i) => {
            if (tr.type !== "texte") return null;
            if (numPage === 2 && page && tr.t < page.t) return null;
            const p = clamp01((t - tr.t) / (tr.duree ?? 1));
            if (p <= 0) return null;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${tr.x}%`,
                  top: `${(tr.y / 70) * 100}%`,
                  fontFamily: POLICE_MAIN,
                  fontWeight: 700,
                  fontSize: (tr.taille ?? 1) * (mini ? 44 : 60),
                  color: tr.couleur ?? "#14102e",
                  whiteSpace: "nowrap",
                  clipPath: `inset(-20% ${100 - p * 100}% -20% -5%)`,
                }}
              >
                {/* le « ? » de la police manuscrite ressemble à « ¿ » : on l'écrit dans la police du site */}
                {typeof tr.contenu === "string"
                  ? tr.contenu.split(/(\?)/).map((m, k) => (m === "?" ? <span key={k} style={{ fontFamily: POLICE_TITRE, fontWeight: 800, fontSize: "0.85em" }}>?</span> : m))
                  : tr.contenu}
              </div>
            );
          })}
          {/* étiquettes de nom des auteurs pendant qu'ils écrivent */}
          {traces.map((tr, i) => {
            if (!tr.auteur) return null;
            const p = (t - tr.t) / (tr.duree ?? 1);
            if (p <= 0 || p > 1.2) return null;
            const x = tr.type === "texte" ? tr.x : tr.type === "trait" ? tr.x ?? 50 : 50;
            const y = tr.type === "texte" ? tr.y : tr.type === "trait" ? tr.y ?? 35 : 35;
            return (
              <div key={`a${i}`} style={{ position: "absolute", left: `${x}%`, top: `${(y / 70) * 100 - 9}%`, padding: "4px 12px", borderRadius: 10, background: COULEURS_AUTEURS[tr.auteur] ?? C.violet, color: "#fff", fontSize: 22, fontWeight: 800 }}>
                {tr.auteur}
              </div>
            );
          })}
          {pdf && t >= pdf.tImport && t < pdf.tImport + 1.4 && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(20,12,50,.55)" }}>
              <div style={{ padding: "22px 34px", borderRadius: 22, background: "#fff", color: "#14102e", fontSize: 32, fontWeight: 800 }}>
                Import {Math.min(3, 1 + Math.floor(((t - pdf.tImport) / 1.4) * 3))}/3
              </div>
            </div>
          )}
        </div>
        {pdf && (
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <Bouton appuye={(t - pdf.tImport) * 3} style={{ fontSize: 24, padding: "12px 20px" }}>
              Importer un PDF
            </Bouton>
            {page && (
              <Bouton appuye={(t - page.t) * 3} style={{ fontSize: 24, padding: "12px 20px", background: "rgba(255,255,255,.12)" }}>
                Page suivante →
              </Bouton>
            )}
            {exporter !== undefined && (
              <Bouton appuye={(t - exporter) * 3} citron={t >= exporter} style={{ fontSize: 24, padding: "12px 20px", marginLeft: "auto" }}>
                Exporter
              </Bouton>
            )}
          </div>
        )}
      </Verre>
      {pdf && t >= pdf.tImport + 1.4 && t < pdf.tImport + 3.2 && (
        <Toast titre="3 pages importées : annotez-les !" icone="📄" de={pdf.tImport + 1.4} style={{ position: "absolute", left: 30, right: 30, top: -150 }} />
      )}
      {pdf && page && <Doigt t={page.t} x={360} y={"92%"} />}
      {pdf && <Doigt t={pdf.tImport} x={120} y={"92%"} />}
    </div>
  );
};

/** Fond de page « cours en PDF » : titre et lignes de texte gris. */
const PagePdf: React.FC<{ numero: number }> = ({ numero }) => (
  <div style={{ position: "absolute", inset: 0, padding: "5% 7%" }}>
    <div style={{ width: "46%", height: 18, borderRadius: 6, background: "#5b4fb0", opacity: 0.8 }} />
    <div style={{ width: "28%", height: 10, borderRadius: 5, background: "#9b96c4", marginTop: 10 }} />
    {Array.from({ length: 11 }, (_, i) => (
      <div key={i} style={{ width: `${55 + ((i * 37 + numero * 13) % 40)}%`, height: 8, borderRadius: 4, background: "#c9c6de", marginTop: i % 4 === 3 ? 22 : 12 }} />
    ))}
    <div style={{ position: "absolute", right: "8%", top: "34%", width: "30%", height: "34%", borderRadius: 10, border: "3px solid #c9c6de" }} />
  </div>
);

const Groupe: React.FC<Extract<CarteDef, { type: "groupe" }>> = ({ nom, matiere, membres }) => {
  const { f, fps, t } = useT();
  const presents = membres.filter((m) => t >= m.t);
  const dernier = presents[presents.length - 1];
  return (
    <div style={{ position: "relative" }}>
      <Verre lien={clamp01((presents.length - 1) / 3)}>
        <div style={{ fontSize: 24, opacity: 0.7, fontWeight: 700 }}>Groupes de révision</div>
        <div style={{ fontFamily: POLICE_TITRE, fontWeight: 800, fontSize: 50, marginTop: 6 }}>{tape(nom, t, 0.2, 30)}</div>
        <Puce style={{ marginTop: 12 }}>Matière : {matiere}</Puce>
        <Puce citron style={{ marginTop: 12 }}>
          {presents.length} {presents.length > 1 ? "membres" : "membre"} · jusqu'à 6
        </Puce>
        <div style={{ marginTop: 20 }}>
          {presents.map((m, i) => {
            const s = entree(f, fps, m.t, 11);
            return (
              <div key={m.nom} style={{ display: "flex", alignItems: "center", gap: 18, padding: "12px 0", opacity: s, transform: `translateX(${(1 - s) * 60}px)` }}>
                <Avatar nom={m.nom} couleur={m.couleur} taille={64} />
                <span style={{ fontSize: 32, fontWeight: 700 }}>{m.nom}</span>
                {i === 0 && <span style={{ marginLeft: "auto", fontSize: 22, opacity: 0.65 }}>Créateur du groupe</span>}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
          <Bouton style={{ fontSize: 26 }}>Tableau blanc</Bouton>
          <Bouton style={{ fontSize: 26, background: "rgba(255,255,255,.1)" }}>+ Ajouter</Bouton>
        </div>
      </Verre>
      {dernier && presents.length > 1 && <Toast titre={`${dernier.nom} a rejoint le groupe.`} icone="👋" de={dernier.t} style={{ position: "absolute", left: 40, right: 40, top: -150 }} />}
    </div>
  );
};

const Calendrier: React.FC<Extract<CarteDef, { type: "calendrier" }>> = ({ blocs, partiel }) => {
  const { f, fps } = useT();
  const jours = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  return (
    <Verre>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontFamily: POLICE_TITRE, fontWeight: 800, fontSize: 44 }}>Ma semaine</div>
        <Puce citron style={{ marginTop: 0 }}>{partiel}</Puce>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10, marginTop: 24, height: 520 }}>
        {jours.map((j, k) => (
          <div key={j} style={{ display: "flex", flexDirection: "column", borderRadius: 18, background: k === 6 ? "rgba(224,49,79,.18)" : "rgba(255,255,255,.06)", padding: 8 }}>
            <div style={{ textAlign: "center", fontWeight: 800, fontSize: 24, opacity: 0.8 }}>{j}</div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column-reverse", gap: 6, marginTop: 8 }}>
              {k === 6 &&
                blocs.map((b, i) => {
                  const s = entree(f, fps, b.t, 10);
                  if (s <= 0.01) return null;
                  return (
                    <div key={i} style={{ height: 58, borderRadius: 12, background: [C.violet, C.rose, "#2f7d6b", C.chaud, "#3d4fa8", "#e8558f"][i % 6], fontSize: 18, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", transform: `translateY(${(1 - s) * -400}px)` }}>
                      {b.label}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </Verre>
  );
};

const Bilan: React.FC<Extract<CarteDef, { type: "bilan" }>> = ({ lignes }) => {
  const { f, fps } = useT();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
      {lignes.map((l, i) => {
        const s = entree(f, fps, l.t);
        return (
          <div key={i} style={{ opacity: s, transform: `scale(${0.8 + 0.2 * s})` }}>
            <Verre lien={l.citron ? s : 0} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 30, fontWeight: 800, opacity: 0.75, letterSpacing: ".1em" }}>{l.titre}</div>
              <div style={{ fontFamily: POLICE_TITRE, fontWeight: 800, fontSize: 70, marginTop: 6, color: l.citron ? C.citron : "#fff" }}>{l.valeur}</div>
            </Verre>
          </div>
        );
      })}
    </div>
  );
};

/** Messagerie générique (aucune vraie appli imitée) : groupe qui déborde de messages inutiles. */
const ChatGenerique: React.FC<Extract<CarteDef, { type: "chatGenerique" }>> = ({ groupe, messages, compteur }) => {
  const { t } = useT();
  const visibles = Math.min(messages.length, Math.floor(t * 2.4) + 1);
  const n = Math.round(interpolate(t, [0, 4], [3, compteur], { extrapolateRight: "clamp" }));
  return (
    <div style={{ width: 820, borderRadius: 40, overflow: "hidden", background: "#2a2b33", fontFamily: POLICE_TEXTE, color: "#e9e9ee", boxShadow: "0 40px 90px rgba(5,3,20,.6)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "24px 28px", background: "#34353f" }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, background: "#5a5c6b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34 }}>👥</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 34 }}>{groupe}</div>
          <div style={{ fontSize: 22, opacity: 0.6 }}>5 participants</div>
        </div>
        <div style={{ marginLeft: "auto", minWidth: 70, padding: "8px 16px", borderRadius: 999, background: "#e0314f", color: "#fff", fontWeight: 800, fontSize: 30, textAlign: "center" }}>{n}</div>
      </div>
      <div style={{ height: 560, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 12, padding: "20px 28px", overflow: "hidden" }}>
        {messages.slice(Math.max(0, visibles - 7), visibles).map((m, i) => (
          <div key={`${visibles}-${i}`} style={{ alignSelf: "flex-start", maxWidth: "80%", padding: "12px 20px", borderRadius: 22, background: "#3d3e49" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#9ea3c4" }}>{m.auteur}</div>
            <div style={{ fontSize: 30 }}>{m.texte}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Decompte: React.FC<Extract<CarteDef, { type: "decompte" }>> = ({ chiffres = ["3", "2", "1"] }) => {
  const { f, fps, t } = useT();
  const i = Math.min(chiffres.length - 1, Math.floor(t));
  const s = entree(f, fps, i, 8);
  return (
    <div style={{ width: 420, height: 420, borderRadius: 210, border: `14px solid ${C.citron}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: POLICE_TITRE, fontWeight: 800, fontSize: 260, color: "#fff", transform: `scale(${0.6 + 0.4 * s})`, boxShadow: `0 0 80px rgba(220,244,107,.35)` }}>
      {chiffres[i]}
    </div>
  );
};

const Appel: React.FC<Extract<CarteDef, { type: "appel" }>> = ({ avec, moi }) => (
  <Verre style={{ padding: 24 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
      <span style={{ fontFamily: POLICE_TITRE, fontWeight: 800, fontSize: 38 }}>Appel avec {avec}</span>
      <Puce citron style={{ marginTop: 0, marginLeft: "auto" }}>● En direct</Puce>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      {[avec, moi].map((n, i) => (
        <div key={n} style={{ aspectRatio: "3 / 4", borderRadius: 26, background: i ? "linear-gradient(160deg,#2b2266,#1a1440)" : "linear-gradient(160deg,#4a2a86,#2b1a5a)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <Avatar nom={n} couleur={COULEURS_AUTEURS[n] ?? C.violet} taille={130} />
          <span style={{ fontSize: 30, fontWeight: 800 }}>{n}</span>
        </div>
      ))}
    </div>
    <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 20 }}>
      <Bouton style={{ background: "rgba(255,255,255,.12)" }}>🎙️</Bouton>
      <Bouton style={{ background: "rgba(255,255,255,.12)" }}>📷</Bouton>
      <Bouton>Tableau blanc</Bouton>
      <Bouton style={{ background: "#e0314f" }}>✕</Bouton>
    </div>
    <div style={{ fontSize: 22, opacity: 0.7, textAlign: "center", marginTop: 16 }}>Seuls les participants peuvent rejoindre cet appel. Rien n'est enregistré.</div>
  </Verre>
);

/* ------------------------------------------------------------------ aiguillage */

export const CarteUI: React.FC<{ def: CarteDef }> = ({ def }) => {
  switch (def.type) {
    case "recherche":
      return <Recherche {...def} />;
    case "demande":
      return <Demande {...def} />;
    case "notif":
      return <Toast titre={def.titre} texte={def.texte} de={def.de} icone={def.icone} style={{ width: 800 }} />;
    case "messages":
      return <Messages {...def} />;
    case "session":
      return <Session {...def} />;
    case "tableau":
      return <Tableau {...def} />;
    case "groupe":
      return <Groupe {...def} />;
    case "calendrier":
      return <Calendrier {...def} />;
    case "bilan":
      return <Bilan {...def} />;
    case "chatGenerique":
      return <ChatGenerique {...def} />;
    case "decompte":
      return <Decompte {...def} />;
    case "appel":
      return <Appel {...def} />;
  }
};

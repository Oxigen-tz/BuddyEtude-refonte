import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/AuthContext";

// Erreurs Firebase Auth les plus courantes → message compréhensible
const ERROR_KEYS = {
  "auth/invalid-credential": "auth.errors.invalidCredential",
  "auth/wrong-password": "auth.errors.invalidCredential",
  "auth/user-not-found": "auth.errors.invalidCredential",
  "auth/invalid-email": "auth.errors.invalidEmail",
  "auth/email-already-in-use": "auth.errors.emailInUse",
  "auth/weak-password": "auth.errors.weakPassword",
  "auth/too-many-requests": "auth.errors.tooMany",
  "auth/operation-not-allowed": "auth.errors.providerDisabled",
  "auth/account-exists-with-different-credential": "auth.errors.otherProvider",
  "auth/popup-blocked": "auth.errors.popupBlocked",
  "auth/network-request-failed": "auth.errors.network",
};
const SILENT = ["auth/popup-closed-by-user", "auth/cancelled-popup-request"];

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.5 14.6 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 12s4.2 9.5 9.4 9.5c5.4 0 9-3.8 9-9.2 0-.6-.1-1.1-.2-1.6H12z" />
  </svg>
);
const MicrosoftIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path fill="#F25022" d="M3 3h8.5v8.5H3z" /><path fill="#7FBA00" d="M12.5 3H21v8.5h-8.5z" />
    <path fill="#00A4EF" d="M3 12.5h8.5V21H3z" /><path fill="#FFB900" d="M12.5 12.5H21V21h-8.5z" />
  </svg>
);

export default function AuthDialog({ open, onOpenChange }) {
  const { t } = useTranslation();
  const { loginWithGoogle, loginWithMicrosoft, loginWithEmail, signupWithEmail, resetPassword } = useAuth();
  const [mode, setMode] = useState("login"); // login | signup | reset
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (open) { setError(""); setInfo(""); setPassword(""); }
  }, [open]);

  const run = async (key, fn) => {
    setBusy(key); setError(""); setInfo("");
    try {
      await fn();
    } catch (e) {
      if (!SILENT.includes(e?.code)) setError(t(ERROR_KEYS[e?.code] || "auth.errors.generic"));
    } finally {
      setBusy(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "reset") {
      run("email", async () => {
        await resetPassword(email);
        setInfo(t("auth.resetSent"));
      });
    } else if (mode === "signup") {
      if (!name.trim()) { setError(t("auth.errors.nameRequired")); return; }
      run("email", () => signupWithEmail(name, email, password));
    } else {
      run("email", () => loginWithEmail(email, password));
    }
  };

  const titles = { login: "auth.dialogTitle", signup: "auth.signupTitle", reset: "auth.resetTitle" };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl sm:rounded-3xl max-w-md dark:bg-[#1e1f20] dark:border-[#333537] dark:text-gray-100 p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{t(titles[mode])}</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">{t("auth.dialogDesc")}</DialogDescription>
        </DialogHeader>

        {mode !== "reset" && (
          <div className="grid gap-3 mt-2">
            <Button type="button" variant="outline" disabled={!!busy} onClick={() => run("google", loginWithGoogle)}
              className="h-12 rounded-xl justify-center gap-3 dark:bg-[#131314] dark:border-[#333537] dark:hover:bg-[#282a2c]">
              {busy === "google" ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon />} {t("auth.withGoogle")}
            </Button>
            <Button type="button" variant="outline" disabled={!!busy} onClick={() => run("microsoft", loginWithMicrosoft)}
              className="h-12 rounded-xl justify-center gap-3 dark:bg-[#131314] dark:border-[#333537] dark:hover:bg-[#282a2c]">
              {busy === "microsoft" ? <Loader2 className="w-5 h-5 animate-spin" /> : <MicrosoftIcon />} {t("auth.withMicrosoft")}
            </Button>
            <div className="flex items-center gap-3 my-1 text-xs text-gray-400">
              <span className="h-px flex-1 bg-gray-200 dark:bg-[#333537]" /> {t("auth.or")} <span className="h-px flex-1 bg-gray-200 dark:bg-[#333537]" />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-3">
          {mode === "signup" && (
            <div className="grid gap-1.5">
              <Label htmlFor="auth-name">{t("auth.name")}</Label>
              <Input id="auth-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={40}
                className="h-11 rounded-xl dark:bg-[#131314] dark:border-[#333537]" />
            </div>
          )}
          <div className="grid gap-1.5">
            <Label htmlFor="auth-email">{t("auth.email")}</Label>
            <Input id="auth-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"
              className="h-11 rounded-xl dark:bg-[#131314] dark:border-[#333537]" />
          </div>
          {mode !== "reset" && (
            <div className="grid gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="auth-password">{t("auth.password")}</Label>
                {mode === "login" && (
                  <button type="button" onClick={() => setMode("reset")} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                    {t("auth.forgot")}
                  </button>
                )}
              </div>
              <Input id="auth-password" type="password" required minLength={mode === "signup" ? 8 : undefined} value={password}
                onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "signup" ? "new-password" : "current-password"}
                className="h-11 rounded-xl dark:bg-[#131314] dark:border-[#333537]" />
              {mode === "signup" && <p className="text-xs text-gray-500 dark:text-gray-400">{t("auth.passwordHint")}</p>}
            </div>
          )}

          {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          {info && <p role="status" className="text-sm text-emerald-600 dark:text-emerald-400">{info}</p>}

          <Button type="submit" disabled={!!busy} className="h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white">
            {busy === "email" && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {t(mode === "signup" ? "auth.signupButton" : mode === "reset" ? "auth.resetButton" : "auth.loginButton")}
          </Button>
        </form>

        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          {mode === "login" ? (
            <>{t("auth.noAccount")} <button type="button" onClick={() => setMode("signup")} className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">{t("auth.createAccount")}</button></>
          ) : (
            <button type="button" onClick={() => setMode("login")} className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">{t("auth.backToLogin")}</button>
          )}
        </p>
      </DialogContent>
    </Dialog>
  );
}

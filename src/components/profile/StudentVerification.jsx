import React, { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { BadgeCheck, Loader2, Mail } from "lucide-react";
import { functions } from "../../firebase/config";
import { useAuth } from "@/lib/AuthContext";
import { isSchoolLikeEmail } from "@/lib/safety";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Badge « étudiant vérifié » : code envoyé sur l'adresse de l'établissement (fonctions
// requestStudentVerification / confirmStudentVerification). Seul le domaine est conservé.
export default function StudentVerification({ verifiedDomain, onChange }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  // Connecté avec une adresse d'établissement : elle est proposée d'office (vérification en un clic)
  const loginEmail = isSchoolLikeEmail(user?.email) ? user.email : "";
  const [step, setStep] = useState("idle"); // idle | email | code
  const [email, setEmail] = useState(loginEmail);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  const errorText = (error) => {
    const reason = error?.message;
    return t(`verification.errors.${reason}`, { defaultValue: t("verification.errors.generic") });
  };

  const call = async (name, data, onSuccess) => {
    setBusy(true);
    try {
      const { data: result } = await httpsCallable(functions, name)(data);
      onSuccess(result);
    } catch (error) {
      console.error(error);
      toast.error(errorText(error));
    } finally {
      setBusy(false);
    }
  };

  const sendCode = (e) => {
    e.preventDefault();
    call("requestStudentVerification", { email }, () => {
      setStep("code");
      toast.success(t("verification.codeSent", { email }));
    });
  };
  const confirm = (e) => {
    e.preventDefault();
    call("confirmStudentVerification", { code }, (result) => {
      setStep("idle");
      setCode("");
      setEmail(loginEmail);
      onChange?.(result.domain);
      toast.success(t("verification.done", { domain: result.domain }));
    });
  };
  const remove = () => {
    if (!window.confirm(t("verification.removeConfirm"))) return;
    call("removeStudentVerification", {}, () => onChange?.(null));
  };

  return (
    <section className="p-5 rounded-2xl border border-sky-100 dark:border-sky-500/20 bg-sky-50/50 dark:bg-sky-500/5">
      <div className="flex items-start gap-3">
        <BadgeCheck className="w-6 h-6 text-sky-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white">{t("verification.title")}</h3>
          {verifiedDomain ? (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{t("verification.verified", { domain: verifiedDomain })}</p>
          ) : (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{t("verification.desc")}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{loginEmail ? t("verification.loginEmailHint", { email: loginEmail }) : t("verification.personalHint")}</p>
            </>
          )}

          {!verifiedDomain && step === "idle" && (
            <Button size="sm" onClick={() => setStep("email")} className="mt-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white">
              {t("verification.start")}
            </Button>
          )}

          {step === "email" && (
            <form onSubmit={sendCode} className="mt-3 flex flex-col sm:flex-row gap-2">
              <label htmlFor="school-email" className="sr-only">{t("verification.emailLabel")}</label>
              <Input id="school-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder={t("verification.emailPlaceholder")} className="rounded-xl bg-white dark:bg-ink-950" />
              <Button type="submit" size="sm" disabled={busy || !email} className="rounded-xl bg-sky-600 hover:bg-sky-700 text-white h-10">
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4 mr-1.5" />} {t("verification.sendCode")}
              </Button>
            </form>
          )}

          {step === "code" && (
            <form onSubmit={confirm} className="mt-3 flex flex-col sm:flex-row gap-2">
              <label htmlFor="school-code" className="sr-only">{t("verification.codeLabel")}</label>
              <Input id="school-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} required value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} placeholder="123456" className="rounded-xl bg-white dark:bg-ink-950 tracking-widest" />
              <Button type="submit" size="sm" disabled={busy || code.length !== 6} className="rounded-xl bg-sky-600 hover:bg-sky-700 text-white h-10">
                {busy && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />} {t("verification.confirm")}
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setStep("email")} className="rounded-xl h-10">{t("verification.changeEmail")}</Button>
            </form>
          )}

          {verifiedDomain && (
            <button onClick={remove} disabled={busy} className="mt-2 text-xs text-gray-500 hover:text-red-600 underline underline-offset-2">
              {t("verification.remove")}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

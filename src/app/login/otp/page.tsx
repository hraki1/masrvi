"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { CredentialsService } from "@/services/auth.service";
import Link from "next/link";

const LENGTH = 6;

function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") ?? "";
  const secretCode = searchParams.get("secretCode") ?? "";

  const [digits, setDigits] = useState<string[]>(() => Array(LENGTH).fill(""));

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const verify = useMutation({
    mutationFn: CredentialsService.sendOTPWithCredentials,
  });


  const otpCode = digits.join("");
  // const canSubmit = /^\d{6}$/.test(otpCode) && phone.length > 0 && secretCode.length > 0;

  const focusBox = (i: number) => {
    inputsRef.current[Math.max(0, Math.min(LENGTH - 1, i))]?.focus();
  };

  const setDigit = (i: number, value: string) => {
    setDigits((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });
  };

  const onChange = (i: number, raw: string) => {
    const value = raw.replace(/\D/g, "");
    if (!value) {
      setDigit(i, "");
      return;
    }
    // Take the last typed digit so overwriting a filled box works.
    setDigit(i, value.slice(-1));
    if (i < LENGTH - 1) focusBox(i + 1);
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[i]) {
        setDigit(i, "");
      } else if (i > 0) {
        focusBox(i - 1);
        setDigit(i - 1, "");
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      focusBox(i - 1);
    } else if (e.key === "ArrowRight" && i < LENGTH - 1) {
      focusBox(i + 1);
    }
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, LENGTH);
    if (!pasted) return;
    const next = Array(LENGTH).fill("");
    for (let j = 0; j < pasted.length; j++) next[j] = pasted[j];
    setDigits(next);
    focusBox(Math.min(pasted.length, LENGTH - 1));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if (!canSubmit || verify.isPending) return;
    if (verify.isPending) return;

    verify.mutate(
      { phone, secretCode, otpCode },
      {
        onSuccess: () => {
          // TODO: route to the authenticated area once it exists.
          router.push("/");
        },
        onError: () => {
          setDigits(Array(LENGTH).fill(""));
          focusBox(0);
        },
      },
    );
  };

 
  return (
    <form onSubmit={onSubmit} className="flex flex-col flex-1">
      <div className="flex justify-center gap-2 mb-6" dir="ltr">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            inputMode="numeric"
            maxLength={1}
            type="tel"
            autoFocus={i === 0}
            value={digit}
            onChange={(e) => onChange(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            onPaste={onPaste}
            onFocus={(e) => e.target.select()}
            className="w-12 h-14 text-center bg-slate-100 rounded-xl text-2xl font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-400"
          />
        ))}
      </div>

      {verify.isError ? (
        <p className="text-center text-sm text-red-500 mb-4">
          Code incorrect. Réessayez.
        </p>
      ) : null}

      <div className="text-center mb-4">
        <button type="button" className="text-sm text-slate-600 underline">
          Renvoyer le code
        </button>
      </div>

      <button
        type="submit"
        disabled={verify.isPending}
        className={`w-full rounded-2xl py-4 font-semibold text-lg transition mb-6 ${
          !verify.isPending
            ? "bg-emerald-500 text-white"
            : "bg-emerald-200 text-emerald-700 cursor-not-allowed"
        }`}
      >
        {verify.isPending ? "Validation…" : "Valider"}
      </button>

      <div className="flex-1" />
    </form>
  );
}

export default function OtpPage() {
  return (
    <div className="mx-auto max-w-md min-h-screen bg-white">
      <div className="min-h-screen w-full bg-white flex flex-col">
        <div className="px-5 pt-5">
          <Link
            href="."
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

          <h1 className="text-2xl font-bold text-slate-900 text-center mb-3">
            Vérification
          </h1>
          <p className="text-center text-sm text-slate-500 mb-8 px-4">
            Veuillez saisir le code à 6 chiffres envoyé au +222 54545455
          </p>

          <Suspense>
            <OtpForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

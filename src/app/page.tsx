import type { Metadata } from "next";
import Link from "next/link";

// ── 1. One data map drives BOTH the focused metadata and the focused UI. ──
//    Keeping them together means the Facebook preview and the on-page content
//    can never drift apart.
const offers = {
  watch: {
    title: "الحصول على ساعة ذكية",
    subtitle: "ساعة ذكية فاخرة مجاناً",
    description: "ساعة ذكية فاخرة مجاناً مع مصرفي.",
    image: "/og-watch.png", // put the file at: public/og-watch.png
  },
  visa: {
    title: "إصدار بطاقة فيزا",
    subtitle: "بطاقة مجانية بأعلى المميزات",
    description: "بطاقة Visa مجانية بأعلى المميزات من مصرفي.",
    image: "/og-visa.png", // put the file at: public/og-visa.png
  },
} as const;

type OfferKey = keyof typeof offers;

// searchParams is a Promise in Next.js 16 — you must await it.
type Props = {
  searchParams: Promise<{ offer?: string }>;
};

// ── 2. Dynamic metadata: same URL, focused OG based on ?offer= ──
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { offer } = await searchParams;
  const selected = offer && offer in offers ? offers[offer as OfferKey] : null;

  // No/invalid param → the default homepage preview.
  if (!selected) {
    return {
      title: "مصرفي Masrvi — By BMCI",
    };
  }

  // A valid ?offer= → Facebook sees a preview focused on that offer.
  return {
    title: `${selected.title} — مصرفي`,
    description: selected.description,
    openGraph: {
      title: selected.title,
      description: selected.description,
      images: [selected.image],
    },
  };
}

const loginHref = `/login`;

export default async function Home({ searchParams }: Props) {
  const { offer } = await searchParams;
  const selected = offer && offer in offers ? offers[offer as OfferKey] : null;

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-hidden text-masrvi-navy"
      style={{
        fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
        background:
          "radial-gradient(1200px 600px at 80% -10%, color-mix(in oklab, var(--masrvi-green) 22%, transparent), transparent 60%), radial-gradient(900px 500px at -10% 110%, color-mix(in oklab, var(--masrvi-navy) 18%, transparent), transparent 60%), var(--masrvi-bg)",
      }}
    >
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-masrvi-green/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-masrvi-navy/15 blur-3xl" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <span
          className="absolute rounded-full bg-masrvi-green/70 animate-masrvi-sparkle"
          style={{
            top: "8%",
            left: "10%",
            width: "6px",
            height: "6px",
            animationDelay: "0s",
            filter: "blur(0.5px)",
          }}
        />
        <span
          className="absolute rounded-full bg-masrvi-green/70 animate-masrvi-sparkle"
          style={{
            top: "18%",
            left: "82%",
            width: "4px",
            height: "4px",
            animationDelay: "0.6s",
            filter: "blur(0.5px)",
          }}
        />
        <span
          className="absolute rounded-full bg-masrvi-green/70 animate-masrvi-sparkle"
          style={{
            top: "42%",
            left: "92%",
            width: "5px",
            height: "5px",
            animationDelay: "1.2s",
            filter: "blur(0.5px)",
          }}
        />
        <span
          className="absolute rounded-full bg-masrvi-green/70 animate-masrvi-sparkle"
          style={{
            top: "68%",
            left: "6%",
            width: "5px",
            height: "5px",
            animationDelay: "0.3s",
            filter: "blur(0.5px)",
          }}
        />
        <span
          className="absolute rounded-full bg-masrvi-green/70 animate-masrvi-sparkle"
          style={{
            top: "82%",
            left: "78%",
            width: "7px",
            height: "7px",
            animationDelay: "1.6s",
            filter: "blur(0.5px)",
          }}
        />
        <span
          className="absolute rounded-full bg-masrvi-green/70 animate-masrvi-sparkle"
          style={{
            top: "30%",
            left: "50%",
            width: "3px",
            height: "3px",
            animationDelay: "2.1s",
            filter: "blur(0.5px)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-md px-5 py-8">
        <div className="flex flex-col items-center gap-6 pt-4">
          <div className="flex flex-col items-center gap-1">
            <div
              className="text-5xl font-bold text-masrvi-green leading-none"
              style={{ fontFamily: "'Amiri','Noto Naskh Arabic',serif" }}
            >
              مصرفي
            </div>
            <div className="text-3xl font-bold text-masrvi-navy leading-tight">
              Masrvii
            </div>
            <div className="text-sm text-muted-foreground">By BMCI</div>
          </div>

          <div className="relative inline-flex items-center gap-2 rounded-full border border-masrvi-green/30 bg-white/70 px-4 py-2 text-sm text-masrvi-navy shadow-sm backdrop-blur">
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-masrvi-green animate-masrvi-sparkle" />
            <span
              className="absolute -bottom-1 left-2 h-1.5 w-1.5 rounded-full bg-amber-400 animate-masrvi-sparkle"
              style={{ animationDelay: "0.6s" }}
            />
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-masrvi-green"
            >
              <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
            </svg>
            <span className="font-semibold">عرض حصري ومميز</span>
          </div>

          {selected ? (
            // ── 3a. Focused landing view (same URL, ?offer= is set) ──
            <>
              <h1 className="text-3xl font-extrabold text-masrvi-navy text-center">
                {selected.title}
              </h1>
              <p className="text-center text-sm leading-7 text-muted-foreground">
                {selected.subtitle}
              </p>

              <div className="mt-2 w-full space-y-4">
                <Link
                  href={loginHref}
                  className="flex w-full items-center justify-center rounded-2xl bg-linear-to-br from-masrvi-green to-emerald-600 p-4 font-bold text-white shadow-lg transition hover:-translate-y-0.5 active:scale-[0.99]"
                >
                  متابعة والحصول على العرض
                </Link>
                <Link
                  href="/"
                  className="block text-center text-sm text-muted-foreground underline"
                >
                  الرجوع لكل العروض
                </Link>
              </div>
            </>
          ) : (
            // ── 3b. Default view: both offer cards, each linking to its own ?offer= ──
            <>
              <h1 className="text-3xl font-extrabold text-masrvi-navy text-center">
                اختر بطاقتك أو ساعتك الذكية الآن
              </h1>

              <div className="text-center text-sm leading-7 text-muted-foreground space-y-1">
                <p className="font-bold text-masrvi-navy">
                  اصدر بطاقة Visa من مصرفي 💳
                </p>
                <p>حل عملي وآمن لمدفوعاتك اليومية</p>
                <p className="text-masrvi-green">✔ دفع سريع بدون تلامس</p>
              </div>

              <div className="mt-2 w-full space-y-4">
                <Link
                  href="/?offer=watch"
                  className="group relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-2xl border border-white/60 bg-white/80 p-4 text-right shadow-[0_10px_30px_-15px_rgba(15,23,42,0.25)] backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-20px_rgba(16,185,129,0.55)] active:scale-[0.99]"
                >
                  <div className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:animate-masrvi-shine group-hover:opacity-100" />
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-masrvi-green-soft text-masrvi-green transition-transform group-hover:-translate-x-0.5">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="text-masrvi-navy/60"
                    >
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-masrvi-navy">
                      {offers.watch.title}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {offers.watch.subtitle}
                    </div>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-masrvi-green to-emerald-600 text-white shadow-lg animate-masrvi-float-soft">
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="6" />
                      <path d="M9 4l1-2h4l1 2M9 20l1 2h4l1-2" />
                    </svg>
                  </div>
                </Link>

                <Link
                  href="/?offer=visa"
                  className="group relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-2xl border border-white/60 bg-white/80 p-4 text-right shadow-[0_10px_30px_-15px_rgba(15,23,42,0.25)] backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-20px_rgba(16,185,129,0.55)] active:scale-[0.99]"
                >
                  <div className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:animate-masrvi-shine group-hover:opacity-100" />
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-masrvi-green-soft text-masrvi-green transition-transform group-hover:-translate-x-0.5">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="text-masrvi-navy/60"
                    >
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-masrvi-navy">
                      {offers.visa.title}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {offers.visa.subtitle}
                    </div>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-masrvi-green to-emerald-600 text-white shadow-lg animate-masrvi-bob">
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="2" y="6" width="20" height="13" rx="2" />
                      <line x1="2" y1="11" x2="22" y2="11" />
                    </svg>
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

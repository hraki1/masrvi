import "./globals.css";
import type { Metadata } from "next";
import QueryProvider from "@/providers/QueryProvider";

export const metadata: Metadata = {
  // Base URL used to turn relative paths (like the OG image below) into
  // absolute URLs — Facebook requires absolute image URLs.
  metadataBase: new URL("https://masrvi.example.com"),
  title: "Masrvi اكتشف بطاقتك الأن 🚀 | مصرفي",
  description: "Masrvi اكتشف بطاقتك الأن 🚀 | مصرفي",

  // Open Graph = what Facebook / WhatsApp / Telegram show in the link preview.
  openGraph: {
    type: "website",
    locale: "ar_AR",
    siteName: "مصرفي Masrvi",
    url: "https://masrvi.example.com",
    title: "Masrvi اكتشف بطاقتك الأن 🚀 | مصرفي",
    description: "Masrvi اكتشف بطاقتك الأن 🚀 | مصرفي",
    images: [
      {
        url: "/og-image.png", // put the file at: public/og-image.png
        width: 1200,
        height: 630,
        alt: "مصرفي Masrvi — بطاقات وساعات ذكية",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className="min-h-screen leading-normal text-[#16191f] antialiased font-['Segoe_UI',system-ui,-apple-system,Roboto,Helvetica,Arial,sans-serif]">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

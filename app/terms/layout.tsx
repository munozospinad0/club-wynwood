import type { Metadata } from "next";
import { Fraunces, Geist } from "next/font/google";
import "../globals.css";

/** Igual que /privacy: fuera de [lang], bilingüe, la pide Meta para publicar la app. */
export const metadata: Metadata = {
  metadataBase: new URL("https://clubwynwood.com"),
  title: "Terms of service · Condiciones del servicio | Club Wynwood",
  description: "Terms for using the Club Wynwood website, forms and WhatsApp channel.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

const fraunces = Fraunces({ subsets: ["latin"], variable: "--f-display", display: "swap" });
const geist = Geist({ subsets: ["latin"], variable: "--f-cuerpo", display: "swap" });

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${geist.variable}`}>
      <body style={{ background: "var(--papel)", color: "var(--tinta-2)" }}>{children}</body>
    </html>
  );
}

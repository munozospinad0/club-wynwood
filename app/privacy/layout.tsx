import type { Metadata } from "next";
import { Fraunces, Geist } from "next/font/google";
import "../globals.css";

/**
 * /privacy vive FUERA de [lang] a propósito: Meta pide UNA URL de política de
 * privacidad (y otra de borrado de datos) para publicar la app de WhatsApp, y
 * una página bilingüe con anclas cubre las dos sin tocar RUTAS ni el sitemap.
 * Antes de existir, /privacy caía en [lang] y servía la portada con un 200: Meta
 * la habría aceptado y el revisor habría visto un venue, no una política.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://clubwynwood.com"),
  title: "Privacy policy · Política de privacidad | Club Wynwood",
  description: "How Club Wynwood collects, uses and deletes personal data from its website, forms and WhatsApp.",
  alternates: { canonical: "/privacy" },
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

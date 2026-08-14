import type { Metadata } from "next";
import "../globals.css";
import { BCP47, IDIOMAS, alternativas, asIdioma, href } from "@/lib/i18n";
const asIdioma_ = (p: { lang: string }) => ({ lang: asIdioma(p.lang) });
import { grafo, localBusiness, eventVenue } from "@/lib/schema";
import { VENUE } from "@/lib/venue";
import SelectorIdioma from "@/components/SelectorIdioma";
import Revelado from "@/components/Revelado";

export function generateStaticParams() {
  return IDIOMAS.map((lang) => ({ lang }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ lang: string }> }
): Promise<Metadata> {
  const { lang } = asIdioma_(await params);
  const es = lang === "es";
  return {
    title: {
      default: es
        ? "Club Wynwood — Jardín de eventos al aire libre · Wynwood, Miami"
        : "Club Wynwood — Open-air event garden · Wynwood, Miami",
      template: "%s | Club Wynwood",
    },
    description: es
      ? "Venue al aire libre en el Wynwood Arts District, Miami. ~22.000 ft² entre jardín y palapa techada. Aforo ~600 de pie. Tú traes la producción; nosotros entregamos el espacio."
      : "Open-air venue in Miami's Wynwood Arts District. ~22,000 sq ft between garden and covered structure. ~600 standing. You bring the production; we hand over the space.",
    alternates: alternativas("home"),
    robots: { index: true, follow: true, "max-image-preview": "large" },
    openGraph: {
      type: "website",
      siteName: "Club Wynwood",
      locale: BCP47[lang],
      alternateLocale: IDIOMAS.filter((l) => l !== lang).map((l) => BCP47[l]),
      images: [{ url: "/assets/aerea-predio.jpg", width: 1024, height: 683 }],
    },
    twitter: { card: "summary_large_image" },
  };
}

const NAV = [
  { es: "El lugar", en: "The venue", clave: "jardin" as const },
  { es: "Tiki Hut", en: "Tiki Hut", clave: "tikiHut" as const },
  { es: "Bodas", en: "Weddings", clave: "bodas" as const },
  { es: "Corporativo", en: "Corporate", clave: "corporativo" as const },
  { es: "Preguntas", en: "FAQ", clave: "faq" as const },
];

export default async function Layout(
  { children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }
) {
  const { lang } = asIdioma_(await params);
  const es = lang === "es";

  // El JSON-LD del negocio va en el layout: es el mismo en todas las páginas y
  // duplicarlo por página haría que compitan varios @id iguales.
  const ld = grafo(localBusiness(lang), eventVenue(lang));

  return (
    <html lang={BCP47[lang]}>
      <body>
        <script
          type="application/ld+json"
          // El contenido sale de lib/venue.ts, no de entrada de usuario.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />

        <a
          href="#contenido"
          style={{
            position: "absolute", left: "-9999px", top: 0, zIndex: 100,
            background: "var(--tinta)", color: "var(--papel)", padding: "12px 18px",
          }}
          onFocus={undefined}
          className="saltar"
        >
          {es ? "Saltar al contenido" : "Skip to content"}
        </a>

        <nav
          style={{
            position: "sticky", top: 0, zIndex: 50, background: "var(--tinta)",
            borderBottom: "1px solid var(--regla-osc)",
          }}
        >
          <div
            className="reja"
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: 24, height: 64, color: "var(--papel)",
            }}
          >
            <a
              href={href("home", lang)}
              style={{
                textDecoration: "none", fontFamily: "var(--mono)", fontSize: 12,
                letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 500,
              }}
            >
              Club Wynwood
            </a>

            <div style={{ display: "flex", gap: 22, alignItems: "center", flexWrap: "wrap" }}>
              {NAV.map((n) => (
                <a
                  key={n.clave}
                  href={href(n.clave, lang)}
                  style={{ textDecoration: "none", fontSize: 14, color: "var(--papel)" }}
                >
                  {es ? n.es : n.en}
                </a>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <SelectorIdioma lang={lang} />
              <a
                href={`${href("home", lang)}#disponibilidad`}
                className="boton"
                style={{ background: "var(--papel-2)", color: "var(--tinta)" }}
              >
                {es ? "Solicitar disponibilidad" : "Request availability"}
              </a>
            </div>
          </div>
        </nav>

        <main id="contenido">{children}</main>

        <footer style={{ background: "var(--tinta)", color: "var(--texto)", marginTop: 0 }}>
          <div
            className="reja"
            style={{
              display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap",
              paddingBlock: 34, fontFamily: "var(--mono)", fontSize: 11,
              letterSpacing: ".14em", textTransform: "uppercase",
            }}
          >
            <div>Club Wynwood — {es ? VENUE.descriptorEs : VENUE.descriptorEn}</div>
            <div>
              {VENUE.direccion.calle} · {VENUE.direccion.ciudad} {VENUE.direccion.region}{" "}
              {VENUE.direccion.cp}
            </div>
            <div>
              {es
                ? "Se alquila el exterior: jardín y estructura techada"
                : "The exterior is what's rented: garden and covered structure"}
            </div>
          </div>
        </footer>

        <Revelado />
      </body>
    </html>
  );
}

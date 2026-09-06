import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import "../responsive.css";
import "../lamina.css";
import { BCP47, IDIOMAS, INDEXABLE, alternativas, asIdioma, href } from "@/lib/i18n";
const asIdioma_ = (p: { lang: string }) => ({ lang: asIdioma(p.lang) });
import { grafo, localBusiness, eventVenue } from "@/lib/schema";
import { VENUE } from "@/lib/venue";
import SelectorIdioma from "@/components/SelectorIdioma";
import Revelado from "@/components/Revelado";
import Medicion from "@/components/Medicion";
import Atribucion from "@/components/Atribucion";

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
    alternates: alternativas("home", lang),
    // Cerrado mientras esto viva en Vercel: robots.txt solo frena el rastreo,
    // no la indexación de una URL que alguien enlace. La meta sí. Se necesitan
    // las dos. Ver INDEXABLE en lib/i18n.ts.
    robots: INDEXABLE
      ? { index: true, follow: true, "max-image-preview": "large" }
      : { index: false, follow: false, nocache: true },
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

/**
 * LAS TIPOGRAFÍAS DE LA MARCA. Faltaban, y era el fallo más caro del sitio.
 *
 * `globals.css` declaraba `--display: "Fraunces"`, `--cuerpo: "Geist"` y
 * `--mono: "Geist Mono"` desde el principio. **Ninguna se cargaba nunca**: no
 * había `@font-face`, ni `next/font`, ni enlace a Google Fonts, ni un solo
 * archivo de fuente en el repositorio.
 *
 * O sea que todo el sitio se veía en Georgia y en la sans del sistema, y el
 * navegador no da ningún error por eso: aplica el respaldo declarado y sigue.
 * Es un fallo que solo se ve comparando con lo que debería ser, y explica por
 * qué el conjunto se sentía menos cuidado de lo que el código merecía.
 *
 * Se cargan con `next/font`, que las descarga en la compilación y las sirve
 * desde el propio dominio: sin petición a Google en cada visita, sin salto de
 * maqueta al llegar la fuente, y sin depender de que un tercero esté en pie.
 *
 * `SOFT` y `WONK` son los ejes de Fraunces que fija el kit de marca: SOFT 0
 * mantiene los remates afilados y WONK 1 enciende las variantes de carácter en
 * la itálica y en ciertas letras. Sin declararlos, la variable cae en valores
 * por defecto y la letra se parece a cualquier otra serif.
 */
// Sin `weight`: declararlo y pedir ejes a la vez es un error de `next/font`
// («Axes can only be defined for variable fonts when the weight property is
// nonexistent or set to variable»). Al omitirlo se sirve el archivo variable
// entero, que es lo que hace falta para poder mover SOFT y WONK.
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--f-display",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--f-cuerpo",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--f-mono",
  display: "swap",
});

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
    <html
      lang={BCP47[lang]}
      data-lang={lang}
      className={`${fraunces.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body>
        {/* Consentimiento por defecto y, detrás, el transporte: el contenedor
            de GTM si existe, GA4 directo si no. Sin ninguno de los dos, los
            eventos se acumulan en el dataLayer. Ver components/Medicion.tsx. */}
        <Medicion />

        {/* La atribución se captura en TODAS las páginas. Antes solo corría
            donde estaba el formulario del venue, y las rutas de preguntas
            frecuentes y de residencia se quedaban sin cookie: los anuncios que
            apuntaran ahí perdían su identificador de clic. Ver el componente. */}
        <Atribucion />

        <script
          type="application/ld+json"
          // El contenido sale de lib/venue.ts, no de entrada de usuario.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />

        {/**
          * EL ENLACE PARA SALTAR AL CONTENIDO, que hasta ahora no servía.
          *
          * Estaba escondido con `left: -9999px` **en línea**, y la clase
          * `.saltar` no existía en ningún archivo de estilos. Un estilo en línea
          * gana a cualquier regla CSS, así que ni aunque la clase hubiera
          * existido podría haberse mostrado al recibir el foco: quien navega con
          * teclado tenía que pasar por los nueve enlaces de la barra en cada
          * página, siempre.
          *
          * Ahora todo vive en la clase, que sí existe, y aparece al enfocarlo.
          */}
        <a href="#contenido" className="saltar">
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
            {/* El servicio legal de Sandra Clavijo vive en este dominio desde
                el sitio anterior. Va SOLO en el pie: en la navegación
                competiría con lo que el venue vende. */}
            <div>
              <a href={href("residencia", lang)} style={{ color: "var(--texto)" }}>
                {es ? "Residencia permanente · EB-5" : "Permanent residency · EB-5"}
              </a>
            </div>
          </div>
        </footer>

        <Revelado />
      </body>
    </html>
  );
}

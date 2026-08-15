import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  IDIOMAS, RUTAS, alternativas, asIdioma, href, url,
  type ClaveRuta, type Idioma,
} from "@/lib/i18n";
import { PAGINAS, FAQ, pagina } from "@/lib/contenido";
import { grafo, breadcrumb, faqPage } from "@/lib/schema";
import Calculadora from "@/components/Calculadora";

/**
 * Una sola ruta dinámica para las seis páginas interiores.
 *
 * Seis archivos casi idénticos es donde se cuela la deriva: en el sitio anterior
 * cada página repetía el markup y bastó un cambio para que dejaran de parecerse.
 * Aquí el contenido vive en lib/contenido.ts y la plantilla es una.
 */

/** Mapea un segmento de URL a su clave, en el idioma que toque. */
function claveDeSegmento(lang: Idioma, slug: string): ClaveRuta | undefined {
  return (Object.keys(RUTAS) as ClaveRuta[]).find(
    (k) => RUTAS[k][lang] === slug && k !== "home"
  );
}

export function generateStaticParams() {
  const out: Array<{ lang: string; slug: string }> = [];
  for (const lang of IDIOMAS) {
    for (const k of Object.keys(RUTAS) as ClaveRuta[]) {
      if (k === "home") continue;
      out.push({ lang, slug: RUTAS[k][lang] });
    }
  }
  return out;
}

export async function generateMetadata(
  { params }: { params: Promise<{ lang: string; slug: string }> }
): Promise<Metadata> {
  const { lang: l0, slug } = await params;
  const lang = asIdioma(l0);
  const clave = claveDeSegmento(lang, slug);
  if (!clave) return {};

  if (clave === "faq") {
    return {
      title: lang === "es" ? "Preguntas frecuentes" : "Frequently asked questions",
      description: lang === "es"
        ? "Qué incluye el alquiler, cuánta gente cabe, qué pasa si llueve, dónde queda y cómo se cotiza Club Wynwood."
        : "What renting includes, how many people fit, what happens if it rains, where it is and how Club Wynwood is quoted.",
      alternates: alternativas("faq"),
    };
  }

  const p = pagina(clave);
  if (!p) return {};
  return {
    title: p.title[lang].split(" | ")[0],
    description: p.description[lang],
    alternates: alternativas(clave),
    openGraph: { images: [{ url: p.foto.src }] },
  };
}

export default async function PaginaInterior(
  { params }: { params: Promise<{ lang: string; slug: string }> }
) {
  const { lang: l0, slug } = await params;
  const lang = asIdioma(l0);
  const es = lang === "es";
  const clave = claveDeSegmento(lang, slug);
  if (!clave) notFound();

  // ---------------------------------------------------------------- FAQ
  if (clave === "faq") {
    const preguntas = FAQ.map((f) => ({ q: f.q[lang], a: f.a[lang] }));
    const ld = grafo(
      breadcrumb(lang, es ? "Preguntas frecuentes" : "FAQ", url("faq", lang)),
      faqPage(lang, preguntas)
    );
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
        <div className="reja" style={{ paddingBlock: "56px 40px" }}>
          <Migas lang={lang} nombre={es ? "Preguntas frecuentes" : "FAQ"} />
          <h1 style={{ maxWidth: "14ch", marginTop: 24 }}>
            {es ? "Preguntas frecuentes" : "Frequently asked"}
          </h1>
        </div>
        <section>
          <div className="reja" style={{ paddingBottom: 80 }}>
            {FAQ.map((f, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.35fr)", gap: 44, padding: "32px 0", borderBottom: "1px solid var(--regla)" }}>
                <h2 style={{ fontSize: 19, fontFamily: "var(--cuerpo)", fontWeight: 600, letterSpacing: "-.01em" }}>
                  {f.q[lang]}
                </h2>
                <p style={{ margin: 0, fontSize: 15, color: "#4a4335" }}>{f.a[lang]}</p>
              </div>
            ))}
          </div>
        </section>
        <Seguir lang={lang} actual={clave} />
      </>
    );
  }

  // ------------------------------------------------------- páginas normales
  const p = pagina(clave);
  if (!p) notFound();

  const ld = grafo(breadcrumb(lang, p.h1[lang], url(clave, lang)));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <div className="reja" style={{ paddingBlock: "56px 0" }}>
        <Migas lang={lang} nombre={p.h1[lang]} />
      </div>

      <header className="reja" style={{ paddingBlock: "28px 64px" }}>
        <div className="ojo" style={{ paddingBottom: 20 }}>{p.ojo[lang]}</div>
        <h1 style={{ maxWidth: "16ch", marginBottom: 28 }}>{p.h1[lang]}</h1>
        {/* Bloque de respuesta citable: 40-60 palabras, conclusión primero. */}
        <p className="respuesta" style={{ fontSize: 18 }}>{p.respuesta[lang]}</p>
      </header>

      {/* La calculadora solo en /aforo-y-montajes/: es su sitio natural y
          repetirla por todo el sitio la convertiria en decoracion. */}
      {clave === "aforos" && (
        <section style={{ borderBottom: "1px solid var(--regla)" }}>
          <div className="reja" style={{ paddingBlock: "0 56px" }}>
            <div className="ojo" style={{ paddingBottom: 16 }}>
              {es ? "Calcula tu espacio" : "Work out your space"}
            </div>
            <Calculadora lang={lang} />
            <p style={{ margin: "16px 0 0", fontSize: 13, color: "var(--texto)", maxWidth: "62ch" }}>
              {es
                ? "Los ratios son estándares de planificación de eventos, y el resultado nunca supera el aforo declarado del inmueble: si la aritmética da más de lo que el venue admite, la calculadora lo dice."
                : "The ratios are standard event-planning figures, and the result never exceeds the venue's stated capacity: if the arithmetic allows more than the site takes, the calculator says so."}
            </p>
          </div>
        </section>
      )}

      <section style={{ background: "var(--papel-2)", borderBlock: "1px solid var(--regla)" }}>
        <div className="reja" style={{ display: "flex", flexWrap: "wrap", padding: 0 }}>
          {p.cifras.map((c) => (
            <div key={c.etiqueta.es} style={{ flex: "1 1 200px", padding: "26px 24px", borderRight: "1px solid var(--regla)" }}>
              <div className="ojo" style={{ paddingBottom: 12 }}>{c.etiqueta[lang]}</div>
              <div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 34, lineHeight: 1, letterSpacing: "-.02em" }}>
                {c.valor}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ borderBottom: "1px solid var(--regla)" }}>
        <figure style={{ margin: "0 auto", maxWidth: "var(--reja)", padding: "48px 32px 40px" }}>
          <div style={{ position: "relative", aspectRatio: "3/2", maxWidth: 1024 }}>
            <Image
              src={p.foto.src}
              alt={p.foto.alt[lang]}
              fill
              sizes="(max-width: 1080px) 100vw, 1024px"
              style={{ objectFit: "cover", filter: "saturate(.94) contrast(1.04)" }}
            />
          </div>
          <figcaption className="ojo" style={{ paddingTop: 16 }}>{p.foto.pie[lang]}</figcaption>
        </figure>
      </section>

      <section style={{ borderBottom: "1px solid var(--regla)" }}>
        <div className="reja" style={{ paddingBlock: 76 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 44 }}>
            {p.bloques.map((b) => (
              <div key={b.titulo.es}>
                <h2 style={{ fontSize: 19, fontFamily: "var(--cuerpo)", fontWeight: 600, letterSpacing: "-.01em", marginBottom: 14 }}>
                  {b.titulo[lang]}
                </h2>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.68, color: "#4a4335" }}>{b.cuerpo[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Seguir lang={lang} actual={clave} />
    </>
  );
}

function Migas({ lang, nombre }: { lang: Idioma; nombre: string }) {
  return (
    <nav aria-label={lang === "es" ? "Migas de pan" : "Breadcrumb"} className="ojo">
      <a href={href("home", lang)} style={{ color: "var(--texto)", textDecoration: "none" }}>
        Club Wynwood
      </a>{" "}
      <span aria-hidden>/</span> <span style={{ color: "var(--tinta-2)" }}>{nombre}</span>
    </nav>
  );
}

/** Enlazado interno: sin esto las interiores quedan huérfanas para el rastreador. */
function Seguir({ lang, actual }: { lang: Idioma; actual: ClaveRuta }) {
  const es = lang === "es";
  const otras = PAGINAS.filter((p) => p.clave !== actual);
  return (
    <section style={{ borderBottom: "1px solid var(--regla)" }}>
      <div className="reja" style={{ paddingBlock: 66 }}>
        <div className="ojo" style={{ marginBottom: 24 }}>{es ? "Seguir leyendo" : "Keep reading"}</div>
        <div style={{ maxWidth: 640 }}>
          {otras.map((o) => (
            <a key={o.clave} href={href(o.clave, lang)} style={{ display: "block", padding: "15px 0", borderBottom: "1px solid var(--regla)", textDecoration: "none", fontSize: 15 }}>
              {o.h1[lang]} <span style={{ color: "var(--ocre)" }}>→</span>
            </a>
          ))}
          {actual !== "faq" && (
            <a href={href("faq", lang)} style={{ display: "block", padding: "15px 0", borderBottom: "1px solid var(--regla)", textDecoration: "none", fontSize: 15 }}>
              {es ? "Preguntas frecuentes" : "Frequently asked questions"} <span style={{ color: "var(--ocre)" }}>→</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

// Solo existen las rutas de generateStaticParams: cualquier otro slug es 404.
// Sin esto, /es/cualquier-cosa devolvería 200 con una página vacía, que es
// contenido basura indexable.
export const dynamicParams = false;

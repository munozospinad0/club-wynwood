import type { Metadata } from "next";
import Image from "next/image";
import Cierre from "@/components/Cierre";
import { notFound } from "next/navigation";
import {
  IDIOMAS, RUTAS, alternativas, asIdioma, href, url,
  type ClaveRuta, type Idioma,
} from "@/lib/i18n";
import { PAGINAS, FAQ, pagina } from "@/lib/contenido";
import { ENTORNO } from "@/lib/venue";
import { grafo, breadcrumb, faqPage, localBusiness, eventVenue, webPage } from "@/lib/schema";
import Calculadora from "@/components/Calculadora";
import Residencia from "@/components/Residencia";
import { heroeDe, fotosDeBloques, fotoEntorno, miniaturaDe, fotoDePregunta, fotoFaq, type FotoPagina } from "@/lib/fotosPagina";
import "@/app/interior.css";

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
      alternates: alternativas("faq", lang),
    };
  }

  if (clave === "residencia") {
    return {
      title: lang === "es"
        ? "Residencia permanente en EE. UU. — EB-5 Direct"
        : "Permanent residency in the U.S. — EB-5 Direct",
      description: lang === "es"
        ? "Servicio de Law Offices of Sandra Clavijo, firma de abogados de inmigración en Miami: asesoría en residencia por inversión EB-5 Direct. Servicio independiente del alquiler del venue."
        : "A service of Law Offices of Sandra Clavijo, a Miami immigration law firm: EB-5 Direct residency-by-investment counsel. Independent from the venue rental.",
      alternates: alternativas("residencia", lang),
    };
  }

  const p = pagina(clave);
  if (!p) return {};
  return {
    title: p.title[lang].split(" | ")[0],
    description: p.description[lang],
    alternates: alternativas(clave, lang),
    // La misma foto que abre la página: dos de las de contenido.ts llevan el parche del logo borrado.
    openGraph: { images: [{ url: heroeDe(clave, p.foto, lang)?.src ?? p.foto.src }] },
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
    const heroeFaq = fotoFaq(lang);
    // El negocio y el venue van en cada página del venue, no en el layout: así
    // la de residencia permanente, que es otro negocio, no los hereda.
    const ld = grafo(
      localBusiness(lang),
      eventVenue(lang),
      webPage(lang, "faq", es ? "Preguntas frecuentes sobre Club Wynwood" : "Frequently asked questions about Club Wynwood"),
      breadcrumb(lang, es ? "Preguntas frecuentes" : "FAQ", url("faq", lang)),
      faqPage(lang, preguntas)
    );
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
        <div className="reja" style={{ paddingBlock: "56px 0" }}>
          <Migas lang={lang} nombre={es ? "Preguntas frecuentes" : "FAQ"} />
        </div>
        {/* 29-sep: era la única página del sitio sin una sola imagen. Misma cabecera que las interiores,
            y al lado de cada respuesta que se entiende mejor viéndola, la foto de eso (lib/fotosPagina.ts). */}
        <div className="reja int-cabeza faq-cabeza">
          <div>
            <h1>{es ? "Preguntas frecuentes" : "Frequently asked questions"}</h1>
            <p className="respuesta" style={{ fontSize: 18 }}>
              {es
                ? "Lo que más se pregunta sobre el lugar, respondido con lo que sabemos hoy. Lo que todavía no está medido lo dice así, y se revisa contigo en la visita."
                : "The questions we hear most, answered with what we know today. Anything not yet measured says so, and is reviewed with you at the site visit."}
            </p>
            <a href="#disponibilidad" className="boton" style={{ marginTop: 8 }}>
              {es ? "Consultar mi fecha" : "Check my date"} <span aria-hidden>→</span>
            </a>
          </div>
          <figure className="int-heroe">
            <div className="int-marco">
              <Image
                src={heroeFaq.src}
                alt={heroeFaq.alt}
                fill
                quality={70}
                loading="eager"
                sizes="(min-width: 1280px) 670px, (min-width: 900px) 52vw, 100vw"
                style={{ objectFit: "cover", objectPosition: heroeFaq.encuadre }}
              />
            </div>
            <figcaption className="int-pie">{heroeFaq.pie}</figcaption>
          </figure>
        </div>
        <section style={{ borderTop: "1px solid var(--regla)" }}>
          <div className="reja faq-lista">
            {FAQ.map((f, i) => {
              const foto = fotoDePregunta(f.q.es, lang);
              return (
                <div key={i} className="faq-fila">
                  <h2>{f.q[lang]}</h2>
                  <p>{f.a[lang]}</p>
                  {foto && (
                    <figure className="faq-foto">
                      <div className="int-marco int-marco--tarjeta">
                        <Image
                          src={foto.src}
                          alt={foto.alt}
                          fill
                          quality={70}
                          sizes="220px"
                          style={{ objectFit: "cover", objectPosition: foto.encuadre }}
                        />
                      </div>
                    </figure>
                  )}
                </div>
              );
            })}
          </div>
        </section>
        {/* El cierre también aquí. Preguntas frecuentes está en el feed de
            páginas de Google Ads, así que es una de las que puede recibir un
            clic pagado, y hasta hoy terminaba en trece enlaces y nada más: sin
            formulario, sin ancla `disponibilidad` y, por tanto, sin la barra
            fija del móvil. Alguien que llega buscando «¿puedo traer mi
            catering?», lee que sí y no encuentra dónde pedir la fecha. */}
        <Cierre lang={lang} />
        <Seguir lang={lang} actual={clave} />
      </>
    );
  }

  // ------------------------------------------------- servicio legal aparte
  // No es una página del venue y no usa su plantilla: ni foto, ni cifras, ni
  // el cierre que ofrece disponibilidad. Ver components/Residencia.tsx.
  if (clave === "residencia") {
    const ld = grafo(
      breadcrumb(lang, es ? "Residencia permanente" : "Permanent residency", url("residencia", lang))
    );
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
        <div className="reja" style={{ paddingBlock: "56px 0" }}>
          <Migas lang={lang} nombre={es ? "Residencia permanente" : "Permanent residency"} />
        </div>
        <Residencia lang={lang} />
      </>
    );
  }

  // ------------------------------------------------------- páginas normales
  const p = pagina(clave);
  if (!p) notFound();

  const ld = grafo(localBusiness(lang), eventVenue(lang), breadcrumb(lang, p.h1[lang], url(clave, lang)));
  const heroe = heroeDe(clave, p.foto, lang);
  const fotos = fotosDeBloques(p.bloques, heroe?.id, lang);
  const conFoto = p.bloques.slice(0, fotos.length);
  const resto = p.bloques.slice(fotos.length);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <div className="reja" style={{ paddingBlock: "56px 0" }}>
        <Migas lang={lang} nombre={p.h1[lang]} />
      </div>

      {/* ─── EL ORDEN DE UNA INTERIOR (29-sep-2026) ─────────────────────────
          titular + foto → filas foto/texto → resto → cifras → entorno → pedir → relacionado

          Daniel, viendo /en/corporate-events: «no tienen nada visual, son solo texto vacío». La foto
          ya no espera debajo del titular: va a su lado (en el teléfono, justo después del botón), y
          los primeros bloques llevan cada uno la foto de lo que cuentan, elegida por su texto en
          lib/fotosPagina.ts. Las cifras siguen después del texto, cuando ya hay dónde colgarlas: un
          número sin marco no informa. */}
      <div className="reja int-cabeza">
        <div>
          <div className="ojo" style={{ paddingBottom: 20 }}>{p.ojo[lang]}</div>
          <h1>{p.h1[lang]}</h1>
          {/* Bloque de respuesta citable: 40-60 palabras, conclusión primero. */}
          <p className="respuesta" style={{ fontSize: 18 }}>{p.respuesta[lang]}</p>
          {/* 24-sep: la primera solicitud real entró por una página así
              (/en/company-holiday-party) y tuvo que bajar cuatro pantallas para
              encontrar dónde pedir fecha. El botón va donde ya decidió leer. */}
          <a href="#disponibilidad" className="boton" style={{ marginTop: 8 }}>
            {es ? "Consultar mi fecha" : "Check my date"} <span aria-hidden>→</span>
          </a>
        </div>
        {heroe && (
          <figure className="int-heroe">
            <div className="int-marco">
              {/* «eager» para que no espere al scroll, pero sin prioridad alta: en el teléfono lo que
                  manda es el texto y la foto no debe quitarle ancho de banda a su fuente. */}
              <Image
                src={heroe.src}
                alt={heroe.alt}
                fill
                quality={70}
                loading="eager"
                sizes="(min-width: 1280px) 670px, (min-width: 900px) 52vw, 100vw"
                style={{ objectFit: "cover", objectPosition: heroe.encuadre }}
              />
            </div>
            <figcaption className="int-pie">{heroe.pie}</figcaption>
          </figure>
        )}
      </div>

      <section className="int-bloques">
        <div className="reja">
          {conFoto.map((b, i) => (
            <article key={b.titulo.es} className="int-fila">
              <figure className="int-fila-foto">
                <div className="int-marco">
                  <Image
                    src={fotos[i].src}
                    alt={fotos[i].alt}
                    fill
                    quality={70}
                    sizes="(min-width: 1280px) 700px, (min-width: 900px) 56vw, 100vw"
                    style={{ objectFit: "cover", objectPosition: fotos[i].encuadre }}
                  />
                </div>
                <figcaption className="int-pie">{fotos[i].pie}</figcaption>
              </figure>
              <div className="int-fila-texto">
                <h2>{b.titulo[lang]}</h2>
                <p>{b.cuerpo[lang]}</p>
              </div>
            </article>
          ))}
          {resto.length > 0 && (
            <div className="int-resto">
              {resto.map((b) => (
                <div key={b.titulo.es}>
                  <h3>{b.titulo[lang]}</h3>
                  <p>{b.cuerpo[lang]}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section style={{ background: "var(--papel-2)", borderBlock: "1px solid var(--regla)" }}>
        <div className="reja" style={{ display: "flex", flexWrap: "wrap", padding: 0 }}>
          {p.cifras.map((c) => (
            <div key={c.etiqueta.es} style={{ flex: "1 1 200px", padding: "26px 24px", borderRight: "1px solid var(--regla)" }}>
              <div className="ojo" style={{ paddingBottom: 12 }}>{c.etiqueta[lang]}</div>
              <div className="int-cifra" style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 34, lineHeight: 1, letterSpacing: "-.02em" }}>
                {typeof c.valor === "string" ? c.valor : c.valor[lang]}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* El entorno en cifras, solo donde alguien lo está buscando. Ver ENTORNO. */}
      {CON_ENTORNO.has(clave) && <Entorno lang={lang} foto={fotoEntorno([heroe?.id, ...fotos.map((f) => f.id)], lang)} />}

      {/* La calculadora solo en /aforo-y-montajes/: es su sitio natural y
          repetirla por todo el sitio la convertiria en decoracion. */}
      {clave === "aforos" && (
        <section style={{ borderBottom: "1px solid var(--regla)" }}>
          <div className="reja" style={{ paddingBlock: "56px" }}>
            <div className="ojo" style={{ paddingBottom: 16 }}>
              {es ? "Calcula tu espacio" : "Calculate your space"}
            </div>
            <Calculadora lang={lang} />
            <p style={{ margin: "16px 0 0", fontSize: 13, color: "var(--texto)", maxWidth: "62ch" }}>
              {es
                ? "Los ratios son estándares de planificación de eventos, y el resultado nunca supera el aforo declarado del inmueble: si la aritmética da más de lo que el venue admite, la calculadora lo dice."
                : "The ratios are standard event-planning figures, and the result never goes above the venue's stated capacity: if the math allows more guests than the venue holds, the calculator tells you."}
            </p>
          </div>
        </section>
      )}

      {/* El cierre va ANTES de «Relacionado». Quien acaba de leer la página
          está en su punto de más intención: ofrecerle primero más lectura y
          después el formulario es pedirle que se enfríe antes de escribir. */}
      <Cierre lang={lang} tema={TEMA[clave]?.[lang]} tipo={TIPO[clave]} />

      <Seguir lang={lang} actual={clave} />
    </>
  );
}

/**
 * DÓNDE APARECE EL ENTORNO EN CIFRAS.
 *
 * En cinco páginas y no en las catorce, porque el dato solo sirve a quien está
 * decidiendo *dónde*: una marca que evalúa una activación, un pop-up que
 * necesita saber quién pasa por delante, una productora que justifica la
 * localización, quien monta durante Art Basel y quien llega leyendo sobre el
 * barrio. A la novia que busca sitio para su boda, «465 millones de gasto en
 * comida y bebida» no le dice nada y le alarga la página.
 */
const CON_ENTORNO = new Set<ClaveRuta>(["corporativo", "swimWeek", "offsite", "popups", "produccion", "artbasel", "barrio"]);

/**
 * El barrio en números, con la fuente a la vista.
 *
 * Se cita a Newmark en el pie y no se disimula: son las cifras de la ficha
 * comercial del inmueble, no un estudio propio, y el sitio distingue lo propio
 * de lo ajeno en todas partes. Decir de quién son las hace más creíbles, no
 * menos — quien las va a usar en una presentación necesita saber a quién citar.
 */
function Entorno({ lang, foto }: { lang: Idioma; foto: FotoPagina }) {
  const es = lang === "es";
  return (
    <section style={{ borderBottom: "1px solid var(--regla)" }}>
      <div className="reja int-entorno">
        {/* El predio señalado sobre su manzana: las cifras dicen quién hay alrededor, la foto dónde. */}
        <figure className="int-entorno-foto">
          <div className="int-marco int-marco--cuadro">
            <Image
              src={foto.src}
              alt={foto.alt}
              fill
              quality={70}
              sizes="(min-width: 1280px) 440px, (min-width: 900px) 34vw, 100vw"
              style={{ objectFit: "cover", objectPosition: foto.encuadre }}
            />
          </div>
          <figcaption className="int-pie">{foto.pie}</figcaption>
        </figure>
        <div>
          <div className="ojo" style={{ paddingBottom: 16 }}>
            {es ? "El entorno · " : "The surroundings · "}
            {es ? ENTORNO.radio.es : ENTORNO.radio.en}
          </div>
          <h2 style={{ fontSize: 19, fontFamily: "var(--cuerpo)", fontWeight: 600, letterSpacing: "-.01em", marginBottom: 8, maxWidth: "34ch" }}>
            {es
              ? "Quién vive y quién gasta alrededor del predio."
              : "Who lives and spends money around the venue."}
          </h2>
          <p style={{ margin: "0 0 28px", fontSize: 15, lineHeight: 1.68, color: "#4a4335", maxWidth: "62ch" }}>
            {/* «área inmediata» decía más de lo que dice la fuente: el flyer da un radio de 2 millas. */}
            {es
              ? "Wynwood no es solo un barrio de murales: es un distrito de bares, galerías y tiendas con público propio todo el año. Estas son las cifras de un radio de 2 millas alrededor del predio, las mismas con las que se comercializa el inmueble."
              : "Wynwood isn't just a mural district: it's a neighborhood of bars, galleries and shops with its own year-round crowd. These figures cover a 2-mile radius around the venue, the same ones used to market the property."}
          </p>
          <div className="int-entorno-cifras">
            {ENTORNO.datos.map((d) => (
              <div key={d.clave}>
                <div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 27, lineHeight: 1.1, letterSpacing: "-.02em" }}>
                  {es ? d.valorEs : d.valorEn}
                </div>
                <div className="ojo" style={{ paddingTop: 8 }}>{es ? d.es : d.en}</div>
              </div>
            ))}
          </div>
          <p style={{ margin: "28px 0 0", fontSize: 13, color: "var(--texto)" }}>
            {es ? "Fuente: " : "Source: "}{es ? ENTORNO.fuente : ENTORNO.fuenteEn}.
          </p>
        </div>
      </div>
    </section>
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

/**
 * A qué familia pertenece cada página. Sirve para enlazar lo que de verdad se
 * parece, en vez de listarlo todo.
 *
 *   espacio    — qué alquilas
 *   ocasion    — para qué lo alquilas
 *   referencia — cómo funciona, y el barrio
 */
/**
 * Cómo se nombra el evento en el cierre de cada página.
 *
 * Va aquí y no en contenido.ts para tenerlo todo a la vista de un golpe: son
 * catorce frases que tienen que encajar en «¿Tienes fecha para ___?», y eso se
 * revisa mejor en una lista que repartido por novecientas líneas.
 *
 * Donde no encaja bien —la guía, el barrio, los aforos— se deja sin tema y el
 * cierre usa el titular genérico. Forzar «¿Tienes fecha para por qué Wynwood?»
 * sería peor que no personalizar.
 */
const TEMA: Partial<Record<string, { es: string; en: string }>> = {
  swimWeek: { es: "tu desfile", en: "your runway show" },
  sweet16: { es: "el Sweet 16", en: "the Sweet 16" },
  salonVsJardin: { es: "tu fiesta", en: "your party" },
  finDeSemanaBoda: { es: "la cena de ensayo", en: "the rehearsal dinner" },
  showers: { es: "el shower", en: "your bridal or baby shower" },
  bodasIntimas: { es: "tu boda pequeña", en: "your small wedding" },
  cumpleanosAdultos: { es: "tu cumpleaños", en: "your birthday" },
  offsite: { es: "el offsite de tu equipo", en: "your team's offsite" },
  jardin:       { es: "tu evento en el Jardín",     en: "your event in the Garden" },
  tikiHut:      { es: "tu evento bajo el Pabellón", en: "your event under the Pavilion" },
  bodas:        { es: "tu boda",                    en: "your wedding" },
  corporativo:  { es: "tu evento de empresa",       en: "your company event" },
  quinces:      { es: "los quince",                 en: "the quinceañera" },
  graduaciones: { es: "la graduación",              en: "the graduation" },
  popups:       { es: "tu pop-up",                  en: "your pop-up" },
  produccion:   { es: "tu rodaje",                  en: "your shoot" },
  artbasel:     { es: "Art Basel",                  en: "Art Basel" },
  finDeAno:     { es: "la fiesta de fin de año",    en: "the holiday party" },
  pequenos:     { es: "tu evento",                  en: "your event" },
};

/**
 * EL TIPO DE EVENTO QUE YA DICE LA PÁGINA (ley de Hick, 30-sep). Quien llega a /bodas no tiene que volver a
 * decir que es una boda: el formulario llega con la opción elegida y se puede cambiar. Donde la página no lo
 * sabe (los espacios, la guía, el barrio, la FAQ) se deja vacío. Los valores son los de TIPOS en Formulario.tsx.
 */
const TIPO: Partial<Record<string, string>> = {
  bodas: "Fiesta privada", bodasIntimas: "Fiesta privada", finDeSemanaBoda: "Fiesta privada", showers: "Fiesta privada",
  quinces: "Fiesta privada", sweet16: "Fiesta privada", cumpleanosAdultos: "Fiesta privada", graduaciones: "Fiesta privada",
  salonVsJardin: "Fiesta privada", pequenos: "Fiesta privada",
  corporativo: "Corporativo", offsite: "Corporativo", finDeAno: "Corporativo",
  popups: "Activación de marca", artbasel: "Activación de marca", swimWeek: "Activación de marca",
  produccion: "Rodaje / producción",
};

const FAMILIA: Record<string, "espacio" | "ocasion" | "referencia"> = {
  swimWeek: "ocasion",
  sweet16: "ocasion",
  salonVsJardin: "referencia",
  finDeSemanaBoda: "ocasion",
  showers: "ocasion",
  bodasIntimas: "ocasion",
  cumpleanosAdultos: "ocasion",
  offsite: "ocasion",
  jardin: "espacio", tikiHut: "espacio",
  bodas: "ocasion", corporativo: "ocasion", quinces: "ocasion",
  graduaciones: "ocasion", popups: "ocasion", produccion: "ocasion",
  artbasel: "ocasion", finDeAno: "ocasion", pequenos: "ocasion",
  aforos: "referencia", guia: "referencia", barrio: "referencia",
};

/**
 * Enlazado interno. Sin esto las interiores quedan huérfanas para el rastreador.
 *
 * ANTES LISTABA LAS TRECE. Desde una página de bodas ofrecía rodajes, pop-ups y
 * Art Basel — trece enlaces de los que doce no venían a cuento. Eso no es
 * navegación, es un vertedero: no ayuda a quien lee y reparte el peso de enlace
 * entre trece destinos en vez de concentrarlo donde importa.
 *
 * Ahora enseña como mucho cinco, y elegidos: primero las de su misma familia
 * —si estás mirando bodas, lo que se parece son quinceañeras y graduaciones—,
 * después los dos espacios, que valen desde cualquier página porque son lo que
 * de verdad se alquila, y al final las preguntas.
 */
function Seguir({ lang, actual }: { lang: Idioma; actual: ClaveRuta }) {
  const es = lang === "es";
  const miFamilia = FAMILIA[actual];

  const mismas = PAGINAS.filter((p) => p.clave !== actual && FAMILIA[p.clave] === miFamilia);
  const espacios = PAGINAS.filter((p) => p.clave !== actual && FAMILIA[p.clave] === "espacio");

  /**
   * LAS TRES HERMANAS SE ELIGEN EN RUEDA, NO SIEMPRE LAS TRES PRIMERAS.
   *
   * Medido el 10-sep-2026 con la auditoría de contenido: **diez páginas del
   * venue no recibían ni un enlace desde el cuerpo de ninguna otra** —pop-ups,
   * graduaciones, eventos pequeños, fin de año, Art Basel, en los dos idiomas—.
   * La familia «ocasión» tiene nueve páginas y `slice(0, 3)` devolvía siempre
   * bodas, corporativo y quinceañeras: las seis restantes solo vivían del pie.
   * Para el rastreador eso son páginas huérfanas, y para quien lee, un
   * «relacionado» que repite lo mismo en todas partes.
   *
   * Ahora cada página arranca la rueda en la posición siguiente a la suya
   * dentro de su familia, así que las nueve se reparten los enlaces entre sí de
   * forma pareja y determinista: la misma página enlaza siempre a las mismas
   * tres, pero cada una recibe enlaces de otras tres. Es un anillo, no una
   * lista con cabecera fija.
   */
  const familiaEntera = PAGINAS.filter((p) => FAMILIA[p.clave] === miFamilia);
  const miIndice = Math.max(0, familiaEntera.findIndex((p) => p.clave === actual));
  const enRueda = mismas.length
    ? Array.from({ length: Math.min(3, mismas.length) }, (_, i) =>
        familiaEntera[(miIndice + 1 + i) % familiaEntera.length])
      .filter((p) => p.clave !== actual)
    : [];

  // Sin repetidos y con tope: tres de su familia en rueda y los espacios para rellenar.
  const vistos = new Set<string>();
  const elegidas = [...enRueda, ...espacios]
    .filter((p) => !vistos.has(p.clave) && vistos.add(p.clave))
    .slice(0, 5);
  /** Fotos ya enseñadas en las tarjetas: ninguna se repite. */
  const miniaturas = new Set<string>();

  return (
    <section style={{ borderBottom: "1px solid var(--regla)" }}>
      <div className="reja" style={{ paddingBlock: 66 }}>
        <div className="ojo" style={{ marginBottom: 24 }}>
          {es ? "Relacionado" : "Related"}
        </div>
        {/* Con la foto de cada página: se elige mirando, no leyendo trece títulos seguidos. */}
        <div className="int-seguir">
          {elegidas.map((o) => {
            const f = miniaturaDe(o, lang, miniaturas);
            return (
              <a key={o.clave} href={href(o.clave, lang)} className="int-tarjeta">
                <div className="int-marco int-marco--tarjeta">
                  {f && (
                    <Image
                      src={f.src}
                      alt=""
                      fill
                      quality={70}
                      sizes="(min-width: 1280px) 400px, (min-width: 900px) 30vw, 50vw"
                      style={{ objectFit: "cover", objectPosition: f.encuadre }}
                    />
                  )}
                </div>
                <span className="int-tarjeta-t">
                  {o.h1[lang]} <span aria-hidden style={{ color: "var(--ocre)" }}>→</span>
                </span>
              </a>
            );
          })}
        </div>
        {actual !== "faq" && (
          <a href={href("faq", lang)} className="int-faq">
            {es ? "Preguntas frecuentes" : "Frequently asked questions"} <span aria-hidden style={{ color: "var(--ocre)" }}>→</span>
          </a>
        )}
      </div>
    </section>
  );
}

// Solo existen las rutas de generateStaticParams: cualquier otro slug es 404.
// Sin esto, /es/cualquier-cosa devolvería 200 con una página vacía, que es
// contenido basura indexable.
export const dynamicParams = false;

/**
 * Rutas por idioma.
 *
 * El sitio anterior servía español e inglés en la MISMA URL con `<span data-l>`
 * y CSS ocultando uno. Para un rastreador eso es una sola página con el
 * contenido duplicado en dos idiomas: no hay hreflang posible, ninguno de los
 * dos posiciona bien, y un modelo que lea el HTML crudo ve las dos versiones
 * pegadas una detrás de otra. Fue el defecto de SEO más grave que encontró la
 * auditoría.
 */

export const IDIOMAS = ["es", "en"] as const;
export type Idioma = (typeof IDIOMAS)[number];
export const IDIOMA_POR_DEFECTO: Idioma = "es";

/** Código BCP-47 para <html lang> y hreflang. */
export const BCP47: Record<Idioma, string> = { es: "es-US", en: "en-US" };

/**
 * Next genera los tipos de `params` con `lang: string`, no con nuestra unión.
 * Esto lo estrecha en un solo sitio en vez de repartir casts por las rutas —y
 * de paso valida de verdad: un /fr/ que se colara caería al idioma por defecto
 * en vez de romper en tiempo de ejecución.
 */
export function asIdioma(v: string): Idioma {
  return (IDIOMAS as readonly string[]).includes(v)
    ? (v as Idioma)
    : IDIOMA_POR_DEFECTO;
}

/**
 * Base de todas las URLs absolutas: canonical, hreflang, sitemap, JSON-LD.
 *
 * El orden importa. Mientras no exista el dominio propio, apuntar los canonical
 * a clubwynwood.com sería declarar como versión buena una URL que no resuelve:
 * el rastreador la intenta, falla, y puede acabar sin indexar ninguna de las
 * dos. Vercel expone la URL de producción en VERCEL_PROJECT_PRODUCTION_URL, así
 * que el sitio se declara a sí mismo hasta que el dominio esté.
 *
 * Cuando se compre el dominio: basta poner NEXT_PUBLIC_BASE_URL en Vercel.
 */
export const BASE = (() => {
  const explicita = process.env.NEXT_PUBLIC_BASE_URL;
  if (explicita) return explicita.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;
  return "http://localhost:3200";
})();

/**
 * ¿Se deja indexar este sitio?
 *
 * Daniel: "no pongas el robots aún, yo tengo GoDaddy para el sitio pero aún no
 * lo vamos a mover hasta que tengamos una mejor versión".
 *
 * Tiene razón y es urgente: mientras esto viva en una URL de Vercel, dejar
 * entrar a los rastreadores significa que Google puede indexar el preview como
 * un sitio duplicado del que ya está en línea. Limpiar eso después cuesta
 * semanas de recrawl, y encima los dos se harían competencia.
 *
 * Se ata al MISMO interruptor que el dominio: solo se indexa cuando
 * NEXT_PUBLIC_BASE_URL está puesta, o sea cuando el sitio ya vive en su dominio
 * de verdad. Un solo cambio en Vercel abre las tres cosas a la vez —canonicals
 * correctos, robots abierto y metadata indexable— y no hay forma de abrir una y
 * olvidar las otras.
 */
export const INDEXABLE = Boolean(process.env.NEXT_PUBLIC_BASE_URL);

/**
 * Las rutas se traducen: /es/el-jardin y /en/the-garden.
 * Una URL en inglés que dice "el-jardin" es una señal contradictoria para el
 * rastreador y se lee peor para el visitante.
 */
export const RUTAS = {
  home: { es: "", en: "" },
  jardin: { es: "el-jardin", en: "the-garden" },
  tikiHut: { es: "tiki-hut", en: "tiki-hut" },
  bodas: { es: "bodas", en: "weddings" },
  corporativo: { es: "eventos-corporativos", en: "corporate-events" },
  produccion: { es: "produccion-y-rodajes", en: "film-and-production" },
  faq: { es: "preguntas-frecuentes", en: "faq" },
  guia: { es: "organizar-un-evento-en-wynwood", en: "hosting-an-event-in-wynwood" },
  quinces: { es: "quinceaneras", en: "quinceaneras" },
  aforos: { es: "aforo-y-montajes", en: "capacity-and-layouts" },
} as const;

export type ClaveRuta = keyof typeof RUTAS;

/** URL absoluta de una página en un idioma. */
export function url(clave: ClaveRuta, lang: Idioma): string {
  const seg = RUTAS[clave][lang];
  return seg ? `${BASE}/${lang}/${seg}` : `${BASE}/${lang}`;
}

/** Ruta relativa, para los <Link> internos. */
export function href(clave: ClaveRuta, lang: Idioma): string {
  const seg = RUTAS[clave][lang];
  return seg ? `/${lang}/${seg}` : `/${lang}`;
}

/**
 * Bloque de alternativas para el `metadata` de cada página.
 * Google exige que las declaraciones sean RECÍPROCAS: si /es/ apunta a /en/,
 * /en/ tiene que apuntar de vuelta. Generarlo desde una función lo garantiza;
 * escribirlo a mano es donde se rompe siempre.
 */
export function alternativas(clave: ClaveRuta) {
  const languages: Record<string, string> = {};
  for (const l of IDIOMAS) languages[BCP47[l]] = url(clave, l);
  languages["x-default"] = url(clave, IDIOMA_POR_DEFECTO);
  return { canonical: url(clave, IDIOMA_POR_DEFECTO), languages };
}

/** Todas las páginas de todos los idiomas. Lo usan sitemap y llms.txt. */
export function todasLasRutas(): Array<{ clave: ClaveRuta; lang: Idioma; url: string }> {
  const out: Array<{ clave: ClaveRuta; lang: Idioma; url: string }> = [];
  for (const clave of Object.keys(RUTAS) as ClaveRuta[]) {
    for (const lang of IDIOMAS) out.push({ clave, lang, url: url(clave, lang) });
  }
  return out;
}

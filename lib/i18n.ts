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

export const BASE =
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ??
  "https://clubwynwood.com";

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

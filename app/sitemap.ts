import type { MetadataRoute } from "next";
import { BCP47, IDIOMAS, RUTAS, todasLasRutas, url, type ClaveRuta } from "@/lib/i18n";

/**
 * Sitemap con alternativas por idioma.
 *
 * El sitemap anterior tenía dos problemas que marcó la auditoría:
 *   - <priority> en las 7 URLs. Google lo ignora desde hace años.
 *   - ningún <lastmod>. Eso sí lo lee.
 *
 * Aquí además cada URL declara sus alternativas de idioma, que es la forma que
 * Google recomienda para sitios multi-idioma: más fiable que meter hreflang solo
 * en el <head>, porque el sitemap se procesa aunque la página no se re-rastree.
 *
 * lastmod sale del commit, no de Date.now(): una fecha que cambia en cada build
 * sin que cambie el contenido es exactamente el patrón de "toques programados"
 * que Google aprendió a descontar.
 */
const LASTMOD = new Date(
  process.env.VERCEL_GIT_COMMIT_DATE ?? process.env.FECHA_BUILD ?? "2026-08-14"
);

export default function sitemap(): MetadataRoute.Sitemap {
  return todasLasRutas().map(({ clave, lang, url: loc }) => ({
    url: loc,
    lastModified: LASTMOD,
    changeFrequency: clave === "home" ? ("weekly" as const) : ("monthly" as const),
    alternates: {
      languages: Object.fromEntries(
        IDIOMAS.map((l) => [BCP47[l], url(clave as ClaveRuta, l)])
      ),
    },
  }));
}

/** Se exporta para que un test pueda comprobar que salen 7 x 2 = 14 URLs. */
export const TOTAL_URLS = Object.keys(RUTAS).length * IDIOMAS.length;

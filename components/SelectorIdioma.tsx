"use client";

import { usePathname } from "next/navigation";
import { IDIOMAS, RUTAS, type ClaveRuta, type Idioma } from "@/lib/i18n";

/**
 * Cambia de idioma manteniendo la MISMA página.
 *
 * En el sitio anterior el cambio de idioma no tocaba la URL —los dos idiomas
 * vivían en el mismo HTML— así que no había nada que resolver. Ahora las rutas
 * están traducidas (/es/el-jardin ↔ /en/the-garden) y hay que mapear el
 * segmento actual a su equivalente. Mandar siempre a la home sería perder al
 * visitante en cada cambio.
 */
export default function SelectorIdioma({ lang }: { lang: Idioma }) {
  const pathname = usePathname() ?? `/${lang}`;
  const otro: Idioma = lang === "es" ? "en" : "es";

  // /es/el-jardin -> ["es", "el-jardin"]
  const partes = pathname.split("/").filter(Boolean);
  const segActual = partes[1] ?? "";

  const clave = (Object.keys(RUTAS) as ClaveRuta[]).find(
    (k) => RUTAS[k][lang] === segActual
  );

  const segOtro = clave ? RUTAS[clave][otro] : "";
  const destino = segOtro ? `/${otro}/${segOtro}` : `/${otro}`;

  return (
    <a
      href={destino}
      hrefLang={otro}
      aria-label={otro === "en" ? "Switch to English" : "Cambiar a español"}
      style={{
        border: "1px solid var(--regla-osc)",
        color: "var(--papel)",
        height: 30,
        display: "inline-flex",
        alignItems: "center",
        padding: "0 12px",
        fontFamily: "var(--mono)",
        fontSize: 10,
        letterSpacing: ".2em",
        textDecoration: "none",
      }}
    >
      {otro.toUpperCase()}
    </a>
  );
}

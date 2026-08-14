import type { MetadataRoute } from "next";
import { BASE, INDEXABLE } from "@/lib/i18n";

/**
 * robots.txt EN LA RAÍZ DEL DOMINIO.
 *
 * Este archivo es la mitad del motivo de la migración. En GitHub Pages el sitio
 * vivía en /club-wynwood/, así que nuestro robots.txt quedaba en
 * /club-wynwood/robots.txt — donde ningún rastreador mira. La auditoría lo marcó
 * como 404 y dejó sin puntuar el componente de mayor peso (25%) de la
 * visibilidad para IA.
 *
 * PERO mientras el sitio viva en una URL de Vercel va CERRADO. Indexar el
 * preview significaría crear un duplicado del sitio que ya está en línea, y los
 * dos compitiendo entre sí. Se abre solo cuando NEXT_PUBLIC_BASE_URL apunta al
 * dominio de verdad. Ver INDEXABLE en lib/i18n.ts.
 */
const RASTREADORES_IA = [
  "GPTBot",          // OpenAI, entrenamiento
  "OAI-SearchBot",   // OpenAI, búsqueda en ChatGPT
  "ChatGPT-User",    // navegación en vivo desde ChatGPT
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended", // Gemini / Vertex
  "Applebot-Extended",
  "meta-externalagent",
  "Bytespider",
  "cohere-ai",
  "Diffbot",
  "Amazonbot",
];

export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) {
    // Puerta cerrada, sin excepciones y sin sitemap: no se le da a nadie un
    // mapa de un sitio que no queremos que se indexe todavía.
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  // Los rastreadores de IA se declaran uno a uno y EN POSITIVO: muchos sitios
  // los bloquean por defecto sin querer, y aquí nos interesa que entren, porque
  // el objetivo es que citen el venue cuando alguien pregunte por espacios de
  // eventos en Wynwood.
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...RASTREADORES_IA.map((ua) => ({ userAgent: ua, allow: "/" })),
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}

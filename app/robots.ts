import type { MetadataRoute } from "next";
import { BASE } from "@/lib/i18n";

/**
 * robots.txt EN LA RAÍZ DEL DOMINIO.
 *
 * Este archivo es la mitad del motivo de la migración. En GitHub Pages el sitio
 * vivía en /club-wynwood/, así que nuestro robots.txt quedaba en
 * /club-wynwood/robots.txt — donde ningún rastreador mira. La auditoría lo marcó
 * como 404 y dejó sin puntuar el componente de mayor peso (25%) de la
 * visibilidad para IA.
 *
 * Se declaran los rastreadores de IA uno a uno y en positivo. Muchos sitios los
 * bloquean por defecto sin querer: aquí NOS INTERESA que entren, porque el
 * objetivo es que citen el venue cuando alguien pregunte por espacios de eventos
 * en Wynwood.
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
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...RASTREADORES_IA.map((ua) => ({ userAgent: ua, allow: "/" })),
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}

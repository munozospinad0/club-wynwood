import type { NextConfig } from "next";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * POR QUÉ ESTE ARCHIVO NO EXISTÍA Y AHORA SÍ
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * El proyecto corría con los valores por defecto, y dos de ellos costaban caro
 * en un sitio que es, esencialmente, fotografías de un sitio que no se puede
 * visitar:
 *
 * 1. **El optimizador servía WebP y no AVIF.** AVIF pesa entre un 20 % y un
 *    40 % menos que WebP con la misma calidad, y lo entienden todos los
 *    navegadores que importan desde 2024. Se ponen los dos y el navegador
 *    escoge: quien no admita AVIF recibe WebP como hasta ahora.
 *
 * 2. **`Cache-Control: max-age=60, must-revalidate`.** Medido el 9-sep-2026:
 *    un minuto. Las fotos del predio no cambian nunca —y si cambian, cambia el
 *    nombre del archivo—, así que revalidar cada minuto obliga a rehacer el
 *    trabajo una y otra vez y hace que la segunda visita sea tan lenta como la
 *    primera. Un año es lo correcto para contenido inmutable.
 *
 * El otro problema del mismo día, el gordo, no se arregla aquí sino en
 * `lib/imagen.ts`: la galería pedía los archivos ORIGINALES, saltándose el
 * optimizador entero. 5.676 KB de los 6.415 KB de la portada.
 */
const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    /** Un año. Las fotos son inmutables; si una cambia, cambia su nombre. */
    minimumCacheTTL: 31536000,
    /**
     * Desde Next 15.4 hay que declarar las calidades que se van a pedir: las que
     * no estén en esta lista se rechazan. Son las tres que usa `lib/imagen.ts`
     * —70 para fotografía, 78 para el visor a pantalla completa— más la 75 por
     * defecto de `next/image`, que usan las páginas que no pasan por el helper.
     */
    qualities: [70, 75, 78],
  },
};

export default nextConfig;

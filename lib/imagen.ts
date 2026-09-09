/**
 * PEDIR UNA FOTO POR EL OPTIMIZADOR, DESDE UN `<img>` NORMAL.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * POR QUÉ EXISTE
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * `next/image` optimiza solo, pero no se puede usar en todas partes: la galería
 * necesita un `<img>` suelto dentro de un `<button>` y con su propio visor, y el
 * recorrido pinta las fotos dentro de un lienzo con posicionamiento propio.
 * En esos sitios el componente estorba más de lo que ayuda.
 *
 * El problema es lo que pasaba mientras tanto. Medido el 9-sep-2026 con un
 * navegador real contra el servidor de producción:
 *
 *     portada  →  6.415 KB en 24 imágenes
 *                 5.676 KB de ellos en 21 imágenes SIN pasar por el optimizador
 *
 * La galería pedía **el archivo original entero** para pintar una miniatura de
 * 280 px: 681 KB de `palapa-sonido.jpg` para un recuadro que ocupa la sexta
 * parte de eso. Veintiuna veces. Eso es lo que Daniel notaba como «el sitio va
 * lento», y ninguna recompresión del archivo de origen lo arregla, porque el
 * problema no es cuánto pesa la foto: es que se pide a tamaño completo.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * CÓMO SE USA
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * `optimizada(src, ancho)` devuelve la URL del optimizador para ese ancho. Se
 * pide **un solo ancho** y no un `srcSet` a propósito: en el recorrido la foto
 * se precarga y luego se muestra, y con `srcSet` el navegador elegía en el
 * teléfono una variante distinta de la precargada — descargaba dos veces y no
 * mejoraba nada. La regla se mantiene aquí para que no vuelva a pasar.
 *
 * Los anchos van en la constante de abajo en vez de sueltos por los
 * componentes, porque son una decisión de rendimiento y no de maquetación.
 */

/** Solo estos anchos: cada uno más es una variante más que el servidor genera y guarda. */
export const ANCHO = {
  /** Miniatura de la galería: la rejilla es de 280 px y se sirve al doble para pantallas densas. */
  miniatura: 640,
  /** La foto dentro del recorrido y del visor a pantalla completa. */
  grande: 1200,
  /** El visor de la galería, que es donde alguien mira el detalle. */
  visor: 1920,
} as const;

/**
 * La calidad es 70 y no 75 (el valor por defecto) porque el salto de peso entre
 * ambos es del 25 % y la diferencia no se ve en fotografía de exteriores. En un
 * plano o en un dibujo sí se notaría, pero esos son SVG y no pasan por aquí.
 */
export const optimizada = (src: string, w: number = ANCHO.grande, q = 70) =>
  `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=${q}`;

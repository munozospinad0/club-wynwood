import guion from "./recorrido.guion.json";
import type { Idioma } from "@/lib/i18n";

/**
 * EL RECORRIDO GUIADO. El guion vive en `recorrido.guion.json` y lo leen dos
 * cosas: este módulo (para el reproductor) y `herramientas/generar-recorrido.mjs`
 * (para locutarlo con ElevenLabs). Un solo texto, para que la voz y los
 * subtítulos no se desincronicen nunca.
 *
 * Cada capítulo contesta UNA pregunta de productor, en el orden en que las
 * hace. Los `hitos` son frases literales del guion: cuando la voz llega a esa
 * frase, el dibujo cambia (modo, zona, a dónde camina el guía y **cuánto se
 * acerca la cámara**). Se anclan al audio con el alineamiento palabra a
 * palabra, nunca con tiempos fijos; es la misma regla que en Loymark Academy, y
 * por lo mismo: si el audio cambia, los tiempos se recalculan solos.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * LA CÁMARA (versión 2 del guion, 6-sep-2026)
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Daniel: «darle más calidad… un video más completo, animado». Lo que separaba
 * al recorrido de un vídeo no era la voz ni el dibujo: era que el encuadre no
 * se movía nunca. Una marca de nueve píxeles caminaba por un dibujo de dos mil,
 * y la persona tenía que buscarla. Ahora cada hito trae `zoom`: la cámara se
 * acerca a la zona de la que se habla y vuelve a abrir cuando la frase cambia
 * de tema. Es el plano y el contraplano de un documental, hecho con CSS.
 */

export type ModoRecorrido = "todo" | "lluvia" | "carpa" | "mesas" | "gente" | "camion" | "noche" | "barra";
export type ZonaRecorrido = "jardin" | "tiki" | "cabanas" | "acceso" | "edificio";
/** Desde dónde se mira el dibujo (las cinco cámaras de `lib/recinto.geo.ts`). Por defecto, el sur. */
export type VistaRecorrido = "sur" | "norte" | "este" | "oeste" | "aerea";
export type Pt = [number, number];

export interface Hito {
  frase: string;
  modo?: ModoRecorrido;
  zona?: ZonaRecorrido | null;
  /** Cambia la cámara al llegar la frase: el load-in se cuenta desde el oeste, donde está el portón de carga. */
  vista?: VistaRecorrido;
  punto?: Pt | null;
  /** 1 = el recinto entero. 1,8 = la palapa llenando el encuadre. */
  zoom?: number;
  /**
   * UNA FOTO REAL, unos segundos, encima del dibujo. Daniel, 6-sep-2026:
   * «si puedes usar fotos también, haz el video más dinámico». La foto entra
   * cuando la voz llega a la frase y se retira sola a los `segundos`; el dibujo
   * sigue debajo, así que al retirarse ya está en el encuadre que toca.
   */
  foto?: keyof typeof FOTOS;
  segundos?: number;
  /** La cifra que se está diciendo, junto a la marca: «240 ft · 73 m». `null` la quita. */
  cifra?: string | null;
  /** Capas aditivas que se encienden («pasillos», «truss», «luces»…) o se apagan al llegar la frase. */
  agregar?: string[];
  quitar?: string[];
}

/**
 * LAS FOTOS QUE PUEDE ENSEÑAR EL RECORRIDO. Solo las que no llevan la marca
 * del operador en cuadro: las dos aéreas, el interior de la palapa (de día
 * con luz verde y de noche con un montaje de sonido), el paseo entre palmeras
 * recortado por debajo del mural, y la cenital de un evento al anochecer.
 * `pos` es el `object-position`: dónde queda el encuadre al recortar.
 */
/**
 * `tamano`: «lleno» ocupa todo el cuadro (solo las que tienen píxeles para
 * ello: 1 600 o más de ancho); «postal» se enseña a su tamaño natural como una
 * foto enmarcada sobre el dibujo atenuado, con pie. Daniel: «que las fotos no se
 * vean borrosas». Las aéreas vienen de Flickr a 1 024 px (la fotógrafa limita
 * la descarga a ese tamaño) y ampliarlas a 1080p las ablanda; a tamaño natural
 * se ven nítidas y la postal se lee como una elección, no como una carencia.
 */
/**
 * LA MISMA URL PARA MOSTRAR Y PARA PRECARGAR. Que no sean la misma es un fallo
 * silencioso y caro.
 *
 * Las fotos del recorrido son JPEG originales de hasta 861 KB. Servidas en
 * crudo son lo más pesado del recorrido, y en un teléfono se notan. Pasadas por
 * el optimizador de imágenes salen en WebP o AVIF al ancho que de verdad se ve,
 * varias veces más ligeras y sin tocar el archivo del repositorio.
 *
 * El motivo de que esto viva aquí y no en cada componente: el 9-sep-2026 la
 * precarga se cambió para pedir la versión optimizada mientras el cine seguía
 * mostrando la cruda. **Calentaba una URL que nadie usaba y descargaba el JPEG
 * igual**, o sea el doble de tráfico y ninguna mejora. Con una sola función,
 * mostrar y precargar no pueden volver a separarse.
 *
 * El ancho es fijo a propósito. Con `srcSet` el navegador elegiría en el
 * teléfono una variante distinta de la que se precargó, y se volvería al mismo
 * problema; 1200 px se ve nítido en cualquier pantalla y pesa una fracción del
 * original.
 */
export const ANCHO_FOTO_RECORRIDO = 1200;
export const fotoOptimizada = (src: string) =>
  `/_next/image?url=${encodeURIComponent(src)}&w=${ANCHO_FOTO_RECORRIDO}&q=70`;

export const FOTOS = {
  /* La aérea completa lleva el rótulo del operador en el edificio del fondo.
     Se encuadra hacia la izquierda y abajo para que quede fuera del recorte. */
  aerea: { src: "/assets/aerea-predio.jpg", pos: "22% 78%", tamano: "postal", alt: { es: "El predio desde el aire: la palapa, el paseo y el jardín", en: "The site from the air: the structure, the walk and the garden" } },
  palmeras: { src: "/assets/palmeras-aerea.jpg", pos: "45% 50%", tamano: "postal", alt: { es: "Las dos hileras de palmeras sobre el césped y la palapa", en: "The two rows of palms over the turf and the structure" } },
  palapa: { src: "/assets/venue-palapa.webp", pos: "50% 45%", tamano: "postal", alt: { es: "Bajo la palapa: paja sobre madera, abierta por los costados", en: "Under the structure: thatch on timber, open on the sides" } },
  montaje: { src: "/assets/palapa-montaje.jpg", pos: "50% 50%", tamano: "postal", alt: { es: "Un montaje de sonido e iluminación bajo la palapa", en: "A sound and lighting setup under the structure" } },
  paseo: { src: "/assets/paseo-palmeras.jpg", pos: "50% 50%", tamano: "postal", alt: { es: "El paseo pavimentado entre las dos hileras de palmeras", en: "The paved walk between the two rows of palms" } },
  noche: { src: "/assets/recinto-noche.jpg", pos: "50% 50%", tamano: "postal", alt: { es: "El recinto al anochecer durante un evento, visto desde arriba", en: "The site at dusk during an event, seen from above" } },
  // Del flyer de Newmark (LoopNet), 7-sep-2026: las más nítidas que hay del predio. Ninguna con la marca del operador en cuadro.
  cenital: { src: "/assets/flyer-cenital.jpg", pos: "50% 50%", tamano: "postal", alt: { es: "El predio desde arriba: la palapa, el área de arena, las pérgolas y el paseo", en: "The site from above: the structure, the sand area, the pergolas and the walk" } },
  aereaPalapa: { src: "/assets/flyer-aerea-palapa.jpg", pos: "50% 50%", tamano: "postal", alt: { es: "La palapa y las palmeras desde el aire", en: "The thatched structure and the palms from the air" } },
  lounge: { src: "/assets/flyer-palapa-lounge.jpg", pos: "50% 50%", tamano: "postal", alt: { es: "Bajo la palapa: un montaje lounge con barra", en: "Under the structure: a lounge setup with a bar" } },
  cabanas: { src: "/assets/flyer-cabanas.jpg", pos: "50% 50%", tamano: "postal", alt: { es: "Las cabañas: pérgolas con cortinas y sofás entre las palmeras", en: "The cabanas: pergolas with curtains and sofas among the palms" } },
  puerta: { src: "/assets/flyer-paseo-puerta.jpg", pos: "50% 50%", tamano: "postal", alt: { es: "El paseo pavimentado hasta la puerta del edificio", en: "The paved walk up to the building door" } },
  coctel: { src: "/assets/flyer-palapa-coctel.jpg", pos: "50% 50%", tamano: "postal", alt: { es: "Bajo la palapa: mesas de cóctel y guirnaldas entre los cabios", en: "Under the structure: cocktail tables and string lights among the rafters" } },
} as const;
export type FotoRecorrido = keyof typeof FOTOS;

export interface Capitulo {
  id: string;
  modo: ModoRecorrido;
  zona: ZonaRecorrido | null;
  punto: Pt | null;
  zoom: number;
  /** Cámara con la que arranca el capítulo; si no viene, el sur. */
  vista?: VistaRecorrido;
  /** Capas encendidas al empezar el capítulo. */
  capas?: string[];
  pregunta: Record<Idioma, string>;
  texto: Record<Idioma, string>;
  hitos: Record<Idioma, Hito[]>;
}

export const CAPITULOS = guion.capitulos as Capitulo[];
export const VERSION_GUION = guion.version;

/** Ruta de los archivos de audio de un capítulo. Se sirven desde /public. */
export function rutaAudio(lang: Idioma, indice: number): { mp3: string; palabras: string } {
  const nn = String(indice + 1).padStart(2, "0");
  return {
    mp3: `/audio/recorrido/${lang}/${nn}.mp3`,
    palabras: `/audio/recorrido/${lang}/${nn}.words.json`,
  };
}

/**
 * Lo que escribe `generar-recorrido.mjs` al terminar. `duraciones` es nuevo:
 * lo lee el modo de grabación para avanzar los capítulos con un reloj exacto
 * aunque el navegador no reproduzca audio (en una grabación sin altavoces, por
 * ejemplo). Sin él, el vídeo exportado y su pista de voz se desfasarían.
 */
export interface Manifiesto {
  version: string;
  total: number;
  idiomas: Array<{ idioma: Idioma; capitulos: number }>;
  duraciones?: Partial<Record<Idioma, number[]>>;
}

export interface Palabra { w: string; start: number; end: number }

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ñ]+/g, " ").trim();

/**
 * En qué segundo empieza una frase del guion, según el alineamiento.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * POR QUÉ NO BUSCA POR TOKENS SUELTOS
 * ─────────────────────────────────────────────────────────────────────────
 *
 * La primera versión comparaba los DOS primeros tokens de la frase contra la
 * lista de palabras, una a una. Falla de dos maneras, y las dos aparecieron en
 * el audio real en cuanto se auditó:
 *
 * 1. **Las palabras con guion nunca casan.** El alineamiento devuelve
 *    `forty-foot` como UNA palabra; al normalizarla se convierte en dos
 *    («forty foot») y ya no puede ser igual a un token suelto. El hito «A
 *    forty-foot truck» no se encontraba nunca, y el dibujo cambiaba a ojo.
 *
 * 2. **Dos tokens no distinguen nada.** El hito «What is not here» arrancaba
 *    con «what is», que son también las dos primeras palabras del capítulo
 *    («What is here, and what is not?»). Casaba en el segundo 0,0: el dibujo
 *    hacía el último cambio del capítulo antes de empezar a hablar.
 *
 * Ahora se busca la frase ENTERA sobre el texto aplanado, y se traduce la
 * posición encontrada al índice de palabra. Es inmune a los guiones —el aplanado
 * los deshace por igual en los dos lados— y una frase completa es única.
 */
export function tiempoDeFrase(frase: string, texto: string, palabras: Palabra[], duracion: number): number {
  const objetivo = norm(frase);

  if (objetivo && palabras.length) {
    // El texto dicho, aplanado, con la posición donde empieza cada palabra.
    const inicios: number[] = [];
    let plano = "";
    for (const p of palabras) {
      const w = norm(p.w);
      if (!w) { inicios.push(plano.length); continue; }
      if (plano) plano += " ";
      inicios.push(plano.length);
      plano += w;
    }

    const donde = plano.indexOf(objetivo);
    if (donde >= 0) {
      // La última palabra que empieza en o antes de la posición encontrada.
      let i = 0;
      for (let k = 0; k < inicios.length; k++) if (inicios[k] <= donde) i = k; else break;
      return palabras[i].start;
    }
  }

  // No está dicha así. Se estima por la posición de la frase en el texto,
  // proporcional a la duración: peor que exacto, mejor que no mover nada.
  const pos = texto.indexOf(frase);
  if (pos < 0 || !duracion) return 0;
  return (pos / texto.length) * duracion;
}

export interface Oracion {
  texto: string;
  inicio: number;
  /** Cada palabra de la oración con el segundo en que se dice. Vacío si no hay alineamiento. */
  palabras: Array<{ w: string; start: number }>;
}

/**
 * Las oraciones del texto, con el segundo en que empieza cada una Y sus
 * palabras cronometradas.
 *
 * Las palabras son lo que permite el subtítulo tipo karaoke: cada palabra se
 * enciende cuando la voz llega a ella. Se emparejan por CONTEO, no por texto:
 * la oración k-ésima consume tantas palabras del alineamiento como palabras
 * tiene. Es robusto a las diferencias de puntuación y de normalización entre
 * lo escrito y lo dicho, que era donde fallaba emparejar por igualdad.
 */
export function oraciones(texto: string, palabras: Palabra[], duracion: number): Oracion[] {
  const partes = texto.split(/(?<=[.?!:;])\s+/).map((s) => s.trim()).filter(Boolean);
  let consumidas = 0;
  return partes.map((p) => {
    const tokens = p.split(/\s+/);
    let inicio: number;
    const cronometradas: Array<{ w: string; start: number }> = [];
    if (palabras.length) {
      inicio = palabras[Math.min(consumidas, palabras.length - 1)]?.start ?? 0;
      tokens.forEach((w, i) => {
        const al = palabras[Math.min(consumidas + i, palabras.length - 1)];
        cronometradas.push({ w, start: al?.start ?? inicio });
      });
    } else {
      inicio = (duracion * texto.indexOf(p)) / Math.max(1, texto.length);
    }
    consumidas += tokens.length;
    return { texto: p, inicio, palabras: cronometradas };
  });
}

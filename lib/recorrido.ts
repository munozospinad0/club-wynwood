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
 * frase, el dibujo cambia (modo, zona, y a dónde camina el guía). Se anclan al
 * audio con el alineamiento palabra a palabra, nunca con tiempos fijos; es la
 * misma regla que en Loymark Academy, y por lo mismo: si el audio cambia, los
 * tiempos se recalculan solos.
 */

export type ModoRecorrido = "todo" | "lluvia" | "mesas" | "camion";
export type ZonaRecorrido = "jardin" | "tiki" | "cabanas" | "acceso" | "edificio";
export type Pt = [number, number];

export interface Hito {
  frase: string;
  modo?: ModoRecorrido;
  zona?: ZonaRecorrido | null;
  punto?: Pt;
}

export interface Capitulo {
  id: string;
  modo: ModoRecorrido;
  zona: ZonaRecorrido | null;
  punto: Pt;
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

export interface Palabra { w: string; start: number; end: number }

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ñ]+/g, " ").trim();

/**
 * En qué segundo empieza una frase del guion, según el alineamiento.
 *
 * Busca los dos primeros tokens de la frase, seguidos, en la lista de
 * palabras. Si no aparecen (una palabra con guion, un número que la voz dijo
 * distinto), estima por la posición de la frase en el texto, proporcional a
 * la duración: peor que exacto, mejor que no mover nada.
 */
export function tiempoDeFrase(frase: string, texto: string, palabras: Palabra[], duracion: number): number {
  const tokens = norm(frase).split(" ").filter(Boolean);
  const lista = palabras.map((p) => norm(p.w));
  const n = Math.min(2, tokens.length);
  for (let i = 0; i + n <= lista.length; i++) {
    let ok = true;
    for (let k = 0; k < n; k++) if (lista[i + k] !== tokens[k]) { ok = false; break; }
    if (ok) return palabras[i].start;
  }
  const pos = texto.indexOf(frase);
  if (pos < 0 || !duracion) return 0;
  return (pos / texto.length) * duracion;
}

/** Las oraciones del texto, con el segundo en que empieza cada una. */
export function oraciones(texto: string, palabras: Palabra[], duracion: number): Array<{ texto: string; inicio: number }> {
  const partes = texto.split(/(?<=[.?!])\s+/).map((s) => s.trim()).filter(Boolean);
  let consumidas = 0;
  return partes.map((p) => {
    const inicio = palabras.length
      ? (palabras[Math.min(consumidas, palabras.length - 1)]?.start ?? 0)
      : (duracion * texto.indexOf(p)) / Math.max(1, texto.length);
    consumidas += p.split(/\s+/).length;
    return { texto: p, inicio };
  });
}

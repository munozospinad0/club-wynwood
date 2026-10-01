import { GALERIA, type FotoGaleria } from "./galeria";
import type { ClaveRuta, Idioma } from "./i18n";

/**
 * QUÉ FOTO VA EN CADA PARTE DE UNA PÁGINA INTERIOR (29-sep-2026).
 *
 * Daniel, viendo /en/corporate-events: «páginas como estas no me gustan, porque no tienen nada visual,
 * son solo texto vacío». Cada interior tenía UNA foto y después tres columnas de párrafos. Ahora el
 * texto va acompañado de lo que describe, y la foto se elige por lo que dice cada bloque: si habla de
 * lluvia, el pabellón; de carga, el portón de la calle; de cabañas, las cabañas.
 *
 * Solo fotos que se pueden enseñar, comprobadas una a una en la hoja de contactos:
 *  · FUERA `aerea-predio.jpg` y `venue-exterior.webp`: llevan el parche borroso del `delogo` sobre la
 *    marca del operador (ver lib/galeria.ts). Eran la foto principal de once páginas y la tarjeta al
 *    compartirlas; ahora cada una tiene una limpia.
 *  · FUERA `edificio-fachada.jpg`: lleva el logo de otra empresa (USJ International) en la fachada.
 *  · FUERA `edificio-calle.jpg` (30-sep): marca de agua de un portal inmobiliario; es de un listado ajeno.
 *  · `palapa-sonido` es la misma toma que `montaje`, y `cabanas` la misma que `cabanas-fila`: se usa
 *    una de cada par para que la misma foto no salga dos veces en una página.
 *  · `coctel` es muy vertical (548×1434) y no cabe en un marco apaisado sin perder casi todo.
 *
 * Las fotos de eventos anteriores llevan la nota de que ese montaje lo trajo otra producción: el sitio
 * alquila el espacio, no el mobiliario ni el sonido, y una foto también es una promesa.
 */

const USABLES = [
  "puerta", "palmeras", "cenital", "aerea-palapa", "bajo-palapa", "lounge", "montaje",
  "cabanas-fila", "noche", "contexto", "edificio-salon", "edificio-cocina",
] as const;
type Uso = (typeof USABLES)[number];

/** Montajes de producciones anteriores: el mobiliario, la luz y el sonido no vienen con el recinto. */
const MONTAJE_AJENO = new Set<string>(["lounge", "montaje", "noche", "bajo-palapa"]);

/** Encuadre dentro del marco, para fotos que no son apaisadas. */
const ENCUADRE: Partial<Record<string, string>> = {
  "aerea-palapa": "50% 58%",
  contexto: "50% 82%", // el rótulo del predio está abajo; arriba solo hay cielo y la bahía
  palmeras: "50% 60%",
};

/** La foto principal de cada página, cuando la de contenido.ts no sirve o se repetía demasiado. */
const HEROE: Partial<Record<ClaveRuta, Uso>> = {
  jardin: "puerta",
  bodas: "aerea-palapa",
  corporativo: "montaje",
  produccion: "puerta",
  guia: "cenital",
  quinces: "noche",
  aforos: "aerea-palapa",
  popups: "puerta",
  graduaciones: "lounge",
  barrio: "contexto",
  bodasIntimas: "bajo-palapa",
  showers: "cabanas-fila",
  salonVsJardin: "aerea-palapa",
  sweet16: "montaje",
};

/**
 * De qué habla un bloque → qué foto lo enseña. Se lee el texto en español (el mismo contenido que el
 * inglés) y gana el primer tema que aparece en el título; si el título no dice nada, el cuerpo.
 */
const TEMAS: Array<[RegExp, Uso[]]> = [
  [/lluvi|techad|cubierta|pabell|paja|sombra/i, ["aerea-palapa", "bajo-palapa", "montaje"]],
  [/cabañ/i, ["cabanas-fila"]],
  [/carga|load-in|portón|camion|camión|nw 1st|montaje y desmontaje|rodaje|filma|set\b/i, ["puerta", "cenital"]],
  [/barrio|wynwood walls|mural|mana|i-95|galer|entorno|ubicaci|dónde/i, ["contexto", "palmeras"]],
  [/sonido|dj|escenario|truss|luces|iluminaci|rigging|colgar|producci/i, ["montaje"]],
  [/barra|licor|cóctel|coctel|lounge|mobiliario|catering|proveedor/i, ["lounge", "bajo-palapa"]],
  [/cocina/i, ["edificio-cocina", "edificio-salon"]],
  [/edificio|baños|oficina|interior/i, ["edificio-salon", "edificio-cocina"]],
  [/noche|fiesta|baile|celebra|cumplea|quince|graduaci/i, ["noche", "montaje"]],
  [/aforo|invitados|mesas|sentad|de pie|capacidad|plano|cabe/i, ["cenital", "aerea-palapa"]],
  [/suelo|paseo|césped|arena|superficie|palmeras|pasarela|desfile/i, ["puerta", "palmeras", "cenital"]],
  [/ceremonia|boda|novi|ensayo|shower/i, ["aerea-palapa", "lounge", "cabanas-fila"]],
];
/** Si ningún tema encaja, se rellena en este orden (lo que mejor explica el lugar primero). */
const RELLENO: Uso[] = ["cenital", "palmeras", "cabanas-fila", "aerea-palapa", "puerta", "bajo-palapa", "noche"];

export interface FotoPagina {
  id: string;
  src: string;
  w: number;
  h: number;
  alt: string;
  /** Pie de foto: lo que se ve y, si es un montaje de otra producción, que lo trajo ella. */
  pie: string;
  encuadre: string;
}

const porId = new Map(GALERIA.map((f) => [f.id, f]));
const porSrc = new Map(GALERIA.map((f) => [f.src, f]));

function aFoto(f: FotoGaleria, lang: Idioma, texto?: { alt: string; pie: string }): FotoPagina {
  const nota = MONTAJE_AJENO.has(f.id)
    ? lang === "es" ? " Montaje de una producción anterior: cada evento trae el suyo." : " Set up by a previous production; each event brings its own."
    : "";
  const alt = texto?.alt ?? f.alt[lang];
  const pie = (texto?.pie ?? alt).replace(/\.$/, "");
  return { id: f.id, src: f.src, w: f.w, h: f.h, alt, pie: `${pie}.${nota}`, encuadre: ENCUADRE[f.id] ?? "50% 50%" };
}

/**
 * La foto principal de la página: la elegida aquí o, si la de contenido.ts se queda, esa misma con el
 * pie que se le escribió a mano (dice más que el genérico de la galería).
 */
export function heroeDe(
  clave: ClaveRuta,
  foto: { src: string; alt: Record<Idioma, string>; pie: Record<Idioma, string> },
  lang: Idioma,
): FotoPagina | null {
  if (HEROE[clave]) return aFoto(porId.get(HEROE[clave]!)!, lang);
  const f = porSrc.get(foto.src);
  return f ? aFoto(f, lang, { alt: foto.alt[lang], pie: foto.pie[lang] }) : null;
}

/**
 * Una foto por bloque para los primeros `max` bloques, sin repetir ninguna ni la principal.
 * Devuelve tantas como bloques reciben foto (puede ser menos si se acaban las fotos).
 */
export function fotosDeBloques(
  bloques: Array<{ titulo: Record<Idioma, string>; cuerpo: Record<Idioma, string> }>,
  heroeId: string | undefined,
  lang: Idioma,
  max = 3,
): FotoPagina[] {
  const usadas = new Set<string>(heroeId ? [heroeId] : []);
  const out: FotoPagina[] = [];
  for (const b of bloques.slice(0, max)) {
    const candidatas = [
      ...TEMAS.filter(([re]) => re.test(b.titulo.es)).flatMap(([, ids]) => ids),
      ...TEMAS.filter(([re]) => re.test(b.cuerpo.es)).flatMap(([, ids]) => ids),
      ...RELLENO,
    ];
    const id = candidatas.find((c) => !usadas.has(c) && porId.has(c));
    if (!id) break;
    usadas.add(id);
    out.push(aFoto(porId.get(id)!, lang));
  }
  return out;
}

/**
 * PREGUNTAS FRECUENTES: una foto al lado de las respuestas que se entienden mejor viéndolas. Solo fotos del
 * lugar vacío o de su arquitectura —ningún montaje de otra producción—: junto a «¿qué incluye?» una foto de
 * un lounge montado prometería el lounge. Precio, horario, licencia y fechas van sin foto: no hay nada que
 * enseñar y forzarla sería decoración.
 */
const PREGUNTAS: Array<[RegExp, Uso]> = [
  [/cuánta gente/i, "cenital"],
  [/llueve/i, "aerea-palapa"],
  [/qué incluye/i, "cabanas-fila"],
  [/catering/i, "edificio-cocina"],
  [/por separado/i, "palmeras"],
  [/potencia|parking|baños/i, "cenital"],
  [/oficina/i, "edificio-salon"],
  [/dónde queda/i, "contexto"],
];
export const HEROE_FAQ: Uso = "puerta";

export function fotoDePregunta(preguntaEs: string, lang: Idioma): FotoPagina | null {
  const id = PREGUNTAS.find(([re]) => re.test(preguntaEs))?.[1];
  return id ? aFoto(porId.get(id)!, lang) : null;
}
export function fotoFaq(lang: Idioma): FotoPagina {
  return aFoto(porId.get(HEROE_FAQ)!, lang);
}

/** La foto que acompaña al entorno en cifras: el predio sobre la manzana, o la primera que no salga ya en la página. */
export function fotoEntorno(usadas: Iterable<string | undefined>, lang: Idioma): FotoPagina {
  const ya = new Set(usadas);
  const id = (["contexto", "cenital", "palmeras", "puerta"] as const).find((x) => !ya.has(x)) ?? "contexto";
  return aFoto(porId.get(id)!, lang);
}

/**
 * La miniatura de una página en «Relacionado»: su foto principal o, si otra tarjeta ya la enseña, la de
 * su primer bloque. Dos tarjetas con la misma foto se leen como la misma página.
 */
export function miniaturaDe(
  pagina: { clave: ClaveRuta; foto: { src: string; alt: Record<Idioma, string>; pie: Record<Idioma, string> }; bloques: Parameters<typeof fotosDeBloques>[0] },
  lang: Idioma,
  usadas: Set<string>,
): FotoPagina | null {
  const h = heroeDe(pagina.clave, pagina.foto, lang);
  const f = h && !usadas.has(h.id) ? h : fotosDeBloques(pagina.bloques, h?.id, lang, 3).find((x) => !usadas.has(x.id)) ?? h;
  if (f) usadas.add(f.id);
  return f;
}

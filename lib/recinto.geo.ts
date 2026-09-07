/**
 * GEOMETRÍA DEL RECINTO, en pies, leída del PLANO DEL SITIO del flyer de Newmark
 * (LoopNet, «Site Plan & Photos», página 10) y de las dos aéreas de la misma
 * página. Es la tercera geometría del proyecto y la primera con un plano de
 * verdad detrás; las dos anteriores salieron de los pies cuadrados declarados y
 * dibujaban otro sitio.
 *
 * LO QUE DICE EL PLANO (norte arriba; `x` hacia el este, `y` hacia el sur):
 *
 *   · El lote es de esquina: NW 1st Ct al OESTE y NW 21st Ct al SUR. ±0,78 acres.
 *   · El EDIFICIO ocupa el norte: ~119 × 102 ft de huella (12 125 SF en un
 *     nivel, 16 000 SF con el altillo). Su fachada sur, con la puerta, da al
 *     recinto exterior. Dentro opera un tercero: NO es lo que se alquila.
 *   · El PASEO pavimentado baja de la puerta del edificio hacia el sur, ~15 ft
 *     de ancho y ~105 ft de largo, hasta el estacionamiento sur.
 *   · La PALAPA (~54 × 54 ft, ~4 000 ft² con aleros) está al suroeste, al oeste
 *     del paseo, pegada al seto de NW 1st Ct.
 *   · Entre la palapa y el edificio, un ÁREA DE ARENA con mesas de picnic y
 *     sombrillas (la hilera de cuadros del plano; en la foto cenital de LoopNet
 *     se ven las mesas).
 *   · Al ESTE del paseo, en hilera, las ocho CABAÑAS-PÉRGOLA (el rectángulo
 *     rayado del plano; en las fotos, postes y listones blancos con sofá).
 *   · ESTACIONAMIENTO al este de las pérgolas y en una franja al sur, sobre
 *     NW 21st Ct. En la aérea se ven coches a los dos lados.
 *   · PALMERAS reales flanqueando el paseo y alrededor de la palapa; SETOS
 *     perimetrales.
 *
 * Escala del plano: 2,4 px/ft (con ella la huella del edificio da 12 100 SF,
 * que es la cifra del brochure). Las medidas siguen siendo «sin escala fina»
 * hasta abrir el boundary survey; el error ya no es de disposición, solo de
 * detalle.
 */

export type Pt = [number, number];

/** Extensión dibujada del lote, en pies. */
export const LOTE = { dx: 150, dy: 265 };

/** El edificio, al norte. La puerta al final del paseo, en su cara sur. */
export const EDIF = { x: 4, y: 0, dx: 120, dy: 104, h1: 14, h2: 24, corte: 70 };
export const PUERTA = { x: 68, dx: 14, h: 10 };

/** El paseo: de la puerta hacia el sur, centrado en la puerta. */
export const PASEO = { x: 66, dx: 15, y0: EDIF.dy, y1: 236 };

/**
 * La palapa, al OESTE del paseo y PEGADA al edificio (Daniel, 7-sep: «el
 * edificio no cuadra en fotos contra el tiki»). En las dos aéreas la paja
 * llega casi hasta la fachada: entre las dos solo queda una franja con
 * palmeras y jardineras. El césped abierto queda al SUR de la palapa.
 */
export const PALAPA = { x: 8, y: 112, dx: 54, dy: 54 };
export const PALAPA_ALERO = 11, PALAPA_CUMBRE = 26, PALAPA_CUMBRERA = 14;
/** Postes: tres hileras por tres, bajo los aleros y en el centro. */
export const PALAPA_POSTES: Pt[] = (() => {
  const out: Pt[] = [];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) out.push([PALAPA.x + 3 + i * 24, PALAPA.y + 3 + j * 24]);
  return out;
})();

/**
 * El área de arena con mesas de picnic y sombrillas: al ESTE del paseo, junto
 * a la puerta, delante de la hilera de pérgolas (en las aéreas, las sombrillas
 * quedan a la derecha de la puerta; en la cenital del flyer, contra un seto).
 */
export const ARENA = { x: 84, y: 106, dx: 44, dy: 22 };
export const PICNIC: Pt[] = Array.from({ length: 5 }, (_, i): Pt => [91 + i * 8, 117]);

/** Las ocho cabañas-pérgola, al este del paseo, en hilera de norte a sur, después del área de arena. */
export const CABANAS = { x: 88, y0: 132, dx: 11, dy: 11, n: 8, paso: 13, h: 9 };

/** Césped: la franja oeste (la palapa y, al sur de ella, el jardín abierto) y la franja este bajo las pérgolas. */
export const CESPED_O = { x: 4, y: 108, dx: PASEO.x - 4, dy: 130 };
export const CESPED_E = { x: PASEO.x + PASEO.dx, y: ARENA.y + ARENA.dy, dx: 106 - PASEO.x - PASEO.dx + 3, dy: 238 - ARENA.y - ARENA.dy };

/** Palmeras reales: dos hileras junto al paseo y las de la palapa. */
export const PALMERAS_O: Pt[] = Array.from({ length: 7 }, (_, i) => [PASEO.x - 3, 118 + i * 17]);
export const PALMERAS_E: Pt[] = Array.from({ length: 7 }, (_, i) => [PASEO.x + PASEO.dx + 3, 126 + i * 17]);
export const PALMERAS_PALAPA: Pt[] = [[PALAPA.x - 2, PALAPA.y + 6], [PALAPA.x - 2, PALAPA.y + 30], [PALAPA.x + 20, PALAPA.y + PALAPA.dy + 4], [PALAPA.x + 44, PALAPA.y + PALAPA.dy + 4], [PALAPA.x + 28, PALAPA.y - 4]];

/** Setos: a lo largo de NW 1st Ct (oeste) y cerrando el sur del césped. */
export const SETO = { ancho: 3, alto: 4 };

/** Estacionamiento: la franja este (junto a las pérgolas) y la franja sur (sobre NW 21st Ct). */
export const PARKING_E = { x: 108, y: 130, dx: 42, dy: 106, plazas: 6 };
export const PARKING_S = { x: 4, y: 240, dx: 146, dy: 22, plazas: 15 };

/** Calles: NW 1st Ct al oeste, NW 21st Ct al sur. */
export const CALLE_O = { x: -30, dx: 30 };
export const CALLE_S = { y: LOTE.dy, dy: 30 };

/**
 * Mesas de diez: 16 bajo la palapa (4 × 4), 8 en el césped al sur de la palapa
 * (4 × 2) y 6 en fila sobre el paseo, delante de la puerta.
 *
 * La versión anterior ponía 7 a `PASEO.x - 12` (dentro de la palapa, encima de
 * las 16) y 7 a `PASEO.x + PASEO.dx + 14` (encima de las pérgolas). Se veían
 * mesas sobre postes y sobre cabañas: el dibujo diciendo algo falso. Ninguna
 * mesa pisa ahora otro objeto; las del paseo caben porque mide 15 ft y una mesa
 * con sillas ocupa 10.
 */
export const MESAS: Pt[] = (() => {
  const out: Pt[] = [];
  for (let c = 0; c < 4; c++) for (let f = 0; f < 4; f++) out.push([PALAPA.x + 7 + c * 13.3, PALAPA.y + 7 + f * 13.3]);
  for (let c = 0; c < 4; c++) for (let f = 0; f < 2; f++) out.push([PALAPA.x + 7 + c * 13.3, PALAPA.y + PALAPA.dy + 6 + f * 13]);
  for (let f = 0; f < 6; f++) out.push([PASEO.x + PASEO.dx / 2, PASEO.y0 + 12 + f * 14]);
  return out;
})();

/** El escenario del montaje tipo: en el césped oeste, justo al sur de la palapa, mirando al sur (de frente a la cámara). */
export const ESCENARIO = { x: 20, y: PALAPA.y + PALAPA.dy + 2, dx: 30, dy: 16, h: 3, truss: 15 };

/** La barra del cliente, bajo la palapa, del lado del paseo. */
export const BARRA = { x: PALAPA.x + PALAPA.dx - 6, y: PALAPA.y + 10, dx: 4, dy: 30, h: 3.5 };

/** El camión de 40 ft: entra desde el sur por el estacionamiento y sube el paseo. */
export const CAMION = { x: PASEO.x + 2, y: 150, dx: 8.5, dy: 40, h: 12, recorrido: 100 };

/** Público de pie: 600 a 8 ft² cada uno, en el césped oeste y bajo la palapa. */
export const MULTITUD: Pt[] = (() => {
  let s = 7 >>> 0;
  const azar = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  const out: Pt[] = [];
  // bajo la palapa: 54 × 54 → 17 × 17 ≈ 289
  for (let f = 0; f < 17; f++) for (let c = 0; c < 17; c++) out.push([PALAPA.x + 1.5 + c * 3.05 + (azar() - 0.5) * 1.4, PALAPA.y + 1.5 + f * 3.05 + (azar() - 0.5) * 1.4]);
  // césped oeste al sur de la palapa (dejando sitio al escenario del montaje tipo): ≈ 311
  for (let f = 0; f < 12; f++) for (let c = 0; c < 26; c++) out.push([6 + c * 2.3 + (azar() - 0.5) * 1.2, PALAPA.y + PALAPA.dy + 24 + f * 2.8 + (azar() - 0.5) * 1.2]);
  return out;
})();

/** Gente suelta, para dar escala en la vista general. */
export const GENTE_SUELTA: Pt[] = [[PASEO.x + 6, 160], [PASEO.x + 9, 205], [30, 205], [PASEO.x - 8, 225], [PASEO.x + PASEO.dx + 8, 150]];

/** Centro del recinto exterior: a donde vuelve la cámara. */
export const CENTRO: Pt = [66, 170];

/**
 * LA CÁMARA: donde estuvo el dron de la aérea de portada. Al sur, sobre el
 * estacionamiento, unos 60 ft de altura, mirando al norte hacia la puerta del
 * edificio, un poco desplazada al este para que la palapa quede a la izquierda
 * y las pérgolas a la derecha, como en la foto.
 */
export const CAMARA = {
  ojo: [88, 445, 128] as [number, number, number],
  objetivo: [66, 150, 0] as [number, number, number],
  focal: 900,
};

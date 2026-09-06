/**
 * GEOMETRÍA DEL RECINTO, en pies, leída de las fotografías aéreas.
 *
 * Daniel, 6-sep-2026: «el dibujo no encaja con las fotos que se tienen». Tenía
 * razón. La primera geometría ponía la palapa en una esquina alejada del paseo y
 * las cabañas como cajas en el borde opuesto. En las dos aéreas (la del hero y la
 * de las palmeras, tomadas desde la calle mirando al edificio) se ve otra cosa:
 *
 *   · El PASEO va por el centro del predio, de la calle a la puerta del edificio.
 *   · La PALAPA está pegada al paseo, a la izquierda, y es grande: un techo de
 *     paja a cuatro aguas con cumbrera larga, sobre postes, con césped alrededor.
 *   · A la derecha del paseo, la hilera de CABAÑAS son PÉRGOLAS: cuatro postes y
 *     un techo plano de listones blancos, abiertas, con un sofá dentro.
 *   · Dos hileras de PALMERAS reales flanquean el paseo.
 *   · SETOS perimetrales en los dos lados largos y, fuera de ellos,
 *     ESTACIONAMIENTO con coches a ambos lados.
 *   · El EDIFICIO cierra el fondo: el paseo termina en sus puertas.
 *
 * Sigue siendo un esquema sin escala fina: no hay site plan del propietario (el
 * boundary survey está en el correo de Rene Morales del 15-ago, sin bajar). Las
 * cifras de superficie son las declaradas; las proporciones, las de las fotos.
 * Todo lo que se dibuja sale de aquí: si el survey corrige una medida, se cambia
 * en este archivo y nada más.
 */

export type Pt = [number, number];

export const U = 2.3; // unidades SVG por pie

/** El predio útil (sin el estacionamiento). */
export const LOTE = { dx: 240, dy: 96 };

/** Setos perimetrales, en los dos lados largos y en la calle. */
export const SETO = { ancho: 3, alto: 4 };

/** El paseo pavimentado, centrado, de la calle al edificio. */
export const PASEO = { y: 42, dy: 13 };

/** La palapa: pegada al paseo por el norte. ~4 000 ft² declarados → 100 × 40. */
export const PALAPA = { x: 62, y: 1 + SETO.ancho, dx: 100, dy: 37 };
export const PALAPA_ALERO = 11, PALAPA_CUMBRE = 24, PALAPA_CUMBRERA = 62;
/** Postes: tres hileras en el sentido corto, seis en el largo. */
export const PALAPA_POSTES: Pt[] = (() => {
  const out: Pt[] = [];
  for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) out.push([PALAPA.x + 3 + i * 18.8, PALAPA.y + 2 + j * 18]);
  return out;
})();

/** Las ocho cabañas-pérgola, al sur del paseo, entre palmeras. */
export const CABANAS = { x: 34, y: PASEO.y + PASEO.dy + 6, dx: 12, dy: 12, n: 8, paso: 24, h: 9 };

/** Palmeras: dos hileras en los bordes del paseo. */
export const PALMERAS_N: Pt[] = Array.from({ length: 10 }, (_, i) => [22 + i * 22.5, PASEO.y - 2.5]);
export const PALMERAS_S: Pt[] = Array.from({ length: 10 }, (_, i) => [12 + i * 23, PASEO.y + PASEO.dy + 2.5]);

/** Estacionamiento fuera de los setos, a ambos lados, con sus plazas. */
export const PARKING = { dy: 18, plazas: 13, ancho: 9, largo: 17 };

/** El edificio al fondo del paseo: dos volúmenes, la puerta donde acaba el paseo. */
export const EDIF = { x: LOTE.dx + 6, dx: 96, dy: LOTE.dy + 2 * PARKING.dy, corte: 58, h1: 13, h2: 22 };
export const PUERTA = { y: PASEO.y + 2.5, dy: PASEO.dy - 5, h: 9 };

/** Ancho total dibujado (predio + edificio), para encuadrar. */
export const TOTAL_X = EDIF.x + EDIF.dx;

/** Mesas de diez: 20 bajo la palapa (5 × 4) y 10 en la franja de césped, junto al paseo. */
export const MESAS: Pt[] = (() => {
  const out: Pt[] = [];
  for (let c = 0; c < 5; c++) for (let f = 0; f < 4; f++) out.push([PALAPA.x + 10 + c * 20, PALAPA.y + 5 + f * 10]);
  for (let c = 0; c < 10; c++) out.push([12 + c * 22.5, PASEO.y - 12]);
  return out;
})();

/** Mesas de picnic fijas: cuatro, entre las cabañas y el seto sur. */
export const PICNIC: Pt[] = [60, 108, 156, 204].map((x): Pt => [x, CABANAS.y + CABANAS.dy + 10]);

/** El escenario del montaje tipo: al fondo del césped norte, mirando a la calle. */
export const ESCENARIO = { x: 200, y: PASEO.y - 34, dx: 16, dy: 28, h: 3, truss: 15 };

/** La barra del cliente, bajo la palapa, en el lado del paseo. */
export const BARRA = { x: PALAPA.x + 20, y: PALAPA.y + PALAPA.dy - 8, dx: 30, dy: 4, h: 3.5 };

/** El camión de 40 ft: entra por la calle y recorre el paseo. */
export const CAMION = { x: 150, y: PASEO.y + 2, dx: 40, dy: 8.5, h: 12, recorrido: 210 };

/** Público de pie: 600 a 8 ft² cada uno, en el césped norte y bajo la palapa. */
export const MULTITUD: Pt[] = (() => {
  let s = 7 >>> 0;
  const azar = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  const out: Pt[] = [];
  // bajo la palapa: 100 × 40 ft → 25 × 12 = 300
  for (let f = 0; f < 12; f++) for (let c = 0; c < 25; c++) out.push([PALAPA.x + 2.5 + c * 3.85 + (azar() - 0.5) * 1.6, PALAPA.y + 2 + f * 3.1 + (azar() - 0.5) * 1.4]);
  // franja norte del paseo, a lo largo: 60 × 5 = 300
  for (let f = 0; f < 5; f++) for (let c = 0; c < 60; c++) out.push([8 + c * 3.85 + (azar() - 0.5) * 1.6, PASEO.y - 17 + f * 3.1 + (azar() - 0.5) * 1.4]);
  return out;
})();

/** Gente suelta, para dar escala en la vista general. */
export const GENTE_SUELTA: Pt[] = [[96, 34], [140, 20], [180, 48], [70, 62], [210, 30], [128, 50]];

/** Centro del recinto: a donde vuelve la cámara. */
export const CENTRO: Pt = [120, 48];

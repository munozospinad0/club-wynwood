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
/** El corte entre el volumen alto y el bajo va a 58 ft: así la puerta (68–82) queda entera en el volumen bajo y no partida por la arista. */
export const EDIF = { x: 4, y: 0, dx: 120, dy: 104, h1: 14, h2: 24, corte: 58 };
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
/** Cumbrera a 34 ft: la pirámide de paja de las fotos es alta (≈42° de pendiente), no un techo bajo. */
export const PALAPA_ALERO = 11, PALAPA_CUMBRE = 34, PALAPA_CUMBRERA = 14;
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
/**
 * Toda la franja al este del paseo es ARENA blanca (en las fotos a pie, las
 * palmeras y las pérgolas están plantadas en arena; el césped solo va al
 * oeste, del lado de la palapa). Las mesas de picnic con sombrilla ocupan la
 * cabecera, junto a la puerta.
 */
export const ARENA = { x: PASEO.x + PASEO.dx, y: 106, dx: 108 - 3 - (PASEO.x + PASEO.dx), dy: 238 - 106 };
/** La cabecera de arena, junto a la puerta, se abre hacia el estacionamiento (el seto alto arranca en la primera pérgola). */
export const ARENA_CABECERA = { x: PASEO.x + PASEO.dx, y: 106, dx: 40, dy: 22 };
export const PICNIC: Pt[] = Array.from({ length: 5 }, (_, i): Pt => [88 + i * 6.5, 116]);

/** Las ocho cabañas-pérgola, al este del paseo, en hilera de norte a sur, con 4 ft de aire entre unidades. */
export const CABANAS = { x: 88, y0: 130, dx: 11, dy: 9.5, n: 8, paso: 13.5, h: 9 };

/** Césped: solo la franja oeste (la palapa y, al sur de ella, el jardín abierto). CESPED_E queda vacío: al este es arena. */
export const CESPED_O = { x: 4, y: 108, dx: PASEO.x - 4, dy: 130 };
export const CESPED_E = { x: PASEO.x + PASEO.dx, y: 106, dx: 0, dy: 0 };

/**
 * Palmeras reales: dos hileras junto al paseo y las de la palapa. Son palmas
 * reales de ~30 ft, más altas que la cumbrera de la palapa (26): por eso sus
 * copas pasan POR ENCIMA del techo y no se montan con él (Daniel, 7-sep: «veo
 * superposición»). La hilera oeste va a 1,5 ft del borde del paseo.
 */
export const PALMERA_ALTO = 36;
export const PALMERAS_O: Pt[] = Array.from({ length: 7 }, (_, i) => [PASEO.x - 1.5, 118 + i * 17]);
export const PALMERAS_E: Pt[] = Array.from({ length: 7 }, (_, i) => [PASEO.x + PASEO.dx + 1.5, 126 + i * 17]);
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
  return out;
})();
/**
 * Sobre el paseo, en vez de seis redondas metidas entre los troncos, una mesa
 * imperial de sesenta: 4 × 78 ft, treinta sillas por lado a 2,6 ft. Es la
 * «cena larga a lo largo del paseo» de la ficha del jardín. 240 + 60 = 300.
 */
export const MESA_LARGA = { x: PASEO.x + PASEO.dx / 2 - 2, y: PASEO.y0 + 10, dx: 4, dy: 78, sillas: 30, paso: 2.6 };

/** El escenario del montaje tipo: en el césped oeste, justo al sur de la palapa, mirando al sur (de frente a la cámara). */
export const ESCENARIO = { x: 20, y: PALAPA.y + PALAPA.dy + 8, dx: 30, dy: 16, h: 3, truss: 15 };

/** La barra del cliente, bajo la palapa, del lado del paseo. */
export const BARRA = { x: PALAPA.x + PALAPA.dx - 6, y: PALAPA.y + 10, dx: 4, dy: 30, h: 3.5 };

/** El camión de 40 ft: entra desde el sur por el estacionamiento y sube el paseo. */
/** Llega a 4 ft de la puerta (la rampa acaba en y≈106) desde el estacionamiento sur (arranca en y=246). */
export const CAMION = { x: PASEO.x + 2, y: 116, dx: 8.5, dy: 40, h: 12, recorrido: 130 };

/** Público de pie: 600 a 8 ft² cada uno, en el césped oeste y bajo la palapa. */
export const MULTITUD: Pt[] = (() => {
  let s = 7 >>> 0;
  const azar = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  const out: Pt[] = [];
  // bajo la palapa: 54 × 54 → 17 × 17 ≈ 289 (de noche no se usan: ahí va el lounge)
  for (let f = 0; f < 17; f++) for (let c = 0; c < 17; c++) out.push([PALAPA.x + 1.5 + c * 3.05 + (azar() - 0.5) * 1.4, PALAPA.y + 1.5 + f * 3.05 + (azar() - 0.5) * 1.4]);
  // césped oeste al sur de la palapa (dejando sitio al escenario del montaje tipo): ≈ 311
  for (let f = 0; f < 12; f++) for (let c = 0; c < 26; c++) out.push([6 + c * 2.3 + (azar() - 0.5) * 1.2, PALAPA.y + PALAPA.dy + 24 + f * 2.8 + (azar() - 0.5) * 1.2]);
  return out;
})();

/** Gente suelta, para dar escala en la vista general. */
/** Ninguna sobre el paseo: por ahí caminan los peatones y les pasaban por encima. */
export const GENTE_SUELTA: Pt[] = [[PASEO.x + PASEO.dx + 4.5, 162], [PASEO.x - 5, 205], [40, 214], [PASEO.x - 8, 228], [PASEO.x + PASEO.dx + 5, 200]];

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

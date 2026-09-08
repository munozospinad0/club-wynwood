/**
 * GEOMETRÍA DEL RECINTO, en pies, leída del PLANO DEL SITIO del flyer de Newmark
 * (LoopNet, «Site Plan & Photos», página 10) contrastado con la FOTO CENITAL del
 * mismo flyer y con las dos aéreas. Es la cuarta geometría del proyecto: la
 * tercera tenía el plano detrás pero lo leyó mal (Daniel, 7-sep: «viendo las
 * fotos no hay nada al lado así… no es acorde a la realidad»).
 *
 * LO QUE DICEN EL PLANO Y LA CENITAL (norte arriba; `x` hacia el este, `y` hacia el sur):
 *
 *   · El lote es de esquina: NW 1st Ct al OESTE y NW 21st Ct al SUR. ±0,78 acres,
 *     unos 131 ft de ancho por 258 de fondo.
 *   · El EDIFICIO ocupa el norte: ~120 × 104 ft de huella (12 125 SF en un nivel,
 *     16 000 SF con el altillo). Su fachada sur, con la puerta y el mural, da al
 *     recinto exterior. Dentro opera un tercero: NO es lo que se alquila.
 *   · El PASEO pavimentado baja de la puerta hacia el sur, ~15 ft de ancho, hasta
 *     el estacionamiento sur (~106 ft). Losas grandes con juntas de césped y una
 *     hilera de palmas reales a cada lado.
 *   · La PALAPA (~54 × 60 ft, ~4 000 ft² con aleros) está en la ESQUINA SUROESTE,
 *     al oeste del paseo, con la cumbrera paralela al paseo. Al sur de ella no hay
 *     jardín: un seto y enseguida el estacionamiento.
 *   · Entre la palapa y la fachada, del lado oeste, un apron pavimentado con
 *     jardineras contra el edificio y una franja de CÉSPED (la palapa misma está
 *     sobre césped artificial: en las fotos el lounge de debajo pisa césped).
 *   · Al ESTE del paseo todo es ARENA: en la cabecera, junto a la puerta, las
 *     velas de sombra y las mesas de picnic; después, en hilera de norte a sur,
 *     las ocho CABAÑAS-PÉRGOLA contra un muro verde alto.
 *   · ESTACIONAMIENTO al este de las pérgolas (una fila) y al sur, sobre NW 21st
 *     Ct, en DOS filas con calle de maniobra entre ellas; el paseo desemboca ahí.
 *
 * Escala del plano: 2,4 px/ft (con ella la huella del edificio da 12 100 SF, la
 * cifra del brochure). Sigue siendo «sin escala fina» hasta abrir el boundary
 * survey; el error ya no es de disposición, solo de detalle.
 */

export type Pt = [number, number];

/** Extensión dibujada del lote, en pies. */
export const LOTE = { dx: 131, dy: 258 };

/** El edificio, al norte. La puerta al final del paseo, en su cara sur. */
/** El corte entre el volumen alto y el bajo va a 58 ft: así la puerta (63,5–77,5) queda entera en el volumen bajo y no partida por la arista. */
export const EDIF = { x: 4, y: 0, dx: 120, dy: 104, h1: 14, h2: 24, corte: 58 };
export const PUERTA = { x: 63.5, dx: 14, h: 10 };

/** El paseo: de la puerta hacia el sur, centrado en la puerta, hasta el estacionamiento. */
export const PASEO = { x: 63, dx: 15, y0: EDIF.dy, y1: 212 };

/**
 * La palapa, en la esquina suroeste: al oeste del paseo y contra el seto del
 * sur, como en la cenital (la pirámide de paja está pegada a la esquina de las
 * dos calles, con el estacionamiento sur delante). La cumbrera va paralela al
 * paseo (norte-sur).
 */
/** Pegada al estacionamiento sur: entre su alero y las plazas solo cabe el seto (Daniel, 7-sep: «sobra espacio entre la palapa y el estacionamiento»). */
export const PALAPA = { x: 4, y: 151, dx: 54, dy: 60 };
/** Cumbrera a 34 ft: la pirámide de paja de las fotos es alta (≈42° de pendiente), no un techo bajo. */
export const PALAPA_ALERO = 11, PALAPA_CUMBRE = 34, PALAPA_CUMBRERA = 14;
/** Postes: tres hileras por tres, bajo los aleros y en el centro. */
export const PALAPA_POSTES: Pt[] = (() => {
  const out: Pt[] = [];
  const xs = [PALAPA.x + 3, PALAPA.x + PALAPA.dx / 2, PALAPA.x + PALAPA.dx - 3];
  const ys = [PALAPA.y + 3, PALAPA.y + PALAPA.dy / 2, PALAPA.y + PALAPA.dy - 3];
  for (const px of xs) for (const py of ys) out.push([px, py]);
  return out;
})();

/**
 * El apron pavimentado contra la fachada, del lado oeste del paseo: losas con
 * juntas de césped y jardineras pegadas al edificio (cenital). Entre él y la
 * palapa, césped.
 */
export const PLAZA = { x: 4, y: EDIF.dy + 2, dx: PASEO.x - 4 - 2, dy: 18 };
export const JARDINERAS: Pt[] = Array.from({ length: 6 }, (_, i): Pt => [PLAZA.x + 5 + i * 9.4, EDIF.dy + 1.6]);

/**
 * Toda la franja al este del paseo es ARENA blanca (en las fotos a pie, las
 * palmeras y las pérgolas están plantadas en arena; el césped va al oeste). Las
 * mesas de picnic con sombrilla ocupan la cabecera, junto a la puerta.
 */
export const ARENA = { x: PASEO.x + PASEO.dx, y: EDIF.dy + 2, dx: 102 - 3 - (PASEO.x + PASEO.dx), dy: 212 - (EDIF.dy + 2) };
/** La cabecera de arena, junto a la puerta, se abre hacia el estacionamiento (el seto alto arranca en la primera pérgola). */
export const ARENA_CABECERA = { x: PASEO.x + PASEO.dx, y: EDIF.dy + 2, dx: 40, dy: 22 };
export const PICNIC: Pt[] = Array.from({ length: 5 }, (_, i): Pt => [84 + i * 6.5, 116]);

/** Las ocho cabañas-pérgola, al este del paseo, en hilera de norte a sur, con aire entre unidades. */
export const CABANAS = { x: 86, y0: 130, dx: 11, dy: 8, n: 8, paso: 10.4, h: 9 };

/** Césped: la franja oeste entre el apron y el seto del sur; la palapa está sobre él. CESPED_E queda vacío: al este es arena. */
export const CESPED_O = { x: 4, y: PLAZA.y + PLAZA.dy, dx: PASEO.x - 4, dy: 212 - (PLAZA.y + PLAZA.dy) };
export const CESPED_E = { x: PASEO.x + PASEO.dx, y: 106, dx: 0, dy: 0 };

/**
 * Palmeras reales: dos hileras junto al paseo y las de la palapa. Son palmas
 * reales de ~36 ft, más altas que la cumbrera de la palapa (34): por eso sus
 * copas pasan POR ENCIMA del techo y no se montan con él. La hilera oeste va a
 * 1,5 ft del borde del paseo.
 */
export const PALMERA_ALTO = 36;
export const PALMERAS_O: Pt[] = Array.from({ length: 7 }, (_, i) => [PASEO.x - 1.5, 116 + i * 15]);
export const PALMERAS_E: Pt[] = Array.from({ length: 7 }, (_, i) => [PASEO.x + PASEO.dx + 1.5, 124 + i * 15]);
/** Alrededor de la palapa, como en la cenital: en la esquina de las calles y en el costado sur. */
export const PALMERAS_PALAPA: Pt[] = [
  [PALAPA.x + 20, PALAPA.y - 4], [PALAPA.x + 44, PALAPA.y - 4],
  [PALAPA.x - 0.5, PALAPA.y + 16], [PALAPA.x - 0.5, PALAPA.y + 44],
  [PALAPA.x + 12, PALAPA.y + PALAPA.dy + 1.5], [PALAPA.x + 40, PALAPA.y + PALAPA.dy + 1.5],
];

/** Setos: a lo largo de NW 1st Ct (oeste) y cerrando el sur del césped y de la arena. */
export const SETO = { ancho: 3, alto: 4 };

/**
 * Estacionamiento: una fila al este (junto a las pérgolas) y DOS filas al sur,
 * sobre NW 21st Ct, con calle de maniobra entre ellas (plano de Newmark). El
 * paseo desemboca en la calle de maniobra.
 */
export const PARKING_E = { x: 102, y: 130, dx: 29, dy: 82, plazas: 5 };
export const PARKING_S = { x: 4, y: 214, dx: 127, dy: 44, plazas: 12, fila: 17, calle: 10 };

/** Calles: NW 1st Ct al oeste, NW 21st Ct al sur. */
export const CALLE_O = { x: -30, dx: 30 };
export const CALLE_S = { y: LOTE.dy, dy: 30 };

/**
 * Mesas de diez: 16 bajo la palapa (4 × 4) y 8 en el césped entre la palapa y
 * el apron (4 × 2). Ninguna mesa pisa otro objeto.
 */
export const MESAS: Pt[] = (() => {
  const out: Pt[] = [];
  for (let c = 0; c < 4; c++) for (let f = 0; f < 4; f++) out.push([PALAPA.x + 7 + c * 13.3, PALAPA.y + 8 + f * 14.6]);
  for (let c = 0; c < 4; c++) for (let f = 0; f < 2; f++) out.push([PALAPA.x + 7 + c * 13.3, CESPED_O.y + 6 + f * 12]);
  return out;
})();
/**
 * Sobre el paseo, en vez de seis redondas metidas entre los troncos, una mesa
 * imperial de sesenta: 4 × 78 ft, treinta sillas por lado a 2,6 ft. Es la
 * «cena larga a lo largo del paseo» de la ficha del jardín. 240 + 60 = 300.
 */
export const MESA_LARGA = { x: PASEO.x + PASEO.dx / 2 - 2, y: PASEO.y0 + 12, dx: 4, dy: 78, sillas: 30, paso: 2.6 };

/**
 * El escenario del montaje tipo: sobre el estacionamiento sur (que un evento
 * cierra), de frente al norte: el público lo mira desde el paseo y desde la
 * palapa. Desde la cámara del sur se ve por detrás, con los haces barriendo
 * hacia la gente. Detrás de la palapa no cabía: el techo lo taparía entero.
 */
export const ESCENARIO = { x: 16, y: 216, dx: 30, dy: 14, h: 3, truss: 15 };

/** La barra del cliente, bajo la palapa, del lado del paseo. */
export const BARRA = { x: PALAPA.x + PALAPA.dx - 6, y: PALAPA.y + 12, dx: 4, dy: 30, h: 3.5 };

/**
 * El camión de 40 ft y LA ENTRADA DE CARGA. Daniel, 7-sep: «la mercancía no
 * entra por la entrada principal». La principal (NW 21st Ct, estacionamiento y
 * paseo) es para invitados; la carga entra por NW 1st Ct, al oeste, a la franja
 * pavimentada que corre junto a la fachada (el apron), que en la cenital llega
 * hasta la calle. El camión viene de la calle por el oeste (eje x), con la
 * cabina al este, y para con la cola junto al portón: la rampa baja al apron a
 * un paso de la palapa y de la puerta del edificio. `x`, `y` es su posición
 * final; arranca `recorrido` ft al oeste, fuera del papel.
 */
export const PORTON_CARGA = { x: 0, y: PLAZA.y, dy: PLAZA.dy };
export const CAMION = { x: 14, y: PLAZA.y + 4.5, dx: 40, dy: 8.5, h: 12, recorrido: 62, eje: "x" as "x" | "y" };

/** Público de pie: 600 a 8 ft² cada uno. Bajo la palapa, en el césped entre la palapa y el apron, sobre el paseo y en la arena de la cabecera. */
export const MULTITUD_PALAPA: Pt[] = (() => {
  let s = 7 >>> 0;
  const azar = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  const out: Pt[] = [];
  for (let f = 0; f < 19; f++) for (let c = 0; c < 17; c++) out.push([PALAPA.x + 1.5 + c * 3.05 + (azar() - 0.5) * 1.4, PALAPA.y + 1.5 + f * 3.05 + (azar() - 0.5) * 1.4]);
  return out;
})();
export const MULTITUD_CESPED: Pt[] = (() => {
  let s = 11 >>> 0;
  const azar = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  const out: Pt[] = [];
  for (let f = 0; f < 7; f++) for (let c = 0; c < 18; c++) out.push([CESPED_O.x + 2 + c * 3.1 + (azar() - 0.5) * 1.2, CESPED_O.y + 2 + f * 3 + (azar() - 0.5) * 1.2]);
  return out;
})();
export const MULTITUD_PASEO: Pt[] = (() => {
  let s = 13 >>> 0;
  const azar = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  const out: Pt[] = [];
  for (let f = 0; f < 33; f++) for (let c = 0; c < 4; c++) out.push([PASEO.x + 2.2 + c * 3.5 + (azar() - 0.5) * 1.2, PASEO.y0 + 6 + f * 3.05 + (azar() - 0.5) * 1.2]);
  return out;
})();
export const MULTITUD: Pt[] = [...MULTITUD_PALAPA, ...MULTITUD_CESPED, ...MULTITUD_PASEO];

/** Gente suelta, para dar escala en la vista general. Ninguna sobre el paseo: por ahí caminan los peatones. */
export const GENTE_SUELTA: Pt[] = [[PASEO.x + PASEO.dx + 4.5, 162], [PASEO.x - 3, 128], [PASEO.x + PASEO.dx + 5, 200], [96, 118]];

/** Centro del recinto exterior: a donde vuelve la cámara. */
export const CENTRO: Pt = [66, 170];

/**
 * LA CÁMARA: donde estuvo el dron de la aérea de portada. Al sur, sobre la
 * calle, unos 140 ft de altura, mirando al norte hacia la puerta del edificio,
 * un poco desplazada al este para que la palapa quede a la izquierda y las
 * pérgolas a la derecha, como en la foto.
 */
export const CAMARA = {
  ojo: [80, 430, 140] as [number, number, number],
  objetivo: [64, 150, 0] as [number, number, number],
  focal: 900,
};

/**
 * LOS PUNTOS DE VISTA (Daniel, 7-sep: «que se pudiera ver desde diferentes
 * perspectivas… tienes que crear todo el modelo en todos los lados»). Cinco
 * cámaras sobre la misma geometría: la del sur (la de las fotos y del vídeo),
 * desde el norte por encima del edificio, desde el este sobre el
 * estacionamiento, desde el oeste sobre NW 1st Ct, y una aérea casi vertical.
 * Todos los objetos deciden qué caras enseñan mirando `g.camara.ojo`.
 */
export type Vista = "sur" | "norte" | "este" | "oeste" | "aerea";
export const VISTAS: Record<Vista, { ojo: [number, number, number]; objetivo: [number, number, number]; focal: number }> = {
  sur: CAMARA,
  norte: { ojo: [112, -250, 320], objetivo: [64, 178, 0], focal: 900 },
  este: { ojo: [330, 176, 165], objetivo: [56, 162, 0], focal: 900 },
  oeste: { ojo: [-190, 176, 150], objetivo: [72, 162, 0], focal: 900 },
  aerea: { ojo: [72, 330, 520], objetivo: [66, 140, 0], focal: 900 },
};
export const ORDEN_VISTAS: Vista[] = ["sur", "oeste", "norte", "este", "aerea"];

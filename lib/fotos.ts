/**
 * LAS FOTOS DEL SITIO, EN UNA SOLA LISTA (10-nov-2026).
 *
 * Hasta hoy había cuatro listas que se pisaban: `galeria.ts`, `fotosPagina.ts`, las `foto.src` sueltas
 * de `contenido.ts` y las postales de `recorrido.ts`. La misma foto tenía tres pies distintos y, cuando
 * hubo que retirar las dos con parche, quedaron vivas en la portada y en el schema porque nadie sabía
 * que estaban ahí. Ahora la verdad está aquí y las demás piezas la leen:
 *
 *   · `components/Galeria.tsx`       todas las de `galeria !== false`, agrupadas por `zona`.
 *   · `components/RecorridoAPie.tsx` los pasos de `RECORRIDO_A_PIE`, con el `punto` sobre el plano.
 *   · `lib/fotosPagina.ts`           elige foto por tema para las páginas interiores.
 *   · `lib/schema.ts`                las fotos limpias del lugar para el grafo.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * DE DÓNDE SALEN
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * · `cw-NN-*` — la sesión profesional del 6-nov-2026, pagada por Sandra (uso libre). `NN` es el número
 *   de la foto en `fotos-profesionales-2026-11/` (carpeta de cliente, fuera del repo: **este repo es
 *   público y aquí solo entran los webp de 1920 px**, nunca los originales).
 * · `cw-03/04/05/06/44/47` — la foto real con su grafiti, solo sin los nombres comerciales (Sandra, 9-nov:
 *   «afuera deberías dejar el graffiti, es Wynwood»). Son `real`: el lugar se ve así.
 * · `tipo: "visualizacion"` — el interior pintado de blanco, como va a quedar. Hecho con IA sobre la
 *   foto real. **Siempre lleva el rótulo** `ROTULO_VISUALIZACION`: quien visite antes de la pintura
 *   verá otra cosa, y una foto que promete lo que no hay es la que hace dudar del resto.
 * · `flyer-*` y las demás de `/assets/` — material anterior (flyer de Newmark, fotos del sitio viejo).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * LO QUE NO ENTRA, Y POR QUÉ (para no volver a meterlo)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * · `aerea-predio.jpg` y `venue-exterior.webp`: parche borroso de `delogo` sobre la marca del operador.
 * · `palapa-sonido.jpg`: es el mismo archivo que `palapa-montaje.jpg`, byte a byte.
 * · `edificio-fachada.jpg` (logo de otra empresa), `edificio-calle.jpg` (marca de agua de un portal).
 * · De la sesión de noviembre: laser tag, arcade, escalada (19-27, 41 y el muro de agarres de 50/51),
 *   la 46 (letrero de una marca de ron en la pérgola) y la 48 (letreros del operador en la entrada del
 *   estacionamiento, «Customers pay inside»). La 4 y la 47 tenían esos mismos letreros y entran en su
 *   versión limpia (`-sin-nombre`). La 50 va recortada por arriba a la izquierda para dejar fuera la
 *   columna de escalada.
 *
 * `w`/`h` son los píxeles reales del archivo: reservan el hueco para que la página no salte y el visor
 * nunca amplía por encima de ellos.
 *
 * `punto` va en pies, en las coordenadas de `lib/recinto.geo.ts` (x hacia el este, y hacia el sur,
 * origen en la esquina noroeste del lote) y `rumbo` es hacia dónde mira la cámara, en grados desde el
 * norte (90 = este). Las del interior no llevan punto: el plano marca el edificio entero, porque no hay
 * una planta interior verificada sobre la que ponerlo.
 */

import type { Idioma } from "./i18n";

export type Zona = "jardin" | "pabellon" | "pergolas" | "estacionamiento" | "edificio" | "aereas";
export type Tipo = "real" | "visualizacion";

export interface Foto {
  id: string;
  src: string;
  w: number;
  h: number;
  alt: Record<Idioma, string>;
  zona: Zona;
  tipo: Tipo;
  fuente: Record<Idioma, string>;
  /** Dónde estaba la cámara, en pies sobre el plano de `recinto.geo.ts`, y hacia dónde miraba. */
  punto?: { x: number; y: number; rumbo?: number };
  /** `object-position` cuando la foto se recorta en un marco de otra proporción. */
  encuadre?: string;
  /** Montaje de una producción anterior: el mobiliario, la luz y el sonido no vienen con el recinto. */
  montaje?: boolean;
  /** `false` para las que solo sirven en otra pieza y no se enseñan en la galería. */
  galeria?: boolean;
}

export const ROTULO_VISUALIZACION: Record<Idioma, string> = {
  es: "Visualización: así quedará pintado",
  en: "Rendering: freshly painted",
};

export const ZONAS: Array<{ clave: Zona; es: string; en: string }> = [
  { clave: "jardin", es: "El Jardín y el paseo", en: "The Garden and the walkway" },
  { clave: "pabellon", es: "El Pabellón", en: "The Pavilion" },
  { clave: "pergolas", es: "Las pérgolas", en: "The pergolas" },
  { clave: "estacionamiento", es: "Estacionamiento", en: "Parking" },
  { clave: "edificio", es: "El edificio (se alquila aparte)", en: "The building (rented separately)" },
  { clave: "aereas", es: "Desde el aire", en: "From the air" },
];

const SESION = { es: "sesión fotográfica del predio, noviembre de 2026", en: "photo shoot of the venue, November 2026" };
const SESION_SIN_NOMBRE = {
  es: "sesión fotográfica del predio, noviembre de 2026 · sin los nombres comerciales de la fachada",
  en: "photo shoot of the venue, November 2026 · business names removed from the façade",
};
const VISUALIZACION = {
  es: "visualización sobre la foto de noviembre de 2026: paredes en blanco, techo en su color",
  en: "rendering over the November 2026 photo: white walls, ceiling in its original colors",
};
const FLYER = { es: "flyer comercial del predio, 2026", en: "the property's commercial flyer, 2026" };
const DRON = { es: "fotografía aérea del predio", en: "aerial photograph of the venue" };
const SITIO = { es: "fotografía del sitio", en: "photograph of the venue" };
const BROKER = { es: "ficha comercial del inmueble, 2026", en: "the property's commercial listing, 2026" };

export const FOTOS: Foto[] = [
  // ─────────────────────────────────────────────── el jardín y el paseo
  { id: "entrada-jardin", src: "/fotos/cw-04-entrada-jardin.webp", w: 1920, h: 1440, zona: "jardin", tipo: "real", fuente: SESION_SIN_NOMBRE,
    punto: { x: 70, y: 218, rumbo: 0 },
    alt: { es: "La entrada al jardín desde el estacionamiento: el paseo entre setos y palmeras, con el Pabellón a la izquierda",
           en: "The way into the Garden from the parking lot: the walkway between hedges and palms, with the Pavilion on the left" } },
  { id: "paseo-pabellon", src: "/fotos/cw-42-paseo-pabellon.webp", w: 1920, h: 1277, zona: "jardin", tipo: "real", fuente: SESION,
    punto: { x: 72, y: 128, rumbo: 225 },
    alt: { es: "El paseo de losas con juntas de césped, las palmeras reales y el Pabellón al fondo",
           en: "The slab walkway with turf joints, the royal palms and the Pavilion behind" } },
  { id: "patio-mural", src: "/fotos/cw-44-patio-mural.webp", w: 1920, h: 1440, zona: "jardin", tipo: "real", fuente: SESION_SIN_NOMBRE,
    punto: { x: 8, y: 114, rumbo: 90 },
    alt: { es: "El apron pavimentado junto a la fachada, con el mural de punta a punta",
           en: "The paved apron along the façade, with the mural from end to end" } },
  { id: "puerta", src: "/assets/flyer-paseo-puerta.jpg", w: 1110, h: 806, zona: "jardin", tipo: "real", fuente: FLYER,
    alt: { es: "El paseo hasta la puerta del edificio, a ras de suelo", en: "The walkway up to the building door, at ground level" } },
  { id: "paseo", src: "/assets/paseo-palmeras.jpg", w: 1280, h: 400, zona: "jardin", tipo: "real", fuente: SITIO,
    alt: { es: "El paseo pavimentado, en losas con juntas de césped, entre las palmeras", en: "The paved walkway, in slabs with turf joints, between the palms" } },
  { id: "palmeras", src: "/assets/palmeras-aerea.jpg", w: 736, h: 682, zona: "jardin", tipo: "real", fuente: DRON, encuadre: "50% 60%",
    alt: { es: "Las dos hileras de palmeras reales sobre el césped y el pabellón", en: "The two rows of real palms over the turf and the Pavilion" } },

  // ─────────────────────────────────────────────── el pabellón
  { id: "pabellon-frente", src: "/fotos/cw-43-pabellon-frente.webp", w: 1920, h: 1277, zona: "pabellon", tipo: "real", fuente: SESION,
    punto: { x: 31, y: 136, rumbo: 180 },
    alt: { es: "El Pabellón de frente: techo de paja a cuatro aguas sobre postes de madera, abierto por los costados",
           en: "The Pavilion head-on: a hipped thatch roof on timber posts, open on every side" } },
  { id: "bajo-pabellon", src: "/fotos/cw-45-bajo-pabellon.webp", w: 1920, h: 1277, zona: "pabellon", tipo: "real", fuente: SESION,
    punto: { x: 31, y: 168, rumbo: 180 },
    alt: { es: "Bajo el Pabellón, vacío: la estructura de madera, la paja y el piso de césped artificial",
           en: "Under the Pavilion, empty: the timber frame, the thatch and the artificial turf floor" } },
  { id: "aerea-palapa", src: "/assets/flyer-aerea-palapa.jpg", w: 930, h: 1108, zona: "pabellon", tipo: "real", fuente: FLYER, encuadre: "50% 58%",
    alt: { es: "El pabellón y las dos hileras de palmeras desde el aire", en: "The covered pavilion and the two rows of palms from the air" } },
  { id: "bajo-palapa", src: "/assets/venue-palapa.webp", w: 1280, h: 960, zona: "pabellon", tipo: "real", fuente: SITIO, montaje: true,
    alt: { es: "Bajo el pabellón: paja sobre madera, abierto por los costados", en: "Under the Pavilion: thatch on timber, open on the sides" } },
  { id: "lounge", src: "/assets/flyer-palapa-lounge.jpg", w: 935, h: 614, zona: "pabellon", tipo: "real", fuente: FLYER, montaje: true,
    alt: { es: "Bajo el pabellón: un montaje lounge con barra y guirnaldas", en: "Under the Pavilion: a lounge setup with a bar and string lights" } },
  { id: "coctel", src: "/assets/flyer-palapa-coctel.jpg", w: 548, h: 1434, zona: "pabellon", tipo: "real", fuente: FLYER, montaje: true,
    alt: { es: "Bajo el pabellón: mesas de cóctel y guirnaldas entre los cabios", en: "Under the Pavilion: cocktail tables and string lights among the rafters" } },
  { id: "montaje", src: "/assets/palapa-montaje.jpg", w: 1600, h: 1200, zona: "pabellon", tipo: "real", fuente: SITIO, montaje: true,
    alt: { es: "Bajo el pabellón, montado: truss, altavoces y luces colgados de los cabios",
           en: "Under the Pavilion, rigged: truss, speakers and lights hung from the rafters" } },

  // ─────────────────────────────────────────────── las pérgolas
  { id: "cabanas-fila", src: "/assets/cabanas-fila.jpg", w: 930, h: 614, zona: "pergolas", tipo: "real", fuente: SITIO,
    alt: { es: "La hilera de cabañas a ras de suelo: pérgolas blancas, cortinas, sofás y el muro verde detrás",
           en: "The cabana row at ground level: white pergolas, curtains, sofas and the green wall behind" } },

  /** La misma toma que `cabanas-fila`, del flyer: solo la usa el modo cine. */
  { id: "cabanas-flyer", src: "/assets/flyer-cabanas.jpg", w: 930, h: 614, zona: "pergolas", tipo: "real", fuente: FLYER, galeria: false,
    alt: { es: "Las cabañas: pérgolas con cortinas y sofás entre las palmeras", en: "The cabanas: pergolas with curtains and sofas among the palms" } },

  // ─────────────────────────────────────────────── estacionamiento
  { id: "llegada", src: "/fotos/cw-47-llegada.webp", w: 1920, h: 1440, zona: "estacionamiento", tipo: "real", fuente: SESION_SIN_NOMBRE,
    punto: { x: 58, y: 256, rumbo: 0 },
    alt: { es: "La llegada por NW 21st Ct: el estacionamiento de grava, el seto y el Pabellón detrás de las palmeras",
           en: "Arriving on NW 21st Ct: the gravel parking lot, the hedge and the Pavilion behind the palms" } },
  { id: "estacionamiento", src: "/fotos/cw-49-estacionamiento.webp", w: 1920, h: 1277, zona: "estacionamiento", tipo: "real", fuente: SESION,
    punto: { x: 118, y: 238, rumbo: 270 },
    alt: { es: "El estacionamiento propio sobre NW 21st Ct: piso de grava, el seto del jardín y el Pabellón asomando",
           en: "The on-site parking on NW 21st Ct: a gravel lot, the garden hedge and the Pavilion behind it" } },

  // ─────────────────────────────────────────────── el edificio (se alquila aparte)
  { id: "fachada", src: "/fotos/cw-05-fachada.webp", w: 1920, h: 1440, zona: "edificio", tipo: "real", fuente: SESION_SIN_NOMBRE,
    punto: { x: 70, y: 136, rumbo: 0 },
    alt: { es: "La fachada sur del edificio desde el paseo: el mural de Wynwood y la puerta de vidrio",
           en: "The building's south façade from the walkway: the Wynwood mural and the glass doors" } },
  { id: "fachada-diagonal", src: "/fotos/cw-06-fachada-diagonal.webp", w: 1920, h: 1440, zona: "edificio", tipo: "real", fuente: SESION_SIN_NOMBRE,
    punto: { x: 112, y: 122, rumbo: 300 },
    alt: { es: "La fachada en diagonal: el mural sigue por toda la cara sur del edificio",
           en: "The façade at an angle: the mural runs along the building's whole south side" } },
  { id: "mural-lateral", src: "/fotos/cw-03-mural-lateral.webp", w: 1920, h: 1440, zona: "edificio", tipo: "real", fuente: SESION_SIN_NOMBRE,
    punto: { x: -14, y: 96, rumbo: 20 },
    alt: { es: "El costado del edificio sobre NW 1st Ct, cubierto por un grafiti de Wynwood",
           en: "The side of the building on NW 1st Ct, covered by a Wynwood graffiti mural" } },
  { id: "salon-blanco", src: "/fotos/cw-12-salon-blanco.webp", w: 1920, h: 1440, zona: "edificio", tipo: "visualizacion", fuente: VISUALIZACION,
    alt: { es: "El salón del edificio pintado de blanco, con piso de concreto gris y el techo en su color",
           en: "The building's main hall painted white, with a grey concrete floor and the ceiling in its original colors" } },
  { id: "entrada-interior", src: "/fotos/cw-07-entrada-interior.webp", w: 1920, h: 1440, zona: "edificio", tipo: "visualizacion", fuente: VISUALIZACION,
    alt: { es: "La entrada desde dentro: las puertas de vidrio que dan al paseo, en un vestíbulo blanco", en: "The entrance from inside: the glass doors onto the walkway, in a white lobby" } },
  { id: "vestibulo", src: "/fotos/cw-08-vestibulo.webp", w: 1920, h: 1440, zona: "edificio", tipo: "visualizacion", fuente: VISUALIZACION,
    alt: { es: "El vestíbulo del edificio, en blanco, con los accesos al salón", en: "The building's lobby in white, with the openings into the hall" } },
  { id: "salon-altillo", src: "/fotos/cw-09-salon-altillo.webp", w: 1920, h: 1440, zona: "edificio", tipo: "visualizacion", fuente: VISUALIZACION,
    alt: { es: "Un costado del salón, con la estructura vista en el techo", en: "One side of the main hall, with the exposed structure overhead" } },
  { id: "barra", src: "/fotos/cw-10-barra.webp", w: 1920, h: 1440, zona: "edificio", tipo: "visualizacion", fuente: VISUALIZACION,
    alt: { es: "El mostrador junto al salón, con piso de concreto y paredes en blanco", en: "The counter next to the hall, with a concrete floor and white walls" } },
  { id: "oficina", src: "/fotos/cw-11-oficina.webp", w: 1920, h: 1440, zona: "edificio", tipo: "visualizacion", fuente: VISUALIZACION,
    alt: { es: "Una oficina pequeña del edificio, vacía y en blanco", en: "A small office in the building, empty and white" } },
  { id: "salon-pasillo", src: "/fotos/cw-13-salon-pasillo.webp", w: 1920, h: 1440, zona: "edificio", tipo: "visualizacion", fuente: VISUALIZACION,
    alt: { es: "El salón a lo largo, con el techo en sus colores: vigas rojas y ductos", en: "The hall lengthwise, with the ceiling in its own colors: red joists and ducts" } },
  { id: "sala-planta-baja", src: "/fotos/cw-14-sala.webp", w: 1920, h: 1440, zona: "edificio", tipo: "visualizacion", fuente: VISUALIZACION,
    alt: { es: "Una sala amplia de la planta baja, en blanco y con techo oscuro", en: "A large ground-floor room, white with a dark ceiling" } },
  { id: "pasillo", src: "/fotos/cw-15-pasillo.webp", w: 1920, h: 1440, zona: "edificio", tipo: "visualizacion", fuente: VISUALIZACION,
    alt: { es: "El pasillo largo de la planta baja, en blanco, con el techo en su color", en: "The long ground-floor corridor in white, with the ceiling in its own color" } },
  { id: "acceso-banos", src: "/fotos/cw-16-acceso-banos.webp", w: 1920, h: 1440, zona: "edificio", tipo: "visualizacion", fuente: VISUALIZACION,
    alt: { es: "El acceso a los baños, con bebederos", en: "The way into the restrooms, with drinking fountains" } },
  { id: "bano-1", src: "/fotos/cw-17-bano.webp", w: 1920, h: 1440, zona: "edificio", tipo: "visualizacion", fuente: VISUALIZACION,
    alt: { es: "Un baño del edificio: lavamanos corridos y cabinas", en: "A building restroom: a row of sinks and stalls" } },
  { id: "bano-2", src: "/fotos/cw-18-bano.webp", w: 1920, h: 1440, zona: "edificio", tipo: "visualizacion", fuente: VISUALIZACION,
    alt: { es: "El otro baño del edificio: urinarios, lavamanos y cambiador", en: "The other building restroom: urinals, sinks and a changing table" } },
  { id: "salon-doble-altura", src: "/fotos/cw-20-salon-doble-altura.webp", w: 1920, h: 1440, zona: "edificio", tipo: "visualizacion", fuente: VISUALIZACION,
    alt: { es: "El fondo del salón a doble altura, con el altillo arriba", en: "The back of the double-height hall, with the mezzanine above" } },
  { id: "altillo-pasillo", src: "/fotos/cw-28-altillo-pasillo.webp", w: 1920, h: 1440, zona: "edificio", tipo: "visualizacion", fuente: VISUALIZACION,
    alt: { es: "El pasillo del altillo, en blanco", en: "The mezzanine corridor, in white" } },
  { id: "altillo-salas", src: "/fotos/cw-29-altillo-pasillo.webp", w: 1920, h: 1440, zona: "edificio", tipo: "visualizacion", fuente: VISUALIZACION,
    alt: { es: "El altillo: el pasillo y la entrada a una de las salas", en: "The mezzanine: the corridor and the way into one of the rooms" } },
  { id: "altillo-sala-1", src: "/fotos/cw-30-altillo-sala.webp", w: 1920, h: 1440, zona: "edificio", tipo: "visualizacion", fuente: VISUALIZACION,
    alt: { es: "Una sala larga del altillo, vacía y en blanco", en: "A long mezzanine room, empty and white" } },
  { id: "altillo-sala-2", src: "/fotos/cw-31-altillo-sala.webp", w: 1920, h: 1440, zona: "edificio", tipo: "visualizacion", fuente: VISUALIZACION,
    alt: { es: "Una sala del altillo con ventana interior y puertas dobles", en: "A mezzanine room with an interior window and double doors" } },
  { id: "altillo-sala-3", src: "/fotos/cw-32-altillo-sala.webp", w: 1920, h: 1440, zona: "edificio", tipo: "visualizacion", fuente: VISUALIZACION,
    alt: { es: "Otra sala del altillo, con puertas dobles al pasillo", en: "Another mezzanine room, with double doors onto the corridor" } },
  { id: "altillo-sala-4", src: "/fotos/cw-33-altillo-sala.webp", w: 1920, h: 1440, zona: "edificio", tipo: "visualizacion", fuente: VISUALIZACION,
    alt: { es: "Una sala del altillo con ventana interior", en: "A mezzanine room with an interior window" } },
  { id: "sala-36", src: "/fotos/cw-36-sala.webp", w: 1920, h: 1440, zona: "edificio", tipo: "visualizacion", fuente: VISUALIZACION,
    alt: { es: "Una sala de trabajo del edificio, vacía y en blanco", en: "A work room in the building, empty and white" } },
  { id: "cocina", src: "/fotos/cw-38-cocina.webp", w: 1920, h: 1277, zona: "edificio", tipo: "real", fuente: SESION,
    alt: { es: "La cocina del edificio: campana de extracción, mesas de acero inoxidable y lavamanos",
           en: "The building's kitchen: an extraction hood, stainless-steel tables and hand sinks" } },
  { id: "edificio-salon", src: "/assets/edificio-doble-altura.jpg", w: 3214, h: 1924, zona: "edificio", tipo: "real", fuente: BROKER,
    alt: { es: "Dentro del edificio: planta diáfana de doble altura, suelo pulido y despachos acristalados al fondo",
           en: "Inside the building: an open double-height floor, polished concrete and glass-walled offices at the back" } },

  // ─────────────────────────────────────────────── desde el aire
  { id: "pabellon-dron", src: "/fotos/cw-50-pabellon-dron.webp", w: 1920, h: 1439, zona: "aereas", tipo: "real", fuente: SESION,
    punto: { x: 74, y: 104, rumbo: 225 }, encuadre: "48% 55%",
    alt: { es: "El Pabellón desde el dron: la pirámide de paja entre palmeras reales, en la esquina de dos calles de Wynwood",
           en: "The Pavilion from the drone: the thatch pyramid among royal palms, on a Wynwood street corner" } },
  { id: "lote", src: "/fotos/cw-01-lote-senalado.webp", w: 1920, h: 1438, zona: "aereas", tipo: "real", fuente: SESION,
    alt: { es: "Cenital del predio señalado: el edificio al norte, el Pabellón y el jardín al sur, sobre la manzana",
           en: "Overhead view with the property outlined: the building to the north, the Pavilion and Garden to the south" } },
  { id: "skyline", src: "/fotos/cw-02-wynwood-skyline.webp", w: 1920, h: 1438, zona: "aereas", tipo: "real", fuente: SESION,
    alt: { es: "El predio señalado en Wynwood, con el skyline de Miami y la bahía al fondo",
           en: "The property marked in Wynwood, with the Miami skyline and the bay behind" } },
  { id: "cenital", src: "/assets/flyer-cenital.jpg", w: 935, h: 506, zona: "aereas", tipo: "real", fuente: FLYER,
    alt: { es: "Cenital: el pabellón, el área de arena con sombrillas, las pérgolas y el paseo", en: "From directly above: the Pavilion, the sand area with umbrellas, the pergolas and the walkway" } },
  { id: "noche", src: "/assets/recinto-noche.jpg", w: 1920, h: 1080, zona: "aereas", tipo: "real", fuente: SITIO, montaje: true,
    alt: { es: "El recinto al anochecer durante un evento, visto desde arriba", en: "The venue at dusk during an event, seen from above" } },
  { id: "contexto", src: "/assets/contexto-predio.jpg", w: 2014, h: 1913, zona: "aereas", tipo: "real", fuente: DRON, encuadre: "50% 82%",
    alt: { es: "El predio señalado sobre la manzana, con el skyline de Miami al fondo",
           en: "The property outlined on its block, with the Miami skyline behind" } },
];

const POR_ID = new Map(FOTOS.map((f) => [f.id, f]));
const POR_SRC = new Map(FOTOS.map((f) => [f.src, f]));

export function foto(id: string): Foto {
  const f = POR_ID.get(id);
  if (!f) throw new Error(`lib/fotos.ts: no hay foto «${id}»`);
  return f;
}
export const fotoPorSrc = (src: string) => POR_SRC.get(src);

/** La galería: todas las que se enseñan, en el orden de `ZONAS` y, dentro de cada zona, de la lista. */
export const GALERIA: Foto[] = ZONAS.flatMap((z) => FOTOS.filter((f) => f.zona === z.clave && f.galeria !== false));

/** La foto de la portada: el dron sobre el Pabellón. */
export const PORTADA = "pabellon-dron";

/**
 * EL RECORRIDO A PIE: el orden en que alguien conoce el lugar llegando en coche. Cada paso es una foto y
 * una frase corta (la foto ya dice lo demás). Cuando lleguen las del interior en blanco se suman aquí.
 */
export interface Paso {
  foto: string;
  titulo: Record<Idioma, string>;
  texto: Record<Idioma, string>;
}

export const RECORRIDO_A_PIE: Paso[] = [
  { foto: "llegada",
    titulo: { es: "Llegas por NW 21st Ct", en: "You arrive on NW 21st Ct" },
    texto: { es: "Estacionamiento propio, en dos filas con calle de maniobra. Detrás del seto empieza el jardín.",
             en: "On-site parking in two rows with a drive aisle. The Garden starts behind the hedge." } },
  { foto: "entrada-jardin",
    titulo: { es: "La entrada al jardín", en: "Into the Garden" },
    texto: { es: "Un hueco en el seto y empieza el paseo. El Pabellón queda a la izquierda; las pérgolas, a la derecha.",
             en: "A gap in the hedge and the walkway begins. The Pavilion is on your left; the pergolas, on your right." } },
  { foto: "paseo-pabellon",
    titulo: { es: "El paseo", en: "The walkway" },
    texto: { es: "Losas con juntas de césped entre dos hileras de palmeras reales, de la calle a la puerta del edificio.",
             en: "Slabs with turf joints between two rows of royal palms, from the street to the building door." } },
  { foto: "pabellon-frente",
    titulo: { es: "El Pabellón", en: "The Pavilion" },
    texto: { es: "~4.000 ft² bajo techo de paja, abierto por los cuatro costados. Es el plan de lluvia.",
             en: "~4,000 sq ft under a thatch roof, open on all four sides. It's the rain plan." } },
  { foto: "bajo-pabellon",
    titulo: { es: "Bajo el Pabellón", en: "Under the Pavilion" },
    texto: { es: "Piso de césped artificial y estructura de madera vista. El montaje lo trae cada evento.",
             en: "Artificial turf floor and exposed timber frame. Each event brings its own setup." } },
  { foto: "patio-mural",
    titulo: { es: "El apron junto a la fachada", en: "The apron by the façade" },
    texto: { es: "Pavimento firme contra el edificio, con el mural de Wynwood de fondo. Aquí entra la carga por NW 1st Ct.",
             en: "Solid paving against the building, with the Wynwood mural behind it. Freight comes in here from NW 1st Ct." } },
  { foto: "fachada",
    titulo: { es: "La puerta del edificio", en: "The building door" },
    texto: { es: "Al final del paseo. El edificio se alquila aparte, como espacio vacío para equipar.",
             en: "At the end of the walkway. The building is rented separately, as an empty shell." } },
  { foto: "entrada-interior",
    titulo: { es: "Al entrar", en: "Stepping inside" },
    texto: { es: "Las puertas de vidrio dan al paseo: el jardín queda a un paso del interior.",
             en: "The glass doors open onto the walkway: the Garden is one step from the inside." } },
  { foto: "salon-blanco",
    titulo: { es: "El salón", en: "The main hall" },
    texto: { es: "Doble altura y planta libre. Así quedará con las paredes pintadas de blanco.",
             en: "Double height and an open floor. This is how it will look with the walls painted white." } },
  { foto: "barra",
    titulo: { es: "El mostrador", en: "The counter" },
    texto: { es: "Un mostrador fijo junto al salón, para recepción o barra.",
             en: "A built-in counter next to the hall, for a reception desk or a bar." } },
  { foto: "cocina",
    titulo: { es: "La cocina", en: "The kitchen" },
    texto: { es: "Con campana de extracción y mesas de acero. Es un adicional del edificio; afuera el catering monta en sitio.",
             en: "With an extraction hood and steel tables. It's an add-on to the building; outdoors, catering sets up on site." } },
  { foto: "bano-1",
    titulo: { es: "Los baños", en: "The restrooms" },
    texto: { es: "Dentro del edificio, con lavamanos corridos y cabinas.",
             en: "Inside the building, with a row of sinks and stalls." } },
  { foto: "altillo-salas",
    titulo: { es: "Arriba, el altillo", en: "Upstairs, the mezzanine" },
    texto: { es: "Un pasillo con cuatro salas privadas, para camerinos, oficinas de producción o invitados.",
             en: "A corridor with four private rooms, for green rooms, production offices or guests." } },
  { foto: "altillo-sala-2",
    titulo: { es: "Una de las salas", en: "One of the rooms" },
    texto: { es: "Vacía, en blanco y con puertas dobles. Se equipa según el uso.",
             en: "Empty, white, with double doors. Fitted out for whatever you need." } },
  { foto: "pabellon-dron",
    titulo: { es: "Desde arriba", en: "From above" },
    texto: { es: "La pirámide de paja, las palmeras y la esquina de dos calles de Wynwood.",
             en: "The thatch pyramid, the palms and a Wynwood street corner." } },
  { foto: "skyline",
    titulo: { es: "En Wynwood", en: "In Wynwood" },
    texto: { es: "A cuatro minutos a pie de Wynwood Walls, con el centro de Miami a la vista.",
             en: "A four-minute walk from Wynwood Walls, with downtown Miami in view." } },
];

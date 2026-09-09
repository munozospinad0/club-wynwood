/**
 * LA GALERÍA: todas las fotos del predio que se pueden enseñar, en un solo
 * sitio (Daniel, 7-sep-2026: «que haya una zona con las fotos, para poder
 * ver»). Solo entran fotos SIN la marca del operador en cuadro. Las `flyer-*`
 * vienen del flyer comercial del predio (Newmark, LoopNet, 2026); las demás, de
 * las fotos del sitio anterior.
 *
 * ⚠️ PENDIENTE, Y AQUÍ DECÍA QUE ESTABA RESUELTO. A `aerea-predio.jpg` y a
 * `venue-exterior.webp` se les pasó `delogo` de ffmpeg sobre el rótulo del
 * operador, y este comentario daba eso por «retirado». No lo está: `delogo`
 * difumina, no reconstruye, y en las dos queda **un parche borroso que se ve a
 * tamaño natural** — una banda de píxeles arrastrados sobre el mural en la
 * primera, una mancha sobre el muro del fondo en la segunda.
 *
 * Importa más de lo que parece: son las dos fotos más usadas del sitio —diez
 * huecos en las páginas interiores, la portada, la galería y el recorrido— y
 * `aerea-predio.jpg` es además la tarjeta de Open Graph, así que el parche
 * viaja en cada enlace que se comparte por WhatsApp.
 *
 * Lo que hace falta es rehacer el retoque con relleno consciente del contenido,
 * conservando encuadre y dimensiones para no tocar ni una línea de maquetación.
 * **No sustituirlas por `paseo-palmeras.jpg` ni `palmeras-aerea.jpg`**: son
 * limpias, pero de proporciones muy distintas (3,2:1 y casi cuadrada) y
 * romperían los diez huecos y la tarjeta de Open Graph.
 *
 * `w`/`h` son los píxeles reales: la galería reserva el hueco con ellos para
 * que la página no salte al cargar, y el visor nunca amplía por encima de
 * ellos.
 */

import type { Idioma } from "./i18n";

export interface FotoGaleria {
  id: string;
  src: string;
  w: number;
  h: number;
  alt: Record<Idioma, string>;
  fuente: Record<Idioma, string>;
}

const FLYER = { es: "flyer comercial del predio, 2026", en: "the property's commercial flyer, 2026" };
const DRON = { es: "fotografía aérea del predio", en: "aerial photograph of the site" };
const SITIO = { es: "fotografía del sitio", en: "site photograph" };
const CALLE = { es: "fotografía del inmueble desde la calle, 2026", en: "photograph of the building from the street, 2026" };
/**
 * Material de la ficha comercial del inmueble (Newmark, 2026). Se cita la
 * procedencia porque el sitio distingue lo propio de lo ajeno, y porque para
 * usarlas en pauta pagada hay que confirmarlo con el broker.
 */
const BROKER = { es: "ficha comercial del inmueble, 2026", en: "the property's commercial listing, 2026" };

export const GALERIA: FotoGaleria[] = [
  /**
   * LA PRIMERA FOTO DEL EDIFICIO. Hasta el 9-sep-2026 el sitio no tenía ni una:
   * se explicaba la zona 02 con el dibujo y con palabras, y quien quería ver
   * dónde iba a montar su evento no tenía nada que mirar. Esta llega de la
   * propiedad, es de la calle, y **no lleva el rótulo del operador en cuadro**,
   * que es la condición que hacía inservibles a casi todas las anteriores.
   */
  { id: "edificio-calle", src: "/assets/edificio-calle.jpg", w: 2047, h: 1365, fuente: CALLE,
    alt: { es: "El edificio desde NW 1st Ct: nave de dos niveles, portón de carga abierto y el mural en la esquina",
           en: "The building from NW 1st Ct: a two-level warehouse, the freight gate open and the mural on the corner" } },
  { id: "aerea", src: "/assets/aerea-predio.jpg", w: 1024, h: 683, fuente: DRON,
    alt: { es: "El predio desde el aire: la palapa, el paseo entre las palmeras y el jardín", en: "The site from the air: the structure, the walk between the palms and the garden" } },
  { id: "cenital", src: "/assets/flyer-cenital.jpg", w: 935, h: 506, fuente: FLYER,
    alt: { es: "Cenital: la palapa, el área de arena con sombrillas, las pérgolas y el paseo", en: "Overhead: the structure, the sand area with umbrellas, the pergolas and the walk" } },
  { id: "aerea-palapa", src: "/assets/flyer-aerea-palapa.jpg", w: 930, h: 1108, fuente: FLYER,
    alt: { es: "La palapa y las dos hileras de palmeras desde el aire", en: "The thatched structure and the two rows of palms from the air" } },
  { id: "paseo-puerta", src: "/assets/venue-exterior.webp", w: 1280, h: 853, fuente: SITIO,
    alt: { es: "El paseo pavimentado entre las palmeras, con la palapa a la izquierda y las pérgolas a la derecha", en: "The paved walk between the palms, with the structure on the left and the pergolas on the right" } },
  { id: "puerta", src: "/assets/flyer-paseo-puerta.jpg", w: 1110, h: 806, fuente: FLYER,
    alt: { es: "El paseo hasta la puerta del edificio, a ras de suelo", en: "The walk up to the building door, at ground level" } },
  { id: "palmeras", src: "/assets/palmeras-aerea.jpg", w: 736, h: 682, fuente: DRON,
    alt: { es: "Las dos hileras de palmeras reales sobre el césped y la palapa", en: "The two rows of real palms over the turf and the structure" } },
  { id: "paseo", src: "/assets/paseo-palmeras.jpg", w: 1280, h: 400, fuente: SITIO,
    alt: { es: "El paseo pavimentado, continuo y a nivel, entre las palmeras", en: "The paved walk, continuous and level, between the palms" } },
  { id: "bajo-palapa", src: "/assets/venue-palapa.webp", w: 1280, h: 960, fuente: SITIO,
    alt: { es: "Bajo la palapa: paja sobre madera, abierta por los costados", en: "Under the structure: thatch on timber, open on the sides" } },
  { id: "lounge", src: "/assets/flyer-palapa-lounge.jpg", w: 935, h: 614, fuente: FLYER,
    alt: { es: "Bajo la palapa: un montaje lounge con barra y guirnaldas", en: "Under the structure: a lounge setup with a bar and string lights" } },
  { id: "coctel", src: "/assets/flyer-palapa-coctel.jpg", w: 548, h: 1434, fuente: FLYER,
    alt: { es: "Bajo la palapa: mesas de cóctel y guirnaldas entre los cabios", en: "Under the structure: cocktail tables and string lights among the rafters" } },
  { id: "montaje", src: "/assets/palapa-montaje.jpg", w: 1600, h: 1200, fuente: SITIO,
    alt: { es: "Un montaje de sonido e iluminación bajo la palapa", en: "A sound and lighting setup under the structure" } },
  { id: "cabanas", src: "/assets/flyer-cabanas.jpg", w: 930, h: 614, fuente: FLYER,
    alt: { es: "Las cabañas: pérgolas con cortinas y sofás entre las palmeras", en: "The cabanas: pergolas with curtains and sofas among the palms" } },
  { id: "cabanas-fila", src: "/assets/cabanas-fila.jpg", w: 930, h: 614, fuente: SITIO,
    alt: { es: "La hilera de cabañas a ras de suelo: pérgolas blancas, cortinas, sofás y el muro verde detrás",
           en: "The cabana row at ground level: white pergolas, curtains, sofas and the green wall behind" } },
  { id: "palapa-sonido", src: "/assets/palapa-sonido.jpg", w: 1600, h: 1200, fuente: SITIO,
    alt: { es: "Bajo la palapa, montada: truss, altavoces y luces colgados de los cabios",
           en: "Under the structure, rigged: truss, speakers and lights hung from the rafters" } },
  { id: "noche", src: "/assets/recinto-noche.jpg", w: 1920, h: 1080, fuente: SITIO,
    alt: { es: "El recinto al anochecer durante un evento, visto desde arriba", en: "The site at dusk during an event, seen from above" } },

  /**
   * EL EDIFICIO. Llegaron el 9-sep-2026 en el paquete que recopiló el material
   * público del inmueble, y son las primeras que existen: hasta ahora la zona 02
   * se explicaba solo con el dibujo y con palabras, y quien quería ver el salón
   * o la cocina no tenía nada que mirar.
   *
   * Las dos de máxima resolución son la fachada norte y el salón de doble
   * altura. La cocina y la recepción vienen de la ficha comercial y son de
   * 740 px: sirven a tamaño de galería y no para ocupar el ancho de la página.
   * Están todas comprobadas una a una: **ninguna muestra al operador ni sus
   * atracciones**, que es la condición que descarta a la mitad del material.
   */
  { id: "edificio-fachada", src: "/assets/edificio-fachada.jpg", w: 3117, h: 2219, fuente: BROKER,
    alt: { es: "El edificio desde el norte: nave de dos niveles, zócalo azul y ventanas altas",
           en: "The building from the north: a two-level warehouse, blue base and clerestory windows" } },
  { id: "edificio-salon", src: "/assets/edificio-doble-altura.jpg", w: 3214, h: 1924, fuente: BROKER,
    alt: { es: "Dentro del edificio: planta diáfana de doble altura, suelo pulido y despachos acristalados al fondo",
           en: "Inside the building: an open double-height floor, polished concrete and glass-walled offices at the back" } },
  /**
   * Decía «nevera industrial» / «a commercial fridge», y en la foto es una
   * nevera doméstica de dos puertas junto a un microondas, una cafetera y una
   * isla de cuarzo. El pie de una foto es una afirmación como cualquier otra, y
   * esta la desmiente un catering en cinco minutos de visita: se describe lo
   * que se ve. Lo mismo obligó a revisar «cocina comercial con campana de
   * extracción» en `edificio.ts`, que no tenía ninguna fuente.
   */
  { id: "edificio-cocina", src: "/assets/edificio-cocina.jpg", w: 740, h: 428, fuente: BROKER,
    alt: { es: "La cocina del edificio: isla de cuarzo, nevera de dos puertas, microondas y alacenas",
           en: "The building's kitchen: a quartz island, a two-door fridge, a microwave and cabinets" } },
  { id: "edificio-recepcion", src: "/assets/edificio-recepcion.jpg", w: 739, h: 428, fuente: BROKER,
    alt: { es: "La recepción del edificio: mostrador curvo y puertas de vidrio a la calle",
           en: "The building's reception: a curved counter and glass doors to the street" } },
  { id: "contexto", src: "/assets/contexto-predio.jpg", w: 2014, h: 1913, fuente: DRON,
    alt: { es: "El predio señalado sobre la manzana, con el skyline de Miami al fondo",
           en: "The property outlined on its block, with the Miami skyline behind" } },
];

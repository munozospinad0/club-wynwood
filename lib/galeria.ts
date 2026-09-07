/**
 * LA GALERÍA: todas las fotos del predio que se pueden enseñar, en un solo
 * sitio (Daniel, 7-sep-2026: «que haya una zona con las fotos, para poder
 * ver»). Solo entran fotos SIN la marca del operador en cuadro; a las dos que
 * la tenían (`aerea-predio.jpg`, `venue-exterior.webp`) se les retiró el rótulo
 * con `delogo` de ffmpeg. Las `flyer-*` vienen del flyer comercial del predio
 * (Newmark, LoopNet, 2026); las demás, de las fotos del sitio anterior.
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

export const GALERIA: FotoGaleria[] = [
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
  { id: "noche", src: "/assets/recinto-noche.jpg", w: 1920, h: 1080, fuente: SITIO,
    alt: { es: "El recinto al anochecer durante un evento, visto desde arriba", en: "The site at dusk during an event, seen from above" } },
];

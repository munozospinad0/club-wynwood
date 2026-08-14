import { VENUE, ESPACIOS, FICHA, NO_INCLUIDO } from "./venue";
import { BASE, url, type Idioma } from "./i18n";

/**
 * Datos estructurados, derivados de lib/venue.ts.
 *
 * La auditoría encontró dos cosas en el sitio anterior:
 *   - schema_localbusiness_count = 0. Había EventVenue, que es un Place. Para
 *     intención local hace falta LocalBusiness: es lo que alimenta el pack de
 *     mapas y lo que mejor leen los motores generativos.
 *   - FAQPage sin `name`, completitud 50/100.
 *
 * Se declaran los dos y se enlazan con containsPlace/@id para que no compitan
 * entre sí. Todo sale de la fuente única: si cambia una cifra, cambia el schema.
 *
 * NO SE INVENTAN COORDENADAS. El checker pide `geo`, pero unas coordenadas mal
 * puestas mueven el pin del mapa y eso es peor que no tenerlas. Se añadirán
 * cuando se tomen en la visita.
 */

const ID_NEGOCIO = `${BASE}/#negocio`;
const ID_VENUE = `${BASE}/#venue`;

function direccion() {
  const d = VENUE.direccion;
  return {
    "@type": "PostalAddress",
    streetAddress: d.calle,
    addressLocality: d.ciudad,
    addressRegion: d.region,
    postalCode: d.cp,
    addressCountry: d.pais,
  };
}

export function localBusiness(lang: Idioma) {
  const desc =
    lang === "es"
      ? "Venue de eventos al aire libre en el Wynwood Arts District de Miami. Se alquila el espacio: ~18.000 ft² de jardín y una palapa techada de ~4.000 ft², por separado o juntos."
      : "Open-air event venue in Miami's Wynwood Arts District. The space is what's rented: ~18,000 sq ft of garden and a ~4,000 sq ft covered structure, separately or together.";

  return {
    "@type": "LocalBusiness",
    "@id": ID_NEGOCIO,
    name: VENUE.nombre,
    description: desc,
    url: url("home", lang),
    telephone: VENUE.telefono,
    email: VENUE.email,
    image: `${BASE}/assets/aerea-predio.jpg`,
    address: direccion(),
    areaServed: [
      { "@type": "City", name: "Miami" },
      { "@type": "AdministrativeArea", name: "Miami-Dade County" },
    ],
    priceRange: "$$$",
    currenciesAccepted: "USD",
    knowsLanguage: ["es", "en"],
    // Con cita previa: el horario público del predio es el del OPERADOR, no el
    // nuestro. Declararlo como propio sería un dato falso.
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      description:
        lang === "es"
          ? "Visitas técnicas y eventos con cita previa"
          : "Site visits and events by appointment",
    },
    makesOffer: ESPACIOS.map((e) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: lang === "es" ? `Alquiler — ${e.es}` : `Rental — ${e.en}`,
        description: lang === "es" ? e.resumenEs : e.resumenEn,
      },
    })),
    containsPlace: { "@id": ID_VENUE },
  };
}

export function eventVenue(lang: Idioma) {
  const verificados = FICHA.filter((f) => f.estado === "verificado");
  return {
    "@type": "EventVenue",
    "@id": ID_VENUE,
    name: VENUE.nombre,
    url: url("home", lang),
    address: direccion(),
    maximumAttendeeCapacity: 600,
    isAccessibleForFree: false,
    amenityFeature: verificados.map((f) => ({
      "@type": "LocationFeatureSpecification",
      name: lang === "es" ? f.es : f.en,
      value: lang === "es" ? f.valorEs : f.valorEn,
    })),
  };
}

export interface Pregunta {
  q: string;
  a: string;
}

export function faqPage(lang: Idioma, preguntas: Pregunta[]) {
  return {
    "@type": "FAQPage",
    "@id": `${url("faq", lang)}#faq`,
    name:
      lang === "es"
        ? "Preguntas frecuentes sobre Club Wynwood"
        : "Frequently asked questions about Club Wynwood",
    inLanguage: lang === "es" ? "es-US" : "en-US",
    mainEntity: preguntas.map((p) => ({
      "@type": "Question",
      name: p.q,
      acceptedAnswer: { "@type": "Answer", text: p.a },
    })),
  };
}

export function breadcrumb(lang: Idioma, nombre: string, href: string) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: VENUE.nombre, item: url("home", lang) },
      { "@type": "ListItem", position: 2, name: nombre, item: href },
    ],
  };
}

/** Envuelve varios nodos en un solo @graph: un bloque por página, no cinco. */
export function grafo(...nodos: object[]) {
  return { "@context": "https://schema.org", "@graph": nodos };
}

/**
 * Se exporta para tests: ninguna atracción del operador puede aparecer en el
 * schema. Es el error más caro que podríamos cometer.
 */
export function sinAtraccionesDelOperador(json: string): boolean {
  const s = json.toLowerCase();
  return !NO_INCLUIDO.some((t) => s.includes(t.toLowerCase()));
}

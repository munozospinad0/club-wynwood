import type { Idioma, ClaveRuta } from "./i18n";

/**
 * Contenido de las páginas interiores.
 *
 * Está aquí y no repartido por los componentes por la misma razón que las
 * cifras: el sitio anterior tenía el texto duplicado en el HTML y acabó
 * contradiciéndose solo.
 *
 * REGLA DE AEO: cada página abre con un bloque de respuesta autocontenido de
 * 40-60 palabras que responde su pregunta en la primera frase. Es el formato que
 * los modelos citan. Nada de "creemos" ni "en nuestra opinión": las frases
 * subjetivas suben la perplejidad y bajan la probabilidad de ser citado.
 */

export interface Bloque {
  titulo: Record<Idioma, string>;
  cuerpo: Record<Idioma, string>;
}

export interface Pagina {
  clave: Exclude<ClaveRuta, "home" | "faq">;
  ojo: Record<Idioma, string>;
  h1: Record<Idioma, string>;
  /** El bloque de respuesta. 40-60 palabras, conclusión primero. */
  respuesta: Record<Idioma, string>;
  title: Record<Idioma, string>;
  description: Record<Idioma, string>;
  cifras: Array<{ etiqueta: Record<Idioma, string>; valor: string }>;
  foto: { src: string; alt: Record<Idioma, string>; pie: Record<Idioma, string> };
  bloques: Bloque[];
}

export const PAGINAS: Pagina[] = [
  {
    clave: "jardin",
    ojo: { es: "Espacio 01 · al aire libre", en: "Space 01 · open-air" },
    h1: { es: "El Jardín", en: "The Garden" },
    respuesta: {
      es: "El Jardín son ~18.000 ft² de exterior continuo en Wynwood, Miami: la superficie mayor del recinto y la que admite montaje libre. Un paseo pavimentado la recorre de extremo a extremo, con franjas de césped artificial a ambos lados, dos hileras de palmeras reales y ocho cabañas amuebladas.",
      en: "The Garden is ~18,000 sq ft of continuous outdoor space in Wynwood, Miami: the larger surface of the site and the one that takes an open build. A paved walk runs end to end, with artificial turf strips on both sides, two rows of real palms and eight furnished cabanas.",
    },
    title: {
      es: "El Jardín — ~18.000 ft² al aire libre en Wynwood | Club Wynwood",
      en: "The Garden — ~18,000 sq ft outdoors in Wynwood | Club Wynwood",
    },
    description: {
      es: "El Jardín de Club Wynwood: ~18.000 ft² de exterior en Wynwood, Miami, con paseo pavimentado, césped artificial, dos hileras de palmeras y ocho cabañas amuebladas.",
      en: "Club Wynwood's Garden: ~18,000 sq ft outdoors in Wynwood, Miami, with a paved walk, artificial turf, two rows of palms and eight furnished cabanas.",
    },
    cifras: [
      { etiqueta: { es: "Superficie", en: "Area" }, valor: "~18 000 ft²" },
      { etiqueta: { es: "Cabañas amuebladas", en: "Furnished cabanas" }, valor: "8" },
      { etiqueta: { es: "De pie (recinto completo)", en: "Standing (whole site)" }, valor: "~600" },
    ],
    foto: {
      src: "/assets/venue-exterior.webp",
      alt: {
        es: "El paseo pavimentado entre las dos hileras de palmeras, con la palapa al fondo",
        en: "The paved walk between the two rows of palms, with the structure behind",
      },
      pie: {
        es: "El paseo central del Jardín, entre las dos hileras de palmeras.",
        en: "The Garden's central walk, between the two rows of palms.",
      },
    },
    bloques: [
      {
        titulo: { es: "Qué hay en el suelo", en: "What's on the ground" },
        cuerpo: {
          es: "Paseo pavimentado central de extremo a extremo, con césped artificial a ambos lados. Setos perimetrales cierran el recinto y mesas de picnic fijas completan el mobiliario existente. Es superficie firme: no hay que resolver piso antes de montar.",
          en: "A central paved walk running end to end, with artificial turf on both sides. Perimeter hedges close the site and fixed picnic tables complete the existing furniture. It is firm ground: you do not have to solve flooring before you build.",
        },
      },
      {
        titulo: { es: "Qué trae tu equipo", en: "What your team brings" },
        cuerpo: {
          es: "Producción, catering, sonido, iluminación y mobiliario adicional. Se alquila el espacio, no un paquete cerrado, y por eso una productora sabe exactamente qué recibe el día del montaje.",
          en: "Production, catering, sound, lighting and any extra furniture. You rent the space, not a closed package, which is why a production company knows exactly what it gets on load-in day.",
        },
      },
      {
        titulo: { es: "Si llueve", en: "If it rains" },
        cuerpo: {
          es: "El Jardín es contiguo al Tiki Hut, la palapa techada de ~4.000 ft². Se alquilan por separado o juntos: contratar los dos convierte la cubierta en el plan de lluvia del mismo recinto, sin mover el evento de sitio.",
          en: "The Garden is contiguous with the Tiki Hut, the ~4,000 sq ft covered structure. They rent separately or together: taking both turns the roof into the rain plan for the same site, without moving the event.",
        },
      },
    ],
  },

  {
    clave: "tikiHut",
    ojo: { es: "Espacio 02 · techado", en: "Space 02 · covered" },
    h1: { es: "El Tiki Hut", en: "The Tiki Hut" },
    respuesta: {
      es: "El Tiki Hut son ~4.000 ft² de palapa: techo de paja a cuatro aguas sobre dos hileras de postes de madera, abierta por los cuatro costados. Es la zona de sombra permanente del recinto y el plan anti-lluvia de la fecha, sin alquilar carpa ni mover el evento de sede.",
      en: "The Tiki Hut is ~4,000 sq ft of covered structure: a four-hipped thatched roof on two rows of timber posts, open on all four sides. It is the site's permanent shade zone and the rain plan for your date, without renting a tent or changing venue.",
    },
    title: {
      es: "El Tiki Hut — ~4.000 ft² techados en Wynwood | Club Wynwood",
      en: "The Tiki Hut — ~4,000 sq ft covered in Wynwood | Club Wynwood",
    },
    description: {
      es: "El Tiki Hut de Club Wynwood: palapa de paja de ~4.000 ft² sobre estructura de madera, abierta por los cuatro costados. Sombra permanente y plan de lluvia en Wynwood, Miami.",
      en: "Club Wynwood's Tiki Hut: a ~4,000 sq ft thatched structure on a timber frame, open on all four sides. Permanent shade and rain plan in Wynwood, Miami.",
    },
    cifras: [
      { etiqueta: { es: "Superficie techada", en: "Covered area" }, valor: "~4 000 ft²" },
      { etiqueta: { es: "Recinto completo", en: "Whole site" }, valor: "~22 000 ft²" },
      { etiqueta: { es: "Sentados (recinto completo)", en: "Seated (whole site)" }, valor: "~300" },
    ],
    foto: {
      src: "/assets/venue-palapa.webp",
      alt: {
        es: "Bajo la palapa: techo de paja sobre estructura de postes de madera",
        en: "Under the structure: thatch roof on timber posts",
      },
      pie: {
        es: "Bajo la palapa: paja sobre estructura de madera, abierta por los costados.",
        en: "Under the structure: thatch on a timber frame, open on all sides.",
      },
    },
    bloques: [
      {
        titulo: { es: "Por qué importa en Miami", en: "Why it matters in Miami" },
        cuerpo: {
          es: "Una fecha al aire libre en Miami depende del cielo. ~4.000 ft² techados significan que el evento tiene a dónde moverse sin cancelar y sin alquilar carpa. La cubierta es fija y ya está ahí.",
          en: "An outdoor date in Miami depends on the sky. ~4,000 sq ft under roof means the event has somewhere to go without cancelling and without renting a tent. The cover is permanent and already there.",
        },
      },
      {
        titulo: { es: "Abierta por los costados", en: "Open on all sides" },
        cuerpo: {
          es: "No es una sala: no hay cerramiento. Eso mantiene la ventilación y la continuidad visual con el Jardín, y es la razón por la que el recinto se lee como un solo espacio y no como dos.",
          en: "It is not a room: there is no enclosure. That keeps ventilation and visual continuity with the Garden, and it is why the site reads as one space rather than two.",
        },
      },
      {
        titulo: { es: "Rigging y alturas", en: "Rigging and heights" },
        cuerpo: {
          es: "La estructura es de paja sobre madera. Las alturas al alero y a cumbrera, y cualquier carga colgada, se miden y se aprueban en la visita técnica: no publicamos cotas que no hayamos levantado.",
          en: "The structure is thatch on timber. Eave and ridge heights, and any hung load, are measured and approved at the technical visit: we do not publish dimensions we have not surveyed.",
        },
      },
    ],
  },

  {
    clave: "bodas",
    ojo: { es: "Uso · boda", en: "Use · wedding" },
    h1: { es: "Bodas", en: "Weddings" },
    respuesta: {
      es: "Club Wynwood admite bodas de hasta ~300 invitados sentados o ~600 de pie usando el recinto completo. La ceremonia va en el Jardín y la recepción bajo la palapa, o al revés, y los ~4.000 ft² techados son el plan de lluvia sin cambiar de sede.",
      en: "Club Wynwood takes weddings of up to ~300 seated or ~600 standing across the whole site. The ceremony goes in the Garden and the reception under the structure, or the other way round, and the ~4,000 sq ft under roof are the rain plan without changing venue.",
    },
    title: {
      es: "Bodas al aire libre en Wynwood, Miami | Club Wynwood",
      en: "Outdoor weddings in Wynwood, Miami | Club Wynwood",
    },
    description: {
      es: "Venue para bodas al aire libre en Wynwood, Miami: ~22.000 ft², hasta ~300 sentados y una palapa techada de ~4.000 ft² como plan de lluvia.",
      en: "Outdoor wedding venue in Wynwood, Miami: ~22,000 sq ft, up to ~300 seated and a ~4,000 sq ft covered structure as the rain plan.",
    },
    cifras: [
      { etiqueta: { es: "Sentados", en: "Seated" }, valor: "~300" },
      { etiqueta: { es: "De pie", en: "Standing" }, valor: "~600" },
      { etiqueta: { es: "Plan de lluvia", en: "Rain plan" }, valor: "~4 000 ft²" },
    ],
    foto: {
      src: "/assets/aerea-predio.jpg",
      alt: {
        es: "Vista aérea del predio completo: la palapa techada, el paseo central y el jardín",
        en: "Aerial view of the whole site: the covered structure, the central walk and the garden",
      },
      pie: {
        es: "El predio completo: palapa, paseo central y jardín.",
        en: "The whole site: structure, central walk and garden.",
      },
    },
    bloques: [
      {
        titulo: { es: "Dos ambientes en un recinto", en: "Two settings, one site" },
        cuerpo: {
          es: "El Jardín y el Tiki Hut son contiguos y comparten el paseo. Eso permite separar ceremonia, cóctel y baile sin que los invitados salgan del recinto ni haya traslado.",
          en: "The Garden and the Tiki Hut are contiguous and share the walk. That lets you separate ceremony, cocktail hour and dancing without guests leaving the site and without transfers.",
        },
      },
      {
        titulo: { es: "Tu planner, tus proveedores", en: "Your planner, your vendors" },
        cuerpo: {
          es: "No imponemos catering ni decoración. Trabajas con tu wedding planner y tus proveedores; nosotros entregamos el espacio. Ocho cabañas amuebladas y las mesas de picnic ya están en el jardín.",
          en: "We do not impose catering or decor. You work with your wedding planner and your vendors; we hand over the space. Eight furnished cabanas and the picnic tables are already in the garden.",
        },
      },
      {
        titulo: { es: "Wynwood como fondo", en: "Wynwood as the backdrop" },
        cuerpo: {
          es: "2129 NW 1st Ct, a cuatro minutos a pie de Wynwood Walls. Las palmeras, la paja y los murales del barrio son el fondo real de las fotos, no un set.",
          en: "2129 NW 1st Ct, a four-minute walk from Wynwood Walls. The palms, the thatch and the neighbourhood murals are the real backdrop of the photographs, not a set.",
        },
      },
    ],
  },

  {
    clave: "corporativo",
    ojo: { es: "Uso · marca", en: "Use · brand" },
    h1: { es: "Activaciones y corporativo", en: "Brand and corporate" },
    respuesta: {
      es: "Club Wynwood son ~22.000 ft² al aire libre en el Wynwood Arts District con aforo de ~600 de pie. El recinto llega vacío: la agencia monta la marca sin pelear con la decoración de nadie, sobre superficie firme y con límites claros.",
      en: "Club Wynwood is ~22,000 sq ft outdoors in the Wynwood Arts District with capacity for ~600 standing. The site arrives empty: the agency builds the brand without fighting anyone else's decor, on firm ground and with clear boundaries.",
    },
    title: {
      es: "Activaciones de marca y eventos corporativos en Wynwood | Club Wynwood",
      en: "Brand activations and corporate events in Wynwood | Club Wynwood",
    },
    description: {
      es: "Espacio para activaciones de marca y eventos corporativos en Wynwood, Miami: ~22.000 ft² al aire libre, ~600 de pie y montaje libre.",
      en: "Space for brand activations and corporate events in Wynwood, Miami: ~22,000 sq ft outdoors, ~600 standing and an open build.",
    },
    cifras: [
      { etiqueta: { es: "De pie", en: "Standing" }, valor: "~600" },
      { etiqueta: { es: "Superficie total", en: "Total area" }, valor: "~22 000 ft²" },
      { etiqueta: { es: "Techado", en: "Covered" }, valor: "~4 000 ft²" },
    ],
    foto: {
      src: "/assets/aerea-predio.jpg",
      alt: {
        es: "Vista aérea del predio con la palapa techada al centro",
        en: "Aerial view of the site with the covered structure at the centre",
      },
      pie: {
        es: "~22.000 ft² de exterior, con la palapa techada al centro.",
        en: "~22,000 sq ft outdoors, with the covered structure at the centre.",
      },
    },
    bloques: [
      {
        titulo: { es: "Un lienzo, no un salón", en: "A canvas, not a ballroom" },
        cuerpo: {
          es: "La razón por la que una marca elige este recinto es que no tiene estética propia que imponer. Superficie firme, límites claros y cero ambigüedad sobre qué está incluido.",
          en: "The reason a brand picks this site is that it has no aesthetic of its own to impose. Firm ground, clear boundaries and zero ambiguity about what is included.",
        },
      },
      {
        titulo: { es: "El barrio hace parte del brief", en: "The neighbourhood is part of the brief" },
        cuerpo: {
          es: "Wynwood es contexto real, no una línea de marketing: el barrio de Art Basel, a una cuadra de los murales y a tres minutos del acceso a la I-95.",
          en: "Wynwood is real context, not a marketing line: the Art Basel district, one block from the murals and three minutes from the I-95 access.",
        },
      },
      {
        titulo: { es: "Lo que decide un productor", en: "What a producer decides on" },
        cuerpo: {
          es: "Potencia, load-in, ancho de portón, parking, curfew y límite de dB se levantan contigo en la visita técnica y se entregan por escrito. Preferimos eso a publicar cifras que luego no se sostengan.",
          en: "Power, load-in, gate width, parking, curfew and dB limit are surveyed with you at the technical visit and delivered in writing. We prefer that to publishing figures that will not hold up.",
        },
      },
    ],
  },

  {
    clave: "produccion",
    ojo: { es: "Uso · producción", en: "Use · production" },
    h1: { es: "Rodajes y producción", en: "Shoots and production" },
    respuesta: {
      es: "Club Wynwood es un recinto privado de ~22.000 ft² con tres texturas a pocos metros: palmeras y césped, paja sobre madera, y pavimento continuo. Hay luz natural todo el día y ~4.000 ft² de sombra fija que sirven de base o de cobertura si cambia el clima.",
      en: "Club Wynwood is a private ~22,000 sq ft site with three textures a few metres apart: palms and turf, thatch on timber, and continuous paving. There is natural light all day and ~4,000 sq ft of permanent shade that works as base camp or cover if the weather turns.",
    },
    title: {
      es: "Locación para rodajes y producción en Wynwood, Miami | Club Wynwood",
      en: "Film and production location in Wynwood, Miami | Club Wynwood",
    },
    description: {
      es: "Locación al aire libre en Wynwood para rodaje, fotografía y producción: palmeras, palapa de paja de ~4.000 ft², césped y paseo pavimentado. ~22.000 ft² privados.",
      en: "Outdoor location in Wynwood for film, photography and production: palms, a ~4,000 sq ft thatched structure, turf and a paved walk. ~22,000 sq ft private.",
    },
    cifras: [
      { etiqueta: { es: "Superficie privada", en: "Private area" }, valor: "~22 000 ft²" },
      { etiqueta: { es: "Sombra fija", en: "Permanent shade" }, valor: "~4 000 ft²" },
      { etiqueta: { es: "Cabañas amuebladas", en: "Furnished cabanas" }, valor: "8" },
    ],
    foto: {
      src: "/assets/venue-exterior.webp",
      alt: {
        es: "Palmeras, césped y paseo pavimentado en el mismo encuadre",
        en: "Palms, turf and paved walk in the same frame",
      },
      pie: {
        es: "Palmeras, césped y paseo pavimentado en el mismo encuadre.",
        en: "Palms, turf and paved walk in the same frame.",
      },
    },
    bloques: [
      {
        titulo: { es: "Tres texturas, un recinto", en: "Three textures, one site" },
        cuerpo: {
          es: "Dos hileras de palmeras reales, un techo de paja a cuatro aguas y un paseo pavimentado de extremo a extremo. Se cambia de fondo caminando, sin mover la unidad a otra locación.",
          en: "Two rows of real palms, a four-hipped thatched roof and a paved walk running end to end. You change backdrop on foot, without moving the unit to another location.",
        },
      },
      {
        titulo: { es: "Sombra sin carpa", en: "Shade without a tent" },
        cuerpo: {
          es: "La palapa da ~4.000 ft² de sombra continua: sirve de base, de comedor o de cobertura si cambia el clima, sin sumar estructura al presupuesto.",
          en: "The structure gives ~4,000 sq ft of continuous shade: it works as base camp, as crew dining or as cover if the weather turns, without adding structure to the budget.",
        },
      },
      {
        titulo: { es: "Permisos y horarios", en: "Permits and hours" },
        cuerpo: {
          es: "Curfew, límite de dB, parking de unidad y ancho de portón para carga se confirman en la visita técnica y quedan por escrito antes de firmar.",
          en: "Curfew, dB limit, unit parking and gate width for load-in are confirmed at the technical visit and put in writing before signing.",
        },
      },
    ],
  },
];

export function pagina(clave: string): Pagina | undefined {
  return PAGINAS.find((p) => p.clave === clave);
}

/** Las 8 preguntas de la FAQ. Alimentan la página y el FAQPage del schema. */
export const FAQ: Array<{ q: Record<Idioma, string>; a: Record<Idioma, string> }> = [
  {
    q: { es: "¿Qué incluye el alquiler de Club Wynwood?", en: "What does renting Club Wynwood include?" },
    a: {
      es: "Se alquila el espacio exterior: el Jardín de ~18.000 ft² y el Tiki Hut techado de ~4.000 ft², por separado o juntos, con las ocho cabañas amuebladas y las mesas de picnic que ya están en el jardín. La producción, el catering, el sonido, la iluminación y el mobiliario adicional los aporta tu equipo o tu productora.",
      en: "You rent the outdoor space: the ~18,000 sq ft Garden and the ~4,000 sq ft covered Tiki Hut, separately or together, with the eight furnished cabanas and the picnic tables already in the garden. Production, catering, sound, lighting and extra furniture come from your team or your production company.",
    },
  },
  {
    q: { es: "¿Cuánta gente cabe?", en: "How many people fit?" },
    a: {
      es: "Aproximadamente 600 personas de pie o 300 sentadas usando el recinto completo. El aforo exacto depende del montaje y se confirma en la visita técnica.",
      en: "Roughly 600 standing or 300 seated using the whole site. Exact capacity depends on the layout and is confirmed at the technical visit.",
    },
  },
  {
    q: { es: "¿Qué pasa si llueve?", en: "What happens if it rains?" },
    a: {
      es: "El Tiki Hut es una palapa techada de ~4.000 ft² con techo de paja a cuatro aguas, abierta por los costados. Es cubierta fija: funciona como plan de lluvia sin alquilar carpa ni mover el evento de sede.",
      en: "The Tiki Hut is a ~4,000 sq ft covered structure with a four-hipped thatched roof, open on the sides. It is permanent cover: it works as the rain plan without renting a tent or moving the event.",
    },
  },
  {
    q: { es: "¿Se pueden alquilar los dos espacios por separado?", en: "Can the two spaces be rented separately?" },
    a: {
      es: "Sí. El Jardín y el Tiki Hut se alquilan por separado o combinados. Son contiguos y comparten el paseo central, así que juntos funcionan como un solo recinto continuo y no como dos salas.",
      en: "Yes. The Garden and the Tiki Hut rent separately or combined. They are contiguous and share the central walk, so together they work as one continuous site rather than two rooms.",
    },
  },
  {
    q: { es: "¿Dónde queda exactamente?", en: "Where exactly is it?" },
    a: {
      es: "En 2129 NW 1st Ct, Miami, FL 33127, dentro del Wynwood Arts District. A cuatro minutos a pie de Wynwood Walls, tres del acceso a la I-95, seis de Midtown y el Design District y dieciséis del aeropuerto MIA.",
      en: "At 2129 NW 1st Ct, Miami, FL 33127, inside the Wynwood Arts District. Four minutes on foot from Wynwood Walls, three from the I-95 access, six from Midtown and the Design District and sixteen from MIA airport.",
    },
  },
  {
    q: { es: "¿Publican tarifas?", en: "Do you publish rates?" },
    a: {
      es: "No. Los paquetes se arman contra cada evento, porque el precio depende de la fecha, del espacio que uses y del montaje. Se envían junto con la disponibilidad.",
      en: "No. Packages are built against each event, because the price depends on the date, the space you use and the build. They are sent together with availability.",
    },
  },
  {
    q: { es: "¿Hay potencia, parking y baños?", en: "Is there power, parking and restrooms?" },
    a: {
      es: "Sí, y su detalle exacto —amperaje y fase, plazas de parking, número de baños, ancho de portón para carga, licencia de licor, curfew y límite de dB— se levanta contigo en la visita técnica y se entrega por escrito. No lo publicamos porque no lo hemos medido nosotros.",
      en: "Yes, and the exact detail —amperage and phase, parking spaces, number of restrooms, gate width for load-in, liquor licence, curfew and dB limit— is surveyed with you at the technical visit and delivered in writing. We do not publish it because we have not measured it ourselves.",
    },
  },
  {
    q: { es: "¿Se puede visitar antes de reservar?", en: "Can I visit before booking?" },
    a: {
      es: "Sí, y lo recomendamos. La visita técnica es donde se levantan las cotas, el aforo por montaje y la ficha de infraestructura, y donde tu productora comprueba si el recinto sirve para lo que tiene en la cabeza.",
      en: "Yes, and we recommend it. The technical visit is where dimensions, capacity per layout and the infrastructure sheet are surveyed, and where your production company checks whether the site works for what they have in mind.",
    },
  },
];

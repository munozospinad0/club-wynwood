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
  cifras: Array<{ etiqueta: Record<Idioma, string>; valor: string | Record<Idioma, string> }>;
  foto: { src: string; alt: Record<Idioma, string>; pie: Record<Idioma, string> };
  bloques: Bloque[];
}

export const PAGINAS: Pagina[] = [
  {
    clave: "jardin",
    ojo: { es: "Espacio 01 · al aire libre", en: "Space 01 · open-air" },
    h1: { es: "El Jardín", en: "The Garden" },
    respuesta: {
      es: "El Jardín son ~18.000 ft² de exterior continuo en Wynwood, Miami: la superficie mayor del recinto y la que admite montaje libre. Un paseo pavimentado baja de la puerta del edificio al estacionamiento, con césped artificial del lado de la palapa y arena del lado de las cabañas, dos hileras de palmeras reales, un área de arena con mesas de picnic y seis cabañas amuebladas.",
      en: "The Garden is ~18,000 sq ft of continuous outdoor space in Wynwood, Miami: the larger surface of the site and the one that takes an open build. A paved walk runs from the building door down to the parking lot, with artificial turf on the structure's side and sand on the cabanas' side, two rows of real palms, picnic tables and six furnished cabanas.",
    },
    title: {
      es: "El Jardín — ~18.000 ft² al aire libre en Wynwood | Club Wynwood",
      en: "The Garden — ~18,000 sq ft outdoors in Wynwood | Club Wynwood",
    },
    description: {
      es: "El Jardín de Club Wynwood: ~18.000 ft² de exterior en Wynwood, Miami, con paseo pavimentado, césped artificial, dos hileras de palmeras y seis cabañas amuebladas.",
      en: "Club Wynwood's Garden: ~18,000 sq ft outdoors in Wynwood, Miami, with a paved walk, artificial turf, two rows of palms and six furnished cabanas.",
    },
    cifras: [
      { etiqueta: { es: "Superficie", en: "Area" }, valor: "~18 000 ft²" },
      { etiqueta: { es: "Cabañas amuebladas", en: "Furnished cabanas" }, valor: "6" },
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
          es: "Paseo pavimentado central de la puerta al estacionamiento, con césped artificial a un lado y arena al otro. Setos perimetrales cierran el recinto y mesas de picnic fijas completan el mobiliario existente. Es superficie firme: no hay que resolver piso antes de montar.",
          en: "A central paved walk from the door to the parking lot, with artificial turf on one side and sand on the other. Perimeter hedges close the site and fixed picnic tables complete the existing furniture. The walk is firm ground: you do not have to solve flooring before you build.",
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
      es: "El Tiki Hut son ~4.000 ft² de palapa: techo de paja a cuatro aguas sobre nueve postes de madera, abierta por los cuatro costados. Es la zona de sombra permanente del recinto y el plan anti-lluvia de la fecha, sin mover el evento de sede. Para el agua que cae recta basta sola; con viento conviene cerrar los costados.",
      en: "The Tiki Hut is ~4,000 sq ft of covered structure: a four-hipped thatched roof on nine timber posts, open on all four sides. It is the site's permanent shade zone and the rain plan for your date, without changing venue. For vertical rain it is enough on its own; with wind you will want the sides closed.",
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
          es: "Una fecha al aire libre en Miami depende del cielo. ~4.000 ft² techados significan que el evento tiene a dónde moverse sin cancelar. La cubierta es fija y ya está ahí: para el agua que cae recta basta sola, y con viento conviene cerrar los costados.",
          en: "An outdoor date in Miami depends on the sky. ~4,000 sq ft under roof means the event has somewhere to go without cancelling. The cover is permanent and already there: for vertical rain it is enough on its own, and with wind you will want the sides closed.",
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
          es: "No imponemos catering ni decoración. Trabajas con tu wedding planner y tus proveedores; nosotros entregamos el espacio. seis cabañas amuebladas y las mesas de picnic ya están en el jardín.",
          en: "We do not impose catering or decor. You work with your wedding planner and your vendors; we hand over the space. six furnished cabanas and the picnic tables are already in the garden.",
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
      { etiqueta: { es: "Cabañas amuebladas", en: "Furnished cabanas" }, valor: "6" },
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

  {
    clave: "guia",
    ojo: { es: "Guía", en: "Guide" },
    h1: { es: "Organizar un evento en Wynwood", en: "Hosting an event in Wynwood" },
    respuesta: {
      es: "Para hacer un evento en Wynwood hay seis cosas que se deciden antes que el sitio: cuánta gente, si hay plan de lluvia, cuánta potencia necesita tu producción, por dónde entra el camión, hasta qué hora puedes sonar y quién pone la barra. Esta página es la lista de preguntas, en el orden en que conviene hacerlas.",
      en: "Six things get decided before the venue when you host an event in Wynwood: how many people, whether there is a rain plan, how much power your production needs, where the truck loads in, how late you can run sound and who provides the bar. This page is that checklist, in the order worth asking it.",
    },
    title: {
      es: "Cómo organizar un evento en Wynwood, Miami — la lista de preguntas | Club Wynwood",
      en: "How to host an event in Wynwood, Miami — the checklist | Club Wynwood",
    },
    description: {
      es: "Las seis preguntas que hay que hacerle a cualquier venue de Wynwood antes de reservar: aforo, plan de lluvia, potencia, load-in, curfew y barra. Con lo que respondemos nosotros.",
      en: "The six questions to ask any Wynwood venue before booking: capacity, rain plan, power, load-in, curfew and bar. Including how we answer them.",
    },
    cifras: [
      { etiqueta: { es: "Preguntas", en: "Questions" }, valor: "6" },
      { etiqueta: { es: "Se responden en", en: "Answered at" }, valor: "1 visita" },
      { etiqueta: { es: "Por escrito", en: "In writing" }, valor: "Sí" },
    ],
    foto: {
      src: "/assets/aerea-predio.jpg",
      alt: {
        es: "Vista aérea de un recinto de eventos al aire libre en Wynwood, Miami",
        en: "Aerial view of an open-air event site in Wynwood, Miami",
      },
      pie: {
        es: "Un recinto al aire libre en Wynwood: 2129 NW 1st Ct.",
        en: "An open-air site in Wynwood: 2129 NW 1st Ct.",
      },
    },
    bloques: [
      {
        titulo: { es: "1. ¿Cuánta gente, y sentada o de pie?", en: "1. How many people, seated or standing?" },
        cuerpo: {
          es: "Es la primera y la que cambia todo lo demás. Un recinto que aguanta 600 de pie no aguanta 600 sentados: con mesas redondas y pista, la misma superficie baja a la mitad. Pide siempre las dos cifras por separado, y pregunta cuál es el aforo con TU montaje, no el máximo teórico. Aquí son ~600 de pie y ~300 sentados en el recinto completo.",
          en: "This is the first one and it changes everything else. A site that holds 600 standing does not hold 600 seated: with round tables and a dance floor, the same surface drops by half. Always ask for both figures separately, and ask what the capacity is with YOUR layout, not the theoretical maximum. Here it is ~600 standing and ~300 seated across the whole site.",
        },
      },
      {
        titulo: { es: "2. ¿Qué pasa si llueve?", en: "2. What happens if it rains?" },
        cuerpo: {
          es: "En Miami esta pregunta no es opcional. Hay tres respuestas posibles y solo una es buena: «hay cubierta fija», «se alquila carpa» (súmalo al presupuesto y comprueba que cabe) o «se reprograma» (que no es un plan). Pregunta cuántos ft² están techados de verdad, no si «hay una zona cubierta». Aquí son ~4.000 ft² de palapa fija.",
          en: "In Miami this question is not optional. There are three possible answers and only one is good: “there is permanent cover”, “a tent is rented” (add it to the budget and check it fits) or “we reschedule” (which is not a plan). Ask how many square feet are actually roofed, not whether “there is a covered area”. Here it is ~4,000 sq ft of permanent structure.",
        },
      },
      {
        titulo: { es: "3. ¿Cuánta potencia hay, y de qué tipo?", en: "3. How much power, and what kind?" },
        cuerpo: {
          es: "No basta con «sí hay luz». Tu proveedor de sonido e iluminación necesita amperaje y fase, y si el recinto no lo tiene, entra un generador —que cuesta, hace ruido y necesita sitio—. Pide el dato por escrito antes de firmar. Si un venue no te lo sabe decir, es que nadie lo ha medido.",
          en: "“Yes, there is power” is not enough. Your sound and lighting supplier needs amperage and phase, and if the site does not have it, a generator comes in — which costs money, makes noise and needs space. Ask for the figure in writing before signing. If a venue cannot tell you, it means nobody has measured it.",
        },
      },
      {
        titulo: { es: "4. ¿Por dónde entra el camión?", en: "4. Where does the truck load in?" },
        cuerpo: {
          es: "El ancho del portón decide si tu producción entra rodando o a mano, y eso son horas de montaje y dinero. Pregunta ancho libre, si hay drive-in, y a qué hora se puede empezar a descargar. En Wynwood, además, la calle importa: no todas admiten un camión parado.",
          en: "Gate width decides whether your production rolls in or goes in by hand, and that is hours of load-in and money. Ask for clear width, whether there is drive-in access, and what time you can start unloading. In Wynwood the street matters too: not all of them take a parked truck.",
        },
      },
      {
        titulo: { es: "5. ¿Hasta qué hora, y con cuántos decibelios?", en: "5. Until what time, and at how many decibels?" },
        cuerpo: {
          es: "Curfew y límite de dB son dos cosas distintas y las dos te pueden cortar la fiesta. Wynwood es un barrio con vivienda, así que pregunta las dos por escrito y confirma quién responde si aparece una queja. Un venue que no tiene clara esta respuesta te está pasando el riesgo a ti.",
          en: "Curfew and dB limit are two different things and either can end your party. Wynwood is a neighbourhood with housing, so ask for both in writing and confirm who answers if a complaint comes in. A venue that is not clear on this is handing you the risk.",
        },
      },
      {
        titulo: { es: "6. ¿Quién pone la barra?", en: "6. Who provides the bar?" },
        cuerpo: {
          es: "Hay tres modelos: el venue tiene licencia y vende, el venue te obliga a su proveedor, o traes tu barra con tu licencia. Cambian el presupuesto y el margen por completo. Pregúntalo antes de enamorarte del sitio, porque es donde más se rompen las cuentas.",
          en: "There are three models: the venue holds the licence and sells, the venue requires its own supplier, or you bring your bar with your licence. They change the budget and the margin completely. Ask before falling in love with the place, because this is where the numbers break most often.",
        },
      },
      {
        titulo: { es: "Cómo respondemos nosotros", en: "How we answer" },
        cuerpo: {
          es: "Las dos primeras están publicadas en este sitio con sus cifras. Las cuatro siguientes —potencia, load-in, curfew y barra— se revisan contigo el día de la visita y te las mandamos por escrito. No las publicamos porque no las hemos medido nosotros, y preferimos eso a poner un número que luego no se sostenga.",
          en: "The first two are published on this site with their figures. The next four — power, load-in, curfew and bar — are reviewed with you on the day of the visit and sent to you in writing. We do not publish them because we have not measured them ourselves, and we prefer that to putting up a number that will not hold.",
        },
      },
    ],
  },

  {
    clave: "quinces",
    ojo: { es: "Uso · quinceañera", en: "Use · quinceañera" },
    h1: { es: "Quinceañeras", en: "Quinceañeras" },
    respuesta: {
      es: "El recinto admite hasta ~300 invitados sentados, con la entrada y el vals en el jardín y la cena y el baile bajo la palapa techada de ~4.000 ft². Los ~4.000 ft² cubiertos son además el plan de lluvia, así que la fecha no depende del cielo de Miami.",
      en: "The site takes up to ~300 seated guests, with the entrance and the waltz in the garden and dinner and dancing under the ~4,000 sq ft covered structure. Those covered square feet are also the rain plan, so the date does not depend on the Miami sky.",
    },
    title: {
      es: "Salón para quinceañeras en Wynwood, Miami — hasta 300 invitados | Club Wynwood",
      en: "Quinceañera venue in Wynwood, Miami — up to 300 guests | Club Wynwood",
    },
    description: {
      es: "Venue al aire libre para quinceañeras en Wynwood, Miami: hasta ~300 sentados, jardín para la entrada y el vals, y palapa techada de ~4.000 ft² para la cena y el baile.",
      en: "Open-air quinceañera venue in Wynwood, Miami: up to ~300 seated, a garden for the entrance and waltz, and a ~4,000 sq ft covered structure for dinner and dancing.",
    },
    cifras: [
      { etiqueta: { es: "Sentados", en: "Seated" }, valor: "~300" },
      { etiqueta: { es: "Bajo techo", en: "Under roof" }, valor: "~4 000 ft²" },
      { etiqueta: { es: "Cabañas", en: "Cabanas" }, valor: "6" },
    ],
    foto: {
      src: "/assets/venue-exterior.webp",
      alt: {
        es: "El paseo pavimentado entre palmeras, recorrido de entrada para una quinceañera",
        en: "The paved walk between palms, an entrance aisle for a quinceañera",
      },
      pie: {
        es: "El paseo central entre las dos hileras de palmeras.",
        en: "The central walk between the two rows of palms.",
      },
    },
    bloques: [
      {
        titulo: { es: "La entrada tiene recorrido", en: "The entrance has a walk" },
        cuerpo: {
          es: "El paseo pavimentado recorre el jardín de extremo a extremo entre dos hileras de palmeras reales. Es un pasillo de entrada que ya existe: no hay que montarlo ni alfombrarlo, y las fotos salen con las palmeras y los murales del barrio de fondo, no con una pared.",
          en: "The paved walk runs the length of the garden between two rows of real palms. It is an entrance aisle that already exists: it does not need building or carpeting, and the photographs come out with palms and the neighbourhood murals behind, not a wall.",
        },
      },
      {
        titulo: { es: "Cena y baile bajo techo", en: "Dinner and dancing under cover" },
        cuerpo: {
          es: "La palapa de ~4.000 ft² cubre la parte sentada del evento. Eso resuelve dos cosas a la vez: la lluvia y el sol de Miami a las cinco de la tarde. Las seis cabañas amuebladas del jardín funcionan como zonas de descanso para los invitados mayores.",
          en: "The ~4,000 sq ft structure covers the seated part of the event. That solves two things at once: the rain and the five-o'clock Miami sun. The six furnished cabanas in the garden work as rest areas for older guests.",
        },
      },
      {
        titulo: { es: "Tu decoración, sin competencia", en: "Your decor, uncontested" },
        cuerpo: {
          es: "El recinto no tiene una estética propia que imponer. Eso importa en una quinceañera más que en ningún otro evento: el color y el montaje los pone la familia o su decorador, y aquí no hay moqueta ni lámparas ni un salón que pelee con ellos.",
          en: "The site has no aesthetic of its own to impose. That matters more at a quinceañera than at any other event: the colour scheme and the build come from the family or their decorator, and here there is no carpet, no chandeliers and no ballroom competing with them.",
        },
      },
    ],
  },

  {
    clave: "aforos",
    ojo: { es: "Ficha · aforo", en: "Spec · capacity" },
    h1: { es: "Aforo y montajes", en: "Capacity and layouts" },
    respuesta: {
      es: "Club Wynwood admite ~600 personas de pie o ~300 sentadas usando el recinto completo de ~22.000 ft². La diferencia no es un truco: con mesas redondas, pista y servicio, la misma superficie rinde aproximadamente la mitad. El aforo con tu montaje concreto se confirma en la visita técnica.",
      en: "Club Wynwood takes ~600 people standing or ~300 seated across the whole ~22,000 sq ft site. The gap is not a trick: with round tables, a dance floor and service, the same surface yields roughly half. Capacity for your specific layout is confirmed at the technical visit.",
    },
    title: {
      es: "Aforo: cuánta gente cabe — 600 de pie, 300 sentados | Club Wynwood",
      en: "Capacity: how many people fit — 600 standing, 300 seated | Club Wynwood",
    },
    description: {
      es: "Cuánta gente cabe en Club Wynwood: ~600 de pie o ~300 sentados en ~22.000 ft². Cómo cambia el aforo según el montaje y por qué las dos cifras son tan distintas.",
      en: "How many people fit at Club Wynwood: ~600 standing or ~300 seated across ~22,000 sq ft. How capacity changes with the layout and why the two figures differ so much.",
    },
    cifras: [
      { etiqueta: { es: "De pie", en: "Standing" }, valor: "~600" },
      { etiqueta: { es: "Sentados", en: "Seated" }, valor: "~300" },
      { etiqueta: { es: "Superficie", en: "Area" }, valor: "~22 000 ft²" },
    ],
    foto: {
      src: "/assets/aerea-predio.jpg",
      alt: {
        es: "Vista aérea del recinto completo, con la palapa techada y el jardín",
        en: "Aerial view of the whole site, with the covered structure and the garden",
      },
      pie: {
        es: "El recinto completo: ~22.000 ft² entre jardín y palapa.",
        en: "The whole site: ~22,000 sq ft between garden and structure.",
      },
    },
    bloques: [
      {
        titulo: { es: "Por qué 600 y 300 son tan distintos", en: "Why 600 and 300 differ so much" },
        cuerpo: {
          es: "Una persona de pie en un cóctel ocupa alrededor de un tercio de lo que ocupa sentada en una mesa redonda con su silla, su parte de mesa y el pasillo del servicio. Añade pista de baile, escenario y barra y la superficie útil baja otra vez. Por eso ningún venue serio te da una sola cifra.",
          en: "A person standing at a cocktail takes roughly a third of what they take seated at a round table, counting their share of table and the service aisle. Add a dance floor, a stage and a bar and the usable surface drops again. That is why no serious venue gives you a single figure.",
        },
      },
      {
        titulo: { es: "Por separado o combinado", en: "Separately or combined" },
        cuerpo: {
          es: "El Jardín (~18.000 ft²) y el Tiki Hut (~4.000 ft²) se alquilan sueltos o juntos. Las cifras de ~600 y ~300 son del recinto completo; si contratas solo uno de los dos, el aforo baja en proporción a la superficie que uses. Son contiguos y comparten el paseo, así que combinados funcionan como un solo recinto.",
          en: "The Garden (~18,000 sq ft) and the Tiki Hut (~4,000 sq ft) rent separately or together. The ~600 and ~300 figures are for the whole site; if you take only one, capacity drops in proportion to the surface you use. They are contiguous and share the walk, so combined they work as a single site.",
        },
      },
      {
        titulo: { es: "Lo que falta medir", en: "What still needs measuring" },
        cuerpo: {
          es: "El aforo por montaje —el tuyo, con tu plano— se levanta en la visita técnica junto con la potencia, el load-in, el parking y el curfew, y se entrega por escrito. Las cifras de esta página son aproximaciones del propietario, no medición topográfica, y están marcadas con «~» en toda la ficha.",
          en: "Capacity per layout — yours, with your floor plan — is surveyed at the technical visit along with power, load-in, parking and curfew, and delivered in writing. The figures on this page are owner approximations, not a survey measurement, and are marked with “~” throughout the spec sheet.",
        },
      },
    ],
  },

  {
    clave: "popups",
    ojo: { es: "Uso · pop-up", en: "Use · pop-up" },
    h1: { es: "Pop-ups y mercados", en: "Pop-ups and markets" },
    respuesta: {
      es: "Un pop-up en Wynwood necesita tres cosas: superficie firme donde montar módulos, público que ya esté paseando por el barrio, y una cubierta para que el sábado no dependa del cielo. Aquí son ~22.000 ft² con paseo pavimentado de extremo a extremo y ~4.000 ft² techados, a una cuadra de los murales.",
      en: "A pop-up in Wynwood needs three things: firm ground to build modules on, an audience already walking the neighbourhood, and cover so Saturday does not depend on the sky. Here that is ~22,000 sq ft with a paved walk running end to end and ~4,000 sq ft under roof, one block from the murals.",
    },
    title: {
      es: "Espacio para pop-ups y mercados en Wynwood, Miami | Club Wynwood",
      en: "Pop-up and market space in Wynwood, Miami | Club Wynwood",
    },
    description: {
      es: "Recinto al aire libre para pop-ups y mercados en Wynwood: ~22.000 ft², paseo pavimentado para montar módulos y ~4.000 ft² techados. A una cuadra de Wynwood Walls.",
      en: "Open-air site for pop-ups and markets in Wynwood: ~22,000 sq ft, a paved walk for building modules and ~4,000 sq ft under roof. One block from Wynwood Walls.",
    },
    cifras: [
      { etiqueta: { es: "Superficie", en: "Area" }, valor: "~22 000 ft²" },
      { etiqueta: { es: "A Wynwood Walls", en: "To Wynwood Walls" }, valor: "4 min" },
      { etiqueta: { es: "De pie", en: "Standing" }, valor: "~600" },
    ],
    foto: {
      src: "/assets/venue-exterior.webp",
      alt: {
        es: "Paseo pavimentado entre palmeras, apto para montar módulos de un mercado",
        en: "Paved walk between palms, suitable for building market modules",
      },
      pie: {
        es: "El paseo pavimentado recorre el recinto de extremo a extremo.",
        en: "The paved walk runs the length of the site.",
      },
    },
    bloques: [
      {
        titulo: { es: "El paseo es el eje del montaje", en: "The walk is the spine of the build" },
        cuerpo: {
          /* Decía «césped a los dos lados» en los dos idiomas, que es la
             redacción anterior al 7-sep: a un lado hay césped y al otro arena,
             y para un mercado la diferencia importa —un módulo con patas no se
             planta igual sobre arena—. */
          es: "Un mercado se ordena a lo largo de un recorrido, y aquí ya existe: pavimento continuo de la puerta al estacionamiento, con césped a un lado y arena al otro para los módulos. No hay que resolver piso ni trazar circulación desde cero, y eso son horas de montaje que no pagas.",
          en: "A market organises itself along a route, and here one already exists: continuous paving from the door to the parking lot, with turf on one side and sand on the other for the modules. You do not have to solve flooring or draw circulation from scratch, and that is load-in hours you do not pay for.",
        },
      },
      {
        titulo: { es: "El público ya está en la calle", en: "The audience is already outside" },
        cuerpo: {
          es: "2129 NW 1st Ct está a cuatro minutos a pie de Wynwood Walls. La diferencia entre un pop-up en un polígono y uno aquí es que en Wynwood la gente ya salió a caminar el barrio: el tráfico peatonal del fin de semana no hay que comprarlo con pauta.",
          en: "2129 NW 1st Ct is a four-minute walk from Wynwood Walls. The difference between a pop-up in an industrial park and one here is that in Wynwood people are already out walking: weekend foot traffic is not something you have to buy with ads.",
        },
      },
      {
        titulo: { es: "El sábado no depende del cielo", en: "Saturday does not depend on the sky" },
        cuerpo: {
          es: "Un mercado se cae con la lluvia y no se reprograma: los expositores ya vinieron. Los ~4.000 ft² de palapa fija permiten concentrar los módulos bajo techo si cambia el tiempo, sin carpas de última hora ni devolver el día.",
          en: "A market dies in the rain and does not get rescheduled: the vendors already showed up. The ~4,000 sq ft of permanent structure let you concentrate modules under cover if the weather turns, with no last-minute tents and no refunding the day.",
        },
      },
      {
        titulo: { es: "Lo que hay que preguntar antes", en: "What to ask beforehand" },
        cuerpo: {
          es: "Para un mercado con muchos expositores importan tres datos que se levantan en la visita: la potencia disponible y cómo se reparte, el ancho de portón para la carga de todos, y el horario de descarga. Te los damos por escrito antes de firmar.",
          en: "For a market with many vendors, three figures matter and they are surveyed at the visit: available power and how it splits, gate width for everyone's load-in, and unloading hours. You get them in writing before signing.",
        },
      },
    ],
  },

  {
    clave: "graduaciones",
    ojo: { es: "Uso · graduación", en: "Use · graduation" },
    h1: { es: "Graduaciones", en: "Graduations" },
    respuesta: {
      es: "El recinto admite ~300 invitados sentados o ~600 de pie, que cubre desde una promoción entera hasta una fiesta de familia. La ceremonia o los discursos van en el jardín, la cena bajo la palapa techada, y los ~4.000 ft² cubiertos resuelven la lluvia de mayo y junio en Miami.",
      en: "The site takes ~300 seated or ~600 standing, which covers anything from a whole graduating class to a family party. The ceremony or speeches go in the garden, dinner under the covered structure, and the ~4,000 sq ft under roof handle the May and June rain in Miami.",
    },
    title: {
      es: "Venue para graduaciones en Wynwood, Miami — hasta 600 invitados | Club Wynwood",
      en: "Graduation venue in Wynwood, Miami — up to 600 guests | Club Wynwood",
    },
    description: {
      es: "Espacio al aire libre para fiestas de graduación en Wynwood, Miami: ~600 de pie o ~300 sentados, con palapa techada de ~4.000 ft² como plan de lluvia.",
      en: "Open-air space for graduation parties in Wynwood, Miami: ~600 standing or ~300 seated, with a ~4,000 sq ft covered structure as the rain plan.",
    },
    cifras: [
      { etiqueta: { es: "De pie", en: "Standing" }, valor: "~600" },
      { etiqueta: { es: "Sentados", en: "Seated" }, valor: "~300" },
      { etiqueta: { es: "Techado", en: "Covered" }, valor: "~4 000 ft²" },
    ],
    foto: {
      src: "/assets/aerea-predio.jpg",
      alt: {
        es: "Vista aérea del recinto completo, con la palapa techada y el jardín",
        en: "Aerial view of the whole site, with the covered structure and the garden",
      },
      pie: {
        es: "El recinto completo, con la palapa al centro.",
        en: "The whole site, with the structure at the centre.",
      },
    },
    bloques: [
      {
        titulo: { es: "Mayo y junio llueve", en: "May and June it rains" },
        cuerpo: {
          es: "La temporada de graduaciones en Miami coincide con el principio de la de lluvias. Una fiesta al aire libre en esas fechas necesita un plan B que no sea «cruzamos los dedos»: aquí son ~4.000 ft² de cubierta fija, sin carpa y sin cambiar de sede.",
          en: "Graduation season in Miami overlaps with the start of the rainy season. An outdoor party in those weeks needs a plan B that is not “fingers crossed”: here it is ~4,000 sq ft of permanent cover, with no tent and no change of venue.",
        },
      },
      {
        titulo: { es: "Discursos fuera, cena dentro", en: "Speeches outside, dinner inside" },
        cuerpo: {
          es: "Los dos espacios son contiguos y comparten el paseo, así que se puede hacer la parte de pie —discursos, fotos, brindis— en el jardín y pasar a la cena bajo techo sin que nadie salga del recinto. Eso ahorra el momento muerto que suele romper el ritmo.",
          en: "The two spaces are contiguous and share the walk, so you can do the standing part — speeches, photographs, toasts — in the garden and move to a seated dinner under cover without anyone leaving the site. That removes the dead moment that usually breaks the rhythm.",
        },
      },
      {
        titulo: { es: "Tu proveedor, tu presupuesto", en: "Your supplier, your budget" },
        cuerpo: {
          es: "No hay catering obligatorio ni proveedor impuesto. En una graduación, donde el presupuesto suele salir de varias familias, poder elegir quién sirve y a qué precio cambia la cuenta entera.",
          en: "There is no mandatory catering and no imposed supplier. At a graduation, where the budget often comes from several families, being able to choose who caters and at what price changes the whole arithmetic.",
        },
      },
    ],
  },

  {
    clave: "pequenos",
    ojo: { es: "Uso · evento pequeño", en: "Use · small event" },
    h1: { es: "Eventos pequeños", en: "Small events" },
    respuesta: {
      es: "Sí se puede alquilar solo una parte. El Tiki Hut son ~4.000 ft² techados que se contratan sueltos, sin el jardín, y esa es la medida que encaja con un baby shower, un bautizo o un cumpleaños de 50 a 150 invitados. Contratar los ~22.000 ft² completos para eso no tiene sentido y no lo recomendamos.",
      en: "Yes, you can rent just one part. The Tiki Hut is ~4,000 sq ft under roof that books on its own, without the garden, and that is the size that fits a baby shower, a christening or a birthday of 50 to 150 guests. Taking the full ~22,000 sq ft for that makes no sense and we do not recommend it.",
    },
    title: {
      es: "Eventos pequeños en Wynwood: alquilar solo el Tiki Hut | Club Wynwood",
      en: "Small events in Wynwood: renting just the Tiki Hut | Club Wynwood",
    },
    description: {
      es: "Para baby showers, bautizos y cumpleaños de 50 a 150 invitados se alquila solo el Tiki Hut: ~4.000 ft² techados en Wynwood, sin contratar el jardín entero.",
      en: "For baby showers, christenings and birthdays of 50 to 150 guests you can rent just the Tiki Hut: ~4,000 sq ft under roof in Wynwood, without taking the whole garden.",
    },
    cifras: [
      { etiqueta: { es: "Solo el Tiki Hut", en: "Tiki Hut only" }, valor: "~4 000 ft²" },
      { etiqueta: { es: "Invitados", en: "Guests" }, valor: "50–150" },
      { etiqueta: { es: "Techado", en: "Under roof" }, valor: "100%" },
    ],
    foto: {
      src: "/assets/venue-palapa.webp",
      alt: {
        es: "Bajo la palapa: techo de paja sobre postes de madera, abierta por los costados",
        en: "Under the structure: thatch roof on timber posts, open on the sides",
      },
      pie: {
        es: "El Tiki Hut se alquila suelto, sin el jardín.",
        en: "The Tiki Hut books on its own, without the garden.",
      },
    },
    bloques: [
      {
        titulo: { es: "Por qué no alquilarlo todo", en: "Why not take the whole thing" },
        cuerpo: {
          es: "Un evento de 80 personas en ~22.000 ft² se ve vacío, y además pagas superficie que no usas. Con solo el Tiki Hut el grupo queda reunido bajo techo, la conversación funciona y el presupuesto se va a comida y decoración en vez de a metros cuadrados.",
          en: "An 80-person event in ~22,000 sq ft looks empty, and you are paying for surface you do not use. With just the Tiki Hut the group stays together under cover, conversation works, and the budget goes to food and decor instead of square footage.",
        },
      },
      {
        titulo: { es: "Techado y abierto a la vez", en: "Covered and open at once" },
        cuerpo: {
          es: "La palapa tiene techo de paja pero no tiene paredes: está abierta por los cuatro costados. Para un evento de día eso significa sombra sin encierro y sin aire acondicionado, que es exactamente lo que se busca en un baby shower o un bautizo a mediodía.",
          en: "The structure has a thatched roof but no walls: it is open on all four sides. For a daytime event that means shade without being shut in and without air conditioning, which is exactly what a midday baby shower or christening wants.",
        },
      },
      {
        titulo: { es: "Las cabañas quedan a mano", en: "The cabanas are right there" },
        cuerpo: {
          /* Decía «conviene preguntar si se pueden incluir», y eso da a entender
             que son mobiliario opcional. No lo son: van con el inmueble y están
             fijas donde están, así que no se pueden mover ni sacar del plano.
             Un productor que planifique el montaje creyendo que puede retirarlas
             pierde el día del montaje descubriéndolo. */
          es: "Las seis cabañas amuebladas están en el jardín, junto a la palapa. Son fijas: van con el inmueble y no se mueven, así que cuentan en el plano de montaje aunque solo alquiles el Tiki Hut. Para un evento con niños o con gente mayor son la zona de descanso que suele faltar.",
          en: "The six furnished cabanas sit in the garden, next to the structure. They are fixed: they come with the property and do not move, so they count in your layout even if you only book the Tiki Hut. For an event with children or older guests they are the rest area that is usually missing.",
        },
      },
    ],
  },

  {
    clave: "artbasel",
    ojo: { es: "Temporada · diciembre", en: "Season · December" },
    h1: { es: "Art Basel y Miami Art Week", en: "Art Basel and Miami Art Week" },
    respuesta: {
      es: "Miami Art Week 2026 va del 30 de noviembre al 6 de diciembre, y este recinto tiene fechas abiertas. Está dentro del Arts District, a tres cuadras de Mana Wynwood —donde se montan Red Dot y Spectrum— y a cuatro minutos a pie de Wynwood Walls. Son ~22.000 ft² al aire libre con ~4.000 techados, aforo de ~600 de pie, estacionamiento propio y licencia de licor propia.",
      en: "Miami Art Week 2026 runs from November 30 to December 6, and this site has open dates. It sits inside the Arts District, three blocks from Mana Wynwood — home to Red Dot and Spectrum — and a four-minute walk from Wynwood Walls. It is ~22,000 sq ft outdoors with ~4,000 under roof, capacity for ~600 standing, its own parking and its own liquor license.",
    },
    title: {
      es: "Venue para Miami Art Week 2026 en Wynwood · fechas abiertas | Club Wynwood",
      en: "Miami Art Week 2026 venue in Wynwood · open dates | Club Wynwood",
    },
    description: {
      es: "Recinto al aire libre de ~22.000 ft² en el Wynwood Arts District con fechas abiertas para Miami Art Week 2026 (30 nov – 6 dic): a tres cuadras de Mana Wynwood, aforo ~600 de pie, ~4.000 ft² techados, estacionamiento y licencia de licor propios.",
      en: "A ~22,000 sq ft open-air site in the Wynwood Arts District with open dates for Miami Art Week 2026 (Nov 30 – Dec 6): three blocks from Mana Wynwood, ~600 standing, ~4,000 sq ft under roof, own parking and own liquor license.",
    },
    cifras: [
      { etiqueta: { es: "Miami Art Week 2026", en: "Miami Art Week 2026" }, valor: "30 nov – 6 dic" },
      { etiqueta: { es: "A Mana Wynwood", en: "To Mana Wynwood" }, valor: "3 cuadras" },
      { etiqueta: { es: "De pie", en: "Standing" }, valor: "~600" },
    ],
    foto: {
      // Art Basel se vive de noche: las activaciones abren cuando cierran las
      // ferias. La aérea de día no lo contaba, y además ya salía en otras cinco
      // páginas. Fotograma del vídeo de la fiesta — ver VIDEOS.md.
      src: "/assets/recinto-noche.jpg",
      alt: {
        es: "El recinto al anochecer durante un evento, visto desde arriba, con el paseo alfombrado y las palmeras iluminadas",
        en: "The site at dusk during an event, seen from above, with the carpeted walk and uplit palms",
      },
      pie: {
        es: "Una activación al anochecer en el recinto, en pleno Wynwood Arts District.",
        en: "A dusk activation on site, in the heart of the Wynwood Arts District.",
      },
    },
    bloques: [
      {
        titulo: { es: "El barrio no es decorado", en: "The neighbourhood is not a backdrop" },
        cuerpo: {
          es: "En diciembre medio Miami se disfraza de Wynwood. La diferencia de estar dentro del Arts District es que el público que te interesa ya viene caminando: en la semana del arte la gente recorre el barrio a pie entre galerías, murales y activaciones, y estar a cuatro minutos de Wynwood Walls te pone en ese recorrido.",
          en: "In December half of Miami dresses up as Wynwood. The difference of being inside the Arts District is that the audience you want is already walking: during art week people move through the neighbourhood on foot between galleries, murals and activations, and being four minutes from Wynwood Walls puts you on that route.",
        },
      },
      {
        titulo: { es: "Un recinto sin estética propia", en: "A site with no aesthetic of its own" },
        cuerpo: {
          es: "Una instalación de arte o una activación de marca en Art Week viene con su propio lenguaje visual. Un salón con moqueta, lámparas y paredes tratadas pelea con eso. Aquí hay superficie firme, límites claros y nada que discuta con lo que montes.",
          en: "An art installation or a brand activation during Art Week arrives with its own visual language. A ballroom with carpet, chandeliers and finished walls fights it. Here there is firm ground, clear boundaries and nothing arguing with what you build.",
        },
      },
      {
        titulo: { es: "Diciembre también llueve", en: "December rains too" },
        cuerpo: {
          es: "La semana del arte cae en temporada seca, pero un aguacero de tarde en Miami no avisa. Los ~4.000 ft² de palapa fija permiten mover la parte crítica bajo techo sin desmontar la instalación ni alquilar carpa a precio de diciembre.",
          en: "Art week falls in the dry season, but an afternoon downpour in Miami gives no warning. The ~4,000 sq ft of permanent structure let you move the critical part under cover without striking the installation or renting a tent at December prices.",
        },
      },
      {
        titulo: { es: "Las ferias que traen al público están al lado", en: "The fairs that bring the crowd are next door" },
        cuerpo: {
          es: "Red Dot y Spectrum se montan en Mana Wynwood, a tres cuadras, del 2 al 6 de diciembre; NADA ocupa Ice Palace, en el borde del barrio, del 1 al 5. Eso significa que el coleccionista y el galerista que salen de la feria ya están caminando por aquí. Las fiestas y activaciones que funcionaron en el barrio el año pasado fueron justo de este formato: lote abierto, DJ, barra y montaje propio.",
          en: "Red Dot and Spectrum set up at Mana Wynwood, three blocks away, from December 2 to 6; NADA takes Ice Palace, on the edge of the neighbourhood, from the 1st to the 5th. Which means the collector and the gallerist walking out of the fair are already on this street. The parties and activations that worked here last year were exactly this format: an open lot, a DJ, a bar and your own build.",
        },
      },
      {
        titulo: { es: "Del 30 de noviembre al 6 de diciembre, con fechas abiertas", en: "November 30 to December 6, with open dates" },
        cuerpo: {
          es: "Miami Art Week 2026 va del 30 de noviembre al 6 de diciembre, con Art Basel Miami Beach del 4 al 6. Es la semana más disputada del año en el barrio y todavía quedan fechas. Hay un plazo que sí manda: la City of Miami cierra las solicitudes de permiso de evento especial para esa semana el 11 de octubre, así que si tu activación necesita permiso, la conversación útil es ahora. Escríbenos con la fecha y el aforo y te decimos disponibilidad real.",
          en: "Miami Art Week 2026 runs from November 30 to December 6, with Art Basel Miami Beach on the 4th to the 6th. It is the most contested week of the year in this neighbourhood and there are still dates. One deadline does rule: the City of Miami closes special-event permit applications for that week on October 11, so if your activation needs a permit, the useful conversation is now. Write to us with the date and headcount and we come back with real availability.",
        },
      },
      {
        titulo: { es: "Barra propia, estacionamiento propio", en: "Your own bar, our own parking" },
        cuerpo: {
          es: "El recinto tiene licencia de licor propia, con su número de licencia, cosa que no todos los espacios de la zona pueden decir, y hay área donde montar barra. Y hay estacionamiento en el propio predio, al este y al sur, que en esa semana y en este barrio deja de ser un detalle. La carga entra por su propia puerta, aparte de la de los invitados.",
          en: "The site holds its own liquor license, with its own license number, which not every space in the area can say, and there is an area where a bar can be set up. And there is parking on site, to the east and south, which during that week and in this neighbourhood stops being a detail. Freight comes in through its own gate, separate from the guests'.",
        },
      },
    ],
  },

  {
    clave: "finDeAno",
    ojo: { es: "Uso · fin de año", en: "Use · year-end" },
    h1: { es: "Fiesta de fin de año de empresa", en: "Company holiday party" },
    respuesta: {
      es: "Una cena de empresa de 100 a 300 personas cabe sentada bajo la palapa techada, con el jardín para el cóctel de llegada y los discursos. Diciembre en Miami se hace al aire libre —es de los mejores meses— y los ~4.000 ft² cubiertos quitan el riesgo de la lluvia sin encerrar a nadie.",
      en: "A company dinner of 100 to 300 people fits seated under the covered structure, with the garden for the arrival cocktail and the speeches. December in Miami is made for outdoors — it is one of the best months — and the ~4,000 sq ft under roof remove the rain risk without shutting anyone in.",
    },
    title: {
      es: "Fiesta de fin de año de empresa en Wynwood, Miami | Club Wynwood",
      en: "Company holiday party venue in Wynwood, Miami | Club Wynwood",
    },
    description: {
      es: "Venue al aire libre para la fiesta de fin de año de tu empresa en Wynwood: cóctel en el jardín, cena sentada bajo la palapa techada, de 100 a 300 personas.",
      en: "Open-air venue for your company holiday party in Wynwood: cocktails in the garden, seated dinner under the covered structure, 100 to 300 people.",
    },
    cifras: [
      { etiqueta: { es: "Cena sentada", en: "Seated dinner" }, valor: "100–300" },
      { etiqueta: { es: "Cóctel de pie", en: "Standing cocktail" }, valor: "~600" },
      { etiqueta: { es: "Bajo techo", en: "Under roof" }, valor: "~4 000 ft²" },
    ],
    foto: {
      // La única foto nocturna que tenemos, y esta es LA página donde importa:
      // se vende una fiesta de fin de año y hasta ahora la ilustraba un interior
      // de día. Sale de un fotograma del vídeo de la fiesta — ver VIDEOS.md.
      src: "/assets/recinto-noche.jpg",
      alt: {
        es: "El recinto al anochecer visto desde arriba: alfombra roja sobre el paseo, palmeras iluminadas desde el tronco y el techo de paja al fondo",
        en: "The site at dusk seen from above: a red carpet along the walk, palms uplit from the trunk and the thatch roof beyond",
      },
      pie: {
        es: "Fin de año en el recinto: alfombra sobre el paseo, palmeras iluminadas y la palapa al lado. Foto de un evento real.",
        en: "New Year's Eve on site: carpet along the walk, uplit palms and the structure alongside. A real event.",
      },
    },
    bloques: [
      {
        titulo: { es: "Llegada fuera, cena dentro", en: "Arrival outside, dinner inside" },
        cuerpo: {
          es: "El montaje que mejor funciona para una empresa: cóctel de bienvenida y networking en el jardín, con la gente de pie y moviéndose, y después pasar a la mesa bajo la palapa. Los dos espacios comparten el paseo, así que el cambio no rompe el ritmo ni obliga a salir a la calle.",
          en: "The layout that works best for a company: welcome cocktail and networking in the garden, with people standing and moving, then through to the table under the structure. The two spaces share the walk, so the transition does not break the rhythm or send anyone out to the street.",
        },
      },
      {
        titulo: { es: "Diciembre en Miami se hace fuera", en: "December in Miami happens outdoors" },
        cuerpo: {
          es: "Es de los mejores meses del año aquí, y una fiesta de empresa al aire libre en diciembre se recuerda distinto que un salón de hotel. El riesgo es el aguacero de tarde, y eso lo resuelven los ~4.000 ft² de cubierta fija: no hay que decidir nada con dos semanas de antelación mirando el parte.",
          en: "It is one of the best months of the year here, and an outdoor company party in December is remembered differently from a hotel ballroom. The risk is the afternoon downpour, and the ~4,000 sq ft of permanent cover handle it: nothing has to be decided two weeks out while watching the forecast.",
        },
      },
      {
        titulo: { es: "Sin proveedor impuesto", en: "No imposed supplier" },
        cuerpo: {
          es: "Los hoteles suelen atar el catering y la barra a su cocina, y ahí es donde se va el presupuesto de una cena de empresa. Aquí se alquila el espacio: eliges proveedor, menú y barra, y el ahorro se nota justo en la partida más grande.",
          en: "Hotels usually tie catering and bar to their own kitchen, and that is where a company dinner's budget goes. Here you rent the space: you choose supplier, menu and bar, and the saving shows up in the largest line item.",
        },
      },
      {
        titulo: { es: "Las fechas de diciembre vuelan", en: "December dates go fast" },
        cuerpo: {
          es: "Las dos primeras semanas de diciembre son las más pedidas del año, y coinciden además con Art Week. Si la fecha es esa, conviene cerrarla con meses de margen: escríbenos con el número de asistentes y te decimos qué hay libre.",
          en: "The first two weeks of December are the most requested of the year, and they overlap with Art Week. If that is your date, close it months ahead: write to us with your headcount and we come back with what is free.",
        },
      },
    ],
  },

  {
    clave: "barrio",
    ojo: { es: "El barrio", en: "The neighbourhood" },
    h1: { es: "Por qué Wynwood", en: "Why Wynwood" },
    respuesta: {
      es: "Wynwood es el distrito de arte de Miami y, para un evento, tres cosas lo hacen distinto: el barrio se recorre a pie, está a tres minutos del acceso a la I-95 y a dieciséis del aeropuerto, y los murales dan un fondo que ningún salón puede montar. Esta página es para quien está eligiendo barrio antes que local.",
      en: "Wynwood is Miami's arts district and, for an event, three things make it different: the neighbourhood is walkable, it is three minutes from the I-95 access and sixteen from the airport, and the murals give a backdrop no ballroom can build. This page is for whoever is choosing a neighbourhood before choosing a venue.",
    },
    title: {
      es: "Por qué hacer tu evento en Wynwood, Miami | Club Wynwood",
      en: "Why host your event in Wynwood, Miami | Club Wynwood",
    },
    description: {
      es: "Qué tiene Wynwood para un evento: barrio peatonal, 3 minutos a la I-95, 16 al aeropuerto MIA, y los murales del Arts District como fondo real.",
      en: "What Wynwood offers an event: a walkable neighbourhood, 3 minutes to the I-95, 16 to MIA airport, and the Arts District murals as a real backdrop.",
    },
    cifras: [
      { etiqueta: { es: "A la I-95", en: "To the I-95" }, valor: "3 min" },
      { etiqueta: { es: "Al aeropuerto MIA", en: "To MIA airport" }, valor: "16 min" },
      { etiqueta: { es: "A Miami Beach", en: "To Miami Beach" }, valor: "18 min" },
    ],
    foto: {
      src: "/assets/venue-exterior.webp",
      alt: {
        es: "El recinto con los murales del barrio al fondo",
        en: "The site with the neighbourhood murals behind",
      },
      pie: {
        es: "Los murales del barrio, al fondo del recinto.",
        en: "The neighbourhood murals, behind the site.",
      },
    },
    bloques: [
      {
        titulo: { es: "Se recorre a pie", en: "It is walkable" },
        cuerpo: {
          es: "Wynwood es de los pocos sitios de Miami donde la gente camina. Para un evento eso cambia dos cosas: los invitados pueden llegar antes o quedarse después sin depender del coche, y una activación abierta al público recibe gente que ya estaba en la calle.",
          en: "Wynwood is one of the few places in Miami where people walk. For an event that changes two things: guests can arrive early or stay on without depending on a car, and an activation open to the public receives people who were already outside.",
        },
      },
      {
        titulo: { es: "Está bien conectado", en: "It is well connected" },
        cuerpo: {
          es: "Tres minutos al acceso de la I-95, seis a Midtown y el Design District, nueve a Downtown y Brickell, dieciséis al aeropuerto MIA y dieciocho a Miami Beach. Para un evento con invitados de fuera, esos dieciséis minutos al aeropuerto valen más que cualquier argumento de marca.",
          en: "Three minutes to the I-95 access, six to Midtown and the Design District, nine to Downtown and Brickell, sixteen to MIA airport and eighteen to Miami Beach. For an event with out-of-town guests, those sixteen minutes to the airport are worth more than any brand argument.",
        },
      },
      {
        titulo: { es: "El fondo ya existe", en: "The backdrop already exists" },
        cuerpo: {
          es: "Los murales del Arts District son el escenario que ningún salón puede construir, y no cuestan producción. Para una boda, una quinceañera o un rodaje, eso son fotos con lugar reconocible en vez de fotos con pared.",
          en: "The Arts District murals are the set no ballroom can build, and they cost no production. For a wedding, a quinceañera or a shoot, that means photographs with a recognisable place instead of photographs with a wall.",
        },
      },
      {
        titulo: { es: "Lo que hay que tener en cuenta", en: "What to bear in mind" },
        cuerpo: {
          es: "Wynwood es un barrio con vivienda y con vida nocturna, así que el ruido y el horario están regulados y el aparcamiento en calle es limitado los fines de semana. Son las dos preguntas que conviene hacerle a cualquier venue de la zona, y las repasamos contigo en la visita.",
          en: "Wynwood is a neighbourhood with housing and with nightlife, so noise and hours are regulated and street parking is limited at weekends. Those are the two questions worth asking any venue in the area, and we go through them with you at the visit.",
        },
      },
    ],
  },

  /**
   * Página nueva del 10-sep-2026: demanda medida con el planificador y sin
   * página propia hasta hoy. Escrita y revisada por tres vías (veracidad contra
   * venue.ts, solape con las existentes, inglés nativo). Ver .qa/paginas-corregidas.json.
   */
  {
    clave: "offsite",
    ojo: { es: "Uso · offsite de empresa", en: "Use · corporate offsite" },
    h1: { es: "Offsite de empresa", en: "Corporate offsites and retreats" },
    respuesta: {
      es: "Club Wynwood funciona como sede de offsite y retiro de empresa al aire libre en Wynwood, Miami: ~18.000 ft² con pavimento, césped artificial y arena a pocos metros, seis cabañas amuebladas y ~4.000 ft² bajo el Tiki Hut para el almuerzo. No es una sala de reuniones: sin salas, sin AV, sin proyector.",
      en: "Club Wynwood is an outdoor offsite and corporate retreat venue in Wynwood, Miami: ~18,000 sq ft with paving, artificial turf and sand a few steps apart, six furnished cabanas and ~4,000 sq ft under the Tiki Hut for lunch. It isn't a meeting venue: no breakout rooms, no AV, no projector.",
    },
    title: {
      es: "Offsite de empresa al aire libre en Wynwood | Club Wynwood",
      en: "Corporate offsite venue in Wynwood, Miami | Club Wynwood",
    },
    description: {
      es: "Offsite de empresa al aire libre en Wynwood, Miami: ~18.000 ft², tres superficies, seis cabañas fijas y ~4.000 ft² techados. Sin salas ni AV: traes tu montaje.",
      en: "Outdoor corporate offsite and retreat venue in Wynwood, Miami: ~18,000 sq ft, 3 surfaces, 6 cabanas, ~4,000 sq ft under the Tiki Hut. No meeting rooms, no AV.",
    },
    cifras: [
      { etiqueta: { es: "Jardín abierto", en: "Open garden" }, valor: { es: "~18.000 ft²", en: "~18,000 sq ft" } },
      { etiqueta: { es: "Bajo el Tiki Hut", en: "Under the Tiki Hut" }, valor: { es: "~4.000 ft²", en: "~4,000 sq ft" } },
      { etiqueta: { es: "Cabañas amuebladas", en: "Furnished cabanas" }, valor: { es: "6", en: "6" } },
      { etiqueta: { es: "De pie (recinto completo)", en: "Standing (full buyout)" }, valor: { es: "~600", en: "~600" } },
    ],
    foto: {
      src: "/assets/flyer-cenital.jpg",
      alt: { es: "Cenital del recinto: la palapa, el área de arena, las cabañas y el paseo pavimentado en un mismo encuadre", en: "Overhead view of the venue: the Tiki Hut, the sand area, the cabanas and the paved walkway in one frame" },
      pie: { es: "Las tres superficies del Jardín —pavimento, césped y arena— a pocos metros unas de otras.", en: "The three surfaces on the grounds — paving, turf and sand — a few steps from one another." },
    },
    bloques: [
      {
        titulo: { es: "Empieza por lo que no hay", en: "Start with what isn't here" },
        cuerpo: {
          es: "Al aire libre no hay salas de reunión, ni equipo audiovisual, ni proyector, ni climatización; la conectividad se confirma en la visita. Se alquila el recinto vacío: las actividades las trae tu equipo, igual que el catering. Un facilitador, una empresa de dinámicas de grupo o un proveedor de actividades monta aquí con lo suyo, y lo que nadie traiga no está. El exterior —el Jardín y el Tiki Hut— se puede reservar desde el 1 de octubre de 2026. El edificio de 15.961 ft² se alquila aparte desde el 1 de noviembre, y su cocina se suma cuando el catering la necesita. Quien necesita una sala con proyector y aire acondicionado necesita un salón de hotel, no un recinto al aire libre.",
          en: "Outdoors there are no meeting rooms, no AV, no projector and no climate control; connectivity gets confirmed on the site visit. You rent the venue empty: your team brings the activities the same way it brings catering. A facilitator, a group-activities company or an activity vendor sets up here with their own gear, and whatever nobody brings isn't there. The outdoor venue — the Garden and the Tiki Hut — can be booked from October 1, 2026. The 15,961 sq ft building rents separately from November 1, and its kitchen is added when catering needs it. Anyone who needs a room with a projector and air conditioning needs a hotel ballroom, not an open-air venue.",
        },
      },
      {
        titulo: { es: "Tres suelos y seis rincones", en: "Three surfaces, six corners" },
        cuerpo: {
          es: "Las tres superficies del Jardín —pavimento, césped artificial y arena— están a pocos metros unas de otras, y eso es lo que un facilitador de team building aprovecha sin mover un solo mueble: la dinámica física sobre la arena, las mesas de trabajo sobre el pavimento firme del paseo, la puesta en común sobre el césped. Cada grupo cambia de zona caminando y el día no se detiene a reorganizar nada. Las seis cabañas amuebladas —pérgolas con cortinas y sofás— son seis rincones de reunión ya montados: sitios para conversar, no escritorios. Cabañas, mesas de picnic y setos perimetrales están fijos, así que el plano del día parte de ellos y no al revés.",
          en: "The three surfaces on the Garden's grounds — paving, artificial turf and sand — sit a few steps from one another, and that is what a team-building facilitator uses without moving a single piece of furniture: the physical exercise on sand, the breakout tables on the firm paving of the walkway, the debrief on turf. Each group changes zone on foot and the day never stops to reset anything. The six furnished cabanas — pergolas with curtains and sofas — are six ready-made seating corners: places to talk, not desks. Cabanas, picnic tables and perimeter hedges are all fixed in place, so the day's floor plan starts from them, not the other way round.",
        },
      },
      {
        titulo: { es: "A la sombra, no al sol", en: "In the shade, not the sun" },
        cuerpo: {
          es: "Un día de octubre en Miami se aguanta a la sombra, no al sol, así que la agenda se arma alrededor del Tiki Hut: ~4.000 ft² techados de paja que son el comedor de mediodía, con sombra y sin aire acondicionado, y el único techo del exterior cuando llueve. Para el agua que cae recta basta solo; con viento entra de lado, y un offsite de enero conviene que presupueste cierres laterales. El recinto completo admite ~600 de pie o ~300 sentados; un equipo de 40 u 80 personas usa una fracción, y para ese tamaño suele bastar el Tiki Hut suelto, como en los eventos pequeños. Las sesiones al sol van temprano; el trabajo largo, bajo la paja.",
          en: "An October day in Miami is bearable in the shade, not in the sun, so the agenda gets built around the Tiki Hut: ~4,000 sq ft of thatched cover that works as the midday dining room — shaded, no air conditioning — and the only roof outdoors when it rains. It handles rain that falls straight down on its own; open on the sides, it lets wind-driven rain in, so a January offsite should budget for sidewalls. A full buyout holds ~600 standing or ~300 seated; a team of 40 or 80 uses a fraction of that, and for a group that size the Tiki Hut on its own is usually the right booking, as with small events. Sun sessions go early; long work goes under the thatch.",
        },
      },
      {
        titulo: { es: "El montaje que nadie ve", en: "The load-in nobody sees" },
        cuerpo: {
          es: "Hay dos entradas y no se cruzan: la carga entra por NW 1st Ct y los invitados por NW 21st Ct. Para un offsite eso pesa más de lo que parece. El proveedor de la actividad descarga, arma y prueba por su puerta mientras el equipo llega por la otra, y la primera impresión del día no es un camión abierto ni cajas a medio sacar. Hay estacionamiento propio en el predio, así que quien viene en coche no busca sitio en la calle. Lo que todavía no publicamos —potencia y amperaje, ancho del portón de carga, número de baños, plazas de estacionamiento y curfew— lo recorremos contigo en la visita y te lo confirmamos por escrito.",
          en: "There are two entrances and they never cross: freight comes in on NW 1st Ct, guests on NW 21st Ct. For an offsite, that matters more than it sounds. The activity vendor unloads, rigs and tests through one gate while the team walks in through the other, and the day's first impression isn't an open truck or half-unpacked crates. There's on-site parking as well, so nobody arriving by car hunts for a spot on the street. What we don't publish yet — electrical service and amperage, the freight gate width, restroom counts, parking spaces and curfew — we walk with you on the site visit and confirm in writing.",
        },
      },
    ],
  },
  /**
   * Página nueva del 10-sep-2026: demanda medida con el planificador y sin
   * página propia hasta hoy. Escrita y revisada por tres vías (veracidad contra
   * venue.ts, solape con las existentes, inglés nativo). Ver .qa/paginas-corregidas.json.
   */
  {
    clave: "cumpleanosAdultos",
    ojo: { es: "Uso · cumpleaños de adulto", en: "Use · adult birthday" },
    h1: { es: "Cumpleaños de adulto en Wynwood", en: "Adult birthday parties in Wynwood" },
    respuesta: {
      es: "Para un cumpleaños de 30, 40 o 50 con más de 150 invitados, Club Wynwood se alquila entero: ~22.000 ft² al aire libre en Wynwood, Miami, con ~4.000 ft² bajo la palapa, estacionamiento propio y licencia de licor propia. Por debajo de 150 invitados se alquila solo el Tiki Hut. Se alquila el recinto vacío, no una mesa.",
      en: "For a 30th, 40th or 50th birthday with more than 150 guests, Club Wynwood rents as a whole: ~22,000 sq ft of open-air space in Wynwood, Miami, with ~4,000 sq ft under the tiki hut, its own parking and its own liquor license. Under 150 guests, you rent just the Tiki Hut. You're renting the empty site, not a table.",
    },
    title: {
      es: "Fiesta de cumpleaños para adultos en Wynwood | Club Wynwood",
      en: "Adult birthday party venue in Wynwood, Miami | Club Wynwood",
    },
    description: {
      es: "Cumpleaños de adultos en Wynwood, Miami: desde 150 invitados se alquila el recinto entero, ~22.000 ft² al aire libre, licencia de licor propia y parking propio.",
      en: "Adult birthday party venue in Wynwood, Miami: from 150 guests you rent the whole site, ~22,000 sq ft outdoors with its own liquor license and its own parking.",
    },
    cifras: [
      { etiqueta: { es: "Recinto completo", en: "Whole site" }, valor: { es: "~22.000 ft²", en: "~22,000 sq ft" } },
      { etiqueta: { es: "De pie", en: "Standing" }, valor: { es: "~600", en: "~600" } },
      { etiqueta: { es: "Sentados", en: "Seated" }, valor: { es: "~300", en: "~300" } },
      { etiqueta: { es: "Bajo techo · plan de lluvia", en: "Under roof · rain plan" }, valor: { es: "~4.000 ft²", en: "~4,000 sq ft" } },
    ],
    foto: {
      src: "/assets/recinto-noche.jpg",
      alt: { es: "El recinto al anochecer durante una fiesta, visto desde arriba: invitados repartidos por el jardín, el paseo con alfombra roja entre las palmeras iluminadas desde el tronco y el techo de paja de la palapa", en: "The site at dusk during a party, seen from above: guests spread across the garden, the walkway with a red carpet between palms uplit at the base, and the tiki hut's thatched roof" },
      pie: { es: "Una fiesta al anochecer en el recinto. Es el fotograma de un evento real, no una recreación: la alfombra roja y el arco de globos los trajo esa producción, no vienen con el recinto.", en: "An evening party on site. A frame from a real event, not a staged shot: the red carpet and the balloon arch were that production's own — they don't come with the site." },
    },
    bloques: [
      {
        titulo: { es: "Un club te vende una mesa; esto es el recinto entero", en: "A club sells you a table; this is the whole site" },
        cuerpo: {
          es: "Cuando cumples 30, 40 o 50, la opción por defecto es reservar mesa en un club: pagas un mínimo de consumo, te dan una sección acordonada y la fiesta sigue siendo del local. Aquí el trato es el contrario: alquilas el recinto vacío —~22.000 ft² al aire libre, con ~4.000 ft² bajo la palapa— y traes tu música, tu decoración y tu comida. El presupuesto se cotiza por espacio, horas y día, no por lo que se consuma. El corte es el tamaño: a partir de 150 invitados tiene sentido el recinto entero; por debajo, se alquila solo el Tiki Hut, que es lo que explica la página de eventos pequeños.",
          en: "Turn 30, 40 or 50 and the default is a table at a club: you commit to a minimum spend, you get a roped-off section, and the night still belongs to the venue. This is the opposite deal: you rent the empty site — ~22,000 sq ft outdoors, ~4,000 of them under the tiki hut — and you bring the music, the decor and the food. The quote is based on space, hours and day, not on what gets consumed. The dividing line is headcount: from 150 guests up, the whole site makes sense; below that, you rent just the Tiki Hut, which is what the small-events page covers.",
        },
      },
      {
        titulo: { es: "150, 300 o 600: cómo se reparte la noche", en: "150, 300 or 600: how the night splits up" },
        cuerpo: {
          es: "El recinto completo admite ~600 personas de pie o ~300 sentadas; con solo una parte, proporcionalmente menos. Para un cumpleaños de noche el reparto que funciona es cena y pista bajo la palapa y el resto en el jardín: llegada y fotos por el paseo pavimentado entre las dos hileras de palmeras, mesas de picnic fijas y seis cabañas amuebladas del lado de la arena, que sirven de zona de descanso. Los ~4.000 ft² techados son además el plan de lluvia: si cae un aguacero, la pista y la cena ya están bajo cubierta. La palapa está abierta por los cuatro costados; con viento entra agua de lado, así que en invierno conviene presupuestar cierres laterales. El aforo con tu montaje concreto se confirma en la visita.",
          en: "The whole site takes ~600 standing or ~300 seated; one part alone, proportionally fewer. For a birthday at night the split that works is dinner and dance floor under the tiki hut and everything else in the garden: arrival and photos along the paved walkway between the two rows of palms, fixed picnic tables and six furnished cabanas on the sand side, which work as a rest area. The ~4,000 sq ft under roof are also the rain plan: if a downpour hits, the dance floor and the dinner are already covered. The tiki hut is open on all four sides; in wind the rain comes in sideways, so a winter date should budget for side enclosures. Capacity for your specific layout is confirmed at the visit.",
        },
      },
      {
        titulo: { es: "Licencia de licor propia y un área donde montar la barra", en: "Its own liquor license, and an area to set up the bar" },
        cuerpo: {
          es: "El recinto tiene licencia de licor propia, con su propio número, cosa que no todos los espacios de la zona pueden decir. Hay área donde montar barra; dónde queda dentro de tu montaje se define en la visita. Quién la opera, qué se sirve y en qué condiciones se cierra por escrito con la ficha técnica, que es donde van el número de licencia y sus condiciones: nada se improvisa la noche del evento. No hay proveedor impuesto ni comisión por traer el tuyo, y el alquiler se cotiza por espacio, horas y día, no por consumo. Si el plan es barra libre o coctelería, dilo en el primer correo: condiciona dónde va la barra, el hielo y la carga.",
          en: "The site holds its own liquor license, with its own license number — not something every space in Wynwood can say. There's an area to set up a bar; where it lands in your layout is defined at the site visit. Who runs it, what gets poured and on what terms is put in writing with the spec sheet, which is where the license number and its conditions go: nothing gets improvised on the night. There's no imposed supplier and no fee for bringing your own, and the rental is quoted on space, hours and day, not on consumption. If the plan is an open bar or a cocktail program, say so in the first email: it decides where the bar, the ice and the load-in go.",
        },
      },
      {
        titulo: { es: "Dos puertas, y hasta qué hora", en: "Two gates — and how late you can go" },
        cuerpo: {
          es: "Los invitados entran por NW 21st Ct y la carga —proveedores, hielo, sonido— por NW 1st Ct, con su propia puerta: la reposición de hielo y la descarga del DJ no cruzan la fiesta. Los setos perimetrales cierran el jardín por la calle y hay estacionamiento en el propio predio, al este y al sur. El recinto se alquila por franja, con fecha y hora; qué queda cerrado, desde qué hora y con qué control de acceso se fija por escrito en la visita técnica. Ahí mismo se cierran el horario tope y el límite de decibelios, porque Wynwood tiene vecinos: no publicamos una cifra porque depende del evento. Si el plan es DJ hasta tarde, dilo en el primer correo.",
          en: "Guests come in through NW 21st Ct and load-in — vendors, ice, sound gear — through a separate service gate on NW 1st Ct: ice restocking and the DJ's unload never cut across the party. Perimeter hedges close the garden off from the street, and there's parking on the property, to the east and south. The site is rented by the slot, with a date and a time; what is closed off, from when, and how access is controlled is set in writing at the site visit. The curfew and the decibel limit are set there too, because Wynwood has residential neighbors: we don't publish a number because it depends on the event. If the plan is a DJ running late, say so in the first email.",
        },
      },
    ],
  },
  /**
   * Página nueva del 10-sep-2026: demanda medida con el planificador y sin
   * página propia hasta hoy. Escrita y revisada por tres vías (veracidad contra
   * venue.ts, solape con las existentes, inglés nativo). Ver .qa/paginas-corregidas.json.
   */
  {
    clave: "bodasIntimas",
    ojo: { es: "Uso · boda pequeña", en: "Use · small wedding" },
    h1: { es: "Bodas pequeñas", en: "Small weddings" },
    respuesta: {
      es: "Una boda de 30 a 80 invitados en Wynwood, Miami, se resuelve contratando solo el Tiki Hut: ~4.000 ft² cubiertos que se alquilan sueltos, sin el jardín, con ceremonia, cena y baile bajo la misma paja. El montaje se define con tu plano en la visita. No hay paquete cerrado; hay licencia de licor propia y área donde montar barra.",
      en: "A wedding of 30 to 80 guests in Wynwood, Miami, needs only the Tiki Hut: ~4,000 sq ft under cover, rented on its own without the Garden, with ceremony, dinner and dancing under one thatched roof. The seated layout is set from your floor plan at the site visit. No set packages; the venue holds its own liquor license.",
    },
    title: {
      es: "Bodas pequeñas de 30 a 80 en Wynwood | Club Wynwood",
      en: "Small wedding venue in Wynwood, Miami | Club Wynwood",
    },
    description: {
      es: "Bodas pequeñas de 30 a 80 invitados en Wynwood, Miami: el Tiki Hut, ~4.000 ft² techados, se alquila solo; el jardín con palmeras y seis cabañas se suma aparte.",
      en: "Small and intimate wedding venue in Wynwood, Miami, for 30 to 80 guests: the covered Tiki Hut, ~4,000 sq ft, books on its own; the Garden is added separately.",
    },
    cifras: [
      { etiqueta: { es: "Solo el Tiki Hut", en: "Tiki Hut only" }, valor: { es: "~4.000 ft²", en: "~4,000 sq ft" } },
      { etiqueta: { es: "Planta de la palapa", en: "Tiki Hut footprint" }, valor: { es: "~54 × 60 ft", en: "~54 × 60 ft" } },
      { etiqueta: { es: "El paseo", en: "The walk" }, valor: { es: "~15 × 108 ft", en: "~15 × 108 ft" } },
      { etiqueta: { es: "Al aeropuerto MIA, en coche", en: "To MIA airport, by car" }, valor: { es: "16 min", en: "16 min" } },
    ],
    foto: {
      src: "/assets/flyer-palapa-lounge.jpg",
      alt: { es: "Bajo la palapa: un montaje lounge con barra y guirnaldas", en: "Under the Tiki Hut: a lounge setup with a bar and string lights" },
      pie: { es: "Bajo la palapa, montada en lounge: ~4.000 ft² bajo un mismo techo.", en: "Under the Tiki Hut, set up as a lounge: ~4,000 sq ft under one roof." },
    },
    bloques: [
      {
        titulo: { es: "Ceremonia, cena y baile bajo un mismo techo", en: "Ceremony, dinner and dancing under one roof" },
        cuerpo: {
          es: "Para 30 a 80 invitados ese es el formato: ceremonia, cena y baile bajo la misma cubierta, sin sala aparte y sin traslado de invitados entre espacios. Cuántas mesas entran y de qué tamaño se resuelve con tu plano en la visita: no publicamos un aforo bajo la palapa que no esté medido. Lo que no hay son paredes: la palapa está abierta por los cuatro costados, así que no tiene aire acondicionado y con viento la lluvia entra de lado; una fecha de invierno conviene que presupueste cierres laterales como parte del plan de lluvia. Las dimensiones y la estructura están en la página del Tiki Hut. Por encima de 80 invitados el montaje pide el recinto completo: esa es la página de bodas.",
          en: "At 30 to 80 guests that's the format: ceremony, dinner and dancing under one cover, with no second room and no moving guests between spaces. How many tables fit, and what size, is worked out from your floor plan at the site visit: we don't publish a seated capacity under the Tiki Hut that hasn't been measured. What it doesn't have is walls: it's open on all four sides, so there's no air conditioning, and wind-driven rain blows in sideways; if you're booking a winter date, budget for sidewalls as part of the rain plan. Dimensions and structure are on the Tiki Hut page. Above 80 guests the layout calls for the whole site: that's the weddings page.",
        },
      },
      {
        titulo: { es: "El pasillo mide 15 × 108 ft, y es del Jardín", en: "The aisle is 15 × 108 ft, and it belongs to the Garden" },
        cuerpo: {
          es: "El paseo pavimentado del recinto mide unos 15 ft de ancho por 108 de largo entre dos hileras de palmeras reales: baja de la puerta del edificio hasta el estacionamiento del sur y pasa por delante de la palapa, que queda a su lado oeste. La medida sale del plano del predio y es aproximada. Es la decisión que separa las dos formas de contratar esta boda. Con solo el Tiki Hut, la ceremonia se celebra dentro de la palapa. Si quieres la entrada sobre el paseo, entre las palmeras, el paseo pertenece al Jardín y hay que sumar el Jardín al contrato: el recinto pasa a ser el completo, y lo describe la página del Jardín.",
          en: "The site's paved walk runs about 15 ft wide by 108 ft long between two rows of live palms: it comes down from the building door to the south parking and runs past the Tiki Hut, which sits along its west side. The measurement comes from the property's site plan and is approximate. It's the decision that separates the two ways of booking this wedding. With the Tiki Hut alone, the ceremony takes place inside the pavilion. If you want the processional on the walk, between the palms, the walk belongs to the Garden and the Garden has to be added to the contract: you're then booking the whole site, and the Garden page describes it.",
        },
      },
      {
        titulo: { es: "Sin paquete cerrado", en: "No set package" },
        cuerpo: {
          es: "No hay paquete cerrado. Contratas el espacio y traes a tus proveedores: catering, sonido, iluminación, mobiliario y montaje. El recinto tiene licencia de licor propia, con su propio número, y hay área donde montar barra; el número de licencia y sus condiciones se entregan con la ficha técnica. Es lo contrario del paquete de boda pequeña de un hotel, y corta en los dos sentidos: aquí no viene nada resuelto. Si nadie contrata catering, no hay comida, y al aire libre no hay cocina: la del edificio, disponible desde el 1 de noviembre de 2026, se suma al alquiler cuando el catering la necesita. Para 30 a 80 invitados eso da control total sobre el menú y la estética, y toda la responsabilidad.",
          en: "There's no set package. You book the space and bring your own vendors: caterer, sound, lighting, furniture rentals, load-in. The venue holds its own liquor license, under its own number, and there is an area to set up a bar; the license number and its conditions come with the spec sheet. It's the opposite of a hotel's small-wedding package, and it cuts both ways: nothing comes handled for you. If nobody books a caterer there's no food, and there's no kitchen outdoors: the building's kitchen, available from November 1, 2026, is added to the rental when the caterer needs it. For 30 to 80 guests that buys full control of the menu and the look, and full responsibility with it.",
        },
      },
      {
        titulo: { es: "Invitados por una puerta, proveedores por otra", en: "Guests through one gate, vendors through another" },
        cuerpo: {
          es: "Los invitados entran por NW 21st Ct y la carga por NW 1st Ct: el catering y el sonido no se cruzan con la fila de llegada. Hay estacionamiento en el propio predio; el número de plazas se confirma en la visita. La dirección es 2129 NW 1st Ct, a cuatro minutos a pie de Wynwood Walls y a 16 minutos en coche del aeropuerto MIA, lo que importa cuando media lista de invitados llega de fuera. Las seis cabañas amuebladas están en el jardín, al otro lado del paseo, del lado de la arena: son fijas y cuentan en el plano aunque solo contrates el Tiki Hut, pero usarlas como zona de descanso significa sumar el Jardín. Fechas de exterior: desde el 1 de octubre de 2026.",
          en: "Guests come in on NW 21st Ct and freight on NW 1st Ct: the caterer and the sound crew don't cross the arrival line. There's parking on the property; the number of spaces is confirmed at the site visit. The address is 2129 NW 1st Ct, a four-minute walk from Wynwood Walls and a 16-minute drive from Miami International (MIA), which matters when half the guest list flies in. The six furnished cabanas sit in the Garden across the walk, on the sand side: they're fixed and count in your layout even if you only book the Tiki Hut, but using them as a lounge area means adding the Garden. The outdoor space is available for events from October 1, 2026.",
        },
      },
    ],
  },
  /**
   * Página nueva del 10-sep-2026: demanda medida con el planificador y sin
   * página propia hasta hoy. Escrita y revisada por tres vías (veracidad contra
   * venue.ts, solape con las existentes, inglés nativo). Ver .qa/paginas-corregidas.json.
   */
  {
    clave: "showers",
    ojo: { es: "Uso · shower a mediodía", en: "Use · midday bridal & baby showers" },
    h1: { es: "Bridal showers y baby showers", en: "Bridal and baby showers" },
    respuesta: {
      es: "Club Wynwood alquila el Tiki Hut suelto para bridal showers y baby showers de mediodía en Wynwood, Miami: ~4.000 ft² de techo de paja continuo, abierto por los cuatro costados, para grupos de 50 a 150 invitados a la sombra y sin aire acondicionado. La decoración y el catering los traes tú.",
      en: "Club Wynwood rents the Tiki Hut on its own for midday bridal showers and baby showers in Wynwood, Miami: ~4,000 sq ft of continuous thatched roof, open on all four sides, for groups of 50 to 150 guests in the shade with no walls around you and no air conditioning. You bring the decor and the caterer.",
    },
    title: {
      es: "Bridal shower y baby shower en Wynwood, Miami | Club Wynwood",
      en: "Bridal & baby shower venue in Wynwood, Miami | Club Wynwood",
    },
    description: {
      es: "Bridal shower o baby shower a mediodía en Wynwood, Miami: el Tiki Hut suelto, ~4.000 ft² de paja abiertos por los cuatro costados, y el catering lo traes tú.",
      en: "Open-air bridal and baby shower venue in Wynwood, Miami: the Tiki Hut on its own, ~4,000 sq ft of thatched shade open on four sides, and you bring the caterer.",
    },
    cifras: [
      { etiqueta: { es: "Sombra bajo techo", en: "Shaded area" }, valor: { es: "~4.000 ft²", en: "~4,000 sq ft" } },
      { etiqueta: { es: "Cabañas, en el jardín", en: "Cabanas, in the garden" }, valor: { es: "6", en: "6" } },
      { etiqueta: { es: "Jardín, si entra en la reserva", en: "Garden, if booked" }, valor: { es: "~18.000 ft²", en: "~18,000 sq ft" } },
      { etiqueta: { es: "Exterior, se reserva desde", en: "Outdoors, bookable from" }, valor: { es: "1 oct 2026", en: "Oct 1, 2026" } },
    ],
    foto: {
      src: "/assets/flyer-palapa-lounge.jpg",
      alt: { es: "Bajo la palapa: un montaje lounge con barra y guirnaldas entre los postes de madera", en: "Under the thatch: a lounge setup with a bar and string lights among the wood posts" },
      pie: { es: "Bajo el Tiki Hut, montado en lounge. La sombra ya está; el resto lo pone quien organiza.", en: "Under the Tiki Hut, set up as a lounge. The shade is already there; whoever hosts brings the rest." },
    },
    bloques: [
      {
        titulo: { es: "El problema de un bridal shower es la hora", en: "The problem with a bridal shower brunch is the time of day" },
        cuerpo: {
          es: "Un shower casi nunca es de noche: es un brunch o un almuerzo, entre las once y las tres. Es el peor sol del día en Miami, y por eso la alternativa habitual es un restaurante, que resuelve el sol encerrando a treinta personas en una sala con aire acondicionado. Aquí la palapa hace lo mismo sin cerrar nada: techo de paja a cuatro aguas, ~4.000 ft² de sombra continua, abierta por los cuatro costados. Corre el aire, se oye la conversación y las fotos salen con luz de día, no con luz de techo. La palapa para el sol y la lluvia vertical, pero no tiene cierres laterales: con viento el agua entra de lado, y un shower fuera de la temporada seca conviene que presupueste carpas laterales.",
          en: "A shower is almost never a night event: it is brunch or lunch, somewhere between eleven and three. That is the worst stretch of sun in the Miami day, which is why the usual answer is a restaurant, and a restaurant handles the sun by shutting thirty people into a room with the air conditioning running. The Tiki Hut does the same job without closing anything: a hipped thatch roof, some 4,000 sq ft of continuous shade, open on all four sides. Air moves, conversation carries, and the photos come out in daylight, not under ceiling lights. The thatch stops sun and vertical rain, but it has no side enclosures: in wind the rain comes in sideways, and a shower outside the dry season should budget for side panels.",
        },
      },
      {
        titulo: { es: "Qué hay debajo del techo: nueve postes y césped", en: "What's under the roof: nine posts and turf" },
        cuerpo: {
          es: "El montaje gira alrededor de tres cosas que ya existen. Los postes: el techo de paja descansa sobre una retícula de nueve postes de madera, a unos 24 ft entre ejes, y la mesa larga, la de postres y el fondo de fotos van entre ellos, no contra una pared. El piso: bajo la palapa es césped artificial; la arena del jardín queda del lado de las cabañas, no aquí. Y el paseo pavimentado entre las dos hileras de palmeras, fondo de fotos sin montar nada, a cuatro minutos a pie de Wynwood Walls. Colgar de la estructura —arcos, guirnaldas, telas— se estudia en la visita técnica: cada carga se revisa punto por punto antes de autorizarla, y no hay límite de carga publicado porque no está levantado.",
          en: "The layout works around three things that already exist. The posts: the thatch roof rests on a grid of nine wood posts, about 24 ft apart, and the long table, the dessert table and the photo backdrop go between them, not against a wall. The floor: under the Tiki Hut it is artificial turf; the garden's sand is over on the cabanas' side, not here. And the paved walk between the two rows of palms, a photo backdrop before you build a thing, a four-minute walk from Wynwood Walls. Hanging anything from the structure—arches, garlands, fabric—is assessed at the site visit: every hanging load is reviewed point by point before it is signed off, and no load limit is published because it has not been surveyed yet.",
        },
      },
      {
        titulo: { es: "Brunch sin cocina al aire libre, y la pregunta de las mimosas", en: "Brunch with no outdoor kitchen, and the mimosa question" },
        cuerpo: {
          es: "Al aire libre no hay cocina: el catering del brunch monta en el sitio, y si necesita cocina, la del edificio es un adicional que se suma al alquiler desde el 1 de noviembre de 2026. No hay catering obligatorio ni lista de proveedores preferidos, y no cobramos comisión por traer el tuyo; en un shower, donde la cuenta suele repartirse entre varias personas, esa partida pesa más que el precio del espacio. La otra pregunta de todo shower es la mesa de mimosas. El recinto tiene licencia de licor propia, con su propio número, y hay área donde montar barra; las condiciones bajo las que se sirve alcohol en un evento privado se entregan por escrito con la ficha técnica, antes de firmar.",
          en: "There is no kitchen outdoors: the brunch caterer sets up on site, and if they need a kitchen, the building's is an add-on that joins the rental from November 1, 2026. There is no required caterer and no preferred-vendor list, and we take no commission on yours; at a shower, where the bill is usually split between several people, that line moves the total more than the rental rate does. The other question at every shower is the mimosa table. The site holds its own liquor license, with its own license number, and there is an area to set up a bar; the conditions under which alcohol is served at a private event come in writing with the spec sheet, before you sign.",
        },
      },
      {
        titulo: { es: "Cuánto recinto hace falta, y qué se mide en la visita", en: "How much of the site you need, and what gets measured at the visit" },
        cuerpo: {
          es: "Para un shower el Tiki Hut suelto suele bastar; el jardín de ~18.000 ft² se suma solo si hace falta. Hace falta si quieres las cabañas: las seis cabañas amuebladas están en el jardín, no bajo la palapa. Son fijas y van con el inmueble: con el jardín en la reserva no se cobran aparte. Un baby shower funciona igual a esta hora; si tu pregunta es si se puede alquilar solo una parte, o buscas sitio para un bautizo o un cumpleaños, esa respuesta está en Eventos pequeños, y el día grande de la boda, en Bodas. El número de baños y el aforo sentado y de pie con tu montaje no se publican porque no están medidos: se levantan en la visita técnica y se entregan por escrito.",
          en: "For a shower the Tiki Hut on its own is usually enough; the ~18,000 sq ft garden joins only if needed. You need it if you want the cabanas: the six furnished cabanas sit in the garden, not under the thatch. They are fixed and come with the property: with the garden in the booking, there is no separate charge. A baby shower works the same way at this hour; if your question is whether you can rent just one part, or you need a christening or birthday venue, see Small events; the big day is on Weddings. The number of restrooms and seated and standing capacity for your setup are not published because they are not measured yet: both are measured at the site visit and delivered in writing.",
        },
      },
    ],
  },
  /**
   * Página nueva del 10-sep-2026: demanda medida con el planificador y sin
   * página propia hasta hoy. Escrita y revisada por tres vías (veracidad contra
   * venue.ts, solape con las existentes, inglés nativo). Ver .qa/paginas-corregidas.json.
   */
  {
    clave: "finDeSemanaBoda",
    ojo: { es: "Uso · fin de semana de boda", en: "Use · wedding weekend" },
    h1: { es: "Cena de ensayo en Wynwood", en: "Rehearsal dinner venue in Wynwood" },
    respuesta: {
      es: "Club Wynwood alquila el recinto para la cena de ensayo y el fin de semana de boda en Wynwood, Miami. La cena de la víspera se monta bajo la palapa techada, que es también el plan de lluvia, y el after-party en el jardín: dos espacios contiguos en una sola dirección. No vendemos comida: el catering lo eliges tú.",
      en: "Club Wynwood rents the venue for the rehearsal dinner and the rest of the wedding weekend in Wynwood, Miami. Friday's dinner goes under the covered Tiki Hut, which doubles as the rain plan, and the after-party in the garden: two adjacent spaces at one address. We do not sell food: you hire your own caterer.",
    },
    title: {
      es: "Cena de ensayo en Wynwood, Miami | Club Wynwood",
      en: "Rehearsal dinner venue in Wynwood, Miami | Club Wynwood",
    },
    description: {
      es: "Cena de ensayo y fin de semana de boda en Wynwood, Miami: la víspera bajo la palapa techada, el after-party en el jardín. No vendemos comida: tu catering.",
      en: "Rehearsal dinner venue in Wynwood, Miami: Friday under the covered Tiki Hut, Saturday's after-party in the garden. We do not sell food: you hire your caterer.",
    },
    cifras: [
      { etiqueta: { es: "Bajo techo (la cena)", en: "Covered (the dinner)" }, valor: { es: "~4.000 ft²", en: "~4,000 sq ft" } },
      { etiqueta: { es: "Al aire libre (el after-party)", en: "Open air (the after-party)" }, valor: { es: "~18.000 ft²", en: "~18,000 sq ft" } },
      { etiqueta: { es: "Al aeropuerto MIA", en: "To MIA airport" }, valor: { es: "~16 min", en: "~16 min" } },
      { etiqueta: { es: "Cabañas amuebladas", en: "Furnished cabanas" }, valor: { es: "6", en: "6" } },
    ],
    foto: {
      src: "/assets/flyer-palapa-lounge.jpg",
      alt: { es: "Bajo la palapa: un montaje lounge con barra y guirnaldas", en: "Under the structure: a lounge setup with a bar and string lights" },
      pie: { es: "La palapa montada con barra y guirnaldas: el mismo techo que recoge la cena del viernes.", en: "The Tiki Hut set up as a lounge with a bar: the same roof that hosts Friday's dinner." },
    },
    bloques: [
      {
        titulo: { es: "No vendemos comida", en: "We do not sell food" },
        cuerpo: {
          es: "La cena de ensayo suele terminar en el salón privado de un restaurante, y ahí las condiciones las pone el restaurante: su carta, su barra y un mínimo de consumo que hay que alcanzar aunque la lista se acorte. Aquí no vendemos comida, así que el catering lo eliges tú: tu menú, tu proveedor y tu número real de invitados. Lo que se contrata es el espacio, y eso tiene su reverso: el alquiler del exterior no incluye vajilla, ni mantelería, ni personal de servicio. Todo eso llega con el catering, que es quien mejor sabe qué necesita para una cena sentada. El sitio pone el suelo, la sombra y la dirección; la mesa la pone tu equipo.",
          en: "A rehearsal dinner usually ends up in a restaurant's private dining room, and there the restaurant sets the terms: their menu, their bar and an F&B minimum you have to hit even if the guest list shrinks. We do not sell food, so you pick the caterer: your menu, your vendor and your real guest count. What you book is the space, and that has a flip side: the outdoor rental includes no tableware, no linens and no service staff. All of that comes with the caterer, who knows best what a seated dinner needs. The venue provides the ground, the shade and the address; your team provides the table.",
        },
      },
      {
        titulo: { es: "Viernes bajo la palapa, sábado en el jardín", en: "Friday under the Tiki Hut, Saturday in the garden" },
        cuerpo: {
          es: "Los dos espacios están uno al lado del otro, pero no se sienten igual. El Tiki Hut son ~4.000 ft² de paja a cuatro aguas: techo fijo, abierto por los cuatro costados. Para el sol y para la lluvia vertical basta solo; si la fecha es de viento, conviene presupuestar cierres laterales. Con la luz baja funciona como comedor. Una cena de ensayo el viernes bajo la palapa y un after-party el sábado en los ~18.000 ft² del jardín ocurren en la misma dirección sin parecer el mismo evento, con una sola visita técnica y un solo interlocutor. Los dos montajes no ocupan el mismo suelo, aunque comparten el paseo de entrada: el orden y los tiempos entre una noche y otra se planifican en la visita.",
          en: "The two spaces sit side by side, but they do not feel alike. The Tiki Hut is ~4,000 sq ft under a four-sided thatch roof, open on all four sides. For sun and vertical rain it is enough on its own; on a windy date, budget for side enclosures. With the lighting down it works as a dining room. A Friday rehearsal dinner under the Tiki Hut and a Saturday after-party across the ~18,000 sq ft of garden happen at one address without looking like the same event, with one site visit and one point of contact. The two load-ins do not sit on the same ground, though they share the entrance walk: the order and timing between the two nights are planned at the site visit.",
        },
      },
      {
        titulo: { es: "La comitiva que llega el jueves", en: "The group that lands on Thursday" },
        cuerpo: {
          es: "En una boda de destino la familia de fuera aterriza el jueves o el viernes, y la primera cita del calendario, la fiesta de bienvenida, es la que ordena a todo el mundo. MIA queda a unos 16 minutos; el resto de tiempos del barrio están en la página Por qué Wynwood. Wynwood Walls queda a unos 4 minutos a pie, así que quien llega temprano tiene barrio que recorrer en vez de un lobby de hotel. El estacionamiento es propio. La carga entra por NW 1st Ct y los invitados por NW 21st Ct: el camión del catering no se cruza con la gente que va llegando, que en una fiesta de bienvenida llega escalonada durante dos horas.",
          en: "At a destination wedding the out-of-town family lands on Thursday or Friday, and the first date on the calendar, the welcome party, is the one that sorts everyone out. MIA is about 16 minutes away; the rest of the neighborhood's travel times are on the Why Wynwood page. Wynwood Walls is about a four-minute walk, so guests who arrive early have a neighborhood to explore on foot instead of a hotel lobby. Parking is on site. Load-in runs off NW 1st Ct while guests arrive on NW 21st Ct: the catering truck never crosses paths with your guests, who at a welcome party trickle in over two hours.",
        },
      },
      {
        titulo: { es: "Cocina de apoyo, y la fiesta de compromiso", en: "A support kitchen, and the engagement party" },
        cuerpo: {
          es: "Al aire libre no hay cocina. El edificio, que se alquila aparte desde el 1 de noviembre de 2026, tiene una cocina de apoyo —isla, nevera de dos puertas, microondas y alacenas—, no una cocina de producción. Si tu catering necesita cocinar en sitio, eso se resuelve con equipo móvil y se define en la visita. Club Wynwood tiene licencia de licor propia, con su propio número, y hay área donde montar la barra; el detalle del servicio de bebidas se cierra en la visita. La fiesta de compromiso es otro calendario: llega meses antes, sin ceremonia ni protocolo, y usa uno solo de los dos espacios y de pie. Si son 50 a 150 invitados, la página de eventos pequeños explica cómo se contrata solo el Tiki Hut.",
          en: "Outdoors there is no kitchen. The building, rented separately and available from November 1, 2026, has a support kitchen — an island, a two-door fridge, a microwave and cabinets — not a production kitchen. If your caterer needs to cook on site, that is solved with mobile equipment and settled at the site visit. Club Wynwood holds its own liquor license, and there is a dedicated area for the bar setup; beverage service is settled at the visit. An engagement party runs on a different calendar: it comes months earlier, with no ceremony and no timeline, and uses just one of the two spaces, standing. If it is 50 to 150 guests, the small events page explains how to book just the Tiki Hut.",
        },
      },
    ],
  },
  /**
   * Página nueva del 10-sep-2026: demanda medida con el planificador y sin
   * página propia hasta hoy. Escrita y revisada por tres vías (veracidad contra
   * venue.ts, solape con las existentes, inglés nativo). Ver .qa/paginas-corregidas.json.
   */
  {
    clave: "salonVsJardin",
    ojo: { es: "Comparación · salón o jardín", en: "Comparison · ballroom vs. garden" },
    h1: { es: "En vez de un salón", en: "Instead of a banquet hall" },
    respuesta: {
      es: "Club Wynwood es un recinto de fiestas al aire libre en Wynwood, Miami: ~22.000 ft² con ~4.000 ft² techados bajo palapa, y no un salón cerrado. Frente a un salón cambian tres cosas: la carga entra por una calle distinta de la de los invitados, el catering lo eliges tú y el recinto tiene licencia de licor propia.",
      en: "Club Wynwood is a ~22,000 sq ft open-air party venue in Wynwood, Miami, with ~4,000 sq ft covered by the tiki hut, not an enclosed banquet hall. Compared with a hall, three things change: freight comes in on a different street from your guests, you choose your own caterer, and the venue holds its own liquor license.",
    },
    title: {
      es: "Salón de fiestas en Miami, al aire libre | Club Wynwood",
      en: "Outdoor party hall rental in Miami | Club Wynwood",
    },
    description: {
      es: "¿Buscas un salón de fiestas en Miami? Esto es un recinto al aire libre de ~22.000 ft² en Wynwood, con ~4.000 techados, tu catering y licencia de licor propia.",
      en: "Looking for a party hall rental in Miami? This is a ~22,000 sq ft open-air venue in Wynwood, ~4,000 under the tiki hut, your caterer and its own liquor license.",
    },
    cifras: [
      { etiqueta: { es: "Techado", en: "Covered" }, valor: { es: "~4.000 ft²", en: "~4,000 sq ft" } },
      { etiqueta: { es: "Entradas separadas", en: "Separate entrances" }, valor: { es: "2", en: "2" } },
      { etiqueta: { es: "Licencia de licor", en: "Liquor license" }, valor: { es: "Propia", en: "Its own" } },
      { etiqueta: { es: "Exterior disponible desde", en: "Outdoors available from" }, valor: { es: "1 oct 2026", en: "Oct 1, 2026" } },
    ],
    foto: {
      src: "/assets/flyer-palapa-lounge.jpg",
      alt: { es: "Bajo la palapa, montada para una fiesta: barra, guirnaldas y techo de paja sobre postes de madera", en: "Under the tiki hut, set up for a party: a bar, string lights and a thatched roof on timber posts" },
      pie: { es: "Un montaje de fiesta bajo la palapa: lo que en un salón serían moqueta y lámparas, aquí es paja y guirnaldas.", en: "A party setup under the tiki hut: where a hall would have carpet and chandeliers, here it is thatch and string lights." },
    },
    bloques: [
      {
        titulo: { es: "Dos calles: la carga por una, los invitados por otra", en: "Two streets: freight on one, guests on the other" },
        cuerpo: {
          es: "En un salón de banquetes el camión del decorador, el catering y los invitados suelen entrar por la misma puerta, y el montaje queda a la vista. Aquí hay dos entradas en dos calles distintas: la carga entra por NW 1st Ct y los invitados por NW 21st Ct. Eso cambia el día de la fiesta: el decorador puede seguir trabajando mientras llega la gente, la carga del catering no cruza el paseo por donde entran los invitados, y el desmontaje sale por la misma puerta por la que entró. Hay además estacionamiento propio en el predio, que en Wynwood pesa más que en cualquier otro barrio de Miami.",
          en: "At a banquet hall the decorator's truck, the caterer and the guests usually come through the same door, and the load-in happens in plain sight. Here there are two entrances on two different streets: freight comes in on NW 1st Ct and guests arrive on NW 21st Ct. That changes the day itself: the decorator can keep working while people arrive, the catering load-in never crosses the guest path, and load-out leaves through the same gate it came in. There is on-site parking as well, which in Wynwood counts for more than in any other Miami neighborhood.",
        },
      },
      {
        titulo: { es: "Licencia de licor propia, con número propio", en: "Its own liquor license, with its own number" },
        cuerpo: {
          es: "Es la pregunta que más presupuestos rompe al comparar salones, y conviene hacerla antes de reservar: ¿el sitio tiene licencia de licor propia o depende de un tercero? Club Wynwood tiene licencia de licor de Miami propia, con su propio número, y no todos los venues de la zona la tienen. El número y sus condiciones no se publican: se entregan con la ficha técnica. Hay área donde montar barra bajo la palapa. Con la comida pasa lo mismo que con la barra: no hay proveedor impuesto. Al aire libre no hay cocina, así que el catering monta en el sitio; si necesita cocina, la del edificio se suma al alquiler como adicional desde el 1 de noviembre de 2026.",
          en: "It is the question that breaks the most budgets when comparing halls, and worth asking before you book: does the venue hold its own liquor license, or does it depend on a third party? Club Wynwood holds its own Miami liquor license, with its own license number, and not every venue in the area does. The number and its conditions are not published: they come with the spec sheet. There is room for a bar setup under the tiki hut. Food works the same way as the bar: there is no exclusive caterer and no preferred-vendor list. Outdoors there is no kitchen, so the caterer sets up on site; if they need one, the building's kitchen is available as an add-on to the rental starting November 1, 2026.",
        },
      },
      {
        titulo: { es: "Para qué fiesta es esta página, y para cuál no", en: "Which party this page is for, and which it is not" },
        cuerpo: {
          es: "Quien busca un salón de fiestas suele pensar en una fiesta sentada de entre 150 y 300 personas: un cumpleaños redondo, un aniversario, un bautizo grande, una celebración familiar. Esa es la medida de esta página, y aquí se hace con el jardín y la palapa juntos; cuánta gente cabe con tu montaje —mesas, pista, barra— está en la página de aforo. Si la fiesta es de 50 a 150 invitados no hace falta contratar el recinto entero: se alquila solo el Tiki Hut, y eso tiene su propia página, Eventos pequeños. Una quinceañera tiene la suya. Y una activación de marca o una cena de empresa están en corporativo y en fin de año.",
          en: "Anyone searching for a banquet hall usually has a seated party of 150 to 300 people in mind: a milestone birthday, an anniversary, a large christening, a family celebration. That is the size this page is about, and here it takes the garden and the tiki hut together; how many people fit with your layout — tables, dance floor, bar — lives on the capacity page. If the party is 50 to 150 guests you do not need the whole venue: the Tiki Hut books on its own, and that has its own page, Small events. A quinceañera or a sweet sixteen has its own. And a brand activation or a company dinner lives under corporate and holiday party.",
        },
      },
      {
        titulo: { es: "Cuándo un salón te sirve más", en: "When a banquet hall suits you better" },
        cuerpo: {
          es: "Si lo que necesitas es aire acondicionado, comida incluida y un precio cerrado por persona, un salón te va a servir mejor que esto. Aquí no hay paredes: la palapa resuelve el sol y la lluvia que cae recta, pero con viento el agua entra de lado, así que conviene presupuestar cierres laterales como plan de lluvia; en invierno, con más razón. Tampoco hay mobiliario de banquete: lo fijo son las palmeras, los setos, las seis cabañas amuebladas y las mesas de picnic; el resto lo traes tú, y no hay moqueta ni lámparas que discutan con tu decoración. Potencia, baños, plazas de estacionamiento, load-in, curfew y límite de decibelios no se publican: se miden en la visita y se confirman por escrito.",
          en: "If what you need is air conditioning, food included and a flat per-person price, a hall will serve you better than this. There are no walls here: the tiki hut handles sun and rain falling straight down, but in wind the water comes in sideways, so budget for tent sidewalls as your rain plan — in winter all the more so. There is no banquet furniture either: what is fixed are the palms, the hedges, the six furnished cabanas and the picnic tables; everything else you bring, and there is no carpet or chandeliers arguing with your decor. Power, restrooms, parking spaces, load-in, curfew and the decibel limit are not published: they are measured on the site visit and confirmed in writing.",
        },
      },
    ],
  },
  /**
   * Página nueva del 10-sep-2026: demanda medida con el planificador y sin
   * página propia hasta hoy. Escrita y revisada por tres vías (veracidad contra
   * venue.ts, solape con las existentes, inglés nativo). Ver .qa/paginas-corregidas.json.
   */
  {
    clave: "sweet16",
    ojo: { es: "Uso · Sweet 16", en: "Use · Sweet 16" },
    h1: { es: "Sweet 16", en: "Sweet 16" },
    respuesta: {
      es: "Club Wynwood es un venue al aire libre para un Sweet 16 en Wynwood, Miami. Hasta ~150 invitados, se contrata solo el Tiki Hut: ~4.000 ft² bajo una palapa abierta por los cuatro costados. Con más invitados, el recinto completo de ~22.000 ft², hasta ~600 de pie. El espacio llega vacío; DJ, catering y decoración los pones tú.",
      en: "Club Wynwood is an outdoor Sweet 16 venue in Wynwood, Miami. A sweet sixteen of up to ~150 guests books the Tiki Hut alone: ~4,000 sq ft under a thatched roof open on all four sides. Larger parties take the whole ~22,000 sq ft site, up to ~600 standing. The space comes empty; DJ, catering and decor are your vendors.",
    },
    title: {
      es: "Sweet 16 al aire libre en Wynwood, Miami | Club Wynwood",
      en: "Outdoor Sweet 16 venue in Wynwood, Miami | Club Wynwood",
    },
    description: {
      es: "Sweet 16 al aire libre en Wynwood, Miami: hasta ~150 invitados, solo el Tiki Hut de ~4.000 ft²; con más, el recinto completo de ~22.000 ft². Llega vacío.",
      en: "Outdoor Sweet 16 venue in Wynwood, Miami: up to ~150 guests, book just the ~4,000 sq ft Tiki Hut; more than that, the whole ~22,000 sq ft site. Comes empty.",
    },
    cifras: [
      { etiqueta: { es: "Solo el Tiki Hut", en: "Tiki Hut only" }, valor: { es: "~4.000 ft²", en: "~4,000 sq ft" } },
      { etiqueta: { es: "Recinto completo", en: "Whole site" }, valor: { es: "~22.000 ft²", en: "~22,000 sq ft" } },
      { etiqueta: { es: "De pie (recinto completo)", en: "Standing (whole site)" }, valor: { es: "~600", en: "~600" } },
      { etiqueta: { es: "Cabañas fijas", en: "Fixed cabanas" }, valor: { es: "6", en: "6" } },
    ],
    foto: {
      src: "/assets/flyer-paseo-puerta.jpg",
      alt: { es: "El paseo pavimentado entre las dos hileras de palmeras hasta la puerta del edificio, a ras de suelo, con el Tiki Hut a la izquierda y las cabañas a la derecha: el recorrido de entrada de un Sweet 16", en: "The paved walk between two rows of palms up to the building door, shot from ground level, with the Tiki Hut on the left and the cabanas on the right: the grand entrance walk for a Sweet 16" },
      pie: { es: "El paseo: 15 × 108 ft entre dos hileras de palmeras, de la puerta del edificio al estacionamiento.", en: "The walk: 15 by 108 ft between two rows of palms, from the building door to the parking lot." },
    },
    bloques: [
      {
        titulo: { es: "Lo que preguntan los padres", en: "What the parents ask" },
        cuerpo: {
          es: "Los padres traen otra lista. El predio es un lote privado con setos perimetrales, no un parque ni una calle. Tiene estacionamiento propio, y las dos entradas están separadas: los invitados llegan por NW 21st Ct y la carga entra por NW 1st Ct, así que los camiones del montaje no pasan por la entrada de la fiesta. Cómo se controla el acceso el día del evento —y si hace falta personal de seguridad— se define contigo en la visita técnica. Cuatro datos no se publican porque todavía no están medidos: cuántas plazas tiene el estacionamiento, cuántos baños hay, el límite de dB y la hora de cierre. Los cuatro salen de la visita técnica y se entregan por escrito.",
          en: "Parents arrive with a different list. The site is a private lot enclosed by perimeter hedges, not a park and not a street. It has its own on-site parking, and the two entrances are separate: guests come in on NW 21st Ct and load-in on NW 1st Ct, so the vendors' trucks do not come through the guest entrance. How access is controlled on the day — and whether security staff is needed — is settled with you at the site visit. Four things we do not publish because they are not measured yet: how many parking spaces, how many restrooms, the dB limit and the curfew. All four come out of the site visit, in writing.",
        },
      },
      {
        titulo: { es: "El número de invitados decide qué parte contratas", en: "The guest count decides what you book" },
        cuerpo: {
          es: "Un Sweet 16 rara vez son 300 personas, y la lista de invitados es el primer número que decide qué parte del recinto contratas. Hasta unos 150 invitados, solo el Tiki Hut: ~4.000 ft² que se contratan sin el jardín y mantienen la fiesta reunida en vez de repartida por un lote que no puede llenar. Con más, el recinto completo: ~18.000 ft² de jardín más el Tiki Hut, ~22.000 ft² en total, hasta ~600 de pie o ~300 sentados. El Tiki Hut es además el plan de lluvia —techo de paja, abierto por los cuatro costados, cierres laterales para una fecha de invierno con viento— y tiene su propia página. Cuánta gente cabe bajo la palapa con tu montaje concreto se confirma en la visita técnica.",
          en: "A Sweet 16 is rarely 300 people, and the guest list is the first number that decides which part of the site you book. Up to about 150 guests, the Tiki Hut alone: ~4,000 sq ft that book without the garden and keep the party together instead of scattered across a lot it cannot fill. Above that, the whole site: ~18,000 sq ft of garden plus the Tiki Hut, ~22,000 sq ft in all, up to ~600 standing or ~300 seated. The Tiki Hut is also the rain plan — thatch roof, open on all four sides, sidewalls for a windy winter date — and it has its own page. How many people fit under it with your specific layout is confirmed at the site visit.",
        },
      },
      {
        titulo: { es: "De pie y con DJ, no un banquete sentado", en: "Standing, with a DJ — not a seated banquet" },
        cuerpo: {
          es: "Una quinceañera va sentada —corte de honor, vals, cena— y el sitio tiene una página para eso. Un Sweet 16 va al revés: DJ, pista de baile, photobooth y casi toda la noche de pie. Por eso la cifra que importa aquí es la de pie, no la de sentados. Los postes y cabios de madera del Tiki Hut son de donde cuelgan el sonido y las luces; cualquier carga colgada, y la potencia que pide el DJ, se miden y se aprueban en la visita técnica. El paseo pavimentado entre dos hileras de palmeras es la entrada, y ya está hecha. Todo lo demás —catering, DJ, iluminación, mesas y sillas— lo traen tus proveedores: al aire libre no hay cocina y el espacio llega vacío.",
          en: "A quinceañera runs seated — a court, a waltz, a dinner — and the site has a page for that. A Sweet 16 runs the other way: a DJ, a dance floor, a photo booth, most of the night on your feet. That is why the figure that matters here is standing, not seated. The Tiki Hut's timber posts and rafters are where sound and lights hang; any hung load, and the DJ's power draw, are measured and approved at the site visit. The paved walk between two rows of palms is the grand entrance, already built. Everything else — catering, DJ, lighting, tables and chairs — comes from your own vendors: there is no kitchen outdoors, and the space comes empty.",
        },
      },
      {
        titulo: { es: "La licencia de licor en una fiesta de menores", en: "The liquor license at a party of minors" },
        cuerpo: {
          es: "El recinto tiene licencia de licor propia y un área donde montar barra. En un Sweet 16 eso plantea la pregunta antes de que nadie la haga: la homenajeada tiene dieciséis y la mayoría de los invitados es menor de 21. Cómo funciona una barra en una fiesta de menores —si la hay para los adultos, quién sirve y en qué condiciones, o si el evento va sin alcohol— no se publica aquí como política: se define con la familia en la visita técnica y queda por escrito, igual que la hora de cierre. Mientras tanto, dos hechos se sostienen: la licencia existe, y el sitio para la barra también. Lo que ninguna página puede decidir por ti se resuelve en persona, antes de confirmar la fecha.",
          en: "The venue has its own liquor license and an area where a bar can be set up. At a Sweet 16 that raises the question before anyone asks it: the guest of honor is sixteen and most of the guests are under 21. How a bar works at a party of minors — whether there is one for the adults, who serves and under what conditions, or whether the event runs without alcohol — is not published here as a policy: it is defined with the family at the site visit and put in writing, the same as the curfew. Two facts stand meanwhile: the license exists, and so does the space for a bar. What no page can decide for you is settled in person, before the date is confirmed.",
        },
      },
    ],
  },
  /**
   * Página nueva del 10-sep-2026: demanda medida con el planificador y sin
   * página propia hasta hoy. Escrita y revisada por tres vías (veracidad contra
   * venue.ts, solape con las existentes, inglés nativo). Ver .qa/paginas-corregidas.json.
   */
  {
    clave: "swimWeek",
    ojo: { es: "Uso · desfiles y pasarela", en: "Use · runway and fashion shows" },
    h1: { es: "Desfiles de moda", en: "Runway shows" },
    respuesta: {
      es: "Club Wynwood alquila un lote al aire libre en Wynwood, Miami, donde un desfile se monta sobre un paseo pavimentado de unos 15 × 108 ft, con la palapa techada de ~4.000 ft² al costado como backstage y carga por puerta propia. No es sede oficial de Miami Swim Week: es donde se produce el show satélite.",
      en: "Club Wynwood rents an open-air lot in Wynwood, Miami, where a runway show sets up on a paved walkway of about 15 × 108 ft, with the ~4,000 sq ft thatched structure beside it as covered backstage and its own load-in gate. It is not an official Miami Swim Week venue: it is where the satellite show gets produced.",
    },
    title: {
      es: "Desfiles de moda y satélites de Swim Week | Club Wynwood",
      en: "Runway shows in Wynwood: Swim Week satellites | Club Wynwood",
    },
    description: {
      es: "Venue para desfiles y shows satélite de Swim Week en Wynwood, Miami: un paseo pavimentado de ~15 × 108 ft que ya es pasarela, backstage techado y carga aparte.",
      en: "Runway-show venue in Wynwood, Miami, for Swim Week satellites: a paved ~15 × 108 ft walkway that is already the runway, covered backstage and a load-in gate.",
    },
    cifras: [
      { etiqueta: { es: "Traza de pasarela (según plano)", en: "Runway line (per site plan)" }, valor: { es: "~15 × ~108 ft", en: "~15 × ~108 ft" } },
      { etiqueta: { es: "Superficie techada, con aleros", en: "Covered area, incl. eaves" }, valor: { es: "~4.000 ft²", en: "~4,000 sq ft" } },
      { etiqueta: { es: "Cabañas fijas, lado este", en: "Fixed cabanas, east side" }, valor: { es: "6", en: "6" } },
      { etiqueta: { es: "Exterior reservable desde", en: "Outdoors bookable from" }, valor: { es: "1 oct 2026", en: "Oct 1, 2026" } },
    ],
    foto: {
      src: "/assets/flyer-paseo-puerta.jpg",
      alt: { es: "El paseo pavimentado visto a ras de suelo, recto hasta la puerta del edificio, con las palmeras a los lados", en: "Ground-level view of the paved walkway, running straight to the building door, live palms on either side" },
      pie: { es: "El paseo pavimentado hasta la puerta del edificio, en losas con juntas de césped.", en: "The paved walkway up to the building door, in slabs with turf joints." },
    },
    bloques: [
      {
        titulo: { es: "La traza de la pasarela ya está", en: "The runway line is already there" },
        cuerpo: {
          es: "El paseo pavimentado que cruza el recinto mide unos 15 ft de ancho por unos 108 de largo según el plano del sitio, de la puerta del edificio al estacionamiento sur. Son losas grandes con juntas de césped, planas y sin escalones: la traza de la pasarela ya existe, no hay que replantearla ni nivelar terreno. Si el desfile pide superficie continua —tacón fino, dolly, ruedas de cámara— o pasarela elevada, tu producción lo monta encima y el paseo le da la base plana. Las dos hileras de palmeras están plantadas a pie y medio del borde de las losas: dejan los 15 ft libres y entre troncos quedan unos 18 ft. La medida es aproximada hasta contrastarla con el levantamiento del predio.",
          en: "The paved walkway that crosses the site is about 15 ft wide and about 108 ft long per the site plan, from the building door to the south parking lot. It is large slabs with turf joints, flat and step-free: the runway line already exists, with no layout to set out and no ground to level. If the show needs a continuous surface — thin heels, a dolly, camera wheels — or a raised runway, your production builds it on top and the walkway gives it a flat base. The two rows of live palms stand a foot and a half off the slab edge: the 15 ft stay clear and there are about 18 ft between trunks. The figure stays approximate until it is checked against the survey.",
        },
      },
      {
        titulo: { es: "Los dos costados no son iguales", en: "The two sides are not the same" },
        cuerpo: {
          es: "Conviene saberlo antes de dibujar el montaje. Al oeste del paseo hay césped y el apron pavimentado de la fachada, con la palapa detrás: es el costado que admite filas de silla sobre firme. Al este todo es arena, y sobre ella la hilera de seis cabañas amuebladas, que son fijas y cuentan en el plano: sirven de primera fila con sofá, y lo que se siente delante de ellas pide entablado. Cuántas filas admite cada costado se define en la visita. El público entra por el sur, donde desemboca el paseo, así que el remate visual de la pasarela es la fachada del edificio con su puerta y su mural, y las fotos del final del recorrido salen con eso detrás.",
          en: "Worth knowing before drawing the layout. West of the walkway there is turf and the paved apron along the façade, with the thatched structure behind: that is the side that takes rows of chairs on firm ground. East of it everything is sand, and on it the row of six furnished cabanas, which are fixed and count in the plan: they work as a sofa front row, and anything seated in front of them needs decking. How many rows each side takes is settled at the site visit. Guests come in from the south, where the walkway ends, so the visual end of the runway is the building façade with its door and mural, and the photos at the top of the walk come out with that behind.",
        },
      },
      {
        titulo: { es: "Backstage a pie de pasarela, carga por otra puerta", en: "Backstage at the runway's edge, load-in through its own gate" },
        cuerpo: {
          es: "La palapa está al costado del tramo sur de la pasarela, en la esquina suroeste, con la cumbrera paralela al paseo: unos 54 × 60 ft, ~4.000 ft² techados contando aleros, abierta por los cuatro costados. Queda a pie de pasarela, así que sirve de backstage, maquillaje o sala de prensa sin alquilar carpa; el cierre visual para el cambio de vestuario lo trae tu producción, porque no hay paredes. Los accesos son dos y no se cruzan: la carga entra por NW 1st Ct, al oeste, a la franja pavimentada junto a la fachada, a un paso de la palapa; los invitados por NW 21st Ct, al sur. El ancho del portón y la carga admisible de los cabios se miden en la visita.",
          en: "The thatched structure sits alongside the southern stretch of the runway, in the south-west corner, its ridge parallel to the walkway: about 54 × 60 ft, ~4,000 sq ft covered including eaves, open on all four sides. It is right at the runway edge, so it works as backstage, hair and makeup or a press area without renting a tent; the visual screen for changing is on your production, because there are no walls. There are two entrances and they do not cross: load-in is off NW 1st Ct to the west, onto the paved strip along the façade, a step from the structure; guests come in off NW 21st Ct to the south. Gate width and the rafters' load rating get measured at the site visit.",
        },
      },
      {
        titulo: { es: "Luz, lluvia y temporada", en: "Light, rain and the season" },
        cuerpo: {
          es: "Un desfile aquí se hace al anochecer, y el recinto no tiene iluminación de casa: la luz de pasarela la trae tu producción, y la potencia disponible se confirma en la visita. El techo de paja aguanta la lluvia vertical; con viento el agua entra de lado, así que el plan de lluvia debe presupuestar lonas laterales para la palapa. Aforo sentado y de pie del montaje concreto, curfew, límite de decibelios y número de baños se levantan en la visita y quedan por escrito. Sobre el calendario: el exterior se reserva desde el 1 de octubre de 2026, así que la primera Swim Week vendible es la de 2027; si el show necesita permiso de evento especial de la City of Miami, la conversación útil empieza meses antes.",
          en: "A show here runs at dusk, and the site has no house lighting: runway lighting is on your production, and the available power, with its amperage, is confirmed at the site visit. The thatched roof handles straight-down rain; in wind it blows in sideways, so the rain plan should budget sidewalls for the structure. Seated and standing capacity for your layout, curfew, the decibel limit and the restroom count are measured at that same visit and put in writing. On the calendar: the outdoor site takes bookings from October 1, 2026, so the first Swim Week on sale is the 2027 edition; if the show needs a City of Miami special-event permit, the useful conversation starts months ahead.",
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
    // Ésta es LA pregunta, y antes se contestaba con un «No» y punto. Un «no»
    // no resuelve una duda: la deja intacta y encima suena a que hay algo que
    // esconder. Sin publicar cifra —eso lo decide Sandra— sí se puede decir de
    // qué depende y cuándo llega el número, que es lo que la persona necesita
    // para saber si seguir o no.
    q: { es: "¿Cuánto cuesta? ¿Publican tarifas?", en: "How much does it cost? Do you publish rates?" },
    a: {
      es: "No hay tarifa publicada: depende del espacio que uses, las horas, el día y si necesitas montar la víspera. Mándanos la fecha y el número de invitados y te llega el presupuesto con la disponibilidad en 24 horas hábiles, sin compromiso.",
      en: "There is no published rate: it depends on the space you use, the hours, the day and whether you need to build the day before. Send us the date and the guest count and you get the quote with availability within 24 business hours, with no commitment.",
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
      es: "El Tiki Hut es una palapa techada de ~4.000 ft² con techo de paja a cuatro aguas, abierta por los costados. Es cubierta fija: funciona como plan de lluvia sin mover el evento de sede. Para el agua que cae recta basta sola; con viento conviene cerrar los costados.",
      en: "The Tiki Hut is a ~4,000 sq ft covered structure with a four-hipped thatched roof, open on the sides. It is permanent cover: it works as the rain plan without moving the event. For vertical rain it is enough on its own; with wind you will want the sides closed.",
    },
  },
  {
    q: { es: "¿Qué incluye el alquiler de Club Wynwood?", en: "What does renting Club Wynwood include?" },
    a: {
      es: "Se alquila el espacio exterior: el Jardín de ~18.000 ft² y el Tiki Hut techado de ~4.000 ft², por separado o juntos, con las seis cabañas amuebladas y las mesas de picnic que ya están en el jardín. La producción, el catering, el sonido, la iluminación y el mobiliario adicional los aporta tu equipo o tu productora.",
      en: "You rent the outdoor space: the ~18,000 sq ft Garden and the ~4,000 sq ft covered Tiki Hut, separately or together, with the six furnished cabanas and the picnic tables already in the garden. Production, catering, sound, lighting and extra furniture come from your team or your production company.",
    },
  },
  {
    q: { es: "¿Puedo traer mi propio catering y mi propia barra?", en: "Can I bring my own catering and bar?" },
    a: {
      es: "Sí. No hay proveedor impuesto ni comisión por traer el tuyo. Al aire libre no hay cocina: el catering monta en el sitio, o usa la cocina del edificio si lo alquilas también. La barra la pone tu equipo.",
      en: "Yes. There is no imposed supplier and no fee for bringing your own. Outdoors there is no kitchen: catering sets up on site, or uses the building's kitchen if you rent it as well. There is an area where a bar can be set up.",
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
    q: { es: "¿Hasta qué hora se puede, y con cuánto volumen?", en: "How late can we run, and how loud?" },
    a: {
      es: "El horario límite y el tope de decibelios dependen de la ordenanza de la zona y de la licencia del sitio: se confirman por escrito en la visita técnica. Si tu evento depende de terminar tarde, dilo en la solicitud y lo resolvemos antes de que vengas.",
      en: "The curfew and the dB limit depend on the local ordinance and the site's licence: both are confirmed in writing at the technical visit. If your event depends on running late, say so in the enquiry and we resolve it before you come.",
    },
  },
  {
    q: { es: "¿Hay potencia, parking y baños?", en: "Is there power, parking and restrooms?" },
    a: {
      es: "Sí, y su detalle exacto —amperaje y fase, plazas de parking, número de baños, ancho del portón de carga, curfew y límite de dB— se levanta contigo en la visita técnica y se entrega por escrito. No lo publicamos porque no lo hemos medido nosotros.",
      en: "Yes, and the exact detail —amperage and phase, parking spaces, number of restrooms, freight gate width, curfew and dB limit— is surveyed with you at the technical visit and delivered in writing. We do not publish it because we have not measured it ourselves.",
    },
  },
  {
    q: { es: "¿Tiene licencia de licor?", en: "Does it have a liquor license?" },
    a: {
      es: "Sí. El recinto tiene licencia de licor de Miami propia, con su propio número de licencia, cosa que no todos los venues de la zona pueden decir. Hay área donde montar barra; el número de licencia y sus condiciones se entregan con la ficha técnica.",
      en: "Yes. The site holds its own Miami liquor license, with its own license number, which not every venue in the area can say. There is an area where a bar can be set up; the license number and its conditions come with the spec sheet.",
    },
  },
  {
    q: { es: "¿Desde cuándo se puede reservar?", en: "From when can it be booked?" },
    a: {
      es: "El exterior —el Jardín y el Tiki Hut— está disponible desde el 1 de octubre de 2026. El edificio, desde el 1 de noviembre de 2026. Miami Art Week (30 de noviembre al 6 de diciembre) tiene fechas abiertas: escríbenos con la tuya.",
      en: "The outdoors —the Garden and the Tiki Hut— is available from October 1, 2026. The building, from November 1, 2026. Miami Art Week (November 30 to December 6) has open dates: write to us with yours.",
    },
  },
  {
    q: { es: "¿El edificio se puede alquilar como oficina?", en: "Can the building be rented as an office?" },
    a: {
      es: "Sí. El edificio de dos niveles se alquila aparte, para eventos o como oficina, desde el 1 de noviembre de 2026. La cocina es un adicional: se suma al alquiler cuando el catering la necesita.",
      en: "Yes. The two-level building is rented separately, for events or as an office, from November 1, 2026. The kitchen is an add-on: it is added to the rental when catering needs it.",
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
    q: { es: "¿Se puede visitar antes de reservar?", en: "Can I visit before booking?" },
    a: {
      es: "Sí, y lo recomendamos. La visita técnica es donde se levantan las cotas, el aforo por montaje y la ficha de infraestructura, y donde tu productora comprueba si el recinto sirve para lo que tiene en la cabeza.",
      en: "Yes, and we recommend it. The technical visit is where dimensions, capacity per layout and the infrastructure sheet are surveyed, and where your production company checks whether the site works for what they have in mind.",
    },
  },
];

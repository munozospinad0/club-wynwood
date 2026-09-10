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
      { etiqueta: { es: "Cabañas amuebladas", en: "Furnished cabanas" }, valor: "4" },
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
      { etiqueta: { es: "Cabañas amuebladas", en: "Furnished cabanas" }, valor: "4" },
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
      { etiqueta: { es: "Cabañas", en: "Cabanas" }, valor: "4" },
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
          es: "El recinto tiene licencia de licor propia, con su número de licencia, cosa que no todos los espacios de la zona pueden decir; la barra la monta y la opera tu equipo. Y hay estacionamiento en el propio predio, al este y al sur, que en esa semana y en este barrio deja de ser un detalle. La carga entra por su propia puerta, aparte de la de los invitados.",
          en: "The site holds its own liquor license, with its own license number, which not every space in the area can say; your team sets up and runs the bar. And there is parking on site, to the east and south, which during that week and in this neighbourhood stops being a detail. Freight comes in through its own gate, separate from the guests'.",
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
      en: "Yes. There is no imposed supplier and no fee for bringing your own. Outdoors there is no kitchen: catering sets up on site, or uses the building's kitchen if you rent it as well. Your team runs the bar.",
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
      es: "Sí. El recinto tiene licencia de licor de Miami propia, con su propio número de licencia, cosa que no todos los venues de la zona pueden decir. La barra la monta y la opera tu equipo; el número de licencia y sus condiciones se entregan con la ficha técnica.",
      en: "Yes. The site holds its own Miami liquor license, with its own license number, which not every venue in the area can say. Your team sets up and runs the bar; the license number and its conditions come with the spec sheet.",
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

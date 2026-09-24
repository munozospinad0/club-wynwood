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
      es: "El Jardín son ~18.000 ft² de exterior continuo en Wynwood, Miami: la superficie mayor del recinto y la que admite montaje libre. Un paseo pavimentado baja de la puerta del edificio al estacionamiento, con césped artificial del lado del pabellón y arena del lado de las cabañas, dos hileras de palmeras reales, un área de arena con mesas de picnic y seis cabañas amuebladas.",
      en: "The Garden is ~18,000 sq ft of open-air space in Wynwood, Miami — the largest part of the venue, and the one you can build out freely. A paved walkway runs from the building door to the parking lot, with artificial turf on one side and sand on the other, two rows of real palms, picnic tables and six furnished cabanas.",
    },
    title: {
      es: "El Jardín — ~18.000 ft² al aire libre en Wynwood | Club Wynwood",
      en: "The Garden — ~18,000 sq ft outdoors in Wynwood | Club Wynwood",
    },
    description: {
      es: "El Jardín de Club Wynwood: ~18.000 ft² al aire libre en Wynwood, Miami. Paseo pavimentado, césped artificial, palmeras reales y seis cabañas amuebladas.",
      en: "Club Wynwood's Garden: ~18,000 sq ft of outdoor space in Wynwood, Miami, with a paved walkway, artificial turf, two rows of palms and six furnished cabanas.",
    },
    cifras: [
      { etiqueta: { es: "Superficie", en: "Area" }, valor: { es: "~18 000 ft²", en: "~18,000 sq ft" } },
      { etiqueta: { es: "Cabañas amuebladas", en: "Furnished cabanas" }, valor: "6" },
      { etiqueta: { es: "De pie (recinto completo)", en: "Standing (whole venue)" }, valor: "~600" },
    ],
    foto: {
      src: "/assets/venue-exterior.webp",
      alt: {
        es: "El paseo pavimentado entre las dos hileras de palmeras, con el pabellón al fondo",
        en: "The paved walkway between two rows of palms, with the Pavilion in the background",
      },
      pie: {
        es: "El paseo central del Jardín, entre las dos hileras de palmeras.",
        en: "The Garden's central walkway, between two rows of palms.",
      },
    },
    bloques: [
      {
        titulo: { es: "Qué hay en el suelo", en: "What's on the ground" },
        cuerpo: {
          es: "Paseo pavimentado central de la puerta al estacionamiento, con césped artificial a un lado y arena al otro. Setos perimetrales cierran el recinto y mesas de picnic fijas completan el mobiliario existente. Es superficie firme: no hay que resolver piso antes de montar. El paseo mide unos 15 ft de ancho por 108 de largo, según el plano del predio; medida aproximada hasta contrastarla con el levantamiento. Tres superficies a pocos metros es también lo que aprovecha un offsite de empresa para zonificar sin mover mobiliario.",
          en: "A paved walkway runs down the middle, from the building door to the parking lot, with artificial turf on one side and sand on the other. Hedges enclose the property, and fixed picnic tables are already in place. The ground is firm, so there's no flooring to install before you build. According to the site plan, the walkway is about 15 ft wide and 108 ft long (to be confirmed against the survey). Three different surfaces a few steps apart also let a corporate offsite set up separate zones without moving any furniture.",
        },
      },
      {
        titulo: { es: "Qué trae tu equipo", en: "What your team brings" },
        cuerpo: {
          es: "Producción, catering, sonido, iluminación y mobiliario adicional. Se alquila el espacio, no un paquete cerrado, y por eso una productora sabe exactamente qué recibe el día del montaje.",
          en: "Production, catering, sound, lighting and any extra furniture. You rent the space, not a package, so your production company knows exactly what it's getting on load-in day.",
        },
      },
      {
        titulo: { es: "Si llueve", en: "If it rains" },
        cuerpo: {
          es: "El Jardín es contiguo al Pabellón, el espacio techado de ~4.000 ft². Se alquilan por separado o juntos: contratar los dos convierte la cubierta en el plan de lluvia del mismo recinto, sin mover el evento de sitio.",
          en: "The Garden sits right next to the Pavilion, the ~4,000 sq ft covered space. You can rent them separately or together; book both and the Pavilion becomes your rain plan on the same property, without moving the event.",
        },
      },
    ],
  },

  {
    clave: "tikiHut",
    ojo: { es: "Espacio 02 · techado", en: "Space 02 · covered" },
    h1: { es: "El Pabellón", en: "The Pavilion" },
    respuesta: {
      es: "El Pabellón son ~4.000 ft² techados: techo de paja a cuatro aguas sobre nueve postes de madera, abierto por los cuatro costados. Es la zona de sombra permanente del recinto y el plan anti-lluvia de la fecha, sin mover el evento de sede. Para el agua que cae recta basta solo; con viento conviene cerrar los costados.",
      en: "The Pavilion is ~4,000 sq ft of covered space: a thatched hip roof on nine timber posts, open on all four sides. It's the venue's permanent shade and your rain plan, with no need to change venues. It handles rain that falls straight down; on a windy day, you'll want to add side walls.",
    },
    title: {
      es: "El Pabellón — ~4.000 ft² techados en Wynwood | Club Wynwood",
      en: "The Pavilion — ~4,000 sq ft covered in Wynwood | Club Wynwood",
    },
    description: {
      es: "El Pabellón: ~4.000 ft² bajo techo de paja, abierto por los cuatro costados, en Wynwood, Miami. Sombra todo el día y el plan de lluvia ya construido.",
      en: "Club Wynwood's Pavilion: a ~4,000 sq ft thatched-roof space on a timber frame, open on all four sides. Permanent shade and a built-in rain plan in Wynwood, Miami.",
    },
    cifras: [
      { etiqueta: { es: "Superficie techada", en: "Covered area" }, valor: { es: "~4 000 ft²", en: "~4,000 sq ft" } },
      { etiqueta: { es: "Recinto completo", en: "Whole venue" }, valor: { es: "~22 000 ft²", en: "~22,000 sq ft" } },
      { etiqueta: { es: "Sentados (recinto completo)", en: "Seated (whole venue)" }, valor: "~300" },
    ],
    foto: {
      src: "/assets/venue-palapa.webp",
      alt: {
        es: "Bajo el pabellón: techo de paja sobre estructura de postes de madera",
        en: "Under the Pavilion: thatch roof on timber posts",
      },
      pie: {
        es: "Bajo el pabellón: paja sobre estructura de madera, abierto por los costados.",
        en: "Under the Pavilion: thatch on a timber frame, open on all sides.",
      },
    },
    bloques: [
      {
        titulo: { es: "Por qué importa en Miami", en: "Why it matters in Miami" },
        cuerpo: {
          es: "Una fecha al aire libre en Miami depende del cielo. ~4.000 ft² techados significan que el evento tiene a dónde moverse sin cancelar. La cubierta es fija y ya está ahí: para el agua que cae recta basta sola, y con viento conviene cerrar los costados. Contratado suelto, sin el jardín, es además el formato de una boda pequeña de 30 a 80: ceremonia, cena y baile bajo la misma paja.",
          en: "An outdoor event in Miami depends on the weather. With ~4,000 sq ft under a roof, your event has somewhere to go instead of being canceled. The roof is permanent and already built: it handles straight-down rain on its own, and on a windy day you'll want to add side walls. Booked on its own, without the Garden, it's also the right size for a small wedding of 30 to 80 guests: ceremony, dinner and dancing under one roof.",
        },
      },
      {
        titulo: { es: "Abierta por los costados", en: "Open on all sides" },
        cuerpo: {
          es: "No es una sala: no hay cerramiento. Eso mantiene la ventilación y la continuidad visual con el Jardín, y es la razón por la que el recinto se lee como un solo espacio y no como dos. Se contrata suelto, sin el jardín: para un evento pequeño o un Sweet 16 de menos de ~150 invitados suele ser la medida justa.",
          en: "It isn't a room: there are no walls. That keeps the air moving and the view open to the Garden, which is why the whole property feels like one space rather than two. You can book it on its own, without the Garden; for a small event or a Sweet 16 with fewer than ~150 guests, it's usually the right size.",
        },
      },
      {
        titulo: { es: "Rigging y alturas", en: "Rigging and heights" },
        cuerpo: {
          es: "La estructura es de paja sobre madera. Las alturas al alero y a cumbrera, y cualquier carga colgada, se miden y se aprueban en la visita técnica: no publicamos cotas que no hayamos levantado.",
          en: "The Pavilion's roof is thatch on a timber frame. Eave and ridge heights, and anything you want to hang from the structure, are measured and approved at the site visit. We don't publish measurements we haven't taken ourselves.",
        },
      },
    ],
  },

  {
    clave: "bodas",
    ojo: { es: "Uso · boda", en: "Use · wedding" },
    h1: { es: "Bodas", en: "Weddings" },
    respuesta: {
      es: "Club Wynwood admite bodas de hasta ~300 invitados sentados o ~600 de pie usando el recinto completo. La ceremonia va en el Jardín y la recepción bajo el pabellón, o al revés, y los ~4.000 ft² techados son el plan de lluvia sin cambiar de sede.",
      en: "Club Wynwood hosts weddings of up to ~300 seated or ~600 standing guests using the whole venue. Hold the ceremony in the Garden and the reception under the Pavilion, or the other way around. The ~4,000 sq ft covered Pavilion is also your rain plan, so you never have to change venues.",
    },
    title: {
      es: "Bodas al aire libre en Wynwood, Miami | Club Wynwood",
      en: "Outdoor weddings in Wynwood, Miami | Club Wynwood",
    },
    description: {
      es: "Venue para bodas al aire libre en Wynwood, Miami: ~22.000 ft², hasta ~300 sentados y un pabellón techado de ~4.000 ft² como plan de lluvia.",
      en: "Outdoor wedding venue in Wynwood, Miami: ~22,000 sq ft, up to ~300 seated and a ~4,000 sq ft covered pavilion as the rain plan.",
    },
    cifras: [
      { etiqueta: { es: "Sentados", en: "Seated" }, valor: "~300" },
      { etiqueta: { es: "De pie", en: "Standing" }, valor: "~600" },
      { etiqueta: { es: "Plan de lluvia", en: "Rain plan" }, valor: { es: "~4 000 ft²", en: "~4,000 sq ft" } },
    ],
    foto: {
      src: "/assets/aerea-predio.jpg",
      alt: {
        es: "Vista aérea del predio completo: el pabellón techado, el paseo central y el jardín",
        en: "Aerial view of the whole site: the covered pavilion, the central walk and the garden",
      },
      pie: {
        es: "El predio completo: pabellón, paseo central y jardín.",
        en: "The whole property: the Pavilion, the central walkway and the Garden.",
      },
    },
    bloques: [
      {
        titulo: { es: "Dos ambientes en un recinto", en: "Two settings, one site" },
        cuerpo: {
          es: "El Jardín y el Pabellón son contiguos y comparten el paseo. Eso permite separar ceremonia, cóctel y baile sin que los invitados salgan del recinto ni haya traslado. Ese reparto tiene sentido a partir de unos 80 invitados; por debajo, el recinto completo queda grande y la boda cabe en el Pabellón solo: son las bodas pequeñas de 30 a 80. La cena de ensayo tiene su propia página: la misma dirección, la noche anterior.",
          en: "The Garden and the Pavilion sit side by side and share the walkway, so you can hold the ceremony, cocktail hour and dancing in different spaces without guests ever leaving the property. That split makes sense from about 80 guests up. With fewer guests, the whole venue feels too big and the Pavilion alone is enough — see Small weddings (30 to 80 guests). The rehearsal dinner has its own page: same address, the night before.",
        },
      },
      {
        titulo: { es: "Tu planner, tus proveedores", en: "Your planner, your vendors" },
        cuerpo: {
          es: "No imponemos catering ni decoración. Trabajas con tu wedding planner y tus proveedores; nosotros entregamos el espacio. Las seis cabañas amuebladas y las mesas de picnic ya están en el jardín. El bridal shower, meses antes, cabe en el Pabellón suelto: está en la página de showers.",
          en: "We don't require a caterer or a decorator. You work with your own wedding planner and vendors; we provide the space. The six furnished cabanas and the picnic tables are already in the Garden. For the bridal shower a few months earlier, the Pavilion on its own is enough — see the showers page.",
        },
      },
      {
        titulo: { es: "Wynwood como fondo", en: "Wynwood as the backdrop" },
        cuerpo: {
          es: "2129 NW 1st Ct, a cuatro minutos a pie de Wynwood Walls. Las palmeras, la paja y los murales del barrio son el fondo real de las fotos, no un set.",
          en: "2129 NW 1st Ct, a four-minute walk from Wynwood Walls. The palms, the thatched roof and the neighborhood murals are a real backdrop for your photos, not a set.",
        },
      },
    ],
  },

  {
    clave: "corporativo",
    ojo: { es: "Uso · marca", en: "Use · brand" },
    h1: { es: "Activaciones y corporativo", en: "Brand activations and corporate events" },
    respuesta: {
      es: "Club Wynwood son ~22.000 ft² al aire libre en el Wynwood Arts District con aforo de ~600 de pie. El recinto llega vacío: la agencia monta la marca sin pelear con la decoración de nadie, sobre superficie firme y con límites claros.",
      en: "Club Wynwood offers ~22,000 sq ft of outdoor space in the Wynwood Arts District, with room for ~600 people standing. You get the venue empty, so your agency can build the brand experience without working around someone else's decor — on firm ground and within clear boundaries.",
    },
    title: {
      es: "Activaciones de marca y eventos corporativos en Wynwood | Club Wynwood",
      en: "Brand activations and corporate events in Wynwood | Club Wynwood",
    },
    description: {
      es: "Espacio para activaciones de marca y eventos corporativos en Wynwood, Miami: ~22.000 ft² al aire libre, ~600 de pie y montaje libre.",
      en: "Space for brand activations and corporate events in Wynwood, Miami: ~22,000 sq ft outdoors, room for ~600 standing, and freedom to build your own setup.",
    },
    cifras: [
      { etiqueta: { es: "De pie", en: "Standing" }, valor: "~600" },
      { etiqueta: { es: "Superficie total", en: "Total area" }, valor: { es: "~22 000 ft²", en: "~22,000 sq ft" } },
      { etiqueta: { es: "Techado", en: "Covered" }, valor: { es: "~4 000 ft²", en: "~4,000 sq ft" } },
    ],
    foto: {
      src: "/assets/aerea-predio.jpg",
      alt: {
        es: "Vista aérea del predio con el pabellón techado al centro",
        en: "Aerial view of the venue with the covered Pavilion at the center",
      },
      pie: {
        es: "~22.000 ft² de exterior, con el pabellón techado al centro.",
        en: "~22,000 sq ft outdoors, with the covered Pavilion at the center.",
      },
    },
    bloques: [
      {
        titulo: { es: "Un lienzo, no un salón", en: "A canvas, not a ballroom" },
        cuerpo: {
          es: "La razón por la que una marca elige este recinto es que no tiene estética propia que imponer. Superficie firme, límites claros y cero ambigüedad sobre qué está incluido. Si la activación es un desfile o una presentación de colección, la pasarela sobre el paseo tiene página propia: Desfiles de moda. Esta página es para marcas y empresas; si lo que buscas es un salón de fiestas para una celebración familiar, la comparación salón/jardín está en «Salón de fiestas en Miami, al aire libre».",
          en: "Brands choose this venue because it has no look of its own to impose: firm ground, clear boundaries and no doubt about what's included. If your activation is a runway show or a collection launch, see Runway shows — the walkway doubles as a runway. This page is for brands and companies; if you're looking for a party hall for a family celebration, see “Outdoor party hall rental in Miami,” which compares a hall with this garden.",
        },
      },
      {
        titulo: { es: "El barrio hace parte del brief", en: "The neighborhood is part of the brief" },
        cuerpo: {
          es: "Wynwood es contexto real, no una línea de marketing: el barrio de Art Basel, a una cuadra de los murales y a tres minutos del acceso a la I-95.",
          en: "Wynwood is real context, not a marketing line: it's the Art Basel neighborhood, one block from the murals and three minutes from I-95.",
        },
      },
      {
        titulo: { es: "Lo que decide un productor", en: "What producers need to know" },
        cuerpo: {
          es: "Potencia, load-in, ancho de portón, parking, curfew y límite de dB se levantan contigo en la visita técnica y se entregan por escrito. Preferimos eso a publicar cifras que luego no se sostengan. Si lo que traes no es una marca ni un lanzamiento sino tu propio equipo —un retiro, una jornada de trabajo fuera de la oficina—, esa es otra página: offsite de empresa.",
          en: "Power, load-in, gate width, parking, curfew and decibel limit are checked with you at the site visit and confirmed in writing. We'd rather do that than publish figures that might not hold up. If you're not bringing a brand or a launch but your own team — a retreat or a day away from the office — see Corporate offsites.",
        },
      },
    ],
  },

  {
    clave: "produccion",
    ojo: { es: "Uso · producción", en: "Use · production" },
    h1: { es: "Rodajes y producción", en: "Film and photo shoots" },
    respuesta: {
      es: "Club Wynwood es un recinto privado de ~22.000 ft² con tres texturas a pocos metros: palmeras y césped, paja sobre madera, y pavimento continuo. Hay luz natural todo el día y ~4.000 ft² de sombra fija que sirven de base o de cobertura si cambia el clima.",
      en: "Club Wynwood is a private ~22,000 sq ft location with three looks a few steps apart: palms and turf, thatch on timber, and a long paved walkway. You get natural light all day and ~4,000 sq ft of permanent shade for base camp, or for cover if the weather turns.",
    },
    title: {
      es: "Locación para rodajes y producción en Wynwood, Miami | Club Wynwood",
      en: "Film and production location in Wynwood, Miami | Club Wynwood",
    },
    description: {
      es: "Locación al aire libre en Wynwood para rodaje y fotografía: palmeras, pabellón de ~4.000 ft², césped y paseo pavimentado. ~22.000 ft² privados.",
      en: "Outdoor location in Wynwood for film and photo shoots: palms, a ~4,000 sq ft covered pavilion, turf and a paved walkway. ~22,000 sq ft, fully private.",
    },
    cifras: [
      { etiqueta: { es: "Superficie privada", en: "Private area" }, valor: { es: "~22 000 ft²", en: "~22,000 sq ft" } },
      { etiqueta: { es: "Sombra fija", en: "Permanent shade" }, valor: { es: "~4 000 ft²", en: "~4,000 sq ft" } },
      { etiqueta: { es: "Cabañas amuebladas", en: "Furnished cabanas" }, valor: "6" },
    ],
    foto: {
      src: "/assets/venue-exterior.webp",
      alt: {
        es: "Palmeras, césped y paseo pavimentado en el mismo encuadre",
        en: "Palms, turf and the paved walkway in one frame",
      },
      pie: {
        es: "Palmeras, césped y paseo pavimentado en el mismo encuadre.",
        en: "Palms, turf and the paved walkway in one frame.",
      },
    },
    bloques: [
      {
        titulo: { es: "Tres texturas, un recinto", en: "Three looks, one location" },
        cuerpo: {
          es: "Dos hileras de palmeras reales, un techo de paja a cuatro aguas y un paseo pavimentado de extremo a extremo. Se cambia de fondo caminando, sin mover la unidad a otra locación.",
          en: "Two rows of real palms, a thatched hip roof and a paved walkway that runs end to end. You change backdrops by walking a few steps, not by moving the unit to another location.",
        },
      },
      {
        titulo: { es: "Sombra sin carpa", en: "Shade without a tent" },
        cuerpo: {
          es: "El pabellón da ~4.000 ft² de sombra continua: sirve de base, de comedor o de cobertura si cambia el clima, sin sumar estructura al presupuesto.",
          en: "The Pavilion gives you ~4,000 sq ft of continuous shade for base camp, crew meals or cover if the weather turns, with no tent to add to the budget.",
        },
      },
      {
        titulo: { es: "Permisos y horarios", en: "Permits and hours" },
        cuerpo: {
          es: "Curfew, límite de dB, parking de unidad y ancho de portón para carga se confirman en la visita técnica y quedan por escrito antes de firmar.",
          en: "Curfew, decibel limit, parking for your trucks and gate width for load-in are confirmed at the site visit and put in writing before you sign.",
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
      en: "Before you pick a venue in Wynwood, settle six things: how many guests, your rain plan, how much power your production needs, where the truck loads in, how late the music can run, and who runs the bar. This page is that checklist, in the order you should ask.",
    },
    title: {
      es: "Cómo organizar un evento en Wynwood, Miami — la lista de preguntas | Club Wynwood",
      en: "How to host an event in Wynwood, Miami — the checklist | Club Wynwood",
    },
    description: {
      es: "Las seis preguntas que hacerle a un venue de Wynwood antes de reservar: aforo, lluvia, potencia, carga, curfew y barra. Y lo que respondemos nosotros.",
      en: "The six questions to ask any Wynwood venue before booking — capacity, rain plan, power, load-in, curfew and bar — and how we answer them.",
    },
    cifras: [
      { etiqueta: { es: "Preguntas", en: "Questions" }, valor: "6" },
      { etiqueta: { es: "Se responden en", en: "Answered in" }, valor: { es: "1 visita", en: "1 site visit" } },
      { etiqueta: { es: "Por escrito", en: "In writing" }, valor: { es: "Sí", en: "Yes" } },
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
          en: "This comes first because it changes everything else. A venue that holds 600 people standing doesn't hold 600 seated: with round tables and a dance floor, the same space fits about half. Always ask for both numbers, and ask for the capacity with YOUR layout, not the theoretical maximum. Here it's ~600 standing and ~300 seated using the whole venue.",
        },
      },
      {
        titulo: { es: "2. ¿Qué pasa si llueve?", en: "2. What happens if it rains?" },
        cuerpo: {
          es: "En Miami esta pregunta no es opcional. Hay tres respuestas posibles y solo una es buena: «hay cubierta fija», «se alquila carpa» (súmalo al presupuesto y comprueba que cabe) o «se reprograma» (que no es un plan). Pregunta cuántos ft² están techados de verdad, no si «hay una zona cubierta». Aquí son ~4.000 ft² de pabellón fijo.",
          en: "In Miami this question isn't optional. There are three possible answers and only one is good: “there's a permanent roof,” “you rent a tent” (add it to the budget and make sure it fits) or “we reschedule” (which isn't a plan). Ask how many square feet are actually covered, not just whether “there's a covered area.” Here it's ~4,000 sq ft of permanent roof.",
        },
      },
      {
        titulo: { es: "3. ¿Cuánta potencia hay, y de qué tipo?", en: "3. How much power, and what kind?" },
        cuerpo: {
          es: "No basta con «sí hay luz». Tu proveedor de sonido e iluminación necesita amperaje y fase, y si el recinto no lo tiene, entra un generador —que cuesta, hace ruido y necesita sitio—. Pide el dato por escrito antes de firmar. Si un venue no te lo sabe decir, es que nadie lo ha medido.",
          en: "“Yes, there's power” isn't enough. Your sound and lighting vendor needs the amperage and phase, and if the venue doesn't have enough, you need a generator — which costs money, makes noise and takes up space. Get the numbers in writing before you sign. If a venue can't tell you, nobody has measured it.",
        },
      },
      {
        titulo: { es: "4. ¿Por dónde entra el camión?", en: "4. Where does the truck load in?" },
        cuerpo: {
          es: "El ancho del portón decide si tu producción entra rodando o a mano, y eso son horas de montaje y dinero. Pregunta ancho libre, si hay drive-in, y a qué hora se puede empezar a descargar. En Wynwood, además, la calle importa: no todas admiten un camión parado.",
          en: "The gate width decides whether your production rolls in or gets carried in by hand, and that means hours of load-in and money. Ask for the clear width, whether trucks can drive in, and what time you can start unloading. In Wynwood the street matters too: not every street lets a truck park.",
        },
      },
      {
        titulo: { es: "5. ¿Hasta qué hora, y con cuántos decibelios?", en: "5. How late, and how loud?" },
        cuerpo: {
          es: "Curfew y límite de dB son dos cosas distintas y las dos te pueden cortar la fiesta. Wynwood es un barrio con vivienda, así que pregunta las dos por escrito y confirma quién responde si aparece una queja. Un venue que no tiene clara esta respuesta te está pasando el riesgo a ti.",
          en: "Curfew and decibel limit are two different things, and either one can end your party. Wynwood has residents, so get both in writing and confirm who handles it if a neighbor complains. A venue that isn't clear about this is passing the risk on to you.",
        },
      },
      {
        titulo: { es: "6. ¿Quién pone la barra?", en: "6. Who provides the bar?" },
        cuerpo: {
          es: "Hay tres modelos: el venue tiene licencia y vende, el venue te obliga a su proveedor, o traes tu barra con tu licencia. Cambian el presupuesto y el margen por completo. Pregúntalo antes de enamorarte del sitio, porque es donde más se rompen las cuentas.",
          en: "There are three models: the venue has a license and sells the drinks, the venue requires you to use its supplier, or you bring your own bar under your own license. Each one changes your budget and margins completely. Ask before you fall in love with a venue, because this is where budgets most often fall apart.",
        },
      },
      {
        titulo: { es: "Cómo respondemos nosotros", en: "How we answer" },
        cuerpo: {
          es: "Las dos primeras están publicadas en este sitio con sus cifras. Las cuatro siguientes —potencia, load-in, curfew y barra— se revisan contigo el día de la visita y te las mandamos por escrito. No las publicamos porque no las hemos medido nosotros, y preferimos eso a poner un número que luego no se sostenga.",
          en: "The first two answers are published on this site with their numbers. The other four — power, load-in, curfew and bar — are reviewed with you at the site visit and sent to you in writing. We don't publish them yet because we haven't measured them ourselves, and we'd rather do that than post a number that might not hold up.",
        },
      },
    ],
  },

  {
    clave: "quinces",
    ojo: { es: "Uso · quinceañera", en: "Use · quinceañera" },
    h1: { es: "Quinceañeras", en: "Quinceañeras" },
    respuesta: {
      es: "El recinto admite hasta ~300 invitados sentados, con la entrada y el vals en el jardín y la cena y el baile bajo el pabellón techado de ~4.000 ft². Los ~4.000 ft² cubiertos son además el plan de lluvia, así que la fecha no depende del cielo de Miami.",
      en: "The venue holds up to ~300 seated guests, with the grand entrance and the waltz in the Garden and dinner and dancing under the ~4,000 sq ft covered Pavilion. That covered space is also your rain plan, so the date doesn't depend on Miami weather.",
    },
    title: {
      es: "Salón para quinceañeras en Wynwood, Miami — hasta 300 invitados | Club Wynwood",
      en: "Quinceañera venue in Wynwood, Miami — up to 300 guests | Club Wynwood",
    },
    description: {
      es: "Venue al aire libre para quinceañeras en Wynwood, Miami: hasta ~300 sentados, jardín para la entrada y el vals, y ~4.000 ft² techados para la cena.",
      en: "Open-air quinceañera venue in Wynwood, Miami: up to ~300 seated, a garden for the grand entrance and the waltz, and ~4,000 sq ft of covered space for dinner and dancing.",
    },
    cifras: [
      { etiqueta: { es: "Sentados", en: "Seated" }, valor: "~300" },
      { etiqueta: { es: "Bajo techo", en: "Covered" }, valor: { es: "~4 000 ft²", en: "~4,000 sq ft" } },
      { etiqueta: { es: "Cabañas", en: "Cabanas" }, valor: "6" },
    ],
    foto: {
      src: "/assets/venue-exterior.webp",
      alt: {
        es: "El paseo pavimentado entre palmeras, recorrido de entrada para una quinceañera",
        en: "The paved walkway between the palms, a ready-made entrance aisle for a quinceañera",
      },
      pie: {
        es: "El paseo central entre las dos hileras de palmeras.",
        en: "The central walkway between two rows of palms.",
      },
    },
    bloques: [
      {
        titulo: { es: "La entrada tiene recorrido", en: "The grand entrance is already built" },
        cuerpo: {
          es: "El paseo pavimentado recorre el jardín de la puerta del edificio al estacionamiento, 15 × 108 ft entre dos hileras de palmeras reales. Es un pasillo de entrada que ya existe: no hay que montarlo ni alfombrarlo, y las fotos salen con las palmeras, el cielo abierto y el techo de paja del pabellón de fondo, no con una pared. Los murales del barrio quedan a cuatro minutos a pie, en Wynwood Walls. Es el mismo paseo que en los desfiles de moda hace de pasarela; aquí es pasillo de entrada, sin tarima ni backstage.",
          en: "The paved walkway runs from the building door to the parking lot: 15 by 108 ft between two rows of real palms. It's a ready-made entrance aisle — nothing to build, no runner to roll out — and your photos get palms, open sky and the Pavilion's thatched roof in the background instead of a wall. The Wynwood Walls murals are a four-minute walk away. The same walkway works as a runway for fashion shows; here it's simply the entrance aisle, with no stage and no backstage.",
        },
      },
      {
        titulo: { es: "Cena y baile bajo techo", en: "Dinner and dancing under cover" },
        cuerpo: {
          es: "El pabellón de ~4.000 ft² cubre la parte sentada del evento. Eso resuelve dos cosas a la vez: la lluvia y el sol de Miami a las cinco de la tarde. Las seis cabañas amuebladas del jardín funcionan como zonas de descanso para los invitados mayores. Si la fiesta es un Sweet 16 —de pie, con DJ y sin vals— y son menos de ~150 invitados, la página de Sweet 16 explica cuándo basta con el Pabellón solo.",
          en: "The ~4,000 sq ft Pavilion covers the seated part of the event, which solves two problems at once: rain and the late-afternoon Miami sun. The six furnished cabanas in the Garden give older guests a place to rest. If the party is a Sweet 16 — standing, with a DJ and no waltz — with fewer than ~150 guests, the Sweet 16 page explains when the Pavilion alone is enough.",
        },
      },
      {
        titulo: { es: "Tu decoración, sin competencia", en: "Your decor, with nothing to compete with" },
        cuerpo: {
          es: "El recinto no tiene una estética propia que imponer. Eso importa en una quinceañera más que en ningún otro evento: el color y el montaje los pone la familia o su decorador, y aquí no hay moqueta ni lámparas ni un salón que pelee con ellos. Si la fiesta no es una quinceañera —un cumpleaños, un aniversario, una celebración familiar—, la comparación entre un salón de fiestas y este jardín está en «Salón de fiestas en Miami, al aire libre».",
          en: "The venue has no look of its own to impose. That matters more at a quinceañera than at almost any other event: the colors and the setup come from the family or their decorator, and here there's no carpet, no chandeliers and no ballroom decor competing with them. If the party isn't a quinceañera — a birthday, an anniversary, a family celebration — see “Outdoor party hall rental in Miami,” which compares a banquet hall with this garden.",
        },
      },
    ],
  },

  {
    clave: "aforos",
    ojo: { es: "Ficha · aforo", en: "Specs · capacity" },
    h1: { es: "Aforo y montajes", en: "Capacity and layouts" },
    respuesta: {
      es: "Club Wynwood admite ~600 personas de pie o ~300 sentadas usando el recinto completo de ~22.000 ft². La diferencia no es un truco: con mesas redondas, pista y servicio, la misma superficie rinde aproximadamente la mitad. El aforo con tu montaje concreto se confirma en la visita técnica.",
      en: "Club Wynwood holds ~600 people standing or ~300 seated across the whole ~22,000 sq ft venue. The difference isn't a trick: once you add round tables, a dance floor and service aisles, the same space fits roughly half as many people. Capacity for your specific layout is confirmed at the site visit.",
    },
    title: {
      es: "Aforo: cuánta gente cabe — 600 de pie, 300 sentados | Club Wynwood",
      en: "Capacity: how many people fit — 600 standing, 300 seated | Club Wynwood",
    },
    description: {
      es: "Cuánta gente cabe en Club Wynwood: ~600 de pie o ~300 sentados en ~22.000 ft². Cómo cambia el aforo según el montaje y por qué las dos cifras son tan distintas.",
      en: "How many people fit at Club Wynwood: ~600 standing or ~300 seated across ~22,000 sq ft, and how the layout changes both figures.",
    },
    cifras: [
      { etiqueta: { es: "De pie", en: "Standing" }, valor: "~600" },
      { etiqueta: { es: "Sentados", en: "Seated" }, valor: "~300" },
      { etiqueta: { es: "Superficie", en: "Area" }, valor: { es: "~22 000 ft²", en: "~22,000 sq ft" } },
    ],
    foto: {
      src: "/assets/aerea-predio.jpg",
      alt: {
        es: "Vista aérea del recinto completo, con el pabellón techado y el jardín",
        en: "Aerial view of the whole site, with the covered pavilion and the garden",
      },
      pie: {
        es: "El recinto completo: ~22.000 ft² entre jardín y pabellón.",
        en: "The whole venue: ~22,000 sq ft between the Garden and the Pavilion.",
      },
    },
    bloques: [
      {
        titulo: { es: "Por qué 600 y 300 son tan distintos", en: "Why 600 and 300 are so different" },
        cuerpo: {
          es: "Una persona de pie en un cóctel ocupa alrededor de un tercio de lo que ocupa sentada en una mesa redonda con su silla, su parte de mesa y el pasillo del servicio. Añade pista de baile, escenario y barra y la superficie útil baja otra vez. Por eso ningún venue serio te da una sola cifra.",
          en: "A standing guest at a cocktail party takes up roughly a third of the space of a guest seated at a round table, once you count their share of the table and the service aisle. Add a dance floor, a stage and a bar, and the usable space shrinks again. That's why no serious venue gives you a single number.",
        },
      },
      {
        titulo: { es: "Por separado o combinado", en: "Separately or combined" },
        cuerpo: {
          es: "El Jardín (~18.000 ft²) y el Pabellón (~4.000 ft²) se alquilan sueltos o juntos. Las cifras de ~600 y ~300 son del recinto completo; si contratas solo uno de los dos, el aforo baja en proporción a la superficie que uses. Son contiguos y comparten el paseo, así que combinados funcionan como un solo recinto. Una fiesta de pie con DJ —un Sweet 16, por ejemplo— usa la superficie de otra manera que un banquete, y por eso se mide contra la cifra de pie, no contra la de sentados. Si llegaste buscando un salón de fiestas, la comparación entre un salón y este jardín —entradas, licencia de licor, cocina— está en la página «Salón de fiestas en Miami, al aire libre»; aquí solo el aforo.",
          en: "The Garden (~18,000 sq ft) and the Pavilion (~4,000 sq ft) can be rented separately or together. The ~600 and ~300 figures are for the whole venue; if you book only one space, capacity drops in proportion. The two spaces sit side by side and share the walkway, so together they work as one venue. A standing party with a DJ — a Sweet 16, for example — uses space differently from a banquet, so it's measured against the standing figure, not the seated one. If you're comparing us with a banquet hall — entrances, liquor license, kitchen — see “Outdoor party hall rental in Miami.” This page covers capacity only.",
        },
      },
      {
        titulo: { es: "Lo que falta medir", en: "What still needs measuring" },
        cuerpo: {
          es: "El aforo por montaje —el tuyo, con tu plano— se levanta en la visita técnica junto con la potencia, el load-in, el parking y el curfew, y se entrega por escrito. Las cifras de esta página son aproximaciones del propietario, no medición topográfica, y están marcadas con «~» en toda la ficha.",
          en: "Capacity for your layout — with your own floor plan — is confirmed at the site visit, along with power, load-in, parking and curfew, and sent to you in writing. The figures on this page are the owner's estimates, not measurements, which is why they carry a “~” throughout the spec sheet.",
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
      en: "A pop-up in Wynwood needs three things: firm ground to build on, foot traffic that's already in the neighborhood, and cover so a rainy Saturday doesn't sink the day. Here you get ~22,000 sq ft with a paved walkway running end to end and ~4,000 sq ft under a roof, one block from the murals.",
    },
    title: {
      es: "Espacio para pop-ups y mercados en Wynwood, Miami | Club Wynwood",
      en: "Pop-up and market space in Wynwood, Miami | Club Wynwood",
    },
    description: {
      es: "Recinto al aire libre para pop-ups y mercados en Wynwood: ~22.000 ft², paseo pavimentado para montar módulos y ~4.000 ft² techados. Junto a Wynwood Walls.",
      en: "Open-air space for pop-ups and markets in Wynwood: ~22,000 sq ft, a paved walkway to line with vendor booths, and ~4,000 sq ft under a roof. A four-minute walk from Wynwood Walls.",
    },
    cifras: [
      { etiqueta: { es: "Superficie", en: "Area" }, valor: { es: "~22 000 ft²", en: "~22,000 sq ft" } },
      { etiqueta: { es: "A Wynwood Walls", en: "To Wynwood Walls" }, valor: "4 min" },
      { etiqueta: { es: "De pie", en: "Standing" }, valor: "~600" },
    ],
    foto: {
      src: "/assets/venue-exterior.webp",
      alt: {
        es: "Paseo pavimentado entre palmeras, apto para montar módulos de un mercado",
        en: "The paved walkway between the palms, ready for vendor booths",
      },
      pie: {
        es: "El paseo pavimentado recorre el recinto de extremo a extremo.",
        en: "The paved walkway runs the length of the property.",
      },
    },
    bloques: [
      {
        titulo: { es: "El paseo es el eje del montaje", en: "The walkway is the backbone of your layout" },
        cuerpo: {
          /* Decía «césped a los dos lados» en los dos idiomas, que es la
             redacción anterior al 7-sep: a un lado hay césped y al otro arena,
             y para un mercado la diferencia importa —un módulo con patas no se
             planta igual sobre arena—. */
          es: "Un mercado se ordena a lo largo de un recorrido, y aquí ya existe: pavimento continuo de la puerta al estacionamiento, con césped a un lado y arena al otro para los módulos. No hay que resolver piso ni trazar circulación desde cero, y eso son horas de montaje que no pagas.",
          en: "A market is laid out along a path, and here the path already exists: continuous paving from the door to the parking lot, with turf on one side and sand on the other for vendor booths. There's no flooring to install and no traffic flow to design from scratch, which means fewer load-in hours to pay for.",
        },
      },
      {
        titulo: { es: "El público ya está en la calle", en: "The audience is already outside" },
        cuerpo: {
          es: "2129 NW 1st Ct está a cuatro minutos a pie de Wynwood Walls. La diferencia entre un pop-up en un polígono y uno aquí es que en Wynwood la gente ya salió a caminar el barrio: el tráfico peatonal del fin de semana no hay que comprarlo con pauta.",
          en: "2129 NW 1st Ct is a four-minute walk from Wynwood Walls. The difference between a pop-up in an industrial park and one here is that people in Wynwood are already out walking: you don't have to buy weekend foot traffic with ads.",
        },
      },
      {
        titulo: { es: "El sábado no depende del cielo", en: "Saturday doesn't depend on the weather" },
        cuerpo: {
          es: "Un mercado se cae con la lluvia y no se reprograma: los expositores ya vinieron. Los ~4.000 ft² de pabellón fijo permiten concentrar los módulos bajo techo si cambia el tiempo, sin carpas de última hora ni devolver el día.",
          en: "A market can't survive a downpour, and it can't be rescheduled: the vendors have already shown up. The ~4,000 sq ft permanent roof lets you move booths under cover if the weather turns, with no last-minute tents and no refunds.",
        },
      },
      {
        titulo: { es: "Lo que hay que preguntar antes", en: "What to ask in advance" },
        cuerpo: {
          es: "Para un mercado con muchos expositores importan tres datos que se levantan en la visita: la potencia disponible y cómo se reparte, el ancho de portón para la carga de todos, y el horario de descarga. Te los damos por escrito antes de firmar.",
          en: "For a market with many vendors, three numbers matter, and all three are checked at the site visit: how much power is available and how it can be split, the gate width for everyone's load-in, and the unloading hours. You get them in writing before you sign.",
        },
      },
    ],
  },

  {
    clave: "graduaciones",
    ojo: { es: "Uso · graduación", en: "Use · graduation" },
    h1: { es: "Graduaciones", en: "Graduations" },
    respuesta: {
      es: "El recinto admite ~300 invitados sentados o ~600 de pie, que cubre desde una promoción entera hasta una fiesta de familia. La ceremonia o los discursos van en el jardín, la cena bajo el pabellón techado, y los ~4.000 ft² cubiertos resuelven la lluvia de mayo y junio en Miami.",
      en: "The venue holds ~300 seated or ~600 standing guests — enough for anything from a whole graduating class to a family party. Hold the ceremony or speeches in the Garden and dinner under the covered Pavilion; its ~4,000 sq ft roof handles Miami's May and June rain.",
    },
    title: {
      es: "Venue para graduaciones en Wynwood, Miami — hasta 600 invitados | Club Wynwood",
      en: "Graduation venue in Wynwood, Miami — up to 600 guests | Club Wynwood",
    },
    description: {
      es: "Espacio al aire libre para fiestas de graduación en Wynwood, Miami: ~600 de pie o ~300 sentados, con pabellón techado de ~4.000 ft² como plan de lluvia.",
      en: "Open-air space for graduation parties in Wynwood, Miami: ~600 standing or ~300 seated, with a ~4,000 sq ft covered pavilion as the rain plan.",
    },
    cifras: [
      { etiqueta: { es: "De pie", en: "Standing" }, valor: "~600" },
      { etiqueta: { es: "Sentados", en: "Seated" }, valor: "~300" },
      { etiqueta: { es: "Techado", en: "Covered" }, valor: { es: "~4 000 ft²", en: "~4,000 sq ft" } },
    ],
    foto: {
      src: "/assets/aerea-predio.jpg",
      alt: {
        es: "Vista aérea del recinto completo, con el pabellón techado y el jardín",
        en: "Aerial view of the whole site, with the covered pavilion and the garden",
      },
      pie: {
        es: "El recinto completo, con el pabellón al centro.",
        en: "The whole property, with the Pavilion at the center.",
      },
    },
    bloques: [
      {
        titulo: { es: "Mayo y junio llueve", en: "It rains in May and June" },
        cuerpo: {
          es: "La temporada de graduaciones en Miami coincide con el principio de la de lluvias. Una fiesta al aire libre en esas fechas necesita un plan B que no sea «cruzamos los dedos»: aquí son ~4.000 ft² de cubierta fija, sin carpa y sin cambiar de sede.",
          en: "Graduation season in Miami overlaps with the start of the rainy season. An outdoor party in those weeks needs a better plan B than “fingers crossed”: here it's ~4,000 sq ft of permanent roof, with no tent and no change of venue.",
        },
      },
      {
        titulo: { es: "Discursos fuera, cena dentro", en: "Speeches outside, dinner under cover" },
        cuerpo: {
          es: "Los dos espacios son contiguos y comparten el paseo, así que se puede hacer la parte de pie —discursos, fotos, brindis— en el jardín y pasar a la cena bajo techo sin que nadie salga del recinto. Eso ahorra el momento muerto que suele romper el ritmo.",
          en: "The two spaces sit side by side and share the walkway, so you can do the standing part — speeches, photos, toasts — in the Garden and then move to a seated dinner under the Pavilion without anyone leaving the property. That removes the awkward gap that usually breaks the flow of the night.",
        },
      },
      {
        titulo: { es: "Tu proveedor, tu presupuesto", en: "Your supplier, your budget" },
        cuerpo: {
          es: "No hay catering obligatorio ni proveedor impuesto. En una graduación, donde el presupuesto suele salir de varias familias, poder elegir quién sirve y a qué precio cambia la cuenta entera.",
          en: "There's no mandatory caterer and no required vendor. At a graduation, where several families often split the cost, being able to choose your caterer and your price changes the whole budget.",
        },
      },
    ],
  },

  {
    clave: "pequenos",
    ojo: { es: "Uso · evento pequeño", en: "Use · small event" },
    h1: { es: "Eventos pequeños", en: "Small events" },
    respuesta: {
      es: "Sí se puede alquilar solo una parte. El Pabellón son ~4.000 ft² techados que se contratan sueltos, sin el jardín, y esa es la medida que encaja con un bautizo, un cumpleaños íntimo o una comida de familia de 50 a 150 invitados. Contratar los ~22.000 ft² completos para eso no tiene sentido y no lo recomendamos.",
      en: "Yes, you can rent just one part. The Pavilion — ~4,000 sq ft under a roof — can be booked on its own, without the Garden, and it's the right size for a christening, an intimate birthday or a family lunch of 50 to 150 guests. Renting the full ~22,000 sq ft for that makes no sense, and we don't recommend it.",
    },
    title: {
      es: "Eventos pequeños en Wynwood: alquilar solo el Pabellón | Club Wynwood",
      en: "Small events in Wynwood: renting just the Pavilion | Club Wynwood",
    },
    description: {
      es: "Para bautizos, cumpleaños íntimos y reuniones de 50 a 150 invitados se alquila solo el Pabellón: ~4.000 ft² techados en Wynwood, sin contratar el jardín entero.",
      en: "For christenings, intimate birthdays and gatherings of 50 to 150 guests, rent just the Pavilion: ~4,000 sq ft under roof in Wynwood, not the whole garden.",
    },
    cifras: [
      { etiqueta: { es: "Solo el Pabellón", en: "Pavilion only" }, valor: { es: "~4 000 ft²", en: "~4,000 sq ft" } },
      { etiqueta: { es: "Invitados", en: "Guests" }, valor: "50–150" },
      { etiqueta: { es: "Techado", en: "Covered" }, valor: "100%" },
    ],
    foto: {
      src: "/assets/venue-palapa.webp",
      alt: {
        es: "Bajo el pabellón: techo de paja sobre postes de madera, abierto por los costados",
        en: "Under the Pavilion: thatch roof on timber posts, open on the sides",
      },
      pie: {
        es: "El Pabellón se alquila suelto, sin el jardín.",
        en: "The Pavilion can be booked on its own, without the Garden.",
      },
    },
    bloques: [
      {
        titulo: { es: "Por qué no alquilarlo todo", en: "Why not book the whole venue" },
        cuerpo: {
          es: "Un evento de 80 personas en ~22.000 ft² se ve vacío, y además pagas superficie que no usas. Con solo el Pabellón el grupo queda reunido bajo techo, la conversación funciona y el presupuesto se va a comida y decoración en vez de a metros cuadrados. Una fiesta de compromiso o una cena de ensayo de ese tamaño entran aquí; si lo que se organiza es el fin de semana de boda entero, con dos noches seguidas, eso está en la página de la cena de ensayo. Si lo que se celebra es la boda misma, con 30 a 80 invitados, tiene página propia: bodas pequeñas de 30 a 80. Vale igual para un Sweet 16 de menos de ~150 invitados; la página de Sweet 16 lo desarrolla con el formato de pie y con DJ. A partir de 150 invitados la cuenta se invierte: un cumpleaños de adulto grande, de noche, es el recinto entero, y eso lo cuenta la página de cumpleaños de adulto. A partir de unos 150 sentados, cuando hacen falta el jardín y el pabellón juntos, la comparación con un salón de fiestas tiene su propia página: «Salón de fiestas en Miami, al aire libre».",
          en: "An 80-person event in ~22,000 sq ft looks empty, and you'd be paying for space you don't use. With just the Pavilion, the group stays together under one roof, conversation flows, and the budget goes to food and decor instead of square footage. It's the right size for an engagement party, a rehearsal dinner, a small wedding of 30 to 80 guests or a Sweet 16 with fewer than ~150 guests — each one has its own page. From about 150 guests up, it makes sense to book the whole venue.",
        },
      },
      {
        titulo: { es: "Techado y abierto a la vez", en: "Covered and open at once" },
        cuerpo: {
          es: "El pabellón tiene techo de paja pero no tiene paredes: está abierto por los cuatro costados. Para un evento de día eso significa sombra sin encierro y sin aire acondicionado, que es exactamente lo que se busca en un bautizo o un almuerzo de cumpleaños a mediodía. Si lo que organizas es un bridal shower o un baby shower, la página de showers cuenta ese montaje de mediodía. Vale igual para una empresa: un equipo de hasta 150 personas cabe bajo el Pabellón suelto; si la jornada necesita zonificar el jardín entero, mira la página de offsite de empresa.",
          en: "The Pavilion has a thatched roof but no walls: it's open on all four sides. For a daytime event, that means shade without feeling shut in and without air conditioning — exactly what a midday christening or birthday lunch needs. The same setup works for a bridal or baby shower (see the showers page) or for a company team of up to 150; if your day needs the whole Garden, see Corporate offsites.",
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
          es: "Las seis cabañas amuebladas están en el jardín, junto al pabellón. Son fijas: van con el inmueble y no se mueven, así que cuentan en el plano de montaje aunque solo alquiles el Pabellón. Para un evento con niños o con gente mayor son la zona de descanso que suele faltar.",
          en: "The six furnished cabanas sit in the Garden, a few steps from the Pavilion. They're fixed and come with the property. If you add the Garden to your booking, they become the lounge area that events with children or older guests usually lack.",
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
      en: "Miami Art Week 2026 runs from November 30 to December 6, and we have open dates. The venue is inside the Arts District, three blocks from Mana Wynwood (home to Red Dot and Spectrum) and a four-minute walk from Wynwood Walls: ~22,000 sq ft outdoors, ~4,000 of them covered, room for ~600 standing, on-site parking and its own liquor license.",
    },
    title: {
      es: "Venue para Miami Art Week 2026 en Wynwood · fechas abiertas | Club Wynwood",
      en: "Miami Art Week 2026 venue in Wynwood · open dates | Club Wynwood",
    },
    description: {
      es: "Recinto al aire libre de ~22.000 ft² en Wynwood con fechas abiertas para Miami Art Week 2026, del 30 de noviembre al 6 de diciembre. A tres cuadras de Mana.",
      en: "A ~22,000 sq ft open-air site in Wynwood with open dates for Miami Art Week 2026, November 30 to December 6. Three blocks from Mana Wynwood.",
    },
    cifras: [
      { etiqueta: { es: "Miami Art Week 2026", en: "Miami Art Week 2026" }, valor: { es: "30 nov – 6 dic", en: "Nov 30 – Dec 6" } },
      { etiqueta: { es: "A Mana Wynwood", en: "To Mana Wynwood" }, valor: { es: "3 cuadras", en: "3 blocks" } },
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
        en: "An evening activation on site, in the heart of the Wynwood Arts District.",
      },
    },
    bloques: [
      {
        titulo: { es: "El barrio no es decorado", en: "The neighborhood isn't just a backdrop" },
        cuerpo: {
          es: "En diciembre medio Miami se disfraza de Wynwood. La diferencia de estar dentro del Arts District es que el público que te interesa ya viene caminando: en la semana del arte la gente recorre el barrio a pie entre galerías, murales y activaciones, y estar a cuatro minutos de Wynwood Walls te pone en ese recorrido.",
          en: "In December, half of Miami wants to be in Wynwood. Being inside the Arts District means the audience you want is already on foot: during Art Week, people walk between galleries, murals and activations, and being four minutes from Wynwood Walls puts you right on that route.",
        },
      },
      {
        titulo: { es: "Un recinto sin estética propia", en: "A venue with no look of its own" },
        cuerpo: {
          es: "Una instalación de arte o una activación de marca en Art Week viene con su propio lenguaje visual. Un salón con moqueta, lámparas y paredes tratadas pelea con eso. Aquí hay superficie firme, límites claros y nada que discuta con lo que montes.",
          en: "An art installation or a brand activation during Art Week comes with its own visual language, and a ballroom with carpet, chandeliers and finished walls fights it. Here you get firm ground, clear boundaries and nothing competing with what you build.",
        },
      },
      {
        titulo: { es: "Diciembre también llueve", en: "It can rain in December too" },
        cuerpo: {
          es: "La semana del arte cae en temporada seca, pero un aguacero de tarde en Miami no avisa. Los ~4.000 ft² de pabellón fijo permiten mover la parte crítica bajo techo sin desmontar la instalación ni alquilar carpa a precio de diciembre.",
          en: "Art Week falls in the dry season, but an afternoon downpour in Miami comes without warning. The ~4,000 sq ft permanent roof lets you move the key part of your event under cover without taking down the installation or renting a tent at December prices.",
        },
      },
      {
        titulo: { es: "Las ferias que traen al público están al lado", en: "The fairs that draw the crowds are next door" },
        cuerpo: {
          es: "Red Dot y Spectrum se montan en Mana Wynwood, a tres cuadras, del 2 al 6 de diciembre; NADA ocupa Ice Palace, en el borde del barrio, del 1 al 5. Eso significa que el coleccionista y el galerista que salen de la feria ya están caminando por aquí. Las fiestas y activaciones que funcionaron en el barrio el año pasado fueron justo de este formato: lote abierto, DJ, barra y montaje propio.",
          en: "Red Dot and Spectrum set up at Mana Wynwood, three blocks away, from December 2 to 6, and NADA is at Ice Palace, on the edge of the neighborhood, from December 1 to 5. So the collectors and gallerists leaving the fairs are already on this street. The parties and activations that worked here last year used exactly this format: an open lot, a DJ, a bar and your own build.",
        },
      },
      {
        titulo: { es: "Del 30 de noviembre al 6 de diciembre, con fechas abiertas", en: "November 30 to December 6, with open dates" },
        cuerpo: {
          es: "Miami Art Week 2026 va del 30 de noviembre al 6 de diciembre, con Art Basel Miami Beach del 4 al 6. Es la semana más disputada del año en el barrio y todavía quedan fechas. Hay un plazo que sí manda: la City of Miami cierra las solicitudes de permiso de evento especial para esa semana el 11 de octubre, así que si tu activación necesita permiso, la conversación útil es ahora. Escríbenos con la fecha y el aforo y te decimos disponibilidad real. Si lo tuyo es la otra semana grande del año, un desfile satélite de Miami Swim Week, tiene página propia: Desfiles de moda.",
          en: "Miami Art Week 2026 runs from November 30 to December 6, with Art Basel Miami Beach from December 4 to 6. It's the busiest week of the year in this neighborhood, and we still have dates. One deadline matters: the City of Miami closes special-event permit applications for that week on October 11, so if your activation needs a permit, now is the time to talk. Send us your date and guest count and we'll reply with real availability. Planning a Miami Swim Week satellite show instead? See Runway shows.",
        },
      },
      {
        titulo: { es: "Barra propia, estacionamiento propio", en: "A liquor license and on-site parking" },
        cuerpo: {
          es: "El recinto tiene licencia de licor propia, con su número de licencia, cosa que no todos los espacios de la zona pueden decir, y hay área donde montar barra. Y hay estacionamiento en el propio predio, al este y al sur, que en esa semana y en este barrio deja de ser un detalle. La carga entra por su propia puerta, aparte de la de los invitados.",
          en: "The venue holds its own liquor license — not every space in the area can say that — and there's an area to set up a bar. There's also on-site parking to the east and south, which during Art Week in this neighborhood is no small detail. Freight comes in through its own gate, separate from the guest entrance.",
        },
      },
    ],
  },

  {
    clave: "finDeAno",
    ojo: { es: "Uso · fin de año", en: "Use · holiday party" },
    h1: { es: "Fiesta de fin de año de empresa", en: "Company holiday party" },
    respuesta: {
      es: "Una cena de empresa de 100 a 300 personas cabe sentada bajo el pabellón techado, con el jardín para el cóctel de llegada y los discursos. Diciembre en Miami se hace al aire libre —es de los mejores meses— y los ~4.000 ft² cubiertos quitan el riesgo de la lluvia sin encerrar a nadie.",
      en: "A holiday party for 100 to 300 people: welcome cocktails and speeches in the Garden, and dinner under the covered Pavilion. Seated capacity for your layout is confirmed at the site visit. December is one of the best months to be outdoors in Miami, and the ~4,000 sq ft roof takes away the rain risk without shutting anyone indoors.",
    },
    title: {
      es: "Fiesta de fin de año de empresa en Wynwood, Miami | Club Wynwood",
      en: "Company holiday party venue in Wynwood, Miami | Club Wynwood",
    },
    description: {
      es: "Venue al aire libre para la fiesta de fin de año de tu empresa en Wynwood: cóctel en el jardín, cena sentada bajo el pabellón techado, de 100 a 300 personas.",
      en: "Open-air venue for your company holiday party in Wynwood: cocktails in the garden, seated dinner under the covered pavilion, 100 to 300 people.",
    },
    cifras: [
      { etiqueta: { es: "Cena sentada", en: "Seated dinner" }, valor: "100–300" },
      { etiqueta: { es: "Cóctel de pie", en: "Standing cocktail" }, valor: "~600" },
      { etiqueta: { es: "Bajo techo", en: "Covered" }, valor: { es: "~4 000 ft²", en: "~4,000 sq ft" } },
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
        es: "Fin de año en el recinto: alfombra sobre el paseo, palmeras iluminadas y el pabellón al lado. Foto de un evento real.",
        en: "New Year's Eve on site: a carpet down the walkway, uplit palms and the Pavilion alongside. A real event, not a rendering.",
      },
    },
    bloques: [
      {
        titulo: { es: "Llegada fuera, cena dentro", en: "Cocktails outside, dinner under the roof" },
        cuerpo: {
          es: "El montaje que mejor funciona para una empresa: cóctel de bienvenida y networking en el jardín, con la gente de pie y moviéndose, y después pasar a la mesa bajo el pabellón. Los dos espacios comparten el paseo, así que el cambio no rompe el ritmo ni obliga a salir a la calle.",
          en: "The layout that works best for a company: welcome cocktails and networking in the Garden, with people standing and mingling, then dinner at the tables under the Pavilion. The two spaces share the walkway, so the move keeps the energy going and nobody has to step out onto the street.",
        },
      },
      {
        titulo: { es: "Diciembre en Miami se hace fuera", en: "December in Miami happens outdoors" },
        cuerpo: {
          es: "Es de los mejores meses del año aquí, y una fiesta de empresa al aire libre en diciembre se recuerda distinto que un salón de hotel. El riesgo es el aguacero de tarde, y eso lo resuelven los ~4.000 ft² de cubierta fija: no hay que decidir nada con dos semanas de antelación mirando el parte.",
          en: "It's one of the best months of the year here, and an outdoor company party in December is remembered in a way a hotel ballroom never is. The only risk is an afternoon downpour, and the ~4,000 sq ft permanent roof takes care of it: no decisions two weeks out while watching the forecast.",
        },
      },
      {
        titulo: { es: "Sin proveedor impuesto", en: "No required vendors" },
        cuerpo: {
          es: "Los hoteles suelen atar el catering y la barra a su cocina, y ahí es donde se va el presupuesto de una cena de empresa. Aquí se alquila el espacio: eliges proveedor, menú y barra, y el ahorro se nota justo en la partida más grande. Y si lo que estás comparando es un salón de fiestas y no un hotel, la página «Salón de fiestas en Miami, al aire libre» hace esa comparación punto por punto.",
          en: "Hotels usually tie catering and bar service to their own kitchen, and that's where a company dinner's budget goes. Here you rent the space and choose your caterer, menu and bar, so you save on the biggest line item. If you're comparing us with a banquet hall rather than a hotel, see “Outdoor party hall rental in Miami” for a point-by-point comparison.",
        },
      },
      {
        titulo: { es: "Las fechas de diciembre vuelan", en: "December dates go fast" },
        cuerpo: {
          es: "Las dos primeras semanas de diciembre son las más pedidas del año, y coinciden además con Art Week. Si la fecha es esa, conviene cerrarla con meses de margen: escríbenos con el número de asistentes y te decimos qué hay libre. Y si lo que se celebra no es la empresa sino un cumpleaños de 30, 40 o 50 con más de 150 invitados, para eso está la página de cumpleaños de adulto.",
          en: "The first two weeks of December are the most requested of the year, and they overlap with Art Week. If that's your date, book it months ahead: send us your guest count and we'll tell you what's available. If you're celebrating a 30th, 40th or 50th birthday with more than 150 guests rather than a company party, see Adult birthday parties.",
        },
      },
    ],
  },

  {
    clave: "barrio",
    ojo: { es: "El barrio", en: "The neighborhood" },
    h1: { es: "Por qué Wynwood", en: "Why Wynwood" },
    respuesta: {
      es: "Wynwood es el distrito de arte de Miami y, para un evento, tres cosas lo hacen distinto: el barrio se recorre a pie, está a tres minutos del acceso a la I-95 y a dieciséis del aeropuerto, y los murales dan un fondo que ningún salón puede montar. Esta página es para quien está eligiendo barrio antes que local.",
      en: "Wynwood is Miami's arts district, and three things make it different for an event: it's walkable, it's three minutes from I-95 and sixteen from the airport, and its murals are a backdrop no ballroom can build. This page is for anyone choosing a neighborhood before choosing a venue.",
    },
    title: {
      es: "Por qué hacer tu evento en Wynwood, Miami | Club Wynwood",
      en: "Why host your event in Wynwood, Miami | Club Wynwood",
    },
    description: {
      es: "Qué tiene Wynwood para un evento: barrio peatonal, 3 minutos a la I-95, 16 al aeropuerto MIA, y los murales del Arts District como fondo real.",
      en: "What Wynwood offers an event: a walkable neighborhood, 3 minutes to I-95, 16 to Miami International Airport, and the Arts District murals as a real backdrop.",
    },
    cifras: [
      { etiqueta: { es: "A la I-95", en: "To I-95" }, valor: "3 min" },
      { etiqueta: { es: "Al aeropuerto MIA", en: "To MIA airport" }, valor: "16 min" },
      { etiqueta: { es: "A Miami Beach", en: "To Miami Beach" }, valor: "18 min" },
    ],
    foto: {
      src: "/assets/venue-exterior.webp",
      alt: {
        es: "El recinto con los murales del barrio al fondo",
        en: "The venue with the neighborhood murals behind it",
      },
      pie: {
        es: "Los murales del barrio, al fondo del recinto.",
        en: "The neighborhood murals, behind the venue.",
      },
    },
    bloques: [
      {
        titulo: { es: "Se recorre a pie", en: "It's walkable" },
        cuerpo: {
          es: "Wynwood es de los pocos sitios de Miami donde la gente camina. Para un evento eso cambia dos cosas: los invitados pueden llegar antes o quedarse después sin depender del coche, y una activación abierta al público recibe gente que ya estaba en la calle.",
          en: "Wynwood is one of the few places in Miami where people walk. For an event, that changes two things: guests can arrive early or stay late without depending on a car, and an event that's open to the public gets people who are already out on the street.",
        },
      },
      {
        titulo: { es: "Está bien conectado", en: "It's well connected" },
        cuerpo: {
          es: "Tres minutos al acceso de la I-95, seis a Midtown y el Design District, nueve a Downtown y Brickell, dieciséis al aeropuerto MIA y dieciocho a Miami Beach. Para un evento con invitados de fuera, esos dieciséis minutos al aeropuerto valen más que cualquier argumento de marca. Para la cena de ensayo de una boda de destino, con la familia aterrizando el jueves, hay página propia.",
          en: "Three minutes to I-95, six to Midtown and the Design District, nine to Downtown and Brickell, sixteen to Miami International Airport and eighteen to Miami Beach. For an event with out-of-town guests, being sixteen minutes from the airport is worth more than any marketing pitch. Planning the rehearsal dinner for a destination wedding, with family flying in on Thursday? It has its own page.",
        },
      },
      {
        titulo: { es: "El fondo ya existe", en: "The backdrop already exists" },
        cuerpo: {
          es: "Los murales del Arts District son el escenario que ningún salón puede construir, y no cuestan producción. Para una boda, una quinceañera o un rodaje, eso son fotos con lugar reconocible en vez de fotos con pared.",
          en: "The Arts District murals are a set no ballroom can build, and they cost nothing to produce. For a wedding, a quinceañera or a shoot, that means photos in a place people recognize instead of photos against a wall.",
        },
      },
      {
        titulo: { es: "Lo que hay que tener en cuenta", en: "What to keep in mind" },
        cuerpo: {
          es: "Wynwood es un barrio con vivienda y con vida nocturna, así que el ruido y el horario están regulados y el aparcamiento en calle es limitado los fines de semana. Son las dos preguntas que conviene hacerle a cualquier venue de la zona, y las repasamos contigo en la visita.",
          en: "Wynwood has both residents and nightlife, so noise and hours are regulated and street parking is limited on weekends. Those are the two questions worth asking any venue in the area, and we go through both with you at the site visit.",
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
      es: "Club Wynwood funciona como sede de offsite y retiro de empresa al aire libre en Wynwood, Miami: ~18.000 ft² con pavimento, césped artificial y arena a pocos metros, seis cabañas amuebladas y ~4.000 ft² bajo el Pabellón para el almuerzo. No es una sala de reuniones: sin salas, sin AV, sin proyector.",
      en: "Club Wynwood is an outdoor venue for corporate offsites and retreats in Wynwood, Miami: ~18,000 sq ft with paving, artificial turf and sand a few steps apart, six furnished cabanas and ~4,000 sq ft under the Pavilion for lunch. It isn't a meeting venue: there are no breakout rooms, no AV and no projector.",
    },
    title: {
      es: "Offsite de empresa al aire libre en Wynwood | Club Wynwood",
      en: "Corporate offsite venue in Wynwood, Miami | Club Wynwood",
    },
    description: {
      es: "Offsite de empresa al aire libre en Wynwood, Miami: ~18.000 ft², tres superficies, seis cabañas fijas y ~4.000 ft² techados. Sin salas ni AV: traes tu montaje.",
      en: "Outdoor corporate offsite and retreat venue in Wynwood, Miami: ~18,000 sq ft, 3 surfaces, 6 cabanas, ~4,000 sq ft under the Pavilion. No meeting rooms, no AV.",
    },
    cifras: [
      { etiqueta: { es: "Jardín abierto", en: "Open garden" }, valor: { es: "~18.000 ft²", en: "~18,000 sq ft" } },
      { etiqueta: { es: "Bajo el Pabellón", en: "Under the Pavilion" }, valor: { es: "~4.000 ft²", en: "~4,000 sq ft" } },
      { etiqueta: { es: "Cabañas amuebladas", en: "Furnished cabanas" }, valor: { es: "6", en: "6" } },
      { etiqueta: { es: "De pie (recinto completo)", en: "Standing (whole venue)" }, valor: { es: "~600", en: "~600" } },
    ],
    foto: {
      src: "/assets/flyer-cenital.jpg",
      alt: { es: "Cenital del recinto: el pabellón, el área de arena, las cabañas y el paseo pavimentado en un mismo encuadre", en: "Overhead view of the venue: the Pavilion, the sand area, the cabanas and the paved walkway in one frame" },
      pie: { es: "Las tres superficies del Jardín —pavimento, césped y arena— a pocos metros unas de otras.", en: "The venue's three surfaces — paving, turf and sand — a few steps apart." },
    },
    bloques: [
      {
        titulo: { es: "Empieza por lo que no hay", en: "Start with what isn't here" },
        cuerpo: {
          es: "Al aire libre no hay salas de reunión, ni equipo audiovisual, ni proyector, ni climatización; la conectividad se confirma en la visita. Se alquila el recinto vacío: las actividades las trae tu equipo, igual que el catering. Un facilitador, una empresa de dinámicas de grupo o un proveedor de actividades monta aquí con lo suyo, y lo que nadie traiga no está. El exterior —el Jardín y el Pabellón— se puede reservar desde el 1 de octubre de 2026. El edificio de 15.961 ft² se alquila aparte desde el 1 de noviembre, y su cocina se suma cuando el catering la necesita. Quien necesita una sala con proyector y aire acondicionado necesita un salón de hotel, no un recinto al aire libre.",
          en: "Outdoors there are no meeting rooms, no AV, no projector and no climate control; Wi-Fi and connectivity are confirmed at the site visit. You rent the venue empty: your team brings the activities the same way it brings the catering. A facilitator or team-building company sets up here with its own equipment — if nobody brings it, it isn't here. The outdoor venue (the Garden and the Pavilion) is available from October 1, 2026. The 15,961 sq ft building is rented separately from November 1, and its kitchen can be added when catering needs it. If you need a room with a projector and air conditioning, you need a hotel ballroom, not an open-air venue.",
        },
      },
      {
        titulo: { es: "Tres suelos y seis rincones", en: "Three surfaces, six cabanas" },
        cuerpo: {
          es: "Las tres superficies del Jardín —pavimento, césped artificial y arena— están a pocos metros unas de otras, y eso es lo que un facilitador de team building aprovecha sin mover un solo mueble: la dinámica física sobre la arena, las mesas de trabajo sobre el pavimento firme del paseo, la puesta en común sobre el césped. Cada grupo cambia de zona caminando y el día no se detiene a reorganizar nada. Las seis cabañas amuebladas —pérgolas con cortinas y sofás— son seis rincones de reunión ya montados: sitios para conversar, no escritorios. Cabañas, mesas de picnic y setos perimetrales están fijos, así que el plano del día parte de ellos y no al revés.",
          en: "The Garden's three surfaces — paving, artificial turf and sand — are a few steps apart, and a team-building facilitator can use all three without moving any furniture: physical challenges on the sand, breakout tables on the paved walkway, the debrief on the turf. Each group moves on foot and the day never stops to reset. The six furnished cabanas — pergolas with curtains and sofas — are six ready-made spots to sit and talk, not desks. The cabanas, picnic tables and hedges are all fixed, so the day's layout starts from them, not the other way around.",
        },
      },
      {
        titulo: { es: "A la sombra, no al sol", en: "In the shade, not the sun" },
        cuerpo: {
          es: "Un día de octubre en Miami se aguanta a la sombra, no al sol, así que la agenda se arma alrededor del Pabellón: ~4.000 ft² techados de paja que son el comedor de mediodía, con sombra y sin aire acondicionado, y el único techo del exterior cuando llueve. Para el agua que cae recta basta solo; con viento entra de lado, y un offsite de enero conviene que presupueste cierres laterales. El recinto completo admite ~600 de pie o ~300 sentados; un equipo de 40 u 80 personas usa una fracción, y para ese tamaño suele bastar el Pabellón suelto, como en los eventos pequeños. Las sesiones al sol van temprano; el trabajo largo, bajo la paja.",
          en: "An October day in Miami is comfortable in the shade, not in the sun, so plan the agenda around the Pavilion: ~4,000 sq ft of thatched roof that works as the lunch area — shaded, without air conditioning — and the only covered space outdoors when it rains. It handles straight-down rain; since it's open on the sides, wind can blow rain in, so a January offsite should budget for side walls. The whole venue holds ~600 standing or ~300 seated; a team of 40 or 80 uses a fraction of that, so for a group that size the Pavilion on its own is usually the right booking (see Small events). Schedule sessions in the sun early; long working sessions go under the Pavilion.",
        },
      },
      {
        titulo: { es: "El montaje que nadie ve", en: "A load-in nobody sees" },
        cuerpo: {
          es: "Hay dos entradas y no se cruzan: la carga entra por NW 1st Ct y los invitados por NW 21st Ct. Para un offsite eso pesa más de lo que parece. El proveedor de la actividad descarga, arma y prueba por su puerta mientras el equipo llega por la otra, y la primera impresión del día no es un camión abierto ni cajas a medio sacar. Hay estacionamiento propio en el predio, así que quien viene en coche no busca sitio en la calle. Lo que todavía no publicamos —potencia y amperaje, ancho del portón de carga, número de baños, plazas de estacionamiento y curfew— lo recorremos contigo en la visita y te lo confirmamos por escrito.",
          en: "There are two entrances, and they never cross: freight comes in on NW 1st Ct and guests on NW 21st Ct. For an offsite, that matters more than it sounds. The activity vendor unloads, sets up and tests through one gate while your team walks in through the other, so the day doesn't start with an open truck or half-unpacked crates. There's also on-site parking, so nobody driving in has to hunt for a spot on the street. What we don't publish yet — electrical service and amperage, freight gate width, number of restrooms, parking spaces and curfew — we check with you at the site visit and confirm in writing.",
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
      es: "Para un cumpleaños de 30, 40 o 50 con más de 150 invitados, Club Wynwood se alquila entero: ~22.000 ft² al aire libre en Wynwood, Miami, con ~4.000 ft² bajo el pabellón, estacionamiento propio y licencia de licor propia. Por debajo de 150 invitados se alquila solo el Pabellón. Se alquila el recinto vacío, no una mesa.",
      en: "For a 30th, 40th or 50th birthday with more than 150 guests, you rent all of Club Wynwood: ~22,000 sq ft of open-air space in Wynwood, Miami, with ~4,000 sq ft under the Pavilion, on-site parking and its own liquor license. With fewer than 150 guests, you rent just the Pavilion. Either way, you rent the empty venue, not a table.",
    },
    title: {
      es: "Fiesta de cumpleaños para adultos en Wynwood | Club Wynwood",
      en: "Adult birthday party venue in Wynwood, Miami | Club Wynwood",
    },
    description: {
      es: "Cumpleaños de adultos en Wynwood, Miami: desde 150 invitados se alquila el recinto entero, ~22.000 ft² al aire libre, licencia de licor propia y parking propio.",
      en: "Adult birthday party venue in Wynwood, Miami: from 150 guests, you rent the whole venue — ~22,000 sq ft outdoors, with its own liquor license and on-site parking.",
    },
    cifras: [
      { etiqueta: { es: "Recinto completo", en: "Whole venue" }, valor: { es: "~22.000 ft²", en: "~22,000 sq ft" } },
      { etiqueta: { es: "De pie", en: "Standing" }, valor: { es: "~600", en: "~600" } },
      { etiqueta: { es: "Sentados", en: "Seated" }, valor: { es: "~300", en: "~300" } },
      { etiqueta: { es: "Bajo techo · plan de lluvia", en: "Covered · rain plan" }, valor: { es: "~4.000 ft²", en: "~4,000 sq ft" } },
    ],
    foto: {
      src: "/assets/recinto-noche.jpg",
      alt: { es: "El recinto al anochecer durante una fiesta, visto desde arriba: invitados repartidos por el jardín, el paseo con alfombra roja entre las palmeras iluminadas desde el tronco y el techo de paja del pabellón", en: "The site at dusk during a party, seen from above: guests spread across the garden, the walkway with a red carpet between palms uplit at the base, and the Pavilion's thatched roof" },
      pie: { es: "Una fiesta al anochecer en el recinto. Es el fotograma de un evento real, no una recreación: la alfombra roja y el arco de globos los trajo esa producción, no vienen con el recinto.", en: "An evening party on site. This is a photo of a real event, not a staged shot: the red carpet and the balloon arch belonged to that production and don't come with the venue." },
    },
    bloques: [
      {
        titulo: { es: "Un club te vende una mesa; esto es el recinto entero", en: "A club sells you a table; here you get the whole venue" },
        cuerpo: {
          es: "Cuando cumples 30, 40 o 50, la opción por defecto es reservar mesa en un club: pagas un mínimo de consumo, te dan una sección acordonada y la fiesta sigue siendo del local. Aquí el trato es el contrario: alquilas el recinto vacío —~22.000 ft² al aire libre, con ~4.000 ft² bajo el pabellón— y traes tu música, tu decoración y tu comida. El presupuesto se cotiza por espacio, horas y día, no por lo que se consuma. El corte es el tamaño: a partir de 150 invitados tiene sentido el recinto entero; por debajo, se alquila solo el Pabellón, que es lo que explica la página de eventos pequeños.",
          en: "When you turn 30, 40 or 50, the usual choice is a table at a club: you commit to a minimum spend, you get a roped-off section, and the night still belongs to the club. This is the opposite: you rent the empty venue — ~22,000 sq ft outdoors, ~4,000 of them under the Pavilion — and bring your own music, decor and food. The price is based on space, hours and date, not on how much gets consumed. The dividing line is the guest count: from 150 guests up, the whole venue makes sense; below that, you rent just the Pavilion (see Small events).",
        },
      },
      {
        titulo: { es: "150, 300 o 600: cómo se reparte la noche", en: "150, 300 or 600: how the night is laid out" },
        cuerpo: {
          es: "El recinto completo admite ~600 personas de pie o ~300 sentadas; con solo una parte, proporcionalmente menos. Para un cumpleaños de noche el reparto que funciona es cena y pista bajo el pabellón y el resto en el jardín: llegada y fotos por el paseo pavimentado entre las dos hileras de palmeras, mesas de picnic fijas y seis cabañas amuebladas del lado de la arena, que sirven de zona de descanso. Los ~4.000 ft² techados son además el plan de lluvia: si cae un aguacero, la pista y la cena ya están bajo cubierta. El pabellón está abierto por los cuatro costados; con viento entra agua de lado, así que en invierno conviene presupuestar cierres laterales. El aforo con tu montaje concreto se confirma en la visita.",
          en: "The whole venue holds ~600 standing or ~300 seated; one space on its own holds proportionally fewer. For a birthday at night, the layout that works is dinner and dance floor under the Pavilion and everything else in the Garden: arrivals and photos along the paved walkway between the two rows of palms, plus fixed picnic tables and six furnished cabanas on the sand side as a lounge area. The ~4,000 sq ft roof is also your rain plan: if a downpour hits, dinner and the dance floor are already covered. The Pavilion is open on all four sides, and wind can blow rain in, so budget for side walls for a winter date. Capacity for your layout is confirmed at the site visit.",
        },
      },
      {
        titulo: { es: "Licencia de licor propia y un área donde montar la barra", en: "Its own liquor license, and an area to set up a bar" },
        cuerpo: {
          es: "El recinto tiene licencia de licor propia, con su propio número, cosa que no todos los espacios de la zona pueden decir. Hay área donde montar barra; dónde queda dentro de tu montaje se define en la visita. Quién la opera, qué se sirve y en qué condiciones se cierra por escrito con la ficha técnica, que es donde van el número de licencia y sus condiciones: nada se improvisa la noche del evento. No hay proveedor impuesto ni comisión por traer el tuyo, y el alquiler se cotiza por espacio, horas y día, no por consumo. Si el plan es barra libre o coctelería, dilo en el primer correo: condiciona dónde va la barra, el hielo y la carga.",
          en: "The venue holds its own liquor license, with its own license number — not every space in Wynwood can say that. There's an area to set up a bar; exactly where it goes in your layout is decided at the site visit. Who runs it, what's served and on what terms are put in writing with the spec sheet, along with the license number and its conditions, so nothing is improvised on the night. There's no required vendor and no fee for bringing your own, and the rental is priced on space, hours and date, not on consumption. If you're planning an open bar or a cocktail menu, mention it in your first message: it determines where the bar, the ice and the load-in go.",
        },
      },
      {
        titulo: { es: "Dos puertas, y hasta qué hora", en: "Two gates, and how late you can go" },
        cuerpo: {
          es: "Los invitados entran por NW 21st Ct y la carga —proveedores, hielo, sonido— por NW 1st Ct, con su propia puerta: la reposición de hielo y la descarga del DJ no cruzan la fiesta. Los setos perimetrales cierran el jardín por la calle y hay estacionamiento en el propio predio, al este y al sur. El recinto se alquila por franja, con fecha y hora; qué queda cerrado, desde qué hora y con qué control de acceso se fija por escrito en la visita técnica. Ahí mismo se cierran el horario tope y el límite de decibelios, porque Wynwood tiene vecinos: no publicamos una cifra porque depende del evento. Si el plan es DJ hasta tarde, dilo en el primer correo.",
          en: "Guests come in through NW 21st Ct, and load-in — vendors, ice, sound equipment — uses a separate service gate on NW 1st Ct, so ice runs and the DJ's load-in never cut through the party. Hedges separate the Garden from the street, and there's parking on the property, to the east and south. You rent the venue for a specific date and time slot; which areas are closed off, from when, and how access is controlled are agreed in writing at the site visit. The curfew and the decibel limit are set there too, because Wynwood has residential neighbors: we don't publish a number because it depends on the event. If you're planning for the DJ to play late, mention it in your first message.",
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
      es: "Una boda de 30 a 80 invitados en Wynwood, Miami, se resuelve contratando solo el Pabellón: ~4.000 ft² cubiertos que se alquilan sueltos, sin el jardín, con ceremonia, cena y baile bajo la misma paja. El montaje se define con tu plano en la visita. No hay paquete cerrado; hay licencia de licor propia y área donde montar barra.",
      en: "A wedding of 30 to 80 guests in Wynwood, Miami, only needs the Pavilion: ~4,000 sq ft under one roof, rented on its own without the Garden, with the ceremony, dinner and dancing all in one place. The seating layout is worked out from your floor plan at the site visit. There are no set packages, and the venue holds its own liquor license.",
    },
    title: {
      es: "Bodas pequeñas de 30 a 80 en Wynwood | Club Wynwood",
      en: "Small wedding venue in Wynwood, Miami | Club Wynwood",
    },
    description: {
      es: "Bodas pequeñas de 30 a 80 invitados en Wynwood, Miami: el Pabellón, ~4.000 ft² techados, se alquila solo; el jardín con palmeras y seis cabañas se suma aparte.",
      en: "Small, intimate wedding venue in Wynwood, Miami, for 30 to 80 guests: the ~4,000 sq ft covered Pavilion can be booked on its own, and the Garden can be added.",
    },
    cifras: [
      { etiqueta: { es: "Solo el Pabellón", en: "Pavilion only" }, valor: { es: "~4.000 ft²", en: "~4,000 sq ft" } },
      { etiqueta: { es: "Planta del Pabellón", en: "Pavilion footprint" }, valor: { es: "~54 × 60 ft", en: "~54 × 60 ft" } },
      { etiqueta: { es: "El paseo", en: "The walkway" }, valor: { es: "~15 × 108 ft", en: "~15 × 108 ft" } },
      { etiqueta: { es: "Al aeropuerto MIA, en coche", en: "To MIA airport, by car" }, valor: { es: "16 min", en: "16 min" } },
    ],
    foto: {
      src: "/assets/flyer-palapa-lounge.jpg",
      alt: { es: "Bajo el pabellón: un montaje lounge con barra y guirnaldas", en: "Under the Pavilion: a lounge setup with a bar and string lights" },
      pie: { es: "Bajo el pabellón, montado en lounge: ~4.000 ft² bajo un mismo techo.", en: "The Pavilion set up as a lounge: ~4,000 sq ft under one roof." },
    },
    bloques: [
      {
        titulo: { es: "Ceremonia, cena y baile bajo un mismo techo", en: "Ceremony, dinner and dancing under one roof" },
        cuerpo: {
          es: "Para 30 a 80 invitados ese es el formato: ceremonia, cena y baile bajo la misma cubierta, sin sala aparte y sin traslado de invitados entre espacios. Cuántas mesas entran y de qué tamaño se resuelve con tu plano en la visita: no publicamos un aforo bajo el pabellón que no esté medido. Lo que no hay son paredes: el pabellón está abierto por los cuatro costados, así que no tiene aire acondicionado y con viento la lluvia entra de lado; una fecha de invierno conviene que presupueste cierres laterales como parte del plan de lluvia. Las dimensiones y la estructura están en la página del Pabellón. Por encima de 80 invitados el montaje pide el recinto completo: esa es la página de bodas.",
          en: "With 30 to 80 guests, this is the format: ceremony, dinner and dancing under one roof, with no second room and no moving guests from space to space. How many tables fit, and what size, is worked out from your floor plan at the site visit — we don't publish a seated capacity for the Pavilion that we haven't measured. What it doesn't have is walls: it's open on all four sides, so there's no air conditioning, and wind can blow rain in. For a winter date, budget for side walls as part of your rain plan. Dimensions and details are on the Pavilion page. Above 80 guests, you'll want the whole venue: see Weddings.",
        },
      },
      {
        titulo: { es: "El pasillo mide 15 × 108 ft, y es del Jardín", en: "The aisle is 15 × 108 ft, and it's part of the Garden" },
        cuerpo: {
          es: "El paseo pavimentado del recinto mide unos 15 ft de ancho por 108 de largo entre dos hileras de palmeras reales: baja de la puerta del edificio hasta el estacionamiento del sur y pasa por delante del pabellón, que queda a su lado oeste. La medida sale del plano del predio y es aproximada. Es la decisión que separa las dos formas de contratar esta boda. Con solo el Pabellón, la ceremonia se celebra dentro del pabellón. Si quieres la entrada sobre el paseo, entre las palmeras, el paseo pertenece al Jardín y hay que sumar el Jardín al contrato: el recinto pasa a ser el completo, y lo describe la página del Jardín.",
          en: "The paved walkway is about 15 ft wide and 108 ft long, between two rows of real palms. It runs from the building door down to the south parking lot, past the Pavilion on its west side (the measurement comes from the property's site plan and is approximate). This decides how you book the wedding. With the Pavilion alone, the ceremony takes place under the Pavilion. If you want the processional down the walkway, between the palms, you need to add the Garden — the walkway is part of it — which means booking the whole venue (see The Garden).",
        },
      },
      {
        titulo: { es: "Sin paquete cerrado", en: "No set package" },
        cuerpo: {
          es: "No hay paquete cerrado. Contratas el espacio y traes a tus proveedores: catering, sonido, iluminación, mobiliario y montaje. El recinto tiene licencia de licor propia, con su propio número, y hay área donde montar barra; el número de licencia y sus condiciones se entregan con la ficha técnica. Es lo contrario del paquete de boda pequeña de un hotel, y corta en los dos sentidos: aquí no viene nada resuelto. Si nadie contrata catering, no hay comida, y al aire libre no hay cocina: la del edificio, disponible desde el 1 de noviembre de 2026, se suma al alquiler cuando el catering la necesita. Para 30 a 80 invitados eso da control total sobre el menú y la estética, y toda la responsabilidad.",
          en: "There's no set package. You book the space and bring your own vendors: caterer, sound, lighting, rentals and load-in crew. The venue holds its own liquor license, and there's an area to set up a bar; the license number and its conditions come with the spec sheet. It's the opposite of a hotel's small-wedding package, and that cuts both ways: nothing is handled for you. If nobody books a caterer, there's no food, and there's no kitchen outdoors — the building's kitchen, available from November 1, 2026, can be added to the rental if your caterer needs it. For 30 to 80 guests, you get full control of the menu and the look, and full responsibility with it.",
        },
      },
      {
        titulo: { es: "Invitados por una puerta, proveedores por otra", en: "Guests through one gate, vendors through another" },
        cuerpo: {
          es: "Los invitados entran por NW 21st Ct y la carga por NW 1st Ct: el catering y el sonido no se cruzan con la fila de llegada. Hay estacionamiento en el propio predio; el número de plazas se confirma en la visita. La dirección es 2129 NW 1st Ct, a cuatro minutos a pie de Wynwood Walls y a 16 minutos en coche del aeropuerto MIA, lo que importa cuando media lista de invitados llega de fuera. Las seis cabañas amuebladas están en el jardín, al otro lado del paseo, del lado de la arena: son fijas y cuentan en el plano aunque solo contrates el Pabellón, pero usarlas como zona de descanso significa sumar el Jardín. Fechas de exterior: desde el 1 de octubre de 2026.",
          en: "Guests come in on NW 21st Ct and vendors on NW 1st Ct, so the caterer and the sound crew never cross the guests' path. There's parking on the property; the number of spaces is confirmed at the site visit. The address is 2129 NW 1st Ct, a four-minute walk from Wynwood Walls and a 16-minute drive from Miami International Airport (MIA) — useful when half the guest list is flying in. The six furnished cabanas are across the walkway in the Garden, on the sand side; to use them as a lounge, add the Garden to your booking. The outdoor space is available for events from October 1, 2026.",
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
    ojo: { es: "Uso · shower a mediodía", en: "Use · bridal and baby showers" },
    h1: { es: "Bridal showers y baby showers", en: "Bridal and baby showers" },
    respuesta: {
      es: "Club Wynwood alquila el Pabellón suelto para bridal showers y baby showers de mediodía en Wynwood, Miami: ~4.000 ft² de techo de paja continuo, abierto por los cuatro costados, para grupos de 50 a 150 invitados a la sombra y sin aire acondicionado. La decoración y el catering los traes tú.",
      en: "You can rent the Pavilion on its own for a midday bridal or baby shower in Wynwood, Miami: ~4,000 sq ft under a continuous thatched roof, open on all four sides, for 50 to 150 guests in the shade — no walls around you and no air conditioning. You bring the decor and the caterer.",
    },
    title: {
      es: "Bridal shower y baby shower en Wynwood, Miami | Club Wynwood",
      en: "Bridal & baby shower venue in Wynwood, Miami | Club Wynwood",
    },
    description: {
      es: "Bridal shower o baby shower a mediodía en Wynwood, Miami: el Pabellón suelto, ~4.000 ft² de paja abiertos por los cuatro costados, y el catering lo traes tú.",
      en: "Open-air bridal and baby shower venue in Wynwood, Miami: book the Pavilion on its own — ~4,000 sq ft of thatched shade, open on four sides — and bring your own caterer.",
    },
    cifras: [
      { etiqueta: { es: "Sombra bajo techo", en: "Shaded area" }, valor: { es: "~4.000 ft²", en: "~4,000 sq ft" } },
      { etiqueta: { es: "Cabañas, en el jardín", en: "Cabanas (in the Garden)" }, valor: { es: "6", en: "6" } },
      { etiqueta: { es: "Jardín, si entra en la reserva", en: "Garden (optional)" }, valor: { es: "~18.000 ft²", en: "~18,000 sq ft" } },
      { etiqueta: { es: "Exterior, se reserva desde", en: "Available from" }, valor: { es: "1 oct 2026", en: "Oct 1, 2026" } },
    ],
    foto: {
      src: "/assets/flyer-palapa-lounge.jpg",
      alt: { es: "Bajo el pabellón: un montaje lounge con barra y guirnaldas entre los postes de madera", en: "Under the Pavilion: a lounge setup with a bar and string lights among the wood posts" },
      pie: { es: "Bajo el Pabellón, montado en lounge. La sombra ya está; el resto lo pone quien organiza.", en: "The Pavilion set up as a lounge. The shade is already there; the host brings the rest." },
    },
    bloques: [
      {
        titulo: { es: "El problema de un bridal shower es la hora", en: "The problem with a shower brunch is the time of day" },
        cuerpo: {
          es: "Un shower casi nunca es de noche: es un brunch o un almuerzo, entre las once y las tres. Es el peor sol del día en Miami, y por eso la alternativa habitual es un restaurante, que resuelve el sol encerrando a treinta personas en una sala con aire acondicionado. Aquí el pabellón hace lo mismo sin cerrar nada: techo de paja a cuatro aguas, ~4.000 ft² de sombra continua, abierto por los cuatro costados. Corre el aire, se oye la conversación y las fotos salen con luz de día, no con luz de techo. El pabellón para el sol y la lluvia vertical, pero no tiene cierres laterales: con viento el agua entra de lado, y un shower fuera de la temporada seca conviene que presupueste carpas laterales.",
          en: "A shower is almost never a night event: it's brunch or lunch, somewhere between 11 and 3. That's the worst sun of the Miami day, which is why most showers end up in a restaurant, with thirty people shut in a room and the air conditioning running. The Pavilion keeps everyone out of the sun without closing anything in: a thatched hip roof with about 4,000 sq ft of continuous shade, open on all four sides. The air moves, conversation flows, and the photos come out in daylight instead of under ceiling lights. The roof handles sun and straight-down rain, but it has no sides: wind can blow rain in, so a shower outside the dry season should budget for side panels.",
        },
      },
      {
        titulo: { es: "Qué hay debajo del techo: nueve postes y césped", en: "What's under the roof: nine posts and turf" },
        cuerpo: {
          es: "El montaje gira alrededor de tres cosas que ya existen. Los postes: el techo de paja descansa sobre una retícula de nueve postes de madera, a unos 24 ft entre ejes, y la mesa larga, la de postres y el fondo de fotos van entre ellos, no contra una pared. El piso: bajo el pabellón es césped artificial; la arena del jardín queda del lado de las cabañas, no aquí. Y el paseo pavimentado entre las dos hileras de palmeras, fondo de fotos sin montar nada, a cuatro minutos a pie de Wynwood Walls. Colgar de la estructura —arcos, guirnaldas, telas— se estudia en la visita técnica: cada carga se revisa punto por punto antes de autorizarla, y no hay límite de carga publicado porque no está levantado.",
          en: "Three things that are already there shape the layout. The posts: the roof rests on a grid of nine timber posts, about 24 ft apart, and the long table, the dessert table and the photo backdrop go between them, not against a wall. The floor: under the Pavilion it's artificial turf; the sand is over on the cabana side of the Garden. And the paved walkway between the two rows of palms, a photo backdrop before you set up anything, a four-minute walk from Wynwood Walls. Hanging anything from the Pavilion — arches, garlands, fabric — is reviewed at the site visit, point by point, before it's approved; we don't publish a load limit because it hasn't been measured yet.",
        },
      },
      {
        titulo: { es: "Brunch sin cocina al aire libre, y la pregunta de las mimosas", en: "Brunch without an outdoor kitchen, and the mimosa question" },
        cuerpo: {
          es: "Al aire libre no hay cocina: el catering del brunch monta en el sitio, y si necesita cocina, la del edificio es un adicional que se suma al alquiler desde el 1 de noviembre de 2026. No hay catering obligatorio ni lista de proveedores preferidos, y no cobramos comisión por traer el tuyo; en un shower, donde la cuenta suele repartirse entre varias personas, esa partida pesa más que el precio del espacio. La otra pregunta de todo shower es la mesa de mimosas. El recinto tiene licencia de licor propia, con su propio número, y hay área donde montar barra; las condiciones bajo las que se sirve alcohol en un evento privado se entregan por escrito con la ficha técnica, antes de firmar.",
          en: "There's no kitchen outdoors: the brunch caterer sets up on site, and if they need a kitchen, the building's kitchen can be added to the rental from November 1, 2026. There's no required caterer, no preferred-vendor list, and we take no commission on yours; at a shower, where the bill is usually split among several people, that makes more difference to the total than the rental does. The other question at every shower is the mimosa bar. The venue holds its own liquor license, and there's an area to set up a bar; the conditions for serving alcohol at a private event come in writing with the spec sheet, before you sign.",
        },
      },
      {
        titulo: { es: "Cuánto recinto hace falta, y qué se mide en la visita", en: "How much of the venue you need, and what gets measured at the visit" },
        cuerpo: {
          es: "Para un shower el Pabellón suelto suele bastar; el jardín de ~18.000 ft² se suma solo si hace falta. Hace falta si quieres las cabañas: las seis cabañas amuebladas están en el jardín, no bajo el pabellón. Son fijas y van con el inmueble: con el jardín en la reserva no se cobran aparte. Un baby shower funciona igual a esta hora; si tu pregunta es si se puede alquilar solo una parte, o buscas sitio para un bautizo o un cumpleaños, esa respuesta está en Eventos pequeños, y el día grande de la boda, en Bodas. El número de baños y el aforo sentado y de pie con tu montaje no se publican porque no están medidos: se levantan en la visita técnica y se entregan por escrito.",
          en: "For a shower, the Pavilion on its own is usually enough; add the ~18,000 sq ft Garden only if you need it — for example, if you want the cabanas. The six furnished cabanas are in the Garden, not under the Pavilion; they're fixed and come with the property, so if the Garden is in your booking there's no extra charge for them. A baby shower works the same way at this time of day. If you just want to know whether you can rent one space, or you need a venue for a christening or a birthday, see Small events; for the wedding itself, see Weddings. We don't publish the number of restrooms or the seated and standing capacity for your setup because they haven't been measured yet: both are measured at the site visit and confirmed in writing.",
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
      es: "Club Wynwood alquila el recinto para la cena de ensayo y el fin de semana de boda en Wynwood, Miami. La cena de la víspera se monta bajo el pabellón techado, que es también el plan de lluvia, y el after-party en el jardín: dos espacios contiguos en una sola dirección. No vendemos comida: el catering lo eliges tú.",
      en: "You can rent Club Wynwood for the rehearsal dinner and the rest of your wedding weekend in Wynwood, Miami. Friday's dinner goes under the covered Pavilion, which is also your rain plan, and the after-party goes in the Garden: two spaces side by side at one address. We don't sell food: you hire your own caterer.",
    },
    title: {
      es: "Cena de ensayo en Wynwood, Miami | Club Wynwood",
      en: "Rehearsal dinner venue in Wynwood, Miami | Club Wynwood",
    },
    description: {
      es: "Cena de ensayo y fin de semana de boda en Wynwood, Miami: la víspera bajo el pabellón techado, el after-party en el jardín. No vendemos comida: tu catering.",
      en: "Rehearsal dinner venue in Wynwood, Miami: Friday's dinner under the covered Pavilion, Saturday's after-party in the Garden. We don't sell food; you hire your own caterer.",
    },
    cifras: [
      { etiqueta: { es: "Bajo techo (la cena)", en: "Covered (the dinner)" }, valor: { es: "~4.000 ft²", en: "~4,000 sq ft" } },
      { etiqueta: { es: "Al aire libre (el after-party)", en: "Open air (the after-party)" }, valor: { es: "~18.000 ft²", en: "~18,000 sq ft" } },
      { etiqueta: { es: "Al aeropuerto MIA", en: "To MIA airport" }, valor: { es: "~16 min", en: "~16 min" } },
      { etiqueta: { es: "Cabañas amuebladas", en: "Furnished cabanas" }, valor: { es: "6", en: "6" } },
    ],
    foto: {
      src: "/assets/flyer-palapa-lounge.jpg",
      alt: { es: "Bajo el pabellón: un montaje lounge con barra y guirnaldas", en: "Under the Pavilion: a lounge setup with a bar and string lights" },
      pie: { es: "El pabellón montado con barra y guirnaldas: el mismo techo que recoge la cena del viernes.", en: "The Pavilion set up as a lounge with a bar: the same roof that hosts Friday's dinner." },
    },
    bloques: [
      {
        titulo: { es: "No vendemos comida", en: "We don't sell food" },
        cuerpo: {
          es: "La cena de ensayo suele terminar en el salón privado de un restaurante, y ahí las condiciones las pone el restaurante: su carta, su barra y un mínimo de consumo que hay que alcanzar aunque la lista se acorte. Aquí no vendemos comida, así que el catering lo eliges tú: tu menú, tu proveedor y tu número real de invitados. Lo que se contrata es el espacio, y eso tiene su reverso: el alquiler del exterior no incluye vajilla, ni mantelería, ni personal de servicio. Todo eso llega con el catering, que es quien mejor sabe qué necesita para una cena sentada. El sitio pone el suelo, la sombra y la dirección; la mesa la pone tu equipo.",
          en: "A rehearsal dinner usually ends up in a restaurant's private dining room, where the restaurant sets the terms: its menu, its bar and a food-and-beverage minimum you have to meet even if the guest list shrinks. We don't sell food, so you choose the caterer, the menu and the real guest count. What you book is the space, and that has a flip side: the outdoor rental includes no tableware, no linens and no service staff. All of that comes with your caterer, who knows best what a seated dinner needs. We provide the ground, the shade and the address; your team sets the table.",
        },
      },
      {
        titulo: { es: "Viernes bajo el pabellón, sábado en el jardín", en: "Friday under the Pavilion, Saturday in the garden" },
        cuerpo: {
          es: "Los dos espacios están uno al lado del otro, pero no se sienten igual. El Pabellón son ~4.000 ft² de paja a cuatro aguas: techo fijo, abierto por los cuatro costados. Para el sol y para la lluvia vertical basta solo; si la fecha es de viento, conviene presupuestar cierres laterales. Con la luz baja funciona como comedor. Una cena de ensayo el viernes bajo el pabellón y un after-party el sábado en los ~18.000 ft² del jardín ocurren en la misma dirección sin parecer el mismo evento, con una sola visita técnica y un solo interlocutor. Los dos montajes no ocupan el mismo suelo, aunque comparten el paseo de entrada: el orden y los tiempos entre una noche y otra se planifican en la visita.",
          en: "The two spaces are side by side, but they feel very different. The Pavilion is ~4,000 sq ft under a thatched hip roof, open on all four sides; it handles sun and straight-down rain on its own, and on a windy date you should budget for side walls. With the lights down low, it works as a dining room. A Friday rehearsal dinner under the Pavilion and a Saturday after-party across the ~18,000 sq ft Garden happen at the same address without feeling like the same event, with one site visit and one point of contact. The two setups use different spaces but share the entrance walkway, so the order and timing of the two nights are planned at the site visit.",
        },
      },
      {
        titulo: { es: "La comitiva que llega el jueves", en: "For the family flying in on Thursday" },
        cuerpo: {
          es: "En una boda de destino la familia de fuera aterriza el jueves o el viernes, y la primera cita del calendario, la fiesta de bienvenida, es la que ordena a todo el mundo. MIA queda a unos 16 minutos; el resto de tiempos del barrio están en la página Por qué Wynwood. Wynwood Walls queda a unos 4 minutos a pie, así que quien llega temprano tiene barrio que recorrer en vez de un lobby de hotel. El estacionamiento es propio. La carga entra por NW 1st Ct y los invitados por NW 21st Ct: el camión del catering no se cruza con la gente que va llegando, que en una fiesta de bienvenida llega escalonada durante dos horas.",
          en: "At a destination wedding, out-of-town family arrives on Thursday or Friday, and the first event on the calendar — the welcome party — is the one that brings everyone together. MIA is about 16 minutes away (other drive times are on the Why Wynwood page). Wynwood Walls is about a four-minute walk, so guests who arrive early have a neighborhood to explore on foot instead of a hotel lobby. Parking is on site. Vendors load in from NW 1st Ct while guests arrive on NW 21st Ct, so the catering truck never crosses paths with guests, who at a welcome party arrive over a couple of hours.",
        },
      },
      {
        titulo: { es: "Cocina de apoyo, y la fiesta de compromiso", en: "A backup kitchen, and the engagement party" },
        cuerpo: {
          es: "Al aire libre no hay cocina. El edificio, que se alquila aparte desde el 1 de noviembre de 2026, tiene una cocina de apoyo —isla, nevera de dos puertas, microondas y alacenas—, no una cocina de producción. Si tu catering necesita cocinar en sitio, eso se resuelve con equipo móvil y se define en la visita. Club Wynwood tiene licencia de licor propia, con su propio número, y hay área donde montar la barra; el detalle del servicio de bebidas se cierra en la visita. La fiesta de compromiso es otro calendario: llega meses antes, sin ceremonia ni protocolo, y usa uno solo de los dos espacios y de pie. Si son 50 a 150 invitados, la página de eventos pequeños explica cómo se contrata solo el Pabellón.",
          en: "There's no kitchen outdoors. The building — rented separately and available from November 1, 2026 — has a small kitchen (an island, a two-door fridge, a microwave and cabinets), not a commercial kitchen. If your caterer needs to cook on site, that's handled with mobile equipment and agreed at the site visit. Club Wynwood holds its own liquor license, and there's an area to set up a bar; bar service is agreed at the site visit. An engagement party follows a different calendar: it happens months earlier, has no ceremony or timeline, and uses only one of the two spaces, standing. For 50 to 150 guests, see Small events to book just the Pavilion.",
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
    ojo: { es: "Comparación · salón o jardín", en: "Comparison · banquet hall vs. garden" },
    h1: { es: "En vez de un salón", en: "Instead of a banquet hall" },
    respuesta: {
      es: "Club Wynwood es un recinto de fiestas al aire libre en Wynwood, Miami: ~22.000 ft² con ~4.000 ft² techados bajo el pabellón, y no un salón cerrado. Frente a un salón cambian tres cosas: la carga entra por una calle distinta de la de los invitados, el catering lo eliges tú y el recinto tiene licencia de licor propia.",
      en: "Club Wynwood is a ~22,000 sq ft open-air party venue in Wynwood, Miami, with ~4,000 sq ft under the Pavilion — not an enclosed banquet hall. Compared with a hall, three things change: vendors come in on a different street from your guests, you choose your own caterer, and the venue holds its own liquor license.",
    },
    title: {
      es: "Salón de fiestas en Miami, al aire libre | Club Wynwood",
      en: "Outdoor party hall rental in Miami | Club Wynwood",
    },
    description: {
      es: "¿Buscas un salón de fiestas en Miami? Esto es un recinto al aire libre de ~22.000 ft² en Wynwood, con ~4.000 techados, tu catering y licencia de licor propia.",
      en: "Looking for a party hall rental in Miami? This is a ~22,000 sq ft open-air venue in Wynwood, with ~4,000 sq ft under the Pavilion, your choice of caterer and its own liquor license.",
    },
    cifras: [
      { etiqueta: { es: "Techado", en: "Covered" }, valor: { es: "~4.000 ft²", en: "~4,000 sq ft" } },
      { etiqueta: { es: "Entradas separadas", en: "Separate entrances" }, valor: { es: "2", en: "2" } },
      { etiqueta: { es: "Licencia de licor", en: "Liquor license" }, valor: { es: "Propia", en: "Its own" } },
      { etiqueta: { es: "Exterior disponible desde", en: "Available from" }, valor: { es: "1 oct 2026", en: "Oct 1, 2026" } },
    ],
    foto: {
      src: "/assets/flyer-palapa-lounge.jpg",
      alt: { es: "Bajo el pabellón, montado para una fiesta: barra, guirnaldas y techo de paja sobre postes de madera", en: "Under the Pavilion, set up for a party: a bar, string lights and a thatched roof on timber posts" },
      pie: { es: "Un montaje de fiesta bajo el pabellón: lo que en un salón serían moqueta y lámparas, aquí es paja y guirnaldas.", en: "A party setup under the Pavilion: where a hall would have carpet and chandeliers, you get thatch and string lights." },
    },
    bloques: [
      {
        titulo: { es: "Dos calles: la carga por una, los invitados por otra", en: "Two streets: vendors on one, guests on the other" },
        cuerpo: {
          es: "En un salón de banquetes el camión del decorador, el catering y los invitados suelen entrar por la misma puerta, y el montaje queda a la vista. Aquí hay dos entradas en dos calles distintas: la carga entra por NW 1st Ct y los invitados por NW 21st Ct. Eso cambia el día de la fiesta: el decorador puede seguir trabajando mientras llega la gente, la carga del catering no cruza el paseo por donde entran los invitados, y el desmontaje sale por la misma puerta por la que entró. Hay además estacionamiento propio en el predio, que en Wynwood pesa más que en cualquier otro barrio de Miami.",
          en: "At a banquet hall, the decorator's truck, the caterer and the guests usually use the same door, and the setup happens in plain sight. Here there are two entrances on two different streets: vendors come in on NW 1st Ct and guests arrive on NW 21st Ct. That changes the whole day: the decorator can keep working while people arrive, the catering load-in never crosses the guests' path, and everything leaves the way it came in. There's also on-site parking, which matters more in Wynwood than in any other Miami neighborhood.",
        },
      },
      {
        titulo: { es: "Licencia de licor propia, con número propio", en: "Its own liquor license" },
        cuerpo: {
          es: "Es la pregunta que más presupuestos rompe al comparar salones, y conviene hacerla antes de reservar: ¿el sitio tiene licencia de licor propia o depende de un tercero? Club Wynwood tiene licencia de licor de Miami propia, con su propio número, y no todos los venues de la zona la tienen. El número y sus condiciones no se publican: se entregan con la ficha técnica. Hay área donde montar barra bajo el pabellón. Con la comida pasa lo mismo que con la barra: no hay proveedor impuesto. Al aire libre no hay cocina, así que el catering monta en el sitio; si necesita cocina, la del edificio se suma al alquiler como adicional desde el 1 de noviembre de 2026.",
          en: "This is the question that breaks the most budgets when you compare halls, so ask it before you book: does the venue hold its own liquor license, or does it depend on a third party? Club Wynwood holds its own Miami liquor license, which not every venue in the area can say. The license number and its conditions aren't published; they come with the spec sheet. There's room to set up a bar under the Pavilion. Food works the same way: there's no exclusive caterer and no preferred-vendor list. There's no kitchen outdoors, so the caterer sets up on site; if they need a kitchen, the building's kitchen can be added to the rental from November 1, 2026.",
        },
      },
      {
        titulo: { es: "Para qué fiesta es esta página, y para cuál no", en: "Who this page is for, and who it isn't" },
        cuerpo: {
          es: "Quien busca un salón de fiestas suele pensar en una fiesta sentada de entre 150 y 300 personas: un cumpleaños redondo, un aniversario, un bautizo grande, una celebración familiar. Esa es la medida de esta página, y aquí se hace con el jardín y el pabellón juntos; cuánta gente cabe con tu montaje —mesas, pista, barra— está en la página de aforo. Si la fiesta es de 50 a 150 invitados no hace falta contratar el recinto entero: se alquila solo el Pabellón, y eso tiene su propia página, Eventos pequeños. Una quinceañera tiene la suya. Y una activación de marca o una cena de empresa están en corporativo y en fin de año.",
          en: "If you're searching for a banquet hall, you probably have a seated party of 150 to 300 people in mind: a milestone birthday, an anniversary, a large christening, a family celebration. That's the size this page is about, and here it takes the Garden and the Pavilion together; how many people fit with your layout — tables, dance floor, bar — is on the Capacity page. For 50 to 150 guests you don't need the whole venue: the Pavilion can be booked on its own (see Small events). Quinceañeras and Sweet 16s have their own pages, and brand activations and company dinners are under Corporate and Holiday party.",
        },
      },
      {
        titulo: { es: "Cuándo un salón te sirve más", en: "When a banquet hall is the better choice" },
        cuerpo: {
          es: "Si lo que necesitas es aire acondicionado, comida incluida y un precio cerrado por persona, un salón te va a servir mejor que esto. Aquí no hay paredes: el pabellón resuelve el sol y la lluvia que cae recta, pero con viento el agua entra de lado, así que conviene presupuestar cierres laterales como plan de lluvia; en invierno, con más razón. Tampoco hay mobiliario de banquete: lo fijo son las palmeras, los setos, las seis cabañas amuebladas y las mesas de picnic; el resto lo traes tú, y no hay moqueta ni lámparas que discutan con tu decoración. Potencia, baños, plazas de estacionamiento, load-in, curfew y límite de decibelios no se publican: se miden en la visita y se confirman por escrito.",
          en: "If you need air conditioning, food included and a flat price per person, a banquet hall will suit you better. There are no walls here: the Pavilion handles sun and straight-down rain, but wind can blow rain in, so budget for tent side walls as part of your rain plan — especially in winter. There's no banquet furniture either: the fixed pieces are the palms, the hedges, the six furnished cabanas and the picnic tables. Everything else you bring, and there's no carpet or chandeliers competing with your decor. Power, restrooms, parking spaces, load-in, curfew and the decibel limit aren't published: they're measured at the site visit and confirmed in writing.",
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
      es: "Club Wynwood es un venue al aire libre para un Sweet 16 en Wynwood, Miami. Hasta ~150 invitados, se contrata solo el Pabellón: ~4.000 ft² bajo un pabellón abierto por los cuatro costados. Con más invitados, el recinto completo de ~22.000 ft², hasta ~600 de pie. El espacio llega vacío; DJ, catering y decoración los pones tú.",
      en: "Club Wynwood is an outdoor Sweet 16 venue in Wynwood, Miami. For up to ~150 guests, book just the Pavilion: ~4,000 sq ft under a thatched roof, open on all four sides. Bigger parties take the whole ~22,000 sq ft venue, up to ~600 standing. The space comes empty: the DJ, catering and decor come from your own vendors.",
    },
    title: {
      es: "Sweet 16 al aire libre en Wynwood, Miami | Club Wynwood",
      en: "Outdoor Sweet 16 venue in Wynwood, Miami | Club Wynwood",
    },
    description: {
      es: "Sweet 16 al aire libre en Wynwood, Miami: hasta ~150 invitados, solo el Pabellón de ~4.000 ft²; con más, el recinto completo de ~22.000 ft². Llega vacío.",
      en: "Outdoor Sweet 16 venue in Wynwood, Miami: for up to ~150 guests, book just the ~4,000 sq ft Pavilion; for more, the whole ~22,000 sq ft venue. The space comes empty.",
    },
    cifras: [
      { etiqueta: { es: "Solo el Pabellón", en: "Pavilion only" }, valor: { es: "~4.000 ft²", en: "~4,000 sq ft" } },
      { etiqueta: { es: "Recinto completo", en: "Whole venue" }, valor: { es: "~22.000 ft²", en: "~22,000 sq ft" } },
      { etiqueta: { es: "De pie (recinto completo)", en: "Standing (whole venue)" }, valor: { es: "~600", en: "~600" } },
      { etiqueta: { es: "Cabañas fijas", en: "Cabanas" }, valor: { es: "6", en: "6" } },
    ],
    foto: {
      src: "/assets/flyer-paseo-puerta.jpg",
      alt: { es: "El paseo pavimentado entre las dos hileras de palmeras hasta la puerta del edificio, a ras de suelo, con el Pabellón a la izquierda y las cabañas a la derecha: el recorrido de entrada de un Sweet 16", en: "The paved walkway between two rows of palms leading up to the building door, seen from ground level, with the Pavilion on the left and the cabanas on the right: a grand entrance for a Sweet 16" },
      pie: { es: "El paseo: 15 × 108 ft entre dos hileras de palmeras, de la puerta del edificio al estacionamiento.", en: "The walkway: 15 by 108 ft between two rows of palms, from the building door to the parking lot." },
    },
    bloques: [
      {
        titulo: { es: "Lo que preguntan los padres", en: "What the parents ask" },
        cuerpo: {
          es: "Los padres traen otra lista. El predio es un lote privado con setos perimetrales, no un parque ni una calle. Tiene estacionamiento propio, y las dos entradas están separadas: los invitados llegan por NW 21st Ct y la carga entra por NW 1st Ct, así que los camiones del montaje no pasan por la entrada de la fiesta. Cómo se controla el acceso el día del evento —y si hace falta personal de seguridad— se define contigo en la visita técnica. Cuatro datos no se publican porque todavía no están medidos: cuántas plazas tiene el estacionamiento, cuántos baños hay, el límite de dB y la hora de cierre. Los cuatro salen de la visita técnica y se entregan por escrito.",
          en: "Parents come with a different list of questions. The venue is a private lot enclosed by hedges — not a park, not a street. It has its own parking, and the two entrances are separate: guests come in on NW 21st Ct and vendors on NW 1st Ct, so vendor trucks don't use the guest entrance. How access is controlled on the day, and whether you need security staff, is agreed with you at the site visit. Four things we don't publish because they haven't been measured yet: the number of parking spaces, the number of restrooms, the decibel limit and the curfew. All four come out of the site visit, in writing.",
        },
      },
      {
        titulo: { es: "El número de invitados decide qué parte contratas", en: "The guest count decides what you book" },
        cuerpo: {
          es: "Un Sweet 16 rara vez son 300 personas, y la lista de invitados es el primer número que decide qué parte del recinto contratas. Hasta unos 150 invitados, solo el Pabellón: ~4.000 ft² que se contratan sin el jardín y mantienen la fiesta reunida en vez de repartida por un lote que no puede llenar. Con más, el recinto completo: ~18.000 ft² de jardín más el Pabellón, ~22.000 ft² en total, hasta ~600 de pie o ~300 sentados. El Pabellón es además el plan de lluvia —techo de paja, abierto por los cuatro costados, cierres laterales para una fecha de invierno con viento— y tiene su propia página. Cuánta gente cabe bajo el pabellón con tu montaje concreto se confirma en la visita técnica.",
          en: "A Sweet 16 is rarely 300 people, and the guest list is what decides which part of the venue you book. Up to about 150 guests, the Pavilion alone: ~4,000 sq ft that can be booked without the Garden and keep the party together instead of scattered across a space it can't fill. Above that, the whole venue: the ~18,000 sq ft Garden plus the Pavilion, ~22,000 sq ft in all, up to ~600 standing or ~300 seated. The Pavilion is also your rain plan — a thatched roof, open on all four sides, with side walls recommended for a windy winter date — and it has its own page. How many people fit under it with your layout is confirmed at the site visit.",
        },
      },
      {
        titulo: { es: "De pie y con DJ, no un banquete sentado", en: "Standing, with a DJ — not a seated banquet" },
        cuerpo: {
          es: "Una quinceañera va sentada —corte de honor, vals, cena— y el sitio tiene una página para eso. Un Sweet 16 va al revés: DJ, pista de baile, photobooth y casi toda la noche de pie. Por eso la cifra que importa aquí es la de pie, no la de sentados. Los postes y cabios de madera del Pabellón son de donde cuelgan el sonido y las luces; cualquier carga colgada, y la potencia que pide el DJ, se miden y se aprueban en la visita técnica. El paseo pavimentado entre dos hileras de palmeras es la entrada, y ya está hecha. Todo lo demás —catering, DJ, iluminación, mesas y sillas— lo traen tus proveedores: al aire libre no hay cocina y el espacio llega vacío.",
          en: "A quinceañera is a seated event — a court, a waltz, a dinner — and it has its own page. A Sweet 16 is the opposite: a DJ, a dance floor, a photo booth, and most of the night on your feet. That's why the number that matters here is standing capacity, not seated. Sound and lights can hang from the Pavilion's timber posts and rafters; any hanging load, and the DJ's power needs, are measured and approved at the site visit. The paved walkway between the two rows of palms is a ready-made grand entrance. Everything else — catering, DJ, lighting, tables and chairs — comes from your own vendors: there's no kitchen outdoors, and the space comes empty.",
        },
      },
      {
        titulo: { es: "La licencia de licor en una fiesta de menores", en: "The liquor license at a party for minors" },
        cuerpo: {
          es: "El recinto tiene licencia de licor propia y un área donde montar barra. En un Sweet 16 eso plantea la pregunta antes de que nadie la haga: la homenajeada tiene dieciséis y la mayoría de los invitados es menor de 21. Cómo funciona una barra en una fiesta de menores —si la hay para los adultos, quién sirve y en qué condiciones, o si el evento va sin alcohol— no se publica aquí como política: se define con la familia en la visita técnica y queda por escrito, igual que la hora de cierre. Mientras tanto, dos hechos se sostienen: la licencia existe, y el sitio para la barra también. Lo que ninguna página puede decidir por ti se resuelve en persona, antes de confirmar la fecha.",
          en: "The venue has its own liquor license and an area where a bar can be set up. At a Sweet 16, that raises a question before anyone asks it: the guest of honor is sixteen, and most guests are under 21. How a bar works at a party for minors — whether there's one for the adults, who serves and under what conditions, or whether the event is alcohol-free — isn't published here as a policy: it's agreed with the family at the site visit and put in writing, just like the curfew. Two things are certain: the license exists, and so does the space for a bar. Anything a web page can't decide for you is settled in person, before the date is confirmed.",
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
      es: "Club Wynwood alquila un lote al aire libre en Wynwood, Miami, donde un desfile se monta sobre un paseo pavimentado de unos 15 × 108 ft, con el pabellón techado de ~4.000 ft² al costado como backstage y carga por puerta propia. No es sede oficial de Miami Swim Week: es donde se produce el show satélite.",
      en: "Club Wynwood rents an open-air lot in Wynwood, Miami, where a runway show can be set up on a paved walkway of about 15 × 108 ft, with the ~4,000 sq ft covered Pavilion next to it as backstage and its own load-in gate. It isn't an official Miami Swim Week venue: it's where you produce a satellite show.",
    },
    title: {
      es: "Desfiles de moda y satélites de Swim Week | Club Wynwood",
      en: "Runway shows in Wynwood: Swim Week satellites | Club Wynwood",
    },
    description: {
      es: "Venue para desfiles y shows satélite de Swim Week en Wynwood, Miami: un paseo pavimentado de ~15 × 108 ft que ya es pasarela, backstage techado y carga aparte.",
      en: "Runway show venue in Wynwood, Miami, for Swim Week satellite shows: a ~15 × 108 ft paved walkway that's already a runway, a covered backstage and its own load-in gate.",
    },
    cifras: [
      { etiqueta: { es: "Traza de pasarela (según plano)", en: "Runway (per site plan)" }, valor: { es: "~15 × ~108 ft", en: "~15 × ~108 ft" } },
      { etiqueta: { es: "Superficie techada, con aleros", en: "Covered area, incl. eaves" }, valor: { es: "~4.000 ft²", en: "~4,000 sq ft" } },
      { etiqueta: { es: "Cabañas fijas, lado este", en: "Cabanas (east side)" }, valor: { es: "6", en: "6" } },
      { etiqueta: { es: "Exterior reservable desde", en: "Available from" }, valor: { es: "1 oct 2026", en: "Oct 1, 2026" } },
    ],
    foto: {
      src: "/assets/flyer-paseo-puerta.jpg",
      alt: { es: "El paseo pavimentado visto a ras de suelo, recto hasta la puerta del edificio, con las palmeras a los lados", en: "Ground-level view of the paved walkway running straight to the building door, with palms on both sides" },
      pie: { es: "El paseo pavimentado hasta la puerta del edificio, en losas con juntas de césped.", en: "The paved walkway up to the building door: large slabs with turf joints." },
    },
    bloques: [
      {
        titulo: { es: "La traza de la pasarela ya está", en: "The runway is already there" },
        cuerpo: {
          es: "El paseo pavimentado que cruza el recinto mide unos 15 ft de ancho por unos 108 de largo según el plano del sitio, de la puerta del edificio al estacionamiento sur. Son losas grandes con juntas de césped, planas y sin escalones: la traza de la pasarela ya existe, no hay que replantearla ni nivelar terreno. Si el desfile pide superficie continua —tacón fino, dolly, ruedas de cámara— o pasarela elevada, tu producción lo monta encima y el paseo le da la base plana. Las dos hileras de palmeras están plantadas a pie y medio del borde de las losas: dejan los 15 ft libres y entre troncos quedan unos 18 ft. La medida es aproximada hasta contrastarla con el levantamiento del predio.",
          en: "The paved walkway that crosses the property is about 15 ft wide and 108 ft long according to the site plan, from the building door to the south parking lot. It's made of large slabs with turf joints, flat and step-free: the runway already exists, with nothing to mark out and no ground to level. If the show needs a continuous surface — for thin heels, a camera dolly or wheels — or a raised runway, your production builds it on top, and the walkway gives it a flat base. The two rows of palms stand about a foot and a half from the edge of the slabs, so the full 15 ft stays clear, with about 18 ft between trunks. These figures are approximate until they're checked against the survey.",
        },
      },
      {
        titulo: { es: "Los dos costados no son iguales", en: "The two sides aren't the same" },
        cuerpo: {
          es: "Conviene saberlo antes de dibujar el montaje. Al oeste del paseo hay césped y el apron pavimentado de la fachada, con el pabellón detrás: es el costado que admite filas de silla sobre firme. Al este todo es arena, y sobre ella la hilera de seis cabañas amuebladas, que son fijas y cuentan en el plano: sirven de primera fila con sofá, y lo que se siente delante de ellas pide entablado. Cuántas filas admite cada costado se define en la visita. El público entra por el sur, donde desemboca el paseo, así que el remate visual de la pasarela es la fachada del edificio con su puerta y su mural, y las fotos del final del recorrido salen con eso detrás.",
          en: "Worth knowing before you draw the layout. West of the walkway there's turf and the paved area along the building, with the covered Pavilion behind: that's the side with firm ground for rows of chairs. East of the walkway it's all sand, with the row of six furnished cabanas. They're fixed, so they're part of the plan: they work as a sofa front row, and any seating in front of them needs flooring. How many rows fit on each side is decided at the site visit. Guests come in from the south, at the far end of the walkway, so the view at the top of the runway is the building's façade with its door and mural — and that's the backdrop in the photos.",
        },
      },
      {
        titulo: { es: "Backstage a pie de pasarela, carga por otra puerta", en: "Backstage next to the runway, load-in through its own gate" },
        cuerpo: {
          es: "El pabellón está al costado del tramo sur de la pasarela, en la esquina suroeste, con la cumbrera paralela al paseo: unos 54 × 60 ft, ~4.000 ft² techados contando aleros, abierta por los cuatro costados. Queda a pie de pasarela, así que sirve de backstage, maquillaje o sala de prensa sin alquilar carpa; el cierre visual para el cambio de vestuario lo trae tu producción, porque no hay paredes. Los accesos son dos y no se cruzan: la carga entra por NW 1st Ct, al oeste, a la franja pavimentada junto a la fachada, a un paso del pabellón; los invitados por NW 21st Ct, al sur. El ancho del portón y la carga admisible de los cabios se miden en la visita.",
          en: "The Pavilion sits alongside the southern part of the runway, in the southwest corner, with its ridge parallel to the walkway: about 54 × 60 ft, ~4,000 sq ft covered including the eaves, open on all four sides. Because it's right at the edge of the runway, it works as backstage, hair and makeup or a press area without renting a tent; privacy screens for changing are up to your production, since there are no walls. The two entrances never cross: vendors load in from NW 1st Ct, on the west side, onto the paved strip along the building, a few steps from the Pavilion; guests come in from NW 21st Ct, on the south side. Gate width and how much weight the rafters can take are measured at the site visit.",
        },
      },
      {
        titulo: { es: "Luz, lluvia y temporada", en: "Light, rain and timing" },
        cuerpo: {
          es: "Un desfile aquí se hace al anochecer, y el recinto no tiene iluminación de casa: la luz de pasarela la trae tu producción, y la potencia disponible se confirma en la visita. El techo de paja aguanta la lluvia vertical; con viento el agua entra de lado, así que el plan de lluvia debe presupuestar lonas laterales para el pabellón. Aforo sentado y de pie del montaje concreto, curfew, límite de decibelios y número de baños se levantan en la visita y quedan por escrito. Sobre el calendario: el exterior se reserva desde el 1 de octubre de 2026, así que la primera Swim Week vendible es la de 2027; si el show necesita permiso de evento especial de la City of Miami, la conversación útil empieza meses antes.",
          en: "A show here runs at dusk, and the venue has no house lighting: runway lighting is up to your production, and the available power, with its amperage, is confirmed at the site visit. The thatched roof handles straight-down rain, but wind can blow rain in, so your rain plan should include side walls for the Pavilion. Seated and standing capacity for your layout, curfew, decibel limit and number of restrooms are measured at the same visit and put in writing. On timing: the outdoor venue takes bookings from October 1, 2026, so the first Swim Week available is the 2027 edition. If your show needs a City of Miami special-event permit, start the conversation months ahead.",
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
    q: { es: "¿Cuánto cuesta? ¿Publican tarifas?", en: "How much does it cost? Do you publish your rates?" },
    a: {
      es: "No hay tarifa publicada: depende del espacio que uses, las horas, el día y si necesitas montar la víspera. Mándanos la fecha y el número de invitados y te llega el presupuesto con la disponibilidad en 24 horas hábiles, sin compromiso.",
      en: "We don't publish a rate: the price depends on the space you use, the hours, the day, and whether you need to set up the day before. Send us your date and guest count, and you'll get a quote with availability within 24 business hours, with no commitment.",
    },
  },
  {
    q: { es: "¿Cuánta gente cabe?", en: "How many people fit?" },
    a: {
      es: "Aproximadamente 600 personas de pie o 300 sentadas usando el recinto completo. El aforo exacto depende del montaje y se confirma en la visita técnica.",
      en: "About 600 standing or 300 seated using the whole venue. The exact capacity depends on your layout and is confirmed at the site visit.",
    },
  },
  {
    q: { es: "¿Qué pasa si llueve?", en: "What happens if it rains?" },
    a: {
      es: "El Pabellón es un espacio techado de ~4.000 ft² con techo de paja a cuatro aguas, abierto por los costados. Es cubierta fija: funciona como plan de lluvia sin mover el evento de sede. Para el agua que cae recta basta solo; con viento conviene cerrar los costados.",
      en: "The Pavilion is ~4,000 sq ft of covered space under a thatched hip roof, open on the sides. It's a permanent roof, so it works as your rain plan without moving the event. It handles rain that falls straight down; on a windy day, you'll want to add side walls.",
    },
  },
  {
    q: { es: "¿Qué incluye el alquiler de Club Wynwood?", en: "What's included when I rent Club Wynwood?" },
    a: {
      es: "Se alquila el espacio exterior: el Jardín de ~18.000 ft² y el Pabellón techado de ~4.000 ft², por separado o juntos, con las seis cabañas amuebladas y las mesas de picnic que ya están en el jardín. La producción, el catering, el sonido, la iluminación y el mobiliario adicional los aporta tu equipo o tu productora.",
      en: "You rent the outdoor space: the ~18,000 sq ft Garden and the ~4,000 sq ft covered Pavilion, separately or together, with the six furnished cabanas and the picnic tables that are already in the Garden. Production, catering, sound, lighting and any extra furniture come from your team or your production company.",
    },
  },
  {
    q: { es: "¿Puedo traer mi propio catering y mi propia barra?", en: "Can I bring my own caterer and bar?" },
    a: {
      es: "Sí. No hay proveedor impuesto ni comisión por traer el tuyo. Al aire libre no hay cocina: el catering monta en el sitio, o usa la cocina del edificio si lo alquilas también. Hay área donde montar barra.",
      en: "Yes. There's no required vendor and no fee for bringing your own. There's no kitchen outdoors: the caterer sets up on site, or uses the building's kitchen if you rent the building too. There's an area to set up a bar.",
    },
  },
  {
    q: { es: "¿Se pueden alquilar los dos espacios por separado?", en: "Can I rent the two spaces separately?" },
    a: {
      es: "Sí. El Jardín y el Pabellón se alquilan por separado o combinados. Son contiguos y comparten el paseo central, así que juntos funcionan como un solo recinto continuo y no como dos salas.",
      en: "Yes. You can rent the Garden and the Pavilion separately or together. They sit side by side and share the central walkway, so together they work as one continuous venue rather than two separate rooms.",
    },
  },
  {
    q: { es: "¿Hasta qué hora se puede, y con cuánto volumen?", en: "How late can we go, and how loud?" },
    a: {
      es: "El horario límite y el tope de decibelios dependen de la ordenanza de la zona y de la licencia del sitio: se confirman por escrito en la visita técnica. Si tu evento depende de terminar tarde, dilo en la solicitud y lo resolvemos antes de que vengas.",
      en: "The curfew and the decibel limit depend on city rules and the venue's license; both are confirmed in writing at the site visit. If your event depends on running late, tell us when you inquire and we'll sort it out before you visit.",
    },
  },
  {
    q: { es: "¿Hay potencia, parking y baños?", en: "Are there power, parking and restrooms?" },
    a: {
      es: "Sí, y su detalle exacto —amperaje y fase, plazas de parking, número de baños, ancho del portón de carga, curfew y límite de dB— se levanta contigo en la visita técnica y se entrega por escrito. No lo publicamos porque no lo hemos medido nosotros.",
      en: "Yes. The exact details — amperage and phase, number of parking spaces, number of restrooms, freight gate width, curfew and decibel limit — are checked with you at the site visit and confirmed in writing. We don't publish them because we haven't measured them ourselves yet.",
    },
  },
  {
    q: { es: "¿Tiene licencia de licor?", en: "Does it have a liquor license?" },
    a: {
      es: "Sí. El recinto tiene licencia de licor de Miami propia, con su propio número de licencia, cosa que no todos los venues de la zona pueden decir. Hay área donde montar barra; el número de licencia y sus condiciones se entregan con la ficha técnica.",
      en: "Yes. The venue holds its own Miami liquor license, which not every venue in the area can say. There's an area to set up a bar; the license number and its conditions come with the spec sheet.",
    },
  },
  {
    q: { es: "¿Desde cuándo se puede reservar?", en: "When can I book it?" },
    a: {
      es: "El exterior —el Jardín y el Pabellón— está disponible desde el 1 de octubre de 2026. El edificio, desde el 1 de noviembre de 2026. Miami Art Week (30 de noviembre al 6 de diciembre) tiene fechas abiertas: escríbenos con la tuya.",
      en: "The outdoor venue — the Garden and the Pavilion — is available from October 1, 2026, and the building from November 1, 2026. Miami Art Week (November 30 to December 6) still has open dates: send us yours.",
    },
  },
  {
    q: { es: "¿El edificio se puede alquilar como oficina?", en: "Can I rent the building as an office?" },
    a: {
      es: "Sí. El edificio de dos niveles se alquila aparte, para eventos o como oficina, desde el 1 de noviembre de 2026. La cocina es un adicional: se suma al alquiler cuando el catering la necesita.",
      en: "Yes. The two-level building is rented separately, for events or as an office, from November 1, 2026. Its kitchen is an add-on you can include when your caterer needs it.",
    },
  },
  {
    q: { es: "¿Dónde queda exactamente?", en: "Where exactly is it?" },
    a: {
      es: "En 2129 NW 1st Ct, Miami, FL 33127, dentro del Wynwood Arts District. A cuatro minutos a pie de Wynwood Walls, tres del acceso a la I-95, seis de Midtown y el Design District y dieciséis del aeropuerto MIA.",
      en: "At 2129 NW 1st Ct, Miami, FL 33127, in the Wynwood Arts District: a four-minute walk from Wynwood Walls, three minutes from I-95, six from Midtown and the Design District, and sixteen from Miami International Airport.",
    },
  },
  {
    q: { es: "¿Se puede visitar antes de reservar?", en: "Can I visit before booking?" },
    a: {
      es: "Sí, y lo recomendamos. La visita técnica es donde se levantan las cotas, el aforo por montaje y la ficha de infraestructura, y donde tu productora comprueba si el recinto sirve para lo que tiene en la cabeza.",
      en: "Yes, and we recommend it. At the site visit we measure and confirm dimensions, capacity for your layout and the infrastructure details, and your production team can check whether the venue works for what they have in mind.",
    },
  },
];

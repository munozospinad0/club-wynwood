/**
 * FUENTE ÚNICA de los datos del venue.
 *
 * De aquí salen la ficha técnica, el JSON-LD, las páginas de espacios y los
 * textos. Ninguna cifra se escribe suelta en un componente.
 *
 * REGLA: no se publica un dato que no esté aquí con su `fuente`. En el sitio
 * anterior las cifras estaban repetidas por todo el HTML y eso produjo
 * contradicciones reales — la descripción del Jardín habló durante meses de
 * murales perimetrales que no existen.
 */

export type Estado = "verificado" | "en-visita";

export interface Dato {
  clave: string;
  es: string;
  en: string;
  valorEs: string;
  valorEn: string;
  estado: Estado;
  /** De dónde salió. Si no hay fuente, el dato no se publica. */
  fuente?: string;
}

export const VENUE = {
  nombre: "Club Wynwood",
  descriptorEs: "Jardín de eventos al aire libre",
  descriptorEn: "Open-air event garden",
  direccion: {
    calle: "2129 NW 1st Ct",
    ciudad: "Miami",
    region: "FL",
    cp: "33127",
    pais: "US",
  },
  /**
   * OJO: aquí decía +1-786-360-1766. Ese es el teléfono de FunDimension, el
   * operador que hoy arrienda el local — verificado el 2026-08-13 leyendo
   * playawynwood.com. Venía en el diseño original y llegó a estar publicado.
   * El número de Club Wynwood es este.
   */
  telefono: "+1-305-970-7486",
  email: "info@clubwynwood.com",
  /**
   * WhatsApp de consultas: es el de RENE (Daniel, 7-sep-2026). Vacío hasta
   * tener el número: con la cadena vacía el sitio no muestra el botón. Formato
   * internacional sin espacios, por ejemplo "+13055550000".
   */
  whatsapp: "" as string,
  /**
   * ⚠️ Este horario es el del OPERADOR (FunDimension / Playa Wynwood) como local
   * de público, no el nuestro. NO publicarlo como `openingHours` del venue: el
   * alquiler es con cita previa y visita técnica. Se conserva porque condiciona
   * qué fechas están libres de su programación — ver INTELIGENCIA-COMPETENCIA.md.
   */
  horarioOperador: [
    { dias: "Miércoles y jueves", horas: "14:00 – 23:00" },
    { dias: "Viernes", horas: "14:00 – 00:00" },
    { dias: "Sábado", horas: "11:00 – 00:00" },
    { dias: "Domingo", horas: "11:00 – 22:00" },
    { dias: "Lunes y martes", horas: "Cerrado" },
  ],
} as const;

/**
 * ⛔ LO QUE NO SE PUEDE OFRECER
 * Laser tag, arcade, realidad virtual, bowling y bumper cars son del OPERADOR
 * que ocupa el predio (FunDimension), no del inmueble. No entran en el alquiler
 * y no se pueden insinuar en copy ni en imagen.
 */
export const NO_INCLUIDO = [
  "laser tag", "arcade", "realidad virtual", "bowling", "bumper cars", "rock climbing",
] as const;

/**
 * DISPONIBILIDAD Y USOS (Daniel, 7-sep-2026, de sus notas): el exterior se
 * puede reservar desde el 1 de octubre de 2026 y el edificio desde el 1 de
 * noviembre. Dos tipos de uso: evento y oficina (el edificio). La cocina del
 * edificio es un adicional. El recinto tiene licencia de licor propia, con su
 * propio número (no todos los venues la tienen): se dice, no se publica el número.
 */
export const DISPONIBILIDAD = {
  exterior: { desde: "2026-10-01", es: "1 de octubre de 2026", en: "October 1, 2026" },
  edificio: { desde: "2026-11-01", es: "1 de noviembre de 2026", en: "November 1, 2026" },
} as const;
export const USOS = [
  { clave: "evento", es: "Eventos", en: "Events", detalleEs: "El jardín, la palapa, o todo junto; el edificio como salón, camerinos o plan B.", detalleEn: "The garden, the structure, or everything together; the building as a hall, green rooms or plan B." },
  { clave: "oficina", es: "Oficina", en: "Office", detalleEs: "El edificio de dos niveles, desde el 1 de noviembre, como sede o espacio de trabajo.", detalleEn: "The two-level building, from November 1, as a headquarters or workspace." },
  { clave: "cocina", es: "Cocina (adicional)", en: "Kitchen (add-on)", detalleEs: "La cocina del edificio se suma al alquiler cuando el catering la necesita.", detalleEn: "The building's kitchen is added to the rental when catering needs it." },
] as const;
/** Para quién es (Daniel, 7-sep-2026). Manda en la pauta y en el copy. */
export const PARA_QUIEN = [
  { es: "Promotores de restaurantes, clubs y discotecas", en: "Restaurant, club and nightclub promoters" },
  { es: "Promotores de eventos y entretenimiento", en: "Event and entertainment promoters" },
  { es: "Artistas: pintores, escultores, galerías", en: "Artists: painters, sculptors, galleries" },
  { es: "Marcas y agencias de activación", en: "Brands and activation agencies" },
  { es: "Brokers e inmobiliarias", en: "Brokers and real estate" },
  { es: "Productoras y empresas (lanzamientos, cenas, fiestas)", en: "Production companies and corporate (launches, dinners, parties)" },
] as const;

export const ESPACIOS = [
  {
    slug: "jardin",
    es: "El Jardín",
    en: "The Garden",
    sqft: 18000,
    m2: 1672,
    cubierto: false,
    resumenEs:
      "Paseo pavimentado central de la puerta al estacionamiento, césped artificial del lado de la palapa y arena del " +
      "lado de las cabañas, dos hileras de palmeras reales, cuatro cabañas amuebladas, mesas de picnic fijas y setos perimetrales.",
    resumenEn:
      "A central paved walk from the door to the parking, artificial turf on the structure's side and sand on the cabanas' side, " +
      "two rows of real palms, four furnished cabanas, fixed picnic tables and perimeter hedges.",
  },
  {
    slug: "tiki-hut",
    es: "El Tiki Hut",
    en: "The Tiki Hut",
    sqft: 4000,
    m2: 372,
    cubierto: true,
    /**
     * Se dice el límite, y no por escrúpulo: una palapa abierta por los cuatro
     * costados para la lluvia vertical y no la que entra de lado. Un productor
     * que monta en diciembre lo sabe, y descubrir que el sitio no lo dijo cuesta
     * más confianza que decirlo de entrada. Además convierte una objeción en una
     * partida de presupuesto —carpas laterales— que se resuelve en la visita.
     */
    resumenEs:
      "Palapa de paja a cuatro aguas de unos 54 × 60 ft en la esquina suroeste, sobre retícula de postes de madera, " +
      "abierta por los cuatro costados y con piso de césped artificial. Es el plan anti-lluvia: para el sol y para la " +
      "lluvia vertical. Con viento la lluvia entra de lado, así que un evento de invierno conviene que presupueste cierres laterales.",
    resumenEn:
      "A four-hip thatched structure of about 54 × 60 ft in the south-west corner, on a grid of timber posts, " +
      "open on all four sides with an artificial-turf floor. It is the rain plan: it stops sun and vertical rain. " +
      "In wind the rain comes in sideways, so a winter event should budget for side enclosures.",
  },
] as const;

export const FICHA: Dato[] = [
  { clave: "superficie", es: "Superficie total", en: "Total area",
    valorEs: "~22 000 ft² · 2 045 m²", valorEn: "~22,000 sq ft · 2,045 m²",
    estado: "verificado", fuente: "18 000 ft² exteriores declarados por el operador + palapa" },
  { clave: "jardin", es: "Jardín abierto", en: "Open garden",
    valorEs: "~18 000 ft² · 1 672 m²", valorEn: "~18,000 sq ft · 1,672 m²",
    estado: "verificado", fuente: "cifra declarada por la propiedad y repetida en The Vendry y Tagvenue; pendiente de contrastar contra el levantamiento del predio" },
  { clave: "techada", es: "Superficie techada", en: "Covered area",
    valorEs: "~4 000 ft² · 372 m² · paja, cuatro aguas", valorEn: "~4,000 sq ft · 372 m² · thatch, four hips",
    estado: "verificado", fuente: "The Vendry + video del venue" },
  { clave: "aforo", es: "Aforo de pie / sentados", en: "Standing / seated",
    valorEs: "~600 / ~300", valorEn: "~600 / ~300",
    estado: "verificado", fuente: "The Vendry" },
  /**
   * SON CUATRO. Decía ocho, y el ocho salía de una frase de la web del operador
   * («eight stylishly furnished cabanas»). Daniel las contó en el predio el
   * 9-sep-2026. La lección es la fuente, no el número: una cifra del competidor
   * no puede publicarse como verificada nuestra.
   */
  { clave: "cabanas", es: "Cabañas", en: "Cabanas",
    valorEs: "4 amuebladas, en el jardín", valorEn: "4 furnished, in the garden",
    estado: "verificado", fuente: "contadas en el predio (Daniel, 9-sep-2026); van con el inmueble" },
  { clave: "direccion", es: "Dirección", en: "Address",
    valorEs: "2129 NW 1st Ct, Miami FL 33127", valorEn: "2129 NW 1st Ct, Miami FL 33127",
    estado: "verificado", fuente: "Yelp / Wynwood BID / sitio del operador" },
  { clave: "licor-propia", es: "Licencia de licor", en: "Liquor license",
    valorEs: "Propia, con número de licencia propio", valorEn: "Its own, with its own license number",
    estado: "verificado", fuente: "Daniel, 7-sep-2026: licencia de licor de Miami válida para el club, número propio" },
  { clave: "disponibilidad", es: "Disponibilidad", en: "Availability",
    valorEs: "Exterior desde el 1 oct 2026 · edificio desde el 1 nov 2026", valorEn: "Outdoors from Oct 1, 2026 · building from Nov 1, 2026",
    estado: "verificado", fuente: "Daniel, 7-sep-2026" },
  { clave: "accesos", es: "Entradas", en: "Entrances",
    valorEs: "Principal por NW 21st Ct (invitados) · carga por NW 1st Ct", valorEn: "Main on NW 21st Ct (guests) · freight on NW 1st Ct",
    estado: "verificado", fuente: "Daniel, 7-sep-2026: la mercancía no entra por la entrada principal; cenital del flyer" },
  /**
   * EL EDIFICIO, EN CIFRAS. Se alquila aparte y hasta hoy no tenía ni una línea
   * en la ficha: quien preguntaba por él no encontraba nada que leer. Estas son
   * las del listing de Newmark (41534759, en mercado desde el 3-ago-2026), que
   * es quien lo comercializa, y no las del operador.
   *
   * Se publica 15 961 ft² y no los «16 000» del material de marketing: la
   * diferencia es de redondeo, pero el sitio distingue lo medido de lo redondo
   * y ese es justamente el hábito que evitó publicar ocho cabañas.
   */
  { clave: "edificio", es: "Edificio (se alquila aparte)", en: "Building (rented separately)",
    valorEs: "15 961 ft² · 2 niveles · construido en 1940", valorEn: "15,961 sq ft · 2 levels · built in 1940",
    estado: "verificado", fuente: "listing de Newmark 41534759 (LoopNet, ago-2026): área arrendable bruta" },
  { clave: "zonificacion", es: "Zonificación", en: "Zoning",
    valorEs: "T5-O (NRD-1) · comercial, entretenimiento y uso mixto", valorEn: "T5-O (NRD-1) · commercial, entertainment and mixed use",
    estado: "verificado", fuente: "listing de Newmark 41534759 (LoopNet, ago-2026)" },

  // --- Lo que falta medir. Se publica como pendiente, nunca se rellena. ---
  /**
   * Este ya no dice solo «por confirmar»: la propiedad declara un montaje
   * concreto y decirlo ayuda a quien está calculando si le cabe la boda. Pero
   * sigue en `en-visita` a propósito, porque es una cifra declarada y no hay
   * plano cotizado del jardín contra el que comprobarla. Publicar el número sin
   * el «declarado» sería exactamente el error de las ocho cabañas.
   */
  { clave: "aforo-montaje", es: "Aforo por montaje", en: "Capacity per layout",
    valorEs: "Declarado: 24 mesas redondas de 10 + banquete de 60 sobre el paseo; solo la palapa, 16 mesas de 10. Por confirmar contra plano",
    valorEn: "Stated: 24 round tables of 10 + a 60-seat banquet along the walk; the structure alone, 16 tables of 10. To be confirmed against a plan",
    estado: "en-visita", fuente: "ficha comercial del inmueble, 2026 — montaje declarado por la propiedad" },
  { clave: "potencia", es: "Potencia — amperaje y fase", en: "Power — amperage and phase",
    valorEs: "Por confirmar en la visita", valorEn: "To be confirmed at the visit", estado: "en-visita" },
  { clave: "loadin", es: "Load-in — ancho de portón, drive-in", en: "Load-in — gate width, drive-in",
    valorEs: "Por confirmar en la visita", valorEn: "To be confirmed at the visit", estado: "en-visita" },
  { clave: "parking", es: "Parking", en: "Parking",
    valorEs: "Por confirmar en la visita", valorEn: "To be confirmed at the visit", estado: "en-visita" },
  { clave: "curfew", es: "Curfew y límite de dB", en: "Curfew and dB limit",
    valorEs: "Por confirmar en la visita", valorEn: "To be confirmed at the visit", estado: "en-visita" },
  { clave: "banos", es: "Baños", en: "Restrooms",
    valorEs: "Por confirmar en la visita", valorEn: "To be confirmed at the visit", estado: "en-visita" },
];

/**
 * Tiempos aproximados desde el venue. Se muestran siempre como aproximados.
 *
 * Mana Wynwood va primero desde el 9-sep-2026 y no por cercanía geográfica: son
 * seis acres a tres cuadras que en octubre, noviembre y enero traen al barrio
 * III Points, el Real Estate Forum, Red Dot y la Miami Famous Expo. Quien
 * produce una activación satélite alrededor de esos eventos necesita estar
 * cerca y no cabe —o no quiere pagar— el recinto grande. Ese es el argumento
 * comercial más fuerte de la ubicación, así que se publica como dato y no se
 * deja escondido en un documento interno.
 */
export const TIEMPOS = [
  { es: "Mana Wynwood", en: "Mana Wynwood", valor: "3 cuadras", valorEn: "3 blocks" },
  { es: "Wynwood Walls", en: "Wynwood Walls", valor: "4 min a pie", valorEn: "4 min walk" },
  { es: "Acceso I-95", en: "I-95 access", valor: "3 min", valorEn: "3 min" },
  { es: "Midtown / Design District", en: "Midtown / Design District", valor: "6 min", valorEn: "6 min" },
  { es: "Downtown / Brickell", en: "Downtown / Brickell", valor: "9 min", valorEn: "9 min" },
  { es: "Aeropuerto MIA", en: "MIA airport", valor: "16 min", valorEn: "16 min" },
  { es: "Miami Beach", en: "Miami Beach", valor: "18 min", valorEn: "18 min" },
];

/**
 * EL ENTORNO EN CIFRAS — radio de 2 millas.
 *
 * Sirve a un público muy concreto: la marca o la agencia que está decidiendo
 * dónde hacer una activación. A esa gente no la convence el metraje; la
 * convence quién pasa por delante. Son las cifras del flyer comercial del
 * inmueble (Newmark, 2026), y se citan como suyas.
 *
 * No van en la portada ni en la landing de anuncios: ahí estorban a quien busca
 * sitio para una boda. Van en las páginas de corporativo, producción y Art
 * Basel, que es donde alguien las está buscando.
 */
export const ENTORNO = {
  fuente: "flyer comercial del inmueble (Newmark, 2026)",
  radio: { es: "2 millas a la redonda", en: "within a 2-mile radius" },
  datos: [
    { clave: "poblacion", es: "Residentes", en: "Residents", valorEs: "143 912", valorEn: "143,912" },
    { clave: "hogares", es: "Hogares", en: "Households", valorEs: "64 695 · +3,3 % al año", valorEn: "64,695 · +3.3% a year" },
    { clave: "ingreso", es: "Ingreso medio del hogar", en: "Average household income", valorEs: "78 792 USD", valorEn: "USD 78,792" },
    { clave: "gasto", es: "Gasto anual en comida y bebida", en: "Annual food & beverage spend", valorEs: "465 millones USD", valorEn: "USD 465 million" },
    { clave: "edad", es: "Edad media", en: "Average age", valorEs: "38,1 años", valorEn: "38.1 years" },
    { clave: "trafico", es: "Tráfico frente al predio", en: "Traffic in front of the site", valorEs: "18 000 vehículos al día", valorEn: "18,000 vehicles a day" },
  ],
} as const;

/**
 * Medidas del modelo/dibujo, leídas del PLANO DEL SITIO del flyer comercial del
 * predio (Newmark, LoopNet, 2026). La fuente única de la geometría es
 * `lib/recinto.geo.ts`; esto es el resumen legible.
 */
export const GEOMETRIA = {
  /** Lote de esquina: NW 1st Ct al oeste, NW 21st Ct al sur. ±0,78 acres. */
  predioFt: { esteOeste: 131, norteSur: 258 },
  /**
   * Al norte; se alquila aparte. **15 961 ft² de área arrendable bruta** según
   * el listing de Newmark, repartidos en dos niveles: abajo la nave de doble
   * altura con cocina y baños, arriba un mezanine con cuatro cuartos cerrados.
   * Decía «16 000 SF con el altillo», que es el redondeo del material de
   * marketing.
   */
  edificioFt: { ancho: 120, fondo: 104, niveles: 2, sqft: 15961, anoConstruccion: 1940 },
  /** De la puerta del edificio a la calle de maniobra del estacionamiento sur. */
  paseoFt: { ancho: 15, largo: 108 },
  /** En la esquina suroeste, contra el seto de NW 1st Ct y con el estacionamiento sur delante; cumbrera paralela al paseo. */
  palapaFt: { largo: 60, ancho: 54 },
  postes: { filas: 3, porFila: 3, entreEjesFt: 24 },
  aleroFt: 11,
  cumbreraFt: 34,
  cabanas: 4,
  nota:
    "Disposición según el plano del sitio del flyer comercial del predio, contrastado con la foto cenital y las aéreas; medidas aproximadas. " +
    "El dibujo se rotula como esquema sin escala fina hasta contrastarlo con el boundary survey.",
} as const;

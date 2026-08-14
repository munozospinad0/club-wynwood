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

export const ESPACIOS = [
  {
    slug: "jardin",
    es: "El Jardín",
    en: "The Garden",
    sqft: 18000,
    m2: 1672,
    cubierto: false,
    resumenEs:
      "Paseo pavimentado central, franjas de césped artificial a ambos lados, dos hileras " +
      "de palmeras reales, ocho cabañas amuebladas, mesas de picnic fijas y setos perimetrales.",
    resumenEn:
      "A central paved walk, artificial turf strips on both sides, two rows of real palms, " +
      "eight furnished cabanas, fixed picnic tables and perimeter hedges.",
  },
  {
    slug: "tiki-hut",
    es: "El Tiki Hut",
    en: "The Tiki Hut",
    sqft: 4000,
    m2: 372,
    cubierto: true,
    resumenEs:
      "Palapa larga y paralela al paseo, techo de paja a cuatro aguas sobre dos hileras de " +
      "postes de madera, abierta por los cuatro costados. Es el plan anti-lluvia.",
    resumenEn:
      "A long palapa parallel to the walk, four-hip thatch roof on two rows of timber posts, " +
      "open on all four sides. It is the rain plan.",
  },
] as const;

export const FICHA: Dato[] = [
  { clave: "superficie", es: "Superficie total", en: "Total area",
    valorEs: "~22 000 ft² · 2 045 m²", valorEn: "~22,000 sq ft · 2,045 m²",
    estado: "verificado", fuente: "18 000 ft² exteriores declarados por el operador + palapa" },
  { clave: "jardin", es: "Jardín abierto", en: "Open garden",
    valorEs: "~18 000 ft² · 1 672 m²", valorEn: "~18,000 sq ft · 1,672 m²",
    estado: "verificado", fuente: "fundimensionusa.com — 'eight stylishly furnished cabanas / 18,000 sq ft of outdoor event space'" },
  { clave: "techada", es: "Superficie techada", en: "Covered area",
    valorEs: "~4 000 ft² · 372 m² · paja, cuatro aguas", valorEn: "~4,000 sq ft · 372 m² · thatch, four hips",
    estado: "verificado", fuente: "The Vendry + video del venue" },
  { clave: "aforo", es: "Aforo de pie / sentados", en: "Standing / seated",
    valorEs: "~600 / ~300", valorEn: "~600 / ~300",
    estado: "verificado", fuente: "The Vendry" },
  { clave: "cabanas", es: "Cabañas", en: "Cabanas",
    valorEs: "8 amuebladas, en el jardín", valorEn: "8 furnished, in the garden",
    estado: "verificado", fuente: "fundimensionusa.com + confirmado por Daniel: van con el predio" },
  { clave: "direccion", es: "Dirección", en: "Address",
    valorEs: "2129 NW 1st Ct, Miami FL 33127", valorEn: "2129 NW 1st Ct, Miami FL 33127",
    estado: "verificado", fuente: "Yelp / Wynwood BID / sitio del operador" },

  // --- Lo que falta medir. Se publica como pendiente, nunca se rellena. ---
  { clave: "aforo-montaje", es: "Aforo por montaje", en: "Capacity per layout",
    valorEs: "Por confirmar en la visita", valorEn: "To be confirmed at the visit", estado: "en-visita" },
  { clave: "potencia", es: "Potencia — amperaje y fase", en: "Power — amperage and phase",
    valorEs: "Por confirmar en la visita", valorEn: "To be confirmed at the visit", estado: "en-visita" },
  { clave: "loadin", es: "Load-in — ancho de portón, drive-in", en: "Load-in — gate width, drive-in",
    valorEs: "Por confirmar en la visita", valorEn: "To be confirmed at the visit", estado: "en-visita" },
  { clave: "parking", es: "Parking", en: "Parking",
    valorEs: "Por confirmar en la visita", valorEn: "To be confirmed at the visit", estado: "en-visita" },
  { clave: "licor", es: "Licencia de licor", en: "Liquor license",
    valorEs: "Por confirmar en la visita", valorEn: "To be confirmed at the visit", estado: "en-visita" },
  { clave: "curfew", es: "Curfew y límite de dB", en: "Curfew and dB limit",
    valorEs: "Por confirmar en la visita", valorEn: "To be confirmed at the visit", estado: "en-visita" },
  { clave: "banos", es: "Baños", en: "Restrooms",
    valorEs: "Por confirmar en la visita", valorEn: "To be confirmed at the visit", estado: "en-visita" },
];

/** Tiempos aproximados desde el venue. Se muestran siempre como aproximados. */
export const TIEMPOS = [
  { es: "Wynwood Walls", en: "Wynwood Walls", valor: "4 min a pie", valorEn: "4 min walk" },
  { es: "Acceso I-95", en: "I-95 access", valor: "3 min", valorEn: "3 min" },
  { es: "Midtown / Design District", en: "Midtown / Design District", valor: "6 min", valorEn: "6 min" },
  { es: "Downtown / Brickell", en: "Downtown / Brickell", valor: "9 min", valorEn: "9 min" },
  { es: "Aeropuerto MIA", en: "MIA airport", valor: "16 min", valorEn: "16 min" },
  { es: "Miami Beach", en: "Miami Beach", valor: "18 min", valorEn: "18 min" },
];

/** Medidas del modelo/dibujo. Estimadas: no hay site plan del propietario. */
export const GEOMETRIA = {
  predioFt: { largo: 240, ancho: 92 },
  palapaFt: { largo: 134, ancho: 30 },
  postes: { filas: 2, porFila: 6, entreEjesFt: 27 },
  aleroFt: 11,
  cumbreraFt: 26,
  nota:
    "Medidas estimadas a partir de los pies² declarados y del video del venue. " +
    "No existe plano CAD del propietario: el dibujo se rotula siempre como esquema sin escala.",
} as const;

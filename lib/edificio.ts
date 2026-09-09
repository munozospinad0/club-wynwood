/**
 * LA ZONA INTERIOR — el edificio.
 *
 * Daniel confirmó que el interior que hoy ocupa FunDimension va a quedar libre
 * y también se alquila, y fijó la regla: "todo lo que sea de FunDimension pues
 * no, pero sí detallas el plano del edificio".
 *
 * LA REGLA, que es la misma que ya aplicamos con las máquinas del jardín:
 *   el cascarón es del INMUEBLE · el montaje es del OPERADOR
 *
 * Por eso aquí están la cocina, los baños, las salas y las alturas, y NO están
 * el laser tag, el gaming, el climbing, el spin ni la redención. Ni en el
 * dibujo, ni en el texto, ni en el schema.
 *
 * FUENTE: planos ID-SK-01 / ID-SK-02, Hallock Design Group, 7 sep 2016.
 * Dos avisos que viajan con cada dato:
 *   - El plano rotula 2501 NW 1st Court y el venue es 2129 NW 1st Ct. Pendiente
 *     de verificar; hasta entonces todo esto es "en visita".
 *   - El propio plano dice ALL DIMENSIONS MUST BE FIELD VERIFIED.
 * El dibujo de Hallock NO se reproduce: se usan los hechos para dibujar el
 * nuestro. Su lámina lleva copyright expreso.
 */

export type Duenio = "inmueble" | "operador";

export interface Recinto {
  nombre: { es: string; en: string };
  sqft: number;
  /** Solo se dibuja y se publica lo del inmueble. */
  duenio: Duenio;
  /** Espacio cerrado con puerta, o superficie diáfana. */
  tipo: "sala" | "servicio" | "diafano";
}

/** Nivel 01. Superficies del plano de 2016. */
export const NIVEL_01: Recinto[] = [
  // --- del inmueble: es lo que se alquila ---
  { nombre: { es: "Cocina", en: "Kitchen" }, sqft: 580, duenio: "inmueble", tipo: "servicio" },
  { nombre: { es: "Sala / teatro", en: "Theater room" }, sqft: 504, duenio: "inmueble", tipo: "sala" },
  { nombre: { es: "Almacén y A.V.", en: "Storage & A.V." }, sqft: 291, duenio: "inmueble", tipo: "servicio" },
  { nombre: { es: "Oficina", en: "Office" }, sqft: 93, duenio: "inmueble", tipo: "sala" },

  // --- del operador: NO se alquila, NO se dibuja, NO se nombra ---
  { nombre: { es: "—", en: "—" }, sqft: 3009, duenio: "operador", tipo: "diafano" },
  { nombre: { es: "—", en: "—" }, sqft: 2080, duenio: "operador", tipo: "diafano" },
  { nombre: { es: "—", en: "—" }, sqft: 757, duenio: "operador", tipo: "diafano" },
  { nombre: { es: "—", en: "—" }, sqft: 744, duenio: "operador", tipo: "diafano" },
  { nombre: { es: "—", en: "—" }, sqft: 457, duenio: "operador", tipo: "diafano" },
  { nombre: { es: "—", en: "—" }, sqft: 364, duenio: "operador", tipo: "diafano" },
  { nombre: { es: "—", en: "—" }, sqft: 231, duenio: "operador", tipo: "diafano" },
  { nombre: { es: "—", en: "—" }, sqft: 167, duenio: "operador", tipo: "diafano" },
  { nombre: { es: "—", en: "—" }, sqft: 140, duenio: "operador", tipo: "diafano" },
];

/** Nivel 02: cinco salas privadas y servicios. Todo del inmueble. */
export const NIVEL_02: Recinto[] = [
  { nombre: { es: "Sala privada 01", en: "Private room 01" }, sqft: 301, duenio: "inmueble", tipo: "sala" },
  { nombre: { es: "Sala privada 02", en: "Private room 02" }, sqft: 282, duenio: "inmueble", tipo: "sala" },
  { nombre: { es: "Sala privada 03", en: "Private room 03" }, sqft: 276, duenio: "inmueble", tipo: "sala" },
  { nombre: { es: "Sala privada 04", en: "Private room 04" }, sqft: 253, duenio: "inmueble", tipo: "sala" },
  { nombre: { es: "Sala privada 05", en: "Private room 05" }, sqft: 252, duenio: "inmueble", tipo: "sala" },
  { nombre: { es: "Sala de equipo", en: "Crew lounge" }, sqft: 238, duenio: "inmueble", tipo: "sala" },
  { nombre: { es: "Oficina", en: "Office" }, sqft: 222, duenio: "inmueble", tipo: "sala" },
  { nombre: { es: "Oficina", en: "Office" }, sqft: 131, duenio: "inmueble", tipo: "sala" },
];

/**
 * Cotas leídas del plano, no deducidas. Deducir de los ft² declarados es lo que
 * dejó mal la lámina 01 del exterior.
 */
export const COTAS = {
  luzPrincipalFt: "53′-4″",
  luzDobleAlturaFt: "56′-5½″",
  fondoFt: "32′-10″",
  crujiaFt: "17′-4″",
  alturaPlantaFt: 12,
  alturaDobleFt: 22,
} as const;

/**
 * Lo que de verdad decide una productora, en un vistazo.
 *
 * ⚠️ HOY NO LA CONSUME NINGÚN COMPONENTE (comprobado el 9-sep-2026). Se conserva
 * porque los datos son buenos y la lámina del edificio acabará usándolos, pero
 * quien la enchufe tiene que leer antes el aviso de la fila «Cocina»: este array
 * llegó a afirmar cosas que ninguna fuente sostiene, y precisamente por no estar
 * publicado nadie las revisaba.
 */
export const CLAVES = [
  {
    etiqueta: { es: "Altura libre máxima", en: "Max clear height" },
    valor: "22 ft",
    nota: {
      es: "En la zona a doble altura. Es el dato que una productora pregunta antes que ninguno.",
      en: "In the double-height zone. The figure a production company asks for before any other.",
    },
  },
  {
    etiqueta: { es: "Altura en planta", en: "Ground-floor height" },
    valor: "12 ft",
    nota: { es: "En el resto del nivel 01.", en: "Across the rest of level 01." },
  },
  /**
   * ⚠️ DECÍA «COCINA COMERCIAL CON CAMPANA DE EXTRACCIÓN · 580 ft²», Y NINGUNA
   * DE LAS TRES COSAS TENÍA FUENTE.
   *
   * Comprobado el 9-sep-2026 contra todo el material del inmueble: «campana»,
   * «hood» y «580» no aparecen ni una vez, ni en el flyer de Newmark de 2026 ni
   * en el brochure de 2015. Los 580 ft² salían de la lámina ID-SK-01, que este
   * proyecto cita como fuente y **nadie tiene**: el broker solo publicó la
   * ID-SK-02. Y la única fotografía que existe de una cocina en el predio
   * muestra una isla de cuarzo, una nevera doméstica de dos puertas, un
   * microondas y alacenas: un office dentro de una nave, no una línea de
   * producción.
   *
   * Es la clase de promesa que un catering desmonta en cinco minutos de visita
   * técnica, y de las que cuestan el contrato. Se baja al nivel que sí aguanta,
   * el mismo que ya usa la FAQ. El metraje se retira hasta que llegue la lámina
   * que falta; el recinto se queda, porque la foto prueba que existe.
   */
  {
    etiqueta: { es: "Cocina", en: "Kitchen" },
    /* Guion largo = no hay dato. Es lo cierto mientras falte la lámina ID-SK-01. */
    valor: "—",
    nota: {
      es: "Equipada, en el nivel 01. Se suma al alquiler cuando el catering la necesita. Superficie por confirmar.",
      en: "Equipped, on level 01. It is added to the rental when catering needs it. Area to be confirmed.",
    },
  },
  {
    etiqueta: { es: "Salas privadas", en: "Private rooms" },
    valor: "5",
    nota: {
      es: "Nivel 02, entre 252 y 301 ft². Green room, sala de novia, oficina de producción.",
      en: "Level 02, between 252 and 301 sq ft. Green room, bridal suite, production office.",
    },
  },
] as const;

export function totalInmueble(nivel: Recinto[]): number {
  return nivel.filter((r) => r.duenio === "inmueble").reduce((s, r) => s + r.sqft, 0);
}

/**
 * Se exporta para test: ninguna atracción del operador puede llegar a la
 * interfaz. Es el error más caro que podríamos cometer en este proyecto.
 */
export const PROHIBIDO = [
  "laser tag", "laser", "arcade", "gaming", "climbing", "spin",
  "bowling", "bumper", "redemption", "vest",
] as const;

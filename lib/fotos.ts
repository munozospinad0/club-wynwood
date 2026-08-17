/**
 * MANIFIESTO DE FOTOS.
 *
 * Hoy hay 4 imágenes cubriendo 17 huecos: la aérea sale en cinco páginas y las
 * otras se repiten en el resto. Funciona, pero se nota, y es el techo real del
 * sitio ahora mismo — ninguna maqueta arregla no tener material.
 *
 * `recinto-noche.jpg` NO es una foto: es un fotograma del vídeo de la fiesta
 * (IMG_5627), girado 90°. Al ser un plano cenital no tiene arriba ni abajo, así
 * que girarlo convierte el vertical de 1080×1920 en un 16/9 de 1920×1080 exacto
 * sin recortar un píxel. Ver VIDEOS.md: del resto de ese vídeo casi nada se
 * puede usar, porque son primeros planos de invitados de una fiesta privada.
 *
 * Este archivo es la lista de qué foto va en cada sitio. Cuando llegue una
 * nueva, se deja en /public/assets con el nombre de `archivo` y aparece sola:
 * no hay que tocar ningún componente.
 *
 * Mientras un hueco no tenga su foto, el componente <Foto> pinta un marcador
 * con el encargo escrito encima. Es a propósito: un hueco visible se rellena,
 * y una foto repetida por quinta vez pasa desapercibida hasta que la ve el
 * cliente.
 */

export type Prioridad = "alta" | "media" | "baja";

export interface Hueco {
  /** Identificador estable. No cambiarlo: es lo que usan los componentes. */
  id: string;
  /** Nombre del archivo en /public/assets. */
  archivo: string;
  /** ¿Existe ya, o es un encargo pendiente? */
  existe: boolean;
  /** Proporción a la que se recorta. */
  proporcion: "16/9" | "3/2" | "4/3" | "1/1";
  /** Dónde sale. */
  donde: string;
  /** Qué tiene que enseñar. Esto es el encargo al fotógrafo. */
  encargo: { es: string; en: string };
  /** Texto alternativo. Describe la imagen, no repite el titular. */
  alt: { es: string; en: string };
  prioridad: Prioridad;
}

export const HUECOS: Hueco[] = [
  // ---------------------------------------------------------------- YA HAY
  {
    id: "aerea",
    archivo: "aerea-predio.jpg",
    existe: true,
    proporcion: "3/2",
    donde: "Portada, /bodas/, /eventos-corporativos/, /aforo-y-montajes/, /art-basel/",
    encargo: {
      es: "Vista aérea del predio completo desde el aire, con la palapa, el paseo y el jardín.",
      en: "Aerial view of the whole site, with the structure, the walk and the garden.",
    },
    alt: {
      es: "Vista aérea del predio: la palapa techada, el paseo central y el jardín con palmeras",
      en: "Aerial view of the site: the covered structure, the central walk and the palm garden",
    },
    prioridad: "alta",
  },
  {
    id: "paseo",
    archivo: "venue-exterior.webp",
    existe: true,
    proporcion: "3/2",
    donde: "/el-jardin/, /produccion-y-rodajes/, /quinceaneras/, /pop-ups/, /por-que-wynwood/",
    encargo: {
      es: "El paseo pavimentado a ras de suelo, entre las dos hileras de palmeras.",
      en: "The paved walk at ground level, between the two rows of palms.",
    },
    alt: {
      es: "El paseo pavimentado del jardín entre dos hileras de palmeras, con la palapa al fondo",
      en: "The garden's paved walk between two rows of palms, with the structure behind",
    },
    prioridad: "alta",
  },
  {
    id: "bajo-palapa",
    archivo: "venue-palapa.webp",
    existe: true,
    proporcion: "3/2",
    donde: "/tiki-hut/, /eventos-pequenos/, /fiesta-de-fin-de-ano/",
    encargo: {
      es: "Bajo la palapa mirando al techo: la estructura de paja sobre los postes.",
      en: "Under the structure looking up: the thatch on the timber posts.",
    },
    alt: {
      es: "Bajo la palapa: techo de paja a cuatro aguas sobre postes de madera, abierta por los costados",
      en: "Under the structure: four-hipped thatch roof on timber posts, open on the sides",
    },
    prioridad: "alta",
  },

  // ------------------------------------------------------------- FALTAN
  {
    id: "palapa-exterior",
    archivo: "palapa-exterior.jpg",
    existe: false,
    proporcion: "3/2",
    donde: "/tiki-hut/ — abriría la página con el volumen entero",
    encargo: {
      es: "La palapa ENTERA desde fuera y de día, a la altura de los ojos. Es la foto que falta para saber qué forma tiene: hoy solo hay una de dentro y una aérea, y por eso el plano la dibuja mal.",
      en: "The WHOLE structure from outside, in daylight, at eye level. This is the missing shot: today there is only an interior and an aerial, which is why the plate draws it wrong.",
    },
    alt: {
      es: "La palapa de paja completa vista desde el jardín, con las palmeras alrededor",
      en: "The complete thatched structure seen from the garden, with palms around it",
    },
    prioridad: "alta",
  },
  {
    id: "jardin-vacio",
    archivo: "jardin-vacio.jpg",
    existe: false,
    proporcion: "16/9",
    donde: "/el-jardin/, /aforo-y-montajes/",
    encargo: {
      es: "El jardín VACÍO y de día, sin montaje, desde un extremo. Todo el sitio vende «un recinto en blanco» y no existe ni una foto que lo enseñe vacío.",
      en: "The garden EMPTY and in daylight, with nothing set up, from one end. The whole site sells “a blank site” and there is not one photograph showing it empty.",
    },
    alt: {
      es: "El jardín sin montaje: césped, paseo pavimentado y setos perimetrales",
      en: "The garden with nothing set up: turf, paved walk and perimeter hedges",
    },
    prioridad: "alta",
  },
  {
    id: "cabanas",
    archivo: "cabanas.jpg",
    existe: false,
    proporcion: "3/2",
    donde: "/el-jardin/, /eventos-pequenos/",
    encargo: {
      es: "Las ocho cabañas amuebladas, o al menos tres o cuatro en fila. Salen en la ficha técnica como dato verificado y no hay ninguna foto suya.",
      en: "The eight furnished cabanas, or at least three or four in a row. They appear in the spec sheet as verified data and there is no photograph of them.",
    },
    alt: {
      es: "Cabañas amuebladas en el jardín, con asientos y cortinas",
      en: "Furnished cabanas in the garden, with seating and curtains",
    },
    prioridad: "alta",
  },
  {
    id: "evento-montado",
    archivo: "evento-montado.jpg",
    existe: false,
    proporcion: "16/9",
    donde: "Portada, /bodas/, /graduaciones/",
    encargo: {
      es: "Un evento REAL montado en el sitio, con gente. Da igual cuál. Es la foto que más convierte y no hay ninguna: hoy un visitante tiene que imaginarse el sitio lleno.",
      en: "A REAL event set up on site, with people. Any event. It is the highest-converting shot and there is none: today a visitor has to imagine the place full.",
    },
    alt: {
      es: "Un evento montado en el recinto, con mesas e invitados bajo la palapa",
      en: "An event set up on site, with tables and guests under the structure",
    },
    prioridad: "alta",
  },
  {
    id: "noche",
    archivo: "recinto-noche.jpg",
    existe: true,
    proporcion: "16/9",
    donde: "/fiesta-de-fin-de-ano/, /art-basel/, /bodas/",
    encargo: {
      es: "El recinto de noche con la iluminación encendida. Media de los eventos que se venden aquí son de noche y no hay una sola foto nocturna.",
      en: "The site at night with the lighting on. Half the events sold here happen at night and there is not a single night photograph.",
    },
    alt: {
      es: "Vista cenital del recinto al anochecer: el techo de paja, el paseo con alfombra roja y las palmeras iluminadas desde el tronco",
      en: "Overhead view of the site at dusk: the thatch roof, the walk with a red carpet and the palms uplit from the trunk",
    },
    prioridad: "media",
  },
  {
    id: "acceso",
    archivo: "acceso-calle.jpg",
    existe: false,
    proporcion: "3/2",
    donde: "/por-que-wynwood/, /organizar-un-evento-en-wynwood/",
    encargo: {
      es: "La entrada desde NW 1st Ct: la fachada y el portón. Sirve para dos cosas —que el invitado reconozca por dónde entra, y que un productor vea el acceso de carga—.",
      en: "The entrance from NW 1st Ct: the frontage and the gate. It serves two purposes — guests recognise where to come in, and a producer sees the load-in access.",
    },
    alt: {
      es: "El acceso al recinto desde NW 1st Ct, con el portón de entrada",
      en: "The site entrance from NW 1st Ct, with the gate",
    },
    prioridad: "media",
  },
  {
    id: "barrio",
    archivo: "wynwood-murales.jpg",
    existe: false,
    proporcion: "16/9",
    donde: "/por-que-wynwood/, /art-basel/",
    encargo: {
      es: "Los murales del barrio a pocos metros del predio. Todo el argumento de ubicación se apoya en ellos y no hay ninguna foto que los enseñe.",
      en: "The neighbourhood murals a few metres from the site. The whole location argument rests on them and no photograph shows them.",
    },
    alt: {
      es: "Murales del Wynwood Arts District cerca del recinto",
      en: "Wynwood Arts District murals near the site",
    },
    prioridad: "baja",
  },
];

export const porId = (id: string) => HUECOS.find((h) => h.id === id);
export const faltan = () => HUECOS.filter((h) => !h.existe);
export const cubiertos = () => HUECOS.filter((h) => h.existe);

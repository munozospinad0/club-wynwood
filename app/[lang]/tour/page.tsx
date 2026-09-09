import Image from "next/image";
import type { Metadata } from "next";
import { asIdioma, BASE, IDIOMAS, type Idioma } from "@/lib/i18n";
import { FICHA, VENUE, DISPONIBILIDAD, USOS } from "@/lib/venue";
import Recorrido from "@/components/Recorrido";
import Formulario from "@/components/Formulario";
import BotonRecorrido from "@/components/BotonRecorrido";
import { Simbolo } from "@/components/Marca";
import "@/app/landing.css";

/**
 * LA PÁGINA A LA QUE LLEGAN LOS ANUNCIOS.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * POR QUÉ EXISTE, SI YA HAY DIECISIETE PÁGINAS
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Las páginas del sitio están escritas para quien busca y compara: explican,
 * enlazan a sus vecinas y dejan al visitante seguir leyendo. Eso es exactamente
 * lo que NO conviene cuando el clic se ha pagado. Aquí solo hay un camino:
 * mirar el recorrido y pedir disponibilidad.
 *
 * Lo que la hace distinta de un folleto:
 *
 * · **El recorrido va primero, no al final.** Es lo único que ningún competidor
 *   tiene. Tres minutos narrados sobre el plano contestan las ocho preguntas de
 *   un productor mejor que cualquier párrafo, y de paso dejan medido quién se
 *   quedó hasta el final: ese es el público que vale.
 * · **Las cifras son las verificadas de la ficha**, no una promesa de campaña.
 *   Si `venue.ts` cambia, esto cambia. No hay una segunda versión de la verdad
 *   escrita a mano, que es como los datos de una landing acaban mintiendo.
 * · **Se dice lo que NO se incluye** antes del formulario. Cualificar en la
 *   página es más barato que cualificar por teléfono: con 2-4 solicitudes al
 *   mes, un formulario de alguien que quiere catering incluido cuesta más que
 *   un formulario menos.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * NO SE INDEXA, Y ES A PROPÓSITO
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Compite con las páginas orgánicas por las mismas consultas y las canibaliza.
 * Va `noindex, follow`: los rastreadores de anuncios entran igual —no dependen
 * de esta etiqueta— y el buscador sigue mandando a la página que sí está
 * escrita para él. Por lo mismo no entra en el sitemap ni en el pie.
 */

export const dynamicParams = false;
export function generateStaticParams() {
  return IDIOMAS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = asIdioma_(await params);
  const es = lang === "es";
  return {
    title: es
      ? "Club Wynwood — Recorrido de 3 minutos y disponibilidad"
      : "Club Wynwood — 3-minute tour and availability",
    description: es
      ? "Jardín al aire libre de ~22.000 ft² en Wynwood, Miami. Mira el recorrido narrado y pide disponibilidad real."
      : "~22,000 sq ft open-air garden in Wynwood, Miami. Watch the narrated tour and request real availability.",
    // Ver el comentario de arriba: no compite con las páginas orgánicas.
    robots: { index: false, follow: true },
    alternates: { canonical: `${BASE}/${lang}/tour` },
  };
}

function asIdioma_(p: { lang: string }) {
  return { lang: asIdioma(p.lang) };
}

export default async function Landing({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = asIdioma_(await params);
  const es = lang === "es";
  const t = TEXTO[lang];

  /**
   * Las cuatro cifras que deciden, sacadas de la ficha verificada.
   *
   * Se recorta en el primer separador porque la ficha guarda el dato completo
   * —«~4 000 ft² · 372 m² · paja, cuatro aguas»— y eso, puesto en fila en una
   * portada, deja de ser una cifra y pasa a ser una frase: rompe el ritmo y ya
   * no se lee de un vistazo. El detalle entero sigue estando en la ficha
   * técnica; aquí solo hace falta lo que se escanea. La fuente sigue siendo
   * `venue.ts`, así que no hay una segunda versión de la verdad.
   */
  /**
   * ⚠️ Se parte por «·» y NUNCA por la coma a secas: en inglés la coma es el
   * separador de millares, así que «~22,000 sq ft» se quedaba en «~22». Solo
   * después, si lo que queda sigue siendo una frase, se corta en la coma.
   */
  const corta = (v: string) => {
    const primero = v.split("·")[0].trim();
    return primero.length > 18 ? primero.split(",")[0].trim() : primero;
  };
  const clave = ["superficie", "aforo", "techada", "cabanas"] as const;
  const cifras = clave
    .map((c) => FICHA.find((f) => f.clave === c))
    .filter((f): f is NonNullable<typeof f> => Boolean(f));

  return (
    <>
      {/* ── la promesa, y la única pregunta que se hace ────────────────── */}
      <section className="lp-hero">
        <div className="lp-hero-txt">
          <p className="ojo">{t.ojo}</p>
          <h1 className="lp-h1">{t.h1}</h1>
          <p className="lp-lead">{t.lead}</p>

          <ul className="lp-cifras">
            {cifras.map((f) => (
              <li key={f.clave}>
                <strong>{corta(es ? f.valorEs : f.valorEn)}</strong>
                <span className="ojo">{es ? f.es : f.en}</span>
              </li>
            ))}
          </ul>

          <div className="lp-acciones">
            <BotonRecorrido lang={lang} />
            <a href="#pedir" className="boton boton-fantasma">{t.cta2}</a>
          </div>

          <p className="lp-nota">
            {es
              ? `Exterior disponible desde el ${DISPONIBILIDAD.exterior.es} · edificio desde el ${DISPONIBILIDAD.edificio.es}.`
              : `Outdoors available from ${DISPONIBILIDAD.exterior.en} · the building from ${DISPONIBILIDAD.edificio.en}.`}
          </p>
        </div>

        <figure className="lp-foto">
          <Image
            src="/assets/edificio-calle.jpg"
            alt={es
              ? "El edificio desde NW 1st Ct: nave de dos niveles, portón de carga abierto y el mural en la esquina"
              : "The building from NW 1st Ct: a two-level warehouse, the freight gate open and the mural on the corner"}
            width={2047}
            height={1365}
            priority
            sizes="(max-width: 900px) 100vw, 48vw"
          />
          <figcaption className="ojo">{t.pieFoto}</figcaption>
        </figure>
      </section>

      {/* ── el recorrido: lo que ningún competidor tiene ────────────────── */}
      <Recorrido lang={lang} />

      {/**
        * TRES FOTOS, NO UNA GALERÍA, Y LAS TRES DEL EXTERIOR.
        *
        * Después del recorrido la persona ya entiende el sitio; lo que le falta
        * es creérselo. Tres fotografías reales bastan y una galería sobra: cada
        * foto de más es una razón más para quedarse mirando en vez de escribir.
        *
        * Las tres cuentan una frase entera: **montado** (truss, altavoces y
        * luces colgados de los cabios, que demuestra que aquí se produce de
        * verdad), **el detalle** (las cabañas a ras de suelo, que es lo que
        * nadie más publica) y **lleno de noche**, que es la única prueba de que
        * el sitio funciona cuando importa.
        *
        * ⚠️ **Aquí no entra ni una foto del edificio.** El material del
        * inmueble avisa de algo que es fácil de romper sin darse cuenta: el
        * exterior y el edificio son dos activos con dos públicos, y mezclarlos
        * en la misma pieza quema el mensaje. Quien llega desde un anuncio de
        * eventos viene a ver un jardín; una nave industrial por dentro, puesta
        * en medio, le hace dudar de si llegó al sitio correcto. El edificio
        * aparece más abajo, en «los dos usos», donde ya está dicho que es otra
        * cosa que se alquila aparte.
        */}
      <section className="lp-tira">
        {[
          { src: "/assets/palapa-sonido.jpg", w: 1600, h: 1200,
            es: "Bajo la palapa, montada: truss, altavoces y luces colgados de los cabios",
            en: "Under the structure, rigged: truss, speakers and lights hung from the rafters" },
          { src: "/assets/cabanas-fila.jpg", w: 930, h: 614,
            es: "La hilera de cabañas: pérgolas blancas, cortinas y sofás contra el muro verde",
            en: "The cabana row: white pergolas, curtains and sofas against the green wall" },
          { src: "/assets/recinto-noche.jpg", w: 1920, h: 1080,
            es: "El recinto al anochecer, durante un evento",
            en: "The site at dusk, during an event" },
        ].map((f) => (
          <figure key={f.src}>
            <Image src={f.src} alt={es ? f.es : f.en} width={f.w} height={f.h}
                   sizes="(max-width: 860px) 100vw, 33vw" />
            <figcaption className="ojo">{es ? f.es : f.en}</figcaption>
          </figure>
        ))}
      </section>

      {/* ── lo que NO se incluye, antes de pedir nada ───────────────────── */}
      <section className="lp-honesto">
        <h2>{t.honesto.titulo}</h2>
        <div className="lp-dos">
          <div>
            <p className="ojo">{t.honesto.siOjo}</p>
            <ul>{t.honesto.si.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div>
            <p className="ojo">{t.honesto.noOjo}</p>
            <ul>{t.honesto.no.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
        <p className="lp-nota">{t.honesto.pie}</p>
      </section>

      {/**
        * LOS DOS USOS, Y AQUÍ SÍ EL EDIFICIO.
        *
        * Este es el único sitio de la página donde el edificio puede aparecer
        * sin confundir a nadie, porque el rótulo va delante: quien lea «Oficina»
        * y vea una planta diáfana entiende que le están enseñando otra cosa, no
        * el jardín que acaba de recorrer. Las fotos van pequeñas y a la misma
        * altura, como ilustración de cada uso y no como argumento propio.
        *
        * El segundo uso casi nadie sabe que existe, y es la mitad del inmueble.
        */}
      <section className="lp-usos">
        <h2>{t.usosTitulo}</h2>
        <div className="lp-tres">
          {USOS.map((u) => {
            const f = FOTO_USO[u.clave];
            return (
              <article key={u.clave}>
                <Image src={f.src} alt={es ? f.es : f.en} width={f.w} height={f.h}
                       sizes="(max-width: 720px) 100vw, 33vw" />
                <p className="ojo">{es ? u.es : u.en}</p>
                <p>{es ? u.detalleEs : u.detalleEn}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── pedir ───────────────────────────────────────────────────────── */}
      <section id="pedir" className="lp-pedir">
        <p className="ojo">{t.form.ojo}</p>
        <h2>{t.form.titulo}</h2>
        <p className="lp-lead">{t.form.intro}</p>
        <p className="ojo lp-nota">{t.form.soloDos}</p>
        <Formulario lang={lang} idPrefijo="lp" />
        <p className="lp-nota">
          <a href={`tel:${VENUE.telefono.replace(/[^+\d]/g, "")}`}>{VENUE.telefono}</a>
          {" · "}
          <a href={`mailto:${VENUE.email}`}>{VENUE.email}</a>
        </p>
      </section>

      <footer className="lp-pie">
        <Simbolo tam={20} />
        <span className="ojo">
          Club Wynwood · {VENUE.direccion.calle}, {VENUE.direccion.ciudad} {VENUE.direccion.region} {VENUE.direccion.cp} · clubwynwood.com
        </span>
      </footer>
    </>
  );
}

/**
 * Una foto por uso, atada a la clave de `USOS` y no al orden del array: si
 * mañana se añade un cuarto uso o se reordena la lista, esto no se descoloca —
 * falta la entrada y TypeScript lo dice, que es mejor que enseñar la cocina
 * debajo del rótulo «Oficina».
 */
const FOTO_USO: Record<(typeof USOS)[number]["clave"], { src: string; w: number; h: number; es: string; en: string }> = {
  evento: { src: "/assets/flyer-palapa-lounge.jpg", w: 935, h: 614,
    es: "Bajo la palapa, montada como lounge, con barra y guirnaldas",
    en: "Under the structure, set up as a lounge, with a bar and string lights" },
  oficina: { src: "/assets/edificio-doble-altura.jpg", w: 3214, h: 1924,
    es: "Dentro del edificio: planta diáfana de doble altura y despachos acristalados al fondo",
    en: "Inside the building: an open double-height floor and glass-walled offices at the back" },
  cocina: { src: "/assets/edificio-cocina.jpg", w: 740, h: 428,
    es: "La cocina del edificio, equipada, con isla y nevera industrial",
    en: "The building's kitchen, equipped, with an island and a commercial fridge" },
};

/**
 * El texto vive aquí y no en `contenido.ts` a propósito: `PAGINAS` está tipado
 * contra las claves de `RUTAS`, y esta página no es una ruta del sitio ni entra
 * en el sitemap. Meterla ahí obligaría a relajar ese tipo, que es justo lo que
 * evita que aparezcan páginas fantasma.
 */
const TEXTO = {
  es: {
    ojo: "Jardín de eventos al aire libre · Wynwood, Miami",
    h1: "Mira el recinto en tres minutos y pide tu fecha.",
    lead: "Se alquila el espacio, no un paquete cerrado. Tú traes la producción, el catering y el equipo; nosotros entregamos el jardín, la estructura techada y el estacionamiento.",
    cta2: "Pedir disponibilidad",
    usosTitulo: "Dos usos, y un adicional.",
    pieFoto: "El inmueble desde NW 1st Ct. La carga entra por aquí, no por la entrada de invitados.",
    honesto: {
      titulo: "Qué se alquila y qué no. Sin sorpresas en la visita.",
      siOjo: "Va incluido",
      si: [
        "El jardín al aire libre y la estructura techada, juntos o por separado.",
        "Las cabañas amuebladas y las mesas de picnic, que ya están en el jardín.",
        "Área donde montar barra, con licencia de licor propia.",
        "Estacionamiento propio y portón de carga independiente.",
      ],
      noOjo: "Lo trae tu equipo",
      no: [
        "Producción, sonido, iluminación y mobiliario.",
        "Catering y personal de servicio.",
        "Afuera no hay cocina ni climatización: el catering monta en sitio.",
      ],
      pie: "Esa libertad es la propuesta, no una carencia: es lo que permite que el evento sea el tuyo y no el del venue.",
    },
    form: {
      ojo: "Solicitar disponibilidad",
      titulo: "Cuéntanos tu evento.",
      intro: "Con el tipo de evento, la fecha y el número de invitados respondemos con disponibilidad real y condiciones. Si necesitas ver el espacio, coordinamos la visita.",
      soloDos: "Solo el nombre y el correo son obligatorios.",
    },
  },
  en: {
    ojo: "Open-air event garden · Wynwood, Miami",
    h1: "See the site in three minutes, then ask for your date.",
    lead: "You rent the space, not a closed package. You bring production, catering and crew; we hand over the garden, the covered structure and the parking.",
    cta2: "Request availability",
    usosTitulo: "Two uses, and one add-on.",
    pieFoto: "The building from NW 1st Ct. Freight comes in here, not through the guest entrance.",
    honesto: {
      titulo: "What is rented and what is not. No surprises at the visit.",
      siOjo: "Included",
      si: [
        "The open-air garden and the covered structure, together or separately.",
        "The furnished cabanas and the picnic tables, already in the garden.",
        "An area where a bar can be set up, with its own liquor license.",
        "On-site parking and a separate freight gate.",
      ],
      noOjo: "Your team brings",
      no: [
        "Production, sound, lighting and furniture.",
        "Catering and service staff.",
        "There is no kitchen and no climate control outdoors: catering sets up on site.",
      ],
      pie: "That freedom is the offer, not a gap: it is what makes the event yours and not the venue's.",
    },
    form: {
      ojo: "Request availability",
      titulo: "Tell us about your event.",
      intro: "With the event type, date and guest count we come back with real availability and terms. If you need to see the space, we schedule the visit.",
      soloDos: "Only name and email are required.",
    },
  },
} as const;

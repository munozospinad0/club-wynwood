import Image from "next/image";
import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import { asIdioma, BASE, BCP47, IDIOMAS, href, type Idioma } from "@/lib/i18n";
import AccionPreview from "@/components/AccionPreview";
import "@/app/preview.css";

/**
 * LA PÁGINA DEL «EXCLUSIVE BROKERS PREVIEW» DEL 18 DE NOVIEMBRE DE 2026.
 *
 * Es la invitación, en grande: a ella llegan los anuncios y las publicaciones
 * del evento. Tiene un solo camino —confirmar por correo, guardar la fecha y
 * saber llegar—, por eso oculta la navegación del sitio (ver preview.css).
 *
 * DE DÓNDE SALE CADA DATO
 * · El texto en inglés es el de Kate Morales (correo «Wynwood Invitation &
 *   Brochure», 11-nov-2026), tal cual. El español es su traducción.
 * · Las cifras de «The property at a glance» son las del folleto de arriendo
 *   que llegó en ese mismo correo, con sus mismas salvedades.
 * · El RSVP es solo events@clubwynwood.com (Sandra, 11-nov): sin fecha límite
 *   y sin teléfono.
 * · Las fotos amuebladas y los interiores en blanco son visualizaciones y van
 *   rotulados, igual que en los videos.
 *
 * NO SE INDEXA: es una página con fecha de caducidad. Pasado el 18-nov se
 * retira o se convierte en la página de arriendo.
 */

const cursiva = Fraunces({
  subsets: ["latin"],
  style: ["italic"],
  axes: ["SOFT", "WONK"],
  variable: "--f-cursiva",
  display: "swap",
});

export const dynamicParams = false;
export function generateStaticParams() {
  return IDIOMAS.map((lang) => ({ lang }));
}

const F = "/evento-nov18";
const CORREO = "events@clubwynwood.com";
const DIRECCION = "2129 NW 1st Ct, Miami, FL 33127";
const MAPA = "https://www.google.com/maps/search/?api=1&query=Club+Wynwood+2129+NW+1st+Ct+Miami+FL+33127";
const INICIO = "2026-11-18T14:00:00-05:00";
const FIN = "2026-11-18T18:00:00-05:00";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = asIdioma((await params).lang);
  const t = TEXTO[lang];
  return {
    title: t.meta.titulo,
    description: t.meta.descripcion,
    robots: { index: false, follow: true },
    alternates: {
      canonical: `${BASE}/${lang}/preview`,
      languages: Object.fromEntries(IDIOMAS.map((l) => [BCP47[l], `${BASE}/${l}/preview`])),
    },
    openGraph: { title: t.meta.titulo, description: t.meta.descripcion, images: [{ url: `${F}/og.jpg`, width: 1200, height: 630 }] },
  };
}

export default async function Preview({ params }: { params: Promise<{ lang: string }> }) {
  const lang = asIdioma((await params).lang);
  const t = TEXTO[lang];
  const otro: Idioma = lang === "es" ? "en" : "es";

  const correo = `mailto:${CORREO}?subject=${encodeURIComponent(t.rsvp.asunto)}&body=${encodeURIComponent(t.rsvp.cuerpo)}`;
  const google = "https://calendar.google.com/calendar/render?action=TEMPLATE"
    + `&text=${encodeURIComponent("Club Wynwood · Exclusive Brokers Preview")}`
    + "&dates=20261118T190000Z/20261118T230000Z"
    + `&location=${encodeURIComponent(`Club Wynwood, ${DIRECCION}`)}`
    + `&details=${encodeURIComponent(`${t.hero.titulo} RSVP: ${CORREO}`)}`;

  const evento = {
    "@context": "https://schema.org",
    "@type": "BusinessEvent",
    name: "Club Wynwood — Exclusive Brokers Preview",
    description: t.meta.descripcion,
    startDate: INICIO,
    endDate: FIN,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    inLanguage: BCP47[lang],
    image: [`${BASE}${F}/og.jpg`],
    url: `${BASE}/${lang}/preview`,
    location: {
      "@type": "Place",
      name: "Club Wynwood",
      address: { "@type": "PostalAddress", streetAddress: "2129 NW 1st Ct", addressLocality: "Miami", addressRegion: "FL", postalCode: "33127", addressCountry: "US" },
    },
    organizer: { "@type": "Organization", name: "Club Wynwood", url: BASE, email: CORREO },
  };

  const Tiras = () => <div className="pv-tiras" aria-hidden="true"><i /><i /><i /><i /><i /></div>;
  const Cuando = () => (
    <p className="pv-cuando">
      <span className="pv-fecha">{t.fecha}</span>
      <span className="pv-hora">{t.hora}</span>
      <span className="pv-lugar">{DIRECCION}</span>
    </p>
  );

  return (
    <div className={`pv ${cursiva.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(evento) }} />

      {/* ── 1. La invitación ─────────────────────────────────────────────── */}
      <header className="pv-hero">
        <div className="pv-hero__foto">
          <Image src={`${F}/pabellon-desde-el-aire.jpg`} alt={t.alt.aire} width={1440} height={956} priority sizes="100vw" />
        </div>
        <div className="pv-hero__tarjeta">
          <div className="pv-hero__arriba">
            <Image className="pv-logo" src={`${F}/logo-club-wynwood.png`} alt="Club Wynwood" width={722} height={630} priority sizes="170px" />
            <a className="pv-idioma" href={`/${otro}/preview`} hrefLang={BCP47[otro]} lang={BCP47[otro]}>{t.otroIdioma}</a>
          </div>
          <p className="pv-ceja">{t.hero.ceja}</p>
          <h1>{t.hero.titulo}</h1>
          <Cuando />
          <div className="pv-acciones">
            <AccionPreview href={correo} metodo="email" className="pv-boton">{t.accion.rsvp}</AccionPreview>
            <AccionPreview href={`${F}/club-wynwood-brokers-preview.ics`} metodo="calendario" className="pv-boton pv-boton--linea" descarga="club-wynwood-brokers-preview.ics">{t.accion.calendario}</AccionPreview>
          </div>
          <p className="pv-incluye">{t.incluye.join(" · ")}</p>
        </div>
        <Tiras />
      </header>

      {/* ── 2. Qué es, y el video ────────────────────────────────────────── */}
      <section className="pv-bloque pv-intro">
        <div className="pv-intro__texto">
          <p className="pv-ceja">{t.intro.ceja}</p>
          <h2>{t.intro.titulo}</h2>
          <p className="pv-parrafo">{t.intro.texto}</p>
        </div>
        <figure className="pv-video">
          <video controls playsInline preload="none" poster={`${F}/${t.video.invitacion}.jpg`} aria-label={t.video.etiqueta}>
            <source src={`${F}/${t.video.invitacion}.mp4`} type="video/mp4" />
          </video>
          <figcaption>{t.video.pie}</figcaption>
        </figure>
      </section>

      {/* ── 3. Los espacios ──────────────────────────────────────────────── */}
      <section className="pv-bloque">
        <div className="pv-cabeza">
          <p className="pv-ceja">{t.espacios.ceja}</p>
          <h2>{t.espacios.titulo}</h2>
          <p className="pv-parrafo">{t.espacios.texto}</p>
        </div>
        <div className="pv-escenas">
          {t.espacios.lista.map((e) => (
            <article key={e.palabra} className={`pv-escena pv-escena--${e.color}`}>
              <Image src={`${F}/${e.foto}.jpg`} alt={e.alt} width={1440} height={e.alto} sizes="(min-width: 960px) 33vw, 100vw" />
              <div className="pv-escena__franja">
                <h3>{e.palabra}</h3>
                <p>{e.dato}</p>
                {e.nota && <p className="pv-nota">{e.nota}</p>}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── 4. La ficha ──────────────────────────────────────────────────── */}
      <section className="pv-bloque pv-ficha">
        <div className="pv-cabeza">
          <p className="pv-ceja">{t.ficha.ceja}</p>
          <h2>{t.ficha.titulo}</h2>
        </div>
        <dl>
          {t.ficha.filas.map(([k, v, salvedad]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}{salvedad && <small>{salvedad}</small>}</dd>
            </div>
          ))}
        </dl>
        <p className="pv-fuente">{t.ficha.fuente}</p>
      </section>

      {/* ── 5. Para qué se arrienda ──────────────────────────────────────── */}
      <section className="pv-bloque pv-usos">
        <div className="pv-cabeza">
          <p className="pv-ceja">{t.usos.ceja}</p>
          <h2>{t.usos.titulo}</h2>
          <p className="pv-parrafo">{t.usos.texto}</p>
        </div>
        <ul>
          {t.usos.lista.map((u) => <li key={u}>{u}</li>)}
        </ul>
      </section>

      {/* ── 6. El edificio por dentro ────────────────────────────────────── */}
      <section className="pv-bloque pv-dentro">
        <div className="pv-intro__texto">
          <p className="pv-ceja">{t.dentro.ceja}</p>
          <h2>{t.dentro.titulo}</h2>
          <p className="pv-parrafo">{t.dentro.texto}</p>
        </div>
        <figure className="pv-video">
          <video controls playsInline preload="none" poster={`${F}/${t.video.interior}.jpg`} aria-label={t.video.etiquetaInterior}>
            <source src={`${F}/${t.video.interior}.mp4`} type="video/mp4" />
          </video>
        </figure>
        <div className="pv-galeria">
          {t.dentro.fotos.map((f) => (
            <figure key={f.foto}>
              <Image src={`${F}/${f.foto}.jpg`} alt={f.alt} width={1440} height={1080} sizes="(min-width: 960px) 33vw, 100vw" />
              <figcaption><b>{f.nombre}</b> {t.dentro.rotulo}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── 7. El día ────────────────────────────────────────────────────── */}
      <section className="pv-bloque pv-dia">
        <div className="pv-cabeza">
          <p className="pv-ceja">{t.dia.ceja}</p>
          <h2>{t.dia.titulo}</h2>
          <p className="pv-parrafo">{t.dia.texto}</p>
        </div>
        <ol>
          {t.dia.lista.map(([nombre, detalle]) => (
            <li key={nombre}><b>{nombre}</b><span>{detalle}</span></li>
          ))}
        </ol>
      </section>

      {/* ── 8. Dónde ─────────────────────────────────────────────────────── */}
      <section className="pv-bloque pv-donde">
        <div className="pv-cabeza">
          <p className="pv-ceja">{t.donde.ceja}</p>
          <h2>{t.donde.titulo}</h2>
          <p className="pv-parrafo">{t.donde.texto}</p>
          <p className="pv-direccion">
            <b>Club Wynwood</b>
            {DIRECCION}
          </p>
          <AccionPreview href={MAPA} metodo="mapa" className="pv-boton pv-boton--linea">{t.accion.mapa}</AccionPreview>
        </div>
        <div className="pv-donde__fotos">
          <figure>
            <Image src={`${F}/predio-desde-el-aire.jpg`} alt={t.alt.predio} width={1440} height={1080} sizes="(min-width: 960px) 44vw, 100vw" />
            <figcaption>{t.donde.piePredio}</figcaption>
          </figure>
          <figure>
            <Image src={`${F}/wynwood-y-miami.jpg`} alt={t.alt.ciudad} width={1440} height={1080} sizes="(min-width: 960px) 44vw, 100vw" />
            <figcaption>{t.donde.pieCiudad}</figcaption>
          </figure>
        </div>
      </section>

      {/* ── 9. Confirmar ─────────────────────────────────────────────────── */}
      <section className="pv-cierre" id="rsvp">
        <Tiras />
        <div className="pv-cierre__dentro">
          <p className="pv-ceja">{t.cierre.ceja}</p>
          <h2>{t.cierre.titulo}</h2>
          <Cuando />
          <div className="pv-acciones">
            <AccionPreview href={correo} metodo="email" className="pv-boton pv-boton--claro">{t.accion.rsvp}</AccionPreview>
            <AccionPreview href={google} metodo="calendario" className="pv-boton pv-boton--linea-clara">{t.accion.google}</AccionPreview>
            <AccionPreview href={MAPA} metodo="mapa" className="pv-boton pv-boton--linea-clara">{t.accion.mapa}</AccionPreview>
          </div>
          <p className="pv-correo">RSVP: <a href={correo}>{CORREO}</a></p>
          <p className="pv-alianza">{t.cierre.alianza}</p>
        </div>
      </section>

      <footer className="pv-pie">
        <p>© 2026 Club Wynwood · {DIRECCION}</p>
        <p>
          <a href={href("home", lang)}>clubwynwood.com</a>
          <a href="/privacy">{t.privacidad}</a>
        </p>
      </footer>

      {/* Barra del móvil: la fecha y el RSVP siempre a mano. */}
      <div className="pv-barra">
        <p><b>{t.barra}</b>{t.hora}</p>
        <AccionPreview href={correo} metodo="email" className="pv-boton">{t.accion.rsvp}</AccionPreview>
      </div>
    </div>
  );
}

type Escena = { palabra: string; dato: string; nota?: string; foto: string; alto: number; alt: string; color: "cian" | "coral" | "cobalto" };

const TEXTO: Record<Idioma, {
  meta: { titulo: string; descripcion: string };
  otroIdioma: string;
  fecha: string; hora: string; barra: string;
  incluye: string[];
  hero: { ceja: string; titulo: string };
  accion: { rsvp: string; calendario: string; google: string; mapa: string };
  rsvp: { asunto: string; cuerpo: string };
  intro: { ceja: string; titulo: string; texto: string };
  video: { invitacion: string; interior: string; etiqueta: string; etiquetaInterior: string; pie: string };
  espacios: { ceja: string; titulo: string; texto: string; lista: Escena[] };
  ficha: { ceja: string; titulo: string; filas: Array<[string, string, string?]>; fuente: string };
  usos: { ceja: string; titulo: string; texto: string; lista: string[] };
  dentro: { ceja: string; titulo: string; texto: string; rotulo: string; fotos: Array<{ foto: string; nombre: string; alt: string }> };
  dia: { ceja: string; titulo: string; texto: string; lista: Array<[string, string]> };
  donde: { ceja: string; titulo: string; texto: string; piePredio: string; pieCiudad: string };
  cierre: { ceja: string; titulo: string; alianza: string };
  alt: { aire: string; predio: string; ciudad: string };
  privacidad: string;
}> = {
  en: {
    meta: {
      titulo: "Exclusive Brokers Preview · November 18",
      descripcion: "An exclusive first look at Club Wynwood: approximately 30,000 square feet in Miami's Wynwood Arts District. Wednesday, November 18, 2026, 2:00–6:00 PM. RSVP: events@clubwynwood.com.",
    },
    otroIdioma: "Español",
    fecha: "Wednesday, November 18, 2026",
    hora: "2:00–6:00 PM",
    barra: "Nov 18 · ",
    incluye: ["Light bites", "Refreshments", "Private tours"],
    hero: {
      ceja: "You're invited · Exclusive Brokers Preview",
      titulo: "An exclusive first look at Wynwood's next landmark opportunity.",
    },
    accion: { rsvp: "RSVP by email", calendario: "Add to calendar", google: "Add to Google Calendar", mapa: "Get directions" },
    rsvp: {
      asunto: "RSVP · Club Wynwood Exclusive Brokers Preview · Nov 18",
      cuerpo: "Name:\nCompany:\nNumber of guests:\n",
    },
    intro: {
      ceja: "Introducing Club Wynwood",
      titulo: "Approximately 30,000 square feet in the heart of Miami's Wynwood Arts District.",
      texto: "Surrounded by transformative development, world-class dining, and major institutional investment.",
    },
    video: {
      invitacion: "invitation-en", interior: "inside-en",
      etiqueta: "Invitation video: Club Wynwood, 38 seconds, with sound",
      etiquetaInterior: "Video of the building's interior, 26 seconds, with sound",
      pie: "38 seconds, with sound. Furnished views are renderings and are labeled in the video.",
    },
    espacios: {
      ceja: "A rare indoor–outdoor destination",
      titulo: "A garden, a pavilion and a building, on one site.",
      texto: "Featuring a two-level building, expansive tropical garden, covered tiki pavilion, private cabanas, and existing hospitality infrastructure.",
      lista: [
        { palabra: "The garden", dato: "± 18,000 SF outdoors, among royal palms, with private cabanas along the walk", foto: "jardin-y-cabanas", alto: 1080, alt: "Paved garden walk lined with royal palms leading to the building's mural entrance, with white cabanas on the right", color: "cian" },
        { palabra: "The pavilion", dato: "± 4,000 SF under a thatched roof, open on all four sides", foto: "pabellon", alto: 958, alt: "The thatched-roof pavilion seen from the paved forecourt, with artificial turf around it", color: "coral" },
        { palabra: "The building", dato: "Two-level indoor venue behind the mural façade", foto: "edificio-fachada", alto: 1080, alt: "The building's façade, covered by a colorful mural, with glass doors at the center", color: "cobalto" },
      ],
    },
    ficha: {
      ceja: "The property at a glance",
      titulo: "What is on the site today.",
      filas: [
        ["Site", "Multi-parcel, including 2105 and 2129 NW 1st Ct"],
        ["Marketing footprint", "± 30,000 SF", "Subject to survey"],
        ["Indoor venue", "Two levels"],
        ["Outdoor garden", "± 18,000 SF"],
        ["Covered tiki pavilion", "± 4,000 SF"],
        ["Cabanas", "Private cabanas along the garden walk"],
        ["Support building", "± 3,000 SF"],
        ["Offices", "± 1,217 SF and ± 1,012 SF"],
        ["Kitchen", "Current second-generation kitchen"],
        ["Liquor license", "4COP-SFS", "Availability and use subject to separate licensing review"],
        ["Parking", "Parking options", "Subject to operator terms"],
      ],
      fuente: "Figures from the Club Wynwood leasing brochure, November 2026.",
    },
    usos: {
      ceja: "Leasing",
      titulo: "Exceptional leasing potential.",
      texto: "From short-term activations to long-term flagship hospitality, entertainment, and experiential retail concepts.",
      lista: ["Flagship retail", "Hospitality & lifestyle", "Private club & membership", "Boutique office", "Mixed-use development"],
    },
    dentro: {
      ceja: "Inside the building",
      titulo: "Wide halls with high ceilings, and private rooms.",
      texto: "A building available for long-term lease: room for a gallery, a showroom or your next project, plus private rooms for meetings or offices.",
      rotulo: "Rendering · paint and sample setup",
      fotos: [
        { foto: "interior-salon", nombre: "Main hall.", alt: "Rendering of the main hall painted white, with a seating group and plants" },
        { foto: "interior-galeria", nombre: "Gallery.", alt: "Rendering of a hall set up as a gallery, with large paintings and benches" },
        { foto: "interior-sala", nombre: "Private room.", alt: "Rendering of a private room set up with a meeting table and chairs" },
      ],
    },
    dia: {
      ceja: "The day",
      titulo: "Join us for an Exclusive Brokers Preview.",
      texto: "Drop by anytime between 2:00 and 6:00 PM. Brokers, event planners and creatives are welcome.",
      lista: [
        ["Private tours", "The garden, the pavilion and the building"],
        ["Light bites and refreshments", "Coffee, sparkling wine and bites"],
        ["Come when it suits you", "Anytime between 2:00 and 6:00 PM"],
      ],
    },
    donde: {
      ceja: "Location",
      titulo: "In the heart of Miami's Wynwood Arts District.",
      texto: "The site sits among Wynwood's murals, a short drive from Downtown Miami.",
      piePredio: "The site from the air: the building with its mural, the pavilion and the garden.",
      pieCiudad: "Wynwood, with the Miami skyline behind it.",
    },
    cierre: {
      ceja: "RSVP",
      titulo: "One location. Endless possibilities.",
      alianza: "Miami Style Realty in partnership with TopEvents",
    },
    alt: {
      aire: "Aerial view of Club Wynwood's thatched-roof pavilion among royal palms",
      predio: "Aerial view of the whole site in Wynwood: building, pavilion, garden and parking",
      ciudad: "Aerial view of the Wynwood neighborhood with the Miami skyline in the background",
    },
    privacidad: "Privacy",
  },
  es: {
    meta: {
      titulo: "Presentación exclusiva para brokers · 18 de noviembre",
      descripcion: "Un primer vistazo exclusivo a Club Wynwood: aproximadamente 30,000 pies cuadrados en el distrito de arte de Wynwood, Miami. Miércoles 18 de noviembre de 2026, de 2:00 a 6:00 p. m. RSVP: events@clubwynwood.com.",
    },
    otroIdioma: "English",
    fecha: "Miércoles 18 de noviembre de 2026",
    hora: "2:00 a 6:00 p. m.",
    barra: "18 nov · ",
    incluye: ["Bocados", "Bebidas", "Recorridos privados"],
    hero: {
      ceja: "Estás invitado · Presentación exclusiva para brokers",
      titulo: "Un primer vistazo exclusivo a la próxima gran oportunidad de Wynwood.",
    },
    accion: { rsvp: "Confirmar por correo", calendario: "Guardar en el calendario", google: "Guardar en Google Calendar", mapa: "Cómo llegar" },
    rsvp: {
      asunto: "RSVP · Presentación exclusiva de Club Wynwood · 18 de noviembre",
      cuerpo: "Nombre:\nEmpresa:\nNúmero de asistentes:\n",
    },
    intro: {
      ceja: "Te presentamos Club Wynwood",
      titulo: "Aproximadamente 30,000 pies cuadrados en el corazón del distrito de arte de Wynwood, en Miami.",
      texto: "Rodeado de desarrollos que están transformando la zona, restaurantes de primer nivel y grandes inversiones institucionales.",
    },
    video: {
      invitacion: "invitacion-es", interior: "interior-es",
      etiqueta: "Video de la invitación: Club Wynwood, 39 segundos, con sonido",
      etiquetaInterior: "Video del interior del edificio, 28 segundos, con sonido",
      pie: "39 segundos, con sonido. Las vistas amuebladas son visualizaciones y van rotuladas en el video.",
    },
    espacios: {
      ceja: "Un destino interior y exterior poco común",
      titulo: "Un jardín, un pabellón y un edificio, en un mismo predio.",
      texto: "Con un edificio de dos niveles, un amplio jardín tropical, un pabellón techado, cabañas privadas e infraestructura de hospitalidad ya instalada.",
      lista: [
        { palabra: "El jardín", dato: "± 18,000 pies cuadrados al aire libre, entre palmeras reales, con cabañas privadas junto al paseo", foto: "jardin-y-cabanas", alto: 1080, alt: "Paseo pavimentado del jardín entre palmeras reales hacia la entrada del edificio con su mural, con cabañas blancas a la derecha", color: "cian" },
        { palabra: "El Pabellón", dato: "± 4,000 pies cuadrados bajo techo de paja, abierto por los cuatro costados", foto: "pabellon", alto: 958, alt: "El pabellón con techo de paja visto desde la explanada pavimentada, rodeado de césped artificial", color: "coral" },
        { palabra: "El edificio", dato: "Recinto interior de dos niveles, detrás de la fachada con mural", foto: "edificio-fachada", alto: 1080, alt: "La fachada del edificio, cubierta por un mural de colores, con puertas de vidrio en el centro", color: "cobalto" },
      ],
    },
    ficha: {
      ceja: "El inmueble, de un vistazo",
      titulo: "Lo que hay hoy en el predio.",
      filas: [
        ["Predio", "Varios lotes, incluidos 2105 y 2129 NW 1st Ct"],
        ["Área de mercadeo", "± 30,000 pies cuadrados", "Sujeta a levantamiento topográfico"],
        ["Recinto interior", "Dos niveles"],
        ["Jardín exterior", "± 18,000 pies cuadrados"],
        ["Pabellón techado", "± 4,000 pies cuadrados"],
        ["Cabañas", "Cabañas privadas junto al paseo del jardín"],
        ["Edificio de apoyo", "± 3,000 pies cuadrados"],
        ["Oficinas", "± 1,217 y ± 1,012 pies cuadrados"],
        ["Cocina", "Cocina de segunda generación, ya instalada"],
        ["Licencia de licor", "4COP-SFS", "Disponibilidad y uso sujetos a una revisión de licencias aparte"],
        ["Estacionamiento", "Opciones de estacionamiento", "Sujetas a las condiciones del operador"],
      ],
      fuente: "Cifras del folleto de arriendo de Club Wynwood, noviembre de 2026.",
    },
    usos: {
      ceja: "Arriendo",
      titulo: "Un potencial de arriendo excepcional.",
      texto: "Desde activaciones de corto plazo hasta conceptos insignia de hospitalidad, entretenimiento y comercio experiencial a largo plazo.",
      lista: ["Tienda insignia", "Hospitalidad y estilo de vida", "Club privado y membresías", "Oficina boutique", "Desarrollo de uso mixto"],
    },
    dentro: {
      ceja: "El edificio por dentro",
      titulo: "Salones amplios, de techos altos, y salas privadas.",
      texto: "Un edificio disponible para arriendo a largo plazo: espacio para una galería, un showroom o tu próximo proyecto, y salas privadas para reuniones u oficinas.",
      rotulo: "Visualización · pintura y montaje de ejemplo",
      fotos: [
        { foto: "interior-salon", nombre: "Salón principal.", alt: "Visualización del salón principal pintado de blanco, con una sala de estar y plantas" },
        { foto: "interior-galeria", nombre: "Galería.", alt: "Visualización de un salón montado como galería, con cuadros grandes y bancas" },
        { foto: "interior-sala", nombre: "Sala privada.", alt: "Visualización de una sala privada montada con mesa de reuniones y sillas" },
      ],
    },
    dia: {
      ceja: "El día",
      titulo: "Acompáñanos en la presentación exclusiva para brokers.",
      texto: "Ven cuando quieras entre las 2:00 y las 6:00 p. m. Brokers, organizadores de eventos y creativos, los esperamos.",
      lista: [
        ["Recorridos privados", "El jardín, el Pabellón y el edificio"],
        ["Bocados y bebidas", "Café, espumante y bocados"],
        ["Ven cuando te quede bien", "Entre las 2:00 y las 6:00 p. m."],
      ],
    },
    donde: {
      ceja: "Ubicación",
      titulo: "En el corazón del distrito de arte de Wynwood, en Miami.",
      texto: "El predio está entre los murales de Wynwood, a pocos minutos en carro del centro de Miami.",
      piePredio: "El predio desde el aire: el edificio con su mural, el Pabellón y el jardín.",
      pieCiudad: "Wynwood, con los edificios de Miami al fondo.",
    },
    cierre: {
      ceja: "RSVP",
      titulo: "Un lugar. Infinitas posibilidades.",
      alianza: "Miami Style Realty en alianza con TopEvents",
    },
    alt: {
      aire: "Vista aérea del pabellón con techo de paja de Club Wynwood entre palmeras reales",
      predio: "Vista aérea de todo el predio en Wynwood: edificio, pabellón, jardín y estacionamiento",
      ciudad: "Vista aérea del barrio de Wynwood con los edificios de Miami al fondo",
    },
    privacidad: "Privacidad",
  },
};

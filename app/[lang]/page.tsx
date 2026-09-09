import Image from "next/image";
import { asIdioma, href } from "@/lib/i18n";
import { FICHA, TIEMPOS, VENUE } from "@/lib/venue";
import { PAGINAS, FAQ } from "@/lib/contenido";
import { grafo, faqPage, localBusiness, eventVenue, webPage } from "@/lib/schema";
import Formulario from "@/components/Formulario";
import Contacto from "@/components/Contacto";
import LaminaEdificio from "@/components/LaminaEdificio";
import Laminas from "@/components/Laminas";
import LaminaPlanta from "@/components/LaminaPlanta";
import Recorrido from "@/components/Recorrido";
import Dudas from "@/components/Dudas";
import Cifras from "@/components/Cifras";
import BotonRecorrido from "@/components/BotonRecorrido";
import Galeria from "@/components/Galeria";
import ParaQuien from "@/components/ParaQuien";

/**
 * Home. El orden sigue cómo decide un productor:
 *   portada -> cifras -> QUÉ alquilo -> qué incluye -> números -> dónde -> pedir
 *
 * En el sitio anterior la filosofía del encuadre ("se alquila el contenedor")
 * iba ANTES de decir qué se alquila.
 */

// Las cifras viven ahora en components/Cifras.tsx, junto a los dibujos que las
// explican: tener el número en un archivo y el glifo que lo representa en otro
// es pedir que se desincronicen.

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const lang = asIdioma((await params).lang);
  const es = lang === "es";
  const verificados = FICHA.filter((f) => f.estado === "verificado");

  /**
   * EL GRAFO DE LA HOME: negocio, venue, página y preguntas.
   *
   * Hasta el 6-sep-2026 LocalBusiness y EventVenue los inyectaba el LAYOUT, en
   * todas las páginas. Tenía un efecto que la auditoría marcó: la página de
   * residencia permanente —contenido legal de otro negocio— se declaraba a sí
   * misma como el venue. Ahora cada página declara lo suyo, y la de residencia
   * no declara el venue. Aquí van los dos, una sola vez —duplicarlos en el
   * mismo documento es peor que no tenerlos: un buscador que encuentra la misma
   * entidad dos veces no sabe cuál vale— más la WebPage con `speakable` y el
   * FAQPage, que es lo que permite que una respuesta nuestra salga citada cuando
   * alguien pregunta «¿qué pasa si llueve en un venue al aire libre en Wynwood?».
   */
  const ld = grafo(
    localBusiness(lang),
    eventVenue(lang),
    webPage(lang, "home", es ? "Club Wynwood — Jardín de eventos al aire libre" : "Club Wynwood — Open-air event garden"),
    faqPage(lang, FAQ.map((f) => ({ q: f.q[lang], a: f.a[lang] })))
  );
  const enVisita = FICHA.filter((f) => f.estado === "en-visita");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      {/* ---------------- PORTADA: mitad tipo, mitad foto ----------------
          Las dos columnas se estiran igual, así que no hay sobrante que
          repartir: es estructuralmente imposible que salga el hueco de crema
          que tenía la versión anterior. */}
      <header
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) minmax(0,0.86fr)",
          alignItems: "stretch",
          borderBottom: "1px solid var(--regla)",
        }}
      >
        <div
          style={{
            display: "flex", flexDirection: "column", justifyContent: "center",
            minHeight: "clamp(440px,62vh,660px)",
            padding: "72px 56px 64px max(24px, calc((100vw - 1280px) / 2 + 32px))",
          }}
        >
          <div className="ojo" style={{ paddingBottom: 18 }}>
            {VENUE.direccion.calle} · Wynwood, {VENUE.direccion.ciudad}{" "}
            {VENUE.direccion.region} {VENUE.direccion.cp}
          </div>

          <h1 style={{ marginBottom: 26 }}>
            {es ? <>Jardín abierto.<br />Techo cuando<br />hace falta.</>
                : <>Open garden.<br />A roof when<br />you need one.</>}
          </h1>

          {/* Bloque de respuesta: primera frase = conclusión. */}
          <p className="respuesta" style={{ marginTop: 0, marginBottom: 26, color: "var(--texto)", maxWidth: "46ch" }}>
            {es
              ? "Club Wynwood son ~22.000 ft² de exterior en el Wynwood Arts District de Miami, con una palapa techada de ~4.000 ft² que cubre el evento si llueve, estacionamiento propio y licencia de licor propia. Tú traes la producción; nosotros entregamos el espacio. Disponible desde el 1 de octubre; el edificio, desde el 1 de noviembre."
              : "Club Wynwood is ~22,000 sq ft of outdoor space in Miami's Wynwood Arts District, with a ~4,000 sq ft covered structure for when it rains, its own parking and its own liquor license. You bring the production; we hand over the space. Available from October 1; the building, from November 1."}
          </p>

          {/* Las dos cosas que se pueden hacer, en la portada: pedir fecha o
              ver el sitio contado. Antes el recorrido no se anunciaba hasta
              mitad de página. */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignSelf: "flex-start" }}>
            <a href="#disponibilidad" className="boton">
              {es ? "Solicitar disponibilidad" : "Request availability"} <span aria-hidden>→</span>
            </a>
            <BotonRecorrido lang={lang} />
          </div>
        </div>

        <figure style={{ margin: 0, position: "relative", minHeight: "clamp(320px,62vh,660px)" }}>
          <Image
            src="/assets/aerea-predio.jpg"
            alt={es
              ? "Vista aérea del predio: la palapa techada, el paseo central y el jardín"
              : "Aerial view of the site: the covered structure, the central walk and the garden"}
            fill
            priority
            sizes="(max-width: 880px) 100vw, 46vw"
            style={{ objectFit: "cover", objectPosition: "52% 54%", filter: "saturate(.94) contrast(1.05)" }}
          />
          <figcaption
            className="ojo"
            style={{
              position: "absolute", left: 0, bottom: 0, padding: "10px 16px",
              background: "rgba(33,28,21,.72)", color: "var(--papel)", fontSize: 9,
            }}
          >
            {es
              ? "El predio completo · el edificio del fondo no es parte"
              : "The whole site · the background building is not part of it"}
          </figcaption>
        </figure>
      </header>

      {/* ---------------- EL TERRENO, EN UN DIBUJO ----------------
          Va justo debajo de la portada, y no abajo con la documentación, a
          propósito: Daniel, 2-sep-2026, «la página debe ser un concepto tipo
          folleto, fácil de entender el terreno». El dibujo se explica solo,
          se anima al entrar y contesta las tres preguntas de quien todavía
          está decidiendo. Ver components/LaminaRecinto.tsx.

          Desde el 4-sep-2026 el dibujo va dentro del RECORRIDO GUIADO: el mismo
          dibujo, pero narrado. Siete capítulos que contestan las siete preguntas
          que hace todo el que va a montar algo aquí, y en frases concretas del
          guion el dibujo cambia de modo y resalta la zona de la que se habla.

          No es un vídeo a propósito: un vídeo pesa, no se lee, no se indexa y
          hay que regrabarlo entero cuando cambia una cifra. Y funciona sin voz,
          así que la página no depende de que los audios existan. */}
      <Recorrido lang={lang} />
      {/* Las fotos, todas juntas y a su tamaño (Daniel, 7-sep: «que haya una zona con las fotos»). */}
      <Galeria lang={lang} />
      {/* Art Week, disponibilidad, usos y para quién (Daniel, 7-sep). Ver components/ParaQuien.tsx. */}
      <ParaQuien lang={lang} />

      {/* ---------------- QUÉ SE ALQUILA ---------------- */}
      <section style={{ borderBottom: "1px solid var(--regla)" }}>
        <div className="reja" style={{ paddingBlock: 76 }}>
          <div className="ojo" style={{ marginBottom: 30 }}>{es ? "Espacios" : "Spaces"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 44 }}>
            {PAGINAS.filter((p) => p.clave === "jardin" || p.clave === "tikiHut").map((p) => (
              <article key={p.clave}>
                <div style={{ position: "relative", aspectRatio: "3/2", marginBottom: 20 }}>
                  <Image
                    src={p.foto.src}
                    alt={p.foto.alt[lang]}
                    fill
                    sizes="(max-width: 880px) 100vw, 44vw"
                    style={{ objectFit: "cover", filter: "saturate(.94) contrast(1.03)" }}
                  />
                </div>
                <div className="ojo" style={{ paddingBottom: 10 }}>{p.ojo[lang]}</div>
                <h2 style={{ marginBottom: 14, fontSize: "clamp(26px,2.6vw,38px)" }}>{p.h1[lang]}</h2>
                <p style={{ margin: "0 0 18px", fontSize: 15, color: "var(--texto)" }}>{p.respuesta[lang]}</p>
                <a href={href(p.clave, lang)} style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ocre)" }}>
                  {es ? "Ver el espacio" : "See the space"} →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
{/* ---------------- DÓNDE ---------------- */}
      <section style={{ borderBottom: "1px solid var(--regla)" }}>
        <div className="reja" style={{ paddingBlock: 70, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 44 }}>
          <div>
            <div className="ojo" style={{ marginBottom: 18 }}>{es ? "Ubicación" : "Location"}</div>
            <h2 style={{ marginBottom: 16 }}>{VENUE.direccion.calle}</h2>
            <p className="respuesta" style={{ color: "var(--texto)" }}>
              {es
                ? "El predio está en el Wynwood Arts District, a una cuadra de los murales y a tres minutos del acceso a la I-95."
                : "The site sits in the Wynwood Arts District, one block from the murals and three minutes from the I-95 access."}
            </p>
            <a className="boton" style={{ marginTop: 8 }} href={`https://maps.google.com/?q=${encodeURIComponent(`${VENUE.direccion.calle}, ${VENUE.direccion.ciudad}, ${VENUE.direccion.region} ${VENUE.direccion.cp}`)}`} target="_blank" rel="noopener noreferrer">
              {es ? "Cómo llegar" : "Directions"} →
            </a>
          </div>
          <div>
            <div className="ojo" style={{ marginBottom: 14 }}>{es ? "Desde el venue · aprox." : "From the venue · approx."}</div>
            {TIEMPOS.map((t) => (
              <div key={t.es} style={{ display: "flex", justifyContent: "space-between", gap: 20, padding: "12px 0", borderBottom: "1px solid var(--regla)" }}>
                <span style={{ fontSize: 14 }}>{es ? t.es : t.en}</span>
                <span style={{ fontSize: 13, color: "var(--texto)" }}>{es ? t.valor : t.valorEn}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FRONTERA: aquí se acaba lo que vende ----------------
           Existe para que el cambio de registro se VEA. Arriba se decide si el
           sitio sirve; abajo se ejecuta el evento. Sin este corte, un visitante
           que solo quiere saber si le cabe la fiesta se topa de golpe con
           cotas y planos y cree que se ha equivocado de página. */}
      <section style={{ borderTop: "1px solid var(--regla)", background: "var(--papel-3)" }}>
        <div className="reja" style={{ paddingBlock: 52 }}>
          <div className="ojo" style={{ paddingBottom: 14 }}>
            {es ? "A partir de aquí, la documentación" : "From here on, the documentation"}
          </div>
          <p style={{ margin: 0, maxWidth: "62ch", fontSize: 15, lineHeight: 1.7, color: "var(--texto)" }}>
            {es
              ? "Las medidas, la planta a escala, el edificio y la ficha técnica. Va abajo a propósito: si todavía estás decidiendo si el sitio te sirve, lo de arriba ya lo contesta. Esto es para cuando te toca montar el evento."
              : "Measurements, the plan to scale, the building and the spec sheet. It sits down here on purpose: if you are still deciding whether the place works for you, everything above already answers that. This is for when you have to build the event."}
          </p>
        </div>
      </section>
      {/* Las cifras, dibujadas. Ver components/Cifras.tsx: el plano a escala, los
          puntos de veinte en veinte y las cuatro cabañas dicen en un vistazo lo
          que cinco números en fila obligaban a deducir. */}
      <Cifras lang={lang} />
      {/* Las dos láminas técnicas, para quien ya está montando. El dibujo que
          explica el terreno está arriba, debajo de la portada. */}
      <Laminas lang={lang}
               planta={<LaminaPlanta lang={lang} />}
               edificio={<LaminaEdificio lang={lang} />} />
{/* ---------------- FICHA TÉCNICA ---------------- */}
      <section id="ficha" style={{ background: "var(--tinta)", color: "var(--papel-3)" }}>
        <div className="reja" style={{ paddingBlock: 80 }}>
          <div className="ojo" style={{ marginBottom: 24 }}>{es ? "Ficha técnica" : "Spec sheet"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 44, marginBottom: 48 }}>
            <h2 style={{ color: "var(--papel-3)" }}>
              {es ? <>Las medidas del sitio.</> : <>The site&rsquo;s measurements.</>}
            </h2>
            <p className="respuesta" style={{ color: "var(--texto)", margin: 0 }}>
              {es
                ? "Estas son las medidas y los aforos del sitio. Lo que todavía no está medido —la potencia, por dónde se entra a descargar, el parking, los baños, la licencia de licor y hasta qué hora se puede— lo revisamos juntos cuando vengas a verlo, y te lo mandamos por escrito."
                : "These are the site's measurements and capacities. What is not measured yet —power, where you load in, parking, restrooms, the liquor licence and how late you can run— we go through together when you come to see it, and you get it in writing."}
            </p>
          </div>

          <dl style={{ margin: 0 }}>
            {verificados.map((f) => (
              <div key={f.clave} style={{ display: "grid", gridTemplateColumns: "112px minmax(0,1fr) minmax(0,1fr)", gap: 24, padding: "17px 0", borderBottom: "1px solid var(--regla-osc)", alignItems: "baseline" }}>
                <div className="ojo" style={{ color: "var(--papel-3)" }}>✓ {es ? "Verificado" : "Verified"}</div>
                <dt style={{ fontSize: 15 }}>{es ? f.es : f.en}</dt>
                <dd style={{ margin: 0, fontSize: 15, color: "#bbb2a2" }}>{es ? f.valorEs : f.valorEn}</dd>
              </div>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "112px minmax(0,1fr) minmax(0,1fr)", gap: 24, padding: "17px 0", borderBottom: "1px solid var(--regla-osc)", alignItems: "baseline" }}>
              <div className="ojo">○ {es ? "En visita" : "At visit"}</div>
              <dt style={{ fontSize: 15 }}>{es ? "Ficha de infraestructura" : "Infrastructure sheet"}</dt>
              <dd style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: "var(--texto)" }}>
                {enVisita.map((f) => (es ? f.es : f.en)).join(" · ")}.{" "}
                {es ? "Se levanta contigo en sitio y se entrega por escrito." : "Surveyed with you on site and delivered in writing."}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Las dudas van ANTES del formulario, no en una página aparte. Es el
          momento en que dejan de ser curiosidad y pasan a ser freno: la persona
          ya decidió que el sitio le gusta y ahora piensa «ya, ¿pero cuánto
          cuesta y qué pasa si llueve?». */}
      <Dudas lang={lang} />

      {/* ---------------- SOLICITAR ---------------- */}
      <section id="disponibilidad" style={{ background: "var(--papel-2)" }}>
        <div className="reja" style={{ paddingBlock: 80 }}>
          <div className="ojo" style={{ marginBottom: 22 }}>{es ? "Solicitar disponibilidad" : "Request availability"}</div>
          <h2 style={{ marginBottom: 20 }}>{es ? "Cuéntanos tu evento." : "Tell us about your event."}</h2>
          <p className="respuesta" style={{ color: "var(--texto)", marginBottom: 36 }}>
            {es
              ? "Con el tipo de evento, la fecha y el número de invitados respondemos con disponibilidad real y condiciones. Si necesitas ver el espacio, coordinamos la visita y levantamos la ficha técnica contigo."
              : "With the event type, date and guest count we come back with real availability and terms. If you need to see the space, we schedule the visit and survey the spec sheet with you."}
          </p>
          {/**
            * Doce campos a la vista parecen doce campos obligatorios, y ahí es
            * donde alguien cierra la pestaña. Solo hacen falta dos. Decirlo
            * cuesta una línea y cambia lo que el formulario aparenta ser.
            */}
          <p className="ojo" style={{ color: "var(--texto-3)", marginBottom: 28 }}>
            {es
              ? "Solo el nombre y el correo son obligatorios. Lo demás nos deja responderte con cifras en vez de con un «depende»."
              : "Only name and email are required. The rest lets us answer with numbers instead of «it depends»."}
          </p>
          <Formulario lang={lang} />
          <Contacto lang={lang} />
        </div>
      </section>
    </>
  );
}

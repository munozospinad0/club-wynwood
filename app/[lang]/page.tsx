import Image from "next/image";
import { asIdioma, href } from "@/lib/i18n";
import { FICHA, TIEMPOS, VENUE } from "@/lib/venue";
import { PAGINAS } from "@/lib/contenido";
import Formulario from "@/components/Formulario";
import Lamina from "@/components/Lamina";
import LaminaEdificio from "@/components/LaminaEdificio";
import Laminas from "@/components/Laminas";
import LaminaConjunto from "@/components/LaminaConjunto";
import LaminaPlanta from "@/components/LaminaPlanta";

/**
 * Home. El orden sigue cómo decide un productor:
 *   portada -> cifras -> QUÉ alquilo -> qué incluye -> números -> dónde -> pedir
 *
 * En el sitio anterior la filosofía del encuadre ("se alquila el contenedor")
 * iba ANTES de decir qué se alquila.
 */

const CIFRAS_CABECERA = [
  { es: "Superficie total", en: "Total area", v: "~22 000 ft²", sub: "2 045 m²" },
  { es: "Techado", en: "Covered", v: "~4 000 ft²", sub: "372 m²" },
  { es: "De pie", en: "Standing", v: "~600", sub: "" },
  { es: "Sentados", en: "Seated", v: "~300", sub: "" },
  { es: "Cabañas", en: "Cabanas", v: "8", sub: "" },
];

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const lang = asIdioma((await params).lang);
  const es = lang === "es";
  const verificados = FICHA.filter((f) => f.estado === "verificado");
  const enVisita = FICHA.filter((f) => f.estado === "en-visita");

  return (
    <>
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
              ? "Club Wynwood son ~22.000 ft² de exterior en el Wynwood Arts District de Miami, con una palapa techada de ~4.000 ft² que cubre el evento si llueve. Tú traes la producción; nosotros entregamos el espacio."
              : "Club Wynwood is ~22,000 sq ft of outdoor space in Miami's Wynwood Arts District, with a ~4,000 sq ft covered structure for when it rains. You bring the production; we hand over the space."}
          </p>

          <a href="#disponibilidad" className="boton" style={{ alignSelf: "flex-start" }}>
            {es ? "Solicitar disponibilidad" : "Request availability"} <span aria-hidden>→</span>
          </a>
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

      {/* ---------------- CIFRAS, a ancho completo ---------------- */}
      <section style={{ borderBottom: "1px solid var(--regla)", background: "var(--papel-2)" }}>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {CIFRAS_CABECERA.map((c) => (
            <div key={c.es} style={{ flex: "1 1 200px", padding: "26px 24px", borderRight: "1px solid var(--regla)" }}>
              <div className="ojo" style={{ paddingBottom: 10 }}>{es ? c.es : c.en}</div>
              <div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 32, lineHeight: 1, letterSpacing: "-.02em" }}>
                {c.v}
              </div>
              {c.sub && <div style={{ fontSize: 12, color: "var(--texto)", paddingTop: 6 }}>{c.sub}</div>}
            </div>
          ))}
        </div>
      </section>

      <Laminas lang={lang}
               planta={<LaminaPlanta lang={lang} />}
               conjunto={<LaminaConjunto lang={lang} />}
               exterior={<Lamina />}
               edificio={<LaminaEdificio lang={lang} />} />

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
          <Formulario lang={lang} />
        </div>
      </section>
    </>
  );
}

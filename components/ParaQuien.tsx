import { DISPONIBILIDAD, PARA_QUIEN, USOS } from "@/lib/venue";
import type { Idioma } from "@/lib/i18n";

/**
 * PARA QUIÉN, DESDE CUÁNDO Y LA SEMANA QUE MANDA.
 *
 * Daniel, 7-sep-2026, de sus notas: el sitio va dirigido a promotores de
 * restaurantes, clubs y discotecas, artistas (pintores, escultores), brokers,
 * entretenimiento y promotores de eventos; el exterior está disponible desde el
 * 1 de octubre y el edificio desde el 1 de noviembre, con dos tipos de uso
 * (evento y oficina) y la cocina como adicional; y el objetivo comercial
 * inmediato es llenar Miami Art Week (30 nov – 6 dic). Esta sección pone las
 * tres cosas juntas, arriba, antes de la documentación: es lo que decide si la
 * persona que llegó de un anuncio sigue leyendo.
 *
 * Los datos salen de lib/venue.ts, la fuente única: aquí no se escribe ninguna
 * fecha a mano.
 */
export default function ParaQuien({ lang }: { lang: Idioma }) {
  const es = lang === "es";
  const etiqueta: React.CSSProperties = {
    fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase",
    padding: "9px 13px", border: "1px solid var(--regla)", color: "var(--tinta)",
  };
  return (
    <section style={{ borderBottom: "1px solid var(--regla)", background: "var(--papel-2)" }}>
      <div className="reja" style={{ paddingBlock: 70, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "44px 56px", alignItems: "start" }}>

        {/* ── Art Week: la fecha que manda ── */}
        <div>
          <div className="ojo" style={{ marginBottom: 16 }}>{es ? "Miami Art Week 2026" : "Miami Art Week 2026"}</div>
          <h2 style={{ marginBottom: 14 }}>
            {es ? <>30 de noviembre al 6 de diciembre.<br />Fechas abiertas.</> : <>November 30 to December 6.<br />Open dates.</>}
          </h2>
          <p style={{ margin: "0 0 18px", fontSize: 15, lineHeight: 1.65, color: "var(--texto)", maxWidth: "46ch" }}>
            {es
              ? "A tres cuadras de Mana Wynwood, donde van Red Dot y Spectrum, y a cuatro minutos a pie de Wynwood Walls. Lote abierto con palapa techada, estacionamiento propio y licencia de licor propia: el formato de las fiestas y activaciones de la semana."
              : "Three blocks from Mana Wynwood, home to Red Dot and Spectrum, and a four-minute walk from Wynwood Walls. An open lot with a covered structure, its own parking and its own liquor license: the format of the week's parties and activations."}
          </p>
          <p style={{ margin: "0 0 22px", fontSize: 13.5, lineHeight: 1.6, color: "var(--texto)", maxWidth: "46ch" }}>
            {es
              ? "El permiso de evento especial de la City of Miami para esa semana cierra el 11 de octubre: si tu activación lo necesita, la conversación útil es ahora."
              : "The City of Miami special-event permit for that week closes on October 11: if your activation needs one, the useful conversation is now."}
          </p>
          <a href="#disponibilidad" className="boton">
            {es ? "Pedir fechas de Art Week" : "Ask for Art Week dates"} <span aria-hidden>→</span>
          </a>
        </div>

        {/* ── Disponibilidad y usos ── */}
        <div>
          <div className="ojo" style={{ marginBottom: 16 }}>{es ? "Disponibilidad y usos" : "Availability and uses"}</div>
          <dl style={{ margin: "0 0 26px" }}>
            {[
              { k: es ? "Exterior: jardín y Tiki Hut" : "Outdoors: garden and Tiki Hut", v: es ? `desde el ${DISPONIBILIDAD.exterior.es}` : `from ${DISPONIBILIDAD.exterior.en}` },
              { k: es ? "Edificio · 2 niveles" : "Building · 2 levels", v: es ? `desde el ${DISPONIBILIDAD.edificio.es}` : `from ${DISPONIBILIDAD.edificio.en}` },
            ].map((f) => (
              <div key={f.k} style={{ display: "flex", justifyContent: "space-between", gap: 20, padding: "11px 0", borderBottom: "1px solid var(--regla)" }}>
                <dt style={{ fontSize: 14.5 }}>{f.k}</dt>
                <dd style={{ margin: 0, fontSize: 13.5, color: "var(--texto)", textAlign: "right" }}>{f.v}</dd>
              </div>
            ))}
          </dl>
          <div style={{ display: "grid", gap: 12 }}>
            {USOS.map((u) => (
              <div key={u.clave} style={{ display: "grid", gridTemplateColumns: "150px minmax(0,1fr)", gap: 14, alignItems: "baseline" }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase" }}>{es ? u.es : u.en}</span>
                <span style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--texto)" }}>{es ? u.detalleEs : u.detalleEn}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Para quién ── */}
        <div style={{ gridColumn: "1 / -1" }}>
          <div className="ojo" style={{ marginBottom: 14 }}>{es ? "Para quién" : "Who it is for"}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {PARA_QUIEN.map((p) => <span key={p.en} style={etiqueta}>{es ? p.es : p.en}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}

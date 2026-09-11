import Formulario from "@/components/Formulario";
import type { Idioma } from "@/lib/i18n";

/**
 * EL CIERRE DE LAS PÁGINAS INTERIORES.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * EL AGUJERO QUE TAPA
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Las catorce interiores terminaban con «Seguir leyendo» y trece enlaces. Nada
 * más. O sea: alguien llega a /bodas desde Google, lee la página entera, se
 * convence… y lo único que el sitio le ofrece es **leer otra página**.
 *
 * Eso es grave y no es un detalle de diseño. Estas catorce páginas existen
 * precisamente para captar tráfico de búsqueda: son la mitad del trabajo de SEO
 * del sitio. Traer a alguien hasta aquí y no dejarle pedir la fecha es pagar el
 * viaje y no abrir la puerta.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * POR QUÉ EL FORMULARIO ENTERO Y NO UN BOTÓN
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Un botón «solicitar disponibilidad» que lleva a la home obliga a un salto de
 * página justo en el punto de más intención, y cada salto pierde gente. El
 * formulario es un componente cliente que ya viaja en el bundle: ponerlo aquí
 * no añade descarga, solo marcado.
 *
 * El titular menciona de qué iba la página. Un cierre genérico después de tres
 * pantallas hablando de bodas se lee como si el sitio hubiera dejado de
 * escuchar.
 */
export default function Cierre({ lang, tema }: { lang: Idioma; tema?: string }) {
  const es = lang === "es";

  return (
    <section id="disponibilidad" style={{ background: "var(--papel-2)", borderTop: "1px solid var(--regla)" }}>
      <div className="reja" style={{ paddingBlock: 76 }}>
        <div className="ojo" style={{ marginBottom: 22 }}>
          {es ? "Solicitar disponibilidad" : "Request availability"}
        </div>

        <h2 style={{ marginBottom: 18, maxWidth: "18ch" }}>
          {tema
            ? es ? <>¿Tienes fecha para {tema}?</> : <>Have a date for {tema}?</>
            : es ? "Cuéntanos tu evento." : "Tell us about your event."}
        </h2>

        <p className="respuesta" style={{ color: "var(--texto)", marginBottom: 34, maxWidth: "54ch" }}>
          {es
            ? "Con la fecha y el número de invitados te respondemos con disponibilidad real y presupuesto en 24 horas hábiles. Sin visita previa y sin compromiso."
            : "With the date and the guest count we come back with real availability and a quote within 24 business hours. No site visit and no commitment."}
        </p>

        <Formulario lang={lang} />
      </div>
    </section>
  );
}

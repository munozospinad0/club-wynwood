import { FAQ } from "@/lib/contenido";
import { RUTAS, type Idioma } from "@/lib/i18n";

/**
 * LAS DUDAS, EN LA HOME Y ANTES DEL FORMULARIO.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * POR QUÉ AQUÍ Y NO SOLO EN /preguntas
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Había ocho respuestas buenas, y estaban todas en una página aparte. Quien
 * llegaba a la home con una duda tenía que **irse a buscarla**, y una duda que
 * obliga a navegar casi siempre acaba en cerrar la pestaña, no en encontrar la
 * respuesta.
 *
 * Van justo ANTES del formulario a propósito. Ése es el momento en que las
 * dudas dejan de ser curiosidad y pasan a ser freno: la persona ya decidió que
 * el sitio le gusta y ahora piensa «ya, ¿pero cuánto cuesta y qué pasa si
 * llueve?». Contestar ahí es quitar el freno justo donde aprieta.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * POR QUÉ NO ES UN ACORDEÓN
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Un acordeón esconde ocho respuestas detrás de ocho clics y obliga a adivinar
 * cuál contesta lo tuyo por el título. Aquí las respuestas son cortas y caben
 * abiertas: se barre la columna con la vista y se para en la que importa.
 *
 * Y hay una razón que no es de diseño: los buscadores de IA citan texto que
 * está en el HTML servido. Abierto se cita; detrás de un clic, según el
 * rastreador, puede que no. Media razón de ser de este sitio es que ChatGPT o
 * Perplexity puedan contestar «¿qué pasa si llueve en Club Wynwood?» con
 * nuestras palabras.
 */
export default function Dudas({ lang }: { lang: Idioma }) {
  const es = lang === "es";

  return (
    <section
      aria-labelledby="dudas-titulo"
      style={{ borderTop: "1px solid var(--regla)", background: "var(--papel)" }}
    >
      <div className="reja" style={{ paddingBlock: 74 }}>
        <div className="ojo" style={{ paddingBottom: 16 }}>
          {es ? "Antes de escribir" : "Before you write"}
        </div>

        <h2 id="dudas-titulo" style={{ marginBottom: 12, maxWidth: "20ch" }}>
          {es ? "Lo que casi todos preguntan." : "What almost everyone asks."}
        </h2>

        <p style={{ margin: "0 0 42px", maxWidth: "56ch", fontSize: 15,
                    lineHeight: 1.7, color: "var(--texto)" }}>
          {es
            ? "Están contestadas aquí para que no tengas que escribir para averiguarlo. Si lo tuyo no está, va en el formulario y te lo respondemos con la disponibilidad."
            : "Answered here so you do not have to write in order to find out. If yours is not here, put it in the form and we answer it along with availability."}
        </p>

        {/* Dos columnas en pantalla ancha, una en móvil. Las respuestas son
            cortas, así que abiertas no cansan y se barren con la vista. */}
        <dl
          style={{
            margin: 0,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            columnGap: 52,
            borderTop: "1px solid var(--regla)",
          }}
        >
          {FAQ.map((f) => (
            <div
              key={f.q.es}
              style={{ padding: "20px 0 22px", borderBottom: "1px solid var(--regla)" }}
            >
              <dt
                style={{
                  font: "600 17px/1.35 var(--display), Georgia, serif",
                  color: "var(--tinta)",
                  letterSpacing: "-.005em",
                  paddingBottom: 9,
                }}
              >
                {f.q[lang]}
              </dt>
              <dd
                style={{
                  margin: 0,
                  fontSize: 14,
                  lineHeight: 1.68,
                  color: "var(--texto)",
                  maxWidth: "52ch",
                }}
              >
                {f.a[lang]}
              </dd>
            </div>
          ))}
        </dl>

        <a
          href={`/${lang}/${RUTAS.faq[lang]}`}
          style={{
            display: "inline-block",
            marginTop: 30,
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: ".18em",
            textTransform: "uppercase",
            color: "var(--ocre)",
          }}
        >
          {es ? "Todas las preguntas" : "All the questions"} →
        </a>
      </div>
    </section>
  );
}

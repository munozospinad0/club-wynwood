"use client";

import { VENUE } from "@/lib/venue";
import { ev } from "@/lib/medicion";
import type { Idioma } from "@/lib/i18n";

/**
 * LA LÍNEA DE CONTACTO DIRECTO, debajo del formulario.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * POR QUÉ HACE FALTA, SI YA HAY FORMULARIO
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Hasta ahora el teléfono y el correo solo aparecían **cuando el envío
 * fallaba**. O sea: el único camino para contactar era rellenar ocho campos, y
 * quien no quisiera rellenarlos se iba sin dejar rastro.
 *
 * Eso choca con quién compra esto. Un productor con una fecha en tres semanas y
 * un cliente esperando no rellena un formulario: llama. Esconder el teléfono
 * ordena bien a quien ya decidió pedir presupuesto, y pierde entero al que
 * tiene prisa —que suele ser el que más presupuesto trae—.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * Y POR QUÉ NO ES EL CANAL PRINCIPAL
 * ─────────────────────────────────────────────────────────────────────────
 *
 * El formulario sigue arriba y sigue siendo lo primero, por dos razones que no
 * son de diseño: es el que trae la fecha y los invitados —las dos señales que
 * más pesan en la cualificación— y es el único que entra al CRM con su
 * atribución. Una llamada llega sin `gclid`, sin `fbclid` y sin utm: cierra el
 * negocio pero no cierra el bucle, y con dos o cuatro leads calificados al mes
 * la atribución es lo único con lo que las plataformas pueden aprender algo.
 *
 * De ahí la jerarquía: el formulario ocupa el sitio, esto es una línea debajo.
 *
 * `contact_click` es micro-conversión. Se mira, no se optimiza: marcarla como
 * conversión en GA4 enseñaría a Google a traer gente que hace clic en un
 * teléfono, que es gratis.
 */
export default function Contacto({ lang }: { lang: Idioma }) {
  const es = lang === "es";

  // Se leen de venue.ts, que es la fuente única. Escribir el número a mano en un
  // componente es exactamente cómo el teléfono del OPERADOR llegó a estar
  // publicado en el sitio durante semanas.
  const tel = VENUE.telefono;
  const telLimpio = tel.replace(/[^+\d]/g, "");
  const telVisible = tel.replace(/^\+1-/, "").replace(/-/g, " ").replace(/^(\d{3}) /, "($1) ");

  const enlace: React.CSSProperties = {
    color: "var(--tinta)",
    textDecorationColor: "var(--regla)",
    textUnderlineOffset: "3px",
  };

  return (
    <p
      style={{
        margin: "26px 0 0",
        paddingTop: 20,
        borderTop: "1px solid var(--regla)",
        fontSize: 13.5,
        lineHeight: 1.7,
        color: "var(--texto)",
        maxWidth: "54ch",
      }}
    >
      <span
        className="ojo"
        style={{ display: "block", marginBottom: 7 }}
      >
        {es ? "O directamente" : "Or straight away"}
      </span>

      <a
        href={`tel:${telLimpio}`}
        style={enlace}
        onClick={() => ev("contact_click", { method: "telefono", desde: "cierre" })}
      >
        {telVisible}
      </a>
      {" · "}
      <a
        href={`mailto:${VENUE.email}`}
        style={enlace}
        onClick={() => ev("contact_click", { method: "email", desde: "cierre" })}
      >
        {VENUE.email}
      </a>
      {/* WhatsApp (el de Rene): solo cuando el número esté en venue.ts */}
      {VENUE.whatsapp && (
        <>
          {" · "}
          <a
            href={`https://wa.me/${VENUE.whatsapp.replace(/[^\d]/g, "")}?text=${encodeURIComponent(es ? "Hola, quiero consultar disponibilidad en Club Wynwood." : "Hi, I would like to check availability at Club Wynwood.")}`}
            style={enlace}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => ev("contact_click", { method: "whatsapp", desde: "cierre" })}
          >
            WhatsApp
          </a>
        </>
      )}
      <br />
      {es
        ? "Para llamadas, de lunes a viernes en horario de Miami."
        : "For calls, Monday to Friday, Miami time."}
    </p>
  );
}

import { VENUE } from "@/lib/venue";

/**
 * CONDICIONES DEL SERVICIO — 24-sep-2026. Las pide Meta para publicar la app
 * «Agente Club Wynwood». Cubren el USO DEL SITIO, los formularios y el canal de
 * WhatsApp; el alquiler del venue se rige por el contrato que se firma aparte, y
 * aquí se dice así para no prometer nada que ese contrato no diga.
 */

const s = {
  main: { maxWidth: 760, margin: "0 auto", padding: "56px 20px 96px", fontFamily: "var(--f-cuerpo), system-ui, sans-serif", fontSize: 17, lineHeight: 1.65 } as React.CSSProperties,
  h1: { fontFamily: "var(--f-display), Georgia, serif", fontWeight: 400, fontSize: "clamp(32px, 6vw, 48px)", lineHeight: 1.1, margin: "0 0 12px" } as React.CSSProperties,
  h2: { fontFamily: "var(--f-display), Georgia, serif", fontWeight: 400, fontSize: 26, margin: "40px 0 8px" } as React.CSSProperties,
  meta: { fontSize: 14, color: "var(--texto)", margin: 0 } as React.CSSProperties,
  sep: { border: 0, borderTop: "1px solid var(--regla)", margin: "64px 0" } as React.CSSProperties,
};

const correo = <a href={`mailto:${VENUE.email}`}>{VENUE.email}</a>;

export default function Condiciones() {
  return (
    <main style={s.main}>
      <p style={s.meta}><a href="/en">Club Wynwood</a> · <a href="/privacy">Privacy</a> · <a href="#es">Español</a></p>
      <h1 style={s.h1}>Terms of service</h1>
      <p style={s.meta}>CLUB WYNWOOD LLC · 2129 NW 1st Ct, Miami, FL 33127 · Last updated September 24, 2026</p>

      <h2 style={s.h2}>What these terms cover</h2>
      <p>These terms apply to clubwynwood.com, the forms on it and on our Facebook and Instagram pages, and our WhatsApp business number. By using them you accept these terms. Renting the venue is governed by the written rental agreement signed for each event, not by this page.</p>

      <h2 style={s.h2}>Requests and quotes</h2>
      <p>Sending a request does not reserve a date or create any obligation for you or for us. A date is only reserved once a rental agreement is signed and the payment it sets out is made. Availability, capacities and descriptions on the site are for guidance and are confirmed in each quote.</p>

      <h2 style={s.h2}>WhatsApp and other messages</h2>
      <p>If you give us your phone number or write to us on WhatsApp, you agree that we may reply there about your request. We only send messages related to your event. Write <b>STOP</b> at any time and we will stop messaging you.</p>

      <h2 style={s.h2}>Acceptable use</h2>
      <p>Do not send false information, spam or content that is unlawful or infringes someone else’s rights, and do not try to interfere with the site or its forms.</p>

      <h2 style={s.h2}>Content</h2>
      <p>Photos, drawings, text and the Club Wynwood name on this site belong to CLUB WYNWOOD LLC or are used with permission. Do not reuse them without written consent.</p>

      <h2 style={s.h2}>Liability</h2>
      <p>The site is provided as is. To the extent the law allows, we are not liable for indirect damages arising from its use or from temporary unavailability of the site or our channels.</p>

      <h2 style={s.h2}>Privacy</h2>
      <p>How we handle personal data is explained in our <a href="/privacy">privacy policy</a>.</p>

      <h2 style={s.h2}>Law and contact</h2>
      <p>These terms are governed by the laws of the State of Florida, USA. Questions: {correo} · {VENUE.telefono}.</p>

      <hr style={s.sep} />

      <section id="es" lang="es">
        <h1 style={s.h1}>Condiciones del servicio</h1>
        <p style={s.meta}>CLUB WYNWOOD LLC · Actualizadas el 24 de septiembre de 2026</p>

        <h2 style={s.h2}>Qué cubren</h2>
        <p>Estas condiciones aplican a clubwynwood.com, a sus formularios y a los de nuestras páginas de Facebook e Instagram, y a nuestro número de WhatsApp de empresa. Al usarlos aceptas estas condiciones. El alquiler del venue se rige por el contrato de alquiler que se firma para cada evento, no por esta página.</p>

        <h2 style={s.h2}>Solicitudes y cotizaciones</h2>
        <p>Enviar una solicitud no reserva una fecha ni crea obligaciones para ti ni para nosotros. Una fecha solo queda reservada cuando se firma el contrato de alquiler y se hace el pago que este establece. La disponibilidad, los aforos y las descripciones del sitio son orientativos y se confirman en cada cotización.</p>

        <h2 style={s.h2}>WhatsApp y otros mensajes</h2>
        <p>Si nos das tu teléfono o nos escribes por WhatsApp, aceptas que te respondamos por ahí sobre tu solicitud. Solo enviamos mensajes relacionados con tu evento. Escribe <b>STOP</b> o <b>BAJA</b> cuando quieras y dejamos de escribirte.</p>

        <h2 style={s.h2}>Uso aceptable</h2>
        <p>No envíes información falsa, spam ni contenido ilegal o que infrinja derechos de otros, y no intentes interferir con el sitio o sus formularios.</p>

        <h2 style={s.h2}>Contenido</h2>
        <p>Las fotos, dibujos, textos y el nombre Club Wynwood de este sitio pertenecen a CLUB WYNWOOD LLC o se usan con permiso. No los reutilices sin autorización por escrito.</p>

        <h2 style={s.h2}>Responsabilidad</h2>
        <p>El sitio se ofrece tal cual. En la medida que la ley lo permita, no respondemos por daños indirectos derivados de su uso ni de que el sitio o nuestros canales no estén disponibles temporalmente.</p>

        <h2 style={s.h2}>Privacidad</h2>
        <p>Cómo tratamos los datos personales se explica en nuestra <a href="/privacy#es">política de privacidad</a>.</p>

        <h2 style={s.h2}>Ley y contacto</h2>
        <p>Estas condiciones se rigen por las leyes del Estado de Florida, EE. UU. Preguntas: {correo} · {VENUE.telefono}.</p>
      </section>
    </main>
  );
}

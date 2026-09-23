import { VENUE } from "@/lib/venue";

/**
 * POLÍTICA DE PRIVACIDAD Y BORRADO DE DATOS — 23-sep-2026.
 *
 * La pide Meta para publicar la app «Agente Club Wynwood» (WhatsApp Cloud API y
 * formularios instantáneos). Describe lo que el sitio y el CRM hacen DE VERDAD:
 * si mañana se añade una herramienta que recoge datos, hay que añadirla aquí.
 * Anclas estables: #delete-data / #borrar-datos es la URL de borrado para Meta.
 */

const ACTUALIZADA = { en: "September 23, 2026", es: "23 de septiembre de 2026" };

const s = {
  main: { maxWidth: 760, margin: "0 auto", padding: "56px 20px 96px", fontFamily: "var(--f-cuerpo), system-ui, sans-serif", fontSize: 17, lineHeight: 1.65 } as React.CSSProperties,
  h1: { fontFamily: "var(--f-display), Georgia, serif", fontWeight: 400, fontSize: "clamp(32px, 6vw, 48px)", lineHeight: 1.1, margin: "0 0 12px" } as React.CSSProperties,
  h2: { fontFamily: "var(--f-display), Georgia, serif", fontWeight: 400, fontSize: 26, margin: "40px 0 8px" } as React.CSSProperties,
  meta: { fontSize: 14, color: "var(--texto)", margin: 0 } as React.CSSProperties,
  sep: { border: 0, borderTop: "1px solid var(--regla)", margin: "64px 0" } as React.CSSProperties,
  nav: { display: "flex", gap: 20, fontSize: 15, margin: "20px 0 0", flexWrap: "wrap" } as React.CSSProperties,
};

const d = VENUE.direccion as unknown as Record<string, string>;
const direccion = [d.calle ?? d.linea1 ?? "2129 NW 1st Ct", d.ciudad ?? "Miami", "FL 33127"].filter(Boolean).join(", ");

export default function Privacidad() {
  return (
    <main style={s.main}>
      <p style={s.meta}><a href="/en">Club Wynwood</a></p>
      <h1 style={s.h1}>Privacy policy</h1>
      <p style={s.meta}>CLUB WYNWOOD LLC · Last updated {ACTUALIZADA.en}</p>
      <nav style={s.nav} aria-label="On this page">
        <a href="#delete-data">Delete your data</a>
        <a href="#es">Leer en español</a>
      </nav>

      <h2 style={s.h2}>Who we are</h2>
      <p>Club Wynwood is an open-air event venue operated by CLUB WYNWOOD LLC, {direccion}. Contact: <a href={`mailto:${VENUE.email}`}>{VENUE.email}</a> · {VENUE.telefono}.</p>

      <h2 style={s.h2}>What we collect</h2>
      <ul>
        <li><b>What you tell us</b> when you request a date on clubwynwood.com, fill in a form on Facebook or Instagram, or write to us on WhatsApp or by email: name, email, phone number, company, city, event date, number of guests, type of event, budget range and any message you send.</li>
        <li><b>WhatsApp conversations</b> with our business number: your WhatsApp name and number and the messages and files you send us.</li>
        <li><b>How you reached us</b>: the ad or link you came from (for example utm parameters and Google or Meta click identifiers), the page where you wrote to us and how many times you visited.</li>
        <li><b>Technical data</b> from your browser when you send a form: IP address, browser (user agent) and the cookies set by the Meta pixel (_fbp, _fbc).</li>
      </ul>

      <h2 style={s.h2}>What we use it for</h2>
      <ul>
        <li>To answer your request, send you availability, a quote and the venue details, and manage a booking if you make one.</li>
        <li>To measure which ads bring real enquiries, so we stop paying for the ones that do not.</li>
      </ul>
      <p>We do not sell your data and we do not use it for anything unrelated to your event.</p>

      <h2 style={s.h2}>Who we share it with</h2>
      <p>Only with the services we use to run the venue, each under its own terms:</p>
      <ul>
        <li><b>Meta</b> (WhatsApp Business Platform, Facebook and Instagram lead forms, Meta pixel and Conversions API). When we tell Meta that an enquiry arrived or a booking was made, email and phone are sent as irreversible hashes (SHA-256), never in plain text.</li>
        <li><b>Google</b> (Google Analytics, Google Tag Manager and Google Ads), with the same hashing for booking measurement.</li>
        <li><b>Vercel</b> and <b>Neon</b>, which host our website and the database where we keep enquiries.</li>
      </ul>

      <h2 style={s.h2}>Cookies</h2>
      <p>The site uses analytics and advertising cookies from Google and Meta to measure visits and ads. Advertising cookies follow your consent choice where the law requires it. You can block them in your browser; the forms keep working.</p>

      <h2 style={s.h2}>How long we keep it</h2>
      <p>For as long as we need it to answer your enquiry and manage any booking that results from it, and afterwards only what the law requires us to keep. You can ask us to delete it at any time.</p>

      <h2 style={s.h2}>Your rights</h2>
      <p>You can ask us what data we hold about you, correct it, or delete it. Write to <a href={`mailto:${VENUE.email}`}>{VENUE.email}</a>.</p>

      <h2 style={s.h2} id="delete-data">Delete your data</h2>
      <p>To delete everything we hold about you, including WhatsApp conversations and data received from Facebook or Instagram forms:</p>
      <ol>
        <li>Email <a href={`mailto:${VENUE.email}?subject=Delete%20my%20data`}>{VENUE.email}</a> with the subject <b>“Delete my data”</b>, from the email address you used with us, or send the word <b>DELETE</b> to our WhatsApp number from the number you used.</li>
        <li>We delete your data from our systems within 30 days and confirm it to you by the same channel.</li>
      </ol>
      <p>Hashed data already sent to Meta or Google for ad measurement cannot be linked back to you by us; those companies delete it according to their own policies.</p>

      <p style={{ fontSize: 15, color: "var(--texto)", marginTop: 40 }}>The page on this site about permanent residency is a service of Law Offices of Sandra Clavijo, an independent law firm, which handles the data sent through that page under its own policy.</p>

      <hr style={s.sep} />

      <section id="es" lang="es">
        <h1 style={s.h1}>Política de privacidad</h1>
        <p style={s.meta}>CLUB WYNWOOD LLC · Actualizada el {ACTUALIZADA.es}</p>
        <nav style={s.nav} aria-label="En esta página"><a href="#borrar-datos">Borrar tus datos</a></nav>

        <h2 style={s.h2}>Quiénes somos</h2>
        <p>Club Wynwood es un venue de eventos al aire libre operado por CLUB WYNWOOD LLC, {direccion}. Contacto: <a href={`mailto:${VENUE.email}`}>{VENUE.email}</a> · {VENUE.telefono}.</p>

        <h2 style={s.h2}>Qué datos recogemos</h2>
        <ul>
          <li><b>Lo que nos cuentas</b> al pedir una fecha en clubwynwood.com, al llenar un formulario en Facebook o Instagram, o al escribirnos por WhatsApp o correo: nombre, correo, teléfono, empresa, ciudad, fecha del evento, número de invitados, tipo de evento, rango de presupuesto y los mensajes que nos mandes.</li>
          <li><b>Conversaciones de WhatsApp</b> con nuestro número de empresa: tu nombre y número de WhatsApp y los mensajes y archivos que nos envíes.</li>
          <li><b>Cómo llegaste</b>: el anuncio o enlace del que vienes (por ejemplo parámetros utm e identificadores de clic de Google o Meta), la página desde la que escribiste y cuántas veces nos visitaste.</li>
          <li><b>Datos técnicos</b> de tu navegador al enviar un formulario: dirección IP, navegador (user agent) y las cookies del píxel de Meta (_fbp, _fbc).</li>
        </ul>

        <h2 style={s.h2}>Para qué los usamos</h2>
        <ul>
          <li>Para responder tu solicitud, enviarte disponibilidad, cotización y la información del venue, y gestionar la reserva si la haces.</li>
          <li>Para medir qué anuncios traen solicitudes reales y dejar de pagar los que no.</li>
        </ul>
        <p>No vendemos tus datos ni los usamos para nada ajeno a tu evento.</p>

        <h2 style={s.h2}>Con quién los compartimos</h2>
        <p>Solo con los servicios que usamos para operar el venue, cada uno con sus propias condiciones:</p>
        <ul>
          <li><b>Meta</b> (WhatsApp Business Platform, formularios de Facebook e Instagram, píxel de Meta y API de conversiones). Cuando le contamos a Meta que llegó una solicitud o se cerró una reserva, el correo y el teléfono viajan cifrados de forma irreversible (SHA-256), nunca en texto plano.</li>
          <li><b>Google</b> (Google Analytics, Google Tag Manager y Google Ads), con el mismo cifrado para medir reservas.</li>
          <li><b>Vercel</b> y <b>Neon</b>, que alojan el sitio y la base de datos donde guardamos las solicitudes.</li>
        </ul>

        <h2 style={s.h2}>Cookies</h2>
        <p>El sitio usa cookies de analítica y publicidad de Google y Meta para medir visitas y anuncios. Las de publicidad respetan tu consentimiento donde la ley lo exige. Puedes bloquearlas en tu navegador; los formularios siguen funcionando.</p>

        <h2 style={s.h2}>Cuánto tiempo los guardamos</h2>
        <p>Mientras los necesitemos para responder tu solicitud y gestionar la reserva que resulte de ella, y después solo lo que la ley nos obligue a conservar. Puedes pedirnos que los borremos en cualquier momento.</p>

        <h2 style={s.h2}>Tus derechos</h2>
        <p>Puedes pedirnos qué datos tenemos tuyos, corregirlos o borrarlos. Escribe a <a href={`mailto:${VENUE.email}`}>{VENUE.email}</a>.</p>

        <h2 style={s.h2} id="borrar-datos">Borrar tus datos</h2>
        <p>Para borrar todo lo que tenemos tuyo, incluidas las conversaciones de WhatsApp y los datos de formularios de Facebook o Instagram:</p>
        <ol>
          <li>Escribe a <a href={`mailto:${VENUE.email}?subject=Borrar%20mis%20datos`}>{VENUE.email}</a> con el asunto <b>«Borrar mis datos»</b>, desde el correo que usaste con nosotros, o manda la palabra <b>BORRAR</b> a nuestro WhatsApp desde el número que usaste.</li>
          <li>Borramos tus datos de nuestros sistemas en un plazo de 30 días y te lo confirmamos por el mismo medio.</li>
        </ol>
        <p>Los datos cifrados que ya se enviaron a Meta o Google para medir anuncios no podemos volver a asociarlos contigo; esas empresas los eliminan según sus propias políticas.</p>

        <p style={{ fontSize: 15, color: "var(--texto)", marginTop: 40 }}>La página de este sitio sobre residencia permanente es un servicio de Law Offices of Sandra Clavijo, una firma de abogados independiente, que trata los datos enviados desde esa página según su propia política.</p>
      </section>
    </main>
  );
}

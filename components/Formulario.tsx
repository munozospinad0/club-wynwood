"use client";

import { useEffect, useRef, useState } from "react";
import type { Idioma } from "@/lib/i18n";
import { bandaInvitados, ev, horizonteFecha } from "@/lib/medicion";

/**
 * El webhook de n8n al que va el formulario.
 *
 * OJO CON ESTA URL. La que había aquí antes —n8n.srv1043270.hstgr.cloud— NO
 * EXISTE: el host no resuelve por DNS. El workflow «Club Wynwood — Captura de
 * leads del sitio» (HMf412NsoC3LXJCP) vive en la instancia de n8n cloud, que es
 * la de abajo, y es la que el runtime del sitio estático ya usaba bien.
 *
 * Si alguna vez se migra la instancia, se cambia por variable de entorno y no
 * tocando esta línea: NEXT_PUBLIC_WEBHOOK_LEADS manda sobre esto.
 */
const WEBHOOK =
  process.env.NEXT_PUBLIC_WEBHOOK_LEADS ??
  "https://munozospinad0.app.n8n.cloud/webhook/club-wynwood-lead";

/**
 * El CRM, que es quien sabe cualificar.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * POR QUÉ EL SITIO YA NO CALCULA LA CALIDAD
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Hasta el 30-ago-2026 esta función vivía aquí dentro, y también en el sitio
 * estático, y también en el CRM, y también en un archivo muerto del CRM. Cuatro
 * copias, dos versiones distintas: la misma solicitud salía EXPLORANDO por un
 * camino y NO ENCAJA por el otro. Y eso decide qué evento de conversión ve
 * Meta, o sea que decide hacia dónde optimiza la campaña.
 *
 * Ahora el modelo vive en un solo archivo del CRM y el sitio PREGUNTA.
 *
 * Si el CRM no contesta —está desplegando, o hay un corte— el envío sigue
 * adelante sin `calidad`. No se pierde nada: **el CRM recalcula siempre en
 * servidor** cuando el lead entra por n8n. Lo único que se pierde es el evento
 * de conversión más fino en el navegador, y perder eso es infinitamente mejor
 * que perder el lead.
 */
const CRM = process.env.NEXT_PUBLIC_CRM_URL ?? "https://crm-wynwood.vercel.app";

/**
 * Formulario de solicitud, contra el webhook de n8n.
 *
 * ATRIBUCIÓN — gclid/fbclid/utm se leen de la URL y se guardan en sessionStorage
 * al aterrizar. Una visita puede caer en /bodas desde un anuncio y rellenar el
 * formulario en la home; sin esto se perdería el origen de ese lead.
 */
type Estado = "idle" | "enviando" | "ok" | "error";

/** Lee una cookie por nombre. Devuelve "" si no está o si están bloqueadas. */
function cookie(nombre: string): string {
  try {
    const m = document.cookie.match(new RegExp("(?:^|; )" + nombre + "=([^;]*)"));
    return m ? decodeURIComponent(m[1]) : "";
  } catch {
    return "";
  }
}

/**
 * Prefijos telefónicos.
 *
 * No es adorno: sin el prefijo, un móvil de Colombia y uno de Estados Unidos
 * tienen los mismos diez dígitos, y el CRM tiene que ADIVINAR. Adivinaba
 * Estados Unidos, así que un número colombiano se convertía en un teléfono
 * estadounidense que no existe y el hash no casaba con nadie en Meta.
 *
 * Preguntarlo convierte una suposición en un dato. Y de paso da el país, que es
 * otra señal de coincidencia gratis.
 */
const PREFIJOS: Array<{ cc: string; iso: string; etiqueta: string }> = [
  { cc: "1", iso: "US", etiqueta: "Estados Unidos +1" },
  { cc: "57", iso: "CO", etiqueta: "Colombia +57" },
  { cc: "52", iso: "MX", etiqueta: "México +52" },
  { cc: "34", iso: "ES", etiqueta: "España +34" },
  { cc: "54", iso: "AR", etiqueta: "Argentina +54" },
  { cc: "55", iso: "BR", etiqueta: "Brasil +55" },
  { cc: "56", iso: "CL", etiqueta: "Chile +56" },
  { cc: "51", iso: "PE", etiqueta: "Perú +51" },
  { cc: "58", iso: "VE", etiqueta: "Venezuela +58" },
  { cc: "507", iso: "PA", etiqueta: "Panamá +507" },
  { cc: "593", iso: "EC", etiqueta: "Ecuador +593" },
];

const TIPOS = [
  { valor: "Activación de marca", es: "Activación de marca", en: "Brand activation" },
  { valor: "Corporativo", es: "Corporativo", en: "Corporate" },
  { valor: "Fiesta privada", es: "Fiesta privada", en: "Private party" },
  { valor: "Rodaje / producción", es: "Rodaje / producción", en: "Shoot / production" },
  { valor: "Otro", es: "Otro", en: "Other" },
];

interface Cualificacion {
  calidad: string;
  puntos: number;
  razones: string[];
  modelo: string;
}

async function pedirCualificacion(d: Record<string, string>): Promise<Cualificacion | null> {
  try {
    // Con tope de tiempo: si el CRM tarda, se manda igual. El visitante no
    // tiene por qué esperar a una herramienta interna.
    const corte = AbortSignal.timeout(3500);
    const r = await fetch(`${CRM}/api/cualificar`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        invitados: d.invitados ?? "",
        fecha: d.fecha ?? "",
        produccion: d.produccion ?? "",
        presupuesto: d.presupuesto ?? "",
      }),
      signal: corte,
    });
    if (!r.ok) return null;
    return (await r.json()) as Cualificacion;
  } catch {
    return null;
  }
}

export default function Formulario({ lang }: { lang: Idioma }) {
  const es = lang === "es";
  const [estado, setEstado] = useState<Estado>("idle");
  const empezado = useRef(false);

  useEffect(() => {
    try {
      const q = new URLSearchParams(location.search);
      const capt: Record<string, string> = {};
      ["gclid", "fbclid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]
        .forEach((k) => { const v = q.get(k); if (v) capt[k] = v; });
      const y = JSON.parse(sessionStorage.getItem("cw-attr") || "{}");
      Object.assign(y, capt);
      y.landing_page ??= location.pathname;
      y.referrer ??= document.referrer || "";
      sessionStorage.setItem("cw-attr", JSON.stringify(y));
    } catch { /* sessionStorage bloqueado: se envía sin atribución */ }
  }, []);

  /** Solo la primera vez: mide cuánta gente empieza y no termina. */
  function alEmpezar() {
    if (empezado.current) return;
    empezado.current = true;
    ev("form_start");
  }

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEstado("enviando");

    const fd = new FormData(e.currentTarget);
    const d = Object.fromEntries(fd.entries()) as Record<string, string>;

    // El teléfono se compone en E.164 aquí, con el prefijo que eligió la
    // persona. Al CRM le llega limpio: el apóstrofo que necesita Google Sheets
    // lo pone n8n, que es de quien es el problema.
    const cc = d.prefijo || "1";
    const digitos = (d.telefono || "").replace(/\D/g, "");
    const telefono = digitos ? `+${cc}${digitos}` : "";
    const pais = PREFIJOS.find((p) => p.cc === cc)?.iso ?? "";

    let attr = {};
    try { attr = JSON.parse(sessionStorage.getItem("cw-attr") || "{}"); } catch { /* vacío */ }

    /**
     * UN SOLO id PARA LOS DOS CAMINOS.
     *
     * Este mismo envío va a llegar a Meta dos veces: por el píxel del navegador
     * y por la API de Conversiones desde el CRM. Eso es deliberado —el servidor
     * casa mejor y sobrevive a los bloqueadores— pero solo funciona si Meta
     * puede reconocer que son EL MISMO hecho. Los reconoce por `event_id`.
     *
     * Si no coincidiera, Meta contaría dos conversiones por lead: el informe
     * saldría al doble y el coste por lead a la mitad del real.
     */
    const eventId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `cw-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    const cual = await pedirCualificacion({ ...d, telefono });

    const parametros = {
      lead_quality: cual?.calidad ?? "sin_dato",
      event_type: d.tipo || "sin_dato",
      guests_band: bandaInvitados(d.invitados),
      date_horizon: horizonteFecha(d.fecha),
      production: d.produccion || "sin_dato",
      budget_band: d.presupuesto || "sin_dato",
      event_id: eventId,
    };

    try {
      const r = await fetch(WEBHOOK, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...d, ...attr,
          telefono,
          pais,
          idioma: lang,
          // Lo que calculó el CRM. Se manda para poder DETECTAR LA DERIVA: el
          // CRM lo vuelve a calcular al guardar y compara. Si no coinciden, o
          // alguien tocó el formulario o hay dos modelos en la calle.
          calidad: cual?.calidad ?? "",
          razones: cual?.razones?.join(" · ") ?? "",
          modelo: cual?.modelo ?? "",
          enviado: new Date().toISOString(),

          // ── huella para la API de Conversiones ──────────────────────────
          // Estas cookies las pone el píxel de Meta y SOLO existen aquí, en el
          // navegador de la persona. El CRM no puede deducirlas: si no viajan
          // en el cuerpo, se pierden y la coincidencia baja mucho.
          // La IP no se puede leer desde el navegador — la añade n8n, que sí ve
          // la del visitante en la cabecera x-forwarded-for.
          event_id: eventId,
          fbp: cookie("_fbp"),
          fbc: cookie("_fbc"),
          user_agent: navigator.userAgent,
        }),
      });
      if (!r.ok) throw new Error(String(r.status));

      setEstado("ok");

      // Todo envío cuenta como generate_lead, pero SOLO el calificado es
      // conversión primaria. Contar todo entrena a las plataformas a traer
      // volumen, y volumen barato es lo que este venue no puede atender.
      ev("generate_lead", parametros);
      ev(cual?.calidad === "CALIFICADO" ? "lead_qualified" : "lead_unqualified", parametros);
    } catch {
      setEstado("error");
    }
  }

  const campo: React.CSSProperties = {
    width: "100%", padding: "12px 14px", border: "1px solid var(--regla)",
    background: "var(--papel)", font: "inherit", fontSize: 15, color: "var(--tinta-2)",
  };
  const etiqueta: React.CSSProperties = {
    display: "block", fontFamily: "var(--mono)", fontSize: 10,
    letterSpacing: ".2em", textTransform: "uppercase", color: "var(--texto)",
    paddingBottom: 8,
  };

  if (estado === "ok") {
    return (
      <p className="respuesta" role="status">
        {es
          ? "Recibido. Respondemos en 24 h hábiles con disponibilidad, condiciones y la ficha técnica completa."
          : "Received. We reply within 24 business hours with availability, terms and the full spec sheet."}
      </p>
    );
  }

  return (
    <form onSubmit={enviar} onFocusCapture={alEmpezar} style={{ display: "grid", gap: 18, maxWidth: 620 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18 }}>
        <div>
          <label style={etiqueta} htmlFor="nombre">{es ? "Nombre" : "Name"}</label>
          <input style={campo} id="nombre" name="nombre" required autoComplete="name" />
        </div>
        <div>
          <label style={etiqueta} htmlFor="empresa">{es ? "Empresa / productora" : "Company"}</label>
          <input style={campo} id="empresa" name="empresa" autoComplete="organization" />
        </div>
        <div>
          <label style={etiqueta} htmlFor="email">Email</label>
          <input style={campo} id="email" name="email" type="email" required autoComplete="email" />
        </div>

        <div>
          <label style={etiqueta} htmlFor="telefono">{es ? "Teléfono" : "Phone"}</label>
          <div style={{ display: "flex", gap: 8 }}>
            <select
              style={{ ...campo, width: "auto", flex: "0 0 auto" }}
              id="prefijo" name="prefijo" defaultValue="1"
              aria-label={es ? "Prefijo de país" : "Country code"}
            >
              {PREFIJOS.map((p) => (
                <option key={p.cc + p.iso} value={p.cc}>{p.etiqueta}</option>
              ))}
            </select>
            <input style={campo} id="telefono" name="telefono" type="tel" inputMode="tel" autoComplete="tel-national" />
          </div>
        </div>

        <div>
          <label style={etiqueta} htmlFor="ciudad">{es ? "Ciudad" : "City"}</label>
          <input style={campo} id="ciudad" name="ciudad" autoComplete="address-level2" />
        </div>

        <div>
          <label style={etiqueta} htmlFor="tipo">{es ? "Tipo de evento" : "Event type"}</label>
          <select style={campo} id="tipo" name="tipo" defaultValue="">
            <option value="">—</option>
            {TIPOS.map((t) => (
              <option key={t.valor} value={t.valor}>{es ? t.es : t.en}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={etiqueta} htmlFor="fecha">{es ? "Fecha estimada" : "Estimated date"}</label>
          <input style={campo} id="fecha" name="fecha" type="date" />
        </div>
        <div>
          <label style={etiqueta} htmlFor="invitados">{es ? "Invitados estimados" : "Estimated guests"}</label>
          <input style={campo} id="invitados" name="invitados" inputMode="numeric" />
        </div>
        <div>
          <label style={etiqueta} htmlFor="produccion">{es ? "Quién produce" : "Who produces it"}</label>
          <select style={campo} id="produccion" name="produccion" defaultValue="">
            <option value="">—</option>
            <option value="productora">{es ? "Trabajo con una productora" : "I work with a production company"}</option>
            <option value="equipo">{es ? "Lo produce mi equipo" : "My team produces it"}</option>
            <option value="sin-resolver">{es ? "Todavía no lo tengo resuelto" : "Not decided yet"}</option>
          </select>
        </div>
        <div>
          <label style={etiqueta} htmlFor="presupuesto">{es ? "Presupuesto (USD)" : "Budget (USD)"}</label>
          <select style={campo} id="presupuesto" name="presupuesto" defaultValue="">
            <option value="">—</option>
            <option value="alto">{es ? "Más de 15 000" : "Over 15,000"}</option>
            <option value="medio">6 000 – 15 000</option>
            <option value="bajo">{es ? "Menos de 6 000" : "Under 6,000"}</option>
            <option value="sin-definir">{es ? "Todavía por definir" : "Not defined yet"}</option>
          </select>
        </div>
      </div>

      <div>
        <label style={etiqueta} htmlFor="mensaje">{es ? "Qué necesitas del espacio" : "What you need from the space"}</label>
        <textarea style={{ ...campo, minHeight: 110, resize: "vertical" }} id="mensaje" name="mensaje" />
      </div>

      <button className="boton" type="submit" disabled={estado === "enviando"}>
        {estado === "enviando"
          ? (es ? "Enviando…" : "Sending…")
          : (es ? "Solicitar disponibilidad" : "Request availability")}
      </button>

      {estado === "error" && (
        <p role="alert" style={{ margin: 0, fontSize: 14, color: "var(--ocre)" }}>
          {es
            ? "No se pudo enviar. Escríbenos a info@clubwynwood.com o llama al (305) 970-7486."
            : "Could not send. Email info@clubwynwood.com or call (305) 970-7486."}
        </p>
      )}

      {/* Lo que la persona necesita saber justo antes de pulsar es qué recibe y
          a qué se compromete: nada. */}
      <p style={{ margin: 0, fontSize: 13, color: "var(--texto)" }}>
        {es
          ? "Te llega disponibilidad y presupuesto en 24 h hábiles. Sin visita previa y sin compromiso."
          : "You get availability and a quote within 24 business hours. No site visit and no commitment."}
      </p>
    </form>
  );
}

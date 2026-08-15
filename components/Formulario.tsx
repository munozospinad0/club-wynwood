"use client";

import { useEffect, useState } from "react";
import type { Idioma } from "@/lib/i18n";

const WEBHOOK =
  process.env.NEXT_PUBLIC_WEBHOOK_LEADS ??
  "https://n8n.srv1043270.hstgr.cloud/webhook/club-wynwood-lead";

/**
 * Formulario de solicitud, contra el mismo webhook de n8n que ya funciona.
 *
 * CUALIFICACIÓN POR 4 SEÑALES — invitados, horizonte de fecha, quién produce y
 * presupuesto. La puntuación NO bloquea a nadie: cualquiera puede enviar. Solo
 * decide qué evento de conversión se dispara, para que Meta y Google optimicen
 * hacia leads que se parecen a los que cierran y no hacia volumen.
 *
 * TRAMOS DE PRESUPUESTO — calibrados con precio real de mercado, no a ojo.
 * Los directorios publican $150-617/hora en Wynwood y el sector $800-6.000/día
 * para activaciones. Con eso, un día entero de un venue grande cae en el entorno
 * de 4.000-6.000: los tramos anteriores (>20.000 / 8.000-20.000 / <8.000) dejaban
 * el alto casi vacío y metían a casi todo el mundo en el bajo, así que la
 * puntuación no separaba nada.
 *
 * ATRIBUCIÓN — gclid/fbclid/utm se leen de la URL y se guardan en sessionStorage
 * al aterrizar. Una visita puede caer en /bodas desde un anuncio y rellenar el
 * formulario en la home; sin esto se perdería el origen de ese lead.
 */
type Estado = "idle" | "enviando" | "ok" | "error";

export default function Formulario({ lang }: { lang: Idioma }) {
  const es = lang === "es";
  const [estado, setEstado] = useState<Estado>("idle");

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

  function puntuar(d: Record<string, string>): { calidad: string; razones: string[] } {
    let p = 0;
    const razones: string[] = [];

    const inv = parseInt((d.invitados || "").replace(/\D/g, ""), 10);
    if (inv >= 150) { p += 2; razones.push(`invitados ${inv}`); }
    else if (inv >= 60) { p += 1; razones.push(`invitados ${inv}`); }

    if (d.fecha) {
      const dias = (new Date(d.fecha).getTime() - Date.now()) / 86400000;
      if (dias >= 21 && dias <= 300) { p += 2; razones.push("fecha con margen"); }
      else if (dias > 300) { p += 1; razones.push("fecha lejana"); }
      else if (dias >= 0) { razones.push("fecha muy próxima"); }
    }

    if (d.produccion === "productora") { p += 2; razones.push("tiene productora"); }
    else if (d.produccion === "equipo") { p += 1; razones.push("produce su equipo"); }

    if (d.presupuesto === "alto") { p += 2; razones.push("presupuesto alto"); }
    else if (d.presupuesto === "medio") { p += 1; razones.push("presupuesto medio"); }

    const calidad = p >= 5 ? "CALIFICADO" : p >= 2 ? "EXPLORANDO" : "NO ENCAJA";
    return { calidad, razones: [...razones, `(${p} pts)`] };
  }

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEstado("enviando");
    const fd = new FormData(e.currentTarget);
    const d = Object.fromEntries(fd.entries()) as Record<string, string>;
    const { calidad, razones } = puntuar(d);

    let attr = {};
    try { attr = JSON.parse(sessionStorage.getItem("cw-attr") || "{}"); } catch { /* vacío */ }

    try {
      const r = await fetch(WEBHOOK, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...d, ...attr,
          calidad, razones: razones.join(" · "),
          idioma: lang,
          // El + inicial se pierde si la hoja lo interpreta como número.
          telefono: d.telefono ? `'${d.telefono}` : "",
          enviado: new Date().toISOString(),
        }),
      });
      if (!r.ok) throw new Error(String(r.status));
      setEstado("ok");
      // Solo los CALIFICADO disparan el evento de conversión.
      if (calidad === "CALIFICADO" && typeof window !== "undefined") {
        (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({
          event: "lead_calificado", valor_lead: 1,
        });
      }
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
    <form onSubmit={enviar} style={{ display: "grid", gap: 18, maxWidth: 620 }}>
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
          <input style={campo} id="telefono" name="telefono" type="tel" autoComplete="tel" />
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

      <p style={{ margin: 0, fontSize: 13, color: "var(--texto)" }}>
        {es
          ? "Respondemos en 24 h hábiles. Los paquetes se arman contra el evento; no publicamos tarifas."
          : "We reply within 24 business hours. Packages are built against the event; we don't publish rates."}
      </p>
    </form>
  );
}

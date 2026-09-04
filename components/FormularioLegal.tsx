"use client";

import { useRef, useState } from "react";
import type { Idioma } from "@/lib/i18n";

/**
 * El formulario de la página de residencia permanente.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * A DÓNDE VA, Y POR QUÉ AHÍ
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Al MISMO CRM que las solicitudes del venue. Daniel: «que sea al CRM del Club
 * Wynwood para que no nos compliquemos». Una sola bandeja que mirar.
 *
 * Llama directo a `/api/solicitud`, igual que el formulario del venue, y no a
 * una ruta intermedia de este sitio: ese endpoint ya acepta este origen y trae
 * sus cuatro defensas —origen, campo trampa, tiempo de relleno y ritmo por IP—
 * además de la IP real de la persona. Un salto por el servidor las habría
 * empeorado todas.
 *
 * Lo que lo distingue es `consulta: "legal"`. Con esa marca el CRM lo guarda
 * con su propio origen, **no le cuenta nada a Meta** y lo deja fuera de
 * Informes: una consulta de inmigración no es un alquiler, y contarla como tal
 * ensucia las cifras del venue y le enseña a la campaña la señal equivocada.
 *
 * Pide poco a propósito. Quien consulta por una visa de inversión no va a
 * escribir su capital en un formulario público; lo que hace falta es poder
 * llamarla.
 */

const CRM = process.env.NEXT_PUBLIC_CRM_URL ?? "https://crm-wynwood.vercel.app";
const ENDPOINT = `${CRM}/api/solicitud`;

const PREFIJOS: Array<{ cc: string; iso: string; etiqueta: string }> = [
  { cc: "57", iso: "CO", etiqueta: "Colombia +57" },
  { cc: "1", iso: "US", etiqueta: "Estados Unidos +1" },
  { cc: "54", iso: "AR", etiqueta: "Argentina +54" },
  { cc: "51", iso: "PE", etiqueta: "Perú +51" },
  { cc: "593", iso: "EC", etiqueta: "Ecuador +593" },
  { cc: "58", iso: "VE", etiqueta: "Venezuela +58" },
  { cc: "52", iso: "MX", etiqueta: "México +52" },
  { cc: "56", iso: "CL", etiqueta: "Chile +56" },
  { cc: "34", iso: "ES", etiqueta: "España +34" },
  { cc: "507", iso: "PA", etiqueta: "Panamá +507" },
];

type Estado = "idle" | "enviando" | "ok" | "error";

function idUnico(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `cw-legal-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function FormularioLegal({ lang }: { lang: Idioma }) {
  const es = lang === "es";
  const [estado, setEstado] = useState<Estado>("idle");
  const pintado = useRef(Date.now());

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEstado("enviando");

    const fd = new FormData(e.currentTarget);
    const d = Object.fromEntries(fd.entries()) as Record<string, string>;

    const cc = d.prefijo || "57";
    const digitos = (d.telefono || "").replace(/\D/g, "");
    const pais = PREFIJOS.find((p) => p.cc === cc)?.iso ?? "";

    let attr = {};
    try { attr = JSON.parse(sessionStorage.getItem("cw-attr") || "{}"); } catch { /* vacío */ }

    try {
      const r = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...attr,
          // El contrato del CRM llama `email` al correo y `tipo` al tipo de
          // evento. Se manda con sus nombres, no con los de este formulario.
          email: d.correo,
          nombre: d.nombre,
          telefono: digitos ? `+${cc}${digitos}` : "",
          ciudad: d.ciudad,
          pais,
          mensaje: d.mensaje,
          tipo: es ? "Consulta legal · EB-5" : "Legal enquiry · EB-5",
          consulta: "legal",
          idioma: lang,
          enviado: new Date().toISOString(),
          idempotencyKey: idUnico(),
          tardo: Date.now() - pintado.current,
          trampa: d.trampa,
        }),
      });
      setEstado(r.ok ? "ok" : "error");
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
          ? "Recibido. Tu consulta pasa a Law Offices of Sandra Clavijo y la firma se comunica contigo. Enviar este formulario todavía no crea una relación abogado-cliente."
          : "Received. Your enquiry goes to Law Offices of Sandra Clavijo and the firm will get back to you. Sending this form does not yet create an attorney-client relationship."}
      </p>
    );
  }

  return (
    <form onSubmit={enviar} style={{ display: "grid", gap: 18, maxWidth: 620 }}>
      {/* La trampa: fuera de pantalla, fuera del teclado y fuera del lector. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: 0, width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="cw-legal-web">No rellenar</label>
        <input id="cw-legal-web" name="trampa" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18 }}>
        <div>
          <label style={etiqueta} htmlFor="l-nombre">{es ? "Nombre" : "Name"}</label>
          <input style={campo} id="l-nombre" name="nombre" required autoComplete="name" />
        </div>
        <div>
          <label style={etiqueta} htmlFor="l-correo">{es ? "Correo" : "Email"}</label>
          <input style={campo} id="l-correo" name="correo" type="email" required autoComplete="email" />
        </div>
        <div>
          <label style={etiqueta} htmlFor="l-telefono">{es ? "Teléfono" : "Phone"}</label>
          <div style={{ display: "flex", gap: 8 }}>
            <select
              style={{ ...campo, width: "auto", flex: "0 0 auto" }}
              id="l-prefijo" name="prefijo" defaultValue="57"
              aria-label={es ? "Prefijo de país" : "Country code"}
            >
              {PREFIJOS.map((p) => (
                <option key={p.cc + p.iso} value={p.cc}>{p.etiqueta}</option>
              ))}
            </select>
            <input style={campo} id="l-telefono" name="telefono" type="tel" inputMode="tel" autoComplete="tel-national" />
          </div>
        </div>
        <div>
          <label style={etiqueta} htmlFor="l-ciudad">{es ? "Ciudad" : "City"}</label>
          <input style={campo} id="l-ciudad" name="ciudad" autoComplete="address-level2" />
        </div>
      </div>

      <div>
        <label style={etiqueta} htmlFor="l-mensaje">
          {es ? "Cuéntanos tu situación" : "Tell us about your situation"}
        </label>
        <textarea style={{ ...campo, minHeight: 110, resize: "vertical" }} id="l-mensaje" name="mensaje" />
      </div>

      <button className="boton" type="submit" disabled={estado === "enviando"} style={{ alignSelf: "flex-start" }}>
        {estado === "enviando"
          ? (es ? "Enviando…" : "Sending…")
          : (es ? "Enviar la consulta" : "Send the enquiry")}
      </button>

      {estado === "error" && (
        <p role="alert" style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--ocre)" }}>
          {es
            ? "No se pudo enviar. Escribe directamente a "
            : "It could not be sent. Write directly to "}
          <a href="https://sclavijo.com" target="_blank" rel="noopener noreferrer">sclavijo.com</a>.
        </p>
      )}

      <p style={{ margin: 0, fontSize: 13, color: "var(--texto)", maxWidth: "62ch", lineHeight: 1.6 }}>
        {es
          ? "Tu consulta la recibe el equipo de Club Wynwood y la traslada a Law Offices of Sandra Clavijo. No se usa para nada del alquiler del espacio."
          : "Your enquiry is received by the Club Wynwood team and passed on to Law Offices of Sandra Clavijo. It is not used for anything related to renting the space."}
      </p>
    </form>
  );
}

import { NextResponse } from "next/server";

/**
 * LA PUERTA DE LOS LEADS LEGALES. De aquí van al CRM de Sandra Clavijo, no al
 * de Club Wynwood.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * POR QUÉ PASA POR EL SERVIDOR Y NO LLAMA DIRECTO DESDE EL NAVEGADOR
 * ─────────────────────────────────────────────────────────────────────────
 *
 * El webhook de la firma acepta CORS solo desde sus propios dominios
 * (sclavijo.com y sandraclavijovisas.com). Un `fetch` desde clubwynwood.com se
 * quedaría en el preflight. Se puede resolver de dos maneras: añadir este
 * dominio a la lista blanca de ELLA, o llamar desde aquí. Se llama desde aquí
 * a propósito: **son dos proyectos separados** y esta conexión no tiene que
 * obligar a desplegar el CRM de la firma. Si mañana se corta, se corta en un
 * archivo de este repositorio y no en el suyo.
 *
 * Lo que se manda es exactamente lo que su webhook ya entiende (ver
 * `crm-ficha-lead/src/app/api/webhooks/website-form/route.ts`):
 * `tipoVisa: "EB-5"` cae en su enum EB5, y `source` sale escrito en las notas
 * del lead como «Origen: …», que es como su equipo va a saber que esta persona
 * llegó por el sitio del venue y no por el de la firma.
 *
 * NO se manda nada de Meta (fbp/fbc/eventId): el sitio del venue todavía no
 * tiene píxel, y mandar campos vacíos solo ensucia. Cuando lo tenga, se añaden.
 */

const CRM_SANDRA = "https://crmsandra.vercel.app/api/webhooks/website-form";

interface Cuerpo {
  nombre?: string;
  correo?: string;
  telefono?: string;
  ciudad?: string;
  pais?: string;
  mensaje?: string;
  idioma?: string;
  trampa?: string;
  tardo?: number;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  gclid?: string;
}

export async function POST(peticion: Request) {
  let d: Cuerpo;
  try {
    d = (await peticion.json()) as Cuerpo;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Las mismas tres defensas del formulario del venue. Se responde 200 en los
  // tres casos: quien manda esto no es una persona a la que haya que explicarle
  // nada, y un 400 le confirma qué le falta para que funcione.
  if (d.trampa) return NextResponse.json({ ok: true });
  if (typeof d.tardo === "number" && d.tardo < 3000) return NextResponse.json({ ok: true });

  const nombre = (d.nombre ?? "").trim();
  const correo = (d.correo ?? "").trim();
  const telefono = (d.telefono ?? "").trim();
  // Un lead con el que no se puede hablar no es un lead. Su CRM ya lo comprueba,
  // pero comprobarlo aquí evita el viaje.
  if (!nombre || (!correo && !telefono)) return NextResponse.json({ ok: true });

  const payload = {
    nombre,
    correo: correo || undefined,
    telefono: telefono || undefined,
    ciudad: (d.ciudad ?? "").trim() || undefined,
    pais: (d.pais ?? "").trim() || undefined,
    descripcion: (d.mensaje ?? "").trim() || undefined,
    idioma: d.idioma === "en" ? "en" : "es",
    tipoVisa: "EB-5",
    source: "clubwynwood-residencia",
    fuente: d.utm_source || "clubwynwood",
    medio: d.utm_medium || "sitio",
    campana: d.utm_campaign || undefined,
    gclid: d.gclid || undefined,
    fechaEnvio: new Date().toISOString(),
  };

  try {
    const r = await fetch(CRM_SANDRA, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      // Si su CRM tarda, no se deja al visitante colgado: se corta y se le
      // ofrece el correo de la firma, que siempre funciona.
      signal: AbortSignal.timeout(12_000),
    });
    if (!r.ok) {
      console.error("[consulta-legal] el CRM de la firma respondió", r.status);
      return NextResponse.json({ ok: false }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[consulta-legal] no se pudo entregar el lead:", e);
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}

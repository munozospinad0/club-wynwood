"use client";

import { useEffect, useRef, useState } from "react";
import type { Idioma } from "@/lib/i18n";
import { bandaInvitados, ev, horizonteFecha } from "@/lib/medicion";
import { encolar, vaciarCola } from "@/lib/cola";
import { paraElLead } from "@/lib/atribucion";

/**
 * EL FORMULARIO. Va DIRECTO al CRM: ya no pasa por n8n.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * POR QUÉ SE QUITÓ EL INTERMEDIARIO
 * ─────────────────────────────────────────────────────────────────────────
 *
 * n8n compraba tres cosas:
 *
 *  · LA IP DEL VISITANTE. Era el argumento más fuerte para tenerlo, y resulta
 *    que es el argumento más fuerte para quitarlo: con un servidor en medio, el
 *    CRM veía la IP DE n8n en todos los leads —el mismo valor para todo el
 *    mundo, así que Meta no podía casar a nadie— y había que reenviarla a mano
 *    en un nodo de código. Llamando directo, la IP correcta llega sola.
 *
 *  · EL REINTENTO. Se repone aquí: tres intentos inmediatos y, si aun así no
 *    entra, el envío queda en una cola local que se vacía la próxima vez que
 *    esta persona abra el sitio. Ver `lib/cola.ts`.
 *
 *  · LA COPIA A GOOGLE SHEETS. Se repone en el CRM, y mejor: manda el lead por
 *    correo **aunque no haya podido guardarlo**. Un correo sobrevive a que se
 *    caiga la base de datos.
 *
 * Y se va con él una clase entera de fallos silenciosos: en n8n Cloud las
 * variables de entorno están bloqueadas dentro de los nodos de código, así que
 * el nodo que firmaba devolvía vacío y la rama del CRM no corría nunca. Sin
 * error, sin aviso, todo aparentemente bien.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * LA CUALIFICACIÓN NO SE CALCULA AQUÍ
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Llegó a estar escrita cuatro veces con dos versiones distintas: la misma
 * solicitud salía EXPLORANDO por un camino y NO ENCAJA por el otro, y eso
 * decide qué evento de conversión ve Meta. Ahora vive en un solo archivo del
 * CRM, y la respuesta del envío trae la calidad ya calculada.
 *
 * ATRIBUCIÓN — gclid/fbclid/utm se leen de la URL al aterrizar y se guardan en
 * sessionStorage. Una visita puede caer en /bodas desde un anuncio y rellenar
 * el formulario en la home; sin esto se perdería el origen de ese lead.
 */

const CRM = process.env.NEXT_PUBLIC_CRM_URL ?? "https://crm-wynwood.vercel.app";
const ENDPOINT = `${CRM}/api/solicitud`;

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

function idUnico(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `cw-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Prefijos telefónicos.
 *
 * No es adorno: sin el prefijo, un móvil de Colombia y uno de Estados Unidos
 * tienen los mismos diez dígitos y el CRM tiene que ADIVINAR. Adivinaba Estados
 * Unidos, así que un número colombiano se convertía en un teléfono
 * estadounidense inexistente y el hash no casaba con nadie en Meta.
 *
 * Preguntarlo convierte una suposición en un dato, y de paso da el país, que es
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

interface Respuesta {
  ok?: boolean;
  /**
   * EL CAMPO QUE DECIDE SI ESTO SE GUARDÓ DE VERDAD.
   *
   * El CRM contesta 200 también cuando descarta un envío, y lo hace a propósito:
   * decirle a un robot cuál de las cuatro capas lo cazó es enseñarle a saltarla.
   * Pero **solo la respuesta de una solicitud guardada trae `id`**.
   *
   * Sin mirar este campo, el sitio celebraba los descartes: pintaba «Recibido» y
   * disparaba `generate_lead` sin que existiera nada en el CRM. Da igual con un
   * robot; el problema es que la primera capa que descarta es el ORIGEN, y esa
   * no se rompe por ataque sino por despliegue. Un dominio nuevo sin añadir a la
   * lista y todos los leads se pierden uno a uno, con el formulario diciendo que
   * llegaron.
   */
  id?: string;
  calidad?: string | null;
  degradado?: boolean;
}

/** Tres intentos con espera creciente. Un 4xx no se reintenta: no mejora. */
async function entregar(cuerpo: Record<string, unknown>): Promise<Respuesta | null> {
  for (let intento = 1; intento <= 3; intento++) {
    try {
      const r = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(cuerpo),
      });
      if (r.ok) return (await r.json().catch(() => ({}))) as Respuesta;
      if (r.status >= 400 && r.status < 500) return null;
    } catch { /* corte de red: se reintenta */ }

    if (intento < 3) await new Promise((r) => setTimeout(r, 400 * 2 ** (intento - 1)));
  }
  return null;
}

/**
 * IDENTIFICADORES CON PREFIJO, porque la home monta DOS formularios.
 *
 * Uno vive al final del recorrido guiado y otro en el cierre de la página. Con
 * identificadores literales los trece campos se repetían, y un identificador
 * duplicado no da error: el navegador se queda con el primero. Consecuencia
 * concreta: pulsar «Nombre» en el formulario de abajo enfocaba el campo del
 * formulario de arriba, que además está fuera de la vista. La persona ve que su
 * clic no hace nada.
 *
 * También rompe el lector de pantalla, que anuncia la etiqueta de un campo que
 * no es el que va a rellenar.
 */
export default function Formulario({ lang, idPrefijo, invitadosInicial }: { lang: Idioma; idPrefijo?: string; invitadosInicial?: number }) {
  const es = lang === "es";
  const ide = (n: string) => (idPrefijo ? `${idPrefijo}-${n}` : n);
  const [estado, setEstado] = useState<Estado>("idle");
  const empezado = useRef(false);
  const pintado = useRef(Date.now());
  const invitadosRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // La captura de atribución ya NO vive aquí: la hace <Atribucion /> desde el
    // layout, para que también corra en las páginas que no montan formulario.
    // Tenerla aquí dejaba /residencia/ y /preguntas-frecuentes/ sin cookie.
    //
    // Si quedó algo sin entregar de una visita anterior, este es el momento.
    void vaciarCola(ENDPOINT);
  }, []);

  /**
   * EL NÚMERO DE INVITADOS LLEGA YA PUESTO si la persona lo escribió antes en
   * «Tu evento, en el dibujo» (components/Recorrido.tsx). Es el dato que más
   * pesa en la cualificación y el que ya nos dio: pedírselo dos veces es
   * hacerle repetir, y cada campo que hay que rellenar pierde gente.
   *
   * Llega por dos caminos: la prop, para el formulario que vive dentro del
   * recorrido, y un evento del navegador más sessionStorage, para el del cierre
   * de la página, que ya estaba montado cuando la persona escribió el número.
   * Solo se rellena si el campo sigue vacío: lo que la persona escribió a mano
   * manda.
   */
  useEffect(() => {
    const el = invitadosRef.current;
    if (!el) return;
    const poner = (n: unknown) => {
      const v = Number(n);
      if (Number.isFinite(v) && v > 0 && !el.value) el.value = String(v);
    };
    if (invitadosInicial) poner(invitadosInicial);
    else { try { poner(sessionStorage.getItem("cw-invitados")); } catch { /* bloqueado */ } }
    const oir = (e: Event) => poner((e as CustomEvent).detail);
    window.addEventListener("cw-invitados", oir);
    return () => window.removeEventListener("cw-invitados", oir);
  }, [invitadosInicial]);

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

    // El teléfono se compone en E.164 con el prefijo que eligió la persona.
    const cc = d.prefijo || "1";
    const digitos = (d.telefono || "").replace(/\D/g, "");
    const telefono = digitos ? `+${cc}${digitos}` : "";
    const pais = PREFIJOS.find((p) => p.cc === cc)?.iso ?? "";

    const attr = paraElLead();

    /**
     * UN SOLO id PARA LOS DOS CAMINOS.
     *
     * Este envío va a llegar a Meta dos veces: por el píxel del navegador y por
     * la API de Conversiones desde el CRM. Es deliberado —el servidor casa
     * mejor y sobrevive a los bloqueadores— pero solo funciona si Meta reconoce
     * que son EL MISMO hecho, y lo reconoce por `event_id`. Si no coincidiera,
     * contaría dos conversiones por lead: el informe al doble y el coste por
     * lead a la mitad del real.
     */
    const eventId = idUnico();

    const cuerpo: Record<string, unknown> = {
      ...d, ...attr,
      telefono,
      pais,
      idioma: lang,
      enviado: new Date().toISOString(),

      // La clave de deduplicación se genera AQUÍ y se repite en cada reintento
      // y en la cola. Es lo que hace que insistir no cree solicitudes dobles.
      idempotencyKey: idUnico(),

      // Cuánto tardó en rellenarlo. Nadie rellena diez campos en tres segundos.
      tardo: Date.now() - pintado.current,

      // ── huella para la API de Conversiones ────────────────────────────────
      // Estas cookies las pone el píxel de Meta y SOLO existen aquí, en el
      // navegador de la persona. El CRM no puede deducirlas.
      // La IP ya no se manda: la lee el CRM de la cabecera, que es de donde hay
      // que leerla. Si se aceptara del cuerpo, cualquiera podría decir que es
      // otro y saltarse el límite por IP.
      event_id: eventId,
      fbp: cookie("_fbp"),
      fbc: cookie("_fbc"),
      user_agent: navigator.userAgent,
    };

    const r = await entregar(cuerpo);

    const parametros = {
      lead_quality: r?.calidad ?? "sin_dato",
      event_type: d.tipo || "sin_dato",
      guests_band: bandaInvitados(d.invitados),
      date_horizon: horizonteFecha(d.fecha),
      production: d.produccion || "sin_dato",
      budget_band: d.presupuesto || "sin_dato",
      event_id: eventId,
    };

    // `r.id` y no solo `r`: una respuesta sin identificador significa que el CRM
    // descartó el envío, y celebrarlo sería mentirle a la persona y contarle a
    // GA4 un lead que no existe. Ver el comentario de `Respuesta.id`.
    if (r?.id) {
      setEstado("ok");
      // Todo envío cuenta como generate_lead, pero SOLO el calificado es
      // conversión primaria. Contar todo entrena a las plataformas a traer
      // volumen, y volumen barato es lo que este venue no puede atender.
      ev("generate_lead", parametros);
      ev(r.calidad === "CALIFICADO" ? "lead_qualified" : "lead_unqualified", parametros);
      return;
    }

    // No entró. Queda en la cola por si esta persona vuelve, y se le dice la
    // verdad con una alternativa que sí funciona ahora mismo.
    encolar(cuerpo);
    setEstado("error");
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
      {/* LA TRAMPA. Invisible para una persona, irresistible para un robot que
          rellena todo lo que encuentra. No lleva `display:none` —algunos robots
          ya lo detectan— sino posición fuera de pantalla, y queda excluida de
          la navegación por teclado y de los lectores de pantalla. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: 0, width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor={ide("cw-web")}>No rellenar</label>
        <input id={ide("cw-web")} name="trampa" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18 }}>
        <div>
          <label style={etiqueta} htmlFor={ide("nombre")}>{es ? "Nombre" : "Name"}</label>
          <input style={campo} id={ide("nombre")} name="nombre" required autoComplete="name" />
        </div>
        <div>
          <label style={etiqueta} htmlFor={ide("empresa")}>{es ? "Empresa / productora" : "Company"}</label>
          <input style={campo} id={ide("empresa")} name="empresa" autoComplete="organization" />
        </div>
        <div>
          <label style={etiqueta} htmlFor={ide("email")}>Email</label>
          <input style={campo} id={ide("email")} name="email" type="email" required autoComplete="email" />
        </div>

        <div>
          <label style={etiqueta} htmlFor={ide("telefono")}>{es ? "Teléfono" : "Phone"}</label>
          <div style={{ display: "flex", gap: 8 }}>
            <select
              style={{ ...campo, width: "auto", flex: "0 0 auto" }}
              id={ide("prefijo")} name="prefijo" defaultValue="1"
              aria-label={es ? "Prefijo de país" : "Country code"}
            >
              {PREFIJOS.map((p) => (
                <option key={p.cc + p.iso} value={p.cc}>{p.etiqueta}</option>
              ))}
            </select>
            <input style={campo} id={ide("telefono")} name="telefono" type="tel" inputMode="tel" autoComplete="tel-national" />
          </div>
        </div>

        <div>
          <label style={etiqueta} htmlFor={ide("ciudad")}>{es ? "Ciudad" : "City"}</label>
          <input style={campo} id={ide("ciudad")} name="ciudad" autoComplete="address-level2" />
        </div>

        <div>
          <label style={etiqueta} htmlFor={ide("tipo")}>{es ? "Tipo de evento" : "Event type"}</label>
          <select style={campo} id={ide("tipo")} name="tipo" defaultValue="">
            <option value="">—</option>
            {TIPOS.map((t) => (
              <option key={t.valor} value={t.valor}>{es ? t.es : t.en}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={etiqueta} htmlFor={ide("fecha")}>{es ? "Fecha estimada" : "Estimated date"}</label>
          <input style={campo} id={ide("fecha")} name="fecha" type="date" />
        </div>
        <div>
          <label style={etiqueta} htmlFor={ide("invitados")}>{es ? "Invitados estimados" : "Estimated guests"}</label>
          <input ref={invitadosRef} style={campo} id={ide("invitados")} name="invitados" inputMode="numeric" />
        </div>
        <div>
          <label style={etiqueta} htmlFor={ide("produccion")}>{es ? "Quién produce" : "Who produces it"}</label>
          <select style={campo} id={ide("produccion")} name="produccion" defaultValue="">
            <option value="">—</option>
            <option value="productora">{es ? "Trabajo con una productora" : "I work with a production company"}</option>
            <option value="equipo">{es ? "Lo produce mi equipo" : "My team produces it"}</option>
            <option value="sin-resolver">{es ? "Todavía no lo tengo resuelto" : "Not decided yet"}</option>
          </select>
        </div>
        <div>
          <label style={etiqueta} htmlFor={ide("presupuesto")}>{es ? "Presupuesto (USD)" : "Budget (USD)"}</label>
          <select style={campo} id={ide("presupuesto")} name="presupuesto" defaultValue="">
            <option value="">—</option>
            <option value="alto">{es ? "Más de 15 000" : "Over 15,000"}</option>
            <option value="medio">6 000 – 15 000</option>
            <option value="bajo">{es ? "Menos de 6 000" : "Under 6,000"}</option>
            <option value="sin-definir">{es ? "Todavía por definir" : "Not defined yet"}</option>
          </select>
        </div>
      </div>

      <div>
        <label style={etiqueta} htmlFor={ide("mensaje")}>{es ? "Qué necesitas del espacio" : "What you need from the space"}</label>
        <textarea style={{ ...campo, minHeight: 110, resize: "vertical" }} id={ide("mensaje")} name="mensaje" />
      </div>

      <button className="boton" type="submit" disabled={estado === "enviando"}>
        {estado === "enviando"
          ? (es ? "Enviando…" : "Sending…")
          : (es ? "Solicitar disponibilidad" : "Request availability")}
      </button>

      {estado === "error" && (
        <p role="alert" style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--ocre)" }}>
          {es
            ? "No se pudo enviar ahora mismo. Lo reintentamos solos, pero si prefieres no esperar: "
            : "It could not be sent right now. We keep retrying, but if you would rather not wait: "}
          {/* `contact_click` es micro-conversión: sirve para MIRAR, nunca para
              optimizar. Y aquí tiene un valor extra que no tiene en el pie de
              página: un clic en el correo desde ESTE punto significa que el
              envío falló y la persona siguió intentándolo por su cuenta. Es la
              medida de cuánto negocio salva —o pierde— el respaldo. */}
          <a href="mailto:info@clubwynwood.com"
             onClick={() => ev("contact_click", { method: "email", desde: "fallo_envio" })}>
            info@clubwynwood.com
          </a>
          {" · "}
          <a href="tel:+13059707486"
             onClick={() => ev("contact_click", { method: "telefono", desde: "fallo_envio" })}>
            (305) 970-7486
          </a>
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

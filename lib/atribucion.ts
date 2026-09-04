/**
 * DE DÓNDE VINO CADA PERSONA. La capa que hay que tener bien el día 0.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * EL FALLO QUE ESTO CORRIGE, Y POR QUÉ ERA GRAVE
 * ─────────────────────────────────────────────────────────────────────────
 *
 * La atribución se guardaba en `sessionStorage`. Una sesión de navegador **muere
 * al cerrar la pestaña**. El ciclo de este negocio no son minutos: alguien ve el
 * anuncio el lunes, comenta la boda con su pareja, y rellena el formulario el
 * jueves desde la misma máquina.
 *
 * Con `sessionStorage` ese lead llegaba **sin `gclid`**. Y sin `gclid` Google no
 * puede casar la conversión offline: el contrato firmado no se le atribuye nunca
 * a la campaña que lo trajo, así que la puja no aprende y el informe dice que
 * Google no vende. Es un fallo que no da ningún error y que sesga la única
 * decisión que importa: dónde poner el dinero.
 *
 * Ahora va en una **cookie de primera parte a 90 días**, que es la ventana de
 * atribución que usa Google. Lo que no se capture aquí no existe después: el CRM
 * no puede deducirlo, y Google no lo guarda por nosotros.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * PRIMER TOQUE Y ÚLTIMO TOQUE, LOS DOS
 * ─────────────────────────────────────────────────────────────────────────
 *
 * A las plataformas hay que darles el **último** toque: es el clic que se pagó.
 * Al negocio le sirve el **primero**: cómo nos conoció esta persona. Con dos a
 * cuatro leads calificados al mes no sobra ninguno de los dos, y el primero es
 * el que nadie guarda y luego nadie puede reconstruir.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * LOS TRES IDENTIFICADORES DE CLIC DE GOOGLE
 * ─────────────────────────────────────────────────────────────────────────
 *
 * `gclid` es el de siempre. `gbraid` y `wbraid` aparecen cuando el clic viene de
 * iOS con seguimiento limitado. Son excluyentes entre sí y **se suben por campos
 * distintos**. Capturar solo `gclid` deja fuera una parte del tráfico de iPhone,
 * que en un negocio de bodas en Miami no es residual.
 */

export type Toque = {
  /** utm_source, o el origen deducido del referente. */
  src: string;
  med: string;
  cmp: string;
  ter: string;
  con: string;
  /** El referente completo, tal cual. */
  ref: string;
  /** La página por la que entró. */
  land: string;
  /** Cuándo, en epoch ms. */
  ts: number;
};

export type Atribucion = {
  v: 1;
  first: Toque;
  last: Toque;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
  /** Cuántas visitas distintas antes de escribir. Mide cuánto se lo piensan. */
  visitas: number;
};

const COOKIE = "cw_attr";
const DIAS = 90;
/** Dos toques del mismo origen dentro de esta ventana son la misma visita. */
const VENTANA_MS = 30 * 60 * 1000;

// ── cookies ────────────────────────────────────────────────────────────────

export function cookie(nombre: string): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(new RegExp("(^|;\\s*)" + nombre + "=([^;]*)"));
  return m ? decodeURIComponent(m[2]) : "";
}

/**
 * El dominio en el que se escribe la cookie.
 *
 * Se sube un nivel para que la cookie sobreviva el salto entre `clubwynwood.com`
 * y `www.clubwynwood.com`: si se escribiera en el host exacto, entrar por `www` y
 * enviar el formulario desde el ápice perdería la atribución entera.
 *
 * Sirve para dominios de dos etiquetas, que es el caso. Con un `.co.uk` habría
 * que consultar la lista pública de sufijos; no aplica aquí y se prefiere no
 * arrastrar esa dependencia.
 */
function dominioCookie(): string {
  const h = location.hostname;
  if (h === "localhost" || /^[\d.]+$/.test(h)) return "";
  const partes = h.split(".");
  return partes.length > 2 ? "." + partes.slice(-2).join(".") : "." + h;
}

function escribir(valor: string) {
  const dom = dominioCookie();
  const seguro = location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    `${COOKIE}=${encodeURIComponent(valor)}; Max-Age=${DIAS * 86400}; Path=/` +
    (dom ? `; Domain=${dom}` : "") +
    `; SameSite=Lax${seguro}`;
}

// ── de dónde viene alguien que no trae utm ──────────────────────────────────

/**
 * Sin `utm` hay que deducirlo del referente, y hay que hacerlo bien: si todo lo
 * que no trae etiqueta cae en «directo», el informe dice que el 70% del negocio
 * llega solo. Eso no es un dato, es la ausencia de uno.
 */
function origenDelReferente(ref: string): { src: string; med: string } {
  if (!ref) return { src: "directo", med: "none" };

  let host = "";
  try { host = new URL(ref).hostname.replace(/^www\./, ""); } catch { return { src: "directo", med: "none" }; }

  if (host === location.hostname.replace(/^www\./, "")) return { src: "", med: "" }; // interno: no es un toque

  const buscadores = ["google.", "bing.", "duckduckgo.", "yahoo.", "ecosia.", "brave."];
  if (buscadores.some((b) => host.startsWith(b) || host.includes("." + b))) {
    return { src: host.split(".")[0], med: "organic" };
  }

  const sociales: Record<string, string> = {
    "instagram.com": "instagram", "l.instagram.com": "instagram",
    "facebook.com": "facebook", "l.facebook.com": "facebook", "m.facebook.com": "facebook",
    "t.co": "twitter", "x.com": "twitter",
    "linkedin.com": "linkedin", "lnkd.in": "linkedin",
    "pinterest.com": "pinterest", "tiktok.com": "tiktok",
    "youtube.com": "youtube", "wa.me": "whatsapp",
  };
  if (sociales[host]) return { src: sociales[host], med: "social" };

  return { src: host, med: "referral" };
}

// ── captura ────────────────────────────────────────────────────────────────

function leer(): Atribucion | null {
  try {
    const crudo = cookie(COOKIE);
    if (!crudo) return null;
    const a = JSON.parse(crudo) as Atribucion;
    return a && a.v === 1 && a.first && a.last ? a : null;
  } catch { return null; }
}

/**
 * Se llama una vez al montar. Idempotente: llamarla dos veces en la misma
 * visita no inventa un toque nuevo.
 */
export function capturar(): void {
  if (typeof window === "undefined") return;

  try {
    const q = new URLSearchParams(location.search);
    const p = (k: string) => q.get(k)?.slice(0, 500) ?? "";

    const gclid = p("gclid");
    const gbraid = p("gbraid");
    const wbraid = p("wbraid");
    const fbclid = p("fbclid");
    const hayClic = !!(gclid || gbraid || wbraid || fbclid);
    const hayUtm = !!(p("utm_source") || p("utm_medium") || p("utm_campaign"));

    const deducido = origenDelReferente(document.referrer);
    // Un referente interno con parámetros de campaña sigue siendo un toque real:
    // pasa al volver de una pasarela o de un acortador que rebota.
    const externo = deducido.med !== "";

    const previa = leer();

    /**
     * ¿Es un toque nuevo o la misma visita? Sin esta comprobación, cada recarga
     * de la página sobrescribe el último toque con «directo» y borra la campaña
     * que trajo a la persona. Es el error clásico y silencioso de la atribución
     * hecha a mano.
     */
    const nuevo =
      !previa ||
      hayClic || hayUtm || externo ||
      Date.now() - previa.last.ts > VENTANA_MS;

    if (!nuevo && previa) return;

    const toque: Toque = {
      src: p("utm_source") || deducido.src || (previa ? "directo" : "directo"),
      med: p("utm_medium") || deducido.med || "none",
      cmp: p("utm_campaign"),
      ter: p("utm_term"),
      con: p("utm_content"),
      ref: document.referrer.slice(0, 500),
      land: location.pathname + location.search.slice(0, 300),
      ts: Date.now(),
    };

    const a: Atribucion = previa
      ? { ...previa, last: toque, visitas: previa.visitas + 1 }
      : { v: 1, first: toque, last: toque, visitas: 1 };

    /**
     * Los identificadores de clic NO se borran cuando la persona vuelve por
     * directo. Google atribuye dentro de una ventana de 90 días: el clic pagado
     * del lunes sigue siendo el que trajo el contrato del jueves. Solo se
     * sustituyen si llega uno nuevo, que es un clic más reciente.
     */
    if (gclid) { a.gclid = gclid; delete a.gbraid; delete a.wbraid; }
    if (gbraid) { a.gbraid = gbraid; delete a.gclid; delete a.wbraid; }
    if (wbraid) { a.wbraid = wbraid; delete a.gclid; delete a.gbraid; }
    if (fbclid) a.fbclid = fbclid;

    escribir(JSON.stringify(a));
  } catch {
    /* Cookies bloqueadas. El formulario sigue funcionando, sin atribución. */
  }
}

// ── lectura para el envío ──────────────────────────────────────────────────

/**
 * El `gclid` que escribió el Conversion Linker de Google, en `_gcl_aw`.
 *
 * Es una segunda fuente y vale la pena: sobrevive a redirecciones que se comen
 * el parámetro de la URL, y a que la persona llegue por un enlace ya limpio.
 * Formato `GCL.<epoch>.<gclid>`.
 */
export function gclidDeGoogle(): string {
  const v = cookie("_gcl_aw");
  const partes = v.split(".");
  return partes.length >= 3 ? partes.slice(2).join(".") : "";
}

/**
 * El identificador de cliente de GA4, sacado de la cookie `_ga`.
 *
 * Se guarda con el lead **para poder mandar a GA4, meses después, el hecho de
 * que esta persona firmó**. El Measurement Protocol necesita este valor y solo
 * existe en el navegador: si no se guarda ahora, el contrato nunca se podrá unir
 * a la sesión que lo originó.
 *
 * Formato `GA1.1.1234567890.1699999999` → el identificador son los dos últimos.
 */
export function ga4ClientId(): string {
  const v = cookie("_ga");
  const partes = v.split(".");
  return partes.length >= 4 ? partes.slice(-2).join(".") : "";
}

/** Lo que viaja con el lead, con los nombres del contrato del CRM. */
export function paraElLead(): Record<string, string | number> {
  const a = leer();
  const salida: Record<string, string | number> = {};

  const ga = ga4ClientId();
  if (ga) salida.ga_client_id = ga;

  if (!a) {
    // Sin cookie todavía se puede rescatar el gclid del Conversion Linker.
    const g = gclidDeGoogle();
    if (g) salida.gclid = g;
    return salida;
  }

  salida.gclid = a.gclid || gclidDeGoogle() || "";
  if (a.gbraid) salida.gbraid = a.gbraid;
  if (a.wbraid) salida.wbraid = a.wbraid;
  if (a.fbclid) salida.fbclid = a.fbclid;
  if (!salida.gclid) delete salida.gclid;

  salida.utm_source = a.last.src;
  salida.utm_medium = a.last.med;
  if (a.last.cmp) salida.utm_campaign = a.last.cmp;
  if (a.last.ter) salida.utm_term = a.last.ter;
  if (a.last.con) salida.utm_content = a.last.con;
  salida.referrer = a.last.ref;
  salida.landing_page = a.first.land;

  // El primer toque, que es el que nadie guarda y luego nadie puede reconstruir.
  salida.primer_origen = a.first.src;
  salida.primer_medio = a.first.med;
  if (a.first.cmp) salida.primera_campana = a.first.cmp;
  salida.primer_toque = new Date(a.first.ts).toISOString();
  salida.visitas = a.visitas;

  return salida;
}

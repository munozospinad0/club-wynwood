/**
 * LOS EVENTOS DEL SITIO. Nombres canónicos, un solo sitio.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * QUÉ PASÓ AQUÍ, PARA QUE NO VUELVA A PASAR
 * ─────────────────────────────────────────────────────────────────────────
 *
 * El sitio estático tenía la medición completa: ocho eventos y el cargador de
 * GTM. Al reescribirlo a Next **esa capa no se portó**. Quedó un solo
 * `dataLayer.push` con el nombre cambiado (`lead_calificado` en vez de
 * `lead_qualified`), empujando a un `dataLayer` que nadie creaba porque tampoco
 * se cargaba el contenedor.
 *
 * O sea: el sitio nuevo no medía nada, y no daba ningún error. El `?.` del
 * `dataLayer` se lo tragaba en silencio.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * CÓMO ESTÁ MONTADO
 * ─────────────────────────────────────────────────────────────────────────
 *
 * El sitio empuja al `dataLayer` y no conoce ni GA4 ni el píxel: los dos se
 * montan DENTRO de GTM. Si mañana se cambia de herramienta, no se toca el
 * sitio. Y si `NEXT_PUBLIC_GTM_ID` no está puesta, no se carga nada — los
 * eventos se acumulan en el array y se disparan en cuanto el contenedor exista.
 *
 * Los nombres son los del contrato de `crm-wynwood/docs/04-MEDICION.md`. Nadie
 * inventa variantes locales: un evento con otro nombre no activa el disparador
 * de GTM y desaparece sin avisar.
 */

export type EventoSitio =
  | "view_plate"        // cambio de lámina técnica
  | "select_zone"       // selector de ámbito
  | "toggle_layer"      // capas del dibujo
  | "form_start"        // primer foco en el formulario
  | "generate_lead"     // todo envío
  | "lead_qualified"    // solo si califica — LA conversión primaria
  | "lead_unqualified"  // si no califica — sirve para EXCLUIR, no para optimizar
  | "contact_click";    // clic en teléfono, correo o mapa

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    /** La pone components/Medicion.tsx cuando carga GA4 sin contenedor. */
    __cwGa4Directo?: boolean;
    /** El `AW-XXXXXXXXX` de Google Ads, si está configurado. */
    __cwAds?: string;
  }
}

/**
 * EL PUENTE QUE FALTABA, Y QUE NO DA ERROR SI FALTA.
 *
 * `gtag.js` **no convierte en eventos lo que se empuja al `dataLayer`**. Eso lo
 * hace el contenedor de GTM, y solo él. Con GA4 montado directo, un
 * `dataLayer.push({event:'lead_qualified'})` se queda ahí dentro para siempre:
 * el array crece, nadie se queja, y GA4 no registra ni una conversión.
 *
 * Por eso, y solo cuando no hay contenedor, el evento se manda además por
 * `gtag('event', ...)`. La condición importa: si se mandara por los dos caminos
 * con el contenedor puesto, cada conversión se contaría dos veces y el coste por
 * lead saldría a la mitad del real.
 */
export function ev(evento: EventoSitio, parametros: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;

  // Se crea el array si no existe. Es lo que hace que un evento disparado antes
  // de que cargue GTM no se pierda: el contenedor procesa lo que ya hay dentro.
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: evento, ...parametros });

  if (window.__cwGa4Directo && typeof window.gtag === "function") {
    window.gtag("event", evento, parametros);
  }

  if (evento === "lead_qualified") conversionCalificada(parametros);
}

/**
 * LA CONVERSIÓN. Solo el lead calificado, y solo una vez por envío.
 *
 * Va dentro de `ev()` y no como llamada aparte en el formulario, a propósito: la
 * conversión que se olvida de disparar no da ningún error, y no se nota hasta
 * que alguien pregunta por qué la campaña no aprende. Atado al nombre del evento
 * no se puede olvidar.
 *
 * ── Google Ads ────────────────────────────────────────────────────────────
 * Se manda a la etiqueta de Ads con `send_to`, que es lo que la separa de GA4.
 * Sin la etiqueta `AW-` y su etiqueta de conversión configuradas no se manda
 * nada: mejor no medir que medir contra un destino inventado.
 *
 * ── Meta ──────────────────────────────────────────────────────────────────
 * El píxel manda `Lead` con **el mismo `event_id`** que el CRM usará al mandarlo
 * por la API de Conversiones. Ese identificador compartido es lo único que evita
 * que Meta cuente dos conversiones por lead, lo que dejaría el informe al doble
 * y el coste por lead a la mitad del real.
 */
function conversionCalificada(parametros: Record<string, unknown>): void {
  const destino = window.__cwAds;
  const etiqueta = process.env.NEXT_PUBLIC_ADS_LABEL_LEAD;
  if (destino && etiqueta && typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: `${destino}/${etiqueta}`,
      // Sin importe a propósito: un lead no es dinero. El dinero lo sube el CRM
      // cuando se firma el contrato, y ese sí lleva la cifra real.
      transaction_id: String(parametros.event_id ?? ""),
    });
  }

  if (typeof window.fbq === "function") {
    window.fbq(
      "track",
      "Lead",
      { content_category: String(parametros.event_type ?? "") },
      { eventID: String(parametros.event_id ?? "") }
    );
  }
}

/** Bandas, para no mandar a las plataformas el dato exacto de cada persona. */
export function bandaInvitados(v: string | number | null | undefined): string {
  const n = typeof v === "number" ? v : parseInt(String(v ?? "").replace(/\D/g, ""), 10);
  if (!Number.isFinite(n) || n <= 0) return "sin_dato";
  if (n < 80) return "menos_80";
  if (n < 150) return "80_149";
  if (n < 400) return "150_399";
  return "400_mas";
}

export function horizonteFecha(iso: string | null | undefined): string {
  if (!iso) return "sin_dato";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "sin_dato";
  const dias = (d.getTime() - Date.now()) / 86_400_000;
  if (dias < 0) return "pasada";
  if (dias <= 20) return "0_20d";
  if (dias <= 300) return "21_300d";
  return "mas_300d";
}

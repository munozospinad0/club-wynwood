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
  }
}

export function ev(evento: EventoSitio, parametros: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  // Se crea el array si no existe. Es lo que hace que un evento disparado antes
  // de que cargue GTM no se pierda: el contenedor procesa lo que ya hay dentro.
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: evento, ...parametros });
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

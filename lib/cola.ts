/**
 * LA COLA DE ENVÍOS. Lo que reemplaza al reintento que hacía n8n.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * QUÉ PROBLEMA RESUELVE
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Con n8n en medio, si el CRM estaba caído el lead quedaba en su cola y entraba
 * al volver. Enviando directo, un `fetch` que falla no tiene segunda
 * oportunidad: el visitante ya cerró la pestaña.
 *
 * Así que la segunda oportunidad se guarda aquí. Un envío que no pudo entregarse
 * queda en `localStorage` y se reintenta **la próxima vez que esa persona abra
 * el sitio**, con la misma clave de idempotencia, así que si el primero sí había
 * entrado no se duplica.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * LO QUE ESTO NO ES
 * ─────────────────────────────────────────────────────────────────────────
 *
 * No es una garantía. Si la persona no vuelve, el envío se pierde. Es peor que
 * una cola de servidor y es honesto decirlo — pero cubre el caso realista (un
 * corte de minutos mientras alguien rellena el formulario) y no el imaginario
 * (que el CRM esté caído días).
 *
 * La red de verdad está en el otro lado: el CRM manda una copia por correo
 * **incluso si no puede guardar**, así que el lead existe aunque la base de
 * datos falle. Esta cola solo cubre lo que ni siquiera llegó a llamar.
 */

const CLAVE = "cw-cola-envios";
const MAXIMO = 5;
const CADUCA_MS = 7 * 86_400_000;

export interface EnvioPendiente {
  /** El cuerpo tal cual, con su clave de idempotencia dentro. */
  cuerpo: Record<string, unknown>;
  creado: number;
}

function leer(): EnvioPendiente[] {
  try {
    const crudo = localStorage.getItem(CLAVE);
    if (!crudo) return [];
    const lista = JSON.parse(crudo) as EnvioPendiente[];
    if (!Array.isArray(lista)) return [];
    // Se descarta lo viejo al leer: un lead de hace dos semanas ya no interesa a
    // nadie, y reenviarlo con una fecha de evento pasada solo confunde.
    return lista.filter((e) => e && Date.now() - e.creado < CADUCA_MS);
  } catch {
    // localStorage puede estar bloqueado —modo privado, ajustes del navegador—.
    // No es un error: es que esta persona no tiene cola, y ya.
    return [];
  }
}

function escribir(lista: EnvioPendiente[]): void {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(lista.slice(-MAXIMO)));
  } catch { /* sin almacenamiento: se pierde la cola, no el envío en curso */ }
}

export function encolar(cuerpo: Record<string, unknown>): void {
  const lista = leer();
  // Si ya está el mismo envío —misma clave— no se duplica la entrada.
  const clave = cuerpo.idempotencyKey;
  if (clave && lista.some((e) => e.cuerpo.idempotencyKey === clave)) return;
  lista.push({ cuerpo, creado: Date.now() });
  escribir(lista);
}

/**
 * Intenta entregar lo que quedó pendiente.
 *
 * Un 4xx **saca el envío de la cola**: es un lead mal formado o rechazado, y
 * reintentarlo cada vez que alguien abra el sitio es un bucle que no termina.
 * Solo se conserva lo que falló por causas que pueden pasar —un 5xx, un corte—.
 */
export async function vaciarCola(url: string): Promise<void> {
  const lista = leer();
  if (lista.length === 0) return;

  const quedan: EnvioPendiente[] = [];

  for (const envio of lista) {
    try {
      const r = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(envio.cuerpo),
      });
      if (!r.ok && r.status >= 500) quedan.push(envio);
    } catch {
      quedan.push(envio);
    }
  }

  escribir(quedan);
}

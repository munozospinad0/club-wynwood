"use client";

import { useEffect } from "react";
import { capturar } from "@/lib/atribucion";

/**
 * CAPTURA LA ATRIBUCIÓN EN TODAS LAS PÁGINAS, NO SOLO DONDE HAY FORMULARIO.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * EL FALLO QUE ESTO CORRIGE, Y POR QUÉ ERA EL PEOR POSIBLE
 * ─────────────────────────────────────────────────────────────────────────
 *
 * `capturar()` se llamaba desde un `useEffect` de `Formulario.tsx`. Parecía
 * razonable —capturar donde se usa— y dejaba dos rutas sin cubrir: la de
 * preguntas frecuentes y la de residencia permanente, que no montan ese
 * componente.
 *
 * Lo grave no es que faltaran dos páginas. Es **cuáles**:
 *
 * - `/residencia/` **sí tiene formulario** y manda leads al mismo CRM. Llamaba a
 *   `paraElLead()` sobre una cookie que nunca se había escrito, así que un
 *   anuncio de Meta hacia esa página guardaba el lead **sin `fbclid`** y el
 *   informe lo clasificaba como tráfico directo.
 * - Quien aterriza en preguntas frecuentes desde un anuncio y luego pasa al
 *   inicio pierde el identificador de clic **para siempre**: al llegar al home
 *   `capturar()` ya corre, pero la URL ya no lleva el parámetro. Y como el
 *   referente es `google.com`, el clic pagado queda registrado como búsqueda
 *   orgánica, que es peor que no registrarlo: acredita a orgánico lo que pagó la
 *   campaña.
 *
 * Es exactamente el fallo que `lib/atribucion.ts` existe para corregir, ocurrido
 * un nivel más arriba.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * POR QUÉ VA EN EL LAYOUT Y NO EN CADA PÁGINA
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Porque una página nueva que se olvide de montarlo no daría ningún error: se
 * mediría igual, y solo perdería la atribución de quien entrara por ahí. En el
 * layout, cubrir una ruta nueva no requiere acordarse de nada.
 *
 * No pinta nada. Solo existe para que la captura ocurra.
 */
export default function Atribucion() {
  useEffect(() => {
    capturar();
  }, []);

  return null;
}

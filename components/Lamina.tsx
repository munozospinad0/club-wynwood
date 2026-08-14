"use client";

import { useEffect, useRef } from "react";
import { MARKUP, RUNTIME } from "./lamina/datos";

/**
 * Las 4 láminas isométricas, portadas del sitio estático.
 *
 * Ver cw-lam-comp.py para por qué va verbatim y no reescrita como estado de
 * React. Resumen: 62 KB con 182 líneas y 69 cotas; reescribirlo garantiza
 * perder detalle, y el markup entra igual en el HTML servido, que es lo único
 * que le importa a un rastreador.
 *
 * El runtime se inyecta con new Function y no con <script dangerouslySet...>:
 * React no ejecuta los <script> que inserta por innerHTML, así que un
 * dangerouslySetInnerHTML con el script dentro no correría nunca.
 */
export default function Lamina() {
  const cont = useRef<HTMLDivElement>(null);
  const arrancado = useRef(false);

  useEffect(() => {
    if (arrancado.current || !cont.current) return;
    arrancado.current = true;
    try {
      new Function(RUNTIME)();
    } catch (e) {
      // Si el runtime falla, la lámina se queda estática pero visible: el
      // markup ya está en el HTML. Nunca desaparece contenido.
      console.error("lamina: el runtime no arrancó", e);
    }
  }, []);

  return (
    <div
      ref={cont}
      dangerouslySetInnerHTML={{ __html: MARKUP }}
    />
  );
}

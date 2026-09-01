"use client";

import { useEffect, useRef } from "react";
import { MARKUP, RUNTIME } from "./lamina/datos";
import { ev, type EventoSitio } from "@/lib/medicion";

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

/* ────────────────────────────────────────────────────────────────────────────
 * MEDIR LO QUE PASA DENTRO DE UN RUNTIME QUE NO ES NUESTRO
 * ────────────────────────────────────────────────────────────────────────────
 *
 * Las láminas interiores —cambiar de lámina, elegir ámbito, encender capas— son
 * la señal de intención más honesta del sitio: quien abre la 02 está mirando la
 * sección para evaluar rigging, no leyendo un folleto. Con dos o cuatro leads
 * calificados al mes, es de los pocos números que se mueven lo suficiente.
 *
 * El problema es que esos controles viven dentro del runtime portado, que es
 * código generado (`components/lamina/datos.ts`, lo escribe `cw-lam-comp.py`) y
 * que se REGENERA. Cualquier `ev()` escrito ahí dentro se pierde en la próxima
 * regeneración, sin avisar. Es exactamente cómo se perdió la medición entera al
 * pasar el sitio a Next.
 *
 * Así que no se toca el generado: se envuelven sus manejadores desde fuera,
 * justo antes de ejecutarlo. Las once expresiones de abajo son literales y
 * únicas dentro del runtime, así que la sustitución es exacta.
 *
 * FALLA EN SEGURO, y esto es lo que importa: si el runtime se regenera y alguna
 * expresión ya no coincide, la sustitución simplemente no ocurre. Se pierde ese
 * evento —y el aviso de consola lo dice— pero el dibujo sigue funcionando. Un
 * error de medición nunca puede tumbar la lámina.
 */
interface VentanaConMedicion extends Window {
  __cwEnvolver?: (
    evento: EventoSitio,
    parametros: Record<string, unknown>,
    fn: unknown
  ) => unknown;
}

/** Manejador original -> evento y parámetros con los que se envuelve. */
const ENGANCHES: Array<[string, EventoSitio, Record<string, unknown>]> = [
  ["sh1:goSheet(1)", "view_plate", { plate: 1, plate_name: "implantacion" }],
  ["sh2:goSheet(2)", "view_plate", { plate: 2, plate_name: "seccion" }],
  ["sh3:goSheet(3)", "view_plate", { plate: 3, plate_name: "contexto" }],
  ["sh4:goSheet(4)", "view_plate", { plate: 4, plate_name: "planta" }],
  ['zAll: setZone("all")', "select_zone", { zone: "all" }],
  ['zJar: setZone("jardin")', "select_zone", { zone: "jardin" }],
  ['zTik: setZone("tiki")', "select_zone", { zone: "tiki" }],
  ['tRoof: tog("roof",true)', "toggle_layer", { layer: "roof" }],
  ['tVeg: tog("veg",true)', "toggle_layer", { layer: "veg" }],
  ['tPeople: tog("people",true)', "toggle_layer", { layer: "people" }],
  ['tAnn: tog("ann",true)', "toggle_layer", { layer: "ann" }],
];

function runtimeMedido(fuente: string): string {
  let salida = fuente;
  const perdidos: string[] = [];

  for (const [original, evento, parametros] of ENGANCHES) {
    if (!salida.includes(original)) {
      perdidos.push(original);
      continue;
    }
    // `clave:expresion` -> `clave:__cwEnvolver("evento",{...},expresion)`
    const corte = original.indexOf(":");
    const clave = original.slice(0, corte + 1);
    const expresion = original.slice(corte + 1).trim();
    salida = salida.replace(
      original,
      `${clave}window.__cwEnvolver(${JSON.stringify(evento)},${JSON.stringify(parametros)},${expresion})`
    );
  }

  if (perdidos.length && process.env.NODE_ENV !== "production") {
    console.warn(
      "lamina: el runtime cambió y estos controles dejaron de medirse:",
      perdidos.join(" · ")
    );
  }
  return salida;
}

export default function Lamina() {
  const cont = useRef<HTMLDivElement>(null);
  const arrancado = useRef(false);

  useEffect(() => {
    if (arrancado.current || !cont.current) return;
    arrancado.current = true;

    const w = window as VentanaConMedicion;
    // El envoltorio mide y después llama al original. En ese orden: si el
    // manejador original lanzara, el evento ya está contado — y al revés se
    // perdería justo la interacción que más interesa.
    w.__cwEnvolver = (evento, parametros, fn) => {
      if (typeof fn !== "function") return fn;
      return function (this: unknown, ...args: unknown[]) {
        try {
          ev(evento, parametros);
        } catch {
          /* medir nunca puede romper la lámina */
        }
        return (fn as (...a: unknown[]) => unknown).apply(this, args);
      };
    };

    try {
      new Function(runtimeMedido(RUNTIME))();
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

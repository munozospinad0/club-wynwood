/**
 * QA DE LA MEDICIÓN DEL SITIO.  ·  node herramientas/qa-medicion.mjs
 *
 * ─────────────────────────────────────────────────────────────────────────
 * QUÉ VIGILA, Y POR QUÉ ESTO EXISTE
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Al reescribir el sitio a Next se perdió la capa de medición entera, y no dio
 * ningún error: el `dataLayer.push` seguía ahí, con el nombre cambiado, contra
 * un array que nadie creaba. Semanas de tráfico sin rastro.
 *
 * Esta comprobación es la que hace que eso no se pueda repetir en silencio.
 * Corre sin dependencias —solo lee archivos— así que entra en cualquier sitio.
 *
 * Concretamente:
 *
 *  1. Los ONCE manejadores del runtime portado que `Lamina.tsx` envuelve para
 *     medir siguen escritos igual. `components/lamina/datos.ts` es código
 *     GENERADO por cw-lam-comp.py: si se regenera y una expresión cambia, la
 *     sustitución deja de aplicar y ese control deja de medirse sin avisar.
 *
 *  2. Los ocho eventos del contrato siguen declarados en `lib/medicion.ts` con
 *     el nombre exacto de `crm-wynwood/docs/04-MEDICION.md`. Un evento con otro
 *     nombre no activa su disparador de GTM y desaparece.
 *
 *  3. Ninguno de los eventos del contrato se quedó sin usar en el código.
 *     Declarado y nunca disparado es lo mismo que no existir.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Las once expresiones que Lamina.tsx envuelve. Tienen que coincidir con ENGANCHES. */
const ENGANCHES = [
  "sh1:goSheet(1)", "sh2:goSheet(2)", "sh3:goSheet(3)", "sh4:goSheet(4)",
  'zAll: setZone("all")', 'zJar: setZone("jardin")', 'zTik: setZone("tiki")',
  'tRoof: tog("roof",true)', 'tVeg: tog("veg",true)',
  'tPeople: tog("people",true)', 'tAnn: tog("ann",true)',
];

/** El contrato. Estos nombres los conoce GTM; no se inventan variantes. */
const EVENTOS = [
  "view_plate", "select_zone", "toggle_layer", "form_start",
  "generate_lead", "lead_qualified", "lead_unqualified", "contact_click",
];

let fallos = 0;
const ok = (m) => console.log("  ok    " + m);
const mal = (m) => { fallos++; console.log("  FALLO " + m); };

function fuentes(dir, acc = []) {
  for (const e of readdirSync(dir)) {
    if (e === "node_modules" || e === ".next" || e === ".git") continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) fuentes(p, acc);
    else if (/\.(ts|tsx)$/.test(e)) acc.push(p);
  }
  return acc;
}

console.log("\nLos manejadores de la lámina siguen donde Lamina.tsx los busca\n");
const datos = readFileSync(join(RAIZ, "components/lamina/datos.ts"), "utf8");
// datos.ts guarda el runtime como cadena JS: las comillas van escapadas.
const runtime = datos.replace(/\\"/g, '"');
for (const e of ENGANCHES) {
  if (runtime.includes(e)) ok(e);
  else mal(`${e} — ya no está: ese control dejó de medirse`);
}

console.log("\nLos ocho eventos del contrato están declarados\n");
const medicion = readFileSync(join(RAIZ, "lib/medicion.ts"), "utf8");
for (const ev of EVENTOS) {
  if (medicion.includes(`"${ev}"`)) ok(ev);
  else mal(`${ev} — no está declarado en lib/medicion.ts`);
}

console.log("\nY ninguno se quedó declarado sin usar\n");
const codigo = fuentes(RAIZ)
  .filter((p) => !p.endsWith("lib/medicion.ts"))
  .map((p) => readFileSync(p, "utf8"))
  .join("\n");
for (const ev of EVENTOS) {
  // Puede dispararse con ev("x") o quedar nombrado en la tabla de ENGANCHES.
  if (codigo.includes(`"${ev}"`)) ok(ev);
  else mal(`${ev} — declarado pero nunca disparado`);
}

console.log(
  fallos === 0
    ? "\nTodo correcto.\n"
    : `\n${fallos} ${fallos === 1 ? "problema" : "problemas"}. La medición tiene un agujero.\n`
);
process.exit(fallos === 0 ? 0 : 1);

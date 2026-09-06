/**
 * ¿EL AUDIO GRABADO CORRESPONDE AL GUION?  ·  node herramientas/auditar-recorrido.mjs
 *
 * ─────────────────────────────────────────────────────────────────────────
 * EL TERCER PASO, QUE ES EL QUE SIEMPRE SE OLVIDA
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Comprobar que el componente compila es el primero. Mirarlo renderizado es el
 * segundo. **El tercero es este**, y es el único que ve el fallo que de verdad
 * ocurre: que una frase del guion no esté dicha exactamente así en el audio.
 *
 * Cuando eso pasa no revienta nada. `tiempoDeFrase` no encuentra el ancla, cae
 * en la estimación por posición en el texto, y el dibujo cambia unos segundos
 * antes o después de lo que dice la voz. En pantalla se ve un recorrido que
 * funciona y va ligeramente descoordinado, que es peor que uno roto: nadie lo
 * reporta y nadie lo arregla.
 *
 * Se comprueban cuatro cosas por capítulo e idioma:
 *
 * 1. Que exista el audio y su alineamiento.
 * 2. Que lo que la voz DIJO sea lo que el guion dice. Si el guion se corrigió
 *    después de grabar, aquí se ve.
 * 3. Que cada hito sea una frase literal encontrable en el alineamiento, y en
 *    qué segundo cae.
 * 4. Que los hitos vayan en ORDEN y con aire entre ellos. Dos cambios de dibujo
 *    en el mismo segundo se leen como un parpadeo, no como dos ideas.
 */

import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const VERDE = "\x1b[32m", ROJO = "\x1b[31m", AMBAR = "\x1b[33m", GRIS = "\x1b[90m", FIN = "\x1b[0m";

let errores = 0, avisos = 0;

/** El MISMO normalizador que usa lib/recorrido.ts. Si divergen, esto no vale. */
const norm = (s) =>
  String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ñ]+/g, " ").trim();

/**
 * La MISMA búsqueda que hace `tiempoDeFrase` en `lib/recorrido.ts`.
 *
 * Si las dos divergen, este auditor deja de servir para lo único que existe:
 * decir si el sitio va a encontrar el hito. Está duplicada porque el auditor es
 * un script de Node suelto y el otro es TypeScript del paquete; al tocar una,
 * tocar la otra.
 */
function buscar(frase, palabras) {
  const objetivo = norm(frase);
  if (!objetivo || !palabras.length) return null;

  const inicios = [];
  let plano = "";
  for (const p of palabras) {
    const w = norm(p.w);
    if (!w) { inicios.push(plano.length); continue; }
    if (plano) plano += " ";
    inicios.push(plano.length);
    plano += w;
  }

  const donde = plano.indexOf(objetivo);
  if (donde < 0) return null;

  let i = 0;
  for (let k = 0; k < inicios.length; k++) if (inicios[k] <= donde) i = k; else break;
  return palabras[i].start;
}

const guion = JSON.parse(await readFile(join(RAIZ, "lib", "recorrido.guion.json"), "utf8"));

console.log(`\n${"═".repeat(70)}`);
console.log("  EL AUDIO CONTRA EL GUION");
console.log(`${"═".repeat(70)}`);

for (const lang of ["es", "en"]) {
  console.log(`\n${lang.toUpperCase()}\n${"─".repeat(70)}`);

  for (let i = 0; i < guion.capitulos.length; i++) {
    const c = guion.capitulos[i];
    const nn = String(i + 1).padStart(2, "0");
    const texto = c.texto[lang];
    const dir = join(RAIZ, "public", "audio", "recorrido", lang);
    const mp3 = join(dir, `${nn}.mp3`);
    const words = join(dir, `${nn}.words.json`);

    if (!existsSync(mp3) || !existsSync(words)) {
      errores++;
      console.log(`  ${ROJO}✗${FIN} ${nn} ${c.id} · falta ${!existsSync(mp3) ? "el audio" : "el alineamiento"}`);
      continue;
    }

    const palabras = JSON.parse(await readFile(words, "utf8"));
    const dicho = norm(palabras.map((p) => p.w).join(" "));
    const esperado = norm(texto);
    const dur = palabras.length ? palabras[palabras.length - 1].end : 0;

    // Un guion corregido después de grabar es el caso más fácil de pasar por
    // alto: el sitio se ve bien y la voz dice la versión vieja.
    if (dicho !== esperado) {
      errores++;
      console.log(`  ${ROJO}✗${FIN} ${nn} ${c.id} · la voz NO dice lo que dice el guion — hay que regrabar`);
      const a = dicho.split(" "), b = esperado.split(" ");
      const k = a.findIndex((w, j) => w !== b[j]);
      console.log(`      ${GRIS}difieren en la palabra ${k + 1}: dijo «${a.slice(k, k + 6).join(" ")}» · guion «${b.slice(k, k + 6).join(" ")}»${FIN}`);
      continue;
    }

    const ritmo = dur > 0 ? Math.round((palabras.length / dur) * 60) : 0;
    console.log(`  ${VERDE}✓${FIN} ${nn} ${c.id} · ${dur.toFixed(1)} s · ${palabras.length} palabras · ${ritmo} pal/min`);

    // Referencia de Loymark Academy: una voz aprobada va a 173-208 pal/min.
    if (ritmo && (ritmo < 150 || ritmo > 220)) {
      avisos++;
      console.log(`      ${AMBAR}·${FIN} ritmo fuera de 150-220 pal/min; escúchalo antes de darlo por bueno`);
    }

    const hitos = c.hitos?.[lang] ?? [];
    let anterior = -1;
    for (const h of hitos) {
      const t = buscar(h.frase, palabras);
      if (t === null) {
        errores++;
        console.log(`      ${ROJO}✗${FIN} hito «${h.frase}» NO está en el audio · el dibujo cambiará a ojo`);
        continue;
      }
      const que = [h.modo && `modo ${h.modo}`, h.zona !== undefined && `zona ${h.zona ?? "ninguna"}`, h.punto && "punto"]
        .filter(Boolean).join(" · ");
      console.log(`      ${GRIS}${t.toFixed(1).padStart(5)} s  ${que}  «${h.frase}»${FIN}`);

      if (t < anterior) {
        errores++;
        console.log(`      ${ROJO}✗${FIN} este hito ocurre ANTES que el anterior: el guion los tiene desordenados`);
      } else if (anterior >= 0 && t - anterior < 1.2) {
        avisos++;
        console.log(`      ${AMBAR}·${FIN} solo ${(t - anterior).toFixed(1)} s desde el hito anterior; se leerá como un parpadeo`);
      }
      anterior = t;
    }
  }
}

console.log(`\n${"═".repeat(70)}`);
if (errores === 0) console.log(`  ${VERDE}Sin errores.${FIN}${avisos ? ` ${avisos} aviso(s) para mirar a oído.` : ""}`);
else console.log(`  ${ROJO}${errores} error(es).${FIN}${avisos ? ` Y ${avisos} aviso(s).` : ""}`);
console.log(`${"═".repeat(70)}\n`);

process.exit(errores === 0 ? 0 : 1);

/**
 * COMPRUEBA LA CAPA DE CAPTURA CONTRA EL SITIO CORRIENDO.
 *
 *   npm run build && npx next start -p 3200
 *   node herramientas/verificar-captura.cjs http://localhost:3200
 *
 * ─────────────────────────────────────────────────────────────────────────
 * POR QUÉ ESTO NO PUEDE SER UNA PRUEBA UNITARIA
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Los dos fallos que comprueba solo existen en un navegador de verdad:
 *
 * 1. **El orden del consentimiento.** El estado por defecto tiene que quedar
 *    declarado ANTES de que cargue ninguna etiqueta. Si llega después, no aplica
 *    y no da ningún error. Solo se ve mirando las primeras entradas reales del
 *    `dataLayer` en el orden en que el navegador las ejecutó.
 *
 * 2. **Que la atribución sobreviva a cerrar la pestaña.** Es el fallo que
 *    corrigió `lib/atribucion.ts`: con `sessionStorage`, quien veía el anuncio el
 *    lunes y escribía el jueves llegaba sin `gclid`, y ese contrato no se le
 *    atribuía nunca a la campaña que lo trajo. Reproducirlo pide dos pestañas y
 *    un contexto de navegador compartido.
 *
 * Playwright sale de ~/crossworld/node_modules: no hay Chrome en WSL y no hace
 * falta duplicar la dependencia en este proyecto.
 */
const { chromium } = require("/home/daniel/crossworld/node_modules/playwright");
const BASE = process.argv[2] || "http://localhost:3200";

let fallos = 0;
function ok(nombre, bien, detalle) {
  if (bien) console.log(`  ok    ${nombre}`);
  else { fallos++; console.log(`  FALLO ${nombre}${detalle ? ` — ${detalle}` : ""}`); }
}

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext();
  const errores = [];

  // ── 1. Llega por un anuncio ──────────────────────────────────────────────
  const p1 = await ctx.newPage();
  p1.on("pageerror", (e) => errores.push(e.message));
  p1.on("console", (m) => { if (m.type() === "error") errores.push(m.text().slice(0, 200)); });

  await p1.goto(`${BASE}/es?gclid=PRUEBA_GCLID_123&utm_source=google&utm_medium=cpc&utm_campaign=bodas`, {
    waitUntil: "domcontentloaded", timeout: 60000,
  });
  await p1.waitForTimeout(1500);

  const orden = await p1.evaluate(() =>
    (window.dataLayer || []).slice(0, 4).map((e) =>
      e && e.length !== undefined ? String(e[0]) + ":" + String(e[1]) : JSON.stringify(e).slice(0, 60)
    )
  );
  console.log("\n  dataLayer, primeras entradas:", JSON.stringify(orden));
  ok(
    "el consentimiento se declara ANTES que nada",
    orden.length > 0 && orden[0].startsWith("consent:default"),
    `la primera entrada fue ${orden[0]}`
  );

  const attr1 = (await ctx.cookies()).find((c) => c.name === "cw_attr");
  ok("la cookie cw_attr existe", !!attr1);

  let datos = attr1 ? JSON.parse(decodeURIComponent(attr1.value)) : {};
  ok("guardó el gclid", datos.gclid === "PRUEBA_GCLID_123", JSON.stringify(datos.gclid));
  ok("guardó el primer toque", datos.first && datos.first.src === "google", JSON.stringify(datos.first));
  ok("la cookie dura 90 días", attr1 && attr1.expires > Date.now() / 1000 + 85 * 86400);
  await p1.close();

  // ── 2. Vuelve días después, sin parámetros y en otra pestaña ────────────
  // El caso exacto que sessionStorage perdía.
  const p2 = await ctx.newPage();
  await p2.goto(`${BASE}/es`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await p2.waitForTimeout(1200);

  const attr2 = (await ctx.cookies()).find((c) => c.name === "cw_attr");
  datos = attr2 ? JSON.parse(decodeURIComponent(attr2.value)) : {};
  ok("el gclid SIGUE ahí al volver por directo", datos.gclid === "PRUEBA_GCLID_123", JSON.stringify(datos.gclid));
  ok("el primer toque no se sobrescribió", datos.first && datos.first.src === "google", JSON.stringify(datos.first && datos.first.src));
  await p2.close();

  // ── 3. Los identificadores de iOS ───────────────────────────────────────
  const ctx2 = await b.newContext();
  const p3 = await ctx2.newPage();
  await p3.goto(`${BASE}/es?gbraid=IOS_ABC`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await p3.waitForTimeout(1200);
  const c3 = (await ctx2.cookies()).find((c) => c.name === "cw_attr");
  const d3 = c3 ? JSON.parse(decodeURIComponent(c3.value)) : {};
  ok("captura gbraid, el de iOS", d3.gbraid === "IOS_ABC", JSON.stringify(d3));
  await ctx2.close();

  /**
   * ── 4. Las rutas que NO montan el formulario del venue ───────────────────
   *
   * Aquí estaba el fallo. La captura colgaba del formulario, así que un anuncio
   * apuntando a residencia o a preguntas frecuentes no dejaba cookie: el lead
   * entraba sin identificador de clic y el informe lo daba por tráfico directo.
   * Peor en el caso de Google, donde el referente hace que un clic pagado quede
   * registrado como búsqueda orgánica.
   */
  for (const [nombre, ruta, parametro, valor] of [
    ["residencia permanente", "/es/residencia-permanente", "fbclid", "FB_RESID_1"],
    ["preguntas frecuentes", "/es/preguntas-frecuentes", "gclid", "GA_FAQ_1"],
  ]) {
    const c = await b.newContext();
    const p = await c.newPage();
    const r = await p.goto(`${BASE}${ruta}?${parametro}=${valor}`, {
      waitUntil: "domcontentloaded", timeout: 60000,
    });
    if (!r || r.status() >= 400) {
      ok(`${nombre}: la página existe`, false, `estado ${r ? r.status() : "sin respuesta"}`);
      await c.close();
      continue;
    }
    await p.waitForTimeout(1200);
    const galleta = (await c.cookies()).find((x) => x.name === "cw_attr");
    const datos = galleta ? JSON.parse(decodeURIComponent(galleta.value)) : {};
    ok(`${nombre}: captura ${parametro}`, datos[parametro] === valor, JSON.stringify(datos));
    await c.close();
  }

  await b.close();
  if (errores.length) {
    console.log("\n  ERRORES EN CONSOLA:\n   " + errores.join("\n   "));
    fallos += errores.length;
  }
  console.log(fallos === 0 ? "\nTodo bien.\n" : `\n${fallos} fallos.\n`);
  process.exit(fallos === 0 ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });

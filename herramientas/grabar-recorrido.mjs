/**
 * Graba el recorrido guiado como MP4.  ·  node herramientas/grabar-recorrido.mjs [--lang es|en] [--formato 16x9|9x16] [--base URL] [--salida DIR] [--sin-musica]
 *
 * ─────────────────────────────────────────────────────────────────────────
 * UN SOLO GUION, DOS SALIDAS
 * ─────────────────────────────────────────────────────────────────────────
 *
 * El recorrido del sitio NO es un vídeo, a propósito: se lee, se indexa y se
 * corrige sin regrabar. Pero un anuncio en Meta, un reel o un WhatsApp a un
 * productor sí necesitan un archivo. Este script saca ese archivo **del mismo
 * componente**: abre la página con `?recorrido=grabar`, que arranca solo, sin
 * mandos, avanza los capítulos con un reloj exacto sacado del manifiesto y
 * apunta en `window.__recorridoMarcas` el instante en que empezó cada uno.
 * Con esas marcas se le pega después la voz, capítulo a capítulo, y la cama
 * musical por debajo. Si mañana cambia una cifra del guion, se regraba la voz
 * y se vuelve a correr esto: el vídeo nunca se desincroniza del sitio.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * CÓMO SE CASAN IMAGEN Y VOZ
 * ─────────────────────────────────────────────────────────────────────────
 *
 * La grabación de Playwright empieza al crear el contexto y termina al
 * cerrarlo. El inicio es impreciso (la página tarda en pintar); el FINAL es
 * exacto: el último cuadro es el instante del cierre. Por eso las marcas se
 * anclan al final: `momentoEnVideo(t) = duracionVideo − (T_cierre − t)`. El
 * error queda por debajo de un cuadro.
 *
 * Requiere: Playwright (el de ~/crossworld), ffmpeg y ffprobe, el sitio
 * corriendo en --base (por defecto http://localhost:3200) y la voz grabada.
 */

import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, rm, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createRequire } from "node:module";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const ejecutar = promisify(execFile);
const args = process.argv.slice(2);
const opcion = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);

const LANGS = opcion("--lang", "es,en").split(",");
const FORMATOS = opcion("--formato", "16x9,9x16").split(",");
const BASE = opcion("--base", "http://localhost:3200");
const SALIDA = opcion("--salida", join(RAIZ, ".qa", "video"));
const SIN_MUSICA = args.includes("--sin-musica");

const TAMANOS = { "16x9": { width: 1920, height: 1080 }, "9x16": { width: 1080, height: 1920 } };

// Playwright no es dependencia del sitio: vive en ~/crossworld. Se resuelve
// desde ahí para no añadir 300 MB al proyecto por una herramienta de QA.
const require = createRequire(import.meta.url);
function cargarPlaywright() {
  for (const ruta of [join(RAIZ, "node_modules", "playwright"), "/home/daniel/crossworld/node_modules/playwright"]) {
    try { return require(ruta); } catch { /* siguiente */ }
  }
  throw new Error("No encuentro Playwright. Instálalo o ajusta la ruta en cargarPlaywright().");
}

async function duracionMedia(ruta) {
  const { stdout } = await ejecutar("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", ruta]);
  return parseFloat(stdout);
}

async function grabar(lang, formato) {
  const { chromium } = cargarPlaywright();
  const tam = TAMANOS[formato];
  const tmp = join(SALIDA, `_tmp-${lang}-${formato}`);
  await rm(tmp, { recursive: true, force: true });
  await mkdir(tmp, { recursive: true });

  console.log(`\n▶ ${lang} · ${formato} · ${tam.width}×${tam.height}`);
  const browser = await chromium.launch({
    args: ["--mute-audio", "--autoplay-policy=no-user-gesture-required", "--font-render-hinting=none", "--disable-gpu-vsync"],
  });
  const ctx = await browser.newContext({
    viewport: tam,
    deviceScaleFactor: 1,
    recordVideo: { dir: tmp, size: tam },
    reducedMotion: "no-preference",
    locale: lang === "es" ? "es-US" : "en-US",
  });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log("   error en página:", e.message));

  await page.goto(`${BASE}/${lang}?recorrido=grabar`, { waitUntil: "networkidle", timeout: 90000 });
  process.stdout.write("   grabando… ");
  await page.waitForSelector('body[data-recorrido="fin"]', { timeout: 8 * 60 * 1000 });
  const marcas = await page.evaluate(() => ({ marcas: window.__recorridoMarcas ?? [], fin: window.__recorridoFin ?? Date.now() }));
  const cierre = Date.now();
  const video = page.video();
  await ctx.close();
  await browser.close();
  const rutaWebm = await video.path();
  const durVideo = await duracionMedia(rutaWebm);
  console.log(`${durVideo.toFixed(1)} s de vídeo · ${marcas.marcas.length} capítulos`);

  // Momento, en el vídeo, en que empieza cada capítulo (anclado al final).
  const enVideo = (t) => durVideo - (cierre - t) / 1000;
  const inicios = marcas.marcas.map((m) => ({ ...m, s: enVideo(m.t) }));
  if (inicios.some((m) => m.s < 0)) throw new Error("Una marca cae antes del inicio del vídeo; algo se desfasó.");

  // Se recorta el arranque (la página cargando) hasta medio segundo antes del
  // primer capítulo, y el final a tres segundos después de la última voz.
  const corteInicio = Math.max(0, inicios[0].s - 0.6);

  const dirAudio = join(RAIZ, "public", "audio", "recorrido", lang);
  const entradas = ["-ss", corteInicio.toFixed(3), "-i", rutaWebm];
  const filtros = [];
  const etiquetas = [];
  let ultimoFin = 0;
  for (let i = 0; i < inicios.length; i++) {
    const nn = String(inicios[i].capitulo + 1).padStart(2, "0");
    const mp3 = join(dirAudio, `${nn}.mp3`);
    if (!existsSync(mp3)) { console.log(`   falta ${lang}/${nn}.mp3: capítulo mudo`); continue; }
    const retardo = Math.max(0, Math.round((inicios[i].s - corteInicio) * 1000));
    entradas.push("-i", mp3);
    const k = entradas.filter((e) => e === "-i").length - 1; // índice de entrada
    filtros.push(`[${k}:a]aresample=44100,adelay=${retardo}|${retardo}[v${i}]`);
    etiquetas.push(`[v${i}]`);
    ultimoFin = Math.max(ultimoFin, retardo / 1000 + (await duracionMedia(mp3)));
  }
  const durSalida = Math.min(durVideo - corteInicio, ultimoFin + 6.5);

  const cama = join(RAIZ, "public", "audio", "recorrido", "cama.mp3");
  let mezcla;
  if (!SIN_MUSICA && existsSync(cama)) {
    entradas.push("-stream_loop", "-1", "-i", cama);
    const k = entradas.filter((e) => e === "-i").length - 1;
    filtros.push(`${etiquetas.join("")}amix=inputs=${etiquetas.length}:normalize=0[voz]`);
    filtros.push(`[${k}:a]aresample=44100,volume=0.11,afade=t=in:st=0:d=1.5,afade=t=out:st=${(durSalida - 3).toFixed(2)}:d=3[cama]`);
    filtros.push(`[voz][cama]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.95[out]`);
    mezcla = "[out]";
  } else {
    filtros.push(`${etiquetas.join("")}amix=inputs=${etiquetas.length}:normalize=0,alimiter=limit=0.95[out]`);
    mezcla = "[out]";
  }

  await mkdir(SALIDA, { recursive: true });
  const salida = join(SALIDA, `recorrido-${lang}-${formato}.mp4`);
  process.stdout.write("   codificando… ");
  await ejecutar("ffmpeg", [
    "-y", "-hide_banner", "-loglevel", "error",
    ...entradas,
    "-filter_complex", filtros.join(";"),
    "-map", "0:v:0", "-map", mezcla,
    "-t", durSalida.toFixed(3),
    "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", "-r", "30",
    "-c:a", "aac", "-b:a", "160k", "-ar", "44100",
    "-movflags", "+faststart",
    salida,
  ], { maxBuffer: 1024 * 1024 * 64 });
  const bytes = (await stat(salida)).size;
  console.log(`${(bytes / 1024 / 1024).toFixed(1)} MB → ${salida}`);

  await rm(tmp, { recursive: true, force: true });
  return { salida, marcas: inicios.map((m) => ({ id: m.id, s: Math.round((m.s - corteInicio) * 10) / 10 })) };
}

// Comprobaciones antes de gastar diez minutos.
for (const h of ["ffmpeg", "ffprobe"]) {
  try { await ejecutar(h, ["-version"]); } catch { console.error(`Falta ${h}.`); process.exit(1); }
}
const manifiesto = join(RAIZ, "public", "audio", "recorrido", "manifiesto.json");
if (!existsSync(manifiesto)) { console.error("No hay voz grabada (falta manifiesto.json). Corre generar-recorrido.mjs primero."); process.exit(1); }
try { await fetch(BASE, { method: "HEAD" }); } catch { console.error(`El sitio no responde en ${BASE}. Arráncalo: npm run build && npx next start -p 3200`); process.exit(1); }

const resultados = [];
for (const lang of LANGS) for (const f of FORMATOS) {
  if (!TAMANOS[f]) { console.error(`Formato desconocido: ${f}`); process.exit(1); }
  resultados.push(await grabar(lang, f));
}
console.log("\nListo:");
for (const r of resultados) console.log(`  ${r.salida}\n    capítulos en ${r.marcas.map((m) => `${m.id}@${m.s}s`).join(" · ")}`);

// Limpieza de temporales huérfanos de corridas anteriores.
try {
  for (const d of await readdir(SALIDA)) if (d.startsWith("_tmp-")) await rm(join(SALIDA, d), { recursive: true, force: true });
} catch { /* nada */ }
void readFile;

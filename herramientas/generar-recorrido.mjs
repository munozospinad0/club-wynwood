/**
 * Locuta el recorrido guiado con ElevenLabs.  ·  node herramientas/generar-recorrido.mjs [--seco] [--force] [--voces] [--solo es|en]
 *
 * Lee `lib/recorrido.guion.json` y escribe, por idioma y capítulo,
 * `public/audio/recorrido/<es|en>/NN.mp3` + `NN.words.json` (alineamiento
 * palabra a palabra, formato [{w,start,end}], el mismo de Loymark Academy), y
 * al final `manifiesto.json` con la DURACIÓN real de cada capítulo, que es lo
 * que usa la grabación del vídeo para casar imagen y voz.
 *
 * Solo regenera lo que cambió: compara el texto locutado que guarda el
 * .words.json con el guion de hoy. Regrabar cuesta créditos. Cambiar de voz o
 * de modelo NO se detecta solo: para eso está --force.
 *
 * Variables (se leen del entorno): ELEVENLABS_API_KEY, VOICE_ES, VOICE_EN,
 * MODEL_ID (eleven_v3), OUTPUT_FORMAT (mp3_44100_128), SPEED (1.0), STABILITY (0.5).
 *   --seco    no llama a la API: dice qué haría y cuántos caracteres cuesta
 *   --force   regenera todo aunque no haya cambiado
 *   --voces   lista las voces de la cuenta (nombre e id) y sale
 *   --solo    solo un idioma
 */

import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const seco = args.includes("--seco");
const force = args.includes("--force");
const solo = args.includes("--solo") ? args[args.indexOf("--solo") + 1] : null;

const API = process.env.ELEVENLABS_API_KEY;
// `--seco` no llama a la API, así que tampoco debería exigir la clave: sirve
// justo para saber cuánto costaría ANTES de conseguirla.
if (!API && !seco) { console.error("Falta ELEVENLABS_API_KEY en el entorno."); process.exit(1); }

if (args.includes("--voces")) {
  const r = await fetch("https://api.elevenlabs.io/v1/voices", { headers: { "xi-api-key": API } });
  const j = await r.json();
  for (const v of j.voices ?? []) console.log(`${v.voice_id}  ${v.name}  ${v.labels?.language ?? ""} ${v.labels?.accent ?? ""} ${v.labels?.use_case ?? ""} ${v.labels?.descriptive ?? ""}`);
  process.exit(0);
}

/**
 * EL MODELO: eleven_v3, y por qué se cambió (6-sep-2026).
 *
 * La primera grabación iba con eleven_multilingual_v2 y Daniel la oyó plana:
 * «mejor voz». v3 es el modelo expresivo de ElevenLabs: entona por sentido, no
 * por frase, respira donde hay puntuación y no suena a locutor leyendo. Se
 * comprobó antes de cambiarlo que el punto `/with-timestamps` lo acepta y
 * devuelve el alineamiento —sin él no hay hitos—: lo hace.
 *
 * Dos cosas de v3 que no son como en v2:
 *   · `stability` va a saltos: 0 (creativo), 0.5 (natural) o 1 (robusto). Un
 *     0.45 lo redondea él. Se usa 0.5: expresivo pero fiel al texto.
 *   · Admite etiquetas de dirección como [pausa] dentro del texto. NO se usan:
 *     entrarían al alineamiento y romperían la búsqueda de hitos por frase.
 *     La pausa se dirige con puntuación.
 */
const MODEL_ID = process.env.MODEL_ID || "eleven_v3";
const OUTPUT_FORMAT = process.env.OUTPUT_FORMAT || "mp3_44100_128";

/**
 * LAS VOCES, y por qué estas dos.
 *
 * **Español: Cristian (LA).** Latinoamericano, no peninsular: el público es
 * Miami y Latinoamérica, y una voz de España en un venue de Wynwood suena a
 * doblaje. De las cuatro latinas de la cuenta es la única etiquetada como
 * narración, y la de más edad: la anterior (Nestor, joven, conversacional)
 * es la que Daniel oyó y no le convenció. Daniel ya la había probado en julio
 * para el vídeo de anuncios (`voz-cristian.mp3` en Proyecto wynwood).
 *
 * **Inglés: Brian.** «Deep, resonant and comforting». Es la voz del vídeo en
 * inglés que Daniel aprobó en julio (`Club-Wynwood-EN.mp4`), así que el sitio
 * y los anuncios suenan igual. La anterior (Chris, «down-to-earth, casual»)
 * encajaba con el tono pero no con el nivel de producción que se pide ahora.
 *
 * Se pueden sustituir por entorno sin tocar el código. `--voces` lista las de
 * la cuenta con su identificador.
 */
const VOICE = {
  es: process.env.VOICE_ES || "WZOxu5tVZTrgbKo1DIXH", // Cristian (LA) · es-latin-american · narrative, calm
  en: process.env.VOICE_EN || "nPczCjzI2devNBz1zQrb", // Brian · en-american · deep, resonant, comforting
};

const esV3 = MODEL_ID.startsWith("eleven_v3");
const AJUSTES = esV3
  ? {
      stability: Number(process.env.STABILITY ?? 0.5),
      similarity_boost: Number(process.env.SIMILARITY ?? 0.8),
      speed: Number(process.env.SPEED ?? 1.0),
    }
  : {
      stability: Number(process.env.STABILITY ?? 0.45),
      similarity_boost: Number(process.env.SIMILARITY ?? 0.8),
      style: Number(process.env.STYLE ?? 0.15),
      use_speaker_boost: true,
      speed: Number(process.env.SPEED ?? 1.08),
    };

const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ñ]+/g, " ").trim();

function palabrasDe(al) {
  if (!al || !al.characters) return [];
  const ch = al.characters, st = al.character_start_times_seconds || [], et = al.character_end_times_seconds || [];
  const out = []; let cur = null;
  for (let i = 0; i < ch.length; i++) {
    const c = ch[i];
    if (c === " " || c === "\n" || c === "\t") { if (cur) { out.push(cur); cur = null; } continue; }
    if (!cur) cur = { w: "", start: st[i], end: et[i] };
    cur.w += c; cur.end = et[i];
  }
  if (cur) out.push(cur);
  return out;
}

async function yaDicho(rutaWords, texto) {
  if (!existsSync(rutaWords)) return false;
  try {
    const words = JSON.parse(await readFile(rutaWords, "utf8"));
    return norm(words.map((w) => w.w).join(" ")) === norm(texto);
  } catch { return false; }
}

async function locutar(voiceId, text, lang) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps?output_format=${OUTPUT_FORMAT}`;
  const cuerpo = { text, model_id: MODEL_ID, voice_settings: AJUSTES };
  // v3 acepta el idioma explícito; evita que un nombre propio en inglés
  // («Northwest First Court») le haga cambiar de acento a media frase.
  if (esV3) cuerpo.language_code = lang;
  const res = await fetch(url, {
    method: "POST",
    headers: { "xi-api-key": API, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(cuerpo),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${(await res.text().catch(() => "")).slice(0, 200)}`);
  const j = await res.json();
  return { audio: Buffer.from(j.audio_base64, "base64"), palabras: palabrasDe(j.alignment || j.normalized_alignment) };
}

/** Duración real del mp3, con ffprobe si está; si no, la última palabra más un respiro. */
const ejecutar = promisify(execFile);
async function duracionDe(rutaMp3, palabras) {
  try {
    const { stdout } = await ejecutar("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", rutaMp3]);
    const d = parseFloat(stdout);
    if (Number.isFinite(d) && d > 0) return Math.round(d * 100) / 100;
  } catch { /* sin ffprobe */ }
  const fin = palabras.length ? palabras[palabras.length - 1].end : 0;
  return Math.round((fin + 0.35) * 100) / 100;
}

const guion = JSON.parse(await readFile(join(RAIZ, "lib", "recorrido.guion.json"), "utf8"));
let caracteres = 0, pendientes = 0, hechos = 0;

const idiomas = ["es", "en"].filter((l) => !solo || l === solo);
console.log(`modelo ${MODEL_ID} · voces es=${VOICE.es} en=${VOICE.en} · ${JSON.stringify(AJUSTES)}\n`);

for (const lang of idiomas) {
  const dir = join(RAIZ, "public", "audio", "recorrido", lang);
  await mkdir(dir, { recursive: true });
  for (let i = 0; i < guion.capitulos.length; i++) {
    const c = guion.capitulos[i];
    const nn = String(i + 1).padStart(2, "0");
    const texto = c.texto[lang];
    const rutaMp3 = join(dir, `${nn}.mp3`), rutaWords = join(dir, `${nn}.words.json`);
    if (!force && (await yaDicho(rutaWords, texto))) { console.log(`  =     ${lang}/${nn} ${c.id} · ya locutado igual`); continue; }
    pendientes++; caracteres += texto.length;
    if (seco) { console.log(`  ·     ${lang}/${nn} ${c.id} · ${texto.length} caracteres`); continue; }
    if (!VOICE[lang]) { console.error(`Falta VOICE_${lang.toUpperCase()}`); process.exit(1); }
    process.stdout.write(`  →     ${lang}/${nn} ${c.id} · ${texto.length} caracteres … `);
    let intento = 0, ok = false;
    while (!ok && intento < 3) {
      try {
        const { audio, palabras } = await locutar(VOICE[lang], texto, lang);
        await writeFile(rutaMp3, audio);
        await writeFile(rutaWords, JSON.stringify(palabras));
        const dicho = norm(palabras.map((w) => w.w).join(" "));
        const igual = dicho === norm(texto);
        const fin = palabras.length ? palabras[palabras.length - 1].end : 0;
        const ppm = fin ? Math.round((palabras.length / fin) * 60) : 0;
        console.log(`${(audio.length / 1024).toFixed(0)} KB · ${palabras.length} palabras · ${fin.toFixed(1)} s · ${ppm} ppm${igual ? "" : " · OJO: el alineamiento no coincide con el guion"}`);
        ok = true; hechos++;
      } catch (e) {
        intento++;
        console.log(`fallo (${e.message}) · reintento ${intento}`);
        await new Promise((r) => setTimeout(r, 2000 * intento));
      }
    }
    if (!ok) process.exit(1);
  }
}

/**
 * EL MANIFIESTO. Es lo que le dice al sitio que hay voz, y cuánto dura cada
 * capítulo. Sin él, el reproductor tendría que pedir el audio de cada capítulo
 * para descubrir cuáles faltan, y dejaría dieciséis 404 en la consola cada vez.
 *
 * Se escribe AL FINAL, con lo que haya en disco (también lo que no se
 * regeneró), para que refleje siempre el estado real de la carpeta.
 */
if (!seco) {
  const completos = [];
  const duraciones = {};
  for (const lang of ["es", "en"]) {
    let n = 0;
    const ds = [];
    for (let i = 0; i < guion.capitulos.length; i++) {
      const nn = String(i + 1).padStart(2, "0");
      const mp3 = join(RAIZ, "public", "audio", "recorrido", lang, `${nn}.mp3`);
      const words = join(RAIZ, "public", "audio", "recorrido", lang, `${nn}.words.json`);
      if (!existsSync(mp3)) { ds.push(0); continue; }
      n++;
      const palabras = existsSync(words) ? JSON.parse(await readFile(words, "utf8")) : [];
      ds.push(await duracionDe(mp3, palabras));
    }
    if (n > 0) { completos.push({ idioma: lang, capitulos: n }); duraciones[lang] = ds; }
  }
  if (completos.length) {
    await writeFile(
      join(RAIZ, "public", "audio", "recorrido", "manifiesto.json"),
      JSON.stringify({ version: guion.version, modelo: MODEL_ID, voces: VOICE, total: guion.capitulos.length, idiomas: completos, duraciones }, null, 2)
    );
    console.log(`\n  manifiesto escrito: ${completos.map((c) => `${c.idioma} ${c.capitulos}/${guion.capitulos.length} · ${duraciones[c.idioma].reduce((a, b) => a + b, 0).toFixed(0)} s`).join(" · ")}`);
  }
}

console.log(`\n${seco ? "Haría" : "Hechos"}: ${seco ? pendientes : hechos} capítulo(s) · ${caracteres} caracteres ≈ ${caracteres} créditos.`);

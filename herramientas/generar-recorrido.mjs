/**
 * Locuta el recorrido guiado con ElevenLabs.  ·  node herramientas/generar-recorrido.mjs [--seco] [--force] [--voces]
 *
 * Lee `lib/recorrido.guion.json` y escribe, por idioma y capítulo,
 * `public/audio/recorrido/<es|en>/NN.mp3` + `NN.words.json` (alineamiento
 * palabra a palabra, formato [{w,start,end}], el mismo de Loymark Academy).
 *
 * Solo regenera lo que cambió: compara el texto locutado que guarda el
 * .words.json con el guion de hoy. Regrabar cuesta créditos.
 *
 * Variables (se leen del entorno): ELEVENLABS_API_KEY, VOICE_ES, VOICE_EN,
 * SPEED (1.08), OUTPUT_FORMAT (mp3_44100_96), MODEL_ID (eleven_multilingual_v2).
 *   --seco    no llama a la API: dice qué haría y cuántos caracteres cuesta
 *   --force   regenera todo aunque no haya cambiado
 *   --voces   lista las voces de la cuenta (nombre e id) y sale
 */

import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const seco = args.includes("--seco");
const force = args.includes("--force");

const API = process.env.ELEVENLABS_API_KEY;
// `--seco` no llama a la API, así que tampoco debería exigir la clave: sirve
// justo para saber cuánto costaría ANTES de conseguirla.
if (!API && !seco) { console.error("Falta ELEVENLABS_API_KEY en el entorno."); process.exit(1); }

if (args.includes("--voces")) {
  const r = await fetch("https://api.elevenlabs.io/v1/voices", { headers: { "xi-api-key": API } });
  const j = await r.json();
  for (const v of j.voices ?? []) console.log(`${v.voice_id}  ${v.name}  ${v.labels?.language ?? ""} ${v.labels?.accent ?? ""} ${v.category ?? ""}`);
  process.exit(0);
}

const MODEL_ID = process.env.MODEL_ID || "eleven_multilingual_v2";
const OUTPUT_FORMAT = process.env.OUTPUT_FORMAT || "mp3_44100_96";
/**
 * LAS VOCES, y por qué estas dos.
 *
 * **Español: latinoamericano, no peninsular.** El público es Miami y
 * Latinoamérica. Una voz de España en un venue de Wynwood suena a doblaje, y
 * además choca con la regla de español neutro que gobierna todo el resto del
 * texto de la marca.
 *
 * **Inglés: alguien hablando, no alguien locutando.** La descripción de esta voz
 * dice literalmente «sounds like an actual person talking, not a performance», y
 * conserva las vacilaciones naturales del habla. Encaja con el tono del sitio,
 * que no promete nada y solo cuenta lo que hay: una voz de anuncio contradiría
 * el mensaje mientras lo lee.
 *
 * Se pueden sustituir por entorno sin tocar el código. `--voces` lista las de la
 * cuenta con su identificador.
 */
const VOICE = {
  es: process.env.VOICE_ES || "cTZ1Li7htNiwd1cNPgUC", // Nestor · es-latin-american
  en: process.env.VOICE_EN || "iP95p4xoKVk53GoZ742B", // Chris · en-american
};
const AJUSTES = {
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

async function locutar(voiceId, text) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps?output_format=${OUTPUT_FORMAT}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "xi-api-key": API, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ text, model_id: MODEL_ID, voice_settings: AJUSTES }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${(await res.text().catch(() => "")).slice(0, 200)}`);
  const j = await res.json();
  return { audio: Buffer.from(j.audio_base64, "base64"), palabras: palabrasDe(j.alignment || j.normalized_alignment) };
}

const guion = JSON.parse(await readFile(join(RAIZ, "lib", "recorrido.guion.json"), "utf8"));
let caracteres = 0, pendientes = 0, hechos = 0;

for (const lang of ["es", "en"]) {
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
        const { audio, palabras } = await locutar(VOICE[lang], texto);
        await writeFile(rutaMp3, audio);
        await writeFile(rutaWords, JSON.stringify(palabras));
        const dicho = norm(palabras.map((w) => w.w).join(" "));
        const igual = dicho === norm(texto);
        console.log(`${(audio.length / 1024).toFixed(0)} KB · ${palabras.length} palabras${igual ? "" : " · OJO: el alineamiento no coincide con el guion"}`);
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
 * EL MANIFIESTO. Es lo que le dice al sitio que hay voz.
 *
 * Sin él, el reproductor tendría que pedir el audio y el alineamiento de cada
 * capítulo para descubrir cuáles faltan, y dejaría catorce errores 404 en la
 * consola cada vez que alguien abre la página sin voz grabada. El coste de eso
 * no es el ruido: es que el día que se rompa algo de verdad, el error que
 * importa va a estar enterrado entre errores que son normales.
 *
 * Se escribe AL FINAL y solo si de verdad se locutó algo, para que su
 * existencia signifique exactamente lo que dice.
 */
if (!seco) {
  const completos = [];
  for (const lang of ["es", "en"]) {
    let n = 0;
    for (let i = 0; i < guion.capitulos.length; i++) {
      const nn = String(i + 1).padStart(2, "0");
      if (existsSync(join(RAIZ, "public", "audio", "recorrido", lang, `${nn}.mp3`))) n++;
    }
    if (n > 0) completos.push({ idioma: lang, capitulos: n });
  }
  if (completos.length) {
    await writeFile(
      join(RAIZ, "public", "audio", "recorrido", "manifiesto.json"),
      JSON.stringify({ version: guion.version, total: guion.capitulos.length, idiomas: completos }, null, 2)
    );
    console.log(`  manifiesto escrito: ${completos.map((c) => `${c.idioma} ${c.capitulos}/${guion.capitulos.length}`).join(" · ")}`);
  }
}

console.log(`\n${seco ? "Haría" : "Hechos"}: ${seco ? pendientes : hechos} capítulo(s) · ${caracteres} caracteres ≈ ${caracteres} créditos.`);

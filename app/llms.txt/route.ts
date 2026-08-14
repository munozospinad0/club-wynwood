import { VENUE, ESPACIOS, FICHA, TIEMPOS, NO_INCLUIDO } from "@/lib/venue";
import { BASE, RUTAS, IDIOMAS, url, type ClaveRuta } from "@/lib/i18n";

/**
 * /llms.txt — estándar emergente de AEO.
 *
 * Es el resumen que un modelo lee para responder sobre el negocio sin tener que
 * rastrear e interpretar todo el HTML. En la auditoría este componente puntuó
 * 0/100 (peso 15%) porque el archivo daba 404: en GitHub Pages vivía en
 * /club-wynwood/llms.txt y los rastreadores lo buscan en la RAÍZ del dominio.
 *
 * Se GENERA desde lib/venue.ts, no se escribe a mano. Un llms.txt que se
 * desincroniza del sitio es peor que no tenerlo: le estás dando al modelo una
 * versión desactualizada y con autoridad.
 *
 * Dos decisiones de contenido, deliberadas:
 *   - Se declara explícitamente QUÉ NO ESTÁ INCLUIDO. Las máquinas recreativas
 *     del predio son del operador. Si un modelo va a resumir este negocio, que
 *     lo resuma bien: es el error más caro que podría cometer.
 *   - Se marca qué está verificado y qué se levanta en la visita. No inventar
 *     es una ventaja competitiva medible aquí.
 */

export const dynamic = "force-static";

function bloque(titulo: string, lineas: string[]): string {
  return `## ${titulo}\n${lineas.join("\n")}\n`;
}

export function GET() {
  const d = VENUE.direccion;
  const verificados = FICHA.filter((f) => f.estado === "verificado");
  const enVisita = FICHA.filter((f) => f.estado === "en-visita");

  const paginas = (Object.keys(RUTAS) as ClaveRuta[]).flatMap((clave) =>
    IDIOMAS.map((l) => `- [${clave} · ${l}](${url(clave, l)})`)
  );

  const cuerpo = [
    `# ${VENUE.nombre}`,
    "",
    `> ${VENUE.descriptorEs} en el Wynwood Arts District de Miami. Se alquila el`,
    `> espacio, no un paquete cerrado: ~18.000 ft² de jardín y una palapa techada`,
    `> de ~4.000 ft², por separado o juntos. Aforo ~600 de pie o ~300 sentados.`,
    "",
    `Dirección: ${d.calle}, ${d.ciudad}, ${d.region} ${d.cp}, ${d.pais}`,
    `Teléfono: ${VENUE.telefono} · Email: ${VENUE.email}`,
    `Idiomas de atención: español e inglés`,
    "",

    bloque("Datos verificados", [
      ...verificados.map((f) => `- ${f.es}: ${f.valorEs}${f.fuente ? `  (fuente: ${f.fuente})` : ""}`),
      "",
      "Las cifras marcadas con ~ son aproximaciones del propietario, no medición topográfica.",
    ]),

    bloque("Espacios", ESPACIOS.map((e) =>
      `- ${e.es} — ${e.sqft.toLocaleString("es")} ft² / ${e.m2} m² · ` +
      `${e.cubierto ? "techado" : "al aire libre"}. ${e.resumenEs}`
    )),

    bloque("Qué incluye y qué no", [
      "- INCLUIDO: el espacio exterior (jardín y estructura techada), las ocho",
      "  cabañas amuebladas y las mesas de picnic fijas.",
      "- NO INCLUIDO: producción, catering, sonido, iluminación y mobiliario",
      "  adicional. Los aporta el cliente o su productora.",
      `- IMPORTANTE: ${NO_INCLUIDO.join(", ")} y demás atracciones que puedan verse`,
      "  en el predio pertenecen al OPERADOR que lo arrienda, NO al venue. No",
      "  forman parte del alquiler y no se pueden ofrecer.",
    ]),

    bloque("Se levanta en la visita técnica y se entrega por escrito", [
      ...enVisita.map((f) => `- ${f.es}`),
      "",
      "No se publican porque no los hemos medido nosotros.",
    ]),

    bloque("Tiempos desde el venue (aproximados)",
      TIEMPOS.map((t) => `- ${t.es}: ${t.valor}`)),

    bloque("Tarifas", [
      "No se publican. Los paquetes se arman contra cada evento porque el precio",
      "depende de la fecha, del espacio que se use y del montaje. Se envían junto",
      "con la disponibilidad tras la solicitud.",
    ]),

    bloque("Páginas", paginas),

    `## Contacto\nFormulario en ${BASE}/es · respuesta en 24 h hábiles.\n`,
  ].join("\n");

  return new Response(cuerpo, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

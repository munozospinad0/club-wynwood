import { VENUE, ESPACIOS, FICHA, TIEMPOS, NO_INCLUIDO } from "@/lib/venue";
import { BASE, RUTAS, IDIOMAS, url, type ClaveRuta } from "@/lib/i18n";
import guion from "@/lib/recorrido.guion.json";

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

  /**
   * El número sale de la ficha, no de esta línea: ver el aviso del bloque «Qué
   * incluye y qué no». Se extrae solo la cifra («4 amuebladas, en el jardín» →
   * «4») y la frase se compone aquí, porque el valor de la ficha está redactado
   * para leerse en una tabla y no dentro de una oración. Si la fila o la cifra
   * desaparecieran, se dice lo genérico antes que inventar un número.
   */
  const nCabanas = FICHA.find((f) => f.clave === "cabanas")?.valorEs.match(/\d+/)?.[0];
  const cabanas = nCabanas ? `las ${nCabanas} cabañas amuebladas` : "las cabañas amuebladas";

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

    /**
     * ⚠️ ESTE BLOQUE DECÍA «LAS OCHO CABAÑAS», Y SE PUBLICÓ ASÍ.
     *
     * El 9-sep-2026 se corrigió el número en todo el sitio —ficha, dibujos,
     * prosa, JSON-LD y hasta la voz del recorrido— y esta línea sobrevivió,
     * porque es la única del archivo escrita a mano en vez de generada desde
     * `FICHA`. Justo aquí: el archivo que existe para que un modelo resuma el
     * negocio sin rastrear el HTML, y que por tanto propaga el error con más
     * autoridad que ninguna página.
     *
     * Por eso ahora se compone desde la fila `cabanas` de la ficha. Si el dato
     * vuelve a cambiar, esta línea cambia sola. La cabecera del archivo ya
     * avisaba de que un llms.txt desincronizado es peor que no tenerlo.
     */
    bloque("Qué incluye y qué no", [
      `- INCLUIDO: el espacio exterior (jardín y estructura techada), ${cabanas}`,
      "  y las mesas de picnic fijas.",
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

    /**
     * EL RECORRIDO GUIADO, EN TEXTO. Son las ocho preguntas que hace un
     * productor antes de montar algo aquí, con la respuesta que da el sitio en
     * voz. Es el bloque más citable del archivo: pregunta literal, respuesta
     * autocontenida, sin adjetivos. Sale del mismo guion que la voz, así que
     * no puede contradecir lo que el sitio dice.
     */
    bloque("Recorrido guiado: las ocho preguntas de un productor, respondidas",
      guion.capitulos.flatMap((c) => [`### ${c.pregunta.es}`, c.texto.es, ""])),

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

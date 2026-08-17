import type { Idioma } from "@/lib/i18n";

/**
 * PLANTA — la lámina que sí contesta preguntas.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * DIAGNÓSTICO DE LA VERSIÓN ANTERIOR
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Daniel: «no nos dan explicativos, son cero lógicos, cero ayuda».
 *
 * Tenía razón, y el motivo es concreto: **cada anotación era una medida y
 * ninguna era una respuesta.** La lámina 04 decía 240 FT, 92 FT, CUBIERTO
 * ~4.000 ft², ABIERTO ~18.000 ft². Todo cierto y todo inútil, porque quien mira
 * el plano no está preguntando cuántos pies mide: está preguntando si su evento
 * cabe, por dónde entra el camión y qué pasa si llueve. «18.000 ft²» no
 * contesta ninguna de las tres.
 *
 * Un plano de arquitectura documenta. Éste tiene que **vender y tranquilizar**,
 * que es otro oficio. La convención de dibujo se respeta; lo que cambia es qué
 * se rotula.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * LAS TRES DECISIONES
 * ─────────────────────────────────────────────────────────────────────────
 *
 * 1. EL SVG DIBUJA, EL HTML EXPLICA.
 *    Las láminas viejas hornean el texto dentro del SVG. Por eso en el móvil se
 *    lee a 6 px, no se puede seleccionar, y —lo que más cuesta— los buscadores
 *    de IA no lo pueden citar, que es media razón de ser del sitio. Aquí el
 *    dibujo lleva lo mínimo y las respuestas van en HTML al lado: escalan, se
 *    copian, se traducen y se indexan.
 *
 * 2. EL AFORO SE DIBUJA, NO SE ENUNCIA.
 *    Ésta es la que de verdad cambia la lámina. «~300 sentados» es un número
 *    que hay que creerse; treinta mesas de diez dibujadas a escala real sobre
 *    el jardín se ven, y de un vistazo se sabe si aquello queda holgado o
 *    apretado. No es un montaje propuesto: es la misma cifra verificada,
 *    puesta en una forma que se puede juzgar.
 *
 *    El camión de 40 ft cumple lo mismo para la carga: dibujado sobre el paseo,
 *    a escala, contesta «¿entra mi camión?» sin que nadie haga una cuenta.
 *
 * 3. LA GEOMETRÍA, LA BUENA.
 *    Palapa ≈ 63 × 63 ft, no el rectángulo largo de las láminas portadas. Sale
 *    de cruzar los ~4.000 ft² declarados con la forma casi cuadrada que se ve en
 *    la foto aérea y en el cenital del vídeo. Ver VIDEOS.md.
 *
 * Lo que NO se hace: inventar aforos por zona. El único aforo verificado es el
 * del conjunto (~600 de pie / ~300 sentados). Repartirlo por zonas con una
 * regla de tres daría un número con pinta de dato que nadie ha medido.
 */

const U = 3.1;                                   // píxeles por pie
const LOTE = { dx: 240, dy: 92 };
const PALAPA = { x: 10, y: 4, dx: 63, dy: 63 };  // ~4.000 ft², casi cuadrada
const PASEO = { y: 70, dy: 12 };                 // el paseo pavimentado, de extremo a extremo
/**
 * Las ocho cabañas, en fila sobre el borde opuesto al paseo.
 *
 * Las medidas se eligen para que las ocho QUEPAN DENTRO del lote, que no es
 * obvio: con 18 ft de ancho y 4 de hueco, ocho cabañas necesitan 172 ft y
 * empezando en el 96 acababan en el 268 — fuera del recinto, que mide 240.
 * Un plano que se sale de su propio solar no es un detalle estético: es el
 * dibujo diciendo algo falso.
 *   8 × 14 + 7 × 4 = 140 ft, del 88 al 228. Dentro, con margen a los dos lados.
 */
const CABANAS = { x: 88, y: 84, dx: 14, dy: 8, n: 8, hueco: 4 };

/**
 * Los ~300 sentados verificados, como 30 mesas de diez a escala real.
 *
 * 10 columnas × 3 filas. La separación (15 ft entre centros en X, 18 en Y) deja
 * pasillo de servicio entre mesas: una mesa de 60" con sillas ocupa unos 10 ft
 * de diámetro, así que quedan ~5 ft para pasar. Es un montaje plausible, no uno
 * apretado — si hubiera que apretarlas para que entren, el dibujo estaría
 * diciendo lo contrario de lo que dice el número.
 */
const MESAS: Array<[number, number]> = [];
for (let f = 0; f < 3; f++) {
  for (let c = 0; c < 10; c++) MESAS.push([90 + c * 15, 20 + f * 18]);
}

const M = { izq: 30, der: 30, arr: 34, aba: 46 };
const VB = {
  w: LOTE.dx * U + M.izq + M.der,
  h: LOTE.dy * U + M.arr + M.aba,
};
const fx = (ft: number) => M.izq + ft * U;
const fy = (ft: number) => M.arr + ft * U;

const TINTA = "#211c15";
const GRIS = "#8a8071";
const PAPEL = "#f6f3ea";
const OCRE = "#c4772b";

export default function LaminaPlanta({ lang }: { lang: Idioma }) {
  const es = lang === "es";

  /** Cota con flechas. En gris y fina: es referencia, no protagonista. */
  const Cota = ({ x1, y1, x2, y2, txt, arriba = false }:
    { x1: number; y1: number; x2: number; y2: number; txt: string; arriba?: boolean }) => (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={GRIS} strokeWidth="0.7" />
      <path d={`M${x1 + 5},${y1 - 3} L${x1},${y1} L${x1 + 5},${y1 + 3}`} fill="none" stroke={GRIS} strokeWidth="0.7" />
      <path d={`M${x2 - 5},${y2 - 3} L${x2},${y2} L${x2 - 5},${y2 + 3}`} fill="none" stroke={GRIS} strokeWidth="0.7" />
      <text x={(x1 + x2) / 2} y={y1 + (arriba ? -6 : 12)} fill={GRIS} textAnchor="middle"
            fontFamily="ui-monospace,monospace" fontSize="8.5" letterSpacing="1.2">{txt}</text>
    </g>
  );

  /** Etiqueta de zona, dentro del dibujo. Sin caja: la caja añade ruido. */
  const Zona = ({ x, y, txt, sub, claro = false }:
    { x: number; y: number; txt: string; sub: string; claro?: boolean }) => (
    <g textAnchor="middle">
      <text x={x} y={y} fill={claro ? PAPEL : TINTA} fontFamily="ui-monospace,monospace"
            fontSize="10.5" letterSpacing="2">{txt}</text>
      <text x={x} y={y + 13} fill={claro ? PAPEL : GRIS} fontFamily="ui-monospace,monospace"
            fontSize="8" letterSpacing="1" opacity={claro ? 0.85 : 1}>{sub}</text>
    </g>
  );

  return (
    <section aria-label={es ? "Planta del recinto" : "Site plan"}>
      <div className="reja" style={{ paddingBlock: "34px 56px" }}>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap",
                      paddingBottom: 14, borderBottom: "1px solid var(--regla)" }}>
          <div className="ojo" style={{ color: "var(--tinta-2)" }}>
            {es ? "Planta — el recinto visto desde arriba" : "Plan — the site seen from above"}
          </div>
          <div className="ojo">
            {es ? "Lo techado, en tinta" : "What has a roof, in ink"}
          </div>
        </div>

        <div style={{ display: "grid", gap: 28, gridTemplateColumns: "minmax(0,1fr)", marginTop: 26 }}>

          <figure style={{ margin: 0 }}>
            <svg viewBox={`0 0 ${VB.w.toFixed(0)} ${VB.h.toFixed(0)}`} role="img"
                 aria-label={es
                   ? "Planta del recinto: rectángulo de 240 por 92 pies. La palapa techada ocupa un extremo; el paseo pavimentado lo cruza de lado a lado y las cabañas se alinean en el borde opuesto. El acceso está en el extremo oeste."
                   : "Site plan: a 240 by 92 foot rectangle. The covered structure occupies one end; the paved walk crosses end to end and the cabanas line the opposite edge. Access is at the west end."}
                 style={{ width: "100%", height: "auto", display: "block" }}>

              {/* ---------- el suelo: el fondo, casi blanco ---------- */}
              <rect x={fx(0)} y={fy(0)} width={LOTE.dx * U} height={LOTE.dy * U}
                    fill={PAPEL} stroke="#c6beb0" strokeWidth="1" />

              {/* césped: un tono, sin trama. La trama competía con la paja. */}
              <rect x={fx(0)} y={fy(0)} width={LOTE.dx * U} height={PASEO.y * U}
                    fill="#ece7d5" stroke="none" />

              {/* ---------- el paseo: la espina, y también el acceso de carga ---------- */}
              <rect x={fx(0)} y={fy(PASEO.y)} width={LOTE.dx * U} height={PASEO.dy * U}
                    fill="#faf7f0" stroke="#c6beb0" strokeWidth="0.8" />
              {Array.from({ length: 12 }, (_, i) => (
                <line key={i} x1={fx(20 * (i + 1))} y1={fy(PASEO.y)}
                      x2={fx(20 * (i + 1))} y2={fy(PASEO.y + PASEO.dy)}
                      stroke="#d8d0c0" strokeWidth="0.6" />
              ))}

              {/* ---------- la palapa: en tinta, porque tener techo es EL dato ---------- */}
              <rect x={fx(PALAPA.x) + 3} y={fy(PALAPA.y) + 3} width={PALAPA.dx * U} height={PALAPA.dy * U}
                    fill={TINTA} opacity="0.1" />
              <rect x={fx(PALAPA.x)} y={fy(PALAPA.y)} width={PALAPA.dx * U} height={PALAPA.dy * U}
                    fill="#5c5445" stroke={TINTA} strokeWidth="1.4" />
              {/* SIN limatesas, y es deliberado.
                  Se dibujaron primero, porque una cubierta a cuatro aguas vista
                  en planta son cuatro diagonales al centro. El problema es que
                  sobre un cuadrado eso es exactamente una X, y el ojo lee una X
                  como «anulado» antes de leerla como «techo». Aflojarlas no lo
                  arregla: solo la vuelve una X pálida.
                  Lo que dice «esto tiene techo» es la masa oscura contra el
                  suelo claro, y el alero. La forma de la cubierta ya se explica
                  en la sección y en la isométrica, que es donde se ve. */}
              <rect x={fx(PALAPA.x) + 3.5} y={fy(PALAPA.y) + 3.5}
                    width={PALAPA.dx * U - 7} height={PALAPA.dy * U - 7}
                    fill="none" stroke="#a89d88" strokeWidth="0.7" opacity="0.45" />

              {/* ---------- las cabañas ---------- */}
              {Array.from({ length: CABANAS.n }, (_, i) => (
                <rect key={i}
                      x={fx(CABANAS.x + i * (CABANAS.dx + CABANAS.hueco))} y={fy(CABANAS.y)}
                      width={CABANAS.dx * U} height={CABANAS.dy * U}
                      fill="#c9c0ad" stroke={TINTA} strokeWidth="0.8" />
              ))}

              {/* ══════════ EL AFORO, DIBUJADO ══════════
                   Treinta mesas de diez = los ~300 sentados verificados, a la
                   misma escala que el recinto. No es un montaje propuesto: es la
                   cifra que ya publicamos, puesta donde se puede juzgar. De un
                   vistazo se ve que quedan holgadas, que es exactamente lo que
                   un productor quiere saber y lo que «~18 000 ft²» no le dice.
                   Van en ocre porque no son el sitio: son la respuesta. */}
              {MESAS.map(([x, y], i) => (
                <g key={i}>
                  {/* el hueco que ocupa con las sillas, en tono muy suave */}
                  <circle cx={fx(x)} cy={fy(y)} r={5 * U} fill={OCRE} opacity="0.07" />
                  <circle cx={fx(x)} cy={fy(y)} r={2.5 * U} fill="none" stroke={OCRE}
                          strokeWidth="0.9" opacity="0.75" />
                </g>
              ))}

              {/* camión de 40 ft sobre el paseo, a escala */}
              <g>
                <rect x={fx(168)} y={fy(71.5)} width={40 * U} height={9 * U} rx="2"
                      fill="#faf7f0" stroke={OCRE} strokeWidth="1.3" />
                <line x1={fx(178)} y1={fy(71.5)} x2={fx(178)} y2={fy(80.5)}
                      stroke={OCRE} strokeWidth="1.1" />
                {[172, 174.5, 200, 202.5].map((cx, i) => (
                  <rect key={i} x={fx(cx)} y={fy(70.6)} width={1.6 * U} height={1.6 * U}
                        fill={OCRE} opacity="0.55" />
                ))}
              </g>

              {/* ---------- acceso ---------- */}
              <g>
                <path d={`M${fx(-8)},${fy(76)} L${fx(-1)},${fy(76)}`} stroke={TINTA} strokeWidth="1.6" />
                <path d={`M${fx(-3)},${fy(73)} L${fx(-1)},${fy(76)} L${fx(-3)},${fy(79)}`}
                      fill="none" stroke={TINTA} strokeWidth="1.6" />
                <text x={fx(-8)} y={fy(69)} fill={TINTA} fontFamily="ui-monospace,monospace"
                      fontSize="8" letterSpacing="1.4">{es ? "ACCESO" : "ACCESS"}</text>
                <text x={fx(-8)} y={fy(62)} fill={GRIS} fontFamily="ui-monospace,monospace"
                      fontSize="7" letterSpacing="1">NW 1ST CT</text>
              </g>

              {/* ---------- etiquetas ---------- */}
              <Zona x={fx(PALAPA.x + PALAPA.dx / 2)} y={fy(PALAPA.y + PALAPA.dy / 2) - 4}
                    txt="TIKI HUT"
                    sub={es ? "TECHADO · ~4 000 ft²" : "ROOFED · ~4,000 sq ft"} claro />
              <Zona x={fx(157)} y={fy(9)}
                    txt={es ? "EL JARDÍN" : "THE GARDEN"}
                    sub={es ? "AL AIRE LIBRE · ~18 000 ft²" : "OPEN AIR · ~18,000 sq ft"} />

              {/* la línea que hace que el dibujo de las mesas signifique algo */}
              <text x={fx(157)} y={fy(67)} fill={OCRE} textAnchor="middle"
                    fontFamily="ui-monospace,monospace" fontSize="8" letterSpacing="1.3">
                {es ? "30 MESAS DE 10 · LOS ~300 SENTADOS, A ESCALA"
                    : "30 TABLES OF 10 · THE ~300 SEATED, TO SCALE"}
              </text>

              {/* rótulo del camión, dentro del propio camión */}
              <text x={fx(188)} y={fy(77)} fill={OCRE} textAnchor="middle"
                    fontFamily="ui-monospace,monospace" fontSize="7.4" letterSpacing="1">
                {es ? "CAMIÓN 40 FT" : "40 FT TRUCK"}
              </text>

              {/* las cabañas, que sin rótulo eran ocho cajas grises sin sentido */}
              <text x={fx(84)} y={fy(90)} fill={GRIS} textAnchor="end"
                    fontFamily="ui-monospace,monospace" fontSize="7.4" letterSpacing="1.2">
                {es ? "8 CABAÑAS" : "8 CABANAS"}
              </text>

              {/* el paseo, rotulado: es la espina y a la vez el acceso de carga */}
              <text x={fx(60)} y={fy(78)} fill={GRIS}
                    fontFamily="ui-monospace,monospace" fontSize="7.4" letterSpacing="1.2">
                {es ? "PASEO PAVIMENTADO · DE EXTREMO A EXTREMO"
                    : "PAVED WALK · END TO END"}
              </text>

              {/* ---------- cotas ---------- */}
              <Cota x1={fx(0)} y1={fy(LOTE.dy) + 22} x2={fx(LOTE.dx)} y2={fy(LOTE.dy) + 22}
                    txt="≈ 240 FT · 73 M" />
              <Cota x1={fx(PALAPA.x)} y1={fy(0) - 14} x2={fx(PALAPA.x + PALAPA.dx)} y2={fy(0) - 14}
                    txt="≈ 63 FT · 19 M" arriba />

              {/* norte */}
              <g transform={`translate(${VB.w - 22},${M.arr + 6})`}>
                <path d="M0,14 L0,-10 M-3,-4 L0,-11 L3,-4" fill="none" stroke={TINTA} strokeWidth="1" />
                <text x="-2.5" y="25" fontFamily="ui-monospace,monospace" fontSize="8" fill={GRIS}>N</text>
              </g>
            </svg>
          </figure>

          {/* ────────────────────────────────────────────────────────────────
              LAS RESPUESTAS, EN HTML.
              Aquí es donde esta lámina se separa de las otras cuatro. No son
              cotas: son las preguntas que hace de verdad quien está decidiendo
              si alquila, contestadas en el orden en que las hace.
              En HTML y no dentro del SVG para que se lean en el móvil, se puedan
              copiar y las pueda citar un buscador de IA.
             ──────────────────────────────────────────────────────────────── */}
          <dl style={{ margin: 0, display: "grid", gap: 0,
                       gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
                       borderTop: "1px solid var(--regla)" }}>
            {[
              {
                p: es ? "¿Cabe mi evento?" : "Will my event fit?",
                r: es
                  ? "Hasta ~600 personas de pie o ~300 sentadas en el recinto completo. Por encima de eso no entra, y lo decimos antes de la visita para no hacerte perder el viaje."
                  : "Up to ~600 standing or ~300 seated across the whole site. Above that it does not fit, and we say so before the visit rather than waste your trip.",
              },
              {
                p: es ? "¿Y si llueve?" : "What if it rains?",
                r: es
                  ? "La palapa cubre ~4 000 ft² con techo de paja. Está abierta por los cuatro costados: protege del sol y del agua que cae recta, no del viento con lluvia. Para un evento de invierno conviene carpa lateral."
                  : "The structure covers ~4,000 sq ft under thatch. It is open on all four sides: it stops sun and vertical rain, not wind-driven rain. A winter event should budget for side tenting.",
              },
              {
                p: es ? "¿Por dónde entra la producción?" : "How does production get in?",
                r: es
                  ? "Por NW 1st Ct, al paseo pavimentado que cruza el recinto de extremo a extremo. Es continuo y a nivel: un camión de 40 ft llega hasta el fondo sin pisar césped."
                  : "From NW 1st Ct onto the paved walk that runs the full length of the site. It is continuous and level: a 40 ft truck reaches the far end without crossing turf.",
              },
              {
                p: es ? "¿Qué NO hay?" : "What is NOT here?",
                r: es
                  ? "Cocina propia: el catering monta en el sitio. Tampoco hay cerramiento perimetral fijo ni climatización — es un recinto al aire libre, y en Miami eso decide la fecha más que ninguna otra cosa."
                  : "No kitchen of our own: catering sets up on site. No fixed perimeter enclosure and no climate control either — this is an open-air site, and in Miami that drives the date more than anything else.",
              },
            ].map(({ p, r }) => (
              <div key={p} style={{ padding: "18px 20px 20px 0", borderBottom: "1px solid var(--regla)" }}>
                <dt style={{ font: "600 15px/1.35 var(--display), Georgia, serif", color: "var(--tinta)",
                             paddingBottom: 7 }}>{p}</dt>
                <dd style={{ margin: 0, font: "400 13.5px/1.65 var(--texto-f), system-ui, sans-serif",
                             color: "var(--texto)", maxWidth: "46ch" }}>{r}</dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="ojo" style={{ paddingTop: 18, lineHeight: 1.75, maxWidth: "78ch" }}>
          {es
            ? "Planta aproximada, no un levantamiento. El camión y la mesa de diez están dibujados a la misma escala que el recinto: sirven para calcular a ojo, no son parte del montaje. Las medidas exactas se confirman en la visita técnica."
            : "Approximate plan, not a survey. The truck and the ten-seat table are drawn to the same scale as the site: they are there to judge size by eye, not part of any layout. Exact dimensions are confirmed at the technical visit."}
        </p>
      </div>
    </section>
  );
}

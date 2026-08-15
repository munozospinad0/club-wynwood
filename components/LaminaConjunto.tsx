import type { Idioma } from "@/lib/i18n";

/**
 * LÁMINA 00 — EL CONJUNTO. Las dos zonas en una sola vista.
 *
 * Daniel: "quiero uno donde esté todo, la zona 1 y 2 por fa".
 *
 * LA PALAPA, CORREGIDA. Las láminas del exterior la dibujan como 134 × 30 ft,
 * un rectángulo largo paralelo al paseo. La foto aérea del predio muestra un
 * bloque CASI CUADRADO rodeado de palmeras. Las dos no pueden ser ciertas, y la
 * mala es la nuestra: 134 × 30 salió de repartir los ~4.000 ft² declarados sin
 * mirar la forma.
 *
 * Aquí se mantiene la MISMA fuente —los ~4.000 ft² del propietario— y se cambia
 * el supuesto de forma por el que enseña la foto: √4.000 ≈ 63, o sea ≈ 63 × 63.
 * Sigue siendo una estimación y está rotulada como tal, pero es fiel a la única
 * evidencia visual que existe del predio.
 *
 * Escala propia: el conjunto mide ~380 ft de largo y a 1.79 u/ft no cabría en
 * una lámina legible. Las de zona siguen a 1.79.
 */

const U = 1.05;
const K = 0.866;

function p(xf: number, yf: number, zf = 0): [number, number] {
  const x = xf * U, y = yf * U, z = zf * U;
  return [(x - y) * K, (x + y) * 0.5 - z];
}
const poly = (...q: Array<[number, number]>) =>
  q.map((c, i) => `${i ? "L" : "M"}${c[0].toFixed(1)},${c[1].toFixed(1)}`).join(" ") + " Z";
const cTecho = (x: number, y: number, dx: number, dy: number, z: number) =>
  poly(p(x, y, z), p(x + dx, y, z), p(x + dx, y + dy, z), p(x, y + dy, z));
const cFrente = (x: number, y: number, dx: number, z0: number, z1: number) =>
  poly(p(x, y, z0), p(x + dx, y, z0), p(x + dx, y, z1), p(x, y, z1));
const cLado = (x: number, y: number, dy: number, z0: number, z1: number) =>
  poly(p(x, y, z0), p(x, y + dy, z0), p(x, y + dy, z1), p(x, y, z1));

// ---------------------------------------------------------------- geometría
const LOTE = { x: 0, y: 0, dx: 240, dy: 92 };          // exterior, ~22.000 ft²
const PALAPA = { x: 62, y: 15, dx: 63, dy: 63 };       // ≈ 63×63 — ver cabecera
const PASEO = { x: 0, y: 40, dx: 240, dy: 12 };
const EDIF = { x: 258, y: 1, dx: 118, dy: 90 };        // el edificio, zona 02
const H_ALERO = 11, H_CUMBRE = 26, H1 = 12, H2 = 22;

const XS = [p(LOTE.x, LOTE.y + LOTE.dy)[0], p(EDIF.x + EDIF.dx, 0)[0]];
const YS = [p(0, 0, H2)[1], p(EDIF.x + EDIF.dx, LOTE.dy)[1]];
const VB = { x: XS[0] - 46, y: YS[0] - 74, w: XS[1] - XS[0] + 108, h: YS[1] - YS[0] + 128 };

function Palmera({ xf, yf }: { xf: number; yf: number }) {
  const [x, y] = p(xf, yf, 0);
  return (
    <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)})`} opacity="0.85">
      <line x1="0" y1="0" x2="0" y2="-13" stroke="#8a8071" strokeWidth="0.8" />
      {[-1.15, -0.62, 0, 0.62, 1.15].map((a, i) => (
        <path key={i}
              d={`M0,-13 q${(Math.sin(a) * 6).toFixed(1)},${(-2.6 - Math.abs(Math.cos(a)) * 1.6).toFixed(1)} ${(Math.sin(a) * 10).toFixed(1)},${(0.6 + Math.abs(Math.cos(a))).toFixed(1)}`}
              fill="none" stroke="#7d725f" strokeWidth="0.65" />
      ))}
    </g>
  );
}

function Persona({ xf, yf, zf = 0, o = 0.55 }: { xf: number; yf: number; zf?: number; o?: number }) {
  const [x, y] = p(xf, yf, zf);
  return (
    <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)})`} opacity={o}>
      <circle cx="0" cy="-6.6" r="1.35" fill="#5c5445" />
      <path d="M0,-5.3 L0,-2.1 M0,-4.5 L-1.5,-3.1 M0,-4.5 L1.5,-3.1 M0,-2.1 L-1.2,0 M0,-2.1 L1.2,0"
            stroke="#5c5445" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    </g>
  );
}

function Cartela({ anclaje, hacia, titulo, dato, tono = "#211c15" }:
  { anclaje: [number, number]; hacia: [number, number]; titulo: string; dato?: string; tono?: string }) {
  const [ax, ay] = anclaje, [bx, by] = hacia;
  const w = Math.max(titulo.length * 5.4, dato ? dato.length * 5.2 : 0) + 14;
  return (
    <g>
      <line x1={ax} y1={ay} x2={bx} y2={by} stroke={tono} strokeWidth="0.65" />
      <circle cx={ax} cy={ay} r="1.7" fill={tono} />
      <rect x={bx} y={by - 25} width={w} height={14} fill={tono} />
      <text x={bx + 7} y={by - 15} fill="#f8f3ea" fontFamily="ui-monospace,monospace"
            fontSize="7.8" letterSpacing="1.5">{titulo}</text>
      {dato && (
        <>
          <rect x={bx} y={by - 11} width={w} height={12} fill="#f8f3ea"
                stroke={tono} strokeWidth="0.6" />
          <text x={bx + 7} y={by - 2} fill="#211c15" fontFamily="ui-monospace,monospace"
                fontSize="7.2" letterSpacing="1.2">{dato}</text>
        </>
      )}
    </g>
  );
}

function Cota({ a, b, texto, color = "#7d725f", dy = 0 }:
  { a: [number, number]; b: [number, number]; texto: string; color?: string; dy?: number }) {
  const [x1, y1] = a, [x2, y2] = b;
  const an = Math.atan2(y2 - y1, x2 - x1), f = 4.2;
  const pt = (x: number, y: number, s: number) =>
    `M${(x + Math.cos(an + 0.38) * f * s).toFixed(1)},${(y + Math.sin(an + 0.38) * f * s).toFixed(1)} ` +
    `L${x.toFixed(1)},${y.toFixed(1)} ` +
    `L${(x + Math.cos(an - 0.38) * f * s).toFixed(1)},${(y + Math.sin(an - 0.38) * f * s).toFixed(1)}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="0.6" />
      <path d={pt(x1, y1, 1)} fill="none" stroke={color} strokeWidth="0.6" />
      <path d={pt(x2, y2, -1)} fill="none" stroke={color} strokeWidth="0.6" />
      <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 + dy} fill={color}
            fontFamily="ui-monospace,monospace" fontSize="7" letterSpacing="1"
            textAnchor="middle">{texto}</text>
    </g>
  );
}

export default function LaminaConjunto({ lang }: { lang: Idioma }) {
  const es = lang === "es";

  const palmeras: Array<[number, number]> = [];
  for (let x = 14; x < 236; x += 15) { palmeras.push([x, 33]); palmeras.push([x, 60]); }

  const pilaresE: Array<[number, number]> = [];
  for (let x = EDIF.x; x <= EDIF.x + EDIF.dx; x += 30)
    for (let y = EDIF.y; y <= EDIF.y + EDIF.dy; y += 30) pilaresE.push([x, y]);

  return (
    <section aria-label={es ? "Lámina 00 — el conjunto" : "Plate 00 — the whole site"}
             style={{ background: "transparent" }}>
      <div className="reja" style={{ paddingBlock: "34px 56px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap",
                      paddingBottom: 14, borderBottom: "1px solid var(--regla)" }}>
          <div className="ojo" style={{ color: "var(--tinta-2)" }}>
            {es ? "Lámina 00 — El conjunto" : "Plate 00 — The whole site"}
          </div>
          <div className="ojo">
            {es ? "Las dos zonas · esquema volumétrico" : "Both zones · volumetric diagram"}
          </div>
        </div>

        <figure style={{ margin: "26px 0 0" }}>
          <svg viewBox={`${VB.x.toFixed(0)} ${VB.y.toFixed(0)} ${VB.w.toFixed(0)} ${VB.h.toFixed(0)}`}
               role="img"
               aria-label={es
                 ? "Isométrica del conjunto: a la izquierda el jardín con la palapa techada, a la derecha el edificio de dos niveles"
                 : "Isometric of the whole site: the garden with the covered structure on the left, the two-level building on the right"}
               style={{ width: "100%", height: "auto", display: "block" }}>
            <defs>
              <pattern id="cesped" width="7" height="7" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.5" fill="#a8b394" />
              </pattern>
              <pattern id="pavim" width="9" height="9" patternUnits="userSpaceOnUse">
                <path d="M0,0 H9 M0,0 V9" stroke="#c6beb0" strokeWidth="0.35" />
              </pattern>
              <pattern id="paja" width="4" height="4" patternTransform="rotate(38)"
                       patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="4" stroke="#b5a888" strokeWidth="0.7" />
              </pattern>
              <pattern id="alto" width="5" height="5" patternTransform="rotate(45)"
                       patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="5" stroke="#c4772b" strokeWidth="0.5" opacity="0.5" />
              </pattern>
            </defs>

            {/* ================= ZONA 01 · EXTERIOR ================= */}
            <path d={cTecho(LOTE.x, LOTE.y, LOTE.dx, LOTE.dy, 0)} fill="#eef0e4"
                  stroke="#7d725f" strokeWidth="0.7" />
            <path d={cTecho(LOTE.x, LOTE.y, LOTE.dx, LOTE.dy, 0)} fill="url(#cesped)" />
            <path d={cTecho(PASEO.x, PASEO.y, PASEO.dx, PASEO.dy, 0.2)} fill="#f4efe4"
                  stroke="#a29784" strokeWidth="0.5" />
            <path d={cTecho(PASEO.x, PASEO.y, PASEO.dx, PASEO.dy, 0.2)} fill="url(#pavim)" />

            {/* seto perimetral */}
            <path d={cFrente(LOTE.x, LOTE.y + LOTE.dy, LOTE.dx, 0, 3.4)} fill="#cfd6bd"
                  stroke="#8a8071" strokeWidth="0.5" />

            {palmeras.map(([x, y], i) => <Palmera key={i} xf={x} yf={y} />)}

            {/* --- la palapa, ≈63×63 --- */}
            {[PALAPA.x, PALAPA.x + PALAPA.dx].map((x) =>
              [PALAPA.y, PALAPA.y + PALAPA.dy].map((y) => {
                const [ax, ay] = p(x, y, 0), [bx, by] = p(x, y, H_ALERO);
                return <line key={`${x}-${y}`} x1={ax} y1={ay} x2={bx} y2={by}
                             stroke="#695f4f" strokeWidth="1" />;
              }))}
            {(() => {
              const cx = PALAPA.x + PALAPA.dx / 2, cy = PALAPA.y + PALAPA.dy / 2;
              const [a] = [p(PALAPA.x, PALAPA.y, H_ALERO)];
              const b = p(PALAPA.x + PALAPA.dx, PALAPA.y, H_ALERO);
              const c = p(PALAPA.x + PALAPA.dx, PALAPA.y + PALAPA.dy, H_ALERO);
              const dd = p(PALAPA.x, PALAPA.y + PALAPA.dy, H_ALERO);
              const cum = p(cx, cy, H_CUMBRE);
              const faldon = (u: [number, number], v: [number, number]) =>
                `M${u[0]},${u[1]} L${v[0]},${v[1]} L${cum[0]},${cum[1]} Z`;
              return (
                <g>
                  <path d={faldon(a, b)} fill="#ddd0ac" stroke="#695f4f" strokeWidth="0.7" />
                  <path d={faldon(b, c)} fill="#d3c49c" stroke="#695f4f" strokeWidth="0.7" />
                  <path d={faldon(c, dd)} fill="#e6dcbe" stroke="#695f4f" strokeWidth="0.7" />
                  <path d={faldon(a, b)} fill="url(#paja)" opacity="0.55" />
                  <path d={faldon(b, c)} fill="url(#paja)" opacity="0.55" />
                  <path d={faldon(c, dd)} fill="url(#paja)" opacity="0.4" />
                </g>
              );
            })()}

            {[[40, 25], [52, 62], [150, 46], [175, 34], [196, 58], [96, 46], [110, 68]]
              .map(([x, y], i) => <Persona key={i} xf={x} yf={y} />)}

            {/* ================= ZONA 02 · EDIFICIO ================= */}
            <path d={cTecho(EDIF.x, EDIF.y, EDIF.dx, EDIF.dy, 0)} fill="#f2ece1"
                  stroke="#7d725f" strokeWidth="0.6" />
            {pilaresE.map(([x, y], i) => {
              const alto = x >= EDIF.x + 70 ? H2 : H1;
              const [ax, ay] = p(x, y, 0), [bx, by] = p(x, y, alto);
              return <line key={i} x1={ax} y1={ay} x2={bx} y2={by} stroke="#5c5445" strokeWidth="0.85" />;
            })}
            <path d={cFrente(EDIF.x, EDIF.y + EDIF.dy, 70, 0, H1)} fill="#e6dfd2"
                  stroke="#211c15" strokeWidth="0.75" />
            <path d={cFrente(EDIF.x + 70, EDIF.y + EDIF.dy, EDIF.dx - 70, 0, H2)} fill="#e0d8ca"
                  stroke="#211c15" strokeWidth="0.75" />
            <path d={cLado(EDIF.x + EDIF.dx, EDIF.y, EDIF.dy, 0, H2)} fill="#d8cfbe"
                  stroke="#211c15" strokeWidth="0.75" />
            {/* forjado del nivel 02 */}
            <path d={cTecho(EDIF.x, EDIF.y, 70, EDIF.dy, H1)} fill="#efe8dc"
                  stroke="#211c15" strokeWidth="0.8" />
            {[0, 1, 2, 3, 4].map((i) => (
              <g key={i}>
                <path d={cTecho(EDIF.x + 6 + i * 12, EDIF.y + 12, 9, 30, H1 + 8)}
                      fill="#fdfaf4" stroke="#211c15" strokeWidth="0.55" />
                <path d={cFrente(EDIF.x + 6 + i * 12, EDIF.y + 42, 9, H1, H1 + 8)}
                      fill="#efe7d9" stroke="#211c15" strokeWidth="0.55" />
              </g>
            ))}
            {/* doble altura */}
            <path d={cTecho(EDIF.x + 70, EDIF.y, EDIF.dx - 70, EDIF.dy, 0.3)} fill="url(#alto)" />
            <path d={cTecho(EDIF.x + 70, EDIF.y, EDIF.dx - 70, EDIF.dy, H2)} fill="none"
                  stroke="#211c15" strokeWidth="0.8" />
            {[[EDIF.x + 90, 30], [EDIF.x + 104, 58], [EDIF.x + 30, 60]]
              .map(([x, y], i) => <Persona key={`e${i}`} xf={x} yf={y} />)}

            {/* ================= COTAS ================= */}
            <Cota a={p(LOTE.x, LOTE.dy + 14, 0)} b={p(LOTE.dx, LOTE.dy + 14, 0)}
                  texto={es ? "≈ 240 FT · 73 M" : "≈ 240 FT · 73 M"} dy={11} />
            <Cota a={p(EDIF.x, LOTE.dy + 14, 0)} b={p(EDIF.x + EDIF.dx, LOTE.dy + 14, 0)}
                  texto="≈ 130 FT" dy={11} />
            <Cota a={p(LOTE.dx + 12, LOTE.y, 0)} b={p(LOTE.dx + 12, LOTE.dy, 0)}
                  texto="≈ 92 FT" dy={10} />
            <Cota a={p(PALAPA.x, PALAPA.y - 9, 0)} b={p(PALAPA.x + PALAPA.dx, PALAPA.y - 9, 0)}
                  texto="≈ 63 FT" color="#c4772b" dy={-7} />

            {/* ================= CARTELAS ================= */}
            <Cartela anclaje={p(PALAPA.x + 30, PALAPA.y + 30, H_CUMBRE * 0.72)}
                     hacia={[VB.x + 84, VB.y + 62]}
                     titulo={es ? "TIKI HUT" : "TIKI HUT"} dato="~4 000 ft² / 372 m²" />
            <Cartela anclaje={p(180, 70, 0)} hacia={[VB.x + 250, VB.y + VB.h - 46]}
                     titulo={es ? "EL JARDÍN" : "THE GARDEN"} dato="~18 000 ft² / 1 672 m²" />
            <Cartela anclaje={p(EDIF.x + 96, 44, H2 * 0.55)}
                     hacia={[VB.x + VB.w - 168, VB.y + 46]}
                     titulo={es ? "EL EDIFICIO" : "THE BUILDING"}
                     dato={es ? "2 niveles · 22 ft libres" : "2 levels · 22 ft clear"} />

            {/* separación entre zonas */}
            {(() => {
              const a = p(248, -6, 0), b = p(248, LOTE.dy + 6, 0);
              return <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#a29784"
                           strokeWidth="0.7" strokeDasharray="5 4" />;
            })()}
            <text {...(() => { const [x, y] = p(140, -14, 0); return { x, y }; })()}
                  fontFamily="ui-monospace,monospace" fontSize="7.6" letterSpacing="1.6" fill="#7d725f">
              {es ? "ZONA 01 · EXTERIOR" : "ZONE 01 · OUTDOOR"}
            </text>
            <text {...(() => { const [x, y] = p(300, -14, 0); return { x, y }; })()}
                  fontFamily="ui-monospace,monospace" fontSize="7.6" letterSpacing="1.6" fill="#7d725f">
              {es ? "ZONA 02 · EDIFICIO" : "ZONE 02 · BUILDING"}
            </text>

            {/* cajetín */}
            <g fontFamily="ui-monospace,monospace" letterSpacing="1.6">
              <line x1={VB.x + 14} y1={VB.y + 24} x2={VB.x + 140} y2={VB.y + 24}
                    stroke="#211c15" strokeWidth="0.8" />
              <text x={VB.x + 14} y={VB.y + 38} fontSize="9.4" fill="#211c15">CLUB WYNWOOD</text>
              <text x={VB.x + 14} y={VB.y + 50} fontSize="7.2" fill="#7d725f">
                {es ? "EL CONJUNTO · ZONAS 01 Y 02" : "THE WHOLE SITE · ZONES 01 AND 02"}
              </text>
              <text x={VB.x + 14} y={VB.y + 61} fontSize="7.2" fill="#7d725f">
                {es ? "LÁMINA 00 · SIN ESCALA" : "PLATE 00 · NOT TO SCALE"}
              </text>
            </g>

            <g transform={`translate(${VB.x + 14},${VB.y + VB.h - 24})`}>
              <text x="0" y="-7" fontFamily="ui-monospace,monospace" fontSize="7"
                    letterSpacing="1.4" fill="#7d725f">
                {es ? "ESCALA GRÁFICA" : "GRAPHIC SCALE"}
              </text>
              {[0, 1, 2].map((i) => (
                <rect key={i} x={i * 26} y="0" width="26" height="4.2"
                      fill={i % 2 ? "#f8f3ea" : "#211c15"} stroke="#211c15" strokeWidth="0.45" />
              ))}
              <text x="0" y="13" fontFamily="ui-monospace,monospace" fontSize="6.5" fill="#7d725f">0</text>
              <text x="64" y="13" fontFamily="ui-monospace,monospace" fontSize="6.5" fill="#7d725f">75 FT</text>
            </g>

            <g transform={`translate(${VB.x + VB.w - 30},${VB.y + 32})`}>
              <path d="M0,17 L0,-11 M-3.4,-4 L0,-12 L3.4,-4" fill="none"
                    stroke="#211c15" strokeWidth="0.9" />
              <text x="-2.6" y="28" fontFamily="ui-monospace,monospace" fontSize="8" fill="#7d725f">N</text>
            </g>
          </svg>

          <figcaption className="ojo" style={{ paddingTop: 16, lineHeight: 1.75, maxWidth: "78ch" }}>
            {es
              ? "Esquema volumétrico aproximado — no es un plano a escala. La palapa se dibuja aquí como ≈ 63 × 63 ft: mantiene los ~4 000 ft² declarados por el propietario y corrige la forma según la foto aérea del predio, donde se ve un bloque casi cuadrado y no el rectángulo largo de las láminas anteriores. La posición relativa del edificio y las cotas del lote se confirman en la visita técnica."
              : "Approximate volumetric diagram — not to scale. The structure is drawn here as ≈ 63 × 63 ft: it keeps the ~4,000 sq ft declared by the owner and corrects the shape against the site's aerial photograph, which shows a near-square mass rather than the long rectangle of the earlier plates. The building's relative position and the lot dimensions are confirmed at the technical visit."}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

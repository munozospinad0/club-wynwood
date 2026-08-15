import { crearGeo } from "@/lib/iso";
import type { Idioma } from "@/lib/i18n";

/**
 * LÁMINA 00 — EL CONJUNTO.
 *
 * Daniel, sobre la versión anterior: "no se ve todo mal pero no es muy claro,
 * siento que no se puede ver, no se entiende con facilidad, ese es el problema".
 *
 * Diagnóstico, y es incómodo porque es culpa mía: le estuve metiendo detalle
 * porque me lo pedía, y el motivo de que no se entendiera era exactamente ese.
 * Todo estaba en el mismo tono crema y con la misma línea —suelo, césped,
 * treinta palmeras iguales, palapa, edificio, cotas— así que no había figura y
 * fondo. Cuando todo pesa igual, no se lee nada.
 *
 * ESTA VERSIÓN NO AÑADE: EDITA.
 *   · Tres niveles de valor y nada más: el suelo casi blanco, los volúmenes
 *     techados en tinta, y las cotas en gris. Lo que tiene techo se ve oscuro,
 *     que es la información que de verdad importa aquí.
 *   · Las palmeras bajan de ~30 a 12 y solo van donde están de verdad: dos
 *     hileras flanqueando el paseo.
 *   · La palapa se dibuja como CUBIERTA: alero marcado, limatesas y sombra
 *     proyectada. Antes se leía como una carpa plana.
 *   · Las cartelas salen del dibujo y van en columna, sin cruzarse con nada.
 *   · El edificio se acerca al lote: separados 40 ft parecían dos propiedades.
 *
 * La palapa va a ≈ 63 × 63 ft: mantiene los ~4.000 ft² declarados y corrige la
 * forma según la foto aérea, donde es un bloque casi cuadrado y no el
 * rectángulo largo de las láminas del exterior.
 */

const U = 1.12;
const LOTE = { dx: 240, dy: 92 };
const PALAPA = { x: 58, y: 14, dx: 63, dy: 63 };
const PASEO = { y: 40, dy: 12 };
const EDIF = { x: 256, dx: 118, dy: 90 };
const H_ALERO = 11, H_CUMBRE = 26, H1 = 12, H2 = 22;
const TOTAL_X = EDIF.x + EDIF.dx;

export default function LaminaConjunto({ lang }: { lang: Idioma }) {
  const es = lang === "es";
  const g = crearGeo(U, TOTAL_X / 2, LOTE.dy / 2, 0);
  const { p, techo, frente, lado } = g;
  // La caja de la proyección se derrama más hacia abajo que hacia arriba, y a
  // la derecha hay que dejar sitio para la columna de cartelas. Margen a medida
  // en vez de uno igual en los cuatro lados.
  const base = g.caja(TOTAL_X, LOTE.dy, H_CUMBRE, 0);
  const VB = {
    x: base.x - 56,
    y: base.y - 78,
    w: base.w + 56 + 232,
    h: base.h + 78 + 56,
  };

  // Solo donde están de verdad: dos hileras flanqueando el paseo.
  const palmeras: Array<[number, number]> = [];
  for (let i = 0; i < 6; i++) {
    palmeras.push([26 + i * 36, PASEO.y - 7]);
    palmeras.push([44 + i * 36, PASEO.y + PASEO.dy + 7]);
  }

  const Palma = ({ x, y }: { x: number; y: number }) => {
    const [a, b] = p(x, y, 0);
    return (
      <g transform={`translate(${a.toFixed(1)},${b.toFixed(1)})`}>
        <ellipse cx="0" cy="1" rx="4.6" ry="1.7" fill="#211c15" opacity="0.07" />
        <line x1="0" y1="0" x2="0" y2="-15" stroke="#8a8071" strokeWidth="0.9" />
        {[-1.2, -0.6, 0, 0.6, 1.2].map((t, i) => (
          <path key={i}
                d={`M0,-15 q${(Math.sin(t) * 6.4).toFixed(1)},${(-3 - Math.abs(Math.cos(t)) * 1.8).toFixed(1)} ${(Math.sin(t) * 11).toFixed(1)},${(0.8 + Math.abs(Math.cos(t)) * 1.2).toFixed(1)}`}
                fill="none" stroke="#6f6656" strokeWidth="0.8" strokeLinecap="round" />
        ))}
      </g>
    );
  };

  const Gente = ({ x, y, z = 0 }: { x: number; y: number; z?: number }) => {
    const [a, b] = p(x, y, z);
    return (
      <g transform={`translate(${a.toFixed(1)},${b.toFixed(1)})`} opacity="0.5">
        <circle cx="0" cy="-6.4" r="1.3" fill="#3e3a34" />
        <path d="M0,-5.2 L0,-2 M0,-4.4 L-1.5,-3 M0,-4.4 L1.5,-3 M0,-2 L-1.2,0 M0,-2 L1.2,0"
              stroke="#3e3a34" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      </g>
    );
  };

  /** Cartelas en columna, fuera del dibujo. Antes se cruzaban con el cajetín. */
  const Ficha = ({ y, titulo, dato, ancla }:
    { y: number; titulo: string; dato: string; ancla: [number, number] }) => {
    const x = VB.x + VB.w - 208;
    return (
      <g>
        <line x1={ancla[0]} y1={ancla[1]} x2={x} y2={y + 7} stroke="#211c15" strokeWidth="0.6" />
        <circle cx={ancla[0]} cy={ancla[1]} r="1.9" fill="#211c15" />
        <rect x={x} y={y} width="196" height="15" fill="#211c15" />
        <text x={x + 8} y={y + 11} fill="#f8f3ea" fontFamily="ui-monospace,monospace"
              fontSize="8.2" letterSpacing="1.6">{titulo}</text>
        <rect x={x} y={y + 15} width="196" height="13" fill="#f8f3ea" stroke="#211c15" strokeWidth="0.6" />
        <text x={x + 8} y={y + 25} fill="#211c15" fontFamily="ui-monospace,monospace"
              fontSize="7.6" letterSpacing="1.2">{dato}</text>
      </g>
    );
  };

  const Cota = ({ a, b, txt, dy = 0 }:
    { a: [number, number]; b: [number, number]; txt: string; dy?: number }) => {
    const an = Math.atan2(b[1] - a[1], b[0] - a[0]), f = 4;
    const pt = (q: [number, number], s: number) =>
      `M${(q[0] + Math.cos(an + 0.36) * f * s).toFixed(1)},${(q[1] + Math.sin(an + 0.36) * f * s).toFixed(1)} ` +
      `L${q[0].toFixed(1)},${q[1].toFixed(1)} ` +
      `L${(q[0] + Math.cos(an - 0.36) * f * s).toFixed(1)},${(q[1] + Math.sin(an - 0.36) * f * s).toFixed(1)}`;
    return (
      <g opacity="0.75">
        <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#8a8071" strokeWidth="0.55" />
        <path d={pt(a, 1)} fill="none" stroke="#8a8071" strokeWidth="0.55" />
        <path d={pt(b, -1)} fill="none" stroke="#8a8071" strokeWidth="0.55" />
        <text x={(a[0] + b[0]) / 2} y={(a[1] + b[1]) / 2 + dy} fill="#8a8071"
              fontFamily="ui-monospace,monospace" fontSize="7" letterSpacing="1"
              textAnchor="middle">{txt}</text>
      </g>
    );
  };

  // Vértices de la cubierta a cuatro aguas.
  const A = p(PALAPA.x, PALAPA.y, H_ALERO);
  const B = p(PALAPA.x + PALAPA.dx, PALAPA.y, H_ALERO);
  const C = p(PALAPA.x + PALAPA.dx, PALAPA.y + PALAPA.dy, H_ALERO);
  const D = p(PALAPA.x, PALAPA.y + PALAPA.dy, H_ALERO);
  const CUM = p(PALAPA.x + PALAPA.dx / 2, PALAPA.y + PALAPA.dy / 2, H_CUMBRE);
  const faldon = (u: [number, number], v: [number, number]) =>
    `M${u[0]},${u[1]} L${v[0]},${v[1]} L${CUM[0]},${CUM[1]} Z`;

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
            {es ? "Lo que tiene techo, en tinta" : "What has a roof, in ink"}
          </div>
        </div>

        <figure style={{ margin: "26px 0 0" }}>
          <svg viewBox={`${VB.x.toFixed(0)} ${VB.y.toFixed(0)} ${VB.w.toFixed(0)} ${VB.h.toFixed(0)}`}
               role="img"
               aria-label={es
                 ? "Isométrica del conjunto: el jardín con la palapa techada y, a su derecha, el edificio de dos niveles"
                 : "Isometric of the whole site: the garden with its covered structure and, to the right, the two-level building"}
               style={{ width: "100%", height: "auto", display: "block" }}>

          {/* ---------- SUELO: casi blanco, sin trama. Es el fondo. ---------- */}
          <path d={techo(0, 0, LOTE.dx, LOTE.dy, 0)} fill="#f6f3ea" stroke="#c6beb0" strokeWidth="0.8" />
          <path d={techo(0, PASEO.y, LOTE.dx, PASEO.dy, 0.1)} fill="#ece5d6" stroke="none" />
          <path d={techo(EDIF.x, 0, EDIF.dx, EDIF.dy, 0)} fill="#f6f3ea" stroke="#c6beb0" strokeWidth="0.8" />

          {/* sombra de los volúmenes: da asiento y separa figura de fondo */}
          <path d={techo(PALAPA.x + 4, PALAPA.y + 4, PALAPA.dx, PALAPA.dy, 0.05)}
                fill="#211c15" opacity="0.08" />
          <path d={techo(EDIF.x + 4, 4, EDIF.dx, EDIF.dy, 0.05)} fill="#211c15" opacity="0.08" />

          {palmeras.map(([x, y], i) => <Palma key={i} x={x} y={y} />)}
          {[[36, 30], [96, 62], [150, 46], [186, 34], [214, 60]].map(([x, y], i) =>
            <Gente key={i} x={x} y={y} />)}

          {/* ---------- LA PALAPA: cubierta en tinta ---------- */}
          {[[PALAPA.x, PALAPA.y], [PALAPA.x + PALAPA.dx, PALAPA.y],
            [PALAPA.x + PALAPA.dx, PALAPA.y + PALAPA.dy], [PALAPA.x, PALAPA.y + PALAPA.dy]]
            .map(([x, y], i) => {
              const a = p(x, y, 0), b = p(x, y, H_ALERO);
              return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
                           stroke="#3e3a34" strokeWidth="1.3" />;
            })}
          <path d={faldon(A, B)} fill="#6f6656" stroke="#211c15" strokeWidth="1" strokeLinejoin="round" />
          <path d={faldon(B, C)} fill="#5c5445" stroke="#211c15" strokeWidth="1" strokeLinejoin="round" />
          <path d={faldon(C, D)} fill="#857a66" stroke="#211c15" strokeWidth="1" strokeLinejoin="round" />
          {/* alero: la línea que hace que se lea como techo y no como carpa */}
          <path d={`M${A[0]},${A[1]} L${B[0]},${B[1]} L${C[0]},${C[1]} L${D[0]},${D[1]} Z`}
                fill="none" stroke="#211c15" strokeWidth="1.4" strokeLinejoin="round" />

          {/* ---------- EL EDIFICIO: sólido, en tinta ---------- */}
          <path d={frente(EDIF.x, EDIF.dy, 70, 0, H1)} fill="#8f8574" stroke="#211c15" strokeWidth="1" />
          <path d={frente(EDIF.x + 70, EDIF.dy, EDIF.dx - 70, 0, H2)} fill="#7d725f" stroke="#211c15" strokeWidth="1" />
          <path d={lado(EDIF.x + EDIF.dx, 0, EDIF.dy, 0, H2)} fill="#6b6152" stroke="#211c15" strokeWidth="1" />
          <path d={techo(EDIF.x, 0, 70, EDIF.dy, H1)} fill="#a89d88" stroke="#211c15" strokeWidth="1" />
          <path d={techo(EDIF.x + 70, 0, EDIF.dx - 70, EDIF.dy, H2)} fill="#b8ad97" stroke="#211c15" strokeWidth="1" />
          {/* las cinco salas, apenas insinuadas: aquí no son el tema */}
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={techo(EDIF.x + 8 + i * 12, 14, 9, 30, H1 + 0.1)}
                  fill="none" stroke="#f8f3ea" strokeWidth="0.6" opacity="0.55" />
          ))}

          {/* ---------- COTAS, en gris y al fondo ---------- */}
          <Cota a={p(0, LOTE.dy + 13, 0)} b={p(LOTE.dx, LOTE.dy + 13, 0)} txt="≈ 240 FT · 73 M" dy={11} />
          <Cota a={p(LOTE.dx + 11, 0, 0)} b={p(LOTE.dx + 11, LOTE.dy, 0)} txt="≈ 92 FT" dy={10} />
          <Cota a={p(EDIF.x, LOTE.dy + 13, 0)} b={p(TOTAL_X, LOTE.dy + 13, 0)} txt="≈ 130 FT" dy={11} />

          {/* ---------- CARTELAS, en columna y fuera del dibujo ---------- */}
          <Ficha y={VB.y + 40} titulo={es ? "ZONA 01 · EL JARDÍN" : "ZONE 01 · THE GARDEN"}
                 dato="~18 000 ft² / 1 672 m²" ancla={p(170, 66, 0)} />
          <Ficha y={VB.y + 88} titulo={es ? "ZONA 01 · TIKI HUT" : "ZONE 01 · TIKI HUT"} dato="~4 000 ft² / 372 m²"
                 ancla={[CUM[0], CUM[1] + 6]} />
          <Ficha y={VB.y + 136} titulo={es ? "ZONA 02 · EL EDIFICIO" : "ZONE 02 · THE BUILDING"}
                 dato={es ? "2 niveles · 22 ft libres" : "2 levels · 22 ft clear"}
                 ancla={p(EDIF.x + 100, 44, H2)} />

          {/* ---------- CAJETÍN ---------- */}
          <g fontFamily="ui-monospace,monospace" letterSpacing="1.6">
            <line x1={VB.x + 14} y1={VB.y + 24} x2={VB.x + 148} y2={VB.y + 24}
                  stroke="#211c15" strokeWidth="0.9" />
            <text x={VB.x + 14} y={VB.y + 39} fontSize="10" fill="#211c15">CLUB WYNWOOD</text>
            <text x={VB.x + 14} y={VB.y + 52} fontSize="7.4" fill="#8a8071">
              {es ? "EL CONJUNTO · ZONAS 01 Y 02" : "THE WHOLE SITE · ZONES 01 AND 02"}
            </text>
            <text x={VB.x + 14} y={VB.y + 63} fontSize="7.4" fill="#8a8071">
              {es ? "LÁMINA 00 · SIN ESCALA" : "PLATE 00 · NOT TO SCALE"}
            </text>
          </g>

          <g transform={`translate(${VB.x + 14},${VB.y + VB.h - 22})`}>
            {[0, 1, 2].map((i) => (
              <rect key={i} x={i * 26} y="0" width="26" height="4.2"
                    fill={i % 2 ? "#f8f3ea" : "#211c15"} stroke="#211c15" strokeWidth="0.45" />
            ))}
            <text x="0" y="13" fontFamily="ui-monospace,monospace" fontSize="6.6" fill="#8a8071">0</text>
            <text x="60" y="13" fontFamily="ui-monospace,monospace" fontSize="6.6" fill="#8a8071">75 FT</text>
          </g>

          <g transform={`translate(${VB.x + VB.w - 232},${VB.y + 26})`}>
            <path d="M0,16 L0,-11 M-3.2,-4 L0,-12 L3.2,-4" fill="none" stroke="#211c15" strokeWidth="1" />
            <text x="-2.5" y="27" fontFamily="ui-monospace,monospace" fontSize="8" fill="#8a8071">N</text>
          </g>
        </svg>

        <figcaption className="ojo" style={{ paddingTop: 16, lineHeight: 1.75, maxWidth: "78ch" }}>
          {es
            ? "Esquema volumétrico aproximado — no es un plano a escala. Lo techado se dibuja en tinta y lo abierto en claro. La palapa va como ≈ 63 × 63 ft: mantiene los ~4 000 ft² declarados por el propietario y corrige la forma según la foto aérea, donde se ve un bloque casi cuadrado. La posición relativa del edificio se confirma en la visita técnica."
            : "Approximate volumetric diagram — not to scale. Roofed volumes are drawn in ink, open ground in light tone. The structure is drawn as ≈ 63 × 63 ft: it keeps the ~4,000 sq ft declared by the owner and corrects the shape against the aerial photograph, which shows a near-square mass. The building's relative position is confirmed at the technical visit."}
        </figcaption>
      </figure>
      </div>
    </section>
  );
}

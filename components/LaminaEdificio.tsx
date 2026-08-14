import { COTAS, NIVEL_02, totalInmueble } from "@/lib/edificio";
import type { Idioma } from "@/lib/i18n";

/**
 * LÁMINA 05 — EL EDIFICIO. Isométrica, al mismo nivel de detalle que las del
 * exterior.
 *
 * Daniel: "tiene que tener el mismo detalle de como hicimos la parte exterior".
 * Tenía razón: lo anterior era un esquema de secciones y al lado de las
 * isométricas del jardín se veía pobre.
 *
 * PROYECCIÓN, la misma que las láminas del exterior para que el conjunto se lea
 * como una sola serie:
 *     sx = (x − y) · 0.866
 *     sy = (x + y) · 0.5 − z
 * Escala 1 ft ≈ 1.79 u, también la misma. Eso importa: cuando exista la lámina
 * maestra del predio completo, el edificio ya estará dibujado a la escala de la
 * palapa y del jardín y encajará sin rehacerlo.
 *
 * QUÉ SE DIBUJA: el cascarón. Losas, retícula de pilares, el vacío a doble
 * altura, las cinco salas del nivel 02, cocina y servicios.
 * QUÉ NO: ni una atracción del operador. Ver lib/edificio.ts.
 *
 * Server Component: sin estado ni JavaScript, así que las cotas y los rótulos
 * llegan en el HTML servido.
 */

const U = 1.79;                 // unidades por pie, igual que en el exterior
const K = 0.866;                // cos(30°)

/** Proyecta un punto (x, y, z) en pies a coordenadas de pantalla. */
function p(xf: number, yf: number, zf = 0): [number, number] {
  const x = xf * U, y = yf * U, z = zf * U;
  return [(x - y) * K, (x + y) * 0.5 - z];
}
const d = (...pts: Array<[number, number]>) =>
  pts.map((q, i) => `${i ? "L" : "M"}${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(" ") + " Z";

/** Cara superior de un prisma: es la que da la lectura de planta. */
const techo = (x0: number, y0: number, dx: number, dy: number, z: number) =>
  d(p(x0, y0, z), p(x0 + dx, y0, z), p(x0 + dx, y0 + dy, z), p(x0, y0 + dy, z));

/** Las dos caras verticales que se ven en esta orientación. */
const caraA = (x0: number, y0: number, dx: number, z0: number, z1: number) =>
  d(p(x0, y0, z0), p(x0 + dx, y0, z0), p(x0 + dx, y0, z1), p(x0, y0, z1));
const caraB = (x0: number, y0: number, dy: number, z0: number, z1: number) =>
  d(p(x0, y0, z0), p(x0, y0 + dy, z0), p(x0, y0 + dy, z1), p(x0, y0, z1));

// --- Geometría. Cotas leídas del plano de 2016, no deducidas. --------------
const ANCHO = 130;   // ft, fachada
const FONDO = 90;    // ft
const H1 = COTAS.alturaPlantaFt;   // 12
const H2 = COTAS.alturaDobleFt;    // 22
const CORTE = 74;    // ft: donde acaba el forjado del nivel 02 y empieza el vacío

/** Figura humana, para escala. La misma del exterior. */
function Persona({ xf, yf, zf = 0 }: { xf: number; yf: number; zf?: number }) {
  const [x, y] = p(xf, yf, zf);
  return (
    <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)})`} opacity="0.62">
      <circle cx="0" cy="-9.4" r="1.9" fill="#7d725f" />
      <path d="M0,-7.4 L0,-3 M0,-6.2 L-2,-4.4 M0,-6.2 L2,-4.4 M0,-3 L-1.7,0 M0,-3 L1.7,0"
            stroke="#7d725f" strokeWidth="1.1" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** Cota con flechas en los extremos, como en las láminas del exterior. */
function Cota({ a, b, texto, color = "#7d725f", desp = 0 }:
  { a: [number, number]; b: [number, number]; texto: string; color?: string; desp?: number }) {
  const [x1, y1] = a, [x2, y2] = b;
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const f = 5;
  const fl = (x: number, y: number, s: number) =>
    `M${(x + Math.cos(ang + 0.4) * f * s).toFixed(1)},${(y + Math.sin(ang + 0.4) * f * s).toFixed(1)} ` +
    `L${x.toFixed(1)},${y.toFixed(1)} ` +
    `L${(x + Math.cos(ang - 0.4) * f * s).toFixed(1)},${(y + Math.sin(ang - 0.4) * f * s).toFixed(1)}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="0.7" />
      <path d={fl(x1, y1, 1)} fill="none" stroke={color} strokeWidth="0.7" />
      <path d={fl(x2, y2, -1)} fill="none" stroke={color} strokeWidth="0.7" />
      <text x={mx} y={my + desp} fill={color} fontFamily="ui-monospace,monospace"
            fontSize="7" letterSpacing="0.9" textAnchor="middle">{texto}</text>
    </g>
  );
}

export default function LaminaEdificio({ lang }: { lang: Idioma }) {
  const es = lang === "es";
  const salas = NIVEL_02.filter((r) => r.duenio === "inmueble" && r.nombre.es.startsWith("Sala privada"));

  // Retícula de pilares, a 26 ft entre ejes.
  const pilares: Array<[number, number]> = [];
  for (let x = 0; x <= ANCHO; x += 26)
    for (let y = 0; y <= FONDO; y += 30) pilares.push([x, y]);

  return (
    <section
      id="interior"
      aria-label={es ? "Lámina 05 — el edificio" : "Plate 05 — the building"}
      style={{ background: "#eae4da", borderBottom: "1px solid var(--regla)" }}
    >
      <div className="reja" style={{ paddingBlock: 64 }}>
        {/* cabecera de lámina, igual que las del exterior */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24,
                      flexWrap: "wrap", paddingBottom: 14, borderBottom: "1px solid var(--regla)" }}>
          <div className="ojo" style={{ color: "var(--tinta-2)" }}>
            {es ? "Lámina 05 — El edificio" : "Plate 05 — The building"}
          </div>
          <div className="ojo">
            {es
              ? "Proyección isométrica · 1 ft ≈ 1.79 u · esquema volumétrico"
              : "Isometric projection · 1 ft ≈ 1.79 u · volumetric diagram"}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,220px) minmax(0,1fr)",
                      gap: 40, paddingTop: 30 }} data-lam="reja">

          {/* ---------------- barra lateral ---------------- */}
          <aside>
            <div className="ojo" style={{ paddingBottom: 12 }}>{es ? "Lectura" : "Readout"}</div>
            {[
              [es ? "Altura libre máx." : "Max clear height", `${H2} ft`],
              [es ? "Altura en planta" : "Ground-floor height", `${H1} ft`],
              [es ? "Salas privadas" : "Private rooms", `${salas.length}`],
              [es ? "Cocina" : "Kitchen", "580 ft²"],
              [es ? "Nivel 02" : "Level 02", `${totalInmueble(NIVEL_02)} ft²`],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12,
                                    padding: "9px 0", borderBottom: "1px solid var(--regla)" }}>
                <span className="ojo" style={{ fontSize: 9 }}>{k}</span>
                <span style={{ fontSize: 13 }}>{v}</span>
              </div>
            ))}

            <div className="ojo" style={{ padding: "22px 0 12px" }}>{es ? "Capas" : "Layers"}</div>
            {[
              es ? "Estructura" : "Structure",
              es ? "Losa nivel 02" : "Level 02 slab",
              es ? "Doble altura" : "Double height",
              es ? "Escala humana" : "Human scale",
              es ? "Cotas" : "Dimensions",
            ].map((c) => (
              <div key={c} style={{ display: "flex", gap: 10, alignItems: "center",
                                    padding: "8px 0", borderBottom: "1px solid var(--regla)" }}>
                <span style={{ width: 8, height: 8, background: "var(--tinta)", display: "inline-block" }} />
                <span className="ojo" style={{ fontSize: 9 }}>{c}</span>
              </div>
            ))}
          </aside>

          {/* ---------------- el dibujo ---------------- */}
          <figure style={{ margin: 0 }}>
            <svg viewBox="-215 -180 460 300" role="img"
                 aria-label={es
                   ? "Isométrica del edificio: dos niveles, retícula de pilares, zona a doble altura de 22 pies y cinco salas privadas en el nivel 02"
                   : "Isometric of the building: two levels, column grid, a 22-foot double-height zone and five private rooms on level 02"}
                 style={{ width: "100%", height: "auto", display: "block" }}>
              <defs>
                <pattern id="tramaDoble" width="6" height="6" patternTransform="rotate(45)"
                         patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="6" stroke="#c4772b" strokeWidth="0.6" opacity="0.5" />
                </pattern>
                <pattern id="tramaLosa" width="9" height="9" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="0.5" fill="#a29784" />
                </pattern>
              </defs>

              {/* losa de planta baja */}
              <path d={techo(0, 0, ANCHO, FONDO, 0)} fill="#f2ece1" stroke="#7d725f" strokeWidth="0.7" />
              <path d={techo(0, 0, ANCHO, FONDO, 0)} fill="url(#tramaLosa)" opacity="0.5" />

              {/* muros perimetrales hasta 12 ft */}
              <path d={caraA(0, FONDO, ANCHO, 0, H1)} fill="#e6dfd2" stroke="#7d725f" strokeWidth="0.7" />
              <path d={caraB(0, 0, FONDO, 0, H1)} fill="#ded6c7" stroke="#7d725f" strokeWidth="0.7" />

              {/* retícula de pilares */}
              {pilares.map(([x, y], i) => {
                const [ax, ay] = p(x, y, 0);
                const [bx, by] = p(x, y, x >= CORTE ? H2 : H1);
                return <line key={i} x1={ax} y1={ay} x2={bx} y2={by}
                             stroke="#695f4f" strokeWidth="0.9" opacity="0.85" />;
              })}

              {/* losa del nivel 02: solo hasta CORTE; el resto es el vacío */}
              <path d={techo(0, 0, CORTE, FONDO, H1)} fill="#efe8dc" stroke="#211c15" strokeWidth="0.9" />

              {/* cinco salas privadas sobre esa losa */}
              {salas.map((s, i) => {
                const x0 = 8 + i * 13, y0 = 14, dx = 10, dy = 26, hz = H1 + 9;
                return (
                  <g key={i}>
                    <path d={caraA(x0, y0 + dy, dx, H1, hz)} fill="#f8f3ea" stroke="#7d725f" strokeWidth="0.6" />
                    <path d={caraB(x0, y0, dy, H1, hz)} fill="#e9e2d5" stroke="#7d725f" strokeWidth="0.6" />
                    <path d={techo(x0, y0, dx, dy, hz)} fill="#fdfaf4" stroke="#211c15" strokeWidth="0.7" />
                  </g>
                );
              })}

              {/* cocina y servicios, en planta baja */}
              {[[10, 58, 22, 24], [38, 58, 16, 24]].map(([x0, y0, dx, dy], i) => (
                <g key={`s${i}`}>
                  <path d={caraA(x0, y0 + dy, dx, 0, 9)} fill="#e3dbcc" stroke="#7d725f" strokeWidth="0.6" />
                  <path d={techo(x0, y0, dx, dy, 9)} fill="#f2ece1" stroke="#695f4f" strokeWidth="0.7" />
                </g>
              ))}

              {/* el vacío a doble altura, trama ocre */}
              <path d={techo(CORTE, 0, ANCHO - CORTE, FONDO, 0)} fill="url(#tramaDoble)" />
              <path d={techo(CORTE, 0, ANCHO - CORTE, FONDO, 0)} fill="none"
                    stroke="#c4772b" strokeWidth="0.8" strokeDasharray="3 2" />

              {/* coronación del muro en la zona alta */}
              <path d={caraA(CORTE, FONDO, ANCHO - CORTE, H1, H2)} fill="#e6dfd2"
                    stroke="#7d725f" strokeWidth="0.7" />
              <path d={techo(0, 0, ANCHO, FONDO, H2)} fill="none" stroke="#211c15"
                    strokeWidth="0.8" opacity="0.28" strokeDasharray="4 3" />

              {/* escala humana */}
              {[[96, 20], [104, 46], [88, 66], [116, 34]].map(([x, y], i) => (
                <Persona key={i} xf={x} yf={y} />
              ))}

              {/* cotas */}
              <Cota a={p(ANCHO + 8, FONDO, 0)} b={p(ANCHO + 8, FONDO, H2)}
                    texto={`${H2} FT`} color="#c4772b" desp={-3} />
              <Cota a={p(-8, FONDO, 0)} b={p(-8, FONDO, H1)} texto={`${H1} FT`} desp={-3} />
              <Cota a={p(0, FONDO + 10, 0)} b={p(ANCHO, FONDO + 10, 0)}
                    texto={`≈ ${ANCHO} FT`} desp={9} />
              <Cota a={p(ANCHO + 14, 0, 0)} b={p(ANCHO + 14, FONDO, 0)}
                    texto={`≈ ${FONDO} FT`} desp={9} />

              {/* rótulos */}
              <g fontFamily="ui-monospace,monospace" letterSpacing="1.4">
                <text {...pos(30, 24, H1 + 16)} fontSize="7.5" fill="#7d725f">
                  {es ? "NIVEL 02 · 5 SALAS PRIVADAS" : "LEVEL 02 · 5 PRIVATE ROOMS"}
                </text>
                <text {...pos(18, 72, 12)} fontSize="7.5" fill="#7d725f">
                  {es ? "COCINA Y SERVICIOS" : "KITCHEN & SERVICES"}
                </text>
                <text {...pos(96, 6, 2)} fontSize="8" fill="#c4772b">
                  {es ? "DOBLE ALTURA" : "DOUBLE HEIGHT"}
                </text>
              </g>

              {/* cajetín */}
              <g fontFamily="ui-monospace,monospace" letterSpacing="1.6" fill="#7d725f">
                <line x1="-205" y1="-166" x2="-95" y2="-166" stroke="#211c15" strokeWidth="0.8" />
                <text x="-205" y="-154" fontSize="9" fill="#211c15">CLUB WYNWOOD</text>
                <text x="-205" y="-143" fontSize="7">
                  {es ? "EL EDIFICIO · NIVELES 01 Y 02" : "THE BUILDING · LEVELS 01 AND 02"}
                </text>
                <text x="-205" y="-133" fontSize="7">
                  {es ? "LÁMINA 05 · SIN ESCALA" : "PLATE 05 · NOT TO SCALE"}
                </text>
              </g>

              {/* escala gráfica */}
              <g transform="translate(-205,86)">
                <text x="0" y="-6" fontFamily="ui-monospace,monospace" fontSize="7"
                      letterSpacing="1.4" fill="#7d725f">
                  {es ? "ESCALA GRÁFICA" : "GRAPHIC SCALE"}
                </text>
                <rect x="0" y="0" width="27" height="4.5" fill="#211c15" />
                <rect x="27" y="0" width="27" height="4.5" fill="#f8f3ea" stroke="#211c15" strokeWidth="0.5" />
                <rect x="54" y="0" width="27" height="4.5" fill="#211c15" />
                <text x="0" y="14" fontFamily="ui-monospace,monospace" fontSize="6.5" fill="#7d725f">0</text>
                <text x="70" y="14" fontFamily="ui-monospace,monospace" fontSize="6.5" fill="#7d725f">45 FT</text>
              </g>

              {/* norte */}
              <g transform="translate(196,-140)">
                <path d="M0,16 L0,-10 M-3.4,-4 L0,-11 L3.4,-4" fill="none" stroke="#211c15" strokeWidth="0.9" />
                <text x="-2.6" y="27" fontFamily="ui-monospace,monospace" fontSize="8" fill="#7d725f">N</text>
              </g>
            </svg>

            <figcaption className="ojo" style={{ paddingTop: 16, lineHeight: 1.7, maxWidth: "72ch" }}>
              {es
                ? "Esquema volumétrico aproximado — no es un plano a escala. Las superficies y las alturas salen del plano de 2016 del inmueble; las cotas de fachada y fondo son aproximadas y se levantan en la visita técnica. Lo que hoy hay montado en la planta baja pertenece al operador y no forma parte del alquiler."
                : "Approximate volumetric diagram — not to scale. Areas and heights come from the building's 2016 plan; frontage and depth are approximate and are surveyed at the technical visit. Whatever is installed on the ground floor today belongs to the operator and is not part of the rental."}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

/** Coloca un texto en coordenadas del mundo. */
function pos(xf: number, yf: number, zf: number) {
  const [x, y] = p(xf, yf, zf);
  return { x, y };
}

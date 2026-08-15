import { COTAS, NIVEL_02, totalInmueble } from "@/lib/edificio";
import type { Idioma } from "@/lib/i18n";

/**
 * LÁMINA 05 — EL EDIFICIO. Isométrica.
 *
 * Segunda pasada. La primera "iba cerca pero más o menos": el dibujo quedaba
 * arrinconado abajo a la derecha con medio lienzo vacío, los rótulos se montaban
 * sobre la geometría, la escala gráfica chocaba con la cota de 12 ft y la de
 * 22 ft se salía del encuadre.
 *
 * QUÉ CAMBIA EN ESTA
 *   · viewBox calculado a partir de la caja real de la proyección, no a ojo.
 *   · Rótulos en cartela negra con línea de guía y punto, como en las láminas
 *     del exterior. Ninguno se apoya sobre el dibujo.
 *   · Cotas FUERA de la geometría, cada una en su banda.
 *   · Espesor real en losas y muros: sin canto, una isométrica se lee plana.
 *   · Retícula de pilares con capitel, hueco de escalera, puertas en las salas,
 *     trama en las caras cortadas y figuras humanas en los dos niveles.
 *
 * PROYECCIÓN, la misma que el exterior para que sean una serie:
 *     sx = (x − y) · 0.866        sy = (x + y) · 0.5 − z        1 ft ≈ 1.79 u
 * Cuando exista la lámina maestra, el edificio encaja sin rehacerlo.
 *
 * QUÉ SE DIBUJA: el cascarón. QUÉ NO: nada del operador. Ver lib/edificio.ts.
 */

const U = 1.79;
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

/** Prisma completo con sus tres caras visibles y canto marcado. */
function Volumen({ x, y, dx, dy, z0, z1, techo = "#fdfaf4", frente = "#efe7d9",
                   lado = "#e2d9c8", borde = "#211c15", w = 0.75 }:
  { x: number; y: number; dx: number; dy: number; z0: number; z1: number;
    techo?: string; frente?: string; lado?: string; borde?: string; w?: number }) {
  return (
    <g>
      <path d={cFrente(x, y + dy, dx, z0, z1)} fill={frente} stroke={borde} strokeWidth={w} />
      <path d={cLado(x + dx, y, dy, z0, z1)} fill={lado} stroke={borde} strokeWidth={w} />
      <path d={cTecho(x, y, dx, dy, z1)} fill={techo} stroke={borde} strokeWidth={w} />
    </g>
  );
}

// --- Geometría. Alturas leídas del plano; fachada y fondo, aproximadas. ----
const ANCHO = 130, FONDO = 90;
const H1 = COTAS.alturaPlantaFt;   // 12
const H2 = COTAS.alturaDobleFt;    // 22
const CORTE = 76;                  // ft: fin del forjado 02, principio del vacío
const ESP = 1.4;                   // ft de canto de losa

/**
 * El forjado del nivel 02 se dibuja EN L, recortando la esquina cercana.
 *
 * En la versión anterior cubría toda la planta baja y la cocina quedaba debajo,
 * invisible: la cartela parecía apuntar al aire porque no había nada que
 * señalar. Cortarlo es la técnica estándar de la isométrica seccionada y
 * además enseña los dos niveles a la vez, que es justo lo que hay que
 * comunicar de este edificio.
 */
const CUT_X = 42;   // ft: hasta dónde llega el recorte en x
const CUT_Y = 58;   // ft: dónde empieza el recorte en y

/** Caja de la proyección, para encuadrar sin adivinar. */
const XS = [p(0, FONDO)[0], p(ANCHO, 0)[0]];
const YS = [p(0, 0, H2)[1], p(ANCHO, FONDO)[1]];
const VB = {
  x: XS[0] - 78, y: YS[0] - 96,
  w: (XS[1] - XS[0]) + 176, h: (YS[1] - YS[0]) + 168,
};

function Persona({ xf, yf, zf = 0, o = 0.6 }: { xf: number; yf: number; zf?: number; o?: number }) {
  const [x, y] = p(xf, yf, zf);
  return (
    <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)})`} opacity={o}>
      <circle cx="0" cy="-9.2" r="1.85" fill="#5c5445" />
      <path d="M0,-7.3 L0,-3 M0,-6.1 L-2,-4.3 M0,-6.1 L2,-4.3 M0,-3 L-1.7,0 M0,-3 L1.7,0"
            stroke="#5c5445" strokeWidth="1.05" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** Cartela negra con línea de guía y punto, como en las láminas del exterior. */
function Cartela({ anclaje, hacia, titulo, dato }:
  { anclaje: [number, number]; hacia: [number, number]; titulo: string; dato?: string }) {
  const [ax, ay] = anclaje, [bx, by] = hacia;
  const w = Math.max(titulo.length * 5.3, dato ? dato.length * 5.1 : 0) + 14;
  const h = dato ? 25 : 15;
  return (
    <g>
      <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#211c15" strokeWidth="0.65" />
      <circle cx={ax} cy={ay} r="1.7" fill="#211c15" />
      <rect x={bx} y={by - h} width={w} height={dato ? 14 : h} fill="#211c15" />
      <text x={bx + 7} y={by - h + 10} fill="#f8f3ea" fontFamily="ui-monospace,monospace"
            fontSize="7.6" letterSpacing="1.5">{titulo}</text>
      {dato && (
        <>
          <rect x={bx} y={by - 11} width={w} height={12} fill="#f8f3ea"
                stroke="#211c15" strokeWidth="0.6" />
          <text x={bx + 7} y={by - 2} fill="#211c15" fontFamily="ui-monospace,monospace"
                fontSize="7.2" letterSpacing="1.2">{dato}</text>
        </>
      )}
    </g>
  );
}

/** Cota con flechas. Se dibuja fuera de la geometría, nunca encima. */
function Cota({ a, b, texto, color = "#7d725f", dx = 0, dy = 0 }:
  { a: [number, number]; b: [number, number]; texto: string; color?: string; dx?: number; dy?: number }) {
  const [x1, y1] = a, [x2, y2] = b;
  const an = Math.atan2(y2 - y1, x2 - x1), f = 4.6;
  const punta = (x: number, y: number, s: number) =>
    `M${(x + Math.cos(an + 0.38) * f * s).toFixed(1)},${(y + Math.sin(an + 0.38) * f * s).toFixed(1)} ` +
    `L${x.toFixed(1)},${y.toFixed(1)} ` +
    `L${(x + Math.cos(an - 0.38) * f * s).toFixed(1)},${(y + Math.sin(an - 0.38) * f * s).toFixed(1)}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="0.65" />
      <path d={punta(x1, y1, 1)} fill="none" stroke={color} strokeWidth="0.65" />
      <path d={punta(x2, y2, -1)} fill="none" stroke={color} strokeWidth="0.65" />
      <text x={(x1 + x2) / 2 + dx} y={(y1 + y2) / 2 + dy} fill={color}
            fontFamily="ui-monospace,monospace" fontSize="7.4" letterSpacing="1.1"
            textAnchor="middle">{texto}</text>
    </g>
  );
}

export default function LaminaEdificio({ lang }: { lang: Idioma }) {
  const es = lang === "es";
  const salas = NIVEL_02.filter((r) => r.nombre.es.startsWith("Sala privada"));

  const ejesX: number[] = []; for (let x = 0; x <= ANCHO; x += 26) ejesX.push(x);
  const ejesY: number[] = []; for (let y = 0; y <= FONDO; y += 30) ejesY.push(y);

  return (
    <section id="interior" aria-label={es ? "Lámina 05 — el edificio" : "Plate 05 — the building"}
             style={{ background: "transparent" }}>
      <div className="reja" style={{ paddingBlock: "34px 60px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap",
                      paddingBottom: 14, borderBottom: "1px solid var(--regla)" }}>
          <div className="ojo" style={{ color: "var(--tinta-2)" }}>
            {es ? "Lámina 05 — El edificio" : "Plate 05 — The building"}
          </div>
          <div className="ojo">
            {es ? "Proyección isométrica · 1 ft ≈ 1.79 u · esquema volumétrico"
                : "Isometric projection · 1 ft ≈ 1.79 u · volumetric diagram"}
          </div>
        </div>

        <div data-lam="reja" style={{ display: "grid",
             gridTemplateColumns: "minmax(0,210px) minmax(0,1fr)", gap: 36, paddingTop: 28 }}>

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
            {[es ? "Estructura" : "Structure", es ? "Losa nivel 02" : "Level 02 slab",
              es ? "Doble altura" : "Double height", es ? "Escala humana" : "Human scale",
              es ? "Cotas" : "Dimensions"].map((c) => (
              <div key={c} style={{ display: "flex", gap: 10, alignItems: "center",
                                    padding: "8px 0", borderBottom: "1px solid var(--regla)" }}>
                <span style={{ width: 8, height: 8, background: "var(--tinta)" }} />
                <span className="ojo" style={{ fontSize: 9 }}>{c}</span>
              </div>
            ))}
          </aside>

          <figure style={{ margin: 0 }}>
            <svg viewBox={`${VB.x.toFixed(0)} ${VB.y.toFixed(0)} ${VB.w.toFixed(0)} ${VB.h.toFixed(0)}`}
                 role="img"
                 aria-label={es
                   ? "Isométrica del edificio: dos niveles, retícula de pilares, zona a doble altura de 22 pies, cinco salas privadas en el nivel 02 y cocina en planta baja"
                   : "Isometric of the building: two levels, column grid, a 22-foot double-height zone, five private rooms on level 02 and a kitchen on the ground floor"}
                 style={{ width: "100%", height: "auto", display: "block" }}>
              <defs>
                <pattern id="tDoble" width="5.5" height="5.5" patternTransform="rotate(45)"
                         patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="5.5" stroke="#c4772b" strokeWidth="0.55" opacity="0.55" />
                </pattern>
                <pattern id="tSuelo" width="8" height="8" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="0.42" fill="#a29784" />
                </pattern>
                <pattern id="tCorte" width="3.4" height="3.4" patternTransform="rotate(45)"
                         patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="3.4" stroke="#7d725f" strokeWidth="0.4" />
                </pattern>
              </defs>

              {/* --- suelo --- */}
              <path d={cTecho(0, 0, ANCHO, FONDO, 0)} fill="#f2ece1" stroke="#7d725f" strokeWidth="0.6" />
              <path d={cTecho(0, 0, ANCHO, FONDO, 0)} fill="url(#tSuelo)" opacity="0.55" />

              {/* --- retícula de pilares, con capitel --- */}
              {ejesX.map((x) => ejesY.map((y) => {
                const alto = x >= CORTE ? H2 : H1;
                const [ax, ay] = p(x, y, 0), [bx, by] = p(x, y, alto);
                return (
                  <g key={`${x}-${y}`}>
                    <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#5c5445" strokeWidth="1.1" />
                    <path d={cTecho(x - 1, y - 1, 2, 2, alto)} fill="#a29784" stroke="#5c5445" strokeWidth="0.4" />
                  </g>
                );
              }))}

              {/* --- muros perimetrales de planta baja, con espesor --- */}
              <path d={cFrente(0, FONDO, ANCHO, 0, H1)} fill="#e6dfd2" stroke="#211c15" strokeWidth="0.8" />
              <path d={cLado(0, 0, FONDO, 0, H1)} fill="#dbd2c1" stroke="#211c15" strokeWidth="0.8" />

              {/* --- cocina y servicios --- */}
              {/* Van dentro del recorte del forjado: si no, quedan tapadas. */}
              <Volumen x={7} y={CUT_Y + 4} dx={22} dy={24} z0={0} z1={9}
                       techo="#f6f0e4" frente="#e4dbc9" lado="#d6cbb6" />
              <Volumen x={31} y={CUT_Y + 4} dx={9} dy={24} z0={0} z1={9}
                       techo="#f0e9dc" frente="#ded5c2" lado="#cfc4ae" />
              {/* hueco de escalera, arrimado al canto del corte */}
              <Volumen x={CUT_X + 2} y={CUT_Y + 6} dx={8} dy={20} z0={0} z1={H1}
                       techo="#e9e2d5" frente="#d9d0be" lado="#cec4b0" />

              {/* --- losa del nivel 02, con canto --- */}
              {/* Forjado en L: dos rectangulos, con el recorte entre ellos. */}
              <path d={cTecho(0, 0, CORTE, CUT_Y, H1)} fill="#efe8dc" stroke="#211c15" strokeWidth="0.9" />
              <path d={cTecho(CUT_X, CUT_Y, CORTE - CUT_X, FONDO - CUT_Y, H1)}
                    fill="#efe8dc" stroke="#211c15" strokeWidth="0.9" />
              {/* Cantos. Con trama de seccion para que se lea CORTADO y no roto. */}
              <path d={cFrente(CUT_X, FONDO, CORTE - CUT_X, H1 - ESP, H1)} fill="url(#tCorte)"
                    stroke="#211c15" strokeWidth="0.7" />
              <path d={cFrente(0, CUT_Y, CUT_X, H1 - ESP, H1)} fill="url(#tCorte)"
                    stroke="#211c15" strokeWidth="0.7" />
              <path d={cLado(CUT_X, CUT_Y, FONDO - CUT_Y, H1 - ESP, H1)} fill="url(#tCorte)"
                    stroke="#211c15" strokeWidth="0.7" />
              <path d={cLado(CORTE, 0, FONDO, H1 - ESP, H1)} fill="url(#tCorte)"
                    stroke="#211c15" strokeWidth="0.7" />

              {/* --- cinco salas privadas, con puerta --- */}
              {salas.map((_, i) => {
                const x0 = 7 + i * 13.4, y0 = 12, dx = 10.4, dy = 30, z1 = H1 + 9;
                const [px, py] = p(x0 + dx, y0 + dy * 0.62, H1);
                const [qx, qy] = p(x0 + dx, y0 + dy * 0.62, H1 + 6.4);
                return (
                  <g key={i}>
                    <Volumen x={x0} y={y0} dx={dx} dy={dy} z0={H1} z1={z1} w={0.62} />
                    <line x1={px} y1={py} x2={qx} y2={qy} stroke="#7d725f" strokeWidth="0.5" />
                  </g>
                );
              })}

              {/* --- el vacío a doble altura --- */}
              <path d={cTecho(CORTE, 0, ANCHO - CORTE, FONDO, 0)} fill="url(#tDoble)" />
              <path d={cTecho(CORTE, 0, ANCHO - CORTE, FONDO, 0)} fill="none" stroke="#c4772b"
                    strokeWidth="0.8" strokeDasharray="3.5 2.5" />
              {/* Muros hasta 22 ft: sin ellos, una trama en el suelo es una terraza. */}
              <path d={cFrente(CORTE, FONDO, ANCHO - CORTE, 0, H2)} fill="#e6dfd2"
                    stroke="#211c15" strokeWidth="0.8" />
              <path d={cLado(ANCHO, 0, FONDO, 0, H2)} fill="#dbd2c1"
                    stroke="#211c15" strokeWidth="0.8" />
              {/* Vigas uniendo las cabezas de pilar: sin ellas los pilares
                  flotaban como palos sueltos con un rombo encima. */}
              {ejesY.map((y) => {
                const [ax, ay] = p(CORTE, y, H2), [bx, by] = p(ANCHO, y, H2);
                return <line key={`vy${y}`} x1={ax} y1={ay} x2={bx} y2={by}
                             stroke="#5c5445" strokeWidth="0.75" opacity="0.9" />;
              })}
              {ejesX.filter((x) => x >= CORTE).map((x) => {
                const [ax, ay] = p(x, 0, H2), [bx, by] = p(x, FONDO, H2);
                return <line key={`vx${x}`} x1={ax} y1={ay} x2={bx} y2={by}
                             stroke="#5c5445" strokeWidth="0.75" opacity="0.9" />;
              })}
              {/* Arista de cubierta sobre la zona alta, marcada. */}
              <path d={cTecho(CORTE, 0, ANCHO - CORTE, FONDO, H2)} fill="none"
                    stroke="#211c15" strokeWidth="0.9" />
              {/* Plano de cubierta del resto, punteado. */}
              <path d={cTecho(0, 0, ANCHO, FONDO, H2)} fill="none" stroke="#211c15"
                    strokeWidth="0.7" opacity="0.26" strokeDasharray="4 3.5" />

              {/* --- escala humana, en los dos niveles --- */}
              <Persona xf={100} yf={22} /><Persona xf={112} yf={52} />
              <Persona xf={90} yf={70} /><Persona xf={120} yf={34} o={0.45} />
              <Persona xf={30} yf={44} zf={H1} o={0.5} />

              {/* --- cotas, todas fuera del dibujo --- */}
              <Cota a={p(ANCHO + 7, FONDO + 7, 0)} b={p(ANCHO + 7, FONDO + 7, H2)}
                    texto={`${H2} FT`} color="#c4772b" dx={17} />
              <Cota a={p(-13, FONDO + 13, 0)} b={p(-13, FONDO + 13, H1)} texto={`${H1} FT`} dx={-19} />
              <Cota a={p(0, FONDO + 15, 0)} b={p(ANCHO, FONDO + 15, 0)}
                    texto={`≈ ${ANCHO} FT`} dy={12} />
              <Cota a={p(ANCHO + 16, 0, 0)} b={p(ANCHO + 16, FONDO, 0)}
                    texto={`≈ ${FONDO} FT`} dy={12} />

              {/* --- cartelas, ninguna sobre el dibujo --- */}
              <Cartela anclaje={p(36, 26, H1 + 9)} hacia={[VB.x + 16, VB.y + 96]}
                       titulo={es ? "NIVEL 02" : "LEVEL 02"}
                       dato={es ? `${salas.length} salas privadas` : `${salas.length} private rooms`} />
              <Cartela anclaje={p(18, CUT_Y + 16, 9)} hacia={[VB.x + 16, VB.y + VB.h - 78]}
                       titulo={es ? "COCINA" : "KITCHEN"} dato="580 ft²" />
              <Cartela anclaje={p(104, 44, 0)} hacia={[VB.x + VB.w - 126, VB.y + 62]}
                       titulo={es ? "DOBLE ALTURA" : "DOUBLE HEIGHT"} dato={`${H2} ft`} />

              {/* --- cajetín --- */}
              <g fontFamily="ui-monospace,monospace" letterSpacing="1.6">
                <line x1={VB.x + 14} y1={VB.y + 26} x2={VB.x + 132} y2={VB.y + 26}
                      stroke="#211c15" strokeWidth="0.8" />
                <text x={VB.x + 14} y={VB.y + 40} fontSize="9.4" fill="#211c15">CLUB WYNWOOD</text>
                <text x={VB.x + 14} y={VB.y + 52} fontSize="7.2" fill="#7d725f">
                  {es ? "EL EDIFICIO · NIVELES 01 Y 02" : "THE BUILDING · LEVELS 01 AND 02"}
                </text>
                <text x={VB.x + 14} y={VB.y + 63} fontSize="7.2" fill="#7d725f">
                  {es ? "LÁMINA 05 · SIN ESCALA" : "PLATE 05 · NOT TO SCALE"}
                </text>
              </g>

              {/* --- escala gráfica, abajo a la izquierda y lejos de las cotas --- */}
              <g transform={`translate(${VB.x + 14},${VB.y + VB.h - 26})`}>
                <text x="0" y="-7" fontFamily="ui-monospace,monospace" fontSize="7"
                      letterSpacing="1.4" fill="#7d725f">
                  {es ? "ESCALA GRÁFICA" : "GRAPHIC SCALE"}
                </text>
                {[0, 1, 2].map((i) => (
                  <rect key={i} x={i * 26} y="0" width="26" height="4.4"
                        fill={i % 2 ? "#f8f3ea" : "#211c15"} stroke="#211c15" strokeWidth="0.45" />
                ))}
                <text x="0" y="14" fontFamily="ui-monospace,monospace" fontSize="6.6" fill="#7d725f">0</text>
                <text x="66" y="14" fontFamily="ui-monospace,monospace" fontSize="6.6" fill="#7d725f">45 FT</text>
              </g>

              {/* --- norte --- */}
              <g transform={`translate(${VB.x + VB.w - 34},${VB.y + 34})`}>
                <path d="M0,18 L0,-12 M-3.6,-5 L0,-13 L3.6,-5" fill="none"
                      stroke="#211c15" strokeWidth="0.95" />
                <text x="-2.7" y="30" fontFamily="ui-monospace,monospace" fontSize="8.4" fill="#7d725f">N</text>
              </g>
            </svg>

            <figcaption className="ojo" style={{ paddingTop: 16, lineHeight: 1.75, maxWidth: "74ch" }}>
              {es
                ? "Esquema volumétrico aproximado — no es un plano a escala. Las superficies y las alturas salen del plano de 2016 del inmueble; la fachada y el fondo son aproximados y se levantan en la visita técnica. Lo que hoy hay montado en la planta baja pertenece al operador y no forma parte del alquiler."
                : "Approximate volumetric diagram — not to scale. Areas and heights come from the building's 2016 plan; frontage and depth are approximate and are surveyed at the technical visit. Whatever is installed on the ground floor today belongs to the operator and is not part of the rental."}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

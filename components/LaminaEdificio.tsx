import { COTAS, NIVEL_02, totalInmueble } from "@/lib/edificio";
import type { Giro } from "@/lib/iso";
import DibujoEdificio from "./DibujoEdificio";
import GiroSel from "./Giro";
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

/** Barandilla: montantes cada 4 ft y pasamanos. Sin esto el canto del forjado
 *  parece que se acaba porque si, y el doble espacio no se lee. */
function Barandilla({ x, y, largo, z, eje = "x" }:
  { x: number; y: number; largo: number; z: number; eje?: "x" | "y" }) {
  const H = 3.4;
  const fin = eje === "x" ? p(x + largo, y, z + H) : p(x, y + largo, z + H);
  const ini = p(x, y, z + H);
  const montantes = [];
  for (let t = 0; t <= largo; t += 4) {
    const a = eje === "x" ? p(x + t, y, z) : p(x, y + t, z);
    const b = eje === "x" ? p(x + t, y, z + H) : p(x, y + t, z + H);
    montantes.push(
      <line key={t} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
            stroke="#7d725f" strokeWidth="0.5" />
    );
  }
  return (
    <g>
      {montantes}
      <line x1={ini[0]} y1={ini[1]} x2={fin[0]} y2={fin[1]}
            stroke="#211c15" strokeWidth="0.85" />
    </g>
  );
}

/** Escalera con peldanos. Ata los dos niveles: sin ella el 02 flota. */
function Escalera({ x, y, ancho, largo, z0, z1 }:
  { x: number; y: number; ancho: number; largo: number; z0: number; z1: number }) {
  const n = 9, dl = largo / n, dz = (z1 - z0) / n;
  const pasos = [];
  for (let i = 0; i < n; i++) {
    const yy = y + i * dl, zz = z0 + i * dz;
    pasos.push(
      <g key={i}>
        <path d={cFrente(x, yy + dl, ancho, zz, zz + dz)} fill="#e0d7c6"
              stroke="#7d725f" strokeWidth="0.4" />
        <path d={cTecho(x, yy, ancho, dl, zz + dz)} fill="#f4eee2"
              stroke="#7d725f" strokeWidth="0.4" />
      </g>
    );
  }
  return <g>{pasos}</g>;
}

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
            <GiroSel lang={lang}
                  vistas={[0, 1, 2, 3].map((gi) => (
                    <DibujoEdificio key={gi} lang={lang} giro={gi as Giro} />
                  ))} />

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

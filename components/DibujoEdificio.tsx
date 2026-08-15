import { COTAS, NIVEL_02 } from "@/lib/edificio";
import { crearGeo, type Giro } from "@/lib/iso";
import type { Idioma } from "@/lib/i18n";

/**
 * El dibujo del edificio, para un giro dado.
 *
 * Se separó del resto de la lámina (cajetín, barra lateral, pie) porque de esto
 * se generan CUATRO copias, una por vista, y lo demás no cambia entre ellas.
 *
 * Toda la geometría entra por crearGeo(): rotar es cambiar un número. Ver
 * lib/iso.ts para por qué se eligieron vistas fijas y no orbitar.
 */

const U = 1.79;
const ANCHO = 130, FONDO = 90;
const H1 = COTAS.alturaPlantaFt;   // 12
const H2 = COTAS.alturaDobleFt;    // 22
const CORTE = 76;                  // fin del forjado 02, principio del vacío
const ESP = 1.4;                   // canto de losa
const CUT_X = 42, CUT_Y = 58;      // recorte del forjado, para ver la planta baja

export default function DibujoEdificio({ lang, giro }: { lang: Idioma; giro: Giro }) {
  const es = lang === "es";
  const g = crearGeo(U, ANCHO / 2, FONDO / 2, giro);
  const { p, techo, frente, lado } = g;
  const VB = g.caja(ANCHO, FONDO, H2, 86);

  const salas = NIVEL_02.filter((r) => r.nombre.es.startsWith("Sala privada"));
  const ejesX: number[] = []; for (let x = 0; x <= ANCHO; x += 26) ejesX.push(x);
  const ejesY: number[] = []; for (let y = 0; y <= FONDO; y += 30) ejesY.push(y);

  const Vol = ({ x, y, dx, dy, z0, z1, t = "#fdfaf4", f = "#efe7d9", l = "#e2d9c8", w = 0.75 }:
    { x: number; y: number; dx: number; dy: number; z0: number; z1: number;
      t?: string; f?: string; l?: string; w?: number }) => (
    <g>
      <path d={frente(x, y + dy, dx, z0, z1)} fill={f} stroke="#211c15" strokeWidth={w} />
      <path d={lado(x + dx, y, dy, z0, z1)} fill={l} stroke="#211c15" strokeWidth={w} />
      <path d={techo(x, y, dx, dy, z1)} fill={t} stroke="#211c15" strokeWidth={w} />
    </g>
  );

  const Gente = ({ x, y, z = 0, o = 0.6 }: { x: number; y: number; z?: number; o?: number }) => {
    const [a, b] = p(x, y, z);
    return (
      <g transform={`translate(${a.toFixed(1)},${b.toFixed(1)})`} opacity={o}>
        <circle cx="0" cy="-9.2" r="1.85" fill="#5c5445" />
        <path d="M0,-7.3 L0,-3 M0,-6.1 L-2,-4.3 M0,-6.1 L2,-4.3 M0,-3 L-1.7,0 M0,-3 L1.7,0"
              stroke="#5c5445" strokeWidth="1.05" fill="none" strokeLinecap="round" />
      </g>
    );
  };

  /** Cota. Se dibuja fuera de la geometría, nunca encima. */
  const Cota = ({ a, b, txt, c = "#7d725f", dx = 0, dy = 0 }:
    { a: [number, number]; b: [number, number]; txt: string; c?: string; dx?: number; dy?: number }) => {
    const an = Math.atan2(b[1] - a[1], b[0] - a[0]), f = 4.6;
    const pt = (q: [number, number], s: number) =>
      `M${(q[0] + Math.cos(an + 0.38) * f * s).toFixed(1)},${(q[1] + Math.sin(an + 0.38) * f * s).toFixed(1)} ` +
      `L${q[0].toFixed(1)},${q[1].toFixed(1)} ` +
      `L${(q[0] + Math.cos(an - 0.38) * f * s).toFixed(1)},${(q[1] + Math.sin(an - 0.38) * f * s).toFixed(1)}`;
    return (
      <g>
        <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={c} strokeWidth="0.65" />
        <path d={pt(a, 1)} fill="none" stroke={c} strokeWidth="0.65" />
        <path d={pt(b, -1)} fill="none" stroke={c} strokeWidth="0.65" />
        <text x={(a[0] + b[0]) / 2 + dx} y={(a[1] + b[1]) / 2 + dy} fill={c}
              fontFamily="ui-monospace,monospace" fontSize="7.4" letterSpacing="1.1"
              textAnchor="middle">{txt}</text>
      </g>
    );
  };

  /** Cartela negra con guía. El destino se da en coordenadas del viewBox para
   *  que no se monte sobre el dibujo en ninguna de las cuatro vistas. */
  const Cartela = ({ an, a, titulo, dato }:
    { an: [number, number]; a: [number, number]; titulo: string; dato?: string }) => {
    const w = Math.max(titulo.length * 5.3, dato ? dato.length * 5.1 : 0) + 14;
    return (
      <g>
        <line x1={an[0]} y1={an[1]} x2={a[0]} y2={a[1]} stroke="#211c15" strokeWidth="0.65" />
        <circle cx={an[0]} cy={an[1]} r="1.7" fill="#211c15" />
        <rect x={a[0]} y={a[1] - 25} width={w} height="14" fill="#211c15" />
        <text x={a[0] + 7} y={a[1] - 15} fill="#f8f3ea" fontFamily="ui-monospace,monospace"
              fontSize="7.6" letterSpacing="1.5">{titulo}</text>
        {dato && (
          <>
            <rect x={a[0]} y={a[1] - 11} width={w} height="12" fill="#f8f3ea"
                  stroke="#211c15" strokeWidth="0.6" />
            <text x={a[0] + 7} y={a[1] - 2} fill="#211c15" fontFamily="ui-monospace,monospace"
                  fontSize="7.2" letterSpacing="1.2">{dato}</text>
          </>
        )}
      </g>
    );
  };

  const Barandilla = ({ x, y, largo, z, eje }:
    { x: number; y: number; largo: number; z: number; eje: "x" | "y" }) => {
    const H = 3.4;
    const ini = p(x, y, z + H);
    const fin = eje === "x" ? p(x + largo, y, z + H) : p(x, y + largo, z + H);
    const m = [];
    for (let t = 0; t <= largo; t += 4) {
      const a = eje === "x" ? p(x + t, y, z) : p(x, y + t, z);
      const b = eje === "x" ? p(x + t, y, z + H) : p(x, y + t, z + H);
      m.push(<line key={t} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#7d725f" strokeWidth="0.5" />);
    }
    return <g>{m}<line x1={ini[0]} y1={ini[1]} x2={fin[0]} y2={fin[1]} stroke="#211c15" strokeWidth="0.85" /></g>;
  };

  const Escalera = () => {
    const n = 9, dl = 22 / n, dz = H1 / n, x = CUT_X + 2, y0 = CUT_Y + 4, an = 7;
    return (
      <g>
        {Array.from({ length: n }, (_, i) => (
          <g key={i}>
            <path d={frente(x, y0 + i * dl + dl, an, i * dz, (i + 1) * dz)} fill="#e0d7c6"
                  stroke="#7d725f" strokeWidth="0.4" />
            <path d={techo(x, y0 + i * dl, an, dl, (i + 1) * dz)} fill="#f4eee2"
                  stroke="#7d725f" strokeWidth="0.4" />
          </g>
        ))}
      </g>
    );
  };

  const id = `g${giro}`;   // los patrones necesitan id único por vista

  return (
    <svg viewBox={`${VB.x.toFixed(0)} ${VB.y.toFixed(0)} ${VB.w.toFixed(0)} ${VB.h.toFixed(0)}`}
         role="img"
         aria-label={es
           ? "Isométrica del edificio: dos niveles, retícula de pilares, zona a doble altura de 22 pies, cinco salas privadas y cocina"
           : "Isometric of the building: two levels, column grid, 22-foot double-height zone, five private rooms and a kitchen"}
         style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <pattern id={`da${id}`} width="5.5" height="5.5" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="5.5" stroke="#c4772b" strokeWidth="0.55" opacity="0.55" />
        </pattern>
        <pattern id={`su${id}`} width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.42" fill="#a29784" />
        </pattern>
        <pattern id={`co${id}`} width="3.4" height="3.4" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="3.4" stroke="#7d725f" strokeWidth="0.4" />
        </pattern>
      </defs>

      <path d={techo(0, 0, ANCHO, FONDO, 0)} fill="#f2ece1" stroke="#7d725f" strokeWidth="0.6" />
      <path d={techo(0, 0, ANCHO, FONDO, 0)} fill={`url(#su${id})`} opacity="0.55" />

      {ejesX.map((x) => ejesY.map((y) => {
        const alto = x >= CORTE ? H2 : H1;
        const a = p(x, y, 0), b = p(x, y, alto);
        return (
          <g key={`${x}-${y}`}>
            <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#5c5445" strokeWidth="1.1" />
            <path d={techo(x - 1, y - 1, 2, 2, alto)} fill="#a29784" stroke="#5c5445" strokeWidth="0.4" />
          </g>
        );
      }))}

      <path d={frente(0, FONDO, ANCHO, 0, H1)} fill="#e6dfd2" stroke="#211c15" strokeWidth="0.8" />
      <path d={lado(0, 0, FONDO, 0, H1)} fill="#dbd2c1" stroke="#211c15" strokeWidth="0.8" />

      <Vol x={7} y={CUT_Y + 4} dx={22} dy={24} z0={0} z1={9} t="#f6f0e4" f="#e4dbc9" l="#d6cbb6" />
      <Vol x={31} y={CUT_Y + 4} dx={9} dy={24} z0={0} z1={9} t="#f0e9dc" f="#ded5c2" l="#cfc4ae" />
      <Escalera />

      <path d={techo(0, 0, CORTE, CUT_Y, H1)} fill="#efe8dc" stroke="#211c15" strokeWidth="0.9" />
      <path d={techo(CUT_X, CUT_Y, CORTE - CUT_X, FONDO - CUT_Y, H1)} fill="#efe8dc" stroke="#211c15" strokeWidth="0.9" />
      <path d={frente(CUT_X, FONDO, CORTE - CUT_X, H1 - ESP, H1)} fill={`url(#co${id})`} stroke="#211c15" strokeWidth="0.7" />
      <path d={frente(0, CUT_Y, CUT_X, H1 - ESP, H1)} fill={`url(#co${id})`} stroke="#211c15" strokeWidth="0.7" />
      <path d={lado(CUT_X, CUT_Y, FONDO - CUT_Y, H1 - ESP, H1)} fill={`url(#co${id})`} stroke="#211c15" strokeWidth="0.7" />
      <path d={lado(CORTE, 0, FONDO, H1 - ESP, H1)} fill={`url(#co${id})`} stroke="#211c15" strokeWidth="0.7" />

      {(() => { let acum = 7; return salas.map((s, i) => {
        const dx = s.sqft / 30, x0 = acum; acum += dx + 3.2;
        return <Vol key={i} x={x0} y={12} dx={dx} dy={30} z0={H1} z1={H1 + 9} w={0.62} />;
      }); })()}

      <Barandilla x={CORTE} y={0} largo={FONDO} z={H1} eje="y" />
      <Barandilla x={CUT_X} y={CUT_Y} largo={CORTE - CUT_X} z={H1} eje="x" />

      <path d={techo(CORTE, 0, ANCHO - CORTE, FONDO, 0)} fill={`url(#da${id})`} />
      <path d={techo(CORTE, 0, ANCHO - CORTE, FONDO, 0)} fill="none" stroke="#c4772b"
            strokeWidth="0.8" strokeDasharray="3.5 2.5" />
      <path d={frente(CORTE, FONDO, ANCHO - CORTE, 0, H2)} fill="#e6dfd2" stroke="#211c15" strokeWidth="0.8" />
      <path d={lado(ANCHO, 0, FONDO, 0, H2)} fill="#dbd2c1" stroke="#211c15" strokeWidth="0.8" />
      {ejesY.map((y) => {
        const a = p(CORTE, y, H2), b = p(ANCHO, y, H2);
        return <line key={`vy${y}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#5c5445" strokeWidth="0.75" />;
      })}
      <path d={techo(CORTE, 0, ANCHO - CORTE, FONDO, H2)} fill="none" stroke="#211c15" strokeWidth="0.9" />
      <path d={techo(0, 0, ANCHO, FONDO, H2)} fill="none" stroke="#211c15" strokeWidth="0.7"
            opacity="0.26" strokeDasharray="4 3.5" />

      {/* acceso y carpinterías */}
      <path d={frente(50, FONDO, 12, 0, 8)} fill="#f8f3ea" stroke="#211c15" strokeWidth="0.8" />
      <path d={techo(48, FONDO - 6, 16, 6, 9.4)} fill="#e0d7c6" stroke="#211c15" strokeWidth="0.7" />
      {[8, 20, 32, 68, 80, 92, 104, 116].map((x) => {
        const a = p(x, FONDO, 1.5), b = p(x, FONDO, x >= CORTE ? 18 : 9.5);
        return <line key={`c${x}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#a29784" strokeWidth="0.55" />;
      })}

      <Gente x={100} y={22} /><Gente x={112} y={52} /><Gente x={90} y={70} />
      <Gente x={CORTE - 3} y={26} z={H1} o={0.55} /><Gente x={CORTE - 3} y={54} z={H1} o={0.45} />
      <Gente x={56} y={FONDO - 6} o={0.5} />

      <Cota a={p(ANCHO + 7, FONDO + 7, 0)} b={p(ANCHO + 7, FONDO + 7, H2)} txt={`${H2} FT`} c="#c4772b" dx={17} />
      <Cota a={p(-13, FONDO + 13, 0)} b={p(-13, FONDO + 13, H1)} txt={`${H1} FT`} dx={-19} />
      <Cota a={p(0, FONDO + 17, 0)} b={p(ANCHO, FONDO + 17, 0)} txt={`≈ ${ANCHO} FT`} dy={12} />
      <Cota a={p(ANCHO + 18, 0, 0)} b={p(ANCHO + 18, FONDO, 0)} txt={`≈ ${FONDO} FT`} dy={12} />

      <Cartela an={p(24, 24, H1 + 9)} a={[VB.x + 14, VB.y + 104]}
               titulo={es ? "NIVEL 02" : "LEVEL 02"}
               dato={es ? `${salas.length} salas privadas` : `${salas.length} private rooms`} />
      <Cartela an={p(18, CUT_Y + 16, 9)} a={[VB.x + 14, VB.y + VB.h - 62]}
               titulo={es ? "COCINA" : "KITCHEN"} dato="580 ft²" />
      <Cartela an={p(104, 44, 6)} a={[VB.x + VB.w - 140, VB.y + 64]}
               titulo={es ? "DOBLE ALTURA" : "DOUBLE HEIGHT"} dato={`${H2} ft`} />

      <g fontFamily="ui-monospace,monospace" letterSpacing="1.6">
        <line x1={VB.x + 14} y1={VB.y + 26} x2={VB.x + 132} y2={VB.y + 26} stroke="#211c15" strokeWidth="0.8" />
        <text x={VB.x + 14} y={VB.y + 40} fontSize="9.4" fill="#211c15">CLUB WYNWOOD</text>
        <text x={VB.x + 14} y={VB.y + 52} fontSize="7.2" fill="#7d725f">
          {es ? "EL EDIFICIO · NIVELES 01 Y 02" : "THE BUILDING · LEVELS 01 AND 02"}
        </text>
        <text x={VB.x + 14} y={VB.y + 63} fontSize="7.2" fill="#7d725f">
          {es ? "LÁMINA 05 · SIN ESCALA" : "PLATE 05 · NOT TO SCALE"}
        </text>
      </g>

      <g transform={`translate(${VB.x + 14},${VB.y + VB.h - 26})`}>
        <text x="0" y="-7" fontFamily="ui-monospace,monospace" fontSize="7" letterSpacing="1.4" fill="#7d725f">
          {es ? "ESCALA GRÁFICA" : "GRAPHIC SCALE"}
        </text>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={i * 26} y="0" width="26" height="4.4"
                fill={i % 2 ? "#f8f3ea" : "#211c15"} stroke="#211c15" strokeWidth="0.45" />
        ))}
        <text x="0" y="14" fontFamily="ui-monospace,monospace" fontSize="6.6" fill="#7d725f">0</text>
        <text x="66" y="14" fontFamily="ui-monospace,monospace" fontSize="6.6" fill="#7d725f">45 FT</text>
      </g>

      {/* El norte gira con el dibujo: si no, mentiría en tres de las cuatro vistas. */}
      <g transform={`translate(${VB.x + VB.w - 34},${VB.y + 34}) rotate(${giro * 90})`}>
        <path d="M0,18 L0,-12 M-3.6,-5 L0,-13 L3.6,-5" fill="none" stroke="#211c15" strokeWidth="0.95" />
        <text x="-2.7" y="30" fontFamily="ui-monospace,monospace" fontSize="8.4" fill="#7d725f"
              transform={`rotate(${-giro * 90} -2.7 30)`}>N</text>
      </g>
    </svg>
  );
}

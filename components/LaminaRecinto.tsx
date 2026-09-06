"use client";

import { memo, useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { crearGeo, type Geo } from "@/lib/iso";
import type { Idioma } from "@/lib/i18n";
import { ev } from "@/lib/medicion";
import {
  U, LOTE, SETO, PASEO, PALAPA, PALAPA_ALERO, PALAPA_CUMBRE, PALAPA_CUMBRERA, PALAPA_POSTES,
  CABANAS, PALMERAS_N, PALMERAS_S, PARKING, EDIF, PUERTA, TOTAL_X, MESAS, PICNIC, ESCENARIO,
  BARRA, CAMION, MULTITUD, GENTE_SUELTA, CENTRO, type Pt,
} from "@/lib/recinto.geo";

/**
 * LÁMINA — EL RECINTO. Un solo dibujo que se explica solo.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * TERCERA VERSIÓN DEL DIBUJO (6-sep-2026, noche)
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Daniel, viendo la segunda: «poco detallado, no veo mesas, veo cosas que no
 * me dicen nada, necesito todo animado, de lo que vaya hablando, como lo
 * hacemos en Loymark Academy» y «el dibujo no encaja con las fotos».
 *
 * Tres cosas cambian aquí:
 *
 *  1. LA GEOMETRÍA ES LA DE LAS FOTOS (ver `lib/recinto.geo.ts`): el paseo por
 *     el centro, la palapa grande pegada al paseo, las cabañas como pérgolas de
 *     listones al otro lado, palmeras en dos hileras, setos y estacionamiento
 *     fuera, y el edificio cerrando el fondo con su puerta donde acaba el paseo.
 *
 *  2. OBJETOS REALES, no símbolos: mesas redondas con sus diez sillas, pérgolas
 *     con postes y listones, un camión con cabina y ruedas, un escenario con
 *     tarima, truss, focos y torres de sonido, una barra con taburetes, mesas de
 *     picnic, coches en el estacionamiento, gente.
 *
 *  3. CAPAS ADITIVAS que el guion encien de frase a frase (`data-capas`): los
 *     pasillos entre mesas cuando la voz dice «sobra pasillo», los postes cuando
 *     dice «postes de madera», el truss y después los focos cuando el escenario
 *     se monta. Cada objeto entra CON PESO —caída corta, rebote, escala—, que es
 *     la regla de Loymark Academy: lo que se anima es lo que se está diciendo.
 *
 * Lo que no cambia: papel y tinta, Fraunces, el ocre solo para lo que es
 * respuesta, todo generado por código, y el dibujo se sigue dirigiendo desde el
 * recorrido con `modoDirigido`, `zonaDirigida`, `puntoDirigido`, `zoomDirigido`
 * y ahora `capasDirigidas`.
 */

export type Modo = "todo" | "lluvia" | "carpa" | "mesas" | "gente" | "camion" | "noche" | "barra";
export type Zona = "jardin" | "tiki" | "cabanas" | "acceso" | "edificio";
type Fase = "pendiente" | "dibujar" | "listo" | "quieto";

export interface FotoDirigida { src: string; pos: string; alt: string; tamano?: "lleno" | "postal" }
export interface Aforo { invitados: number; formato: "sentados" | "pie" }

const TINTA = "#211c15", GRIS = "#8a8071", OCRE = "#c4772b", PAPEL = "#fbf8f1", LUZ = "#f3e2c4";

const G: Geo = crearGeo(U, 0, 0, 0);
const CAJA = G.caja(TOTAL_X, LOTE.dy + PARKING.dy * 2, PALAPA_CUMBRE, 0);
// El encuadre: a la izquierda cabe la calle, arriba el estacionamiento norte, abajo la cota.
const VB = { x: CAJA.x - 60, y: CAJA.y - 52, w: CAJA.w + 60 + 30, h: CAJA.h + 52 + 46 };
export const PROPORCION = VB.w / VB.h;
export { CENTRO };

const frac = (q: Pt): Pt => [(q[0] - VB.x) / VB.w, (q[1] - VB.y) / VB.h];
const poly = (...q: Pt[]) => q.map((c, i) => `${i ? "L" : "M"}${c[0].toFixed(1)},${c[1].toFixed(1)}`).join(" ") + " Z";
const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const cssVars = (o: Record<string, string | number>) => o as CSSProperties;
const K1 = 1.2247, K2 = 0.7071; // una circunferencia en planta es una elipse en isométrica

function lcg(semilla: number) {
  let s = semilla >>> 0;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}

// ── piezas ─────────────────────────────────────────────────────────────────

/** Prisma con las dos caras visibles y la tapa. */
function Caja({ g, x, y, dx, dy, z0 = 0, z1, tapa, izq, der, borde = TINTA, w = 0.9, clase = "", animado = true, dash }: {
  g: Geo; x: number; y: number; dx: number; dy: number; z0?: number; z1: number;
  tapa: string; izq: string; der: string; borde?: string; w?: number; clase?: string; animado?: boolean; dash?: string;
}) {
  const { techo, frente, lado } = g;
  const cl = animado ? "rl tz" : "";
  const pl = animado ? { pathLength: 1 } : {};
  const sd = dash ? { strokeDasharray: dash } : {};
  return (
    <g className={clase}>
      <path className={cl} d={frente(x, y + dy, dx, z0, z1)} fill={izq} stroke={borde} strokeWidth={w} {...pl} {...sd} />
      <path className={cl} d={lado(x + dx, y, dy, z0, z1)} fill={der} stroke={borde} strokeWidth={w} {...pl} {...sd} />
      <path className={cl} d={techo(x, y, dx, dy, z1)} fill={tapa} stroke={borde} strokeWidth={w} {...pl} {...sd} />
    </g>
  );
}

function Seto({ g, x, y, dx, dy }: { g: Geo; x: number; y: number; dx: number; dy: number }) {
  return <Caja g={g} x={x} y={y} dx={dx} dy={dy} z1={SETO.alto} tapa="#cfc9b1" izq="#c1ba9f" der="#b5ad93" borde={GRIS} w={0.6} />;
}

function copa(g: Geo, x: number, y: number, alto = 20): Pt {
  const [a, b] = g.p(x, y, 0);
  return [a, b - alto * U];
}

/** Palmera real: tronco con curva, ocho frondas, sombra en el suelo. Se mece. */
function Palma({ g, x, y, alto = 20, i }: { g: Geo; x: number; y: number; alto?: number; i: number }) {
  const [a, b] = g.p(x, y, 0);
  const h = alto * U;
  return (
    <g transform={`translate(${a.toFixed(1)},${b.toFixed(1)})`}>
      <ellipse className="rl" cx="2" cy="1.2" rx="7.5" ry="2.6" fill={TINTA} opacity="0.08" />
      <g className="palma" style={cssVars({ "--v": `${(5.6 + (i % 5) * 0.7).toFixed(1)}s`, "--vd": `${(-(i % 7) * 0.9).toFixed(1)}s` })}>
        <path className="tz" pathLength={1}
              d={`M0,0 C1.2,${(-h * 0.4).toFixed(1)} -1.2,${(-h * 0.7).toFixed(1)} 0.6,${(-h).toFixed(1)}`}
              fill="none" stroke="#6f6656" strokeWidth="1.35" strokeLinecap="round" />
        {[-1.45, -1.0, -0.55, -0.18, 0.18, 0.55, 1.0, 1.45].map((t, k) => (
          <path key={k} className="tz" pathLength={1}
                d={`M0.6,${(-h).toFixed(1)} q${(Math.sin(t) * 11).toFixed(1)},${(-5.5 - Math.abs(Math.cos(t)) * 4).toFixed(1)} ${(Math.sin(t) * 19).toFixed(1)},${(2.2 + Math.abs(Math.cos(t)) * 3).toFixed(1)}`}
                fill="none" stroke="#5c5445" strokeWidth="1.05" strokeLinecap="round" />
        ))}
      </g>
    </g>
  );
}

function Persona({ g, x, y, tono = "#3e3a34", clase = "ap" }: { g: Geo; x: number; y: number; tono?: string; clase?: string }) {
  const [a, b] = g.p(x, y, 0);
  return (
    <g className={clase} transform={`translate(${a.toFixed(1)},${b.toFixed(1)})`} opacity="0.7">
      <circle cx="0" cy="-13.2" r="2" fill={tono} />
      <path d="M0,-11 L0,-5 M0,-9.6 L-2.8,-6.8 M0,-9.6 L2.8,-6.8 M0,-5 L-2.4,0 M0,-5 L2.4,0"
            stroke={tono} strokeWidth="1.1" fill="none" strokeLinecap="round" />
    </g>
  );
}

/**
 * LA PALAPA como en las fotos: un techo largo a cuatro aguas con cumbrera,
 * paja marcada con muchas líneas finas, alero bajo y postes en tres hileras.
 * Debajo, césped. Las cuatro caras se ven porque la pendiente es suave.
 */
function Palapa({ g }: { g: Geo }) {
  const { p } = g;
  const { x, y, dx, dy } = PALAPA;
  const cx = x + dx / 2, cy = y + dy / 2;
  const A = p(x, y, PALAPA_ALERO), B = p(x + dx, y, PALAPA_ALERO), C = p(x + dx, y + dy, PALAPA_ALERO), D = p(x, y + dy, PALAPA_ALERO);
  const R1 = p(cx - PALAPA_CUMBRERA / 2, cy, PALAPA_CUMBRE), R2 = p(cx + PALAPA_CUMBRERA / 2, cy, PALAPA_CUMBRE);
  const caras: Array<{ pts: [Pt, Pt, Pt, Pt]; tono: string; n: number }> = [
    { pts: [A, B, R2, R1], tono: "#8f8574", n: 7 }, // norte, atrás
    { pts: [D, A, R1, R1], tono: "#7d7362", n: 5 }, // oeste
    { pts: [B, C, R2, R2], tono: "#6b6253", n: 5 }, // este
    { pts: [C, D, R1, R2], tono: "#5a5244", n: 7 }, // sur, la que da al paseo
  ];
  const postes = PALAPA_POSTES.slice().sort((m, n) => m[0] + m[1] - (n[0] + n[1]));
  return (
    <g className="palapa">
      {postes.map(([px, py]) => {
        const a = p(px, py, 0), b = p(px, py, PALAPA_ALERO);
        return <line key={`${px}-${py}`} className="tz poste" pathLength={1} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#3e3a34" strokeWidth="1.5" />;
      })}
      {caras.map((c, i) => (
        <g key={i}>
          <path className="rl tz palapa-cara" pathLength={1} d={poly(...c.pts)} fill={c.tono} stroke={TINTA} strokeWidth="1" strokeLinejoin="round" />
          {Array.from({ length: c.n }, (_, k) => (k + 1) / (c.n + 1)).map((t) => {
            const u = lerp(c.pts[0], c.pts[3], t), v = lerp(c.pts[1], c.pts[2], t);
            return <line key={t} className="ap" x1={u[0]} y1={u[1]} x2={v[0]} y2={v[1]} stroke={PAPEL} strokeWidth="0.5" opacity="0.38" />;
          })}
        </g>
      ))}
      {/* el alero de paja: una franja rugosa que cuelga del borde */}
      <path className="tz palapa-cubierta" pathLength={1} d={poly(A, B, C, D)} fill="none" stroke={TINTA} strokeWidth="1.6" strokeLinejoin="round" />
      <line className="tz palapa-cubierta" pathLength={1} x1={R1[0]} y1={R1[1]} x2={R2[0]} y2={R2[1]} stroke={TINTA} strokeWidth="1.4" />
      {[D, C].map((q, i) => {
        const otro = i === 0 ? C : B;
        return Array.from({ length: 22 }, (_, k) => k / 21).map((t) => {
          const m = lerp(q, otro, t);
          return <line key={`${i}-${t}`} className="ap" x1={m[0]} y1={m[1]} x2={m[0] + (t % 0.1 < 0.05 ? 0.6 : -0.6)} y2={m[1] + 2.4} stroke="#5a5244" strokeWidth="0.7" opacity="0.7" />;
        });
      })}
    </g>
  );
}

/** Cabaña-pérgola: cuatro postes, un marco y siete listones blancos; dentro, un sofá. */
function Cabana({ g, x, i }: { g: Geo; x: number; i: number }) {
  const { p, techo } = g;
  const { y, dx, dy, h } = CABANAS;
  const esquinas: Pt[] = [[x, y], [x + dx, y], [x + dx, y + dy], [x, y + dy]];
  const listones = [];
  for (let t = 1.2; t < dx; t += 1.6) {
    const a = p(x + t, y, h), b = p(x + t, y + dy, h);
    listones.push(<line key={t} className="ap" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#f4efe6" strokeWidth="0.75" />);
  }
  return (
    <g className="cabana" style={cssVars({ "--i": i })}>
      <path className="rl" d={techo(x, y, dx, dy, 0.03)} fill="#e6dfd0" />
      {esquinas.map(([ex, ey], k) => {
        const a = p(ex, ey, 0), b = p(ex, ey, h);
        return <line key={k} className="tz" pathLength={1} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#6b6151" strokeWidth="1.1" />;
      })}
      {/* el sofá */}
      <Caja g={g} x={x + 2} y={y + dy - 4.5} dx={dx - 4} dy={2.5} z1={1.6} tapa="#ddd6c6" izq="#d3ccbb" der="#c9c1af" borde={GRIS} w={0.5} />
      <path className="tz" pathLength={1} d={techo(x, y, dx, dy, h)} fill="#f7f3ea" fillOpacity="0.55" stroke="#6b6151" strokeWidth="1" />
      {listones}
    </g>
  );
}

/** Mesa redonda de diez con sus diez sillas. Entra con peso, silla a silla. */
function Mesa({ g, x, y, i }: { g: Geo; x: number; y: number; i: number }) {
  const [a, b] = g.p(x, y, 0);
  const sillas = Array.from({ length: 10 }, (_, k) => {
    const an = (k / 10) * Math.PI * 2;
    const sx = x + Math.cos(an) * 4.2, sy = y + Math.sin(an) * 4.2;
    const [qa, qb] = g.p(sx, sy, 0);
    return { dx: qa - a, dy: qb - b, k };
  });
  return (
    <g transform={`translate(${a.toFixed(1)},${b.toFixed(1)})`}>
      <g className="mesa" style={cssVars({ "--i": i })}>
        <ellipse rx={5.6 * U * K1} ry={5.6 * U * K2} fill={OCRE} opacity="0.08" />
        <ellipse rx={2.6 * U * K1} ry={2.6 * U * K2} fill="#fbf8f1" stroke={OCRE} strokeWidth="1.1" />
        <ellipse rx={1.1 * U * K1} ry={1.1 * U * K2} fill={OCRE} opacity="0.35" />
        {sillas.map((s) => (
          <ellipse key={s.k} className="silla" style={cssVars({ "--k": s.k })} cx={s.dx.toFixed(1)} cy={s.dy.toFixed(1)} rx={0.75 * U * K1} ry={0.75 * U * K2} fill={OCRE} opacity="0.9" />
        ))}
      </g>
    </g>
  );
}

/** Mesa de picnic fija: tablero y dos bancos. */
function Picnic({ g, x, y }: { g: Geo; x: number; y: number }) {
  return (
    <g className="picnic">
      <Caja g={g} x={x} y={y - 1} dx={6} dy={2.2} z1={2.4} tapa="#d8d0be" izq="#cec6b3" der="#c3bba8" borde={GRIS} w={0.55} animado={false} />
      <Caja g={g} x={x} y={y - 3.2} dx={6} dy={1} z1={1.4} tapa="#d8d0be" izq="#cec6b3" der="#c3bba8" borde={GRIS} w={0.45} animado={false} />
      <Caja g={g} x={x} y={y + 2.4} dx={6} dy={1} z1={1.4} tapa="#d8d0be" izq="#cec6b3" der="#c3bba8" borde={GRIS} w={0.45} animado={false} />
    </g>
  );
}

/** Coche en planta isométrica: caja baja con capó y techo. */
function Coche({ g, x, y, tono }: { g: Geo; x: number; y: number; tono: string }) {
  return (
    <g className="coche">
      <Caja g={g} x={x} y={y} dx={15} dy={7} z1={2.6} tapa={tono} izq={tono} der={tono} borde={GRIS} w={0.5} animado={false} />
      <Caja g={g} x={x + 4} y={y + 0.8} dx={7} dy={5.4} z0={2.6} z1={4.6} tapa="#e9e4d8" izq="#dad4c6" der="#cfc8b9" borde={GRIS} w={0.45} animado={false} />
    </g>
  );
}

/** El camión de 40 ft: caja, cabina y seis ruedas. */
function Camion({ g }: { g: Geo }) {
  const { x, y, dx, dy, h } = CAMION;
  const ruedas = [x + 4, x + 12, x + dx - 6, x + dx - 3].map((rx) => g.p(rx, y + dy, 0));
  return (
    <g>
      <Caja g={g} x={x + 9} y={y} dx={dx - 9} dy={dy} z0={1.6} z1={h} tapa="#fbf8f1" izq="#f3eee4" der="#ece6d9" borde={OCRE} w={1.2} animado={false} />
      <Caja g={g} x={x} y={y} dx={8} dy={dy} z0={1.6} z1={9} tapa="#fbf8f1" izq="#f3eee4" der="#ece6d9" borde={OCRE} w={1.2} animado={false} />
      {ruedas.map(([a, b], k) => <ellipse key={k} cx={a.toFixed(1)} cy={(b - 1.2).toFixed(1)} rx="2.6" ry="1.6" fill={TINTA} />)}
    </g>
  );
}

/** El montaje tipo de noche: escenario con truss y focos, torres de sonido, barra con taburetes, guirnaldas y público. */
function Noche({ g }: { g: Geo }) {
  const { p } = g;
  const cadenas: Array<[Pt, Pt]> = [];
  for (let i = 0; i < PALMERAS_N.length - 1; i++) cadenas.push([copa(g, ...PALMERAS_N[i]), copa(g, ...PALMERAS_N[i + 1])]);
  for (let i = 0; i < PALMERAS_S.length - 1; i++) cadenas.push([copa(g, ...PALMERAS_S[i]), copa(g, ...PALMERAS_S[i + 1])]);
  for (let i = 0; i < Math.min(PALMERAS_N.length, PALMERAS_S.length); i++) cadenas.push([copa(g, ...PALMERAS_N[i]), copa(g, ...PALMERAS_S[i])]);
  const bombillas: Array<{ q: Pt; i: number }> = [];
  let k = 0;
  const hilos = cadenas.map(([a, b], j) => {
    const c: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 7];
    for (let t = 0.12; t < 0.92; t += 0.13) {
      const u = 1 - t;
      bombillas.push({ q: [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]], i: k++ });
    }
    return <path key={j} className="noche-hilo" d={`M${a[0].toFixed(1)},${a[1].toFixed(1)} Q${c[0].toFixed(1)},${c[1].toFixed(1)} ${b[0].toFixed(1)},${b[1].toFixed(1)}`} fill="none" stroke={LUZ} strokeWidth="0.45" opacity="0.5" />;
  });

  const E = ESCENARIO;
  const m1a = p(E.x, E.y, E.h), m1b = p(E.x, E.y, E.truss);
  const m2a = p(E.x, E.y + E.dy, E.h), m2b = p(E.x, E.y + E.dy, E.truss);
  const focos = [0.15, 0.32, 0.5, 0.68, 0.85].map((t) => lerp(m1b, m2b, t));
  const haz = (f: Pt, s: number) => `M${f[0].toFixed(1)},${f[1].toFixed(1)} L${(f[0] - 26 * s).toFixed(1)},${(f[1] + 40).toFixed(1)} L${(f[0] - 6 * s).toFixed(1)},${(f[1] + 44).toFixed(1)} Z`;
  const cP = p(BARRA.x + BARRA.dx / 2, BARRA.y - 8, 0);
  const taburetes = Array.from({ length: 6 }, (_, i) => g.p(BARRA.x + 3 + i * 5, BARRA.y + BARRA.dy + 2.2, 0));

  return (
    <g className="noche" pointerEvents="none">
      {/* luz cálida bajo la palapa, donde está la barra */}
      <g className="capa capa-barra-luz">
        <ellipse cx={cP[0].toFixed(1)} cy={cP[1].toFixed(1)} rx="70" ry="30" fill={OCRE} opacity="0.12" />
        <ellipse cx={cP[0].toFixed(1)} cy={cP[1].toFixed(1)} rx="38" ry="15" fill={OCRE} opacity="0.12" />
      </g>

      {/* el público, mirando al escenario */}
      <g className="capa capa-publico">
        {MULTITUD.filter((_, i) => i % 2 === 0).map(([x, y], i) => {
          const [a, b] = p(x, y, 0);
          return <circle key={i} className="noche-persona" style={cssVars({ "--i": i })} cx={a.toFixed(1)} cy={b.toFixed(1)} r="0.9" fill={LUZ} opacity="0.75" />;
        })}
      </g>

      {/* la barra del cliente, con taburetes */}
      <g className="capa capa-barra-luz">
        <Caja g={g} x={BARRA.x} y={BARRA.y} dx={BARRA.dx} dy={BARRA.dy} z1={BARRA.h} tapa="#3a3327" izq="#2e2920" der="#26211a" borde={LUZ} w={0.9} animado={false} />
        {taburetes.map(([a, b], i) => <circle key={i} cx={a.toFixed(1)} cy={b.toFixed(1)} r="1.4" fill="none" stroke={LUZ} strokeWidth="0.7" />)}
      </g>

      {/* el escenario: tarima, torres de sonido, truss, focos */}
      <g className="capa capa-tarima">
        <Caja g={g} x={E.x} y={E.y} dx={E.dx} dy={E.dy} z1={E.h} tapa="#3a3327" izq="#2e2920" der="#26211a" borde={LUZ} w={1} animado={false} />
      </g>
      <g className="capa capa-sonido">
        <Caja g={g} x={E.x + 3} y={E.y - 5} dx={4} dy={4} z1={9} tapa="#2e2920" izq="#26211a" der="#1e1a14" borde={LUZ} w={0.7} animado={false} />
        <Caja g={g} x={E.x + 3} y={E.y + E.dy + 1} dx={4} dy={4} z1={9} tapa="#2e2920" izq="#26211a" der="#1e1a14" borde={LUZ} w={0.7} animado={false} />
      </g>
      <g className="capa capa-truss">
        <line x1={m1a[0]} y1={m1a[1]} x2={m1b[0]} y2={m1b[1]} stroke={LUZ} strokeWidth="1" />
        <line x1={m2a[0]} y1={m2a[1]} x2={m2b[0]} y2={m2b[1]} stroke={LUZ} strokeWidth="1" />
        <line x1={m1b[0]} y1={m1b[1]} x2={m2b[0]} y2={m2b[1]} stroke={LUZ} strokeWidth="1.2" />
        <line x1={m1b[0]} y1={m1b[1] + 2.2} x2={m2b[0]} y2={m2b[1] + 2.2} stroke={LUZ} strokeWidth="0.6" opacity="0.7" />
        {Array.from({ length: 9 }, (_, i) => lerp(m1b, m2b, i / 8)).map((q, i) => (
          <line key={i} x1={q[0]} y1={q[1]} x2={q[0] + (i % 2 ? 2.2 : -2.2)} y2={q[1] + 2.2} stroke={LUZ} strokeWidth="0.5" opacity="0.7" />
        ))}
      </g>
      <g className="capa capa-luces">
        {focos.map((f, i) => (
          <g key={i} className="noche-foco" style={cssVars({ "--i": i })}>
            <path d={haz(f, i % 2 ? 1 : -0.6)} fill={OCRE} opacity="0.07" />
            <circle cx={f[0].toFixed(1)} cy={f[1].toFixed(1)} r="4.5" fill={OCRE} opacity="0.22" />
            <circle cx={f[0].toFixed(1)} cy={f[1].toFixed(1)} r="1.4" fill={OCRE} />
          </g>
        ))}
      </g>

      {/* las guirnaldas entre las palmeras y sobre el paseo */}
      <g className="capa capa-guirnaldas">
        {hilos}
        {bombillas.map(({ q, i }) => (
          <g key={i} className="noche-bombilla" style={cssVars({ "--i": i })}>
            <circle cx={q[0].toFixed(1)} cy={q[1].toFixed(1)} r="2.4" fill={OCRE} opacity="0.18" />
            <circle cx={q[0].toFixed(1)} cy={q[1].toFixed(1)} r="0.75" fill={LUZ} />
          </g>
        ))}
      </g>
    </g>
  );
}

function Cota({ g, a, b, texto, giro }: { g: Geo; a: [number, number, number?]; b: [number, number, number?]; texto: string; giro: 30 | -30 }) {
  const A = g.p(a[0], a[1], a[2] ?? 0), B = g.p(b[0], b[1], b[2] ?? 0);
  const an = Math.atan2(B[1] - A[1], B[0] - A[0]), f = 4.4;
  const punta = (q: Pt, s: number) =>
    `M${(q[0] + Math.cos(an + 0.4) * f * s).toFixed(1)},${(q[1] + Math.sin(an + 0.4) * f * s).toFixed(1)} L${q[0].toFixed(1)},${q[1].toFixed(1)} L${(q[0] + Math.cos(an - 0.4) * f * s).toFixed(1)},${(q[1] + Math.sin(an - 0.4) * f * s).toFixed(1)}`;
  const m: Pt = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
  return (
    <g className="ap" opacity="0.85">
      <line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke={GRIS} strokeWidth="0.6" />
      <path d={punta(A, 1)} fill="none" stroke={GRIS} strokeWidth="0.6" />
      <path d={punta(B, -1)} fill="none" stroke={GRIS} strokeWidth="0.6" />
      <text transform={`translate(${m[0].toFixed(1)},${m[1].toFixed(1)}) rotate(${giro})`} y={giro > 0 ? 11 : -6}
            fill={GRIS} fontFamily="ui-monospace,monospace" fontSize="8" letterSpacing="1.4" textAnchor="middle">{texto}</text>
    </g>
  );
}

// ── textos ─────────────────────────────────────────────────────────────────

const T = {
  es: {
    ojo: "Plano del recinto · vista isométrica",
    titulo: "Recinto de 240 × 96 ft con palapa techada de ~4 000 ft².",
    intro: "Vista desde la calle hacia el edificio, a partir de la superficie declarada y las fotografías aéreas. Selecciona una zona para ver su ficha, o activa una capa de montaje: plan de lluvia, aforo sentado, load-in o montaje nocturno.",
    aria: "Isométrica del recinto: un paseo pavimentado central de la calle al edificio, la palapa de paja pegada al paseo por el norte, ocho cabañas-pérgola al sur, dos hileras de palmeras, setos perimetrales y estacionamiento a ambos lados. Al fondo, el edificio de dos niveles con la puerta donde termina el paseo.",
    modos: { todo: "Vista general", lluvia: "Plan de lluvia", mesas: "Aforo sentado · 300", camion: "Load-in · camión 40 ft", noche: "Montaje nocturno" } as Partial<Record<Modo, string>>,
    explica: {
      todo: "Lo techado va en tinta y lo abierto en claro. El paseo cruza el recinto de la calle al edificio y es por donde entra todo. Fuera de los setos, el estacionamiento.",
      lluvia: "La palapa cubre ~4 000 ft² con techo de paja, abierta por los cuatro costados: para el sol y el agua que cae recta. Lo demás queda al aire, y para un evento de invierno conviene carpa lateral.",
      carpa: "Con viento la lluvia entra de lado. Para un evento de invierno se cierran los costados con carpa lateral, que trae tu proveedor: aquí va dibujada a trazos.",
      mesas: "Treinta mesas de diez con sus sillas, a escala: veinte bajo la palapa y diez en el césped junto al paseo. Son los ~300 sentados verificados, con pasillo de servicio entre mesas.",
      gente: "Seiscientas personas de pie, a ocho pies cuadrados cada una, bajo la palapa y a lo largo del césped. Es el aforo verificado, dibujado.",
      camion: "Por NW 1st Ct al paseo pavimentado, continuo y a nivel: un camión de 40 ft llega hasta la puerta del edificio sin pisar césped.",
      noche: "Un montaje posible, de noche: escenario al fondo del césped, tu barra bajo la palapa, público de pie y guirnaldas entre las palmeras. Todo lo encendido lo trae tu equipo; la luz colgada se aprueba en la visita.",
      barra: "Bajo la palapa, del lado del paseo, hay sitio para montar barra. La barra la trae tu equipo: aquí va dibujada a trazos, donde suele ir.",
    } as Record<Modo, string>,
    zonas: {
      jardin: {
        nombre: "El Jardín", dato: "~18 000 ft² · al aire libre",
        lee: "Césped artificial a los dos lados del paseo, dos hileras de palmeras reales y setos perimetrales con estacionamiento detrás.",
        sirve: "Es el volumen del recinto: recepción de pie, cena larga a lo largo del paseo o escenario al fondo con público en el césped. El paseo lo parte en dos franjas, y esa geometría manda en cualquier montaje.",
        ojo: "Al aire libre y sin cerramiento. El césped es artificial, así que no se embarra; para cargas puntuales hay que repartir apoyo.",
      },
      tiki: {
        nombre: "El Tiki Hut", dato: "~4 000 ft² · techado",
        lee: "Palapa de paja a cuatro aguas con cumbrera larga, sobre postes de madera en tres hileras, pegada al paseo y abierta por los cuatro costados. Es el plan de lluvia.",
        sirve: "La sombra permanente del recinto. Caben veinte mesas de diez, la barra del cliente del lado del paseo, o un escenario pequeño.",
        ojo: "Para el agua que cae recta basta sola; con viento conviene cerrar los costados. La luz libre entre postes se levanta en la visita.",
      },
      cabanas: {
        nombre: "Ocho cabañas", dato: "pérgolas amuebladas · en hilera",
        lee: "Pérgolas de postes y listones blancos, abiertas, con sofá, al otro lado del paseo entre las palmeras.",
        sirve: "Camerino, guardarropa, salón VIP o rincón de descanso sin tener que montar nada.",
        ojo: "Van con el predio: no se pueden mover ni retirar del montaje.",
      },
      acceso: {
        nombre: "Acceso", dato: "NW 1st Ct · al paseo",
        lee: "Desde la calle, la producción entra directo al paseo pavimentado, continuo y a nivel hasta la puerta del edificio.",
        sirve: "Por aquí entra todo: camión, catering, estructura y escenario, sin pisar césped. Estacionamiento a los dos lados del predio.",
        ojo: "El ancho exacto del portón y la potencia eléctrica disponible se levantan contigo en la visita y se entregan por escrito.",
      },
      edificio: {
        nombre: "El edificio", dato: "zona 02 · 2 niveles",
        lee: "Cierra el fondo del recinto: el paseo termina en su puerta. El cascarón se alquila aparte y tiene su propia lámina, con 22 ft libres en la doble altura.",
        sirve: "Es la zona 02 y va por separado. Sirve si el evento necesita interior además del jardín: camerinos, cocina de catering o plan B completo.",
        ojo: "Lo que hay montado hoy dentro pertenece al operador del inmueble y no forma parte de lo que se alquila.",
      },
    } as Record<Zona, { nombre: string; dato: string; lee: string; sirve: string; ojo: string }>,
    cajetin: ["Club Wynwood", "El recinto · zona 01", "Vista desde la calle · sin escala"],
    escala: "50 ft",
    calle: "NW 1ST CT",
    parking: "ESTACIONAMIENTO",
    nota: "Esquema volumétrico, sin escala: las proporciones salen de las fotografías aéreas y las superficies de las declaradas; se confirman en la visita técnica. Lo techado se dibuja en tinta y lo abierto en claro. El montaje de noche es un ejemplo: todo lo encendido lo trae el cliente.",
  },
  en: {
    ojo: "Site plan · isometric view",
    titulo: "A 240 × 96 ft site with a ~4,000 sq ft thatched structure.",
    intro: "View from the street towards the building, from the declared area and the aerial photographs. Select a zone to see its data, or turn on a layout layer: rain plan, seated capacity, load-in or night setup.",
    aria: "Isometric of the site: a central paved walk from the street to the building, the thatched structure against the walk on the north side, eight pergola cabanas on the south, two rows of palms, perimeter hedges and parking on both sides. At the far end, the two-level building with its door where the walk ends.",
    modos: { todo: "Overview", lluvia: "Rain plan", mesas: "Seated capacity · 300", camion: "Load-in · 40 ft truck", noche: "Night setup" } as Partial<Record<Modo, string>>,
    explica: {
      todo: "Roofed volumes are drawn in ink, open ground in light tone. The walk crosses the site from the street to the building, and it is how everything gets in. Beyond the hedges, parking.",
      lluvia: "The structure covers ~4,000 sq ft under thatch, open on all four sides: it stops sun and vertical rain. The rest stays open-air, and a winter event should budget for side tenting.",
      carpa: "With wind, rain comes in sideways. A winter event closes the sides with side tenting, which your supplier brings: here it is drawn dashed.",
      mesas: "Thirty tables of ten with their chairs, to scale: twenty under the structure and ten on the turf by the walk. These are the verified ~300 seated, with service aisles between tables.",
      gente: "Six hundred people standing, at eight square feet each, under the structure and along the turf. That is the verified capacity, drawn.",
      camion: "From NW 1st Ct onto the paved walk, continuous and level: a 40 ft truck reaches the building door without crossing turf.",
      noche: "One possible setup, at night: a stage at the far end of the turf, your bar under the structure, a standing crowd and string lights between the palms. Everything lit is brought by your team; hung lighting is approved at the visit.",
      barra: "Under the structure, on the walk side, there is room to set up a bar. The bar comes with your team: here it is drawn dashed, where it usually goes.",
    } as Record<Modo, string>,
    zonas: {
      jardin: {
        nombre: "The Garden", dato: "~18,000 sq ft · open air",
        lee: "Artificial turf on both sides of the walk, two rows of real palms and perimeter hedges with parking behind them.",
        sirve: "This is the volume of the site: standing reception, a long dinner along the walk, or a stage at the far end with a crowd on the turf. The walk splits it into two strips, and that geometry drives any layout.",
        ojo: "Open air, no enclosure. The turf is artificial, so it will not turn to mud; point loads need spreading.",
      },
      tiki: {
        nombre: "The Tiki Hut", dato: "~4,000 sq ft · covered",
        lee: "A long four-hip thatch roof on three rows of timber posts, against the walk and open on all four sides. It is the rain plan.",
        sirve: "The site's permanent shade. It takes twenty tables of ten, the client's bar on the walk side, or a small stage.",
        ojo: "For vertical rain it is enough on its own; with wind you will want the sides closed. Clear span between posts is surveyed at the visit.",
      },
      cabanas: {
        nombre: "Eight cabanas", dato: "furnished pergolas · in a row",
        lee: "Open pergolas of posts and white slats, with a sofa, across the walk between the palms.",
        sirve: "Green room, coat check, VIP lounge or a quiet corner, without building anything.",
        ojo: "They come with the site: they cannot be moved or taken out of the layout.",
      },
      acceso: {
        nombre: "Access", dato: "NW 1st Ct · onto the walk",
        lee: "From the street, production drives straight onto the paved walk, continuous and level to the building door.",
        sirve: "Everything comes in here: truck, catering, rigging and stage, without crossing turf. Parking on both sides of the site.",
        ojo: "Exact gate width and available power are surveyed with you at the visit and delivered in writing.",
      },
      edificio: {
        nombre: "The building", dato: "zone 02 · 2 levels",
        lee: "It closes the far end of the site: the walk ends at its door. The shell is rented separately and has its own plate, with 22 ft clear in the double-height zone.",
        sirve: "It is zone 02 and goes separately. Useful if the event needs indoor space as well as the garden: green rooms, catering kitchen or a full plan B.",
        ojo: "Whatever is installed inside today belongs to the building's operator and is not part of the rental.",
      },
    } as Record<Zona, { nombre: string; dato: string; lee: string; sirve: string; ojo: string }>,
    cajetin: ["Club Wynwood", "The site · zone 01", "View from the street · not to scale"],
    escala: "50 ft",
    calle: "NW 1ST CT",
    parking: "PARKING",
    nota: "Volumetric diagram, not to scale: proportions come from the aerial photographs and areas from the declared figures; both are confirmed at the technical visit. Roofed volumes in ink, open ground in light tone. The night setup is an example: everything lit is brought by the client.",
  },
} as const;

const ORDEN_ZONAS: Zona[] = ["jardin", "tiki", "cabanas", "acceso", "edificio"];
const MODOS_MANUALES: Modo[] = ["todo", "lluvia", "mesas", "camion", "noche"];

// ── el dibujo, memorizado ──────────────────────────────────────────────────

/**
 * EL SVG VA APARTE Y MEMORIZADO: mientras la voz narra, el tiempo cambia varias
 * veces por segundo y el padre se repinta; el dibujo (~2 000 nodos) solo se
 * repinta cuando cambian la zona resaltada o el aforo. El modo y las capas ni
 * entran: los aplica el CSS por `data-modo` y `data-capas` en la raíz.
 */
const Dibujo = memo(function Dibujo({ lang, zona, aforo, alEntrar, alSalir, alTocar }: {
  lang: Idioma; zona: Zona | null; aforo?: Aforo;
  alEntrar: (z: Zona) => void; alSalir: (z: Zona) => void; alTocar: (z: Zona) => void;
}) {
  const t = T[lang];
  const g = G;
  const { p, techo } = g;

  const mesasN = aforo ? Math.min(MESAS.length, Math.ceil(Math.max(0, aforo.invitados) / 10)) : MESAS.length;
  const genteN = aforo ? Math.min(MULTITUD.length, Math.max(0, aforo.invitados)) : MULTITUD.length;

  const zClase = (z: Zona) => `z z-${z}${zona === z ? " activa" : ""}`;
  const zProps = (z: Zona) => ({ onMouseEnter: () => alEntrar(z), onMouseLeave: () => alSalir(z), onClick: () => alTocar(z) });

  const d0 = p(0, 0, 0), d1 = p(1, 0, 0);
  const desplazamiento = { cx: -(CAMION.recorrido * (d1[0] - d0[0])), cy: -(CAMION.recorrido * (d1[1] - d0[1])) };

  const azar = lcg(20260902);
  const GOTAS = Array.from({ length: 130 }, () => ({ x: VB.x + azar() * VB.w, y: VB.y + azar() * VB.h, t: -(azar() * 1.1).toFixed(2) }));

  // Juntas del pavimento, cada 12 ft, como en la foto.
  const juntas = [];
  for (let x = 12; x < LOTE.dx; x += 12) {
    const a = p(x, PASEO.y, 0.05), b = p(x, PASEO.y + PASEO.dy, 0.05);
    juntas.push(<line key={x} className="ap" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#cfc7b6" strokeWidth="0.6" />);
  }

  // Estacionamiento: plazas y coches a ambos lados.
  const plazas = [];
  const coches = [];
  const tonos = ["#d9d3c6", "#c9c2b3", "#e2ddd1", "#bdb6a6", "#d2cbbd"];
  for (const lado of [0, 1]) {
    const y0 = lado === 0 ? -PARKING.dy : LOTE.dy;
    for (let i = 0; i <= PARKING.plazas; i++) {
      const x = 8 + i * PARKING.largo;
      const a = p(x, y0 + 0.5, 0.02), b = p(x, y0 + PARKING.dy - 0.5, 0.02);
      plazas.push(<line key={`${lado}-${i}`} className="ap" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#cfc7b6" strokeWidth="0.5" />);
    }
    for (let i = 0; i < PARKING.plazas; i++) {
      if ((i * 7 + lado * 3) % 3 === 1) continue; // plazas libres
      coches.push(<Coche key={`c${lado}-${i}`} g={g} x={9 + i * PARKING.largo} y={y0 + 5} tono={tonos[(i + lado) % tonos.length]} />);
    }
  }

  const flechaA = p(-38, PASEO.y + PASEO.dy / 2, 0), flechaB = p(-6, PASEO.y + PASEO.dy / 2, 0);
  const anF = Math.atan2(flechaB[1] - flechaA[1], flechaB[0] - flechaA[0]);
  const punta = `M${(flechaB[0] - Math.cos(anF - 0.5) * 7).toFixed(1)},${(flechaB[1] - Math.sin(anF - 0.5) * 7).toFixed(1)} L${flechaB[0].toFixed(1)},${flechaB[1].toFixed(1)} L${(flechaB[0] - Math.cos(anF + 0.5) * 7).toFixed(1)},${(flechaB[1] - Math.sin(anF + 0.5) * 7).toFixed(1)}`;
  const calleTxt = p(-24, PASEO.y - 14, 0);

  const o = p(120, 46, 0), n = p(120, 36, 0);
  const radN = Math.atan2(n[1] - o[1], n[0] - o[0]);
  const angN = (radN * 180) / Math.PI + 90;

  // La puerta del edificio, al final del paseo (cara oeste del primer volumen).
  const puerta = poly(p(EDIF.x, PUERTA.y + PARKING.dy - PARKING.dy, 0), p(EDIF.x, PUERTA.y + PUERTA.dy, 0), p(EDIF.x, PUERTA.y + PUERTA.dy, PUERTA.h), p(EDIF.x, PUERTA.y, PUERTA.h));
  const ventanas = [];
  for (let k = 0; k < 5; k++) {
    const y = PARKING.dy + 8 + k * 16;
    ventanas.push(<path key={k} className="ap" d={poly(p(EDIF.x + EDIF.corte, y - PARKING.dy, 14), p(EDIF.x + EDIF.corte, y + 9 - PARKING.dy, 14), p(EDIF.x + EDIF.corte, y + 9 - PARKING.dy, 19), p(EDIF.x + EDIF.corte, y - PARKING.dy, 19))} fill="#e2ddd1" stroke={GRIS} strokeWidth="0.5" />);
  }

  // Los cuatro costados abiertos de la palapa: flechas hacia fuera.
  const lados: Array<[Pt, Pt]> = [
    [p(PALAPA.x + PALAPA.dx / 2, PALAPA.y, 5), p(PALAPA.x + PALAPA.dx / 2, PALAPA.y - 8, 5)],
    [p(PALAPA.x + PALAPA.dx / 2, PALAPA.y + PALAPA.dy, 5), p(PALAPA.x + PALAPA.dx / 2, PALAPA.y + PALAPA.dy + 8, 5)],
    [p(PALAPA.x, PALAPA.y + PALAPA.dy / 2, 5), p(PALAPA.x - 8, PALAPA.y + PALAPA.dy / 2, 5)],
    [p(PALAPA.x + PALAPA.dx, PALAPA.y + PALAPA.dy / 2, 5), p(PALAPA.x + PALAPA.dx + 8, PALAPA.y + PALAPA.dy / 2, 5)],
  ];

  // Pasillos de servicio entre las hileras de mesas bajo la palapa.
  const pasillos = [1.5, 2.5].map((f) => [p(PALAPA.x + 4, PALAPA.y + 5 + f * 10, 0.1), p(PALAPA.x + PALAPA.dx - 4, PALAPA.y + 5 + f * 10, 0.1)] as [Pt, Pt]);

  const cxP = PALAPA.x + PALAPA.dx / 2, cyP = PALAPA.y + PALAPA.dy / 2;
  const ROTULOS = [
    { zona: "jardin" as Zona, ancla: p(200, 22, 0), dx: 26, dy: -58 },
    { zona: "tiki" as Zona, ancla: p(cxP, cyP, PALAPA_CUMBRE), dx: -20, dy: -46 },
    { zona: "cabanas" as Zona, ancla: p(CABANAS.x + 3 * CABANAS.paso + 6, CABANAS.y + 6, CABANAS.h), dx: -24, dy: 62 },
    { zona: "acceso" as Zona, ancla: p(-8, PASEO.y + PASEO.dy / 2, 0), dx: -16, dy: -40 },
    { zona: "edificio" as Zona, ancla: p(EDIF.x + EDIF.corte + 18, 30, EDIF.h2), dx: 14, dy: -56 },
  ];

  return (
    <svg viewBox={`${VB.x.toFixed(0)} ${VB.y.toFixed(0)} ${VB.w.toFixed(0)} ${VB.h.toFixed(0)}`} role="img" aria-label={t.aria}>
      <defs>
        <pattern id="lam-cesped" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="1.2" cy="1.2" r="0.42" fill="#a3ac8a" />
          <circle cx="3.7" cy="3.7" r="0.42" fill="#a3ac8a" />
        </pattern>
      </defs>

      {/* ── estacionamiento, calle y suelo ───────────────────────── */}
      <g style={cssVars({ "--d": "0s" })}>
        <path className="rl" d={techo(0, -PARKING.dy, LOTE.dx, PARKING.dy, 0)} fill="#e8e2d6" />
        <path className="rl" d={techo(0, LOTE.dy, LOTE.dx, PARKING.dy, 0)} fill="#e8e2d6" />
        {plazas}
        <path className="rl" d={techo(-14, -PARKING.dy, 14, LOTE.dy + PARKING.dy * 2, 0)} fill="#ddd6c8" />
        <path className="rl tz" pathLength={1} d={techo(0, 0, LOTE.dx, LOTE.dy, 0)} fill="#f4efe3" stroke={GRIS} strokeWidth="0.8" />
        <g className={zClase("jardin")} {...zProps("jardin")}>
          <path className="rl cesped" d={techo(SETO.ancho, SETO.ancho, LOTE.dx - SETO.ancho, PASEO.y - SETO.ancho, 0.02)} fill="#dfe0c6" />
          <path className="rl cesped" d={techo(SETO.ancho, SETO.ancho, LOTE.dx - SETO.ancho, PASEO.y - SETO.ancho, 0.02)} fill="url(#lam-cesped)" opacity="0.7" />
          <path className="rl cesped" d={techo(SETO.ancho, PASEO.y + PASEO.dy, LOTE.dx - SETO.ancho, LOTE.dy - SETO.ancho - PASEO.y - PASEO.dy, 0.02)} fill="#e3e0cc" />
          <path className="rl cesped" d={techo(SETO.ancho, PASEO.y + PASEO.dy, LOTE.dx - SETO.ancho, LOTE.dy - SETO.ancho - PASEO.y - PASEO.dy, 0.02)} fill="url(#lam-cesped)" opacity="0.45" />
        </g>
        <path className="rl tz paseo-pav" pathLength={1} d={techo(-14, PASEO.y, LOTE.dx + 14, PASEO.dy, 0.04)} fill={PAPEL} stroke={GRIS} strokeWidth="0.7" />
        {juntas}
      </g>

      {/* ── coches y setos de atrás ──────────────────────────────── */}
      <g className="ap" style={cssVars({ "--d": ".15s" })}>{coches.filter((_, i) => i < PARKING.plazas)}</g>
      <g style={cssVars({ "--d": ".25s" })}>
        <Seto g={g} x={0} y={0} dx={LOTE.dx} dy={SETO.ancho} />
        <Seto g={g} x={0} y={SETO.ancho} dx={SETO.ancho} dy={PASEO.y - SETO.ancho - 4} />
        <Seto g={g} x={0} y={PASEO.y + PASEO.dy + 4} dx={SETO.ancho} dy={LOTE.dy - PASEO.y - PASEO.dy - 4} />
      </g>

      {/* ── la palapa ────────────────────────────────────────────── */}
      <g className={zClase("tiki")} {...zProps("tiki")} style={cssVars({ "--d": ".6s" })}>
        <Palapa g={g} />
      </g>
      {/* costados abiertos, postes marcados, carpa y barra: capas del guion */}
      <g className="capa capa-lados" pointerEvents="none">
        {lados.map(([a, b], i) => (
          <g key={i} className="lado-flecha" style={cssVars({ "--i": i })}>
            <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={OCRE} strokeWidth="1.2" />
            <circle cx={b[0]} cy={b[1]} r="1.8" fill={OCRE} />
          </g>
        ))}
      </g>
      <g className="carpa" pointerEvents="none">
        {[
          [p(PALAPA.x, PALAPA.y + PALAPA.dy, 0), p(PALAPA.x + PALAPA.dx, PALAPA.y + PALAPA.dy, 0), p(PALAPA.x + PALAPA.dx, PALAPA.y + PALAPA.dy, PALAPA_ALERO), p(PALAPA.x, PALAPA.y + PALAPA.dy, PALAPA_ALERO)],
          [p(PALAPA.x + PALAPA.dx, PALAPA.y, 0), p(PALAPA.x + PALAPA.dx, PALAPA.y + PALAPA.dy, 0), p(PALAPA.x + PALAPA.dx, PALAPA.y + PALAPA.dy, PALAPA_ALERO), p(PALAPA.x + PALAPA.dx, PALAPA.y, PALAPA_ALERO)],
        ].map((pts, i) => (
          <path key={i} className="carpa-pano" d={poly(...(pts as Pt[]))} fill={OCRE} fillOpacity="0.12" stroke={OCRE} strokeWidth="1.1" strokeDasharray="3 2.2" strokeLinejoin="round" />
        ))}
      </g>
      <g className="barra" pointerEvents="none">
        <Caja g={g} x={BARRA.x} y={BARRA.y} dx={BARRA.dx} dy={BARRA.dy} z1={BARRA.h} tapa="#fbf8f1" izq="#f3eee4" der="#ece6d9" borde={OCRE} w={1.1} animado={false} dash="3 2.2" />
      </g>

      {/* ── mesas, pasillos y gente (solo en su modo) ────────────── */}
      <g className="mesas" pointerEvents="none">
        {MESAS.slice(0, mesasN).map(([x, y], i) => <Mesa key={i} g={g} x={x} y={y} i={i} />)}
      </g>
      <g className="capa capa-pasillos" pointerEvents="none">
        {pasillos.map(([a, b], i) => <line key={i} className="pasillo" style={cssVars({ "--i": i })} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={OCRE} strokeWidth="1" strokeDasharray="4 3" />)}
      </g>
      <g className="gente" pointerEvents="none">
        {MULTITUD.slice(0, genteN).map(([x, y], i) => {
          const [a, b] = p(x, y, 0);
          return <circle key={i} className="persona" style={cssVars({ "--i": i })} cx={a.toFixed(1)} cy={b.toFixed(1)} r="1" fill={TINTA} opacity="0.7" />;
        })}
      </g>

      {/* ── palmeras del norte, gente suelta ─────────────────────── */}
      <g style={cssVars({ "--d": "1s" })}>
        {PALMERAS_N.map(([x, y], i) => <Palma key={`n${x}`} g={g} x={x} y={y} i={i} />)}
        {GENTE_SUELTA.map(([x, y]) => <Persona key={`g${x}`} g={g} x={x} y={y} />)}
      </g>

      {/* ── el camión (solo en su modo) ──────────────────────────── */}
      <g className="camion" pointerEvents="none" style={cssVars({ "--cx": `${desplazamiento.cx.toFixed(1)}px`, "--cy": `${desplazamiento.cy.toFixed(1)}px` })}>
        <Camion g={g} />
      </g>

      {/* ── palmeras del sur, cabañas, picnic, setos de delante ──── */}
      <g style={cssVars({ "--d": "1.3s" })}>
        {PALMERAS_S.map(([x, y], i) => <Palma key={`s${x}`} g={g} x={x} y={y} i={i + 10} />)}
      </g>
      <g className={zClase("cabanas")} {...zProps("cabanas")} style={cssVars({ "--d": "1.5s" })}>
        {Array.from({ length: CABANAS.n }, (_, i) => <Cabana key={i} g={g} x={CABANAS.x + i * CABANAS.paso} i={i} />)}
      </g>
      <g className="capa capa-picnic" pointerEvents="none">
        {PICNIC.map(([x, y], i) => <g key={i} className="picnic-entra" style={cssVars({ "--i": i })}><Picnic g={g} x={x} y={y} /></g>)}
      </g>
      <g style={cssVars({ "--d": "1.7s" })}>
        <Seto g={g} x={0} y={LOTE.dy - SETO.ancho} dx={LOTE.dx} dy={SETO.ancho} />
      </g>
      <g className="ap" style={cssVars({ "--d": "1.7s" })}>{coches.filter((_, i) => i >= PARKING.plazas)}</g>

      {/* ── el acceso: la calle y la flecha ──────────────────────── */}
      <g className={zClase("acceso")} {...zProps("acceso")} style={cssVars({ "--d": "1.9s" })}>
        <path className="tz" pathLength={1} d={`M${flechaA[0].toFixed(1)},${flechaA[1].toFixed(1)} L${flechaB[0].toFixed(1)},${flechaB[1].toFixed(1)}`} fill="none" stroke={TINTA} strokeWidth="1.6" />
        <path className="tz" pathLength={1} d={punta} fill="none" stroke={TINTA} strokeWidth="1.6" strokeLinejoin="round" />
        <text className="ap" transform={`translate(${calleTxt[0].toFixed(1)},${calleTxt[1].toFixed(1)}) rotate(30)`} fill={GRIS} fontFamily="ui-monospace,monospace" fontSize="7.5" letterSpacing="1.6" textAnchor="middle">{t.calle}</text>
        <path d={techo(-40, PASEO.y - 8, 40, PASEO.dy + 16, 0)} fill="transparent" />
      </g>
      <g className="capa capa-porton" pointerEvents="none">
        <path className="porton" d={poly(p(-1, PASEO.y - 1, 0), p(1, PASEO.y - 1, 0), p(1, PASEO.y + PASEO.dy + 1, 0), p(-1, PASEO.y + PASEO.dy + 1, 0))} fill={OCRE} opacity="0.6" />
      </g>

      {/* ── el edificio, cerrando el fondo ───────────────────────── */}
      <g className={zClase("edificio")} {...zProps("edificio")} style={cssVars({ "--d": "2s" })}>
        <Caja g={g} x={EDIF.x} y={-PARKING.dy} dx={EDIF.corte} dy={EDIF.dy} z1={EDIF.h1} tapa="#f5f1e8" izq="#ece7db" der="#e4ded1" borde={GRIS} w={0.8} />
        <Caja g={g} x={EDIF.x + EDIF.corte} y={-PARKING.dy} dx={EDIF.dx - EDIF.corte} dy={EDIF.dy} z1={EDIF.h2} tapa="#f5f1e8" izq="#ece7db" der="#e4ded1" borde={GRIS} w={0.8} />
        {ventanas}
        <path className="ap puerta" d={puerta} fill="#d9d2c4" stroke={TINTA} strokeWidth="0.8" />
        <line className="ap" x1={p(EDIF.x, PUERTA.y + PUERTA.dy / 2, 0)[0]} y1={p(EDIF.x, PUERTA.y + PUERTA.dy / 2, 0)[1]} x2={p(EDIF.x, PUERTA.y + PUERTA.dy / 2, PUERTA.h)[0]} y2={p(EDIF.x, PUERTA.y + PUERTA.dy / 2, PUERTA.h)[1]} stroke={TINTA} strokeWidth="0.6" />
      </g>

      {/* ── cotas, norte, escala, rótulo del estacionamiento ─────── */}
      <g pointerEvents="none" style={cssVars({ "--d": "2.1s" })}>
        <Cota g={g} a={[0, LOTE.dy + PARKING.dy + 12]} b={[LOTE.dx, LOTE.dy + PARKING.dy + 12]} texto="≈ 240 FT · 73 M" giro={30} />
        <Cota g={g} a={[LOTE.dx + 3, 0]} b={[LOTE.dx + 3, LOTE.dy]} texto="≈ 96 FT · 29 M" giro={-30} />
        <Cota g={g} a={[PALAPA.x, PALAPA.y - 7]} b={[PALAPA.x + PALAPA.dx, PALAPA.y - 7]} texto="≈ 100 FT" giro={30} />
        <text className="ap" transform={`translate(${p(120, -PARKING.dy / 2, 0)[0].toFixed(1)},${p(120, -PARKING.dy / 2, 0)[1].toFixed(1)}) rotate(30)`} fill={GRIS} fontFamily="ui-monospace,monospace" fontSize="6.5" letterSpacing="1.6" textAnchor="middle" opacity="0.8">{t.parking}</text>

        <g className="ap" transform={`translate(${(VB.x + VB.w - 34).toFixed(1)},${(VB.y + 44).toFixed(1)})`}>
          <g transform={`rotate(${angN.toFixed(1)})`}>
            <path d="M0,14 L0,-11 M-3.2,-4 L0,-12 L3.2,-4" fill="none" stroke={TINTA} strokeWidth="1" />
          </g>
          <text x={(Math.cos(radN) * 21).toFixed(1)} y={(Math.sin(radN) * 21).toFixed(1)} dy="3" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8.5" fill={GRIS}>N</text>
        </g>

        <g className="ap" transform={`translate(${(VB.x + 16).toFixed(1)},${(VB.y + VB.h - 22).toFixed(1)})`}>
          {[0, 1, 2].map((i) => (
            <rect key={i} x={(i * 50 * U * 0.866) / 3} y="0" width={(50 * U * 0.866) / 3} height="4" fill={i % 2 ? PAPEL : TINTA} stroke={TINTA} strokeWidth="0.45" />
          ))}
          <text x="0" y="13" fontFamily="ui-monospace,monospace" fontSize="6.8" fill={GRIS}>0</text>
          <text x={(50 * U * 0.866).toFixed(1)} y="13" fontFamily="ui-monospace,monospace" fontSize="6.8" fill={GRIS} textAnchor="end">{t.escala.toUpperCase()}</text>
        </g>
      </g>

      {/* ── líneas de guía de los rótulos ────────────────────────── */}
      <g pointerEvents="none" style={cssVars({ "--d": "2.3s" })}>
        {ROTULOS.map((r) => (
          <g key={r.zona} className={`ap guia guia-${r.zona}${zona === r.zona ? " activa" : ""}`}>
            <line x1={r.ancla[0]} y1={r.ancla[1]} x2={r.ancla[0] + r.dx} y2={r.ancla[1] + r.dy} stroke={TINTA} strokeWidth="0.7" />
            <circle cx={r.ancla[0]} cy={r.ancla[1]} r="2" fill={TINTA} />
          </g>
        ))}
      </g>

      {/* ── anochece: el dibujo se apaga y se enciende el montaje ── */}
      <rect className="anochecer" x={VB.x.toFixed(0)} y={VB.y.toFixed(0)} width={VB.w.toFixed(0)} height={VB.h.toFixed(0)} fill={TINTA} pointerEvents="none" />
      <Noche g={g} />

      {/* ── la lluvia (solo en su modo) ──────────────────────────── */}
      <g className="lluvia" pointerEvents="none">
        {GOTAS.map((q, i) => (
          <line key={i} className="gota" style={cssVars({ "--t": `${q.t}s` })} x1={q.x.toFixed(1)} y1={q.y.toFixed(1)} x2={(q.x - 3.5).toFixed(1)} y2={(q.y + 10).toFixed(1)} stroke={TINTA} strokeWidth="0.9" strokeLinecap="round" />
        ))}
      </g>
    </svg>
  );
});

// ── la lámina ──────────────────────────────────────────────────────────────

export default function LaminaRecinto({
  lang, modoDirigido, zonaDirigida, puntoDirigido, zoomDirigido, capasDirigidas, rotuloPunto, cifraPunto, fotoDirigida,
  aforo, cine = false, semillaDibujo = 0, onManual, panel,
}: {
  lang: Idioma;
  modoDirigido?: Modo;
  zonaDirigida?: Zona | null;
  puntoDirigido?: [number, number] | null;
  zoomDirigido?: number;
  /** Capas aditivas encendidas por el guion: «pasillos», «postes», «truss», «luces»… */
  capasDirigidas?: string[];
  rotuloPunto?: string;
  cifraPunto?: string | null;
  fotoDirigida?: FotoDirigida | null;
  aforo?: Aforo;
  cine?: boolean;
  semillaDibujo?: number;
  onManual?: () => void;
  panel?: React.ReactNode;
}) {
  const t = T[lang];
  const [modoLocal, setModo] = useState<Modo>("todo");
  const [zonaLocal, setZona] = useState<Zona | null>(null);
  const [zonaLeida, setZonaLeida] = useState<Zona>("jardin");
  const [fase, setFase] = useState<Fase>("pendiente");
  const [fotoVista, setFotoVista] = useState<FotoDirigida | null>(null);
  useEffect(() => { if (fotoDirigida) setFotoVista(fotoDirigida); }, [fotoDirigida]);
  const raiz = useRef<HTMLDivElement>(null);
  const quieto = useRef(false);

  const [vertical, setVertical] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-aspect-ratio: 9/15)");
    const f = () => setVertical(mq.matches);
    f();
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);

  const dirigiendo = modoDirigido !== undefined;
  const modo = modoDirigido ?? modoLocal;
  const zona = zonaDirigida !== undefined ? zonaDirigida : zonaLocal;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      quieto.current = true;
      setFase("quieto");
      return;
    }
    const el = raiz.current;
    if (!el) return;
    let temporizador: ReturnType<typeof setTimeout> | null = null;
    const io = new IntersectionObserver((entradas) => {
      if (!entradas.some((e) => e.isIntersecting)) return;
      setFase((f) => (f === "pendiente" ? "dibujar" : f));
      ev("view_plate", { plate_name: "recinto" });
      io.disconnect();
      temporizador = setTimeout(() => setFase("listo"), 2400);
    }, { threshold: 0.2 });
    io.observe(el);
    return () => { io.disconnect(); if (temporizador) clearTimeout(temporizador); };
  }, []);

  useEffect(() => {
    if (!semillaDibujo || quieto.current) return;
    setFase("pendiente");
    let temporizador: ReturnType<typeof setTimeout> | null = null;
    const cuadro = requestAnimationFrame(() => {
      setFase("dibujar");
      temporizador = setTimeout(() => setFase("listo"), 2400);
    });
    return () => { cancelAnimationFrame(cuadro); if (temporizador) clearTimeout(temporizador); };
  }, [semillaDibujo]);

  useEffect(() => {
    if (!cine) return;
    const antes = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => { document.documentElement.style.overflow = antes; };
  }, [cine]);

  function elegirModo(m: Modo) {
    onManual?.();
    setModo(m);
    if (m !== "todo") ev("toggle_layer", { layer: m });
  }
  const alEntrar = useCallback((z: Zona) => { setZona(z); setZonaLeida(z); }, []);
  const alSalir = useCallback((z: Zona) => setZona((a) => (a === z ? null : a)), []);
  const alTocar = useCallback((z: Zona) => {
    onManual?.();
    setZona((actual) => (actual === z ? null : z));
    setZonaLeida(z);
    ev("select_zone", { zone: z });
  }, [onManual]);

  const { p } = G;
  const cxP = PALAPA.x + PALAPA.dx / 2, cyP = PALAPA.y + PALAPA.dy / 2;
  const rotulo = (z: Zona, ancla: Pt, dx: number, dy: number, lado: "" | "der" = "", vert: "" | "inf" = "") =>
    ({ zona: z, fin: [ancla[0] + dx, ancla[1] + dy] as Pt, lado, vert });
  const ROTULOS = [
    rotulo("jardin", p(200, 22, 0), 26, -58),
    rotulo("tiki", p(cxP, cyP, PALAPA_CUMBRE), -20, -46, "der"),
    rotulo("cabanas", p(CABANAS.x + 3 * CABANAS.paso + 6, CABANAS.y + 6, CABANAS.h), -24, 62, "der", "inf"),
    rotulo("acceso", p(-8, PASEO.y + PASEO.dy / 2, 0), -16, -40),
    rotulo("edificio", p(EDIF.x + EDIF.corte + 18, 30, EDIF.h2), 14, -56, "der"),
  ];

  const altaEnVertical = cine && vertical;
  const ratioCaja = altaEnVertical ? 1.15 : PROPORCION;
  const fracCaja = (q: Pt): Pt => {
    const [fx, fy] = frac(q);
    if (ratioCaja >= PROPORCION - 1e-6) return [fx, fy];
    const alturaCaja = 1 / ratioCaja, alturaDibujo = 1 / PROPORCION;
    const margen = (alturaCaja - alturaDibujo) / 2;
    return [fx, (margen + fy * alturaDibujo) / alturaCaja];
  };
  const pctCaja = (q: Pt) => { const [fx, fy] = fracCaja(q); return { left: `${(fx * 100).toFixed(2)}%`, top: `${(fy * 100).toFixed(2)}%` }; };

  const zoomBase = altaEnVertical ? 1.35 : 1;
  const zoom = dirigiendo ? Math.max(1, zoomDirigido ?? 1) * zoomBase : zoomBase;
  const centro: Pt = dirigiendo && puntoDirigido ? puntoDirigido : CENTRO;
  const [fx, fy] = fracCaja(p(centro[0], centro[1], 0));
  const acotar = (v: number) => Math.min(0, Math.max(1 - zoom, v));
  const tx = acotar(0.5 - fx * zoom), ty = acotar(0.5 - fy * zoom);
  const camara = cssVars({
    transform: `translate(${(tx * 100).toFixed(3)}%, ${(ty * 100).toFixed(3)}%) scale(${zoom.toFixed(3)})`,
    "--zoom": zoom.toFixed(3),
  });

  const clase = `lam ${fase === "listo" ? "dibujar listo" : fase}${zona ? " enfocado" : ""}${dirigiendo ? " recorriendo" : ""}${cine ? " cine" : ""}`;
  const capas = (capasDirigidas ?? []).join(" ");

  return (
    <section id="terreno" aria-label={t.ojo} style={{ background: "var(--papel-2)", borderBottom: "1px solid var(--regla)" }}>
      <div className="reja" style={{ paddingBlock: "64px 64px" }}>
        <div ref={raiz} className={clase} data-modo={modo} data-capas={capas} style={cssVars({ "--ratio": ratioCaja.toFixed(4) })}>
          <noscript>
            <style>{`.lam.pendiente .tz{stroke-dashoffset:0}.lam.pendiente .rl{fill-opacity:1}.lam.pendiente .ap,.lam.pendiente .lam-etq,.lam.pendiente .lam-cajetin{opacity:1}`}</style>
          </noscript>

          <div className="lam-cabecera">
            <div className="ojo" style={{ paddingBottom: 18 }}>{t.ojo}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "12px 44px", alignItems: "end", paddingBottom: 22 }}>
              <h2 style={{ maxWidth: "16ch" }}>{t.titulo}</h2>
              <p className="respuesta" style={{ margin: 0, color: "var(--texto)", maxWidth: "46ch" }}>{t.intro}</p>
            </div>
          </div>

          <div className="lam-escenario">
            <figure className="lam-fig" style={{ aspectRatio: altaEnVertical ? String(ratioCaja) : `${VB.w.toFixed(0)} / ${VB.h.toFixed(0)}` }}>
              <div className="lam-lienzo" style={camara}>
                <Dibujo lang={lang} zona={zona} aforo={aforo} alEntrar={alEntrar} alSalir={alSalir} alTocar={alTocar} />

                {dirigiendo && puntoDirigido && (
                  <div className="lam-guia-punto" style={pctCaja(p(puntoDirigido[0], puntoDirigido[1], 0))} aria-hidden="true">
                    <span className="lam-guia-halo" />
                    <span className="lam-guia-nucleo" />
                    {(rotuloPunto || cifraPunto) && (
                      <span className="lam-guia-rotulo">
                        {rotuloPunto && <span className="lam-guia-nombre">{rotuloPunto}</span>}
                        {cifraPunto && <span key={cifraPunto} className="lam-guia-cifra">{cifraPunto}</span>}
                      </span>
                    )}
                  </div>
                )}

                <div className="lam-cajetin" aria-hidden>
                  <b>{t.cajetin[0]}</b>
                  {t.cajetin[1]}<br />{t.cajetin[2]}
                </div>

                {ROTULOS.map((r, i) => {
                  const z = t.zonas[r.zona];
                  return (
                    <button key={r.zona} type="button"
                            className={`lam-etq ${r.lado} ${r.vert}${zona === r.zona ? " activa" : ""}`}
                            style={pctCaja(r.fin)}
                            tabIndex={dirigiendo ? -1 : 0}
                            onMouseEnter={() => { setZona(r.zona); setZonaLeida(r.zona); }}
                            onMouseLeave={() => setZona((a) => (a === r.zona ? null : a))}
                            onClick={() => alTocar(r.zona)}
                            aria-label={`${z.nombre} · ${z.dato}`}>
                      <span className="lam-etq-n">{i + 1}</span>
                      <span className="lam-etq-txt">
                        <span className="lam-etq-nombre">{z.nombre}</span>
                        <span className="lam-etq-dato">{z.dato}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Las fotos con píxeles de sobra llenan el cuadro; las de 1 024 px
                  se enseñan a su tamaño, como una postal enmarcada con pie, para
                  que nunca se vean ampliadas y blandas. */}
              <div className={`lam-foto${fotoDirigida ? " visible" : ""}${(fotoVista?.tamano ?? "lleno") === "postal" ? " postal" : ""}`} aria-hidden={!fotoDirigida}>
                {fotoVista && (
                  <figure key={fotoVista.src} className="lam-foto-marco">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={fotoVista.src} alt={fotoVista.alt} style={{ objectPosition: fotoVista.pos }} decoding="async" />
                    <figcaption>{fotoVista.alt}</figcaption>
                  </figure>
                )}
              </div>
            </figure>
          </div>

          <div className="lam-barra-modos">
            <div className="lam-modos" role="group" aria-label={lang === "es" ? "Qué ver en el plano" : "What to show on the plan"}>
              {MODOS_MANUALES.map((m) => (
                <button key={m} type="button" className="lam-modo" aria-pressed={modo === m} onClick={() => elegirModo(m)}>
                  {t.modos[m]}
                </button>
              ))}
            </div>
            <p className="lam-explica" aria-live="polite">{t.explica[modo]}</p>
          </div>

          {panel}

          <div className="lam-zonas">
            <div className="lam-zonas-tabs" role="tablist" aria-label={lang === "es" ? "Zonas del recinto" : "Zones of the site"}>
              {ORDEN_ZONAS.map((zk, i) => {
                const z = t.zonas[zk];
                const activa = zonaLeida === zk;
                return (
                  <button key={zk} type="button" role="tab" id={`zona-tab-${zk}`} aria-selected={activa} aria-controls={`zona-panel-${zk}`}
                          className={`lam-zona-tab${activa ? " activa" : ""}${zona === zk ? " resaltada" : ""}`}
                          onMouseEnter={() => setZona(zk)}
                          onMouseLeave={() => setZona((a) => (a === zk ? null : a))}
                          onClick={() => alTocar(zk)}>
                    <span className="lam-item-n" aria-hidden>{i + 1}</span>
                    <span className="lam-zona-tab-txt">
                      <span className="lam-item-nombre">{z.nombre}</span>
                      <span className="lam-item-dato">{z.dato}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            {ORDEN_ZONAS.map((zk) => {
              const z = t.zonas[zk];
              return (
                <div key={zk} role="tabpanel" id={`zona-panel-${zk}`} aria-labelledby={`zona-tab-${zk}`} className="lam-lectura" hidden={zonaLeida !== zk}>
                  <p className="lam-lectura-lee">{z.lee}</p>
                  <p className="lam-lectura-sirve">{z.sirve}</p>
                  <p className="lam-lectura-ojo">{z.ojo}</p>
                </div>
              );
            })}
          </div>

          <p className="ojo lam-nota" style={{ paddingTop: 18, lineHeight: 1.75, maxWidth: "78ch" }}>{t.nota}</p>
        </div>
      </div>
    </section>
  );
}

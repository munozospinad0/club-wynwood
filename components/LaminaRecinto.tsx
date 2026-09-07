"use client";

import { memo, useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { crearPerspectiva, type GeoPerspectiva } from "@/lib/perspectiva";
import type { Idioma } from "@/lib/i18n";
import { ev } from "@/lib/medicion";
import {
  LOTE, EDIF, PUERTA, PASEO, PALAPA, PALAPA_ALERO, PALAPA_CUMBRE, PALAPA_CUMBRERA, PALAPA_POSTES,
  ARENA, PICNIC, CABANAS, CESPED_O, CESPED_E, PALMERAS_O, PALMERAS_E, PALMERAS_PALAPA, SETO,
  PARKING_E, PARKING_S, CALLE_O, CALLE_S, MESAS, ESCENARIO, BARRA, CAMION, MULTITUD, GENTE_SUELTA,
  CENTRO, CAMARA, type Pt,
} from "@/lib/recinto.geo";

/**
 * LÁMINA — EL RECINTO. Un solo dibujo que se explica solo.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * CUARTA VERSIÓN: EL PLANO DE VERDAD Y UNA CÁMARA DE VERDAD (6-sep-2026, noche)
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Daniel encontró el flyer de Newmark en LoopNet con el PLANO DEL SITIO. Con él
 * se rehizo la geometría (`lib/recinto.geo.ts`): edificio al norte, paseo que
 * baja de su puerta hacia el sur, palapa al suroeste junto a NW 1st Ct, área de
 * arena con picnic entre palapa y edificio, ocho pérgolas al este del paseo,
 * estacionamiento al este y al sur. El lote es de esquina, no una franja.
 *
 * Y se cambió la PROYECCIÓN (`lib/perspectiva.ts`): en vez de isométrica, una
 * cámara en perspectiva puesta donde estuvo el dron de la foto de portada, al
 * sur y elevada, mirando al edificio. Daniel: «trabaja en la perspectiva que sí
 * parezca real». Ahora lo lejano es más pequeño, el paseo se aleja hacia la
 * puerta y la palapa queda a la izquierda como en las fotos.
 *
 * Consecuencias en el código:
 *   · El orden de pintado importa: lo lejano primero. Los objetos sueltos
 *     (palmeras, pérgolas, la palapa, mesas de picnic, coches) se ordenan por
 *     profundidad real antes de pintarse.
 *   · Cada objeto se dibuja a la escala de su punto (`g.escala`): una palmera
 *     al fondo mide la mitad que una delante.
 *   · Las cajas enseñan la cara este o la oeste según estén a un lado u otro de
 *     la cámara.
 *
 * Todo lo demás sigue: papel y tinta, ocre para lo que es respuesta, capas por
 * frase (`data-capas`), entrada con peso, techo transparente cuando hay algo
 * debajo, fotos como postal, y el dibujo dirigido desde el recorrido.
 */

export type Modo = "todo" | "lluvia" | "carpa" | "mesas" | "gente" | "camion" | "noche" | "barra";
export type Zona = "jardin" | "tiki" | "cabanas" | "acceso" | "edificio";
type Fase = "pendiente" | "dibujar" | "listo" | "quieto";

export interface FotoDirigida { src: string; pos: string; alt: string; tamano?: "lleno" | "postal" }
export interface Aforo { invitados: number; formato: "sentados" | "pie" }

const TINTA = "#211c15", GRIS = "#8a8071", OCRE = "#c4772b", PAPEL = "#fbf8f1", LUZ = "#f3e2c4";

const G: GeoPerspectiva = crearPerspectiva(CAMARA);

// El encuadre: las esquinas del lote con las calles, al suelo y a la altura del edificio.
const VB = (() => {
  const xs: number[] = [], ys: number[] = [];
  // Se encuadra el lote con un poco de calle: la calle entera dejaba medio
  // dibujo vacío abajo y el recinto pequeño arriba.
  for (const [x, y, z] of [
    [CALLE_O.x + 14, 0, 0], [LOTE.dx + 4, 0, 0], [CALLE_O.x + 14, LOTE.dy + 14, 0], [LOTE.dx + 4, LOTE.dy + 14, 0],
    [EDIF.x, EDIF.y, EDIF.h2], [EDIF.x + EDIF.dx, EDIF.y, EDIF.h2], [PALAPA.x, PALAPA.y, PALAPA_CUMBRE],
  ] as Array<[number, number, number]>) {
    const [sx, sy] = G.p(x, y, z);
    xs.push(sx); ys.push(sy);
  }
  const x0 = Math.min(...xs) - 14, x1 = Math.max(...xs) + 14, y0 = Math.min(...ys) - 30, y1 = Math.max(...ys) + 24;
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
})();
export const PROPORCION = VB.w / VB.h;
export { CENTRO };

const frac = (q: Pt): Pt => [(q[0] - VB.x) / VB.w, (q[1] - VB.y) / VB.h];
const poly = (...q: Pt[]) => q.map((c, i) => `${i ? "L" : "M"}${c[0].toFixed(1)},${c[1].toFixed(1)}`).join(" ") + " Z";
const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const cssVars = (o: Record<string, string | number>) => o as CSSProperties;

function lcg(semilla: number) {
  let s = semilla >>> 0;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}

/** Un círculo en el suelo, visto por la cámara: elipse con el achatamiento de ese punto. */
function Elipse({ g, x, y, r, z = 0, ...resto }: { g: GeoPerspectiva; x: number; y: number; r: number; z?: number } & React.SVGProps<SVGEllipseElement>) {
  const [cx, cy] = g.p(x, y, z);
  const a = g.p(x - r, y, z), b = g.p(x + r, y, z), c = g.p(x, y - r, z), d = g.p(x, y + r, z);
  const rx = Math.hypot(b[0] - a[0], b[1] - a[1]) / 2, ry = Math.hypot(d[0] - c[0], d[1] - c[1]) / 2;
  return <ellipse cx={cx.toFixed(1)} cy={cy.toFixed(1)} rx={rx.toFixed(2)} ry={Math.max(0.3, ry).toFixed(2)} {...resto} />;
}

// ── piezas ─────────────────────────────────────────────────────────────────

/**
 * Prisma con la tapa, la cara sur (mira a la cámara) y la cara lateral visible:
 * la este si el objeto queda al oeste de la cámara, la oeste si queda al este.
 */
function Caja({ g, x, y, dx, dy, z0 = 0, z1, tapa, izq, der, borde = TINTA, w = 0.9, clase = "", animado = true, dash }: {
  g: GeoPerspectiva; x: number; y: number; dx: number; dy: number; z0?: number; z1: number;
  tapa: string; izq: string; der: string; borde?: string; w?: number; clase?: string; animado?: boolean; dash?: string;
}) {
  const { p } = g;
  const cl = animado ? "rl tz" : "";
  const pl = animado ? { pathLength: 1 } : {};
  const sd = dash ? { strokeDasharray: dash } : {};
  const este = x + dx / 2 < g.camara.ojo[0];
  const lx = este ? x + dx : x;
  return (
    <g className={clase}>
      <path className={cl} d={poly(p(lx, y, z0), p(lx, y + dy, z0), p(lx, y + dy, z1), p(lx, y, z1))} fill={der} stroke={borde} strokeWidth={w} {...pl} {...sd} />
      <path className={cl} d={poly(p(x, y + dy, z0), p(x + dx, y + dy, z0), p(x + dx, y + dy, z1), p(x, y + dy, z1))} fill={izq} stroke={borde} strokeWidth={w} {...pl} {...sd} />
      <path className={cl} d={g.techo(x, y, dx, dy, z1)} fill={tapa} stroke={borde} strokeWidth={w} {...pl} {...sd} />
    </g>
  );
}

function Seto({ g, x, y, dx, dy }: { g: GeoPerspectiva; x: number; y: number; dx: number; dy: number }) {
  return <Caja g={g} x={x} y={y} dx={dx} dy={dy} z1={SETO.alto} tapa="#c9c9a9" izq="#bcbc9c" der="#b0b092" borde={GRIS} w={0.6} />;
}

/** Palmera real: tronco con curva, ocho frondas, sombra. A la escala de su punto. Se mece. */
function Palma({ g, x, y, alto = 22, i }: { g: GeoPerspectiva; x: number; y: number; alto?: number; i: number }) {
  const [a, b] = g.p(x, y, 0);
  const [, bt] = g.p(x, y, alto);
  const h = b - bt;
  // Copa de ~9 ft de radio, a la escala de su punto: las de atrás, más pequeñas.
  const s = g.escala(x, y, alto) * 6;
  return (
    <g transform={`translate(${a.toFixed(1)},${b.toFixed(1)})`}>
      <Elipse g={g} x={x} y={y} r={3.2} className="rl" fill={TINTA} opacity="0.08" transform={`translate(${(-a).toFixed(1)},${(-b).toFixed(1)})`} />
      <g className="palma" style={cssVars({ "--v": `${(5.6 + (i % 5) * 0.7).toFixed(1)}s`, "--vd": `${(-(i % 7) * 0.9).toFixed(1)}s` })}>
        <path className="tz" pathLength={1}
              d={`M0,0 C${(h * 0.04).toFixed(1)},${(-h * 0.4).toFixed(1)} ${(-h * 0.04).toFixed(1)},${(-h * 0.7).toFixed(1)} ${(h * 0.02).toFixed(1)},${(-h).toFixed(1)}`}
              fill="none" stroke="#6f6656" strokeWidth={(0.5 + s * 0.05).toFixed(2)} strokeLinecap="round" />
        {[-1.45, -1.0, -0.55, -0.18, 0.18, 0.55, 1.0, 1.45].map((t, k) => (
          <path key={k} className="tz" pathLength={1}
                d={`M${(h * 0.02).toFixed(1)},${(-h).toFixed(1)} q${(Math.sin(t) * s * 0.55).toFixed(1)},${(-s * 0.28 - Math.abs(Math.cos(t)) * s * 0.2).toFixed(1)} ${(Math.sin(t) * s).toFixed(1)},${(s * 0.3 + Math.abs(Math.cos(t)) * s * 0.2).toFixed(1)}`}
                fill="none" stroke="#5c5445" strokeWidth={(0.35 + s * 0.035).toFixed(2)} strokeLinecap="round" />
        ))}
      </g>
    </g>
  );
}

function Persona({ g, x, y, tono = "#3e3a34", clase = "ap" }: { g: GeoPerspectiva; x: number; y: number; tono?: string; clase?: string }) {
  const [a, b] = g.p(x, y, 0);
  const [, bt] = g.p(x, y, 5.8);
  const h = b - bt, w = h * 0.22;
  return (
    <g className={clase} transform={`translate(${a.toFixed(1)},${b.toFixed(1)})`} opacity="0.75">
      <circle cx="0" cy={(-h * 0.9).toFixed(1)} r={(h * 0.12).toFixed(1)} fill={tono} />
      <path d={`M0,${(-h * 0.76).toFixed(1)} L0,${(-h * 0.38).toFixed(1)} M0,${(-h * 0.66).toFixed(1)} L${(-w).toFixed(1)},${(-h * 0.46).toFixed(1)} M0,${(-h * 0.66).toFixed(1)} L${w.toFixed(1)},${(-h * 0.46).toFixed(1)} M0,${(-h * 0.38).toFixed(1)} L${(-w * 0.8).toFixed(1)},0 M0,${(-h * 0.38).toFixed(1)} L${(w * 0.8).toFixed(1)},0`}
            stroke={tono} strokeWidth={(h * 0.075).toFixed(2)} fill="none" strokeLinecap="round" />
    </g>
  );
}

/**
 * LA PALAPA como en las fotos: cuadrada, techo de paja a cuatro aguas con
 * cumbrera corta, alero bajo, muchas líneas de paja, postes en tres por tres.
 * Dentro, las mesas de su modo y la barra del cliente.
 */
function Palapa({ g, mesasN }: { g: GeoPerspectiva; mesasN: number }) {
  const { p } = g;
  const { x, y, dx, dy } = PALAPA;
  const cx = x + dx / 2, cy = y + dy / 2;
  const A = p(x, y, PALAPA_ALERO), B = p(x + dx, y, PALAPA_ALERO), C = p(x + dx, y + dy, PALAPA_ALERO), D = p(x, y + dy, PALAPA_ALERO);
  const R1 = p(cx - PALAPA_CUMBRERA / 2, cy, PALAPA_CUMBRE), R2 = p(cx + PALAPA_CUMBRERA / 2, cy, PALAPA_CUMBRE);
  // Orden de atrás hacia delante para la cámara del sur: norte, oeste, este, sur.
  const caras: Array<{ pts: [Pt, Pt, Pt, Pt]; tono: string; n: number }> = [
    { pts: [A, B, R2, R1], tono: "#8f8574", n: 8 },
    { pts: [D, A, R1, R1], tono: "#7d7362", n: 7 },
    { pts: [B, C, R2, R2], tono: "#6b6253", n: 7 },
    { pts: [C, D, R1, R2], tono: "#5a5244", n: 9 },
  ];
  const postes = PALAPA_POSTES.slice().sort((m, n) => g.profundidad(...m) - g.profundidad(...n));
  const mesas = MESAS.slice(0, Math.min(16, mesasN));
  return (
    <g className="palapa-todo">
      <path className="rl" d={g.techo(x, y, dx, dy, 0.03)} fill="#dfe0c6" />
      <g className="mesas">
        {mesas.map(([mx, my], i) => <Mesa key={i} g={g} x={mx} y={my} i={i} />)}
      </g>
      <g className="barra" pointerEvents="none">
        <Caja g={g} x={BARRA.x} y={BARRA.y} dx={BARRA.dx} dy={BARRA.dy} z1={BARRA.h} tapa="#fbf8f1" izq="#f3eee4" der="#ece6d9" borde={OCRE} w={1.1} animado={false} dash="3 2.2" />
      </g>
      <g className="palapa">
        {postes.map(([px, py]) => {
          const a = p(px, py, 0), b = p(px, py, PALAPA_ALERO);
          return <line key={`${px}-${py}`} className="tz poste" pathLength={1} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#3e3a34" strokeWidth={Math.max(0.8, g.escala(px, py) * 1.1).toFixed(2)} />;
        })}
        {caras.map((c, i) => (
          <g key={i}>
            <path className="rl tz palapa-cara" pathLength={1} d={poly(...c.pts)} fill={c.tono} stroke={TINTA} strokeWidth="1" strokeLinejoin="round" />
            {Array.from({ length: c.n }, (_, k) => (k + 1) / (c.n + 1)).map((t) => {
              const u = lerp(c.pts[0], c.pts[3], t), v = lerp(c.pts[1], c.pts[2], t);
              return <line key={t} className="ap" x1={u[0]} y1={u[1]} x2={v[0]} y2={v[1]} stroke={PAPEL} strokeWidth="0.5" opacity="0.36" />;
            })}
          </g>
        ))}
        <path className="tz palapa-cubierta" pathLength={1} d={poly(A, B, C, D)} fill="none" stroke={TINTA} strokeWidth="1.5" strokeLinejoin="round" />
        <line className="tz palapa-cubierta" pathLength={1} x1={R1[0]} y1={R1[1]} x2={R2[0]} y2={R2[1]} stroke={TINTA} strokeWidth="1.4" />
        {/* la paja que cuelga del alero sur y del este */}
        {([[D, C], [C, B]] as Array<[Pt, Pt]>).map(([q, r], i) =>
          Array.from({ length: 26 }, (_, k) => k / 25).map((t) => {
            const m = lerp(q, r, t);
            return <line key={`${i}-${t}`} className="ap" x1={m[0]} y1={m[1]} x2={m[0] + (k2(t) ? 0.6 : -0.6)} y2={m[1] + 2.6} stroke="#5a5244" strokeWidth="0.7" opacity="0.7" />;
          })
        )}
      </g>
      {/* la carpa lateral, a trazos, en la cara sur y la este */}
      <g className="carpa" pointerEvents="none">
        {[
          [p(x, y + dy, 0), p(x + dx, y + dy, 0), C, D],
          [p(x + dx, y, 0), p(x + dx, y + dy, 0), C, B],
        ].map((pts, i) => (
          <path key={i} className="carpa-pano" d={poly(...(pts as Pt[]))} fill={OCRE} fillOpacity="0.12" stroke={OCRE} strokeWidth="1.1" strokeDasharray="3 2.2" strokeLinejoin="round" />
        ))}
      </g>
    </g>
  );
}
const k2 = (t: number) => Math.round(t * 25) % 2 === 0;

/** Cabaña-pérgola: cuatro postes, marco y listones blancos; dentro, un sofá. */
function Cabana({ g, y, i }: { g: GeoPerspectiva; y: number; i: number }) {
  const { p } = g;
  const { x, dx, dy, h } = CABANAS;
  const esquinas: Pt[] = [[x, y], [x + dx, y], [x + dx, y + dy], [x, y + dy]];
  const listones = [];
  for (let t = 1; t < dx; t += 1.4) {
    const a = p(x + t, y, h), b = p(x + t, y + dy, h);
    listones.push(<line key={t} className="ap" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#f4efe6" strokeWidth="0.7" />);
  }
  return (
    <g className="cabana" style={cssVars({ "--i": i })}>
      <path className="rl" d={g.techo(x - 0.5, y - 0.5, dx + 1, dy + 1, 0.03)} fill="#e8e1d2" />
      {esquinas.map(([ex, ey], k) => {
        const a = p(ex, ey, 0), b = p(ex, ey, h);
        return <line key={k} className="tz" pathLength={1} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#6b6151" strokeWidth={Math.max(0.6, g.escala(ex, ey) * 0.7).toFixed(2)} />;
      })}
      <Caja g={g} x={x + 1.5} y={y + dy - 4} dx={dx - 3} dy={2.4} z1={1.6} tapa="#ddd6c6" izq="#d3ccbb" der="#c9c1af" borde={GRIS} w={0.5} />
      <path className="tz" pathLength={1} d={g.techo(x, y, dx, dy, h)} fill="#f7f3ea" fillOpacity="0.5" stroke="#6b6151" strokeWidth="0.9" />
      {listones}
    </g>
  );
}

/**
 * MESA REDONDA DE DIEZ, que se vea como mesa: tablero blanco con borde, un
 * centro de mesa, y diez sillas con asiento y respaldo mirando al centro.
 * Daniel: «pones mesas, pero el dibujo no es de una mesa, ni de cerca».
 */
function Mesa({ g, x, y, i }: { g: GeoPerspectiva; x: number; y: number; i: number }) {
  const [a, b] = g.p(x, y, 0);
  const s = g.escala(x, y);
  const sillas = Array.from({ length: 10 }, (_, k) => {
    const an = (k / 10) * Math.PI * 2 - Math.PI / 2;
    const sx = x + Math.cos(an) * 4.4, sy = y + Math.sin(an) * 4.4;
    const bx = x + Math.cos(an) * 5.3, by = y + Math.sin(an) * 5.3;
    return { seat: g.p(sx, sy, 1.5), back: g.p(bx, by, 3), pie: g.p(sx, sy, 0), k };
  });
  return (
    <g className="mesa" style={cssVars({ "--i": i })}>
      <Elipse g={g} x={x} y={y} r={5.8} fill={OCRE} opacity="0.07" />
      {sillas.map((c) => (
        <g key={c.k} className="silla" style={cssVars({ "--k": c.k })}>
          <line x1={c.pie[0]} y1={c.pie[1]} x2={c.seat[0]} y2={c.seat[1]} stroke={OCRE} strokeWidth={(s * 0.4).toFixed(2)} />
          <circle cx={c.seat[0]} cy={c.seat[1]} r={(s * 1.05).toFixed(2)} fill={OCRE} stroke="#fbf8f1" strokeWidth={(s * 0.25).toFixed(2)} />
          <line x1={c.seat[0]} y1={c.seat[1]} x2={c.back[0]} y2={c.back[1]} stroke={OCRE} strokeWidth={(s * 0.8).toFixed(2)} strokeLinecap="round" />
        </g>
      ))}
      {/* la pata y el tablero: el tablero a 2,5 ft de altura, blanco, con borde */}
      <line x1={a} y1={b} x2={g.p(x, y, 2.5)[0]} y2={g.p(x, y, 2.5)[1]} stroke={OCRE} strokeWidth={(s * 0.5).toFixed(2)} />
      <Elipse g={g} x={x} y={y} r={2.6} z={2.5} fill="#fbf8f1" stroke={OCRE} strokeWidth={(s * 0.45).toFixed(2)} />
      <Elipse g={g} x={x} y={y} r={0.7} z={2.7} fill={OCRE} opacity="0.7" />
    </g>
  );
}

/** Mesa de picnic fija con sombrilla, como en el área de arena. */
function Picnic({ g, x, y }: { g: GeoPerspectiva; x: number; y: number }) {
  const [a, b] = g.p(x, y, 0);
  const [, bt] = g.p(x, y, 7.5);
  return (
    <g className="picnic">
      <Caja g={g} x={x - 3} y={y - 1.2} dx={6} dy={2.4} z1={2.5} tapa="#e9e2d2" izq="#dcd5c4" der="#cfc8b6" borde={GRIS} w={0.55} animado={false} />
      <Caja g={g} x={x - 3} y={y - 3.4} dx={6} dy={1} z1={1.5} tapa="#e9e2d2" izq="#dcd5c4" der="#cfc8b6" borde={GRIS} w={0.45} animado={false} />
      <Caja g={g} x={x - 3} y={y + 2.4} dx={6} dy={1} z1={1.5} tapa="#e9e2d2" izq="#dcd5c4" der="#cfc8b6" borde={GRIS} w={0.45} animado={false} />
      <line x1={a} y1={b} x2={a} y2={bt} stroke="#6b6151" strokeWidth="0.7" />
      <Elipse g={g} x={x} y={y} r={4} z={7.5} fill="#f4efe6" stroke="#6b6151" strokeWidth="0.6" />
    </g>
  );
}

/** Coche: caja baja con techo. */
function Coche({ g, x, y, dx, dy, tono }: { g: GeoPerspectiva; x: number; y: number; dx: number; dy: number; tono: string }) {
  return (
    <g className="coche">
      <Caja g={g} x={x} y={y} dx={dx} dy={dy} z1={2.6} tapa={tono} izq={tono} der={tono} borde={GRIS} w={0.5} animado={false} />
      <Caja g={g} x={x + dx * 0.25} y={y + dy * 0.12} dx={dx * 0.48} dy={dy * 0.76} z0={2.6} z1={4.6} tapa="#e9e4d8" izq="#dad4c6" der="#cfc8b9" borde={GRIS} w={0.45} animado={false} />
    </g>
  );
}

/** El camión de 40 ft, de frente a la cámara: cabina al sur, caja detrás, ruedas. */
function Camion({ g }: { g: GeoPerspectiva }) {
  const { x, y, dx, dy, h } = CAMION;
  const ruedas: Pt[] = [[x, y + dy - 4], [x + dx, y + dy - 4], [x, y + 12], [x + dx, y + 12], [x, y + 6], [x + dx, y + 6]];
  return (
    <g>
      <Caja g={g} x={x} y={y} dx={dx} dy={dy - 9} z0={1.6} z1={h} tapa="#fbf8f1" izq="#f3eee4" der="#ece6d9" borde={OCRE} w={1.2} animado={false} />
      <Caja g={g} x={x} y={y + dy - 9} dx={dx} dy={9} z0={1.6} z1={9} tapa="#fbf8f1" izq="#f3eee4" der="#ece6d9" borde={OCRE} w={1.2} animado={false} />
      {ruedas.map(([rx, ry], k) => <Elipse key={k} g={g} x={rx} y={ry} r={1.3} z={1.3} fill={TINTA} />)}
    </g>
  );
}

/** El montaje tipo de noche: escenario con truss, focos y sonido; barra con taburetes; guirnaldas; público. */
function Noche({ g }: { g: GeoPerspectiva }) {
  const { p } = g;
  const copa = (x: number, y: number): Pt => p(x, y, 21);
  const cadenas: Array<[Pt, Pt]> = [];
  for (let i = 0; i < PALMERAS_O.length - 1; i++) cadenas.push([copa(...PALMERAS_O[i]), copa(...PALMERAS_O[i + 1])]);
  for (let i = 0; i < PALMERAS_E.length - 1; i++) cadenas.push([copa(...PALMERAS_E[i]), copa(...PALMERAS_E[i + 1])]);
  for (let i = 0; i < 7; i++) cadenas.push([copa(...PALMERAS_O[i]), copa(...PALMERAS_E[i])]);
  const bombillas: Array<{ q: Pt; i: number }> = [];
  let k = 0;
  const hilos = cadenas.map(([a, b], j) => {
    const c: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 5];
    for (let t = 0.12; t < 0.92; t += 0.13) {
      const u = 1 - t;
      bombillas.push({ q: [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]], i: k++ });
    }
    return <path key={j} className="noche-hilo" d={`M${a[0].toFixed(1)},${a[1].toFixed(1)} Q${c[0].toFixed(1)},${c[1].toFixed(1)} ${b[0].toFixed(1)},${b[1].toFixed(1)}`} fill="none" stroke={LUZ} strokeWidth="0.45" opacity="0.5" />;
  });

  const E = ESCENARIO;
  const m1a = p(E.x, E.y + E.dy, E.h), m1b = p(E.x, E.y + E.dy, E.truss);
  const m2a = p(E.x + E.dx, E.y + E.dy, E.h), m2b = p(E.x + E.dx, E.y + E.dy, E.truss);
  const focos = [0.12, 0.31, 0.5, 0.69, 0.88].map((t) => lerp(m1b, m2b, t));
  const haz = (f: Pt, s: number) => `M${f[0].toFixed(1)},${f[1].toFixed(1)} L${(f[0] - 20 * s).toFixed(1)},${(f[1] + 48).toFixed(1)} L${(f[0] - 4 * s).toFixed(1)},${(f[1] + 52).toFixed(1)} Z`;
  const cP = p(BARRA.x - 6, BARRA.y + BARRA.dy / 2, 0);
  const taburetes = Array.from({ length: 6 }, (_, i): Pt => [BARRA.x + BARRA.dx + 2, BARRA.y + 3 + i * 5]);

  return (
    <g className="noche" pointerEvents="none">
      <g className="capa capa-barra-luz">
        <ellipse cx={cP[0].toFixed(1)} cy={cP[1].toFixed(1)} rx="70" ry="26" fill={OCRE} opacity="0.12" />
        <ellipse cx={cP[0].toFixed(1)} cy={cP[1].toFixed(1)} rx="38" ry="13" fill={OCRE} opacity="0.12" />
      </g>
      <g className="capa capa-publico">
        {MULTITUD.filter((_, i) => i % 2 === 0).map(([x, y], i) => (
          <Elipse key={i} g={g} x={x} y={y} r={0.55} z={0.4} className="noche-persona" style={cssVars({ "--i": i })} fill={LUZ} opacity="0.75" />
        ))}
      </g>
      <g className="capa capa-barra-luz">
        <Caja g={g} x={BARRA.x} y={BARRA.y} dx={BARRA.dx} dy={BARRA.dy} z1={BARRA.h} tapa="#3a3327" izq="#2e2920" der="#26211a" borde={LUZ} w={0.9} animado={false} />
        {taburetes.map(([tx, ty], i) => <Elipse key={i} g={g} x={tx} y={ty} r={0.9} z={2.4} fill="none" stroke={LUZ} strokeWidth="0.7" />)}
      </g>
      <g className="capa capa-tarima">
        <Caja g={g} x={E.x} y={E.y} dx={E.dx} dy={E.dy} z1={E.h} tapa="#3a3327" izq="#2e2920" der="#26211a" borde={LUZ} w={1} animado={false} />
      </g>
      <g className="capa capa-sonido">
        <Caja g={g} x={E.x - 5} y={E.y + E.dy - 4} dx={4} dy={4} z1={9} tapa="#2e2920" izq="#26211a" der="#1e1a14" borde={LUZ} w={0.7} animado={false} />
        <Caja g={g} x={E.x + E.dx + 1} y={E.y + E.dy - 4} dx={4} dy={4} z1={9} tapa="#2e2920" izq="#26211a" der="#1e1a14" borde={LUZ} w={0.7} animado={false} />
      </g>
      <g className="capa capa-truss">
        <line x1={m1a[0]} y1={m1a[1]} x2={m1b[0]} y2={m1b[1]} stroke={LUZ} strokeWidth="1" />
        <line x1={m2a[0]} y1={m2a[1]} x2={m2b[0]} y2={m2b[1]} stroke={LUZ} strokeWidth="1" />
        <line x1={m1b[0]} y1={m1b[1]} x2={m2b[0]} y2={m2b[1]} stroke={LUZ} strokeWidth="1.2" />
        <line x1={m1b[0]} y1={m1b[1] + 2.2} x2={m2b[0]} y2={m2b[1] + 2.2} stroke={LUZ} strokeWidth="0.6" opacity="0.7" />
        {Array.from({ length: 11 }, (_, i) => lerp(m1b, m2b, i / 10)).map((q, i) => (
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

function Cota({ g, a, b, texto, lado = 1 }: { g: GeoPerspectiva; a: [number, number, number?]; b: [number, number, number?]; texto: string; lado?: 1 | -1 }) {
  const A = g.p(a[0], a[1], a[2] ?? 0), B = g.p(b[0], b[1], b[2] ?? 0);
  const an = Math.atan2(B[1] - A[1], B[0] - A[0]), f = 4.4;
  const punta = (q: Pt, s: number) =>
    `M${(q[0] + Math.cos(an + 0.4) * f * s).toFixed(1)},${(q[1] + Math.sin(an + 0.4) * f * s).toFixed(1)} L${q[0].toFixed(1)},${q[1].toFixed(1)} L${(q[0] + Math.cos(an - 0.4) * f * s).toFixed(1)},${(q[1] + Math.sin(an - 0.4) * f * s).toFixed(1)}`;
  const m: Pt = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
  let giro = (an * 180) / Math.PI;
  if (giro > 90) giro -= 180; if (giro < -90) giro += 180;
  return (
    <g className="ap" opacity="0.85">
      <line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke={GRIS} strokeWidth="0.6" />
      <path d={punta(A, 1)} fill="none" stroke={GRIS} strokeWidth="0.6" />
      <path d={punta(B, -1)} fill="none" stroke={GRIS} strokeWidth="0.6" />
      <text transform={`translate(${m[0].toFixed(1)},${m[1].toFixed(1)}) rotate(${giro.toFixed(1)})`} y={lado > 0 ? 11 : -6}
            fill={GRIS} fontFamily="ui-monospace,monospace" fontSize="8" letterSpacing="1.4" textAnchor="middle">{texto}</text>
    </g>
  );
}

// ── textos ─────────────────────────────────────────────────────────────────

const T = {
  es: {
    ojo: "Plano del recinto · vista desde el sur",
    titulo: "~18 000 ft² al aire libre con palapa techada de ~4 000 ft².",
    intro: "El recinto exterior visto desde el sur, como en la foto aérea, a partir del plano del sitio y las fotografías. Selecciona una zona para ver su ficha, o activa una capa de montaje: plan de lluvia, aforo sentado, load-in o montaje nocturno.",
    aria: "Perspectiva del recinto desde el sur: el edificio de dos niveles al fondo con su puerta, el paseo pavimentado bajando hacia la cámara, la palapa de paja a la izquierda junto a NW 1st Ct, el área de arena con mesas de picnic entre palapa y edificio, ocho cabañas-pérgola a la derecha del paseo, palmeras, setos y estacionamiento al este y al sur.",
    modos: { todo: "Vista general", lluvia: "Plan de lluvia", mesas: "Aforo sentado · 300", camion: "Load-in · camión 40 ft", noche: "Montaje nocturno" } as Partial<Record<Modo, string>>,
    explica: {
      todo: "Lo techado va en tinta y lo abierto en claro. El paseo baja de la puerta del edificio hacia el estacionamiento sur y es por donde entra todo. Fuera de los setos, la calle.",
      lluvia: "La palapa cubre ~4 000 ft² con techo de paja, abierta por los cuatro costados: para el sol y el agua que cae recta. Lo demás queda al aire, y para un evento de invierno conviene carpa lateral.",
      carpa: "Con viento la lluvia entra de lado. Para un evento de invierno se cierran los costados con carpa lateral, que trae tu proveedor: aquí va dibujada a trazos.",
      mesas: "Treinta mesas de diez con sus sillas, a escala: dieciséis bajo la palapa y catorce en el césped, a los dos lados del paseo. Son los ~300 sentados verificados, con pasillo de servicio entre mesas.",
      gente: "Seiscientas personas de pie, a ocho pies cuadrados cada una, bajo la palapa y en el césped oeste. Es el aforo verificado, dibujado.",
      camion: "Desde la calle, por el estacionamiento sur, al paseo pavimentado, continuo y a nivel: un camión de 40 ft llega hasta la puerta del edificio sin pisar césped.",
      noche: "Un montaje posible, de noche: escenario al fondo del césped, tu barra bajo la palapa, público de pie y guirnaldas entre las palmeras del paseo. Todo lo encendido lo trae tu equipo; la luz colgada se aprueba en la visita.",
      barra: "Bajo la palapa, del lado del paseo, hay sitio para montar barra. La barra la trae tu equipo: aquí va dibujada a trazos, donde suele ir.",
    } as Record<Modo, string>,
    zonas: {
      jardin: {
        nombre: "El Jardín", dato: "~18 000 ft² · al aire libre",
        lee: "Césped artificial a los dos lados del paseo, un área de arena con mesas de picnic bajo sombrillas, palmeras reales y setos perimetrales.",
        sirve: "Es el volumen del recinto: recepción de pie, cena larga a lo largo del paseo o escenario al fondo con público en el césped. El paseo lo parte en dos, y esa geometría manda en cualquier montaje.",
        ojo: "Al aire libre y sin cerramiento. El césped es artificial, así que no se embarra; para cargas puntuales hay que repartir apoyo.",
      },
      tiki: {
        nombre: "El Tiki Hut", dato: "~4 000 ft² · techado",
        lee: "Palapa cuadrada de paja a cuatro aguas sobre postes de madera, en la esquina suroeste junto a NW 1st Ct, abierta por los cuatro costados. Es el plan de lluvia.",
        sirve: "La sombra permanente del recinto. Caben dieciséis mesas de diez, la barra del cliente del lado del paseo, o un escenario pequeño.",
        ojo: "Para el agua que cae recta basta sola; con viento conviene cerrar los costados. La luz libre entre postes se levanta en la visita.",
      },
      cabanas: {
        nombre: "Ocho cabañas", dato: "pérgolas amuebladas · en hilera",
        lee: "Pérgolas de postes y listones blancos, abiertas, con sofá, en hilera al este del paseo entre las palmeras.",
        sirve: "Camerino, guardarropa, salón VIP o rincón de descanso sin tener que montar nada.",
        ojo: "Van con el predio: no se pueden mover ni retirar del montaje.",
      },
      acceso: {
        nombre: "Acceso", dato: "esquina NW 1st Ct · NW 21st Ct",
        lee: "Lote de esquina. La producción entra por el estacionamiento sur al paseo pavimentado, continuo y a nivel hasta la puerta del edificio.",
        sirve: "Por aquí entra todo: camión, catering, estructura y escenario, sin pisar césped. Estacionamiento en el propio predio, al este y al sur.",
        ojo: "El ancho exacto del portón y la potencia eléctrica disponible se levantan contigo en la visita y se entregan por escrito.",
      },
      edificio: {
        nombre: "El edificio", dato: "zona 02 · 2 niveles · 16 000 ft²",
        lee: "Cierra el norte del recinto: el paseo termina en su puerta. Dos niveles, cuatro salas privadas arriba; el cascarón se alquila aparte y tiene su propia lámina.",
        sirve: "Es la zona 02 y va por separado. Sirve si el evento necesita interior además del jardín: camerinos, cocina de catering o plan B completo.",
        ojo: "Lo que hay montado hoy dentro (arcade, barra, salas) pertenece al operador del inmueble y no forma parte de lo que se alquila.",
      },
    } as Record<Zona, { nombre: string; dato: string; lee: string; sirve: string; ojo: string }>,
    cajetin: ["Club Wynwood", "El recinto · zona 01", "Vista desde el sur · sin escala"],
    escala: "50 ft",
    calleO: "NW 1ST CT",
    calleS: "NW 21ST CT",
    parking: "P",
    nota: "Perspectiva sin escala fina: la disposición sale del plano del sitio publicado por el propietario y las superficies de las declaradas; se confirman en la visita técnica. Lo techado se dibuja en tinta y lo abierto en claro. El montaje de noche es un ejemplo: todo lo encendido lo trae el cliente.",
  },
  en: {
    ojo: "Site plan · view from the south",
    titulo: "~18,000 sq ft outdoors with a ~4,000 sq ft thatched structure.",
    intro: "The outdoor site seen from the south, as in the aerial photograph, from the site plan and the photographs. Select a zone to see its data, or turn on a layout layer: rain plan, seated capacity, load-in or night setup.",
    aria: "Perspective of the site from the south: the two-level building at the far end with its door, the paved walk coming down towards the camera, the thatched structure on the left by NW 1st Ct, the sand area with picnic tables between structure and building, eight pergola cabanas on the right of the walk, palms, hedges and parking to the east and south.",
    modos: { todo: "Overview", lluvia: "Rain plan", mesas: "Seated capacity · 300", camion: "Load-in · 40 ft truck", noche: "Night setup" } as Partial<Record<Modo, string>>,
    explica: {
      todo: "Roofed volumes are drawn in ink, open ground in light tone. The walk runs from the building door down to the south parking, and it is how everything gets in. Beyond the hedges, the street.",
      lluvia: "The structure covers ~4,000 sq ft under thatch, open on all four sides: it stops sun and vertical rain. The rest stays open-air, and a winter event should budget for side tenting.",
      carpa: "With wind, rain comes in sideways. A winter event closes the sides with side tenting, which your supplier brings: here it is drawn dashed.",
      mesas: "Thirty tables of ten with their chairs, to scale: sixteen under the structure and fourteen on the turf, on both sides of the walk. These are the verified ~300 seated, with service aisles between tables.",
      gente: "Six hundred people standing, at eight square feet each, under the structure and on the west turf. That is the verified capacity, drawn.",
      camion: "From the street, through the south parking, onto the paved walk, continuous and level: a 40 ft truck reaches the building door without crossing turf.",
      noche: "One possible setup, at night: a stage at the far end of the turf, your bar under the structure, a standing crowd and string lights between the palms of the walk. Everything lit is brought by your team; hung lighting is approved at the visit.",
      barra: "Under the structure, on the walk side, there is room to set up a bar. The bar comes with your team: here it is drawn dashed, where it usually goes.",
    } as Record<Modo, string>,
    zonas: {
      jardin: {
        nombre: "The Garden", dato: "~18,000 sq ft · open air",
        lee: "Artificial turf on both sides of the walk, a sand area with picnic tables under umbrellas, real palms and perimeter hedges.",
        sirve: "This is the volume of the site: standing reception, a long dinner along the walk, or a stage at the far end with a crowd on the turf. The walk splits it in two, and that geometry drives any layout.",
        ojo: "Open air, no enclosure. The turf is artificial, so it will not turn to mud; point loads need spreading.",
      },
      tiki: {
        nombre: "The Tiki Hut", dato: "~4,000 sq ft · covered",
        lee: "A square four-hip thatch roof on timber posts, in the south-west corner by NW 1st Ct, open on all four sides. It is the rain plan.",
        sirve: "The site's permanent shade. It takes sixteen tables of ten, the client's bar on the walk side, or a small stage.",
        ojo: "For vertical rain it is enough on its own; with wind you will want the sides closed. Clear span between posts is surveyed at the visit.",
      },
      cabanas: {
        nombre: "Eight cabanas", dato: "furnished pergolas · in a row",
        lee: "Open pergolas of posts and white slats, with a sofa, in a row east of the walk between the palms.",
        sirve: "Green room, coat check, VIP lounge or a quiet corner, without building anything.",
        ojo: "They come with the site: they cannot be moved or taken out of the layout.",
      },
      acceso: {
        nombre: "Access", dato: "corner of NW 1st Ct · NW 21st Ct",
        lee: "Corner lot. Production enters through the south parking onto the paved walk, continuous and level to the building door.",
        sirve: "Everything comes in here: truck, catering, rigging and stage, without crossing turf. On-site parking to the east and south.",
        ojo: "Exact gate width and available power are surveyed with you at the visit and delivered in writing.",
      },
      edificio: {
        nombre: "The building", dato: "zone 02 · 2 levels · 16,000 sq ft",
        lee: "It closes the north of the site: the walk ends at its door. Two levels, four private rooms upstairs; the shell is rented separately and has its own plate.",
        sirve: "It is zone 02 and goes separately. Useful if the event needs indoor space as well as the garden: green rooms, catering kitchen or a full plan B.",
        ojo: "Whatever is installed inside today (arcade, bar, rooms) belongs to the building's operator and is not part of the rental.",
      },
    } as Record<Zona, { nombre: string; dato: string; lee: string; sirve: string; ojo: string }>,
    cajetin: ["Club Wynwood", "The site · zone 01", "View from the south · not to scale"],
    escala: "50 ft",
    calleO: "NW 1ST CT",
    calleS: "NW 21ST CT",
    parking: "P",
    nota: "Perspective, not to fine scale: the layout comes from the owner's published site plan and the areas from the declared figures; both are confirmed at the technical visit. Roofed volumes in ink, open ground in light tone. The night setup is an example: everything lit is brought by the client.",
  },
} as const;

const ORDEN_ZONAS: Zona[] = ["jardin", "tiki", "cabanas", "acceso", "edificio"];
const MODOS_MANUALES: Modo[] = ["todo", "lluvia", "mesas", "camion", "noche"];

// ── el dibujo, memorizado ──────────────────────────────────────────────────

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

  // El camión avanza hacia el norte (y decrece): el desplazamiento inicial lo pone al sur, en el estacionamiento.
  const d0 = p(CAMION.x, CAMION.y, 0), d1 = p(CAMION.x, CAMION.y + CAMION.recorrido, 0);
  const desplazamiento = { cx: d1[0] - d0[0], cy: d1[1] - d0[1] };
  const escalaCamion = g.escala(CAMION.x, CAMION.y + CAMION.recorrido) / g.escala(CAMION.x, CAMION.y);

  const azar = lcg(20260902);
  const GOTAS = Array.from({ length: 130 }, () => ({ x: VB.x + azar() * VB.w, y: VB.y + azar() * VB.h, t: -(azar() * 1.1).toFixed(2) }));

  // Juntas del pavimento, cada 8 ft.
  const juntas = [];
  for (let y = PASEO.y0 + 8; y < PASEO.y1; y += 8) {
    const a = p(PASEO.x, y, 0.05), b = p(PASEO.x + PASEO.dx, y, 0.05);
    juntas.push(<line key={y} className="ap" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#cfc7b6" strokeWidth="0.55" />);
  }

  // Estacionamiento: plazas y coches, este y sur.
  const plazas = [];
  const coches: Array<{ prof: number; el: React.ReactNode }> = [];
  const tonos = ["#d9d3c6", "#c9c2b3", "#e2ddd1", "#bdb6a6", "#d2cbbd"];
  const pE = PARKING_E.dy / PARKING_E.plazas;
  for (let i = 0; i <= PARKING_E.plazas; i++) {
    const y = PARKING_E.y + i * pE;
    const a = p(PARKING_E.x + 2, y, 0.02), b = p(PARKING_E.x + PARKING_E.dx - 2, y, 0.02);
    plazas.push(<line key={`e${i}`} className="ap" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#cfc7b6" strokeWidth="0.5" />);
    if (i < PARKING_E.plazas && i % 3 !== 1) coches.push({ prof: g.profundidad(PARKING_E.x + 12, y + pE / 2), el: <Coche key={`ce${i}`} g={g} x={PARKING_E.x + 6} y={y + 1.5} dx={16} dy={pE - 3} tono={tonos[i % tonos.length]} /> });
  }
  const pS = PARKING_S.dx / PARKING_S.plazas;
  for (let i = 0; i <= PARKING_S.plazas; i++) {
    const x = PARKING_S.x + i * pS;
    const a = p(x, PARKING_S.y + 1, 0.02), b = p(x, PARKING_S.y + PARKING_S.dy - 1, 0.02);
    plazas.push(<line key={`s${i}`} className="ap" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#cfc7b6" strokeWidth="0.5" />);
    if (i < PARKING_S.plazas && (i * 5) % 4 !== 2 && (x < PASEO.x - 12 || x > PASEO.x + PASEO.dx + 6)) coches.push({ prof: g.profundidad(x + pS / 2, PARKING_S.y + 10), el: <Coche key={`cs${i}`} g={g} x={x + 1.2} y={PARKING_S.y + 3} dx={pS - 2.4} dy={16} tono={tonos[(i + 2) % tonos.length]} /> });
  }

  // La puerta del edificio, en la cara sur, donde acaba el paseo.
  const puerta = poly(p(PUERTA.x, EDIF.dy, 0), p(PUERTA.x + PUERTA.dx, EDIF.dy, 0), p(PUERTA.x + PUERTA.dx, EDIF.dy, PUERTA.h), p(PUERTA.x, EDIF.dy, PUERTA.h));
  const ventanas = [];
  for (let k = 0; k < 6; k++) {
    const x = EDIF.x + 8 + k * 19;
    if (x + 10 > PUERTA.x - 4 && x < PUERTA.x + PUERTA.dx + 4) continue;
    ventanas.push(<path key={k} className="ap" d={poly(p(x, EDIF.dy, 15), p(x + 10, EDIF.dy, 15), p(x + 10, EDIF.dy, 20), p(x, EDIF.dy, 20))} fill="#e2ddd1" stroke={GRIS} strokeWidth="0.5" />);
  }

  // Los cuatro costados abiertos de la palapa: flechas hacia fuera.
  const cP: Pt = [PALAPA.x + PALAPA.dx / 2, PALAPA.y + PALAPA.dy / 2];
  const lados: Array<[Pt, Pt]> = [
    [p(cP[0], PALAPA.y, 5), p(cP[0], PALAPA.y - 8, 5)],
    [p(cP[0], PALAPA.y + PALAPA.dy, 5), p(cP[0], PALAPA.y + PALAPA.dy + 8, 5)],
    [p(PALAPA.x, cP[1], 5), p(PALAPA.x - 7, cP[1], 5)],
    [p(PALAPA.x + PALAPA.dx, cP[1], 5), p(PALAPA.x + PALAPA.dx + 7, cP[1], 5)],
  ];
  const pasillos = [1.5, 2.5].map((f) => [p(PALAPA.x + 3, PALAPA.y + 7 + f * 13.3 - 6.6, 0.1), p(PALAPA.x + PALAPA.dx - 3, PALAPA.y + 7 + f * 13.3 - 6.6, 0.1)] as [Pt, Pt]);

  // Los objetos sueltos, ordenados por profundidad: lo lejano se pinta primero.
  const objetos: Array<{ prof: number; el: React.ReactNode }> = [
    ...PALMERAS_O.map(([x, y], i) => ({ prof: g.profundidad(x, y), el: <Palma key={`po${i}`} g={g} x={x} y={y} i={i} /> })),
    ...PALMERAS_E.map(([x, y], i) => ({ prof: g.profundidad(x, y), el: <Palma key={`pe${i}`} g={g} x={x} y={y} i={i + 7} /> })),
    ...PALMERAS_PALAPA.map(([x, y], i) => ({ prof: g.profundidad(x, y), el: <Palma key={`pp${i}`} g={g} x={x} y={y} i={i + 14} alto={26} /> })),
    ...Array.from({ length: CABANAS.n }, (_, i) => {
      const y = CABANAS.y0 + i * CABANAS.paso;
      return { prof: g.profundidad(CABANAS.x + CABANAS.dx / 2, y + CABANAS.dy / 2), el: <g key={`cab${i}`} className={zClase("cabanas")} {...zProps("cabanas")}><Cabana g={g} y={y} i={i} /></g> };
    }),
    { prof: g.profundidad(cP[0], cP[1]), el: <g key="palapa" className={zClase("tiki")} {...zProps("tiki")}><Palapa g={g} mesasN={mesasN} /></g> },
    ...PICNIC.map(([x, y], i) => ({ prof: g.profundidad(x, y), el: <g key={`pic${i}`} className="capa capa-picnic"><g className="picnic-entra" style={cssVars({ "--i": i })}><Picnic g={g} x={x} y={y} /></g></g> })),
    ...MESAS.slice(16, mesasN).map(([x, y], i) => ({ prof: g.profundidad(x, y), el: <g key={`mesa${i}`} className="mesas"><Mesa g={g} x={x} y={y} i={i + 16} /></g> })),
    ...GENTE_SUELTA.map(([x, y], i) => ({ prof: g.profundidad(x, y), el: <Persona key={`gs${i}`} g={g} x={x} y={y} /> })),
    { prof: g.profundidad(CAMION.x, CAMION.y + 20), el: (
      <g key="camion" className="camion" pointerEvents="none" style={cssVars({ "--cx": `${desplazamiento.cx.toFixed(1)}px`, "--cy": `${desplazamiento.cy.toFixed(1)}px`, "--s": escalaCamion.toFixed(3) })}>
        <Camion g={g} />
      </g>
    ) },
    ...coches,
  ].sort((a, b) => a.prof === b.prof ? 0 : a.prof < b.prof ? 1 : -1);

  const puntoCalleO = p(CALLE_O.x + 14, 150, 0), puntoCalleS = p(60, LOTE.dy + 16, 0);
  const oN = p(140, 20, 0), nN = p(140, 5, 0);
  const radN = Math.atan2(nN[1] - oN[1], nN[0] - oN[0]);
  const angN = (radN * 180) / Math.PI + 90;

  return (
    <svg viewBox={`${VB.x.toFixed(0)} ${VB.y.toFixed(0)} ${VB.w.toFixed(0)} ${VB.h.toFixed(0)}`} role="img" aria-label={t.aria}>
      <defs>
        <pattern id="lam-cesped" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.38" fill="#9faa86" />
          <circle cx="3" cy="3" r="0.38" fill="#9faa86" />
        </pattern>
        <pattern id="lam-arena" width="3" height="3" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="0.3" fill="#d9cdb0" />
        </pattern>
      </defs>

      {/* ── calles, lote, estacionamiento, arena, césped, paseo ───── */}
      <g style={cssVars({ "--d": "0s" })}>
        <path className="rl" d={techo(CALLE_O.x, -6, CALLE_O.dx, LOTE.dy + CALLE_S.dy + 6, 0)} fill="#ddd6c8" />
        <path className="rl" d={techo(CALLE_O.x, CALLE_S.y, LOTE.dx + 10 - CALLE_O.x, CALLE_S.dy, 0)} fill="#ddd6c8" />
        <path className="rl tz" pathLength={1} d={techo(0, 0, LOTE.dx, LOTE.dy, 0)} fill="#f4efe3" stroke={GRIS} strokeWidth="0.8" />
        <path className="rl" d={techo(PARKING_E.x, PARKING_E.y, PARKING_E.dx, PARKING_E.dy, 0.01)} fill="#e8e2d6" />
        <path className="rl" d={techo(PARKING_S.x, PARKING_S.y, PARKING_S.dx, PARKING_S.dy, 0.01)} fill="#e8e2d6" />
        {plazas}
        <g className={zClase("jardin")} {...zProps("jardin")}>
          <path className="rl" d={techo(ARENA.x, ARENA.y, ARENA.dx, ARENA.dy, 0.02)} fill="#efe6d2" />
          <path className="rl" d={techo(ARENA.x, ARENA.y, ARENA.dx, ARENA.dy, 0.02)} fill="url(#lam-arena)" opacity="0.7" />
          <path className="rl cesped" d={techo(CESPED_O.x, ARENA.y + ARENA.dy, CESPED_O.dx, CESPED_O.dy - ARENA.dy, 0.02)} fill="#dfe0c6" />
          <path className="rl cesped" d={techo(CESPED_O.x, ARENA.y + ARENA.dy, CESPED_O.dx, CESPED_O.dy - ARENA.dy, 0.02)} fill="url(#lam-cesped)" opacity="0.6" />
          <path className="rl cesped" d={techo(CESPED_E.x, CESPED_E.y, CESPED_E.dx, CESPED_E.dy, 0.02)} fill="#e3e0cc" />
          <path className="rl cesped" d={techo(CESPED_E.x, CESPED_E.y, CESPED_E.dx, CESPED_E.dy, 0.02)} fill="url(#lam-cesped)" opacity="0.45" />
        </g>
        <path className="rl tz paseo-pav" pathLength={1} d={techo(PASEO.x, PASEO.y0, PASEO.dx, PASEO.y1 - PASEO.y0 + 6, 0.04)} fill={PAPEL} stroke={GRIS} strokeWidth="0.7" />
        {juntas}
        <text className="ap" transform={`translate(${puntoCalleO[0].toFixed(1)},${puntoCalleO[1].toFixed(1)}) rotate(-72)`} fill={GRIS} fontFamily="ui-monospace,monospace" fontSize="7" letterSpacing="1.6" textAnchor="middle">{t.calleO}</text>
        <text className="ap" transform={`translate(${puntoCalleS[0].toFixed(1)},${puntoCalleS[1].toFixed(1)})`} fill={GRIS} fontFamily="ui-monospace,monospace" fontSize="7.5" letterSpacing="1.8" textAnchor="middle">{t.calleS}</text>
        <text className="ap" transform={`translate(${p(PARKING_E.x + PARKING_E.dx / 2, PARKING_E.y - 6, 0)[0].toFixed(1)},${p(PARKING_E.x + PARKING_E.dx / 2, PARKING_E.y - 6, 0)[1].toFixed(1)})`} fill={GRIS} fontFamily="ui-monospace,monospace" fontSize="7" textAnchor="middle">{t.parking}</text>
      </g>

      {/* ── la gente de pie (solo en su modo), sobre el suelo ─────── */}
      <g className="gente" pointerEvents="none">
        {MULTITUD.slice(0, genteN).map(([x, y], i) => (
          <Elipse key={i} g={g} x={x} y={y} r={0.55} z={0.4} className="persona" style={cssVars({ "--i": i })} fill={TINTA} opacity="0.7" />
        ))}
      </g>
      <g className="capa capa-pasillos" pointerEvents="none">
        {pasillos.map(([a, b], i) => <line key={i} className="pasillo" style={cssVars({ "--i": i })} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={OCRE} strokeWidth="1" strokeDasharray="4 3" />)}
      </g>

      {/* ── el edificio, al fondo: lo primero que se pinta de lo que tiene volumen ── */}
      <g className={zClase("edificio")} {...zProps("edificio")} style={cssVars({ "--d": ".3s" })}>
        <Caja g={g} x={EDIF.x} y={EDIF.y} dx={EDIF.corte} dy={EDIF.dy} z1={EDIF.h2} tapa="#f5f1e8" izq="#ece7db" der="#e4ded1" borde={GRIS} w={0.8} />
        <Caja g={g} x={EDIF.x + EDIF.corte} y={EDIF.y} dx={EDIF.dx - EDIF.corte} dy={EDIF.dy} z1={EDIF.h1} tapa="#f5f1e8" izq="#ece7db" der="#e4ded1" borde={GRIS} w={0.8} />
        {ventanas}
        <path className="ap puerta" d={puerta} fill="#d9d2c4" stroke={TINTA} strokeWidth="0.8" />
        <line className="ap" x1={p(PUERTA.x + PUERTA.dx / 2, EDIF.dy, 0)[0]} y1={p(PUERTA.x + PUERTA.dx / 2, EDIF.dy, 0)[1]} x2={p(PUERTA.x + PUERTA.dx / 2, EDIF.dy, PUERTA.h)[0]} y2={p(PUERTA.x + PUERTA.dx / 2, EDIF.dy, PUERTA.h)[1]} stroke={TINTA} strokeWidth="0.6" />
      </g>

      {/* ── setos: el de NW 1st Ct (oeste) y los del sur del césped ── */}
      <g style={cssVars({ "--d": ".5s" })}>
        <Seto g={g} x={0} y={ARENA.y - 2} dx={SETO.ancho} dy={PARKING_S.y - ARENA.y + 2} />
        <Seto g={g} x={0} y={PARKING_S.y - SETO.ancho} dx={PASEO.x - 6} dy={SETO.ancho} />
        <Seto g={g} x={PASEO.x + PASEO.dx + 6} y={PARKING_S.y - SETO.ancho} dx={PARKING_E.x - PASEO.x - PASEO.dx - 6} dy={SETO.ancho} />
        <Seto g={g} x={PARKING_E.x - SETO.ancho} y={PARKING_E.y} dx={SETO.ancho} dy={PARKING_E.dy - 10} />
      </g>

      {/* ── los objetos con volumen, de lejos a cerca ─────────────── */}
      <g style={cssVars({ "--d": ".8s" })}>
        {objetos.map((o) => o.el)}
      </g>

      {/* costados abiertos y portón: capas del guion */}
      <g className="capa capa-lados" pointerEvents="none">
        {lados.map(([a, b], i) => (
          <g key={i} className="lado-flecha" style={cssVars({ "--i": i })}>
            <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={OCRE} strokeWidth="1.2" />
            <circle cx={b[0]} cy={b[1]} r="1.8" fill={OCRE} />
          </g>
        ))}
      </g>
      <g className="capa capa-porton" pointerEvents="none">
        <path className="porton" d={techo(PASEO.x - 2, PASEO.y1 - 1, PASEO.dx + 4, 3, 0.1)} fill={OCRE} opacity="0.6" />
      </g>

      {/* ── el acceso: la flecha desde la calle sur ───────────────── */}
      <g className={zClase("acceso")} {...zProps("acceso")} style={cssVars({ "--d": "1.6s" })}>
        {(() => {
          const A = p(PASEO.x + PASEO.dx / 2, LOTE.dy + 22, 0), B = p(PASEO.x + PASEO.dx / 2, PASEO.y1 + 4, 0);
          const an = Math.atan2(B[1] - A[1], B[0] - A[0]);
          const punta = `M${(B[0] - Math.cos(an - 0.5) * 7).toFixed(1)},${(B[1] - Math.sin(an - 0.5) * 7).toFixed(1)} L${B[0].toFixed(1)},${B[1].toFixed(1)} L${(B[0] - Math.cos(an + 0.5) * 7).toFixed(1)},${(B[1] - Math.sin(an + 0.5) * 7).toFixed(1)}`;
          return (
            <>
              <path className="tz" pathLength={1} d={`M${A[0].toFixed(1)},${A[1].toFixed(1)} L${B[0].toFixed(1)},${B[1].toFixed(1)}`} fill="none" stroke={TINTA} strokeWidth="1.6" />
              <path className="tz" pathLength={1} d={punta} fill="none" stroke={TINTA} strokeWidth="1.6" strokeLinejoin="round" />
              <path d={techo(PASEO.x - 16, PASEO.y1, PASEO.dx + 32, 30, 0)} fill="transparent" />
            </>
          );
        })()}
      </g>

      {/* ── cotas, norte, escala ─────────────────────────────────── */}
      <g pointerEvents="none" style={cssVars({ "--d": "1.9s" })}>
        <Cota g={g} a={[0, PARKING_S.y + PARKING_S.dy + 3]} b={[LOTE.dx, PARKING_S.y + PARKING_S.dy + 3]} texto="≈ 150 FT · 46 M" />
        <Cota g={g} a={[LOTE.dx + 4, EDIF.dy]} b={[LOTE.dx + 4, PARKING_S.y]} texto="≈ 135 FT · 41 M" lado={-1} />
        <Cota g={g} a={[PALAPA.x, PALAPA.y + PALAPA.dy + 5]} b={[PALAPA.x + PALAPA.dx, PALAPA.y + PALAPA.dy + 5]} texto="≈ 54 FT" />

        <g className="ap" transform={`translate(${(VB.x + VB.w - 30).toFixed(1)},${(VB.y + 40).toFixed(1)})`}>
          <g transform={`rotate(${angN.toFixed(1)})`}>
            <path d="M0,14 L0,-11 M-3.2,-4 L0,-12 L3.2,-4" fill="none" stroke={TINTA} strokeWidth="1" />
          </g>
          <text x={(Math.cos(radN) * 21).toFixed(1)} y={(Math.sin(radN) * 21).toFixed(1)} dy="3" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8.5" fill={GRIS}>N</text>
        </g>

        {(() => {
          // La barra de escala se mide en el primer plano, donde la cámara es más generosa.
          const s = g.escala(PASEO.x, PASEO.y1) * 50;
          return (
            <g className="ap" transform={`translate(${(VB.x + 16).toFixed(1)},${(VB.y + VB.h - 22).toFixed(1)})`}>
              {[0, 1, 2].map((i) => (
                <rect key={i} x={(i * s) / 3} y="0" width={s / 3} height="4" fill={i % 2 ? PAPEL : TINTA} stroke={TINTA} strokeWidth="0.45" />
              ))}
              <text x="0" y="13" fontFamily="ui-monospace,monospace" fontSize="6.8" fill={GRIS}>0</text>
              <text x={s.toFixed(1)} y="13" fontFamily="ui-monospace,monospace" fontSize="6.8" fill={GRIS} textAnchor="end">{t.escala.toUpperCase()} · {lang === "es" ? "primer plano" : "foreground"}</text>
            </g>
          );
        })()}
      </g>

      {/* ── anochece y se enciende el montaje ─────────────────────── */}
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
    ({ zona: z, ancla, fin: [ancla[0] + dx, ancla[1] + dy] as Pt, lado, vert });
  const ROTULOS = [
    rotulo("jardin", p(40, 190, 0), -28, 40, "der", "inf"),
    rotulo("tiki", p(cxP, cyP, PALAPA_CUMBRE), -26, -50, "der"),
    rotulo("cabanas", p(CABANAS.x + CABANAS.dx / 2, CABANAS.y0 + 3 * CABANAS.paso + 5, CABANAS.h), 34, -46),
    rotulo("acceso", p(PASEO.x + PASEO.dx / 2, PASEO.y1 + 10, 0), 44, 22),
    rotulo("edificio", p(EDIF.x + EDIF.dx - 22, EDIF.y + 60, EDIF.h1), 26, -18),
  ];

  const altaEnVertical = cine && vertical;
  const ratioCaja = altaEnVertical ? Math.min(PROPORCION, 1.0) : PROPORCION;
  const fracCaja = (q: Pt): Pt => {
    const [fx, fy] = frac(q);
    if (ratioCaja >= PROPORCION - 1e-6) return [fx, fy];
    const alturaCaja = 1 / ratioCaja, alturaDibujo = 1 / PROPORCION;
    const margen = (alturaCaja - alturaDibujo) / 2;
    return [fx, (margen + fy * alturaDibujo) / alturaCaja];
  };
  const pctCaja = (q: Pt) => { const [fx, fy] = fracCaja(q); return { left: `${(fx * 100).toFixed(2)}%`, top: `${(fy * 100).toFixed(2)}%` }; };

  const zoomBase = altaEnVertical ? 1.25 : 1;
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
              <h2 style={{ maxWidth: "18ch" }}>{t.titulo}</h2>
              <p className="respuesta" style={{ margin: 0, color: "var(--texto)", maxWidth: "46ch" }}>{t.intro}</p>
            </div>
          </div>

          <div className="lam-escenario">
            <figure className="lam-fig" style={{ aspectRatio: String(ratioCaja) }}>
              <div className="lam-lienzo" style={camara}>
                <Dibujo lang={lang} zona={zona} aforo={aforo} alEntrar={alEntrar} alSalir={alSalir} alTocar={alTocar} />

                {dirigiendo && puntoDirigido && (
                  <div className={`lam-guia-punto${fracCaja(p(puntoDirigido[0], puntoDirigido[1], 0))[0] > 0.66 ? " izq" : ""}`} style={pctCaja(p(puntoDirigido[0], puntoDirigido[1], 0))} aria-hidden="true">
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
                {/* las líneas de guía de los rótulos, en HTML para que sigan a la cámara */}
                <svg className="lam-guias" viewBox={`${VB.x.toFixed(0)} ${VB.y.toFixed(0)} ${VB.w.toFixed(0)} ${VB.h.toFixed(0)}`} aria-hidden="true">
                  {ROTULOS.map((r) => (
                    <g key={r.zona} className={`guia guia-${r.zona}${zona === r.zona ? " activa" : ""}`}>
                      <line x1={r.ancla[0]} y1={r.ancla[1]} x2={r.fin[0]} y2={r.fin[1]} stroke={TINTA} strokeWidth="0.7" />
                      <circle cx={r.ancla[0]} cy={r.ancla[1]} r="2" fill={TINTA} />
                    </g>
                  ))}
                </svg>
              </div>

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

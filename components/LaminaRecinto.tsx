"use client";

import { memo, useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { crearPerspectiva, type GeoPerspectiva } from "@/lib/perspectiva";
import type { Idioma } from "@/lib/i18n";
import { ev } from "@/lib/medicion";
import {
  LOTE, EDIF, PUERTA, PASEO, PALAPA, PALAPA_ALERO, PALAPA_CUMBRE, PALAPA_CUMBRERA, PALAPA_POSTES,
  ARENA, PICNIC, CABANAS, CESPED_O, CESPED_E, PALMERAS_O, PALMERAS_E, PALMERAS_PALAPA, SETO,
  PARKING_E, PARKING_S, CALLE_O, CALLE_S, MESAS, ESCENARIO, BARRA, CAMION, MULTITUD, GENTE_SUELTA,
  CENTRO, CAMARA, PALMERA_ALTO, type Pt,
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

/** Seto recortado: el volumen y, encima, la copa a bultos, que es lo que lo hace seto y no muro. */
function Seto({ g, x, y, dx, dy }: { g: GeoPerspectiva; x: number; y: number; dx: number; dy: number }) {
  const largo = Math.max(dx, dy), n = Math.max(2, Math.round(largo / 2.4));
  const copas = Array.from({ length: n }, (_, i): Pt => {
    const t = (i + 0.5) / n;
    return dx >= dy ? [x + dx * t, y + dy / 2] : [x + dx / 2, y + dy * t];
  });
  return (
    <g className="seto">
      <Caja g={g} x={x} y={y} dx={dx} dy={dy} z1={SETO.alto} tapa="#c9c9a9" izq="#bcbc9c" der="#b0b092" borde={GRIS} w={0.6} />
      {copas.map(([cx, cy], i) => <Elipse key={i} g={g} x={cx + ((i * 7) % 3 - 1) * 0.35} y={cy + ((i * 5) % 3 - 1) * 0.35} r={1.25 + ((i * 3) % 3) * 0.15} z={SETO.alto} className="rl" fill={i % 2 ? "#cdcdad" : "#c3c3a3"} stroke="#b3b394" strokeWidth="0.25" />)}
    </g>
  );
}

/**
 * PALMERA REAL, como las de las fotos: tronco fino y alto, un poco inclinado,
 * con anillos; copa de frondas en dos capas (las de atrás más oscuras, las de
 * delante con su nervio). A la escala de su punto. Se mece.
 *
 * Quinta pasada (7-sep). Daniel: «pule los detalles, cómo se detallan los
 * objetos». Las de antes eran ocho trazos en asterisco.
 */
function Palma({ g, x, y, alto = 22, i }: { g: GeoPerspectiva; x: number; y: number; alto?: number; i: number }) {
  const [a, b] = g.p(x, y, 0);
  const [, bt] = g.p(x, y, alto);
  const h = b - bt;
  const s = g.escala(x, y, alto) * 6.5;
  const azar = lcg(i * 97 + 11);
  const incl = (azar() - 0.5) * h * 0.14;
  const w0 = 0.4 + s * 0.085, w1 = w0 * 0.72;
  const cx = incl, cy = -h;
  const tronco = `M${(-w0).toFixed(2)},0 C${(incl * 0.25 - w0).toFixed(2)},${(-h * 0.4).toFixed(1)} ${(incl * 0.8 - w1).toFixed(2)},${(-h * 0.75).toFixed(1)} ${(cx - w1).toFixed(2)},${cy.toFixed(1)} L${(cx + w1).toFixed(2)},${cy.toFixed(1)} C${(incl * 0.8 + w1).toFixed(2)},${(-h * 0.75).toFixed(1)} ${(incl * 0.25 + w0).toFixed(2)},${(-h * 0.4).toFixed(1)} ${w0.toFixed(2)},0 Z`;
  const hoja = (t: number, L: number) => {
    const tx = cx + Math.sin(t) * L, ty = cy + L * 0.3 + Math.abs(Math.cos(t)) * L * 0.2;
    const qx = cx + Math.sin(t) * L * 0.55, qy = cy - L * 0.28 - Math.abs(Math.cos(t)) * L * 0.2;
    const dx = tx - cx, dy = ty - cy, len = Math.hypot(dx, dy) || 1;
    const nx = (-dy / len) * L * 0.13, ny = (dx / len) * L * 0.13;
    return {
      hoja: `M${cx.toFixed(1)},${cy.toFixed(1)} Q${(qx + nx).toFixed(1)},${(qy + ny).toFixed(1)} ${tx.toFixed(1)},${ty.toFixed(1)} Q${(qx - nx).toFixed(1)},${(qy - ny).toFixed(1)} ${cx.toFixed(1)},${cy.toFixed(1)} Z`,
      nervio: `M${cx.toFixed(1)},${cy.toFixed(1)} Q${qx.toFixed(1)},${qy.toFixed(1)} ${tx.toFixed(1)},${ty.toFixed(1)}`,
    };
  };
  const atras = [-1.5, -1.1, -0.7, -0.3, 0.1, 0.5, 0.9, 1.3, 1.6].map((t) => hoja(t + (azar() - 0.5) * 0.12, s * (0.9 + azar() * 0.2)));
  const delante = [-1.3, -0.9, -0.5, -0.1, 0.3, 0.7, 1.1, 1.45].map((t) => hoja(t + (azar() - 0.5) * 0.12, s * (0.75 + azar() * 0.2)));
  const anillos = [0.15, 0.3, 0.45, 0.6, 0.75, 0.88];
  return (
    <g transform={`translate(${a.toFixed(1)},${b.toFixed(1)})`}>
      <Elipse g={g} x={x} y={y} r={3.4} className="rl" fill={TINTA} opacity="0.09" transform={`translate(${(-a).toFixed(1)},${(-b).toFixed(1)})`} />
      <g className="palma" style={cssVars({ "--v": `${(5.6 + (i % 5) * 0.7).toFixed(1)}s`, "--vd": `${(-(i % 7) * 0.9).toFixed(1)}s` })}>
        <path className="rl" d={tronco} fill="#8f8674" stroke="#6b6253" strokeWidth="0.4" />
        {anillos.map((t) => {
          const yy = -h * t, xx = incl * (t < 0.4 ? t * 0.6 : t * 0.95), w = w0 + (w1 - w0) * t;
          return <line key={t} className="ap" x1={(xx - w * 0.9).toFixed(2)} y1={yy.toFixed(1)} x2={(xx + w * 0.9).toFixed(2)} y2={(yy - 0.3).toFixed(1)} stroke="#6b6253" strokeWidth="0.35" opacity="0.6" />;
        })}
        {atras.map((f, k) => <path key={`a${k}`} className="rl" d={f.hoja} fill="#4f5a3e" stroke="#40492f" strokeWidth="0.25" />)}
        {delante.map((f, k) => <path key={`d${k}`} className="rl" d={f.hoja} fill="#6a7752" stroke="#4f5a3e" strokeWidth="0.25" />)}
        {delante.map((f, k) => <path key={`n${k}`} className="ap" d={f.nervio} fill="none" stroke="#98a37a" strokeWidth={(0.25 + s * 0.02).toFixed(2)} opacity="0.8" />)}
        <circle cx={cx.toFixed(1)} cy={(cy + s * 0.05).toFixed(1)} r={(s * 0.09).toFixed(2)} fill="#5a5244" />
        {/* el racimo de cocos bajo la copa */}
        {[[-0.11, 0.16], [0.02, 0.2], [0.13, 0.15]].map(([ox, oy], k) => (
          <circle key={`co${k}`} cx={(cx + s * ox).toFixed(1)} cy={(cy + s * oy).toFixed(1)} r={(s * 0.05).toFixed(2)} fill="#8a7a55" stroke="#5a5244" strokeWidth="0.2" />
        ))}
      </g>
    </g>
  );
}

/**
 * UNA PERSONA a escala (5,8 ft): cabeza, tronco, piernas y brazos, con sombra.
 * `brazos="arriba"` para el público; `camina` para las que andan por el paseo
 * (piernas y brazos van en grupos aparte y el CSS los mueve); `z` para las que
 * están sobre una tarima o en el altillo.
 */
function Persona({ g, x, y, z = 0, tono = "#3e3a34", clase = "ap", brazos = "abajo", camina = false, opacidad = 0.8 }: {
  g: GeoPerspectiva; x: number; y: number; z?: number; tono?: string; clase?: string; brazos?: "abajo" | "arriba"; camina?: boolean; opacidad?: number;
}) {
  const [a, b] = g.p(x, y, z);
  const [, bt] = g.p(x, y, z + 5.8);
  const h = b - bt;
  const f = (v: number) => (h * v).toFixed(2);
  const sw = (h * 0.075).toFixed(2);
  const bx = brazos === "arriba" ? 0.2 : 0.15, by = brazos === "arriba" ? -1.02 : -0.5;
  return (
    <g className={`${clase} figura${camina ? " camina" : ""}`} transform={`translate(${a.toFixed(1)},${b.toFixed(1)})`} opacity={opacidad}>
      <ellipse cx="0" cy="0" rx={f(0.17)} ry={f(0.05)} fill={TINTA} opacity="0.16" />
      <g className="pierna pierna-a"><line x1={f(-0.03)} y1={f(-0.42)} x2={f(-0.1)} y2="0" stroke={tono} strokeWidth={sw} strokeLinecap="round" /></g>
      <g className="pierna pierna-b"><line x1={f(0.03)} y1={f(-0.42)} x2={f(0.1)} y2="0" stroke={tono} strokeWidth={sw} strokeLinecap="round" /></g>
      <path d={`M${f(-0.095)},${f(-0.78)} L${f(0.095)},${f(-0.78)} L${f(0.075)},${f(-0.4)} L${f(-0.075)},${f(-0.4)} Z`} fill={tono} />
      <g className="brazo brazo-a"><line x1={f(-0.08)} y1={f(-0.74)} x2={f(-bx)} y2={f(by)} stroke={tono} strokeWidth={sw} strokeLinecap="round" /></g>
      <g className="brazo brazo-b"><line x1={f(0.08)} y1={f(-0.74)} x2={f(bx)} y2={f(by)} stroke={tono} strokeWidth={sw} strokeLinecap="round" /></g>
      <circle cx="0" cy={f(-0.9)} r={f(0.105)} fill={tono} />
    </g>
  );
}

/** Poste de madera: tronco cónico con base y una luz, a la escala de su punto. */
function Poste({ g, x, y, h, r = 0.7, tono = "#5a5244", clase = "" }: { g: GeoPerspectiva; x: number; y: number; h: number; r?: number; tono?: string; clase?: string }) {
  const { p } = g;
  const a1 = p(x - r, y, 0), a2 = p(x + r, y, 0), b1 = p(x - r * 0.8, y, h), b2 = p(x + r * 0.8, y, h);
  const l1 = p(x - r * 0.3, y, 0.2), l2 = p(x - r * 0.3, y, h - 0.2);
  return (
    <g className={clase}>
      <Elipse g={g} x={x} y={y} r={r * 1.7} fill={TINTA} opacity="0.12" />
      <Elipse g={g} x={x} y={y} r={r * 1.45} z={0.3} fill="#bdb5a5" stroke={GRIS} strokeWidth="0.3" />
      <path className="rl tz poste" pathLength={1} d={poly(a1, a2, b2, b1)} fill={tono} stroke="#2f2a24" strokeWidth="0.3" />
      <line x1={l1[0]} y1={l1[1]} x2={l2[0]} y2={l2[1]} stroke={PAPEL} strokeWidth="0.3" opacity="0.25" />
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
  // Vigas a la altura del alero: tres hileras y tres filas que atan los postes.
  const filas = [y + 3, y + 27, y + 51], cols = [x + 3, x + 27, x + 51];
  const vigas: Array<[Pt, Pt]> = [];
  for (const fy of filas) vigas.push([p(cols[0], fy, PALAPA_ALERO - 0.6), p(cols[2], fy, PALAPA_ALERO - 0.6)]);
  for (const cxp of cols) vigas.push([p(cxp, filas[0], PALAPA_ALERO - 0.6), p(cxp, filas[2], PALAPA_ALERO - 0.6)]);
  // Cabios: en cada cara, del alero a la cumbrera. Se ven por debajo cuando el techo es transparente.
  const cabios = caras.flatMap((c, ci) => Array.from({ length: 7 }, (_, k) => (k + 0.5) / 7).map((t) => {
    const u = lerp(c.pts[0], c.pts[1], t), v = lerp(c.pts[3], c.pts[2], t);
    return <line key={`${ci}-${t}`} className="ap cabio" x1={u[0]} y1={u[1]} x2={v[0]} y2={v[1]} stroke="#3f3a32" strokeWidth="0.45" opacity="0.45" />;
  }));
  const cumbrera = poly(p(cx - PALAPA_CUMBRERA / 2 - 0.6, cy, PALAPA_CUMBRE), p(cx + PALAPA_CUMBRERA / 2 + 0.6, cy, PALAPA_CUMBRE), p(cx + PALAPA_CUMBRERA / 2 + 0.6, cy, PALAPA_CUMBRE + 0.9), p(cx - PALAPA_CUMBRERA / 2 - 0.6, cy, PALAPA_CUMBRE + 0.9));
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
        {postes.map(([px, py]) => <Poste key={`${px}-${py}`} g={g} x={px} y={py} h={PALAPA_ALERO} r={0.75} />)}
        {vigas.map(([u, v], i) => <line key={`v${i}`} className="ap" x1={u[0]} y1={u[1]} x2={v[0]} y2={v[1]} stroke="#4a4337" strokeWidth="0.9" opacity="0.85" />)}
        {caras.map((c, i) => (
          <g key={i}>
            <path className="rl tz palapa-cara" pathLength={1} d={poly(...c.pts)} fill={c.tono} stroke={TINTA} strokeWidth="1" strokeLinejoin="round" />
            <path className="rl palapa-textura" d={poly(...c.pts)} fill="url(#lam-paja)" />
            {Array.from({ length: c.n * 2 }, (_, k) => (k + 1) / (c.n * 2 + 1)).map((t, k) => {
              const u = lerp(c.pts[0], c.pts[3], t), v = lerp(c.pts[1], c.pts[2], t);
              return <line key={t} className="ap" x1={u[0]} y1={u[1]} x2={v[0]} y2={v[1]} stroke={PAPEL} strokeWidth={k % 2 ? "0.35" : "0.6"} opacity={k % 2 ? "0.22" : "0.36"} />;
            })}
          </g>
        ))}
        {cabios}
        <path className="tz palapa-cubierta" pathLength={1} d={poly(A, B, C, D)} fill="none" stroke={TINTA} strokeWidth="1.5" strokeLinejoin="round" />
        <path className="rl" d={cumbrera} fill="#3f3a32" stroke={TINTA} strokeWidth="0.6" />
        <line className="tz palapa-cubierta" pathLength={1} x1={R1[0]} y1={R1[1]} x2={R2[0]} y2={R2[1]} stroke={TINTA} strokeWidth="1.4" />
        {/* la paja que cuelga del alero sur y del este, en dos largos */}
        {([[D, C], [C, B]] as Array<[Pt, Pt]>).map(([q, r], i) =>
          Array.from({ length: 36 }, (_, k) => k / 35).map((t, k) => {
            const m = lerp(q, r, t);
            return <line key={`${i}-${t}`} className="ap" x1={m[0]} y1={m[1]} x2={m[0] + (k2(t) ? 0.5 : -0.5)} y2={m[1] + (k % 3 === 0 ? 3.2 : 2.3)} stroke="#5a5244" strokeWidth="0.6" opacity="0.7" />;
          })
        )}
        {/* con lluvia, el agua escurre del alero sur y del este */}
        {([[D, C], [C, B]] as Array<[Pt, Pt]>).map(([q, r], i) =>
          Array.from({ length: 9 }, (_, k) => (k + 0.5) / 9).map((t, k) => {
            const m = lerp(q, r, t);
            return <line key={`g${i}-${k}`} className="gotera" style={cssVars({ "--t": `${(-(k * 0.13 + i * 0.4)).toFixed(2)}s` })} x1={m[0]} y1={m[1] + 3} x2={m[0]} y2={m[1] + 7} stroke="#4a5a6a" strokeWidth="0.7" strokeLinecap="round" />;
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

/**
 * Cabaña-pérgola como en la foto del flyer: tarima de madera, cuatro postes
 * blancos, marco y listones, cortina corrida al fondo, sofá en L con cojines,
 * mesita y una lámpara colgada.
 */
function Cabana({ g, y, i }: { g: GeoPerspectiva; y: number; i: number }) {
  const { p } = g;
  const { x, dx, dy, h } = CABANAS;
  const esquinas: Pt[] = [[x, y], [x + dx, y], [x + dx, y + dy], [x, y + dy]];
  const listones = [];
  for (let t = 0.8; t < dx; t += 1.3) {
    const a = p(x + t, y, h), b = p(x + t, y + dy, h);
    listones.push(<line key={t} className="ap" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#f7f3ea" strokeWidth="0.75" />);
  }
  const cortina = poly(p(x + 0.5, y + 0.3, h - 0.3), p(x + dx - 0.5, y + 0.3, h - 0.3), p(x + dx - 0.2, y + 0.3, 0.2), p(x + 0.2, y + 0.3, 0.2));
  const lampara = p(x + dx / 2, y + dy / 2, h - 2.2), lampara0 = p(x + dx / 2, y + dy / 2, h);
  return (
    <g className="cabana" style={cssVars({ "--i": i })}>
      <path className="rl" d={g.techo(x - 0.6, y - 0.6, dx + 1.2, dy + 1.2, 0.03)} fill="#e6dfd0" />
      <path className="rl" d={g.techo(x + 0.5, y + 0.5, dx - 1, dy - 1, 0.25)} fill="#d8cfbd" stroke="#b9b09d" strokeWidth="0.35" />
      <path className="rl cortina" style={cssVars({ "--i": i })} d={cortina} fill="#f6f2e9" fillOpacity="0.9" stroke="#c9c1b0" strokeWidth="0.35" />
      {[0.25, 0.5, 0.75].map((t) => {
        const q0 = p(x + 0.5 + (dx - 1) * t, y + 0.3, h - 0.3), q1 = p(x + 0.5 + (dx - 1) * t, y + 0.3, 0.2);
        return <line key={t} className="ap" x1={q0[0]} y1={q0[1]} x2={q1[0]} y2={q1[1]} stroke="#d8d0c0" strokeWidth="0.35" />;
      })}
      <Caja g={g} x={x + 1.5} y={y + 2} dx={2.4} dy={dy - 6} z1={1.7} tapa="#ddd6c6" izq="#d3ccbb" der="#c9c1af" borde={GRIS} w={0.45} />
      <Elipse g={g} x={x + 6.5} y={y + 5} r={1.3} z={1.4} fill="#e9e3d6" stroke={GRIS} strokeWidth="0.4" />
      <Caja g={g} x={x + 1.5} y={y + dy - 4} dx={dx - 3} dy={2.4} z1={1.7} tapa="#ddd6c6" izq="#d3ccbb" der="#c9c1af" borde={GRIS} w={0.45} />
      {[2.6, 5.2, 7.8].map((t) => <Elipse key={t} g={g} x={x + 1.5 + t} y={y + dy - 2.8} r={0.9} z={2} fill="#f4efe6" stroke={GRIS} strokeWidth="0.3" />)}
      {esquinas.map(([ex, ey], k) => {
        const a = p(ex, ey, 0), b = p(ex, ey, h);
        return <line key={k} className="tz" pathLength={1} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#7a7062" strokeWidth={Math.max(0.7, g.escala(ex, ey) * 0.8).toFixed(2)} strokeLinecap="round" />;
      })}
      <path className="tz" pathLength={1} d={g.techo(x, y, dx, dy, h)} fill="#f7f3ea" fillOpacity="0.55" stroke="#7a7062" strokeWidth="0.9" />
      {listones}
      <line x1={lampara0[0]} y1={lampara0[1]} x2={lampara[0]} y2={lampara[1]} stroke="#7a7062" strokeWidth="0.35" />
      <circle cx={lampara[0].toFixed(1)} cy={lampara[1].toFixed(1)} r={(g.escala(x, y) * 0.7).toFixed(2)} fill="#f4efe6" stroke="#7a7062" strokeWidth="0.35" />
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

/** Mesa de picnic fija con sombrilla de ocho gajos, como en el área de arena. */
function Picnic({ g, x, y }: { g: GeoPerspectiva; x: number; y: number }) {
  const { p } = g;
  const [a, b] = p(x, y, 0);
  const cima = p(x, y, 8.6);
  const borde = Array.from({ length: 8 }, (_, k) => { const an = (k / 8) * Math.PI * 2; return p(x + Math.cos(an) * 4.3, y + Math.sin(an) * 4.3, 7.3); });
  return (
    <g className="picnic">
      <Elipse g={g} x={x + 1} y={y + 1.5} r={4} fill={TINTA} opacity="0.07" />
      <Caja g={g} x={x - 3} y={y - 1.2} dx={6} dy={2.4} z1={2.5} tapa="#e9e2d2" izq="#dcd5c4" der="#cfc8b6" borde={GRIS} w={0.55} animado={false} />
      <Caja g={g} x={x - 3} y={y - 3.4} dx={6} dy={1} z1={1.5} tapa="#e9e2d2" izq="#dcd5c4" der="#cfc8b6" borde={GRIS} w={0.45} animado={false} />
      <Caja g={g} x={x - 3} y={y + 2.4} dx={6} dy={1} z1={1.5} tapa="#e9e2d2" izq="#dcd5c4" der="#cfc8b6" borde={GRIS} w={0.45} animado={false} />
      <line x1={a} y1={b} x2={cima[0]} y2={cima[1]} stroke="#6b6151" strokeWidth="0.7" />
      <g className="sombrilla">
        {borde.map((q, k) => {
          const r = borde[(k + 1) % 8];
          return <path key={k} d={poly(cima, q, r)} fill={k % 2 ? "#f4efe6" : "#e6ded0"} stroke="#8a8071" strokeWidth="0.35" strokeLinejoin="round" />;
        })}
        <circle cx={cima[0].toFixed(1)} cy={(cima[1] - 0.6).toFixed(1)} r="0.5" fill="#6b6151" />
      </g>
    </g>
  );
}

/**
 * COCHE que se lee como coche (Daniel, 7-sep: «no sé qué es esto, detalla más»).
 * Los de antes eran dos cajas apiladas de 15 ft de ancho. Ahora: 16 × 6,5 ft,
 * carrocería baja con capó y maletero, cabina en trapecio con parabrisas,
 * luneta y ventanillas más oscuras, techo, cuatro ruedas con llanta, faros o
 * pilotos según qué extremo mira a la cámara, parachoques, línea de puerta y
 * sombra. `eje` dice hacia dónde apunta el morro: «y» al norte (los del
 * estacionamiento sur, de espaldas a la cámara), «x» al oeste (los del este,
 * de lado). Las caras se pintan de atrás hacia delante por su profundidad.
 */
function Coche({ g, x, y, eje, tono, suv = false }: { g: GeoPerspectiva; x: number; y: number; eje: "x" | "y"; tono: string; suv?: boolean }) {
  const { p } = g;
  const L = 16, W = 6.5;
  const M = (u: number, v: number): Pt => (eje === "y" ? [x + v, y + u] : [x + u, y + v]);
  const P = (u: number, v: number, z: number): Pt => { const [wx, wy] = M(u, v); return p(wx, wy, z); };
  const prof = (u: number, v: number) => { const [wx, wy] = M(u, v); return g.profundidad(wx, wy); };
  const z0 = 1.2, z1 = suv ? 3.7 : 3.1, z2 = suv ? 5.8 : 5.0;
  const a0 = (suv ? 0.24 : 0.3) * L, a1 = (suv ? 0.96 : 0.85) * L, b0 = (suv ? 0.34 : 0.42) * L, b1 = (suv ? 0.9 : 0.75) * L;
  const c0 = 0.55, c1 = W - 0.55;
  const vidrio = "#8f8a80", lateral = "#c9c3b6";
  const caras = [
    { d: poly(P(0, 0, z0), P(L, 0, z0), P(L, 0, z1), P(0, 0, z1)), fill: lateral, prof: prof(L / 2, 0) },
    { d: poly(P(0, W, z0), P(L, W, z0), P(L, W, z1), P(0, W, z1)), fill: lateral, prof: prof(L / 2, W) },
    { d: poly(P(0, 0, z0), P(0, W, z0), P(0, W, z1), P(0, 0, z1)), fill: lateral, prof: prof(0, W / 2) },
    { d: poly(P(L, 0, z0), P(L, W, z0), P(L, W, z1), P(L, 0, z1)), fill: lateral, prof: prof(L, W / 2) },
    { d: poly(P(0, 0, z1), P(L, 0, z1), P(L, W, z1), P(0, W, z1)), fill: tono, prof: prof(L / 2, W / 2) },
    { d: poly(P(a0, c0, z1), P(a0, c1, z1), P(b0, c1, z2), P(b0, c0, z2)), fill: vidrio, prof: prof(a0, W / 2) },
    { d: poly(P(a1, c0, z1), P(a1, c1, z1), P(b1, c1, z2), P(b1, c0, z2)), fill: vidrio, prof: prof(a1, W / 2) },
    { d: poly(P(a0, c0, z1), P(a1, c0, z1), P(b1, c0, z2), P(b0, c0, z2)), fill: vidrio, prof: prof((a0 + a1) / 2, c0) },
    { d: poly(P(a0, c1, z1), P(a1, c1, z1), P(b1, c1, z2), P(b0, c1, z2)), fill: vidrio, prof: prof((a0 + a1) / 2, c1) },
    { d: poly(P(b0, c0, z2), P(b1, c0, z2), P(b1, c1, z2), P(b0, c1, z2)), fill: tono, prof: prof((b0 + b1) / 2, W / 2) - 0.01 },
  ].sort((m, n) => n.prof - m.prof);
  const profCentro = prof(L / 2, W / 2);
  const ruedas = [[0.2 * L, 0.55], [0.2 * L, W - 0.55], [0.8 * L, 0.55], [0.8 * L, W - 0.55]].map(([u, v]) => {
    const [wx, wy] = M(u, v);
    return { q: p(wx, wy, 1.15), prof: prof(u, v), r: g.escala(wx, wy) * 1.1 };
  });
  const rueda = (w: { q: Pt; r: number }, k: number) => (
    <g key={k}>
      <circle cx={w.q[0].toFixed(1)} cy={w.q[1].toFixed(1)} r={w.r.toFixed(2)} fill="#2f2a24" />
      <circle cx={w.q[0].toFixed(1)} cy={w.q[1].toFixed(1)} r={(w.r * 0.45).toFixed(2)} fill="none" stroke={PAPEL} strokeWidth={(w.r * 0.25).toFixed(2)} opacity="0.8" />
    </g>
  );
  // El extremo que mira a la cámara: el trasero en los del sur (pilotos), el morro o la cola en los del este según de qué lado queden.
  const extremo = eje === "y" ? L : (M(L / 2, 0)[0] > g.camara.ojo[0] ? 0 : L);
  const luz = extremo === 0 ? LUZ : "#a8463b";
  const luces = [[0.7, 1.7], [W - 1.7, W - 0.7]].map(([v0, v1]) => poly(P(extremo, v0, 2.05), P(extremo, v1, 2.05), P(extremo, v1, 2.6), P(extremo, v0, 2.6)));
  const parachoques = [P(extremo, 0.2, 1.7), P(extremo, W - 0.2, 1.7)];
  const ladoVisible = eje === "x" ? W : (M(L / 2, W / 2)[0] < g.camara.ojo[0] ? W : 0);
  const puerta = [P(0.57 * L, ladoVisible, z0 + 0.3), P(0.57 * L, ladoVisible, z1 - 0.2)];
  const [cx, cy] = M(L / 2, W / 2);
  return (
    <g className="coche">
      <Elipse g={g} x={cx} y={cy} r={L * 0.42} fill={TINTA} opacity="0.09" />
      {ruedas.filter((w) => w.prof >= profCentro).map(rueda)}
      {caras.map((c, k) => <path key={k} d={c.d} fill={c.fill} stroke={GRIS} strokeWidth="0.4" strokeLinejoin="round" />)}
      {luces.map((d, k) => <path key={`l${k}`} d={d} fill={luz} stroke="none" />)}
      <line x1={parachoques[0][0]} y1={parachoques[0][1]} x2={parachoques[1][0]} y2={parachoques[1][1]} stroke={GRIS} strokeWidth="0.5" />
      <line x1={puerta[0][0]} y1={puerta[0][1]} x2={puerta[1][0]} y2={puerta[1][1]} stroke={GRIS} strokeWidth="0.35" opacity="0.8" />
      {ruedas.filter((w) => w.prof < profCentro).map(rueda)}
    </g>
  );
}

/**
 * El camión de 40 ft, de frente a la cámara: cabina al sur con parabrisas,
 * faros y parrilla; caja con costillas; seis ruedas con llanta (la llanta a
 * trazos gira por CSS cuando el camión avanza); sombra.
 */
function Camion({ g }: { g: GeoPerspectiva }) {
  const { p } = g;
  const { x, y, dx, dy, h } = CAMION;
  const cabY = y + dy - 9;
  const ruedas: Pt[] = [[x, y + dy - 3], [x + dx, y + dy - 3], [x, y + 13], [x + dx, y + 13], [x, y + 7], [x + dx, y + 7]];
  const costillas = [];
  for (let t = 3; t < dy - 11; t += 3.2) {
    const a = p(x + dx, y + t, 1.8), b = p(x + dx, y + t, h - 0.3);
    costillas.push(<line key={t} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={OCRE} strokeWidth="0.45" opacity="0.6" />);
  }
  const parabrisas = poly(p(x + 0.8, cabY + 9, 5.5), p(x + dx - 0.8, cabY + 9, 5.5), p(x + dx - 0.8, cabY + 9, 8.6), p(x + 0.8, cabY + 9, 8.6));
  const parrilla = [p(x + 1, cabY + 9, 4.3), p(x + dx - 1, cabY + 9, 4.3)];
  return (
    <g>
      <Elipse g={g} x={x + dx / 2} y={y + dy / 2} r={dx * 0.7} fill={TINTA} opacity="0.1" />
      {ruedas.map(([rx, ry], k) => (
        <g key={k} className="rueda">
          <Elipse g={g} x={rx} y={ry} r={1.4} z={1.4} fill={TINTA} />
          <Elipse g={g} x={rx} y={ry} r={0.6} z={1.4} fill="none" stroke={PAPEL} strokeWidth="0.5" strokeDasharray="1.2 1.2" />
        </g>
      ))}
      <Caja g={g} x={x} y={y} dx={dx} dy={dy - 9} z0={1.8} z1={h} tapa="#fbf8f1" izq="#f3eee4" der="#ece6d9" borde={OCRE} w={1.2} animado={false} />
      {costillas}
      <Caja g={g} x={x} y={cabY} dx={dx} dy={9} z0={1.8} z1={9.5} tapa="#fbf8f1" izq="#f3eee4" der="#ece6d9" borde={OCRE} w={1.2} animado={false} />
      <path d={parabrisas} fill="#cfc8ba" stroke={OCRE} strokeWidth="0.5" />
      <line x1={parrilla[0][0]} y1={parrilla[0][1]} x2={parrilla[1][0]} y2={parrilla[1][1]} stroke={OCRE} strokeWidth="0.6" />
      {[x + 1.4, x + dx - 1.4].map((fx, k) => { const q = p(fx, cabY + 9, 3.2); return <circle key={k} cx={q[0].toFixed(1)} cy={q[1].toFixed(1)} r="1.1" fill={OCRE} />; })}
      {/* la rampa trasera, que baja al paseo cuando el camión ya llegó (CSS) */}
      <path className="rampa" d={poly(p(x + 1, y, 1.8), p(x + dx - 1, y, 1.8), p(x + dx - 1, y - 6, 0.05), p(x + 1, y - 6, 0.05))} fill="#d9d2c4" stroke={OCRE} strokeWidth="0.6" />
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

  /**
   * EL ESCENARIO, simétrico respecto a su eje y proporcionado a la gente
   * (Daniel, 7-sep: «dinámico, proporcional y simétrico con referente a la
   * perspectiva de la gente y que cuadre con las fotos»): tarima de 30 × 16 ft,
   * pantalla al fondo, cabina del DJ con su técnico, monitores al frente, torre
   * de sonido a cada lado (sub + cabina), truss con seis cabezas móviles cuyos
   * haces barren (CSS), pozos de luz sobre el césped y un público con brazos en
   * alto en las primeras filas.
   */
  const E = ESCENARIO;
  const cxE = E.x + E.dx / 2;
  const m1a = p(E.x, E.y + E.dy, E.h), m1b = p(E.x, E.y + E.dy, E.truss);
  const m2a = p(E.x + E.dx, E.y + E.dy, E.h), m2b = p(E.x + E.dx, E.y + E.dy, E.truss);
  const focos = [0.1, 0.26, 0.42, 0.58, 0.74, 0.9].map((t) => lerp(m1b, m2b, t));
  const haz = (f: Pt, s: number) => `M${f[0].toFixed(1)},${f[1].toFixed(1)} L${(f[0] - 22 * s).toFixed(1)},${(f[1] + 54).toFixed(1)} L${(f[0] - 5 * s).toFixed(1)},${(f[1] + 58).toFixed(1)} Z`;
  const pantalla = poly(p(cxE - 11, E.y + 1.4, E.h + 0.8), p(cxE + 11, E.y + 1.4, E.h + 0.8), p(cxE + 11, E.y + 1.4, E.h + 9.2), p(cxE - 11, E.y + 1.4, E.h + 9.2));
  const pozos: Array<[number, number, number]> = [[cxE - 11, E.y + E.dy + 12, 7], [cxE, E.y + E.dy + 15, 8], [cxE + 11, E.y + E.dy + 12, 7]];
  const frente: Array<[number, number, "arriba" | "abajo"]> = [
    [cxE - 11, E.y + E.dy + 6, "arriba"], [cxE - 6, E.y + E.dy + 8, "abajo"], [cxE - 1, E.y + E.dy + 5.5, "arriba"], [cxE + 4, E.y + E.dy + 8, "arriba"], [cxE + 9, E.y + E.dy + 6, "abajo"],
    [cxE - 14, E.y + E.dy + 12, "abajo"], [cxE - 8, E.y + E.dy + 13, "arriba"], [cxE - 2, E.y + E.dy + 12.5, "abajo"], [cxE + 6, E.y + E.dy + 13, "arriba"], [cxE + 13, E.y + E.dy + 12, "arriba"],
  ];
  const cP = p(BARRA.x - 6, BARRA.y + BARRA.dy / 2, 0);
  const taburetes = Array.from({ length: 6 }, (_, i): Pt => [BARRA.x + BARRA.dx + 2, BARRA.y + 3 + i * 5]);
  const botellas = Array.from({ length: 7 }, (_, i) => p(BARRA.x - 4.4, BARRA.y + 3 + i * 3.6, 4.6));
  const pendientes = [0.2, 0.5, 0.8].map((t) => p(BARRA.x + BARRA.dx / 2, BARRA.y + BARRA.dy * t, 8));
  const bolardos: Pt[] = [];
  for (let yy = PASEO.y0 + 10; yy < PASEO.y1; yy += 18) { bolardos.push([PASEO.x - 1.4, yy]); bolardos.push([PASEO.x + PASEO.dx + 1.4, yy]); }
  const hilosPalapa: Array<[Pt, Pt]> = [0, 1, 2].map((k) => [p(PALAPA.x + 3, PALAPA.y + 3 + k * 24, 9.6), p(PALAPA.x + 51, PALAPA.y + 3 + k * 24, 9.6)]);
  const bombillasPalapa: Pt[] = hilosPalapa.flatMap(([a, b]) => Array.from({ length: 7 }, (_, k) => lerp(a, b, (k + 0.5) / 7)));
  const perimetro = PALAPA_POSTES.filter(([px, py]) => px === PALAPA.x + 3 || px === PALAPA.x + 51 || py === PALAPA.y + 3 || py === PALAPA.y + 51);

  return (
    <g className="noche" pointerEvents="none">
      <g className="capa capa-barra-luz">
        <ellipse cx={cP[0].toFixed(1)} cy={cP[1].toFixed(1)} rx="70" ry="26" fill={OCRE} opacity="0.12" />
        <ellipse cx={cP[0].toFixed(1)} cy={cP[1].toFixed(1)} rx="38" ry="13" fill={OCRE} opacity="0.12" />
      </g>
      <g className="capa capa-luces">
        {pozos.map(([px, py, r], i) => <Elipse key={i} g={g} x={px} y={py} r={r} fill={OCRE} opacity="0.07" />)}
      </g>
      <g className="capa capa-publico">
        {MULTITUD.filter((_, i) => i % 2 === 0).map(([x, y], i) => (
          <Elipse key={i} g={g} x={x} y={y} r={0.55} z={0.4} className="noche-persona" style={cssVars({ "--i": i })} fill={LUZ} opacity="0.75" />
        ))}
        {frente.map(([fx, fy, br], i) => (
          <g key={`f${i}`} className="noche-figura" style={cssVars({ "--i": i })}>
            <Persona g={g} x={fx} y={fy} tono={LUZ} brazos={br} clase="" opacidad={0.85} />
          </g>
        ))}
      </g>
      <g className="capa capa-barra-luz">
        <Caja g={g} x={BARRA.x - 5} y={BARRA.y} dx={1.6} dy={BARRA.dy} z1={5.5} tapa="#3a3327" izq="#2e2920" der="#26211a" borde={LUZ} w={0.6} animado={false} />
        {botellas.map((q, i) => <rect key={i} x={(q[0] - 0.45).toFixed(1)} y={(q[1] - 1.6).toFixed(1)} width="0.9" height="1.6" fill={LUZ} opacity="0.85" />)}
        <Caja g={g} x={BARRA.x} y={BARRA.y} dx={BARRA.dx} dy={BARRA.dy} z1={BARRA.h} tapa="#3a3327" izq="#2e2920" der="#26211a" borde={LUZ} w={0.9} animado={false} />
        <Persona g={g} x={BARRA.x - 2.2} y={BARRA.y + BARRA.dy * 0.45} tono={LUZ} clase="" opacidad={0.85} />
        {taburetes.map(([tx, ty], i) => <Elipse key={i} g={g} x={tx} y={ty} r={0.9} z={2.4} fill="none" stroke={LUZ} strokeWidth="0.7" />)}
        {pendientes.map((q, i) => (
          <g key={`p${i}`}>
            <circle cx={q[0].toFixed(1)} cy={q[1].toFixed(1)} r="3.2" fill={OCRE} opacity="0.2" />
            <circle cx={q[0].toFixed(1)} cy={q[1].toFixed(1)} r="0.9" fill={LUZ} />
          </g>
        ))}
      </g>
      <g className="capa capa-tarima">
        <Caja g={g} x={E.x} y={E.y} dx={E.dx} dy={E.dy} z1={E.h} tapa="#3a3327" izq="#2e2920" der="#26211a" borde={LUZ} w={1} animado={false} />
        <g>
          <Caja g={g} x={cxE - 12} y={E.y} dx={24} dy={1.4} z0={E.h} z1={E.h + 10} tapa="#2e2920" izq="#26211a" der="#1e1a14" borde={LUZ} w={0.7} animado={false} />
          <path className="noche-pantalla" d={pantalla} fill={OCRE} opacity="0.32" />
        </g>
        <g>
          <Caja g={g} x={cxE - 5} y={E.y + 6} dx={10} dy={3} z0={E.h} z1={E.h + 3.5} tapa="#3a3327" izq="#2e2920" der="#26211a" borde={LUZ} w={0.7} animado={false} />
          <Persona g={g} x={cxE} y={E.y + 5.2} z={E.h} tono={LUZ} clase="" opacidad={0.9} />
        </g>
        <g>
          {[cxE - 9, cxE + 7].map((mx, i) => <Caja key={i} g={g} x={mx} y={E.y + E.dy - 3} dx={3} dy={2} z0={E.h} z1={E.h + 1.4} tapa="#3a3327" izq="#2e2920" der="#26211a" borde={LUZ} w={0.5} animado={false} />)}
        </g>
      </g>
      <g className="capa capa-sonido">
        {[E.x - 6, E.x + E.dx + 2].map((sx, i) => (
          <g key={i}>
            <Caja g={g} x={sx} y={E.y + E.dy - 5} dx={4} dy={4} z1={4.5} tapa="#2e2920" izq="#26211a" der="#1e1a14" borde={LUZ} w={0.7} animado={false} />
            <Caja g={g} x={sx + 0.4} y={E.y + E.dy - 4.6} dx={3.2} dy={3.2} z0={4.5} z1={9.5} tapa="#2e2920" izq="#26211a" der="#1e1a14" borde={LUZ} w={0.7} animado={false} />
          </g>
        ))}
      </g>
      <g className="capa capa-truss">
        <line x1={m1a[0]} y1={m1a[1]} x2={m1b[0]} y2={m1b[1]} stroke={LUZ} strokeWidth="1" />
        <line x1={m2a[0]} y1={m2a[1]} x2={m2b[0]} y2={m2b[1]} stroke={LUZ} strokeWidth="1" />
        <line x1={m1b[0]} y1={m1b[1]} x2={m2b[0]} y2={m2b[1]} stroke={LUZ} strokeWidth="1.2" />
        <line x1={m1b[0]} y1={m1b[1] + 2.2} x2={m2b[0]} y2={m2b[1] + 2.2} stroke={LUZ} strokeWidth="0.6" opacity="0.7" />
        {Array.from({ length: 13 }, (_, i) => lerp(m1b, m2b, i / 12)).map((q, i) => (
          <line key={i} x1={q[0]} y1={q[1]} x2={q[0] + (i % 2 ? 2.2 : -2.2)} y2={q[1] + 2.2} stroke={LUZ} strokeWidth="0.5" opacity="0.7" />
        ))}
      </g>
      <g className="capa capa-luces">
        {focos.map((f, i) => (
          <g key={i} className="noche-foco" style={cssVars({ "--i": i })}>
            <path className="noche-haz" style={cssVars({ transformOrigin: `${f[0].toFixed(1)}px ${f[1].toFixed(1)}px`, "--dir": i < 3 ? 1 : -1 })} d={haz(f, i < 3 ? -0.7 : 0.7)} fill={OCRE} opacity="0.14" />
            <circle cx={f[0].toFixed(1)} cy={f[1].toFixed(1)} r="4.5" fill={OCRE} opacity="0.22" />
            <circle cx={f[0].toFixed(1)} cy={f[1].toFixed(1)} r="1.4" fill={OCRE} />
          </g>
        ))}
      </g>
      <g className="capa capa-guirnaldas">
        {perimetro.map(([px, py], i) => <Elipse key={`u${i}`} g={g} x={px} y={py} r={2.4} fill={OCRE} opacity="0.14" />)}
        {bolardos.map(([bx, by], i) => (
          <g key={`b${i}`}>
            <Elipse g={g} x={bx} y={by} r={2.2} fill={LUZ} opacity="0.12" />
            <Elipse g={g} x={bx} y={by} r={0.35} z={1.2} fill={LUZ} />
          </g>
        ))}
        {hilos}
        {hilosPalapa.map(([a, b], i) => <line key={`hp${i}`} className="noche-hilo" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={LUZ} strokeWidth="0.4" opacity="0.5" />)}
        {[...bombillas.map(({ q }) => q), ...bombillasPalapa].map((q, i) => (
          <g key={i} className="noche-bombilla" style={cssVars({ "--i": i })}>
            <circle cx={q[0].toFixed(1)} cy={q[1].toFixed(1)} r="2.4" fill={OCRE} opacity="0.18" />
            <circle cx={q[0].toFixed(1)} cy={q[1].toFixed(1)} r="0.75" fill={LUZ} />
          </g>
        ))}
      </g>
    </g>
  );
}

function Cota({ g, a, b, texto, lado = 1, clase = "" }: { g: GeoPerspectiva; a: [number, number, number?]; b: [number, number, number?]; texto: string; lado?: 1 | -1; clase?: string }) {
  const A = g.p(a[0], a[1], a[2] ?? 0), B = g.p(b[0], b[1], b[2] ?? 0);
  const an = Math.atan2(B[1] - A[1], B[0] - A[0]), f = 4.4;
  const punta = (q: Pt, s: number) =>
    `M${(q[0] + Math.cos(an + 0.4) * f * s).toFixed(1)},${(q[1] + Math.sin(an + 0.4) * f * s).toFixed(1)} L${q[0].toFixed(1)},${q[1].toFixed(1)} L${(q[0] + Math.cos(an - 0.4) * f * s).toFixed(1)},${(q[1] + Math.sin(an - 0.4) * f * s).toFixed(1)}`;
  const m: Pt = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
  let giro = (an * 180) / Math.PI;
  if (giro > 90) giro -= 180; if (giro < -90) giro += 180;
  return (
    <g className={`ap ${clase}`} opacity="0.85">
      <line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke={GRIS} strokeWidth="0.6" />
      <path d={punta(A, 1)} fill="none" stroke={GRIS} strokeWidth="0.6" />
      <path d={punta(B, -1)} fill="none" stroke={GRIS} strokeWidth="0.6" />
      <text transform={`translate(${m[0].toFixed(1)},${m[1].toFixed(1)}) rotate(${giro.toFixed(1)})`} y={lado > 0 ? 11 : -6}
            fill={GRIS} fontFamily="ui-monospace,monospace" fontSize="8" letterSpacing="1.4" textAnchor="middle">{texto}</text>
    </g>
  );
}

/**
 * EL EDIFICIO, por fuera y por dentro.
 *
 * Por fuera: dos volúmenes (el alto, al oeste, con el altillo; el bajo, al
 * este, con la cocina), fachada sur con el mural en tonos apagados, la puerta
 * doble de vidrio al final del paseo con su marquesina, ventanas SOLO donde
 * cabe cada una (las de antes flotaban sobre el volumen bajo, que mide 14 ft,
 * y se montaban sobre su cornisa: Daniel, «ventanas corridas, encima de otras
 * líneas»), parapeto y equipos en cubierta.
 *
 * Por dentro (capa «edificio»): la fachada sur y la cubierta se vuelven
 * transparentes y se ve el cascarón con lo que se alquila con él: el salón a
 * doble altura donde termina el paseo, el altillo con cuatro salas privadas,
 * la escalera, los baños y la cocina. Nada del montaje del operador (ver
 * lib/edificio.ts). Daniel, 7-sep: «detalla dentro del edificio también;
 * dentro del edificio sí hay cocina y demás».
 */
function Edificio({ g }: { g: GeoPerspectiva }) {
  const { p } = g;
  const X0 = EDIF.x, XC = EDIF.x + EDIF.corte, X1 = EDIF.x + EDIF.dx, Y1 = EDIF.dy;
  const H1 = EDIF.h1, H2 = EDIF.h2;
  const cara = (x0: number, x1: number, h: number) => poly(p(x0, Y1, 0), p(x1, Y1, 0), p(x1, Y1, h), p(x0, Y1, h));
  const ventana = (x: number, w: number, z0: number, z1: number) => poly(p(x, Y1, z0), p(x + w, Y1, z0), p(x + w, Y1, z1), p(x, Y1, z1));
  const altas = [X0 + 6, X0 + 22, X0 + 38, X0 + 54].map((x) => ventana(x, 9, 15, 20));
  const bajas = [XC + 14, XC + 28, XC + 42].map((x) => ventana(x, 7, 6, 11));
  // El mural, en bandas onduladas de tonos apagados (como las olas de la fachada real, sin su rótulo).
  const banda = (z0: number, z1: number, amp: number, fase: number, u0: number, u1: number) => {
    const arriba: Pt[] = [], abajo: Pt[] = [];
    for (let u = u0; u <= u1 + 0.01; u += 3) {
      arriba.push(p(u, Y1, z1 + amp * Math.sin(u / 8 + fase)));
      abajo.push(p(u, Y1, z0 + amp * Math.sin(u / 10 + fase + 1.2)));
    }
    return poly(...arriba, ...abajo.reverse());
  };
  const mural = [
    { d: banda(0.4, 5, 1.1, 0, X0 + 2, XC - 2), fill: "#d9c9b3" },
    { d: banda(4.2, 9, 1.3, 1.6, X0 + 2, XC - 2), fill: "#cfd6c9" },
    { d: banda(8.2, 13, 1.0, 3.1, X0 + 2, XC - 2), fill: "#e3d4c2" },
    { d: banda(1, 6, 1.2, 2.4, XC + 2, X1 - 2), fill: "#d8c6c0" },
  ];
  const carpinteria = (x: number, w: number, z0: number, z1: number) => [
    [p(x + w / 2, Y1, z0), p(x + w / 2, Y1, z1)],
    [p(x, Y1, (z0 + z1) / 2), p(x + w, Y1, (z0 + z1) / 2)],
  ] as Array<[Pt, Pt]>;
  const carpinterias = [...[X0 + 6, X0 + 22, X0 + 38, X0 + 54].flatMap((x) => carpinteria(x, 9, 15, 20)), ...[XC + 14, XC + 28, XC + 42].flatMap((x) => carpinteria(x, 7, 6, 11))];
  const apliques = [p(PUERTA.x - 3, Y1, 7.5), p(PUERTA.x + PUERTA.dx + 3, Y1, 7.5)];
  const puerta = (x0: number, x1: number) => poly(p(x0, Y1, 0), p(x1, Y1, 0), p(x1, Y1, PUERTA.h), p(x0, Y1, PUERTA.h));
  const mitad = PUERTA.x + PUERTA.dx / 2;
  const marquesina = poly(p(PUERTA.x - 1.5, Y1, PUERTA.h + 0.6), p(PUERTA.x + PUERTA.dx + 1.5, Y1, PUERTA.h + 0.6), p(PUERTA.x + PUERTA.dx + 1.5, Y1 + 3, PUERTA.h + 0.2), p(PUERTA.x - 1.5, Y1 + 3, PUERTA.h + 0.2));
  const tirador = (x: number) => [p(x, Y1, 4.6), p(x, Y1, 5.7)] as [Pt, Pt];
  return (
    <g>
      <path className="rl tz edif-borde" pathLength={1} d={poly(p(XC, 0, 0), p(XC, Y1, 0), p(XC, Y1, H2), p(XC, 0, H2))} fill="#e4ded1" stroke={GRIS} strokeWidth="0.8" />
      <Interior g={g} />
      <path className="rl tz edif-sur edif-borde" pathLength={1} d={cara(X0, XC, H2)} fill="#ece7db" stroke={GRIS} strokeWidth="0.8" />
      <path className="rl tz edif-sur edif-borde" pathLength={1} d={cara(XC, X1, H1)} fill="#ece7db" stroke={GRIS} strokeWidth="0.8" />
      {mural.map((m, i) => <path key={i} className="rl edif-sur" d={m.d} fill={m.fill} opacity="0.7" />)}
      {altas.map((d, i) => <path key={`a${i}`} className="ap edif-sur" d={d} fill="#d5cfc3" stroke={GRIS} strokeWidth="0.5" />)}
      {bajas.map((d, i) => <path key={`b${i}`} className="ap edif-sur" d={d} fill="#d5cfc3" stroke={GRIS} strokeWidth="0.5" />)}
      {carpinterias.map(([q0, q1], i) => <line key={`c${i}`} className="ap edif-sur" x1={q0[0]} y1={q0[1]} x2={q1[0]} y2={q1[1]} stroke={PAPEL} strokeWidth="0.45" opacity="0.9" />)}
      {apliques.map((q, i) => <circle key={`ap${i}`} className="ap edif-sur" cx={q[0].toFixed(1)} cy={q[1].toFixed(1)} r="0.9" fill={LUZ} stroke={GRIS} strokeWidth="0.35" />)}
      <path className="rl tz edif-techo edif-borde" pathLength={1} d={g.techo(X0, 0, EDIF.corte, Y1, H2)} fill="#f5f1e8" stroke={GRIS} strokeWidth="0.8" />
      <path className="rl tz edif-techo edif-borde" pathLength={1} d={g.techo(XC, 0, X1 - XC, Y1, H1)} fill="#f5f1e8" stroke={GRIS} strokeWidth="0.8" />
      <path className="ap edif-techo" d={g.techo(X0 + 1.5, 1.5, EDIF.corte - 3, Y1 - 3, H2)} fill="none" stroke="#cfc7b8" strokeWidth="0.45" />
      <path className="ap edif-techo" d={g.techo(XC + 1.5, 1.5, X1 - XC - 3, Y1 - 3, H1)} fill="none" stroke="#cfc7b8" strokeWidth="0.45" />
      <Caja g={g} x={X0 + 26} y={28} dx={7} dy={5} z0={H2} z1={H2 + 3} tapa="#e6e0d4" izq="#d9d2c4" der="#cfc8ba" borde={GRIS} w={0.45} animado={false} />
      <Caja g={g} x={XC + 20} y={40} dx={6} dy={5} z0={H1} z1={H1 + 2.6} tapa="#e6e0d4" izq="#d9d2c4" der="#cfc8ba" borde={GRIS} w={0.45} animado={false} />
      <Caja g={g} x={XC + 34} y={62} dx={6} dy={5} z0={H1} z1={H1 + 2.6} tapa="#e6e0d4" izq="#d9d2c4" der="#cfc8ba" borde={GRIS} w={0.45} animado={false} />
      <path className="ap puerta" d={puerta(PUERTA.x, mitad)} fill="#b9b3a7" stroke={TINTA} strokeWidth="0.7" />
      <path className="ap puerta" d={puerta(mitad, PUERTA.x + PUERTA.dx)} fill="#b9b3a7" stroke={TINTA} strokeWidth="0.7" />
      {[mitad - 1.2, mitad + 1.2].map((tx, i) => { const [q0, q1] = tirador(tx); return <line key={i} className="ap" x1={q0[0]} y1={q0[1]} x2={q1[0]} y2={q1[1]} stroke={PAPEL} strokeWidth="0.6" />; })}
      <path className="ap" d={marquesina} fill="#d9d2c4" stroke={TINTA} strokeWidth="0.6" />
    </g>
  );
}

function Interior({ g }: { g: GeoPerspectiva }) {
  const { p } = g;
  const X0 = EDIF.x, X1 = EDIF.x + EDIF.corte, Y1 = EDIF.dy;
  const XK0 = EDIF.x + EDIF.corte, XK1 = EDIF.x + EDIF.dx;
  const ALT = 12, YM = 58;
  const columnas: Pt[] = [[X0 + 23, YM], [X0 + 47, YM], [X0 + 23, 84], [X0 + 47, 84]];
  const salas = [X0 + 3, X0 + 20, X0 + 37, X0 + 54].map((sx) => ({ x: sx, y: 3, dx: 14, dy: 20 }));
  const escalones = Array.from({ length: 8 }, (_, i) => ({ y: 78 - i * 2.5, z0: i * 1.5, z1: (i + 1) * 1.5 }));
  const baranda = Array.from({ length: 13 }, (_, i) => X0 + 4 + i * 5).filter((bx) => bx < X1 - 8);
  const rail0 = p(X0 + 0.5, YM, ALT + 3.4), rail1 = p(X1 - 8, YM, ALT + 3.4);
  return (
    <g className="edif-interior" pointerEvents="none">
      <path d={g.techo(X0 + 0.5, 0.5, EDIF.corte - 1, Y1 - 1, 0.1)} fill="#efeae0" />
      <path d={g.techo(XK0 + 0.5, 0.5, XK1 - XK0 - 1, Y1 - 1, 0.1)} fill="#efeae0" />
      <g className="int-pieza" style={cssVars({ "--i": 0 })}>
        <Caja g={g} x={X0 + 2} y={62} dx={10} dy={16} z1={9} tapa="#ece7db" izq="#e4ded1" der="#dcd5c7" borde={GRIS} w={0.5} animado={false} />
        {[66, 72].map((by) => { const q0 = p(X0 + 12, by, 0), q1 = p(X0 + 12, by, 7); return <line key={by} x1={q0[0]} y1={q0[1]} x2={q1[0]} y2={q1[1]} stroke={GRIS} strokeWidth="0.5" />; })}
      </g>
      {columnas.map(([cx, cy], i) => (
        <g key={i} className="int-pieza" style={cssVars({ "--i": 1 + i })}>
          <Poste g={g} x={cx} y={cy} h={cy < 70 ? ALT : EDIF.h2 - 1.5} r={0.9} tono="#cfc8ba" />
        </g>
      ))}
      <g className="int-pieza" style={cssVars({ "--i": 5 })}>
        {escalones.map((e, i) => <Caja key={i} g={g} x={X1 - 8} y={e.y} dx={5} dy={2.5} z0={e.z0} z1={e.z1} tapa="#e6dfd0" izq="#d9d2c4" der="#cfc8ba" borde={GRIS} w={0.35} animado={false} />)}
      </g>
      <g className="int-pieza int-altillo" style={cssVars({ "--i": 6 })}>
        <path d={poly(p(X0 + 0.5, YM, ALT - 1.2), p(X1 - 0.5, YM, ALT - 1.2), p(X1 - 0.5, YM, ALT), p(X0 + 0.5, YM, ALT))} fill="#cfc8ba" stroke={GRIS} strokeWidth="0.5" />
        <path d={g.techo(X0 + 0.5, 0.5, EDIF.corte - 1, YM - 0.5, ALT)} fill="#ebe5d8" stroke={GRIS} strokeWidth="0.5" />
        {baranda.map((bx) => { const q0 = p(bx, YM, ALT), q1 = p(bx, YM, ALT + 3.4); return <line key={bx} x1={q0[0]} y1={q0[1]} x2={q1[0]} y2={q1[1]} stroke="#7d725f" strokeWidth="0.4" />; })}
        <line x1={rail0[0]} y1={rail0[1]} x2={rail1[0]} y2={rail1[1]} stroke={TINTA} strokeWidth="0.7" />
      </g>
      <g className="int-salas">
        {salas.map((s, i) => (
          <g key={i} className="int-pieza" style={cssVars({ "--i": 7 + i })}>
            <Caja g={g} x={s.x} y={s.y} dx={s.dx} dy={s.dy} z0={ALT} z1={ALT + 8} tapa="#f3eee4" izq="#ece7db" der="#e4ded1" borde={GRIS} w={0.5} animado={false} />
            <path d={poly(p(s.x + 5, s.y + s.dy, ALT), p(s.x + 8.5, s.y + s.dy, ALT), p(s.x + 8.5, s.y + s.dy, ALT + 6.8), p(s.x + 5, s.y + s.dy, ALT + 6.8))} fill="#d9d2c4" stroke={GRIS} strokeWidth="0.4" />
          </g>
        ))}
      </g>
      <g className="int-cocina">
        <g className="int-pieza" style={cssVars({ "--i": 11 })}>
          <Caja g={g} x={XK0 + 4} y={2} dx={XK1 - XK0 - 8} dy={3} z1={3} tapa="#e4ded1" izq="#dcd5c7" der="#d3ccbd" borde={GRIS} w={0.5} animado={false} />
          <Caja g={g} x={XK0 + 16} y={1.5} dx={20} dy={3.5} z0={8} z1={11} tapa="#cfc8ba" izq="#c5bdae" der="#bab2a3" borde={GRIS} w={0.5} animado={false} />
          <Caja g={g} x={XK0 + 4} y={2} dx={4} dy={3} z0={3} z1={7.5} tapa="#dcd5c7" izq="#d3ccbd" der="#cac2b2" borde={GRIS} w={0.5} animado={false} />
        </g>
        <g className="int-pieza" style={cssVars({ "--i": 12 })}>
          <Caja g={g} x={XK0 + 16} y={26} dx={18} dy={4} z1={3} tapa="#e4ded1" izq="#dcd5c7" der="#d3ccbd" borde={GRIS} w={0.5} animado={false} />
        </g>
      </g>
      <g className="int-pieza" style={cssVars({ "--i": 13 })}>
        <Persona g={g} x={X0 + 36} y={90} clase="" opacidad={0.65} />
        <Persona g={g} x={X0 + 14} y={30} z={ALT} clase="" opacidad={0.65} />
        <Persona g={g} x={XK0 + 26} y={14} clase="" opacidad={0.65} />
      </g>
    </g>
  );
}

// ── textos ─────────────────────────────────────────────────────────────────

const T = {
  es: {
    ojo: "Plano del recinto · vista desde el sur",
    titulo: "~18 000 ft² al aire libre con palapa techada de ~4 000 ft².",
    intro: "El recinto exterior visto desde el sur, como en la foto aérea, a partir del plano del sitio y las fotografías. Selecciona una zona para ver su ficha, o activa una capa de montaje: plan de lluvia, aforo sentado, load-in o montaje nocturno.",
    aria: "Perspectiva del recinto desde el sur: el edificio de dos niveles al fondo con su puerta, el paseo pavimentado bajando hacia la cámara, la palapa de paja a la izquierda pegada al edificio y el jardín abierto al sur de ella, el área de arena con mesas de picnic a la derecha de la puerta, ocho cabañas-pérgola a la derecha del paseo, palmeras, setos y estacionamiento al este y al sur.",
    modos: { todo: "Vista general", lluvia: "Plan de lluvia", mesas: "Aforo sentado · 300", camion: "Load-in · camión 40 ft", noche: "Montaje nocturno" } as Partial<Record<Modo, string>>,
    explica: {
      todo: "Lo techado va en tinta y lo abierto en claro. El paseo baja de la puerta del edificio hacia el estacionamiento sur y es por donde entra todo. Fuera de los setos, la calle.",
      lluvia: "La palapa cubre ~4 000 ft² con techo de paja, abierta por los cuatro costados: para el sol y el agua que cae recta. Lo demás queda al aire, y para un evento de invierno conviene carpa lateral.",
      carpa: "Con viento la lluvia entra de lado. Para un evento de invierno se cierran los costados con carpa lateral, que trae tu proveedor: aquí va dibujada a trazos.",
      mesas: "Treinta mesas de diez con sus sillas, a escala: dieciséis bajo la palapa, ocho en el césped y seis en fila sobre el paseo. Son los ~300 sentados verificados, con pasillo de servicio entre mesas.",
      gente: "Seiscientas personas de pie, a ocho pies cuadrados cada una, bajo la palapa y en el césped oeste. Es el aforo verificado, dibujado.",
      camion: "Desde la calle, por el estacionamiento sur, al paseo pavimentado, continuo y a nivel: un camión de 40 ft llega hasta la puerta del edificio sin pisar césped.",
      noche: "Un montaje posible, de noche: escenario con pantalla y truss al fondo del césped, torre de sonido a cada lado, tu barra bajo la palapa, público de pie y guirnaldas entre las palmeras. Todo lo encendido lo trae tu equipo; la luz colgada se aprueba en la visita.",
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
        nombre: "El edificio", dato: "zona 02 · 2 niveles · cocina y baños",
        lee: "Cierra el norte del recinto: el paseo termina en su puerta. Abajo, un salón a doble altura con cocina y baños; arriba, un altillo con cuatro salas privadas. Se alquila aparte y tiene su propia lámina.",
        sirve: "Es la zona 02 y va por separado. Con el jardín, resuelve lo que el exterior no tiene: cocina para el catering, camerinos, baños y plan B bajo techo.",
        ojo: "Se entrega el cascarón con su cocina y sus baños. Lo que hay montado hoy dentro pertenece al operador del inmueble y no forma parte de lo que se alquila.",
      },
    } as Record<Zona, { nombre: string; dato: string; lee: string; sirve: string; ojo: string }>,
    cajetin: ["Club Wynwood", "El recinto · zona 01", "Vista desde el sur · sin escala"],
    escala: "50 ft",
    calleO: "NW 1ST CT",
    calleS: "NW 21ST CT",
    parking: "P",
    nota: "Dibujo según el plano del sitio publicado por el propietario, sin escala fina; las medidas se confirman en la visita técnica. El montaje de noche es un ejemplo: lo encendido lo trae el cliente.",
  },
  en: {
    ojo: "Site plan · view from the south",
    titulo: "~18,000 sq ft outdoors with a ~4,000 sq ft thatched structure.",
    intro: "The outdoor site seen from the south, as in the aerial photograph, from the site plan and the photographs. Select a zone to see its data, or turn on a layout layer: rain plan, seated capacity, load-in or night setup.",
    aria: "Perspective of the site from the south: the two-level building at the far end with its door, the paved walk coming down towards the camera, the thatched structure on the left right next to the building with the open garden south of it, the sand area with picnic tables to the right of the door, eight pergola cabanas on the right of the walk, palms, hedges and parking to the east and south.",
    modos: { todo: "Overview", lluvia: "Rain plan", mesas: "Seated capacity · 300", camion: "Load-in · 40 ft truck", noche: "Night setup" } as Partial<Record<Modo, string>>,
    explica: {
      todo: "Roofed volumes are drawn in ink, open ground in light tone. The walk runs from the building door down to the south parking, and it is how everything gets in. Beyond the hedges, the street.",
      lluvia: "The structure covers ~4,000 sq ft under thatch, open on all four sides: it stops sun and vertical rain. The rest stays open-air, and a winter event should budget for side tenting.",
      carpa: "With wind, rain comes in sideways. A winter event closes the sides with side tenting, which your supplier brings: here it is drawn dashed.",
      mesas: "Thirty tables of ten with their chairs, to scale: sixteen under the structure, eight on the turf and six in a row on the walk. These are the verified ~300 seated, with service aisles between tables.",
      gente: "Six hundred people standing, at eight square feet each, under the structure and on the west turf. That is the verified capacity, drawn.",
      camion: "From the street, through the south parking, onto the paved walk, continuous and level: a 40 ft truck reaches the building door without crossing turf.",
      noche: "One possible setup, at night: a stage with screen and truss at the far end of the turf, a sound tower on each side, your bar under the structure, a standing crowd and string lights between the palms. Everything lit is brought by your team; hung lighting is approved at the visit.",
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
        nombre: "The building", dato: "zone 02 · 2 levels · kitchen and restrooms",
        lee: "It closes the north of the site: the walk ends at its door. Downstairs, a double-height hall with a kitchen and restrooms; upstairs, a mezzanine with four private rooms. Rented separately, with its own plate.",
        sirve: "It is zone 02 and goes separately. With the garden, it covers what the outdoors lacks: a catering kitchen, green rooms, restrooms and a plan B under a roof.",
        ojo: "The shell is handed over with its kitchen and restrooms. Whatever is installed inside today belongs to the building's operator and is not part of the rental.",
      },
    } as Record<Zona, { nombre: string; dato: string; lee: string; sirve: string; ojo: string }>,
    cajetin: ["Club Wynwood", "The site · zone 01", "View from the south · not to scale"],
    escala: "50 ft",
    calleO: "NW 1ST CT",
    calleS: "NW 21ST CT",
    parking: "P",
    nota: "Drawn from the owner's published site plan, not to fine scale; dimensions are confirmed at the technical visit. The night setup is an example: everything lit is brought by the client.",
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

  // El paseo, losa a losa: cada 8 ft una losa con su junta, en dos tonos alternos, como en la foto.
  const juntas = [];
  const losas = [];
  for (let y = PASEO.y0, k = 0; y < PASEO.y1 + 6; y += 8, k++) {
    const h = Math.min(8, PASEO.y1 + 6 - y);
    losas.push(<path key={`l${y}`} className="rl" d={techo(PASEO.x, y, PASEO.dx, h, 0.045)} fill={k % 2 ? "#f5f1e7" : "#fbf8f1"} />);
    if (y > PASEO.y0) {
      const a = p(PASEO.x, y, 0.05), b = p(PASEO.x + PASEO.dx, y, 0.05);
      juntas.push(<line key={y} className="ap" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#cfc7b6" strokeWidth="0.55" />);
    }
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
    if (i < PARKING_E.plazas && i % 3 !== 1) coches.push({ prof: g.profundidad(PARKING_E.x + 14, y + pE / 2), el: <Coche key={`ce${i}`} g={g} x={PARKING_E.x + 7} y={y + (pE - 6.5) / 2} eje="x" tono={tonos[i % tonos.length]} suv={i % 2 === 0} /> });
  }
  const pS = PARKING_S.dx / PARKING_S.plazas;
  for (let i = 0; i <= PARKING_S.plazas; i++) {
    const x = PARKING_S.x + i * pS;
    const a = p(x, PARKING_S.y + 1, 0.02), b = p(x, PARKING_S.y + PARKING_S.dy - 1, 0.02);
    plazas.push(<line key={`s${i}`} className="ap" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#cfc7b6" strokeWidth="0.5" />);
    if (i < PARKING_S.plazas && (i * 5) % 4 !== 2 && (x < PASEO.x - 12 || x > PASEO.x + PASEO.dx + 6)) coches.push({ prof: g.profundidad(x + pS / 2, PARKING_S.y + 11), el: <Coche key={`cs${i}`} g={g} x={x + (pS - 6.5) / 2} y={PARKING_S.y + 3} eje="y" tono={tonos[(i + 2) % tonos.length]} suv={i % 3 === 0} /> });
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
    ...PALMERAS_O.map(([x, y], i) => ({ prof: g.profundidad(x, y), el: <Palma key={`po${i}`} g={g} x={x} y={y} i={i} alto={PALMERA_ALTO} /> })),
    ...PALMERAS_E.map(([x, y], i) => ({ prof: g.profundidad(x, y), el: <Palma key={`pe${i}`} g={g} x={x} y={y} i={i + 7} alto={PALMERA_ALTO} /> })),
    ...PALMERAS_PALAPA.map(([x, y], i) => ({ prof: g.profundidad(x, y), el: <Palma key={`pp${i}`} g={g} x={x} y={y} i={i + 14} alto={PALMERA_ALTO + 3} /> })),
    ...Array.from({ length: CABANAS.n }, (_, i) => {
      const y = CABANAS.y0 + i * CABANAS.paso;
      return { prof: g.profundidad(CABANAS.x + CABANAS.dx / 2, y + CABANAS.dy / 2), el: <g key={`cab${i}`} className={zClase("cabanas")} {...zProps("cabanas")}><Cabana g={g} y={y} i={i} /></g> };
    }),
    { prof: g.profundidad(cP[0], cP[1]), el: <g key="palapa" className={zClase("tiki")} {...zProps("tiki")}><Palapa g={g} mesasN={mesasN} /></g> },
    ...PICNIC.map(([x, y], i) => ({ prof: g.profundidad(x, y), el: <g key={`pic${i}`} className="capa capa-picnic"><g className="picnic-entra" style={cssVars({ "--i": i })}><Picnic g={g} x={x} y={y} /></g></g> })),
    // una jardinera con planta junto a cada pérgola, como en las fotos
    ...Array.from({ length: CABANAS.n }, (_, i) => {
      const jx = CABANAS.x + CABANAS.dx + 1.6, jy = CABANAS.y0 + i * CABANAS.paso + 1.5;
      return { prof: g.profundidad(jx, jy), el: (
        <g key={`jar${i}`}>
          <Caja g={g} x={jx - 0.8} y={jy - 0.8} dx={1.6} dy={1.6} z1={1.4} tapa="#cfc8ba" izq="#c5bdae" der="#bab2a3" borde={GRIS} w={0.35} animado={false} />
          {[[0, 0], [-0.6, 0.3], [0.6, 0.2], [0.1, -0.6]].map(([ox, oy], k) => <Elipse key={k} g={g} x={jx + ox} y={jy + oy} r={0.75} z={2.1 + k * 0.15} fill={k % 2 ? "#6a7752" : "#4f5a3e"} />)}
        </g>
      ) };
    }),
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
        {/* la paja: trazos cortos e inclinados, como hojas de palma superpuestas */}
        <pattern id="lam-paja" width="2.6" height="2.6" patternUnits="userSpaceOnUse" patternTransform="rotate(24)">
          <line x1="0.6" y1="0" x2="0.6" y2="1.5" stroke="#2f2a24" strokeWidth="0.32" opacity="0.4" />
          <line x1="1.9" y1="1.1" x2="1.9" y2="2.6" stroke="#f3e2c4" strokeWidth="0.22" opacity="0.28" />
        </pattern>
      </defs>

      {/* ── calles, lote, estacionamiento, arena, césped, paseo ───── */}
      <g style={cssVars({ "--d": "0s" })}>
        <path className="rl" d={techo(CALLE_O.x, -6, CALLE_O.dx, LOTE.dy + CALLE_S.dy + 6, 0)} fill="#ddd6c8" />
        <path className="rl" d={techo(CALLE_O.x, CALLE_S.y, LOTE.dx + 10 - CALLE_O.x, CALLE_S.dy, 0)} fill="#ddd6c8" />
        {/* la acera, entre la calle y el lote, con sus juntas */}
        <path className="rl" d={techo(-6, -6, 6, LOTE.dy + 12, 0.01)} fill="#e8e2d5" stroke="#cfc7b8" strokeWidth="0.4" />
        <path className="rl" d={techo(-6, LOTE.dy, LOTE.dx + 16, 6, 0.01)} fill="#e8e2d5" stroke="#cfc7b8" strokeWidth="0.4" />
        {Array.from({ length: 22 }, (_, i) => -6 + i * 12.5).map((y) => { const a = p(-6, y, 0.02), b = p(0, y, 0.02); return <line key={`ao${y}`} className="ap" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#cfc7b8" strokeWidth="0.35" />; })}
        {Array.from({ length: 13 }, (_, i) => i * 12.5).map((x) => { const a = p(x, LOTE.dy, 0.02), b = p(x, LOTE.dy + 6, 0.02); return <line key={`as${x}`} className="ap" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#cfc7b8" strokeWidth="0.35" />; })}
        <path className="rl tz lote" pathLength={1} d={techo(0, 0, LOTE.dx, LOTE.dy, 0)} fill="#f4efe3" stroke={GRIS} strokeWidth="0.8" />
        <path className="rl parking" d={techo(PARKING_E.x, PARKING_E.y, PARKING_E.dx, PARKING_E.dy, 0.01)} fill="#e8e2d6" />
        <path className="rl parking" d={techo(PARKING_S.x, PARKING_S.y, PARKING_S.dx, PARKING_S.dy, 0.01)} fill="#e8e2d6" />
        {plazas}
        <g className={zClase("jardin")} {...zProps("jardin")}>
          <path className="rl" d={techo(ARENA.x, ARENA.y, ARENA.dx, ARENA.dy, 0.02)} fill="#efe6d2" />
          <path className="rl" d={techo(ARENA.x, ARENA.y, ARENA.dx, ARENA.dy, 0.02)} fill="url(#lam-arena)" opacity="0.7" />
          <path className="rl cesped" d={techo(CESPED_O.x, CESPED_O.y, CESPED_O.dx, CESPED_O.dy, 0.02)} fill="#dfe0c6" />
          <path className="rl cesped" d={techo(CESPED_O.x, CESPED_O.y, CESPED_O.dx, CESPED_O.dy, 0.02)} fill="url(#lam-cesped)" opacity="0.6" />
          <path className="rl cesped" d={techo(CESPED_E.x, CESPED_E.y, CESPED_E.dx, CESPED_E.dy, 0.02)} fill="#e3e0cc" />
          <path className="rl cesped" d={techo(CESPED_E.x, CESPED_E.y, CESPED_E.dx, CESPED_E.dy, 0.02)} fill="url(#lam-cesped)" opacity="0.45" />
        </g>
        <path className="rl tz paseo-pav" pathLength={1} d={techo(PASEO.x, PASEO.y0, PASEO.dx, PASEO.y1 - PASEO.y0 + 6, 0.04)} fill={PAPEL} stroke={GRIS} strokeWidth="0.7" />
        {losas}
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
        <Edificio g={g} />
      </g>

      {/* ── setos: el de NW 1st Ct (oeste) y los del sur del césped ── */}
      <g style={cssVars({ "--d": ".5s" })}>
        <Seto g={g} x={0} y={ARENA.y - 2} dx={SETO.ancho} dy={PARKING_S.y - ARENA.y + 2} />
        <Seto g={g} x={0} y={PARKING_S.y - SETO.ancho} dx={PASEO.x - 6} dy={SETO.ancho} />
        <Seto g={g} x={PASEO.x + PASEO.dx + 6} y={PARKING_S.y - SETO.ancho} dx={PARKING_E.x - PASEO.x - PASEO.dx - 6} dy={SETO.ancho} />
        <Seto g={g} x={PARKING_E.x - SETO.ancho} y={PARKING_E.y} dx={SETO.ancho} dy={PARKING_E.dy - 10} />
      </g>

      {/* ── la gente que anda por el paseo (reposo con vida): va ANTES de los
             objetos, para que las copas de las palmeras le pasen por encima y
             no al revés (Daniel: «veo superposición») ── */}
      <g className="peatones" pointerEvents="none">
        {[{ x: PASEO.x + 4, pd: 0, dur: 21, tono: "#3e3a34" }, { x: PASEO.x + 11, pd: -8, dur: 24, tono: "#55504a" }, { x: PASEO.x + 7.5, pd: -15, dur: 19, tono: "#2f2a24" }].map((q, i) => {
          const y0 = PASEO.y1 - 4, y1 = PASEO.y0 + 8;
          const a = p(q.x, y0, 0), b = p(q.x, y1, 0);
          const s = g.escala(q.x, y1) / g.escala(q.x, y0);
          return (
            <g key={i} className="peaton" style={cssVars({ "--px": `${(b[0] - a[0]).toFixed(1)}px`, "--py": `${(b[1] - a[1]).toFixed(1)}px`, "--s": s.toFixed(3), "--dur": `${q.dur}s`, "--pd": `${q.pd}s` })}>
              <Persona g={g} x={q.x} y={y0} clase="" camina tono={q.tono} />
            </g>
          );
        })}
      </g>

      {/* ── los objetos con volumen, de lejos a cerca ─────────────── */}
      <g style={cssVars({ "--d": ".8s" })}>
        {objetos.map((o) => o.el)}
      </g>
      <g className="cuadrilla" pointerEvents="none">
        <Persona g={g} x={PASEO.x - 3} y={CAMION.y + 2} clase="" />
        <Persona g={g} x={PASEO.x + PASEO.dx + 3} y={CAMION.y + 5} clase="" />
        <Caja g={g} x={PASEO.x + PASEO.dx - 4.5} y={CAMION.y - 5} dx={2.4} dy={3.2} z1={2.2} tapa="#e6e0d4" izq="#d9d2c4" der="#cfc8ba" borde={OCRE} w={0.6} animado={false} />
        <Caja g={g} x={PASEO.x + 2} y={CAMION.y - 6} dx={2.4} dy={2.4} z1={1.6} tapa="#e6e0d4" izq="#d9d2c4" der="#cfc8ba" borde={OCRE} w={0.6} animado={false} />
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
        <Cota g={g} a={[PALAPA.x, PALAPA.y + PALAPA.dy + 5]} b={[PALAPA.x + PALAPA.dx, PALAPA.y + PALAPA.dy + 5]} texto="≈ 54 FT" clase="cota-palapa" />

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
    rotulo("jardin", p(30, 206, 0), -28, 40, "der", "inf"),
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

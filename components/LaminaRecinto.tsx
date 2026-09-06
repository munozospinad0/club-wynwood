"use client";

import { memo, useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { crearGeo, type Geo } from "@/lib/iso";
import type { Idioma } from "@/lib/i18n";
import { ev } from "@/lib/medicion";

/**
 * LÁMINA — EL RECINTO. Un solo dibujo que se explica solo.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * POR QUÉ SE REHÍZO
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Daniel, 2-sep-2026: «de la parte de los planos en nuestra página no se
 * entiende un carajo». Tenía razón, y el motivo se veía en una captura: la
 * pestaña «Zona 01» era un panel de mandos —ámbito, lectura, capas, reproducir
 * montaje, cuatro subláminas— alrededor de un dibujo con la palapa mal
 * dibujada, y «El conjunto» era un isométrico pequeño con los rótulos a
 * cuarenta centímetros del objeto. Mucho control y poca lectura.
 *
 * Además, con las fotos hay un límite duro: lo que se ve en los vídeos del
 * predio es del operador y no se puede enseñar. Así que el dibujo tiene que
 * cargar con TODA la explicación, sin apoyarse en una foto.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * QUÉ HACE ESTA
 * ─────────────────────────────────────────────────────────────────────────
 *
 *  1. UN dibujo isométrico en línea, grande, con figura y fondo: el papel casi
 *     blanco, lo techado en tinta, lo abierto en claro. Sin sublaminas ni
 *     conmutador de giro: una vista fija desde el noreste, que es la que deja
 *     ver la palapa, el paseo y las cabañas a la vez.
 *
 *  2. SE DIBUJA SOLO al entrar en pantalla: primero los trazos, luego los
 *     rellenos, luego los rótulos. Es lo que Daniel llamó «el dibujo animado».
 *     Va con CSS sobre `pathLength`, así que si el JavaScript no corre, el
 *     dibujo se ve entero (ver <noscript> y `prefers-reduced-motion`).
 *
 *  3. LOS RÓTULOS SON HTML, no texto dentro del SVG: escalan con la página, se
 *     leen en el móvil, se copian y los cita un buscador. En pantalla estrecha
 *     quedan como números y la lista de abajo lleva el texto.
 *
 *  4. SIETE ESCENAS sobre el mismo dibujo. Cuatro contestan las preguntas de
 *     un productor y se activan a mano: «¿y si llueve?» (llueve y el techo se
 *     marca), «¿caben 300 sentados?» (treinta mesas de diez, a escala), «¿entra
 *     un camión?» (uno de 40 ft recorre el paseo) y «¿cómo se ve montado?»
 *     (anochece: escenario, barra, público y luz entre las palmeras). Otras
 *     tres las usa solo el recorrido guiado: seiscientas personas de pie a
 *     escala, la carpa lateral sobre la palapa, y la vista general.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * LA CÁMARA Y EL MODO CINE (6-sep-2026)
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Daniel: «darle más calidad… un video más completo, animado». El dibujo se
 * puede DIRIGIR desde fuera con `zoomDirigido` y `puntoDirigido`: el lienzo
 * entero —SVG y rótulos— se desplaza y se escala con una sola transformación
 * CSS, así que acercarse a la palapa es un plano, no un recálculo. Y con `cine`
 * la lámina pasa a pantalla completa sobre tinta, con el dibujo como proyección
 * y el panel de la narración al lado. Es lo que convierte la narración en algo
 * que se ve como un vídeo sin perder lo que un vídeo no tiene: texto que se
 * lee, se indexa y se corrige sin regrabar.
 *
 * GEOMETRÍA: la misma de la planta (LaminaPlanta.tsx), que ya se corrigió
 * contra la foto aérea: palapa ≈ 63 × 63 ft en una esquina, paseo pavimentado
 * de extremo a extremo, ocho cabañas en hilera sobre el borde opuesto. Sigue
 * siendo un esquema sin escala: no hay site plan del propietario.
 *
 * MEDICIÓN: `view_plate` al entrar en pantalla, `select_zone` al tocar una
 * zona y `toggle_layer` al activar una respuesta — los mismos nombres del
 * contrato de crm-wynwood/docs/04-MEDICION.md.
 */

export type Modo = "todo" | "lluvia" | "carpa" | "mesas" | "gente" | "camion" | "noche";
export type Zona = "jardin" | "tiki" | "cabanas" | "acceso" | "edificio";
/** pendiente → dibujar (corre la secuencia) → listo (los rótulos entran).
 *  quieto: sin JS útil o con movimiento reducido, todo visible desde el principio. */
type Fase = "pendiente" | "dibujar" | "listo" | "quieto";
type Pt = [number, number];

export interface Aforo {
  invitados: number;
  formato: "sentados" | "pie";
}

// ── geometría, en pies ─────────────────────────────────────────────────────
const LOTE = { dx: 240, dy: 92 };
const SETO = { ancho: 3, alto: 4 };
const PALAPA = { x: 10, y: 4, dx: 63, dy: 63 };
const H_ALERO = 11, H_CUMBRE = 26, CUMBRERA = 22;
const PASEO = { y: 68, dy: 12 };
const CABANAS = { x: 88, y: 82, dx: 14, dy: 7, n: 8, hueco: 4, h: 8 };
const EDIF = { x: 258, dx: 104, dy: 84, corte: 62, h1: 12, h2: 22 };
const TOTAL_X = EDIF.x + EDIF.dx;
const CAMION = { x: 168, y: 71.75, dx: 40, dy: 8.5, h: 12, recorrido: 232 };
const ESCENARIO = { x: 214, y: 16, dx: 18, dy: 32, h: 3, truss: 15 };
const BARRA = { x: 18, y: 26, dx: 4, dy: 24, h: 3.5 };
const U = 2.3; // unidades por pie
const ALTO_PALMA = 17;

/** El centro del recinto: a donde vuelve la cámara cuando nadie la dirige. */
export const CENTRO: Pt = [120, 46];

const TINTA = "#211c15", GRIS = "#8a8071", OCRE = "#c4772b", PAPEL = "#fbf8f1";

/** Las palmeras solo donde están de verdad: dos hileras flanqueando el paseo. */
const PALMERAS_N: Pt[] = Array.from({ length: 8 }, (_, i) => [82 + i * 22, 62]);
const PALMERAS_S: Pt[] = [[30, 81], [56, 81], ...Array.from({ length: 7 }, (_, i): Pt => [104 + i * 18, 81])];

/** Treinta mesas de diez: los ~300 sentados verificados, a escala real. */
const MESAS: Pt[] = [];
for (let f = 0; f < 3; f++) for (let c = 0; c < 10; c++) MESAS.push([90 + c * 15, 15 + f * 16]);

const GENTE_SUELTA: Pt[] = [[128, 44], [206, 28], [150, 74], [62, 74], [230, 62]];

/** Pseudoaleatorio determinista: el servidor y el navegador tienen que
 *  dibujar exactamente las mismas gotas, o React se queja de la hidratación. */
function lcg(semilla: number) {
  let s = semilla >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/**
 * SEISCIENTAS PERSONAS, A ESCALA. Ocho pies cuadrados por persona de pie, que
 * es el estándar de cóctel con circulación: 600 × 8 ≈ 4 800 ft², una mancha de
 * 122 × 42 ft dentro de un jardín de 240 × 65. Se ve de un golpe que caben y
 * que ocupan cerca de un tercio, que es exactamente lo que la cifra no cuenta.
 */
const MULTITUD: Pt[] = (() => {
  const azar = lcg(7);
  const out: Pt[] = [];
  const cols = 40, filas = 15;
  for (let f = 0; f < filas; f++) {
    for (let c = 0; c < cols; c++) {
      out.push([92 + c * 3.05 + (azar() - 0.5) * 1.8, 13 + f * 2.85 + (azar() - 0.5) * 1.6]);
    }
  }
  return out;
})();

const poly = (...q: Pt[]) =>
  q.map((c, i) => `${i ? "L" : "M"}${c[0].toFixed(1)},${c[1].toFixed(1)}`).join(" ") + " Z";

const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

const cssVars = (o: Record<string, string | number>) => o as CSSProperties;

// La proyección es fija (vista noreste), así que se calcula UNA vez y se
// comparte: el dibujo, la cámara y los rótulos tienen que usar la misma.
const G: Geo = crearGeo(U, 0, 0, 0);

// Encuadre calculado a partir de la caja real de la proyección, con margen
// a medida: a la izquierda cabe el acceso, abajo la cota y la escala.
const CAJA = G.caja(TOTAL_X, LOTE.dy, H_CUMBRE, 0);
const VB = { x: CAJA.x - 78, y: CAJA.y - 44, w: CAJA.w + 78 + 36, h: CAJA.h + 44 + 54 };
/** Proporción del dibujo, para que el modo cine lo encuadre sin deformarlo. */
export const PROPORCION = VB.w / VB.h;

/** Posición de un punto del SVG como fracción del lienzo (0..1). */
const frac = (q: Pt): Pt => [(q[0] - VB.x) / VB.w, (q[1] - VB.y) / VB.h];
const pct = (q: Pt): { left: string; top: string } => {
  const [fx, fy] = frac(q);
  return { left: `${(fx * 100).toFixed(2)}%`, top: `${(fy * 100).toFixed(2)}%` };
};

// ── piezas del dibujo ──────────────────────────────────────────────────────

/** Prisma con las dos caras visibles y la tapa. Las caras de atrás no se
 *  dibujan: en esta vista fija nunca se ven. */
function Caja({ g, x, y, dx, dy, z0 = 0, z1, tapa, izq, der, borde = TINTA, w = 0.9, clase = "", animado = true }: {
  g: Geo; x: number; y: number; dx: number; dy: number; z0?: number; z1: number;
  tapa: string; izq: string; der: string; borde?: string; w?: number; clase?: string; animado?: boolean;
}) {
  const { techo, frente, lado } = g;
  const cl = animado ? "rl tz" : "";
  const pl = animado ? { pathLength: 1 } : {};
  return (
    <g className={clase}>
      <path className={cl} d={frente(x, y + dy, dx, z0, z1)} fill={izq} stroke={borde} strokeWidth={w} {...pl} />
      <path className={cl} d={lado(x + dx, y, dy, z0, z1)} fill={der} stroke={borde} strokeWidth={w} {...pl} />
      <path className={cl} d={techo(x, y, dx, dy, z1)} fill={tapa} stroke={borde} strokeWidth={w} {...pl} />
    </g>
  );
}

function Seto({ g, x, y, dx, dy }: { g: Geo; x: number; y: number; dx: number; dy: number }) {
  return <Caja g={g} x={x} y={y} dx={dx} dy={dy} z1={SETO.alto} tapa="#d3cdb8" izq="#c4bda7" der="#b9b19b" borde={GRIS} w={0.6} />;
}

/** Dónde está la copa de una palmera, en coordenadas del SVG. Lo usan la
 *  palmera y las guirnaldas de luz, que tienen que colgar del mismo punto. */
function copa(g: Geo, x: number, y: number): Pt {
  const [a, b] = g.p(x, y, 0);
  return [a, b - ALTO_PALMA * U];
}

function Palma({ g, x, y, alto = ALTO_PALMA }: { g: Geo; x: number; y: number; alto?: number }) {
  const [a, b] = g.p(x, y, 0);
  const h = alto * U;
  return (
    <g transform={`translate(${a.toFixed(1)},${b.toFixed(1)})`}>
      <ellipse className="rl" cx="0" cy="1.4" rx="6.5" ry="2.4" fill={TINTA} opacity="0.09" />
      <path className="tz" pathLength={1}
            d={`M0,0 C0.8,${(-h * 0.45).toFixed(1)} -0.8,${(-h * 0.75).toFixed(1)} 0,${(-h).toFixed(1)}`}
            fill="none" stroke="#6f6656" strokeWidth="1.15" strokeLinecap="round" />
      {[-1.3, -0.75, -0.25, 0.25, 0.75, 1.3].map((t, i) => (
        <path key={i} className="tz" pathLength={1}
              d={`M0,${(-h).toFixed(1)} q${(Math.sin(t) * 9.5).toFixed(1)},${(-4.5 - Math.abs(Math.cos(t)) * 3.2).toFixed(1)} ${(Math.sin(t) * 16).toFixed(1)},${(1.6 + Math.abs(Math.cos(t)) * 2.2).toFixed(1)}`}
              fill="none" stroke="#5c5445" strokeWidth="0.95" strokeLinecap="round" />
      ))}
    </g>
  );
}

function Persona({ g, x, y }: { g: Geo; x: number; y: number }) {
  const [a, b] = g.p(x, y, 0);
  return (
    <g className="ap" transform={`translate(${a.toFixed(1)},${b.toFixed(1)})`} opacity="0.55">
      <circle cx="0" cy="-12.4" r="1.9" fill="#3e3a34" />
      <path d="M0,-10.3 L0,-4.6 M0,-9 L-2.7,-6.3 M0,-9 L2.7,-6.3 M0,-4.6 L-2.3,0 M0,-4.6 L2.3,0"
            stroke="#3e3a34" strokeWidth="1.05" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** La palapa: nueve postes y una cubierta a cuatro aguas con cumbrera corta.
 *  Las cuatro caras se ven desde arriba porque la pendiente es suave; van de
 *  atrás hacia delante. La trama de paja va en papel sobre la tinta. */
function Palapa({ g }: { g: Geo }) {
  const { p } = g;
  const { x, y, dx, dy } = PALAPA;
  const cx = x + dx / 2, cy = y + dy / 2;
  const A = p(x, y, H_ALERO), B = p(x + dx, y, H_ALERO), C = p(x + dx, y + dy, H_ALERO), D = p(x, y + dy, H_ALERO);
  const R1 = p(cx - CUMBRERA / 2, cy, H_CUMBRE), R2 = p(cx + CUMBRERA / 2, cy, H_CUMBRE);

  // [alero a, alero b, cumbrera junto a b, cumbrera junto a a]
  const caras: Array<{ pts: [Pt, Pt, Pt, Pt]; tono: string }> = [
    { pts: [A, B, R2, R1], tono: "#8a8070" }, // norte, atrás
    { pts: [D, A, R1, R1], tono: "#7b7160" }, // oeste, atrás
    { pts: [B, C, R2, R2], tono: "#6a6152" }, // este
    { pts: [C, D, R1, R2], tono: "#574f42" }, // sur, delante
  ];

  const postes: Pt[] = [];
  for (const px of [14, 41.5, 69]) for (const py of [8, 35.5, 63]) postes.push([px, py]);
  postes.sort((m, n) => m[0] + m[1] - (n[0] + n[1]));

  return (
    <g className="palapa">
      {postes.map(([px, py]) => {
        const a = p(px, py, 0), b = p(px, py, H_ALERO);
        return <line key={`${px}-${py}`} className="tz" pathLength={1} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#3e3a34" strokeWidth="1.4" />;
      })}
      {caras.map((c, i) => (
        <g key={i}>
          <path className="rl tz palapa-cara" pathLength={1} d={poly(...c.pts)} fill={c.tono} stroke={TINTA} strokeWidth="1" strokeLinejoin="round" />
          {[0.22, 0.44, 0.66, 0.86].map((t) => {
            const u = lerp(c.pts[0], c.pts[3], t), v = lerp(c.pts[1], c.pts[2], t);
            return <line key={t} className="ap" x1={u[0]} y1={u[1]} x2={v[0]} y2={v[1]} stroke={PAPEL} strokeWidth="0.55" opacity="0.4" />;
          })}
        </g>
      ))}
      {/* alero y cumbrera: las dos líneas que hacen que se lea como techo */}
      <path className="tz palapa-cubierta" pathLength={1} d={poly(A, B, C, D)} fill="none" stroke={TINTA} strokeWidth="1.5" strokeLinejoin="round" />
      <line className="tz palapa-cubierta" pathLength={1} x1={R1[0]} y1={R1[1]} x2={R2[0]} y2={R2[1]} stroke={TINTA} strokeWidth="1.3" />
    </g>
  );
}

/**
 * LA CARPA LATERAL. Es lo que el guion dice que hay que presupuestar para un
 * evento de invierno, dibujado: dos paños del suelo al alero en las dos caras
 * que se ven, a trazos porque no existen todavía —los trae el proveedor—.
 */
function Carpa({ g }: { g: Geo }) {
  const { p } = g;
  const { x, y, dx, dy } = PALAPA;
  const este: Pt[] = [p(x + dx, y, 0), p(x + dx, y + dy, 0), p(x + dx, y + dy, H_ALERO), p(x + dx, y, H_ALERO)];
  const sur: Pt[] = [p(x, y + dy, 0), p(x + dx, y + dy, 0), p(x + dx, y + dy, H_ALERO), p(x, y + dy, H_ALERO)];
  return (
    <g className="carpa" pointerEvents="none">
      {[este, sur].map((pts, i) => (
        <path key={i} className="carpa-pano" d={poly(...pts)} fill={OCRE} fillOpacity="0.12" stroke={OCRE} strokeWidth="1.1" strokeDasharray="3 2.2" strokeLinejoin="round" />
      ))}
    </g>
  );
}

function Cabana({ g, x }: { g: Geo; x: number }) {
  const { p } = g;
  const { y, dx, dy, h } = CABANAS;
  const listones = [];
  for (let t = 2; t < dx; t += 2.4) {
    const a = p(x + t, y, h + 0.05), b = p(x + t, y + dy, h + 0.05);
    listones.push(<line key={t} className="ap" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#7d725f" strokeWidth="0.45" />);
  }
  return (
    <g>
      <Caja g={g} x={x} y={y} dx={dx} dy={dy} z1={h} tapa="#ddd5c4" izq="#ede6d8" der="#d1c8b5" w={0.8} />
      {listones}
    </g>
  );
}

/** Una mesa de diez con sus sillas: un círculo en planta, que en isométrica
 *  es una elipse. Va en ocre porque no es el sitio: es la respuesta. */
function Mesa({ g, x, y, i }: { g: Geo; x: number; y: number; i: number }) {
  const [a, b] = g.p(x, y, 0);
  const K1 = 1.2247, K2 = 0.7071;
  return (
    <g transform={`translate(${a.toFixed(1)},${b.toFixed(1)})`}>
      <g className="mesa" style={cssVars({ "--i": i })}>
        <ellipse rx={5 * U * K1} ry={5 * U * K2} fill={OCRE} opacity="0.11" />
        <ellipse rx={2.5 * U * K1} ry={2.5 * U * K2} fill="none" stroke={OCRE} strokeWidth="1" opacity="0.9" />
      </g>
    </g>
  );
}

/**
 * LA NOCHE. Un montaje posible, encendido sobre el dibujo apagado.
 *
 * No es una foto de un evento real —no la tenemos sin la marca del operador—
 * y por eso se dibuja con el mismo lenguaje que todo lo demás: escenario y
 * barra como cajas, público como puntos, luz como guirnaldas entre las copas
 * de las palmeras. Lo que el dibujo enseña es que el recinto tiene DÓNDE poner
 * cada cosa, que es lo que un productor quiere saber; qué se pone lo decide él.
 *
 * Todo lo que se dibuja aquí lo trae el cliente. La regla de copy del venue lo
 * exige: la barra es «tu barra» y la luz colgada se aprueba en la visita.
 */
function Noche({ g }: { g: Geo }) {
  const { p } = g;
  const luz = "#f3e2c4";

  // Guirnaldas: cada hilera de palmeras encadenada, y seis cruces sobre el paseo.
  const cadenas: Array<[Pt, Pt]> = [];
  for (let i = 0; i < PALMERAS_N.length - 1; i++) cadenas.push([copa(g, ...PALMERAS_N[i]), copa(g, ...PALMERAS_N[i + 1])]);
  for (let i = 1; i < PALMERAS_S.length - 1; i++) cadenas.push([copa(g, ...PALMERAS_S[i]), copa(g, ...PALMERAS_S[i + 1])]);
  for (const [n, s] of [[1, 2], [2, 3], [3, 4], [4, 6], [5, 7], [6, 8]] as Array<[number, number]>) {
    cadenas.push([copa(g, ...PALMERAS_N[n]), copa(g, ...PALMERAS_S[s])]);
  }

  const bombillas: Array<{ q: Pt; i: number }> = [];
  let k = 0;
  const trazos = cadenas.map(([a, b], j) => {
    const sag = 6.5;
    const c: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + sag];
    for (let t = 0.14; t < 0.9; t += 0.145) {
      const u = 1 - t;
      bombillas.push({ q: [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]], i: k++ });
    }
    return <path key={j} className="noche-hilo" d={`M${a[0].toFixed(1)},${a[1].toFixed(1)} Q${c[0].toFixed(1)},${c[1].toFixed(1)} ${b[0].toFixed(1)},${b[1].toFixed(1)}`} fill="none" stroke={luz} strokeWidth="0.45" opacity="0.5" />;
  });

  // El escenario: tarima baja, dos montantes y una barra de luces.
  const E = ESCENARIO;
  const m1a = p(E.x, E.y, E.h), m1b = p(E.x, E.y, E.truss);
  const m2a = p(E.x, E.y + E.dy, E.h), m2b = p(E.x, E.y + E.dy, E.truss);
  const focos = [0.2, 0.4, 0.6, 0.8].map((t) => lerp(m1b, m2b, t));

  // Luz cálida bajo la palapa: donde está la barra, la gente se junta.
  const cP = p(PALAPA.x + PALAPA.dx / 2, PALAPA.y + PALAPA.dy / 2, 0);

  return (
    <g className="noche" pointerEvents="none">
      <g>
        <ellipse cx={cP[0].toFixed(1)} cy={cP[1].toFixed(1)} rx="62" ry="30" fill={OCRE} opacity="0.13" />
        <ellipse cx={cP[0].toFixed(1)} cy={cP[1].toFixed(1)} rx="34" ry="16" fill={OCRE} opacity="0.12" />
      </g>

      {/* el público, mirando al escenario */}
      {MULTITUD.filter((_, i) => i % 2 === 0).map(([x, y], i) => {
        const [a, b] = p(x, y, 0);
        return <circle key={i} className="noche-persona" style={cssVars({ "--i": i })} cx={a.toFixed(1)} cy={b.toFixed(1)} r="0.85" fill={luz} opacity="0.7" />;
      })}

      {/* tu barra, bajo la palapa */}
      <Caja g={g} x={BARRA.x} y={BARRA.y} dx={BARRA.dx} dy={BARRA.dy} z1={BARRA.h} tapa="#3a3327" izq="#2e2920" der="#26211a" borde={luz} w={0.8} animado={false} />

      {/* el escenario */}
      <Caja g={g} x={E.x} y={E.y} dx={E.dx} dy={E.dy} z1={E.h} tapa="#3a3327" izq="#2e2920" der="#26211a" borde={luz} w={0.9} animado={false} />
      <line x1={m1a[0]} y1={m1a[1]} x2={m1b[0]} y2={m1b[1]} stroke={luz} strokeWidth="0.9" />
      <line x1={m2a[0]} y1={m2a[1]} x2={m2b[0]} y2={m2b[1]} stroke={luz} strokeWidth="0.9" />
      <line x1={m1b[0]} y1={m1b[1]} x2={m2b[0]} y2={m2b[1]} stroke={luz} strokeWidth="1" />
      {focos.map((f, i) => (
        <g key={i} className="noche-foco" style={cssVars({ "--i": i })}>
          <circle cx={f[0].toFixed(1)} cy={f[1].toFixed(1)} r="4.5" fill={OCRE} opacity="0.22" />
          <circle cx={f[0].toFixed(1)} cy={f[1].toFixed(1)} r="1.4" fill={OCRE} />
        </g>
      ))}

      {/* las guirnaldas */}
      {trazos}
      {bombillas.map(({ q, i }) => (
        <g key={i} className="noche-bombilla" style={cssVars({ "--i": i })}>
          <circle cx={q[0].toFixed(1)} cy={q[1].toFixed(1)} r="2.4" fill={OCRE} opacity="0.18" />
          <circle cx={q[0].toFixed(1)} cy={q[1].toFixed(1)} r="0.75" fill={luz} />
        </g>
      ))}
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
    ojo: "El terreno, en un dibujo",
    titulo: "Un jardín de 240 pies, con techo en una esquina.",
    intro: "Así es el recinto visto desde el aire. Toca cada zona para saber qué es, y prueba las cuatro preguntas que siempre hacen los productores.",
    aria: "Isométrica del recinto: un jardín rectangular con setos perimetrales, un paseo pavimentado de extremo a extremo, una palapa techada en una esquina, dos hileras de palmeras y ocho cabañas en el borde opuesto. Al lado, el edificio de dos niveles.",
    /**
     * Nombres de capa, no preguntas. Las preguntas las hace el recorrido
     * guiado, que además las contesta: tener las mismas dos veces, una como
     * botón mudo y otra como capítulo narrado, obliga a la persona a descubrir
     * por prueba y error cuál de las dos hace qué.
     */
    modos: { todo: "Ver todo", lluvia: "Con lluvia", mesas: "Con mesas", camion: "Con camión", noche: "Montado, de noche" } as Partial<Record<Modo, string>>,
    explica: {
      todo: "Lo techado va en tinta y lo abierto en claro. El paseo cruza el recinto de lado a lado y es por donde entra todo.",
      lluvia: "La palapa cubre ~4 000 ft² con techo de paja, abierta por los cuatro costados: para el sol y el agua que cae recta. Lo demás queda al aire, y para un evento de invierno conviene carpa lateral.",
      carpa: "Con viento la lluvia entra de lado. Para un evento de invierno se cierran los costados con carpa lateral, que trae tu proveedor: aquí va dibujada a trazos.",
      mesas: "Treinta mesas de diez, dibujadas a la misma escala que el recinto: son los ~300 sentados verificados, y sobra pasillo entre mesas.",
      gente: "Seiscientas personas de pie, a ocho pies cuadrados cada una: ocupan cerca de un tercio del jardín. Es el aforo verificado, dibujado.",
      camion: "Por NW 1st Ct al paseo pavimentado, continuo y a nivel: un camión de 40 ft llega hasta el fondo sin pisar césped.",
      noche: "Un montaje posible, de noche: escenario al fondo del jardín, tu barra bajo la palapa, público en el césped y luz entre las palmeras. Todo lo encendido lo trae tu equipo; la luz colgada se aprueba en la visita.",
    } as Record<Modo, string>,
    zonas: {
      jardin: {
        nombre: "El Jardín", dato: "~18 000 ft² · al aire libre",
        lee: "Paseo pavimentado central, césped artificial a los lados, dos hileras de palmeras reales y setos perimetrales.",
        sirve: "Es el volumen del recinto: ceremonia, cena larga o escenario con público de pie. El paseo lo parte en dos franjas de césped, y esa geometría manda en cualquier montaje.",
        ojo: "Al aire libre y sin cerramiento. El césped es artificial, así que no se embarra; para cargas puntuales hay que repartir apoyo.",
      },
      tiki: {
        nombre: "El Tiki Hut", dato: "~4 000 ft² · techado",
        lee: "Palapa de paja a cuatro aguas sobre postes de madera, abierta por los cuatro costados. Es el plan de lluvia.",
        sirve: "La sombra permanente del recinto. Cabe barra, escenario pequeño o las mesas que no quieras dejar al descubierto.",
        ojo: "Para el agua que cae recta basta sola; con viento conviene cerrar los costados. La luz entre postes se levanta en la visita.",
      },
      cabanas: {
        nombre: "Ocho cabañas", dato: "amuebladas · en hilera",
        lee: "Van con el predio y quedan en el borde opuesto al paseo, entre las palmeras.",
        sirve: "Camerino, guardarropa o rincón de descanso sin tener que montar nada.",
        ojo: "Van con el predio: no se pueden mover ni retirar del montaje.",
      },
      acceso: {
        nombre: "Acceso", dato: "NW 1st Ct · al paseo",
        lee: "La producción entra directo al paseo pavimentado, que es continuo y a nivel hasta el fondo.",
        sirve: "Por aquí entra todo: camión, catering, estructura y escenario, sin pisar césped.",
        ojo: "El ancho exacto del portón y la potencia eléctrica disponible se levantan contigo en la visita y se entregan por escrito.",
      },
      edificio: {
        nombre: "El edificio", dato: "zona 02 · 2 niveles",
        lee: "El cascarón se alquila aparte y tiene su propia lámina, con 22 ft libres en la doble altura.",
        sirve: "Es la zona 02 y va por separado. Sirve si el evento necesita interior además del jardín.",
        ojo: "Lo que hay montado hoy dentro pertenece al operador del inmueble y no forma parte de lo que se alquila.",
      },
    } as Record<Zona, { nombre: string; dato: string; lee: string; sirve: string; ojo: string }>,
    cajetin: ["Club Wynwood", "El recinto · zona 01", "Vista noreste · sin escala"],
    escala: "50 ft",
    nota: "Esquema volumétrico, sin escala: las medidas salen de los pies cuadrados declarados y de la foto aérea, y se confirman en la visita técnica. Lo techado se dibuja en tinta y lo abierto en claro. El montaje de noche es un ejemplo: todo lo encendido lo trae el cliente.",
  },
  en: {
    ojo: "The land, in one drawing",
    titulo: "A 240-foot garden, with a roof in one corner.",
    intro: "This is the site seen from the air. Tap each zone to see what it is, and try the four questions producers always ask.",
    aria: "Isometric of the site: a rectangular garden with perimeter hedges, a paved walk running end to end, a thatched structure in one corner, two rows of palms and eight cabanas along the far edge. Next to it, the two-level building.",
    /** Layer names, not questions. The tour asks and answers those. */
    modos: { todo: "Everything", lluvia: "With rain", mesas: "With tables", camion: "With a truck", noche: "Set up, at night" } as Partial<Record<Modo, string>>,
    explica: {
      todo: "Roofed volumes are drawn in ink, open ground in light tone. The walk crosses the site end to end, and it is how everything gets in.",
      lluvia: "The structure covers ~4,000 sq ft under thatch, open on all four sides: it stops sun and vertical rain. The rest stays open-air, and a winter event should budget for side tenting.",
      carpa: "With wind, rain comes in sideways. A winter event closes the sides with side tenting, which your supplier brings: here it is drawn dashed.",
      mesas: "Thirty tables of ten, drawn at the same scale as the site: these are the verified ~300 seated, with room to move between tables.",
      gente: "Six hundred people standing, at eight square feet each: they take up about a third of the garden. That is the verified capacity, drawn.",
      camion: "From NW 1st Ct onto the paved walk, continuous and level: a 40 ft truck reaches the far end without crossing turf.",
      noche: "One possible setup, at night: a stage at the far end of the garden, your bar under the structure, a crowd on the turf and light between the palms. Everything lit is brought by your team; hung lighting is approved at the visit.",
    } as Record<Modo, string>,
    zonas: {
      jardin: {
        nombre: "The Garden", dato: "~18,000 sq ft · open air",
        lee: "A central paved walk, artificial turf on both sides, two rows of real palms and perimeter hedges.",
        sirve: "This is the volume of the site: ceremony, long-table dinner or a stage with a standing crowd. The walk splits it into two turf strips, and that geometry drives any layout.",
        ojo: "Open air, no enclosure. The turf is artificial, so it will not turn to mud; point loads need spreading.",
      },
      tiki: {
        nombre: "The Tiki Hut", dato: "~4,000 sq ft · covered",
        lee: "Four-hip thatch structure on timber posts, open on all four sides. It is the rain plan.",
        sirve: "The site's permanent shade. It takes a bar, a small stage, or the tables you would rather not leave uncovered.",
        ojo: "For vertical rain it is enough on its own; with wind you will want the sides closed. Post spacing is surveyed at the visit.",
      },
      cabanas: {
        nombre: "Eight cabanas", dato: "furnished · in a row",
        lee: "They come with the site and line the edge opposite the walk, between the palms.",
        sirve: "Green room, coat check or a quiet corner, without building anything.",
        ojo: "They come with the site: they cannot be moved or taken out of the layout.",
      },
      acceso: {
        nombre: "Access", dato: "NW 1st Ct · onto the walk",
        lee: "Production drives straight onto the paved walk, continuous and level to the far end.",
        sirve: "Everything comes in here: truck, catering, rigging and stage, without crossing turf.",
        ojo: "Exact gate width and available power are surveyed with you at the visit and delivered in writing.",
      },
      edificio: {
        nombre: "The building", dato: "zone 02 · 2 levels",
        lee: "The shell is rented separately and has its own plate, with 22 ft clear in the double-height zone.",
        sirve: "It is zone 02 and goes separately. Useful if the event needs indoor space as well as the garden.",
        ojo: "Whatever is installed inside today belongs to the building's operator and is not part of the rental.",
      },
    } as Record<Zona, { nombre: string; dato: string; lee: string; sirve: string; ojo: string }>,
    cajetin: ["Club Wynwood", "The site · zone 01", "North-east view · not to scale"],
    escala: "50 ft",
    nota: "Volumetric diagram, not to scale: dimensions come from the declared square footage and the aerial photograph, and are confirmed at the technical visit. Roofed volumes in ink, open ground in light tone. The night setup is an example: everything lit is brought by the client.",
  },
} as const;

const ORDEN_ZONAS: Zona[] = ["jardin", "tiki", "cabanas", "acceso", "edificio"];
const MODOS_MANUALES: Modo[] = ["todo", "lluvia", "mesas", "camion", "noche"];

// ── el dibujo, memorizado ──────────────────────────────────────────────────

/**
 * EL SVG VA APARTE Y MEMORIZADO, y no es una optimización de manual.
 *
 * La auditoría del 5-sep lo midió: mientras la voz narra, el estado del tiempo
 * cambia varias veces por segundo y el componente padre se vuelve a pintar con
 * él. Sin esto, cada uno de esos repintados recorría los ~1 100 nodos del
 * dibujo —600 personas, 110 gotas, 30 mesas, 9 palmeras…— para no cambiar
 * nada. En un móvil de gama media se notaba como tartamudeo en los subtítulos.
 *
 * Aquí el dibujo solo se repinta cuando cambia lo que de verdad lo cambia: la
 * zona resaltada o el aforo que se está dibujando. El modo ni siquiera entra:
 * lo aplica el CSS por `data-modo` en la raíz.
 */
const Dibujo = memo(function Dibujo({ lang, zona, aforo, alEntrar, alSalir, alTocar }: {
  lang: Idioma;
  zona: Zona | null;
  aforo?: Aforo;
  alEntrar: (z: Zona) => void;
  alSalir: (z: Zona) => void;
  alTocar: (z: Zona) => void;
}) {
  const t = T[lang];
  const g = G;
  const { p, techo } = g;

  // Cuántas mesas y cuántas personas se dibujan. Por defecto, el aforo
  // verificado entero; con un aforo concreto, ese, con tope en el verificado.
  const mesasN = aforo ? Math.min(MESAS.length, Math.ceil(Math.max(0, aforo.invitados) / 10)) : MESAS.length;
  const genteN = aforo ? Math.min(MULTITUD.length, Math.max(0, aforo.invitados)) : MULTITUD.length;

  const zClase = (z: Zona) => `z z-${z}${zona === z ? " activa" : ""}`;
  const zProps = (z: Zona) => ({
    onMouseEnter: () => alEntrar(z),
    onMouseLeave: () => alSalir(z),
    onClick: () => alTocar(z),
  });

  // El camión recorre el paseo: del acceso hasta su sitio, sobre el eje x.
  const d0 = p(0, 0, 0), d1 = p(1, 0, 0);
  const desplazamiento = { cx: -(CAMION.recorrido * (d1[0] - d0[0])), cy: -(CAMION.recorrido * (d1[1] - d0[1])) };

  // Las gotas: fijas y deterministas.
  const azar = lcg(20260902);
  const GOTAS = Array.from({ length: 110 }, () => ({
    x: VB.x + azar() * VB.w,
    y: VB.y + azar() * VB.h,
    t: -(azar() * 1.1).toFixed(2),
  }));

  const pav = [];
  for (let x = 20; x < LOTE.dx; x += 20) {
    const a = p(x, PASEO.y, 0.05), b = p(x, PASEO.y + PASEO.dy, 0.05);
    pav.push(<line key={x} className="ap" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#d5cdbb" strokeWidth="0.6" />);
  }

  const flechaA = p(-30, 74, 0), flechaB = p(-4, 74, 0);
  const anF = Math.atan2(flechaB[1] - flechaA[1], flechaB[0] - flechaA[0]);
  const punta = `M${(flechaB[0] - Math.cos(anF - 0.5) * 7).toFixed(1)},${(flechaB[1] - Math.sin(anF - 0.5) * 7).toFixed(1)} L${flechaB[0].toFixed(1)},${flechaB[1].toFixed(1)} L${(flechaB[0] - Math.cos(anF + 0.5) * 7).toFixed(1)},${(flechaB[1] - Math.sin(anF + 0.5) * 7).toFixed(1)}`;

  // Norte proyectado, no dibujado a ojo: se pasa un punto 10 ft al norte por la
  // misma función que dibuja todo lo demás.
  const o = p(120, 46, 0), n = p(120, 36, 0);
  const radN = Math.atan2(n[1] - o[1], n[0] - o[0]);
  const angN = (radN * 180) / Math.PI + 90;

  const cxP = PALAPA.x + PALAPA.dx / 2, cyP = PALAPA.y + PALAPA.dy / 2;
  const ROTULOS = [
    { zona: "jardin" as Zona, ancla: p(196, 14, 0), dx: 34, dy: -62 },
    { zona: "tiki" as Zona, ancla: p(cxP, cyP, H_CUMBRE), dx: 44, dy: -52 },
    { zona: "cabanas" as Zona, ancla: p(160, 85.5, CABANAS.h), dx: -30, dy: 62 },
    { zona: "acceso" as Zona, ancla: p(-14, 74, 0), dx: -20, dy: -46 },
    { zona: "edificio" as Zona, ancla: p(EDIF.x + EDIF.corte + 20, 36, EDIF.h2), dx: 14, dy: -64 },
  ];

  return (
    <svg viewBox={`${VB.x.toFixed(0)} ${VB.y.toFixed(0)} ${VB.w.toFixed(0)} ${VB.h.toFixed(0)}`} role="img" aria-label={t.aria}>
      <defs>
        <pattern id="lam-cesped" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="1.2" cy="1.2" r="0.42" fill="#aaa38c" />
          <circle cx="3.7" cy="3.7" r="0.42" fill="#aaa38c" />
        </pattern>
      </defs>

      {/* ── el suelo ─────────────────────────────────────────────── */}
      <g style={cssVars({ "--d": "0s" })}>
        <path className="rl tz" pathLength={1} d={techo(0, 0, LOTE.dx, LOTE.dy, 0)} fill="#f4efe3" stroke={GRIS} strokeWidth="0.8" />
        <g className={zClase("jardin")} {...zProps("jardin")}>
          <path className="rl cesped" d={techo(SETO.ancho, SETO.ancho, LOTE.dx - SETO.ancho * 2, PASEO.y - SETO.ancho, 0.02)} fill="#e9e3d0" />
          <path className="rl cesped" d={techo(SETO.ancho, SETO.ancho, LOTE.dx - SETO.ancho * 2, PASEO.y - SETO.ancho, 0.02)} fill="url(#lam-cesped)" opacity="0.7" />
          <path className="rl cesped" d={techo(SETO.ancho, PASEO.y + PASEO.dy, LOTE.dx - SETO.ancho * 2, CABANAS.y - PASEO.y - PASEO.dy, 0.02)} fill="#e9e3d0" />
        </g>
        <path className="rl" d={techo(PALAPA.x, PALAPA.y, PALAPA.dx, PALAPA.dy, 0.03)} fill="#efe9dc" />
        <path className="rl tz" pathLength={1} d={techo(0, PASEO.y, LOTE.dx, PASEO.dy, 0.04)} fill={PAPEL} stroke={GRIS} strokeWidth="0.7" />
        {pav}
      </g>

      {/* ── setos de atrás ───────────────────────────────────────── */}
      <g style={cssVars({ "--d": ".25s" })}>
        <Seto g={g} x={0} y={0} dx={LOTE.dx} dy={SETO.ancho} />
        <Seto g={g} x={0} y={0} dx={SETO.ancho} dy={PASEO.y} />
        <Seto g={g} x={0} y={PASEO.y + PASEO.dy} dx={SETO.ancho} dy={LOTE.dy - PASEO.y - PASEO.dy} />
      </g>

      {/* ── la palapa, y la carpa lateral que no existe todavía ──── */}
      <g className={zClase("tiki")} {...zProps("tiki")} style={cssVars({ "--d": ".6s" })}>
        <Palapa g={g} />
      </g>
      <Carpa g={g} />

      {/* ── las mesas y la gente (solo en su modo) ───────────────── */}
      <g className="mesas" pointerEvents="none">
        {MESAS.slice(0, mesasN).map(([x, y], i) => <Mesa key={i} g={g} x={x} y={y} i={i} />)}
      </g>
      <g className="gente" pointerEvents="none">
        {MULTITUD.slice(0, genteN).map(([x, y], i) => {
          const [a, b] = p(x, y, 0);
          return <circle key={i} className="persona" style={cssVars({ "--i": i })} cx={a.toFixed(1)} cy={b.toFixed(1)} r="0.95" fill={TINTA} opacity="0.7" />;
        })}
      </g>

      {/* ── palmeras del norte y gente suelta ────────────────────── */}
      <g style={cssVars({ "--d": "1s" })}>
        {PALMERAS_N.map(([x, y]) => <Palma key={`n${x}`} g={g} x={x} y={y} />)}
        {GENTE_SUELTA.map(([x, y]) => <Persona key={`g${x}`} g={g} x={x} y={y} />)}
      </g>

      {/* ── el camión (solo en su modo) ──────────────────────────── */}
      <g className="camion" pointerEvents="none" style={cssVars({ "--cx": `${desplazamiento.cx.toFixed(1)}px`, "--cy": `${desplazamiento.cy.toFixed(1)}px` })}>
        <Caja g={g} x={CAMION.x + 9} y={CAMION.y} dx={CAMION.dx - 9} dy={CAMION.dy} z1={CAMION.h} tapa="#fbf8f1" izq="#f3eee4" der="#ece6d9" borde={OCRE} w={1.2} />
        <Caja g={g} x={CAMION.x} y={CAMION.y} dx={8} dy={CAMION.dy} z1={9} tapa="#fbf8f1" izq="#f3eee4" der="#ece6d9" borde={OCRE} w={1.2} />
      </g>

      {/* ── palmeras del sur, cabañas, setos de delante ──────────── */}
      <g style={cssVars({ "--d": "1.3s" })}>
        {PALMERAS_S.map(([x, y]) => <Palma key={`s${x}`} g={g} x={x} y={y} />)}
      </g>
      <g className={zClase("cabanas")} {...zProps("cabanas")} style={cssVars({ "--d": "1.5s" })}>
        {Array.from({ length: CABANAS.n }, (_, i) => (
          <Cabana key={i} g={g} x={CABANAS.x + i * (CABANAS.dx + CABANAS.hueco)} />
        ))}
      </g>
      <g style={cssVars({ "--d": "1.7s" })}>
        <Seto g={g} x={0} y={LOTE.dy - SETO.ancho} dx={LOTE.dx} dy={SETO.ancho} />
        <Seto g={g} x={LOTE.dx - SETO.ancho} y={0} dx={SETO.ancho} dy={LOTE.dy} />
      </g>

      {/* ── el acceso ────────────────────────────────────────────── */}
      <g className={zClase("acceso")} {...zProps("acceso")} style={cssVars({ "--d": "1.9s" })}>
        <path className="tz" pathLength={1} d={`M${flechaA[0].toFixed(1)},${flechaA[1].toFixed(1)} L${flechaB[0].toFixed(1)},${flechaB[1].toFixed(1)}`} fill="none" stroke={TINTA} strokeWidth="1.6" />
        <path className="tz" pathLength={1} d={punta} fill="none" stroke={TINTA} strokeWidth="1.6" strokeLinejoin="round" />
        <path d={techo(-34, 66, 34, 16, 0)} fill="transparent" />
      </g>

      {/* ── el edificio, en claro: es la otra lámina ─────────────── */}
      <g className={zClase("edificio")} {...zProps("edificio")} style={cssVars({ "--d": "2s" })}>
        <Caja g={g} x={EDIF.x} y={0} dx={EDIF.corte} dy={EDIF.dy} z1={EDIF.h1} tapa="#f5f1e8" izq="#ece7db" der="#e4ded1" borde={GRIS} w={0.8} />
        <Caja g={g} x={EDIF.x + EDIF.corte} y={0} dx={EDIF.dx - EDIF.corte} dy={EDIF.dy} z1={EDIF.h2} tapa="#f5f1e8" izq="#ece7db" der="#e4ded1" borde={GRIS} w={0.8} />
      </g>

      {/* ── cotas, norte, escala ─────────────────────────────────── */}
      <g pointerEvents="none" style={cssVars({ "--d": "2.1s" })}>
        <Cota g={g} a={[0, LOTE.dy + 16]} b={[LOTE.dx, LOTE.dy + 16]} texto="≈ 240 FT · 73 M" giro={30} />
        <Cota g={g} a={[LOTE.dx + 9, 0]} b={[LOTE.dx + 9, LOTE.dy]} texto="≈ 92 FT · 28 M" giro={-30} />
        <Cota g={g} a={[PALAPA.x, PALAPA.y - 7]} b={[PALAPA.x + PALAPA.dx, PALAPA.y - 7]} texto="≈ 63 FT" giro={30} />

        <g className="ap" transform={`translate(${(VB.x + VB.w - 34).toFixed(1)},${(VB.y + 40).toFixed(1)})`}>
          <g transform={`rotate(${angN.toFixed(1)})`}>
            <path d="M0,14 L0,-11 M-3.2,-4 L0,-12 L3.2,-4" fill="none" stroke={TINTA} strokeWidth="1" />
          </g>
          <text x={(Math.cos(radN) * 21).toFixed(1)} y={(Math.sin(radN) * 21).toFixed(1)} dy="3" textAnchor="middle"
                fontFamily="ui-monospace,monospace" fontSize="8.5" fill={GRIS}>N</text>
        </g>

        <g className="ap" transform={`translate(${(VB.x + 16).toFixed(1)},${(VB.y + VB.h - 22).toFixed(1)})`}>
          {[0, 1, 2].map((i) => (
            <rect key={i} x={(i * 50 * U * 0.866) / 3} y="0" width={(50 * U * 0.866) / 3} height="4"
                  fill={i % 2 ? PAPEL : TINTA} stroke={TINTA} strokeWidth="0.45" />
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
          <line key={i} className="gota" style={cssVars({ "--t": `${q.t}s` })}
                x1={q.x.toFixed(1)} y1={q.y.toFixed(1)} x2={(q.x - 3.5).toFixed(1)} y2={(q.y + 10).toFixed(1)}
                stroke={TINTA} strokeWidth="0.9" strokeLinecap="round" />
        ))}
      </g>
    </svg>
  );
});

// ── la lámina ──────────────────────────────────────────────────────────────

/**
 * El dibujo se puede DIRIGIR desde fuera, sin perder su control manual.
 *
 * Lo usa el recorrido guiado (`components/Recorrido.tsx`): mientras la voz
 * narra, es el guion quien decide qué modo, qué zona y qué encuadre se ven. En
 * cuanto la persona toca un botón, `onManual` avisa, el recorrido se para y el
 * dibujo vuelve a su estado interno.
 *
 * Todas las props de dirección son opcionales a propósito: sin ninguna, esto es
 * exactamente lo que era antes y funciona igual. Un componente que solo sirve
 * acompañado de otro es un componente que se rompe cuando alguien lo usa suelto.
 */
export default function LaminaRecinto({
  lang,
  modoDirigido,
  zonaDirigida,
  puntoDirigido,
  zoomDirigido,
  rotuloPunto,
  aforo,
  cine = false,
  semillaDibujo = 0,
  onManual,
  panel,
}: {
  lang: Idioma;
  modoDirigido?: Modo;
  /** `null` es un valor válido: significa «ninguna zona resaltada». */
  zonaDirigida?: Zona | null;
  /**
   * A DÓNDE ESTÁ MIRANDO LA NARRACIÓN, en coordenadas del terreno (pies).
   *
   * El guion del recorrido las trae desde el primer día: cada frase dice a qué
   * parte del recinto se refiere. Una marca camina hasta ahí, y la cámara
   * —si `zoomDirigido` lo pide— se acerca.
   */
  puntoDirigido?: [number, number] | null;
  /** 1 = el recinto entero. Más, la cámara se acerca al punto dirigido. */
  zoomDirigido?: number;
  rotuloPunto?: string;
  /** Cuántos invitados dibujar en los modos «mesas» y «gente». Sin él, el aforo verificado. */
  aforo?: Aforo;
  /** Pantalla completa sobre tinta, con el panel al lado. Lo enciende el recorrido. */
  cine?: boolean;
  /** Cambiarla vuelve a dibujar el trazado desde cero. El recorrido la sube al empezar. */
  semillaDibujo?: number;
  onManual?: () => void;
  panel?: React.ReactNode;
}) {
  const t = T[lang];
  const [modoLocal, setModo] = useState<Modo>("todo");
  const [zonaLocal, setZona] = useState<Zona | null>(null);
  const [fase, setFase] = useState<Fase>("pendiente");
  const raiz = useRef<HTMLDivElement>(null);
  const quieto = useRef(false);

  /**
   * PANTALLA VERTICAL (el móvil en la mano, o el vídeo 9:16 para reels).
   *
   * El dibujo es muy apaisado: a lo ancho de un teléfono ocupa un tercio del
   * alto y el resto queda vacío. En vertical, el cine le da al papel una caja
   * más alta que el dibujo (proporción 1,15 en vez de 1,75) y la cámara arranca
   * más cerca: el plano recorta los márgenes del papel y el recinto llena el
   * cuadro. Las posiciones de la marca se corrigen por el desplazamiento
   * vertical que deja el encaje del SVG dentro de la caja más alta.
   */
  const [vertical, setVertical] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-aspect-ratio: 9/15)");
    const f = () => setVertical(mq.matches);
    f();
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);

  // Lo que manda mientras el recorrido está en marcha. `undefined` significa
  // que nadie dirige; `null` en la zona sí dirige, y quiere decir «ninguna».
  const dirigiendo = modoDirigido !== undefined;
  const modo = modoDirigido ?? modoLocal;
  const zona = zonaDirigida !== undefined ? zonaDirigida : zonaLocal;

  // Se dibuja al entrar en pantalla, una vez. Sin JavaScript, sin
  // IntersectionObserver o con movimiento reducido: se ve entero y quieto.
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
      // Los rótulos entran cuando el dibujo ya está: se programa desde aquí y
      // no con animation-delay, que se reiniciaba al cambiar de modo.
      temporizador = setTimeout(() => setFase("listo"), 2400);
    }, { threshold: 0.2 });
    io.observe(el);
    return () => {
      io.disconnect();
      if (temporizador) clearTimeout(temporizador);
    };
  }, []);

  /**
   * VOLVER A DIBUJAR. El recorrido sube la semilla al empezar, y el trazado
   * corre otra vez desde cero mientras la voz dice «lo que ves es el recinto
   * desde el aire». Es el primer plano del vídeo, y sin esto la persona que
   * ya había visto el dibujo entero se lo encontraba quieto.
   *
   * Un cuadro en «pendiente» entre medias es lo que reinicia las animaciones
   * CSS: si la clase pasara de «dibujar» a «dibujar», no ocurriría nada.
   */
  useEffect(() => {
    if (!semillaDibujo || quieto.current) return;
    setFase("pendiente");
    let temporizador: ReturnType<typeof setTimeout> | null = null;
    const cuadro = requestAnimationFrame(() => {
      setFase("dibujar");
      temporizador = setTimeout(() => setFase("listo"), 2400);
    });
    return () => {
      cancelAnimationFrame(cuadro);
      if (temporizador) clearTimeout(temporizador);
    };
  }, [semillaDibujo]);

  // Sin scroll de fondo mientras el cine ocupa la pantalla. Se devuelve tal
  // cual estaba: la página puede tener su propio overflow declarado.
  useEffect(() => {
    if (!cine) return;
    const antes = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => { document.documentElement.style.overflow = antes; };
  }, [cine]);

  function elegirModo(m: Modo) {
    // Tocar un botón devuelve el mando: el recorrido se para y el dibujo pasa a
    // obedecer a la persona. Seguir narrando encima sería pelearse con ella.
    onManual?.();
    setModo(m);
    if (m !== "todo") ev("toggle_layer", { layer: m });
  }

  const alEntrar = useCallback((z: Zona) => setZona(z), []);
  const alSalir = useCallback((z: Zona) => setZona((a) => (a === z ? null : a)), []);
  const alTocar = useCallback((z: Zona) => {
    onManual?.();
    setZona((actual) => (actual === z ? null : z));
    ev("select_zone", { zone: z });
  }, [onManual]);

  const { p } = G;

  // Los rótulos: ancla en el objeto, chip fuera del dibujo, línea de guía
  // entre los dos. Mismo orden que la lista de abajo: el número del chip y el
  // de la lista tienen que ser el mismo, o el dibujo y el texto se contradicen.
  const cxP = PALAPA.x + PALAPA.dx / 2, cyP = PALAPA.y + PALAPA.dy / 2;
  const rotulo = (z: Zona, ancla: Pt, dx: number, dy: number, lado: "" | "der" = "", vert: "" | "inf" = "") =>
    ({ zona: z, fin: [ancla[0] + dx, ancla[1] + dy] as Pt, lado, vert });
  const ROTULOS = [
    rotulo("jardin", p(196, 14, 0), 34, -62),
    rotulo("tiki", p(cxP, cyP, H_CUMBRE), 44, -52),
    rotulo("cabanas", p(160, 85.5, CABANAS.h), -30, 62, "der", "inf"),
    rotulo("acceso", p(-14, 74, 0), -20, -46),
    rotulo("edificio", p(EDIF.x + EDIF.corte + 20, 36, EDIF.h2), 14, -64, "der"),
  ];

  /**
   * LA CÁMARA. Una sola transformación sobre el lienzo entero.
   *
   * El punto dirigido cae en el centro del encuadre y el lienzo se escala desde
   * su esquina; el desplazamiento se acota para que el papel nunca se acabe
   * antes que el marco. Va por CSS con transición larga: el plano se mueve como
   * lo movería alguien con una cámara, no como salta una interfaz.
   *
   * Los rótulos HTML y la marca viajan dentro del lienzo. La marca se
   * contra-escala con `--zoom` para no crecer con el plano; los rótulos se
   * apagan mientras alguien dirige, porque a doble tamaño taparían lo que la
   * voz está enseñando.
   */
  const altaEnVertical = cine && vertical;
  const ratioCaja = altaEnVertical ? 1.15 : PROPORCION;
  // Con la caja más alta que el dibujo, el SVG queda centrado y deja margen
  // arriba y abajo: la fracción vertical se corrige por ese margen.
  const fracCaja = (q: Pt): Pt => {
    const [fx, fy] = frac(q);
    if (ratioCaja >= PROPORCION - 1e-6) return [fx, fy];
    const alturaCaja = 1 / ratioCaja, alturaDibujo = 1 / PROPORCION;
    const margen = (alturaCaja - alturaDibujo) / 2;
    return [fx, (margen + fy * alturaDibujo) / alturaCaja];
  };
  const pctCaja = (q: Pt) => {
    const [fx, fy] = fracCaja(q);
    return { left: `${(fx * 100).toFixed(2)}%`, top: `${(fy * 100).toFixed(2)}%` };
  };

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

  // «listo» conserva «dibujar»: los trazos ya animados se quedan como están.
  const clase = `lam ${fase === "listo" ? "dibujar listo" : fase}${zona ? " enfocado" : ""}${dirigiendo ? " recorriendo" : ""}${cine ? " cine" : ""}`;

  return (
    <section id="terreno" aria-label={t.ojo} style={{ background: "var(--papel-2)", borderBottom: "1px solid var(--regla)" }}>
      <div className="reja" style={{ paddingBlock: "64px 64px" }}>
        <div ref={raiz} className={clase} data-modo={modo} style={cssVars({ "--ratio": ratioCaja.toFixed(4) })}>
          <noscript>
            <style>{`.lam.pendiente .tz{stroke-dashoffset:0}.lam.pendiente .rl{fill-opacity:1}.lam.pendiente .ap,.lam.pendiente .lam-etq,.lam.pendiente .lam-cajetin{opacity:1}`}</style>
          </noscript>

          <div className="lam-cabecera">
            <div className="ojo" style={{ paddingBottom: 18 }}>{t.ojo}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "12px 44px", alignItems: "end", paddingBottom: 22 }}>
              <h2 style={{ maxWidth: "16ch" }}>{t.titulo}</h2>
              <p className="respuesta" style={{ margin: 0, color: "var(--texto)", maxWidth: "46ch" }}>{t.intro}</p>
            </div>

            <div className="lam-modos" role="group" aria-label={lang === "es" ? "Qué ver en el dibujo" : "What to show on the drawing"}>
              {MODOS_MANUALES.map((m) => (
                <button key={m} type="button" className="lam-modo" aria-pressed={modo === m} onClick={() => elegirModo(m)}>
                  {t.modos[m]}
                </button>
              ))}
            </div>
            <p className="lam-explica" aria-live="polite">{t.explica[modo]}</p>
          </div>

          <div className="lam-escenario">
            <figure className="lam-fig" style={{ aspectRatio: altaEnVertical ? String(ratioCaja) : `${VB.w.toFixed(0)} / ${VB.h.toFixed(0)}` }}>
              <div className="lam-lienzo" style={camara}>
                <Dibujo lang={lang} zona={zona} aforo={aforo} alEntrar={alEntrar} alSalir={alSalir} alTocar={alTocar} />

                {/**
                  * LA MARCA QUE CAMINA. Es lo que convierte la narración en visita.
                  *
                  * El guion trae, en cada frase, a qué punto del terreno se refiere.
                  * Sin dibujarlo, la voz habla del acceso mientras el dibujo entero
                  * se queda igual y la persona tiene que adivinar de qué le hablan.
                  *
                  * Se posiciona proyectando el punto con la MISMA función que dibuja
                  * todo lo demás, así que cae exactamente donde debe aunque cambie la
                  * geometría. Y viaja con una transición larga: el salto instantáneo
                  * se lee como un parpadeo, el viaje se lee como alguien señalando.
                  */}
                {dirigiendo && puntoDirigido && (
                  <div className="lam-guia-punto" style={pctCaja(p(puntoDirigido[0], puntoDirigido[1], 0))} aria-hidden="true">
                    <span className="lam-guia-halo" />
                    <span className="lam-guia-nucleo" />
                    {rotuloPunto && <span className="lam-guia-rotulo">{rotuloPunto}</span>}
                  </div>
                )}

                {/* ── cajetín y rótulos, en HTML: escalan con la página ───────── */}
                <div className="lam-cajetin" aria-hidden>
                  <b>{t.cajetin[0]}</b>
                  {t.cajetin[1]}<br />{t.cajetin[2]}
                </div>

                {ROTULOS.map((r, i) => {
                  const z = t.zonas[r.zona];
                  return (
                    <button key={r.zona} type="button"
                            className={`lam-etq ${r.lado} ${r.vert}${zona === r.zona ? " activa" : ""}`}
                            style={pct(r.fin)}
                            tabIndex={dirigiendo ? -1 : 0}
                            onMouseEnter={() => setZona(r.zona)}
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
            </figure>
          </div>

          {/* El recorrido guiado, si lo hay. Va DEBAJO del dibujo a propósito:
              lo que se narra pasa arriba, y los controles no deben taparlo. En
              modo cine, el CSS lo pone al lado. */}
          {panel}

          {/* ── la lectura de cada zona ─────────────────────────────────── */}
          <ol className="lam-lista">
            {ORDEN_ZONAS.map((zk, i) => {
              const z = t.zonas[zk];
              return (
                <li key={zk}>
                  <button type="button" className={`lam-item${zona === zk ? " activa" : ""}`}
                          onMouseEnter={() => setZona(zk)}
                          onMouseLeave={() => setZona((a) => (a === zk ? null : a))}
                          onClick={() => alTocar(zk)}>
                    <span className="lam-item-n" aria-hidden>{i + 1}</span>
                    <span>
                      <span className="lam-item-nombre">{z.nombre}</span>
                      <span className="lam-item-dato">{z.dato}</span>
                      <span className="lam-item-lee">{z.lee}</span>

                      {/**
                        * PARA QUÉ SIRVE Y QUÉ HAY QUE SABER.
                        *
                        * Antes cada zona era una línea que decía qué es. Un
                        * productor no necesita saber qué es: necesita saber si
                        * le sirve y con qué se va a encontrar. Las dos frases
                        * de abajo contestan justo eso, y la segunda dice lo que
                        * NO hay, que es la mitad del argumento de este venue.
                        */}
                      <span className="lam-item-sirve">{z.sirve}</span>
                      <span className="lam-item-ojo">{z.ojo}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <p className="ojo lam-nota" style={{ paddingTop: 18, lineHeight: 1.75, maxWidth: "78ch" }}>{t.nota}</p>
        </div>
      </div>
    </section>
  );
}

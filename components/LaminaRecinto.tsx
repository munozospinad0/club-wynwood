"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
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
 *  4. TRES RESPUESTAS ANIMADAS a las tres preguntas que hace un productor:
 *     «¿y si llueve?» (llueve sobre el dibujo y el techo se marca), «¿caben
 *     300 sentados?» (aparecen treinta mesas de diez, a escala) y «¿entra un
 *     camión?» (un camión de 40 ft recorre el paseo). No son adornos: son la
 *     cifra verificada puesta en una forma que se juzga de un vistazo.
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

type Modo = "todo" | "lluvia" | "mesas" | "camion";
type Zona = "jardin" | "tiki" | "cabanas" | "acceso" | "edificio";
/** pendiente → dibujar (corre la secuencia) → listo (los rótulos entran).
 *  quieto: sin JS útil o con movimiento reducido, todo visible desde el principio. */
type Fase = "pendiente" | "dibujar" | "listo" | "quieto";
type Pt = [number, number];

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
const U = 2.3; // unidades por pie

const TINTA = "#211c15", GRIS = "#8a8071", OCRE = "#c4772b", PAPEL = "#fbf8f1";

/** Las palmeras solo donde están de verdad: dos hileras flanqueando el paseo. */
const PALMERAS_N: Pt[] = Array.from({ length: 8 }, (_, i) => [82 + i * 22, 62]);
const PALMERAS_S: Pt[] = [[30, 81], [56, 81], ...Array.from({ length: 7 }, (_, i): Pt => [104 + i * 18, 81])];

/** Treinta mesas de diez: los ~300 sentados verificados, a escala real. */
const MESAS: Pt[] = [];
for (let f = 0; f < 3; f++) for (let c = 0; c < 10; c++) MESAS.push([90 + c * 15, 15 + f * 16]);

const GENTE: Pt[] = [[128, 44], [206, 28], [150, 74], [62, 74], [230, 62]];

/** Pseudoaleatorio determinista: el servidor y el navegador tienen que
 *  dibujar exactamente las mismas gotas, o React se queja de la hidratación. */
function lcg(semilla: number) {
  let s = semilla >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const poly = (...q: Pt[]) =>
  q.map((c, i) => `${i ? "L" : "M"}${c[0].toFixed(1)},${c[1].toFixed(1)}`).join(" ") + " Z";

const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

const cssVars = (o: Record<string, string | number>) => o as CSSProperties;

// ── piezas del dibujo ──────────────────────────────────────────────────────

/** Prisma con las dos caras visibles y la tapa. Las caras de atrás no se
 *  dibujan: en esta vista fija nunca se ven. */
function Caja({ g, x, y, dx, dy, z0 = 0, z1, tapa, izq, der, borde = TINTA, w = 0.9, clase = "" }: {
  g: Geo; x: number; y: number; dx: number; dy: number; z0?: number; z1: number;
  tapa: string; izq: string; der: string; borde?: string; w?: number; clase?: string;
}) {
  const { techo, frente, lado } = g;
  return (
    <g className={clase}>
      <path className="rl tz" d={frente(x, y + dy, dx, z0, z1)} fill={izq} stroke={borde} strokeWidth={w} pathLength={1} />
      <path className="rl tz" d={lado(x + dx, y, dy, z0, z1)} fill={der} stroke={borde} strokeWidth={w} pathLength={1} />
      <path className="rl tz" d={techo(x, y, dx, dy, z1)} fill={tapa} stroke={borde} strokeWidth={w} pathLength={1} />
    </g>
  );
}

function Seto({ g, x, y, dx, dy }: { g: Geo; x: number; y: number; dx: number; dy: number }) {
  return <Caja g={g} x={x} y={y} dx={dx} dy={dy} z1={SETO.alto} tapa="#d3cdb8" izq="#c4bda7" der="#b9b19b" borde={GRIS} w={0.6} />;
}

function Palma({ g, x, y, alto = 17 }: { g: Geo; x: number; y: number; alto?: number }) {
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
    intro: "Así es el recinto visto desde el aire. Toca cada zona para saber qué es, y prueba las tres preguntas que siempre hacen los productores.",
    aria: "Isométrica del recinto: un jardín rectangular con setos perimetrales, un paseo pavimentado de extremo a extremo, una palapa techada en una esquina, dos hileras de palmeras y ocho cabañas en el borde opuesto. Al lado, el edificio de dos niveles.",
    /**
     * Nombres de capa, no preguntas. Las preguntas las hace el recorrido
     * guiado, que además las contesta: tener las mismas dos veces, una como
     * botón mudo y otra como capítulo narrado, obliga a la persona a descubrir
     * por prueba y error cuál de las dos hace qué.
     */
    modos: { todo: "Ver todo", lluvia: "Con lluvia", mesas: "Con mesas", camion: "Con camión" } as Record<Modo, string>,
    explica: {
      todo: "Lo techado va en tinta y lo abierto en claro. El paseo cruza el recinto de lado a lado y es por donde entra todo.",
      lluvia: "La palapa cubre ~4 000 ft² con techo de paja, abierta por los cuatro costados: para el sol y el agua que cae recta. Lo demás queda al aire, y para un evento de invierno conviene carpa lateral.",
      mesas: "Treinta mesas de diez, dibujadas a la misma escala que el recinto: son los ~300 sentados verificados, y sobra pasillo entre mesas.",
      camion: "Por NW 1st Ct al paseo pavimentado, continuo y a nivel: un camión de 40 ft llega hasta el fondo sin pisar césped.",
    } as Record<Modo, string>,
    zonas: {
      jardin: { nombre: "El Jardín", dato: "~18 000 ft² · al aire libre", lee: "Paseo pavimentado central, césped artificial a los lados, dos hileras de palmeras reales y setos perimetrales." },
      tiki: { nombre: "El Tiki Hut", dato: "~4 000 ft² · techado", lee: "Palapa de paja a cuatro aguas sobre postes de madera, abierta por los cuatro costados. Es el plan de lluvia." },
      cabanas: { nombre: "Ocho cabañas", dato: "amuebladas · en hilera", lee: "Van con el predio y quedan en el borde opuesto al paseo, entre las palmeras." },
      acceso: { nombre: "Acceso", dato: "NW 1st Ct · al paseo", lee: "La producción entra directo al paseo pavimentado, que es continuo y a nivel hasta el fondo." },
      edificio: { nombre: "El edificio", dato: "zona 02 · 2 niveles", lee: "El cascarón se alquila aparte y tiene su propia lámina, con 22 ft libres en la doble altura. Lo que hay montado hoy dentro no forma parte." },
    } as Record<Zona, { nombre: string; dato: string; lee: string }>,
    cajetin: ["Club Wynwood", "El recinto · zona 01", "Vista noreste · sin escala"],
    escala: "50 ft",
    nota: "Esquema volumétrico, sin escala: las medidas salen de los pies cuadrados declarados y de la foto aérea, y se confirman en la visita técnica. Lo techado se dibuja en tinta y lo abierto en claro.",
  },
  en: {
    ojo: "The land, in one drawing",
    titulo: "A 240-foot garden, with a roof in one corner.",
    intro: "This is the site seen from the air. Tap each zone to see what it is, and try the three questions producers always ask.",
    aria: "Isometric of the site: a rectangular garden with perimeter hedges, a paved walk running end to end, a thatched structure in one corner, two rows of palms and eight cabanas along the far edge. Next to it, the two-level building.",
    /** Layer names, not questions. The tour asks and answers those. */
    modos: { todo: "Everything", lluvia: "With rain", mesas: "With tables", camion: "With a truck" } as Record<Modo, string>,
    explica: {
      todo: "Roofed volumes are drawn in ink, open ground in light tone. The walk crosses the site end to end, and it is how everything gets in.",
      lluvia: "The structure covers ~4,000 sq ft under thatch, open on all four sides: it stops sun and vertical rain. The rest stays open-air, and a winter event should budget for side tenting.",
      mesas: "Thirty tables of ten, drawn at the same scale as the site: these are the verified ~300 seated, with room to move between tables.",
      camion: "From NW 1st Ct onto the paved walk, continuous and level: a 40 ft truck reaches the far end without crossing turf.",
    } as Record<Modo, string>,
    zonas: {
      jardin: { nombre: "The Garden", dato: "~18,000 sq ft · open air", lee: "A central paved walk, artificial turf on both sides, two rows of real palms and perimeter hedges." },
      tiki: { nombre: "The Tiki Hut", dato: "~4,000 sq ft · covered", lee: "Four-hip thatch structure on timber posts, open on all four sides. It is the rain plan." },
      cabanas: { nombre: "Eight cabanas", dato: "furnished · in a row", lee: "They come with the site and line the edge opposite the walk, between the palms." },
      acceso: { nombre: "Access", dato: "NW 1st Ct · onto the walk", lee: "Production drives straight onto the paved walk, continuous and level to the far end." },
      edificio: { nombre: "The building", dato: "zone 02 · 2 levels", lee: "The shell is rented separately and has its own plate, with 22 ft clear in the double-height zone. Whatever is installed inside today is not part of it." },
    } as Record<Zona, { nombre: string; dato: string; lee: string }>,
    cajetin: ["Club Wynwood", "The site · zone 01", "North-east view · not to scale"],
    escala: "50 ft",
    nota: "Volumetric diagram, not to scale: dimensions come from the declared square footage and the aerial photograph, and are confirmed at the technical visit. Roofed volumes in ink, open ground in light tone.",
  },
} as const;

const ORDEN_ZONAS: Zona[] = ["jardin", "tiki", "cabanas", "acceso", "edificio"];

// ── la lámina ──────────────────────────────────────────────────────────────

/**
 * El dibujo se puede DIRIGIR desde fuera, sin perder su control manual.
 *
 * Lo usa el recorrido guiado (`components/Recorrido.tsx`): mientras la voz
 * narra, es el guion quien decide qué modo y qué zona se ven. En cuanto la
 * persona toca un botón, `onManual` avisa, el recorrido se para y el dibujo
 * vuelve a su estado interno.
 *
 * Las tres props son opcionales a propósito: sin ninguna, esto es exactamente
 * lo que era antes y funciona igual. Un componente que solo sirve acompañado de
 * otro es un componente que se rompe cuando alguien lo usa suelto.
 */
export default function LaminaRecinto({
  lang,
  modoDirigido,
  zonaDirigida,
  puntoDirigido,
  rotuloPunto,
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
   * El guion del recorrido las trae desde el primer día y no se estaban usando:
   * cada frase dice a qué parte del recinto se refiere. Sin esto, la voz habla
   * del acceso mientras el dibujo entero se queda igual, y la persona tiene que
   * adivinar de qué le están hablando. Con esto, una marca camina hasta ahí.
   */
  puntoDirigido?: [number, number] | null;
  rotuloPunto?: string;
  onManual?: () => void;
  panel?: React.ReactNode;
}) {
  const t = T[lang];
  const [modoLocal, setModo] = useState<Modo>("todo");
  const [zonaLocal, setZona] = useState<Zona | null>(null);
  const [fase, setFase] = useState<Fase>("pendiente");
  const raiz = useRef<HTMLDivElement>(null);

  // Lo que manda mientras el recorrido está en marcha. `undefined` significa
  // que nadie dirige; `null` en la zona sí dirige, y quiere decir «ninguna».
  const modo = modoDirigido ?? modoLocal;
  const zona = zonaDirigida !== undefined ? zonaDirigida : zonaLocal;

  // Se dibuja al entrar en pantalla, una vez. Sin JavaScript, sin
  // IntersectionObserver o con movimiento reducido: se ve entero y quieto.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      setFase("quieto");
      return;
    }
    const el = raiz.current;
    if (!el) return;
    let temporizador: ReturnType<typeof setTimeout> | null = null;
    const io = new IntersectionObserver((entradas) => {
      if (!entradas.some((e) => e.isIntersecting)) return;
      setFase("dibujar");
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

  function elegirModo(m: Modo) {
    // Tocar un botón devuelve el mando: el recorrido se para y el dibujo pasa a
    // obedecer a la persona. Seguir narrando encima sería pelearse con ella.
    onManual?.();
    setModo(m);
    if (m !== "todo") ev("toggle_layer", { layer: m });
  }

  function tocarZona(z: Zona) {
    onManual?.();
    setZona((actual) => (actual === z ? null : z));
    ev("select_zone", { zone: z });
  }

  const g = crearGeo(U, 0, 0, 0);
  const { p, techo } = g;

  // Encuadre calculado a partir de la caja real de la proyección, con margen
  // a medida: a la izquierda cabe el acceso, abajo la cota y la escala.
  const base = g.caja(TOTAL_X, LOTE.dy, H_CUMBRE, 0);
  const VB = { x: base.x - 78, y: base.y - 44, w: base.w + 78 + 36, h: base.h + 44 + 54 };
  const pct = (q: Pt): { left: string; top: string } => ({
    left: `${(((q[0] - VB.x) / VB.w) * 100).toFixed(2)}%`,
    top: `${(((q[1] - VB.y) / VB.h) * 100).toFixed(2)}%`,
  });

  // Los rótulos: ancla en el objeto, chip fuera del dibujo, línea de guía
  // entre los dos. Mismo orden que la lista de abajo: el número del chip y el
  // de la lista tienen que ser el mismo, o el dibujo y el texto se contradicen.
  const cxP = PALAPA.x + PALAPA.dx / 2, cyP = PALAPA.y + PALAPA.dy / 2;
  const rotulo = (zona: Zona, ancla: Pt, dx: number, dy: number, lado: "" | "der" = "", vert: "" | "inf" = "") =>
    ({ zona, ancla, fin: [ancla[0] + dx, ancla[1] + dy] as Pt, lado, vert });
  const ROTULOS = [
    rotulo("jardin", p(196, 14, 0), 34, -62),
    rotulo("tiki", p(cxP, cyP, H_CUMBRE), 44, -52),
    rotulo("cabanas", p(160, 85.5, CABANAS.h), -30, 62, "der", "inf"),
    rotulo("acceso", p(-14, 74, 0), -20, -46),
    rotulo("edificio", p(EDIF.x + EDIF.corte + 20, 36, EDIF.h2), 14, -64, "der"),
  ];

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

  /**
   * `recorriendo` cambia la maqueta mientras narra, y esa es la diferencia
   * entre entenderlo y no.
   *
   * El dibujo es muy ancho, así que a pantalla completa ocupa casi todo el alto
   * y el texto de lo que se está diciendo queda fuera de la vista. La persona
   * tiene que elegir entre ver el dibujo o leer lo que le cuentan, que es
   * exactamente lo que un recorrido guiado no debe pedir.
   *
   * Con la clase puesta, el dibujo se limita en alto y los dos caben juntos.
   */
  const dirigiendo = modoDirigido !== undefined;

  // «listo» conserva «dibujar»: los trazos ya animados se quedan como están.
  const clase = `lam ${fase === "listo" ? "dibujar listo" : fase}${zona ? " enfocado" : ""}${dirigiendo ? " recorriendo" : ""}`;
  const zClase = (z: Zona) => `z z-${z}${zona === z ? " activa" : ""}`;
  const zProps = (z: Zona) => ({
    onMouseEnter: () => setZona(z),
    onMouseLeave: () => setZona((a) => (a === z ? null : a)),
    onClick: () => tocarZona(z),
  });

  return (
    <section id="terreno" aria-label={t.ojo} style={{ background: "var(--papel-2)", borderBottom: "1px solid var(--regla)" }}>
      <div className="reja" style={{ paddingBlock: "64px 64px" }}>
        <div ref={raiz} className={clase} data-modo={modo}>
          <noscript>
            <style>{`.lam.pendiente .tz{stroke-dashoffset:0}.lam.pendiente .rl{fill-opacity:1}.lam.pendiente .ap,.lam.pendiente .lam-etq,.lam.pendiente .lam-cajetin{opacity:1}`}</style>
          </noscript>

          <div className="ojo" style={{ paddingBottom: 18 }}>{t.ojo}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "12px 44px", alignItems: "end", paddingBottom: 22 }}>
            <h2 style={{ maxWidth: "16ch" }}>{t.titulo}</h2>
            <p className="respuesta" style={{ margin: 0, color: "var(--texto)", maxWidth: "46ch" }}>{t.intro}</p>
          </div>

          <div className="lam-modos" role="group" aria-label={lang === "es" ? "Qué ver en el dibujo" : "What to show on the drawing"}>
            {(["todo", "lluvia", "mesas", "camion"] as Modo[]).map((m) => (
              <button key={m} type="button" className="lam-modo" aria-pressed={modo === m} onClick={() => elegirModo(m)}>
                {t.modos[m]}
              </button>
            ))}
          </div>
          <p className="lam-explica" aria-live="polite">{t.explica[modo]}</p>

          <figure className="lam-fig" style={{ aspectRatio: `${VB.w.toFixed(0)} / ${VB.h.toFixed(0)}` }}>
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

              {/* ── la palapa ────────────────────────────────────────────── */}
              <g className={zClase("tiki")} {...zProps("tiki")} style={cssVars({ "--d": ".6s" })}>
                <Palapa g={g} />
              </g>

              {/* ── las mesas (solo en su modo) ──────────────────────────── */}
              <g className="mesas" pointerEvents="none">
                {MESAS.map(([x, y], i) => <Mesa key={i} g={g} x={x} y={y} i={i} />)}
              </g>

              {/* ── palmeras del norte y gente ───────────────────────────── */}
              <g style={cssVars({ "--d": "1s" })}>
                {PALMERAS_N.map(([x, y]) => <Palma key={`n${x}`} g={g} x={x} y={y} />)}
                {GENTE.map(([x, y]) => <Persona key={`g${x}`} g={g} x={x} y={y} />)}
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
                    <line x1={r.ancla[0]} y1={r.ancla[1]} x2={r.fin[0]} y2={r.fin[1]} stroke={TINTA} strokeWidth="0.7" />
                    <circle cx={r.ancla[0]} cy={r.ancla[1]} r="2" fill={TINTA} />
                  </g>
                ))}
              </g>

              {/* ── la lluvia (solo en su modo) ──────────────────────────── */}
              <g className="lluvia" pointerEvents="none">
                {GOTAS.map((q, i) => (
                  <line key={i} className="gota" style={cssVars({ "--t": `${q.t}s` })}
                        x1={q.x.toFixed(1)} y1={q.y.toFixed(1)} x2={(q.x - 3.5).toFixed(1)} y2={(q.y + 10).toFixed(1)}
                        stroke={TINTA} strokeWidth="0.9" strokeLinecap="round" />
                ))}
              </g>
            </svg>

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
            {puntoDirigido && (
              <div className="lam-guia-punto" style={pct(p(puntoDirigido[0], puntoDirigido[1], 0))} aria-hidden="true">
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
                        onMouseEnter={() => setZona(r.zona)}
                        onMouseLeave={() => setZona((a) => (a === r.zona ? null : a))}
                        onClick={() => tocarZona(r.zona)}
                        aria-label={`${z.nombre} · ${z.dato}`}>
                  <span className="lam-etq-n">{i + 1}</span>
                  <span className="lam-etq-txt">
                    <span className="lam-etq-nombre">{z.nombre}</span>
                    <span className="lam-etq-dato">{z.dato}</span>
                  </span>
                </button>
              );
            })}
          </figure>

          {/* El recorrido guiado, si lo hay. Va DEBAJO del dibujo a propósito:
              lo que se narra pasa arriba, y los controles no deben taparlo. */}
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
                          onClick={() => tocarZona(zk)}>
                    <span className="lam-item-n" aria-hidden>{i + 1}</span>
                    <span>
                      <span className="lam-item-nombre">{z.nombre}</span>
                      <span className="lam-item-dato">{z.dato}</span>
                      <span className="lam-item-lee">{z.lee}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <p className="ojo" style={{ paddingTop: 18, lineHeight: 1.75, maxWidth: "78ch" }}>{t.nota}</p>
        </div>
      </div>
    </section>
  );
}

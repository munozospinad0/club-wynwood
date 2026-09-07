import type { Idioma } from "@/lib/i18n";
import {
  LOTE, EDIF, PUERTA, PASEO, PALAPA, PALAPA_POSTES, ARENA, PICNIC, CABANAS,
  CESPED_O, CESPED_E, PALMERAS_O, PALMERAS_E, PALMERAS_PALAPA, PARKING_E, PARKING_S,
  CALLE_O, CALLE_S, MESAS, CAMION,
} from "@/lib/recinto.geo";

/**
 * PLANTA — el recinto visto desde arriba, según el PLANO DEL SITIO.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * DE DÓNDE SALE, Y POR QUÉ CAMBIÓ
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Las dos plantas anteriores se dibujaron de los pies cuadrados declarados: un
 * rectángulo de 240 × 92 con la palapa en un extremo y el paseo cruzando de lado
 * a lado. Era otro sitio. El flyer de Newmark (LoopNet, «Site Plan & Photos»)
 * trae el plano de verdad, y dice otra cosa: lote de esquina (NW 1st Ct al
 * oeste, NW 21st Ct al sur), el edificio al norte, el paseo bajando de su
 * puerta hacia el sur, la palapa al suroeste, arena con picnic entre las dos,
 * ocho pérgolas al este del paseo y estacionamiento propio al este y al sur.
 *
 * La geometría vive en `lib/recinto.geo.ts` y es LA MISMA que usa el dibujo
 * en perspectiva y el recorrido. Aquí no se declara ni una medida: si el plano
 * se corrige en un sitio, se corrige en los dos.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * LO QUE SE MANTIENE DE LA VERSIÓN ANTERIOR
 * ─────────────────────────────────────────────────────────────────────────
 *
 * 1. EL SVG DIBUJA, EL HTML EXPLICA. Las respuestas van al lado, en HTML:
 *    escalan, se copian, se traducen y las cita un buscador de IA.
 * 2. EL AFORO SE DIBUJA, NO SE ENUNCIA. Las treinta mesas de diez van a escala
 *    real sobre el plano, en ocre porque no son el sitio: son la respuesta.
 *    El camión de 40 ft, igual, sobre el paseo.
 * 3. Lo techado, en tinta: tener techo es EL dato.
 *
 * Lo que NO se hace: inventar aforos por zona. El único aforo verificado es el
 * del conjunto (~600 de pie / ~300 sentados).
 */

const U = 2;                                     // píxeles por pie
const M = { izq: CALLE_O.dx * U + 14, der: 40, arr: 34, aba: CALLE_S.dy * U + 10 };
const VB = { w: LOTE.dx * U + M.izq + M.der, h: LOTE.dy * U + M.arr + M.aba };
const fx = (ft: number) => M.izq + ft * U;
const fy = (ft: number) => M.arr + ft * U;

const TINTA = "#211c15";
const GRIS = "#8a8071";
const PAPEL = "#f6f3ea";
const OCRE = "#c4772b";
const CESPED = "#e6e3cf";
const ARENA_C = "#eee3cc";
const PAV = "#faf7f0";
const ASFALTO = "#e7e2d8";
const CALLE = "#ddd6c9";
const MONO = "ui-monospace,monospace";

export default function LaminaPlanta({ lang }: { lang: Idioma }) {
  const es = lang === "es";

  /** Cota con flechas. En gris y fina: es referencia, no protagonista. */
  const Cota = ({ x1, y1, x2, y2, txt, vertical = false, arriba = false }:
    { x1: number; y1: number; x2: number; y2: number; txt: string; vertical?: boolean; arriba?: boolean }) => (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={GRIS} strokeWidth="0.7" />
      {vertical ? (
        <>
          <path d={`M${x1 - 3},${y1 + 5} L${x1},${y1} L${x1 + 3},${y1 + 5}`} fill="none" stroke={GRIS} strokeWidth="0.7" />
          <path d={`M${x2 - 3},${y2 - 5} L${x2},${y2} L${x2 + 3},${y2 - 5}`} fill="none" stroke={GRIS} strokeWidth="0.7" />
          <text transform={`translate(${x1 + 10},${(y1 + y2) / 2}) rotate(90)`} fill={GRIS} textAnchor="middle"
                fontFamily={MONO} fontSize="8.5" letterSpacing="1.2">{txt}</text>
        </>
      ) : (
        <>
          <path d={`M${x1 + 5},${y1 - 3} L${x1},${y1} L${x1 + 5},${y1 + 3}`} fill="none" stroke={GRIS} strokeWidth="0.7" />
          <path d={`M${x2 - 5},${y2 - 3} L${x2},${y2} L${x2 - 5},${y2 + 3}`} fill="none" stroke={GRIS} strokeWidth="0.7" />
          <text x={(x1 + x2) / 2} y={arriba ? y1 - 6 : y1 + 12} fill={GRIS} textAnchor="middle"
                fontFamily={MONO} fontSize="8.5" letterSpacing="1.2">{txt}</text>
        </>
      )}
    </g>
  );

  /** Etiqueta de zona, dentro del dibujo. Sin caja: la caja añade ruido. */
  const Zona = ({ x, y, txt, sub, claro = false, ancla = "middle" }:
    { x: number; y: number; txt: string; sub?: string; claro?: boolean; ancla?: "middle" | "start" | "end" }) => (
    <g textAnchor={ancla}>
      <text x={x} y={y} fill={claro ? PAPEL : TINTA} fontFamily={MONO} fontSize="9.5" letterSpacing="1.8">{txt}</text>
      {sub && (
        <text x={x} y={y + 11} fill={claro ? PAPEL : GRIS} fontFamily={MONO} fontSize="7.2" letterSpacing="1"
              opacity={claro ? 0.85 : 1}>{sub}</text>
      )}
    </g>
  );

  /** Una palmera en planta, como en el dibujo en perspectiva: copa de ocho frondas en verde oliva y el tronco como punto. */
  const Palma = ({ x, y }: { x: number; y: number }) => (
    <g>
      <circle cx={x} cy={y} r="6.5" fill="#6a7752" opacity="0.14" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <path key={a} d={`M${x},${y} q3.4,-1.5 6.8,0 q-3.4,1.5 -6.8,0 Z`} transform={`rotate(${a} ${x} ${y})`} fill={a % 90 ? "#6a7752" : "#4f5a3e"} opacity="0.85" />
      ))}
      <circle cx={x} cy={y} r="0.9" fill="#4a4337" />
    </g>
  );

  const plazasE = Array.from({ length: PARKING_E.plazas + 1 }, (_, i) => PARKING_E.y + 6 + i * ((PARKING_E.dy - 12) / PARKING_E.plazas));
  const plazasS = Array.from({ length: PARKING_S.plazas + 1 }, (_, i) => PARKING_S.x + 4 + i * ((PARKING_S.dx - 8) / PARKING_S.plazas));

  return (
    <section aria-label={es ? "Planta del recinto" : "Site plan"}>
      <div className="reja" style={{ paddingBlock: "34px 56px" }}>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap",
                      paddingBottom: 14, borderBottom: "1px solid var(--regla)" }}>
          <div className="ojo" style={{ color: "var(--tinta-2)" }}>
            {es ? "Planta — el recinto visto desde arriba" : "Plan — the site seen from above"}
          </div>
          <div className="ojo">
            {es ? "Norte arriba · según el plano del sitio · lo techado, en tinta" : "North up · from the site plan · what has a roof, in ink"}
          </div>
        </div>

        <div style={{ display: "grid", gap: "28px 40px", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                      alignItems: "start", marginTop: 26 }}>

          <figure style={{ margin: 0 }}>
            <svg viewBox={`0 0 ${VB.w.toFixed(0)} ${VB.h.toFixed(0)}`} role="img"
                 aria-label={es
                   ? "Planta del recinto, norte arriba. Lote de esquina entre NW 1st Court al oeste y NW 21st Court al sur, de unos 150 por 265 pies. El edificio del operador ocupa el norte; de su puerta baja hacia el sur un paseo pavimentado de unos 105 pies con palmeras a los dos lados. Al oeste del paseo y pegada al edificio, la palapa techada de 54 por 54 pies, con el jardín abierto al sur. Al este del paseo, junto a la puerta, un área de arena con mesas de picnic; después, ocho cabañas en hilera y, más allá, el estacionamiento. Otra franja de estacionamiento cierra el sur, sobre NW 21st Court, por donde entra la producción."
                   : "Site plan, north up. Corner lot between NW 1st Court to the west and NW 21st Court to the south, about 150 by 265 feet. The operator's building takes the north; from its door a paved walk of about 105 feet runs south with palms on both sides. West of the walk and right next to the building, the 54 by 54 foot thatched structure, with the open garden south of it. East of the walk, by the door, a sand area with picnic tables; then eight cabanas in a row and, beyond them, parking. Another parking strip closes the south on NW 21st Court, where production comes in."}
                 style={{ width: "100%", height: "auto", maxHeight: "80vh", display: "block" }}>

              <defs>
                <pattern id="planta-edif" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="6" stroke="#cfc7b8" strokeWidth="0.7" />
                </pattern>
              </defs>

              {/* ---------- las calles ---------- */}
              <rect x={fx(CALLE_O.x)} y={fy(0)} width={CALLE_O.dx * U} height={(LOTE.dy + CALLE_S.dy) * U} fill={CALLE} />
              <rect x={fx(CALLE_O.x)} y={fy(CALLE_S.y)} width={(CALLE_O.dx + LOTE.dx + 14) * U} height={CALLE_S.dy * U} fill={CALLE} />
              <text transform={`translate(${fx(CALLE_O.x + CALLE_O.dx / 2) + 3},${fy(150)}) rotate(-90)`} fill={GRIS} textAnchor="middle"
                    fontFamily={MONO} fontSize="8" letterSpacing="1.6">NW 1ST CT</text>
              <text x={fx(0)} y={fy(CALLE_S.y + 16)} fill={GRIS}
                    fontFamily={MONO} fontSize="8" letterSpacing="1.6">NW 21ST CT</text>

              {/* ---------- el lote ---------- */}
              <rect x={fx(0)} y={fy(0)} width={LOTE.dx * U} height={LOTE.dy * U} fill={PAPEL} stroke="#c6beb0" strokeWidth="1" />

              {/* ---------- el edificio: del operador, rayado y en claro ---------- */}
              <rect x={fx(EDIF.x)} y={fy(EDIF.y)} width={EDIF.dx * U} height={EDIF.dy * U} fill="#f1ede4" stroke={TINTA} strokeWidth="0.9" />
              <rect x={fx(EDIF.x)} y={fy(EDIF.y)} width={EDIF.dx * U} height={EDIF.dy * U} fill="url(#planta-edif)" />
              <rect x={fx(PUERTA.x)} y={fy(EDIF.dy) - 2} width={PUERTA.dx * U} height="4" fill={PAPEL} stroke={TINTA} strokeWidth="0.9" />

              {/* ---------- césped, arena, estacionamiento ---------- */}
              <rect x={fx(CESPED_O.x)} y={fy(CESPED_O.y)} width={CESPED_O.dx * U} height={CESPED_O.dy * U} fill={CESPED} />
              <rect x={fx(CESPED_E.x)} y={fy(CESPED_E.y)} width={CESPED_E.dx * U} height={CESPED_E.dy * U} fill={CESPED} />
              <rect x={fx(ARENA.x)} y={fy(ARENA.y)} width={ARENA.dx * U} height={ARENA.dy * U} fill={ARENA_C} stroke="#d8cdb4" strokeWidth="0.6" />

              <rect x={fx(PARKING_E.x)} y={fy(PARKING_E.y)} width={PARKING_E.dx * U} height={PARKING_E.dy * U} fill={ASFALTO} stroke="#cfc7b8" strokeWidth="0.6" />
              {plazasE.map((y, i) => (
                <line key={`pe${i}`} x1={fx(PARKING_E.x + PARKING_E.dx - 18)} y1={fy(y)} x2={fx(PARKING_E.x + PARKING_E.dx)} y2={fy(y)} stroke="#c4bcae" strokeWidth="0.6" />
              ))}
              <rect x={fx(PARKING_S.x)} y={fy(PARKING_S.y)} width={PARKING_S.dx * U} height={PARKING_S.dy * U} fill={ASFALTO} stroke="#cfc7b8" strokeWidth="0.6" />
              {plazasS.map((x, i) => (
                <line key={`ps${i}`} x1={fx(x)} y1={fy(PARKING_S.y + 4)} x2={fx(x)} y2={fy(PARKING_S.y + PARKING_S.dy)} stroke="#c4bcae" strokeWidth="0.6" />
              ))}
              {/* coches en las mismas plazas que el dibujo en perspectiva */}
              {plazasE.slice(0, -1).map((y, i) => {
                if (i % 3 === 1) return null;
                const alto = (PARKING_E.dy - 12) / PARKING_E.plazas, y0 = y + (alto - 6.5) / 2;
                return (
                  <g key={`ce${i}`}>
                    <rect x={fx(PARKING_E.x + 7)} y={fy(y0)} width={16 * U} height={6.5 * U} rx="2" fill="#d9d3c6" stroke={TINTA} strokeWidth="0.45" />
                    <rect x={fx(PARKING_E.x + 7 + 4.8)} y={fy(y0 + 0.55)} width={8.8 * U} height={5.4 * U} rx="1.2" fill="#b9b3a7" opacity="0.6" />
                  </g>
                );
              })}
              {plazasS.slice(0, -1).map((x, i) => {
                const ancho = (PARKING_S.dx - 8) / PARKING_S.plazas;
                if ((i * 5) % 4 === 2 || (x + ancho > PASEO.x - 12 && x < PASEO.x + PASEO.dx + 6)) return null;
                return (
                  <g key={`cs${i}`}>
                    <rect x={fx(x + (ancho - 6.5) / 2)} y={fy(PARKING_S.y + 3)} width={6.5 * U} height={16 * U} rx="2" fill="#d9d3c6" stroke={TINTA} strokeWidth="0.45" />
                    <rect x={fx(x + (ancho - 6.5) / 2 + 0.55)} y={fy(PARKING_S.y + 3 + 4.8)} width={5.4 * U} height={8.8 * U} rx="1.2" fill="#b9b3a7" opacity="0.6" />
                  </g>
                );
              })}

              {/* ---------- el paseo: la espina, y también el acceso de carga ---------- */}
              <rect x={fx(PASEO.x)} y={fy(PASEO.y0)} width={PASEO.dx * U} height={(PASEO.y1 - PASEO.y0) * U}
                    fill={PAV} stroke="#c6beb0" strokeWidth="0.8" />
              {Array.from({ length: 10 }, (_, i) => (
                <line key={i} x1={fx(PASEO.x)} y1={fy(PASEO.y0 + 12 * (i + 1))} x2={fx(PASEO.x + PASEO.dx)} y2={fy(PASEO.y0 + 12 * (i + 1))}
                      stroke="#d8d0c0" strokeWidth="0.6" />
              ))}

              {/* ---------- setos: NW 1st Ct y el borde sur del césped ---------- */}
              <rect x={fx(0)} y={fy(CESPED_O.y)} width={3 * U} height={(PARKING_S.y - CESPED_O.y) * U} fill="#b9b79a" />
              <rect x={fx(0)} y={fy(PARKING_S.y - 3)} width={(PASEO.x - 2) * U} height={3 * U} fill="#b9b79a" />
              <rect x={fx(PASEO.x + PASEO.dx + 2)} y={fy(PARKING_S.y - 3)} width={(PARKING_E.x - PASEO.x - PASEO.dx - 4) * U} height={3 * U} fill="#b9b79a" />

              {/* ---------- picnic sobre la arena ---------- */}
              {PICNIC.map(([x, y], i) => (
                <g key={`pic${i}`}>
                  <circle cx={fx(x)} cy={fy(y)} r={4.5 * U} fill="none" stroke="#c9bfa6" strokeWidth="0.6" strokeDasharray="1.5 1.5" />
                  <rect x={fx(x - 3)} y={fy(y - 1.5)} width={6 * U} height={3 * U} fill="#cdbf9f" stroke={TINTA} strokeWidth="0.5" />
                </g>
              ))}

              {/* ---------- la palapa: en tinta, porque tener techo es EL dato ---------- */}
              <rect x={fx(PALAPA.x) + 3} y={fy(PALAPA.y) + 3} width={PALAPA.dx * U} height={PALAPA.dy * U} fill={TINTA} opacity="0.1" />
              <rect x={fx(PALAPA.x)} y={fy(PALAPA.y)} width={PALAPA.dx * U} height={PALAPA.dy * U} fill="#5c5445" stroke={TINTA} strokeWidth="1.4" />
              {/* Sin limatesas: sobre un cuadrado son una X, y el ojo lee «anulado» antes que «techo».
                  Lo que dice «esto tiene techo» es la masa oscura y el alero. */}
              <rect x={fx(PALAPA.x) + 3.5} y={fy(PALAPA.y) + 3.5} width={PALAPA.dx * U - 7} height={PALAPA.dy * U - 7}
                    fill="none" stroke="#a89d88" strokeWidth="0.7" opacity="0.45" />
              {PALAPA_POSTES.map(([x, y], i) => (
                <circle key={`po${i}`} cx={fx(x)} cy={fy(y)} r="1.3" fill={PAPEL} opacity="0.8" />
              ))}

              {/* ---------- las cabañas ---------- */}
              {Array.from({ length: CABANAS.n }, (_, i) => {
                const cy0 = CABANAS.y0 + i * CABANAS.paso;
                return (
                  <g key={`cab${i}`}>
                    <rect x={fx(CABANAS.x)} y={fy(cy0)} width={CABANAS.dx * U} height={CABANAS.dy * U} fill="#e6dfd0" stroke={TINTA} strokeWidth="0.8" />
                    {[0.2, 0.4, 0.6, 0.8].map((f) => (
                      <line key={f} x1={fx(CABANAS.x + CABANAS.dx * f)} y1={fy(cy0)} x2={fx(CABANAS.x + CABANAS.dx * f)} y2={fy(cy0 + CABANAS.dy)} stroke={PAPEL} strokeWidth="0.7" opacity="0.9" />
                    ))}
                    {/* el sofá en L y la mesita, como en el dibujo */}
                    <rect x={fx(CABANAS.x + 1.5)} y={fy(cy0 + CABANAS.dy - 4)} width={(CABANAS.dx - 3) * U} height={2.4 * U} fill="#c9c0ad" stroke={GRIS} strokeWidth="0.4" />
                    <rect x={fx(CABANAS.x + 1.5)} y={fy(cy0 + 2)} width={2.4 * U} height={(CABANAS.dy - 6) * U} fill="#c9c0ad" stroke={GRIS} strokeWidth="0.4" />
                    <circle cx={fx(CABANAS.x + 6.5)} cy={fy(cy0 + 5)} r={1.3 * U} fill="#e9e3d6" stroke={GRIS} strokeWidth="0.4" />
                  </g>
                );
              })}

              {/* ---------- palmeras ---------- */}
              {[...PALMERAS_O, ...PALMERAS_E, ...PALMERAS_PALAPA].map(([x, y], i) => <Palma key={`pal${i}`} x={fx(x)} y={fy(y)} />)}

              {/* ══════════ EL AFORO, DIBUJADO ══════════
                   Treinta mesas de diez = los ~300 sentados verificados, a la
                   misma escala que el recinto y en los mismos puntos que el
                   dibujo en perspectiva. Van en ocre porque no son el sitio:
                   son la respuesta. */}
              {MESAS.map(([x, y], i) => (
                <g key={`m${i}`}>
                  {Array.from({ length: 10 }, (_, k) => {
                    const an = (k / 10) * Math.PI * 2;
                    return <circle key={k} cx={(fx(x) + Math.cos(an) * 4.6 * U).toFixed(1)} cy={(fy(y) + Math.sin(an) * 4.6 * U).toFixed(1)} r={0.85 * U} fill={OCRE} opacity="0.75" />;
                  })}
                  <circle cx={fx(x)} cy={fy(y)} r={2.6 * U} fill={PAPEL} stroke={OCRE} strokeWidth="0.9" />
                  <circle cx={fx(x)} cy={fy(y)} r={0.6 * U} fill={OCRE} opacity="0.7" />
                </g>
              ))}

              {/* camión de 40 ft, a escala, entrando desde NW 21st Ct al estacionamiento sur:
                  la mitad ya dentro del lote, la otra mitad todavía en la calle */}
              <g>
                <rect x={fx(95)} y={fy(CALLE_S.y - 15)} width={CAMION.dx * U} height={CAMION.dy * U} rx="1.5"
                      fill={PAV} stroke={OCRE} strokeWidth="1.2" />
                <line x1={fx(95)} y1={fy(CALLE_S.y - 15 + 9)} x2={fx(95 + CAMION.dx)} y2={fy(CALLE_S.y - 15 + 9)}
                      stroke={OCRE} strokeWidth="1" />
                <text x={fx(95 + CAMION.dx) + 5} y={fy(CALLE_S.y + 16)} fill={OCRE} fontFamily={MONO} fontSize="6.8" letterSpacing="1">
                  {es ? "CAMIÓN 40 FT" : "40 FT TRUCK"}
                </text>
              </g>

              {/* ---------- acceso: desde NW 21st Ct, por el estacionamiento sur, al paseo ---------- */}
              <g>
                <path d={`M${fx(PASEO.x - 4)},${fy(LOTE.dy + 27)} L${fx(PASEO.x - 4)},${fy(PARKING_S.y + 4)}`}
                      stroke={TINTA} strokeWidth="1.5" />
                <path d={`M${fx(PASEO.x - 4) - 3.5},${fy(PARKING_S.y + 4) + 5} L${fx(PASEO.x - 4)},${fy(PARKING_S.y + 4)} L${fx(PASEO.x - 4) + 3.5},${fy(PARKING_S.y + 4) + 5}`}
                      fill="none" stroke={TINTA} strokeWidth="1.5" />
                <text x={fx(PASEO.x)} y={fy(CALLE_S.y + 16)} fill={TINTA} fontFamily={MONO} fontSize="8" letterSpacing="1.4">
                  {es ? "ACCESO" : "ACCESS"}
                </text>
              </g>

              {/* ---------- etiquetas ---------- */}
              <Zona x={fx(EDIF.x + EDIF.dx / 2)} y={fy(EDIF.dy / 2) - 2}
                    txt={es ? "EDIFICIO" : "BUILDING"}
                    sub={es ? "DEL OPERADOR · 2 NIVELES · SE ALQUILA APARTE" : "OPERATOR'S · 2 LEVELS · LEASED SEPARATELY"} />
              <Zona x={fx(PALAPA.x + PALAPA.dx / 2)} y={fy(PALAPA.y + PALAPA.dy / 2) - 1}
                    txt="TIKI HUT" sub={es ? "TECHADO · ~4 000 ft²" : "ROOFED · ~4,000 sq ft"} claro />
              <Zona x={fx(ARENA.x + ARENA.dx / 2)} y={fy(ARENA.y + 8)}
                    txt={es ? "ARENA · PICNIC" : "SAND · PICNIC"} />
              <Zona x={fx(6)} y={fy(PARKING_S.y - 6.5)} ancla="start" txt={es ? "EL JARDÍN" : "THE GARDEN"} />
              <text x={fx(CABANAS.x + CABANAS.dx + 3)} y={fy(CABANAS.y0 + 3.5 * CABANAS.paso)} fill={GRIS}
                    fontFamily={MONO} fontSize="7.2" letterSpacing="1.2">{es ? "8 CABAÑAS" : "8 CABANAS"}</text>
              <text transform={`translate(${fx(PARKING_E.x + PARKING_E.dx / 2 - 6)},${fy(PARKING_E.y + PARKING_E.dy / 2)}) rotate(-90)`}
                    fill={GRIS} textAnchor="middle" fontFamily={MONO} fontSize="7.2" letterSpacing="1.4">
                {es ? "ESTACIONAMIENTO" : "PARKING"}
              </text>
              <text x={fx(PARKING_S.x + 30)} y={fy(PARKING_S.y + PARKING_S.dy / 2) + 2.5} fill={GRIS}
                    fontFamily={MONO} fontSize="7.2" letterSpacing="1.4">{es ? "ESTACIONAMIENTO" : "PARKING"}</text>
              {/* el paseo, en el tramo libre entre la última mesa y el estacionamiento */}
              <text transform={`translate(${fx(PASEO.x + PASEO.dx / 2) + 2.5},${fy(214)}) rotate(-90)`}
                    fill={GRIS} textAnchor="middle" fontFamily={MONO} fontSize="6.8" letterSpacing="1.2">
                {es ? "PASEO" : "WALK"}
              </text>

              {/* ---------- cotas ---------- */}
              <Cota x1={fx(0)} y1={fy(0) - 14} x2={fx(LOTE.dx)} y2={fy(0) - 14} txt="≈ 150 FT · 46 M" arriba />
              <Cota x1={fx(LOTE.dx) + 12} y1={fy(0)} x2={fx(LOTE.dx) + 12} y2={fy(LOTE.dy)} txt="≈ 265 FT · 81 M" vertical />
              <Cota x1={fx(CALLE_O.x) - 6} y1={fy(PALAPA.y)} x2={fx(CALLE_O.x) - 6} y2={fy(PALAPA.y + PALAPA.dy)} txt="≈ 54 FT" vertical />

              {/* norte */}
              <g transform={`translate(${VB.w - 16},${M.arr + 22})`}>
                <path d="M0,14 L0,-10 M-3,-4 L0,-11 L3,-4" fill="none" stroke={TINTA} strokeWidth="1" />
                <text x="-2.5" y="25" fontFamily={MONO} fontSize="8" fill={GRIS}>N</text>
              </g>
            </svg>
            {/* La línea que hace que el dibujo de las mesas signifique algo. En HTML,
                no dentro del SVG: se lee en el móvil y no pisa ninguna mesa. */}
            <figcaption className="ojo" style={{ paddingTop: 12, lineHeight: 1.7, maxWidth: "62ch" }}>
              <span style={{ color: OCRE }}>
                {es ? "○ 30 mesas de 10 = los ~300 sentados, a la misma escala que el recinto · camión de 40 ft entrando por NW 21st Ct."
                    : "○ 30 tables of 10 = the ~300 seated, at the same scale as the site · 40 ft truck coming in from NW 21st Ct."}
              </span>
              <br />
              {es ? "El jardín: ~18 000 ft² al aire libre · la palapa: ~4 000 ft² techados." : "The garden: ~18,000 sq ft open air · the structure: ~4,000 sq ft roofed."}
            </figcaption>
          </figure>

          {/* ────────────────────────────────────────────────────────────────
              LAS RESPUESTAS, EN HTML: las preguntas que hace de verdad quien
              está decidiendo si alquila, contestadas en el orden en que las hace.
             ──────────────────────────────────────────────────────────────── */}
          <dl style={{ margin: 0, display: "grid", gap: 0, gridTemplateColumns: "minmax(0,1fr)", borderTop: "1px solid var(--regla)" }}>
            {[
              {
                p: es ? "¿Cabe mi evento?" : "Will my event fit?",
                r: es
                  ? "Hasta ~600 personas de pie o ~300 sentadas en el recinto exterior completo. Por encima de eso no entra, y lo decimos antes de la visita para no hacerte perder el viaje."
                  : "Up to ~600 standing or ~300 seated across the whole outdoor site. Above that it does not fit, and we say so before the visit rather than waste your trip.",
              },
              {
                p: es ? "¿Y si llueve?" : "What if it rains?",
                r: es
                  ? "La palapa cubre ~4 000 ft² con techo de paja. Está abierta por los cuatro costados: protege del sol y del agua que cae recta, no del viento con lluvia. Para un evento de invierno conviene carpa lateral."
                  : "The structure covers ~4,000 sq ft under thatch. It is open on all four sides: it stops sun and vertical rain, not wind-driven rain. A winter event should budget for side tenting.",
              },
              {
                p: es ? "¿Por dónde entra la producción?" : "How does production get in?",
                r: es
                  ? "Por NW 21st Ct, al estacionamiento sur, y de ahí al paseo pavimentado que sube recto hasta la puerta del edificio: unos 105 ft continuos y a nivel. Un camión de 40 ft llega hasta el fondo sin pisar césped."
                  : "From NW 21st Ct into the south parking lot, then onto the paved walk that runs straight up to the building door: about 105 ft, continuous and level. A 40 ft truck reaches the far end without crossing turf.",
              },
              {
                p: es ? "¿Y el edificio?" : "What about the building?",
                r: es
                  ? "Se alquila aparte, como zona 02: abajo, un salón a doble altura con cocina y baños; arriba, un altillo con cuatro salas privadas. Lo que aquí se ofrece es el recinto exterior: el jardín, la palapa, las cabañas y el estacionamiento propio."
                  : "Rented separately, as zone 02: downstairs, a double-height hall with a kitchen and restrooms; upstairs, a mezzanine with four private rooms. What is offered here is the outdoor site: the garden, the thatched structure, the cabanas and the on-site parking.",
              },
              {
                p: es ? "¿Qué NO hay al aire libre?" : "What is NOT outdoors?",
                r: es
                  ? "Cocina: el catering monta en el sitio, o usa la del edificio si lo alquilas también. Tampoco hay cerramiento perimetral fijo ni climatización: es un recinto al aire libre, y en Miami eso decide la fecha más que ninguna otra cosa."
                  : "A kitchen: catering sets up on site, or uses the building's kitchen if you rent it as well. No fixed perimeter enclosure and no climate control either: this is an open-air site, and in Miami that drives the date more than anything else.",
              },
            ].map(({ p, r }) => (
              <div key={p} style={{ padding: "18px 20px 20px 0", borderBottom: "1px solid var(--regla)" }}>
                <dt style={{ font: "600 15px/1.35 var(--display), Georgia, serif", color: "var(--tinta)", paddingBottom: 7 }}>{p}</dt>
                <dd style={{ margin: 0, font: "400 13.5px/1.65 var(--texto-f), system-ui, sans-serif", color: "var(--texto)", maxWidth: "46ch" }}>{r}</dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="ojo" style={{ paddingTop: 18, lineHeight: 1.75, maxWidth: "78ch" }}>
          {es
            ? "Según el plano del sitio del propietario; medidas aproximadas, se confirman en la visita técnica."
            : "From the owner's site plan; approximate dimensions, confirmed at the technical visit."}
        </p>
      </div>
    </section>
  );
}

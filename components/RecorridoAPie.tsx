"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Idioma } from "@/lib/i18n";
import { foto as fotoDe, RECORRIDO_A_PIE, ROTULO_VISUALIZACION, type Foto } from "@/lib/fotos";
import { ANCHO, optimizada } from "@/lib/imagen";
import { ev } from "@/lib/medicion";
import { CABANAS, EDIF, LOTE, PALAPA, PARKING_E, PARKING_S, PASEO, PUERTA } from "@/lib/recinto.geo";
import { Contraer, Expandir, FlechaDer, FlechaIzq } from "./Iconos";

/**
 * RECORRIDO A PIE (10-nov-2026).
 *
 * Lo más parecido a un tour virtual que permiten fotos planas: una foto a pantalla completa por paso,
 * en el orden en que alguien conoce el lugar llegando en coche, y un plano mínimo en la esquina con un
 * punto que dice dónde está parado y un abanico hacia dónde mira. Un tour 360 de verdad necesita una
 * cámara 360 o un escaneo; esto es lo que se puede hacer bien con la sesión de noviembre.
 *
 * Es liviano a propósito: no carga el SVG ni el audio del modo cine (`Recorrido.tsx`). Solo la foto del
 * paso, y la siguiente y la anterior precargadas para que pasar no deje la pantalla en blanco.
 *
 * Mandos: flechas del teclado (con el recorrido enfocado o a pantalla completa), deslizar en el móvil,
 * los botones, y la regla de pasos abajo para saltar. «Pantalla completa» es una capa fija por CSS y no
 * la Fullscreen API: el iPhone no la admite sobre un elemento, y Esc la cierra igual.
 *
 * El plano usa la geometría de `lib/recinto.geo.ts` (pies; x al este, y al sur) y los puntos de
 * `lib/fotos.ts`. Las fotos del interior no llevan punto: se marca el edificio entero.
 *
 * Mide: cada paso manda `view_plate` con `plate_name: "recorrido_a_pie"`, el número y la foto.
 */

const T = {
  es: {
    ojo: "Recorrido a pie",
    titulo: "Camina el lugar, de la calle al salón.",
    intro: "Desliza o usa las flechas. El plano de la esquina marca dónde estás parado y hacia dónde miras.",
    aria: "Recorrido a pie por el recinto",
    anterior: "Paso anterior",
    siguiente: "Paso siguiente",
    completa: "Ver a pantalla completa",
    salir: "Salir de pantalla completa",
    paso: "Paso",
    plano: "Plano del predio con tu posición",
    aparte: "Edificio · se alquila aparte",
  },
  en: {
    ojo: "Walk-through",
    titulo: "Walk the venue, from the street to the hall.",
    intro: "Swipe or use the arrows. The plan in the corner shows where you're standing and which way you're looking.",
    aria: "Walk-through of the venue",
    anterior: "Previous step",
    siguiente: "Next step",
    completa: "View full screen",
    salir: "Exit full screen",
    paso: "Step",
    plano: "Site plan with your position",
    aparte: "Building · rented separately",
  },
} as const;

const PASOS = RECORRIDO_A_PIE.map((p) => ({ ...p, f: fotoDe(p.foto) }));

/** Un solo ancho por pantalla (regla de `lib/imagen.ts`): lo que se precarga es lo que se muestra. */
function anchoParaPantalla() {
  if (typeof window === "undefined") return ANCHO.grande;
  return window.innerWidth * (window.devicePixelRatio || 1) > 1400 ? ANCHO.visor : ANCHO.grande;
}

export default function RecorridoAPie({ lang }: { lang: Idioma }) {
  const t = T[lang];
  const [i, setI] = useState(0);
  const [completa, setCompleta] = useState(false);
  const [ancho, setAncho] = useState<number>(ANCHO.grande);
  const escena = useRef<HTMLDivElement>(null);
  const toque = useRef<{ x: number; y: number } | null>(null);
  const visto = useRef(false);

  useEffect(() => setAncho(anchoParaPantalla()), []);

  const ir = useCallback((n: number) => setI(() => Math.max(0, Math.min(PASOS.length - 1, n))), []);
  const mover = useCallback((d: number) => setI((a) => Math.max(0, Math.min(PASOS.length - 1, a + d))), []);

  // Medición: el primer paso solo cuenta si alguien llegó a ver el recorrido (no al cargar la página).
  useEffect(() => {
    if (i === 0 && !visto.current) return;
    visto.current = true;
    ev("view_plate", { plate_name: "recorrido_a_pie", step: i + 1, photo: PASOS[i].f.id });
  }, [i]);

  // Precarga de vecinas.
  useEffect(() => {
    for (const d of [1, -1]) {
      const p = PASOS[i + d];
      if (!p) continue;
      const img = new Image();
      img.src = optimizada(p.f.src, ancho, 78);
    }
  }, [i, ancho]);

  // Pantalla completa: bloquea el scroll de la página y escucha el teclado en toda la ventana.
  useEffect(() => {
    if (!completa) return;
    const html = document.documentElement;
    const antes = html.style.overflow;
    html.style.overflow = "hidden";
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCompleta(false);
      else if (e.key === "ArrowRight") { e.preventDefault(); mover(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); mover(-1); }
    };
    window.addEventListener("keydown", tecla);
    escena.current?.focus();
    return () => {
      html.style.overflow = antes;
      window.removeEventListener("keydown", tecla);
    };
  }, [completa, mover]);

  const p = PASOS[i];
  const edificio = p.f.zona === "edificio";

  return (
    <section className="ap" aria-label={t.aria}>
      <div className="reja ap-cabeza">
        <p className="ojo">{t.ojo}</p>
        <h2>{t.titulo}</h2>
        <p className="ap-intro">{t.intro}</p>
      </div>

      <div
        ref={escena}
        className={`ap-escena${completa ? " ap-completa" : ""}`}
        tabIndex={0}
        role="region"
        aria-roledescription={lang === "es" ? "carrusel" : "carousel"}
        aria-label={t.aria}
        onKeyDown={(e) => {
          if (completa) return; // ya lo atiende la ventana
          if (e.key === "ArrowRight") { e.preventDefault(); mover(1); }
          else if (e.key === "ArrowLeft") { e.preventDefault(); mover(-1); }
        }}
        onTouchStart={(e) => { toque.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
        onTouchEnd={(e) => {
          const ini = toque.current;
          toque.current = null;
          if (!ini) return;
          const dx = e.changedTouches[0].clientX - ini.x;
          const dy = e.changedTouches[0].clientY - ini.y;
          if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) mover(dx < 0 ? 1 : -1);
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={p.f.id}
          className="ap-foto"
          src={optimizada(p.f.src, ancho, 78)}
          width={p.f.w}
          height={p.f.h}
          alt={p.f.alt[lang]}
          style={{ objectPosition: p.f.encuadre ?? "50% 50%" }}
          decoding="async"
          fetchPriority={i === 0 ? "high" : "auto"}
        />

        {p.f.tipo === "visualizacion" && <span className="ap-viz">{ROTULO_VISUALIZACION[lang]}</span>}

        <figure className="ap-plano" aria-label={t.plano}>
          <Plano f={p.f} />
        </figure>

        <div className="ap-texto" aria-live="polite">
          <p className="ap-n">
            {t.paso} {String(i + 1).padStart(2, "0")} / {String(PASOS.length).padStart(2, "0")}
            {edificio && <span> · {t.aparte}</span>}
          </p>
          <h3>{p.titulo[lang]}</h3>
          <p>{p.texto[lang]}</p>
        </div>

        <div className="ap-mandos">
          <button type="button" className="ap-icono" onClick={() => mover(-1)} disabled={i === 0} aria-label={t.anterior}><FlechaIzq /></button>
          <button type="button" className="ap-icono" onClick={() => mover(1)} disabled={i === PASOS.length - 1} aria-label={t.siguiente}><FlechaDer /></button>
          <button type="button" className="ap-icono" onClick={() => setCompleta((c) => !c)} aria-label={completa ? t.salir : t.completa} aria-pressed={completa}>
            {completa ? <Contraer /> : <Expandir />}
          </button>
        </div>

        <ol className="ap-regla">
          {PASOS.map((x, n) => (
            <li key={x.foto}>
              <button type="button" aria-label={`${t.paso} ${n + 1}: ${x.titulo[lang]}`} aria-current={n === i ? "step" : undefined} onClick={() => ir(n)} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/**
 * EL PLANO MÍNIMO. Lote, edificio, paseo, Pabellón, pérgolas y estacionamiento, a línea, en pies. Con
 * punto: un círculo ocre y un abanico de 60° hacia donde mira la cámara. Sin punto: si la foto es del
 * edificio se rellena el edificio; si es aérea, se marca el lote entero.
 */
function Plano({ f }: { f: Foto }) {
  const M = 14; // margen, en pies, para que el abanico no se corte en el borde
  const vb = `${-M - 18} ${-M} ${LOTE.dx + 2 * M + 18} ${LOTE.dy + 2 * M}`;
  const pt = f.punto;
  const abanico = (() => {
    if (!pt || pt.rumbo === undefined) return null;
    const r = 34, med = 30; // largo y medio ángulo
    const a = (g: number) => ((g - 90) * Math.PI) / 180; // rumbo (0 = norte) → ángulo de pantalla
    const p1 = [pt.x + r * Math.cos(a(pt.rumbo - med)), pt.y + r * Math.sin(a(pt.rumbo - med))];
    const p2 = [pt.x + r * Math.cos(a(pt.rumbo + med)), pt.y + r * Math.sin(a(pt.rumbo + med))];
    return `M${pt.x} ${pt.y}L${p1[0]} ${p1[1]}A${r} ${r} 0 0 1 ${p2[0]} ${p2[1]}Z`;
  })();
  const todoLote = !pt && f.zona === "aereas";
  const enEdificio = !pt && f.zona === "edificio";

  return (
    <svg viewBox={vb} role="img" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      {/* calle oeste (NW 1st Ct) y sur (NW 21st Ct), solo como borde */}
      <path d={`M${-M - 10} ${-M} V${LOTE.dy + 6} H${LOTE.dx + M}`} className="ap-p-calle" />
      <rect x={0} y={0} width={LOTE.dx} height={LOTE.dy} className={todoLote ? "ap-p-lote ap-p-activo" : "ap-p-lote"} />
      <rect x={PARKING_S.x} y={PARKING_S.y} width={PARKING_S.dx} height={PARKING_S.dy} className="ap-p-parking" />
      <rect x={PARKING_E.x} y={PARKING_E.y} width={PARKING_E.dx} height={PARKING_E.dy} className="ap-p-parking" />
      <rect x={PASEO.x} y={PASEO.y0} width={PASEO.dx} height={PASEO.y1 - PASEO.y0} className="ap-p-paseo" />
      {Array.from({ length: CABANAS.n }, (_, k) => (
        <rect key={k} x={CABANAS.x} y={CABANAS.y0 + k * CABANAS.paso} width={CABANAS.dx} height={CABANAS.dy} className="ap-p-cabana" />
      ))}
      <rect x={PALAPA.x} y={PALAPA.y} width={PALAPA.dx} height={PALAPA.dy} className="ap-p-pabellon" />
      <path d={`M${PALAPA.x} ${PALAPA.y}L${PALAPA.x + PALAPA.dx / 2} ${PALAPA.y + PALAPA.dy / 2 - 7}L${PALAPA.x + PALAPA.dx} ${PALAPA.y}M${PALAPA.x} ${PALAPA.y + PALAPA.dy}L${PALAPA.x + PALAPA.dx / 2} ${PALAPA.y + PALAPA.dy / 2 + 7}L${PALAPA.x + PALAPA.dx} ${PALAPA.y + PALAPA.dy}M${PALAPA.x + PALAPA.dx / 2} ${PALAPA.y + PALAPA.dy / 2 - 7}V${PALAPA.y + PALAPA.dy / 2 + 7}`} className="ap-p-cumbrera" />
      <rect x={EDIF.x} y={EDIF.y} width={EDIF.dx} height={EDIF.dy} className={enEdificio ? "ap-p-edif ap-p-activo" : "ap-p-edif"} />
      <line x1={PUERTA.x} y1={EDIF.dy} x2={PUERTA.x + PUERTA.dx} y2={EDIF.dy} className="ap-p-puerta" />
      {abanico && <path d={abanico} className="ap-p-abanico" />}
      {pt && <circle cx={pt.x} cy={pt.y} r={5.5} className="ap-p-punto" />}
      {/* norte */}
      <path d={`M${LOTE.dx + M - 4} ${-M + 22}V${-M + 6}l-4 6m4 -6 4 6`} className="ap-p-norte" />
    </svg>
  );
}

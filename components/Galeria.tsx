"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Idioma } from "@/lib/i18n";
import { GALERIA, ROTULO_VISUALIZACION, ZONAS, type Zona } from "@/lib/fotos";
import { ANCHO, optimizada } from "@/lib/imagen";
import { ev } from "@/lib/medicion";
import { Cerrar, FlechaDer, FlechaIzq } from "./Iconos";

/**
 * LA GALERÍA, POR ZONAS (10-nov-2026).
 *
 * Antes eran 21 fotos en una sola retícula, seis a la vista y un botón «ver las 21». Con la sesión de
 * noviembre hay material para enseñar cada parte del lugar por separado, que es como lo piensa quien
 * monta un evento: «¿cómo es el Pabellón?», «¿dónde se estaciona?». Las zonas filtran; «Todas» las deja
 * juntas en el orden de `ZONAS`.
 *
 * El visor ocupa la pantalla entera sobre tinta. Flechas del teclado, deslizar en el móvil, Esc cierra
 * (lo hace el propio `<dialog>`), y clic fuera de la foto también. Recorre las fotos del filtro activo,
 * no todas: si alguien está mirando el Pabellón, la siguiente foto es del Pabellón.
 *
 * Las visualizaciones (interior pintado de blanco con IA) llevan el rótulo en la miniatura y en el
 * visor. No es opcional: ver `lib/fotos.ts`.
 *
 * Mide: abrir una foto manda `view_plate` con `plate_name: "galeria"`, el id y la zona.
 */

const T = {
  es: {
    ojo: "Fotografías · el lugar tal cual",
    titulo: "Recorre el lugar por zonas.",
    intro: "Fotos de noviembre de 2026, vacío y de día, más algunos montajes de producciones anteriores. Toca una para verla a pantalla completa.",
    aria: "Galería de fotografías del recinto",
    filtro: "Zona",
    todas: "Todas",
    abrir: "Ver la foto",
    cerrar: "Cerrar",
    anterior: "Foto anterior",
    siguiente: "Foto siguiente",
    fuente: "Fuente",
    montaje: "Montaje de una producción anterior",
    verTodas: (n: number) => `Ver las ${n} fotos`,
  },
  en: {
    ojo: "Photos · the venue as it is",
    titulo: "Walk the venue, area by area.",
    intro: "Photos from November 2026, empty and in daylight, plus a few setups from previous productions. Tap any photo to see it full screen.",
    aria: "Photo gallery of the venue",
    filtro: "Area",
    todas: "All",
    abrir: "View photo",
    cerrar: "Close",
    anterior: "Previous photo",
    siguiente: "Next photo",
    fuente: "Source",
    montaje: "Set up by a previous production",
    verTodas: (n: number) => `See all ${n} photos`,
  },
} as const;

/** En «Todas», cuántas se ven antes del botón. Las demás siguen en el HTML (`hidden`) para buscadores. */
const VISIBLES = 9;

export default function Galeria({ lang }: { lang: Idioma }) {
  const t = T[lang];
  const [zona, setZona] = useState<Zona | null>(null);
  const [abierta, setAbierta] = useState<number | null>(null);
  const [todas, setTodas] = useState(false);
  const dialogo = useRef<HTMLDialogElement>(null);
  const toque = useRef<{ x: number; y: number } | null>(null);

  const zonas = useMemo(() => ZONAS.filter((z) => GALERIA.some((f) => f.zona === z.clave)), []);
  const lista = useMemo(() => (zona ? GALERIA.filter((f) => f.zona === zona) : GALERIA), [zona]);
  const recortar = zona === null && !todas;

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (abierta !== null && !d.open) d.showModal();
    if (abierta === null && d.open) d.close();
  }, [abierta]);

  const abrir = useCallback(
    (i: number) => {
      setAbierta(i);
      ev("view_plate", { plate_name: "galeria", photo: lista[i].id, zone: lista[i].zona });
    },
    [lista],
  );
  const mover = useCallback(
    (d: number) => setAbierta((a) => (a === null ? null : (a + d + lista.length) % lista.length)),
    [lista.length],
  );

  // Precarga la siguiente y la anterior para que pasar de foto no deje la pantalla en blanco.
  useEffect(() => {
    if (abierta === null) return;
    for (const d of [1, -1]) {
      const f = lista[(abierta + d + lista.length) % lista.length];
      const img = new Image();
      img.src = optimizada(f.src, ANCHO.visor, 78);
    }
  }, [abierta, lista]);

  const foto = abierta !== null ? lista[abierta] : null;
  const nombreZona = (z: Zona) => {
    const x = ZONAS.find((y) => y.clave === z)!;
    return lang === "es" ? x.es : x.en;
  };

  return (
    <section id="fotos" aria-label={t.aria} style={{ borderBottom: "1px solid var(--regla)", background: "var(--papel-2)" }}>
      <div className="reja" style={{ paddingBlock: "56px 64px" }}>
        <div className="ojo" style={{ paddingBottom: 16 }}>{t.ojo}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "12px 44px", alignItems: "end", paddingBottom: 22 }}>
          <h2 style={{ maxWidth: "20ch", margin: 0 }}>{t.titulo}</h2>
          <p className="respuesta" style={{ margin: 0, color: "var(--texto)", maxWidth: "48ch" }}>{t.intro}</p>
        </div>

        <div className="gal-zonas" role="group" aria-label={t.filtro}>
          <button type="button" aria-pressed={zona === null} onClick={() => setZona(null)}>
            {t.todas} <span>{GALERIA.length}</span>
          </button>
          {zonas.map((z) => (
            <button key={z.clave} type="button" aria-pressed={zona === z.clave} onClick={() => setZona(z.clave)}>
              {lang === "es" ? z.es : z.en} <span>{GALERIA.filter((f) => f.zona === z.clave).length}</span>
            </button>
          ))}
        </div>

        <ul className="gal">
          {lista.map((f, i) => (
            <li key={f.id} className="gal-item" hidden={recortar && i >= VISIBLES}>
              <button type="button" className="gal-boton" onClick={() => abrir(i)} aria-label={`${t.abrir}: ${f.alt[lang]}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={optimizada(f.src, ANCHO.miniatura)} width={f.w} height={f.h} alt={f.alt[lang]} loading="lazy" decoding="async" />
                {f.tipo === "visualizacion" && <span className="gal-viz">{ROTULO_VISUALIZACION[lang]}</span>}
              </button>
              <div className="gal-pie">
                <span className="gal-n">{String(i + 1).padStart(2, "0")}</span>
                <span>{f.alt[lang]}</span>
              </div>
            </li>
          ))}
        </ul>
        {recortar && lista.length > VISIBLES && (
          <button type="button" className="rec-boton rec-boton-plano" style={{ marginTop: 22 }} onClick={() => setTodas(true)}>
            {t.verTodas(lista.length)}
          </button>
        )}

        <dialog
          ref={dialogo}
          className="gal-visor"
          aria-label={foto ? foto.alt[lang] : t.aria}
          onClose={() => setAbierta(null)}
          onClick={(e) => {
            const el = e.target as HTMLElement;
            if (el === dialogo.current || el.classList.contains("gal-visor-escena")) setAbierta(null);
          }}
          onKeyDown={(e) => {
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
          {foto && (
            <>
              <div className="gal-visor-escena">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img key={foto.id} src={optimizada(foto.src, ANCHO.visor, 78)} width={foto.w} height={foto.h} alt={foto.alt[lang]} decoding="async" />
                {foto.tipo === "visualizacion" && <span className="gal-viz gal-viz-grande">{ROTULO_VISUALIZACION[lang]}</span>}
              </div>
              <div className="gal-visor-barra">
                <div className="gal-visor-pie">
                  <span className="gal-n">{String((abierta ?? 0) + 1).padStart(2, "0")} / {String(lista.length).padStart(2, "0")} · {nombreZona(foto.zona)}</span>
                  <span className="gal-visor-alt">{foto.alt[lang]}</span>
                  <span className="gal-fuente">
                    {foto.montaje ? `${t.montaje} · ` : ""}{t.fuente}: {foto.fuente[lang]}
                  </span>
                </div>
                <div className="gal-visor-mandos">
                  <button type="button" className="gal-icono" onClick={() => mover(-1)} aria-label={t.anterior}><FlechaIzq /></button>
                  <button type="button" className="gal-icono" onClick={() => mover(1)} aria-label={t.siguiente}><FlechaDer /></button>
                  <button type="button" className="gal-icono" onClick={() => setAbierta(null)} aria-label={t.cerrar} autoFocus><Cerrar /></button>
                </div>
              </div>
            </>
          )}
        </dialog>
      </div>
    </section>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ANCHO, optimizada } from "@/lib/imagen";
import { ev } from "@/lib/medicion";
import { Cerrar, FlechaDer, FlechaIzq } from "./Iconos";

/**
 * EL VISOR DE FOTOS DE LA INVITACIÓN (app/[lang]/preview).
 *
 * La página es de servidor y cada foto es un `<button data-visor>` con lo que
 * hace falta para verla en grande (`data-src`, `data-alt`, `data-etiqueta`,
 * `data-w`, `data-h`). Este componente escucha esos clics y abre un solo
 * `<dialog>`: así la maqueta de cada sección sigue en el servidor y el visor
 * recorre todas las fotos de la página, en el orden en que aparecen.
 *
 * Flechas del teclado, deslizar en el móvil, Esc (lo hace el `<dialog>`) o
 * clic fuera de la foto para cerrar. Mide `view_plate` con `plate_name:
 * "preview_foto"`, como la galería del sitio.
 */

type Item = { src: string; alt: string; etiqueta: string; w: number; h: number };

const leer = (b: HTMLElement): Item => ({
  src: b.dataset.src ?? "",
  alt: b.dataset.alt ?? "",
  etiqueta: b.dataset.etiqueta ?? "",
  w: Number(b.dataset.w ?? 1920),
  h: Number(b.dataset.h ?? 1280),
});

export default function VisorPreview({ textos }: { textos: { cerrar: string; anterior: string; siguiente: string } }) {
  const [lista, setLista] = useState<Item[]>([]);
  const [i, setI] = useState<number | null>(null);
  const dialogo = useRef<HTMLDialogElement>(null);
  const toque = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const botones = () => Array.from(document.querySelectorAll<HTMLElement>("[data-visor]"));
    const alClic = (e: MouseEvent) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>("[data-visor]");
      if (!b) return;
      const todos = botones();
      const n = todos.indexOf(b);
      setLista(todos.map(leer));
      setI(n);
      ev("view_plate", { plate_name: "preview_foto", photo: b.dataset.src });
    };
    document.addEventListener("click", alClic);
    return () => document.removeEventListener("click", alClic);
  }, []);

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (i !== null && !d.open) d.showModal();
    if (i === null && d.open) d.close();
  }, [i]);

  const mover = useCallback(
    (d: number) => setI((a) => (a === null || lista.length === 0 ? null : (a + d + lista.length) % lista.length)),
    [lista.length],
  );

  // Precarga las vecinas para que pasar de foto no deje la pantalla en blanco.
  useEffect(() => {
    if (i === null || lista.length < 2) return;
    for (const d of [1, -1]) {
      const img = new Image();
      img.src = optimizada(lista[(i + d + lista.length) % lista.length].src, ANCHO.visor, 78);
    }
  }, [i, lista]);

  const f = i !== null ? lista[i] : null;

  return (
    <dialog
      ref={dialogo}
      className="pv-visor"
      aria-label={f?.alt}
      onClose={() => setI(null)}
      onClick={(e) => {
        const el = e.target as HTMLElement;
        if (el === dialogo.current || el.classList.contains("pv-visor__escena")) setI(null);
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
      {f && (
        <>
          <div className="pv-visor__escena">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={f.src} src={optimizada(f.src, ANCHO.visor, 78)} width={f.w} height={f.h} alt={f.alt} decoding="async" />
          </div>
          <div className="pv-visor__barra">
            <p>
              <span className="pv-visor__n">{String((i ?? 0) + 1).padStart(2, "0")} / {String(lista.length).padStart(2, "0")}</span>
              {f.etiqueta && <span className="pv-visor__etiqueta">{f.etiqueta}</span>}
              <span>{f.alt}</span>
            </p>
            <div className="pv-visor__mandos">
              <button type="button" onClick={() => mover(-1)} aria-label={textos.anterior}><FlechaIzq /></button>
              <button type="button" onClick={() => mover(1)} aria-label={textos.siguiente}><FlechaDer /></button>
              <button type="button" onClick={() => setI(null)} aria-label={textos.cerrar} autoFocus><Cerrar /></button>
            </div>
          </div>
        </>
      )}
    </dialog>
  );
}

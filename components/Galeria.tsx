"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Idioma } from "@/lib/i18n";
import { GALERIA } from "@/lib/galeria";
import { ev } from "@/lib/medicion";

/**
 * LA GALERÍA. Daniel, 7-sep-2026: «que haya una zona con las fotos, para poder
 * ver». Trece fotos del predio en una retícula de columnas (cada una con su
 * proporción real, sin recortar), pie con número y fuente, y un visor que abre
 * la foto a su tamaño natural, nunca ampliada por encima de sus píxeles (regla
 * de las fotos nítidas). Flechas y Esc en el teclado; clic fuera cierra.
 *
 * Mide: abrir una foto manda `view_plate` con `plate_name: "galeria"` y el id
 * de la foto, que es la señal de qué quiere ver de verdad la gente.
 */

const T = {
  es: {
    ojo: "Fotografías · el recinto tal cual",
    titulo: "Trece fotos del predio, sin retoque de montaje.",
    intro: "Aéreas, el paseo, bajo la palapa, las cabañas y un evento montado de noche. Toca una para verla a su tamaño. Las del flyer comercial son las más nítidas que existen del sitio; la fotografía documental propia sigue pendiente.",
    aria: "Galería de fotografías del recinto",
    abrir: "Ver la foto",
    cerrar: "Cerrar",
    anterior: "Anterior",
    siguiente: "Siguiente",
    fuente: "Fuente",
  },
  en: {
    ojo: "Photographs · the site as it is",
    titulo: "Thirteen photos of the site, no setup retouching.",
    intro: "Aerials, the walk, under the structure, the cabanas and an event set up at night. Tap one to see it at its size. The ones from the commercial flyer are the sharpest that exist of the site; our own documentary photography is still pending.",
    aria: "Photo gallery of the site",
    abrir: "View the photo",
    cerrar: "Close",
    anterior: "Previous",
    siguiente: "Next",
    fuente: "Source",
  },
} as const;

export default function Galeria({ lang }: { lang: Idioma }) {
  const t = T[lang];
  const [abierta, setAbierta] = useState<number | null>(null);
  const dialogo = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (abierta !== null && !d.open) d.showModal();
    if (abierta === null && d.open) d.close();
  }, [abierta]);

  const abrir = useCallback((i: number) => {
    setAbierta(i);
    ev("view_plate", { plate_name: "galeria", photo: GALERIA[i].id });
  }, []);
  const mover = useCallback((d: number) => setAbierta((a) => (a === null ? null : (a + d + GALERIA.length) % GALERIA.length)), []);

  const foto = abierta !== null ? GALERIA[abierta] : null;

  return (
    <section id="fotos" aria-label={t.aria} style={{ borderBottom: "1px solid var(--regla)", background: "var(--papel-2)" }}>
      <div className="reja" style={{ paddingBlock: "56px 64px" }}>
        <div className="ojo" style={{ paddingBottom: 16 }}>{t.ojo}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "12px 44px", alignItems: "end", paddingBottom: 26 }}>
          <h2 style={{ maxWidth: "20ch", margin: 0 }}>{t.titulo}</h2>
          <p className="respuesta" style={{ margin: 0, color: "var(--texto)", maxWidth: "48ch" }}>{t.intro}</p>
        </div>

        <ul className="gal">
          {GALERIA.map((f, i) => (
            <li key={f.id} className="gal-item">
              <button type="button" className="gal-boton" onClick={() => abrir(i)} aria-label={`${t.abrir}: ${f.alt[lang]}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.src} width={f.w} height={f.h} alt={f.alt[lang]} loading="lazy" decoding="async" />
              </button>
              <div className="gal-pie">
                <span className="gal-n">{String(i + 1).padStart(2, "0")}</span>
                <span>{f.alt[lang]}</span>
              </div>
            </li>
          ))}
        </ul>

        <dialog
          ref={dialogo}
          className="gal-visor"
          aria-label={foto ? foto.alt[lang] : t.aria}
          onClose={() => setAbierta(null)}
          onClick={(e) => { if (e.target === dialogo.current) setAbierta(null); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") { e.preventDefault(); mover(1); }
            else if (e.key === "ArrowLeft") { e.preventDefault(); mover(-1); }
          }}
        >
          {foto && (
            <figure className="gal-visor-marco" key={foto.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={foto.src} width={foto.w} height={foto.h} alt={foto.alt[lang]} decoding="async" />
              <figcaption className="gal-visor-pie">
                <span className="gal-n">{String((abierta ?? 0) + 1).padStart(2, "0")} / {String(GALERIA.length).padStart(2, "0")}</span>
                <span>{foto.alt[lang]}</span>
                <span className="gal-fuente">{t.fuente}: {foto.fuente[lang]}</span>
              </figcaption>
              <div className="gal-visor-mandos">
                <button type="button" className="rec-boton rec-boton-plano" onClick={() => mover(-1)} aria-label={t.anterior}>‹</button>
                <button type="button" className="rec-boton rec-boton-plano" onClick={() => mover(1)} aria-label={t.siguiente}>›</button>
                <button type="button" className="rec-boton rec-boton-plano" onClick={() => setAbierta(null)}>{t.cerrar}</button>
              </div>
            </figure>
          )}
        </dialog>
      </div>
    </section>
  );
}

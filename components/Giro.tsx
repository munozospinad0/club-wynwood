"use client";

import { useState } from "react";
import { VISTAS, type Giro as G } from "@/lib/iso";
import type { Idioma } from "@/lib/i18n";

/**
 * Conmutador de las cuatro vistas.
 *
 * Las cuatro llegan YA DIBUJADAS desde el servidor y se ocultan con `hidden`,
 * no se generan al hacer clic. Cuesta HTML —cuatro veces el mismo dibujo— pero
 * mantiene los trazos y las cotas en el documento sin ejecutar JavaScript, que
 * es la propiedad que hace citable el sitio para un motor generativo. Generarlas
 * en cliente habría sido más ligero y habría tirado justo eso.
 *
 * Las vistas llegan como props y no se importan aquí: así este componente es
 * cliente (necesita estado) y las láminas siguen siendo Server Components.
 */
export default function Giro({ lang, vistas }: { lang: Idioma; vistas: React.ReactNode[] }) {
  const es = lang === "es";
  const [v, setV] = useState<G>(0);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
                    paddingBottom: 18 }}>
        <span className="ojo">{es ? "Vista" : "View"}</span>
        <div role="group" aria-label={es ? "Girar la lámina" : "Rotate the plate"}
             style={{ display: "flex", border: "1px solid var(--regla)" }}>
          {VISTAS.map((vi) => {
            const activa = v === vi.giro;
            return (
              <button key={vi.giro} type="button" onClick={() => setV(vi.giro)}
                      aria-pressed={activa}
                      title={es ? vi.es : vi.en}
                      style={{
                        border: 0, cursor: "pointer", font: "inherit",
                        padding: "8px 15px",
                        background: activa ? "var(--tinta)" : "transparent",
                        color: activa ? "var(--papel)" : "var(--texto)",
                        fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".16em",
                        textTransform: "uppercase",
                        borderRight: vi.giro < 3 ? "1px solid var(--regla)" : 0,
                      }}>
                {/* Rótulo corto: NE, SE, SO, NO. El nombre completo va en title. */}
                {(es ? vi.es : vi.en).split("-").map((w) => w[0]).join("").toUpperCase()}
              </button>
            );
          })}
        </div>
        <span style={{ fontSize: 12, color: "var(--texto)" }}>
          {es ? VISTAS[v].es : VISTAS[v].en}
        </span>
      </div>

      {vistas.map((n, i) => (
        <div key={i} hidden={i !== v}>{n}</div>
      ))}
    </div>
  );
}

"use client";

import { useState } from "react";
import { VISTAS, type Giro as G } from "@/lib/iso";
import type { Idioma } from "@/lib/i18n";
import DibujoEdificio from "@/components/DibujoEdificio";

/**
 * Conmutador de las cuatro vistas del edificio.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * LO QUE DECÍA ANTES, Y POR QUÉ ESTABA A MEDIAS
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Las cuatro vistas llegaban ya dibujadas del servidor y se ocultaban tres con
 * `hidden`. El argumento escrito era bueno: tener los trazos y las cotas en el
 * documento **sin ejecutar JavaScript** es lo que hace citable el sitio para un
 * motor generativo, y generarlas en cliente habría tirado justo eso.
 *
 * El argumento vale. Lo que no vale es la conclusión, porque **para esa
 * propiedad basta UNA vista en el documento, no cuatro**. Las otras tres eran
 * 828 nodos y ~105 KB que no se dibujaban nunca, y que además viajaban dos
 * veces: como marcado y como datos serializados de React.
 *
 * Ahora el dibujo se importa aquí. Next renderiza los componentes de cliente
 * también en el servidor, así que **la vista activa sigue estando en el HTML
 * sin JavaScript** —la propiedad se conserva entera— y las otras tres se
 * generan al pulsar, en el mismo fotograma.
 */
export default function Giro({ lang }: { lang: Idioma }) {
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

      <div><DibujoEdificio lang={lang} giro={v} /></div>
    </div>
  );
}

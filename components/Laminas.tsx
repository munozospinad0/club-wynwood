"use client";

import { useState } from "react";
import type { Idioma } from "@/lib/i18n";
import { ev } from "@/lib/medicion";

/**
 * EL VISOR DE LÁMINAS TÉCNICAS. Dos, y para quien ya está montando.
 *
 * Antes eran cuatro pestañas: planta, «el conjunto», cuatro subláminas del
 * exterior con panel de mandos, y el edificio. Daniel, 2-sep-2026: «de la
 * parte de los planos no se entiende un carajo». Y el diagnóstico estaba en la
 * captura: demasiado control alrededor de dibujos pequeños.
 *
 * El dibujo que explica el terreno ya no vive aquí: es una sección propia,
 * justo debajo de la portada (components/LaminaRecinto.tsx), porque contesta
 * las preguntas de quien todavía está decidiendo. Aquí quedan las dos láminas
 * de documentación:
 *   1. PLANTA — la vista desde arriba con las mesas y el camión a escala.
 *   2. EL EDIFICIO — la zona 02, con su propio dibujo.
 *
 * Las dos llegan como props: este componente es cliente (necesita el estado
 * de la pestaña) y las láminas siguen entrando en el HTML servido. Ninguna se
 * desmonta: se ocultan con `hidden`.
 */
export default function Laminas({
  lang, planta, edificio,
}: {
  lang: Idioma;
  planta: React.ReactNode;
  edificio: React.ReactNode;
}) {
  const es = lang === "es";
  const [zona, setZona] = useState<"planta" | "edificio">("planta");

  const ZONAS = [
    { id: "planta" as const,
      n: es ? "Planta" : "Plan",
      d: es ? "Visto desde arriba, a escala" : "Seen from above, to scale" },
    { id: "edificio" as const,
      n: es ? "El edificio" : "The building",
      d: es ? "Zona 02 · niveles 01 y 02" : "Zone 02 · levels 01 and 02" },
  ];

  return (
    <section aria-label={es ? "Láminas técnicas" : "Technical plates"}
             style={{ background: "#eae4da", borderBottom: "1px solid var(--regla)" }}>
      <div className="reja" style={{ paddingTop: 54 }}>
        <div className="ojo" style={{ paddingBottom: 20 }}>
          {es ? "Las láminas técnicas" : "The technical plates"}
        </div>
        <div role="tablist"
             aria-label={es ? "Láminas" : "Plates"}
             style={{ display: "flex", gap: 0, flexWrap: "wrap",
                      borderBottom: "1px solid var(--regla)" }}>
          {ZONAS.map((z) => {
            const activa = zona === z.id;
            return (
              <button key={z.id} role="tab" aria-selected={activa} type="button"
                      /* Abrir una lámina es la señal de intención más honesta
                         del sitio: quien mira los dibujos está evaluando si su
                         producción cabe, no leyendo un folleto. */
                      onClick={() => { ev("view_plate", { plate_name: z.id }); setZona(z.id); }}
                      style={{
                        background: "transparent", border: 0, cursor: "pointer",
                        textAlign: "left", padding: "0 44px 16px 0",
                        borderBottom: `2px solid ${activa ? "var(--ocre)" : "transparent"}`,
                        marginBottom: -1, font: "inherit",
                      }}>
                <div style={{
                  fontFamily: "var(--mono)", fontSize: 11, letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: activa ? "var(--tinta)" : "var(--texto-3)",
                }}>{z.n}</div>
                <div style={{ fontSize: 12, color: "var(--texto)", paddingTop: 5 }}>{z.d}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Solo la lámina abierta, por lo mismo que en Giro: `hidden` esconde
          pero no descarta, y aquí lo escondido son dos láminas técnicas
          enteras de SVG. La pestaña cambia igual de rápido. */}
      <div>{zona === "planta" ? planta : edificio}</div>
    </section>
  );
}

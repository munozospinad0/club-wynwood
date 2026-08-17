"use client";

import { useState } from "react";
import type { Idioma } from "@/lib/i18n";

/**
 * UN SOLO VISOR DE LÁMINAS, con las dos zonas.
 *
 * Daniel: "ajusta para que se puedan ver las dos, pero no una debajo de otra
 * que no se entiende la página".
 *
 * Tenía razón y era más grave que el pulido del dibujo. Estaban apiladas como
 * dos secciones independientes, cada una ocupando una pantalla entera, con su
 * propio cajetín y su propia escala gráfica. Al bajar parecían dos documentos
 * sueltos y no dos vistas del mismo sitio.
 *
 * Ahora hay un conmutador arriba: EXTERIOR / EDIFICIO. Es el mismo encuadre que
 * él fijó cuando dijo "ya sea que crees dos zonas": el jardín y la palapa son la
 * zona 01, el edificio es la zona 02, y las dos se miran en el mismo visor.
 *
 * Las dos láminas llegan como props y no se importan aquí: así este componente
 * es cliente (necesita estado para el conmutador) pero las láminas siguen
 * siendo Server Components y su contenido viaja en el HTML servido. Es el
 * patrón de composición de React, y aquí importa de verdad: si el dibujo del
 * edificio dependiera de que corra JavaScript, un rastreador de IA no lo vería.
 *
 * Ninguna de las dos se desmonta: se ocultan con CSS. Desmontar la del exterior
 * mataría su runtime portado —el que dibuja los trazos y cambia de lámina— y
 * habría que rearrancarlo en cada cambio de pestaña.
 */
export default function Laminas({
  lang, planta, conjunto, exterior, edificio,
}: {
  lang: Idioma;
  planta: React.ReactNode;
  conjunto: React.ReactNode;
  exterior: React.ReactNode;
  edificio: React.ReactNode;
}) {
  const es = lang === "es";
  const [zona, setZona] = useState<"planta" | "conjunto" | "exterior" | "edificio">("planta");

  // LA PLANTA VA PRIMERA Y ABRE POR DEFECTO.
  //
  // Antes abría «el conjunto», con el argumento de que era la que situaba. Es
  // verdad que sitúa, pero situar no es lo primero que necesita quien llega:
  // lo primero es saber si su evento cabe, por dónde entra el camión y qué pasa
  // si llueve. La planta es la única que contesta eso, así que es la que se ve
  // al aterrizar. Las demás quedan para quien ya quiere mirar el detalle.
  const ZONAS = [
    { id: "planta" as const,
      n: es ? "Planta" : "Plan",
      d: es ? "Qué cabe y por dónde se entra" : "What fits and how you get in" },
    { id: "conjunto" as const,
      n: es ? "El conjunto" : "The whole site",
      d: es ? "Las dos zonas en una vista" : "Both zones in one view" },
    { id: "exterior" as const,
      n: es ? "Zona 01 · Exterior" : "Zone 01 · Outdoor",
      d: es ? "Jardín y Tiki Hut · 4 láminas" : "Garden and Tiki Hut · 4 plates" },
    { id: "edificio" as const,
      n: es ? "Zona 02 · Edificio" : "Zone 02 · Building",
      d: es ? "Niveles 01 y 02 · 1 lámina" : "Levels 01 and 02 · 1 plate" },
  ];

  return (
    <section aria-label={es ? "Láminas del recinto" : "Site plates"}
             style={{ background: "#eae4da", borderBottom: "1px solid var(--regla)" }}>
      <div className="reja" style={{ paddingTop: 54 }}>
        <div className="ojo" style={{ paddingBottom: 20 }}>
          {es ? "Las láminas" : "The plates"}
        </div>
        <div role="tablist"
             aria-label={es ? "Zonas del recinto" : "Site zones"}
             style={{ display: "flex", gap: 0, flexWrap: "wrap",
                      borderBottom: "1px solid var(--regla)" }}>
          {ZONAS.map((z) => {
            const activa = zona === z.id;
            return (
              <button key={z.id} role="tab" aria-selected={activa} type="button"
                      onClick={() => setZona(z.id)}
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

      {/* Las dos se renderizan siempre; solo se oculta la que no toca. Así el
          contenido de ambas está en el HTML servido y el runtime del exterior
          no se reinicia al cambiar de zona. */}
      <div hidden={zona !== "planta"}>{planta}</div>
      <div hidden={zona !== "conjunto"}>{conjunto}</div>
      <div hidden={zona !== "exterior"}>{exterior}</div>
      <div hidden={zona !== "edificio"}>{edificio}</div>
    </section>
  );
}

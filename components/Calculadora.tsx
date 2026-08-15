"use client";

import { useState } from "react";
import type { Idioma } from "@/lib/i18n";

/**
 * CALCULADORA DE ESPACIO. Es lo que ningún competidor tiene.
 *
 * Sale de un hallazgo concreto: raspando los directorios, Giggster publica en
 * su FAQ la pregunta «What square footage do I need for event spaces?», y
 * Peerspace y Tagvenue publican «what are the typical capacities». O sea: la
 * gente pregunta cuánto espacio necesita, y todos responden con un párrafo.
 * Nadie lo calcula.
 *
 * HONESTIDAD DEL CÁLCULO — esto importa más que la herramienta:
 * los ratios de abajo son estándares del sector, no inventados, y el resultado
 * NUNCA contradice las cifras verificadas del venue. El aforo declarado por el
 * propietario (~600 de pie, ~300 sentados) funciona como TECHO: si el cálculo
 * da más, la calculadora dice que no cabe igualmente. Una herramienta que
 * prometa 900 personas porque la aritmética lo permite sería peor que no
 * tenerla.
 *
 * Y cierra mandando a la visita técnica, porque el aforo real por montaje
 * depende de cosas que no están medidas.
 */

type Formato = "coctel" | "banquete" | "ceremonia";

/** Pies cuadrados por persona. Estándares de planificación de eventos. */
const RATIO: Record<Formato, number> = {
  coctel: 8,      // de pie, con circulación
  banquete: 14,   // mesa redonda, silla y pasillo de servicio
  ceremonia: 9,   // sillas en filas, mirando a un punto
};

/** Techos verificados del inmueble. El cálculo nunca los supera. */
const TECHO: Record<Formato, number> = { coctel: 600, banquete: 300, ceremonia: 300 };

const ESPACIOS = [
  { id: "tiki", sqft: 4000, es: "El Tiki Hut", en: "The Tiki Hut", techado: true },
  { id: "jardin", sqft: 18000, es: "El Jardín", en: "The Garden", techado: false },
  { id: "todo", sqft: 22000, es: "El recinto completo", en: "The whole site", techado: false },
];

export default function Calculadora({ lang }: { lang: Idioma }) {
  const es = lang === "es";
  const [invitados, setInvitados] = useState(150);
  const [formato, setFormato] = useState<Formato>("banquete");
  const [pista, setPista] = useState(true);

  // Superficie necesaria. La pista de baile se calcula sobre la mitad de los
  // invitados: nunca bailan todos a la vez.
  const base = invitados * RATIO[formato];
  const extraPista = pista ? Math.round(invitados * 0.5 * 4.5) : 0;
  const necesita = Math.round(base + extraPista);

  const superaTecho = invitados > TECHO[formato];
  const opciones = ESPACIOS.map((e) => ({
    ...e,
    cabe: e.sqft >= necesita && !superaTecho,
    porPersona: Math.round((e.sqft / Math.max(1, invitados)) * 10) / 10,
  }));
  const recomendado = opciones.find((o) => o.cabe);

  const campo: React.CSSProperties = {
    padding: "11px 13px", border: "1px solid var(--regla)",
    background: "var(--papel)", font: "inherit", fontSize: 15, width: "100%",
  };
  const etq: React.CSSProperties = {
    display: "block", fontFamily: "var(--mono)", fontSize: 10,
    letterSpacing: ".2em", textTransform: "uppercase", color: "var(--texto)",
    paddingBottom: 8,
  };

  return (
    <div style={{ border: "1px solid var(--regla)", background: "var(--papel)" }}>
      <div style={{ padding: "26px 26px 22px", borderBottom: "1px solid var(--regla)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 18 }}>
          <div>
            <label style={etq} htmlFor="calc-inv">{es ? "Invitados" : "Guests"}</label>
            <input style={campo} id="calc-inv" type="number" min={10} max={900} step={10}
                   value={invitados}
                   onChange={(e) => setInvitados(Math.max(1, Number(e.target.value) || 0))} />
          </div>
          <div>
            <label style={etq} htmlFor="calc-fmt">{es ? "Formato" : "Format"}</label>
            <select style={campo} id="calc-fmt" value={formato}
                    onChange={(e) => setFormato(e.target.value as Formato)}>
              <option value="coctel">{es ? "Cóctel, de pie" : "Cocktail, standing"}</option>
              <option value="banquete">{es ? "Cena sentada, mesas redondas" : "Seated dinner, round tables"}</option>
              <option value="ceremonia">{es ? "Ceremonia, sillas en filas" : "Ceremony, rows of chairs"}</option>
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <label style={{ display: "flex", gap: 9, alignItems: "center", fontSize: 14, paddingBottom: 11 }}>
              <input type="checkbox" checked={pista} onChange={(e) => setPista(e.target.checked)} />
              {es ? "Con pista de baile" : "With a dance floor"}
            </label>
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 26px 26px" }}>
        <div className="ojo" style={{ paddingBottom: 12 }}>
          {es ? "Necesitas aproximadamente" : "You need approximately"}
        </div>
        <div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 42,
                      lineHeight: 1, letterSpacing: "-.02em", paddingBottom: 6 }}>
          {necesita.toLocaleString(es ? "es-ES" : "en-US")} ft²
        </div>
        <p style={{ margin: "0 0 22px", fontSize: 13.5, color: "var(--texto)" }}>
          {es
            ? `${RATIO[formato]} ft² por persona${pista ? ", más pista de baile para la mitad de los invitados" : ""}.`
            : `${RATIO[formato]} sq ft per person${pista ? ", plus a dance floor for half the guests" : ""}.`}
        </p>

        {superaTecho ? (
          <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: "var(--ocre)" }}>
            {es
              ? `El aforo declarado del recinto para este formato es de ~${TECHO[formato]} personas, así que ${invitados} no entran aunque la superficie diera. Escríbenos igualmente: a veces el montaje se puede replantear.`
              : `The venue's stated capacity for this format is ~${TECHO[formato]}, so ${invitados} does not fit even if the surface allowed it. Write to us anyway: sometimes the layout can be rethought.`}
          </p>
        ) : (
          <div>
            {ESPACIOS.map((e) => {
              const o = opciones.find((x) => x.id === e.id)!;
              return (
                <div key={e.id}
                     style={{ display: "flex", justifyContent: "space-between", gap: 14,
                              alignItems: "baseline", padding: "11px 0",
                              borderBottom: "1px solid var(--regla)" }}>
                  <span style={{ fontSize: 14.5,
                                 color: o.cabe ? "var(--tinta)" : "var(--texto-3)" }}>
                    {o.cabe ? "✓ " : "· "}{es ? e.es : e.en}
                    <span style={{ color: "var(--texto)", fontSize: 13 }}>
                      {" "}— {e.sqft.toLocaleString(es ? "es-ES" : "en-US")} ft²
                    </span>
                  </span>
                  <span style={{ fontSize: 13, color: "var(--texto)", whiteSpace: "nowrap" }}>
                    {o.cabe
                      ? (es ? `${o.porPersona} ft² por persona` : `${o.porPersona} sq ft each`)
                      : (es ? "se queda corto" : "too small")}
                  </span>
                </div>
              );
            })}

            {recomendado && (
              <p style={{ margin: "20px 0 0", fontSize: 14.5, lineHeight: 1.62 }}>
                {es
                  ? `Con ${invitados} invitados en ${formato === "coctel" ? "cóctel" : formato === "banquete" ? "cena sentada" : "ceremonia"}, te sirve ${recomendado.es.toLowerCase()}.`
                  : `With ${invitados} guests ${formato === "coctel" ? "standing" : formato === "banquete" ? "at a seated dinner" : "in a ceremony"}, ${recomendado.en.toLowerCase()} works.`}
                {" "}
                {es
                  ? "El aforo exacto con tu plano se confirma en la visita técnica."
                  : "Exact capacity with your floor plan is confirmed at the technical visit."}
              </p>
            )}
          </div>
        )}

        <a href="#disponibilidad" className="boton" style={{ marginTop: 22 }}>
          {es ? "Consultar esta fecha" : "Check this date"} <span aria-hidden>→</span>
        </a>
      </div>
    </div>
  );
}

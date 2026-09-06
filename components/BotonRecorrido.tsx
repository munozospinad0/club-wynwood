"use client";

import type { Idioma } from "@/lib/i18n";

/**
 * EL BOTÓN DE LA PORTADA QUE ARRANCA EL RECORRIDO.
 *
 * Daniel, 6-sep-2026: «la página web tiene desorden, no se entiende». Parte del
 * desorden era que lo mejor del sitio —el recorrido narrado— no se anunciaba
 * hasta mitad de página, debajo de un dibujo, cinco botones y dos titulares.
 * Ahora la portada ofrece las dos cosas que se pueden hacer: pedir fecha o
 * ver el sitio contado en tres minutos.
 *
 * Es un componente cliente porque manda un evento al recorrido, que vive en
 * otra parte del árbol. Sin JavaScript, el enlace lleva a la sección igual.
 */
export default function BotonRecorrido({ lang }: { lang: Idioma }) {
  const es = lang === "es";
  return (
    <a
      href="#terreno"
      className="boton boton-recorrido"
      onClick={(e) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("cw-recorrido"));
      }}
    >
      <span className="rec-play-icono" aria-hidden="true" />
      {es ? "Ver el recorrido · 3 min" : "Watch the tour · 3 min"}
    </a>
  );
}

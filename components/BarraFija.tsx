"use client";

import { useEffect, useState } from "react";
import type { Idioma } from "@/lib/i18n";

/**
 * LA BARRA FIJA DEL MÓVIL.
 *
 * Medido el 12-sep-2026 con un iPhone simulado, sobre las páginas a las que
 * apuntan los anuncios:
 *
 *   /en          19.997 px de alto · el formulario empieza a 17.753 px
 *   /en/tour      8.821 px         · el formulario a 6.504 px
 *   /en/weddings  5.014 px         · el formulario a 2.304 px
 *
 * Veintiuna pantallas de desplazamiento hasta el único sitio donde se puede
 * pedir algo. Quien llega de un anuncio no baja veintiuna pantallas: se va. La
 * barra pone esa acción a un toque desde cualquier punto de la página.
 *
 * Tres decisiones y su motivo:
 *
 *  · NO APARECE ARRIBA DEL TODO. La portada ya tiene su llamada a la acción a
 *    12 px; taparla con otra igual es ruido. Sale al pasar la primera pantalla.
 *  · SE APARTA CUANDO EL FORMULARIO ESTÁ A LA VISTA. Una barra fija sobre el
 *    campo que la persona está rellenando es el error clásico de este patrón,
 *    y en un móvil bajo tapa justo el botón de enviar.
 *  · NO LLEVA WHATSAPP. Regla de Daniel del 11-sep: a WhatsApp se llega después
 *    de rellenar el formulario, nunca antes. Si estuviera aquí, sería el atajo
 *    que se salta el CRM y la atribución del anuncio que acabamos de pagar.
 *
 * Solo se pinta en móvil: la regla vive en `responsive.css`, no en JavaScript,
 * para que no dependa de que el navegador haya ejecutado nada.
 */
/**
 * El bloque de solicitud NO tiene el mismo identificador en todo el sitio:
 * las páginas de tema lo llaman `disponibilidad` (components/Cierre.tsx) y la
 * del recorrido lo llama `pedir` (app/[lang]/tour/page.tsx). Tres de los cuatro
 * grupos de anuncios activos llevan justamente al recorrido, así que buscar
 * solo el primero dejaba la barra muerta donde más falta hace.
 */
const ANCLAS = ["disponibilidad", "pedir"];
const buscarDestino = () =>
  ANCLAS.map((a) => document.getElementById(a)).find(Boolean) ?? null;

export default function BarraFija({ lang }: { lang: Idioma }) {
  const es = lang === "es";
  const [visible, setVisible] = useState(false);
  const [ancla, setAncla] = useState<string | null>(null);

  useEffect(() => {
    const destino = buscarDestino();
    // Hay páginas sin bloque de solicitud (preguntas frecuentes, residencia).
    // Allí la barra no tiene a dónde llevar, así que no se pinta.
    if (!destino) return;
    setAncla(destino.id);

    /**
     * Dos observadores en vez de un `scroll`: un `scroll` en móvil dispara
     * decenas de veces por segundo y obliga a recalcular la página en cada una.
     */
    let pasoElInicio = false;
    let formularioALaVista = false;
    const pintar = () => setVisible(pasoElInicio && !formularioALaVista);

    // Centinela invisible a una pantalla de altura: al dejarlo atrás, aparece.
    const centinela = document.createElement("div");
    centinela.setAttribute("aria-hidden", "true");
    centinela.style.cssText = "position:absolute;top:0;left:0;width:1px;height:100vh;pointer-events:none";
    document.body.appendChild(centinela);

    const oInicio = new IntersectionObserver(([e]) => {
      pasoElInicio = !e.isIntersecting;
      pintar();
    }, { threshold: 0 });
    oInicio.observe(centinela);

    let oForm: IntersectionObserver | null = null;
    if (destino) {
      oForm = new IntersectionObserver(([e]) => {
        formularioALaVista = e.isIntersecting;
        pintar();
      }, { threshold: 0 });
      oForm.observe(destino);
    }

    return () => {
      oInicio.disconnect();
      oForm?.disconnect();
      centinela.remove();
    };
  }, []);

  return (
    // En una página sin bloque de solicitud el efecto sale antes de tiempo,
    // `visible` se queda en falso y el CSS la deja invisible y sin ocupar sitio.
    <div className={`barra-fija${visible ? " barra-fija--vista" : ""}`}>
      <a
        className="barra-fija__boton"
        href={`#${ancla ?? "disponibilidad"}`}
        onClick={(e) => {
          const d = buscarDestino();
          if (!d) return; // que lo resuelva el navegador
          e.preventDefault();
          d.scrollIntoView({ behavior: "smooth", block: "start" });
          // Enfocar el primer campo después de que termine el desplazamiento
          // suave: hacerlo antes lo cancela y la página se queda a medio camino.
          window.setTimeout(() => {
            const primero = d.querySelector<HTMLInputElement>('input[name="nombre"]');
            primero?.focus({ preventScroll: true });
          }, 700);
        }}
      >
        {es ? "Consultar mi fecha" : "Check my date"}
      </a>
      <p className="barra-fija__nota">
        {es ? "Respuesta en un día hábil" : "Answer within one business day"}
      </p>
    </div>
  );
}

"use client";

import { useEffect } from "react";

/**
 * Revelado al scroll.
 *
 * Va en un componente cliente aparte y no en el layout para que el layout siga
 * siendo Server Component: los rastreadores de IA priorizan velocidad sobre
 * ejecutar JavaScript, así que todo el texto tiene que llegar en el HTML.
 *
 * La clase `rv` (estado oculto) la añade este script, no el markup. Si el JS
 * falla o no corre, la página se ve completa. Lo contrario —ocultar en CSS y
 * mostrar con JS— deja el contenido invisible para quien no ejecute scripts.
 */
export default function Revelado() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const bloques: HTMLElement[] = [];
    document.querySelectorAll<HTMLElement>("section, article").forEach((s) => {
      const hijos = s.querySelectorAll<HTMLElement>(":scope > div, :scope > figure");
      let n = 0;
      (hijos.length ? Array.from(hijos) : [s]).forEach((el) => {
        if (bloques.includes(el) || el.offsetHeight < 40) return;
        el.classList.add("rv");
        el.style.transitionDelay = `${Math.min(n, 4) * 60}ms`;
        bloques.push(el);
        n++;
      });
    });

    const io = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("dentro");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    );
    bloques.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return null;
}

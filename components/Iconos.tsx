/**
 * Íconos de interfaz, dibujados a mano en el trazo del sitio (hairline, esquinas rectas, sin relleno).
 * Regla del proyecto: nunca caracteres de texto (‹ › × →) como íconos — cambian con la fuente y el
 * lector de pantalla los lee en voz alta. Todos heredan `currentColor` y van `aria-hidden`: el nombre
 * accesible lo pone el botón que los lleva.
 */

type P = { tam?: number };

const base = (tam: number) => ({
  width: tam,
  height: tam,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "square" as const,
  strokeLinejoin: "miter" as const,
  "aria-hidden": true,
  focusable: false,
});

export function FlechaIzq({ tam = 20 }: P) {
  return <svg {...base(tam)}><path d="M15 5 8 12l7 7" /></svg>;
}
export function FlechaDer({ tam = 20 }: P) {
  return <svg {...base(tam)}><path d="m9 5 7 7-7 7" /></svg>;
}
export function Cerrar({ tam = 20 }: P) {
  return <svg {...base(tam)}><path d="M6 6l12 12M18 6 6 18" /></svg>;
}
export function Expandir({ tam = 20 }: P) {
  return <svg {...base(tam)}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>;
}
export function Contraer({ tam = 20 }: P) {
  return <svg {...base(tam)}><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /></svg>;
}

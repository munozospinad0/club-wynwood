/**
 * Proyección isométrica con giro, compartida por todas las láminas.
 *
 * Daniel pidió poder mirar el edificio desde otro ángulo. De las tres formas
 * posibles se eligió la barata: CUATRO VISTAS FIJAS desde las cuatro esquinas.
 *
 *   · Sigue siendo SVG generado en el servidor, así que los 105 trazos y las
 *     cotas siguen llegando en el HTML sin ejecutar JavaScript. Arrastrar para
 *     girar libremente habría obligado a recalcular en cliente y a perder eso,
 *     que es medio motivo de toda la migración.
 *   · Es además la convención real: las láminas de arquitectura se dibujan
 *     isométricas desde las esquinas, no se orbitan.
 *
 * POR QUÉ ES BARATO: toda la geometría de las láminas pasa por una sola
 * función. Rotando el punto ANTES de proyectarlo, cada rectángulo sigue siendo
 * un rectángulo —solo cambia qué cara se ve— y ni un solo dibujo necesita
 * tocarse.
 */

export const K = 0.866;              // cos(30°)
export type Giro = 0 | 1 | 2 | 3;    // 0°, 90°, 180°, 270°

export const VISTAS: Array<{ giro: Giro; es: string; en: string }> = [
  { giro: 0, es: "Noreste", en: "North-east" },
  { giro: 1, es: "Sureste", en: "South-east" },
  { giro: 2, es: "Suroeste", en: "South-west" },
  { giro: 3, es: "Noroeste", en: "North-west" },
];

export interface Geo {
  p: (x: number, y: number, z?: number) => [number, number];
  techo: (x: number, y: number, dx: number, dy: number, z: number) => string;
  frente: (x: number, y: number, dx: number, z0: number, z1: number) => string;
  lado: (x: number, y: number, dy: number, z0: number, z1: number) => string;
  caja: (dx: number, dy: number, zMax: number, margen: number) => { x: number; y: number; w: number; h: number };
}

/**
 * @param u      unidades por pie
 * @param cx,cy  centro de giro, en pies
 * @param giro   cuarto de vuelta
 */
export function crearGeo(u: number, cx: number, cy: number, giro: Giro): Geo {
  /** Gira el punto en planta antes de proyectar. Con múltiplos de 90° la
   *  operación es exacta: no acumula error de coma flotante. */
  function rot(x: number, y: number): [number, number] {
    const a = x - cx, b = y - cy;
    switch (giro) {
      case 1: return [cx - b, cy + a];
      case 2: return [cx - a, cy - b];
      case 3: return [cx + b, cy - a];
      default: return [x, y];
    }
  }

  const p = (xf: number, yf: number, zf = 0): [number, number] => {
    const [rx, ry] = rot(xf, yf);
    const x = rx * u, y = ry * u, z = zf * u;
    return [(x - y) * K, (x + y) * 0.5 - z];
  };

  const poly = (...q: Array<[number, number]>) =>
    q.map((c, i) => `${i ? "L" : "M"}${c[0].toFixed(1)},${c[1].toFixed(1)}`).join(" ") + " Z";

  return {
    p,
    techo: (x, y, dx, dy, z) => poly(p(x, y, z), p(x + dx, y, z), p(x + dx, y + dy, z), p(x, y + dy, z)),
    frente: (x, y, dx, z0, z1) => poly(p(x, y, z0), p(x + dx, y, z0), p(x + dx, y, z1), p(x, y, z1)),
    lado: (x, y, dy, z0, z1) => poly(p(x, y, z0), p(x, y + dy, z0), p(x, y + dy, z1), p(x, y, z1)),

    /**
     * Caja de la proyección, calculada probando las ocho esquinas del volumen.
     *
     * Se calcula y no se pone a ojo porque al girar cambia el encuadre: lo que
     * en una vista sobra por la derecha, en otra falta por abajo. Encuadrar a
     * mano cuatro vistas es garantizar que tres queden mal.
     */
    caja: (dx, dy, zMax, margen) => {
      const xs: number[] = [], ys: number[] = [];
      for (const X of [0, dx]) for (const Y of [0, dy]) for (const Z of [0, zMax]) {
        const [sx, sy] = p(X, Y, Z);
        xs.push(sx); ys.push(sy);
      }
      const x0 = Math.min(...xs), x1 = Math.max(...xs);
      const y0 = Math.min(...ys), y1 = Math.max(...ys);
      return { x: x0 - margen, y: y0 - margen, w: x1 - x0 + margen * 2, h: y1 - y0 + margen * 2 };
    },
  };
}

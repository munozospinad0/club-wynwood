/**
 * CÁMARA EN PERSPECTIVA, con la misma interfaz que la isométrica (`lib/iso.ts`).
 *
 * Daniel, 6-sep-2026: «trabaja en la perspectiva que sí parezca real». Las
 * fotos del predio son de dron, desde el sur, mirando al edificio: la palapa a
 * la izquierda, las pérgolas a la derecha, el paseo en el centro alejándose. Una
 * isométrica no puede parecerse a eso —no tiene punto de fuga—; una perspectiva
 * con la cámara donde estuvo el dron, sí.
 *
 * Coordenadas del terreno en pies: `x` hacia el este, `y` hacia el sur, `z`
 * hacia arriba. La cámara mira desde el sur (y grande) hacia el norte (y
 * pequeña), elevada. Todo lo que dibuja la lámina pasa por `p(x, y, z)`, así que
 * cambiar de cámara es cambiar tres números aquí.
 *
 * `escala(x, y)` devuelve cuántas unidades de pantalla mide un pie en ese punto:
 * lo lejano se dibuja más pequeño (palmeras, personas, sillas), que es
 * justamente lo que la isométrica no hacía y por lo que «no parecía real».
 */

import type { Geo } from "./iso";

export interface Camara {
  /** Dónde está la cámara, en pies. */
  ojo: [number, number, number];
  /** A dónde mira, en pies. */
  objetivo: [number, number, number];
  /** Distancia focal en unidades de pantalla (mayor = menos angular). */
  focal: number;
}

export interface GeoPerspectiva extends Geo {
  escala: (x: number, y: number, z?: number) => number;
  /** Profundidad (distancia a la cámara) para ordenar el pintado: lo lejano primero. */
  profundidad: (x: number, y: number, z?: number) => number;
  camara: Camara;
}

type V3 = [number, number, number];
const resta = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cruz = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const punto = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

export function crearPerspectiva(camara: Camara): GeoPerspectiva {
  const { ojo, objetivo, focal } = camara;
  // Base de la cámara: adelante (hacia el objetivo), derecha y arriba.
  const adelante = norm(resta(objetivo, ojo));
  const arribaMundo: V3 = [0, 0, 1];
  // Mirando al norte, el este tiene que caer a la DERECHA de la pantalla (la
  // palapa, al oeste, a la izquierda, como en las fotos). Con el producto en
  // el otro orden salía el recinto en espejo.
  const derecha = norm(cruz(arribaMundo, adelante));
  const arriba = cruz(adelante, derecha);

  const p = (x: number, y: number, z = 0): [number, number] => {
    const d = resta([x, y, z], ojo);
    const prof = Math.max(1, punto(d, adelante));
    const u = (punto(d, derecha) / prof) * focal;
    const v = (-punto(d, arriba) / prof) * focal;
    return [u, v];
  };

  const escala = (x: number, y: number, z = 0) => {
    const d = resta([x, y, z], ojo);
    return focal / Math.max(1, punto(d, adelante));
  };

  const profundidad = (x: number, y: number, z = 0) => punto(resta([x, y, z], ojo), adelante);

  const poly = (...q: Array<[number, number]>) =>
    q.map((c, i) => `${i ? "L" : "M"}${c[0].toFixed(1)},${c[1].toFixed(1)}`).join(" ") + " Z";

  return {
    camara,
    p,
    escala,
    profundidad,
    techo: (x, y, dx, dy, z) => poly(p(x, y, z), p(x + dx, y, z), p(x + dx, y + dy, z), p(x, y + dy, z)),
    // «frente» = la cara sur (y + dy), que es la que mira a la cámara.
    frente: (x, y, dx, z0, z1) => poly(p(x, y, z0), p(x + dx, y, z0), p(x + dx, y, z1), p(x, y, z1)),
    // «lado» = la cara este (x + dx). Para lo que queda al este de la cámara la
    // visible es la oeste: la lámina lo decide con `ladoVisible`.
    lado: (x, y, dy, z0, z1) => poly(p(x, y, z0), p(x, y + dy, z0), p(x, y + dy, z1), p(x, y, z1)),
    caja: (dx, dy, zMax, margen) => {
      const xs: number[] = [], ys: number[] = [];
      for (const X of [0, dx]) for (const Y of [0, dy]) for (const Z of [0, zMax]) {
        const [sx, sy] = p(X, Y, Z);
        xs.push(sx); ys.push(sy);
      }
      const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
      return { x: x0 - margen, y: y0 - margen, w: x1 - x0 + margen * 2, h: y1 - y0 + margen * 2 };
    },
  };
}

/**
 * LA MARCA: el símbolo y la palabra.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * POR QUÉ ESTE SÍMBOLO, Y NO UN MONOGRAMA
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Daniel, 7-sep-2026, enseñando la pestaña del navegador con el globo gris por
 * defecto: «quiero que esto tenga logo». No había ningún icono en el proyecto.
 *
 * El símbolo es LA PALAPA, dibujada con las proporciones reales del predio
 * (`lib/recinto.geo.ts`): vano de 54 ft, cumbrera de 14 y una altura de techo
 * de 23 ft del alero a la cumbre. De ahí salen las dos únicas proporciones que
 * hacen falta, y por eso el logo no se parece a un tejado genérico:
 *
 *     cumbrera / vano = 14 / 54 ≈ 0,26
 *     alto de techo / vano = 23 / 54 ≈ 0,43
 *
 * Un monograma «CW» en Fraunces se habría leído como cualquier bufete o
 * cualquier club, y a 16 píxeles una serif con remates se convierte en una
 * mancha. La palapa, en cambio, es exactamente lo que este venue tiene y sus
 * competidores no —Unlocked ofrece asfalto, Oasis contenedores, Jungle Plaza
 * cobra la carpa aparte—, así que el símbolo dice el argumento de venta antes
 * de leer una palabra.
 *
 * Los colores no son decorativos: el techo va en OCRE porque la paja es ocre, y
 * el ocre es el acento del sistema; los postes y el suelo van en papel, a un
 * hairline, como todas las láminas. Esquinas rectas y sin sombras, como manda
 * el kit.
 *
 * El mismo dibujo se usa en cuatro sitios y en un solo archivo: la barra, el
 * pie, la portada del vídeo y la tarjeta final del vídeo. El favicon vive
 * aparte, en `app/icon.svg`, porque Next lo sirve como archivo y no puede
 * importar un componente; si se cambia la geometría aquí, hay que cambiarla
 * allí (son diez números).
 */

/** Proporciones reales de la palapa, en fracción del vano. */
const CUMBRERA = 0.26;
const ALTO_TECHO = 0.43;

/**
 * El símbolo suelto, sin fondo: hereda el color del texto para los postes y
 * pinta el techo en ocre. `tono` permite forzar el color del techo cuando el
 * fondo no es tinta (por ejemplo, en una tarjeta clara sobre foto).
 */
export function Simbolo({ tam = 24, tono = "var(--ocre)", trazo = "currentColor" }: {
  tam?: number; tono?: string; trazo?: string;
}) {
  // Lienzo de 24 × 24 con el conjunto centrado: alero a 15, suelo a 21.
  const x0 = 1, x1 = 23, vano = x1 - x0;
  const alero = 15, cumbre = alero - vano * ALTO_TECHO;   // 15 → 5,54
  const c0 = 12 - (vano * CUMBRERA) / 2, c1 = 12 + (vano * CUMBRERA) / 2;
  const suelo = 21;
  return (
    <svg width={tam} height={tam} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ display: "block", flex: "none" }}>
      {/* el techo de paja: trapecio a cuatro aguas visto de frente */}
      <path d={`M${x0} ${alero} L${c0.toFixed(2)} ${cumbre.toFixed(2)} L${c1.toFixed(2)} ${cumbre.toFixed(2)} L${x1} ${alero} Z`} fill={tono} />
      {/* la cumbrera, un hairline sobre el techo */}
      <path d={`M${c0.toFixed(2)} ${cumbre.toFixed(2)} L${c1.toFixed(2)} ${cumbre.toFixed(2)}`} stroke={trazo} strokeWidth="1.1" strokeLinecap="square" />
      {/* los tres postes y el suelo */}
      {[5.5, 12, 18.5].map((x) => (
        <path key={x} d={`M${x} ${alero} L${x} ${suelo}`} stroke={trazo} strokeWidth="1.1" strokeLinecap="butt" />
      ))}
      <path d={`M2.5 ${suelo} L21.5 ${suelo}`} stroke={trazo} strokeWidth="1.1" strokeLinecap="square" />
    </svg>
  );
}

/**
 * La marca completa: símbolo y palabra. La palabra sigue en Geist Mono con el
 * mismo tracking que tenía la barra —no se toca lo que ya funcionaba—, y el
 * símbolo se le pone delante.
 */
export default function Marca({ tam = 22, gap = 10, tono = "var(--ocre)", tipo = 12 }: {
  tam?: number; gap?: number; tono?: string; tipo?: number;
}) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap }}>
      <Simbolo tam={tam} tono={tono} />
      <span
        style={{
          fontFamily: "var(--mono)", fontSize: tipo, letterSpacing: ".18em",
          textTransform: "uppercase", fontWeight: 500, whiteSpace: "nowrap",
        }}
      >
        Club Wynwood
      </span>
    </span>
  );
}

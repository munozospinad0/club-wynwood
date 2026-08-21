import type { Idioma } from "@/lib/i18n";

/**
 * LAS CIFRAS, DIBUJADAS.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * QUÉ ESTABA MAL
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Cinco números en fila: 22 000 ft² · 4 000 ft² · 600 · 300 · 8. Todos ciertos
 * y ninguno legible. Nadie se imagina 22 000 pies cuadrados, y que «600 de pie»
 * sea justo el doble que «300 sentados» hay que deducirlo comparando dos cifras
 * que están separadas por una línea.
 *
 * Es el mismo problema que tenía la planta antes de dibujar las mesas: un
 * número hay que creérselo, una forma se juzga.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * QUÉ DIBUJA CADA UNO
 * ─────────────────────────────────────────────────────────────────────────
 *
 * · Superficie y techado comparten el MISMO plano a escala, con la parte
 *   techada resaltada en una y apagada en la otra. Puestos uno al lado del
 *   otro se ve de un golpe que lo cubierto es una esquina del recinto, no la
 *   mitad — que es la duda que más aparece.
 *
 * · De pie y sentados van en puntos, uno por cada veinte personas. Treinta
 *   puntos contra quince: la mitad se ve, no se calcula.
 *
 * · Las cabañas son ocho formas. Con ocho, contar es más rápido que leer.
 *
 * Nada de esto añade un dato nuevo. Son las mismas cifras verificadas, puestas
 * en una forma que se entiende antes de terminar de leer la etiqueta.
 */

const TINTA = "#211c15";
const OCRE = "#c4772b";
const SUAVE = "#c9c0ad";

/** El lote a escala: 240 × 92 ft, con la palapa de 63 × 63 en su sitio. */
function Plano({ techado }: { techado: boolean }) {
  // 0,62 px por pie. La primera versión iba a 0,29 y el dibujo salía a 70 px:
  // a ese tamaño la palapa era una mancha y el glifo se leía como decoración,
  // que es exactamente lo contrario de lo que se busca. Un dibujo que informa
  // tiene que competir en peso con el número que acompaña.
  const U = 0.62;
  const w = 240 * U, h = 92 * U;
  const px = 10 * U, py = 4 * U, ps = 63 * U;
  return (
    <svg viewBox={`-1 -1 ${w + 2} ${h + 2}`} width={w + 2} height={h + 2}
         aria-hidden style={{ display: "block" }}>
      <rect x="0" y="0" width={w} height={h} fill="none"
            stroke={techado ? SUAVE : TINTA} strokeWidth="0.9" />
      <rect x={px} y={py} width={ps} height={ps}
            fill={techado ? OCRE : SUAVE}
            opacity={techado ? 0.9 : 0.35}
            stroke={techado ? OCRE : "none"} strokeWidth="0.9" />
    </svg>
  );
}

/** Un punto por cada veinte personas. */
function Puntos({ total, destacado }: { total: number; destacado: boolean }) {
  const n = Math.round(total / 20);
  // Diez por fila: 600 caen en tres filas y 300 en una y media. La diferencia
  // se ve por la ALTURA del bloque, sin contar un solo punto.
  const COL = 10, R = 3.2, PASO = 9.4;
  const filas = Math.ceil(n / COL);
  return (
    <svg viewBox={`0 0 ${COL * PASO} ${filas * PASO}`}
         width={COL * PASO} height={filas * PASO}
         aria-hidden style={{ display: "block" }}>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i}
                cx={(i % COL) * PASO + PASO / 2}
                cy={Math.floor(i / COL) * PASO + PASO / 2}
                r={R}
                fill={destacado ? OCRE : TINTA}
                opacity={destacado ? 0.9 : 0.55} />
      ))}
    </svg>
  );
}

function Cabanas({ n }: { n: number }) {
  const W = 11, H = 15, G = 4;
  return (
    <svg viewBox={`0 0 ${n * (W + G)} ${H + 2}`} width={n * (W + G)} height={H + 2}
         aria-hidden style={{ display: "block" }}>
      {Array.from({ length: n }, (_, i) => (
        <rect key={i} x={i * (W + G)} y="1" width={W} height={H} rx="1.2"
              fill={SUAVE} stroke={TINTA} strokeWidth="0.7" />
      ))}
    </svg>
  );
}

interface Celda {
  etiqueta: Record<Idioma, string>;
  valor: string;
  sub?: string;
  glifo: React.ReactNode;
  /** Lo que el dibujo deja claro y el número solo no. */
  lectura?: Record<Idioma, string>;
}

const CELDAS: Celda[] = [
  {
    etiqueta: { es: "Superficie total", en: "Total area" },
    valor: "~22 000 ft²", sub: "2 045 m²",
    glifo: <Plano techado={false} />,
    lectura: { es: "Todo el recinto", en: "The whole site" },
  },
  {
    etiqueta: { es: "Techado", en: "Covered" },
    valor: "~4 000 ft²", sub: "372 m²",
    glifo: <Plano techado />,
    lectura: { es: "Una esquina, no la mitad", en: "One corner, not half" },
  },
  {
    etiqueta: { es: "De pie", en: "Standing" },
    valor: "~600",
    glifo: <Puntos total={600} destacado />,
    lectura: { es: "1 punto = 20 personas", en: "1 dot = 20 people" },
  },
  {
    etiqueta: { es: "Sentados", en: "Seated" },
    valor: "~300",
    glifo: <Puntos total={300} destacado={false} />,
    lectura: { es: "La mitad que de pie", en: "Half of standing" },
  },
  {
    etiqueta: { es: "Cabañas", en: "Cabanas" },
    valor: "8", sub: "",
    glifo: <Cabanas n={8} />,
    lectura: { es: "Amuebladas, ya en el jardín", en: "Furnished, already in the garden" },
  },
];

export default function Cifras({ lang }: { lang: Idioma }) {
  return (
    <section aria-label={lang === "es" ? "Las cifras del recinto" : "The site in figures"}
             style={{ borderBottom: "1px solid var(--regla)", background: "var(--papel-2)" }}>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {CELDAS.map((c) => (
          <div key={c.etiqueta.es}
               style={{ flex: "1 1 200px", padding: "24px 24px 26px",
                        borderRight: "1px solid var(--regla)",
                        display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="ojo">{c.etiqueta[lang]}</div>

            {/* El dibujo va ENTRE la etiqueta y el número, no debajo: así se ve
                antes de leer la cifra, que es justo el orden que buscamos. */}
            {/* Alto fijo para las cinco celdas: si cada glifo ocupa lo que
                necesita, los números quedan a alturas distintas y la fila se
                lee como cinco cosas sueltas en vez de como una tabla. */}
            <div style={{ height: 62, display: "flex", alignItems: "center" }}>
              {c.glifo}
            </div>

            <div>
              <div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 30,
                            lineHeight: 1, letterSpacing: "-.02em" }}>{c.valor}</div>
              {c.sub && <div style={{ fontSize: 12, color: "var(--texto)", paddingTop: 5 }}>{c.sub}</div>}
              {c.lectura && (
                <div style={{ fontSize: 11.5, color: "var(--texto-3)", paddingTop: 6, lineHeight: 1.4 }}>
                  {c.lectura[lang]}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

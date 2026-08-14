import { CLAVES, COTAS, NIVEL_01, NIVEL_02, totalInmueble } from "@/lib/edificio";
import type { Idioma } from "@/lib/i18n";

/**
 * La zona interior, dibujada como sección esquemática.
 *
 * Se dibuja la SECCIÓN y no la planta a propósito: lo que vende este espacio es
 * la altura (22 ft en la zona a doble altura), y una planta no la enseña. Una
 * planta además obligaría a dibujar el reparto interior, que es el montaje del
 * operador y no se alquila.
 *
 * Es Server Component: sin estado, sin JavaScript. Los rastreadores de IA
 * priorizan velocidad sobre ejecutar JS, así que el texto y las cotas llegan
 * en el HTML.
 *
 * SIN ESCALA, y rotulado como tal. Las superficies salen del plano de 2016; las
 * cotas de altura están leídas de él, no deducidas.
 */
export default function Edificio({ lang }: { lang: Idioma }) {
  const es = lang === "es";
  const salas = NIVEL_02.filter((r) => r.duenio === "inmueble");
  const servicios = NIVEL_01.filter((r) => r.duenio === "inmueble");

  return (
    <section
      id="interior"
      aria-label={es ? "La zona interior" : "The indoor zone"}
      style={{ borderBottom: "1px solid var(--regla)", background: "var(--papel-2)" }}
    >
      <div className="reja" style={{ paddingBlock: 76 }}>
        <div className="ojo" style={{ marginBottom: 26 }}>
          {es ? "Zona 02 · interior" : "Zone 02 · indoor"}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: 44,
            marginBottom: 48,
          }}
        >
          <h2 style={{ maxWidth: "14ch" }}>
            {es ? <>Y bajo techo, 22 pies de altura.</> : <>And indoors, 22 feet of clearance.</>}
          </h2>
          {/* Bloque de respuesta citable: conclusión en la primera frase. */}
          <p className="respuesta" style={{ color: "var(--texto)", margin: 0 }}>
            {es
              ? "El edificio suma dos niveles con una zona a doble altura de 22 pies libres, cocina comercial, almacén de A.V. y cinco salas privadas arriba. Es el plan de lluvia de verdad y la respuesta a lo que una productora pregunta antes que nada: cuánto alto tengo."
              : "The building adds two levels with a double-height zone of 22 feet clear, a commercial kitchen, A.V. storage and five private rooms upstairs. It is the real rain plan and the answer to what a production company asks first: how much height do I have."}
          </p>
        </div>

        {/* -------- SECCIÓN ESQUEMÁTICA -------- */}
        <figure style={{ margin: "0 0 44px" }}>
          <svg
            viewBox="0 0 900 320"
            role="img"
            aria-label={
              es
                ? "Sección esquemática del edificio: nivel 01 con 12 pies de altura, zona a doble altura de 22 pies y nivel 02 con salas privadas"
                : "Schematic section of the building: level 01 at 12 feet, a double-height zone at 22 feet, and level 02 with private rooms"
            }
            style={{ width: "100%", height: "auto", display: "block" }}
          >
            {/* suelo */}
            <line x1="40" y1="270" x2="860" y2="270" stroke="#7d725f" strokeWidth="1.2" />

            {/* envolvente */}
            <path
              d="M60,270 L60,60 L840,60 L840,270"
              fill="none"
              stroke="#211c15"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />

            {/* forjado del nivel 02: solo sobre la parte izquierda; la derecha es
                el vacío a doble altura */}
            <line x1="60" y1="160" x2="480" y2="160" stroke="#211c15" strokeWidth="1.5" />
            <line x1="60" y1="152" x2="480" y2="152" stroke="#dad3c7" strokeWidth="6" />

            {/* salas privadas del nivel 02, cinco huecos */}
            {[0, 1, 2, 3, 4].map((i) => (
              <rect
                key={i}
                x={78 + i * 80}
                y={86}
                width={62}
                height={62}
                fill="#f8f3ea"
                stroke="#7d725f"
                strokeWidth="0.9"
              />
            ))}

            {/* cocina y servicios en planta baja */}
            <rect x="78" y="196" width="118" height="70" fill="#f8f3ea" stroke="#7d725f" strokeWidth="0.9" />
            <rect x="206" y="196" width="86" height="70" fill="#f8f3ea" stroke="#7d725f" strokeWidth="0.9" />

            {/* zona a doble altura, rayada */}
            <defs>
              <pattern id="rayado" width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="7" stroke="#c6beb0" strokeWidth="1" />
              </pattern>
            </defs>
            <rect x="500" y="62" width="338" height="206" fill="url(#rayado)" opacity="0.75" />

            {/* cota de 22 ft */}
            <line x1="640" y1="66" x2="640" y2="266" stroke="#c4772b" strokeWidth="0.9" />
            <path d="M636,72 L640,62 L644,72" fill="none" stroke="#c4772b" strokeWidth="0.9" />
            <path d="M636,260 L640,270 L644,260" fill="none" stroke="#c4772b" strokeWidth="0.9" />
            {/* Template literal y no `{valor} FT`: React inserta separadores
                entre una expresión y el texto que la sigue, y la cota quedaría
                partida en el HTML para cualquiera que la lea automáticamente. */}
            <text x="652" y="170" fontFamily="ui-monospace,monospace" fontSize="13" fill="#c4772b">
              {`${COTAS.alturaDobleFt} FT`}
            </text>

            {/* cota de 12 ft */}
            <line x1="330" y1="166" x2="330" y2="266" stroke="#7d725f" strokeWidth="0.8" />
            <path d="M327,171 L330,162 L333,171" fill="none" stroke="#7d725f" strokeWidth="0.8" />
            <path d="M327,261 L330,270 L333,261" fill="none" stroke="#7d725f" strokeWidth="0.8" />
            <text x="340" y="222" fontFamily="ui-monospace,monospace" fontSize="12" fill="#7d725f">
              {`${COTAS.alturaPlantaFt} FT`}
            </text>

            {/* rótulos */}
            <text x="78" y="80" fontFamily="ui-monospace,monospace" fontSize="11" letterSpacing="2" fill="#7d725f">
              {es ? "NIVEL 02 · SALAS PRIVADAS" : "LEVEL 02 · PRIVATE ROOMS"}
            </text>
            <text x="78" y="188" fontFamily="ui-monospace,monospace" fontSize="11" letterSpacing="2" fill="#7d725f">
              {es ? "NIVEL 01 · COCINA Y SERVICIOS" : "LEVEL 01 · KITCHEN & SERVICES"}
            </text>
            <text x="510" y="52" fontFamily="ui-monospace,monospace" fontSize="11" letterSpacing="2" fill="#c4772b">
              {es ? "DOBLE ALTURA" : "DOUBLE HEIGHT"}
            </text>
          </svg>

          <figcaption className="ojo" style={{ paddingTop: 14, lineHeight: 1.7 }}>
            {es
              ? "Sección esquemática · sin escala · superficies del plano de 2016, cotas por verificar en visita"
              : "Schematic section · not to scale · areas from the 2016 plan, dimensions to be verified on site"}
          </figcaption>
        </figure>

        {/* -------- LO QUE DECIDE -------- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))",
            gap: 0,
            borderTop: "1px solid var(--regla)",
          }}
        >
          {CLAVES.map((c) => (
            <div key={c.valor} style={{ padding: "24px 24px 26px 0" }}>
              <div className="ojo" style={{ paddingBottom: 10 }}>{c.etiqueta[lang]}</div>
              <div
                style={{
                  fontFamily: "var(--display)",
                  fontWeight: 600,
                  fontSize: 30,
                  lineHeight: 1,
                  letterSpacing: "-.02em",
                  paddingBottom: 10,
                }}
              >
                {c.valor}
              </div>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: "var(--texto)" }}>
                {c.nota[lang]}
              </p>
            </div>
          ))}
        </div>

        {/* -------- QUÉ ENTRA Y QUÉ NO -------- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 44,
            paddingTop: 44,
            borderTop: "1px solid var(--regla)",
          }}
        >
          <div>
            <div className="ojo" style={{ paddingBottom: 14 }}>
              {es ? "Nivel 02 · salas" : "Level 02 · rooms"}
            </div>
            {salas.map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                  padding: "9px 0",
                  borderBottom: "1px solid var(--regla)",
                  fontSize: 14,
                }}
              >
                <span>{r.nombre[lang]}</span>
                <span style={{ color: "var(--texto)" }}>{r.sqft} ft²</span>
              </div>
            ))}
            <div style={{ paddingTop: 12, fontSize: 13, color: "var(--texto)" }}>
              {es ? "Total salas: " : "Rooms total: "}
              {totalInmueble(NIVEL_02)} ft²
            </div>
          </div>

          <div>
            <div className="ojo" style={{ paddingBottom: 14 }}>
              {es ? "Nivel 01 · servicios" : "Level 01 · services"}
            </div>
            {servicios.map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                  padding: "9px 0",
                  borderBottom: "1px solid var(--regla)",
                  fontSize: 14,
                }}
              >
                <span>{r.nombre[lang]}</span>
                <span style={{ color: "var(--texto)" }}>{r.sqft} ft²</span>
              </div>
            ))}

            <p style={{ margin: "18px 0 0", fontSize: 13.5, lineHeight: 1.62, color: "var(--texto)" }}>
              {es
                ? "El resto del nivel 01 es superficie diáfana. Lo que hoy hay montado ahí pertenece al operador que ocupa el predio y no forma parte del alquiler."
                : "The rest of level 01 is open floor. Whatever is installed there today belongs to the operator occupying the site and is not part of the rental."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

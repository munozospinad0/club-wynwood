import Image from "next/image";
import { porId } from "@/lib/fotos";
import type { Idioma } from "@/lib/i18n";

/**
 * Una foto del sitio, o su marcador si todavía no existe.
 *
 * TODAS las imágenes pasan por aquí. Así, cuando llegue una foto nueva basta
 * con dejarla en /public/assets con su nombre y poner `existe: true` en
 * lib/fotos.ts: no hay que tocar ni una página.
 *
 * Y mientras falte, se pinta un marcador CON EL ENCARGO ESCRITO ENCIMA. Es
 * deliberado: un hueco visible se rellena, y una foto repetida por quinta vez
 * pasa desapercibida hasta que la ve el cliente. Hoy hay 3 imágenes cubriendo
 * 17 huecos y eso no se nota hasta que alguien lo mira con calma.
 */
export default function Foto({
  id, lang, sizes = "(max-width: 880px) 100vw, 50vw", prioridad = false, pie,
}: {
  id: string;
  lang: Idioma;
  sizes?: string;
  prioridad?: boolean;
  /** Si se pasa, se pinta debajo como pie de foto. */
  pie?: string;
}) {
  const h = porId(id);
  if (!h) return null;
  const es = lang === "es";

  const marco: React.CSSProperties = {
    position: "relative",
    aspectRatio: h.proporcion.replace("/", " / "),
    width: "100%",
    overflow: "hidden",
  };

  if (!h.existe) {
    // Marcador. No es un gris vacío: lleva el encargo, para que sirva de brief.
    return (
      <figure style={{ margin: 0 }}>
        <div
          style={{
            ...marco,
            background:
              "repeating-linear-gradient(45deg, #ece5d6 0 10px, #e6dfd0 10px 20px)",
            border: "1px solid var(--regla)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px 28px",
          }}
          role="img"
          aria-label={h.alt[lang]}
        >
          <div style={{ maxWidth: "46ch", textAlign: "center" }}>
            <div className="ojo" style={{ color: "var(--ocre)", paddingBottom: 10 }}>
              {es ? "Foto pendiente" : "Photo pending"} · {h.archivo}
            </div>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: "var(--texto)" }}>
              {h.encargo[lang]}
            </p>
          </div>
        </div>
        {pie && <figcaption className="ojo" style={{ paddingTop: 12 }}>{pie}</figcaption>}
      </figure>
    );
  }

  return (
    <figure style={{ margin: 0 }}>
      <div style={marco}>
        <Image
          src={`/assets/${h.archivo}`}
          alt={h.alt[lang]}
          fill
          sizes={sizes}
          priority={prioridad}
          style={{ objectFit: "cover", filter: "saturate(.94) contrast(1.04)" }}
        />
      </div>
      {pie && <figcaption className="ojo" style={{ paddingTop: 12 }}>{pie}</figcaption>}
    </figure>
  );
}

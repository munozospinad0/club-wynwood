import type { Idioma } from "@/lib/i18n";
import FormularioLegal from "@/components/FormularioLegal";

/**
 * RESIDENCIA PERMANENTE — la página del servicio legal.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * POR QUÉ ESTA PÁGINA EXISTE Y POR QUÉ ESTÁ APARTE
 * ─────────────────────────────────────────────────────────────────────────
 *
 * El sitio viejo de GoDaddy mezclaba dos negocios en el mismo dominio: el
 * alquiler del venue y la asesoría de inmigración de Sandra Clavijo. Al mover
 * el dominio a Vercel ese contenido se caía, y Daniel pidió conservarlo:
 * «mantén ese contenido, son cosas adicionales… mantenlo como una página del
 * sitio pero no del todo, son proyectos separados, pero si llega un lead por
 * ahí, okey».
 *
 * De ahí salen las cuatro reglas de esta página:
 *
 *  1. **No entra en la navegación.** Solo se llega desde el pie. Quien busca
 *     un venue no tiene que tropezarse con una consulta migratoria, y quien
 *     busca abogada no aterriza aquí desde una búsqueda de eventos.
 *  2. **Dice de entrada que es otra cosa.** No se disimula ni se presenta como
 *     un servicio del venue: es una firma de abogados independiente.
 *  3. **Sus leads NO son leads del venue.** Van al CRM de la firma, por
 *     `/api/consulta-legal`. No cuentan como conversión del venue ni entran en
 *     su cualificación: contarlos sería enseñarle a Meta que un caso de
 *     inmigración es un alquiler de espacio.
 *  4. **Cumple la regla 4-7.13 del Florida Bar.** Sin garantías de resultado,
 *     sin métricas inventadas, con el aviso de que cada caso es único y con la
 *     advertencia de que este formulario no crea relación abogado-cliente.
 *     Esto no es opcional: es riesgo real para la abogada.
 *
 * El texto se conserva del sitio anterior, corregido de ortografía y sin la
 * promesa de «maximización de probabilidades de éxito», que es exactamente lo
 * que esa regla prohíbe.
 */

const T = {
  es: {
    ojo: "Servicio legal · firma independiente",
    h1: "Residencia permanente en Estados Unidos",
    lead:
      "Esta página no es del alquiler del venue. Es el servicio de Law Offices of Sandra Clavijo, una firma de abogados de inmigración con sede en Miami que asesora procesos de residencia por inversión EB-5 Direct.",
    quienTitulo: "Quién asesora",
    quien:
      "Sandra Clavijo es abogada de inmigración en Miami y asesora procesos EB-5 Direct: acompaña al inversionista desde la estructuración de la inversión hasta la solicitud de residencia, revisando el cumplimiento legal y el requisito de generación de empleo. El enfoque es por perfil, porque no todos los casos admiten la misma vía.",
    queTitulo: "Qué es la EB-5 Direct",
    que:
      "La EB-5 es el programa de residencia por inversión de Estados Unidos. En la modalidad Direct, el inversionista crea y gestiona su propio negocio: tiene control directo sobre la inversión y sobre los empleos que genera, a diferencia de los proyectos a través de centros regionales, donde participa como inversionista pasivo en un proyecto de terceros.",
    pdf: "El proceso EB-5 Direct, paso a paso",
    pdfNota: "Documento de la firma, en PDF.",
    formTitulo: "Hablar con la firma",
    formLead:
      "Cuéntanos tu situación y la firma se comunica contigo. Lo que escribas aquí llega al equipo de Sandra Clavijo, no al del venue.",
    firmaTitulo: "Law Offices of Sandra Clavijo",
    firmaLead: "El sitio completo de la firma, con las demás vías migratorias.",
    firmaEnlace: "Ir a sclavijo.com",
    aviso: "Aviso legal",
    avisoTexto:
      "Publicidad de abogados. La información de esta página es general y no constituye asesoría legal para un caso concreto. Cada caso es único y los resultados anteriores no garantizan resultados futuros. Enviar el formulario no crea una relación abogado-cliente: esa relación empieza únicamente con un acuerdo firmado.",
    separado:
      "Club Wynwood alquila el espacio exterior para eventos. La asesoría migratoria es un servicio distinto, de una firma distinta, con su propio equipo y su propia contratación.",
  },
  en: {
    ojo: "Legal service · independent firm",
    h1: "Permanent residency in the United States",
    lead:
      "This page is not about renting the venue. It is the service of Law Offices of Sandra Clavijo, a Miami-based immigration law firm that advises on EB-5 Direct residency-by-investment cases.",
    quienTitulo: "Who advises",
    quien:
      "Sandra Clavijo is an immigration attorney in Miami and advises on EB-5 Direct cases: she works with the investor from structuring the investment through the residency petition, reviewing legal compliance and the job-creation requirement. The approach is profile by profile, because not every case supports the same route.",
    queTitulo: "What EB-5 Direct is",
    que:
      "EB-5 is the United States residency-by-investment program. In the Direct route the investor creates and runs their own business: they hold direct control over the investment and over the jobs it creates, unlike regional-center projects, where they take part as a passive investor in someone else's project.",
    pdf: "The EB-5 Direct process, step by step",
    pdfNota: "Firm document, PDF.",
    formTitulo: "Talk to the firm",
    formLead:
      "Tell us about your situation and the firm will get back to you. What you write here reaches Sandra Clavijo's team, not the venue's.",
    firmaTitulo: "Law Offices of Sandra Clavijo",
    firmaLead: "The firm's full site, with the other immigration routes.",
    firmaEnlace: "Go to sclavijo.com",
    aviso: "Legal notice",
    avisoTexto:
      "Attorney advertising. The information on this page is general and is not legal advice for any specific matter. Every case is unique and prior results do not guarantee future outcomes. Submitting the form does not create an attorney-client relationship: that relationship begins only with a signed engagement.",
    separado:
      "Club Wynwood rents the outdoor space for events. Immigration counsel is a separate service, from a separate firm, with its own team and its own engagement.",
  },
} as const;

export default function Residencia({ lang }: { lang: Idioma }) {
  const t = T[lang];

  return (
    <>
      {/* Banda de separación. Es lo primero que se ve y dice, sin rodeos, que
          esto no es el venue. */}
      <div style={{ background: "var(--tinta)", color: "var(--papel-3)" }}>
        <div className="reja" style={{ paddingBlock: 18 }}>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, maxWidth: "78ch" }}>
            {t.separado}
          </p>
        </div>
      </div>

      <header className="reja" style={{ paddingBlock: "56px 48px" }}>
        <div className="ojo" style={{ paddingBottom: 20 }}>{t.ojo}</div>
        <h1 style={{ maxWidth: "18ch", marginBottom: 26 }}>{t.h1}</h1>
        <p className="respuesta" style={{ fontSize: 18 }}>{t.lead}</p>
      </header>

      <section style={{ borderBlock: "1px solid var(--regla)", background: "var(--papel-2)" }}>
        <div className="reja" style={{ paddingBlock: 64 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 48 }}>
            <div>
              <h2 style={{ fontSize: 19, fontFamily: "var(--cuerpo)", fontWeight: 600, letterSpacing: "-.01em", marginBottom: 14 }}>
                {t.quienTitulo}
              </h2>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.68, color: "#4a4335" }}>{t.quien}</p>
            </div>
            <div>
              <h2 style={{ fontSize: 19, fontFamily: "var(--cuerpo)", fontWeight: 600, letterSpacing: "-.01em", marginBottom: 14 }}>
                {t.queTitulo}
              </h2>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.68, color: "#4a4335" }}>{t.que}</p>
            </div>
          </div>

          {/* El PDF estaba alojado en GoDaddy y se caía con el dominio viejo.
              Ahora se sirve desde este repositorio. */}
          <div style={{ marginTop: 40, paddingTop: 28, borderTop: "1px solid var(--regla)" }}>
            <a
              className="boton"
              href="/documentos/proceso-eb5-direct.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.pdf} <span aria-hidden>↓</span>
            </a>
            <p style={{ margin: "12px 0 0", fontSize: 13, color: "var(--texto)" }}>{t.pdfNota}</p>
          </div>
        </div>
      </section>

      <section style={{ borderBottom: "1px solid var(--regla)" }}>
        <div className="reja" style={{ paddingBlock: 72 }}>
          <div className="ojo" style={{ paddingBottom: 18 }}>{t.formTitulo}</div>
          <p className="respuesta" style={{ marginBottom: 34, color: "var(--texto)" }}>{t.formLead}</p>
          <FormularioLegal lang={lang} />
        </div>
      </section>

      <section style={{ borderBottom: "1px solid var(--regla)" }}>
        <div className="reja" style={{ paddingBlock: 56, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 40 }}>
          <div>
            <h2 style={{ fontSize: 19, fontFamily: "var(--cuerpo)", fontWeight: 600, letterSpacing: "-.01em", marginBottom: 12 }}>
              {t.firmaTitulo}
            </h2>
            <p style={{ margin: "0 0 16px", fontSize: 15, color: "#4a4335" }}>{t.firmaLead}</p>
            <a
              href="https://sclavijo.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ocre)" }}
            >
              {t.firmaEnlace} →
            </a>
          </div>

          <div>
            <div className="ojo" style={{ paddingBottom: 12 }}>{t.aviso}</div>
            {/* `data-nosnippet` para que un buscador no saque el descargo de
                contexto como si fuera el resumen de la página. */}
            <p data-nosnippet style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "var(--texto)", maxWidth: "62ch" }}>
              {t.avisoTexto}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

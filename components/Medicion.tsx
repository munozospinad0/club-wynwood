import Script from "next/script";

/**
 * LA CAPA DE MEDICIÓN. Consentimiento primero, contenedor después.
 *
 * Sustituye a `Gtm.tsx`, que solo cargaba el contenedor. Faltaban tres cosas y
 * las tres importan desde el primer día.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * 1. EL CONSENTIMIENTO SE DECLARA ANTES, O NO SIRVE
 * ─────────────────────────────────────────────────────────────────────────
 *
 * El estado por defecto del Modo de Consentimiento tiene que existir **antes**
 * de que cargue ninguna etiqueta. Si llega después, la etiqueta ya se disparó
 * con el estado que ella supuso, y la declaración no repara nada.
 *
 * Por eso esto NO usa `next/script`: va como etiqueta plana en el árbol, que el
 * navegador ejecuta de forma síncrona en el orden en que aparece. Con
 * `strategy="afterInteractive"` llegaría tarde, y no daría ningún error.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * 2. POR QUÉ NO HAY BANNER DE COOKIES, Y POR QUÉ ESO ES CORRECTO
 * ─────────────────────────────────────────────────────────────────────────
 *
 * El público es Miami y Latinoamérica. Un banner cuesta conversión real a cambio
 * de cubrir un tráfico europeo que aquí es anecdótico.
 *
 * La salida es declarar el consentimiento **denegado por región** para el Espacio
 * Económico Europeo y el Reino Unido, y concedido en el resto. El visitante
 * europeo queda medido solo de forma agregada y modelada, que es exactamente lo
 * que la norma pide cuando no se ha pedido permiso. Nadie ve un banner y nadie
 * queda medido sin base para ello.
 *
 * Si algún día se pauta en Europa, aquí es donde se cambia: se pasa a denegado
 * global y se monta la petición de permiso.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * 3. EL `<noscript>` NO ES OPCIONAL
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Sin él se pierde la visita de todo el que navega con el script bloqueado. No
 * son muchos, pero son gratis de recuperar.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * DOS TRANSPORTES, Y SE USA UNO
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Con `NEXT_PUBLIC_GTM_ID` se carga el contenedor y GA4 y el píxel se montan
 * dentro: el sitio no conoce ninguna herramienta, solo empuja al `dataLayer`.
 *
 * Con `NEXT_PUBLIC_GA4_ID` y sin contenedor se carga GA4 directo. Es la salida
 * para medir desde hoy sin esperar a que exista el contenedor, y el `dataLayer`
 * es el mismo, así que los eventos del sitio llegan igual.
 *
 * Si están las dos, manda el contenedor: cargar las dos contaría cada visita
 * dos veces.
 */

/**
 * Espacio Económico Europeo, más Reino Unido y Suiza.
 *
 * Se escriben los códigos uno a uno a propósito: no hay un código «UE» estable
 * en esta interfaz, y una abreviatura inventada se ignora en silencio, dejando
 * a Europa medida sin permiso mientras el código aparenta cubrirla.
 */
const EEE = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU",
  "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES",
  "SE", "IS", "LI", "NO", "GB", "CH",
];

const CONSENTIMIENTO = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{
  ad_storage:'denied',
  ad_user_data:'denied',
  ad_personalization:'denied',
  analytics_storage:'denied',
  region:${JSON.stringify(EEE)},
  wait_for_update:500
});
gtag('consent','default',{
  ad_storage:'granted',
  ad_user_data:'granted',
  ad_personalization:'granted',
  analytics_storage:'granted'
});
gtag('set','ads_data_redaction',true);
gtag('set','url_passthrough',true);
`.trim();

export default function Medicion() {
  const gtm = process.env.NEXT_PUBLIC_GTM_ID;
  const ga4 = process.env.NEXT_PUBLIC_GA4_ID;
  /**
   * La etiqueta de Google Ads, `AW-XXXXXXXXX`.
   *
   * Va aparte de GA4 a propósito. La conversión que gobierna la puja se mide
   * NATIVA en Google Ads; la de GA4 se importa como secundaria, si acaso. Contar
   * las dos como principales le enseña a Google que cada lead vale el doble, y
   * con dos a cuatro leads al mes ese error no se detecta mirando la curva.
   *
   * Cargar la etiqueta aquí también es lo que hace que exista la cookie
   * `_gcl_aw`, de donde `lib/atribucion.ts` rescata el `gclid` cuando el
   * parámetro de la URL se perdió por el camino.
   */
  const ads = process.env.NEXT_PUBLIC_ADS_ID;
  /**
   * El píxel de Meta. Se carga aunque la conversión la mande el CRM.
   *
   * Parece redundante y no lo es: las cookies `_fbp` y `_fbc` **las escribe este
   * píxel y solo existen en el navegador de la persona**. Sin ellas, la API de
   * Conversiones se queda con el hash del correo y poco más, y la coincidencia
   * se desploma justo en el público que peor casa por correo.
   *
   * El doble conteo lo evita el `event_id`: el formulario genera uno y lo manda
   * por los dos caminos, y Meta reconoce que es el mismo hecho.
   */
  const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <>
      {/* Etiqueta plana y síncrona: tiene que correr antes que todo lo demás. */}
      <script dangerouslySetInnerHTML={{ __html: CONSENTIMIENTO }} />

      {gtm ? (
        <>
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtm}');`}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtm}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="gtm"
            />
          </noscript>
        </>
      ) : ga4 || ads ? (
        <>
          <Script
            id="ga4-lib"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4 || ads}`}
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`gtag('js', new Date());
${ga4 ? `gtag('config', '${ga4}');` : ""}
${ads ? `gtag('config', '${ads}');` : ""}
// Sin contenedor, gtag NO lee el dataLayer: lib/medicion.ts mira esta bandera
// para mandar además el evento por gtag(). Ver el comentario de ev().
window.__cwGa4Directo = ${ga4 ? "true" : "false"};
window.__cwAds = ${ads ? `'${ads}'` : "''"};`}
          </Script>
        </>
      ) : null}

      {/**
        * EL PÍXEL, SOLO SI NO HAY CONTENEDOR.
        *
        * Antes se cargaba fuera del condicional, y eso contradecía lo que
        * promete el comentario de arriba y lo que dice `docs/11-PLATAFORMAS.md`:
        * que al poner el contenedor las etiquetas directas se apagan solas.
        *
        * No era un problema hoy —no hay contenedor— pero era una trampa armada
        * para el día que se pusiera: dos cargadores del mismo píxel significan
        * **dos `PageView` por visita**, y dos `Lead` por formulario de los
        * cuales solo uno lleva `eventID`. Meta no puede deduplicar dos eventos
        * cuando a uno le falta el identificador, así que el informe saldría al
        * doble y el coste por lead a la mitad del real.
        */}
      {pixel && !gtm ? (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${pixel}');fbq('track','PageView');
// Lo mira lib/medicion.ts antes de disparar el Lead del navegador: si el píxel
// lo cargara el contenedor y no nosotros, disparar aquí lo contaría dos veces.
window.__cwPixel = true;`}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              alt=""
              src={`https://www.facebook.com/tr?id=${pixel}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      ) : null}
    </>
  );
}

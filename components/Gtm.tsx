import Script from "next/script";

/**
 * El contenedor de Google Tag Manager.
 *
 * GA4 y el píxel de Meta se montan DENTRO de GTM, no aquí. Así el sitio no
 * conoce ninguna herramienta de medición: empuja eventos al `dataLayer` y ya.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * POR QUÉ IMPORTA QUE ESTO EXISTA, MÁS ALLÁ DE «MEDIR»
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Las cookies `_fbp` y `_fbc` **las escribe el píxel de Meta y solo existen en
 * el navegador de la persona**. Sin píxel no hay cookies, y el formulario
 * manda cadenas vacías: la API de Conversiones se queda con el hash del correo
 * y poco más, y la coincidencia se desploma.
 *
 * Y el `event_id` que el formulario genera para que Meta cuente UNA conversión
 * en vez de dos no sirve de nada mientras no haya un evento de navegador con el
 * que colisionar.
 *
 * Sin `NEXT_PUBLIC_GTM_ID` no se carga nada. No es un fallo: es que todavía no
 * hay contenedor. Los eventos se siguen acumulando en el `dataLayer`.
 */

export default function Gtm() {
  const id = process.env.NEXT_PUBLIC_GTM_ID;
  if (!id) return null;

  return (
    <Script id="gtm" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');`}
    </Script>
  );
}

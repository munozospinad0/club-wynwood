import { redirect } from "next/navigation";
import { IDIOMA_POR_DEFECTO } from "@/lib/i18n";

/**
 * La raíz redirige al idioma por defecto, CONSERVANDO EL QUERY STRING.
 *
 * Se hace con redirect() del servidor (307) y no con JavaScript en cliente:
 * los rastreadores de IA priorizan velocidad sobre ejecutar scripts, y una
 * redirección en cliente los deja mirando una página vacía.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * POR QUÉ SE ARRASTRAN LOS PARÁMETROS, Y POR QUÉ ERA URGENTE
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Hasta el 8-sep-2026 esto redirigía a `/en` a secas. O sea que
 * `clubwynwood.com/?utm_source=facebook&utm_campaign=artweek&fbclid=…`
 * —la forma exacta que tiene el enlace de un anuncio— aterrizaba en `/en`
 * **sin un solo parámetro**.
 *
 * El efecto: cada visita pagada llegaba a GA4 como tráfico directo y sin
 * campaña, `lib/atribucion.ts` no encontraba nada que guardar, y el `fbclid`
 * se perdía, que es lo que Meta necesita para saber qué anuncio trajo el lead.
 * Con dos a cuatro leads al mes, eso no se detecta mirando la curva: se
 * descubre meses después preguntándose por qué «nada funciona».
 *
 * No daba ningún error, y por eso hay que dejarlo escrito aquí.
 */
export default async function Raiz({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = new URLSearchParams();
  for (const [clave, valor] of Object.entries(sp)) {
    if (Array.isArray(valor)) for (const v of valor) q.append(clave, v);
    else if (valor !== undefined) q.set(clave, valor);
  }
  const cola = q.toString();
  redirect(`/${IDIOMA_POR_DEFECTO}${cola ? `?${cola}` : ""}`);
}

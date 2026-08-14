import { redirect } from "next/navigation";
import { IDIOMA_POR_DEFECTO } from "@/lib/i18n";

/**
 * La raíz redirige al idioma por defecto.
 *
 * Se hace con redirect() del servidor (307) y no con JavaScript en cliente:
 * los rastreadores de IA priorizan velocidad sobre ejecutar scripts, y una
 * redirección en cliente los deja mirando una página vacía.
 */
export default function Raiz() {
  redirect(`/${IDIOMA_POR_DEFECTO}`);
}

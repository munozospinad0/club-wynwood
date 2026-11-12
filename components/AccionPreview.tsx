"use client";

import { ev } from "@/lib/medicion";

/**
 * Enlace medido de la página del evento (app/[lang]/preview).
 *
 * La página es de servidor; lo único que necesita el navegador es avisar del
 * clic. Cada acción sale como `contact_click` con su método, igual que el
 * teléfono y el correo del resto del sitio, para que el informe diga cuántos
 * confirmaron, cuántos guardaron la fecha y cuántos pidieron la ruta.
 */
export default function AccionPreview({ href, metodo, className, children, descarga }: {
  href: string;
  metodo: "email" | "calendario" | "mapa";
  className?: string;
  children: React.ReactNode;
  /** Nombre del archivo si el enlace descarga algo (el .ics). */
  descarga?: string;
}) {
  const externo = href.startsWith("http");
  return (
    <a
      href={href}
      className={className}
      download={descarga}
      onClick={() => ev("contact_click", { method: metodo, desde: "preview_18nov" })}
      {...(externo ? { target: "_blank", rel: "noopener" } : {})}
    >
      {children}
    </a>
  );
}

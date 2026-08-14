/**
 * Layout raíz.
 *
 * Next exige un layout en la raíz con <html> y <body>. Como el <html lang> real
 * depende del idioma, el que manda es app/[lang]/layout.tsx: este solo existe
 * para la redirección de app/page.tsx y para el 404.
 */
export const metadata = { title: "Club Wynwood" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}

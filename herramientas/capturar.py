#!/usr/bin/env python3
"""Capturas de verdad, con viewport de verdad.

    ~/.venvs/scrapling/bin/python herramientas/capturar.py <url> <salida.png> [ancho] [--completa]

POR QUE NO VALE `chrome --headless --window-size`
================================================
`--window-size` fija el tamano de la VENTANA, no el viewport CSS que ven las
media queries, y ademas devuelve paginas medio en blanco cuando hay imagenes o
fuentes por cargar. Con eso «diagnostique» un desborde en movil que no existia y
un par de capturas vacias que parecian fallos del sitio. No lo eran.

Playwright fija el viewport de verdad y espera a que la red se calme.
"""
import sys, asyncio
from playwright.async_api import async_playwright

URL = sys.argv[1]
SALIDA = sys.argv[2]
ANCHO = int(sys.argv[3]) if len(sys.argv) > 3 and sys.argv[3].isdigit() else 1280
COMPLETA = "--completa" in sys.argv


async def main():
    async with async_playwright() as pw:
        nav = await pw.chromium.launch()
        pag = await nav.new_page(
            viewport={"width": ANCHO, "height": 900},
            device_scale_factor=2 if ANCHO <= 500 else 1,
        )
        await pag.goto(URL, wait_until="networkidle", timeout=90_000)
        # Un barrido hasta abajo: dispara la carga diferida de las imagenes, que
        # es por lo que salian huecos donde si habia foto.
        await pag.evaluate("""async () => {
          const paso = window.innerHeight;
          for (let y = 0; y < document.body.scrollHeight; y += paso) {
            window.scrollTo(0, y);
            await new Promise(r => setTimeout(r, 120));
          }
          window.scrollTo(0, 0);
          await new Promise(r => setTimeout(r, 400));
        }""")
        await pag.screenshot(path=SALIDA, full_page=COMPLETA)
        alto = await pag.evaluate("document.body.scrollHeight")
        await nav.close()
    print(f"  {SALIDA}  ·  viewport {ANCHO}px  ·  pagina {alto}px de alto")


asyncio.run(main())

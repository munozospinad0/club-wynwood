#!/usr/bin/env python3
"""Encuentra QUE elemento desborda a lo ancho, en vez de adivinarlo.

    ~/.venvs/scrapling/bin/python herramientas/medir-desborde.py [url] [ancho]

POR QUE HACE FALTA
==================
`responsive.css` acaba con esto:

    html, body { max-width: 100%; overflow-x: hidden; }

Eso no arregla un desborde: lo TAPA. En vez de una barra de scroll horizontal
—molesta pero visible— el contenido que se sale se recorta y desaparece. El
sintoma se va, el problema se queda, y encima se vuelve invisible.

Este script quita esa red un momento, mide, y dice exactamente que elementos son
mas anchos que la ventana y por cuanto. Con eso se arregla la causa y la red
puede quedarse como lo que debe ser: una red, no el arreglo.
"""
import sys, asyncio
from playwright.async_api import async_playwright

URL = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3210/es"
ANCHO = int(sys.argv[2]) if len(sys.argv) > 2 else 390

MEDIR = """
() => {
  // Se quita la red de seguridad para que el desborde se pueda medir.
  const html = document.documentElement, body = document.body;
  const previo = [html.style.overflowX, body.style.overflowX, html.style.maxWidth, body.style.maxWidth];
  html.style.overflowX = body.style.overflowX = 'visible';
  html.style.maxWidth = body.style.maxWidth = 'none';

  const vw = window.innerWidth;
  const culpables = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    const sobra = Math.round(r.right - vw);
    if (sobra > 1) {
      // Solo el elemento MAS PROFUNDO de cada rama: si un hijo desborda, el
      // padre tambien lo hace, y listar los dos es ruido.
      const hijoCulpable = [...el.children].some(c => {
        const cr = c.getBoundingClientRect();
        return cr.right - vw > 1;
      });
      if (hijoCulpable) continue;
      culpables.push({
        etiqueta: el.tagName.toLowerCase(),
        clase: (el.className && typeof el.className === 'string' ? el.className : '').slice(0, 40),
        id: el.id || '',
        sobra,
        ancho: Math.round(r.width),
        izq: Math.round(r.left),
        texto: (el.textContent || '').trim().slice(0, 60),
      });
    }
  }
  const total = { docWidth: Math.round(html.scrollWidth), vw };

  html.style.overflowX = previo[0]; body.style.overflowX = previo[1];
  html.style.maxWidth = previo[2];  body.style.maxWidth = previo[3];
  return { total, culpables: culpables.sort((a,b) => b.sobra - a.sobra).slice(0, 14) };
}
"""


async def main():
    async with async_playwright() as pw:
        nav = await pw.chromium.launch()
        pag = await nav.new_page(viewport={"width": ANCHO, "height": 900})
        await pag.goto(URL, wait_until="networkidle", timeout=90_000)
        r = await pag.evaluate(MEDIR)
        await nav.close()

    t = r["total"]
    print(f"\n{URL}  ·  ventana {t['vw']} px")
    print(f"ancho real del documento: {t['docWidth']} px  "
          f"({'DESBORDA ' + str(t['docWidth'] - t['vw']) + ' px' if t['docWidth'] > t['vw'] else 'sin desborde'})\n")

    if not r["culpables"]:
        print("  nada se sale. La red de seguridad no esta tapando nada.")
        return

    print(f"{'sobra':>7}  {'ancho':>6}  {'izq':>5}  elemento")
    print("-" * 78)
    for c in r["culpables"]:
        quien = c["etiqueta"]
        if c["id"]:
            quien += "#" + c["id"]
        if c["clase"]:
            quien += "." + c["clase"].replace(" ", ".")
        print(f"{c['sobra']:>6}px  {c['ancho']:>5}  {c['izq']:>5}  {quien}")
        if c["texto"]:
            print(f"{'':>21}«{c['texto']}»")


asyncio.run(main())

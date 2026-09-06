# Herramientas de verificación

Dos scripts que existen por un motivo concreto: **usé la herramienta equivocada
y reporté un fallo que no existía.**

---

## Lo que pasó

Para revisar el sitio en móvil usé Chrome sin interfaz:

```
chrome --headless --window-size=390,2600 --screenshot=x.png <url>
```

Salió el texto cortado por la derecha en todos los bloques. Lo comprobé también
en una página interior sin láminas, salió igual, y concluí que el sitio entero
desbordaba a lo ancho en móvil. **Lo di por un bug grave y no lo era.**

`--window-size` fija el tamaño de la **ventana**, no el **viewport CSS** que ven
las media queries. Y encima devuelve páginas medio en blanco cuando quedan
imágenes o fuentes por cargar — por eso también di por no verificada una foto
que sí se veía.

Medido con Playwright, que sí fija el viewport: **0 px de desborde** en tres
páginas a 360 y a 390 px.

La lección no es «Playwright es mejor». Es que **una captura no es una medición**,
y yo saqué una conclusión numérica de una imagen.

---

## `medir-desborde.py`

Dice qué elemento se sale a lo ancho y por cuántos píxeles.

```bash
~/.venvs/scrapling/bin/python herramientas/medir-desborde.py http://127.0.0.1:3210/es 390
```

Lo interesante: `responsive.css` acaba con

```css
html, body { max-width: 100%; overflow-x: hidden; }
```

Eso no arregla un desborde, lo **tapa**: en vez de una barra de scroll horizontal
—molesta pero visible— el contenido que se sale se recorta y desaparece. El
script quita esa red un momento, mide, y la vuelve a poner. Así la red puede
quedarse como lo que debe ser: una red, no el arreglo.

Solo lista el elemento **más profundo** de cada rama: si un hijo desborda, el
padre también, y listar los dos es ruido.

---

## `capturar.py`

Capturas con viewport real y esperando a que la red se calme.

```bash
~/.venvs/scrapling/bin/python herramientas/capturar.py <url> <salida.png> [ancho] [--completa]
```

Hace un barrido hasta abajo antes de disparar: eso fuerza la carga diferida de
las imágenes, que es por lo que salían huecos donde sí había foto.

---

## Requisitos

Playwright vive en el entorno de Scrapling (`~/.venvs/scrapling`). El navegador
se descarga una vez:

```bash
~/.venvs/scrapling/bin/python -m playwright install chromium
```

---

## El recorrido guiado: tres herramientas (6-sep-2026)

    node herramientas/generar-recorrido.mjs [--seco] [--force] [--solo es|en] [--voces]
    node herramientas/auditar-recorrido.mjs
    node herramientas/grabar-recorrido.mjs [--lang es,en] [--formato 16x9,9x16] [--base URL] [--salida DIR] [--sin-musica]

1. **Generar** locuta el guion (`lib/recorrido.guion.json`) con ElevenLabs
   (`eleven_v3`, Cristian en español, Brian en inglés) y escribe los mp3, el
   alineamiento palabra a palabra y `manifiesto.json` con las duraciones. Solo
   regraba lo que cambió; cambiar de voz exige `--force`. Necesita
   `ELEVENLABS_API_KEY` en el entorno (vive en `~/clientes/Merge/loymark-academy/.env`).
2. **Auditar** comprueba que la voz diga lo que dice el guion y que cada hito
   sea una frase encontrable en el audio. Correrlo SIEMPRE después de tocar el guion.
3. **Grabar** saca los MP4 del sitio en marcha (`npm run build && npx next start -p 3200`):
   abre la home con `recorrido=grabar` en la URL, graba con Playwright y pega la
   voz con las marcas de tiempo que apunta la página. Unos cuatro minutos por archivo.

Detalle y decisiones en `ESTADO.md`.

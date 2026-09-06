# Estado del sitio · 6 de septiembre de 2026

Dónde está el sitio de Club Wynwood, qué se hizo y qué queda. Escrito para
retomarlo sin releer el historial.

**Rama viva: `next-app`.** `main` es el sitio estático viejo, que sigue publicado
y se archiva cuando el dominio se mueva.

---

## Lo que se construyó el 6 de septiembre

Daniel: «mejorar el diseño y ese video, darle más calidad, mejor voz y que en
verdad sirva para conseguir cosas para el club; un video más completo, animado»,
«hacer el sitio súper interactivo y que traiga SEO y GEO e IA», «quiero un video
profesional y que quede de lo mejor».

### El recorrido guiado, en modo cine

El mismo dibujo isométrico narrado, pero ahora se ve como un vídeo:

- **Modo cine.** Al pulsar «Ver el recorrido», la lámina pasa a pantalla completa
  sobre tinta: el dibujo como proyección a la izquierda y, al lado, los capítulos,
  el subtítulo y los mandos. En el móvil, dibujo arriba y texto abajo. Esc sale,
  espacio pausa, flechas cambian de capítulo.
- **La cámara.** Cada hito del guion trae `zoom`: el lienzo entero (SVG + marca)
  se desplaza y escala con una sola transformación CSS de 1,6 s. Plano y
  contraplano de un documental, sin recalcular nada.
- **Subtítulo palabra a palabra.** La oración que suena, en Fraunces grande, con
  cada palabra encendiéndose cuando la voz llega a ella. Sale del alineamiento
  que devuelve ElevenLabs; sin alineamiento se muestra la oración entera.
- **Ocho capítulos** (antes siete): se añadió **«¿Cómo se ve montado?»**:
  anochece sobre el dibujo y se enciende un montaje posible —escenario al fondo
  del jardín, la barra del cliente bajo la palapa, público en el césped y
  guirnaldas entre las palmeras—. Es la escena que se recuerda. Todo lo encendido
  lo trae el cliente y así lo dice el texto; la luz colgada se aprueba en la visita.
- **Escenas nuevas en la lámina:** `gente` (600 personas de pie a escala, a
  8 ft² cada una: ocupan un tercio del jardín), `carpa` (los paños laterales de la
  palapa, a trazos, cuando el guion dice que hay que presupuestarlos) y `noche`.
  Los modos manuales son cinco: ver todo, lluvia, mesas, camión y montado.
- **«Tu evento, en el dibujo».** Antes de empezar el recorrido, la persona escribe
  cuántos invitados son, sentados o de pie, y el dibujo pone SUS mesas o SU gente
  a escala y dice si caben. Es la calculadora de la página de aforos puesta donde
  se decide, y el número viaja ya puesto al formulario (evento `cw-invitados` +
  sessionStorage). Mide `toggle_layer {layer: "aforo", guests_band}`.
- **La transcripción completa está en el HTML** (`<details>` plegado): ocho
  preguntas con su respuesta, legibles por buscadores y modelos.
- **Rendimiento:** el SVG (≈1 100 nodos) va en un componente memorizado y ya no
  se repinta con cada `timeupdate`; solo cuando cambian zona o aforo.

### La voz, regrabada (tres veces)

1. `eleven_multilingual_v2` con Nestor y Chris → Daniel: «mejor voz».
2. `eleven_v3` con Cristian y Brian → Daniel: «la voz es de mala calidad». Se
   transcribió con Scribe para descartar que leyera mal: lee bien (0–1,5 % de
   palabras distintas); lo que no convence es el timbre de v3.
3. **`eleven_multilingual_v2` a 192 kbps con David C5 (ES, la voz de los reportes
   ECUS, velocidad 1,08) y Brian (EN, la del vídeo de anuncios de julio,
   velocidad 1,0).** Es la que está. En la prueba con Scribe, David leyó el
   capítulo 1 sin una palabra distinta; Cristian en v2 se comió tres.

Las anteriores quedaron en `.qa/voz-anterior/` (v2 Nestor/Chris) y `.qa/voz-v3/`.
Coste total del día: unos 15 000 créditos de 129 000. `auditar-recorrido.mjs`: sin
errores. El manifiesto trae `duraciones` por capítulo (ffprobe): las usa la
grabación del vídeo.

### La música

Estaba apagada por defecto en el sitio y al 11 % en el vídeo (-35 dB de media
contra -14 de la voz). Daniel: «la música no se oye». Ahora **encendida por
defecto** en el recorrido (arranca con el clic de la persona, así que ya es su
decisión) al 26 %, con el interruptor a la vista y memoria si la apagan; y en el
vídeo al 38 % con **ducking** (compresor con la voz como llave) y limitador.

### Fotos reales dentro del recorrido

Daniel: «si puedes usar fotos también, haz el video más dinámico y detallado».
Cada hito puede pedir una `foto` con sus `segundos`: entra con fundido y
acercamiento lento (Ken Burns) encima del dibujo y se retira sola. Seis fotos,
todas sin la marca del operador en cuadro (`lib/recorrido.ts`, `FOTOS`):
palmeras desde el aire (recortada por el lado del rótulo), la aérea encuadrada
abajo a la izquierda, bajo la palapa de día, el montaje de sonido bajo la palapa,
el paseo entre palmeras (recortado por debajo del mural) y la cenital de noche.
Las nuevas se prepararon con ffmpeg desde `Proyecto wynwood/fotos/godaddy-2026-09/usables/`.
**La foto del paseo desde la entrada (`2W7A0764.jpg`) NO se usa**: el rótulo
del operador ocupa el centro.

También: **cifras junto a la marca** («240 ft · 73 m», «600 de pie», «40 ft»)
cuando la voz las dice; **modo `barra`** (la barra a trazos bajo la palapa, solo
desde el guion); **portada** de tres segundos en el vídeo; y el pie con la web.

### La sección del terreno, reordenada

Daniel: «la página web tiene desorden, no se entiende». Ahora el orden es:
titular → dibujo → mandos de qué ver (debajo del dibujo, junto a lo que mandan)
→ dos tarjetas lado a lado (el recorrido con sus ocho preguntas · «tu evento, en
el dibujo») → transcripción plegada → **cinco pestañas de zona con UNA lectura**
(antes cinco columnas de texto pequeño). La portada tiene además el botón
«Ver el recorrido · 3 min» junto a «Solicitar disponibilidad».

### El vídeo exportado (MP4)

`herramientas/grabar-recorrido.mjs` saca el MP4 **del mismo componente**: abre
la página con `?recorrido=grabar` (arranca sola, sin mandos, con reloj exacto del
manifiesto, tarjeta final con teléfono y correo), graba con Playwright, y pega la
voz capítulo a capítulo con las marcas de tiempo que la página apunta en
`window.__recorridoMarcas`, más la cama musical por debajo. Anclado al FINAL de
la grabación, que es el instante exacto del cierre.

    npm run build && npx next start -p 3200
    node herramientas/grabar-recorrido.mjs --lang es,en --formato 16x9,9x16

Salen cuatro archivos en `.qa/video/`: `recorrido-{es,en}-{16x9,9x16}.mp4`,
1080p h264 a 30 fps. En 9:16 el papel es más alto (proporción 1,15) y la cámara
arranca a 1,35×, con el subtítulo justo debajo del dibujo. Los archivos buenos se
copian a `~/clientes/Sandra Clavijo/Proyecto wynwood/video/`.

Si cambia una cifra del guion: `generar-recorrido.mjs` (solo regraba lo que
cambió) → `auditar-recorrido.mjs` → `grabar-recorrido.mjs`. El vídeo nunca se
desincroniza del sitio.

### SEO, GEO e IA

- **El pie es ahora el mapa del sitio.** Las tres páginas huérfanas (aforos, guía,
  barrio) están enlazadas, agrupadas como qué se alquila / para qué / cómo funciona.
- **El JSON-LD del venue salió del layout** y lo declara cada página del venue.
  La de residencia permanente ya no se declara a sí misma como el venue (solo
  migas). Verificado con curl: LocalBusiness y EventVenue una vez por página.
- **WebPage con `speakable`** en la home y en la FAQ, apuntando a `.respuesta` y
  a `.rec-transcripcion-cap`.
- **`llms.txt`** lleva el recorrido entero: las ocho preguntas con su respuesta.

### Herramientas

- `herramientas/generar-recorrido.mjs` — locuta (v3, voces nuevas, `--solo es|en`).
- `herramientas/auditar-recorrido.mjs` — el audio contra el guion. Siempre después de tocar el guion.
- `herramientas/grabar-recorrido.mjs` — el MP4.
- `.qa/` (ignorado por git): capturas antes/después, voz anterior, vídeos, scripts de QA.

---

## Cómo se prueba

```
npm run typecheck
npm run build && npx next start -p 3200
node herramientas/auditar-recorrido.mjs
node herramientas/qa-medicion.mjs
node herramientas/verificar-captura.cjs http://localhost:3200
node .qa/qa-prod.cjs                 # consola e hidratación en 4 páginas, 9:16 y móvil
```

Playwright sale de `~/crossworld/node_modules`: no hay Chrome en WSL. Para ver
el recorrido sin tocar nada: `/es?recorrido=auto&cap=6`.

---

## Lo que hay que saber antes de tocar nada

**Las tipografías se cargan con `next/font` desde el layout.** Si alguien las
mueve, comprobar que siguen saliendo los `.woff2` en `.next/static/media/`.

**`hidden` esconde pero no descarta.** Costó la mitad del peso de la portada.

**Los hitos del recorrido se anclan por FRASE ENTERA**, no por los primeros
tokens. Y **no usar etiquetas de v3** (`[pausa]`) en el guion: entran al
alineamiento y el hito no se encuentra.

**La cámara vive en `.lam-lienzo`.** Todo lo que deba viajar con el dibujo va
dentro; lo que deba quedarse fijo (el cajetín, los rótulos) se apaga mientras
alguien dirige. La marca se contra-escala con `--zoom`.

**En vertical el papel es más alto que el dibujo** (`ratioCaja` 1,15 en cine) y
las posiciones de la marca se corrigen por el margen (`fracCaja`). Si se cambia la
proporción, cambiarla en un solo sitio.

**La cookie de atribución es de 90 días, no de sesión.**

**El formulario acepta `idPrefijo` e `invitadosInicial`.** La portada monta dos.

---

## Lo que queda

### Bloquea todo lo demás

- **El dominio.** Mientras el sitio esté en `noindex`, el trabajo de
  posicionamiento vale cero. Ver `~/crm-wynwood/docs/10-DOMINIO.md`.

### Decisiones pendientes de Daniel

- **Oír la voz** (David / Brian, multilingual_v2) en `/es` y `/en`. Se cambia con
  `VOICE_ES` / `VOICE_EN` y `--force`. Las cuatro voces latinas de la cuenta:
  David C5, Superior, Cristian, Nestor. Superior es la otra candidata seria (la
  del vídeo de anuncios de julio en español).
- **Ver los cuatro MP4** y decidir cuál va a pauta. El 9:16 es el de reels y
  stories; el 16:9, el de YouTube, WhatsApp y web.
- **Sesión de fotos propia.** Las seis que hay son las únicas sin la marca del
  operador; falta el jardín vacío de día, el load-in, el parking y las cabañas
  de cerca.

### Contenido que ya existe y no se ha usado

- **El boundary survey del predio** (correo del 15-ago). Con él, las medidas del
  dibujo pasan de estimadas a verificadas.
- **Fotos y vídeos** que Rene Morales da por existentes en ese correo.

### Pequeño, para después

- Una imagen Open Graph propia (1200×630) con el dibujo; hoy se usa la aérea.
- `VideoObject` en el schema cuando el MP4 esté alojado en una URL pública.

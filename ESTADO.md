# Estado del sitio · 5 de septiembre de 2026

Dónde está el sitio de Club Wynwood, qué se hizo estos dos días y qué queda.
Escrito para retomarlo sin releer el historial.

**Rama viva: `next-app`.** `main` es el sitio estático viejo, que sigue publicado
y se archiva cuando el dominio se mueva.

---

## Lo que se construyó (4 y 5 de septiembre)

### El recorrido guiado

El dibujo isométrico del terreno, **narrado**. Siete capítulos que contestan las
siete preguntas que hace todo el que va a montar algo aquí, y en frases concretas
del guion el dibujo cambia de modo, resalta la zona y mueve una marca hasta el
punto del que se habla.

- `lib/recorrido.guion.json` — **la fuente única**. Texto, hitos y coordenadas,
  en los dos idiomas. Lo leen el reproductor y el generador de voz: un solo
  texto, para que la voz y los subtítulos no se desincronicen nunca.
- `components/Recorrido.tsx` — el reproductor.
- `lib/recorrido.ts` — el anclaje de hitos al audio.
- `herramientas/generar-recorrido.mjs` — locuta con ElevenLabs.
- `herramientas/auditar-recorrido.mjs` — **comprueba que el audio grabado
  corresponda al guion**. Correrlo siempre después de tocar el guion.
- `public/audio/recorrido/` — 14 mp3 con su alineamiento, más la cama musical.

**No es un vídeo, y es deliberado.** Un vídeo pesa, no se lee, no se indexa y hay
que regrabarlo entero cuando cambia una cifra.

**Funciona sin voz.** Si los audios faltan o el navegador no los reproduce, se
leen los capítulos y el dibujo se mueve igual, por tiempo estimado.

### La medición

Ver `~/crm-wynwood/docs/11-PLATAFORMAS.md`, que es el documento que manda.
En el sitio: `lib/atribucion.ts` (cookie de 90 días con los tres identificadores
de clic), `components/Medicion.tsx` (consentimiento y etiquetas) y
`components/Atribucion.tsx` (captura en TODAS las páginas, montado en el layout).

---

## Cómo se prueba

```
npm run build && npx next start -p 3200
node herramientas/verificar-captura.cjs http://localhost:3200
node herramientas/auditar-recorrido.mjs
node herramientas/qa-medicion.mjs
```

`verificar-captura.cjs` comprueba en un navegador real las dos cosas que ninguna
prueba unitaria ve: que el consentimiento se declare antes que nada, y que el
identificador de clic sobreviva a cerrar la pestaña.

Playwright sale de `~/crossworld/node_modules`: no hay Chrome en WSL.

---

## Lo que hay que saber antes de tocar nada

**Las tipografías se cargan con `next/font` desde el layout.** Estuvieron meses
declaradas y sin cargar, y todo el sitio se veía en Georgia. Si alguien las
mueve, comprobar que siguen saliendo los `.woff2` en `.next/static/media/`.

**`hidden` esconde pero no descarta.** Costó la mitad del peso de la portada:
cuatro isométricos del edificio y dos láminas técnicas en el DOM, con una visible.

**Los hitos del recorrido se anclan por FRASE ENTERA**, no por los primeros
tokens. Las palabras con guion no casan token a token, y dos tokens no
distinguen nada.

**La cookie de atribución es de 90 días, no de sesión.** Quien ve el anuncio el
lunes y escribe el jueves tiene que seguir trayendo su identificador de clic.

**El formulario acepta `idPrefijo`.** La portada monta dos formularios —uno al
final del recorrido y otro en el cierre— y sin prefijo los trece identificadores
se repiten.

---

## Lo que queda

### Bloquea todo lo demás

- **El dominio.** Mientras el sitio esté en `noindex`, el trabajo de
  posicionamiento vale cero. **Poner la variable NO basta: hace falta un
  despliegue nuevo.** Ver `~/crm-wynwood/docs/10-DOMINIO.md`.

### Contenido que ya existe y no se ha usado

- **El boundary survey del predio**, en el correo de Daniel desde el 15 de
  agosto. Con él, las medidas del dibujo pasan de estimadas a verificadas. Ver la
  nota de memoria `wynwood-boundary-survey`.
- **Fotos y vídeos** que Rene Morales da por existentes en ese mismo correo.
  Nunca se pidieron.

### Hallazgos de la auditoría del 5-sep, verificados y sin arreglar

- **Tres páginas inalcanzables navegando**: `aforos`, `guia` y `barrio`. No están
  en el menú ni enlazadas desde la portada, y con ellas se pierde la Calculadora,
  que es la mejor herramienta de cualificación del sitio.
- **El JSON-LD del venue va en el layout**, así que la página de residencia
  permanente —contenido legal de otro negocio— se declara a sí misma como el
  venue, y aparece en el sitemap y en `llms.txt`.
- **El recorrido re-renderiza el SVG entero varias veces por segundo** mientras
  narra: no hay `React.memo` y el panel se crea nuevo en cada render. Se nota en
  un móvil de gama media.
- Dos capítulos en español van a 146 y 149 palabras por minuto, por debajo de la
  referencia de 150-220. Hay que oírlos antes de darlos por buenos.

### Decisiones pendientes de Daniel

- Si la música de fondo y las dos voces elegidas valen. Están montadas y se
  pueden cambiar sin tocar código (`VOICE_ES` / `VOICE_EN`).
- Si se porta el copy viejo de inversión inmobiliaria del sitio de GoDaddy.
  Deliberadamente no se portó: contradice el posicionamiento de venue.

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

4. Daniel oyó a David: «suena raro, no humano y natural». Se buscaron en la
   **biblioteca compartida de ElevenLabs** los narradores latinos más usados y se
   añadieron cuatro a la cuenta (Alberto Rodríguez, Enrique M. Nieto, Jhenny,
   Tatiana Martin). Se generó el capítulo 1 con siete voces y ajustes naturales
   (**sin speaker boost, similarity 0,75, stability 0,45, velocidad 1,0**) y se
   armó una página de comparación con los audios (`.qa/voces2/comparacion.html`,
   publicada como artefacto) para que Daniel elija oyendo. **Mientras decide, el
   sitio va con Alberto Rodríguez** (`l1zE9xgNpUTaQCZzpNJa`): la voz latina de
   narración más clonada de la biblioteca (1,09 M), sin errores de lectura.

Las anteriores quedaron en `.qa/voz-anterior/` (v2 Nestor/Chris), `.qa/voz-v3/` y
`.qa/voz-david/`. Coste total del día: unos 24 000 créditos de 129 000.
`auditar-recorrido.mjs`: sin errores. El manifiesto trae `duraciones` por capítulo
(ffprobe): las usa la grabación del vídeo.

5. Daniel oyó la página de comparación: **«para español me gusta la de
   Superior»** y «en inglés lo que se tiene está bien». **Es la definitiva:
   Superior (`IaUx9NjPDJeDAwpNQMW2`) en ES y Brian en EN**, ajustes naturales.

### La música, cambiada

Daniel: «la música no le queda bien del todo, ajústala». Se generaron dos camas
nuevas con **ElevenLabs Music** (`POST /v1/music`, 190 s, instrumental) hechas para
este vídeo: **A · guitarra de nailon y piano** (la puesta) y B · ambiente. La
anterior (junio, de otro proyecto) quedó en `.qa/musica/cama-anterior.mp3`. Las
tres están en la página de comparación para que Daniel confirme.

### El dibujo, rehecho como en las fotos (tercera versión)

Daniel: «poco detallado, no veo mesas, veo cosas que no me dicen nada, necesito
todo animado, de lo que vaya hablando, como lo hacemos en Loymark Academy» y «el
dibujo no encaja con las fotos… del edificio también lo tiene que hacer».

- **Geometría nueva** en `lib/recinto.geo.ts`, leída de las dos aéreas: paseo
  central de la calle al edificio, palapa grande (100 × 37 ft) pegada al paseo por
  el norte con techo largo a cuatro aguas y postes en tres hileras, ocho
  **cabañas-pérgola** (postes, marco y listones blancos, sofá) al sur, dos hileras
  de palmeras, setos y **estacionamiento con coches** fuera, el **edificio** al
  fondo con su puerta donde termina el paseo y ventanas.
- **Objetos reales**: mesas redondas con sus diez sillas (20 bajo la palapa, 10 en
  el césped), pasillos de servicio, mesas de picnic, camión con cabina y ruedas,
  escenario con tarima, torres de sonido, truss y focos con haz, barra con
  taburetes, guirnaldas, público.
- **Capas aditivas por frase** (`agregar`/`quitar` en los hitos → `data-capas`):
  techo, postes, lados abiertos, portón, paseo, pasillos, picnic, cabañas,
  edificio, tarima, sonido, truss, luces, barra-luz, público, guirnaldas. El
  escenario se monta pieza a pieza mientras la voz lo nombra.
- **Entrada con peso** (`lam-peso`: caída, rebote, escala) para todo lo que
  aparece porque se nombra; **reposo con vida**: las palmeras se mecen, cada una a
  su ritmo. Con mesas, gente o barra, **el techo de la palapa se vuelve
  transparente** (sección de plano) para que se vea lo que hay debajo.
- El guion cambió en dos frases y se regrabaron los capítulos 1 y 5: «Junto al
  paseo, la palapa techada» (antes «en una esquina») y una frase nueva sobre el
  edificio («El edificio del fondo, donde termina el paseo, tiene dos niveles…»).
- **Botón permanente «Solicitar disponibilidad →»** en los mandos del cine: abre
  el formulario en el panel mientras el recorrido sigue (Daniel: «un botón fácil
  para llenar el form y conseguir más información»). Mide `form_start`.

### El plano del sitio, por fin, y una cámara de verdad (cuarta versión del dibujo)

Daniel encontró en LoopNet el **flyer de Newmark** (`Proyecto wynwood/loopnet/flyer-loopnet.pdf`,
8 páginas) con el **plano del sitio** en la página 10, más el brochure viejo de Metro 1
(`brochure-marketing.pdf`, «Casa Wynwood», 2015: edificio 12 125 SF en un lote de
32 500 SF, tres parcelas 2129/2125/2105). Lo que dice el plano, y que las dos geometrías
anteriores tenían mal: **lote de esquina** (NW 1st Ct al oeste, NW 21st Ct al sur), el
**edificio al norte** (~119 × 102 ft de huella; 16 000 SF con altillo, cuatro salas privadas
arriba, licencia de bar hasta las 3 AM, zonificación T5-O NRD-1), el **paseo bajando de la
puerta del edificio al sur** (~15 × 105 ft), la **palapa al suroeste** (~54 × 54) junto al
seto de NW 1st Ct, el **área de arena con picnic y sombrillas** entre palapa y edificio, las
**ocho pérgolas al este del paseo**, **estacionamiento propio al este y al sur**. Todo en
`lib/recinto.geo.ts`, con la escala (2,4 px/ft) que hace cuadrar la huella del edificio
con el brochure. LoopNet devuelve 403 a cualquier navegador automatizado (Playwright y
Scrapling): las fotos hay que bajarlas a mano; las principales vienen en el flyer
(`loopnet/fotos-flyer/`, hasta 2 212 px).

**La proyección ya no es isométrica.** `lib/perspectiva.ts` implementa una cámara en
perspectiva con la misma interfaz que `lib/iso.ts`; la cámara está donde estuvo el dron de
la foto de portada (al sur, elevada, mirando a la puerta), con la palapa a la izquierda y las
pérgolas a la derecha. Consecuencias: pintado por profundidad (`g.profundidad`), objetos a
la escala de su punto (`g.escala`), cara lateral visible según el lado de la cámara, cotas
con el ángulo de su línea. El guion se tradujo a las coordenadas nuevas (53 puntos) y se
regrabaron los capítulos 1 («unos dieciocho mil pies cuadrados», ya no «doscientos
cuarenta pies de largo») y 4 («desde la calle, por el estacionamiento»).

**Objetos que se reconocen**: mesa redonda con tablero blanco, borde y centro, diez sillas
con asiento y respaldo; pérgolas con postes finos y listones; mesas de picnic con sombrilla;
coches; camión con cabina y ruedas mirando a la cámara. En mesas, gente, barra y noche el
techo de la palapa se vuelve transparente.

**La planta, las cifras y `GEOMETRIA` ya van sobre el plano real** (misma noche):
`LaminaPlanta.tsx` importa la geometría de `lib/recinto.geo.ts` (no declara ni una
medida), norte arriba, con el edificio rayado «del operador · se alquila aparte», el camión
entrando por NW 21st Ct y las respuestas en HTML en la columna de al lado (una nueva: «¿Y el
edificio?»). La leyenda de las mesas pasó del SVG a un `figcaption`: dentro del dibujo
pisaba las mesas del césped sur. `Cifras.tsx` dibuja el lote real (edificio en claro, palapa
al suroeste) y `lib/venue.ts` `GEOMETRIA` resume el plano. `LaminaEdificio.tsx` no cambia: es la
sección interior del edificio sacada de los planos del operador (niveles, cocina 580 ft²),
independiente de la geometría del recinto exterior.

**Las 30 mesas ya no pisan nada.** La geometría anterior ponía 7 a `PASEO.x − 12` (dentro
de la palapa, encima de las 16) y 7 a `PASEO.x + PASEO.dx + 14` (encima de las pérgolas).
Ahora: 16 bajo la palapa, 8 en el césped al sur y 6 en fila sobre el paseo, que mide 15 ft
y una mesa con sillas ocupa 10.

**La foto del paseo perdió la franja superior.** `paseo-palmeras.jpg` pasó de 1280 × 528 a
1280 × 400: en el vídeo se leía el rótulo del operador en el mural, encima de la puerta.
Regla de siempre: mirar los fotogramas exportados, no solo el sitio.

### Quinta pasada (7-sep-2026): objeto por objeto, el edificio por dentro, la palapa donde está

Daniel: «mejoró muchísimo, pero le falta: fíjate más en los detalles, detalla por dentro,
modela objeto por objeto, veo errores visuales (ventanas corridas, líneas encimadas), el
montaje nocturno dinámico, proporcional y simétrico, que la página vaya sin lag, demasiado
texto regado, el edificio no cuadra en fotos contra el tiki, y dentro del edificio sí hay
cocina y demás».

**La geometría cambió otra vez, y esta es la buena contra las fotos.** La palapa va
**pegada al edificio** (en las dos aéreas la paja llega casi a la fachada; entre las dos
solo hay palmeras y jardineras) y el jardín abierto queda **al sur de la palapa**. El área
de arena con picnic y sombrillas va **al este de la puerta**, delante de la hilera de
pérgolas, que empieza más al sur. En `lib/recinto.geo.ts`; el guion (5.1.0) tiene los 25
puntos traducidos con `.qa/guion-puntos2.mjs`.

**Objeto por objeto** (`LaminaRecinto.tsx`): palmeras con tronco inclinado, anillos y dos
capas de frondas; personas con cabeza, tronco, brazos y piernas, y tres que caminan por el
paseo (piernas y brazos alternan por CSS, se hacen pequeñas con la perspectiva); palapa con
postes cónicos, vigas a la altura del alero, cabios que solo se ven por debajo (dibujarlos
siempre convertía el techo en una red), cumbrera y fleco de paja en dos largos; pérgolas
con tarima, cortina corrida, sofá en L con cojines, mesita y lámpara; picnic con sombrilla
de ocho gajos; coches con ruedas y parabrisas; camión con cabina, parabrisas, faros,
parrilla, costillas y llantas que giran (`stroke-dashoffset`); setos con la copa a bultos.

**El edificio**, por fuera: dos volúmenes, ventanas **solo donde caben** (las de antes
flotaban sobre el volumen bajo de 14 ft: «ventanas corridas»), mural en tres tonos
apagados, puerta doble de vidrio con tiradores y marquesina, parapeto y equipos en
cubierta. **Por dentro** (capa `edificio`; la fachada sur y la cubierta bajan a 10 % y 26 %
de opacidad con `!important`, porque el lavado del dibujo fija la opacidad en 1): salón a
doble altura donde termina el paseo, altillo a 12 ft con baranda y **cuatro salas
privadas**, escalera, baños al oeste y la **cocina** en el volumen bajo (mostrador corrido,
campana, isla, cámaras). Capas `interior-cocina`, `interior-salas`, `interior-altillo`
resaltan en ocre. Nada del operador (`lib/edificio.ts`). **Decisión de Daniel (7-sep):**
el edificio se ofrece como zona 02 con su cocina y sus baños; el guion, la planta, las
zonas y la FAQ dicen ahora «al aire libre no hay cocina: el catering monta en el sitio, o
usa la del edificio si lo alquilas también». La skill decía «sin cocina» a secas: se
actualizó.

**Montaje nocturno simétrico**: pantalla al fondo de la tarima (respira), cabina del DJ con
su técnico, monitores, torre de sonido (sub + cabina) a cada lado, truss con seis cabezas
móviles cuyos haces barren (los tres de la izquierda hacia un lado, los tres de la derecha
hacia el otro; `transform-origin` en el foco y `rotate(calc(13deg * var(--dir)))`), pozos
de luz en el césped, público de frente con brazos en alto que se mueve, barra con
trasbarra, botellas, taburetes y tres pendientes, bolardos a lo largo del paseo, uplights
en los postes y guirnaldas también bajo la palapa. El contorno de la palapa se insinúa en
luz: sin él, la barra flotaba en la oscuridad.

**Fotos**: seis del flyer de Newmark entran al recorrido (`flyer-*.jpg`; cenital, aérea de
la palapa, lounge bajo la palapa, cabañas, paseo hasta la puerta, cóctel bajo la palapa),
todas como postal para que **ninguna salga recortada** («algunas fotos quedan cortadas»);
y las dos fotos del sitio con el rótulo del operador (`venue-exterior.webp`,
`aerea-predio.jpg`, que además es la imagen de Open Graph) pasaron por `delogo` de ffmpeg.
Los tres videos que Daniel dejó en Descargas están en `Proyecto wynwood/video-fuente/`
pero **no entran**: el de la fiesta son primeros planos de invitados (caras, sin
consentimiento para publicarlas) y los dos reels de 576 px llevan marca de agua, el rótulo
del operador y su interior.

**La voz**: cada capítulo se locuta con el anterior y el siguiente como contexto
(`previous_text`/`next_text`) y pasa por una cadena de cabina (paso alto 75 Hz, de-esser,
compresión 2,4:1, presencia 3,2 kHz, `loudnorm` en dos pasadas lineal a -16 LUFS; todos
los capítulos quedan entre -16,2 y -16,7). Los mp3 crudos quedan en `.qa/voz-raw/`;
`.qa/pulir.mjs` reprocesa sin regrabar. Trampa: el JSON de `loudnorm` va en stderr seguido
de más líneas; hay que tomar el último bloque entre llaves, no `\}\s*$`.

**Sin lag y sin desorden**: `.lam-lectura[hidden]{display:none}` (el `display:grid` pisaba
al atributo `hidden` y se veían las cinco lecturas a la vez: ese era «el desorden por
fuera»); animaciones de reposo pausadas hasta que el dibujo entra en pantalla y apagadas en
móvil; `contain: layout paint` en la figura; la cámara respira en el cine (`lam-deriva`).
Notas largas acortadas (lámina, planta), FAQ recortada, la planta con los mismos objetos que
el dibujo (palmeras, mesas con sillas, pérgolas con sofá, coches).

### Segunda tanda del 7-sep: galería, coches, superposiciones y más voz→animación

Daniel: «una zona con las fotos para poder ver», «no sé qué es esto» (los coches: dos
cajas de 15 ft de ancho), «veo superposición» (palmeras sobre el techo de la palapa, gente
sobre palmeras), «súper animado, lo más animado que puedas, y ve analizando frame por frame
cómo animarlo y unirlo con la voz».

- **Galería** (`components/Galeria.tsx` + `lib/galeria.ts`): trece fotos en columnas con su
  proporción real, pie numerado con fuente, visor `<dialog>` a tamaño natural (nunca
  amplía), flechas y Esc. Va justo debajo del recorrido. Mide `view_plate` con
  `plate_name: "galeria"` y el id de la foto.
- **Coches** modelados: 16 × 6,5 ft, carrocería, cabina en trapecio con vidrios, cuatro
  ruedas con llanta, pilotos o faros según el extremo que mira a la cámara, parachoques,
  línea de puerta; sedán y SUV alternados; caras pintadas por profundidad.
- **Superposiciones**: `PALMERA_ALTO = 30` (las palmas reales son más altas que la
  cumbrera de 26 ft, así que las copas pasan por encima del techo); la hilera oeste a 1,5 ft
  del paseo; los peatones se pintan ANTES de los objetos, así las copas les pasan por
  encima y no al revés.
- **Reposo con vida, segunda tanda**: cortinas de las pérgolas que se mecen (`skewX`),
  goteras que escurren del alero con lluvia, uno de cada cinco del público se mueve.
- **Capas ligadas a la voz** (guion 5.2.0, `.qa/guion-capas.mjs`): `palmeras` (se mecen
  fuerte y se marcan en ocre) → `setos` (perímetro en ocre) → `exterior` (el edificio se
  apaga y el lote late) en el capítulo 1; `parking`, `puerta` y `porton` en el 4; el
  montaje nocturno se enciende cuando la voz dice «y el montaje» en el 7 y vuelve al día en
  «Cuéntanos»; el botón de disponibilidad late (`cta`) cuando la voz lo pide en el 8.
- **Tercera tanda de detalle** (Daniel: «si necesitas modelos hazlos súper detallados,
  dedícate de lleno a pulir esto»): el paseo losa a losa en dos tonos con su junta; acera
  con juntas entre la calle y el lote; el mural en bandas onduladas (sin rótulo); ventanas
  con carpintería y apliques de luz junto a la puerta; textura de paja (patrón de trazos
  inclinados) sobre las cuatro aguas de la palapa, que se atenúa cuando el techo es
  transparente; zapatas en los postes; racimo de cocos bajo cada copa; sombrillas con
  remate que se mecen; jardineras con planta junto a cada pérgola; rampa trasera del camión
  que baja al paseo cuando llega; el público de noche respira.
- **Revisión fotograma a fotograma**: `.qa/hojas-contacto.mjs <log> es|en` saca un
  fotograma 1,3 s después de cada hito (con los arranques de capítulo del log del grabador
  y el alineamiento de palabras) y arma una hoja de contacto por capítulo en `.qa/hojas/`.
  Es la manera de comprobar que lo que se ve es lo que la voz dice. **Lo que enseñaron
  las hojas (7-sep):** cuatro fotos tapaban el hito siguiente (la del paseo en el 1, la de
  la puerta en el 4, las de cabañas y lounge en el 5) → se acortaron a 2,2–2,6 s; y el
  montaje nocturno del capítulo 7 no llegaba a verse porque entre «y el montaje» y
  «Cuéntanos» hay 1 s y anochecer tarda 2,2 → ahora la noche entra en «el paquete se arma»
  y las tres cifras van sobre el montaje encendido (guion 5.3.0, `.qa/guion-ajustes.mjs`).
  Regla: **una foto nunca más larga que la distancia al hito siguiente menos 1 s**, y un
  cambio de modo necesita al menos 3 s de voz por delante.

### La marca (8-sep): el símbolo, el favicon y la tarjeta al compartir

Daniel enseñó la pestaña del navegador con el globo gris por defecto: «quiero que esto tenga
logo». No había **ningún** icono en el proyecto, y la marca era solo la palabra en Geist Mono.

- **El símbolo es la palapa con las proporciones reales del predio** (`lib/recinto.geo.ts`):
  cumbrera 14 sobre vano 54 (0,26) y 23 ft de alto de techo sobre 54 (0,43). Un monograma
  «CW» habría sido cualquier club y a 16 px una mancha. Techo en ocre (la paja es ocre y el
  ocre es el acento del sistema), postes y suelo en papel a un hairline.
- `components/Marca.tsx` exporta `Simbolo` y `Marca`: barra, pie, cabecera del cine, portada
  del vídeo y tarjeta final. `app/icon.svg` es el favicon (con fondo tinta, para que se vea
  en cualquier tema); si se cambia la geometría en el componente hay que cambiarla ahí
  también, son diez números.
- `app/apple-icon.png` y `app/opengraph-image.png` los genera **`.qa/marca.cjs`** con
  Playwright: la tarjeta lleva marca, claim, dirección y el dibujo del recinto sin rótulos
  (con rótulos se cortan contra el borde). Comprobación: `.qa/ver-marca.sh`.
- **Trampa que costaba la imagen al compartir:** sin `metadataBase`, Next resuelve
  `opengraph-image` contra `http://localhost:3000` y el enlace llega sin imagen a WhatsApp o
  a un anuncio. Se ata a la misma `BASE` de `lib/i18n.ts`.
- Trampa de Playwright: `file://` está bloqueado desde una página cargada con `setContent`;
  la imagen del dibujo va incrustada como data URI.

### Séptima tanda del 7-sep (noche): las correcciones de las notas de Daniel

Notas de Daniel, en su orden, y qué se hizo:

- **«La mercancía no entra por la entrada principal»** → la carga entra por NW 1st Ct al apron
  junto al edificio (`PORTON_CARGA`); el camión ahora tiene eje (`CAMION.eje`), la cuadrilla y
  los conos están en el apron, y la palapa se aparta en modo camión. El capítulo 4 se
  reescribió y **se cuenta desde la vista oeste**: los hitos admiten `vista` y el recorrido
  pasa `vistaDirigida` a la lámina (primer uso real de las cinco cámaras en el vídeo).
- **«Reducir el espacio al tiki»** → palapa en y=151: solo el seto entre el alero y las plazas.
- **Inglés predominante** → `IDIOMA_POR_DEFECTO = "en"`.
- **Disponibilidad 1 oct / 1 nov, evento u oficina, cocina adicional, licencia de licor propia,
  públicos** → `DISPONIBILIDAD`, `USOS`, `PARA_QUIEN` en `lib/venue.ts` (fuente única), ficha
  técnica (licor pasa a verificado; nuevas líneas de disponibilidad y entradas), FAQ nuevas, y
  la sección `components/ParaQuien.tsx` bajo la galería con Miami Art Week (el permiso de la
  City of Miami cierra el 11-oct). Capítulos 5 y 8 del recorrido regrabados.
- **WhatsApp de Rene** → botón en `Contacto.tsx`, oculto hasta que `VENUE.whatsapp` tenga el número.
- **Competidores, Unlocked, precios por día, Art Week, pauta, LAL/RMK, segmentación** → todo en
  `~/crm-wynwood/docs/12-PAUTA-ARTWEEK.md`. Hallazgo que manda: **FunDimension vende este mismo
  predio en Tagvenue como «Playa Wynwood» a $500/h** con catering y bar de la casa. Y no hay
  cuenta publicitaria ni píxel de Club Wynwood todavía: sin eso no hay RMK ni LAL que revisar.

### Sexta tanda del 7-sep: el recinto desde cinco puntos de vista

Daniel: «que se pudiera ver desde diferentes perspectivas… tienes que crear todo el modelo en
todos los lados». Selector «Punto de vista» bajo el dibujo (sur · oeste · norte · este · aérea),
`VISTAS` en `lib/recinto.geo.ts`. Lo que hubo que generalizar: `Caja` (las dos caras
verticales que ve la cámara, la lejana primero), la palapa (caras ordenadas por profundidad,
fleco y goteras solo en los aleros que miran a la cámara), el edificio (mural, puerta y corte
interior solo en la cara sur; entra en el orden de profundidad con todo lo demás), los
coches (extremo y costado por la cámara), los haces (en el mundo, no en pantalla), los
nombres de las calles (giran con su calle) y los rótulos (automáticos fuera del sur). El
encuadre de cada vista se ajusta a la proporción del sur; este y oeste se recortan al ancho.
El vídeo sigue siendo la vista sur. **Pendiente si Daniel lo quiere:** hitos con `vista` para
que el recorrido cambie de cámara por capítulo (la prop `vistaDirigida` ya existe), y un tour
virtual.

### Quinta tanda del 7-sep: la geometría de verdad (la cenital manda)

Daniel puso la cenital al lado del dibujo: «viendo las fotos no hay nada al lado así, no es
acorde a la realidad». La palapa NO está pegada al edificio con un jardín al sur: está en la
**esquina suroeste**, con un seto y enseguida **dos filas de estacionamiento** con calle de
maniobra antes de NW 21st Ct (plano de Newmark, página 10, leído ahora con la cenital
encima). Entre la palapa y la fachada: un apron pavimentado con jardineras y una franja de
césped. Lote ≈131 × 258 ft. Todo en `lib/recinto.geo.ts` (cuarta geometría). Lecciones:

- **Orientar la cenital antes de leerla**: en esa foto el norte está a la IZQUIERDA (el
  edificio), el sur a la derecha, el oeste abajo. Leída con el norte arriba, la palapa
  «quedaba» junto al edificio. La aérea a pie de paseo (`aerea-predio.jpg`) fija la regla:
  palapa a la izquierda del paseo, cabañas a la derecha, y los coches al fondo de cada lado.
- **La cámara del sur no ve lo que queda detrás de la palapa** (cumbrera a 34 ft): el
  escenario del montaje pasó al estacionamiento sur mirando al norte, y se dibuja por
  detrás, con los haces hacia el público del paseo y de la palapa. El guion del capítulo 6
  cambió («el escenario sobre el estacionamiento, de frente al paseo») y se regrabó.
- **El cine en teléfono no tenía reglas móviles** (dos columnas: 50 px para el dibujo). Y
  el «no se ve» real: la sección `.rv` con `translateY` convierte al ancestro en contenedor
  del `position: fixed` si el cine se abre antes de hacer scroll. `.rv:has(.lam.cine)` +
  `closest('.rv').classList.add('dentro')`. Y `max-height` sobre una figura con
  `aspect-ratio` deja la fila de la rejilla con el alto intrínseco (hueco negro de 60 px).
- **Ritmo**: `COLA_CAPITULO` (1,7 s al acabar cada capítulo, también en el MP4) y las fotos
  ganan un segundo sin pisar el hito siguiente (clamp en `Recorrido.tsx`, no a mano).
- **El reloj de la grabación va en tiempo de pared.** Sumaba pasos de 0,1 s en un
  `setInterval` y, con el dibujo cargado, el navegador se saltaba ticks: en la grabación de
  las 13:30 los capítulos duraban 5–13 s más que su voz (la voz se callaba y el dibujo seguía
  en silencio). Ahora `segundo = base + (performance.now() − inicio)`. Y **nunca
  `.rv:has(.lam.cine)`**: el `:has` se reevalúa con cada palabra del subtítulo y frenó el
  reloj todavía más; el revelado lo hace `arrancar()` con `classList.add('dentro')`.
  Comprobación rápida de una grabación: en el log del grabador, cada marca de capítulo debe
  distar de la anterior (duración del audio + 1,7 s) ± 0,5 s.

### Cuarta tanda del 7-sep: crítica con agentes, objeto por objeto contra las fotos

Daniel: «¿algo más para pulir? dedícate otra tanda», «re-mira el video varias veces hasta que
quede sin errores visuales y lo más profesional que se pueda», «modelos súper detallados».
Se corrió un flujo de agentes (`pulido-lamina-wynwood`): cinco críticos con lentes distintas
(fidelidad, perspectiva, legibilidad, escenas, animación) leyeron las capturas y las fotos
reales, y un escéptico por hallazgo lo verificó contra la captura y el código (varios
confirmaron que el arreglo ya estaba en el árbol de trabajo y afinaron valores). Lo que
cambió está en el mensaje del commit «Cuarta tanda del 7-sep». Lo que enseñó:

- **Las fotos mandan sobre el estilo.** La palapa era «lo techado en tinta» y se leía como
  lámina; ahora es paja dorada (tonos de paja en escala de tinta, cara sur más clara),
  hebras irregulares y fleco en zigzag. Las palmeras eran cocoteros; las del predio son
  palmas reales de tronco gris liso. Al este del paseo es arena, no césped. La fachada es
  mural de piso a techo, sin ventanas bajas ni marquesina.
- **Trampas de CSS que deshacían el dibujo**: `.lam.dibujar .rl` pisaba la animación de la
  cortina (ahora el grupo se mueve, no el path); `lam-lavado … forwards` dejaba la cortina
  opaca (ahora `fill-opacity: var(--lavado, 1)`); `[data-capas~="cabanas"] .cabana .tz`
  volvía opaco el techo justo en su capítulo (`.techo-cab` excepción); `lam-aparece-persona`
  pisaba la opacidad por profundidad del público (va en los hijos).
- **Geometría que se rompe al mover una constante**: al llevar `EDIF.corte` a 58 la cuarta
  sala del altillo atravesaba la pared; las bandas del mural bajaban del suelo sin tope; la
  cabecera de arena no cubría las cinco mesas y el seto alto las partía.
- **Un objeto nuevo obliga a revisar el guion**: la mesa imperial cambió «treinta mesas de
  diez» por «veinticuatro redondas y una imperial de sesenta» (capítulo 2 regrabado).
- Herramientas: `.qa/captura9b.cjs` (encuadres corregidos para palapa y cabañas, salida en
  `pasada7`), `.qa/build-qa11.sh`, `.qa/hojas-contacto.mjs`.

### Medir hasta dónde se ve el recorrido

Daniel: «que podamos ver y medir cuánta gente ve el video hasta dónde, así podemos
mejorar». El recorrido se mide **con los nombres con que GA4 mide un vídeo**
(`video_start`, `video_progress` al 10/25/50/75 %, `video_complete`, con `video_percent`,
`video_current_time`, `video_duration`, `video_title` = «Recorrido técnico narrado · ES»),
a propósito: entran en el informe de interacción con vídeo y en las exploraciones con las
dimensiones «Video title» y «Video percent» sin crear nada. Se añade `tour_exit`, propio,
con el porcentaje exacto al cerrar antes del final: ese es el dato de dónde se pierde la
gente. El embudo por capítulo ya lo da `view_plate` con `plate_name: "recorrido"` y
`chapter`. En `?recorrido=grabar` no se dispara ninguno (lo «ve» un navegador sin cabeza).
Contrato actualizado en `~/crm-wynwood/docs/04-MEDICION.md`. **Nada de esto llega a
ningún sitio hasta que existan los identificadores de GTM o GA4 en Vercel**: los eventos
se acumulan en `dataLayer` y ahí se quedan.

### Las fotos, nítidas

Daniel: «que las fotos no se vean borrosas». Las aéreas vienen de Flickr
(fotógrafa Joyce Frohman, descarga limitada a 1 024 px) y ampliarlas a 1080p las
ablandaba. Ahora cada foto tiene `tamano` en `FOTOS`: **«lleno»** solo las de
1 600 px o más (el montaje bajo la palapa y la cenital de noche); **«postal»** las
demás, a su tamaño natural, enmarcadas en papel sobre el dibujo atenuado y con
pie. Los recortes se hacen sin escalar (`fotos-nitidas.sh` en `.qa/`). La aérea
completa no entra en el recorrido porque a tamaño natural se lee el rótulo del
operador; queda solo en la portada del sitio, con su pie.

### Nombres técnicos

Daniel: «dale un nombre más técnico a las cosas». La interfaz dejó de hablar como
un guía: «Plano del recinto · vista isométrica», «Recorrido técnico narrado»,
«Simulador de aforo», capas «Plan de lluvia / Aforo sentado · 300 / Load-in ·
camión 40 ft / Montaje nocturno», formatos «Banquete · sentados / Cóctel · de
pie», capítulos con nombre técnico (El recinto · Aforo · Plan de lluvia · Acceso
y load-in · Infraestructura incluida · Montaje tipo, nocturno · Tarifas y
condiciones · Disponibilidad y visita técnica). Los MP4 se llaman
`ClubWynwood_RecorridoTecnico_{ES,EN}_{1920x1080,1080x1920}.mp4`. Y en la
cabecera del cine hay un conmutador **ES | EN** que abre la otra versión en el
mismo capítulo (`?recorrido=auto&cap=N`).

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

# Los tres vídeos del club

Revisados el 15 de agosto de 2026. Están en `C:\Users\Daniel Muñoz\Downloads`.

---

## Qué es cada uno

| archivo | resolución | duración | qué es |
|---|---|---|---|
| **IMG_5627** | 1080×1920 · 60 fps · 24 Mbps | 60 s | Fiesta privada real, de tarde-noche, en el recinto |
| **IMG_8191** | 576×1024 · 30 fps | 93 s | Recorrido del sitio, **subtítulos en inglés** |
| **IMG_8192** | 576×1024 · 30 fps | 93 s | **El mismo vídeo**, subtítulos en español |

Los tres son verticales 9:16.

### IMG_8191 y 8192 son el mismo metraje

Misma duración exacta, mismo número de fotogramas, mismos planos. Lo único que
cambia es la pista de subtítulos quemada encima. No hay que tratarlos como dos
piezas: **es una pieza en dos idiomas**.

Y no es un vídeo de alquiler de venue. Los subtítulos en español dicen
*espacio · crecimiento · combina · central · desarrollar · gastronómicas ·
escala · ejecución · detalles*, y en algún punto aparece **IMMIGRANT**. Eso es
la narración de una **presentación de negocio a inversores**, no un argumentario
de alquiler. Encaja con una historia de visa de inversión (E-2 / EB-5) usando el
club como el negocio que califica.

**Conviene confirmarlo antes de reutilizarlo**, porque un vídeo pensado para
inversores no vende fechas: habla de crecimiento y de ejecución, no de aforo ni
de qué incluye el alquiler.

Enseña, eso sí, lo que ningún otro material tiene:

- el paseo de palmeras hacia la fachada con el mural — la **entrada**
- bajo la palapa con **cabina de DJ, truss de iluminación y congas** montados
- la palapa vacía con mesas altas vestidas y césped artificial
- **el interior**: pasillo de neón con paredes de lentejuelas, y la zona de
  arcade — que es la parte de FunDimension

Va con marca de agua «Club Wynwood» en todos los fotogramas.

---

## CONCLUSIÓN, tras exprimirlos (17 de agosto)

**De los tres vídeos salió exactamente una imagen aprovechable.** Está puesta y
se ve: `recinto-noche.jpg`, en las páginas de fin de año y Art Basel.

Eso no es pereza, es lo que hay. El recorrido de por qué:

### Los de 93 s (IMG_8191 / 8192) — descartados

Llevan subtítulos quemados en la imagen, así que la mayoría de fotogramas trae
una palabra suelta encima («PERMITEN», «ESCALA») y no sirven. Buscando por
brillo en la banda inferior aparecen **10 segundos limpios en los 93**.

De esos diez: **ocho son interior de FunDimension** —láser tag, arcade, hasta un
rótulo «…MENSION» legible—, uno está movido, y el único bueno es el paseo de
palmeras… que ya tenemos mejor en `venue-exterior.webp`.

O sea: lo distintivo de ese vídeo es justo lo que decidimos no vender.

### El de la fiesta (IMG_5627) — una sola imagen

La apertura cenital (0–1,8 s) es lo único sin caras reconocibles. Se probó
sacar una segunda imagen del segundo 1,5 para el hueco `evento-montado`: **el
dron apenas se mueve en ese segundo y medio**, así que sale prácticamente la
misma foto. Poner las dos sería repetir.

El resto del minuto son primeros planos. En la hoja de contacto pequeña las
caras parecían diminutas; **a resolución completa son perfectamente
reconocibles.**

### La distinción que importa sobre los derechos

Daniel confirmó: *«los hicimos nosotros»*. Eso resuelve los **derechos de la
pieza** — es material propio y se puede usar.

**No resuelve el consentimiento de los invitados** para aparecer en publicidad.
Son dos permisos distintos, y en Florida hay ley de derecho de imagen. Grabar tu
propia fiesta te da el vídeo; no te da el derecho a poner la cara de un invitado
en un anuncio de Instagram.

Por eso el hueco `evento-montado` —el que más convierte— **sigue vacío**, y solo
se llena de dos maneras: pidiendo permiso a quien sale en esos planos, o
haciendo una foto ancha a propósito en el próximo evento. La segunda es más
barata que la primera.

---

## Lo que hay que decidir antes de usar nada

**IMG_5627 es una fiesta privada, y casi todo el vídeo son primeros planos de
invitados reconocibles.** De 24 fotogramas repartidos por el minuto, veinte son
caras identificables: parejas bailando, gente brindando, la tarta.

Usar eso en publicidad necesita el permiso por escrito de las personas que
salen. No es una formalidad: es material de una celebración privada, y un
invitado que se ve en un anuncio de Instagram tiene motivo para quejarse.

**Lo que sí se puede usar sin ese problema:**

| momento | qué se ve | estado |
|---|---|---|
| 0–1,8 s | **Cenital del recinto entero** al anochecer. La gente son puntos. | ✅ ya extraído |
| ≈1,95 s | Bandeja de copas de champán. Detalle, sin caras. | candidato |
| ≈30 s | Plano ancho con la paja y las columnas de luz; caras pequeñas. | candidato |
| varios | Los **artistas** (fuego, saxo, congas, samba) — son profesionales contratados, pero también hace falta su cesión. | consultar |

Y la marca de agua de 8191/8192 plantea otra pregunta: **ese vídeo lo produjo
alguien**. Antes de usarlo en la campaña hay que saber quién y con qué derechos.

---

## Lo que ya está hecho

**`public/assets/recinto-noche.jpg`** — el hueco `noche` de
[lib/fotos.ts](lib/fotos.ts) llevaba meses vacío y ya está cubierto.

Sale del fotograma del segundo 0,8 de IMG_5627, **girado 90°**. Como es un plano
cenital no tiene arriba ni abajo, así que al girarlo el vertical de 1080×1920 se
convierte en un **16/9 de 1920×1080 exacto, a resolución nativa y sin recortar un
solo píxel**. Recortarlo en vertical habría tirado dos tercios de la imagen.

Se ve el techo de paja, el paseo con alfombra roja, las palmeras iluminadas
desde el tronco, el arco de globos y el césped. Es exactamente lo que pedía el
encargo de ese hueco: *«el recinto de noche con la iluminación encendida»*.

---

## Qué más se puede sacar, por orden de lo que más rinde

### 1. El hueco `evento-montado` — el que más convierte

En [lib/fotos.ts](lib/fotos.ts) está marcado como el de mayor impacto y sigue
vacío: *«un evento REAL montado en el sitio, con gente»*. IMG_5627 **es** eso.

Falta elegir un plano ancho donde no se reconozca a nadie. El del segundo 30
—paja, columnas de luz, gente de espaldas y pequeña— es el mejor candidato.
Necesita tu visto bueno antes de publicarlo.

### 2. Un bucle mudo en la portada

Los primeros 1,8 s del cenital, en bucle, mudos, sin controles. Es el único
tramo limpio, y en movimiento vale mucho más que quieto: se ven las palmeras
moverse y las luces encendidas.

Tiene que ir con `poster` (la imagen que ya generé), `preload="metadata"` y
apagado con `prefers-reduced-motion`. Un vídeo de portada que se descarga entero
antes de que se vea la página es peor que no tenerlo.

### 3. Reels y TikTok — para lo que ya están listos

Son verticales 9:16 nativos. IMG_5627 a 60 fps y 24 Mbps aguanta perfectamente
el recorte a 30 s sin recomprimir dos veces.

Aquí el problema de las caras es **menor pero no desaparece**: publicar en el
perfil del venue una fiesta que se celebró allí es más defendible que meterlo en
un anuncio pagado. Aun así, pregúntale al anfitrión.

### 4. La pieza de 93 s: cortarla, no publicarla entera

93 segundos no los ve nadie en redes, y la narración va de inversión. Pero
dentro hay tres o cuatro planos que valen por separado:

- la entrada por el paseo de palmeras → hueco `acceso`
- la palapa con el DJ montado → prueba de que ahí cabe producción
- la palapa vacía con mesas altas → hueco `jardin-vacio`

**Con un límite honesto:** 576×1024 es baja resolución, y se nota. Sirve para
una historia de Instagram o para una miniatura, no para una imagen grande del
sitio. Si esos planos importan, es más barato volver a grabarlos que intentar
salvar estos.

---

## La palapa de las láminas 01 y 04: qué pasa exactamente

Investigado a fondo el 15 de agosto. Resultado: **el problema es el dibujo, no
la cota**, y por eso no se arregla cambiando el número.

### Lo que está confirmado

La palapa es un **bloque de paja a cuatro aguas, casi cuadrado**. Se ve en dos
fuentes independientes: la foto aérea del predio (`aerea-predio.jpg`) y el
cenital del vídeo de la fiesta. No hay ninguna duda sobre la forma.

Con los **~4.000 ft² declarados** por el propietario, un cuadrado da
√4.000 = 63,2 → **≈ 63 × 63 ft**. Es el criterio que ya usa
[LaminaConjunto.tsx](components/LaminaConjunto.tsx), donde está bien dibujada.

### Lo que NO se puede hacer

Cambiar el rótulo de «134 × 30» a «63 × 63» en las láminas 01 y 04. **Se probó
y queda peor.**

Midiendo sobre la lámina 04 renderizada: la flecha de esa cota abarca un 45 %
del predio, y el predio son 240 ft. O sea, **el dibujo representa unos 107 ft**.
Rotularlo «134» es una exageración; rotularlo «63» es una contradicción que se
ve a simple vista. La cota vieja al menos concuerda con lo dibujado.

En una lámina marcada «SIN ESCALA» la cota manda sobre la longitud dibujada,
pero eso vale para desviaciones pequeñas. Un factor de casi dos no es una
libertad de escala: es un plano que dice dos cosas distintas.

Lo mismo pasa con la lámina 02: la sección rotula 30 ft de ancho, que es el lado
corto del rectángulo largo. Si la palapa es cuadrada, la sección tendría que ser
de 63 ft — y el dibujo de la sección tampoco lo aguanta.

### Lo que sí lo arregla

Redibujar la geometría, no reetiquetarla. Y hay un camino corto: **la versión
paramétrica ya existe y ya está bien**. `LaminaConjunto.tsx` construye la palapa
desde [lib/iso.ts](lib/iso.ts) con `PALAPA = { dx: 63, dy: 63 }`, así que
cambiar la forma es cambiar dos números, no reescribir trazados SVG a mano.

Las láminas 01 y 04 son SVG portados del sitio estático, con los trazados
escritos a mano dentro de una cadena de 91 KB. Ahí no se toca la forma sin
rehacerla.

**Esto es una decisión tuya**, no un arreglo que se pueda dar por hecho: son las
láminas que más tiempo llevaron y sustituirlas por la versión paramétrica cambia
cómo se ven. Mientras tanto quedan como estaban, que es lo consistente.

Y sigue en pie lo mismo de antes: **la medida real se la tiene que dar Kate**.
Ninguna de las dos fotos tiene una referencia de escala fiable, y sacar una cifra
de ahí sería inventarla con aspecto de dato.

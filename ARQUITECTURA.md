# Club Wynwood — arquitectura del sitio

Reescritura del sitio estático a Next.js. Este documento explica **por qué** cada
decisión, no solo cuál.

---

## Por qué se reescribe

El sitio estático funciona y capta leads. No se reescribe por moda. Se reescribe
porque hay tres techos que el HTML plano **no puede** romper:

### 1. El 40% de la visibilidad IA está bloqueado por el hosting

Medido con la skill `amazing-seo` contra el sitio en vivo:

```
ai_visibility_score: 42/100  ·  "weak — AI surfaces likely under-citing"

  AI crawler accessibility   peso 25   SALTADO — robots.txt da 404
  Server-side rendering      peso 25   no medido
  Schema completeness        peso 15   80
  llms.txt quality           peso 15   0  — da 404
  Hreflang clarity           peso 10   50 — no hay
```

`robots.txt` y `llms.txt` **solo cuentan en la raíz del dominio**. El sitio vive
en `munozospinad0.github.io/club-wynwood/`, así que los nuestros están donde
ningún rastreador mira. Son 40 puntos de 100 que no dependen del código.

**Se resuelve con dominio propio.** Y si hay dominio propio, conviene Vercel.

### 2. El sitio es bilingüe en la MISMA URL

El HTML lleva español e inglés mezclados en `<span data-l>`, y CSS oculta uno.
Para un rastreador eso es **una sola página con el contenido duplicado en dos
idiomas**. No hay `hreflang` posible, ninguno de los dos idiomas posiciona bien,
y un modelo que lea el HTML crudo ve las dos versiones pegadas.

**Se resuelve con rutas por idioma:** `/es/...` y `/en/...` con `hreflang`
recíproco y `x-default`.

### 3. Las imágenes se sirven a un solo tamaño

La aérea es de 1024 px y se estiraba hasta 2880 px efectivos en retina. Se
arregló acotando el ancho, pero eso es un parche: no hay `srcset`, ni AVIF, ni
tamaños por breakpoint.

**Se resuelve con `next/image`**, que genera los formatos y tamaños.

---

## Lo que dice la investigación de AEO/GEO (2026)

Fuentes al final. Resumen de lo que aplica aquí:

| hallazgo | qué hacemos |
|---|---|
| Los rastreadores de IA **priorizan velocidad sobre ejecutar JavaScript**. Si el texto crítico se inyecta en cliente, no lo ven. | Server Components por defecto. `"use client"` solo en lo interactivo: láminas, idioma, formulario. |
| Los modelos citan **bloques de respuesta de 40-60 palabras** que abren con la conclusión. | Cada sección abre con un párrafo autocontenido que responde su pregunta en la primera frase. |
| Las frases subjetivas ("creemos", "en nuestra opinión") **suben la perplejidad y bajan la probabilidad de ser citado**. | Voz declarativa. Ya lo hacíamos por marca; ahora también por AEO. |
| `llms.txt` en la raíz es el estándar emergente. | Ruta `/llms.txt` generada desde la misma fuente de datos. |
| Auditar con 20-30 prompts reales y registrar quién sale citado. | Lista de prompts en `.meta/prompts-aeo.md`, para medir antes y después. |

---

## Stack

```
Next.js 15 · App Router · React 19 · TypeScript
Vercel (no GitHub Pages)
Sin librería de CSS: CSS Modules + tokens. El sistema visual ya existe y es chico.
```

**Por qué no Tailwind:** la dirección de arte ya está resuelta y cabe en ~30
tokens. Meter Tailwind añade una dependencia y una capa de traducción para no
ganar nada en un sitio de 7 páginas.

**Por qué Vercel y no GitHub Pages:**

| | GitHub Pages | Vercel |
|---|---|---|
| `robots.txt` y `llms.txt` en la raíz | ❌ es project page | ✅ |
| Optimización de imágenes | ❌ | ✅ `next/image` |
| Rutas por idioma con hreflang | manual | ✅ |
| Dominio propio | ✅ | ✅ |
| Precio | gratis | gratis en hobby |

---

## Estructura

```
app/
  [lang]/
    layout.tsx          <html lang> · metadata · JSON-LD · nav · pie
    page.tsx            home
    el-jardin/page.tsx
    tiki-hut/page.tsx
    bodas/page.tsx
    eventos-corporativos/page.tsx
    produccion-y-rodajes/page.tsx
    preguntas-frecuentes/page.tsx
  robots.ts             raíz de verdad
  sitemap.ts            las 14 URLs (7 × 2 idiomas) con hreflang
  llms.txt/route.ts     generado desde lib/venue.ts
components/
  Lamina.tsx            "use client" — las 4 láminas isométricas
  Formulario.tsx        "use client" — contra el webhook de n8n
  SelectorIdioma.tsx    "use client"
lib/
  venue.ts              FUENTE ÚNICA de datos. Ninguna cifra suelta.
  i18n.ts               diccionario y helpers de ruta
  schema.ts             JSON-LD derivado de venue.ts
```

### Regla que no se rompe

**Ninguna cifra se escribe en un componente.** Todo dato sale de `lib/venue.ts`
con su `estado` (`verificado` / `en-visita`) y su `fuente`. En el sitio anterior
las cifras estaban repetidas por el HTML y eso produjo contradicciones reales.

---

## Qué se conserva del sitio actual

- La dirección de arte: papel de obra, Fraunces + Geist, acento ocre.
- Las 4 láminas isométricas en SVG, con su dibujado al entrar en pantalla.
- El texto, ya reescrito y aprobado.
- El formulario y su cualificación de 4 señales contra n8n.
- La medición GA4 / Meta y la captura de `gclid`/`fbclid`.
- Los datos estructurados, ampliados.

## Qué cambia

- Rutas por idioma con hreflang.
- `robots.txt` y `llms.txt` en la raíz de verdad.
- Imágenes con `srcset` y AVIF.
- Cada sección abre con un bloque de respuesta citable.
- Un solo origen de datos, tipado.

---

## Pendientes que el código no resuelve

1. **Dominio.** Sin él, `robots.txt` y `llms.txt` siguen sin contar. Es el
   cambio de mayor impacto y no es técnico.
2. **Fotos.** Tres imágenes para siete páginas, la mejor de 1024 px. `next/image`
   no inventa píxeles.
3. **La geometría de las láminas 01 y 04 está mal.** La aérea muestra la palapa
   como un bloque casi cuadrado; están dibujadas como 134 × 30 ft.
4. **Coordenadas del predio** para el `geo` del schema. No se inventan.
5. **La pregunta a Sandra sobre FunDimension** — ver `INTELIGENCIA-COMPETENCIA.md`.

---

## Fuentes

- [AEO: How to Rank on ChatGPT and Perplexity in 2026](https://www.poweredbysearch.com/blog/aeo-llm-seo-best-practices/)
- [GEO Guide 2026](https://www.naypache-studio.com/insights/generative-engine-optimization-guide-2026)
- [ChatGPT SEO & GEO 2026](https://www.yotpo.com/blog/chatgpt-seo-geo-tips/)
- [FAQ on GEO and AEO — eMarketer](https://www.emarketer.com/content/faq-on-geo-aeo--where-ai-search-seo-overlap-2026)

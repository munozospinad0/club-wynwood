"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Idioma } from "@/lib/i18n";
import { bandaInvitados, ev } from "@/lib/medicion";
import LaminaRecinto, { type Aforo, type Modo, type Zona } from "@/components/LaminaRecinto";
import Formulario from "@/components/Formulario";
import {
  CAPITULOS,
  FOTOS,
  fotoOptimizada,
  oraciones,
  rutaAudio,
  tiempoDeFrase,
  type FotoRecorrido,
  type Hito,
  type Manifiesto,
  type Palabra,
  type VistaRecorrido,
} from "@/lib/recorrido";
import { Simbolo } from "@/components/Marca";

/**
 * EL RECORRIDO GUIADO. Alguien enseña el sitio, y el dibujo le sigue.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * QUÉ ES Y QUÉ NO ES
 * ─────────────────────────────────────────────────────────────────────────
 *
 * No es un vídeo. Un vídeo pesa, no se puede leer, no se indexa y hay que
 * volver a grabarlo entero cuando cambia una cifra. Esto es **el dibujo que ya
 * existe, narrado**: la voz cuenta, y en frases concretas del guion el dibujo
 * cambia de modo, resalta una zona, la cámara se acerca y el texto se enciende
 * palabra a palabra.
 *
 * Y sin embargo SE VE como un vídeo, que es lo que Daniel pidió el 6-sep-2026:
 * «darle más calidad… un video más completo, animado». Al empezar, la lámina
 * pasa a **modo cine**: pantalla completa sobre tinta, el dibujo como proyección
 * a la izquierda, y al lado los capítulos, el subtítulo y los mandos. En el
 * móvil, el dibujo arriba y el texto abajo. Y del mismo componente sale el
 * **MP4 para anuncios**: `herramientas/grabar-recorrido.mjs` abre esta página
 * con `?recorrido=grabar`, la deja correr y le pega la voz. Un solo guion, un
 * solo dibujo, dos salidas.
 *
 * Ocho capítulos, y cada uno contesta **una pregunta de productor** en el orden
 * en que las hace: qué es esto, si cabe su evento, qué pasa si llueve, por dónde
 * entra la producción, qué hay y qué no, cómo se ve montado, cuánto cuesta y qué
 * hacer ahora.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * FUNCIONA SIN VOZ, Y ESO ES DELIBERADO
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Si los audios no están —o el navegador no los puede reproducir, o alguien
 * llegó por una conexión mala— el recorrido **sigue existiendo**: se leen los
 * capítulos, el dibujo se mueve igual y los hitos se aplican por tiempo
 * estimado. La voz mejora la experiencia; no es la experiencia.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * LOS HITOS VAN ANCLADOS A PALABRAS, NO A SEGUNDOS
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Cada hito es una frase literal del guion. Cuando la voz llega a esa frase, el
 * dibujo cambia. Los tiempos salen del alineamiento palabra a palabra que
 * devuelve la locución, no de números escritos a mano. Con tiempos fijos, cada
 * corrección del guion obligaría a recronometrar a oído, y nadie lo hace.
 */

/**
 * NOMBRES TÉCNICOS. Daniel, 6-sep-2026: «dale un nombre más técnico a las cosas».
 * La primera versión hablaba como un guía («que te lo cuenten», «tu evento, en
 * el dibujo»). El público son productores, planners y agencias: se nombra como
 * en una ficha técnica —recorrido técnico narrado, simulador de aforo, plan de
 * lluvia, load-in— y se dejan las cifras a la vista.
 */
const T = {
  es: {
    ojo: "Recorrido técnico narrado",
    titulo: "El recinto, explicado en 3 minutos",
    intro:
      "Ocho capítulos sobre el plano: superficie, aforo, plan de lluvia, load-in, infraestructura, montaje tipo, condiciones y siguiente paso. Con voz, subtítulos y fotografías del predio.",
    reproducir: "Iniciar el recorrido",
    pausar: "Pausar",
    seguir: "Reanudar",
    parar: "Cerrar",
    siguiente: "Siguiente",
    anterior: "Anterior",
    capitulo: "Capítulo",
    de: "de",
    sinVoz: "Sin audio: el capítulo se lee y el plano se anima igual.",
    transcripcion: "Transcripción completa del recorrido",
    capitulos: "capítulos",
    minutos: "min",
    musica: "Música",
    texto: "Transcripción",
    idioma: "Idioma",
    volverCapitulos: "Volver a los capítulos",
    teclas: "Espacio pausa · flechas cambian de capítulo · Esc cierra",
    ojoCierre: "Solicitar disponibilidad",
    tituloCierre: "Ficha técnica y disponibilidad",
    introCierre:
      "Indica fecha y aforo estimado. Respondemos con disponibilidad real, condiciones y la ficha técnica completa en 24 horas hábiles.",
    aforoOjo: "Simulador de aforo",
    aforoInvitados: "Asistentes",
    sentados: "Banquete · sentados",
    pie: "Cóctel · de pie",
    consultar: (n: number) => `Solicitar disponibilidad · ${n} asistentes`,
    calcular: "Calculadora de aforo y superficie",
    cabe: {
      sentados: (n: number, mesas: number) => `Cabe. ${n} asistentes en banquete son ${mesas} mesas de 10 en el Jardín, con pasillo de servicio entre mesas.`,
      pie: (n: number, pct: number) => `Cabe. ${n} asistentes de pie ocupan ~${pct} % del Jardín; el resto queda para escenario, barra y circulación.`,
      noSentados: "No cabe en banquete: el aforo verificado sentado es de ~300. En formato cóctel, hasta 600.",
      noPie: "Supera el aforo verificado de ~600 de pie. Preferimos indicarlo antes de la visita técnica.",
    },
    tarjeta: {
      nombre: "Club Wynwood",
      linea: "Jardín de eventos al aire libre · Wynwood, Miami",
      cta: "Solicita disponibilidad y ficha técnica en clubwynwood.com",
    },
  },
  en: {
    ojo: "Narrated technical tour",
    titulo: "The site, explained in 3 minutes",
    intro:
      "Eight chapters over the plan: area, capacity, rain plan, load-in, infrastructure, sample setup, terms and next step. With voice, captions and photographs of the site.",
    reproducir: "Start the tour",
    pausar: "Pause",
    seguir: "Resume",
    parar: "Close",
    siguiente: "Next",
    anterior: "Previous",
    capitulo: "Chapter",
    de: "of",
    sinVoz: "No audio: the chapter is read and the plan animates all the same.",
    transcripcion: "Full tour transcript",
    capitulos: "chapters",
    minutos: "min",
    musica: "Music",
    texto: "Transcript",
    idioma: "Language",
    volverCapitulos: "Back to the chapters",
    teclas: "Space pauses · arrows change chapter · Esc closes",
    ojoCierre: "Request availability",
    tituloCierre: "Spec sheet and availability",
    introCierre:
      "Give us the date and estimated headcount. We reply with real availability, terms and the full spec sheet within 24 business hours.",
    aforoOjo: "Capacity simulator",
    aforoInvitados: "Guests",
    sentados: "Banquet · seated",
    pie: "Cocktail · standing",
    consultar: (n: number) => `Request availability · ${n} guests`,
    calcular: "Capacity and area calculator",
    cabe: {
      sentados: (n: number, mesas: number) => `It fits. ${n} guests in banquet layout are ${mesas} tables of 10 in the Garden, with service aisles between tables.`,
      pie: (n: number, pct: number) => `It fits. ${n} guests standing take ~${pct}% of the Garden; the rest stays for stage, bar and circulation.`,
      noSentados: "It does not fit as a banquet: verified seated capacity is ~300. In cocktail format, up to 600.",
      noPie: "Above the verified capacity of ~600 standing. We would rather say so before the site visit.",
    },
    tarjeta: {
      nombre: "Club Wynwood",
      linea: "Open-air event garden · Wynwood, Miami",
      cta: "Request availability and the spec sheet at clubwynwood.com",
    },
  },
} as const;

interface EstadoCapitulo {
  modo: Modo;
  zona: Zona | null;
  /** A qué parte del terreno se refiere la frase que suena ahora. */
  punto: [number, number] | null;
  zoom: number;
  /** Desde qué cámara se mira ahora (el load-in se cuenta desde el oeste). */
  vista: VistaRecorrido;
  /** La foto que toca ahora, si el guion pidió una y todavía dura. */
  foto: FotoRecorrido | null;
  /** La cifra que se está diciendo, junto a la marca. */
  cifra: string | null;
  /**
   * CAPAS ADITIVAS. El modo es exclusivo (lluvia O noche O mesas); las capas se
   * suman: «pasillos» encima de las mesas, «postes» encima de la palapa, el
   * escenario montándose pieza a pieza. Es lo que permite que cada frase
   * encienda exactamente lo que dice, como en Loymark Academy.
   */
  capas: string[];
}

/** Cómo se llama, en la lámina, la zona de la que se está hablando. */
const NOMBRE_ZONA: Record<Zona, Record<"es" | "en", string>> = {
  jardin: { es: "El Jardín", en: "The Garden" },
  tiki: { es: "El Tiki Hut", en: "The Tiki Hut" },
  cabanas: { es: "Las cabañas", en: "The cabanas" },
  acceso: { es: "El acceso", en: "The entrance" },
  edificio: { es: "El edificio", en: "The building" },
};

/** Ruta relativa a la página de aforos, por idioma, para no importar el mapa de rutas entero. */
const RUTA_AFOROS: Record<Idioma, string> = { es: "/es/aforo-y-montajes", en: "/en/capacity-and-layouts" };

const TOPE = { sentados: 300, pie: 600 };
const JARDIN_FT2 = 18000;

/**
 * Cuánto se queda el dibujo al acabar la voz de cada capítulo, en segundos,
 * antes de pasar al siguiente. Daniel (7-sep): «hay que darle un poco más de
 * tiempo a las cosas para poder verlas». Vale para el reloj sin voz, para la
 * grabación del MP4 y (menos 0,3 s de la propia cola del audio) para el sitio.
 */
const COLA_CAPITULO = 1.7;

/**
 * Cuánto se espera antes de empezar a precargar las fotos del recorrido.
 *
 * No es un número mágico: es la ventaja que se le da al MP3 de la voz del
 * primer capítulo para que llegue antes de que ninguna imagen le dispute el
 * ancho de banda. Sin esta pausa, en un teléfono la voz arranca tarde o no
 * arranca, y el recorrido parece mudo aunque el audio esté bien publicado.
 */
const VENTAJA_AUDIO_MS = 1200;

/**
 * Cuánto se le da al audio para arrancar antes de sospechar, y el techo a
 * partir del cual se da por perdido aunque siga descargando. El valor viejo era
 * de 3 s de un solo golpe y apagaba la voz de la sesión entera; ver el vigilante
 * más abajo.
 */
const ESPERA_AUDIO_MS = 9000;
const TECHO_AUDIO_MS = 25000;

declare global {
  interface Window {
    /** Lo escribe el modo de grabación: cuándo empezó cada capítulo, en reloj de pared. */
    __recorridoMarcas?: Array<{ capitulo: number; id: string; t: number }>;
    __recorridoFin?: number;
  }
}

export default function Recorrido({ lang }: { lang: Idioma }) {
  const t = T[lang];

  const [activo, setActivo] = useState(false);
  const [indice, setIndice] = useState(0);
  const [sonando, setSonando] = useState(false);
  const [segundo, setSegundo] = useState(0);
  const [duracion, setDuracion] = useState(0);
  const [palabras, setPalabras] = useState<Palabra[]>([]);
  const [manifiesto, setManifiesto] = useState<Manifiesto | null | false>(null);
  const [hayAudio, setHayAudio] = useState<boolean | null>(null);
  const [verTexto, setVerTexto] = useState(false);
  /**
   * EL FORMULARIO, A UN TOQUE, EN CUALQUIER MOMENTO. Daniel: «que esté un botón
   * fácil para llenar el form y conseguir más información». Antes solo aparecía
   * al llegar al último capítulo; ahora hay un botón ocre siempre a la vista en
   * el cine, y el formulario se abre en el panel mientras el recorrido sigue.
   */
  const [verFormulario, setVerFormulario] = useState(false);
  /**
   * Qué capítulos ya se escucharon. La lista de capítulos son las preguntas de
   * la gente y se puede saltar a cualquiera; sin marcar por dónde se ha pasado,
   * al volver a la lista no hay forma de saber qué falta.
   */
  const [oidos, setOidos] = useState<Set<number>>(new Set());
  /** Sube en cada arranque: la lámina vuelve a dibujarse desde cero. */
  const [semilla, setSemilla] = useState(0);

  /**
   * MODO DE GRABACIÓN Y ARRANQUE AUTOMÁTICO, por la URL.
   *
   *   ?recorrido=auto    empieza solo, con voz. Para revisar sin tocar nada.
   *   ?recorrido=grabar  empieza solo, SIN voz y con reloj exacto sacado del
   *                      manifiesto, sin mandos y con tarjeta final. Es lo que
   *                      abre `herramientas/grabar-recorrido.mjs` para sacar el
   *                      MP4: la voz se pega después, con los mismos tiempos.
   *   &cap=N             empieza en el capítulo N (desde 1).
   */
  const [arranque, setArranque] = useState<"auto" | "grabar" | null>(null);
  const grabando = arranque === "grabar";

  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      const m = q.get("recorrido");
      if (m === "auto" || m === "grabar") setArranque(m);
      const c = parseInt(q.get("cap") ?? "", 10);
      if (Number.isFinite(c) && c >= 1 && c <= CAPITULOS.length) setIndice(c - 1);
    } catch { /* sin URL utilizable: arranque normal */ }
  }, []);

  const audio = useRef<HTMLAudioElement | null>(null);
  const cama = useRef<HTMLAudioElement | null>(null);

  /**
   * LA MÚSICA DE FONDO, ENCENDIDA POR DEFECTO desde el 6-sep-2026. Estaba
   * apagada por prudencia —un sitio que suena solo es un sitio que se cierra—
   * pero el recorrido solo arranca cuando la persona pulsa «ver», así que ya
   * es su decisión, y Daniel: «la música no se oye». Va a un volumen que se
   * oye bajo la voz sin taparla, fijo, y con el interruptor a la vista. Si
   * alguien la apaga, se recuerda.
   */
  const [musica, setMusica] = useState(true);

  useEffect(() => {
    try {
      if (localStorage.getItem("cw-musica") === "off") setMusica(false);
    } catch { /* almacenamiento bloqueado: se queda encendida */ }
  }, []);

  useEffect(() => {
    const el = cama.current;
    if (!el) return;
    if (musica && activo && sonando && !grabando) {
      if (!el.src) el.src = "/audio/recorrido/cama.mp3";
      el.volume = 0.26;
      void el.play().catch(() => { /* el navegador puede negarse; no es grave */ });
    } else {
      el.pause();
    }
  }, [musica, activo, sonando, grabando]);

  /** Para el avance sin voz: un reloj que hace de reproductor. */
  const reloj = useRef<ReturnType<typeof setInterval> | null>(null);
  // El último segundo pintado, para que el reloj de pared arranque desde ahí al reanudar. Se sincroniza ANTES del efecto del reloj.
  const segundoRef = useRef(0);
  useEffect(() => { segundoRef.current = segundo; }, [segundo]);

  const cap = CAPITULOS[indice];
  const texto = cap.texto[lang];
  const hitos = cap.hitos[lang] ?? [];
  const ultimo = indice === CAPITULOS.length - 1;

  /**
   * Cuánto dura un capítulo cuando no hay voz. Primero, la duración real del
   * audio grabado si el manifiesto la trae (es lo que usa la grabación para
   * que el vídeo y la voz casen); si no, se estima por longitud del texto.
   */
  const duracionEstimada = useMemo(() => {
    const real = manifiesto && manifiesto.duraciones?.[lang]?.[indice];
    if (typeof real === "number" && real > 0) return real + COLA_CAPITULO;
    return Math.max(8, texto.length / 14);
  }, [manifiesto, lang, indice, texto]);

  const dur = hayAudio && duracion > 0 ? duracion : duracionEstimada;

  /** Cuánto dura el recorrido entero, redondeado, en minutos. */
  const minutos = useMemo(() => {
    const reales = manifiesto ? manifiesto.duraciones?.[lang] : undefined;
    const total = reales && reales.length === CAPITULOS.length
      ? reales.reduce((s: number, d: number) => s + d, 0)
      : CAPITULOS.reduce((s, c) => s + c.texto[lang].length / 14, 0);
    return Math.max(1, Math.round(total / 60));
  }, [manifiesto, lang]);

  // ── el estado del dibujo en este segundo ─────────────────────────────────

  /**
   * El modo, la zona, el punto y el zoom que tocan AHORA: los del capítulo, más
   * los del último hito que ya haya pasado. Se calcula, no se guarda: así saltar
   * a mitad del audio deja el dibujo como tiene que estar.
   */
  const estado: EstadoCapitulo = useMemo(() => {
    let e: EstadoCapitulo = {
      modo: cap.modo as Modo,
      zona: cap.zona as Zona | null,
      punto: (cap.punto as [number, number] | null) ?? null,
      zoom: cap.zoom ?? 1,
      vista: cap.vista ?? "sur",
      foto: null,
      cifra: null,
      capas: cap.capas ?? [],
    };
    const cuandos = (hitos as Hito[]).map((h) => tiempoDeFrase(h.frase, texto, palabras, dur));
    for (let k = 0; k < hitos.length; k++) {
      const h = hitos[k] as Hito;
      const cuando = cuandos[k];
      if (segundo + 0.15 < cuando) break;
      if (h.modo) e = { ...e, modo: h.modo as Modo };
      if (h.zona !== undefined) e = { ...e, zona: h.zona as Zona | null };
      if (h.punto !== undefined) e = { ...e, punto: (h.punto as [number, number] | null) ?? null };
      if (h.zoom !== undefined) e = { ...e, zoom: h.zoom };
      if (h.vista) e = { ...e, vista: h.vista };
      if (h.cifra !== undefined) e = { ...e, cifra: h.cifra };
      if (h.agregar) e = { ...e, capas: Array.from(new Set([...e.capas, ...h.agregar])) };
      if (h.quitar) e = { ...e, capas: e.capas.filter((c) => !h.quitar!.includes(c)) };
      // La foto no se acumula: dura lo que dice el hito y se va sola. Daniel
      // (7-sep): «hay que darle un poco más de tiempo a las cosas para poder
      // verlas»: cada foto gana un segundo, pero nunca pisa el hito siguiente
      // (se va 0,4 s antes de que llegue) ni baja de 1,8 s.
      if (h.foto) {
        const pedido = h.segundos ?? 4;
        const proximo = cuandos[k + 1];
        const fin = proximo === undefined
          ? cuando + pedido + 1
          : Math.min(cuando + pedido + 1, Math.max(cuando + Math.min(pedido, 1.8), proximo - 0.4));
        e = { ...e, foto: segundo + 0.15 < fin ? h.foto : null };
      }
    }
    return e;
  }, [cap, hitos, texto, palabras, dur, segundo]);

  // Las capas se estabilizan por valor, como el punto: un array nuevo por
  // cálculo haría repintar el dibujo sin motivo.
  const capasClave = estado.capas.slice().sort().join(" ");
  const capas = useMemo(() => (capasClave ? capasClave.split(" ") : []), [capasClave]);
  // Con el formulario abierto en el panel, el cine sigue siendo la maqueta
  // final: el subtítulo se queda arriba, compacto (misma clase que el cierre).
  const panelFinal = ultimo || verFormulario;

  const fotoDirigida = useMemo(
    () => (estado.foto ? { src: FOTOS[estado.foto].src, pos: FOTOS[estado.foto].pos, alt: FOTOS[estado.foto].alt[lang], tamano: FOTOS[estado.foto].tamano } : null),
    [estado.foto, lang]
  );

  // El punto se estabiliza por valor: como array nuevo en cada cálculo haría
  // que la lámina creyera que cambió y repintara la marca sin motivo.
  const puntoClave = estado.punto ? `${estado.punto[0]},${estado.punto[1]}` : "";
  const punto = useMemo<[number, number] | null>(
    () => (puntoClave ? (puntoClave.split(",").map(Number) as [number, number]) : null),
    [puntoClave]
  );

  /** Las oraciones con sus palabras cronometradas, y cuál se está diciendo. */
  const frases = useMemo(() => oraciones(texto, palabras, dur), [texto, palabras, dur]);
  const fraseActual = useMemo(() => {
    let i = 0;
    for (let k = 0; k < frases.length; k++) if (segundo + 0.15 >= frases[k].inicio) i = k;
    return i;
  }, [frases, segundo]);

  // ── carga del capítulo ───────────────────────────────────────────────────

  /**
   * ¿HAY VOZ GRABADA? Se pregunta UNA vez, con un manifiesto. La alternativa
   * era pedir el audio y el alineamiento de cada capítulo y ver cuáles fallan:
   * deja la consola llena de 404 y el día que se rompa algo de verdad, el error
   * que importa estará enterrado entre errores que son normales.
   */
  useEffect(() => {
    if (!activo || manifiesto !== null) return;
    let cancelado = false;
    fetch("/audio/recorrido/manifiesto.json")
      .then(async (r) => {
        if (cancelado) return;
        if (!r.ok) { setManifiesto(false); setHayAudio(false); return; }
        const m = (await r.json()) as Manifiesto;
        setManifiesto(m);
        // Grabando no se reproduce nada: el reloj manda y la voz se pega después.
        setHayAudio(grabando ? false : true);
      })
      .catch(() => { if (!cancelado) { setManifiesto(false); setHayAudio(false); } });
    return () => { cancelado = true; };
  }, [activo, manifiesto, grabando]);

  useEffect(() => {
    if (!activo || !manifiesto) return;
    let cancelado = false;
    const { palabras: ruta } = rutaAudio(lang, indice);

    setPalabras([]);
    setSegundo(0);

    // El alineamiento se pide aparte del audio: si falta el de un capítulo
    // suelto, ese capítulo cae por estimación y los demás siguen exactos.
    fetch(ruta)
      .then((r) => (r.ok ? r.json() : []))
      .then((p: Palabra[]) => { if (!cancelado) setPalabras(Array.isArray(p) ? p : []); })
      .catch(() => { /* sin alineamiento, se estima */ });

    return () => { cancelado = true; };
  }, [activo, manifiesto, indice, lang]);

  // ── el reloj de cuando no hay voz ────────────────────────────────────────

  useEffect(() => {
    if (reloj.current) { clearInterval(reloj.current); reloj.current = null; }
    // `=== false` y no `!hayAudio`: mientras vale null todavía no se sabe si hay
    // voz, y arrancar el reloj entonces adelantaría el capítulo un instante.
    if (!activo || !sonando || hayAudio !== false) return;

    /**
     * El reloj se lee del TIEMPO DE PARED, no se acumula a pasos de 0,1 s. Con
     * el dibujo cargado (600 personas animadas, haces, 360 gotas) el navegador
     * se salta ticks del setInterval, y sumando pasos el capítulo duraba 5–13 s
     * más que su voz: en el MP4 la voz se callaba y el dibujo seguía en
     * silencio hasta el siguiente capítulo (grabación del 7-sep, 13:30).
     */
    const inicio = performance.now(), base = segundoRef.current;
    reloj.current = setInterval(() => {
      const s = base + (performance.now() - inicio) / 1000;
      setSegundo(s >= duracionEstimada ? duracionEstimada : s);
    }, 100);

    return () => { if (reloj.current) clearInterval(reloj.current); };
  }, [activo, sonando, hayAudio, duracionEstimada]);

  /**
   * EL SEGUNDO SE PONE A CERO AQUÍ MISMO, en el mismo lote que el cambio de
   * capítulo, y no es un detalle.
   *
   * Antes se reiniciaba en el efecto que carga el alineamiento, que corre
   * DESPUÉS de pintar. En ese cuadro intermedio el capítulo nuevo se comparaba
   * con el segundo del capítulo viejo: si el anterior duraba 22 s y el nuevo
   * 16, el reloj «ya había llegado al final» y saltaba otro capítulo sin
   * decir una palabra. El vídeo exportado salió de 98 s en vez de 170, y en
   * el sitio sin voz pasaba lo mismo. No daba ningún error.
   */
  const cola = useRef<number | null>(null);
  const siguiente = useCallback(() => {
    if (cola.current) { clearTimeout(cola.current); cola.current = null; }
    segundoRef.current = 0;
    setSegundo(0);
    setIndice((i) => {
      setOidos((o) => new Set(o).add(i));
      if (i + 1 >= CAPITULOS.length) { setSonando(false); return i; }
      return i + 1;
    });
  }, []);

  // Sin voz, el capítulo pasa solo al llegar al final del reloj. El umbral
  // exige medio segundo de reloj corrido: así un segundo heredado de otro
  // capítulo, si alguna vez lo hubiera, tampoco lo adelantaría.
  useEffect(() => {
    if (hayAudio === false && sonando && segundo > 0.5 && segundo >= duracionEstimada - 0.05) siguiente();
  }, [hayAudio, sonando, segundo, duracionEstimada, siguiente]);

  /**
   * EL VIGILANTE. Si el audio existe pero no avanza, se sigue sin él. Tres
   * segundos sin que el tiempo se mueva y se pasa al reloj estimado: se pierde
   * el sincronismo fino, no se pierde el recorrido.
   */
  /**
   * EL VIGILANTE DEL AUDIO. Aquí estaba por qué el recorrido sonaba mudo.
   *
   * Antes daba **tres segundos** y, si el audio no había avanzado, apagaba la
   * voz de forma **definitiva** para el resto de la sesión. Tres segundos es
   * muy poco para el primer MP3 en un teléfono, y era imposible de cumplir
   * mientras las doce fotos del recorrido se descargaban en paralelo (ver
   * `precargarFotos`). Resultado: el vigilante saltaba casi siempre, el
   * recorrido caía al reloj estimado, y quedaba mudo aunque el audio estuviera
   * perfectamente publicado y se sirviera bien. Los dos síntomas que parecían
   * distintos —«va lento» y «no tiene audio»— eran el mismo problema.
   *
   * Ahora distingue las dos situaciones que antes se confundían:
   *
   * - **Todavía descargando** no es lo mismo que **roto**. Si el elemento sigue
   *   pidiendo datos y aún no tiene suficientes para reproducir, se espera.
   * - **Callado y sin descargar nada** sí es un fallo, y ahí se cae al reloj.
   *
   * Y hay un techo, para que un audio que nunca llega no deje el recorrido
   * congelado esperándolo: pasado ese punto se sigue sin voz, que es
   * exactamente lo que el componente ya sabe hacer.
   */
  useEffect(() => {
    if (!activo || !sonando || hayAudio !== true) return;
    const partida = segundo;
    const desde = Date.now();
    const iv = window.setInterval(() => {
      const el = audio.current;
      if (!el) return;
      if (el.currentTime > partida + 0.05) { window.clearInterval(iv); return; }
      const espera = Date.now() - desde;
      if (espera < ESPERA_AUDIO_MS) return;
      // NETWORK_LOADING (2) con readyState por debajo de HAVE_FUTURE_DATA (3)
      // significa que el navegador sigue trayendo el MP3. No está roto.
      const bajando = el.networkState === 2 && el.readyState < 3;
      if (bajando && espera < TECHO_AUDIO_MS) return;
      window.clearInterval(iv);
      console.warn("[recorrido] el audio no arranca; se sigue con el reloj estimado");
      setHayAudio(false);
    }, 1500);
    return () => window.clearInterval(iv);
    // `segundo` en las dependencias a propósito: mientras avance, el vigilante
    // se reinicia y nunca salta. Solo salta si deja de avanzar.
  }, [activo, sonando, hayAudio, segundo]);

  // ── el audio ─────────────────────────────────────────────────────────────

  /**
   * Pone la pista del capítulo y la reproduce.
   *
   * **Solo cambia el `src` si de verdad es otro.** Antes lo asignaba siempre, y
   * asignar la misma cadena a `src` hace que el navegador recargue el archivo y
   * lo devuelva al segundo cero. Como el desbloqueo del teléfono ya arranca la
   * pista del primer capítulo dentro del gesto (ver `alEmpezar`), este efecto
   * llegaba después y la cortaba de raíz.
   *
   * Y un `play()` rechazado ya no apaga la voz de la sesión: de eso se encarga
   * el vigilante, que sabe distinguir «todavía cargando» de «roto». En un
   * teléfono, el primer intento se rechaza a menudo y no significa nada.
   */
  useEffect(() => {
    const el = audio.current;
    if (!el || !activo || hayAudio !== true) return;
    const pista = rutaAudio(lang, indice).mp3;
    if (!el.currentSrc.endsWith(pista) && !el.src.endsWith(pista)) {
      el.src = pista;
      el.load();
    }
    if (sonando) void el.play().catch(() => { /* lo evalúa el vigilante */ });
  }, [activo, hayAudio, indice, lang, sonando]);

  // ── las marcas de tiempo para la grabación ───────────────────────────────

  useEffect(() => {
    if (!grabando || !activo) return;
    window.__recorridoMarcas = window.__recorridoMarcas ?? [];
    window.__recorridoMarcas.push({ capitulo: indice, id: cap.id, t: Date.now() });
  }, [grabando, activo, indice, cap.id]);

  // Al acabar el último capítulo: seis segundos de tarjeta y se avisa que terminó.
  useEffect(() => {
    if (!grabando || !activo || !ultimo || sonando) return;
    const tm = setTimeout(() => {
      window.__recorridoFin = Date.now();
      document.body.dataset.recorrido = "fin";
    }, 6000);
    return () => clearTimeout(tm);
  }, [grabando, activo, ultimo, sonando]);

  // ── hasta dónde llega la gente ───────────────────────────────────────────

  /**
   * MEDIR HASTA DÓNDE SE VE. Daniel: «que podamos ver y medir cuánta gente ve
   * el vídeo hasta dónde, así podemos mejorar». Se manda con los nombres y los
   * parámetros con que GA4 mide un vídeo (`video_start`, `video_progress` al
   * 10/25/50/75, `video_complete`; `video_percent`, `video_current_time`,
   * `video_duration`, `video_title`), así entra en sus informes de vídeo sin
   * configurar nada. Al cerrar antes del final va `tour_exit` con el porcentaje
   * exacto: ese es el dato de dónde se pierde la gente. El embudo por capítulo
   * ya sale de `view_plate` con `chapter`. Grabando el MP4 no se mide nada: lo
   * «ve» un navegador sin cabeza y contaminaría el informe.
   */
  const duracionesReales: number[] | undefined = manifiesto ? manifiesto.duraciones?.[lang] : undefined;
  const porCapitulo = useMemo<number[]>(
    () => (duracionesReales && duracionesReales.length === CAPITULOS.length
      ? duracionesReales
      : CAPITULOS.map((c) => Math.max(8, c.texto[lang].length / 14))),
    [duracionesReales, lang]
  );
  const totalRecorrido = porCapitulo.reduce((s, d) => s + d, 0);
  const transcurrido = porCapitulo.slice(0, indice).reduce((s, d) => s + d, 0) + Math.min(segundo, porCapitulo[indice] ?? 0);
  const porcentaje = Math.max(0, Math.min(100, Math.round((transcurrido / totalRecorrido) * 100)));

  const progreso = useRef({ porcentaje: 0, transcurrido: 0, capitulo: cap.id, completo: false });
  useEffect(() => {
    progreso.current.porcentaje = porcentaje;
    progreso.current.transcurrido = transcurrido;
    progreso.current.capitulo = cap.id;
  }, [porcentaje, transcurrido, cap.id]);
  const umbrales = useRef<Set<number>>(new Set());

  const datosVideo = useCallback((extra: Record<string, unknown> = {}) => ({
    video_title: `Recorrido técnico narrado · ${lang.toUpperCase()}`,
    video_provider: "clubwynwood",
    video_url: typeof location !== "undefined" ? location.pathname : "",
    video_duration: Math.round(totalRecorrido),
    lang,
    chapter: progreso.current.capitulo,
    ...extra,
  }), [lang, totalRecorrido]);

  // Arranca: se limpian los umbrales y se avisa.
  useEffect(() => {
    if (!activo || grabando) return;
    umbrales.current.clear();
    progreso.current.completo = false;
    ev("video_start", datosVideo());
    // Solo al pasar a activo: `datosVideo` cambia con el idioma y no es un arranque.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activo, grabando]);

  // Cruza un umbral: 10, 25, 50, 75 %.
  useEffect(() => {
    if (!activo || grabando || !sonando) return;
    for (const u of [10, 25, 50, 75]) {
      if (porcentaje >= u && !umbrales.current.has(u)) {
        umbrales.current.add(u);
        ev("video_progress", datosVideo({ video_percent: u, video_current_time: Math.round(transcurrido) }));
      }
    }
  }, [activo, grabando, sonando, porcentaje, transcurrido, datosVideo]);

  // Termina: el último capítulo acabó y `siguiente` apagó el sonido con el reloj en cero.
  useEffect(() => {
    if (!activo || grabando || !ultimo || sonando || segundo !== 0) return;
    if (!oidos.has(CAPITULOS.length - 1) || progreso.current.completo) return;
    progreso.current.completo = true;
    ev("video_complete", datosVideo({ video_percent: 100, video_current_time: Math.round(totalRecorrido) }));
  }, [activo, grabando, ultimo, sonando, segundo, oidos, datosVideo, totalRecorrido]);

  // ── el aforo interactivo, antes de empezar ───────────────────────────────

  /**
   * TU EVENTO, EN EL DIBUJO. La pregunta que decide todo es cuánta gente, y
   * era la única que el sitio contestaba con un número en vez de enseñarla.
   * Aquí la persona escribe sus invitados y el dibujo pone sus mesas o su
   * gente, a escala, y dice si caben. Es la calculadora de la página de aforos
   * puesta donde de verdad se decide, y de paso la primera señal de
   * cualificación que el lead nos da sin que se la pidamos.
   */
  const [aforo, setAforo] = useState<Aforo>({ invitados: 300, formato: "sentados" });
  const [vistaAforo, setVistaAforo] = useState<boolean>(false);

  const cabe = aforo.formato === "sentados" ? aforo.invitados <= TOPE.sentados : aforo.invitados <= TOPE.pie;
  const veredicto = aforo.formato === "sentados"
    ? (cabe ? t.cabe.sentados(aforo.invitados, Math.ceil(aforo.invitados / 10)) : t.cabe.noSentados)
    : (cabe ? t.cabe.pie(aforo.invitados, Math.round((aforo.invitados * 8 / JARDIN_FT2) * 100)) : t.cabe.noPie);

  function cambiarAforo(cambio: Partial<Aforo>) {
    const nuevo = { ...aforo, ...cambio };
    nuevo.invitados = Math.max(10, Math.min(900, Math.round(nuevo.invitados) || 0));
    setAforo(nuevo);
    setVistaAforo(true);
    ev("toggle_layer", { layer: "aforo", guests_band: bandaInvitados(nuevo.invitados), format: nuevo.formato });
  }

  function consultarConAforo() {
    try { sessionStorage.setItem("cw-invitados", String(aforo.invitados)); } catch { /* bloqueado */ }
    window.dispatchEvent(new CustomEvent("cw-invitados", { detail: aforo.invitados }));
    document.getElementById("disponibilidad")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ── arranque, mandos y teclado ───────────────────────────────────────────

  const raiz = useRef<HTMLDivElement>(null);

  /**
   * LA PORTADA DEL VÍDEO. Solo grabando: tres segundos con el nombre, el
   * descriptor y la aérea, antes de que empiece la voz. Un vídeo que arranca
   * hablando en el primer cuadro parece cortado.
   */
  const [portada, setPortada] = useState(false);

  /**
   * LAS FOTOS DEL RECORRIDO, PEDIDAS CON CABEZA.
   *
   * Antes se pedían **las doce de golpe y en crudo**: un `new Image()` por cada
   * `/assets/*.jpg`, que son unos 2,5 MB de JPEG sin optimizar saliendo a la
   * vez, en el mismo instante en que el audio del primer capítulo tiene que
   * cargar y empezar a sonar.
   *
   * Eso hacía daño por los dos lados a la vez, y explica dos síntomas que
   * parecían distintos:
   *
   * - **El recorrido parecía mudo.** Con el ancho de banda repartido entre doce
   *   descargas, el MP3 de la voz llegaba tarde; el `play()` se quedaba
   *   esperando datos y el capítulo avanzaba en silencio. En un teléfono con
   *   red normal, siempre.
   * - **Las fotos tampoco llegaban antes.** Doce peticiones en paralelo se
   *   estorban entre ellas: la primera foto, que es la única que hace falta en
   *   los primeros segundos, competía con otras once que no se ven hasta
   *   minutos después.
   *
   * Ahora van por el **optimizador de imágenes**, que las sirve en WebP o AVIF
   * al ancho que de verdad se ve —la diferencia contra el JPEG original es de
   * varias veces— y **de una en una**: la siguiente arranca cuando termina la
   * anterior. Encadenarlas así se auto-regula en conexiones lentas, no satura
   * nada, y deja la primera foto lista mucho antes que el método anterior.
   *
   * El retraso inicial es deliberado: le da ventaja al audio, que es lo que
   * decide si la voz arranca a tiempo o el recorrido parece roto.
   */
  const precargando = useRef(false);
  const precargarFotos = useCallback(() => {
    if (precargando.current) return;
    precargando.current = true;
    // La MISMA función que usa el cine para mostrarlas. Si estas dos URL se
    // separan, se calienta una versión que nadie pide y se descarga todo dos
    // veces. Ya pasó una vez; por eso vive en `lib/recorrido.ts`.
    const rutas = Object.values(FOTOS).map((f) => fotoOptimizada(f.src));
    let i = 0;
    const siguiente = () => {
      if (i >= rutas.length) return;
      const img = document.createElement("img");
      img.onload = siguiente;
      img.onerror = siguiente; // una foto que falle no puede parar la cadena
      img.src = rutas[i++];
    };
    window.setTimeout(siguiente, VENTAJA_AUDIO_MS);
  }, []);

  /**
   * EN EL TELÉFONO, QUE EL CAPÍTULO ACTUAL SE VEA.
   *
   * La tira de capítulos se desliza en horizontal, pero nunca se movía sola. En
   * las capturas del 9-sep el recorrido iba por el capítulo 6 y la tira seguía
   * enseñando el 01 y el 02: quien mira el teléfono no tiene forma de saber
   * dónde está ni cuánto falta, que es justo lo que esa tira existe para
   * contar. Ahora el activo se centra cada vez que cambia.
   *
   * `block: "nearest"` es importante: sin él, centrar en horizontal arrastraría
   * también la página en vertical.
   */
  useEffect(() => {
    if (!activo) return;
    const el = raiz.current?.querySelector<HTMLElement>(".rec-cap.activo");
    if (!el) return;
    const quieta = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ inline: "center", block: "nearest", behavior: quieta ? "auto" : "smooth" });
  }, [indice, activo]);

  const arrancar = useCallback((desde: number) => {
    // La sección que contiene el cine puede no haberse revelado (botón de la
    // portada en un teléfono, o ?recorrido=auto): se revela a mano, porque un
    // ancestro con transform anula el position: fixed del cine.
    const rv = raiz.current?.closest<HTMLElement>(".rv");
    if (rv) { rv.classList.add("dentro"); rv.style.transition = "none"; rv.style.transform = "none"; rv.style.opacity = "1"; }
    setVistaAforo(false);
    setActivo(true);
    setSonando(true);
    setIndice(desde);
    segundoRef.current = 0;
    setSegundo(0);
    setSemilla((s) => s + 1);
    ev("view_plate", { plate_name: "recorrido", chapter: CAPITULOS[desde].id, mode: grabando ? "grabar" : "cine" });
  }, [grabando]);

  const alEmpezar = useCallback((desde = 0) => {
    /**
     * EL DESBLOQUEO DEL AUDIO EN EL TELÉFONO. Va lo primero, y va aquí.
     *
     * Medido el 9-sep-2026 contra el sitio publicado: en escritorio la voz
     * sonaba, y **en teléfono no arrancaba nunca**. No era el audio ni la red:
     * es la política de reproducción de los navegadores móviles, que solo
     * permiten sonar a un elemento al que se le pidió reproducir **dentro del
     * gesto de la persona**. Aquí estamos justo dentro del clic; el efecto que
     * ponía la pista corría después, ya fuera del gesto, y el teléfono lo
     * bloqueaba en silencio.
     *
     * Por eso la pista del primer capítulo se pone y se lanza aquí mismo, de
     * forma síncrona. A partir de ese momento el elemento queda «permitido» y
     * los cambios de capítulo, que ya no vienen de un gesto, funcionan solos.
     *
     * La cama musical va después y a propósito: si el navegador solo concede
     * un desbloqueo, que se lo lleve la voz, que es la que cuenta el recorrido.
     */
    if (!grabando) {
      const voz = audio.current;
      if (voz) {
        const pista = rutaAudio(lang, desde).mp3;
        if (!voz.currentSrc.endsWith(pista)) { voz.src = pista; voz.load(); }
        const p = voz.play();
        if (p && p.catch) p.catch(() => { /* el vigilante decide, no aquí */ });
      }
      const musica = cama.current;
      if (musica) {
        const p = musica.play();
        if (p && p.catch) p.catch(() => { /* la música es prescindible */ });
      }
    }
    precargarFotos();
    // La sección que contiene el cine puede no haberse revelado todavía (botón
    // de la portada en un teléfono): se revela a mano, porque un ancestro con
    // transform anula el position: fixed del cine. Refuerza a `.rv:has(.lam.cine)`.
    raiz.current?.closest(".rv")?.classList.add("dentro");
    if (grabando && desde === 0) {
      setPortada(true);
      setTimeout(() => { setPortada(false); arrancar(0); }, 3400);
      return;
    }
    arrancar(desde);
  }, [grabando, arrancar, precargarFotos, lang]);

  // La portada del sitio tiene un botón «Ver el recorrido»: manda este evento.
  useEffect(() => {
    const f = () => {
      document.getElementById("terreno")?.scrollIntoView({ block: "start" });
      alEmpezar(0);
    };
    window.addEventListener("cw-recorrido", f);
    return () => window.removeEventListener("cw-recorrido", f);
  }, [alEmpezar]);

  // Arranque automático por URL: se espera a las tipografías, porque el primer
  // cuadro del vídeo se graba con lo que haya cargado en ese instante.
  useEffect(() => {
    if (!arranque || activo) return;
    let cancelado = false;
    const listo = typeof document !== "undefined" && "fonts" in document ? document.fonts.ready : Promise.resolve();
    void listo.then(() => new Promise((r) => setTimeout(r, grabando ? 900 : 200))).then(() => {
      if (!cancelado) alEmpezar(indice);
    });
    return () => { cancelado = true; };
    // `indice` solo para leer el &cap= inicial; no debe re-arrancar al cambiar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arranque, activo, alEmpezar, grabando]);

  function alternar() {
    const el = audio.current;
    if (sonando) {
      el?.pause();
      setSonando(false);
    } else {
      setSonando(true);
      void el?.play().catch(() => setHayAudio(false));
    }
  }

  const irA = useCallback((i: number) => {
    if (i < 0 || i >= CAPITULOS.length) return;
    setIndice(i);
    setSegundo(0);
    setSonando(true);
    ev("view_plate", { plate_name: "recorrido", chapter: CAPITULOS[i].id });
  }, []);

  /** Cuando la persona toca el dibujo o sale, el recorrido se aparta. */
  const soltarElMando = useCallback(() => {
    setVistaAforo(false);
    setVerFormulario(false);
    if (!activo) return;
    // Se va antes del final: el porcentaje exacto es el dato de dónde se pierde la gente.
    if (!grabando && !progreso.current.completo) {
      ev("tour_exit", datosVideo({
        video_percent: progreso.current.porcentaje,
        video_current_time: Math.round(progreso.current.transcurrido),
      }));
    }
    audio.current?.pause();
    setSonando(false);
    setActivo(false);
    // De vuelta a la página: la sección queda a la vista, no donde estuviera el scroll.
    requestAnimationFrame(() => raiz.current?.closest("#terreno")?.scrollIntoView({ block: "start" }));
  }, [activo, grabando, datosVideo]);

  useEffect(() => {
    if (!activo || grabando) return;
    function tecla(e: KeyboardEvent) {
      const objetivo = e.target as HTMLElement | null;
      if (objetivo && /^(INPUT|SELECT|TEXTAREA)$/.test(objetivo.tagName)) return;
      if (e.key === "Escape") { e.preventDefault(); soltarElMando(); }
      else if (e.key === " ") { e.preventDefault(); alternar(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); irA(indice + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); irA(indice - 1); }
    }
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
    // `alternar` lee `sonando` del cierre; se vuelve a suscribir cuando cambia.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activo, grabando, indice, sonando, irA, soltarElMando]);

  // El foco entra al panel al arrancar, para que las teclas respondan y el
  // lector de pantalla anuncie el subtítulo.
  useEffect(() => {
    if (!activo) return;
    const b = raiz.current?.querySelector<HTMLElement>(".cine-pausa");
    b?.focus({ preventScroll: true });
  }, [activo]);

  // ── lo que se pinta ──────────────────────────────────────────────────────

  const frase = frases[fraseActual];
  const nn = (i: number) => String(i + 1).padStart(2, "0");

  const capitulos = (
    <ol className={`rec-capitulos${activo ? " cine-caps" : ""}`}>
      {CAPITULOS.map((c, i) => (
        <li key={c.id}>
          <button
            type="button"
            className={`rec-cap${activo && i === indice ? " activo" : ""}${oidos.has(i) ? " oido" : ""}`}
            aria-current={activo && i === indice ? "true" : undefined}
            onClick={() => (activo ? irA(i) : alEmpezar(i))}
          >
            <span className="rec-cap-n">{nn(i)}</span>
            <span className="rec-cap-txt">{c.pregunta[lang]}</span>
            {activo && i === indice && (
              <span className="rec-cap-avance" style={{ transform: `scaleX(${Math.min(1, segundo / dur)})` }} />
            )}
          </button>
        </li>
      ))}
    </ol>
  );

  const panel = (
    <div className={`rec${activo ? " rec-cine" : ""}${grabando ? " rec-grabando" : ""}${activo && panelFinal ? " rec-final" : ""}`} ref={raiz}>
      {/* La cama musical. `preload="none"` y sin `src` hasta que alguien la
          encienda: son casi dos megas que no tienen por qué viajar. */}
      <audio ref={cama} loop preload="none" />

      <audio
        ref={audio}
        preload="none"
        onLoadedMetadata={(e) => {
          setDuracion(e.currentTarget.duration || 0);
          if (!grabando) setHayAudio(true);
        }}
        onTimeUpdate={(e) => setSegundo(e.currentTarget.currentTime)}
        onEnded={() => {
          // Con voz, el capítulo no cambia en seco al callarse: el dibujo se
          // queda un momento para que se vea lo último que se dijo.
          if (cola.current) clearTimeout(cola.current);
          cola.current = window.setTimeout(() => { cola.current = null; siguiente(); }, (COLA_CAPITULO - 0.3) * 1000);
        }}
        onError={() => setHayAudio(false)}
      />

      {!activo ? (
        <>
          {/**
            * EL TABLERO: dos tarjetas, lado a lado. A la izquierda, el
            * recorrido con sus ocho preguntas; a la derecha, «tu evento, en el
            * dibujo». Antes todo esto iba apilado en una columna con tres
            * titulares y dos listas, y Daniel: «la página tiene desorden, no
            * se entiende». Dos cosas que hacer, dos tarjetas.
            */}
          <div className="rec-tablero">
            <div className="rec-tarjeta rec-tarjeta-recorrido">
              <div className="ojo">{t.ojo}</div>
              <h3 className="rec-titulo">{t.titulo}</h3>
              <p className="rec-intro">{t.intro}</p>
              <div className="rec-arranque">
                <button type="button" className="rec-play" onClick={() => alEmpezar(0)}>
                  <span className="rec-play-icono" aria-hidden="true" />
                  {t.reproducir}
                </button>
                {/* Cuánto dura. Es la primera pregunta de quien duda si darle,
                    y no decirlo hace que mucha gente no lo empiece. */}
                <span className="rec-duracion">
                  {CAPITULOS.length} {t.capitulos} · {minutos} {t.minutos}
                </span>
              </div>
              {/* Los capítulos: son las preguntas que la gente hace, y poder
                  saltar a la suya vale más que el orden del guion. */}
              {capitulos}
            </div>

          {/* ── tu evento, en el dibujo ──────────────────────────────────── */}
          <div className="rec-aforo rec-tarjeta">
            <div className="rec-aforo-mandos">
              <div className="ojo">{t.aforoOjo}</div>
              <label className="rec-aforo-campo">
                <span className="ojo">{t.aforoInvitados}</span>
                <input
                  type="number" inputMode="numeric" min={10} max={900} step={10}
                  value={aforo.invitados}
                  onChange={(e) => cambiarAforo({ invitados: Number(e.target.value) })}
                  onFocus={() => setVistaAforo(true)}
                />
              </label>
              <div className="rec-aforo-formato" role="group" aria-label={t.aforoInvitados}>
                {(["sentados", "pie"] as const).map((f) => (
                  <button key={f} type="button" className="rec-aforo-opcion" aria-pressed={aforo.formato === f}
                          onClick={() => cambiarAforo({ formato: f })}>
                    {t[f]}
                  </button>
                ))}
              </div>
            </div>
            <p className={`rec-aforo-veredicto${cabe ? "" : " no"}`} aria-live="polite">{veredicto}</p>
            <div className="rec-aforo-acciones">
              <button type="button" className="rec-boton" onClick={consultarConAforo}>
                {t.consultar(aforo.invitados)}
              </button>
              <a className="rec-enlace" href={RUTA_AFOROS[lang]}>{t.calcular} →</a>
            </div>
          </div>
          </div>

          {/* La transcripción completa, en la página. Es lo que un buscador y
              un modelo pueden leer y citar: ocho preguntas con su respuesta,
              exactamente las que hace un productor. Plegada para la persona,
              íntegra para la máquina. */}
          <details className="rec-transcripcion">
            <summary>{t.transcripcion}</summary>
            {CAPITULOS.map((c, i) => (
              <div key={c.id} className="rec-transcripcion-cap">
                <h3><span className="rec-cap-n">{nn(i)}</span> {c.pregunta[lang]}</h3>
                <p>{c.texto[lang]}</p>
              </div>
            ))}
          </details>
        </>
      ) : (
        <>
          {/* ── la cabecera del cine ────────────────────────────────────── */}
          <div className="cine-cab">
            <span className="cine-marca" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Simbolo tam={16} />
              Club Wynwood
            </span>
            <span className="cine-ojo">{indice + 1} / {CAPITULOS.length}</span>
            {/* El idioma se cambia SIN perder el capítulo: la otra versión abre
                sola en este mismo punto. Daniel: «que esté inglés y español». */}
            {!grabando && (
              <nav className="cine-idioma" aria-label={t.idioma}>
                {(["es", "en"] as Idioma[]).map((l) => (
                  <a key={l} href={`/${l}?recorrido=auto&cap=${indice + 1}`} aria-current={l === lang ? "true" : undefined}>
                    {l.toUpperCase()}
                  </a>
                ))}
              </nav>
            )}
            {!grabando && (
              <button type="button" className="cine-salir" onClick={soltarElMando} aria-label={t.parar}>
                {t.parar} <span aria-hidden="true">×</span>
              </button>
            )}
          </div>

          {/* La barra de historia: un segmento por capítulo. Los oídos llenos,
              el actual llenándose, los que faltan vacíos. */}
          <div className="cine-segmentos" aria-hidden="true">
            {CAPITULOS.map((c, i) => (
              <span key={c.id} className={`cine-segmento${oidos.has(i) || i < indice ? " hecho" : ""}${i === indice ? " actual" : ""}`}>
                {i === indice && <span className="cine-segmento-relleno" style={{ transform: `scaleX(${Math.min(1, segundo / dur)})` }} />}
              </span>
            ))}
          </div>

          {!((ultimo || verFormulario) && !grabando) && capitulos}

          {/* ── el subtítulo, palabra a palabra ─────────────────────────── */}
          <div className="cine-sub" aria-live="polite">
            <div className="cine-pregunta">{cap.pregunta[lang]}</div>
            {frase && (
              <p className="cine-frase" key={`${indice}-${fraseActual}`}>
                {frase.palabras.length
                  ? frase.palabras.map((p, i) => (
                      <span key={i} className={p.start <= segundo + 0.12 ? "dicha" : undefined}>{p.w} </span>
                    ))
                  : frase.texto}
              </p>
            )}
            {hayAudio === false && !grabando && <p className="rec-nota">{t.sinVoz}</p>}
          </div>

          {verTexto && !grabando && (
            <p className="rec-texto cine-texto">
              {frases.map((f, i) => (
                <span key={i} className={i === fraseActual ? "rec-dicha" : undefined}>{f.texto} </span>
              ))}
            </p>
          )}

          {/**
            * EL FORMULARIO, JUSTO AQUÍ, AL LLEGAR AL FINAL. Daniel, 4-sep-2026:
            * «que al final puedan llenar el formulario ahí mismo para que se
            * facilite mucho la conversión». Es el momento de más intención de
            * toda la página. Aparece **solo en el último capítulo**: ponerlo
            * desde el principio sería pedir el dato antes de haber contado nada.
            */}
          {(ultimo || verFormulario) && !grabando && (
            <div className="rec-cierre cine-cierre">
              {verFormulario && !ultimo && (
                <button type="button" className="cine-volver" onClick={() => setVerFormulario(false)}>
                  ‹ {t.volverCapitulos}
                </button>
              )}
              <div className="ojo">{t.ojoCierre}</div>
              <h3 className="rec-titulo">{t.tituloCierre}</h3>
              <p className="rec-intro">{t.introCierre}</p>
              {/* Con prefijo: la home monta este y el del cierre, y sin
                  distinguirlos los trece identificadores se repiten. */}
              <Formulario lang={lang} idPrefijo="rec" invitadosInicial={vistaAforo || aforo.invitados !== 300 ? aforo.invitados : undefined} />
            </div>
          )}

          {/* ── los mandos ──────────────────────────────────────────────── */}
          {!grabando && (
            <div className="cine-mandos">
              <button type="button" className="rec-boton cine-pausa" onClick={alternar} aria-label={sonando ? t.pausar : t.seguir}>
                <span className={sonando ? "rec-pausa-icono" : "rec-play-icono"} aria-hidden="true" />
                {sonando ? t.pausar : t.seguir}
              </button>
              <button type="button" className="rec-boton rec-boton-plano" onClick={() => irA(indice - 1)} disabled={indice === 0} aria-label={t.anterior}>‹</button>
              <button type="button" className="rec-boton rec-boton-plano" onClick={() => irA(indice + 1)} disabled={ultimo} aria-label={t.siguiente}>›</button>
              <button
                type="button"
                className="rec-boton rec-boton-plano"
                aria-pressed={musica}
                onClick={() => {
                  const v = !musica;
                  setMusica(v);
                  try { localStorage.setItem("cw-musica", v ? "on" : "off"); } catch { /* bloqueado */ }
                }}
              >
                <span className={`rec-punto${musica ? " on" : ""}`} aria-hidden="true" />
                {t.musica}
              </button>
              <button type="button" className="rec-boton rec-boton-plano" aria-pressed={verTexto} onClick={() => setVerTexto((v) => !v)}>
                <span className={`rec-punto${verTexto ? " on" : ""}`} aria-hidden="true" />
                {t.texto}
              </button>
              {!ultimo && !verFormulario && (
                <button type="button" className="cine-cta" onClick={() => { setVerFormulario(true); ev("form_start", { desde: "recorrido" }); }}>
                  {t.ojoCierre} →
                </button>
              )}
              <span className="cine-teclas">{t.teclas}</span>
            </div>
          )}

          {/* En el vídeo, el pie del panel lleva la dirección web todo el tiempo:
              quien lo vea en un reel sin sonido tiene que saber a dónde ir. */}
          {grabando && (
            <div className="cine-pie" aria-hidden="true">
              <span>clubwynwood.com</span>
              <span>2129 NW 1st Ct · Wynwood, Miami</span>
            </div>
          )}

          {/* La tarjeta de cierre del vídeo exportado: quién, qué y a dónde ir. */}
          {grabando && ultimo && !sonando && (
            <div className="cine-tarjeta" aria-hidden="true">
              <div className="cine-portada-marca"><Simbolo tam={48} /></div>
              <div className="cine-tarjeta-nombre">{t.tarjeta.nombre}</div>
              <div className="cine-tarjeta-linea">{t.tarjeta.linea}</div>
              <div className="cine-tarjeta-cta">{t.tarjeta.cta}</div>
              <div className="cine-tarjeta-pie">2129 NW 1st Ct, Miami FL 33127 · (305) 970-7486 · info@clubwynwood.com</div>
            </div>
          )}
        </>
      )}
    </div>
  );

  // Mientras el recorrido está activo, manda el guion. Antes de empezar, si la
  // persona está probando su aforo, manda el aforo: mesas o gente en el jardín,
  // con la cámara un poco más cerca. Si no, nadie dirige.
  const dirigido = activo
    ? { modo: estado.modo, zona: estado.zona, punto, zoom: estado.zoom, capas, vista: estado.vista }
    : vistaAforo
      ? { modo: (aforo.formato === "sentados" ? "mesas" : "gente") as Modo, zona: (aforo.formato === "sentados" ? "tiki" : "jardin") as Zona, punto: null, zoom: 1.3, capas: [] as string[], vista: "sur" as VistaRecorrido }
      : null;

  return (
    <>
      {/* La portada del vídeo: tres segundos sobre la aérea, antes de la voz. */}
      {portada && (
        <div className="cine-portada" aria-hidden="true">
          {/* La de palmeras y no la aérea: en la aérea se lee el rótulo del
              operador en el edificio del fondo, y esa es la regla que manda. */}
          {/* Por el optimizador y con la MISMA url que usa la precarga: pedir aquí
              el archivo crudo descargaba la foto dos veces —una para el cine y
              otra para esta portada— y a tamaño completo. Ver lib/imagen.ts. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={fotoOptimizada(FOTOS.palmeras.src)} alt="" style={{ objectPosition: FOTOS.palmeras.pos }} />
          <div className="cine-portada-texto">
            {/* la marca abre el vídeo: quien lo ve en un reel tiene que saber de quién es desde el primer segundo */}
            <div className="cine-portada-marca"><Simbolo tam={54} /></div>
            <div className="cine-tarjeta-nombre">{t.tarjeta.nombre}</div>
            <div className="cine-tarjeta-linea">{t.tarjeta.linea}</div>
            <div className="cine-portada-ojo">{t.ojo} · {CAPITULOS.length} {t.capitulos} · {minutos} {t.minutos}</div>
          </div>
        </div>
      )}
      <LaminaRecinto
        lang={lang}
        cine={activo}
        semillaDibujo={semilla}
        aforo={vistaAforo && !activo ? aforo : undefined}
        modoDirigido={dirigido?.modo}
        zonaDirigida={dirigido ? dirigido.zona : undefined}
        puntoDirigido={dirigido?.punto ?? null}
        zoomDirigido={dirigido?.zoom}
        capasDirigidas={dirigido?.capas}
        vistaDirigida={dirigido?.vista}
        rotuloPunto={activo && estado.zona ? NOMBRE_ZONA[estado.zona][lang] : undefined}
        cifraPunto={activo ? estado.cifra : null}
        fotoDirigida={activo ? fotoDirigida : null}
        onManual={soltarElMando}
        panel={panel}
      />
    </>
  );
}

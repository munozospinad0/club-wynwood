"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Idioma } from "@/lib/i18n";
import { bandaInvitados, ev } from "@/lib/medicion";
import LaminaRecinto, { type Aforo, type Modo, type Zona } from "@/components/LaminaRecinto";
import Formulario from "@/components/Formulario";
import {
  CAPITULOS,
  oraciones,
  rutaAudio,
  tiempoDeFrase,
  type Hito,
  type Manifiesto,
  type Palabra,
} from "@/lib/recorrido";

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

const T = {
  es: {
    ojo: "Recorrido guiado",
    titulo: "Que te lo cuenten",
    intro:
      "Ocho respuestas a las ocho preguntas que hace todo el que va a montar algo aquí, contadas sobre el dibujo. Tres minutos.",
    reproducir: "Ver el recorrido",
    pausar: "Pausar",
    seguir: "Seguir",
    parar: "Salir",
    siguiente: "Siguiente",
    anterior: "Anterior",
    capitulo: "Capítulo",
    de: "de",
    sinVoz: "Sin voz: se lee el capítulo y el dibujo se mueve igual.",
    transcripcion: "Leer el recorrido completo",
    capitulos: "capítulos",
    minutos: "min",
    musica: "Música",
    texto: "Texto",
    teclas: "Espacio pausa · flechas cambian de capítulo · Esc sale",
    ojoCierre: "Pedir disponibilidad",
    tituloCierre: "Ya conoces el sitio",
    introCierre:
      "Dinos la fecha y cuánta gente esperas, y te contestamos con disponibilidad real y condiciones. En veinticuatro horas hábiles.",
    aforoOjo: "Tu evento, en el dibujo",
    aforoInvitados: "Invitados",
    sentados: "Sentados",
    pie: "De pie",
    consultar: (n: number) => `Consultar para ${n} invitados`,
    calcular: "Calcular el montaje con detalle",
    cabe: {
      sentados: (n: number, mesas: number) => `Caben. Son ${mesas} mesas de diez en el jardín, y sobra pasillo entre mesa y mesa.`,
      pie: (n: number, pct: number) => `Caben. De pie ocupan cerca del ${pct} % del jardín, y el resto queda libre para escenario, barra y circulación.`,
      noSentados: "No caben sentados: el tope verificado es de unas trescientas personas. De pie sí, hasta seiscientas.",
      noPie: "Por encima de seiscientas personas no entra, y preferimos decírtelo antes de la visita.",
    },
    tarjeta: {
      nombre: "Club Wynwood",
      linea: "Jardín de eventos al aire libre · Wynwood, Miami",
      cta: "Pide disponibilidad en clubwynwood.com",
    },
  },
  en: {
    ojo: "Guided tour",
    titulo: "Have it explained",
    intro:
      "Eight answers to the eight questions everyone asks before staging something here, told over the drawing. Three minutes.",
    reproducir: "Watch the tour",
    pausar: "Pause",
    seguir: "Resume",
    parar: "Leave",
    siguiente: "Next",
    anterior: "Previous",
    capitulo: "Chapter",
    de: "of",
    sinVoz: "No voice: the chapter is read and the drawing moves all the same.",
    transcripcion: "Read the whole tour",
    capitulos: "chapters",
    minutos: "min",
    musica: "Music",
    texto: "Text",
    teclas: "Space pauses · arrows change chapter · Esc leaves",
    ojoCierre: "Request availability",
    tituloCierre: "Now you know the site",
    introCierre:
      "Tell us the date and how many people you expect, and we reply with real availability and terms. Within twenty-four business hours.",
    aforoOjo: "Your event, on the drawing",
    aforoInvitados: "Guests",
    sentados: "Seated",
    pie: "Standing",
    consultar: (n: number) => `Enquire for ${n} guests`,
    calcular: "Work out the layout in detail",
    cabe: {
      sentados: (n: number, mesas: number) => `They fit. That is ${mesas} tables of ten in the garden, with room to walk between them.`,
      pie: (n: number, pct: number) => `They fit. Standing, they take about ${pct}% of the garden, and the rest stays free for stage, bar and circulation.`,
      noSentados: "They do not fit seated: the verified ceiling is about three hundred. Standing, yes, up to six hundred.",
      noPie: "Above six hundred people it does not fit, and we would rather tell you before the visit.",
    },
    tarjeta: {
      nombre: "Club Wynwood",
      linea: "Open-air event garden · Wynwood, Miami",
      cta: "Request availability at clubwynwood.com",
    },
  },
} as const;

interface EstadoCapitulo {
  modo: Modo;
  zona: Zona | null;
  /** A qué parte del terreno se refiere la frase que suena ahora. */
  punto: [number, number] | null;
  zoom: number;
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
   * LA MÚSICA DE FONDO, APAGADA POR DEFECTO. Un sitio que empieza a sonar solo
   * es un sitio que se cierra: la música tiene que ser una decisión de quien
   * mira. Apagada también evita descargarla (casi dos megas). Y va a volumen
   * bajo y fijo: una cama que sube y baja llama la atención justo cuando la voz
   * está diciendo algo.
   */
  const [musica, setMusica] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("cw-musica") === "on") setMusica(true);
    } catch { /* almacenamiento bloqueado: se queda apagada */ }
  }, []);

  useEffect(() => {
    const el = cama.current;
    if (!el) return;
    if (musica && activo && sonando && !grabando) {
      if (!el.src) el.src = "/audio/recorrido/cama.mp3";
      el.volume = 0.14;
      void el.play().catch(() => { /* el navegador puede negarse; no es grave */ });
    } else {
      el.pause();
    }
  }, [musica, activo, sonando, grabando]);

  /** Para el avance sin voz: un reloj que hace de reproductor. */
  const reloj = useRef<ReturnType<typeof setInterval> | null>(null);

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
    if (typeof real === "number" && real > 0) return real + 0.45;
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
    };
    for (const h of hitos as Hito[]) {
      const cuando = tiempoDeFrase(h.frase, texto, palabras, dur);
      if (segundo + 0.15 < cuando) break;
      if (h.modo) e = { ...e, modo: h.modo as Modo };
      if (h.zona !== undefined) e = { ...e, zona: h.zona as Zona | null };
      if (h.punto !== undefined) e = { ...e, punto: (h.punto as [number, number] | null) ?? null };
      if (h.zoom !== undefined) e = { ...e, zoom: h.zoom };
    }
    return e;
  }, [cap, hitos, texto, palabras, dur, segundo]);

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

    const paso = 0.1;
    reloj.current = setInterval(() => {
      setSegundo((s) => (s + paso >= duracionEstimada ? duracionEstimada : s + paso));
    }, paso * 1000);

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
  const siguiente = useCallback(() => {
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
  useEffect(() => {
    if (!activo || !sonando || hayAudio !== true) return;
    const partida = segundo;
    const tm = setTimeout(() => {
      const el = audio.current;
      const avanzo = el ? el.currentTime > partida + 0.05 : false;
      if (!avanzo) {
        console.warn("[recorrido] el audio no avanza; se sigue con el reloj estimado");
        setHayAudio(false);
      }
    }, 3000);
    return () => clearTimeout(tm);
    // `segundo` en las dependencias a propósito: mientras avance, el vigilante
    // se reinicia y nunca salta. Solo salta si deja de avanzar.
  }, [activo, sonando, hayAudio, segundo]);

  // ── el audio ─────────────────────────────────────────────────────────────

  useEffect(() => {
    const el = audio.current;
    if (!el || !activo || hayAudio !== true) return;
    el.src = rutaAudio(lang, indice).mp3;
    el.load();
    if (sonando) void el.play().catch(() => setHayAudio(false));
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

  const alEmpezar = useCallback((desde = 0) => {
    setVistaAforo(false);
    setActivo(true);
    setSonando(true);
    setIndice(desde);
    setSegundo(0);
    setSemilla((s) => s + 1);
    ev("view_plate", { plate_name: "recorrido", chapter: CAPITULOS[desde].id, mode: grabando ? "grabar" : "cine" });
  }, [grabando]);

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
    if (!activo) return;
    audio.current?.pause();
    setSonando(false);
    setActivo(false);
    // De vuelta a la página: la sección queda a la vista, no donde estuviera el scroll.
    requestAnimationFrame(() => raiz.current?.closest("#terreno")?.scrollIntoView({ block: "start" }));
  }, [activo]);

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
    <div className={`rec${activo ? " rec-cine" : ""}${grabando ? " rec-grabando" : ""}${activo && ultimo ? " rec-final" : ""}`} ref={raiz}>
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
        onEnded={siguiente}
        onError={() => setHayAudio(false)}
      />

      {!activo ? (
        <>
          <div className="rec-inicio">
            <div>
              <div className="ojo">{t.ojo}</div>
              <h3 className="rec-titulo">{t.titulo}</h3>
              <p className="rec-intro">{t.intro}</p>
            </div>
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
          </div>

          {/* Los capítulos, siempre visibles: son las preguntas que la gente
              hace, y poder saltar a la suya vale más que el orden del guion. */}
          {capitulos}

          {/* ── tu evento, en el dibujo ──────────────────────────────────── */}
          <div className="rec-aforo">
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
            <span className="cine-marca">Club Wynwood</span>
            <span className="cine-ojo">{t.capitulo} {indice + 1} {t.de} {CAPITULOS.length}</span>
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

          {!(ultimo && !grabando) && capitulos}

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
          {ultimo && !grabando && (
            <div className="rec-cierre cine-cierre">
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
    ? { modo: estado.modo, zona: estado.zona, punto, zoom: estado.zoom }
    : vistaAforo
      ? { modo: (aforo.formato === "sentados" ? "mesas" : "gente") as Modo, zona: "jardin" as Zona, punto: null, zoom: 1.3 }
      : null;

  return (
    <LaminaRecinto
      lang={lang}
      cine={activo}
      semillaDibujo={semilla}
      aforo={vistaAforo && !activo ? aforo : undefined}
      modoDirigido={dirigido?.modo}
      zonaDirigida={dirigido ? dirigido.zona : undefined}
      puntoDirigido={dirigido?.punto ?? null}
      zoomDirigido={dirigido?.zoom}
      rotuloPunto={activo && estado.zona ? NOMBRE_ZONA[estado.zona][lang] : undefined}
      onManual={soltarElMando}
      panel={panel}
    />
  );
}

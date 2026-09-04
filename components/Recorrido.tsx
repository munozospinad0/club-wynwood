"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Idioma } from "@/lib/i18n";
import { ev } from "@/lib/medicion";
import LaminaRecinto from "@/components/LaminaRecinto";
import Formulario from "@/components/Formulario";
import {
  CAPITULOS,
  oraciones,
  rutaAudio,
  tiempoDeFrase,
  type Hito,
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
 * cambia de modo, resalta una zona y el texto se subraya solo.
 *
 * Siete capítulos, y cada uno contesta **una pregunta de productor** en el orden
 * en que las hace: qué es esto, si cabe su evento, qué pasa si llueve, por dónde
 * entra la producción, qué hay y qué no, cuánto cuesta y qué hacer ahora.
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
 * Esto no es una concesión: es lo que permite publicarlo hoy y grabar la voz
 * después, sin bloquear una cosa con la otra.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * LOS HITOS VAN ANCLADOS A PALABRAS, NO A SEGUNDOS
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Cada hito es una frase literal del guion. Cuando la voz llega a esa frase, el
 * dibujo cambia. Los tiempos salen del alineamiento palabra a palabra que
 * devuelve la locución, no de números escritos a mano.
 *
 * La diferencia importa el día que se corrija una cifra del guion: con tiempos
 * fijos, cada corrección obliga a recronometrar los siete capítulos a oído, y
 * nadie lo hace, así que la voz y el dibujo se desincronizan poco a poco hasta
 * que el recorrido parece roto. Anclado a palabras, se regenera y ya está.
 */

type Modo = "todo" | "lluvia" | "mesas" | "camion";
type Zona = "jardin" | "tiki" | "cabanas" | "acceso" | "edificio";

const T = {
  es: {
    ojo: "Recorrido guiado",
    titulo: "Que te lo cuenten",
    intro:
      "Siete respuestas a las siete preguntas que hace todo el que va a montar algo aquí. El dibujo de arriba se mueve mientras se cuentan.",
    reproducir: "Empezar el recorrido",
    pausar: "Pausar",
    seguir: "Seguir",
    parar: "Salir del recorrido",
    siguiente: "Siguiente",
    anterior: "Anterior",
    capitulo: "Capítulo",
    de: "de",
    sinVoz: "Sin voz: se lee el capítulo y el dibujo se mueve igual.",
    transcripcion: "Leer el texto completo",
    ojoCierre: "Pedir disponibilidad",
    tituloCierre: "Ya conoces el sitio",
    introCierre:
      "Dinos la fecha y cuánta gente esperas, y te contestamos con disponibilidad real y condiciones. En veinticuatro horas hábiles.",
  },
  en: {
    ojo: "Guided tour",
    titulo: "Have it explained",
    intro:
      "Seven answers to the seven questions everyone asks before staging something here. The drawing above moves as they are answered.",
    reproducir: "Start the tour",
    pausar: "Pause",
    seguir: "Resume",
    parar: "Leave the tour",
    siguiente: "Next",
    anterior: "Previous",
    capitulo: "Chapter",
    de: "of",
    sinVoz: "No voice: the chapter is read and the drawing moves all the same.",
    transcripcion: "Read the full text",
    ojoCierre: "Request availability",
    tituloCierre: "Now you know the site",
    introCierre:
      "Tell us the date and how many people you expect, and we reply with real availability and terms. Within twenty-four business hours.",
  },
} as const;

interface EstadoCapitulo {
  modo: Modo;
  zona: Zona | null;
}

export default function Recorrido({ lang }: { lang: Idioma }) {
  const t = T[lang];

  const [activo, setActivo] = useState(false);
  const [indice, setIndice] = useState(0);
  const [sonando, setSonando] = useState(false);
  const [segundo, setSegundo] = useState(0);
  const [duracion, setDuracion] = useState(0);
  const [palabras, setPalabras] = useState<Palabra[]>([]);
  const [hayAudio, setHayAudio] = useState<boolean | null>(null);

  const audio = useRef<HTMLAudioElement | null>(null);
  /** Para el avance sin voz: un reloj que hace de reproductor. */
  const reloj = useRef<ReturnType<typeof setInterval> | null>(null);

  const cap = CAPITULOS[indice];
  const texto = cap.texto[lang];
  const hitos = cap.hitos[lang] ?? [];
  const ultimo = indice === CAPITULOS.length - 1;

  /**
   * Cuánto dura un capítulo cuando no hay voz.
   *
   * Se estima por longitud del texto a un ritmo de lectura en voz alta. No es
   * exacto y no hace falta que lo sea: lo único que decide es cada cuánto se
   * mueve el dibujo. Un mínimo de ocho segundos evita que un capítulo corto
   * pase de largo antes de que a nadie le dé tiempo a mirar.
   */
  const duracionEstimada = useMemo(
    () => Math.max(8, texto.length / 14),
    [texto]
  );

  const dur = hayAudio && duracion > 0 ? duracion : duracionEstimada;

  // ── el estado del dibujo en este segundo ─────────────────────────────────

  /**
   * El modo y la zona que tocan AHORA: el del capítulo, más el del último hito
   * que ya haya pasado. Se calcula, no se guarda: así saltar a mitad del audio
   * deja el dibujo como tiene que estar, y no como estaba antes de saltar.
   */
  const estado: EstadoCapitulo = useMemo(() => {
    let e: EstadoCapitulo = { modo: cap.modo as Modo, zona: cap.zona as Zona | null };
    for (const h of hitos as Hito[]) {
      const cuando = tiempoDeFrase(h.frase, texto, palabras, dur);
      if (segundo + 0.15 < cuando) break;
      if (h.modo) e = { ...e, modo: h.modo as Modo };
      if (h.zona !== undefined) e = { ...e, zona: h.zona as Zona | null };
    }
    return e;
  }, [cap, hitos, texto, palabras, dur, segundo]);

  /** La oración que se está diciendo, para subrayarla. */
  const frases = useMemo(() => oraciones(texto, palabras, dur), [texto, palabras, dur]);
  const fraseActual = useMemo(() => {
    let i = 0;
    for (let k = 0; k < frases.length; k++) if (segundo + 0.15 >= frases[k].inicio) i = k;
    return i;
  }, [frases, segundo]);

  // ── carga del capítulo ───────────────────────────────────────────────────

  /**
   * ¿HAY VOZ GRABADA? Se pregunta UNA vez, con un manifiesto.
   *
   * La alternativa era pedir el audio y el alineamiento de cada capítulo y ver
   * cuáles fallan. Funciona, pero deja la consola llena de 404 —dos por
   * capítulo— y eso tiene un coste real: cuando de verdad se rompa algo, el
   * error que importa va a estar enterrado entre errores que son normales.
   *
   * El manifiesto lo escribe `herramientas/generar-recorrido.mjs` al terminar de
   * locutar. Si no existe, no hay voz, y no se pide ni un archivo más.
   */
  useEffect(() => {
    if (!activo || hayAudio !== null) return;
    let cancelado = false;
    fetch("/audio/recorrido/manifiesto.json")
      .then((r) => { if (!cancelado) setHayAudio(r.ok); })
      .catch(() => { if (!cancelado) setHayAudio(false); });
    return () => { cancelado = true; };
  }, [activo, hayAudio]);

  useEffect(() => {
    if (!activo || hayAudio !== true) return;
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
  }, [activo, hayAudio, indice, lang]);

  // ── el reloj de cuando no hay voz ────────────────────────────────────────

  useEffect(() => {
    if (reloj.current) { clearInterval(reloj.current); reloj.current = null; }
    // `=== false` y no `!hayAudio`: mientras vale null todavía no se sabe si hay
    // voz, y arrancar el reloj entonces adelantaría el capítulo un instante
    // antes de que el audio tome el mando. Se nota como un salto.
    if (!activo || !sonando || hayAudio !== false) return;

    const paso = 0.1;
    reloj.current = setInterval(() => {
      setSegundo((s) => {
        if (s + paso >= duracionEstimada) return duracionEstimada;
        return s + paso;
      });
    }, paso * 1000);

    return () => { if (reloj.current) clearInterval(reloj.current); };
  }, [activo, sonando, hayAudio, duracionEstimada]);

  const siguiente = useCallback(() => {
    setIndice((i) => {
      if (i + 1 >= CAPITULOS.length) { setSonando(false); return i; }
      return i + 1;
    });
  }, []);

  // Sin voz, el capítulo pasa solo al llegar al final del reloj.
  useEffect(() => {
    if (hayAudio === false && sonando && segundo >= duracionEstimada - 0.05) siguiente();
  }, [hayAudio, sonando, segundo, duracionEstimada, siguiente]);

  // ── el audio ─────────────────────────────────────────────────────────────

  useEffect(() => {
    const el = audio.current;
    // Solo se toca el audio si el manifiesto dijo que existe. Sin esto se pedía
    // un mp3 que no está y el navegador registraba un error por capítulo.
    if (!el || !activo || hayAudio !== true) return;
    el.src = rutaAudio(lang, indice).mp3;
    el.load();
    if (sonando) void el.play().catch(() => setHayAudio(false));
  }, [activo, hayAudio, indice, lang, sonando]);

  function alEmpezar() {
    setActivo(true);
    setSonando(true);
    setIndice(0);
    setSegundo(0);
    ev("view_plate", { plate_name: "recorrido", chapter: CAPITULOS[0].id });
  }

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

  function irA(i: number) {
    setIndice(i);
    setSegundo(0);
    setSonando(true);
    ev("view_plate", { plate_name: "recorrido", chapter: CAPITULOS[i].id });
  }

  /** Cuando la persona toca el dibujo, el recorrido se aparta. */
  const soltarElMando = useCallback(() => {
    if (!activo) return;
    audio.current?.pause();
    setSonando(false);
    setActivo(false);
  }, [activo]);

  return (
    <LaminaRecinto
      lang={lang}
      modoDirigido={activo ? estado.modo : undefined}
      zonaDirigida={activo ? estado.zona : undefined}
      onManual={soltarElMando}
      panel={
        <div className="rec">
          <audio
            ref={audio}
            preload="none"
            onLoadedMetadata={(e) => {
              setDuracion(e.currentTarget.duration || 0);
              setHayAudio(true);
            }}
            onTimeUpdate={(e) => setSegundo(e.currentTarget.currentTime)}
            onEnded={siguiente}
            onError={() => setHayAudio(false)}
          />

          {!activo ? (
            <div className="rec-inicio">
              <div>
                <div className="ojo">{t.ojo}</div>
                <h3 className="rec-titulo">{t.titulo}</h3>
                <p className="rec-intro">{t.intro}</p>
              </div>
              <button type="button" className="rec-play" onClick={alEmpezar}>
                <span className="rec-play-icono" aria-hidden="true" />
                {t.reproducir}
              </button>
            </div>
          ) : (
            <>
              <div className="rec-barra">
                <button type="button" className="rec-boton" onClick={alternar}
                        aria-label={sonando ? t.pausar : t.seguir}>
                  <span className={sonando ? "rec-pausa-icono" : "rec-play-icono"} aria-hidden="true" />
                  {sonando ? t.pausar : t.seguir}
                </button>

                <div className="rec-progreso" role="presentation">
                  <div className="rec-progreso-relleno" style={{ width: `${Math.min(100, (segundo / dur) * 100)}%` }} />
                </div>

                <span className="rec-cuenta">
                  {t.capitulo} {indice + 1} {t.de} {CAPITULOS.length}
                </span>

                <button type="button" className="rec-boton rec-boton-plano" onClick={soltarElMando}>
                  {t.parar}
                </button>
              </div>

              {/* El texto que se está diciendo. Es también la transcripción:
                  quien no puede o no quiere oír lee exactamente lo mismo. */}
              <p className="rec-texto" aria-live="polite">
                {frases.map((f, i) => (
                  <span key={i} className={i === fraseActual ? "rec-dicha" : undefined}>
                    {f.texto}{" "}
                  </span>
                ))}
              </p>

              {hayAudio === false && <p className="rec-nota">{t.sinVoz}</p>}

              {/**
                * EL FORMULARIO, JUSTO AQUÍ, AL LLEGAR AL FINAL.
                *
                * Daniel, 4-sep-2026: «que al final puedan llenar el formulario
                * ahí mismo para que se facilite mucho la conversión».
                *
                * Es el momento de más intención de toda la página: acaba de ver
                * el terreno, sabe si cabe su evento, sabe qué pasa si llueve y
                * sabe por dónde entra su camión. Mandarlo entonces a buscar el
                * formulario más abajo es cobrar el viaje y no abrir la puerta.
                *
                * No añade descarga: `Formulario` es un componente cliente que ya
                * viaja en el paquete de esta página. Solo añade marcado.
                *
                * Aparece **solo en el último capítulo**. Ponerlo desde el
                * principio sería pedir el dato antes de haber contado nada, que
                * es justo lo que el recorrido existe para no hacer.
                */}
              {ultimo && (
                <div className="rec-cierre">
                  <div className="ojo">{t.ojoCierre}</div>
                  <h3 className="rec-titulo">{t.tituloCierre}</h3>
                  <p className="rec-intro">{t.introCierre}</p>
                  <Formulario lang={lang} />
                </div>
              )}
            </>
          )}

          {/* Los capítulos, siempre visibles: son las preguntas que la gente
              hace, y poder saltar a la suya vale más que el orden del guion. */}
          <ol className="rec-capitulos">
            {CAPITULOS.map((c, i) => (
              <li key={c.id}>
                <button
                  type="button"
                  className={`rec-cap${activo && i === indice ? " activo" : ""}`}
                  onClick={() => { if (!activo) setActivo(true); irA(i); }}
                >
                  <span className="rec-cap-n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="rec-cap-txt">{c.pregunta[lang]}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      }
    />
  );
}

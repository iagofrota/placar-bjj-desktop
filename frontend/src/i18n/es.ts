import type { Dictionary } from "./types";

/** Portado de `lang/es/app_mesa.php` da plataforma, só as chaves do placar (`keys.ts`). */
export const es: Dictionary = {
  app: {
    language_label: "Idioma",
    languages: {
      pt_BR: "Portugués",
      en: "Inglés",
      es: "Español",
    },
  },
  side: {
    white: "Blanco",
    blue: "Azul",
  },
  name_tbd: "Por definir",
  common_actions: {
    cancel: "Cancelar",
    confirm: "Confirmar",
  },
  score_pad: {
    point2: {
      label: "+2",
      sub_label: "Derribo / raspado",
      correction_label: "−2",
    },
    point3: {
      label: "+3",
      sub_label: "Pasaje de guardia",
      correction_label: "−3",
    },
    point4: {
      label: "+4",
      sub_label: "Montada / espalda",
      correction_label: "−4",
    },
    advantage: {
      label: "ADV",
      sub_label: "Ventaja",
      correction_label: "−V",
    },
    penalty: {
      label: "PEN",
      sub_label: "Penalización",
      correction_label: "−P",
    },
    correction_aria_label: "Corregir :sub_label",
  },
  side_panel: {
    advantages_short: "VENT",
    penalties_short: "PEN",
    disqualification_warning: "4ª penalización = descalificación",
  },
  clock_bar: {
    round: "Ronda :number",
    decrement: "−10s",
    increment: "+10s",
    pause_action: "Pausar cronómetro (espacio)",
    start_action: "Iniciar cronómetro (espacio)",
    pause: "Pausar",
    start: "Iniciar",
    shortcut_hint: "Atajo: barra espaciadora",
    remaining_time_aria: "Tiempo restante: :time. Clic para :action.",
    remaining_time_pause_action: "pausar",
    remaining_time_start_action: "iniciar",
  },
  end_bout: {
    action: "Finalizar combate",
    description: "Elige el método de finalización.",
    winner_by_score_hint: "El ganador se decide por el marcador. Un empate total exige finalizar por Decisión.",
    submission_label: "Técnica",
    submission_placeholder: "Ej.: Armlock",
    failed_generic: "No se pudo finalizar. Revisa la conexión e inténtalo de nuevo.",
    methods: {
      points: "Puntos",
      submission: "Finalización",
      decision: "Decisión",
      dq: "DQ",
      wo: "W.O.",
    },
  },
  cancel_bout: {
    title: "¿Cancelar este combate?",
    avulso_description: "El marcador actual se descarta y vuelves a la pantalla de nombres. Esta acción no se puede deshacer.",
    back: "Volver",
    confirm: "Cancelar combate",
  },
  queue: {
    vs: "vs",
    start_bout: "Iniciar combate →",
  },
  avulso: {
    title: "Marcador libre",
    back_to_dashboard: "Panel",
    back_to_home: "Inicio",
    ended_prefix: "Combate finalizado · :method",
    tie_message: "Empate total: finaliza por Decisión y elige al ganador.",
    winner: "Ganador: :name",
    submission_result: "Técnica: :submission",
    new_bout: "Nuevo combate",
    setup: {
      heading: "Combate libre",
      description: "Sin torneo, sin llave — nada de esto se vuelve un combate de torneo.",
      athlete_name_placeholder: "Nombre del atleta",
      duration_label: "Duración (minutos)",
    },
  },
};

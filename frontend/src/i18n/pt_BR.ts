import type { Dictionary } from "./types";

/** Portado de `lang/pt_BR/app_mesa.php` da plataforma, só as chaves do placar (`keys.ts`). */
export const ptBR: Dictionary = {
  app: {
    language_label: "Idioma",
    languages: {
      pt_BR: "Português",
      en: "Inglês",
      es: "Espanhol",
    },
  },
  side: {
    white: "Branco",
    blue: "Azul",
  },
  name_tbd: "A definir",
  common_actions: {
    cancel: "Cancelar",
    confirm: "Confirmar",
  },
  score_pad: {
    point2: {
      label: "+2",
      sub_label: "Queda / raspagem",
      correction_label: "−2",
    },
    point3: {
      label: "+3",
      sub_label: "Passagem de guarda",
      correction_label: "−3",
    },
    point4: {
      label: "+4",
      sub_label: "Montada / costas",
      correction_label: "−4",
    },
    advantage: {
      label: "ADV",
      sub_label: "Vantagem",
      correction_label: "−V",
    },
    penalty: {
      label: "PUN",
      sub_label: "Punição",
      correction_label: "−P",
    },
    correction_aria_label: "Corrigir :sub_label",
  },
  side_panel: {
    advantages_short: "VANT",
    penalties_short: "PUN",
    disqualification_warning: "4ª punição = desclassificação",
  },
  clock_bar: {
    round: "Rodada :number",
    decrement: "−10s",
    increment: "+10s",
    pause_action: "Pausar cronômetro (espaço)",
    start_action: "Iniciar cronômetro (espaço)",
    pause: "Pausar",
    start: "Iniciar",
    shortcut_hint: "Atalho: barra de espaço",
    remaining_time_aria: "Tempo restante: :time. Clique para :action.",
    remaining_time_pause_action: "pausar",
    remaining_time_start_action: "iniciar",
  },
  end_bout: {
    action: "Encerrar luta",
    description: "Escolha o método de encerramento.",
    winner_by_score_hint: "O vencedor é definido pelo placar. Empate total exige encerrar por Decisão.",
    submission_label: "Golpe",
    submission_placeholder: "Ex.: Armlock",
    failed_generic: "Não foi possível encerrar. Confira a conexão e tente novamente.",
    methods: {
      points: "Pontos",
      submission: "Finalização",
      decision: "Decisão",
      dq: "DQ",
      wo: "W.O.",
    },
  },
  cancel_bout: {
    title: "Cancelar esta luta?",
    avulso_description: "O placar atual é descartado e você volta para a tela de nomes. Esta ação não pode ser desfeita.",
    back: "Voltar",
    confirm: "Cancelar luta",
  },
  queue: {
    vs: "vs",
    start_bout: "Iniciar luta →",
  },
  avulso: {
    title: "Placar avulso",
    back_to_dashboard: "Painel",
    back_to_home: "Início",
    ended_prefix: "Luta encerrada · :method",
    tie_message: "Empate total: encerre por Decisão e escolha o vencedor.",
    winner: "Vencedor: :name",
    submission_result: "Golpe: :submission",
    new_bout: "Nova luta",
    setup: {
      heading: "Luta casada",
      description: "Sem campeonato, sem chave — nada aqui vira luta de torneio.",
      athlete_name_placeholder: "Nome do atleta",
      duration_label: "Duração (minutos)",
    },
  },
};

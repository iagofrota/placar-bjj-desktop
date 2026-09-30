import type { Dictionary } from "./types";

/** Portado de `lang/en/app_mesa.php` da plataforma, só as chaves do placar (`keys.ts`). */
export const en: Dictionary = {
  side: {
    white: "White",
    blue: "Blue",
  },
  name_tbd: "TBD",
  common_actions: {
    cancel: "Cancel",
    confirm: "Confirm",
  },
  score_pad: {
    point2: {
      label: "+2",
      sub_label: "Takedown / sweep",
      correction_label: "−2",
    },
    point3: {
      label: "+3",
      sub_label: "Guard pass",
      correction_label: "−3",
    },
    point4: {
      label: "+4",
      sub_label: "Mount / back",
      correction_label: "−4",
    },
    advantage: {
      label: "ADV",
      sub_label: "Advantage",
      correction_label: "−A",
    },
    penalty: {
      label: "PEN",
      sub_label: "Penalty",
      correction_label: "−P",
    },
    correction_aria_label: "Correct :sub_label",
  },
  side_panel: {
    advantages_short: "ADV",
    penalties_short: "PEN",
    disqualification_warning: "4th penalty = disqualification",
  },
  clock_bar: {
    round: "Round :number",
    decrement: "−10s",
    increment: "+10s",
    pause_action: "Pause clock (space)",
    start_action: "Start clock (space)",
    pause: "Pause",
    start: "Start",
    shortcut_hint: "Shortcut: spacebar",
    remaining_time_aria: "Time left: :time. Click to :action.",
    remaining_time_pause_action: "pause",
    remaining_time_start_action: "start",
  },
  end_bout: {
    action: "End match",
    description: "Choose the ending method.",
    winner_by_score_hint: "The winner is decided by the score. A full tie must be ended by Decision.",
    submission_label: "Move",
    submission_placeholder: "E.g.: Armlock",
    failed_generic: "Could not end the match. Check your connection and try again.",
    methods: {
      points: "Points",
      submission: "Submission",
      decision: "Decision",
      dq: "DQ",
      wo: "W.O.",
    },
  },
  cancel_bout: {
    title: "Cancel this match?",
    avulso_description: "The current score is discarded and you go back to the names screen. This cannot be undone.",
    back: "Back",
    confirm: "Cancel match",
  },
  queue: {
    vs: "vs",
    start_bout: "Start match →",
  },
  avulso: {
    title: "Ad-hoc scoreboard",
    back_to_dashboard: "Dashboard",
    back_to_home: "Home",
    ended_prefix: "Match ended · :method",
    tie_message: "Full tie: end by Decision and choose the winner.",
    winner: "Winner: :name",
    submission_result: "Move: :submission",
    new_bout: "New match",
    setup: {
      heading: "Ad-hoc match",
      description: "No tournament, no bracket — nothing here becomes a tournament match.",
      athlete_name_placeholder: "Athlete's name",
      duration_label: "Duration (minutes)",
    },
  },
};

/**
 * Tipos do retrato de estado que o backend emite (espelham `src-tauri/src/view.rs`)
 * e dos argumentos dos comandos IPC. Campos em snake_case porque o serde do Rust
 * serializa os campos das structs com o próprio nome.
 */

export type SideId = "white" | "blue";
export type ScoreKindId = "point2" | "point3" | "point4" | "advantage" | "penalty";
export type DeltaId = "add" | "remove";
export type AdjustId = "plus10" | "minus10";
export type MethodId = "points" | "submission" | "decision" | "dq" | "wo";

export type StageKind = "setup" | "board" | "ended";

export type SideView = {
  name: string;
  points: number;
  advantages: number;
  penalties: number;
  penalty_alert: boolean;
};

export type BoardView = {
  white: SideView;
  blue: SideView;
  remaining_seconds: number;
  remaining_display: string;
  duration_seconds: number;
  duration_display: string;
  is_running: boolean;
  clock_urgent: boolean;
};

export type EndedView = {
  method: MethodId;
  winner: SideId | null;
  winner_name: string | null;
  white_name: string;
  blue_name: string;
  white_points: number;
  blue_points: number;
  submission: string | null;
};

export type StateView = {
  stage: StageKind;
  board: BoardView | null;
  ended: EndedView | null;
};

/** Tag de erro do encerramento, devolvida pelo comando `end_bout`. */
export type EndErrorTag = "tie" | "empty_submission";

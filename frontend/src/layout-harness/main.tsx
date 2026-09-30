/**
 * Página só de teste de LAYOUT (P8), servida pelo Vite dev e medida pelo
 * Playwright no Chromium — o mesmo motor do WebView2, alvo de produção no
 * Windows, onde a emulação de viewport/escala reflui de verdade (o que o
 * WebKitGTK não faz, e a janela do app tem tamanho mínimo). Renderiza o Board
 * REAL com um estado estático; nenhuma regra, nenhum IPC. Fora do bundle do app.
 */
import ReactDOM from "react-dom/client";
import "../index.css";
import { LocaleProvider, useLocale } from "../i18n/LocaleContext";
import type { BoardView } from "../ipc/types";
import { Board, type BoardActions } from "../scoreboard/Board";
import { Header } from "../scoreboard/Header";

const SAMPLE_BOARD: BoardView = {
  white: { name: "Ana Souza", points: 6, advantages: 1, penalties: 0, penalty_alert: false },
  blue: { name: "Bia Rocha", points: 2, advantages: 2, penalties: 1, penalty_alert: false },
  remaining_seconds: 225,
  remaining_display: "03:45",
  duration_seconds: 300,
  duration_display: "05:00",
  is_running: true,
  clock_urgent: false,
};

const noop = () => {};
const actions: BoardActions = {
  mark: noop,
  toggleClock: noop,
  adjustClock: noop,
  cancel: noop,
  endBout: async () => null,
};

function Harness() {
  const { t } = useLocale();
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-paper text-ink">
      <Header t={t} />
      <div className="flex min-h-0 flex-1 flex-col">
        <Board board={SAMPLE_BOARD} actions={actions} t={t} />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <LocaleProvider>
    <Harness />
  </LocaleProvider>,
);

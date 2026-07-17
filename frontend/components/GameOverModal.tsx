interface GameOverModalProps {
  score: number;
  agentLabel: string;
  onRetry: () => void;
  onSwitchAgent: () => void;
}

export function GameOverModal({ score, agentLabel, onRetry, onSwitchAgent }: GameOverModalProps) {
  return (
    <div className="fixed inset-0 bg-[#2d2418]/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#faf3e3] border-4 border-[#8b5a3c] rounded-xl px-8 py-8 flex flex-col items-center gap-6 shadow-[0_8px_0_rgba(139,90,60,0.3)] max-w-sm w-full">
        <span className="text-red-700 text-xl tracking-wider">
          GAME OVER
        </span>

        <div className="flex flex-col items-center gap-1">
          <span className="text-[#8b6f47] text-[10px] tracking-widest">
            {agentLabel.toUpperCase()}
          </span>
          <span className="text-[#004114] text-lg tracking-widest">
            SCORE: {String(score).padStart(4, "0")}
          </span>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={onRetry}
            className="bg-[#004114] hover:bg-[#002c0e] text-[#faf3e3] px-6 py-3 rounded-md border-b-4 border-[#002c0e] hover:border-[#004114] hover:translate-y-1 transition-all text-xs tracking-wider"
          >
            REINICIAR
          </button>

          <button
            onClick={onSwitchAgent}
            className="bg-transparent border-2 border-red-700 text-red-700 px-6 py-3 rounded-md hover:bg-red-700/10 transition-all text-xs tracking-wider"
          >
            TROCAR IA
          </button>
        </div>
      </div>
    </div>
  );
}
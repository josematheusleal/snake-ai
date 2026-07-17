import { AgentType } from "@/types/game";
import { TiledBackground } from "@/components/TiledBackground";

interface AgentSelectorProps {
  onSelect: (agent: AgentType) => void;
}

export const AGENTS: { id: AgentType; label: string }[] = [
  {
    id: "heuristic",
    label: "Busca Heurística",
  },
  {
    id: "qlearning",
    label: "Aprendizado por Reforço",
  },
  {
    id: "genetic",
    label: "Algoritmo Genético",
  },
];

export function AgentSelector({ onSelect }: AgentSelectorProps) {
  return (
    <div className="relative flex items-center justify-center min-h-[70vh] w-full">
    {/* fundo de tiles */}
      <TiledBackground />

      {/* quadro de seleçao*/}
      <div className="relative bg-[#faf3e3] border-4 border-[#8b5a3c] rounded-xl px-8 py-8 flex flex-col items-center gap-6 shadow-[0_8px_0_rgba(139,90,60,0.3)] max-w-sm w-full mx-4">
        <h1 className="text-[#004114] text-lg tracking-wider text-center">
          SELECIONE A IA
        </h1>

        <div className="flex flex-col gap-4 w-full">
          {AGENTS.map((agent) => (
            <button
              key={agent.id}
              onClick={() => onSelect(agent.id)}
              className="bg-[#f3e8cf] hover:bg-[#f3e591] border-2 border-[#8b5a3c] rounded-lg px-5 py-4 text-left transition-colors"
            >
              <div className="text-[#004114] text-sm">{agent.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
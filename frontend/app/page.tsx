"use client";

import { useState } from "react";
import { AgentType } from "@/types/game";
import { AgentSelector, AGENTS } from "@/components/AgentSelector";
import { Board } from "@/components/Board";
import { ScoreCard } from "@/components/ScoreCard";
import { GameOverModal } from "@/components/GameOverModal";
import { useGameWebSocket } from "@/hooks/useGameWebSocket";

export default function Home() {
  const [agent, setAgent] = useState<AgentType | null>(null);
  const { state, connected, reset } = useGameWebSocket(agent);

  if (!agent) {
    return (
      <main className="min-h-screen p-6 flex flex-col items-center justify-center overflow-hidden">
        <AgentSelector onSelect={setAgent} />
      </main>
    );
  }

  const agentLabel = AGENTS.find((a) => a.id === agent)?.label ?? agent;

  return (
    <main className="min-h-screen bg-[#e8dcc4] p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-[75vh] flex flex-col gap-4">
        {!connected && (
          <div className="text-amber-600 text-xs text-center animate-pulse">
            conectando...
          </div>
        )}

        <ScoreCard score={state.score} agentLabel={agentLabel} />
        <Board state={state} />
      </div>

      {state.gameOver && (
        <GameOverModal
          score={state.score}
          agentLabel={agentLabel}
          onRetry={reset}
          onSwitchAgent={() => setAgent(null)}
        />
      )}
    </main>
  );
}
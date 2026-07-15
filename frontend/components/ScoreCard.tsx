interface ScoreCardProps {
  score: number;
  agentLabel: string;
}

export function ScoreCard({ score, agentLabel }: ScoreCardProps) {
  const paddedScore = score.toString().padStart(4, "0");

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[#faf3e3] border-2 border-[#8b5a3c] rounded-lg">
      <span className="text-[#004114] text-xs tracking-widest">
        SCORE:{paddedScore}
      </span>
      <span className="text-[#8b6f47] text-[10px] tracking-widest uppercase">
        {agentLabel}
      </span>
    </div>
  );
}
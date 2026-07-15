import { GameState, GRID_SIZE, Position } from "@/types/game";

interface BoardProps {
  state: GameState;
}

type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";

function directionBetween(from: Position, to: Position): Dir | null {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (dx === 1 && dy === 0) return "RIGHT";
  if (dx === -1 && dy === 0) return "LEFT";
  if (dx === 0 && dy === 1) return "DOWN";
  if (dx === 0 && dy === -1) return "UP";
  return null;
}

{/* mapeia rotações */}

const ROTATION_BY_DIRECTION: Record<Dir, number> = {
  DOWN: 0,
  LEFT: 90,
  UP: 180,
  RIGHT: 270,
};

const CURVE_ROTATION_KEY: Record<string, number> = {
  "DOWN-LEFT": 0,
  "LEFT-UP": 1,
  "UP-RIGHT": 2,
  "RIGHT-DOWN": 3,
};

const CURVE_MIRRORED_KEY: Record<string, number> = {
  "DOWN-RIGHT": 0,
  "LEFT-DOWN": 1,
  "UP-LEFT": 2,
  "RIGHT-UP": 3,
};

{/* ajuste de sprites*/}

interface SegmentSprite {
  src: string;
  rotation: number;
  mirror: boolean;
}

function getSegmentSprite(snake: Position[], index: number): SegmentSprite {
  const isHead = index === 0;
  const isTail = index === snake.length - 1;

  if (isHead) {
    const facing =
      snake.length > 1 ? directionBetween(snake[1], snake[0]) : null;
    return {
      src: "/sprites/head.png",
      rotation: ROTATION_BY_DIRECTION[facing ?? "RIGHT"],
      mirror: false,
    };
  }

  if (isTail) {
    let facing: Dir | null = "DOWN";
    
    if (snake.length > 1) {
      facing = directionBetween(snake[index], snake[index - 1]);
    }
    
    return {
      src: "/sprites/tail.png",
      rotation: ROTATION_BY_DIRECTION[facing ?? "DOWN"],
      mirror: false,
    };
  }

  const toHeadSide = directionBetween(snake[index], snake[index - 1]);
  const toTailSide = directionBetween(snake[index], snake[index + 1]);

  if (!toHeadSide || !toTailSide) {
    return { src: "/sprites/body-straight.png", rotation: 0, mirror: false };
  }

  const key = `${toHeadSide}-${toTailSide}`;

  if (key in CURVE_ROTATION_KEY) {
    return {
      src: "/sprites/body-curve.png",
      rotation: CURVE_ROTATION_KEY[key] * 90,
      mirror: false,
    };
  }

  if (key in CURVE_MIRRORED_KEY) {
    return {
      src: "/sprites/body-curve.png",
      rotation: CURVE_MIRRORED_KEY[key] * 90,
      mirror: true,
    };
  }

  const isVertical = toHeadSide === "UP" || toHeadSide === "DOWN";
  return {
    src: "/sprites/body-straight.png",
    rotation: isVertical ? 0 : 90,
    mirror: false,
  };
}

{/* tabuleiro */}
export function Board({ state }: BoardProps) {
  const cellSize = 100 / GRID_SIZE;

  return (
    <div className="relative rounded-lg overflow-hidden aspect-square w-full max-w-[650px] mx-auto border-4 border-red-700">
      
      {/* tiles */}
      <div
        className="grid absolute inset-0"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const row = Math.floor(i / GRID_SIZE);
          const col = i % GRID_SIZE;
          
          let tileSrc = "";

          if ((row + col) % 2 === 0) {
            tileSrc = "/tiles/tile1.png";
          } else {
            tileSrc = "/tiles/tile2.png";
          }

          return (
            <img
              key={`tile-${i}`}
              src={tileSrc}
              alt="Tile do chão"
              className="w-full h-full object-cover [image-rendering:pixelated]"
            />
          );
        })}
      </div>

      {/* maçã */}
      <img
        src="/sprites/apple.png"
        alt="Maçã"
        className="absolute [image-rendering:pixelated] z-10"
        style={{
          left: `${state.apple.x * cellSize}%`,
          top: `${state.apple.y * cellSize}%`,
          width: `${cellSize}%`,
          height: `${cellSize}%`,
        }}
      />

      {/* cobra */}
      {state.snake.map((segment, index) => {
        const sprite = getSegmentSprite(state.snake, index);
        return (
          <img
            key={`${index}-${segment.x}-${segment.y}`}
            src={sprite.src}
            alt="Segmento da cobra"
            className="absolute [image-rendering:pixelated] z-10"
            style={{
              left: `${segment.x * cellSize}%`,
              top: `${segment.y * cellSize}%`,
              // A mágica acontece aqui: somamos 1.5 pixels a mais do que o tamanho da célula
              // Isso força uma sobreposição perfeita entre as peças, matando a fresta.
              width: `calc(${cellSize}% + 1.5px)`,
              height: `calc(${cellSize}% + 1.5px)`,
              transform: `rotate(${sprite.rotation}deg)${
                sprite.mirror ? " scaleX(-1)" : ""
              }`,
            }}
          />
        );
      })}
    </div>
  );
}
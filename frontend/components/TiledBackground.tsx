export function TiledBackground() {
  const COLS = 34;
  const ROWS = 24;

  return (
    <div
      className="fixed inset-0 -z-10 grid"
      style={{
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
      }}
    >
      {Array.from({ length: COLS * ROWS }).map((_, i) => {
        const row = Math.floor(i / COLS);
        const col = i % COLS;
        const tileSrc = (row + col) % 2 === 0 ? "/tiles/tile1.png" : "/tiles/tile2.png";

        return (
          <img
            key={i}
            src={tileSrc}
            alt=""
            className="w-full h-full object-cover [image-rendering:pixelated]"
          />
        );
      })}
    </div>
  );
}
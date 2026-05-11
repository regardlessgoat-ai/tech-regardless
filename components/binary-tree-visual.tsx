type Node = {
  x: number;
  y: number;
  value: "0" | "1";
  highlight?: boolean;
};

const W = 400;
const H = 400;

const levels: Node[][] = [
  [{ x: 200, y: 48, value: "1", highlight: true }],
  [
    { x: 110, y: 140, value: "0" },
    { x: 290, y: 140, value: "1", highlight: true },
  ],
  [
    { x: 60, y: 232, value: "1" },
    { x: 160, y: 232, value: "0" },
    { x: 240, y: 232, value: "1" },
    { x: 340, y: 232, value: "0", highlight: true },
  ],
  [
    { x: 30, y: 324, value: "0" },
    { x: 90, y: 324, value: "1" },
    { x: 140, y: 324, value: "1" },
    { x: 190, y: 324, value: "0" },
    { x: 220, y: 324, value: "0" },
    { x: 270, y: 324, value: "1" },
    { x: 320, y: 324, value: "1" },
    { x: 370, y: 324, value: "0", highlight: true },
  ],
];

type Edge = { x1: number; y1: number; x2: number; y2: number; highlight: boolean };

const edges: Edge[] = (() => {
  const out: Edge[] = [];
  for (let i = 0; i < levels.length - 1; i++) {
    for (let j = 0; j < levels[i].length; j++) {
      const parent = levels[i][j];
      const left = levels[i + 1][j * 2];
      const right = levels[i + 1][j * 2 + 1];
      if (left) {
        out.push({
          x1: parent.x,
          y1: parent.y,
          x2: left.x,
          y2: left.y,
          highlight: Boolean(parent.highlight && left.highlight),
        });
      }
      if (right) {
        out.push({
          x1: parent.x,
          y1: parent.y,
          x2: right.x,
          y2: right.y,
          highlight: Boolean(parent.highlight && right.highlight),
        });
      }
    }
  }
  return out;
})();

export function BinaryTreeVisual() {
  return (
    <div className="group relative aspect-square w-full max-w-md overflow-hidden rounded border border-border bg-card">
      <div
        aria-hidden
        className="absolute inset-0 [background-image:linear-gradient(to_right,hsl(var(--border)/0.25)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.25)_1px,transparent_1px)] [background-size:32px_32px]"
      />
      <div
        aria-hidden
        className="absolute inset-0 [background:radial-gradient(ellipse_at_top,hsl(var(--accent)/0.08),transparent_55%)]"
      />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="relative size-full"
        role="img"
        aria-label="Binary tree visualization"
      >
        <g fill="none" strokeLinecap="round">
          {edges.map((e, i) => (
            <line
              key={i}
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              stroke={e.highlight ? "hsl(var(--accent))" : "hsl(var(--border))"}
              strokeWidth={e.highlight ? 1.75 : 1}
              opacity={e.highlight ? 0.9 : 0.55}
            />
          ))}
        </g>

        {levels.flat().map((n, i) => (
          <g key={i}>
            {n.highlight && (
              <circle
                cx={n.x}
                cy={n.y}
                r={18}
                fill="hsl(var(--accent))"
                opacity={0.18}
              />
            )}
            <circle
              cx={n.x}
              cy={n.y}
              r={13}
              fill={n.highlight ? "hsl(var(--accent))" : "hsl(var(--background))"}
              stroke={n.highlight ? "hsl(var(--accent))" : "hsl(var(--border))"}
              strokeWidth={1.5}
            />
            <text
              x={n.x}
              y={n.y + 4}
              textAnchor="middle"
              fontSize={11}
              fontFamily="var(--font-geist-mono), ui-monospace, monospace"
              fontWeight={500}
              fill={
                n.highlight
                  ? "hsl(var(--accent-foreground))"
                  : "hsl(var(--muted-foreground))"
              }
            >
              {n.value}
            </text>
          </g>
        ))}
      </svg>

      <div className="absolute inset-x-4 bottom-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <span>tree.traverse(root)</span>
        <span className="flex items-center gap-1.5 text-accent">
          <span className="size-1.5 rounded-full bg-accent" aria-hidden />
          path: 1 &middot; 1 &middot; 0
        </span>
      </div>
    </div>
  );
}

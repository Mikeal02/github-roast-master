import { useMemo } from 'react';
import { Radar } from 'lucide-react';

interface RadarChartProps {
  scores: {
    activity?: { score: number };
    documentation?: { score: number };
    popularity?: { score: number };
    diversity?: { score: number };
    overall?: { score: number };
  };
  personality?: {
    metrics?: {
      consistency: number;
      exploration: number;
      collaboration: number;
      documentation: number;
    };
  };
}

export function RadarChart({ scores, personality }: RadarChartProps) {
  const metrics = useMemo(() => {
    return [
      { label: 'Activity', value: scores?.activity?.score || 0 },
      { label: 'Documentation', value: scores?.documentation?.score || 0 },
      { label: 'Popularity', value: scores?.popularity?.score || 0 },
      { label: 'Diversity', value: scores?.diversity?.score || 0 },
      { label: 'Consistency', value: personality?.metrics?.consistency || 0 },
      { label: 'Collaboration', value: personality?.metrics?.collaboration || 0 },
    ];
  }, [scores, personality]);

  const cx = 150, cy = 150, maxR = 110;
  const n = metrics.length;

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    const r = (value / 100) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const polygonPoints = metrics.map((m, i) => {
    const p = getPoint(i, m.value);
    return `${p.x},${p.y}`;
  }).join(' ');

  const gridLevels = [20, 40, 60, 80, 100];

  return (
    <div className="score-card">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <Radar className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Skill Radar</h3>
      </div>
      
      <div className="flex justify-center">
        <svg width="300" height="300" viewBox="0 0 300 300">
          {/* Grid levels */}
          {gridLevels.map(level => {
            const pts = Array.from({ length: n }, (_, i) => {
              const p = getPoint(i, level);
              return `${p.x},${p.y}`;
            }).join(' ');
            return (
              <polygon
                key={level}
                points={pts}
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="0.5"
                opacity={0.5}
              />
            );
          })}

          {/* Axis lines */}
          {metrics.map((_, i) => {
            const p = getPoint(i, 100);
            return (
              <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y}
                stroke="hsl(var(--border))" strokeWidth="0.5" opacity={0.3} />
            );
          })}

          {/* Data polygon */}
          <polygon
            points={polygonPoints}
            fill="hsl(var(--primary) / 0.15)"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
          />

          {/* Data points */}
          {metrics.map((m, i) => {
            const p = getPoint(i, m.value);
            return <circle key={i} cx={p.x} cy={p.y} r="4" fill="hsl(var(--primary))" />;
          })}

          {/* Labels */}
          {metrics.map((m, i) => {
            const p = getPoint(i, 120);
            return (
              <text
                key={i}
                x={p.x}
                y={p.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="hsl(var(--muted-foreground))"
                fontSize="10"
                fontFamily="'Inter', sans-serif"
              >
                {m.label}
              </text>
            );
          })}

          {/* Value labels */}
          {metrics.map((m, i) => {
            const p = getPoint(i, m.value);
            return (
              <text
                key={`val-${i}`}
                x={p.x}
                y={p.y - 10}
                textAnchor="middle"
                fill="hsl(var(--primary))"
                fontSize="9"
                fontWeight="bold"
                fontFamily="'JetBrains Mono', monospace"
              >
                {m.value}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

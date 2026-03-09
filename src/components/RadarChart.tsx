import { useRef, useMemo, useState } from 'react';
import { Radar, Eye, EyeOff } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

interface RadarChartProps {
  scores: {
    activity?: { score: number };
    documentation?: { score: number };
    popularity?: { score: number };
    diversity?: { score: number };
    overall?: { score: number };
    codeQuality?: { score: number };
    collaboration?: { score: number };
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

const benchmarks: Record<string, number> = {
  Activity: 45, Docs: 40, Popularity: 30, Diversity: 50,
  Quality: 55, Collab: 35, Consistency: 50, Exploration: 45,
};

const axisEmojis: Record<string, string> = {
  Activity: '⚡', Docs: '📝', Popularity: '⭐', Diversity: '🌈',
  Quality: '🛡️', Collab: '🤝', Consistency: '🎯', Exploration: '🔬',
};

export function RadarChart({ scores, personality }: RadarChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [hoveredAxis, setHoveredAxis] = useState<number | null>(null);
  const [showBenchmark, setShowBenchmark] = useState(true);

  const metrics = useMemo(() => [
    { label: 'Activity', value: scores?.activity?.score || 0 },
    { label: 'Docs', value: scores?.documentation?.score || 0 },
    { label: 'Popularity', value: scores?.popularity?.score || 0 },
    { label: 'Diversity', value: scores?.diversity?.score || 0 },
    { label: 'Quality', value: scores?.codeQuality?.score || 0 },
    { label: 'Collab', value: scores?.collaboration?.score || 0 },
    { label: 'Consistency', value: personality?.metrics?.consistency || 0 },
    { label: 'Exploration', value: personality?.metrics?.exploration || 0 },
  ], [scores, personality]);

  const cx = 170, cy = 170, maxR = 130;
  const n = metrics.length;

  const avgScore = Math.round(metrics.reduce((s, m) => s + m.value, 0) / n);

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    const r = (value / 100) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const polygonPoints = metrics.map((m, i) => {
    const p = getPoint(i, m.value);
    return `${p.x},${p.y}`;
  }).join(' ');

  const benchmarkPoints = metrics.map((m, i) => {
    const p = getPoint(i, benchmarks[m.label] || 50);
    return `${p.x},${p.y}`;
  }).join(' ');

  const gridLevels = [20, 40, 60, 80, 100];

  const maxMetric = Math.max(...metrics.map(m => m.value));
  const minMetric = Math.min(...metrics.map(m => m.value));
  const balance = maxMetric > 0 ? Math.round((minMetric / maxMetric) * 100) : 0;
  const shapeLabel = balance > 70 ? 'Well-Rounded' : balance > 40 ? 'Specialized' : 'Highly Focused';

  const getRanking = (value: number, benchmark: number) => {
    const diff = value - benchmark;
    if (diff > 20) return { label: 'Exceptional', color: 'text-terminal-green', fill: 'hsl(var(--terminal-green))' };
    if (diff > 5) return { label: 'Above Avg', color: 'text-terminal-cyan', fill: 'hsl(var(--terminal-cyan))' };
    if (diff > -5) return { label: 'Average', color: 'text-terminal-yellow', fill: 'hsl(var(--terminal-yellow))' };
    return { label: 'Below Avg', color: 'text-terminal-red', fill: 'hsl(var(--terminal-red))' };
  };

  // Count how many axes beat the benchmark
  const axesAboveBenchmark = metrics.filter(m => m.value > (benchmarks[m.label] || 50)).length;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="glass-panel p-5"
    >
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <Radar className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Skill Radar</h3>
        <span className="text-[10px] text-muted-foreground font-mono ml-1">{axesAboveBenchmark}/{n} above avg</span>
        <button
          onClick={() => setShowBenchmark(!showBenchmark)}
          className={`ml-auto flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
            showBenchmark ? 'bg-accent/10 border-accent/30 text-accent' : 'border-border text-muted-foreground'
          }`}
        >
          {showBenchmark ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          Benchmark
        </button>
      </div>

      <div className="flex justify-center">
        <svg width="340" height="340" viewBox="0 0 340 340">
          {/* Grid levels */}
          {gridLevels.map(level => {
            const pts = Array.from({ length: n }, (_, i) => {
              const p = getPoint(i, level);
              return `${p.x},${p.y}`;
            }).join(' ');
            return (
              <g key={level}>
                <polygon points={pts} fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity={0.5} />
                <text x={cx + 4} y={cy - (level / 100) * maxR + 3} fontSize="7" fill="hsl(var(--muted-foreground))" opacity={0.4}>{level}</text>
              </g>
            );
          })}

          {/* Axis lines */}
          {metrics.map((_, i) => {
            const p = getPoint(i, 100);
            return (
              <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y}
                stroke={hoveredAxis === i ? 'hsl(var(--primary))' : 'hsl(var(--border))'} strokeWidth={hoveredAxis === i ? 1.5 : 0.5} opacity={hoveredAxis === i ? 0.8 : 0.3} />
            );
          })}

          <defs>
            <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
            <radialGradient id="radarRadial" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.02" />
            </radialGradient>
          </defs>

          {/* Benchmark polygon */}
          {showBenchmark && (
            <motion.polygon
              points={isInView ? benchmarkPoints : metrics.map(() => `${cx},${cy}`).join(' ')}
              fill="hsl(var(--terminal-yellow) / 0.05)"
              stroke="hsl(var(--terminal-yellow) / 0.4)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
            />
          )}

          {/* User data polygon with radial fill */}
          <motion.polygon
            points={isInView ? polygonPoints : metrics.map(() => `${cx},${cy}`).join(' ')}
            fill="url(#radarRadial)"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
          />
          <motion.polygon
            points={isInView ? polygonPoints : metrics.map(() => `${cx},${cy}`).join(' ')}
            fill="url(#radarGradient)"
            stroke="none"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.1 } : {}}
            transition={{ duration: 1.2, delay: 0.4 }}
          />

          {/* Data points */}
          {metrics.map((m, i) => {
            const p = getPoint(i, m.value);
            const hoverZone = getPoint(i, 60);
            const ranking = getRanking(m.value, benchmarks[m.label] || 50);
            return (
              <g key={i}
                onMouseEnter={() => setHoveredAxis(i)}
                onMouseLeave={() => setHoveredAxis(null)}
              >
                <circle cx={hoverZone.x} cy={hoverZone.y} r="22" fill="transparent" />
                
                {/* Point glow on hover */}
                {hoveredAxis === i && (
                  <circle cx={p.x} cy={p.y} r="14" fill={`${ranking.fill}15`} />
                )}
                
                <motion.circle
                  cx={isInView ? p.x : cx} cy={isInView ? p.y : cy}
                  r={hoveredAxis === i ? 7 : 5}
                  fill={hoveredAxis === i ? ranking.fill : 'hsl(var(--primary))'}
                  stroke="hsl(var(--background))" strokeWidth="2"
                  initial={{ opacity: 0, scale: 0 }} animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.5 + i * 0.08, type: 'spring', stiffness: 200 }}
                  style={{ transition: 'r 0.15s ease' }}
                />
              </g>
            );
          })}

          {/* Labels with emoji */}
          {metrics.map((m, i) => {
            const p = getPoint(i, 148);
            return (
              <g key={`label-${i}`}>
                <text x={p.x} y={p.y - 8} textAnchor="middle" dominantBaseline="middle"
                  fontSize="11" opacity={0.7}>
                  {axisEmojis[m.label] || ''}
                </text>
                <text x={p.x} y={p.y + 4} textAnchor="middle" dominantBaseline="middle"
                  fill={hoveredAxis === i ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
                  fontSize="9" fontFamily="'Space Grotesk', sans-serif" fontWeight="600">
                  {m.label}
                </text>
                <text x={p.x} y={p.y + 16} textAnchor="middle" dominantBaseline="middle"
                  fill="hsl(var(--primary))" fontSize="10" fontWeight="bold" fontFamily="'JetBrains Mono', monospace">
                  {m.value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hovered axis detail */}
      {hoveredAxis !== null && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-xs mb-2 p-2 bg-muted/30 rounded-lg"
        >
          <span className="text-foreground font-semibold">{metrics[hoveredAxis].label}</span>
          <span className="text-muted-foreground mx-2">Score: {metrics[hoveredAxis].value} vs Benchmark: {benchmarks[metrics[hoveredAxis].label] || 50}</span>
          <span className={getRanking(metrics[hoveredAxis].value, benchmarks[metrics[hoveredAxis].label] || 50).color + ' font-bold ml-1'}>
            {metrics[hoveredAxis].value - (benchmarks[metrics[hoveredAxis].label] || 50) > 0 ? '+' : ''}
            {metrics[hoveredAxis].value - (benchmarks[metrics[hoveredAxis].label] || 50)}
            {' • '}
            {getRanking(metrics[hoveredAxis].value, benchmarks[metrics[hoveredAxis].label] || 50).label}
          </span>
        </motion.div>
      )}

      {/* Shape analysis */}
      <div className="flex items-center justify-between mt-2 pt-3 border-t border-border/50">
        <div>
          <p className="text-xs font-semibold text-foreground">{shapeLabel}</p>
          <p className="text-[10px] text-muted-foreground">Balance: {balance}% • Range: {minMetric}–{maxMetric}</p>
        </div>
        {showBenchmark && (
          <div className="flex items-center gap-3 text-[9px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-primary inline-block rounded" /> You</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-terminal-yellow/50 inline-block rounded" style={{borderTop: '1px dashed'}} /> Avg</span>
          </div>
        )}
        <div className="text-right">
          <p className="text-lg font-bold font-mono text-primary">{avgScore}</p>
          <p className="text-[10px] text-muted-foreground">Avg Score</p>
        </div>
      </div>
    </motion.div>
  );
}

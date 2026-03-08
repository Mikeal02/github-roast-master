import { useRef, useMemo } from 'react';
import { Radar } from 'lucide-react';
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

export function RadarChart({ scores, personality }: RadarChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const metrics = useMemo(() => {
    return [
      { label: 'Activity', value: scores?.activity?.score || 0 },
      { label: 'Docs', value: scores?.documentation?.score || 0 },
      { label: 'Popularity', value: scores?.popularity?.score || 0 },
      { label: 'Diversity', value: scores?.diversity?.score || 0 },
      { label: 'Quality', value: scores?.codeQuality?.score || 0 },
      { label: 'Collab', value: scores?.collaboration?.score || 0 },
      { label: 'Consistency', value: personality?.metrics?.consistency || 0 },
      { label: 'Exploration', value: personality?.metrics?.exploration || 0 },
    ];
  }, [scores, personality]);

  const cx = 150, cy = 150, maxR = 110;
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

  const gridLevels = [20, 40, 60, 80, 100];

  // Calculate "shape" - how balanced vs spiky
  const maxMetric = Math.max(...metrics.map(m => m.value));
  const minMetric = Math.min(...metrics.map(m => m.value));
  const balance = maxMetric > 0 ? Math.round((minMetric / maxMetric) * 100) : 0;
  const shapeLabel = balance > 70 ? 'Well-Rounded' : balance > 40 ? 'Specialized' : 'Highly Focused';

  return (
    <div ref={ref} className="score-card">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <Radar className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Skill Radar</h3>
        <span className="ml-auto text-xs text-muted-foreground font-mono">{avgScore} avg</span>
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

          {/* Animated data polygon */}
          <motion.polygon
            points={isInView ? polygonPoints : metrics.map(() => `${cx},${cy}`).join(' ')}
            fill="hsl(var(--primary) / 0.12)"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
          />

          {/* Accent fill overlay */}
          <motion.polygon
            points={isInView ? polygonPoints : metrics.map(() => `${cx},${cy}`).join(' ')}
            fill="url(#radarGradient)"
            stroke="none"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.2 } : {}}
            transition={{ duration: 1.2, delay: 0.4 }}
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>

          {/* Data points */}
          {metrics.map((m, i) => {
            const p = getPoint(i, m.value);
            return (
              <motion.circle
                key={i}
                cx={isInView ? p.x : cx}
                cy={isInView ? p.y : cy}
                r="5"
                fill="hsl(var(--primary))"
                stroke="hsl(var(--background))"
                strokeWidth="2"
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.08, type: 'spring', stiffness: 200 }}
              />
            );
          })}

          {/* Labels */}
          {metrics.map((m, i) => {
            const p = getPoint(i, 130);
            return (
              <text
                key={i}
                x={p.x}
                y={p.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="hsl(var(--muted-foreground))"
                fontSize="9"
                fontFamily="'Space Grotesk', sans-serif"
                fontWeight="500"
              >
                {m.label}
              </text>
            );
          })}

          {/* Value labels */}
          {metrics.map((m, i) => {
            const p = getPoint(i, m.value);
            return (
              <motion.text
                key={`val-${i}`}
                x={isInView ? p.x : cx}
                y={isInView ? p.y - 12 : cy}
                textAnchor="middle"
                fill="hsl(var(--primary))"
                fontSize="9"
                fontWeight="bold"
                fontFamily="'JetBrains Mono', monospace"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.8 + i * 0.05 }}
              >
                {m.value}
              </motion.text>
            );
          })}
        </svg>
      </div>

      {/* Shape analysis */}
      <div className="flex items-center justify-between mt-2 pt-3 border-t border-border/50">
        <div>
          <p className="text-xs font-medium text-foreground">{shapeLabel}</p>
          <p className="text-[10px] text-muted-foreground">Balance: {balance}% • Range: {minMetric}–{maxMetric}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold font-mono text-primary">{avgScore}</p>
          <p className="text-[10px] text-muted-foreground">Avg Score</p>
        </div>
      </div>
    </div>
  );
}

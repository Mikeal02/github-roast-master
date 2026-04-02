import { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy, Zap, Target, Award, TrendingUp, BarChart3, Layers } from 'lucide-react';

interface ScoreSummaryPanelProps {
  scores: {
    activity?: { score: number; label?: string; subMetrics?: Record<string, number> };
    documentation?: { score: number; label?: string; subMetrics?: Record<string, number> };
    popularity?: { score: number; label?: string; subMetrics?: Record<string, number> };
    diversity?: { score: number; label?: string; subMetrics?: Record<string, number> };
    codeQuality?: { score: number; label?: string; subMetrics?: Record<string, number> };
    collaboration?: { score: number; label?: string; subMetrics?: Record<string, number> };
    overall?: { score: number; label?: string; explanation?: string };
  };
}

const getGrade = (s: number) => {
  if (s >= 90) return { grade: 'S', label: 'Legendary', color: 'text-terminal-green', ring: 'hsl(var(--terminal-green))', tier: 5 };
  if (s >= 80) return { grade: 'A', label: 'Elite', color: 'text-terminal-green', ring: 'hsl(var(--terminal-green))', tier: 4 };
  if (s >= 70) return { grade: 'B', label: 'Strong', color: 'text-terminal-cyan', ring: 'hsl(var(--terminal-cyan))', tier: 3 };
  if (s >= 55) return { grade: 'C', label: 'Decent', color: 'text-terminal-yellow', ring: 'hsl(var(--terminal-yellow))', tier: 2 };
  if (s >= 35) return { grade: 'D', label: 'Weak', color: 'text-accent', ring: 'hsl(var(--accent))', tier: 1 };
  return { grade: 'F', label: 'Critical', color: 'text-terminal-red', ring: 'hsl(var(--terminal-red))', tier: 0 };
};

const getPercentile = (s: number) => {
  if (s >= 90) return { pct: 2, label: 'Top 2%' };
  if (s >= 80) return { pct: 10, label: 'Top 10%' };
  if (s >= 70) return { pct: 25, label: 'Top 25%' };
  if (s >= 55) return { pct: 50, label: 'Top 50%' };
  if (s >= 35) return { pct: 75, label: 'Top 75%' };
  return { pct: 95, label: 'Bottom 5%' };
};

const benchmarks: Record<string, number> = {
  activity: 52, documentation: 45, popularity: 30, diversity: 55, codeQuality: 50, collaboration: 40,
};

export function ScoreSummaryPanel({ scores }: ScoreSummaryPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [animatedScore, setAnimatedScore] = useState(0);

  const overall = scores?.overall?.score || 0;
  const gradeInfo = getGrade(overall);
  const percentile = getPercentile(overall);

  const categories = [
    { key: 'activity', label: 'Activity', score: scores?.activity?.score || 0, icon: Zap, emoji: '⚡' },
    { key: 'documentation', label: 'Documentation', score: scores?.documentation?.score || 0, icon: Target, emoji: '📝' },
    { key: 'popularity', label: 'Popularity', score: scores?.popularity?.score || 0, icon: Award, emoji: '⭐' },
    { key: 'diversity', label: 'Diversity', score: scores?.diversity?.score || 0, icon: Layers, emoji: '🌈' },
    { key: 'codeQuality', label: 'Code Quality', score: scores?.codeQuality?.score || 0, icon: Target, emoji: '🛡️' },
    { key: 'collaboration', label: 'Collaboration', score: scores?.collaboration?.score || 0, icon: Target, emoji: '🤝' },
  ];

  // Compute score distribution shape
  const scoreAnalysis = useMemo(() => {
    const vals = categories.map(c => c.score);
    const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
    const max = Math.max(...vals);
    const min = Math.min(...vals);
    const range = max - min;
    const variance = Math.round(vals.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / vals.length);
    const stdDev = Math.round(Math.sqrt(variance));
    const shape = range <= 15 ? 'Balanced' : range <= 30 ? 'Moderate Spread' : 'Highly Specialized';
    const aboveBenchmark = categories.filter(c => c.score > (benchmarks[c.key] || 50)).length;
    return { avg, max, min, range, stdDev, shape, aboveBenchmark };
  }, [categories]);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1600;
    const steps = 80;
    const increment = overall / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= overall) {
        setAnimatedScore(overall);
        clearInterval(interval);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [isInView, overall]);

  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  const sorted = [...categories].sort((a, b) => b.score - a.score);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel p-5 mb-6"
      style={{ boxShadow: `0 0 60px ${gradeInfo.ring}15` }}
    >
      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Big score ring */}
        <div className="relative w-[160px] h-[160px] flex-shrink-0">
          <svg className="w-[160px] h-[160px] -rotate-90" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="5" />
            <motion.circle
              cx="80" cy="80" r={radius} fill="none" stroke={gradeInfo.ring}
              strokeWidth="6" strokeLinecap="round" strokeDasharray={circumference}
              strokeDashoffset={isInView ? offset : circumference}
              className="transition-all duration-[1.6s] ease-out"
            />
            <motion.circle
              cx="80" cy="80" r={radius} fill="none" stroke={gradeInfo.ring}
              strokeWidth="14" strokeLinecap="round" strokeDasharray={circumference}
              strokeDashoffset={isInView ? offset : circumference} opacity={0.08}
              className="transition-all duration-[1.6s] ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className={`text-4xl font-black font-mono ${gradeInfo.color}`}
              initial={{ scale: 0 }} animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
            >
              {gradeInfo.grade}
            </motion.span>
            <span className={`text-xl font-bold font-mono leading-none tabular-nums ${gradeInfo.color}`}>
              {animatedScore}
            </span>
            <span className="text-[9px] text-muted-foreground">{gradeInfo.label}</span>
            <motion.span
              initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.4 }}
              className="text-[10px] font-mono text-primary mt-1"
            >
              {percentile.label}
            </motion.span>
          </div>
        </div>

        {/* Score breakdown bars with benchmark comparison */}
        <div className="flex-1 w-full space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className={`w-5 h-5 ${gradeInfo.color}`} />
            <h3 className="font-semibold text-foreground text-lg">Overall Score</h3>
            <span className="ml-auto text-[10px] text-muted-foreground font-mono">{scoreAnalysis.shape}</span>
          </div>
          
          {categories.map((cat, i) => {
            const catGrade = getGrade(cat.score);
            const bench = benchmarks[cat.key] || 50;
            const delta = cat.score - bench;
            return (
              <motion.div
                key={cat.key}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
              >
                <span className="text-[10px] mr-0.5">{cat.emoji}</span>
                <span className="text-xs text-muted-foreground w-16 text-right truncate">{cat.label}</span>
                <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden relative">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: catGrade.ring }}
                    initial={{ width: '0%' }}
                    animate={isInView ? { width: `${cat.score}%` } : {}}
                    transition={{ duration: 1.2, delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  />
                  {/* Benchmark marker */}
                  <div
                    className="absolute top-0 h-full w-0.5 bg-muted-foreground/40"
                    style={{ left: `${bench}%` }}
                    title={`Avg: ${bench}`}
                  />
                </div>
                <span className={`text-xs font-mono font-bold w-7 ${catGrade.color}`}>{cat.score}</span>
                <span className={`text-[9px] font-mono w-8 ${delta >= 0 ? 'text-terminal-green' : 'text-terminal-red'}`}>
                  {delta >= 0 ? '+' : ''}{delta}
                </span>
              </motion.div>
            );
          })}

          {/* Score analysis row */}
          <motion.div
            className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-border/50"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.2 }}
          >
            <div className="text-center">
              <p className="text-[10px] text-muted-foreground">Avg</p>
              <p className="text-sm font-bold font-mono text-foreground">{scoreAnalysis.avg}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-muted-foreground">Spread</p>
              <p className="text-sm font-bold font-mono text-foreground">±{scoreAnalysis.stdDev}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-muted-foreground">Range</p>
              <p className="text-sm font-bold font-mono text-foreground">{scoreAnalysis.min}-{scoreAnalysis.max}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-muted-foreground">Above Avg</p>
              <p className="text-sm font-bold font-mono text-terminal-green">{scoreAnalysis.aboveBenchmark}/6</p>
            </div>
          </motion.div>

          {/* Insights row */}
          <motion.div
            className="flex gap-4 mt-2 pt-2 border-t border-border/30"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.4 }}
          >
            <div className="text-xs flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-terminal-green" />
              <span className="text-muted-foreground">Best: </span>
              <span className="text-terminal-green font-semibold">{strongest.label} ({strongest.score})</span>
            </div>
            <div className="text-xs flex items-center gap-1">
              <BarChart3 className="w-3 h-3 text-terminal-red" />
              <span className="text-muted-foreground">Weakest: </span>
              <span className="text-terminal-red font-semibold">{weakest.label} ({weakest.score})</span>
            </div>
          </motion.div>
        </div>
      </div>

      {scores?.overall?.explanation && (
        <motion.p
          className="text-xs text-muted-foreground mt-4 pt-3 border-t border-border/50 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.6 }}
        >
          {scores.overall.explanation}
        </motion.p>
      )}
    </motion.div>
  );
}

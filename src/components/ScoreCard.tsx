import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { getSeverityLabel } from '@/lib/roastGenerator';
import { ChevronDown, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SubMetrics {
  [key: string]: number;
}

const getLetterGrade = (score: number) => {
  if (score >= 90) return { grade: 'S', color: 'text-terminal-green', bg: 'bg-terminal-green/10 border-terminal-green/30' };
  if (score >= 80) return { grade: 'A', color: 'text-terminal-green', bg: 'bg-terminal-green/10 border-terminal-green/30' };
  if (score >= 70) return { grade: 'B', color: 'text-terminal-cyan', bg: 'bg-terminal-cyan/10 border-terminal-cyan/30' };
  if (score >= 55) return { grade: 'C', color: 'text-terminal-yellow', bg: 'bg-terminal-yellow/10 border-terminal-yellow/30' };
  if (score >= 35) return { grade: 'D', color: 'text-accent', bg: 'bg-accent/10 border-accent/30' };
  return { grade: 'F', color: 'text-terminal-red', bg: 'bg-terminal-red/10 border-terminal-red/30' };
};

const getPercentile = (score: number) => {
  // Approximate percentile based on score distribution
  if (score >= 90) return 'Top 2%';
  if (score >= 80) return 'Top 10%';
  if (score >= 70) return 'Top 25%';
  if (score >= 55) return 'Top 50%';
  if (score >= 35) return 'Top 75%';
  return 'Bottom 25%';
};

const getSubMetricTrend = (value: number) => {
  if (value >= 70) return { icon: TrendingUp, label: 'Strong', color: 'text-terminal-green' };
  if (value >= 40) return { icon: Minus, label: 'Average', color: 'text-terminal-yellow' };
  return { icon: TrendingDown, label: 'Needs Work', color: 'text-terminal-red' };
};

export function ScoreCard({ title, score, icon, explanation = '', delay = 0, subMetrics }: {
  title: string;
  score: number;
  icon: React.ReactNode;
  explanation?: string;
  delay?: number;
  subMetrics?: SubMetrics;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [animatedScore, setAnimatedScore] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!isInView || hasAnimated) return;
    setHasAnimated(true);

    const timer = setTimeout(() => {
      const duration = 1400;
      const steps = 70;
      const increment = score / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += increment;
        if (current >= score) {
          setAnimatedScore(score);
          clearInterval(interval);
        } else {
          setAnimatedScore(Math.round(current));
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [isInView, score, delay, hasAnimated]);

  const getScoreColor = (s: number) => {
    if (s >= 70) return 'text-terminal-green';
    if (s >= 50) return 'text-terminal-yellow';
    if (s >= 30) return 'text-terminal-cyan';
    return 'text-terminal-red';
  };

  const getBarGradient = (s: number) => {
    if (s >= 70) return 'from-terminal-green/80 to-terminal-green';
    if (s >= 50) return 'from-terminal-yellow/80 to-terminal-yellow';
    if (s >= 30) return 'from-terminal-cyan/80 to-terminal-cyan';
    return 'from-terminal-red/80 to-terminal-red';
  };

  const getGlowColor = (s: number) => {
    if (s >= 70) return 'hsl(var(--terminal-green) / 0.15)';
    if (s >= 50) return 'hsl(var(--terminal-yellow) / 0.15)';
    if (s >= 30) return 'hsl(var(--terminal-cyan) / 0.15)';
    return 'hsl(var(--terminal-red) / 0.15)';
  };

  const getStrokeColor = (s: number) => {
    if (s >= 70) return 'hsl(var(--terminal-green))';
    if (s >= 50) return 'hsl(var(--terminal-yellow))';
    if (s >= 30) return 'hsl(var(--terminal-cyan))';
    return 'hsl(var(--terminal-red))';
  };

  const severity = getSeverityLabel(score);
  const grade = getLetterGrade(score);
  const percentile = getPercentile(score);
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const formatSubMetricLabel = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
  };

  const subMetricEntries = subMetrics ? Object.entries(subMetrics) : [];
  const subMetricAvg = subMetricEntries.length > 0 
    ? Math.round(subMetricEntries.reduce((s, [, v]) => s + v, 0) / subMetricEntries.length)
    : 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.9, filter: 'blur(8px)' }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
      transition={{ delay: delay / 1000, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-panel p-5 group"
      style={{
        boxShadow: isInView && animatedScore > 0 ? `0 0 40px ${getGlowColor(score)}` : undefined,
      }}
    >
      {/* Header with icon, title, and grade badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <motion.span
            className="text-primary"
            animate={isInView ? { rotate: [0, -10, 10, 0] } : {}}
            transition={{ delay: delay / 1000 + 0.5, duration: 0.5 }}
          >
            {icon}
          </motion.span>
          <span className="text-sm font-semibold text-foreground truncate">{title}</span>
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: delay / 1000 + 1.2, type: 'spring', stiffness: 300 }}
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${grade.bg} ${grade.color}`}
          >
            {grade.grade}
          </motion.span>
        </div>
        
        {/* Animated circular score */}
        <div className="relative w-[76px] h-[76px] flex-shrink-0">
          <svg className="w-[76px] h-[76px] -rotate-90" viewBox="0 0 76 76">
            {/* Background track */}
            <circle cx="38" cy="38" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
            {/* Animated gradient ring */}
            <motion.circle
              cx="38" cy="38" r={radius}
              fill="none"
              stroke={getStrokeColor(animatedScore)}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={isInView ? strokeDashoffset : circumference}
              className="transition-all duration-[1.4s] ease-out"
            />
            {/* Glow ring */}
            <motion.circle
              cx="38" cy="38" r={radius}
              fill="none"
              stroke={getStrokeColor(animatedScore)}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={isInView ? strokeDashoffset : circumference}
              opacity={0.15}
              className="transition-all duration-[1.4s] ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-xl font-bold font-mono leading-none ${getScoreColor(animatedScore)}`}>
              {animatedScore}
            </span>
            <span className="text-[7px] text-muted-foreground mt-0.5">/100</span>
          </div>
        </div>
      </div>

      {/* Severity + Percentile row */}
      <div className="flex items-center justify-between mb-2">
        <div className={`text-xs font-semibold ${severity.color}`}>
          {severity.label}
        </div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: delay / 1000 + 1.0 }}
          className="text-[10px] text-muted-foreground font-mono"
        >
          {percentile}
        </motion.span>
      </div>

      {/* Progress bar */}
      <div className="progress-bar mb-2">
        <motion.div
          className={`progress-bar-fill bg-gradient-to-r ${getBarGradient(score)}`}
          initial={{ width: '0%' }}
          animate={isInView ? { width: `${score}%` } : { width: '0%' }}
          transition={{ duration: 1.4, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Sub-metrics with expandable detail */}
      {subMetricEntries.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: delay / 1000 + 0.6 }}
          className="mt-3 pt-3 border-t border-border/50"
        >
          {/* Summary row - always visible */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between text-[10px] text-muted-foreground hover:text-foreground transition-colors mb-1.5"
          >
            <span className="font-medium">{subMetricEntries.length} sub-metrics • avg {subMetricAvg}</span>
            <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-3 h-3" />
            </motion.span>
          </button>

          {/* Compact bars - always shown */}
          <div className="space-y-1.5">
            {subMetricEntries.slice(0, expanded ? undefined : 3).map(([key, value]) => {
              const trend = getSubMetricTrend(value);
              const TrendIcon = trend.icon;
              return (
                <motion.div
                  key={key}
                  className="flex items-center gap-2"
                  initial={expanded ? { opacity: 0, height: 0 } : {}}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-[10px] text-muted-foreground flex-1 truncate">{formatSubMetricLabel(key)}</span>
                  <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${getBarGradient(value)}`}
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${value}%` } : {}}
                      transition={{ delay: delay / 1000 + 0.8, duration: 0.6 }}
                    />
                  </div>
                  <TrendIcon className={`w-2.5 h-2.5 ${trend.color}`} />
                  <span className={`text-[9px] font-mono w-6 text-right ${getScoreColor(value)}`}>{value}</span>
                </motion.div>
              );
            })}
          </div>

          {/* Expanded detail panel */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pt-2 border-t border-border/30"
              >
                <div className="grid grid-cols-3 gap-1.5">
                  {subMetricEntries.map(([key, value]) => (
                    <div key={`detail-${key}`} className="text-center p-1.5 bg-muted/30 rounded-lg">
                      <p className={`text-sm font-bold font-mono ${getScoreColor(value)}`}>{value}</p>
                      <p className="text-[8px] text-muted-foreground truncate">{formatSubMetricLabel(key)}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {explanation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: delay / 1000 + 0.8 }}
          className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/50 leading-relaxed"
        >
          {explanation}
        </motion.div>
      )}
    </motion.div>
  );
}

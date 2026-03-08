import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { getSeverityLabel } from '@/lib/roastGenerator';

interface SubMetrics {
  [key: string]: number;
}

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

  const severity = getSeverityLabel(score);
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const formatSubMetricLabel = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.9, filter: 'blur(8px)' }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
      transition={{ delay: delay / 1000, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="score-card group"
      style={{
        boxShadow: isInView && animatedScore > 0 ? `0 0 40px ${getGlowColor(score)}` : undefined,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.span
            className="text-primary"
            animate={isInView ? { rotate: [0, -10, 10, 0] } : {}}
            transition={{ delay: delay / 1000 + 0.5, duration: 0.5 }}
          >
            {icon}
          </motion.span>
          <span className="text-sm font-semibold text-foreground">{title}</span>
        </div>
        <div className="relative w-[68px] h-[68px]">
          <svg className="w-[68px] h-[68px] -rotate-90" viewBox="0 0 68 68">
            <circle cx="34" cy="34" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="3.5" />
            <motion.circle
              cx="34" cy="34" r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={isInView ? strokeDashoffset : circumference}
              className={`${getScoreColor(animatedScore)} transition-all duration-[1.4s] ease-out`}
            />
          </svg>
          <span className={`absolute inset-0 flex items-center justify-center text-lg font-bold font-mono ${getScoreColor(animatedScore)}`}>
            {animatedScore}
          </span>
        </div>
      </div>

      <div className={`text-xs font-semibold mb-2 ${severity.color}`}>
        {severity.label}
      </div>

      <div className="progress-bar mb-2">
        <motion.div
          className={`progress-bar-fill bg-gradient-to-r ${getBarGradient(score)}`}
          initial={{ width: '0%' }}
          animate={isInView ? { width: `${score}%` } : { width: '0%' }}
          transition={{ duration: 1.4, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Sub-metrics breakdown */}
      {subMetrics && Object.keys(subMetrics).length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: delay / 1000 + 0.6 }}
          className="space-y-1.5 mt-3 pt-3 border-t border-border/50"
        >
          {Object.entries(subMetrics).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground flex-1 truncate">{formatSubMetricLabel(key)}</span>
              <div className="w-16 h-1 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${getBarGradient(value)}`}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${value}%` } : {}}
                  transition={{ delay: delay / 1000 + 0.8, duration: 0.6 }}
                />
              </div>
              <span className={`text-[9px] font-mono w-6 text-right ${getScoreColor(value)}`}>{value}</span>
            </div>
          ))}
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

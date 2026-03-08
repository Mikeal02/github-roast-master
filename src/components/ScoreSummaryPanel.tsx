import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy, Zap, Target, Award } from 'lucide-react';

interface ScoreSummaryPanelProps {
  scores: {
    activity?: { score: number; label?: string };
    documentation?: { score: number; label?: string };
    popularity?: { score: number; label?: string };
    diversity?: { score: number; label?: string };
    codeQuality?: { score: number; label?: string };
    collaboration?: { score: number; label?: string };
    overall?: { score: number; label?: string; explanation?: string };
  };
}

const getGrade = (s: number) => {
  if (s >= 90) return { grade: 'S', label: 'Legendary', color: 'text-terminal-green', ring: 'hsl(var(--terminal-green))' };
  if (s >= 80) return { grade: 'A', label: 'Elite', color: 'text-terminal-green', ring: 'hsl(var(--terminal-green))' };
  if (s >= 70) return { grade: 'B', label: 'Strong', color: 'text-terminal-cyan', ring: 'hsl(var(--terminal-cyan))' };
  if (s >= 55) return { grade: 'C', label: 'Decent', color: 'text-terminal-yellow', ring: 'hsl(var(--terminal-yellow))' };
  if (s >= 35) return { grade: 'D', label: 'Weak', color: 'text-accent', ring: 'hsl(var(--accent))' };
  return { grade: 'F', label: 'Critical', color: 'text-terminal-red', ring: 'hsl(var(--terminal-red))' };
};

export function ScoreSummaryPanel({ scores }: ScoreSummaryPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [animatedScore, setAnimatedScore] = useState(0);

  const overall = scores?.overall?.score || 0;
  const gradeInfo = getGrade(overall);

  const categories = [
    { key: 'activity', label: 'Activity', score: scores?.activity?.score || 0, icon: Zap },
    { key: 'documentation', label: 'Docs', score: scores?.documentation?.score || 0, icon: Target },
    { key: 'popularity', label: 'Popular', score: scores?.popularity?.score || 0, icon: Award },
    { key: 'diversity', label: 'Diverse', score: scores?.diversity?.score || 0, icon: Target },
    { key: 'codeQuality', label: 'Quality', score: scores?.codeQuality?.score || 0, icon: Target },
    { key: 'collaboration', label: 'Collab', score: scores?.collaboration?.score || 0, icon: Target },
  ];

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

  // Find strongest and weakest
  const sorted = [...categories].sort((a, b) => b.score - a.score);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="score-card mb-6"
      style={{ boxShadow: `0 0 60px ${gradeInfo.ring}15` }}
    >
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Big score ring */}
        <div className="relative w-[140px] h-[140px] flex-shrink-0">
          <svg className="w-[140px] h-[140px] -rotate-90" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="5" />
            <motion.circle
              cx="70" cy="70" r={radius}
              fill="none"
              stroke={gradeInfo.ring}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={isInView ? offset : circumference}
              className="transition-all duration-[1.6s] ease-out"
            />
            <motion.circle
              cx="70" cy="70" r={radius}
              fill="none"
              stroke={gradeInfo.ring}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={isInView ? offset : circumference}
              opacity={0.1}
              className="transition-all duration-[1.6s] ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className={`text-4xl font-black font-mono ${gradeInfo.color}`}
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
            >
              {gradeInfo.grade}
            </motion.span>
            <span className={`text-lg font-bold font-mono leading-none ${gradeInfo.color}`}>
              {animatedScore}
            </span>
            <span className="text-[9px] text-muted-foreground">{gradeInfo.label}</span>
          </div>
        </div>

        {/* Score breakdown bars */}
        <div className="flex-1 w-full space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className={`w-5 h-5 ${gradeInfo.color}`} />
            <h3 className="font-semibold text-foreground text-lg">Overall Score</h3>
          </div>
          
          {categories.map((cat, i) => {
            const catGrade = getGrade(cat.score);
            return (
              <motion.div
                key={cat.key}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
              >
                <span className="text-xs text-muted-foreground w-14 text-right">{cat.label}</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: catGrade.ring }}
                    initial={{ width: '0%' }}
                    animate={isInView ? { width: `${cat.score}%` } : {}}
                    transition={{ duration: 1.2, delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <span className={`text-xs font-mono font-bold w-8 ${catGrade.color}`}>{cat.score}</span>
              </motion.div>
            );
          })}

          {/* Insights row */}
          <motion.div
            className="flex gap-4 mt-3 pt-3 border-t border-border/50"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.2 }}
          >
            <div className="text-xs">
              <span className="text-muted-foreground">Strongest: </span>
              <span className="text-terminal-green font-semibold">{strongest.label} ({strongest.score})</span>
            </div>
            <div className="text-xs">
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
          transition={{ delay: 1.4 }}
        >
          {scores.overall.explanation}
        </motion.p>
      )}
    </motion.div>
  );
}

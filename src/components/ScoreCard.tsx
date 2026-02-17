import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getSeverityLabel } from '@/lib/roastGenerator';

export function ScoreCard({ title, score, icon, explanation = '', delay = 0 }: {
  title: string;
  score: number;
  icon: React.ReactNode;
  explanation?: string;
  delay?: number;
}) {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1200;
      const steps = 60;
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
  }, [score, delay]);

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

  const severity = getSeverityLabel(score);

  // SVG circular progress
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: delay / 1000, duration: 0.4 }}
      className="score-card"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-primary">{icon}</span>
          <span className="text-sm font-semibold text-foreground">{title}</span>
        </div>
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
            <circle
              cx="32" cy="32" r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={`${getScoreColor(animatedScore)} transition-all duration-1000`}
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
        <div 
          className={`progress-bar-fill bg-gradient-to-r ${getBarGradient(score)}`}
          style={{ 
            width: `${animatedScore}%`,
            transition: 'width 1.2s ease-out',
            transitionDelay: `${delay}ms`
          }}
        />
      </div>
      
      {explanation && (
        <div className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/50 leading-relaxed">
          {explanation}
        </div>
      )}
    </motion.div>
  );
}
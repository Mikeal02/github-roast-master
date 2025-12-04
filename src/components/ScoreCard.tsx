import { useEffect, useState } from 'react';
import { getSeverityLabel } from '@/lib/roastGenerator';

export function ScoreCard({ title, score, icon, explanation = '', delay = 0 }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1000;
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

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-terminal-green';
    if (score >= 50) return 'text-terminal-yellow';
    if (score >= 30) return 'text-terminal-cyan';
    return 'text-terminal-red';
  };

  const getBarColor = (score) => {
    if (score >= 70) return 'bg-terminal-green';
    if (score >= 50) return 'bg-terminal-yellow';
    if (score >= 30) return 'bg-terminal-cyan';
    return 'bg-terminal-red';
  };

  const severity = getSeverityLabel(score);

  return (
    <div className="score-card">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-primary">{icon}</span>
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-bold font-mono ${getScoreColor(animatedScore)}`}>
            {animatedScore}
          </span>
        </div>
      </div>
      
      <div className={`text-xs font-semibold mb-2 ${severity.color}`}>
        {severity.label}
      </div>
      
      <div className="progress-bar mb-2">
        <div 
          className={`progress-bar-fill ${getBarColor(score)}`}
          style={{ 
            width: `${animatedScore}%`,
            transition: 'width 1s ease-out',
            transitionDelay: `${delay}ms`
          }}
        />
      </div>
      
      {explanation && (
        <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50">
          {explanation}
        </div>
      )}
    </div>
  );
}

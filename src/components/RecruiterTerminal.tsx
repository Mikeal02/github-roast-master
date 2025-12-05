import { useEffect, useState } from 'react';
import { Briefcase, CheckCircle, AlertCircle } from 'lucide-react';

export function RecruiterTerminal({ insights, username, scores }) {
  const [displayedInsights, setDisplayedInsights] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    setDisplayedInsights([]);
    setCurrentIndex(0);
  }, [insights]);
  
  useEffect(() => {
    if (currentIndex < insights.length) {
      const timer = setTimeout(() => {
        setDisplayedInsights(prev => [...prev, insights[currentIndex]]);
        setCurrentIndex(prev => prev + 1);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, insights]);

  const getHiringReadiness = (score) => {
    if (score >= 70) return { label: 'Strong Candidate', color: 'text-terminal-green' };
    if (score >= 50) return { label: 'Potential Candidate', color: 'text-terminal-cyan' };
    if (score >= 30) return { label: 'Needs Development', color: 'text-terminal-yellow' };
    return { label: 'Entry Level', color: 'text-terminal-red' };
  };

  const finalScore = scores?.overall?.score || scores?.finalScore || 0;
  const readiness = getHiringReadiness(finalScore);

  return (
    <div className="score-card">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <Briefcase className="w-5 h-5 text-secondary" />
        <h3 className="font-semibold text-foreground">Professional Assessment</h3>
        <span className="ml-auto text-xs text-muted-foreground">@{username}</span>
      </div>
      
      <div className="mb-4 p-3 bg-muted/50 rounded-lg">
        <div className="text-xs text-muted-foreground mb-1">Hiring Readiness</div>
        <div className={`text-lg font-bold ${readiness.color}`}>{readiness.label}</div>
        <div className="text-xs text-muted-foreground">Based on overall score of {finalScore}/100</div>
      </div>
      
      <div className="space-y-3 min-h-[150px]">
        <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
          Key Insights
        </div>
        
        {displayedInsights.map((insight, index) => (
          <div 
            key={index}
            className="flex items-start gap-2 animate-[fadeIn_0.5s_ease-out]"
          >
            {insight.includes('concern') || insight.includes('gap') || insight.includes('Limited') || insight.includes('opportunity')
              ? <AlertCircle className="w-4 h-4 text-terminal-yellow flex-shrink-0 mt-0.5" />
              : <CheckCircle className="w-4 h-4 text-terminal-green flex-shrink-0 mt-0.5" />
            }
            <p className="text-foreground/90 text-sm leading-relaxed">
              {insight}
            </p>
          </div>
        ))}
        
        {currentIndex < insights.length && (
          <div className="flex items-center gap-2 text-secondary">
            <span className="animate-pulse">●</span>
            <span className="text-xs text-muted-foreground">Analyzing...</span>
          </div>
        )}
      </div>
    </div>
  );
}

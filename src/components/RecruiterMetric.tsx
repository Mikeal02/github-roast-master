import { FileText, Info, Award } from 'lucide-react';

interface RecruiterMetricProps {
  metric?: {
    name: string;
    value: number;
    grade: string;
    explanation: string;
  };
}

const getGradeColor = (grade: string) => {
  switch (grade) {
    case 'A': return 'text-terminal-green';
    case 'B': return 'text-terminal-cyan';
    case 'C': return 'text-terminal-yellow';
    case 'D': return 'text-terminal-red';
    case 'F': return 'text-destructive';
    default: return 'text-muted-foreground';
  }
};

export function RecruiterMetric({ metric }: RecruiterMetricProps) {
  if (!metric) return null;
  
  const color = getGradeColor(metric.grade);

  return (
    <div className="score-card">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-5 h-5 text-secondary" />
        <h3 className="font-semibold text-foreground">{metric.name}</h3>
        <div className="ml-auto flex items-center gap-2">
          <span className={`text-2xl font-bold font-mono ${color}`}>{metric.value}%</span>
          <Award className={`w-5 h-5 ${color}`} />
          <span className={`text-lg font-bold ${color}`}>({metric.grade})</span>
        </div>
      </div>
      
      <div className="h-3 bg-muted rounded-full overflow-hidden mb-3">
        <div 
          className="h-full bg-gradient-to-r from-secondary to-primary transition-all duration-1000"
          style={{ width: `${metric.value}%` }}
        />
      </div>
      
      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
        <span>{metric.explanation}</span>
      </div>
    </div>
  );
}

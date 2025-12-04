import { FileText, Info } from 'lucide-react';

export function RecruiterMetric({ analysis }) {
  const docsCoverage = analysis.docsCoverage;
  
  const getGrade = (percent) => {
    if (percent >= 80) return { grade: 'A', color: 'text-terminal-green' };
    if (percent >= 60) return { grade: 'B', color: 'text-terminal-cyan' };
    if (percent >= 40) return { grade: 'C', color: 'text-terminal-yellow' };
    if (percent >= 20) return { grade: 'D', color: 'text-terminal-red' };
    return { grade: 'F', color: 'text-destructive' };
  };
  
  const { grade, color } = getGrade(docsCoverage);

  return (
    <div className="score-card">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-5 h-5 text-secondary" />
        <h3 className="font-semibold text-foreground">Documentation Coverage</h3>
        <div className="ml-auto flex items-center gap-2">
          <span className={`text-2xl font-bold font-mono ${color}`}>{docsCoverage}%</span>
          <span className={`text-lg font-bold ${color}`}>({grade})</span>
        </div>
      </div>
      
      <div className="h-3 bg-muted rounded-full overflow-hidden mb-3">
        <div 
          className="h-full bg-gradient-to-r from-secondary to-primary transition-all duration-1000"
          style={{ width: `${docsCoverage}%` }}
        />
      </div>
      
      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
        <span>
          {analysis.reposWithDescription} of {analysis.totalRepos} repositories have descriptions. 
          {docsCoverage >= 70 
            ? " Strong documentation practices indicate professional development habits."
            : " Consider adding README files to improve project discoverability."}
        </span>
      </div>
    </div>
  );
}

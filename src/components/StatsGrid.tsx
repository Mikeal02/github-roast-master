import { Star, GitFork, Code2, Clock, FileText, Archive } from 'lucide-react';

interface StatsGridProps {
  analysis: {
    totalRepos?: number;
    totalStars?: number;
    totalForks?: number;
    daysSinceLastUpdate?: number;
    languages?: Record<string, number>;
    reposWithDescription?: number;
    originalRepos?: number;
    forkedRepos?: number;
    inactiveRepos?: number;
    avgStars?: number;
    mostUsedLanguage?: string;
  };
  isRecruiterMode?: boolean;
}

const getActivityTimeLabel = (days: number): string => {
  if (days <= 7) return 'Active within last 7 days';
  if (days <= 30) return 'Active within last month';
  if (days <= 90) return 'No activity in 3 months';
  if (days <= 180) return 'No activity in 6 months';
  return 'No activity in 6+ months';
};

export function StatsGrid({ analysis, isRecruiterMode = false }: StatsGridProps) {
  const daysSinceLastUpdate = analysis.daysSinceLastUpdate || 0;
  const activityLabel = getActivityTimeLabel(daysSinceLastUpdate);
  
  // Calculate derived values safely
  const totalRepos = analysis.totalRepos || 0;
  const totalStars = analysis.totalStars || 0;
  const totalForks = analysis.totalForks || 0;
  const avgStars = totalRepos > 0 ? (totalStars / totalRepos) : 0;
  
  // Get most used language from languages object
  const languages = analysis.languages || {};
  const languageEntries = Object.entries(languages);
  const mostUsedLanguage = languageEntries.length > 0 
    ? languageEntries.sort((a, b) => b[1] - a[1])[0][0] 
    : 'N/A';
  
  const stats = [
    {
      label: 'Total Stars',
      value: totalStars,
      icon: <Star className="w-4 h-4" />,
      color: 'text-terminal-yellow',
    },
    {
      label: 'Total Forks',
      value: totalForks,
      icon: <GitFork className="w-4 h-4" />,
      color: 'text-terminal-cyan',
    },
    {
      label: 'Avg Stars/Repo',
      value: avgStars.toFixed(1),
      icon: <Star className="w-4 h-4" />,
      color: 'text-terminal-purple',
    },
    {
      label: 'Top Language',
      value: mostUsedLanguage,
      icon: <Code2 className="w-4 h-4" />,
      color: 'text-primary',
    },
    {
      label: 'Activity Status',
      value: activityLabel,
      icon: <Clock className="w-4 h-4" />,
      color: daysSinceLastUpdate <= 30 ? 'text-terminal-green' : 'text-terminal-red',
      isLong: true,
    },
    {
      label: 'Languages Used',
      value: languageEntries.length,
      icon: <Code2 className="w-4 h-4" />,
      color: 'text-terminal-purple',
    },
    {
      label: isRecruiterMode ? 'Documented Repos' : 'With Descriptions',
      value: `${analysis.reposWithDescription || 0}/${totalRepos}`,
      icon: <FileText className="w-4 h-4" />,
      color: 'text-secondary',
    },
    {
      label: 'Total Repos',
      value: totalRepos,
      icon: <Archive className="w-4 h-4" />,
      color: 'text-muted-foreground',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className={`score-card text-center py-3 ${stat.isLong ? 'col-span-2 sm:col-span-2' : ''}`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className={`flex justify-center mb-2 ${stat.color}`}>
            {stat.icon}
          </div>
          <div className={`font-bold font-mono text-foreground ${stat.isLong ? 'text-sm' : 'text-lg'}`}>
            {stat.value}
          </div>
          <div className="text-xs text-muted-foreground">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

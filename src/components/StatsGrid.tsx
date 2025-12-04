import { Star, GitFork, Code2, Clock, FileText, Archive } from 'lucide-react';
import { getActivityTimeLabel } from '@/lib/roastGenerator';

export function StatsGrid({ analysis, isRecruiterMode = false }) {
  const activityLabel = getActivityTimeLabel(analysis.daysSinceLastUpdate);
  
  const stats = [
    {
      label: 'Total Stars',
      value: analysis.totalStars,
      icon: <Star className="w-4 h-4" />,
      color: 'text-terminal-yellow',
    },
    {
      label: 'Total Forks',
      value: analysis.totalForks,
      icon: <GitFork className="w-4 h-4" />,
      color: 'text-terminal-cyan',
    },
    {
      label: 'Avg Stars/Repo',
      value: analysis.avgStars.toFixed(1),
      icon: <Star className="w-4 h-4" />,
      color: 'text-terminal-purple',
    },
    {
      label: 'Top Language',
      value: analysis.mostUsedLanguage,
      icon: <Code2 className="w-4 h-4" />,
      color: 'text-primary',
    },
    {
      label: 'Activity Status',
      value: activityLabel,
      icon: <Clock className="w-4 h-4" />,
      color: analysis.daysSinceLastUpdate <= 30 ? 'text-terminal-green' : 'text-terminal-red',
      isLong: true,
    },
    {
      label: 'Inactive Repos',
      value: analysis.inactiveRepos,
      icon: <Archive className="w-4 h-4" />,
      color: 'text-terminal-red',
    },
    {
      label: isRecruiterMode ? 'Documented Repos' : 'With Descriptions',
      value: `${analysis.reposWithDescription}/${analysis.totalRepos}`,
      icon: <FileText className="w-4 h-4" />,
      color: 'text-secondary',
    },
    {
      label: 'Original vs Forked',
      value: `${analysis.originalRepos}/${analysis.forkedRepos}`,
      icon: <GitFork className="w-4 h-4" />,
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

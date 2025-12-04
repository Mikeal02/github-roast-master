import { Star, GitFork, Code2, Clock, FileText, Archive } from 'lucide-react';

export function StatsGrid({ analysis }) {
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
      label: 'Recent Activity',
      value: `${analysis.recentlyUpdated} repos`,
      icon: <Clock className="w-4 h-4" />,
      color: 'text-terminal-green',
    },
    {
      label: 'Inactive Repos',
      value: analysis.inactiveRepos,
      icon: <Archive className="w-4 h-4" />,
      color: 'text-terminal-red',
    },
    {
      label: 'With Descriptions',
      value: analysis.reposWithDescription,
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
          className="score-card text-center py-3"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className={`flex justify-center mb-2 ${stat.color}`}>
            {stat.icon}
          </div>
          <div className="text-lg font-bold font-mono text-foreground">
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

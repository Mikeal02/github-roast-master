import { useRef } from 'react';
import { Star, GitFork, Code2, Clock, FileText, Archive } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { AnimatedCounter } from './AnimatedCounter';

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
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const daysSinceLastUpdate = analysis.daysSinceLastUpdate || 0;
  const activityLabel = getActivityTimeLabel(daysSinceLastUpdate);

  const totalRepos = analysis.totalRepos || 0;
  const totalStars = analysis.totalStars || 0;
  const totalForks = analysis.totalForks || 0;
  const avgStars = totalRepos > 0 ? (totalStars / totalRepos) : 0;

  const languages = analysis.languages || {};
  const languageEntries = Object.entries(languages);
  const mostUsedLanguage = languageEntries.length > 0
    ? languageEntries.sort((a, b) => b[1] - a[1])[0][0]
    : 'N/A';

  const stats = [
    { label: 'Total Stars', value: totalStars, icon: <Star className="w-4 h-4" />, color: 'text-terminal-yellow', isNumeric: true },
    { label: 'Total Forks', value: totalForks, icon: <GitFork className="w-4 h-4" />, color: 'text-terminal-cyan', isNumeric: true },
    { label: 'Avg Stars/Repo', value: avgStars, icon: <Star className="w-4 h-4" />, color: 'text-terminal-purple', isNumeric: true, decimals: 1 },
    { label: 'Top Language', value: mostUsedLanguage, icon: <Code2 className="w-4 h-4" />, color: 'text-primary' },
    { label: 'Activity Status', value: activityLabel, icon: <Clock className="w-4 h-4" />, color: daysSinceLastUpdate <= 30 ? 'text-terminal-green' : 'text-terminal-red', isLong: true },
    { label: 'Languages Used', value: languageEntries.length, icon: <Code2 className="w-4 h-4" />, color: 'text-terminal-purple', isNumeric: true },
    { label: isRecruiterMode ? 'Documented Repos' : 'With Descriptions', value: `${analysis.reposWithDescription || 0}/${totalRepos}`, icon: <FileText className="w-4 h-4" />, color: 'text-secondary' },
    { label: 'Total Repos', value: totalRepos, icon: <Archive className="w-4 h-4" />, color: 'text-muted-foreground', isNumeric: true },
  ];

  return (
    <div ref={ref} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ delay: index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className={`score-card text-center py-3 ${stat.isLong ? 'col-span-2 sm:col-span-2' : ''}`}
        >
          <div className={`flex justify-center mb-2 ${stat.color}`}>
            {stat.icon}
          </div>
          <div className={`font-bold font-mono text-foreground ${stat.isLong ? 'text-sm' : 'text-lg'}`}>
            {stat.isNumeric ? (
              <AnimatedCounter value={stat.value as number} decimals={stat.decimals || 0} />
            ) : (
              stat.value
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

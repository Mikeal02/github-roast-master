import { useRef } from 'react';
import { Star, GitFork, Code2, Clock, FileText, Scale, HardDrive, AlertCircle, Box, TrendingUp, Users, Percent } from 'lucide-react';
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
    avgStarsPerRepo?: number;
    forkToStarRatio?: number;
    totalRepoSizeMB?: number;
    totalOpenIssues?: number;
    orgCount?: number;
    publicGists?: number;
    medianStars?: number;
    reposWithLicense?: number;
    weekendRatio?: number;
    eventsPerActiveDay?: number;
  };
  isRecruiterMode?: boolean;
}

const getActivityTimeLabel = (days: number): { label: string; color: string } => {
  if (days <= 7) return { label: 'Active this week', color: 'text-terminal-green' };
  if (days <= 30) return { label: 'Active this month', color: 'text-terminal-green' };
  if (days <= 90) return { label: 'Quiet (3 months)', color: 'text-terminal-yellow' };
  if (days <= 180) return { label: 'Dormant (6 months)', color: 'text-accent' };
  return { label: 'Hibernating (6m+)', color: 'text-terminal-red' };
};

const getHealthGrade = (analysis: StatsGridProps['analysis']) => {
  let score = 0;
  const totalRepos = analysis.totalRepos || 1;
  
  // Description coverage
  score += ((analysis.reposWithDescription || 0) / totalRepos) * 25;
  // License coverage
  score += ((analysis.reposWithLicense || 0) / totalRepos) * 20;
  // Recency
  score += Math.max(0, 25 - (analysis.daysSinceLastUpdate || 0) / 4);
  // Stars per repo
  score += Math.min(30, (analysis.avgStarsPerRepo || 0) * 3);
  
  if (score >= 80) return { grade: 'A', color: 'text-terminal-green', bg: 'bg-terminal-green/10' };
  if (score >= 60) return { grade: 'B', color: 'text-terminal-cyan', bg: 'bg-terminal-cyan/10' };
  if (score >= 40) return { grade: 'C', color: 'text-terminal-yellow', bg: 'bg-terminal-yellow/10' };
  if (score >= 20) return { grade: 'D', color: 'text-accent', bg: 'bg-accent/10' };
  return { grade: 'F', color: 'text-terminal-red', bg: 'bg-terminal-red/10' };
};

export function StatsGrid({ analysis, isRecruiterMode = false }: StatsGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const daysSinceLastUpdate = analysis.daysSinceLastUpdate || 0;
  const activityInfo = getActivityTimeLabel(daysSinceLastUpdate);
  const health = getHealthGrade(analysis);

  const totalRepos = analysis.totalRepos || 0;
  const totalStars = analysis.totalStars || 0;
  const totalForks = analysis.totalForks || 0;
  const avgStars = analysis.avgStarsPerRepo ?? (totalRepos > 0 ? +(totalStars / totalRepos).toFixed(1) : 0);

  const languages = analysis.languages || {};
  const languageEntries = Object.entries(languages);
  const mostUsedLanguage = languageEntries.length > 0
    ? languageEntries.sort((a, b) => b[1] - a[1])[0][0]
    : 'N/A';

  const originalRepos = analysis.originalRepos || 0;
  const forkedRepos = analysis.forkedRepos || 0;
  const originalRatio = totalRepos > 0 ? Math.round((originalRepos / totalRepos) * 100) : 0;

  const stats = [
    { label: 'Total Stars', value: totalStars, icon: <Star className="w-4 h-4" />, color: 'text-terminal-yellow', isNumeric: true, highlight: totalStars >= 100 },
    { label: 'Total Forks', value: totalForks, icon: <GitFork className="w-4 h-4" />, color: 'text-terminal-cyan', isNumeric: true },
    { label: 'Avg Stars/Repo', value: avgStars, icon: <TrendingUp className="w-4 h-4" />, color: 'text-terminal-purple', isNumeric: true, decimals: 1 },
    { label: 'Median Stars', value: analysis.medianStars ?? 0, icon: <Star className="w-4 h-4" />, color: 'text-accent', isNumeric: true },
    { label: 'Fork/Star Ratio', value: analysis.forkToStarRatio ?? 0, icon: <Scale className="w-4 h-4" />, color: 'text-secondary', isNumeric: true, decimals: 2 },
    { label: 'Top Language', value: mostUsedLanguage, icon: <Code2 className="w-4 h-4" />, color: 'text-primary' },
    { label: 'Languages Used', value: languageEntries.length, icon: <Code2 className="w-4 h-4" />, color: 'text-terminal-purple', isNumeric: true },
    { label: 'Original Repos', value: originalRepos, icon: <Box className="w-4 h-4" />, color: 'text-terminal-green', isNumeric: true, suffix: ` (${originalRatio}%)` },
    { label: 'Forked Repos', value: forkedRepos, icon: <GitFork className="w-4 h-4" />, color: 'text-muted-foreground', isNumeric: true },
    { label: 'With Descriptions', value: `${analysis.reposWithDescription || 0}/${totalRepos}`, icon: <FileText className="w-4 h-4" />, color: 'text-secondary' },
    { label: 'Total Codebase', value: analysis.totalRepoSizeMB ?? 0, icon: <HardDrive className="w-4 h-4" />, color: 'text-terminal-cyan', isNumeric: true, suffix: ' MB' },
    { label: 'Open Issues', value: analysis.totalOpenIssues ?? 0, icon: <AlertCircle className="w-4 h-4" />, color: 'text-terminal-yellow', isNumeric: true },
    { label: 'Licensed', value: `${analysis.reposWithLicense ?? 0}/${totalRepos}`, icon: <Scale className="w-4 h-4" />, color: 'text-terminal-green' },
    { label: 'Weekend Activity', value: `${analysis.weekendRatio ?? 0}%`, icon: <Percent className="w-4 h-4" />, color: 'text-terminal-purple' },
    { label: 'Events/Active Day', value: analysis.eventsPerActiveDay ?? 0, icon: <TrendingUp className="w-4 h-4" />, color: 'text-primary', isNumeric: true, decimals: 1 },
  ];

  return (
    <div ref={ref} className="space-y-3">
      {/* Health + Activity header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${health.bg} flex items-center justify-center`}>
            <span className={`text-lg font-bold font-mono ${health.color}`}>{health.grade}</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Repo Health Grade</p>
            <p className="text-[10px] text-muted-foreground">Based on docs, licenses, activity & engagement</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-xs font-semibold ${activityInfo.color}`}>{activityInfo.label}</p>
          <p className="text-[10px] text-muted-foreground">{daysSinceLastUpdate}d since last update</p>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: index * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            className={`score-card text-center py-2.5 px-1.5 ${stat.highlight ? 'ring-1 ring-terminal-yellow/30' : ''}`}
          >
            <div className={`flex justify-center mb-1.5 ${stat.color}`}>{stat.icon}</div>
            <div className="font-bold font-mono text-foreground text-sm">
              {stat.isNumeric ? (
                <>
                  <AnimatedCounter value={stat.value as number} decimals={(stat as any).decimals || 0} />
                  {(stat as any).suffix || ''}
                </>
              ) : (
                <span className="text-xs">{stat.value}</span>
              )}
            </div>
            <div className="text-[9px] text-muted-foreground leading-tight mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

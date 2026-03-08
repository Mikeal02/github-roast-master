import { motion } from 'framer-motion';
import { 
  BarChart3, Brain, GitFork, Flame, Briefcase, 
  Radar, Clock, Code2, Users, Dna
} from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  accent?: string;
}

const roastTabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" />, accent: 'hsl(var(--primary))' },
  { id: 'scores', label: 'Scores', icon: <Radar className="w-4 h-4" />, accent: 'hsl(var(--terminal-cyan))' },
  { id: 'dna', label: 'DNA', icon: <Dna className="w-4 h-4" />, accent: 'hsl(var(--accent))' },
  { id: 'tech', label: 'Tech Stack', icon: <Code2 className="w-4 h-4" />, accent: 'hsl(var(--terminal-purple))' },
  { id: 'activity', label: 'Activity', icon: <Clock className="w-4 h-4" />, accent: 'hsl(var(--terminal-green))' },
  { id: 'repos', label: 'Repos', icon: <GitFork className="w-4 h-4" />, accent: 'hsl(var(--secondary))' },
  { id: 'roast', label: 'Roast', icon: <Flame className="w-4 h-4" />, accent: 'hsl(var(--destructive))' },
  { id: 'personality', label: 'Personality', icon: <Brain className="w-4 h-4" />, accent: 'hsl(var(--terminal-purple))' },
];

const recruiterTabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" />, accent: 'hsl(var(--primary))' },
  { id: 'scores', label: 'Scores', icon: <Radar className="w-4 h-4" />, accent: 'hsl(var(--terminal-cyan))' },
  { id: 'tech', label: 'Tech Stack', icon: <Code2 className="w-4 h-4" />, accent: 'hsl(var(--accent))' },
  { id: 'activity', label: 'Activity', icon: <Clock className="w-4 h-4" />, accent: 'hsl(var(--terminal-green))' },
  { id: 'repos', label: 'Repos', icon: <GitFork className="w-4 h-4" />, accent: 'hsl(var(--secondary))' },
  { id: 'assessment', label: 'Assessment', icon: <Briefcase className="w-4 h-4" />, accent: 'hsl(var(--terminal-yellow))' },
  { id: 'career', label: 'Career', icon: <Users className="w-4 h-4" />, accent: 'hsl(var(--terminal-purple))' },
];

interface ResultsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isRecruiterMode: boolean;
}

export function ResultsTabs({ activeTab, onTabChange, isRecruiterMode }: ResultsTabsProps) {
  const tabs = isRecruiterMode ? recruiterTabs : roastTabs;

  return (
    <div className="sticky top-0 z-30 py-3 bg-background/70 backdrop-blur-2xl border-b border-border/50 mb-6">
      <div className="flex gap-1 overflow-x-auto scrollbar-hide px-1">
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
            whileHover={{ scale: activeTab === tab.id ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-xl"
                style={{ background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))` }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.icon}</span>
            <span className="relative z-10 hidden sm:inline">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div
                className="absolute -bottom-3 left-1/2 w-6 h-0.5 rounded-full"
                style={{ background: tab.accent, x: '-50%' }}
                layoutId="tabIndicator"
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

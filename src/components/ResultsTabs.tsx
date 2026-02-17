import { motion } from 'framer-motion';
import { 
  BarChart3, Brain, Trophy, GitFork, Flame, Briefcase, 
  Radar, Clock, Code2, Users, Layers, Share2 
} from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const roastTabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'scores', label: 'Scores', icon: <Radar className="w-4 h-4" /> },
  { id: 'tech', label: 'Tech Stack', icon: <Code2 className="w-4 h-4" /> },
  { id: 'activity', label: 'Activity', icon: <Clock className="w-4 h-4" /> },
  { id: 'repos', label: 'Repos', icon: <GitFork className="w-4 h-4" /> },
  { id: 'roast', label: 'Roast', icon: <Flame className="w-4 h-4" /> },
  { id: 'personality', label: 'Personality', icon: <Brain className="w-4 h-4" /> },
];

const recruiterTabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'scores', label: 'Scores', icon: <Radar className="w-4 h-4" /> },
  { id: 'tech', label: 'Tech Stack', icon: <Code2 className="w-4 h-4" /> },
  { id: 'activity', label: 'Activity', icon: <Clock className="w-4 h-4" /> },
  { id: 'repos', label: 'Repos', icon: <GitFork className="w-4 h-4" /> },
  { id: 'assessment', label: 'Assessment', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'career', label: 'Career', icon: <Users className="w-4 h-4" /> },
];

interface ResultsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isRecruiterMode: boolean;
}

export function ResultsTabs({ activeTab, onTabChange, isRecruiterMode }: ResultsTabsProps) {
  const tabs = isRecruiterMode ? recruiterTabs : roastTabs;

  return (
    <div className="sticky top-0 z-30 py-3 bg-background/80 backdrop-blur-xl border-b border-border mb-6">
      <div className="flex gap-1 overflow-x-auto scrollbar-hide px-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-xl"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.icon}</span>
            <span className="relative z-10 hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
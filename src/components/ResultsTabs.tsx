import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { 
  BarChart3, Brain, GitFork, Flame, Briefcase, 
  Radar, Clock, Code2, Users, Dna, Music, Trophy, Globe, Rewind,
  ChevronLeft, ChevronRight, Zap
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
  { id: 'rhythm', label: 'Rhythm', icon: <Music className="w-4 h-4" />, accent: 'hsl(var(--accent))' },
  { id: 'xp', label: 'XP', icon: <Trophy className="w-4 h-4" />, accent: 'hsl(var(--terminal-yellow))' },
  { id: 'timeline', label: 'Time Machine', icon: <Rewind className="w-4 h-4" />, accent: 'hsl(var(--secondary))' },
  { id: 'globe', label: 'World Map', icon: <Globe className="w-4 h-4" />, accent: 'hsl(var(--terminal-cyan))' },
  { id: 'impact', label: 'Impact', icon: <Zap className="w-4 h-4" />, accent: 'hsl(var(--terminal-yellow))' },
  { id: 'roast', label: 'Roast', icon: <Flame className="w-4 h-4" />, accent: 'hsl(var(--destructive))' },
  { id: 'personality', label: 'Personality', icon: <Brain className="w-4 h-4" />, accent: 'hsl(var(--terminal-purple))' },
];

const recruiterTabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" />, accent: 'hsl(var(--primary))' },
  { id: 'scores', label: 'Scores', icon: <Radar className="w-4 h-4" />, accent: 'hsl(var(--terminal-cyan))' },
  { id: 'dna', label: 'DNA', icon: <Dna className="w-4 h-4" />, accent: 'hsl(var(--accent))' },
  { id: 'tech', label: 'Tech Stack', icon: <Code2 className="w-4 h-4" />, accent: 'hsl(var(--terminal-purple))' },
  { id: 'activity', label: 'Activity', icon: <Clock className="w-4 h-4" />, accent: 'hsl(var(--terminal-green))' },
  { id: 'repos', label: 'Repos', icon: <GitFork className="w-4 h-4" />, accent: 'hsl(var(--secondary))' },
  { id: 'rhythm', label: 'Rhythm', icon: <Music className="w-4 h-4" />, accent: 'hsl(var(--accent))' },
  { id: 'xp', label: 'XP', icon: <Trophy className="w-4 h-4" />, accent: 'hsl(var(--terminal-yellow))' },
  { id: 'timeline', label: 'Time Machine', icon: <Rewind className="w-4 h-4" />, accent: 'hsl(var(--secondary))' },
  { id: 'globe', label: 'World Map', icon: <Globe className="w-4 h-4" />, accent: 'hsl(var(--terminal-cyan))' },
  { id: 'impact', label: 'Impact', icon: <Zap className="w-4 h-4" />, accent: 'hsl(var(--terminal-yellow))' },
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    el?.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      el?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  // Auto-scroll active tab into view
  useEffect(() => {
    if (activeTabRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const tab = activeTabRef.current;
      const tabLeft = tab.offsetLeft - container.offsetLeft;
      const tabRight = tabLeft + tab.offsetWidth;
      const scrollLeft = container.scrollLeft;
      const visibleWidth = container.clientWidth;

      if (tabLeft < scrollLeft + 40) {
        container.scrollTo({ left: tabLeft - 40, behavior: 'smooth' });
      } else if (tabRight > scrollLeft + visibleWidth - 40) {
        container.scrollTo({ left: tabRight - visibleWidth + 40, behavior: 'smooth' });
      }
    }
  }, [activeTab]);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 200, behavior: 'smooth' });
  };

  const activeIndex = tabs.findIndex(t => t.id === activeTab);
  const activeAccent = tabs[activeIndex]?.accent || 'hsl(var(--primary))';

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (activeIndex + 1) % tabs.length;
      onTabChange(tabs[next].id);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (activeIndex - 1 + tabs.length) % tabs.length;
      onTabChange(tabs[prev].id);
    }
  };

  return (
    <div className="sticky top-0 z-30 mb-6" role="tablist" onKeyDown={handleKeyDown}>
      <div className="glass-panel-static py-3 px-1 relative">
        {/* Active tab counter with accent color */}
        <div className="absolute top-1 right-3 text-[9px] font-mono text-muted-foreground/60 flex items-center gap-1.5">
          <motion.span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: activeAccent }}
            layoutId="tabCounterDot"
          />
          {activeIndex + 1}/{tabs.length}
        </div>

        {/* Scroll edge fades */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none rounded-l-2xl" 
               style={{ background: 'linear-gradient(90deg, hsl(var(--card) / 0.95), transparent)' }} />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none rounded-r-2xl"
               style={{ background: 'linear-gradient(-90deg, hsl(var(--card) / 0.95), transparent)' }} />
        )}

        {/* Scroll arrows */}
        {canScrollLeft && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => scroll(-1)}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all shadow-sm"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </motion.button>
        )}
        {canScrollRight && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => scroll(1)}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all shadow-sm"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.button>
        )}

        <div ref={scrollRef} className="flex gap-1 overflow-x-auto scrollbar-hide px-2">
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                ref={isActive ? activeTabRef : undefined}
                role="tab"
                aria-selected={isActive}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                  isActive
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
                whileHover={{ scale: isActive ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))` }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 transition-transform duration-200" style={isActive ? {} : {}}>
                  {tab.icon}
                </span>
                <span className="relative z-10 hidden sm:inline">{tab.label}</span>
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 w-8 h-0.5 rounded-full"
                    style={{ background: tab.accent, x: '-50%' }}
                    layoutId="tabIndicator"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Progress indicator */}
        <div className="mt-2 mx-2 h-0.5 rounded-full bg-muted/30 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, hsl(var(--primary)), ${activeAccent})` }}
            animate={{ width: `${((activeIndex + 1) / tabs.length) * 100}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
      </div>
    </div>
  );
}

import { 
  Trophy, Star, GitFork, Users, Code2, Flame, Zap, Crown, Rocket,
  Heart, Shield, Award, Target, Sparkles
} from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementBadgesProps {
  userData: {
    followers: number;
    following: number;
    public_repos: number;
    created_at: string;
  };
  analysis: {
    totalStars?: number;
    totalForks?: number;
    languages?: Record<string, number>;
    scores?: {
      overall?: { score: number };
      activity?: { score: number };
      documentation?: { score: number };
    };
  };
}

const rarityColors = {
  common: 'border-muted-foreground/50 bg-muted/50',
  rare: 'border-terminal-cyan/50 bg-terminal-cyan/10',
  epic: 'border-accent/50 bg-accent/10',
  legendary: 'border-terminal-yellow/50 bg-terminal-yellow/10',
};

const rarityGlow = {
  common: '',
  rare: 'shadow-[0_0_10px_hsl(var(--terminal-cyan)/0.3)]',
  epic: 'shadow-[0_0_10px_hsl(var(--accent)/0.3)]',
  legendary: 'shadow-[0_0_15px_hsl(var(--terminal-yellow)/0.4)]',
};

const rarityLabel = {
  common: 'text-muted-foreground',
  rare: 'text-terminal-cyan',
  epic: 'text-accent',
  legendary: 'text-terminal-yellow',
};

export function AchievementBadges({ userData, analysis }: AchievementBadgesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const accountAgeDays = Math.floor(
    (Date.now() - new Date(userData.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );
  const accountAgeYears = Math.floor(accountAgeDays / 365);
  const totalStars = analysis.totalStars || 0;
  const totalForks = analysis.totalForks || 0;
  const languageCount = Object.keys(analysis.languages || {}).length;
  const overallScore = analysis.scores?.overall?.score || 0;

  const badges: Badge[] = [
    { id: 'rising-star', name: 'Rising Star', description: 'Earned 10+ stars across repos', icon: <Star className="w-4 h-4" />, unlocked: totalStars >= 10, color: 'text-terminal-yellow', rarity: 'common' },
    { id: 'star-collector', name: 'Star Collector', description: '100+ stars across repos', icon: <Sparkles className="w-4 h-4" />, unlocked: totalStars >= 100, color: 'text-terminal-yellow', rarity: 'rare' },
    { id: 'github-celebrity', name: 'GitHub Celebrity', description: '1000+ stars - You\'re famous!', icon: <Crown className="w-4 h-4" />, unlocked: totalStars >= 1000, color: 'text-terminal-yellow', rarity: 'legendary' },
    { id: 'community-builder', name: 'Community Builder', description: '50+ followers', icon: <Users className="w-4 h-4" />, unlocked: userData.followers >= 50, color: 'text-terminal-cyan', rarity: 'rare' },
    { id: 'influencer', name: 'Influencer', description: '500+ followers', icon: <Heart className="w-4 h-4" />, unlocked: userData.followers >= 500, color: 'text-terminal-red', rarity: 'epic' },
    { id: 'polyglot', name: 'Polyglot', description: '5+ programming languages', icon: <Code2 className="w-4 h-4" />, unlocked: languageCount >= 5, color: 'text-accent', rarity: 'rare' },
    { id: 'language-master', name: 'Language Master', description: '10+ programming languages', icon: <Zap className="w-4 h-4" />, unlocked: languageCount >= 10, color: 'text-terminal-purple', rarity: 'epic' },
    { id: 'prolific', name: 'Prolific Coder', description: '20+ public repositories', icon: <Rocket className="w-4 h-4" />, unlocked: userData.public_repos >= 20, color: 'text-terminal-green', rarity: 'common' },
    { id: 'repo-master', name: 'Repo Master', description: '50+ public repositories', icon: <Shield className="w-4 h-4" />, unlocked: userData.public_repos >= 50, color: 'text-terminal-cyan', rarity: 'rare' },
    { id: 'veteran', name: 'GitHub Veteran', description: 'Account older than 3 years', icon: <Trophy className="w-4 h-4" />, unlocked: accountAgeYears >= 3, color: 'text-terminal-yellow', rarity: 'common' },
    { id: 'og', name: 'OG Developer', description: 'Account older than 7 years', icon: <Award className="w-4 h-4" />, unlocked: accountAgeYears >= 7, color: 'text-terminal-yellow', rarity: 'epic' },
    { id: 'forker', name: 'Open Source Contributor', description: 'Projects forked 10+ times', icon: <GitFork className="w-4 h-4" />, unlocked: totalForks >= 10, color: 'text-terminal-cyan', rarity: 'rare' },
    { id: 'top-performer', name: 'Top Performer', description: 'Overall score of 70+', icon: <Target className="w-4 h-4" />, unlocked: overallScore >= 70, color: 'text-terminal-green', rarity: 'rare' },
    { id: 'elite', name: 'Elite Developer', description: 'Overall score of 85+', icon: <Flame className="w-4 h-4" />, unlocked: overallScore >= 85, color: 'text-terminal-red', rarity: 'legendary' },
  ];

  const unlockedBadges = badges.filter(b => b.unlocked);
  const lockedBadges = badges.filter(b => !b.unlocked);
  const completionPct = Math.round((unlockedBadges.length / badges.length) * 100);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="glass-panel p-5"
    >
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <Trophy className="w-5 h-5 text-terminal-yellow" />
        <h3 className="font-semibold text-foreground">Achievements</h3>
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-terminal-yellow"
                initial={{ width: 0 }}
                animate={isInView ? { width: `${completionPct}%` } : {}}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <span className="text-xs text-muted-foreground font-mono">{completionPct}%</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {unlockedBadges.length}/{badges.length}
          </span>
        </div>
      </div>

      <TooltipProvider>
        <div className="grid grid-cols-7 gap-2">
          {unlockedBadges.map((badge, i) => (
            <Tooltip key={badge.id}>
              <TooltipTrigger>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.2 + i * 0.06, type: 'spring', stiffness: 300 }}
                  className={`aspect-square rounded-lg border-2 ${rarityColors[badge.rarity]} ${rarityGlow[badge.rarity]} flex items-center justify-center transition-transform hover:scale-110 cursor-pointer`}
                >
                  <span className={badge.color}>{badge.icon}</span>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[200px]">
                <p className="font-semibold">{badge.name}</p>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
                <p className={`text-xs capitalize mt-1 ${rarityLabel[badge.rarity]}`}>{badge.rarity}</p>
              </TooltipContent>
            </Tooltip>
          ))}
          
          {lockedBadges.map((badge, i) => (
            <Tooltip key={badge.id}>
              <TooltipTrigger>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 0.3 } : {}}
                  transition={{ delay: 0.4 + i * 0.04 }}
                  className="aspect-square rounded-lg border-2 border-muted/30 bg-muted/20 flex items-center justify-center cursor-pointer"
                >
                  <span className="text-muted-foreground">{badge.icon}</span>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[200px]">
                <p className="font-semibold text-muted-foreground">🔒 {badge.name}</p>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </motion.div>
  );
}

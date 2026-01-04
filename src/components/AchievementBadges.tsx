import { 
  Trophy, 
  Star, 
  GitFork, 
  Users, 
  Code2, 
  Flame, 
  Zap, 
  Crown, 
  Rocket,
  Heart,
  Shield,
  Award,
  Target,
  Sparkles
} from 'lucide-react';
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

export function AchievementBadges({ userData, analysis }: AchievementBadgesProps) {
  const accountAgeDays = Math.floor(
    (Date.now() - new Date(userData.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );
  const accountAgeYears = Math.floor(accountAgeDays / 365);
  const totalStars = analysis.totalStars || 0;
  const totalForks = analysis.totalForks || 0;
  const languageCount = Object.keys(analysis.languages || {}).length;
  const overallScore = analysis.scores?.overall?.score || 0;

  const badges: Badge[] = [
    {
      id: 'rising-star',
      name: 'Rising Star',
      description: 'Earned 10+ stars across repositories',
      icon: <Star className="w-4 h-4" />,
      unlocked: totalStars >= 10,
      color: 'text-terminal-yellow',
      rarity: 'common',
    },
    {
      id: 'star-collector',
      name: 'Star Collector',
      description: 'Earned 100+ stars across repositories',
      icon: <Sparkles className="w-4 h-4" />,
      unlocked: totalStars >= 100,
      color: 'text-terminal-yellow',
      rarity: 'rare',
    },
    {
      id: 'github-celebrity',
      name: 'GitHub Celebrity',
      description: 'Earned 1000+ stars - You\'re famous!',
      icon: <Crown className="w-4 h-4" />,
      unlocked: totalStars >= 1000,
      color: 'text-terminal-yellow',
      rarity: 'legendary',
    },
    {
      id: 'community-builder',
      name: 'Community Builder',
      description: 'Have 50+ followers',
      icon: <Users className="w-4 h-4" />,
      unlocked: userData.followers >= 50,
      color: 'text-terminal-cyan',
      rarity: 'rare',
    },
    {
      id: 'influencer',
      name: 'Influencer',
      description: 'Have 500+ followers',
      icon: <Heart className="w-4 h-4" />,
      unlocked: userData.followers >= 500,
      color: 'text-terminal-red',
      rarity: 'epic',
    },
    {
      id: 'polyglot',
      name: 'Polyglot',
      description: 'Use 5+ programming languages',
      icon: <Code2 className="w-4 h-4" />,
      unlocked: languageCount >= 5,
      color: 'text-accent',
      rarity: 'rare',
    },
    {
      id: 'language-master',
      name: 'Language Master',
      description: 'Use 10+ programming languages',
      icon: <Zap className="w-4 h-4" />,
      unlocked: languageCount >= 10,
      color: 'text-terminal-purple',
      rarity: 'epic',
    },
    {
      id: 'prolific',
      name: 'Prolific Coder',
      description: 'Created 20+ public repositories',
      icon: <Rocket className="w-4 h-4" />,
      unlocked: userData.public_repos >= 20,
      color: 'text-terminal-green',
      rarity: 'common',
    },
    {
      id: 'repo-master',
      name: 'Repository Master',
      description: 'Created 50+ public repositories',
      icon: <Shield className="w-4 h-4" />,
      unlocked: userData.public_repos >= 50,
      color: 'text-terminal-cyan',
      rarity: 'rare',
    },
    {
      id: 'veteran',
      name: 'GitHub Veteran',
      description: 'Account older than 3 years',
      icon: <Trophy className="w-4 h-4" />,
      unlocked: accountAgeYears >= 3,
      color: 'text-terminal-yellow',
      rarity: 'common',
    },
    {
      id: 'og',
      name: 'OG Developer',
      description: 'Account older than 7 years',
      icon: <Award className="w-4 h-4" />,
      unlocked: accountAgeYears >= 7,
      color: 'text-terminal-yellow',
      rarity: 'epic',
    },
    {
      id: 'forker',
      name: 'Open Source Contributor',
      description: 'Projects have been forked 10+ times',
      icon: <GitFork className="w-4 h-4" />,
      unlocked: totalForks >= 10,
      color: 'text-terminal-cyan',
      rarity: 'rare',
    },
    {
      id: 'top-performer',
      name: 'Top Performer',
      description: 'Overall score of 70+',
      icon: <Target className="w-4 h-4" />,
      unlocked: overallScore >= 70,
      color: 'text-terminal-green',
      rarity: 'rare',
    },
    {
      id: 'elite',
      name: 'Elite Developer',
      description: 'Overall score of 85+',
      icon: <Flame className="w-4 h-4" />,
      unlocked: overallScore >= 85,
      color: 'text-terminal-red',
      rarity: 'legendary',
    },
  ];

  const unlockedBadges = badges.filter(b => b.unlocked);
  const lockedBadges = badges.filter(b => !b.unlocked);

  return (
    <div className="score-card">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <Trophy className="w-5 h-5 text-terminal-yellow" />
        <h3 className="font-semibold text-foreground">Achievements</h3>
        <span className="ml-auto text-xs text-muted-foreground">
          {unlockedBadges.length}/{badges.length} unlocked
        </span>
      </div>

      <TooltipProvider>
        <div className="grid grid-cols-7 gap-2">
          {unlockedBadges.map((badge) => (
            <Tooltip key={badge.id}>
              <TooltipTrigger>
                <div
                  className={`aspect-square rounded-lg border-2 ${rarityColors[badge.rarity]} ${rarityGlow[badge.rarity]} flex items-center justify-center transition-transform hover:scale-110 cursor-pointer`}
                >
                  <span className={badge.color}>{badge.icon}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[200px]">
                <p className="font-semibold">{badge.name}</p>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
                <p className={`text-xs capitalize mt-1 ${
                  badge.rarity === 'legendary' ? 'text-terminal-yellow' :
                  badge.rarity === 'epic' ? 'text-accent' :
                  badge.rarity === 'rare' ? 'text-terminal-cyan' : 'text-muted-foreground'
                }`}>
                  {badge.rarity}
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
          
          {lockedBadges.map((badge) => (
            <Tooltip key={badge.id}>
              <TooltipTrigger>
                <div className="aspect-square rounded-lg border-2 border-muted/30 bg-muted/20 flex items-center justify-center opacity-30 cursor-pointer">
                  <span className="text-muted-foreground">{badge.icon}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[200px]">
                <p className="font-semibold text-muted-foreground">🔒 {badge.name}</p>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      {unlockedBadges.length === 0 && (
        <p className="text-center text-muted-foreground text-sm mt-4">
          No achievements unlocked yet. Keep coding! 💪
        </p>
      )}
    </div>
  );
}

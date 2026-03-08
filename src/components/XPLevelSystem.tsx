import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Star, Shield, Crown } from 'lucide-react';

interface XPLevelSystemProps {
  scores: any;
  totalStars: number;
  totalRepos: number;
  followers: number;
  currentStreak: number;
  languages: Record<string, number>;
}

interface Level {
  level: number;
  title: string;
  minXP: number;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

const levels: Level[] = [
  { level: 1, title: 'Newbie', minXP: 0, icon: <Zap className="w-4 h-4" />, color: 'hsl(var(--muted-foreground))', gradient: 'from-muted to-muted-foreground' },
  { level: 2, title: 'Apprentice', minXP: 500, icon: <Zap className="w-4 h-4" />, color: 'hsl(var(--terminal-green))', gradient: 'from-terminal-green/60 to-terminal-green' },
  { level: 3, title: 'Coder', minXP: 1500, icon: <Star className="w-4 h-4" />, color: 'hsl(var(--terminal-cyan))', gradient: 'from-terminal-cyan/60 to-terminal-cyan' },
  { level: 4, title: 'Developer', minXP: 3000, icon: <Star className="w-4 h-4" />, color: 'hsl(var(--secondary))', gradient: 'from-secondary/60 to-secondary' },
  { level: 5, title: 'Engineer', minXP: 5000, icon: <Shield className="w-4 h-4" />, color: 'hsl(var(--primary))', gradient: 'from-primary/60 to-primary' },
  { level: 6, title: 'Architect', minXP: 8000, icon: <Shield className="w-4 h-4" />, color: 'hsl(var(--accent))', gradient: 'from-accent/60 to-accent' },
  { level: 7, title: 'Master', minXP: 12000, icon: <Crown className="w-4 h-4" />, color: 'hsl(var(--terminal-yellow))', gradient: 'from-terminal-yellow/60 to-terminal-yellow' },
  { level: 8, title: 'Grandmaster', minXP: 18000, icon: <Crown className="w-4 h-4" />, color: 'hsl(var(--terminal-red))', gradient: 'from-terminal-red/60 to-destructive' },
  { level: 9, title: 'Legend', minXP: 25000, icon: <Trophy className="w-4 h-4" />, color: 'hsl(var(--terminal-purple))', gradient: 'from-terminal-purple/60 to-terminal-purple' },
  { level: 10, title: 'Mythical', minXP: 35000, icon: <Trophy className="w-4 h-4" />, color: 'hsl(var(--primary))', gradient: 'from-primary via-secondary to-accent' },
];

export function XPLevelSystem({ scores, totalStars, totalRepos, followers, currentStreak, languages }: XPLevelSystemProps) {
  const { totalXP, breakdown, currentLevel, nextLevel, progress } = useMemo(() => {
    const breakdown = [
      { label: 'Overall Score', xp: (scores?.overall?.score || 0) * 100, icon: '🎯' },
      { label: 'Stars Earned', xp: Math.min(totalStars * 2, 8000), icon: '⭐' },
      { label: 'Repos Created', xp: Math.min(totalRepos * 30, 5000), icon: '📦' },
      { label: 'Followers', xp: Math.min(followers * 5, 6000), icon: '👥' },
      { label: 'Streak Bonus', xp: currentStreak * 50, icon: '🔥' },
      { label: 'Language Mastery', xp: Object.keys(languages).length * 200, icon: '💻' },
      { label: 'Activity Score', xp: (scores?.activity?.score || 0) * 50, icon: '⚡' },
      { label: 'Code Quality', xp: (scores?.codeQuality?.score || 0) * 40, icon: '🛡️' },
    ];

    const totalXP = breakdown.reduce((s, b) => s + b.xp, 0);

    let currentLevel = levels[0];
    let nextLevel: Level | null = levels[1];

    for (let i = levels.length - 1; i >= 0; i--) {
      if (totalXP >= levels[i].minXP) {
        currentLevel = levels[i];
        nextLevel = levels[i + 1] || null;
        break;
      }
    }

    const progress = nextLevel
      ? ((totalXP - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100
      : 100;

    return { totalXP, breakdown, currentLevel, nextLevel, progress };
  }, [scores, totalStars, totalRepos, followers, currentStreak, languages]);

  return (
    <div className="score-card">
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
        <Trophy className="w-5 h-5 text-terminal-yellow" />
        <h3 className="font-semibold text-foreground">Developer XP</h3>
        <span className="ml-auto text-xs font-mono font-bold text-primary">
          {totalXP.toLocaleString()} XP
        </span>
      </div>

      {/* Level badge */}
      <div className="flex items-center gap-4 mb-6">
        <motion.div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentLevel.gradient} flex items-center justify-center shadow-lg`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <span className="text-2xl font-black text-primary-foreground">{currentLevel.level}</span>
        </motion.div>
        <div>
          <motion.div
            className="text-xl font-bold text-foreground"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {currentLevel.title}
          </motion.div>
          <p className="text-xs text-muted-foreground">
            Level {currentLevel.level} / 10
            {nextLevel && ` • ${(nextLevel.minXP - totalXP).toLocaleString()} XP to ${nextLevel.title}`}
          </p>
        </div>
      </div>

      {/* XP progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5">
          <span>Lv.{currentLevel.level} {currentLevel.title}</span>
          {nextLevel && <span>Lv.{nextLevel.level} {nextLevel.title}</span>}
        </div>
        <div className="h-3 rounded-full bg-muted overflow-hidden relative">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${currentLevel.gradient} relative`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
          </motion.div>
          {/* Level markers */}
          {nextLevel && levels.slice(currentLevel.level, currentLevel.level + 1).map((l) => (
            <div
              key={l.level}
              className="absolute top-0 bottom-0 w-px bg-border"
              style={{ left: '100%' }}
            />
          ))}
        </div>
      </div>

      {/* XP Breakdown */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-medium mb-2">XP Sources</p>
        {breakdown
          .sort((a, b) => b.xp - a.xp)
          .map((item, i) => (
          <motion.div
            key={item.label}
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
          >
            <span className="text-sm">{item.icon}</span>
            <span className="text-xs text-muted-foreground flex-1">{item.label}</span>
            <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary/60"
                initial={{ width: 0 }}
                animate={{ width: `${(item.xp / Math.max(...breakdown.map(b => b.xp), 1)) * 100}%` }}
                transition={{ delay: 0.5 + i * 0.05, duration: 0.8 }}
              />
            </div>
            <span className="text-[10px] font-mono text-primary w-12 text-right">+{item.xp.toLocaleString()}</span>
          </motion.div>
        ))}
      </div>

      {/* Level preview row */}
      <div className="mt-5 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground mb-2">All Levels</p>
        <div className="flex gap-1">
          {levels.map((l) => (
            <motion.div
              key={l.level}
              className={`flex-1 h-6 rounded-md flex items-center justify-center text-[9px] font-bold transition-all ${
                l.level <= currentLevel.level
                  ? `bg-gradient-to-br ${l.gradient} text-primary-foreground`
                  : 'bg-muted text-muted-foreground'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + l.level * 0.05 }}
              title={`Lv.${l.level} ${l.title} (${l.minXP.toLocaleString()} XP)`}
            >
              {l.level}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

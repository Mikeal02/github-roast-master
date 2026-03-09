import { useRef, useState } from 'react';
import { Flame, Zap, Calendar, TrendingUp, Sun, Moon, BarChart3, Trophy, Target } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { AnimatedCounter } from './AnimatedCounter';

interface CodingStreaksProps {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  peakCodingHour?: string;
  totalEvents?: number;
  weekendRatio?: number;
  eventsPerActiveDay?: number;
  peakCodingDay?: string;
}

const getStreakTier = (streak: number) => {
  if (streak >= 30) return { label: 'Inferno 🔥', color: 'text-terminal-red' };
  if (streak >= 14) return { label: 'On Fire', color: 'text-terminal-yellow' };
  if (streak >= 7) return { label: 'Heating Up', color: 'text-terminal-cyan' };
  if (streak >= 3) return { label: 'Warming Up', color: 'text-terminal-green' };
  if (streak >= 1) return { label: 'Started', color: 'text-muted-foreground' };
  return { label: 'Cold', color: 'text-muted-foreground' };
};

export function CodingStreaks({ currentStreak, longestStreak, totalActiveDays, peakCodingHour, totalEvents, weekendRatio, eventsPerActiveDay, peakCodingDay }: CodingStreaksProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const currentTier = getStreakTier(currentStreak);
  const longestTier = getStreakTier(longestStreak);
  
  // Streak progress to next tier
  const nextMilestone = currentStreak >= 30 ? 60 : currentStreak >= 14 ? 30 : currentStreak >= 7 ? 14 : currentStreak >= 3 ? 7 : 3;
  const streakProgress = Math.min((currentStreak / nextMilestone) * 100, 100);

  // Consistency score (active days vs possible days in 90-day window)
  const consistencyScore = Math.round((totalActiveDays / 90) * 100);

  return (
    <div ref={ref} className="score-card">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <Flame className="w-5 h-5 text-terminal-red" />
        <h3 className="font-semibold text-foreground">Coding Streaks</h3>
        {totalEvents !== undefined && (
          <span className="ml-auto text-xs text-muted-foreground">{totalEvents} total events</span>
        )}
      </div>

      {/* Main streak cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Current streak - hero card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`p-4 rounded-xl border ${
            currentStreak > 0 
              ? 'bg-terminal-red/5 border-terminal-red/20 shadow-[0_0_30px_hsl(var(--terminal-red)/0.1)]' 
              : 'bg-muted/30 border-border/50'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <motion.div
              animate={currentStreak > 0 ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Flame className={`w-6 h-6 ${currentStreak > 0 ? 'text-terminal-red' : 'text-muted-foreground'}`} />
            </motion.div>
            <span className={`text-[10px] font-bold ${currentTier.color}`}>{currentTier.label}</span>
          </div>
          <p className={`text-3xl font-bold font-mono ${currentStreak > 0 ? 'text-terminal-red' : 'text-muted-foreground'}`}>
            <AnimatedCounter value={currentStreak} />
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Current Streak (days)</p>
          
          {/* Progress to next tier */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-[9px] text-muted-foreground mb-1">
              <span>Next: {nextMilestone}d</span>
              <span>{Math.round(streakProgress)}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-terminal-red/60 to-terminal-red"
                initial={{ width: 0 }}
                animate={isInView ? { width: `${streakProgress}%` } : {}}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Longest streak */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="p-4 rounded-xl border bg-terminal-yellow/5 border-terminal-yellow/20 shadow-[0_0_30px_hsl(var(--terminal-yellow)/0.08)]"
        >
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-6 h-6 text-terminal-yellow" />
            <span className={`text-[10px] font-bold ${longestTier.color}`}>{longestTier.label}</span>
          </div>
          <p className="text-3xl font-bold font-mono text-terminal-yellow">
            <AnimatedCounter value={longestStreak} />
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Longest Streak (days)</p>
          
          {/* Comparison */}
          <div className="mt-3 flex items-center gap-1 text-[9px]">
            {currentStreak > 0 && longestStreak > 0 && (
              <span className={currentStreak >= longestStreak ? 'text-terminal-green' : 'text-muted-foreground'}>
                {currentStreak >= longestStreak ? '🏆 New record!' : `${Math.round((currentStreak / longestStreak) * 100)}% of best`}
              </span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
        {[
          { icon: <Calendar className="w-4 h-4" />, label: 'Active Days', value: `${totalActiveDays}`, color: 'text-terminal-green', bg: 'bg-terminal-green/10 border-terminal-green/20' },
          { icon: <Zap className="w-4 h-4" />, label: 'Peak Hour', value: peakCodingHour || 'N/A', color: 'text-terminal-cyan', bg: 'bg-terminal-cyan/10 border-terminal-cyan/20' },
          { icon: <Sun className="w-4 h-4" />, label: 'Peak Day', value: peakCodingDay || 'N/A', color: 'text-terminal-purple', bg: 'bg-terminal-purple/10 border-terminal-purple/20' },
          ...(eventsPerActiveDay !== undefined ? [{ icon: <BarChart3 className="w-4 h-4" />, label: 'Evt/Day', value: `${eventsPerActiveDay}`, color: 'text-primary', bg: 'bg-primary/10 border-primary/20' }] : []),
          ...(weekendRatio !== undefined ? [{ icon: <Moon className="w-4 h-4" />, label: 'Weekend', value: `${weekendRatio}%`, color: weekendRatio > 30 ? 'text-terminal-yellow' : 'text-terminal-green', bg: weekendRatio > 30 ? 'bg-terminal-yellow/10 border-terminal-yellow/20' : 'bg-terminal-green/10 border-terminal-green/20' }] : []),
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 + index * 0.08 }}
            className={`p-2 rounded-lg border ${item.bg} text-center`}
          >
            <div className={`flex justify-center mb-1 ${item.color}`}>{item.icon}</div>
            <p className={`text-sm font-bold font-mono ${item.color}`}>{item.value}</p>
            <p className="text-[8px] text-muted-foreground">{item.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Consistency meter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.6 }}
        className="mt-3 pt-3 border-t border-border/50 flex items-center gap-3"
      >
        <Target className="w-4 h-4 text-muted-foreground shrink-0" />
        <div className="flex-1">
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-muted-foreground">90-Day Consistency</span>
            <span className={`font-bold font-mono ${consistencyScore >= 50 ? 'text-terminal-green' : consistencyScore >= 20 ? 'text-terminal-yellow' : 'text-terminal-red'}`}>
              {consistencyScore}%
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${consistencyScore >= 50 ? 'bg-terminal-green' : consistencyScore >= 20 ? 'bg-terminal-yellow' : 'bg-terminal-red'}`}
              initial={{ width: 0 }}
              animate={isInView ? { width: `${consistencyScore}%` } : {}}
              transition={{ delay: 0.8, duration: 1 }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

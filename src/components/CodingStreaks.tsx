import { useRef } from 'react';
import { Flame, Zap, Calendar, TrendingUp, Sun, Moon, BarChart3 } from 'lucide-react';
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

export function CodingStreaks({ currentStreak, longestStreak, totalActiveDays, peakCodingHour, totalEvents, weekendRatio, eventsPerActiveDay, peakCodingDay }: CodingStreaksProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const streakItems = [
    {
      icon: <Flame className="w-5 h-5" />,
      label: 'Current Streak',
      value: currentStreak,
      suffix: ` day${currentStreak !== 1 ? 's' : ''}`,
      color: currentStreak > 0 ? 'text-terminal-red' : 'text-muted-foreground',
      bgColor: currentStreak > 0 ? 'bg-terminal-red/10 border-terminal-red/30' : 'bg-muted/30 border-border/50',
      glow: currentStreak > 0 ? 'shadow-[0_0_20px_hsl(var(--terminal-red)/0.15)]' : '',
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Longest Streak',
      value: longestStreak,
      suffix: ` day${longestStreak !== 1 ? 's' : ''}`,
      color: 'text-terminal-yellow',
      bgColor: 'bg-terminal-yellow/10 border-terminal-yellow/30',
      glow: 'shadow-[0_0_20px_hsl(var(--terminal-yellow)/0.15)]',
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: 'Active Days',
      value: totalActiveDays,
      suffix: ' days',
      color: 'text-terminal-green',
      bgColor: 'bg-terminal-green/10 border-terminal-green/30',
      glow: 'shadow-[0_0_20px_hsl(var(--terminal-green)/0.15)]',
    },
    {
      icon: <Zap className="w-5 h-5" />,
      label: 'Peak Hour',
      value: null,
      displayValue: peakCodingHour || 'N/A',
      color: 'text-terminal-cyan',
      bgColor: 'bg-terminal-cyan/10 border-terminal-cyan/30',
      glow: 'shadow-[0_0_20px_hsl(var(--terminal-cyan)/0.15)]',
    },
  ];

  const extendedItems = [
    ...(peakCodingDay ? [{
      icon: <Sun className="w-4 h-4" />,
      label: 'Peak Day',
      displayValue: peakCodingDay,
      color: 'text-terminal-purple',
      bgColor: 'bg-terminal-purple/10 border-terminal-purple/30',
    }] : []),
    ...(eventsPerActiveDay !== undefined ? [{
      icon: <BarChart3 className="w-4 h-4" />,
      label: 'Events/Active Day',
      displayValue: `${eventsPerActiveDay}`,
      color: 'text-primary',
      bgColor: 'bg-primary/10 border-primary/30',
    }] : []),
    ...(weekendRatio !== undefined ? [{
      icon: <Moon className="w-4 h-4" />,
      label: 'Weekend Coding',
      displayValue: `${weekendRatio}%`,
      color: weekendRatio > 30 ? 'text-terminal-yellow' : 'text-terminal-green',
      bgColor: weekendRatio > 30 ? 'bg-terminal-yellow/10 border-terminal-yellow/30' : 'bg-terminal-green/10 border-terminal-green/30',
    }] : []),
  ];

  return (
    <div ref={ref} className="score-card">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <Flame className="w-5 h-5 text-terminal-red" />
        <h3 className="font-semibold text-foreground">Coding Streaks</h3>
        {totalEvents !== undefined && (
          <span className="ml-auto text-xs text-muted-foreground">{totalEvents} total events</span>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {streakItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            className={`p-3 rounded-lg border ${item.bgColor} ${item.glow} text-center`}
          >
            <motion.div
              className={`flex justify-center mb-2 ${item.color}`}
              animate={isInView && item.value && item.value > 0 ? { rotate: [0, -5, 5, 0] } : {}}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
            >
              {item.icon}
            </motion.div>
            <p className={`text-lg font-bold font-mono ${item.color}`}>
              {item.value !== null ? (
                <>
                  <AnimatedCounter value={item.value} />
                  {item.suffix}
                </>
              ) : (
                item.displayValue
              )}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">{item.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Extended metrics row */}
      {extendedItems.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-3">
          {extendedItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 + index * 0.1 }}
              className={`p-2 rounded-lg border ${item.bgColor} text-center`}
            >
              <div className={`flex justify-center mb-1 ${item.color}`}>{item.icon}</div>
              <p className={`text-sm font-bold font-mono ${item.color}`}>{item.displayValue}</p>
              <p className="text-[9px] text-muted-foreground">{item.label}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

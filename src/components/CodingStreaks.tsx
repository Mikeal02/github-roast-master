import { Flame, Zap, Calendar, TrendingUp } from 'lucide-react';

interface CodingStreaksProps {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  peakCodingHour?: string;
  totalEvents?: number;
}

export function CodingStreaks({ currentStreak, longestStreak, totalActiveDays, peakCodingHour, totalEvents }: CodingStreaksProps) {
  const streakItems = [
    {
      icon: <Flame className="w-5 h-5" />,
      label: 'Current Streak',
      value: `${currentStreak} day${currentStreak !== 1 ? 's' : ''}`,
      color: currentStreak > 0 ? 'text-terminal-red' : 'text-muted-foreground',
      bgColor: currentStreak > 0 ? 'bg-terminal-red/10 border-terminal-red/30' : 'bg-muted/30 border-border/50',
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Longest Streak',
      value: `${longestStreak} day${longestStreak !== 1 ? 's' : ''}`,
      color: 'text-terminal-yellow',
      bgColor: 'bg-terminal-yellow/10 border-terminal-yellow/30',
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: 'Active Days',
      value: `${totalActiveDays} days`,
      color: 'text-terminal-green',
      bgColor: 'bg-terminal-green/10 border-terminal-green/30',
    },
    {
      icon: <Zap className="w-5 h-5" />,
      label: 'Peak Hour',
      value: peakCodingHour || 'N/A',
      color: 'text-terminal-cyan',
      bgColor: 'bg-terminal-cyan/10 border-terminal-cyan/30',
    },
  ];

  return (
    <div className="score-card">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <Flame className="w-5 h-5 text-terminal-red" />
        <h3 className="font-semibold text-foreground">Coding Streaks</h3>
        {totalEvents !== undefined && (
          <span className="ml-auto text-xs text-muted-foreground">{totalEvents} total events</span>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {streakItems.map((item) => (
          <div key={item.label} className={`p-3 rounded-lg border ${item.bgColor} text-center`}>
            <div className={`flex justify-center mb-2 ${item.color}`}>{item.icon}</div>
            <p className={`text-lg font-bold font-mono ${item.color}`}>{item.value}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

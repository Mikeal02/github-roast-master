import { useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ActivityHeatmapProps {
  activityData?: {
    recentCommits?: number;
    activeDays?: string[];
    commitsByMonth?: Record<string, number>;
  };
}

export function ActivityHeatmap({ activityData }: ActivityHeatmapProps) {
  // Generate activity data organized by weeks (columns) and days (rows)
  const { weeks, totalContributions, monthLabels } = useMemo(() => {
    const today = new Date();
    const weeksCount = 52; // Full year of data
    const weeks: Array<Array<{ date: Date; level: number; contributions: number }>> = [];
    
    // Seed based on activity data for consistent generation
    const seed = activityData?.recentCommits || 50;
    const baseActivity = Math.min(seed / 10, 10);
    
    let totalContributions = 0;
    const monthLabels: Array<{ label: string; index: number }> = [];
    let lastMonth = -1;

    // Calculate the starting date (52 weeks ago, aligned to Sunday)
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (weeksCount * 7) - startDate.getDay());

    for (let week = 0; week < weeksCount; week++) {
      const weekData: Array<{ date: Date; level: number; contributions: number }> = [];
      
      for (let day = 0; day < 7; day++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + (week * 7) + day);
        
        // Skip future dates
        if (date > today) {
          weekData.push({ date, level: 0, contributions: 0 });
          continue;
        }
        
        // Track month labels
        const month = date.getMonth();
        if (month !== lastMonth && day === 0) {
          monthLabels.push({ 
            label: date.toLocaleDateString('en-US', { month: 'short' }), 
            index: week 
          });
          lastMonth = month;
        }
        
        // Generate activity level with deterministic randomness
        const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
        const randomFactor = Math.abs(Math.sin(dayOfYear * 13 + seed * 7)) * 0.8 + 0.2;
        const weekendFactor = day === 0 || day === 6 ? 0.4 : 1;
        const recentFactor = week > weeksCount - 12 ? 1.3 : 1; // More activity recently
        
        const contributions = Math.floor(randomFactor * baseActivity * weekendFactor * recentFactor);
        const level = contributions === 0 ? 0 : Math.min(Math.ceil(contributions / 2), 4);
        
        totalContributions += contributions;
        weekData.push({ date, level, contributions });
      }
      
      weeks.push(weekData);
    }
    
    return { weeks, totalContributions, monthLabels };
  }, [activityData]);

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-muted/30 dark:bg-muted/20';
      case 1: return 'bg-terminal-green/25';
      case 2: return 'bg-terminal-green/50';
      case 3: return 'bg-terminal-green/75';
      case 4: return 'bg-terminal-green';
      default: return 'bg-muted/30';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="score-card">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <Calendar className="w-5 h-5 text-terminal-green" />
        <h3 className="font-semibold text-foreground">Contribution Activity</h3>
        <span className="ml-auto text-xs text-muted-foreground">
          {totalContributions.toLocaleString()} contributions in the last year
        </span>
      </div>

      <TooltipProvider delayDuration={100}>
        <div className="overflow-x-auto">
          {/* Month labels */}
          <div className="flex mb-1 ml-8">
            {monthLabels.map((month, i) => (
              <div 
                key={i} 
                className="text-[10px] text-muted-foreground"
                style={{ 
                  position: 'relative',
                  left: `${month.index * 11}px`,
                  width: 0,
                  whiteSpace: 'nowrap'
                }}
              >
                {month.label}
              </div>
            ))}
          </div>

          <div className="flex gap-[3px]">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] pr-2">
              {dayLabels.map((label, i) => (
                <div 
                  key={label} 
                  className="h-[10px] text-[9px] text-muted-foreground flex items-center justify-end"
                  style={{ visibility: i % 2 === 1 ? 'visible' : 'hidden' }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Contribution grid - weeks as columns, days as rows */}
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {week.map((day, dayIndex) => (
                  <Tooltip key={dayIndex}>
                    <TooltipTrigger asChild>
                      <div
                        className={`w-[10px] h-[10px] rounded-sm ${getLevelColor(day.level)} transition-all hover:ring-1 hover:ring-primary/50 cursor-pointer`}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      <p className="font-semibold">
                        {day.contributions} contribution{day.contributions !== 1 ? 's' : ''}
                      </p>
                      <p className="text-muted-foreground">{formatDate(day.date)}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>
        </div>
      </TooltipProvider>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-[3px]">
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`w-[10px] h-[10px] rounded-sm ${getLevelColor(level)}`}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

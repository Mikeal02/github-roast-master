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
  // Generate simulated activity data based on the provided analysis
  const cells = useMemo(() => {
    const today = new Date();
    const cells = [];
    const weeks = 12; // 12 weeks of data
    const daysPerWeek = 7;
    
    // Seed based on activity data for consistent generation
    const seed = activityData?.recentCommits || 50;
    const baseActivity = Math.min(seed / 10, 10);
    
    for (let week = 0; week < weeks; week++) {
      for (let day = 0; day < daysPerWeek; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (weeks - week - 1) * 7 - (6 - day));
        
        // Generate activity level with some randomness but influenced by baseActivity
        const randomFactor = Math.sin(week * 13 + day * 7 + seed) * 0.5 + 0.5;
        const weekendFactor = day === 0 || day === 6 ? 0.5 : 1;
        const activityLevel = Math.floor(randomFactor * baseActivity * weekendFactor);
        
        cells.push({
          date,
          level: Math.min(activityLevel, 4),
          contributions: activityLevel * Math.floor(Math.random() * 3 + 1),
        });
      }
    }
    
    return cells;
  }, [activityData]);

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-muted/50';
      case 1: return 'bg-terminal-green/20';
      case 2: return 'bg-terminal-green/40';
      case 3: return 'bg-terminal-green/70';
      case 4: return 'bg-terminal-green';
      default: return 'bg-muted/50';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const weekLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const totalContributions = cells.reduce((sum, cell) => sum + cell.contributions, 0);

  return (
    <div className="score-card">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <Calendar className="w-5 h-5 text-terminal-green" />
        <h3 className="font-semibold text-foreground">Activity Overview</h3>
        <span className="ml-auto text-xs text-muted-foreground">
          {totalContributions} contributions in last 12 weeks
        </span>
      </div>

      <TooltipProvider>
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-1 text-[10px] text-muted-foreground">
            {weekLabels.map((label, i) => (
              <div key={label} className="h-3 flex items-center justify-end pr-1" style={{ display: i % 2 === 1 ? 'flex' : 'none' }}>
                {label}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-x-auto">
            <div className="grid gap-1" style={{ 
              gridTemplateColumns: `repeat(12, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(7, minmax(0, 1fr))`
            }}>
              {cells.map((cell, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div
                      className={`aspect-square rounded-sm ${getLevelColor(cell.level)} transition-all hover:ring-1 hover:ring-primary cursor-pointer min-h-[12px]`}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-semibold">{cell.contributions} contributions</p>
                    <p className="text-xs text-muted-foreground">{formatDate(cell.date)}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
      </TooltipProvider>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-3 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`w-3 h-3 rounded-sm ${getLevelColor(level)}`}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

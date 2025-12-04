import { Flame, Moon, Ghost } from 'lucide-react';

export function ActivityBadge({ status, finalScore }) {
  const getConfig = () => {
    if (status.includes('Active') && !status.includes('Semi')) {
      return {
        icon: <Flame className="w-5 h-5" />,
        bgClass: 'bg-terminal-green/20 border-terminal-green/50',
        textClass: 'text-terminal-green',
        label: 'Active Developer',
      };
    }
    if (status.includes('Semi')) {
      return {
        icon: <Moon className="w-5 h-5" />,
        bgClass: 'bg-terminal-yellow/20 border-terminal-yellow/50',
        textClass: 'text-terminal-yellow',
        label: 'Semi-Active',
      };
    }
    return {
      icon: <Ghost className="w-5 h-5" />,
      bgClass: 'bg-terminal-red/20 border-terminal-red/50',
      textClass: 'text-terminal-red',
      label: 'Ghost Mode',
    };
  };

  const config = getConfig();

  return (
    <div className="score-card flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg border ${config.bgClass}`}>
          <span className={config.textClass}>{config.icon}</span>
        </div>
        <div>
          <div className={`font-semibold ${config.textClass}`}>
            {config.label}
          </div>
          <div className="text-xs text-muted-foreground">
            Developer Status
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <div className="text-3xl font-bold font-mono text-gradient">
          {finalScore}
        </div>
        <div className="text-xs text-muted-foreground">
          Overall Score
        </div>
      </div>
    </div>
  );
}

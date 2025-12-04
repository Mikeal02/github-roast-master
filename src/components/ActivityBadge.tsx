import { Flame, Moon, Ghost } from 'lucide-react';
import { getSeverityLabel } from '@/lib/roastGenerator';
import { DeveloperArchetype } from './DeveloperArchetype';

export function ActivityBadge({ status, finalScore, archetype = null, isRecruiterMode = false }) {
  const getConfig = () => {
    if (status.includes('Active') && !status.includes('Semi')) {
      return {
        icon: <Flame className="w-5 h-5" />,
        bgClass: 'bg-terminal-green/20 border-terminal-green/50',
        textClass: 'text-terminal-green',
        label: isRecruiterMode ? 'Active Contributor' : 'Active Developer',
      };
    }
    if (status.includes('Semi')) {
      return {
        icon: <Moon className="w-5 h-5" />,
        bgClass: 'bg-terminal-yellow/20 border-terminal-yellow/50',
        textClass: 'text-terminal-yellow',
        label: isRecruiterMode ? 'Moderate Activity' : 'Semi-Active',
      };
    }
    return {
      icon: <Ghost className="w-5 h-5" />,
      bgClass: 'bg-terminal-red/20 border-terminal-red/50',
      textClass: 'text-terminal-red',
      label: isRecruiterMode ? 'Limited Activity' : 'Ghost Mode',
    };
  };

  const config = getConfig();
  const severity = getSeverityLabel(finalScore);

  return (
    <div className="score-card">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg border ${config.bgClass}`}>
            <span className={config.textClass}>{config.icon}</span>
          </div>
          <div>
            <div className={`font-semibold ${config.textClass}`}>
              {config.label}
            </div>
            <div className="text-xs text-muted-foreground">
              {isRecruiterMode ? 'Engagement Level' : 'Developer Status'}
            </div>
          </div>
        </div>
        
        {archetype && !isRecruiterMode && (
          <DeveloperArchetype archetype={archetype} />
        )}
        
        <div className="text-right">
          <div className="text-3xl font-bold font-mono text-gradient">
            {finalScore}
          </div>
          <div className={`text-xs font-semibold ${severity.color}`}>
            {severity.label}
          </div>
          <div className="text-xs text-muted-foreground">
            {isRecruiterMode ? 'Profile Score' : 'Overall Score'}
          </div>
        </div>
      </div>
    </div>
  );
}

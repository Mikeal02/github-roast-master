import { Flame, Moon, Ghost, TrendingUp, BarChart3, Award } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { getSeverityLabel } from '@/lib/roastGenerator';
import { DeveloperArchetype } from './DeveloperArchetype';

export function ActivityBadge({ status, finalScore, archetype = null, isRecruiterMode = false }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const getConfig = () => {
    if (status.includes('Active') && !status.includes('Semi')) {
      return {
        icon: <Flame className="w-5 h-5" />,
        bgClass: 'bg-terminal-green/20 border-terminal-green/50',
        textClass: 'text-terminal-green',
        label: isRecruiterMode ? 'Active Contributor' : 'Active Developer',
        ringColor: 'hsl(var(--terminal-green))',
      };
    }
    if (status.includes('Semi')) {
      return {
        icon: <Moon className="w-5 h-5" />,
        bgClass: 'bg-terminal-yellow/20 border-terminal-yellow/50',
        textClass: 'text-terminal-yellow',
        label: isRecruiterMode ? 'Moderate Activity' : 'Semi-Active',
        ringColor: 'hsl(var(--terminal-yellow))',
      };
    }
    return {
      icon: <Ghost className="w-5 h-5" />,
      bgClass: 'bg-terminal-red/20 border-terminal-red/50',
      textClass: 'text-terminal-red',
      label: isRecruiterMode ? 'Limited Activity' : 'Ghost Mode',
      ringColor: 'hsl(var(--terminal-red))',
    };
  };

  const config = getConfig();
  const severity = getSeverityLabel(finalScore);

  // Percentile
  const percentile = finalScore >= 90 ? 'Top 2%' : finalScore >= 80 ? 'Top 10%' : finalScore >= 70 ? 'Top 25%' : finalScore >= 55 ? 'Top 50%' : finalScore >= 35 ? 'Top 75%' : 'Bottom 25%';

  // Score ring
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (finalScore / 100) * circumference;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="glass-panel p-5"
      style={{ boxShadow: `0 0 40px ${config.ringColor}10` }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <motion.div
            className={`p-2.5 rounded-xl border ${config.bgClass}`}
            animate={isInView ? { scale: [1, 1.1, 1] } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <span className={config.textClass}>{config.icon}</span>
          </motion.div>
          <div>
            <div className={`font-semibold text-lg ${config.textClass}`}>
              {config.label}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              {isRecruiterMode ? 'Engagement Level' : 'Developer Status'}
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted border border-border font-mono">
                {percentile}
              </span>
            </div>
          </div>
        </div>
        
        {archetype && !isRecruiterMode && (
          <DeveloperArchetype archetype={archetype} />
        )}
        
        {/* Score ring */}
        <div className="flex items-center gap-4">
          <div className="relative w-[84px] h-[84px]">
            <svg className="w-[84px] h-[84px] -rotate-90" viewBox="0 0 84 84">
              <circle cx="42" cy="42" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
              <motion.circle
                cx="42" cy="42" r={radius} fill="none"
                stroke={config.ringColor} strokeWidth="4.5" strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={isInView ? { strokeDashoffset: offset } : {}}
                transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.circle
                cx="42" cy="42" r={radius} fill="none"
                stroke={config.ringColor} strokeWidth="10" strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={isInView ? { strokeDashoffset: offset } : {}}
                transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                opacity={0.08}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-bold font-mono ${config.textClass}`}>{finalScore}</span>
              <span className="text-[8px] text-muted-foreground">/100</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-sm font-semibold ${severity.color}`}>
              {severity.label}
            </div>
            <div className="text-xs text-muted-foreground">
              {isRecruiterMode ? 'Profile Score' : 'Overall Score'}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

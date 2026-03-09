import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { Zap, Heart, Lightbulb, Shield, TrendingUp, Activity } from 'lucide-react';

interface ImpactMetricsProps {
  impactMetrics?: {
    communityImpact?: number;
    knowledgeSharing?: number;
    innovationIndex?: number;
    reliabilityScore?: number;
    velocityTrend?: string;
  };
  healthMetrics?: {
    workLifeBalance?: number;
    weekendCodingPercent?: number;
    lateNightCodingPercent?: number;
    sustainabilityScore?: number;
    diversificationIndex?: number;
    burnoutWarnings?: string[];
  };
  consistencyScore?: number;
  followRatio?: number;
  reposPerYear?: number;
  starsPerYear?: number;
}

function MetricRing({ value, label, icon, color, delay = 0 }: { value: number; label: string; icon: React.ReactNode; color: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      className="flex flex-col items-center gap-3"
    >
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="5" />
          <motion.circle
            cx="48" cy="48" r={radius} fill="none"
            stroke={color} strokeWidth="5.5" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={isInView ? { strokeDashoffset: offset } : {}}
            transition={{ duration: 1.2, delay: delay + 0.2, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.circle
            cx="48" cy="48" r={radius} fill="none"
            stroke={color} strokeWidth="12" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={isInView ? { strokeDashoffset: offset } : {}}
            transition={{ duration: 1.2, delay: delay + 0.2, ease: [0.16, 1, 0.3, 1] }}
            opacity={0.06}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="mb-0.5" style={{ color }}>{icon}</span>
          <span className="text-xl font-bold font-mono text-foreground">{value}</span>
        </div>
      </div>
      <span className="text-xs font-medium text-muted-foreground text-center">{label}</span>
    </motion.div>
  );
}

function StatBar({ label, value, max = 100, color, delay = 0 }: { label: string; value: number; max?: number; color: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const percent = Math.min(100, (value / max) * 100);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -10 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.4 }}
      className="space-y-1.5"
    >
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-mono font-bold" style={{ color }}>{value}{max === 100 ? '%' : ''}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percent}%` } : {}}
          transition={{ duration: 0.8, delay: delay + 0.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </motion.div>
  );
}

export function ImpactMetrics({ impactMetrics, healthMetrics, consistencyScore, followRatio, reposPerYear, starsPerYear }: ImpactMetricsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const impact = impactMetrics || {};
  const health = healthMetrics || {};

  const velocityColors: Record<string, string> = {
    'Accelerating': 'hsl(var(--terminal-green))',
    'Steady': 'hsl(var(--terminal-cyan))',
    'Decelerating': 'hsl(var(--terminal-yellow))',
    'Sporadic': 'hsl(var(--terminal-red))',
  };

  return (
    <div ref={ref} className="space-y-6">
      {/* Impact Rings */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        className="glass-panel p-6"
      >
        <div className="flex items-center gap-2 mb-6 pb-3 border-b border-border">
          <Zap className="w-5 h-5 text-terminal-yellow" />
          <h3 className="font-semibold text-foreground">Impact Metrics</h3>
          {impact.velocityTrend && (
            <span
              className="ml-auto text-xs px-3 py-1 rounded-full font-medium border"
              style={{
                color: velocityColors[impact.velocityTrend] || 'hsl(var(--muted-foreground))',
                borderColor: velocityColors[impact.velocityTrend] || 'hsl(var(--border))',
                background: `${velocityColors[impact.velocityTrend] || 'hsl(var(--muted))'}15`,
              }}
            >
              <TrendingUp className="w-3 h-3 inline mr-1" />
              {impact.velocityTrend}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
          <MetricRing value={impact.communityImpact || 0} label="Community Impact" icon={<Heart className="w-4 h-4" />} color="hsl(var(--terminal-red))" delay={0} />
          <MetricRing value={impact.knowledgeSharing || 0} label="Knowledge Sharing" icon={<Lightbulb className="w-4 h-4" />} color="hsl(var(--terminal-yellow))" delay={0.1} />
          <MetricRing value={impact.innovationIndex || 0} label="Innovation Index" icon={<Zap className="w-4 h-4" />} color="hsl(var(--terminal-cyan))" delay={0.2} />
          <MetricRing value={impact.reliabilityScore || 0} label="Reliability" icon={<Shield className="w-4 h-4" />} color="hsl(var(--terminal-green))" delay={0.3} />
        </div>
      </motion.div>

      {/* Health & Sustainability */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="glass-panel p-5"
        >
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
            <Activity className="w-5 h-5 text-terminal-green" />
            <h3 className="font-semibold text-foreground text-sm">Health & Sustainability</h3>
          </div>
          <div className="space-y-4">
            <StatBar label="Work-Life Balance" value={health.workLifeBalance || 0} color="hsl(var(--terminal-green))" delay={0.3} />
            <StatBar label="Sustainability" value={health.sustainabilityScore || 0} color="hsl(var(--terminal-cyan))" delay={0.4} />
            <StatBar label="Diversification" value={health.diversificationIndex || 0} color="hsl(var(--accent))" delay={0.5} />
            <StatBar label="Weekend Coding" value={health.weekendCodingPercent || 0} color="hsl(var(--terminal-yellow))" delay={0.6} />
            <StatBar label="Late Night Coding" value={health.lateNightCodingPercent || 0} color="hsl(var(--terminal-purple))" delay={0.7} />
          </div>

          {health.burnoutWarnings && health.burnoutWarnings.length > 0 && (
            <div className="mt-4 pt-3 border-t border-border/50">
              <p className="text-[10px] text-terminal-red font-medium mb-2">⚠️ Burnout Warnings</p>
              {health.burnoutWarnings.map((w, i) => (
                <p key={i} className="text-xs text-muted-foreground mb-1">• {w}</p>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="glass-panel p-5"
        >
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
            <TrendingUp className="w-5 h-5 text-secondary" />
            <h3 className="font-semibold text-foreground text-sm">Growth Velocity</h3>
          </div>
          <div className="space-y-4">
            {consistencyScore !== undefined && (
              <StatBar label="Activity Consistency" value={consistencyScore} color="hsl(var(--primary))" delay={0.3} />
            )}
            {reposPerYear !== undefined && (
              <div className="flex justify-between items-center p-3 rounded-xl bg-muted/30">
                <span className="text-xs text-muted-foreground">Repos/Year</span>
                <span className="text-lg font-bold font-mono text-foreground">{reposPerYear}</span>
              </div>
            )}
            {starsPerYear !== undefined && (
              <div className="flex justify-between items-center p-3 rounded-xl bg-muted/30">
                <span className="text-xs text-muted-foreground">Stars/Year</span>
                <span className="text-lg font-bold font-mono text-primary">{starsPerYear}</span>
              </div>
            )}
            {followRatio !== undefined && (
              <div className="flex justify-between items-center p-3 rounded-xl bg-muted/30">
                <span className="text-xs text-muted-foreground">Follower Ratio</span>
                <span className={`text-lg font-bold font-mono ${followRatio >= 1 ? 'text-terminal-green' : 'text-terminal-yellow'}`}>{followRatio}x</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

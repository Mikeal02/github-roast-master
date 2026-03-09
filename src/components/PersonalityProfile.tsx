import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Brain, Zap, AlertTriangle, BookOpen, Lightbulb, Sparkles, Target, TrendingUp, Heart, Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const getRiskColor = (value: number) => {
  if (value <= 30) return 'text-terminal-green';
  if (value <= 60) return 'text-terminal-yellow';
  return 'text-terminal-red';
};

const getProgressColor = (value: number) => {
  if (value >= 70) return 'bg-terminal-green';
  if (value >= 40) return 'bg-terminal-yellow';
  return 'bg-terminal-red';
};

const getRiskLabel = (value: number) => {
  if (value <= 20) return 'Very Low';
  if (value <= 40) return 'Low';
  if (value <= 60) return 'Moderate';
  if (value <= 80) return 'High';
  return 'Critical';
};

interface PersonalityProfileProps {
  profile: {
    focusType: string;
    procrastinationTendency: number;
    burnoutRisk: number;
    learningStyle: string;
    personalityType: {
      type: string;
      emoji: string;
      description: string;
    };
    peakActivityDay: string;
    metrics: {
      consistency: number;
      exploration: number;
      collaboration: number;
      documentation: number;
    };
    funInsights: string[];
    suggestions: string[];
  };
}

export function PersonalityProfile({ profile }: PersonalityProfileProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Compute personality wellness score
  const wellnessScore = Math.round(
    (100 - (profile.burnoutRisk || 0)) * 0.3 +
    (100 - (profile.procrastinationTendency || 0)) * 0.2 +
    (profile.metrics?.consistency || 0) * 0.2 +
    (profile.metrics?.collaboration || 0) * 0.15 +
    (profile.metrics?.documentation || 0) * 0.15
  );

  const dominantTrait = (() => {
    const m = profile.metrics;
    if (!m) return 'Balanced';
    const traits = [
      { name: 'Consistent', v: m.consistency },
      { name: 'Explorer', v: m.exploration },
      { name: 'Collaborator', v: m.collaboration },
      { name: 'Documenter', v: m.documentation },
    ];
    return traits.sort((a, b) => b.v - a.v)[0].name;
  })();

  return (
    <div ref={ref} className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="glass-panel p-5 font-mono text-sm"
      >
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-primary/20">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Digital Personality Profile</h3>
          <span className="ml-auto text-xs text-muted-foreground font-mono">AI Analysis</span>
        </div>

        {/* Personality Type Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-xl p-5 mb-6 border border-primary/20"
        >
          <div className="flex items-center gap-4">
            <motion.span
              className="text-5xl"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {profile.personalityType?.emoji || '🧠'}
            </motion.span>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-foreground">{profile.personalityType?.type || 'Coder'}</h4>
              <p className="text-sm text-muted-foreground">{profile.personalityType?.description || ''}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {dominantTrait}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                  {profile.focusType}
                </span>
              </div>
            </div>
            <div className="text-center">
              <Heart className={`w-5 h-5 mx-auto mb-1 ${wellnessScore >= 60 ? 'text-terminal-green' : 'text-terminal-yellow'}`} />
              <p className={`text-lg font-bold font-mono ${wellnessScore >= 60 ? 'text-terminal-green' : 'text-terminal-yellow'}`}>{wellnessScore}</p>
              <p className="text-[8px] text-muted-foreground">Wellness</p>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="metrics" className="text-xs">Metrics</TabsTrigger>
            <TabsTrigger value="health" className="text-xs">Health</TabsTrigger>
            <TabsTrigger value="insights" className="text-xs">Fun Insights</TabsTrigger>
            <TabsTrigger value="suggestions" className="text-xs">Growth</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="mt-4 space-y-4">
            {/* Core Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                icon={<Zap className="w-4 h-4" />}
                label="Focus Type"
                value={profile.focusType || 'Unknown'}
                subtext={`Peak: ${profile.peakActivityDay || 'N/A'}s`}
              />
              <MetricCard
                icon={<BookOpen className="w-4 h-4" />}
                label="Learning Style"
                value={profile.learningStyle || 'Unknown'}
                subtext="Based on project patterns"
              />
            </div>

            {/* Progress Bars with enhanced visuals */}
            {profile.metrics && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <Shield className="w-3 h-3" /> Behavioral Metrics
                </h4>
                <AnimatedProgressMetric label="Consistency" value={profile.metrics.consistency || 0} isInView={isInView} delay={0.3} />
                <AnimatedProgressMetric label="Exploration" value={profile.metrics.exploration || 0} isInView={isInView} delay={0.4} />
                <AnimatedProgressMetric label="Collaboration" value={profile.metrics.collaboration || 0} isInView={isInView} delay={0.5} />
                <AnimatedProgressMetric label="Documentation" value={profile.metrics.documentation || 0} isInView={isInView} delay={0.6} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="health" className="mt-4 space-y-4">
            {/* Risk Meters - enhanced */}
            <div className="grid grid-cols-2 gap-4">
              <EnhancedRiskMeter
                label="Procrastination"
                value={profile.procrastinationTendency || 0}
                icon={<Target className="w-4 h-4" />}
                isInView={isInView}
              />
              <EnhancedRiskMeter
                label="Burnout Risk"
                value={profile.burnoutRisk || 0}
                icon={<AlertTriangle className="w-4 h-4" />}
                isInView={isInView}
              />
            </div>

            {/* Wellness Summary */}
            <div className="p-4 bg-muted/20 rounded-xl border border-border/30">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-terminal-green" />
                <h4 className="text-sm font-semibold text-foreground">Wellness Summary</h4>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2 bg-background/50 rounded-lg">
                  <p className={`text-lg font-bold font-mono ${wellnessScore >= 60 ? 'text-terminal-green' : 'text-terminal-yellow'}`}>{wellnessScore}</p>
                  <p className="text-[9px] text-muted-foreground">Overall</p>
                </div>
                <div className="text-center p-2 bg-background/50 rounded-lg">
                  <p className="text-lg font-bold font-mono text-primary">{dominantTrait}</p>
                  <p className="text-[9px] text-muted-foreground">Dominant Trait</p>
                </div>
                <div className="text-center p-2 bg-background/50 rounded-lg">
                  <p className={`text-lg font-bold font-mono ${(profile.burnoutRisk || 0) > 50 ? 'text-terminal-red' : 'text-terminal-green'}`}>
                    {(profile.burnoutRisk || 0) > 50 ? 'At Risk' : 'Healthy'}
                  </p>
                  <p className="text-[9px] text-muted-foreground">Status</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="mt-4">
            <div className="space-y-3">
              {(profile.funInsights || []).map((insight: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border/50"
                >
                  <Sparkles className="w-4 h-4 text-terminal-yellow flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/90">{insight}</p>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="suggestions" className="mt-4">
            <div className="space-y-3">
              {(profile.suggestions || []).map((suggestion: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20"
                >
                  <Lightbulb className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/90">{suggestion}</p>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

function MetricCard({ icon, label, value, subtext }: { icon: React.ReactNode; label: string; value: string; subtext: string }) {
  return (
    <div className="glass-panel p-4">
      <div className="flex items-center gap-2 mb-2 text-primary">
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="text-lg font-semibold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">{subtext}</div>
    </div>
  );
}

function EnhancedRiskMeter({ label, value, icon, isInView }: { label: string; value: number; icon: React.ReactNode; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className="glass-panel p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{icon}</span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
        <span className={`text-lg font-bold font-mono ${getRiskColor(value)}`}>{value}%</span>
      </div>
      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full transition-all ${getProgressColor(100 - value)}`}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${value}%` } : {}}
          transition={{ duration: 1, delay: 0.3 }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-muted-foreground">{getRiskLabel(value)}</span>
        <span className={`text-[10px] font-medium ${getRiskColor(value)}`}>
          {value <= 30 ? '✓ Safe' : value <= 60 ? '⚠ Monitor' : '✕ Action needed'}
        </span>
      </div>
    </motion.div>
  );
}

function AnimatedProgressMetric({ label, value, isInView, delay }: { label: string; value: number; isInView: boolean; delay: number }) {
  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: -10 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.3 }}
    >
      <span className="text-xs text-muted-foreground w-28">{label}</span>
      <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${getProgressColor(value)}`}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${value}%` } : {}}
          transition={{ duration: 1, delay: delay + 0.2 }}
        />
      </div>
      <span className="text-xs font-mono text-foreground w-10 text-right">{value}%</span>
    </motion.div>
  );
}

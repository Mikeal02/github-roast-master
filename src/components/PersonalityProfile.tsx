import { Brain, Zap, AlertTriangle, BookOpen, Lightbulb, Sparkles, Target } from 'lucide-react';
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
  return (
    <div className="space-y-6">
      <div className="terminal-box">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-primary/20">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Digital Personality Profile</h3>
          <span className="ml-auto text-xs text-muted-foreground font-mono">AI Analysis</span>
        </div>

        {/* Personality Type Banner */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-lg p-4 mb-6 border border-primary/20">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{profile.personalityType?.emoji || '🧠'}</span>
            <div>
              <h4 className="text-xl font-bold text-foreground">{profile.personalityType?.type || 'Coder'}</h4>
              <p className="text-sm text-muted-foreground">{profile.personalityType?.description || ''}</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="metrics" className="text-xs">Metrics</TabsTrigger>
            <TabsTrigger value="insights" className="text-xs">Fun Insights</TabsTrigger>
            <TabsTrigger value="suggestions" className="text-xs">Suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="mt-4 space-y-4">
            {/* Core Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                icon={<Zap className="w-4 h-4" />}
                label="Focus Type"
                value={profile.focusType || 'Unknown'}
                subtext={`Peak activity: ${profile.peakActivityDay || 'N/A'}s`}
              />
              <MetricCard
                icon={<BookOpen className="w-4 h-4" />}
                label="Learning Style"
                value={profile.learningStyle || 'Unknown'}
                subtext="Based on project patterns"
              />
            </div>

            {/* Risk Meters */}
            <div className="grid grid-cols-2 gap-4">
              <RiskMeter
                label="Procrastination Tendency"
                value={profile.procrastinationTendency || 0}
                icon={<Target className="w-4 h-4" />}
              />
              <RiskMeter
                label="Burnout Risk"
                value={profile.burnoutRisk || 0}
                icon={<AlertTriangle className="w-4 h-4" />}
              />
            </div>

            {/* Progress Bars */}
            {profile.metrics && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs text-muted-foreground uppercase tracking-wide">Behavioral Metrics</h4>
                <ProgressMetric label="Consistency" value={profile.metrics.consistency || 0} />
                <ProgressMetric label="Exploration" value={profile.metrics.exploration || 0} />
                <ProgressMetric label="Collaboration" value={profile.metrics.collaboration || 0} />
                <ProgressMetric label="Documentation" value={profile.metrics.documentation || 0} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="insights" className="mt-4">
            <div className="space-y-3">
              {(profile.funInsights || []).map((insight: string, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border/50"
                >
                  <Sparkles className="w-4 h-4 text-terminal-yellow flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/90">{insight}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="suggestions" className="mt-4">
            <div className="space-y-3">
              {(profile.suggestions || []).map((suggestion: string, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20"
                >
                  <Lightbulb className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/90">{suggestion}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, subtext }: { icon: React.ReactNode; label: string; value: string; subtext: string }) {
  return (
    <div className="score-card">
      <div className="flex items-center gap-2 mb-2 text-primary">
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="text-lg font-semibold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">{subtext}</div>
    </div>
  );
}

function RiskMeter({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="score-card">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{icon}</span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
        <span className={`text-lg font-bold font-mono ${getRiskColor(value)}`}>
          {value}%
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${getProgressColor(100 - value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        {value <= 30 ? 'Low' : value <= 60 ? 'Moderate' : 'High'}
      </div>
    </div>
  );
}

function ProgressMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-28">{label}</span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${getProgressColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-mono text-foreground w-10 text-right">{value}%</span>
    </div>
  );
}

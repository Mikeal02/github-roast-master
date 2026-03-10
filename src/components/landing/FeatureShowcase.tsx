import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  BarChart3, Brain, Flame, Dna, Trophy, Zap, Shield, FileText,
  Music, Globe, Rewind, Users, Sparkles, Code2, GitFork, TrendingUp,
} from 'lucide-react';

const features = [
  { icon: <BarChart3 className="w-5 h-5" />, title: '14 Analysis Tabs', desc: 'Overview, Scores, DNA, Tech Stack, Activity, Repos, Rhythm, XP, Timeline, Globe, Impact, Roast, Personality & more.', color: 'var(--primary)', tag: 'CORE' },
  { icon: <Brain className="w-5 h-5" />, title: 'AI-Powered Insights', desc: 'Google Gemini analyzes 300+ data points to generate career insights, personality profiles, and tech assessments.', color: 'var(--terminal-cyan)', tag: 'AI' },
  { icon: <Flame className="w-5 h-5" />, title: 'Savage Roasts', desc: 'AI-generated roasts that reference your actual commit patterns, language choices, and coding habits.', color: 'var(--destructive)', tag: 'FUN' },
  { icon: <Dna className="w-5 h-5" />, title: 'Developer DNA', desc: 'Unique coding fingerprint visualization showing your strengths, patterns, and developer archetype.', color: 'var(--accent)', tag: 'UNIQUE' },
  { icon: <Trophy className="w-5 h-5" />, title: 'XP & Achievements', desc: '14 unlockable badges, XP leveling system, and developer rank based on your GitHub activity.', color: 'var(--terminal-yellow)', tag: 'GAMIFIED' },
  { icon: <Zap className="w-5 h-5" />, title: 'Impact Metrics', desc: 'Community impact, innovation index, reliability score, and velocity trend analysis.', color: 'var(--terminal-green)', tag: 'METRICS' },
  { icon: <Shield className="w-5 h-5" />, title: 'Recruiter Mode', desc: 'Professional assessment with hiring signals, salary tier, team fit, and career trajectory.', color: 'var(--secondary)', tag: 'PRO' },
  { icon: <FileText className="w-5 h-5" />, title: 'PDF Reports', desc: 'Export comprehensive analysis as shareable PDF reports or social media cards.', color: 'var(--terminal-purple)', tag: 'EXPORT' },
  { icon: <Music className="w-5 h-5" />, title: 'Code Rhythm', desc: 'Visualize your coding tempo, peak hours, and weekly patterns as a musical composition.', color: 'var(--terminal-cyan)', tag: 'VISUAL' },
  { icon: <Globe className="w-5 h-5" />, title: 'Developer Globe', desc: 'Interactive 3D visualization of your global developer footprint and collaboration network.', color: 'var(--primary)', tag: '3D' },
  { icon: <Rewind className="w-5 h-5" />, title: 'Time Machine', desc: 'Travel through your coding history and see how your skills evolved over the years.', color: 'var(--terminal-yellow)', tag: 'HISTORY' },
  { icon: <Users className="w-5 h-5" />, title: 'Profile Compare', desc: 'Battle two developers head-to-head across every metric for the ultimate coding showdown.', color: 'var(--destructive)', tag: 'VERSUS' },
];

export function FeatureShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section>
      <SectionHeader
        badge="FEATURES"
        title="The Most Comprehensive GitHub Analyzer"
        subtitle="12 unique modules powered by AI, each delivering insights no other tool can match."
      />
      <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {features.map((feat, i) => (
          <motion.div
            key={feat.title}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            className="glass-panel p-5 group cursor-default relative overflow-hidden"
          >
            {/* Glow on hover */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 0%, hsl(${feat.color} / 0.12) 0%, transparent 70%)`,
              }}
              animate={{ opacity: hoveredIdx === i ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                  style={{
                    background: `hsl(${feat.color} / 0.12)`,
                    color: `hsl(${feat.color})`,
                    boxShadow: hoveredIdx === i ? `0 0 20px hsl(${feat.color} / 0.2)` : 'none',
                  }}
                >
                  {feat.icon}
                </div>
                <span
                  className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: `hsl(${feat.color} / 0.1)`,
                    color: `hsl(${feat.color})`,
                    border: `1px solid hsl(${feat.color} / 0.2)`,
                  }}
                >
                  {feat.tag}
                </span>
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-1.5">{feat.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function SectionHeader({ badge, title, subtitle }: { badge: string; title: string; subtitle: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center mb-14"
    >
      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-4">
        <Sparkles className="w-3 h-3" />
        {badge}
      </span>
      <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">{title}</h2>
      <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">{subtitle}</p>
    </motion.div>
  );
}

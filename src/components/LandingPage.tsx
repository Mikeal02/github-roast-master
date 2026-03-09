import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Flame, Brain, Dna, Trophy, Zap, Shield, BarChart3, GitFork,
  Clock, Code2, Globe, Music, Rewind, FileText, Users, Sparkles,
  ArrowRight, Star, TrendingUp, Heart,
} from 'lucide-react';

const features = [
  { icon: <BarChart3 className="w-5 h-5" />, title: '14 Analysis Tabs', desc: 'Overview, Scores, DNA, Tech Stack, Activity, Repos, Rhythm, XP, Timeline, Globe, Impact, Roast, Personality & more.', color: 'hsl(var(--primary))' },
  { icon: <Brain className="w-5 h-5" />, title: 'AI-Powered Insights', desc: 'Google Gemini analyzes 300+ data points to generate career insights, personality profiles, and tech assessments.', color: 'hsl(var(--terminal-cyan))' },
  { icon: <Flame className="w-5 h-5" />, title: 'Savage Roasts', desc: 'AI-generated roasts that reference your actual commit patterns, language choices, and coding habits.', color: 'hsl(var(--destructive))' },
  { icon: <Dna className="w-5 h-5" />, title: 'Developer DNA', desc: 'Unique coding fingerprint visualization showing your strengths, patterns, and developer archetype.', color: 'hsl(var(--accent))' },
  { icon: <Trophy className="w-5 h-5" />, title: 'XP & Achievements', desc: '14 unlockable badges, XP leveling system, and developer rank based on your GitHub activity.', color: 'hsl(var(--terminal-yellow))' },
  { icon: <Zap className="w-5 h-5" />, title: 'Impact Metrics', desc: 'Community impact, innovation index, reliability score, and velocity trend analysis.', color: 'hsl(var(--terminal-green))' },
  { icon: <Shield className="w-5 h-5" />, title: 'Recruiter Mode', desc: 'Professional assessment with hiring signals, salary tier, team fit, and career trajectory.', color: 'hsl(var(--secondary))' },
  { icon: <FileText className="w-5 h-5" />, title: 'PDF Reports', desc: 'Export comprehensive analysis as shareable PDF reports or social media cards.', color: 'hsl(var(--terminal-purple))' },
];

const stats = [
  { value: '14+', label: 'Analysis Tabs' },
  { value: '300+', label: 'Data Points' },
  { value: 'AI', label: 'Powered' },
  { value: '∞', label: 'Roast Potential' },
];

const steps = [
  { num: '01', title: 'Enter Username', desc: 'Type any GitHub username into the terminal-styled search bar.', icon: <Code2 className="w-6 h-6" /> },
  { num: '02', title: 'AI Analyzes', desc: 'Our AI processes 300+ data points from repos, events, and activity patterns.', icon: <Brain className="w-6 h-6" /> },
  { num: '03', title: 'Get Results', desc: 'Explore 14 interactive tabs with scores, DNA, personality, and brutal roasts.', icon: <Sparkles className="w-6 h-6" /> },
];

interface LandingPageProps {
  isRecruiterMode: boolean;
  onTryIt: () => void;
}

function SectionHeader({ badge, title, subtitle }: { badge: string; title: string; subtitle: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-4">
        <Sparkles className="w-3 h-3" />
        {badge}
      </span>
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">{title}</h2>
      <p className="text-muted-foreground max-w-lg mx-auto text-sm">{subtitle}</p>
    </motion.div>
  );
}

export function LandingPage({ isRecruiterMode, onTryIt }: LandingPageProps) {
  const featuresRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.1 });
  const stepsRef = useRef(null);
  const stepsInView = useInView(stepsRef, { once: true, amount: 0.2 });
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 });

  return (
    <div className="space-y-24 mt-16">
      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="glass-panel p-6"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.1, type: 'spring', stiffness: 200 }}
              className="text-center"
            >
              <p className="text-3xl md:text-4xl font-bold font-mono text-gradient">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Features grid */}
      <section>
        <SectionHeader
          badge="FEATURES"
          title="Everything You Need to Analyze a Developer"
          subtitle="The most comprehensive GitHub profile analysis tool on the internet. Period."
        />
        <div ref={featuresRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="glass-panel p-5 group cursor-default"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                style={{ background: `${feat.color}15`, color: feat.color }}
              >
                {feat.icon}
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-1.5">{feat.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section>
        <SectionHeader
          badge="HOW IT WORKS"
          title="Three Steps to Developer Enlightenment"
          subtitle="From username to comprehensive analysis in under 30 seconds."
        />
        <div ref={stepsRef} className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              animate={stepsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="glass-panel p-6 text-center relative overflow-hidden"
            >
              {/* Step number watermark */}
              <div className="absolute top-2 right-4 text-6xl font-bold font-mono text-primary/5">{step.num}</div>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                {step.icon}
              </div>
              <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 z-10">
                  <ArrowRight className="w-5 h-5 text-primary/30" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modes showcase */}
      <section>
        <SectionHeader
          badge="DUAL MODES"
          title="Roast or Recruit — Your Choice"
          subtitle="Switch between savage comedy and professional analysis with one click."
        />
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="glass-panel p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-[0.06] pointer-events-none"
              style={{ background: 'radial-gradient(circle, hsl(var(--destructive)), transparent)' }} />
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-destructive/10">
                <Flame className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Roast Mode</h3>
                <p className="text-[11px] text-muted-foreground">Comedy meets code analysis</p>
              </div>
            </div>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              {['Devastatingly funny AI roasts citing real metrics', 'Developer personality & coding persona', 'Achievement badges & XP leveling', 'Shareable roast cards for social media'].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="flex items-start gap-2"
                >
                  <Star className="w-3 h-3 text-destructive mt-0.5 shrink-0" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="glass-panel p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-[0.06] pointer-events-none"
              style={{ background: 'radial-gradient(circle, hsl(var(--secondary)), transparent)' }} />
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-secondary/10">
                <Users className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Recruiter Mode</h3>
                <p className="text-[11px] text-muted-foreground">Professional hiring intelligence</p>
              </div>
            </div>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              {['Career trajectory & salary tier estimation', 'Red/green flags for hiring decisions', 'Team fit & leadership potential analysis', 'Exportable PDF reports for stakeholders'].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="flex items-start gap-2"
                >
                  <Star className="w-3 h-3 text-secondary mt-0.5 shrink-0" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <motion.section
        ref={ctaRef}
        initial={{ opacity: 0, y: 30 }}
        animate={ctaInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="glass-panel p-8 md:p-12 text-center relative overflow-hidden"
      >
        <div className="aurora-glow top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-5xl mb-5"
        >
          {isRecruiterMode ? '💼' : '🔥'}
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Ready to {isRecruiterMode ? 'Analyze' : 'Roast'} a Developer?
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto text-sm mb-6">
          Enter any GitHub username above and get the most comprehensive {isRecruiterMode ? 'professional assessment' : 'roast and analysis'} on the internet.
        </p>
        <motion.button
          onClick={onTryIt}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowRight className="w-4 h-4" />
          Try It Now — It&apos;s Free
        </motion.button>
        <p className="text-[10px] text-muted-foreground/50 mt-3">No signup required. Uses real GitHub data.</p>
      </motion.section>
    </div>
  );
}

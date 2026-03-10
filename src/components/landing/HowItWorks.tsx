import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Code2, Brain, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { SectionHeader } from './FeatureShowcase';

const steps = [
  {
    num: '01',
    title: 'Enter Username',
    desc: 'Type any GitHub username into the terminal-styled search bar. No authentication or signup required.',
    icon: <Code2 className="w-7 h-7" />,
    color: 'var(--primary)',
    detail: '< 1 second',
  },
  {
    num: '02',
    title: 'AI Analyzes Everything',
    desc: 'Our AI processes repos, events, commits, languages, and activity patterns across 300+ data points.',
    icon: <Brain className="w-7 h-7" />,
    color: 'var(--terminal-cyan)',
    detail: '~15 seconds',
  },
  {
    num: '03',
    title: 'Explore 14 Tabs',
    desc: 'Get scores, DNA fingerprint, personality profile, brutal roasts, XP levels, impact metrics, and more.',
    icon: <Sparkles className="w-7 h-7" />,
    color: 'var(--accent)',
    detail: 'Instant results',
  },
];

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section>
      <SectionHeader
        badge="HOW IT WORKS"
        title="Three Steps to Developer Enlightenment"
        subtitle="From username to the most comprehensive analysis on the internet in under 30 seconds."
      />
      <div ref={ref} className="relative">
        {/* Connecting line */}
        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 z-0" />

        <div className="grid md:grid-cols-3 gap-6 relative z-10">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: i * 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel p-8 text-center relative overflow-hidden group"
            >
              {/* Background watermark */}
              <div className="absolute top-3 right-5 text-7xl font-bold font-mono opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                {step.num}
              </div>
              {/* Glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at 50% 30%, hsl(${step.color} / 0.08) 0%, transparent 60%)`,
                }}
              />
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: `hsl(${step.color} / 0.1)`,
                  color: `hsl(${step.color})`,
                }}
              >
                {step.icon}
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2">{step.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{step.desc}</p>
              <span
                className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background: `hsl(${step.color} / 0.08)`,
                  color: `hsl(${step.color})`,
                }}
              >
                <Zap className="w-2.5 h-2.5" />
                {step.detail}
              </span>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 z-10">
                  <ArrowRight className="w-5 h-5 text-primary/30" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

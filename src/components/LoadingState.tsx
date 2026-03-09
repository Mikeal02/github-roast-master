import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Code, Database, Cpu, Brain, Radar, Sparkles, Shield, Zap, CheckCircle2 } from 'lucide-react';

const steps = [
  { icon: <Code className="w-5 h-5" />, text: 'Fetching profile & repositories...', color: 'text-primary', detail: 'up to 300 repos' },
  { icon: <Database className="w-5 h-5" />, text: 'Analyzing events & activity...', color: 'text-secondary', detail: 'up to 300 events' },
  { icon: <Radar className="w-5 h-5" />, text: 'Computing skill metrics...', color: 'text-terminal-cyan', detail: '6 scoring dimensions' },
  { icon: <Shield className="w-5 h-5" />, text: 'Evaluating code patterns...', color: 'text-terminal-green', detail: 'commits, languages, topics' },
  { icon: <Brain className="w-5 h-5" />, text: 'AI deep analysis in progress...', color: 'text-accent', detail: 'Gemini 3 Flash' },
  { icon: <Zap className="w-5 h-5" />, text: 'Building personality profile...', color: 'text-terminal-purple', detail: 'archetype detection' },
  { icon: <Sparkles className="w-5 h-5" />, text: 'Generating comprehensive results...', color: 'text-terminal-yellow', detail: 'final compilation' },
];

const funFacts = [
  '💡 The average developer writes ~10,000 lines of code per year',
  '🔥 Linus Torvalds has over 200k stars on GitHub',
  '⚡ The GitHub API processes millions of requests per hour',
  '🧬 Your coding DNA is as unique as your fingerprint',
  '🎯 Top 1% of developers have 100+ stars on a single repo',
  '🌍 GitHub hosts over 200 million repositories worldwide',
  '🚀 The first commit to Git itself was in 2005',
  '🤖 AI can now analyze 300+ data points from a single profile',
];

export function LoadingState() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [funFact, setFunFact] = useState(funFacts[0]);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1800);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 92) return prev;
        return prev + Math.random() * 2.5 + 0.5;
      });
    }, 120);

    const factInterval = setInterval(() => {
      setFunFact(funFacts[Math.floor(Math.random() * funFacts.length)]);
    }, 4000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      clearInterval(factInterval);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
      className="glass-panel text-center py-12 px-6 max-w-lg mx-auto relative overflow-hidden"
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--secondary)))',
          backgroundSize: '400% 400%',
        }}
        animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />

      {/* Animated CPU with orbiting dots */}
      <div className="relative inline-block mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-[-8px] rounded-2xl"
          style={{
            background: 'conic-gradient(from 0deg, transparent, hsl(var(--primary) / 0.4), hsl(var(--secondary) / 0.3), transparent)',
            padding: '2px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary"
            style={{ top: '50%', left: '50%' }}
            animate={{
              x: [0, 30 * Math.cos((i * Math.PI * 2) / 3), 0],
              y: [0, 30 * Math.sin((i * Math.PI * 2) / 3), 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: 'easeInOut' }}
          />
        ))}
        <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20 relative">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
            <Cpu className="w-8 h-8 text-primary" />
          </motion.div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-foreground mb-1 relative">Deep Analysis</h3>
      <p className="text-sm text-muted-foreground mb-6 relative">Crunching data through AI models...</p>

      {/* Progress bar */}
      <div className="w-full h-2.5 bg-muted/50 rounded-full overflow-hidden mb-2 relative">
        <motion.div
          className="h-full rounded-full relative"
          style={{
            background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--accent)))',
            backgroundSize: '200% 100%',
          }}
          initial={{ width: '0%' }}
          animate={{ 
            width: `${Math.min(progress, 95)}%`,
            backgroundPosition: ['0% 0%', '100% 0%'],
          }}
          transition={{ width: { duration: 0.3 }, backgroundPosition: { duration: 2, repeat: Infinity, ease: 'linear' } }}
        />
      </div>

      <div className="flex items-center justify-between mb-6 relative">
        <motion.p
          className="text-xs font-mono text-primary"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {Math.min(Math.round(progress), 95)}%
        </motion.p>
        <span className="text-[10px] text-muted-foreground/50 font-mono">~{Math.max(1, 7 - Math.floor(progress / 14))}s remaining</span>
      </div>

      {/* Steps */}
      <div className="space-y-1.5 text-left mb-6 relative">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: index <= currentStep ? 1 : 0.12, x: 0 }}
            transition={{ delay: index * 0.15, duration: 0.4 }}
            className={`flex items-center gap-3 text-sm px-3 py-1.5 rounded-lg transition-colors ${
              index === currentStep ? 'bg-primary/5 border border-primary/10' : ''
            }`}
          >
            <motion.span
              className={step.color}
              animate={index === currentStep ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.8, repeat: index === currentStep ? Infinity : 0 }}
            >
              {step.icon}
            </motion.span>
            <div className="flex-1 min-w-0">
              <span className="font-mono text-xs text-foreground">{step.text}</span>
              {index === currentStep && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  className="text-[9px] text-muted-foreground ml-2"
                >
                  ({step.detail})
                </motion.span>
              )}
            </div>
            {index < currentStep && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                <CheckCircle2 className="w-4 h-4 text-terminal-green" />
              </motion.span>
            )}
            {index === currentStep && <Loader2 className="w-4 h-4 animate-spin text-primary flex-shrink-0" />}
          </motion.div>
        ))}
      </div>

      {/* Fun fact */}
      <motion.div
        key={funFact}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[11px] text-muted-foreground/60 italic px-4 relative"
      >
        {funFact}
      </motion.div>
    </motion.div>
  );
}

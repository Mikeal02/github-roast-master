import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Code, Database, Cpu, Brain, Radar, Sparkles } from 'lucide-react';

const steps = [
  { icon: <Code className="w-5 h-5" />, text: 'Fetching profile data...', color: 'text-primary' },
  { icon: <Database className="w-5 h-5" />, text: 'Analyzing repositories & events...', color: 'text-secondary' },
  { icon: <Radar className="w-5 h-5" />, text: 'Computing skill metrics...', color: 'text-terminal-cyan' },
  { icon: <Brain className="w-5 h-5" />, text: 'AI deep analysis in progress...', color: 'text-accent' },
  { icon: <Sparkles className="w-5 h-5" />, text: 'Generating comprehensive results...', color: 'text-terminal-yellow' },
];

export function LoadingState() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 92) return prev;
        return prev + Math.random() * 3 + 0.5;
      });
    }, 150);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="terminal-box text-center py-16 max-w-lg mx-auto"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="inline-block mb-8"
      >
        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
          <Cpu className="w-8 h-8 text-primary" />
        </div>
      </motion.div>

      <h3 className="text-xl font-bold text-foreground mb-2">Deep Analysis</h3>
      <p className="text-sm text-muted-foreground mb-8">Crunching data through AI models...</p>

      {/* Progress bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-8">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--accent)))',
          }}
          initial={{ width: '0%' }}
          animate={{ width: `${Math.min(progress, 95)}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-3 text-left">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: index <= currentStep ? 1 : 0.3,
              x: 0,
            }}
            transition={{ delay: index * 0.3, duration: 0.4 }}
            className={`flex items-center gap-3 text-sm ${
              index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            <span className={step.color}>{step.icon}</span>
            <span className="flex-1">{step.text}</span>
            {index < currentStep && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-terminal-green text-xs font-mono"
              >
                ✓
              </motion.span>
            )}
            {index === currentStep && (
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
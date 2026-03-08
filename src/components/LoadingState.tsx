import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Loader2, Code, Database, Cpu, Brain, Radar, Sparkles, Shield, Zap } from 'lucide-react';

const steps = [
  { icon: <Code className="w-5 h-5" />, text: 'Fetching profile data...', color: 'text-primary' },
  { icon: <Database className="w-5 h-5" />, text: 'Analyzing repositories & events...', color: 'text-secondary' },
  { icon: <Radar className="w-5 h-5" />, text: 'Computing skill metrics...', color: 'text-terminal-cyan' },
  { icon: <Shield className="w-5 h-5" />, text: 'Evaluating code patterns...', color: 'text-terminal-green' },
  { icon: <Brain className="w-5 h-5" />, text: 'AI deep analysis in progress...', color: 'text-accent' },
  { icon: <Zap className="w-5 h-5" />, text: 'Building personality profile...', color: 'text-terminal-purple' },
  { icon: <Sparkles className="w-5 h-5" />, text: 'Generating comprehensive results...', color: 'text-terminal-yellow' },
];

export function LoadingState() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

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

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
      className="terminal-box text-center py-16 max-w-lg mx-auto"
    >
      {/* Spinning icon with orbit ring */}
      <div className="relative inline-block mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-2xl"
          style={{
            background: 'conic-gradient(from 0deg, transparent, hsl(var(--primary) / 0.3), transparent)',
            padding: '2px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Cpu className="w-8 h-8 text-primary" />
          </motion.div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-foreground mb-2">Deep Analysis</h3>
      <p className="text-sm text-muted-foreground mb-8">Crunching data through AI models...</p>

      {/* Progress bar */}
      <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden mb-8 relative">
        <motion.div
          className="h-full rounded-full relative"
          style={{
            background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--accent)))',
          }}
          initial={{ width: '0%' }}
          animate={{ width: `${Math.min(progress, 95)}%` }}
          transition={{ duration: 0.3 }}
        />
        {/* Shimmer overlay */}
        <motion.div
          className="absolute inset-0 h-full"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
            width: '30%',
          }}
          animate={{ x: ['-100%', '400%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Percentage */}
      <motion.p
        className="text-xs font-mono text-primary mb-6"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {Math.min(Math.round(progress), 95)}%
      </motion.p>

      {/* Steps */}
      <div className="space-y-3 text-left">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: index <= currentStep ? 1 : 0.2,
              x: 0,
            }}
            transition={{ delay: index * 0.2, duration: 0.4 }}
            className={`flex items-center gap-3 text-sm ${
              index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            <motion.span
              className={step.color}
              animate={index === currentStep ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.8, repeat: index === currentStep ? Infinity : 0 }}
            >
              {step.icon}
            </motion.span>
            <span className="flex-1 font-mono text-xs">{step.text}</span>
            {index < currentStep && (
              <motion.span
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
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

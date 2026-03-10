import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Github, Sparkles, Zap } from 'lucide-react';

interface CTASectionProps {
  isRecruiterMode: boolean;
  onTryIt: () => void;
}

export function CTASection({ isRecruiterMode, onTryIt }: CTASectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel p-10 md:p-16 text-center relative overflow-hidden"
    >
      {/* Multiple aurora glows */}
      <div className="aurora-glow top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="aurora-glow bottom-0 right-0 translate-x-1/3 translate-y-1/3 opacity-[0.04]" />

      {/* Floating icon */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-6 inline-block"
      >
        <div className="p-5 rounded-3xl bg-primary/10 border border-primary/20 inline-flex">
          {isRecruiterMode ? (
            <Sparkles className="w-10 h-10 text-primary" />
          ) : (
            <span className="text-5xl">🔥</span>
          )}
        </div>
      </motion.div>

      <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
        Ready to{' '}
        <span className="text-gradient">
          {isRecruiterMode ? 'Analyze' : 'Roast'}
        </span>{' '}
        a Developer?
      </h2>
      <p className="text-muted-foreground max-w-lg mx-auto text-sm md:text-base mb-8">
        Enter any GitHub username above and get the most comprehensive{' '}
        {isRecruiterMode ? 'professional assessment' : 'roast and analysis'} on the internet.
        No signup, no API key, completely free.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <motion.button
          onClick={onTryIt}
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-base shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
          style={{
            boxShadow: '0 4px 30px hsl(var(--primary) / 0.3)',
          }}
        >
          <ArrowRight className="w-5 h-5" />
          Try It Now — It's Free
        </motion.button>
        <motion.a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-4 rounded-xl border border-border text-foreground font-medium text-sm hover:bg-card transition-colors"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Github className="w-4 h-4" />
          View on GitHub
        </motion.a>
      </div>

      <div className="flex items-center justify-center gap-6 mt-8 text-[11px] text-muted-foreground/60">
        <span className="flex items-center gap-1.5">
          <Zap className="w-3 h-3" />
          No signup required
        </span>
        <span className="w-1 h-1 rounded-full bg-muted-foreground/20" />
        <span>Uses real GitHub data</span>
        <span className="w-1 h-1 rounded-full bg-muted-foreground/20" />
        <span>100% free</span>
      </div>
    </motion.section>
  );
}

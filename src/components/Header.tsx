import { Flame, Github, Skull, Briefcase, Sparkles, Zap, Shield, Brain, Star, Code2 } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

export function Header({ isRecruiterMode = false }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-200, 200], [8, -8]), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-8, 8]), { stiffness: 200, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <header className="text-center mb-10 relative z-10">
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        className="flex items-center justify-center gap-3 mb-6"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="relative"
        >
          <div className="relative p-5 rounded-2xl bg-card border border-border group">
            {/* Double animated rings */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--accent)), hsl(var(--primary)))',
                padding: '1.5px',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-[-4px] rounded-[20px] opacity-30"
              style={{
                background: 'conic-gradient(from 180deg, hsl(var(--accent)), hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--accent)))',
                padding: '1px',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            />
            <Github className="w-12 h-12 text-foreground relative z-10" />
          </div>
          
          {/* Floating particles around logo */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-primary/60"
              style={{ top: '50%', left: '50%' }}
              animate={{
                x: [0, 35 * Math.cos((i * Math.PI * 2) / 4), 0],
                y: [0, 35 * Math.sin((i * Math.PI * 2) / 4), 0],
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.75, ease: 'easeInOut' }}
            />
          ))}
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
            className="absolute -top-2 -right-2"
          >
            {isRecruiterMode ? (
              <motion.div
                className="p-1.5 rounded-lg bg-secondary text-secondary-foreground"
                animate={{ boxShadow: ['0 0 0px hsl(var(--secondary) / 0)', '0 0 20px hsl(var(--secondary) / 0.5)', '0 0 0px hsl(var(--secondary) / 0)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Briefcase className="w-4 h-4" />
              </motion.div>
            ) : (
              <motion.div
                className="p-1.5 rounded-lg bg-destructive text-destructive-foreground"
                animate={{ boxShadow: ['0 0 0px hsl(var(--destructive) / 0)', '0 0 20px hsl(var(--destructive) / 0.5)', '0 0 0px hsl(var(--destructive) / 0)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Flame className="w-4 h-4" />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-5xl md:text-7xl font-bold mb-4 tracking-tight"
      >
        <span className="text-foreground">GitHub </span>
        <motion.span
          className="text-gradient inline-block"
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 5, repeat: Infinity }}
          style={{ backgroundSize: '200% 200%' }}
        >
          {isRecruiterMode ? 'Profile' : 'Roast'}
        </motion.span>
        <br />
        <span className="text-foreground">{isRecruiterMode ? 'Analyzer' : 'Machine'}</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="text-muted-foreground max-w-lg mx-auto text-base flex items-center justify-center gap-2"
      >
        {isRecruiterMode ? (
          <>
            <Sparkles className="w-4 h-4 text-secondary" />
            AI-powered professional profile analysis for hiring decisions
          </>
        ) : (
          <>
            <Skull className="w-4 h-4 text-destructive" />
            Enter any GitHub username and watch AI destroy their coding ego
          </>
        )}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-center gap-6 mt-8 text-xs text-muted-foreground"
      >
        {[
          { icon: <Zap className="w-3 h-3" />, color: 'bg-terminal-green', label: 'Real GitHub API', detail: '300+ data points' },
          { icon: <Brain className="w-3 h-3" />, color: 'bg-terminal-cyan', label: 'AI Analysis', detail: 'Gemini-powered' },
          { icon: <Shield className="w-3 h-3" />, color: 'bg-terminal-yellow', label: isRecruiterMode ? 'Pro Insights' : 'Savage Roasts', detail: '12 tabs' },
        ].map((item, i) => (
          <motion.span
            key={item.label}
            className="flex items-center gap-2 group cursor-default"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
          >
            <span className={`w-2 h-2 rounded-full ${item.color} animate-pulse`} />
            <span className="group-hover:text-foreground transition-colors">{item.label}</span>
            <span className="text-[9px] text-muted-foreground/50 hidden sm:inline">({item.detail})</span>
          </motion.span>
        ))}
      </motion.div>
    </header>
  );
}

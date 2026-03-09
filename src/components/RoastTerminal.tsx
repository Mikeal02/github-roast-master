import { useEffect, useState, useRef } from 'react';
import { Terminal, Skull, Flame, Sparkles } from 'lucide-react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

export function RoastTerminal({ roasts, username }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [displayedRoasts, setDisplayedRoasts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayedRoasts([]);
    setCurrentIndex(0);
  }, [roasts]);

  useEffect(() => {
    if (!isInView) return;
    if (currentIndex < roasts.length) {
      const timer = setTimeout(() => {
        setDisplayedRoasts(prev => [...prev, roasts[currentIndex]]);
        setCurrentIndex(prev => prev + 1);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, roasts, isInView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel p-5 font-mono text-sm scan-line"
    >
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-primary/20">
        <div className="flex gap-1.5">
          <motion.div className="w-3 h-3 rounded-full bg-terminal-red" animate={{ scale: [1, 0.8, 1] }} transition={{ duration: 2, repeat: Infinity }} />
          <motion.div className="w-3 h-3 rounded-full bg-terminal-yellow" animate={{ scale: [1, 0.8, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.2 }} />
          <motion.div className="w-3 h-3 rounded-full bg-terminal-green" animate={{ scale: [1, 0.8, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.4 }} />
        </div>
        <div className="flex items-center gap-2 ml-4 text-xs text-muted-foreground">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="font-mono">roast-output.sh</span>
        </div>
        <motion.div
          className="ml-auto"
          animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Flame className="w-4 h-4 text-terminal-red" />
        </motion.div>
      </div>

      <div className="space-y-3 min-h-[200px]">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 text-xs text-muted-foreground"
        >
          <span className="text-primary">$</span>
          <span className="font-mono">./generate-roast --target={username} --intensity=max</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="text-terminal-yellow text-xs flex items-center gap-2"
        >
          <Skull className="w-4 h-4" />
          <span>Analyzing target... Preparing roast artillery...</span>
        </motion.div>

        <div className="border-l-2 border-primary/30 pl-4 space-y-4 mt-4">
          <AnimatePresence>
            {displayedRoasts.map((roast, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-start gap-2">
                  <span className="text-terminal-red font-bold font-mono">[{index + 1}]</span>
                  <p className="text-foreground/90 text-sm leading-relaxed">
                    {roast}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {currentIndex < roasts.length && isInView && (
            <motion.div
              className="flex items-center gap-2 text-primary"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              <span>▋</span>
              <span className="text-xs text-muted-foreground">Loading next roast...</span>
            </motion.div>
          )}
        </div>

        {displayedRoasts.length === roasts.length && roasts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 pt-4 border-t border-primary/20"
          >
            <div className="flex items-center gap-2 text-xs text-terminal-green">
              <span className="text-primary">$</span>
              <span>Roast complete. Target status: </span>
              <motion.span
                className="font-bold flex items-center gap-1"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.6, repeat: 3 }}
              >
                DESTROYED <Sparkles className="w-3 h-3 text-terminal-yellow" /> 💀
              </motion.span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

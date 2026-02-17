import { Flame, Github, Skull, Briefcase, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function Header({ isRecruiterMode = false }) {
  return (
    <header className="text-center mb-10 relative z-10">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        className="flex items-center justify-center gap-3 mb-6"
      >
        <div className="relative">
          <div className="p-4 rounded-2xl bg-card border border-border">
            <Github className="w-10 h-10 text-foreground" />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
            className="absolute -top-2 -right-2"
          >
            {isRecruiterMode ? (
              <div className="p-1.5 rounded-lg bg-secondary text-secondary-foreground">
                <Briefcase className="w-4 h-4" />
              </div>
            ) : (
              <div className="p-1.5 rounded-lg bg-destructive text-destructive-foreground">
                <Flame className="w-4 h-4" />
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-4xl md:text-6xl font-bold mb-4 tracking-tight"
      >
        <span className="text-foreground">GitHub </span>
        <span className="text-gradient">{isRecruiterMode ? 'Profile' : 'Roast'}</span>
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
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
          Real GitHub API
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-terminal-cyan animate-pulse" />
          AI-Powered Analysis
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-terminal-yellow" />
          {isRecruiterMode ? 'Professional Insights' : 'Savage Roasts'}
        </span>
      </motion.div>
    </header>
  );
}
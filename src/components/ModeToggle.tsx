import { Flame, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export function ModeToggle({ isRecruiterMode, onToggle }: { isRecruiterMode: boolean; onToggle: (mode: boolean) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex items-center justify-center gap-3 mb-8 relative z-10"
    >
      <div className="flex bg-card border border-border rounded-2xl p-1.5">
        <button
          onClick={() => onToggle(false)}
          className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            !isRecruiterMode ? 'text-destructive-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {!isRecruiterMode && (
            <motion.div
              layoutId="modeToggle"
              className="absolute inset-0 bg-destructive rounded-xl"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <Flame className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Roast Mode</span>
        </button>
        
        <button
          onClick={() => onToggle(true)}
          className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            isRecruiterMode ? 'text-secondary-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {isRecruiterMode && (
            <motion.div
              layoutId="modeToggle"
              className="absolute inset-0 bg-secondary rounded-xl"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <Briefcase className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Recruiter Mode</span>
        </button>
      </div>
    </motion.div>
  );
}
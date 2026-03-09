import { Clock, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function SearchHistory({ history, onSelect, onRemove, onClear }) {
  if (history.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="w-full max-w-xl mx-auto mt-4"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
          <Clock className="w-3 h-3" />
          <span className="font-medium">Recent</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-xs text-muted-foreground/50 hover:text-destructive h-6 px-2"
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Clear
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {history.map((username, i) => (
            <motion.div
              key={username}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: i * 0.03 }}
              className="group flex items-center gap-1 glass-panel-static px-3 py-1.5 rounded-full text-sm hover:border-primary/30 transition-all cursor-pointer"
              onClick={() => onSelect(username)}
            >
              <span className="text-foreground hover:text-primary transition-colors font-mono text-xs">
                @{username}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(username); }}
                className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

import { AlertTriangle, RefreshCw, WifiOff, UserX, Clock, ArrowLeft, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export function ErrorDisplay({ error, onRetry }: { error: string; onRetry: () => void }) {
  const getErrorConfig = () => {
    if (error.includes('not found')) {
      return {
        icon: <UserX className="w-14 h-14" />,
        title: 'User Not Found',
        message: "The GitHub username you entered doesn't exist. Double-check for typos!",
        color: 'text-terminal-yellow',
        suggestion: 'Try searching for "torvalds" or "gaearon" to see the tool in action.',
      };
    }
    if (error.includes('rate limit')) {
      return {
        icon: <Clock className="w-14 h-14" />,
        title: 'Rate Limited',
        message: 'GitHub API rate limit exceeded. Please wait a moment and try again.',
        color: 'text-terminal-cyan',
        suggestion: 'Rate limits reset every hour. Try again in a few minutes.',
      };
    }
    if (error.includes('network') || error.includes('fetch')) {
      return {
        icon: <WifiOff className="w-14 h-14" />,
        title: 'Network Error',
        message: 'Unable to connect. Check your internet connection.',
        color: 'text-terminal-red',
        suggestion: 'Make sure you have a stable internet connection and try again.',
      };
    }
    return {
      icon: <AlertTriangle className="w-14 h-14" />,
      title: 'Something Went Wrong',
      message: error,
      color: 'text-terminal-red',
      suggestion: 'If this persists, try a different username or refresh the page.',
    };
  };

  const config = getErrorConfig();

  const copyError = () => {
    navigator.clipboard.writeText(error);
    toast.success('Error message copied to clipboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
      className="glass-panel text-center py-14 px-8 relative overflow-hidden max-w-lg mx-auto"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
           style={{ background: 'radial-gradient(circle at 50% 30%, hsl(var(--destructive)), transparent 70%)' }} />

      <motion.div
        className={`${config.color} mb-5 flex justify-center relative`}
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0, y: [0, -6, 0] }}
        transition={{
          scale: { type: 'spring', stiffness: 200, delay: 0.1 },
          y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        {config.icon}
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-foreground mb-2 relative"
      >
        {config.title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground mb-2 max-w-md mx-auto text-sm relative"
      >
        {config.message}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-xs text-muted-foreground/60 mb-8 relative italic"
      >
        {config.suggestion}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-center gap-3 relative"
      >
        <Button
          onClick={onRetry}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-6"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
        <Button
          variant="outline"
          onClick={copyError}
          className="gap-2"
          size="sm"
        >
          <Copy className="w-3.5 h-3.5" />
          Copy Error
        </Button>
      </motion.div>
    </motion.div>
  );
}

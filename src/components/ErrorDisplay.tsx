import { AlertTriangle, RefreshCw, WifiOff, UserX, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function ErrorDisplay({ error, onRetry }) {
  const getErrorConfig = () => {
    if (error.includes('not found')) {
      return {
        icon: <UserX className="w-12 h-12" />,
        title: 'User Not Found',
        message: 'The GitHub username you entered doesn\'t exist. Check for typos!',
        color: 'text-terminal-yellow',
      };
    }
    if (error.includes('rate limit')) {
      return {
        icon: <Clock className="w-12 h-12" />,
        title: 'Rate Limited',
        message: 'GitHub API rate limit exceeded. Please wait a moment and try again.',
        color: 'text-terminal-cyan',
      };
    }
    if (error.includes('network') || error.includes('fetch')) {
      return {
        icon: <WifiOff className="w-12 h-12" />,
        title: 'Network Error',
        message: 'Unable to connect. Check your internet connection.',
        color: 'text-terminal-red',
      };
    }
    return {
      icon: <AlertTriangle className="w-12 h-12" />,
      title: 'Something Went Wrong',
      message: error,
      color: 'text-terminal-red',
    };
  };

  const config = getErrorConfig();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel text-center py-12 px-6 relative overflow-hidden"
    >
      {/* Subtle red gradient background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
           style={{ background: 'radial-gradient(circle at 50% 30%, hsl(var(--destructive)), transparent 70%)' }} />

      <motion.div
        className={`${config.color} mb-4 flex justify-center relative`}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {config.icon}
      </motion.div>
      <h3 className="text-xl font-bold text-foreground mb-2 relative">
        {config.title}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm relative">
        {config.message}
      </p>
      <Button
        onClick={onRetry}
        className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 relative"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </Button>
    </motion.div>
  );
}

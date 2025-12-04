import { AlertTriangle, RefreshCw, WifiOff, UserX, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <div className="terminal-box text-center py-12">
      <div className={`${config.color} mb-4 flex justify-center`}>
        {config.icon}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">
        {config.title}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {config.message}
      </p>
      <Button
        onClick={onRetry}
        variant="outline"
        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </Button>
    </div>
  );
}

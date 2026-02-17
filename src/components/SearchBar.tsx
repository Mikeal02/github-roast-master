import { useState } from 'react';
import { Search, Terminal, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

export function SearchBar({ onSearch, isLoading }: { onSearch: (username: string) => void; isLoading: boolean }) {
  const [username, setUsername] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto relative z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <motion.div
        className={`terminal-box transition-all duration-300 ${
          isFocused ? 'border-primary/60 shadow-lg' : ''
        }`}
        animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-4 text-muted-foreground text-xs">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/80" />
            <div className="w-3 h-3 rounded-full bg-terminal-yellow/80" />
            <div className="w-3 h-3 rounded-full bg-terminal-green/80" />
          </div>
          <div className="flex items-center gap-2 ml-3">
            <Terminal className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary font-medium">root@roast-machine</span>
            <span className="text-muted-foreground">~</span>
            <span className="text-secondary">$</span>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-mono text-sm">
              ./analyze
            </span>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="username"
              className="pl-[5.5rem] h-12 bg-background/50 border-border focus:border-primary font-mono text-foreground placeholder:text-muted-foreground rounded-xl"
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || !username.trim()}
            className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-mono rounded-xl font-semibold"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Execute
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </motion.form>
  );
}
import { useState } from 'react';
import { Search, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SearchBar({ onSearch, isLoading }) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="terminal-box">
        <div className="flex items-center gap-2 mb-3 text-muted-foreground text-xs">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="text-primary">root@roast-machine</span>
          <span>~</span>
          <span className="text-secondary">$</span>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-mono">
              ./roast
            </span>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              className="pl-20 bg-background/50 border-primary/30 focus:border-primary font-mono text-foreground placeholder:text-muted-foreground"
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || !username.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/80 font-mono glow-border"
          >
            {isLoading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Execute
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

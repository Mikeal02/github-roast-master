import { useState, useEffect } from 'react';
import { Search, Terminal, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

const suggestions = ['torvalds', 'gaearon', 'tj', 'sindresorhus', 'yyx990803', 'antirez'];

export function SearchBar({ onSearch, isLoading }: { onSearch: (username: string) => void; isLoading: boolean }) {
  const [username, setUsername] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [placeholder, setPlaceholder] = useState('username');

  // Animated placeholder
  useEffect(() => {
    if (isFocused || username) return;
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % suggestions.length;
      setPlaceholder(suggestions[i]);
    }, 2500);
    return () => clearInterval(interval);
  }, [isFocused, username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
      setShowSuggestions(false);
    }
  };

  const filteredSuggestions = username.length > 0
    ? suggestions.filter(s => s.toLowerCase().startsWith(username.toLowerCase()) && s !== username)
    : [];

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto relative z-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <motion.div
        className={`terminal-box transition-all duration-300 ${
          isFocused ? 'border-primary/60 shadow-[0_0_40px_hsl(var(--primary)/0.15)]' : ''
        }`}
        animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Terminal header */}
        <div className="flex items-center gap-2 mb-4 text-muted-foreground text-xs">
          <div className="flex gap-1.5">
            <motion.div whileHover={{ scale: 1.3 }} className="w-3 h-3 rounded-full bg-destructive/80 cursor-pointer" />
            <motion.div whileHover={{ scale: 1.3 }} className="w-3 h-3 rounded-full bg-terminal-yellow/80 cursor-pointer" />
            <motion.div whileHover={{ scale: 1.3 }} className="w-3 h-3 rounded-full bg-terminal-green/80 cursor-pointer" />
          </div>
          <div className="flex items-center gap-2 ml-3">
            <Terminal className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary font-medium">root@roast-machine</span>
            <span className="text-muted-foreground">~</span>
            <span className="text-secondary">$</span>
          </div>
          <motion.div
            className="ml-auto flex items-center gap-1 text-[10px] text-terminal-green"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-terminal-green" />
            connected
          </motion.div>
        </div>

        {/* Input row */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-mono text-sm">
              ./analyze
            </span>
            <Input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
              onFocus={() => { setIsFocused(true); setShowSuggestions(username.length > 0); }}
              onBlur={() => { setIsFocused(false); setTimeout(() => setShowSuggestions(false), 200); }}
              placeholder={placeholder}
              className="pl-[5.5rem] h-12 bg-background/50 border-border focus:border-primary font-mono text-foreground placeholder:text-muted-foreground/50 rounded-xl"
              disabled={isLoading}
              autoComplete="off"
            />

            {/* Autocomplete dropdown */}
            <AnimatePresence>
              {showSuggestions && filteredSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl overflow-hidden shadow-xl z-50"
                >
                  {filteredSuggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); setUsername(s); onSearch(s); setShowSuggestions(false); }}
                      className="w-full px-4 py-2 text-left text-sm font-mono text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex items-center gap-2"
                    >
                      <Search className="w-3 h-3" />
                      @{s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Button
            type="submit"
            disabled={isLoading || !username.trim()}
            className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-mono rounded-xl font-semibold gap-2 relative overflow-hidden"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyze
              </>
            )}
            {/* Button shimmer */}
            {!isLoading && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                  width: '100%',
                }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </Button>
        </div>

        {/* Quick picks */}
        <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground">
          <span>Try:</span>
          {suggestions.slice(0, 4).map((name) => (
            <motion.button
              key={name}
              type="button"
              onClick={() => { setUsername(name); onSearch(name); }}
              disabled={isLoading}
              className="px-2 py-0.5 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground font-mono transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              @{name}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.form>
  );
}

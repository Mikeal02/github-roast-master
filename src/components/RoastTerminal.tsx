import { useEffect, useState } from 'react';
import { Terminal, Skull, Flame } from 'lucide-react';

export function RoastTerminal({ roasts, username }) {
  const [displayedRoasts, setDisplayedRoasts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    setDisplayedRoasts([]);
    setCurrentIndex(0);
  }, [roasts]);
  
  useEffect(() => {
    if (currentIndex < roasts.length) {
      const timer = setTimeout(() => {
        setDisplayedRoasts(prev => [...prev, roasts[currentIndex]]);
        setCurrentIndex(prev => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, roasts]);

  return (
    <div className="terminal-box scan-line">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-primary/20">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-terminal-red" />
          <div className="w-3 h-3 rounded-full bg-terminal-yellow" />
          <div className="w-3 h-3 rounded-full bg-terminal-green" />
        </div>
        <div className="flex items-center gap-2 ml-4 text-xs text-muted-foreground">
          <Terminal className="w-4 h-4 text-primary" />
          <span>roast-output.sh</span>
        </div>
        <Flame className="w-4 h-4 text-terminal-red ml-auto animate-pulse" />
      </div>
      
      <div className="space-y-3 min-h-[200px]">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="text-primary">$</span>
          <span>./generate-roast --target={username} --intensity=max</span>
        </div>
        
        <div className="text-terminal-yellow text-xs flex items-center gap-2">
          <Skull className="w-4 h-4" />
          <span>Analyzing target... Preparing roast artillery...</span>
        </div>
        
        <div className="border-l-2 border-primary/30 pl-4 space-y-4 mt-4">
          {displayedRoasts.map((roast, index) => (
            <div 
              key={index}
              className="animate-[fadeIn_0.5s_ease-out]"
            >
              <div className="flex items-start gap-2">
                <span className="text-terminal-red font-bold">[{index + 1}]</span>
                <p className="text-foreground/90 text-sm leading-relaxed">
                  {roast}
                </p>
              </div>
            </div>
          ))}
          
          {currentIndex < roasts.length && (
            <div className="flex items-center gap-2 text-primary">
              <span className="animate-pulse">▋</span>
              <span className="text-xs text-muted-foreground">Loading next roast...</span>
            </div>
          )}
        </div>
        
        {displayedRoasts.length === roasts.length && roasts.length > 0 && (
          <div className="mt-6 pt-4 border-t border-primary/20">
            <div className="flex items-center gap-2 text-xs text-terminal-green">
              <span className="text-primary">$</span>
              <span>Roast complete. Target status: </span>
              <span className="font-bold">DESTROYED 💀</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

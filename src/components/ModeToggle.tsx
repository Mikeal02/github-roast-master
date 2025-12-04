import { Flame, Briefcase } from 'lucide-react';

export function ModeToggle({ isRecruiterMode, onToggle }) {
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      <button
        onClick={() => onToggle(false)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
          !isRecruiterMode 
            ? 'bg-terminal-red/20 border-terminal-red text-terminal-red' 
            : 'bg-card border-border text-muted-foreground hover:border-primary/50'
        }`}
      >
        <Flame className="w-4 h-4" />
        <span className="font-medium">Roast Mode</span>
      </button>
      
      <button
        onClick={() => onToggle(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
          isRecruiterMode 
            ? 'bg-secondary/20 border-secondary text-secondary' 
            : 'bg-card border-border text-muted-foreground hover:border-primary/50'
        }`}
      >
        <Briefcase className="w-4 h-4" />
        <span className="font-medium">Recruiter Mode</span>
      </button>
    </div>
  );
}

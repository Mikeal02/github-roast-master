import { Flame, Github, Skull, Briefcase } from 'lucide-react';

export function Header({ isRecruiterMode = false }) {
  return (
    <header className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="relative">
          <Github className="w-12 h-12 text-foreground" />
          {isRecruiterMode ? (
            <Briefcase className="w-6 h-6 text-secondary absolute -top-1 -right-1" />
          ) : (
            <Flame className="w-6 h-6 text-terminal-red absolute -top-1 -right-1 animate-pulse" />
          )}
        </div>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold mb-3">
        <span className="text-foreground">GitHub </span>
        <span className="text-gradient glow-text">{isRecruiterMode ? 'Profile' : 'Roast'}</span>
        <span className="text-foreground"> {isRecruiterMode ? 'Analyzer' : 'Machine'}</span>
      </h1>
      
      <p className="text-muted-foreground max-w-lg mx-auto flex items-center justify-center gap-2">
        {isRecruiterMode ? (
          <>
            <Briefcase className="w-4 h-4 text-secondary" />
            Professional GitHub profile analysis for hiring decisions
            <Briefcase className="w-4 h-4 text-secondary" />
          </>
        ) : (
          <>
            <Skull className="w-4 h-4 text-terminal-red" />
            Enter any GitHub username and watch us destroy their coding ego
            <Skull className="w-4 h-4 text-terminal-red" />
          </>
        )}
      </p>
      
      <div className="flex items-center justify-center gap-4 mt-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
          Real GitHub API
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-terminal-cyan" />
          {isRecruiterMode ? 'Data-Driven' : 'Rule-Based'}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-terminal-yellow" />
          {isRecruiterMode ? 'Professional Insights' : 'Developer Scores'}
        </span>
      </div>
    </header>
  );
}

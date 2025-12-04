import { Loader2, Code, Database, Cpu } from 'lucide-react';

export function LoadingState() {
  const steps = [
    { icon: <Code className="w-4 h-4" />, text: 'Fetching profile data...' },
    { icon: <Database className="w-4 h-4" />, text: 'Analyzing repositories...' },
    { icon: <Cpu className="w-4 h-4" />, text: 'Calculating roast intensity...' },
  ];

  return (
    <div className="terminal-box text-center py-12">
      <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-6" />
      <h3 className="text-xl font-bold text-foreground mb-4">
        Analyzing Target...
      </h3>
      <div className="space-y-3 max-w-xs mx-auto">
        {steps.map((step, index) => (
          <div 
            key={index}
            className="flex items-center gap-3 text-sm text-muted-foreground animate-pulse"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <span className="text-primary">{step.icon}</span>
            <span>{step.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

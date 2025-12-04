import { Clock, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SearchHistory({ history, onSelect, onRemove, onClear }) {
  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-xl mx-auto mt-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>Recent searches</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-xs text-muted-foreground hover:text-destructive h-6 px-2"
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Clear
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((username) => (
          <div
            key={username}
            className="group flex items-center gap-1 bg-card border border-border rounded-full px-3 py-1 text-sm hover:border-primary/50 transition-colors"
          >
            <button
              onClick={() => onSelect(username)}
              className="text-foreground hover:text-primary transition-colors"
            >
              @{username}
            </button>
            <button
              onClick={() => onRemove(username)}
              className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

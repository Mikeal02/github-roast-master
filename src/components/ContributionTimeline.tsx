import { useMemo } from 'react';
import { GitCommit, GitPullRequest, Star, GitFork, MessageSquare, Eye } from 'lucide-react';

interface ContributionTimelineProps {
  events: Array<{
    type: string;
    created_at: string;
    repo?: { name: string };
    payload?: any;
  }>;
}

const eventConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  PushEvent: { icon: <GitCommit className="w-3.5 h-3.5" />, label: 'Pushed', color: 'text-terminal-green' },
  PullRequestEvent: { icon: <GitPullRequest className="w-3.5 h-3.5" />, label: 'PR', color: 'text-terminal-cyan' },
  WatchEvent: { icon: <Star className="w-3.5 h-3.5" />, label: 'Starred', color: 'text-terminal-yellow' },
  ForkEvent: { icon: <GitFork className="w-3.5 h-3.5" />, label: 'Forked', color: 'text-accent' },
  IssueCommentEvent: { icon: <MessageSquare className="w-3.5 h-3.5" />, label: 'Commented', color: 'text-secondary' },
  IssuesEvent: { icon: <Eye className="w-3.5 h-3.5" />, label: 'Issue', color: 'text-terminal-red' },
  CreateEvent: { icon: <GitCommit className="w-3.5 h-3.5" />, label: 'Created', color: 'text-primary' },
  DeleteEvent: { icon: <GitCommit className="w-3.5 h-3.5" />, label: 'Deleted', color: 'text-destructive' },
};

export function ContributionTimeline({ events }: ContributionTimelineProps) {
  const groupedEvents = useMemo(() => {
    const groups: Record<string, typeof events> = {};
    events.slice(0, 50).forEach(event => {
      const date = new Date(event.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      if (!groups[date]) groups[date] = [];
      groups[date].push(event);
    });
    return groups;
  }, [events]);

  if (!events.length) return null;

  return (
    <div className="score-card">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <GitCommit className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Recent Activity Timeline</h3>
        <span className="ml-auto text-xs text-muted-foreground">{events.length} events</span>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {Object.entries(groupedEvents).map(([date, dayEvents]) => (
          <div key={date}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-muted-foreground">{date}</span>
              <div className="flex-1 h-px bg-border/50" />
              <span className="text-[10px] text-muted-foreground">{dayEvents.length} events</span>
            </div>
            <div className="space-y-1 ml-2 border-l-2 border-border/30 pl-3">
              {dayEvents.map((event, i) => {
                const config = eventConfig[event.type] || { icon: <GitCommit className="w-3.5 h-3.5" />, label: event.type, color: 'text-muted-foreground' };
                const repoName = event.repo?.name?.split('/')[1] || event.repo?.name || '';
                return (
                  <div key={i} className="flex items-center gap-2 text-xs py-1">
                    <span className={`shrink-0 ${config.color}`}>{config.icon}</span>
                    <span className={`font-medium ${config.color}`}>{config.label}</span>
                    {repoName && <span className="text-muted-foreground truncate">{repoName}</span>}
                    <span className="text-muted-foreground/50 ml-auto shrink-0">
                      {new Date(event.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

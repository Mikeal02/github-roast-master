import { useMemo, useState } from 'react';
import { GitCommit, GitPullRequest, Star, GitFork, MessageSquare, Eye, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContributionTimelineProps {
  events: Array<{
    type: string;
    created_at: string;
    repo?: { name: string };
    payload?: any;
  }>;
}

const eventConfig: Record<string, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
  PushEvent: { icon: <GitCommit className="w-3.5 h-3.5" />, label: 'Pushed', color: 'text-terminal-green', bg: 'bg-terminal-green/10' },
  PullRequestEvent: { icon: <GitPullRequest className="w-3.5 h-3.5" />, label: 'PR', color: 'text-terminal-cyan', bg: 'bg-terminal-cyan/10' },
  WatchEvent: { icon: <Star className="w-3.5 h-3.5" />, label: 'Starred', color: 'text-terminal-yellow', bg: 'bg-terminal-yellow/10' },
  ForkEvent: { icon: <GitFork className="w-3.5 h-3.5" />, label: 'Forked', color: 'text-accent', bg: 'bg-accent/10' },
  IssueCommentEvent: { icon: <MessageSquare className="w-3.5 h-3.5" />, label: 'Commented', color: 'text-secondary', bg: 'bg-secondary/10' },
  IssuesEvent: { icon: <Eye className="w-3.5 h-3.5" />, label: 'Issue', color: 'text-terminal-red', bg: 'bg-terminal-red/10' },
  CreateEvent: { icon: <GitCommit className="w-3.5 h-3.5" />, label: 'Created', color: 'text-primary', bg: 'bg-primary/10' },
  DeleteEvent: { icon: <GitCommit className="w-3.5 h-3.5" />, label: 'Deleted', color: 'text-destructive', bg: 'bg-destructive/10' },
};

export function ContributionTimeline({ events }: ContributionTimelineProps) {
  const [filter, setFilter] = useState<string | null>(null);

  const eventTypeSummary = useMemo(() => {
    const counts: Record<string, number> = {};
    events.forEach(e => { counts[e.type] = (counts[e.type] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [events]);

  const filteredEvents = useMemo(() => {
    const filtered = filter ? events.filter(e => e.type === filter) : events;
    return filtered.slice(0, 80);
  }, [events, filter]);

  const groupedEvents = useMemo(() => {
    const groups: Record<string, typeof events> = {};
    filteredEvents.forEach(event => {
      const date = new Date(event.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      if (!groups[date]) groups[date] = [];
      groups[date].push(event);
    });
    return groups;
  }, [filteredEvents]);

  if (!events.length) return null;

  return (
    <div className="score-card">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <GitCommit className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Activity Timeline</h3>
        <span className="ml-auto text-xs text-muted-foreground">{events.length} events</span>
      </div>

      {/* Event type filters */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <motion.button
          onClick={() => setFilter(null)}
          className={`text-[10px] px-2 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
            !filter ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-muted/30 border-border/50 text-muted-foreground hover:text-foreground'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <Filter className="w-2.5 h-2.5" /> All
        </motion.button>
        {eventTypeSummary.slice(0, 6).map(([type, count]) => {
          const config = eventConfig[type];
          if (!config) return null;
          return (
            <motion.button
              key={type}
              onClick={() => setFilter(filter === type ? null : type)}
              className={`text-[10px] px-2 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                filter === type ? `${config.bg} border-current ${config.color}` : 'bg-muted/30 border-border/50 text-muted-foreground hover:text-foreground'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {config.icon} {config.label} <span className="font-mono opacity-60">{count}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 scrollbar-hide">
        <AnimatePresence mode="popLayout">
          {Object.entries(groupedEvents).map(([date, dayEvents]) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              layout
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-foreground">{date}</span>
                <div className="flex-1 h-px bg-border/50" />
                <span className="text-[10px] text-muted-foreground font-mono">{dayEvents.length}</span>
              </div>
              <div className="space-y-1 ml-2 border-l-2 border-border/30 pl-3">
                {dayEvents.map((event, i) => {
                  const config = eventConfig[event.type] || { icon: <GitCommit className="w-3.5 h-3.5" />, label: event.type.replace('Event', ''), color: 'text-muted-foreground', bg: 'bg-muted/10' };
                  const repoName = event.repo?.name?.split('/')[1] || event.repo?.name || '';
                  const commitCount = event.type === 'PushEvent' ? event.payload?.size || 0 : 0;
                  return (
                    <motion.div
                      key={i}
                      className={`flex items-center gap-2 text-xs py-1.5 px-2 rounded-lg hover:${config.bg} transition-colors group`}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.02 }}
                    >
                      <span className={`shrink-0 ${config.color}`}>{config.icon}</span>
                      <span className={`font-medium ${config.color} min-w-[60px]`}>{config.label}</span>
                      {repoName && (
                        <span className="text-foreground/70 truncate font-mono text-[10px] flex-1">{repoName}</span>
                      )}
                      {commitCount > 0 && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-terminal-green/10 text-terminal-green font-mono">
                          {commitCount} commit{commitCount !== 1 ? 's' : ''}
                        </span>
                      )}
                      <span className="text-muted-foreground/50 ml-auto shrink-0 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                        {new Date(event.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

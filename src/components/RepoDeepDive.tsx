import { useState } from 'react';
import { GitFork, Star, Code2, ExternalLink, ChevronDown, ChevronUp, Users, Calendar, FileText, Tag } from 'lucide-react';
import { fetchRepoLanguages, fetchRepoCommits, fetchRepoContributors, formatDate } from '@/lib/githubApi';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Repository {
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  url: string;
  full_name?: string;
  owner?: { login: string };
  open_issues_count?: number;
  size?: number;
  created_at?: string;
  updated_at?: string;
  topics?: string[];
  license?: { name: string } | null;
  watchers_count?: number;
}

interface RepoDeepDiveProps {
  repositories: Repository[];
  username: string;
}

const languageColors: Record<string, string> = {
  JavaScript: '#f7df1e', TypeScript: '#3178c6', Python: '#3776ab', Java: '#007396',
  Go: '#00ADD8', Rust: '#dea584', Ruby: '#CC342D', PHP: '#777BB4',
  'C++': '#00599C', C: '#555555', 'C#': '#239120', Swift: '#FA7343',
  Kotlin: '#7F52FF', Dart: '#00B4AB', HTML: '#E34F26', CSS: '#1572B6', Shell: '#89e051',
};

function RepoDetail({ repo, username }: { repo: Repository; username: string }) {
  const [expanded, setExpanded] = useState(false);
  const [languages, setLanguages] = useState<Record<string, number> | null>(null);
  const [commits, setCommits] = useState<any[] | null>(null);
  const [contributors, setContributors] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExpand = async () => {
    if (expanded) {
      setExpanded(false);
      return;
    }
    setExpanded(true);
    if (!languages) {
      setLoading(true);
      const [langs, comms, contribs] = await Promise.all([
        fetchRepoLanguages(username, repo.name),
        fetchRepoCommits(username, repo.name, 15),
        fetchRepoContributors(username, repo.name),
      ]);
      setLanguages(langs);
      setCommits(comms);
      setContributors(contribs);
      setLoading(false);
    }
  };

  const totalBytes = languages ? Object.values(languages).reduce((a, b) => a + b, 0) : 0;

  return (
    <div className="border border-border/50 rounded-lg overflow-hidden hover:border-primary/30 transition-colors">
      <button
        onClick={handleExpand}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Code2 className="w-4 h-4 text-primary shrink-0" />
            <h4 className="font-semibold text-foreground truncate">{repo.name}</h4>
            {repo.language && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {repo.language}
              </span>
            )}
          </div>
          {repo.description && (
            <p className="text-xs text-muted-foreground line-clamp-1 ml-6">{repo.description}</p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="w-3 h-3 text-terminal-yellow" /> {repo.stars}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <GitFork className="w-3 h-3 text-terminal-cyan" /> {repo.forks}
          </span>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border/50 p-4 bg-muted/10 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Repo metadata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {repo.created_at && (
                  <div className="text-center p-2 bg-muted/30 rounded-lg">
                    <Calendar className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="text-xs font-mono text-foreground">{formatDate(repo.created_at)}</p>
                  </div>
                )}
                {repo.updated_at && (
                  <div className="text-center p-2 bg-muted/30 rounded-lg">
                    <Calendar className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Updated</p>
                    <p className="text-xs font-mono text-foreground">{formatDate(repo.updated_at)}</p>
                  </div>
                )}
                <div className="text-center p-2 bg-muted/30 rounded-lg">
                  <FileText className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Size</p>
                  <p className="text-xs font-mono text-foreground">{repo.size ? `${(repo.size / 1024).toFixed(1)} MB` : 'N/A'}</p>
                </div>
                <div className="text-center p-2 bg-muted/30 rounded-lg">
                  <Users className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Issues</p>
                  <p className="text-xs font-mono text-foreground">{repo.open_issues_count ?? 0}</p>
                </div>
              </div>

              {/* Topics */}
              {repo.topics && repo.topics.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><Tag className="w-3 h-3" /> Topics</p>
                  <div className="flex flex-wrap gap-1.5">
                    {repo.topics.map(topic => (
                      <span key={topic} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Language breakdown */}
              {languages && totalBytes > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Language Breakdown</p>
                  <div className="flex h-3 rounded-full overflow-hidden bg-muted mb-2">
                    {Object.entries(languages).sort((a, b) => b[1] - a[1]).map(([lang, bytes]) => (
                      <div
                        key={lang}
                        className="h-full"
                        style={{
                          width: `${(bytes / totalBytes) * 100}%`,
                          backgroundColor: languageColors[lang] || '#888',
                        }}
                        title={`${lang}: ${((bytes / totalBytes) * 100).toFixed(1)}%`}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(languages).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([lang, bytes]) => (
                      <span key={lang} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: languageColors[lang] || '#888' }} />
                        {lang} {((bytes / totalBytes) * 100).toFixed(1)}%
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent commits */}
              {commits && commits.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Recent Commits ({commits.length})</p>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {commits.slice(0, 8).map((commit: any, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-xs p-2 bg-muted/20 rounded">
                        <span className="text-primary font-mono shrink-0">{commit.sha?.slice(0, 7)}</span>
                        <span className="text-foreground/80 truncate flex-1">{commit.commit?.message?.split('\n')[0]}</span>
                        <span className="text-muted-foreground shrink-0">
                          {commit.commit?.author?.date ? formatDate(commit.commit.author.date) : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contributors */}
              {contributors && contributors.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Top Contributors</p>
                  <TooltipProvider>
                    <div className="flex -space-x-2">
                      {contributors.slice(0, 8).map((c: any) => (
                        <Tooltip key={c.id}>
                          <TooltipTrigger>
                            <img
                              src={c.avatar_url}
                              alt={c.login}
                              className="w-8 h-8 rounded-full border-2 border-card hover:z-10 hover:scale-110 transition-transform"
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-semibold">@{c.login}</p>
                            <p className="text-xs text-muted-foreground">{c.contributions} contributions</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </TooltipProvider>
                </div>
              )}

              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                <ExternalLink className="w-3 h-3" /> View on GitHub
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function RepoDeepDive({ repositories, username }: RepoDeepDiveProps) {
  if (!repositories || repositories.length === 0) return null;

  return (
    <div className="score-card">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <Code2 className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Repository Deep Dive</h3>
        <span className="ml-auto text-xs text-muted-foreground">{repositories.length} repositories</span>
      </div>
      <div className="space-y-2">
        {repositories.map((repo) => (
          <RepoDetail key={repo.name} repo={repo} username={username} />
        ))}
      </div>
    </div>
  );
}

import { Star, GitFork, ExternalLink, Code2 } from 'lucide-react';

interface Repository {
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  url: string;
}

interface TopRepositoriesProps {
  repositories: Repository[];
}

const languageColors: Record<string, string> = {
  JavaScript: 'bg-yellow-400',
  TypeScript: 'bg-blue-400',
  Python: 'bg-green-400',
  Java: 'bg-orange-400',
  Go: 'bg-cyan-400',
  Rust: 'bg-orange-600',
  Ruby: 'bg-red-400',
  PHP: 'bg-purple-400',
  'C++': 'bg-pink-400',
  C: 'bg-gray-400',
  'C#': 'bg-green-600',
  Swift: 'bg-orange-500',
  Kotlin: 'bg-purple-500',
  Dart: 'bg-teal-400',
  Vue: 'bg-emerald-400',
  HTML: 'bg-red-500',
  CSS: 'bg-blue-500',
  Shell: 'bg-green-500',
};

export function TopRepositories({ repositories }: TopRepositoriesProps) {
  if (!repositories || repositories.length === 0) return null;

  return (
    <div className="score-card">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <Code2 className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Top Repositories</h3>
        <span className="ml-auto text-xs text-muted-foreground">{repositories.length} shown</span>
      </div>

      <div className="grid gap-3">
        {repositories.map((repo, index) => (
          <a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/50 hover:bg-muted/50 transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">#{index + 1}</span>
                  <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {repo.name}
                  </h4>
                  <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {repo.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {repo.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 mt-2">
              {repo.language && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className={`w-2.5 h-2.5 rounded-full ${languageColors[repo.language] || 'bg-gray-400'}`} />
                  {repo.language}
                </div>
              )}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="w-3 h-3 text-terminal-yellow" />
                {repo.stars.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <GitFork className="w-3 h-3 text-terminal-cyan" />
                {repo.forks.toLocaleString()}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

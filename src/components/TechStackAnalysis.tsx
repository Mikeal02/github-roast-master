import { Code2, Layers, TrendingUp, Award, GitFork, FileText, Scale } from 'lucide-react';

interface TechStackAnalysisProps {
  languages: Record<string, number>;
  totalRepos: number;
  repoTopics?: string[];
  reposWithLicense?: number;
  reposWithDescription?: number;
  conventionalCommitRatio?: number;
  sizeDistribution?: { tiny: number; small: number; medium: number; large: number };
}

const categoryMap: Record<string, { category: string; colorClass: string }> = {
  JavaScript: { category: 'Frontend', colorClass: 'bg-terminal-yellow' },
  TypeScript: { category: 'Frontend', colorClass: 'bg-terminal-cyan' },
  HTML: { category: 'Frontend', colorClass: 'bg-terminal-red' },
  CSS: { category: 'Frontend', colorClass: 'bg-terminal-cyan' },
  Vue: { category: 'Frontend', colorClass: 'bg-terminal-green' },
  Svelte: { category: 'Frontend', colorClass: 'bg-accent' },
  Python: { category: 'Backend', colorClass: 'bg-terminal-green' },
  Java: { category: 'Backend', colorClass: 'bg-accent' },
  Go: { category: 'Backend', colorClass: 'bg-terminal-cyan' },
  Rust: { category: 'Systems', colorClass: 'bg-accent' },
  'C++': { category: 'Systems', colorClass: 'bg-terminal-purple' },
  C: { category: 'Systems', colorClass: 'bg-muted-foreground' },
  Ruby: { category: 'Backend', colorClass: 'bg-terminal-red' },
  PHP: { category: 'Backend', colorClass: 'bg-terminal-purple' },
  Kotlin: { category: 'Mobile', colorClass: 'bg-terminal-purple' },
  Swift: { category: 'Mobile', colorClass: 'bg-accent' },
  Dart: { category: 'Mobile', colorClass: 'bg-terminal-cyan' },
  Shell: { category: 'DevOps', colorClass: 'bg-terminal-green' },
  Dockerfile: { category: 'DevOps', colorClass: 'bg-terminal-cyan' },
  Jupyter: { category: 'Data Science', colorClass: 'bg-accent' },
  R: { category: 'Data Science', colorClass: 'bg-terminal-cyan' },
};

export function TechStackAnalysis({ languages, totalRepos, repoTopics = [], reposWithLicense, reposWithDescription, conventionalCommitRatio, sizeDistribution }: TechStackAnalysisProps) {
  const entries = Object.entries(languages).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((s, [, v]) => s + v, 0);

  // Group by category
  const categories: Record<string, { count: number; languages: string[] }> = {};
  entries.forEach(([lang]) => {
    const cat = categoryMap[lang]?.category || 'Other';
    if (!categories[cat]) categories[cat] = { count: 0, languages: [] };
    categories[cat].count++;
    categories[cat].languages.push(lang);
  });

  const sortedCategories = Object.entries(categories).sort((a, b) => b[1].count - a[1].count);

  const primaryCategory = sortedCategories[0]?.[0] || 'Unknown';
  const diversityLevel = entries.length >= 8 ? 'Full-Stack Polyglot' : entries.length >= 5 ? 'Versatile Developer' : entries.length >= 3 ? 'Focused Specialist' : 'Niche Expert';

  return (
    <div className="glass-panel p-5">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <Layers className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-foreground">Tech Stack Analysis</h3>
        <span className="ml-auto text-xs text-muted-foreground">{entries.length} languages</span>
      </div>

      {/* Primary stack badge */}
      <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg border border-accent/20 mb-4">
        <Award className="w-5 h-5 text-accent" />
        <div>
          <p className="text-sm font-semibold text-foreground">{diversityLevel}</p>
          <p className="text-xs text-muted-foreground">Primary focus: {primaryCategory}</p>
        </div>
      </div>

      {/* Quality indicators */}
      {(reposWithLicense !== undefined || conventionalCommitRatio !== undefined) && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {reposWithLicense !== undefined && (
            <div className="text-center p-2 bg-muted/30 rounded-lg">
              <Scale className="w-3.5 h-3.5 text-terminal-cyan mx-auto mb-1" />
              <p className="text-xs font-bold text-foreground">{reposWithLicense}/{totalRepos}</p>
              <p className="text-[9px] text-muted-foreground">Licensed</p>
            </div>
          )}
          {reposWithDescription !== undefined && (
            <div className="text-center p-2 bg-muted/30 rounded-lg">
              <FileText className="w-3.5 h-3.5 text-terminal-green mx-auto mb-1" />
              <p className="text-xs font-bold text-foreground">{reposWithDescription}/{totalRepos}</p>
              <p className="text-[9px] text-muted-foreground">Documented</p>
            </div>
          )}
          {conventionalCommitRatio !== undefined && (
            <div className="text-center p-2 bg-muted/30 rounded-lg">
              <GitFork className="w-3.5 h-3.5 text-terminal-purple mx-auto mb-1" />
              <p className="text-xs font-bold text-foreground">{conventionalCommitRatio}%</p>
              <p className="text-[9px] text-muted-foreground">Conv. Commits</p>
            </div>
          )}
        </div>
      )}

      {/* Category breakdown */}
      <div className="space-y-3 mb-4">
        {sortedCategories.map(([category, data]) => (
          <div key={category}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-foreground font-medium">{category}</span>
              <span className="text-muted-foreground">{data.languages.length} lang • {Math.round((data.count / total) * 100)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 rounded-full"
                style={{ width: `${(data.count / total) * 100}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {data.languages.map(lang => (
                <span key={lang} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Repo size distribution */}
      {sizeDistribution && (
        <div className="pt-3 border-t border-border/50 mb-4">
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            📦 Project Size Distribution
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { label: 'Tiny', count: sizeDistribution.tiny, desc: '<100KB' },
              { label: 'Small', count: sizeDistribution.small, desc: '100KB–1MB' },
              { label: 'Medium', count: sizeDistribution.medium, desc: '1–10MB' },
              { label: 'Large', count: sizeDistribution.large, desc: '10MB+' },
            ].map(item => (
              <div key={item.label} className="text-center p-1.5 bg-muted/20 rounded-lg">
                <p className="text-xs font-bold text-foreground">{item.count}</p>
                <p className="text-[9px] text-muted-foreground">{item.label}</p>
                <p className="text-[8px] text-muted-foreground/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top language dominance */}
      {entries.length > 0 && (
        <div className="pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Language Dominance
          </p>
          <div className="space-y-1.5">
            {entries.slice(0, 5).map(([lang, count]) => (
              <div key={lang} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${categoryMap[lang]?.colorClass || 'bg-muted-foreground'}`} />
                <span className="text-xs text-foreground flex-1">{lang}</span>
                <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${categoryMap[lang]?.colorClass || 'bg-muted-foreground'}`}
                    style={{ width: `${(count / total) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground w-12 text-right">
                  {Math.round((count / total) * 100)}% ({count})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topics */}
      {repoTopics.length > 0 && (
        <div className="pt-3 mt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <Code2 className="w-3 h-3" /> Popular Topics
          </p>
          <div className="flex flex-wrap gap-1.5">
            {repoTopics.slice(0, 12).map(topic => (
              <span key={topic} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

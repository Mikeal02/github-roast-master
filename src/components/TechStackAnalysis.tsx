import { Code2, Layers, TrendingUp, Award } from 'lucide-react';

interface TechStackAnalysisProps {
  languages: Record<string, number>;
  totalRepos: number;
  repoTopics?: string[];
}

const categoryMap: Record<string, { category: string; color: string }> = {
  JavaScript: { category: 'Frontend', color: 'bg-yellow-400' },
  TypeScript: { category: 'Frontend', color: 'bg-blue-400' },
  HTML: { category: 'Frontend', color: 'bg-red-400' },
  CSS: { category: 'Frontend', color: 'bg-blue-500' },
  Vue: { category: 'Frontend', color: 'bg-emerald-400' },
  Svelte: { category: 'Frontend', color: 'bg-orange-500' },
  Python: { category: 'Backend', color: 'bg-green-400' },
  Java: { category: 'Backend', color: 'bg-orange-400' },
  Go: { category: 'Backend', color: 'bg-cyan-400' },
  Rust: { category: 'Systems', color: 'bg-orange-600' },
  'C++': { category: 'Systems', color: 'bg-pink-400' },
  C: { category: 'Systems', color: 'bg-gray-400' },
  Ruby: { category: 'Backend', color: 'bg-red-500' },
  PHP: { category: 'Backend', color: 'bg-purple-400' },
  Kotlin: { category: 'Mobile', color: 'bg-purple-500' },
  Swift: { category: 'Mobile', color: 'bg-orange-500' },
  Dart: { category: 'Mobile', color: 'bg-teal-400' },
  Shell: { category: 'DevOps', color: 'bg-green-500' },
  Dockerfile: { category: 'DevOps', color: 'bg-blue-600' },
  Jupyter: { category: 'Data Science', color: 'bg-orange-400' },
  R: { category: 'Data Science', color: 'bg-blue-300' },
};

export function TechStackAnalysis({ languages, totalRepos, repoTopics = [] }: TechStackAnalysisProps) {
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

  // Determine primary stack
  const primaryCategory = sortedCategories[0]?.[0] || 'Unknown';
  const diversityLevel = entries.length >= 8 ? 'Full-Stack Polyglot' : entries.length >= 5 ? 'Versatile Developer' : entries.length >= 3 ? 'Focused Specialist' : 'Niche Expert';

  return (
    <div className="score-card">
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

      {/* Category breakdown */}
      <div className="space-y-3 mb-4">
        {sortedCategories.map(([category, data]) => (
          <div key={category}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-foreground font-medium">{category}</span>
              <span className="text-muted-foreground">{data.languages.length} languages</span>
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

      {/* Top language dominance */}
      {entries.length > 0 && (
        <div className="pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Language Dominance
          </p>
          <div className="space-y-1.5">
            {entries.slice(0, 5).map(([lang, count]) => (
              <div key={lang} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${categoryMap[lang]?.color || 'bg-gray-400'}`} />
                <span className="text-xs text-foreground flex-1">{lang}</span>
                <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${categoryMap[lang]?.color || 'bg-gray-400'}`}
                    style={{ width: `${(count / total) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">
                  {Math.round((count / total) * 100)}%
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

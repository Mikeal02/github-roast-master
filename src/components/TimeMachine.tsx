import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, GitFork, Star, Code2, TrendingUp, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface TimeMachineProps {
  repos: any[];
  userData: any;
  languages: Record<string, number>;
  totalStars: number;
  languagesByYear?: Record<number, Record<string, number>>;
}

interface YearSnapshot {
  year: number;
  reposCreated: number;
  cumulativeRepos: number;
  languages: Record<string, number>;
  topLanguage: string;
  stars: number;
  cumulativeStars: number;
  forks: number;
  cumulativeForks: number;
  repos: any[];
  growthRate: number; // % change from prev year in repos
  starsGrowthRate: number;
  avgStarsPerRepo: number;
  newLanguages: string[];
}

export function TimeMachine({ repos, userData, languages, totalStars, languagesByYear }: TimeMachineProps) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const { snapshots, years } = useMemo(() => {
    const byYear: Record<number, any[]> = {};
    repos.forEach((r: any) => {
      const y = new Date(r.created_at).getFullYear();
      if (!byYear[y]) byYear[y] = [];
      byYear[y].push(r);
    });

    const joinYear = new Date(userData.created_at).getFullYear();
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let y = joinYear; y <= currentYear; y++) years.push(y);

    let cumRepos = 0, cumStars = 0, cumForks = 0;
    const allSeenLanguages = new Set<string>();
    const snapshots: YearSnapshot[] = years.map((year, idx) => {
      const yearRepos = byYear[year] || [];
      const langs: Record<string, number> = {};
      let stars = 0, forks = 0;

      yearRepos.forEach((r: any) => {
        if (r.language) langs[r.language] = (langs[r.language] || 0) + 1;
        stars += r.stargazers_count || 0;
        forks += r.forks_count || 0;
      });

      // Detect new languages this year
      const newLanguages = Object.keys(langs).filter(l => !allSeenLanguages.has(l));
      Object.keys(langs).forEach(l => allSeenLanguages.add(l));

      const prevRepos = cumRepos;
      const prevStars = cumStars;
      cumRepos += yearRepos.length;
      cumStars += stars;
      cumForks += forks;

      const growthRate = prevRepos > 0 ? +((yearRepos.length / prevRepos) * 100).toFixed(0) : (yearRepos.length > 0 ? 100 : 0);
      const starsGrowthRate = prevStars > 0 ? +((stars / prevStars) * 100).toFixed(0) : (stars > 0 ? 100 : 0);
      const avgStarsPerRepo = yearRepos.length > 0 ? +(stars / yearRepos.length).toFixed(1) : 0;

      const topLang = Object.entries(langs).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

      return {
        year,
        reposCreated: yearRepos.length,
        cumulativeRepos: cumRepos,
        languages: langs,
        topLanguage: topLang,
        stars,
        cumulativeStars: cumStars,
        forks,
        cumulativeForks: cumForks,
        repos: yearRepos.sort((a: any, b: any) => (b.stargazers_count || 0) - (a.stargazers_count || 0)),
        growthRate,
        starsGrowthRate,
        avgStarsPerRepo,
        newLanguages,
      };
    });

    return { snapshots, years };
  }, [repos, userData]);

  const maxRepos = Math.max(...snapshots.map((s) => s.reposCreated), 1);
  const maxStars = Math.max(...snapshots.map((s) => s.stars), 1);

  const selected = selectedYear !== null ? snapshots.find((s) => s.year === selectedYear) : null;
  const selectedIdx = selected ? snapshots.indexOf(selected) : -1;
  const prevSnapshot = selectedIdx > 0 ? snapshots[selectedIdx - 1] : null;

  const navYear = (dir: number) => {
    const idx = years.indexOf(selectedYear || years[years.length - 1]);
    const next = years[Math.max(0, Math.min(years.length - 1, idx + dir))];
    setSelectedYear(next);
  };

  const GrowthIndicator = ({ current, previous, label }: { current: number; previous: number; label: string }) => {
    const diff = current - previous;
    const icon = diff > 0 ? <ArrowUpRight className="w-3 h-3" /> : diff < 0 ? <ArrowDownRight className="w-3 h-3" /> : <Minus className="w-3 h-3" />;
    const color = diff > 0 ? 'text-terminal-green' : diff < 0 ? 'text-terminal-red' : 'text-muted-foreground';
    return (
      <span className={`flex items-center gap-0.5 text-[9px] ${color}`}>
        {icon} {diff > 0 ? '+' : ''}{diff} vs prev
      </span>
    );
  };

  return (
    <div className="score-card">
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
        <Clock className="w-5 h-5 text-secondary" />
        <h3 className="font-semibold text-foreground">Time Machine</h3>
        <span className="ml-auto text-xs text-muted-foreground font-mono">
          {years[0]}–{years[years.length - 1]} ({years.length} years)
        </span>
      </div>

      {/* Timeline chart */}
      <div className="mb-6">
        <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> Repos Created Per Year
        </p>
        <div className="flex items-end gap-1 h-28">
          {snapshots.map((s, i) => {
            const h = (s.reposCreated / maxRepos) * 100;
            const isSelected = s.year === selectedYear;
            return (
              <motion.button
                key={s.year}
                onClick={() => setSelectedYear(s.year)}
                className={`flex-1 rounded-t-md relative group cursor-pointer transition-all ${
                  isSelected ? 'ring-2 ring-primary ring-offset-1 ring-offset-background' : ''
                }`}
                style={{
                  background: isSelected
                    ? 'linear-gradient(to top, hsl(var(--primary)), hsl(var(--secondary)))'
                    : `linear-gradient(to top, hsl(var(--primary) / ${0.15 + (h / 100) * 0.6}), hsl(var(--secondary) / ${0.1 + (h / 100) * 0.4}))`,
                }}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(6, h)}%` }}
                transition={{ delay: i * 0.04, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-card border border-border rounded px-1.5 py-0.5 text-[9px] text-foreground whitespace-nowrap shadow-lg">
                    {s.reposCreated} repos
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
        <div className="flex justify-between mt-1.5">
          {snapshots.map((s) => (
            <span
              key={s.year}
              className={`text-[8px] flex-1 text-center ${
                s.year === selectedYear ? 'text-primary font-bold' : 'text-muted-foreground'
              }`}
            >
              {String(s.year).slice(2)}
            </span>
          ))}
        </div>
      </div>

      {/* Stars timeline */}
      <div className="mb-6">
        <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
          <Star className="w-3 h-3" /> Stars Earned Per Year
        </p>
        <div className="flex items-end gap-1 h-20">
          {snapshots.map((s, i) => {
            const h = (s.stars / maxStars) * 100;
            return (
              <motion.div
                key={s.year}
                className="flex-1 rounded-t-md group relative cursor-pointer"
                style={{
                  background: `linear-gradient(to top, hsl(var(--terminal-yellow) / ${0.15 + (h / 100) * 0.7}), hsl(var(--terminal-yellow) / ${0.05 + (h / 100) * 0.4}))`,
                }}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(4, h)}%` }}
                transition={{ delay: 0.3 + i * 0.04, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setSelectedYear(s.year)}
              >
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-card border border-border rounded px-1.5 py-0.5 text-[9px] text-foreground whitespace-nowrap shadow-lg">
                    ⭐ {s.stars.toLocaleString()}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Cumulative growth */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Repos', value: snapshots[snapshots.length - 1]?.cumulativeRepos || 0, icon: <GitFork className="w-3.5 h-3.5" /> },
          { label: 'Total Stars', value: snapshots[snapshots.length - 1]?.cumulativeStars || 0, icon: <Star className="w-3.5 h-3.5" /> },
          { label: 'Total Forks', value: snapshots[snapshots.length - 1]?.cumulativeForks || 0, icon: <GitFork className="w-3.5 h-3.5" /> },
          { label: 'Languages', value: Object.keys(languages).length, icon: <Code2 className="w-3.5 h-3.5" /> },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            className="text-center p-3 bg-muted/30 rounded-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
          >
            <div className="flex justify-center mb-1 text-primary">{item.icon}</div>
            <p className="stat-value text-lg">{item.value.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">{item.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Year detail panel */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected.year}
            className="border border-border rounded-xl p-4 bg-muted/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => navYear(-1)} className="p-1 rounded hover:bg-muted transition-colors">
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              </button>
              <div className="text-center">
                <h4 className="text-xl font-bold text-primary font-mono">{selected.year}</h4>
                <p className="text-[10px] text-muted-foreground">Year in Review</p>
              </div>
              <button onClick={() => navYear(1)} className="p-1 rounded hover:bg-muted transition-colors">
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                { label: 'New Repos', val: selected.reposCreated },
                { label: 'Stars', val: selected.stars },
                { label: 'Forks', val: selected.forks },
                { label: 'Avg ⭐/Repo', val: selected.avgStarsPerRepo },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  className="text-center p-2 bg-card rounded-lg border border-border/50"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <p className="text-xs font-bold text-foreground">{typeof item.val === 'number' ? item.val.toLocaleString() : item.val}</p>
                  <p className="text-[9px] text-muted-foreground">{item.label}</p>
                  {prevSnapshot && typeof item.val === 'number' && (
                    <GrowthIndicator
                      current={item.val}
                      previous={
                        item.label === 'New Repos' ? prevSnapshot.reposCreated :
                        item.label === 'Stars' ? prevSnapshot.stars :
                        item.label === 'Forks' ? prevSnapshot.forks :
                        prevSnapshot.avgStarsPerRepo
                      }
                      label={item.label}
                    />
                  )}
                </motion.div>
              ))}
            </div>

            {/* New languages learned this year */}
            {selected.newLanguages.length > 0 && (
              <div className="mb-3">
                <p className="text-[10px] text-terminal-green mb-1.5 font-medium">🆕 New Languages This Year</p>
                <div className="flex gap-1 flex-wrap">
                  {selected.newLanguages.map((lang) => (
                    <span
                      key={lang}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-terminal-green/10 text-terminal-green border border-terminal-green/20"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Language breakdown for the year */}
            {Object.keys(selected.languages).length > 0 && (
              <div className="mb-3">
                <p className="text-[10px] text-muted-foreground mb-1.5">Languages Used</p>
                <div className="flex gap-1 flex-wrap">
                  {Object.entries(selected.languages)
                    .sort((a, b) => b[1] - a[1])
                    .map(([lang, count]) => (
                      <span
                        key={lang}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
                      >
                        {lang} ({count})
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Top repos for the year */}
            {selected.repos.length > 0 && (
              <div>
                <p className="text-[10px] text-muted-foreground mb-1.5">Top Repos This Year</p>
                <div className="space-y-1">
                  {selected.repos.slice(0, 5).map((r: any, i: number) => (
                    <motion.div
                      key={r.name}
                      className="flex items-center gap-2 text-xs p-1.5 rounded-lg bg-card/50"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <span className="text-muted-foreground">{i + 1}.</span>
                      <span className="font-medium text-foreground truncate flex-1">{r.name}</span>
                      {r.language && (
                        <span className="text-[9px] text-muted-foreground">{r.language}</span>
                      )}
                      <span className="text-terminal-yellow text-[10px]">⭐ {r.stargazers_count || 0}</span>
                      <span className="text-terminal-cyan text-[10px]">🍴 {r.forks_count || 0}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!selected && (
        <p className="text-center text-xs text-muted-foreground py-4">
          Click a bar above to explore a specific year
        </p>
      )}
    </div>
  );
}

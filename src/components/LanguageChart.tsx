const languageColors: Record<string, string> = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python: '#3776ab',
  Java: '#007396',
  'C++': '#00599C',
  C: '#555555',
  'C#': '#239120',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#CC342D',
  PHP: '#777BB4',
  Swift: '#FA7343',
  Kotlin: '#7F52FF',
  Dart: '#00B4AB',
  HTML: '#E34F26',
  CSS: '#1572B6',
  Shell: '#89e051',
  Vue: '#4FC08D',
  Svelte: '#FF3E00',
};

interface LanguageChartProps {
  languages: Record<string, number> | Array<[string, number]>;
}

export function LanguageChart({ languages }: LanguageChartProps) {
  // Convert to array format if it's an object
  const languageArray: Array<[string, number]> = Array.isArray(languages) 
    ? languages 
    : Object.entries(languages || {});
  
  const total = languageArray.reduce((sum, [_, count]) => sum + count, 0);
  
  const getColor = (lang: string) => {
    return languageColors[lang] || `hsl(${Math.abs(lang.charCodeAt(0) * 10) % 360}, 70%, 50%)`;
  };

  if (languageArray.length === 0 || total === 0) {
    return (
      <div className="score-card text-center py-8">
        <p className="text-muted-foreground">No language data available</p>
      </div>
    );
  }

  // Sort by count descending
  const sortedLanguages = [...languageArray].sort((a, b) => b[1] - a[1]);

  return (
    <div className="score-card">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">
        Language Distribution
      </h3>
      
      <div className="flex h-4 rounded-full overflow-hidden bg-muted mb-4">
        {sortedLanguages.map(([lang, count], index) => (
          <div
            key={lang}
            className="h-full transition-all duration-500"
            style={{
              width: `${(count / total) * 100}%`,
              backgroundColor: getColor(lang),
              transitionDelay: `${index * 100}ms`,
            }}
            title={`${lang}: ${count} repos`}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {sortedLanguages.slice(0, 6).map(([lang, count]) => (
          <div key={lang} className="flex items-center gap-2 text-xs">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getColor(lang) }}
            />
            <span className="text-foreground truncate">{lang}</span>
            <span className="text-muted-foreground ml-auto">
              {Math.round((count / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

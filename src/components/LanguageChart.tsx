import { useState } from 'react';
import { motion } from 'framer-motion';

const languageColors: Record<string, string> = {
  JavaScript: '#f7df1e', TypeScript: '#3178c6', Python: '#3776ab', Java: '#007396',
  'C++': '#00599C', C: '#555555', 'C#': '#239120', Go: '#00ADD8',
  Rust: '#dea584', Ruby: '#CC342D', PHP: '#777BB4', Swift: '#FA7343',
  Kotlin: '#7F52FF', Dart: '#00B4AB', HTML: '#E34F26', CSS: '#1572B6',
  Shell: '#89e051', Vue: '#4FC08D', Svelte: '#FF3E00', Lua: '#000080',
  Perl: '#0298c3', Scala: '#DC322F', Haskell: '#5e5086', Elixir: '#6e4a7e',
  Clojure: '#db5855', Zig: '#F7A41D', Nim: '#FFE953', OCaml: '#ee6a1a',
};

interface LanguageChartProps {
  languages: Record<string, number> | Array<[string, number]>;
}

export function LanguageChart({ languages }: LanguageChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const languageArray: Array<[string, number]> = Array.isArray(languages) 
    ? languages 
    : Object.entries(languages || {});
  
  const total = languageArray.reduce((sum, [_, count]) => sum + count, 0);
  
  const getColor = (lang: string) => {
    return languageColors[lang] || `hsl(${Math.abs(lang.charCodeAt(0) * 37) % 360}, 65%, 55%)`;
  };

  if (languageArray.length === 0 || total === 0) {
    return (
      <div className="score-card text-center py-8">
        <p className="text-muted-foreground">No language data available</p>
      </div>
    );
  }

  const sortedLanguages = [...languageArray].sort((a, b) => b[1] - a[1]);

  // SVG donut chart
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 85;
  const innerR = 55;
  let cumulativePercent = 0;

  const segments = sortedLanguages.map(([lang, count], i) => {
    const percent = count / total;
    const startAngle = cumulativePercent * 2 * Math.PI - Math.PI / 2;
    cumulativePercent += percent;
    const endAngle = cumulativePercent * 2 * Math.PI - Math.PI / 2;
    
    const largeArc = percent > 0.5 ? 1 : 0;
    
    const x1o = cx + outerR * Math.cos(startAngle);
    const y1o = cy + outerR * Math.sin(startAngle);
    const x2o = cx + outerR * Math.cos(endAngle);
    const y2o = cy + outerR * Math.sin(endAngle);
    const x1i = cx + innerR * Math.cos(endAngle);
    const y1i = cy + innerR * Math.sin(endAngle);
    const x2i = cx + innerR * Math.cos(startAngle);
    const y2i = cy + innerR * Math.sin(startAngle);
    
    const path = [
      `M ${x1o} ${y1o}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2o} ${y2o}`,
      `L ${x1i} ${y1i}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${x2i} ${y2i}`,
      'Z',
    ].join(' ');

    return { lang, count, percent, path, index: i, color: getColor(lang) };
  });

  const displayLang = hoveredIndex !== null ? sortedLanguages[hoveredIndex] : sortedLanguages[0];
  const displayPercent = displayLang ? Math.round((displayLang[1] / total) * 100) : 0;
  const displayName = displayLang ? displayLang[0] : '';

  return (
    <div className="score-card">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">
        Language Distribution
      </h3>
      
      <div className="flex flex-col items-center gap-4">
        {/* Donut chart */}
        <div className="relative">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {segments.map((seg) => (
              <motion.path
                key={seg.lang}
                d={seg.path}
                fill={seg.color}
                stroke="hsl(var(--card))"
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredIndex(seg.index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer transition-opacity"
                style={{
                  opacity: hoveredIndex === null || hoveredIndex === seg.index ? 1 : 0.4,
                  filter: hoveredIndex === seg.index ? `drop-shadow(0 0 6px ${seg.color})` : 'none',
                }}
                initial={{ scale: 0, transformOrigin: `${cx}px ${cy}px` }}
                animate={{ scale: hoveredIndex === seg.index ? 1.04 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            ))}
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.span
              key={displayName}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold font-mono text-foreground"
            >
              {displayPercent}%
            </motion.span>
            <motion.span
              key={`name-${displayName}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[11px] text-muted-foreground font-medium max-w-[80px] text-center truncate"
            >
              {displayName}
            </motion.span>
            <span className="text-[9px] text-muted-foreground/60 mt-0.5">{sortedLanguages.length} langs</span>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full grid grid-cols-2 gap-1.5">
          {sortedLanguages.slice(0, 8).map(([lang, count], i) => (
            <motion.div
              key={lang}
              className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                hoveredIndex === i ? 'bg-muted' : 'hover:bg-muted/50'
              }`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: getColor(lang) }} />
              <span className="text-foreground truncate flex-1">{lang}</span>
              <span className="text-muted-foreground font-mono">{Math.round((count / total) * 100)}%</span>
            </motion.div>
          ))}
        </div>

        {/* Diversity indicator */}
        <div className="w-full pt-3 border-t border-border/50 flex items-center justify-between text-[10px]">
          <span className="text-muted-foreground">Diversity Index</span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
                style={{ width: `${Math.min(sortedLanguages.length * 10, 100)}%` }}
              />
            </div>
            <span className="font-mono text-foreground">{sortedLanguages.length >= 8 ? 'High' : sortedLanguages.length >= 4 ? 'Medium' : 'Low'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useRef, useMemo, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Dna, X, Filter, BarChart3, Sparkles, Shield, Zap, Link2 } from 'lucide-react';

interface DeveloperDNAProps {
  languages: Record<string, number>;
  scores: {
    activity?: { score: number };
    documentation?: { score: number };
    popularity?: { score: number };
    diversity?: { score: number };
    codeQuality?: { score: number };
    collaboration?: { score: number };
    overall?: { score: number };
  };
  personality?: {
    focusType?: string;
    learningStyle?: string;
    personalityType?: { type: string; emoji: string };
    metrics?: {
      consistency: number;
      exploration: number;
      collaboration: number;
      documentation: number;
    };
    peakActivityDay?: string;
    burnoutRisk?: number;
    procrastinationTendency?: number;
  };
  streaks?: {
    currentStreak: number;
    longestStreak: number;
    peakHour?: string;
  };
  userData?: {
    followers: number;
    public_repos: number;
    created_at: string;
    following?: number;
  };
}

interface DNANode {
  id: string;
  label: string;
  value: string;
  numericValue: number;
  category: 'language' | 'score' | 'personality' | 'activity' | 'social';
  color: string;
  intensity: number;
}

const categoryColors: Record<string, string> = {
  language: 'var(--terminal-cyan)',
  score: 'var(--primary)',
  personality: 'var(--accent)',
  activity: 'var(--terminal-green)',
  social: 'var(--terminal-yellow)',
};

const categoryLabels: Record<string, string> = {
  language: 'Languages',
  score: 'Skill Scores',
  personality: 'Personality',
  activity: 'Activity',
  social: 'Social',
};

const categoryIcons: Record<string, typeof Dna> = {
  language: Zap,
  score: Shield,
  personality: Sparkles,
  activity: BarChart3,
  social: Link2,
};

export function DeveloperDNA({ languages, scores, personality, streaks, userData }: DeveloperDNAProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const [activeNode, setActiveNode] = useState<DNANode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const nodes = useMemo(() => {
    const result: DNANode[] = [];

    const langEntries = Object.entries(languages || {}).sort((a, b) => b[1] - a[1]);
    const langTotal = langEntries.reduce((s, [, v]) => s + v, 0);
    langEntries.slice(0, 6).forEach(([lang, count]) => {
      const pct = Math.round((count / langTotal) * 100);
      result.push({
        id: `lang-${lang}`, label: lang, value: `${pct}% of repos`,
        numericValue: pct, category: 'language', color: categoryColors.language,
        intensity: count / (langEntries[0]?.[1] || 1),
      });
    });

    const scoreEntries: [string, number][] = [
      ['Activity', scores?.activity?.score || 0],
      ['Documentation', scores?.documentation?.score || 0],
      ['Popularity', scores?.popularity?.score || 0],
      ['Diversity', scores?.diversity?.score || 0],
      ['Code Quality', scores?.codeQuality?.score || 0],
      ['Collaboration', scores?.collaboration?.score || 0],
    ];
    scoreEntries.forEach(([name, val]) => {
      result.push({
        id: `score-${name}`, label: name, value: `${val}/100`,
        numericValue: val, category: 'score', color: categoryColors.score,
        intensity: val / 100,
      });
    });

    if (personality) {
      if (personality.personalityType) {
        result.push({
          id: 'pers-type', label: 'Personality', value: `${personality.personalityType.emoji} ${personality.personalityType.type}`,
          numericValue: 90, category: 'personality', color: categoryColors.personality, intensity: 0.9,
        });
      }
      if (personality.focusType) {
        result.push({
          id: 'pers-focus', label: 'Focus Type', value: personality.focusType,
          numericValue: 70, category: 'personality', color: categoryColors.personality, intensity: 0.7,
        });
      }
      if (personality.learningStyle) {
        result.push({
          id: 'pers-learn', label: 'Learning Style', value: personality.learningStyle,
          numericValue: 60, category: 'personality', color: categoryColors.personality, intensity: 0.6,
        });
      }
      if (personality.metrics) {
        result.push({
          id: 'pers-consistency', label: 'Consistency', value: `${personality.metrics.consistency}%`,
          numericValue: personality.metrics.consistency, category: 'personality', color: categoryColors.personality,
          intensity: personality.metrics.consistency / 100,
        });
        result.push({
          id: 'pers-exploration', label: 'Exploration', value: `${personality.metrics.exploration}%`,
          numericValue: personality.metrics.exploration, category: 'personality', color: categoryColors.personality,
          intensity: personality.metrics.exploration / 100,
        });
      }
      if (personality.burnoutRisk !== undefined) {
        result.push({
          id: 'pers-burnout', label: 'Burnout Risk', value: `${personality.burnoutRisk}%`,
          numericValue: personality.burnoutRisk, category: 'personality', color: categoryColors.personality,
          intensity: personality.burnoutRisk / 100,
        });
      }
    }

    if (streaks) {
      result.push({
        id: 'act-current', label: 'Current Streak', value: `${streaks.currentStreak} days`,
        numericValue: Math.min(streaks.currentStreak * 3.3, 100), category: 'activity',
        color: categoryColors.activity, intensity: Math.min(streaks.currentStreak / 30, 1),
      });
      result.push({
        id: 'act-longest', label: 'Longest Streak', value: `${streaks.longestStreak} days`,
        numericValue: Math.min(streaks.longestStreak * 1.67, 100), category: 'activity',
        color: categoryColors.activity, intensity: Math.min(streaks.longestStreak / 60, 1),
      });
      if (streaks.peakHour) {
        result.push({
          id: 'act-peak', label: 'Peak Hour', value: streaks.peakHour,
          numericValue: 50, category: 'activity', color: categoryColors.activity, intensity: 0.5,
        });
      }
    }
    if (personality?.peakActivityDay) {
      result.push({
        id: 'act-day', label: 'Peak Day', value: personality.peakActivityDay,
        numericValue: 60, category: 'activity', color: categoryColors.activity, intensity: 0.6,
      });
    }

    if (userData) {
      result.push({
        id: 'soc-followers', label: 'Followers', value: userData.followers.toLocaleString(),
        numericValue: Math.min(userData.followers / 10, 100), category: 'social',
        color: categoryColors.social, intensity: Math.min(userData.followers / 1000, 1),
      });
      result.push({
        id: 'soc-repos', label: 'Public Repos', value: `${userData.public_repos}`,
        numericValue: Math.min(userData.public_repos * 2, 100), category: 'social',
        color: categoryColors.social, intensity: Math.min(userData.public_repos / 50, 1),
      });
      const years = Math.floor((Date.now() - new Date(userData.created_at).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      result.push({
        id: 'soc-age', label: 'Account Age', value: `${years} years`,
        numericValue: Math.min(years * 10, 100), category: 'social',
        color: categoryColors.social, intensity: Math.min(years / 10, 1),
      });
      if (userData.following !== undefined) {
        const ratio = userData.followers > 0 ? +(userData.following / userData.followers).toFixed(2) : 0;
        result.push({
          id: 'soc-ratio', label: 'Follow Ratio', value: `${ratio}x`,
          numericValue: Math.min(ratio * 20, 100), category: 'social',
          color: categoryColors.social, intensity: Math.min(ratio / 5, 1),
        });
      }
    }

    return result;
  }, [languages, scores, personality, streaks, userData]);

  const filteredNodes = activeFilter ? nodes.filter(n => n.category === activeFilter) : nodes;

  // Genome summary stats
  const genomeSummary = useMemo(() => {
    const avgIntensity = Math.round(nodes.reduce((s, n) => s + n.intensity, 0) / nodes.length * 100);
    const categoryIntensities = nodes.reduce((acc, n) => {
      acc[n.category] = (acc[n.category] || 0) + n.intensity;
      return acc;
    }, {} as Record<string, number>);
    const dominantCategory = Object.entries(categoryIntensities).sort((a, b) => b[1] - a[1])[0]?.[0] || 'score';
    const strongTraits = nodes.filter(n => n.intensity >= 0.7).length;
    const weakTraits = nodes.filter(n => n.intensity < 0.3).length;
    
    // Genome completeness: how many categories have strong representation
    const categoriesWithData = new Set(nodes.map(n => n.category)).size;
    const completeness = Math.round((categoriesWithData / 5) * 100);
    
    // Specialization index: how concentrated is the intensity
    const categoryVals = Object.values(categoryIntensities);
    const maxCatIntensity = Math.max(...categoryVals);
    const totalIntensity = categoryVals.reduce((a, b) => a + b, 0);
    const specialization = totalIntensity > 0 ? Math.round((maxCatIntensity / totalIntensity) * 100) : 0;

    // Trait correlations
    const scoreNodes = nodes.filter(n => n.category === 'score');
    const avgScore = scoreNodes.length > 0 ? Math.round(scoreNodes.reduce((s, n) => s + n.numericValue, 0) / scoreNodes.length) : 0;

    return { avgIntensity, dominantCategory, strongTraits, weakTraits, totalTraits: nodes.length, completeness, specialization, avgScore };
  }, [nodes]);

  // SVG dimensions
  const svgWidth = 700;
  const svgHeight = Math.max(600, filteredNodes.length * 28 + 100);
  const centerX = svgWidth / 2;
  const helixAmplitude = 120;
  const nodeSpacing = 28;
  const startY = 60;

  const getHelixX = (t: number, strand: 'left' | 'right') => {
    const phase = strand === 'left' ? 0 : Math.PI;
    return centerX + Math.sin(t * 0.12 + phase) * helixAmplitude;
  };

  const pathPoints = (strand: 'left' | 'right') => {
    const pts: string[] = [];
    for (let i = 0; i <= filteredNodes.length + 4; i++) {
      const y = startY + i * nodeSpacing;
      const x = getHelixX(i, strand);
      pts.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
    }
    return pts.join(' ');
  };

  const leftPath = pathPoints('left');
  const rightPath = pathPoints('right');

  return (
    <div ref={ref} className="glass-panel p-5">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <Dna className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-foreground">Developer DNA</h3>
        <span className="ml-auto text-xs text-muted-foreground">{genomeSummary.totalTraits} traits encoded</span>
      </div>

      {/* Enhanced Genome Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4"
      >
        {[
          { label: 'Genome Completeness', value: `${genomeSummary.completeness}%`, icon: Dna, color: 'text-accent' },
          { label: 'Avg Intensity', value: `${genomeSummary.avgIntensity}%`, icon: BarChart3, color: 'text-primary' },
          { label: 'Strong / Weak', value: `${genomeSummary.strongTraits} / ${genomeSummary.weakTraits}`, icon: Sparkles, color: 'text-terminal-green' },
          { label: 'Specialization', value: `${genomeSummary.specialization}%`, icon: Filter, color: 'text-terminal-cyan' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="text-center p-2.5 bg-muted/30 rounded-lg border border-border/30"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 + i * 0.08 }}
          >
            <stat.icon className={`w-3.5 h-3.5 mx-auto mb-1 ${stat.color}`} />
            <p className={`text-sm font-bold font-mono ${stat.color}`}>{stat.value}</p>
            <p className="text-[8px] text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Dominant Category Highlight */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-3 p-3 mb-4 bg-accent/5 rounded-xl border border-accent/20"
      >
        <span className="text-accent text-sm font-medium">Dominant Gene:</span>
        <span className="text-foreground font-bold text-sm">{categoryLabels[genomeSummary.dominantCategory]}</span>
        <span className="text-muted-foreground text-xs ml-auto">Avg Score: {genomeSummary.avgScore}/100</span>
      </motion.div>

      {/* Category Filter + Legend */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setActiveFilter(null)}
          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition-colors ${
            !activeFilter ? 'bg-primary/10 border-primary/30 text-primary' : 'border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          All ({nodes.length})
        </button>
        {Object.entries(categoryLabels).map(([key, label]) => {
          const Icon = categoryIcons[key] || Dna;
          const count = nodes.filter(n => n.category === key).length;
          return (
            <button
              key={key}
              onClick={() => setActiveFilter(activeFilter === key ? null : key)}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                activeFilter === key ? 'bg-primary/10 border-primary/30 text-primary' : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{label}</span>
              <span className="text-[9px] opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* DNA Visualization */}
      <div className="relative overflow-hidden">
        <div className="overflow-x-auto flex justify-center">
          <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="max-w-full">
            <defs>
              {Object.entries(categoryColors).map(([key]) => (
                <filter key={key} id={`glow-${key}`}>
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              ))}
              <linearGradient id="helix-gradient-left" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
                <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.6" />
                <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="helix-gradient-right" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity="0.6" />
                <stop offset="50%" stopColor="hsl(var(--terminal-green))" stopOpacity="0.6" />
                <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Helix strands */}
            <motion.path d={leftPath} fill="none" stroke="url(#helix-gradient-left)" strokeWidth="2.5" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }} animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }} />
            <motion.path d={rightPath} fill="none" stroke="url(#helix-gradient-right)" strokeWidth="2.5" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }} animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }} />

            {/* Nodes */}
            {filteredNodes.map((node, i) => {
              const y = startY + (i + 2) * nodeSpacing;
              const leftX = getHelixX(i + 2, 'left');
              const rightX = getHelixX(i + 2, 'right');
              const isLeft = i % 2 === 0;
              const nodeX = isLeft ? leftX : rightX;
              const labelX = isLeft ? leftX - 12 : rightX + 12;
              const anchor = isLeft ? 'end' : 'start';
              const nodeSize = 5 + node.intensity * 6;
              const isHovered = hoveredNode === node.id;
              const isDominant = node.intensity >= 0.7;

              return (
                <motion.g key={node.id} initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.8 + i * 0.06, duration: 0.4 }}>
                  {/* Rung */}
                  <motion.line x1={leftX} y1={y} x2={rightX} y2={y}
                    stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="3 3"
                    initial={{ opacity: 0 }} animate={isInView ? { opacity: 0.4 } : {}} transition={{ delay: 1 + i * 0.05 }} />

                  {/* Intensity bar along rung */}
                  <motion.line
                    x1={Math.min(leftX, rightX)} y1={y} x2={Math.min(leftX, rightX) + (Math.abs(rightX - leftX) * node.intensity)} y2={y}
                    stroke={`hsl(${node.color} / 0.15)`} strokeWidth="3"
                    initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}} transition={{ delay: 1.2 + i * 0.05, duration: 0.6 }} />

                  {/* Glow on hover */}
                  {isHovered && <circle cx={nodeX} cy={y} r={nodeSize + 10} fill={`hsl(${node.color} / 0.12)`} />}

                  {/* Pulse ring for dominant traits */}
                  {isDominant && (
                    <motion.circle cx={nodeX} cy={y} r={nodeSize + 4} fill="none"
                      stroke={`hsl(${node.color} / 0.3)`} strokeWidth="1"
                      animate={{ r: [nodeSize + 4, nodeSize + 10, nodeSize + 4], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }} />
                  )}

                  {/* Node circle */}
                  <motion.circle cx={nodeX} cy={y} r={isHovered ? nodeSize + 2 : nodeSize}
                    fill={`hsl(${node.color})`} stroke={`hsl(${node.color} / 0.3)`} strokeWidth="2"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredNode(node.id)} onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => setActiveNode(activeNode?.id === node.id ? null : node)}
                    style={{ transition: 'r 0.2s ease' }} whileHover={{ scale: 1.3 }} />

                  {/* Echo node */}
                  <motion.circle cx={isLeft ? rightX : leftX} cy={y} r={3}
                    fill={`hsl(${node.color} / 0.4)`}
                    initial={{ opacity: 0 }} animate={isInView ? { opacity: 0.6 } : {}} transition={{ delay: 1.2 + i * 0.05 }} />

                  {/* Label */}
                  <motion.text x={labelX} y={y} textAnchor={anchor} dominantBaseline="middle"
                    fontSize="11" fontFamily="'Space Grotesk', sans-serif" fontWeight="500"
                    fill={isHovered ? `hsl(${node.color})` : 'hsl(var(--muted-foreground))'}
                    className="cursor-pointer select-none"
                    onMouseEnter={() => setHoveredNode(node.id)} onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => setActiveNode(activeNode?.id === node.id ? null : node)}
                  >
                    {node.label}
                  </motion.text>

                  {/* Value on hover */}
                  {isHovered && (
                    <motion.text x={labelX} y={y + 14} textAnchor={anchor} dominantBaseline="middle"
                      fontSize="9" fontFamily="'Space Grotesk', sans-serif" fontWeight="400"
                      fill={`hsl(${node.color} / 0.8)`}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}
                    >
                      {node.value}
                    </motion.text>
                  )}

                  {/* Dominant badge */}
                  {isDominant && (
                    <motion.text x={nodeX} y={y - nodeSize - 6} textAnchor="middle" dominantBaseline="middle"
                      fontSize="8" fontFamily="'Space Grotesk', sans-serif" fontWeight="700"
                      fill={`hsl(${node.color})`}
                      initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 1.5 + i * 0.05 }}
                    >
                      ★
                    </motion.text>
                  )}
                </motion.g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Trait Detail Panel */}
      <AnimatePresence>
        {activeNode && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="mt-4 p-4 rounded-xl border border-border bg-muted/20"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `hsl(${activeNode.color})` }} />
                <h4 className="font-semibold text-foreground text-sm">{activeNode.label}</h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                  {categoryLabels[activeNode.category]}
                </span>
                {activeNode.intensity >= 0.7 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-terminal-green/10 text-terminal-green border border-terminal-green/20">
                    Dominant
                  </span>
                )}
                {activeNode.intensity < 0.3 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-terminal-red/10 text-terminal-red border border-terminal-red/20">
                    Recessive
                  </span>
                )}
              </div>
              <button onClick={() => setActiveNode(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-[10px] text-muted-foreground mb-1">Value</p>
                <p className="text-lg font-bold font-mono" style={{ color: `hsl(${activeNode.color})` }}>{activeNode.value}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground mb-1">Intensity</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${activeNode.intensity * 100}%`, backgroundColor: `hsl(${activeNode.color})` }} />
                  </div>
                  <span className="text-xs font-mono font-bold" style={{ color: `hsl(${activeNode.color})` }}>
                    {Math.round(activeNode.intensity * 100)}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground mb-1">Percentile</p>
                <p className="text-lg font-bold font-mono text-foreground">
                  {activeNode.numericValue >= 90 ? 'Top 5%' : activeNode.numericValue >= 70 ? 'Top 20%' : activeNode.numericValue >= 50 ? 'Top 40%' : 'Below Avg'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trait Classification Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 2 }}
        className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between text-[10px] text-muted-foreground"
      >
        <div className="flex gap-3">
          <span className="flex items-center gap-1"><span className="text-terminal-green">★</span> Dominant ≥70%</span>
          <span className="flex items-center gap-1"><span className="text-terminal-yellow">●</span> Active 30-70%</span>
          <span className="flex items-center gap-1"><span className="text-terminal-red">○</span> Recessive &lt;30%</span>
        </div>
        <span>Click nodes for details</span>
      </motion.div>
    </div>
  );
}

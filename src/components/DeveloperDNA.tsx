import { useRef, useMemo, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Dna, X } from 'lucide-react';

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
  };
}

interface DNANode {
  id: string;
  label: string;
  value: string;
  category: 'language' | 'score' | 'personality' | 'activity' | 'social';
  color: string;
  intensity: number; // 0–1, used for node size
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

export function DeveloperDNA({ languages, scores, personality, streaks, userData }: DeveloperDNAProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const [activeNode, setActiveNode] = useState<DNANode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodes = useMemo(() => {
    const result: DNANode[] = [];

    // Languages (top 6)
    const langEntries = Object.entries(languages || {}).sort((a, b) => b[1] - a[1]);
    const langTotal = langEntries.reduce((s, [, v]) => s + v, 0);
    langEntries.slice(0, 6).forEach(([lang, count]) => {
      result.push({
        id: `lang-${lang}`,
        label: lang,
        value: `${Math.round((count / langTotal) * 100)}% of repos`,
        category: 'language',
        color: categoryColors.language,
        intensity: count / (langEntries[0]?.[1] || 1),
      });
    });

    // Scores
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
        id: `score-${name}`,
        label: name,
        value: `${val}/100`,
        category: 'score',
        color: categoryColors.score,
        intensity: val / 100,
      });
    });

    // Personality traits
    if (personality) {
      if (personality.personalityType) {
        result.push({
          id: 'pers-type',
          label: 'Personality',
          value: `${personality.personalityType.emoji} ${personality.personalityType.type}`,
          category: 'personality',
          color: categoryColors.personality,
          intensity: 0.9,
        });
      }
      if (personality.focusType) {
        result.push({
          id: 'pers-focus',
          label: 'Focus Type',
          value: personality.focusType,
          category: 'personality',
          color: categoryColors.personality,
          intensity: 0.7,
        });
      }
      if (personality.learningStyle) {
        result.push({
          id: 'pers-learn',
          label: 'Learning Style',
          value: personality.learningStyle,
          category: 'personality',
          color: categoryColors.personality,
          intensity: 0.6,
        });
      }
      if (personality.metrics) {
        result.push({
          id: 'pers-consistency',
          label: 'Consistency',
          value: `${personality.metrics.consistency}%`,
          category: 'personality',
          color: categoryColors.personality,
          intensity: personality.metrics.consistency / 100,
        });
        result.push({
          id: 'pers-exploration',
          label: 'Exploration',
          value: `${personality.metrics.exploration}%`,
          category: 'personality',
          color: categoryColors.personality,
          intensity: personality.metrics.exploration / 100,
        });
      }
    }

    // Activity
    if (streaks) {
      result.push({
        id: 'act-current',
        label: 'Current Streak',
        value: `${streaks.currentStreak} days`,
        category: 'activity',
        color: categoryColors.activity,
        intensity: Math.min(streaks.currentStreak / 30, 1),
      });
      result.push({
        id: 'act-longest',
        label: 'Longest Streak',
        value: `${streaks.longestStreak} days`,
        category: 'activity',
        color: categoryColors.activity,
        intensity: Math.min(streaks.longestStreak / 60, 1),
      });
      if (streaks.peakHour) {
        result.push({
          id: 'act-peak',
          label: 'Peak Hour',
          value: streaks.peakHour,
          category: 'activity',
          color: categoryColors.activity,
          intensity: 0.5,
        });
      }
    }
    if (personality?.peakActivityDay) {
      result.push({
        id: 'act-day',
        label: 'Peak Day',
        value: personality.peakActivityDay,
        category: 'activity',
        color: categoryColors.activity,
        intensity: 0.6,
      });
    }

    // Social
    if (userData) {
      result.push({
        id: 'soc-followers',
        label: 'Followers',
        value: userData.followers.toLocaleString(),
        category: 'social',
        color: categoryColors.social,
        intensity: Math.min(userData.followers / 1000, 1),
      });
      result.push({
        id: 'soc-repos',
        label: 'Public Repos',
        value: `${userData.public_repos}`,
        category: 'social',
        color: categoryColors.social,
        intensity: Math.min(userData.public_repos / 50, 1),
      });
      const years = Math.floor((Date.now() - new Date(userData.created_at).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      result.push({
        id: 'soc-age',
        label: 'Account Age',
        value: `${years} years`,
        category: 'social',
        color: categoryColors.social,
        intensity: Math.min(years / 10, 1),
      });
    }

    return result;
  }, [languages, scores, personality, streaks, userData]);

  // SVG dimensions
  const svgWidth = 700;
  const svgHeight = Math.max(600, nodes.length * 28 + 100);
  const centerX = svgWidth / 2;
  const helixAmplitude = 120;
  const nodeSpacing = 28;
  const startY = 60;

  // Generate helix paths
  const getHelixX = (t: number, strand: 'left' | 'right') => {
    const phase = strand === 'left' ? 0 : Math.PI;
    return centerX + Math.sin(t * 0.12 + phase) * helixAmplitude;
  };

  // Build path strings
  const pathPoints = (strand: 'left' | 'right') => {
    const pts: string[] = [];
    for (let i = 0; i <= nodes.length + 4; i++) {
      const y = startY + i * nodeSpacing;
      const x = getHelixX(i, strand);
      pts.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
    }
    return pts.join(' ');
  };

  const leftPath = pathPoints('left');
  const rightPath = pathPoints('right');

  return (
    <div ref={ref} className="score-card">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <Dna className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-foreground">Developer DNA</h3>
        <span className="ml-auto text-xs text-muted-foreground">{nodes.length} traits encoded</span>
      </div>

      {/* Category Legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {Object.entries(categoryLabels).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: `hsl(${categoryColors[key]})` }}
            />
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* DNA Visualization */}
      <div className="relative overflow-hidden">
        <div className="overflow-x-auto flex justify-center">
          <svg
            width={svgWidth}
            height={svgHeight}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="max-w-full"
          >
            {/* Glow filters */}
            <defs>
              {Object.entries(categoryColors).map(([key, color]) => (
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
            <motion.path
              d={leftPath}
              fill="none"
              stroke="url(#helix-gradient-left)"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.path
              d={rightPath}
              fill="none"
              stroke="url(#helix-gradient-right)"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            />

            {/* Rungs (connecting bridges) + Nodes */}
            {nodes.map((node, i) => {
              const y = startY + (i + 2) * nodeSpacing;
              const leftX = getHelixX(i + 2, 'left');
              const rightX = getHelixX(i + 2, 'right');
              const isLeft = i % 2 === 0;
              const nodeX = isLeft ? leftX : rightX;
              const labelX = isLeft ? leftX - 12 : rightX + 12;
              const anchor = isLeft ? 'end' : 'start';
              const nodeSize = 5 + node.intensity * 5;
              const isHovered = hoveredNode === node.id;

              return (
                <motion.g
                  key={node.id}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.8 + i * 0.06, duration: 0.4 }}
                >
                  {/* Rung */}
                  <motion.line
                    x1={leftX} y1={y} x2={rightX} y2={y}
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 0.4 } : {}}
                    transition={{ delay: 1 + i * 0.05 }}
                  />

                  {/* Node glow */}
                  {isHovered && (
                    <circle
                      cx={nodeX}
                      cy={y}
                      r={nodeSize + 8}
                      fill={`hsl(${node.color} / 0.15)`}
                    />
                  )}

                  {/* Node circle */}
                  <motion.circle
                    cx={nodeX}
                    cy={y}
                    r={isHovered ? nodeSize + 2 : nodeSize}
                    fill={`hsl(${node.color})`}
                    stroke={`hsl(${node.color} / 0.3)`}
                    strokeWidth="2"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => setActiveNode(activeNode?.id === node.id ? null : node)}
                    style={{ transition: 'r 0.2s ease' }}
                    whileHover={{ scale: 1.3 }}
                  />

                  {/* Node on opposite strand (smaller echo) */}
                  <motion.circle
                    cx={isLeft ? rightX : leftX}
                    cy={y}
                    r={3}
                    fill={`hsl(${node.color} / 0.4)`}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 0.6 } : {}}
                    transition={{ delay: 1.2 + i * 0.05 }}
                  />

                  {/* Label */}
                  <motion.text
                    x={labelX}
                    y={y}
                    textAnchor={anchor}
                    dominantBaseline="middle"
                    fontSize="11"
                    fontFamily="'Space Grotesk', sans-serif"
                    fontWeight="500"
                    fill={isHovered ? `hsl(${node.color})` : 'hsl(var(--muted-foreground))'}
                    className="cursor-pointer select-none"
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => setActiveNode(activeNode?.id === node.id ? null : node)}
                    style={{ transition: 'fill 0.2s ease' }}
                  >
                    {node.label}
                  </motion.text>

                  {/* Value (shown on hover) */}
                  {isHovered && (
                    <motion.text
                      x={labelX}
                      y={y + 14}
                      textAnchor={anchor}
                      dominantBaseline="middle"
                      fontSize="9"
                      fontFamily="'JetBrains Mono', monospace"
                      fill={`hsl(${node.color})`}
                      initial={{ opacity: 0, y: y + 8 }}
                      animate={{ opacity: 1, y: y + 14 }}
                    >
                      {node.value}
                    </motion.text>
                  )}
                </motion.g>
              );
            })}
          </svg>
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {activeNode && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card border border-border rounded-xl p-4 shadow-2xl min-w-[240px] z-20"
              style={{
                boxShadow: `0 0 30px hsl(${activeNode.color} / 0.15)`,
              }}
            >
              <button
                onClick={() => setActiveNode(null)}
                className="absolute top-2 right-2 p-1 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: `hsl(${activeNode.color})` }}
                />
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  {categoryLabels[activeNode.category]}
                </span>
              </div>
              <p className="text-lg font-bold text-foreground">{activeNode.label}</p>
              <p className="text-sm font-mono" style={{ color: `hsl(${activeNode.color})` }}>
                {activeNode.value}
              </p>
              {/* Intensity bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                  <span>Trait Intensity</span>
                  <span>{Math.round(activeNode.intensity * 100)}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: `hsl(${activeNode.color})` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${activeNode.intensity * 100}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

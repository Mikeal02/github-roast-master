import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, Sparkles, X } from 'lucide-react';

export type ThemeId = 'default' |'obsidian' | 'roseQuartz' | 'neon' | 'aurora' | 'emerald' | 'graphite' | 'arctic';

interface ThemeDef {
  id: ThemeId;
  name: string;
  emoji: string;
  tier: string;
  preview: { bg: string; accent: string; text: string };
  description: string;
}

const themes: ThemeDef[] = [
  { id: 'default', name: 'Default', emoji: '🎯', tier: 'Classic', preview: { bg: '#0a0a1a', accent: '#6366f1', text: '#e5e5e5' }, description: 'Midnight indigo elite look' },
  {
    id: 'obsidian',
    name: 'Obsidian Blue',
    emoji: '🧊',
    tier: 'Professional',
    preview: { bg: '#070A12', accent: '#4DA3FF', text: '#C7D2FE' },
    description: 'Deep slate interface with icy blue precision'
  },
  {
    id: 'roseQuartz',
    name: 'Rose Quartz',
    emoji: '🌸',
    tier: 'Elegant',
    preview: { bg: '#120A10', accent: '#F472B6', text: '#FCE7F3' },
    description: 'Soft rose glow with calming lavender tones'
  },

  { id: 'neon', name: 'Neon Blaze', emoji: '⚡', tier: 'Electric', preview: { bg: '#050510', accent: '#facc15', text: '#f97316' }, description: 'High-voltage electric energy' },
  { id: 'aurora', name: 'Aurora Borealis', emoji: '🌌', tier: 'Celestial', preview: { bg: '#020b18', accent: '#38bdf8', text: '#6ee7b7' }, description: 'Northern lights dancing in code' },
  {
    id: 'emerald',
    name: 'Emerald Depth',
    emoji: '🌊',
    tier: 'Oceanic',
    preview: { bg: '#061416', accent: '#10B981', text: '#A7F3D0' },
    description: 'Deep ocean intelligence with emerald glow'
  },

  {
    id: 'graphite',
    name: 'Graphite Minimal',
    emoji: '⚫',
    tier: 'Minimal',
    preview: { bg: '#0B0D10', accent: '#A1A1AA', text: '#E5E7EB' },
    description: 'Clean monochrome interface with soft contrast'
  }
  ,
  { id: 'arctic', name: 'Arctic Frost', emoji: '❄️', tier: 'Frozen', preview: { bg: '#080c14', accent: '#7dd3fc', text: '#e0f2fe' }, description: 'Crystal clear icy precision' },
];

const themeVars: Record<ThemeId, Record<string, string>> = {
  default: {},
  obsidian: {
  '--background': '220 40% 5%',
  '--foreground': '220 30% 92%',
  '--card': '220 30% 8%',
  '--card-foreground': '220 30% 92%',
  '--primary': '210 100% 65%',
  '--primary-foreground': '220 40% 5%',
  '--secondary': '215 60% 50%',
  '--secondary-foreground': '220 40% 5%',
  '--muted': '220 20% 14%',
  '--muted-foreground': '220 15% 65%',
  '--accent': '210 100% 65%',
  '--accent-foreground': '220 40% 5%',
  '--border': '220 25% 18%',
  '--input': '220 20% 14%',
  '--ring': '210 100% 65%',
  '--terminal-green': '160 80% 50%',
  '--terminal-cyan': '190 90% 55%',
  '--terminal-yellow': '45 90% 60%',
  '--terminal-red': '0 80% 55%',
  '--terminal-purple': '260 80% 65%',
  '--gradient-start': '210 100% 65%',
  '--gradient-end': '220 60% 50%',
  '--gradient-accent': '190 90% 55%',
  '--surface-elevated': '220 25% 10%',
  '--surface-sunken': '220 35% 3%',
  '--destructive': '0 80% 55%',
  '--destructive-foreground': '0 0% 100%',
},

roseQuartz: {
  '--background': '330 25% 6%',
  '--foreground': '340 60% 92%',
  '--card': '330 20% 10%',
  '--card-foreground': '340 60% 92%',
  '--primary': '330 90% 70%',
  '--primary-foreground': '330 25% 6%',
  '--secondary': '300 60% 60%',
  '--secondary-foreground': '330 25% 6%',
  '--muted': '330 15% 14%',
  '--muted-foreground': '330 20% 70%',
  '--accent': '300 70% 65%',
  '--accent-foreground': '330 25% 6%',
  '--border': '330 20% 18%',
  '--input': '330 15% 14%',
  '--ring': '330 90% 70%',
  '--terminal-green': '150 70% 55%',
  '--terminal-cyan': '190 70% 60%',
  '--terminal-yellow': '45 90% 60%',
  '--terminal-red': '0 80% 60%',
  '--terminal-purple': '280 80% 70%',
  '--gradient-start': '330 90% 70%',
  '--gradient-end': '300 70% 65%',
  '--gradient-accent': '280 80% 70%',
  '--surface-elevated': '330 18% 12%',
  '--surface-sunken': '330 25% 4%',
  '--destructive': '0 80% 60%',
  '--destructive-foreground': '0 0% 100%',
},
  neon: {
    '--background': '240 60% 3%', '--foreground': '45 100% 90%',
    '--card': '240 40% 7%', '--card-foreground': '45 100% 90%',
    '--primary': '45 100% 55%', '--primary-foreground': '240 60% 3%',
    '--secondary': '25 100% 55%', '--secondary-foreground': '240 60% 3%',
    '--muted': '240 25% 14%', '--muted-foreground': '45 50% 50%',
    '--accent': '25 100% 55%', '--accent-foreground': '240 60% 3%',
    '--border': '240 30% 18%', '--input': '240 25% 14%', '--ring': '45 100% 55%',
    '--terminal-green': '80 100% 50%', '--terminal-cyan': '190 100% 55%',
    '--terminal-yellow': '45 100% 55%', '--terminal-red': '0 100% 60%', '--terminal-purple': '270 100% 65%',
    '--gradient-start': '45 100% 55%', '--gradient-end': '25 100% 55%', '--gradient-accent': '0 100% 60%',
    '--surface-elevated': '240 35% 10%', '--surface-sunken': '240 50% 2%',
    '--destructive': '0 100% 55%', '--destructive-foreground': '0 0% 100%',
  },
  aurora: {
    '--background': '210 80% 5%', '--foreground': '190 80% 90%',
    '--card': '210 60% 9%', '--card-foreground': '190 80% 90%',
    '--primary': '199 89% 48%', '--primary-foreground': '210 80% 5%',
    '--secondary': '160 84% 39%', '--secondary-foreground': '210 80% 5%',
    '--muted': '210 40% 14%', '--muted-foreground': '190 40% 50%',
    '--accent': '160 84% 39%', '--accent-foreground': '210 80% 5%',
    '--border': '210 35% 18%', '--input': '210 40% 14%', '--ring': '199 89% 48%',
    '--terminal-green': '160 84% 50%', '--terminal-cyan': '199 89% 48%',
    '--terminal-yellow': '45 100% 60%', '--terminal-red': '350 80% 55%', '--terminal-purple': '260 80% 65%',
    '--gradient-start': '199 89% 48%', '--gradient-end': '160 84% 39%', '--gradient-accent': '260 80% 65%',
    '--surface-elevated': '210 50% 11%', '--surface-sunken': '210 70% 3%',
    '--destructive': '350 80% 55%', '--destructive-foreground': '0 0% 100%',
  },
  emerald: {
    '--background': '180 40% 5%',
    '--foreground': '160 60% 92%',
    '--card': '180 30% 8%',
    '--card-foreground': '160 60% 92%',
    '--primary': '160 80% 45%',
    '--primary-foreground': '180 40% 5%',
    '--secondary': '175 60% 40%',
    '--secondary-foreground': '180 40% 5%',
    '--muted': '180 20% 12%',
    '--muted-foreground': '160 25% 60%',
    '--accent': '160 80% 45%',
    '--accent-foreground': '180 40% 5%',
    '--border': '180 25% 18%',
    '--input': '180 20% 12%',
    '--ring': '160 80% 45%',
    '--surface-elevated': '180 30% 10%',
    '--surface-sunken': '180 40% 3%',
  },
  
  graphite: {
    '--background': '220 10% 5%',
    '--foreground': '220 10% 92%',
    '--card': '220 10% 8%',
    '--card-foreground': '220 10% 92%',
    '--primary': '220 10% 70%',
    '--primary-foreground': '220 10% 5%',
    '--secondary': '220 5% 55%',
    '--secondary-foreground': '220 10% 5%',
    '--muted': '220 10% 12%',
    '--muted-foreground': '220 5% 60%',
    '--accent': '220 10% 70%',
    '--accent-foreground': '220 10% 5%',
    '--border': '220 10% 15%',
    '--input': '220 10% 12%',
    '--ring': '220 10% 70%',
    '--surface-elevated': '220 10% 10%',
    '--surface-sunken': '220 10% 3%',
  },
  arctic: {
    '--background': '215 50% 5%', '--foreground': '200 80% 92%',
    '--card': '215 40% 9%', '--card-foreground': '200 80% 92%',
    '--primary': '199 95% 74%', '--primary-foreground': '215 50% 5%',
    '--secondary': '210 40% 50%', '--secondary-foreground': '0 0% 100%',
    '--muted': '215 25% 14%', '--muted-foreground': '200 30% 55%',
    '--accent': '210 40% 50%', '--accent-foreground': '0 0% 100%',
    '--border': '215 30% 18%', '--input': '215 25% 14%', '--ring': '199 95% 74%',
    '--terminal-green': '160 70% 50%', '--terminal-cyan': '199 95% 74%',
    '--terminal-yellow': '45 80% 60%', '--terminal-red': '0 70% 55%', '--terminal-purple': '260 60% 65%',
    '--gradient-start': '199 95% 74%', '--gradient-end': '210 40% 50%', '--gradient-accent': '260 60% 65%',
    '--surface-elevated': '215 35% 11%', '--surface-sunken': '215 45% 3%',
    '--destructive': '0 70% 55%', '--destructive-foreground': '0 0% 100%',
  },
};

export function applyTheme(themeId: ThemeId) {
  const vars = themeVars[themeId];
  const root = document.documentElement;

  // Reset all custom props
  const allKeys = new Set<string>();
  Object.values(themeVars).forEach(v => Object.keys(v).forEach(k => allKeys.add(k)));
  allKeys.forEach(key => root.style.removeProperty(key));

  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  localStorage.setItem('visual-theme', themeId);
}

export function getStoredTheme(): ThemeId {
  return (localStorage.getItem('visual-theme') as ThemeId) || 'default';
}

interface ThemePickerProps {
  score: number;
}

export function ThemePicker({ score }: ThemePickerProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<ThemeId>(getStoredTheme());

  useEffect(() => {
    applyTheme(active);
  }, [active]);

  const select = (id: ThemeId) => {
    setActive(id);
    applyTheme(id);
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-border text-sm font-medium text-foreground hover:border-primary/50 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Palette className="w-4 h-4 text-primary" />
        <span className="hidden sm:inline">Themes</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="relative w-[calc(100vw-2rem)] max-w-lg max-h-[80vh] bg-card border border-border rounded-2xl p-6 shadow-2xl overflow-hidden flex flex-col"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" />

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-foreground">Visual Themes</h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{themes.length} themes</span>
                </div>
                <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-muted transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-2 overflow-y-auto overflow-x-hidden flex-1 pr-1">
                {themes.map((theme, i) => {
                  const isActive = active === theme.id;
                  return (
                    <motion.button
                      key={theme.id}
                      onClick={() => select(theme.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                        isActive
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/40 hover:bg-muted/50'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <div
                        className="w-10 h-10 rounded-lg border border-border/50 flex items-center justify-center text-lg shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${theme.preview.bg}, ${theme.preview.accent}40)`,
                          borderColor: theme.preview.accent + '40',
                        }}
                      >
                        {theme.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-foreground">{theme.name}</span>
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded-full font-medium border"
                            style={{
                              color: theme.preview.accent,
                              borderColor: theme.preview.accent + '40',
                              backgroundColor: theme.preview.accent + '10',
                            }}
                          >
                            {theme.tier}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{theme.description}</p>
                      </div>
                      <div className="shrink-0">
                        {isActive ? (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-border" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-4 flex gap-1 h-2 rounded-full overflow-hidden">
                {themes.map((t) => (
                  <div
                    key={t.id}
                    className="flex-1 transition-all duration-300"
                    style={{
                      background: active === t.id
                        ? `linear-gradient(90deg, ${t.preview.accent}, ${t.preview.text})`
                        : t.preview.accent + '30',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

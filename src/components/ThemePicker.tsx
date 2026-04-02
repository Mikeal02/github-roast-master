import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, Sparkles, X } from 'lucide-react';

export type ThemeId = 'default' | 'cyberpunk' | 'retro' | 'vaporwave' | 'neon' | 'aurora' | 'midnight' | 'sunset' | 'matrix' | 'arctic';

interface ThemeDef {
  id: ThemeId;
  name: string;
  emoji: string;
  tier: string;
  preview: { bg: string; accent: string; text: string };
  description: string;
}

const themes: ThemeDef[] = [
  { id: 'default', name: 'Default', emoji: '🎯', tier: 'Classic', preview: { bg: '#0d1117', accent: '#22c55e', text: '#e5e5e5' }, description: 'The classic green terminal look' },
  { id: 'cyberpunk', name: 'Cyberpunk', emoji: '🌆', tier: 'Neon City', preview: { bg: '#0a0014', accent: '#ff2d95', text: '#00fff0' }, description: 'Neon-lit dystopian future vibes' },
  { id: 'retro', name: 'Retro Terminal', emoji: '📟', tier: 'Old School', preview: { bg: '#0c1a0c', accent: '#33ff33', text: '#33ff33' }, description: 'Old-school phosphor green CRT' },
  { id: 'vaporwave', name: 'Vaporwave', emoji: '🌴', tier: 'Aesthetic', preview: { bg: '#1a0a2e', accent: '#ff71ce', text: '#b967ff' }, description: 'A E S T H E T I C retro-future' },
  { id: 'neon', name: 'Neon Blaze', emoji: '⚡', tier: 'Electric', preview: { bg: '#050510', accent: '#facc15', text: '#f97316' }, description: 'High-voltage electric energy' },
  { id: 'aurora', name: 'Aurora Borealis', emoji: '🌌', tier: 'Celestial', preview: { bg: '#020b18', accent: '#38bdf8', text: '#6ee7b7' }, description: 'Northern lights dancing in code' },
  { id: 'midnight', name: 'Midnight Rose', emoji: '🥀', tier: 'Elegant', preview: { bg: '#0f0a14', accent: '#e11d48', text: '#fda4af' }, description: 'Deep crimson romance in the dark' },
  { id: 'sunset', name: 'Solar Flare', emoji: '🌅', tier: 'Cosmic', preview: { bg: '#0c0a08', accent: '#f59e0b', text: '#ef4444' }, description: 'Blazing sunset over the horizon' },
  { id: 'matrix', name: 'Matrix Rain', emoji: '💊', tier: 'Hacker', preview: { bg: '#000800', accent: '#00ff41', text: '#008f11' }, description: 'Follow the white rabbit' },
  { id: 'arctic', name: 'Arctic Frost', emoji: '❄️', tier: 'Frozen', preview: { bg: '#080c14', accent: '#7dd3fc', text: '#e0f2fe' }, description: 'Crystal clear icy precision' },
];

const themeVars: Record<ThemeId, Record<string, string>> = {
  default: {},
  cyberpunk: {
    '--background': '280 100% 3%', '--foreground': '180 100% 94%',
    '--card': '280 60% 7%', '--card-foreground': '180 100% 94%',
    '--primary': '330 100% 60%', '--primary-foreground': '280 100% 3%',
    '--secondary': '180 100% 50%', '--secondary-foreground': '280 100% 3%',
    '--muted': '280 40% 12%', '--muted-foreground': '180 50% 55%',
    '--accent': '180 100% 50%', '--accent-foreground': '280 100% 3%',
    '--border': '280 40% 18%', '--input': '280 40% 12%', '--ring': '330 100% 60%',
    '--terminal-green': '180 100% 50%', '--terminal-cyan': '180 100% 50%',
    '--terminal-yellow': '50 100% 60%', '--terminal-red': '330 100% 60%', '--terminal-purple': '280 100% 70%',
    '--gradient-start': '330 100% 60%', '--gradient-end': '180 100% 50%', '--gradient-accent': '280 100% 70%',
    '--surface-elevated': '280 50% 10%', '--surface-sunken': '280 80% 2%',
    '--destructive': '330 100% 55%', '--destructive-foreground': '0 0% 100%',
  },
  retro: {
    '--background': '120 40% 4%', '--foreground': '120 100% 70%',
    '--card': '120 30% 7%', '--card-foreground': '120 100% 70%',
    '--primary': '120 100% 45%', '--primary-foreground': '120 40% 4%',
    '--secondary': '120 80% 35%', '--secondary-foreground': '120 40% 4%',
    '--muted': '120 20% 12%', '--muted-foreground': '120 60% 40%',
    '--accent': '120 100% 50%', '--accent-foreground': '120 40% 4%',
    '--border': '120 30% 16%', '--input': '120 20% 12%', '--ring': '120 100% 45%',
    '--terminal-green': '120 100% 50%', '--terminal-cyan': '120 80% 45%',
    '--terminal-yellow': '80 100% 50%', '--terminal-red': '0 80% 50%', '--terminal-purple': '120 60% 55%',
    '--gradient-start': '120 100% 45%', '--gradient-end': '120 80% 35%', '--gradient-accent': '80 100% 50%',
    '--surface-elevated': '120 25% 9%', '--surface-sunken': '120 40% 3%',
    '--destructive': '0 80% 50%', '--destructive-foreground': '120 100% 70%',
  },
  vaporwave: {
    '--background': '270 60% 8%', '--foreground': '300 100% 90%',
    '--card': '270 45% 12%', '--card-foreground': '300 100% 90%',
    '--primary': '320 100% 72%', '--primary-foreground': '270 60% 8%',
    '--secondary': '270 100% 72%', '--secondary-foreground': '270 60% 8%',
    '--muted': '270 30% 18%', '--muted-foreground': '300 40% 55%',
    '--accent': '270 100% 72%', '--accent-foreground': '270 60% 8%',
    '--border': '270 35% 22%', '--input': '270 30% 18%', '--ring': '320 100% 72%',
    '--terminal-green': '160 100% 50%', '--terminal-cyan': '190 100% 60%',
    '--terminal-yellow': '50 100% 70%', '--terminal-red': '340 100% 65%', '--terminal-purple': '270 100% 72%',
    '--gradient-start': '320 100% 72%', '--gradient-end': '270 100% 72%', '--gradient-accent': '190 100% 60%',
    '--surface-elevated': '270 40% 14%', '--surface-sunken': '270 55% 6%',
    '--destructive': '340 100% 60%', '--destructive-foreground': '0 0% 100%',
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
  midnight: {
    '--background': '280 30% 5%', '--foreground': '350 100% 90%',
    '--card': '280 25% 9%', '--card-foreground': '350 100% 90%',
    '--primary': '347 77% 50%', '--primary-foreground': '0 0% 100%',
    '--secondary': '330 80% 60%', '--secondary-foreground': '280 30% 5%',
    '--muted': '280 20% 14%', '--muted-foreground': '350 30% 55%',
    '--accent': '330 80% 60%', '--accent-foreground': '280 30% 5%',
    '--border': '280 25% 18%', '--input': '280 20% 14%', '--ring': '347 77% 50%',
    '--terminal-green': '160 70% 45%', '--terminal-cyan': '190 80% 50%',
    '--terminal-yellow': '45 90% 55%', '--terminal-red': '347 77% 50%', '--terminal-purple': '280 80% 65%',
    '--gradient-start': '347 77% 50%', '--gradient-end': '330 80% 60%', '--gradient-accent': '280 80% 65%',
    '--surface-elevated': '280 22% 11%', '--surface-sunken': '280 30% 3%',
    '--destructive': '347 77% 50%', '--destructive-foreground': '0 0% 100%',
  },
  sunset: {
    '--background': '20 40% 4%', '--foreground': '40 100% 92%',
    '--card': '20 30% 8%', '--card-foreground': '40 100% 92%',
    '--primary': '38 92% 50%', '--primary-foreground': '20 40% 4%',
    '--secondary': '0 84% 60%', '--secondary-foreground': '0 0% 100%',
    '--muted': '20 20% 14%', '--muted-foreground': '30 40% 50%',
    '--accent': '0 84% 60%', '--accent-foreground': '0 0% 100%',
    '--border': '20 25% 18%', '--input': '20 20% 14%', '--ring': '38 92% 50%',
    '--terminal-green': '80 80% 45%', '--terminal-cyan': '190 70% 50%',
    '--terminal-yellow': '38 92% 50%', '--terminal-red': '0 84% 60%', '--terminal-purple': '280 70% 60%',
    '--gradient-start': '38 92% 50%', '--gradient-end': '0 84% 60%', '--gradient-accent': '280 70% 60%',
    '--surface-elevated': '20 25% 10%', '--surface-sunken': '20 35% 3%',
    '--destructive': '0 84% 55%', '--destructive-foreground': '0 0% 100%',
  },
  matrix: {
    '--background': '120 100% 1%', '--foreground': '120 100% 60%',
    '--card': '120 50% 4%', '--card-foreground': '120 100% 60%',
    '--primary': '120 100% 40%', '--primary-foreground': '120 100% 1%',
    '--secondary': '120 70% 30%', '--secondary-foreground': '120 100% 1%',
    '--muted': '120 30% 8%', '--muted-foreground': '120 50% 35%',
    '--accent': '120 100% 40%', '--accent-foreground': '120 100% 1%',
    '--border': '120 30% 12%', '--input': '120 30% 8%', '--ring': '120 100% 40%',
    '--terminal-green': '120 100% 50%', '--terminal-cyan': '140 100% 40%',
    '--terminal-yellow': '90 100% 45%', '--terminal-red': '0 80% 45%', '--terminal-purple': '140 60% 50%',
    '--gradient-start': '120 100% 40%', '--gradient-end': '140 100% 35%', '--gradient-accent': '90 100% 45%',
    '--surface-elevated': '120 40% 5%', '--surface-sunken': '120 80% 1%',
    '--destructive': '0 80% 45%', '--destructive-foreground': '120 100% 60%',
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
              className="relative w-full max-w-lg max-h-[80vh] bg-card border border-border rounded-2xl p-6 shadow-2xl overflow-hidden flex flex-col"
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

              <div className="space-y-2 overflow-y-auto flex-1 pr-1">
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

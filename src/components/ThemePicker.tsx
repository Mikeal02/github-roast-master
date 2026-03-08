import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Lock, Check, Sparkles, X } from 'lucide-react';

export type ThemeId = 'default' | 'cyberpunk' | 'retro' | 'vaporwave' | 'neon';

interface ThemeDef {
  id: ThemeId;
  name: string;
  emoji: string;
  minScore: number;
  tier: string;
  preview: { bg: string; accent: string; text: string };
  description: string;
}

const themes: ThemeDef[] = [
  {
    id: 'default',
    name: 'Default',
    emoji: '🎯',
    minScore: 0,
    tier: 'Starter',
    preview: { bg: '#0d1117', accent: '#22c55e', text: '#e5e5e5' },
    description: 'The classic green terminal look',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    emoji: '🌆',
    minScore: 30,
    tier: 'Rising',
    preview: { bg: '#0a0014', accent: '#ff2d95', text: '#00fff0' },
    description: 'Neon-lit dystopian future vibes',
  },
  {
    id: 'retro',
    name: 'Retro Terminal',
    emoji: '📟',
    minScore: 50,
    tier: 'Skilled',
    preview: { bg: '#0c1a0c', accent: '#33ff33', text: '#33ff33' },
    description: 'Old-school phosphor green CRT',
  },
  {
    id: 'vaporwave',
    name: 'Vaporwave',
    emoji: '🌴',
    minScore: 70,
    tier: 'Expert',
    preview: { bg: '#1a0a2e', accent: '#ff71ce', text: '#b967ff' },
    description: 'A E S T H E T I C retro-future',
  },
  {
    id: 'neon',
    name: 'Neon Blaze',
    emoji: '⚡',
    minScore: 90,
    tier: 'Elite',
    preview: { bg: '#050510', accent: '#facc15', text: '#f97316' },
    description: 'Reserved for the top 10% of devs',
  },
];

// CSS variable overrides per theme (dark mode only)
const themeVars: Record<ThemeId, Record<string, string>> = {
  default: {},
  cyberpunk: {
    '--background': '280 100% 3%',
    '--foreground': '180 100% 94%',
    '--card': '280 60% 7%',
    '--card-foreground': '180 100% 94%',
    '--primary': '330 100% 60%',
    '--primary-foreground': '280 100% 3%',
    '--secondary': '180 100% 50%',
    '--secondary-foreground': '280 100% 3%',
    '--muted': '280 40% 12%',
    '--muted-foreground': '180 50% 55%',
    '--accent': '180 100% 50%',
    '--accent-foreground': '280 100% 3%',
    '--border': '280 40% 18%',
    '--input': '280 40% 12%',
    '--ring': '330 100% 60%',
    '--terminal-green': '180 100% 50%',
    '--terminal-cyan': '180 100% 50%',
    '--terminal-yellow': '50 100% 60%',
    '--terminal-red': '330 100% 60%',
    '--terminal-purple': '280 100% 70%',
    '--gradient-start': '330 100% 60%',
    '--gradient-end': '180 100% 50%',
    '--gradient-accent': '280 100% 70%',
    '--surface-elevated': '280 50% 10%',
    '--surface-sunken': '280 80% 2%',
    '--destructive': '330 100% 55%',
    '--destructive-foreground': '0 0% 100%',
  },
  retro: {
    '--background': '120 40% 4%',
    '--foreground': '120 100% 70%',
    '--card': '120 30% 7%',
    '--card-foreground': '120 100% 70%',
    '--primary': '120 100% 45%',
    '--primary-foreground': '120 40% 4%',
    '--secondary': '120 80% 35%',
    '--secondary-foreground': '120 40% 4%',
    '--muted': '120 20% 12%',
    '--muted-foreground': '120 60% 40%',
    '--accent': '120 100% 50%',
    '--accent-foreground': '120 40% 4%',
    '--border': '120 30% 16%',
    '--input': '120 20% 12%',
    '--ring': '120 100% 45%',
    '--terminal-green': '120 100% 50%',
    '--terminal-cyan': '120 80% 45%',
    '--terminal-yellow': '80 100% 50%',
    '--terminal-red': '0 80% 50%',
    '--terminal-purple': '120 60% 55%',
    '--gradient-start': '120 100% 45%',
    '--gradient-end': '120 80% 35%',
    '--gradient-accent': '80 100% 50%',
    '--surface-elevated': '120 25% 9%',
    '--surface-sunken': '120 40% 3%',
    '--destructive': '0 80% 50%',
    '--destructive-foreground': '120 100% 70%',
  },
  vaporwave: {
    '--background': '270 60% 8%',
    '--foreground': '300 100% 90%',
    '--card': '270 45% 12%',
    '--card-foreground': '300 100% 90%',
    '--primary': '320 100% 72%',
    '--primary-foreground': '270 60% 8%',
    '--secondary': '270 100% 72%',
    '--secondary-foreground': '270 60% 8%',
    '--muted': '270 30% 18%',
    '--muted-foreground': '300 40% 55%',
    '--accent': '270 100% 72%',
    '--accent-foreground': '270 60% 8%',
    '--border': '270 35% 22%',
    '--input': '270 30% 18%',
    '--ring': '320 100% 72%',
    '--terminal-green': '160 100% 50%',
    '--terminal-cyan': '190 100% 60%',
    '--terminal-yellow': '50 100% 70%',
    '--terminal-red': '340 100% 65%',
    '--terminal-purple': '270 100% 72%',
    '--gradient-start': '320 100% 72%',
    '--gradient-end': '270 100% 72%',
    '--gradient-accent': '190 100% 60%',
    '--surface-elevated': '270 40% 14%',
    '--surface-sunken': '270 55% 6%',
    '--destructive': '340 100% 60%',
    '--destructive-foreground': '0 0% 100%',
  },
  neon: {
    '--background': '240 60% 3%',
    '--foreground': '45 100% 90%',
    '--card': '240 40% 7%',
    '--card-foreground': '45 100% 90%',
    '--primary': '45 100% 55%',
    '--primary-foreground': '240 60% 3%',
    '--secondary': '25 100% 55%',
    '--secondary-foreground': '240 60% 3%',
    '--muted': '240 25% 14%',
    '--muted-foreground': '45 50% 50%',
    '--accent': '25 100% 55%',
    '--accent-foreground': '240 60% 3%',
    '--border': '240 30% 18%',
    '--input': '240 25% 14%',
    '--ring': '45 100% 55%',
    '--terminal-green': '80 100% 50%',
    '--terminal-cyan': '190 100% 55%',
    '--terminal-yellow': '45 100% 55%',
    '--terminal-red': '0 100% 60%',
    '--terminal-purple': '270 100% 65%',
    '--gradient-start': '45 100% 55%',
    '--gradient-end': '25 100% 55%',
    '--gradient-accent': '0 100% 60%',
    '--surface-elevated': '240 35% 10%',
    '--surface-sunken': '240 50% 2%',
    '--destructive': '0 100% 55%',
    '--destructive-foreground': '0 0% 100%',
  },
};

export function applyTheme(themeId: ThemeId) {
  const vars = themeVars[themeId];
  const root = document.documentElement;

  // Reset custom props first
  Object.keys(themeVars.cyberpunk).forEach((key) => {
    root.style.removeProperty(key);
  });

  // Apply new overrides
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
              className="relative w-full max-w-lg bg-card border border-border rounded-2xl p-6 shadow-2xl overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              {/* Decorative gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" />

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-foreground">Unlock Themes</h2>
                </div>
                <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-muted transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground mb-4">
                Your score: <span className="text-primary font-bold">{score}/100</span> — Higher scores unlock rarer themes
              </p>

              <div className="space-y-2">
                {themes.map((theme, i) => {
                  const unlocked = score >= theme.minScore;
                  const isActive = active === theme.id;

                  return (
                    <motion.button
                      key={theme.id}
                      onClick={() => unlocked && select(theme.id)}
                      disabled={!unlocked}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                        isActive
                          ? 'border-primary bg-primary/10'
                          : unlocked
                          ? 'border-border hover:border-primary/40 hover:bg-muted/50'
                          : 'border-border/50 opacity-50 cursor-not-allowed'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      {/* Color preview swatch */}
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
                            {theme.tier} ({theme.minScore}+)
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{theme.description}</p>
                      </div>

                      <div className="shrink-0">
                        {!unlocked ? (
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        ) : isActive ? (
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

              {/* Color bar preview */}
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

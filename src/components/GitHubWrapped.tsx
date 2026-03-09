import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Share2, Sparkles, Trophy, Code2, Flame, Clock, GitFork, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WrappedProps {
  username: string;
  userData: any;
  aiAnalysis: any;
  onClose: () => void;
}

interface SlideData {
  id: string;
  bg: string;
  icon: React.ReactNode;
  render: () => React.ReactNode;
}

export function GitHubWrapped({ username, userData, aiAnalysis, onClose }: WrappedProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const dragX = useMotionValue(0);

  const topLanguages = Object.entries(aiAnalysis.languages || {})
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 5);

  const topRepos = (aiAnalysis.topRepositories || []).slice(0, 3);
  const totalStars = aiAnalysis.totalStars || 0;
  const overallScore = aiAnalysis.scores?.overall?.score || 0;
  const archetype = aiAnalysis.archetype || { name: 'Developer', emoji: '💻', description: '' };
  const personality = aiAnalysis.personality || {};

  const slides: SlideData[] = [
    {
      id: 'intro',
      bg: 'from-primary/20 via-background to-secondary/20',
      icon: <Sparkles className="w-6 h-6" />,
      render: () => (
        <div className="flex flex-col items-center justify-center h-full text-center px-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
            transition={{ type: 'spring', delay: 0.3 }}
            className="text-8xl mb-8"
          >
            🎁
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Your GitHub
            <span className="text-gradient block mt-1">Wrapped</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-3 mt-6"
          >
            <img src={userData.avatar_url} alt={username} className="w-16 h-16 rounded-full border-2 border-primary" />
            <div className="text-left">
              <p className="font-bold text-foreground text-lg">{userData.name || username}</p>
              <p className="text-muted-foreground font-mono text-sm">@{username}</p>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-muted-foreground text-sm mt-8"
          >
            Swipe to see your year →
          </motion.p>
        </div>
      ),
    },
    {
      id: 'stats',
      bg: 'from-terminal-cyan/20 via-background to-primary/20',
      icon: <Trophy className="w-6 h-6" />,
      render: () => (
        <div className="flex flex-col items-center justify-center h-full px-8">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground uppercase tracking-widest mb-8">
            By the Numbers
          </motion.p>
          <div className="grid grid-cols-2 gap-6 w-full max-w-md">
            {[
              { label: 'Repositories', value: userData.public_repos, icon: <GitFork className="w-5 h-5" /> },
              { label: 'Total Stars', value: totalStars, icon: <Star className="w-5 h-5" /> },
              { label: 'Followers', value: userData.followers, icon: <Users className="w-5 h-5" /> },
              { label: 'Overall Score', value: `${overallScore}/100`, icon: <Trophy className="w-5 h-5" /> },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.15, type: 'spring' }}
                className="glass-panel text-center p-6"
              >
                <div className="flex justify-center text-primary mb-3">{stat.icon}</div>
                <p className="text-3xl font-bold font-mono text-gradient">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'languages',
      bg: 'from-accent/20 via-background to-terminal-purple/20',
      icon: <Code2 className="w-6 h-6" />,
      render: () => (
        <div className="flex flex-col items-center justify-center h-full px-8">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground uppercase tracking-widest mb-4">
            Your Top Languages
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="text-6xl mb-8"
          >
            🗣️
          </motion.div>
          <div className="w-full max-w-sm space-y-4">
            {topLanguages.map(([lang, count], i) => {
              const maxCount = topLanguages[0]?.[1] as number || 1;
              const pct = ((count as number) / maxCount) * 100;
              return (
                <motion.div
                  key={lang}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.12 }}
                >
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-foreground">{i === 0 ? `🥇 ${lang}` : i === 1 ? `🥈 ${lang}` : i === 2 ? `🥉 ${lang}` : lang}</span>
                    <span className="text-muted-foreground font-mono">{count as number} repos</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ),
    },
    {
      id: 'repos',
      bg: 'from-terminal-yellow/20 via-background to-secondary/20',
      icon: <GitFork className="w-6 h-6" />,
      render: () => (
        <div className="flex flex-col items-center justify-center h-full px-8">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground uppercase tracking-widest mb-4">
            Top Repositories
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-6xl mb-6"
          >
            🏆
          </motion.div>
          <div className="w-full max-w-md space-y-4">
            {topRepos.map((repo: any, i: number) => (
              <motion.div
                key={repo.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.15, type: 'spring' }}
                className="score-card p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-foreground">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'} {repo.name}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{repo.description || 'No description'}</p>
                  </div>
                  <div className="flex items-center gap-1 text-terminal-yellow">
                    <Star className="w-4 h-4" />
                    <span className="font-mono text-sm font-bold">{repo.stars}</span>
                  </div>
                </div>
                {repo.language && (
                  <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">{repo.language}</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'streaks',
      bg: 'from-destructive/20 via-background to-terminal-yellow/20',
      icon: <Flame className="w-6 h-6" />,
      render: () => (
        <div className="flex flex-col items-center justify-center h-full px-8">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground uppercase tracking-widest mb-4">
            Coding Habits
          </motion.p>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="text-7xl mb-8"
          >
            🔥
          </motion.div>
          <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
            {[
              { label: 'Current Streak', value: `${aiAnalysis.currentStreak || 0}d` },
              { label: 'Longest Streak', value: `${aiAnalysis.longestStreak || 0}d` },
              { label: 'Peak Hour', value: aiAnalysis.peakCodingHour || '?' },
              { label: 'Active Days', value: aiAnalysis.activeDays || 0 },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.12, type: 'spring' }}
                className="text-center p-4 bg-card border border-border rounded-2xl"
              >
                <p className="text-2xl font-bold font-mono text-gradient">{item.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
              </motion.div>
            ))}
          </div>
          {aiAnalysis.peakCodingDay && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 text-sm text-muted-foreground"
            >
              Most active on <span className="text-foreground font-semibold">{aiAnalysis.peakCodingDay}s</span>
            </motion.p>
          )}
        </div>
      ),
    },
    {
      id: 'personality',
      bg: 'from-terminal-purple/20 via-background to-accent/20',
      icon: <Sparkles className="w-6 h-6" />,
      render: () => (
        <div className="flex flex-col items-center justify-center h-full px-8 text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground uppercase tracking-widest mb-4">
            Your Developer Archetype
          </motion.p>
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="text-8xl mb-6"
          >
            {archetype.emoji}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold text-gradient mb-3"
          >
            {archetype.name}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-muted-foreground max-w-sm leading-relaxed"
          >
            {archetype.description}
          </motion.p>
          {personality.personalityType && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-6 px-4 py-2 bg-accent/10 border border-accent/20 rounded-xl"
            >
              <p className="text-sm font-medium text-accent">
                {personality.personalityType.emoji} {personality.personalityType.type}
              </p>
            </motion.div>
          )}
        </div>
      ),
    },
    {
      id: 'superlatives',
      bg: 'from-primary/20 via-background to-terminal-green/20',
      icon: <Trophy className="w-6 h-6" />,
      render: () => {
        const superlatives = [
          totalStars > 100 && '⭐ Star Collector',
          (aiAnalysis.longestStreak || 0) > 14 && '🔥 Streak Master',
          topLanguages.length >= 5 && '🌈 Polyglot',
          userData.followers > 50 && '👥 Community Builder',
          (aiAnalysis.originalRepos || 0) > 20 && '🏗️ Prolific Creator',
          overallScore >= 80 && '💎 Elite Developer',
          overallScore >= 60 && overallScore < 80 && '🚀 Rising Star',
        ].filter(Boolean);

        return (
          <div className="flex flex-col items-center justify-center h-full px-8 text-center">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground uppercase tracking-widest mb-6">
              Your Superlatives
            </motion.p>
            <div className="flex flex-wrap justify-center gap-3 max-w-md">
              {superlatives.length > 0 ? superlatives.map((badge, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, rotate: -20 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3 + i * 0.15, type: 'spring', stiffness: 300 }}
                  className="px-4 py-3 bg-card border border-border rounded-2xl text-sm font-medium text-foreground"
                >
                  {badge}
                </motion.div>
              )) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-muted-foreground"
                >
                  🌱 Keep coding to unlock badges!
                </motion.p>
              )}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-10 text-center"
            >
              <p className="text-4xl font-bold text-gradient">{overallScore}/100</p>
              <p className="text-sm text-muted-foreground mt-1">Final Score</p>
            </motion.div>
          </div>
        );
      },
    },
  ];

  const navigate = useCallback((dir: number) => {
    setDirection(dir);
    setCurrentSlide(prev => {
      const next = prev + dir;
      if (next < 0) return 0;
      if (next >= slides.length) return slides.length - 1;
      return next;
    });
  }, [slides.length]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -60) navigate(1);
    else if (info.offset.x > 60) navigate(-1);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') navigate(1);
      else if (e.key === 'ArrowLeft') navigate(-1);
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate, onClose]);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background flex flex-col"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 relative z-10">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
        {/* Progress dots */}
        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > currentSlide ? 1 : -1); setCurrentSlide(i); }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentSlide ? 'w-6 bg-primary' : i < currentSlide ? 'w-1.5 bg-primary/50' : 'w-1.5 bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
        <div className="w-10" />
      </div>

      {/* Slide content */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
            style={{ x: dragX }}
            className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].bg} cursor-grab active:cursor-grabbing`}
          >
            {slides[currentSlide].render()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-between p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          disabled={currentSlide === 0}
          className="gap-1"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </Button>
        <p className="text-xs text-muted-foreground font-mono">
          {currentSlide + 1} / {slides.length}
        </p>
        {currentSlide < slides.length - 1 ? (
          <Button variant="ghost" size="sm" onClick={() => navigate(1)} className="gap-1">
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button variant="default" size="sm" onClick={onClose} className="gap-1">
            <Sparkles className="w-4 h-4" /> Done
          </Button>
        )}
      </div>
    </motion.div>
  );
}
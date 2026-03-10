import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const stats = [
  { target: 14, suffix: '+', label: 'Analysis Tabs' },
  { target: 300, suffix: '+', label: 'Data Points' },
  { target: 50, suffix: 'K+', label: 'Profiles Roasted' },
  { target: 99, suffix: '%', label: 'Accuracy' },
];

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span className="text-3xl md:text-5xl font-bold font-mono text-gradient">
      {count}{suffix}
    </span>
  );
}

export function HeroStats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="glass-panel p-6 md:p-8 relative overflow-hidden"
    >
      <div className="aurora-glow top-0 left-1/4 -translate-y-1/2 opacity-[0.05]" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + i * 0.15, type: 'spring', stiffness: 150 }}
            className="text-center group"
          >
            <AnimatedNumber target={stat.target} suffix={stat.suffix} />
            <p className="text-xs text-muted-foreground mt-2 font-medium group-hover:text-foreground transition-colors">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Music, Clock } from 'lucide-react';

interface CodeRhythmProps {
  events: any[];
  peakHour?: number;
}

export function CodeRhythm({ events, peakHour }: CodeRhythmProps) {
  const hourlyData = useMemo(() => {
    const hours = Array(24).fill(0);
    events.forEach((e: any) => {
      if (e.created_at) {
        const h = new Date(e.created_at).getHours();
        hours[h]++;
      }
    });
    const max = Math.max(...hours, 1);
    return hours.map((count, hour) => ({
      hour,
      count,
      intensity: count / max,
      label: hour === 0 ? '12AM' : hour < 12 ? `${hour}AM` : hour === 12 ? '12PM' : `${hour - 12}PM`,
    }));
  }, [events]);

  const dayData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = Array(7).fill(0);
    events.forEach((e: any) => {
      if (e.created_at) {
        counts[new Date(e.created_at).getDay()]++;
      }
    });
    const max = Math.max(...counts, 1);
    return days.map((name, i) => ({ name, count: counts[i], intensity: counts[i] / max }));
  }, [events]);

  const rhythmType = useMemo(() => {
    const night = hourlyData.slice(22, 24).concat(hourlyData.slice(0, 6));
    const morning = hourlyData.slice(6, 12);
    const afternoon = hourlyData.slice(12, 18);
    const evening = hourlyData.slice(18, 22);

    const nightSum = night.reduce((s, d) => s + d.count, 0);
    const morningSum = morning.reduce((s, d) => s + d.count, 0);
    const afternoonSum = afternoon.reduce((s, d) => s + d.count, 0);
    const eveningSum = evening.reduce((s, d) => s + d.count, 0);

    const max = Math.max(nightSum, morningSum, afternoonSum, eveningSum);
    if (max === nightSum) return { name: 'Night Owl 🦉', desc: 'Most active between 10PM–6AM', bpm: 140 };
    if (max === morningSum) return { name: 'Early Bird 🐦', desc: 'Peak productivity 6AM–12PM', bpm: 120 };
    if (max === afternoonSum) return { name: 'Steady Cruiser 🚀', desc: 'Afternoon power coder 12PM–6PM', bpm: 100 };
    return { name: 'Evening Warrior ⚔️', desc: 'Fires up after dinner 6PM–10PM', bpm: 130 };
  }, [hourlyData]);

  return (
    <div className="score-card">
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
        <Music className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-foreground">Code Rhythm</h3>
        <span className="ml-auto text-xs px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 font-medium">
          {rhythmType.bpm} BPM
        </span>
      </div>

      {/* Rhythm type badge */}
      <div className="text-center mb-6">
        <motion.div
          className="text-2xl font-bold text-foreground"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {rhythmType.name}
        </motion.div>
        <p className="text-xs text-muted-foreground mt-1">{rhythmType.desc}</p>
      </div>

      {/* 24-hour equalizer */}
      <div className="mb-6">
        <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
          <Clock className="w-3 h-3" /> 24-Hour Activity Equalizer
        </p>
        <div className="flex items-end gap-0.5 h-24">
          {hourlyData.map((d, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-sm relative group cursor-pointer"
              style={{
                background: d.hour === peakHour
                  ? 'linear-gradient(to top, hsl(var(--primary)), hsl(var(--secondary)))'
                  : `linear-gradient(to top, hsl(var(--primary) / ${0.2 + d.intensity * 0.8}), hsl(var(--secondary) / ${0.1 + d.intensity * 0.6}))`,
              }}
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(8, d.intensity * 100)}%` }}
              transition={{ delay: i * 0.03, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Pulse animation for bars */}
              <motion.div
                className="absolute inset-0 rounded-t-sm"
                style={{
                  background: 'linear-gradient(to top, transparent, hsl(var(--primary) / 0.3))',
                }}
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 1.5 + Math.random(),
                  repeat: Infinity,
                  delay: i * 0.05,
                }}
              />
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-card border border-border rounded px-1.5 py-0.5 text-[9px] text-foreground whitespace-nowrap shadow-lg">
                  {d.label}: {d.count}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-muted-foreground">12AM</span>
          <span className="text-[9px] text-muted-foreground">6AM</span>
          <span className="text-[9px] text-muted-foreground">12PM</span>
          <span className="text-[9px] text-muted-foreground">6PM</span>
          <span className="text-[9px] text-muted-foreground">11PM</span>
        </div>
      </div>

      {/* Weekly rhythm */}
      <div>
        <p className="text-xs text-muted-foreground mb-3">Weekly Groove</p>
        <div className="grid grid-cols-7 gap-1.5">
          {dayData.map((d, i) => (
            <motion.div
              key={d.name}
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
            >
              <motion.div
                className="mx-auto w-full aspect-square rounded-lg flex items-center justify-center text-[10px] font-mono font-bold"
                style={{
                  background: `linear-gradient(135deg, hsl(var(--primary) / ${0.1 + d.intensity * 0.5}), hsl(var(--accent) / ${0.05 + d.intensity * 0.3}))`,
                  color: d.intensity > 0.5 ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                  boxShadow: d.intensity > 0.7 ? '0 0 12px hsl(var(--primary) / 0.3)' : 'none',
                }}
                animate={d.intensity > 0.8 ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {d.count}
              </motion.div>
              <span className="text-[9px] text-muted-foreground mt-1 block">{d.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

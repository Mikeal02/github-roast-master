import { motion } from 'framer-motion';
import { Flame, Users, Star, Sparkles, Check } from 'lucide-react';
import { SectionHeader } from './FeatureShowcase';

const roastFeatures = [
  'Devastatingly funny AI roasts citing real metrics',
  'Developer personality & coding persona analysis',
  'Achievement badges & XP leveling system',
  'Shareable roast cards for social media',
  'Code rhythm & tempo visualization',
  'Time machine through coding history',
];

const recruiterFeatures = [
  'Career trajectory & salary tier estimation',
  'Red/green flags for hiring decisions',
  'Team fit & leadership potential analysis',
  'Exportable PDF reports for stakeholders',
  'Innovation index & reliability scoring',
  'Technical depth assessment across stacks',
];

function ModeCard({
  title,
  subtitle,
  icon,
  features,
  color,
  gradient,
  direction,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  features: string[];
  color: string;
  gradient: string;
  direction: 'left' | 'right';
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: direction === 'left' ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel p-7 relative overflow-hidden group"
    >
      {/* Background orb */}
      <div
        className="absolute -top-20 -right-20 w-56 h-56 rounded-full opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none"
        style={{ background: `radial-gradient(circle, hsl(${color}), transparent)` }}
      />
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <motion.div
            className="p-3 rounded-xl"
            style={{ background: `hsl(${color} / 0.12)` }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            {icon}
          </motion.div>
          <div>
            <h3 className="font-bold text-foreground text-lg">{title}</h3>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <div className="elite-divider mb-5" />
        <ul className="space-y-3">
          {features.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.06 }}
              className="flex items-start gap-2.5 text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors"
            >
              <Check
                className="w-4 h-4 mt-0.5 shrink-0"
                style={{ color: `hsl(${color})` }}
              />
              <span>{item}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export function DualModes() {
  return (
    <section>
      <SectionHeader
        badge="DUAL MODES"
        title="Roast or Recruit — Your Choice"
        subtitle="Switch between savage comedy and professional analysis with a single click."
      />
      <div className="grid md:grid-cols-2 gap-6">
        <ModeCard
          title="Roast Mode"
          subtitle="Comedy meets code analysis"
          icon={<Flame className="w-6 h-6 text-destructive" />}
          features={roastFeatures}
          color="var(--destructive)"
          gradient="from-destructive/20 to-transparent"
          direction="left"
        />
        <ModeCard
          title="Recruiter Mode"
          subtitle="Professional hiring intelligence"
          icon={<Users className="w-6 h-6 text-secondary" />}
          features={recruiterFeatures}
          color="var(--secondary)"
          gradient="from-secondary/20 to-transparent"
          direction="right"
        />
      </div>
    </section>
  );
}

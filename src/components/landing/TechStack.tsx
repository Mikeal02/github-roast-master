import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Cpu, Database, Palette, Gauge, Lock, Cloud } from 'lucide-react';
import { SectionHeader } from './FeatureShowcase';

const techs = [
  { icon: <Cpu className="w-5 h-5" />, name: 'Gemini AI', desc: 'Advanced language model for nuanced analysis', color: 'var(--terminal-cyan)' },
  { icon: <Database className="w-5 h-5" />, name: 'GitHub API', desc: 'Real-time data from 300+ profile endpoints', color: 'var(--primary)' },
  { icon: <Palette className="w-5 h-5" />, name: 'Framer Motion', desc: 'Buttery smooth 60fps animations throughout', color: 'var(--accent)' },
  { icon: <Gauge className="w-5 h-5" />, name: 'Edge Functions', desc: 'Lightning-fast serverless compute at the edge', color: 'var(--terminal-yellow)' },
  { icon: <Lock className="w-5 h-5" />, name: 'Privacy First', desc: 'No data stored, no tracking, fully transparent', color: 'var(--terminal-green)' },
  { icon: <Cloud className="w-5 h-5" />, name: 'Cloud Native', desc: 'Scalable infrastructure with global CDN delivery', color: 'var(--secondary)' },
];

export function TechStack() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section>
      <SectionHeader
        badge="POWERED BY"
        title="Built with Elite Technology"
        subtitle="Enterprise-grade infrastructure delivering consumer-grade simplicity."
      />
      <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {techs.map((tech, i) => (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="glass-panel p-5 flex items-start gap-4 group"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
              style={{
                background: `hsl(${tech.color} / 0.1)`,
                color: `hsl(${tech.color})`,
              }}
            >
              {tech.icon}
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm mb-0.5">{tech.name}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{tech.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Quote } from 'lucide-react';
import { SectionHeader } from './FeatureShowcase';

const testimonials = [
  {
    quote: "This tool absolutely destroyed my ego, then gave me the most accurate career assessment I've ever seen. 10/10.",
    author: 'Senior Dev',
    handle: '@fullstack_dev',
    rating: 5,
  },
  {
    quote: "We replaced two assessment tools with this. The recruiter mode's insights are genuinely useful for hiring.",
    author: 'Engineering Manager',
    handle: '@eng_lead',
    rating: 5,
  },
  {
    quote: "The Developer DNA visualization is unlike anything I've seen. It actually captured my coding patterns perfectly.",
    author: 'Open Source Contributor',
    handle: '@oss_maintainer',
    rating: 5,
  },
  {
    quote: "Shared my roast on Twitter and it went viral. The AI knew I was a weekend warrior before I admitted it.",
    author: 'Indie Hacker',
    handle: '@indie_builder',
    rating: 5,
  },
];

export function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section>
      <SectionHeader
        badge="WALL OF FAME"
        title="What Developers Are Saying"
        subtitle="Real reactions from developers who dared to get roasted."
      />
      <div ref={ref} className="grid sm:grid-cols-2 gap-5">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel p-6 relative overflow-hidden group"
          >
            <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/[0.06] group-hover:text-primary/[0.12] transition-colors" />
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} className="w-3.5 h-3.5 fill-terminal-yellow text-terminal-yellow" />
              ))}
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed mb-4 italic">"{t.quote}"</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                {t.author[0]}
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">{t.author}</p>
                <p className="text-[10px] text-muted-foreground">{t.handle}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

import { MapPin, Link as LinkIcon, Calendar, Users, BookOpen, ExternalLink, Verified, Building2, Briefcase, FileCode } from 'lucide-react';
import { formatDate } from '@/lib/githubApi';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { AnimatedCounter } from './AnimatedCounter';

export function ProfileCard({ user, orgCount = 0, gistCount = 0 }: { user: any; orgCount?: number; gistCount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const accountAgeDays = Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24));
  const accountAgeYears = Math.floor(accountAgeDays / 365);
  const accountAgeMonths = Math.floor((accountAgeDays % 365) / 30);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="score-card flex flex-col md:flex-row gap-6 items-center md:items-start gradient-border"
    >
      <div className="relative">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-primary/30 ring-4 ring-primary/10"
        >
          <img
            src={user.avatar_url}
            alt={user.login}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: 0.4, type: 'spring' }}
          className="absolute -bottom-2 -right-2 bg-card border border-border rounded-xl px-2.5 py-1 text-[10px] font-mono text-primary shadow-lg"
        >
          #{user.id}
        </motion.div>
        {user.followers >= 100 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.6, type: 'spring' }}
            className="absolute -top-2 -left-2 p-1 rounded-lg bg-terminal-yellow/20 border border-terminal-yellow/40"
          >
            <Verified className="w-3.5 h-3.5 text-terminal-yellow" />
          </motion.div>
        )}
      </div>

      <div className="flex-1 text-center md:text-left">
        <div className="flex items-center gap-3 justify-center md:justify-start flex-wrap">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            {user.name || user.login}
          </h2>
          {user.hireable && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-terminal-green/15 text-terminal-green border border-terminal-green/30 font-medium">
              Open to work
            </span>
          )}
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </a>
        </div>
        <a
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-mono text-sm"
        >
          @{user.login}
        </a>

        {user.bio && (
          <p className="text-muted-foreground mt-3 text-sm max-w-md leading-relaxed">
            {user.bio}
          </p>
        )}

        <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="w-4 h-4 text-secondary" />
            <AnimatedCounter value={user.followers} className="text-foreground font-bold" /> followers
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <AnimatedCounter value={user.following} className="text-foreground font-bold" /> following
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <BookOpen className="w-4 h-4 text-secondary" />
            <AnimatedCounter value={user.public_repos} className="text-foreground font-bold" /> repos
          </div>
          {gistCount > 0 && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <FileCode className="w-4 h-4 text-secondary" />
              <AnimatedCounter value={gistCount} className="text-foreground font-bold" /> gists
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 mt-3 justify-center md:justify-start text-xs text-muted-foreground">
          {user.company && (
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3 h-3" />
              {user.company}
            </div>
          )}
          {user.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3" />
              {user.location}
            </div>
          )}
          {user.blog && (
            <a
              href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <LinkIcon className="w-3 h-3" />
              Website
            </a>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            Joined {formatDate(user.created_at)}
            <span className="text-muted-foreground/70">
              ({accountAgeYears}y {accountAgeMonths}m)
            </span>
          </div>
          {orgCount > 0 && (
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-3 h-3" />
              {orgCount} org{orgCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

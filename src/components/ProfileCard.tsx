import { MapPin, Link as LinkIcon, Calendar, Users, BookOpen, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/githubApi';
import { motion } from 'framer-motion';

export function ProfileCard({ user }: { user: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="score-card flex flex-col md:flex-row gap-6 items-center md:items-start gradient-border"
    >
      <div className="relative">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
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
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
          className="absolute -bottom-2 -right-2 bg-card border border-border rounded-xl px-2.5 py-1 text-[10px] font-mono text-primary shadow-lg"
        >
          #{user.id}
        </motion.div>
      </div>
      
      <div className="flex-1 text-center md:text-left">
        <div className="flex items-center gap-3 justify-center md:justify-start">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            {user.name || user.login}
          </h2>
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
            <span className="text-foreground font-bold">{user.followers.toLocaleString()}</span> followers
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className="text-foreground font-bold">{user.following.toLocaleString()}</span> following
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <BookOpen className="w-4 h-4 text-secondary" />
            <span className="text-foreground font-bold">{user.public_repos}</span> repos
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mt-3 justify-center md:justify-start text-xs text-muted-foreground">
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
          </div>
        </div>
      </div>
    </motion.div>
  );
}
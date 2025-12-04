import { MapPin, Link as LinkIcon, Calendar, Users, BookOpen } from 'lucide-react';
import { formatDate } from '@/lib/githubApi';

export function ProfileCard({ user }) {
  return (
    <div className="score-card flex flex-col md:flex-row gap-6 items-center md:items-start">
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary glow-border">
          <img 
            src={user.avatar_url} 
            alt={user.login}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-card border border-primary rounded-full px-3 py-1 text-xs font-mono text-primary">
          #{user.id}
        </div>
      </div>
      
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-2xl font-bold text-foreground mb-1">
          {user.name || user.login}
        </h2>
        <a 
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-mono text-sm"
        >
          @{user.login}
        </a>
        
        {user.bio && (
          <p className="text-muted-foreground mt-3 text-sm max-w-md">
            {user.bio}
          </p>
        )}
        
        <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-4 h-4 text-secondary" />
            <span className="text-foreground font-semibold">{user.followers}</span> followers
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="text-foreground font-semibold">{user.following}</span> following
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <BookOpen className="w-4 h-4 text-secondary" />
            <span className="text-foreground font-semibold">{user.public_repos}</span> repos
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mt-3 justify-center md:justify-start text-xs text-muted-foreground">
          {user.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {user.location}
            </div>
          )}
          {user.blog && (
            <a 
              href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <LinkIcon className="w-3 h-3" />
              Website
            </a>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Joined {formatDate(user.created_at)}
          </div>
        </div>
      </div>
    </div>
  );
}

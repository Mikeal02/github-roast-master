import { useRef, useState } from 'react';
import { Share2, Download, Twitter, Linkedin, Copy, Check, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';

interface SocialShareCardProps {
  username: string;
  avatarUrl: string;
  score: number;
  archetype?: { name: string; emoji: string; description: string };
  topLanguages: string[];
  totalStars: number;
  totalRepos: number;
  followers: number;
  isRecruiterMode: boolean;
  personality?: { personalityType?: { type: string; emoji: string } };
}

export function SocialShareCard({
  username, avatarUrl, score, archetype, topLanguages, totalStars, totalRepos, followers, isRecruiterMode, personality
}: SocialShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const getScoreGradient = (s: number) => {
    if (s >= 80) return 'from-emerald-500 to-cyan-500';
    if (s >= 60) return 'from-cyan-500 to-blue-500';
    if (s >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3,
        backgroundColor: '#0d0f14',
      });
      const link = document.createElement('a');
      link.download = `${username}-github-card.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Card downloaded!');
    } catch {
      toast.error('Failed to generate card');
    } finally {
      setIsExporting(false);
    }
  };

  const shareToTwitter = () => {
    const text = isRecruiterMode
      ? `Check out @${username}'s GitHub profile analysis! Score: ${score}/100 🎯\n\nAnalyzed by GitHub Profile Analyzer`
      : `@${username} just got roasted by AI! Score: ${score}/100 🔥\n\nRoasted by GitHub Roast Machine`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Image className="w-4 h-4" />
          Share Card
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            Share Your Analysis
          </DialogTitle>
        </DialogHeader>

        {/* The shareable card */}
        <div ref={cardRef} className="rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d0f14 0%, #111827 50%, #0d0f14 100%)' }}>
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <img src={avatarUrl} alt={username} className="w-14 h-14 rounded-full border-2" style={{ borderColor: '#00ff00' }} />
                <div>
                  <p className="font-bold text-lg" style={{ color: '#e5e7eb' }}>@{username}</p>
                  {archetype && (
                    <p className="text-xs" style={{ color: '#9ca3af' }}>
                      {archetype.emoji} {archetype.name}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold font-mono" style={{ color: score >= 70 ? '#00ff00' : score >= 50 ? '#fbbf24' : '#ef4444' }}>
                  {score}
                </p>
                <p className="text-[10px] uppercase tracking-wider" style={{ color: '#6b7280' }}>Score</p>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <p className="text-lg font-bold font-mono" style={{ color: '#fbbf24' }}>⭐ {totalStars}</p>
                <p className="text-[10px]" style={{ color: '#6b7280' }}>Stars</p>
              </div>
              <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <p className="text-lg font-bold font-mono" style={{ color: '#06b6d4' }}>📁 {totalRepos}</p>
                <p className="text-[10px]" style={{ color: '#6b7280' }}>Repos</p>
              </div>
              <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <p className="text-lg font-bold font-mono" style={{ color: '#a78bfa' }}>👥 {followers}</p>
                <p className="text-[10px]" style={{ color: '#6b7280' }}>Followers</p>
              </div>
            </div>

            {/* Languages */}
            {topLanguages.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {topLanguages.slice(0, 5).map(lang => (
                  <span key={lang} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,255,0,0.1)', color: '#00ff00', border: '1px solid rgba(0,255,0,0.2)' }}>
                    {lang}
                  </span>
                ))}
              </div>
            )}

            {/* Personality badge */}
            {personality?.personalityType && (
              <div className="p-2 rounded-lg mb-3" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <p className="text-xs" style={{ color: '#a78bfa' }}>
                  {personality.personalityType.emoji} {personality.personalityType.type}
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="text-[10px] font-mono" style={{ color: '#4b5563' }}>
                {isRecruiterMode ? '💼 GitHub Profile Analyzer' : '🔥 GitHub Roast Machine'}
              </p>
              <p className="text-[10px]" style={{ color: '#4b5563' }}>roastmygit.lovable.app</p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Button onClick={downloadCard} disabled={isExporting} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            {isExporting ? 'Generating...' : 'Download PNG'}
          </Button>
          <Button onClick={copyLink} variant="outline" className="gap-2">
            {copied ? <Check className="w-4 h-4 text-terminal-green" /> : <Copy className="w-4 h-4" />}
            Copy Link
          </Button>
          <Button onClick={shareToTwitter} variant="outline" className="gap-2">
            <Twitter className="w-4 h-4" />
            Share on X
          </Button>
          <Button onClick={shareToLinkedIn} variant="outline" className="gap-2">
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

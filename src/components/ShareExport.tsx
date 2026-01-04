import { useState, useRef } from 'react';
import { Share2, Download, Copy, Check, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { toPng } from 'html-to-image';

interface ShareExportProps {
  username: string;
  score: number;
  isRecruiterMode: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
}

export function ShareExport({ username, score, isRecruiterMode, containerRef }: ShareExportProps) {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const shareText = isRecruiterMode
    ? `Check out @${username}'s GitHub profile analysis! Score: ${score}/100 🎯`
    : `@${username} just got roasted by AI! Score: ${score}/100 🔥`;

  const shareUrl = window.location.href;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const downloadImage = async () => {
    if (!containerRef.current) return;
    
    setIsExporting(true);
    try {
      const dataUrl = await toPng(containerRef.current, {
        backgroundColor: '#0d0f14',
        pixelRatio: 2,
        style: {
          padding: '24px',
        }
      });
      
      const link = document.createElement('a');
      link.download = `github-${isRecruiterMode ? 'analysis' : 'roast'}-${username}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Image downloaded!');
    } catch {
      toast.error('Failed to export image');
    } finally {
      setIsExporting(false);
    }
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={copyToClipboard} className="gap-2 cursor-pointer">
          {copied ? <Check className="w-4 h-4 text-terminal-green" /> : <Copy className="w-4 h-4" />}
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={downloadImage} disabled={isExporting} className="gap-2 cursor-pointer">
          <Download className="w-4 h-4" />
          {isExporting ? 'Exporting...' : 'Download Image'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={shareToTwitter} className="gap-2 cursor-pointer">
          <Twitter className="w-4 h-4" />
          Share on X
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareToLinkedIn} className="gap-2 cursor-pointer">
          <Linkedin className="w-4 h-4" />
          Share on LinkedIn
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

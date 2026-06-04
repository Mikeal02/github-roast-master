import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Coins, Zap, Crown, Infinity as InfinityIcon } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface UsageInfo {
  tokenUsage?: { prompt: number; completion: number; total: number };
  searchesRemaining?: number | null;
  isOwner?: boolean;
  limit?: number;
}

interface UsageMeterProps {
  usage: UsageInfo | null;
  hasOwnerKey: boolean;
  onUnlock: (key: string) => void;
  onLock: () => void;
}

export function UsageMeter({ usage, hasOwnerKey, onUnlock, onLock }: UsageMeterProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');

  const isOwner = usage?.isOwner ?? hasOwnerKey;
  const limit = usage?.limit ?? 3;
  const remaining = usage?.searchesRemaining;
  const tokens = usage?.tokenUsage;

  const handleSave = () => {
    onUnlock(input.trim());
    setInput('');
    setOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto mt-4 flex flex-wrap items-center justify-center gap-2.5 text-[11px] font-mono"
    >
      {/* Remaining / Owner badge */}
      {isOwner ? (
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/30">
          <Crown className="w-3.5 h-3.5" />
          Owner — <InfinityIcon className="w-3.5 h-3.5" /> unlimited
        </span>
      ) : (
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/40 text-muted-foreground border border-border">
          <Zap className="w-3.5 h-3.5 text-terminal-yellow" />
          {remaining === null || remaining === undefined ? (
            <>Free searches: <span className="text-foreground font-semibold">{limit}</span> lifetime</>
          ) : (
            <><span className="text-foreground font-semibold">{remaining}</span> of {limit} free searches left</>
          )}
        </span>
      )}

      {/* Token usage badge */}
      {tokens && tokens.total > 0 && (
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary border border-secondary/30">
          <Coins className="w-3.5 h-3.5" />
          {tokens.total.toLocaleString()} tokens
          <span className="text-muted-foreground/70">
            ({tokens.prompt.toLocaleString()} in / {tokens.completion.toLocaleString()} out)
          </span>
        </span>
      )}

      {/* Owner unlock */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/40 text-muted-foreground border border-border hover:text-primary hover:border-primary/30 transition-colors">
            {isOwner ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            {isOwner ? 'Owner mode' : 'Unlock'}
          </button>
        </DialogTrigger>
        <DialogContent className="glass-panel border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-mono">
              <Crown className="w-4 h-4 text-primary" /> Owner Access
            </DialogTitle>
            <DialogDescription>
              Enter the owner passcode for unlimited searches. It is stored only on this device.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="owner passcode"
            className="font-mono"
            autoComplete="off"
          />
          <DialogFooter className="gap-2 sm:gap-2">
            {hasOwnerKey && (
              <Button variant="outline" onClick={() => { onLock(); setOpen(false); }} className="font-mono">
                <Lock className="w-3.5 h-3.5 mr-1.5" /> Lock
              </Button>
            )}
            <Button onClick={handleSave} disabled={!input.trim()} className="font-mono">
              <Unlock className="w-3.5 h-3.5 mr-1.5" /> Unlock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

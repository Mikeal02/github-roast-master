import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Search, Loader2, X, Zap, Trophy, Star, GitFork, Users, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { fetchGitHubUser, fetchUserRepos, fetchUserEvents, fetchUserOrgs, fetchUserGists, fetchUserStarred } from '@/lib/githubApi';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RoastBattleProps {
  currentUsername: string;
  currentAnalysis: any;
  currentUserData: any;
}

interface BattleResult {
  userData: any;
  analysis: any;
  trashTalk: string[];
  winner: string;
  verdict: string;
}

export function RoastBattle({ currentUsername, currentAnalysis, currentUserData }: RoastBattleProps) {
  const [open, setOpen] = useState(false);
  const [opponentUsername, setOpponentUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [showVS, setShowVS] = useState(false);
  const [phase, setPhase] = useState<'search' | 'vs' | 'battle'>('search');

  const handleBattle = async () => {
    if (!opponentUsername.trim()) return;
    setIsLoading(true);

    try {
      const [user, repos, events, orgs, gists, starred] = await Promise.all([
        fetchGitHubUser(opponentUsername),
        fetchUserRepos(opponentUsername, 100),
        fetchUserEvents(opponentUsername, 100),
        fetchUserOrgs(opponentUsername),
        fetchUserGists(opponentUsername),
        fetchUserStarred(opponentUsername, 30),
      ]);

      // Get opponent analysis
      const { data, error } = await supabase.functions.invoke('analyze-github', {
        body: { user, repos, events, orgs, gists, starred, mode: 'roast' }
      });
      if (error) throw new Error(error.message);

      // Get AI trash talk battle
      const { data: battleData, error: battleError } = await supabase.functions.invoke('roast-battle', {
        body: {
          player1: { username: currentUsername, userData: currentUserData, analysis: currentAnalysis },
          player2: { username: opponentUsername, userData: user, analysis: data },
        }
      });

      if (battleError) throw new Error(battleError.message);

      setPhase('vs');
      setShowVS(true);

      setTimeout(() => {
        setBattleResult({
          userData: user,
          analysis: data,
          trashTalk: battleData?.trashTalk || [],
          winner: battleData?.winner || currentUsername,
          verdict: battleData?.verdict || 'A close battle!',
        });
        setPhase('battle');
      }, 2500);

    } catch (err: any) {
      toast.error(err.message || 'Battle failed');
      setPhase('search');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setBattleResult(null);
    setOpponentUsername('');
    setShowVS(false);
    setPhase('search');
  };

  const ScoreCompare = ({ label, s1, s2 }: { label: string; s1: number; s2: number }) => {
    const winner = s1 > s2 ? 1 : s2 > s1 ? 2 : 0;
    return (
      <div className="flex items-center gap-2">
        <span className={`font-mono text-sm font-bold w-8 text-right ${winner === 1 ? 'text-primary' : 'text-muted-foreground'}`}>{s1}</span>
        <div className="flex-1 flex gap-0.5 h-2">
          <div className="flex-1 bg-muted rounded-l-full overflow-hidden">
            <motion.div
              className="h-full bg-primary/80 ml-auto rounded-l-full"
              initial={{ width: 0 }}
              animate={{ width: `${s1}%` }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </div>
          <div className="flex-1 bg-muted rounded-r-full overflow-hidden">
            <motion.div
              className="h-full bg-destructive/80 rounded-r-full"
              initial={{ width: 0 }}
              animate={{ width: `${s2}%` }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </div>
        </div>
        <span className={`font-mono text-sm font-bold w-8 ${winner === 2 ? 'text-destructive' : 'text-muted-foreground'}`}>{s2}</span>
        <span className="text-xs text-muted-foreground w-24">{label}</span>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Swords className="w-4 h-4" />
          Battle
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 border-none bg-transparent shadow-none">
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {/* VS Animation Overlay */}
          <AnimatePresence>
            {phase === 'vs' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl"
              >
                <div className="flex items-center gap-8">
                  <motion.div
                    initial={{ x: -200, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="text-center"
                  >
                    <img src={currentUserData.avatar_url} alt={currentUsername} className="w-24 h-24 rounded-full border-4 border-primary" />
                    <p className="font-bold text-foreground mt-2">@{currentUsername}</p>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: [0, 1.5, 1], rotate: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="relative"
                  >
                    <span className="text-6xl font-black text-gradient">VS</span>
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="absolute inset-0 rounded-full bg-primary/20 blur-xl -z-10"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ x: 200, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="text-center"
                  >
                    <img src={battleResult?.userData?.avatar_url || ''} alt={opponentUsername} className="w-24 h-24 rounded-full border-4 border-destructive" />
                    <p className="font-bold text-foreground mt-2">@{opponentUsername}</p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {phase === 'search' && (
            <div className="p-8 space-y-6">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-5xl mb-4"
                >
                  ⚔️
                </motion.div>
                <h2 className="text-2xl font-bold text-foreground">Roast Battle</h2>
                <p className="text-muted-foreground text-sm mt-1">Pick an opponent for @{currentUsername}</p>
              </div>
              <div className="flex gap-2 max-w-md mx-auto">
                <Input
                  placeholder="Enter opponent's GitHub username..."
                  value={opponentUsername}
                  onChange={(e) => setOpponentUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleBattle()}
                />
                <Button onClick={handleBattle} disabled={isLoading || !opponentUsername.trim()}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Swords className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}

          {phase === 'battle' && battleResult && (
            <div className="p-6 space-y-6">
              {/* Fighters header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={currentUserData.avatar_url} alt={currentUsername} className="w-14 h-14 rounded-full border-2 border-primary" />
                    {battleResult.winner === currentUsername && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1, type: 'spring' }}
                        className="absolute -top-2 -right-2 text-xl"
                      >
                        👑
                      </motion.div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">{currentUserData.name || currentUsername}</p>
                    <p className="text-xs text-primary font-mono">@{currentUsername}</p>
                  </div>
                </div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' }}
                >
                  <Zap className="w-8 h-8 text-terminal-yellow" />
                </motion.div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-foreground text-sm">{battleResult.userData.name || opponentUsername}</p>
                    <p className="text-xs text-destructive font-mono">@{opponentUsername}</p>
                  </div>
                  <div className="relative">
                    <img src={battleResult.userData.avatar_url} alt={opponentUsername} className="w-14 h-14 rounded-full border-2 border-destructive" />
                    {battleResult.winner === opponentUsername && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1, type: 'spring' }}
                        className="absolute -top-2 -right-2 text-xl"
                      >
                        👑
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Score comparisons */}
              <div className="space-y-2 py-4 border-y border-border">
                <ScoreCompare label="Overall" s1={currentAnalysis.scores?.overall?.score || 0} s2={battleResult.analysis.scores?.overall?.score || 0} />
                <ScoreCompare label="Activity" s1={currentAnalysis.scores?.activity?.score || 0} s2={battleResult.analysis.scores?.activity?.score || 0} />
                <ScoreCompare label="Code Quality" s1={currentAnalysis.scores?.codeQuality?.score || 0} s2={battleResult.analysis.scores?.codeQuality?.score || 0} />
                <ScoreCompare label="Popularity" s1={currentAnalysis.scores?.popularity?.score || 0} s2={battleResult.analysis.scores?.popularity?.score || 0} />
                <ScoreCompare label="Diversity" s1={currentAnalysis.scores?.diversity?.score || 0} s2={battleResult.analysis.scores?.diversity?.score || 0} />
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: <Star className="w-4 h-4" />, l: currentAnalysis.totalStars || 0, r: battleResult.analysis.totalStars || 0, label: 'Stars' },
                  { icon: <GitFork className="w-4 h-4" />, l: currentAnalysis.totalForks || 0, r: battleResult.analysis.totalForks || 0, label: 'Forks' },
                  { icon: <Users className="w-4 h-4" />, l: currentUserData.followers, r: battleResult.userData.followers, label: 'Followers' },
                  { icon: <Code2 className="w-4 h-4" />, l: currentUserData.public_repos, r: battleResult.userData.public_repos, label: 'Repos' },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="text-center p-2 bg-muted/30 rounded-xl"
                  >
                    <div className="flex justify-center text-muted-foreground mb-1">{s.icon}</div>
                    <div className="flex justify-center gap-2 text-xs font-mono">
                      <span className={s.l > s.r ? 'text-primary font-bold' : 'text-muted-foreground'}>{s.l}</span>
                      <span className="text-muted-foreground">/</span>
                      <span className={s.r > s.l ? 'text-destructive font-bold' : 'text-muted-foreground'}>{s.r}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* AI Trash Talk */}
              {battleResult.trashTalk.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Swords className="w-4 h-4 text-destructive" />
                    AI Trash Talk
                  </h3>
                  <div className="space-y-2">
                    {battleResult.trashTalk.map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.2 }}
                        className={`p-3 rounded-2xl text-sm ${
                          i % 2 === 0
                            ? 'bg-primary/10 border border-primary/20 mr-8 rounded-bl-sm'
                            : 'bg-destructive/10 border border-destructive/20 ml-8 rounded-br-sm text-right'
                        }`}
                      >
                        <p className="text-foreground">{line}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {i % 2 === 0 ? `@${currentUsername}` : `@${opponentUsername}`}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Verdict */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 }}
                className="text-center p-6 bg-gradient-to-r from-primary/10 via-card to-destructive/10 border border-border rounded-2xl"
              >
                <Trophy className="w-8 h-8 text-terminal-yellow mx-auto mb-2" />
                <p className="text-lg font-bold text-foreground">
                  🏆 Winner: <span className="text-gradient">@{battleResult.winner}</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">{battleResult.verdict}</p>
              </motion.div>

              <Button variant="outline" onClick={reset} className="w-full gap-2">
                <Swords className="w-4 h-4" /> New Battle
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
import { useState } from 'react';
import { GitCompare, Search, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { fetchGitHubUser, fetchUserRepos } from '@/lib/githubApi';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CompareProfilesProps {
  currentUsername: string;
  currentAnalysis: any;
  currentUserData: any;
}

interface CompareResult {
  username: string;
  userData: any;
  analysis: any;
}

export function CompareProfiles({ currentUsername, currentAnalysis, currentUserData }: CompareProfilesProps) {
  const [open, setOpen] = useState(false);
  const [compareUsername, setCompareUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [compareResult, setCompareResult] = useState<CompareResult | null>(null);

  const handleCompare = async () => {
    if (!compareUsername.trim()) return;
    
    setIsLoading(true);
    try {
      const [user, repos] = await Promise.all([
        fetchGitHubUser(compareUsername),
        fetchUserRepos(compareUsername, 30),
      ]);

      const { data, error } = await supabase.functions.invoke('analyze-github', {
        body: { user, repos, mode: 'recruiter' }
      });

      if (error) throw new Error(error.message);

      setCompareResult({
        username: compareUsername,
        userData: user,
        analysis: data,
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch profile');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-terminal-green';
    if (score >= 50) return 'text-terminal-yellow';
    if (score >= 30) return 'text-terminal-cyan';
    return 'text-terminal-red';
  };

  const ComparisonBar = ({ label, value1, value2, max = 100 }: { label: string; value1: number; value2: number; max?: number }) => {
    const width1 = (value1 / max) * 100;
    const width2 = (value2 / max) * 100;
    const winner = value1 > value2 ? 1 : value1 < value2 ? 2 : 0;
    
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className={winner === 1 ? 'text-terminal-green font-semibold' : ''}>{value1}</span>
          <span className="text-foreground font-medium">{label}</span>
          <span className={winner === 2 ? 'text-terminal-green font-semibold' : ''}>{value2}</span>
        </div>
        <div className="flex gap-1 h-2">
          <div className="flex-1 bg-muted rounded-l overflow-hidden">
            <div 
              className="h-full bg-terminal-cyan transition-all duration-500"
              style={{ width: `${width1}%`, marginLeft: 'auto' }}
            />
          </div>
          <div className="flex-1 bg-muted rounded-r overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-500"
              style={{ width: `${width2}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <GitCompare className="w-4 h-4" />
          Compare
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-primary" />
            Compare Profiles
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!compareResult ? (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter GitHub username to compare..."
                  value={compareUsername}
                  onChange={(e) => setCompareUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCompare()}
                  className="flex-1"
                />
                <Button onClick={handleCompare} disabled={isLoading || !compareUsername.trim()}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Compare @{currentUsername}'s profile with another developer
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header with avatars */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={currentUserData.avatar_url} 
                    alt={currentUsername}
                    className="w-12 h-12 rounded-full border-2 border-terminal-cyan"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{currentUserData.name || currentUsername}</p>
                    <p className="text-xs text-terminal-cyan">@{currentUsername}</p>
                  </div>
                </div>
                
                <span className="text-2xl font-bold text-muted-foreground">VS</span>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{compareResult.userData.name || compareResult.username}</p>
                    <p className="text-xs text-accent">@{compareResult.username}</p>
                  </div>
                  <img 
                    src={compareResult.userData.avatar_url} 
                    alt={compareResult.username}
                    className="w-12 h-12 rounded-full border-2 border-accent"
                  />
                </div>
              </div>

              {/* Overall Scores */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="text-center">
                  <p className={`text-3xl font-bold font-mono ${getScoreColor(currentAnalysis.scores?.overall?.score || 0)}`}>
                    {currentAnalysis.scores?.overall?.score || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Overall Score</p>
                </div>
                <div className="flex items-center justify-center">
                  <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold">
                    {(currentAnalysis.scores?.overall?.score || 0) > (compareResult.analysis.scores?.overall?.score || 0) 
                      ? `+${(currentAnalysis.scores?.overall?.score || 0) - (compareResult.analysis.scores?.overall?.score || 0)}`
                      : (currentAnalysis.scores?.overall?.score || 0) < (compareResult.analysis.scores?.overall?.score || 0)
                      ? `${(currentAnalysis.scores?.overall?.score || 0) - (compareResult.analysis.scores?.overall?.score || 0)}`
                      : 'TIE'
                    }
                  </div>
                </div>
                <div className="text-center">
                  <p className={`text-3xl font-bold font-mono ${getScoreColor(compareResult.analysis.scores?.overall?.score || 0)}`}>
                    {compareResult.analysis.scores?.overall?.score || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Overall Score</p>
                </div>
              </div>

              {/* Detailed Comparisons */}
              <div className="space-y-3">
                <ComparisonBar 
                  label="Followers"
                  value1={currentUserData.followers}
                  value2={compareResult.userData.followers}
                  max={Math.max(currentUserData.followers, compareResult.userData.followers) || 1}
                />
                <ComparisonBar 
                  label="Public Repos"
                  value1={currentUserData.public_repos}
                  value2={compareResult.userData.public_repos}
                  max={Math.max(currentUserData.public_repos, compareResult.userData.public_repos) || 1}
                />
                <ComparisonBar 
                  label="Activity Score"
                  value1={currentAnalysis.scores?.activity?.score || 0}
                  value2={compareResult.analysis.scores?.activity?.score || 0}
                />
                <ComparisonBar 
                  label="Documentation"
                  value1={currentAnalysis.scores?.documentation?.score || 0}
                  value2={compareResult.analysis.scores?.documentation?.score || 0}
                />
                <ComparisonBar 
                  label="Popularity"
                  value1={currentAnalysis.scores?.popularity?.score || 0}
                  value2={compareResult.analysis.scores?.popularity?.score || 0}
                />
                <ComparisonBar 
                  label="Diversity"
                  value1={currentAnalysis.scores?.diversity?.score || 0}
                  value2={compareResult.analysis.scores?.diversity?.score || 0}
                />
              </div>

              <Button 
                variant="outline" 
                onClick={() => setCompareResult(null)} 
                className="w-full gap-2"
              >
                <X className="w-4 h-4" />
                Compare with someone else
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

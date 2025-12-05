import { useState } from 'react';
import { Activity, FileText, Star, Code2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { SearchHistory } from '@/components/SearchHistory';
import { ProfileCard } from '@/components/ProfileCard';
import { ScoreCard } from '@/components/ScoreCard';
import { LanguageChart } from '@/components/LanguageChart';
import { RoastTerminal } from '@/components/RoastTerminal';
import { RecruiterTerminal } from '@/components/RecruiterTerminal';
import { StatsGrid } from '@/components/StatsGrid';
import { ActivityBadge } from '@/components/ActivityBadge';
import { LoadingState } from '@/components/LoadingState';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { ModeToggle } from '@/components/ModeToggle';
import { RecruiterMetric } from '@/components/RecruiterMetric';
import { PersonalityProfile } from '@/components/PersonalityProfile';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { fetchGitHubUser, fetchUserRepos } from '@/lib/githubApi';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [searchedUsername, setSearchedUsername] = useState('');
  const [isRecruiterMode, setIsRecruiterMode] = useState(false);
  
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();

  const handleSearch = async (username: string) => {
    setIsLoading(true);
    setError(null);
    setUserData(null);
    setAiAnalysis(null);
    setSearchedUsername(username);

    try {
      // Fetch GitHub data
      const [user, repos] = await Promise.all([
        fetchGitHubUser(username),
        fetchUserRepos(username, 30),
      ]);

      setUserData(user);

      // Call AI edge function for analysis
      toast.info('🤖 AI is analyzing the profile...');
      
      const { data, error: fnError } = await supabase.functions.invoke('analyze-github', {
        body: { user, repos, mode: isRecruiterMode ? 'recruiter' : 'roast' }
      });

      if (fnError) {
        console.error('Edge function error:', fnError);
        throw new Error(fnError.message || 'Failed to analyze profile');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setAiAnalysis(data);
      addToHistory(username);
      toast.success('✨ AI analysis complete!');
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || 'An unexpected error occurred');
      toast.error(err.message || 'Failed to analyze profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Re-analyze when mode changes (if we have data)
  const handleModeToggle = async (newMode: boolean) => {
    setIsRecruiterMode(newMode);
    
    if (userData && searchedUsername) {
      // Re-run analysis with new mode
      handleSearch(searchedUsername);
    }
  };

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <Header isRecruiterMode={isRecruiterMode} />
        
        <ModeToggle isRecruiterMode={isRecruiterMode} onToggle={handleModeToggle} />
        
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        
        <SearchHistory
          history={history}
          onSelect={handleSearch}
          onRemove={removeFromHistory}
          onClear={clearHistory}
        />

        <div className="mt-12">
          {isLoading && <LoadingState />}
          
          {error && !isLoading && (
            <ErrorDisplay error={error} onRetry={() => handleSearch(searchedUsername)} />
          )}
          
          {userData && aiAnalysis && !isLoading && !error && (
            <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
              <ProfileCard user={userData} />
              
              <ActivityBadge 
                status={aiAnalysis.activityStatus?.label || 'Unknown'} 
                finalScore={aiAnalysis.scores?.overall?.score || 0} 
                archetype={aiAnalysis.archetype}
                isRecruiterMode={isRecruiterMode}
              />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ScoreCard
                  title="Activity"
                  score={aiAnalysis.scores?.activity?.score || 0}
                  icon={<Activity className="w-4 h-4" />}
                  explanation={aiAnalysis.scores?.activity?.explanation}
                  delay={0}
                />
                <ScoreCard
                  title="Documentation"
                  score={aiAnalysis.scores?.documentation?.score || 0}
                  icon={<FileText className="w-4 h-4" />}
                  explanation={aiAnalysis.scores?.documentation?.explanation}
                  delay={100}
                />
                <ScoreCard
                  title="Popularity"
                  score={aiAnalysis.scores?.popularity?.score || 0}
                  icon={<Star className="w-4 h-4" />}
                  explanation={aiAnalysis.scores?.popularity?.explanation}
                  delay={200}
                />
                <ScoreCard
                  title="Diversity"
                  score={aiAnalysis.scores?.diversity?.score || 0}
                  icon={<Code2 className="w-4 h-4" />}
                  explanation={aiAnalysis.scores?.diversity?.explanation}
                  delay={300}
                />
              </div>
              
              {isRecruiterMode && aiAnalysis.recruiterMetric && (
                <RecruiterMetric metric={aiAnalysis.recruiterMetric} />
              )}
              
              <div className="grid md:grid-cols-2 gap-6">
                <LanguageChart languages={aiAnalysis.languages || {}} />
                <StatsGrid 
                  analysis={{
                    totalRepos: userData.public_repos,
                    totalStars: Object.values(aiAnalysis.languages || {}).reduce((a: number, b: any) => a + b, 0),
                    totalForks: 0,
                    daysSinceLastUpdate: aiAnalysis.activityStatus?.daysSinceUpdate || 0,
                    languages: aiAnalysis.languages || {},
                  }} 
                  isRecruiterMode={isRecruiterMode} 
                />
              </div>
              
              {isRecruiterMode ? (
                <RecruiterTerminal 
                  insights={aiAnalysis.roastLines || []} 
                  username={userData.login}
                  scores={aiAnalysis.scores}
                />
              ) : (
                <RoastTerminal roasts={aiAnalysis.roastLines || []} username={userData.login} />
              )}
              
              {/* AI Personality Profile Section */}
              {aiAnalysis.personality && (
                <PersonalityProfile profile={aiAnalysis.personality} />
              )}
            </div>
          )}
          
          {!userData && !isLoading && !error && (
            <div className="terminal-box text-center py-16">
              <div className="text-6xl mb-4">{isRecruiterMode ? '💼' : '🔥'}</div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {isRecruiterMode ? 'Ready to Analyze' : 'Ready to Roast'}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {isRecruiterMode 
                  ? 'Enter a GitHub username above to generate an AI-powered professional assessment of their developer profile.'
                  : 'Enter a GitHub username above to get an AI-generated roast based on their coding habits.'
                }
              </p>
            </div>
          )}
        </div>
        
        <footer className="mt-16 text-center text-xs text-muted-foreground">
          <p>Made with {isRecruiterMode ? '💼' : '🔥'} and AI magic</p>
          <p className="mt-1">Powered by GitHub API + AI Models</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;

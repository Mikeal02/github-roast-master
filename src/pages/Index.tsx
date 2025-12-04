import { useState } from 'react';
import { Activity, FileText, Star, Code2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { SearchHistory } from '@/components/SearchHistory';
import { ProfileCard } from '@/components/ProfileCard';
import { ScoreCard } from '@/components/ScoreCard';
import { LanguageChart } from '@/components/LanguageChart';
import { RoastTerminal } from '@/components/RoastTerminal';
import { StatsGrid } from '@/components/StatsGrid';
import { ActivityBadge } from '@/components/ActivityBadge';
import { LoadingState } from '@/components/LoadingState';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { fetchGitHubUser, fetchUserRepos } from '@/lib/githubApi';
import { analyzeProfile, calculateScores, generateRoasts } from '@/lib/roastGenerator';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [scores, setScores] = useState(null);
  const [roasts, setRoasts] = useState([]);
  const [searchedUsername, setSearchedUsername] = useState('');
  
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();

  const handleSearch = async (username) => {
    setIsLoading(true);
    setError(null);
    setUserData(null);
    setAnalysis(null);
    setScores(null);
    setRoasts([]);
    setSearchedUsername(username);

    try {
      const [user, repos] = await Promise.all([
        fetchGitHubUser(username),
        fetchUserRepos(username, 30),
      ]);

      const profileAnalysis = analyzeProfile(user, repos);
      const profileScores = calculateScores(user, profileAnalysis);
      const generatedRoasts = generateRoasts(user, profileAnalysis, profileScores);

      setUserData(user);
      setAnalysis(profileAnalysis);
      setScores(profileScores);
      setRoasts(generatedRoasts);
      addToHistory(username);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <Header />
        
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
          
          {userData && analysis && scores && !isLoading && !error && (
            <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
              <ProfileCard user={userData} />
              
              <ActivityBadge status={scores.activityStatus} finalScore={scores.finalScore} />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ScoreCard
                  title="Activity"
                  score={scores.activityScore}
                  icon={<Activity className="w-4 h-4" />}
                  delay={0}
                />
                <ScoreCard
                  title="Documentation"
                  score={scores.documentationScore}
                  icon={<FileText className="w-4 h-4" />}
                  delay={100}
                />
                <ScoreCard
                  title="Popularity"
                  score={scores.popularityScore}
                  icon={<Star className="w-4 h-4" />}
                  delay={200}
                />
                <ScoreCard
                  title="Diversity"
                  score={scores.diversityScore}
                  icon={<Code2 className="w-4 h-4" />}
                  delay={300}
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <LanguageChart languages={analysis.languages} />
                <StatsGrid analysis={analysis} />
              </div>
              
              <RoastTerminal roasts={roasts} username={userData.login} />
            </div>
          )}
          
          {!userData && !isLoading && !error && (
            <div className="terminal-box text-center py-16">
              <div className="text-6xl mb-4">🔥</div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Ready to Roast
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Enter a GitHub username above to analyze their profile and generate a personalized roast based on their coding habits.
              </p>
            </div>
          )}
        </div>
        
        <footer className="mt-16 text-center text-xs text-muted-foreground">
          <p>Made with 🔥 and questionable humor</p>
          <p className="mt-1">Using GitHub Public API • No AI APIs • Pure rule-based roasting</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;

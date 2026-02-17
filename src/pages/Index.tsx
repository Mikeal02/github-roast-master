import { useState, useRef } from 'react';
import { Activity, FileText, Star, Code2, Shield, Users } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
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
import { ShareExport } from '@/components/ShareExport';
import { CompareProfiles } from '@/components/CompareProfiles';
import { AchievementBadges } from '@/components/AchievementBadges';
import { ActivityHeatmap } from '@/components/ActivityHeatmap';
import { ResultsSkeletonLoader } from '@/components/SkeletonLoader';
import { RadarChart } from '@/components/RadarChart';
import { CodingStreaks } from '@/components/CodingStreaks';
import { ContributionTimeline } from '@/components/ContributionTimeline';
import { TechStackAnalysis } from '@/components/TechStackAnalysis';
import { RepoDeepDive } from '@/components/RepoDeepDive';
import { SocialShareCard } from '@/components/SocialShareCard';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ResultsTabs } from '@/components/ResultsTabs';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { fetchGitHubUser, fetchUserRepos, fetchUserEvents, fetchUserOrgs, fetchUserGists, fetchUserStarred } from '@/lib/githubApi';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [searchedUsername, setSearchedUsername] = useState('');
  const [isRecruiterMode, setIsRecruiterMode] = useState(false);
  const [userEvents, setUserEvents] = useState<any[]>([]);
  const [userOrgs, setUserOrgs] = useState<any[]>([]);
  const [userGists, setUserGists] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();

  const handleSearch = async (username: string) => {
    setIsLoading(true);
    setError(null);
    setUserData(null);
    setAiAnalysis(null);
    setSearchedUsername(username);
    setActiveTab('overview');

    try {
      const [user, repos, events, orgs, gists, starred] = await Promise.all([
        fetchGitHubUser(username),
        fetchUserRepos(username, 100),
        fetchUserEvents(username, 100),
        fetchUserOrgs(username),
        fetchUserGists(username),
        fetchUserStarred(username, 30),
      ]);

      setUserData(user);
      setUserEvents(events);
      setUserOrgs(orgs);
      setUserGists(gists);

      toast.info('🤖 AI is performing deep analysis...');
      
      const { data, error: fnError } = await supabase.functions.invoke('analyze-github', {
        body: { user, repos, events, orgs, gists, starred, mode: isRecruiterMode ? 'recruiter' : 'roast' }
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
      toast.success('✨ Comprehensive analysis complete!');
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || 'An unexpected error occurred');
      toast.error(err.message || 'Failed to analyze profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeToggle = async (newMode: boolean) => {
    setIsRecruiterMode(newMode);
    if (userData && searchedUsername) {
      handleSearch(searchedUsername);
    }
  };

  const topLanguages = aiAnalysis ? Object.entries(aiAnalysis.languages || {}).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5).map(([l]) => l) : [];

  const renderTabContent = () => {
    if (!userData || !aiAnalysis) return null;

    switch (activeTab) {
      case 'overview':
        return (
          <AnimatedSection key="overview">
            <div className="space-y-6">
              <ProfileCard user={userData} />
              
              <AchievementBadges 
                userData={userData}
                analysis={{
                  totalStars: aiAnalysis.totalStars || 0,
                  totalForks: aiAnalysis.totalForks || 0,
                  languages: aiAnalysis.languages || {},
                  scores: aiAnalysis.scores,
                }}
              />
              
              <ActivityBadge 
                status={aiAnalysis.activityStatus?.label || 'Unknown'} 
                finalScore={aiAnalysis.scores?.overall?.score || 0} 
                archetype={aiAnalysis.archetype}
                isRecruiterMode={isRecruiterMode}
              />

              <CodingStreaks
                currentStreak={aiAnalysis.currentStreak || 0}
                longestStreak={aiAnalysis.longestStreak || 0}
                totalActiveDays={aiAnalysis.activeDays || 0}
                peakCodingHour={aiAnalysis.peakCodingHour}
                totalEvents={aiAnalysis.totalEvents}
              />

              {isRecruiterMode && aiAnalysis.recruiterMetric && (
                <RecruiterMetric metric={aiAnalysis.recruiterMetric} />
              )}
            </div>
          </AnimatedSection>
        );

      case 'scores':
        return (
          <AnimatedSection key="scores">
            <div className="space-y-6">
              <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StaggerItem>
                  <ScoreCard title="Activity" score={aiAnalysis.scores?.activity?.score || 0} icon={<Activity className="w-4 h-4" />} explanation={aiAnalysis.scores?.activity?.explanation} delay={0} />
                </StaggerItem>
                <StaggerItem>
                  <ScoreCard title="Documentation" score={aiAnalysis.scores?.documentation?.score || 0} icon={<FileText className="w-4 h-4" />} explanation={aiAnalysis.scores?.documentation?.explanation} delay={100} />
                </StaggerItem>
                <StaggerItem>
                  <ScoreCard title="Popularity" score={aiAnalysis.scores?.popularity?.score || 0} icon={<Star className="w-4 h-4" />} explanation={aiAnalysis.scores?.popularity?.explanation} delay={200} />
                </StaggerItem>
                <StaggerItem>
                  <ScoreCard title="Diversity" score={aiAnalysis.scores?.diversity?.score || 0} icon={<Code2 className="w-4 h-4" />} explanation={aiAnalysis.scores?.diversity?.explanation} delay={300} />
                </StaggerItem>
                <StaggerItem>
                  <ScoreCard title="Code Quality" score={aiAnalysis.scores?.codeQuality?.score || 0} icon={<Shield className="w-4 h-4" />} explanation={aiAnalysis.scores?.codeQuality?.explanation} delay={400} />
                </StaggerItem>
                <StaggerItem>
                  <ScoreCard title="Collaboration" score={aiAnalysis.scores?.collaboration?.score || 0} icon={<Users className="w-4 h-4" />} explanation={aiAnalysis.scores?.collaboration?.explanation} delay={500} />
                </StaggerItem>
              </StaggerContainer>

              <div className="grid md:grid-cols-2 gap-6">
                <RadarChart scores={aiAnalysis.scores} personality={aiAnalysis.personality} />
                <StatsGrid 
                  analysis={{
                    totalRepos: userData.public_repos,
                    totalStars: aiAnalysis.totalStars || 0,
                    totalForks: aiAnalysis.totalForks || 0,
                    daysSinceLastUpdate: aiAnalysis.activityStatus?.daysSinceUpdate || 0,
                    languages: aiAnalysis.languages || {},
                  }} 
                  isRecruiterMode={isRecruiterMode} 
                />
              </div>
            </div>
          </AnimatedSection>
        );

      case 'tech':
        return (
          <AnimatedSection key="tech">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <TechStackAnalysis
                  languages={aiAnalysis.languages || {}}
                  totalRepos={userData.public_repos}
                  repoTopics={aiAnalysis.topTopics}
                />
                <LanguageChart languages={aiAnalysis.languages || {}} />
              </div>

              {aiAnalysis.techAnalysis && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="score-card"
                >
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                    <Shield className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Technical Assessment</h3>
                    <span className="ml-auto text-xs px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 font-medium">
                      {aiAnalysis.techAnalysis.seniorityEstimate}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Primary Domain</p>
                      <p className="text-xl font-bold text-foreground">{aiAnalysis.techAnalysis.primaryDomain}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Open Source: <span className="text-foreground font-medium">{aiAnalysis.techAnalysis.openSourceEngagement}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Strengths</p>
                      <div className="space-y-1.5">
                        {(aiAnalysis.techAnalysis.strengthAreas || []).map((s: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-terminal-green" />
                            <span className="text-foreground">{s}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Growth Areas</p>
                      <div className="space-y-1.5">
                        {(aiAnalysis.techAnalysis.growthAreas || []).map((g: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-terminal-yellow" />
                            <span className="text-foreground">{g}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-border/50">
                    <div className="text-center p-3 bg-muted/30 rounded-xl">
                      <p className="text-xs text-muted-foreground mb-1">Project Complexity</p>
                      <p className="stat-value">{aiAnalysis.techAnalysis.projectComplexityScore || 0}</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-xl">
                      <p className="text-xs text-muted-foreground mb-1">Commit Quality</p>
                      <p className="stat-value">{aiAnalysis.techAnalysis.commitQualityScore || 0}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </AnimatedSection>
        );

      case 'activity':
        return (
          <AnimatedSection key="activity">
            <div className="space-y-6">
              <ActivityHeatmap 
                activityData={{
                  recentCommits: aiAnalysis.scores?.activity?.score || 50,
                  events: userEvents,
                }}
              />
              {userEvents.length > 0 && (
                <ContributionTimeline events={userEvents} />
              )}
            </div>
          </AnimatedSection>
        );

      case 'repos':
        return (
          <AnimatedSection key="repos">
            {aiAnalysis.topRepositories && aiAnalysis.topRepositories.length > 0 && (
              <RepoDeepDive repositories={aiAnalysis.topRepositories} username={userData.login} />
            )}
          </AnimatedSection>
        );

      case 'roast':
        return (
          <AnimatedSection key="roast">
            <RoastTerminal roasts={aiAnalysis.roastLines || []} username={userData.login} />
          </AnimatedSection>
        );

      case 'assessment':
        return (
          <AnimatedSection key="assessment">
            <div className="space-y-6">
              {aiAnalysis.recruiterMetric && (
                <RecruiterMetric metric={aiAnalysis.recruiterMetric} />
              )}
              <RecruiterTerminal insights={aiAnalysis.roastLines || []} username={userData.login} scores={aiAnalysis.scores} />
            </div>
          </AnimatedSection>
        );

      case 'personality':
        return (
          <AnimatedSection key="personality">
            {aiAnalysis.personality && (
              <PersonalityProfile profile={aiAnalysis.personality} />
            )}
          </AnimatedSection>
        );

      case 'career':
        return (
          <AnimatedSection key="career">
            <div className="space-y-6">
              {aiAnalysis.careerInsights && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="score-card"
                >
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                    <Users className="w-5 h-5 text-secondary" />
                    <h3 className="font-semibold text-foreground">Career Insights</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Ideal Roles</p>
                        <div className="flex flex-wrap gap-2">
                          {(aiAnalysis.careerInsights.idealRoles || []).map((role: string, i: number) => (
                            <span key={i} className="text-xs px-3 py-1.5 rounded-xl bg-secondary/10 text-secondary border border-secondary/20 font-medium">{role}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Team Fit</p>
                        <p className="text-sm text-foreground">{aiAnalysis.careerInsights.teamFit}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Work Style</p>
                        <p className="text-sm text-foreground">{aiAnalysis.careerInsights.workStyle}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Growth Trajectory</p>
                        <p className="text-lg font-bold text-gradient">{aiAnalysis.careerInsights.growthTrajectory}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              {aiAnalysis.personality && (
                <PersonalityProfile profile={aiAnalysis.personality} />
              )}
            </div>
          </AnimatedSection>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <AnimatedBackground />
      <ThemeToggle />
      
      <div className="container mx-auto px-4 py-12 max-w-5xl relative z-10">
        <Header isRecruiterMode={isRecruiterMode} />
        <ModeToggle isRecruiterMode={isRecruiterMode} onToggle={handleModeToggle} />
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        <SearchHistory history={history} onSelect={handleSearch} onRemove={removeFromHistory} onClear={clearHistory} />

        <div className="mt-12">
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div key="loading" exit={{ opacity: 0, scale: 0.95 }}>
                <LoadingState />
              </motion.div>
            )}
          </AnimatePresence>
          
          {error && !isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <ErrorDisplay error={error} onRetry={() => handleSearch(searchedUsername)} />
            </motion.div>
          )}
          
          {userData && aiAnalysis && !isLoading && !error && (
            <motion.div
              ref={resultsRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Action buttons */}
              <div className="flex justify-end gap-2 flex-wrap mb-6">
                <CompareProfiles currentUsername={userData.login} currentAnalysis={aiAnalysis} currentUserData={userData} />
                <SocialShareCard
                  username={userData.login}
                  avatarUrl={userData.avatar_url}
                  score={aiAnalysis.scores?.overall?.score || 0}
                  archetype={aiAnalysis.archetype}
                  topLanguages={topLanguages}
                  totalStars={aiAnalysis.totalStars || 0}
                  totalRepos={userData.public_repos}
                  followers={userData.followers}
                  isRecruiterMode={isRecruiterMode}
                  personality={aiAnalysis.personality}
                />
                <ShareExport 
                  username={userData.login}
                  score={aiAnalysis.scores?.overall?.score || 0}
                  isRecruiterMode={isRecruiterMode}
                  containerRef={resultsRef}
                />
              </div>

              <ResultsTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isRecruiterMode={isRecruiterMode}
              />

              <AnimatePresence mode="wait">
                {renderTabContent()}
              </AnimatePresence>
            </motion.div>
          )}
          
          {!userData && !isLoading && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="terminal-box text-center py-20"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="text-6xl mb-6"
              >
                {isRecruiterMode ? '💼' : '🔥'}
              </motion.div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                {isRecruiterMode ? 'Ready to Analyze' : 'Ready to Roast'}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                {isRecruiterMode 
                  ? 'Enter a GitHub username to generate a comprehensive AI-powered professional assessment with career insights, tech stack analysis, and more.'
                  : 'Enter a GitHub username to get an AI-generated roast with skill radar, coding streaks, repo deep dives, and shareable cards.'
                }
              </p>
              <div className="flex items-center justify-center gap-3 mt-8 text-sm text-muted-foreground">
                <span>Try:</span>
                {['torvalds', 'gaearon', 'tj'].map((name) => (
                  <button
                    key={name}
                    onClick={() => handleSearch(name)}
                    className="px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-mono text-xs transition-colors hover:text-primary"
                  >
                    @{name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
        
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 text-center text-xs text-muted-foreground"
        >
          <p>Made with {isRecruiterMode ? '💼' : '🔥'} and AI magic</p>
          <p className="mt-1">Powered by GitHub API + AI Models</p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
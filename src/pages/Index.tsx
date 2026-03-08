import { useState, useRef, useEffect } from 'react';
import { Activity, FileText, Star, Code2, Shield, Users, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
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
import { ScrollReveal, ScrollStagger, ScrollStaggerItem } from '@/components/ScrollReveal';
import { DeveloperDNA } from '@/components/DeveloperDNA';
import { ScoreSummaryPanel } from '@/components/ScoreSummaryPanel';
import { GitHubWrapped } from '@/components/GitHubWrapped';
import { RoastBattle } from '@/components/RoastBattle';
import { ThemePicker, applyTheme, getStoredTheme } from '@/components/ThemePicker';
import { CodeRhythm } from '@/components/CodeRhythm';
import { XPLevelSystem } from '@/components/XPLevelSystem';
import { TimeMachine } from '@/components/TimeMachine';
import { DeveloperGlobe } from '@/components/DeveloperGlobe';
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
  const [userRepos, setUserRepos] = useState<any[]>([]);
  const [userGists, setUserGists] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showWrapped, setShowWrapped] = useState(false);

  useEffect(() => {
    applyTheme(getStoredTheme());
  }, []);

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
      setUserRepos(repos);
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
              <ScrollReveal variant="fadeUp">
                <ProfileCard
                  user={userData}
                  orgCount={aiAnalysis.orgCount || 0}
                  gistCount={aiAnalysis.publicGists || 0}
                />
              </ScrollReveal>

              <ScrollReveal variant="scaleUp" delay={0.1}>
                <AchievementBadges
                  userData={userData}
                  analysis={{
                    totalStars: aiAnalysis.totalStars || 0,
                    totalForks: aiAnalysis.totalForks || 0,
                    languages: aiAnalysis.languages || {},
                    scores: aiAnalysis.scores,
                  }}
                />
              </ScrollReveal>

              <ScrollReveal variant="fadeUp" delay={0.2}>
                <ActivityBadge
                  status={aiAnalysis.activityStatus?.label || 'Unknown'}
                  finalScore={aiAnalysis.scores?.overall?.score || 0}
                  archetype={aiAnalysis.archetype}
                  isRecruiterMode={isRecruiterMode}
                />
              </ScrollReveal>

              <ScrollReveal variant="fadeUp" delay={0.3}>
                <CodingStreaks
                  currentStreak={aiAnalysis.currentStreak || 0}
                  longestStreak={aiAnalysis.longestStreak || 0}
                  totalActiveDays={aiAnalysis.activeDays || 0}
                  peakCodingHour={aiAnalysis.peakCodingHour}
                  totalEvents={aiAnalysis.totalEvents}
                  weekendRatio={aiAnalysis.weekendRatio}
                  eventsPerActiveDay={aiAnalysis.eventsPerActiveDay}
                  peakCodingDay={aiAnalysis.peakCodingDay}
                />
              </ScrollReveal>

              {isRecruiterMode && aiAnalysis.recruiterMetric && (
                <ScrollReveal variant="fadeLeft" delay={0.4}>
                  <RecruiterMetric metric={aiAnalysis.recruiterMetric} />
                </ScrollReveal>
              )}
            </div>
          </AnimatedSection>
        );

      case 'scores':
        return (
          <AnimatedSection key="scores">
            <div className="space-y-6">
              <ScrollStagger className="grid grid-cols-2 md:grid-cols-3 gap-4" staggerDelay={0.1}>
                <ScrollStaggerItem variant="scaleUp">
                  <ScoreCard title="Activity" score={aiAnalysis.scores?.activity?.score || 0} icon={<Activity className="w-4 h-4" />} explanation={aiAnalysis.scores?.activity?.explanation} subMetrics={aiAnalysis.scores?.activity?.subMetrics} delay={0} />
                </ScrollStaggerItem>
                <ScrollStaggerItem variant="scaleUp">
                  <ScoreCard title="Documentation" score={aiAnalysis.scores?.documentation?.score || 0} icon={<FileText className="w-4 h-4" />} explanation={aiAnalysis.scores?.documentation?.explanation} subMetrics={aiAnalysis.scores?.documentation?.subMetrics} delay={100} />
                </ScrollStaggerItem>
                <ScrollStaggerItem variant="scaleUp">
                  <ScoreCard title="Popularity" score={aiAnalysis.scores?.popularity?.score || 0} icon={<Star className="w-4 h-4" />} explanation={aiAnalysis.scores?.popularity?.explanation} subMetrics={aiAnalysis.scores?.popularity?.subMetrics} delay={200} />
                </ScrollStaggerItem>
                <ScrollStaggerItem variant="scaleUp">
                  <ScoreCard title="Diversity" score={aiAnalysis.scores?.diversity?.score || 0} icon={<Code2 className="w-4 h-4" />} explanation={aiAnalysis.scores?.diversity?.explanation} subMetrics={aiAnalysis.scores?.diversity?.subMetrics} delay={300} />
                </ScrollStaggerItem>
                <ScrollStaggerItem variant="scaleUp">
                  <ScoreCard title="Code Quality" score={aiAnalysis.scores?.codeQuality?.score || 0} icon={<Shield className="w-4 h-4" />} explanation={aiAnalysis.scores?.codeQuality?.explanation} subMetrics={aiAnalysis.scores?.codeQuality?.subMetrics} delay={400} />
                </ScrollStaggerItem>
                <ScrollStaggerItem variant="scaleUp">
                  <ScoreCard title="Collaboration" score={aiAnalysis.scores?.collaboration?.score || 0} icon={<Users className="w-4 h-4" />} explanation={aiAnalysis.scores?.collaboration?.explanation} subMetrics={aiAnalysis.scores?.collaboration?.subMetrics} delay={500} />
                </ScrollStaggerItem>
              </ScrollStagger>

              <div className="grid md:grid-cols-2 gap-6">
                <ScrollReveal variant="fadeLeft" delay={0.2}>
                  <RadarChart scores={aiAnalysis.scores} personality={aiAnalysis.personality} />
                </ScrollReveal>
                <ScrollReveal variant="fadeRight" delay={0.3}>
                  <StatsGrid
                    analysis={{
                      totalRepos: userData.public_repos,
                      totalStars: aiAnalysis.totalStars || 0,
                      totalForks: aiAnalysis.totalForks || 0,
                      daysSinceLastUpdate: aiAnalysis.activityStatus?.daysSinceUpdate || 0,
                      languages: aiAnalysis.languages || {},
                      reposWithDescription: aiAnalysis.reposWithDescription || 0,
                      originalRepos: aiAnalysis.originalRepos || 0,
                      forkedRepos: aiAnalysis.forkedRepos || 0,
                      avgStarsPerRepo: aiAnalysis.avgStarsPerRepo,
                      forkToStarRatio: aiAnalysis.forkToStarRatio,
                      totalRepoSizeMB: aiAnalysis.totalRepoSizeMB,
                      totalOpenIssues: aiAnalysis.totalOpenIssues,
                    }}
                    isRecruiterMode={isRecruiterMode}
                  />
                </ScrollReveal>
              </div>
            </div>
          </AnimatedSection>
        );

      case 'dna':
        return (
          <AnimatedSection key="dna">
            <ScrollReveal variant="blur">
              <DeveloperDNA
                languages={aiAnalysis.languages || {}}
                scores={aiAnalysis.scores || {}}
                personality={aiAnalysis.personality}
                streaks={{
                  currentStreak: aiAnalysis.currentStreak || 0,
                  longestStreak: aiAnalysis.longestStreak || 0,
                  peakHour: aiAnalysis.peakCodingHour,
                }}
                userData={{
                  followers: userData.followers,
                  public_repos: userData.public_repos,
                  created_at: userData.created_at,
                }}
              />
            </ScrollReveal>
          </AnimatedSection>
        );

      case 'tech':
        return (
          <AnimatedSection key="tech">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <ScrollReveal variant="fadeLeft">
                  <TechStackAnalysis
                    languages={aiAnalysis.languages || {}}
                    totalRepos={userData.public_repos}
                    repoTopics={aiAnalysis.topTopics}
                    reposWithLicense={aiAnalysis.reposWithLicense}
                    reposWithDescription={aiAnalysis.reposWithDescription}
                    conventionalCommitRatio={aiAnalysis.conventionalCommitRatio}
                    sizeDistribution={aiAnalysis.sizeDistribution}
                  />
                </ScrollReveal>
                <ScrollReveal variant="fadeRight" delay={0.1}>
                  <LanguageChart languages={aiAnalysis.languages || {}} />
                </ScrollReveal>
              </div>

              {aiAnalysis.techAnalysis && (
                <ScrollReveal variant="fadeUp" delay={0.2}>
                  <div className="score-card">
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
                        {aiAnalysis.techAnalysis.architectureStyle && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Style: <span className="text-foreground font-medium">{aiAnalysis.techAnalysis.architectureStyle}</span>
                          </p>
                        )}
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
                    {aiAnalysis.techAnalysis.techTrend && (
                      <div className="mt-4 pt-3 border-t border-border/50">
                        <p className="text-xs text-muted-foreground mb-1">Tech Evolution</p>
                        <p className="text-sm text-foreground">{aiAnalysis.techAnalysis.techTrend}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/50">
                      <div className="text-center p-3 bg-muted/30 rounded-xl">
                        <p className="text-xs text-muted-foreground mb-1">Project Complexity</p>
                        <p className="stat-value">{aiAnalysis.techAnalysis.projectComplexityScore || 0}</p>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-xl">
                        <p className="text-xs text-muted-foreground mb-1">Commit Quality</p>
                        <p className="stat-value">{aiAnalysis.techAnalysis.commitQualityScore || 0}</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              )}
            </div>
          </AnimatedSection>
        );

      case 'activity':
        return (
          <AnimatedSection key="activity">
            <div className="space-y-6">
              <ScrollReveal variant="fadeUp">
                <ActivityHeatmap
                  activityData={{
                    recentCommits: aiAnalysis.scores?.activity?.score || 50,
                    events: userEvents,
                  }}
                />
              </ScrollReveal>
              {userEvents.length > 0 && (
                <ScrollReveal variant="fadeUp" delay={0.2}>
                  <ContributionTimeline events={userEvents} />
                </ScrollReveal>
              )}
            </div>
          </AnimatedSection>
        );

      case 'repos':
        return (
          <AnimatedSection key="repos">
            <ScrollReveal variant="fadeUp">
              {aiAnalysis.topRepositories && aiAnalysis.topRepositories.length > 0 && (
                <RepoDeepDive repositories={aiAnalysis.topRepositories} username={userData.login} />
              )}
            </ScrollReveal>
          </AnimatedSection>
        );

      case 'roast':
        return (
          <AnimatedSection key="roast">
            <ScrollReveal variant="blur">
              <RoastTerminal roasts={aiAnalysis.roastLines || []} username={userData.login} />
            </ScrollReveal>
          </AnimatedSection>
        );

      case 'assessment':
        return (
          <AnimatedSection key="assessment">
            <div className="space-y-6">
              {aiAnalysis.recruiterMetric && (
                <ScrollReveal variant="fadeUp">
                  <RecruiterMetric metric={aiAnalysis.recruiterMetric} />
                </ScrollReveal>
              )}
              <ScrollReveal variant="fadeUp" delay={0.2}>
                <RecruiterTerminal insights={aiAnalysis.roastLines || []} username={userData.login} scores={aiAnalysis.scores} />
              </ScrollReveal>
            </div>
          </AnimatedSection>
        );

      case 'personality':
        return (
          <AnimatedSection key="personality">
            <ScrollReveal variant="blur">
              {aiAnalysis.personality && (
                <PersonalityProfile profile={aiAnalysis.personality} />
              )}
            </ScrollReveal>
          </AnimatedSection>
        );

      case 'career':
        return (
          <AnimatedSection key="career">
            <div className="space-y-6">
              {aiAnalysis.careerInsights && (
                <ScrollReveal variant="fadeUp">
                  <div className="score-card">
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
                              <motion.span
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="text-xs px-3 py-1.5 rounded-xl bg-secondary/10 text-secondary border border-secondary/20 font-medium"
                              >
                                {role}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Team Fit</p>
                          <p className="text-sm text-foreground">{aiAnalysis.careerInsights.teamFit}</p>
                        </div>
                        {aiAnalysis.careerInsights.salaryTier && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Salary Tier</p>
                            <p className="text-sm font-bold text-primary">{aiAnalysis.careerInsights.salaryTier}</p>
                          </div>
                        )}
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
                        {aiAnalysis.careerInsights.industryFit && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">Industry Fit</p>
                            <div className="flex flex-wrap gap-1.5">
                              {aiAnalysis.careerInsights.industryFit.map((ind: string, i: number) => (
                                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                                  {ind}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Health metrics */}
                    {aiAnalysis.healthMetrics && (
                      <div className="mt-6 pt-4 border-t border-border/50">
                        <p className="text-xs text-muted-foreground mb-3">Developer Health</p>
                        <div className="grid grid-cols-4 gap-3">
                          {[
                            { label: 'Work-Life Balance', value: aiAnalysis.healthMetrics.workLifeBalance, color: 'text-terminal-green' },
                            { label: 'Weekend Coding', value: `${aiAnalysis.healthMetrics.weekendCodingPercent}%`, isText: true, color: 'text-terminal-yellow' },
                            { label: 'Sustainability', value: aiAnalysis.healthMetrics.sustainabilityScore, color: 'text-terminal-cyan' },
                            { label: 'Diversification', value: aiAnalysis.healthMetrics.diversificationIndex, color: 'text-terminal-purple' },
                          ].map((item, i) => (
                            <div key={item.label} className="text-center p-2 bg-muted/30 rounded-lg">
                              <p className={`text-lg font-bold font-mono ${item.color}`}>
                                {(item as any).isText ? item.value : item.value}
                              </p>
                              <p className="text-[9px] text-muted-foreground">{item.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              )}
              {aiAnalysis.personality && (
                <ScrollReveal variant="fadeUp" delay={0.2}>
                  <PersonalityProfile profile={aiAnalysis.personality} />
                </ScrollReveal>
              )}
            </div>
          </AnimatedSection>
        );

      case 'rhythm':
        return (
          <AnimatedSection key="rhythm">
            <ScrollReveal variant="fadeUp">
              <CodeRhythm
                events={userEvents}
                peakHour={aiAnalysis.peakCodingHour}
                eventTypeBreakdown={aiAnalysis.eventTypeBreakdown}
              />
            </ScrollReveal>
          </AnimatedSection>
        );

      case 'xp':
        return (
          <AnimatedSection key="xp">
            <ScrollReveal variant="scaleUp">
              <XPLevelSystem
                scores={aiAnalysis.scores || {}}
                totalStars={aiAnalysis.totalStars || 0}
                totalRepos={userData.public_repos}
                followers={userData.followers}
                currentStreak={aiAnalysis.currentStreak || 0}
                languages={aiAnalysis.languages || {}}
                totalForks={aiAnalysis.totalForks || 0}
                orgCount={aiAnalysis.orgCount || 0}
                publicGists={aiAnalysis.publicGists || 0}
              />
            </ScrollReveal>
          </AnimatedSection>
        );

      case 'timeline':
        return (
          <AnimatedSection key="timeline">
            <ScrollReveal variant="fadeUp">
              <TimeMachine
                repos={userRepos}
                userData={userData}
                languages={aiAnalysis.languages || {}}
                totalStars={aiAnalysis.totalStars || 0}
                languagesByYear={aiAnalysis.languagesByYear}
              />
            </ScrollReveal>
          </AnimatedSection>
        );

      case 'globe':
        return (
          <AnimatedSection key="globe">
            <ScrollReveal variant="blur">
              <DeveloperGlobe
                userData={userData}
                languages={aiAnalysis.languages || {}}
                totalStars={aiAnalysis.totalStars || 0}
                followers={userData.followers}
              />
            </ScrollReveal>
          </AnimatedSection>
        );

      default:
        return null;
    }
  };

  return (
    <>
    <AnimatePresence>
      {showWrapped && userData && aiAnalysis && (
        <GitHubWrapped
          username={userData.login}
          userData={userData}
          aiAnalysis={aiAnalysis}
          onClose={() => setShowWrapped(false)}
        />
      )}
    </AnimatePresence>
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
              <motion.div key="loading" exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}>
                <LoadingState />
              </motion.div>
            )}
          </AnimatePresence>

          {error && !isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
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
              <ScrollReveal variant="fadeDown" delay={0.1}>
                <div className="flex justify-end gap-2 flex-wrap mb-6">
                  <ThemePicker score={aiAnalysis.scores?.overall?.score || 0} />
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowWrapped(true)}>
                    <Sparkles className="w-4 h-4" /> Wrapped
                  </Button>
                  <RoastBattle currentUsername={userData.login} currentAnalysis={aiAnalysis} currentUserData={userData} />
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
              </ScrollReveal>

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
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="terminal-box text-center py-20"
            >
              <motion.div
                animate={{
                  y: [0, -12, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
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
                {['torvalds', 'gaearon', 'tj'].map((name, i) => (
                  <motion.button
                    key={name}
                    onClick={() => handleSearch(name)}
                    className="px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-mono text-xs transition-colors hover:text-primary border border-transparent hover:border-primary/30"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    @{name}
                  </motion.button>
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
    </>
  );
};

export default Index;

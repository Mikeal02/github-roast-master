import { Skeleton } from '@/components/ui/skeleton';

export function ProfileCardSkeleton() {
  return (
    <div className="score-card flex flex-col md:flex-row gap-6 items-center md:items-start animate-pulse">
      <div className="relative">
        <Skeleton className="w-32 h-32 rounded-full" />
        <Skeleton className="absolute -bottom-2 -right-2 h-6 w-16 rounded-full" />
      </div>
      <div className="flex-1 space-y-3 text-center md:text-left">
        <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
        <Skeleton className="h-4 w-24 mx-auto md:mx-0" />
        <Skeleton className="h-16 w-full max-w-md mx-auto md:mx-0" />
        <div className="flex gap-4 justify-center md:justify-start">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

export function ScoreCardSkeleton() {
  return (
    <div className="score-card animate-pulse">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-8 w-12" />
      </div>
      <Skeleton className="h-3 w-16 mb-2" />
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
  );
}

export function TerminalSkeleton() {
  return (
    <div className="terminal-box animate-pulse">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-primary/20">
        <div className="flex gap-1.5">
          <Skeleton className="w-3 h-3 rounded-full" />
          <Skeleton className="w-3 h-3 rounded-full" />
          <Skeleton className="w-3 h-3 rounded-full" />
        </div>
        <Skeleton className="h-4 w-32 ml-4" />
      </div>
      <div className="space-y-3 min-h-[200px]">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="score-card animate-pulse">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <Skeleton className="w-5 h-5 rounded" />
        <Skeleton className="h-5 w-32" />
      </div>
      <div className="h-[200px] flex items-end justify-center gap-2">
        {[...Array(6)].map((_, i) => (
          <Skeleton 
            key={i} 
            className="w-12 rounded-t" 
            style={{ height: `${Math.random() * 60 + 40}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function ResultsSkeletonLoader() {
  return (
    <div className="space-y-6">
      <ProfileCardSkeleton />
      
      <div className="score-card animate-pulse p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ScoreCardSkeleton />
        <ScoreCardSkeleton />
        <ScoreCardSkeleton />
        <ScoreCardSkeleton />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      
      <TerminalSkeleton />
    </div>
  );
}

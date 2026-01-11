// Compete Mode - Challenge cards for testing mastery with virtualization

import { useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trophy, ChevronRight, Star, Zap, Award, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { VirtualizedList } from "./VirtualizedList";
import { useToast } from "@/hooks/use-toast";
import type { ChallengeItem } from "@/data/student/lessonBundles";

interface CompeteModeProps {
  challenges: ChallengeItem[];
}

const difficultyConfig = {
  easy: {
    label: "EASY",
    color: "text-green-600",
    bgColor: "bg-green-100",
    borderColor: "border-l-green-400",
    icon: Star,
  },
  medium: {
    label: "MEDIUM",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    borderColor: "border-l-amber-400",
    icon: Zap,
  },
  hard: {
    label: "HARD",
    color: "text-red-600",
    bgColor: "bg-red-100",
    borderColor: "border-l-red-400",
    icon: Award,
  },
};

export function CompeteMode({ challenges }: CompeteModeProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { subjectId, chapterId } = useParams<{ subjectId: string; chapterId: string }>();

  // Memoize filtered and sorted lists
  const { pendingChallenges, completedChallenges, sortedPending, totalPoints, earnedPoints } = useMemo(() => {
    const pending = challenges.filter(c => !c.isCompleted);
    const completed = challenges.filter(c => c.isCompleted);
    
    // Sort by difficulty: easy > medium > hard
    const sorted = [...pending].sort((a, b) => {
      const order = { easy: 0, medium: 1, hard: 2 };
      return order[a.difficulty] - order[b.difficulty];
    });
    
    const total = challenges.reduce((sum, c) => sum + c.points, 0);
    const earned = completed.reduce((sum, c) => sum + (c.userScore || 0), 0);
    
    return { 
      pendingChallenges: pending, 
      completedChallenges: completed, 
      sortedPending: sorted,
      totalPoints: total,
      earnedPoints: earned
    };
  }, [challenges]);

  // Memoize handlers
  const handleChallengeClick = useCallback((challenge: ChallengeItem) => {
    toast({
      title: "Starting Challenge",
      description: `Loading: ${challenge.title}`,
      duration: 2000,
    });
    
    // Navigate to test player with a mock challenge test ID
    // In a full implementation, challenges would have linked test IDs in the database
    navigate(`/student/tests/challenge-${challenge.id}`);
  }, [navigate, toast]);

  // Render functions
  const renderPendingChallenge = useCallback((challenge: ChallengeItem) => {
    const config = difficultyConfig[challenge.difficulty];
    const DifficultyIcon = config.icon;

    return (
      <button
        onClick={() => handleChallengeClick(challenge)}
        className={cn(
          "w-full text-left group",
          "bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50",
          "p-4 shadow-sm hover:shadow-md transition-all duration-300",
          "active:scale-[0.98]",
          "border-l-4",
          config.borderColor
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={cn(
                "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-bold",
                config.bgColor,
                config.color
              )}>
                <DifficultyIcon className="w-3 h-3" />
                {config.label}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-medium">
                <Trophy className="w-3 h-3" />
                {challenge.points} pts
              </span>
            </div>

            <h3 className="font-semibold text-foreground leading-snug">
              {challenge.title}
            </h3>
            
            <p className="text-xs text-muted-foreground mt-1">
              Top 10% score: {challenge.topPercentileScore}+
            </p>
          </div>

          <ChevronRight className="w-5 h-5 text-muted-foreground/40 group-hover:text-foreground/70 transition-colors flex-shrink-0" />
        </div>
      </button>
    );
  }, [handleChallengeClick]);

  const renderCompletedChallenge = useCallback((challenge: ChallengeItem) => {
    const config = difficultyConfig[challenge.difficulty];
    const isTopScore = (challenge.userScore || 0) >= challenge.topPercentileScore;

    return (
      <div className={cn(
        "bg-white/50 backdrop-blur-xl rounded-xl border border-white/50",
        "p-3"
      )}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            <div>
              <span className="font-medium text-foreground">
                {challenge.title}
              </span>
              <span className={cn(
                "ml-2 text-xs px-1.5 py-0.5 rounded",
                config.bgColor,
                config.color
              )}>
                {config.label}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {isTopScore && (
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            )}
            <span className={cn(
              "font-bold",
              isTopScore ? "text-amber-600" : "text-foreground"
            )}>
              {challenge.userScore}
            </span>
            <span className="text-xs text-muted-foreground">
              /{challenge.points}
            </span>
          </div>
        </div>
      </div>
    );
  }, []);

  const getChallengeKey = useCallback((challenge: ChallengeItem) => challenge.id, []);

  return (
    <div className="space-y-6">
      {/* Stats header */}
      <div className={cn(
        "bg-gradient-to-r from-amber-500/15 to-amber-400/5",
        "rounded-2xl border border-amber-500/20 p-4"
      )}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">Challenge Arena</h3>
            <p className="text-sm text-muted-foreground">
              {earnedPoints}/{totalPoints} points earned
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-amber-600">{completedChallenges.length}</p>
            <p className="text-xs text-muted-foreground">completed</p>
          </div>
        </div>
      </div>

      {/* Available challenges */}
      {sortedPending.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3 px-1">
            AVAILABLE CHALLENGES
          </h2>
          <VirtualizedList
            items={sortedPending}
            renderItem={renderPendingChallenge}
            getItemKey={getChallengeKey}
            estimatedItemHeight={100}
          />
        </section>
      )}

      {/* Completed challenges */}
      {completedChallenges.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
            COMPLETED
          </h2>
          <VirtualizedList
            items={completedChallenges}
            renderItem={renderCompletedChallenge}
            getItemKey={getChallengeKey}
            estimatedItemHeight={60}
            gap={8}
          />
        </section>
      )}

      {/* Empty state */}
      {challenges.length === 0 && (
        <div className={cn(
          "bg-white/50 backdrop-blur-xl rounded-2xl border border-white/50",
          "p-8 text-center"
        )}>
          <Trophy className="w-12 h-12 text-amber-500/40 mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-1">No challenges yet</h3>
          <p className="text-sm text-muted-foreground">
            Complete some lessons first to unlock competitive challenges!
          </p>
        </div>
      )}
    </div>
  );
}

export default CompeteMode;

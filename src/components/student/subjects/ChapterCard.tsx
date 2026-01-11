// Chapter Card - Interactive card for each chapter in a subject

import { useNavigate } from "react-router-dom";
import { ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StudentChapter } from "@/data/student/chapters";
import LearningStateBadge from "./LearningStateBadge";

// Color configurations for progress bars based on state
const progressColors: Record<string, string> = {
  "not-started": "from-slate-300 to-slate-400",
  "in-progress": "from-blue-400 to-blue-600",
  "struggling": "from-amber-400 to-orange-500",
  "on-track": "from-emerald-400 to-green-500",
  "completed": "from-green-400 to-green-600",
  "mastered": "from-amber-400 to-yellow-500",
};

interface ChapterCardProps {
  chapter: StudentChapter;
  subjectColor?: string;
}

const ChapterCard = ({ chapter, subjectColor = "blue" }: ChapterCardProps) => {
  const navigate = useNavigate();
  const progressColor = progressColors[chapter.state] || progressColors["in-progress"];

  const handleClick = () => {
    navigate(`/student/subjects/${chapter.subjectId}/${chapter.id}`);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full text-left group",
        "bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50",
        "p-4 shadow-sm hover:shadow-md transition-all duration-300",
        "active:scale-[0.98]",
        // Subtle left border accent for active chapters
        chapter.state !== "not-started" && "border-l-4",
        chapter.state === "in-progress" && "border-l-blue-400",
        chapter.state === "struggling" && "border-l-amber-400",
        chapter.state === "on-track" && "border-l-emerald-400",
        chapter.state === "completed" && "border-l-green-400",
        chapter.state === "mastered" && "border-l-amber-400",
      )}
    >
      {/* Main content row */}
      <div className="flex items-start justify-between gap-3">
        {/* Left: Chapter number + Name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1">
            {/* Chapter number pill */}
            <span className={cn(
              "flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold",
              chapter.state === "not-started" 
                ? "bg-slate-100 text-slate-500" 
                : "bg-gradient-to-br from-slate-700 to-slate-900 text-white"
            )}>
              {chapter.order}
            </span>
            
            {/* Chapter name */}
            <h3 className="font-semibold text-foreground truncate">
              {chapter.name}
            </h3>
          </div>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full bg-gradient-to-r transition-all duration-500",
                  progressColor
                )}
                style={{ width: `${chapter.progress}%` }}
              />
            </div>
            
            {/* Bottom row: Progress % and topics */}
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">
                {chapter.topicsCompleted}/{chapter.topicsTotal} topics
              </span>
              <span className={cn(
                "text-xs font-semibold",
                chapter.progress === 0 ? "text-slate-400" : "text-foreground"
              )}>
                {chapter.progress}%
              </span>
            </div>
          </div>
        </div>

        {/* Right: Badge + Arrow */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <LearningStateBadge state={chapter.state} />
          <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-foreground/70 transition-colors" />
        </div>
      </div>

      {/* AI Path indicator */}
      {chapter.hasAIPath && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-donut-coral/10 to-donut-orange/10">
            <Sparkles className="w-3 h-3 text-donut-coral" />
            <span className="font-medium bg-gradient-to-r from-donut-coral to-donut-orange bg-clip-text text-transparent">
              AI Path Available
            </span>
          </div>
        </div>
      )}
    </button>
  );
};

export default ChapterCard;

// Chapter Card - Interactive card for each chapter in a subject

import { useNavigate } from "react-router-dom";
import { ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StudentChapter } from "@/data/student/chapters";
import LearningStateBadge from "./LearningStateBadge";

interface ChapterCardProps {
  chapter: StudentChapter;
  subjectColor?: string;
}

const ChapterCard = ({ chapter }: ChapterCardProps) => {
  const navigate = useNavigate();

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
        {/* Left: Chapter number + Name + Topics */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3">
            {/* Chapter number pill */}
            <span className={cn(
              "flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold mt-0.5",
              chapter.state === "not-started" 
                ? "bg-slate-100 text-slate-500" 
                : "bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-sm"
            )}>
              {chapter.order}
            </span>
            
            <div className="flex-1 min-w-0">
              {/* Chapter name - allows wrapping */}
              <h3 className="font-semibold text-foreground leading-snug">
                {chapter.name}
              </h3>
              
              {/* Topics count */}
              <p className="text-sm text-muted-foreground mt-1">
                {chapter.topicsCompleted}/{chapter.topicsTotal} topics
              </p>
            </div>
          </div>
        </div>

        {/* Right: Badge + Arrow */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <LearningStateBadge state={chapter.state} />
          <ChevronRight className="w-5 h-5 text-muted-foreground/40 group-hover:text-foreground/70 transition-colors" />
        </div>
      </div>

      {/* AI Path indicator - Enhanced visibility */}
      {chapter.hasAIPath && (
        <div className="mt-3 ml-11">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-donut-coral/20 to-donut-orange/15 border border-donut-coral/25">
            <Sparkles className="w-3.5 h-3.5 text-donut-coral" />
            <span className="text-sm font-semibold text-donut-coral">
              AI Path Available
            </span>
          </div>
        </div>
      )}
    </button>
  );
};

export default ChapterCard;

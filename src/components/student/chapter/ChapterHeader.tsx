// Chapter Header - Displays chapter info with breadcrumb navigation

import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import LearningStateBadge from "@/components/student/subjects/LearningStateBadge";
import type { StudentChapter } from "@/data/student/chapters";
import type { StudentSubject } from "@/data/student/subjects";

interface ChapterHeaderProps {
  chapter: StudentChapter;
  subject: StudentSubject;
}

export function ChapterHeader({ chapter, subject }: ChapterHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      {/* Back button with breadcrumb */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/student/subjects/${subject.id}`)}
        className="text-muted-foreground hover:text-foreground -ml-2"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        <span className="text-sm">
          {subject.name}
        </span>
      </Button>

      {/* Chapter info card */}
      <div className={cn(
        "bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50",
        "p-4 shadow-sm"
      )}>
        <div className="flex items-start justify-between gap-3">
          {/* Left: Chapter number + Name */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Chapter number */}
            <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center text-lg font-bold shadow-sm">
              {chapter.order}
            </span>
            
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-lg text-foreground leading-snug">
                {chapter.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {chapter.topicsCompleted}/{chapter.topicsTotal} topics covered
              </p>
            </div>
          </div>

          {/* Right: Status badge */}
          <div className="flex-shrink-0">
            <LearningStateBadge state={chapter.state} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChapterHeader;

// Chapter Header - Displays chapter info with subject-specific branding

import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import LearningStateBadge from "@/components/student/subjects/LearningStateBadge";
import SubjectBackgroundPattern from "@/components/student/subjects/SubjectBackgroundPattern";
import { getSubjectColors, getSubjectIcon, getSubjectPattern } from "@/components/student/shared/subjectColors";
import type { StudentChapter } from "@/data/student/chapters";
import type { StudentSubject } from "@/data/student/subjects";

interface ChapterHeaderProps {
  chapter: StudentChapter;
  subject: StudentSubject;
}

export function ChapterHeader({ chapter, subject }: ChapterHeaderProps) {
  const navigate = useNavigate();
  const Icon = getSubjectIcon(subject.icon);
  const colors = getSubjectColors(subject.color);
  const pattern = getSubjectPattern(subject.id);

  return (
    <div className="space-y-2">
      {/* Back button with subject name */}
      <button
        onClick={() => navigate(`/student/subjects/${subject.id}`)}
        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors -ml-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs md:text-sm font-medium">{subject.name}</span>
      </button>

      {/* Chapter info card with subject branding */}
      <div 
        className={cn(
          "relative overflow-hidden rounded-xl md:rounded-2xl backdrop-blur-xl border border-white/50",
          "shadow-sm bg-gradient-to-br p-3 md:p-4",
          colors.gradient
        )}
      >
        {/* Background Pattern */}
        <SubjectBackgroundPattern 
          pattern={pattern} 
          className={colors.patternColor}
        />

        {/* Content */}
        <div className="relative z-10 flex items-start justify-between gap-2 md:gap-3">
          {/* Left: Chapter number + Name */}
          <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
            {/* Chapter number badge with subject gradient */}
            <span className={cn(
              "flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl",
              "bg-gradient-to-br text-white flex items-center justify-center",
              "text-sm md:text-lg font-bold shadow-sm",
              colors.numberBg
            )}>
              {chapter.order}
            </span>
            
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-sm md:text-lg text-foreground leading-snug">
                {chapter.name}
              </h1>
              <p className={cn("text-xs md:text-sm mt-0.5", colors.textAccent)}>
                {chapter.topicsCompleted}/{chapter.topicsTotal} topics
              </p>
            </div>
          </div>

          {/* Right: Status badge + Subject icon */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <LearningStateBadge state={chapter.state} compact />
            <div className={cn(
              "flex w-7 h-7 md:w-8 md:h-8 rounded-lg items-center justify-center",
              colors.iconBg
            )}>
              <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChapterHeader;

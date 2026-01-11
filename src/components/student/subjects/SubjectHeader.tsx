// Subject Header - Creative island design with subject-specific styling

import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StudentSubject } from "@/data/student/subjects";
import SubjectBackgroundPattern from "./SubjectBackgroundPattern";
import { getSubjectColors, getSubjectIcon, getSubjectPattern } from "@/components/student/shared/subjectColors";

interface SubjectHeaderProps {
  subject: StudentSubject;
}

const SubjectHeader = ({ subject }: SubjectHeaderProps) => {
  const navigate = useNavigate();
  const Icon = getSubjectIcon(subject.icon);
  const colors = getSubjectColors(subject.color);
  const pattern = getSubjectPattern(subject.id);

  return (
    <div className="relative">
      {/* Back button - outside the island */}
      <button
        onClick={() => navigate("/student/subjects")}
        className="flex items-center gap-2 mb-3 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back to Subjects</span>
      </button>

      {/* Subject Island */}
      <div 
        className={cn(
          "relative overflow-hidden rounded-3xl backdrop-blur-xl border border-white/50",
          "shadow-lg bg-gradient-to-br p-5 lg:p-6",
          colors.gradient
        )}
      >
        {/* Background Pattern */}
        <SubjectBackgroundPattern 
          pattern={pattern} 
          className={colors.patternColor}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Top row: Icon + Subject Name */}
          <div className="flex items-start gap-4">
            <div className={cn(
              "w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center shadow-lg",
              colors.iconBg
            )}>
              <Icon className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h1 className="text-xl lg:text-2xl font-bold text-foreground truncate">
                {subject.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {subject.chaptersCompleted} of {subject.chaptersTotal} chapters completed
              </p>
            </div>
          </div>

          {/* Stats section - Pills instead of progress bar */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {/* Chapters stat */}
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
              colors.progressBg
            )}>
              <span className={cn("text-sm font-semibold", colors.textAccent)}>
                {subject.chaptersCompleted}/{subject.chaptersTotal}
              </span>
              <span className="text-xs text-muted-foreground">chapters</span>
            </div>
            
            {/* Status badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-sm">
              <span className="text-sm font-medium text-foreground">
                {subject.status === "doing-well" ? "🔥 Doing Well" :
                 subject.status === "on-track" ? "✨ On Track" :
                 subject.status === "needs-attention" ? "⚡ Needs Focus" :
                 subject.status === "almost-done" ? "🎯 Almost Done" :
                 subject.status === "just-started" ? "🌱 Just Started" :
                 "📚 In Progress"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectHeader;

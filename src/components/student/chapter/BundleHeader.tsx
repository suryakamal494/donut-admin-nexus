// Bundle Header - Displays bundle info with subject branding

import { ArrowLeft, Calendar, User, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import SubjectBackgroundPattern from "@/components/student/subjects/SubjectBackgroundPattern";
import { getSubjectColors, getSubjectIcon } from "@/components/student/shared/subjectColors";
import type { LessonBundle, BundleContentItem } from "@/data/student/lessonBundles";
import type { StudentSubject } from "@/data/student/subjects";

interface BundleHeaderProps {
  bundle: LessonBundle;
  contentItems: BundleContentItem[];
  subject: StudentSubject;
  chapterName: string;
  onBack: () => void;
}

export function BundleHeader({ 
  bundle, 
  contentItems, 
  subject,
  chapterName,
  onBack 
}: BundleHeaderProps) {
  const completedCount = contentItems.filter(c => c.isCompleted).length;
  const totalCount = contentItems.length;
  const allCompleted = completedCount === totalCount && totalCount > 0;

  // Get subject-specific colors using shared utility
  const colors = getSubjectColors(subject.color);
  const IconComponent = getSubjectIcon(subject.icon);

  return (
    <div className="space-y-2 md:space-y-3">
      {/* Back button with breadcrumb */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="text-muted-foreground hover:text-foreground -ml-2"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        <span className="text-xs md:text-sm">
          {chapterName}
        </span>
      </Button>

      {/* Bundle info card with subject branding */}
      <div className={cn(
        "relative overflow-hidden rounded-xl md:rounded-2xl",
        "bg-gradient-to-br backdrop-blur-xl border shadow-sm",
        colors.gradient,
        colors.border,
        allCompleted && "ring-2 ring-green-400/50"
      )}>
        {/* Subject pattern background */}
        <SubjectBackgroundPattern 
          pattern={colors.pattern} 
          className="opacity-30"
        />

        {/* Content */}
        <div className="relative z-10 p-3 md:p-4">
          {/* Top: Date and teacher */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground">
              <div className="flex items-center gap-1 md:gap-1.5">
                <Calendar className={cn("w-3.5 h-3.5 md:w-4 md:h-4", colors.textAccent)} />
                <span className={cn("font-medium", colors.textAccent)}>
                  {format(parseISO(bundle.date), "MMM d, yyyy")}
                </span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="hidden sm:flex items-center gap-1 md:gap-1.5">
                <User className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span>{bundle.teacherName}</span>
              </div>
            </div>

            {/* Subject Icon */}
            <div className={cn(
              "w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center",
              "bg-white/60 backdrop-blur-sm border border-white/50 shadow-sm"
            )}>
              <IconComponent className={cn("w-4 h-4 md:w-5 md:h-5", colors.textAccent)} />
            </div>
          </div>

          {/* Teacher name on mobile (below date) */}
          <div className="flex sm:hidden items-center gap-1 text-xs text-muted-foreground mt-1">
            <User className="w-3 h-3" />
            <span>{bundle.teacherName}</span>
          </div>

          {/* Title */}
          <h1 className="font-bold text-base md:text-lg lg:text-xl text-foreground leading-snug mt-2">
            {bundle.title}
          </h1>

          {/* Progress indicator */}
          <div className="flex items-center gap-2 mt-3 md:mt-4 pt-2 md:pt-3 border-t border-black/5">
            {allCompleted ? (
              <div className="flex items-center gap-1.5 text-green-600">
                <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm font-medium">All content completed!</span>
              </div>
            ) : (
              <>
                <div className="flex-1 h-1 md:h-1.5 bg-black/5 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      "bg-gradient-to-r",
                      colors.progressBar
                    )}
                    style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {completedCount}/{totalCount} done
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BundleHeader;

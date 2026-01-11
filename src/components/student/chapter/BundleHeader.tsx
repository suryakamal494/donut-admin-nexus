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
    <div className="space-y-1.5 md:space-y-2">
      {/* Back button with breadcrumb - compact */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="text-muted-foreground hover:text-foreground -ml-2 h-8"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        <span className="text-xs">
          {chapterName}
        </span>
      </Button>

      {/* Bundle info card with subject branding - more compact on mobile */}
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

        {/* Content - reduced padding on mobile */}
        <div className="relative z-10 p-2.5 md:p-4">
          {/* Top: Date and teacher - single row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1">
                <Calendar className={cn("w-3 h-3 md:w-3.5 md:h-3.5", colors.textAccent)} />
                <span className={cn("font-medium", colors.textAccent)}>
                  {format(parseISO(bundle.date), "MMM d")}
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <User className="w-3 h-3 md:w-3.5 md:h-3.5" />
                <span className="truncate max-w-[120px]">{bundle.teacherName}</span>
              </div>
            </div>

            {/* Subject Icon - smaller on mobile */}
            <div className={cn(
              "w-7 h-7 md:w-9 md:h-9 rounded-lg flex items-center justify-center",
              "bg-white/60 backdrop-blur-sm border border-white/50 shadow-sm flex-shrink-0"
            )}>
              <IconComponent className={cn("w-3.5 h-3.5 md:w-4 md:h-4", colors.textAccent)} />
            </div>
          </div>

          {/* Title - tighter spacing */}
          <h1 className="font-bold text-sm md:text-base lg:text-lg text-foreground leading-snug mt-1.5 md:mt-2">
            {bundle.title}
          </h1>

          {/* Progress indicator - more compact */}
          <div className="flex items-center gap-2 mt-2 md:mt-3 pt-2 border-t border-black/5">
            {allCompleted ? (
              <div className="flex items-center gap-1.5 text-green-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">All completed!</span>
              </div>
            ) : (
              <>
                <div className="flex-1 h-1 bg-black/5 rounded-full overflow-hidden">
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
                  {completedCount}/{totalCount}
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

// Bundle Header - Displays bundle info with subject branding

import { ArrowLeft, Calendar, User, CheckCircle2 } from "lucide-react";
import { Calculator, Atom, FlaskConical, Leaf, BookOpen, Code } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import SubjectBackgroundPattern from "@/components/student/subjects/SubjectBackgroundPattern";
import type { LessonBundle, BundleContentItem } from "@/data/student/lessonBundles";
import type { StudentSubject } from "@/data/student/subjects";
import type { LucideIcon } from "lucide-react";

// Icon mapping for subjects
const iconMap: Record<string, LucideIcon> = {
  Calculator, Atom, FlaskConical, Leaf, BookOpen, Code,
};

// Subject color configurations
const headerColors: Record<string, {
  gradient: string;
  border: string;
  textAccent: string;
  progressBar: string;
  pattern: "math" | "physics" | "chemistry" | "biology" | "english" | "cs";
}> = {
  blue: {
    gradient: "from-blue-50/90 via-blue-100/70 to-indigo-50/80",
    border: "border-blue-200/60",
    textAccent: "text-blue-600",
    progressBar: "from-blue-500 to-blue-400",
    pattern: "math",
  },
  purple: {
    gradient: "from-purple-50/90 via-purple-100/70 to-violet-50/80",
    border: "border-purple-200/60",
    textAccent: "text-purple-600",
    progressBar: "from-purple-500 to-purple-400",
    pattern: "physics",
  },
  green: {
    gradient: "from-emerald-50/90 via-green-100/70 to-teal-50/80",
    border: "border-emerald-200/60",
    textAccent: "text-emerald-600",
    progressBar: "from-emerald-500 to-emerald-400",
    pattern: "chemistry",
  },
  red: {
    gradient: "from-rose-50/90 via-red-100/70 to-pink-50/80",
    border: "border-rose-200/60",
    textAccent: "text-rose-600",
    progressBar: "from-rose-500 to-rose-400",
    pattern: "biology",
  },
  amber: {
    gradient: "from-amber-50/90 via-orange-100/70 to-yellow-50/80",
    border: "border-amber-200/60",
    textAccent: "text-amber-600",
    progressBar: "from-amber-500 to-amber-400",
    pattern: "english",
  },
  cyan: {
    gradient: "from-cyan-50/90 via-sky-100/70 to-blue-50/80",
    border: "border-cyan-200/60",
    textAccent: "text-cyan-600",
    progressBar: "from-cyan-500 to-cyan-400",
    pattern: "cs",
  },
};

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

  // Get subject-specific colors
  const colors = headerColors[subject.color] || headerColors.cyan;
  const IconComponent = iconMap[subject.icon] || BookOpen;

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

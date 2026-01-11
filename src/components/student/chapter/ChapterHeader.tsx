// Chapter Header - Displays chapter info with subject-specific branding

import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calculator, Atom, FlaskConical, Leaf, BookOpen, Code, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import LearningStateBadge from "@/components/student/subjects/LearningStateBadge";
import SubjectBackgroundPattern from "@/components/student/subjects/SubjectBackgroundPattern";
import type { StudentChapter } from "@/data/student/chapters";
import type { StudentSubject } from "@/data/student/subjects";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Calculator,
  Atom,
  FlaskConical,
  Leaf,
  BookOpen,
  Code,
};

// Color configurations for chapter headers (matching subject headers)
const headerColors: Record<string, { 
  gradient: string; 
  iconBg: string;
  textAccent: string;
  patternColor: string;
  numberBg: string;
}> = {
  blue: {
    gradient: "from-blue-50/90 via-blue-100/50 to-white/80",
    iconBg: "bg-gradient-to-br from-blue-400 to-blue-600",
    textAccent: "text-blue-600",
    patternColor: "text-blue-400",
    numberBg: "from-blue-500 to-blue-700",
  },
  purple: {
    gradient: "from-violet-50/90 via-purple-100/50 to-white/80",
    iconBg: "bg-gradient-to-br from-violet-400 to-purple-600",
    textAccent: "text-violet-600",
    patternColor: "text-violet-400",
    numberBg: "from-violet-500 to-purple-700",
  },
  green: {
    gradient: "from-emerald-50/90 via-green-100/50 to-white/80",
    iconBg: "bg-gradient-to-br from-emerald-400 to-green-600",
    textAccent: "text-emerald-600",
    patternColor: "text-emerald-400",
    numberBg: "from-emerald-500 to-green-700",
  },
  red: {
    gradient: "from-rose-50/90 via-red-100/50 to-white/80",
    iconBg: "bg-gradient-to-br from-rose-400 to-red-500",
    textAccent: "text-rose-600",
    patternColor: "text-rose-400",
    numberBg: "from-rose-500 to-red-600",
  },
  amber: {
    gradient: "from-amber-50/90 via-orange-100/50 to-white/80",
    iconBg: "bg-gradient-to-br from-amber-400 to-orange-500",
    textAccent: "text-amber-600",
    patternColor: "text-amber-400",
    numberBg: "from-amber-500 to-orange-600",
  },
  cyan: {
    gradient: "from-cyan-50/90 via-teal-100/50 to-white/80",
    iconBg: "bg-gradient-to-br from-cyan-400 to-teal-500",
    textAccent: "text-cyan-600",
    patternColor: "text-cyan-400",
    numberBg: "from-cyan-500 to-teal-600",
  },
};

// Map subject IDs to pattern types
const subjectPatternMap: Record<string, "math" | "physics" | "chemistry" | "biology" | "english" | "cs"> = {
  math: "math",
  physics: "physics",
  chemistry: "chemistry",
  biology: "biology",
  english: "english",
  cs: "cs",
};

interface ChapterHeaderProps {
  chapter: StudentChapter;
  subject: StudentSubject;
}

export function ChapterHeader({ chapter, subject }: ChapterHeaderProps) {
  const navigate = useNavigate();
  const Icon = iconMap[subject.icon] || BookOpen;
  const colors = headerColors[subject.color] || headerColors.blue;
  const pattern = subjectPatternMap[subject.id] || "math";

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

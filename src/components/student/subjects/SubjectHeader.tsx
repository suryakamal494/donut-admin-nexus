// Subject Header - Creative island design with subject-specific styling

import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StudentSubject } from "@/data/student/subjects";
import SubjectBackgroundPattern from "./SubjectBackgroundPattern";
import { 
  Calculator, 
  Atom, 
  FlaskConical, 
  Leaf, 
  BookOpen, 
  Code,
  type LucideIcon 
} from "lucide-react";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Calculator,
  Atom,
  FlaskConical,
  Leaf,
  BookOpen,
  Code,
};

// Color configurations for subject headers
const headerColors: Record<string, { 
  gradient: string; 
  iconBg: string;
  progressBg: string;
  progressFill: string;
  textAccent: string;
  patternColor: string;
}> = {
  blue: {
    gradient: "from-blue-50/90 via-blue-100/50 to-white/80",
    iconBg: "bg-gradient-to-br from-blue-400 to-blue-600",
    progressBg: "bg-blue-100",
    progressFill: "from-blue-400 to-blue-600",
    textAccent: "text-blue-600",
    patternColor: "text-blue-400",
  },
  purple: {
    gradient: "from-violet-50/90 via-purple-100/50 to-white/80",
    iconBg: "bg-gradient-to-br from-violet-400 to-purple-600",
    progressBg: "bg-violet-100",
    progressFill: "from-violet-400 to-purple-600",
    textAccent: "text-violet-600",
    patternColor: "text-violet-400",
  },
  green: {
    gradient: "from-emerald-50/90 via-green-100/50 to-white/80",
    iconBg: "bg-gradient-to-br from-emerald-400 to-green-600",
    progressBg: "bg-emerald-100",
    progressFill: "from-emerald-400 to-green-600",
    textAccent: "text-emerald-600",
    patternColor: "text-emerald-400",
  },
  red: {
    gradient: "from-rose-50/90 via-red-100/50 to-white/80",
    iconBg: "bg-gradient-to-br from-rose-400 to-red-500",
    progressBg: "bg-rose-100",
    progressFill: "from-rose-400 to-red-500",
    textAccent: "text-rose-600",
    patternColor: "text-rose-400",
  },
  amber: {
    gradient: "from-amber-50/90 via-orange-100/50 to-white/80",
    iconBg: "bg-gradient-to-br from-amber-400 to-orange-500",
    progressBg: "bg-amber-100",
    progressFill: "from-amber-400 to-orange-500",
    textAccent: "text-amber-600",
    patternColor: "text-amber-400",
  },
  cyan: {
    gradient: "from-cyan-50/90 via-teal-100/50 to-white/80",
    iconBg: "bg-gradient-to-br from-cyan-400 to-teal-500",
    progressBg: "bg-cyan-100",
    progressFill: "from-cyan-400 to-teal-500",
    textAccent: "text-cyan-600",
    patternColor: "text-cyan-400",
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

interface SubjectHeaderProps {
  subject: StudentSubject;
}

const SubjectHeader = ({ subject }: SubjectHeaderProps) => {
  const navigate = useNavigate();
  const Icon = iconMap[subject.icon] || BookOpen;
  const colors = headerColors[subject.color] || headerColors.blue;
  const pattern = subjectPatternMap[subject.id] || "math";

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

          {/* Progress section */}
          <div className="mt-5">
            {/* Progress bar */}
            <div className={cn("h-3 rounded-full overflow-hidden", colors.progressBg)}>
              <div 
                className={cn(
                  "h-full rounded-full bg-gradient-to-r transition-all duration-500",
                  colors.progressFill
                )}
                style={{ width: `${subject.progress}%` }}
              />
            </div>

            {/* Progress stats */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <TrendingUp className={cn("w-4 h-4", colors.textAccent)} />
                <span className={cn("text-sm font-semibold", colors.textAccent)}>
                  {subject.progress}% Complete
                </span>
              </div>
              
              {/* Status badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 backdrop-blur-sm">
                <span className="text-xs font-medium text-muted-foreground">
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
    </div>
  );
};

export default SubjectHeader;

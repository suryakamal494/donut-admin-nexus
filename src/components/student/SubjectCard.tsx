// Student Subject Card - Glassmorphic design with progress
// Completely separate from other portal components

import { useNavigate } from "react-router-dom";
import { 
  Calculator, 
  Atom, 
  FlaskConical, 
  Leaf, 
  BookOpen, 
  Code,
  type LucideIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";
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

// Color configurations for each subject
const colorConfig: Record<string, { gradient: string; shadow: string; bg: string; text: string }> = {
  blue: {
    gradient: "from-blue-400 to-blue-600",
    shadow: "shadow-blue-400/30",
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  purple: {
    gradient: "from-violet-400 to-purple-600",
    shadow: "shadow-violet-400/30",
    bg: "bg-violet-50",
    text: "text-violet-600",
  },
  green: {
    gradient: "from-emerald-400 to-green-600",
    shadow: "shadow-emerald-400/30",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  red: {
    gradient: "from-rose-400 to-red-500",
    shadow: "shadow-rose-400/30",
    bg: "bg-rose-50",
    text: "text-rose-600",
  },
  amber: {
    gradient: "from-amber-400 to-orange-500",
    shadow: "shadow-amber-400/30",
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
  cyan: {
    gradient: "from-cyan-400 to-teal-500",
    shadow: "shadow-cyan-400/30",
    bg: "bg-cyan-50",
    text: "text-cyan-600",
  },
};

// Status labels
const statusLabels: Record<string, { label: string; emoji: string }> = {
  "in-progress": { label: "In Progress", emoji: "📚" },
  "just-started": { label: "Just Started", emoji: "🌱" },
  "doing-well": { label: "Doing Well", emoji: "🔥" },
  "needs-attention": { label: "Needs Focus", emoji: "⚡" },
  "almost-done": { label: "Almost Done", emoji: "🎯" },
  "on-track": { label: "On Track", emoji: "✨" },
};

interface SubjectCardProps {
  subject: StudentSubject;
  compact?: boolean;
}

const StudentSubjectCard = ({ subject, compact = false }: SubjectCardProps) => {
  const navigate = useNavigate();
  const Icon = iconMap[subject.icon] || BookOpen;
  const colors = colorConfig[subject.color] || colorConfig.blue;
  const status = statusLabels[subject.status] || statusLabels["in-progress"];

  const handleClick = () => {
    navigate(`/student/subjects/${subject.id}`);
  };

  if (compact) {
    return (
      <button
        onClick={handleClick}
        className="flex items-center gap-3 p-3 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] w-full text-left"
      >
        <div className={cn(
          "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
          colors.gradient,
          colors.shadow
        )}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm truncate">{subject.name}</p>
          <p className="text-xs text-muted-foreground">{subject.progress}% complete</p>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] p-4 text-left group"
    >
      {/* Background glow */}
      <div className={cn(
        "absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity",
        colors.bg
      )} />

      {/* Icon */}
      <div className={cn(
        "w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg mb-3",
        colors.gradient,
        colors.shadow
      )}>
        <Icon className="w-6 h-6 text-white" />
      </div>

      {/* Subject name */}
      <h3 className="font-bold text-foreground mb-1">{subject.name}</h3>

      {/* Status */}
      <p className="text-xs text-muted-foreground mb-3">
        {status.emoji} {status.label}
      </p>

      {/* Progress bar */}
      <div className="relative h-2 bg-muted/50 rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-500", colors.gradient)}
          style={{ width: `${subject.progress}%` }}
        />
      </div>

      {/* Progress text */}
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-muted-foreground">
          {subject.chaptersCompleted}/{subject.chaptersTotal} chapters
        </span>
        <span className={cn("text-xs font-semibold", colors.text)}>
          {subject.progress}%
        </span>
      </div>
    </button>
  );
};

export default StudentSubjectCard;

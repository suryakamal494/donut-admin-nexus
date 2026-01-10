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

// Color configurations for each subject - Using Donut AI brand palette variations
const colorConfig: Record<string, { gradient: string; shadow: string; bg: string; text: string }> = {
  coral: {
    gradient: "from-donut-coral to-donut-orange",
    shadow: "shadow-donut-coral/30",
    bg: "bg-donut-coral/10",
    text: "text-donut-coral",
  },
  orange: {
    gradient: "from-donut-orange to-donut-coral",
    shadow: "shadow-donut-orange/30",
    bg: "bg-donut-orange/10",
    text: "text-donut-orange",
  },
  pink: {
    gradient: "from-donut-pink to-donut-coral",
    shadow: "shadow-donut-pink/30",
    bg: "bg-donut-pink/10",
    text: "text-donut-pink",
  },
  warm: {
    gradient: "from-donut-coral to-donut-pink",
    shadow: "shadow-donut-coral/30",
    bg: "bg-donut-coral/10",
    text: "text-donut-coral",
  },
  sunset: {
    gradient: "from-donut-orange to-donut-pink",
    shadow: "shadow-donut-orange/30",
    bg: "bg-donut-orange/10",
    text: "text-donut-orange",
  },
  rose: {
    gradient: "from-donut-pink to-donut-orange",
    shadow: "shadow-donut-pink/30",
    bg: "bg-donut-pink/10",
    text: "text-donut-pink",
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

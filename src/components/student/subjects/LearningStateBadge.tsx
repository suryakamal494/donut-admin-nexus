// Learning State Badge - Color-coded badge for chapter/subject states

import { cn } from "@/lib/utils";
import { 
  Circle, 
  Play, 
  AlertTriangle, 
  CheckCircle2, 
  CheckCircle, 
  Star,
  type LucideIcon 
} from "lucide-react";
import type { ChapterLearningState } from "@/data/student/chapters";

interface StateConfig {
  label: string;
  icon: LucideIcon;
  bgColor: string;
  textColor: string;
  iconColor: string;
}

const stateConfigs: Record<ChapterLearningState, StateConfig> = {
  "not-started": {
    label: "Not Started",
    icon: Circle,
    bgColor: "bg-slate-100",
    textColor: "text-slate-600",
    iconColor: "text-slate-400",
  },
  "in-progress": {
    label: "In Progress",
    icon: Play,
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    iconColor: "text-blue-500",
  },
  "struggling": {
    label: "Needs Attention",
    icon: AlertTriangle,
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    iconColor: "text-amber-500",
  },
  "on-track": {
    label: "On Track",
    icon: CheckCircle2,
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    iconColor: "text-emerald-500",
  },
  "completed": {
    label: "Completed",
    icon: CheckCircle,
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    iconColor: "text-green-600",
  },
  "mastered": {
    label: "Mastered",
    icon: Star,
    bgColor: "bg-gradient-to-r from-amber-50 to-yellow-50",
    textColor: "text-amber-700",
    iconColor: "text-amber-500",
  },
};

interface LearningStateBadgeProps {
  state: ChapterLearningState;
  compact?: boolean;
  className?: string;
}

const LearningStateBadge = ({ state, compact = false, className }: LearningStateBadgeProps) => {
  const config = stateConfigs[state];
  const Icon = config.icon;

  if (compact) {
    return (
      <div
        className={cn(
          "inline-flex items-center justify-center w-6 h-6 rounded-full",
          config.bgColor,
          className
        )}
        title={config.label}
      >
        <Icon className={cn("w-3.5 h-3.5", config.iconColor)} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        config.bgColor,
        config.textColor,
        className
      )}
    >
      <Icon className={cn("w-3 h-3", config.iconColor)} />
      <span>{config.label}</span>
    </div>
  );
};

export default LearningStateBadge;

// Test Status Badge Component
// Visual indicator for test status (live, upcoming, attempted, missed)

import { memo } from "react";
import { Clock, CheckCircle2, XCircle, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TestStatus } from "@/data/student/tests";

interface TestStatusBadgeProps {
  status: TestStatus;
  size?: "sm" | "md";
  showIcon?: boolean;
  className?: string;
}

const statusConfig: Record<
  TestStatus,
  {
    label: string;
    icon: typeof Clock;
    bgClass: string;
    textClass: string;
    dotClass?: string;
  }
> = {
  live: {
    label: "Live Now",
    icon: Radio,
    bgClass: "bg-red-50",
    textClass: "text-red-600",
    dotClass: "bg-red-500",
  },
  upcoming: {
    label: "Upcoming",
    icon: Clock,
    bgClass: "bg-amber-50",
    textClass: "text-amber-600",
  },
  attempted: {
    label: "Attempted",
    icon: CheckCircle2,
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-600",
  },
  missed: {
    label: "Missed",
    icon: XCircle,
    bgClass: "bg-muted",
    textClass: "text-muted-foreground",
  },
};

const TestStatusBadge = memo(function TestStatusBadge({
  status,
  size = "sm",
  showIcon = true,
  className,
}: TestStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        config.bgClass,
        config.textClass,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        className
      )}
    >
      {/* Pulsing dot for live tests */}
      {status === "live" && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className={cn("relative inline-flex rounded-full h-2 w-2", config.dotClass)} />
        </span>
      )}

      {/* Icon for non-live statuses */}
      {showIcon && status !== "live" && (
        <Icon className={cn(size === "sm" ? "w-3 h-3" : "w-4 h-4")} />
      )}

      {config.label}
    </span>
  );
});

export default TestStatusBadge;

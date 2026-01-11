// My Path Mode - AI-personalized learning prescriptions

import { Target, ChevronRight, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AIPathItem } from "@/data/student/lessonBundles";

interface MyPathModeProps {
  pathItems: AIPathItem[];
}

const priorityConfig = {
  high: {
    color: "text-red-600",
    bgColor: "bg-red-100",
    borderColor: "border-l-red-500",
    label: "HIGH PRIORITY",
    icon: AlertTriangle,
  },
  medium: {
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    borderColor: "border-l-amber-500",
    label: "MEDIUM",
    icon: Clock,
  },
  low: {
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    borderColor: "border-l-blue-400",
    label: "RECOMMENDED",
    icon: Target,
  },
};

export function MyPathMode({ pathItems }: MyPathModeProps) {
  const pendingItems = pathItems.filter(item => !item.isCompleted);
  const completedItems = pathItems.filter(item => item.isCompleted);
  const completedCount = completedItems.length;
  const totalCount = pathItems.length;

  // Sort by priority: high > medium > low
  const sortedPending = [...pendingItems].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className={cn(
        "bg-gradient-to-r from-donut-coral/10 to-donut-orange/5",
        "rounded-2xl border border-donut-coral/20 p-4"
      )}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-donut-coral to-donut-orange flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">Your AI Learning Path</h3>
            <p className="text-sm text-muted-foreground">
              {completedCount}/{totalCount} prescriptions completed
            </p>
          </div>
        </div>
      </div>

      {/* Pending prescriptions */}
      {sortedPending.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3 px-1">
            NEEDS YOUR ATTENTION
          </h2>
          <div className="space-y-3">
            {sortedPending.map((item) => {
              const config = priorityConfig[item.priority];
              const PriorityIcon = config.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => console.log("Start AI path:", item.id)}
                  className={cn(
                    "w-full text-left group",
                    "bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50",
                    "p-4 shadow-sm hover:shadow-md transition-all duration-300",
                    "active:scale-[0.98]",
                    "border-l-4",
                    config.borderColor
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Priority badge */}
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={cn(
                          "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-bold",
                          config.bgColor,
                          config.color
                        )}>
                          <PriorityIcon className="w-3 h-3" />
                          {config.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ~{item.estimatedTime}
                        </span>
                      </div>

                      <h3 className="font-semibold text-foreground leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <ChevronRight className="w-5 h-5 text-muted-foreground/40 group-hover:text-foreground/70 transition-colors flex-shrink-0" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Completed prescriptions */}
      {completedItems.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
            COMPLETED
          </h2>
          <div className="space-y-2">
            {completedItems.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "bg-white/50 backdrop-blur-xl rounded-xl border border-white/50",
                  "p-3 opacity-60"
                )}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="font-medium text-foreground line-through">
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {pathItems.length === 0 && (
        <div className={cn(
          "bg-white/50 backdrop-blur-xl rounded-2xl border border-white/50",
          "p-8 text-center"
        )}>
          <Target className="w-12 h-12 text-donut-coral/40 mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-1">All caught up!</h3>
          <p className="text-sm text-muted-foreground">
            No personalized learning items for this chapter yet.
            Keep practicing in Classroom mode!
          </p>
        </div>
      )}
    </div>
  );
}

export default MyPathMode;

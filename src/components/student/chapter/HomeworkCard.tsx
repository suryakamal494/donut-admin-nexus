// Homework Card - Displays homework items with urgency indicators

import { ClipboardList, ChevronRight, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO, differenceInDays, isToday, isTomorrow, isPast } from "date-fns";
import type { HomeworkItem } from "@/data/student/lessonBundles";
import { Button } from "@/components/ui/button";

interface HomeworkCardProps {
  homework: HomeworkItem;
  onClick?: () => void;
}

export function HomeworkCard({ homework, onClick }: HomeworkCardProps) {
  const dueDate = parseISO(homework.dueDate);
  const daysUntilDue = differenceInDays(dueDate, new Date());
  
  // Determine urgency level
  const getUrgency = () => {
    if (homework.isCompleted) return "completed";
    if (isPast(dueDate) && !isToday(dueDate)) return "overdue";
    if (isToday(dueDate)) return "today";
    if (isTomorrow(dueDate)) return "tomorrow";
    if (daysUntilDue <= 3) return "soon";
    return "normal";
  };

  const urgency = getUrgency();

  const urgencyStyles = {
    completed: {
      border: "border-l-green-400",
      badge: "bg-green-100 text-green-700",
      text: "Completed",
    },
    overdue: {
      border: "border-l-red-500",
      badge: "bg-red-100 text-red-700",
      text: "Overdue",
    },
    today: {
      border: "border-l-red-400",
      badge: "bg-red-100 text-red-700",
      text: "Due Today",
    },
    tomorrow: {
      border: "border-l-amber-400",
      badge: "bg-amber-100 text-amber-700",
      text: "Due Tomorrow",
    },
    soon: {
      border: "border-l-amber-300",
      badge: "bg-amber-50 text-amber-600",
      text: `Due in ${daysUntilDue} days`,
    },
    normal: {
      border: "border-l-slate-300",
      badge: "bg-slate-100 text-slate-600",
      text: format(dueDate, "MMM d"),
    },
  };

  const style = urgencyStyles[urgency];

  return (
    <button
      onClick={onClick}
      disabled={homework.isCompleted}
      className={cn(
        "w-full text-left group",
        "bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50",
        "p-4 shadow-sm transition-all duration-300",
        !homework.isCompleted && "hover:shadow-md active:scale-[0.98]",
        "border-l-4",
        style.border,
        homework.isCompleted && "opacity-60"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: Icon + Content */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
            homework.isCompleted 
              ? "bg-green-100" 
              : urgency === "overdue" || urgency === "today"
                ? "bg-red-100"
                : "bg-slate-100"
          )}>
            {homework.isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : urgency === "overdue" ? (
              <AlertCircle className="w-5 h-5 text-red-600" />
            ) : (
              <ClipboardList className="w-5 h-5 text-slate-600" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground leading-snug">
              {homework.title}
            </h3>
            
            {/* Due date badge */}
            <div className="flex items-center gap-2 mt-1.5">
              <span className={cn(
                "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium",
                style.badge
              )}>
                <Clock className="w-3 h-3" />
                {style.text}
              </span>
              <span className="text-xs text-muted-foreground">
                {homework.questionsCount} questions
              </span>
            </div>

            {/* Linked session info */}
            {homework.linkedSessionTitle && (
              <p className="text-xs text-muted-foreground mt-1">
                From: {homework.linkedSessionTitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: Action */}
        <div className="flex items-center flex-shrink-0">
          {homework.isCompleted ? (
            <span className="text-xs text-green-600 font-medium">Done</span>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              className={cn(
                "h-8 px-3 text-sm font-medium",
                urgency === "overdue" || urgency === "today"
                  ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                  : "text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50"
              )}
            >
              {homework.isStarted ? "Continue" : "Start"}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </button>
  );
}

export default HomeworkCard;

import { Clock, MapPin, BookOpen, Plus, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TeacherTimetableSlot } from "@/data/teacherData";

interface ScheduleClassCardProps {
  slot: TeacherTimetableSlot;
  isLive?: boolean;
  isPast?: boolean;
  onViewPlan?: () => void;
  onCreatePlan?: () => void;
  onStartClass?: () => void;
  compact?: boolean;
}

export const ScheduleClassCard = ({
  slot,
  isLive,
  isPast,
  onViewPlan,
  onCreatePlan,
  onStartClass,
  compact = false,
}: ScheduleClassCardProps) => {
  return (
    <Card 
      className={cn(
        "transition-all duration-200 overflow-hidden",
        isLive && "border-primary/50 bg-primary/5 shadow-md",
        isPast && "opacity-60",
        !compact && "hover:shadow-md"
      )}
    >
      <CardContent className={cn("p-3", compact && "p-2")}>
        <div className="flex items-start gap-3">
          {/* Time Column */}
          <div className={cn(
            "text-center min-w-[50px]",
            compact && "min-w-[40px]"
          )}>
            <p className={cn(
              "font-semibold",
              compact ? "text-xs" : "text-sm",
              isLive ? "text-primary" : "text-foreground"
            )}>
              {slot.startTime}
            </p>
            <p className={cn(
              "text-muted-foreground",
              compact ? "text-[10px]" : "text-xs"
            )}>
              {slot.endTime}
            </p>
          </div>
          
          {/* Divider */}
          <div className={cn(
            "w-1 rounded-full self-stretch",
            isLive ? "bg-gradient-to-b from-primary to-accent" : "bg-muted",
            compact ? "h-8" : "h-auto"
          )} />
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className={cn(
                "font-semibold text-foreground truncate",
                compact ? "text-xs" : "text-sm"
              )}>
                {slot.subject}
              </h4>
              {isLive && (
                <Badge className="bg-primary text-white text-[10px] px-1.5 py-0">
                  LIVE
                </Badge>
              )}
            </div>
            
            <div className={cn(
              "flex items-center gap-2 text-muted-foreground",
              compact ? "text-[10px]" : "text-xs"
            )}>
              <span>{slot.batchName}</span>
              <span>•</span>
              <span>{slot.className}</span>
              {slot.room && !compact && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5" />
                    {slot.room}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          {!compact && (
            <div className="flex items-center gap-1">
              {slot.hasLessonPlan ? (
                <>
                  <Badge 
                    variant="secondary" 
                    className="bg-green-100 text-green-700 border-0 cursor-pointer hover:bg-green-200"
                    onClick={onViewPlan}
                  >
                    <BookOpen className="w-3 h-3 mr-1" />
                    Plan
                  </Badge>
                  {isLive && onStartClass && (
                    <Button 
                      size="sm" 
                      className="h-7 px-2 gradient-button"
                      onClick={onStartClass}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Start
                    </Button>
                  )}
                </>
              ) : (
                <Badge 
                  variant="outline" 
                  className="border-dashed cursor-pointer hover:bg-muted"
                  onClick={onCreatePlan}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Plan
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

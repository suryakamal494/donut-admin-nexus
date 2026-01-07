import { Clock, MapPin, BookOpen, Plus, Play, FileText, FlaskConical, CheckCircle2, Edit3 } from "lucide-react";
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

const getPlanStatusConfig = (status?: 'ready' | 'draft' | 'none') => {
  switch (status) {
    case 'ready':
      return {
        borderClass: 'border-l-4 border-l-green-500',
        bgClass: 'bg-green-50/50',
        icon: CheckCircle2,
        iconColor: 'text-green-600',
        label: 'Ready',
      };
    case 'draft':
      return {
        borderClass: 'border-l-4 border-l-amber-500',
        bgClass: 'bg-amber-50/50',
        icon: Edit3,
        iconColor: 'text-amber-600',
        label: 'Draft',
      };
    default:
      return {
        borderClass: 'border-l-4 border-l-dashed border-l-muted-foreground/30',
        bgClass: '',
        icon: Plus,
        iconColor: 'text-muted-foreground',
        label: 'No Plan',
      };
  }
};

export const ScheduleClassCard = ({
  slot,
  isLive,
  isPast,
  onViewPlan,
  onCreatePlan,
  onStartClass,
  compact = false,
}: ScheduleClassCardProps) => {
  const planConfig = getPlanStatusConfig(slot.lessonPlanStatus);
  const PlanIcon = planConfig.icon;
  const isLab = slot.periodType === 'lab';

  if (compact) {
    // Compact card for weekly grid view
    return (
      <div 
        className={cn(
          "p-2 rounded-lg transition-all duration-200 cursor-pointer group",
          planConfig.borderClass,
          planConfig.bgClass,
          isLive && "ring-2 ring-primary ring-offset-1 bg-primary/10",
          isPast && "opacity-50",
          !isPast && "hover:shadow-sm hover:bg-muted/50"
        )}
        onClick={slot.hasLessonPlan ? onViewPlan : onCreatePlan}
      >
        {/* Time */}
        <div className="flex items-center justify-between mb-1">
          <span className={cn(
            "text-[10px] font-medium",
            isLive ? "text-primary" : "text-muted-foreground"
          )}>
            {slot.startTime}
          </span>
          {isLive && (
            <Badge className="bg-primary text-white text-[8px] px-1 py-0 h-4 animate-pulse">
              LIVE
            </Badge>
          )}
          {isLab && !isLive && (
            <FlaskConical className="w-3 h-3 text-purple-500" />
          )}
        </div>

        {/* Subject */}
        <h4 className={cn(
          "text-xs font-semibold text-foreground leading-tight truncate",
          isLive && "text-primary"
        )}>
          {slot.subject}
        </h4>

        {/* Batch + Class */}
        <p className="text-[10px] text-muted-foreground truncate mt-0.5">
          {slot.className} • {slot.batchName}
        </p>

        {/* Topic (if available) */}
        {slot.topic && (
          <p className="text-[9px] text-muted-foreground/70 truncate mt-0.5 italic">
            {slot.topic}
          </p>
        )}

        {/* Plan Status Indicator */}
        <div className="flex items-center justify-between mt-1.5">
          {slot.room && (
            <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
              <MapPin className="w-2.5 h-2.5" />
              {slot.room}
            </span>
          )}
          <PlanIcon className={cn("w-3 h-3", planConfig.iconColor)} />
        </div>
      </div>
    );
  }

  // Full card for list view
  return (
    <Card 
      className={cn(
        "transition-all duration-200 overflow-hidden",
        planConfig.borderClass,
        isLive && "ring-2 ring-primary shadow-md bg-primary/5",
        isPast && "opacity-60",
        !compact && "hover:shadow-md"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Time Column */}
          <div className="text-center min-w-[60px] py-1">
            <p className={cn(
              "text-lg font-bold",
              isLive ? "text-primary" : "text-foreground"
            )}>
              {slot.startTime}
            </p>
            <p className="text-xs text-muted-foreground">
              {slot.endTime}
            </p>
            <Badge variant="outline" className="mt-1 text-[10px] px-1.5">
              P{slot.periodNumber}
            </Badge>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className={cn(
                "font-semibold text-foreground",
                isLive && "text-primary"
              )}>
                {slot.subject}
              </h4>
              {isLive && (
                <Badge className="bg-primary text-white text-[10px] px-1.5 py-0 animate-pulse">
                  LIVE
                </Badge>
              )}
              {isLab && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-[10px] px-1.5 gap-0.5">
                  <FlaskConical className="w-3 h-3" />
                  Lab
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span className="font-medium">{slot.batchName}</span>
              <span>•</span>
              <span>{slot.className}</span>
              {slot.room && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <MapPin className="w-3 h-3" />
                    {slot.room}
                  </span>
                </>
              )}
            </div>

            {/* Topic */}
            {slot.topic && (
              <p className="text-sm text-muted-foreground/80 italic mb-2 truncate">
                📚 {slot.topic}
              </p>
            )}

            {/* Plan Status + Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {slot.lessonPlanStatus === 'ready' && (
                <Badge 
                  variant="secondary" 
                  className="bg-green-100 text-green-700 border-0 cursor-pointer hover:bg-green-200 gap-1"
                  onClick={onViewPlan}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  Plan Ready
                </Badge>
              )}
              {slot.lessonPlanStatus === 'draft' && (
                <Badge 
                  variant="secondary" 
                  className="bg-amber-100 text-amber-700 border-0 cursor-pointer hover:bg-amber-200 gap-1"
                  onClick={onViewPlan}
                >
                  <Edit3 className="w-3 h-3" />
                  Draft
                </Badge>
              )}
              {slot.lessonPlanStatus === 'none' && (
                <Badge 
                  variant="outline" 
                  className="border-dashed cursor-pointer hover:bg-muted gap-1"
                  onClick={onCreatePlan}
                >
                  <Plus className="w-3 h-3" />
                  Add Plan
                </Badge>
              )}

              {/* Live class actions */}
              {isLive && (
                <Button 
                  size="sm" 
                  className="h-7 px-3 gradient-button ml-auto"
                  onClick={onStartClass}
                >
                  <Play className="w-3 h-3 mr-1" />
                  Start Class
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

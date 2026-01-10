import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Plus, 
  CheckCircle2,
  MapPin
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type TeacherTimetableSlot } from "@/data/teacherData";

interface ClassCardProps {
  slot: TeacherTimetableSlot;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onConfirm: () => void;
}

export const ClassCard = ({ slot, index, isSelected, onSelect, onConfirm }: ClassCardProps) => {
  const navigate = useNavigate();
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  const isLive = currentTime >= slot.startTime && currentTime < slot.endTime;
  const isPast = currentTime >= slot.endTime;

  return (
    <Card 
      className={cn(
        "transition-all duration-200 cursor-pointer hover:shadow-md active:scale-[0.99] card-premium",
        isLive && "border-primary/50 bg-primary/5 ring-1 ring-primary/20",
        isPast && "opacity-60",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={onSelect}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Time Column */}
          <div className="text-center min-w-[50px] sm:min-w-[60px]">
            <p className={cn(
              "font-bold text-sm sm:text-base",
              isLive ? "text-primary" : "text-foreground"
            )}>
              {slot.startTime}
            </p>
            <p className="text-[10px] sm:text-xs text-foreground/60">{slot.endTime}</p>
          </div>
          
          {/* Divider */}
          <div className={cn(
            "w-1 h-10 sm:h-12 rounded-full flex-shrink-0",
            isLive ? "bg-gradient-to-b from-primary to-accent" : 
            slot.lessonPlanStatus === 'ready' ? "bg-green-500" :
            slot.lessonPlanStatus === 'draft' ? "bg-amber-500" :
            "bg-muted"
          )} />
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
              <h4 className="font-bold text-base sm:text-lg text-foreground truncate">
                {slot.subject}
              </h4>
              {isLive && (
                <Badge className="bg-primary text-white text-[9px] sm:text-[10px] px-1.5 animate-pulse">
                  LIVE
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-foreground/70 font-medium flex-wrap">
              <span className="font-semibold">{slot.batchName}</span>
              <span>•</span>
              <span>{slot.className}</span>
              {slot.room && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {slot.room}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Status/Action - Larger touch targets */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {isPast ? (
              <Button 
                size="sm" 
                variant="outline"
                className="h-8 sm:h-9 px-2 sm:px-3 text-xs font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  onConfirm();
                }}
              >
                <CheckCircle2 className="w-3.5 h-3.5 sm:mr-1" />
                <span className="hidden sm:inline">Confirm</span>
              </Button>
            ) : slot.hasLessonPlan ? (
              <Badge 
                variant="secondary" 
                className="bg-green-100 text-green-700 border-0 h-7 sm:h-8 px-2 sm:px-2.5 cursor-pointer hover:bg-green-200"
                onClick={(e) => {
                  e.stopPropagation();
                  if (slot.lessonPlanId) {
                    navigate(`/teacher/lesson-plans/${slot.lessonPlanId}`);
                  }
                }}
              >
                <BookOpen className="w-3 h-3 sm:mr-1" />
                <span className="hidden sm:inline text-xs">Ready</span>
              </Badge>
            ) : (
              <Badge 
                variant="outline" 
                className="border-dashed h-7 sm:h-8 px-2 sm:px-2.5 cursor-pointer hover:bg-muted"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/teacher/lesson-plans/new");
                }}
              >
                <Plus className="w-3 h-3 sm:mr-1" />
                <span className="hidden sm:inline text-xs">Plan</span>
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

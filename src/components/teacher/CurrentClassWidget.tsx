import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Play, 
  Clock, 
  MapPin, 
  BookOpen, 
  Plus, 
  ChevronDown, 
  ChevronUp,
  CheckCircle2,
  FlaskConical,
  Sparkles
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { TeacherTimetableSlot, LessonPlan } from "@/data/teacherData";
import { teacherLessonPlans } from "@/data/teacherData";

interface CurrentClassWidgetProps {
  slot: TeacherTimetableSlot;
  status: 'current' | 'next';
  dateStr: string;
  onStartClass?: () => void;
  onConfirmTeaching?: () => void;
}

const blockTypeConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  explain: { icon: BookOpen, color: "text-blue-600 bg-blue-50", label: "Explain" },
  demonstrate: { icon: Play, color: "text-purple-600 bg-purple-50", label: "Demo" },
  ask: { icon: Sparkles, color: "text-amber-600 bg-amber-50", label: "Discuss" },
  check: { icon: CheckCircle2, color: "text-green-600 bg-green-50", label: "Check" },
  practice: { icon: FlaskConical, color: "text-orange-600 bg-orange-50", label: "Practice" },
  homework: { icon: BookOpen, color: "text-red-600 bg-red-50", label: "Homework" },
};

export const CurrentClassWidget = ({
  slot,
  status,
  dateStr,
  onStartClass,
  onConfirmTeaching,
}: CurrentClassWidgetProps) => {
  const navigate = useNavigate();
  const [isPlanExpanded, setIsPlanExpanded] = useState(false);
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);

  // Find the lesson plan for this slot
  useEffect(() => {
    if (slot.lessonPlanId) {
      const plan = teacherLessonPlans.find(lp => lp.id === slot.lessonPlanId);
      setLessonPlan(plan || null);
    } else {
      setLessonPlan(null);
    }
  }, [slot.lessonPlanId]);

  const totalDuration = lessonPlan?.blocks.reduce((sum, b) => sum + (b.duration || 0), 0) || 0;
  const isLab = slot.periodType === 'lab';

  const handleViewFullPlan = () => {
    if (slot.lessonPlanId) {
      navigate(`/teacher/lesson-plans/${slot.lessonPlanId}`);
    }
  };

  const handleCreatePlan = () => {
    const params = new URLSearchParams({
      batch: slot.batchId,
      batchName: slot.batchName,
      date: dateStr,
      period: slot.periodNumber.toString(),
      className: slot.className,
    });
    navigate(`/teacher/lesson-plans/new?${params.toString()}`);
  };

  return (
    <Card className={cn(
      "overflow-hidden border-2 transition-all duration-300 card-premium",
      status === 'current' 
        ? "border-primary/50 bg-gradient-to-br from-primary/5 via-background to-accent/5 shadow-lg shadow-primary/10" 
        : "border-border hover:border-primary/30"
    )}>
      <CardContent className="p-0">
        {/* Main Header */}
        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-3 sm:gap-4">
            {/* Status Icon */}
            <div className={cn(
              "w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm",
              status === 'current'
                ? "gradient-button"
                : "bg-muted"
            )}>
              {status === 'current' ? (
                <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="white" />
              ) : (
                <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              {/* Status Badge + Time */}
              <div className="flex items-center gap-2 mb-1.5">
                <Badge 
                  className={cn(
                    "text-[10px] sm:text-xs font-bold px-2 py-0.5",
                    status === 'current' 
                      ? "bg-primary text-white animate-pulse" 
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {status === 'current' ? 'NOW' : 'NEXT'}
                </Badge>
                <span className="text-sm sm:text-base font-semibold text-foreground/70">
                  {slot.startTime} - {slot.endTime}
                </span>
                {isLab && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-[10px] gap-0.5">
                    <FlaskConical className="w-3 h-3" />
                    Lab
                  </Badge>
                )}
              </div>
              
              {/* Subject + Batch */}
              <h3 className="font-bold text-lg sm:text-xl text-foreground truncate">
                {slot.subject}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-foreground/60 font-medium">
                <span className="font-semibold text-foreground/80">{slot.batchName}</span>
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
              
              {/* Topic (if available) */}
              {slot.topic && (
                <p className="text-sm text-foreground/50 mt-1.5 italic truncate">
                  📚 {slot.topic}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            {slot.hasLessonPlan && lessonPlan ? (
              <>
                <Button 
                  variant="outline" 
                  className="flex-1 h-12 sm:h-11 text-sm font-semibold border-primary/30 text-primary hover:bg-primary/5"
                  onClick={handleViewFullPlan}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  View Plan
                </Button>
                {status === 'current' && (
                  <Button 
                    className="flex-1 h-12 sm:h-11 text-sm font-semibold gradient-button"
                    onClick={onStartClass}
                  >
                    <Play className="w-4 h-4 mr-2" fill="white" />
                    Start Class
                  </Button>
                )}
              </>
            ) : (
              <Button 
                className="flex-1 h-12 sm:h-11 text-sm font-semibold gradient-button"
                onClick={handleCreatePlan}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Lesson Plan
              </Button>
            )}
          </div>
        </div>

        {/* Lesson Plan Preview (Collapsible) */}
        {lessonPlan && lessonPlan.blocks.length > 0 && (
          <Collapsible open={isPlanExpanded} onOpenChange={setIsPlanExpanded}>
            <CollapsibleTrigger asChild>
              <button className={cn(
                "w-full flex items-center justify-between p-3 sm:p-4 border-t bg-muted/30 hover:bg-muted/50 transition-colors",
                "text-sm font-medium text-foreground/70"
              )}>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Lesson Plan Preview</span>
                  <Badge variant="secondary" className="text-[10px] px-1.5">
                    {lessonPlan.blocks.length} blocks
                  </Badge>
                  <Badge variant="secondary" className="text-[10px] px-1.5">
                    {totalDuration} min
                  </Badge>
                </div>
                {isPlanExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-2 bg-muted/20">
                {lessonPlan.blocks.slice(0, 4).map((block, index) => {
                  const config = blockTypeConfig[block.type] || blockTypeConfig.explain;
                  const Icon = config.icon;
                  
                  return (
                    <div 
                      key={block.id}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-background border"
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        config.color
                      )}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {block.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {config.label} • {block.duration || 5}min
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">
                        #{index + 1}
                      </span>
                    </div>
                  );
                })}
                
                {lessonPlan.blocks.length > 4 && (
                  <p className="text-xs text-center text-muted-foreground py-1">
                    +{lessonPlan.blocks.length - 4} more blocks
                  </p>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
};

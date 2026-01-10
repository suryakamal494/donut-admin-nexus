import { useState, useRef, useCallback } from "react";
import { 
  MoreVertical, 
  Edit, 
  Copy, 
  Trash2, 
  Play, 
  Users, 
  Clock,
  FileQuestion,
  BarChart3,
  Calendar,
  Zap
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import type { TeacherExam } from "@/data/teacher/types";

interface TeacherExamCardProps {
  exam: TeacherExam;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onStart?: () => void;
  onViewResults?: () => void;
}

// Swipe configuration
const SWIPE_THRESHOLD = 60;
const ACTION_WIDTH = 180;
const VELOCITY_THRESHOLD = 0.5;

const getStatusConfig = (status: TeacherExam["status"]) => {
  switch (status) {
    case "draft":
      return { label: "Draft", className: "bg-muted text-muted-foreground" };
    case "scheduled":
      return { label: "Scheduled", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" };
    case "live":
      return { label: "Live", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 animate-pulse" };
    case "completed":
      return { label: "Completed", className: "bg-primary/10 text-primary" };
    default:
      return { label: status, className: "bg-muted text-muted-foreground" };
  }
};

const getPatternConfig = (pattern: TeacherExam["pattern"]) => {
  switch (pattern) {
    case "jee_main":
      return { label: "JEE Main", icon: Zap };
    case "jee_advanced":
      return { label: "JEE Adv", icon: Zap };
    case "neet":
      return { label: "NEET", icon: Zap };
    default:
      return null;
  }
};

export const TeacherExamCard = ({
  exam,
  onEdit,
  onDuplicate,
  onDelete,
  onStart,
  onViewResults,
}: TeacherExamCardProps) => {
  const isMobile = useIsMobile();
  const statusConfig = getStatusConfig(exam.status);
  const patternConfig = getPatternConfig(exam.pattern);

  // Swipe state
  const [translateX, setTranslateX] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const isDragging = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
    isDragging.current = false;
  }, [isMobile]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = touchStartX.current - currentX;
    const diffY = Math.abs(touchStartY.current - currentY);

    // If scrolling vertically, don't handle swipe
    if (diffY > Math.abs(diffX) && !isDragging.current) return;
    
    isDragging.current = true;

    // Calculate new position
    let newTranslateX = isRevealed ? -ACTION_WIDTH - diffX : -diffX;
    
    // Clamp the value
    newTranslateX = Math.max(-ACTION_WIDTH, Math.min(0, newTranslateX));
    
    setTranslateX(newTranslateX);
  }, [isMobile, isRevealed]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isMobile || !isDragging.current) return;
    
    const endX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - endX;
    const duration = Date.now() - touchStartTime.current;
    const velocity = Math.abs(diffX) / duration;

    // Determine if we should reveal or hide based on threshold and velocity
    const shouldReveal = velocity > VELOCITY_THRESHOLD 
      ? diffX > 0 
      : Math.abs(translateX) > SWIPE_THRESHOLD;

    if (shouldReveal && !isRevealed) {
      setTranslateX(-ACTION_WIDTH);
      setIsRevealed(true);
    } else if (!shouldReveal || (isRevealed && diffX < -SWIPE_THRESHOLD)) {
      setTranslateX(0);
      setIsRevealed(false);
    } else if (isRevealed) {
      setTranslateX(-ACTION_WIDTH);
    }

    isDragging.current = false;
  }, [isMobile, isRevealed, translateX]);

  const resetSwipe = useCallback(() => {
    setTranslateX(0);
    setIsRevealed(false);
  }, []);

  const handleAction = useCallback((action: () => void) => {
    resetSwipe();
    action();
  }, [resetSwipe]);

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Swipe Action Buttons (behind card) - Mobile only */}
      {isMobile && (
        <div 
          className={cn(
            "absolute inset-y-0 right-0 flex items-stretch transition-opacity duration-200",
            translateX < 0 ? "opacity-100" : "opacity-0"
          )}
          style={{ width: ACTION_WIDTH }}
        >
          <button
            onClick={() => onEdit && handleAction(onEdit)}
            className="flex-1 flex flex-col items-center justify-center gap-1 bg-blue-500 text-white active:bg-blue-600 transition-colors"
          >
            <Edit className="w-5 h-5" />
            <span className="text-[10px] font-medium">Edit</span>
          </button>
          <button
            onClick={() => onDuplicate && handleAction(onDuplicate)}
            className="flex-1 flex flex-col items-center justify-center gap-1 bg-amber-500 text-white active:bg-amber-600 transition-colors"
          >
            <Copy className="w-5 h-5" />
            <span className="text-[10px] font-medium">Duplicate</span>
          </button>
          <button
            onClick={() => onDelete && handleAction(onDelete)}
            className="flex-1 flex flex-col items-center justify-center gap-1 bg-red-500 text-white active:bg-red-600 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            <span className="text-[10px] font-medium">Delete</span>
          </button>
        </div>
      )}

      {/* Main Card */}
      <Card 
        ref={cardRef}
        className={cn(
          "card-premium group overflow-hidden relative bg-card",
          isMobile && "touch-pan-y"
        )}
        style={{
          transform: isMobile ? `translateX(${translateX}px)` : undefined,
          transition: isDragging.current ? 'none' : 'transform 0.25s ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <CardContent className="p-0">
          {/* Header with gradient */}
          <div className="relative h-2 bg-gradient-to-r from-primary via-accent to-primary" />
          
          <div className="p-4 space-y-3">
            {/* Top Row: Badges & Menu */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={statusConfig.className}>
                  {statusConfig.label}
                </Badge>
                {patternConfig && (
                  <Badge variant="outline" className="text-xs">
                    <patternConfig.icon className="w-3 h-3 mr-1" />
                    {patternConfig.label}
                  </Badge>
                )}
              </div>
              
              {/* Desktop dropdown menu - hidden on mobile when swiping is available */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn(
                      "h-8 w-8 transition-opacity",
                      isMobile ? "opacity-50" : "md:opacity-0 md:group-hover:opacity-100"
                    )}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onDuplicate}>
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  {exam.status === "completed" && (
                    <DropdownMenuItem onClick={onViewResults}>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Results
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Title */}
            <h3 className="font-semibold text-foreground line-clamp-2 leading-tight">
              {exam.name}
            </h3>
            
            {/* Subject & Batches */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-primary font-medium">{exam.subjects.join(", ")}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {exam.batchIds.length} {exam.batchIds.length === 1 ? "batch" : "batches"}
              </span>
            </div>
            
            {/* Stats Row */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <FileQuestion className="w-3.5 h-3.5" />
                {exam.totalQuestions} Qs
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {exam.duration}m
              </span>
              <span className="flex items-center gap-1">
                {exam.totalMarks} marks
              </span>
            </div>

            {/* Schedule info */}
            {exam.scheduledDate && (
              <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1.5 rounded-lg w-fit">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(exam.scheduledDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            )}
            
            {/* Actions based on status */}
            <div className="flex items-center gap-2 pt-1">
              {exam.status === "draft" && (
                <>
                  <Button size="sm" variant="outline" className="flex-1 h-9" onClick={onEdit}>
                    Continue
                  </Button>
                  <Button size="sm" className="flex-1 h-9 gradient-button" onClick={onStart}>
                    <Play className="w-3.5 h-3.5 mr-1.5" />
                    Start
                  </Button>
                </>
              )}
              {exam.status === "scheduled" && (
                <Button size="sm" className="w-full h-9 gradient-button" onClick={onStart}>
                  <Play className="w-3.5 h-3.5 mr-1.5" />
                  Start Now
                </Button>
              )}
              {exam.status === "live" && (
                <Button size="sm" variant="outline" className="w-full h-9 border-green-500 text-green-600 dark:text-green-400">
                  <Users className="w-3.5 h-3.5 mr-1.5" />
                  View Live
                </Button>
              )}
              {exam.status === "completed" && (
                <Button size="sm" variant="outline" className="w-full h-9" onClick={onViewResults}>
                  <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
                  Results
                </Button>
              )}
            </div>

            {/* Swipe hint indicator - shown only on mobile when card hasn't been swiped yet */}
            {isMobile && !isRevealed && translateX === 0 && (
              <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] text-muted-foreground/50 animate-pulse pointer-events-none">
                <span>← Swipe</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

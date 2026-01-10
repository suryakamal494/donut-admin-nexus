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
import type { TeacherExam } from "@/data/teacher/types";

interface TeacherExamCardProps {
  exam: TeacherExam;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onStart?: () => void;
  onViewResults?: () => void;
}

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
  const statusConfig = getStatusConfig(exam.status);
  const patternConfig = getPatternConfig(exam.pattern);

  return (
    <Card className="card-premium group overflow-hidden">
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
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
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
        </div>
      </CardContent>
    </Card>
  );
};

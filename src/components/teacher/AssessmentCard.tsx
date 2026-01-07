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
  Calendar
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
import type { TeacherAssessment } from "@/data/teacherData";

interface AssessmentCardProps {
  assessment: TeacherAssessment;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onStart?: () => void;
  onViewResults?: () => void;
}

const getStatusConfig = (status: TeacherAssessment["status"]) => {
  switch (status) {
    case "draft":
      return { label: "Draft", className: "bg-muted text-muted-foreground" };
    case "scheduled":
      return { label: "Scheduled", className: "bg-blue-100 text-blue-700" };
    case "live":
      return { label: "Live", className: "bg-green-100 text-green-700 animate-pulse" };
    case "completed":
      return { label: "Completed", className: "bg-primary/10 text-primary" };
    default:
      return { label: status, className: "bg-muted text-muted-foreground" };
  }
};

const getTypeConfig = (type: TeacherAssessment["type"]) => {
  switch (type) {
    case "quiz":
      return { label: "Quiz", icon: FileQuestion, className: "bg-purple-100 text-purple-700" };
    case "test":
      return { label: "Test", icon: FileQuestion, className: "bg-amber-100 text-amber-700" };
    case "poll":
      return { label: "Poll", icon: BarChart3, className: "bg-teal-100 text-teal-700" };
    default:
      return { label: type, icon: FileQuestion, className: "bg-muted text-muted-foreground" };
  }
};

export const AssessmentCard = ({
  assessment,
  onEdit,
  onDuplicate,
  onDelete,
  onStart,
  onViewResults,
}: AssessmentCardProps) => {
  const statusConfig = getStatusConfig(assessment.status);
  const typeConfig = getTypeConfig(assessment.type);
  const TypeIcon = typeConfig.icon;

  return (
    <Card className="card-premium group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge className={typeConfig.className}>
              <TypeIcon className="w-3 h-3 mr-1" />
              {typeConfig.label}
            </Badge>
            <Badge className={statusConfig.className}>
              {statusConfig.label}
            </Badge>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
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
              {assessment.status === "completed" && (
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
        
        <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
          {assessment.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-3">
          {assessment.subject} • {assessment.batchName}
        </p>
        
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <FileQuestion className="w-3 h-3" />
            {assessment.questionCount} Qs
          </span>
          {assessment.duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {assessment.duration}m
            </span>
          )}
          {assessment.scheduledFor && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(assessment.scheduledFor).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
        
        {/* Actions based on status */}
        <div className="flex items-center gap-2">
          {assessment.status === "draft" && (
            <>
              <Button size="sm" variant="outline" className="flex-1" onClick={onEdit}>
                Continue Editing
              </Button>
              <Button size="sm" className="gradient-button flex-1" onClick={onStart}>
                <Play className="w-3 h-3 mr-1" />
                Start Now
              </Button>
            </>
          )}
          {assessment.status === "scheduled" && (
            <Button size="sm" className="gradient-button w-full" onClick={onStart}>
              <Play className="w-3 h-3 mr-1" />
              Start Now
            </Button>
          )}
          {assessment.status === "live" && (
            <Button size="sm" variant="outline" className="w-full border-green-500 text-green-600">
              <Users className="w-3 h-3 mr-1" />
              View Live Responses
            </Button>
          )}
          {assessment.status === "completed" && (
            <Button size="sm" variant="outline" className="w-full" onClick={onViewResults}>
              <BarChart3 className="w-3 h-3 mr-1" />
              View Results
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

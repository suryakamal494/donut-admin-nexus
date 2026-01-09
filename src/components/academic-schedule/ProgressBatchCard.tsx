import { useNavigate } from "react-router-dom";
import { ChevronRight, TrendingUp, TrendingDown, CheckCircle, AlertTriangle, BookOpen, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BatchProgressSummary } from "@/types/academicSchedule";

interface ProgressBatchCardProps {
  batch: BatchProgressSummary;
}

const SUBJECT_COLORS: Record<string, string> = {
  phy: "bg-blue-500",
  mat: "bg-purple-500",
  che: "bg-emerald-500",
  bio: "bg-green-500",
  eng: "bg-orange-500",
  cs: "bg-cyan-500",
  eco: "bg-amber-500",
  hin: "bg-red-500",
  jee_phy: "bg-blue-500",
  jee_mat: "bg-purple-500",
  jee_che: "bg-emerald-500",
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case "ahead":
      return { 
        icon: TrendingUp, 
        label: "Ahead", 
        color: "text-emerald-600 bg-emerald-50 border-emerald-200" 
      };
    case "on_track":
    case "in_progress":
      return { 
        icon: CheckCircle, 
        label: "On Track", 
        color: "text-blue-600 bg-blue-50 border-blue-200" 
      };
    case "lagging":
      return { 
        icon: TrendingDown, 
        label: "Lagging", 
        color: "text-amber-600 bg-amber-50 border-amber-200" 
      };
    case "critical":
      return { 
        icon: AlertTriangle, 
        label: "Critical", 
        color: "text-red-600 bg-red-50 border-red-200" 
      };
    default:
      return { 
        icon: Clock, 
        label: status, 
        color: "text-muted-foreground bg-muted" 
      };
  }
};

export function ProgressBatchCard({ batch }: ProgressBatchCardProps) {
  const navigate = useNavigate();
  const statusConfig = getStatusConfig(batch.status);
  const StatusIcon = statusConfig.icon;

  // Calculate total lost days
  const totalLostDays = batch.subjects.reduce((sum, s) => sum + s.lostDays, 0);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-4 pb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-base truncate">{batch.batchName}</h3>
              <p className="text-sm text-muted-foreground">{batch.className}</p>
            </div>
          </div>
          
          <Badge className={cn("gap-1.5 shrink-0", statusConfig.color)}>
            <StatusIcon className="w-3.5 h-3.5" />
            {statusConfig.label}
          </Badge>
        </div>

        {/* Overall Progress */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Overall Progress</span>
            <span className="text-lg font-bold">{batch.overallProgress}%</span>
          </div>
          <Progress value={batch.overallProgress} className="h-2.5" />
        </div>

        {/* Subject Breakdown */}
        <div className="px-4 pb-3">
          <div className="space-y-2">
            {batch.subjects.slice(0, 4).map((subject) => (
              <div key={subject.subjectId} className="flex items-center gap-3">
                {/* Subject Color Bar */}
                <div 
                  className={cn(
                    "w-1.5 h-6 rounded-full shrink-0",
                    SUBJECT_COLORS[subject.subjectId] || "bg-gray-400"
                  )}
                />
                
                {/* Subject Name & Progress */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{subject.subjectName}</span>
                    <span className="text-xs text-muted-foreground ml-2 shrink-0">
                      {subject.percentComplete}%
                    </span>
                  </div>
                  <Progress 
                    value={subject.percentComplete} 
                    className="h-1 mt-1" 
                  />
                </div>
              </div>
            ))}
            
            {batch.subjects.length > 4 && (
              <p className="text-xs text-muted-foreground pl-4">
                +{batch.subjects.length - 4} more subjects
              </p>
            )}
          </div>
        </div>

        {/* Footer with Lost Days & View Details */}
        <div className="px-4 py-3 bg-muted/30 border-t flex items-center justify-between">
          {totalLostDays > 0 ? (
            <div className="flex items-center gap-1.5 text-sm">
              <AlertTriangle className={cn(
                "w-4 h-4",
                totalLostDays > 5 ? "text-red-500" : "text-amber-500"
              )} />
              <span className="text-muted-foreground">
                {totalLostDays} lost day{totalLostDays > 1 ? "s" : ""}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-sm text-emerald-600">
              <CheckCircle className="w-4 h-4" />
              <span>No lost days</span>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 h-8"
            onClick={() => navigate(`/institute/academic-schedule/progress/${batch.batchId}`)}
          >
            Details
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

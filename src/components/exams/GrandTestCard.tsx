import { Eye, Edit, BarChart3, Users, Play, Award, Trash2, Clock, HelpCircle, FileText, Building2, Calendar, Sparkles, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GrandTest, examPatternConfig } from "@/data/examsData";
import { SubjectBadge } from "@/components/subject/SubjectBadge";
import { format } from "date-fns";

interface GrandTestCardProps {
  test: GrandTest;
  onView?: (test: GrandTest) => void;
  onEdit?: (test: GrandTest) => void;
  onStats?: (test: GrandTest) => void;
  onConduct?: (test: GrandTest) => void;
  onPublishRanks?: (test: GrandTest) => void;
  onDelete?: (test: GrandTest) => void;
}

const statusConfig = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  scheduled: { label: "Scheduled", className: "bg-warning/20 text-warning" },
  live: { label: "Live Now", className: "bg-destructive/20 text-destructive animate-pulse" },
  completed: { label: "Completed", className: "bg-success/20 text-success" },
};

const patternLabels = {
  jee_main: "JEE Main",
  jee_advanced: "JEE Advanced",
  neet: "NEET",
};

export const GrandTestCard = ({ 
  test, 
  onView, 
  onEdit, 
  onStats, 
  onConduct, 
  onPublishRanks,
  onDelete 
}: GrandTestCardProps) => {
  const status = statusConfig[test.status];
  const pattern = examPatternConfig[test.pattern];
  
  return (
    <div className="group relative bg-card rounded-xl border border-border/50 p-5 hover:shadow-lg hover:border-primary/20 transition-all duration-300">
      {/* Creation Method Badge */}
      <div className="absolute top-3 right-3">
        {test.creationMethod === "ai" ? (
          <div className="flex items-center gap-1 text-xs bg-donut-purple/10 text-donut-purple px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3" />
            <span>AI Generated</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs bg-donut-teal/10 text-donut-teal px-2 py-0.5 rounded-full">
            <FileUp className="w-3 h-3" />
            <span>PDF Import</span>
          </div>
        )}
      </div>
      
      {/* Header */}
      <div className="pr-24 mb-3">
        <h4 className="font-semibold text-foreground mb-1 line-clamp-2">{test.name}</h4>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {patternLabels[test.pattern]}
          </Badge>
          <Badge className={status.className}>{status.label}</Badge>
        </div>
      </div>
      
      {/* Stats Row */}
      <div className="flex flex-wrap items-center gap-3 mb-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{test.totalQuestions} Qs</span>
        </div>
        <div className="flex items-center gap-1">
          <FileText className="w-3.5 h-3.5" />
          <span>{test.totalMarks} Marks</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{test.duration} min</span>
        </div>
      </div>
      
      {/* Subjects */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {test.subjects.map((subject) => (
          <SubjectBadge key={subject} subject={subject} size="sm" />
        ))}
      </div>
      
      {/* Status-specific Information */}
      <div className="mb-3 space-y-1.5">
        {/* Sharing Config */}
        {test.status !== "completed" && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Building2 className="w-3.5 h-3.5" />
            <span>
              {test.sharingConfig === "none" && "Not configured for sharing"}
              {test.sharingConfig === "all" && "Shared with all institutes"}
              {test.sharingConfig === "selected" && `Shared with ${test.sharedInstitutes?.length || 0} institutes`}
            </span>
          </div>
        )}
        
        {/* Scheduled Date */}
        {test.status === "scheduled" && test.scheduledDate && (
          <div className="flex items-center gap-1.5 text-xs text-warning">
            <Calendar className="w-3.5 h-3.5" />
            <span>Scheduled for {format(new Date(test.scheduledDate), "dd MMM yyyy")}</span>
          </div>
        )}
        
        {/* Completed Info */}
        {test.status === "completed" && (
          <>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>Completed on {format(new Date(test.completedDate!), "dd MMM yyyy")}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              <span>{test.participantCount?.toLocaleString()} participants</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Award className="w-3.5 h-3.5" />
              <span className={test.ranksPublished ? "text-success" : "text-warning"}>
                {test.ranksPublished ? "Ranks Published" : "Ranks Pending"}
              </span>
            </div>
          </>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-1 pt-3 border-t border-border/50">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 text-xs px-2"
          onClick={() => onView?.(test)}
        >
          <Eye className="w-3.5 h-3.5 mr-1" />
          View
        </Button>
        
        {test.status === "draft" && (
          <>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs px-2"
              onClick={() => onEdit?.(test)}
            >
              <Edit className="w-3.5 h-3.5 mr-1" />
              Edit
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs px-2 text-destructive hover:text-destructive"
              onClick={() => onDelete?.(test)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </>
        )}
        
        {test.status === "scheduled" && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-xs px-2"
            onClick={() => onEdit?.(test)}
          >
            <Edit className="w-3.5 h-3.5 mr-1" />
            Edit
          </Button>
        )}
        
        {test.status === "completed" && (
          <>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs px-2"
              onClick={() => onStats?.(test)}
            >
              <BarChart3 className="w-3.5 h-3.5 mr-1" />
              Stats
            </Button>
            {!test.ranksPublished && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs px-2 text-primary hover:text-primary"
                onClick={() => onPublishRanks?.(test)}
              >
                <Award className="w-3.5 h-3.5 mr-1" />
                Publish Ranks
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

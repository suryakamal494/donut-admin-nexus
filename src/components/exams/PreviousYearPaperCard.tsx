import { Eye, Edit, BarChart3, Award, Percent, Clock, HelpCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PreviousYearPaper, examTypeLabels } from "@/data/examsData";
import { SubjectBadge } from "@/components/subject/SubjectBadge";

interface PreviousYearPaperCardProps {
  paper: PreviousYearPaper;
  onView?: (paper: PreviousYearPaper) => void;
  onEdit?: (paper: PreviousYearPaper) => void;
  onStats?: (paper: PreviousYearPaper) => void;
}

const statusConfig = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  processing: { label: "Processing", className: "bg-warning/20 text-warning" },
  review: { label: "Review", className: "bg-donut-purple/20 text-donut-purple" },
  published: { label: "Published", className: "bg-success/20 text-success" },
};

export const PreviousYearPaperCard = ({ paper, onView, onEdit, onStats }: PreviousYearPaperCardProps) => {
  const status = statusConfig[paper.status];
  
  return (
    <div className="group relative bg-card rounded-xl border border-border/50 p-4 hover:shadow-lg hover:border-primary/20 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-primary shrink-0" />
            <h4 className="font-semibold text-foreground truncate">{paper.name}</h4>
          </div>
          {paper.session && (
            <p className="text-xs text-muted-foreground">{paper.session} Session</p>
          )}
        </div>
        <Badge className={status.className}>{status.label}</Badge>
      </div>
      
      {/* Stats Row */}
      <div className="flex flex-wrap items-center gap-3 mb-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{paper.totalQuestions} Qs</span>
        </div>
        <div className="flex items-center gap-1">
          <FileText className="w-3.5 h-3.5" />
          <span>{paper.totalMarks} Marks</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{paper.duration} min</span>
        </div>
      </div>
      
      {/* Subjects */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {paper.subjects.map((subject) => (
          <SubjectBadge key={subject} subject={subject} size="sm" />
        ))}
      </div>
      
      {/* Rank/Percentile Indicators */}
      {paper.status === "published" && (paper.rankEnabled || paper.percentileEnabled) && (
        <div className="flex items-center gap-2 mb-3">
          {paper.rankEnabled && (
            <div className="flex items-center gap-1 text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">
              <Award className="w-3 h-3" />
              <span>Rank</span>
            </div>
          )}
          {paper.percentileEnabled && (
            <div className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              <Percent className="w-3 h-3" />
              <span>Percentile</span>
            </div>
          )}
        </div>
      )}
      
      {/* Actions */}
      <div className="flex items-center gap-1 pt-2 border-t border-border/50">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex-1 h-8 text-xs"
          onClick={() => onView?.(paper)}
        >
          <Eye className="w-3.5 h-3.5 mr-1" />
          View
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex-1 h-8 text-xs"
          onClick={() => onEdit?.(paper)}
        >
          <Edit className="w-3.5 h-3.5 mr-1" />
          Edit
        </Button>
        {paper.status === "published" && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 h-8 text-xs"
            onClick={() => onStats?.(paper)}
          >
            <BarChart3 className="w-3.5 h-3.5 mr-1" />
            Stats
          </Button>
        )}
      </div>
    </div>
  );
};

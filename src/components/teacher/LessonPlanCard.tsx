import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Play, 
  HelpCircle, 
  ClipboardList,
  Clock,
  Calendar,
  Users,
  MoreVertical,
  Copy,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { type LessonPlan } from "@/data/teacherData";

interface LessonPlanCardProps {
  plan: LessonPlan;
  onClone?: (plan: LessonPlan) => void;
  onDelete?: (plan: LessonPlan) => void;
}

const blockTypeIcons = {
  explain: BookOpen,
  demonstrate: Play,
  quiz: HelpCircle,
  homework: ClipboardList,
};

const blockTypeColors = {
  explain: "text-[hsl(var(--donut-coral))] bg-[hsl(var(--donut-coral))]/10",
  demonstrate: "text-[hsl(var(--donut-orange))] bg-[hsl(var(--donut-orange))]/10",
  quiz: "text-[hsl(var(--donut-pink))] bg-[hsl(var(--donut-pink))]/10",
  homework: "text-purple-600 bg-purple-50",
};

export const LessonPlanCard = ({ plan, onClone, onDelete }: LessonPlanCardProps) => {
  const navigate = useNavigate();

  // Calculate block counts by type
  const blockCounts = plan.blocks.reduce((acc, block) => {
    const type = block.type as keyof typeof blockTypeIcons;
    if (type in blockTypeIcons) {
      acc[type] = (acc[type] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Get total duration
  const totalDuration = plan.blocks.reduce((sum, block) => sum + (block.duration || 0), 0);

  // Get status config
  const getStatusConfig = (status: LessonPlan["status"]) => {
    switch (status) {
      case "draft":
        return { 
          label: "Draft", 
          className: "bg-amber-50 text-amber-700 border-amber-200" 
        };
      case "ready":
        return { 
          label: "Ready", 
          className: "bg-emerald-50 text-emerald-700 border-emerald-200" 
        };
      case "used":
        return { 
          label: "Used", 
          className: "bg-blue-50 text-blue-700 border-blue-200",
          icon: CheckCircle2
        };
      default:
        return { label: status, className: "bg-muted text-muted-foreground" };
    }
  };

  const statusConfig = getStatusConfig(plan.status);
  const StatusIcon = statusConfig.icon;

  const handleViewPlan = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/teacher/lesson-plans/${plan.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/teacher/lesson-plans/${plan.id}`);
  };

  const handleClone = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClone?.(plan);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(plan);
  };

  return (
    <Card 
      className="card-premium group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={handleViewPlan}
    >
      <CardContent className="p-0">
        {/* Header with Status and Actions */}
        <div className="flex items-center justify-between p-3 pb-0">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("text-[10px] font-medium", statusConfig.className)}>
              {StatusIcon && <StatusIcon className="w-3 h-3 mr-1" />}
              {statusConfig.label}
            </Badge>
            {plan.usedDate && (
              <span className="text-[10px] text-muted-foreground">
                • Used {new Date(plan.usedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleClone}>
                <Copy className="w-4 h-4 mr-2" />
                Clone
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Main Content */}
        <div className="p-3 pt-2">
          {/* Chapter Badge */}
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-[10px] bg-muted/50 font-normal">
              📚 {plan.chapter}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-foreground text-sm line-clamp-1 mb-1.5">
            {plan.title}
          </h3>

          {/* Topics */}
          <div className="space-y-1 mb-3">
            {plan.topics?.slice(0, 2).map((topic, idx) => (
              <p key={idx} className="text-xs text-muted-foreground line-clamp-1 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                {topic}
              </p>
            ))}
            {plan.topics && plan.topics.length > 2 && (
              <p className="text-[10px] text-muted-foreground">
                +{plan.topics.length - 2} more topics
              </p>
            )}
          </div>

          {/* Block Type Summary */}
          <div className="flex items-center gap-1.5 mb-3">
            {Object.entries(blockCounts).map(([type, count]) => {
              const Icon = blockTypeIcons[type as keyof typeof blockTypeIcons];
              const colorClass = blockTypeColors[type as keyof typeof blockTypeColors];
              if (!Icon) return null;
              
              return (
                <div 
                  key={type}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium",
                    colorClass
                  )}
                >
                  <Icon className="w-3 h-3" />
                  <span>{count}</span>
                </div>
              );
            })}
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground border-t border-border/50 pt-2.5">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {plan.batchName}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {totalDuration || plan.totalDuration}m
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(plan.scheduledDate).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>

        {/* Footer with View Button */}
        <div className="px-3 pb-3 pt-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full h-8 text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
            onClick={handleViewPlan}
          >
            <Eye className="w-3 h-3 mr-1.5" />
            View Plan
            <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

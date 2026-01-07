import { useState } from "react";
import { 
  GripVertical, 
  Trash2, 
  Sparkles, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Lightbulb,
  MonitorPlay,
  MessageCircleQuestion,
  CheckSquare,
  PenLine,
  Home
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LessonPlanBlock } from "@/data/teacherData";

interface LessonBlockCardProps {
  block: LessonPlanBlock;
  index: number;
  onUpdate: (block: LessonPlanBlock) => void;
  onDelete: () => void;
  onAIGenerate: (blockId: string, type: string) => void;
  isGenerating?: boolean;
}

const blockTypeConfig = {
  explain: {
    icon: Lightbulb,
    label: "Explain",
    color: "bg-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description: "Teach a concept or introduce new material"
  },
  demonstrate: {
    icon: MonitorPlay,
    label: "Demonstrate",
    color: "bg-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    description: "Show a practical example or demonstration"
  },
  ask: {
    icon: MessageCircleQuestion,
    label: "Ask",
    color: "bg-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    description: "Facilitate discussion or ask questions"
  },
  check: {
    icon: CheckSquare,
    label: "Check",
    color: "bg-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    description: "Quick quiz or understanding check"
  },
  practice: {
    icon: PenLine,
    label: "Practice",
    color: "bg-primary",
    bgColor: "bg-primary/5",
    borderColor: "border-primary/20",
    description: "Hands-on practice or problem solving"
  },
  homework: {
    icon: Home,
    label: "Homework",
    color: "bg-slate-500",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    description: "Assignment for students to complete at home"
  },
};

export const LessonBlockCard = ({
  block,
  index,
  onUpdate,
  onDelete,
  onAIGenerate,
  isGenerating,
}: LessonBlockCardProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const config = blockTypeConfig[block.type];
  const Icon = config.icon;

  return (
    <Card className={cn(
      "transition-all duration-200 group",
      config.bgColor,
      config.borderColor,
      "border-2"
    )}>
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center gap-3 p-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center gap-2 cursor-grab active:cursor-grabbing opacity-50 group-hover:opacity-100">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground w-5">{index + 1}</span>
          </div>
          
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", config.color)}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {config.label}
              </Badge>
              {block.aiGenerated && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-0">
                  <Sparkles className="w-2.5 h-2.5 mr-0.5" />
                  AI
                </Badge>
              )}
            </div>
            <h4 className="font-medium text-sm text-foreground truncate mt-0.5">
              {block.title || "Untitled block"}
            </h4>
          </div>
          
          {block.duration && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {block.duration}m
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-50 group-hover:opacity-100"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        {/* Expanded Content */}
        {isExpanded && (
          <div className="px-3 pb-3 pt-1 border-t border-border/50">
            <div className="space-y-3">
              {/* Title Input */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Title</label>
                <Input
                  value={block.title}
                  onChange={(e) => onUpdate({ ...block, title: e.target.value })}
                  placeholder="What's this block about?"
                  className="h-9 text-sm bg-white/80"
                />
              </div>
              
              {/* Content Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-muted-foreground">Content / Notes</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-primary hover:text-primary"
                    onClick={() => onAIGenerate(block.id, block.type)}
                    disabled={isGenerating}
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    {isGenerating ? "Generating..." : "AI Suggest"}
                  </Button>
                </div>
                <Textarea
                  value={block.content || ""}
                  onChange={(e) => onUpdate({ ...block, content: e.target.value })}
                  placeholder={config.description}
                  className="min-h-[80px] text-sm bg-white/80 resize-none"
                />
              </div>
              
              {/* Duration */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Duration (minutes)</label>
                  <Input
                    type="number"
                    value={block.duration || ""}
                    onChange={(e) => onUpdate({ ...block, duration: parseInt(e.target.value) || undefined })}
                    placeholder="10"
                    className="h-9 text-sm bg-white/80 w-24"
                    min={1}
                    max={60}
                  />
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-5"
                  onClick={onDelete}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export type BlockType = keyof typeof blockTypeConfig;
export { blockTypeConfig };

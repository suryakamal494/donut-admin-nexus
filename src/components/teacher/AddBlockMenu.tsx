import { 
  Plus,
  Lightbulb,
  MonitorPlay,
  MessageCircleQuestion,
  CheckSquare,
  PenLine,
  Home,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { LessonPlanBlock } from "@/data/teacherData";

interface AddBlockMenuProps {
  onAddBlock: (type: LessonPlanBlock["type"]) => void;
  onAIGeneratePlan?: () => void;
}

const blockOptions: { type: LessonPlanBlock["type"]; icon: React.ElementType; label: string; description: string; color: string }[] = [
  {
    type: "explain",
    icon: Lightbulb,
    label: "Explain",
    description: "Teach a concept",
    color: "text-blue-500"
  },
  {
    type: "demonstrate",
    icon: MonitorPlay,
    label: "Demonstrate",
    description: "Show an example",
    color: "text-purple-500"
  },
  {
    type: "ask",
    icon: MessageCircleQuestion,
    label: "Ask",
    description: "Discussion / Q&A",
    color: "text-amber-500"
  },
  {
    type: "check",
    icon: CheckSquare,
    label: "Check",
    description: "Quick quiz",
    color: "text-green-500"
  },
  {
    type: "practice",
    icon: PenLine,
    label: "Practice",
    description: "Problems to solve",
    color: "text-primary"
  },
  {
    type: "homework",
    icon: Home,
    label: "Homework",
    description: "Take-home assignment",
    color: "text-slate-500"
  },
];

export const AddBlockMenu = ({ onAddBlock, onAIGeneratePlan }: AddBlockMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 border-dashed border-2 h-12 w-full hover:border-primary hover:bg-primary/5">
          <Plus className="w-4 h-4" />
          Add Teaching Block
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-64">
        {blockOptions.map((option) => {
          const Icon = option.icon;
          return (
            <DropdownMenuItem
              key={option.type}
              onClick={() => onAddBlock(option.type)}
              className="flex items-center gap-3 py-2.5 cursor-pointer"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${option.color} bg-current/10`}>
                <Icon className={`w-4 h-4 ${option.color}`} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </div>
            </DropdownMenuItem>
          );
        })}
        
        {onAIGeneratePlan && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onAIGeneratePlan}
              className="flex items-center gap-3 py-2.5 cursor-pointer bg-primary/5"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center gradient-button">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm gradient-text">AI Generate Plan</p>
                <p className="text-xs text-muted-foreground">Create full lesson with AI</p>
              </div>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

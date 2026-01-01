import { 
  CircleDot, 
  CheckSquare, 
  Calculator, 
  Scale, 
  FileText, 
  Grid3X3, 
  TextCursor, 
  ToggleLeft, 
  MessageSquare, 
  FileEdit,
  LucideIcon 
} from "lucide-react";
import { QuestionType } from "@/data/questionsData";
import { cn } from "@/lib/utils";

const iconMap: Record<QuestionType, LucideIcon> = {
  mcq_single: CircleDot,
  mcq_multiple: CheckSquare,
  numerical: Calculator,
  assertion_reasoning: Scale,
  paragraph: FileText,
  matrix_match: Grid3X3,
  fill_blanks: TextCursor,
  true_false: ToggleLeft,
  short_answer: MessageSquare,
  long_answer: FileEdit,
};

interface QuestionTypeIconProps {
  type: QuestionType;
  className?: string;
  size?: number;
}

export const QuestionTypeIcon = ({ type, className, size = 16 }: QuestionTypeIconProps) => {
  const Icon = iconMap[type];
  return <Icon className={cn("shrink-0", className)} size={size} />;
};

import { useRef, memo, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { 
  Question, 
  difficultyConfig,
  cognitiveTypeConfig,
  getCognitiveTypeForQuestion 
} from "@/data/questionsData";
import { QUESTION_BANK_CONFIG } from "./constants";

interface VirtualizedQuestionListProps {
  questions: Question[];
  selectedQuestionIds: string[];
  onToggleQuestion: (questionId: string) => void;
  onPreviewQuestion: (question: Question, e: React.MouseEvent) => void;
}

// Memoized Question Card for better performance
const QuestionCardMemo = memo(({ 
  question, 
  isSelected, 
  onToggle, 
  onPreview 
}: { 
  question: Question; 
  isSelected: boolean;
  onToggle: () => void;
  onPreview: (e: React.MouseEvent) => void;
}) => {
  const cogType = getCognitiveTypeForQuestion(question);
  
  return (
    <div
      onClick={onToggle}
      className={cn(
        "p-3 rounded-xl border-2 transition-all cursor-pointer",
        "active:scale-[0.99]",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 bg-card"
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggle}
          className="mt-0.5"
        />
        <div className="flex-1 min-w-0">
          {/* Badges */}
          <div className="flex gap-1.5 flex-wrap mb-2">
            <Badge variant="outline" className={cn("text-[10px] h-5", difficultyConfig[question.difficulty].className)}>
              {question.difficulty}
            </Badge>
            <Badge variant="outline" className={cn("text-[10px] h-5", cognitiveTypeConfig[cogType].className)}>
              {cognitiveTypeConfig[cogType].label}
            </Badge>
          </div>
          
          {/* Question text */}
          <p className="text-sm line-clamp-2 mb-1.5">{question.questionText}</p>
          
          {/* Meta */}
          <p className="text-xs text-muted-foreground">
            {question.chapter} • {question.topic}
          </p>
        </div>
        
        {/* Preview button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onPreview}
        >
          <Eye className="w-4 h-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
});

QuestionCardMemo.displayName = "QuestionCardMemo";

export const VirtualizedQuestionList = ({
  questions,
  selectedQuestionIds,
  onToggleQuestion,
  onPreviewQuestion,
}: VirtualizedQuestionListProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: questions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => QUESTION_BANK_CONFIG.ESTIMATED_ITEM_HEIGHT,
    overscan: QUESTION_BANK_CONFIG.OVERSCAN,
  });

  const handleToggle = useCallback((questionId: string) => () => {
    onToggleQuestion(questionId);
  }, [onToggleQuestion]);

  const handlePreview = useCallback((question: Question) => (e: React.MouseEvent) => {
    onPreviewQuestion(question, e);
  }, [onPreviewQuestion]);

  if (questions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No questions found</p>
        <p className="text-sm">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div 
      ref={parentRef} 
      className="h-full overflow-auto"
      style={{ contain: "strict" }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const question = questions[virtualItem.index];
          const isSelected = selectedQuestionIds.includes(question.id);
          
          return (
            <div
              key={virtualItem.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
              className="p-1"
            >
              <QuestionCardMemo
                question={question}
                isSelected={isSelected}
                onToggle={handleToggle(question.id)}
                onPreview={handlePreview(question)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

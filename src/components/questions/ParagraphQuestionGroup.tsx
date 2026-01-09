import { useState } from "react";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QuestionCard, QuestionCardMode, QuestionWithSource } from "./QuestionCard";
import { SubjectBadge } from "@/components/subject/SubjectBadge";
import { Question, difficultyConfig } from "@/data/questionsData";
import { cn } from "@/lib/utils";

interface ParagraphQuestionGroupProps {
  paragraphId: string;
  paragraphText: string;
  questions: (Question | QuestionWithSource)[];
  mode?: QuestionCardMode;
  onViewQuestion?: (question: Question | QuestionWithSource) => void;
  onEditQuestion?: (question: Question | QuestionWithSource) => void;
  onDeleteQuestion?: (question: Question | QuestionWithSource) => void;
}

export const ParagraphQuestionGroup = ({
  paragraphId,
  paragraphText,
  questions,
  mode = "superadmin",
  onViewQuestion,
  onEditQuestion,
  onDeleteQuestion,
}: ParagraphQuestionGroupProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Get representative data from first question
  const firstQuestion = questions[0];
  if (!firstQuestion) return null;

  // Calculate difficulty distribution
  const difficultyCount = questions.reduce((acc, q) => {
    acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate total marks
  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

  // Determine if paragraph needs scrolling (rough heuristic: > 500 chars)
  const needsScrolling = paragraphText.length > 500;

  return (
    <div className="bg-card rounded-2xl shadow-soft border border-border/50 overflow-hidden">
      {/* Paragraph Header */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-4 sm:p-5 border-b border-border/30">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm sm:text-base">Paragraph-Based Questions</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{questions.length} questions linked • Single Choice</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <SubjectBadge subject={firstQuestion.subjectId} size="sm" />
            <Badge variant="outline" className="bg-background text-xs">
              +{totalMarks} marks
            </Badge>
          </div>
        </div>

        {/* Difficulty Distribution */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {Object.entries(difficultyCount).map(([difficulty, count]) => (
            <Badge 
              key={difficulty} 
              variant="outline" 
              className={cn(
                "text-xs",
                difficultyConfig[difficulty as keyof typeof difficultyConfig]?.className
              )}
            >
              {count} {difficultyConfig[difficulty as keyof typeof difficultyConfig]?.label}
            </Badge>
          ))}
        </div>

        {/* Paragraph Text - Scrollable for long content */}
        <div className="bg-background/80 rounded-xl border border-border/30">
          {needsScrolling ? (
            <ScrollArea className="h-[200px] w-full">
              <div className="p-3 sm:p-4">
                <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
                  {paragraphText}
                </p>
              </div>
            </ScrollArea>
          ) : (
            <div className="p-3 sm:p-4">
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
                {paragraphText}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Questions List */}
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full justify-between rounded-none border-b border-border/30 h-12"
          >
            <span className="text-sm font-medium">
              {isExpanded ? "Hide Questions" : "Show Questions"}
            </span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-3 sm:p-4 space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="relative">
                {/* Question Number Badge */}
                <div className="absolute -left-1 sm:-left-2 -top-2 z-10">
                  <Badge className="rounded-full w-6 h-6 p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs">
                    {index + 1}
                  </Badge>
                </div>
                <QuestionCard
                  question={question as QuestionWithSource}
                  mode={mode}
                  onView={onViewQuestion}
                  onEdit={onEditQuestion}
                  onDelete={onDeleteQuestion}
                  showParagraphBadge={false}
                />
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

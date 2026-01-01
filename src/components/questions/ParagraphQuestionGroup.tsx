import { useState } from "react";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { QuestionCard } from "./QuestionCard";
import { SubjectBadge } from "@/components/subject/SubjectBadge";
import { Question, difficultyConfig } from "@/data/questionsData";
import { cn } from "@/lib/utils";

interface ParagraphQuestionGroupProps {
  paragraphId: string;
  paragraphText: string;
  questions: Question[];
  onViewQuestion?: (question: Question) => void;
  onEditQuestion?: (question: Question) => void;
  onDeleteQuestion?: (question: Question) => void;
}

export const ParagraphQuestionGroup = ({
  paragraphId,
  paragraphText,
  questions,
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

  return (
    <div className="bg-card rounded-2xl shadow-soft border border-border/50 overflow-hidden">
      {/* Paragraph Header */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-5 border-b border-border/30">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Paragraph-Based Questions</h3>
              <p className="text-sm text-muted-foreground">{questions.length} questions linked</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SubjectBadge subjectId={firstQuestion.subjectId} size="sm" />
            <Badge variant="outline" className="bg-background">
              +{totalMarks} marks
            </Badge>
          </div>
        </div>

        {/* Difficulty Distribution */}
        <div className="flex items-center gap-2 mb-4">
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

        {/* Paragraph Text */}
        <div className="bg-background/80 rounded-xl p-4 border border-border/30">
          <p className="text-sm leading-relaxed text-foreground">
            {paragraphText}
          </p>
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
          <div className="p-4 space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="relative">
                {/* Question Number Badge */}
                <div className="absolute -left-2 -top-2 z-10">
                  <Badge className="rounded-full w-6 h-6 p-0 flex items-center justify-center bg-primary text-primary-foreground">
                    {index + 1}
                  </Badge>
                </div>
                <QuestionCard
                  question={question}
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

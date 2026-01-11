// Question Display Component
// Renders question content with type-specific interactive renderers
// Mobile-first with proper answer state management

import { memo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { TestQuestion } from "@/data/student/testQuestions";
import { questionTypeLabels } from "@/data/student/testQuestions";
import {
  MCQSingleRenderer,
  MCQMultipleRenderer,
  IntegerRenderer,
  FillBlankRenderer,
  MatrixMatchRenderer,
  AssertionReasoningRenderer,
  ParagraphRenderer,
  ShortAnswerRenderer,
  LongAnswerRenderer,
} from "../renderers";

// Answer types for different question types
export type AnswerValue =
  | string // MCQ Single, Assertion-Reasoning, Paragraph
  | string[] // MCQ Multiple
  | number // Integer
  | Record<string, string>; // Fill Blank, Matrix Match

interface QuestionDisplayProps {
  question: TestQuestion;
  questionNumber: number;
  totalQuestions: number;
  answer?: AnswerValue;
  onAnswerChange: (questionId: string, answer: AnswerValue) => void;
  className?: string;
}

const difficultyColors = {
  easy: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-red-100 text-red-700",
};

const QuestionDisplay = memo(function QuestionDisplay({
  question,
  questionNumber,
  totalQuestions,
  answer,
  onAnswerChange,
  className,
}: QuestionDisplayProps) {
  // Type-safe answer handlers
  const handleSingleSelect = useCallback(
    (optionId: string) => {
      onAnswerChange(question.id, optionId);
    },
    [question.id, onAnswerChange]
  );

  const handleMultipleToggle = useCallback(
    (optionId: string) => {
      const currentSelection = (answer as string[]) || [];
      const newSelection = currentSelection.includes(optionId)
        ? currentSelection.filter((id) => id !== optionId)
        : [...currentSelection, optionId];
      onAnswerChange(question.id, newSelection);
    },
    [question.id, answer, onAnswerChange]
  );

  const handleIntegerChange = useCallback(
    (value: number | undefined) => {
      onAnswerChange(question.id, value as any);
    },
    [question.id, onAnswerChange]
  );

  const handleFillBlankChange = useCallback(
    (blankId: string, value: string) => {
      const currentAnswers = (answer as Record<string, string>) || {};
      onAnswerChange(question.id, { ...currentAnswers, [blankId]: value });
    },
    [question.id, answer, onAnswerChange]
  );

  const handleMatrixChange = useCallback(
    (rowId: string, columnId: string) => {
      const currentMatches = (answer as Record<string, string>) || {};
      onAnswerChange(question.id, { ...currentMatches, [rowId]: columnId });
    },
    [question.id, answer, onAnswerChange]
  );

  const handleTextChange = useCallback(
    (value: string) => {
      onAnswerChange(question.id, value);
    },
    [question.id, onAnswerChange]
  );

  // Render the appropriate question type renderer
  const renderQuestionType = () => {
    switch (question.type) {
      case "mcq_single":
        return (
          <MCQSingleRenderer
            options={question.options}
            selectedOption={answer as string | undefined}
            onSelect={handleSingleSelect}
          />
        );

      case "mcq_multiple":
        return (
          <MCQMultipleRenderer
            options={question.options}
            selectedOptions={(answer as string[]) || []}
            onToggle={handleMultipleToggle}
          />
        );

      case "integer":
        return (
          <IntegerRenderer
            value={answer as number | undefined}
            onChange={handleIntegerChange}
            minValue={question.minValue}
            maxValue={question.maxValue}
          />
        );

      case "fill_blank":
        return (
          <FillBlankRenderer
            blanks={question.blanks}
            answers={(answer as Record<string, string>) || {}}
            onChange={handleFillBlankChange}
          />
        );

      case "matrix_match":
        return (
          <MatrixMatchRenderer
            rows={question.rows}
            columns={question.columns}
            matches={(answer as Record<string, string>) || {}}
            onChange={handleMatrixChange}
          />
        );

      case "assertion_reasoning":
        return (
          <AssertionReasoningRenderer
            assertion={question.assertion}
            reason={question.reason}
            options={question.options}
            selectedOption={answer as string | undefined}
            onSelect={handleSingleSelect}
          />
        );

      case "paragraph":
        return (
          <ParagraphRenderer
            paragraphText={question.paragraphText}
            questionText={question.text}
            options={question.options || []}
            selectedOption={answer as string | undefined}
            onSelect={handleSingleSelect}
          />
        );

      case "short_answer":
        return (
          <ShortAnswerRenderer
            value={(answer as string) || ""}
            onChange={handleTextChange}
            wordLimit={question.wordLimit}
          />
        );

      case "long_answer":
        return (
          <LongAnswerRenderer
            value={(answer as string) || ""}
            onChange={handleTextChange}
            wordLimit={question.wordLimit}
          />
        );

      default:
        return (
          <div className="p-4 bg-muted rounded-lg text-center text-muted-foreground">
            Unsupported question type
          </div>
        );
    }
  };

  return (
    <div className={cn("flex-1 overflow-y-auto", className)}>
      <div className="p-4 sm:p-6 max-w-3xl mx-auto">
        {/* Question Header */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {/* Question Number */}
          <span className="text-sm font-semibold text-muted-foreground">
            Q.{questionNumber}
            <span className="text-muted-foreground/60"> / {totalQuestions}</span>
          </span>

          {/* Question Type Badge */}
          <Badge variant="outline" className="text-xs">
            {questionTypeLabels[question.type]}
          </Badge>

          {/* Difficulty */}
          {question.difficulty && (
            <Badge
              className={cn(
                "text-xs capitalize",
                difficultyColors[question.difficulty]
              )}
            >
              {question.difficulty}
            </Badge>
          )}

          {/* Marks */}
          <span className="ml-auto text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">+{question.marks}</span>
            {question.negativeMarks && (
              <span className="text-red-500 ml-1">-{question.negativeMarks}</span>
            )}
          </span>
        </div>

        {/* Question Text (except for paragraph and assertion types which handle their own) */}
        {question.type !== "paragraph" && question.type !== "assertion_reasoning" && (
          <div className="mb-6">
            <p className="text-foreground text-base sm:text-lg leading-relaxed">
              {question.text}
            </p>

            {/* Question Image (if any) */}
            {question.imageUrl && (
              <div className="mt-4 rounded-lg overflow-hidden border border-border">
                <img
                  src={question.imageUrl}
                  alt="Question diagram"
                  className="w-full max-w-md mx-auto"
                />
              </div>
            )}
          </div>
        )}

        {/* Type-Specific Renderer */}
        {renderQuestionType()}
      </div>
    </div>
  );
});

export default QuestionDisplay;

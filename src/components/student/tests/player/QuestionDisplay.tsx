// Question Display Component
// Renders question content with proper mobile spacing
// Supports all question types (Phase 3 will add type-specific renderers)

import { memo } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { TestQuestion } from "@/data/student/testQuestions";
import { questionTypeLabels } from "@/data/student/testQuestions";

interface QuestionDisplayProps {
  question: TestQuestion;
  questionNumber: number;
  totalQuestions: number;
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
  className,
}: QuestionDisplayProps) {
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

        {/* Question Text */}
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

        {/* Assertion-Reasoning Special Display */}
        {question.type === "assertion_reasoning" && (
          <div className="space-y-3 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-blue-600 mb-1">Assertion (A):</p>
              <p className="text-sm text-foreground">{question.assertion}</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-purple-600 mb-1">Reason (R):</p>
              <p className="text-sm text-foreground">{question.reason}</p>
            </div>
          </div>
        )}

        {/* Paragraph-based Special Display */}
        {question.type === "paragraph" && (
          <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6">
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              Read the following passage:
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {question.paragraphText}
            </p>
          </div>
        )}

        {/* Options for MCQ Types */}
        {(question.type === "mcq_single" ||
          question.type === "mcq_multiple" ||
          question.type === "assertion_reasoning" ||
          question.type === "paragraph") &&
          "options" in question &&
          question.options && (
            <div className="space-y-2.5">
              {question.type === "mcq_multiple" && (
                <p className="text-xs text-muted-foreground mb-3">
                  (Select one or more options)
                </p>
              )}
              {question.options.map((option, index) => (
                <button
                  key={option.id}
                  className={cn(
                    "w-full flex items-start gap-3 p-3 sm:p-4 rounded-xl border-2 text-left",
                    "transition-all duration-200",
                    "border-border hover:border-primary/50 hover:bg-primary/5",
                    "active:scale-[0.98]"
                  )}
                >
                  {/* Option Letter */}
                  <span
                    className={cn(
                      "shrink-0 w-7 h-7 rounded-full flex items-center justify-center",
                      "text-xs font-bold border-2 border-current",
                      "text-muted-foreground"
                    )}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>

                  {/* Option Text */}
                  <span className="text-sm sm:text-base text-foreground pt-0.5">
                    {option.text}
                  </span>
                </button>
              ))}
            </div>
          )}

        {/* Integer/Numerical Input */}
        {question.type === "integer" && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Enter your answer (numerical value only):
            </p>
            <input
              type="number"
              placeholder="Enter answer"
              className={cn(
                "w-full max-w-xs px-4 py-3 rounded-xl border-2 border-border",
                "text-lg font-mono focus:border-primary focus:outline-none",
                "transition-colors"
              )}
            />
            {"minValue" in question && "maxValue" in question && (
              <p className="text-xs text-muted-foreground">
                (Range: {question.minValue} to {question.maxValue})
              </p>
            )}
          </div>
        )}

        {/* Fill in the Blanks */}
        {question.type === "fill_blank" && "blanks" in question && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Fill in the blanks:
            </p>
            <div className="space-y-2">
              {question.blanks.map((blank, index) => (
                <div key={blank.id} className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Blank {index + 1}:
                  </span>
                  <input
                    type="text"
                    placeholder={`Answer ${index + 1}`}
                    className={cn(
                      "flex-1 max-w-xs px-3 py-2 rounded-lg border-2 border-border",
                      "text-sm focus:border-primary focus:outline-none"
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Matrix Match */}
        {question.type === "matrix_match" && "rows" in question && "columns" in question && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[320px] text-sm">
              <thead>
                <tr>
                  <th className="p-2 text-left font-medium text-muted-foreground">
                    Column I
                  </th>
                  {question.columns.map((col) => (
                    <th
                      key={col.id}
                      className="p-2 text-center font-medium text-muted-foreground"
                    >
                      {col.text}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {question.rows.map((row) => (
                  <tr key={row.id} className="border-t border-border">
                    <td className="p-2 text-foreground">{row.text}</td>
                    {question.columns.map((col) => (
                      <td key={col.id} className="p-2 text-center">
                        <input
                          type="radio"
                          name={`match-${row.id}`}
                          className="w-4 h-4 accent-primary"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Short Answer */}
        {question.type === "short_answer" && (
          <div className="space-y-3">
            <textarea
              placeholder="Type your answer here..."
              rows={4}
              className={cn(
                "w-full px-4 py-3 rounded-xl border-2 border-border",
                "text-sm focus:border-primary focus:outline-none resize-none"
              )}
            />
            {"wordLimit" in question && question.wordLimit && (
              <p className="text-xs text-muted-foreground text-right">
                Word limit: {question.wordLimit} words
              </p>
            )}
          </div>
        )}

        {/* Long Answer */}
        {question.type === "long_answer" && (
          <div className="space-y-3">
            <textarea
              placeholder="Type your detailed answer here..."
              rows={8}
              className={cn(
                "w-full px-4 py-3 rounded-xl border-2 border-border",
                "text-sm focus:border-primary focus:outline-none resize-none"
              )}
            />
            {"wordLimit" in question && question.wordLimit && (
              <p className="text-xs text-muted-foreground text-right">
                Word limit: {question.wordLimit} words
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default QuestionDisplay;

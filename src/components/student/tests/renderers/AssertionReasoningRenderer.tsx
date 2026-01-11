// Assertion-Reasoning Renderer
// Special MCQ with assertion and reason display

import { memo } from "react";
import { Check, AlertCircle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { QuestionOption } from "@/data/student/testQuestions";

interface AssertionReasoningRendererProps {
  assertion: string;
  reason: string;
  options: QuestionOption[];
  selectedOption?: string;
  onSelect: (optionId: string) => void;
  disabled?: boolean;
}

const AssertionReasoningRenderer = memo(function AssertionReasoningRenderer({
  assertion,
  reason,
  options,
  selectedOption,
  onSelect,
  disabled = false,
}: AssertionReasoningRendererProps) {
  return (
    <div className="space-y-4">
      {/* Assertion Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-blue-600 mb-1.5">
              Assertion (A)
            </p>
            <p className="text-sm text-foreground leading-relaxed">{assertion}</p>
          </div>
        </div>
      </div>

      {/* Reason Box */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-purple-600 mb-1.5">
              Reason (R)
            </p>
            <p className="text-sm text-foreground leading-relaxed">{reason}</p>
          </div>
        </div>
      </div>

      {/* Instruction */}
      <p className="text-xs text-muted-foreground text-center py-2">
        Choose the correct statement about the above assertion and reason:
      </p>

      {/* Options */}
      <div className="space-y-2.5">
        {options.map((option) => {
          const isSelected = selectedOption === option.id;

          return (
            <motion.button
              key={option.id}
              onClick={() => !disabled && onSelect(option.id)}
              disabled={disabled}
              whileTap={{ scale: disabled ? 1 : 0.98 }}
              className={cn(
                "w-full flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border-2 text-left",
                "transition-all duration-200 min-h-[52px]",
                "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
                isSelected
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/40 hover:bg-muted/50",
                disabled && "opacity-60 cursor-not-allowed"
              )}
            >
              {/* Radio Indicator */}
              <span
                className={cn(
                  "shrink-0 w-6 h-6 rounded-full flex items-center justify-center",
                  "transition-all duration-200 mt-0.5",
                  isSelected
                    ? "bg-primary"
                    : "border-2 border-muted-foreground/40"
                )}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
              </span>

              {/* Option Text */}
              <span
                className={cn(
                  "text-sm flex-1",
                  isSelected ? "text-foreground font-medium" : "text-foreground"
                )}
              >
                {option.text}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
});

export default AssertionReasoningRenderer;

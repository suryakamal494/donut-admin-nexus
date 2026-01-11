// MCQ Multiple Choice Renderer
// Checkbox-style selection with partial marking support
// Supports both text and image options

import { memo } from "react";
import { Check, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { QuestionOption } from "@/data/student/testQuestions";

interface MCQMultipleRendererProps {
  options: QuestionOption[];
  selectedOptions: string[];
  onToggle: (optionId: string) => void;
  disabled?: boolean;
}

const MCQMultipleRenderer = memo(function MCQMultipleRenderer({
  options,
  selectedOptions,
  onToggle,
  disabled = false,
}: MCQMultipleRendererProps) {
  return (
    <div className="space-y-2.5">
      {/* Instruction */}
      <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
        <CheckSquare className="w-3.5 h-3.5" />
        Select one or more options
      </p>

      {options.map((option, index) => {
        const isSelected = selectedOptions.includes(option.id);
        const optionLetter = String.fromCharCode(65 + index);
        const hasImage = !!option.imageUrl;

        return (
          <motion.button
            key={option.id}
            onClick={() => !disabled && onToggle(option.id)}
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
            {/* Checkbox Indicator */}
            <span
              className={cn(
                "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                "text-sm font-bold transition-all duration-200",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "border-2 border-muted-foreground/40 text-muted-foreground"
              )}
            >
              {isSelected ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-xs">{optionLetter}</span>
              )}
            </span>

            {/* Option Content */}
            <div className="flex-1 pt-1">
              {/* Option Text */}
              <span
                className={cn(
                  "text-sm sm:text-base block leading-relaxed",
                  isSelected ? "text-foreground font-medium" : "text-foreground"
                )}
              >
                {option.text}
              </span>
              
              {/* Option Image (if any) */}
              {hasImage && (
                <div className="mt-2 rounded-lg overflow-hidden border border-border bg-muted/30">
                  <img
                    src={option.imageUrl}
                    alt={`Option ${optionLetter}`}
                    className="w-full max-w-xs object-contain max-h-40"
                  />
                </div>
              )}
            </div>

            {/* Selection indicator on right */}
            {isSelected && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center mt-1"
              >
                <Check className="w-3 h-3 text-primary-foreground" />
              </motion.span>
            )}
          </motion.button>
        );
      })}

      {/* Selected count */}
      {selectedOptions.length > 0 && (
        <p className="text-xs text-primary font-medium text-right mt-2">
          {selectedOptions.length} option{selectedOptions.length !== 1 ? "s" : ""} selected
        </p>
      )}
    </div>
  );
});

export default MCQMultipleRenderer;
// MCQ Single Choice Renderer
// Radio-button style selection with mobile-optimized touch targets

import { memo } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { QuestionOption } from "@/data/student/testQuestions";

interface MCQSingleRendererProps {
  options: QuestionOption[];
  selectedOption?: string;
  onSelect: (optionId: string) => void;
  disabled?: boolean;
}

const MCQSingleRenderer = memo(function MCQSingleRenderer({
  options,
  selectedOption,
  onSelect,
  disabled = false,
}: MCQSingleRendererProps) {
  return (
    <div className="space-y-2.5">
      {options.map((option, index) => {
        const isSelected = selectedOption === option.id;
        const optionLetter = String.fromCharCode(65 + index);

        return (
          <motion.button
            key={option.id}
            onClick={() => !disabled && onSelect(option.id)}
            disabled={disabled}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            className={cn(
              "w-full flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border-2 text-left",
              "transition-all duration-200 min-h-[52px]", // 44px+ touch target
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
              isSelected
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border hover:border-primary/40 hover:bg-muted/50",
              disabled && "opacity-60 cursor-not-allowed"
            )}
          >
            {/* Option Letter Circle */}
            <span
              className={cn(
                "shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                "text-sm font-bold transition-all duration-200",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "border-2 border-muted-foreground/40 text-muted-foreground"
              )}
            >
              {isSelected ? <Check className="w-4 h-4" /> : optionLetter}
            </span>

            {/* Option Text */}
            <span
              className={cn(
                "text-sm sm:text-base pt-1 flex-1",
                isSelected ? "text-foreground font-medium" : "text-foreground"
              )}
            >
              {option.text}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
});

export default MCQSingleRenderer;

// Paragraph-Based Question Renderer
// Displays paragraph context with MCQ options

import { memo, useState } from "react";
import { Check, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import type { QuestionOption } from "@/data/student/testQuestions";

interface ParagraphRendererProps {
  paragraphText: string;
  questionText: string;
  options: QuestionOption[];
  selectedOption?: string;
  onSelect: (optionId: string) => void;
  disabled?: boolean;
  isFirstInParagraph?: boolean; // Show full paragraph only for first question
}

const ParagraphRenderer = memo(function ParagraphRenderer({
  paragraphText,
  questionText,
  options,
  selectedOption,
  onSelect,
  disabled = false,
  isFirstInParagraph = true,
}: ParagraphRendererProps) {
  const [isParagraphExpanded, setIsParagraphExpanded] = useState(isFirstInParagraph);

  return (
    <div className="space-y-4">
      {/* Paragraph Section */}
      <div className="bg-muted/50 border border-border rounded-xl overflow-hidden">
        {/* Paragraph Header - Always visible */}
        <button
          onClick={() => setIsParagraphExpanded(!isParagraphExpanded)}
          className="w-full flex items-center justify-between p-3 text-left hover:bg-muted/70 transition-colors"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              Reading Passage
            </span>
          </div>
          {isParagraphExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {/* Paragraph Content */}
        <AnimatePresence initial={false}>
          {isParagraphExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-0">
                <p className="text-sm text-foreground leading-relaxed">
                  {paragraphText}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Question Text */}
      <div className="py-2">
        <p className="text-base text-foreground font-medium leading-relaxed">
          {questionText}
        </p>
      </div>

      {/* Options */}
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
                "transition-all duration-200 min-h-[52px]",
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
    </div>
  );
});

export default ParagraphRenderer;

// Paragraph-Based Question Renderer
// Displays paragraph context with scrollable area for long content
// Mobile-optimized with expand/collapse for very long paragraphs

import { memo, useState, useMemo } from "react";
import { Check, BookOpen, ChevronDown, ChevronUp, ZoomIn } from "lucide-react";
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
  isFirstInParagraph?: boolean;
}

// Threshold for showing "show more" button
const PARAGRAPH_PREVIEW_LENGTH = 300;
const PARAGRAPH_MAX_HEIGHT = 160; // 40 * 4 lines roughly

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
  const [isFullyExpanded, setIsFullyExpanded] = useState(false);

  const isLongParagraph = useMemo(() => 
    paragraphText.length > PARAGRAPH_PREVIEW_LENGTH, 
    [paragraphText]
  );

  return (
    <div className="space-y-4">
      {/* Paragraph Section with scroll for long content */}
      <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl overflow-hidden">
        {/* Paragraph Header - Always visible */}
        <button
          onClick={() => setIsParagraphExpanded(!isParagraphExpanded)}
          className="w-full flex items-center justify-between p-3 text-left hover:bg-amber-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-medium text-amber-700">
              Reading Passage
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isLongParagraph && isParagraphExpanded && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullyExpanded(!isFullyExpanded);
                }}
                className="text-[10px] text-amber-600 hover:text-amber-800 flex items-center gap-0.5"
              >
                <ZoomIn className="w-3 h-3" />
                {isFullyExpanded ? "Less" : "Full"}
              </button>
            )}
            {isParagraphExpanded ? (
              <ChevronUp className="w-4 h-4 text-amber-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-amber-600" />
            )}
          </div>
        </button>

        {/* Paragraph Content with scroll */}
        <AnimatePresence initial={false}>
          {isParagraphExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div 
                className={cn(
                  "px-4 pb-4 pt-0",
                  isLongParagraph && !isFullyExpanded && "max-h-40 overflow-y-auto scrollbar-hide"
                )}
              >
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {paragraphText}
                </p>
              </div>
              
              {/* Fade indicator for scrollable content */}
              {isLongParagraph && !isFullyExpanded && (
                <div className="h-6 bg-gradient-to-t from-amber-50/80 to-transparent -mt-6 relative pointer-events-none" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Question Text - prominent */}
      <div className="py-2 px-1">
        <p className="text-base sm:text-lg text-foreground font-medium leading-relaxed">
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

              {/* Option Text and Image */}
              <div className="flex-1 pt-1">
                <span
                  className={cn(
                    "text-sm sm:text-base block",
                    isSelected ? "text-foreground font-medium" : "text-foreground"
                  )}
                >
                  {option.text}
                </span>
                
                {/* Option Image if present */}
                {option.imageUrl && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-border">
                    <img
                      src={option.imageUrl}
                      alt={`Option ${optionLetter}`}
                      className="w-full max-w-xs object-contain"
                    />
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
});

export default ParagraphRenderer;
// Question Navigation Component
// Prev/Next buttons, Mark for Review, Clear Response
// Fixed at bottom on mobile

import { memo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  RotateCcw,
  Grid3X3,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { QuestionStatus } from "@/data/student/testQuestions";

interface QuestionNavigationProps {
  currentIndex: number;
  totalQuestions: number;
  questionStatus: QuestionStatus;
  isMarked: boolean;
  hasAnswer: boolean;
  allowBackNavigation: boolean;
  allowMarkForReview: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onMarkForReview: () => void;
  onClearResponse: () => void;
  onOpenPalette: () => void;
  onSubmit: () => void;
}

const QuestionNavigation = memo(function QuestionNavigation({
  currentIndex,
  totalQuestions,
  questionStatus,
  isMarked,
  hasAnswer,
  allowBackNavigation,
  allowMarkForReview,
  onPrevious,
  onNext,
  onMarkForReview,
  onClearResponse,
  onOpenPalette,
  onSubmit,
}: QuestionNavigationProps) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;

  return (
    <div
      className={cn(
        "bg-white border-t border-border",
        "px-3 py-2 sm:px-4 sm:py-3",
        "pb-safe" // For devices with home indicator
      )}
    >
      {/* Mobile Layout: Compact 2 rows */}
      <div className="lg:hidden space-y-2">
        {/* Row 1: Actions */}
        <div className="flex items-center justify-between gap-2">
          {/* Mark for Review */}
          {allowMarkForReview && (
            <Button
              variant={isMarked ? "default" : "outline"}
              size="sm"
              className={cn(
                "text-xs gap-1.5 flex-1",
                isMarked && "bg-purple-500 hover:bg-purple-600"
              )}
              onClick={onMarkForReview}
            >
              <Flag className="w-3.5 h-3.5" />
              {isMarked ? "Marked" : "Mark"}
            </Button>
          )}

          {/* Clear Response */}
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1.5 flex-1"
            onClick={onClearResponse}
            disabled={!hasAnswer}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </Button>

          {/* Question Palette Trigger */}
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1.5 flex-1"
            onClick={onOpenPalette}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            {currentIndex + 1}/{totalQuestions}
          </Button>
        </div>

        {/* Row 2: Navigation */}
        <div className="flex items-center gap-2">
          {/* Previous */}
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1"
            onClick={onPrevious}
            disabled={isFirst || !allowBackNavigation}
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </Button>

          {/* Save & Next OR Submit */}
          {isLast ? (
            <Button
              size="sm"
              className="flex-1 gap-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              onClick={onSubmit}
            >
              <Send className="w-4 h-4" />
              Submit
            </Button>
          ) : (
            <Button
              size="sm"
              className="flex-1 gap-1 bg-gradient-to-r from-donut-orange to-donut-coral hover:opacity-90"
              onClick={onNext}
            >
              Save & Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Desktop Layout: Single row */}
      <div className="hidden lg:flex items-center justify-between gap-4">
        {/* Left: Actions */}
        <div className="flex items-center gap-2">
          {allowMarkForReview && (
            <Button
              variant={isMarked ? "default" : "outline"}
              size="sm"
              className={cn(
                "gap-1.5",
                isMarked && "bg-purple-500 hover:bg-purple-600"
              )}
              onClick={onMarkForReview}
            >
              <Flag className="w-4 h-4" />
              {isMarked ? "Marked for Review" : "Mark for Review"}
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={onClearResponse}
            disabled={!hasAnswer}
          >
            <RotateCcw className="w-4 h-4" />
            Clear Response
          </Button>
        </div>

        {/* Right: Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevious}
            disabled={isFirst || !allowBackNavigation}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          {isLast ? (
            <Button
              size="sm"
              className="gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              onClick={onSubmit}
            >
              <Send className="w-4 h-4" />
              Submit Test
            </Button>
          ) : (
            <Button
              size="sm"
              className="gap-1.5 bg-gradient-to-r from-donut-orange to-donut-coral hover:opacity-90"
              onClick={onNext}
            >
              Save & Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});

export default QuestionNavigation;

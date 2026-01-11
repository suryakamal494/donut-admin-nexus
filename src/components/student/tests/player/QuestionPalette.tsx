// Question Palette Component
// Mobile: Bottom sheet | Desktop: Sidebar panel
// Shows all questions with animated status colors

import { memo, useMemo } from "react";
import { X, CheckCircle2, Circle, Flag, Eye, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { TestSection } from "@/data/student/testQuestions";
import type { TestSessionQuestion } from "@/data/student/testSession";
import { getQuestionsBySection, getSectionStats } from "@/data/student/testSession";

interface QuestionPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  sections: TestSection[];
  sessionQuestions: TestSessionQuestion[];
  currentQuestionIndex: number;
  currentSectionId: string;
  onQuestionSelect: (index: number) => void;
  onSectionChange: (sectionId: string) => void;
}

const statusStyles = {
  not_visited: {
    bg: "bg-muted",
    border: "border-muted-foreground/20",
    text: "text-muted-foreground",
  },
  not_answered: {
    bg: "bg-red-100",
    border: "border-red-300",
    text: "text-red-600",
  },
  answered: {
    bg: "bg-emerald-100",
    border: "border-emerald-300",
    text: "text-emerald-600",
  },
  marked_review: {
    bg: "bg-purple-100",
    border: "border-purple-300",
    text: "text-purple-600",
  },
  answered_marked: {
    bg: "bg-purple-100",
    border: "border-purple-300",
    text: "text-purple-600",
  },
};

// Legend Item with animated count
const LegendItem = memo(function LegendItem({
  icon: Icon,
  label,
  count,
  colorClass,
  bgClass,
}: {
  icon: typeof Circle;
  label: string;
  count: number;
  colorClass: string;
  bgClass?: string;
}) {
  return (
    <div className={cn(
      "flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg",
      bgClass || "bg-transparent"
    )}>
      <Icon className={cn("w-3.5 h-3.5", colorClass)} />
      <span className="text-muted-foreground">{label}</span>
      <motion.span 
        key={count}
        initial={{ scale: 1.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="font-bold text-foreground min-w-[1.25rem] text-center"
      >
        {count}
      </motion.span>
    </div>
  );
});

// Palette Grid
const PaletteGrid = memo(function PaletteGrid({
  questions,
  currentQuestionIndex,
  allQuestions,
  onQuestionSelect,
}: {
  questions: TestSessionQuestion[];
  currentQuestionIndex: number;
  allQuestions: TestSessionQuestion[];
  onQuestionSelect: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
      {questions.map((q) => {
        const globalIndex = allQuestions.findIndex((aq) => aq.id === q.id);
        const isCurrent = globalIndex === currentQuestionIndex;
        const style = statusStyles[q.status];
        const isAnswered = q.status === "answered" || q.status === "answered_marked";
        const isMarked = q.status === "marked_review" || q.status === "answered_marked";

        return (
          <motion.button
            key={q.id}
            onClick={() => onQuestionSelect(globalIndex)}
            initial={false}
            animate={{
              scale: isCurrent ? 1.05 : 1,
              boxShadow: isCurrent 
                ? "0 4px 12px rgba(0,0,0,0.15)" 
                : "0 1px 3px rgba(0,0,0,0.1)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={cn(
              "relative w-10 h-10 sm:w-11 sm:h-11 rounded-lg font-semibold text-sm",
              "border-2 transition-colors duration-300",
              style.bg,
              style.border,
              style.text,
              isCurrent && "ring-2 ring-primary ring-offset-2"
            )}
          >
            {q.questionNumber}
            
            {/* Answered checkmark indicator */}
            {isAnswered && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center"
              >
                <CheckCircle2 className="w-3 h-3 text-white" />
              </motion.span>
            )}
            
            {/* Marked flag indicator */}
            {isMarked && !isAnswered && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center"
              >
                <Flag className="w-2.5 h-2.5 text-white" />
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
});

const QuestionPalette = memo(function QuestionPalette({
  isOpen,
  onClose,
  sections,
  sessionQuestions,
  currentQuestionIndex,
  currentSectionId,
  onQuestionSelect,
  onSectionChange,
}: QuestionPaletteProps) {
  // Calculate stats for all sections
  const overallStats = useMemo(() => {
    return {
      answered: sessionQuestions.filter(
        (q) => q.status === "answered" || q.status === "answered_marked"
      ).length,
      notAnswered: sessionQuestions.filter((q) => q.status === "not_answered").length,
      marked: sessionQuestions.filter(
        (q) => q.status === "marked_review" || q.status === "answered_marked"
      ).length,
      notVisited: sessionQuestions.filter((q) => q.status === "not_visited").length,
    };
  }, [sessionQuestions]);

  // Get current section questions
  const currentSectionQuestions = useMemo(
    () => getQuestionsBySection(sessionQuestions, currentSectionId),
    [sessionQuestions, currentSectionId]
  );

  const handleQuestionClick = (index: number) => {
    onQuestionSelect(index);
    onClose();
  };

  const PaletteContent = (
    <div className="flex flex-col h-full">
      {/* Section Tabs */}
      {sections.length > 1 && (
        <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide border-b border-border">
          {sections.map((section) => {
            const isActive = section.id === currentSectionId;
            const stats = getSectionStats(sessionQuestions, section.id);

            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium",
                  "transition-all duration-200 shrink-0",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {section.name}
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-bold",
                    isActive ? "bg-white/20" : "bg-current/10"
                  )}
                >
                  {stats.answered}/{stats.total}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Legend with highlighted stats */}
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <div className="grid grid-cols-2 gap-2">
          <LegendItem
            icon={CheckCircle2}
            label="Answered"
            count={overallStats.answered}
            colorClass="text-emerald-600"
            bgClass="bg-emerald-50"
          />
          <LegendItem
            icon={Circle}
            label="Not Answered"
            count={overallStats.notAnswered}
            colorClass="text-red-600"
            bgClass="bg-red-50"
          />
          <LegendItem
            icon={Flag}
            label="Marked"
            count={overallStats.marked}
            colorClass="text-purple-600"
            bgClass="bg-purple-50"
          />
          <LegendItem
            icon={HelpCircle}
            label="Not Visited"
            count={overallStats.notVisited}
            colorClass="text-muted-foreground"
            bgClass="bg-muted"
          />
        </div>
      </div>

      {/* Question Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <PaletteGrid
          questions={currentSectionQuestions}
          currentQuestionIndex={currentQuestionIndex}
          allQuestions={sessionQuestions}
          onQuestionSelect={handleQuestionClick}
        />
      </div>
    </div>
  );

  // Mobile: Bottom Sheet
  return (
    <>
      {/* Mobile Sheet */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-[70vh] rounded-t-2xl p-0 lg:hidden">
          <SheetHeader className="px-4 py-3 border-b border-border">
            <SheetTitle className="text-base">Question Palette</SheetTitle>
          </SheetHeader>
          {PaletteContent}
        </SheetContent>
      </Sheet>

      {/* Desktop: Sidebar (always visible) */}
      <aside
        className={cn(
          "hidden lg:flex flex-col w-72 border-l border-border bg-white",
          "h-full overflow-hidden"
        )}
      >
        <div className="px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-foreground">Question Palette</h3>
        </div>
        {PaletteContent}
      </aside>
    </>
  );
});

export default QuestionPalette;

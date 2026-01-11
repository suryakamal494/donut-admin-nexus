// Question Palette Component
// Mobile: Bottom sheet | Desktop: Sidebar panel
// Shows all questions with status colors

import { memo, useMemo } from "react";
import { X, CheckCircle2, Circle, Flag, Eye, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

// Legend Item
const LegendItem = memo(function LegendItem({
  icon: Icon,
  label,
  count,
  colorClass,
}: {
  icon: typeof Circle;
  label: string;
  count: number;
  colorClass: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <Icon className={cn("w-3.5 h-3.5", colorClass)} />
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{count}</span>
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

        return (
          <button
            key={q.id}
            onClick={() => onQuestionSelect(globalIndex)}
            className={cn(
              "w-10 h-10 sm:w-11 sm:h-11 rounded-lg font-semibold text-sm",
              "border-2 transition-all duration-150",
              "hover:scale-105 active:scale-95",
              style.bg,
              style.border,
              style.text,
              isCurrent && "ring-2 ring-primary ring-offset-2"
            )}
          >
            {q.questionNumber}
          </button>
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

      {/* Legend */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <LegendItem
            icon={CheckCircle2}
            label="Answered"
            count={overallStats.answered}
            colorClass="text-emerald-500"
          />
          <LegendItem
            icon={Circle}
            label="Not Answered"
            count={overallStats.notAnswered}
            colorClass="text-red-500"
          />
          <LegendItem
            icon={Flag}
            label="Marked"
            count={overallStats.marked}
            colorClass="text-purple-500"
          />
          <LegendItem
            icon={HelpCircle}
            label="Not Visited"
            count={overallStats.notVisited}
            colorClass="text-muted-foreground"
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

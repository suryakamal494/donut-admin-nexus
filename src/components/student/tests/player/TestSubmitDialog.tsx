// Test Submit Dialog Component
// Confirmation before submitting with summary stats

import { memo, useMemo } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  Flag,
  HelpCircle,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { TestSessionQuestion } from "@/data/student/testSession";
import { getOverallStats } from "@/data/student/testSession";

interface TestSubmitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  sessionQuestions: TestSessionQuestion[];
  testName: string;
}

const StatCard = memo(function StatCard({
  icon: Icon,
  label,
  count,
  total,
  colorClass,
  bgClass,
}: {
  icon: typeof Circle;
  label: string;
  count: number;
  total: number;
  colorClass: string;
  bgClass: string;
}) {
  const percentage = Math.round((count / total) * 100);

  return (
    <div className={cn("rounded-xl p-3", bgClass)}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={cn("w-4 h-4", colorClass)} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={cn("text-2xl font-bold", colorClass)}>{count}</span>
        <span className="text-sm text-muted-foreground">/ {total}</span>
        <span className="text-xs text-muted-foreground ml-auto">
          ({percentage}%)
        </span>
      </div>
    </div>
  );
});

const TestSubmitDialog = memo(function TestSubmitDialog({
  isOpen,
  onClose,
  onConfirm,
  sessionQuestions,
  testName,
}: TestSubmitDialogProps) {
  const stats = useMemo(() => getOverallStats(sessionQuestions), [sessionQuestions]);
  const total = sessionQuestions.length;

  const hasUnanswered = stats.notAnswered + stats.notVisited > 0;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" />
            Submit Test?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            You are about to submit <strong>{testName}</strong>. Please review
            your progress before confirming.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 my-4">
          <StatCard
            icon={CheckCircle2}
            label="Answered"
            count={stats.answered}
            total={total}
            colorClass="text-emerald-600"
            bgClass="bg-emerald-50"
          />
          <StatCard
            icon={Circle}
            label="Not Answered"
            count={stats.notAnswered}
            total={total}
            colorClass="text-red-600"
            bgClass="bg-red-50"
          />
          <StatCard
            icon={Flag}
            label="Marked for Review"
            count={stats.marked}
            total={total}
            colorClass="text-purple-600"
            bgClass="bg-purple-50"
          />
          <StatCard
            icon={HelpCircle}
            label="Not Visited"
            count={stats.notVisited}
            total={total}
            colorClass="text-muted-foreground"
            bgClass="bg-muted"
          />
        </div>

        {/* Warning if unanswered */}
        {hasUnanswered && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-700">
                You have {stats.notAnswered + stats.notVisited} unanswered
                questions
              </p>
              <p className="text-amber-600 text-xs mt-0.5">
                Are you sure you want to submit?
              </p>
            </div>
          </div>
        )}

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel>Continue Test</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
          >
            <Send className="w-4 h-4 mr-1.5" />
            Submit Test
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});

export default TestSubmitDialog;

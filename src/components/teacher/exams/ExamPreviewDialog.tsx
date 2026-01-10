import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Eye, 
  EyeOff, 
  Download, 
  Printer,
  FileQuestion,
  Clock,
  Award,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import type { TeacherExam } from "@/data/teacher/types";

interface ExamPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam: TeacherExam | null;
}

// Mock questions for preview
const mockQuestions = [
  {
    id: "q1",
    number: 1,
    text: "A particle is projected with velocity v at an angle θ to the horizontal. The radius of curvature at the highest point is:",
    type: "mcq" as const,
    difficulty: "medium" as const,
    marks: 4,
    options: ["v²cosθ/g", "v²cos²θ/g", "v²/gcosθ", "v²sin²θ/g"],
    correctAnswer: 1,
    subject: "Physics",
  },
  {
    id: "q2",
    number: 2,
    text: "The hybridization of carbon atoms in graphite is:",
    type: "mcq" as const,
    difficulty: "easy" as const,
    marks: 4,
    options: ["sp", "sp²", "sp³", "sp³d"],
    correctAnswer: 1,
    subject: "Chemistry",
  },
  {
    id: "q3",
    number: 3,
    text: "If f(x) = sin⁻¹(2x√(1-x²)), then f'(x) is:",
    type: "mcq" as const,
    difficulty: "hard" as const,
    marks: 4,
    options: ["2/√(1-x²)", "1/√(1-x²)", "-2/√(1-x²)", "2/√(1-4x²)"],
    correctAnswer: 0,
    subject: "Mathematics",
  },
  {
    id: "q4",
    number: 4,
    text: "Which of the following is NOT a noble gas?",
    type: "mcq" as const,
    difficulty: "easy" as const,
    marks: 4,
    options: ["Helium", "Neon", "Nitrogen", "Argon"],
    correctAnswer: 2,
    subject: "Chemistry",
  },
  {
    id: "q5",
    number: 5,
    text: "The dimensional formula of Planck's constant is:",
    type: "mcq" as const,
    difficulty: "medium" as const,
    marks: 4,
    options: ["[ML²T⁻¹]", "[ML²T⁻²]", "[MLT⁻¹]", "[M²L²T⁻¹]"],
    correctAnswer: 0,
    subject: "Physics",
  },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "easy": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "medium": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "hard": return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400";
    default: return "bg-muted text-muted-foreground";
  }
};

const getSubjectColor = (subject: string) => {
  switch (subject) {
    case "Physics": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "Chemistry": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "Mathematics": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    default: return "bg-muted text-muted-foreground";
  }
};

export const ExamPreviewDialog = ({
  open,
  onOpenChange,
  exam,
}: ExamPreviewDialogProps) => {
  const isMobile = useIsMobile();
  const [showAnswers, setShowAnswers] = useState(false);
  const [compactView, setCompactView] = useState(true);

  if (!exam) return null;

  const content = (
    <div className="flex flex-col h-full">
      {/* Exam Info Header */}
      <div className="p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg mb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <FileQuestion className="w-3.5 h-3.5" />
              {exam.totalQuestions} Qs
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {exam.duration}m
            </span>
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              {exam.totalMarks} marks
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {exam.subjects.map((sub) => (
              <Badge key={sub} variant="secondary" className="text-[10px] px-1.5 py-0.5">
                {sub}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAnswers(!showAnswers)}
            className="h-8 text-xs gap-1.5"
          >
            {showAnswers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showAnswers ? "Hide" : "Show"} Answers
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCompactView(!compactView)}
            className="h-8 text-xs gap-1.5"
          >
            {compactView ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            {compactView ? "Expand" : "Compact"}
          </Button>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Printer className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Questions List */}
      <ScrollArea className="flex-1 -mx-1 px-1">
        <div className="space-y-2">
          {mockQuestions.map((q, idx) => (
            <div
              key={q.id}
              className="p-3 bg-card border rounded-lg space-y-2"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center shrink-0">
                    {q.number}
                  </span>
                  <Badge className={cn("text-[10px]", getSubjectColor(q.subject))}>
                    {q.subject}
                  </Badge>
                  <Badge className={cn("text-[10px]", getDifficultyColor(q.difficulty))}>
                    {q.difficulty}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {q.marks} marks
                </span>
              </div>

              {/* Question Text */}
              <p className="text-sm leading-relaxed">{q.text}</p>

              {/* Options - Show only if not compact */}
              {!compactView && q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2">
                  {q.options.map((opt, optIdx) => (
                    <div
                      key={optIdx}
                      className={cn(
                        "px-2.5 py-1.5 rounded-md text-xs border",
                        showAnswers && optIdx === q.correctAnswer
                          ? "bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-300"
                          : "bg-muted/50 border-transparent"
                      )}
                    >
                      <span className="font-medium mr-1.5">
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="pb-2">
            <DrawerTitle className="text-base">{exam.name}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6 flex-1 overflow-hidden flex flex-col">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{exam.name}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden flex flex-col">
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
};

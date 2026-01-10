import { ArrowRight, X, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ExamDetailsStepProps {
  examName: string;
  setExamName: (name: string) => void;
  selectedSubjects: string[];
  toggleSubject: (subject: string) => void;
  teacherSubjects: string[];
  canProceed: boolean;
  onNext: () => void;
  onCancel: () => void;
}

export const ExamDetailsStep = ({
  examName,
  setExamName,
  selectedSubjects,
  toggleSubject,
  teacherSubjects,
  canProceed,
  onNext,
  onCancel,
}: ExamDetailsStepProps) => {
  return (
    <div className="space-y-6">
      {/* Exam Name */}
      <div className="space-y-2">
        <Label htmlFor="exam-name" className="text-sm font-medium">
          Exam Name *
        </Label>
        <Input
          id="exam-name"
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
          placeholder="e.g., Unit Test - Laws of Motion"
          className="h-12 text-base"
          autoFocus
        />
      </div>

      {/* Subject Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Select Subject{teacherSubjects.length > 1 ? "s" : ""} *
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {teacherSubjects.map((subject) => {
            const isSelected = selectedSubjects.includes(subject);
            return (
              <button
                key={subject}
                type="button"
                onClick={() => toggleSubject(subject)}
                className={cn(
                  "relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 min-h-[64px]",
                  "active:scale-[0.98]",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50 bg-card"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                  isSelected ? "bg-primary/10" : "bg-muted"
                )}>
                  <FlaskConical className={cn(
                    "w-5 h-5",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <span className={cn(
                  "font-medium text-left",
                  isSelected ? "text-primary" : "text-foreground"
                )}>
                  {subject}
                </span>
                
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
        
        {teacherSubjects.length === 1 && selectedSubjects.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Tap to select your subject
          </p>
        )}
      </div>

      {/* Actions - Sticky on mobile */}
      <div className="flex gap-3 pt-4 sticky bottom-0 bg-card pb-2">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1 h-12"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="flex-1 h-12 gradient-button"
        >
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

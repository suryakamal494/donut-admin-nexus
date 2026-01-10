import { CheckCircle2, ArrowRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompletionStepProps {
  examName: string;
  onBackToExams: () => void;
  onReviewQuestions: () => void;
}

export const CompletionStep = ({
  examName,
  onBackToExams,
  onReviewQuestions,
}: CompletionStepProps) => {
  return (
    <div className="text-center py-8 space-y-6">
      {/* Success Animation */}
      <div className="relative mx-auto w-20 h-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full animate-ping" />
        <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-foreground">Exam Created!</h2>
        <p className="text-muted-foreground max-w-xs mx-auto">
          <span className="font-medium text-foreground">{examName}</span> has been created successfully.
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-4">
        <Button
          onClick={onReviewQuestions}
          className="w-full h-12 gradient-button"
        >
          <Eye className="w-4 h-4 mr-2" />
          Review Questions
        </Button>
        
        <Button
          variant="outline"
          onClick={onBackToExams}
          className="w-full h-12"
        >
          Back to Exams
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

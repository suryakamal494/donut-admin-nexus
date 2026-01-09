import { CheckCircle2 } from "lucide-react";
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
    <div className="text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-8 h-8 text-success" />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Exam Created Successfully!</h3>
        <p className="text-muted-foreground">
          Your exam "{examName}" has been created and is ready for review.
        </p>
      </div>
      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={onBackToExams}>
          Back to Exams
        </Button>
        <Button className="gradient-button" onClick={onReviewQuestions}>
          Review Questions
        </Button>
      </div>
    </div>
  );
};

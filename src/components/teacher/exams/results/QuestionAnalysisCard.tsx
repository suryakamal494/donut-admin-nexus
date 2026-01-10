import { CheckCircle2, XCircle, MinusCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { type QuestionAnalysis } from "@/data/teacher/examResults";

interface QuestionAnalysisCardProps {
  question: QuestionAnalysis;
}

export const QuestionAnalysisCard = ({ question }: QuestionAnalysisCardProps) => {
  return (
    <Card className="card-premium">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold">Question {question.questionNumber}</h4>
            <p className="text-xs text-muted-foreground">{question.topic}</p>
          </div>
          <Badge 
            variant="secondary" 
            className={cn(
              "text-xs",
              question.difficulty === 'easy' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
              question.difficulty === 'medium' ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
              "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            )}
          >
            {question.difficulty}
          </Badge>
        </div>
        
        {/* Success Rate Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Success Rate</span>
            <span className="font-medium">{question.successRate}%</span>
          </div>
          <Progress 
            value={question.successRate} 
            className="h-2"
          />
        </div>

        {/* Attempt Breakdown */}
        <div className="flex gap-3 text-xs">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
            <span>{question.correctAttempts}</span>
          </div>
          <div className="flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-red-500" />
            <span>{question.incorrectAttempts}</span>
          </div>
          <div className="flex items-center gap-1">
            <MinusCircle className="w-3.5 h-3.5 text-gray-400" />
            <span>{question.unattempted}</span>
          </div>
          <div className="flex items-center gap-1 ml-auto text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{question.averageTime}s avg</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

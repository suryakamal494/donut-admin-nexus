// Quiz Viewer Component - Interactive quiz taking experience

import { useState } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  ChevronRight,
  Clock,
  Trophy,
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { BundleContentItem } from "@/data/student/lessonBundles";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

// Mock quiz questions
const mockQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "What is the standard form of a quadratic equation?",
    options: ["ax + b = 0", "ax² + bx + c = 0", "ax³ + bx² + cx + d = 0", "a/x + b = 0"],
    correctAnswer: 1,
  },
  {
    id: "q2",
    question: "In the equation 2x² - 5x + 3 = 0, what is the value of 'a'?",
    options: ["3", "-5", "2", "0"],
    correctAnswer: 2,
  },
  {
    id: "q3",
    question: "Which method can always be used to solve a quadratic equation?",
    options: ["Factoring", "Completing the square", "Quadratic formula", "All of the above"],
    correctAnswer: 2,
  },
  {
    id: "q4",
    question: "What is the discriminant of a quadratic equation ax² + bx + c = 0?",
    options: ["a² - 4bc", "b² - 4ac", "c² - 4ab", "4ac - b²"],
    correctAnswer: 1,
  },
  {
    id: "q5",
    question: "If the discriminant is negative, the quadratic equation has:",
    options: ["Two real roots", "One real root", "No real roots", "Three real roots"],
    correctAnswer: 2,
  },
];

interface QuizViewerProps {
  content: BundleContentItem;
  onComplete?: () => void;
}

export function QuizViewer({ content, onComplete }: QuizViewerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(mockQuestions.length).fill(null));

  const totalQuestions = content.questionCount || mockQuestions.length;
  const questions = mockQuestions.slice(0, totalQuestions);
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + (isAnswered ? 1 : 0)) / questions.length) * 100;

  const handleSelectAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setIsAnswered(true);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    if (selectedAnswer === question.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
      onComplete?.();
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
    setAnswers(new Array(questions.length).fill(null));
  };

  // Completion screen
  if (isCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    const isPassing = percentage >= 60;

    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-background to-muted/20 p-4">
        <div className="flex-1 flex items-center justify-center">
          <div className={cn(
            "bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50",
            "p-8 shadow-lg text-center max-w-md w-full"
          )}>
            {/* Trophy/Result icon */}
            <div className={cn(
              "w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center",
              isPassing ? "bg-green-100" : "bg-amber-100"
            )}>
              <Trophy className={cn(
                "w-10 h-10",
                isPassing ? "text-green-600" : "text-amber-600"
              )} />
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">
              {isPassing ? "Great Job!" : "Keep Practicing!"}
            </h2>

            <p className="text-muted-foreground mb-6">
              You scored {score} out of {questions.length}
            </p>

            {/* Score display */}
            <div className={cn(
              "text-5xl font-bold mb-6",
              isPassing ? "text-green-600" : "text-amber-600"
            )}>
              {percentage}%
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button onClick={handleRetry} variant="outline" className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background to-muted/20">
      {/* Header with progress */}
      <div className="px-4 py-3 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>No time limit</span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question content */}
      <div className="flex-1 overflow-auto p-4">
        <div className={cn(
          "bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50",
          "p-5 shadow-sm mb-4"
        )}>
          <h2 className="text-lg font-semibold text-foreground leading-relaxed">
            {question.question}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = question.correctAnswer === index;
            const showCorrect = isAnswered && isCorrect;
            const showIncorrect = isAnswered && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={isAnswered}
                className={cn(
                  "w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
                  "flex items-center gap-3",
                  !isAnswered && isSelected && "border-purple-500 bg-purple-50",
                  !isAnswered && !isSelected && "border-slate-200 bg-white hover:border-slate-300",
                  showCorrect && "border-green-500 bg-green-50",
                  showIncorrect && "border-red-500 bg-red-50",
                  isAnswered && !isSelected && !isCorrect && "opacity-50"
                )}
              >
                {/* Option letter */}
                <span className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm flex-shrink-0",
                  !isAnswered && isSelected && "bg-purple-500 text-white",
                  !isAnswered && !isSelected && "bg-slate-100 text-slate-600",
                  showCorrect && "bg-green-500 text-white",
                  showIncorrect && "bg-red-500 text-white"
                )}>
                  {String.fromCharCode(65 + index)}
                </span>

                {/* Option text */}
                <span className="flex-1 font-medium">{option}</span>

                {/* Result icon */}
                {showCorrect && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                {showIncorrect && <XCircle className="w-5 h-5 text-red-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="px-4 py-3 bg-white/80 backdrop-blur-xl border-t border-slate-100">
        {!isAnswered ? (
          <Button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Submit Answer
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="w-full"
          >
            {currentQuestion < questions.length - 1 ? (
              <>
                Next Question
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            ) : (
              "See Results"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

export default QuizViewer;

/**
 * Quiz Content Renderer for Presentation Mode
 * Handles multiple questions with navigation
 */

import { useState } from "react";
import { ChevronLeft, ChevronRight, HelpCircle, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LessonPlanBlock } from "../types";
import { mockQuestions, Question } from "@/data/questionsData";
import type { PresentationTheme } from "./types";
import { themeClasses } from "./types";

interface QuizContentProps {
  block: LessonPlanBlock;
  theme: PresentationTheme;
}

export const QuizContent = ({ block, theme }: QuizContentProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  const tc = themeClasses[theme];

  const questionObjects: Question[] = (block.questions || [])
    .map(qId => mockQuestions.find(q => q.id === qId || q.questionId === qId))
    .filter((q): q is Question => q !== undefined);

  if (questionObjects.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-full", tc.textMuted)}>
        <HelpCircle className="w-16 h-16 mb-4" />
        <p className="text-xl">No questions found in this quiz</p>
      </div>
    );
  }

  const currentQuestion = questionObjects[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === questionObjects.length - 1;

  return (
    <div className="flex flex-col h-full p-6 md:p-12">
      {/* Quiz Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className={cn("text-sm px-3 py-1 border-0", tc.badge)}>
            Question {currentIndex + 1} of {questionObjects.length}
          </Badge>
          <Badge className={cn(
            "text-sm px-3 py-1",
            currentQuestion.difficulty === 'easy' && "bg-green-500/80",
            currentQuestion.difficulty === 'medium' && "bg-amber-500/80",
            currentQuestion.difficulty === 'hard' && "bg-red-500/80",
          )}>
            {currentQuestion.difficulty}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setCurrentIndex(prev => prev - 1); setShowSolution(false); }}
            disabled={isFirst}
            className={cn(tc.button, "disabled:opacity-30")}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setCurrentIndex(prev => prev + 1); setShowSolution(false); }}
            disabled={isLast}
            className={cn(tc.button, "disabled:opacity-30")}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full">
        {/* Assertion-Reasoning format */}
        {currentQuestion.type === 'assertion_reasoning' && currentQuestion.assertion && currentQuestion.reason ? (
          <div className="space-y-4 mb-8">
            <div className={cn("p-6 rounded-xl backdrop-blur-sm", theme === 'dark' ? "bg-white/10" : "bg-slate-100")}>
              <p className={cn("text-sm font-medium mb-2", tc.textMuted)}>Assertion (A):</p>
              <p className={cn("text-xl leading-relaxed", tc.text)}>{currentQuestion.assertion}</p>
            </div>
            <div className={cn("p-6 rounded-xl backdrop-blur-sm", theme === 'dark' ? "bg-white/10" : "bg-slate-100")}>
              <p className={cn("text-sm font-medium mb-2", tc.textMuted)}>Reason (R):</p>
              <p className={cn("text-xl leading-relaxed", tc.text)}>{currentQuestion.reason}</p>
            </div>
          </div>
        ) : (
          <p className={cn("text-2xl md:text-3xl font-medium mb-8 leading-relaxed", tc.text)}>
            {currentQuestion.questionText}
          </p>
        )}

        {/* Options */}
        {currentQuestion.options && currentQuestion.options.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, idx) => (
              <div
                key={option.id}
                className={cn(
                  "flex items-center gap-4 p-5 rounded-xl transition-all cursor-pointer",
                  showSolution && option.isCorrect 
                    ? "bg-green-500/30 ring-2 ring-green-400" 
                    : theme === 'dark' 
                      ? "bg-white/10 hover:bg-white/15" 
                      : "bg-slate-100 hover:bg-slate-200"
                )}
                onClick={() => setShowSolution(true)}
              >
                {showSolution && option.isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                ) : (
                  <Circle className={cn("w-6 h-6 flex-shrink-0", tc.textMuted)} />
                )}
                <span className={cn("text-lg", tc.text)}>
                  <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span> 
                  {option.text}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Numerical Answer */}
        {currentQuestion.type === 'numerical' && (
          <div 
            className={cn(
              "p-6 rounded-xl cursor-pointer transition-all",
              showSolution 
                ? "bg-green-500/30" 
                : theme === 'dark' 
                  ? "bg-white/10 hover:bg-white/15" 
                  : "bg-slate-100 hover:bg-slate-200"
            )}
            onClick={() => setShowSolution(true)}
          >
            <p className={cn("mb-2", tc.textMuted)}>Answer:</p>
            <p className={cn(
              "font-mono text-3xl font-bold",
              tc.text,
              !showSolution && "blur-lg select-none"
            )}>
              {currentQuestion.correctAnswer}
            </p>
          </div>
        )}

        {/* Solution */}
        {showSolution && currentQuestion.solution && (
          <div className={cn(
            "mt-6 p-6 rounded-xl backdrop-blur-sm",
            theme === 'dark' ? "bg-blue-500/20" : "bg-blue-50 border border-blue-200"
          )}>
            <p className={cn("text-sm font-medium mb-2", theme === 'dark' ? "text-blue-300" : "text-blue-600")}>
              Solution:
            </p>
            <p className={cn("text-lg leading-relaxed", theme === 'dark' ? "text-white/90" : "text-slate-700")}>
              {currentQuestion.solution}
            </p>
          </div>
        )}
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {questionObjects.map((_, idx) => (
          <button
            key={idx}
            onClick={() => { setCurrentIndex(idx); setShowSolution(false); }}
            className={cn(
              "h-2 rounded-full transition-all",
              idx === currentIndex 
                ? cn("w-8", tc.progressDotActive)
                : cn("w-2 hover:opacity-70", tc.progressDot)
            )}
          />
        ))}
      </div>
    </div>
  );
};

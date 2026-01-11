// Question Review Component
// Question-by-question review with correct/incorrect indicators

import { memo, useState, useMemo } from "react";
import { 
  CheckCircle2, XCircle, MinusCircle, ChevronDown, ChevronUp,
  Clock, BookOpen, Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { QuestionResult, SectionResult } from "@/data/student/testResults";
import { formatDuration, getDifficultyColor, getSubjectColor } from "@/data/student/testResults";
import { questionTypeLabels } from "@/data/student/testQuestions";

interface QuestionReviewProps {
  questions: QuestionResult[];
  sections: SectionResult[];
}

type FilterType = "all" | "correct" | "incorrect" | "skipped";

const QuestionReview = memo(function QuestionReview({
  questions,
  sections,
}: QuestionReviewProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    let filtered = questions;
    
    // Section filter
    if (activeSection) {
      filtered = filtered.filter(q => q.sectionId === activeSection);
    }
    
    // Status filter
    switch (filter) {
      case "correct":
        return filtered.filter(q => q.isCorrect);
      case "incorrect":
        return filtered.filter(q => q.isAttempted && !q.isCorrect);
      case "skipped":
        return filtered.filter(q => !q.isAttempted);
      default:
        return filtered;
    }
  }, [questions, filter, activeSection]);

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const getStatusIcon = (question: QuestionResult) => {
    if (question.isCorrect) {
      return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    }
    if (question.isAttempted) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
    return <MinusCircle className="w-5 h-5 text-slate-400" />;
  };

  const getStatusBg = (question: QuestionResult) => {
    if (question.isCorrect) return "border-l-emerald-500 bg-emerald-50/50";
    if (question.isAttempted) return "border-l-red-500 bg-red-50/50";
    return "border-l-slate-400 bg-slate-50/50";
  };

  const formatAnswer = (answer: string | string[] | number | Record<string, string> | undefined): string => {
    if (answer === undefined) return "Not attempted";
    if (typeof answer === "string") return answer.toUpperCase();
    if (typeof answer === "number") return answer.toString();
    if (Array.isArray(answer)) return answer.map(a => a.toUpperCase()).join(", ");
    if (typeof answer === "object") {
      return Object.entries(answer).map(([k, v]) => `${k}→${v}`).join(", ");
    }
    return String(answer);
  };

  return (
    <div className="bg-white rounded-xl border border-border p-4 sm:p-6">
      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-primary" />
        Question Review
      </h3>
      
      {/* Section Pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setActiveSection(null)}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
            !activeSection 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          All Sections
        </button>
        {sections.map(section => {
          const colors = getSubjectColor(section.subject);
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(isActive ? null : section.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                isActive ? colors.bg + " text-white" : colors.light + " " + colors.text
              )}
            >
              {section.name}
            </button>
          );
        })}
      </div>
      
      {/* Filter Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg mb-4">
        {[
          { key: "all" as FilterType, label: "All", count: questions.length },
          { key: "correct" as FilterType, label: "Correct", count: questions.filter(q => q.isCorrect).length },
          { key: "incorrect" as FilterType, label: "Wrong", count: questions.filter(q => q.isAttempted && !q.isCorrect).length },
          { key: "skipped" as FilterType, label: "Skipped", count: questions.filter(q => !q.isAttempted).length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={cn(
              "flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors",
              filter === tab.key
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>
      
      {/* Questions List */}
      <div className="space-y-2 max-h-[60vh] overflow-y-auto scrollbar-hide">
        {filteredQuestions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No questions match the selected filters
          </p>
        ) : (
          filteredQuestions.map((question, index) => {
            const isExpanded = expandedQuestions.has(question.id);
            const colors = getSubjectColor(question.subject);
            
            return (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className={cn(
                  "border border-border rounded-lg overflow-hidden",
                  "border-l-4",
                  getStatusBg(question)
                )}
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleQuestion(question.id)}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-muted/30 transition-colors"
                >
                  {getStatusIcon(question)}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-foreground">Q.{question.questionNumber}</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {questionTypeLabels[question.type]}
                      </Badge>
                      <Badge className={cn("text-[10px] px-1.5 py-0", getDifficultyColor(question.difficulty))}>
                        {question.difficulty}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {question.text}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={cn(
                      "text-sm font-bold",
                      question.marksObtained > 0 ? "text-emerald-600" :
                      question.marksObtained < 0 ? "text-red-600" : "text-muted-foreground"
                    )}>
                      {question.marksObtained > 0 ? "+" : ""}{question.marksObtained}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>
                
                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-3 pt-0 border-t border-border/50 space-y-3">
                        {/* Full Question Text */}
                        <div className="bg-muted/50 rounded-lg p-3 mt-3">
                          <p className="text-sm text-foreground leading-relaxed">
                            {question.text}
                          </p>
                        </div>
                        
                        {/* Answer Comparison */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className={cn(
                            "p-3 rounded-lg",
                            question.isAttempted 
                              ? question.isCorrect ? "bg-emerald-50" : "bg-red-50"
                              : "bg-slate-50"
                          )}>
                            <p className="text-xs text-muted-foreground mb-1">Your Answer</p>
                            <p className={cn(
                              "font-medium text-sm",
                              question.isCorrect ? "text-emerald-600" :
                              question.isAttempted ? "text-red-600" : "text-slate-500"
                            )}>
                              {formatAnswer(question.userAnswer)}
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-emerald-50">
                            <p className="text-xs text-muted-foreground mb-1">Correct Answer</p>
                            <p className="font-medium text-sm text-emerald-600">
                              {formatAnswer(question.correctAnswer)}
                            </p>
                          </div>
                        </div>
                        
                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Time: {formatDuration(question.timeSpent)}
                          </span>
                          <span>
                            Marks: {question.marksObtained}/{question.maxMarks}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
});

export default QuestionReview;

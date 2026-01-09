import { useState, memo } from "react";
import { Lock, Building2, Eye, Edit, Trash2, ChevronDown, ChevronUp, Clock, Award, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SubjectBadge } from "@/components/subject/SubjectBadge";
import { QuestionTypeIcon } from "./QuestionTypeIcon";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Question, 
  questionTypeLabels, 
  difficultyConfig, 
  languageConfig,
  statusConfig 
} from "@/data/questionsData";
import { cn } from "@/lib/utils";

export type QuestionCardMode = "superadmin" | "institute";

export interface QuestionWithSource extends Question {
  sourceType?: "global" | "institute";
}

interface QuestionCardProps {
  question: QuestionWithSource;
  mode?: QuestionCardMode;
  onView?: (question: QuestionWithSource) => void;
  onEdit?: (question: QuestionWithSource) => void;
  onDelete?: (question: QuestionWithSource) => void;
  showParagraphBadge?: boolean;
}

export const QuestionCard = memo(function QuestionCard({ 
  question, 
  mode = "superadmin",
  onView, 
  onEdit, 
  onDelete,
  showParagraphBadge = true 
}: QuestionCardProps) {
  const [showSolution, setShowSolution] = useState(false);

  const difficultyStyle = difficultyConfig[question.difficulty];
  const languageLabel = languageConfig[question.language];
  const statusStyle = statusConfig[question.status];
  
  // Institute mode specific
  const isInstituteMode = mode === "institute";
  const isGlobal = isInstituteMode && question.sourceType === "global";
  const canEdit = isInstituteMode ? !isGlobal : true;
  const canDelete = isInstituteMode ? !isGlobal : true;

  const renderOptions = () => {
    if (!question.options) return null;

    if (question.type === "true_false") {
      return (
        <div className="flex gap-3 mt-3">
          {question.options.map((opt) => (
            <div
              key={opt.id}
              className={cn(
                "px-4 py-2 rounded-lg text-sm border flex-1 text-center",
                opt.isCorrect 
                  ? "bg-success/10 border-success/30 text-success font-medium" 
                  : "bg-muted/30 border-border/50"
              )}
            >
              {opt.text}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
        {question.options.map((opt, i) => (
          <div
            key={opt.id}
            className={cn(
              "p-3 rounded-lg text-sm border flex items-start gap-2",
              opt.isCorrect 
                ? "bg-success/10 border-success/30 text-success" 
                : "bg-muted/30 border-border/50"
            )}
          >
            <span className="font-semibold shrink-0">
              {String.fromCharCode(65 + i)}.
            </span>
            <span>{opt.text}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderMatrixMatch = () => {
    if (!question.columnA || !question.columnB) return null;

    return (
      <div className="mt-3 grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Column A</p>
          {question.columnA.map((item) => (
            <div key={item.id} className="p-2 bg-muted/30 rounded-lg text-sm border border-border/50">
              <span className="font-semibold">{item.id}.</span> {item.text}
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Column B</p>
          {question.columnB.map((item) => (
            <div key={item.id} className="p-2 bg-muted/30 rounded-lg text-sm border border-border/50">
              <span className="font-semibold">{item.id}.</span> {item.text}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCodeSnippet = () => {
    if (!question.codeSnippet) return null;

    return (
      <div className="mt-3">
        <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
          <code>{question.codeSnippet}</code>
        </pre>
      </div>
    );
  };

  const renderAssertion = () => {
    if (!question.assertion || !question.reason) return null;

    return (
      <div className="mt-3 space-y-2">
        <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-sm font-medium text-primary mb-1">Assertion (A):</p>
          <p className="text-sm">{question.assertion}</p>
        </div>
        <div className="p-3 bg-secondary/50 rounded-lg border border-border/50">
          <p className="text-sm font-medium text-muted-foreground mb-1">Reason (R):</p>
          <p className="text-sm">{question.reason}</p>
        </div>
      </div>
    );
  };

  return (
    <div className={cn(
      "bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-soft border hover:shadow-lg transition-shadow",
      isInstituteMode 
        ? isGlobal 
          ? "border-blue-200/50" 
          : "border-amber-200/50"
        : "border-border/50"
    )}>
      {/* Source Badge - Only in Institute Mode */}
      {isInstituteMode && (
        <div className="flex items-center justify-between mb-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="outline" 
                className={cn(
                  "gap-1.5 cursor-help",
                  isGlobal 
                    ? "bg-blue-50 text-blue-700 border-blue-200" 
                    : "bg-amber-50 text-amber-700 border-amber-200"
                )}
              >
                {isGlobal ? <Lock className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
                {isGlobal ? "Global" : "Institute"}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              {isGlobal 
                ? "Shared by platform. View only - cannot edit or delete." 
                : "Created by your institute. You can edit or delete this question."}
            </TooltipContent>
          </Tooltip>

          {question.status !== "approved" && (
            <Badge variant="outline" className={cn("text-xs", statusStyle.className)}>
              {statusStyle.label}
            </Badge>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
            {question.questionId}
          </span>
          <Badge variant="outline" className="gap-1.5 bg-muted/50">
            <QuestionTypeIcon type={question.type} size={12} />
            {questionTypeLabels[question.type]}
          </Badge>
          <Badge variant="outline" className={cn("capitalize", difficultyStyle.className)}>
            {difficultyStyle.label}
          </Badge>
          {question.language !== "english" && (
            <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">
              {languageLabel.nativeLabel}
            </Badge>
          )}
          {showParagraphBadge && question.paragraphId && (
            <Badge variant="outline" className="bg-accent/50 border-accent">
              Para Q{question.paragraphOrder}
            </Badge>
          )}
        </div>
        {/* Status badge for SuperAdmin mode */}
        {!isInstituteMode && (
          <div className="flex gap-1">
            {question.status !== "approved" && (
              <Badge variant="outline" className={cn("text-xs", statusStyle.className)}>
                {statusStyle.label}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Subject & Classification */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <SubjectBadge subject={question.subjectId} size="sm" />
        <span className="text-muted-foreground text-sm">›</span>
        <span className="text-sm text-muted-foreground">{question.chapter}</span>
        <span className="text-muted-foreground text-sm">›</span>
        <span className="text-sm text-muted-foreground">{question.topic}</span>
      </div>

      {/* Question Text */}
      <p className="text-foreground font-medium leading-relaxed">
        {question.questionText}
      </p>

      {/* Code Snippet (for CS questions) */}
      {renderCodeSnippet()}

      {/* Assertion-Reasoning Display */}
      {question.type === "assertion_reasoning" && renderAssertion()}

      {/* Matrix Match Display */}
      {question.type === "matrix_match" && renderMatrixMatch()}

      {/* Options */}
      {(question.type === "mcq_single" || question.type === "mcq_multiple" || question.type === "true_false" || question.type === "assertion_reasoning" || question.type === "paragraph") && renderOptions()}

      {/* Numerical/Short Answer Display */}
      {(question.type === "numerical" || question.type === "fill_blanks") && (
        <div className="mt-3 p-3 bg-success/10 border border-success/30 rounded-lg">
          <span className="text-sm font-medium text-success">Answer: </span>
          <span className="text-sm text-success">{question.correctAnswer}</span>
        </div>
      )}

      {/* Solution Toggle */}
      <Collapsible open={showSolution} onOpenChange={setShowSolution}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="mt-3 gap-2 text-muted-foreground hover:text-foreground">
            {showSolution ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showSolution ? "Hide Solution" : "View Solution"}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 p-4 bg-muted/30 rounded-lg border border-border/30">
            <p className="text-sm text-muted-foreground leading-relaxed">{question.solution}</p>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            +{question.marks} / -{question.negativeMarks}
          </span>
          {question.timeRecommended && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {Math.floor(question.timeRecommended / 60)}:{(question.timeRecommended % 60).toString().padStart(2, '0')} min
            </span>
          )}
          {question.source && (
            <span className="flex items-center gap-1.5 hidden sm:flex">
              <ExternalLink className="w-4 h-4" />
              {question.source}
            </span>
          )}
          {!isInstituteMode && (
            <span className="flex items-center gap-1.5 hidden md:flex">
              <Calendar className="w-4 h-4" />
              {question.createdAt}
            </span>
          )}
        </div>
        <div className="flex gap-1 self-end sm:self-auto">
          {onView && (
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => onView(question)}>
              <Eye className="w-4 h-4" />
            </Button>
          )}
          {onEdit && (
            isInstituteMode && !canEdit ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    disabled
                    className="opacity-50 cursor-not-allowed h-8 w-8 sm:h-9 sm:w-9"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Global questions cannot be edited</TooltipContent>
              </Tooltip>
            ) : (
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => onEdit(question)}>
                <Edit className="w-4 h-4" />
              </Button>
            )
          )}
          {onDelete && (
            isInstituteMode && !canDelete ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive opacity-50 cursor-not-allowed h-8 w-8 sm:h-9 sm:w-9"
                    disabled
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Global questions cannot be deleted</TooltipContent>
              </Tooltip>
            ) : (
              <Button variant="ghost" size="icon" className="text-destructive h-8 w-8 sm:h-9 sm:w-9" onClick={() => onDelete(question)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
});

import { X, Clock, Award, ExternalLink, Calendar, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SubjectBadge } from "@/components/subject/SubjectBadge";
import { QuestionTypeIcon } from "./QuestionTypeIcon";
import { 
  Question, 
  questionTypeLabels, 
  difficultyConfig,
  languageConfig 
} from "@/data/questionsData";
import { cn } from "@/lib/utils";

interface QuestionViewDialogProps {
  question: Question | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QuestionViewDialog = ({ question, open, onOpenChange }: QuestionViewDialogProps) => {
  if (!question) return null;

  const difficultyStyle = difficultyConfig[question.difficulty];
  const languageLabel = languageConfig[question.language];

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
      <div className="mt-3 grid grid-cols-1 gap-2">
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
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0">
        <DialogHeader className="p-4 sm:p-6 pb-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
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
              </div>
              <DialogTitle className="text-lg font-semibold text-left">Question Preview</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)]">
          <div className="p-4 sm:p-6 space-y-4">
            {/* Subject & Classification */}
            <div className="flex items-center gap-2 flex-wrap">
              <SubjectBadge subject={question.subjectId} size="sm" />
              <span className="text-muted-foreground text-sm">›</span>
              <span className="text-sm text-muted-foreground">{question.chapter}</span>
              <span className="text-muted-foreground text-sm">›</span>
              <span className="text-sm text-muted-foreground">{question.topic}</span>
            </div>

            {/* Paragraph Text (if exists) */}
            {question.paragraphText && (
              <div className="bg-muted/30 rounded-xl border border-border/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Passage</span>
                </div>
                <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
                  {question.paragraphText}
                </p>
              </div>
            )}

            {/* Question Text */}
            <div>
              <p className="text-foreground font-medium leading-relaxed text-base">
                {question.questionText}
              </p>
            </div>

            {/* Code Snippet */}
            {renderCodeSnippet()}

            {/* Assertion-Reasoning */}
            {question.type === "assertion_reasoning" && renderAssertion()}

            {/* Matrix Match */}
            {question.type === "matrix_match" && renderMatrixMatch()}

            {/* Options */}
            {(question.type === "mcq_single" || question.type === "mcq_multiple" || question.type === "true_false" || question.type === "assertion_reasoning" || question.type === "paragraph") && renderOptions()}

            {/* Numerical/Short Answer Display */}
            {(question.type === "numerical" || question.type === "fill_blanks") && (
              <div className="p-3 bg-success/10 border border-success/30 rounded-lg">
                <span className="text-sm font-medium text-success">Answer: </span>
                <span className="text-sm text-success">{question.correctAnswer}</span>
              </div>
            )}

            <Separator />

            {/* Solution */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">Solution</h4>
              <div className="p-4 bg-muted/30 rounded-lg border border-border/30">
                <p className="text-sm text-foreground leading-relaxed">{question.solution}</p>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap pt-2">
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                +{question.marks} / -{question.negativeMarks}
              </span>
              {question.timeRecommended && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {Math.floor(question.timeRecommended / 60)}:{(question.timeRecommended % 60).toString().padStart(2, '0')} min
                </span>
              )}
              {question.source && (
                <span className="flex items-center gap-1.5">
                  <ExternalLink className="w-4 h-4" />
                  {question.source}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {question.createdAt}
              </span>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

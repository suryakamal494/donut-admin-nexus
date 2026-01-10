import { ArrowLeft, ArrowRight, Monitor, FileText, Settings, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { examPatternConfig } from "@/data/examsData";

type PatternType = "custom" | "jee_main" | "jee_advanced" | "neet";
type UIType = "platform" | "real_exam";

interface PatternStepProps {
  pattern: PatternType;
  setPattern: (pattern: PatternType) => void;
  uiType: UIType;
  setUIType: (uiType: UIType) => void;
  canProceed: boolean;
  onNext: () => void;
  onBack: () => void;
}

const patternOptions = [
  { 
    id: "custom" as const, 
    label: "Custom", 
    shortLabel: "Custom",
    description: "Set your own rules",
    icon: Settings,
  },
  { 
    id: "jee_main" as const, 
    label: "JEE Main", 
    shortLabel: "JEE",
    description: "Standard JEE pattern",
    icon: Zap,
  },
  { 
    id: "neet" as const, 
    label: "NEET", 
    shortLabel: "NEET",
    description: "Medical entrance",
    icon: Zap,
  },
];

export const PatternStep = ({
  pattern,
  setPattern,
  uiType,
  setUIType,
  canProceed,
  onNext,
  onBack,
}: PatternStepProps) => {
  return (
    <div className="space-y-4">
      {/* Exam Pattern - Compact grid */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Exam Pattern</Label>
        
        <div className="grid grid-cols-3 gap-2">
          {patternOptions.map((opt) => {
            const isSelected = pattern === opt.id;
            const Icon = opt.icon;
            const config = opt.id !== "custom" ? examPatternConfig[opt.id as keyof typeof examPatternConfig] : null;
            
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPattern(opt.id)}
                className={cn(
                  "p-2.5 sm:p-3 rounded-lg border-2 text-left transition-all duration-200",
                  "active:scale-[0.98]",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 bg-card"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center mb-2",
                  isSelected ? "bg-primary/10" : "bg-muted"
                )}>
                  <Icon className={cn(
                    "w-4 h-4",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <h4 className={cn(
                  "font-semibold text-xs mb-0.5",
                  isSelected ? "text-primary" : "text-foreground"
                )}>
                  <span className="sm:hidden">{opt.shortLabel}</span>
                  <span className="hidden sm:inline">{opt.label}</span>
                </h4>
                <p className="text-[10px] text-muted-foreground line-clamp-1">
                  {opt.description}
                </p>
                
                {/* Pattern details for standard patterns */}
                {config && isSelected && (
                  <div className="mt-1.5 flex gap-1">
                    <Badge variant="secondary" className="text-[9px] px-1 py-0">
                      {config.totalQuestions}Q
                    </Badge>
                    <Badge variant="secondary" className="text-[9px] px-1 py-0">
                      {config.duration}m
                    </Badge>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Student Interface - Compact */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Student Interface</Label>
        <div className="grid grid-cols-2 gap-2">
          {([
            { id: "platform" as const, label: "Platform UI", shortLabel: "Platform", description: "Modern", icon: Monitor },
            { id: "real_exam" as const, label: "Real Exam UI", shortLabel: "Real Exam", description: "Exam-like", icon: FileText },
          ]).map((opt) => {
            const isSelected = uiType === opt.id;
            const Icon = opt.icon;
            
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setUIType(opt.id)}
                className={cn(
                  "relative flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all duration-200",
                  "active:scale-[0.98]",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 bg-card"
                )}
              >
                <div className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center",
                  isSelected ? "bg-primary/10" : "bg-muted"
                )}>
                  <Icon className={cn(
                    "w-4.5 h-4.5",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <span className={cn(
                  "font-medium text-xs text-center",
                  isSelected ? "text-primary" : "text-foreground"
                )}>
                  <span className="sm:hidden">{opt.shortLabel}</span>
                  <span className="hidden sm:inline">{opt.label}</span>
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {opt.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 sticky bottom-0 bg-card pb-2">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1 h-11"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="flex-1 h-11 gradient-button"
        >
          Next
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>
    </div>
  );
};

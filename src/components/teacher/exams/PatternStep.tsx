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
    description: "Set your own rules",
    icon: Settings,
  },
  { 
    id: "jee_main" as const, 
    label: "JEE Main", 
    description: "Standard JEE pattern",
    icon: Zap,
  },
  { 
    id: "neet" as const, 
    label: "NEET", 
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
    <div className="space-y-6">
      {/* Exam Pattern */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Exam Pattern</Label>
        
        {/* Mobile: Horizontal scroll cards - wider cards */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 snap-x snap-mandatory scroll-smooth md:grid md:grid-cols-3 md:overflow-visible md:mx-0 md:px-0">
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
                  "snap-center flex-shrink-0 w-[160px] md:w-auto p-4 rounded-xl border-2 text-left transition-all duration-200",
                  "active:scale-[0.98]",
                  isSelected
                    ? "border-primary bg-primary/5 scale-[1.02]"
                    : "border-border hover:border-primary/50 bg-card"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
                  isSelected ? "bg-primary/10" : "bg-muted"
                )}>
                  <Icon className={cn(
                    "w-5 h-5",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <h4 className={cn(
                  "font-semibold text-sm mb-1",
                  isSelected ? "text-primary" : "text-foreground"
                )}>
                  {opt.label}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {opt.description}
                </p>
                
                {/* Show pattern details for standard patterns */}
                {config && isSelected && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-[10px]">
                      {config.totalQuestions} Qs
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      {config.duration}m
                    </Badge>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Student Interface */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Student Interface</Label>
        <div className="grid grid-cols-2 gap-3">
          {([
            { id: "platform" as const, label: "Platform UI", description: "Modern interface", icon: Monitor },
            { id: "real_exam" as const, label: "Real Exam UI", description: "Exam-like interface", icon: FileText },
          ]).map((opt) => {
            const isSelected = uiType === opt.id;
            const Icon = opt.icon;
            
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setUIType(opt.id)}
                className={cn(
                  "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                  "active:scale-[0.98]",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 bg-card"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center",
                  isSelected ? "bg-primary/10" : "bg-muted"
                )}>
                  <Icon className={cn(
                    "w-6 h-6",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <span className={cn(
                  "font-medium text-sm text-center",
                  isSelected ? "text-primary" : "text-foreground"
                )}>
                  {opt.label}
                </span>
                <span className="text-xs text-muted-foreground text-center">
                  {opt.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 sticky bottom-0 bg-card pb-2">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1 h-12"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
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

import { ArrowLeft, ArrowRight, Monitor, MonitorPlay } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { examPatternConfig } from "@/data/examsData";
import { PatternType, UIType } from "@/hooks/useExamCreation";

interface PatternUIStepProps {
  pattern: PatternType;
  setPattern: (pattern: PatternType) => void;
  uiType: UIType;
  setUIType: (type: UIType) => void;
  canProceed: boolean;
  onNext: () => void;
  onBack: () => void;
}

export const PatternUIStep = ({
  pattern,
  setPattern,
  uiType,
  setUIType,
  canProceed,
  onNext,
  onBack,
}: PatternUIStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-1">Pattern & Interface</h3>
        <p className="text-muted-foreground text-sm">Choose exam pattern and student interface</p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Exam Pattern</Label>
          <RadioGroup value={pattern} onValueChange={(v) => setPattern(v as PatternType)}>
            <label
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all",
                pattern === "custom" 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50"
              )}
            >
              <RadioGroupItem value="custom" />
              <div>
                <p className="font-medium">Custom Configuration</p>
                <p className="text-sm text-muted-foreground">Define your own question count, marks, and duration</p>
              </div>
            </label>
            
            <div className="mt-3">
              <p className="text-sm text-muted-foreground mb-2">Or use a standard pattern:</p>
              {Object.entries(examPatternConfig).map(([key, config]) => (
                <label
                  key={key}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all mb-2",
                    pattern === key 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <RadioGroupItem value={key} />
                  <div className="flex-1">
                    <p className="font-medium">{config.label}</p>
                    <p className="text-sm text-muted-foreground">{config.description}</p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>{config.totalQuestions} Qs</p>
                    <p>{config.duration} mins</p>
                  </div>
                </label>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>Student Interface</Label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setUIType("platform")}
              className={cn(
                "p-4 rounded-xl border-2 text-center transition-all",
                uiType === "platform"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <Monitor className={cn(
                "w-10 h-10 mx-auto mb-2",
                uiType === "platform" ? "text-primary" : "text-muted-foreground"
              )} />
              <h4 className="font-semibold text-sm mb-1">Platform UI</h4>
              <p className="text-xs text-muted-foreground">
                Standard interface with navigation aids
              </p>
            </button>
            
            <button
              onClick={() => setUIType("real_exam")}
              className={cn(
                "p-4 rounded-xl border-2 text-center transition-all",
                uiType === "real_exam"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <MonitorPlay className={cn(
                "w-10 h-10 mx-auto mb-2",
                uiType === "real_exam" ? "text-primary" : "text-muted-foreground"
              )} />
              <h4 className="font-semibold text-sm mb-1">Real Exam UI</h4>
              <p className="text-xs text-muted-foreground">
                Simulates actual JEE/NEET interface
              </p>
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          className="gradient-button gap-2"
          disabled={!canProceed}
          onClick={onNext}
        >
          Next
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

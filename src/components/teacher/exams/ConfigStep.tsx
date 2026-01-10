import { ArrowLeft, ArrowRight, Clock, FileQuestion, Award, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface ConfigStepProps {
  totalQuestions: number;
  setTotalQuestions: (n: number) => void;
  duration: number;
  setDuration: (n: number) => void;
  marksPerQuestion: number;
  setMarksPerQuestion: (n: number) => void;
  negativeMarking: boolean;
  setNegativeMarking: (b: boolean) => void;
  negativeMarks: number;
  setNegativeMarks: (n: number) => void;
  canProceed: boolean;
  onNext: () => void;
  onBack: () => void;
}

export const ConfigStep = ({
  totalQuestions,
  setTotalQuestions,
  duration,
  setDuration,
  marksPerQuestion,
  setMarksPerQuestion,
  negativeMarking,
  setNegativeMarking,
  negativeMarks,
  setNegativeMarks,
  canProceed,
  onNext,
  onBack,
}: ConfigStepProps) => {
  const totalMarks = totalQuestions * marksPerQuestion;
  
  return (
    <div className="space-y-4">
      {/* Quick summary card - Compact */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-3 flex items-center justify-around text-center">
        <div>
          <p className="text-lg font-bold text-primary">{totalQuestions}</p>
          <p className="text-[10px] text-muted-foreground">Questions</p>
        </div>
        <div className="w-px h-8 bg-border" />
        <div>
          <p className="text-lg font-bold text-primary">{duration}</p>
          <p className="text-[10px] text-muted-foreground">Minutes</p>
        </div>
        <div className="w-px h-8 bg-border" />
        <div>
          <p className="text-lg font-bold text-primary">{totalMarks}</p>
          <p className="text-[10px] text-muted-foreground">Total Marks</p>
        </div>
      </div>

      {/* Questions Count */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-1.5 text-xs">
            <FileQuestion className="w-3.5 h-3.5 text-muted-foreground" />
            Questions
          </Label>
          <span className="text-sm font-semibold text-primary">{totalQuestions}</span>
        </div>
        <Slider
          value={[totalQuestions]}
          onValueChange={([v]) => setTotalQuestions(v)}
          min={5}
          max={50}
          step={5}
          className="py-1"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>5</span>
          <span>50</span>
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-1.5 text-xs">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            Duration (min)
          </Label>
          <span className="text-sm font-semibold text-primary">{duration}</span>
        </div>
        <Slider
          value={[duration]}
          onValueChange={([v]) => setDuration(v)}
          min={10}
          max={180}
          step={5}
          className="py-1"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>10m</span>
          <span>3h</span>
        </div>
      </div>

      {/* Marks per Question - Compact buttons */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-1.5 text-xs">
            <Award className="w-3.5 h-3.5 text-muted-foreground" />
            Marks/Question
          </Label>
          <span className="text-sm font-semibold text-primary">{marksPerQuestion}</span>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 4, 5].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMarksPerQuestion(m)}
              className={cn(
                "flex-1 py-2 rounded-lg border-2 font-medium text-sm transition-all",
                "active:scale-[0.98]",
                marksPerQuestion === m
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/50"
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Negative Marking - Compact */}
      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Minus className="w-4 h-4 text-destructive" />
            </div>
            <div>
              <p className="font-medium text-xs">Negative Marking</p>
              <p className="text-[10px] text-muted-foreground">Deduct for wrong</p>
            </div>
          </div>
          <Switch
            checked={negativeMarking}
            onCheckedChange={setNegativeMarking}
          />
        </div>
        
        {negativeMarking && (
          <div className="flex items-center gap-2 pl-3">
            <Label className="text-xs">Deduct</Label>
            <Input
              type="number"
              value={negativeMarks}
              onChange={(e) => setNegativeMarks(Number(e.target.value))}
              className="w-16 h-9 text-center text-sm"
              min={0.25}
              max={marksPerQuestion}
              step={0.25}
            />
            <span className="text-xs text-muted-foreground">marks</span>
          </div>
        )}
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

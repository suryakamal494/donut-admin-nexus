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
    <div className="space-y-6">
      {/* Quick summary card */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 flex items-center justify-around text-center">
        <div>
          <p className="text-2xl font-bold text-primary">{totalQuestions}</p>
          <p className="text-xs text-muted-foreground">Questions</p>
        </div>
        <div className="w-px h-10 bg-border" />
        <div>
          <p className="text-2xl font-bold text-primary">{duration}</p>
          <p className="text-xs text-muted-foreground">Minutes</p>
        </div>
        <div className="w-px h-10 bg-border" />
        <div>
          <p className="text-2xl font-bold text-primary">{totalMarks}</p>
          <p className="text-xs text-muted-foreground">Total Marks</p>
        </div>
      </div>

      {/* Questions Count */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <FileQuestion className="w-4 h-4 text-muted-foreground" />
            Number of Questions
          </Label>
          <span className="text-lg font-semibold text-primary">{totalQuestions}</span>
        </div>
        <Slider
          value={[totalQuestions]}
          onValueChange={([v]) => setTotalQuestions(v)}
          min={5}
          max={50}
          step={5}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>5</span>
          <span>50</span>
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            Duration (minutes)
          </Label>
          <span className="text-lg font-semibold text-primary">{duration}</span>
        </div>
        <Slider
          value={[duration]}
          onValueChange={([v]) => setDuration(v)}
          min={10}
          max={180}
          step={5}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>10 min</span>
          <span>3 hours</span>
        </div>
      </div>

      {/* Marks per Question */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Award className="w-4 h-4 text-muted-foreground" />
            Marks per Question
          </Label>
          <span className="text-lg font-semibold text-primary">{marksPerQuestion}</span>
        </div>
        <div className="flex gap-2">
          {[1, 2, 4, 5].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMarksPerQuestion(m)}
              className={cn(
                "flex-1 py-3 rounded-lg border-2 font-medium transition-all",
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

      {/* Negative Marking */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Minus className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="font-medium">Negative Marking</p>
              <p className="text-xs text-muted-foreground">Deduct marks for wrong answers</p>
            </div>
          </div>
          <Switch
            checked={negativeMarking}
            onCheckedChange={setNegativeMarking}
          />
        </div>
        
        {negativeMarking && (
          <div className="flex items-center gap-3 pl-4">
            <Label className="text-sm">Deduct</Label>
            <Input
              type="number"
              value={negativeMarks}
              onChange={(e) => setNegativeMarks(Number(e.target.value))}
              className="w-20 h-10 text-center"
              min={0.25}
              max={marksPerQuestion}
              step={0.25}
            />
            <span className="text-sm text-muted-foreground">marks</span>
          </div>
        )}
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

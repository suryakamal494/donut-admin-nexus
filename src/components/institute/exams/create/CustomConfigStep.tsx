import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface CustomConfigStepProps {
  totalQuestions: number;
  setTotalQuestions: (value: number) => void;
  duration: number;
  setDuration: (value: number) => void;
  marksPerQuestion: number;
  setMarksPerQuestion: (value: number) => void;
  negativeMarking: boolean;
  setNegativeMarking: (value: boolean) => void;
  negativeMarks: number;
  setNegativeMarks: (value: number) => void;
  canProceed: boolean;
  onNext: () => void;
  onBack: () => void;
}

export const CustomConfigStep = ({
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
}: CustomConfigStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-1">Exam Configuration</h3>
        <p className="text-muted-foreground text-sm">Define your custom exam parameters</p>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Total Questions</Label>
            <Input 
              type="number"
              value={totalQuestions}
              onChange={(e) => setTotalQuestions(Number(e.target.value))}
              min={1}
            />
          </div>
          <div className="space-y-2">
            <Label>Duration (minutes)</Label>
            <Input 
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min={1}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Marks per Question</Label>
            <Input 
              type="number"
              value={marksPerQuestion}
              onChange={(e) => setMarksPerQuestion(Number(e.target.value))}
              min={1}
            />
          </div>
          <div className="space-y-2">
            <Label>Total Marks</Label>
            <Input 
              type="number"
              value={totalQuestions * marksPerQuestion}
              disabled
              className="bg-muted"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl border">
          <Checkbox 
            id="negativeMarking"
            checked={negativeMarking}
            onCheckedChange={(checked) => setNegativeMarking(checked as boolean)}
          />
          <div className="flex-1">
            <Label htmlFor="negativeMarking" className="cursor-pointer">Enable Negative Marking</Label>
            <p className="text-xs text-muted-foreground">Deduct marks for wrong answers</p>
          </div>
          {negativeMarking && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">-</span>
              <Input 
                type="number"
                value={negativeMarks}
                onChange={(e) => setNegativeMarks(Number(e.target.value))}
                className="w-16"
                min={0}
                step={0.25}
              />
            </div>
          )}
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

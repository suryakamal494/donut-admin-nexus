import { cn } from "@/lib/utils";
import { Check, FileText, Settings, Sparkles, Users } from "lucide-react";

interface TeacherExamStepperProps {
  currentStep: number;
  totalSteps: number;
  pattern: string;
}

export const TeacherExamStepper = ({ currentStep, totalSteps, pattern }: TeacherExamStepperProps) => {
  const isCustom = pattern === "custom";
  
  const steps = isCustom ? [
    { label: "Details", icon: FileText },
    { label: "Pattern", icon: Settings },
    { label: "Config", icon: Settings },
    { label: "Questions", icon: Sparkles },
    { label: "Assign", icon: Users },
  ] : [
    { label: "Details", icon: FileText },
    { label: "Pattern", icon: Settings },
    { label: "Questions", icon: Sparkles },
    { label: "Assign", icon: Users },
  ];

  return (
    <div className="w-full">
      {/* Mobile: Compact progress bar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-muted-foreground">
            {steps[currentStep - 1]?.label}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        {/* Progress dots - enlarged for touch */}
        <div className="flex justify-center gap-3 mt-3">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "h-3 rounded-full transition-all duration-200",
                idx + 1 < currentStep && "bg-primary w-3",
                idx + 1 === currentStep && "bg-primary w-8",
                idx + 1 > currentStep && "bg-muted-foreground/30 w-3"
              )}
            />
          ))}
        </div>
      </div>

      {/* Desktop: Full stepper */}
      <div className="hidden md:flex items-center justify-center gap-0">
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          
          return (
            <div key={idx} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
                    isCompleted && "bg-primary text-primary-foreground",
                    isCurrent && "bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/30",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                </div>
                <span className={cn(
                  "text-xs mt-1.5 font-medium",
                  isCurrent ? "text-primary" : "text-muted-foreground"
                )}>
                  {step.label}
                </span>
              </div>
              
              {idx < steps.length - 1 && (
                <div className={cn(
                  "w-12 h-0.5 mx-2 mb-5 rounded-full transition-colors",
                  stepNum < currentStep ? "bg-primary" : "bg-muted"
                )} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

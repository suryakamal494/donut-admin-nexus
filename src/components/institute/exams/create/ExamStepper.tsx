import { FileText, Monitor, Sparkles, Users, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PatternType } from "@/hooks/useExamCreation";

interface ExamStepperProps {
  currentStep: number;
  totalSteps: number;
  pattern: PatternType;
}

export const ExamStepper = ({ currentStep, totalSteps, pattern }: ExamStepperProps) => {
  const steps = [
    { number: 1, title: "Exam Details", icon: FileText },
    { number: 2, title: "Pattern & UI", icon: Monitor },
    { number: 3, title: pattern === "custom" ? "Configuration" : "Creation Method", icon: pattern === "custom" ? FileText : Sparkles },
    { number: 4, title: pattern === "custom" ? "Creation Method" : "Batch Assignment", icon: pattern === "custom" ? Sparkles : Users },
    { number: 5, title: pattern === "custom" ? "Batch Assignment" : "Complete", icon: pattern === "custom" ? Users : CheckCircle2 },
    ...(pattern === "custom" ? [{ number: 6, title: "Complete", icon: CheckCircle2 }] : []),
  ];

  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
      <div className="flex items-center justify-between max-w-4xl mx-auto overflow-x-auto">
        {steps.slice(0, totalSteps).map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center min-w-[60px]">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                  currentStep === step.number
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : currentStep > step.number
                    ? "bg-success text-success-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <step.icon className="w-4 h-4" />
              </div>
              <span className={cn(
                "text-xs mt-2 font-medium text-center max-w-[70px]",
                currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.title}
              </span>
            </div>
            {index < totalSteps - 1 && (
              <div className={cn(
                "w-8 sm:w-12 h-1 mx-1 rounded-full",
                currentStep > step.number ? "bg-success" : "bg-muted"
              )} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

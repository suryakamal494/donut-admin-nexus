import { useState } from "react";
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  FileUp, 
  Database,
  Upload,
  X,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { difficultyPresets, cognitiveTypes } from "@/hooks/useTeacherExamCreation";
import { TeacherQuestionBankSheet } from "./TeacherQuestionBankSheet";

type CreationMethod = "ai" | "pdf" | "questionBank";

interface CreationMethodStepProps {
  creationMethod: CreationMethod;
  setCreationMethod: (method: CreationMethod) => void;
  easyPercent: number;
  mediumPercent: number;
  hardPercent: number;
  adjustDifficulty: (type: 'easy' | 'medium' | 'hard', value: number) => void;
  applyDifficultyPreset: (preset: { easy: number; medium: number; hard: number }) => void;
  selectedCognitiveTypes: string[];
  toggleCognitiveType: (type: string) => void;
  uploadedFile: File | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedSubjects: string[];
  selectedQuestionIds: string[];
  setSelectedQuestionIds: (ids: string[]) => void;
  canProceed: boolean;
  onNext: () => void;
  onBack: () => void;
}

const methodOptions = [
  { 
    id: "ai" as const, 
    label: "AI Generate", 
    description: "Create with AI",
    icon: Sparkles,
    gradient: "from-purple-500 to-pink-500"
  },
  { 
    id: "pdf" as const, 
    label: "Upload PDF", 
    description: "Extract questions",
    icon: FileUp,
    gradient: "from-blue-500 to-cyan-500"
  },
  { 
    id: "questionBank" as const, 
    label: "Question Bank", 
    description: "Select existing",
    icon: Database,
    gradient: "from-amber-500 to-orange-500"
  },
];

export const CreationMethodStep = ({
  creationMethod,
  setCreationMethod,
  easyPercent,
  mediumPercent,
  hardPercent,
  adjustDifficulty,
  applyDifficultyPreset,
  selectedCognitiveTypes,
  toggleCognitiveType,
  uploadedFile,
  handleFileChange,
  selectedSubjects,
  selectedQuestionIds,
  setSelectedQuestionIds,
  canProceed,
  onNext,
  onBack,
}: CreationMethodStepProps) => {
  const [showQuestionBank, setShowQuestionBank] = useState(false);

  const clearFile = () => {
    const input = document.getElementById('pdf-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Method Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">How do you want to create questions?</Label>
        
        <div className="grid grid-cols-3 gap-2">
          {methodOptions.map((opt) => {
            const isSelected = creationMethod === opt.id;
            const Icon = opt.icon;
            
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setCreationMethod(opt.id)}
                className={cn(
                  "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                  "active:scale-[0.98]",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 bg-card"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  isSelected 
                    ? `bg-gradient-to-br ${opt.gradient} text-white` 
                    : "bg-muted"
                )}>
                  <Icon className={cn(
                    "w-5 h-5",
                    !isSelected && "text-muted-foreground"
                  )} />
                </div>
                <span className={cn(
                  "font-medium text-xs text-center",
                  isSelected ? "text-primary" : "text-foreground"
                )}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Configuration */}
      {creationMethod === "ai" && (
        <div className="space-y-5">
          {/* Difficulty Distribution */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Difficulty Distribution</Label>
            
            {/* Presets */}
            <div className="flex gap-2">
              {difficultyPresets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="sm"
                  onClick={() => applyDifficultyPreset(preset)}
                  className={cn(
                    "flex-1 text-xs",
                    easyPercent === preset.easy && mediumPercent === preset.medium && "border-primary"
                  )}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            
            {/* Visual Bar */}
            <div className="h-4 rounded-full overflow-hidden flex">
              <div 
                className="bg-emerald-500 transition-all" 
                style={{ width: `${easyPercent}%` }}
              />
              <div 
                className="bg-amber-500 transition-all" 
                style={{ width: `${mediumPercent}%` }}
              />
              <div 
                className="bg-rose-500 transition-all" 
                style={{ width: `${hardPercent}%` }}
              />
            </div>
            
            {/* Legend */}
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Easy {easyPercent}%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Medium {mediumPercent}%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Hard {hardPercent}%
              </span>
            </div>
          </div>

          {/* Cognitive Types */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Question Types</Label>
            <div className="flex flex-wrap gap-2">
              {cognitiveTypes.map((type) => {
                const isSelected = selectedCognitiveTypes.includes(type.id);
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => toggleCognitiveType(type.id)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-xs font-medium border transition-all",
                      "active:scale-[0.98]",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50 text-muted-foreground"
                    )}
                  >
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* PDF Upload */}
      {creationMethod === "pdf" && (
        <div className="space-y-4">
          {!uploadedFile ? (
            <label
              htmlFor="pdf-upload"
              className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-muted-foreground/30 rounded-xl cursor-pointer hover:border-primary/50 transition-colors"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-7 h-7 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">Upload PDF</p>
                <p className="text-sm text-muted-foreground">Max 50MB</p>
              </div>
              <input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={clearFile}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Question Bank */}
      {creationMethod === "questionBank" && (
        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full h-14 justify-between"
            onClick={() => setShowQuestionBank(true)}
          >
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-primary" />
              <span>Select from Question Bank</span>
            </div>
            {selectedQuestionIds.length > 0 && (
              <Badge className="bg-primary text-primary-foreground">
                {selectedQuestionIds.length} selected
              </Badge>
            )}
          </Button>
          
          {selectedQuestionIds.length > 0 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
              <span>{selectedQuestionIds.length} questions selected</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedQuestionIds([])}
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      )}

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

      {/* Question Bank Sheet */}
      <TeacherQuestionBankSheet
        open={showQuestionBank}
        onOpenChange={setShowQuestionBank}
        selectedSubjects={selectedSubjects}
        selectedQuestionIds={selectedQuestionIds}
        onSelectionChange={setSelectedQuestionIds}
      />
    </div>
  );
};

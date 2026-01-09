import { ArrowLeft, ArrowRight, Sparkles, FileUp, Library, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { CreationMethod, cognitiveTypes, difficultyPresets } from "@/hooks/useExamCreation";
import { QuestionBankSelector } from "@/components/institute/exams";

interface CreationMethodStepProps {
  creationMethod: CreationMethod;
  setCreationMethod: (method: CreationMethod) => void;
  
  // AI config
  easyPercent: number;
  mediumPercent: number;
  hardPercent: number;
  adjustDifficulty: (type: 'easy' | 'medium' | 'hard', value: number) => void;
  applyDifficultyPreset: (preset: { easy: number; medium: number; hard: number }) => void;
  selectedCognitiveTypes: string[];
  toggleCognitiveType: (typeId: string) => void;
  
  // PDF upload
  uploadedFile: File | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  // Question Bank
  selectedCourse: string;
  selectedClassId: string;
  selectedSubjects: string[];
  isCBSE: boolean;
  selectedQuestionIds: string[];
  setSelectedQuestionIds: (ids: string[]) => void;
  
  canProceed: boolean;
  onNext: () => void;
  onBack: () => void;
}

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
  selectedCourse,
  selectedClassId,
  selectedSubjects,
  isCBSE,
  selectedQuestionIds,
  setSelectedQuestionIds,
  canProceed,
  onNext,
  onBack,
}: CreationMethodStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-1">How do you want to create questions?</h3>
        <p className="text-muted-foreground text-sm">Choose your preferred method</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <button
          onClick={() => setCreationMethod("ai")}
          className={cn(
            "p-4 sm:p-6 rounded-xl border-2 text-center transition-all",
            creationMethod === "ai"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          )}
        >
          <Sparkles className={cn(
            "w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3",
            creationMethod === "ai" ? "text-primary" : "text-muted-foreground"
          )} />
          <h4 className="font-semibold text-sm sm:text-base mb-1">Generate using AI</h4>
          <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
            AI will create questions based on your specifications
          </p>
        </button>
        
        <button
          onClick={() => setCreationMethod("pdf")}
          className={cn(
            "p-4 sm:p-6 rounded-xl border-2 text-center transition-all",
            creationMethod === "pdf"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          )}
        >
          <FileUp className={cn(
            "w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3",
            creationMethod === "pdf" ? "text-primary" : "text-muted-foreground"
          )} />
          <h4 className="font-semibold text-sm sm:text-base mb-1">Upload PDF</h4>
          <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
            Upload a question paper PDF and we'll extract questions
          </p>
        </button>
        
        <button
          onClick={() => setCreationMethod("questionBank")}
          className={cn(
            "p-4 sm:p-6 rounded-xl border-2 text-center transition-all",
            creationMethod === "questionBank"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          )}
        >
          <Library className={cn(
            "w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3",
            creationMethod === "questionBank" ? "text-primary" : "text-muted-foreground"
          )} />
          <h4 className="font-semibold text-sm sm:text-base mb-1">Select from Bank</h4>
          <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
            Choose questions from your approved question pool
          </p>
        </button>
      </div>

      {creationMethod === "ai" && (
        <div className="space-y-6 p-4 rounded-xl bg-muted/30">
          {/* Difficulty Distribution with Presets */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Difficulty Distribution</Label>
              <div className="flex gap-2">
                {difficultyPresets.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "text-xs",
                      easyPercent === preset.easy && mediumPercent === preset.medium && hardPercent === preset.hard
                        ? "border-primary bg-primary/10"
                        : ""
                    )}
                    onClick={() => applyDifficultyPreset(preset)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-success">Easy</span>
                  <span className="text-sm font-bold w-12 text-right">{easyPercent}%</span>
                </div>
                <Slider
                  value={[easyPercent]}
                  onValueChange={([v]) => adjustDifficulty('easy', v)}
                  max={100}
                  step={1}
                  className="[&_[role=slider]]:bg-success"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-warning">Medium</span>
                  <span className="text-sm font-bold w-12 text-right">{mediumPercent}%</span>
                </div>
                <Slider
                  value={[mediumPercent]}
                  onValueChange={([v]) => adjustDifficulty('medium', v)}
                  max={100}
                  step={1}
                  className="[&_[role=slider]]:bg-warning"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-destructive">Hard</span>
                  <span className="text-sm font-bold w-12 text-right">{hardPercent}%</span>
                </div>
                <Slider
                  value={[hardPercent]}
                  onValueChange={([v]) => adjustDifficulty('hard', v)}
                  max={100}
                  step={1}
                  className="[&_[role=slider]]:bg-destructive"
                />
              </div>
            </div>
          </div>

          {/* Cognitive Types Selection */}
          <div className="space-y-3">
            <Label>Cognitive Types *</Label>
            <p className="text-xs text-muted-foreground">Select at least one type of questions to generate</p>
            <div className="grid grid-cols-2 gap-2">
              {cognitiveTypes.map((type) => (
                <label
                  key={type.id}
                  className={cn(
                    "flex items-start gap-2 p-3 rounded-lg border cursor-pointer transition-all",
                    selectedCognitiveTypes.includes(type.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <Checkbox 
                    checked={selectedCognitiveTypes.includes(type.id)}
                    onCheckedChange={() => toggleCognitiveType(type.id)}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-medium">{type.label}</p>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {creationMethod === "pdf" && (
        <div 
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
            uploadedFile ? "border-success bg-success/5" : "border-border hover:border-primary/50"
          )}
        >
          <input
            type="file"
            id="pdf-upload"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <label htmlFor="pdf-upload" className="cursor-pointer">
            {uploadedFile ? (
              <div className="space-y-2">
                <FileText className="w-12 h-12 text-success mx-auto" />
                <p className="font-medium text-foreground">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Change File
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                <p className="font-medium text-foreground">
                  Drag & drop a question paper PDF
                </p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
              </div>
            )}
          </label>
        </div>
      )}

      {creationMethod === "questionBank" && (
        <div className="p-4 rounded-xl bg-muted/30 border">
          <QuestionBankSelector
            selectedCourse={selectedCourse}
            selectedClassId={selectedClassId}
            selectedSubjects={selectedSubjects}
            isCBSE={isCBSE}
            selectedQuestionIds={selectedQuestionIds}
            onSelectionChange={setSelectedQuestionIds}
          />
        </div>
      )}
      
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

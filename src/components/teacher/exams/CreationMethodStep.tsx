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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { difficultyPresets, cognitiveTypes } from "@/hooks/useTeacherExamCreation";
import { TeacherQuestionBankSheet } from "./TeacherQuestionBankSheet";
import { AIGenerationSheet } from "./AIGenerationSheet";

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
  clearUploadedFile: () => void;
  selectedSubjects: string[];
  selectedQuestionIds: string[];
  setSelectedQuestionIds: (ids: string[]) => void;
  totalQuestions: number;
  canProceed: boolean;
  onNext: () => void;
  onBack: () => void;
}

const methodOptions = [
  { 
    id: "ai" as const, 
    label: "AI", 
    description: "Generate",
    icon: Sparkles,
    gradient: "from-purple-500 to-pink-500"
  },
  { 
    id: "pdf" as const, 
    label: "PDF", 
    description: "Upload",
    icon: FileUp,
    gradient: "from-blue-500 to-cyan-500"
  },
  { 
    id: "questionBank" as const, 
    label: "Bank", 
    description: "Select",
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
  clearUploadedFile,
  selectedSubjects,
  selectedQuestionIds,
  setSelectedQuestionIds,
  totalQuestions,
  canProceed,
  onNext,
  onBack,
}: CreationMethodStepProps) => {
  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const [showAISheet, setShowAISheet] = useState(false);

  const clearFile = () => {
    const input = document.getElementById('pdf-upload') as HTMLInputElement;
    if (input) input.value = '';
    clearUploadedFile();
  };

  const handleAIAccept = (questions: any[]) => {
    // Handle accepted AI-generated questions
    const ids = questions.map(q => q.id);
    setSelectedQuestionIds(ids);
  };

  return (
    <div className="space-y-4">
      {/* Method Selection - Compact 3-column grid */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Creation Method</Label>
        
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
                  "relative flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all duration-200",
                  "active:scale-[0.98]",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 bg-card"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  isSelected 
                    ? `bg-gradient-to-br ${opt.gradient} text-white` 
                    : "bg-muted"
                )}>
                  <Icon className={cn(
                    "w-4 h-4",
                    !isSelected && "text-muted-foreground"
                  )} />
                </div>
                <span className={cn(
                  "font-medium text-xs text-center",
                  isSelected ? "text-primary" : "text-foreground"
                )}>
                  {opt.label}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {opt.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Configuration - Opens AI Sheet */}
      {creationMethod === "ai" && (
        <div className="space-y-3">
          {/* Difficulty Distribution - Compact */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Difficulty Mix</Label>
            
            {/* Presets - Smaller buttons */}
            <div className="flex gap-1.5">
              {difficultyPresets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="sm"
                  onClick={() => applyDifficultyPreset(preset)}
                  className={cn(
                    "flex-1 text-[10px] h-7 px-2",
                    easyPercent === preset.easy && mediumPercent === preset.medium && "border-primary"
                  )}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            
            {/* Visual Bar - Thinner */}
            <div className="h-2 rounded-full overflow-hidden flex">
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
            
            {/* Legend - Compact */}
            <div className="flex justify-between text-[10px]">
              <span className="flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Easy {easyPercent}%
              </span>
              <span className="flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Med {mediumPercent}%
              </span>
              <span className="flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                Hard {hardPercent}%
              </span>
            </div>
          </div>

          {/* Cognitive Types - Compact */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Question Types</Label>
            <div className="flex flex-wrap gap-1.5">
              {cognitiveTypes.map((type) => {
                const isSelected = selectedCognitiveTypes.includes(type.id);
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => toggleCognitiveType(type.id)}
                    className={cn(
                      "px-2.5 py-1.5 rounded-md text-[10px] font-medium border transition-all",
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

          {/* Generate Button */}
          <Button
            variant="outline"
            className="w-full h-11 justify-between"
            onClick={() => setShowAISheet(true)}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm">Generate with AI</span>
            </div>
            {selectedQuestionIds.length > 0 && (
              <Badge className="bg-primary text-primary-foreground text-[10px]">
                {selectedQuestionIds.length} ready
              </Badge>
            )}
          </Button>
        </div>
      )}

      {/* PDF Upload - Compact */}
      {creationMethod === "pdf" && (
        <div className="space-y-3">
          {!uploadedFile ? (
            <label
              htmlFor="pdf-upload"
              className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium text-sm text-foreground">Upload PDF</p>
                <p className="text-[10px] text-muted-foreground">Max 50MB</p>
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
            <div className="flex items-center gap-2.5 p-3 bg-muted/50 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{uploadedFile.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={clearFile}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Question Bank - Compact */}
      {creationMethod === "questionBank" && (
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full h-11 justify-between"
            onClick={() => setShowQuestionBank(true)}
          >
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" />
              <span className="text-sm">Select from Bank</span>
            </div>
            {selectedQuestionIds.length > 0 && (
              <Badge className="bg-primary text-primary-foreground text-[10px]">
                {selectedQuestionIds.length} selected
              </Badge>
            )}
          </Button>
          
          {selectedQuestionIds.length > 0 && (
            <div className="flex items-center justify-between text-xs text-muted-foreground p-2.5 bg-muted/50 rounded-lg">
              <span>{selectedQuestionIds.length} questions selected</span>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-7 text-xs"
                onClick={() => setSelectedQuestionIds([])}
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      )}

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

      {/* Sheets */}
      <TeacherQuestionBankSheet
        open={showQuestionBank}
        onOpenChange={setShowQuestionBank}
        selectedSubjects={selectedSubjects}
        selectedQuestionIds={selectedQuestionIds}
        onSelectionChange={setSelectedQuestionIds}
      />

      <AIGenerationSheet
        open={showAISheet}
        onOpenChange={setShowAISheet}
        onAccept={handleAIAccept}
        subjects={selectedSubjects}
        totalQuestions={totalQuestions}
      />
    </div>
  );
};

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { currentTeacher } from "@/data/teacher/profile";
import { examPatternConfig } from "@/data/examsData";

export type PatternType = "custom" | "jee_main" | "jee_advanced" | "neet";
export type UIType = "platform" | "real_exam";
export type CreationMethod = "ai" | "pdf" | "questionBank";

// Cognitive Types
export const cognitiveTypes = [
  { id: "logical", label: "Logical", description: "Deductive and inductive reasoning" },
  { id: "analytical", label: "Analytical", description: "Breaking down complex problems" },
  { id: "conceptual", label: "Conceptual", description: "Grasping core concepts" },
  { id: "numerical", label: "Numerical", description: "Mathematical calculations" },
  { id: "application", label: "Application", description: "Real-world problem solving" },
  { id: "memory", label: "Memory", description: "Facts and information recall" },
];

// Difficulty presets
export const difficultyPresets = [
  { label: "Balanced", easy: 33, medium: 34, hard: 33 },
  { label: "Easy Focus", easy: 50, medium: 35, hard: 15 },
  { label: "Hard Focus", easy: 15, medium: 35, hard: 50 },
];

export interface TeacherExamCreationState {
  currentStep: number;
  isProcessing: boolean;
  processComplete: boolean;
  
  // Step 1: Exam Details (simplified - no course selection, teacher's subjects only)
  examName: string;
  selectedSubjects: string[];
  
  // Step 2: Pattern & UI
  pattern: PatternType;
  uiType: UIType;
  
  // Step 3: Custom Config (if pattern === "custom")
  totalQuestions: number;
  duration: number;
  marksPerQuestion: number;
  negativeMarking: boolean;
  negativeMarks: number;
  
  // Step 4: Creation Method
  creationMethod: CreationMethod;
  uploadedFile: File | null;
  easyPercent: number;
  mediumPercent: number;
  hardPercent: number;
  selectedCognitiveTypes: string[];
  
  // Step 5: Batch & Schedule (pre-filtered to teacher's batches)
  selectedBatches: string[];
  scheduleDate: Date | undefined;
  scheduleTime: string;
  
  // Question Bank
  selectedQuestionIds: string[];
}

export const useTeacherExamCreation = () => {
  const navigate = useNavigate();
  
  // Step navigation
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processComplete, setProcessComplete] = useState(false);
  
  // Step 1: Exam Details (teacher-scoped)
  const [examName, setExamName] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  
  // Step 2: Pattern & UI
  const [pattern, setPattern] = useState<PatternType>("custom");
  const [uiType, setUIType] = useState<UIType>("platform");
  
  // Step 3: Custom Config
  const [totalQuestions, setTotalQuestions] = useState(20);
  const [duration, setDuration] = useState(30);
  const [marksPerQuestion, setMarksPerQuestion] = useState(4);
  const [negativeMarking, setNegativeMarking] = useState(false);
  const [negativeMarks, setNegativeMarks] = useState(1);
  
  // Step 4: Creation Method
  const [creationMethod, setCreationMethod] = useState<CreationMethod>("ai");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [easyPercent, setEasyPercent] = useState(33);
  const [mediumPercent, setMediumPercent] = useState(34);
  const [hardPercent, setHardPercent] = useState(33);
  const [selectedCognitiveTypes, setSelectedCognitiveTypes] = useState<string[]>(["conceptual", "application"]);
  
  // Step 5: Batch & Schedule
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>();
  const [scheduleTime, setScheduleTime] = useState("");
  
  // Question Bank
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  
  // Teacher's available subjects (from profile)
  const teacherSubjects = useMemo(() => currentTeacher.subjects, []);
  
  // Teacher's available batches (from profile)  
  const teacherBatches = useMemo(() => {
    // Mock batch data - in real app this would come from context/API
    return [
      { id: "batch-10a", name: "10A", className: "Class 10" },
      { id: "batch-10b", name: "10B", className: "Class 10" },
      { id: "batch-11a", name: "11A", className: "Class 11" },
    ].filter(b => currentTeacher.assignedBatches.includes(b.id));
  }, []);
  
  // Group batches by class
  const batchesByClass = useMemo(() => {
    return teacherBatches.reduce((acc, batch) => {
      if (!acc[batch.className]) {
        acc[batch.className] = [];
      }
      acc[batch.className].push(batch);
      return acc;
    }, {} as Record<string, typeof teacherBatches>);
  }, [teacherBatches]);
  
  // Pattern config
  const isStandardPattern = pattern !== "custom";
  const selectedPatternConfig = isStandardPattern ? examPatternConfig[pattern as keyof typeof examPatternConfig] : null;
  const totalSteps = pattern === "custom" ? 5 : 4;
  
  // Validation
  const canProceedStep1 = examName.trim().length > 0 && selectedSubjects.length > 0;
  const canProceedStep2 = !!pattern && !!uiType;
  const canProceedStep3Custom = totalQuestions > 0 && duration > 0;
  const canProceedCreation = creationMethod === "ai" 
    ? selectedCognitiveTypes.length > 0 
    : creationMethod === "questionBank" 
      ? selectedQuestionIds.length > 0 
      : uploadedFile !== null;
  
  // Handlers
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast.error("File size must be less than 50MB");
        return;
      }
      setUploadedFile(file);
    }
  }, []);
  
  const toggleSubject = useCallback((subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  }, []);
  
  const toggleBatch = useCallback((batchId: string) => {
    setSelectedBatches(prev => 
      prev.includes(batchId) 
        ? prev.filter(b => b !== batchId)
        : [...prev, batchId]
    );
  }, []);
  
  const toggleCognitiveType = useCallback((typeId: string) => {
    setSelectedCognitiveTypes(prev => 
      prev.includes(typeId)
        ? prev.filter(t => t !== typeId)
        : [...prev, typeId]
    );
  }, []);
  
  const applyDifficultyPreset = useCallback((preset: { easy: number; medium: number; hard: number }) => {
    setEasyPercent(preset.easy);
    setMediumPercent(preset.medium);
    setHardPercent(preset.hard);
  }, []);
  
  const adjustDifficulty = useCallback((type: 'easy' | 'medium' | 'hard', value: number) => {
    const remaining = 100 - value;
    if (type === 'easy') {
      setEasyPercent(value);
      const ratio = mediumPercent / (mediumPercent + hardPercent || 1);
      setMediumPercent(Math.round(remaining * ratio));
      setHardPercent(remaining - Math.round(remaining * ratio));
    } else if (type === 'medium') {
      setMediumPercent(value);
      const ratio = easyPercent / (easyPercent + hardPercent || 1);
      setEasyPercent(Math.round(remaining * ratio));
      setHardPercent(remaining - Math.round(remaining * ratio));
    } else {
      setHardPercent(value);
      const ratio = easyPercent / (easyPercent + mediumPercent || 1);
      setEasyPercent(Math.round(remaining * ratio));
      setMediumPercent(remaining - Math.round(remaining * ratio));
    }
  }, [easyPercent, mediumPercent, hardPercent]);
  
  const handleCreate = useCallback((skipBatch: boolean = false) => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setProcessComplete(true);
      if (skipBatch) {
        toast.success("Exam created! You can assign batches later.");
      } else {
        toast.success("Exam created successfully!");
      }
    }, 1500);
  }, []);
  
  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);
  
  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  }, [totalSteps]);
  
  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);
  
  // Reset form
  const resetForm = useCallback(() => {
    setCurrentStep(1);
    setIsProcessing(false);
    setProcessComplete(false);
    setExamName("");
    setSelectedSubjects([]);
    setPattern("custom");
    setUIType("platform");
    setTotalQuestions(20);
    setDuration(30);
    setMarksPerQuestion(4);
    setNegativeMarking(false);
    setNegativeMarks(1);
    setCreationMethod("ai");
    setUploadedFile(null);
    setEasyPercent(33);
    setMediumPercent(34);
    setHardPercent(33);
    setSelectedCognitiveTypes(["conceptual", "application"]);
    setSelectedBatches([]);
    setScheduleDate(undefined);
    setScheduleTime("");
    setSelectedQuestionIds([]);
  }, []);

  return {
    // Navigation
    navigate,
    currentStep,
    goToStep,
    nextStep,
    prevStep,
    totalSteps,
    isProcessing,
    processComplete,
    resetForm,
    
    // Teacher Data
    teacherSubjects,
    teacherBatches,
    batchesByClass,
    
    // Step 1
    examName,
    setExamName,
    selectedSubjects,
    toggleSubject,
    canProceedStep1,
    
    // Step 2
    pattern,
    setPattern,
    uiType,
    setUIType,
    isStandardPattern,
    selectedPatternConfig,
    canProceedStep2,
    
    // Step 3
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
    canProceedStep3Custom,
    
    // Step 4
    creationMethod,
    setCreationMethod,
    uploadedFile,
    clearUploadedFile: useCallback(() => setUploadedFile(null), []),
    handleFileChange,
    easyPercent,
    mediumPercent,
    hardPercent,
    adjustDifficulty,
    applyDifficultyPreset,
    selectedCognitiveTypes,
    toggleCognitiveType,
    canProceedCreation,
    
    // Step 5
    selectedBatches,
    toggleBatch,
    scheduleDate,
    setScheduleDate,
    scheduleTime,
    setScheduleTime,
    
    // Question Bank
    selectedQuestionIds,
    setSelectedQuestionIds,
    
    // Actions
    handleCreate,
  };
};

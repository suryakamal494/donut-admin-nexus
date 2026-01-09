import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { batches, assignedTracks } from "@/data/instituteData";
import { examPatternConfig } from "@/data/examsData";
import { getSubjectsForCourse } from "@/data/masterData";
import { getSubjectsByClass } from "@/data/cbseMasterData";

export type PatternType = "custom" | "jee_main" | "jee_advanced" | "neet";
export type UIType = "platform" | "real_exam";
export type CreationMethod = "ai" | "pdf" | "questionBank";

// Cognitive Types
export const cognitiveTypes = [
  { id: "logical", label: "Logical Reasoning", description: "Deductive and inductive reasoning" },
  { id: "analytical", label: "Analytical Thinking", description: "Breaking down complex problems" },
  { id: "conceptual", label: "Conceptual Understanding", description: "Grasping core concepts" },
  { id: "numerical", label: "Numerical Ability", description: "Mathematical calculations" },
  { id: "application", label: "Application-Based", description: "Real-world problem solving" },
  { id: "memory", label: "Memory/Recall", description: "Facts and information recall" },
];

// Difficulty presets
export const difficultyPresets = [
  { label: "Balanced", easy: 33, medium: 34, hard: 33 },
  { label: "Easy Focus", easy: 50, medium: 35, hard: 15 },
  { label: "Hard Focus", easy: 15, medium: 35, hard: 50 },
];

export interface ExamCreationState {
  // Step navigation
  currentStep: number;
  isProcessing: boolean;
  processComplete: boolean;
  
  // Step 1: Basic Config
  examName: string;
  selectedCourse: string;
  selectedClassId: string;
  selectedSubjects: string[];
  
  // Step 2: Pattern & UI
  pattern: PatternType;
  uiType: UIType;
  
  // Step 3: Custom Config
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
  
  // Step 5: Batch & Schedule
  selectedBatches: string[];
  scheduleDate: Date | undefined;
  scheduleTime: string;
  
  // Question Bank
  selectedQuestionIds: string[];
}

export const useExamCreation = () => {
  const navigate = useNavigate();
  
  // Step navigation
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processComplete, setProcessComplete] = useState(false);
  
  // Step 1: Basic Config
  const [examName, setExamName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  
  // Step 2: Pattern & UI
  const [pattern, setPattern] = useState<PatternType>("custom");
  const [uiType, setUIType] = useState<UIType>("platform");
  
  // Step 3: Custom Config
  const [totalQuestions, setTotalQuestions] = useState(30);
  const [duration, setDuration] = useState(60);
  const [marksPerQuestion, setMarksPerQuestion] = useState(4);
  const [negativeMarking, setNegativeMarking] = useState(true);
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
  
  // Auto-scroll refs
  const classSelectRef = useRef<HTMLDivElement>(null);
  const subjectSelectRef = useRef<HTMLDivElement>(null);
  
  // Derived state
  const selectedTrack = assignedTracks.find(t => t.id === selectedCourse);
  const isCBSE = selectedTrack?.hasClasses ?? false;
  
  const availableSubjects = selectedCourse
    ? isCBSE
      ? selectedClassId
        ? getSubjectsByClass(selectedClassId).map(s => ({ id: s.id, name: s.name }))
        : []
      : getSubjectsForCourse(selectedCourse).map(s => ({ id: s.id, name: s.name }))
    : [];
  
  const batchesByClass = batches.reduce((acc, batch) => {
    if (!acc[batch.className]) {
      acc[batch.className] = [];
    }
    acc[batch.className].push(batch);
    return acc;
  }, {} as Record<string, typeof batches>);
  
  const isStandardPattern = pattern !== "custom";
  const selectedPatternConfig = isStandardPattern ? examPatternConfig[pattern as keyof typeof examPatternConfig] : null;
  const totalSteps = pattern === "custom" ? 6 : 5;
  
  // Validation
  const canProceedStep1 = examName && selectedCourse && selectedSubjects.length > 0 && (!isCBSE || selectedClassId);
  const canProceedStep2 = pattern && uiType;
  const canProceedStep3Custom = totalQuestions > 0 && duration > 0;
  const canProceedCreation = creationMethod === "ai" 
    ? selectedCognitiveTypes.length > 0 
    : creationMethod === "questionBank" 
      ? selectedQuestionIds.length > 0 
      : uploadedFile;
  
  // Auto-scroll effects
  useEffect(() => {
    if (isCBSE && selectedCourse && classSelectRef.current) {
      setTimeout(() => {
        classSelectRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [selectedCourse, isCBSE]);
  
  useEffect(() => {
    if (availableSubjects.length > 0 && subjectSelectRef.current) {
      setTimeout(() => {
        subjectSelectRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [availableSubjects.length, selectedClassId]);
  
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
  
  const toggleSubject = useCallback((subjectId: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectId) 
        ? prev.filter(s => s !== subjectId)
        : [...prev, subjectId]
    );
  }, []);
  
  const handleCourseChange = useCallback((courseId: string) => {
    setSelectedCourse(courseId);
    setSelectedClassId("");
    setSelectedSubjects([]);
  }, []);
  
  const handleClassChange = useCallback((classId: string) => {
    setSelectedClassId(classId);
    setSelectedSubjects([]);
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
        toast.success("Exam created! You can assign batches from the Exams page.");
      } else {
        toast.success("Exam created successfully!");
      }
    }, 2000);
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
    
    // Step 1
    examName,
    setExamName,
    selectedCourse,
    selectedClassId,
    selectedSubjects,
    isCBSE,
    availableSubjects,
    handleCourseChange,
    handleClassChange,
    toggleSubject,
    canProceedStep1,
    classSelectRef,
    subjectSelectRef,
    
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
    batchesByClass,
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

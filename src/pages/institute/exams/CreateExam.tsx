import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Upload, FileText, CheckCircle2, Info, Sparkles, FileUp, Monitor, MonitorPlay, Users, Calendar, SkipForward, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { batches, assignedTracks } from "@/data/instituteData";
import { examPatternConfig } from "@/data/examsData";
import { classes } from "@/data/mockData";
import { getSubjectsForCourse } from "@/data/masterData";
import { getSubjectsByClass } from "@/data/cbseMasterData";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { QuestionBankSelector } from "@/components/institute/exams";

type PatternType = "custom" | "jee_main" | "jee_advanced" | "neet";
type UIType = "platform" | "real_exam";
type CreationMethod = "ai" | "pdf" | "questionBank";

// Cognitive Types
const cognitiveTypes = [
  { id: "logical", label: "Logical Reasoning", description: "Deductive and inductive reasoning" },
  { id: "analytical", label: "Analytical Thinking", description: "Breaking down complex problems" },
  { id: "conceptual", label: "Conceptual Understanding", description: "Grasping core concepts" },
  { id: "numerical", label: "Numerical Ability", description: "Mathematical calculations" },
  { id: "application", label: "Application-Based", description: "Real-world problem solving" },
  { id: "memory", label: "Memory/Recall", description: "Facts and information recall" },
];

// Difficulty presets
const difficultyPresets = [
  { label: "Balanced", easy: 33, medium: 34, hard: 33 },
  { label: "Easy Focus", easy: 50, medium: 35, hard: 15 },
  { label: "Hard Focus", easy: 15, medium: 35, hard: 50 },
];

const CreateExam = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processComplete, setProcessComplete] = useState(false);
  
  // Step 1: Basic Config with course-based selection
  const [examName, setExamName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  
  // Determine if CBSE (has classes) or JEE Mains (no classes)
  const selectedTrack = assignedTracks.find(t => t.id === selectedCourse);
  const isCBSE = selectedTrack?.hasClasses ?? false;

  // Get subjects based on course selection
  const availableSubjects = selectedCourse
    ? isCBSE
      ? selectedClassId
        ? getSubjectsByClass(selectedClassId).map(s => ({ id: s.id, name: s.name }))
        : []
      : getSubjectsForCourse(selectedCourse).map(s => ({ id: s.id, name: s.name }))
    : [];
  
  // Step 2: Pattern & UI
  const [pattern, setPattern] = useState<PatternType>("custom");
  const [uiType, setUIType] = useState<UIType>("platform");
  
  // Step 3: Custom Config (if not using standard pattern)
  const [totalQuestions, setTotalQuestions] = useState(30);
  const [duration, setDuration] = useState(60);
  const [marksPerQuestion, setMarksPerQuestion] = useState(4);
  const [negativeMarking, setNegativeMarking] = useState(true);
  const [negativeMarks, setNegativeMarks] = useState(1);
  
  // Step 4: Creation Method
  const [creationMethod, setCreationMethod] = useState<CreationMethod>("ai");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  // AI config - Enhanced difficulty distribution
  const [easyPercent, setEasyPercent] = useState(33);
  const [mediumPercent, setMediumPercent] = useState(34);
  const [hardPercent, setHardPercent] = useState(33);
  const [selectedCognitiveTypes, setSelectedCognitiveTypes] = useState<string[]>(["conceptual", "application"]);
  
  // Step 5: Batch & Schedule
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>();
  const [scheduleTime, setScheduleTime] = useState("");
  
  // Question Bank Selection
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  
  // Auto-scroll refs
  const classSelectRef = useRef<HTMLDivElement>(null);
  const subjectSelectRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll when class appears
  useEffect(() => {
    if (isCBSE && selectedCourse && classSelectRef.current) {
      setTimeout(() => {
        classSelectRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [selectedCourse, isCBSE]);
  
  // Auto-scroll when subjects appear
  useEffect(() => {
    if (availableSubjects.length > 0 && subjectSelectRef.current) {
      setTimeout(() => {
        subjectSelectRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [availableSubjects.length, selectedClassId]);
  // Group batches by class
  const batchesByClass = batches.reduce((acc, batch) => {
    if (!acc[batch.className]) {
      acc[batch.className] = [];
    }
    acc[batch.className].push(batch);
    return acc;
  }, {} as Record<string, typeof batches>);

  const isStandardPattern = pattern !== "custom";
  const selectedPatternConfig = isStandardPattern ? examPatternConfig[pattern as keyof typeof examPatternConfig] : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectId) 
        ? prev.filter(s => s !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
    setSelectedClassId("");
    setSelectedSubjects([]);
  };

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    setSelectedSubjects([]);
  };

  const toggleBatch = (batchId: string) => {
    setSelectedBatches(prev => 
      prev.includes(batchId) 
        ? prev.filter(b => b !== batchId)
        : [...prev, batchId]
    );
  };

  const toggleCognitiveType = (typeId: string) => {
    setSelectedCognitiveTypes(prev => 
      prev.includes(typeId)
        ? prev.filter(t => t !== typeId)
        : [...prev, typeId]
    );
  };

  const applyDifficultyPreset = (preset: { easy: number; medium: number; hard: number }) => {
    setEasyPercent(preset.easy);
    setMediumPercent(preset.medium);
    setHardPercent(preset.hard);
  };

  // Adjust difficulty to ensure sum is 100
  const adjustDifficulty = (type: 'easy' | 'medium' | 'hard', value: number) => {
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
  };

  const handleCreate = (skipBatch: boolean = false) => {
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
  };

  const steps = [
    { number: 1, title: "Exam Details", icon: FileText },
    { number: 2, title: "Pattern & UI", icon: Monitor },
    { number: 3, title: pattern === "custom" ? "Configuration" : "Creation Method", icon: pattern === "custom" ? FileText : Sparkles },
    { number: 4, title: pattern === "custom" ? "Creation Method" : "Batch Assignment", icon: pattern === "custom" ? Sparkles : Users },
    { number: 5, title: pattern === "custom" ? "Batch Assignment" : "Complete", icon: pattern === "custom" ? Users : CheckCircle2 },
    ...(pattern === "custom" ? [{ number: 6, title: "Complete", icon: CheckCircle2 }] : []),
  ];

  const totalSteps = pattern === "custom" ? 6 : 5;
  const canProceedStep1 = examName && selectedCourse && selectedSubjects.length > 0 && (!isCBSE || selectedClassId);
  const canProceedStep2 = pattern && uiType;
  const canProceedStep3Custom = totalQuestions > 0 && duration > 0;
  const canProceedCreation = creationMethod === "ai" 
    ? selectedCognitiveTypes.length > 0 
    : creationMethod === "questionBank" 
      ? selectedQuestionIds.length > 0 
      : uploadedFile;

  const getStepContent = () => {
    if (processComplete) {
      return (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Exam Created Successfully!</h3>
            <p className="text-muted-foreground">
              Your exam "{examName}" has been created and is ready for review.
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate("/institute/exams")}>
              Back to Exams
            </Button>
            <Button className="gradient-button" onClick={() => navigate("/institute/exams/review/new")}>
              Review Questions
            </Button>
          </div>
        </div>
      );
    }

    // Step 1: Exam Details with course-based subject selection
    if (currentStep === 1) {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-1">Exam Details</h3>
            <p className="text-muted-foreground text-sm">Basic information about your exam</p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="examName">Exam Name *</Label>
              <Input 
                id="examName"
                value={examName} 
                onChange={(e) => setExamName(e.target.value)}
                placeholder="e.g., Mid-Term Physics Test"
              />
            </div>

            {/* Course Selection */}
            <div className="space-y-3">
              <Label>Select Course *</Label>
              <div className="grid grid-cols-2 gap-3">
                {assignedTracks.map((track) => (
                  <label
                    key={track.id}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all",
                      selectedCourse === track.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <Checkbox 
                      checked={selectedCourse === track.id}
                      onCheckedChange={() => handleCourseChange(track.id)}
                    />
                    <div>
                      <p className="font-medium">{track.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {track.hasClasses ? "Board curriculum" : "Competitive exam"}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Class Selection (only for CBSE) */}
            {isCBSE && selectedCourse && (
              <div className="space-y-2" ref={classSelectRef}>
                <Label>Class *</Label>
                <Select value={selectedClassId} onValueChange={handleClassChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Subject Selection */}
            {availableSubjects.length > 0 && (
              <div className="space-y-3" ref={subjectSelectRef}>
                <Label>Subjects *</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableSubjects.map((subject) => (
                    <label
                      key={subject.id}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all",
                        selectedSubjects.includes(subject.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <Checkbox 
                        checked={selectedSubjects.includes(subject.id)}
                        onCheckedChange={() => toggleSubject(subject.id)}
                      />
                      <span className="text-sm">{subject.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => navigate("/institute/exams")}>
              Cancel
            </Button>
            <Button 
              className="gradient-button gap-2"
              disabled={!canProceedStep1}
              onClick={() => setCurrentStep(2)}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      );
    }

    // Step 2: Pattern & UI Selection
    if (currentStep === 2) {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-1">Pattern & Interface</h3>
            <p className="text-muted-foreground text-sm">Choose exam pattern and student interface</p>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Exam Pattern</Label>
              <RadioGroup value={pattern} onValueChange={(v) => setPattern(v as PatternType)}>
                <label
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all",
                    pattern === "custom" 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <RadioGroupItem value="custom" />
                  <div>
                    <p className="font-medium">Custom Configuration</p>
                    <p className="text-sm text-muted-foreground">Define your own question count, marks, and duration</p>
                  </div>
                </label>
                
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground mb-2">Or use a standard pattern:</p>
                  {Object.entries(examPatternConfig).map(([key, config]) => (
                    <label
                      key={key}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all mb-2",
                        pattern === key 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <RadioGroupItem value={key} />
                      <div className="flex-1">
                        <p className="font-medium">{config.label}</p>
                        <p className="text-sm text-muted-foreground">{config.description}</p>
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        <p>{config.totalQuestions} Qs</p>
                        <p>{config.duration} mins</p>
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Student Interface</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setUIType("platform")}
                  className={cn(
                    "p-4 rounded-xl border-2 text-center transition-all",
                    uiType === "platform"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <Monitor className={cn(
                    "w-10 h-10 mx-auto mb-2",
                    uiType === "platform" ? "text-primary" : "text-muted-foreground"
                  )} />
                  <h4 className="font-semibold text-sm mb-1">Platform UI</h4>
                  <p className="text-xs text-muted-foreground">
                    Standard interface with navigation aids
                  </p>
                </button>
                
                <button
                  onClick={() => setUIType("real_exam")}
                  className={cn(
                    "p-4 rounded-xl border-2 text-center transition-all",
                    uiType === "real_exam"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <MonitorPlay className={cn(
                    "w-10 h-10 mx-auto mb-2",
                    uiType === "real_exam" ? "text-primary" : "text-muted-foreground"
                  )} />
                  <h4 className="font-semibold text-sm mb-1">Real Exam UI</h4>
                  <p className="text-xs text-muted-foreground">
                    Simulates actual JEE/NEET interface
                  </p>
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button 
              className="gradient-button gap-2"
              disabled={!canProceedStep2}
              onClick={() => setCurrentStep(3)}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      );
    }

    // Step 3: Custom Configuration (only if pattern === "custom")
    if (currentStep === 3 && pattern === "custom") {
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
            <Button variant="outline" onClick={() => setCurrentStep(2)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button 
              className="gradient-button gap-2"
              disabled={!canProceedStep3Custom}
              onClick={() => setCurrentStep(4)}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      );
    }

    // Creation Method Step
    const creationStep = pattern === "custom" ? 4 : 3;
    if (currentStep === creationStep) {
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
            <Button variant="outline" onClick={() => setCurrentStep(pattern === "custom" ? 3 : 2)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button 
              className="gradient-button gap-2"
              disabled={!canProceedCreation}
              onClick={() => setCurrentStep(pattern === "custom" ? 5 : 4)}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      );
    }

    // Batch Assignment Step (Optional)
    const batchStep = pattern === "custom" ? 5 : 4;
    if (currentStep === batchStep) {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-1">Assign to Batches</h3>
            <p className="text-muted-foreground text-sm">Select batches or skip to assign later</p>
          </div>
          
          <div className="space-y-4">
            {Object.entries(batchesByClass).map(([className, classBatches]) => (
              <div key={className} className="space-y-2">
                <Label className="text-muted-foreground">{className}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {classBatches.map((batch) => (
                    <label
                      key={batch.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                        selectedBatches.includes(batch.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <Checkbox 
                        checked={selectedBatches.includes(batch.id)}
                        onCheckedChange={() => toggleBatch(batch.id)}
                      />
                      <div>
                        <p className="text-sm font-medium">{batch.name}</p>
                        <p className="text-xs text-muted-foreground">{batch.studentCount} students</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {selectedBatches.length > 0 && (
            <div className="space-y-4 p-4 rounded-xl bg-muted/30">
              <Label>Schedule (Optional)</Label>
              <div className="grid grid-cols-2 gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !scheduleDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {scheduleDate ? format(scheduleDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={scheduleDate}
                      onSelect={setScheduleDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <Input 
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  placeholder="Select time"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Leave empty to save as draft and schedule later
              </p>
            </div>
          )}
          
          <div className="flex flex-col gap-3 pt-4">
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(pattern === "custom" ? 4 : 3)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                className="gradient-button gap-2"
                disabled={isProcessing}
                onClick={() => handleCreate(false)}
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create Exam
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
            
            {selectedBatches.length === 0 && (
              <Button 
                variant="ghost" 
                className="w-full text-muted-foreground hover:text-foreground"
                onClick={() => handleCreate(true)}
                disabled={isProcessing}
              >
                <SkipForward className="w-4 h-4 mr-2" />
                Skip - Assign Batches Later
              </Button>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Create Exam"
        description="Create a new test for your students"
        breadcrumbs={[
          { label: "Dashboard", href: "/institute/dashboard" },
          { label: "Exams", href: "/institute/exams" },
          { label: "Create Exam" },
        ]}
      />

      {/* Stepper */}
      {!processComplete && (
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
      )}

      {/* Step Content */}
      <div className={cn(
        "bg-card rounded-2xl p-4 sm:p-8 shadow-soft border border-border/50 mx-auto transition-all",
        creationMethod === "questionBank" && (currentStep === (pattern === "custom" ? 4 : 3)) 
          ? "max-w-5xl" 
          : "max-w-2xl"
      )}>
        {getStepContent()}
      </div>
    </div>
  );
};

export default CreateExam;
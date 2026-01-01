import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Upload, FileText, CheckCircle2, Info, Sparkles, FileUp, Monitor, MonitorPlay, Users, Calendar } from "lucide-react";
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
import { batches, availableSubjects } from "@/data/instituteData";
import { examPatternConfig } from "@/data/examsData";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

type ExamType = "unit_test" | "mid_term" | "final" | "practice";
type PatternType = "custom" | "jee_main" | "jee_advanced" | "neet";
type UIType = "platform" | "real_exam";
type CreationMethod = "ai" | "pdf";

const examTypeOptions = [
  { value: "unit_test", label: "Unit Test", description: "Short assessment on specific chapters" },
  { value: "mid_term", label: "Mid-Term", description: "Half-yearly examination" },
  { value: "final", label: "Final Exam", description: "End of term comprehensive test" },
  { value: "practice", label: "Practice Test", description: "No-pressure practice session" },
];

const CreateExam = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processComplete, setProcessComplete] = useState(false);
  
  // Step 1: Basic Config
  const [examName, setExamName] = useState("");
  const [examType, setExamType] = useState<ExamType>("unit_test");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  
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
  
  // AI config
  const [easyPercent, setEasyPercent] = useState(30);
  const [mediumPercent, setMediumPercent] = useState(50);
  const [hardPercent, setHardPercent] = useState(20);
  
  // Step 5: Batch & Schedule
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>();
  const [scheduleTime, setScheduleTime] = useState("");

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

  const toggleBatch = (batchId: string) => {
    setSelectedBatches(prev => 
      prev.includes(batchId) 
        ? prev.filter(b => b !== batchId)
        : [...prev, batchId]
    );
  };

  const handleCreate = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setProcessComplete(true);
      toast.success("Exam created successfully!");
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
  const canProceedStep1 = examName && examType && selectedSubjects.length > 0;
  const canProceedStep2 = pattern && uiType;
  const canProceedStep3Custom = totalQuestions > 0 && duration > 0;
  const canProceedCreation = creationMethod === "ai" || uploadedFile;
  const canProceedBatch = selectedBatches.length > 0;

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

    // Step 1: Exam Details
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
            
            <div className="space-y-3">
              <Label>Exam Type *</Label>
              <RadioGroup value={examType} onValueChange={(v) => setExamType(v as ExamType)}>
                <div className="grid grid-cols-2 gap-3">
                  {examTypeOptions.map((option) => (
                    <label
                      key={option.value}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                        examType === option.value 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <RadioGroupItem value={option.value} />
                      <div>
                        <p className="font-medium text-sm">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
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
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setCreationMethod("ai")}
              className={cn(
                "p-6 rounded-xl border-2 text-center transition-all",
                creationMethod === "ai"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <Sparkles className={cn(
                "w-12 h-12 mx-auto mb-3",
                creationMethod === "ai" ? "text-primary" : "text-muted-foreground"
              )} />
              <h4 className="font-semibold mb-1">Generate using AI</h4>
              <p className="text-sm text-muted-foreground">
                AI will create questions based on your specifications
              </p>
            </button>
            
            <button
              onClick={() => setCreationMethod("pdf")}
              className={cn(
                "p-6 rounded-xl border-2 text-center transition-all",
                creationMethod === "pdf"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <FileUp className={cn(
                "w-12 h-12 mx-auto mb-3",
                creationMethod === "pdf" ? "text-primary" : "text-muted-foreground"
              )} />
              <h4 className="font-semibold mb-1">Upload PDF</h4>
              <p className="text-sm text-muted-foreground">
                Upload a question paper PDF and we'll extract questions
              </p>
            </button>
          </div>

          {creationMethod === "ai" && (
            <div className="space-y-4 p-4 rounded-xl bg-muted/30">
              <Label>Difficulty Distribution</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-success">Easy</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-success/20 rounded-full h-2">
                      <div 
                        className="bg-success h-2 rounded-full transition-all" 
                        style={{ width: `${easyPercent}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-10">{easyPercent}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-warning">Medium</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-warning/20 rounded-full h-2">
                      <div 
                        className="bg-warning h-2 rounded-full transition-all" 
                        style={{ width: `${mediumPercent}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-10">{mediumPercent}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-destructive">Hard</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-destructive/20 rounded-full h-2">
                      <div 
                        className="bg-destructive h-2 rounded-full transition-all" 
                        style={{ width: `${hardPercent}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-10">{hardPercent}%</span>
                  </div>
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

    // Batch Assignment Step
    const batchStep = pattern === "custom" ? 5 : 4;
    if (currentStep === batchStep) {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-1">Assign to Batches</h3>
            <p className="text-muted-foreground text-sm">Select which batches will take this exam</p>
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
          
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setCurrentStep(pattern === "custom" ? 4 : 3)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button 
              className="gradient-button gap-2"
              disabled={!canProceedBatch || isProcessing}
              onClick={handleCreate}
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
      <div className="bg-card rounded-2xl p-8 shadow-soft border border-border/50 max-w-2xl mx-auto">
        {getStepContent()}
      </div>
    </div>
  );
};

export default CreateExam;

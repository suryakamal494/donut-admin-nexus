import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Upload, FileText, CheckCircle2, Info, Sparkles, FileUp, BookOpen, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { examPatternConfig } from "@/data/examsData";
import { getActiveCurriculums, getPublishedCourses } from "@/data/masterData";
import { ContentSourceType } from "@/components/parameters/SourceTypeSelector";

const CreateGrandTest = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processComplete, setProcessComplete] = useState(false);
  
  // Form state
  const [testName, setTestName] = useState("");
  const [pattern, setPattern] = useState<"jee_main" | "jee_advanced" | "neet">("jee_main");
  const [creationMethod, setCreationMethod] = useState<"ai" | "pdf">("ai");
  
  // Content Source state
  const [contentSource, setContentSource] = useState<ContentSourceType>('curriculum');
  const [selectedCurriculumId, setSelectedCurriculumId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  
  const activeCurriculums = getActiveCurriculums();
  const publishedCourses = getPublishedCourses();
  
  // AI config - Subject distribution
  const [physicsCount, setPhysicsCount] = useState(30);
  const [chemistryCount, setChemistryCount] = useState(30);
  const [mathBioCount, setMathBioCount] = useState(30);
  
  // Difficulty distribution (must total 100%)
  const [easyPercent, setEasyPercent] = useState(30);
  const [mediumPercent, setMediumPercent] = useState(50);
  const [hardPercent, setHardPercent] = useState(20);
  
  // Cognitive distribution (must total 100%)
  const [logicalPercent, setLogicalPercent] = useState(20);
  const [analyticalPercent, setAnalyticalPercent] = useState(20);
  const [conceptualPercent, setConceptualPercent] = useState(25);
  const [numericalPercent, setNumericalPercent] = useState(15);
  const [applicationPercent, setApplicationPercent] = useState(15);
  const [memoryPercent, setMemoryPercent] = useState(5);

  // Helper to adjust percentages while keeping total at 100%
  const adjustDifficulty = (setter: (v: number) => void, newValue: number, currentValue: number, others: { value: number; setter: (v: number) => void }[]) => {
    const diff = newValue - currentValue;
    if (diff === 0) return;
    
    // Distribute the difference among other sliders proportionally
    const othersTotal = others.reduce((sum, o) => sum + o.value, 0);
    if (othersTotal === 0) return;
    
    let remaining = -diff;
    others.forEach((other, i) => {
      const share = i === others.length - 1 
        ? remaining 
        : Math.round((other.value / othersTotal) * -diff);
      const newOtherValue = Math.max(0, Math.min(100, other.value + share));
      other.setter(newOtherValue);
      remaining -= (newOtherValue - other.value);
    });
    setter(newValue);
  };

  const handleEasyChange = (value: number) => {
    adjustDifficulty(setEasyPercent, value, easyPercent, [
      { value: mediumPercent, setter: setMediumPercent },
      { value: hardPercent, setter: setHardPercent }
    ]);
  };

  const handleMediumChange = (value: number) => {
    adjustDifficulty(setMediumPercent, value, mediumPercent, [
      { value: easyPercent, setter: setEasyPercent },
      { value: hardPercent, setter: setHardPercent }
    ]);
  };

  const handleHardChange = (value: number) => {
    adjustDifficulty(setHardPercent, value, hardPercent, [
      { value: easyPercent, setter: setEasyPercent },
      { value: mediumPercent, setter: setMediumPercent }
    ]);
  };

  // Cognitive adjustment helpers
  const adjustCognitive = (
    setter: (v: number) => void, 
    newValue: number, 
    currentValue: number, 
    allSetters: { value: number; setter: (v: number) => void; isCurrent: boolean }[]
  ) => {
    const diff = newValue - currentValue;
    if (diff === 0) return;
    
    const others = allSetters.filter(s => !s.isCurrent);
    const othersTotal = others.reduce((sum, o) => sum + o.value, 0);
    if (othersTotal === 0) return;
    
    let remaining = -diff;
    others.forEach((other, i) => {
      const share = i === others.length - 1 
        ? remaining 
        : Math.round((other.value / othersTotal) * -diff);
      const newOtherValue = Math.max(0, Math.min(100, other.value + share));
      other.setter(newOtherValue);
      remaining -= (newOtherValue - other.value);
    });
    setter(newValue);
  };

  const getCognitiveSetters = (currentSetter: (v: number) => void) => [
    { value: logicalPercent, setter: setLogicalPercent, isCurrent: currentSetter === setLogicalPercent },
    { value: analyticalPercent, setter: setAnalyticalPercent, isCurrent: currentSetter === setAnalyticalPercent },
    { value: conceptualPercent, setter: setConceptualPercent, isCurrent: currentSetter === setConceptualPercent },
    { value: numericalPercent, setter: setNumericalPercent, isCurrent: currentSetter === setNumericalPercent },
    { value: applicationPercent, setter: setApplicationPercent, isCurrent: currentSetter === setApplicationPercent },
    { value: memoryPercent, setter: setMemoryPercent, isCurrent: currentSetter === setMemoryPercent },
  ];
  
  // PDF upload
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const selectedPattern = examPatternConfig[pattern];
  const thirdSubject = pattern === "neet" ? "Biology" : "Mathematics";

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

  const handleCreate = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setProcessComplete(true);
      toast.success("Grand Test created successfully!");
    }, 2000);
  };

  const steps = [
    { number: 1, title: "Test Configuration", icon: FileText },
    { number: 2, title: "Creation Method", icon: creationMethod === "ai" ? Sparkles : FileUp },
    { number: 3, title: creationMethod === "ai" ? "AI Settings" : "Upload PDF", icon: creationMethod === "ai" ? Sparkles : Upload },
    { number: 4, title: "Complete", icon: CheckCircle2 },
  ];

  const canProceedStep1 = testName && pattern && (
    (contentSource === 'curriculum' && selectedCurriculumId) ||
    (contentSource === 'course' && selectedCourseId)
  );
  const canProceedStep2 = creationMethod;
  const canProceedStep3 = creationMethod === "ai" || uploadedFile;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Create Grand Test"
        description="Create a mock test to conduct across institutes"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin/dashboard" },
          { label: "Exams", href: "/superadmin/exams" },
          { label: "Create Grand Test" },
        ]}
      />

      {/* Stepper */}
      <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
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
                  "text-xs mt-2 font-medium text-center max-w-[80px]",
                  currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  "w-16 h-1 mx-2 rounded-full",
                  currentStep > step.number ? "bg-success" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-card rounded-2xl p-8 shadow-soft border border-border/50 max-w-2xl mx-auto">
        {/* Step 1: Test Configuration */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-1">Test Configuration</h3>
              <p className="text-muted-foreground text-sm">Name your test and select the exam pattern</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testName">Test Name *</Label>
                <Input 
                  id="testName"
                  value={testName} 
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="e.g., Grand Test #21 - JEE Full Syllabus Mock"
                />
              </div>

              {/* Content Source Selection */}
              <div className="space-y-3">
                <Label>Content Source *</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => { setContentSource('curriculum'); setSelectedCourseId(""); }}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border transition-all",
                      contentSource === 'curriculum' 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <BookOpen className={cn("w-5 h-5", contentSource === 'curriculum' ? "text-primary" : "text-muted-foreground")} />
                    <div className="text-left">
                      <p className="font-medium">Curriculum</p>
                      <p className="text-xs text-muted-foreground">Pull from CBSE/ICSE syllabus</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setContentSource('course'); setSelectedCurriculumId(""); }}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border transition-all",
                      contentSource === 'course' 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <Layers className={cn("w-5 h-5", contentSource === 'course' ? "text-primary" : "text-muted-foreground")} />
                    <div className="text-left">
                      <p className="font-medium">Course</p>
                      <p className="text-xs text-muted-foreground">Pull from JEE/NEET courses</p>
                    </div>
                  </button>
                </div>

                {/* Secondary Selection */}
                {contentSource === 'curriculum' ? (
                  <Select value={selectedCurriculumId} onValueChange={setSelectedCurriculumId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select curriculum" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeCurriculums.map((curr) => (
                        <SelectItem key={curr.id} value={curr.id}>{curr.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {publishedCourses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              
              <div className="space-y-3">
                <Label>Exam Pattern *</Label>
                <RadioGroup value={pattern} onValueChange={(v) => setPattern(v as typeof pattern)}>
                  {Object.entries(examPatternConfig).map(([key, config]) => (
                    <label
                      key={key}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all",
                        pattern === key 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <RadioGroupItem value={key} />
                      <div>
                        <p className="font-medium">{config.label}</p>
                        <p className="text-sm text-muted-foreground">{config.description}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => navigate("/superadmin/exams")}>
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
        )}

        {/* Step 2: Creation Method */}
        {currentStep === 2 && (
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
        )}

        {/* Step 3A: AI Configuration */}
        {currentStep === 3 && creationMethod === "ai" && !processComplete && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-1">AI Question Configuration</h3>
              <p className="text-muted-foreground text-sm">Configure how AI should generate questions</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <Label>Subject-wise Question Distribution</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Physics</span>
                    <div className="flex items-center gap-2">
                      <Slider 
                        value={[physicsCount]} 
                        onValueChange={([v]) => setPhysicsCount(v)}
                        max={50}
                        min={10}
                        className="w-32"
                      />
                      <span className="text-sm font-medium w-8">{physicsCount}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Chemistry</span>
                    <div className="flex items-center gap-2">
                      <Slider 
                        value={[chemistryCount]} 
                        onValueChange={([v]) => setChemistryCount(v)}
                        max={50}
                        min={10}
                        className="w-32"
                      />
                      <span className="text-sm font-medium w-8">{chemistryCount}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{thirdSubject}</span>
                    <div className="flex items-center gap-2">
                      <Slider 
                        value={[mathBioCount]} 
                        onValueChange={([v]) => setMathBioCount(v)}
                        max={50}
                        min={10}
                        className="w-32"
                      />
                      <span className="text-sm font-medium w-8">{mathBioCount}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Total: {physicsCount + chemistryCount + mathBioCount} questions
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Difficulty Distribution</Label>
                  <span className="text-xs text-muted-foreground">Total: {easyPercent + mediumPercent + hardPercent}%</span>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-success font-medium">Easy</span>
                      <span className="text-sm font-medium w-12 text-right">{easyPercent}%</span>
                    </div>
                    <Slider 
                      value={[easyPercent]} 
                      onValueChange={([v]) => handleEasyChange(v)}
                      max={100}
                      min={0}
                      className="[&_[role=slider]]:bg-success [&_.bg-primary]:bg-success"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-warning font-medium">Medium</span>
                      <span className="text-sm font-medium w-12 text-right">{mediumPercent}%</span>
                    </div>
                    <Slider 
                      value={[mediumPercent]} 
                      onValueChange={([v]) => handleMediumChange(v)}
                      max={100}
                      min={0}
                      className="[&_[role=slider]]:bg-warning [&_.bg-primary]:bg-warning"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-destructive font-medium">Hard</span>
                      <span className="text-sm font-medium w-12 text-right">{hardPercent}%</span>
                    </div>
                    <Slider 
                      value={[hardPercent]} 
                      onValueChange={([v]) => handleHardChange(v)}
                      max={100}
                      min={0}
                      className="[&_[role=slider]]:bg-destructive [&_.bg-primary]:bg-destructive"
                    />
                  </div>
                </div>
              </div>

              {/* Cognitive Distribution */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Cognitive Distribution</Label>
                  <span className="text-xs text-muted-foreground">
                    Total: {logicalPercent + analyticalPercent + conceptualPercent + numericalPercent + applicationPercent + memoryPercent}%
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Logical Reasoning</span>
                      <span className="text-sm font-medium w-12 text-right">{logicalPercent}%</span>
                    </div>
                    <Slider 
                      value={[logicalPercent]} 
                      onValueChange={([v]) => adjustCognitive(setLogicalPercent, v, logicalPercent, getCognitiveSetters(setLogicalPercent))}
                      max={100}
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Analytical Thinking</span>
                      <span className="text-sm font-medium w-12 text-right">{analyticalPercent}%</span>
                    </div>
                    <Slider 
                      value={[analyticalPercent]} 
                      onValueChange={([v]) => adjustCognitive(setAnalyticalPercent, v, analyticalPercent, getCognitiveSetters(setAnalyticalPercent))}
                      max={100}
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Conceptual Understanding</span>
                      <span className="text-sm font-medium w-12 text-right">{conceptualPercent}%</span>
                    </div>
                    <Slider 
                      value={[conceptualPercent]} 
                      onValueChange={([v]) => adjustCognitive(setConceptualPercent, v, conceptualPercent, getCognitiveSetters(setConceptualPercent))}
                      max={100}
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Numerical Ability</span>
                      <span className="text-sm font-medium w-12 text-right">{numericalPercent}%</span>
                    </div>
                    <Slider 
                      value={[numericalPercent]} 
                      onValueChange={([v]) => adjustCognitive(setNumericalPercent, v, numericalPercent, getCognitiveSetters(setNumericalPercent))}
                      max={100}
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Application-Based</span>
                      <span className="text-sm font-medium w-12 text-right">{applicationPercent}%</span>
                    </div>
                    <Slider 
                      value={[applicationPercent]} 
                      onValueChange={([v]) => adjustCognitive(setApplicationPercent, v, applicationPercent, getCognitiveSetters(setApplicationPercent))}
                      max={100}
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Memory/Recall</span>
                      <span className="text-sm font-medium w-12 text-right">{memoryPercent}%</span>
                    </div>
                    <Slider 
                      value={[memoryPercent]} 
                      onValueChange={([v]) => adjustCognitive(setMemoryPercent, v, memoryPercent, getCognitiveSetters(setMemoryPercent))}
                      max={100}
                      min={0}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-xl p-4 flex gap-3">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                Questions will be generated with answers and solutions. You can review and edit before publishing.
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                className="gradient-button gap-2"
                disabled={isProcessing}
                onClick={handleCreate}
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Grand Test
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3B: PDF Upload */}
        {currentStep === 3 && creationMethod === "pdf" && !processComplete && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-1">Upload Question Paper</h3>
              <p className="text-muted-foreground text-sm">Upload a PDF to create the grand test</p>
            </div>
            
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
                    <p className="text-xs text-muted-foreground mt-2">
                      Supported: PDF (max 50MB)
                    </p>
                  </div>
                )}
              </label>
            </div>
            
            <div className="bg-muted/50 rounded-xl p-4 flex gap-3">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                PDF will be converted into a full-length mock test automatically. You can review before publishing.
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                className="gradient-button gap-2"
                disabled={!canProceedStep3 || isProcessing}
                onClick={handleCreate}
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Create Grand Test
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Complete */}
        {processComplete && (
          <div className="text-center py-8 space-y-4">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">Grand Test Created!</h3>
              <p className="text-muted-foreground">
                {creationMethod === "ai" 
                  ? "AI has generated your questions. Review them before publishing."
                  : "Questions extracted from PDF. Review them before publishing."}
              </p>
            </div>
            <div className="pt-4 flex justify-center gap-3">
              <Button variant="outline" onClick={() => navigate("/superadmin/exams")}>
                Go to Grand Tests
              </Button>
              <Button 
                className="gradient-button"
                onClick={() => navigate(`/superadmin/exams/review/new-grand-test?type=grand_test&method=${creationMethod}`)}
              >
                Review Questions
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateGrandTest;

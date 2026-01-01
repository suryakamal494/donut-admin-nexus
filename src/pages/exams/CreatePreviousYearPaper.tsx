import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Upload, FileText, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const years = Array.from({ length: 10 }, (_, i) => 2025 - i);
const sessions = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const CreatePreviousYearPaper = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  
  // Form state
  const [examType, setExamType] = useState("");
  const [examYear, setExamYear] = useState("");
  const [session, setSession] = useState("");
  const [paperName, setPaperName] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Auto-generate paper name
  const generatePaperName = () => {
    if (examType && examYear) {
      const examLabels: Record<string, string> = {
        jee_main: "JEE Main",
        jee_advanced: "JEE Advanced",
        neet: "NEET",
      };
      const base = `${examLabels[examType]} ${examYear}`;
      return session ? `${base} - ${session} Session` : base;
    }
    return "";
  };

  // Update paper name when exam config changes
  const handleExamConfigChange = (field: string, value: string) => {
    if (field === "examType") setExamType(value);
    if (field === "examYear") setExamYear(value);
    if (field === "session") setSession(value);
    
    // Auto-generate name after state updates
    setTimeout(() => {
      setPaperName(generatePaperName());
    }, 0);
  };

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

  const handleUpload = () => {
    if (!uploadedFile) {
      toast.error("Please select a file to upload");
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      setUploadComplete(true);
      toast.success("Paper uploaded successfully!");
    }, 2000);
  };

  const steps = [
    { number: 1, title: "Exam Configuration", icon: FileText },
    { number: 2, title: "Upload PDF", icon: Upload },
    { number: 3, title: "Complete", icon: CheckCircle2 },
  ];

  const canProceedStep1 = examType && examYear && paperName;
  const canProceedStep2 = uploadedFile;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Create Previous Year Paper"
        description="Upload an official previous year paper to create a test"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin/dashboard" },
          { label: "Exams", href: "/superadmin/exams" },
          { label: "Create Previous Year Paper" },
        ]}
      />

      {/* Stepper */}
      <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                    currentStep === step.number
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : currentStep > step.number
                      ? "bg-success text-success-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <span className={cn(
                  "text-sm mt-2 font-medium",
                  currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  "w-24 h-1 mx-4 rounded-full",
                  currentStep > step.number ? "bg-success" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-card rounded-2xl p-8 shadow-soft border border-border/50 max-w-2xl mx-auto">
        {/* Step 1: Exam Configuration */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-1">Exam Configuration</h3>
              <p className="text-muted-foreground text-sm">Select the exam type and year for this paper</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="examType">Competitive Exam *</Label>
                <Select value={examType} onValueChange={(v) => handleExamConfigChange("examType", v)}>
                  <SelectTrigger id="examType">
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jee_main">JEE Main</SelectItem>
                    <SelectItem value="jee_advanced">JEE Advanced</SelectItem>
                    <SelectItem value="neet">NEET</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="examYear">Exam Year *</Label>
                <Select value={examYear} onValueChange={(v) => handleExamConfigChange("examYear", v)}>
                  <SelectTrigger id="examYear">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="session">Session (Optional)</Label>
                <Select value={session} onValueChange={(v) => handleExamConfigChange("session", v)}>
                  <SelectTrigger id="session">
                    <SelectValue placeholder="Select session (if applicable)" />
                  </SelectTrigger>
                  <SelectContent>
                    {sessions.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paperName">Paper Name *</Label>
                <Input 
                  id="paperName"
                  value={paperName || generatePaperName()} 
                  onChange={(e) => setPaperName(e.target.value)}
                  placeholder="Auto-generated based on selection"
                />
                <p className="text-xs text-muted-foreground">You can customize the name if needed</p>
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
                Next: Upload PDF
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Upload PDF */}
        {currentStep === 2 && !uploadComplete && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-1">Upload Question Paper</h3>
              <p className="text-muted-foreground text-sm">Upload the official {paperName} PDF</p>
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
                      Drag & drop the official question paper PDF
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
              <div className="text-sm">
                <p className="font-medium mb-1">How this works:</p>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Questions, sections, and marking scheme will be auto-detected from the PDF</li>
                  <li>• The test will match the actual exam format</li>
                  <li>• You can review everything before publishing</li>
                </ul>
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                className="gradient-button gap-2"
                disabled={!canProceedStep2 || isUploading}
                onClick={handleUpload}
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    Upload & Create Test
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Complete */}
        {uploadComplete && (
          <div className="text-center py-8 space-y-4">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">Paper Uploaded Successfully!</h3>
              <p className="text-muted-foreground">
                We're creating your test now.<br />
                You can review and configure rank/percentile mapping.
              </p>
            </div>
            <div className="pt-4 flex justify-center gap-3">
              <Button 
                variant="outline"
                onClick={() => navigate("/superadmin/exams")}
              >
                Go to Previous Year Papers
              </Button>
              <Button 
                className="gradient-button"
                onClick={() => navigate(`/superadmin/exams/review/new-pyp?type=previous_year&method=pdf`)}
              >
                Review & Configure
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePreviousYearPaper;

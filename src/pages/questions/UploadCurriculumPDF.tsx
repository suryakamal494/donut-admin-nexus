import { useState, useCallback, useMemo } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, ArrowLeft, Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getActiveCurriculums } from "@/data/masterData";
import { getChaptersByCurriculumClassAndSubject, getSubjectsForCurriculumAndClass } from "@/data/cbseMasterData";
import { classes } from "@/data/mockData";

type UploadState = "idle" | "uploading" | "success" | "error";

const UploadCurriculumPDF = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  const [selectedCurriculum, setSelectedCurriculum] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");

  const activeCurriculums = getActiveCurriculums();

  const availableSubjects = useMemo(() => {
    if (!selectedCurriculum || !selectedClass) return [];
    return getSubjectsForCurriculumAndClass(selectedCurriculum, selectedClass);
  }, [selectedCurriculum, selectedClass]);

  const availableChapters = useMemo(() => {
    if (!selectedCurriculum || !selectedClass || !selectedSubject) return [];
    return getChaptersByCurriculumClassAndSubject(selectedCurriculum, selectedClass, selectedSubject);
  }, [selectedCurriculum, selectedClass, selectedSubject]);

  const canProceed = selectedCurriculum && selectedClass && selectedSubject;

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }, []);

  const handleFile = (file: File) => {
    if (file.type !== "application/pdf") { alert("Please upload a PDF file"); return; }
    setFileName(file.name);
    setUploadState("uploading");
    setTimeout(() => setUploadState("success"), 2000);
  };

  if (uploadState === "success") {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeader title="PDF to Questions" breadcrumbs={[
          { label: "Curriculum Questions", href: "/superadmin/questions/curriculum" },
          { label: "Upload PDF" },
        ]} />
        <div className="bg-card rounded-2xl p-12 shadow-soft border text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-3">PDF Uploaded Successfully!</h2>
          <p className="text-muted-foreground mb-6">{fileName} is being processed.</p>
          <div className="flex justify-center gap-4">
            <Link to="/superadmin/questions/curriculum">
              <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button>
            </Link>
            <Button onClick={() => navigate("/superadmin/questions/review")} className="gradient-button">
              Go to Review
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Upload Curriculum PDF"
        description="Upload exam papers to extract questions for the curriculum"
        breadcrumbs={[
          { label: "Curriculum Questions", href: "/superadmin/questions/curriculum" },
          { label: "Upload PDF" },
        ]}
        actions={<Button variant="outline" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4 mr-2" />Back</Button>}
      />

      {currentStep === 1 && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-card rounded-2xl p-6 shadow-soft border space-y-4">
            <Label className="text-sm text-muted-foreground">Classification</Label>
            <div className="flex flex-wrap gap-3">
              <Select value={selectedCurriculum} onValueChange={(v) => { setSelectedCurriculum(v); setSelectedClass(""); setSelectedSubject(""); }}>
                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Curriculum" /></SelectTrigger>
                <SelectContent>{activeCurriculums.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={selectedClass} onValueChange={(v) => { setSelectedClass(v); setSelectedSubject(""); }} disabled={!selectedCurriculum}>
                <SelectTrigger className="w-[130px]"><SelectValue placeholder="Class" /></SelectTrigger>
                <SelectContent>{classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!selectedClass}>
                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Subject" /></SelectTrigger>
                <SelectContent>{availableSubjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={selectedChapter} onValueChange={setSelectedChapter} disabled={!selectedSubject}>
                <SelectTrigger className="w-[200px]"><SelectValue placeholder="Chapter (optional)" /></SelectTrigger>
                <SelectContent>{availableChapters.map(ch => <SelectItem key={ch.id} value={ch.id}>{ch.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setCurrentStep(2)} disabled={!canProceed} className="gradient-button">
              Continue <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="max-w-2xl mx-auto">
          <div
            className={cn("bg-card rounded-2xl p-8 border-2 border-dashed transition-all", dragActive ? "border-primary bg-primary/5" : "border-border")}
            onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
          >
            <div className="text-center">
              {uploadState === "uploading" ? (
                <><Loader2 className="w-12 h-12 mx-auto text-primary animate-spin mb-4" /><p>Uploading {fileName}...</p></>
              ) : (
                <>
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Drag & Drop PDF</h3>
                  <input type="file" accept=".pdf" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" id="pdf-upload" />
                  <label htmlFor="pdf-upload"><Button variant="outline" asChild><span><FileText className="w-4 h-4 mr-2" />Browse</span></Button></label>
                </>
              )}
            </div>
          </div>
          <Button variant="outline" onClick={() => setCurrentStep(1)} className="mt-4"><ChevronLeft className="w-4 h-4 mr-2" />Back</Button>
        </div>
      )}
    </div>
  );
};

export default UploadCurriculumPDF;

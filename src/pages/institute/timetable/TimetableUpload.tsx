import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InfoTooltip, ParsedGridPreview } from "@/components/timetable";
import { ParsedTimetableValidator } from "@/components/timetable/ParsedTimetableValidator";
import type { ParsedEntry } from "@/components/timetable";
import { cn } from "@/lib/utils";
import { batches } from "@/data/instituteData";
import { teacherLoads } from "@/data/timetableData";
import { 
  Upload, 
  FileImage, 
  Wand2, 
  Check, 
  X, 
  ArrowRight,
  AlertTriangle,
  Loader2,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  BookOpen
} from "lucide-react";
import { toast } from "sonner";

// Mock parsed timetable data (simulating OCR result)
const mockParsedData = {
  entries: [
    { day: "Monday", period: 1, subject: "Mathematics", teacher: "Mrs. Priya Sharma", confidence: 0.95 },
    { day: "Monday", period: 2, subject: "Physics", teacher: "Dr. Rajesh Kumar", confidence: 0.92 },
    { day: "Monday", period: 3, subject: "Chemistry", teacher: "Mr. Suresh Verma", confidence: 0.88 },
    { day: "Monday", period: 4, subject: "English", teacher: "Mr. Vikram Singh", confidence: 0.75 },
    { day: "Tuesday", period: 1, subject: "Physics", teacher: "Dr. Rajesh Kumar", confidence: 0.90 },
    { day: "Tuesday", period: 2, subject: "Mathematics", teacher: "Mrs. Priya Sharma", confidence: 0.94 },
    { day: "Tuesday", period: 3, subject: "Biology", teacher: "Ms. Anjali Gupta", confidence: 0.85 },
    { day: "Wednesday", period: 1, subject: "Chemistry", teacher: "Mr. Suresh Verma", confidence: 0.91 },
    { day: "Wednesday", period: 2, subject: "English", teacher: "Mr. Vikram Sigh", confidence: 0.65 }, // Intentional typo
  ]
};

const TimetableUpload = () => {
  const navigate = useNavigate();
  
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isParsed, setIsParsed] = useState(false);
  const [parsedEntries, setParsedEntries] = useState<ParsedEntry[]>([]);
  const [imageZoom, setImageZoom] = useState(100);

  const selectedBatch = batches.find(b => b.id === selectedBatchId);

  // Get teachers assigned to selected batch for validation
  const batchTeachers = selectedBatchId 
    ? teacherLoads.filter(t => t.allowedBatches.some(ab => ab.batchId === selectedBatchId))
    : [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(selectedFile);
      setIsParsed(false);
      setParsedEntries([]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(droppedFile);
      setIsParsed(false);
      setParsedEntries([]);
    }
  };

  const handleProcess = async () => {
    if (!selectedBatchId) {
      toast.error("Please select a batch first");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Set mock parsed data
    setParsedEntries(mockParsedData.entries.map(e => ({ ...e, isEditing: false })));
    setIsParsed(true);
    setIsProcessing(false);
    
    toast.success("Timetable parsed successfully!", {
      description: `Found ${mockParsedData.entries.length} entries`
    });
  };

  const handleUpdateEntry = (index: number, field: keyof ParsedEntry, value: string) => {
    setParsedEntries(prev => prev.map((e, i) => 
      i === index ? { ...e, [field]: value, confidence: 1.0 } : e
    ));
  };

  const handleRemoveEntry = (index: number) => {
    setParsedEntries(prev => prev.filter((_, i) => i !== index));
    toast.info("Entry removed");
  };

  const handleAddEntry = (day: string, period: number) => {
    setParsedEntries(prev => [...prev, { day, period, subject: "New Subject", teacher: "New Teacher", confidence: 1.0 }]);
    toast.success("Entry added - click to edit");
  };

  // Check if there are blocking errors
  const hasBlockingErrors = parsedEntries.some(entry => {
    // Check teacher not found or not assigned
    const teacherMatch = teacherLoads.find(
      t => t.teacherName.toLowerCase().includes(entry.teacher.toLowerCase()) ||
           entry.teacher.toLowerCase().includes(t.teacherName.split(' ').pop()?.toLowerCase() || '')
    );
    if (!teacherMatch) return true;
    if (!teacherMatch.allowedBatches.some(ab => ab.batchId === selectedBatchId)) return true;
    return false;
  });

  const handleEmbed = () => {
    if (hasBlockingErrors) {
      toast.error("Please fix all errors before embedding");
      return;
    }
    
    toast.success("Timetable embedded successfully!", {
      description: `${parsedEntries.length} entries added to ${selectedBatch?.className} - ${selectedBatch?.name} timetable.`
    });
    navigate("/institute/timetable");
  };

  const lowConfidenceCount = parsedEntries.filter(e => e.confidence < 0.8).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Upload Existing Timetable"
        description="Upload a photo or screenshot of your paper timetable and we'll digitize it automatically using AI."
        breadcrumbs={[
          { label: "Timetable", href: "/institute/timetable" },
          { label: "Upload" },
        ]}
      />

      {/* Step 1: Batch Selection */}
      <Card className={cn(
        "border-2 transition-colors",
        selectedBatchId ? "border-green-200 bg-green-50/30" : "border-primary/30 bg-primary/5"
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
              selectedBatchId ? "bg-green-100 text-green-700" : "bg-primary/10 text-primary"
            )}>
              {selectedBatchId ? <Check className="w-4 h-4" /> : "1"}
            </div>
            <div>
              <CardTitle className="text-base">Select Batch</CardTitle>
              <CardDescription>Which batch is this timetable for?</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select value={selectedBatchId || ""} onValueChange={(v) => setSelectedBatchId(v)}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Choose a batch..." />
              </SelectTrigger>
              <SelectContent>
                {batches.map(batch => (
                  <SelectItem key={batch.id} value={batch.id}>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      <span>{batch.className} - {batch.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedBatch && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {selectedBatch.subjects.length} subjects
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {batchTeachers.length} teachers assigned
                </Badge>
              </div>
            )}
          </div>
          {!selectedBatchId && (
            <p className="text-xs text-muted-foreground mt-2">
              Select a batch before uploading. The parsed data will be validated against this batch's teachers and subjects.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Upload Area - Only enabled after batch selection */}
      {!preview && (
        <Card className={cn(!selectedBatchId && "opacity-60 pointer-events-none")}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <CardTitle className="text-base">Upload Image</CardTitle>
                <CardDescription>Upload your paper timetable</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={cn(
                "border-2 border-dashed rounded-2xl p-12 text-center transition-all",
                selectedBatchId && "hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
              )}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="timetable-upload"
                disabled={!selectedBatchId}
              />
              <label htmlFor="timetable-upload" className={cn(selectedBatchId && "cursor-pointer")}>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Upload Your Timetable</h3>
                <p className="text-muted-foreground mb-4">
                  Drag and drop an image, or click to browse
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <FileImage className="w-4 h-4" />
                  <span>Supports JPG, PNG, PDF photos</span>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview and Process */}
      {preview && !isParsed && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Uploaded Image
              </CardTitle>
              <CardDescription>
                Preview for {selectedBatch?.className} - {selectedBatch?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative rounded-xl overflow-hidden border">
                <img 
                  src={preview} 
                  alt="Timetable preview" 
                  className="w-full h-auto max-h-[400px] object-contain bg-muted/50"
                />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => { setFile(null); setPreview(null); }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove
                </Button>
                <Button 
                  onClick={handleProcess}
                  disabled={isProcessing || !selectedBatchId}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Parse with AI
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                AI Processing
                <InfoTooltip content="Our AI will scan your timetable image and extract all the schedule information automatically." />
              </CardTitle>
              <CardDescription>How it works</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { step: 1, title: "Image Analysis", desc: "AI scans the uploaded timetable image" },
                  { step: 2, title: "Text Extraction", desc: "Identifies days, periods, subjects, and teachers" },
                  { step: 3, title: "Batch Validation", desc: `Maps data against ${selectedBatch?.name || 'batch'} configuration` },
                  { step: 4, title: "Review & Edit", desc: "You verify and correct any mistakes" },
                ].map(item => (
                  <div key={item.step} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {isProcessing && (
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <div>
                      <p className="font-medium text-sm">Analyzing your timetable...</p>
                      <p className="text-xs text-muted-foreground">This usually takes 10-30 seconds</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Parsed Results - Side by Side View */}
      {isParsed && (
        <div className="space-y-6">
          {/* Summary */}
          <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Parsing Complete</h3>
                    <p className="text-sm text-muted-foreground">
                      Found {parsedEntries.length} entries for {selectedBatch?.className} - {selectedBatch?.name}
                    </p>
                  </div>
                </div>
                {lowConfidenceCount > 0 && (
                  <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {lowConfidenceCount} need review
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Validation Report */}
          <ParsedTimetableValidator
            entries={parsedEntries}
            selectedBatchId={selectedBatchId}
            onFixIssue={(issue) => {
              if (issue.actionPath) {
                navigate(issue.actionPath);
              }
            }}
          />

          {/* Side by Side: Original Image + Parsed Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original Image with Zoom */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Original Image
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setImageZoom(z => Math.max(50, z - 25))}>
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground w-12 text-center">{imageZoom}%</span>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setImageZoom(z => Math.min(200, z + 25))}>
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto max-h-[500px] border rounded-lg bg-muted/20">
                  <img 
                    src={preview!} 
                    alt="Original timetable" 
                    style={{ width: `${imageZoom}%` }}
                    className="object-contain"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Parsed Grid Preview */}
            <ParsedGridPreview
              entries={parsedEntries}
              onUpdateEntry={handleUpdateEntry}
              onRemoveEntry={handleRemoveEntry}
              onAddEntry={handleAddEntry}
            />
          </div>

          {/* Embed Actions */}
          <div className={cn(
            "flex items-center justify-between p-4 rounded-xl border",
            hasBlockingErrors 
              ? "bg-red-50/50 border-red-200" 
              : "bg-muted/30"
          )}>
            <div>
              <p className="font-medium">
                {hasBlockingErrors ? 'Fix errors before embedding' : 'Ready to embed?'}
              </p>
              <p className="text-sm text-muted-foreground">
                {hasBlockingErrors 
                  ? 'Resolve all errors in the validation report above'
                  : `These entries will be added to ${selectedBatch?.className} - ${selectedBatch?.name} timetable`
                }
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => { setFile(null); setPreview(null); setIsParsed(false); setParsedEntries([]); }}
              >
                Upload Different Image
              </Button>
              <Button 
                onClick={handleEmbed} 
                disabled={hasBlockingErrors}
                className={cn(hasBlockingErrors && "opacity-50 cursor-not-allowed")}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Embed to Timetable
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetableUpload;

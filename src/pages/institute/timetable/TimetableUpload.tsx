import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoTooltip, ParsedGridPreview } from "@/components/timetable";
import type { ParsedEntry } from "@/components/timetable";
import { cn } from "@/lib/utils";
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
  ZoomOut
} from "lucide-react";
import { toast } from "sonner";

// Mock parsed timetable data (simulating OCR result)
const mockParsedData = {
  batch: "Class 10 - Section A",
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

// ParsedEntry type is imported from @/components/timetable

const TimetableUpload = () => {
  const navigate = useNavigate();
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isParsed, setIsParsed] = useState(false);
  const [parsedEntries, setParsedEntries] = useState<ParsedEntry[]>([]);
  const [imageZoom, setImageZoom] = useState(100);

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

  const handleEmbed = () => {
    // In real app, this would save to database
    toast.success("Timetable embedded successfully!", {
      description: "The parsed entries have been added to your timetable."
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

      {/* Upload Area */}
      {!preview && (
        <Card>
          <CardContent className="pt-6">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={cn(
                "border-2 border-dashed rounded-2xl p-12 text-center transition-all",
                "hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
              )}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="timetable-upload"
              />
              <label htmlFor="timetable-upload" className="cursor-pointer">
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
              <CardDescription>Preview of your timetable image</CardDescription>
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
                  disabled={isProcessing}
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
                  { step: 3, title: "Data Matching", desc: "Maps extracted names to your existing teachers" },
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
                      Found {parsedEntries.length} entries for {mockParsedData.batch}
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
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border">
            <div>
              <p className="font-medium">Ready to embed?</p>
              <p className="text-sm text-muted-foreground">
                These entries will be added to your digital timetable
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => { setFile(null); setPreview(null); setIsParsed(false); setParsedEntries([]); }}
              >
                Upload Different Image
              </Button>
              <Button onClick={handleEmbed} className="gap-2">
                <ArrowRight className="w-4 h-4" />
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

import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InfoTooltip, ParsedGridPreview } from "@/components/timetable";
import { ParsedTimetableValidator } from "@/components/timetable/ParsedTimetableValidator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { 
  Upload, FileImage, Wand2, Check, X, ArrowRight, AlertTriangle, 
  Loader2, Image as ImageIcon, ZoomIn, ZoomOut, BookOpen, RefreshCcw, SkipForward 
} from "lucide-react";
import { useTimetableUpload } from "@/hooks/useTimetableUpload";

const TimetableUpload = () => {
  const upload = useTimetableUpload();

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
      <Card className={cn("border-2 transition-colors", upload.selectedBatchId ? "border-green-200 bg-green-50/30" : "border-primary/30 bg-primary/5")}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold", upload.selectedBatchId ? "bg-green-100 text-green-700" : "bg-primary/10 text-primary")}>
              {upload.selectedBatchId ? <Check className="w-4 h-4" /> : "1"}
            </div>
            <div>
              <CardTitle className="text-base">Select Batch</CardTitle>
              <CardDescription>Which batch is this timetable for?</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <Select value={upload.selectedBatchId ?? undefined} onValueChange={upload.setSelectedBatchId}>
              <SelectTrigger className="w-full sm:w-[300px]"><SelectValue placeholder="Choose a batch..." /></SelectTrigger>
              <SelectContent>
                {upload.batches.map(batch => (
                  <SelectItem key={batch.id} value={batch.id}>
                    <div className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-muted-foreground" /><span>{batch.className} - {batch.name}</span></div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {upload.selectedBatch && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">{upload.selectedBatch.subjects.length} subjects</Badge>
                <Badge variant="secondary" className="text-xs">{upload.batchTeachers.length} teachers assigned</Badge>
              </div>
            )}
          </div>
          {!upload.selectedBatchId && <p className="text-xs text-muted-foreground mt-2">Select a batch before uploading.</p>}
        </CardContent>
      </Card>

      {/* Upload Area */}
      {!upload.preview && (
        <Card className={cn(!upload.selectedBatchId && "opacity-60 pointer-events-none")}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold">2</div>
              <div><CardTitle className="text-base">Upload Image</CardTitle><CardDescription>Upload your paper timetable</CardDescription></div>
            </div>
          </CardHeader>
          <CardContent>
            <div onDrop={upload.handleDrop} onDragOver={(e) => e.preventDefault()} className={cn("border-2 border-dashed rounded-2xl p-12 text-center transition-all", upload.selectedBatchId && "hover:border-primary/50 hover:bg-primary/5 cursor-pointer")}>
              <input type="file" accept="image/*" onChange={upload.handleFileChange} className="hidden" id="timetable-upload" disabled={!upload.selectedBatchId} />
              <label htmlFor="timetable-upload" className={cn(upload.selectedBatchId && "cursor-pointer")}>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4"><Upload className="w-8 h-8 text-primary" /></div>
                <h3 className="text-lg font-semibold mb-2">Upload Your Timetable</h3>
                <p className="text-muted-foreground mb-4">Drag and drop an image, or click to browse</p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground"><FileImage className="w-4 h-4" /><span>Supports JPG, PNG, PDF photos</span></div>
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview and Process */}
      {upload.preview && !upload.isParsed && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ImageIcon className="w-5 h-5" />Uploaded Image</CardTitle>
              <CardDescription>Preview for {upload.selectedBatch?.className} - {upload.selectedBatch?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative rounded-xl overflow-hidden border"><img src={upload.preview} alt="Timetable preview" className="w-full h-auto max-h-[400px] object-contain bg-muted/50" /></div>
              <div className="mt-4 flex items-center justify-between">
                <Button variant="outline" onClick={upload.clearUpload}><X className="w-4 h-4 mr-2" />Remove</Button>
                <Button onClick={upload.handleProcess} disabled={upload.isProcessing || !upload.selectedBatchId}>
                  {upload.isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : <><Wand2 className="w-4 h-4 mr-2" />Parse with AI</>}
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Wand2 className="w-5 h-5" />AI Processing<InfoTooltip content="Our AI will scan your timetable image and extract all the schedule information automatically." /></CardTitle>
              <CardDescription>How it works</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[{ step: 1, title: "Image Analysis", desc: "AI scans the uploaded timetable image" }, { step: 2, title: "Text Extraction", desc: "Identifies days, periods, subjects, and teachers" }, { step: 3, title: "Batch Validation", desc: `Maps data against ${upload.selectedBatch?.name || 'batch'} configuration` }, { step: 4, title: "Review & Edit", desc: "You verify and correct any mistakes" }].map(item => (
                  <div key={item.step} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary flex-shrink-0">{item.step}</div>
                    <div><p className="font-medium text-sm">{item.title}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                  </div>
                ))}
              </div>
              {upload.isProcessing && (
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-3"><Loader2 className="w-5 h-5 animate-spin text-primary" /><div><p className="font-medium text-sm">Analyzing your timetable...</p><p className="text-xs text-muted-foreground">This usually takes 10-30 seconds</p></div></div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Parsed Results */}
      {upload.isParsed && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Check className="w-6 h-6 text-primary" /></div>
                  <div><h3 className="font-semibold">Parsing Complete</h3><p className="text-sm text-muted-foreground">Found {upload.parsedEntries.length} entries for {upload.selectedBatch?.className} - {upload.selectedBatch?.name}</p></div>
                </div>
                {upload.lowConfidenceCount > 0 && <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200"><AlertTriangle className="w-3 h-3 mr-1" />{upload.lowConfidenceCount} need review</Badge>}
              </div>
            </CardContent>
          </Card>

          <ParsedTimetableValidator entries={upload.parsedEntries} selectedBatchId={upload.selectedBatchId} onFixIssue={(issue) => { if (issue.actionPath) upload.navigate(issue.actionPath); }} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2"><ImageIcon className="w-5 h-5" />Original Image</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={upload.zoomOut}><ZoomOut className="w-4 h-4" /></Button>
                    <span className="text-sm text-muted-foreground w-12 text-center">{upload.imageZoom}%</span>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={upload.zoomIn}><ZoomIn className="w-4 h-4" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto max-h-[500px] border rounded-lg bg-muted/20">
                  <img src={upload.preview!} alt="Original timetable" style={{ width: `${upload.imageZoom}%` }} className="object-contain" />
                </div>
              </CardContent>
            </Card>
            <ParsedGridPreview entries={upload.parsedEntries} onUpdateEntry={upload.handleUpdateEntry} onRemoveEntry={upload.handleRemoveEntry} onAddEntry={upload.handleAddEntry} />
          </div>

          <div className={cn("flex items-center justify-between p-4 rounded-xl border", upload.hasBlockingErrors ? "bg-red-50/50 border-red-200" : "bg-muted/30")}>
            <div>
              <p className="font-medium">{upload.hasBlockingErrors ? 'Fix errors before embedding' : 'Ready to embed?'}</p>
              <p className="text-sm text-muted-foreground">{upload.hasBlockingErrors ? 'Resolve all errors in the validation report above' : `These entries will be added to ${upload.selectedBatch?.className} - ${upload.selectedBatch?.name} timetable`}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={upload.clearUpload}>Upload Different Image</Button>
              <Button onClick={upload.handleEmbed} disabled={upload.hasBlockingErrors} className={cn(upload.hasBlockingErrors && "opacity-50 cursor-not-allowed")}><ArrowRight className="w-4 h-4 mr-2" />Embed to Timetable</Button>
            </div>
          </div>
        </div>
      )}

      {/* Conflict Resolution Dialog */}
      <Dialog open={upload.conflictDialogOpen} onOpenChange={upload.setConflictDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" />{upload.embedConflicts.length} Slot{upload.embedConflicts.length !== 1 ? 's' : ''} Already Occupied</DialogTitle>
            <DialogDescription>Some slots in the workspace already have entries. How would you like to proceed?</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[250px] pr-4">
            <div className="space-y-2">
              {upload.embedConflicts.map((conflict, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/50 border text-sm">
                  <div className="font-medium">{conflict.day} P{conflict.period}</div>
                  <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                    <span className="line-through">{conflict.existingSubject} ({conflict.existingTeacher})</span>
                    <ArrowRight className="w-3 h-3" />
                    <span className="text-foreground">{conflict.newSubject} ({conflict.newTeacher})</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => upload.setConflictDialogOpen(false)} className="sm:mr-auto">Cancel</Button>
            <Button variant="outline" onClick={upload.handleSkipConflicts}><SkipForward className="w-4 h-4 mr-2" />Skip Conflicts ({upload.parsedEntries.length - upload.embedConflicts.length} entries)</Button>
            <Button onClick={upload.handleReplaceAll}><RefreshCcw className="w-4 h-4 mr-2" />Replace All</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TimetableUpload;

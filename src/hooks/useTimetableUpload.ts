import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format, startOfWeek } from "date-fns";
import { batches } from "@/data/instituteData";
import { teacherLoads, timetableEntries } from "@/data/timetableData";
import type { ParsedEntry } from "@/components/timetable";

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
    { day: "Wednesday", period: 2, subject: "English", teacher: "Mr. Vikram Sigh", confidence: 0.65 },
  ]
};

export interface EmbedConflict {
  day: string;
  period: number;
  existingSubject: string;
  existingTeacher: string;
  newSubject: string;
  newTeacher: string;
}

export const useTimetableUpload = () => {
  const navigate = useNavigate();
  
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isParsed, setIsParsed] = useState(false);
  const [parsedEntries, setParsedEntries] = useState<ParsedEntry[]>([]);
  const [imageZoom, setImageZoom] = useState(100);
  
  // Conflict dialog state
  const [conflictDialogOpen, setConflictDialogOpen] = useState(false);
  const [embedConflicts, setEmbedConflicts] = useState<EmbedConflict[]>([]);

  const selectedBatch = batches.find(b => b.id === selectedBatchId);

  // Get teachers assigned to selected batch for validation
  const batchTeachers = selectedBatchId 
    ? teacherLoads.filter(t => t.allowedBatches.some(ab => ab.batchId === selectedBatchId))
    : [];

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(selectedFile);
      setIsParsed(false);
      setParsedEntries([]);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
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
  }, []);

  const handleProcess = useCallback(async () => {
    if (!selectedBatchId) {
      toast.error("Please select a batch first");
      return;
    }
    
    setIsProcessing(true);
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setParsedEntries(mockParsedData.entries.map(e => ({ ...e, isEditing: false })));
    setIsParsed(true);
    setIsProcessing(false);
    
    toast.success("Timetable parsed successfully!", {
      description: `Found ${mockParsedData.entries.length} entries`
    });
  }, [selectedBatchId]);

  const handleUpdateEntry = useCallback((index: number, field: keyof ParsedEntry, value: string) => {
    setParsedEntries(prev => prev.map((e, i) => 
      i === index ? { ...e, [field]: value, confidence: 1.0 } : e
    ));
  }, []);

  const handleRemoveEntry = useCallback((index: number) => {
    setParsedEntries(prev => prev.filter((_, i) => i !== index));
    toast.info("Entry removed");
  }, []);

  const handleAddEntry = useCallback((day: string, period: number) => {
    setParsedEntries(prev => [...prev, { day, period, subject: "New Subject", teacher: "New Teacher", confidence: 1.0 }]);
    toast.success("Entry added - click to edit");
  }, []);

  // Check if there are blocking errors
  const hasBlockingErrors = parsedEntries.some(entry => {
    const teacherMatch = teacherLoads.find(
      t => t.teacherName.toLowerCase().includes(entry.teacher.toLowerCase()) ||
           entry.teacher.toLowerCase().includes(t.teacherName.split(' ').pop()?.toLowerCase() || '')
    );
    if (!teacherMatch) return true;
    if (!teacherMatch.allowedBatches.some(ab => ab.batchId === selectedBatchId)) return true;
    return false;
  });

  // Detect overlapping entries with existing timetable
  const detectOverlaps = useCallback((): EmbedConflict[] => {
    if (!selectedBatchId) return [];
    
    const conflicts: EmbedConflict[] = [];
    
    parsedEntries.forEach(parsed => {
      const existingEntry = timetableEntries.find(
        e => e.batchId === selectedBatchId && e.day === parsed.day && e.periodNumber === parsed.period
      );
      
      if (existingEntry) {
        conflicts.push({
          day: parsed.day,
          period: parsed.period,
          existingSubject: existingEntry.subjectName,
          existingTeacher: existingEntry.teacherName,
          newSubject: parsed.subject,
          newTeacher: parsed.teacher,
        });
      }
    });
    
    return conflicts;
  }, [parsedEntries, selectedBatchId]);

  const proceedWithEmbed = useCallback((entriesToEmbed: ParsedEntry[]) => {
    if (!selectedBatchId) return;
    
    const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
    
    toast.success("Timetable embedded successfully!", {
      description: `${entriesToEmbed.length} entries added to ${selectedBatch?.className} - ${selectedBatch?.name} timetable.`
    });
    
    navigate("/institute/timetable", {
      state: {
        embedData: {
          batchId: selectedBatchId,
          entries: entriesToEmbed,
          weekStart,
        }
      }
    });
  }, [selectedBatchId, selectedBatch, navigate]);

  const handleEmbed = useCallback(() => {
    if (hasBlockingErrors) {
      toast.error("Please fix all errors before embedding");
      return;
    }
    
    const conflicts = detectOverlaps();
    
    if (conflicts.length > 0) {
      setEmbedConflicts(conflicts);
      setConflictDialogOpen(true);
      return;
    }
    
    proceedWithEmbed(parsedEntries);
  }, [hasBlockingErrors, detectOverlaps, parsedEntries, proceedWithEmbed]);

  const handleReplaceAll = useCallback(() => {
    setConflictDialogOpen(false);
    proceedWithEmbed(parsedEntries);
  }, [parsedEntries, proceedWithEmbed]);

  const handleSkipConflicts = useCallback(() => {
    const nonConflictingEntries = parsedEntries.filter(parsed => {
      return !embedConflicts.some(
        c => c.day === parsed.day && c.period === parsed.period
      );
    });
    
    setConflictDialogOpen(false);
    
    if (nonConflictingEntries.length === 0) {
      toast.info("No entries to embed", { description: "All entries conflict with existing schedule" });
      return;
    }
    
    proceedWithEmbed(nonConflictingEntries);
  }, [parsedEntries, embedConflicts, proceedWithEmbed]);

  const clearUpload = useCallback(() => {
    setFile(null);
    setPreview(null);
    setIsParsed(false);
    setParsedEntries([]);
  }, []);

  const zoomIn = useCallback(() => setImageZoom(z => Math.min(200, z + 25)), []);
  const zoomOut = useCallback(() => setImageZoom(z => Math.max(50, z - 25)), []);

  const lowConfidenceCount = parsedEntries.filter(e => e.confidence < 0.8).length;

  return {
    // Navigation
    navigate,
    
    // Batch state
    selectedBatchId,
    setSelectedBatchId,
    selectedBatch,
    batchTeachers,
    
    // File state
    file,
    preview,
    handleFileChange,
    handleDrop,
    clearUpload,
    
    // Processing state
    isProcessing,
    isParsed,
    handleProcess,
    
    // Parsed entries
    parsedEntries,
    handleUpdateEntry,
    handleRemoveEntry,
    handleAddEntry,
    hasBlockingErrors,
    lowConfidenceCount,
    
    // Image zoom
    imageZoom,
    zoomIn,
    zoomOut,
    
    // Conflict state
    conflictDialogOpen,
    setConflictDialogOpen,
    embedConflicts,
    
    // Actions
    handleEmbed,
    handleReplaceAll,
    handleSkipConflicts,
    
    // Static data
    batches,
  };
};

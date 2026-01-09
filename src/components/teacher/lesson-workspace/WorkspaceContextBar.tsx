import { useState } from "react";
import { Calendar, BookOpen, GraduationCap, Eye, Edit3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { WorkspaceContext } from "./types";

interface WorkspaceContextBarProps {
  context: WorkspaceContext;
  onContextChange?: (updates: Partial<WorkspaceContext>) => void;
}

// Mock data for dropdowns
const mockClasses = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
const mockSubjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English'];
const mockChapters: Record<string, string[]> = {
  'Physics': ['Mechanics', 'Electrostatics', 'Optics', 'Thermodynamics', 'Waves'],
  'Chemistry': ['Atomic Structure', 'Chemical Bonding', 'Organic Chemistry', 'Thermodynamics'],
  'Mathematics': ['Calculus', 'Algebra', 'Trigonometry', 'Coordinate Geometry', 'Probability'],
  'Biology': ['Cell Biology', 'Genetics', 'Ecology', 'Human Physiology'],
  'English': ['Grammar', 'Literature', 'Writing Skills'],
};
const mockBatches = ['10A', '10B', '11A', '11B', '12A'];

export const WorkspaceContextBar = ({ context, onContextChange }: WorkspaceContextBarProps) => {
  const { className, subject, chapter, scheduledDate, batchName, isFromTimetable } = context;
  
  // Toggle state for demo: true = Context Mode (read-only), false = Selection Mode (dropdowns)
  const [isContextMode, setIsContextMode] = useState(isFromTimetable ?? true);
  
  // Local state for selection mode
  const [selectedClass, setSelectedClass] = useState(className || '');
  const [selectedSubject, setSelectedSubject] = useState(subject || '');
  const [selectedChapter, setSelectedChapter] = useState(chapter || '');
  const [selectedBatch, setSelectedBatch] = useState(batchName || '');
  const [selectedDate, setSelectedDate] = useState(scheduledDate || '');
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Not set';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const availableChapters = selectedSubject ? mockChapters[selectedSubject] || [] : [];

  // Handle subject change - reset chapter when subject changes
  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    setSelectedChapter('');
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-border/50 p-3 sm:p-4">
      {/* Header with Toggle */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Lesson Context
        </h3>
        
        {/* Demo Toggle */}
        <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-2 py-1">
          <Edit3 className={`w-3.5 h-3.5 transition-colors ${!isContextMode ? 'text-primary' : 'text-muted-foreground'}`} />
          <Switch 
            id="context-mode-toggle"
            checked={isContextMode}
            onCheckedChange={setIsContextMode}
            className="data-[state=checked]:bg-emerald-500"
          />
          <Eye className={`w-3.5 h-3.5 transition-colors ${isContextMode ? 'text-emerald-600' : 'text-muted-foreground'}`} />
          <Label 
            htmlFor="context-mode-toggle" 
            className="text-xs font-medium cursor-pointer whitespace-nowrap"
          >
            {isContextMode ? 'From Schedule' : 'Manual Entry'}
          </Label>
        </div>
      </div>
      
      {isContextMode ? (
        /* ===== CONTEXT MODE: Read-only cards (from Schedule) ===== */
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Class */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <GraduationCap className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase">Class</p>
                <p className="text-sm font-medium truncate">{className || 'Not set'}</p>
              </div>
            </div>
            
            {/* Subject */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[hsl(var(--donut-coral))]/10 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 text-[hsl(var(--donut-coral))]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase">Subject</p>
                <p className="text-sm font-medium truncate">{subject || 'Not set'}</p>
              </div>
            </div>
            
            {/* Chapter */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[hsl(var(--donut-orange))]/10 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 text-[hsl(var(--donut-orange))]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase">Chapter</p>
                <p className="text-sm font-medium truncate">{chapter || 'Not set'}</p>
              </div>
            </div>
            
            {/* Batch & Date */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[hsl(var(--donut-pink))]/10 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-[hsl(var(--donut-pink))]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase">Batch • Date</p>
                <p className="text-sm font-medium truncate">{batchName} • {formatDate(scheduledDate)}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-border/50">
            <Badge variant="secondary" className="text-[10px] bg-emerald-50 text-emerald-700 border-0">
              ✓ Context auto-filled from Schedule
            </Badge>
          </div>
        </>
      ) : (
        /* ===== SELECTION MODE: Dropdowns (Create New) ===== */
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Class Dropdown */}
            <div className="space-y-1.5">
              <Label className="text-[10px] text-muted-foreground uppercase">Class *</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="h-10 bg-background">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-primary shrink-0" />
                    <SelectValue placeholder="Select class" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {mockClasses.map((cls) => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Subject Dropdown */}
            <div className="space-y-1.5">
              <Label className="text-[10px] text-muted-foreground uppercase">Subject *</Label>
              <Select value={selectedSubject} onValueChange={handleSubjectChange}>
                <SelectTrigger className="h-10 bg-background">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[hsl(var(--donut-coral))] shrink-0" />
                    <SelectValue placeholder="Select subject" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {mockSubjects.map((sub) => (
                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Chapter Dropdown */}
            <div className="space-y-1.5">
              <Label className="text-[10px] text-muted-foreground uppercase">Chapter *</Label>
              <Select 
                value={selectedChapter} 
                onValueChange={setSelectedChapter}
                disabled={!selectedSubject}
              >
                <SelectTrigger className="h-10 bg-background">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[hsl(var(--donut-orange))] shrink-0" />
                    <SelectValue placeholder={selectedSubject ? "Select chapter" : "Select subject first"} />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {availableChapters.map((ch) => (
                    <SelectItem key={ch} value={ch}>{ch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Batch & Date (optional) */}
            <div className="space-y-1.5">
              <Label className="text-[10px] text-muted-foreground uppercase">Batch & Date (Optional)</Label>
              <div className="flex gap-2">
                <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                  <SelectTrigger className="h-10 bg-background flex-1">
                    <SelectValue placeholder="Batch" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {mockBatches.map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input 
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="h-10 px-3 rounded-md border border-input bg-background text-sm w-[130px]"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-border/50">
            <Badge variant="secondary" className="text-[10px] bg-amber-50 text-amber-700 border-0">
              ⚡ Manual entry mode – Select class, subject & chapter
            </Badge>
          </div>
        </>
      )}
    </div>
  );
};

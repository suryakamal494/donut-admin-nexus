import { Calendar, BookOpen, Users, GraduationCap, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { WorkspaceContext } from "./types";

interface WorkspaceContextBarProps {
  context: WorkspaceContext;
  onEdit?: () => void;
}

export const WorkspaceContextBar = ({ context, onEdit }: WorkspaceContextBarProps) => {
  const { className, subject, chapter, scheduledDate, batchName, isFromTimetable } = context;
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Not set';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-border/50 p-3 sm:p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Lesson Context
        </h3>
        {!isFromTimetable && onEdit && (
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs gap-1" onClick={onEdit}>
            <Pencil className="w-3 h-3" />
            Edit
          </Button>
        )}
      </div>
      
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
      
      {isFromTimetable && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <Badge variant="secondary" className="text-[10px] bg-emerald-50 text-emerald-700 border-0">
            ✓ Context from Schedule
          </Badge>
        </div>
      )}
    </div>
  );
};

import { ChevronLeft, ChevronRight, Upload, User, BookOpen, AlertCircle, CheckCircle2, Copy, Save, Send, Settings, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TimetableToolbarProps {
  // Week navigation
  currentWeekStart: Date;
  weekEndDate: Date;
  goToPreviousWeek: () => void;
  goToNextWeek: () => void;
  goToCurrentWeek: () => void;
  
  // View mode
  viewMode: 'teacher' | 'batch';
  setViewMode: (mode: 'teacher' | 'batch') => void;
  setSelectedBatchId: (id: string | null) => void;
  
  // Conflicts
  conflictCount: number;
  conflictPanelOpen: boolean;
  setConflictPanelOpen: (open: boolean) => void;
  
  // Save status
  saveStatus: 'unsaved' | 'draft' | 'published';
  handleSaveDraft: () => void;
  handlePublish: () => void;
  
  // Actions
  onUploadClick: () => void;
  onCopyWeekClick: () => void;
  onSetupClick: () => void;
  onViewClick: () => void;
  
  // Other
  entriesCount: number;
}

export const TimetableToolbar = ({
  currentWeekStart,
  weekEndDate,
  goToPreviousWeek,
  goToNextWeek,
  goToCurrentWeek,
  viewMode,
  setViewMode,
  setSelectedBatchId,
  conflictCount,
  conflictPanelOpen,
  setConflictPanelOpen,
  saveStatus,
  handleSaveDraft,
  handlePublish,
  onUploadClick,
  onCopyWeekClick,
  onSetupClick,
  onViewClick,
  entriesCount,
}: TimetableToolbarProps) => {
  return (
    <Card className="p-2 sm:p-2.5 bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3">
        {/* Week Selector */}
        <div className="flex items-center gap-0.5 sm:gap-1 bg-background rounded-lg border p-0.5">
          <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-7 sm:w-7" onClick={goToPreviousWeek}>
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <div className="px-1.5 sm:px-2 py-1 min-w-[100px] sm:min-w-[140px] text-center">
            <p className="text-[10px] sm:text-xs font-semibold">
              {format(currentWeekStart, 'MMM d')} – {format(weekEndDate, 'MMM d')}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-7 sm:w-7" onClick={goToNextWeek}>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm" className="h-6 sm:h-7 text-[10px] sm:text-xs hidden md:flex" onClick={goToCurrentWeek}>
          Today
        </Button>

        {/* Divider */}
        <div className="h-4 sm:h-5 w-px bg-border hidden sm:block" />

        {/* View Mode Toggle */}
        <Tabs value={viewMode} onValueChange={(v) => { setViewMode(v as 'teacher' | 'batch'); setSelectedBatchId(null); }} className="h-6 sm:h-7">
          <TabsList className="h-6 sm:h-7 p-0.5">
            <TabsTrigger value="teacher" className="h-5 sm:h-6 px-1.5 sm:px-2 text-[10px] sm:text-xs gap-0.5 sm:gap-1">
              <User className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span className="hidden sm:inline">Teacher</span>
            </TabsTrigger>
            <TabsTrigger value="batch" className="h-5 sm:h-6 px-1.5 sm:px-2 text-[10px] sm:text-xs gap-0.5 sm:gap-1">
              <BookOpen className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span className="hidden sm:inline">Batch</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Conflict Badge - Click to expand */}
        <Collapsible open={conflictPanelOpen} onOpenChange={setConflictPanelOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "h-7 text-xs gap-1",
                conflictCount > 0 ? "text-destructive hover:text-destructive" : "text-green-600 hover:text-green-600"
              )}
            >
              {conflictCount > 0 ? (
                <>
                  <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  {conflictCount}
                  <span className="hidden sm:inline"> Conflict{conflictCount !== 1 ? 's' : ''}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden md:inline">No Conflicts</span>
                </>
              )}
            </Button>
          </CollapsibleTrigger>
        </Collapsible>

        {/* Upload Image - Prominent Action */}
        <Button 
          variant="outline" 
          size="sm" 
          className="h-6 sm:h-7 text-[10px] sm:text-xs gap-1 border-primary/30 hover:border-primary hover:bg-primary/5" 
          onClick={onUploadClick}
        >
          <Upload className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="hidden md:inline">Upload</span>
        </Button>

        {/* Copy Week */}
        <Button 
          variant="outline" 
          size="sm" 
          className="h-6 sm:h-7 text-[10px] sm:text-xs gap-1 hidden sm:flex" 
          onClick={onCopyWeekClick}
          disabled={entriesCount === 0}
        >
          <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="hidden md:inline">Copy Week</span>
        </Button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Save Status */}
        {saveStatus !== 'unsaved' && (
          <Badge 
            variant={saveStatus === 'published' ? 'default' : 'secondary'} 
            className={cn(
              "text-[10px] sm:text-xs h-5 sm:h-6",
              saveStatus === 'published' && "bg-green-100 text-green-700 hover:bg-green-100"
            )}
          >
            {saveStatus === 'draft' ? 'Draft' : 'Published'}
          </Badge>
        )}

        {/* Save/Publish Buttons */}
        <Button variant="outline" size="sm" className="h-6 sm:h-7 text-[10px] sm:text-xs px-2 sm:px-3" onClick={handleSaveDraft}>
          <Save className="w-3 h-3 sm:mr-1" />
          <span className="hidden sm:inline">Save</span>
        </Button>
        <Button size="sm" className="h-6 sm:h-7 text-[10px] sm:text-xs px-2 sm:px-3" onClick={handlePublish}>
          <Send className="w-3 h-3 sm:mr-1" />
          <span className="hidden sm:inline">Publish</span>
        </Button>

        {/* Settings Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-7 sm:w-7" title="Timetable settings">
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onSetupClick}>
              <Settings className="w-4 h-4 mr-2" />
              Setup & Configuration
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onViewClick}>
              <Eye className="w-4 h-4 mr-2" />
              View Timetable
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
};

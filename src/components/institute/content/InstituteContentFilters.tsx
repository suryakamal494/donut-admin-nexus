import { Search, Filter, Grid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContentType } from "@/components/content/ContentTypeIcon";
import { availableClasses, availableSubjects, assignedTracks } from "@/data/instituteData";
import { cn } from "@/lib/utils";
import { getSubjectsForCourse } from "@/data/masterData";
import { subjects as masterSubjects } from "@/data/masterData";

export type SourceFilter = "all" | "global" | "institute";
export type CourseFilter = "all" | string;

interface InstituteContentFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sourceFilter: SourceFilter;
  onSourceChange: (value: SourceFilter) => void;
  courseFilter: CourseFilter;
  onCourseChange: (value: CourseFilter) => void;
  typeFilter: ContentType | "all";
  onTypeChange: (value: ContentType | "all") => void;
  subjectFilter: string;
  onSubjectChange: (value: string) => void;
  classFilter: string;
  onClassChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  totalItems: number;
}

const contentTypes: { value: ContentType | "all"; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "video", label: "Video" },
  { value: "pdf", label: "PDF" },
  { value: "ppt", label: "Presentation" },
  { value: "iframe", label: "Interactive" },
  { value: "animation", label: "Animation" },
  { value: "image", label: "Image" },
  { value: "audio", label: "Audio" },
  { value: "scorm", label: "SCORM" },
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

export const InstituteContentFilters = ({
  searchQuery,
  onSearchChange,
  sourceFilter,
  onSourceChange,
  courseFilter,
  onCourseChange,
  typeFilter,
  onTypeChange,
  subjectFilter,
  onSubjectChange,
  classFilter,
  onClassChange,
  statusFilter,
  onStatusChange,
  viewMode,
  onViewModeChange,
  totalItems,
}: InstituteContentFiltersProps) => {
  // Determine if selected course has classes
  const selectedTrack = assignedTracks.find(t => t.id === courseFilter);
  const showClassFilter = courseFilter === "all" || (selectedTrack?.hasClasses ?? true);
  
  // Get subjects based on course selection
  const getAvailableSubjects = () => {
    if (courseFilter === "all") return availableSubjects;
    if (selectedTrack?.hasClasses) {
      // CBSE-like curriculum - use availableSubjects
      return availableSubjects;
    } else {
      // Course-based like JEE - get subjects from course
      const courseSubjects = getSubjectsForCourse(courseFilter);
      return courseSubjects.map(cs => ({ id: cs.id, name: cs.name }));
    }
  };
  
  const filteredSubjects = getAvailableSubjects();
  
  return (
    <div className="bg-card rounded-2xl p-3 sm:p-4 shadow-soft border border-border/50 space-y-3 sm:space-y-4">
      {/* Top row: Search + Source Toggle + Course Toggle */}
      <div className="flex flex-col xl:flex-row gap-3 xl:gap-4 items-stretch xl:items-center">
        {/* Search - full width on mobile */}
        <div className="relative w-full xl:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search content..." 
            value={searchQuery} 
            onChange={(e) => onSearchChange(e.target.value)} 
            className="pl-10" 
          />
        </div>
        
        {/* Source Toggle - horizontal scroll on small screens */}
        <div className="flex items-center gap-2 w-full xl:w-auto">
          <span className="text-sm font-medium text-muted-foreground shrink-0 hidden sm:block">Source:</span>
          <div className="flex border border-border rounded-lg bg-muted/30 overflow-x-auto w-full xl:w-auto">
            <Button 
              variant={sourceFilter === "all" ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => onSourceChange("all")}
              className={cn(
                "rounded-r-none border-r border-border/50 px-3 sm:px-4 shrink-0",
                sourceFilter === "all" && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              All
            </Button>
            <Button 
              variant={sourceFilter === "global" ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => onSourceChange("global")}
              className={cn(
                "rounded-none border-r border-border/50 px-3 sm:px-4 shrink-0 whitespace-nowrap",
                sourceFilter === "global" && "bg-slate-600 text-white hover:bg-slate-700"
              )}
            >
              <span className="hidden sm:inline">Global Library</span>
              <span className="sm:hidden">Global</span>
            </Button>
            <Button 
              variant={sourceFilter === "institute" ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => onSourceChange("institute")}
              className={cn(
                "rounded-l-none px-3 sm:px-4 shrink-0 whitespace-nowrap",
                sourceFilter === "institute" && "bg-emerald-600 text-white hover:bg-emerald-700"
              )}
            >
              <span className="hidden sm:inline">Our Content</span>
              <span className="sm:hidden">Ours</span>
            </Button>
          </div>
        </div>
        
        {/* Course Toggle - horizontal scroll */}
        <div className="flex items-center gap-2 w-full xl:w-auto">
          <span className="text-sm font-medium text-muted-foreground shrink-0 hidden sm:block">Course:</span>
          <div className="flex border border-border rounded-lg bg-muted/30 overflow-x-auto w-full xl:w-auto">
            <Button 
              variant={courseFilter === "all" ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => onCourseChange("all")}
              className={cn(
                "rounded-r-none border-r border-border/50 px-3 shrink-0",
                courseFilter === "all" && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              All
            </Button>
            {assignedTracks.map((track, index) => (
              <Button 
                key={track.id}
                variant={courseFilter === track.id ? "secondary" : "ghost"} 
                size="sm"
                onClick={() => onCourseChange(track.id)}
                className={cn(
                  "px-3 shrink-0 whitespace-nowrap",
                  index < assignedTracks.length - 1 ? "rounded-none border-r border-border/50" : "rounded-l-none",
                  courseFilter === track.id && "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                {track.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom row: Filters */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Type Filter */}
        <Select value={typeFilter} onValueChange={(v) => onTypeChange(v as ContentType | "all")}>
          <SelectTrigger className="w-full xs:w-[130px] sm:w-36">
            <Filter className="w-4 h-4 mr-2 shrink-0" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            {contentTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Class Filter - Only show for curriculum-based courses */}
        {showClassFilter && (
          <Select value={classFilter} onValueChange={onClassChange}>
            <SelectTrigger className="w-full xs:w-[130px] sm:w-36">
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Classes</SelectItem>
              {availableClasses.map(cls => (
                <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        {/* Subject Filter */}
        <Select value={subjectFilter} onValueChange={onSubjectChange}>
          <SelectTrigger className="w-full xs:w-[130px] sm:w-36">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All Subjects</SelectItem>
            {filteredSubjects.map(subject => (
              <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full xs:w-[130px] sm:w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            {statusOptions.map(status => (
              <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="flex-1 hidden sm:block" />
        
        {/* Results count - hide on very small screens */}
        <span className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
          {totalItems} item{totalItems !== 1 ? 's' : ''}
        </span>
        
        {/* View Mode Toggle */}
        <div className="flex border border-border rounded-lg ml-auto sm:ml-0">
          <Button 
            variant={viewMode === "grid" ? "secondary" : "ghost"} 
            size="icon" 
            onClick={() => onViewModeChange("grid")}
            className="rounded-r-none h-9 w-9"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button 
            variant={viewMode === "list" ? "secondary" : "ghost"} 
            size="icon" 
            onClick={() => onViewModeChange("list")}
            className="rounded-l-none h-9 w-9"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

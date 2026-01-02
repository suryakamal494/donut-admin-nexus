import { Search, Filter, Grid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContentType } from "@/components/content/ContentTypeIcon";
import { availableClasses, availableSubjects } from "@/data/instituteData";
import { cn } from "@/lib/utils";

export type SourceFilter = "all" | "global" | "institute";

interface InstituteContentFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sourceFilter: SourceFilter;
  onSourceChange: (value: SourceFilter) => void;
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
  return (
    <div className="bg-card rounded-2xl p-4 shadow-soft border border-border/50 space-y-4">
      {/* Top row: Search + Source Toggle */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search content by title, description..." 
            value={searchQuery} 
            onChange={(e) => onSearchChange(e.target.value)} 
            className="pl-10" 
          />
        </div>
        
        {/* Source Toggle - Prominent */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Source:</span>
          <div className="flex border border-border rounded-lg bg-muted/30">
            <Button 
              variant={sourceFilter === "all" ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => onSourceChange("all")}
              className={cn(
                "rounded-r-none border-r border-border/50 px-4",
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
                "rounded-none border-r border-border/50 px-4",
                sourceFilter === "global" && "bg-slate-600 text-white hover:bg-slate-700"
              )}
            >
              Global Library
            </Button>
            <Button 
              variant={sourceFilter === "institute" ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => onSourceChange("institute")}
              className={cn(
                "rounded-l-none px-4",
                sourceFilter === "institute" && "bg-emerald-600 text-white hover:bg-emerald-700"
              )}
            >
              Our Content
            </Button>
          </div>
        </div>
      </div>
      
      {/* Bottom row: Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Type Filter */}
        <Select value={typeFilter} onValueChange={(v) => onTypeChange(v as ContentType | "all")}>
          <SelectTrigger className="w-36">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            {contentTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Class Filter */}
        <Select value={classFilter} onValueChange={onClassChange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Class" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All Classes</SelectItem>
            {availableClasses.map(cls => (
              <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Subject Filter */}
        <Select value={subjectFilter} onValueChange={onSubjectChange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All Subjects</SelectItem>
            {availableSubjects.map(subject => (
              <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            {statusOptions.map(status => (
              <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="flex-1" />
        
        {/* Results count */}
        <span className="text-sm text-muted-foreground">
          {totalItems} item{totalItems !== 1 ? 's' : ''} found
        </span>
        
        {/* View Mode Toggle */}
        <div className="flex border border-border rounded-lg">
          <Button 
            variant={viewMode === "grid" ? "secondary" : "ghost"} 
            size="icon" 
            onClick={() => onViewModeChange("grid")}
            className="rounded-r-none"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button 
            variant={viewMode === "list" ? "secondary" : "ghost"} 
            size="icon" 
            onClick={() => onViewModeChange("list")}
            className="rounded-l-none"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

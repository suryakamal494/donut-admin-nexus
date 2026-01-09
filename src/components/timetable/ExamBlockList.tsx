import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ExamBlock, ExamType, scopeTypeConfig } from "@/types/examBlock";
import { defaultExamTypes } from "@/data/examBlockData";
import { cn } from "@/lib/utils";
import { format, parseISO, isAfter, isBefore, startOfDay } from "date-fns";
import { 
  Search, Plus, Edit2, Trash2, Calendar, Clock, Users, Building2, BookOpen, GraduationCap,
  Repeat
} from "lucide-react";

interface ExamBlockListProps {
  blocks: ExamBlock[];
  onEdit: (block: ExamBlock) => void;
  onDelete: (blockId: string) => void;
  onToggleActive: (blockId: string) => void;
  onCreateNew: () => void;
  examTypes?: ExamType[];
}

export const ExamBlockList = ({ 
  blocks, 
  onEdit, 
  onDelete, 
  onToggleActive, 
  onCreateNew,
  examTypes = defaultExamTypes 
}: ExamBlockListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredBlocks = useMemo(() => {
    const today = startOfDay(new Date());
    
    return blocks.filter(block => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = block.name.toLowerCase().includes(query);
        const matchesScope = block.scopeName?.toLowerCase().includes(query);
        if (!matchesName && !matchesScope) return false;
      }

      if (filterType !== "all" && block.examTypeId !== filterType) return false;

      if (filterStatus !== "all") {
        if (filterStatus === "active" && !block.isActive) return false;
        if (filterStatus === "inactive" && block.isActive) return false;
        if (filterStatus === "upcoming") {
          const firstDate = block.dateType === 'recurring' 
            ? block.recurringConfig?.startDate 
            : block.dates[0];
          if (!firstDate || !isAfter(parseISO(firstDate), today)) return false;
        }
        if (filterStatus === "past") {
          const lastDate = block.dateType === 'recurring' 
            ? block.recurringConfig?.endDate 
            : block.dates[block.dates.length - 1];
          if (!lastDate || !isBefore(parseISO(lastDate), today)) return false;
        }
      }

      return true;
    });
  }, [blocks, searchQuery, filterType, filterStatus]);

  const formatBlockDates = (block: ExamBlock) => {
    if (block.dateType === 'recurring' && block.recurringConfig) {
      return `Every ${block.recurringConfig.dayOfWeek}`;
    }
    if (block.dates.length === 1) {
      return format(parseISO(block.dates[0]), 'MMM d, yyyy');
    }
    if (block.dates.length > 1) {
      return `${format(parseISO(block.dates[0]), 'MMM d')} - ${format(parseISO(block.dates[block.dates.length - 1]), 'MMM d, yyyy')}`;
    }
    return 'No dates';
  };

  const formatBlockTime = (block: ExamBlock) => {
    if (block.timeType === 'full_day') return 'Full Day';
    if (block.timeType === 'time_range') return `${block.startTime} - ${block.endTime}`;
    if (block.timeType === 'periods' && block.periods) return `Period ${block.periods.join(', ')}`;
    return '';
  };

  const getScopeIcon = (scopeType: string) => {
    switch (scopeType) {
      case 'institution': return Building2;
      case 'course': return BookOpen;
      case 'class': return GraduationCap;
      case 'batch': return Users;
      default: return Users;
    }
  };

  const getTypeColor = (color?: string) => {
    switch (color) {
      case 'red': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400';
      case 'orange': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400';
      case 'amber': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400';
      case 'green': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400';
      case 'blue': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400';
      case 'purple': return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400';
      case 'pink': return 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getExamType = (typeId: string) => examTypes.find(t => t.id === typeId);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search exams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[130px] shrink-0">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {examTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[130px] shrink-0">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={onCreateNew} className="gap-2 shrink-0">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Exam Schedule</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* List View */}
      {filteredBlocks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No exams found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {blocks.length === 0 
                ? "Create your first exam schedule to reserve time slots"
                : "Try adjusting your filters"}
            </p>
            {blocks.length === 0 && (
              <Button onClick={onCreateNew} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Exam Schedule
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredBlocks.map((block) => {
            const examType = getExamType(block.examTypeId);
            const ScopeIcon = getScopeIcon(block.scopeType);
            
            return (
              <Card 
                key={block.id} 
                className={cn(
                  "transition-all",
                  !block.isActive && "opacity-60"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        getTypeColor(examType?.color)
                      )}>
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold truncate">{block.name}</h3>
                          {examType && (
                            <Badge 
                              variant="outline" 
                              className={cn("text-xs shrink-0", getTypeColor(examType.color))}
                            >
                              {examType.name}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <ScopeIcon className="w-3.5 h-3.5" />
                            <span>{block.scopeName || scopeTypeConfig[block.scopeType].label}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {block.dateType === 'recurring' ? (
                              <Repeat className="w-3.5 h-3.5" />
                            ) : (
                              <Calendar className="w-3.5 h-3.5" />
                            )}
                            <span>{formatBlockDates(block)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{formatBlockTime(block)}</span>
                          </div>
                        </div>

                        {block.description && (
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                            {block.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Switch
                              checked={block.isActive}
                              onCheckedChange={() => onToggleActive(block.id)}
                              className="data-[state=checked]:bg-green-500"
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">
                            {block.isActive 
                              ? "Active: This exam will block timetable slots" 
                              : "Inactive: Timetable won't be affected"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(block)} className="gap-1.5">
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-1.5 text-destructive hover:text-destructive">
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Exam</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{block.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(block.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Stats */}
      {blocks.length > 0 && (
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <span>{blocks.filter(b => b.isActive).length} active exams</span>
          <span>•</span>
          <span>{blocks.filter(b => !b.isActive).length} inactive exams</span>
        </div>
      )}
    </div>
  );
};

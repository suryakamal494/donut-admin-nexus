import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ExamBlock, BlockType, blockTypeConfig, scopeTypeConfig } from "@/types/examBlock";
import { cn } from "@/lib/utils";
import { format, parseISO, isAfter, isBefore, startOfDay } from "date-fns";
import { 
  Search, Plus, Edit2, Trash2, Calendar, Clock, Users, Building2, BookOpen, GraduationCap,
  FileText, ClipboardCheck, FileEdit, Trophy, Wrench, Repeat, Lock, AlertTriangle
} from "lucide-react";

interface ExamBlockListProps {
  blocks: ExamBlock[];
  onEdit: (block: ExamBlock) => void;
  onDelete: (blockId: string) => void;
  onToggleActive: (blockId: string) => void;
  onCreateNew: () => void;
}

const blockTypeIcons: Record<BlockType, React.ElementType> = {
  exam: FileText,
  assessment: ClipboardCheck,
  internal_test: FileEdit,
  competition: Trophy,
  workshop: Wrench,
  other: Calendar,
};

export const ExamBlockList = ({ blocks, onEdit, onDelete, onToggleActive, onCreateNew }: ExamBlockListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredBlocks = useMemo(() => {
    const today = startOfDay(new Date());
    
    return blocks.filter(block => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = block.name.toLowerCase().includes(query);
        const matchesScope = block.scopeName?.toLowerCase().includes(query);
        if (!matchesName && !matchesScope) return false;
      }

      // Type filter
      if (filterType !== "all" && block.blockType !== filterType) return false;

      // Status filter
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

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search blocks..."
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
                  {(Object.keys(blockTypeConfig) as BlockType[]).map(type => (
                    <SelectItem key={type} value={type}>{blockTypeConfig[type].label}</SelectItem>
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
                <span className="hidden sm:inline">Create Block</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Block List */}
      {filteredBlocks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No blocks found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {blocks.length === 0 
                ? "Create your first exam block to reserve time slots"
                : "Try adjusting your filters"}
            </p>
            {blocks.length === 0 && (
              <Button onClick={onCreateNew} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Block
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredBlocks.map((block) => {
            const TypeIcon = blockTypeIcons[block.blockType];
            const ScopeIcon = getScopeIcon(block.scopeType);
            const typeConfig = blockTypeConfig[block.blockType];
            
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
                        block.blockStrength === 'hard' ? "bg-red-100 dark:bg-red-900/30" : "bg-amber-100 dark:bg-amber-900/30"
                      )}>
                        <TypeIcon className={cn(
                          "w-5 h-5",
                          block.blockStrength === 'hard' ? "text-red-600" : "text-amber-600"
                        )} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold truncate">{block.name}</h3>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-xs shrink-0",
                              block.blockStrength === 'hard' 
                                ? "border-red-200 text-red-700 bg-red-50 dark:bg-red-950" 
                                : "border-amber-200 text-amber-700 bg-amber-50 dark:bg-amber-950"
                            )}
                          >
                            {block.blockStrength === 'hard' ? <Lock className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                            {block.blockStrength}
                          </Badge>
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
                      <Switch
                        checked={block.isActive}
                        onCheckedChange={() => onToggleActive(block.id)}
                        className="data-[state=checked]:bg-green-500"
                      />
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
                          <AlertDialogTitle>Delete Block</AlertDialogTitle>
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
          <span>{blocks.filter(b => b.isActive).length} active blocks</span>
          <span>•</span>
          <span>{blocks.filter(b => !b.isActive).length} inactive blocks</span>
        </div>
      )}
    </div>
  );
};

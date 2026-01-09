import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Check, X, Edit2, AlertTriangle, Plus } from "lucide-react";

export interface ParsedEntry {
  day: string;
  period: number;
  subject: string;
  teacher: string;
  confidence: number;
  isEditing?: boolean;
}

interface ParsedGridPreviewProps {
  entries: ParsedEntry[];
  onUpdateEntry: (index: number, field: keyof ParsedEntry, value: string) => void;
  onRemoveEntry: (index: number) => void;
  onAddEntry: (day: string, period: number) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];

export const ParsedGridPreview = ({ 
  entries, 
  onUpdateEntry, 
  onRemoveEntry,
  onAddEntry 
}: ParsedGridPreviewProps) => {
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ subject: string; teacher: string }>({ subject: '', teacher: '' });

  // Get entry for a specific cell
  const getEntry = (day: string, period: number) => {
    return entries.find(e => e.day === day && e.period === period);
  };

  // Get entry index
  const getEntryIndex = (day: string, period: number) => {
    return entries.findIndex(e => e.day === day && e.period === period);
  };

  // Start editing a cell
  const startEditing = (day: string, period: number) => {
    const entry = getEntry(day, period);
    if (entry) {
      setEditingCell(`${day}-${period}`);
      setEditValues({ subject: entry.subject, teacher: entry.teacher });
    }
  };

  // Save edit
  const saveEdit = (day: string, period: number) => {
    const index = getEntryIndex(day, period);
    if (index !== -1) {
      onUpdateEntry(index, 'subject', editValues.subject);
      onUpdateEntry(index, 'teacher', editValues.teacher);
    }
    setEditingCell(null);
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingCell(null);
    setEditValues({ subject: '', teacher: '' });
  };

  // Get confidence color
  const getConfidenceStyle = (confidence: number) => {
    if (confidence >= 0.9) return 'border-green-400 bg-green-50 dark:bg-green-950/20';
    if (confidence >= 0.8) return 'border-green-300 bg-green-50/50 dark:bg-green-950/10';
    if (confidence >= 0.7) return 'border-amber-400 bg-amber-50 dark:bg-amber-950/20 animate-pulse';
    return 'border-red-400 bg-red-50 dark:bg-red-950/20 animate-pulse';
  };

  const lowConfidenceCount = entries.filter(e => e.confidence < 0.8).length;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Parsed Timetable Grid</CardTitle>
            <CardDescription>Click any cell to edit. Pulsing cells need review.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {lowConfidenceCount > 0 && (
              <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {lowConfidenceCount} need review
              </Badge>
            )}
            <Badge variant="secondary">{entries.length} entries</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[600px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-border/50 bg-muted/30 p-2 text-left font-semibold w-16">
                  Period
                </th>
                {DAYS.map(day => (
                  <th key={day} className="border border-border/50 bg-muted/30 p-2 text-center font-semibold min-w-[100px]">
                    {day.slice(0, 3)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERIODS.map(period => (
                <tr key={period}>
                  <td className="border border-border/50 bg-muted/20 p-2 text-center font-medium">
                    P{period}
                  </td>
                  {DAYS.map(day => {
                    const entry = getEntry(day, period);
                    const cellKey = `${day}-${period}`;
                    const isEditing = editingCell === cellKey;
                    const entryIndex = getEntryIndex(day, period);

                    if (!entry) {
                      // Empty cell - show add button on hover
                      return (
                        <td 
                          key={day} 
                          className="border border-border/50 p-1 bg-muted/5 group hover:bg-muted/20 transition-colors cursor-pointer"
                          onClick={() => onAddEntry(day, period)}
                        >
                          <div className="h-12 flex items-center justify-center">
                            <Plus className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                          </div>
                        </td>
                      );
                    }

                    if (isEditing) {
                      // Editing mode
                      return (
                        <td key={day} className="border border-border/50 p-1 bg-primary/5">
                          <div className="space-y-1">
                            <Input
                              value={editValues.subject}
                              onChange={(e) => setEditValues(prev => ({ ...prev, subject: e.target.value }))}
                              placeholder="Subject"
                              className="h-6 text-xs"
                            />
                            <Input
                              value={editValues.teacher}
                              onChange={(e) => setEditValues(prev => ({ ...prev, teacher: e.target.value }))}
                              placeholder="Teacher"
                              className="h-6 text-xs"
                            />
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-5 px-1 flex-1"
                                onClick={() => saveEdit(day, period)}
                              >
                                <Check className="w-3 h-3 text-green-600" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-5 px-1 flex-1"
                                onClick={cancelEdit}
                              >
                                <X className="w-3 h-3 text-red-600" />
                              </Button>
                            </div>
                          </div>
                        </td>
                      );
                    }

                    // Display mode
                    return (
                      <td 
                        key={day} 
                        className={cn(
                          "border-2 p-1 cursor-pointer transition-all hover:shadow-md group relative",
                          getConfidenceStyle(entry.confidence)
                        )}
                        onClick={() => startEditing(day, period)}
                      >
                        <div className="min-h-[48px] flex flex-col justify-center">
                          <div className="font-medium text-xs truncate">{entry.subject}</div>
                          <div className="text-[10px] text-muted-foreground truncate">{entry.teacher}</div>
                          
                          {/* Confidence indicator */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="absolute top-0.5 right-0.5">
                                <div className={cn(
                                  "w-2 h-2 rounded-full",
                                  entry.confidence >= 0.8 ? "bg-green-500" : "bg-amber-500"
                                )} />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              {Math.round(entry.confidence * 100)}% confidence
                            </TooltipContent>
                          </Tooltip>
                          
                          {/* Action buttons on hover */}
                          <div className="absolute top-0.5 left-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
                            <button 
                              className="p-0.5 bg-white rounded shadow-sm hover:bg-muted"
                              onClick={(e) => { e.stopPropagation(); startEditing(day, period); }}
                            >
                              <Edit2 className="w-2.5 h-2.5 text-muted-foreground" />
                            </button>
                            <button 
                              className="p-0.5 bg-white rounded shadow-sm hover:bg-red-50"
                              onClick={(e) => { e.stopPropagation(); onRemoveEntry(entryIndex); }}
                            >
                              <X className="w-2.5 h-2.5 text-red-500" />
                            </button>
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded border-2 border-green-400 bg-green-50" />
            <span>High confidence</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded border-2 border-amber-400 bg-amber-50 animate-pulse" />
            <span>Needs review</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Plus className="w-3 h-3" />
            <span>Click to add</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParsedGridPreview;
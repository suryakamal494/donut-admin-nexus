import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ArrowRight,
  UserX,
  BookX
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ParsedEntry } from "./ParsedGridPreview";
import { teacherLoads } from "@/data/timetableData";
import { batches, availableSubjects } from "@/data/instituteData";

export interface ValidationIssue {
  type: 'error' | 'warning';
  category: 'teacher_not_found' | 'teacher_not_assigned' | 'subject_not_in_batch' | 'low_confidence' | 'slot_conflict';
  message: string;
  entryIndex: number;
  suggestion?: string;
  actionLabel?: string;
  actionPath?: string;
}

interface ParsedTimetableValidatorProps {
  entries: ParsedEntry[];
  selectedBatchId: string | null;
  onFixIssue?: (issue: ValidationIssue) => void;
}

export const ParsedTimetableValidator = ({
  entries,
  selectedBatchId,
  onFixIssue,
}: ParsedTimetableValidatorProps) => {
  const batch = batches.find(b => b.id === selectedBatchId);
  
  // Validate all entries
  const validateEntries = (): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];
    
    if (!batch) return issues;

    entries.forEach((entry, index) => {
      // 1. Check if teacher exists in system
      const teacherMatch = teacherLoads.find(
        t => t.teacherName.toLowerCase().includes(entry.teacher.toLowerCase()) ||
             entry.teacher.toLowerCase().includes(t.teacherName.split(' ').pop()?.toLowerCase() || '')
      );
      
      if (!teacherMatch) {
        issues.push({
          type: 'error',
          category: 'teacher_not_found',
          message: `Teacher "${entry.teacher}" not found in your institute`,
          entryIndex: index,
          suggestion: 'Add this teacher to your institute first',
          actionLabel: 'Add Teacher',
          actionPath: '/institute/teachers/create',
        });
      } else {
        // 2. Check if teacher is assigned to this batch
        const isAssignedToBatch = teacherMatch.allowedBatches.some(
          ab => ab.batchId === selectedBatchId
        );
        
        if (!isAssignedToBatch) {
          issues.push({
            type: 'error',
            category: 'teacher_not_assigned',
            message: `"${teacherMatch.teacherName}" is not assigned to ${batch.className} - ${batch.name}`,
            entryIndex: index,
            suggestion: 'Assign this teacher to the batch',
            actionLabel: 'Manage Teachers',
            actionPath: '/institute/teachers',
          });
        }
      }

      // 3. Check if subject is in batch curriculum
      const subjectMatch = availableSubjects.find(
        s => s.name.toLowerCase() === entry.subject.toLowerCase() ||
             entry.subject.toLowerCase().includes(s.name.toLowerCase())
      );
      
      if (!subjectMatch || !batch.subjects.includes(subjectMatch.id)) {
        issues.push({
          type: 'error',
          category: 'subject_not_in_batch',
          message: `Subject "${entry.subject}" is not part of ${batch.className} - ${batch.name} curriculum`,
          entryIndex: index,
          suggestion: 'Add this subject to the batch or edit the entry',
        });
      }

      // 4. Check for low confidence OCR
      if (entry.confidence < 0.8) {
        issues.push({
          type: 'warning',
          category: 'low_confidence',
          message: `Low confidence match for "${entry.subject}" / "${entry.teacher}"`,
          entryIndex: index,
          suggestion: 'Please verify this entry is correct',
        });
      }
    });

    // 5. Check for slot conflicts within parsed entries
    const slotMap = new Map<string, number[]>();
    entries.forEach((entry, index) => {
      const key = `${entry.day}-${entry.period}`;
      if (!slotMap.has(key)) {
        slotMap.set(key, []);
      }
      slotMap.get(key)!.push(index);
    });

    slotMap.forEach((indices, key) => {
      if (indices.length > 1) {
        indices.forEach(index => {
          issues.push({
            type: 'warning',
            category: 'slot_conflict',
            message: `Multiple entries for the same slot (${key})`,
            entryIndex: index,
            suggestion: 'Remove duplicate entries',
          });
        });
      }
    });

    return issues;
  };

  const issues = validateEntries();
  const errors = issues.filter(i => i.type === 'error');
  const warnings = issues.filter(i => i.type === 'warning');

  const hasErrors = errors.length > 0;
  const hasWarnings = warnings.length > 0;

  if (!selectedBatchId) {
    return (
      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-700">
          Please select a batch to validate the parsed timetable.
        </AlertDescription>
      </Alert>
    );
  }

  if (issues.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-700">All entries validated</p>
              <p className="text-sm text-green-600">
                {entries.length} entries ready to embed for {batch?.className} - {batch?.name}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "border-2",
      hasErrors ? "border-red-200" : "border-amber-200"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {hasErrors ? (
              <XCircle className="w-5 h-5 text-red-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-500" />
            )}
            <div>
              <CardTitle className="text-base">
                {hasErrors ? 'Validation Errors Found' : 'Review Warnings'}
              </CardTitle>
              <CardDescription>
                {errors.length} error{errors.length !== 1 ? 's' : ''}, {warnings.length} warning{warnings.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
          </div>
          {hasErrors && (
            <Badge variant="destructive" className="text-xs">
              Fix required
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Errors Section */}
        {errors.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-red-600 uppercase tracking-wide">Errors (Must Fix)</p>
            {errors.map((issue, idx) => (
              <div 
                key={`error-${idx}`}
                className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-100"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {issue.category === 'teacher_not_found' || issue.category === 'teacher_not_assigned' ? (
                    <UserX className="w-4 h-4 text-red-500" />
                  ) : (
                    <BookX className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-red-700">{issue.message}</p>
                  {issue.suggestion && (
                    <p className="text-xs text-red-500 mt-1">{issue.suggestion}</p>
                  )}
                </div>
                {issue.actionPath && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-shrink-0 text-xs h-7 border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => onFixIssue?.(issue)}
                  >
                    {issue.actionLabel}
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Warnings Section */}
        {warnings.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-amber-600 uppercase tracking-wide">Warnings (Review)</p>
            {warnings.slice(0, 3).map((issue, idx) => (
              <div 
                key={`warning-${idx}`}
                className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100"
              >
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-amber-700">{issue.message}</p>
                  {issue.suggestion && (
                    <p className="text-xs text-amber-500 mt-1">{issue.suggestion}</p>
                  )}
                </div>
              </div>
            ))}
            {warnings.length > 3 && (
              <p className="text-xs text-muted-foreground text-center">
                +{warnings.length - 3} more warnings
              </p>
            )}
          </div>
        )}

        {/* Summary */}
        <div className="pt-2 border-t">
          {hasErrors ? (
            <p className="text-xs text-red-600">
              ⚠️ Cannot embed until all errors are resolved
            </p>
          ) : (
            <p className="text-xs text-amber-600">
              ✓ You can proceed with warnings, but review recommended
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

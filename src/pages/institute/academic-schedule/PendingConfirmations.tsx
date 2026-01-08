import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Clock,
  AlertCircle,
  CheckCircle,
  User,
  BookOpen,
  Calendar,
} from "lucide-react";
import { pendingConfirmations, academicScheduleSetups } from "@/data/academicScheduleData";
import { PendingConfirmation, NoTeachReason, NO_TEACH_REASON_LABELS } from "@/types/academicSchedule";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function PendingConfirmationsPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmingItem, setConfirmingItem] = useState<PendingConfirmation | null>(null);
  const [didTeach, setDidTeach] = useState<boolean | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [noTeachReason, setNoTeachReason] = useState<NoTeachReason | "">("");
  const [noTeachNote, setNoTeachNote] = useState("");

  const toggleSelect = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === pendingConfirmations.length) {
      setSelected([]);
    } else {
      setSelected(pendingConfirmations.map(p => p.id));
    }
  };

  const handleConfirm = (item: PendingConfirmation) => {
    setConfirmingItem(item);
    setDidTeach(null);
    setSelectedChapter("");
    setNoTeachReason("");
    setNoTeachNote("");
    setConfirmDialogOpen(true);
  };

  const handleSubmitConfirmation = () => {
    if (didTeach === null) {
      toast.error("Please select whether teaching happened");
      return;
    }
    if (didTeach && !selectedChapter) {
      toast.error("Please select a chapter");
      return;
    }
    if (!didTeach && !noTeachReason) {
      toast.error("Please select a reason");
      return;
    }

    toast.success(`Confirmed on behalf of ${confirmingItem?.teacherName}`);
    setConfirmDialogOpen(false);
    setConfirmingItem(null);
  };

  const handleBulkConfirm = () => {
    if (selected.length === 0) {
      toast.error("Please select at least one item");
      return;
    }
    toast.success(`${selected.length} confirmations marked as "No Teaching"`);
    setSelected([]);
  };

  const getChaptersForSubject = (subjectId: string) => {
    const setup = academicScheduleSetups.find(s => s.subjectId === subjectId);
    return setup?.chapters || [];
  };

  const getSeverityColor = (daysOverdue: number) => {
    if (daysOverdue >= 3) return "bg-red-100 text-red-700 border-red-200";
    if (daysOverdue >= 2) return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pending Confirmations"
        description="Confirm teaching status on behalf of teachers"
        breadcrumbs={[
          { label: "Syllabus Tracker", href: "/institute/academic-schedule/progress" },
          { label: "Pending" },
        ]}
      />

      {/* Summary */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1.5 py-1.5">
            <Clock className="w-3.5 h-3.5" />
            {pendingConfirmations.length} Pending
          </Badge>
          {pendingConfirmations.filter(p => p.daysOverdue >= 2).length > 0 && (
            <Badge variant="destructive" className="gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {pendingConfirmations.filter(p => p.daysOverdue >= 2).length} Overdue 2+ days
            </Badge>
          )}
        </div>

        {selected.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {selected.length} selected
            </span>
            <Button
              variant="outline"
              onClick={handleBulkConfirm}
              className="gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Mark as No Teaching
            </Button>
          </div>
        )}
      </div>

      {/* Pending List */}
      {pendingConfirmations.length > 0 ? (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Awaiting Confirmation</CardTitle>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selected.length === pendingConfirmations.length}
                  onCheckedChange={toggleSelectAll}
                />
                <span className="text-sm text-muted-foreground">Select All</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingConfirmations.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border transition-colors",
                    selected.includes(item.id) && "bg-primary/5 border-primary/30"
                  )}
                >
                  <Checkbox
                    checked={selected.includes(item.id)}
                    onCheckedChange={() => toggleSelect(item.id)}
                  />
                  
                  <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="font-medium truncate">{item.teacherName}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="truncate">
                        {item.batchName} • {item.subjectName}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span>{new Date(item.date).toLocaleDateString('en-IN', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(item.daysOverdue)}>
                        {item.daysOverdue} day{item.daysOverdue !== 1 ? 's' : ''} overdue
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {item.expectedPeriods} period{item.expectedPeriods !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleConfirm(item)}
                    className="shrink-0"
                  >
                    Confirm
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                There are no pending confirmations. All teachers have confirmed their teaching status.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirm Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Teaching Status</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Context Info */}
            <div className="p-3 rounded-lg bg-muted/50 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Teacher:</span>
                <span className="font-medium">{confirmingItem?.teacherName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Batch:</span>
                <span className="font-medium">{confirmingItem?.batchName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subject:</span>
                <span className="font-medium">{confirmingItem?.subjectName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">
                  {confirmingItem && new Date(confirmingItem.date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Did Teach Selection */}
            <div className="space-y-3">
              <Label>Did teaching happen?</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={didTeach === true ? "default" : "outline"}
                  className={cn(
                    "h-12",
                    didTeach === true && "bg-emerald-600 hover:bg-emerald-700"
                  )}
                  onClick={() => setDidTeach(true)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Yes
                </Button>
                <Button
                  type="button"
                  variant={didTeach === false ? "default" : "outline"}
                  className={cn(
                    "h-12",
                    didTeach === false && "bg-amber-600 hover:bg-amber-700"
                  )}
                  onClick={() => setDidTeach(false)}
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  No
                </Button>
              </div>
            </div>

            {/* Chapter Selection (if taught) */}
            {didTeach === true && confirmingItem && (
              <div className="space-y-2">
                <Label>Chapter Taught</Label>
                <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="max-h-[200px]">
                      {getChaptersForSubject(confirmingItem.subjectId).map((chapter) => (
                        <SelectItem key={chapter.chapterId} value={chapter.chapterId}>
                          {chapter.chapterName}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Reason Selection (if not taught) */}
            {didTeach === false && (
              <>
                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Select value={noTeachReason} onValueChange={(v) => setNoTeachReason(v as NoTeachReason)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(NO_TEACH_REASON_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Note (Optional)</Label>
                  <Textarea
                    value={noTeachNote}
                    onChange={(e) => setNoTeachNote(e.target.value)}
                    placeholder="Add any additional details..."
                    rows={2}
                  />
                </div>
              </>
            )}

            {/* Audit Notice */}
            <p className="text-xs text-muted-foreground text-center">
              This confirmation will be recorded as "Confirmed by Academic In-charge"
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitConfirmation} className="gradient-button">
              Submit Confirmation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
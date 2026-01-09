import { useState, useMemo } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertTriangle,
  Clock,
  AlertCircle,
  Search,
  CheckCircle2,
  XCircle,
  RefreshCw,
  User,
} from "lucide-react";
import { UrgencySection } from "@/components/academic-schedule";
import { pendingConfirmations, academicScheduleSetups } from "@/data/academicScheduleData";
import { PendingConfirmation, NoTeachReason, NO_TEACH_REASON_LABELS } from "@/types/academicSchedule";
import { toast } from "sonner";

export default function PendingConfirmationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [teacherFilter, setTeacherFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Dialog state
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmingItem, setConfirmingItem] = useState<PendingConfirmation | null>(null);
  const [didTeach, setDidTeach] = useState<boolean | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [noTeachReason, setNoTeachReason] = useState<NoTeachReason | "">("");
  const [noTeachNote, setNoTeachNote] = useState("");

  // Get unique teachers for filter
  const teachers = useMemo(() => {
    const teacherMap = new Map<string, string>();
    pendingConfirmations.forEach(p => {
      teacherMap.set(p.teacherId, p.teacherName);
    });
    return Array.from(teacherMap.entries()).map(([id, name]) => ({ id, name }));
  }, []);

  // Filter confirmations
  const filteredConfirmations = useMemo(() => {
    return pendingConfirmations.filter(p => {
      const matchesSearch = 
        p.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.batchName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTeacher = teacherFilter === "all" || p.teacherId === teacherFilter;
      
      return matchesSearch && matchesTeacher;
    });
  }, [searchQuery, teacherFilter]);

  // Group by urgency
  const grouped = useMemo(() => {
    const critical = filteredConfirmations.filter(p => p.daysOverdue >= 3);
    const overdue = filteredConfirmations.filter(p => p.daysOverdue >= 1 && p.daysOverdue < 3);
    const today = filteredConfirmations.filter(p => p.daysOverdue === 0);
    
    return { critical, overdue, today };
  }, [filteredConfirmations]);

  // Stats
  const stats = useMemo(() => {
    const total = pendingConfirmations.length;
    const critical = pendingConfirmations.filter(p => p.daysOverdue >= 3).length;
    const overdue = pendingConfirmations.filter(p => p.daysOverdue >= 1 && p.daysOverdue < 3).length;
    const today = pendingConfirmations.filter(p => p.daysOverdue === 0).length;
    
    return { total, critical, overdue, today };
  }, []);

  // Get chapters for confirmation dialog
  const getChaptersForSubject = (subjectId: string) => {
    const setup = academicScheduleSetups.find(s => s.subjectId === subjectId);
    return setup?.chapters || [];
  };

  const handleSelectItem = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(i => i !== id));
    }
  };

  const handleConfirm = (id: string) => {
    const item = pendingConfirmations.find(p => p.id === id);
    if (item) {
      setConfirmingItem(item);
      setDidTeach(null);
      setSelectedChapter("");
      setNoTeachReason("");
      setNoTeachNote("");
      setConfirmDialogOpen(true);
    }
  };

  const handleSubmitConfirmation = () => {
    if (didTeach === null) {
      toast.error("Please select whether teaching happened");
      return;
    }
    if (didTeach && !selectedChapter) {
      toast.error("Please select the chapter taught");
      return;
    }
    if (!didTeach && !noTeachReason) {
      toast.error("Please select a reason");
      return;
    }
    
    toast.success("Teaching confirmation submitted");
    setConfirmDialogOpen(false);
    setConfirmingItem(null);
  };

  const handleBulkMarkNoTeach = () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one item");
      return;
    }
    toast.success(`Marked ${selectedIds.length} items as "No Teaching"`);
    setSelectedIds([]);
  };

  const handleBulkConfirmTaught = () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one item");
      return;
    }
    toast.success(`Confirmed ${selectedIds.length} items as "Taught"`);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pending Confirmations"
        description="Review and confirm teaching status for overdue periods"
        breadcrumbs={[
          { label: "Syllabus Tracker", href: "/institute/academic-schedule/progress" },
          { label: "Pending Confirmations" },
        ]}
        actions={
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        }
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.critical}</p>
              <p className="text-xs text-muted-foreground">Critical (3+ days)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.overdue}</p>
              <p className="text-xs text-muted-foreground">Overdue (1-2 days)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.today}</p>
              <p className="text-xs text-muted-foreground">Due Today</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{teachers.length}</p>
              <p className="text-xs text-muted-foreground">Teachers Pending</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Bulk Actions */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search teacher, subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={teacherFilter} onValueChange={setTeacherFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Teachers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teachers</SelectItem>
                {teachers.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {selectedIds.length > 0 && (
              <Badge variant="secondary" className="mr-2">
                {selectedIds.length} selected
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={handleBulkConfirmTaught}
              disabled={selectedIds.length === 0}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Mark Taught
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={handleBulkMarkNoTeach}
              disabled={selectedIds.length === 0}
            >
              <XCircle className="w-4 h-4 text-red-600" />
              Mark No-Teach
            </Button>
          </div>
        </div>
      </Card>

      {/* Urgency Sections */}
      {filteredConfirmations.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 mb-3" />
            <p className="font-medium text-lg">All caught up!</p>
            <p className="text-sm text-muted-foreground mt-1">
              No pending confirmations found
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <UrgencySection
            level="critical"
            items={grouped.critical}
            selectedIds={selectedIds}
            onSelectItem={handleSelectItem}
            onConfirm={handleConfirm}
          />

          <UrgencySection
            level="overdue"
            items={grouped.overdue}
            selectedIds={selectedIds}
            onSelectItem={handleSelectItem}
            onConfirm={handleConfirm}
          />

          <UrgencySection
            level="today"
            items={grouped.today}
            selectedIds={selectedIds}
            onSelectItem={handleSelectItem}
            onConfirm={handleConfirm}
          />
        </div>
      )}

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground text-center">
        Showing {filteredConfirmations.length} of {pendingConfirmations.length} pending confirmations
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Teaching</DialogTitle>
          </DialogHeader>

          {confirmingItem && (
            <div className="space-y-4 py-2">
              {/* Context Info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Teacher:</span>
                  <p className="font-medium">{confirmingItem.teacherName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Subject:</span>
                  <p className="font-medium">{confirmingItem.subjectName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Batch:</span>
                  <p className="font-medium">{confirmingItem.batchName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Date:</span>
                  <p className="font-medium">{confirmingItem.date}</p>
                </div>
              </div>

              {/* Did Teach? */}
              <div className="border-t pt-4">
                <Label className="text-sm font-medium">Did teaching happen?</Label>
                <RadioGroup
                  value={didTeach === null ? "" : didTeach ? "yes" : "no"}
                  onValueChange={(v) => setDidTeach(v === "yes")}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="yes" id="yes" />
                    <Label htmlFor="yes" className="font-normal cursor-pointer">Yes, class happened</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no" className="font-normal cursor-pointer">No, class missed</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* If Taught - Select Chapter */}
              {didTeach === true && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Chapter taught</Label>
                  <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select chapter" />
                    </SelectTrigger>
                    <SelectContent>
                      {getChaptersForSubject(confirmingItem.subjectId).map(ch => (
                        <SelectItem key={ch.chapterId} value={ch.chapterId}>
                          {ch.chapterName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* If Not Taught - Reason */}
              {didTeach === false && (
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Reason</Label>
                    <Select value={noTeachReason} onValueChange={(v) => setNoTeachReason(v as NoTeachReason)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(NO_TEACH_REASON_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Notes (optional)</Label>
                    <Textarea
                      value={noTeachNote}
                      onChange={(e) => setNoTeachNote(e.target.value)}
                      placeholder="Additional details..."
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitConfirmation}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

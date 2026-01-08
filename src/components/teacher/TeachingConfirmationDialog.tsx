import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle,
  AlertCircle,
  BookOpen,
  Clock,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { NoTeachReason, NO_TEACH_REASON_LABELS, ChapterHourAllocation } from "@/types/academicSchedule";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TeachingConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batchName: string;
  subjectName: string;
  date: string;
  periodsCount: number;
  chapters: ChapterHourAllocation[];
  suggestedChapter?: string;
  onConfirm: (data: {
    didTeach: boolean;
    chapterId?: string;
    noTeachReason?: NoTeachReason;
    noTeachNote?: string;
  }) => void;
}

export function TeachingConfirmationDialog({
  open,
  onOpenChange,
  batchName,
  subjectName,
  date,
  periodsCount,
  chapters,
  suggestedChapter,
  onConfirm,
}: TeachingConfirmationDialogProps) {
  const isMobile = useIsMobile();
  const [didTeach, setDidTeach] = useState<boolean | null>(null);
  const [selectedChapter, setSelectedChapter] = useState(suggestedChapter || "");
  const [noTeachReason, setNoTeachReason] = useState<NoTeachReason | "">("");
  const [noTeachNote, setNoTeachNote] = useState("");

  const handleSubmit = () => {
    if (didTeach === null) {
      toast.error("Please select whether you taught today");
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

    onConfirm({
      didTeach,
      chapterId: didTeach ? selectedChapter : undefined,
      noTeachReason: !didTeach ? (noTeachReason as NoTeachReason) : undefined,
      noTeachNote: !didTeach ? noTeachNote : undefined,
    });

    // Reset state
    setDidTeach(null);
    setSelectedChapter(suggestedChapter || "");
    setNoTeachReason("");
    setNoTeachNote("");
  };

  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const content = (
    <div className="space-y-5">
      {/* Context Info */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl gradient-button flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold">{subjectName}</p>
            <p className="text-sm text-muted-foreground">{batchName}</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{formattedDate}</span>
          <Badge variant="secondary" className="gap-1">
            <Clock className="w-3 h-3" />
            {periodsCount} period{periodsCount !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {/* Did Teach Toggle */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Did you teach this class?</Label>
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant={didTeach === true ? "default" : "outline"}
            className={cn(
              "h-14 text-base gap-2",
              didTeach === true && "bg-emerald-600 hover:bg-emerald-700"
            )}
            onClick={() => setDidTeach(true)}
          >
            <CheckCircle className="w-5 h-5" />
            Yes, I taught
          </Button>
          <Button
            type="button"
            variant={didTeach === false ? "default" : "outline"}
            className={cn(
              "h-14 text-base gap-2",
              didTeach === false && "bg-amber-600 hover:bg-amber-700"
            )}
            onClick={() => setDidTeach(false)}
          >
            <AlertCircle className="w-5 h-5" />
            No
          </Button>
        </div>
      </div>

      {/* Chapter Selection (if taught) */}
      {didTeach === true && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <Label>Which chapter did you cover?</Label>
          <Select value={selectedChapter} onValueChange={setSelectedChapter}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select chapter" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="max-h-[200px]">
                {chapters.map((chapter) => (
                  <SelectItem key={chapter.chapterId} value={chapter.chapterId}>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">
                        Ch {chapter.order}
                      </span>
                      <span>{chapter.chapterName}</span>
                    </div>
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Reason Selection (if not taught) */}
      {didTeach === false && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-2">
            <Label>What happened?</Label>
            <Select value={noTeachReason} onValueChange={(v) => setNoTeachReason(v as NoTeachReason)}>
              <SelectTrigger className="h-12">
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
            <Label>Additional notes (optional)</Label>
            <Textarea
              value={noTeachNote}
              onChange={(e) => setNoTeachNote(e.target.value)}
              placeholder="Any details about why class was missed..."
              rows={2}
            />
          </div>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Confirm Teaching</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-2">{content}</div>
          <DrawerFooter className="pt-2">
            <Button onClick={handleSubmit} className="gradient-button h-12">
              Submit Confirmation
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Teaching</DialogTitle>
        </DialogHeader>
        {content}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="gradient-button">
            Submit Confirmation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
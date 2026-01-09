import { Check, Edit2, Trash2, RefreshCw, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SubjectBadge, getSubjectColor } from "@/components/subject/SubjectBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useExamReview, difficultyColors } from "@/hooks/useExamReview";

const ReviewExam = () => {
  const review = useExamReview();

  const getQuickNavColor = (question: typeof review.mockQuestions[0]) => {
    const state = review.questionStates[question.id];
    if (state?.status === "deleted") return "bg-destructive/10 text-destructive border border-destructive/30 line-through";
    if (state?.status === "reviewed") return "bg-success/10 text-success border border-success/30";
    if (state?.status === "regenerating") return "bg-blue-100 text-blue-700 border border-blue-300 animate-pulse";
    const color = getSubjectColor(question.subject);
    return `${color.bg}/20 text-foreground border border-border/50`;
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <PageHeader
        title="Review Exam Questions"
        description="Review and approve questions before publishing"
        breadcrumbs={[
          { label: "Dashboard", href: "/institute/dashboard" },
          { label: "Exams", href: "/institute/exams" },
          { label: "Review" },
        ]}
        actions={
          <Button className="gradient-button gap-2 w-full sm:w-auto" onClick={review.handlePublish}>
            <Check className="w-4 h-4" />
            <span className="hidden xs:inline">Publish Exam</span>
            <span className="xs:hidden">Publish</span>
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card><CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1"><span className="text-xs sm:text-sm text-muted-foreground">Total</span><span className="text-lg sm:text-xl font-bold">{review.stats.total}</span></CardContent></Card>
        <Card className="bg-success/5"><CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1"><span className="text-xs sm:text-sm text-muted-foreground">Reviewed</span><span className="text-lg sm:text-xl font-bold text-success">{review.stats.reviewed}</span></CardContent></Card>
        <Card className="bg-amber-50 dark:bg-amber-950/20"><CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1"><span className="text-xs sm:text-sm text-muted-foreground">Pending</span><span className="text-lg sm:text-xl font-bold text-amber-600">{review.stats.pending}</span></CardContent></Card>
        <Card className="bg-destructive/5"><CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1"><span className="text-xs sm:text-sm text-muted-foreground">Deleted</span><span className="text-lg sm:text-xl font-bold text-destructive">{review.stats.deleted}</span></CardContent></Card>
      </div>

      {/* Subject Tabs */}
      <Tabs value={review.activeSubject} onValueChange={review.changeSubject}>
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="h-auto flex-nowrap min-w-max">
            <TabsTrigger value="all" className="px-3 sm:px-4 shrink-0">All ({review.mockQuestions.length})</TabsTrigger>
            {review.subjects.map(sub => (
              <TabsTrigger key={sub} value={sub} className="px-2 sm:px-3 shrink-0">
                <SubjectBadge subject={sub} size="xs" showIcon={false} className="mr-1 sm:mr-1.5" />
                ({review.mockQuestions.filter(q => q.subject === sub).length})
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      {/* Quick Jump Grid */}
      <div className="bg-card rounded-xl p-3 sm:p-4 border border-border/50">
        <p className="text-sm text-muted-foreground mb-2 sm:mb-3">Quick Jump</p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 max-h-[100px] sm:max-h-[120px] overflow-y-auto">
          {review.filteredQuestions.map((q, idx) => (
            <button key={q.id} onClick={() => review.goToPage(Math.floor(idx / review.questionsPerPage) + 1)} className={cn("w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs sm:text-sm font-medium transition-all", getQuickNavColor(q))}>{idx + 1}</button>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {review.paginatedQuestions.map((question, idx) => {
          const globalIdx = (review.currentPage - 1) * review.questionsPerPage + idx + 1;
          const state = review.questionStates[question.id];
          const isDeleted = state?.status === "deleted";
          const isRegenerating = state?.status === "regenerating";
          const displayText = state?.editedText || question.text;
          const displayOptions = state?.editedOptions || question.options;

          return (
            <Card key={question.id} className={cn("overflow-hidden transition-all", isDeleted && "opacity-60 border-destructive/30", isRegenerating && "border-blue-300")}>
              <CardContent className="p-0">
                <div className={cn("flex items-center justify-between p-4 border-b border-border/50", isDeleted ? "bg-destructive/5" : "bg-muted/30")}>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">{globalIdx}</span>
                    <SubjectBadge subject={question.subject} size="sm" />
                    <Badge className={difficultyColors[question.difficulty]}>{question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}</Badge>
                    {isDeleted && <Badge variant="destructive">Deleted</Badge>}
                    {isRegenerating && <Badge className="bg-blue-100 text-blue-700"><RefreshCw className="w-3 h-3 mr-1 animate-spin" />Regenerating...</Badge>}
                    {state?.status === "reviewed" && !isDeleted && <Badge className="bg-success/10 text-success">Reviewed</Badge>}
                  </div>
                  <div className="flex items-center gap-2">
                    {isDeleted ? (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => review.handleRestoreQuestion(question.id)}><RotateCcw className="w-4 h-4 mr-1" />Restore</Button>
                        {question.isAIGenerated && <Button variant="ghost" size="sm" onClick={() => review.handleRegenerateQuestion(question.id)}><RefreshCw className="w-4 h-4 mr-1" />Regenerate</Button>}
                      </>
                    ) : isRegenerating ? null : (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => review.handleOpenEditDialog(question)}><Edit2 className="w-4 h-4" /></Button>
                        {state?.status !== "reviewed" && <Button variant="ghost" size="sm" onClick={() => review.handleMarkReviewed(question.id)}><Check className="w-4 h-4" /></Button>}
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => review.handleDeleteQuestion(question.id)}><Trash2 className="w-4 h-4" /></Button>
                      </>
                    )}
                  </div>
                </div>
                <div className={cn("p-3 sm:p-4", isDeleted && "line-through opacity-70")}>
                  <p className="text-sm sm:text-base text-foreground mb-3 sm:mb-4">{displayText}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {displayOptions.map((option, optIdx) => (
                      <div key={optIdx} className={cn("p-2.5 sm:p-3 rounded-lg border text-sm", optIdx === question.correct ? "border-success bg-success/5 text-success" : "border-border")}>
                        <span className="font-medium mr-2">{String.fromCharCode(65 + optIdx)}.</span>{option}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {review.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={review.previousPage} disabled={review.currentPage === 1}><ChevronLeft className="w-4 h-4" /></Button>
          <span className="text-sm text-muted-foreground">Page {review.currentPage} of {review.totalPages}</span>
          <Button variant="outline" size="sm" onClick={review.nextPage} disabled={review.currentPage === review.totalPages}><ChevronRight className="w-4 h-4" /></Button>
        </div>
      )}

      {/* Edit Question Dialog */}
      <Dialog open={review.editDialogOpen} onOpenChange={review.setEditDialogOpen}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Question</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Question Text</Label>
              <Textarea value={review.editText} onChange={(e) => review.setEditText(e.target.value)} rows={4} />
            </div>
            <div className="space-y-3">
              <Label>Options</Label>
              {review.editOptions.map((option, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className={cn("w-8 h-8 rounded-lg flex items-center justify-center font-medium text-sm", review.editingQuestion?.correct === idx ? "bg-success/20 text-success" : "bg-muted")}>{String.fromCharCode(65 + idx)}</span>
                  <Input value={option} onChange={(e) => { const newOptions = [...review.editOptions]; newOptions[idx] = e.target.value; review.setEditOptions(newOptions); }} className="flex-1" />
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => review.setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={review.handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewExam;

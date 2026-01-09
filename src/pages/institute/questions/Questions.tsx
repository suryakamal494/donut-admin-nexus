import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Sparkles, Lock, Building2, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { QuestionFilters } from "@/components/questions/QuestionFilters";
import { QuestionPagination } from "@/components/questions/QuestionPagination";
import { QuestionCard, QuestionWithSource } from "@/components/questions/QuestionCard";
import { QuestionViewDialog } from "@/components/questions/QuestionViewDialog";
import { ParagraphQuestionGroup } from "@/components/questions/ParagraphQuestionGroup";
import { mockQuestions } from "@/data/questionsData";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Add source type to mock questions
const instituteQuestions: QuestionWithSource[] = mockQuestions.map((q, index) => ({
  ...q,
  sourceType: index % 3 === 0 ? "institute" : "global", // Every 3rd is institute-created
}));

const Questions = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sourceFilter, setSourceFilter] = useState<"all" | "global" | "institute">("all");
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");

  // View dialog state
  const [viewingQuestion, setViewingQuestion] = useState<QuestionWithSource | null>(null);

  // Delete confirmation state
  const [questionToDelete, setQuestionToDelete] = useState<QuestionWithSource | null>(null);

  // Apply filters
  const filteredQuestions = useMemo(() => {
    return instituteQuestions.filter((q) => {
      if (sourceFilter !== "all" && q.sourceType !== sourceFilter) return false;
      if (searchQuery && !q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !q.questionId.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedSubject !== "all" && q.subjectId !== selectedSubject) return false;
      if (selectedType !== "all" && q.type !== selectedType) return false;
      if (selectedDifficulty !== "all" && q.difficulty !== selectedDifficulty) return false;
      if (selectedLanguage !== "all" && q.language !== selectedLanguage) return false;
      if (selectedStatus !== "all" && q.status !== selectedStatus) return false;
      if (selectedClass !== "all" && q.classId !== selectedClass) return false;
      return true;
    });
  }, [searchQuery, selectedSubject, selectedType, selectedDifficulty, selectedLanguage, selectedStatus, selectedClass, sourceFilter]);

  // Group paragraph questions
  const { standaloneQuestions, paragraphGroups, displayItems } = useMemo(() => {
    const paragraphs = new Map<string, QuestionWithSource[]>();
    const standalone: QuestionWithSource[] = [];

    filteredQuestions.forEach((q) => {
      if (q.paragraphId && q.paragraphText) {
        const existing = paragraphs.get(q.paragraphId) || [];
        existing.push(q);
        paragraphs.set(q.paragraphId, existing);
      } else {
        standalone.push(q);
      }
    });

    // Sort questions within paragraph groups by paragraphOrder
    paragraphs.forEach((questions) => {
      questions.sort((a, b) => (a.paragraphOrder || 0) - (b.paragraphOrder || 0));
    });

    // Create display items for pagination
    const items: Array<{ type: "standalone"; question: QuestionWithSource } | { type: "paragraph"; paragraphId: string; questions: QuestionWithSource[] }> = [];
    
    standalone.forEach((q) => items.push({ type: "standalone", question: q }));
    paragraphs.forEach((questions, paragraphId) => items.push({ type: "paragraph", paragraphId, questions }));

    return { standaloneQuestions: standalone, paragraphGroups: paragraphs, displayItems: items };
  }, [filteredQuestions]);

  const totalItems = displayItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedItems = displayItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const globalCount = instituteQuestions.filter(q => q.sourceType === "global").length;
  const instituteCount = instituteQuestions.filter(q => q.sourceType === "institute").length;

  const activeFilterCount = [
    selectedSubject !== "all",
    selectedType !== "all",
    selectedDifficulty !== "all",
    selectedLanguage !== "all",
    selectedStatus !== "all",
    selectedClass !== "all",
  ].filter(Boolean).length;

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedSubject("all");
    setSelectedType("all");
    setSelectedDifficulty("all");
    setSelectedLanguage("all");
    setSelectedStatus("all");
    setSelectedClass("all");
  };

  const handleView = (question: QuestionWithSource) => {
    setViewingQuestion(question);
  };

  const handleEdit = (question: QuestionWithSource) => {
    if (question.sourceType === "global") {
      toast.error("Global questions cannot be edited. You can only view them.");
      return;
    }
    navigate(`/institute/questions/edit/${question.id}`);
  };

  const handleDelete = (question: QuestionWithSource) => {
    if (question.sourceType === "global") {
      toast.error("Global questions cannot be deleted.");
      return;
    }
    setQuestionToDelete(question);
  };

  const confirmDelete = () => {
    if (questionToDelete) {
      toast.success(`Question ${questionToDelete.questionId} deleted successfully`);
      setQuestionToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Question Bank"
        description="Access global questions shared by the platform and create your own institute-level questions for tests and practice."
        actions={
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => navigate("/institute/questions/upload-pdf")}
              className="w-full sm:w-auto"
            >
              <Upload className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Upload PDF</span>
              <span className="sm:hidden">PDF</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/institute/questions/ai")}
              className="w-full sm:w-auto"
            >
              <Sparkles className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">AI Generate</span>
              <span className="sm:hidden">AI</span>
            </Button>
            <Button
              onClick={() => navigate("/institute/questions/create")}
              className="bg-gradient-to-r from-primary to-primary/80 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Create Question</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </div>
        }
      />

      {/* Source Type Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <Tabs value={sourceFilter} onValueChange={(v) => setSourceFilter(v as any)}>
            <TabsList className="w-max">
              <TabsTrigger value="all" className="gap-1.5 sm:gap-2 text-xs sm:text-sm">
                <span className="hidden xs:inline">All</span> Questions
                <Badge variant="secondary" className="ml-1 text-xs">{instituteQuestions.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="global" className="gap-1.5 sm:gap-2 text-xs sm:text-sm">
                <Lock className="h-3.5 w-3.5" />
                Global
                <Badge variant="secondary" className="ml-1 text-xs">{globalCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="institute" className="gap-1.5 sm:gap-2 text-xs sm:text-sm">
                <Building2 className="h-3.5 w-3.5" />
                Institute
                <Badge variant="secondary" className="ml-1 text-xs">{instituteCount}</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <Lock className="h-4 w-4" />
            <span>Global = View only</span>
          </div>
          <span className="text-border">|</span>
          <div className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4" />
            <span>Institute = Editable</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <QuestionFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={setSelectedDifficulty}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedClass={selectedClass}
        onClassChange={setSelectedClass}
        onClearFilters={handleClearFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Results Count */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
        <span>
          Showing {paginatedItems.length} of {totalItems} items
        </span>
        {paragraphGroups.size > 0 && (
          <span className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            ({paragraphGroups.size} paragraph {paragraphGroups.size === 1 ? "group" : "groups"})
          </span>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {paginatedItems.map((item, index) => {
          if (item.type === "standalone") {
            return (
              <QuestionCard
                key={item.question.id}
                question={item.question}
                mode="institute"
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            );
          } else {
            const firstQuestion = item.questions[0];
            return (
              <ParagraphQuestionGroup
                key={item.paragraphId}
                paragraphId={item.paragraphId}
                paragraphText={firstQuestion.paragraphText || ""}
                questions={item.questions}
                mode="institute"
                onViewQuestion={handleView}
                onEditQuestion={handleEdit}
                onDeleteQuestion={handleDelete}
              />
            );
          }
        })}

        {paginatedItems.length === 0 && (
          <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
            <p className="text-muted-foreground mb-4">No questions found matching your filters.</p>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <QuestionPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      )}

      {/* View Dialog */}
      <QuestionViewDialog
        question={viewingQuestion}
        open={!!viewingQuestion}
        onOpenChange={(open) => !open && setViewingQuestion(null)}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!questionToDelete} onOpenChange={(open) => !open && setQuestionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Question</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete question <span className="font-medium">{questionToDelete?.questionId}</span>? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Questions;

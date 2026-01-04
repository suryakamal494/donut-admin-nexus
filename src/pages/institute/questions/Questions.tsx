import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Sparkles, Lock, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { QuestionFilters } from "@/components/questions/QuestionFilters";
import { QuestionPagination } from "@/components/questions/QuestionPagination";
import { QuestionCard, QuestionWithSource } from "@/components/questions/QuestionCard";
import { mockQuestions } from "@/data/questionsData";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

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

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const paginatedQuestions = filteredQuestions.slice(
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
    toast.info(`Viewing: ${question.questionId}`);
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
    toast.success(`Question ${question.questionId} deleted`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Question Bank"
        description="Access global questions shared by the platform and create your own institute-level questions for tests and practice."
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/institute/questions/ai")}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI Generate
            </Button>
            <Button
              onClick={() => navigate("/institute/questions/create")}
              className="bg-gradient-to-r from-primary to-primary/80"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Question
            </Button>
          </div>
        }
      />

      {/* Source Type Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Tabs value={sourceFilter} onValueChange={(v) => setSourceFilter(v as any)}>
          <TabsList>
            <TabsTrigger value="all" className="gap-2">
              All Questions
              <Badge variant="secondary" className="ml-1">{instituteQuestions.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="global" className="gap-2">
              <Lock className="h-3.5 w-3.5" />
              Global
              <Badge variant="secondary" className="ml-1">{globalCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="institute" className="gap-2">
              <Building2 className="h-3.5 w-3.5" />
              Institute
              <Badge variant="secondary" className="ml-1">{instituteCount}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
      <div className="text-sm text-muted-foreground">
        Showing {paginatedQuestions.length} of {filteredQuestions.length} questions
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {paginatedQuestions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            mode="institute"
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}

        {paginatedQuestions.length === 0 && (
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
          totalItems={filteredQuestions.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      )}
    </div>
  );
};

export default Questions;

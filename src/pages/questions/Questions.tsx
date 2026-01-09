import { useState, useMemo } from "react";
import { Plus, Sparkles, Upload, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { 
  QuestionCard, 
  QuestionFilters, 
  QuestionPagination,
  ParagraphQuestionGroup 
} from "@/components/questions";
import { 
  mockQuestions, 
  Question,
  QuestionType,
  QuestionDifficulty,
  QuestionLanguage,
  QuestionStatus 
} from "@/data/questionsData";

const Questions = () => {
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedSubject !== "all") count++;
    if (selectedType !== "all") count++;
    if (selectedDifficulty !== "all") count++;
    if (selectedLanguage !== "all") count++;
    if (selectedStatus !== "all") count++;
    if (selectedClass !== "all") count++;
    if (searchQuery) count++;
    return count;
  }, [selectedSubject, selectedType, selectedDifficulty, selectedLanguage, selectedStatus, selectedClass, searchQuery]);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return mockQuestions.filter((q) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          q.questionText.toLowerCase().includes(query) ||
          q.questionId.toLowerCase().includes(query) ||
          q.topic.toLowerCase().includes(query) ||
          q.chapter.toLowerCase().includes(query) ||
          q.subject.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Subject filter
      if (selectedSubject !== "all" && q.subjectId !== selectedSubject) return false;
      
      // Type filter
      if (selectedType !== "all" && q.type !== selectedType) return false;
      
      // Difficulty filter
      if (selectedDifficulty !== "all" && q.difficulty !== selectedDifficulty) return false;
      
      // Language filter
      if (selectedLanguage !== "all" && q.language !== selectedLanguage) return false;
      
      // Status filter
      if (selectedStatus !== "all" && q.status !== selectedStatus) return false;
      
      // Class filter
      if (selectedClass !== "all" && q.classId !== selectedClass) return false;
      
      return true;
    });
  }, [searchQuery, selectedSubject, selectedType, selectedDifficulty, selectedLanguage, selectedStatus, selectedClass]);

  // Group paragraph questions
  const { standaloneQuestions, paragraphGroups } = useMemo(() => {
    const paragraphs = new Map<string, Question[]>();
    const standalone: Question[] = [];

    filteredQuestions.forEach((q) => {
      if (q.paragraphId && q.paragraphText) {
        const existing = paragraphs.get(q.paragraphId) || [];
        existing.push(q);
        paragraphs.set(q.paragraphId, existing);
      } else {
        standalone.push(q);
      }
    });

    // Sort paragraph questions by order
    paragraphs.forEach((questions) => {
      questions.sort((a, b) => (a.paragraphOrder || 0) - (b.paragraphOrder || 0));
    });

    return { standaloneQuestions: standalone, paragraphGroups: paragraphs };
  }, [filteredQuestions]);

  // Create combined list for pagination
  const allDisplayItems = useMemo(() => {
    const items: Array<{ type: "question" | "paragraph"; data: Question | { id: string; text: string; questions: Question[] } }> = [];
    
    // Add paragraph groups
    paragraphGroups.forEach((questions, paragraphId) => {
      items.push({
        type: "paragraph",
        data: {
          id: paragraphId,
          text: questions[0]?.paragraphText || "",
          questions,
        },
      });
    });

    // Add standalone questions
    standaloneQuestions.forEach((q) => {
      items.push({ type: "question", data: q });
    });

    return items;
  }, [standaloneQuestions, paragraphGroups]);

  // Paginate items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return allDisplayItems.slice(startIndex, startIndex + itemsPerPage);
  }, [allDisplayItems, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(allDisplayItems.length / itemsPerPage);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedSubject("all");
    setSelectedType("all");
    setSelectedDifficulty("all");
    setSelectedLanguage("all");
    setSelectedStatus("all");
    setSelectedClass("all");
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // Question actions
  const handleViewQuestion = (question: Question) => {
    console.log("View question:", question.id);
  };

  const handleEditQuestion = (question: Question) => {
    console.log("Edit question:", question.id);
  };

  const handleDeleteQuestion = (question: Question) => {
    console.log("Delete question:", question.id);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Question Bank"
        description="Review, edit, and manage questions before adding them to the master question bank."
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin/dashboard" },
          { label: "Question Bank" },
        ]}
        actions={
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Link to="/superadmin/questions/upload-pdf">
              <Button variant="outline" size="sm" className="gap-1.5 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9">
                <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Upload PDF</span>
                <span className="sm:hidden">PDF</span>
              </Button>
            </Link>
            <Link to="/superadmin/questions/ai">
              <Button variant="outline" size="sm" className="gap-1.5 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Generate with AI</span>
                <span className="sm:hidden">AI</span>
              </Button>
            </Link>
            <Link to="/superadmin/questions/create">
              <Button size="sm" className="gradient-button gap-1.5 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9">
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Add Question</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </Link>
          </div>
        }
      />

      {/* Filters */}
      <QuestionFilters
        searchQuery={searchQuery}
        onSearchChange={(value) => { setSearchQuery(value); setCurrentPage(1); }}
        selectedSubject={selectedSubject}
        onSubjectChange={(value) => { setSelectedSubject(value); setCurrentPage(1); }}
        selectedType={selectedType}
        onTypeChange={(value) => { setSelectedType(value); setCurrentPage(1); }}
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={(value) => { setSelectedDifficulty(value); setCurrentPage(1); }}
        selectedLanguage={selectedLanguage}
        onLanguageChange={(value) => { setSelectedLanguage(value); setCurrentPage(1); }}
        selectedStatus={selectedStatus}
        onStatusChange={(value) => { setSelectedStatus(value); setCurrentPage(1); }}
        selectedClass={selectedClass}
        onClassChange={(value) => { setSelectedClass(value); setCurrentPage(1); }}
        onClearFilters={handleClearFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Results Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <p className="text-xs sm:text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{allDisplayItems.length}</span> questions found
          {activeFilterCount > 0 && <span> (filtered)</span>}
        </p>
        {paragraphGroups.size > 0 && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{paragraphGroups.size} paragraph groups</span>
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {paginatedItems.length === 0 ? (
          <div className="bg-card rounded-2xl p-12 text-center shadow-soft border border-border/50">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No questions found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search query
            </p>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear all filters
            </Button>
          </div>
        ) : (
          paginatedItems.map((item, index) => {
            if (item.type === "paragraph") {
              const paragraphData = item.data as { id: string; text: string; questions: Question[] };
              return (
                <ParagraphQuestionGroup
                  key={paragraphData.id}
                  paragraphId={paragraphData.id}
                  paragraphText={paragraphData.text}
                  questions={paragraphData.questions}
                  onViewQuestion={handleViewQuestion}
                  onEditQuestion={handleEditQuestion}
                  onDeleteQuestion={handleDeleteQuestion}
                />
              );
            } else {
              const question = item.data as Question;
              return (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onView={handleViewQuestion}
                  onEdit={handleEditQuestion}
                  onDelete={handleDeleteQuestion}
                />
              );
            }
          })
        )}
      </div>

      {/* Pagination */}
      {allDisplayItems.length > 0 && (
        <QuestionPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={allDisplayItems.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </div>
  );
};

export default Questions;
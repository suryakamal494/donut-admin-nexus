import { useState, useMemo, useCallback, memo } from "react";
import { Search, Check, Filter, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { QuestionViewDialog } from "@/components/questions/QuestionViewDialog";
import { VirtualizedQuestionList } from "./VirtualizedQuestionList";
import { QUESTION_BANK_CONFIG } from "./constants";
import { 
  mockQuestions, 
  Question, 
  difficultyConfig,
  cognitiveTypeConfig,
  getCognitiveTypeForQuestion 
} from "@/data/questionsData";
import { currentTeacher } from "@/data/teacher/profile";

interface TeacherQuestionBankSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSubjects: string[];
  selectedQuestionIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useMemo(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};

// Memoized non-virtualized question card for small lists
const QuestionCard = memo(({ 
  question, 
  isSelected, 
  onToggle, 
  onPreview 
}: { 
  question: Question; 
  isSelected: boolean;
  onToggle: () => void;
  onPreview: (e: React.MouseEvent) => void;
}) => {
  const cogType = getCognitiveTypeForQuestion(question);
  
  return (
    <div
      onClick={onToggle}
      className={cn(
        "p-3 rounded-xl border-2 transition-all cursor-pointer",
        "active:scale-[0.99]",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 bg-card"
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggle}
          className="mt-0.5"
        />
        <div className="flex-1 min-w-0">
          <div className="flex gap-1.5 flex-wrap mb-2">
            <Badge variant="outline" className={cn("text-[10px] h-5", difficultyConfig[question.difficulty].className)}>
              {question.difficulty}
            </Badge>
            <Badge variant="outline" className={cn("text-[10px] h-5", cognitiveTypeConfig[cogType].className)}>
              {cognitiveTypeConfig[cogType].label}
            </Badge>
          </div>
          <p className="text-sm line-clamp-2 mb-1.5">{question.questionText}</p>
          <p className="text-xs text-muted-foreground">
            {question.chapter} • {question.topic}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onPreview}
        >
          <Eye className="w-4 h-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
});

QuestionCard.displayName = "QuestionCard";

export const TeacherQuestionBankSheet = ({
  open,
  onOpenChange,
  selectedSubjects,
  selectedQuestionIds,
  onSelectionChange,
}: TeacherQuestionBankSheetProps) => {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, QUESTION_BANK_CONFIG.SEARCH_DEBOUNCE_MS);
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Question preview state
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Filter questions to teacher's subjects only - memoized
  const teacherSubjects = useMemo(() => currentTeacher.subjects, []);
  
  const filteredQuestions = useMemo(() => {
    return mockQuestions.filter(q => {
      const subjectMatch = teacherSubjects.some(s => 
        q.subject.toLowerCase() === s.toLowerCase()
      );
      if (!subjectMatch) return false;

      if (difficultyFilter.length > 0 && !difficultyFilter.includes(q.difficulty)) {
        return false;
      }

      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase();
        return q.questionText.toLowerCase().includes(searchLower) ||
          q.chapter.toLowerCase().includes(searchLower) ||
          q.topic.toLowerCase().includes(searchLower);
      }

      return true;
    });
  }, [teacherSubjects, difficultyFilter, debouncedSearch]);

  // Determine if virtualization should be used
  const useVirtualization = filteredQuestions.length > QUESTION_BANK_CONFIG.VIRTUALIZATION_THRESHOLD;

  const toggleQuestion = useCallback((questionId: string) => {
    if (selectedQuestionIds.includes(questionId)) {
      onSelectionChange(selectedQuestionIds.filter(id => id !== questionId));
    } else {
      onSelectionChange([...selectedQuestionIds, questionId]);
    }
  }, [selectedQuestionIds, onSelectionChange]);

  const selectAllVisible = useCallback(() => {
    const visibleIds = filteredQuestions.map(q => q.id);
    const newSelection = [...new Set([...selectedQuestionIds, ...visibleIds])];
    onSelectionChange(newSelection);
  }, [filteredQuestions, selectedQuestionIds, onSelectionChange]);

  const clearSelection = useCallback(() => {
    onSelectionChange([]);
  }, [onSelectionChange]);
  
  const handlePreview = useCallback((question: Question, e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewQuestion(question);
    setShowPreview(true);
  }, []);

  const handleToggle = useCallback((questionId: string) => () => {
    toggleQuestion(questionId);
  }, [toggleQuestion]);

  const handlePreviewClick = useCallback((question: Question) => (e: React.MouseEvent) => {
    handlePreview(question, e);
  }, [handlePreview]);

  const Content = () => (
    <div className="flex flex-col h-full">
      {/* Fixed Header with Search and Filters */}
      <div className="p-4 border-b space-y-3 shrink-0">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="shrink-0 gap-1"
          >
            <Filter className="w-3 h-3" />
            Filters
            {difficultyFilter.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {difficultyFilter.length}
              </Badge>
            )}
          </Button>
          
          {/* Difficulty quick filters */}
          {(["easy", "medium", "hard"] as const).map(diff => (
            <Button
              key={diff}
              variant={difficultyFilter.includes(diff) ? "default" : "outline"}
              size="sm"
              onClick={() => setDifficultyFilter(prev => 
                prev.includes(diff) ? prev.filter(d => d !== diff) : [...prev, diff]
              )}
              className={cn(
                "shrink-0 capitalize",
                difficultyFilter.includes(diff) && difficultyConfig[diff].className
              )}
            >
              {diff}
            </Button>
          ))}
        </div>

        {/* Selection info */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {filteredQuestions.length} questions
            {useVirtualization && <span className="text-xs ml-1">(virtualized)</span>}
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={selectAllVisible}>
              Select all
            </Button>
            {selectedQuestionIds.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearSelection}>
                Clear ({selectedQuestionIds.length})
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Questions List - Virtualized for large lists, regular for small */}
      <div className="flex-1 overflow-hidden">
        {useVirtualization ? (
          <VirtualizedQuestionList
            questions={filteredQuestions}
            selectedQuestionIds={selectedQuestionIds}
            onToggleQuestion={toggleQuestion}
            onPreviewQuestion={handlePreview}
          />
        ) : (
          <div className="h-full overflow-auto p-4 space-y-2">
            {filteredQuestions.map(question => (
              <QuestionCard
                key={question.id}
                question={question}
                isSelected={selectedQuestionIds.includes(question.id)}
                onToggle={handleToggle(question.id)}
                onPreview={handlePreviewClick(question)}
              />
            ))}
            
            {filteredQuestions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No questions found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fixed Footer */}
      <div className="p-4 border-t bg-card shrink-0">
        <Button
          className="w-full h-12 gradient-button"
          onClick={() => onOpenChange(false)}
          disabled={selectedQuestionIds.length === 0}
        >
          <Check className="w-4 h-4 mr-2" />
          Done ({selectedQuestionIds.length} selected)
        </Button>
      </div>
    </div>
  );

  // Use Drawer on mobile, Sheet on desktop
  if (isMobile) {
    return (
      <>
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent className="h-[90vh]">
            <DrawerHeader className="border-b">
              <DrawerTitle>Select Questions</DrawerTitle>
            </DrawerHeader>
            <Content />
          </DrawerContent>
        </Drawer>
        <QuestionViewDialog 
          question={previewQuestion} 
          open={showPreview} 
          onOpenChange={setShowPreview} 
        />
      </>
    );
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Select Questions</SheetTitle>
          </SheetHeader>
          <Content />
        </SheetContent>
      </Sheet>
      <QuestionViewDialog 
        question={previewQuestion} 
        open={showPreview} 
        onOpenChange={setShowPreview} 
      />
    </>
  );
};

import { useState, useRef, useMemo } from "react";
import {
  Search,
  Sparkles,
  X,
  Check,
  Filter,
  ChevronDown,
  ChevronRight,
  Calculator,
  CheckSquare,
  CircleDot,
  Scale,
  FileText,
  Grid3X3,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  mockQuestions,
  type Question,
  questionTypeLabels,
  difficultyConfig,
  cognitiveTypeConfig,
} from "@/data/questionsData";
import { type LessonPlanBlock } from "./types";

interface QuestionBankSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddQuestions: (block: Omit<LessonPlanBlock, "id">) => void;
  chapter?: string;
  subject?: string;
}

// Question type icons mapping
const questionTypeIcons: Record<string, React.ReactNode> = {
  mcq_single: <CircleDot className="w-3.5 h-3.5" />,
  mcq_multiple: <CheckSquare className="w-3.5 h-3.5" />,
  numerical: <Calculator className="w-3.5 h-3.5" />,
  assertion_reasoning: <Scale className="w-3.5 h-3.5" />,
  paragraph: <FileText className="w-3.5 h-3.5" />,
  matrix_match: <Grid3X3 className="w-3.5 h-3.5" />,
  short_answer: <MessageSquare className="w-3.5 h-3.5" />,
};

// Group paragraph questions together
interface QuestionGroup {
  type: "single" | "paragraph";
  paragraphId?: string;
  paragraphText?: string;
  questions: Question[];
}

const groupQuestionsByParagraph = (questions: Question[]): QuestionGroup[] => {
  const groups: QuestionGroup[] = [];
  const paragraphMap: Record<string, Question[]> = {};
  const singleQuestions: Question[] = [];

  questions.forEach((q) => {
    if (q.paragraphId && q.paragraphText) {
      if (!paragraphMap[q.paragraphId]) {
        paragraphMap[q.paragraphId] = [];
      }
      paragraphMap[q.paragraphId].push(q);
    } else {
      singleQuestions.push(q);
    }
  });

  // Add paragraph groups
  Object.entries(paragraphMap).forEach(([paragraphId, qs]) => {
    groups.push({
      type: "paragraph",
      paragraphId,
      paragraphText: qs[0]?.paragraphText,
      questions: qs.sort((a, b) => (a.paragraphOrder || 0) - (b.paragraphOrder || 0)),
    });
  });

  // Add single questions
  singleQuestions.forEach((q) => {
    groups.push({
      type: "single",
      questions: [q],
    });
  });

  return groups;
};

export const QuestionBankSheet = ({
  open,
  onOpenChange,
  onAddQuestions,
  chapter,
  subject,
}: QuestionBankSheetProps) => {
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [chapterFilter, setChapterFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedParagraphs, setExpandedParagraphs] = useState<string[]>([]);
  
  // AI mode state
  const [mode, setMode] = useState<"select" | "ai">("select");
  const [aiPrompt, setAiPrompt] = useState("");
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState(false);

  const parentRef = useRef<HTMLDivElement>(null);

  // Get unique filter values
  const subjects = useMemo(
    () => [...new Set(mockQuestions.map((q) => q.subject))],
    []
  );
  const chapters = useMemo(
    () => [...new Set(mockQuestions.map((q) => q.chapter))],
    []
  );
  const types = useMemo(
    () => [...new Set(mockQuestions.map((q) => q.type))],
    []
  );

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return mockQuestions.filter((q) => {
      const matchesSearch =
        q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.questionId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject =
        subjectFilter === "all" || q.subject === subjectFilter;
      const matchesChapter =
        chapterFilter === "all" || q.chapter === chapterFilter;
      const matchesDifficulty =
        difficultyFilter === "all" || q.difficulty === difficultyFilter;
      const matchesType = typeFilter === "all" || q.type === typeFilter;

      return (
        matchesSearch &&
        matchesSubject &&
        matchesChapter &&
        matchesDifficulty &&
        matchesType
      );
    });
  }, [searchQuery, subjectFilter, chapterFilter, difficultyFilter, typeFilter]);

  // Group questions for display
  const groupedQuestions = useMemo(
    () => groupQuestionsByParagraph(filteredQuestions),
    [filteredQuestions]
  );

  // Virtualizer for performance
  const rowVirtualizer = useVirtualizer({
    count: groupedQuestions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const group = groupedQuestions[index];
      if (group.type === "paragraph") {
        return 200 + group.questions.length * 40;
      }
      return group.questions[0]?.type === "matrix_match" ? 180 : 120;
    },
    overscan: 5,
  });

  const handleQuestionToggle = (questionId: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleParagraphSelectAll = (paragraphQuestions: Question[]) => {
    const allIds = paragraphQuestions.map((q) => q.id);
    const allSelected = allIds.every((id) => selectedQuestions.includes(id));

    if (allSelected) {
      setSelectedQuestions((prev) =>
        prev.filter((id) => !allIds.includes(id))
      );
    } else {
      setSelectedQuestions((prev) => [
        ...prev,
        ...allIds.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  const handleAddSelected = () => {
    if (selectedQuestions.length === 0) return;

    const title =
      selectedQuestions.length === 1
        ? `Quiz: 1 Question`
        : `Quiz: ${selectedQuestions.length} Questions`;

    onAddQuestions({
      type: "quiz",
      title,
      source: "library",
      questions: selectedQuestions,
      duration: selectedQuestions.length * 2,
    });

    setSelectedQuestions([]);
    onOpenChange(false);
  };

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    onAddQuestions({
      type: "quiz",
      title: `AI Quiz: ${questionCount} Questions on ${chapter || "Topic"}`,
      content: aiPrompt,
      source: "ai",
      questions: Array.from({ length: questionCount }, (_, i) => `ai-q-${i}`),
      duration: questionCount * 2,
      aiGenerated: true,
    });

    setIsGenerating(false);
    setAiPrompt("");
    onOpenChange(false);
  };

  const toggleParagraphExpand = (paragraphId: string) => {
    setExpandedParagraphs((prev) =>
      prev.includes(paragraphId)
        ? prev.filter((id) => id !== paragraphId)
        : [...prev, paragraphId]
    );
  };

  const renderQuestionGroup = (group: QuestionGroup, index: number) => {
    if (group.type === "paragraph" && group.paragraphId) {
      const isExpanded = expandedParagraphs.includes(group.paragraphId);
      const allSelected = group.questions.every((q) =>
        selectedQuestions.includes(q.id)
      );
      const someSelected = group.questions.some((q) =>
        selectedQuestions.includes(q.id)
      );

      return (
        <div
          key={group.paragraphId}
          className="border rounded-lg bg-muted/30 mb-3"
        >
          {/* Paragraph Header */}
          <Collapsible
            open={isExpanded}
            onOpenChange={() => toggleParagraphExpand(group.paragraphId!)}
          >
            <div className="p-3">
              <div className="flex items-start gap-3">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 mt-0.5">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs gap-1">
                      <FileText className="w-3 h-3" />
                      Paragraph
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {group.questions.length} Questions
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {group.paragraphText}
                  </p>
                </div>
                <Button
                  variant={allSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleParagraphSelectAll(group.questions)}
                  className={cn("shrink-0", allSelected && "gradient-button")}
                >
                  {allSelected ? "Deselect All" : `Select All ${group.questions.length}`}
                </Button>
              </div>
            </div>

            <CollapsibleContent>
              <div className="border-t px-3 pb-3 pt-2 space-y-2">
                {group.questions.map((q, qIndex) => (
                  <label
                    key={q.id}
                    className={cn(
                      "flex items-start gap-2.5 p-2.5 rounded-lg cursor-pointer",
                      "hover:bg-background transition-colors",
                      selectedQuestions.includes(q.id) && "bg-primary/5"
                    )}
                  >
                    <Checkbox
                      checked={selectedQuestions.includes(q.id)}
                      onCheckedChange={() => handleQuestionToggle(q.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Q{qIndex + 1}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {q.questionText}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      );
    }

    // Single question
    const question = group.questions[0];
    if (!question) return null;

    return (
      <label
        key={question.id}
        className={cn(
          "flex items-start gap-3 p-3 rounded-lg cursor-pointer mb-2",
          "hover:bg-muted/50 transition-colors border",
          selectedQuestions.includes(question.id) &&
            "border-primary/30 bg-primary/5"
        )}
      >
        <Checkbox
          checked={selectedQuestions.includes(question.id)}
          onCheckedChange={() => handleQuestionToggle(question.id)}
          className="mt-1"
        />
        <div className="flex-1 min-w-0">
          {/* Question ID and Type */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-mono text-muted-foreground">
              {question.questionId}
            </span>
            <Badge variant="secondary" className="text-[10px] gap-1 px-1.5 py-0">
              {questionTypeIcons[question.type]}
              {questionTypeLabels[question.type]}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] px-1.5 py-0",
                difficultyConfig[question.difficulty]?.className
              )}
            >
              {difficultyConfig[question.difficulty]?.label}
            </Badge>
            {question.cognitiveType && (
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] px-1.5 py-0",
                  cognitiveTypeConfig[question.cognitiveType]?.className
                )}
              >
                {cognitiveTypeConfig[question.cognitiveType]?.label}
              </Badge>
            )}
          </div>

          {/* Question Text */}
          <p className="text-sm line-clamp-2 mb-2">{question.questionText}</p>

          {/* Options Preview for MCQ */}
          {question.options && question.options.length > 0 && (
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              {question.options.slice(0, 4).map((opt) => (
                <div
                  key={opt.id}
                  className={cn(
                    "text-xs px-2 py-1 rounded border bg-background",
                    opt.isCorrect && "border-success/50 bg-success/5"
                  )}
                >
                  <span className="font-medium">{opt.id.toUpperCase()}.</span>{" "}
                  <span className="line-clamp-1">{opt.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* Matrix Match Preview */}
          {question.type === "matrix_match" && question.columnA && question.columnB && (
            <div className="grid grid-cols-2 gap-4 mt-2 text-xs">
              <div>
                <p className="font-medium text-muted-foreground mb-1">Column A</p>
                {question.columnA.slice(0, 3).map((item) => (
                  <p key={item.id} className="truncate">
                    {item.id}. {item.text}
                  </p>
                ))}
              </div>
              <div>
                <p className="font-medium text-muted-foreground mb-1">Column B</p>
                {question.columnB.slice(0, 3).map((item) => (
                  <p key={item.id} className="truncate">
                    {item.id}. {item.text}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
            <span>
              {question.subject} › {question.chapter}
            </span>
            {question.source && <span>• {question.source}</span>}
          </div>
        </div>
      </label>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[600px] lg:max-w-[700px] p-0 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="p-4 border-b shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-lg">Question Bank</SheetTitle>
              <p className="text-sm text-muted-foreground">
                Select questions for your lesson quiz
              </p>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2 mt-3">
            <Button
              variant={mode === "select" ? "default" : "outline"}
              size="sm"
              className={cn("flex-1 h-9", mode === "select" && "gradient-button")}
              onClick={() => setMode("select")}
            >
              <CheckSquare className="w-3.5 h-3.5 mr-1.5" />
              Question Bank
            </Button>
            <Button
              variant={mode === "ai" ? "default" : "outline"}
              size="sm"
              className={cn("flex-1 h-9", mode === "ai" && "gradient-button")}
              onClick={() => setMode("ai")}
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              AI Generate
            </Button>
          </div>
        </SheetHeader>

        {mode === "select" ? (
          <>
            {/* Filters */}
            <div className="p-4 border-b space-y-3 shrink-0">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn("h-10 w-10", showFilters && "bg-muted")}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4" />
                </Button>
              </div>

              {showFilters && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      {subjects.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={chapterFilter} onValueChange={setChapterFilter}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Chapter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Chapters</SelectItem>
                      {chapters.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={difficultyFilter}
                    onValueChange={setDifficultyFilter}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Difficulties</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {types.map((t) => (
                        <SelectItem key={t} value={t}>
                          {questionTypeLabels[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Showing {filteredQuestions.length} questions
                </span>
                {selectedQuestions.length > 0 && (
                  <Badge variant="default" className="gradient-button">
                    {selectedQuestions.length} selected
                  </Badge>
                )}
              </div>
            </div>

            {/* Questions List */}
            <div ref={parentRef} className="flex-1 overflow-auto p-4">
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const group = groupedQuestions[virtualRow.index];
                  return (
                    <div
                      key={virtualRow.index}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      {renderQuestionGroup(group, virtualRow.index)}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t shrink-0 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMode("ai")}
                className="gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                AI Generate Instead
              </Button>
              <Button
                className="gradient-button gap-2"
                onClick={handleAddSelected}
                disabled={selectedQuestions.length === 0}
              >
                <Check className="w-4 h-4" />
                Add {selectedQuestions.length} Question
                {selectedQuestions.length !== 1 ? "s" : ""}
              </Button>
            </div>
          </>
        ) : (
          /* AI Generate Mode */
          <div className="flex-1 p-4 space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                How many questions?
              </label>
              <div className="flex gap-2 flex-wrap">
                {[3, 5, 10, 15, 20].map((count) => (
                  <Button
                    key={count}
                    variant={questionCount === count ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "h-9 px-4",
                      questionCount === count && "gradient-button"
                    )}
                    onClick={() => setQuestionCount(count)}
                  >
                    {count}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Topic or specific focus (optional)
              </label>
              <Textarea
                placeholder={`e.g., "Focus on numerical problems about force calculation..."`}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>

            {chapter && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Context:</span>
                <Badge variant="secondary" className="text-xs">
                  {subject} • {chapter}
                </Badge>
              </div>
            )}

            <Button
              className="w-full gradient-button gap-2 h-11"
              onClick={handleAIGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate {questionCount} Questions
                </>
              )}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

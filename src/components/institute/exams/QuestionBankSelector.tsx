import { useState, useMemo } from "react";
import { Search, X, Check, ChevronDown, ChevronUp, Eye, Trash2, List, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { mockQuestions, Question, difficultyConfig, questionTypeLabels, cognitiveTypeConfig, CognitiveType, getCognitiveTypeForQuestion } from "@/data/questionsData";
import { getChaptersByClassAndSubject } from "@/data/cbseMasterData";
import { courseOwnedChapters, courseChapterMappings } from "@/data/masterData";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface QuestionBankSelectorProps {
  selectedCourse: string;
  selectedClassId: string;
  selectedSubjects: string[];
  isCBSE: boolean;
  selectedQuestionIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

interface ChapterWithSource {
  id: string;
  name: string;
  source: string;
}

// Subject name mapping
const subjectNames: Record<string, string> = {
  "1": "Physics",
  "2": "Chemistry", 
  "3": "Mathematics",
  "4": "Biology",
  "physics": "Physics",
  "chemistry": "Chemistry",
  "mathematics": "Mathematics",
  "biology": "Biology",
};

export const QuestionBankSelector = ({
  selectedCourse,
  selectedClassId,
  selectedSubjects,
  isCBSE,
  selectedQuestionIds,
  onSelectionChange,
}: QuestionBankSelectorProps) => {
  const [activeSubjectTab, setActiveSubjectTab] = useState(selectedSubjects[0] || "");
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([]);
  const [cognitiveFilter, setCognitiveFilter] = useState<CognitiveType[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [chaptersExpanded, setChaptersExpanded] = useState(true);
  const [compactView, setCompactView] = useState(false);

  // Get chapters based on course type
  const getChaptersForSubject = (subjectId: string): ChapterWithSource[] => {
    if (isCBSE && selectedClassId) {
      return getChaptersByClassAndSubject(selectedClassId, subjectId).map(ch => ({
        id: ch.id,
        name: ch.name,
        source: "CBSE"
      }));
    } else {
      const mappedChapterIds = courseChapterMappings
        .filter(m => m.courseId === selectedCourse)
        .map(m => m.chapterId);
      
      const courseOwned = courseOwnedChapters
        .filter(ch => ch.courseId === selectedCourse && ch.subjectId === subjectId)
        .map(ch => ({
          id: ch.id,
          name: ch.name,
          source: "Course"
        }));

      const cbseChapters = getChaptersByClassAndSubject("6", subjectId)
        .concat(getChaptersByClassAndSubject("7", subjectId))
        .filter(ch => mappedChapterIds.includes(ch.id))
        .map(ch => ({
          id: ch.id,
          name: ch.name,
          source: "CBSE 11-12"
        }));

      return [...courseOwned, ...cbseChapters];
    }
  };

  const chaptersForActiveSubject = useMemo(() => 
    getChaptersForSubject(activeSubjectTab), 
    [activeSubjectTab, isCBSE, selectedClassId, selectedCourse]
  );

  // Filter questions based on selections
  const filteredQuestions = useMemo(() => {
    let questions = mockQuestions.filter(q => {
      const subjectMatch = selectedSubjects.some(s => 
        q.subjectId === s || q.subject.toLowerCase() === subjectNames[s]?.toLowerCase()
      );
      if (!subjectMatch) return false;

      if (activeSubjectTab) {
        const activeMatch = q.subjectId === activeSubjectTab || 
          q.subject.toLowerCase() === subjectNames[activeSubjectTab]?.toLowerCase();
        if (!activeMatch) return false;
      }

      if (selectedChapterIds.length > 0) {
        const chapterMatch = selectedChapterIds.some(chId => 
          q.chapterId === chId || q.chapter.toLowerCase().includes(chId.toLowerCase())
        );
        if (!chapterMatch) return false;
      }

      if (difficultyFilter.length > 0 && !difficultyFilter.includes(q.difficulty)) {
        return false;
      }

      // Cognitive filter
      if (cognitiveFilter.length > 0) {
        const qCognitiveType = getCognitiveTypeForQuestion(q);
        if (!cognitiveFilter.includes(qCognitiveType)) return false;
      }

      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return q.questionText.toLowerCase().includes(searchLower) ||
          q.chapter.toLowerCase().includes(searchLower) ||
          q.topic.toLowerCase().includes(searchLower);
      }

      return true;
    });

    return questions;
  }, [selectedSubjects, activeSubjectTab, selectedChapterIds, difficultyFilter, cognitiveFilter, searchQuery]);

  const toggleQuestion = (questionId: string) => {
    if (selectedQuestionIds.includes(questionId)) {
      onSelectionChange(selectedQuestionIds.filter(id => id !== questionId));
    } else {
      onSelectionChange([...selectedQuestionIds, questionId]);
    }
  };

  const toggleChapter = (chapterId: string) => {
    setSelectedChapterIds(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const selectAllVisible = () => {
    const visibleIds = filteredQuestions.map(q => q.id);
    const newSelection = [...new Set([...selectedQuestionIds, ...visibleIds])];
    onSelectionChange(newSelection);
  };

  const clearSelection = () => {
    onSelectionChange([]);
  };

  // Get selected questions for preview
  const selectedQuestions = mockQuestions.filter(q => selectedQuestionIds.includes(q.id));

  // Group selected questions by subject
  const selectedBySubject = useMemo(() => {
    const grouped: Record<string, Question[]> = {};
    selectedQuestions.forEach(q => {
      const subject = q.subject;
      if (!grouped[subject]) grouped[subject] = [];
      grouped[subject].push(q);
    });
    return grouped;
  }, [selectedQuestions]);

  const totalSelected = selectedQuestionIds.length;

  // Preview card component with options
  const PreviewQuestionCard = ({ q, index }: { q: Question; index: number }) => {
    const cogType = getCognitiveTypeForQuestion(q);
    
    return (
      <div className="p-3 bg-muted/50 rounded-lg border border-border/50">
        <div className="flex items-start gap-2">
          <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded shrink-0">
            Q{index + 1}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex gap-1.5 flex-wrap mb-1.5">
              <Badge variant="outline" className={cn("text-[10px] h-5", difficultyConfig[q.difficulty].className)}>
                {q.difficulty}
              </Badge>
              <Badge variant="outline" className={cn("text-[10px] h-5", cognitiveTypeConfig[cogType].className)}>
                {cognitiveTypeConfig[cogType].label}
              </Badge>
              <Badge variant="secondary" className="text-[10px] h-5">
                {questionTypeLabels[q.type]}
              </Badge>
            </div>
            
            {!compactView && (
              <>
                <p className="text-sm mb-2">{q.questionText}</p>
                
                {/* Options display for MCQ */}
                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-2">
                    {q.options.map((opt, idx) => (
                      <div
                        key={opt.id}
                        className={cn(
                          "text-xs px-2 py-1.5 rounded border",
                          opt.isCorrect 
                            ? "bg-success/10 text-success border-success/30 font-medium" 
                            : "bg-muted/30 text-muted-foreground border-transparent"
                        )}
                      >
                        {String.fromCharCode(65 + idx)}. {opt.text}
                      </div>
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground mt-2">
                  {q.chapter} • {q.topic}
                </p>
              </>
            )}
            
            {compactView && (
              <p className="text-xs text-muted-foreground line-clamp-1">{q.questionText}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              toggleQuestion(q.id);
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Subject Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
        {selectedSubjects.map(subjectId => {
          const subjectName = subjectNames[subjectId] || subjectId;
          const selectedCount = selectedQuestionIds.filter(id => {
            const q = mockQuestions.find(q => q.id === id);
            return q && (q.subjectId === subjectId || q.subject.toLowerCase() === subjectName.toLowerCase());
          }).length;

          return (
            <button
              key={subjectId}
              onClick={() => setActiveSubjectTab(subjectId)}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeSubjectTab === subjectId
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              )}
            >
              {subjectName}
              {selectedCount > 0 && (
                <Badge variant="secondary" className="ml-2 bg-background/20">
                  {selectedCount}
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Panel - Filters */}
        <div className="lg:col-span-1 space-y-4">
          {/* Chapter Filter */}
          <Collapsible open={chaptersExpanded} onOpenChange={setChaptersExpanded}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
              <span className="text-sm font-medium">Chapters</span>
              {chaptersExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ScrollArea className="h-48 mt-2">
                <div className="space-y-1 pr-2">
                  {chaptersForActiveSubject.map(chapter => (
                    <label
                      key={chapter.id}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all text-sm",
                        selectedChapterIds.includes(chapter.id)
                          ? "bg-primary/10 border border-primary/30"
                          : "hover:bg-muted"
                      )}
                    >
                      <Checkbox
                        checked={selectedChapterIds.includes(chapter.id)}
                        onCheckedChange={() => toggleChapter(chapter.id)}
                      />
                      <span className="flex-1 line-clamp-1">{chapter.name}</span>
                    </label>
                  ))}
                  {chaptersForActiveSubject.length === 0 && (
                    <p className="text-xs text-muted-foreground p-2">No chapters available</p>
                  )}
                </div>
              </ScrollArea>
            </CollapsibleContent>
          </Collapsible>

          {/* Difficulty Filter */}
          <div className="space-y-2">
            <Label className="text-sm">Difficulty</Label>
            <div className="flex flex-wrap gap-2">
              {(["easy", "medium", "hard"] as const).map(diff => (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(prev => 
                    prev.includes(diff) ? prev.filter(d => d !== diff) : [...prev, diff]
                  )}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium transition-all border",
                    difficultyFilter.includes(diff)
                      ? difficultyConfig[diff].className
                      : "bg-muted text-muted-foreground border-transparent"
                  )}
                >
                  {difficultyConfig[diff].label}
                </button>
              ))}
            </div>
          </div>

          {/* Cognitive Type Filter */}
          <div className="space-y-2">
            <Label className="text-sm">Cognitive Type</Label>
            <div className="flex flex-wrap gap-1.5">
              {(["logical", "analytical", "conceptual", "numerical", "application", "memory"] as CognitiveType[]).map(cog => (
                <button
                  key={cog}
                  onClick={() => setCognitiveFilter(prev => 
                    prev.includes(cog) ? prev.filter(c => c !== cog) : [...prev, cog]
                  )}
                  className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-medium transition-all border",
                    cognitiveFilter.includes(cog)
                      ? cognitiveTypeConfig[cog].className
                      : "bg-muted text-muted-foreground border-transparent"
                  )}
                >
                  {cognitiveTypeConfig[cog].label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {(selectedChapterIds.length > 0 || difficultyFilter.length > 0 || cognitiveFilter.length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={() => {
                setSelectedChapterIds([]);
                setDifficultyFilter([]);
                setCognitiveFilter([]);
              }}
            >
              <X className="w-3 h-3 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Right Panel - Questions */}
        <div className="lg:col-span-3 space-y-3">
          {/* Search & Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAllVisible}>
                Select All ({filteredQuestions.length})
              </Button>
            </div>
          </div>

          {/* Questions Grid */}
          <ScrollArea className="h-[400px] sm:h-[450px]">
            <div className="space-y-2 pr-2">
              {filteredQuestions.map(question => {
                const cogType = getCognitiveTypeForQuestion(question);
                return (
                  <div
                    key={question.id}
                    onClick={() => toggleQuestion(question.id)}
                    className={cn(
                      "p-3 rounded-xl border cursor-pointer transition-all",
                      selectedQuestionIds.includes(question.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 bg-card"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedQuestionIds.includes(question.id)}
                        onCheckedChange={() => toggleQuestion(question.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <span className="text-xs font-mono text-muted-foreground">{question.questionId}</span>
                          <Badge variant="outline" className={cn("text-[10px] h-5", difficultyConfig[question.difficulty].className)}>
                            {question.difficulty}
                          </Badge>
                          <Badge variant="outline" className={cn("text-[10px] h-5", cognitiveTypeConfig[cogType].className)}>
                            {cognitiveTypeConfig[cogType].label}
                          </Badge>
                          <Badge variant="secondary" className="text-[10px] h-5">
                            {questionTypeLabels[question.type]}
                          </Badge>
                        </div>
                        <p className="text-sm line-clamp-2">{question.questionText}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {question.chapter} • {question.topic}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredQuestions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No questions found</p>
                  <p className="text-xs mt-1">Try adjusting your filters</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Selection Summary - Mobile: Fixed Bottom, Desktop: Inline */}
      {selectedQuestionIds.length > 0 && (
        <>
          {/* Mobile Floating Badge */}
          <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
            <Sheet open={showPreview} onOpenChange={setShowPreview}>
              <SheetTrigger asChild>
                <Button className="w-full gap-2 shadow-lg">
                  <Check className="w-4 h-4" />
                  {selectedQuestionIds.length} Questions Selected
                  <Eye className="w-4 h-4 ml-auto" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh]">
                <SheetHeader className="pb-3 border-b">
                  <div className="flex items-center justify-between">
                    <SheetTitle>Selected Questions ({totalSelected})</SheetTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setCompactView(!compactView)}
                      >
                        {compactView ? <Grid className="w-4 h-4" /> : <List className="w-4 h-4" />}
                      </Button>
                      <Button variant="outline" size="sm" onClick={clearSelection}>
                        Clear All
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap mt-2">
                    {Object.entries(selectedBySubject).map(([subject, questions]) => (
                      <Badge key={subject} variant="secondary" className="text-xs">
                        {subject}: {questions.length}
                      </Badge>
                    ))}
                  </div>
                </SheetHeader>
                <ScrollArea className="h-[calc(100%-80px)] mt-4 -mx-6 px-6">
                  {Object.entries(selectedBySubject).map(([subject, questions]) => (
                    <Collapsible key={subject} defaultOpen={questions.length <= 10} className="mb-4">
                      <CollapsibleTrigger className="w-full flex items-center justify-between p-2 bg-muted/50 rounded-lg hover:bg-muted">
                        <h4 className="font-medium flex items-center gap-2 text-sm">
                          {subject}
                          <Badge variant="secondary">{questions.length}</Badge>
                        </h4>
                        <ChevronDown className="w-4 h-4" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="space-y-2 mt-2">
                          {questions.map((q, idx) => (
                            <PreviewQuestionCard key={q.id} q={q} index={idx} />
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Summary Panel - Hidden when preview is open */}
          {!showPreview && (
            <div className="hidden lg:block p-4 bg-muted/30 rounded-xl border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-success" />
                    <span className="font-medium">{selectedQuestionIds.length} Questions Selected</span>
                  </div>
                  <div className="flex gap-2">
                    {Object.entries(selectedBySubject).map(([subject, questions]) => (
                      <Badge key={subject} variant="secondary">
                        {subject}: {questions.length}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={clearSelection}>
                    Clear All
                  </Button>
                  <Sheet open={showPreview} onOpenChange={setShowPreview}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Eye className="w-4 h-4" />
                        Preview
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[600px] sm:max-w-xl">
                      <SheetHeader className="pb-3 border-b">
                        <div className="flex items-center justify-between">
                          <SheetTitle>Selected Questions ({totalSelected})</SheetTitle>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setCompactView(!compactView)}
                              title={compactView ? "Detailed View" : "Compact View"}
                            >
                              {compactView ? <Grid className="w-4 h-4" /> : <List className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap mt-2">
                          {Object.entries(selectedBySubject).map(([subject, questions]) => (
                            <Badge key={subject} variant="secondary" className="text-xs">
                              {subject}: {questions.length}
                            </Badge>
                          ))}
                        </div>
                      </SheetHeader>
                      <ScrollArea className="h-[calc(100vh-120px)] mt-4 -mx-6 px-6">
                        {Object.entries(selectedBySubject).map(([subject, questions]) => (
                          <Collapsible key={subject} defaultOpen={questions.length <= 10} className="mb-4">
                            <CollapsibleTrigger className="w-full flex items-center justify-between p-2 bg-muted/50 rounded-lg hover:bg-muted">
                              <h4 className="font-medium flex items-center gap-2 text-sm">
                                {subject}
                                <Badge variant="secondary">{questions.length}</Badge>
                              </h4>
                              <ChevronDown className="w-4 h-4" />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="space-y-2 mt-2">
                                {questions.map((q, idx) => (
                                  <PreviewQuestionCard key={q.id} q={q} index={idx} />
                                ))}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </ScrollArea>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuestionBankSelector;

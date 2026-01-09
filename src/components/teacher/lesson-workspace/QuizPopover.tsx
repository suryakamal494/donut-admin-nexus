import { useState, useRef, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { 
  Sparkles, 
  Search,
  Loader2,
  X,
  Check,
  CircleDot,
  CheckSquare,
  Calculator,
  Scale,
  FileText,
  Grid3X3,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { type LessonPlanBlock } from "./types";
import { 
  mockQuestions, 
  type Question, 
  type QuestionType,
  type QuestionDifficulty,
  difficultyConfig,
  questionTypeLabels,
} from "@/data/questionsData";

interface QuizPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddBlock: (block: Omit<LessonPlanBlock, 'id'>) => void;
  chapter?: string;
  subject?: string;
  children: React.ReactNode;
}

// Question type icon mapping
const getQuestionTypeIcon = (type: QuestionType) => {
  switch (type) {
    case 'mcq_single': return CircleDot;
    case 'mcq_multiple': return CheckSquare;
    case 'numerical': return Calculator;
    case 'assertion_reasoning': return Scale;
    case 'paragraph': return FileText;
    case 'matrix_match': return Grid3X3;
    default: return CircleDot;
  }
};

// Compact question card for virtualized list
const QuestionItem = ({ 
  question, 
  isSelected, 
  onToggle 
}: { 
  question: Question; 
  isSelected: boolean;
  onToggle: () => void;
}) => {
  const TypeIcon = getQuestionTypeIcon(question.type);
  const difficulty = difficultyConfig[question.difficulty];
  
  return (
    <div 
      className={cn(
        "p-2.5 rounded-lg border cursor-pointer transition-all",
        isSelected 
          ? "bg-primary/5 border-primary/30" 
          : "bg-background border-border/50 hover:border-primary/20"
      )}
      onClick={onToggle}
    >
      <div className="flex items-start gap-2">
        <Checkbox 
          checked={isSelected} 
          className="mt-0.5 shrink-0"
          onCheckedChange={onToggle}
        />
        <div className="flex-1 min-w-0 space-y-1">
          {/* Header row */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-mono text-muted-foreground">
              {question.questionId}
            </span>
            <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 gap-0.5">
              <TypeIcon className="w-2.5 h-2.5" />
              {questionTypeLabels[question.type].replace('MCQ ', '').slice(0, 8)}
            </Badge>
            <Badge 
              variant="outline" 
              className={cn("text-[9px] px-1 py-0 h-4", difficulty.className)}
            >
              {difficulty.label}
            </Badge>
          </div>
          
          {/* Question text */}
          <p className="text-xs text-foreground line-clamp-2 leading-relaxed">
            {question.questionText}
          </p>
          
          {/* Options preview for MCQ */}
          {question.options && question.options.length > 0 && (
            <div className="flex flex-wrap gap-x-2 gap-y-0.5">
              {question.options.slice(0, 4).map((opt, i) => (
                <span 
                  key={opt.id} 
                  className={cn(
                    "text-[9px]",
                    opt.isCorrect ? "text-success font-medium" : "text-muted-foreground"
                  )}
                >
                  {String.fromCharCode(65 + i)}. {opt.text.slice(0, 15)}{opt.text.length > 15 ? '...' : ''}
                  {opt.isCorrect && ' ✓'}
                </span>
              ))}
            </div>
          )}
          
          {/* Chapter tag */}
          <div className="flex items-center gap-1">
            <span className="text-[9px] text-muted-foreground">
              {question.subject} › {question.chapter}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const QuizPopover = ({ 
  open, 
  onOpenChange, 
  onAddBlock,
  chapter,
  subject,
  children 
}: QuizPopoverProps) => {
  const [activeTab, setActiveTab] = useState<'bank' | 'ai'>('bank');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  
  // AI generate state
  const [aiPrompt, setAiPrompt] = useState('');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Virtual scroll ref
  const parentRef = useRef<HTMLDivElement>(null);
  
  // Filter questions
  const filteredQuestions = useMemo(() => {
    return mockQuestions.filter(q => {
      const matchesSearch = searchQuery === '' || 
        q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.questionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.chapter.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedType === 'all' || q.type === selectedType;
      const matchesDifficulty = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
      
      // If subject/chapter context is provided, prioritize those
      const matchesContext = !subject || q.subject.toLowerCase() === subject.toLowerCase();
      
      return matchesSearch && matchesType && matchesDifficulty && matchesContext;
    });
  }, [searchQuery, selectedType, selectedDifficulty, subject]);
  
  // Virtual list
  const rowVirtualizer = useVirtualizer({
    count: filteredQuestions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Approximate row height
    overscan: 5,
  });
  
  const toggleQuestion = (questionId: string) => {
    setSelectedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };
  
  const handleAddSelected = () => {
    if (selectedQuestions.size === 0) return;
    
    const selectedQs = mockQuestions.filter(q => selectedQuestions.has(q.id));
    
    onAddBlock({
      type: 'quiz',
      title: `Quiz: ${selectedQuestions.size} Questions`,
      source: 'library',
      questions: Array.from(selectedQuestions),
      duration: selectedQuestions.size * 2,
    });
    
    setSelectedQuestions(new Set());
    onOpenChange(false);
  };
  
  const handleAIGenerate = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onAddBlock({
      type: 'quiz',
      title: `AI Quiz: ${questionCount} Questions on ${chapter || 'Topic'}`,
      content: aiPrompt,
      source: 'ai',
      questions: Array.from({ length: questionCount }, (_, i) => `ai-q-${i}`),
      duration: questionCount * 2,
      aiGenerated: true,
    });
    
    setIsGenerating(false);
    setAiPrompt('');
    onOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="w-[420px] sm:w-[480px] p-0 bg-popover" 
        align="start"
        side="bottom"
        sideOffset={8}
        collisionPadding={{ top: 80, left: 16, right: 16, bottom: 16 }}
        avoidCollisions={true}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <div>
            <h4 className="font-semibold text-sm">Add Quiz Block</h4>
            <p className="text-xs text-muted-foreground">
              {activeTab === 'bank' 
                ? `${filteredQuestions.length} questions available` 
                : 'Generate questions with AI'}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => onOpenChange(false)}
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'bank' | 'ai')} className="flex flex-col">
          <div className="px-3 pt-3">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="bank" className="text-xs gap-1.5">
                <Search className="w-3 h-3" />
                Question Bank
              </TabsTrigger>
              <TabsTrigger value="ai" className="text-xs gap-1.5">
                <Sparkles className="w-3 h-3" />
                AI Generate
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Question Bank Tab */}
          <TabsContent value="bank" className="mt-0 flex-1 flex flex-col">
            {/* Filters */}
            <div className="p-3 space-y-2 border-b">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-xs"
                />
              </div>
              
              {/* Filter row */}
              <div className="flex gap-2">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="h-7 text-[10px] flex-1">
                    <Filter className="w-3 h-3 mr-1" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all" className="text-xs">All Types</SelectItem>
                    <SelectItem value="mcq_single" className="text-xs">MCQ Single</SelectItem>
                    <SelectItem value="mcq_multiple" className="text-xs">MCQ Multiple</SelectItem>
                    <SelectItem value="numerical" className="text-xs">Numerical</SelectItem>
                    <SelectItem value="assertion_reasoning" className="text-xs">Assertion</SelectItem>
                    <SelectItem value="paragraph" className="text-xs">Paragraph</SelectItem>
                    <SelectItem value="matrix_match" className="text-xs">Matrix Match</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="h-7 text-[10px] flex-1">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all" className="text-xs">All Levels</SelectItem>
                    <SelectItem value="easy" className="text-xs">Easy</SelectItem>
                    <SelectItem value="medium" className="text-xs">Medium</SelectItem>
                    <SelectItem value="hard" className="text-xs">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Selection summary */}
              {selectedQuestions.size > 0 && (
                <div className="flex items-center justify-between py-1.5 px-2 bg-primary/5 rounded-md">
                  <span className="text-xs font-medium text-primary">
                    {selectedQuestions.size} question{selectedQuestions.size > 1 ? 's' : ''} selected
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[10px] text-muted-foreground hover:text-foreground"
                    onClick={() => setSelectedQuestions(new Set())}
                  >
                    Clear
                  </Button>
                </div>
              )}
            </div>
            
            {/* Virtualized Question List */}
            <div 
              ref={parentRef}
              className="h-[280px] overflow-auto px-3 py-2"
            >
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const question = filteredQuestions[virtualRow.index];
                  return (
                    <div
                      key={question.id}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                      className="pb-2"
                    >
                      <QuestionItem
                        question={question}
                        isSelected={selectedQuestions.has(question.id)}
                        onToggle={() => toggleQuestion(question.id)}
                      />
                    </div>
                  );
                })}
              </div>
              
              {filteredQuestions.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Search className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">No questions found</p>
                  <p className="text-xs">Try adjusting your filters</p>
                </div>
              )}
            </div>
            
            {/* Footer with Add button */}
            <div className="p-3 border-t">
              <Button
                className="w-full gradient-button gap-2"
                onClick={handleAddSelected}
                disabled={selectedQuestions.size === 0}
              >
                <Check className="w-4 h-4" />
                Add {selectedQuestions.size || ''} Question{selectedQuestions.size !== 1 ? 's' : ''} to Quiz
              </Button>
            </div>
          </TabsContent>
          
          {/* AI Generate Tab */}
          <TabsContent value="ai" className="mt-0 p-3 space-y-3">
            {/* Question Count */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                How many questions?
              </label>
              <div className="flex gap-2 flex-wrap">
                {[3, 5, 10, 15].map((count) => (
                  <Button
                    key={count}
                    variant={questionCount === count ? 'default' : 'outline'}
                    size="sm"
                    className={cn("h-8 px-3", questionCount === count && "gradient-button")}
                    onClick={() => setQuestionCount(count)}
                  >
                    {count}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Topic Input */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Topic or specific focus (optional)
              </label>
              <Textarea
                placeholder={`e.g., "Focus on numerical problems about force calculation..."`}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="min-h-[80px] text-sm resize-none"
              />
            </div>
            
            {chapter && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground">Context:</span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {subject} • {chapter}
                </Badge>
              </div>
            )}
            
            <Button
              className="w-full gradient-button gap-2"
              onClick={handleAIGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate {questionCount} Questions
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

import { useState } from "react";
import { 
  Search, 
  Sparkles, 
  HelpCircle,
  Loader2,
  X,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type LessonPlanBlock } from "./types";

interface QuizPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddBlock: (block: Omit<LessonPlanBlock, 'id'>) => void;
  chapter?: string;
  subject?: string;
  children: React.ReactNode;
}

// Mock questions
const mockQuestions = [
  { id: 'q1', text: "What is Newton's first law of motion?", type: 'MCQ' },
  { id: 'q2', text: "Calculate the force required to accelerate a 5kg object at 2m/s²", type: 'Numerical' },
  { id: 'q3', text: "Explain the concept of inertia with examples", type: 'Short' },
  { id: 'q4', text: "Which of the following is an example of Newton's third law?", type: 'MCQ' },
  { id: 'q5', text: "Define momentum and state its SI unit", type: 'Short' },
];

export const QuizPopover = ({ 
  open, 
  onOpenChange, 
  onAddBlock,
  chapter,
  subject,
  children 
}: QuizPopoverProps) => {
  const [mode, setMode] = useState<'select' | 'ai'>('select');
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [questionCount, setQuestionCount] = useState<1 | 3 | 5>(3);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleQuestionToggle = (questionId: string) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleAddSelected = () => {
    if (selectedQuestions.length === 0) return;
    
    const selectedQ = mockQuestions.filter(q => selectedQuestions.includes(q.id));
    const title = selectedQuestions.length === 1 
      ? selectedQ[0].text.substring(0, 50) + '...'
      : `Quiz: ${selectedQuestions.length} Questions`;
    
    onAddBlock({
      type: 'quiz',
      title,
      source: 'library',
      questions: selectedQuestions,
      duration: selectedQuestions.length * 2,
    });
    
    setSelectedQuestions([]);
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

  const filteredQuestions = mockQuestions.filter(q =>
    q.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="w-[360px] p-0" 
        align="start"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <div>
            <h4 className="font-semibold text-sm">Add Quiz Block</h4>
            <p className="text-xs text-muted-foreground">Select questions or generate with AI</p>
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
        
        {/* Mode Toggle */}
        <div className="p-3 border-b">
          <div className="flex gap-2">
            <Button
              variant={mode === 'select' ? 'default' : 'outline'}
              size="sm"
              className={cn("flex-1 h-9", mode === 'select' && 'gradient-button')}
              onClick={() => setMode('select')}
            >
              <HelpCircle className="w-3.5 h-3.5 mr-1.5" />
              Question Bank
            </Button>
            <Button
              variant={mode === 'ai' ? 'default' : 'outline'}
              size="sm"
              className={cn("flex-1 h-9", mode === 'ai' && 'gradient-button')}
              onClick={() => setMode('ai')}
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              AI Generate
            </Button>
          </div>
        </div>
        
        <div className="p-3">
          {mode === 'select' ? (
            <div className="space-y-3">
              {/* Quick Count Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Quick select:</span>
                {[1, 3, 5].map((count) => (
                  <Button
                    key={count}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-7 px-3 text-xs",
                      selectedQuestions.length === count && "border-primary bg-primary/5"
                    )}
                    onClick={() => setSelectedQuestions(mockQuestions.slice(0, count).map(q => q.id))}
                  >
                    {count}
                  </Button>
                ))}
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-9 text-sm"
                />
              </div>
              
              {chapter && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground uppercase">Chapter:</span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {chapter}
                  </Badge>
                </div>
              )}
              
              {/* Questions List */}
              <ScrollArea className="h-[200px]">
                <div className="space-y-1.5">
                  {filteredQuestions.map((question) => (
                    <label
                      key={question.id}
                      className={cn(
                        "flex items-start gap-2.5 p-2.5 rounded-lg cursor-pointer",
                        "hover:bg-primary/5 transition-colors",
                        "border border-transparent",
                        selectedQuestions.includes(question.id) && "border-primary/30 bg-primary/5"
                      )}
                    >
                      <Checkbox
                        checked={selectedQuestions.includes(question.id)}
                        onCheckedChange={() => handleQuestionToggle(question.id)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm line-clamp-2">{question.text}</p>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 mt-1">
                          {question.type}
                        </Badge>
                      </div>
                    </label>
                  ))}
                </div>
              </ScrollArea>
              
              {/* Add Button */}
              <Button
                className="w-full gradient-button"
                onClick={handleAddSelected}
                disabled={selectedQuestions.length === 0}
              >
                <Check className="w-4 h-4 mr-2" />
                Add {selectedQuestions.length} Question{selectedQuestions.length !== 1 ? 's' : ''}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Question Count */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  How many questions?
                </label>
                <div className="flex gap-2">
                  {([1, 3, 5] as const).map((count) => (
                    <Button
                      key={count}
                      variant={questionCount === count ? 'default' : 'outline'}
                      size="sm"
                      className={cn("flex-1 h-9", questionCount === count && "gradient-button")}
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
                    Generate {questionCount} Question{questionCount > 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

import { useState } from "react";
import { 
  Sparkles, 
  HelpCircle,
  Loader2,
  X,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type LessonPlanBlock } from "./types";
import { QuestionBankSheet } from "./QuestionBankSheet";

interface QuizPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddBlock: (block: Omit<LessonPlanBlock, 'id'>) => void;
  chapter?: string;
  subject?: string;
  children: React.ReactNode;
}

export const QuizPopover = ({ 
  open, 
  onOpenChange, 
  onAddBlock,
  chapter,
  subject,
  children 
}: QuizPopoverProps) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showQuestionBank, setShowQuestionBank] = useState(false);

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

  const handleQuestionBankAdd = (block: Omit<LessonPlanBlock, 'id'>) => {
    onAddBlock(block);
    setShowQuestionBank(false);
    onOpenChange(false);
  };

  return (
    <>
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          {children}
        </PopoverTrigger>
<PopoverContent 
          className="w-[360px] p-0 bg-popover" 
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
          
          <div className="p-3 space-y-4">
            {/* Question Bank Button - Opens Sheet */}
            <Button
              variant="outline"
              className="w-full h-16 flex-col gap-1 border-dashed border-2"
              onClick={() => setShowQuestionBank(true)}
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                <span className="font-medium">Browse Question Bank</span>
                <ExternalLink className="w-3 h-3" />
              </div>
              <span className="text-[10px] text-muted-foreground">
                100+ questions • MCQ, Numerical, Paragraph, Matrix Match
              </span>
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-popover px-2 text-muted-foreground">or</span>
              </div>
            </div>
            
            {/* AI Generate Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Generate with AI</span>
              </div>
              
              {/* Question Count */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  How many questions?
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[3, 5, 10].map((count) => (
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
                  className="min-h-[70px] text-sm resize-none"
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
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Question Bank Sheet */}
      <QuestionBankSheet
        open={showQuestionBank}
        onOpenChange={setShowQuestionBank}
        onAddQuestions={handleQuestionBankAdd}
        chapter={chapter}
        subject={subject}
      />
    </>
  );
};

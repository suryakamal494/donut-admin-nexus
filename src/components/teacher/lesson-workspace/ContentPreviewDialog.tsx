import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { LessonPlanBlock } from "./types";
import { mockQuestions, Question } from "@/data/questionsData";
import { 
  FileText, Video, Image, Presentation, FileQuestion, 
  ChevronLeft, ChevronRight, CheckCircle2, Circle 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  block: LessonPlanBlock | null;
}

const getContentIcon = (sourceType?: string, size: "sm" | "lg" = "lg") => {
  const className = size === "lg" ? "w-12 h-12 text-muted-foreground" : "w-5 h-5 text-muted-foreground";
  switch (sourceType) {
    case 'presentation':
      return <Presentation className={className} />;
    case 'video':
      return <Video className={className} />;
    case 'document':
      return <FileText className={className} />;
    case 'image':
      return <Image className={className} />;
    default:
      return <FileQuestion className={className} />;
  }
};

const getBlockTypeLabel = (type: string) => {
  switch (type) {
    case 'explain':
      return 'Explanation Content';
    case 'demonstrate':
      return 'Demonstration Content';
    case 'quiz':
      return 'Quiz Questions';
    case 'homework':
      return 'Homework Assignment';
    default:
      return 'Content';
  }
};

// Convert YouTube URL to embed URL
const getEmbedUrl = (url: string): string => {
  // YouTube watch URL to embed
  if (url.includes('youtube.com/watch')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  }
  // YouTube short URL
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
};

// Quiz Preview Component with Navigation
const QuizPreviewContent = ({ block }: { block: LessonPlanBlock }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  // Look up actual questions from the question bank
  const questionObjects: Question[] = (block.questions || [])
    .map(qId => mockQuestions.find(q => q.id === qId || q.questionId === qId))
    .filter((q): q is Question => q !== undefined);

  if (questionObjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileQuestion className="w-12 h-12 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">No questions found in this quiz</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Question IDs: {block.questions?.join(', ') || 'None'}
        </p>
      </div>
    );
  }

  const currentQuestion = questionObjects[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === questionObjects.length - 1;

  const handlePrevious = () => {
    if (!isFirst) {
      setCurrentIndex(currentIndex - 1);
      setShowSolution(false);
    }
  };

  const handleNext = () => {
    if (!isLast) {
      setCurrentIndex(currentIndex + 1);
      setShowSolution(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with navigation */}
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Question {currentIndex + 1} of {questionObjects.length}
          </span>
          <span className={cn(
            "px-2 py-0.5 rounded text-xs font-medium capitalize",
            currentQuestion.difficulty === 'easy' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
            currentQuestion.difficulty === 'medium' && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
            currentQuestion.difficulty === 'hard' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
          )}>
            {currentQuestion.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={isFirst}
            className="gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={isLast}
            className="gap-1"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Question Content */}
      <div className="p-4 sm:p-6 bg-muted/30 rounded-lg border">
        {/* Question Type Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-medium">
            {currentQuestion.type.replace('_', ' ').toUpperCase()}
          </span>
          <span className="text-xs text-muted-foreground">
            {currentQuestion.marks} marks
          </span>
        </div>

        {/* Assertion-Reasoning format */}
        {currentQuestion.type === 'assertion_reasoning' && currentQuestion.assertion && currentQuestion.reason ? (
          <div className="space-y-3 mb-4">
            <div className="p-3 bg-background rounded border">
              <p className="text-xs font-medium text-muted-foreground mb-1">Assertion (A):</p>
              <p className="text-sm">{currentQuestion.assertion}</p>
            </div>
            <div className="p-3 bg-background rounded border">
              <p className="text-xs font-medium text-muted-foreground mb-1">Reason (R):</p>
              <p className="text-sm">{currentQuestion.reason}</p>
            </div>
          </div>
        ) : (
          <p className="text-base font-medium mb-4 leading-relaxed">
            {currentQuestion.questionText}
          </p>
        )}

        {/* Options */}
        {currentQuestion.options && currentQuestion.options.length > 0 && (
          <div className="space-y-2">
            {currentQuestion.options.map((option, idx) => (
              <div
                key={option.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border transition-colors",
                  showSolution && option.isCorrect 
                    ? "bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-700" 
                    : "bg-background hover:bg-muted/50"
                )}
              >
                {showSolution && option.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                )}
                <span className="text-sm">
                  <span className="font-medium">{String.fromCharCode(65 + idx)}.</span> {option.text}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Numerical Answer */}
        {currentQuestion.type === 'numerical' && (
          <div className={cn(
            "mt-4 p-3 rounded-lg border",
            showSolution ? "bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-700" : "bg-background"
          )}>
            <p className="text-sm text-muted-foreground">Answer:</p>
            <p className={cn(
              "font-mono text-lg font-bold",
              showSolution ? "text-green-700 dark:text-green-400" : "blur-sm select-none"
            )}>
              {currentQuestion.correctAnswer}
            </p>
          </div>
        )}
      </div>

      {/* Solution Toggle */}
      <div className="flex justify-center">
        <Button
          variant={showSolution ? "secondary" : "outline"}
          size="sm"
          onClick={() => setShowSolution(!showSolution)}
        >
          {showSolution ? "Hide Solution" : "Show Solution"}
        </Button>
      </div>

      {/* Solution Content */}
      {showSolution && currentQuestion.solution && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-2">Solution:</p>
          <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed">
            {currentQuestion.solution}
          </p>
        </div>
      )}

      {/* Question Progress Dots */}
      <div className="flex justify-center gap-1.5 pt-2">
        {questionObjects.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentIndex(idx);
              setShowSolution(false);
            }}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              idx === currentIndex 
                ? "w-6 bg-primary" 
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
          />
        ))}
      </div>
    </div>
  );
};

const PreviewContent = ({ block }: { block: LessonPlanBlock }) => {
  // For quiz type, show questions with navigation
  if (block.type === 'quiz' && block.questions && block.questions.length > 0) {
    return <QuizPreviewContent block={block} />;
  }

  // Check both attachmentUrl AND embedUrl for content
  const contentUrl = block.attachmentUrl || block.embedUrl;
  
  if (contentUrl) {
    const url = getEmbedUrl(contentUrl);
    
    // Video content (YouTube, Vimeo, etc.)
    if (block.sourceType === 'video' || 
        url.includes('youtube') || 
        url.includes('youtu.be') || 
        url.includes('vimeo') ||
        url.includes('embed')) {
      return (
        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
          <iframe
            src={url}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title={block.title}
          />
        </div>
      );
    }

    // Animation/Simulation (PhET, Desmos, etc.)
    if (block.sourceType === 'animation' || 
        url.includes('phet') || 
        url.includes('desmos') ||
        url.includes('geogebra')) {
      return (
        <div className="w-full min-h-[60vh] bg-muted rounded-lg overflow-hidden">
          <iframe
            src={url}
            className="w-full h-full min-h-[60vh]"
            allowFullScreen
            title={block.title}
          />
        </div>
      );
    }

    // PDF/Document content
    if (block.sourceType === 'document' || url.endsWith('.pdf')) {
      return (
        <div className="w-full min-h-[60vh] bg-muted rounded-lg overflow-hidden">
          <iframe
            src={url}
            className="w-full h-full min-h-[60vh]"
            title={block.title}
          />
        </div>
      );
    }

    // Image content
    if (block.sourceType === 'image' || /\.(jpg|jpeg|png|gif|webp)$/i.test(url)) {
      return (
        <div className="w-full flex items-center justify-center p-4">
          <img
            src={url}
            alt={block.title}
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
          />
        </div>
      );
    }

    // Presentation content (Google Slides, etc.)
    if (block.sourceType === 'presentation' || 
        url.includes('docs.google.com') ||
        url.includes('slides.google.com')) {
      // Convert Google Slides URL to embed format
      let embedUrl = url;
      if (url.includes('/pub?') === false && url.includes('/embed') === false) {
        embedUrl = url.replace('/edit', '/embed').replace('/view', '/embed');
        if (!embedUrl.includes('/embed')) {
          embedUrl = embedUrl + '/embed';
        }
      }
      return (
        <div className="w-full min-h-[60vh] bg-muted rounded-lg overflow-hidden">
          <iframe
            src={embedUrl}
            className="w-full h-full min-h-[60vh]"
            allowFullScreen
            title={block.title}
          />
        </div>
      );
    }

    // Generic iframe fallback for any other URL
    return (
      <div className="w-full min-h-[60vh] bg-muted rounded-lg overflow-hidden">
        <iframe
          src={url}
          className="w-full h-full min-h-[60vh]"
          allowFullScreen
          title={block.title}
        />
      </div>
    );
  }

  // Fallback - show content text or placeholder
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {getContentIcon(block.sourceType)}
      <p className="mt-4 text-muted-foreground">
        {block.content || 'No preview available for this content'}
      </p>
      {block.sourceType && (
        <p className="mt-2 text-xs text-muted-foreground capitalize">
          Content type: {block.sourceType}
        </p>
      )}
      {(block.embedUrl || block.attachmentUrl) && (
        <p className="mt-2 text-xs text-muted-foreground break-all max-w-md">
          URL: {block.embedUrl || block.attachmentUrl}
        </p>
      )}
    </div>
  );
};

export const ContentPreviewDialog: React.FC<ContentPreviewDialogProps> = ({
  open,
  onOpenChange,
  block,
}) => {
  const isMobile = useIsMobile();

  if (!block) return null;

  const title = block.title || getBlockTypeLabel(block.type);

  // Use Sheet on mobile, Dialog on desktop
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader className="text-left mb-4">
            <SheetTitle className="flex items-center gap-2">
              {getContentIcon(block.sourceType)}
              <span className="truncate">{title}</span>
            </SheetTitle>
          </SheetHeader>
          <PreviewContent block={block} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getContentIcon(block.sourceType)}
            <span className="truncate">{title}</span>
          </DialogTitle>
        </DialogHeader>
        <PreviewContent block={block} />
      </DialogContent>
    </Dialog>
  );
};

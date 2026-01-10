import { useState, useEffect, useCallback, useRef } from "react";
import { 
  X, ChevronLeft, ChevronRight, BookOpen, Play, HelpCircle, 
  ClipboardList, Maximize2, Minimize2, Clock, FileText, Video,
  CheckCircle2, Circle, Maximize, Shrink, Pencil
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { LessonPlanBlock, blockTypeConfig } from "./types";
import { mockQuestions, Question } from "@/data/questionsData";
import { AnnotationCanvas, AnnotationCanvasRef } from "./AnnotationCanvas";

interface PresentationModeProps {
  open: boolean;
  onClose: () => void;
  blocks: LessonPlanBlock[];
  lessonTitle?: string;
}

const blockIcons = {
  explain: BookOpen,
  demonstrate: Play,
  quiz: HelpCircle,
  homework: ClipboardList,
};

// Convert YouTube URL to embed URL
const getEmbedUrl = (url: string): string => {
  if (url.includes('youtube.com/watch')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
  }
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
  }
  return url;
};

// Quiz content renderer for presentation
const QuizPresentationContent = ({ block }: { block: LessonPlanBlock }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  const questionObjects: Question[] = (block.questions || [])
    .map(qId => mockQuestions.find(q => q.id === qId || q.questionId === qId))
    .filter((q): q is Question => q !== undefined);

  if (questionObjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/70">
        <HelpCircle className="w-16 h-16 mb-4" />
        <p className="text-xl">No questions found in this quiz</p>
      </div>
    );
  }

  const currentQuestion = questionObjects[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === questionObjects.length - 1;

  return (
    <div className="flex flex-col h-full p-6 md:p-12">
      {/* Quiz Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-white/10 text-white border-0 text-sm px-3 py-1">
            Question {currentIndex + 1} of {questionObjects.length}
          </Badge>
          <Badge className={cn(
            "text-sm px-3 py-1",
            currentQuestion.difficulty === 'easy' && "bg-green-500/80",
            currentQuestion.difficulty === 'medium' && "bg-amber-500/80",
            currentQuestion.difficulty === 'hard' && "bg-red-500/80",
          )}>
            {currentQuestion.difficulty}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setCurrentIndex(prev => prev - 1); setShowSolution(false); }}
            disabled={isFirst}
            className="text-white hover:bg-white/10 disabled:opacity-30"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setCurrentIndex(prev => prev + 1); setShowSolution(false); }}
            disabled={isLast}
            className="text-white hover:bg-white/10 disabled:opacity-30"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full">
        {/* Assertion-Reasoning format */}
        {currentQuestion.type === 'assertion_reasoning' && currentQuestion.assertion && currentQuestion.reason ? (
          <div className="space-y-4 mb-8">
            <div className="p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <p className="text-sm font-medium text-white/60 mb-2">Assertion (A):</p>
              <p className="text-xl text-white leading-relaxed">{currentQuestion.assertion}</p>
            </div>
            <div className="p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <p className="text-sm font-medium text-white/60 mb-2">Reason (R):</p>
              <p className="text-xl text-white leading-relaxed">{currentQuestion.reason}</p>
            </div>
          </div>
        ) : (
          <p className="text-2xl md:text-3xl text-white font-medium mb-8 leading-relaxed">
            {currentQuestion.questionText}
          </p>
        )}

        {/* Options */}
        {currentQuestion.options && currentQuestion.options.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, idx) => (
              <div
                key={option.id}
                className={cn(
                  "flex items-center gap-4 p-5 rounded-xl transition-all cursor-pointer",
                  showSolution && option.isCorrect 
                    ? "bg-green-500/30 ring-2 ring-green-400" 
                    : "bg-white/10 hover:bg-white/15"
                )}
                onClick={() => setShowSolution(true)}
              >
                {showSolution && option.isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
                ) : (
                  <Circle className="w-6 h-6 text-white/50 flex-shrink-0" />
                )}
                <span className="text-lg text-white">
                  <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span> 
                  {option.text}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Numerical Answer */}
        {currentQuestion.type === 'numerical' && (
          <div 
            className={cn(
              "p-6 rounded-xl cursor-pointer transition-all",
              showSolution ? "bg-green-500/30" : "bg-white/10 hover:bg-white/15"
            )}
            onClick={() => setShowSolution(true)}
          >
            <p className="text-white/60 mb-2">Answer:</p>
            <p className={cn(
              "font-mono text-3xl font-bold text-white",
              !showSolution && "blur-lg select-none"
            )}>
              {currentQuestion.correctAnswer}
            </p>
          </div>
        )}

        {/* Solution */}
        {showSolution && currentQuestion.solution && (
          <div className="mt-6 p-6 bg-blue-500/20 rounded-xl backdrop-blur-sm">
            <p className="text-sm font-medium text-blue-300 mb-2">Solution:</p>
            <p className="text-lg text-white/90 leading-relaxed">
              {currentQuestion.solution}
            </p>
          </div>
        )}
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {questionObjects.map((_, idx) => (
          <button
            key={idx}
            onClick={() => { setCurrentIndex(idx); setShowSolution(false); }}
            className={cn(
              "h-2 rounded-full transition-all",
              idx === currentIndex 
                ? "w-8 bg-white" 
                : "w-2 bg-white/30 hover:bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  );
};

// Content renderer for different block types
const PresentationContentRenderer = ({ block }: { block: LessonPlanBlock }) => {
  // Quiz content
  if (block.type === 'quiz' && block.questions && block.questions.length > 0) {
    return <QuizPresentationContent block={block} />;
  }

  const contentUrl = block.attachmentUrl || block.embedUrl;
  
  if (contentUrl) {
    const url = getEmbedUrl(contentUrl);
    
    // Video content
    if (block.sourceType === 'video' || 
        url.includes('youtube') || 
        url.includes('youtu.be') || 
        url.includes('vimeo')) {
      return (
        <div className="w-full h-full flex items-center justify-center p-6">
          <div className="w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              src={url}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              title={block.title}
            />
          </div>
        </div>
      );
    }

    // Animation/Simulation
    if (block.sourceType === 'animation' || 
        url.includes('phet') || 
        url.includes('desmos') ||
        url.includes('geogebra')) {
      return (
        <div className="w-full h-full p-6">
          <div className="w-full h-full bg-white rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              src={url}
              className="w-full h-full"
              allowFullScreen
              title={block.title}
            />
          </div>
        </div>
      );
    }

    // PDF/Document
    if (block.sourceType === 'pdf' || block.sourceType === 'document' || url.endsWith('.pdf')) {
      return (
        <div className="w-full h-full p-6">
          <div className="w-full h-full bg-white rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              src={url}
              className="w-full h-full"
              title={block.title}
            />
          </div>
        </div>
      );
    }

    // Presentation (Google Slides)
    if (block.sourceType === 'ppt' ||
        block.sourceType === 'presentation' || 
        url.includes('docs.google.com') ||
        url.includes('slides.google.com')) {
      let embedUrl = url;
      if (!url.includes('/pub?') && !url.includes('/embed')) {
        embedUrl = url.replace('/edit', '/embed').replace('/view', '/embed');
        if (!embedUrl.includes('/embed')) {
          embedUrl = embedUrl + '/embed';
        }
      }
      return (
        <div className="w-full h-full p-6">
          <div className="w-full h-full bg-white rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allowFullScreen
              title={block.title}
            />
          </div>
        </div>
      );
    }

    // Generic iframe fallback
    return (
      <div className="w-full h-full p-6">
        <div className="w-full h-full bg-white rounded-2xl overflow-hidden shadow-2xl">
          <iframe
            src={url}
            className="w-full h-full"
            allowFullScreen
            title={block.title}
          />
        </div>
      </div>
    );
  }

  // Homework / Text content fallback
  return (
    <div className="flex flex-col items-center justify-center h-full p-12 text-center">
      <div className="max-w-3xl">
        {block.type === 'homework' && (
          <ClipboardList className="w-20 h-20 text-white/30 mx-auto mb-6" />
        )}
        {block.type === 'explain' && !contentUrl && (
          <BookOpen className="w-20 h-20 text-white/30 mx-auto mb-6" />
        )}
        {block.type === 'demonstrate' && !contentUrl && (
          <Play className="w-20 h-20 text-white/30 mx-auto mb-6" />
        )}
        <h2 className="text-3xl font-bold text-white mb-6">{block.title}</h2>
        {block.content && (
          <p className="text-xl text-white/80 leading-relaxed whitespace-pre-wrap">
            {block.content}
          </p>
        )}
      </div>
    </div>
  );
};

export const PresentationMode = ({ 
  open, 
  onClose, 
  blocks,
  lessonTitle 
}: PresentationModeProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAnnotation, setShowAnnotation] = useState(false);
  
  // Touch swipe state
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const annotationRef = useRef<AnnotationCanvasRef>(null);

  const currentBlock = blocks[currentIndex];
  const progress = blocks.length > 0 ? ((currentIndex + 1) / blocks.length) * 100 : 0;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === blocks.length - 1;

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          if (!isLast) navigateTo(currentIndex + 1);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (!isFirst) navigateTo(currentIndex - 1);
          break;
        case 'Escape':
          e.preventDefault();
          if (isFullscreen) {
            exitFullscreen();
          } else {
            onClose();
          }
          break;
        case 't':
        case 'T':
          if (!showAnnotation) setShowTimeline(prev => !prev);
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'a':
        case 'A':
          setShowAnnotation(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, currentIndex, isFirst, isLast, onClose]);

  // Reset on open
  useEffect(() => {
    if (open) {
      setCurrentIndex(0);
      setShowTimeline(false);
      setShowAnnotation(false);
    }
  }, [open]);

  // Clear annotations when changing blocks
  useEffect(() => {
    if (annotationRef.current) {
      annotationRef.current.clear();
    }
  }, [currentIndex]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Exit fullscreen when closing presentation
  useEffect(() => {
    if (!open && isFullscreen) {
      exitFullscreen();
    }
  }, [open, isFullscreen]);

  const enterFullscreen = useCallback(async () => {
    try {
      if (containerRef.current) {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          await (containerRef.current as any).webkitRequestFullscreen();
        }
      }
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if ((document as any).webkitFullscreenElement) {
        await (document as any).webkitExitFullscreen();
      }
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  const navigateTo = useCallback((index: number) => {
    if (index < 0 || index >= blocks.length || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 200);
  }, [blocks.length, isTransitioning]);

  // Touch swipe handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Don't capture touch events on interactive elements (iframes, buttons, etc.)
    const target = e.target as HTMLElement;
    if (target.tagName === 'IFRAME' || target.tagName === 'BUTTON' || target.closest('button')) {
      return;
    }
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;
    
    // Reset touch state
    touchStartX.current = null;
    touchStartY.current = null;
    
    // Minimum swipe distance (50px) and ensure horizontal swipe is dominant
    const minSwipeDistance = 50;
    if (Math.abs(deltaX) < minSwipeDistance || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }
    
    if (deltaX > 0 && !isFirst) {
      // Swipe right -> go to previous
      navigateTo(currentIndex - 1);
    } else if (deltaX < 0 && !isLast) {
      // Swipe left -> go to next
      navigateTo(currentIndex + 1);
    }
  }, [currentIndex, isFirst, isLast, navigateTo]);

  if (!open || blocks.length === 0) return null;

  const BlockIcon = blockIcons[currentBlock.type];
  const config = blockTypeConfig[currentBlock.type];

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main Content Area */}
      <div 
        ref={contentContainerRef}
        className={cn(
          "absolute inset-0 bottom-20 transition-opacity duration-200",
          isTransitioning ? "opacity-0" : "opacity-100"
        )}
      >
        <PresentationContentRenderer block={currentBlock} />
      </div>

      {/* Annotation Canvas Overlay */}
      <AnnotationCanvas 
        ref={annotationRef}
        isActive={showAnnotation} 
        onClose={() => setShowAnnotation(false)}
        blockTitle={currentBlock.title}
        presentationContainerRef={contentContainerRef}
      />

      {/* Timeline Sidebar */}
      {showTimeline && (
        <div className="absolute right-0 top-0 bottom-20 w-80 bg-black/50 backdrop-blur-xl border-l border-white/10">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-white font-semibold">Lesson Timeline</h3>
            <p className="text-white/60 text-sm">{lessonTitle}</p>
          </div>
          <ScrollArea className="h-[calc(100%-80px)]">
            <div className="p-2">
              {blocks.map((block, idx) => {
                const Icon = blockIcons[block.type];
                const cfg = blockTypeConfig[block.type];
                return (
                  <button
                    key={block.id}
                    onClick={() => navigateTo(idx)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all",
                      idx === currentIndex 
                        ? "bg-white/20 text-white" 
                        : "text-white/60 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", cfg.color)}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{block.title || "Untitled"}</p>
                      <p className="text-xs opacity-60">{cfg.label}</p>
                    </div>
                    {block.duration && (
                      <span className="text-xs opacity-60">{block.duration}m</span>
                    )}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-black/60 backdrop-blur-xl border-t border-white/10">
        <div className="h-full max-w-5xl mx-auto px-4 flex items-center justify-between gap-4">
          {/* Left - Previous Button */}
          <Button
            variant="ghost"
            size="lg"
            onClick={() => navigateTo(currentIndex - 1)}
            disabled={isFirst}
            className="h-12 px-6 gap-2 text-white hover:bg-white/10 disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          {/* Center - Progress & Block Info */}
          <div className="flex-1 flex flex-col items-center justify-center gap-2 min-w-0">
            {/* Block Type Badge & Title */}
            <div className="flex items-center gap-2">
              <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", config.color)}>
                <BlockIcon className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-white text-sm font-medium truncate max-w-[200px] sm:max-w-[300px]">
                {currentBlock.title || "Untitled"}
              </span>
              {currentBlock.duration && (
                <Badge variant="outline" className="text-white/70 border-white/20 text-xs gap-1">
                  <Clock className="w-3 h-3" />
                  {currentBlock.duration}m
                </Badge>
              )}
            </div>
            
            {/* Progress Dots */}
            <div className="flex items-center gap-1.5">
              {blocks.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => navigateTo(idx)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    idx === currentIndex 
                      ? "w-6 bg-white" 
                      : idx < currentIndex
                      ? "w-1.5 bg-white/50"
                      : "w-1.5 bg-white/20 hover:bg-white/40"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Right - Next Button & Exit */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigateTo(currentIndex + 1)}
              disabled={isLast}
              className="h-12 px-6 gap-2 text-white hover:bg-white/10 disabled:opacity-30"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-5 h-5" />
            </Button>
            
            {/* Annotation Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAnnotation(!showAnnotation)}
              className={cn(
                "h-10 w-10 hover:bg-white/10",
                showAnnotation 
                  ? "text-primary bg-white/10" 
                  : "text-white/70 hover:text-white"
              )}
              title="Annotate (A)"
            >
              <Pencil className="w-5 h-5" />
            </Button>
            
            {/* Fullscreen Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="h-10 w-10 text-white/70 hover:bg-white/10 hover:text-white"
              title={isFullscreen ? "Exit Fullscreen (F)" : "Fullscreen (F)"}
            >
              {isFullscreen ? <Shrink className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </Button>
            
            {/* Timeline Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowTimeline(!showTimeline)}
              className="h-10 w-10 text-white/70 hover:bg-white/10 hover:text-white hidden md:flex"
              title="Toggle Timeline (T)"
            >
              {showTimeline ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </Button>

            {/* Exit Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-10 w-10 text-white/70 hover:bg-red-500/20 hover:text-red-400"
              title="Exit (Esc)"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Keyboard Hints (hidden on mobile, hidden when annotating) */}
      {!showAnnotation && (
        <div className="absolute top-4 right-4 hidden lg:flex items-center gap-3 text-white/40 text-xs">
          <span>← → Navigate</span>
          <span>A Annotate</span>
          <span>F Fullscreen</span>
          <span>T Timeline</span>
          <span>Esc Exit</span>
        </div>
      )}
    </div>
  );
};

// Content Viewer Page - Full-screen content viewing experience with subject branding and swipe navigation

import { useState, useCallback } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { studentSubjects } from "@/data/student/subjects";
import { getChaptersBySubject } from "@/data/student/chapters";
import {
  getLessonBundleById,
  getContentByBundle,
} from "@/data/student/lessonBundles";
import {
  VideoPlayer,
  PDFViewer,
  QuizViewer,
  SimulationViewer,
} from "@/components/student/content-viewer";
import SubjectBackgroundPattern from "@/components/student/subjects/SubjectBackgroundPattern";
import { getSubjectColors, getSubjectIcon, getSubjectPattern } from "@/components/student/shared/subjectColors";

// Swipe threshold for navigation
const SWIPE_THRESHOLD = 50;
const SWIPE_VELOCITY_THRESHOLD = 500;

// Haptic feedback utility
const triggerHaptic = (type: "light" | "medium" | "heavy" = "light") => {
  // Use Vibration API if available
  if ("vibrate" in navigator) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 30,
    };
    navigator.vibrate(patterns[type]);
  }
};

const StudentContentViewer = () => {
  const navigate = useNavigate();
  const { subjectId, chapterId, bundleId, contentId } = useParams<{
    subjectId: string;
    chapterId: string;
    bundleId: string;
    contentId: string;
  }>();

  // Swipe animation state
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);

  // Find subject
  const subject = studentSubjects.find((s) => s.id === subjectId);
  if (!subject) {
    return <Navigate to="/student/subjects" replace />;
  }

  // Find chapter
  const chapters = getChaptersBySubject(subjectId!);
  const chapter = chapters.find((c) => c.id === chapterId);
  if (!chapter) {
    return <Navigate to={`/student/subjects/${subjectId}`} replace />;
  }

  // Find bundle
  const bundle = getLessonBundleById(bundleId!);
  if (!bundle) {
    return <Navigate to={`/student/subjects/${subjectId}/${chapterId}`} replace />;
  }

  // Find content item
  const contentItems = getContentByBundle(bundleId!);
  const content = contentItems.find((c) => c.id === contentId);
  if (!content) {
    return <Navigate to={`/student/subjects/${subjectId}/${chapterId}/${bundleId}`} replace />;
  }

  // Get subject-specific styling
  const colors = getSubjectColors(subject.color);
  const Icon = getSubjectIcon(subject.icon);
  const pattern = getSubjectPattern(subject.id);

  const currentIndex = contentItems.findIndex((c) => c.id === contentId);
  const hasNext = currentIndex < contentItems.length - 1;
  const hasPrev = currentIndex > 0;

  const handleBack = () => {
    navigate(`/student/subjects/${subjectId}/${chapterId}/${bundleId}`);
  };

  const handleNext = useCallback(() => {
    if (hasNext) {
      triggerHaptic("light");
      setSwipeDirection("left");
      const nextContent = contentItems[currentIndex + 1];
      navigate(`/student/subjects/${subjectId}/${chapterId}/${bundleId}/${nextContent.id}`);
    }
  }, [hasNext, contentItems, currentIndex, navigate, subjectId, chapterId, bundleId]);

  const handlePrev = useCallback(() => {
    if (hasPrev) {
      triggerHaptic("light");
      setSwipeDirection("right");
      const prevContent = contentItems[currentIndex - 1];
      navigate(`/student/subjects/${subjectId}/${chapterId}/${bundleId}/${prevContent.id}`);
    }
  }, [hasPrev, contentItems, currentIndex, navigate, subjectId, chapterId, bundleId]);

  const handleComplete = () => {
    console.log("Content completed:", contentId);
  };

  // Handle swipe gesture
  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    
    // Check if swipe meets threshold (distance or velocity)
    const swipedLeft = offset.x < -SWIPE_THRESHOLD || velocity.x < -SWIPE_VELOCITY_THRESHOLD;
    const swipedRight = offset.x > SWIPE_THRESHOLD || velocity.x > SWIPE_VELOCITY_THRESHOLD;

    if (swipedLeft && hasNext) {
      handleNext();
    } else if (swipedRight && hasPrev) {
      handlePrev();
    }
  }, [hasNext, hasPrev, handleNext, handlePrev]);

  // Render appropriate viewer based on content type
  const renderViewer = () => {
    switch (content.type) {
      case "video":
        return <VideoPlayer content={content} onComplete={handleComplete} />;
      case "pdf":
      case "document":
        return <PDFViewer content={content} onComplete={handleComplete} />;
      case "quiz":
        return <QuizViewer content={content} onComplete={handleComplete} />;
      case "simulation":
        return <SimulationViewer content={content} onComplete={handleComplete} />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center bg-slate-100">
            <p className="text-muted-foreground">Unsupported content type</p>
          </div>
        );
    }
  };

  // Animation variants for swipe transitions
  const contentVariants = {
    initial: (direction: "left" | "right" | null) => ({
      x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 300, damping: 30 },
    },
    exit: (direction: "left" | "right" | null) => ({
      x: direction === "left" ? -100 : direction === "right" ? 100 : 0,
      opacity: 0,
      transition: { duration: 0.2 },
    }),
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-background overflow-hidden">
      {/* Header with subject branding - compact for mobile */}
      <header className={cn(
        "relative overflow-hidden flex-shrink-0",
        "bg-gradient-to-br backdrop-blur-xl border-b",
        colors.gradient,
        colors.border,
        "safe-area-inset-top"
      )}>
        {/* Background Pattern - subtle */}
        <SubjectBackgroundPattern 
          pattern={pattern} 
          className={cn(colors.patternColor, "opacity-30")}
        />

        {/* Header content - compact */}
        <div className="relative z-10 flex items-center justify-between px-2 py-2 md:px-4 md:py-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="flex-shrink-0 h-8 w-8"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex-1 min-w-0">
              <h1 className="font-semibold text-foreground truncate text-sm">
                {content.title}
              </h1>
              <p className={cn("text-xs truncate", colors.textAccent)}>
                {bundle.title} • {currentIndex + 1}/{contentItems.length}
              </p>
            </div>
          </div>

          {/* Right side: Completion badge + Subject icon */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {content.isCompleted && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-100 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-green-600" />
                <span className="text-[10px] font-medium text-green-700 hidden sm:inline">Done</span>
              </div>
            )}

            {/* Subject icon */}
            <div className={cn(
              "flex w-7 h-7 rounded-lg items-center justify-center",
              colors.iconBg
            )}>
              <Icon className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
        </div>
      </header>

      {/* Swipeable Content Area */}
      <motion.main 
        className="flex-1 overflow-hidden relative touch-pan-y"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        whileDrag={{ cursor: "grabbing" }}
      >
        <AnimatePresence mode="wait" custom={swipeDirection}>
          <motion.div
            key={contentId}
            custom={swipeDirection}
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full w-full"
          >
            {renderViewer()}
          </motion.div>
        </AnimatePresence>
        
        {/* Swipe indicators */}
        <div className="absolute inset-y-0 left-0 w-8 pointer-events-none flex items-center justify-start pl-1 opacity-0 transition-opacity lg:hidden"
             style={{ opacity: hasPrev ? 0.3 : 0 }}>
          <div className="w-1 h-12 bg-black/20 rounded-full" />
        </div>
        <div className="absolute inset-y-0 right-0 w-8 pointer-events-none flex items-center justify-end pr-1 opacity-0 transition-opacity lg:hidden"
             style={{ opacity: hasNext ? 0.3 : 0 }}>
          <div className="w-1 h-12 bg-black/20 rounded-full" />
        </div>
      </motion.main>

      {/* Navigation footer (for non-quiz content) - mobile optimized */}
      {content.type !== "quiz" && (
        <footer className={cn(
          "flex items-center justify-between gap-3 px-3 py-2.5 md:px-4 md:py-3",
          "bg-white/90 backdrop-blur-xl border-t border-slate-100",
          "safe-area-inset-bottom flex-shrink-0"
        )}>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={!hasPrev}
            className="flex-1 max-w-[120px] h-9"
          >
            Previous
          </Button>
          
          <div className="flex flex-col items-center">
            <span className="text-xs text-muted-foreground font-medium">
              {currentIndex + 1} / {contentItems.length}
            </span>
            <span className="text-[10px] text-muted-foreground/60 lg:hidden">
              Swipe to navigate
            </span>
          </div>

          <Button
            size="sm"
            onClick={handleNext}
            disabled={!hasNext}
            className="flex-1 max-w-[120px] h-9"
          >
            Next
          </Button>
        </footer>
      )}
    </div>
  );
};

export default StudentContentViewer;

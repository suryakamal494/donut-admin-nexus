// Content Viewer Page - Full-screen content viewing experience with subject branding

import { useParams, useNavigate, Navigate } from "react-router-dom";
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

const StudentContentViewer = () => {
  const navigate = useNavigate();
  const { subjectId, chapterId, bundleId, contentId } = useParams<{
    subjectId: string;
    chapterId: string;
    bundleId: string;
    contentId: string;
  }>();

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

  const handleNext = () => {
    if (hasNext) {
      const nextContent = contentItems[currentIndex + 1];
      navigate(`/student/subjects/${subjectId}/${chapterId}/${bundleId}/${nextContent.id}`);
    }
  };

  const handlePrev = () => {
    if (hasPrev) {
      const prevContent = contentItems[currentIndex - 1];
      navigate(`/student/subjects/${subjectId}/${chapterId}/${bundleId}/${prevContent.id}`);
    }
  };

  const handleComplete = () => {
    // Mark as complete logic would go here
    console.log("Content completed:", contentId);
  };

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

  return (
    <div className="h-[100dvh] flex flex-col bg-background">
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

      {/* Content Viewer - takes remaining space */}
      <main className="flex-1 overflow-hidden">
        {renderViewer()}
      </main>

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
          
          <span className="text-xs text-muted-foreground font-medium">
            {currentIndex + 1} / {contentItems.length}
          </span>

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

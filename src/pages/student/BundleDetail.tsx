// Lesson Bundle Detail Page - View all content in a lesson bundle

import { useState, useCallback, useMemo } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { studentSubjects } from "@/data/student/subjects";
import { getChaptersBySubject } from "@/data/student/chapters";
import {
  getLessonBundleById,
  getContentByBundle,
  getScreenshotsByBundle,
  type TeacherScreenshot,
  type BundleContentItem,
} from "@/data/student/lessonBundles";
import { BundleHeader } from "@/components/student/chapter/BundleHeader";
import { ContentItemCard } from "@/components/student/chapter/ContentItemCard";
import { ScreenshotGallery } from "@/components/student/chapter/ScreenshotGallery";
import { ScreenshotViewer } from "@/components/student/chapter/screenshot-viewer";
import { VirtualizedList } from "@/components/student/chapter/VirtualizedList";

const StudentBundleDetail = () => {
  const navigate = useNavigate();
  const { subjectId, chapterId, bundleId } = useParams<{
    subjectId: string;
    chapterId: string;
    bundleId: string;
  }>();

  const [screenshotViewerOpen, setScreenshotViewerOpen] = useState(false);
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState(0);

  // Memoize data lookups
  const subject = useMemo(
    () => studentSubjects.find((s) => s.id === subjectId),
    [subjectId]
  );

  const chapter = useMemo(() => {
    if (!subjectId) return undefined;
    const chapters = getChaptersBySubject(subjectId);
    return chapters.find((c) => c.id === chapterId);
  }, [subjectId, chapterId]);

  const bundle = useMemo(
    () => (bundleId ? getLessonBundleById(bundleId) : undefined),
    [bundleId]
  );

  const contentItems = useMemo(
    () => (bundleId ? getContentByBundle(bundleId) : []),
    [bundleId]
  );

  const screenshots = useMemo(
    () => (bundleId ? getScreenshotsByBundle(bundleId) : []),
    [bundleId]
  );

  // Memoize handlers
  const handleBack = useCallback(() => {
    navigate(`/student/subjects/${subjectId}/${chapterId}`);
  }, [navigate, subjectId, chapterId]);

  const handleContentClick = useCallback((contentId: string) => {
    navigate(`/student/subjects/${subjectId}/${chapterId}/${bundleId}/${contentId}`);
  }, [navigate, subjectId, chapterId, bundleId]);

  const handleScreenshotClick = useCallback((screenshot: TeacherScreenshot) => {
    const index = screenshots.findIndex(s => s.id === screenshot.id);
    setSelectedScreenshotIndex(index >= 0 ? index : 0);
    setScreenshotViewerOpen(true);
  }, [screenshots]);

  const handleCloseViewer = useCallback(() => {
    setScreenshotViewerOpen(false);
  }, []);

  // Render function for content items
  const renderContentItem = useCallback((item: BundleContentItem) => (
    <ContentItemCard
      item={item}
      onClick={() => handleContentClick(item.id)}
    />
  ), [handleContentClick]);

  const getContentKey = useCallback((item: BundleContentItem) => item.id, []);

  // Early returns for missing data
  if (!subject) {
    return <Navigate to="/student/subjects" replace />;
  }

  if (!chapter) {
    return <Navigate to={`/student/subjects/${subjectId}`} replace />;
  }

  if (!bundle) {
    return <Navigate to={`/student/subjects/${subjectId}/${chapterId}`} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-3xl mx-auto px-4 py-4 lg:py-6 space-y-6">
        {/* Bundle Header with Subject Branding */}
        <BundleHeader
          bundle={bundle}
          contentItems={contentItems}
          subject={subject}
          chapterName={chapter.name}
          onBack={handleBack}
        />

        {/* Teacher Screenshots (if any) */}
        {screenshots.length > 0 && (
          <ScreenshotGallery
            screenshots={screenshots}
            onScreenshotClick={handleScreenshotClick}
          />
        )}

        {/* Screenshot Viewer Modal */}
        <ScreenshotViewer
          screenshots={screenshots}
          initialIndex={selectedScreenshotIndex}
          open={screenshotViewerOpen}
          onClose={handleCloseViewer}
        />

        {/* Content Items */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <BookOpen className={cn(
              "w-4 h-4",
              subject.color === "blue" ? "text-blue-600" :
              subject.color === "purple" ? "text-purple-600" :
              subject.color === "green" ? "text-emerald-600" :
              subject.color === "red" ? "text-rose-600" :
              subject.color === "amber" ? "text-amber-600" : "text-cyan-600"
            )} />
            <h2 className="text-sm font-semibold text-foreground">LESSON CONTENT</h2>
            <span className="text-xs text-muted-foreground">
              ({contentItems.length} items)
            </span>
          </div>

          {contentItems.length > 0 ? (
            <VirtualizedList
              items={contentItems}
              renderItem={renderContentItem}
              getItemKey={getContentKey}
              estimatedItemHeight={80}
              gap={8}
            />
          ) : (
            <div className={cn(
              "bg-white/50 backdrop-blur-xl rounded-2xl border border-white/50",
              "p-6 text-center"
            )}>
              <BookOpen className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No content items in this lesson bundle
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default StudentBundleDetail;

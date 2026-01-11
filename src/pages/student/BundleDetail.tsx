// Lesson Bundle Detail Page - View all content in a lesson bundle

import { useParams, useNavigate, Navigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { studentSubjects } from "@/data/student/subjects";
import { getChaptersBySubject } from "@/data/student/chapters";
import {
  getLessonBundleById,
  getContentByBundle,
  getScreenshotsByBundle,
} from "@/data/student/lessonBundles";
import { BundleHeader } from "@/components/student/chapter/BundleHeader";
import { ContentItemCard } from "@/components/student/chapter/ContentItemCard";
import { ScreenshotGallery } from "@/components/student/chapter/ScreenshotGallery";

const StudentBundleDetail = () => {
  const navigate = useNavigate();
  const { subjectId, chapterId, bundleId } = useParams<{
    subjectId: string;
    chapterId: string;
    bundleId: string;
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

  // Get bundle content and screenshots
  const contentItems = getContentByBundle(bundleId!);
  const screenshots = getScreenshotsByBundle(bundleId!);

  const handleBack = () => {
    navigate(`/student/subjects/${subjectId}/${chapterId}`);
  };

  const handleContentClick = (contentId: string) => {
    // For now, just log - will implement content viewer later
    console.log("Open content:", contentId);
  };

  const handleScreenshotClick = (screenshotId: string) => {
    // For now, just log - will implement screenshot viewer later
    console.log("Open screenshot:", screenshotId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-3xl mx-auto px-4 py-4 lg:py-6 space-y-6">
        {/* Bundle Header */}
        <BundleHeader
          bundle={bundle}
          contentItems={contentItems}
          subjectName={subject.name}
          chapterName={chapter.name}
          onBack={handleBack}
        />

        {/* Teacher Screenshots (if any) */}
        {screenshots.length > 0 && (
          <ScreenshotGallery
            screenshots={screenshots}
            onScreenshotClick={(s) => handleScreenshotClick(s.id)}
          />
        )}

        {/* Content Items */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <BookOpen className="w-4 h-4 text-cyan-600" />
            <h2 className="text-sm font-semibold text-foreground">LESSON CONTENT</h2>
            <span className="text-xs text-muted-foreground">
              ({contentItems.length} items)
            </span>
          </div>

          {contentItems.length > 0 ? (
            <div className="space-y-2">
              {contentItems.map((item) => (
                <ContentItemCard
                  key={item.id}
                  item={item}
                  onClick={() => handleContentClick(item.id)}
                />
              ))}
            </div>
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
